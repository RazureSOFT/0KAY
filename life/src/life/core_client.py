import asyncio
import os
import sys
import time
import json
import threading
from typing import Optional

import grpc

from .logging_setup import get_logger

log = get_logger("core_client")

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', '..', 'gen', 'python'))

from core.v1 import core_pb2, core_pb2_grpc
from plugin.v1 import plugin_pb2


def _manifest_version(fallback: str = "0.1.2") -> str:
    try:
        manifest = os.path.join(os.path.dirname(__file__), '..', '..', 'manifest.json')
        with open(manifest, encoding="utf-8") as handle:
            return json.load(handle).get("version") or fallback
    except (OSError, ValueError):
        return fallback


def _manifest_permissions():
    try:
        manifest = os.path.join(os.path.dirname(__file__), '..', '..', 'manifest.json')
        with open(manifest, encoding="utf-8") as handle:
            perms = json.load(handle).get("permissions") or {}
    except (OSError, ValueError):
        return None
    api = perms.get("api") or {}
    requires = api.get("requires") or []
    exposes = api.get("exposes") or []
    egress = perms.get("egress") or []
    if not (requires or exposes or egress):
        return None
    return plugin_pb2.PluginPermission(
        api_requires=requires, api_exposes=exposes, egress=egress
    )


class CoreClient:

    def __init__(
        self,
        address: str = None,
        life_address: str = None,
    ):
        self.address = address or os.environ.get("CORE_ADDRESS", "localhost:50051")
        self.life_address = life_address or os.environ.get(
            "LIFE_ADDRESS", "localhost:50053"
        )
        self._channel: Optional[grpc.Channel] = None
        self._plugin_stub: Optional[core_pb2_grpc.PluginServiceStub] = None
        self._core_stub: Optional[core_pb2_grpc.CoreServiceStub] = None
        self.plugin_id: Optional[str] = None
        self._connected = False
        self._lock = threading.RLock()
        self.registration_blocked = False
        self.registration_error = ""
        self.registration_failures = 0
        self._register_blocked_at = 0.0

    def _connect_once(self) -> None:
        with self._lock:
            self._channel = grpc.insecure_channel(self.address)
            grpc.channel_ready_future(self._channel).result(timeout=3)
            self._plugin_stub = core_pb2_grpc.PluginServiceStub(self._channel)
            self._core_stub = core_pb2_grpc.CoreServiceStub(self._channel)
            self._connected = True

    def _close_channel(self) -> None:
        with self._lock:
            if self._channel is not None:
                try:
                    self._channel.close()
                except Exception:  # pragma: no cover - best-effort cleanup
                    pass
                self._channel = None

    def connect(self, attempts: int = 3) -> bool:
        attempts = max(1, int(attempts))
        last_error: Optional[Exception] = None
        for attempt in range(1, attempts + 1):
            try:
                self._connect_once()
                return True
            except Exception as e:
                last_error = e
                log.warning("Core connect attempt %d/%d to %s failed: %s", attempt, attempts, self.address, e)
                self._close_channel()
                if attempt < attempts:
                    time.sleep(min(0.5 * (2 ** (attempt - 1)), 2.0))
        with self._lock:
            self._connected = False
        log.error("Failed to connect to Core at %s: %s", self.address, last_error)
        return False

    async def connect_async(self, attempts: int = 3) -> bool:
        attempts = max(1, int(attempts))
        last_error: Optional[Exception] = None
        for attempt in range(1, attempts + 1):
            try:
                await asyncio.to_thread(self._connect_once)
                return True
            except Exception as e:
                last_error = e
                log.warning("Core connect attempt %d/%d to %s failed: %s", attempt, attempts, self.address, e)
                self._close_channel()
                if attempt < attempts:
                    await asyncio.sleep(min(0.5 * (2 ** (attempt - 1)), 2.0))
        with self._lock:
            self._connected = False
        log.error("Failed to connect to Core at %s: %s", self.address, last_error)
        return False

    def close(self):
        with self._lock:
            if self._channel:
                self._channel.close()
                self._channel = None
                self._connected = False

    @property
    def connected(self) -> bool:
        return self._connected

    @staticmethod
    def _outgoing_metadata():
        from .identity import get_identity
        name, service_token = get_identity()
        shared = (os.getenv("CORE_PAIR_TOKEN") or os.getenv("CORE_API_TOKEN") or "").strip()
        pairs = []
        token = shared or (service_token or "").strip()
        if token:
            pairs.append(("authorization", f"Bearer {token}"))
        if name:
            pairs.append(("x-0kay-plugin", name))
        return tuple(pairs) or None

    _AUTH_ERROR_MARKERS = ("permission_denied", "enrollment key", "unauthenticated")
    REGISTER_AUTH_BACKOFF_SECONDS = 300.0

    @classmethod
    def _is_auth_error(cls, error: object) -> bool:
        text = str(error).lower()
        return any(marker in text for marker in cls._AUTH_ERROR_MARKERS)

    def _mark_registration_blocked(self, message: str) -> None:
        with self._lock:
            if not self.registration_blocked:
                log.error(
                    "Core rejected plugin registration as unauthenticated (%s). "
                    "Set CORE_PLUGIN_REGISTRATION_TOKEN to a valid enrollment key; "
                    "pausing retries for %.0fs.",
                    message,
                    self.REGISTER_AUTH_BACKOFF_SECONDS,
                )
            self.registration_blocked = True
            self.registration_error = message
            self._register_blocked_at = time.monotonic()
            self.plugin_id = None

    def registration_health(self) -> dict:
        return {
            "registered": self.plugin_id is not None,
            "blocked": self.registration_blocked,
            "failures": self.registration_failures,
            "error": self.registration_error,
        }

    def register(self) -> bool:
        if self.registration_blocked:
            if time.monotonic() - self._register_blocked_at < self.REGISTER_AUTH_BACKOFF_SECONDS:
                return False
        if not self._connected and not self.connect():
            return False

        try:
            from plugin.v1 import plugin_pb2 as _pb
            info = plugin_pb2.PluginInfo(
                name="life",
                version=_manifest_version(),
                description="L.I.F.E - Persona engine (THINK/OUTPUT)",
                author="0kay",
                plugin_type=plugin_pb2.PLUGIN_TYPE_PERSONA,
            )
            permissions = _manifest_permissions()
            if permissions is not None:
                info.permissions.CopyFrom(permissions)
            request = core_pb2.RegisterRequest(
                plugin_info=info,
                capabilities=["life", "requires:mocr"],
                address=self.life_address,
            )
            if hasattr(request, "settings_sections"):
                sec = _pb.SettingsSection(
                    id="life",
                    label="L.I.F.E",
                    icon="lock",
                    order=60,
                    description="L.I.F.E 人设插件权限（默认全部关闭）",
                    fields=[
                        _pb.SettingsField(
                            key="think_model",
                            type="select",
                            label="THINK 模型",
                            default_value="",
                            help="用于内部思考、工具规划与记忆决策；选项来自 mocr 当前模型目录",
                        ),
                        _pb.SettingsField(
                            key="output_model",
                            type="select",
                            label="OUTPUT 模型",
                            default_value="",
                            help="用于人格化回复与任务完成通知；选项来自 mocr 当前模型目录",
                        ),
                        _pb.SettingsField(
                            key="screen_watch",
                            type="bool",
                            label="屏幕监听",
                            default_value="false",
                            help="允许 L.I.F.E 观察屏幕内容",
                        ),
                        _pb.SettingsField(
                            key="computer_use",
                            type="bool",
                            label="计算机操作",
                            default_value="false",
                            help="允许执行 shell / 计算机操作",
                        ),
                        _pb.SettingsField(
                            key="report_agent_host",
                            type="text",
                            label="上报 Agent 主机信息",
                            default_value="",
                            help="心跳中附带主机名、CPU、内存等信息",
                        ),
                        _pb.SettingsField(
                            key="mail_require_approval",
                            type="bool",
                            label="邮件操作需弹窗确认",
                            default_value="true",
                            help="开启后，L.I.F.E 读取或发送邮件前会先在 WebUI 弹窗询问是否允许（默认开启）",
                        ),
                        _pb.SettingsField(
                            key="mail_auto_approve_all",
                            type="bool",
                            label="全部自动审批（所有权限直接通过）",
                            default_value="false",
                            help="开启后所有需要确认的权限直接通过、不再弹窗，优先于逐项确认设置",
                        ),
                        _pb.SettingsField(
                            key="mcp_enabled",
                            type="bool",
                            label="MCP 调用",
                            default_value="true",
                            help="允许 THINK 调用 Agent 主机上的 0kay-mcp",
                        ),
                        _pb.SettingsField(
                            key="onebot_enabled",
                            type="bool",
                            label="消息平台适配器总开关",
                            default_value="false",
                            help="总开关；具体机器人在「消息平台」面板中添加（L.I.F.E 作为反向 WebSocket 服务端）",
                        ),
                        _pb.SettingsField(
                            key="onebot_reverse_host",
                            type="text",
                            label="反向 WebSocket 默认主机",
                            default_value="127.0.0.1",
                            help="新增机器人时的默认监听地址；0.0.0.0 表示接受任意来源（请务必设置 Token）",
                        ),
                        _pb.SettingsField(
                            key="onebot_reverse_port",
                            type="number",
                            label="反向 WebSocket 默认端口",
                            default_value="6199",
                            help="新增机器人时的默认监听端口，多个机器人会自动顺延",
                        ),
                        _pb.SettingsField(
                            key="onebot_trigger_keywords",
                            type="text",
                            label="OneBot 触发关键词",
                            default_value="",
                            help="逗号分隔；群聊仅命中关键词或 @Bot 时回复，留空则回复所有消息",
                        ),
                        _pb.SettingsField(
                            key="onebot_observe_group",
                            type="bool",
                            label="OneBot 群聊观察",
                            default_value="true",
                            help="未触发回复时也记录有限的群聊话题和成员活跃度",
                        ),
                        _pb.SettingsField(
                            key="proactive_daily_limit",
                            type="number",
                            label="每日主动消息上限",
                            default_value="3",
                            help="L.I.F.E 主动私聊/群消息总额度，默认 3",
                        ),
                        _pb.SettingsField(
                            key="proactive_target_limit",
                            type="number",
                            label="单目标每日上限",
                            default_value="1",
                            help="同一用户或群组每天最多主动发送次数",
                        ),
                        _pb.SettingsField(
                            key="minecraft_enabled",
                            type="bool",
                            label="Minecraft 联机",
                            default_value="false",
                            help="允许 L.I.F.E 通过 0kay-minecraft 服务连接你的世界并与玩家一起游玩",
                        ),
                        _pb.SettingsField(
                            key="minecraft_url",
                            type="text",
                            label="Minecraft 服务地址",
                            default_value="http://127.0.0.1:8765",
                            help="0kay-minecraft 机器人服务地址（默认本机 8765）",
                        ),
                        _pb.SettingsField(
                            key="wake_enabled",
                            type="bool",
                            label="喊一声唤醒",
                            default_value="false",
                            help="打开后聊天页会用麦克风监听：喊出唤醒昵称就开始录音，说完自动发送",
                        ),
                        _pb.SettingsField(
                            key="wake_nickname",
                            type="text",
                            label="唤醒昵称",
                            default_value="",
                            help="喊出这些名字即唤醒；多个用逗号分隔，例如「美玖,miku」",
                        ),
                        _pb.SettingsField(
                            key="asr_language",
                            type="text",
                            label="语音识别语言",
                            default_value="zh",
                            help="传给 /api/asr 的语言提示（zh / ja / en，留空为自动检测）",
                        ),
                        _pb.SettingsField(
                            key="voice_reply_enabled",
                            type="bool",
                            label="可以发语音",
                            default_value="true",
                            help="允许角色用 [[voice]] 把这句话作为语音消息发给你（WebUI 会合成音频并播放）",
                        ),
                        _pb.SettingsField(
                            key="selfie_enabled",
                            type="bool",
                            label="可以发自拍",
                            default_value="true",
                            help="允许角色用 [[selfie:场景]] 现拍一张照片发给你（走 Core 的 /api/image，需要配好图像后端）",
                        ),
                        _pb.SettingsField(
                            key="call_enabled",
                            type="bool",
                            label="可以打电话",
                            default_value="false",
                            help="允许角色用 [[call]] 发起语音通话：WebUI 进入通话模式，持续听你说、用语音回你",
                        ),
                    ],
                )
                request.settings_sections.append(sec)
                request.settings_sections.append(_pb.SettingsSection(
                    id='live2d',label='Live2D 模型',icon='avatar',order=50,
                    description='由 LIFE 管理的 Live2D 显示、模型选择、上传与删除',
                    fields=[_pb.SettingsField(key='enabled',type='bool',label='启用 Live2D',default_value='true'),
                            _pb.SettingsField(key='model_url',type='text',label='当前模型 URL',default_value='')]))
            reg_token = os.environ.get("CORE_PLUGIN_REGISTRATION_TOKEN", "").strip()
            registration_metadata = (("x-0kay-registration-token", reg_token),) if reg_token else None
            resp = self._plugin_stub.Register(request, timeout=5, metadata=registration_metadata)
            if resp.success:
                with self._lock:
                    self.plugin_id = resp.plugin_id
                    if self.registration_blocked:
                        log.info("registration accepted again; credential healthy")
                    self.registration_blocked = False
                    self.registration_error = ""
                    self.registration_failures = 0
                try:
                    from life.identity import set_identity
                    set_identity("life", resp.service_token)
                except Exception:
                    pass
                log.info("Registered with Core: plugin_id=%s", self.plugin_id)
                return True
            else:
                self.registration_failures += 1
                if self._is_auth_error(resp.message):
                    self._mark_registration_blocked(resp.message)
                else:
                    log.warning("Registration rejected: %s", resp.message)
                return False
        except Exception as e:
            self.registration_failures += 1
            if self._is_auth_error(e):
                self._mark_registration_blocked(str(e))
            else:
                log.error("Registration failed: %s", e)
            return False

    def heartbeat(self, active_tasks: int = 0) -> bool:
        with self._lock:
            plugin_id = self.plugin_id
        if not self._connected or not plugin_id:
            return False

        try:
            request = core_pb2.HeartbeatRequest(
                plugin_id=plugin_id,
                status=core_pb2.PLUGIN_STATUS_HEALTHY,
                active_tasks=active_tasks,
            )
            resp = self._plugin_stub.Heartbeat(request, timeout=3, metadata=self._outgoing_metadata())
            if not resp.ok:
                with self._lock:
                    self.plugin_id = None
                return False
            return True
        except grpc.RpcError as e:
            if e.code() == grpc.StatusCode.NOT_FOUND:
                with self._lock:
                    self.plugin_id = None
            elif e.code() == grpc.StatusCode.PERMISSION_DENIED:
                # Core stopped honouring the token we registered with — it came up
                # with a different plugin store, or the enrollment key rotated.
                # Heartbeating into that wall forever is how the roster sits at
                # "token mismatch" for hours; drop the identity and register again.
                with self._lock:
                    self.plugin_id = None
                    self._connected = False
                try:
                    from .identity import set_identity
                    set_identity("", "")
                except Exception:  # noqa: BLE001 - best effort
                    pass
                log.warning("Heartbeat rejected (%s); dropping identity to re-register", e.details() or e.code())
            else:
                log.warning("Heartbeat failed: %s", e)
            return False
        except Exception as e:
            log.warning("Heartbeat failed: %s", e)
            return False

    def list_agents(self, include_unhealthy: bool = False) -> dict:
        if not self._connected and not self.connect():
            return {"agents": [], "online_count": 0}

        try:
            request = core_pb2.ListAgentsRequest(include_unhealthy=include_unhealthy)
            resp = self._core_stub.ListAgents(request, timeout=3, metadata=self._outgoing_metadata())

            agents = []
            for a in resp.agents:
                agents.append({
                    "plugin_id": a.plugin_id,
                    "name": a.name,
                    "version": a.version,
                    "address": a.address,
                    "status": core_pb2.PluginStatus.Name(a.status),
                    "active_tasks": a.active_tasks,
                    "last_heartbeat_age_seconds": a.last_heartbeat_age_seconds,
                })

            return {
                "agents": agents,
                "online_count": resp.online_count,
            }
        except Exception as e:
            log.warning("ListAgents failed: %s", e)
            return {"agents": [], "online_count": 0}

    def use_agent(
        self,
        task_id: str,
        prompt: str,
        agent_type: str = "general",
        caller_id: str = "",
        metadata: dict = None,
    ) -> dict:
        if not self._connected and not self.connect():
            return {"accepted": False, "task_id": task_id, "message": "core unavailable"}

        try:
            wire_metadata = {}
            for key, value in (metadata or {}).items():
                if isinstance(value, (dict, list)):
                    wire_metadata[str(key)] = json.dumps(value, ensure_ascii=False, separators=(",", ":"))
                elif isinstance(value, bool):
                    wire_metadata[str(key)] = "true" if value else "false"
                else:
                    wire_metadata[str(key)] = str(value)
            request = core_pb2.UseAgentRequest(
                task_id=task_id,
                caller_id=caller_id or (self.plugin_id or "life"),
                prompt=prompt,
                agent_type=agent_type,
                metadata=wire_metadata,
            )
            resp = self._core_stub.UseAgent(request, timeout=5, metadata=self._outgoing_metadata())
            return {
                "accepted": resp.accepted,
                "task_id": resp.task_id,
                "message": resp.message,
            }
        except Exception as e:
            log.warning("UseAgent failed: %s", e)
            return {"accepted": False, "task_id": task_id, "message": str(e)}

    def run_agent_tool(self, tool: str, args: dict, session_id: str = "") -> dict:
        if not self._connected and not self.connect():
            return {"success": False, "error": "Core unavailable"}
        try:
            response = self._core_stub.RunDirect(core_pb2.RunDirectRequest(
                tool=tool, args=json.dumps(args, ensure_ascii=False), session_id=session_id), timeout=120,
                metadata=self._outgoing_metadata())
            return {"success": response.success, "result": response.result, "error": response.error}
        except Exception as error:
            return {"success": False, "error": str(error)}

    def cancel_agent(self, task_id: str, caller_id: str = "") -> dict:
        if not self._connected and not self.connect():
            return {"success": False, "message": "core unavailable"}

        try:
            request = core_pb2.CancelAgentRequest(
                task_id=task_id,
                caller_id=caller_id or (self.plugin_id or "life"),
            )
            resp = self._core_stub.CancelAgent(request, timeout=5, metadata=self._outgoing_metadata())
            return {"success": resp.success, "message": resp.message}
        except Exception as e:
            return {"success": False, "message": str(e)}


_core_client: Optional[CoreClient] = None


def get_core_client() -> CoreClient:
    global _core_client
    if _core_client is None:
        _core_client = CoreClient()
    return _core_client
