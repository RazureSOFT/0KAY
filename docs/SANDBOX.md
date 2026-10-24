# Sandbox

Two layers, deliberately separate:

| Layer | File | Answers |
|---|---|---|
| Policy | `agent/src/sandbox/policy.ts` | may this command / path be touched? |
| Backend | `agent/src/sandbox/backends.ts` | what does it run *inside*? |

The policy is cheap and portable; the backend is a kernel feature and differs per
OS. A task's mode comes from `sandbox_mode` (Settings → Agent), default
`workspace-write`, and every task inherits it. A caller can pass its own in the
task metadata, but cannot widen it past what the setting allows without saying so
explicitly.

## Modes

| Mode | Writes | Shell |
|---|---|---|
| `read-only` | none, anywhere | only commands classified as read-only (`ls`, `cat`, `git status`, `npm ls`, …); anything unrecognised is refused |
| `workspace-write` (default) | inside the workspace roots | anything, except recursive deletes of a root and writes aimed at an absolute path outside the roots |
| `danger-full-access` | anywhere | anything, no backend |

## Backends

**Linux — bwrap.** Read-only bind of `/`, workspace roots bound back writable,
private `/tmp`, `--unshare-net` unless the task asked for network, command after
`--`. This is a real boundary: a write outside the roots fails in the kernel, not
in our regex.

**macOS — sandbox-exec.** SBPL profile: `(deny file-write*)`, then
`(allow file-write* (subpath "<root>"))` per root, plus `/private/tmp` and
`/private/var/folders` because nothing runs without them. Deprecated by Apple,
still enforced.

**Windows — none.** See below.

## Why Windows has no backend yet

File-write confinement on Windows needs one of:

| Mechanism | API | Cost |
|---|---|---|
| AppContainer | `CreateAppContainerProfile` + `STARTUPINFOEX` with a capability SID | native module; the container cannot read the user's files without explicit ACL grants, so most commands break |
| Restricted token | `CreateRestrictedToken` + `CreateProcessAsUser` | native module; needs a logon session to attach to |
| Separate low-privilege user | `CreateProcessWithLogonW` | needs credentials, and the workspace has to be ACL'd for that user |
| Job Object | `CreateJobObject` + `AssignProcessToJobObject` | native module; **gives process containment, not file confinement** — it can kill a tree and cap memory, it cannot stop a write |

None of these is reachable from Node without shipping a native addon. A
PowerShell shim that P/Invokes them would work, at the cost of ~400ms and one more
layer of quoting on every command — which is the exact problem the bash switch
just removed. So Windows reports `backend: 'none'` with a note in the tool result,
and the classifier carries the weight.

That is a downgrade, not a lie: the model is told it is unconfined.

## Adding a backend

`buildLaunch()` is pure — platform and binary availability are inputs, which is
why the Linux and macOS argv can be tested from a Windows box. A new backend is:

```ts
if (input.platform === 'win32' && available('my-helper')) {
  return { file: 'my-helper', args: [...], backend: 'my-helper', notes: [...] }
}
```

and one test per flag that matters. `notes` travels into the tool result, so a
partial guarantee is visible to whoever reads the transcript.

## Shell selection

`sandbox/backends.ts` falls back to `tools/shell_choice.ts`, which prefers bash
(Git for Windows) over cmd.exe. That matters here: the command string handed to a
backend is the same string the user would type, and cmd.exe's quoting rules are
where most of the "it worked in my terminal" reports came from.
