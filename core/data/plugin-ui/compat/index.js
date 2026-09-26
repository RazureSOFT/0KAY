const COMPONENTS = ["core", "webui", "agent", "life", "mocr", "searxng"];
const CURRENT_API_VERSION = 1;
const PATH_ALIASES = {
  core: {},
  webui: {},
  agent: {},
  life: {},
  mocr: {},
  searxng: {}
};
function segPaths(value) {
  return String(value ?? "").split("/").filter(Boolean).map(encodeURIComponent).join("/");
}
const NO_SEARCH = "";
const REQUEST_ALIASES = [
  {
    id: "plugins-enable",
    component: "core",
    method: "POST",
    path: "/api/plugins/enable",
    to: "PATCH /api/plugins/{plugin}",
    rewrite: (ctx) => {
      var _a, _b;
      return {
        method: "PATCH",
        path: `/api/plugins/${encodeURIComponent(((_a = ctx.body) == null ? void 0 : _a.plugin) || ((_b = ctx.body) == null ? void 0 : _b.name) || "")}`,
        dropBody: false,
        body: { enabled: true }
      };
    }
  },
  {
    id: "plugins-disable",
    component: "core",
    method: "POST",
    path: "/api/plugins/disable",
    to: "PATCH /api/plugins/{plugin}",
    rewrite: (ctx) => {
      var _a, _b;
      return {
        method: "PATCH",
        path: `/api/plugins/${encodeURIComponent(((_a = ctx.body) == null ? void 0 : _a.plugin) || ((_b = ctx.body) == null ? void 0 : _b.name) || "")}`,
        body: { enabled: false }
      };
    }
  },
  {
    id: "providers-delete-legacy",
    component: "core",
    method: "DELETE",
    path: "/api/providers/delete",
    to: "DELETE /api/providers/{id}",
    rewrite: (ctx) => {
      var _a;
      const id = ctx.query.id || ((_a = ctx.body) == null ? void 0 : _a.id);
      if (!id) return null;
      return { path: `/api/providers/${encodeURIComponent(id)}`, search: NO_SEARCH };
    }
  },
  {
    id: "skills-delete-legacy",
    component: "core",
    method: "DELETE",
    path: "/api/skills",
    to: "DELETE /api/skills/{name...}",
    rewrite: (ctx) => {
      var _a;
      const name = ctx.query.name || ((_a = ctx.body) == null ? void 0 : _a.name);
      if (!name) return null;
      return { path: `/api/skills/${segPaths(name)}`, search: NO_SEARCH };
    }
  },
  {
    id: "live2d-delete-legacy",
    component: "core",
    method: "DELETE",
    path: "/api/live2d",
    to: "DELETE /api/live2d/{path...}",
    rewrite: (ctx) => {
      var _a;
      const id = ctx.query.id || ((_a = ctx.body) == null ? void 0 : _a.id);
      if (!id) return null;
      return { path: `/api/live2d/${segPaths(id)}`, search: NO_SEARCH };
    }
  },
  {
    id: "usage-clear-legacy",
    component: "core",
    method: "POST",
    path: "/api/usage/clear",
    to: "DELETE /api/usage",
    rewrite: () => ({ method: "DELETE", path: "/api/usage", dropBody: true })
  },
  {
    id: "tasks-cancel-legacy",
    component: "core",
    method: "POST",
    path: "/api/tasks/cancel",
    to: "POST /api/tasks/{task_id}/cancel",
    rewrite: (ctx) => {
      var _a, _b;
      const id = ((_a = ctx.body) == null ? void 0 : _a.task_id) || ((_b = ctx.body) == null ? void 0 : _b.taskId) || ctx.query.task_id;
      if (!id) return null;
      return { path: `/api/tasks/${encodeURIComponent(id)}/cancel`, dropBody: true };
    }
  },
  {
    id: "sessions-item-legacy",
    component: "core",
    method: "PATCH",
    path: "/api/agent/sessions",
    to: "PATCH /api/agent/sessions/{session_id}",
    rewrite: (ctx) => {
      var _a, _b;
      const id = ((_a = ctx.body) == null ? void 0 : _a.session_id) || ((_b = ctx.body) == null ? void 0 : _b.sessionId) || ctx.query.session_id;
      if (!id) return null;
      const rest = { ...ctx.body || {} };
      delete rest.session_id;
      delete rest.sessionId;
      return { path: `/api/agent/sessions/${encodeURIComponent(id)}`, body: Object.keys(rest).length ? rest : void 0 };
    }
  },
  {
    id: "sessions-item-legacy-delete",
    component: "core",
    method: "DELETE",
    path: "/api/agent/sessions",
    to: "DELETE /api/agent/sessions/{session_id}",
    rewrite: (ctx) => {
      var _a, _b;
      const id = ((_a = ctx.body) == null ? void 0 : _a.session_id) || ((_b = ctx.body) == null ? void 0 : _b.sessionId) || ctx.query.session_id;
      if (!id) return null;
      return { path: `/api/agent/sessions/${encodeURIComponent(id)}`, dropBody: true };
    }
  },
  {
    id: "mocr-generate-legacy",
    component: "mocr",
    method: "POST",
    path: "/api/mocr/generate",
    to: "POST /api/chat",
    rewrite: () => ({ path: "/api/chat" })
  },
  {
    id: "life-state-legacy",
    component: "life",
    method: "GET",
    path: "/api/life/state",
    to: "GET /api/state",
    rewrite: () => ({ path: "/api/state" })
  },
  {
    id: "providers-credentials-legacy",
    component: "core",
    method: "GET",
    path: "/api/providers",
    to: "GET /api/providers/credentials",
    // Proxy-only: the live WebUI still reads the redacted `/api/providers`.
    scope: "proxy",
    rewrite: () => ({ path: "/api/providers/credentials", search: NO_SEARCH })
  }
];
const RESPONSE_ALIASES = [
  {
    id: "core-installed-packages",
    component: "core",
    method: "GET",
    path: "/api/plugins/installed",
    adapt: (data) => {
      if (!data || Array.isArray(data) || Array.isArray(data.packages)) return data;
      const names = Object.keys(data.installed || {}).map((key) => {
        var _a;
        return ((_a = data.installed[key]) == null ? void 0 : _a.name) || key;
      });
      return { ...data, packages: names };
    }
  }
];
function normalizePath(path) {
  let out = String(path || "/");
  out = out.replace(/\/{2,}/g, "/");
  out = out.replace(/^\/api\/v\d+(?=\/|$)/i, "/api");
  out = out.replace(/^\/plugin\//, "/api/plugins/");
  if (out.length > 1 && out.endsWith("/")) out = out.slice(0, -1);
  return out;
}
function componentFor(path) {
  if (path.startsWith("/api/life")) return "life";
  if (path.startsWith("/api/agent")) return "agent";
  if (path.startsWith("/api/mocr")) return "mocr";
  if (path.startsWith("/api/search") || path.startsWith("/api/run")) return "searxng";
  if (path.startsWith("/api/")) return "core";
  return "webui";
}
function parseBody(body) {
  if (body == null) return void 0;
  if (typeof body === "object") return body;
  if (typeof URLSearchParams !== "undefined" && body instanceof URLSearchParams) {
    return Object.fromEntries(body.entries());
  }
  if (typeof body === "string" && body.trim()) {
    try {
      return JSON.parse(body);
    } catch {
      return void 0;
    }
  }
  return void 0;
}
function resolveRequest(rawUrl, method = "GET", body, opts = {}) {
  const via = opts.via || "browser";
  const isAbsolute = /^[a-z][a-z0-9+.-]*:\/\//i.test(String(rawUrl));
  const base = isAbsolute ? void 0 : "http://localhost";
  const url = new URL(String(rawUrl), base);
  const originalPath = url.pathname;
  let path = normalizePath(originalPath);
  const component = componentFor(path);
  const aliases = PATH_ALIASES[component] || {};
  if (aliases[path]) path = aliases[path];
  let outMethod = String(method || "GET").toUpperCase();
  let search = url.search;
  let outBody = body;
  let bodyChanged = false;
  let dropBody = false;
  let changed = path !== originalPath;
  const parsedBody = parseBody(body);
  const query = Object.fromEntries(url.searchParams.entries());
  for (const rule of REQUEST_ALIASES) {
    if (rule.scope === "proxy" && via !== "proxy") continue;
    if (rule.method !== outMethod) continue;
    if (rule.path !== path) continue;
    const result = rule.rewrite({ path, method: outMethod, searchParams: url.searchParams, query, body: parsedBody });
    if (!result) continue;
    if (result.method && result.method !== outMethod) {
      changed = true;
      outMethod = result.method;
    }
    if (result.path && result.path !== path) {
      changed = true;
      path = result.path;
    }
    if (result.search !== void 0 && result.search !== search) {
      changed = true;
      search = result.search;
    }
    if (result.dropBody) {
      changed = true;
      dropBody = true;
      bodyChanged = true;
      outBody = void 0;
    } else if ("body" in result) {
      changed = true;
      outBody = result.body;
      bodyChanged = true;
    }
  }
  const suffix = `${path}${search}`;
  return {
    component,
    originalPath,
    path,
    method: outMethod,
    changed,
    body: outBody,
    bodyChanged,
    dropBody,
    url: isAbsolute ? `${url.origin}${suffix}` : suffix
  };
}
function hasResponseAdapter(path, method = "GET") {
  const upper = String(method || "GET").toUpperCase();
  return RESPONSE_ALIASES.some((rule) => rule.path === path && (!rule.method || rule.method === upper));
}
function adaptResponse(path, method, data) {
  const upper = String(method || "GET").toUpperCase();
  for (const rule of RESPONSE_ALIASES) {
    if (rule.path === path && (!rule.method || rule.method === upper)) return rule.adapt(data);
  }
  return data;
}
function describeRules() {
  return {
    apiVersion: CURRENT_API_VERSION,
    components: COMPONENTS,
    pathAliases: PATH_ALIASES,
    requestAliases: REQUEST_ALIASES.map(({ id, component, method, path, to, scope }) => ({
      id,
      component,
      from: `${method} ${path}`,
      to,
      scope: scope || "all"
    })),
    responseAliases: RESPONSE_ALIASES.map(({ id, component, method, path }) => ({ id, component, method, path }))
  };
}
const STATE_KEY = "__0KAY_COMPAT__";
function shouldHandle(raw) {
  if (typeof raw !== "string") return true;
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(raw)) return true;
  try {
    return new URL(raw).origin === window.location.origin;
  } catch {
    return false;
  }
}
function applyRewrite(init, nativeInput, resolved) {
  const next = { ...init || {} };
  next.method = resolved.method;
  if (resolved.bodyChanged) {
    const headers = new Headers(next.headers || (typeof nativeInput === "object" ? nativeInput == null ? void 0 : nativeInput.headers : void 0) || void 0);
    if (resolved.dropBody) {
      delete next.body;
      headers.delete("Content-Type");
    } else {
      next.body = JSON.stringify(resolved.body ?? {});
      if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
    }
    next.headers = headers;
  }
  return next;
}
function install(context = {}) {
  if (typeof window === "undefined") return null;
  const existing = window[STATE_KEY];
  if (existing && existing.installed) return existing;
  const state = {
    installed: true,
    apiVersion: CURRENT_API_VERSION,
    context,
    installedAt: Date.now(),
    hits: [],
    rules: describeRules(),
    uninstall: null
  };
  window[STATE_KEY] = state;
  const nativeFetch = window.fetch ? window.fetch.bind(window) : null;
  state.nativeFetch = nativeFetch;
  if (nativeFetch) {
    window.fetch = async function compatFetch(input, init) {
      try {
        const raw = typeof input === "string" ? input : input instanceof URL ? input.href : input == null ? void 0 : input.url;
        if (!shouldHandle(raw)) return nativeFetch(input, init);
        const method = (init == null ? void 0 : init.method) || typeof input === "object" && (input == null ? void 0 : input.method) || "GET";
        const body = init == null ? void 0 : init.body;
        const resolved = resolveRequest(raw, method, body, { via: "browser" });
        let nextInput = input;
        let nextInit = init;
        if (resolved.changed) {
          state.hits.push({
            at: Date.now(),
            transport: "fetch",
            from: resolved.originalPath,
            to: resolved.path,
            method: resolved.method
          });
          nextInput = resolved.url;
          nextInit = applyRewrite(init, input, resolved);
        }
        const response = await nativeFetch(nextInput, nextInit);
        if (hasResponseAdapter(resolved.path, resolved.method)) {
          const text = await response.clone().text();
          if (text) {
            try {
              const adapted = adaptResponse(resolved.path, resolved.method, JSON.parse(text));
              return new Response(JSON.stringify(adapted), { status: response.status, statusText: response.statusText, headers: response.headers });
            } catch {
            }
          }
        }
        return response;
      } catch {
        return nativeFetch(input, init);
      }
    };
  }
  const nativeOpen = XMLHttpRequest.prototype.open;
  const nativeSend = XMLHttpRequest.prototype.send;
  const nativeSetHeader = XMLHttpRequest.prototype.setRequestHeader;
  const pending = /* @__PURE__ */ new WeakMap();
  XMLHttpRequest.prototype.open = function compatOpen(method, url, ...rest) {
    pending.set(this, { method, url: String(url), rest, headers: {}, handled: shouldHandle(String(url)) });
    return nativeOpen.call(this, method, url, ...rest);
  };
  XMLHttpRequest.prototype.setRequestHeader = function compatSetHeader(name, value) {
    const entry = pending.get(this);
    if (entry && entry.handled) entry.headers[name] = value;
    return nativeSetHeader.call(this, name, value);
  };
  XMLHttpRequest.prototype.send = function compatSend(body) {
    const entry = pending.get(this);
    if (!entry || !entry.handled) return nativeSend.call(this, body);
    try {
      const resolved = resolveRequest(entry.url, entry.method, body, { via: "browser" });
      if (resolved.changed) {
        state.hits.push({
          at: Date.now(),
          transport: "xhr",
          from: resolved.originalPath,
          to: resolved.path,
          method: resolved.method
        });
        nativeOpen.call(this, resolved.method, resolved.url, ...entry.rest);
        for (const [name, value] of Object.entries(entry.headers)) nativeSetHeader.call(this, name, value);
        if (resolved.dropBody) body = null;
        else if (resolved.bodyChanged) {
          body = JSON.stringify(resolved.body ?? {});
          if (!Object.keys(entry.headers).some((k) => k.toLowerCase() === "content-type")) {
            nativeSetHeader.call(this, "Content-Type", "application/json");
          }
        }
      }
    } catch {
    }
    return nativeSend.call(this, body);
  };
  state.uninstall = () => {
    if (nativeFetch) window.fetch = nativeFetch;
    XMLHttpRequest.prototype.open = nativeOpen;
    XMLHttpRequest.prototype.send = nativeSend;
    XMLHttpRequest.prototype.setRequestHeader = nativeSetHeader;
    state.installed = false;
  };
  return state;
}
export {
  install as default,
  install
};
