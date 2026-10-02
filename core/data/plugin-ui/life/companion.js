import { defineComponent as yo, ref as J, computed as dt, watch as oi, nextTick as xi, onMounted as Sn, onUnmounted as wo, openBlock as T, createElementBlock as k, mergeProps as ms, createElementVNode as a, unref as Ki, toDisplayString as v, normalizeClass as Pe, createBlock as vs, Teleport as gs, createVNode as ee, Transition as ys, withCtx as ws, withModifiers as go, normalizeStyle as Yi, Fragment as Tt, renderList as jt, createCommentVNode as K, createTextVNode as te, withDirectives as x, vModelText as j, vShow as Ji, vModelCheckbox as pt, createStaticVNode as bs } from "vue";
import { _ as xs, u as Ls, a as Ps } from "./assets/_plugin-vue_export-helper-Bl_tmTjg.js";
var Ts = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function ks(kt) {
  return kt && kt.__esModule && Object.prototype.hasOwnProperty.call(kt, "default") ? kt.default : kt;
}
var zn = { exports: {} };
/* @preserve
 * Leaflet 1.9.4, a JS library for interactive maps. https://leafletjs.com
 * (c) 2010-2023 Vladimir Agafonkin, (c) 2010-2011 CloudMade
 */
(function(kt, ce) {
  (function(c, Et) {
    Et(ce);
  })(Ts, function(c) {
    var Et = "1.9.4";
    function G(t) {
      var e, i, n, o;
      for (i = 1, n = arguments.length; i < n; i++) {
        o = arguments[i];
        for (e in o)
          t[e] = o[e];
      }
      return t;
    }
    var At = Object.create || /* @__PURE__ */ function() {
      function t() {
      }
      return function(e) {
        return t.prototype = e, new t();
      };
    }();
    function F(t, e) {
      var i = Array.prototype.slice;
      if (t.bind)
        return t.bind.apply(t, i.call(arguments, 1));
      var n = i.call(arguments, 2);
      return function() {
        return t.apply(e, n.length ? n.concat(i.call(arguments)) : arguments);
      };
    }
    var Gt = 0;
    function N(t) {
      return "_leaflet_id" in t || (t._leaflet_id = ++Gt), t._leaflet_id;
    }
    function tt(t, e, i) {
      var n, o, r, l;
      return l = function() {
        n = !1, o && (r.apply(i, o), o = !1);
      }, r = function() {
        n ? o = arguments : (t.apply(i, arguments), setTimeout(l, e), n = !0);
      }, r;
    }
    function ut(t, e, i) {
      var n = e[1], o = e[0], r = n - o;
      return t === n && i ? t : ((t - o) % r + r) % r + o;
    }
    function ot() {
      return !1;
    }
    function _t(t, e) {
      if (e === !1)
        return t;
      var i = Math.pow(10, e === void 0 ? 6 : e);
      return Math.round(t * i) / i;
    }
    function Ct(t) {
      return t.trim ? t.trim() : t.replace(/^\s+|\s+$/g, "");
    }
    function ht(t) {
      return Ct(t).split(/\s+/);
    }
    function Y(t, e) {
      Object.prototype.hasOwnProperty.call(t, "options") || (t.options = t.options ? At(t.options) : {});
      for (var i in e)
        t.options[i] = e[i];
      return t.options;
    }
    function qt(t, e, i) {
      var n = [];
      for (var o in t)
        n.push(encodeURIComponent(i ? o.toUpperCase() : o) + "=" + encodeURIComponent(t[o]));
      return (!e || e.indexOf("?") === -1 ? "?" : "&") + n.join("&");
    }
    var Ve = /\{ *([\w_ -]+) *\}/g;
    function $t(t, e) {
      return t.replace(Ve, function(i, n) {
        var o = e[n];
        if (o === void 0)
          throw new Error("No value provided for variable " + i);
        return typeof o == "function" && (o = o(e)), o;
      });
    }
    var mt = Array.isArray || function(t) {
      return Object.prototype.toString.call(t) === "[object Array]";
    };
    function ie(t, e) {
      for (var i = 0; i < t.length; i++)
        if (t[i] === e)
          return i;
      return -1;
    }
    var Kt = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
    function ne(t) {
      return window["webkit" + t] || window["moz" + t] || window["ms" + t];
    }
    var Ue = 0;
    function Te(t) {
      var e = +/* @__PURE__ */ new Date(), i = Math.max(0, 16 - (e - Ue));
      return Ue = e + i, window.setTimeout(t, i);
    }
    var fe = window.requestAnimationFrame || ne("RequestAnimationFrame") || Te, g = window.cancelAnimationFrame || ne("CancelAnimationFrame") || ne("CancelRequestAnimationFrame") || function(t) {
      window.clearTimeout(t);
    };
    function z(t, e, i) {
      if (i && fe === Te)
        t.call(e);
      else
        return fe.call(window, F(t, e));
    }
    function H(t) {
      t && g.call(window, t);
    }
    var it = {
      __proto__: null,
      extend: G,
      create: At,
      bind: F,
      get lastId() {
        return Gt;
      },
      stamp: N,
      throttle: tt,
      wrapNum: ut,
      falseFn: ot,
      formatNum: _t,
      trim: Ct,
      splitWords: ht,
      setOptions: Y,
      getParamString: qt,
      template: $t,
      isArray: mt,
      indexOf: ie,
      emptyImageUrl: Kt,
      requestFn: fe,
      cancelFn: g,
      requestAnimFrame: z,
      cancelAnimFrame: H
    };
    function yt() {
    }
    yt.extend = function(t) {
      var e = function() {
        Y(this), this.initialize && this.initialize.apply(this, arguments), this.callInitHooks();
      }, i = e.__super__ = this.prototype, n = At(i);
      n.constructor = e, e.prototype = n;
      for (var o in this)
        Object.prototype.hasOwnProperty.call(this, o) && o !== "prototype" && o !== "__super__" && (e[o] = this[o]);
      return t.statics && G(e, t.statics), t.includes && (Fe(t.includes), G.apply(null, [n].concat(t.includes))), G(n, t), delete n.statics, delete n.includes, n.options && (n.options = i.options ? At(i.options) : {}, G(n.options, t.options)), n._initHooks = [], n.callInitHooks = function() {
        if (!this._initHooksCalled) {
          i.callInitHooks && i.callInitHooks.call(this), this._initHooksCalled = !0;
          for (var r = 0, l = n._initHooks.length; r < l; r++)
            n._initHooks[r].call(this);
        }
      }, e;
    }, yt.include = function(t) {
      var e = this.prototype.options;
      return G(this.prototype, t), t.options && (this.prototype.options = e, this.mergeOptions(t.options)), this;
    }, yt.mergeOptions = function(t) {
      return G(this.prototype.options, t), this;
    }, yt.addInitHook = function(t) {
      var e = Array.prototype.slice.call(arguments, 1), i = typeof t == "function" ? t : function() {
        this[t].apply(this, e);
      };
      return this.prototype._initHooks = this.prototype._initHooks || [], this.prototype._initHooks.push(i), this;
    };
    function Fe(t) {
      if (!(typeof L > "u" || !L || !L.Mixin)) {
        t = mt(t) ? t : [t];
        for (var e = 0; e < t.length; e++)
          t[e] === L.Mixin.Events && console.warn("Deprecated include of L.Mixin.Events: this property will be removed in future releases, please inherit from L.Evented instead.", new Error().stack);
      }
    }
    var wt = {
      /* @method on(type: String, fn: Function, context?: Object): this
       * Adds a listener function (`fn`) to a particular event type of the object. You can optionally specify the context of the listener (object the this keyword will point to). You can also pass several space-separated types (e.g. `'click dblclick'`).
       *
       * @alternative
       * @method on(eventMap: Object): this
       * Adds a set of type/listener pairs, e.g. `{click: onClick, mousemove: onMouseMove}`
       */
      on: function(t, e, i) {
        if (typeof t == "object")
          for (var n in t)
            this._on(n, t[n], e);
        else {
          t = ht(t);
          for (var o = 0, r = t.length; o < r; o++)
            this._on(t[o], e, i);
        }
        return this;
      },
      /* @method off(type: String, fn?: Function, context?: Object): this
       * Removes a previously added listener function. If no function is specified, it will remove all the listeners of that particular event from the object. Note that if you passed a custom context to `on`, you must pass the same context to `off` in order to remove the listener.
       *
       * @alternative
       * @method off(eventMap: Object): this
       * Removes a set of type/listener pairs.
       *
       * @alternative
       * @method off: this
       * Removes all listeners to all events on the object. This includes implicitly attached events.
       */
      off: function(t, e, i) {
        if (!arguments.length)
          delete this._events;
        else if (typeof t == "object")
          for (var n in t)
            this._off(n, t[n], e);
        else {
          t = ht(t);
          for (var o = arguments.length === 1, r = 0, l = t.length; r < l; r++)
            o ? this._off(t[r]) : this._off(t[r], e, i);
        }
        return this;
      },
      // attach listener (without syntactic sugar now)
      _on: function(t, e, i, n) {
        if (typeof e != "function") {
          console.warn("wrong listener type: " + typeof e);
          return;
        }
        if (this._listens(t, e, i) === !1) {
          i === this && (i = void 0);
          var o = { fn: e, ctx: i };
          n && (o.once = !0), this._events = this._events || {}, this._events[t] = this._events[t] || [], this._events[t].push(o);
        }
      },
      _off: function(t, e, i) {
        var n, o, r;
        if (this._events && (n = this._events[t], !!n)) {
          if (arguments.length === 1) {
            if (this._firingCount)
              for (o = 0, r = n.length; o < r; o++)
                n[o].fn = ot;
            delete this._events[t];
            return;
          }
          if (typeof e != "function") {
            console.warn("wrong listener type: " + typeof e);
            return;
          }
          var l = this._listens(t, e, i);
          if (l !== !1) {
            var h = n[l];
            this._firingCount && (h.fn = ot, this._events[t] = n = n.slice()), n.splice(l, 1);
          }
        }
      },
      // @method fire(type: String, data?: Object, propagate?: Boolean): this
      // Fires an event of the specified type. You can optionally provide a data
      // object — the first argument of the listener function will contain its
      // properties. The event can optionally be propagated to event parents.
      fire: function(t, e, i) {
        if (!this.listens(t, i))
          return this;
        var n = G({}, e, {
          type: t,
          target: this,
          sourceTarget: e && e.sourceTarget || this
        });
        if (this._events) {
          var o = this._events[t];
          if (o) {
            this._firingCount = this._firingCount + 1 || 1;
            for (var r = 0, l = o.length; r < l; r++) {
              var h = o[r], d = h.fn;
              h.once && this.off(t, d, h.ctx), d.call(h.ctx || this, n);
            }
            this._firingCount--;
          }
        }
        return i && this._propagateEvent(n), this;
      },
      // @method listens(type: String, propagate?: Boolean): Boolean
      // @method listens(type: String, fn: Function, context?: Object, propagate?: Boolean): Boolean
      // Returns `true` if a particular event type has any listeners attached to it.
      // The verification can optionally be propagated, it will return `true` if parents have the listener attached to it.
      listens: function(t, e, i, n) {
        typeof t != "string" && console.warn('"string" type argument expected');
        var o = e;
        typeof e != "function" && (n = !!e, o = void 0, i = void 0);
        var r = this._events && this._events[t];
        if (r && r.length && this._listens(t, o, i) !== !1)
          return !0;
        if (n) {
          for (var l in this._eventParents)
            if (this._eventParents[l].listens(t, e, i, n))
              return !0;
        }
        return !1;
      },
      // returns the index (number) or false
      _listens: function(t, e, i) {
        if (!this._events)
          return !1;
        var n = this._events[t] || [];
        if (!e)
          return !!n.length;
        i === this && (i = void 0);
        for (var o = 0, r = n.length; o < r; o++)
          if (n[o].fn === e && n[o].ctx === i)
            return o;
        return !1;
      },
      // @method once(…): this
      // Behaves as [`on(…)`](#evented-on), except the listener will only get fired once and then removed.
      once: function(t, e, i) {
        if (typeof t == "object")
          for (var n in t)
            this._on(n, t[n], e, !0);
        else {
          t = ht(t);
          for (var o = 0, r = t.length; o < r; o++)
            this._on(t[o], e, i, !0);
        }
        return this;
      },
      // @method addEventParent(obj: Evented): this
      // Adds an event parent - an `Evented` that will receive propagated events
      addEventParent: function(t) {
        return this._eventParents = this._eventParents || {}, this._eventParents[N(t)] = t, this;
      },
      // @method removeEventParent(obj: Evented): this
      // Removes an event parent, so it will stop receiving propagated events
      removeEventParent: function(t) {
        return this._eventParents && delete this._eventParents[N(t)], this;
      },
      _propagateEvent: function(t) {
        for (var e in this._eventParents)
          this._eventParents[e].fire(t.type, G({
            layer: t.target,
            propagatedFrom: t.target
          }, t), !0);
      }
    };
    wt.addEventListener = wt.on, wt.removeEventListener = wt.clearAllEventListeners = wt.off, wt.addOneTimeEventListener = wt.once, wt.fireEvent = wt.fire, wt.hasEventListeners = wt.listens;
    var Ut = yt.extend(wt);
    function C(t, e, i) {
      this.x = i ? Math.round(t) : t, this.y = i ? Math.round(e) : e;
    }
    var Ft = Math.trunc || function(t) {
      return t > 0 ? Math.floor(t) : Math.ceil(t);
    };
    C.prototype = {
      // @method clone(): Point
      // Returns a copy of the current point.
      clone: function() {
        return new C(this.x, this.y);
      },
      // @method add(otherPoint: Point): Point
      // Returns the result of addition of the current and the given points.
      add: function(t) {
        return this.clone()._add(I(t));
      },
      _add: function(t) {
        return this.x += t.x, this.y += t.y, this;
      },
      // @method subtract(otherPoint: Point): Point
      // Returns the result of subtraction of the given point from the current.
      subtract: function(t) {
        return this.clone()._subtract(I(t));
      },
      _subtract: function(t) {
        return this.x -= t.x, this.y -= t.y, this;
      },
      // @method divideBy(num: Number): Point
      // Returns the result of division of the current point by the given number.
      divideBy: function(t) {
        return this.clone()._divideBy(t);
      },
      _divideBy: function(t) {
        return this.x /= t, this.y /= t, this;
      },
      // @method multiplyBy(num: Number): Point
      // Returns the result of multiplication of the current point by the given number.
      multiplyBy: function(t) {
        return this.clone()._multiplyBy(t);
      },
      _multiplyBy: function(t) {
        return this.x *= t, this.y *= t, this;
      },
      // @method scaleBy(scale: Point): Point
      // Multiply each coordinate of the current point by each coordinate of
      // `scale`. In linear algebra terms, multiply the point by the
      // [scaling matrix](https://en.wikipedia.org/wiki/Scaling_%28geometry%29#Matrix_representation)
      // defined by `scale`.
      scaleBy: function(t) {
        return new C(this.x * t.x, this.y * t.y);
      },
      // @method unscaleBy(scale: Point): Point
      // Inverse of `scaleBy`. Divide each coordinate of the current point by
      // each coordinate of `scale`.
      unscaleBy: function(t) {
        return new C(this.x / t.x, this.y / t.y);
      },
      // @method round(): Point
      // Returns a copy of the current point with rounded coordinates.
      round: function() {
        return this.clone()._round();
      },
      _round: function() {
        return this.x = Math.round(this.x), this.y = Math.round(this.y), this;
      },
      // @method floor(): Point
      // Returns a copy of the current point with floored coordinates (rounded down).
      floor: function() {
        return this.clone()._floor();
      },
      _floor: function() {
        return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this;
      },
      // @method ceil(): Point
      // Returns a copy of the current point with ceiled coordinates (rounded up).
      ceil: function() {
        return this.clone()._ceil();
      },
      _ceil: function() {
        return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this;
      },
      // @method trunc(): Point
      // Returns a copy of the current point with truncated coordinates (rounded towards zero).
      trunc: function() {
        return this.clone()._trunc();
      },
      _trunc: function() {
        return this.x = Ft(this.x), this.y = Ft(this.y), this;
      },
      // @method distanceTo(otherPoint: Point): Number
      // Returns the cartesian distance between the current and the given points.
      distanceTo: function(t) {
        t = I(t);
        var e = t.x - this.x, i = t.y - this.y;
        return Math.sqrt(e * e + i * i);
      },
      // @method equals(otherPoint: Point): Boolean
      // Returns `true` if the given point has the same coordinates.
      equals: function(t) {
        return t = I(t), t.x === this.x && t.y === this.y;
      },
      // @method contains(otherPoint: Point): Boolean
      // Returns `true` if both coordinates of the given point are less than the corresponding current point coordinates (in absolute values).
      contains: function(t) {
        return t = I(t), Math.abs(t.x) <= Math.abs(this.x) && Math.abs(t.y) <= Math.abs(this.y);
      },
      // @method toString(): String
      // Returns a string representation of the point for debugging purposes.
      toString: function() {
        return "Point(" + _t(this.x) + ", " + _t(this.y) + ")";
      }
    };
    function I(t, e, i) {
      return t instanceof C ? t : mt(t) ? new C(t[0], t[1]) : t == null ? t : typeof t == "object" && "x" in t && "y" in t ? new C(t.x, t.y) : new C(t, e, i);
    }
    function rt(t, e) {
      if (t)
        for (var i = e ? [t, e] : t, n = 0, o = i.length; n < o; n++)
          this.extend(i[n]);
    }
    rt.prototype = {
      // @method extend(point: Point): this
      // Extends the bounds to contain the given point.
      // @alternative
      // @method extend(otherBounds: Bounds): this
      // Extend the bounds to contain the given bounds
      extend: function(t) {
        var e, i;
        if (!t)
          return this;
        if (t instanceof C || typeof t[0] == "number" || "x" in t)
          e = i = I(t);
        else if (t = Mt(t), e = t.min, i = t.max, !e || !i)
          return this;
        return !this.min && !this.max ? (this.min = e.clone(), this.max = i.clone()) : (this.min.x = Math.min(e.x, this.min.x), this.max.x = Math.max(i.x, this.max.x), this.min.y = Math.min(e.y, this.min.y), this.max.y = Math.max(i.y, this.max.y)), this;
      },
      // @method getCenter(round?: Boolean): Point
      // Returns the center point of the bounds.
      getCenter: function(t) {
        return I(
          (this.min.x + this.max.x) / 2,
          (this.min.y + this.max.y) / 2,
          t
        );
      },
      // @method getBottomLeft(): Point
      // Returns the bottom-left point of the bounds.
      getBottomLeft: function() {
        return I(this.min.x, this.max.y);
      },
      // @method getTopRight(): Point
      // Returns the top-right point of the bounds.
      getTopRight: function() {
        return I(this.max.x, this.min.y);
      },
      // @method getTopLeft(): Point
      // Returns the top-left point of the bounds (i.e. [`this.min`](#bounds-min)).
      getTopLeft: function() {
        return this.min;
      },
      // @method getBottomRight(): Point
      // Returns the bottom-right point of the bounds (i.e. [`this.max`](#bounds-max)).
      getBottomRight: function() {
        return this.max;
      },
      // @method getSize(): Point
      // Returns the size of the given bounds
      getSize: function() {
        return this.max.subtract(this.min);
      },
      // @method contains(otherBounds: Bounds): Boolean
      // Returns `true` if the rectangle contains the given one.
      // @alternative
      // @method contains(point: Point): Boolean
      // Returns `true` if the rectangle contains the given point.
      contains: function(t) {
        var e, i;
        return typeof t[0] == "number" || t instanceof C ? t = I(t) : t = Mt(t), t instanceof rt ? (e = t.min, i = t.max) : e = i = t, e.x >= this.min.x && i.x <= this.max.x && e.y >= this.min.y && i.y <= this.max.y;
      },
      // @method intersects(otherBounds: Bounds): Boolean
      // Returns `true` if the rectangle intersects the given bounds. Two bounds
      // intersect if they have at least one point in common.
      intersects: function(t) {
        t = Mt(t);
        var e = this.min, i = this.max, n = t.min, o = t.max, r = o.x >= e.x && n.x <= i.x, l = o.y >= e.y && n.y <= i.y;
        return r && l;
      },
      // @method overlaps(otherBounds: Bounds): Boolean
      // Returns `true` if the rectangle overlaps the given bounds. Two bounds
      // overlap if their intersection is an area.
      overlaps: function(t) {
        t = Mt(t);
        var e = this.min, i = this.max, n = t.min, o = t.max, r = o.x > e.x && n.x < i.x, l = o.y > e.y && n.y < i.y;
        return r && l;
      },
      // @method isValid(): Boolean
      // Returns `true` if the bounds are properly initialized.
      isValid: function() {
        return !!(this.min && this.max);
      },
      // @method pad(bufferRatio: Number): Bounds
      // Returns bounds created by extending or retracting the current bounds by a given ratio in each direction.
      // For example, a ratio of 0.5 extends the bounds by 50% in each direction.
      // Negative values will retract the bounds.
      pad: function(t) {
        var e = this.min, i = this.max, n = Math.abs(e.x - i.x) * t, o = Math.abs(e.y - i.y) * t;
        return Mt(
          I(e.x - n, e.y - o),
          I(i.x + n, i.y + o)
        );
      },
      // @method equals(otherBounds: Bounds): Boolean
      // Returns `true` if the rectangle is equivalent to the given bounds.
      equals: function(t) {
        return t ? (t = Mt(t), this.min.equals(t.getTopLeft()) && this.max.equals(t.getBottomRight())) : !1;
      }
    };
    function Mt(t, e) {
      return !t || t instanceof rt ? t : new rt(t, e);
    }
    function Lt(t, e) {
      if (t)
        for (var i = e ? [t, e] : t, n = 0, o = i.length; n < o; n++)
          this.extend(i[n]);
    }
    Lt.prototype = {
      // @method extend(latlng: LatLng): this
      // Extend the bounds to contain the given point
      // @alternative
      // @method extend(otherBounds: LatLngBounds): this
      // Extend the bounds to contain the given bounds
      extend: function(t) {
        var e = this._southWest, i = this._northEast, n, o;
        if (t instanceof X)
          n = t, o = t;
        else if (t instanceof Lt) {
          if (n = t._southWest, o = t._northEast, !n || !o)
            return this;
        } else
          return t ? this.extend(W(t) || ct(t)) : this;
        return !e && !i ? (this._southWest = new X(n.lat, n.lng), this._northEast = new X(o.lat, o.lng)) : (e.lat = Math.min(n.lat, e.lat), e.lng = Math.min(n.lng, e.lng), i.lat = Math.max(o.lat, i.lat), i.lng = Math.max(o.lng, i.lng)), this;
      },
      // @method pad(bufferRatio: Number): LatLngBounds
      // Returns bounds created by extending or retracting the current bounds by a given ratio in each direction.
      // For example, a ratio of 0.5 extends the bounds by 50% in each direction.
      // Negative values will retract the bounds.
      pad: function(t) {
        var e = this._southWest, i = this._northEast, n = Math.abs(e.lat - i.lat) * t, o = Math.abs(e.lng - i.lng) * t;
        return new Lt(
          new X(e.lat - n, e.lng - o),
          new X(i.lat + n, i.lng + o)
        );
      },
      // @method getCenter(): LatLng
      // Returns the center point of the bounds.
      getCenter: function() {
        return new X(
          (this._southWest.lat + this._northEast.lat) / 2,
          (this._southWest.lng + this._northEast.lng) / 2
        );
      },
      // @method getSouthWest(): LatLng
      // Returns the south-west point of the bounds.
      getSouthWest: function() {
        return this._southWest;
      },
      // @method getNorthEast(): LatLng
      // Returns the north-east point of the bounds.
      getNorthEast: function() {
        return this._northEast;
      },
      // @method getNorthWest(): LatLng
      // Returns the north-west point of the bounds.
      getNorthWest: function() {
        return new X(this.getNorth(), this.getWest());
      },
      // @method getSouthEast(): LatLng
      // Returns the south-east point of the bounds.
      getSouthEast: function() {
        return new X(this.getSouth(), this.getEast());
      },
      // @method getWest(): Number
      // Returns the west longitude of the bounds
      getWest: function() {
        return this._southWest.lng;
      },
      // @method getSouth(): Number
      // Returns the south latitude of the bounds
      getSouth: function() {
        return this._southWest.lat;
      },
      // @method getEast(): Number
      // Returns the east longitude of the bounds
      getEast: function() {
        return this._northEast.lng;
      },
      // @method getNorth(): Number
      // Returns the north latitude of the bounds
      getNorth: function() {
        return this._northEast.lat;
      },
      // @method contains(otherBounds: LatLngBounds): Boolean
      // Returns `true` if the rectangle contains the given one.
      // @alternative
      // @method contains (latlng: LatLng): Boolean
      // Returns `true` if the rectangle contains the given point.
      contains: function(t) {
        typeof t[0] == "number" || t instanceof X || "lat" in t ? t = W(t) : t = ct(t);
        var e = this._southWest, i = this._northEast, n, o;
        return t instanceof Lt ? (n = t.getSouthWest(), o = t.getNorthEast()) : n = o = t, n.lat >= e.lat && o.lat <= i.lat && n.lng >= e.lng && o.lng <= i.lng;
      },
      // @method intersects(otherBounds: LatLngBounds): Boolean
      // Returns `true` if the rectangle intersects the given bounds. Two bounds intersect if they have at least one point in common.
      intersects: function(t) {
        t = ct(t);
        var e = this._southWest, i = this._northEast, n = t.getSouthWest(), o = t.getNorthEast(), r = o.lat >= e.lat && n.lat <= i.lat, l = o.lng >= e.lng && n.lng <= i.lng;
        return r && l;
      },
      // @method overlaps(otherBounds: LatLngBounds): Boolean
      // Returns `true` if the rectangle overlaps the given bounds. Two bounds overlap if their intersection is an area.
      overlaps: function(t) {
        t = ct(t);
        var e = this._southWest, i = this._northEast, n = t.getSouthWest(), o = t.getNorthEast(), r = o.lat > e.lat && n.lat < i.lat, l = o.lng > e.lng && n.lng < i.lng;
        return r && l;
      },
      // @method toBBoxString(): String
      // Returns a string with bounding box coordinates in a 'southwest_lng,southwest_lat,northeast_lng,northeast_lat' format. Useful for sending requests to web services that return geo data.
      toBBoxString: function() {
        return [this.getWest(), this.getSouth(), this.getEast(), this.getNorth()].join(",");
      },
      // @method equals(otherBounds: LatLngBounds, maxMargin?: Number): Boolean
      // Returns `true` if the rectangle is equivalent (within a small margin of error) to the given bounds. The margin of error can be overridden by setting `maxMargin` to a small number.
      equals: function(t, e) {
        return t ? (t = ct(t), this._southWest.equals(t.getSouthWest(), e) && this._northEast.equals(t.getNorthEast(), e)) : !1;
      },
      // @method isValid(): Boolean
      // Returns `true` if the bounds are properly initialized.
      isValid: function() {
        return !!(this._southWest && this._northEast);
      }
    };
    function ct(t, e) {
      return t instanceof Lt ? t : new Lt(t, e);
    }
    function X(t, e, i) {
      if (isNaN(t) || isNaN(e))
        throw new Error("Invalid LatLng object: (" + t + ", " + e + ")");
      this.lat = +t, this.lng = +e, i !== void 0 && (this.alt = +i);
    }
    X.prototype = {
      // @method equals(otherLatLng: LatLng, maxMargin?: Number): Boolean
      // Returns `true` if the given `LatLng` point is at the same position (within a small margin of error). The margin of error can be overridden by setting `maxMargin` to a small number.
      equals: function(t, e) {
        if (!t)
          return !1;
        t = W(t);
        var i = Math.max(
          Math.abs(this.lat - t.lat),
          Math.abs(this.lng - t.lng)
        );
        return i <= (e === void 0 ? 1e-9 : e);
      },
      // @method toString(): String
      // Returns a string representation of the point (for debugging purposes).
      toString: function(t) {
        return "LatLng(" + _t(this.lat, t) + ", " + _t(this.lng, t) + ")";
      },
      // @method distanceTo(otherLatLng: LatLng): Number
      // Returns the distance (in meters) to the given `LatLng` calculated using the [Spherical Law of Cosines](https://en.wikipedia.org/wiki/Spherical_law_of_cosines).
      distanceTo: function(t) {
        return Zt.distance(this, W(t));
      },
      // @method wrap(): LatLng
      // Returns a new `LatLng` object with the longitude wrapped so it's always between -180 and +180 degrees.
      wrap: function() {
        return Zt.wrapLatLng(this);
      },
      // @method toBounds(sizeInMeters: Number): LatLngBounds
      // Returns a new `LatLngBounds` object in which each boundary is `sizeInMeters/2` meters apart from the `LatLng`.
      toBounds: function(t) {
        var e = 180 * t / 40075017, i = e / Math.cos(Math.PI / 180 * this.lat);
        return ct(
          [this.lat - e, this.lng - i],
          [this.lat + e, this.lng + i]
        );
      },
      clone: function() {
        return new X(this.lat, this.lng, this.alt);
      }
    };
    function W(t, e, i) {
      return t instanceof X ? t : mt(t) && typeof t[0] != "object" ? t.length === 3 ? new X(t[0], t[1], t[2]) : t.length === 2 ? new X(t[0], t[1]) : null : t == null ? t : typeof t == "object" && "lat" in t ? new X(t.lat, "lng" in t ? t.lng : t.lon, t.alt) : e === void 0 ? null : new X(t, e, i);
    }
    var nt = {
      // @method latLngToPoint(latlng: LatLng, zoom: Number): Point
      // Projects geographical coordinates into pixel coordinates for a given zoom.
      latLngToPoint: function(t, e) {
        var i = this.projection.project(t), n = this.scale(e);
        return this.transformation._transform(i, n);
      },
      // @method pointToLatLng(point: Point, zoom: Number): LatLng
      // The inverse of `latLngToPoint`. Projects pixel coordinates on a given
      // zoom into geographical coordinates.
      pointToLatLng: function(t, e) {
        var i = this.scale(e), n = this.transformation.untransform(t, i);
        return this.projection.unproject(n);
      },
      // @method project(latlng: LatLng): Point
      // Projects geographical coordinates into coordinates in units accepted for
      // this CRS (e.g. meters for EPSG:3857, for passing it to WMS services).
      project: function(t) {
        return this.projection.project(t);
      },
      // @method unproject(point: Point): LatLng
      // Given a projected coordinate returns the corresponding LatLng.
      // The inverse of `project`.
      unproject: function(t) {
        return this.projection.unproject(t);
      },
      // @method scale(zoom: Number): Number
      // Returns the scale used when transforming projected coordinates into
      // pixel coordinates for a particular zoom. For example, it returns
      // `256 * 2^zoom` for Mercator-based CRS.
      scale: function(t) {
        return 256 * Math.pow(2, t);
      },
      // @method zoom(scale: Number): Number
      // Inverse of `scale()`, returns the zoom level corresponding to a scale
      // factor of `scale`.
      zoom: function(t) {
        return Math.log(t / 256) / Math.LN2;
      },
      // @method getProjectedBounds(zoom: Number): Bounds
      // Returns the projection's bounds scaled and transformed for the provided `zoom`.
      getProjectedBounds: function(t) {
        if (this.infinite)
          return null;
        var e = this.projection.bounds, i = this.scale(t), n = this.transformation.transform(e.min, i), o = this.transformation.transform(e.max, i);
        return new rt(n, o);
      },
      // @method distance(latlng1: LatLng, latlng2: LatLng): Number
      // Returns the distance between two geographical coordinates.
      // @property code: String
      // Standard code name of the CRS passed into WMS services (e.g. `'EPSG:3857'`)
      //
      // @property wrapLng: Number[]
      // An array of two numbers defining whether the longitude (horizontal) coordinate
      // axis wraps around a given range and how. Defaults to `[-180, 180]` in most
      // geographical CRSs. If `undefined`, the longitude axis does not wrap around.
      //
      // @property wrapLat: Number[]
      // Like `wrapLng`, but for the latitude (vertical) axis.
      // wrapLng: [min, max],
      // wrapLat: [min, max],
      // @property infinite: Boolean
      // If true, the coordinate space will be unbounded (infinite in both axes)
      infinite: !1,
      // @method wrapLatLng(latlng: LatLng): LatLng
      // Returns a `LatLng` where lat and lng has been wrapped according to the
      // CRS's `wrapLat` and `wrapLng` properties, if they are outside the CRS's bounds.
      wrapLatLng: function(t) {
        var e = this.wrapLng ? ut(t.lng, this.wrapLng, !0) : t.lng, i = this.wrapLat ? ut(t.lat, this.wrapLat, !0) : t.lat, n = t.alt;
        return new X(i, e, n);
      },
      // @method wrapLatLngBounds(bounds: LatLngBounds): LatLngBounds
      // Returns a `LatLngBounds` with the same size as the given one, ensuring
      // that its center is within the CRS's bounds.
      // Only accepts actual `L.LatLngBounds` instances, not arrays.
      wrapLatLngBounds: function(t) {
        var e = t.getCenter(), i = this.wrapLatLng(e), n = e.lat - i.lat, o = e.lng - i.lng;
        if (n === 0 && o === 0)
          return t;
        var r = t.getSouthWest(), l = t.getNorthEast(), h = new X(r.lat - n, r.lng - o), d = new X(l.lat - n, l.lng - o);
        return new Lt(h, d);
      }
    }, Zt = G({}, nt, {
      wrapLng: [-180, 180],
      // Mean Earth Radius, as recommended for use by
      // the International Union of Geodesy and Geophysics,
      // see https://rosettacode.org/wiki/Haversine_formula
      R: 6371e3,
      // distance between two geographical points using spherical law of cosines approximation
      distance: function(t, e) {
        var i = Math.PI / 180, n = t.lat * i, o = e.lat * i, r = Math.sin((e.lat - t.lat) * i / 2), l = Math.sin((e.lng - t.lng) * i / 2), h = r * r + Math.cos(n) * Math.cos(o) * l * l, d = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
        return this.R * d;
      }
    }), He = 6378137, We = {
      R: He,
      MAX_LATITUDE: 85.0511287798,
      project: function(t) {
        var e = Math.PI / 180, i = this.MAX_LATITUDE, n = Math.max(Math.min(i, t.lat), -i), o = Math.sin(n * e);
        return new C(
          this.R * t.lng * e,
          this.R * Math.log((1 + o) / (1 - o)) / 2
        );
      },
      unproject: function(t) {
        var e = 180 / Math.PI;
        return new X(
          (2 * Math.atan(Math.exp(t.y / this.R)) - Math.PI / 2) * e,
          t.x * e / this.R
        );
      },
      bounds: function() {
        var t = He * Math.PI;
        return new rt([-t, -t], [t, t]);
      }()
    };
    function je(t, e, i, n) {
      if (mt(t)) {
        this._a = t[0], this._b = t[1], this._c = t[2], this._d = t[3];
        return;
      }
      this._a = t, this._b = e, this._c = i, this._d = n;
    }
    je.prototype = {
      // @method transform(point: Point, scale?: Number): Point
      // Returns a transformed point, optionally multiplied by the given scale.
      // Only accepts actual `L.Point` instances, not arrays.
      transform: function(t, e) {
        return this._transform(t.clone(), e);
      },
      // destructive transform (faster)
      _transform: function(t, e) {
        return e = e || 1, t.x = e * (this._a * t.x + this._b), t.y = e * (this._c * t.y + this._d), t;
      },
      // @method untransform(point: Point, scale?: Number): Point
      // Returns the reverse transformation of the given point, optionally divided
      // by the given scale. Only accepts actual `L.Point` instances, not arrays.
      untransform: function(t, e) {
        return e = e || 1, new C(
          (t.x / e - this._b) / this._a,
          (t.y / e - this._d) / this._c
        );
      }
    };
    function oe(t, e, i, n) {
      return new je(t, e, i, n);
    }
    var m = G({}, Zt, {
      code: "EPSG:3857",
      projection: We,
      transformation: function() {
        var t = 0.5 / (Math.PI * We.R);
        return oe(t, 0.5, -t, 0.5);
      }()
    }), Ge = G({}, m, {
      code: "EPSG:900913"
    });
    function Li(t) {
      return document.createElementNS("http://www.w3.org/2000/svg", t);
    }
    function ke(t, e) {
      var i = "", n, o, r, l, h, d;
      for (n = 0, r = t.length; n < r; n++) {
        for (h = t[n], o = 0, l = h.length; o < l; o++)
          d = h[o], i += (o ? "L" : "M") + d.x + " " + d.y;
        i += e ? P.svg ? "z" : "x" : "";
      }
      return i || "M0 0";
    }
    var _e = document.documentElement.style, se = "ActiveXObject" in window, qe = se && !document.addEventListener, Ce = "msLaunchUri" in navigator && !("documentMode" in document), pe = It("webkit"), Me = It("android"), Se = It("android 2") || It("android 3"), Bt = parseInt(/WebKit\/([0-9]+)|$/.exec(navigator.userAgent)[1], 10), $e = Me && It("Google") && Bt < 537 && !("AudioNode" in window), si = !!window.opera, Nt = !Ce && It("chrome"), D = It("gecko") && !pe && !si && !se, Xi = !Nt && It("safari"), Pi = It("phantom"), Ti = "OTransition" in _e, ki = navigator.platform.indexOf("Win") === 0, Ci = se && "transition" in _e, bt = "WebKitCSSMatrix" in window && "m11" in new window.WebKitCSSMatrix() && !Se, ze = "MozPerspective" in _e, Ee = !window.L_DISABLE_3D && (Ci || bt || ze) && !Ti && !Pi, et = typeof orientation < "u" || It("mobile"), O = et && pe, ai = et && bt, ri = !window.PointerEvent && window.MSPointerEvent, li = !!(window.PointerEvent || ri), me = "ontouchstart" in window || !!window.TouchEvent, ve = !window.L_NO_TOUCH && (me || li), ge = et && si, ui = et && D, Jt = (window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI) > 1, Qi = function() {
      var t = !1;
      try {
        var e = Object.defineProperty({}, "passive", {
          get: function() {
            t = !0;
          }
        });
        window.addEventListener("testPassiveEventSupport", ot, e), window.removeEventListener("testPassiveEventSupport", ot, e);
      } catch {
      }
      return t;
    }(), tn = function() {
      return !!document.createElement("canvas").getContext;
    }(), ye = !!(document.createElementNS && Li("svg").createSVGRect), St = !!ye && function() {
      var t = document.createElement("div");
      return t.innerHTML = "<svg/>", (t.firstChild && t.firstChild.namespaceURI) === "http://www.w3.org/2000/svg";
    }(), Rt = !ye && function() {
      try {
        var t = document.createElement("div");
        t.innerHTML = '<v:shape adj="1"/>';
        var e = t.firstChild;
        return e.style.behavior = "url(#default#VML)", e && typeof e.adj == "object";
      } catch {
        return !1;
      }
    }(), en = navigator.platform.indexOf("Mac") === 0, nn = navigator.platform.indexOf("Linux") === 0;
    function It(t) {
      return navigator.userAgent.toLowerCase().indexOf(t) >= 0;
    }
    var P = {
      ie: se,
      ielt9: qe,
      edge: Ce,
      webkit: pe,
      android: Me,
      android23: Se,
      androidStock: $e,
      opera: si,
      chrome: Nt,
      gecko: D,
      safari: Xi,
      phantom: Pi,
      opera12: Ti,
      win: ki,
      ie3d: Ci,
      webkit3d: bt,
      gecko3d: ze,
      any3d: Ee,
      mobile: et,
      mobileWebkit: O,
      mobileWebkit3d: ai,
      msPointer: ri,
      pointer: li,
      touch: ve,
      touchNative: me,
      mobileOpera: ge,
      mobileGecko: ui,
      retina: Jt,
      passiveEvents: Qi,
      canvas: tn,
      svg: ye,
      vml: Rt,
      inlineSvg: St,
      mac: en,
      linux: nn
    }, Ke = P.msPointer ? "MSPointerDown" : "pointerdown", Mi = P.msPointer ? "MSPointerMove" : "pointermove", Oe = P.msPointer ? "MSPointerUp" : "pointerup", Si = P.msPointer ? "MSPointerCancel" : "pointercancel", hi = {
      touchstart: Ke,
      touchmove: Mi,
      touchend: Oe,
      touchcancel: Si
    }, zi = {
      touchstart: on,
      touchmove: Ye,
      touchend: Ye,
      touchcancel: Ye
    }, we = {}, Ze = !1;
    function st(t, e, i) {
      return e === "touchstart" && Je(), zi[e] ? (i = zi[e].bind(this, i), t.addEventListener(hi[e], i, !1), i) : (console.warn("wrong event specified:", e), ot);
    }
    function di(t, e, i) {
      if (!hi[e]) {
        console.warn("wrong event specified:", e);
        return;
      }
      t.removeEventListener(hi[e], i, !1);
    }
    function Ei(t) {
      we[t.pointerId] = t;
    }
    function Oi(t) {
      we[t.pointerId] && (we[t.pointerId] = t);
    }
    function Q(t) {
      delete we[t.pointerId];
    }
    function Je() {
      Ze || (document.addEventListener(Ke, Ei, !0), document.addEventListener(Mi, Oi, !0), document.addEventListener(Oe, Q, !0), document.addEventListener(Si, Q, !0), Ze = !0);
    }
    function Ye(t, e) {
      if (e.pointerType !== (e.MSPOINTER_TYPE_MOUSE || "mouse")) {
        e.touches = [];
        for (var i in we)
          e.touches.push(we[i]);
        e.changedTouches = [e], t(e);
      }
    }
    function on(t, e) {
      e.MSPOINTER_TYPE_TOUCH && e.pointerType === e.MSPOINTER_TYPE_TOUCH && Pt(e), Ye(t, e);
    }
    function Zi(t) {
      var e = {}, i, n;
      for (n in t)
        i = t[n], e[n] = i && i.bind ? i.bind(t) : i;
      return t = e, e.type = "dblclick", e.detail = 2, e.isTrusted = !1, e._simulated = !0, e;
    }
    var sn = 200;
    function an(t, e) {
      t.addEventListener("dblclick", e);
      var i = 0, n;
      function o(r) {
        if (r.detail !== 1) {
          n = r.detail;
          return;
        }
        if (!(r.pointerType === "mouse" || r.sourceCapabilities && !r.sourceCapabilities.firesTouchEvents)) {
          var l = Zn(r);
          if (!(l.some(function(d) {
            return d instanceof HTMLLabelElement && d.attributes.for;
          }) && !l.some(function(d) {
            return d instanceof HTMLInputElement || d instanceof HTMLSelectElement;
          }))) {
            var h = Date.now();
            h - i <= sn ? (n++, n === 2 && e(Zi(r))) : n = 1, i = h;
          }
        }
      }
      return t.addEventListener("click", o), {
        dblclick: e,
        simDblclick: o
      };
    }
    function p(t, e) {
      t.removeEventListener("dblclick", e.dblclick), t.removeEventListener("click", e.simDblclick);
    }
    var s = Ii(
      ["transform", "webkitTransform", "OTransform", "MozTransform", "msTransform"]
    ), u = Ii(
      ["webkitTransition", "transition", "OTransition", "MozTransition", "msTransition"]
    ), E = u === "webkitTransition" || u === "OTransition" ? u + "End" : "transitionend";
    function M(t) {
      return typeof t == "string" ? document.getElementById(t) : t;
    }
    function R(t, e) {
      var i = t.style[e] || t.currentStyle && t.currentStyle[e];
      if ((!i || i === "auto") && document.defaultView) {
        var n = document.defaultView.getComputedStyle(t, null);
        i = n ? n[e] : null;
      }
      return i === "auto" ? null : i;
    }
    function b(t, e, i) {
      var n = document.createElement(t);
      return n.className = e || "", i && i.appendChild(n), n;
    }
    function V(t) {
      var e = t.parentNode;
      e && e.removeChild(t);
    }
    function Ie(t) {
      for (; t.firstChild; )
        t.removeChild(t.firstChild);
    }
    function ae(t) {
      var e = t.parentNode;
      e && e.lastChild !== t && e.appendChild(t);
    }
    function re(t) {
      var e = t.parentNode;
      e && e.firstChild !== t && e.insertBefore(t, e.firstChild);
    }
    function _(t, e) {
      if (t.classList !== void 0)
        return t.classList.contains(e);
      var i = lt(t);
      return i.length > 0 && new RegExp("(^|\\s)" + e + "(\\s|$)").test(i);
    }
    function y(t, e) {
      if (t.classList !== void 0)
        for (var i = ht(e), n = 0, o = i.length; n < o; n++)
          t.classList.add(i[n]);
      else if (!_(t, e)) {
        var r = lt(t);
        ft(t, (r ? r + " " : "") + e);
      }
    }
    function A(t, e) {
      t.classList !== void 0 ? t.classList.remove(e) : ft(t, Ct((" " + lt(t) + " ").replace(" " + e + " ", " ")));
    }
    function ft(t, e) {
      t.className.baseVal === void 0 ? t.className = e : t.className.baseVal = e;
    }
    function lt(t) {
      return t.correspondingElement && (t = t.correspondingElement), t.className.baseVal === void 0 ? t.className : t.className.baseVal;
    }
    function $(t, e) {
      "opacity" in t.style ? t.style.opacity = e : "filter" in t.style && bo(t, e);
    }
    function bo(t, e) {
      var i = !1, n = "DXImageTransform.Microsoft.Alpha";
      try {
        i = t.filters.item(n);
      } catch {
        if (e === 1)
          return;
      }
      e = Math.round(e * 100), i ? (i.Enabled = e !== 100, i.Opacity = e) : t.style.filter += " progid:" + n + "(opacity=" + e + ")";
    }
    function Ii(t) {
      for (var e = document.documentElement.style, i = 0; i < t.length; i++)
        if (t[i] in e)
          return t[i];
      return !1;
    }
    function Ae(t, e, i) {
      var n = e || new C(0, 0);
      t.style[s] = (P.ie3d ? "translate(" + n.x + "px," + n.y + "px)" : "translate3d(" + n.x + "px," + n.y + "px,0)") + (i ? " scale(" + i + ")" : "");
    }
    function vt(t, e) {
      t._leaflet_pos = e, P.any3d ? Ae(t, e) : (t.style.left = e.x + "px", t.style.top = e.y + "px");
    }
    function Be(t) {
      return t._leaflet_pos || new C(0, 0);
    }
    var ci, fi, rn;
    if ("onselectstart" in document)
      ci = function() {
        B(window, "selectstart", Pt);
      }, fi = function() {
        at(window, "selectstart", Pt);
      };
    else {
      var _i = Ii(
        ["userSelect", "WebkitUserSelect", "OUserSelect", "MozUserSelect", "msUserSelect"]
      );
      ci = function() {
        if (_i) {
          var t = document.documentElement.style;
          rn = t[_i], t[_i] = "none";
        }
      }, fi = function() {
        _i && (document.documentElement.style[_i] = rn, rn = void 0);
      };
    }
    function ln() {
      B(window, "dragstart", Pt);
    }
    function un() {
      at(window, "dragstart", Pt);
    }
    var Ai, hn;
    function dn(t) {
      for (; t.tabIndex === -1; )
        t = t.parentNode;
      t.style && (Bi(), Ai = t, hn = t.style.outlineStyle, t.style.outlineStyle = "none", B(window, "keydown", Bi));
    }
    function Bi() {
      Ai && (Ai.style.outlineStyle = hn, Ai = void 0, hn = void 0, at(window, "keydown", Bi));
    }
    function En(t) {
      do
        t = t.parentNode;
      while ((!t.offsetWidth || !t.offsetHeight) && t !== document.body);
      return t;
    }
    function cn(t) {
      var e = t.getBoundingClientRect();
      return {
        x: e.width / t.offsetWidth || 1,
        y: e.height / t.offsetHeight || 1,
        boundingClientRect: e
      };
    }
    var xo = {
      __proto__: null,
      TRANSFORM: s,
      TRANSITION: u,
      TRANSITION_END: E,
      get: M,
      getStyle: R,
      create: b,
      remove: V,
      empty: Ie,
      toFront: ae,
      toBack: re,
      hasClass: _,
      addClass: y,
      removeClass: A,
      setClass: ft,
      getClass: lt,
      setOpacity: $,
      testProp: Ii,
      setTransform: Ae,
      setPosition: vt,
      getPosition: Be,
      get disableTextSelection() {
        return ci;
      },
      get enableTextSelection() {
        return fi;
      },
      disableImageDrag: ln,
      enableImageDrag: un,
      preventOutline: dn,
      restoreOutline: Bi,
      getSizedParentNode: En,
      getScale: cn
    };
    function B(t, e, i, n) {
      if (e && typeof e == "object")
        for (var o in e)
          _n(t, o, e[o], i);
      else {
        e = ht(e);
        for (var r = 0, l = e.length; r < l; r++)
          _n(t, e[r], i, n);
      }
      return this;
    }
    var Yt = "_leaflet_events";
    function at(t, e, i, n) {
      if (arguments.length === 1)
        On(t), delete t[Yt];
      else if (e && typeof e == "object")
        for (var o in e)
          pn(t, o, e[o], i);
      else if (e = ht(e), arguments.length === 2)
        On(t, function(h) {
          return ie(e, h) !== -1;
        });
      else
        for (var r = 0, l = e.length; r < l; r++)
          pn(t, e[r], i, n);
      return this;
    }
    function On(t, e) {
      for (var i in t[Yt]) {
        var n = i.split(/\d/)[0];
        (!e || e(n)) && pn(t, n, null, null, i);
      }
    }
    var fn = {
      mouseenter: "mouseover",
      mouseleave: "mouseout",
      wheel: !("onwheel" in window) && "mousewheel"
    };
    function _n(t, e, i, n) {
      var o = e + N(i) + (n ? "_" + N(n) : "");
      if (t[Yt] && t[Yt][o])
        return this;
      var r = function(h) {
        return i.call(n || t, h || window.event);
      }, l = r;
      !P.touchNative && P.pointer && e.indexOf("touch") === 0 ? r = st(t, e, r) : P.touch && e === "dblclick" ? r = an(t, r) : "addEventListener" in t ? e === "touchstart" || e === "touchmove" || e === "wheel" || e === "mousewheel" ? t.addEventListener(fn[e] || e, r, P.passiveEvents ? { passive: !1 } : !1) : e === "mouseenter" || e === "mouseleave" ? (r = function(h) {
        h = h || window.event, vn(t, h) && l(h);
      }, t.addEventListener(fn[e], r, !1)) : t.addEventListener(e, l, !1) : t.attachEvent("on" + e, r), t[Yt] = t[Yt] || {}, t[Yt][o] = r;
    }
    function pn(t, e, i, n, o) {
      o = o || e + N(i) + (n ? "_" + N(n) : "");
      var r = t[Yt] && t[Yt][o];
      if (!r)
        return this;
      !P.touchNative && P.pointer && e.indexOf("touch") === 0 ? di(t, e, r) : P.touch && e === "dblclick" ? p(t, r) : "removeEventListener" in t ? t.removeEventListener(fn[e] || e, r, !1) : t.detachEvent("on" + e, r), t[Yt][o] = null;
    }
    function Ne(t) {
      return t.stopPropagation ? t.stopPropagation() : t.originalEvent ? t.originalEvent._stopped = !0 : t.cancelBubble = !0, this;
    }
    function mn(t) {
      return _n(t, "wheel", Ne), this;
    }
    function pi(t) {
      return B(t, "mousedown touchstart dblclick contextmenu", Ne), t._leaflet_disable_click = !0, this;
    }
    function Pt(t) {
      return t.preventDefault ? t.preventDefault() : t.returnValue = !1, this;
    }
    function Re(t) {
      return Pt(t), Ne(t), this;
    }
    function Zn(t) {
      if (t.composedPath)
        return t.composedPath();
      for (var e = [], i = t.target; i; )
        e.push(i), i = i.parentNode;
      return e;
    }
    function In(t, e) {
      if (!e)
        return new C(t.clientX, t.clientY);
      var i = cn(e), n = i.boundingClientRect;
      return new C(
        // offset.left/top values are in page scale (like clientX/Y),
        // whereas clientLeft/Top (border width) values are the original values (before CSS scale applies).
        (t.clientX - n.left) / i.x - e.clientLeft,
        (t.clientY - n.top) / i.y - e.clientTop
      );
    }
    var Lo = P.linux && P.chrome ? window.devicePixelRatio : P.mac ? window.devicePixelRatio * 3 : window.devicePixelRatio > 0 ? 2 * window.devicePixelRatio : 1;
    function An(t) {
      return P.edge ? t.wheelDeltaY / 2 : (
        // Don't trust window-geometry-based delta
        t.deltaY && t.deltaMode === 0 ? -t.deltaY / Lo : (
          // Pixels
          t.deltaY && t.deltaMode === 1 ? -t.deltaY * 20 : (
            // Lines
            t.deltaY && t.deltaMode === 2 ? -t.deltaY * 60 : (
              // Pages
              t.deltaX || t.deltaZ ? 0 : (
                // Skip horizontal/depth wheel events
                t.wheelDelta ? (t.wheelDeltaY || t.wheelDelta) / 2 : (
                  // Legacy IE pixels
                  t.detail && Math.abs(t.detail) < 32765 ? -t.detail * 20 : (
                    // Legacy Moz lines
                    t.detail ? t.detail / -32765 * 60 : (
                      // Legacy Moz pages
                      0
                    )
                  )
                )
              )
            )
          )
        )
      );
    }
    function vn(t, e) {
      var i = e.relatedTarget;
      if (!i)
        return !0;
      try {
        for (; i && i !== t; )
          i = i.parentNode;
      } catch {
        return !1;
      }
      return i !== t;
    }
    var Po = {
      __proto__: null,
      on: B,
      off: at,
      stopPropagation: Ne,
      disableScrollPropagation: mn,
      disableClickPropagation: pi,
      preventDefault: Pt,
      stop: Re,
      getPropagationPath: Zn,
      getMousePosition: In,
      getWheelDelta: An,
      isExternalTarget: vn,
      addListener: B,
      removeListener: at
    }, Bn = Ut.extend({
      // @method run(el: HTMLElement, newPos: Point, duration?: Number, easeLinearity?: Number)
      // Run an animation of a given element to a new position, optionally setting
      // duration in seconds (`0.25` by default) and easing linearity factor (3rd
      // argument of the [cubic bezier curve](https://cubic-bezier.com/#0,0,.5,1),
      // `0.5` by default).
      run: function(t, e, i, n) {
        this.stop(), this._el = t, this._inProgress = !0, this._duration = i || 0.25, this._easeOutPower = 1 / Math.max(n || 0.5, 0.2), this._startPos = Be(t), this._offset = e.subtract(this._startPos), this._startTime = +/* @__PURE__ */ new Date(), this.fire("start"), this._animate();
      },
      // @method stop()
      // Stops the animation (if currently running).
      stop: function() {
        this._inProgress && (this._step(!0), this._complete());
      },
      _animate: function() {
        this._animId = z(this._animate, this), this._step();
      },
      _step: function(t) {
        var e = +/* @__PURE__ */ new Date() - this._startTime, i = this._duration * 1e3;
        e < i ? this._runFrame(this._easeOut(e / i), t) : (this._runFrame(1), this._complete());
      },
      _runFrame: function(t, e) {
        var i = this._startPos.add(this._offset.multiplyBy(t));
        e && i._round(), vt(this._el, i), this.fire("step");
      },
      _complete: function() {
        H(this._animId), this._inProgress = !1, this.fire("end");
      },
      _easeOut: function(t) {
        return 1 - Math.pow(1 - t, this._easeOutPower);
      }
    }), q = Ut.extend({
      options: {
        // @section Map State Options
        // @option crs: CRS = L.CRS.EPSG3857
        // The [Coordinate Reference System](#crs) to use. Don't change this if you're not
        // sure what it means.
        crs: m,
        // @option center: LatLng = undefined
        // Initial geographic center of the map
        center: void 0,
        // @option zoom: Number = undefined
        // Initial map zoom level
        zoom: void 0,
        // @option minZoom: Number = *
        // Minimum zoom level of the map.
        // If not specified and at least one `GridLayer` or `TileLayer` is in the map,
        // the lowest of their `minZoom` options will be used instead.
        minZoom: void 0,
        // @option maxZoom: Number = *
        // Maximum zoom level of the map.
        // If not specified and at least one `GridLayer` or `TileLayer` is in the map,
        // the highest of their `maxZoom` options will be used instead.
        maxZoom: void 0,
        // @option layers: Layer[] = []
        // Array of layers that will be added to the map initially
        layers: [],
        // @option maxBounds: LatLngBounds = null
        // When this option is set, the map restricts the view to the given
        // geographical bounds, bouncing the user back if the user tries to pan
        // outside the view. To set the restriction dynamically, use
        // [`setMaxBounds`](#map-setmaxbounds) method.
        maxBounds: void 0,
        // @option renderer: Renderer = *
        // The default method for drawing vector layers on the map. `L.SVG`
        // or `L.Canvas` by default depending on browser support.
        renderer: void 0,
        // @section Animation Options
        // @option zoomAnimation: Boolean = true
        // Whether the map zoom animation is enabled. By default it's enabled
        // in all browsers that support CSS3 Transitions except Android.
        zoomAnimation: !0,
        // @option zoomAnimationThreshold: Number = 4
        // Won't animate zoom if the zoom difference exceeds this value.
        zoomAnimationThreshold: 4,
        // @option fadeAnimation: Boolean = true
        // Whether the tile fade animation is enabled. By default it's enabled
        // in all browsers that support CSS3 Transitions except Android.
        fadeAnimation: !0,
        // @option markerZoomAnimation: Boolean = true
        // Whether markers animate their zoom with the zoom animation, if disabled
        // they will disappear for the length of the animation. By default it's
        // enabled in all browsers that support CSS3 Transitions except Android.
        markerZoomAnimation: !0,
        // @option transform3DLimit: Number = 2^23
        // Defines the maximum size of a CSS translation transform. The default
        // value should not be changed unless a web browser positions layers in
        // the wrong place after doing a large `panBy`.
        transform3DLimit: 8388608,
        // Precision limit of a 32-bit float
        // @section Interaction Options
        // @option zoomSnap: Number = 1
        // Forces the map's zoom level to always be a multiple of this, particularly
        // right after a [`fitBounds()`](#map-fitbounds) or a pinch-zoom.
        // By default, the zoom level snaps to the nearest integer; lower values
        // (e.g. `0.5` or `0.1`) allow for greater granularity. A value of `0`
        // means the zoom level will not be snapped after `fitBounds` or a pinch-zoom.
        zoomSnap: 1,
        // @option zoomDelta: Number = 1
        // Controls how much the map's zoom level will change after a
        // [`zoomIn()`](#map-zoomin), [`zoomOut()`](#map-zoomout), pressing `+`
        // or `-` on the keyboard, or using the [zoom controls](#control-zoom).
        // Values smaller than `1` (e.g. `0.5`) allow for greater granularity.
        zoomDelta: 1,
        // @option trackResize: Boolean = true
        // Whether the map automatically handles browser window resize to update itself.
        trackResize: !0
      },
      initialize: function(t, e) {
        e = Y(this, e), this._handlers = [], this._layers = {}, this._zoomBoundLayers = {}, this._sizeChanged = !0, this._initContainer(t), this._initLayout(), this._onResize = F(this._onResize, this), this._initEvents(), e.maxBounds && this.setMaxBounds(e.maxBounds), e.zoom !== void 0 && (this._zoom = this._limitZoom(e.zoom)), e.center && e.zoom !== void 0 && this.setView(W(e.center), e.zoom, { reset: !0 }), this.callInitHooks(), this._zoomAnimated = u && P.any3d && !P.mobileOpera && this.options.zoomAnimation, this._zoomAnimated && (this._createAnimProxy(), B(this._proxy, E, this._catchTransitionEnd, this)), this._addLayers(this.options.layers);
      },
      // @section Methods for modifying map state
      // @method setView(center: LatLng, zoom: Number, options?: Zoom/pan options): this
      // Sets the view of the map (geographical center and zoom) with the given
      // animation options.
      setView: function(t, e, i) {
        if (e = e === void 0 ? this._zoom : this._limitZoom(e), t = this._limitCenter(W(t), e, this.options.maxBounds), i = i || {}, this._stop(), this._loaded && !i.reset && i !== !0) {
          i.animate !== void 0 && (i.zoom = G({ animate: i.animate }, i.zoom), i.pan = G({ animate: i.animate, duration: i.duration }, i.pan));
          var n = this._zoom !== e ? this._tryAnimatedZoom && this._tryAnimatedZoom(t, e, i.zoom) : this._tryAnimatedPan(t, i.pan);
          if (n)
            return clearTimeout(this._sizeTimer), this;
        }
        return this._resetView(t, e, i.pan && i.pan.noMoveStart), this;
      },
      // @method setZoom(zoom: Number, options?: Zoom/pan options): this
      // Sets the zoom of the map.
      setZoom: function(t, e) {
        return this._loaded ? this.setView(this.getCenter(), t, { zoom: e }) : (this._zoom = t, this);
      },
      // @method zoomIn(delta?: Number, options?: Zoom options): this
      // Increases the zoom of the map by `delta` ([`zoomDelta`](#map-zoomdelta) by default).
      zoomIn: function(t, e) {
        return t = t || (P.any3d ? this.options.zoomDelta : 1), this.setZoom(this._zoom + t, e);
      },
      // @method zoomOut(delta?: Number, options?: Zoom options): this
      // Decreases the zoom of the map by `delta` ([`zoomDelta`](#map-zoomdelta) by default).
      zoomOut: function(t, e) {
        return t = t || (P.any3d ? this.options.zoomDelta : 1), this.setZoom(this._zoom - t, e);
      },
      // @method setZoomAround(latlng: LatLng, zoom: Number, options: Zoom options): this
      // Zooms the map while keeping a specified geographical point on the map
      // stationary (e.g. used internally for scroll zoom and double-click zoom).
      // @alternative
      // @method setZoomAround(offset: Point, zoom: Number, options: Zoom options): this
      // Zooms the map while keeping a specified pixel on the map (relative to the top-left corner) stationary.
      setZoomAround: function(t, e, i) {
        var n = this.getZoomScale(e), o = this.getSize().divideBy(2), r = t instanceof C ? t : this.latLngToContainerPoint(t), l = r.subtract(o).multiplyBy(1 - 1 / n), h = this.containerPointToLatLng(o.add(l));
        return this.setView(h, e, { zoom: i });
      },
      _getBoundsCenterZoom: function(t, e) {
        e = e || {}, t = t.getBounds ? t.getBounds() : ct(t);
        var i = I(e.paddingTopLeft || e.padding || [0, 0]), n = I(e.paddingBottomRight || e.padding || [0, 0]), o = this.getBoundsZoom(t, !1, i.add(n));
        if (o = typeof e.maxZoom == "number" ? Math.min(e.maxZoom, o) : o, o === 1 / 0)
          return {
            center: t.getCenter(),
            zoom: o
          };
        var r = n.subtract(i).divideBy(2), l = this.project(t.getSouthWest(), o), h = this.project(t.getNorthEast(), o), d = this.unproject(l.add(h).divideBy(2).add(r), o);
        return {
          center: d,
          zoom: o
        };
      },
      // @method fitBounds(bounds: LatLngBounds, options?: fitBounds options): this
      // Sets a map view that contains the given geographical bounds with the
      // maximum zoom level possible.
      fitBounds: function(t, e) {
        if (t = ct(t), !t.isValid())
          throw new Error("Bounds are not valid.");
        var i = this._getBoundsCenterZoom(t, e);
        return this.setView(i.center, i.zoom, e);
      },
      // @method fitWorld(options?: fitBounds options): this
      // Sets a map view that mostly contains the whole world with the maximum
      // zoom level possible.
      fitWorld: function(t) {
        return this.fitBounds([[-90, -180], [90, 180]], t);
      },
      // @method panTo(latlng: LatLng, options?: Pan options): this
      // Pans the map to a given center.
      panTo: function(t, e) {
        return this.setView(t, this._zoom, { pan: e });
      },
      // @method panBy(offset: Point, options?: Pan options): this
      // Pans the map by a given number of pixels (animated).
      panBy: function(t, e) {
        if (t = I(t).round(), e = e || {}, !t.x && !t.y)
          return this.fire("moveend");
        if (e.animate !== !0 && !this.getSize().contains(t))
          return this._resetView(this.unproject(this.project(this.getCenter()).add(t)), this.getZoom()), this;
        if (this._panAnim || (this._panAnim = new Bn(), this._panAnim.on({
          step: this._onPanTransitionStep,
          end: this._onPanTransitionEnd
        }, this)), e.noMoveStart || this.fire("movestart"), e.animate !== !1) {
          y(this._mapPane, "leaflet-pan-anim");
          var i = this._getMapPanePos().subtract(t).round();
          this._panAnim.run(this._mapPane, i, e.duration || 0.25, e.easeLinearity);
        } else
          this._rawPanBy(t), this.fire("move").fire("moveend");
        return this;
      },
      // @method flyTo(latlng: LatLng, zoom?: Number, options?: Zoom/pan options): this
      // Sets the view of the map (geographical center and zoom) performing a smooth
      // pan-zoom animation.
      flyTo: function(t, e, i) {
        if (i = i || {}, i.animate === !1 || !P.any3d)
          return this.setView(t, e, i);
        this._stop();
        var n = this.project(this.getCenter()), o = this.project(t), r = this.getSize(), l = this._zoom;
        t = W(t), e = e === void 0 ? l : e;
        var h = Math.max(r.x, r.y), d = h * this.getZoomScale(l, e), f = o.distanceTo(n) || 1, w = 1.42, Z = w * w;
        function U(gt) {
          var $i = gt ? -1 : 1, cs = gt ? d : h, fs = d * d - h * h + $i * Z * Z * f * f, _s = 2 * cs * Z * f, Mn = fs / _s, vo = Math.sqrt(Mn * Mn + 1) - Mn, ps = vo < 1e-9 ? -18 : Math.log(vo);
          return ps;
        }
        function zt(gt) {
          return (Math.exp(gt) - Math.exp(-gt)) / 2;
        }
        function xt(gt) {
          return (Math.exp(gt) + Math.exp(-gt)) / 2;
        }
        function Vt(gt) {
          return zt(gt) / xt(gt);
        }
        var Ot = U(0);
        function ni(gt) {
          return h * (xt(Ot) / xt(Ot + w * gt));
        }
        function ls(gt) {
          return h * (xt(Ot) * Vt(Ot + w * gt) - zt(Ot)) / Z;
        }
        function us(gt) {
          return 1 - Math.pow(1 - gt, 1.5);
        }
        var hs = Date.now(), po = (U(1) - Ot) / w, ds = i.duration ? 1e3 * i.duration : 1e3 * po * 0.8;
        function mo() {
          var gt = (Date.now() - hs) / ds, $i = us(gt) * po;
          gt <= 1 ? (this._flyToFrame = z(mo, this), this._move(
            this.unproject(n.add(o.subtract(n).multiplyBy(ls($i) / f)), l),
            this.getScaleZoom(h / ni($i), l),
            { flyTo: !0 }
          )) : this._move(t, e)._moveEnd(!0);
        }
        return this._moveStart(!0, i.noMoveStart), mo.call(this), this;
      },
      // @method flyToBounds(bounds: LatLngBounds, options?: fitBounds options): this
      // Sets the view of the map with a smooth animation like [`flyTo`](#map-flyto),
      // but takes a bounds parameter like [`fitBounds`](#map-fitbounds).
      flyToBounds: function(t, e) {
        var i = this._getBoundsCenterZoom(t, e);
        return this.flyTo(i.center, i.zoom, e);
      },
      // @method setMaxBounds(bounds: LatLngBounds): this
      // Restricts the map view to the given bounds (see the [maxBounds](#map-maxbounds) option).
      setMaxBounds: function(t) {
        return t = ct(t), this.listens("moveend", this._panInsideMaxBounds) && this.off("moveend", this._panInsideMaxBounds), t.isValid() ? (this.options.maxBounds = t, this._loaded && this._panInsideMaxBounds(), this.on("moveend", this._panInsideMaxBounds)) : (this.options.maxBounds = null, this);
      },
      // @method setMinZoom(zoom: Number): this
      // Sets the lower limit for the available zoom levels (see the [minZoom](#map-minzoom) option).
      setMinZoom: function(t) {
        var e = this.options.minZoom;
        return this.options.minZoom = t, this._loaded && e !== t && (this.fire("zoomlevelschange"), this.getZoom() < this.options.minZoom) ? this.setZoom(t) : this;
      },
      // @method setMaxZoom(zoom: Number): this
      // Sets the upper limit for the available zoom levels (see the [maxZoom](#map-maxzoom) option).
      setMaxZoom: function(t) {
        var e = this.options.maxZoom;
        return this.options.maxZoom = t, this._loaded && e !== t && (this.fire("zoomlevelschange"), this.getZoom() > this.options.maxZoom) ? this.setZoom(t) : this;
      },
      // @method panInsideBounds(bounds: LatLngBounds, options?: Pan options): this
      // Pans the map to the closest view that would lie inside the given bounds (if it's not already), controlling the animation using the options specific, if any.
      panInsideBounds: function(t, e) {
        this._enforcingBounds = !0;
        var i = this.getCenter(), n = this._limitCenter(i, this._zoom, ct(t));
        return i.equals(n) || this.panTo(n, e), this._enforcingBounds = !1, this;
      },
      // @method panInside(latlng: LatLng, options?: padding options): this
      // Pans the map the minimum amount to make the `latlng` visible. Use
      // padding options to fit the display to more restricted bounds.
      // If `latlng` is already within the (optionally padded) display bounds,
      // the map will not be panned.
      panInside: function(t, e) {
        e = e || {};
        var i = I(e.paddingTopLeft || e.padding || [0, 0]), n = I(e.paddingBottomRight || e.padding || [0, 0]), o = this.project(this.getCenter()), r = this.project(t), l = this.getPixelBounds(), h = Mt([l.min.add(i), l.max.subtract(n)]), d = h.getSize();
        if (!h.contains(r)) {
          this._enforcingBounds = !0;
          var f = r.subtract(h.getCenter()), w = h.extend(r).getSize().subtract(d);
          o.x += f.x < 0 ? -w.x : w.x, o.y += f.y < 0 ? -w.y : w.y, this.panTo(this.unproject(o), e), this._enforcingBounds = !1;
        }
        return this;
      },
      // @method invalidateSize(options: Zoom/pan options): this
      // Checks if the map container size changed and updates the map if so —
      // call it after you've changed the map size dynamically, also animating
      // pan by default. If `options.pan` is `false`, panning will not occur.
      // If `options.debounceMoveend` is `true`, it will delay `moveend` event so
      // that it doesn't happen often even if the method is called many
      // times in a row.
      // @alternative
      // @method invalidateSize(animate: Boolean): this
      // Checks if the map container size changed and updates the map if so —
      // call it after you've changed the map size dynamically, also animating
      // pan by default.
      invalidateSize: function(t) {
        if (!this._loaded)
          return this;
        t = G({
          animate: !1,
          pan: !0
        }, t === !0 ? { animate: !0 } : t);
        var e = this.getSize();
        this._sizeChanged = !0, this._lastCenter = null;
        var i = this.getSize(), n = e.divideBy(2).round(), o = i.divideBy(2).round(), r = n.subtract(o);
        return !r.x && !r.y ? this : (t.animate && t.pan ? this.panBy(r) : (t.pan && this._rawPanBy(r), this.fire("move"), t.debounceMoveend ? (clearTimeout(this._sizeTimer), this._sizeTimer = setTimeout(F(this.fire, this, "moveend"), 200)) : this.fire("moveend")), this.fire("resize", {
          oldSize: e,
          newSize: i
        }));
      },
      // @section Methods for modifying map state
      // @method stop(): this
      // Stops the currently running `panTo` or `flyTo` animation, if any.
      stop: function() {
        return this.setZoom(this._limitZoom(this._zoom)), this.options.zoomSnap || this.fire("viewreset"), this._stop();
      },
      // @section Geolocation methods
      // @method locate(options?: Locate options): this
      // Tries to locate the user using the Geolocation API, firing a [`locationfound`](#map-locationfound)
      // event with location data on success or a [`locationerror`](#map-locationerror) event on failure,
      // and optionally sets the map view to the user's location with respect to
      // detection accuracy (or to the world view if geolocation failed).
      // Note that, if your page doesn't use HTTPS, this method will fail in
      // modern browsers ([Chrome 50 and newer](https://sites.google.com/a/chromium.org/dev/Home/chromium-security/deprecating-powerful-features-on-insecure-origins))
      // See `Locate options` for more details.
      locate: function(t) {
        if (t = this._locateOptions = G({
          timeout: 1e4,
          watch: !1
          // setView: false
          // maxZoom: <Number>
          // maximumAge: 0
          // enableHighAccuracy: false
        }, t), !("geolocation" in navigator))
          return this._handleGeolocationError({
            code: 0,
            message: "Geolocation not supported."
          }), this;
        var e = F(this._handleGeolocationResponse, this), i = F(this._handleGeolocationError, this);
        return t.watch ? this._locationWatchId = navigator.geolocation.watchPosition(e, i, t) : navigator.geolocation.getCurrentPosition(e, i, t), this;
      },
      // @method stopLocate(): this
      // Stops watching location previously initiated by `map.locate({watch: true})`
      // and aborts resetting the map view if map.locate was called with
      // `{setView: true}`.
      stopLocate: function() {
        return navigator.geolocation && navigator.geolocation.clearWatch && navigator.geolocation.clearWatch(this._locationWatchId), this._locateOptions && (this._locateOptions.setView = !1), this;
      },
      _handleGeolocationError: function(t) {
        if (this._container._leaflet_id) {
          var e = t.code, i = t.message || (e === 1 ? "permission denied" : e === 2 ? "position unavailable" : "timeout");
          this._locateOptions.setView && !this._loaded && this.fitWorld(), this.fire("locationerror", {
            code: e,
            message: "Geolocation error: " + i + "."
          });
        }
      },
      _handleGeolocationResponse: function(t) {
        if (this._container._leaflet_id) {
          var e = t.coords.latitude, i = t.coords.longitude, n = new X(e, i), o = n.toBounds(t.coords.accuracy * 2), r = this._locateOptions;
          if (r.setView) {
            var l = this.getBoundsZoom(o);
            this.setView(n, r.maxZoom ? Math.min(l, r.maxZoom) : l);
          }
          var h = {
            latlng: n,
            bounds: o,
            timestamp: t.timestamp
          };
          for (var d in t.coords)
            typeof t.coords[d] == "number" && (h[d] = t.coords[d]);
          this.fire("locationfound", h);
        }
      },
      // TODO Appropriate docs section?
      // @section Other Methods
      // @method addHandler(name: String, HandlerClass: Function): this
      // Adds a new `Handler` to the map, given its name and constructor function.
      addHandler: function(t, e) {
        if (!e)
          return this;
        var i = this[t] = new e(this);
        return this._handlers.push(i), this.options[t] && i.enable(), this;
      },
      // @method remove(): this
      // Destroys the map and clears all related event listeners.
      remove: function() {
        if (this._initEvents(!0), this.options.maxBounds && this.off("moveend", this._panInsideMaxBounds), this._containerId !== this._container._leaflet_id)
          throw new Error("Map container is being reused by another instance");
        try {
          delete this._container._leaflet_id, delete this._containerId;
        } catch {
          this._container._leaflet_id = void 0, this._containerId = void 0;
        }
        this._locationWatchId !== void 0 && this.stopLocate(), this._stop(), V(this._mapPane), this._clearControlPos && this._clearControlPos(), this._resizeRequest && (H(this._resizeRequest), this._resizeRequest = null), this._clearHandlers(), this._loaded && this.fire("unload");
        var t;
        for (t in this._layers)
          this._layers[t].remove();
        for (t in this._panes)
          V(this._panes[t]);
        return this._layers = [], this._panes = [], delete this._mapPane, delete this._renderer, this;
      },
      // @section Other Methods
      // @method createPane(name: String, container?: HTMLElement): HTMLElement
      // Creates a new [map pane](#map-pane) with the given name if it doesn't exist already,
      // then returns it. The pane is created as a child of `container`, or
      // as a child of the main map pane if not set.
      createPane: function(t, e) {
        var i = "leaflet-pane" + (t ? " leaflet-" + t.replace("Pane", "") + "-pane" : ""), n = b("div", i, e || this._mapPane);
        return t && (this._panes[t] = n), n;
      },
      // @section Methods for Getting Map State
      // @method getCenter(): LatLng
      // Returns the geographical center of the map view
      getCenter: function() {
        return this._checkIfLoaded(), this._lastCenter && !this._moved() ? this._lastCenter.clone() : this.layerPointToLatLng(this._getCenterLayerPoint());
      },
      // @method getZoom(): Number
      // Returns the current zoom level of the map view
      getZoom: function() {
        return this._zoom;
      },
      // @method getBounds(): LatLngBounds
      // Returns the geographical bounds visible in the current map view
      getBounds: function() {
        var t = this.getPixelBounds(), e = this.unproject(t.getBottomLeft()), i = this.unproject(t.getTopRight());
        return new Lt(e, i);
      },
      // @method getMinZoom(): Number
      // Returns the minimum zoom level of the map (if set in the `minZoom` option of the map or of any layers), or `0` by default.
      getMinZoom: function() {
        return this.options.minZoom === void 0 ? this._layersMinZoom || 0 : this.options.minZoom;
      },
      // @method getMaxZoom(): Number
      // Returns the maximum zoom level of the map (if set in the `maxZoom` option of the map or of any layers).
      getMaxZoom: function() {
        return this.options.maxZoom === void 0 ? this._layersMaxZoom === void 0 ? 1 / 0 : this._layersMaxZoom : this.options.maxZoom;
      },
      // @method getBoundsZoom(bounds: LatLngBounds, inside?: Boolean, padding?: Point): Number
      // Returns the maximum zoom level on which the given bounds fit to the map
      // view in its entirety. If `inside` (optional) is set to `true`, the method
      // instead returns the minimum zoom level on which the map view fits into
      // the given bounds in its entirety.
      getBoundsZoom: function(t, e, i) {
        t = ct(t), i = I(i || [0, 0]);
        var n = this.getZoom() || 0, o = this.getMinZoom(), r = this.getMaxZoom(), l = t.getNorthWest(), h = t.getSouthEast(), d = this.getSize().subtract(i), f = Mt(this.project(h, n), this.project(l, n)).getSize(), w = P.any3d ? this.options.zoomSnap : 1, Z = d.x / f.x, U = d.y / f.y, zt = e ? Math.max(Z, U) : Math.min(Z, U);
        return n = this.getScaleZoom(zt, n), w && (n = Math.round(n / (w / 100)) * (w / 100), n = e ? Math.ceil(n / w) * w : Math.floor(n / w) * w), Math.max(o, Math.min(r, n));
      },
      // @method getSize(): Point
      // Returns the current size of the map container (in pixels).
      getSize: function() {
        return (!this._size || this._sizeChanged) && (this._size = new C(
          this._container.clientWidth || 0,
          this._container.clientHeight || 0
        ), this._sizeChanged = !1), this._size.clone();
      },
      // @method getPixelBounds(): Bounds
      // Returns the bounds of the current map view in projected pixel
      // coordinates (sometimes useful in layer and overlay implementations).
      getPixelBounds: function(t, e) {
        var i = this._getTopLeftPoint(t, e);
        return new rt(i, i.add(this.getSize()));
      },
      // TODO: Check semantics - isn't the pixel origin the 0,0 coord relative to
      // the map pane? "left point of the map layer" can be confusing, specially
      // since there can be negative offsets.
      // @method getPixelOrigin(): Point
      // Returns the projected pixel coordinates of the top left point of
      // the map layer (useful in custom layer and overlay implementations).
      getPixelOrigin: function() {
        return this._checkIfLoaded(), this._pixelOrigin;
      },
      // @method getPixelWorldBounds(zoom?: Number): Bounds
      // Returns the world's bounds in pixel coordinates for zoom level `zoom`.
      // If `zoom` is omitted, the map's current zoom level is used.
      getPixelWorldBounds: function(t) {
        return this.options.crs.getProjectedBounds(t === void 0 ? this.getZoom() : t);
      },
      // @section Other Methods
      // @method getPane(pane: String|HTMLElement): HTMLElement
      // Returns a [map pane](#map-pane), given its name or its HTML element (its identity).
      getPane: function(t) {
        return typeof t == "string" ? this._panes[t] : t;
      },
      // @method getPanes(): Object
      // Returns a plain object containing the names of all [panes](#map-pane) as keys and
      // the panes as values.
      getPanes: function() {
        return this._panes;
      },
      // @method getContainer: HTMLElement
      // Returns the HTML element that contains the map.
      getContainer: function() {
        return this._container;
      },
      // @section Conversion Methods
      // @method getZoomScale(toZoom: Number, fromZoom: Number): Number
      // Returns the scale factor to be applied to a map transition from zoom level
      // `fromZoom` to `toZoom`. Used internally to help with zoom animations.
      getZoomScale: function(t, e) {
        var i = this.options.crs;
        return e = e === void 0 ? this._zoom : e, i.scale(t) / i.scale(e);
      },
      // @method getScaleZoom(scale: Number, fromZoom: Number): Number
      // Returns the zoom level that the map would end up at, if it is at `fromZoom`
      // level and everything is scaled by a factor of `scale`. Inverse of
      // [`getZoomScale`](#map-getZoomScale).
      getScaleZoom: function(t, e) {
        var i = this.options.crs;
        e = e === void 0 ? this._zoom : e;
        var n = i.zoom(t * i.scale(e));
        return isNaN(n) ? 1 / 0 : n;
      },
      // @method project(latlng: LatLng, zoom: Number): Point
      // Projects a geographical coordinate `LatLng` according to the projection
      // of the map's CRS, then scales it according to `zoom` and the CRS's
      // `Transformation`. The result is pixel coordinate relative to
      // the CRS origin.
      project: function(t, e) {
        return e = e === void 0 ? this._zoom : e, this.options.crs.latLngToPoint(W(t), e);
      },
      // @method unproject(point: Point, zoom: Number): LatLng
      // Inverse of [`project`](#map-project).
      unproject: function(t, e) {
        return e = e === void 0 ? this._zoom : e, this.options.crs.pointToLatLng(I(t), e);
      },
      // @method layerPointToLatLng(point: Point): LatLng
      // Given a pixel coordinate relative to the [origin pixel](#map-getpixelorigin),
      // returns the corresponding geographical coordinate (for the current zoom level).
      layerPointToLatLng: function(t) {
        var e = I(t).add(this.getPixelOrigin());
        return this.unproject(e);
      },
      // @method latLngToLayerPoint(latlng: LatLng): Point
      // Given a geographical coordinate, returns the corresponding pixel coordinate
      // relative to the [origin pixel](#map-getpixelorigin).
      latLngToLayerPoint: function(t) {
        var e = this.project(W(t))._round();
        return e._subtract(this.getPixelOrigin());
      },
      // @method wrapLatLng(latlng: LatLng): LatLng
      // Returns a `LatLng` where `lat` and `lng` has been wrapped according to the
      // map's CRS's `wrapLat` and `wrapLng` properties, if they are outside the
      // CRS's bounds.
      // By default this means longitude is wrapped around the dateline so its
      // value is between -180 and +180 degrees.
      wrapLatLng: function(t) {
        return this.options.crs.wrapLatLng(W(t));
      },
      // @method wrapLatLngBounds(bounds: LatLngBounds): LatLngBounds
      // Returns a `LatLngBounds` with the same size as the given one, ensuring that
      // its center is within the CRS's bounds.
      // By default this means the center longitude is wrapped around the dateline so its
      // value is between -180 and +180 degrees, and the majority of the bounds
      // overlaps the CRS's bounds.
      wrapLatLngBounds: function(t) {
        return this.options.crs.wrapLatLngBounds(ct(t));
      },
      // @method distance(latlng1: LatLng, latlng2: LatLng): Number
      // Returns the distance between two geographical coordinates according to
      // the map's CRS. By default this measures distance in meters.
      distance: function(t, e) {
        return this.options.crs.distance(W(t), W(e));
      },
      // @method containerPointToLayerPoint(point: Point): Point
      // Given a pixel coordinate relative to the map container, returns the corresponding
      // pixel coordinate relative to the [origin pixel](#map-getpixelorigin).
      containerPointToLayerPoint: function(t) {
        return I(t).subtract(this._getMapPanePos());
      },
      // @method layerPointToContainerPoint(point: Point): Point
      // Given a pixel coordinate relative to the [origin pixel](#map-getpixelorigin),
      // returns the corresponding pixel coordinate relative to the map container.
      layerPointToContainerPoint: function(t) {
        return I(t).add(this._getMapPanePos());
      },
      // @method containerPointToLatLng(point: Point): LatLng
      // Given a pixel coordinate relative to the map container, returns
      // the corresponding geographical coordinate (for the current zoom level).
      containerPointToLatLng: function(t) {
        var e = this.containerPointToLayerPoint(I(t));
        return this.layerPointToLatLng(e);
      },
      // @method latLngToContainerPoint(latlng: LatLng): Point
      // Given a geographical coordinate, returns the corresponding pixel coordinate
      // relative to the map container.
      latLngToContainerPoint: function(t) {
        return this.layerPointToContainerPoint(this.latLngToLayerPoint(W(t)));
      },
      // @method mouseEventToContainerPoint(ev: MouseEvent): Point
      // Given a MouseEvent object, returns the pixel coordinate relative to the
      // map container where the event took place.
      mouseEventToContainerPoint: function(t) {
        return In(t, this._container);
      },
      // @method mouseEventToLayerPoint(ev: MouseEvent): Point
      // Given a MouseEvent object, returns the pixel coordinate relative to
      // the [origin pixel](#map-getpixelorigin) where the event took place.
      mouseEventToLayerPoint: function(t) {
        return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(t));
      },
      // @method mouseEventToLatLng(ev: MouseEvent): LatLng
      // Given a MouseEvent object, returns geographical coordinate where the
      // event took place.
      mouseEventToLatLng: function(t) {
        return this.layerPointToLatLng(this.mouseEventToLayerPoint(t));
      },
      // map initialization methods
      _initContainer: function(t) {
        var e = this._container = M(t);
        if (e) {
          if (e._leaflet_id)
            throw new Error("Map container is already initialized.");
        } else throw new Error("Map container not found.");
        B(e, "scroll", this._onScroll, this), this._containerId = N(e);
      },
      _initLayout: function() {
        var t = this._container;
        this._fadeAnimated = this.options.fadeAnimation && P.any3d, y(t, "leaflet-container" + (P.touch ? " leaflet-touch" : "") + (P.retina ? " leaflet-retina" : "") + (P.ielt9 ? " leaflet-oldie" : "") + (P.safari ? " leaflet-safari" : "") + (this._fadeAnimated ? " leaflet-fade-anim" : ""));
        var e = R(t, "position");
        e !== "absolute" && e !== "relative" && e !== "fixed" && e !== "sticky" && (t.style.position = "relative"), this._initPanes(), this._initControlPos && this._initControlPos();
      },
      _initPanes: function() {
        var t = this._panes = {};
        this._paneRenderers = {}, this._mapPane = this.createPane("mapPane", this._container), vt(this._mapPane, new C(0, 0)), this.createPane("tilePane"), this.createPane("overlayPane"), this.createPane("shadowPane"), this.createPane("markerPane"), this.createPane("tooltipPane"), this.createPane("popupPane"), this.options.markerZoomAnimation || (y(t.markerPane, "leaflet-zoom-hide"), y(t.shadowPane, "leaflet-zoom-hide"));
      },
      // private methods that modify map state
      // @section Map state change events
      _resetView: function(t, e, i) {
        vt(this._mapPane, new C(0, 0));
        var n = !this._loaded;
        this._loaded = !0, e = this._limitZoom(e), this.fire("viewprereset");
        var o = this._zoom !== e;
        this._moveStart(o, i)._move(t, e)._moveEnd(o), this.fire("viewreset"), n && this.fire("load");
      },
      _moveStart: function(t, e) {
        return t && this.fire("zoomstart"), e || this.fire("movestart"), this;
      },
      _move: function(t, e, i, n) {
        e === void 0 && (e = this._zoom);
        var o = this._zoom !== e;
        return this._zoom = e, this._lastCenter = t, this._pixelOrigin = this._getNewPixelOrigin(t), n ? i && i.pinch && this.fire("zoom", i) : ((o || i && i.pinch) && this.fire("zoom", i), this.fire("move", i)), this;
      },
      _moveEnd: function(t) {
        return t && this.fire("zoomend"), this.fire("moveend");
      },
      _stop: function() {
        return H(this._flyToFrame), this._panAnim && this._panAnim.stop(), this;
      },
      _rawPanBy: function(t) {
        vt(this._mapPane, this._getMapPanePos().subtract(t));
      },
      _getZoomSpan: function() {
        return this.getMaxZoom() - this.getMinZoom();
      },
      _panInsideMaxBounds: function() {
        this._enforcingBounds || this.panInsideBounds(this.options.maxBounds);
      },
      _checkIfLoaded: function() {
        if (!this._loaded)
          throw new Error("Set map center and zoom first.");
      },
      // DOM event handling
      // @section Interaction events
      _initEvents: function(t) {
        this._targets = {}, this._targets[N(this._container)] = this;
        var e = t ? at : B;
        e(this._container, "click dblclick mousedown mouseup mouseover mouseout mousemove contextmenu keypress keydown keyup", this._handleDOMEvent, this), this.options.trackResize && e(window, "resize", this._onResize, this), P.any3d && this.options.transform3DLimit && (t ? this.off : this.on).call(this, "moveend", this._onMoveEnd);
      },
      _onResize: function() {
        H(this._resizeRequest), this._resizeRequest = z(
          function() {
            this.invalidateSize({ debounceMoveend: !0 });
          },
          this
        );
      },
      _onScroll: function() {
        this._container.scrollTop = 0, this._container.scrollLeft = 0;
      },
      _onMoveEnd: function() {
        var t = this._getMapPanePos();
        Math.max(Math.abs(t.x), Math.abs(t.y)) >= this.options.transform3DLimit && this._resetView(this.getCenter(), this.getZoom());
      },
      _findEventTargets: function(t, e) {
        for (var i = [], n, o = e === "mouseout" || e === "mouseover", r = t.target || t.srcElement, l = !1; r; ) {
          if (n = this._targets[N(r)], n && (e === "click" || e === "preclick") && this._draggableMoved(n)) {
            l = !0;
            break;
          }
          if (n && n.listens(e, !0) && (o && !vn(r, t) || (i.push(n), o)) || r === this._container)
            break;
          r = r.parentNode;
        }
        return !i.length && !l && !o && this.listens(e, !0) && (i = [this]), i;
      },
      _isClickDisabled: function(t) {
        for (; t && t !== this._container; ) {
          if (t._leaflet_disable_click)
            return !0;
          t = t.parentNode;
        }
      },
      _handleDOMEvent: function(t) {
        var e = t.target || t.srcElement;
        if (!(!this._loaded || e._leaflet_disable_events || t.type === "click" && this._isClickDisabled(e))) {
          var i = t.type;
          i === "mousedown" && dn(e), this._fireDOMEvent(t, i);
        }
      },
      _mouseEvents: ["click", "dblclick", "mouseover", "mouseout", "contextmenu"],
      _fireDOMEvent: function(t, e, i) {
        if (t.type === "click") {
          var n = G({}, t);
          n.type = "preclick", this._fireDOMEvent(n, n.type, i);
        }
        var o = this._findEventTargets(t, e);
        if (i) {
          for (var r = [], l = 0; l < i.length; l++)
            i[l].listens(e, !0) && r.push(i[l]);
          o = r.concat(o);
        }
        if (o.length) {
          e === "contextmenu" && Pt(t);
          var h = o[0], d = {
            originalEvent: t
          };
          if (t.type !== "keypress" && t.type !== "keydown" && t.type !== "keyup") {
            var f = h.getLatLng && (!h._radius || h._radius <= 10);
            d.containerPoint = f ? this.latLngToContainerPoint(h.getLatLng()) : this.mouseEventToContainerPoint(t), d.layerPoint = this.containerPointToLayerPoint(d.containerPoint), d.latlng = f ? h.getLatLng() : this.layerPointToLatLng(d.layerPoint);
          }
          for (l = 0; l < o.length; l++)
            if (o[l].fire(e, d, !0), d.originalEvent._stopped || o[l].options.bubblingMouseEvents === !1 && ie(this._mouseEvents, e) !== -1)
              return;
        }
      },
      _draggableMoved: function(t) {
        return t = t.dragging && t.dragging.enabled() ? t : this, t.dragging && t.dragging.moved() || this.boxZoom && this.boxZoom.moved();
      },
      _clearHandlers: function() {
        for (var t = 0, e = this._handlers.length; t < e; t++)
          this._handlers[t].disable();
      },
      // @section Other Methods
      // @method whenReady(fn: Function, context?: Object): this
      // Runs the given function `fn` when the map gets initialized with
      // a view (center and zoom) and at least one layer, or immediately
      // if it's already initialized, optionally passing a function context.
      whenReady: function(t, e) {
        return this._loaded ? t.call(e || this, { target: this }) : this.on("load", t, e), this;
      },
      // private methods for getting map state
      _getMapPanePos: function() {
        return Be(this._mapPane) || new C(0, 0);
      },
      _moved: function() {
        var t = this._getMapPanePos();
        return t && !t.equals([0, 0]);
      },
      _getTopLeftPoint: function(t, e) {
        var i = t && e !== void 0 ? this._getNewPixelOrigin(t, e) : this.getPixelOrigin();
        return i.subtract(this._getMapPanePos());
      },
      _getNewPixelOrigin: function(t, e) {
        var i = this.getSize()._divideBy(2);
        return this.project(t, e)._subtract(i)._add(this._getMapPanePos())._round();
      },
      _latLngToNewLayerPoint: function(t, e, i) {
        var n = this._getNewPixelOrigin(i, e);
        return this.project(t, e)._subtract(n);
      },
      _latLngBoundsToNewLayerBounds: function(t, e, i) {
        var n = this._getNewPixelOrigin(i, e);
        return Mt([
          this.project(t.getSouthWest(), e)._subtract(n),
          this.project(t.getNorthWest(), e)._subtract(n),
          this.project(t.getSouthEast(), e)._subtract(n),
          this.project(t.getNorthEast(), e)._subtract(n)
        ]);
      },
      // layer point of the current center
      _getCenterLayerPoint: function() {
        return this.containerPointToLayerPoint(this.getSize()._divideBy(2));
      },
      // offset of the specified place to the current center in pixels
      _getCenterOffset: function(t) {
        return this.latLngToLayerPoint(t).subtract(this._getCenterLayerPoint());
      },
      // adjust center for view to get inside bounds
      _limitCenter: function(t, e, i) {
        if (!i)
          return t;
        var n = this.project(t, e), o = this.getSize().divideBy(2), r = new rt(n.subtract(o), n.add(o)), l = this._getBoundsOffset(r, i, e);
        return Math.abs(l.x) <= 1 && Math.abs(l.y) <= 1 ? t : this.unproject(n.add(l), e);
      },
      // adjust offset for view to get inside bounds
      _limitOffset: function(t, e) {
        if (!e)
          return t;
        var i = this.getPixelBounds(), n = new rt(i.min.add(t), i.max.add(t));
        return t.add(this._getBoundsOffset(n, e));
      },
      // returns offset needed for pxBounds to get inside maxBounds at a specified zoom
      _getBoundsOffset: function(t, e, i) {
        var n = Mt(
          this.project(e.getNorthEast(), i),
          this.project(e.getSouthWest(), i)
        ), o = n.min.subtract(t.min), r = n.max.subtract(t.max), l = this._rebound(o.x, -r.x), h = this._rebound(o.y, -r.y);
        return new C(l, h);
      },
      _rebound: function(t, e) {
        return t + e > 0 ? Math.round(t - e) / 2 : Math.max(0, Math.ceil(t)) - Math.max(0, Math.floor(e));
      },
      _limitZoom: function(t) {
        var e = this.getMinZoom(), i = this.getMaxZoom(), n = P.any3d ? this.options.zoomSnap : 1;
        return n && (t = Math.round(t / n) * n), Math.max(e, Math.min(i, t));
      },
      _onPanTransitionStep: function() {
        this.fire("move");
      },
      _onPanTransitionEnd: function() {
        A(this._mapPane, "leaflet-pan-anim"), this.fire("moveend");
      },
      _tryAnimatedPan: function(t, e) {
        var i = this._getCenterOffset(t)._trunc();
        return (e && e.animate) !== !0 && !this.getSize().contains(i) ? !1 : (this.panBy(i, e), !0);
      },
      _createAnimProxy: function() {
        var t = this._proxy = b("div", "leaflet-proxy leaflet-zoom-animated");
        this._panes.mapPane.appendChild(t), this.on("zoomanim", function(e) {
          var i = s, n = this._proxy.style[i];
          Ae(this._proxy, this.project(e.center, e.zoom), this.getZoomScale(e.zoom, 1)), n === this._proxy.style[i] && this._animatingZoom && this._onZoomTransitionEnd();
        }, this), this.on("load moveend", this._animMoveEnd, this), this._on("unload", this._destroyAnimProxy, this);
      },
      _destroyAnimProxy: function() {
        V(this._proxy), this.off("load moveend", this._animMoveEnd, this), delete this._proxy;
      },
      _animMoveEnd: function() {
        var t = this.getCenter(), e = this.getZoom();
        Ae(this._proxy, this.project(t, e), this.getZoomScale(e, 1));
      },
      _catchTransitionEnd: function(t) {
        this._animatingZoom && t.propertyName.indexOf("transform") >= 0 && this._onZoomTransitionEnd();
      },
      _nothingToAnimate: function() {
        return !this._container.getElementsByClassName("leaflet-zoom-animated").length;
      },
      _tryAnimatedZoom: function(t, e, i) {
        if (this._animatingZoom)
          return !0;
        if (i = i || {}, !this._zoomAnimated || i.animate === !1 || this._nothingToAnimate() || Math.abs(e - this._zoom) > this.options.zoomAnimationThreshold)
          return !1;
        var n = this.getZoomScale(e), o = this._getCenterOffset(t)._divideBy(1 - 1 / n);
        return i.animate !== !0 && !this.getSize().contains(o) ? !1 : (z(function() {
          this._moveStart(!0, i.noMoveStart || !1)._animateZoom(t, e, !0);
        }, this), !0);
      },
      _animateZoom: function(t, e, i, n) {
        this._mapPane && (i && (this._animatingZoom = !0, this._animateToCenter = t, this._animateToZoom = e, y(this._mapPane, "leaflet-zoom-anim")), this.fire("zoomanim", {
          center: t,
          zoom: e,
          noUpdate: n
        }), this._tempFireZoomEvent || (this._tempFireZoomEvent = this._zoom !== this._animateToZoom), this._move(this._animateToCenter, this._animateToZoom, void 0, !0), setTimeout(F(this._onZoomTransitionEnd, this), 250));
      },
      _onZoomTransitionEnd: function() {
        this._animatingZoom && (this._mapPane && A(this._mapPane, "leaflet-zoom-anim"), this._animatingZoom = !1, this._move(this._animateToCenter, this._animateToZoom, void 0, !0), this._tempFireZoomEvent && this.fire("zoom"), delete this._tempFireZoomEvent, this.fire("move"), this._moveEnd(!0));
      }
    });
    function To(t, e) {
      return new q(t, e);
    }
    var Ht = yt.extend({
      // @section
      // @aka Control Options
      options: {
        // @option position: String = 'topright'
        // The position of the control (one of the map corners). Possible values are `'topleft'`,
        // `'topright'`, `'bottomleft'` or `'bottomright'`
        position: "topright"
      },
      initialize: function(t) {
        Y(this, t);
      },
      /* @section
       * Classes extending L.Control will inherit the following methods:
       *
       * @method getPosition: string
       * Returns the position of the control.
       */
      getPosition: function() {
        return this.options.position;
      },
      // @method setPosition(position: string): this
      // Sets the position of the control.
      setPosition: function(t) {
        var e = this._map;
        return e && e.removeControl(this), this.options.position = t, e && e.addControl(this), this;
      },
      // @method getContainer: HTMLElement
      // Returns the HTMLElement that contains the control.
      getContainer: function() {
        return this._container;
      },
      // @method addTo(map: Map): this
      // Adds the control to the given map.
      addTo: function(t) {
        this.remove(), this._map = t;
        var e = this._container = this.onAdd(t), i = this.getPosition(), n = t._controlCorners[i];
        return y(e, "leaflet-control"), i.indexOf("bottom") !== -1 ? n.insertBefore(e, n.firstChild) : n.appendChild(e), this._map.on("unload", this.remove, this), this;
      },
      // @method remove: this
      // Removes the control from the map it is currently active on.
      remove: function() {
        return this._map ? (V(this._container), this.onRemove && this.onRemove(this._map), this._map.off("unload", this.remove, this), this._map = null, this) : this;
      },
      _refocusOnMap: function(t) {
        this._map && t && t.screenX > 0 && t.screenY > 0 && this._map.getContainer().focus();
      }
    }), mi = function(t) {
      return new Ht(t);
    };
    q.include({
      // @method addControl(control: Control): this
      // Adds the given control to the map
      addControl: function(t) {
        return t.addTo(this), this;
      },
      // @method removeControl(control: Control): this
      // Removes the given control from the map
      removeControl: function(t) {
        return t.remove(), this;
      },
      _initControlPos: function() {
        var t = this._controlCorners = {}, e = "leaflet-", i = this._controlContainer = b("div", e + "control-container", this._container);
        function n(o, r) {
          var l = e + o + " " + e + r;
          t[o + r] = b("div", l, i);
        }
        n("top", "left"), n("top", "right"), n("bottom", "left"), n("bottom", "right");
      },
      _clearControlPos: function() {
        for (var t in this._controlCorners)
          V(this._controlCorners[t]);
        V(this._controlContainer), delete this._controlCorners, delete this._controlContainer;
      }
    });
    var Nn = Ht.extend({
      // @section
      // @aka Control.Layers options
      options: {
        // @option collapsed: Boolean = true
        // If `true`, the control will be collapsed into an icon and expanded on mouse hover, touch, or keyboard activation.
        collapsed: !0,
        position: "topright",
        // @option autoZIndex: Boolean = true
        // If `true`, the control will assign zIndexes in increasing order to all of its layers so that the order is preserved when switching them on/off.
        autoZIndex: !0,
        // @option hideSingleBase: Boolean = false
        // If `true`, the base layers in the control will be hidden when there is only one.
        hideSingleBase: !1,
        // @option sortLayers: Boolean = false
        // Whether to sort the layers. When `false`, layers will keep the order
        // in which they were added to the control.
        sortLayers: !1,
        // @option sortFunction: Function = *
        // A [compare function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
        // that will be used for sorting the layers, when `sortLayers` is `true`.
        // The function receives both the `L.Layer` instances and their names, as in
        // `sortFunction(layerA, layerB, nameA, nameB)`.
        // By default, it sorts layers alphabetically by their name.
        sortFunction: function(t, e, i, n) {
          return i < n ? -1 : n < i ? 1 : 0;
        }
      },
      initialize: function(t, e, i) {
        Y(this, i), this._layerControlInputs = [], this._layers = [], this._lastZIndex = 0, this._handlingClick = !1, this._preventClick = !1;
        for (var n in t)
          this._addLayer(t[n], n);
        for (n in e)
          this._addLayer(e[n], n, !0);
      },
      onAdd: function(t) {
        this._initLayout(), this._update(), this._map = t, t.on("zoomend", this._checkDisabledLayers, this);
        for (var e = 0; e < this._layers.length; e++)
          this._layers[e].layer.on("add remove", this._onLayerChange, this);
        return this._container;
      },
      addTo: function(t) {
        return Ht.prototype.addTo.call(this, t), this._expandIfNotCollapsed();
      },
      onRemove: function() {
        this._map.off("zoomend", this._checkDisabledLayers, this);
        for (var t = 0; t < this._layers.length; t++)
          this._layers[t].layer.off("add remove", this._onLayerChange, this);
      },
      // @method addBaseLayer(layer: Layer, name: String): this
      // Adds a base layer (radio button entry) with the given name to the control.
      addBaseLayer: function(t, e) {
        return this._addLayer(t, e), this._map ? this._update() : this;
      },
      // @method addOverlay(layer: Layer, name: String): this
      // Adds an overlay (checkbox entry) with the given name to the control.
      addOverlay: function(t, e) {
        return this._addLayer(t, e, !0), this._map ? this._update() : this;
      },
      // @method removeLayer(layer: Layer): this
      // Remove the given layer from the control.
      removeLayer: function(t) {
        t.off("add remove", this._onLayerChange, this);
        var e = this._getLayer(N(t));
        return e && this._layers.splice(this._layers.indexOf(e), 1), this._map ? this._update() : this;
      },
      // @method expand(): this
      // Expand the control container if collapsed.
      expand: function() {
        y(this._container, "leaflet-control-layers-expanded"), this._section.style.height = null;
        var t = this._map.getSize().y - (this._container.offsetTop + 50);
        return t < this._section.clientHeight ? (y(this._section, "leaflet-control-layers-scrollbar"), this._section.style.height = t + "px") : A(this._section, "leaflet-control-layers-scrollbar"), this._checkDisabledLayers(), this;
      },
      // @method collapse(): this
      // Collapse the control container if expanded.
      collapse: function() {
        return A(this._container, "leaflet-control-layers-expanded"), this;
      },
      _initLayout: function() {
        var t = "leaflet-control-layers", e = this._container = b("div", t), i = this.options.collapsed;
        e.setAttribute("aria-haspopup", !0), pi(e), mn(e);
        var n = this._section = b("section", t + "-list");
        i && (this._map.on("click", this.collapse, this), B(e, {
          mouseenter: this._expandSafely,
          mouseleave: this.collapse
        }, this));
        var o = this._layersLink = b("a", t + "-toggle", e);
        o.href = "#", o.title = "Layers", o.setAttribute("role", "button"), B(o, {
          keydown: function(r) {
            r.keyCode === 13 && this._expandSafely();
          },
          // Certain screen readers intercept the key event and instead send a click event
          click: function(r) {
            Pt(r), this._expandSafely();
          }
        }, this), i || this.expand(), this._baseLayersList = b("div", t + "-base", n), this._separator = b("div", t + "-separator", n), this._overlaysList = b("div", t + "-overlays", n), e.appendChild(n);
      },
      _getLayer: function(t) {
        for (var e = 0; e < this._layers.length; e++)
          if (this._layers[e] && N(this._layers[e].layer) === t)
            return this._layers[e];
      },
      _addLayer: function(t, e, i) {
        this._map && t.on("add remove", this._onLayerChange, this), this._layers.push({
          layer: t,
          name: e,
          overlay: i
        }), this.options.sortLayers && this._layers.sort(F(function(n, o) {
          return this.options.sortFunction(n.layer, o.layer, n.name, o.name);
        }, this)), this.options.autoZIndex && t.setZIndex && (this._lastZIndex++, t.setZIndex(this._lastZIndex)), this._expandIfNotCollapsed();
      },
      _update: function() {
        if (!this._container)
          return this;
        Ie(this._baseLayersList), Ie(this._overlaysList), this._layerControlInputs = [];
        var t, e, i, n, o = 0;
        for (i = 0; i < this._layers.length; i++)
          n = this._layers[i], this._addItem(n), e = e || n.overlay, t = t || !n.overlay, o += n.overlay ? 0 : 1;
        return this.options.hideSingleBase && (t = t && o > 1, this._baseLayersList.style.display = t ? "" : "none"), this._separator.style.display = e && t ? "" : "none", this;
      },
      _onLayerChange: function(t) {
        this._handlingClick || this._update();
        var e = this._getLayer(N(t.target)), i = e.overlay ? t.type === "add" ? "overlayadd" : "overlayremove" : t.type === "add" ? "baselayerchange" : null;
        i && this._map.fire(i, e);
      },
      // IE7 bugs out if you create a radio dynamically, so you have to do it this hacky way (see https://stackoverflow.com/a/119079)
      _createRadioElement: function(t, e) {
        var i = '<input type="radio" class="leaflet-control-layers-selector" name="' + t + '"' + (e ? ' checked="checked"' : "") + "/>", n = document.createElement("div");
        return n.innerHTML = i, n.firstChild;
      },
      _addItem: function(t) {
        var e = document.createElement("label"), i = this._map.hasLayer(t.layer), n;
        t.overlay ? (n = document.createElement("input"), n.type = "checkbox", n.className = "leaflet-control-layers-selector", n.defaultChecked = i) : n = this._createRadioElement("leaflet-base-layers_" + N(this), i), this._layerControlInputs.push(n), n.layerId = N(t.layer), B(n, "click", this._onInputClick, this);
        var o = document.createElement("span");
        o.innerHTML = " " + t.name;
        var r = document.createElement("span");
        e.appendChild(r), r.appendChild(n), r.appendChild(o);
        var l = t.overlay ? this._overlaysList : this._baseLayersList;
        return l.appendChild(e), this._checkDisabledLayers(), e;
      },
      _onInputClick: function() {
        if (!this._preventClick) {
          var t = this._layerControlInputs, e, i, n = [], o = [];
          this._handlingClick = !0;
          for (var r = t.length - 1; r >= 0; r--)
            e = t[r], i = this._getLayer(e.layerId).layer, e.checked ? n.push(i) : e.checked || o.push(i);
          for (r = 0; r < o.length; r++)
            this._map.hasLayer(o[r]) && this._map.removeLayer(o[r]);
          for (r = 0; r < n.length; r++)
            this._map.hasLayer(n[r]) || this._map.addLayer(n[r]);
          this._handlingClick = !1, this._refocusOnMap();
        }
      },
      _checkDisabledLayers: function() {
        for (var t = this._layerControlInputs, e, i, n = this._map.getZoom(), o = t.length - 1; o >= 0; o--)
          e = t[o], i = this._getLayer(e.layerId).layer, e.disabled = i.options.minZoom !== void 0 && n < i.options.minZoom || i.options.maxZoom !== void 0 && n > i.options.maxZoom;
      },
      _expandIfNotCollapsed: function() {
        return this._map && !this.options.collapsed && this.expand(), this;
      },
      _expandSafely: function() {
        var t = this._section;
        this._preventClick = !0, B(t, "click", Pt), this.expand();
        var e = this;
        setTimeout(function() {
          at(t, "click", Pt), e._preventClick = !1;
        });
      }
    }), ko = function(t, e, i) {
      return new Nn(t, e, i);
    }, gn = Ht.extend({
      // @section
      // @aka Control.Zoom options
      options: {
        position: "topleft",
        // @option zoomInText: String = '<span aria-hidden="true">+</span>'
        // The text set on the 'zoom in' button.
        zoomInText: '<span aria-hidden="true">+</span>',
        // @option zoomInTitle: String = 'Zoom in'
        // The title set on the 'zoom in' button.
        zoomInTitle: "Zoom in",
        // @option zoomOutText: String = '<span aria-hidden="true">&#x2212;</span>'
        // The text set on the 'zoom out' button.
        zoomOutText: '<span aria-hidden="true">&#x2212;</span>',
        // @option zoomOutTitle: String = 'Zoom out'
        // The title set on the 'zoom out' button.
        zoomOutTitle: "Zoom out"
      },
      onAdd: function(t) {
        var e = "leaflet-control-zoom", i = b("div", e + " leaflet-bar"), n = this.options;
        return this._zoomInButton = this._createButton(
          n.zoomInText,
          n.zoomInTitle,
          e + "-in",
          i,
          this._zoomIn
        ), this._zoomOutButton = this._createButton(
          n.zoomOutText,
          n.zoomOutTitle,
          e + "-out",
          i,
          this._zoomOut
        ), this._updateDisabled(), t.on("zoomend zoomlevelschange", this._updateDisabled, this), i;
      },
      onRemove: function(t) {
        t.off("zoomend zoomlevelschange", this._updateDisabled, this);
      },
      disable: function() {
        return this._disabled = !0, this._updateDisabled(), this;
      },
      enable: function() {
        return this._disabled = !1, this._updateDisabled(), this;
      },
      _zoomIn: function(t) {
        !this._disabled && this._map._zoom < this._map.getMaxZoom() && this._map.zoomIn(this._map.options.zoomDelta * (t.shiftKey ? 3 : 1));
      },
      _zoomOut: function(t) {
        !this._disabled && this._map._zoom > this._map.getMinZoom() && this._map.zoomOut(this._map.options.zoomDelta * (t.shiftKey ? 3 : 1));
      },
      _createButton: function(t, e, i, n, o) {
        var r = b("a", i, n);
        return r.innerHTML = t, r.href = "#", r.title = e, r.setAttribute("role", "button"), r.setAttribute("aria-label", e), pi(r), B(r, "click", Re), B(r, "click", o, this), B(r, "click", this._refocusOnMap, this), r;
      },
      _updateDisabled: function() {
        var t = this._map, e = "leaflet-disabled";
        A(this._zoomInButton, e), A(this._zoomOutButton, e), this._zoomInButton.setAttribute("aria-disabled", "false"), this._zoomOutButton.setAttribute("aria-disabled", "false"), (this._disabled || t._zoom === t.getMinZoom()) && (y(this._zoomOutButton, e), this._zoomOutButton.setAttribute("aria-disabled", "true")), (this._disabled || t._zoom === t.getMaxZoom()) && (y(this._zoomInButton, e), this._zoomInButton.setAttribute("aria-disabled", "true"));
      }
    });
    q.mergeOptions({
      zoomControl: !0
    }), q.addInitHook(function() {
      this.options.zoomControl && (this.zoomControl = new gn(), this.addControl(this.zoomControl));
    });
    var Co = function(t) {
      return new gn(t);
    }, Rn = Ht.extend({
      // @section
      // @aka Control.Scale options
      options: {
        position: "bottomleft",
        // @option maxWidth: Number = 100
        // Maximum width of the control in pixels. The width is set dynamically to show round values (e.g. 100, 200, 500).
        maxWidth: 100,
        // @option metric: Boolean = True
        // Whether to show the metric scale line (m/km).
        metric: !0,
        // @option imperial: Boolean = True
        // Whether to show the imperial scale line (mi/ft).
        imperial: !0
        // @option updateWhenIdle: Boolean = false
        // If `true`, the control is updated on [`moveend`](#map-moveend), otherwise it's always up-to-date (updated on [`move`](#map-move)).
      },
      onAdd: function(t) {
        var e = "leaflet-control-scale", i = b("div", e), n = this.options;
        return this._addScales(n, e + "-line", i), t.on(n.updateWhenIdle ? "moveend" : "move", this._update, this), t.whenReady(this._update, this), i;
      },
      onRemove: function(t) {
        t.off(this.options.updateWhenIdle ? "moveend" : "move", this._update, this);
      },
      _addScales: function(t, e, i) {
        t.metric && (this._mScale = b("div", e, i)), t.imperial && (this._iScale = b("div", e, i));
      },
      _update: function() {
        var t = this._map, e = t.getSize().y / 2, i = t.distance(
          t.containerPointToLatLng([0, e]),
          t.containerPointToLatLng([this.options.maxWidth, e])
        );
        this._updateScales(i);
      },
      _updateScales: function(t) {
        this.options.metric && t && this._updateMetric(t), this.options.imperial && t && this._updateImperial(t);
      },
      _updateMetric: function(t) {
        var e = this._getRoundNum(t), i = e < 1e3 ? e + " m" : e / 1e3 + " km";
        this._updateScale(this._mScale, i, e / t);
      },
      _updateImperial: function(t) {
        var e = t * 3.2808399, i, n, o;
        e > 5280 ? (i = e / 5280, n = this._getRoundNum(i), this._updateScale(this._iScale, n + " mi", n / i)) : (o = this._getRoundNum(e), this._updateScale(this._iScale, o + " ft", o / e));
      },
      _updateScale: function(t, e, i) {
        t.style.width = Math.round(this.options.maxWidth * i) + "px", t.innerHTML = e;
      },
      _getRoundNum: function(t) {
        var e = Math.pow(10, (Math.floor(t) + "").length - 1), i = t / e;
        return i = i >= 10 ? 10 : i >= 5 ? 5 : i >= 3 ? 3 : i >= 2 ? 2 : 1, e * i;
      }
    }), Mo = function(t) {
      return new Rn(t);
    }, So = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" class="leaflet-attribution-flag"><path fill="#4C7BE1" d="M0 0h12v4H0z"/><path fill="#FFD500" d="M0 4h12v3H0z"/><path fill="#E0BC00" d="M0 7h12v1H0z"/></svg>', yn = Ht.extend({
      // @section
      // @aka Control.Attribution options
      options: {
        position: "bottomright",
        // @option prefix: String|false = 'Leaflet'
        // The HTML text shown before the attributions. Pass `false` to disable.
        prefix: '<a href="https://leafletjs.com" title="A JavaScript library for interactive maps">' + (P.inlineSvg ? So + " " : "") + "Leaflet</a>"
      },
      initialize: function(t) {
        Y(this, t), this._attributions = {};
      },
      onAdd: function(t) {
        t.attributionControl = this, this._container = b("div", "leaflet-control-attribution"), pi(this._container);
        for (var e in t._layers)
          t._layers[e].getAttribution && this.addAttribution(t._layers[e].getAttribution());
        return this._update(), t.on("layeradd", this._addAttribution, this), this._container;
      },
      onRemove: function(t) {
        t.off("layeradd", this._addAttribution, this);
      },
      _addAttribution: function(t) {
        t.layer.getAttribution && (this.addAttribution(t.layer.getAttribution()), t.layer.once("remove", function() {
          this.removeAttribution(t.layer.getAttribution());
        }, this));
      },
      // @method setPrefix(prefix: String|false): this
      // The HTML text shown before the attributions. Pass `false` to disable.
      setPrefix: function(t) {
        return this.options.prefix = t, this._update(), this;
      },
      // @method addAttribution(text: String): this
      // Adds an attribution text (e.g. `'&copy; OpenStreetMap contributors'`).
      addAttribution: function(t) {
        return t ? (this._attributions[t] || (this._attributions[t] = 0), this._attributions[t]++, this._update(), this) : this;
      },
      // @method removeAttribution(text: String): this
      // Removes an attribution text.
      removeAttribution: function(t) {
        return t ? (this._attributions[t] && (this._attributions[t]--, this._update()), this) : this;
      },
      _update: function() {
        if (this._map) {
          var t = [];
          for (var e in this._attributions)
            this._attributions[e] && t.push(e);
          var i = [];
          this.options.prefix && i.push(this.options.prefix), t.length && i.push(t.join(", ")), this._container.innerHTML = i.join(' <span aria-hidden="true">|</span> ');
        }
      }
    });
    q.mergeOptions({
      attributionControl: !0
    }), q.addInitHook(function() {
      this.options.attributionControl && new yn().addTo(this);
    });
    var zo = function(t) {
      return new yn(t);
    };
    Ht.Layers = Nn, Ht.Zoom = gn, Ht.Scale = Rn, Ht.Attribution = yn, mi.layers = ko, mi.zoom = Co, mi.scale = Mo, mi.attribution = zo;
    var Xt = yt.extend({
      initialize: function(t) {
        this._map = t;
      },
      // @method enable(): this
      // Enables the handler
      enable: function() {
        return this._enabled ? this : (this._enabled = !0, this.addHooks(), this);
      },
      // @method disable(): this
      // Disables the handler
      disable: function() {
        return this._enabled ? (this._enabled = !1, this.removeHooks(), this) : this;
      },
      // @method enabled(): Boolean
      // Returns `true` if the handler is enabled
      enabled: function() {
        return !!this._enabled;
      }
      // @section Extension methods
      // Classes inheriting from `Handler` must implement the two following methods:
      // @method addHooks()
      // Called when the handler is enabled, should add event hooks.
      // @method removeHooks()
      // Called when the handler is disabled, should remove the event hooks added previously.
    });
    Xt.addTo = function(t, e) {
      return t.addHandler(e, this), this;
    };
    var Eo = { Events: wt }, Dn = P.touch ? "touchstart mousedown" : "mousedown", be = Ut.extend({
      options: {
        // @section
        // @aka Draggable options
        // @option clickTolerance: Number = 3
        // The max number of pixels a user can shift the mouse pointer during a click
        // for it to be considered a valid click (as opposed to a mouse drag).
        clickTolerance: 3
      },
      // @constructor L.Draggable(el: HTMLElement, dragHandle?: HTMLElement, preventOutline?: Boolean, options?: Draggable options)
      // Creates a `Draggable` object for moving `el` when you start dragging the `dragHandle` element (equals `el` itself by default).
      initialize: function(t, e, i, n) {
        Y(this, n), this._element = t, this._dragStartTarget = e || t, this._preventOutline = i;
      },
      // @method enable()
      // Enables the dragging ability
      enable: function() {
        this._enabled || (B(this._dragStartTarget, Dn, this._onDown, this), this._enabled = !0);
      },
      // @method disable()
      // Disables the dragging ability
      disable: function() {
        this._enabled && (be._dragging === this && this.finishDrag(!0), at(this._dragStartTarget, Dn, this._onDown, this), this._enabled = !1, this._moved = !1);
      },
      _onDown: function(t) {
        if (this._enabled && (this._moved = !1, !_(this._element, "leaflet-zoom-anim"))) {
          if (t.touches && t.touches.length !== 1) {
            be._dragging === this && this.finishDrag();
            return;
          }
          if (!(be._dragging || t.shiftKey || t.which !== 1 && t.button !== 1 && !t.touches) && (be._dragging = this, this._preventOutline && dn(this._element), ln(), ci(), !this._moving)) {
            this.fire("down");
            var e = t.touches ? t.touches[0] : t, i = En(this._element);
            this._startPoint = new C(e.clientX, e.clientY), this._startPos = Be(this._element), this._parentScale = cn(i);
            var n = t.type === "mousedown";
            B(document, n ? "mousemove" : "touchmove", this._onMove, this), B(document, n ? "mouseup" : "touchend touchcancel", this._onUp, this);
          }
        }
      },
      _onMove: function(t) {
        if (this._enabled) {
          if (t.touches && t.touches.length > 1) {
            this._moved = !0;
            return;
          }
          var e = t.touches && t.touches.length === 1 ? t.touches[0] : t, i = new C(e.clientX, e.clientY)._subtract(this._startPoint);
          !i.x && !i.y || Math.abs(i.x) + Math.abs(i.y) < this.options.clickTolerance || (i.x /= this._parentScale.x, i.y /= this._parentScale.y, Pt(t), this._moved || (this.fire("dragstart"), this._moved = !0, y(document.body, "leaflet-dragging"), this._lastTarget = t.target || t.srcElement, window.SVGElementInstance && this._lastTarget instanceof window.SVGElementInstance && (this._lastTarget = this._lastTarget.correspondingUseElement), y(this._lastTarget, "leaflet-drag-target")), this._newPos = this._startPos.add(i), this._moving = !0, this._lastEvent = t, this._updatePosition());
        }
      },
      _updatePosition: function() {
        var t = { originalEvent: this._lastEvent };
        this.fire("predrag", t), vt(this._element, this._newPos), this.fire("drag", t);
      },
      _onUp: function() {
        this._enabled && this.finishDrag();
      },
      finishDrag: function(t) {
        A(document.body, "leaflet-dragging"), this._lastTarget && (A(this._lastTarget, "leaflet-drag-target"), this._lastTarget = null), at(document, "mousemove touchmove", this._onMove, this), at(document, "mouseup touchend touchcancel", this._onUp, this), un(), fi();
        var e = this._moved && this._moving;
        this._moving = !1, be._dragging = !1, e && this.fire("dragend", {
          noInertia: t,
          distance: this._newPos.distanceTo(this._startPos)
        });
      }
    });
    function Vn(t, e, i) {
      var n, o = [1, 4, 2, 8], r, l, h, d, f, w, Z, U;
      for (r = 0, w = t.length; r < w; r++)
        t[r]._code = De(t[r], e);
      for (h = 0; h < 4; h++) {
        for (Z = o[h], n = [], r = 0, w = t.length, l = w - 1; r < w; l = r++)
          d = t[r], f = t[l], d._code & Z ? f._code & Z || (U = Ni(f, d, Z, e, i), U._code = De(U, e), n.push(U)) : (f._code & Z && (U = Ni(f, d, Z, e, i), U._code = De(U, e), n.push(U)), n.push(d));
        t = n;
      }
      return t;
    }
    function Un(t, e) {
      var i, n, o, r, l, h, d, f, w;
      if (!t || t.length === 0)
        throw new Error("latlngs not passed");
      Dt(t) || (console.warn("latlngs are not flat! Only the first ring will be used"), t = t[0]);
      var Z = W([0, 0]), U = ct(t), zt = U.getNorthWest().distanceTo(U.getSouthWest()) * U.getNorthEast().distanceTo(U.getNorthWest());
      zt < 1700 && (Z = wn(t));
      var xt = t.length, Vt = [];
      for (i = 0; i < xt; i++) {
        var Ot = W(t[i]);
        Vt.push(e.project(W([Ot.lat - Z.lat, Ot.lng - Z.lng])));
      }
      for (h = d = f = 0, i = 0, n = xt - 1; i < xt; n = i++)
        o = Vt[i], r = Vt[n], l = o.y * r.x - r.y * o.x, d += (o.x + r.x) * l, f += (o.y + r.y) * l, h += l * 3;
      h === 0 ? w = Vt[0] : w = [d / h, f / h];
      var ni = e.unproject(I(w));
      return W([ni.lat + Z.lat, ni.lng + Z.lng]);
    }
    function wn(t) {
      for (var e = 0, i = 0, n = 0, o = 0; o < t.length; o++) {
        var r = W(t[o]);
        e += r.lat, i += r.lng, n++;
      }
      return W([e / n, i / n]);
    }
    var Oo = {
      __proto__: null,
      clipPolygon: Vn,
      polygonCenter: Un,
      centroid: wn
    };
    function Fn(t, e) {
      if (!e || !t.length)
        return t.slice();
      var i = e * e;
      return t = Ao(t, i), t = Io(t, i), t;
    }
    function Hn(t, e, i) {
      return Math.sqrt(vi(t, e, i, !0));
    }
    function Zo(t, e, i) {
      return vi(t, e, i);
    }
    function Io(t, e) {
      var i = t.length, n = typeof Uint8Array < "u" ? Uint8Array : Array, o = new n(i);
      o[0] = o[i - 1] = 1, bn(t, o, e, 0, i - 1);
      var r, l = [];
      for (r = 0; r < i; r++)
        o[r] && l.push(t[r]);
      return l;
    }
    function bn(t, e, i, n, o) {
      var r = 0, l, h, d;
      for (h = n + 1; h <= o - 1; h++)
        d = vi(t[h], t[n], t[o], !0), d > r && (l = h, r = d);
      r > i && (e[l] = 1, bn(t, e, i, n, l), bn(t, e, i, l, o));
    }
    function Ao(t, e) {
      for (var i = [t[0]], n = 1, o = 0, r = t.length; n < r; n++)
        Bo(t[n], t[o]) > e && (i.push(t[n]), o = n);
      return o < r - 1 && i.push(t[r - 1]), i;
    }
    var Wn;
    function jn(t, e, i, n, o) {
      var r = n ? Wn : De(t, i), l = De(e, i), h, d, f;
      for (Wn = l; ; ) {
        if (!(r | l))
          return [t, e];
        if (r & l)
          return !1;
        h = r || l, d = Ni(t, e, h, i, o), f = De(d, i), h === r ? (t = d, r = f) : (e = d, l = f);
      }
    }
    function Ni(t, e, i, n, o) {
      var r = e.x - t.x, l = e.y - t.y, h = n.min, d = n.max, f, w;
      return i & 8 ? (f = t.x + r * (d.y - t.y) / l, w = d.y) : i & 4 ? (f = t.x + r * (h.y - t.y) / l, w = h.y) : i & 2 ? (f = d.x, w = t.y + l * (d.x - t.x) / r) : i & 1 && (f = h.x, w = t.y + l * (h.x - t.x) / r), new C(f, w, o);
    }
    function De(t, e) {
      var i = 0;
      return t.x < e.min.x ? i |= 1 : t.x > e.max.x && (i |= 2), t.y < e.min.y ? i |= 4 : t.y > e.max.y && (i |= 8), i;
    }
    function Bo(t, e) {
      var i = e.x - t.x, n = e.y - t.y;
      return i * i + n * n;
    }
    function vi(t, e, i, n) {
      var o = e.x, r = e.y, l = i.x - o, h = i.y - r, d = l * l + h * h, f;
      return d > 0 && (f = ((t.x - o) * l + (t.y - r) * h) / d, f > 1 ? (o = i.x, r = i.y) : f > 0 && (o += l * f, r += h * f)), l = t.x - o, h = t.y - r, n ? l * l + h * h : new C(o, r);
    }
    function Dt(t) {
      return !mt(t[0]) || typeof t[0][0] != "object" && typeof t[0][0] < "u";
    }
    function Gn(t) {
      return console.warn("Deprecated use of _flat, please use L.LineUtil.isFlat instead."), Dt(t);
    }
    function qn(t, e) {
      var i, n, o, r, l, h, d, f;
      if (!t || t.length === 0)
        throw new Error("latlngs not passed");
      Dt(t) || (console.warn("latlngs are not flat! Only the first ring will be used"), t = t[0]);
      var w = W([0, 0]), Z = ct(t), U = Z.getNorthWest().distanceTo(Z.getSouthWest()) * Z.getNorthEast().distanceTo(Z.getNorthWest());
      U < 1700 && (w = wn(t));
      var zt = t.length, xt = [];
      for (i = 0; i < zt; i++) {
        var Vt = W(t[i]);
        xt.push(e.project(W([Vt.lat - w.lat, Vt.lng - w.lng])));
      }
      for (i = 0, n = 0; i < zt - 1; i++)
        n += xt[i].distanceTo(xt[i + 1]) / 2;
      if (n === 0)
        f = xt[0];
      else
        for (i = 0, r = 0; i < zt - 1; i++)
          if (l = xt[i], h = xt[i + 1], o = l.distanceTo(h), r += o, r > n) {
            d = (r - n) / o, f = [
              h.x - d * (h.x - l.x),
              h.y - d * (h.y - l.y)
            ];
            break;
          }
      var Ot = e.unproject(I(f));
      return W([Ot.lat + w.lat, Ot.lng + w.lng]);
    }
    var No = {
      __proto__: null,
      simplify: Fn,
      pointToSegmentDistance: Hn,
      closestPointOnSegment: Zo,
      clipSegment: jn,
      _getEdgeIntersection: Ni,
      _getBitCode: De,
      _sqClosestPointOnSegment: vi,
      isFlat: Dt,
      _flat: Gn,
      polylineCenter: qn
    }, xn = {
      project: function(t) {
        return new C(t.lng, t.lat);
      },
      unproject: function(t) {
        return new X(t.y, t.x);
      },
      bounds: new rt([-180, -90], [180, 90])
    }, Ln = {
      R: 6378137,
      R_MINOR: 6356752314245179e-9,
      bounds: new rt([-2003750834279e-5, -1549657073972e-5], [2003750834279e-5, 1876465623138e-5]),
      project: function(t) {
        var e = Math.PI / 180, i = this.R, n = t.lat * e, o = this.R_MINOR / i, r = Math.sqrt(1 - o * o), l = r * Math.sin(n), h = Math.tan(Math.PI / 4 - n / 2) / Math.pow((1 - l) / (1 + l), r / 2);
        return n = -i * Math.log(Math.max(h, 1e-10)), new C(t.lng * e * i, n);
      },
      unproject: function(t) {
        for (var e = 180 / Math.PI, i = this.R, n = this.R_MINOR / i, o = Math.sqrt(1 - n * n), r = Math.exp(-t.y / i), l = Math.PI / 2 - 2 * Math.atan(r), h = 0, d = 0.1, f; h < 15 && Math.abs(d) > 1e-7; h++)
          f = o * Math.sin(l), f = Math.pow((1 - f) / (1 + f), o / 2), d = Math.PI / 2 - 2 * Math.atan(r * f) - l, l += d;
        return new X(l * e, t.x * e / i);
      }
    }, Ro = {
      __proto__: null,
      LonLat: xn,
      Mercator: Ln,
      SphericalMercator: We
    }, Do = G({}, Zt, {
      code: "EPSG:3395",
      projection: Ln,
      transformation: function() {
        var t = 0.5 / (Math.PI * Ln.R);
        return oe(t, 0.5, -t, 0.5);
      }()
    }), $n = G({}, Zt, {
      code: "EPSG:4326",
      projection: xn,
      transformation: oe(1 / 180, 1, -1 / 180, 0.5)
    }), Vo = G({}, nt, {
      projection: xn,
      transformation: oe(1, 0, -1, 0),
      scale: function(t) {
        return Math.pow(2, t);
      },
      zoom: function(t) {
        return Math.log(t) / Math.LN2;
      },
      distance: function(t, e) {
        var i = e.lng - t.lng, n = e.lat - t.lat;
        return Math.sqrt(i * i + n * n);
      },
      infinite: !0
    });
    nt.Earth = Zt, nt.EPSG3395 = Do, nt.EPSG3857 = m, nt.EPSG900913 = Ge, nt.EPSG4326 = $n, nt.Simple = Vo;
    var Wt = Ut.extend({
      // Classes extending `L.Layer` will inherit the following options:
      options: {
        // @option pane: String = 'overlayPane'
        // By default the layer will be added to the map's [overlay pane](#map-overlaypane). Overriding this option will cause the layer to be placed on another pane by default.
        pane: "overlayPane",
        // @option attribution: String = null
        // String to be shown in the attribution control, e.g. "© OpenStreetMap contributors". It describes the layer data and is often a legal obligation towards copyright holders and tile providers.
        attribution: null,
        bubblingMouseEvents: !0
      },
      /* @section
       * Classes extending `L.Layer` will inherit the following methods:
       *
       * @method addTo(map: Map|LayerGroup): this
       * Adds the layer to the given map or layer group.
       */
      addTo: function(t) {
        return t.addLayer(this), this;
      },
      // @method remove: this
      // Removes the layer from the map it is currently active on.
      remove: function() {
        return this.removeFrom(this._map || this._mapToAdd);
      },
      // @method removeFrom(map: Map): this
      // Removes the layer from the given map
      //
      // @alternative
      // @method removeFrom(group: LayerGroup): this
      // Removes the layer from the given `LayerGroup`
      removeFrom: function(t) {
        return t && t.removeLayer(this), this;
      },
      // @method getPane(name? : String): HTMLElement
      // Returns the `HTMLElement` representing the named pane on the map. If `name` is omitted, returns the pane for this layer.
      getPane: function(t) {
        return this._map.getPane(t ? this.options[t] || t : this.options.pane);
      },
      addInteractiveTarget: function(t) {
        return this._map._targets[N(t)] = this, this;
      },
      removeInteractiveTarget: function(t) {
        return delete this._map._targets[N(t)], this;
      },
      // @method getAttribution: String
      // Used by the `attribution control`, returns the [attribution option](#gridlayer-attribution).
      getAttribution: function() {
        return this.options.attribution;
      },
      _layerAdd: function(t) {
        var e = t.target;
        if (e.hasLayer(this)) {
          if (this._map = e, this._zoomAnimated = e._zoomAnimated, this.getEvents) {
            var i = this.getEvents();
            e.on(i, this), this.once("remove", function() {
              e.off(i, this);
            }, this);
          }
          this.onAdd(e), this.fire("add"), e.fire("layeradd", { layer: this });
        }
      }
    });
    q.include({
      // @method addLayer(layer: Layer): this
      // Adds the given layer to the map
      addLayer: function(t) {
        if (!t._layerAdd)
          throw new Error("The provided object is not a Layer.");
        var e = N(t);
        return this._layers[e] ? this : (this._layers[e] = t, t._mapToAdd = this, t.beforeAdd && t.beforeAdd(this), this.whenReady(t._layerAdd, t), this);
      },
      // @method removeLayer(layer: Layer): this
      // Removes the given layer from the map.
      removeLayer: function(t) {
        var e = N(t);
        return this._layers[e] ? (this._loaded && t.onRemove(this), delete this._layers[e], this._loaded && (this.fire("layerremove", { layer: t }), t.fire("remove")), t._map = t._mapToAdd = null, this) : this;
      },
      // @method hasLayer(layer: Layer): Boolean
      // Returns `true` if the given layer is currently added to the map
      hasLayer: function(t) {
        return N(t) in this._layers;
      },
      /* @method eachLayer(fn: Function, context?: Object): this
       * Iterates over the layers of the map, optionally specifying context of the iterator function.
       * ```
       * map.eachLayer(function(layer){
       *     layer.bindPopup('Hello');
       * });
       * ```
       */
      eachLayer: function(t, e) {
        for (var i in this._layers)
          t.call(e, this._layers[i]);
        return this;
      },
      _addLayers: function(t) {
        t = t ? mt(t) ? t : [t] : [];
        for (var e = 0, i = t.length; e < i; e++)
          this.addLayer(t[e]);
      },
      _addZoomLimit: function(t) {
        (!isNaN(t.options.maxZoom) || !isNaN(t.options.minZoom)) && (this._zoomBoundLayers[N(t)] = t, this._updateZoomLevels());
      },
      _removeZoomLimit: function(t) {
        var e = N(t);
        this._zoomBoundLayers[e] && (delete this._zoomBoundLayers[e], this._updateZoomLevels());
      },
      _updateZoomLevels: function() {
        var t = 1 / 0, e = -1 / 0, i = this._getZoomSpan();
        for (var n in this._zoomBoundLayers) {
          var o = this._zoomBoundLayers[n].options;
          t = o.minZoom === void 0 ? t : Math.min(t, o.minZoom), e = o.maxZoom === void 0 ? e : Math.max(e, o.maxZoom);
        }
        this._layersMaxZoom = e === -1 / 0 ? void 0 : e, this._layersMinZoom = t === 1 / 0 ? void 0 : t, i !== this._getZoomSpan() && this.fire("zoomlevelschange"), this.options.maxZoom === void 0 && this._layersMaxZoom && this.getZoom() > this._layersMaxZoom && this.setZoom(this._layersMaxZoom), this.options.minZoom === void 0 && this._layersMinZoom && this.getZoom() < this._layersMinZoom && this.setZoom(this._layersMinZoom);
      }
    });
    var Xe = Wt.extend({
      initialize: function(t, e) {
        Y(this, e), this._layers = {};
        var i, n;
        if (t)
          for (i = 0, n = t.length; i < n; i++)
            this.addLayer(t[i]);
      },
      // @method addLayer(layer: Layer): this
      // Adds the given layer to the group.
      addLayer: function(t) {
        var e = this.getLayerId(t);
        return this._layers[e] = t, this._map && this._map.addLayer(t), this;
      },
      // @method removeLayer(layer: Layer): this
      // Removes the given layer from the group.
      // @alternative
      // @method removeLayer(id: Number): this
      // Removes the layer with the given internal ID from the group.
      removeLayer: function(t) {
        var e = t in this._layers ? t : this.getLayerId(t);
        return this._map && this._layers[e] && this._map.removeLayer(this._layers[e]), delete this._layers[e], this;
      },
      // @method hasLayer(layer: Layer): Boolean
      // Returns `true` if the given layer is currently added to the group.
      // @alternative
      // @method hasLayer(id: Number): Boolean
      // Returns `true` if the given internal ID is currently added to the group.
      hasLayer: function(t) {
        var e = typeof t == "number" ? t : this.getLayerId(t);
        return e in this._layers;
      },
      // @method clearLayers(): this
      // Removes all the layers from the group.
      clearLayers: function() {
        return this.eachLayer(this.removeLayer, this);
      },
      // @method invoke(methodName: String, …): this
      // Calls `methodName` on every layer contained in this group, passing any
      // additional parameters. Has no effect if the layers contained do not
      // implement `methodName`.
      invoke: function(t) {
        var e = Array.prototype.slice.call(arguments, 1), i, n;
        for (i in this._layers)
          n = this._layers[i], n[t] && n[t].apply(n, e);
        return this;
      },
      onAdd: function(t) {
        this.eachLayer(t.addLayer, t);
      },
      onRemove: function(t) {
        this.eachLayer(t.removeLayer, t);
      },
      // @method eachLayer(fn: Function, context?: Object): this
      // Iterates over the layers of the group, optionally specifying context of the iterator function.
      // ```js
      // group.eachLayer(function (layer) {
      // 	layer.bindPopup('Hello');
      // });
      // ```
      eachLayer: function(t, e) {
        for (var i in this._layers)
          t.call(e, this._layers[i]);
        return this;
      },
      // @method getLayer(id: Number): Layer
      // Returns the layer with the given internal ID.
      getLayer: function(t) {
        return this._layers[t];
      },
      // @method getLayers(): Layer[]
      // Returns an array of all the layers added to the group.
      getLayers: function() {
        var t = [];
        return this.eachLayer(t.push, t), t;
      },
      // @method setZIndex(zIndex: Number): this
      // Calls `setZIndex` on every layer contained in this group, passing the z-index.
      setZIndex: function(t) {
        return this.invoke("setZIndex", t);
      },
      // @method getLayerId(layer: Layer): Number
      // Returns the internal ID for a layer
      getLayerId: function(t) {
        return N(t);
      }
    }), Uo = function(t, e) {
      return new Xe(t, e);
    }, le = Xe.extend({
      addLayer: function(t) {
        return this.hasLayer(t) ? this : (t.addEventParent(this), Xe.prototype.addLayer.call(this, t), this.fire("layeradd", { layer: t }));
      },
      removeLayer: function(t) {
        return this.hasLayer(t) ? (t in this._layers && (t = this._layers[t]), t.removeEventParent(this), Xe.prototype.removeLayer.call(this, t), this.fire("layerremove", { layer: t })) : this;
      },
      // @method setStyle(style: Path options): this
      // Sets the given path options to each layer of the group that has a `setStyle` method.
      setStyle: function(t) {
        return this.invoke("setStyle", t);
      },
      // @method bringToFront(): this
      // Brings the layer group to the top of all other layers
      bringToFront: function() {
        return this.invoke("bringToFront");
      },
      // @method bringToBack(): this
      // Brings the layer group to the back of all other layers
      bringToBack: function() {
        return this.invoke("bringToBack");
      },
      // @method getBounds(): LatLngBounds
      // Returns the LatLngBounds of the Feature Group (created from bounds and coordinates of its children).
      getBounds: function() {
        var t = new Lt();
        for (var e in this._layers) {
          var i = this._layers[e];
          t.extend(i.getBounds ? i.getBounds() : i.getLatLng());
        }
        return t;
      }
    }), Fo = function(t, e) {
      return new le(t, e);
    }, Qe = yt.extend({
      /* @section
       * @aka Icon options
       *
       * @option iconUrl: String = null
       * **(required)** The URL to the icon image (absolute or relative to your script path).
       *
       * @option iconRetinaUrl: String = null
       * The URL to a retina sized version of the icon image (absolute or relative to your
       * script path). Used for Retina screen devices.
       *
       * @option iconSize: Point = null
       * Size of the icon image in pixels.
       *
       * @option iconAnchor: Point = null
       * The coordinates of the "tip" of the icon (relative to its top left corner). The icon
       * will be aligned so that this point is at the marker's geographical location. Centered
       * by default if size is specified, also can be set in CSS with negative margins.
       *
       * @option popupAnchor: Point = [0, 0]
       * The coordinates of the point from which popups will "open", relative to the icon anchor.
       *
       * @option tooltipAnchor: Point = [0, 0]
       * The coordinates of the point from which tooltips will "open", relative to the icon anchor.
       *
       * @option shadowUrl: String = null
       * The URL to the icon shadow image. If not specified, no shadow image will be created.
       *
       * @option shadowRetinaUrl: String = null
       *
       * @option shadowSize: Point = null
       * Size of the shadow image in pixels.
       *
       * @option shadowAnchor: Point = null
       * The coordinates of the "tip" of the shadow (relative to its top left corner) (the same
       * as iconAnchor if not specified).
       *
       * @option className: String = ''
       * A custom class name to assign to both icon and shadow images. Empty by default.
       */
      options: {
        popupAnchor: [0, 0],
        tooltipAnchor: [0, 0],
        // @option crossOrigin: Boolean|String = false
        // Whether the crossOrigin attribute will be added to the tiles.
        // If a String is provided, all tiles will have their crossOrigin attribute set to the String provided. This is needed if you want to access tile pixel data.
        // Refer to [CORS Settings](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) for valid String values.
        crossOrigin: !1
      },
      initialize: function(t) {
        Y(this, t);
      },
      // @method createIcon(oldIcon?: HTMLElement): HTMLElement
      // Called internally when the icon has to be shown, returns a `<img>` HTML element
      // styled according to the options.
      createIcon: function(t) {
        return this._createIcon("icon", t);
      },
      // @method createShadow(oldIcon?: HTMLElement): HTMLElement
      // As `createIcon`, but for the shadow beneath it.
      createShadow: function(t) {
        return this._createIcon("shadow", t);
      },
      _createIcon: function(t, e) {
        var i = this._getIconUrl(t);
        if (!i) {
          if (t === "icon")
            throw new Error("iconUrl not set in Icon options (see the docs).");
          return null;
        }
        var n = this._createImg(i, e && e.tagName === "IMG" ? e : null);
        return this._setIconStyles(n, t), (this.options.crossOrigin || this.options.crossOrigin === "") && (n.crossOrigin = this.options.crossOrigin === !0 ? "" : this.options.crossOrigin), n;
      },
      _setIconStyles: function(t, e) {
        var i = this.options, n = i[e + "Size"];
        typeof n == "number" && (n = [n, n]);
        var o = I(n), r = I(e === "shadow" && i.shadowAnchor || i.iconAnchor || o && o.divideBy(2, !0));
        t.className = "leaflet-marker-" + e + " " + (i.className || ""), r && (t.style.marginLeft = -r.x + "px", t.style.marginTop = -r.y + "px"), o && (t.style.width = o.x + "px", t.style.height = o.y + "px");
      },
      _createImg: function(t, e) {
        return e = e || document.createElement("img"), e.src = t, e;
      },
      _getIconUrl: function(t) {
        return P.retina && this.options[t + "RetinaUrl"] || this.options[t + "Url"];
      }
    });
    function Ho(t) {
      return new Qe(t);
    }
    var gi = Qe.extend({
      options: {
        iconUrl: "marker-icon.png",
        iconRetinaUrl: "marker-icon-2x.png",
        shadowUrl: "marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41]
      },
      _getIconUrl: function(t) {
        return typeof gi.imagePath != "string" && (gi.imagePath = this._detectIconPath()), (this.options.imagePath || gi.imagePath) + Qe.prototype._getIconUrl.call(this, t);
      },
      _stripUrl: function(t) {
        var e = function(i, n, o) {
          var r = n.exec(i);
          return r && r[o];
        };
        return t = e(t, /^url\((['"])?(.+)\1\)$/, 2), t && e(t, /^(.*)marker-icon\.png$/, 1);
      },
      _detectIconPath: function() {
        var t = b("div", "leaflet-default-icon-path", document.body), e = R(t, "background-image") || R(t, "backgroundImage");
        if (document.body.removeChild(t), e = this._stripUrl(e), e)
          return e;
        var i = document.querySelector('link[href$="leaflet.css"]');
        return i ? i.href.substring(0, i.href.length - 11 - 1) : "";
      }
    }), Kn = Xt.extend({
      initialize: function(t) {
        this._marker = t;
      },
      addHooks: function() {
        var t = this._marker._icon;
        this._draggable || (this._draggable = new be(t, t, !0)), this._draggable.on({
          dragstart: this._onDragStart,
          predrag: this._onPreDrag,
          drag: this._onDrag,
          dragend: this._onDragEnd
        }, this).enable(), y(t, "leaflet-marker-draggable");
      },
      removeHooks: function() {
        this._draggable.off({
          dragstart: this._onDragStart,
          predrag: this._onPreDrag,
          drag: this._onDrag,
          dragend: this._onDragEnd
        }, this).disable(), this._marker._icon && A(this._marker._icon, "leaflet-marker-draggable");
      },
      moved: function() {
        return this._draggable && this._draggable._moved;
      },
      _adjustPan: function(t) {
        var e = this._marker, i = e._map, n = this._marker.options.autoPanSpeed, o = this._marker.options.autoPanPadding, r = Be(e._icon), l = i.getPixelBounds(), h = i.getPixelOrigin(), d = Mt(
          l.min._subtract(h).add(o),
          l.max._subtract(h).subtract(o)
        );
        if (!d.contains(r)) {
          var f = I(
            (Math.max(d.max.x, r.x) - d.max.x) / (l.max.x - d.max.x) - (Math.min(d.min.x, r.x) - d.min.x) / (l.min.x - d.min.x),
            (Math.max(d.max.y, r.y) - d.max.y) / (l.max.y - d.max.y) - (Math.min(d.min.y, r.y) - d.min.y) / (l.min.y - d.min.y)
          ).multiplyBy(n);
          i.panBy(f, { animate: !1 }), this._draggable._newPos._add(f), this._draggable._startPos._add(f), vt(e._icon, this._draggable._newPos), this._onDrag(t), this._panRequest = z(this._adjustPan.bind(this, t));
        }
      },
      _onDragStart: function() {
        this._oldLatLng = this._marker.getLatLng(), this._marker.closePopup && this._marker.closePopup(), this._marker.fire("movestart").fire("dragstart");
      },
      _onPreDrag: function(t) {
        this._marker.options.autoPan && (H(this._panRequest), this._panRequest = z(this._adjustPan.bind(this, t)));
      },
      _onDrag: function(t) {
        var e = this._marker, i = e._shadow, n = Be(e._icon), o = e._map.layerPointToLatLng(n);
        i && vt(i, n), e._latlng = o, t.latlng = o, t.oldLatLng = this._oldLatLng, e.fire("move", t).fire("drag", t);
      },
      _onDragEnd: function(t) {
        H(this._panRequest), delete this._oldLatLng, this._marker.fire("moveend").fire("dragend", t);
      }
    }), Ri = Wt.extend({
      // @section
      // @aka Marker options
      options: {
        // @option icon: Icon = *
        // Icon instance to use for rendering the marker.
        // See [Icon documentation](#L.Icon) for details on how to customize the marker icon.
        // If not specified, a common instance of `L.Icon.Default` is used.
        icon: new gi(),
        // Option inherited from "Interactive layer" abstract class
        interactive: !0,
        // @option keyboard: Boolean = true
        // Whether the marker can be tabbed to with a keyboard and clicked by pressing enter.
        keyboard: !0,
        // @option title: String = ''
        // Text for the browser tooltip that appear on marker hover (no tooltip by default).
        // [Useful for accessibility](https://leafletjs.com/examples/accessibility/#markers-must-be-labelled).
        title: "",
        // @option alt: String = 'Marker'
        // Text for the `alt` attribute of the icon image.
        // [Useful for accessibility](https://leafletjs.com/examples/accessibility/#markers-must-be-labelled).
        alt: "Marker",
        // @option zIndexOffset: Number = 0
        // By default, marker images zIndex is set automatically based on its latitude. Use this option if you want to put the marker on top of all others (or below), specifying a high value like `1000` (or high negative value, respectively).
        zIndexOffset: 0,
        // @option opacity: Number = 1.0
        // The opacity of the marker.
        opacity: 1,
        // @option riseOnHover: Boolean = false
        // If `true`, the marker will get on top of others when you hover the mouse over it.
        riseOnHover: !1,
        // @option riseOffset: Number = 250
        // The z-index offset used for the `riseOnHover` feature.
        riseOffset: 250,
        // @option pane: String = 'markerPane'
        // `Map pane` where the markers icon will be added.
        pane: "markerPane",
        // @option shadowPane: String = 'shadowPane'
        // `Map pane` where the markers shadow will be added.
        shadowPane: "shadowPane",
        // @option bubblingMouseEvents: Boolean = false
        // When `true`, a mouse event on this marker will trigger the same event on the map
        // (unless [`L.DomEvent.stopPropagation`](#domevent-stoppropagation) is used).
        bubblingMouseEvents: !1,
        // @option autoPanOnFocus: Boolean = true
        // When `true`, the map will pan whenever the marker is focused (via
        // e.g. pressing `tab` on the keyboard) to ensure the marker is
        // visible within the map's bounds
        autoPanOnFocus: !0,
        // @section Draggable marker options
        // @option draggable: Boolean = false
        // Whether the marker is draggable with mouse/touch or not.
        draggable: !1,
        // @option autoPan: Boolean = false
        // Whether to pan the map when dragging this marker near its edge or not.
        autoPan: !1,
        // @option autoPanPadding: Point = Point(50, 50)
        // Distance (in pixels to the left/right and to the top/bottom) of the
        // map edge to start panning the map.
        autoPanPadding: [50, 50],
        // @option autoPanSpeed: Number = 10
        // Number of pixels the map should pan by.
        autoPanSpeed: 10
      },
      /* @section
       *
       * In addition to [shared layer methods](#Layer) like `addTo()` and `remove()` and [popup methods](#Popup) like bindPopup() you can also use the following methods:
       */
      initialize: function(t, e) {
        Y(this, e), this._latlng = W(t);
      },
      onAdd: function(t) {
        this._zoomAnimated = this._zoomAnimated && t.options.markerZoomAnimation, this._zoomAnimated && t.on("zoomanim", this._animateZoom, this), this._initIcon(), this.update();
      },
      onRemove: function(t) {
        this.dragging && this.dragging.enabled() && (this.options.draggable = !0, this.dragging.removeHooks()), delete this.dragging, this._zoomAnimated && t.off("zoomanim", this._animateZoom, this), this._removeIcon(), this._removeShadow();
      },
      getEvents: function() {
        return {
          zoom: this.update,
          viewreset: this.update
        };
      },
      // @method getLatLng: LatLng
      // Returns the current geographical position of the marker.
      getLatLng: function() {
        return this._latlng;
      },
      // @method setLatLng(latlng: LatLng): this
      // Changes the marker position to the given point.
      setLatLng: function(t) {
        var e = this._latlng;
        return this._latlng = W(t), this.update(), this.fire("move", { oldLatLng: e, latlng: this._latlng });
      },
      // @method setZIndexOffset(offset: Number): this
      // Changes the [zIndex offset](#marker-zindexoffset) of the marker.
      setZIndexOffset: function(t) {
        return this.options.zIndexOffset = t, this.update();
      },
      // @method getIcon: Icon
      // Returns the current icon used by the marker
      getIcon: function() {
        return this.options.icon;
      },
      // @method setIcon(icon: Icon): this
      // Changes the marker icon.
      setIcon: function(t) {
        return this.options.icon = t, this._map && (this._initIcon(), this.update()), this._popup && this.bindPopup(this._popup, this._popup.options), this;
      },
      getElement: function() {
        return this._icon;
      },
      update: function() {
        if (this._icon && this._map) {
          var t = this._map.latLngToLayerPoint(this._latlng).round();
          this._setPos(t);
        }
        return this;
      },
      _initIcon: function() {
        var t = this.options, e = "leaflet-zoom-" + (this._zoomAnimated ? "animated" : "hide"), i = t.icon.createIcon(this._icon), n = !1;
        i !== this._icon && (this._icon && this._removeIcon(), n = !0, t.title && (i.title = t.title), i.tagName === "IMG" && (i.alt = t.alt || "")), y(i, e), t.keyboard && (i.tabIndex = "0", i.setAttribute("role", "button")), this._icon = i, t.riseOnHover && this.on({
          mouseover: this._bringToFront,
          mouseout: this._resetZIndex
        }), this.options.autoPanOnFocus && B(i, "focus", this._panOnFocus, this);
        var o = t.icon.createShadow(this._shadow), r = !1;
        o !== this._shadow && (this._removeShadow(), r = !0), o && (y(o, e), o.alt = ""), this._shadow = o, t.opacity < 1 && this._updateOpacity(), n && this.getPane().appendChild(this._icon), this._initInteraction(), o && r && this.getPane(t.shadowPane).appendChild(this._shadow);
      },
      _removeIcon: function() {
        this.options.riseOnHover && this.off({
          mouseover: this._bringToFront,
          mouseout: this._resetZIndex
        }), this.options.autoPanOnFocus && at(this._icon, "focus", this._panOnFocus, this), V(this._icon), this.removeInteractiveTarget(this._icon), this._icon = null;
      },
      _removeShadow: function() {
        this._shadow && V(this._shadow), this._shadow = null;
      },
      _setPos: function(t) {
        this._icon && vt(this._icon, t), this._shadow && vt(this._shadow, t), this._zIndex = t.y + this.options.zIndexOffset, this._resetZIndex();
      },
      _updateZIndex: function(t) {
        this._icon && (this._icon.style.zIndex = this._zIndex + t);
      },
      _animateZoom: function(t) {
        var e = this._map._latLngToNewLayerPoint(this._latlng, t.zoom, t.center).round();
        this._setPos(e);
      },
      _initInteraction: function() {
        if (this.options.interactive && (y(this._icon, "leaflet-interactive"), this.addInteractiveTarget(this._icon), Kn)) {
          var t = this.options.draggable;
          this.dragging && (t = this.dragging.enabled(), this.dragging.disable()), this.dragging = new Kn(this), t && this.dragging.enable();
        }
      },
      // @method setOpacity(opacity: Number): this
      // Changes the opacity of the marker.
      setOpacity: function(t) {
        return this.options.opacity = t, this._map && this._updateOpacity(), this;
      },
      _updateOpacity: function() {
        var t = this.options.opacity;
        this._icon && $(this._icon, t), this._shadow && $(this._shadow, t);
      },
      _bringToFront: function() {
        this._updateZIndex(this.options.riseOffset);
      },
      _resetZIndex: function() {
        this._updateZIndex(0);
      },
      _panOnFocus: function() {
        var t = this._map;
        if (t) {
          var e = this.options.icon.options, i = e.iconSize ? I(e.iconSize) : I(0, 0), n = e.iconAnchor ? I(e.iconAnchor) : I(0, 0);
          t.panInside(this._latlng, {
            paddingTopLeft: n,
            paddingBottomRight: i.subtract(n)
          });
        }
      },
      _getPopupAnchor: function() {
        return this.options.icon.options.popupAnchor;
      },
      _getTooltipAnchor: function() {
        return this.options.icon.options.tooltipAnchor;
      }
    });
    function Wo(t, e) {
      return new Ri(t, e);
    }
    var xe = Wt.extend({
      // @section
      // @aka Path options
      options: {
        // @option stroke: Boolean = true
        // Whether to draw stroke along the path. Set it to `false` to disable borders on polygons or circles.
        stroke: !0,
        // @option color: String = '#3388ff'
        // Stroke color
        color: "#3388ff",
        // @option weight: Number = 3
        // Stroke width in pixels
        weight: 3,
        // @option opacity: Number = 1.0
        // Stroke opacity
        opacity: 1,
        // @option lineCap: String= 'round'
        // A string that defines [shape to be used at the end](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-linecap) of the stroke.
        lineCap: "round",
        // @option lineJoin: String = 'round'
        // A string that defines [shape to be used at the corners](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-linejoin) of the stroke.
        lineJoin: "round",
        // @option dashArray: String = null
        // A string that defines the stroke [dash pattern](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-dasharray). Doesn't work on `Canvas`-powered layers in [some old browsers](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/setLineDash#Browser_compatibility).
        dashArray: null,
        // @option dashOffset: String = null
        // A string that defines the [distance into the dash pattern to start the dash](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-dashoffset). Doesn't work on `Canvas`-powered layers in [some old browsers](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/setLineDash#Browser_compatibility).
        dashOffset: null,
        // @option fill: Boolean = depends
        // Whether to fill the path with color. Set it to `false` to disable filling on polygons or circles.
        fill: !1,
        // @option fillColor: String = *
        // Fill color. Defaults to the value of the [`color`](#path-color) option
        fillColor: null,
        // @option fillOpacity: Number = 0.2
        // Fill opacity.
        fillOpacity: 0.2,
        // @option fillRule: String = 'evenodd'
        // A string that defines [how the inside of a shape](https://developer.mozilla.org/docs/Web/SVG/Attribute/fill-rule) is determined.
        fillRule: "evenodd",
        // className: '',
        // Option inherited from "Interactive layer" abstract class
        interactive: !0,
        // @option bubblingMouseEvents: Boolean = true
        // When `true`, a mouse event on this path will trigger the same event on the map
        // (unless [`L.DomEvent.stopPropagation`](#domevent-stoppropagation) is used).
        bubblingMouseEvents: !0
      },
      beforeAdd: function(t) {
        this._renderer = t.getRenderer(this);
      },
      onAdd: function() {
        this._renderer._initPath(this), this._reset(), this._renderer._addPath(this);
      },
      onRemove: function() {
        this._renderer._removePath(this);
      },
      // @method redraw(): this
      // Redraws the layer. Sometimes useful after you changed the coordinates that the path uses.
      redraw: function() {
        return this._map && this._renderer._updatePath(this), this;
      },
      // @method setStyle(style: Path options): this
      // Changes the appearance of a Path based on the options in the `Path options` object.
      setStyle: function(t) {
        return Y(this, t), this._renderer && (this._renderer._updateStyle(this), this.options.stroke && t && Object.prototype.hasOwnProperty.call(t, "weight") && this._updateBounds()), this;
      },
      // @method bringToFront(): this
      // Brings the layer to the top of all path layers.
      bringToFront: function() {
        return this._renderer && this._renderer._bringToFront(this), this;
      },
      // @method bringToBack(): this
      // Brings the layer to the bottom of all path layers.
      bringToBack: function() {
        return this._renderer && this._renderer._bringToBack(this), this;
      },
      getElement: function() {
        return this._path;
      },
      _reset: function() {
        this._project(), this._update();
      },
      _clickTolerance: function() {
        return (this.options.stroke ? this.options.weight / 2 : 0) + (this._renderer.options.tolerance || 0);
      }
    }), Di = xe.extend({
      // @section
      // @aka CircleMarker options
      options: {
        fill: !0,
        // @option radius: Number = 10
        // Radius of the circle marker, in pixels
        radius: 10
      },
      initialize: function(t, e) {
        Y(this, e), this._latlng = W(t), this._radius = this.options.radius;
      },
      // @method setLatLng(latLng: LatLng): this
      // Sets the position of a circle marker to a new location.
      setLatLng: function(t) {
        var e = this._latlng;
        return this._latlng = W(t), this.redraw(), this.fire("move", { oldLatLng: e, latlng: this._latlng });
      },
      // @method getLatLng(): LatLng
      // Returns the current geographical position of the circle marker
      getLatLng: function() {
        return this._latlng;
      },
      // @method setRadius(radius: Number): this
      // Sets the radius of a circle marker. Units are in pixels.
      setRadius: function(t) {
        return this.options.radius = this._radius = t, this.redraw();
      },
      // @method getRadius(): Number
      // Returns the current radius of the circle
      getRadius: function() {
        return this._radius;
      },
      setStyle: function(t) {
        var e = t && t.radius || this._radius;
        return xe.prototype.setStyle.call(this, t), this.setRadius(e), this;
      },
      _project: function() {
        this._point = this._map.latLngToLayerPoint(this._latlng), this._updateBounds();
      },
      _updateBounds: function() {
        var t = this._radius, e = this._radiusY || t, i = this._clickTolerance(), n = [t + i, e + i];
        this._pxBounds = new rt(this._point.subtract(n), this._point.add(n));
      },
      _update: function() {
        this._map && this._updatePath();
      },
      _updatePath: function() {
        this._renderer._updateCircle(this);
      },
      _empty: function() {
        return this._radius && !this._renderer._bounds.intersects(this._pxBounds);
      },
      // Needed by the `Canvas` renderer for interactivity
      _containsPoint: function(t) {
        return t.distanceTo(this._point) <= this._radius + this._clickTolerance();
      }
    });
    function jo(t, e) {
      return new Di(t, e);
    }
    var Pn = Di.extend({
      initialize: function(t, e, i) {
        if (typeof e == "number" && (e = G({}, i, { radius: e })), Y(this, e), this._latlng = W(t), isNaN(this.options.radius))
          throw new Error("Circle radius cannot be NaN");
        this._mRadius = this.options.radius;
      },
      // @method setRadius(radius: Number): this
      // Sets the radius of a circle. Units are in meters.
      setRadius: function(t) {
        return this._mRadius = t, this.redraw();
      },
      // @method getRadius(): Number
      // Returns the current radius of a circle. Units are in meters.
      getRadius: function() {
        return this._mRadius;
      },
      // @method getBounds(): LatLngBounds
      // Returns the `LatLngBounds` of the path.
      getBounds: function() {
        var t = [this._radius, this._radiusY || this._radius];
        return new Lt(
          this._map.layerPointToLatLng(this._point.subtract(t)),
          this._map.layerPointToLatLng(this._point.add(t))
        );
      },
      setStyle: xe.prototype.setStyle,
      _project: function() {
        var t = this._latlng.lng, e = this._latlng.lat, i = this._map, n = i.options.crs;
        if (n.distance === Zt.distance) {
          var o = Math.PI / 180, r = this._mRadius / Zt.R / o, l = i.project([e + r, t]), h = i.project([e - r, t]), d = l.add(h).divideBy(2), f = i.unproject(d).lat, w = Math.acos((Math.cos(r * o) - Math.sin(e * o) * Math.sin(f * o)) / (Math.cos(e * o) * Math.cos(f * o))) / o;
          (isNaN(w) || w === 0) && (w = r / Math.cos(Math.PI / 180 * e)), this._point = d.subtract(i.getPixelOrigin()), this._radius = isNaN(w) ? 0 : d.x - i.project([f, t - w]).x, this._radiusY = d.y - l.y;
        } else {
          var Z = n.unproject(n.project(this._latlng).subtract([this._mRadius, 0]));
          this._point = i.latLngToLayerPoint(this._latlng), this._radius = this._point.x - i.latLngToLayerPoint(Z).x;
        }
        this._updateBounds();
      }
    });
    function Go(t, e, i) {
      return new Pn(t, e, i);
    }
    var ue = xe.extend({
      // @section
      // @aka Polyline options
      options: {
        // @option smoothFactor: Number = 1.0
        // How much to simplify the polyline on each zoom level. More means
        // better performance and smoother look, and less means more accurate representation.
        smoothFactor: 1,
        // @option noClip: Boolean = false
        // Disable polyline clipping.
        noClip: !1
      },
      initialize: function(t, e) {
        Y(this, e), this._setLatLngs(t);
      },
      // @method getLatLngs(): LatLng[]
      // Returns an array of the points in the path, or nested arrays of points in case of multi-polyline.
      getLatLngs: function() {
        return this._latlngs;
      },
      // @method setLatLngs(latlngs: LatLng[]): this
      // Replaces all the points in the polyline with the given array of geographical points.
      setLatLngs: function(t) {
        return this._setLatLngs(t), this.redraw();
      },
      // @method isEmpty(): Boolean
      // Returns `true` if the Polyline has no LatLngs.
      isEmpty: function() {
        return !this._latlngs.length;
      },
      // @method closestLayerPoint(p: Point): Point
      // Returns the point closest to `p` on the Polyline.
      closestLayerPoint: function(t) {
        for (var e = 1 / 0, i = null, n = vi, o, r, l = 0, h = this._parts.length; l < h; l++)
          for (var d = this._parts[l], f = 1, w = d.length; f < w; f++) {
            o = d[f - 1], r = d[f];
            var Z = n(t, o, r, !0);
            Z < e && (e = Z, i = n(t, o, r));
          }
        return i && (i.distance = Math.sqrt(e)), i;
      },
      // @method getCenter(): LatLng
      // Returns the center ([centroid](https://en.wikipedia.org/wiki/Centroid)) of the polyline.
      getCenter: function() {
        if (!this._map)
          throw new Error("Must add layer to map before using getCenter()");
        return qn(this._defaultShape(), this._map.options.crs);
      },
      // @method getBounds(): LatLngBounds
      // Returns the `LatLngBounds` of the path.
      getBounds: function() {
        return this._bounds;
      },
      // @method addLatLng(latlng: LatLng, latlngs?: LatLng[]): this
      // Adds a given point to the polyline. By default, adds to the first ring of
      // the polyline in case of a multi-polyline, but can be overridden by passing
      // a specific ring as a LatLng array (that you can earlier access with [`getLatLngs`](#polyline-getlatlngs)).
      addLatLng: function(t, e) {
        return e = e || this._defaultShape(), t = W(t), e.push(t), this._bounds.extend(t), this.redraw();
      },
      _setLatLngs: function(t) {
        this._bounds = new Lt(), this._latlngs = this._convertLatLngs(t);
      },
      _defaultShape: function() {
        return Dt(this._latlngs) ? this._latlngs : this._latlngs[0];
      },
      // recursively convert latlngs input into actual LatLng instances; calculate bounds along the way
      _convertLatLngs: function(t) {
        for (var e = [], i = Dt(t), n = 0, o = t.length; n < o; n++)
          i ? (e[n] = W(t[n]), this._bounds.extend(e[n])) : e[n] = this._convertLatLngs(t[n]);
        return e;
      },
      _project: function() {
        var t = new rt();
        this._rings = [], this._projectLatlngs(this._latlngs, this._rings, t), this._bounds.isValid() && t.isValid() && (this._rawPxBounds = t, this._updateBounds());
      },
      _updateBounds: function() {
        var t = this._clickTolerance(), e = new C(t, t);
        this._rawPxBounds && (this._pxBounds = new rt([
          this._rawPxBounds.min.subtract(e),
          this._rawPxBounds.max.add(e)
        ]));
      },
      // recursively turns latlngs into a set of rings with projected coordinates
      _projectLatlngs: function(t, e, i) {
        var n = t[0] instanceof X, o = t.length, r, l;
        if (n) {
          for (l = [], r = 0; r < o; r++)
            l[r] = this._map.latLngToLayerPoint(t[r]), i.extend(l[r]);
          e.push(l);
        } else
          for (r = 0; r < o; r++)
            this._projectLatlngs(t[r], e, i);
      },
      // clip polyline by renderer bounds so that we have less to render for performance
      _clipPoints: function() {
        var t = this._renderer._bounds;
        if (this._parts = [], !(!this._pxBounds || !this._pxBounds.intersects(t))) {
          if (this.options.noClip) {
            this._parts = this._rings;
            return;
          }
          var e = this._parts, i, n, o, r, l, h, d;
          for (i = 0, o = 0, r = this._rings.length; i < r; i++)
            for (d = this._rings[i], n = 0, l = d.length; n < l - 1; n++)
              h = jn(d[n], d[n + 1], t, n, !0), h && (e[o] = e[o] || [], e[o].push(h[0]), (h[1] !== d[n + 1] || n === l - 2) && (e[o].push(h[1]), o++));
        }
      },
      // simplify each clipped part of the polyline for performance
      _simplifyPoints: function() {
        for (var t = this._parts, e = this.options.smoothFactor, i = 0, n = t.length; i < n; i++)
          t[i] = Fn(t[i], e);
      },
      _update: function() {
        this._map && (this._clipPoints(), this._simplifyPoints(), this._updatePath());
      },
      _updatePath: function() {
        this._renderer._updatePoly(this);
      },
      // Needed by the `Canvas` renderer for interactivity
      _containsPoint: function(t, e) {
        var i, n, o, r, l, h, d = this._clickTolerance();
        if (!this._pxBounds || !this._pxBounds.contains(t))
          return !1;
        for (i = 0, r = this._parts.length; i < r; i++)
          for (h = this._parts[i], n = 0, l = h.length, o = l - 1; n < l; o = n++)
            if (!(!e && n === 0) && Hn(t, h[o], h[n]) <= d)
              return !0;
        return !1;
      }
    });
    function qo(t, e) {
      return new ue(t, e);
    }
    ue._flat = Gn;
    var ti = ue.extend({
      options: {
        fill: !0
      },
      isEmpty: function() {
        return !this._latlngs.length || !this._latlngs[0].length;
      },
      // @method getCenter(): LatLng
      // Returns the center ([centroid](http://en.wikipedia.org/wiki/Centroid)) of the Polygon.
      getCenter: function() {
        if (!this._map)
          throw new Error("Must add layer to map before using getCenter()");
        return Un(this._defaultShape(), this._map.options.crs);
      },
      _convertLatLngs: function(t) {
        var e = ue.prototype._convertLatLngs.call(this, t), i = e.length;
        return i >= 2 && e[0] instanceof X && e[0].equals(e[i - 1]) && e.pop(), e;
      },
      _setLatLngs: function(t) {
        ue.prototype._setLatLngs.call(this, t), Dt(this._latlngs) && (this._latlngs = [this._latlngs]);
      },
      _defaultShape: function() {
        return Dt(this._latlngs[0]) ? this._latlngs[0] : this._latlngs[0][0];
      },
      _clipPoints: function() {
        var t = this._renderer._bounds, e = this.options.weight, i = new C(e, e);
        if (t = new rt(t.min.subtract(i), t.max.add(i)), this._parts = [], !(!this._pxBounds || !this._pxBounds.intersects(t))) {
          if (this.options.noClip) {
            this._parts = this._rings;
            return;
          }
          for (var n = 0, o = this._rings.length, r; n < o; n++)
            r = Vn(this._rings[n], t, !0), r.length && this._parts.push(r);
        }
      },
      _updatePath: function() {
        this._renderer._updatePoly(this, !0);
      },
      // Needed by the `Canvas` renderer for interactivity
      _containsPoint: function(t) {
        var e = !1, i, n, o, r, l, h, d, f;
        if (!this._pxBounds || !this._pxBounds.contains(t))
          return !1;
        for (r = 0, d = this._parts.length; r < d; r++)
          for (i = this._parts[r], l = 0, f = i.length, h = f - 1; l < f; h = l++)
            n = i[l], o = i[h], n.y > t.y != o.y > t.y && t.x < (o.x - n.x) * (t.y - n.y) / (o.y - n.y) + n.x && (e = !e);
        return e || ue.prototype._containsPoint.call(this, t, !0);
      }
    });
    function $o(t, e) {
      return new ti(t, e);
    }
    var he = le.extend({
      /* @section
       * @aka GeoJSON options
       *
       * @option pointToLayer: Function = *
       * A `Function` defining how GeoJSON points spawn Leaflet layers. It is internally
       * called when data is added, passing the GeoJSON point feature and its `LatLng`.
       * The default is to spawn a default `Marker`:
       * ```js
       * function(geoJsonPoint, latlng) {
       * 	return L.marker(latlng);
       * }
       * ```
       *
       * @option style: Function = *
       * A `Function` defining the `Path options` for styling GeoJSON lines and polygons,
       * called internally when data is added.
       * The default value is to not override any defaults:
       * ```js
       * function (geoJsonFeature) {
       * 	return {}
       * }
       * ```
       *
       * @option onEachFeature: Function = *
       * A `Function` that will be called once for each created `Feature`, after it has
       * been created and styled. Useful for attaching events and popups to features.
       * The default is to do nothing with the newly created layers:
       * ```js
       * function (feature, layer) {}
       * ```
       *
       * @option filter: Function = *
       * A `Function` that will be used to decide whether to include a feature or not.
       * The default is to include all features:
       * ```js
       * function (geoJsonFeature) {
       * 	return true;
       * }
       * ```
       * Note: dynamically changing the `filter` option will have effect only on newly
       * added data. It will _not_ re-evaluate already included features.
       *
       * @option coordsToLatLng: Function = *
       * A `Function` that will be used for converting GeoJSON coordinates to `LatLng`s.
       * The default is the `coordsToLatLng` static method.
       *
       * @option markersInheritOptions: Boolean = false
       * Whether default Markers for "Point" type Features inherit from group options.
       */
      initialize: function(t, e) {
        Y(this, e), this._layers = {}, t && this.addData(t);
      },
      // @method addData( <GeoJSON> data ): this
      // Adds a GeoJSON object to the layer.
      addData: function(t) {
        var e = mt(t) ? t : t.features, i, n, o;
        if (e) {
          for (i = 0, n = e.length; i < n; i++)
            o = e[i], (o.geometries || o.geometry || o.features || o.coordinates) && this.addData(o);
          return this;
        }
        var r = this.options;
        if (r.filter && !r.filter(t))
          return this;
        var l = Vi(t, r);
        return l ? (l.feature = Hi(t), l.defaultOptions = l.options, this.resetStyle(l), r.onEachFeature && r.onEachFeature(t, l), this.addLayer(l)) : this;
      },
      // @method resetStyle( <Path> layer? ): this
      // Resets the given vector layer's style to the original GeoJSON style, useful for resetting style after hover events.
      // If `layer` is omitted, the style of all features in the current layer is reset.
      resetStyle: function(t) {
        return t === void 0 ? this.eachLayer(this.resetStyle, this) : (t.options = G({}, t.defaultOptions), this._setLayerStyle(t, this.options.style), this);
      },
      // @method setStyle( <Function> style ): this
      // Changes styles of GeoJSON vector layers with the given style function.
      setStyle: function(t) {
        return this.eachLayer(function(e) {
          this._setLayerStyle(e, t);
        }, this);
      },
      _setLayerStyle: function(t, e) {
        t.setStyle && (typeof e == "function" && (e = e(t.feature)), t.setStyle(e));
      }
    });
    function Vi(t, e) {
      var i = t.type === "Feature" ? t.geometry : t, n = i ? i.coordinates : null, o = [], r = e && e.pointToLayer, l = e && e.coordsToLatLng || Tn, h, d, f, w;
      if (!n && !i)
        return null;
      switch (i.type) {
        case "Point":
          return h = l(n), Jn(r, t, h, e);
        case "MultiPoint":
          for (f = 0, w = n.length; f < w; f++)
            h = l(n[f]), o.push(Jn(r, t, h, e));
          return new le(o);
        case "LineString":
        case "MultiLineString":
          return d = Ui(n, i.type === "LineString" ? 0 : 1, l), new ue(d, e);
        case "Polygon":
        case "MultiPolygon":
          return d = Ui(n, i.type === "Polygon" ? 1 : 2, l), new ti(d, e);
        case "GeometryCollection":
          for (f = 0, w = i.geometries.length; f < w; f++) {
            var Z = Vi({
              geometry: i.geometries[f],
              type: "Feature",
              properties: t.properties
            }, e);
            Z && o.push(Z);
          }
          return new le(o);
        case "FeatureCollection":
          for (f = 0, w = i.features.length; f < w; f++) {
            var U = Vi(i.features[f], e);
            U && o.push(U);
          }
          return new le(o);
        default:
          throw new Error("Invalid GeoJSON object.");
      }
    }
    function Jn(t, e, i, n) {
      return t ? t(e, i) : new Ri(i, n && n.markersInheritOptions && n);
    }
    function Tn(t) {
      return new X(t[1], t[0], t[2]);
    }
    function Ui(t, e, i) {
      for (var n = [], o = 0, r = t.length, l; o < r; o++)
        l = e ? Ui(t[o], e - 1, i) : (i || Tn)(t[o]), n.push(l);
      return n;
    }
    function kn(t, e) {
      return t = W(t), t.alt !== void 0 ? [_t(t.lng, e), _t(t.lat, e), _t(t.alt, e)] : [_t(t.lng, e), _t(t.lat, e)];
    }
    function Fi(t, e, i, n) {
      for (var o = [], r = 0, l = t.length; r < l; r++)
        o.push(e ? Fi(t[r], Dt(t[r]) ? 0 : e - 1, i, n) : kn(t[r], n));
      return !e && i && o.length > 0 && o.push(o[0].slice()), o;
    }
    function ei(t, e) {
      return t.feature ? G({}, t.feature, { geometry: e }) : Hi(e);
    }
    function Hi(t) {
      return t.type === "Feature" || t.type === "FeatureCollection" ? t : {
        type: "Feature",
        properties: {},
        geometry: t
      };
    }
    var Cn = {
      toGeoJSON: function(t) {
        return ei(this, {
          type: "Point",
          coordinates: kn(this.getLatLng(), t)
        });
      }
    };
    Ri.include(Cn), Pn.include(Cn), Di.include(Cn), ue.include({
      toGeoJSON: function(t) {
        var e = !Dt(this._latlngs), i = Fi(this._latlngs, e ? 1 : 0, !1, t);
        return ei(this, {
          type: (e ? "Multi" : "") + "LineString",
          coordinates: i
        });
      }
    }), ti.include({
      toGeoJSON: function(t) {
        var e = !Dt(this._latlngs), i = e && !Dt(this._latlngs[0]), n = Fi(this._latlngs, i ? 2 : e ? 1 : 0, !0, t);
        return e || (n = [n]), ei(this, {
          type: (i ? "Multi" : "") + "Polygon",
          coordinates: n
        });
      }
    }), Xe.include({
      toMultiPoint: function(t) {
        var e = [];
        return this.eachLayer(function(i) {
          e.push(i.toGeoJSON(t).geometry.coordinates);
        }), ei(this, {
          type: "MultiPoint",
          coordinates: e
        });
      },
      // @method toGeoJSON(precision?: Number|false): Object
      // Coordinates values are rounded with [`formatNum`](#util-formatnum) function with given `precision`.
      // Returns a [`GeoJSON`](https://en.wikipedia.org/wiki/GeoJSON) representation of the layer group (as a GeoJSON `FeatureCollection`, `GeometryCollection`, or `MultiPoint`).
      toGeoJSON: function(t) {
        var e = this.feature && this.feature.geometry && this.feature.geometry.type;
        if (e === "MultiPoint")
          return this.toMultiPoint(t);
        var i = e === "GeometryCollection", n = [];
        return this.eachLayer(function(o) {
          if (o.toGeoJSON) {
            var r = o.toGeoJSON(t);
            if (i)
              n.push(r.geometry);
            else {
              var l = Hi(r);
              l.type === "FeatureCollection" ? n.push.apply(n, l.features) : n.push(l);
            }
          }
        }), i ? ei(this, {
          geometries: n,
          type: "GeometryCollection"
        }) : {
          type: "FeatureCollection",
          features: n
        };
      }
    });
    function Yn(t, e) {
      return new he(t, e);
    }
    var Ko = Yn, Wi = Wt.extend({
      // @section
      // @aka ImageOverlay options
      options: {
        // @option opacity: Number = 1.0
        // The opacity of the image overlay.
        opacity: 1,
        // @option alt: String = ''
        // Text for the `alt` attribute of the image (useful for accessibility).
        alt: "",
        // @option interactive: Boolean = false
        // If `true`, the image overlay will emit [mouse events](#interactive-layer) when clicked or hovered.
        interactive: !1,
        // @option crossOrigin: Boolean|String = false
        // Whether the crossOrigin attribute will be added to the image.
        // If a String is provided, the image will have its crossOrigin attribute set to the String provided. This is needed if you want to access image pixel data.
        // Refer to [CORS Settings](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) for valid String values.
        crossOrigin: !1,
        // @option errorOverlayUrl: String = ''
        // URL to the overlay image to show in place of the overlay that failed to load.
        errorOverlayUrl: "",
        // @option zIndex: Number = 1
        // The explicit [zIndex](https://developer.mozilla.org/docs/Web/CSS/CSS_Positioning/Understanding_z_index) of the overlay layer.
        zIndex: 1,
        // @option className: String = ''
        // A custom class name to assign to the image. Empty by default.
        className: ""
      },
      initialize: function(t, e, i) {
        this._url = t, this._bounds = ct(e), Y(this, i);
      },
      onAdd: function() {
        this._image || (this._initImage(), this.options.opacity < 1 && this._updateOpacity()), this.options.interactive && (y(this._image, "leaflet-interactive"), this.addInteractiveTarget(this._image)), this.getPane().appendChild(this._image), this._reset();
      },
      onRemove: function() {
        V(this._image), this.options.interactive && this.removeInteractiveTarget(this._image);
      },
      // @method setOpacity(opacity: Number): this
      // Sets the opacity of the overlay.
      setOpacity: function(t) {
        return this.options.opacity = t, this._image && this._updateOpacity(), this;
      },
      setStyle: function(t) {
        return t.opacity && this.setOpacity(t.opacity), this;
      },
      // @method bringToFront(): this
      // Brings the layer to the top of all overlays.
      bringToFront: function() {
        return this._map && ae(this._image), this;
      },
      // @method bringToBack(): this
      // Brings the layer to the bottom of all overlays.
      bringToBack: function() {
        return this._map && re(this._image), this;
      },
      // @method setUrl(url: String): this
      // Changes the URL of the image.
      setUrl: function(t) {
        return this._url = t, this._image && (this._image.src = t), this;
      },
      // @method setBounds(bounds: LatLngBounds): this
      // Update the bounds that this ImageOverlay covers
      setBounds: function(t) {
        return this._bounds = ct(t), this._map && this._reset(), this;
      },
      getEvents: function() {
        var t = {
          zoom: this._reset,
          viewreset: this._reset
        };
        return this._zoomAnimated && (t.zoomanim = this._animateZoom), t;
      },
      // @method setZIndex(value: Number): this
      // Changes the [zIndex](#imageoverlay-zindex) of the image overlay.
      setZIndex: function(t) {
        return this.options.zIndex = t, this._updateZIndex(), this;
      },
      // @method getBounds(): LatLngBounds
      // Get the bounds that this ImageOverlay covers
      getBounds: function() {
        return this._bounds;
      },
      // @method getElement(): HTMLElement
      // Returns the instance of [`HTMLImageElement`](https://developer.mozilla.org/docs/Web/API/HTMLImageElement)
      // used by this overlay.
      getElement: function() {
        return this._image;
      },
      _initImage: function() {
        var t = this._url.tagName === "IMG", e = this._image = t ? this._url : b("img");
        if (y(e, "leaflet-image-layer"), this._zoomAnimated && y(e, "leaflet-zoom-animated"), this.options.className && y(e, this.options.className), e.onselectstart = ot, e.onmousemove = ot, e.onload = F(this.fire, this, "load"), e.onerror = F(this._overlayOnError, this, "error"), (this.options.crossOrigin || this.options.crossOrigin === "") && (e.crossOrigin = this.options.crossOrigin === !0 ? "" : this.options.crossOrigin), this.options.zIndex && this._updateZIndex(), t) {
          this._url = e.src;
          return;
        }
        e.src = this._url, e.alt = this.options.alt;
      },
      _animateZoom: function(t) {
        var e = this._map.getZoomScale(t.zoom), i = this._map._latLngBoundsToNewLayerBounds(this._bounds, t.zoom, t.center).min;
        Ae(this._image, i, e);
      },
      _reset: function() {
        var t = this._image, e = new rt(
          this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
          this._map.latLngToLayerPoint(this._bounds.getSouthEast())
        ), i = e.getSize();
        vt(t, e.min), t.style.width = i.x + "px", t.style.height = i.y + "px";
      },
      _updateOpacity: function() {
        $(this._image, this.options.opacity);
      },
      _updateZIndex: function() {
        this._image && this.options.zIndex !== void 0 && this.options.zIndex !== null && (this._image.style.zIndex = this.options.zIndex);
      },
      _overlayOnError: function() {
        this.fire("error");
        var t = this.options.errorOverlayUrl;
        t && this._url !== t && (this._url = t, this._image.src = t);
      },
      // @method getCenter(): LatLng
      // Returns the center of the ImageOverlay.
      getCenter: function() {
        return this._bounds.getCenter();
      }
    }), Jo = function(t, e, i) {
      return new Wi(t, e, i);
    }, Xn = Wi.extend({
      // @section
      // @aka VideoOverlay options
      options: {
        // @option autoplay: Boolean = true
        // Whether the video starts playing automatically when loaded.
        // On some browsers autoplay will only work with `muted: true`
        autoplay: !0,
        // @option loop: Boolean = true
        // Whether the video will loop back to the beginning when played.
        loop: !0,
        // @option keepAspectRatio: Boolean = true
        // Whether the video will save aspect ratio after the projection.
        // Relevant for supported browsers. See [browser compatibility](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit)
        keepAspectRatio: !0,
        // @option muted: Boolean = false
        // Whether the video starts on mute when loaded.
        muted: !1,
        // @option playsInline: Boolean = true
        // Mobile browsers will play the video right where it is instead of open it up in fullscreen mode.
        playsInline: !0
      },
      _initImage: function() {
        var t = this._url.tagName === "VIDEO", e = this._image = t ? this._url : b("video");
        if (y(e, "leaflet-image-layer"), this._zoomAnimated && y(e, "leaflet-zoom-animated"), this.options.className && y(e, this.options.className), e.onselectstart = ot, e.onmousemove = ot, e.onloadeddata = F(this.fire, this, "load"), t) {
          for (var i = e.getElementsByTagName("source"), n = [], o = 0; o < i.length; o++)
            n.push(i[o].src);
          this._url = i.length > 0 ? n : [e.src];
          return;
        }
        mt(this._url) || (this._url = [this._url]), !this.options.keepAspectRatio && Object.prototype.hasOwnProperty.call(e.style, "objectFit") && (e.style.objectFit = "fill"), e.autoplay = !!this.options.autoplay, e.loop = !!this.options.loop, e.muted = !!this.options.muted, e.playsInline = !!this.options.playsInline;
        for (var r = 0; r < this._url.length; r++) {
          var l = b("source");
          l.src = this._url[r], e.appendChild(l);
        }
      }
      // @method getElement(): HTMLVideoElement
      // Returns the instance of [`HTMLVideoElement`](https://developer.mozilla.org/docs/Web/API/HTMLVideoElement)
      // used by this overlay.
    });
    function Yo(t, e, i) {
      return new Xn(t, e, i);
    }
    var Qn = Wi.extend({
      _initImage: function() {
        var t = this._image = this._url;
        y(t, "leaflet-image-layer"), this._zoomAnimated && y(t, "leaflet-zoom-animated"), this.options.className && y(t, this.options.className), t.onselectstart = ot, t.onmousemove = ot;
      }
      // @method getElement(): SVGElement
      // Returns the instance of [`SVGElement`](https://developer.mozilla.org/docs/Web/API/SVGElement)
      // used by this overlay.
    });
    function Xo(t, e, i) {
      return new Qn(t, e, i);
    }
    var Qt = Wt.extend({
      // @section
      // @aka DivOverlay options
      options: {
        // @option interactive: Boolean = false
        // If true, the popup/tooltip will listen to the mouse events.
        interactive: !1,
        // @option offset: Point = Point(0, 0)
        // The offset of the overlay position.
        offset: [0, 0],
        // @option className: String = ''
        // A custom CSS class name to assign to the overlay.
        className: "",
        // @option pane: String = undefined
        // `Map pane` where the overlay will be added.
        pane: void 0,
        // @option content: String|HTMLElement|Function = ''
        // Sets the HTML content of the overlay while initializing. If a function is passed the source layer will be
        // passed to the function. The function should return a `String` or `HTMLElement` to be used in the overlay.
        content: ""
      },
      initialize: function(t, e) {
        t && (t instanceof X || mt(t)) ? (this._latlng = W(t), Y(this, e)) : (Y(this, t), this._source = e), this.options.content && (this._content = this.options.content);
      },
      // @method openOn(map: Map): this
      // Adds the overlay to the map.
      // Alternative to `map.openPopup(popup)`/`.openTooltip(tooltip)`.
      openOn: function(t) {
        return t = arguments.length ? t : this._source._map, t.hasLayer(this) || t.addLayer(this), this;
      },
      // @method close(): this
      // Closes the overlay.
      // Alternative to `map.closePopup(popup)`/`.closeTooltip(tooltip)`
      // and `layer.closePopup()`/`.closeTooltip()`.
      close: function() {
        return this._map && this._map.removeLayer(this), this;
      },
      // @method toggle(layer?: Layer): this
      // Opens or closes the overlay bound to layer depending on its current state.
      // Argument may be omitted only for overlay bound to layer.
      // Alternative to `layer.togglePopup()`/`.toggleTooltip()`.
      toggle: function(t) {
        return this._map ? this.close() : (arguments.length ? this._source = t : t = this._source, this._prepareOpen(), this.openOn(t._map)), this;
      },
      onAdd: function(t) {
        this._zoomAnimated = t._zoomAnimated, this._container || this._initLayout(), t._fadeAnimated && $(this._container, 0), clearTimeout(this._removeTimeout), this.getPane().appendChild(this._container), this.update(), t._fadeAnimated && $(this._container, 1), this.bringToFront(), this.options.interactive && (y(this._container, "leaflet-interactive"), this.addInteractiveTarget(this._container));
      },
      onRemove: function(t) {
        t._fadeAnimated ? ($(this._container, 0), this._removeTimeout = setTimeout(F(V, void 0, this._container), 200)) : V(this._container), this.options.interactive && (A(this._container, "leaflet-interactive"), this.removeInteractiveTarget(this._container));
      },
      // @namespace DivOverlay
      // @method getLatLng: LatLng
      // Returns the geographical point of the overlay.
      getLatLng: function() {
        return this._latlng;
      },
      // @method setLatLng(latlng: LatLng): this
      // Sets the geographical point where the overlay will open.
      setLatLng: function(t) {
        return this._latlng = W(t), this._map && (this._updatePosition(), this._adjustPan()), this;
      },
      // @method getContent: String|HTMLElement
      // Returns the content of the overlay.
      getContent: function() {
        return this._content;
      },
      // @method setContent(htmlContent: String|HTMLElement|Function): this
      // Sets the HTML content of the overlay. If a function is passed the source layer will be passed to the function.
      // The function should return a `String` or `HTMLElement` to be used in the overlay.
      setContent: function(t) {
        return this._content = t, this.update(), this;
      },
      // @method getElement: String|HTMLElement
      // Returns the HTML container of the overlay.
      getElement: function() {
        return this._container;
      },
      // @method update: null
      // Updates the overlay content, layout and position. Useful for updating the overlay after something inside changed, e.g. image loaded.
      update: function() {
        this._map && (this._container.style.visibility = "hidden", this._updateContent(), this._updateLayout(), this._updatePosition(), this._container.style.visibility = "", this._adjustPan());
      },
      getEvents: function() {
        var t = {
          zoom: this._updatePosition,
          viewreset: this._updatePosition
        };
        return this._zoomAnimated && (t.zoomanim = this._animateZoom), t;
      },
      // @method isOpen: Boolean
      // Returns `true` when the overlay is visible on the map.
      isOpen: function() {
        return !!this._map && this._map.hasLayer(this);
      },
      // @method bringToFront: this
      // Brings this overlay in front of other overlays (in the same map pane).
      bringToFront: function() {
        return this._map && ae(this._container), this;
      },
      // @method bringToBack: this
      // Brings this overlay to the back of other overlays (in the same map pane).
      bringToBack: function() {
        return this._map && re(this._container), this;
      },
      // prepare bound overlay to open: update latlng pos / content source (for FeatureGroup)
      _prepareOpen: function(t) {
        var e = this._source;
        if (!e._map)
          return !1;
        if (e instanceof le) {
          e = null;
          var i = this._source._layers;
          for (var n in i)
            if (i[n]._map) {
              e = i[n];
              break;
            }
          if (!e)
            return !1;
          this._source = e;
        }
        if (!t)
          if (e.getCenter)
            t = e.getCenter();
          else if (e.getLatLng)
            t = e.getLatLng();
          else if (e.getBounds)
            t = e.getBounds().getCenter();
          else
            throw new Error("Unable to get source layer LatLng.");
        return this.setLatLng(t), this._map && this.update(), !0;
      },
      _updateContent: function() {
        if (this._content) {
          var t = this._contentNode, e = typeof this._content == "function" ? this._content(this._source || this) : this._content;
          if (typeof e == "string")
            t.innerHTML = e;
          else {
            for (; t.hasChildNodes(); )
              t.removeChild(t.firstChild);
            t.appendChild(e);
          }
          this.fire("contentupdate");
        }
      },
      _updatePosition: function() {
        if (this._map) {
          var t = this._map.latLngToLayerPoint(this._latlng), e = I(this.options.offset), i = this._getAnchor();
          this._zoomAnimated ? vt(this._container, t.add(i)) : e = e.add(t).add(i);
          var n = this._containerBottom = -e.y, o = this._containerLeft = -Math.round(this._containerWidth / 2) + e.x;
          this._container.style.bottom = n + "px", this._container.style.left = o + "px";
        }
      },
      _getAnchor: function() {
        return [0, 0];
      }
    });
    q.include({
      _initOverlay: function(t, e, i, n) {
        var o = e;
        return o instanceof t || (o = new t(n).setContent(e)), i && o.setLatLng(i), o;
      }
    }), Wt.include({
      _initOverlay: function(t, e, i, n) {
        var o = i;
        return o instanceof t ? (Y(o, n), o._source = this) : (o = e && !n ? e : new t(n, this), o.setContent(i)), o;
      }
    });
    var ji = Qt.extend({
      // @section
      // @aka Popup options
      options: {
        // @option pane: String = 'popupPane'
        // `Map pane` where the popup will be added.
        pane: "popupPane",
        // @option offset: Point = Point(0, 7)
        // The offset of the popup position.
        offset: [0, 7],
        // @option maxWidth: Number = 300
        // Max width of the popup, in pixels.
        maxWidth: 300,
        // @option minWidth: Number = 50
        // Min width of the popup, in pixels.
        minWidth: 50,
        // @option maxHeight: Number = null
        // If set, creates a scrollable container of the given height
        // inside a popup if its content exceeds it.
        // The scrollable container can be styled using the
        // `leaflet-popup-scrolled` CSS class selector.
        maxHeight: null,
        // @option autoPan: Boolean = true
        // Set it to `false` if you don't want the map to do panning animation
        // to fit the opened popup.
        autoPan: !0,
        // @option autoPanPaddingTopLeft: Point = null
        // The margin between the popup and the top left corner of the map
        // view after autopanning was performed.
        autoPanPaddingTopLeft: null,
        // @option autoPanPaddingBottomRight: Point = null
        // The margin between the popup and the bottom right corner of the map
        // view after autopanning was performed.
        autoPanPaddingBottomRight: null,
        // @option autoPanPadding: Point = Point(5, 5)
        // Equivalent of setting both top left and bottom right autopan padding to the same value.
        autoPanPadding: [5, 5],
        // @option keepInView: Boolean = false
        // Set it to `true` if you want to prevent users from panning the popup
        // off of the screen while it is open.
        keepInView: !1,
        // @option closeButton: Boolean = true
        // Controls the presence of a close button in the popup.
        closeButton: !0,
        // @option autoClose: Boolean = true
        // Set it to `false` if you want to override the default behavior of
        // the popup closing when another popup is opened.
        autoClose: !0,
        // @option closeOnEscapeKey: Boolean = true
        // Set it to `false` if you want to override the default behavior of
        // the ESC key for closing of the popup.
        closeOnEscapeKey: !0,
        // @option closeOnClick: Boolean = *
        // Set it if you want to override the default behavior of the popup closing when user clicks
        // on the map. Defaults to the map's [`closePopupOnClick`](#map-closepopuponclick) option.
        // @option className: String = ''
        // A custom CSS class name to assign to the popup.
        className: ""
      },
      // @namespace Popup
      // @method openOn(map: Map): this
      // Alternative to `map.openPopup(popup)`.
      // Adds the popup to the map and closes the previous one.
      openOn: function(t) {
        return t = arguments.length ? t : this._source._map, !t.hasLayer(this) && t._popup && t._popup.options.autoClose && t.removeLayer(t._popup), t._popup = this, Qt.prototype.openOn.call(this, t);
      },
      onAdd: function(t) {
        Qt.prototype.onAdd.call(this, t), t.fire("popupopen", { popup: this }), this._source && (this._source.fire("popupopen", { popup: this }, !0), this._source instanceof xe || this._source.on("preclick", Ne));
      },
      onRemove: function(t) {
        Qt.prototype.onRemove.call(this, t), t.fire("popupclose", { popup: this }), this._source && (this._source.fire("popupclose", { popup: this }, !0), this._source instanceof xe || this._source.off("preclick", Ne));
      },
      getEvents: function() {
        var t = Qt.prototype.getEvents.call(this);
        return (this.options.closeOnClick !== void 0 ? this.options.closeOnClick : this._map.options.closePopupOnClick) && (t.preclick = this.close), this.options.keepInView && (t.moveend = this._adjustPan), t;
      },
      _initLayout: function() {
        var t = "leaflet-popup", e = this._container = b(
          "div",
          t + " " + (this.options.className || "") + " leaflet-zoom-animated"
        ), i = this._wrapper = b("div", t + "-content-wrapper", e);
        if (this._contentNode = b("div", t + "-content", i), pi(e), mn(this._contentNode), B(e, "contextmenu", Ne), this._tipContainer = b("div", t + "-tip-container", e), this._tip = b("div", t + "-tip", this._tipContainer), this.options.closeButton) {
          var n = this._closeButton = b("a", t + "-close-button", e);
          n.setAttribute("role", "button"), n.setAttribute("aria-label", "Close popup"), n.href = "#close", n.innerHTML = '<span aria-hidden="true">&#215;</span>', B(n, "click", function(o) {
            Pt(o), this.close();
          }, this);
        }
      },
      _updateLayout: function() {
        var t = this._contentNode, e = t.style;
        e.width = "", e.whiteSpace = "nowrap";
        var i = t.offsetWidth;
        i = Math.min(i, this.options.maxWidth), i = Math.max(i, this.options.minWidth), e.width = i + 1 + "px", e.whiteSpace = "", e.height = "";
        var n = t.offsetHeight, o = this.options.maxHeight, r = "leaflet-popup-scrolled";
        o && n > o ? (e.height = o + "px", y(t, r)) : A(t, r), this._containerWidth = this._container.offsetWidth;
      },
      _animateZoom: function(t) {
        var e = this._map._latLngToNewLayerPoint(this._latlng, t.zoom, t.center), i = this._getAnchor();
        vt(this._container, e.add(i));
      },
      _adjustPan: function() {
        if (this.options.autoPan) {
          if (this._map._panAnim && this._map._panAnim.stop(), this._autopanning) {
            this._autopanning = !1;
            return;
          }
          var t = this._map, e = parseInt(R(this._container, "marginBottom"), 10) || 0, i = this._container.offsetHeight + e, n = this._containerWidth, o = new C(this._containerLeft, -i - this._containerBottom);
          o._add(Be(this._container));
          var r = t.layerPointToContainerPoint(o), l = I(this.options.autoPanPadding), h = I(this.options.autoPanPaddingTopLeft || l), d = I(this.options.autoPanPaddingBottomRight || l), f = t.getSize(), w = 0, Z = 0;
          r.x + n + d.x > f.x && (w = r.x + n - f.x + d.x), r.x - w - h.x < 0 && (w = r.x - h.x), r.y + i + d.y > f.y && (Z = r.y + i - f.y + d.y), r.y - Z - h.y < 0 && (Z = r.y - h.y), (w || Z) && (this.options.keepInView && (this._autopanning = !0), t.fire("autopanstart").panBy([w, Z]));
        }
      },
      _getAnchor: function() {
        return I(this._source && this._source._getPopupAnchor ? this._source._getPopupAnchor() : [0, 0]);
      }
    }), Qo = function(t, e) {
      return new ji(t, e);
    };
    q.mergeOptions({
      closePopupOnClick: !0
    }), q.include({
      // @method openPopup(popup: Popup): this
      // Opens the specified popup while closing the previously opened (to make sure only one is opened at one time for usability).
      // @alternative
      // @method openPopup(content: String|HTMLElement, latlng: LatLng, options?: Popup options): this
      // Creates a popup with the specified content and options and opens it in the given point on a map.
      openPopup: function(t, e, i) {
        return this._initOverlay(ji, t, e, i).openOn(this), this;
      },
      // @method closePopup(popup?: Popup): this
      // Closes the popup previously opened with [openPopup](#map-openpopup) (or the given one).
      closePopup: function(t) {
        return t = arguments.length ? t : this._popup, t && t.close(), this;
      }
    }), Wt.include({
      // @method bindPopup(content: String|HTMLElement|Function|Popup, options?: Popup options): this
      // Binds a popup to the layer with the passed `content` and sets up the
      // necessary event listeners. If a `Function` is passed it will receive
      // the layer as the first argument and should return a `String` or `HTMLElement`.
      bindPopup: function(t, e) {
        return this._popup = this._initOverlay(ji, this._popup, t, e), this._popupHandlersAdded || (this.on({
          click: this._openPopup,
          keypress: this._onKeyPress,
          remove: this.closePopup,
          move: this._movePopup
        }), this._popupHandlersAdded = !0), this;
      },
      // @method unbindPopup(): this
      // Removes the popup previously bound with `bindPopup`.
      unbindPopup: function() {
        return this._popup && (this.off({
          click: this._openPopup,
          keypress: this._onKeyPress,
          remove: this.closePopup,
          move: this._movePopup
        }), this._popupHandlersAdded = !1, this._popup = null), this;
      },
      // @method openPopup(latlng?: LatLng): this
      // Opens the bound popup at the specified `latlng` or at the default popup anchor if no `latlng` is passed.
      openPopup: function(t) {
        return this._popup && (this instanceof le || (this._popup._source = this), this._popup._prepareOpen(t || this._latlng) && this._popup.openOn(this._map)), this;
      },
      // @method closePopup(): this
      // Closes the popup bound to this layer if it is open.
      closePopup: function() {
        return this._popup && this._popup.close(), this;
      },
      // @method togglePopup(): this
      // Opens or closes the popup bound to this layer depending on its current state.
      togglePopup: function() {
        return this._popup && this._popup.toggle(this), this;
      },
      // @method isPopupOpen(): boolean
      // Returns `true` if the popup bound to this layer is currently open.
      isPopupOpen: function() {
        return this._popup ? this._popup.isOpen() : !1;
      },
      // @method setPopupContent(content: String|HTMLElement|Popup): this
      // Sets the content of the popup bound to this layer.
      setPopupContent: function(t) {
        return this._popup && this._popup.setContent(t), this;
      },
      // @method getPopup(): Popup
      // Returns the popup bound to this layer.
      getPopup: function() {
        return this._popup;
      },
      _openPopup: function(t) {
        if (!(!this._popup || !this._map)) {
          Re(t);
          var e = t.layer || t.target;
          if (this._popup._source === e && !(e instanceof xe)) {
            this._map.hasLayer(this._popup) ? this.closePopup() : this.openPopup(t.latlng);
            return;
          }
          this._popup._source = e, this.openPopup(t.latlng);
        }
      },
      _movePopup: function(t) {
        this._popup.setLatLng(t.latlng);
      },
      _onKeyPress: function(t) {
        t.originalEvent.keyCode === 13 && this._openPopup(t);
      }
    });
    var Gi = Qt.extend({
      // @section
      // @aka Tooltip options
      options: {
        // @option pane: String = 'tooltipPane'
        // `Map pane` where the tooltip will be added.
        pane: "tooltipPane",
        // @option offset: Point = Point(0, 0)
        // Optional offset of the tooltip position.
        offset: [0, 0],
        // @option direction: String = 'auto'
        // Direction where to open the tooltip. Possible values are: `right`, `left`,
        // `top`, `bottom`, `center`, `auto`.
        // `auto` will dynamically switch between `right` and `left` according to the tooltip
        // position on the map.
        direction: "auto",
        // @option permanent: Boolean = false
        // Whether to open the tooltip permanently or only on mouseover.
        permanent: !1,
        // @option sticky: Boolean = false
        // If true, the tooltip will follow the mouse instead of being fixed at the feature center.
        sticky: !1,
        // @option opacity: Number = 0.9
        // Tooltip container opacity.
        opacity: 0.9
      },
      onAdd: function(t) {
        Qt.prototype.onAdd.call(this, t), this.setOpacity(this.options.opacity), t.fire("tooltipopen", { tooltip: this }), this._source && (this.addEventParent(this._source), this._source.fire("tooltipopen", { tooltip: this }, !0));
      },
      onRemove: function(t) {
        Qt.prototype.onRemove.call(this, t), t.fire("tooltipclose", { tooltip: this }), this._source && (this.removeEventParent(this._source), this._source.fire("tooltipclose", { tooltip: this }, !0));
      },
      getEvents: function() {
        var t = Qt.prototype.getEvents.call(this);
        return this.options.permanent || (t.preclick = this.close), t;
      },
      _initLayout: function() {
        var t = "leaflet-tooltip", e = t + " " + (this.options.className || "") + " leaflet-zoom-" + (this._zoomAnimated ? "animated" : "hide");
        this._contentNode = this._container = b("div", e), this._container.setAttribute("role", "tooltip"), this._container.setAttribute("id", "leaflet-tooltip-" + N(this));
      },
      _updateLayout: function() {
      },
      _adjustPan: function() {
      },
      _setPosition: function(t) {
        var e, i, n = this._map, o = this._container, r = n.latLngToContainerPoint(n.getCenter()), l = n.layerPointToContainerPoint(t), h = this.options.direction, d = o.offsetWidth, f = o.offsetHeight, w = I(this.options.offset), Z = this._getAnchor();
        h === "top" ? (e = d / 2, i = f) : h === "bottom" ? (e = d / 2, i = 0) : h === "center" ? (e = d / 2, i = f / 2) : h === "right" ? (e = 0, i = f / 2) : h === "left" ? (e = d, i = f / 2) : l.x < r.x ? (h = "right", e = 0, i = f / 2) : (h = "left", e = d + (w.x + Z.x) * 2, i = f / 2), t = t.subtract(I(e, i, !0)).add(w).add(Z), A(o, "leaflet-tooltip-right"), A(o, "leaflet-tooltip-left"), A(o, "leaflet-tooltip-top"), A(o, "leaflet-tooltip-bottom"), y(o, "leaflet-tooltip-" + h), vt(o, t);
      },
      _updatePosition: function() {
        var t = this._map.latLngToLayerPoint(this._latlng);
        this._setPosition(t);
      },
      setOpacity: function(t) {
        this.options.opacity = t, this._container && $(this._container, t);
      },
      _animateZoom: function(t) {
        var e = this._map._latLngToNewLayerPoint(this._latlng, t.zoom, t.center);
        this._setPosition(e);
      },
      _getAnchor: function() {
        return I(this._source && this._source._getTooltipAnchor && !this.options.sticky ? this._source._getTooltipAnchor() : [0, 0]);
      }
    }), ts = function(t, e) {
      return new Gi(t, e);
    };
    q.include({
      // @method openTooltip(tooltip: Tooltip): this
      // Opens the specified tooltip.
      // @alternative
      // @method openTooltip(content: String|HTMLElement, latlng: LatLng, options?: Tooltip options): this
      // Creates a tooltip with the specified content and options and open it.
      openTooltip: function(t, e, i) {
        return this._initOverlay(Gi, t, e, i).openOn(this), this;
      },
      // @method closeTooltip(tooltip: Tooltip): this
      // Closes the tooltip given as parameter.
      closeTooltip: function(t) {
        return t.close(), this;
      }
    }), Wt.include({
      // @method bindTooltip(content: String|HTMLElement|Function|Tooltip, options?: Tooltip options): this
      // Binds a tooltip to the layer with the passed `content` and sets up the
      // necessary event listeners. If a `Function` is passed it will receive
      // the layer as the first argument and should return a `String` or `HTMLElement`.
      bindTooltip: function(t, e) {
        return this._tooltip && this.isTooltipOpen() && this.unbindTooltip(), this._tooltip = this._initOverlay(Gi, this._tooltip, t, e), this._initTooltipInteractions(), this._tooltip.options.permanent && this._map && this._map.hasLayer(this) && this.openTooltip(), this;
      },
      // @method unbindTooltip(): this
      // Removes the tooltip previously bound with `bindTooltip`.
      unbindTooltip: function() {
        return this._tooltip && (this._initTooltipInteractions(!0), this.closeTooltip(), this._tooltip = null), this;
      },
      _initTooltipInteractions: function(t) {
        if (!(!t && this._tooltipHandlersAdded)) {
          var e = t ? "off" : "on", i = {
            remove: this.closeTooltip,
            move: this._moveTooltip
          };
          this._tooltip.options.permanent ? i.add = this._openTooltip : (i.mouseover = this._openTooltip, i.mouseout = this.closeTooltip, i.click = this._openTooltip, this._map ? this._addFocusListeners() : i.add = this._addFocusListeners), this._tooltip.options.sticky && (i.mousemove = this._moveTooltip), this[e](i), this._tooltipHandlersAdded = !t;
        }
      },
      // @method openTooltip(latlng?: LatLng): this
      // Opens the bound tooltip at the specified `latlng` or at the default tooltip anchor if no `latlng` is passed.
      openTooltip: function(t) {
        return this._tooltip && (this instanceof le || (this._tooltip._source = this), this._tooltip._prepareOpen(t) && (this._tooltip.openOn(this._map), this.getElement ? this._setAriaDescribedByOnLayer(this) : this.eachLayer && this.eachLayer(this._setAriaDescribedByOnLayer, this))), this;
      },
      // @method closeTooltip(): this
      // Closes the tooltip bound to this layer if it is open.
      closeTooltip: function() {
        if (this._tooltip)
          return this._tooltip.close();
      },
      // @method toggleTooltip(): this
      // Opens or closes the tooltip bound to this layer depending on its current state.
      toggleTooltip: function() {
        return this._tooltip && this._tooltip.toggle(this), this;
      },
      // @method isTooltipOpen(): boolean
      // Returns `true` if the tooltip bound to this layer is currently open.
      isTooltipOpen: function() {
        return this._tooltip.isOpen();
      },
      // @method setTooltipContent(content: String|HTMLElement|Tooltip): this
      // Sets the content of the tooltip bound to this layer.
      setTooltipContent: function(t) {
        return this._tooltip && this._tooltip.setContent(t), this;
      },
      // @method getTooltip(): Tooltip
      // Returns the tooltip bound to this layer.
      getTooltip: function() {
        return this._tooltip;
      },
      _addFocusListeners: function() {
        this.getElement ? this._addFocusListenersOnLayer(this) : this.eachLayer && this.eachLayer(this._addFocusListenersOnLayer, this);
      },
      _addFocusListenersOnLayer: function(t) {
        var e = typeof t.getElement == "function" && t.getElement();
        e && (B(e, "focus", function() {
          this._tooltip._source = t, this.openTooltip();
        }, this), B(e, "blur", this.closeTooltip, this));
      },
      _setAriaDescribedByOnLayer: function(t) {
        var e = typeof t.getElement == "function" && t.getElement();
        e && e.setAttribute("aria-describedby", this._tooltip._container.id);
      },
      _openTooltip: function(t) {
        if (!(!this._tooltip || !this._map)) {
          if (this._map.dragging && this._map.dragging.moving() && !this._openOnceFlag) {
            this._openOnceFlag = !0;
            var e = this;
            this._map.once("moveend", function() {
              e._openOnceFlag = !1, e._openTooltip(t);
            });
            return;
          }
          this._tooltip._source = t.layer || t.target, this.openTooltip(this._tooltip.options.sticky ? t.latlng : void 0);
        }
      },
      _moveTooltip: function(t) {
        var e = t.latlng, i, n;
        this._tooltip.options.sticky && t.originalEvent && (i = this._map.mouseEventToContainerPoint(t.originalEvent), n = this._map.containerPointToLayerPoint(i), e = this._map.layerPointToLatLng(n)), this._tooltip.setLatLng(e);
      }
    });
    var to = Qe.extend({
      options: {
        // @section
        // @aka DivIcon options
        iconSize: [12, 12],
        // also can be set through CSS
        // iconAnchor: (Point),
        // popupAnchor: (Point),
        // @option html: String|HTMLElement = ''
        // Custom HTML code to put inside the div element, empty by default. Alternatively,
        // an instance of `HTMLElement`.
        html: !1,
        // @option bgPos: Point = [0, 0]
        // Optional relative position of the background, in pixels
        bgPos: null,
        className: "leaflet-div-icon"
      },
      createIcon: function(t) {
        var e = t && t.tagName === "DIV" ? t : document.createElement("div"), i = this.options;
        if (i.html instanceof Element ? (Ie(e), e.appendChild(i.html)) : e.innerHTML = i.html !== !1 ? i.html : "", i.bgPos) {
          var n = I(i.bgPos);
          e.style.backgroundPosition = -n.x + "px " + -n.y + "px";
        }
        return this._setIconStyles(e, "icon"), e;
      },
      createShadow: function() {
        return null;
      }
    });
    function es(t) {
      return new to(t);
    }
    Qe.Default = gi;
    var yi = Wt.extend({
      // @section
      // @aka GridLayer options
      options: {
        // @option tileSize: Number|Point = 256
        // Width and height of tiles in the grid. Use a number if width and height are equal, or `L.point(width, height)` otherwise.
        tileSize: 256,
        // @option opacity: Number = 1.0
        // Opacity of the tiles. Can be used in the `createTile()` function.
        opacity: 1,
        // @option updateWhenIdle: Boolean = (depends)
        // Load new tiles only when panning ends.
        // `true` by default on mobile browsers, in order to avoid too many requests and keep smooth navigation.
        // `false` otherwise in order to display new tiles _during_ panning, since it is easy to pan outside the
        // [`keepBuffer`](#gridlayer-keepbuffer) option in desktop browsers.
        updateWhenIdle: P.mobile,
        // @option updateWhenZooming: Boolean = true
        // By default, a smooth zoom animation (during a [touch zoom](#map-touchzoom) or a [`flyTo()`](#map-flyto)) will update grid layers every integer zoom level. Setting this option to `false` will update the grid layer only when the smooth animation ends.
        updateWhenZooming: !0,
        // @option updateInterval: Number = 200
        // Tiles will not update more than once every `updateInterval` milliseconds when panning.
        updateInterval: 200,
        // @option zIndex: Number = 1
        // The explicit zIndex of the tile layer.
        zIndex: 1,
        // @option bounds: LatLngBounds = undefined
        // If set, tiles will only be loaded inside the set `LatLngBounds`.
        bounds: null,
        // @option minZoom: Number = 0
        // The minimum zoom level down to which this layer will be displayed (inclusive).
        minZoom: 0,
        // @option maxZoom: Number = undefined
        // The maximum zoom level up to which this layer will be displayed (inclusive).
        maxZoom: void 0,
        // @option maxNativeZoom: Number = undefined
        // Maximum zoom number the tile source has available. If it is specified,
        // the tiles on all zoom levels higher than `maxNativeZoom` will be loaded
        // from `maxNativeZoom` level and auto-scaled.
        maxNativeZoom: void 0,
        // @option minNativeZoom: Number = undefined
        // Minimum zoom number the tile source has available. If it is specified,
        // the tiles on all zoom levels lower than `minNativeZoom` will be loaded
        // from `minNativeZoom` level and auto-scaled.
        minNativeZoom: void 0,
        // @option noWrap: Boolean = false
        // Whether the layer is wrapped around the antimeridian. If `true`, the
        // GridLayer will only be displayed once at low zoom levels. Has no
        // effect when the [map CRS](#map-crs) doesn't wrap around. Can be used
        // in combination with [`bounds`](#gridlayer-bounds) to prevent requesting
        // tiles outside the CRS limits.
        noWrap: !1,
        // @option pane: String = 'tilePane'
        // `Map pane` where the grid layer will be added.
        pane: "tilePane",
        // @option className: String = ''
        // A custom class name to assign to the tile layer. Empty by default.
        className: "",
        // @option keepBuffer: Number = 2
        // When panning the map, keep this many rows and columns of tiles before unloading them.
        keepBuffer: 2
      },
      initialize: function(t) {
        Y(this, t);
      },
      onAdd: function() {
        this._initContainer(), this._levels = {}, this._tiles = {}, this._resetView();
      },
      beforeAdd: function(t) {
        t._addZoomLimit(this);
      },
      onRemove: function(t) {
        this._removeAllTiles(), V(this._container), t._removeZoomLimit(this), this._container = null, this._tileZoom = void 0;
      },
      // @method bringToFront: this
      // Brings the tile layer to the top of all tile layers.
      bringToFront: function() {
        return this._map && (ae(this._container), this._setAutoZIndex(Math.max)), this;
      },
      // @method bringToBack: this
      // Brings the tile layer to the bottom of all tile layers.
      bringToBack: function() {
        return this._map && (re(this._container), this._setAutoZIndex(Math.min)), this;
      },
      // @method getContainer: HTMLElement
      // Returns the HTML element that contains the tiles for this layer.
      getContainer: function() {
        return this._container;
      },
      // @method setOpacity(opacity: Number): this
      // Changes the [opacity](#gridlayer-opacity) of the grid layer.
      setOpacity: function(t) {
        return this.options.opacity = t, this._updateOpacity(), this;
      },
      // @method setZIndex(zIndex: Number): this
      // Changes the [zIndex](#gridlayer-zindex) of the grid layer.
      setZIndex: function(t) {
        return this.options.zIndex = t, this._updateZIndex(), this;
      },
      // @method isLoading: Boolean
      // Returns `true` if any tile in the grid layer has not finished loading.
      isLoading: function() {
        return this._loading;
      },
      // @method redraw: this
      // Causes the layer to clear all the tiles and request them again.
      redraw: function() {
        if (this._map) {
          this._removeAllTiles();
          var t = this._clampZoom(this._map.getZoom());
          t !== this._tileZoom && (this._tileZoom = t, this._updateLevels()), this._update();
        }
        return this;
      },
      getEvents: function() {
        var t = {
          viewprereset: this._invalidateAll,
          viewreset: this._resetView,
          zoom: this._resetView,
          moveend: this._onMoveEnd
        };
        return this.options.updateWhenIdle || (this._onMove || (this._onMove = tt(this._onMoveEnd, this.options.updateInterval, this)), t.move = this._onMove), this._zoomAnimated && (t.zoomanim = this._animateZoom), t;
      },
      // @section Extension methods
      // Layers extending `GridLayer` shall reimplement the following method.
      // @method createTile(coords: Object, done?: Function): HTMLElement
      // Called only internally, must be overridden by classes extending `GridLayer`.
      // Returns the `HTMLElement` corresponding to the given `coords`. If the `done` callback
      // is specified, it must be called when the tile has finished loading and drawing.
      createTile: function() {
        return document.createElement("div");
      },
      // @section
      // @method getTileSize: Point
      // Normalizes the [tileSize option](#gridlayer-tilesize) into a point. Used by the `createTile()` method.
      getTileSize: function() {
        var t = this.options.tileSize;
        return t instanceof C ? t : new C(t, t);
      },
      _updateZIndex: function() {
        this._container && this.options.zIndex !== void 0 && this.options.zIndex !== null && (this._container.style.zIndex = this.options.zIndex);
      },
      _setAutoZIndex: function(t) {
        for (var e = this.getPane().children, i = -t(-1 / 0, 1 / 0), n = 0, o = e.length, r; n < o; n++)
          r = e[n].style.zIndex, e[n] !== this._container && r && (i = t(i, +r));
        isFinite(i) && (this.options.zIndex = i + t(-1, 1), this._updateZIndex());
      },
      _updateOpacity: function() {
        if (this._map && !P.ielt9) {
          $(this._container, this.options.opacity);
          var t = +/* @__PURE__ */ new Date(), e = !1, i = !1;
          for (var n in this._tiles) {
            var o = this._tiles[n];
            if (!(!o.current || !o.loaded)) {
              var r = Math.min(1, (t - o.loaded) / 200);
              $(o.el, r), r < 1 ? e = !0 : (o.active ? i = !0 : this._onOpaqueTile(o), o.active = !0);
            }
          }
          i && !this._noPrune && this._pruneTiles(), e && (H(this._fadeFrame), this._fadeFrame = z(this._updateOpacity, this));
        }
      },
      _onOpaqueTile: ot,
      _initContainer: function() {
        this._container || (this._container = b("div", "leaflet-layer " + (this.options.className || "")), this._updateZIndex(), this.options.opacity < 1 && this._updateOpacity(), this.getPane().appendChild(this._container));
      },
      _updateLevels: function() {
        var t = this._tileZoom, e = this.options.maxZoom;
        if (t !== void 0) {
          for (var i in this._levels)
            i = Number(i), this._levels[i].el.children.length || i === t ? (this._levels[i].el.style.zIndex = e - Math.abs(t - i), this._onUpdateLevel(i)) : (V(this._levels[i].el), this._removeTilesAtZoom(i), this._onRemoveLevel(i), delete this._levels[i]);
          var n = this._levels[t], o = this._map;
          return n || (n = this._levels[t] = {}, n.el = b("div", "leaflet-tile-container leaflet-zoom-animated", this._container), n.el.style.zIndex = e, n.origin = o.project(o.unproject(o.getPixelOrigin()), t).round(), n.zoom = t, this._setZoomTransform(n, o.getCenter(), o.getZoom()), ot(n.el.offsetWidth), this._onCreateLevel(n)), this._level = n, n;
        }
      },
      _onUpdateLevel: ot,
      _onRemoveLevel: ot,
      _onCreateLevel: ot,
      _pruneTiles: function() {
        if (this._map) {
          var t, e, i = this._map.getZoom();
          if (i > this.options.maxZoom || i < this.options.minZoom) {
            this._removeAllTiles();
            return;
          }
          for (t in this._tiles)
            e = this._tiles[t], e.retain = e.current;
          for (t in this._tiles)
            if (e = this._tiles[t], e.current && !e.active) {
              var n = e.coords;
              this._retainParent(n.x, n.y, n.z, n.z - 5) || this._retainChildren(n.x, n.y, n.z, n.z + 2);
            }
          for (t in this._tiles)
            this._tiles[t].retain || this._removeTile(t);
        }
      },
      _removeTilesAtZoom: function(t) {
        for (var e in this._tiles)
          this._tiles[e].coords.z === t && this._removeTile(e);
      },
      _removeAllTiles: function() {
        for (var t in this._tiles)
          this._removeTile(t);
      },
      _invalidateAll: function() {
        for (var t in this._levels)
          V(this._levels[t].el), this._onRemoveLevel(Number(t)), delete this._levels[t];
        this._removeAllTiles(), this._tileZoom = void 0;
      },
      _retainParent: function(t, e, i, n) {
        var o = Math.floor(t / 2), r = Math.floor(e / 2), l = i - 1, h = new C(+o, +r);
        h.z = +l;
        var d = this._tileCoordsToKey(h), f = this._tiles[d];
        return f && f.active ? (f.retain = !0, !0) : (f && f.loaded && (f.retain = !0), l > n ? this._retainParent(o, r, l, n) : !1);
      },
      _retainChildren: function(t, e, i, n) {
        for (var o = 2 * t; o < 2 * t + 2; o++)
          for (var r = 2 * e; r < 2 * e + 2; r++) {
            var l = new C(o, r);
            l.z = i + 1;
            var h = this._tileCoordsToKey(l), d = this._tiles[h];
            if (d && d.active) {
              d.retain = !0;
              continue;
            } else d && d.loaded && (d.retain = !0);
            i + 1 < n && this._retainChildren(o, r, i + 1, n);
          }
      },
      _resetView: function(t) {
        var e = t && (t.pinch || t.flyTo);
        this._setView(this._map.getCenter(), this._map.getZoom(), e, e);
      },
      _animateZoom: function(t) {
        this._setView(t.center, t.zoom, !0, t.noUpdate);
      },
      _clampZoom: function(t) {
        var e = this.options;
        return e.minNativeZoom !== void 0 && t < e.minNativeZoom ? e.minNativeZoom : e.maxNativeZoom !== void 0 && e.maxNativeZoom < t ? e.maxNativeZoom : t;
      },
      _setView: function(t, e, i, n) {
        var o = Math.round(e);
        this.options.maxZoom !== void 0 && o > this.options.maxZoom || this.options.minZoom !== void 0 && o < this.options.minZoom ? o = void 0 : o = this._clampZoom(o);
        var r = this.options.updateWhenZooming && o !== this._tileZoom;
        (!n || r) && (this._tileZoom = o, this._abortLoading && this._abortLoading(), this._updateLevels(), this._resetGrid(), o !== void 0 && this._update(t), i || this._pruneTiles(), this._noPrune = !!i), this._setZoomTransforms(t, e);
      },
      _setZoomTransforms: function(t, e) {
        for (var i in this._levels)
          this._setZoomTransform(this._levels[i], t, e);
      },
      _setZoomTransform: function(t, e, i) {
        var n = this._map.getZoomScale(i, t.zoom), o = t.origin.multiplyBy(n).subtract(this._map._getNewPixelOrigin(e, i)).round();
        P.any3d ? Ae(t.el, o, n) : vt(t.el, o);
      },
      _resetGrid: function() {
        var t = this._map, e = t.options.crs, i = this._tileSize = this.getTileSize(), n = this._tileZoom, o = this._map.getPixelWorldBounds(this._tileZoom);
        o && (this._globalTileRange = this._pxBoundsToTileRange(o)), this._wrapX = e.wrapLng && !this.options.noWrap && [
          Math.floor(t.project([0, e.wrapLng[0]], n).x / i.x),
          Math.ceil(t.project([0, e.wrapLng[1]], n).x / i.y)
        ], this._wrapY = e.wrapLat && !this.options.noWrap && [
          Math.floor(t.project([e.wrapLat[0], 0], n).y / i.x),
          Math.ceil(t.project([e.wrapLat[1], 0], n).y / i.y)
        ];
      },
      _onMoveEnd: function() {
        !this._map || this._map._animatingZoom || this._update();
      },
      _getTiledPixelBounds: function(t) {
        var e = this._map, i = e._animatingZoom ? Math.max(e._animateToZoom, e.getZoom()) : e.getZoom(), n = e.getZoomScale(i, this._tileZoom), o = e.project(t, this._tileZoom).floor(), r = e.getSize().divideBy(n * 2);
        return new rt(o.subtract(r), o.add(r));
      },
      // Private method to load tiles in the grid's active zoom level according to map bounds
      _update: function(t) {
        var e = this._map;
        if (e) {
          var i = this._clampZoom(e.getZoom());
          if (t === void 0 && (t = e.getCenter()), this._tileZoom !== void 0) {
            var n = this._getTiledPixelBounds(t), o = this._pxBoundsToTileRange(n), r = o.getCenter(), l = [], h = this.options.keepBuffer, d = new rt(
              o.getBottomLeft().subtract([h, -h]),
              o.getTopRight().add([h, -h])
            );
            if (!(isFinite(o.min.x) && isFinite(o.min.y) && isFinite(o.max.x) && isFinite(o.max.y)))
              throw new Error("Attempted to load an infinite number of tiles");
            for (var f in this._tiles) {
              var w = this._tiles[f].coords;
              (w.z !== this._tileZoom || !d.contains(new C(w.x, w.y))) && (this._tiles[f].current = !1);
            }
            if (Math.abs(i - this._tileZoom) > 1) {
              this._setView(t, i);
              return;
            }
            for (var Z = o.min.y; Z <= o.max.y; Z++)
              for (var U = o.min.x; U <= o.max.x; U++) {
                var zt = new C(U, Z);
                if (zt.z = this._tileZoom, !!this._isValidTile(zt)) {
                  var xt = this._tiles[this._tileCoordsToKey(zt)];
                  xt ? xt.current = !0 : l.push(zt);
                }
              }
            if (l.sort(function(Ot, ni) {
              return Ot.distanceTo(r) - ni.distanceTo(r);
            }), l.length !== 0) {
              this._loading || (this._loading = !0, this.fire("loading"));
              var Vt = document.createDocumentFragment();
              for (U = 0; U < l.length; U++)
                this._addTile(l[U], Vt);
              this._level.el.appendChild(Vt);
            }
          }
        }
      },
      _isValidTile: function(t) {
        var e = this._map.options.crs;
        if (!e.infinite) {
          var i = this._globalTileRange;
          if (!e.wrapLng && (t.x < i.min.x || t.x > i.max.x) || !e.wrapLat && (t.y < i.min.y || t.y > i.max.y))
            return !1;
        }
        if (!this.options.bounds)
          return !0;
        var n = this._tileCoordsToBounds(t);
        return ct(this.options.bounds).overlaps(n);
      },
      _keyToBounds: function(t) {
        return this._tileCoordsToBounds(this._keyToTileCoords(t));
      },
      _tileCoordsToNwSe: function(t) {
        var e = this._map, i = this.getTileSize(), n = t.scaleBy(i), o = n.add(i), r = e.unproject(n, t.z), l = e.unproject(o, t.z);
        return [r, l];
      },
      // converts tile coordinates to its geographical bounds
      _tileCoordsToBounds: function(t) {
        var e = this._tileCoordsToNwSe(t), i = new Lt(e[0], e[1]);
        return this.options.noWrap || (i = this._map.wrapLatLngBounds(i)), i;
      },
      // converts tile coordinates to key for the tile cache
      _tileCoordsToKey: function(t) {
        return t.x + ":" + t.y + ":" + t.z;
      },
      // converts tile cache key to coordinates
      _keyToTileCoords: function(t) {
        var e = t.split(":"), i = new C(+e[0], +e[1]);
        return i.z = +e[2], i;
      },
      _removeTile: function(t) {
        var e = this._tiles[t];
        e && (V(e.el), delete this._tiles[t], this.fire("tileunload", {
          tile: e.el,
          coords: this._keyToTileCoords(t)
        }));
      },
      _initTile: function(t) {
        y(t, "leaflet-tile");
        var e = this.getTileSize();
        t.style.width = e.x + "px", t.style.height = e.y + "px", t.onselectstart = ot, t.onmousemove = ot, P.ielt9 && this.options.opacity < 1 && $(t, this.options.opacity);
      },
      _addTile: function(t, e) {
        var i = this._getTilePos(t), n = this._tileCoordsToKey(t), o = this.createTile(this._wrapCoords(t), F(this._tileReady, this, t));
        this._initTile(o), this.createTile.length < 2 && z(F(this._tileReady, this, t, null, o)), vt(o, i), this._tiles[n] = {
          el: o,
          coords: t,
          current: !0
        }, e.appendChild(o), this.fire("tileloadstart", {
          tile: o,
          coords: t
        });
      },
      _tileReady: function(t, e, i) {
        e && this.fire("tileerror", {
          error: e,
          tile: i,
          coords: t
        });
        var n = this._tileCoordsToKey(t);
        i = this._tiles[n], i && (i.loaded = +/* @__PURE__ */ new Date(), this._map._fadeAnimated ? ($(i.el, 0), H(this._fadeFrame), this._fadeFrame = z(this._updateOpacity, this)) : (i.active = !0, this._pruneTiles()), e || (y(i.el, "leaflet-tile-loaded"), this.fire("tileload", {
          tile: i.el,
          coords: t
        })), this._noTilesToLoad() && (this._loading = !1, this.fire("load"), P.ielt9 || !this._map._fadeAnimated ? z(this._pruneTiles, this) : setTimeout(F(this._pruneTiles, this), 250)));
      },
      _getTilePos: function(t) {
        return t.scaleBy(this.getTileSize()).subtract(this._level.origin);
      },
      _wrapCoords: function(t) {
        var e = new C(
          this._wrapX ? ut(t.x, this._wrapX) : t.x,
          this._wrapY ? ut(t.y, this._wrapY) : t.y
        );
        return e.z = t.z, e;
      },
      _pxBoundsToTileRange: function(t) {
        var e = this.getTileSize();
        return new rt(
          t.min.unscaleBy(e).floor(),
          t.max.unscaleBy(e).ceil().subtract([1, 1])
        );
      },
      _noTilesToLoad: function() {
        for (var t in this._tiles)
          if (!this._tiles[t].loaded)
            return !1;
        return !0;
      }
    });
    function is(t) {
      return new yi(t);
    }
    var ii = yi.extend({
      // @section
      // @aka TileLayer options
      options: {
        // @option minZoom: Number = 0
        // The minimum zoom level down to which this layer will be displayed (inclusive).
        minZoom: 0,
        // @option maxZoom: Number = 18
        // The maximum zoom level up to which this layer will be displayed (inclusive).
        maxZoom: 18,
        // @option subdomains: String|String[] = 'abc'
        // Subdomains of the tile service. Can be passed in the form of one string (where each letter is a subdomain name) or an array of strings.
        subdomains: "abc",
        // @option errorTileUrl: String = ''
        // URL to the tile image to show in place of the tile that failed to load.
        errorTileUrl: "",
        // @option zoomOffset: Number = 0
        // The zoom number used in tile URLs will be offset with this value.
        zoomOffset: 0,
        // @option tms: Boolean = false
        // If `true`, inverses Y axis numbering for tiles (turn this on for [TMS](https://en.wikipedia.org/wiki/Tile_Map_Service) services).
        tms: !1,
        // @option zoomReverse: Boolean = false
        // If set to true, the zoom number used in tile URLs will be reversed (`maxZoom - zoom` instead of `zoom`)
        zoomReverse: !1,
        // @option detectRetina: Boolean = false
        // If `true` and user is on a retina display, it will request four tiles of half the specified size and a bigger zoom level in place of one to utilize the high resolution.
        detectRetina: !1,
        // @option crossOrigin: Boolean|String = false
        // Whether the crossOrigin attribute will be added to the tiles.
        // If a String is provided, all tiles will have their crossOrigin attribute set to the String provided. This is needed if you want to access tile pixel data.
        // Refer to [CORS Settings](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) for valid String values.
        crossOrigin: !1,
        // @option referrerPolicy: Boolean|String = false
        // Whether the referrerPolicy attribute will be added to the tiles.
        // If a String is provided, all tiles will have their referrerPolicy attribute set to the String provided.
        // This may be needed if your map's rendering context has a strict default but your tile provider expects a valid referrer
        // (e.g. to validate an API token).
        // Refer to [HTMLImageElement.referrerPolicy](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/referrerPolicy) for valid String values.
        referrerPolicy: !1
      },
      initialize: function(t, e) {
        this._url = t, e = Y(this, e), e.detectRetina && P.retina && e.maxZoom > 0 ? (e.tileSize = Math.floor(e.tileSize / 2), e.zoomReverse ? (e.zoomOffset--, e.minZoom = Math.min(e.maxZoom, e.minZoom + 1)) : (e.zoomOffset++, e.maxZoom = Math.max(e.minZoom, e.maxZoom - 1)), e.minZoom = Math.max(0, e.minZoom)) : e.zoomReverse ? e.minZoom = Math.min(e.maxZoom, e.minZoom) : e.maxZoom = Math.max(e.minZoom, e.maxZoom), typeof e.subdomains == "string" && (e.subdomains = e.subdomains.split("")), this.on("tileunload", this._onTileRemove);
      },
      // @method setUrl(url: String, noRedraw?: Boolean): this
      // Updates the layer's URL template and redraws it (unless `noRedraw` is set to `true`).
      // If the URL does not change, the layer will not be redrawn unless
      // the noRedraw parameter is set to false.
      setUrl: function(t, e) {
        return this._url === t && e === void 0 && (e = !0), this._url = t, e || this.redraw(), this;
      },
      // @method createTile(coords: Object, done?: Function): HTMLElement
      // Called only internally, overrides GridLayer's [`createTile()`](#gridlayer-createtile)
      // to return an `<img>` HTML element with the appropriate image URL given `coords`. The `done`
      // callback is called when the tile has been loaded.
      createTile: function(t, e) {
        var i = document.createElement("img");
        return B(i, "load", F(this._tileOnLoad, this, e, i)), B(i, "error", F(this._tileOnError, this, e, i)), (this.options.crossOrigin || this.options.crossOrigin === "") && (i.crossOrigin = this.options.crossOrigin === !0 ? "" : this.options.crossOrigin), typeof this.options.referrerPolicy == "string" && (i.referrerPolicy = this.options.referrerPolicy), i.alt = "", i.src = this.getTileUrl(t), i;
      },
      // @section Extension methods
      // @uninheritable
      // Layers extending `TileLayer` might reimplement the following method.
      // @method getTileUrl(coords: Object): String
      // Called only internally, returns the URL for a tile given its coordinates.
      // Classes extending `TileLayer` can override this function to provide custom tile URL naming schemes.
      getTileUrl: function(t) {
        var e = {
          r: P.retina ? "@2x" : "",
          s: this._getSubdomain(t),
          x: t.x,
          y: t.y,
          z: this._getZoomForUrl()
        };
        if (this._map && !this._map.options.crs.infinite) {
          var i = this._globalTileRange.max.y - t.y;
          this.options.tms && (e.y = i), e["-y"] = i;
        }
        return $t(this._url, G(e, this.options));
      },
      _tileOnLoad: function(t, e) {
        P.ielt9 ? setTimeout(F(t, this, null, e), 0) : t(null, e);
      },
      _tileOnError: function(t, e, i) {
        var n = this.options.errorTileUrl;
        n && e.getAttribute("src") !== n && (e.src = n), t(i, e);
      },
      _onTileRemove: function(t) {
        t.tile.onload = null;
      },
      _getZoomForUrl: function() {
        var t = this._tileZoom, e = this.options.maxZoom, i = this.options.zoomReverse, n = this.options.zoomOffset;
        return i && (t = e - t), t + n;
      },
      _getSubdomain: function(t) {
        var e = Math.abs(t.x + t.y) % this.options.subdomains.length;
        return this.options.subdomains[e];
      },
      // stops loading all tiles in the background layer
      _abortLoading: function() {
        var t, e;
        for (t in this._tiles)
          if (this._tiles[t].coords.z !== this._tileZoom && (e = this._tiles[t].el, e.onload = ot, e.onerror = ot, !e.complete)) {
            e.src = Kt;
            var i = this._tiles[t].coords;
            V(e), delete this._tiles[t], this.fire("tileabort", {
              tile: e,
              coords: i
            });
          }
      },
      _removeTile: function(t) {
        var e = this._tiles[t];
        if (e)
          return e.el.setAttribute("src", Kt), yi.prototype._removeTile.call(this, t);
      },
      _tileReady: function(t, e, i) {
        if (!(!this._map || i && i.getAttribute("src") === Kt))
          return yi.prototype._tileReady.call(this, t, e, i);
      }
    });
    function eo(t, e) {
      return new ii(t, e);
    }
    var io = ii.extend({
      // @section
      // @aka TileLayer.WMS options
      // If any custom options not documented here are used, they will be sent to the
      // WMS server as extra parameters in each request URL. This can be useful for
      // [non-standard vendor WMS parameters](https://docs.geoserver.org/stable/en/user/services/wms/vendor.html).
      defaultWmsParams: {
        service: "WMS",
        request: "GetMap",
        // @option layers: String = ''
        // **(required)** Comma-separated list of WMS layers to show.
        layers: "",
        // @option styles: String = ''
        // Comma-separated list of WMS styles.
        styles: "",
        // @option format: String = 'image/jpeg'
        // WMS image format (use `'image/png'` for layers with transparency).
        format: "image/jpeg",
        // @option transparent: Boolean = false
        // If `true`, the WMS service will return images with transparency.
        transparent: !1,
        // @option version: String = '1.1.1'
        // Version of the WMS service to use
        version: "1.1.1"
      },
      options: {
        // @option crs: CRS = null
        // Coordinate Reference System to use for the WMS requests, defaults to
        // map CRS. Don't change this if you're not sure what it means.
        crs: null,
        // @option uppercase: Boolean = false
        // If `true`, WMS request parameter keys will be uppercase.
        uppercase: !1
      },
      initialize: function(t, e) {
        this._url = t;
        var i = G({}, this.defaultWmsParams);
        for (var n in e)
          n in this.options || (i[n] = e[n]);
        e = Y(this, e);
        var o = e.detectRetina && P.retina ? 2 : 1, r = this.getTileSize();
        i.width = r.x * o, i.height = r.y * o, this.wmsParams = i;
      },
      onAdd: function(t) {
        this._crs = this.options.crs || t.options.crs, this._wmsVersion = parseFloat(this.wmsParams.version);
        var e = this._wmsVersion >= 1.3 ? "crs" : "srs";
        this.wmsParams[e] = this._crs.code, ii.prototype.onAdd.call(this, t);
      },
      getTileUrl: function(t) {
        var e = this._tileCoordsToNwSe(t), i = this._crs, n = Mt(i.project(e[0]), i.project(e[1])), o = n.min, r = n.max, l = (this._wmsVersion >= 1.3 && this._crs === $n ? [o.y, o.x, r.y, r.x] : [o.x, o.y, r.x, r.y]).join(","), h = ii.prototype.getTileUrl.call(this, t);
        return h + qt(this.wmsParams, h, this.options.uppercase) + (this.options.uppercase ? "&BBOX=" : "&bbox=") + l;
      },
      // @method setParams(params: Object, noRedraw?: Boolean): this
      // Merges an object with the new parameters and re-requests tiles on the current screen (unless `noRedraw` was set to true).
      setParams: function(t, e) {
        return G(this.wmsParams, t), e || this.redraw(), this;
      }
    });
    function ns(t, e) {
      return new io(t, e);
    }
    ii.WMS = io, eo.wms = ns;
    var de = Wt.extend({
      // @section
      // @aka Renderer options
      options: {
        // @option padding: Number = 0.1
        // How much to extend the clip area around the map view (relative to its size)
        // e.g. 0.1 would be 10% of map view in each direction
        padding: 0.1
      },
      initialize: function(t) {
        Y(this, t), N(this), this._layers = this._layers || {};
      },
      onAdd: function() {
        this._container || (this._initContainer(), y(this._container, "leaflet-zoom-animated")), this.getPane().appendChild(this._container), this._update(), this.on("update", this._updatePaths, this);
      },
      onRemove: function() {
        this.off("update", this._updatePaths, this), this._destroyContainer();
      },
      getEvents: function() {
        var t = {
          viewreset: this._reset,
          zoom: this._onZoom,
          moveend: this._update,
          zoomend: this._onZoomEnd
        };
        return this._zoomAnimated && (t.zoomanim = this._onAnimZoom), t;
      },
      _onAnimZoom: function(t) {
        this._updateTransform(t.center, t.zoom);
      },
      _onZoom: function() {
        this._updateTransform(this._map.getCenter(), this._map.getZoom());
      },
      _updateTransform: function(t, e) {
        var i = this._map.getZoomScale(e, this._zoom), n = this._map.getSize().multiplyBy(0.5 + this.options.padding), o = this._map.project(this._center, e), r = n.multiplyBy(-i).add(o).subtract(this._map._getNewPixelOrigin(t, e));
        P.any3d ? Ae(this._container, r, i) : vt(this._container, r);
      },
      _reset: function() {
        this._update(), this._updateTransform(this._center, this._zoom);
        for (var t in this._layers)
          this._layers[t]._reset();
      },
      _onZoomEnd: function() {
        for (var t in this._layers)
          this._layers[t]._project();
      },
      _updatePaths: function() {
        for (var t in this._layers)
          this._layers[t]._update();
      },
      _update: function() {
        var t = this.options.padding, e = this._map.getSize(), i = this._map.containerPointToLayerPoint(e.multiplyBy(-t)).round();
        this._bounds = new rt(i, i.add(e.multiplyBy(1 + t * 2)).round()), this._center = this._map.getCenter(), this._zoom = this._map.getZoom();
      }
    }), no = de.extend({
      // @section
      // @aka Canvas options
      options: {
        // @option tolerance: Number = 0
        // How much to extend the click tolerance around a path/object on the map.
        tolerance: 0
      },
      getEvents: function() {
        var t = de.prototype.getEvents.call(this);
        return t.viewprereset = this._onViewPreReset, t;
      },
      _onViewPreReset: function() {
        this._postponeUpdatePaths = !0;
      },
      onAdd: function() {
        de.prototype.onAdd.call(this), this._draw();
      },
      _initContainer: function() {
        var t = this._container = document.createElement("canvas");
        B(t, "mousemove", this._onMouseMove, this), B(t, "click dblclick mousedown mouseup contextmenu", this._onClick, this), B(t, "mouseout", this._handleMouseOut, this), t._leaflet_disable_events = !0, this._ctx = t.getContext("2d");
      },
      _destroyContainer: function() {
        H(this._redrawRequest), delete this._ctx, V(this._container), at(this._container), delete this._container;
      },
      _updatePaths: function() {
        if (!this._postponeUpdatePaths) {
          var t;
          this._redrawBounds = null;
          for (var e in this._layers)
            t = this._layers[e], t._update();
          this._redraw();
        }
      },
      _update: function() {
        if (!(this._map._animatingZoom && this._bounds)) {
          de.prototype._update.call(this);
          var t = this._bounds, e = this._container, i = t.getSize(), n = P.retina ? 2 : 1;
          vt(e, t.min), e.width = n * i.x, e.height = n * i.y, e.style.width = i.x + "px", e.style.height = i.y + "px", P.retina && this._ctx.scale(2, 2), this._ctx.translate(-t.min.x, -t.min.y), this.fire("update");
        }
      },
      _reset: function() {
        de.prototype._reset.call(this), this._postponeUpdatePaths && (this._postponeUpdatePaths = !1, this._updatePaths());
      },
      _initPath: function(t) {
        this._updateDashArray(t), this._layers[N(t)] = t;
        var e = t._order = {
          layer: t,
          prev: this._drawLast,
          next: null
        };
        this._drawLast && (this._drawLast.next = e), this._drawLast = e, this._drawFirst = this._drawFirst || this._drawLast;
      },
      _addPath: function(t) {
        this._requestRedraw(t);
      },
      _removePath: function(t) {
        var e = t._order, i = e.next, n = e.prev;
        i ? i.prev = n : this._drawLast = n, n ? n.next = i : this._drawFirst = i, delete t._order, delete this._layers[N(t)], this._requestRedraw(t);
      },
      _updatePath: function(t) {
        this._extendRedrawBounds(t), t._project(), t._update(), this._requestRedraw(t);
      },
      _updateStyle: function(t) {
        this._updateDashArray(t), this._requestRedraw(t);
      },
      _updateDashArray: function(t) {
        if (typeof t.options.dashArray == "string") {
          var e = t.options.dashArray.split(/[, ]+/), i = [], n, o;
          for (o = 0; o < e.length; o++) {
            if (n = Number(e[o]), isNaN(n))
              return;
            i.push(n);
          }
          t.options._dashArray = i;
        } else
          t.options._dashArray = t.options.dashArray;
      },
      _requestRedraw: function(t) {
        this._map && (this._extendRedrawBounds(t), this._redrawRequest = this._redrawRequest || z(this._redraw, this));
      },
      _extendRedrawBounds: function(t) {
        if (t._pxBounds) {
          var e = (t.options.weight || 0) + 1;
          this._redrawBounds = this._redrawBounds || new rt(), this._redrawBounds.extend(t._pxBounds.min.subtract([e, e])), this._redrawBounds.extend(t._pxBounds.max.add([e, e]));
        }
      },
      _redraw: function() {
        this._redrawRequest = null, this._redrawBounds && (this._redrawBounds.min._floor(), this._redrawBounds.max._ceil()), this._clear(), this._draw(), this._redrawBounds = null;
      },
      _clear: function() {
        var t = this._redrawBounds;
        if (t) {
          var e = t.getSize();
          this._ctx.clearRect(t.min.x, t.min.y, e.x, e.y);
        } else
          this._ctx.save(), this._ctx.setTransform(1, 0, 0, 1, 0, 0), this._ctx.clearRect(0, 0, this._container.width, this._container.height), this._ctx.restore();
      },
      _draw: function() {
        var t, e = this._redrawBounds;
        if (this._ctx.save(), e) {
          var i = e.getSize();
          this._ctx.beginPath(), this._ctx.rect(e.min.x, e.min.y, i.x, i.y), this._ctx.clip();
        }
        this._drawing = !0;
        for (var n = this._drawFirst; n; n = n.next)
          t = n.layer, (!e || t._pxBounds && t._pxBounds.intersects(e)) && t._updatePath();
        this._drawing = !1, this._ctx.restore();
      },
      _updatePoly: function(t, e) {
        if (this._drawing) {
          var i, n, o, r, l = t._parts, h = l.length, d = this._ctx;
          if (h) {
            for (d.beginPath(), i = 0; i < h; i++) {
              for (n = 0, o = l[i].length; n < o; n++)
                r = l[i][n], d[n ? "lineTo" : "moveTo"](r.x, r.y);
              e && d.closePath();
            }
            this._fillStroke(d, t);
          }
        }
      },
      _updateCircle: function(t) {
        if (!(!this._drawing || t._empty())) {
          var e = t._point, i = this._ctx, n = Math.max(Math.round(t._radius), 1), o = (Math.max(Math.round(t._radiusY), 1) || n) / n;
          o !== 1 && (i.save(), i.scale(1, o)), i.beginPath(), i.arc(e.x, e.y / o, n, 0, Math.PI * 2, !1), o !== 1 && i.restore(), this._fillStroke(i, t);
        }
      },
      _fillStroke: function(t, e) {
        var i = e.options;
        i.fill && (t.globalAlpha = i.fillOpacity, t.fillStyle = i.fillColor || i.color, t.fill(i.fillRule || "evenodd")), i.stroke && i.weight !== 0 && (t.setLineDash && t.setLineDash(e.options && e.options._dashArray || []), t.globalAlpha = i.opacity, t.lineWidth = i.weight, t.strokeStyle = i.color, t.lineCap = i.lineCap, t.lineJoin = i.lineJoin, t.stroke());
      },
      // Canvas obviously doesn't have mouse events for individual drawn objects,
      // so we emulate that by calculating what's under the mouse on mousemove/click manually
      _onClick: function(t) {
        for (var e = this._map.mouseEventToLayerPoint(t), i, n, o = this._drawFirst; o; o = o.next)
          i = o.layer, i.options.interactive && i._containsPoint(e) && (!(t.type === "click" || t.type === "preclick") || !this._map._draggableMoved(i)) && (n = i);
        this._fireEvent(n ? [n] : !1, t);
      },
      _onMouseMove: function(t) {
        if (!(!this._map || this._map.dragging.moving() || this._map._animatingZoom)) {
          var e = this._map.mouseEventToLayerPoint(t);
          this._handleMouseHover(t, e);
        }
      },
      _handleMouseOut: function(t) {
        var e = this._hoveredLayer;
        e && (A(this._container, "leaflet-interactive"), this._fireEvent([e], t, "mouseout"), this._hoveredLayer = null, this._mouseHoverThrottled = !1);
      },
      _handleMouseHover: function(t, e) {
        if (!this._mouseHoverThrottled) {
          for (var i, n, o = this._drawFirst; o; o = o.next)
            i = o.layer, i.options.interactive && i._containsPoint(e) && (n = i);
          n !== this._hoveredLayer && (this._handleMouseOut(t), n && (y(this._container, "leaflet-interactive"), this._fireEvent([n], t, "mouseover"), this._hoveredLayer = n)), this._fireEvent(this._hoveredLayer ? [this._hoveredLayer] : !1, t), this._mouseHoverThrottled = !0, setTimeout(F(function() {
            this._mouseHoverThrottled = !1;
          }, this), 32);
        }
      },
      _fireEvent: function(t, e, i) {
        this._map._fireDOMEvent(e, i || e.type, t);
      },
      _bringToFront: function(t) {
        var e = t._order;
        if (e) {
          var i = e.next, n = e.prev;
          if (i)
            i.prev = n;
          else
            return;
          n ? n.next = i : i && (this._drawFirst = i), e.prev = this._drawLast, this._drawLast.next = e, e.next = null, this._drawLast = e, this._requestRedraw(t);
        }
      },
      _bringToBack: function(t) {
        var e = t._order;
        if (e) {
          var i = e.next, n = e.prev;
          if (n)
            n.next = i;
          else
            return;
          i ? i.prev = n : n && (this._drawLast = n), e.prev = null, e.next = this._drawFirst, this._drawFirst.prev = e, this._drawFirst = e, this._requestRedraw(t);
        }
      }
    });
    function oo(t) {
      return P.canvas ? new no(t) : null;
    }
    var wi = function() {
      try {
        return document.namespaces.add("lvml", "urn:schemas-microsoft-com:vml"), function(t) {
          return document.createElement("<lvml:" + t + ' class="lvml">');
        };
      } catch {
      }
      return function(t) {
        return document.createElement("<" + t + ' xmlns="urn:schemas-microsoft.com:vml" class="lvml">');
      };
    }(), os = {
      _initContainer: function() {
        this._container = b("div", "leaflet-vml-container");
      },
      _update: function() {
        this._map._animatingZoom || (de.prototype._update.call(this), this.fire("update"));
      },
      _initPath: function(t) {
        var e = t._container = wi("shape");
        y(e, "leaflet-vml-shape " + (this.options.className || "")), e.coordsize = "1 1", t._path = wi("path"), e.appendChild(t._path), this._updateStyle(t), this._layers[N(t)] = t;
      },
      _addPath: function(t) {
        var e = t._container;
        this._container.appendChild(e), t.options.interactive && t.addInteractiveTarget(e);
      },
      _removePath: function(t) {
        var e = t._container;
        V(e), t.removeInteractiveTarget(e), delete this._layers[N(t)];
      },
      _updateStyle: function(t) {
        var e = t._stroke, i = t._fill, n = t.options, o = t._container;
        o.stroked = !!n.stroke, o.filled = !!n.fill, n.stroke ? (e || (e = t._stroke = wi("stroke")), o.appendChild(e), e.weight = n.weight + "px", e.color = n.color, e.opacity = n.opacity, n.dashArray ? e.dashStyle = mt(n.dashArray) ? n.dashArray.join(" ") : n.dashArray.replace(/( *, *)/g, " ") : e.dashStyle = "", e.endcap = n.lineCap.replace("butt", "flat"), e.joinstyle = n.lineJoin) : e && (o.removeChild(e), t._stroke = null), n.fill ? (i || (i = t._fill = wi("fill")), o.appendChild(i), i.color = n.fillColor || n.color, i.opacity = n.fillOpacity) : i && (o.removeChild(i), t._fill = null);
      },
      _updateCircle: function(t) {
        var e = t._point.round(), i = Math.round(t._radius), n = Math.round(t._radiusY || i);
        this._setPath(t, t._empty() ? "M0 0" : "AL " + e.x + "," + e.y + " " + i + "," + n + " 0," + 65535 * 360);
      },
      _setPath: function(t, e) {
        t._path.v = e;
      },
      _bringToFront: function(t) {
        ae(t._container);
      },
      _bringToBack: function(t) {
        re(t._container);
      }
    }, qi = P.vml ? wi : Li, bi = de.extend({
      _initContainer: function() {
        this._container = qi("svg"), this._container.setAttribute("pointer-events", "none"), this._rootGroup = qi("g"), this._container.appendChild(this._rootGroup);
      },
      _destroyContainer: function() {
        V(this._container), at(this._container), delete this._container, delete this._rootGroup, delete this._svgSize;
      },
      _update: function() {
        if (!(this._map._animatingZoom && this._bounds)) {
          de.prototype._update.call(this);
          var t = this._bounds, e = t.getSize(), i = this._container;
          (!this._svgSize || !this._svgSize.equals(e)) && (this._svgSize = e, i.setAttribute("width", e.x), i.setAttribute("height", e.y)), vt(i, t.min), i.setAttribute("viewBox", [t.min.x, t.min.y, e.x, e.y].join(" ")), this.fire("update");
        }
      },
      // methods below are called by vector layers implementations
      _initPath: function(t) {
        var e = t._path = qi("path");
        t.options.className && y(e, t.options.className), t.options.interactive && y(e, "leaflet-interactive"), this._updateStyle(t), this._layers[N(t)] = t;
      },
      _addPath: function(t) {
        this._rootGroup || this._initContainer(), this._rootGroup.appendChild(t._path), t.addInteractiveTarget(t._path);
      },
      _removePath: function(t) {
        V(t._path), t.removeInteractiveTarget(t._path), delete this._layers[N(t)];
      },
      _updatePath: function(t) {
        t._project(), t._update();
      },
      _updateStyle: function(t) {
        var e = t._path, i = t.options;
        e && (i.stroke ? (e.setAttribute("stroke", i.color), e.setAttribute("stroke-opacity", i.opacity), e.setAttribute("stroke-width", i.weight), e.setAttribute("stroke-linecap", i.lineCap), e.setAttribute("stroke-linejoin", i.lineJoin), i.dashArray ? e.setAttribute("stroke-dasharray", i.dashArray) : e.removeAttribute("stroke-dasharray"), i.dashOffset ? e.setAttribute("stroke-dashoffset", i.dashOffset) : e.removeAttribute("stroke-dashoffset")) : e.setAttribute("stroke", "none"), i.fill ? (e.setAttribute("fill", i.fillColor || i.color), e.setAttribute("fill-opacity", i.fillOpacity), e.setAttribute("fill-rule", i.fillRule || "evenodd")) : e.setAttribute("fill", "none"));
      },
      _updatePoly: function(t, e) {
        this._setPath(t, ke(t._parts, e));
      },
      _updateCircle: function(t) {
        var e = t._point, i = Math.max(Math.round(t._radius), 1), n = Math.max(Math.round(t._radiusY), 1) || i, o = "a" + i + "," + n + " 0 1,0 ", r = t._empty() ? "M0 0" : "M" + (e.x - i) + "," + e.y + o + i * 2 + ",0 " + o + -i * 2 + ",0 ";
        this._setPath(t, r);
      },
      _setPath: function(t, e) {
        t._path.setAttribute("d", e);
      },
      // SVG does not have the concept of zIndex so we resort to changing the DOM order of elements
      _bringToFront: function(t) {
        ae(t._path);
      },
      _bringToBack: function(t) {
        re(t._path);
      }
    });
    P.vml && bi.include(os);
    function so(t) {
      return P.svg || P.vml ? new bi(t) : null;
    }
    q.include({
      // @namespace Map; @method getRenderer(layer: Path): Renderer
      // Returns the instance of `Renderer` that should be used to render the given
      // `Path`. It will ensure that the `renderer` options of the map and paths
      // are respected, and that the renderers do exist on the map.
      getRenderer: function(t) {
        var e = t.options.renderer || this._getPaneRenderer(t.options.pane) || this.options.renderer || this._renderer;
        return e || (e = this._renderer = this._createRenderer()), this.hasLayer(e) || this.addLayer(e), e;
      },
      _getPaneRenderer: function(t) {
        if (t === "overlayPane" || t === void 0)
          return !1;
        var e = this._paneRenderers[t];
        return e === void 0 && (e = this._createRenderer({ pane: t }), this._paneRenderers[t] = e), e;
      },
      _createRenderer: function(t) {
        return this.options.preferCanvas && oo(t) || so(t);
      }
    });
    var ao = ti.extend({
      initialize: function(t, e) {
        ti.prototype.initialize.call(this, this._boundsToLatLngs(t), e);
      },
      // @method setBounds(latLngBounds: LatLngBounds): this
      // Redraws the rectangle with the passed bounds.
      setBounds: function(t) {
        return this.setLatLngs(this._boundsToLatLngs(t));
      },
      _boundsToLatLngs: function(t) {
        return t = ct(t), [
          t.getSouthWest(),
          t.getNorthWest(),
          t.getNorthEast(),
          t.getSouthEast()
        ];
      }
    });
    function ss(t, e) {
      return new ao(t, e);
    }
    bi.create = qi, bi.pointsToPath = ke, he.geometryToLayer = Vi, he.coordsToLatLng = Tn, he.coordsToLatLngs = Ui, he.latLngToCoords = kn, he.latLngsToCoords = Fi, he.getFeature = ei, he.asFeature = Hi, q.mergeOptions({
      // @option boxZoom: Boolean = true
      // Whether the map can be zoomed to a rectangular area specified by
      // dragging the mouse while pressing the shift key.
      boxZoom: !0
    });
    var ro = Xt.extend({
      initialize: function(t) {
        this._map = t, this._container = t._container, this._pane = t._panes.overlayPane, this._resetStateTimeout = 0, t.on("unload", this._destroy, this);
      },
      addHooks: function() {
        B(this._container, "mousedown", this._onMouseDown, this);
      },
      removeHooks: function() {
        at(this._container, "mousedown", this._onMouseDown, this);
      },
      moved: function() {
        return this._moved;
      },
      _destroy: function() {
        V(this._pane), delete this._pane;
      },
      _resetState: function() {
        this._resetStateTimeout = 0, this._moved = !1;
      },
      _clearDeferredResetState: function() {
        this._resetStateTimeout !== 0 && (clearTimeout(this._resetStateTimeout), this._resetStateTimeout = 0);
      },
      _onMouseDown: function(t) {
        if (!t.shiftKey || t.which !== 1 && t.button !== 1)
          return !1;
        this._clearDeferredResetState(), this._resetState(), ci(), ln(), this._startPoint = this._map.mouseEventToContainerPoint(t), B(document, {
          contextmenu: Re,
          mousemove: this._onMouseMove,
          mouseup: this._onMouseUp,
          keydown: this._onKeyDown
        }, this);
      },
      _onMouseMove: function(t) {
        this._moved || (this._moved = !0, this._box = b("div", "leaflet-zoom-box", this._container), y(this._container, "leaflet-crosshair"), this._map.fire("boxzoomstart")), this._point = this._map.mouseEventToContainerPoint(t);
        var e = new rt(this._point, this._startPoint), i = e.getSize();
        vt(this._box, e.min), this._box.style.width = i.x + "px", this._box.style.height = i.y + "px";
      },
      _finish: function() {
        this._moved && (V(this._box), A(this._container, "leaflet-crosshair")), fi(), un(), at(document, {
          contextmenu: Re,
          mousemove: this._onMouseMove,
          mouseup: this._onMouseUp,
          keydown: this._onKeyDown
        }, this);
      },
      _onMouseUp: function(t) {
        if (!(t.which !== 1 && t.button !== 1) && (this._finish(), !!this._moved)) {
          this._clearDeferredResetState(), this._resetStateTimeout = setTimeout(F(this._resetState, this), 0);
          var e = new Lt(
            this._map.containerPointToLatLng(this._startPoint),
            this._map.containerPointToLatLng(this._point)
          );
          this._map.fitBounds(e).fire("boxzoomend", { boxZoomBounds: e });
        }
      },
      _onKeyDown: function(t) {
        t.keyCode === 27 && (this._finish(), this._clearDeferredResetState(), this._resetState());
      }
    });
    q.addInitHook("addHandler", "boxZoom", ro), q.mergeOptions({
      // @option doubleClickZoom: Boolean|String = true
      // Whether the map can be zoomed in by double clicking on it and
      // zoomed out by double clicking while holding shift. If passed
      // `'center'`, double-click zoom will zoom to the center of the
      //  view regardless of where the mouse was.
      doubleClickZoom: !0
    });
    var lo = Xt.extend({
      addHooks: function() {
        this._map.on("dblclick", this._onDoubleClick, this);
      },
      removeHooks: function() {
        this._map.off("dblclick", this._onDoubleClick, this);
      },
      _onDoubleClick: function(t) {
        var e = this._map, i = e.getZoom(), n = e.options.zoomDelta, o = t.originalEvent.shiftKey ? i - n : i + n;
        e.options.doubleClickZoom === "center" ? e.setZoom(o) : e.setZoomAround(t.containerPoint, o);
      }
    });
    q.addInitHook("addHandler", "doubleClickZoom", lo), q.mergeOptions({
      // @option dragging: Boolean = true
      // Whether the map is draggable with mouse/touch or not.
      dragging: !0,
      // @section Panning Inertia Options
      // @option inertia: Boolean = *
      // If enabled, panning of the map will have an inertia effect where
      // the map builds momentum while dragging and continues moving in
      // the same direction for some time. Feels especially nice on touch
      // devices. Enabled by default.
      inertia: !0,
      // @option inertiaDeceleration: Number = 3000
      // The rate with which the inertial movement slows down, in pixels/second².
      inertiaDeceleration: 3400,
      // px/s^2
      // @option inertiaMaxSpeed: Number = Infinity
      // Max speed of the inertial movement, in pixels/second.
      inertiaMaxSpeed: 1 / 0,
      // px/s
      // @option easeLinearity: Number = 0.2
      easeLinearity: 0.2,
      // TODO refactor, move to CRS
      // @option worldCopyJump: Boolean = false
      // With this option enabled, the map tracks when you pan to another "copy"
      // of the world and seamlessly jumps to the original one so that all overlays
      // like markers and vector layers are still visible.
      worldCopyJump: !1,
      // @option maxBoundsViscosity: Number = 0.0
      // If `maxBounds` is set, this option will control how solid the bounds
      // are when dragging the map around. The default value of `0.0` allows the
      // user to drag outside the bounds at normal speed, higher values will
      // slow down map dragging outside bounds, and `1.0` makes the bounds fully
      // solid, preventing the user from dragging outside the bounds.
      maxBoundsViscosity: 0
    });
    var uo = Xt.extend({
      addHooks: function() {
        if (!this._draggable) {
          var t = this._map;
          this._draggable = new be(t._mapPane, t._container), this._draggable.on({
            dragstart: this._onDragStart,
            drag: this._onDrag,
            dragend: this._onDragEnd
          }, this), this._draggable.on("predrag", this._onPreDragLimit, this), t.options.worldCopyJump && (this._draggable.on("predrag", this._onPreDragWrap, this), t.on("zoomend", this._onZoomEnd, this), t.whenReady(this._onZoomEnd, this));
        }
        y(this._map._container, "leaflet-grab leaflet-touch-drag"), this._draggable.enable(), this._positions = [], this._times = [];
      },
      removeHooks: function() {
        A(this._map._container, "leaflet-grab"), A(this._map._container, "leaflet-touch-drag"), this._draggable.disable();
      },
      moved: function() {
        return this._draggable && this._draggable._moved;
      },
      moving: function() {
        return this._draggable && this._draggable._moving;
      },
      _onDragStart: function() {
        var t = this._map;
        if (t._stop(), this._map.options.maxBounds && this._map.options.maxBoundsViscosity) {
          var e = ct(this._map.options.maxBounds);
          this._offsetLimit = Mt(
            this._map.latLngToContainerPoint(e.getNorthWest()).multiplyBy(-1),
            this._map.latLngToContainerPoint(e.getSouthEast()).multiplyBy(-1).add(this._map.getSize())
          ), this._viscosity = Math.min(1, Math.max(0, this._map.options.maxBoundsViscosity));
        } else
          this._offsetLimit = null;
        t.fire("movestart").fire("dragstart"), t.options.inertia && (this._positions = [], this._times = []);
      },
      _onDrag: function(t) {
        if (this._map.options.inertia) {
          var e = this._lastTime = +/* @__PURE__ */ new Date(), i = this._lastPos = this._draggable._absPos || this._draggable._newPos;
          this._positions.push(i), this._times.push(e), this._prunePositions(e);
        }
        this._map.fire("move", t).fire("drag", t);
      },
      _prunePositions: function(t) {
        for (; this._positions.length > 1 && t - this._times[0] > 50; )
          this._positions.shift(), this._times.shift();
      },
      _onZoomEnd: function() {
        var t = this._map.getSize().divideBy(2), e = this._map.latLngToLayerPoint([0, 0]);
        this._initialWorldOffset = e.subtract(t).x, this._worldWidth = this._map.getPixelWorldBounds().getSize().x;
      },
      _viscousLimit: function(t, e) {
        return t - (t - e) * this._viscosity;
      },
      _onPreDragLimit: function() {
        if (!(!this._viscosity || !this._offsetLimit)) {
          var t = this._draggable._newPos.subtract(this._draggable._startPos), e = this._offsetLimit;
          t.x < e.min.x && (t.x = this._viscousLimit(t.x, e.min.x)), t.y < e.min.y && (t.y = this._viscousLimit(t.y, e.min.y)), t.x > e.max.x && (t.x = this._viscousLimit(t.x, e.max.x)), t.y > e.max.y && (t.y = this._viscousLimit(t.y, e.max.y)), this._draggable._newPos = this._draggable._startPos.add(t);
        }
      },
      _onPreDragWrap: function() {
        var t = this._worldWidth, e = Math.round(t / 2), i = this._initialWorldOffset, n = this._draggable._newPos.x, o = (n - e + i) % t + e - i, r = (n + e + i) % t - e - i, l = Math.abs(o + i) < Math.abs(r + i) ? o : r;
        this._draggable._absPos = this._draggable._newPos.clone(), this._draggable._newPos.x = l;
      },
      _onDragEnd: function(t) {
        var e = this._map, i = e.options, n = !i.inertia || t.noInertia || this._times.length < 2;
        if (e.fire("dragend", t), n)
          e.fire("moveend");
        else {
          this._prunePositions(+/* @__PURE__ */ new Date());
          var o = this._lastPos.subtract(this._positions[0]), r = (this._lastTime - this._times[0]) / 1e3, l = i.easeLinearity, h = o.multiplyBy(l / r), d = h.distanceTo([0, 0]), f = Math.min(i.inertiaMaxSpeed, d), w = h.multiplyBy(f / d), Z = f / (i.inertiaDeceleration * l), U = w.multiplyBy(-Z / 2).round();
          !U.x && !U.y ? e.fire("moveend") : (U = e._limitOffset(U, e.options.maxBounds), z(function() {
            e.panBy(U, {
              duration: Z,
              easeLinearity: l,
              noMoveStart: !0,
              animate: !0
            });
          }));
        }
      }
    });
    q.addInitHook("addHandler", "dragging", uo), q.mergeOptions({
      // @option keyboard: Boolean = true
      // Makes the map focusable and allows users to navigate the map with keyboard
      // arrows and `+`/`-` keys.
      keyboard: !0,
      // @option keyboardPanDelta: Number = 80
      // Amount of pixels to pan when pressing an arrow key.
      keyboardPanDelta: 80
    });
    var ho = Xt.extend({
      keyCodes: {
        left: [37],
        right: [39],
        down: [40],
        up: [38],
        zoomIn: [187, 107, 61, 171],
        zoomOut: [189, 109, 54, 173]
      },
      initialize: function(t) {
        this._map = t, this._setPanDelta(t.options.keyboardPanDelta), this._setZoomDelta(t.options.zoomDelta);
      },
      addHooks: function() {
        var t = this._map._container;
        t.tabIndex <= 0 && (t.tabIndex = "0"), B(t, {
          focus: this._onFocus,
          blur: this._onBlur,
          mousedown: this._onMouseDown
        }, this), this._map.on({
          focus: this._addHooks,
          blur: this._removeHooks
        }, this);
      },
      removeHooks: function() {
        this._removeHooks(), at(this._map._container, {
          focus: this._onFocus,
          blur: this._onBlur,
          mousedown: this._onMouseDown
        }, this), this._map.off({
          focus: this._addHooks,
          blur: this._removeHooks
        }, this);
      },
      _onMouseDown: function() {
        if (!this._focused) {
          var t = document.body, e = document.documentElement, i = t.scrollTop || e.scrollTop, n = t.scrollLeft || e.scrollLeft;
          this._map._container.focus(), window.scrollTo(n, i);
        }
      },
      _onFocus: function() {
        this._focused = !0, this._map.fire("focus");
      },
      _onBlur: function() {
        this._focused = !1, this._map.fire("blur");
      },
      _setPanDelta: function(t) {
        var e = this._panKeys = {}, i = this.keyCodes, n, o;
        for (n = 0, o = i.left.length; n < o; n++)
          e[i.left[n]] = [-1 * t, 0];
        for (n = 0, o = i.right.length; n < o; n++)
          e[i.right[n]] = [t, 0];
        for (n = 0, o = i.down.length; n < o; n++)
          e[i.down[n]] = [0, t];
        for (n = 0, o = i.up.length; n < o; n++)
          e[i.up[n]] = [0, -1 * t];
      },
      _setZoomDelta: function(t) {
        var e = this._zoomKeys = {}, i = this.keyCodes, n, o;
        for (n = 0, o = i.zoomIn.length; n < o; n++)
          e[i.zoomIn[n]] = t;
        for (n = 0, o = i.zoomOut.length; n < o; n++)
          e[i.zoomOut[n]] = -t;
      },
      _addHooks: function() {
        B(document, "keydown", this._onKeyDown, this);
      },
      _removeHooks: function() {
        at(document, "keydown", this._onKeyDown, this);
      },
      _onKeyDown: function(t) {
        if (!(t.altKey || t.ctrlKey || t.metaKey)) {
          var e = t.keyCode, i = this._map, n;
          if (e in this._panKeys) {
            if (!i._panAnim || !i._panAnim._inProgress)
              if (n = this._panKeys[e], t.shiftKey && (n = I(n).multiplyBy(3)), i.options.maxBounds && (n = i._limitOffset(I(n), i.options.maxBounds)), i.options.worldCopyJump) {
                var o = i.wrapLatLng(i.unproject(i.project(i.getCenter()).add(n)));
                i.panTo(o);
              } else
                i.panBy(n);
          } else if (e in this._zoomKeys)
            i.setZoom(i.getZoom() + (t.shiftKey ? 3 : 1) * this._zoomKeys[e]);
          else if (e === 27 && i._popup && i._popup.options.closeOnEscapeKey)
            i.closePopup();
          else
            return;
          Re(t);
        }
      }
    });
    q.addInitHook("addHandler", "keyboard", ho), q.mergeOptions({
      // @section Mouse wheel options
      // @option scrollWheelZoom: Boolean|String = true
      // Whether the map can be zoomed by using the mouse wheel. If passed `'center'`,
      // it will zoom to the center of the view regardless of where the mouse was.
      scrollWheelZoom: !0,
      // @option wheelDebounceTime: Number = 40
      // Limits the rate at which a wheel can fire (in milliseconds). By default
      // user can't zoom via wheel more often than once per 40 ms.
      wheelDebounceTime: 40,
      // @option wheelPxPerZoomLevel: Number = 60
      // How many scroll pixels (as reported by [L.DomEvent.getWheelDelta](#domevent-getwheeldelta))
      // mean a change of one full zoom level. Smaller values will make wheel-zooming
      // faster (and vice versa).
      wheelPxPerZoomLevel: 60
    });
    var co = Xt.extend({
      addHooks: function() {
        B(this._map._container, "wheel", this._onWheelScroll, this), this._delta = 0;
      },
      removeHooks: function() {
        at(this._map._container, "wheel", this._onWheelScroll, this);
      },
      _onWheelScroll: function(t) {
        var e = An(t), i = this._map.options.wheelDebounceTime;
        this._delta += e, this._lastMousePos = this._map.mouseEventToContainerPoint(t), this._startTime || (this._startTime = +/* @__PURE__ */ new Date());
        var n = Math.max(i - (+/* @__PURE__ */ new Date() - this._startTime), 0);
        clearTimeout(this._timer), this._timer = setTimeout(F(this._performZoom, this), n), Re(t);
      },
      _performZoom: function() {
        var t = this._map, e = t.getZoom(), i = this._map.options.zoomSnap || 0;
        t._stop();
        var n = this._delta / (this._map.options.wheelPxPerZoomLevel * 4), o = 4 * Math.log(2 / (1 + Math.exp(-Math.abs(n)))) / Math.LN2, r = i ? Math.ceil(o / i) * i : o, l = t._limitZoom(e + (this._delta > 0 ? r : -r)) - e;
        this._delta = 0, this._startTime = null, l && (t.options.scrollWheelZoom === "center" ? t.setZoom(e + l) : t.setZoomAround(this._lastMousePos, e + l));
      }
    });
    q.addInitHook("addHandler", "scrollWheelZoom", co);
    var as = 600;
    q.mergeOptions({
      // @section Touch interaction options
      // @option tapHold: Boolean
      // Enables simulation of `contextmenu` event, default is `true` for mobile Safari.
      tapHold: P.touchNative && P.safari && P.mobile,
      // @option tapTolerance: Number = 15
      // The max number of pixels a user can shift his finger during touch
      // for it to be considered a valid tap.
      tapTolerance: 15
    });
    var fo = Xt.extend({
      addHooks: function() {
        B(this._map._container, "touchstart", this._onDown, this);
      },
      removeHooks: function() {
        at(this._map._container, "touchstart", this._onDown, this);
      },
      _onDown: function(t) {
        if (clearTimeout(this._holdTimeout), t.touches.length === 1) {
          var e = t.touches[0];
          this._startPos = this._newPos = new C(e.clientX, e.clientY), this._holdTimeout = setTimeout(F(function() {
            this._cancel(), this._isTapValid() && (B(document, "touchend", Pt), B(document, "touchend touchcancel", this._cancelClickPrevent), this._simulateEvent("contextmenu", e));
          }, this), as), B(document, "touchend touchcancel contextmenu", this._cancel, this), B(document, "touchmove", this._onMove, this);
        }
      },
      _cancelClickPrevent: function t() {
        at(document, "touchend", Pt), at(document, "touchend touchcancel", t);
      },
      _cancel: function() {
        clearTimeout(this._holdTimeout), at(document, "touchend touchcancel contextmenu", this._cancel, this), at(document, "touchmove", this._onMove, this);
      },
      _onMove: function(t) {
        var e = t.touches[0];
        this._newPos = new C(e.clientX, e.clientY);
      },
      _isTapValid: function() {
        return this._newPos.distanceTo(this._startPos) <= this._map.options.tapTolerance;
      },
      _simulateEvent: function(t, e) {
        var i = new MouseEvent(t, {
          bubbles: !0,
          cancelable: !0,
          view: window,
          // detail: 1,
          screenX: e.screenX,
          screenY: e.screenY,
          clientX: e.clientX,
          clientY: e.clientY
          // button: 2,
          // buttons: 2
        });
        i._simulated = !0, e.target.dispatchEvent(i);
      }
    });
    q.addInitHook("addHandler", "tapHold", fo), q.mergeOptions({
      // @section Touch interaction options
      // @option touchZoom: Boolean|String = *
      // Whether the map can be zoomed by touch-dragging with two fingers. If
      // passed `'center'`, it will zoom to the center of the view regardless of
      // where the touch events (fingers) were. Enabled for touch-capable web
      // browsers.
      touchZoom: P.touch,
      // @option bounceAtZoomLimits: Boolean = true
      // Set it to false if you don't want the map to zoom beyond min/max zoom
      // and then bounce back when pinch-zooming.
      bounceAtZoomLimits: !0
    });
    var _o = Xt.extend({
      addHooks: function() {
        y(this._map._container, "leaflet-touch-zoom"), B(this._map._container, "touchstart", this._onTouchStart, this);
      },
      removeHooks: function() {
        A(this._map._container, "leaflet-touch-zoom"), at(this._map._container, "touchstart", this._onTouchStart, this);
      },
      _onTouchStart: function(t) {
        var e = this._map;
        if (!(!t.touches || t.touches.length !== 2 || e._animatingZoom || this._zooming)) {
          var i = e.mouseEventToContainerPoint(t.touches[0]), n = e.mouseEventToContainerPoint(t.touches[1]);
          this._centerPoint = e.getSize()._divideBy(2), this._startLatLng = e.containerPointToLatLng(this._centerPoint), e.options.touchZoom !== "center" && (this._pinchStartLatLng = e.containerPointToLatLng(i.add(n)._divideBy(2))), this._startDist = i.distanceTo(n), this._startZoom = e.getZoom(), this._moved = !1, this._zooming = !0, e._stop(), B(document, "touchmove", this._onTouchMove, this), B(document, "touchend touchcancel", this._onTouchEnd, this), Pt(t);
        }
      },
      _onTouchMove: function(t) {
        if (!(!t.touches || t.touches.length !== 2 || !this._zooming)) {
          var e = this._map, i = e.mouseEventToContainerPoint(t.touches[0]), n = e.mouseEventToContainerPoint(t.touches[1]), o = i.distanceTo(n) / this._startDist;
          if (this._zoom = e.getScaleZoom(o, this._startZoom), !e.options.bounceAtZoomLimits && (this._zoom < e.getMinZoom() && o < 1 || this._zoom > e.getMaxZoom() && o > 1) && (this._zoom = e._limitZoom(this._zoom)), e.options.touchZoom === "center") {
            if (this._center = this._startLatLng, o === 1)
              return;
          } else {
            var r = i._add(n)._divideBy(2)._subtract(this._centerPoint);
            if (o === 1 && r.x === 0 && r.y === 0)
              return;
            this._center = e.unproject(e.project(this._pinchStartLatLng, this._zoom).subtract(r), this._zoom);
          }
          this._moved || (e._moveStart(!0, !1), this._moved = !0), H(this._animRequest);
          var l = F(e._move, e, this._center, this._zoom, { pinch: !0, round: !1 }, void 0);
          this._animRequest = z(l, this, !0), Pt(t);
        }
      },
      _onTouchEnd: function() {
        if (!this._moved || !this._zooming) {
          this._zooming = !1;
          return;
        }
        this._zooming = !1, H(this._animRequest), at(document, "touchmove", this._onTouchMove, this), at(document, "touchend touchcancel", this._onTouchEnd, this), this._map.options.zoomAnimation ? this._map._animateZoom(this._center, this._map._limitZoom(this._zoom), !0, this._map.options.zoomSnap) : this._map._resetView(this._center, this._map._limitZoom(this._zoom));
      }
    });
    q.addInitHook("addHandler", "touchZoom", _o), q.BoxZoom = ro, q.DoubleClickZoom = lo, q.Drag = uo, q.Keyboard = ho, q.ScrollWheelZoom = co, q.TapHold = fo, q.TouchZoom = _o, c.Bounds = rt, c.Browser = P, c.CRS = nt, c.Canvas = no, c.Circle = Pn, c.CircleMarker = Di, c.Class = yt, c.Control = Ht, c.DivIcon = to, c.DivOverlay = Qt, c.DomEvent = Po, c.DomUtil = xo, c.Draggable = be, c.Evented = Ut, c.FeatureGroup = le, c.GeoJSON = he, c.GridLayer = yi, c.Handler = Xt, c.Icon = Qe, c.ImageOverlay = Wi, c.LatLng = X, c.LatLngBounds = Lt, c.Layer = Wt, c.LayerGroup = Xe, c.LineUtil = No, c.Map = q, c.Marker = Ri, c.Mixin = Eo, c.Path = xe, c.Point = C, c.PolyUtil = Oo, c.Polygon = ti, c.Polyline = ue, c.Popup = ji, c.PosAnimation = Bn, c.Projection = Ro, c.Rectangle = ao, c.Renderer = de, c.SVG = bi, c.SVGOverlay = Qn, c.TileLayer = ii, c.Tooltip = Gi, c.Transformation = je, c.Util = it, c.VideoOverlay = Xn, c.bind = F, c.bounds = Mt, c.canvas = oo, c.circle = Go, c.circleMarker = jo, c.control = mi, c.divIcon = es, c.extend = G, c.featureGroup = Fo, c.geoJSON = Yn, c.geoJson = Ko, c.gridLayer = is, c.icon = Ho, c.imageOverlay = Jo, c.latLng = W, c.latLngBounds = ct, c.layerGroup = Uo, c.map = To, c.marker = Wo, c.point = I, c.polygon = $o, c.polyline = qo, c.popup = Qo, c.rectangle = ss, c.setOptions = Y, c.stamp = N, c.svg = so, c.svgOverlay = Xo, c.tileLayer = eo, c.tooltip = ts, c.transformation = oe, c.version = Et, c.videoOverlay = Yo;
    var rs = window.L;
    c.noConflict = function() {
      return window.L = rs, this;
    }, window.L = c;
  });
})(zn, zn.exports);
var Cs = zn.exports;
const S = /* @__PURE__ */ ks(Cs), Ms = ["aria-expanded", "aria-controls", "aria-activedescendant", "aria-label", "disabled"], Ss = { class: "app-select-value" }, zs = {
  class: "app-select-chevron",
  "aria-hidden": "true"
}, Es = ["id", "aria-label"], Os = ["id", "aria-selected", "aria-disabled", "data-index", "onPointermove", "onClick"], Zs = {
  key: 0,
  class: "app-select-check",
  "aria-hidden": "true"
}, Is = {
  key: 0,
  class: "app-select-empty"
}, Le = /* @__PURE__ */ yo({
  inheritAttrs: !1,
  __name: "AppSelect",
  props: {
    modelValue: { default: "" },
    options: {},
    disabled: { type: Boolean, default: !1 },
    placeholder: { default: "请选择" },
    ariaLabel: {}
  },
  emits: ["update:modelValue", "change"],
  setup(kt, { emit: ce }) {
    const c = kt, Et = ce;
    let G = 0;
    const At = (g) => `${g}-${++G}`, F = J("zh-CN"), Gt = J(null), N = J(null), tt = J(!1), ut = J(-1), ot = J({}), _t = J(!1), Ct = At("select"), ht = dt(() => c.options.map((g) => typeof g == "string" ? { value: g, label: g } : g)), Y = dt(() => ht.value.find((g) => g.value === c.modelValue)?.label || c.modelValue || c.placeholder);
    let qt = "", Ve = 0;
    function $t() {
      const g = Gt.value?.getBoundingClientRect();
      if (!g) return;
      const z = window.visualViewport?.height || innerHeight, H = window.visualViewport?.width || innerWidth, it = z - g.bottom - 10, yt = g.top - 10;
      _t.value = g.top >= Math.min(320, ht.value.length * 46 + 12) + 8 || it < Math.min(320, ht.value.length * 46 + 12) && yt > it;
      const Fe = Math.max(48, Math.min(340, _t.value ? yt : it)), wt = Math.min(Math.max(g.width, 220), H - 16);
      ot.value = { position: "fixed", left: `${Math.max(8, Math.min(g.left, H - wt - 8))}px`, width: `${wt}px`, maxHeight: `${Fe}px`, ..._t.value ? { bottom: `${z - g.top + 8}px` } : { top: `${g.bottom + 8}px` } };
    }
    function mt(g = !1) {
      tt.value = !1, qt = "", g && Gt.value?.focus();
    }
    async function ie() {
      c.disabled || tt.value || (tt.value = !0, ut.value = ht.value.findIndex((g) => g.value === c.modelValue && !g.disabled), ut.value < 0 && (ut.value = ht.value.findIndex((g) => !g.disabled)), $t(), await xi(), Kt());
    }
    function Kt() {
      N.value?.querySelector(`[data-index="${ut.value}"]`)?.scrollIntoView({ block: "nearest" });
    }
    function ne(g) {
      const z = ht.value[g];
      !z || z.disabled || (Et("update:modelValue", z.value), Et("change", z.value), mt(!0));
    }
    async function Ue(g) {
      if (!(c.disabled || g.isComposing)) {
        if (g.key === "Tab") {
          mt();
          return;
        }
        if (g.key === "Escape") {
          tt.value && (g.preventDefault(), mt(!0));
          return;
        }
        if (["ArrowDown", "ArrowUp", "Home", "End", "Enter", " "].includes(g.key)) {
          if (g.preventDefault(), !tt.value) {
            await ie();
            return;
          }
          if (g.key === "Enter" || g.key === " ") {
            ne(ut.value);
            return;
          }
          const z = ht.value.map((it, yt) => it.disabled ? -1 : yt).filter((it) => it >= 0);
          if (!z.length) return;
          const H = z.indexOf(ut.value);
          ut.value = g.key === "Home" ? z[0] : g.key === "End" ? z[z.length - 1] : z[(H + (g.key === "ArrowDown" ? 1 : -1) + z.length) % z.length], await xi(), Kt();
          return;
        }
        if (g.key.length === 1 && !g.ctrlKey && !g.metaKey && !g.altKey) {
          await ie();
          const z = Date.now();
          qt = z - Ve > 700 ? g.key : qt + g.key, Ve = z;
          const H = ht.value.findIndex((it) => !it.disabled && it.label.toLocaleLowerCase().startsWith(qt.toLocaleLowerCase()));
          H >= 0 && (ut.value = H, await xi(), Kt());
        }
      }
    }
    function Te(g) {
      const z = g.target;
      !Gt.value?.contains(z) && !N.value?.contains(z) && mt();
    }
    function fe(g) {
      tt.value && (!(g.target instanceof Node) || !N.value?.contains(g.target)) && $t();
    }
    return oi(() => c.disabled, (g) => {
      g && mt();
    }), oi(ht, () => {
      tt.value && (ut.value >= ht.value.length && (ut.value = ht.value.findIndex((g) => !g.disabled)), xi($t));
    }), Sn(() => {
      document.addEventListener("pointerdown", Te, !0), window.addEventListener("resize", $t), window.addEventListener("scroll", fe, !0);
    }), wo(() => {
      document.removeEventListener("pointerdown", Te, !0), window.removeEventListener("resize", $t), window.removeEventListener("scroll", fe, !0);
    }), (g, z) => (T(), k("div", ms(g.$attrs, {
      class: ["app-select", { "is-disabled": kt.disabled, "is-open": tt.value }]
    }), [
      a("button", {
        ref_key: "trigger",
        ref: Gt,
        type: "button",
        class: "app-select-trigger",
        role: "combobox",
        "aria-haspopup": "listbox",
        "aria-expanded": tt.value,
        "aria-controls": tt.value ? Ki(Ct) : void 0,
        "aria-activedescendant": tt.value && ut.value >= 0 ? `${Ki(Ct)}-${ut.value}` : void 0,
        "aria-label": kt.ariaLabel,
        disabled: kt.disabled,
        onClick: z[0] || (z[0] = (H) => tt.value ? mt() : ie()),
        onKeydown: Ue
      }, [
        a("span", Ss, v(Y.value), 1),
        a("span", zs, [
          (T(), k("svg", {
            class: Pe({ "is-open": tt.value }),
            width: "18",
            height: "18",
            viewBox: "0 0 24 24",
            fill: "none"
          }, [...z[2] || (z[2] = [
            a("path", {
              d: "m6 9 6 6 6-6",
              stroke: "currentColor",
              "stroke-width": "1.9",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            }, null, -1)
          ])], 2))
        ])
      ], 40, Ms),
      (T(), vs(gs, { to: "body" }, [
        ee(ys, { name: "select-menu" }, {
          default: ws(() => [
            tt.value ? (T(), k("div", {
              key: 0,
              id: Ki(Ct),
              ref_key: "menu",
              ref: N,
              class: Pe(["app-select-menu", { "opens-up": _t.value }]),
              style: Yi(ot.value),
              role: "listbox",
              "aria-label": kt.ariaLabel || "选项",
              onPointerdown: z[1] || (z[1] = go(() => {
              }, ["prevent"]))
            }, [
              (T(!0), k(Tt, null, jt(ht.value, (H, it) => (T(), k("div", {
                id: `${Ki(Ct)}-${it}`,
                key: `${H.value}:${it}`,
                role: "option",
                "aria-selected": H.value === kt.modelValue,
                "aria-disabled": !!H.disabled,
                "data-index": it,
                class: Pe(["app-select-option", { highlighted: ut.value === it, selected: H.value === kt.modelValue, disabled: H.disabled }]),
                onPointermove: (yt) => !H.disabled && (ut.value = it),
                onClick: go((yt) => ne(it), ["stop"])
              }, [
                a("span", null, v(H.label), 1),
                H.value === kt.modelValue ? (T(), k("span", Zs, [...z[3] || (z[3] = [
                  a("svg", {
                    width: "16",
                    height: "16",
                    viewBox: "0 0 24 24",
                    fill: "none"
                  }, [
                    a("path", {
                      d: "m5 12 4 4L19 6",
                      stroke: "currentColor",
                      "stroke-width": "2.4",
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round"
                    })
                  ], -1)
                ])])) : K("", !0)
              ], 42, Os))), 128)),
              ht.value.length ? K("", !0) : (T(), k("div", Is, v(F.value === "en" ? "No options available" : "暂无可选项"), 1))
            ], 46, Es)) : K("", !0)
          ]),
          _: 1
        })
      ]))
    ], 16));
  }
}), As = { class: "hero" }, Bs = { class: "hero-main" }, Ns = { class: "hero-actions" }, Rs = ["disabled"], Ds = ["disabled"], Vs = { class: "state-row" }, Us = { class: "pill soft" }, Fs = { class: "pill soft" }, Hs = { class: "pill soft" }, Ws = {
  key: 0,
  class: "banner err"
}, js = {
  key: 1,
  class: "banner ok"
}, Gs = {
  class: "tabs",
  "aria-label": "视图"
}, qs = ["onClick"], $s = { class: "tab-ic" }, Ks = { class: "panel" }, Js = { class: "section-head" }, Ys = { class: "head-actions" }, Xs = ["disabled"], Qs = ["disabled"], ta = { class: "card" }, ea = { class: "settings-grid" }, ia = { class: "pfield" }, na = { class: "pfield" }, oa = { class: "pfield" }, sa = { class: "pfield" }, aa = {
  key: 0,
  class: "card"
}, ra = { class: "count-pill ok" }, la = { class: "settings-grid" }, ua = {
  class: "settings-grid",
  style: { "margin-top": "10px" }
}, ha = { class: "panel" }, da = { class: "card" }, ca = {
  key: 0,
  class: "empty"
}, fa = {
  key: 1,
  class: "settings-grid"
}, _a = { class: "cog-metric" }, pa = { class: "cog-metric" }, ma = { class: "cog-metric" }, va = { class: "cog-metric" }, ga = { class: "cog-metric" }, ya = { class: "cog-metric" }, wa = { class: "cog-metric" }, ba = { class: "cog-metric" }, xa = { class: "cog-metric" }, La = { class: "cog-metric" }, Pa = { class: "cog-metric" }, Ta = { class: "cog-metric" }, ka = { class: "cog-metric" }, Ca = { class: "cog-metric" }, Ma = { class: "cog-metric" }, Sa = { class: "cog-metric" }, za = { class: "cog-metric" }, Ea = { class: "cog-metric" }, Oa = { class: "cog-metric" }, Za = { class: "cog-metric" }, Ia = { class: "cog-metric" }, Aa = { class: "cog-metric" }, Ba = { class: "cog-metric" }, Na = { class: "cog-metric" }, Ra = { class: "cog-metric" }, Da = { class: "cog-metric" }, Va = {
  key: 0,
  class: "cog-metric"
}, Ua = {
  key: 2,
  class: "hint"
}, Fa = {
  key: 3,
  class: "hint"
}, Ha = {
  key: 4,
  class: "hint"
}, Wa = {
  key: 5,
  class: "som-channels"
}, ja = { class: "som-chan-name" }, Ga = { class: "som-chan-bar" }, qa = { class: "som-chan-val" }, $a = {
  key: 0,
  class: "hint"
}, Ka = { class: "card" }, Ja = { class: "switches" }, Ya = { class: "sw" }, Xa = { class: "sw" }, Qa = { class: "sw" }, tr = { class: "sw" }, er = { class: "sw" }, ir = { class: "card" }, nr = { class: "preset-row" }, or = ["onClick"], sr = { class: "grid2" }, ar = { class: "card" }, rr = { class: "settings-grid" }, lr = { class: "switches" }, ur = { class: "sw" }, hr = { class: "sw" }, dr = { class: "sw" }, cr = { class: "sw" }, fr = { class: "sw" }, _r = { class: "card" }, pr = { class: "settings-grid" }, mr = { class: "sw" }, vr = { class: "sw" }, gr = { class: "sw" }, yr = { class: "card" }, wr = { class: "settings-grid" }, br = { class: "sw" }, xr = { class: "card" }, Lr = { class: "settings-grid" }, Pr = { class: "sw" }, Tr = { class: "card" }, kr = { class: "settings-grid" }, Cr = { class: "sw" }, Mr = { class: "card" }, Sr = { class: "sw" }, zr = { class: "settings-grid" }, Er = { class: "card" }, Or = { class: "switches" }, Zr = { class: "sw" }, Ir = { class: "sw" }, Ar = { class: "sw" }, Br = { class: "sw" }, Nr = { class: "panel" }, Rr = { class: "card" }, Dr = { class: "settings-grid" }, Vr = { class: "card" }, Ur = { class: "world-field" }, Fr = { class: "card" }, Hr = { class: "settings-grid" }, Wr = { class: "world-field" }, jr = { class: "world-field" }, Gr = { class: "world-field" }, qr = { class: "world-actions" }, $r = ["disabled"], Kr = ["disabled"], Jr = { class: "card" }, Yr = { class: "wm-head" }, Xr = { class: "count-pill" }, Qr = {
  key: 0,
  class: "wm-place"
}, tl = {
  key: 0,
  class: "hint wm-premise"
}, el = { class: "wm-map-wrap" }, il = {
  key: 0,
  class: "wm-offline"
}, nl = {
  key: 1,
  class: "wm-compass",
  "aria-hidden": "true"
}, ol = {
  key: 1,
  class: "empty"
}, sl = {
  key: 2,
  class: "wm-legend"
}, al = {
  key: 3,
  class: "wm-routes"
}, rl = {
  key: 0,
  class: "wm-routes-col"
}, ll = {
  key: 1,
  class: "wm-routes-col"
}, ul = { class: "card" }, hl = { class: "wm-head" }, dl = { class: "count-pill" }, cl = { class: "feed" }, fl = { class: "meta" }, _l = {
  key: 0,
  class: "empty"
}, pl = { class: "panel" }, ml = { class: "card" }, vl = { class: "count-pill" }, gl = { class: "feed" }, yl = { class: "meta" }, wl = {
  key: 0,
  class: "empty"
}, bl = { class: "grid2" }, xl = { class: "card" }, Ll = { class: "feed" }, Pl = { class: "meta" }, Tl = { class: "meta" }, kl = { class: "meta" }, Cl = {
  key: 0,
  class: "empty"
}, Ml = { class: "card" }, Sl = { class: "feed" }, zl = { class: "meta" }, El = {
  key: 0,
  class: "empty"
}, Ol = { class: "section" }, Zl = { class: "grid2" }, Il = { class: "card" }, Al = { style: { "margin-top": "14px", display: "flex", gap: "10px", "flex-wrap": "wrap" } }, Bl = ["disabled"], Nl = "https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}", Rl = /* @__PURE__ */ yo({
  __name: "CompanionPage",
  setup(kt) {
    const { confirm: ce } = Ls(), c = J({ settings: {}, cognition: null }), Et = J(!1), G = J(""), At = J(""), F = J("cognition"), Gt = J(null), N = [
      { key: "cognition", i: "01", label: "认知", icon: "◉" },
      { key: "persona", i: "02", label: "人设", icon: "✎" },
      { key: "world", i: "03", label: "世界", icon: "✦" },
      { key: "state", i: "04", label: "状态", icon: "☺" }
    ];
    function tt(p) {
      At.value = p, setTimeout(() => {
        At.value === p && (At.value = "");
      }, 2500);
    }
    function ut(p) {
      const s = String(p?.message || p || "");
      return /connection refused|Unavailable|actively refused|dial tcp|ECONNREFUSED|LIFE is unavailable|life unavailable|502|503/i.test(s) ? "LIFE 服务暂时未就绪（可能正在启动或重启），已自动重试。稍候刷新即可。" : s || "操作失败";
    }
    const ot = (p) => new Promise((s) => setTimeout(s, p));
    async function _t(p = 0) {
      Et.value = !0, G.value = "";
      try {
        const s = await fetch("/api/life/companion");
        if (!s.ok) throw Error(await s.text() || String(s.status));
        c.value = await s.json(), Mi(), Et.value = !1;
      } catch (s) {
        if (p < 4)
          return await ot(1500), _t(p + 1);
        G.value = ut(s), Et.value = !1;
      }
    }
    async function Ct(p, s) {
      for (let u = 0; u < 3; u++)
        try {
          const E = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: p, payload: s }) });
          if (!E.ok) throw Error(await E.text());
          const M = await E.json().catch(() => ({}));
          return await _t(), M;
        } catch (E) {
          if (u < 2 && /connection refused|Unavailable|actively refused|dial tcp|502|503|life unavailable/i.test(String(E?.message || E))) {
            await ot(1200);
            continue;
          }
          return G.value = ut(E), null;
        }
      return null;
    }
    function ht(p) {
      F.value = p;
      const s = matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", u = Gt.value;
      u ? u.scrollTo({ top: 0, behavior: s }) : window.scrollTo({ top: 0, behavior: s });
    }
    const Y = {
      cog_enabled: "1",
      cog_modulate_affect: "1",
      cog_modulate_language: "1",
      cog_modulate_social: "1",
      cog_modulate_selfhood: "1",
      cog_plan_depth: "2",
      cog_wm_capacity: "5",
      cog_tau: "0.4",
      cog_gamma: "0.9",
      cog_alpha_habit: "0.08",
      cog_alpha_mf: "0.2",
      cog_theta_pe: "0.25",
      cog_theta_n: "0.35",
      cog_prospection_horizon: "4",
      cog_use_cerebellum: "1",
      cog_use_thalamic_gate: "1",
      cog_use_ofc_map: "1",
      cog_use_prospection: "1",
      cog_use_limbic_bias: "1",
      cog_affect_enabled: "1",
      cog_affect_profile: "typical",
      cog_affect_vagal: "0.6",
      cog_affect_threat: "0.2",
      cog_affect_reward: "1",
      cog_affect_somatic: "0",
      cog_affect_persona_llm: "1",
      cog_language_enabled: "1",
      cog_language_framing: "weak_whorf",
      cog_language_boundary: "0.6",
      cog_social_enabled: "1",
      cog_social_empathy: "0.4",
      cog_social_stage: "2",
      cog_selfhood_enabled: "1",
      cog_selfhood_discount: "0.1",
      cog_selfhood_detail: "20",
      cog_attachment_enabled: "0",
      cog_attachment_type: "依存型",
      // memory & consolidation. On by default — they are what makes lived
      // experience leave a trace; turn one off to ablate it.
      cog_memory_encode: "1",
      cog_sleep_replay: "1",
      cog_memory_reconsolidate: "1",
      cog_cls_interleave: "1"
    }, qt = [
      "cog_enabled",
      "cog_modulate_affect",
      "cog_modulate_language",
      "cog_modulate_social",
      "cog_modulate_selfhood",
      "cog_use_cerebellum",
      "cog_use_thalamic_gate",
      "cog_use_ofc_map",
      "cog_use_prospection",
      "cog_use_limbic_bias",
      "cog_affect_enabled",
      "cog_affect_somatic",
      "cog_affect_persona_llm",
      "cog_language_enabled",
      "cog_social_enabled",
      "cog_selfhood_enabled",
      "cog_attachment_enabled",
      "cog_memory_encode",
      "cog_sleep_replay",
      "cog_memory_reconsolidate",
      "cog_cls_interleave"
    ], Ve = ["cog_affect_profile", "cog_language_framing", "cog_attachment_type"], $t = ["独占型", "依存型", "妄想型", "监视型", "自伤型", "排除型"], mt = ["typical", "depression", "anxiety", "bpd", "alexithymia"], ie = [
      "independent",
      "interchanging",
      "cognitive_determinism",
      "weak_whorf",
      "thinking_for_speaking",
      "radical_connectionism",
      "determinism"
    ], Kt = ["0 · egocentric", "1 · subjective", "2 · self-reflective", "3 · mutual", "4 · societal-symbolic"], ne = dt({
      get: () => `${Number(m.value.cog_social_stage ?? 2)} · ${["egocentric", "subjective", "self-reflective", "mutual", "societal-symbolic"][Number(m.value.cog_social_stage ?? 2)] || "self-reflective"}`,
      set: (p) => {
        m.value.cog_social_stage = Number(String(p).split("·")[0].trim());
      }
    });
    function Ue(p) {
      return String(c.value.settings?.[p] ?? Y[p] ?? "");
    }
    function Te() {
      const p = {};
      for (const [s, u] of Object.entries(Y)) {
        const E = Ue(s) || u;
        p[s] = qt.includes(s) ? E === "1" : Ve.includes(s) ? E : Number(E);
      }
      return p;
    }
    function fe() {
      const p = {};
      for (const [s, u] of Object.entries(Y)) {
        const E = m.value[s];
        qt.includes(s) ? p[s] = E ? "1" : "0" : p[s] = String(E ?? u);
      }
      return p;
    }
    const g = dt(() => c.value.cognition || null), z = dt(() => g.value?.last_control || null), H = dt(() => g.value?.wave1 || null), it = dt(() => g.value?.wave2 || null), yt = dt(() => g.value?.wave3 || null), Fe = dt(() => g.value?.wave4a || null), wt = dt(() => g.value?.wave4b || null), Ut = dt(() => g.value?.persona || null), C = dt(() => g.value?.attachment || null), Ft = dt(() => it.value?.episode || null), I = (p) => ({ euthymic: "平稳", subthreshold: "下滑中", episode: "低落发作" })[p] || "—";
    function rt(p, s) {
      Object.assign(m.value, p), Oe().then(() => tt(`已套用并保存「${s}」`));
    }
    const Mt = [
      { label: "常规", fields: { cog_affect_enabled: !0, cog_affect_profile: "typical", cog_affect_threat: 0.2, cog_affect_reward: 1, cog_attachment_enabled: !1 } },
      { label: "抑郁倾向", fields: { cog_affect_enabled: !0, cog_affect_profile: "depression", cog_affect_threat: 0.45, cog_affect_reward: 0.7 } },
      { label: "病娇·独占", fields: { cog_affect_enabled: !0, cog_affect_profile: "depression", cog_attachment_enabled: !0, cog_attachment_type: "独占型" } },
      { label: "病娇·依存", fields: { cog_affect_enabled: !0, cog_attachment_enabled: !0, cog_attachment_type: "依存型" } },
      { label: "病娇·妄想", fields: { cog_affect_enabled: !0, cog_affect_profile: "depression", cog_attachment_enabled: !0, cog_attachment_type: "妄想型" } }
    ], Lt = dt(() => g.value?.wave2?.somatic_channels || null), ct = (p) => ({
      fatigue: "疲劳",
      pain: "疼痛",
      cardiorespiratory: "心慌",
      gastrointestinal: "胃肠",
      dizziness: "头晕",
      sleep: "睡眠"
    })[p] || p, X = (p) => Math.max(0.02, Math.min(1, Number(p))).toFixed(3), W = dt(() => {
      const p = Ut.value?.evidence || {};
      return Object.entries(p).map(([s, u]) => `${s}(${u.join("、")})`).join("；");
    });
    function nt(p, s = 3) {
      return p == null || p === "" ? "—" : Number(p).toFixed(s);
    }
    const Zt = dt(() => (c.value.timeline || []).filter((p) => p.topic === "世界").slice(0, 30)), He = dt(() => c.value.commitments || []), We = dt(() => c.value.user_model || []), je = dt(() => Object.entries(c.value.values || {}).map(([p, s]) => ({ k: p, v: Number(s) })).sort((p, s) => Math.abs(s.v) - Math.abs(p.v)).slice(0, 20));
    function oe(p) {
      try {
        const s = JSON.parse(p || "[]");
        return Array.isArray(s) ? s : [];
      } catch {
        return [];
      }
    }
    const m = J({}), Ge = J("off"), Li = [{ value: "off", label: "关闭" }, { value: "texture", label: "纹理（只记录）" }, { value: "full", label: "完整（可主动提及）" }], ke = J("fictional"), _e = J(""), se = J(""), qe = J(""), Ce = J(""), pe = J(""), Me = J(""), Se = J(""), Bt = J(!1), $e = J(!1), si = [{ value: "fictional", label: "虚构" }, { value: "real", label: "真实" }], Nt = dt(() => c.value.worldview || null), D = dt(() => Nt.value?.map || { locations: [], edges: [], actors: [], width: 1e3, height: 700, title: "" }), Xi = dt(() => Nt.value?.actor_locations || {}), Pi = ["home", "work", "shop", "food", "park", "transit", "other"], Ti = { home: "家", work: "工作", shop: "商店", food: "餐饮", park: "公园", transit: "交通", other: "其他" }, ki = { home: "#e07a5f", work: "#5b8def", shop: "#e0a23d", food: "#57a773", park: "#3faead", transit: "#8b6fd6", other: "#8a94a6" }, Ci = dt(() => Pi.filter((p) => (D.value.locations || []).some((s) => (s.kind || "other") === p)));
    function bt(p) {
      const s = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
      return String(p ?? "").replace(/[&<>"']/g, (u) => s[u]);
    }
    const ze = J(null), Ee = J(!1);
    let et = null, O = null, ai = "";
    const ri = ["#2b4250", "#33495a", "#2f4a44", "#3a4258", "#463f4f", "#3d4a3a", "#4a4436", "#39485c"], li = ["#dfe4ea", "#d6dce4", "#e6eaf0", "#cfd7e0"];
    let me = "";
    const ve = J("city"), ge = {};
    function ui(p, s, u) {
      (ge[p] || (ge[p] = [])).push({ layer: s, base: u });
    }
    function Jt(p) {
      me = me === p ? "" : p;
      for (const [s, u] of Object.entries(ge)) {
        const E = s === me;
        for (const { layer: M, base: R } of u)
          M.setStyle && M.setStyle({ ...R, weight: (R.weight || 2) + (E ? 3.5 : 0), opacity: E ? 1 : R.opacity ?? 1 }), E && M.bringToFront && M.bringToFront();
      }
    }
    function Qi() {
      me = "", Ke(!1);
    }
    function tn() {
      ve.value = ve.value === "city" ? "nation" : "city", Ke(!1);
    }
    function ye() {
      return { w: D.value.width || 1e3, h: D.value.height || 700 };
    }
    function St(p, s) {
      return [ye().h - s, p];
    }
    function Rt(p, s) {
      return S.divIcon({ className: "wm-route", html: `<span class="wm-route-inner" style="--c:${s}">${bt(p)}</span>`, iconSize: [0, 0], iconAnchor: [0, 0] });
    }
    function en(p, s) {
      return S.divIcon({ className: "wm-route wm-minor", html: `<span class="wm-route-inner" style="--c:${s}">${bt(p)}</span>`, iconSize: [0, 0], iconAnchor: [0, 0] });
    }
    function nn(p, s) {
      return S.divIcon({ className: "wm-route wm-station", html: `<span class="wm-route-inner" style="--c:${s}">${bt(p)}</span>`, iconSize: [0, 0], iconAnchor: [0, 0] });
    }
    function It(p) {
      const s = [], u = [];
      for (const E of p) {
        const M = String(E.text).length * 13 + 20, R = 22;
        s.some((V) => Math.abs(V.x - E.x) < (V.w + M) / 2 && Math.abs(V.y - E.y) < (V.h + R) / 2) || (s.push({ x: E.x, y: E.y, w: M, h: R }), u.push(E));
      }
      return u;
    }
    function P() {
      const p = D.value.kind === "real" ? "real" : "fictional";
      if (et && ai !== p && (et.remove(), et = null, O = null), !(et || !ze.value)) {
        if (p === "real") {
          Ee.value = !1, et = S.map(ze.value, { zoomControl: !0, attributionControl: !0 }).setView([35, 105], 5);
          const s = S.tileLayer(Nl, { subdomains: ["1", "2", "3", "4"], maxZoom: 19, minZoom: 3, attribution: "© 高德地图" });
          s.on("tileerror", () => {
            Ee.value = !0;
          }), s.on("load", () => {
            Ee.value = !1;
          }), s.addTo(et);
        } else {
          Ee.value = !1;
          const { w: s, h: u } = ye();
          et = S.map(ze.value, { crs: S.CRS.Simple, zoomControl: !0, attributionControl: !1, minZoom: -3, maxZoom: 3 }).setView([u / 2, s / 2], -1.5);
          for (const [M, R] of [["pWater", 350], ["pParks", 360], ["pBlocks", 370], ["pRoads", 380], ["pMetro", 400], ["pBus", 410], ["pLabels", 620]])
            et.createPane(M), et.getPane(M).style.zIndex = String(R);
          const E = () => et.getContainer().classList.toggle("wm-zoom-low", et.getZoom() < 0);
          et.on("zoomend", E), setTimeout(E, 0);
        }
        ai = p, O = S.layerGroup().addTo(et);
      }
    }
    function Ke(p = !1) {
      if (!et || !O) return;
      O.clearLayers();
      for (const M of Object.keys(ge)) delete ge[M];
      me = "";
      const s = D.value.locations || [];
      if (!s.length) return;
      const u = ai !== "real", E = {};
      for (const M of s) E[M.id] = M;
      if (u) {
        const { w: M, h: R } = ye(), b = (_) => _.map((y) => St(y[0], y[1])), V = D.value.nation;
        if (ve.value === "nation" && V) {
          S.rectangle([[0, 0], [R, M]], { pane: "pWater", stroke: !1, fillColor: "#d9e6f0", fillOpacity: 1 }).addTo(O), S.polygon(b(V.land), { pane: "pWater", color: "#8fbfe6", weight: 1.5, fillColor: "#f4efe1", fillOpacity: 1 }).addTo(O), (V.provinces || []).forEach((_, y) => {
            S.polygon(b(_.points), { pane: "pParks", color: "#c9b98f", weight: 1, fillColor: y % 2 ? "#ece2c8" : "#e4d7b4", fillOpacity: 0.55 }).addTo(O), S.marker(b([_.label])[0], { pane: "pLabels", interactive: !1, icon: Rt(_.name, "#8a7a5c") }).addTo(O);
          }), (V.routes || []).forEach((_) => S.polyline(b(_.points), { pane: "pRoads", color: "#b98a4a", weight: 2.5, dashArray: "2 7" }).addTo(O)), (V.cities || []).forEach((_) => {
            const y = St(_.x, _.y);
            S.circleMarker(y, { pane: "pLabels", radius: _.capital ? 9 : 6, color: "#ffffff", weight: 2, fillColor: _.capital ? "#d64545" : "#3a6ea5", fillOpacity: 1 }).bindPopup(bt(_.name)).addTo(O), S.marker(y, { pane: "pLabels", interactive: !1, icon: Rt(_.name, _.capital ? "#d64545" : "#3a6ea5") }).addTo(O);
          }), et.fitBounds([[0, 0], [R, M]], { padding: [6, 6] });
          return;
        }
        S.rectangle([[0, 0], [R, M]], { pane: "pWater", stroke: !1, fillColor: "#eef1f4", fillOpacity: 1 }).addTo(O), (D.value.compounds || []).forEach((_) => {
          S.polygon(b(_.points), { pane: "pParks", color: "#c9b98f", weight: 1.2, dashArray: "7 5", fillColor: "#f3ead0", fillOpacity: 0.5 }).addTo(O), S.marker(b(_.points)[0], { pane: "pLabels", interactive: !1, icon: Rt(_.name, "#a9884a") }).addTo(O);
        }), (D.value.lakes || []).forEach((_) => {
          S.polygon(b(_.points), { pane: "pWater", color: "#8fbfe6", weight: 1.5, fillColor: "#bcd9f0", fillOpacity: 1 }).addTo(O), _.name && _.name !== "" && S.marker(St(_.label[0], _.label[1]), { pane: "pLabels", interactive: !1, icon: Rt(_.name, "#3d7fb5") }).addTo(O);
        }), (D.value.rivers || []).forEach((_) => {
          S.polyline(b(_.points), { pane: "pWater", color: "#8fbfe6", weight: 16, lineCap: "round", lineJoin: "round" }).addTo(O), S.polyline(b(_.points), { pane: "pWater", color: "#bcd9f0", weight: 11, lineCap: "round", lineJoin: "round" }).addTo(O), _.name && _.name !== "" && S.marker(b(_.points)[Math.floor(_.points.length / 2)], { pane: "pLabels", interactive: !1, icon: Rt(_.name, "#3d7fb5") }).addTo(O);
        }), (D.value.parks || []).forEach((_) => {
          S.polygon(b(_.points), { pane: "pParks", color: "#a9d3a0", weight: 1, fillColor: "#c9e6c4", fillOpacity: 1 }).addTo(O), (_.trees || []).forEach((y) => S.circleMarker(St(y[0], y[1]), { pane: "pParks", radius: 2.6, stroke: !1, fillColor: "#82bd79", fillOpacity: 1 }).addTo(O)), _.name && _.name !== "公园" && S.marker(b(_.points)[0], { pane: "pLabels", interactive: !1, icon: Rt(_.name, "#5a9e52") }).addTo(O);
        });
        const Ie = [];
        (D.value.blocks || []).forEach((_) => {
          const y = b(_.points);
          if (S.polygon(y.map((A) => [A[0] - 3, A[1] + 3]), { pane: "pBlocks", stroke: !1, fillColor: "#5b6b7a", fillOpacity: 0.16 }).addTo(O), S.polygon(y, { pane: "pBlocks", color: "#b9c3cd", weight: 1, fillColor: li[(_.shade || 0) % li.length], fillOpacity: 1 }).addTo(O), _.tower) {
            const A = y.reduce((lt, $) => lt + $[0], 0) / y.length, ft = y.reduce((lt, $) => lt + $[1], 0) / y.length;
            S.polygon(
              y.map((lt) => [A + (lt[0] - A) * 0.5, ft + (lt[1] - ft) * 0.5]),
              { pane: "pBlocks", color: "#aab4c0", weight: 1, fillColor: "#eef2f6", fillOpacity: 1 }
            ).addTo(O);
          }
          if (_.name) {
            const A = _.points.reduce((lt, $) => lt + $[0], 0) / _.points.length, ft = _.points.reduce((lt, $) => lt + $[1], 0) / _.points.length;
            Ie.push({ x: A, y: ft, text: _.name, color: _.tower ? "#6b5b8a" : "#7a8794" });
          }
        }), (D.value.named_buildings || []).forEach((_) => {
          S.circleMarker(St(_.x, _.y), { pane: "pLabels", radius: 4, color: "#ffffff", weight: 1.5, fillColor: "#8a5a2b", fillOpacity: 1 }).addTo(O), S.marker(St(_.x, _.y), { pane: "pLabels", interactive: !1, icon: Rt(_.name, "#8a5a2b") }).addTo(O);
        });
        for (const _ of It(Ie))
          S.marker(St(_.x, _.y), { pane: "pLabels", interactive: !1, icon: en(_.text, _.color) }).addTo(O);
        const ae = {
          highway: { casing: 13, fill: 6.5, color: "#f08c2e" },
          arterial: { casing: 10, fill: 4.5, color: "#f7cf8a" },
          street: { casing: 5, fill: 2.4, color: "#ffffff" }
        };
        (D.value.streets || []).forEach((_) => {
          const y = ae[_.kind] || ae.street, A = b(_.points);
          S.polyline(A, { pane: "pRoads", color: "#ffffff", weight: y.casing, lineCap: "round", lineJoin: "round" }).addTo(O), S.polyline(A, { pane: "pRoads", color: y.color, weight: y.fill, lineCap: "round", lineJoin: "round" }).addTo(O);
        }), (D.value.roads || []).forEach((_, y) => {
          if (!_.name) return;
          const A = b(_.points), ft = "road:" + y;
          S.polyline(A, { pane: "pRoads", color: "#ffffff", weight: 11, lineCap: "round", lineJoin: "round" }).addTo(O);
          const lt = { pane: "pRoads", color: "#f6c56b", weight: 5, opacity: 1, lineCap: "round", lineJoin: "round" };
          ui(ft, S.polyline(A, lt).on("click", () => Jt(ft)).addTo(O), lt), S.marker(A[Math.floor(A.length / 2)], { pane: "pLabels", interactive: !0, icon: Rt(_.name, "#9a8358") }).on("click", () => Jt(ft)).addTo(O);
        }), (D.value.districts || []).forEach((_, y) => {
          S.circle(St(_.x, _.y), { pane: "pRoads", radius: _.r || 200, color: "#93a2b0", weight: 1, dashArray: "4 7", fillColor: ri[y % ri.length], fillOpacity: 0.08 }).addTo(O), S.marker(St(_.x, _.y), { pane: "pLabels", interactive: !1, icon: S.divIcon({ className: "wm-district", html: `<span class="wm-district-inner">${bt(_.name)}</span>`, iconSize: [0, 0], iconAnchor: [0, 0] }) }).addTo(O);
        });
        const re = [];
        (D.value.metro || []).forEach((_, y) => {
          const A = b(_.points), ft = "metro:" + y;
          S.polyline(A, { pane: "pMetro", color: "#ffffff", weight: 8, lineCap: "round", lineJoin: "round" }).addTo(O);
          const lt = { pane: "pMetro", color: _.color, weight: 4.5, opacity: 0.92, lineCap: "round", lineJoin: "round" };
          ui(ft, S.polyline(A, lt).on("click", () => Jt(ft)).addTo(O), lt), (_.stations || []).forEach(($) => {
            S.circleMarker(St($.x, $.y), { pane: "pMetro", radius: 5, color: "#ffffff", weight: 2.5, fillColor: _.color, fillOpacity: 1 }).bindPopup(bt($.name || _.name)).on("click", () => Jt(ft)).addTo(O), $.name && re.push({ x: $.x, y: $.y, text: $.name, color: _.color });
          }), S.marker(A[Math.floor(A.length / 2)], { pane: "pLabels", interactive: !0, icon: Rt(_.name, _.color) }).on("click", () => Jt(ft)).addTo(O);
        }), (D.value.bus || []).forEach((_, y) => {
          const A = b(_.points), ft = "bus:" + y, lt = { pane: "pBus", color: _.color, weight: 3, opacity: 0.95, dashArray: "7 7", lineCap: "round" };
          ui(ft, S.polyline(A, lt).on("click", () => Jt(ft)).addTo(O), lt), (_.stops || []).forEach(($) => S.circleMarker(St($.x, $.y), { pane: "pBus", radius: 3.2, color: "#ffffff", weight: 1.5, fillColor: _.color, fillOpacity: 1 }).bindPopup(bt($.name || _.name)).on("click", () => Jt(ft)).addTo(O)), S.marker(A[Math.floor(A.length / 2)], { pane: "pLabels", interactive: !0, icon: Rt(_.name, _.color) }).on("click", () => Jt(ft)).addTo(O);
        });
        for (const _ of It(re))
          S.marker(St(_.x, _.y), { pane: "pLabels", interactive: !1, icon: nn(_.text, _.color) }).addTo(O);
      } else
        for (const M of D.value.edges || []) {
          const R = E[M[0]], b = E[M[1]];
          R?.lat != null && b?.lat != null && S.polyline([[R.lat, R.lng], [b.lat, b.lng]], { color: "#5b8def", weight: 3, opacity: 0.55, dashArray: "2 8", lineCap: "round" }).addTo(O);
        }
      for (const M of s) {
        const R = ki[M.kind] || ki.other, b = u ? St(M.x, M.y) : M.lat != null ? [M.lat, M.lng] : null;
        if (!b) continue;
        const V = S.divIcon({
          className: "wm-pin-holder",
          html: `<span class="wm-pin" style="--c:${R}"></span><span class="wm-pin-label">${bt(M.name)}</span>`,
          iconSize: [0, 0],
          iconAnchor: [0, 0]
        });
        S.marker(b, { icon: V }).bindPopup(`<b>${bt(M.name)}</b>${M.desc ? "<br>" + bt(M.desc) : ""}`).addTo(O);
      }
      for (const M of D.value.actors || []) {
        const R = E[Xi.value[M.id] || M.location];
        if (!R) continue;
        const b = u ? St(R.x, R.y) : R.lat != null ? [R.lat, R.lng] : null;
        if (!b) continue;
        const V = S.divIcon({
          className: "wm-actor-holder",
          html: `<span class="wm-actor-badge">${bt((M.name || "?").slice(0, 1))}</span><span class="wm-actor-name">${bt(M.name)}</span>`,
          iconSize: [0, 0],
          iconAnchor: [0, 0]
        });
        S.marker(b, { icon: V }).bindPopup(`${bt(M.name)} · ${bt(R.name)}`).addTo(O);
      }
      if (!p)
        if (u) {
          const { w: M, h: R } = ye();
          et.fitBounds([[0, 0], [R, M]], { padding: [0, 0] });
        } else {
          const M = s.filter((R) => R.lat != null).map((R) => [R.lat, R.lng]);
          M.length > 1 ? et.fitBounds(M, { padding: [56, 56], maxZoom: 15 }) : M.length === 1 && et.setView(M[0], 14);
        }
    }
    oi([F, () => c.value.worldview], async () => {
      F.value === "world" && (await xi(), P(), Ke(), et && setTimeout(() => et.invalidateSize(), 80));
    }), wo(() => {
      et && (et.remove(), et = null, O = null);
    });
    function Mi() {
      m.value = { ...Te() }, Ge.value = String(c.value.settings?.world_density || "off"), ke.value = String(c.value.settings?.world_fictional || "fictional"), _e.value = String(c.value.settings?.world_country || ""), se.value = String(c.value.settings?.world_city || ""), qe.value = String(c.value.settings?.world_district || ""), Ce.value = String(c.value.settings?.world_premise || ""), pe.value = String(c.value.settings?.persona_text || ""), Me.value = String(c.value.settings?.world_actors || ""), Se.value = String(c.value.settings?.world_places || "");
    }
    async function Oe() {
      const p = {
        ...fe(),
        world_density: Ge.value,
        world_fictional: ke.value,
        world_country: _e.value,
        world_city: se.value,
        world_district: qe.value,
        world_premise: Ce.value,
        world_actors: Me.value,
        world_places: Se.value,
        persona_text: pe.value
      }, s = await Ct("settings_set", { settings: p });
      s?.rejected?.length ? tt(`已保存，忽略无效项：${s.rejected.join("、")}`) : tt("设置已保存");
    }
    async function Si() {
      if (!(Bt.value || !await ce({
        title: "✦ AI 重写设定",
        message: "这会用模型结果覆盖上面的 国家 / 城市 / 前言 / 演员 / 地点 等设定。只想更新地图，请用「只生成地图（保留设定）」",
        confirmLabel: "覆盖并生成",
        danger: !0
      }))) {
        Bt.value = !0;
        try {
          (await Ct("world_generate", { instructions: "" }))?.worldview && tt("已由 AI 完善世界观并生成地图");
        } finally {
          Bt.value = !1;
        }
      }
    }
    async function hi() {
      if (!Bt.value) {
        Bt.value = !0;
        try {
          (await Ct("world_map_generate", { instructions: "" }))?.worldview && tt("已按当前设定重新生成地图（设定未改动）");
        } finally {
          Bt.value = !1;
        }
      }
    }
    async function zi() {
      if (!await ce({
        title: "清除世界事件",
        message: "会删除时间线里所有「世界」事件、世界触发的主动消息与相关记忆，并重置世界状态（演员位置等）。此操作不可撤销。",
        confirmLabel: "清除",
        danger: !0
      })) return;
      await Ct("world_clear", {}) && tt("已清除世界事件并重置世界状态");
    }
    async function we() {
      if (!(!await ce({
        title: "重置整个人",
        message: `这是唯一一次可以「重来」的操作——日常里删除一条记忆或撤回一句话都是不可逆的。

会清空：全部记忆与本地备份、关系与亲密度、承诺、目标与进展日志、未完成话题、用户画像与用户模型、价值取向、人设演化、日记与梦境、每日复盘、技能与常用表达、社交节点与边、群内关系、时间线与见闻、主动消息与回执，以及认知内核（自我叙事、互惠关系、情感历史、学到的价值表）。

会保留：你自己的设置（限额、端点、群策略、日历规则）。

此操作不可撤销。`,
        confirmLabel: "继续",
        danger: !0
      }) || !await ce({
        title: "再确认一次",
        message: "真的要把这个人恢复到出厂状态吗？之后他不会再记得发生过的任何事。",
        confirmLabel: "重置整个人",
        danger: !0
      }))) {
        $e.value = !0;
        try {
          await Ct("reset_person", {}), tt("已重置整个人"), await _t();
        } finally {
          $e.value = !1;
        }
      }
    }
    const Ze = () => ({ name: "", avatar: "", birthDate: "", description: "", personality: "", greeting: "", customPrompt: "" }), st = J(Ze()), di = J(!1);
    function Ei() {
      return globalThis.__0KAY_HOST__;
    }
    function Oi() {
      const p = Ei();
      if (p?.getPersona) {
        st.value = { ...Ze(), ...p.getPersona() || {} };
        return;
      }
      try {
        const s = JSON.parse(localStorage.getItem("0kay_config") || "{}");
        st.value = { ...Ze(), ...s.persona || {} };
      } catch {
        st.value = Ze();
      }
    }
    const Q = J(null), Je = J(!1), Ye = ["typical", "depression", "anxiety", "bpd", "alexithymia"], on = ["独占型", "依存型", "妄想型", "监视型", "自伤型", "排除型"];
    function Zi() {
      return { text: [st.value.description, st.value.personality].filter((p) => String(p || "").trim()).join(`
`) };
    }
    oi(() => [st.value.description, st.value.personality, st.value.customPrompt], () => {
      Q.value = null;
    }), oi(() => Q.value?.attachment?.type, (p) => {
      const s = Q.value?.attachment;
      if (!(!p || !s)) {
        (!s.initial || typeof s.initial != "object") && (s.initial = {});
        for (const [u, E] of Object.entries({ A: 0.05, Am: 0, Tr: 0.5, J: 0, X: 0.05, S: 0.6, O: 0 }))
          s.initial[u] == null && (s.initial[u] = E);
      }
    });
    async function sn() {
      const p = Zi();
      if (!p.text.trim()) {
        tt("请先填写「描述」或「性格」");
        return;
      }
      Je.value = !0;
      try {
        const s = await Ct("persona_analyze", p);
        s && (Q.value = s, tt(s.source === "llm" ? "已由模型理解，请核对/微调参数" : "模型不可用，已用本地词典理解，请核对"));
      } finally {
        Je.value = !1;
      }
    }
    async function an() {
      if (!Q.value) {
        tt("请先点「LLM 理解」并核对参数，再保存");
        return;
      }
      di.value = !0;
      try {
        const p = Zi();
        if (!await Ct("persona_apply", {
          text: p.text,
          traits: Q.value.traits || {},
          attachment: Q.value.attachment || {}
        })) return;
        const u = Ei();
        if (u?.setPersona)
          u.setPersona({ ...st.value }), u.saveConfig?.();
        else {
          const E = JSON.parse(localStorage.getItem("0kay_config") || "{}");
          E.persona = { ...E.persona || {}, ...st.value }, localStorage.setItem("0kay_config", JSON.stringify(E));
        }
        tt("人设与参数已保存");
      } finally {
        di.value = !1;
      }
    }
    return Sn(Oi), oi(F, (p) => {
      p === "persona" && Oi();
    }), Sn(_t), (p, s) => (T(), k(Tt, null, [
      a("main", {
        class: "pcp",
        ref_key: "pageEl",
        ref: Gt
      }, [
        a("header", As, [
          a("div", Bs, [
            s[66] || (s[66] = a("div", { class: "hero-copy" }, [
              a("p", { class: "eyebrow" }, [
                a("b", null, "◉"),
                te(" L.I.F.E / COGNITION")
              ]),
              a("h1", null, "陪伴面板 · 认知内核"),
              a("p", { class: "sub" }, "五套认知回路（决策仲裁 / 情感生理 / 语言习得 / 社会学习 / 自我与时间）。它们始终在后台记录状态；只有打开对应的「调节」开关，状态才会写进提示词。全部关闭时行为与旧版完全一致。")
            ], -1)),
            a("div", Ns, [
              a("button", {
                class: "fab",
                disabled: Et.value,
                onClick: Oe
              }, [...s[65] || (s[65] = [
                a("span", { class: "fab-ic" }, "✦", -1),
                te("保存设置", -1)
              ])], 8, Rs),
              a("button", {
                class: "btn tonic",
                disabled: Et.value,
                onClick: _t
              }, v(Et.value ? "刷新中…" : "刷新"), 9, Ds)
            ])
          ]),
          a("div", Vs, [
            a("span", {
              class: Pe(["pill", { bad: g.value && !g.value.enabled }])
            }, "认知内核 " + v(g.value?.available === !1 ? "不可用" : g.value?.enabled ? "运行中" : "已停止"), 3),
            a("span", Us, "已决策 " + v(H.value?.turns ?? 0) + " 轮", 1),
            a("span", Fs, "情景痕迹 " + v(H.value?.engrams ?? 0), 1),
            a("span", Hs, "词汇量 " + v(yt.value?.lexicon_size ?? 0), 1)
          ])
        ]),
        G.value ? (T(), k("p", Ws, v(G.value), 1)) : K("", !0),
        At.value ? (T(), k("p", js, v(At.value), 1)) : K("", !0),
        a("nav", Gs, [
          (T(), k(Tt, null, jt(N, (u) => a("button", {
            key: u.key,
            class: Pe(["tab", { active: F.value === u.key }]),
            onClick: (E) => ht(u.key)
          }, [
            a("i", null, v(u.i), 1),
            a("span", $s, v(u.icon), 1),
            te(v(u.label), 1)
          ], 10, qs)), 64))
        ]),
        x(a("section", Ks, [
          a("div", Js, [
            s[67] || (s[67] = a("div", null, [
              a("h2", null, "人设"),
              a("p", { class: "desc" }, "角色的名字、描述与性格。描述 + 性格是模型读取人设的全部来源：它同时驱动情绪画像、依恋动力学（病娇）的型别与初始值、以及抑郁倾向。改完文字后必须先用「LLM 理解」解析成参数、核对微调，才能保存。")
            ], -1)),
            a("div", Ys, [
              a("button", {
                class: "btn tonic sm",
                disabled: Je.value || Et.value,
                onClick: sn
              }, v(Je.value ? "理解中…" : "LLM 理解"), 9, Xs),
              a("button", {
                class: "btn filled sm",
                disabled: di.value || !Q.value,
                onClick: an
              }, "保存人设", 8, Qs)
            ])
          ]),
          a("article", ta, [
            a("div", ea, [
              a("label", null, [
                s[68] || (s[68] = a("span", null, "名字", -1)),
                x(a("input", {
                  "onUpdate:modelValue": s[0] || (s[0] = (u) => st.value.name = u),
                  class: "field"
                }, null, 512), [
                  [j, st.value.name]
                ])
              ]),
              a("label", null, [
                s[69] || (s[69] = a("span", null, "头像 URL", -1)),
                x(a("input", {
                  "onUpdate:modelValue": s[1] || (s[1] = (u) => st.value.avatar = u),
                  class: "field"
                }, null, 512), [
                  [j, st.value.avatar]
                ])
              ]),
              a("label", null, [
                s[70] || (s[70] = a("span", null, "生日", -1)),
                x(a("input", {
                  "onUpdate:modelValue": s[2] || (s[2] = (u) => st.value.birthDate = u),
                  type: "date",
                  class: "field"
                }, null, 512), [
                  [j, st.value.birthDate]
                ])
              ])
            ]),
            a("label", ia, [
              s[71] || (s[71] = a("span", null, "描述", -1)),
              x(a("textarea", {
                "onUpdate:modelValue": s[3] || (s[3] = (u) => st.value.description = u),
                rows: "3",
                class: "field"
              }, null, 512), [
                [j, st.value.description]
              ])
            ]),
            a("label", na, [
              s[72] || (s[72] = a("span", null, "性格", -1)),
              x(a("textarea", {
                "onUpdate:modelValue": s[4] || (s[4] = (u) => st.value.personality = u),
                rows: "3",
                class: "field"
              }, null, 512), [
                [j, st.value.personality]
              ])
            ]),
            a("label", oa, [
              s[73] || (s[73] = a("span", null, "问候语", -1)),
              x(a("textarea", {
                "onUpdate:modelValue": s[5] || (s[5] = (u) => st.value.greeting = u),
                rows: "2",
                class: "field"
              }, null, 512), [
                [j, st.value.greeting]
              ])
            ]),
            a("label", sa, [
              s[74] || (s[74] = a("span", null, "自定义提示词（作为 system 提示逐字发送）", -1)),
              x(a("textarea", {
                "onUpdate:modelValue": s[6] || (s[6] = (u) => st.value.customPrompt = u),
                rows: "5",
                class: "field"
              }, null, 512), [
                [j, st.value.customPrompt]
              ])
            ]),
            s[75] || (s[75] = a("p", { class: "hint" }, "填写/修改「描述」或「性格」后，先点右上角「LLM 理解」：模型会把文字解析成下面的参数，你核对或微调后「保存人设」才会写回；改了文字需要重新理解。", -1))
          ]),
          Q.value ? (T(), k("article", aa, [
            a("h3", null, [
              s[76] || (s[76] = te("解析参数 ", -1)),
              a("span", ra, v(Q.value.source === "llm" ? "模型理解" : "本地词典"), 1)
            ]),
            a("div", la, [
              a("label", null, [
                s[77] || (s[77] = a("span", null, "威胁基线", -1)),
                x(a("input", {
                  "onUpdate:modelValue": s[7] || (s[7] = (u) => Q.value.traits.threat_baseline = u),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    j,
                    Q.value.traits.threat_baseline,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              a("label", null, [
                s[78] || (s[78] = a("span", null, "奖赏基线", -1)),
                x(a("input", {
                  "onUpdate:modelValue": s[8] || (s[8] = (u) => Q.value.traits.reward_baseline = u),
                  type: "number",
                  step: "0.1",
                  min: "0",
                  max: "2",
                  class: "field tiny"
                }, null, 512), [
                  [
                    j,
                    Q.value.traits.reward_baseline,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              a("label", null, [
                s[79] || (s[79] = a("span", null, "灾难化", -1)),
                x(a("input", {
                  "onUpdate:modelValue": s[9] || (s[9] = (u) => Q.value.traits.catastrophizing = u),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    j,
                    Q.value.traits.catastrophizing,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              a("label", null, [
                s[80] || (s[80] = a("span", null, "情绪调节画像", -1)),
                ee(Le, {
                  modelValue: Q.value.traits.erq_profile,
                  "onUpdate:modelValue": s[10] || (s[10] = (u) => Q.value.traits.erq_profile = u),
                  options: Ye,
                  "aria-label": "情绪调节画像"
                }, null, 8, ["modelValue"])
              ]),
              a("label", null, [
                s[81] || (s[81] = a("span", null, "作息（睡眠小时 0-23）", -1)),
                x(a("input", {
                  "onUpdate:modelValue": s[11] || (s[11] = (u) => Q.value.traits.sleep_hour = u),
                  type: "number",
                  min: "0",
                  max: "23",
                  class: "field tiny"
                }, null, 512), [
                  [
                    j,
                    Q.value.traits.sleep_hour,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ])
            ]),
            a("div", ua, [
              a("label", null, [
                s[82] || (s[82] = a("span", null, "依恋型别（病娇，留空=不启用）", -1)),
                ee(Le, {
                  modelValue: Q.value.attachment.type,
                  "onUpdate:modelValue": s[12] || (s[12] = (u) => Q.value.attachment.type = u),
                  options: ["", ...on],
                  "aria-label": "依恋型别"
                }, null, 8, ["modelValue", "options"])
              ]),
              Q.value.attachment.type ? (T(), k(Tt, { key: 0 }, [
                a("label", null, [
                  s[83] || (s[83] = a("span", null, "初始焦虑 X", -1)),
                  x(a("input", {
                    "onUpdate:modelValue": s[13] || (s[13] = (u) => Q.value.attachment.initial.X = u),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      j,
                      Q.value.attachment.initial.X,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                a("label", null, [
                  s[84] || (s[84] = a("span", null, "初始安全感 S", -1)),
                  x(a("input", {
                    "onUpdate:modelValue": s[14] || (s[14] = (u) => Q.value.attachment.initial.S = u),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      j,
                      Q.value.attachment.initial.S,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ])
              ], 64)) : K("", !0)
            ]),
            s[85] || (s[85] = a("p", { class: "hint" }, "文字只是来源，真正保存进 LIFE 的是这里调好的数值。想更贴合「病娇常伴抑郁」，把情绪调节画像设为 depression。", -1))
          ])) : K("", !0)
        ], 512), [
          [Ji, F.value === "persona"]
        ]),
        x(a("section", ha, [
          a("div", { class: "section-head" }, [
            s[86] || (s[86] = a("div", null, [
              a("h2", null, "认知内核"),
              a("p", { class: "desc" }, "实时状态与全部参数。改动后点右上角「保存设置」才会生效。")
            ], -1)),
            a("div", { class: "head-actions" }, [
              a("button", {
                class: "btn filled sm",
                onClick: Oe
              }, "保存设置")
            ])
          ]),
          a("article", da, [
            a("h3", null, [
              s[87] || (s[87] = te("实时状态 ", -1)),
              a("span", {
                class: Pe(["count-pill", { ok: g.value?.enabled }])
              }, v(g.value?.enabled ? "运行中" : "已停止"), 3)
            ]),
            g.value ? (T(), k("div", fa, [
              a("div", _a, [
                s[88] || (s[88] = a("span", null, "仲裁模式", -1)),
                a("strong", null, v(z.value?.mode || "—"), 1)
              ]),
              a("div", pa, [
                s[89] || (s[89] = a("span", null, "本轮策略", -1)),
                a("strong", null, v(z.value?.action || "—"), 1)
              ]),
              a("div", ma, [
                s[90] || (s[90] = a("span", null, "控制需求", -1)),
                a("strong", null, v(nt(z.value?.need)), 1)
              ]),
              a("div", va, [
                s[91] || (s[91] = a("span", null, "置信度", -1)),
                a("strong", null, v(nt(z.value?.confidence)), 1)
              ]),
              a("div", ga, [
                s[92] || (s[92] = a("span", null, "已决策轮数", -1)),
                a("strong", null, v(H.value?.turns ?? 0), 1)
              ]),
              a("div", ya, [
                s[93] || (s[93] = a("span", null, "情景痕迹", -1)),
                a("strong", null, v(H.value?.engrams ?? 0), 1)
              ]),
              a("div", wa, [
                s[94] || (s[94] = a("span", null, "模型可靠性", -1)),
                a("strong", null, v(nt(H.value?.reliability)), 1)
              ]),
              a("div", ba, [
                s[95] || (s[95] = a("span", null, "心境", -1)),
                a("strong", null, v(nt(it.value?.mood)), 1)
              ]),
              a("div", xa, [
                s[96] || (s[96] = a("span", null, "迷走张力", -1)),
                a("strong", null, v(nt(it.value?.vagal_tone)), 1)
              ]),
              a("div", La, [
                s[97] || (s[97] = a("span", null, "躯体化指数", -1)),
                a("strong", null, v(nt(it.value?.somatization_index)), 1)
              ]),
              a("div", Pa, [
                s[98] || (s[98] = a("span", null, "健康焦虑", -1)),
                a("strong", null, v(nt(it.value?.health_anxiety)), 1)
              ]),
              a("div", Ta, [
                s[99] || (s[99] = a("span", null, "躯体负担", -1)),
                a("strong", null, v(nt(it.value?.somatic_burden)), 1)
              ]),
              a("div", ka, [
                s[100] || (s[100] = a("span", null, "人设特质", -1)),
                a("strong", null, v(Ut.value?.applied ? Ut.value.source === "llm" ? "已应用 · LLM" : "已应用 · 词典" : "未解析"), 1)
              ]),
              a("div", Ca, [
                s[101] || (s[101] = a("span", null, "词汇量", -1)),
                a("strong", null, v(yt.value?.lexicon_size ?? 0), 1)
              ]),
              a("div", Ma, [
                s[102] || (s[102] = a("span", null, "共情权重", -1)),
                a("strong", null, v(nt(Fe.value?.empathy)), 1)
              ]),
              a("div", Sa, [
                s[103] || (s[103] = a("span", null, "视角阶段", -1)),
                a("strong", null, v(Fe.value?.perspective_name || "—"), 1)
              ]),
              a("div", za, [
                s[104] || (s[104] = a("span", null, "注意状态", -1)),
                a("strong", null, v(wt.value?.attention_state || "—"), 1)
              ]),
              a("div", Ea, [
                s[105] || (s[105] = a("span", null, "耐心", -1)),
                a("strong", null, v(nt(wt.value?.patience)), 1)
              ]),
              C.value?.enabled ? (T(), k(Tt, { key: 0 }, [
                a("div", Oa, [
                  s[106] || (s[106] = a("span", null, "依恋型别", -1)),
                  a("strong", null, v(C.value.label || C.value.type), 1)
                ]),
                a("div", Za, [
                  s[107] || (s[107] = a("span", null, "病度", -1)),
                  a("strong", null, v(nt(C.value.severity, 2)) + " · " + v(C.value.band), 1)
                ]),
                a("div", Ia, [
                  s[108] || (s[108] = a("span", null, "主导倾向", -1)),
                  a("strong", null, v(C.value.dominant || "—"), 1)
                ]),
                a("div", Aa, [
                  s[109] || (s[109] = a("span", null, "依恋压力", -1)),
                  a("strong", null, v(nt(C.value.distress, 2)), 1)
                ]),
                a("div", Ba, [
                  s[110] || (s[110] = a("span", null, "抑郁共病", -1)),
                  a("strong", null, v(nt(C.value.comorbid_depression, 2)), 1)
                ])
              ], 64)) : K("", !0),
              Ft.value ? (T(), k(Tt, { key: 1 }, [
                a("div", Na, [
                  s[111] || (s[111] = a("span", null, "情绪病程", -1)),
                  a("strong", null, v(I(Ft.value.state)), 1)
                ]),
                a("div", Ra, [
                  s[112] || (s[112] = a("span", null, "病程严重度", -1)),
                  a("strong", null, v(nt(Ft.value.severity, 2)), 1)
                ]),
                a("div", Da, [
                  s[113] || (s[113] = a("span", null, "发作 / 复发", -1)),
                  a("strong", null, v(Ft.value.episodes) + " / " + v(Ft.value.relapses), 1)
                ]),
                Ft.value.state === "episode" ? (T(), k("div", Va, [
                  s[114] || (s[114] = a("span", null, "已持续", -1)),
                  a("strong", null, v(nt(Ft.value.days_in_episode, 1)) + " 天", 1)
                ])) : K("", !0)
              ], 64)) : K("", !0)
            ])) : (T(), k("div", ca, "尚无状态数据（刷新后显示）")),
            Ft.value ? (T(), k("p", Ua, " 情绪病程：连续两次评估越过阈值才算「低落发作」，连续两次回落才算「缓解」；缓解期内再次发作计为「复发」。 它由情绪、快感缺失、稳态负荷、反刍、睡眠合成——沉默与慢性压力会把它推高。 ")) : K("", !0),
            C.value?.enabled ? (T(), k("p", Fa, " 依恋动力学已开启：" + v(C.value.label) + "。病度 " + v(nt(C.value.severity, 2)) + "（" + v(C.value.band) + "）由依恋、嫉妒、焦虑、执念等合成； " + v(C.value.safe_mode ? "已进入安全层（只表达情绪、不给伤害方法）。" : "低于 0.85 不会触发安全层。") + " 它与抑郁双向影响：低落会放大不安、依恋压力也会拖累情绪。 ", 1)) : K("", !0),
            Ut.value?.applied ? (T(), k("p", Ha, "人设特质已生效（" + v(Ut.value.source === "llm" ? "LLM 精修" : "本地词典") + "）：" + v(W.value || "—") + "。改人设请到 设置 → 人设，下一条消息自动生效。", 1)) : K("", !0),
            Lt.value ? (T(), k("div", Wa, [
              (T(!0), k(Tt, null, jt(Lt.value, (u, E) => (T(), k("div", {
                key: E,
                class: "som-chan"
              }, [
                a("span", ja, v(ct(E)), 1),
                a("span", Ga, [
                  a("i", {
                    style: Yi({ transform: "scaleX(" + X(u) + ")" })
                  }, null, 4)
                ]),
                a("span", qa, v(nt(u, 2)), 1)
              ]))), 128)),
              Number(it.value?.somatic_chronicity) > 0.1 ? (T(), k("p", $a, "慢性化程度 " + v(nt(it.value?.somatic_chronicity)) + " — 反复报告的通道已开始敏化。", 1)) : K("", !0)
            ])) : K("", !0)
          ]),
          a("article", Ka, [
            s[120] || (s[120] = a("h3", null, "总开关与提示词调节", -1)),
            a("div", Ja, [
              a("label", Ya, [
                x(a("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": s[15] || (s[15] = (u) => m.value.cog_enabled = u)
                }, null, 512), [
                  [pt, m.value.cog_enabled]
                ]),
                s[115] || (s[115] = a("span", null, "启用认知内核", -1))
              ]),
              a("label", Xa, [
                x(a("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": s[16] || (s[16] = (u) => m.value.cog_modulate_affect = u)
                }, null, 512), [
                  [pt, m.value.cog_modulate_affect]
                ]),
                s[116] || (s[116] = a("span", null, "情感影响提示词", -1))
              ]),
              a("label", Qa, [
                x(a("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": s[17] || (s[17] = (u) => m.value.cog_modulate_language = u)
                }, null, 512), [
                  [pt, m.value.cog_modulate_language]
                ]),
                s[117] || (s[117] = a("span", null, "语言影响提示词", -1))
              ]),
              a("label", tr, [
                x(a("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": s[18] || (s[18] = (u) => m.value.cog_modulate_social = u)
                }, null, 512), [
                  [pt, m.value.cog_modulate_social]
                ]),
                s[118] || (s[118] = a("span", null, "社会认知影响提示词", -1))
              ]),
              a("label", er, [
                x(a("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": s[19] || (s[19] = (u) => m.value.cog_modulate_selfhood = u)
                }, null, 512), [
                  [pt, m.value.cog_modulate_selfhood]
                ]),
                s[119] || (s[119] = a("span", null, "自我与时间影响提示词", -1))
              ])
            ])
          ]),
          a("article", ir, [
            s[121] || (s[121] = a("h3", null, "快速预设", -1)),
            s[122] || (s[122] = a("p", { class: "hint" }, '一键套用常见配置并保存（套用后仍可逐项微调）：常规、抑郁倾向、病娇（独占 / 依存 / 妄想）。病娇预设会同时把情绪调节画像设为 depression，贴合"常伴抑郁"。', -1)),
            a("div", nr, [
              (T(), k(Tt, null, jt(Mt, (u) => a("button", {
                key: u.label,
                type: "button",
                class: "btn sm",
                onClick: (E) => rt(u.fields, u.label)
              }, v(u.label), 9, or)), 64))
            ])
          ]),
          a("div", sr, [
            a("article", ar, [
              s[137] || (s[137] = a("h3", null, "决策仲裁（第一波）", -1)),
              a("div", rr, [
                a("label", null, [
                  s[123] || (s[123] = a("span", null, "规划深度", -1)),
                  x(a("input", {
                    "onUpdate:modelValue": s[20] || (s[20] = (u) => m.value.cog_plan_depth = u),
                    type: "number",
                    min: "1",
                    max: "6",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      j,
                      m.value.cog_plan_depth,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                a("label", null, [
                  s[124] || (s[124] = a("span", null, "工作记忆容量", -1)),
                  x(a("input", {
                    "onUpdate:modelValue": s[21] || (s[21] = (u) => m.value.cog_wm_capacity = u),
                    type: "number",
                    min: "1",
                    max: "12",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      j,
                      m.value.cog_wm_capacity,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                a("label", null, [
                  s[125] || (s[125] = a("span", null, "策略温度 τ", -1)),
                  x(a("input", {
                    "onUpdate:modelValue": s[22] || (s[22] = (u) => m.value.cog_tau = u),
                    type: "number",
                    step: "0.05",
                    min: "0.05",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      j,
                      m.value.cog_tau,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                a("label", null, [
                  s[126] || (s[126] = a("span", null, "折扣 γ", -1)),
                  x(a("input", {
                    "onUpdate:modelValue": s[23] || (s[23] = (u) => m.value.cog_gamma = u),
                    type: "number",
                    step: "0.01",
                    min: "0",
                    max: "0.999",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      j,
                      m.value.cog_gamma,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                a("label", null, [
                  s[127] || (s[127] = a("span", null, "习惯学习率", -1)),
                  x(a("input", {
                    "onUpdate:modelValue": s[24] || (s[24] = (u) => m.value.cog_alpha_habit = u),
                    type: "number",
                    step: "0.01",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      j,
                      m.value.cog_alpha_habit,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                a("label", null, [
                  s[128] || (s[128] = a("span", null, "无模型学习率", -1)),
                  x(a("input", {
                    "onUpdate:modelValue": s[25] || (s[25] = (u) => m.value.cog_alpha_mf = u),
                    type: "number",
                    step: "0.01",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      j,
                      m.value.cog_alpha_mf,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                a("label", null, [
                  s[129] || (s[129] = a("span", null, "惊讶阈值 θ_pe", -1)),
                  x(a("input", {
                    "onUpdate:modelValue": s[26] || (s[26] = (u) => m.value.cog_theta_pe = u),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      j,
                      m.value.cog_theta_pe,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                a("label", null, [
                  s[130] || (s[130] = a("span", null, "新颖阈值 θ_n", -1)),
                  x(a("input", {
                    "onUpdate:modelValue": s[27] || (s[27] = (u) => m.value.cog_theta_n = u),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      j,
                      m.value.cog_theta_n,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                a("label", null, [
                  s[131] || (s[131] = a("span", null, "前瞻视野", -1)),
                  x(a("input", {
                    "onUpdate:modelValue": s[28] || (s[28] = (u) => m.value.cog_prospection_horizon = u),
                    type: "number",
                    min: "1",
                    max: "8",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      j,
                      m.value.cog_prospection_horizon,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ])
              ]),
              a("div", lr, [
                a("label", ur, [
                  x(a("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": s[29] || (s[29] = (u) => m.value.cog_use_thalamic_gate = u)
                  }, null, 512), [
                    [pt, m.value.cog_use_thalamic_gate]
                  ]),
                  s[132] || (s[132] = a("span", null, "丘脑门控", -1))
                ]),
                a("label", hr, [
                  x(a("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": s[30] || (s[30] = (u) => m.value.cog_use_cerebellum = u)
                  }, null, 512), [
                    [pt, m.value.cog_use_cerebellum]
                  ]),
                  s[133] || (s[133] = a("span", null, "小脑预测误差", -1))
                ]),
                a("label", dr, [
                  x(a("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": s[31] || (s[31] = (u) => m.value.cog_use_ofc_map = u)
                  }, null, 512), [
                    [pt, m.value.cog_use_ofc_map]
                  ]),
                  s[134] || (s[134] = a("span", null, "OFC 认知地图", -1))
                ]),
                a("label", cr, [
                  x(a("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": s[32] || (s[32] = (u) => m.value.cog_use_prospection = u)
                  }, null, 512), [
                    [pt, m.value.cog_use_prospection]
                  ]),
                  s[135] || (s[135] = a("span", null, "未来奖赏前瞻", -1))
                ]),
                a("label", fr, [
                  x(a("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": s[33] || (s[33] = (u) => m.value.cog_use_limbic_bias = u)
                  }, null, 512), [
                    [pt, m.value.cog_use_limbic_bias]
                  ]),
                  s[136] || (s[136] = a("span", null, "边缘系统偏向", -1))
                ])
              ])
            ]),
            a("article", _r, [
              s[145] || (s[145] = a("h3", null, "情感与生理（第二波）", -1)),
              a("div", pr, [
                a("label", null, [
                  s[138] || (s[138] = a("span", null, "情绪调节画像", -1)),
                  ee(Le, {
                    modelValue: m.value.cog_affect_profile,
                    "onUpdate:modelValue": s[34] || (s[34] = (u) => m.value.cog_affect_profile = u),
                    options: mt,
                    "aria-label": "情绪调节画像"
                  }, null, 8, ["modelValue"])
                ]),
                a("label", null, [
                  s[139] || (s[139] = a("span", null, "迷走基线", -1)),
                  x(a("input", {
                    "onUpdate:modelValue": s[35] || (s[35] = (u) => m.value.cog_affect_vagal = u),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      j,
                      m.value.cog_affect_vagal,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                a("label", null, [
                  s[140] || (s[140] = a("span", null, "威胁基线", -1)),
                  x(a("input", {
                    "onUpdate:modelValue": s[36] || (s[36] = (u) => m.value.cog_affect_threat = u),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      j,
                      m.value.cog_affect_threat,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                a("label", null, [
                  s[141] || (s[141] = a("span", null, "奖赏基线", -1)),
                  x(a("input", {
                    "onUpdate:modelValue": s[37] || (s[37] = (u) => m.value.cog_affect_reward = u),
                    type: "number",
                    step: "0.1",
                    min: "0",
                    max: "2",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      j,
                      m.value.cog_affect_reward,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ])
              ]),
              a("label", mr, [
                x(a("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": s[38] || (s[38] = (u) => m.value.cog_affect_enabled = u)
                }, null, 512), [
                  [pt, m.value.cog_affect_enabled]
                ]),
                s[142] || (s[142] = a("span", null, "启用情感与生理回路", -1))
              ]),
              a("label", vr, [
                x(a("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": s[39] || (s[39] = (u) => m.value.cog_affect_somatic = u)
                }, null, 512), [
                  [pt, m.value.cog_affect_somatic]
                ]),
                s[143] || (s[143] = a("span", null, "启用躯体化网关（人设含体弱、心慌等标记时自动开启）", -1))
              ]),
              a("label", gr, [
                x(a("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": s[40] || (s[40] = (u) => m.value.cog_affect_persona_llm = u)
                }, null, 512), [
                  [pt, m.value.cog_affect_persona_llm]
                ]),
                s[144] || (s[144] = a("span", null, "人设特质由模型理解（改动人设后下一条消息精修一次，失败自动回退本地词典）", -1))
              ])
            ]),
            a("article", yr, [
              s[149] || (s[149] = a("h3", null, "语言习得（第三波）", -1)),
              a("div", wr, [
                a("label", null, [
                  s[146] || (s[146] = a("span", null, "语言-思维耦合", -1)),
                  ee(Le, {
                    modelValue: m.value.cog_language_framing,
                    "onUpdate:modelValue": s[41] || (s[41] = (u) => m.value.cog_language_framing = u),
                    options: ie,
                    "aria-label": "语言-思维耦合"
                  }, null, 8, ["modelValue"])
                ]),
                a("label", null, [
                  s[147] || (s[147] = a("span", null, "分词边界阈值", -1)),
                  x(a("input", {
                    "onUpdate:modelValue": s[42] || (s[42] = (u) => m.value.cog_language_boundary = u),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      j,
                      m.value.cog_language_boundary,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ])
              ]),
              a("label", br, [
                x(a("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": s[43] || (s[43] = (u) => m.value.cog_language_enabled = u)
                }, null, 512), [
                  [pt, m.value.cog_language_enabled]
                ]),
                s[148] || (s[148] = a("span", null, "启用语言习得回路", -1))
              ])
            ]),
            a("article", xr, [
              s[153] || (s[153] = a("h3", null, "社会学习（第四波）", -1)),
              a("div", Lr, [
                a("label", null, [
                  s[150] || (s[150] = a("span", null, "共情权重", -1)),
                  x(a("input", {
                    "onUpdate:modelValue": s[44] || (s[44] = (u) => m.value.cog_social_empathy = u),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      j,
                      m.value.cog_social_empathy,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                a("label", null, [
                  s[151] || (s[151] = a("span", null, "观点采择阶段", -1)),
                  ee(Le, {
                    modelValue: ne.value,
                    "onUpdate:modelValue": s[45] || (s[45] = (u) => ne.value = u),
                    options: Kt,
                    "aria-label": "观点采择阶段"
                  }, null, 8, ["modelValue"])
                ])
              ]),
              a("label", Pr, [
                x(a("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": s[46] || (s[46] = (u) => m.value.cog_social_enabled = u)
                }, null, 512), [
                  [pt, m.value.cog_social_enabled]
                ]),
                s[152] || (s[152] = a("span", null, "启用社会学习回路", -1))
              ])
            ]),
            a("article", Tr, [
              s[157] || (s[157] = a("h3", null, "自我与时间（第四波）", -1)),
              a("div", kr, [
                a("label", null, [
                  s[154] || (s[154] = a("span", null, "时间折扣 k", -1)),
                  x(a("input", {
                    "onUpdate:modelValue": s[47] || (s[47] = (u) => m.value.cog_selfhood_discount = u),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      j,
                      m.value.cog_selfhood_discount,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                a("label", null, [
                  s[155] || (s[155] = a("span", null, "人设细节尺度", -1)),
                  x(a("input", {
                    "onUpdate:modelValue": s[48] || (s[48] = (u) => m.value.cog_selfhood_detail = u),
                    type: "number",
                    step: "1",
                    min: "1",
                    max: "50",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      j,
                      m.value.cog_selfhood_detail,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ])
              ]),
              a("label", Cr, [
                x(a("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": s[49] || (s[49] = (u) => m.value.cog_selfhood_enabled = u)
                }, null, 512), [
                  [pt, m.value.cog_selfhood_enabled]
                ]),
                s[156] || (s[156] = a("span", null, "启用自我与时间回路", -1))
              ])
            ]),
            a("article", Mr, [
              s[160] || (s[160] = a("h3", null, "病态依恋 / 病娇（可选）", -1)),
              s[161] || (s[161] = a("p", { class: "hint" }, ' 把"占有欲、嫉妒、黏人、多疑"做成一个**会自己演化的状态**，而不是一句人设标签。默认关闭； 开启后由真实互动驱动——你的消息、回复快慢、沉默天数、是否提到别人、睡眠——并和抑郁互相影响。 无论多严重，极重度（≥0.85）都会自动进入安全层：只表达情绪、请求陪伴，不生成自伤或伤人的方法。 ', -1)),
              a("label", Sr, [
                x(a("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": s[50] || (s[50] = (u) => m.value.cog_attachment_enabled = u)
                }, null, 512), [
                  [pt, m.value.cog_attachment_enabled]
                ]),
                s[158] || (s[158] = a("span", null, "启用依恋动力学", -1))
              ]),
              a("div", zr, [
                a("label", null, [
                  s[159] || (s[159] = a("span", null, "依恋型别", -1)),
                  ee(Le, {
                    modelValue: m.value.cog_attachment_type,
                    "onUpdate:modelValue": s[51] || (s[51] = (u) => m.value.cog_attachment_type = u),
                    options: $t,
                    "aria-label": "依恋型别"
                  }, null, 8, ["modelValue"])
                ])
              ]),
              s[162] || (s[162] = a("p", { class: "hint" }, ' 怎么配：① 打开开关并选型别（独占 / 依存 / 妄想 / 监视 / 自伤 / 排除）—— 型别只改变"同一种动力的权重"，不是硬编码台词；或 ② 直接在人设里写关键词， 系统会自动启用并按人设填初始值：如"占有欲强、爱吃醋"→独占型，"很黏人、离不开你"→依存型， "老是查岗、跟踪"→监视型，"疑神疑鬼、总觉得被骗"→妄想型。想更贴近"病娇常伴抑郁"， 把上方「情绪调节画像」设为 depression，两者会互相加重。 ', -1))
            ]),
            a("article", Er, [
              s[167] || (s[167] = a("h3", null, "记忆与巩固（默认开启）", -1)),
              s[168] || (s[168] = a("p", { class: "hint" }, "这四项决定「经历会不会留下痕迹」：写入情景记忆、睡眠期回放、日终再巩固、交错学习（CLS）。默认开启——关掉时人格被固定在人设上，经历不留痕，行为与无认知内核时完全一致（可逐个消融）。", -1)),
              a("div", Or, [
                a("label", Zr, [
                  x(a("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": s[52] || (s[52] = (u) => m.value.cog_memory_encode = u)
                  }, null, 512), [
                    [pt, m.value.cog_memory_encode]
                  ]),
                  s[163] || (s[163] = a("span", null, "选择性情景编码", -1))
                ]),
                a("label", Ir, [
                  x(a("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": s[53] || (s[53] = (u) => m.value.cog_sleep_replay = u)
                  }, null, 512), [
                    [pt, m.value.cog_sleep_replay]
                  ]),
                  s[164] || (s[164] = a("span", null, "睡眠期回放巩固", -1))
                ]),
                a("label", Ar, [
                  x(a("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": s[54] || (s[54] = (u) => m.value.cog_memory_reconsolidate = u)
                  }, null, 512), [
                    [pt, m.value.cog_memory_reconsolidate]
                  ]),
                  s[165] || (s[165] = a("span", null, "日终痕迹再巩固", -1))
                ]),
                a("label", Br, [
                  x(a("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": s[55] || (s[55] = (u) => m.value.cog_cls_interleave = u)
                  }, null, 512), [
                    [pt, m.value.cog_cls_interleave]
                  ]),
                  s[166] || (s[166] = a("span", null, "交错学习 + 一致性门控（CLS）", -1))
                ])
              ])
            ])
          ])
        ], 512), [
          [Ji, F.value === "cognition"]
        ]),
        x(a("section", Nr, [
          a("div", { class: "section-head" }, [
            s[169] || (s[169] = a("div", null, [
              a("h2", null, "世界"),
              a("p", { class: "desc" }, "本地小模型驱动的虚构生活世界：事件、演员表与账本。默认关闭。")
            ], -1)),
            a("div", { class: "head-actions" }, [
              a("button", {
                class: "btn filled sm",
                onClick: Oe
              }, "保存设置")
            ])
          ]),
          a("article", Rr, [
            s[171] || (s[171] = a("h3", null, "虚构浓度", -1)),
            a("div", Dr, [
              a("label", null, [
                s[170] || (s[170] = a("span", null, "world_density", -1)),
                ee(Le, {
                  modelValue: Ge.value,
                  "onUpdate:modelValue": s[56] || (s[56] = (u) => Ge.value = u),
                  options: Li,
                  "aria-label": "虚构浓度"
                }, null, 8, ["modelValue"])
              ])
            ]),
            s[172] || (s[172] = a("p", { class: "hint" }, "off 完全不影响现有行为；texture 只把事件写进时间线与记忆；full 允许作为主动话题提及（上线需你明确确认）。", -1))
          ]),
          a("article", Vr, [
            s[174] || (s[174] = a("h3", null, "人设 → 特质数据", -1)),
            s[175] || (s[175] = a("p", { class: "hint" }, "把角色人设写在这里（性格、体质、作息、情绪风格）。保存后解析为认知内核的特质参数（威胁、奖赏基线、情绪调节画像、躯体化增益、作息等）：默认先由本地词典即时生效，并由模型对改动人设做一次精修（失败自动回退词典）。写明「体弱多病 / 心慌失眠」等会自动开启躯体化网关。", -1)),
            a("label", Ur, [
              s[173] || (s[173] = a("span", { class: "world-label" }, "人设文本", -1)),
              x(a("textarea", {
                "onUpdate:modelValue": s[57] || (s[57] = (u) => pe.value = u),
                class: "world-text",
                rows: "4",
                placeholder: "例：她性格开朗但容易焦虑，体质偏弱，经常心慌失眠，遇到事爱钻牛角尖。"
              }, null, 512), [
                [j, pe.value]
              ])
            ])
          ]),
          a("article", Fr, [
            s[184] || (s[184] = a("h3", null, "世界观 · 定位", -1)),
            s[185] || (s[185] = a("p", { class: "hint" }, "说清这是哪里：国家 / 城市 / 小区（可真实可虚构）。填不全也没关系——点「AI 完善」会补全设定并生成一份带坐标的地图。改了演员或地点后，之前生成的事件会作废、重新开始。", -1)),
            a("div", Hr, [
              a("label", null, [
                s[176] || (s[176] = a("span", null, "世界类型", -1)),
                ee(Le, {
                  modelValue: ke.value,
                  "onUpdate:modelValue": s[58] || (s[58] = (u) => ke.value = u),
                  options: si,
                  "aria-label": "世界类型"
                }, null, 8, ["modelValue"])
              ]),
              a("label", null, [
                s[177] || (s[177] = a("span", null, "国家", -1)),
                x(a("input", {
                  "onUpdate:modelValue": s[59] || (s[59] = (u) => _e.value = u),
                  class: "field",
                  placeholder: "中国 / 架空：曦京"
                }, null, 512), [
                  [j, _e.value]
                ])
              ]),
              a("label", null, [
                s[178] || (s[178] = a("span", null, "城市", -1)),
                x(a("input", {
                  "onUpdate:modelValue": s[60] || (s[60] = (u) => se.value = u),
                  class: "field",
                  placeholder: "杭州 / 临海市"
                }, null, 512), [
                  [j, se.value]
                ])
              ]),
              a("label", null, [
                s[179] || (s[179] = a("span", null, "城区 · 小区", -1)),
                x(a("input", {
                  "onUpdate:modelValue": s[61] || (s[61] = (u) => qe.value = u),
                  class: "field",
                  placeholder: "西湖区 · 文一西路"
                }, null, 512), [
                  [j, qe.value]
                ])
              ])
            ]),
            a("label", Wr, [
              s[180] || (s[180] = a("span", { class: "world-label" }, "世界设定 / 前言", -1)),
              x(a("textarea", {
                "onUpdate:modelValue": s[62] || (s[62] = (u) => Ce.value = u),
                class: "world-text",
                rows: "3",
                placeholder: "例：她住在一座临海小城，开着一家旧书店，养了一只叫煤球的猫。"
              }, null, 512), [
                [j, Ce.value]
              ])
            ]),
            a("label", jr, [
              s[181] || (s[181] = a("span", { class: "world-label" }, "演员表（每行一个：名字 — 名字|关系；关系可为 朋友/同事/家人）", -1)),
              x(a("textarea", {
                "onUpdate:modelValue": s[63] || (s[63] = (u) => Me.value = u),
                class: "world-text",
                rows: "4",
                placeholder: `林小满|朋友
阿哲|同事
妈妈|家人`
              }, null, 512), [
                [j, Me.value]
              ])
            ]),
            a("label", Gr, [
              s[182] || (s[182] = a("span", { class: "world-label" }, "地点（逗号或换行分隔）", -1)),
              x(a("textarea", {
                "onUpdate:modelValue": s[64] || (s[64] = (u) => Se.value = u),
                class: "world-text",
                rows: "2",
                placeholder: "楼下便利店, 常去的咖啡馆, 城西书店"
              }, null, 512), [
                [j, Se.value]
              ])
            ]),
            a("div", qr, [
              a("button", {
                class: "btn filled sm",
                type: "button",
                disabled: Bt.value,
                onClick: hi
              }, v(Bt.value ? "生成中…" : "✦ 只生成地图（保留设定）"), 9, $r),
              a("button", {
                class: "btn tonic sm",
                type: "button",
                disabled: Bt.value,
                onClick: Si
              }, v(Bt.value ? "生成中…" : "AI 完善设定 + 生成地图"), 9, Kr),
              s[183] || (s[183] = a("span", { class: "hint" }, "「只生成地图」不会动上面的设定文本；「完善设定」会用它重写设定。", -1))
            ])
          ]),
          a("article", Jr, [
            a("div", Yr, [
              a("h3", null, [
                s[186] || (s[186] = te("世界地图 ", -1)),
                a("span", Xr, v(D.value.locations.length), 1)
              ]),
              Nt.value ? (T(), k("span", Qr, v(Nt.value.fictional ? "虚构" : "真实") + " · " + v([Nt.value.country, Nt.value.city, Nt.value.district].filter(Boolean).join(" / ") || "未命名"), 1)) : K("", !0)
            ]),
            Nt.value?.premise ? (T(), k("p", tl, v(Nt.value.premise), 1)) : K("", !0),
            a("div", el, [
              a("div", {
                ref_key: "mapEl",
                ref: ze,
                class: Pe(["world-map-leaflet", { "is-empty": !D.value.locations.length }])
              }, null, 2),
              Ee.value ? (T(), k("div", il, "底图加载失败（可能离线），仍可查看城市标记")) : K("", !0),
              D.value.locations.length ? (T(), k(Tt, { key: 1 }, [
                D.value.kind !== "real" && D.value.nation ? (T(), k("button", {
                  key: 0,
                  type: "button",
                  class: "wm-scope",
                  onClick: tn
                }, v(ve.value === "city" ? "全国视图" : "城市视图"), 1)) : K("", !0),
                a("button", {
                  type: "button",
                  class: "wm-reset",
                  onClick: Qi
                }, "⟲ 复位视角"),
                D.value.kind !== "real" && ve.value === "city" ? (T(), k("div", nl, [...s[187] || (s[187] = [
                  a("i", null, "N", -1)
                ])])) : K("", !0)
              ], 64)) : K("", !0)
            ]),
            D.value.locations.length ? K("", !0) : (T(), k("p", ol, "还没有地图。点上面的「AI 完善并生成地图」。")),
            D.value.locations.length ? (T(), k("div", sl, [
              (T(!0), k(Tt, null, jt(Ci.value, (u) => (T(), k("span", { key: u }, [
                a("i", {
                  class: Pe("k-" + u)
                }, null, 2),
                te(v(Ti[u]), 1)
              ]))), 128)),
              a("span", null, [
                s[188] || (s[188] = a("i", { class: "k-actor" }, null, -1)),
                te("角色（" + v(D.value.actors.length) + "）", 1)
              ]),
              D.value.kind !== "real" ? (T(), k(Tt, { key: 0 }, [
                s[189] || (s[189] = bs('<span data-v-60504048><i class="k-hw" data-v-60504048></i>高速/环线</span><span data-v-60504048><i class="k-arterial" data-v-60504048></i>主干道</span><span data-v-60504048><i class="k-street" data-v-60504048></i>街道</span><span data-v-60504048><i class="k-metro" data-v-60504048></i>地铁</span><span data-v-60504048><i class="k-bus" data-v-60504048></i>公交</span><span data-v-60504048><i class="k-park2" data-v-60504048></i>公园</span><span data-v-60504048><i class="k-water" data-v-60504048></i>水域</span>', 7))
              ], 64)) : K("", !0)
            ])) : K("", !0),
            D.value.locations.length && D.value.kind !== "real" && ve.value === "city" ? (T(), k("div", al, [
              (D.value.metro || []).length ? (T(), k("div", rl, [
                s[190] || (s[190] = a("h4", null, "地铁线路表", -1)),
                a("ul", null, [
                  (T(!0), k(Tt, null, jt(D.value.metro, (u, E) => (T(), k("li", {
                    key: "m" + E
                  }, [
                    a("b", {
                      style: Yi({ color: u.color })
                    }, v(u.name), 5),
                    a("span", null, v((u.stations || []).map((M) => M.name).filter(Boolean).join(" · ")), 1)
                  ]))), 128))
                ])
              ])) : K("", !0),
              (D.value.bus || []).length ? (T(), k("div", ll, [
                s[191] || (s[191] = a("h4", null, "公交线路表", -1)),
                a("ul", null, [
                  (T(!0), k(Tt, null, jt(D.value.bus, (u, E) => (T(), k("li", {
                    key: "b" + E
                  }, [
                    a("b", {
                      style: Yi({ color: u.color })
                    }, v(u.name), 5),
                    a("span", null, v((u.stops || []).map((M) => M.name).filter(Boolean).join(" · ")), 1)
                  ]))), 128))
                ])
              ])) : K("", !0)
            ])) : K("", !0)
          ]),
          a("article", ul, [
            a("div", hl, [
              a("h3", null, [
                s[192] || (s[192] = te("最近世界事件 ", -1)),
                a("span", dl, v(Zt.value.length), 1)
              ]),
              Zt.value.length ? (T(), k("button", {
                key: 0,
                type: "button",
                class: "btn tonic sm",
                onClick: zi
              }, "清除世界事件")) : K("", !0)
            ]),
            a("ol", cl, [
              (T(!0), k(Tt, null, jt(Zt.value, (u) => (T(), k("li", {
                key: u.id
              }, [
                a("span", fl, v(u.created_at), 1),
                a("strong", null, v(u.summary), 1)
              ]))), 128)),
              Zt.value.length ? K("", !0) : (T(), k("li", _l, "还没有世界事件（开启后由本地模型生成）。"))
            ])
          ])
        ], 512), [
          [Ji, F.value === "world"]
        ]),
        x(a("section", pl, [
          s[196] || (s[196] = a("div", { class: "section-head" }, [
            a("div", null, [
              a("h2", null, "状态"),
              a("p", { class: "desc" }, "承诺账本、结构化用户模型与价值取向。")
            ])
          ], -1)),
          a("article", ml, [
            a("h3", null, [
              s[193] || (s[193] = te("承诺账本 ", -1)),
              a("span", vl, v(He.value.length), 1)
            ]),
            a("ol", gl, [
              (T(!0), k(Tt, null, jt(He.value, (u) => (T(), k("li", {
                key: u.id
              }, [
                a("strong", null, v(u.text), 1),
                a("span", yl, v(u.user_id), 1)
              ]))), 128)),
              He.value.length ? K("", !0) : (T(), k("li", wl, "没有未了结的承诺。"))
            ])
          ]),
          a("div", bl, [
            a("article", xl, [
              s[194] || (s[194] = a("h3", null, "用户模型", -1)),
              a("ol", Ll, [
                (T(!0), k(Tt, null, jt(We.value, (u) => (T(), k("li", {
                  key: u.user_id
                }, [
                  a("strong", null, v(u.user_id), 1),
                  a("span", Pl, "喜欢：" + v(oe(u.preferences).join("、") || "—"), 1),
                  a("span", Tl, "雷区：" + v(oe(u.taboos).join("、") || "—"), 1),
                  a("span", kl, "关心：" + v(oe(u.concerns).join("、") || "—"), 1)
                ]))), 128)),
                We.value.length ? K("", !0) : (T(), k("li", Cl, "还没有结构化画像。"))
              ])
            ]),
            a("article", Ml, [
              s[195] || (s[195] = a("h3", null, "价值取向", -1)),
              a("ol", Sl, [
                (T(!0), k(Tt, null, jt(je.value, (u) => (T(), k("li", {
                  key: u.k
                }, [
                  a("strong", null, v(u.k), 1),
                  a("span", zl, v(Number(u.v).toFixed(2)), 1)
                ]))), 128)),
                je.value.length ? K("", !0) : (T(), k("li", El, "还没有形成稳定价值取向。"))
              ])
            ])
          ])
        ], 512), [
          [Ji, F.value === "state"]
        ]),
        a("section", Ol, [
          s[200] || (s[200] = a("div", { class: "section-head" }, [
            a("div", null, [
              a("h2", null, "危险操作"),
              a("p", { class: "desc" }, "日常操作不可撤销：撤回一句话、删除一条记忆都是永久的。这里保留唯一一次「重来」的机会。")
            ])
          ], -1)),
          a("div", Zl, [
            a("article", Il, [
              s[197] || (s[197] = a("h3", null, "重置整个人", -1)),
              s[198] || (s[198] = a("p", { class: "hint" }, "清空记忆与备份、关系、承诺、目标、日记与梦境、价值取向、人设演化与认知内核，回到出厂状态。你自己的设置会保留。", -1)),
              s[199] || (s[199] = a("p", {
                class: "hint",
                style: { "margin-top": "10px" }
              }, [
                a("strong", null, "需要二次确认。")
              ], -1)),
              a("div", Al, [
                a("button", {
                  class: "btn danger",
                  disabled: $e.value,
                  onClick: we
                }, v($e.value ? "重置中…" : "重置整个人"), 9, Bl)
              ])
            ])
          ])
        ])
      ], 512),
      ee(xs)
    ], 64));
  }
}), Ul = /* @__PURE__ */ Ps(Rl, [["__scopeId", "data-v-60504048"]]);
export {
  Ul as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('life-plugin-style')){const s=document.createElement('style');s.id='life-plugin-style';s.textContent=".confirm-scrim{position:fixed;inset:0;z-index:var(--z-modal);background:#21173566;backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.confirm-dialog{width:min(440px,100%);background:var(--md-surface-container-high, var(--md-surface, #fff));color:var(--md-on-surface);border:1px solid var(--md-outline-variant, transparent);border-radius:28px;padding:28px;box-shadow:0 24px 70px #18132d33;outline:none}.confirm-dialog h2{margin:0 0 10px;font-size:22px;font-weight:650}.confirm-dialog p{margin:0;font-size:14px;line-height:1.65;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.confirm-dialog footer{display:flex;justify-content:flex-end;gap:12px;margin-top:24px}.confirm-dialog footer button{border:0;border-radius:999px;padding:12px 22px;font:inherit;font-weight:600;cursor:pointer;background:var(--md-secondary-container, #e7e0ec);color:var(--md-on-secondary-container, #1d1b20)}.confirm-dialog footer .confirm-primary{background:var(--md-primary, #6750a4);color:var(--md-on-primary, #fff)}.confirm-dialog footer .confirm-primary.danger{background:var(--md-error, #b3261e);color:var(--md-on-error, #fff)}.confirm-dialog footer button:focus-visible{outline:3px solid var(--md-primary);outline-offset:3px}.confirm-dialog:focus-visible{outline:3px solid var(--md-primary);outline-offset:2px}@media (prefers-reduced-motion: reduce){.confirm-dialog{animation:none;transition:none}}.leaflet-pane,.leaflet-tile,.leaflet-marker-icon,.leaflet-marker-shadow,.leaflet-tile-container,.leaflet-pane>svg,.leaflet-pane>canvas,.leaflet-zoom-box,.leaflet-image-layer,.leaflet-layer{position:absolute;left:0;top:0}.leaflet-container{overflow:hidden}.leaflet-tile,.leaflet-marker-icon,.leaflet-marker-shadow{-webkit-user-select:none;-moz-user-select:none;user-select:none;-webkit-user-drag:none}.leaflet-tile::selection{background:transparent}.leaflet-safari .leaflet-tile{image-rendering:-webkit-optimize-contrast}.leaflet-safari .leaflet-tile-container{width:1600px;height:1600px;-webkit-transform-origin:0 0}.leaflet-marker-icon,.leaflet-marker-shadow{display:block}.leaflet-container .leaflet-overlay-pane svg{max-width:none!important;max-height:none!important}.leaflet-container .leaflet-marker-pane img,.leaflet-container .leaflet-shadow-pane img,.leaflet-container .leaflet-tile-pane img,.leaflet-container img.leaflet-image-layer,.leaflet-container .leaflet-tile{max-width:none!important;max-height:none!important;width:auto;padding:0}.leaflet-container img.leaflet-tile{mix-blend-mode:plus-lighter}.leaflet-container.leaflet-touch-zoom{-ms-touch-action:pan-x pan-y;touch-action:pan-x pan-y}.leaflet-container.leaflet-touch-drag{-ms-touch-action:pinch-zoom;touch-action:none;touch-action:pinch-zoom}.leaflet-container.leaflet-touch-drag.leaflet-touch-zoom{-ms-touch-action:none;touch-action:none}.leaflet-container{-webkit-tap-highlight-color:transparent}.leaflet-container a{-webkit-tap-highlight-color:rgba(51,181,229,.4)}.leaflet-tile{filter:inherit;visibility:hidden}.leaflet-tile-loaded{visibility:inherit}.leaflet-zoom-box{width:0;height:0;-moz-box-sizing:border-box;box-sizing:border-box;z-index:800}.leaflet-overlay-pane svg{-moz-user-select:none}.leaflet-pane{z-index:400}.leaflet-tile-pane{z-index:200}.leaflet-overlay-pane{z-index:400}.leaflet-shadow-pane{z-index:500}.leaflet-marker-pane{z-index:600}.leaflet-tooltip-pane{z-index:650}.leaflet-popup-pane{z-index:700}.leaflet-map-pane canvas{z-index:100}.leaflet-map-pane svg{z-index:200}.leaflet-vml-shape{width:1px;height:1px}.lvml{behavior:url(#default#VML);display:inline-block;position:absolute}.leaflet-control{position:relative;z-index:800;pointer-events:visiblePainted;pointer-events:auto}.leaflet-top,.leaflet-bottom{position:absolute;z-index:1000;pointer-events:none}.leaflet-top{top:0}.leaflet-right{right:0}.leaflet-bottom{bottom:0}.leaflet-left{left:0}.leaflet-control{float:left;clear:both}.leaflet-right .leaflet-control{float:right}.leaflet-top .leaflet-control{margin-top:10px}.leaflet-bottom .leaflet-control{margin-bottom:10px}.leaflet-left .leaflet-control{margin-left:10px}.leaflet-right .leaflet-control{margin-right:10px}.leaflet-fade-anim .leaflet-popup{opacity:0;-webkit-transition:opacity .2s linear;-moz-transition:opacity .2s linear;transition:opacity .2s linear}.leaflet-fade-anim .leaflet-map-pane .leaflet-popup{opacity:1}.leaflet-zoom-animated{-webkit-transform-origin:0 0;-ms-transform-origin:0 0;transform-origin:0 0}svg.leaflet-zoom-animated{will-change:transform}.leaflet-zoom-anim .leaflet-zoom-animated{-webkit-transition:-webkit-transform .25s cubic-bezier(0,0,.25,1);-moz-transition:-moz-transform .25s cubic-bezier(0,0,.25,1);transition:transform .25s cubic-bezier(0,0,.25,1)}.leaflet-zoom-anim .leaflet-tile,.leaflet-pan-anim .leaflet-tile{-webkit-transition:none;-moz-transition:none;transition:none}.leaflet-zoom-anim .leaflet-zoom-hide{visibility:hidden}.leaflet-interactive{cursor:pointer}.leaflet-grab{cursor:-webkit-grab;cursor:-moz-grab;cursor:grab}.leaflet-crosshair,.leaflet-crosshair .leaflet-interactive{cursor:crosshair}.leaflet-popup-pane,.leaflet-control{cursor:auto}.leaflet-dragging .leaflet-grab,.leaflet-dragging .leaflet-grab .leaflet-interactive,.leaflet-dragging .leaflet-marker-draggable{cursor:move;cursor:-webkit-grabbing;cursor:-moz-grabbing;cursor:grabbing}.leaflet-marker-icon,.leaflet-marker-shadow,.leaflet-image-layer,.leaflet-pane>svg path,.leaflet-tile-container{pointer-events:none}.leaflet-marker-icon.leaflet-interactive,.leaflet-image-layer.leaflet-interactive,.leaflet-pane>svg path.leaflet-interactive,svg.leaflet-image-layer.leaflet-interactive path{pointer-events:visiblePainted;pointer-events:auto}.leaflet-container{background:#ddd;outline-offset:1px}.leaflet-container a{color:#0078a8}.leaflet-zoom-box{border:2px dotted #38f;background:#ffffff80}.leaflet-container{font-family:Helvetica Neue,Arial,Helvetica,sans-serif;font-size:12px;font-size:.75rem;line-height:1.5}.leaflet-bar{box-shadow:0 1px 5px #000000a6;border-radius:4px}.leaflet-bar a{background-color:#fff;border-bottom:1px solid #ccc;width:26px;height:26px;line-height:26px;display:block;text-align:center;text-decoration:none;color:#000}.leaflet-bar a,.leaflet-control-layers-toggle{background-position:50% 50%;background-repeat:no-repeat;display:block}.leaflet-bar a:hover,.leaflet-bar a:focus{background-color:#f4f4f4}.leaflet-bar a:first-child{border-top-left-radius:4px;border-top-right-radius:4px}.leaflet-bar a:last-child{border-bottom-left-radius:4px;border-bottom-right-radius:4px;border-bottom:none}.leaflet-bar a.leaflet-disabled{cursor:default;background-color:#f4f4f4;color:#bbb}.leaflet-touch .leaflet-bar a{width:30px;height:30px;line-height:30px}.leaflet-touch .leaflet-bar a:first-child{border-top-left-radius:2px;border-top-right-radius:2px}.leaflet-touch .leaflet-bar a:last-child{border-bottom-left-radius:2px;border-bottom-right-radius:2px}.leaflet-control-zoom-in,.leaflet-control-zoom-out{font:700 18px Lucida Console,Monaco,monospace;text-indent:1px}.leaflet-touch .leaflet-control-zoom-in,.leaflet-touch .leaflet-control-zoom-out{font-size:22px}.leaflet-control-layers{box-shadow:0 1px 5px #0006;background:#fff;border-radius:5px}.leaflet-control-layers-toggle{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAQAAAADQ4RFAAACf0lEQVR4AY1UM3gkARTePdvdoTxXKc+qTl3aU5U6b2Kbkz3Gtq3Zw6ziLGNPzrYx7946Tr6/ee/XeCQ4D3ykPtL5tHno4n0d/h3+xfuWHGLX81cn7r0iTNzjr7LrlxCqPtkbTQEHeqOrTy4Yyt3VCi/IOB0v7rVC7q45Q3Gr5K6jt+3Gl5nCoDD4MtO+j96Wu8atmhGqcNGHObuf8OM/x3AMx38+4Z2sPqzCxRFK2aF2e5Jol56XTLyggAMTL56XOMoS1W4pOyjUcGGQdZxU6qRh7B9Zp+PfpOFlqt0zyDZckPi1ttmIp03jX8gyJ8a/PG2yutpS/Vol7peZIbZcKBAEEheEIAgFbDkz5H6Zrkm2hVWGiXKiF4Ycw0RWKdtC16Q7qe3X4iOMxruonzegJzWaXFrU9utOSsLUmrc0YjeWYjCW4PDMADElpJSSQ0vQvA1Tm6/JlKnqFs1EGyZiFCqnRZTEJJJiKRYzVYzJck2Rm6P4iH+cmSY0YzimYa8l0EtTODFWhcMIMVqdsI2uiTvKmTisIDHJ3od5GILVhBCarCfVRmo4uTjkhrhzkiBV7SsaqS+TzrzM1qpGGUFt28pIySQHR6h7F6KSwGWm97ay+Z+ZqMcEjEWebE7wxCSQwpkhJqoZA5ivCdZDjJepuJ9IQjGGUmuXJdBFUygxVqVsxFsLMbDe8ZbDYVCGKxs+W080max1hFCarCfV+C1KATwcnvE9gRRuMP2prdbWGowm1KB1y+zwMMENkM755cJ2yPDtqhTI6ED1M/82yIDtC/4j4BijjeObflpO9I9MwXTCsSX8jWAFeHr05WoLTJ5G8IQVS/7vwR6ohirYM7f6HzYpogfS3R2OAAAAAElFTkSuQmCC);width:36px;height:36px}.leaflet-retina .leaflet-control-layers-toggle{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAQAAABvcdNgAAAEsklEQVR4AWL4TydIhpZK1kpWOlg0w3ZXP6D2soBtG42jeI6ZmQTHzAxiTbSJsYLjO9HhP+WOmcuhciVnmHVQcJnp7DFvScowZorad/+V/fVzMdMT2g9Cv9guXGv/7pYOrXh2U+RRR3dSd9JRx6bIFc/ekqHI29JC6pJ5ZEh1yWkhkbcFeSjxgx3L2m1cb1C7bceyxA+CNjT/Ifff+/kDk2u/w/33/IeCMOSaWZ4glosqT3DNnNZQ7Cs58/3Ce5HL78iZH/vKVIaYlqzfdLu8Vi7dnvUbEza5Idt36tquZFldl6N5Z/POLof0XLK61mZCmJSWjVF9tEjUluu74IUXvgttuVIHE7YxSkaYhJZam7yiM9Pv82JYfl9nptxZaxMJE4YSPty+vF0+Y2up9d3wwijfjZbabqm/3bZ9ecKHsiGmRflnn1MW4pjHf9oLufyn2z3y1D6n8g8TZhxyzipLNPnAUpsOiuWimg52psrTZYnOWYNDTMuWBWa0tJb4rgq1UvmutpaYEbZlwU3CLJm/ayYjHW5/h7xWLn9Hh1vepDkyf7dE7MtT5LR4e7yYpHrkhOUpEfssBLq2pPhAqoSWKUkk7EDqkmK6RrCEzqDjhNDWNE+XSMvkJRDWlZTmCW0l0PHQGRZY5t1L83kT0Y3l2SItk5JAWHl2dCOBm+fPu3fo5/3v61RMCO9Jx2EEYYhb0rmNQMX/vm7gqOEJLcXTGw3CAuRNeyaPWwjR8PRqKQ1PDA/dpv+on9Shox52WFnx0KY8onHayrJzm87i5h9xGw/tfkev0jGsQizqezUKjk12hBMKJ4kbCqGPVNXudyyrShovGw5CgxsRICxF6aRmSjlBnHRzg7Gx8fKqEubI2rahQYdR1YgDIRQO7JvQyD52hoIQx0mxa0ODtW2Iozn1le2iIRdzwWewedyZzewidueOGqlsn1MvcnQpuVwLGG3/IR1hIKxCjelIDZ8ldqWz25jWAsnldEnK0Zxro19TGVb2ffIZEsIO89EIEDvKMPrzmBOQcKQ+rroye6NgRRxqR4U8EAkz0CL6uSGOm6KQCdWjvjRiSP1BPalCRS5iQYiEIvxuBMJEWgzSoHADcVMuN7IuqqTeyUPq22qFimFtxDyBBJEwNyt6TM88blFHao/6tWWhuuOM4SAK4EI4QmFHA+SEyWlp4EQoJ13cYGzMu7yszEIBOm2rVmHUNqwAIQabISNMRstmdhNWcFLsSm+0tjJH1MdRxO5Nx0WDMhCtgD6OKgZeljJqJKc9po8juskR9XN0Y1lZ3mWjLR9JCO1jRDMd0fpYC2VnvjBSEFg7wBENc0R9HFlb0xvF1+TBEpF68d+DHR6IOWVv2BECtxo46hOFUBd/APU57WIoEwJhIi2CdpyZX0m93BZicktMj1AS9dClteUFAUNUIEygRZCtik5zSxI9MubTBH1GOiHsiLJ3OCoSZkILa9PxiN0EbvhsAo8tdAf9Seepd36lGWHmtNANTv5Jd0z4QYyeo/UEJqxKRpg5LZx6btLPsOaEmdMyxYdlc8LMaJnikDlhclqmPiQnTEpLUIZEwkRagjYkEibQErwhkTAKCLQEbUgkzJQWc/0PstHHcfEdQ+UAAAAASUVORK5CYII=);background-size:26px 26px}.leaflet-touch .leaflet-control-layers-toggle{width:44px;height:44px}.leaflet-control-layers .leaflet-control-layers-list,.leaflet-control-layers-expanded .leaflet-control-layers-toggle{display:none}.leaflet-control-layers-expanded .leaflet-control-layers-list{display:block;position:relative}.leaflet-control-layers-expanded{padding:6px 10px 6px 6px;color:#333;background:#fff}.leaflet-control-layers-scrollbar{overflow-y:scroll;overflow-x:hidden;padding-right:5px}.leaflet-control-layers-selector{margin-top:2px;position:relative;top:1px}.leaflet-control-layers label{display:block;font-size:13px;font-size:1.08333em}.leaflet-control-layers-separator{height:0;border-top:1px solid #ddd;margin:5px -10px 5px -6px}.leaflet-default-icon-path{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII=)}.leaflet-container .leaflet-control-attribution{background:#fff;background:#fffc;margin:0}.leaflet-control-attribution,.leaflet-control-scale-line{padding:0 5px;color:#333;line-height:1.4}.leaflet-control-attribution a{text-decoration:none}.leaflet-control-attribution a:hover,.leaflet-control-attribution a:focus{text-decoration:underline}.leaflet-attribution-flag{display:inline!important;vertical-align:baseline!important;width:1em;height:.6669em}.leaflet-left .leaflet-control-scale{margin-left:5px}.leaflet-bottom .leaflet-control-scale{margin-bottom:5px}.leaflet-control-scale-line{border:2px solid #777;border-top:none;line-height:1.1;padding:2px 5px 1px;white-space:nowrap;-moz-box-sizing:border-box;box-sizing:border-box;background:#fffc;text-shadow:1px 1px #fff}.leaflet-control-scale-line:not(:first-child){border-top:2px solid #777;border-bottom:none;margin-top:-2px}.leaflet-control-scale-line:not(:first-child):not(:last-child){border-bottom:2px solid #777}.leaflet-touch .leaflet-control-attribution,.leaflet-touch .leaflet-control-layers,.leaflet-touch .leaflet-bar{box-shadow:none}.leaflet-touch .leaflet-control-layers,.leaflet-touch .leaflet-bar{border:2px solid rgba(0,0,0,.2);background-clip:padding-box}.leaflet-popup{position:absolute;text-align:center;margin-bottom:20px}.leaflet-popup-content-wrapper{padding:1px;text-align:left;border-radius:12px}.leaflet-popup-content{margin:13px 24px 13px 20px;line-height:1.3;font-size:13px;font-size:1.08333em;min-height:1px}.leaflet-popup-content p{margin:1.3em 0}.leaflet-popup-tip-container{width:40px;height:20px;position:absolute;left:50%;margin-top:-1px;margin-left:-20px;overflow:hidden;pointer-events:none}.leaflet-popup-tip{width:17px;height:17px;padding:1px;margin:-10px auto 0;pointer-events:auto;-webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);-ms-transform:rotate(45deg);transform:rotate(45deg)}.leaflet-popup-content-wrapper,.leaflet-popup-tip{background:#fff;color:#333;box-shadow:0 3px 14px #0006}.leaflet-container a.leaflet-popup-close-button{position:absolute;top:0;right:0;border:none;text-align:center;width:24px;height:24px;font:16px/24px Tahoma,Verdana,sans-serif;color:#757575;text-decoration:none;background:transparent}.leaflet-container a.leaflet-popup-close-button:hover,.leaflet-container a.leaflet-popup-close-button:focus{color:#585858}.leaflet-popup-scrolled{overflow:auto}.leaflet-oldie .leaflet-popup-content-wrapper{-ms-zoom:1}.leaflet-oldie .leaflet-popup-tip{width:24px;margin:0 auto;-ms-filter:\"progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678)\";filter:progid:DXImageTransform.Microsoft.Matrix(M11=.70710678,M12=.70710678,M21=-.70710678,M22=.70710678)}.leaflet-oldie .leaflet-control-zoom,.leaflet-oldie .leaflet-control-layers,.leaflet-oldie .leaflet-popup-content-wrapper,.leaflet-oldie .leaflet-popup-tip{border:1px solid #999}.leaflet-div-icon{background:#fff;border:1px solid #666}.leaflet-tooltip{position:absolute;padding:6px;background-color:#fff;border:1px solid #fff;border-radius:3px;color:#222;white-space:nowrap;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none;box-shadow:0 1px 3px #0006}.leaflet-tooltip.leaflet-interactive{cursor:pointer;pointer-events:auto}.leaflet-tooltip-top:before,.leaflet-tooltip-bottom:before,.leaflet-tooltip-left:before,.leaflet-tooltip-right:before{position:absolute;pointer-events:none;border:6px solid transparent;background:transparent;content:\"\"}.leaflet-tooltip-bottom{margin-top:6px}.leaflet-tooltip-top{margin-top:-6px}.leaflet-tooltip-bottom:before,.leaflet-tooltip-top:before{left:50%;margin-left:-6px}.leaflet-tooltip-top:before{bottom:0;margin-bottom:-12px;border-top-color:#fff}.leaflet-tooltip-bottom:before{top:0;margin-top:-12px;margin-left:-6px;border-bottom-color:#fff}.leaflet-tooltip-left{margin-left:-6px}.leaflet-tooltip-right{margin-left:6px}.leaflet-tooltip-left:before,.leaflet-tooltip-right:before{top:50%;margin-top:-6px}.leaflet-tooltip-left:before{right:0;margin-right:-12px;border-left-color:#fff}.leaflet-tooltip-right:before{left:0;margin-left:-12px;border-right-color:#fff}@media print{.leaflet-control{-webkit-print-color-adjust:exact;print-color-adjust:exact}}#app .app-select{min-width:0;position:relative;font-size:inherit}#app .app-select.input{padding:0;border:0;min-height:0;background:transparent}#app .app-select-trigger{display:flex;align-items:center;justify-content:space-between;gap:10px;width:100%;min-height:52px;padding:0 14px 0 16px;border:1px solid transparent;border-radius:16px;background-color:var(--md-surface-container-high);color:var(--md-on-surface);font:inherit;font-size:15px;text-align:left;cursor:pointer;box-shadow:none;transition:background-color var(--duration-short),border-color var(--duration-short),box-shadow var(--duration-medium),border-radius var(--duration-medium) var(--ease-spring)}#app .app-select-trigger:hover:not(:disabled){background-color:var(--md-surface-container-highest)}#app .app-select-trigger[aria-expanded=true],#app .app-select-trigger:focus-visible{border-color:var(--md-primary);background-color:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent);outline:none}#app .app-select-trigger:disabled{opacity:.5;cursor:not-allowed}.app-select-value{white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.app-select-chevron{flex-shrink:0;width:26px;height:26px;display:grid;place-items:center;border-radius:50%;color:var(--md-on-surface-variant);transition:transform var(--duration-medium) var(--ease-spring),background-color var(--duration-short)}#app .app-select-trigger:hover .app-select-chevron{background:color-mix(in srgb,var(--md-on-surface) 8%,transparent)}.app-select-chevron svg{transition:transform var(--duration-medium) var(--ease-spring)}.app-select-chevron svg.is-open{transform:rotate(180deg)}.app-select-menu{position:fixed;z-index:var(--z-popover);overflow-y:auto;overscroll-behavior:contain;padding:8px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:24px;background:var(--md-surface-container-low);color:var(--md-on-surface);box-shadow:0 18px 50px -12px color-mix(in srgb,var(--md-scrim,#000) 45%,transparent),0 4px 14px -4px #16244026;font-family:var(--font-family);font-size:14px;transform-origin:top}.app-select-menu.opens-up{transform-origin:bottom}.app-select-option{display:flex;justify-content:space-between;align-items:center;gap:12px;min-height:46px;padding:0 14px;border-radius:14px;cursor:pointer;overflow-wrap:anywhere;line-height:1.4;color:var(--md-on-surface);transition:background-color var(--duration-short),border-radius var(--duration-medium) var(--ease-spring),color var(--duration-short)}.app-select-option>span{min-width:0}.app-select-check{flex-shrink:0;width:24px;height:24px;display:grid;place-items:center;border-radius:50%;color:var(--md-primary)}.app-select-option.highlighted{background:color-mix(in srgb,var(--md-on-surface) 8%,transparent)}.app-select-option.selected{background:var(--md-primary-container);color:var(--md-on-primary-container);font-weight:650}.app-select-option.selected .app-select-check{background:var(--md-primary);color:var(--md-on-primary)}.app-select-option.disabled{opacity:.4;cursor:not-allowed}.app-select-empty{padding:18px;color:var(--md-on-surface-variant);text-align:center;font-size:13px}.select-menu-enter-active{transition:opacity var(--duration-short) var(--ease-emphasized),transform var(--duration-medium) var(--ease-spring)}.select-menu-leave-active{transition:opacity var(--duration-short),transform var(--duration-short)}.select-menu-enter-from,.select-menu-leave-to{opacity:0;transform:translateY(-6px) scale(.97)}@media (prefers-reduced-motion: reduce){#app .app-select-trigger{transition:background-color var(--duration-short),border-color var(--duration-short),box-shadow var(--duration-medium)}.app-select-chevron,.app-select-chevron svg,.app-select-option{transition:none}.select-menu-enter-active,.select-menu-leave-active{transition:opacity var(--duration-short)}.select-menu-enter-from,.select-menu-leave-to{transform:none}}.pcp[data-v-60504048]{--r-xs:10px;--r-sm:14px;--r-md:20px;--r-lg:28px;--r-xl:36px;--spring:cubic-bezier(.2,.9,.25,1.15);height:100%;overflow-y:auto;padding:var(--space-xl) var(--space-xl) 96px;background:var(--md-surface);color:var(--md-on-surface);max-width:1240px;margin:0 auto}h1[data-v-60504048],h2[data-v-60504048],h3[data-v-60504048],h4[data-v-60504048]{margin:0;letter-spacing:-.01em}.eyebrow[data-v-60504048]{margin:0 0 8px;color:var(--md-primary);font:700 12px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.18em}.eyebrow b[data-v-60504048]{font-size:9px}.hero[data-v-60504048]{position:relative;border-radius:var(--r-xl);padding:28px 28px 22px;margin-bottom:22px;background:linear-gradient(135deg,var(--md-primary-container),var(--md-surface-container-high) 70%);color:var(--md-on-surface);box-shadow:var(--shadow-1);overflow:hidden}.hero[data-v-60504048]:after{content:\"\";position:absolute;right:-60px;top:-60px;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,color-mix(in srgb,var(--md-primary) 34%,transparent),transparent 68%);pointer-events:none}.hero-main[data-v-60504048]{display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;align-items:flex-start;position:relative;z-index:1}.hero-copy h1[data-v-60504048]{font-size:clamp(26px,3.4vw,40px);font-weight:800}.sub[data-v-60504048]{margin:8px 0 0;max-width:620px;font-size:14px;line-height:1.6;color:var(--md-on-surface-variant)}.hero-actions[data-v-60504048]{display:flex;gap:10px;align-items:center;flex-wrap:wrap}.fab[data-v-60504048]{height:52px;padding:0 22px;border:0;border-radius:18px;background:var(--md-primary);color:var(--md-on-primary,#fff);font:700 14px/1 inherit;display:inline-flex;align-items:center;gap:10px;cursor:pointer;box-shadow:0 6px 18px color-mix(in srgb,var(--md-primary) 34%,transparent);transition:transform .28s var(--spring),box-shadow .28s}@media (hover: hover) and (pointer: fine){.fab[data-v-60504048]:hover:not(:disabled){transform:translateY(-2px) scale(1.02)}}.fab[data-v-60504048]:disabled{opacity:.6;cursor:not-allowed}.fab-ic[data-v-60504048]{font-size:17px}.state-row[data-v-60504048]{position:relative;z-index:1;display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;align-items:center}.pill[data-v-60504048]{padding:6px 14px;border-radius:999px;background:color-mix(in srgb,var(--md-surface-container-lowest) 70%,transparent);font-size:13px;font-weight:700}.pill.soft[data-v-60504048]{font-weight:500;color:var(--md-on-surface-variant)}.pill.bad[data-v-60504048]{background:#ffdcc6;color:#7a3a00}.banner[data-v-60504048]{padding:12px 16px;border-radius:var(--r-sm);font-size:13px;margin:0 0 16px}.banner.err[data-v-60504048]{background:var(--md-error-container);color:var(--md-on-error-container)}.banner.ok[data-v-60504048]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tabs[data-v-60504048]{display:flex;gap:8px;overflow-x:auto;padding:6px 4px 14px;margin-bottom:6px;scrollbar-width:thin}.tab[data-v-60504048]{flex:0 0 auto;display:inline-flex;align-items:center;gap:8px;height:44px;padding:0 18px;border:1px solid var(--md-outline-variant);border-radius:999px;background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font:700 13px/1 inherit;cursor:pointer;transition:background .25s,color .25s,transform .25s var(--spring)}.tab i[data-v-60504048]{font-style:normal;font:700 12px/1 ui-monospace,monospace;opacity:.6}.tab-ic[data-v-60504048]{font-size:14px}.tab[data-v-60504048]:hover{background:var(--md-surface-container-high)}.tab.active[data-v-60504048]{background:var(--md-primary);color:var(--md-on-primary,#fff);border-color:transparent;transform:translateY(-1px);box-shadow:0 6px 16px color-mix(in srgb,var(--md-primary) 30%,transparent)}.tab.active i[data-v-60504048]{opacity:.85}.panel[data-v-60504048]{animation:fade-60504048 .32s var(--spring)}@keyframes fade-60504048{0%{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}.section-head[data-v-60504048]{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap;margin:8px 0 18px}.section-head h2[data-v-60504048]{font-size:22px;font-weight:800}.desc[data-v-60504048]{margin:6px 0 0;font-size:13px;color:var(--md-on-surface-variant);max-width:720px;line-height:1.55}.head-actions[data-v-60504048]{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.btn[data-v-60504048]{height:40px;padding:0 16px;border:1px solid transparent;border-radius:999px;font:700 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:8px;transition:transform .22s var(--spring),background .22s,box-shadow .22s}.btn.sm[data-v-60504048]{height:34px;padding:0 14px;font-size:13px}.btn[data-v-60504048]:disabled{opacity:.5;cursor:not-allowed}@media (hover: hover) and (pointer: fine){.btn[data-v-60504048]:hover:not(:disabled){transform:translateY(-1px)}}.btn.filled[data-v-60504048]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn.tonic[data-v-60504048]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn.text[data-v-60504048]{background:transparent;color:var(--md-primary)}.btn.danger[data-v-60504048]{background:var(--md-error-container);color:var(--md-on-error-container)}.link[data-v-60504048]{border:0;background:transparent;color:var(--md-primary);font:700 12px/1 inherit;cursor:pointer;padding:4px}.card[data-v-60504048]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--r-lg);padding:20px;margin-bottom:16px}.card>h3[data-v-60504048]{font-size:16px;font-weight:750;margin-bottom:14px;display:flex;align-items:center;gap:8px}.card.sub[data-v-60504048]{padding:16px;margin-bottom:0}.grid2[data-v-60504048]{display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start}.grid3[data-v-60504048]{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;align-items:start}.sub-label[data-v-60504048]{margin:16px 0 8px;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--md-on-surface-variant)}.hint[data-v-60504048]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.55;margin:6px 0}.world-field[data-v-60504048]{display:block;margin:10px 0}.world-label[data-v-60504048]{display:block;font-size:12px;font-weight:600;color:var(--md-on-surface-variant);margin-bottom:4px}.world-text[data-v-60504048]{width:100%;min-height:64px;padding:10px 14px;border:1px solid var(--md-outline-variant);border-radius:var(--r-sm);background:var(--md-surface-container-high);color:var(--md-on-surface);font:inherit;font-size:13px;line-height:1.5;resize:vertical;outline:none}.world-text[data-v-60504048]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 14%,transparent)}.world-actions[data-v-60504048]{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-top:12px}.wm-head[data-v-60504048]{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;margin-bottom:6px}.wm-place[data-v-60504048]{font-size:12px;color:var(--md-on-surface-variant)}.wm-premise[data-v-60504048]{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin:2px 0 8px}.wm-map-wrap[data-v-60504048]{position:relative;margin-top:8px}.world-map-leaflet[data-v-60504048]{height:clamp(460px,72vh,820px);border-radius:16px;overflow:hidden;border:1px solid var(--md-outline-variant);background:#e8edf2}.world-map-leaflet.is-empty[data-v-60504048]{display:none}.wm-reset[data-v-60504048]{position:absolute;top:10px;right:10px;z-index:var(--z-overlay);border:1px solid var(--md-outline-variant);background:#fffffff0;color:#33404c;border-radius:10px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer;box-shadow:0 1px 4px #0000002e}.wm-reset[data-v-60504048]:hover{background:#fff}.wm-compass[data-v-60504048]{position:absolute;left:12px;bottom:12px;z-index:var(--z-overlay);width:38px;height:38px;border-radius:50%;background:#ffffffeb;border:1px solid #b9c3cd;box-shadow:0 1px 4px #0000002e;display:grid;place-items:center}.wm-compass i[data-v-60504048]{font-style:normal;font-size:12px;font-weight:800;color:#d64545;position:relative}.wm-compass i[data-v-60504048]:before{content:\"\";position:absolute;left:50%;top:-9px;transform:translate(-50%);border-left:4px solid transparent;border-right:4px solid transparent;border-bottom:9px solid #33404c}.wm-scope[data-v-60504048]{position:absolute;bottom:12px;right:12px;z-index:var(--z-overlay);border:1px solid var(--md-outline-variant);background:#fffffff0;color:#33404c;border-radius:10px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer;box-shadow:0 1px 4px #0000002e}.wm-scope[data-v-60504048]:hover{background:#fff}.wm-offline[data-v-60504048]{position:absolute;left:50%;bottom:12px;transform:translate(-50%);z-index:var(--z-overlay);background:#d1495bf0;color:#fff;font-size:12px;font-weight:600;padding:5px 12px;border-radius:10px;box-shadow:0 1px 4px #00000040}.wm-routes[data-v-60504048]{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:18px;margin-top:14px}.wm-routes h4[data-v-60504048]{margin:0 0 6px;font-size:13px;font-weight:800}.wm-routes ul[data-v-60504048]{list-style:none;margin:0;padding:0}.wm-routes li[data-v-60504048]{display:flex;gap:10px;padding:4px 0;border-bottom:1px dashed color-mix(in srgb,var(--md-outline-variant) 70%,transparent);font-size:12.5px}.wm-routes b[data-v-60504048]{flex:0 0 88px}.wm-routes span[data-v-60504048]{color:var(--md-on-surface-variant);line-height:1.5}.wm-legend[data-v-60504048]{display:flex;flex-wrap:wrap;gap:14px;margin-top:12px;font-size:12px;color:var(--md-on-surface-variant)}.wm-legend span[data-v-60504048]{display:inline-flex;align-items:center;gap:6px}.wm-legend i[data-v-60504048]{width:12px;height:12px;border-radius:50%;display:inline-block;border:1.5px solid rgba(255,255,255,.7)}.wm-legend i.k-home[data-v-60504048]{background:#e07a5f}.wm-legend i.k-work[data-v-60504048]{background:#5b8def}.wm-legend i.k-shop[data-v-60504048]{background:#e0a23d}.wm-legend i.k-food[data-v-60504048]{background:#57a773}.wm-legend i.k-park[data-v-60504048]{background:#3faead}.wm-legend i.k-transit[data-v-60504048]{background:#8b6fd6}.wm-legend i.k-other[data-v-60504048]{background:#8a94a6}.wm-legend i.k-actor[data-v-60504048]{background:#fff;border-color:#d1495b;box-shadow:inset 0 0 0 3px #d1495b}.wm-legend i.k-metro[data-v-60504048]{background:#d64545}.wm-legend i.k-bus[data-v-60504048]{background:#e08a2e}.wm-legend i.k-park2[data-v-60504048]{background:#9bd08f}.wm-legend i.k-water[data-v-60504048]{background:#8fbfe6}.wm-legend i.k-hw[data-v-60504048]{background:#f08c2e}.wm-legend i.k-arterial[data-v-60504048]{background:#f7cf8a}.wm-legend i.k-street[data-v-60504048]{background:#fff;border-color:#b9c3cd}.meta[data-v-60504048]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5}.empty[data-v-60504048]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant)}.field[data-v-60504048]{width:100%;height:48px;padding:0 16px;border:1px solid var(--md-outline-variant);border-radius:var(--r-sm);background:var(--md-surface-container-high);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none;transition:border-color .2s,box-shadow .2s}.field[data-v-60504048]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 14%,transparent)}.field.tiny[data-v-60504048]{width:104px;height:38px;padding:0 12px;font-size:13px}.preset-row[data-v-60504048]{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}.switches[data-v-60504048]{display:flex;gap:16px;flex-wrap:wrap;margin:8px 0}.sw[data-v-60504048]{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:var(--md-on-surface-variant);cursor:pointer}.sw input[data-v-60504048]{width:18px;height:18px;accent-color:var(--md-primary)}.settings-grid[data-v-60504048]{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px}.settings-grid label[data-v-60504048]{display:flex;flex-direction:column;gap:4px;font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}.settings-grid .field[data-v-60504048]{height:40px}.pfield[data-v-60504048]{display:flex;flex-direction:column;gap:4px;margin-top:10px;font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}.pfield textarea.field[data-v-60504048]{height:auto;min-height:70px;padding:10px 12px;resize:vertical;line-height:1.5}.cog-metric[data-v-60504048]{display:flex;flex-direction:column;gap:4px;padding:10px 12px;border-radius:var(--r-sm);background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant)}.cog-metric span[data-v-60504048]{font-size:11px;font-weight:700;letter-spacing:.04em;color:var(--md-on-surface-variant)}.cog-metric strong[data-v-60504048]{font-size:16px;font-weight:800;letter-spacing:-.01em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.som-channels[data-v-60504048]{margin-top:10px;display:flex;flex-direction:column;gap:6px}.som-chan[data-v-60504048]{display:grid;grid-template-columns:52px 1fr 48px;align-items:center;gap:10px}.som-chan-name[data-v-60504048]{font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}.som-chan-bar[data-v-60504048]{display:block;height:8px;border-radius:999px;background:var(--md-surface-container);overflow:hidden}.som-chan-bar i[data-v-60504048]{display:block;width:100%;height:100%;border-radius:999px;background:var(--md-primary);transform-origin:left;transition:transform var(--duration-medium) var(--ease-out);will-change:transform}.som-chan-val[data-v-60504048]{font-size:12px;font-weight:700;text-align:right;color:var(--md-on-surface-variant)}.chip[data-v-60504048]{display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 12px;border-radius:999px;font-size:12px;font-weight:700;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.chip.muted[data-v-60504048]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}.chip.ok[data-v-60504048]{background:var(--md-success-container);color:#0d3b1e}.count-pill[data-v-60504048]{margin-left:auto;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);border-radius:999px;padding:3px 10px;font-size:12px;font-weight:700}.count-pill.ok[data-v-60504048]{background:var(--md-success-container);color:#0d3b1e}.actions-row[data-v-60504048]{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:8px}#app .pcp .card[data-v-60504048]{border-color:color-mix(in srgb,var(--md-outline-variant) 55%,transparent);background:var(--md-surface-container-low);box-shadow:var(--shadow-1)}#app .pcp .field[data-v-60504048]{height:52px;border-radius:16px;border-color:transparent;background:var(--md-surface-container-high)}#app .pcp .field[data-v-60504048]:focus{border-color:var(--md-primary);background:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}#app .pcp .field.tiny[data-v-60504048]{height:40px}#app .pcp .settings-grid .field[data-v-60504048]{height:44px}#app .pcp .btn[data-v-60504048]{height:44px;padding:0 20px}#app .pcp .btn.sm[data-v-60504048]{height:36px;padding:0 15px}#app .pcp .cog-metric[data-v-60504048]{background:var(--md-surface-container)}@media (prefers-reduced-motion: reduce){.panel[data-v-60504048]{animation:none}.fab[data-v-60504048],.btn[data-v-60504048],.tab[data-v-60504048],.som-chan-bar i[data-v-60504048]{transition:none}.fab[data-v-60504048]:hover:not(:disabled),.btn[data-v-60504048]:hover:not(:disabled),.tab.active[data-v-60504048]{transform:none}}@media (prefers-color-scheme: dark){.pill.bad[data-v-60504048]{background:#5a2d00;color:#ffd7b0}}@media (max-width:820px){.grid2[data-v-60504048],.grid3[data-v-60504048]{grid-template-columns:1fr}.settings-grid label.wide[data-v-60504048]{grid-column:span 1}}@media (max-width:560px){.pcp[data-v-60504048]{padding:var(--space-lg) var(--space-lg) 80px}.hero[data-v-60504048]{padding:20px}.hero-actions[data-v-60504048]{width:100%}}.wm-pin-holder,.wm-actor-holder{background:none;border:none}.wm-pin{position:absolute;left:0;top:0;width:16px;height:16px;border-radius:50%;background:var(--c,#8a94a6);border:3px solid #fff;box-shadow:0 2px 6px #00000073;transform:translate(-50%,-50%)}.wm-pin:after{content:\"\";position:absolute;left:50%;top:100%;width:2px;height:8px;background:#fff;transform:translate(-50%);opacity:.7}.wm-pin-label{position:absolute;left:12px;top:-9px;white-space:nowrap;background:#12141ad1;color:#fff;font-size:12px;font-weight:600;padding:2px 8px;border-radius:10px;pointer-events:none}.wm-actor-badge{position:absolute;left:0;top:0;width:26px;height:26px;border-radius:50%;background:#fff;color:#d1495b;border:3px solid #d1495b;font-size:14px;font-weight:800;line-height:1;display:grid;place-items:center;transform:translate(-50%,-50%);box-shadow:0 2px 6px #00000080;z-index:600}.wm-actor-name{position:absolute;left:0;top:20px;white-space:nowrap;background:#d1495b;color:#fff;font-size:11px;font-weight:700;padding:1px 7px;border-radius:9px;transform:translate(-50%)}.wm-district{background:none;border:none}.wm-district-inner{position:absolute;left:0;top:0;transform:translate(-50%,-50%);white-space:nowrap;font-size:12px;font-weight:800;letter-spacing:.2em;color:#5c6b78;text-shadow:0 1px 0 rgba(255,255,255,.9);pointer-events:none}.wm-route{background:none;border:none}.wm-route-inner{position:absolute;left:0;top:0;transform:translate(-50%,-50%);background:var(--c,#333);color:#fff;font-size:10px;font-weight:700;padding:1px 6px;border-radius:8px;white-space:nowrap;box-shadow:0 1px 3px #00000059;pointer-events:none}.wm-zoom-low .wm-minor{display:none}.wm-station .wm-route-inner{background:#fff;color:#33404c;border:1.5px solid var(--c,#888);border-radius:6px;font-size:9px;font-weight:700;padding:1px 5px}.leaflet-container{font-family:inherit;background:#e8edf2;border-radius:16px}.leaflet-container a{color:#2f6fed}.leaflet-popup-content{font-size:13px;line-height:1.5}.page[data-v-c4f2d266]{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}.page-inner[data-v-c4f2d266]{max-width:1180px;margin:0 auto}.page-header[data-v-c4f2d266]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.eyebrow[data-v-c4f2d266]{margin:0 0 6px;color:var(--md-primary);font:700 12px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.page-header h1[data-v-c4f2d266]{margin:0;font-size:var(--font-size-lg);font-weight:650;letter-spacing:-.01em}.subtitle[data-v-c4f2d266]{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-c4f2d266]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0;flex-wrap:wrap}.btn[data-v-c4f2d266]{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s,background .15s}.btn[data-v-c4f2d266]:disabled{opacity:.55;cursor:not-allowed}.btn[data-v-c4f2d266]:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}.btn-sm[data-v-c4f2d266]{height:30px;padding:0 12px;font-size:12px}.btn-primary[data-v-c4f2d266]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn-tonal[data-v-c4f2d266]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn-danger[data-v-c4f2d266]{background:var(--md-error-container);color:var(--md-on-error-container)}.stat-grid[data-v-c4f2d266]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-c4f2d266]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}.stat-head[data-v-c4f2d266]{display:flex;align-items:center;gap:10px}.stat-label[data-v-c4f2d266]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-c4f2d266]{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1}.stat-hint[data-v-c4f2d266]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-c4f2d266]{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-c4f2d266]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-c4f2d266]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-c4f2d266]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-c4f2d266]{background:var(--md-success-container);color:#0d3b1e}.card[data-v-c4f2d266]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);box-shadow:var(--shadow-1);padding:var(--space-lg)}.card-head[data-v-c4f2d266]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.card-title[data-v-c4f2d266]{margin:0;font-size:16px;font-weight:650}.tabs[data-v-c4f2d266]{display:inline-flex;gap:4px;padding:4px;border-radius:999px;background:var(--md-surface-container-high);margin-bottom:var(--space-lg)}.tabs button[data-v-c4f2d266]{border:0;background:transparent;border-radius:999px;padding:8px 18px;font-size:13px;font-weight:600;color:var(--md-on-surface-variant);cursor:pointer}.tabs button.active[data-v-c4f2d266]{background:var(--md-surface-container-lowest);color:var(--md-primary);box-shadow:var(--shadow-1)}.toolbar[data-v-c4f2d266]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:var(--space-lg);padding:var(--space-md)}.search-field[data-v-c4f2d266]{display:flex;align-items:center;gap:10px;flex:1;min-width:220px}.search-icon[data-v-c4f2d266]{color:var(--md-on-surface-variant);flex-shrink:0}.search-field input[data-v-c4f2d266]{flex:1;min-width:0;height:38px;border:0;background:transparent;outline:none;color:var(--md-on-surface);font-size:14px}.search-field input[data-v-c4f2d266]:focus-visible{outline:3px solid var(--md-primary);outline-offset:2px}.search-field.mini[data-v-c4f2d266]{padding:8px 12px;border:1px solid var(--md-outline-variant);border-radius:10px;margin-bottom:12px}.select[data-v-c4f2d266]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.select select[data-v-c4f2d266]{height:34px;border:1px solid var(--md-outline-variant);border-radius:9px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);padding:0 10px;font:inherit;font-size:13px}.chip[data-v-c4f2d266]{height:26px;padding:0 11px;border-radius:999px;font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:6px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0}.chip.muted[data-v-c4f2d266]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}.tier-short[data-v-c4f2d266]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tier-long[data-v-c4f2d266]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.chip-ok[data-v-c4f2d266]{background:var(--md-success-container);color:#0d3b1e}.chip-warn[data-v-c4f2d266]{background:#fff1dc;color:#7a4400}.error-banner[data-v-c4f2d266]{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:var(--md-on-error-container);font-size:13px;margin:var(--space-lg) 0}.notice[data-v-c4f2d266]{padding:10px 16px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;margin-top:var(--space-md)}.memory-list[data-v-c4f2d266]{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:var(--space-lg)}.memory-card[data-v-c4f2d266]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:12px;transition:border-color .15s,box-shadow .15s}.memory-card-enter-active[data-v-c4f2d266]{transition:opacity .2s var(--ease-emphasized-decel),transform .2s var(--ease-emphasized-decel)}.memory-card-leave-active[data-v-c4f2d266]{transition:opacity .16s var(--ease-emphasized-accel),transform .16s var(--ease-emphasized-accel)}.memory-card-enter-from[data-v-c4f2d266]{opacity:0;transform:translateY(6px) scale(.98)}.memory-card-leave-to[data-v-c4f2d266]{opacity:0;transform:scale(.98)}.memory-card-move[data-v-c4f2d266]{transition:transform .26s var(--ease-emphasized)}@media (prefers-reduced-motion: reduce){.memory-card-enter-active[data-v-c4f2d266],.memory-card-leave-active[data-v-c4f2d266],.memory-card-move[data-v-c4f2d266]{transition-duration:1ms}.memory-card-enter-from[data-v-c4f2d266],.memory-card-leave-to[data-v-c4f2d266]{transform:none}}.memory-card[data-v-c4f2d266]:hover{border-color:color-mix(in srgb,var(--md-primary) 45%,var(--md-outline-variant));box-shadow:var(--shadow-2)}.card-top[data-v-c4f2d266]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.btn-icon[data-v-c4f2d266]{position:relative;width:30px;height:30px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--md-on-surface-variant);display:grid;place-items:center;cursor:pointer;margin-left:auto}.btn-icon[data-v-c4f2d266]:after{content:\"\";position:absolute;top:50%;left:50%;width:44px;height:44px;transform:translate(-50%,-50%)}.btn-icon.danger[data-v-c4f2d266]:hover{background:var(--md-error-container);color:var(--md-error)}.memory-content[data-v-c4f2d266]{margin:0;line-height:1.65;font-size:14px;white-space:pre-wrap}.tags[data-v-c4f2d266]{display:flex;gap:6px;flex-wrap:wrap}.tags span[data-v-c4f2d266]{font-size:12px;font-weight:500;color:var(--md-on-primary-container);background:var(--md-primary-container);padding:3px 8px;border-radius:999px}.memory-foot[data-v-c4f2d266]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding-top:12px;border-top:1px solid var(--md-outline-variant)}.meter[data-v-c4f2d266]{display:flex;align-items:center;gap:7px;font-size:12px;color:var(--md-on-surface-variant)}.meter-bar[data-v-c4f2d266]{width:56px;height:5px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-c4f2d266]{display:block;height:100%;width:100%;transform-origin:left;transform:scaleX(var(--v,0%));border-radius:999px;transition:transform .3s var(--ease-out,ease)}.fill-primary[data-v-c4f2d266]{background:var(--md-primary)}.fill-secondary[data-v-c4f2d266]{background:var(--md-secondary,#536255)}.meter-text[data-v-c4f2d266]{margin-left:auto;font-size:12px;color:var(--md-on-surface-variant)}.detail[data-v-c4f2d266]{border-top:1px solid var(--md-outline-variant);padding-top:10px}.detail dl[data-v-c4f2d266]{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0;font-size:12px}.detail dt[data-v-c4f2d266]{color:var(--md-on-surface-variant);font-weight:600}.detail dd[data-v-c4f2d266]{margin:3px 0 0;overflow-wrap:anywhere}.detail code[data-v-c4f2d266]{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px}.card-actions[data-v-c4f2d266]{display:flex;gap:8px;justify-content:flex-end}.hidden-input[data-v-c4f2d266]{display:none}.empty-state[data-v-c4f2d266]{padding:56px 24px;text-align:center;background:var(--md-surface-container);border:1px dashed var(--md-outline-variant);border-radius:var(--radius-lg);color:var(--md-on-surface-variant)}.empty-state p[data-v-c4f2d266]{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}.empty-state .hint[data-v-c4f2d266]{margin-top:8px;font-size:13px;font-weight:400;opacity:.85}.pager[data-v-c4f2d266]{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:var(--space-lg)}.grid-notes[data-v-c4f2d266]{display:grid;grid-template-columns:minmax(0,340px) 1fr;gap:var(--space-lg)}.stack-form[data-v-c4f2d266]{display:flex;flex-direction:column;gap:10px}.input[data-v-c4f2d266]{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none}.input[data-v-c4f2d266]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}.input.area[data-v-c4f2d266]{height:auto;padding:10px 14px;min-height:120px;resize:vertical;line-height:1.6}.note-list[data-v-c4f2d266],.reflection-list[data-v-c4f2d266]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}.note-item[data-v-c4f2d266]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}.note-main[data-v-c4f2d266]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.note-main strong[data-v-c4f2d266]{font-size:14px;font-weight:600;overflow-wrap:anywhere}.item-meta[data-v-c4f2d266]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.note-actions[data-v-c4f2d266]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-c4f2d266]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.reader[data-v-c4f2d266]{margin-top:var(--space-lg)}.reader pre[data-v-c4f2d266]{margin:0;max-height:460px;overflow:auto;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;line-height:1.7;white-space:pre-wrap;background:var(--md-surface-container);padding:14px 16px;border-radius:12px}.reflection .card-title[data-v-c4f2d266]{font-size:14px;font-weight:600}.reflection details[data-v-c4f2d266]{margin-top:6px}.reflection summary[data-v-c4f2d266]{cursor:pointer;font-size:12px;color:var(--md-on-surface-variant)}.quote[data-v-c4f2d266]{margin:8px 0 0;font-size:13px;line-height:1.6;background:var(--md-surface-container);padding:8px 12px;border-radius:8px;white-space:pre-wrap;overflow-wrap:anywhere}#app .memory-page .page-header h1[data-v-c4f2d266]{font-size:clamp(24px,2.8vw,34px);font-weight:800;letter-spacing:-.02em}#app .memory-page .stat-grid[data-v-c4f2d266]{gap:var(--space-lg)}#app .memory-page .stat-card[data-v-c4f2d266],#app .memory-page .card[data-v-c4f2d266],#app .memory-page .memory-card[data-v-c4f2d266]{border-color:color-mix(in srgb,var(--md-outline-variant) 55%,transparent);background:var(--md-surface-container-low);box-shadow:var(--shadow-1)}#app .memory-page .stat-card[data-v-c4f2d266]{border-radius:24px;transition:transform .28s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),box-shadow .28s}@media (hover: hover) and (pointer: fine){#app .memory-page .stat-card[data-v-c4f2d266]:hover{transform:translateY(-2px);box-shadow:var(--shadow-2)}}#app .memory-page .stat-value[data-v-c4f2d266]{font-size:34px;font-weight:800;letter-spacing:-.02em}#app .memory-page .icon-badge[data-v-c4f2d266]{width:44px;height:44px;border-radius:16px 16px 16px 6px}#app .memory-page .card[data-v-c4f2d266],#app .memory-page .memory-card[data-v-c4f2d266]{border-radius:24px}#app .memory-page .memory-card[data-v-c4f2d266]{transition:transform .26s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),box-shadow .22s,border-color .2s}@media (hover: hover) and (pointer: fine){#app .memory-page .memory-card[data-v-c4f2d266]:hover{transform:translateY(-2px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--md-primary) 30%,var(--md-outline-variant))}}#app .memory-page .btn[data-v-c4f2d266]{height:44px;padding:0 20px;border-radius:999px;font-weight:700}#app .memory-page .btn-sm[data-v-c4f2d266]{height:34px;padding:0 14px;font-size:13px}#app .memory-page .btn-tonal[data-v-c4f2d266]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}#app .memory-page .btn-primary[data-v-c4f2d266]{background:var(--md-primary);color:var(--md-on-primary);box-shadow:0 6px 16px color-mix(in srgb,var(--md-primary) 28%,transparent)}#app .memory-page .input[data-v-c4f2d266]{height:48px;border:1px solid transparent;border-radius:14px;background:var(--md-surface-container-high);transition:background-color .18s,border-color .18s,box-shadow .2s}#app .memory-page .input[data-v-c4f2d266]:focus{border-color:var(--md-primary);background:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}#app .memory-page .input.area[data-v-c4f2d266]{height:auto;padding:14px 16px}#app .memory-page .search-field input[data-v-c4f2d266]{height:44px}#app .memory-page .search-field.mini[data-v-c4f2d266]{border-color:transparent;background:var(--md-surface-container-high);border-radius:14px}#app .memory-page .select select[data-v-c4f2d266]{height:44px;border-color:transparent;border-radius:14px;background:var(--md-surface-container-high);padding:0 14px}#app .memory-page .tabs[data-v-c4f2d266]{padding:5px;border-radius:999px;background:var(--md-surface-container-high)}#app .memory-page .tabs button[data-v-c4f2d266]{border-radius:999px;padding:9px 20px;font-weight:650}#app .memory-page .tabs button.active[data-v-c4f2d266]{background:var(--md-primary);color:var(--md-on-primary);box-shadow:var(--shadow-1)}#app .memory-page .note-item[data-v-c4f2d266]{border-radius:16px;border-color:color-mix(in srgb,var(--md-outline-variant) 45%,transparent);background:var(--md-surface-container-low)}@media (prefers-reduced-motion: reduce){#app .memory-page .stat-card[data-v-c4f2d266]:hover,#app .memory-page .memory-card[data-v-c4f2d266]:hover{transform:none}.meter-bar i[data-v-c4f2d266]{transition:none}}@media (max-width:900px){.stat-grid[data-v-c4f2d266]{grid-template-columns:repeat(2,1fr)}.grid-notes[data-v-c4f2d266]{grid-template-columns:1fr}}@media (max-width:640px){.page[data-v-c4f2d266]{padding:var(--space-lg)}.header-actions[data-v-c4f2d266]{padding-top:0}.memory-list[data-v-c4f2d266]{grid-template-columns:1fr}}\n";document.head.appendChild(s)}})();
