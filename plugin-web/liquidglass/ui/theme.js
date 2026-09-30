// 0KAY Liquid Glass refraction engine (plugin: liquidglass).
//
// Dependency-free, no host imports: it may run before the Vue bridge exists.
// The theme patch (target "bootstrap") declares this file, so the WebUI host
// imports it and calls the exported install(); uninstall restores host styles.
//
// What it does: for a small set of chrome panels (nav rail, header, chat input
// bar, agent composer, settings drawer, select menus) it upgrades the
// stylesheet's plain glass
//
//     backdrop-filter: blur(2px) saturate(140%)
//
// into a true refraction by appending a same-sized SVG displacement filter:
//
//     backdrop-filter: blur(2px) saturate(140%) url(#lg-disp-N)
//
// The filter (feImage + feDisplacementMap) is fed a canvas-rendered rounded-
// rectangle SDF map: neutral gray in the middle, edge-banded normals that pinch
// the rim like a thick glass bevel. Browsers without url() support in
// backdrop-filter reject the inline value at parse time, which silently falls
// back to the stylesheet's blur — degradation is automatic.
//
// Keep BASE in sync with ui/optics.css. The patch is the static fallback.

;(function () {
  var SVG_ID = 'liquidglass-filters'
  var ATTR = 'data-lg'
  var BASE = 'blur(2px) saturate(140%)'
  var material = null
  var TARGETS = [
    '#app .app-header',
    '#app .nav-rail',
    '#app .composer',
    '#app .input-area',
    '#app .settings-page .settings-nav',
    '.app-select-menu',
  ]

  var installed = false
  var svg = null
  var defs = null
  var slots = []
  var scanTimer = 0
  var domObs = null

  function supportsRefraction() {
    if (typeof CSS === 'undefined' || !CSS.supports) return false
    try {
      return CSS.supports('backdrop-filter', BASE + ' url(#lg-probe)') ||
        CSS.supports('-webkit-backdrop-filter', BASE + ' url(#lg-probe)')
    } catch (e) {
      return false
    }
  }

  function ensureSvg() {
    if (svg && document.body.contains(svg)) return
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('id', SVG_ID)
    svg.setAttribute('width', '0')
    svg.setAttribute('height', '0')
    svg.setAttribute('aria-hidden', 'true')
    svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden'
    defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
    svg.appendChild(defs)
    document.body.appendChild(svg)
  }

  function radiusOf(el) {
    var cs = getComputedStyle(el)
    var v = cs.borderTopLeftRadius || '0'
    var n = parseFloat(v) || 0
    if (v.indexOf('%') >= 0) n = (n / 100) * Math.min(el.offsetWidth, el.offsetHeight)
    return Math.min(n, Math.min(el.offsetWidth, el.offsetHeight) / 2)
  }

  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v }

  // Rounded-rect SDF displacement map: gray (no shift) through the middle,
  // edge band displaced along the SDF normal — a glass bevel lens.
  function buildMap(w, h, r, band, amp) {
    var cv = document.createElement('canvas')
    cv.width = w
    cv.height = h
    var ctx = cv.getContext('2d')
    var n = w * h
    var sdf = new Float32Array(n)
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var px = x + 0.5 - w / 2
        var py = y + 0.5 - h / 2
        var qx = Math.abs(px) - w / 2 + r
        var qy = Math.abs(py) - h / 2 + r
        var ox = qx > 0 ? qx : 0
        var oy = qy > 0 ? qy : 0
        var inner = Math.min(Math.max(qx, qy), 0) + Math.sqrt(ox * ox + oy * oy) - r
        sdf[y * w + x] = -inner
      }
    }
    var img = ctx.createImageData(w, h)
    var d = img.data
    for (var yy = 0; yy < h; yy++) {
      for (var xx = 0; xx < w; xx++) {
        var i = yy * w + xx
        var o = i * 4
        var dist = sdf[i]
        var dx = 0
        var dy = 0
        if (dist < band) {
          var gx = sdf[yy * w + Math.min(xx + 1, w - 1)] - sdf[yy * w + Math.max(xx - 1, 0)]
          var gy = sdf[Math.min(yy + 1, h - 1) * w + xx] - sdf[Math.max(yy - 1, 0) * w + xx]
          var len = Math.sqrt(gx * gx + gy * gy) || 1
          var tRaw = clamp(1 - dist / band, 0, 1)
          var t = tRaw * tRaw * (3 - 2 * tRaw) // smoothstep
          dx = (gx / len) * amp * t
          dy = (gy / len) * amp * t
        }
        var R = Math.round(clamp(127.5 * (1 + dx / amp), 0, 255))
        var G = Math.round(clamp(127.5 * (1 + dy / amp), 0, 255))
        d[o] = R
        d[o + 1] = G
        d[o + 2] = 128
        d[o + 3] = 255
      }
    }
    ctx.putImageData(img, 0, 0)
    return cv.toDataURL('image/png')
  }

  function ensureFilter(slot) {
    if (slot.filterEl && defs.contains(slot.filterEl)) return
    var f = document.createElementNS('http://www.w3.org/2000/svg', 'filter')
    f.setAttribute('id', slot.filterId)
    f.setAttribute('x', '0')
    f.setAttribute('y', '0')
    f.setAttribute('width', '100%')
    f.setAttribute('height', '100%')
    f.setAttribute('color-interpolation-filters', 'sRGB')
    var imgEl = document.createElementNS('http://www.w3.org/2000/svg', 'feImage')
    imgEl.setAttribute('result', slot.filterId + '-map')
    imgEl.setAttribute('preserveAspectRatio', 'none')
    var disp = document.createElementNS('http://www.w3.org/2000/svg', 'feDisplacementMap')
    disp.setAttribute('in', 'SourceGraphic')
    disp.setAttribute('in2', slot.filterId + '-map')
    disp.setAttribute('xChannelSelector', 'R')
    disp.setAttribute('yChannelSelector', 'G')
    f.appendChild(imgEl)
    f.appendChild(disp)
    // Slightly different refraction per wavelength, recombined with screen.
    slot.channels = [disp]
    ;['red', 'green', 'blue'].forEach(function (channel, index) {
      var displacement = index === 0 ? disp : disp.cloneNode()
      displacement.setAttribute('result', slot.filterId + '-' + channel)
      if (index > 0) f.appendChild(displacement)
      if (index > 0) slot.channels.push(displacement)
      var matrix = document.createElementNS('http://www.w3.org/2000/svg', 'feColorMatrix')
      matrix.setAttribute('in', slot.filterId + '-' + channel)
      matrix.setAttribute('type', 'matrix')
      matrix.setAttribute('values', index === 0 ? '1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0' : index === 1 ? '0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0' : '0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0')
      matrix.setAttribute('result', slot.filterId + '-' + channel + '-only')
      f.appendChild(matrix)
    })
    var blend = document.createElementNS('http://www.w3.org/2000/svg', 'feBlend')
    blend.setAttribute('in', slot.filterId + '-red-only')
    blend.setAttribute('in2', slot.filterId + '-green-only')
    blend.setAttribute('mode', 'screen')
    blend.setAttribute('result', slot.filterId + '-rg')
    f.appendChild(blend)
    var finalBlend = blend.cloneNode()
    finalBlend.setAttribute('in', slot.filterId + '-rg')
    finalBlend.setAttribute('in2', slot.filterId + '-blue-only')
    finalBlend.removeAttribute('result')
    f.appendChild(finalBlend)
    defs.appendChild(f)
    slot.filterEl = f
    slot.feImage = imgEl
    slot.disp = disp
  }

  function paint(slot, el) {
    var w = Math.max(1, Math.round(el.offsetWidth))
    var h = Math.max(1, Math.round(el.offsetHeight))
    var r = radiusOf(el)
    var band = clamp(Math.round(Math.min(w, h) * 0.12), 10, 24)
    var amp = clamp(Math.round(band * 0.75), 8, 18)
    var map = buildMap(w, h, r, band, amp)
    ensureFilter(slot)
    slot.feImage.setAttribute('href', map)
    slot.feImage.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', map)
    slot.channels.forEach(function (channel, index) { channel.setAttribute('scale', String(amp * 2 + index * 1.5)) })
    slot.mapBytes = map.length
    slot.w = w
    slot.h = h
    var v = BASE + ' url(#' + slot.filterId + ')'
    el.style.setProperty('-webkit-backdrop-filter', v, 'important')
    el.style.setProperty('backdrop-filter', v, 'important')
    el.setAttribute(ATTR, slot.filterId.replace('lg-disp-', ''))
  }

  function detach(slot) {
    if (slot.el && slot.pointer) {
      slot.el.removeEventListener('pointermove', slot.pointer)
      slot.el.removeEventListener('pointerleave', slot.leave)
    }
    if (slot.frame) { cancelAnimationFrame(slot.frame); slot.frame = 0 }
    if (slot.ro) { try { slot.ro.disconnect() } catch (e) {} slot.ro = 0 }
    if (slot.timer) { clearTimeout(slot.timer); slot.timer = 0 }
    if (slot.el) {
      slot.previous.forEach(function (entry) {
        if (entry.value) slot.el.style.setProperty(entry.name, entry.value, entry.priority)
        else slot.el.style.removeProperty(entry.name)
      })
      if (slot.previousAttr === null) slot.el.removeAttribute(ATTR)
      else slot.el.setAttribute(ATTR, slot.previousAttr)
    }
    slot.el = 0
  }

  function attach(slot, el) {
    slot.el = el
    slot.previous = ['backdrop-filter', '-webkit-backdrop-filter', '--lg-pointer-x', '--lg-pointer-y'].map(function (name) {
      return { name: name, value: el.style.getPropertyValue(name), priority: el.style.getPropertyPriority(name) }
    })
    slot.previousAttr = el.getAttribute(ATTR)
    slot.pointer = function (event) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      slot.pointerX = event.clientX
      slot.pointerY = event.clientY
      if (slot.frame) return
      slot.frame = requestAnimationFrame(function () {
        slot.frame = 0
        var rect = el.getBoundingClientRect()
        el.style.setProperty('--lg-pointer-x', (100 * (slot.pointerX - rect.left) / rect.width) + '%')
        el.style.setProperty('--lg-pointer-y', (100 * (slot.pointerY - rect.top) / rect.height) + '%')
      })
    }
    slot.leave = function () {
      if (slot.frame) { cancelAnimationFrame(slot.frame); slot.frame = 0 }
      el.style.removeProperty('--lg-pointer-x')
      el.style.removeProperty('--lg-pointer-y')
    }
    el.addEventListener('pointermove', slot.pointer, { passive: true })
    el.addEventListener('pointerleave', slot.leave)
    ensureFilter(slot)
    paint(slot, el)
    if (typeof ResizeObserver !== 'undefined') {
      slot.ro = new ResizeObserver(function () {
        if (slot.timer) clearTimeout(slot.timer)
        slot.timer = setTimeout(function () {
          slot.timer = 0
          if (slot.el && document.body.contains(slot.el)) paint(slot, slot.el)
        }, 150)
      })
      slot.ro.observe(el)
    }
  }

  function rescan() {
    if (!supportsRefraction()) return
    ensureSvg()
    for (var i = 0; i < TARGETS.length; i++) {
      var slot = slots[i]
      var el
      try { el = document.querySelector(TARGETS[i]) } catch (e) { el = null }
      if (el === slot.el) continue
      detach(slot)
      if (el) attach(slot, el)
    }
  }

  function scheduleScan() {
    if (scanTimer) return
    scanTimer = setTimeout(function () {
      scanTimer = 0
      rescan()
    }, 250)
  }

  function install() {
    if (!material) {
      material = document.createElement('link')
      material.rel = 'stylesheet'
      material.href = new URL('./optics.css?v=2', import.meta.url).href
      material.onload = function () { if (installed) slots.forEach(function (slot) { if (slot.el) paint(slot, slot.el) }) }
      document.head.appendChild(material)
    }
    if (!supportsRefraction()) return false
    ensureSvg()
    if (!installed) {
      installed = true
      rescan()
      try {
        domObs = new MutationObserver(scheduleScan)
        domObs.observe(document.documentElement, { childList: true, subtree: true })
      } catch (e) {}
    } else {
      rescan()
    }
    return true
  }

  function uninstall() {
    if (material) { material.onload = null; material.remove(); material = null }
    for (var i = 0; i < slots.length; i++) detach(slots[i])
    if (domObs) { try { domObs.disconnect() } catch (e) {} domObs = 0 }
    if (scanTimer) { clearTimeout(scanTimer); scanTimer = 0 }
    installed = false
    if (svg) svg.remove()
    svg = null
    defs = null
    slots.forEach(function (slot) { slot.filterEl = null; slot.feImage = null; slot.disp = null })
  }

  function diag() {
    var out = { supported: supportsRefraction(), installed: installed, targets: [] }
    for (var i = 0; i < slots.length; i++) {
      var s = slots[i]
      out.targets.push({
        sel: TARGETS[i],
        id: s.filterId,
        live: !!(s.el && document.body.contains(s.el)),
        w: s.w || 0,
        h: s.h || 0,
        mapBytes: s.mapBytes || 0,
        inline: s.el ? s.el.style.getPropertyValue('backdrop-filter') : '',
      })
    }
    out.filtersInDom = !!(svg && document.getElementById('lg-disp-0'))
    return out
  }

  for (var i = 0; i < TARGETS.length; i++) {
    slots.push({
      sel: TARGETS[i],
      filterId: 'lg-disp-' + i,
      el: 0,
      filterEl: 0,
      feImage: 0,
      disp: 0,
      ro: 0,
      timer: 0,
      w: 0,
      h: 0,
      mapBytes: 0,
    })
  }

  var api = { install: install, uninstall: uninstall, diag: diag, supports: supportsRefraction }
  if (typeof window !== 'undefined') {
    window.__0KAY_LIQUID__ = api
  }
})()

// Host bootstrap contract (WebUI uiPatches `bootstrap` target): the host
// imports this module once at startup and calls install({ plugin, id }).
export function install() {
  if (typeof window !== 'undefined' && window.__0KAY_LIQUID__) {
    return window.__0KAY_LIQUID__.install()
  }
  return false
}

export default install

export function uninstall() {
  if (typeof window !== 'undefined' && window.__0KAY_LIQUID__) window.__0KAY_LIQUID__.uninstall()
}
