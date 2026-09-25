"""Core client for L.I.F.E - register, heartbeat, query agents, dispatch tasks."""

import os
import sys
import time
import json
from typing import Optional

import grpc

# Add gen/python to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', '..', 'gen', 'python'))

from core.v1 import core_pb2, core_pb2_grpc
from plugin.v1 import plugin_pb2


def _manifest_version(fallback: str = "0.1.0") -> str:
    """Read the plugin version from manifest.json in the working directory."""
    try:
        manifest = os.path.join(os.path.dirname(__file__), '..', '..', 'manifest.json')
        with open(manifest, encoding="utf-8") as handle:
            return json.load(handle).get("version") or fallback
    except (OSError, ValueError):
        return fallback


class CoreClient:
    """gRPC client for talking to 0kay Core (PluginService + CoreService)."""

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

    def connect(self) -> bool:
        """Open channel and create stubs."""
        try:
            self._channel = grpc.insecure_channel(self.address)
            # Wait briefly for channel to be ready
            grpc.channel_ready_future(self._channel).result(timeout=3)
            self._plugin_stub = core_pb2_grpc.PluginServiceStub(self._channel)
            self._core_stub = core_pb2_grpc.CoreServiceStub(self._channel)
            self._connected = True
            return True
        except Exception as e:
            print(f"[LIFE-Core] Failed to connect to Core at {self.address}: {e}")
            self._connected = False
            return False

    def close(self):
        if self._channel:
            self._channel.close()
            self._channel = None
            self._connected = False

    @property
    def connected(self) -> bool:
        return self._connected

    def register(self) -> bool:
        """Register L.I.F.E as a persona plugin with Core."""
        if not self._connected and not self.connect():
            return False

        try:
            # Declare Life settings section for the WebUI Settings page
            from plugin.v1 import plugin_pb2 as _pb
            request = core_pb2.RegisterRequest(
                plugin_info=plugin_pb2.PluginInfo(
                    name="life",
                    version=_manifest_version(),
                    description="L.I.F.E - Persona engine (THINK/OUTPUT)",
                    author="0kay",
                    plugin_type=plugin_pb2.PLUGIN_TYPE_PERSONA,
                ),
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
                            key="mail_mailbox_path",
                            type="text",
                            label="本地邮箱 JSON 文件",
                            default_value="",
                            help="可选离线邮箱文件；优先用于 getmail 测试",
                        ),
                        _pb.SettingsField(
                            key="mail_imap_host",
                            type="text",
                            label="IMAP 主机",
                            default_value="",
                            help="例如 imap.example.com",
                        ),
                        _pb.SettingsField(
                            key="mail_imap_port",
                            type="number",
                            label="IMAP 端口",
                            default_value="993",
                            help="SSL IMAP 默认 993",
                        ),
                        _pb.SettingsField(
                            key="mail_imap_user",
                            type="text",
                            label="IMAP 用户名",
                            default_value="",
                            help="仅用于 L.I.F.E getmail 工具",
                        ),
                        _pb.SettingsField(
                            key="mail_imap_password",
                            type="text",
                            label="IMAP 密码或应用专用密码",
                            default_value="",
                            help="敏感信息保存在 Core 本地 settings.json，不上传仓库",
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
                            label="OneBot v11",
                            default_value="false",
                            help="启用 QQ OneBot 适配器",
                        ),
                        _pb.SettingsField(
                            key="onebot_ws_url",
                            type="text",
                            label="OneBot WebSocket 地址",
                            default_value="ws://127.0.0.1:6700",
                            help="正向 WebSocket 事件地址",
                        ),
                        _pb.SettingsField(
                            key="onebot_http_url",
                            type="text",
                            label="OneBot HTTP 地址",
                            default_value="http://127.0.0.1:6700",
                            help="发送消息的 OneBot HTTP API 地址",
                        ),
                        _pb.SettingsField(
                            key="onebot_access_token",
                            type="text",
                            label="OneBot Access Token",
                            default_value="",
                            help="OneBot API 鉴权令牌",
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
                    ],
                )
                request.settings_sections.append(sec)
                request.settings_sections.append(_pb.SettingsSection(
                    id='live2d',label='Live2D 模型',icon='avatar',order=50,
                    description='由 LIFE 管理的 Live2D 显示、模型选择、上传与删除',
                    fields=[_pb.SettingsField(key='enabled',type='bool',label='启用 Live2D',default_value='true'),
                            _pb.SettingsField(key='model_url',type='text',label='当前模型 URL',default_value='')]))
            resp = self._plugin_stub.Register(request, timeout=5)
            if resp.success:
                self.plugin_id = resp.plugin_id
                print(f"[LIFE-Core] Registered with Core: plugin_id={self.plugin_id}")
                return True
            else:
                print(f"[LIFE-Core] Registration rejected: {resp.message}")
                return False
        except Exception as e:
            print(f"[LIFE-Core] Registration failed: {e}")
            return False

    def heartbeat(self, active_tasks: int = 0) -> bool:
        """Send heartbeat to Core."""
        if not self._connected or not self.plugin_id:
            return False

        try:
            request = core_pb2.HeartbeatRequest(
                plugin_id=self.plugin_id,
                status=core_pb2.PLUGIN_STATUS_HEALTHY,
                active_tasks=active_tasks,
            )
            resp = self._plugin_stub.Heartbeat(request, timeout=3)
            if not resp.ok:
                self.plugin_id = None
            return resp.ok
        except Exception as e:
            print(f"[LIFE-Core] Heartbeat failed: {e}")
            # Try to re-register
            self.plugin_id = None
            return False

    def list_agents(self, include_unhealthy: bool = False) -> dict:
        """Query Core for online agents. Returns {agents: [...], online_count: N}."""
        if not self._connected and not self.connect():
            return {"agents": [], "online_count": 0}

        try:
            request = core_pb2.ListAgentsRequest(include_unhealthy=include_unhealthy)
            resp = self._core_stub.ListAgents(request, timeout=3)

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
            print(f"[LIFE-Core] ListAgents failed: {e}")
            return {"agents": [], "online_count": 0}

    def use_agent(
        self,
        task_id: str,
        prompt: str,
        agent_type: str = "general",
        caller_id: str = "",
        metadata: dict = None,
    ) -> dict:
        """Dispatch a task to an Agent via Core. Returns {accepted, task_id, message}."""
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
            resp = self._core_stub.UseAgent(request, timeout=5)
            return {
                "accepted": resp.accepted,
                "task_id": resp.task_id,
                "message": resp.message,
            }
        except Exception as e:
            print(f"[LIFE-Core] UseAgent failed: {e}")
            return {"accepted": False, "task_id": task_id, "message": str(e)}

    def run_agent_tool(self, tool: str, args: dict, session_id: str = "") -> dict:
        if not self._connected and not self.connect():
            return {"success": False, "error": "Core unavailable"}
        try:
            response = self._core_stub.RunDirect(core_pb2.RunDirectRequest(
                tool=tool, args=json.dumps(args, ensure_ascii=False), session_id=session_id), timeout=120)
            return {"success": response.success, "result": response.result, "error": response.error}
        except Exception as error:
            return {"success": False, "error": str(error)}

    def cancel_agent(self, task_id: str, caller_id: str = "") -> dict:
        """Cancel a running agent task."""
        if not self._connected and not self.connect():
            return {"success": False, "message": "core unavailable"}

        try:
            request = core_pb2.CancelAgentRequest(
                task_id=task_id,
                caller_id=caller_id or (self.plugin_id or "life"),
            )
            resp = self._core_stub.CancelAgent(request, timeout=5)
            return {"success": resp.success, "message": resp.message}
        except Exception as e:
            return {"success": False, "message": str(e)}


# Module-level singleton
_core_client: Optional[CoreClient] = None


def get_core_client() -> CoreClient:
    """Get or create the singleton CoreClient."""
    global _core_client
    if _core_client is None:
        _core_client = CoreClient()
    return _core_client
