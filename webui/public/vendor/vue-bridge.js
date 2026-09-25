// Host Vue bridge for plugin bare `import ... from "vue"`.
// Resolved via index.html importmap; re-exports the host copy
// injected as window.__0KAY_VUE__ so plugins share one runtime.
// Generated: full named re-export -- SFC-compiled plugin pages need runtime
// helpers (withCtx, renderList, normalizeClass, ...) beyond a fixed list.
const V = globalThis.__0KAY_VUE__
if (!V) {
  throw new Error('[0kay] window.__0KAY_VUE__ is not ready (load after WebUI main)')
}

export default V

export const {
  BaseTransition, BaseTransitionPropsValidators, Comment, DeprecationTypes, EffectScope, ErrorCodes,
  ErrorTypeStrings, Fragment, KeepAlive, ReactiveEffect, Static, Suspense,
  Teleport, Text, TrackOpTypes, Transition, TransitionGroup, TriggerOpTypes,
  VueElement, __esModule, assertNumber, callWithAsyncErrorHandling, callWithErrorHandling, camelize,
  capitalize, cloneVNode, compatUtils, compile, computed, createApp,
  createBlock, createCommentVNode, createElementBlock, createElementVNode, createHydrationRenderer, createPropsRestProxy,
  createRenderer, createSSRApp, createSlots, createStaticVNode, createTextVNode, createVNode,
  customRef, defineAsyncComponent, defineComponent, defineCustomElement, defineEmits, defineExpose,
  defineModel, defineOptions, defineProps, defineSSRCustomElement, defineSlots, devtools,
  effect, effectScope, getCurrentInstance, getCurrentScope, getCurrentWatcher, getTransitionRawChildren,
  guardReactiveProps, h, handleError, hasInjectionContext, hydrate, hydrateOnIdle,
  hydrateOnInteraction, hydrateOnMediaQuery, hydrateOnVisible, initCustomFormatter, initDirectivesForSSR, inject,
  isMemoSame, isProxy, isReactive, isReadonly, isRef, isRuntimeOnly,
  isShallow, isVNode, markRaw, mergeDefaults, mergeModels, mergeProps,
  nextTick, nodeOps, normalizeClass, normalizeProps, normalizeStyle, onActivated,
  onBeforeMount, onBeforeUnmount, onBeforeUpdate, onDeactivated, onErrorCaptured, onMounted,
  onRenderTracked, onRenderTriggered, onScopeDispose, onServerPrefetch, onUnmounted, onUpdated,
  onWatcherCleanup, openBlock, patchProp, popScopeId, provide, proxyRefs,
  pushScopeId, queuePostFlushCb, reactive, readonly, ref, registerRuntimeCompiler,
  render, renderList, renderSlot, resolveComponent, resolveDirective, resolveDynamicComponent,
  resolveFilter, resolveTransitionHooks, setBlockTracking, setDevtoolsHook, setTransitionHooks, shallowReactive,
  shallowReadonly, shallowRef, ssrContextKey, ssrUtils, stop, toDisplayString,
  toHandlerKey, toHandlers, toRaw, toRef, toRefs, toValue,
  transformVNodeArgs, triggerRef, unref, useAttrs, useCssModule, useCssVars,
  useHost, useId, useModel, useSSRContext, useShadowRoot, useSlots,
  useTemplateRef, useTransitionState, vModelCheckbox, vModelDynamic, vModelRadio, vModelSelect,
  vModelText, vShow, version, warn, watch, watchEffect,
  watchPostEffect, watchSyncEffect, withAsyncContext, withCtx, withDefaults, withDirectives,
  withKeys, withMemo, withModifiers, withScopeId,
} = V
