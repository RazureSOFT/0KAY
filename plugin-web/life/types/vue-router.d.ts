// The WebUI importmap resolves `vue-router` to the host's shared bridge, so a
// plugin page gets the *app's* router instance rather than a private copy — SPA
// navigation keeps the shell's player and i18n state alive. Nothing in the npm
// tree provides it, so without this declaration the import is TS2307.
//
// Typed loosely for the same reason as @0kay/host: the real types live in the
// host bundle and are not reachable from here.
declare module 'vue-router' {
  export const useRouter: () => any
  export const useRoute: () => any
  export const RouterLink: any
  export const RouterView: any
  const _default: Record<string, any>
  export default _default
}