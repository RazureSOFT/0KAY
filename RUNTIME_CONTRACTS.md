# Runtime contracts

## Approval and recovery

Normal mode requires a one-shot executor approval for every Agent tool call,
including shell and delegated tasks. Full access explicitly bypasses these
prompts for that turn; child agents inherit it. Direct LIFE tools use Normal.
The workspace picker offers explicit user-driven folder creation. Approval
records are ephemeral and expire on cancellation or after ten minutes.

Executors persist a UUID in AGENT_DATA_DIR/executor-id; registrations use this
identity rather than the shared `agent` plugin name. Registry reads are snapshots.
Core uses a task snapshot plus an append journal, with delta cursors for polling.
Completion callbacks persist and retry; notification reads do not consume data,
and browsers acknowledge IDs after storing received messages.

Local services listen on loopback. Docker backend publications also bind to host
loopback. Remote deployments need an authenticated reverse proxy/service network.
CORE_API_TOKEN is optional HTTP bearer enforcement, not a replacement for gRPC
transport authentication on untrusted networks.

## Unified task ledger and Agent sessions

`/agents` reads the durable Core task ledger. Conversation turns, THINK/OUTPUT
calls, tools, Agent tasks and subagent work carry kind/session/parent identifiers.
Workers persist unsent task events locally and retry delivery to Core. Failed
dispatch attempts remain visible; records are no longer silently dropped at 50.
Agent sessions can be created while executors are offline. A session allows one
active Agent turn at a time and supplies the last ten completed turns as context.
Core restarts mark unacknowledged running tasks failed instead of leaving them
running forever.

## Learned daily rhythm

LIFE keeps 28 days of distinct hourly interaction observations. After three
observed days it shifts an eight-hour low-activity sleep window by at most one
hour each day. Quiet periods and energy drive sleep; messages may wake the
character. The learned schedule and timing state survive restarts. Browser time
is shown with its timezone; LIFE's model time uses the server's local timezone.

## Agent

TaskManager owns the PENDING → RUNNING → DONE/FAILED/CANCELLED transitions.
Root tasks queue at the concurrency limit. Synchronous child tasks share the
parent's execution slot (parents are suspended while awaiting them), preventing
a limit=1 parent/child deadlock. Cancellation propagates to descendants and model
streams; tools receive the task AbortSignal. A cancelled task cannot become DONE.
Iteration exhaustion, truncated/error model finishes, and transport failures fail
the task. Core stores durable task history; Agent keeps bounded runtime history.

Model/tool messages are mapped explicitly to protobuf fields at the transport
boundary. Credentials are resolved from current enabled Core providers by model,
not permanently cached from the default provider.

## LIFE

Each turn has a local persona, session, user, adapter and message history. Turns
within a session serialize; independent sessions may run concurrently. Memory
recall filters private conversation facts by session before ranking. Explicit
public knowledge remains shared. SQLite owns memory facts; legacy JSON is a
one-time migration input, and search indexes are rebuildable projections.

THINK sees conversation history and previous tool results. Secondary recall is
passed to OUTPUT. A bounded planning loop executes one action before replanning;
Agent dispatch is asynchronous and stops that turn's planning loop. Service
failures never synthesize a successful task or substitute a sample task.

OUTPUT text streams once to WebUI. OneBot buffers model tokens into a message.
Task origins and undelivered notifications persist with LIFE state; completion
normalizes protobuf enums and preserves errors. Callbacks are idempotent.

## Deployment and releases

Compose configures explicit service DNS addresses and advertised plugin addresses.
The LIFE Python protobuf path is set independently of its package install path.
Agent images build the sibling MCP package and include shared protobuf sources.
See dependencies.json and bootstrap.ps1 for the independent Agent repository.

Run the regression suites documented in README.md before publishing a coordinated
release. Docker build/start verification requires a working Docker installation.
