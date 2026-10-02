import { defineComponent as mo, ref as Y, computed as pt, watch as Pn, nextTick as fi, onMounted as vo, onUnmounted as go, openBlock as T, createElementBlock as M, mergeProps as ms, createElementVNode as r, unref as Wi, toDisplayString as y, normalizeClass as we, createBlock as vs, Teleport as gs, createVNode as ze, Transition as ys, withCtx as ws, withModifiers as po, normalizeStyle as Hi, Fragment as Nt, renderList as ie, createCommentVNode as et, createTextVNode as le, withDirectives as z, vModelCheckbox as wt, vModelText as rt, vShow as Ln, createStaticVNode as bs } from "vue";
import { _ as xs, u as Ls, a as Ps } from "./assets/_plugin-vue_export-helper-Bl_tmTjg.js";
var Ts = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function ks(Ct) {
  return Ct && Ct.__esModule && Object.prototype.hasOwnProperty.call(Ct, "default") ? Ct.default : Ct;
}
var Tn = { exports: {} };
/* @preserve
 * Leaflet 1.9.4, a JS library for interactive maps. https://leafletjs.com
 * (c) 2010-2023 Vladimir Agafonkin, (c) 2010-2011 CloudMade
 */
(function(Ct, ue) {
  (function(d, It) {
    It(ue);
  })(Ts, function(d) {
    var It = "1.9.4";
    function U(t) {
      var e, i, n, o;
      for (i = 1, n = arguments.length; i < n; i++) {
        o = arguments[i];
        for (e in o)
          t[e] = o[e];
      }
      return t;
    }
    var Rt = Object.create || /* @__PURE__ */ function() {
      function t() {
      }
      return function(e) {
        return t.prototype = e, new t();
      };
    }();
    function W(t, e) {
      var i = Array.prototype.slice;
      if (t.bind)
        return t.bind.apply(t, i.call(arguments, 1));
      var n = i.call(arguments, 2);
      return function() {
        return t.apply(e, n.length ? n.concat(i.call(arguments)) : arguments);
      };
    }
    var Kt = 0;
    function B(t) {
      return "_leaflet_id" in t || (t._leaflet_id = ++Kt), t._leaflet_id;
    }
    function it(t, e, i) {
      var n, o, a, l;
      return l = function() {
        n = !1, o && (a.apply(i, o), o = !1);
      }, a = function() {
        n ? o = arguments : (t.apply(i, arguments), setTimeout(l, e), n = !0);
      }, a;
    }
    function nt(t, e, i) {
      var n = e[1], o = e[0], a = n - o;
      return t === n && i ? t : ((t - o) % a + a) % a + o;
    }
    function X() {
      return !1;
    }
    function ct(t, e) {
      if (e === !1)
        return t;
      var i = Math.pow(10, e === void 0 ? 6 : e);
      return Math.round(t * i) / i;
    }
    function Ot(t) {
      return t.trim ? t.trim() : t.replace(/^\s+|\s+$/g, "");
    }
    function ot(t) {
      return Ot(t).split(/\s+/);
    }
    function K(t, e) {
      Object.prototype.hasOwnProperty.call(t, "options") || (t.options = t.options ? Rt(t.options) : {});
      for (var i in e)
        t.options[i] = e[i];
      return t.options;
    }
    function Jt(t, e, i) {
      var n = [];
      for (var o in t)
        n.push(encodeURIComponent(i ? o.toUpperCase() : o) + "=" + encodeURIComponent(t[o]));
      return (!e || e.indexOf("?") === -1 ? "?" : "&") + n.join("&");
    }
    var Ee = /\{ *([\w_ -]+) *\}/g;
    function Yt(t, e) {
      return t.replace(Ee, function(i, n) {
        var o = e[n];
        if (o === void 0)
          throw new Error("No value provided for variable " + i);
        return typeof o == "function" && (o = o(e)), o;
      });
    }
    var mt = Array.isArray || function(t) {
      return Object.prototype.toString.call(t) === "[object Array]";
    };
    function ne(t, e) {
      for (var i = 0; i < t.length; i++)
        if (t[i] === e)
          return i;
      return -1;
    }
    var Gt = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
    function he(t) {
      return window["webkit" + t] || window["moz" + t] || window["ms" + t];
    }
    var Oe = 0;
    function be(t) {
      var e = +/* @__PURE__ */ new Date(), i = Math.max(0, 16 - (e - Oe));
      return Oe = e + i, window.setTimeout(t, i);
    }
    var lt = window.requestAnimationFrame || he("RequestAnimationFrame") || be, g = window.cancelAnimationFrame || he("CancelAnimationFrame") || he("CancelRequestAnimationFrame") || function(t) {
      window.clearTimeout(t);
    };
    function P(t, e, i) {
      if (i && lt === be)
        t.call(e);
      else
        return lt.call(window, W(t, e));
    }
    function N(t) {
      t && g.call(window, t);
    }
    var ut = {
      __proto__: null,
      extend: U,
      create: Rt,
      bind: W,
      get lastId() {
        return Kt;
      },
      stamp: B,
      throttle: it,
      wrapNum: nt,
      falseFn: X,
      formatNum: ct,
      trim: Ot,
      splitWords: ot,
      setOptions: K,
      getParamString: Jt,
      template: Yt,
      isArray: mt,
      indexOf: ne,
      emptyImageUrl: Gt,
      requestFn: lt,
      cancelFn: g,
      requestAnimFrame: P,
      cancelAnimFrame: N
    };
    function bt() {
    }
    bt.extend = function(t) {
      var e = function() {
        K(this), this.initialize && this.initialize.apply(this, arguments), this.callInitHooks();
      }, i = e.__super__ = this.prototype, n = Rt(i);
      n.constructor = e, e.prototype = n;
      for (var o in this)
        Object.prototype.hasOwnProperty.call(this, o) && o !== "prototype" && o !== "__super__" && (e[o] = this[o]);
      return t.statics && U(e, t.statics), t.includes && (Ze(t.includes), U.apply(null, [n].concat(t.includes))), U(n, t), delete n.statics, delete n.includes, n.options && (n.options = i.options ? Rt(i.options) : {}, U(n.options, t.options)), n._initHooks = [], n.callInitHooks = function() {
        if (!this._initHooksCalled) {
          i.callInitHooks && i.callInitHooks.call(this), this._initHooksCalled = !0;
          for (var a = 0, l = n._initHooks.length; a < l; a++)
            n._initHooks[a].call(this);
        }
      }, e;
    }, bt.include = function(t) {
      var e = this.prototype.options;
      return U(this.prototype, t), t.options && (this.prototype.options = e, this.mergeOptions(t.options)), this;
    }, bt.mergeOptions = function(t) {
      return U(this.prototype.options, t), this;
    }, bt.addInitHook = function(t) {
      var e = Array.prototype.slice.call(arguments, 1), i = typeof t == "function" ? t : function() {
        this[t].apply(this, e);
      };
      return this.prototype._initHooks = this.prototype._initHooks || [], this.prototype._initHooks.push(i), this;
    };
    function Ze(t) {
      if (!(typeof L > "u" || !L || !L.Mixin)) {
        t = mt(t) ? t : [t];
        for (var e = 0; e < t.length; e++)
          t[e] === L.Mixin.Events && console.warn("Deprecated include of L.Mixin.Events: this property will be removed in future releases, please inherit from L.Evented instead.", new Error().stack);
      }
    }
    var ht = {
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
          t = ot(t);
          for (var o = 0, a = t.length; o < a; o++)
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
          t = ot(t);
          for (var o = arguments.length === 1, a = 0, l = t.length; a < l; a++)
            o ? this._off(t[a]) : this._off(t[a], e, i);
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
        var n, o, a;
        if (this._events && (n = this._events[t], !!n)) {
          if (arguments.length === 1) {
            if (this._firingCount)
              for (o = 0, a = n.length; o < a; o++)
                n[o].fn = X;
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
            this._firingCount && (h.fn = X, this._events[t] = n = n.slice()), n.splice(l, 1);
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
        var n = U({}, e, {
          type: t,
          target: this,
          sourceTarget: e && e.sourceTarget || this
        });
        if (this._events) {
          var o = this._events[t];
          if (o) {
            this._firingCount = this._firingCount + 1 || 1;
            for (var a = 0, l = o.length; a < l; a++) {
              var h = o[a], c = h.fn;
              h.once && this.off(t, c, h.ctx), c.call(h.ctx || this, n);
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
        var a = this._events && this._events[t];
        if (a && a.length && this._listens(t, o, i) !== !1)
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
        for (var o = 0, a = n.length; o < a; o++)
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
          t = ot(t);
          for (var o = 0, a = t.length; o < a; o++)
            this._on(t[o], e, i, !0);
        }
        return this;
      },
      // @method addEventParent(obj: Evented): this
      // Adds an event parent - an `Evented` that will receive propagated events
      addEventParent: function(t) {
        return this._eventParents = this._eventParents || {}, this._eventParents[B(t)] = t, this;
      },
      // @method removeEventParent(obj: Evented): this
      // Removes an event parent, so it will stop receiving propagated events
      removeEventParent: function(t) {
        return this._eventParents && delete this._eventParents[B(t)], this;
      },
      _propagateEvent: function(t) {
        for (var e in this._eventParents)
          this._eventParents[e].fire(t.type, U({
            layer: t.target,
            propagatedFrom: t.target
          }, t), !0);
      }
    };
    ht.addEventListener = ht.on, ht.removeEventListener = ht.clearAllEventListeners = ht.off, ht.addOneTimeEventListener = ht.once, ht.fireEvent = ht.fire, ht.hasEventListeners = ht.listens;
    var ce = bt.extend(ht);
    function O(t, e, i) {
      this.x = i ? Math.round(t) : t, this.y = i ? Math.round(e) : e;
    }
    var _i = Math.trunc || function(t) {
      return t > 0 ? Math.floor(t) : Math.ceil(t);
    };
    O.prototype = {
      // @method clone(): Point
      // Returns a copy of the current point.
      clone: function() {
        return new O(this.x, this.y);
      },
      // @method add(otherPoint: Point): Point
      // Returns the result of addition of the current and the given points.
      add: function(t) {
        return this.clone()._add(S(t));
      },
      _add: function(t) {
        return this.x += t.x, this.y += t.y, this;
      },
      // @method subtract(otherPoint: Point): Point
      // Returns the result of subtraction of the given point from the current.
      subtract: function(t) {
        return this.clone()._subtract(S(t));
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
        return new O(this.x * t.x, this.y * t.y);
      },
      // @method unscaleBy(scale: Point): Point
      // Inverse of `scaleBy`. Divide each coordinate of the current point by
      // each coordinate of `scale`.
      unscaleBy: function(t) {
        return new O(this.x / t.x, this.y / t.y);
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
        return this.x = _i(this.x), this.y = _i(this.y), this;
      },
      // @method distanceTo(otherPoint: Point): Number
      // Returns the cartesian distance between the current and the given points.
      distanceTo: function(t) {
        t = S(t);
        var e = t.x - this.x, i = t.y - this.y;
        return Math.sqrt(e * e + i * i);
      },
      // @method equals(otherPoint: Point): Boolean
      // Returns `true` if the given point has the same coordinates.
      equals: function(t) {
        return t = S(t), t.x === this.x && t.y === this.y;
      },
      // @method contains(otherPoint: Point): Boolean
      // Returns `true` if both coordinates of the given point are less than the corresponding current point coordinates (in absolute values).
      contains: function(t) {
        return t = S(t), Math.abs(t.x) <= Math.abs(this.x) && Math.abs(t.y) <= Math.abs(this.y);
      },
      // @method toString(): String
      // Returns a string representation of the point for debugging purposes.
      toString: function() {
        return "Point(" + ct(this.x) + ", " + ct(this.y) + ")";
      }
    };
    function S(t, e, i) {
      return t instanceof O ? t : mt(t) ? new O(t[0], t[1]) : t == null ? t : typeof t == "object" && "x" in t && "y" in t ? new O(t.x, t.y) : new O(t, e, i);
    }
    function F(t, e) {
      if (t)
        for (var i = e ? [t, e] : t, n = 0, o = i.length; n < o; n++)
          this.extend(i[n]);
    }
    F.prototype = {
      // @method extend(point: Point): this
      // Extends the bounds to contain the given point.
      // @alternative
      // @method extend(otherBounds: Bounds): this
      // Extend the bounds to contain the given bounds
      extend: function(t) {
        var e, i;
        if (!t)
          return this;
        if (t instanceof O || typeof t[0] == "number" || "x" in t)
          e = i = S(t);
        else if (t = xt(t), e = t.min, i = t.max, !e || !i)
          return this;
        return !this.min && !this.max ? (this.min = e.clone(), this.max = i.clone()) : (this.min.x = Math.min(e.x, this.min.x), this.max.x = Math.max(i.x, this.max.x), this.min.y = Math.min(e.y, this.min.y), this.max.y = Math.max(i.y, this.max.y)), this;
      },
      // @method getCenter(round?: Boolean): Point
      // Returns the center point of the bounds.
      getCenter: function(t) {
        return S(
          (this.min.x + this.max.x) / 2,
          (this.min.y + this.max.y) / 2,
          t
        );
      },
      // @method getBottomLeft(): Point
      // Returns the bottom-left point of the bounds.
      getBottomLeft: function() {
        return S(this.min.x, this.max.y);
      },
      // @method getTopRight(): Point
      // Returns the top-right point of the bounds.
      getTopRight: function() {
        return S(this.max.x, this.min.y);
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
        return typeof t[0] == "number" || t instanceof O ? t = S(t) : t = xt(t), t instanceof F ? (e = t.min, i = t.max) : e = i = t, e.x >= this.min.x && i.x <= this.max.x && e.y >= this.min.y && i.y <= this.max.y;
      },
      // @method intersects(otherBounds: Bounds): Boolean
      // Returns `true` if the rectangle intersects the given bounds. Two bounds
      // intersect if they have at least one point in common.
      intersects: function(t) {
        t = xt(t);
        var e = this.min, i = this.max, n = t.min, o = t.max, a = o.x >= e.x && n.x <= i.x, l = o.y >= e.y && n.y <= i.y;
        return a && l;
      },
      // @method overlaps(otherBounds: Bounds): Boolean
      // Returns `true` if the rectangle overlaps the given bounds. Two bounds
      // overlap if their intersection is an area.
      overlaps: function(t) {
        t = xt(t);
        var e = this.min, i = this.max, n = t.min, o = t.max, a = o.x > e.x && n.x < i.x, l = o.y > e.y && n.y < i.y;
        return a && l;
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
        return xt(
          S(e.x - n, e.y - o),
          S(i.x + n, i.y + o)
        );
      },
      // @method equals(otherBounds: Bounds): Boolean
      // Returns `true` if the rectangle is equivalent to the given bounds.
      equals: function(t) {
        return t ? (t = xt(t), this.min.equals(t.getTopLeft()) && this.max.equals(t.getBottomRight())) : !1;
      }
    };
    function xt(t, e) {
      return !t || t instanceof F ? t : new F(t, e);
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
        if (t instanceof q)
          n = t, o = t;
        else if (t instanceof Lt) {
          if (n = t._southWest, o = t._northEast, !n || !o)
            return this;
        } else
          return t ? this.extend(R(t) || st(t)) : this;
        return !e && !i ? (this._southWest = new q(n.lat, n.lng), this._northEast = new q(o.lat, o.lng)) : (e.lat = Math.min(n.lat, e.lat), e.lng = Math.min(n.lng, e.lng), i.lat = Math.max(o.lat, i.lat), i.lng = Math.max(o.lng, i.lng)), this;
      },
      // @method pad(bufferRatio: Number): LatLngBounds
      // Returns bounds created by extending or retracting the current bounds by a given ratio in each direction.
      // For example, a ratio of 0.5 extends the bounds by 50% in each direction.
      // Negative values will retract the bounds.
      pad: function(t) {
        var e = this._southWest, i = this._northEast, n = Math.abs(e.lat - i.lat) * t, o = Math.abs(e.lng - i.lng) * t;
        return new Lt(
          new q(e.lat - n, e.lng - o),
          new q(i.lat + n, i.lng + o)
        );
      },
      // @method getCenter(): LatLng
      // Returns the center point of the bounds.
      getCenter: function() {
        return new q(
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
        return new q(this.getNorth(), this.getWest());
      },
      // @method getSouthEast(): LatLng
      // Returns the south-east point of the bounds.
      getSouthEast: function() {
        return new q(this.getSouth(), this.getEast());
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
        typeof t[0] == "number" || t instanceof q || "lat" in t ? t = R(t) : t = st(t);
        var e = this._southWest, i = this._northEast, n, o;
        return t instanceof Lt ? (n = t.getSouthWest(), o = t.getNorthEast()) : n = o = t, n.lat >= e.lat && o.lat <= i.lat && n.lng >= e.lng && o.lng <= i.lng;
      },
      // @method intersects(otherBounds: LatLngBounds): Boolean
      // Returns `true` if the rectangle intersects the given bounds. Two bounds intersect if they have at least one point in common.
      intersects: function(t) {
        t = st(t);
        var e = this._southWest, i = this._northEast, n = t.getSouthWest(), o = t.getNorthEast(), a = o.lat >= e.lat && n.lat <= i.lat, l = o.lng >= e.lng && n.lng <= i.lng;
        return a && l;
      },
      // @method overlaps(otherBounds: LatLngBounds): Boolean
      // Returns `true` if the rectangle overlaps the given bounds. Two bounds overlap if their intersection is an area.
      overlaps: function(t) {
        t = st(t);
        var e = this._southWest, i = this._northEast, n = t.getSouthWest(), o = t.getNorthEast(), a = o.lat > e.lat && n.lat < i.lat, l = o.lng > e.lng && n.lng < i.lng;
        return a && l;
      },
      // @method toBBoxString(): String
      // Returns a string with bounding box coordinates in a 'southwest_lng,southwest_lat,northeast_lng,northeast_lat' format. Useful for sending requests to web services that return geo data.
      toBBoxString: function() {
        return [this.getWest(), this.getSouth(), this.getEast(), this.getNorth()].join(",");
      },
      // @method equals(otherBounds: LatLngBounds, maxMargin?: Number): Boolean
      // Returns `true` if the rectangle is equivalent (within a small margin of error) to the given bounds. The margin of error can be overridden by setting `maxMargin` to a small number.
      equals: function(t, e) {
        return t ? (t = st(t), this._southWest.equals(t.getSouthWest(), e) && this._northEast.equals(t.getNorthEast(), e)) : !1;
      },
      // @method isValid(): Boolean
      // Returns `true` if the bounds are properly initialized.
      isValid: function() {
        return !!(this._southWest && this._northEast);
      }
    };
    function st(t, e) {
      return t instanceof Lt ? t : new Lt(t, e);
    }
    function q(t, e, i) {
      if (isNaN(t) || isNaN(e))
        throw new Error("Invalid LatLng object: (" + t + ", " + e + ")");
      this.lat = +t, this.lng = +e, i !== void 0 && (this.alt = +i);
    }
    q.prototype = {
      // @method equals(otherLatLng: LatLng, maxMargin?: Number): Boolean
      // Returns `true` if the given `LatLng` point is at the same position (within a small margin of error). The margin of error can be overridden by setting `maxMargin` to a small number.
      equals: function(t, e) {
        if (!t)
          return !1;
        t = R(t);
        var i = Math.max(
          Math.abs(this.lat - t.lat),
          Math.abs(this.lng - t.lng)
        );
        return i <= (e === void 0 ? 1e-9 : e);
      },
      // @method toString(): String
      // Returns a string representation of the point (for debugging purposes).
      toString: function(t) {
        return "LatLng(" + ct(this.lat, t) + ", " + ct(this.lng, t) + ")";
      },
      // @method distanceTo(otherLatLng: LatLng): Number
      // Returns the distance (in meters) to the given `LatLng` calculated using the [Spherical Law of Cosines](https://en.wikipedia.org/wiki/Spherical_law_of_cosines).
      distanceTo: function(t) {
        return At.distance(this, R(t));
      },
      // @method wrap(): LatLng
      // Returns a new `LatLng` object with the longitude wrapped so it's always between -180 and +180 degrees.
      wrap: function() {
        return At.wrapLatLng(this);
      },
      // @method toBounds(sizeInMeters: Number): LatLngBounds
      // Returns a new `LatLngBounds` object in which each boundary is `sizeInMeters/2` meters apart from the `LatLng`.
      toBounds: function(t) {
        var e = 180 * t / 40075017, i = e / Math.cos(Math.PI / 180 * this.lat);
        return st(
          [this.lat - e, this.lng - i],
          [this.lat + e, this.lng + i]
        );
      },
      clone: function() {
        return new q(this.lat, this.lng, this.alt);
      }
    };
    function R(t, e, i) {
      return t instanceof q ? t : mt(t) && typeof t[0] != "object" ? t.length === 3 ? new q(t[0], t[1], t[2]) : t.length === 2 ? new q(t[0], t[1]) : null : t == null ? t : typeof t == "object" && "lat" in t ? new q(t.lat, "lng" in t ? t.lng : t.lon, t.alt) : e === void 0 ? null : new q(t, e, i);
    }
    var p = {
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
        return new F(n, o);
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
        var e = this.wrapLng ? nt(t.lng, this.wrapLng, !0) : t.lng, i = this.wrapLat ? nt(t.lat, this.wrapLat, !0) : t.lat, n = t.alt;
        return new q(i, e, n);
      },
      // @method wrapLatLngBounds(bounds: LatLngBounds): LatLngBounds
      // Returns a `LatLngBounds` with the same size as the given one, ensuring
      // that its center is within the CRS's bounds.
      // Only accepts actual `L.LatLngBounds` instances, not arrays.
      wrapLatLngBounds: function(t) {
        var e = t.getCenter(), i = this.wrapLatLng(e), n = e.lat - i.lat, o = e.lng - i.lng;
        if (n === 0 && o === 0)
          return t;
        var a = t.getSouthWest(), l = t.getNorthEast(), h = new q(a.lat - n, a.lng - o), c = new q(l.lat - n, l.lng - o);
        return new Lt(h, c);
      }
    }, At = U({}, p, {
      wrapLng: [-180, 180],
      // Mean Earth Radius, as recommended for use by
      // the International Union of Geodesy and Geophysics,
      // see https://rosettacode.org/wiki/Haversine_formula
      R: 6371e3,
      // distance between two geographical points using spherical law of cosines approximation
      distance: function(t, e) {
        var i = Math.PI / 180, n = t.lat * i, o = e.lat * i, a = Math.sin((e.lat - t.lat) * i / 2), l = Math.sin((e.lng - t.lng) * i / 2), h = a * a + Math.cos(n) * Math.cos(o) * l * l, c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
        return this.R * c;
      }
    }), pi = 6378137, de = {
      R: pi,
      MAX_LATITUDE: 85.0511287798,
      project: function(t) {
        var e = Math.PI / 180, i = this.MAX_LATITUDE, n = Math.max(Math.min(i, t.lat), -i), o = Math.sin(n * e);
        return new O(
          this.R * t.lng * e,
          this.R * Math.log((1 + o) / (1 - o)) / 2
        );
      },
      unproject: function(t) {
        var e = 180 / Math.PI;
        return new q(
          (2 * Math.atan(Math.exp(t.y / this.R)) - Math.PI / 2) * e,
          t.x * e / this.R
        );
      },
      bounds: function() {
        var t = pi * Math.PI;
        return new F([-t, -t], [t, t]);
      }()
    };
    function fe(t, e, i, n) {
      if (mt(t)) {
        this._a = t[0], this._b = t[1], this._c = t[2], this._d = t[3];
        return;
      }
      this._a = t, this._b = e, this._c = i, this._d = n;
    }
    fe.prototype = {
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
        return e = e || 1, new O(
          (t.x / e - this._b) / this._a,
          (t.y / e - this._d) / this._c
        );
      }
    };
    function Xt(t, e, i, n) {
      return new fe(t, e, i, n);
    }
    var _e = U({}, At, {
      code: "EPSG:3857",
      projection: de,
      transformation: function() {
        var t = 0.5 / (Math.PI * de.R);
        return Xt(t, 0.5, -t, 0.5);
      }()
    }), Ie = U({}, _e, {
      code: "EPSG:900913"
    });
    function xe(t) {
      return document.createElementNS("http://www.w3.org/2000/svg", t);
    }
    function Le(t, e) {
      var i = "", n, o, a, l, h, c;
      for (n = 0, a = t.length; n < a; n++) {
        for (h = t[n], o = 0, l = h.length; o < l; o++)
          c = h[o], i += (o ? "L" : "M") + c.x + " " + c.y;
        i += e ? w.svg ? "z" : "x" : "";
      }
      return i || "M0 0";
    }
    var pe = document.documentElement.style, zt = "ActiveXObject" in window, Ae = zt && !document.addEventListener, mi = "msLaunchUri" in navigator && !("documentMode" in document), Bt = Ft("webkit"), D = Ft("android"), vi = Ft("android 2") || Ft("android 3"), Gi = parseInt(/WebKit\/([0-9]+)|$/.exec(navigator.userAgent)[1], 10), ji = D && Ft("Google") && Gi < 537 && !("AudioNode" in window), Be = !!window.opera, gi = !mi && Ft("chrome"), Tt = Ft("gecko") && !Bt && !Be && !zt, Ne = !gi && Ft("safari"), me = Ft("phantom"), Q = "OTransition" in pe, k = navigator.platform.indexOf("Win") === 0, Re = zt && "transition" in pe, De = "WebKitCSSMatrix" in window && "m11" in new window.WebKitCSSMatrix() && !vi, Ke = "MozPerspective" in pe, Pe = !window.L_DISABLE_3D && (Re || De || Ke) && !Q && !me, Dt = typeof orientation < "u" || Ft("mobile"), ve = Dt && Bt, Je = Dt && De, jt = !window.PointerEvent && window.MSPointerEvent, yi = !!(window.PointerEvent || jt), wi = "ontouchstart" in window || !!window.TouchEvent, Ve = !window.L_NO_TOUCH && (wi || yi), Mt = Dt && Be, Vt = Dt && Tt, qi = (window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI) > 1, $i = function() {
      var t = !1;
      try {
        var e = Object.defineProperty({}, "passive", {
          get: function() {
            t = !0;
          }
        });
        window.addEventListener("testPassiveEventSupport", X, e), window.removeEventListener("testPassiveEventSupport", X, e);
      } catch {
      }
      return t;
    }(), bi = function() {
      return !!document.createElement("canvas").getContext;
    }(), Ye = !!(document.createElementNS && xe("svg").createSVGRect), Xe = !!Ye && function() {
      var t = document.createElement("div");
      return t.innerHTML = "<svg/>", (t.firstChild && t.firstChild.namespaceURI) === "http://www.w3.org/2000/svg";
    }(), Ki = !Ye && function() {
      try {
        var t = document.createElement("div");
        t.innerHTML = '<v:shape adj="1"/>';
        var e = t.firstChild;
        return e.style.behavior = "url(#default#VML)", e && typeof e.adj == "object";
      } catch {
        return !1;
      }
    }(), Qe = navigator.platform.indexOf("Mac") === 0, Ji = navigator.platform.indexOf("Linux") === 0;
    function Ft(t) {
      return navigator.userAgent.toLowerCase().indexOf(t) >= 0;
    }
    var w = {
      ie: zt,
      ielt9: Ae,
      edge: mi,
      webkit: Bt,
      android: D,
      android23: vi,
      androidStock: ji,
      opera: Be,
      chrome: gi,
      gecko: Tt,
      safari: Ne,
      phantom: me,
      opera12: Q,
      win: k,
      ie3d: Re,
      webkit3d: De,
      gecko3d: Ke,
      any3d: Pe,
      mobile: Dt,
      mobileWebkit: ve,
      mobileWebkit3d: Je,
      msPointer: jt,
      pointer: yi,
      touch: Ve,
      touchNative: wi,
      mobileOpera: Mt,
      mobileGecko: Vt,
      retina: qi,
      passiveEvents: $i,
      canvas: bi,
      svg: Ye,
      vml: Ki,
      inlineSvg: Xe,
      mac: Qe,
      linux: Ji
    }, xi = w.msPointer ? "MSPointerDown" : "pointerdown", m = w.msPointer ? "MSPointerMove" : "pointermove", s = w.msPointer ? "MSPointerUp" : "pointerup", u = w.msPointer ? "MSPointerCancel" : "pointercancel", E = {
      touchstart: xi,
      touchmove: m,
      touchend: s,
      touchcancel: u
    }, b = {
      touchstart: vt,
      touchmove: J,
      touchend: J,
      touchcancel: J
    }, I = {}, $ = !1;
    function St(t, e, i) {
      return e === "touchstart" && G(), b[e] ? (i = b[e].bind(this, i), t.addEventListener(E[e], i, !1), i) : (console.warn("wrong event specified:", e), X);
    }
    function Li(t, e, i) {
      if (!E[e]) {
        console.warn("wrong event specified:", e);
        return;
      }
      t.removeEventListener(E[e], i, !1);
    }
    function Pi(t) {
      I[t.pointerId] = t;
    }
    function Ti(t) {
      I[t.pointerId] && (I[t.pointerId] = t);
    }
    function _(t) {
      delete I[t.pointerId];
    }
    function G() {
      $ || (document.addEventListener(xi, Pi, !0), document.addEventListener(m, Ti, !0), document.addEventListener(s, _, !0), document.addEventListener(u, _, !0), $ = !0);
    }
    function J(t, e) {
      if (e.pointerType !== (e.MSPOINTER_TYPE_MOUSE || "mouse")) {
        e.touches = [];
        for (var i in I)
          e.touches.push(I[i]);
        e.changedTouches = [e], t(e);
      }
    }
    function vt(t, e) {
      e.MSPOINTER_TYPE_TOUCH && e.pointerType === e.MSPOINTER_TYPE_TOUCH && kt(e), J(t, e);
    }
    function dt(t) {
      var e = {}, i, n;
      for (n in t)
        i = t[n], e[n] = i && i.bind ? i.bind(t) : i;
      return t = e, e.type = "dblclick", e.detail = 2, e.isTrusted = !1, e._simulated = !0, e;
    }
    var ft = 200;
    function yo(t, e) {
      t.addEventListener("dblclick", e);
      var i = 0, n;
      function o(a) {
        if (a.detail !== 1) {
          n = a.detail;
          return;
        }
        if (!(a.pointerType === "mouse" || a.sourceCapabilities && !a.sourceCapabilities.firesTouchEvents)) {
          var l = zn(a);
          if (!(l.some(function(c) {
            return c instanceof HTMLLabelElement && c.attributes.for;
          }) && !l.some(function(c) {
            return c instanceof HTMLInputElement || c instanceof HTMLSelectElement;
          }))) {
            var h = Date.now();
            h - i <= ft ? (n++, n === 2 && e(dt(a))) : n = 1, i = h;
          }
        }
      }
      return t.addEventListener("click", o), {
        dblclick: e,
        simDblclick: o
      };
    }
    function wo(t, e) {
      t.removeEventListener("dblclick", e.dblclick), t.removeEventListener("click", e.simDblclick);
    }
    var Yi = Mi(
      ["transform", "webkitTransform", "OTransform", "MozTransform", "msTransform"]
    ), ti = Mi(
      ["webkitTransition", "transition", "OTransition", "MozTransition", "msTransition"]
    ), kn = ti === "webkitTransition" || ti === "OTransition" ? ti + "End" : "transitionend";
    function Cn(t) {
      return typeof t == "string" ? document.getElementById(t) : t;
    }
    function ei(t, e) {
      var i = t.style[e] || t.currentStyle && t.currentStyle[e];
      if ((!i || i === "auto") && document.defaultView) {
        var n = document.defaultView.getComputedStyle(t, null);
        i = n ? n[e] : null;
      }
      return i === "auto" ? null : i;
    }
    function j(t, e, i) {
      var n = document.createElement(t);
      return n.className = e || "", i && i.appendChild(n), n;
    }
    function at(t) {
      var e = t.parentNode;
      e && e.removeChild(t);
    }
    function ki(t) {
      for (; t.firstChild; )
        t.removeChild(t.firstChild);
    }
    function Fe(t) {
      var e = t.parentNode;
      e && e.lastChild !== t && e.appendChild(t);
    }
    function Ue(t) {
      var e = t.parentNode;
      e && e.firstChild !== t && e.insertBefore(t, e.firstChild);
    }
    function Xi(t, e) {
      if (t.classList !== void 0)
        return t.classList.contains(e);
      var i = Ci(t);
      return i.length > 0 && new RegExp("(^|\\s)" + e + "(\\s|$)").test(i);
    }
    function A(t, e) {
      if (t.classList !== void 0)
        for (var i = ot(e), n = 0, o = i.length; n < o; n++)
          t.classList.add(i[n]);
      else if (!Xi(t, e)) {
        var a = Ci(t);
        Qi(t, (a ? a + " " : "") + e);
      }
    }
    function _t(t, e) {
      t.classList !== void 0 ? t.classList.remove(e) : Qi(t, Ot((" " + Ci(t) + " ").replace(" " + e + " ", " ")));
    }
    function Qi(t, e) {
      t.className.baseVal === void 0 ? t.className = e : t.className.baseVal = e;
    }
    function Ci(t) {
      return t.correspondingElement && (t = t.correspondingElement), t.className.baseVal === void 0 ? t.className : t.className.baseVal;
    }
    function Ut(t, e) {
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
    function Mi(t) {
      for (var e = document.documentElement.style, i = 0; i < t.length; i++)
        if (t[i] in e)
          return t[i];
      return !1;
    }
    function Te(t, e, i) {
      var n = e || new O(0, 0);
      t.style[Yi] = (w.ie3d ? "translate(" + n.x + "px," + n.y + "px)" : "translate3d(" + n.x + "px," + n.y + "px,0)") + (i ? " scale(" + i + ")" : "");
    }
    function gt(t, e) {
      t._leaflet_pos = e, w.any3d ? Te(t, e) : (t.style.left = e.x + "px", t.style.top = e.y + "px");
    }
    function ke(t) {
      return t._leaflet_pos || new O(0, 0);
    }
    var ii, ni, tn;
    if ("onselectstart" in document)
      ii = function() {
        Z(window, "selectstart", kt);
      }, ni = function() {
        tt(window, "selectstart", kt);
      };
    else {
      var oi = Mi(
        ["userSelect", "WebkitUserSelect", "OUserSelect", "MozUserSelect", "msUserSelect"]
      );
      ii = function() {
        if (oi) {
          var t = document.documentElement.style;
          tn = t[oi], t[oi] = "none";
        }
      }, ni = function() {
        oi && (document.documentElement.style[oi] = tn, tn = void 0);
      };
    }
    function en() {
      Z(window, "dragstart", kt);
    }
    function nn() {
      tt(window, "dragstart", kt);
    }
    var Si, on;
    function sn(t) {
      for (; t.tabIndex === -1; )
        t = t.parentNode;
      t.style && (zi(), Si = t, on = t.style.outlineStyle, t.style.outlineStyle = "none", Z(window, "keydown", zi));
    }
    function zi() {
      Si && (Si.style.outlineStyle = on, Si = void 0, on = void 0, tt(window, "keydown", zi));
    }
    function Mn(t) {
      do
        t = t.parentNode;
      while ((!t.offsetWidth || !t.offsetHeight) && t !== document.body);
      return t;
    }
    function an(t) {
      var e = t.getBoundingClientRect();
      return {
        x: e.width / t.offsetWidth || 1,
        y: e.height / t.offsetHeight || 1,
        boundingClientRect: e
      };
    }
    var xo = {
      __proto__: null,
      TRANSFORM: Yi,
      TRANSITION: ti,
      TRANSITION_END: kn,
      get: Cn,
      getStyle: ei,
      create: j,
      remove: at,
      empty: ki,
      toFront: Fe,
      toBack: Ue,
      hasClass: Xi,
      addClass: A,
      removeClass: _t,
      setClass: Qi,
      getClass: Ci,
      setOpacity: Ut,
      testProp: Mi,
      setTransform: Te,
      setPosition: gt,
      getPosition: ke,
      get disableTextSelection() {
        return ii;
      },
      get enableTextSelection() {
        return ni;
      },
      disableImageDrag: en,
      enableImageDrag: nn,
      preventOutline: sn,
      restoreOutline: zi,
      getSizedParentNode: Mn,
      getScale: an
    };
    function Z(t, e, i, n) {
      if (e && typeof e == "object")
        for (var o in e)
          ln(t, o, e[o], i);
      else {
        e = ot(e);
        for (var a = 0, l = e.length; a < l; a++)
          ln(t, e[a], i, n);
      }
      return this;
    }
    var Qt = "_leaflet_events";
    function tt(t, e, i, n) {
      if (arguments.length === 1)
        Sn(t), delete t[Qt];
      else if (e && typeof e == "object")
        for (var o in e)
          un(t, o, e[o], i);
      else if (e = ot(e), arguments.length === 2)
        Sn(t, function(h) {
          return ne(e, h) !== -1;
        });
      else
        for (var a = 0, l = e.length; a < l; a++)
          un(t, e[a], i, n);
      return this;
    }
    function Sn(t, e) {
      for (var i in t[Qt]) {
        var n = i.split(/\d/)[0];
        (!e || e(n)) && un(t, n, null, null, i);
      }
    }
    var rn = {
      mouseenter: "mouseover",
      mouseleave: "mouseout",
      wheel: !("onwheel" in window) && "mousewheel"
    };
    function ln(t, e, i, n) {
      var o = e + B(i) + (n ? "_" + B(n) : "");
      if (t[Qt] && t[Qt][o])
        return this;
      var a = function(h) {
        return i.call(n || t, h || window.event);
      }, l = a;
      !w.touchNative && w.pointer && e.indexOf("touch") === 0 ? a = St(t, e, a) : w.touch && e === "dblclick" ? a = yo(t, a) : "addEventListener" in t ? e === "touchstart" || e === "touchmove" || e === "wheel" || e === "mousewheel" ? t.addEventListener(rn[e] || e, a, w.passiveEvents ? { passive: !1 } : !1) : e === "mouseenter" || e === "mouseleave" ? (a = function(h) {
        h = h || window.event, cn(t, h) && l(h);
      }, t.addEventListener(rn[e], a, !1)) : t.addEventListener(e, l, !1) : t.attachEvent("on" + e, a), t[Qt] = t[Qt] || {}, t[Qt][o] = a;
    }
    function un(t, e, i, n, o) {
      o = o || e + B(i) + (n ? "_" + B(n) : "");
      var a = t[Qt] && t[Qt][o];
      if (!a)
        return this;
      !w.touchNative && w.pointer && e.indexOf("touch") === 0 ? Li(t, e, a) : w.touch && e === "dblclick" ? wo(t, a) : "removeEventListener" in t ? t.removeEventListener(rn[e] || e, a, !1) : t.detachEvent("on" + e, a), t[Qt][o] = null;
    }
    function Ce(t) {
      return t.stopPropagation ? t.stopPropagation() : t.originalEvent ? t.originalEvent._stopped = !0 : t.cancelBubble = !0, this;
    }
    function hn(t) {
      return ln(t, "wheel", Ce), this;
    }
    function si(t) {
      return Z(t, "mousedown touchstart dblclick contextmenu", Ce), t._leaflet_disable_click = !0, this;
    }
    function kt(t) {
      return t.preventDefault ? t.preventDefault() : t.returnValue = !1, this;
    }
    function Me(t) {
      return kt(t), Ce(t), this;
    }
    function zn(t) {
      if (t.composedPath)
        return t.composedPath();
      for (var e = [], i = t.target; i; )
        e.push(i), i = i.parentNode;
      return e;
    }
    function En(t, e) {
      if (!e)
        return new O(t.clientX, t.clientY);
      var i = an(e), n = i.boundingClientRect;
      return new O(
        // offset.left/top values are in page scale (like clientX/Y),
        // whereas clientLeft/Top (border width) values are the original values (before CSS scale applies).
        (t.clientX - n.left) / i.x - e.clientLeft,
        (t.clientY - n.top) / i.y - e.clientTop
      );
    }
    var Lo = w.linux && w.chrome ? window.devicePixelRatio : w.mac ? window.devicePixelRatio * 3 : window.devicePixelRatio > 0 ? 2 * window.devicePixelRatio : 1;
    function On(t) {
      return w.edge ? t.wheelDeltaY / 2 : (
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
    function cn(t, e) {
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
      on: Z,
      off: tt,
      stopPropagation: Ce,
      disableScrollPropagation: hn,
      disableClickPropagation: si,
      preventDefault: kt,
      stop: Me,
      getPropagationPath: zn,
      getMousePosition: En,
      getWheelDelta: On,
      isExternalTarget: cn,
      addListener: Z,
      removeListener: tt
    }, Zn = ce.extend({
      // @method run(el: HTMLElement, newPos: Point, duration?: Number, easeLinearity?: Number)
      // Run an animation of a given element to a new position, optionally setting
      // duration in seconds (`0.25` by default) and easing linearity factor (3rd
      // argument of the [cubic bezier curve](https://cubic-bezier.com/#0,0,.5,1),
      // `0.5` by default).
      run: function(t, e, i, n) {
        this.stop(), this._el = t, this._inProgress = !0, this._duration = i || 0.25, this._easeOutPower = 1 / Math.max(n || 0.5, 0.2), this._startPos = ke(t), this._offset = e.subtract(this._startPos), this._startTime = +/* @__PURE__ */ new Date(), this.fire("start"), this._animate();
      },
      // @method stop()
      // Stops the animation (if currently running).
      stop: function() {
        this._inProgress && (this._step(!0), this._complete());
      },
      _animate: function() {
        this._animId = P(this._animate, this), this._step();
      },
      _step: function(t) {
        var e = +/* @__PURE__ */ new Date() - this._startTime, i = this._duration * 1e3;
        e < i ? this._runFrame(this._easeOut(e / i), t) : (this._runFrame(1), this._complete());
      },
      _runFrame: function(t, e) {
        var i = this._startPos.add(this._offset.multiplyBy(t));
        e && i._round(), gt(this._el, i), this.fire("step");
      },
      _complete: function() {
        N(this._animId), this._inProgress = !1, this.fire("end");
      },
      _easeOut: function(t) {
        return 1 - Math.pow(1 - t, this._easeOutPower);
      }
    }), H = ce.extend({
      options: {
        // @section Map State Options
        // @option crs: CRS = L.CRS.EPSG3857
        // The [Coordinate Reference System](#crs) to use. Don't change this if you're not
        // sure what it means.
        crs: _e,
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
        e = K(this, e), this._handlers = [], this._layers = {}, this._zoomBoundLayers = {}, this._sizeChanged = !0, this._initContainer(t), this._initLayout(), this._onResize = W(this._onResize, this), this._initEvents(), e.maxBounds && this.setMaxBounds(e.maxBounds), e.zoom !== void 0 && (this._zoom = this._limitZoom(e.zoom)), e.center && e.zoom !== void 0 && this.setView(R(e.center), e.zoom, { reset: !0 }), this.callInitHooks(), this._zoomAnimated = ti && w.any3d && !w.mobileOpera && this.options.zoomAnimation, this._zoomAnimated && (this._createAnimProxy(), Z(this._proxy, kn, this._catchTransitionEnd, this)), this._addLayers(this.options.layers);
      },
      // @section Methods for modifying map state
      // @method setView(center: LatLng, zoom: Number, options?: Zoom/pan options): this
      // Sets the view of the map (geographical center and zoom) with the given
      // animation options.
      setView: function(t, e, i) {
        if (e = e === void 0 ? this._zoom : this._limitZoom(e), t = this._limitCenter(R(t), e, this.options.maxBounds), i = i || {}, this._stop(), this._loaded && !i.reset && i !== !0) {
          i.animate !== void 0 && (i.zoom = U({ animate: i.animate }, i.zoom), i.pan = U({ animate: i.animate, duration: i.duration }, i.pan));
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
        return t = t || (w.any3d ? this.options.zoomDelta : 1), this.setZoom(this._zoom + t, e);
      },
      // @method zoomOut(delta?: Number, options?: Zoom options): this
      // Decreases the zoom of the map by `delta` ([`zoomDelta`](#map-zoomdelta) by default).
      zoomOut: function(t, e) {
        return t = t || (w.any3d ? this.options.zoomDelta : 1), this.setZoom(this._zoom - t, e);
      },
      // @method setZoomAround(latlng: LatLng, zoom: Number, options: Zoom options): this
      // Zooms the map while keeping a specified geographical point on the map
      // stationary (e.g. used internally for scroll zoom and double-click zoom).
      // @alternative
      // @method setZoomAround(offset: Point, zoom: Number, options: Zoom options): this
      // Zooms the map while keeping a specified pixel on the map (relative to the top-left corner) stationary.
      setZoomAround: function(t, e, i) {
        var n = this.getZoomScale(e), o = this.getSize().divideBy(2), a = t instanceof O ? t : this.latLngToContainerPoint(t), l = a.subtract(o).multiplyBy(1 - 1 / n), h = this.containerPointToLatLng(o.add(l));
        return this.setView(h, e, { zoom: i });
      },
      _getBoundsCenterZoom: function(t, e) {
        e = e || {}, t = t.getBounds ? t.getBounds() : st(t);
        var i = S(e.paddingTopLeft || e.padding || [0, 0]), n = S(e.paddingBottomRight || e.padding || [0, 0]), o = this.getBoundsZoom(t, !1, i.add(n));
        if (o = typeof e.maxZoom == "number" ? Math.min(e.maxZoom, o) : o, o === 1 / 0)
          return {
            center: t.getCenter(),
            zoom: o
          };
        var a = n.subtract(i).divideBy(2), l = this.project(t.getSouthWest(), o), h = this.project(t.getNorthEast(), o), c = this.unproject(l.add(h).divideBy(2).add(a), o);
        return {
          center: c,
          zoom: o
        };
      },
      // @method fitBounds(bounds: LatLngBounds, options?: fitBounds options): this
      // Sets a map view that contains the given geographical bounds with the
      // maximum zoom level possible.
      fitBounds: function(t, e) {
        if (t = st(t), !t.isValid())
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
        if (t = S(t).round(), e = e || {}, !t.x && !t.y)
          return this.fire("moveend");
        if (e.animate !== !0 && !this.getSize().contains(t))
          return this._resetView(this.unproject(this.project(this.getCenter()).add(t)), this.getZoom()), this;
        if (this._panAnim || (this._panAnim = new Zn(), this._panAnim.on({
          step: this._onPanTransitionStep,
          end: this._onPanTransitionEnd
        }, this)), e.noMoveStart || this.fire("movestart"), e.animate !== !1) {
          A(this._mapPane, "leaflet-pan-anim");
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
        if (i = i || {}, i.animate === !1 || !w.any3d)
          return this.setView(t, e, i);
        this._stop();
        var n = this.project(this.getCenter()), o = this.project(t), a = this.getSize(), l = this._zoom;
        t = R(t), e = e === void 0 ? l : e;
        var h = Math.max(a.x, a.y), c = h * this.getZoomScale(l, e), f = o.distanceTo(n) || 1, v = 1.42, C = v * v;
        function V(yt) {
          var Ui = yt ? -1 : 1, ds = yt ? c : h, fs = c * c - h * h + Ui * C * C * f * f, _s = 2 * ds * C * f, xn = fs / _s, _o = Math.sqrt(xn * xn + 1) - xn, ps = _o < 1e-9 ? -18 : Math.log(_o);
          return ps;
        }
        function Et(yt) {
          return (Math.exp(yt) - Math.exp(-yt)) / 2;
        }
        function Pt(yt) {
          return (Math.exp(yt) + Math.exp(-yt)) / 2;
        }
        function Ht(yt) {
          return Et(yt) / Pt(yt);
        }
        var Zt = V(0);
        function $e(yt) {
          return h * (Pt(Zt) / Pt(Zt + v * yt));
        }
        function ls(yt) {
          return h * (Pt(Zt) * Ht(Zt + v * yt) - Et(Zt)) / C;
        }
        function us(yt) {
          return 1 - Math.pow(1 - yt, 1.5);
        }
        var hs = Date.now(), co = (V(1) - Zt) / v, cs = i.duration ? 1e3 * i.duration : 1e3 * co * 0.8;
        function fo() {
          var yt = (Date.now() - hs) / cs, Ui = us(yt) * co;
          yt <= 1 ? (this._flyToFrame = P(fo, this), this._move(
            this.unproject(n.add(o.subtract(n).multiplyBy(ls(Ui) / f)), l),
            this.getScaleZoom(h / $e(Ui), l),
            { flyTo: !0 }
          )) : this._move(t, e)._moveEnd(!0);
        }
        return this._moveStart(!0, i.noMoveStart), fo.call(this), this;
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
        return t = st(t), this.listens("moveend", this._panInsideMaxBounds) && this.off("moveend", this._panInsideMaxBounds), t.isValid() ? (this.options.maxBounds = t, this._loaded && this._panInsideMaxBounds(), this.on("moveend", this._panInsideMaxBounds)) : (this.options.maxBounds = null, this);
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
        var i = this.getCenter(), n = this._limitCenter(i, this._zoom, st(t));
        return i.equals(n) || this.panTo(n, e), this._enforcingBounds = !1, this;
      },
      // @method panInside(latlng: LatLng, options?: padding options): this
      // Pans the map the minimum amount to make the `latlng` visible. Use
      // padding options to fit the display to more restricted bounds.
      // If `latlng` is already within the (optionally padded) display bounds,
      // the map will not be panned.
      panInside: function(t, e) {
        e = e || {};
        var i = S(e.paddingTopLeft || e.padding || [0, 0]), n = S(e.paddingBottomRight || e.padding || [0, 0]), o = this.project(this.getCenter()), a = this.project(t), l = this.getPixelBounds(), h = xt([l.min.add(i), l.max.subtract(n)]), c = h.getSize();
        if (!h.contains(a)) {
          this._enforcingBounds = !0;
          var f = a.subtract(h.getCenter()), v = h.extend(a).getSize().subtract(c);
          o.x += f.x < 0 ? -v.x : v.x, o.y += f.y < 0 ? -v.y : v.y, this.panTo(this.unproject(o), e), this._enforcingBounds = !1;
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
        t = U({
          animate: !1,
          pan: !0
        }, t === !0 ? { animate: !0 } : t);
        var e = this.getSize();
        this._sizeChanged = !0, this._lastCenter = null;
        var i = this.getSize(), n = e.divideBy(2).round(), o = i.divideBy(2).round(), a = n.subtract(o);
        return !a.x && !a.y ? this : (t.animate && t.pan ? this.panBy(a) : (t.pan && this._rawPanBy(a), this.fire("move"), t.debounceMoveend ? (clearTimeout(this._sizeTimer), this._sizeTimer = setTimeout(W(this.fire, this, "moveend"), 200)) : this.fire("moveend")), this.fire("resize", {
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
        if (t = this._locateOptions = U({
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
        var e = W(this._handleGeolocationResponse, this), i = W(this._handleGeolocationError, this);
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
          var e = t.coords.latitude, i = t.coords.longitude, n = new q(e, i), o = n.toBounds(t.coords.accuracy * 2), a = this._locateOptions;
          if (a.setView) {
            var l = this.getBoundsZoom(o);
            this.setView(n, a.maxZoom ? Math.min(l, a.maxZoom) : l);
          }
          var h = {
            latlng: n,
            bounds: o,
            timestamp: t.timestamp
          };
          for (var c in t.coords)
            typeof t.coords[c] == "number" && (h[c] = t.coords[c]);
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
        this._locationWatchId !== void 0 && this.stopLocate(), this._stop(), at(this._mapPane), this._clearControlPos && this._clearControlPos(), this._resizeRequest && (N(this._resizeRequest), this._resizeRequest = null), this._clearHandlers(), this._loaded && this.fire("unload");
        var t;
        for (t in this._layers)
          this._layers[t].remove();
        for (t in this._panes)
          at(this._panes[t]);
        return this._layers = [], this._panes = [], delete this._mapPane, delete this._renderer, this;
      },
      // @section Other Methods
      // @method createPane(name: String, container?: HTMLElement): HTMLElement
      // Creates a new [map pane](#map-pane) with the given name if it doesn't exist already,
      // then returns it. The pane is created as a child of `container`, or
      // as a child of the main map pane if not set.
      createPane: function(t, e) {
        var i = "leaflet-pane" + (t ? " leaflet-" + t.replace("Pane", "") + "-pane" : ""), n = j("div", i, e || this._mapPane);
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
        t = st(t), i = S(i || [0, 0]);
        var n = this.getZoom() || 0, o = this.getMinZoom(), a = this.getMaxZoom(), l = t.getNorthWest(), h = t.getSouthEast(), c = this.getSize().subtract(i), f = xt(this.project(h, n), this.project(l, n)).getSize(), v = w.any3d ? this.options.zoomSnap : 1, C = c.x / f.x, V = c.y / f.y, Et = e ? Math.max(C, V) : Math.min(C, V);
        return n = this.getScaleZoom(Et, n), v && (n = Math.round(n / (v / 100)) * (v / 100), n = e ? Math.ceil(n / v) * v : Math.floor(n / v) * v), Math.max(o, Math.min(a, n));
      },
      // @method getSize(): Point
      // Returns the current size of the map container (in pixels).
      getSize: function() {
        return (!this._size || this._sizeChanged) && (this._size = new O(
          this._container.clientWidth || 0,
          this._container.clientHeight || 0
        ), this._sizeChanged = !1), this._size.clone();
      },
      // @method getPixelBounds(): Bounds
      // Returns the bounds of the current map view in projected pixel
      // coordinates (sometimes useful in layer and overlay implementations).
      getPixelBounds: function(t, e) {
        var i = this._getTopLeftPoint(t, e);
        return new F(i, i.add(this.getSize()));
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
        return e = e === void 0 ? this._zoom : e, this.options.crs.latLngToPoint(R(t), e);
      },
      // @method unproject(point: Point, zoom: Number): LatLng
      // Inverse of [`project`](#map-project).
      unproject: function(t, e) {
        return e = e === void 0 ? this._zoom : e, this.options.crs.pointToLatLng(S(t), e);
      },
      // @method layerPointToLatLng(point: Point): LatLng
      // Given a pixel coordinate relative to the [origin pixel](#map-getpixelorigin),
      // returns the corresponding geographical coordinate (for the current zoom level).
      layerPointToLatLng: function(t) {
        var e = S(t).add(this.getPixelOrigin());
        return this.unproject(e);
      },
      // @method latLngToLayerPoint(latlng: LatLng): Point
      // Given a geographical coordinate, returns the corresponding pixel coordinate
      // relative to the [origin pixel](#map-getpixelorigin).
      latLngToLayerPoint: function(t) {
        var e = this.project(R(t))._round();
        return e._subtract(this.getPixelOrigin());
      },
      // @method wrapLatLng(latlng: LatLng): LatLng
      // Returns a `LatLng` where `lat` and `lng` has been wrapped according to the
      // map's CRS's `wrapLat` and `wrapLng` properties, if they are outside the
      // CRS's bounds.
      // By default this means longitude is wrapped around the dateline so its
      // value is between -180 and +180 degrees.
      wrapLatLng: function(t) {
        return this.options.crs.wrapLatLng(R(t));
      },
      // @method wrapLatLngBounds(bounds: LatLngBounds): LatLngBounds
      // Returns a `LatLngBounds` with the same size as the given one, ensuring that
      // its center is within the CRS's bounds.
      // By default this means the center longitude is wrapped around the dateline so its
      // value is between -180 and +180 degrees, and the majority of the bounds
      // overlaps the CRS's bounds.
      wrapLatLngBounds: function(t) {
        return this.options.crs.wrapLatLngBounds(st(t));
      },
      // @method distance(latlng1: LatLng, latlng2: LatLng): Number
      // Returns the distance between two geographical coordinates according to
      // the map's CRS. By default this measures distance in meters.
      distance: function(t, e) {
        return this.options.crs.distance(R(t), R(e));
      },
      // @method containerPointToLayerPoint(point: Point): Point
      // Given a pixel coordinate relative to the map container, returns the corresponding
      // pixel coordinate relative to the [origin pixel](#map-getpixelorigin).
      containerPointToLayerPoint: function(t) {
        return S(t).subtract(this._getMapPanePos());
      },
      // @method layerPointToContainerPoint(point: Point): Point
      // Given a pixel coordinate relative to the [origin pixel](#map-getpixelorigin),
      // returns the corresponding pixel coordinate relative to the map container.
      layerPointToContainerPoint: function(t) {
        return S(t).add(this._getMapPanePos());
      },
      // @method containerPointToLatLng(point: Point): LatLng
      // Given a pixel coordinate relative to the map container, returns
      // the corresponding geographical coordinate (for the current zoom level).
      containerPointToLatLng: function(t) {
        var e = this.containerPointToLayerPoint(S(t));
        return this.layerPointToLatLng(e);
      },
      // @method latLngToContainerPoint(latlng: LatLng): Point
      // Given a geographical coordinate, returns the corresponding pixel coordinate
      // relative to the map container.
      latLngToContainerPoint: function(t) {
        return this.layerPointToContainerPoint(this.latLngToLayerPoint(R(t)));
      },
      // @method mouseEventToContainerPoint(ev: MouseEvent): Point
      // Given a MouseEvent object, returns the pixel coordinate relative to the
      // map container where the event took place.
      mouseEventToContainerPoint: function(t) {
        return En(t, this._container);
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
        var e = this._container = Cn(t);
        if (e) {
          if (e._leaflet_id)
            throw new Error("Map container is already initialized.");
        } else throw new Error("Map container not found.");
        Z(e, "scroll", this._onScroll, this), this._containerId = B(e);
      },
      _initLayout: function() {
        var t = this._container;
        this._fadeAnimated = this.options.fadeAnimation && w.any3d, A(t, "leaflet-container" + (w.touch ? " leaflet-touch" : "") + (w.retina ? " leaflet-retina" : "") + (w.ielt9 ? " leaflet-oldie" : "") + (w.safari ? " leaflet-safari" : "") + (this._fadeAnimated ? " leaflet-fade-anim" : ""));
        var e = ei(t, "position");
        e !== "absolute" && e !== "relative" && e !== "fixed" && e !== "sticky" && (t.style.position = "relative"), this._initPanes(), this._initControlPos && this._initControlPos();
      },
      _initPanes: function() {
        var t = this._panes = {};
        this._paneRenderers = {}, this._mapPane = this.createPane("mapPane", this._container), gt(this._mapPane, new O(0, 0)), this.createPane("tilePane"), this.createPane("overlayPane"), this.createPane("shadowPane"), this.createPane("markerPane"), this.createPane("tooltipPane"), this.createPane("popupPane"), this.options.markerZoomAnimation || (A(t.markerPane, "leaflet-zoom-hide"), A(t.shadowPane, "leaflet-zoom-hide"));
      },
      // private methods that modify map state
      // @section Map state change events
      _resetView: function(t, e, i) {
        gt(this._mapPane, new O(0, 0));
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
        return N(this._flyToFrame), this._panAnim && this._panAnim.stop(), this;
      },
      _rawPanBy: function(t) {
        gt(this._mapPane, this._getMapPanePos().subtract(t));
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
        this._targets = {}, this._targets[B(this._container)] = this;
        var e = t ? tt : Z;
        e(this._container, "click dblclick mousedown mouseup mouseover mouseout mousemove contextmenu keypress keydown keyup", this._handleDOMEvent, this), this.options.trackResize && e(window, "resize", this._onResize, this), w.any3d && this.options.transform3DLimit && (t ? this.off : this.on).call(this, "moveend", this._onMoveEnd);
      },
      _onResize: function() {
        N(this._resizeRequest), this._resizeRequest = P(
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
        for (var i = [], n, o = e === "mouseout" || e === "mouseover", a = t.target || t.srcElement, l = !1; a; ) {
          if (n = this._targets[B(a)], n && (e === "click" || e === "preclick") && this._draggableMoved(n)) {
            l = !0;
            break;
          }
          if (n && n.listens(e, !0) && (o && !cn(a, t) || (i.push(n), o)) || a === this._container)
            break;
          a = a.parentNode;
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
          i === "mousedown" && sn(e), this._fireDOMEvent(t, i);
        }
      },
      _mouseEvents: ["click", "dblclick", "mouseover", "mouseout", "contextmenu"],
      _fireDOMEvent: function(t, e, i) {
        if (t.type === "click") {
          var n = U({}, t);
          n.type = "preclick", this._fireDOMEvent(n, n.type, i);
        }
        var o = this._findEventTargets(t, e);
        if (i) {
          for (var a = [], l = 0; l < i.length; l++)
            i[l].listens(e, !0) && a.push(i[l]);
          o = a.concat(o);
        }
        if (o.length) {
          e === "contextmenu" && kt(t);
          var h = o[0], c = {
            originalEvent: t
          };
          if (t.type !== "keypress" && t.type !== "keydown" && t.type !== "keyup") {
            var f = h.getLatLng && (!h._radius || h._radius <= 10);
            c.containerPoint = f ? this.latLngToContainerPoint(h.getLatLng()) : this.mouseEventToContainerPoint(t), c.layerPoint = this.containerPointToLayerPoint(c.containerPoint), c.latlng = f ? h.getLatLng() : this.layerPointToLatLng(c.layerPoint);
          }
          for (l = 0; l < o.length; l++)
            if (o[l].fire(e, c, !0), c.originalEvent._stopped || o[l].options.bubblingMouseEvents === !1 && ne(this._mouseEvents, e) !== -1)
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
        return ke(this._mapPane) || new O(0, 0);
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
        return xt([
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
        var n = this.project(t, e), o = this.getSize().divideBy(2), a = new F(n.subtract(o), n.add(o)), l = this._getBoundsOffset(a, i, e);
        return Math.abs(l.x) <= 1 && Math.abs(l.y) <= 1 ? t : this.unproject(n.add(l), e);
      },
      // adjust offset for view to get inside bounds
      _limitOffset: function(t, e) {
        if (!e)
          return t;
        var i = this.getPixelBounds(), n = new F(i.min.add(t), i.max.add(t));
        return t.add(this._getBoundsOffset(n, e));
      },
      // returns offset needed for pxBounds to get inside maxBounds at a specified zoom
      _getBoundsOffset: function(t, e, i) {
        var n = xt(
          this.project(e.getNorthEast(), i),
          this.project(e.getSouthWest(), i)
        ), o = n.min.subtract(t.min), a = n.max.subtract(t.max), l = this._rebound(o.x, -a.x), h = this._rebound(o.y, -a.y);
        return new O(l, h);
      },
      _rebound: function(t, e) {
        return t + e > 0 ? Math.round(t - e) / 2 : Math.max(0, Math.ceil(t)) - Math.max(0, Math.floor(e));
      },
      _limitZoom: function(t) {
        var e = this.getMinZoom(), i = this.getMaxZoom(), n = w.any3d ? this.options.zoomSnap : 1;
        return n && (t = Math.round(t / n) * n), Math.max(e, Math.min(i, t));
      },
      _onPanTransitionStep: function() {
        this.fire("move");
      },
      _onPanTransitionEnd: function() {
        _t(this._mapPane, "leaflet-pan-anim"), this.fire("moveend");
      },
      _tryAnimatedPan: function(t, e) {
        var i = this._getCenterOffset(t)._trunc();
        return (e && e.animate) !== !0 && !this.getSize().contains(i) ? !1 : (this.panBy(i, e), !0);
      },
      _createAnimProxy: function() {
        var t = this._proxy = j("div", "leaflet-proxy leaflet-zoom-animated");
        this._panes.mapPane.appendChild(t), this.on("zoomanim", function(e) {
          var i = Yi, n = this._proxy.style[i];
          Te(this._proxy, this.project(e.center, e.zoom), this.getZoomScale(e.zoom, 1)), n === this._proxy.style[i] && this._animatingZoom && this._onZoomTransitionEnd();
        }, this), this.on("load moveend", this._animMoveEnd, this), this._on("unload", this._destroyAnimProxy, this);
      },
      _destroyAnimProxy: function() {
        at(this._proxy), this.off("load moveend", this._animMoveEnd, this), delete this._proxy;
      },
      _animMoveEnd: function() {
        var t = this.getCenter(), e = this.getZoom();
        Te(this._proxy, this.project(t, e), this.getZoomScale(e, 1));
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
        return i.animate !== !0 && !this.getSize().contains(o) ? !1 : (P(function() {
          this._moveStart(!0, i.noMoveStart || !1)._animateZoom(t, e, !0);
        }, this), !0);
      },
      _animateZoom: function(t, e, i, n) {
        this._mapPane && (i && (this._animatingZoom = !0, this._animateToCenter = t, this._animateToZoom = e, A(this._mapPane, "leaflet-zoom-anim")), this.fire("zoomanim", {
          center: t,
          zoom: e,
          noUpdate: n
        }), this._tempFireZoomEvent || (this._tempFireZoomEvent = this._zoom !== this._animateToZoom), this._move(this._animateToCenter, this._animateToZoom, void 0, !0), setTimeout(W(this._onZoomTransitionEnd, this), 250));
      },
      _onZoomTransitionEnd: function() {
        this._animatingZoom && (this._mapPane && _t(this._mapPane, "leaflet-zoom-anim"), this._animatingZoom = !1, this._move(this._animateToCenter, this._animateToZoom, void 0, !0), this._tempFireZoomEvent && this.fire("zoom"), delete this._tempFireZoomEvent, this.fire("move"), this._moveEnd(!0));
      }
    });
    function To(t, e) {
      return new H(t, e);
    }
    var qt = bt.extend({
      // @section
      // @aka Control Options
      options: {
        // @option position: String = 'topright'
        // The position of the control (one of the map corners). Possible values are `'topleft'`,
        // `'topright'`, `'bottomleft'` or `'bottomright'`
        position: "topright"
      },
      initialize: function(t) {
        K(this, t);
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
        return A(e, "leaflet-control"), i.indexOf("bottom") !== -1 ? n.insertBefore(e, n.firstChild) : n.appendChild(e), this._map.on("unload", this.remove, this), this;
      },
      // @method remove: this
      // Removes the control from the map it is currently active on.
      remove: function() {
        return this._map ? (at(this._container), this.onRemove && this.onRemove(this._map), this._map.off("unload", this.remove, this), this._map = null, this) : this;
      },
      _refocusOnMap: function(t) {
        this._map && t && t.screenX > 0 && t.screenY > 0 && this._map.getContainer().focus();
      }
    }), ai = function(t) {
      return new qt(t);
    };
    H.include({
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
        var t = this._controlCorners = {}, e = "leaflet-", i = this._controlContainer = j("div", e + "control-container", this._container);
        function n(o, a) {
          var l = e + o + " " + e + a;
          t[o + a] = j("div", l, i);
        }
        n("top", "left"), n("top", "right"), n("bottom", "left"), n("bottom", "right");
      },
      _clearControlPos: function() {
        for (var t in this._controlCorners)
          at(this._controlCorners[t]);
        at(this._controlContainer), delete this._controlCorners, delete this._controlContainer;
      }
    });
    var In = qt.extend({
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
        K(this, i), this._layerControlInputs = [], this._layers = [], this._lastZIndex = 0, this._handlingClick = !1, this._preventClick = !1;
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
        return qt.prototype.addTo.call(this, t), this._expandIfNotCollapsed();
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
        var e = this._getLayer(B(t));
        return e && this._layers.splice(this._layers.indexOf(e), 1), this._map ? this._update() : this;
      },
      // @method expand(): this
      // Expand the control container if collapsed.
      expand: function() {
        A(this._container, "leaflet-control-layers-expanded"), this._section.style.height = null;
        var t = this._map.getSize().y - (this._container.offsetTop + 50);
        return t < this._section.clientHeight ? (A(this._section, "leaflet-control-layers-scrollbar"), this._section.style.height = t + "px") : _t(this._section, "leaflet-control-layers-scrollbar"), this._checkDisabledLayers(), this;
      },
      // @method collapse(): this
      // Collapse the control container if expanded.
      collapse: function() {
        return _t(this._container, "leaflet-control-layers-expanded"), this;
      },
      _initLayout: function() {
        var t = "leaflet-control-layers", e = this._container = j("div", t), i = this.options.collapsed;
        e.setAttribute("aria-haspopup", !0), si(e), hn(e);
        var n = this._section = j("section", t + "-list");
        i && (this._map.on("click", this.collapse, this), Z(e, {
          mouseenter: this._expandSafely,
          mouseleave: this.collapse
        }, this));
        var o = this._layersLink = j("a", t + "-toggle", e);
        o.href = "#", o.title = "Layers", o.setAttribute("role", "button"), Z(o, {
          keydown: function(a) {
            a.keyCode === 13 && this._expandSafely();
          },
          // Certain screen readers intercept the key event and instead send a click event
          click: function(a) {
            kt(a), this._expandSafely();
          }
        }, this), i || this.expand(), this._baseLayersList = j("div", t + "-base", n), this._separator = j("div", t + "-separator", n), this._overlaysList = j("div", t + "-overlays", n), e.appendChild(n);
      },
      _getLayer: function(t) {
        for (var e = 0; e < this._layers.length; e++)
          if (this._layers[e] && B(this._layers[e].layer) === t)
            return this._layers[e];
      },
      _addLayer: function(t, e, i) {
        this._map && t.on("add remove", this._onLayerChange, this), this._layers.push({
          layer: t,
          name: e,
          overlay: i
        }), this.options.sortLayers && this._layers.sort(W(function(n, o) {
          return this.options.sortFunction(n.layer, o.layer, n.name, o.name);
        }, this)), this.options.autoZIndex && t.setZIndex && (this._lastZIndex++, t.setZIndex(this._lastZIndex)), this._expandIfNotCollapsed();
      },
      _update: function() {
        if (!this._container)
          return this;
        ki(this._baseLayersList), ki(this._overlaysList), this._layerControlInputs = [];
        var t, e, i, n, o = 0;
        for (i = 0; i < this._layers.length; i++)
          n = this._layers[i], this._addItem(n), e = e || n.overlay, t = t || !n.overlay, o += n.overlay ? 0 : 1;
        return this.options.hideSingleBase && (t = t && o > 1, this._baseLayersList.style.display = t ? "" : "none"), this._separator.style.display = e && t ? "" : "none", this;
      },
      _onLayerChange: function(t) {
        this._handlingClick || this._update();
        var e = this._getLayer(B(t.target)), i = e.overlay ? t.type === "add" ? "overlayadd" : "overlayremove" : t.type === "add" ? "baselayerchange" : null;
        i && this._map.fire(i, e);
      },
      // IE7 bugs out if you create a radio dynamically, so you have to do it this hacky way (see https://stackoverflow.com/a/119079)
      _createRadioElement: function(t, e) {
        var i = '<input type="radio" class="leaflet-control-layers-selector" name="' + t + '"' + (e ? ' checked="checked"' : "") + "/>", n = document.createElement("div");
        return n.innerHTML = i, n.firstChild;
      },
      _addItem: function(t) {
        var e = document.createElement("label"), i = this._map.hasLayer(t.layer), n;
        t.overlay ? (n = document.createElement("input"), n.type = "checkbox", n.className = "leaflet-control-layers-selector", n.defaultChecked = i) : n = this._createRadioElement("leaflet-base-layers_" + B(this), i), this._layerControlInputs.push(n), n.layerId = B(t.layer), Z(n, "click", this._onInputClick, this);
        var o = document.createElement("span");
        o.innerHTML = " " + t.name;
        var a = document.createElement("span");
        e.appendChild(a), a.appendChild(n), a.appendChild(o);
        var l = t.overlay ? this._overlaysList : this._baseLayersList;
        return l.appendChild(e), this._checkDisabledLayers(), e;
      },
      _onInputClick: function() {
        if (!this._preventClick) {
          var t = this._layerControlInputs, e, i, n = [], o = [];
          this._handlingClick = !0;
          for (var a = t.length - 1; a >= 0; a--)
            e = t[a], i = this._getLayer(e.layerId).layer, e.checked ? n.push(i) : e.checked || o.push(i);
          for (a = 0; a < o.length; a++)
            this._map.hasLayer(o[a]) && this._map.removeLayer(o[a]);
          for (a = 0; a < n.length; a++)
            this._map.hasLayer(n[a]) || this._map.addLayer(n[a]);
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
        this._preventClick = !0, Z(t, "click", kt), this.expand();
        var e = this;
        setTimeout(function() {
          tt(t, "click", kt), e._preventClick = !1;
        });
      }
    }), ko = function(t, e, i) {
      return new In(t, e, i);
    }, dn = qt.extend({
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
        var e = "leaflet-control-zoom", i = j("div", e + " leaflet-bar"), n = this.options;
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
        var a = j("a", i, n);
        return a.innerHTML = t, a.href = "#", a.title = e, a.setAttribute("role", "button"), a.setAttribute("aria-label", e), si(a), Z(a, "click", Me), Z(a, "click", o, this), Z(a, "click", this._refocusOnMap, this), a;
      },
      _updateDisabled: function() {
        var t = this._map, e = "leaflet-disabled";
        _t(this._zoomInButton, e), _t(this._zoomOutButton, e), this._zoomInButton.setAttribute("aria-disabled", "false"), this._zoomOutButton.setAttribute("aria-disabled", "false"), (this._disabled || t._zoom === t.getMinZoom()) && (A(this._zoomOutButton, e), this._zoomOutButton.setAttribute("aria-disabled", "true")), (this._disabled || t._zoom === t.getMaxZoom()) && (A(this._zoomInButton, e), this._zoomInButton.setAttribute("aria-disabled", "true"));
      }
    });
    H.mergeOptions({
      zoomControl: !0
    }), H.addInitHook(function() {
      this.options.zoomControl && (this.zoomControl = new dn(), this.addControl(this.zoomControl));
    });
    var Co = function(t) {
      return new dn(t);
    }, An = qt.extend({
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
        var e = "leaflet-control-scale", i = j("div", e), n = this.options;
        return this._addScales(n, e + "-line", i), t.on(n.updateWhenIdle ? "moveend" : "move", this._update, this), t.whenReady(this._update, this), i;
      },
      onRemove: function(t) {
        t.off(this.options.updateWhenIdle ? "moveend" : "move", this._update, this);
      },
      _addScales: function(t, e, i) {
        t.metric && (this._mScale = j("div", e, i)), t.imperial && (this._iScale = j("div", e, i));
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
      return new An(t);
    }, So = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" class="leaflet-attribution-flag"><path fill="#4C7BE1" d="M0 0h12v4H0z"/><path fill="#FFD500" d="M0 4h12v3H0z"/><path fill="#E0BC00" d="M0 7h12v1H0z"/></svg>', fn = qt.extend({
      // @section
      // @aka Control.Attribution options
      options: {
        position: "bottomright",
        // @option prefix: String|false = 'Leaflet'
        // The HTML text shown before the attributions. Pass `false` to disable.
        prefix: '<a href="https://leafletjs.com" title="A JavaScript library for interactive maps">' + (w.inlineSvg ? So + " " : "") + "Leaflet</a>"
      },
      initialize: function(t) {
        K(this, t), this._attributions = {};
      },
      onAdd: function(t) {
        t.attributionControl = this, this._container = j("div", "leaflet-control-attribution"), si(this._container);
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
    H.mergeOptions({
      attributionControl: !0
    }), H.addInitHook(function() {
      this.options.attributionControl && new fn().addTo(this);
    });
    var zo = function(t) {
      return new fn(t);
    };
    qt.Layers = In, qt.Zoom = dn, qt.Scale = An, qt.Attribution = fn, ai.layers = ko, ai.zoom = Co, ai.scale = Mo, ai.attribution = zo;
    var te = bt.extend({
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
    te.addTo = function(t, e) {
      return t.addHandler(e, this), this;
    };
    var Eo = { Events: ht }, Bn = w.touch ? "touchstart mousedown" : "mousedown", ge = ce.extend({
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
        K(this, n), this._element = t, this._dragStartTarget = e || t, this._preventOutline = i;
      },
      // @method enable()
      // Enables the dragging ability
      enable: function() {
        this._enabled || (Z(this._dragStartTarget, Bn, this._onDown, this), this._enabled = !0);
      },
      // @method disable()
      // Disables the dragging ability
      disable: function() {
        this._enabled && (ge._dragging === this && this.finishDrag(!0), tt(this._dragStartTarget, Bn, this._onDown, this), this._enabled = !1, this._moved = !1);
      },
      _onDown: function(t) {
        if (this._enabled && (this._moved = !1, !Xi(this._element, "leaflet-zoom-anim"))) {
          if (t.touches && t.touches.length !== 1) {
            ge._dragging === this && this.finishDrag();
            return;
          }
          if (!(ge._dragging || t.shiftKey || t.which !== 1 && t.button !== 1 && !t.touches) && (ge._dragging = this, this._preventOutline && sn(this._element), en(), ii(), !this._moving)) {
            this.fire("down");
            var e = t.touches ? t.touches[0] : t, i = Mn(this._element);
            this._startPoint = new O(e.clientX, e.clientY), this._startPos = ke(this._element), this._parentScale = an(i);
            var n = t.type === "mousedown";
            Z(document, n ? "mousemove" : "touchmove", this._onMove, this), Z(document, n ? "mouseup" : "touchend touchcancel", this._onUp, this);
          }
        }
      },
      _onMove: function(t) {
        if (this._enabled) {
          if (t.touches && t.touches.length > 1) {
            this._moved = !0;
            return;
          }
          var e = t.touches && t.touches.length === 1 ? t.touches[0] : t, i = new O(e.clientX, e.clientY)._subtract(this._startPoint);
          !i.x && !i.y || Math.abs(i.x) + Math.abs(i.y) < this.options.clickTolerance || (i.x /= this._parentScale.x, i.y /= this._parentScale.y, kt(t), this._moved || (this.fire("dragstart"), this._moved = !0, A(document.body, "leaflet-dragging"), this._lastTarget = t.target || t.srcElement, window.SVGElementInstance && this._lastTarget instanceof window.SVGElementInstance && (this._lastTarget = this._lastTarget.correspondingUseElement), A(this._lastTarget, "leaflet-drag-target")), this._newPos = this._startPos.add(i), this._moving = !0, this._lastEvent = t, this._updatePosition());
        }
      },
      _updatePosition: function() {
        var t = { originalEvent: this._lastEvent };
        this.fire("predrag", t), gt(this._element, this._newPos), this.fire("drag", t);
      },
      _onUp: function() {
        this._enabled && this.finishDrag();
      },
      finishDrag: function(t) {
        _t(document.body, "leaflet-dragging"), this._lastTarget && (_t(this._lastTarget, "leaflet-drag-target"), this._lastTarget = null), tt(document, "mousemove touchmove", this._onMove, this), tt(document, "mouseup touchend touchcancel", this._onUp, this), nn(), ni();
        var e = this._moved && this._moving;
        this._moving = !1, ge._dragging = !1, e && this.fire("dragend", {
          noInertia: t,
          distance: this._newPos.distanceTo(this._startPos)
        });
      }
    });
    function Nn(t, e, i) {
      var n, o = [1, 4, 2, 8], a, l, h, c, f, v, C, V;
      for (a = 0, v = t.length; a < v; a++)
        t[a]._code = Se(t[a], e);
      for (h = 0; h < 4; h++) {
        for (C = o[h], n = [], a = 0, v = t.length, l = v - 1; a < v; l = a++)
          c = t[a], f = t[l], c._code & C ? f._code & C || (V = Ei(f, c, C, e, i), V._code = Se(V, e), n.push(V)) : (f._code & C && (V = Ei(f, c, C, e, i), V._code = Se(V, e), n.push(V)), n.push(c));
        t = n;
      }
      return t;
    }
    function Rn(t, e) {
      var i, n, o, a, l, h, c, f, v;
      if (!t || t.length === 0)
        throw new Error("latlngs not passed");
      Wt(t) || (console.warn("latlngs are not flat! Only the first ring will be used"), t = t[0]);
      var C = R([0, 0]), V = st(t), Et = V.getNorthWest().distanceTo(V.getSouthWest()) * V.getNorthEast().distanceTo(V.getNorthWest());
      Et < 1700 && (C = _n(t));
      var Pt = t.length, Ht = [];
      for (i = 0; i < Pt; i++) {
        var Zt = R(t[i]);
        Ht.push(e.project(R([Zt.lat - C.lat, Zt.lng - C.lng])));
      }
      for (h = c = f = 0, i = 0, n = Pt - 1; i < Pt; n = i++)
        o = Ht[i], a = Ht[n], l = o.y * a.x - a.y * o.x, c += (o.x + a.x) * l, f += (o.y + a.y) * l, h += l * 3;
      h === 0 ? v = Ht[0] : v = [c / h, f / h];
      var $e = e.unproject(S(v));
      return R([$e.lat + C.lat, $e.lng + C.lng]);
    }
    function _n(t) {
      for (var e = 0, i = 0, n = 0, o = 0; o < t.length; o++) {
        var a = R(t[o]);
        e += a.lat, i += a.lng, n++;
      }
      return R([e / n, i / n]);
    }
    var Oo = {
      __proto__: null,
      clipPolygon: Nn,
      polygonCenter: Rn,
      centroid: _n
    };
    function Dn(t, e) {
      if (!e || !t.length)
        return t.slice();
      var i = e * e;
      return t = Ao(t, i), t = Io(t, i), t;
    }
    function Vn(t, e, i) {
      return Math.sqrt(ri(t, e, i, !0));
    }
    function Zo(t, e, i) {
      return ri(t, e, i);
    }
    function Io(t, e) {
      var i = t.length, n = typeof Uint8Array < "u" ? Uint8Array : Array, o = new n(i);
      o[0] = o[i - 1] = 1, pn(t, o, e, 0, i - 1);
      var a, l = [];
      for (a = 0; a < i; a++)
        o[a] && l.push(t[a]);
      return l;
    }
    function pn(t, e, i, n, o) {
      var a = 0, l, h, c;
      for (h = n + 1; h <= o - 1; h++)
        c = ri(t[h], t[n], t[o], !0), c > a && (l = h, a = c);
      a > i && (e[l] = 1, pn(t, e, i, n, l), pn(t, e, i, l, o));
    }
    function Ao(t, e) {
      for (var i = [t[0]], n = 1, o = 0, a = t.length; n < a; n++)
        Bo(t[n], t[o]) > e && (i.push(t[n]), o = n);
      return o < a - 1 && i.push(t[a - 1]), i;
    }
    var Fn;
    function Un(t, e, i, n, o) {
      var a = n ? Fn : Se(t, i), l = Se(e, i), h, c, f;
      for (Fn = l; ; ) {
        if (!(a | l))
          return [t, e];
        if (a & l)
          return !1;
        h = a || l, c = Ei(t, e, h, i, o), f = Se(c, i), h === a ? (t = c, a = f) : (e = c, l = f);
      }
    }
    function Ei(t, e, i, n, o) {
      var a = e.x - t.x, l = e.y - t.y, h = n.min, c = n.max, f, v;
      return i & 8 ? (f = t.x + a * (c.y - t.y) / l, v = c.y) : i & 4 ? (f = t.x + a * (h.y - t.y) / l, v = h.y) : i & 2 ? (f = c.x, v = t.y + l * (c.x - t.x) / a) : i & 1 && (f = h.x, v = t.y + l * (h.x - t.x) / a), new O(f, v, o);
    }
    function Se(t, e) {
      var i = 0;
      return t.x < e.min.x ? i |= 1 : t.x > e.max.x && (i |= 2), t.y < e.min.y ? i |= 4 : t.y > e.max.y && (i |= 8), i;
    }
    function Bo(t, e) {
      var i = e.x - t.x, n = e.y - t.y;
      return i * i + n * n;
    }
    function ri(t, e, i, n) {
      var o = e.x, a = e.y, l = i.x - o, h = i.y - a, c = l * l + h * h, f;
      return c > 0 && (f = ((t.x - o) * l + (t.y - a) * h) / c, f > 1 ? (o = i.x, a = i.y) : f > 0 && (o += l * f, a += h * f)), l = t.x - o, h = t.y - a, n ? l * l + h * h : new O(o, a);
    }
    function Wt(t) {
      return !mt(t[0]) || typeof t[0][0] != "object" && typeof t[0][0] < "u";
    }
    function Wn(t) {
      return console.warn("Deprecated use of _flat, please use L.LineUtil.isFlat instead."), Wt(t);
    }
    function Hn(t, e) {
      var i, n, o, a, l, h, c, f;
      if (!t || t.length === 0)
        throw new Error("latlngs not passed");
      Wt(t) || (console.warn("latlngs are not flat! Only the first ring will be used"), t = t[0]);
      var v = R([0, 0]), C = st(t), V = C.getNorthWest().distanceTo(C.getSouthWest()) * C.getNorthEast().distanceTo(C.getNorthWest());
      V < 1700 && (v = _n(t));
      var Et = t.length, Pt = [];
      for (i = 0; i < Et; i++) {
        var Ht = R(t[i]);
        Pt.push(e.project(R([Ht.lat - v.lat, Ht.lng - v.lng])));
      }
      for (i = 0, n = 0; i < Et - 1; i++)
        n += Pt[i].distanceTo(Pt[i + 1]) / 2;
      if (n === 0)
        f = Pt[0];
      else
        for (i = 0, a = 0; i < Et - 1; i++)
          if (l = Pt[i], h = Pt[i + 1], o = l.distanceTo(h), a += o, a > n) {
            c = (a - n) / o, f = [
              h.x - c * (h.x - l.x),
              h.y - c * (h.y - l.y)
            ];
            break;
          }
      var Zt = e.unproject(S(f));
      return R([Zt.lat + v.lat, Zt.lng + v.lng]);
    }
    var No = {
      __proto__: null,
      simplify: Dn,
      pointToSegmentDistance: Vn,
      closestPointOnSegment: Zo,
      clipSegment: Un,
      _getEdgeIntersection: Ei,
      _getBitCode: Se,
      _sqClosestPointOnSegment: ri,
      isFlat: Wt,
      _flat: Wn,
      polylineCenter: Hn
    }, mn = {
      project: function(t) {
        return new O(t.lng, t.lat);
      },
      unproject: function(t) {
        return new q(t.y, t.x);
      },
      bounds: new F([-180, -90], [180, 90])
    }, vn = {
      R: 6378137,
      R_MINOR: 6356752314245179e-9,
      bounds: new F([-2003750834279e-5, -1549657073972e-5], [2003750834279e-5, 1876465623138e-5]),
      project: function(t) {
        var e = Math.PI / 180, i = this.R, n = t.lat * e, o = this.R_MINOR / i, a = Math.sqrt(1 - o * o), l = a * Math.sin(n), h = Math.tan(Math.PI / 4 - n / 2) / Math.pow((1 - l) / (1 + l), a / 2);
        return n = -i * Math.log(Math.max(h, 1e-10)), new O(t.lng * e * i, n);
      },
      unproject: function(t) {
        for (var e = 180 / Math.PI, i = this.R, n = this.R_MINOR / i, o = Math.sqrt(1 - n * n), a = Math.exp(-t.y / i), l = Math.PI / 2 - 2 * Math.atan(a), h = 0, c = 0.1, f; h < 15 && Math.abs(c) > 1e-7; h++)
          f = o * Math.sin(l), f = Math.pow((1 - f) / (1 + f), o / 2), c = Math.PI / 2 - 2 * Math.atan(a * f) - l, l += c;
        return new q(l * e, t.x * e / i);
      }
    }, Ro = {
      __proto__: null,
      LonLat: mn,
      Mercator: vn,
      SphericalMercator: de
    }, Do = U({}, At, {
      code: "EPSG:3395",
      projection: vn,
      transformation: function() {
        var t = 0.5 / (Math.PI * vn.R);
        return Xt(t, 0.5, -t, 0.5);
      }()
    }), Gn = U({}, At, {
      code: "EPSG:4326",
      projection: mn,
      transformation: Xt(1 / 180, 1, -1 / 180, 0.5)
    }), Vo = U({}, p, {
      projection: mn,
      transformation: Xt(1, 0, -1, 0),
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
    p.Earth = At, p.EPSG3395 = Do, p.EPSG3857 = _e, p.EPSG900913 = Ie, p.EPSG4326 = Gn, p.Simple = Vo;
    var $t = ce.extend({
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
        return this._map._targets[B(t)] = this, this;
      },
      removeInteractiveTarget: function(t) {
        return delete this._map._targets[B(t)], this;
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
    H.include({
      // @method addLayer(layer: Layer): this
      // Adds the given layer to the map
      addLayer: function(t) {
        if (!t._layerAdd)
          throw new Error("The provided object is not a Layer.");
        var e = B(t);
        return this._layers[e] ? this : (this._layers[e] = t, t._mapToAdd = this, t.beforeAdd && t.beforeAdd(this), this.whenReady(t._layerAdd, t), this);
      },
      // @method removeLayer(layer: Layer): this
      // Removes the given layer from the map.
      removeLayer: function(t) {
        var e = B(t);
        return this._layers[e] ? (this._loaded && t.onRemove(this), delete this._layers[e], this._loaded && (this.fire("layerremove", { layer: t }), t.fire("remove")), t._map = t._mapToAdd = null, this) : this;
      },
      // @method hasLayer(layer: Layer): Boolean
      // Returns `true` if the given layer is currently added to the map
      hasLayer: function(t) {
        return B(t) in this._layers;
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
        (!isNaN(t.options.maxZoom) || !isNaN(t.options.minZoom)) && (this._zoomBoundLayers[B(t)] = t, this._updateZoomLevels());
      },
      _removeZoomLimit: function(t) {
        var e = B(t);
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
    var We = $t.extend({
      initialize: function(t, e) {
        K(this, e), this._layers = {};
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
        return B(t);
      }
    }), Fo = function(t, e) {
      return new We(t, e);
    }, oe = We.extend({
      addLayer: function(t) {
        return this.hasLayer(t) ? this : (t.addEventParent(this), We.prototype.addLayer.call(this, t), this.fire("layeradd", { layer: t }));
      },
      removeLayer: function(t) {
        return this.hasLayer(t) ? (t in this._layers && (t = this._layers[t]), t.removeEventParent(this), We.prototype.removeLayer.call(this, t), this.fire("layerremove", { layer: t })) : this;
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
    }), Uo = function(t, e) {
      return new oe(t, e);
    }, He = bt.extend({
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
        K(this, t);
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
        var o = S(n), a = S(e === "shadow" && i.shadowAnchor || i.iconAnchor || o && o.divideBy(2, !0));
        t.className = "leaflet-marker-" + e + " " + (i.className || ""), a && (t.style.marginLeft = -a.x + "px", t.style.marginTop = -a.y + "px"), o && (t.style.width = o.x + "px", t.style.height = o.y + "px");
      },
      _createImg: function(t, e) {
        return e = e || document.createElement("img"), e.src = t, e;
      },
      _getIconUrl: function(t) {
        return w.retina && this.options[t + "RetinaUrl"] || this.options[t + "Url"];
      }
    });
    function Wo(t) {
      return new He(t);
    }
    var li = He.extend({
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
        return typeof li.imagePath != "string" && (li.imagePath = this._detectIconPath()), (this.options.imagePath || li.imagePath) + He.prototype._getIconUrl.call(this, t);
      },
      _stripUrl: function(t) {
        var e = function(i, n, o) {
          var a = n.exec(i);
          return a && a[o];
        };
        return t = e(t, /^url\((['"])?(.+)\1\)$/, 2), t && e(t, /^(.*)marker-icon\.png$/, 1);
      },
      _detectIconPath: function() {
        var t = j("div", "leaflet-default-icon-path", document.body), e = ei(t, "background-image") || ei(t, "backgroundImage");
        if (document.body.removeChild(t), e = this._stripUrl(e), e)
          return e;
        var i = document.querySelector('link[href$="leaflet.css"]');
        return i ? i.href.substring(0, i.href.length - 11 - 1) : "";
      }
    }), jn = te.extend({
      initialize: function(t) {
        this._marker = t;
      },
      addHooks: function() {
        var t = this._marker._icon;
        this._draggable || (this._draggable = new ge(t, t, !0)), this._draggable.on({
          dragstart: this._onDragStart,
          predrag: this._onPreDrag,
          drag: this._onDrag,
          dragend: this._onDragEnd
        }, this).enable(), A(t, "leaflet-marker-draggable");
      },
      removeHooks: function() {
        this._draggable.off({
          dragstart: this._onDragStart,
          predrag: this._onPreDrag,
          drag: this._onDrag,
          dragend: this._onDragEnd
        }, this).disable(), this._marker._icon && _t(this._marker._icon, "leaflet-marker-draggable");
      },
      moved: function() {
        return this._draggable && this._draggable._moved;
      },
      _adjustPan: function(t) {
        var e = this._marker, i = e._map, n = this._marker.options.autoPanSpeed, o = this._marker.options.autoPanPadding, a = ke(e._icon), l = i.getPixelBounds(), h = i.getPixelOrigin(), c = xt(
          l.min._subtract(h).add(o),
          l.max._subtract(h).subtract(o)
        );
        if (!c.contains(a)) {
          var f = S(
            (Math.max(c.max.x, a.x) - c.max.x) / (l.max.x - c.max.x) - (Math.min(c.min.x, a.x) - c.min.x) / (l.min.x - c.min.x),
            (Math.max(c.max.y, a.y) - c.max.y) / (l.max.y - c.max.y) - (Math.min(c.min.y, a.y) - c.min.y) / (l.min.y - c.min.y)
          ).multiplyBy(n);
          i.panBy(f, { animate: !1 }), this._draggable._newPos._add(f), this._draggable._startPos._add(f), gt(e._icon, this._draggable._newPos), this._onDrag(t), this._panRequest = P(this._adjustPan.bind(this, t));
        }
      },
      _onDragStart: function() {
        this._oldLatLng = this._marker.getLatLng(), this._marker.closePopup && this._marker.closePopup(), this._marker.fire("movestart").fire("dragstart");
      },
      _onPreDrag: function(t) {
        this._marker.options.autoPan && (N(this._panRequest), this._panRequest = P(this._adjustPan.bind(this, t)));
      },
      _onDrag: function(t) {
        var e = this._marker, i = e._shadow, n = ke(e._icon), o = e._map.layerPointToLatLng(n);
        i && gt(i, n), e._latlng = o, t.latlng = o, t.oldLatLng = this._oldLatLng, e.fire("move", t).fire("drag", t);
      },
      _onDragEnd: function(t) {
        N(this._panRequest), delete this._oldLatLng, this._marker.fire("moveend").fire("dragend", t);
      }
    }), Oi = $t.extend({
      // @section
      // @aka Marker options
      options: {
        // @option icon: Icon = *
        // Icon instance to use for rendering the marker.
        // See [Icon documentation](#L.Icon) for details on how to customize the marker icon.
        // If not specified, a common instance of `L.Icon.Default` is used.
        icon: new li(),
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
        K(this, e), this._latlng = R(t);
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
        return this._latlng = R(t), this.update(), this.fire("move", { oldLatLng: e, latlng: this._latlng });
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
        i !== this._icon && (this._icon && this._removeIcon(), n = !0, t.title && (i.title = t.title), i.tagName === "IMG" && (i.alt = t.alt || "")), A(i, e), t.keyboard && (i.tabIndex = "0", i.setAttribute("role", "button")), this._icon = i, t.riseOnHover && this.on({
          mouseover: this._bringToFront,
          mouseout: this._resetZIndex
        }), this.options.autoPanOnFocus && Z(i, "focus", this._panOnFocus, this);
        var o = t.icon.createShadow(this._shadow), a = !1;
        o !== this._shadow && (this._removeShadow(), a = !0), o && (A(o, e), o.alt = ""), this._shadow = o, t.opacity < 1 && this._updateOpacity(), n && this.getPane().appendChild(this._icon), this._initInteraction(), o && a && this.getPane(t.shadowPane).appendChild(this._shadow);
      },
      _removeIcon: function() {
        this.options.riseOnHover && this.off({
          mouseover: this._bringToFront,
          mouseout: this._resetZIndex
        }), this.options.autoPanOnFocus && tt(this._icon, "focus", this._panOnFocus, this), at(this._icon), this.removeInteractiveTarget(this._icon), this._icon = null;
      },
      _removeShadow: function() {
        this._shadow && at(this._shadow), this._shadow = null;
      },
      _setPos: function(t) {
        this._icon && gt(this._icon, t), this._shadow && gt(this._shadow, t), this._zIndex = t.y + this.options.zIndexOffset, this._resetZIndex();
      },
      _updateZIndex: function(t) {
        this._icon && (this._icon.style.zIndex = this._zIndex + t);
      },
      _animateZoom: function(t) {
        var e = this._map._latLngToNewLayerPoint(this._latlng, t.zoom, t.center).round();
        this._setPos(e);
      },
      _initInteraction: function() {
        if (this.options.interactive && (A(this._icon, "leaflet-interactive"), this.addInteractiveTarget(this._icon), jn)) {
          var t = this.options.draggable;
          this.dragging && (t = this.dragging.enabled(), this.dragging.disable()), this.dragging = new jn(this), t && this.dragging.enable();
        }
      },
      // @method setOpacity(opacity: Number): this
      // Changes the opacity of the marker.
      setOpacity: function(t) {
        return this.options.opacity = t, this._map && this._updateOpacity(), this;
      },
      _updateOpacity: function() {
        var t = this.options.opacity;
        this._icon && Ut(this._icon, t), this._shadow && Ut(this._shadow, t);
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
          var e = this.options.icon.options, i = e.iconSize ? S(e.iconSize) : S(0, 0), n = e.iconAnchor ? S(e.iconAnchor) : S(0, 0);
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
    function Ho(t, e) {
      return new Oi(t, e);
    }
    var ye = $t.extend({
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
        return K(this, t), this._renderer && (this._renderer._updateStyle(this), this.options.stroke && t && Object.prototype.hasOwnProperty.call(t, "weight") && this._updateBounds()), this;
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
    }), Zi = ye.extend({
      // @section
      // @aka CircleMarker options
      options: {
        fill: !0,
        // @option radius: Number = 10
        // Radius of the circle marker, in pixels
        radius: 10
      },
      initialize: function(t, e) {
        K(this, e), this._latlng = R(t), this._radius = this.options.radius;
      },
      // @method setLatLng(latLng: LatLng): this
      // Sets the position of a circle marker to a new location.
      setLatLng: function(t) {
        var e = this._latlng;
        return this._latlng = R(t), this.redraw(), this.fire("move", { oldLatLng: e, latlng: this._latlng });
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
        return ye.prototype.setStyle.call(this, t), this.setRadius(e), this;
      },
      _project: function() {
        this._point = this._map.latLngToLayerPoint(this._latlng), this._updateBounds();
      },
      _updateBounds: function() {
        var t = this._radius, e = this._radiusY || t, i = this._clickTolerance(), n = [t + i, e + i];
        this._pxBounds = new F(this._point.subtract(n), this._point.add(n));
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
    function Go(t, e) {
      return new Zi(t, e);
    }
    var gn = Zi.extend({
      initialize: function(t, e, i) {
        if (typeof e == "number" && (e = U({}, i, { radius: e })), K(this, e), this._latlng = R(t), isNaN(this.options.radius))
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
      setStyle: ye.prototype.setStyle,
      _project: function() {
        var t = this._latlng.lng, e = this._latlng.lat, i = this._map, n = i.options.crs;
        if (n.distance === At.distance) {
          var o = Math.PI / 180, a = this._mRadius / At.R / o, l = i.project([e + a, t]), h = i.project([e - a, t]), c = l.add(h).divideBy(2), f = i.unproject(c).lat, v = Math.acos((Math.cos(a * o) - Math.sin(e * o) * Math.sin(f * o)) / (Math.cos(e * o) * Math.cos(f * o))) / o;
          (isNaN(v) || v === 0) && (v = a / Math.cos(Math.PI / 180 * e)), this._point = c.subtract(i.getPixelOrigin()), this._radius = isNaN(v) ? 0 : c.x - i.project([f, t - v]).x, this._radiusY = c.y - l.y;
        } else {
          var C = n.unproject(n.project(this._latlng).subtract([this._mRadius, 0]));
          this._point = i.latLngToLayerPoint(this._latlng), this._radius = this._point.x - i.latLngToLayerPoint(C).x;
        }
        this._updateBounds();
      }
    });
    function jo(t, e, i) {
      return new gn(t, e, i);
    }
    var se = ye.extend({
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
        K(this, e), this._setLatLngs(t);
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
        for (var e = 1 / 0, i = null, n = ri, o, a, l = 0, h = this._parts.length; l < h; l++)
          for (var c = this._parts[l], f = 1, v = c.length; f < v; f++) {
            o = c[f - 1], a = c[f];
            var C = n(t, o, a, !0);
            C < e && (e = C, i = n(t, o, a));
          }
        return i && (i.distance = Math.sqrt(e)), i;
      },
      // @method getCenter(): LatLng
      // Returns the center ([centroid](https://en.wikipedia.org/wiki/Centroid)) of the polyline.
      getCenter: function() {
        if (!this._map)
          throw new Error("Must add layer to map before using getCenter()");
        return Hn(this._defaultShape(), this._map.options.crs);
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
        return e = e || this._defaultShape(), t = R(t), e.push(t), this._bounds.extend(t), this.redraw();
      },
      _setLatLngs: function(t) {
        this._bounds = new Lt(), this._latlngs = this._convertLatLngs(t);
      },
      _defaultShape: function() {
        return Wt(this._latlngs) ? this._latlngs : this._latlngs[0];
      },
      // recursively convert latlngs input into actual LatLng instances; calculate bounds along the way
      _convertLatLngs: function(t) {
        for (var e = [], i = Wt(t), n = 0, o = t.length; n < o; n++)
          i ? (e[n] = R(t[n]), this._bounds.extend(e[n])) : e[n] = this._convertLatLngs(t[n]);
        return e;
      },
      _project: function() {
        var t = new F();
        this._rings = [], this._projectLatlngs(this._latlngs, this._rings, t), this._bounds.isValid() && t.isValid() && (this._rawPxBounds = t, this._updateBounds());
      },
      _updateBounds: function() {
        var t = this._clickTolerance(), e = new O(t, t);
        this._rawPxBounds && (this._pxBounds = new F([
          this._rawPxBounds.min.subtract(e),
          this._rawPxBounds.max.add(e)
        ]));
      },
      // recursively turns latlngs into a set of rings with projected coordinates
      _projectLatlngs: function(t, e, i) {
        var n = t[0] instanceof q, o = t.length, a, l;
        if (n) {
          for (l = [], a = 0; a < o; a++)
            l[a] = this._map.latLngToLayerPoint(t[a]), i.extend(l[a]);
          e.push(l);
        } else
          for (a = 0; a < o; a++)
            this._projectLatlngs(t[a], e, i);
      },
      // clip polyline by renderer bounds so that we have less to render for performance
      _clipPoints: function() {
        var t = this._renderer._bounds;
        if (this._parts = [], !(!this._pxBounds || !this._pxBounds.intersects(t))) {
          if (this.options.noClip) {
            this._parts = this._rings;
            return;
          }
          var e = this._parts, i, n, o, a, l, h, c;
          for (i = 0, o = 0, a = this._rings.length; i < a; i++)
            for (c = this._rings[i], n = 0, l = c.length; n < l - 1; n++)
              h = Un(c[n], c[n + 1], t, n, !0), h && (e[o] = e[o] || [], e[o].push(h[0]), (h[1] !== c[n + 1] || n === l - 2) && (e[o].push(h[1]), o++));
        }
      },
      // simplify each clipped part of the polyline for performance
      _simplifyPoints: function() {
        for (var t = this._parts, e = this.options.smoothFactor, i = 0, n = t.length; i < n; i++)
          t[i] = Dn(t[i], e);
      },
      _update: function() {
        this._map && (this._clipPoints(), this._simplifyPoints(), this._updatePath());
      },
      _updatePath: function() {
        this._renderer._updatePoly(this);
      },
      // Needed by the `Canvas` renderer for interactivity
      _containsPoint: function(t, e) {
        var i, n, o, a, l, h, c = this._clickTolerance();
        if (!this._pxBounds || !this._pxBounds.contains(t))
          return !1;
        for (i = 0, a = this._parts.length; i < a; i++)
          for (h = this._parts[i], n = 0, l = h.length, o = l - 1; n < l; o = n++)
            if (!(!e && n === 0) && Vn(t, h[o], h[n]) <= c)
              return !0;
        return !1;
      }
    });
    function qo(t, e) {
      return new se(t, e);
    }
    se._flat = Wn;
    var Ge = se.extend({
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
        return Rn(this._defaultShape(), this._map.options.crs);
      },
      _convertLatLngs: function(t) {
        var e = se.prototype._convertLatLngs.call(this, t), i = e.length;
        return i >= 2 && e[0] instanceof q && e[0].equals(e[i - 1]) && e.pop(), e;
      },
      _setLatLngs: function(t) {
        se.prototype._setLatLngs.call(this, t), Wt(this._latlngs) && (this._latlngs = [this._latlngs]);
      },
      _defaultShape: function() {
        return Wt(this._latlngs[0]) ? this._latlngs[0] : this._latlngs[0][0];
      },
      _clipPoints: function() {
        var t = this._renderer._bounds, e = this.options.weight, i = new O(e, e);
        if (t = new F(t.min.subtract(i), t.max.add(i)), this._parts = [], !(!this._pxBounds || !this._pxBounds.intersects(t))) {
          if (this.options.noClip) {
            this._parts = this._rings;
            return;
          }
          for (var n = 0, o = this._rings.length, a; n < o; n++)
            a = Nn(this._rings[n], t, !0), a.length && this._parts.push(a);
        }
      },
      _updatePath: function() {
        this._renderer._updatePoly(this, !0);
      },
      // Needed by the `Canvas` renderer for interactivity
      _containsPoint: function(t) {
        var e = !1, i, n, o, a, l, h, c, f;
        if (!this._pxBounds || !this._pxBounds.contains(t))
          return !1;
        for (a = 0, c = this._parts.length; a < c; a++)
          for (i = this._parts[a], l = 0, f = i.length, h = f - 1; l < f; h = l++)
            n = i[l], o = i[h], n.y > t.y != o.y > t.y && t.x < (o.x - n.x) * (t.y - n.y) / (o.y - n.y) + n.x && (e = !e);
        return e || se.prototype._containsPoint.call(this, t, !0);
      }
    });
    function $o(t, e) {
      return new Ge(t, e);
    }
    var ae = oe.extend({
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
        K(this, e), this._layers = {}, t && this.addData(t);
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
        var a = this.options;
        if (a.filter && !a.filter(t))
          return this;
        var l = Ii(t, a);
        return l ? (l.feature = Ni(t), l.defaultOptions = l.options, this.resetStyle(l), a.onEachFeature && a.onEachFeature(t, l), this.addLayer(l)) : this;
      },
      // @method resetStyle( <Path> layer? ): this
      // Resets the given vector layer's style to the original GeoJSON style, useful for resetting style after hover events.
      // If `layer` is omitted, the style of all features in the current layer is reset.
      resetStyle: function(t) {
        return t === void 0 ? this.eachLayer(this.resetStyle, this) : (t.options = U({}, t.defaultOptions), this._setLayerStyle(t, this.options.style), this);
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
    function Ii(t, e) {
      var i = t.type === "Feature" ? t.geometry : t, n = i ? i.coordinates : null, o = [], a = e && e.pointToLayer, l = e && e.coordsToLatLng || yn, h, c, f, v;
      if (!n && !i)
        return null;
      switch (i.type) {
        case "Point":
          return h = l(n), qn(a, t, h, e);
        case "MultiPoint":
          for (f = 0, v = n.length; f < v; f++)
            h = l(n[f]), o.push(qn(a, t, h, e));
          return new oe(o);
        case "LineString":
        case "MultiLineString":
          return c = Ai(n, i.type === "LineString" ? 0 : 1, l), new se(c, e);
        case "Polygon":
        case "MultiPolygon":
          return c = Ai(n, i.type === "Polygon" ? 1 : 2, l), new Ge(c, e);
        case "GeometryCollection":
          for (f = 0, v = i.geometries.length; f < v; f++) {
            var C = Ii({
              geometry: i.geometries[f],
              type: "Feature",
              properties: t.properties
            }, e);
            C && o.push(C);
          }
          return new oe(o);
        case "FeatureCollection":
          for (f = 0, v = i.features.length; f < v; f++) {
            var V = Ii(i.features[f], e);
            V && o.push(V);
          }
          return new oe(o);
        default:
          throw new Error("Invalid GeoJSON object.");
      }
    }
    function qn(t, e, i, n) {
      return t ? t(e, i) : new Oi(i, n && n.markersInheritOptions && n);
    }
    function yn(t) {
      return new q(t[1], t[0], t[2]);
    }
    function Ai(t, e, i) {
      for (var n = [], o = 0, a = t.length, l; o < a; o++)
        l = e ? Ai(t[o], e - 1, i) : (i || yn)(t[o]), n.push(l);
      return n;
    }
    function wn(t, e) {
      return t = R(t), t.alt !== void 0 ? [ct(t.lng, e), ct(t.lat, e), ct(t.alt, e)] : [ct(t.lng, e), ct(t.lat, e)];
    }
    function Bi(t, e, i, n) {
      for (var o = [], a = 0, l = t.length; a < l; a++)
        o.push(e ? Bi(t[a], Wt(t[a]) ? 0 : e - 1, i, n) : wn(t[a], n));
      return !e && i && o.length > 0 && o.push(o[0].slice()), o;
    }
    function je(t, e) {
      return t.feature ? U({}, t.feature, { geometry: e }) : Ni(e);
    }
    function Ni(t) {
      return t.type === "Feature" || t.type === "FeatureCollection" ? t : {
        type: "Feature",
        properties: {},
        geometry: t
      };
    }
    var bn = {
      toGeoJSON: function(t) {
        return je(this, {
          type: "Point",
          coordinates: wn(this.getLatLng(), t)
        });
      }
    };
    Oi.include(bn), gn.include(bn), Zi.include(bn), se.include({
      toGeoJSON: function(t) {
        var e = !Wt(this._latlngs), i = Bi(this._latlngs, e ? 1 : 0, !1, t);
        return je(this, {
          type: (e ? "Multi" : "") + "LineString",
          coordinates: i
        });
      }
    }), Ge.include({
      toGeoJSON: function(t) {
        var e = !Wt(this._latlngs), i = e && !Wt(this._latlngs[0]), n = Bi(this._latlngs, i ? 2 : e ? 1 : 0, !0, t);
        return e || (n = [n]), je(this, {
          type: (i ? "Multi" : "") + "Polygon",
          coordinates: n
        });
      }
    }), We.include({
      toMultiPoint: function(t) {
        var e = [];
        return this.eachLayer(function(i) {
          e.push(i.toGeoJSON(t).geometry.coordinates);
        }), je(this, {
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
            var a = o.toGeoJSON(t);
            if (i)
              n.push(a.geometry);
            else {
              var l = Ni(a);
              l.type === "FeatureCollection" ? n.push.apply(n, l.features) : n.push(l);
            }
          }
        }), i ? je(this, {
          geometries: n,
          type: "GeometryCollection"
        }) : {
          type: "FeatureCollection",
          features: n
        };
      }
    });
    function $n(t, e) {
      return new ae(t, e);
    }
    var Ko = $n, Ri = $t.extend({
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
        this._url = t, this._bounds = st(e), K(this, i);
      },
      onAdd: function() {
        this._image || (this._initImage(), this.options.opacity < 1 && this._updateOpacity()), this.options.interactive && (A(this._image, "leaflet-interactive"), this.addInteractiveTarget(this._image)), this.getPane().appendChild(this._image), this._reset();
      },
      onRemove: function() {
        at(this._image), this.options.interactive && this.removeInteractiveTarget(this._image);
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
        return this._map && Fe(this._image), this;
      },
      // @method bringToBack(): this
      // Brings the layer to the bottom of all overlays.
      bringToBack: function() {
        return this._map && Ue(this._image), this;
      },
      // @method setUrl(url: String): this
      // Changes the URL of the image.
      setUrl: function(t) {
        return this._url = t, this._image && (this._image.src = t), this;
      },
      // @method setBounds(bounds: LatLngBounds): this
      // Update the bounds that this ImageOverlay covers
      setBounds: function(t) {
        return this._bounds = st(t), this._map && this._reset(), this;
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
        var t = this._url.tagName === "IMG", e = this._image = t ? this._url : j("img");
        if (A(e, "leaflet-image-layer"), this._zoomAnimated && A(e, "leaflet-zoom-animated"), this.options.className && A(e, this.options.className), e.onselectstart = X, e.onmousemove = X, e.onload = W(this.fire, this, "load"), e.onerror = W(this._overlayOnError, this, "error"), (this.options.crossOrigin || this.options.crossOrigin === "") && (e.crossOrigin = this.options.crossOrigin === !0 ? "" : this.options.crossOrigin), this.options.zIndex && this._updateZIndex(), t) {
          this._url = e.src;
          return;
        }
        e.src = this._url, e.alt = this.options.alt;
      },
      _animateZoom: function(t) {
        var e = this._map.getZoomScale(t.zoom), i = this._map._latLngBoundsToNewLayerBounds(this._bounds, t.zoom, t.center).min;
        Te(this._image, i, e);
      },
      _reset: function() {
        var t = this._image, e = new F(
          this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
          this._map.latLngToLayerPoint(this._bounds.getSouthEast())
        ), i = e.getSize();
        gt(t, e.min), t.style.width = i.x + "px", t.style.height = i.y + "px";
      },
      _updateOpacity: function() {
        Ut(this._image, this.options.opacity);
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
      return new Ri(t, e, i);
    }, Kn = Ri.extend({
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
        var t = this._url.tagName === "VIDEO", e = this._image = t ? this._url : j("video");
        if (A(e, "leaflet-image-layer"), this._zoomAnimated && A(e, "leaflet-zoom-animated"), this.options.className && A(e, this.options.className), e.onselectstart = X, e.onmousemove = X, e.onloadeddata = W(this.fire, this, "load"), t) {
          for (var i = e.getElementsByTagName("source"), n = [], o = 0; o < i.length; o++)
            n.push(i[o].src);
          this._url = i.length > 0 ? n : [e.src];
          return;
        }
        mt(this._url) || (this._url = [this._url]), !this.options.keepAspectRatio && Object.prototype.hasOwnProperty.call(e.style, "objectFit") && (e.style.objectFit = "fill"), e.autoplay = !!this.options.autoplay, e.loop = !!this.options.loop, e.muted = !!this.options.muted, e.playsInline = !!this.options.playsInline;
        for (var a = 0; a < this._url.length; a++) {
          var l = j("source");
          l.src = this._url[a], e.appendChild(l);
        }
      }
      // @method getElement(): HTMLVideoElement
      // Returns the instance of [`HTMLVideoElement`](https://developer.mozilla.org/docs/Web/API/HTMLVideoElement)
      // used by this overlay.
    });
    function Yo(t, e, i) {
      return new Kn(t, e, i);
    }
    var Jn = Ri.extend({
      _initImage: function() {
        var t = this._image = this._url;
        A(t, "leaflet-image-layer"), this._zoomAnimated && A(t, "leaflet-zoom-animated"), this.options.className && A(t, this.options.className), t.onselectstart = X, t.onmousemove = X;
      }
      // @method getElement(): SVGElement
      // Returns the instance of [`SVGElement`](https://developer.mozilla.org/docs/Web/API/SVGElement)
      // used by this overlay.
    });
    function Xo(t, e, i) {
      return new Jn(t, e, i);
    }
    var ee = $t.extend({
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
        t && (t instanceof q || mt(t)) ? (this._latlng = R(t), K(this, e)) : (K(this, t), this._source = e), this.options.content && (this._content = this.options.content);
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
        this._zoomAnimated = t._zoomAnimated, this._container || this._initLayout(), t._fadeAnimated && Ut(this._container, 0), clearTimeout(this._removeTimeout), this.getPane().appendChild(this._container), this.update(), t._fadeAnimated && Ut(this._container, 1), this.bringToFront(), this.options.interactive && (A(this._container, "leaflet-interactive"), this.addInteractiveTarget(this._container));
      },
      onRemove: function(t) {
        t._fadeAnimated ? (Ut(this._container, 0), this._removeTimeout = setTimeout(W(at, void 0, this._container), 200)) : at(this._container), this.options.interactive && (_t(this._container, "leaflet-interactive"), this.removeInteractiveTarget(this._container));
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
        return this._latlng = R(t), this._map && (this._updatePosition(), this._adjustPan()), this;
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
        return this._map && Fe(this._container), this;
      },
      // @method bringToBack: this
      // Brings this overlay to the back of other overlays (in the same map pane).
      bringToBack: function() {
        return this._map && Ue(this._container), this;
      },
      // prepare bound overlay to open: update latlng pos / content source (for FeatureGroup)
      _prepareOpen: function(t) {
        var e = this._source;
        if (!e._map)
          return !1;
        if (e instanceof oe) {
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
          var t = this._map.latLngToLayerPoint(this._latlng), e = S(this.options.offset), i = this._getAnchor();
          this._zoomAnimated ? gt(this._container, t.add(i)) : e = e.add(t).add(i);
          var n = this._containerBottom = -e.y, o = this._containerLeft = -Math.round(this._containerWidth / 2) + e.x;
          this._container.style.bottom = n + "px", this._container.style.left = o + "px";
        }
      },
      _getAnchor: function() {
        return [0, 0];
      }
    });
    H.include({
      _initOverlay: function(t, e, i, n) {
        var o = e;
        return o instanceof t || (o = new t(n).setContent(e)), i && o.setLatLng(i), o;
      }
    }), $t.include({
      _initOverlay: function(t, e, i, n) {
        var o = i;
        return o instanceof t ? (K(o, n), o._source = this) : (o = e && !n ? e : new t(n, this), o.setContent(i)), o;
      }
    });
    var Di = ee.extend({
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
        return t = arguments.length ? t : this._source._map, !t.hasLayer(this) && t._popup && t._popup.options.autoClose && t.removeLayer(t._popup), t._popup = this, ee.prototype.openOn.call(this, t);
      },
      onAdd: function(t) {
        ee.prototype.onAdd.call(this, t), t.fire("popupopen", { popup: this }), this._source && (this._source.fire("popupopen", { popup: this }, !0), this._source instanceof ye || this._source.on("preclick", Ce));
      },
      onRemove: function(t) {
        ee.prototype.onRemove.call(this, t), t.fire("popupclose", { popup: this }), this._source && (this._source.fire("popupclose", { popup: this }, !0), this._source instanceof ye || this._source.off("preclick", Ce));
      },
      getEvents: function() {
        var t = ee.prototype.getEvents.call(this);
        return (this.options.closeOnClick !== void 0 ? this.options.closeOnClick : this._map.options.closePopupOnClick) && (t.preclick = this.close), this.options.keepInView && (t.moveend = this._adjustPan), t;
      },
      _initLayout: function() {
        var t = "leaflet-popup", e = this._container = j(
          "div",
          t + " " + (this.options.className || "") + " leaflet-zoom-animated"
        ), i = this._wrapper = j("div", t + "-content-wrapper", e);
        if (this._contentNode = j("div", t + "-content", i), si(e), hn(this._contentNode), Z(e, "contextmenu", Ce), this._tipContainer = j("div", t + "-tip-container", e), this._tip = j("div", t + "-tip", this._tipContainer), this.options.closeButton) {
          var n = this._closeButton = j("a", t + "-close-button", e);
          n.setAttribute("role", "button"), n.setAttribute("aria-label", "Close popup"), n.href = "#close", n.innerHTML = '<span aria-hidden="true">&#215;</span>', Z(n, "click", function(o) {
            kt(o), this.close();
          }, this);
        }
      },
      _updateLayout: function() {
        var t = this._contentNode, e = t.style;
        e.width = "", e.whiteSpace = "nowrap";
        var i = t.offsetWidth;
        i = Math.min(i, this.options.maxWidth), i = Math.max(i, this.options.minWidth), e.width = i + 1 + "px", e.whiteSpace = "", e.height = "";
        var n = t.offsetHeight, o = this.options.maxHeight, a = "leaflet-popup-scrolled";
        o && n > o ? (e.height = o + "px", A(t, a)) : _t(t, a), this._containerWidth = this._container.offsetWidth;
      },
      _animateZoom: function(t) {
        var e = this._map._latLngToNewLayerPoint(this._latlng, t.zoom, t.center), i = this._getAnchor();
        gt(this._container, e.add(i));
      },
      _adjustPan: function() {
        if (this.options.autoPan) {
          if (this._map._panAnim && this._map._panAnim.stop(), this._autopanning) {
            this._autopanning = !1;
            return;
          }
          var t = this._map, e = parseInt(ei(this._container, "marginBottom"), 10) || 0, i = this._container.offsetHeight + e, n = this._containerWidth, o = new O(this._containerLeft, -i - this._containerBottom);
          o._add(ke(this._container));
          var a = t.layerPointToContainerPoint(o), l = S(this.options.autoPanPadding), h = S(this.options.autoPanPaddingTopLeft || l), c = S(this.options.autoPanPaddingBottomRight || l), f = t.getSize(), v = 0, C = 0;
          a.x + n + c.x > f.x && (v = a.x + n - f.x + c.x), a.x - v - h.x < 0 && (v = a.x - h.x), a.y + i + c.y > f.y && (C = a.y + i - f.y + c.y), a.y - C - h.y < 0 && (C = a.y - h.y), (v || C) && (this.options.keepInView && (this._autopanning = !0), t.fire("autopanstart").panBy([v, C]));
        }
      },
      _getAnchor: function() {
        return S(this._source && this._source._getPopupAnchor ? this._source._getPopupAnchor() : [0, 0]);
      }
    }), Qo = function(t, e) {
      return new Di(t, e);
    };
    H.mergeOptions({
      closePopupOnClick: !0
    }), H.include({
      // @method openPopup(popup: Popup): this
      // Opens the specified popup while closing the previously opened (to make sure only one is opened at one time for usability).
      // @alternative
      // @method openPopup(content: String|HTMLElement, latlng: LatLng, options?: Popup options): this
      // Creates a popup with the specified content and options and opens it in the given point on a map.
      openPopup: function(t, e, i) {
        return this._initOverlay(Di, t, e, i).openOn(this), this;
      },
      // @method closePopup(popup?: Popup): this
      // Closes the popup previously opened with [openPopup](#map-openpopup) (or the given one).
      closePopup: function(t) {
        return t = arguments.length ? t : this._popup, t && t.close(), this;
      }
    }), $t.include({
      // @method bindPopup(content: String|HTMLElement|Function|Popup, options?: Popup options): this
      // Binds a popup to the layer with the passed `content` and sets up the
      // necessary event listeners. If a `Function` is passed it will receive
      // the layer as the first argument and should return a `String` or `HTMLElement`.
      bindPopup: function(t, e) {
        return this._popup = this._initOverlay(Di, this._popup, t, e), this._popupHandlersAdded || (this.on({
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
        return this._popup && (this instanceof oe || (this._popup._source = this), this._popup._prepareOpen(t || this._latlng) && this._popup.openOn(this._map)), this;
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
          Me(t);
          var e = t.layer || t.target;
          if (this._popup._source === e && !(e instanceof ye)) {
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
    var Vi = ee.extend({
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
        ee.prototype.onAdd.call(this, t), this.setOpacity(this.options.opacity), t.fire("tooltipopen", { tooltip: this }), this._source && (this.addEventParent(this._source), this._source.fire("tooltipopen", { tooltip: this }, !0));
      },
      onRemove: function(t) {
        ee.prototype.onRemove.call(this, t), t.fire("tooltipclose", { tooltip: this }), this._source && (this.removeEventParent(this._source), this._source.fire("tooltipclose", { tooltip: this }, !0));
      },
      getEvents: function() {
        var t = ee.prototype.getEvents.call(this);
        return this.options.permanent || (t.preclick = this.close), t;
      },
      _initLayout: function() {
        var t = "leaflet-tooltip", e = t + " " + (this.options.className || "") + " leaflet-zoom-" + (this._zoomAnimated ? "animated" : "hide");
        this._contentNode = this._container = j("div", e), this._container.setAttribute("role", "tooltip"), this._container.setAttribute("id", "leaflet-tooltip-" + B(this));
      },
      _updateLayout: function() {
      },
      _adjustPan: function() {
      },
      _setPosition: function(t) {
        var e, i, n = this._map, o = this._container, a = n.latLngToContainerPoint(n.getCenter()), l = n.layerPointToContainerPoint(t), h = this.options.direction, c = o.offsetWidth, f = o.offsetHeight, v = S(this.options.offset), C = this._getAnchor();
        h === "top" ? (e = c / 2, i = f) : h === "bottom" ? (e = c / 2, i = 0) : h === "center" ? (e = c / 2, i = f / 2) : h === "right" ? (e = 0, i = f / 2) : h === "left" ? (e = c, i = f / 2) : l.x < a.x ? (h = "right", e = 0, i = f / 2) : (h = "left", e = c + (v.x + C.x) * 2, i = f / 2), t = t.subtract(S(e, i, !0)).add(v).add(C), _t(o, "leaflet-tooltip-right"), _t(o, "leaflet-tooltip-left"), _t(o, "leaflet-tooltip-top"), _t(o, "leaflet-tooltip-bottom"), A(o, "leaflet-tooltip-" + h), gt(o, t);
      },
      _updatePosition: function() {
        var t = this._map.latLngToLayerPoint(this._latlng);
        this._setPosition(t);
      },
      setOpacity: function(t) {
        this.options.opacity = t, this._container && Ut(this._container, t);
      },
      _animateZoom: function(t) {
        var e = this._map._latLngToNewLayerPoint(this._latlng, t.zoom, t.center);
        this._setPosition(e);
      },
      _getAnchor: function() {
        return S(this._source && this._source._getTooltipAnchor && !this.options.sticky ? this._source._getTooltipAnchor() : [0, 0]);
      }
    }), ts = function(t, e) {
      return new Vi(t, e);
    };
    H.include({
      // @method openTooltip(tooltip: Tooltip): this
      // Opens the specified tooltip.
      // @alternative
      // @method openTooltip(content: String|HTMLElement, latlng: LatLng, options?: Tooltip options): this
      // Creates a tooltip with the specified content and options and open it.
      openTooltip: function(t, e, i) {
        return this._initOverlay(Vi, t, e, i).openOn(this), this;
      },
      // @method closeTooltip(tooltip: Tooltip): this
      // Closes the tooltip given as parameter.
      closeTooltip: function(t) {
        return t.close(), this;
      }
    }), $t.include({
      // @method bindTooltip(content: String|HTMLElement|Function|Tooltip, options?: Tooltip options): this
      // Binds a tooltip to the layer with the passed `content` and sets up the
      // necessary event listeners. If a `Function` is passed it will receive
      // the layer as the first argument and should return a `String` or `HTMLElement`.
      bindTooltip: function(t, e) {
        return this._tooltip && this.isTooltipOpen() && this.unbindTooltip(), this._tooltip = this._initOverlay(Vi, this._tooltip, t, e), this._initTooltipInteractions(), this._tooltip.options.permanent && this._map && this._map.hasLayer(this) && this.openTooltip(), this;
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
        return this._tooltip && (this instanceof oe || (this._tooltip._source = this), this._tooltip._prepareOpen(t) && (this._tooltip.openOn(this._map), this.getElement ? this._setAriaDescribedByOnLayer(this) : this.eachLayer && this.eachLayer(this._setAriaDescribedByOnLayer, this))), this;
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
        e && (Z(e, "focus", function() {
          this._tooltip._source = t, this.openTooltip();
        }, this), Z(e, "blur", this.closeTooltip, this));
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
    var Yn = He.extend({
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
        if (i.html instanceof Element ? (ki(e), e.appendChild(i.html)) : e.innerHTML = i.html !== !1 ? i.html : "", i.bgPos) {
          var n = S(i.bgPos);
          e.style.backgroundPosition = -n.x + "px " + -n.y + "px";
        }
        return this._setIconStyles(e, "icon"), e;
      },
      createShadow: function() {
        return null;
      }
    });
    function es(t) {
      return new Yn(t);
    }
    He.Default = li;
    var ui = $t.extend({
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
        updateWhenIdle: w.mobile,
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
        K(this, t);
      },
      onAdd: function() {
        this._initContainer(), this._levels = {}, this._tiles = {}, this._resetView();
      },
      beforeAdd: function(t) {
        t._addZoomLimit(this);
      },
      onRemove: function(t) {
        this._removeAllTiles(), at(this._container), t._removeZoomLimit(this), this._container = null, this._tileZoom = void 0;
      },
      // @method bringToFront: this
      // Brings the tile layer to the top of all tile layers.
      bringToFront: function() {
        return this._map && (Fe(this._container), this._setAutoZIndex(Math.max)), this;
      },
      // @method bringToBack: this
      // Brings the tile layer to the bottom of all tile layers.
      bringToBack: function() {
        return this._map && (Ue(this._container), this._setAutoZIndex(Math.min)), this;
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
        return this.options.updateWhenIdle || (this._onMove || (this._onMove = it(this._onMoveEnd, this.options.updateInterval, this)), t.move = this._onMove), this._zoomAnimated && (t.zoomanim = this._animateZoom), t;
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
        return t instanceof O ? t : new O(t, t);
      },
      _updateZIndex: function() {
        this._container && this.options.zIndex !== void 0 && this.options.zIndex !== null && (this._container.style.zIndex = this.options.zIndex);
      },
      _setAutoZIndex: function(t) {
        for (var e = this.getPane().children, i = -t(-1 / 0, 1 / 0), n = 0, o = e.length, a; n < o; n++)
          a = e[n].style.zIndex, e[n] !== this._container && a && (i = t(i, +a));
        isFinite(i) && (this.options.zIndex = i + t(-1, 1), this._updateZIndex());
      },
      _updateOpacity: function() {
        if (this._map && !w.ielt9) {
          Ut(this._container, this.options.opacity);
          var t = +/* @__PURE__ */ new Date(), e = !1, i = !1;
          for (var n in this._tiles) {
            var o = this._tiles[n];
            if (!(!o.current || !o.loaded)) {
              var a = Math.min(1, (t - o.loaded) / 200);
              Ut(o.el, a), a < 1 ? e = !0 : (o.active ? i = !0 : this._onOpaqueTile(o), o.active = !0);
            }
          }
          i && !this._noPrune && this._pruneTiles(), e && (N(this._fadeFrame), this._fadeFrame = P(this._updateOpacity, this));
        }
      },
      _onOpaqueTile: X,
      _initContainer: function() {
        this._container || (this._container = j("div", "leaflet-layer " + (this.options.className || "")), this._updateZIndex(), this.options.opacity < 1 && this._updateOpacity(), this.getPane().appendChild(this._container));
      },
      _updateLevels: function() {
        var t = this._tileZoom, e = this.options.maxZoom;
        if (t !== void 0) {
          for (var i in this._levels)
            i = Number(i), this._levels[i].el.children.length || i === t ? (this._levels[i].el.style.zIndex = e - Math.abs(t - i), this._onUpdateLevel(i)) : (at(this._levels[i].el), this._removeTilesAtZoom(i), this._onRemoveLevel(i), delete this._levels[i]);
          var n = this._levels[t], o = this._map;
          return n || (n = this._levels[t] = {}, n.el = j("div", "leaflet-tile-container leaflet-zoom-animated", this._container), n.el.style.zIndex = e, n.origin = o.project(o.unproject(o.getPixelOrigin()), t).round(), n.zoom = t, this._setZoomTransform(n, o.getCenter(), o.getZoom()), X(n.el.offsetWidth), this._onCreateLevel(n)), this._level = n, n;
        }
      },
      _onUpdateLevel: X,
      _onRemoveLevel: X,
      _onCreateLevel: X,
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
          at(this._levels[t].el), this._onRemoveLevel(Number(t)), delete this._levels[t];
        this._removeAllTiles(), this._tileZoom = void 0;
      },
      _retainParent: function(t, e, i, n) {
        var o = Math.floor(t / 2), a = Math.floor(e / 2), l = i - 1, h = new O(+o, +a);
        h.z = +l;
        var c = this._tileCoordsToKey(h), f = this._tiles[c];
        return f && f.active ? (f.retain = !0, !0) : (f && f.loaded && (f.retain = !0), l > n ? this._retainParent(o, a, l, n) : !1);
      },
      _retainChildren: function(t, e, i, n) {
        for (var o = 2 * t; o < 2 * t + 2; o++)
          for (var a = 2 * e; a < 2 * e + 2; a++) {
            var l = new O(o, a);
            l.z = i + 1;
            var h = this._tileCoordsToKey(l), c = this._tiles[h];
            if (c && c.active) {
              c.retain = !0;
              continue;
            } else c && c.loaded && (c.retain = !0);
            i + 1 < n && this._retainChildren(o, a, i + 1, n);
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
        var a = this.options.updateWhenZooming && o !== this._tileZoom;
        (!n || a) && (this._tileZoom = o, this._abortLoading && this._abortLoading(), this._updateLevels(), this._resetGrid(), o !== void 0 && this._update(t), i || this._pruneTiles(), this._noPrune = !!i), this._setZoomTransforms(t, e);
      },
      _setZoomTransforms: function(t, e) {
        for (var i in this._levels)
          this._setZoomTransform(this._levels[i], t, e);
      },
      _setZoomTransform: function(t, e, i) {
        var n = this._map.getZoomScale(i, t.zoom), o = t.origin.multiplyBy(n).subtract(this._map._getNewPixelOrigin(e, i)).round();
        w.any3d ? Te(t.el, o, n) : gt(t.el, o);
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
        var e = this._map, i = e._animatingZoom ? Math.max(e._animateToZoom, e.getZoom()) : e.getZoom(), n = e.getZoomScale(i, this._tileZoom), o = e.project(t, this._tileZoom).floor(), a = e.getSize().divideBy(n * 2);
        return new F(o.subtract(a), o.add(a));
      },
      // Private method to load tiles in the grid's active zoom level according to map bounds
      _update: function(t) {
        var e = this._map;
        if (e) {
          var i = this._clampZoom(e.getZoom());
          if (t === void 0 && (t = e.getCenter()), this._tileZoom !== void 0) {
            var n = this._getTiledPixelBounds(t), o = this._pxBoundsToTileRange(n), a = o.getCenter(), l = [], h = this.options.keepBuffer, c = new F(
              o.getBottomLeft().subtract([h, -h]),
              o.getTopRight().add([h, -h])
            );
            if (!(isFinite(o.min.x) && isFinite(o.min.y) && isFinite(o.max.x) && isFinite(o.max.y)))
              throw new Error("Attempted to load an infinite number of tiles");
            for (var f in this._tiles) {
              var v = this._tiles[f].coords;
              (v.z !== this._tileZoom || !c.contains(new O(v.x, v.y))) && (this._tiles[f].current = !1);
            }
            if (Math.abs(i - this._tileZoom) > 1) {
              this._setView(t, i);
              return;
            }
            for (var C = o.min.y; C <= o.max.y; C++)
              for (var V = o.min.x; V <= o.max.x; V++) {
                var Et = new O(V, C);
                if (Et.z = this._tileZoom, !!this._isValidTile(Et)) {
                  var Pt = this._tiles[this._tileCoordsToKey(Et)];
                  Pt ? Pt.current = !0 : l.push(Et);
                }
              }
            if (l.sort(function(Zt, $e) {
              return Zt.distanceTo(a) - $e.distanceTo(a);
            }), l.length !== 0) {
              this._loading || (this._loading = !0, this.fire("loading"));
              var Ht = document.createDocumentFragment();
              for (V = 0; V < l.length; V++)
                this._addTile(l[V], Ht);
              this._level.el.appendChild(Ht);
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
        return st(this.options.bounds).overlaps(n);
      },
      _keyToBounds: function(t) {
        return this._tileCoordsToBounds(this._keyToTileCoords(t));
      },
      _tileCoordsToNwSe: function(t) {
        var e = this._map, i = this.getTileSize(), n = t.scaleBy(i), o = n.add(i), a = e.unproject(n, t.z), l = e.unproject(o, t.z);
        return [a, l];
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
        var e = t.split(":"), i = new O(+e[0], +e[1]);
        return i.z = +e[2], i;
      },
      _removeTile: function(t) {
        var e = this._tiles[t];
        e && (at(e.el), delete this._tiles[t], this.fire("tileunload", {
          tile: e.el,
          coords: this._keyToTileCoords(t)
        }));
      },
      _initTile: function(t) {
        A(t, "leaflet-tile");
        var e = this.getTileSize();
        t.style.width = e.x + "px", t.style.height = e.y + "px", t.onselectstart = X, t.onmousemove = X, w.ielt9 && this.options.opacity < 1 && Ut(t, this.options.opacity);
      },
      _addTile: function(t, e) {
        var i = this._getTilePos(t), n = this._tileCoordsToKey(t), o = this.createTile(this._wrapCoords(t), W(this._tileReady, this, t));
        this._initTile(o), this.createTile.length < 2 && P(W(this._tileReady, this, t, null, o)), gt(o, i), this._tiles[n] = {
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
        i = this._tiles[n], i && (i.loaded = +/* @__PURE__ */ new Date(), this._map._fadeAnimated ? (Ut(i.el, 0), N(this._fadeFrame), this._fadeFrame = P(this._updateOpacity, this)) : (i.active = !0, this._pruneTiles()), e || (A(i.el, "leaflet-tile-loaded"), this.fire("tileload", {
          tile: i.el,
          coords: t
        })), this._noTilesToLoad() && (this._loading = !1, this.fire("load"), w.ielt9 || !this._map._fadeAnimated ? P(this._pruneTiles, this) : setTimeout(W(this._pruneTiles, this), 250)));
      },
      _getTilePos: function(t) {
        return t.scaleBy(this.getTileSize()).subtract(this._level.origin);
      },
      _wrapCoords: function(t) {
        var e = new O(
          this._wrapX ? nt(t.x, this._wrapX) : t.x,
          this._wrapY ? nt(t.y, this._wrapY) : t.y
        );
        return e.z = t.z, e;
      },
      _pxBoundsToTileRange: function(t) {
        var e = this.getTileSize();
        return new F(
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
      return new ui(t);
    }
    var qe = ui.extend({
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
        this._url = t, e = K(this, e), e.detectRetina && w.retina && e.maxZoom > 0 ? (e.tileSize = Math.floor(e.tileSize / 2), e.zoomReverse ? (e.zoomOffset--, e.minZoom = Math.min(e.maxZoom, e.minZoom + 1)) : (e.zoomOffset++, e.maxZoom = Math.max(e.minZoom, e.maxZoom - 1)), e.minZoom = Math.max(0, e.minZoom)) : e.zoomReverse ? e.minZoom = Math.min(e.maxZoom, e.minZoom) : e.maxZoom = Math.max(e.minZoom, e.maxZoom), typeof e.subdomains == "string" && (e.subdomains = e.subdomains.split("")), this.on("tileunload", this._onTileRemove);
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
        return Z(i, "load", W(this._tileOnLoad, this, e, i)), Z(i, "error", W(this._tileOnError, this, e, i)), (this.options.crossOrigin || this.options.crossOrigin === "") && (i.crossOrigin = this.options.crossOrigin === !0 ? "" : this.options.crossOrigin), typeof this.options.referrerPolicy == "string" && (i.referrerPolicy = this.options.referrerPolicy), i.alt = "", i.src = this.getTileUrl(t), i;
      },
      // @section Extension methods
      // @uninheritable
      // Layers extending `TileLayer` might reimplement the following method.
      // @method getTileUrl(coords: Object): String
      // Called only internally, returns the URL for a tile given its coordinates.
      // Classes extending `TileLayer` can override this function to provide custom tile URL naming schemes.
      getTileUrl: function(t) {
        var e = {
          r: w.retina ? "@2x" : "",
          s: this._getSubdomain(t),
          x: t.x,
          y: t.y,
          z: this._getZoomForUrl()
        };
        if (this._map && !this._map.options.crs.infinite) {
          var i = this._globalTileRange.max.y - t.y;
          this.options.tms && (e.y = i), e["-y"] = i;
        }
        return Yt(this._url, U(e, this.options));
      },
      _tileOnLoad: function(t, e) {
        w.ielt9 ? setTimeout(W(t, this, null, e), 0) : t(null, e);
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
          if (this._tiles[t].coords.z !== this._tileZoom && (e = this._tiles[t].el, e.onload = X, e.onerror = X, !e.complete)) {
            e.src = Gt;
            var i = this._tiles[t].coords;
            at(e), delete this._tiles[t], this.fire("tileabort", {
              tile: e,
              coords: i
            });
          }
      },
      _removeTile: function(t) {
        var e = this._tiles[t];
        if (e)
          return e.el.setAttribute("src", Gt), ui.prototype._removeTile.call(this, t);
      },
      _tileReady: function(t, e, i) {
        if (!(!this._map || i && i.getAttribute("src") === Gt))
          return ui.prototype._tileReady.call(this, t, e, i);
      }
    });
    function Xn(t, e) {
      return new qe(t, e);
    }
    var Qn = qe.extend({
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
        var i = U({}, this.defaultWmsParams);
        for (var n in e)
          n in this.options || (i[n] = e[n]);
        e = K(this, e);
        var o = e.detectRetina && w.retina ? 2 : 1, a = this.getTileSize();
        i.width = a.x * o, i.height = a.y * o, this.wmsParams = i;
      },
      onAdd: function(t) {
        this._crs = this.options.crs || t.options.crs, this._wmsVersion = parseFloat(this.wmsParams.version);
        var e = this._wmsVersion >= 1.3 ? "crs" : "srs";
        this.wmsParams[e] = this._crs.code, qe.prototype.onAdd.call(this, t);
      },
      getTileUrl: function(t) {
        var e = this._tileCoordsToNwSe(t), i = this._crs, n = xt(i.project(e[0]), i.project(e[1])), o = n.min, a = n.max, l = (this._wmsVersion >= 1.3 && this._crs === Gn ? [o.y, o.x, a.y, a.x] : [o.x, o.y, a.x, a.y]).join(","), h = qe.prototype.getTileUrl.call(this, t);
        return h + Jt(this.wmsParams, h, this.options.uppercase) + (this.options.uppercase ? "&BBOX=" : "&bbox=") + l;
      },
      // @method setParams(params: Object, noRedraw?: Boolean): this
      // Merges an object with the new parameters and re-requests tiles on the current screen (unless `noRedraw` was set to true).
      setParams: function(t, e) {
        return U(this.wmsParams, t), e || this.redraw(), this;
      }
    });
    function ns(t, e) {
      return new Qn(t, e);
    }
    qe.WMS = Qn, Xn.wms = ns;
    var re = $t.extend({
      // @section
      // @aka Renderer options
      options: {
        // @option padding: Number = 0.1
        // How much to extend the clip area around the map view (relative to its size)
        // e.g. 0.1 would be 10% of map view in each direction
        padding: 0.1
      },
      initialize: function(t) {
        K(this, t), B(this), this._layers = this._layers || {};
      },
      onAdd: function() {
        this._container || (this._initContainer(), A(this._container, "leaflet-zoom-animated")), this.getPane().appendChild(this._container), this._update(), this.on("update", this._updatePaths, this);
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
        var i = this._map.getZoomScale(e, this._zoom), n = this._map.getSize().multiplyBy(0.5 + this.options.padding), o = this._map.project(this._center, e), a = n.multiplyBy(-i).add(o).subtract(this._map._getNewPixelOrigin(t, e));
        w.any3d ? Te(this._container, a, i) : gt(this._container, a);
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
        this._bounds = new F(i, i.add(e.multiplyBy(1 + t * 2)).round()), this._center = this._map.getCenter(), this._zoom = this._map.getZoom();
      }
    }), to = re.extend({
      // @section
      // @aka Canvas options
      options: {
        // @option tolerance: Number = 0
        // How much to extend the click tolerance around a path/object on the map.
        tolerance: 0
      },
      getEvents: function() {
        var t = re.prototype.getEvents.call(this);
        return t.viewprereset = this._onViewPreReset, t;
      },
      _onViewPreReset: function() {
        this._postponeUpdatePaths = !0;
      },
      onAdd: function() {
        re.prototype.onAdd.call(this), this._draw();
      },
      _initContainer: function() {
        var t = this._container = document.createElement("canvas");
        Z(t, "mousemove", this._onMouseMove, this), Z(t, "click dblclick mousedown mouseup contextmenu", this._onClick, this), Z(t, "mouseout", this._handleMouseOut, this), t._leaflet_disable_events = !0, this._ctx = t.getContext("2d");
      },
      _destroyContainer: function() {
        N(this._redrawRequest), delete this._ctx, at(this._container), tt(this._container), delete this._container;
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
          re.prototype._update.call(this);
          var t = this._bounds, e = this._container, i = t.getSize(), n = w.retina ? 2 : 1;
          gt(e, t.min), e.width = n * i.x, e.height = n * i.y, e.style.width = i.x + "px", e.style.height = i.y + "px", w.retina && this._ctx.scale(2, 2), this._ctx.translate(-t.min.x, -t.min.y), this.fire("update");
        }
      },
      _reset: function() {
        re.prototype._reset.call(this), this._postponeUpdatePaths && (this._postponeUpdatePaths = !1, this._updatePaths());
      },
      _initPath: function(t) {
        this._updateDashArray(t), this._layers[B(t)] = t;
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
        i ? i.prev = n : this._drawLast = n, n ? n.next = i : this._drawFirst = i, delete t._order, delete this._layers[B(t)], this._requestRedraw(t);
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
        this._map && (this._extendRedrawBounds(t), this._redrawRequest = this._redrawRequest || P(this._redraw, this));
      },
      _extendRedrawBounds: function(t) {
        if (t._pxBounds) {
          var e = (t.options.weight || 0) + 1;
          this._redrawBounds = this._redrawBounds || new F(), this._redrawBounds.extend(t._pxBounds.min.subtract([e, e])), this._redrawBounds.extend(t._pxBounds.max.add([e, e]));
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
          var i, n, o, a, l = t._parts, h = l.length, c = this._ctx;
          if (h) {
            for (c.beginPath(), i = 0; i < h; i++) {
              for (n = 0, o = l[i].length; n < o; n++)
                a = l[i][n], c[n ? "lineTo" : "moveTo"](a.x, a.y);
              e && c.closePath();
            }
            this._fillStroke(c, t);
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
        e && (_t(this._container, "leaflet-interactive"), this._fireEvent([e], t, "mouseout"), this._hoveredLayer = null, this._mouseHoverThrottled = !1);
      },
      _handleMouseHover: function(t, e) {
        if (!this._mouseHoverThrottled) {
          for (var i, n, o = this._drawFirst; o; o = o.next)
            i = o.layer, i.options.interactive && i._containsPoint(e) && (n = i);
          n !== this._hoveredLayer && (this._handleMouseOut(t), n && (A(this._container, "leaflet-interactive"), this._fireEvent([n], t, "mouseover"), this._hoveredLayer = n)), this._fireEvent(this._hoveredLayer ? [this._hoveredLayer] : !1, t), this._mouseHoverThrottled = !0, setTimeout(W(function() {
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
    function eo(t) {
      return w.canvas ? new to(t) : null;
    }
    var hi = function() {
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
        this._container = j("div", "leaflet-vml-container");
      },
      _update: function() {
        this._map._animatingZoom || (re.prototype._update.call(this), this.fire("update"));
      },
      _initPath: function(t) {
        var e = t._container = hi("shape");
        A(e, "leaflet-vml-shape " + (this.options.className || "")), e.coordsize = "1 1", t._path = hi("path"), e.appendChild(t._path), this._updateStyle(t), this._layers[B(t)] = t;
      },
      _addPath: function(t) {
        var e = t._container;
        this._container.appendChild(e), t.options.interactive && t.addInteractiveTarget(e);
      },
      _removePath: function(t) {
        var e = t._container;
        at(e), t.removeInteractiveTarget(e), delete this._layers[B(t)];
      },
      _updateStyle: function(t) {
        var e = t._stroke, i = t._fill, n = t.options, o = t._container;
        o.stroked = !!n.stroke, o.filled = !!n.fill, n.stroke ? (e || (e = t._stroke = hi("stroke")), o.appendChild(e), e.weight = n.weight + "px", e.color = n.color, e.opacity = n.opacity, n.dashArray ? e.dashStyle = mt(n.dashArray) ? n.dashArray.join(" ") : n.dashArray.replace(/( *, *)/g, " ") : e.dashStyle = "", e.endcap = n.lineCap.replace("butt", "flat"), e.joinstyle = n.lineJoin) : e && (o.removeChild(e), t._stroke = null), n.fill ? (i || (i = t._fill = hi("fill")), o.appendChild(i), i.color = n.fillColor || n.color, i.opacity = n.fillOpacity) : i && (o.removeChild(i), t._fill = null);
      },
      _updateCircle: function(t) {
        var e = t._point.round(), i = Math.round(t._radius), n = Math.round(t._radiusY || i);
        this._setPath(t, t._empty() ? "M0 0" : "AL " + e.x + "," + e.y + " " + i + "," + n + " 0," + 65535 * 360);
      },
      _setPath: function(t, e) {
        t._path.v = e;
      },
      _bringToFront: function(t) {
        Fe(t._container);
      },
      _bringToBack: function(t) {
        Ue(t._container);
      }
    }, Fi = w.vml ? hi : xe, ci = re.extend({
      _initContainer: function() {
        this._container = Fi("svg"), this._container.setAttribute("pointer-events", "none"), this._rootGroup = Fi("g"), this._container.appendChild(this._rootGroup);
      },
      _destroyContainer: function() {
        at(this._container), tt(this._container), delete this._container, delete this._rootGroup, delete this._svgSize;
      },
      _update: function() {
        if (!(this._map._animatingZoom && this._bounds)) {
          re.prototype._update.call(this);
          var t = this._bounds, e = t.getSize(), i = this._container;
          (!this._svgSize || !this._svgSize.equals(e)) && (this._svgSize = e, i.setAttribute("width", e.x), i.setAttribute("height", e.y)), gt(i, t.min), i.setAttribute("viewBox", [t.min.x, t.min.y, e.x, e.y].join(" ")), this.fire("update");
        }
      },
      // methods below are called by vector layers implementations
      _initPath: function(t) {
        var e = t._path = Fi("path");
        t.options.className && A(e, t.options.className), t.options.interactive && A(e, "leaflet-interactive"), this._updateStyle(t), this._layers[B(t)] = t;
      },
      _addPath: function(t) {
        this._rootGroup || this._initContainer(), this._rootGroup.appendChild(t._path), t.addInteractiveTarget(t._path);
      },
      _removePath: function(t) {
        at(t._path), t.removeInteractiveTarget(t._path), delete this._layers[B(t)];
      },
      _updatePath: function(t) {
        t._project(), t._update();
      },
      _updateStyle: function(t) {
        var e = t._path, i = t.options;
        e && (i.stroke ? (e.setAttribute("stroke", i.color), e.setAttribute("stroke-opacity", i.opacity), e.setAttribute("stroke-width", i.weight), e.setAttribute("stroke-linecap", i.lineCap), e.setAttribute("stroke-linejoin", i.lineJoin), i.dashArray ? e.setAttribute("stroke-dasharray", i.dashArray) : e.removeAttribute("stroke-dasharray"), i.dashOffset ? e.setAttribute("stroke-dashoffset", i.dashOffset) : e.removeAttribute("stroke-dashoffset")) : e.setAttribute("stroke", "none"), i.fill ? (e.setAttribute("fill", i.fillColor || i.color), e.setAttribute("fill-opacity", i.fillOpacity), e.setAttribute("fill-rule", i.fillRule || "evenodd")) : e.setAttribute("fill", "none"));
      },
      _updatePoly: function(t, e) {
        this._setPath(t, Le(t._parts, e));
      },
      _updateCircle: function(t) {
        var e = t._point, i = Math.max(Math.round(t._radius), 1), n = Math.max(Math.round(t._radiusY), 1) || i, o = "a" + i + "," + n + " 0 1,0 ", a = t._empty() ? "M0 0" : "M" + (e.x - i) + "," + e.y + o + i * 2 + ",0 " + o + -i * 2 + ",0 ";
        this._setPath(t, a);
      },
      _setPath: function(t, e) {
        t._path.setAttribute("d", e);
      },
      // SVG does not have the concept of zIndex so we resort to changing the DOM order of elements
      _bringToFront: function(t) {
        Fe(t._path);
      },
      _bringToBack: function(t) {
        Ue(t._path);
      }
    });
    w.vml && ci.include(os);
    function io(t) {
      return w.svg || w.vml ? new ci(t) : null;
    }
    H.include({
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
        return this.options.preferCanvas && eo(t) || io(t);
      }
    });
    var no = Ge.extend({
      initialize: function(t, e) {
        Ge.prototype.initialize.call(this, this._boundsToLatLngs(t), e);
      },
      // @method setBounds(latLngBounds: LatLngBounds): this
      // Redraws the rectangle with the passed bounds.
      setBounds: function(t) {
        return this.setLatLngs(this._boundsToLatLngs(t));
      },
      _boundsToLatLngs: function(t) {
        return t = st(t), [
          t.getSouthWest(),
          t.getNorthWest(),
          t.getNorthEast(),
          t.getSouthEast()
        ];
      }
    });
    function ss(t, e) {
      return new no(t, e);
    }
    ci.create = Fi, ci.pointsToPath = Le, ae.geometryToLayer = Ii, ae.coordsToLatLng = yn, ae.coordsToLatLngs = Ai, ae.latLngToCoords = wn, ae.latLngsToCoords = Bi, ae.getFeature = je, ae.asFeature = Ni, H.mergeOptions({
      // @option boxZoom: Boolean = true
      // Whether the map can be zoomed to a rectangular area specified by
      // dragging the mouse while pressing the shift key.
      boxZoom: !0
    });
    var oo = te.extend({
      initialize: function(t) {
        this._map = t, this._container = t._container, this._pane = t._panes.overlayPane, this._resetStateTimeout = 0, t.on("unload", this._destroy, this);
      },
      addHooks: function() {
        Z(this._container, "mousedown", this._onMouseDown, this);
      },
      removeHooks: function() {
        tt(this._container, "mousedown", this._onMouseDown, this);
      },
      moved: function() {
        return this._moved;
      },
      _destroy: function() {
        at(this._pane), delete this._pane;
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
        this._clearDeferredResetState(), this._resetState(), ii(), en(), this._startPoint = this._map.mouseEventToContainerPoint(t), Z(document, {
          contextmenu: Me,
          mousemove: this._onMouseMove,
          mouseup: this._onMouseUp,
          keydown: this._onKeyDown
        }, this);
      },
      _onMouseMove: function(t) {
        this._moved || (this._moved = !0, this._box = j("div", "leaflet-zoom-box", this._container), A(this._container, "leaflet-crosshair"), this._map.fire("boxzoomstart")), this._point = this._map.mouseEventToContainerPoint(t);
        var e = new F(this._point, this._startPoint), i = e.getSize();
        gt(this._box, e.min), this._box.style.width = i.x + "px", this._box.style.height = i.y + "px";
      },
      _finish: function() {
        this._moved && (at(this._box), _t(this._container, "leaflet-crosshair")), ni(), nn(), tt(document, {
          contextmenu: Me,
          mousemove: this._onMouseMove,
          mouseup: this._onMouseUp,
          keydown: this._onKeyDown
        }, this);
      },
      _onMouseUp: function(t) {
        if (!(t.which !== 1 && t.button !== 1) && (this._finish(), !!this._moved)) {
          this._clearDeferredResetState(), this._resetStateTimeout = setTimeout(W(this._resetState, this), 0);
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
    H.addInitHook("addHandler", "boxZoom", oo), H.mergeOptions({
      // @option doubleClickZoom: Boolean|String = true
      // Whether the map can be zoomed in by double clicking on it and
      // zoomed out by double clicking while holding shift. If passed
      // `'center'`, double-click zoom will zoom to the center of the
      //  view regardless of where the mouse was.
      doubleClickZoom: !0
    });
    var so = te.extend({
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
    H.addInitHook("addHandler", "doubleClickZoom", so), H.mergeOptions({
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
    var ao = te.extend({
      addHooks: function() {
        if (!this._draggable) {
          var t = this._map;
          this._draggable = new ge(t._mapPane, t._container), this._draggable.on({
            dragstart: this._onDragStart,
            drag: this._onDrag,
            dragend: this._onDragEnd
          }, this), this._draggable.on("predrag", this._onPreDragLimit, this), t.options.worldCopyJump && (this._draggable.on("predrag", this._onPreDragWrap, this), t.on("zoomend", this._onZoomEnd, this), t.whenReady(this._onZoomEnd, this));
        }
        A(this._map._container, "leaflet-grab leaflet-touch-drag"), this._draggable.enable(), this._positions = [], this._times = [];
      },
      removeHooks: function() {
        _t(this._map._container, "leaflet-grab"), _t(this._map._container, "leaflet-touch-drag"), this._draggable.disable();
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
          var e = st(this._map.options.maxBounds);
          this._offsetLimit = xt(
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
        var t = this._worldWidth, e = Math.round(t / 2), i = this._initialWorldOffset, n = this._draggable._newPos.x, o = (n - e + i) % t + e - i, a = (n + e + i) % t - e - i, l = Math.abs(o + i) < Math.abs(a + i) ? o : a;
        this._draggable._absPos = this._draggable._newPos.clone(), this._draggable._newPos.x = l;
      },
      _onDragEnd: function(t) {
        var e = this._map, i = e.options, n = !i.inertia || t.noInertia || this._times.length < 2;
        if (e.fire("dragend", t), n)
          e.fire("moveend");
        else {
          this._prunePositions(+/* @__PURE__ */ new Date());
          var o = this._lastPos.subtract(this._positions[0]), a = (this._lastTime - this._times[0]) / 1e3, l = i.easeLinearity, h = o.multiplyBy(l / a), c = h.distanceTo([0, 0]), f = Math.min(i.inertiaMaxSpeed, c), v = h.multiplyBy(f / c), C = f / (i.inertiaDeceleration * l), V = v.multiplyBy(-C / 2).round();
          !V.x && !V.y ? e.fire("moveend") : (V = e._limitOffset(V, e.options.maxBounds), P(function() {
            e.panBy(V, {
              duration: C,
              easeLinearity: l,
              noMoveStart: !0,
              animate: !0
            });
          }));
        }
      }
    });
    H.addInitHook("addHandler", "dragging", ao), H.mergeOptions({
      // @option keyboard: Boolean = true
      // Makes the map focusable and allows users to navigate the map with keyboard
      // arrows and `+`/`-` keys.
      keyboard: !0,
      // @option keyboardPanDelta: Number = 80
      // Amount of pixels to pan when pressing an arrow key.
      keyboardPanDelta: 80
    });
    var ro = te.extend({
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
        t.tabIndex <= 0 && (t.tabIndex = "0"), Z(t, {
          focus: this._onFocus,
          blur: this._onBlur,
          mousedown: this._onMouseDown
        }, this), this._map.on({
          focus: this._addHooks,
          blur: this._removeHooks
        }, this);
      },
      removeHooks: function() {
        this._removeHooks(), tt(this._map._container, {
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
        Z(document, "keydown", this._onKeyDown, this);
      },
      _removeHooks: function() {
        tt(document, "keydown", this._onKeyDown, this);
      },
      _onKeyDown: function(t) {
        if (!(t.altKey || t.ctrlKey || t.metaKey)) {
          var e = t.keyCode, i = this._map, n;
          if (e in this._panKeys) {
            if (!i._panAnim || !i._panAnim._inProgress)
              if (n = this._panKeys[e], t.shiftKey && (n = S(n).multiplyBy(3)), i.options.maxBounds && (n = i._limitOffset(S(n), i.options.maxBounds)), i.options.worldCopyJump) {
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
          Me(t);
        }
      }
    });
    H.addInitHook("addHandler", "keyboard", ro), H.mergeOptions({
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
    var lo = te.extend({
      addHooks: function() {
        Z(this._map._container, "wheel", this._onWheelScroll, this), this._delta = 0;
      },
      removeHooks: function() {
        tt(this._map._container, "wheel", this._onWheelScroll, this);
      },
      _onWheelScroll: function(t) {
        var e = On(t), i = this._map.options.wheelDebounceTime;
        this._delta += e, this._lastMousePos = this._map.mouseEventToContainerPoint(t), this._startTime || (this._startTime = +/* @__PURE__ */ new Date());
        var n = Math.max(i - (+/* @__PURE__ */ new Date() - this._startTime), 0);
        clearTimeout(this._timer), this._timer = setTimeout(W(this._performZoom, this), n), Me(t);
      },
      _performZoom: function() {
        var t = this._map, e = t.getZoom(), i = this._map.options.zoomSnap || 0;
        t._stop();
        var n = this._delta / (this._map.options.wheelPxPerZoomLevel * 4), o = 4 * Math.log(2 / (1 + Math.exp(-Math.abs(n)))) / Math.LN2, a = i ? Math.ceil(o / i) * i : o, l = t._limitZoom(e + (this._delta > 0 ? a : -a)) - e;
        this._delta = 0, this._startTime = null, l && (t.options.scrollWheelZoom === "center" ? t.setZoom(e + l) : t.setZoomAround(this._lastMousePos, e + l));
      }
    });
    H.addInitHook("addHandler", "scrollWheelZoom", lo);
    var as = 600;
    H.mergeOptions({
      // @section Touch interaction options
      // @option tapHold: Boolean
      // Enables simulation of `contextmenu` event, default is `true` for mobile Safari.
      tapHold: w.touchNative && w.safari && w.mobile,
      // @option tapTolerance: Number = 15
      // The max number of pixels a user can shift his finger during touch
      // for it to be considered a valid tap.
      tapTolerance: 15
    });
    var uo = te.extend({
      addHooks: function() {
        Z(this._map._container, "touchstart", this._onDown, this);
      },
      removeHooks: function() {
        tt(this._map._container, "touchstart", this._onDown, this);
      },
      _onDown: function(t) {
        if (clearTimeout(this._holdTimeout), t.touches.length === 1) {
          var e = t.touches[0];
          this._startPos = this._newPos = new O(e.clientX, e.clientY), this._holdTimeout = setTimeout(W(function() {
            this._cancel(), this._isTapValid() && (Z(document, "touchend", kt), Z(document, "touchend touchcancel", this._cancelClickPrevent), this._simulateEvent("contextmenu", e));
          }, this), as), Z(document, "touchend touchcancel contextmenu", this._cancel, this), Z(document, "touchmove", this._onMove, this);
        }
      },
      _cancelClickPrevent: function t() {
        tt(document, "touchend", kt), tt(document, "touchend touchcancel", t);
      },
      _cancel: function() {
        clearTimeout(this._holdTimeout), tt(document, "touchend touchcancel contextmenu", this._cancel, this), tt(document, "touchmove", this._onMove, this);
      },
      _onMove: function(t) {
        var e = t.touches[0];
        this._newPos = new O(e.clientX, e.clientY);
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
    H.addInitHook("addHandler", "tapHold", uo), H.mergeOptions({
      // @section Touch interaction options
      // @option touchZoom: Boolean|String = *
      // Whether the map can be zoomed by touch-dragging with two fingers. If
      // passed `'center'`, it will zoom to the center of the view regardless of
      // where the touch events (fingers) were. Enabled for touch-capable web
      // browsers.
      touchZoom: w.touch,
      // @option bounceAtZoomLimits: Boolean = true
      // Set it to false if you don't want the map to zoom beyond min/max zoom
      // and then bounce back when pinch-zooming.
      bounceAtZoomLimits: !0
    });
    var ho = te.extend({
      addHooks: function() {
        A(this._map._container, "leaflet-touch-zoom"), Z(this._map._container, "touchstart", this._onTouchStart, this);
      },
      removeHooks: function() {
        _t(this._map._container, "leaflet-touch-zoom"), tt(this._map._container, "touchstart", this._onTouchStart, this);
      },
      _onTouchStart: function(t) {
        var e = this._map;
        if (!(!t.touches || t.touches.length !== 2 || e._animatingZoom || this._zooming)) {
          var i = e.mouseEventToContainerPoint(t.touches[0]), n = e.mouseEventToContainerPoint(t.touches[1]);
          this._centerPoint = e.getSize()._divideBy(2), this._startLatLng = e.containerPointToLatLng(this._centerPoint), e.options.touchZoom !== "center" && (this._pinchStartLatLng = e.containerPointToLatLng(i.add(n)._divideBy(2))), this._startDist = i.distanceTo(n), this._startZoom = e.getZoom(), this._moved = !1, this._zooming = !0, e._stop(), Z(document, "touchmove", this._onTouchMove, this), Z(document, "touchend touchcancel", this._onTouchEnd, this), kt(t);
        }
      },
      _onTouchMove: function(t) {
        if (!(!t.touches || t.touches.length !== 2 || !this._zooming)) {
          var e = this._map, i = e.mouseEventToContainerPoint(t.touches[0]), n = e.mouseEventToContainerPoint(t.touches[1]), o = i.distanceTo(n) / this._startDist;
          if (this._zoom = e.getScaleZoom(o, this._startZoom), !e.options.bounceAtZoomLimits && (this._zoom < e.getMinZoom() && o < 1 || this._zoom > e.getMaxZoom() && o > 1) && (this._zoom = e._limitZoom(this._zoom)), e.options.touchZoom === "center") {
            if (this._center = this._startLatLng, o === 1)
              return;
          } else {
            var a = i._add(n)._divideBy(2)._subtract(this._centerPoint);
            if (o === 1 && a.x === 0 && a.y === 0)
              return;
            this._center = e.unproject(e.project(this._pinchStartLatLng, this._zoom).subtract(a), this._zoom);
          }
          this._moved || (e._moveStart(!0, !1), this._moved = !0), N(this._animRequest);
          var l = W(e._move, e, this._center, this._zoom, { pinch: !0, round: !1 }, void 0);
          this._animRequest = P(l, this, !0), kt(t);
        }
      },
      _onTouchEnd: function() {
        if (!this._moved || !this._zooming) {
          this._zooming = !1;
          return;
        }
        this._zooming = !1, N(this._animRequest), tt(document, "touchmove", this._onTouchMove, this), tt(document, "touchend touchcancel", this._onTouchEnd, this), this._map.options.zoomAnimation ? this._map._animateZoom(this._center, this._map._limitZoom(this._zoom), !0, this._map.options.zoomSnap) : this._map._resetView(this._center, this._map._limitZoom(this._zoom));
      }
    });
    H.addInitHook("addHandler", "touchZoom", ho), H.BoxZoom = oo, H.DoubleClickZoom = so, H.Drag = ao, H.Keyboard = ro, H.ScrollWheelZoom = lo, H.TapHold = uo, H.TouchZoom = ho, d.Bounds = F, d.Browser = w, d.CRS = p, d.Canvas = to, d.Circle = gn, d.CircleMarker = Zi, d.Class = bt, d.Control = qt, d.DivIcon = Yn, d.DivOverlay = ee, d.DomEvent = Po, d.DomUtil = xo, d.Draggable = ge, d.Evented = ce, d.FeatureGroup = oe, d.GeoJSON = ae, d.GridLayer = ui, d.Handler = te, d.Icon = He, d.ImageOverlay = Ri, d.LatLng = q, d.LatLngBounds = Lt, d.Layer = $t, d.LayerGroup = We, d.LineUtil = No, d.Map = H, d.Marker = Oi, d.Mixin = Eo, d.Path = ye, d.Point = O, d.PolyUtil = Oo, d.Polygon = Ge, d.Polyline = se, d.Popup = Di, d.PosAnimation = Zn, d.Projection = Ro, d.Rectangle = no, d.Renderer = re, d.SVG = ci, d.SVGOverlay = Jn, d.TileLayer = qe, d.Tooltip = Vi, d.Transformation = fe, d.Util = ut, d.VideoOverlay = Kn, d.bind = W, d.bounds = xt, d.canvas = eo, d.circle = jo, d.circleMarker = Go, d.control = ai, d.divIcon = es, d.extend = U, d.featureGroup = Uo, d.geoJSON = $n, d.geoJson = Ko, d.gridLayer = is, d.icon = Wo, d.imageOverlay = Jo, d.latLng = R, d.latLngBounds = st, d.layerGroup = Fo, d.map = To, d.marker = Ho, d.point = S, d.polygon = $o, d.polyline = qo, d.popup = Qo, d.rectangle = ss, d.setOptions = K, d.stamp = B, d.svg = io, d.svgOverlay = Xo, d.tileLayer = Xn, d.tooltip = ts, d.transformation = Xt, d.version = It, d.videoOverlay = Yo;
    var rs = window.L;
    d.noConflict = function() {
      return window.L = rs, this;
    }, window.L = d;
  });
})(Tn, Tn.exports);
var Cs = Tn.exports;
const x = /* @__PURE__ */ ks(Cs), Ms = ["aria-expanded", "aria-controls", "aria-activedescendant", "aria-label", "disabled"], Ss = { class: "app-select-value" }, zs = {
  class: "app-select-chevron",
  "aria-hidden": "true"
}, Es = ["id", "aria-label"], Os = ["id", "aria-selected", "aria-disabled", "data-index", "onPointermove", "onClick"], Zs = {
  key: 0,
  class: "app-select-check",
  "aria-hidden": "true"
}, Is = {
  key: 0,
  class: "app-select-empty"
}, di = /* @__PURE__ */ mo({
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
  setup(Ct, { emit: ue }) {
    const d = Ct, It = ue;
    let U = 0;
    const Rt = (g) => `${g}-${++U}`, W = Y("zh-CN"), Kt = Y(null), B = Y(null), it = Y(!1), nt = Y(-1), X = Y({}), ct = Y(!1), Ot = Rt("select"), ot = pt(() => d.options.map((g) => typeof g == "string" ? { value: g, label: g } : g)), K = pt(() => ot.value.find((g) => g.value === d.modelValue)?.label || d.modelValue || d.placeholder);
    let Jt = "", Ee = 0;
    function Yt() {
      const g = Kt.value?.getBoundingClientRect();
      if (!g) return;
      const P = window.visualViewport?.height || innerHeight, N = window.visualViewport?.width || innerWidth, ut = P - g.bottom - 10, bt = g.top - 10;
      ct.value = g.top >= Math.min(320, ot.value.length * 46 + 12) + 8 || ut < Math.min(320, ot.value.length * 46 + 12) && bt > ut;
      const Ze = Math.max(48, Math.min(340, ct.value ? bt : ut)), ht = Math.min(Math.max(g.width, 220), N - 16);
      X.value = { position: "fixed", left: `${Math.max(8, Math.min(g.left, N - ht - 8))}px`, width: `${ht}px`, maxHeight: `${Ze}px`, ...ct.value ? { bottom: `${P - g.top + 8}px` } : { top: `${g.bottom + 8}px` } };
    }
    function mt(g = !1) {
      it.value = !1, Jt = "", g && Kt.value?.focus();
    }
    async function ne() {
      d.disabled || it.value || (it.value = !0, nt.value = ot.value.findIndex((g) => g.value === d.modelValue && !g.disabled), nt.value < 0 && (nt.value = ot.value.findIndex((g) => !g.disabled)), Yt(), await fi(), Gt());
    }
    function Gt() {
      B.value?.querySelector(`[data-index="${nt.value}"]`)?.scrollIntoView({ block: "nearest" });
    }
    function he(g) {
      const P = ot.value[g];
      !P || P.disabled || (It("update:modelValue", P.value), It("change", P.value), mt(!0));
    }
    async function Oe(g) {
      if (!(d.disabled || g.isComposing)) {
        if (g.key === "Tab") {
          mt();
          return;
        }
        if (g.key === "Escape") {
          it.value && (g.preventDefault(), mt(!0));
          return;
        }
        if (["ArrowDown", "ArrowUp", "Home", "End", "Enter", " "].includes(g.key)) {
          if (g.preventDefault(), !it.value) {
            await ne();
            return;
          }
          if (g.key === "Enter" || g.key === " ") {
            he(nt.value);
            return;
          }
          const P = ot.value.map((ut, bt) => ut.disabled ? -1 : bt).filter((ut) => ut >= 0);
          if (!P.length) return;
          const N = P.indexOf(nt.value);
          nt.value = g.key === "Home" ? P[0] : g.key === "End" ? P[P.length - 1] : P[(N + (g.key === "ArrowDown" ? 1 : -1) + P.length) % P.length], await fi(), Gt();
          return;
        }
        if (g.key.length === 1 && !g.ctrlKey && !g.metaKey && !g.altKey) {
          await ne();
          const P = Date.now();
          Jt = P - Ee > 700 ? g.key : Jt + g.key, Ee = P;
          const N = ot.value.findIndex((ut) => !ut.disabled && ut.label.toLocaleLowerCase().startsWith(Jt.toLocaleLowerCase()));
          N >= 0 && (nt.value = N, await fi(), Gt());
        }
      }
    }
    function be(g) {
      const P = g.target;
      !Kt.value?.contains(P) && !B.value?.contains(P) && mt();
    }
    function lt(g) {
      it.value && (!(g.target instanceof Node) || !B.value?.contains(g.target)) && Yt();
    }
    return Pn(() => d.disabled, (g) => {
      g && mt();
    }), Pn(ot, () => {
      it.value && (nt.value >= ot.value.length && (nt.value = ot.value.findIndex((g) => !g.disabled)), fi(Yt));
    }), vo(() => {
      document.addEventListener("pointerdown", be, !0), window.addEventListener("resize", Yt), window.addEventListener("scroll", lt, !0);
    }), go(() => {
      document.removeEventListener("pointerdown", be, !0), window.removeEventListener("resize", Yt), window.removeEventListener("scroll", lt, !0);
    }), (g, P) => (T(), M("div", ms(g.$attrs, {
      class: ["app-select", { "is-disabled": Ct.disabled, "is-open": it.value }]
    }), [
      r("button", {
        ref_key: "trigger",
        ref: Kt,
        type: "button",
        class: "app-select-trigger",
        role: "combobox",
        "aria-haspopup": "listbox",
        "aria-expanded": it.value,
        "aria-controls": it.value ? Wi(Ot) : void 0,
        "aria-activedescendant": it.value && nt.value >= 0 ? `${Wi(Ot)}-${nt.value}` : void 0,
        "aria-label": Ct.ariaLabel,
        disabled: Ct.disabled,
        onClick: P[0] || (P[0] = (N) => it.value ? mt() : ne()),
        onKeydown: Oe
      }, [
        r("span", Ss, y(K.value), 1),
        r("span", zs, [
          (T(), M("svg", {
            class: we({ "is-open": it.value }),
            width: "18",
            height: "18",
            viewBox: "0 0 24 24",
            fill: "none"
          }, [...P[2] || (P[2] = [
            r("path", {
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
        ze(ys, { name: "select-menu" }, {
          default: ws(() => [
            it.value ? (T(), M("div", {
              key: 0,
              id: Wi(Ot),
              ref_key: "menu",
              ref: B,
              class: we(["app-select-menu", { "opens-up": ct.value }]),
              style: Hi(X.value),
              role: "listbox",
              "aria-label": Ct.ariaLabel || "选项",
              onPointerdown: P[1] || (P[1] = po(() => {
              }, ["prevent"]))
            }, [
              (T(!0), M(Nt, null, ie(ot.value, (N, ut) => (T(), M("div", {
                id: `${Wi(Ot)}-${ut}`,
                key: `${N.value}:${ut}`,
                role: "option",
                "aria-selected": N.value === Ct.modelValue,
                "aria-disabled": !!N.disabled,
                "data-index": ut,
                class: we(["app-select-option", { highlighted: nt.value === ut, selected: N.value === Ct.modelValue, disabled: N.disabled }]),
                onPointermove: (bt) => !N.disabled && (nt.value = ut),
                onClick: po((bt) => he(ut), ["stop"])
              }, [
                r("span", null, y(N.label), 1),
                N.value === Ct.modelValue ? (T(), M("span", Zs, [...P[3] || (P[3] = [
                  r("svg", {
                    width: "16",
                    height: "16",
                    viewBox: "0 0 24 24",
                    fill: "none"
                  }, [
                    r("path", {
                      d: "m5 12 4 4L19 6",
                      stroke: "currentColor",
                      "stroke-width": "2.4",
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round"
                    })
                  ], -1)
                ])])) : et("", !0)
              ], 42, Os))), 128)),
              ot.value.length ? et("", !0) : (T(), M("div", Is, y(W.value === "en" ? "No options available" : "暂无可选项"), 1))
            ], 46, Es)) : et("", !0)
          ]),
          _: 1
        })
      ]))
    ], 16));
  }
}), As = { class: "hero" }, Bs = { class: "hero-main" }, Ns = { class: "hero-actions" }, Rs = ["disabled"], Ds = ["disabled"], Vs = { class: "state-row" }, Fs = { class: "pill soft" }, Us = { class: "pill soft" }, Ws = { class: "pill soft" }, Hs = {
  key: 0,
  class: "banner err"
}, Gs = {
  key: 1,
  class: "banner ok"
}, js = {
  class: "tabs",
  "aria-label": "视图"
}, qs = ["onClick"], $s = { class: "tab-ic" }, Ks = { class: "panel" }, Js = { class: "card" }, Ys = {
  key: 0,
  class: "empty"
}, Xs = {
  key: 1,
  class: "settings-grid"
}, Qs = { class: "cog-metric" }, ta = { class: "cog-metric" }, ea = { class: "cog-metric" }, ia = { class: "cog-metric" }, na = { class: "cog-metric" }, oa = { class: "cog-metric" }, sa = { class: "cog-metric" }, aa = { class: "cog-metric" }, ra = { class: "cog-metric" }, la = { class: "cog-metric" }, ua = { class: "cog-metric" }, ha = { class: "cog-metric" }, ca = { class: "cog-metric" }, da = { class: "cog-metric" }, fa = { class: "cog-metric" }, _a = { class: "cog-metric" }, pa = { class: "cog-metric" }, ma = { class: "cog-metric" }, va = {
  key: 2,
  class: "hint"
}, ga = {
  key: 3,
  class: "som-channels"
}, ya = { class: "som-chan-name" }, wa = { class: "som-chan-bar" }, ba = { class: "som-chan-val" }, xa = {
  key: 0,
  class: "hint"
}, La = { class: "card" }, Pa = { class: "switches" }, Ta = { class: "sw" }, ka = { class: "sw" }, Ca = { class: "sw" }, Ma = { class: "sw" }, Sa = { class: "sw" }, za = { class: "grid2" }, Ea = { class: "card" }, Oa = { class: "settings-grid" }, Za = { class: "switches" }, Ia = { class: "sw" }, Aa = { class: "sw" }, Ba = { class: "sw" }, Na = { class: "sw" }, Ra = { class: "sw" }, Da = { class: "card" }, Va = { class: "settings-grid" }, Fa = { class: "sw" }, Ua = { class: "sw" }, Wa = { class: "sw" }, Ha = { class: "card" }, Ga = { class: "settings-grid" }, ja = { class: "sw" }, qa = { class: "card" }, $a = { class: "settings-grid" }, Ka = { class: "sw" }, Ja = { class: "card" }, Ya = { class: "settings-grid" }, Xa = { class: "sw" }, Qa = { class: "card" }, tr = { class: "switches" }, er = { class: "sw" }, ir = { class: "sw" }, nr = { class: "sw" }, or = { class: "sw" }, sr = { class: "panel" }, ar = { class: "card" }, rr = { class: "settings-grid" }, lr = { class: "card" }, ur = { class: "world-field" }, hr = { class: "card" }, cr = { class: "settings-grid" }, dr = { class: "world-field" }, fr = { class: "world-field" }, _r = { class: "world-field" }, pr = { class: "world-actions" }, mr = ["disabled"], vr = ["disabled"], gr = { class: "card" }, yr = { class: "wm-head" }, wr = { class: "count-pill" }, br = {
  key: 0,
  class: "wm-place"
}, xr = {
  key: 0,
  class: "hint wm-premise"
}, Lr = { class: "wm-map-wrap" }, Pr = {
  key: 0,
  class: "wm-offline"
}, Tr = {
  key: 1,
  class: "wm-compass",
  "aria-hidden": "true"
}, kr = {
  key: 1,
  class: "empty"
}, Cr = {
  key: 2,
  class: "wm-legend"
}, Mr = {
  key: 3,
  class: "wm-routes"
}, Sr = {
  key: 0,
  class: "wm-routes-col"
}, zr = {
  key: 1,
  class: "wm-routes-col"
}, Er = { class: "card" }, Or = { class: "wm-head" }, Zr = { class: "count-pill" }, Ir = { class: "feed" }, Ar = { class: "meta" }, Br = {
  key: 0,
  class: "empty"
}, Nr = { class: "panel" }, Rr = { class: "card" }, Dr = { class: "count-pill" }, Vr = { class: "feed" }, Fr = { class: "meta" }, Ur = {
  key: 0,
  class: "empty"
}, Wr = { class: "grid2" }, Hr = { class: "card" }, Gr = { class: "feed" }, jr = { class: "meta" }, qr = { class: "meta" }, $r = { class: "meta" }, Kr = {
  key: 0,
  class: "empty"
}, Jr = { class: "card" }, Yr = { class: "feed" }, Xr = { class: "meta" }, Qr = {
  key: 0,
  class: "empty"
}, tl = { class: "section" }, el = { class: "grid2" }, il = { class: "card" }, nl = { style: { "margin-top": "14px", display: "flex", gap: "10px", "flex-wrap": "wrap" } }, ol = ["disabled"], sl = "https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}", al = /* @__PURE__ */ mo({
  __name: "CompanionPage",
  setup(Ct) {
    const { confirm: ue } = Ls(), d = Y({ settings: {}, cognition: null }), It = Y(!1), U = Y(""), Rt = Y(""), W = Y("cognition"), Kt = Y(null), B = [
      { key: "cognition", i: "01", label: "认知", icon: "◉" },
      { key: "world", i: "02", label: "世界", icon: "✦" },
      { key: "state", i: "03", label: "状态", icon: "☺" }
    ];
    function it(m) {
      Rt.value = m, setTimeout(() => {
        Rt.value === m && (Rt.value = "");
      }, 2500);
    }
    function nt(m) {
      const s = String(m?.message || m || "");
      return /connection refused|Unavailable|actively refused|dial tcp|ECONNREFUSED|LIFE is unavailable|life unavailable|502|503/i.test(s) ? "LIFE 服务暂时未就绪（可能正在启动或重启），已自动重试。稍候刷新即可。" : s || "操作失败";
    }
    const X = (m) => new Promise((s) => setTimeout(s, m));
    async function ct(m = 0) {
      It.value = !0, U.value = "";
      try {
        const s = await fetch("/api/life/companion");
        if (!s.ok) throw Error(await s.text() || String(s.status));
        d.value = await s.json(), Ki(), It.value = !1;
      } catch (s) {
        if (m < 4)
          return await X(1500), ct(m + 1);
        U.value = nt(s), It.value = !1;
      }
    }
    async function Ot(m, s) {
      for (let u = 0; u < 3; u++)
        try {
          const E = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: m, payload: s }) });
          if (!E.ok) throw Error(await E.text());
          const b = await E.json().catch(() => ({}));
          return await ct(), b;
        } catch (E) {
          if (u < 2 && /connection refused|Unavailable|actively refused|dial tcp|502|503|life unavailable/i.test(String(E?.message || E))) {
            await X(1200);
            continue;
          }
          return U.value = nt(E), null;
        }
      return null;
    }
    function ot(m) {
      W.value = m;
      const s = matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", u = Kt.value;
      u ? u.scrollTo({ top: 0, behavior: s }) : window.scrollTo({ top: 0, behavior: s });
    }
    const K = {
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
      // memory & consolidation. On by default — they are what makes lived
      // experience leave a trace; turn one off to ablate it.
      cog_memory_encode: "1",
      cog_sleep_replay: "1",
      cog_memory_reconsolidate: "1",
      cog_cls_interleave: "1"
    }, Jt = [
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
      "cog_memory_encode",
      "cog_sleep_replay",
      "cog_memory_reconsolidate",
      "cog_cls_interleave"
    ], Ee = ["cog_affect_profile", "cog_language_framing"], Yt = ["typical", "depression", "anxiety", "bpd", "alexithymia"], mt = [
      "independent",
      "interchanging",
      "cognitive_determinism",
      "weak_whorf",
      "thinking_for_speaking",
      "radical_connectionism",
      "determinism"
    ], ne = ["0 · egocentric", "1 · subjective", "2 · self-reflective", "3 · mutual", "4 · societal-symbolic"], Gt = pt({
      get: () => `${Number(p.value.cog_social_stage ?? 2)} · ${["egocentric", "subjective", "self-reflective", "mutual", "societal-symbolic"][Number(p.value.cog_social_stage ?? 2)] || "self-reflective"}`,
      set: (m) => {
        p.value.cog_social_stage = Number(String(m).split("·")[0].trim());
      }
    });
    function he(m) {
      return String(d.value.settings?.[m] ?? K[m] ?? "");
    }
    function Oe() {
      const m = {};
      for (const [s, u] of Object.entries(K)) {
        const E = he(s) || u;
        m[s] = Jt.includes(s) ? E === "1" : Ee.includes(s) ? E : Number(E);
      }
      return m;
    }
    function be() {
      const m = {};
      for (const [s, u] of Object.entries(K)) {
        const E = p.value[s];
        Jt.includes(s) ? m[s] = E ? "1" : "0" : m[s] = String(E ?? u);
      }
      return m;
    }
    const lt = pt(() => d.value.cognition || null), g = pt(() => lt.value?.last_control || null), P = pt(() => lt.value?.wave1 || null), N = pt(() => lt.value?.wave2 || null), ut = pt(() => lt.value?.wave3 || null), bt = pt(() => lt.value?.wave4a || null), Ze = pt(() => lt.value?.wave4b || null), ht = pt(() => lt.value?.persona || null), ce = pt(() => lt.value?.wave2?.somatic_channels || null), O = (m) => ({
      fatigue: "疲劳",
      pain: "疼痛",
      cardiorespiratory: "心慌",
      gastrointestinal: "胃肠",
      dizziness: "头晕",
      sleep: "睡眠"
    })[m] || m, _i = (m) => Math.max(0.02, Math.min(1, Number(m))).toFixed(3), S = pt(() => {
      const m = ht.value?.evidence || {};
      return Object.entries(m).map(([s, u]) => `${s}(${u.join("、")})`).join("；");
    });
    function F(m, s = 3) {
      return m == null || m === "" ? "—" : Number(m).toFixed(s);
    }
    const xt = pt(() => (d.value.timeline || []).filter((m) => m.topic === "世界").slice(0, 30)), Lt = pt(() => d.value.commitments || []), st = pt(() => d.value.user_model || []), q = pt(() => Object.entries(d.value.values || {}).map(([m, s]) => ({ k: m, v: Number(s) })).sort((m, s) => Math.abs(s.v) - Math.abs(m.v)).slice(0, 20));
    function R(m) {
      try {
        const s = JSON.parse(m || "[]");
        return Array.isArray(s) ? s : [];
      } catch {
        return [];
      }
    }
    const p = Y({}), At = Y("off"), pi = [{ value: "off", label: "关闭" }, { value: "texture", label: "纹理（只记录）" }, { value: "full", label: "完整（可主动提及）" }], de = Y("fictional"), fe = Y(""), Xt = Y(""), _e = Y(""), Ie = Y(""), xe = Y(""), Le = Y(""), pe = Y(""), zt = Y(!1), Ae = Y(!1), mi = [{ value: "fictional", label: "虚构" }, { value: "real", label: "真实" }], Bt = pt(() => d.value.worldview || null), D = pt(() => Bt.value?.map || { locations: [], edges: [], actors: [], width: 1e3, height: 700, title: "" }), vi = pt(() => Bt.value?.actor_locations || {}), Gi = ["home", "work", "shop", "food", "park", "transit", "other"], ji = { home: "家", work: "工作", shop: "商店", food: "餐饮", park: "公园", transit: "交通", other: "其他" }, Be = { home: "#e07a5f", work: "#5b8def", shop: "#e0a23d", food: "#57a773", park: "#3faead", transit: "#8b6fd6", other: "#8a94a6" }, gi = pt(() => Gi.filter((m) => (D.value.locations || []).some((s) => (s.kind || "other") === m)));
    function Tt(m) {
      const s = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
      return String(m ?? "").replace(/[&<>"']/g, (u) => s[u]);
    }
    const Ne = Y(null), me = Y(!1);
    let Q = null, k = null, Re = "";
    const De = ["#2b4250", "#33495a", "#2f4a44", "#3a4258", "#463f4f", "#3d4a3a", "#4a4436", "#39485c"], Ke = ["#dfe4ea", "#d6dce4", "#e6eaf0", "#cfd7e0"];
    let Pe = "";
    const Dt = Y("city"), ve = {};
    function Je(m, s, u) {
      (ve[m] || (ve[m] = [])).push({ layer: s, base: u });
    }
    function jt(m) {
      Pe = Pe === m ? "" : m;
      for (const [s, u] of Object.entries(ve)) {
        const E = s === Pe;
        for (const { layer: b, base: I } of u)
          b.setStyle && b.setStyle({ ...I, weight: (I.weight || 2) + (E ? 3.5 : 0), opacity: E ? 1 : I.opacity ?? 1 }), E && b.bringToFront && b.bringToFront();
      }
    }
    function yi() {
      Pe = "", Xe(!1);
    }
    function wi() {
      Dt.value = Dt.value === "city" ? "nation" : "city", Xe(!1);
    }
    function Ve() {
      return { w: D.value.width || 1e3, h: D.value.height || 700 };
    }
    function Mt(m, s) {
      return [Ve().h - s, m];
    }
    function Vt(m, s) {
      return x.divIcon({ className: "wm-route", html: `<span class="wm-route-inner" style="--c:${s}">${Tt(m)}</span>`, iconSize: [0, 0], iconAnchor: [0, 0] });
    }
    function qi(m, s) {
      return x.divIcon({ className: "wm-route wm-minor", html: `<span class="wm-route-inner" style="--c:${s}">${Tt(m)}</span>`, iconSize: [0, 0], iconAnchor: [0, 0] });
    }
    function $i(m, s) {
      return x.divIcon({ className: "wm-route wm-station", html: `<span class="wm-route-inner" style="--c:${s}">${Tt(m)}</span>`, iconSize: [0, 0], iconAnchor: [0, 0] });
    }
    function bi(m) {
      const s = [], u = [];
      for (const E of m) {
        const b = String(E.text).length * 13 + 20, I = 22;
        s.some((St) => Math.abs(St.x - E.x) < (St.w + b) / 2 && Math.abs(St.y - E.y) < (St.h + I) / 2) || (s.push({ x: E.x, y: E.y, w: b, h: I }), u.push(E));
      }
      return u;
    }
    function Ye() {
      const m = D.value.kind === "real" ? "real" : "fictional";
      if (Q && Re !== m && (Q.remove(), Q = null, k = null), !(Q || !Ne.value)) {
        if (m === "real") {
          me.value = !1, Q = x.map(Ne.value, { zoomControl: !0, attributionControl: !0 }).setView([35, 105], 5);
          const s = x.tileLayer(sl, { subdomains: ["1", "2", "3", "4"], maxZoom: 19, minZoom: 3, attribution: "© 高德地图" });
          s.on("tileerror", () => {
            me.value = !0;
          }), s.on("load", () => {
            me.value = !1;
          }), s.addTo(Q);
        } else {
          me.value = !1;
          const { w: s, h: u } = Ve();
          Q = x.map(Ne.value, { crs: x.CRS.Simple, zoomControl: !0, attributionControl: !1, minZoom: -3, maxZoom: 3 }).setView([u / 2, s / 2], -1.5);
          for (const [b, I] of [["pWater", 350], ["pParks", 360], ["pBlocks", 370], ["pRoads", 380], ["pMetro", 400], ["pBus", 410], ["pLabels", 620]])
            Q.createPane(b), Q.getPane(b).style.zIndex = String(I);
          const E = () => Q.getContainer().classList.toggle("wm-zoom-low", Q.getZoom() < 0);
          Q.on("zoomend", E), setTimeout(E, 0);
        }
        Re = m, k = x.layerGroup().addTo(Q);
      }
    }
    function Xe(m = !1) {
      if (!Q || !k) return;
      k.clearLayers();
      for (const b of Object.keys(ve)) delete ve[b];
      Pe = "";
      const s = D.value.locations || [];
      if (!s.length) return;
      const u = Re !== "real", E = {};
      for (const b of s) E[b.id] = b;
      if (u) {
        const { w: b, h: I } = Ve(), $ = (_) => _.map((G) => Mt(G[0], G[1])), St = D.value.nation;
        if (Dt.value === "nation" && St) {
          x.rectangle([[0, 0], [I, b]], { pane: "pWater", stroke: !1, fillColor: "#d9e6f0", fillOpacity: 1 }).addTo(k), x.polygon($(St.land), { pane: "pWater", color: "#8fbfe6", weight: 1.5, fillColor: "#f4efe1", fillOpacity: 1 }).addTo(k), (St.provinces || []).forEach((_, G) => {
            x.polygon($(_.points), { pane: "pParks", color: "#c9b98f", weight: 1, fillColor: G % 2 ? "#ece2c8" : "#e4d7b4", fillOpacity: 0.55 }).addTo(k), x.marker($([_.label])[0], { pane: "pLabels", interactive: !1, icon: Vt(_.name, "#8a7a5c") }).addTo(k);
          }), (St.routes || []).forEach((_) => x.polyline($(_.points), { pane: "pRoads", color: "#b98a4a", weight: 2.5, dashArray: "2 7" }).addTo(k)), (St.cities || []).forEach((_) => {
            const G = Mt(_.x, _.y);
            x.circleMarker(G, { pane: "pLabels", radius: _.capital ? 9 : 6, color: "#ffffff", weight: 2, fillColor: _.capital ? "#d64545" : "#3a6ea5", fillOpacity: 1 }).bindPopup(Tt(_.name)).addTo(k), x.marker(G, { pane: "pLabels", interactive: !1, icon: Vt(_.name, _.capital ? "#d64545" : "#3a6ea5") }).addTo(k);
          }), Q.fitBounds([[0, 0], [I, b]], { padding: [6, 6] });
          return;
        }
        x.rectangle([[0, 0], [I, b]], { pane: "pWater", stroke: !1, fillColor: "#eef1f4", fillOpacity: 1 }).addTo(k), (D.value.compounds || []).forEach((_) => {
          x.polygon($(_.points), { pane: "pParks", color: "#c9b98f", weight: 1.2, dashArray: "7 5", fillColor: "#f3ead0", fillOpacity: 0.5 }).addTo(k), x.marker($(_.points)[0], { pane: "pLabels", interactive: !1, icon: Vt(_.name, "#a9884a") }).addTo(k);
        }), (D.value.lakes || []).forEach((_) => {
          x.polygon($(_.points), { pane: "pWater", color: "#8fbfe6", weight: 1.5, fillColor: "#bcd9f0", fillOpacity: 1 }).addTo(k), _.name && _.name !== "" && x.marker(Mt(_.label[0], _.label[1]), { pane: "pLabels", interactive: !1, icon: Vt(_.name, "#3d7fb5") }).addTo(k);
        }), (D.value.rivers || []).forEach((_) => {
          x.polyline($(_.points), { pane: "pWater", color: "#8fbfe6", weight: 16, lineCap: "round", lineJoin: "round" }).addTo(k), x.polyline($(_.points), { pane: "pWater", color: "#bcd9f0", weight: 11, lineCap: "round", lineJoin: "round" }).addTo(k), _.name && _.name !== "" && x.marker($(_.points)[Math.floor(_.points.length / 2)], { pane: "pLabels", interactive: !1, icon: Vt(_.name, "#3d7fb5") }).addTo(k);
        }), (D.value.parks || []).forEach((_) => {
          x.polygon($(_.points), { pane: "pParks", color: "#a9d3a0", weight: 1, fillColor: "#c9e6c4", fillOpacity: 1 }).addTo(k), (_.trees || []).forEach((G) => x.circleMarker(Mt(G[0], G[1]), { pane: "pParks", radius: 2.6, stroke: !1, fillColor: "#82bd79", fillOpacity: 1 }).addTo(k)), _.name && _.name !== "公园" && x.marker($(_.points)[0], { pane: "pLabels", interactive: !1, icon: Vt(_.name, "#5a9e52") }).addTo(k);
        });
        const Li = [];
        (D.value.blocks || []).forEach((_) => {
          const G = $(_.points);
          if (x.polygon(G.map((J) => [J[0] - 3, J[1] + 3]), { pane: "pBlocks", stroke: !1, fillColor: "#5b6b7a", fillOpacity: 0.16 }).addTo(k), x.polygon(G, { pane: "pBlocks", color: "#b9c3cd", weight: 1, fillColor: Ke[(_.shade || 0) % Ke.length], fillOpacity: 1 }).addTo(k), _.tower) {
            const J = G.reduce((dt, ft) => dt + ft[0], 0) / G.length, vt = G.reduce((dt, ft) => dt + ft[1], 0) / G.length;
            x.polygon(
              G.map((dt) => [J + (dt[0] - J) * 0.5, vt + (dt[1] - vt) * 0.5]),
              { pane: "pBlocks", color: "#aab4c0", weight: 1, fillColor: "#eef2f6", fillOpacity: 1 }
            ).addTo(k);
          }
          if (_.name) {
            const J = _.points.reduce((dt, ft) => dt + ft[0], 0) / _.points.length, vt = _.points.reduce((dt, ft) => dt + ft[1], 0) / _.points.length;
            Li.push({ x: J, y: vt, text: _.name, color: _.tower ? "#6b5b8a" : "#7a8794" });
          }
        }), (D.value.named_buildings || []).forEach((_) => {
          x.circleMarker(Mt(_.x, _.y), { pane: "pLabels", radius: 4, color: "#ffffff", weight: 1.5, fillColor: "#8a5a2b", fillOpacity: 1 }).addTo(k), x.marker(Mt(_.x, _.y), { pane: "pLabels", interactive: !1, icon: Vt(_.name, "#8a5a2b") }).addTo(k);
        });
        for (const _ of bi(Li))
          x.marker(Mt(_.x, _.y), { pane: "pLabels", interactive: !1, icon: qi(_.text, _.color) }).addTo(k);
        const Pi = {
          highway: { casing: 13, fill: 6.5, color: "#f08c2e" },
          arterial: { casing: 10, fill: 4.5, color: "#f7cf8a" },
          street: { casing: 5, fill: 2.4, color: "#ffffff" }
        };
        (D.value.streets || []).forEach((_) => {
          const G = Pi[_.kind] || Pi.street, J = $(_.points);
          x.polyline(J, { pane: "pRoads", color: "#ffffff", weight: G.casing, lineCap: "round", lineJoin: "round" }).addTo(k), x.polyline(J, { pane: "pRoads", color: G.color, weight: G.fill, lineCap: "round", lineJoin: "round" }).addTo(k);
        }), (D.value.roads || []).forEach((_, G) => {
          if (!_.name) return;
          const J = $(_.points), vt = "road:" + G;
          x.polyline(J, { pane: "pRoads", color: "#ffffff", weight: 11, lineCap: "round", lineJoin: "round" }).addTo(k);
          const dt = { pane: "pRoads", color: "#f6c56b", weight: 5, opacity: 1, lineCap: "round", lineJoin: "round" };
          Je(vt, x.polyline(J, dt).on("click", () => jt(vt)).addTo(k), dt), x.marker(J[Math.floor(J.length / 2)], { pane: "pLabels", interactive: !0, icon: Vt(_.name, "#9a8358") }).on("click", () => jt(vt)).addTo(k);
        }), (D.value.districts || []).forEach((_, G) => {
          x.circle(Mt(_.x, _.y), { pane: "pRoads", radius: _.r || 200, color: "#93a2b0", weight: 1, dashArray: "4 7", fillColor: De[G % De.length], fillOpacity: 0.08 }).addTo(k), x.marker(Mt(_.x, _.y), { pane: "pLabels", interactive: !1, icon: x.divIcon({ className: "wm-district", html: `<span class="wm-district-inner">${Tt(_.name)}</span>`, iconSize: [0, 0], iconAnchor: [0, 0] }) }).addTo(k);
        });
        const Ti = [];
        (D.value.metro || []).forEach((_, G) => {
          const J = $(_.points), vt = "metro:" + G;
          x.polyline(J, { pane: "pMetro", color: "#ffffff", weight: 8, lineCap: "round", lineJoin: "round" }).addTo(k);
          const dt = { pane: "pMetro", color: _.color, weight: 4.5, opacity: 0.92, lineCap: "round", lineJoin: "round" };
          Je(vt, x.polyline(J, dt).on("click", () => jt(vt)).addTo(k), dt), (_.stations || []).forEach((ft) => {
            x.circleMarker(Mt(ft.x, ft.y), { pane: "pMetro", radius: 5, color: "#ffffff", weight: 2.5, fillColor: _.color, fillOpacity: 1 }).bindPopup(Tt(ft.name || _.name)).on("click", () => jt(vt)).addTo(k), ft.name && Ti.push({ x: ft.x, y: ft.y, text: ft.name, color: _.color });
          }), x.marker(J[Math.floor(J.length / 2)], { pane: "pLabels", interactive: !0, icon: Vt(_.name, _.color) }).on("click", () => jt(vt)).addTo(k);
        }), (D.value.bus || []).forEach((_, G) => {
          const J = $(_.points), vt = "bus:" + G, dt = { pane: "pBus", color: _.color, weight: 3, opacity: 0.95, dashArray: "7 7", lineCap: "round" };
          Je(vt, x.polyline(J, dt).on("click", () => jt(vt)).addTo(k), dt), (_.stops || []).forEach((ft) => x.circleMarker(Mt(ft.x, ft.y), { pane: "pBus", radius: 3.2, color: "#ffffff", weight: 1.5, fillColor: _.color, fillOpacity: 1 }).bindPopup(Tt(ft.name || _.name)).on("click", () => jt(vt)).addTo(k)), x.marker(J[Math.floor(J.length / 2)], { pane: "pLabels", interactive: !0, icon: Vt(_.name, _.color) }).on("click", () => jt(vt)).addTo(k);
        });
        for (const _ of bi(Ti))
          x.marker(Mt(_.x, _.y), { pane: "pLabels", interactive: !1, icon: $i(_.text, _.color) }).addTo(k);
      } else
        for (const b of D.value.edges || []) {
          const I = E[b[0]], $ = E[b[1]];
          I?.lat != null && $?.lat != null && x.polyline([[I.lat, I.lng], [$.lat, $.lng]], { color: "#5b8def", weight: 3, opacity: 0.55, dashArray: "2 8", lineCap: "round" }).addTo(k);
        }
      for (const b of s) {
        const I = Be[b.kind] || Be.other, $ = u ? Mt(b.x, b.y) : b.lat != null ? [b.lat, b.lng] : null;
        if (!$) continue;
        const St = x.divIcon({
          className: "wm-pin-holder",
          html: `<span class="wm-pin" style="--c:${I}"></span><span class="wm-pin-label">${Tt(b.name)}</span>`,
          iconSize: [0, 0],
          iconAnchor: [0, 0]
        });
        x.marker($, { icon: St }).bindPopup(`<b>${Tt(b.name)}</b>${b.desc ? "<br>" + Tt(b.desc) : ""}`).addTo(k);
      }
      for (const b of D.value.actors || []) {
        const I = E[vi.value[b.id] || b.location];
        if (!I) continue;
        const $ = u ? Mt(I.x, I.y) : I.lat != null ? [I.lat, I.lng] : null;
        if (!$) continue;
        const St = x.divIcon({
          className: "wm-actor-holder",
          html: `<span class="wm-actor-badge">${Tt((b.name || "?").slice(0, 1))}</span><span class="wm-actor-name">${Tt(b.name)}</span>`,
          iconSize: [0, 0],
          iconAnchor: [0, 0]
        });
        x.marker($, { icon: St }).bindPopup(`${Tt(b.name)} · ${Tt(I.name)}`).addTo(k);
      }
      if (!m)
        if (u) {
          const { w: b, h: I } = Ve();
          Q.fitBounds([[0, 0], [I, b]], { padding: [0, 0] });
        } else {
          const b = s.filter((I) => I.lat != null).map((I) => [I.lat, I.lng]);
          b.length > 1 ? Q.fitBounds(b, { padding: [56, 56], maxZoom: 15 }) : b.length === 1 && Q.setView(b[0], 14);
        }
    }
    Pn([W, () => d.value.worldview], async () => {
      W.value === "world" && (await fi(), Ye(), Xe(), Q && setTimeout(() => Q.invalidateSize(), 80));
    }), go(() => {
      Q && (Q.remove(), Q = null, k = null);
    });
    function Ki() {
      p.value = { ...Oe() }, At.value = String(d.value.settings?.world_density || "off"), de.value = String(d.value.settings?.world_fictional || "fictional"), fe.value = String(d.value.settings?.world_country || ""), Xt.value = String(d.value.settings?.world_city || ""), _e.value = String(d.value.settings?.world_district || ""), Ie.value = String(d.value.settings?.world_premise || ""), xe.value = String(d.value.settings?.persona_text || ""), Le.value = String(d.value.settings?.world_actors || ""), pe.value = String(d.value.settings?.world_places || "");
    }
    async function Qe() {
      const m = {
        ...be(),
        world_density: At.value,
        world_fictional: de.value,
        world_country: fe.value,
        world_city: Xt.value,
        world_district: _e.value,
        world_premise: Ie.value,
        world_actors: Le.value,
        world_places: pe.value,
        persona_text: xe.value
      }, s = await Ot("settings_set", { settings: m });
      s?.rejected?.length ? it(`已保存，忽略无效项：${s.rejected.join("、")}`) : it("设置已保存");
    }
    async function Ji() {
      if (!(zt.value || !await ue({
        title: "✦ AI 重写设定",
        message: "这会用模型结果覆盖上面的 国家 / 城市 / 前言 / 演员 / 地点 等设定。只想更新地图，请用「只生成地图（保留设定）」",
        confirmLabel: "覆盖并生成",
        danger: !0
      }))) {
        zt.value = !0;
        try {
          (await Ot("world_generate", { instructions: "" }))?.worldview && it("已由 AI 完善世界观并生成地图");
        } finally {
          zt.value = !1;
        }
      }
    }
    async function Ft() {
      if (!zt.value) {
        zt.value = !0;
        try {
          (await Ot("world_map_generate", { instructions: "" }))?.worldview && it("已按当前设定重新生成地图（设定未改动）");
        } finally {
          zt.value = !1;
        }
      }
    }
    async function w() {
      if (!await ue({
        title: "清除世界事件",
        message: "会删除时间线里所有「世界」事件、世界触发的主动消息与相关记忆，并重置世界状态（演员位置等）。此操作不可撤销。",
        confirmLabel: "清除",
        danger: !0
      })) return;
      await Ot("world_clear", {}) && it("已清除世界事件并重置世界状态");
    }
    async function xi() {
      if (!(!await ue({
        title: "重置整个人",
        message: `这是唯一一次可以「重来」的操作——日常里删除一条记忆或撤回一句话都是不可逆的。

会清空：全部记忆与本地备份、关系与亲密度、承诺、目标与进展日志、未完成话题、用户画像与用户模型、价值取向、人设演化、日记与梦境、每日复盘、技能与常用表达、社交节点与边、群内关系、时间线与见闻、主动消息与回执，以及认知内核（自我叙事、互惠关系、情感历史、学到的价值表）。

会保留：你自己的设置（限额、端点、群策略、日历规则）。

此操作不可撤销。`,
        confirmLabel: "继续",
        danger: !0
      }) || !await ue({
        title: "再确认一次",
        message: "真的要把这个人恢复到出厂状态吗？之后他不会再记得发生过的任何事。",
        confirmLabel: "重置整个人",
        danger: !0
      }))) {
        Ae.value = !0;
        try {
          await Ot("reset_person", {}), it("已重置整个人"), await ct();
        } finally {
          Ae.value = !1;
        }
      }
    }
    return vo(ct), (m, s) => (T(), M(Nt, null, [
      r("main", {
        class: "pcp",
        ref_key: "pageEl",
        ref: Kt
      }, [
        r("header", As, [
          r("div", Bs, [
            s[49] || (s[49] = r("div", { class: "hero-copy" }, [
              r("p", { class: "eyebrow" }, [
                r("b", null, "◉"),
                le(" L.I.F.E / COGNITION")
              ]),
              r("h1", null, "陪伴面板 · 认知内核"),
              r("p", { class: "sub" }, "五套认知回路（决策仲裁 / 情感生理 / 语言习得 / 社会学习 / 自我与时间）。它们始终在后台记录状态；只有打开对应的「调节」开关，状态才会写进提示词。全部关闭时行为与旧版完全一致。")
            ], -1)),
            r("div", Ns, [
              r("button", {
                class: "fab",
                disabled: It.value,
                onClick: Qe
              }, [...s[48] || (s[48] = [
                r("span", { class: "fab-ic" }, "✦", -1),
                le("保存设置", -1)
              ])], 8, Rs),
              r("button", {
                class: "btn tonic",
                disabled: It.value,
                onClick: ct
              }, y(It.value ? "刷新中…" : "刷新"), 9, Ds)
            ])
          ]),
          r("div", Vs, [
            r("span", {
              class: we(["pill", { bad: lt.value && !lt.value.enabled }])
            }, "认知内核 " + y(lt.value?.available === !1 ? "不可用" : lt.value?.enabled ? "运行中" : "已停止"), 3),
            r("span", Fs, "已决策 " + y(P.value?.turns ?? 0) + " 轮", 1),
            r("span", Us, "情景痕迹 " + y(P.value?.engrams ?? 0), 1),
            r("span", Ws, "词汇量 " + y(ut.value?.lexicon_size ?? 0), 1)
          ])
        ]),
        U.value ? (T(), M("p", Hs, y(U.value), 1)) : et("", !0),
        Rt.value ? (T(), M("p", Gs, y(Rt.value), 1)) : et("", !0),
        r("nav", js, [
          (T(), M(Nt, null, ie(B, (u) => r("button", {
            key: u.key,
            class: we(["tab", { active: W.value === u.key }]),
            onClick: (E) => ot(u.key)
          }, [
            r("i", null, y(u.i), 1),
            r("span", $s, y(u.icon), 1),
            le(y(u.label), 1)
          ], 10, qs)), 64))
        ]),
        z(r("section", Ks, [
          r("div", { class: "section-head" }, [
            s[50] || (s[50] = r("div", null, [
              r("h2", null, "认知内核"),
              r("p", { class: "desc" }, "实时状态与全部参数。改动后点右上角「保存设置」才会生效。")
            ], -1)),
            r("div", { class: "head-actions" }, [
              r("button", {
                class: "btn filled sm",
                onClick: Qe
              }, "保存设置")
            ])
          ]),
          r("article", Js, [
            r("h3", null, [
              s[51] || (s[51] = le("实时状态 ", -1)),
              r("span", {
                class: we(["count-pill", { ok: lt.value?.enabled }])
              }, y(lt.value?.enabled ? "运行中" : "已停止"), 3)
            ]),
            lt.value ? (T(), M("div", Xs, [
              r("div", Qs, [
                s[52] || (s[52] = r("span", null, "仲裁模式", -1)),
                r("strong", null, y(g.value?.mode || "—"), 1)
              ]),
              r("div", ta, [
                s[53] || (s[53] = r("span", null, "本轮策略", -1)),
                r("strong", null, y(g.value?.action || "—"), 1)
              ]),
              r("div", ea, [
                s[54] || (s[54] = r("span", null, "控制需求", -1)),
                r("strong", null, y(F(g.value?.need)), 1)
              ]),
              r("div", ia, [
                s[55] || (s[55] = r("span", null, "置信度", -1)),
                r("strong", null, y(F(g.value?.confidence)), 1)
              ]),
              r("div", na, [
                s[56] || (s[56] = r("span", null, "已决策轮数", -1)),
                r("strong", null, y(P.value?.turns ?? 0), 1)
              ]),
              r("div", oa, [
                s[57] || (s[57] = r("span", null, "情景痕迹", -1)),
                r("strong", null, y(P.value?.engrams ?? 0), 1)
              ]),
              r("div", sa, [
                s[58] || (s[58] = r("span", null, "模型可靠性", -1)),
                r("strong", null, y(F(P.value?.reliability)), 1)
              ]),
              r("div", aa, [
                s[59] || (s[59] = r("span", null, "心境", -1)),
                r("strong", null, y(F(N.value?.mood)), 1)
              ]),
              r("div", ra, [
                s[60] || (s[60] = r("span", null, "迷走张力", -1)),
                r("strong", null, y(F(N.value?.vagal_tone)), 1)
              ]),
              r("div", la, [
                s[61] || (s[61] = r("span", null, "躯体化指数", -1)),
                r("strong", null, y(F(N.value?.somatization_index)), 1)
              ]),
              r("div", ua, [
                s[62] || (s[62] = r("span", null, "健康焦虑", -1)),
                r("strong", null, y(F(N.value?.health_anxiety)), 1)
              ]),
              r("div", ha, [
                s[63] || (s[63] = r("span", null, "躯体负担", -1)),
                r("strong", null, y(F(N.value?.somatic_burden)), 1)
              ]),
              r("div", ca, [
                s[64] || (s[64] = r("span", null, "人设特质", -1)),
                r("strong", null, y(ht.value?.applied ? ht.value.source === "llm" ? "已应用 · LLM" : "已应用 · 词典" : "未解析"), 1)
              ]),
              r("div", da, [
                s[65] || (s[65] = r("span", null, "词汇量", -1)),
                r("strong", null, y(ut.value?.lexicon_size ?? 0), 1)
              ]),
              r("div", fa, [
                s[66] || (s[66] = r("span", null, "共情权重", -1)),
                r("strong", null, y(F(bt.value?.empathy)), 1)
              ]),
              r("div", _a, [
                s[67] || (s[67] = r("span", null, "视角阶段", -1)),
                r("strong", null, y(bt.value?.perspective_name || "—"), 1)
              ]),
              r("div", pa, [
                s[68] || (s[68] = r("span", null, "注意状态", -1)),
                r("strong", null, y(Ze.value?.attention_state || "—"), 1)
              ]),
              r("div", ma, [
                s[69] || (s[69] = r("span", null, "耐心", -1)),
                r("strong", null, y(F(Ze.value?.patience)), 1)
              ])
            ])) : (T(), M("div", Ys, "尚无状态数据（刷新后显示）")),
            ht.value?.applied ? (T(), M("p", va, "人设特质已生效（" + y(ht.value.source === "llm" ? "LLM 精修" : "本地词典") + "）：" + y(S.value || "—") + "。改人设请到 设置 → 人设，下一条消息自动生效。", 1)) : et("", !0),
            ce.value ? (T(), M("div", ga, [
              (T(!0), M(Nt, null, ie(ce.value, (u, E) => (T(), M("div", {
                key: E,
                class: "som-chan"
              }, [
                r("span", ya, y(O(E)), 1),
                r("span", wa, [
                  r("i", {
                    style: Hi({ transform: "scaleX(" + _i(u) + ")" })
                  }, null, 4)
                ]),
                r("span", ba, y(F(u, 2)), 1)
              ]))), 128)),
              Number(N.value?.somatic_chronicity) > 0.1 ? (T(), M("p", xa, "慢性化程度 " + y(F(N.value?.somatic_chronicity)) + " — 反复报告的通道已开始敏化。", 1)) : et("", !0)
            ])) : et("", !0)
          ]),
          r("article", La, [
            s[75] || (s[75] = r("h3", null, "总开关与提示词调节", -1)),
            r("div", Pa, [
              r("label", Ta, [
                z(r("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": s[0] || (s[0] = (u) => p.value.cog_enabled = u)
                }, null, 512), [
                  [wt, p.value.cog_enabled]
                ]),
                s[70] || (s[70] = r("span", null, "启用认知内核", -1))
              ]),
              r("label", ka, [
                z(r("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": s[1] || (s[1] = (u) => p.value.cog_modulate_affect = u)
                }, null, 512), [
                  [wt, p.value.cog_modulate_affect]
                ]),
                s[71] || (s[71] = r("span", null, "情感影响提示词", -1))
              ]),
              r("label", Ca, [
                z(r("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": s[2] || (s[2] = (u) => p.value.cog_modulate_language = u)
                }, null, 512), [
                  [wt, p.value.cog_modulate_language]
                ]),
                s[72] || (s[72] = r("span", null, "语言影响提示词", -1))
              ]),
              r("label", Ma, [
                z(r("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": s[3] || (s[3] = (u) => p.value.cog_modulate_social = u)
                }, null, 512), [
                  [wt, p.value.cog_modulate_social]
                ]),
                s[73] || (s[73] = r("span", null, "社会认知影响提示词", -1))
              ]),
              r("label", Sa, [
                z(r("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": s[4] || (s[4] = (u) => p.value.cog_modulate_selfhood = u)
                }, null, 512), [
                  [wt, p.value.cog_modulate_selfhood]
                ]),
                s[74] || (s[74] = r("span", null, "自我与时间影响提示词", -1))
              ])
            ])
          ]),
          r("div", za, [
            r("article", Ea, [
              s[90] || (s[90] = r("h3", null, "决策仲裁（第一波）", -1)),
              r("div", Oa, [
                r("label", null, [
                  s[76] || (s[76] = r("span", null, "规划深度", -1)),
                  z(r("input", {
                    "onUpdate:modelValue": s[5] || (s[5] = (u) => p.value.cog_plan_depth = u),
                    type: "number",
                    min: "1",
                    max: "6",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      rt,
                      p.value.cog_plan_depth,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                r("label", null, [
                  s[77] || (s[77] = r("span", null, "工作记忆容量", -1)),
                  z(r("input", {
                    "onUpdate:modelValue": s[6] || (s[6] = (u) => p.value.cog_wm_capacity = u),
                    type: "number",
                    min: "1",
                    max: "12",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      rt,
                      p.value.cog_wm_capacity,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                r("label", null, [
                  s[78] || (s[78] = r("span", null, "策略温度 τ", -1)),
                  z(r("input", {
                    "onUpdate:modelValue": s[7] || (s[7] = (u) => p.value.cog_tau = u),
                    type: "number",
                    step: "0.05",
                    min: "0.05",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      rt,
                      p.value.cog_tau,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                r("label", null, [
                  s[79] || (s[79] = r("span", null, "折扣 γ", -1)),
                  z(r("input", {
                    "onUpdate:modelValue": s[8] || (s[8] = (u) => p.value.cog_gamma = u),
                    type: "number",
                    step: "0.01",
                    min: "0",
                    max: "0.999",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      rt,
                      p.value.cog_gamma,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                r("label", null, [
                  s[80] || (s[80] = r("span", null, "习惯学习率", -1)),
                  z(r("input", {
                    "onUpdate:modelValue": s[9] || (s[9] = (u) => p.value.cog_alpha_habit = u),
                    type: "number",
                    step: "0.01",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      rt,
                      p.value.cog_alpha_habit,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                r("label", null, [
                  s[81] || (s[81] = r("span", null, "无模型学习率", -1)),
                  z(r("input", {
                    "onUpdate:modelValue": s[10] || (s[10] = (u) => p.value.cog_alpha_mf = u),
                    type: "number",
                    step: "0.01",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      rt,
                      p.value.cog_alpha_mf,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                r("label", null, [
                  s[82] || (s[82] = r("span", null, "惊讶阈值 θ_pe", -1)),
                  z(r("input", {
                    "onUpdate:modelValue": s[11] || (s[11] = (u) => p.value.cog_theta_pe = u),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      rt,
                      p.value.cog_theta_pe,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                r("label", null, [
                  s[83] || (s[83] = r("span", null, "新颖阈值 θ_n", -1)),
                  z(r("input", {
                    "onUpdate:modelValue": s[12] || (s[12] = (u) => p.value.cog_theta_n = u),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      rt,
                      p.value.cog_theta_n,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                r("label", null, [
                  s[84] || (s[84] = r("span", null, "前瞻视野", -1)),
                  z(r("input", {
                    "onUpdate:modelValue": s[13] || (s[13] = (u) => p.value.cog_prospection_horizon = u),
                    type: "number",
                    min: "1",
                    max: "8",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      rt,
                      p.value.cog_prospection_horizon,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ])
              ]),
              r("div", Za, [
                r("label", Ia, [
                  z(r("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": s[14] || (s[14] = (u) => p.value.cog_use_thalamic_gate = u)
                  }, null, 512), [
                    [wt, p.value.cog_use_thalamic_gate]
                  ]),
                  s[85] || (s[85] = r("span", null, "丘脑门控", -1))
                ]),
                r("label", Aa, [
                  z(r("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": s[15] || (s[15] = (u) => p.value.cog_use_cerebellum = u)
                  }, null, 512), [
                    [wt, p.value.cog_use_cerebellum]
                  ]),
                  s[86] || (s[86] = r("span", null, "小脑预测误差", -1))
                ]),
                r("label", Ba, [
                  z(r("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": s[16] || (s[16] = (u) => p.value.cog_use_ofc_map = u)
                  }, null, 512), [
                    [wt, p.value.cog_use_ofc_map]
                  ]),
                  s[87] || (s[87] = r("span", null, "OFC 认知地图", -1))
                ]),
                r("label", Na, [
                  z(r("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": s[17] || (s[17] = (u) => p.value.cog_use_prospection = u)
                  }, null, 512), [
                    [wt, p.value.cog_use_prospection]
                  ]),
                  s[88] || (s[88] = r("span", null, "未来奖赏前瞻", -1))
                ]),
                r("label", Ra, [
                  z(r("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": s[18] || (s[18] = (u) => p.value.cog_use_limbic_bias = u)
                  }, null, 512), [
                    [wt, p.value.cog_use_limbic_bias]
                  ]),
                  s[89] || (s[89] = r("span", null, "边缘系统偏向", -1))
                ])
              ])
            ]),
            r("article", Da, [
              s[98] || (s[98] = r("h3", null, "情感与生理（第二波）", -1)),
              r("div", Va, [
                r("label", null, [
                  s[91] || (s[91] = r("span", null, "情绪调节画像", -1)),
                  ze(di, {
                    modelValue: p.value.cog_affect_profile,
                    "onUpdate:modelValue": s[19] || (s[19] = (u) => p.value.cog_affect_profile = u),
                    options: Yt,
                    "aria-label": "情绪调节画像"
                  }, null, 8, ["modelValue"])
                ]),
                r("label", null, [
                  s[92] || (s[92] = r("span", null, "迷走基线", -1)),
                  z(r("input", {
                    "onUpdate:modelValue": s[20] || (s[20] = (u) => p.value.cog_affect_vagal = u),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      rt,
                      p.value.cog_affect_vagal,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                r("label", null, [
                  s[93] || (s[93] = r("span", null, "威胁基线", -1)),
                  z(r("input", {
                    "onUpdate:modelValue": s[21] || (s[21] = (u) => p.value.cog_affect_threat = u),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      rt,
                      p.value.cog_affect_threat,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                r("label", null, [
                  s[94] || (s[94] = r("span", null, "奖赏基线", -1)),
                  z(r("input", {
                    "onUpdate:modelValue": s[22] || (s[22] = (u) => p.value.cog_affect_reward = u),
                    type: "number",
                    step: "0.1",
                    min: "0",
                    max: "2",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      rt,
                      p.value.cog_affect_reward,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ])
              ]),
              r("label", Fa, [
                z(r("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": s[23] || (s[23] = (u) => p.value.cog_affect_enabled = u)
                }, null, 512), [
                  [wt, p.value.cog_affect_enabled]
                ]),
                s[95] || (s[95] = r("span", null, "启用情感与生理回路", -1))
              ]),
              r("label", Ua, [
                z(r("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": s[24] || (s[24] = (u) => p.value.cog_affect_somatic = u)
                }, null, 512), [
                  [wt, p.value.cog_affect_somatic]
                ]),
                s[96] || (s[96] = r("span", null, "启用躯体化网关（人设含体弱、心慌等标记时自动开启）", -1))
              ]),
              r("label", Wa, [
                z(r("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": s[25] || (s[25] = (u) => p.value.cog_affect_persona_llm = u)
                }, null, 512), [
                  [wt, p.value.cog_affect_persona_llm]
                ]),
                s[97] || (s[97] = r("span", null, "人设特质由模型理解（改动人设后下一条消息精修一次，失败自动回退本地词典）", -1))
              ])
            ]),
            r("article", Ha, [
              s[102] || (s[102] = r("h3", null, "语言习得（第三波）", -1)),
              r("div", Ga, [
                r("label", null, [
                  s[99] || (s[99] = r("span", null, "语言-思维耦合", -1)),
                  ze(di, {
                    modelValue: p.value.cog_language_framing,
                    "onUpdate:modelValue": s[26] || (s[26] = (u) => p.value.cog_language_framing = u),
                    options: mt,
                    "aria-label": "语言-思维耦合"
                  }, null, 8, ["modelValue"])
                ]),
                r("label", null, [
                  s[100] || (s[100] = r("span", null, "分词边界阈值", -1)),
                  z(r("input", {
                    "onUpdate:modelValue": s[27] || (s[27] = (u) => p.value.cog_language_boundary = u),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      rt,
                      p.value.cog_language_boundary,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ])
              ]),
              r("label", ja, [
                z(r("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": s[28] || (s[28] = (u) => p.value.cog_language_enabled = u)
                }, null, 512), [
                  [wt, p.value.cog_language_enabled]
                ]),
                s[101] || (s[101] = r("span", null, "启用语言习得回路", -1))
              ])
            ]),
            r("article", qa, [
              s[106] || (s[106] = r("h3", null, "社会学习（第四波）", -1)),
              r("div", $a, [
                r("label", null, [
                  s[103] || (s[103] = r("span", null, "共情权重", -1)),
                  z(r("input", {
                    "onUpdate:modelValue": s[29] || (s[29] = (u) => p.value.cog_social_empathy = u),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      rt,
                      p.value.cog_social_empathy,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                r("label", null, [
                  s[104] || (s[104] = r("span", null, "观点采择阶段", -1)),
                  ze(di, {
                    modelValue: Gt.value,
                    "onUpdate:modelValue": s[30] || (s[30] = (u) => Gt.value = u),
                    options: ne,
                    "aria-label": "观点采择阶段"
                  }, null, 8, ["modelValue"])
                ])
              ]),
              r("label", Ka, [
                z(r("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": s[31] || (s[31] = (u) => p.value.cog_social_enabled = u)
                }, null, 512), [
                  [wt, p.value.cog_social_enabled]
                ]),
                s[105] || (s[105] = r("span", null, "启用社会学习回路", -1))
              ])
            ]),
            r("article", Ja, [
              s[110] || (s[110] = r("h3", null, "自我与时间（第四波）", -1)),
              r("div", Ya, [
                r("label", null, [
                  s[107] || (s[107] = r("span", null, "时间折扣 k", -1)),
                  z(r("input", {
                    "onUpdate:modelValue": s[32] || (s[32] = (u) => p.value.cog_selfhood_discount = u),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      rt,
                      p.value.cog_selfhood_discount,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                r("label", null, [
                  s[108] || (s[108] = r("span", null, "人设细节尺度", -1)),
                  z(r("input", {
                    "onUpdate:modelValue": s[33] || (s[33] = (u) => p.value.cog_selfhood_detail = u),
                    type: "number",
                    step: "1",
                    min: "1",
                    max: "50",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      rt,
                      p.value.cog_selfhood_detail,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ])
              ]),
              r("label", Xa, [
                z(r("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": s[34] || (s[34] = (u) => p.value.cog_selfhood_enabled = u)
                }, null, 512), [
                  [wt, p.value.cog_selfhood_enabled]
                ]),
                s[109] || (s[109] = r("span", null, "启用自我与时间回路", -1))
              ])
            ]),
            r("article", Qa, [
              s[115] || (s[115] = r("h3", null, "记忆与巩固（默认开启）", -1)),
              s[116] || (s[116] = r("p", { class: "hint" }, "这四项决定「经历会不会留下痕迹」：写入情景记忆、睡眠期回放、日终再巩固、交错学习（CLS）。默认开启——关掉时人格被固定在人设上，经历不留痕，行为与无认知内核时完全一致（可逐个消融）。", -1)),
              r("div", tr, [
                r("label", er, [
                  z(r("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": s[35] || (s[35] = (u) => p.value.cog_memory_encode = u)
                  }, null, 512), [
                    [wt, p.value.cog_memory_encode]
                  ]),
                  s[111] || (s[111] = r("span", null, "选择性情景编码", -1))
                ]),
                r("label", ir, [
                  z(r("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": s[36] || (s[36] = (u) => p.value.cog_sleep_replay = u)
                  }, null, 512), [
                    [wt, p.value.cog_sleep_replay]
                  ]),
                  s[112] || (s[112] = r("span", null, "睡眠期回放巩固", -1))
                ]),
                r("label", nr, [
                  z(r("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": s[37] || (s[37] = (u) => p.value.cog_memory_reconsolidate = u)
                  }, null, 512), [
                    [wt, p.value.cog_memory_reconsolidate]
                  ]),
                  s[113] || (s[113] = r("span", null, "日终痕迹再巩固", -1))
                ]),
                r("label", or, [
                  z(r("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": s[38] || (s[38] = (u) => p.value.cog_cls_interleave = u)
                  }, null, 512), [
                    [wt, p.value.cog_cls_interleave]
                  ]),
                  s[114] || (s[114] = r("span", null, "交错学习 + 一致性门控（CLS）", -1))
                ])
              ])
            ])
          ])
        ], 512), [
          [Ln, W.value === "cognition"]
        ]),
        z(r("section", sr, [
          r("div", { class: "section-head" }, [
            s[117] || (s[117] = r("div", null, [
              r("h2", null, "世界"),
              r("p", { class: "desc" }, "本地小模型驱动的虚构生活世界：事件、演员表与账本。默认关闭。")
            ], -1)),
            r("div", { class: "head-actions" }, [
              r("button", {
                class: "btn filled sm",
                onClick: Qe
              }, "保存设置")
            ])
          ]),
          r("article", ar, [
            s[119] || (s[119] = r("h3", null, "虚构浓度", -1)),
            r("div", rr, [
              r("label", null, [
                s[118] || (s[118] = r("span", null, "world_density", -1)),
                ze(di, {
                  modelValue: At.value,
                  "onUpdate:modelValue": s[39] || (s[39] = (u) => At.value = u),
                  options: pi,
                  "aria-label": "虚构浓度"
                }, null, 8, ["modelValue"])
              ])
            ]),
            s[120] || (s[120] = r("p", { class: "hint" }, "off 完全不影响现有行为；texture 只把事件写进时间线与记忆；full 允许作为主动话题提及（上线需你明确确认）。", -1))
          ]),
          r("article", lr, [
            s[122] || (s[122] = r("h3", null, "人设 → 特质数据", -1)),
            s[123] || (s[123] = r("p", { class: "hint" }, "把角色人设写在这里（性格、体质、作息、情绪风格）。保存后解析为认知内核的特质参数（威胁、奖赏基线、情绪调节画像、躯体化增益、作息等）：默认先由本地词典即时生效，并由模型对改动人设做一次精修（失败自动回退词典）。写明「体弱多病 / 心慌失眠」等会自动开启躯体化网关。", -1)),
            r("label", ur, [
              s[121] || (s[121] = r("span", { class: "world-label" }, "人设文本", -1)),
              z(r("textarea", {
                "onUpdate:modelValue": s[40] || (s[40] = (u) => xe.value = u),
                class: "world-text",
                rows: "4",
                placeholder: "例：她性格开朗但容易焦虑，体质偏弱，经常心慌失眠，遇到事爱钻牛角尖。"
              }, null, 512), [
                [rt, xe.value]
              ])
            ])
          ]),
          r("article", hr, [
            s[132] || (s[132] = r("h3", null, "世界观 · 定位", -1)),
            s[133] || (s[133] = r("p", { class: "hint" }, "说清这是哪里：国家 / 城市 / 小区（可真实可虚构）。填不全也没关系——点「AI 完善」会补全设定并生成一份带坐标的地图。改了演员或地点后，之前生成的事件会作废、重新开始。", -1)),
            r("div", cr, [
              r("label", null, [
                s[124] || (s[124] = r("span", null, "世界类型", -1)),
                ze(di, {
                  modelValue: de.value,
                  "onUpdate:modelValue": s[41] || (s[41] = (u) => de.value = u),
                  options: mi,
                  "aria-label": "世界类型"
                }, null, 8, ["modelValue"])
              ]),
              r("label", null, [
                s[125] || (s[125] = r("span", null, "国家", -1)),
                z(r("input", {
                  "onUpdate:modelValue": s[42] || (s[42] = (u) => fe.value = u),
                  class: "field",
                  placeholder: "中国 / 架空：曦京"
                }, null, 512), [
                  [rt, fe.value]
                ])
              ]),
              r("label", null, [
                s[126] || (s[126] = r("span", null, "城市", -1)),
                z(r("input", {
                  "onUpdate:modelValue": s[43] || (s[43] = (u) => Xt.value = u),
                  class: "field",
                  placeholder: "杭州 / 临海市"
                }, null, 512), [
                  [rt, Xt.value]
                ])
              ]),
              r("label", null, [
                s[127] || (s[127] = r("span", null, "城区 · 小区", -1)),
                z(r("input", {
                  "onUpdate:modelValue": s[44] || (s[44] = (u) => _e.value = u),
                  class: "field",
                  placeholder: "西湖区 · 文一西路"
                }, null, 512), [
                  [rt, _e.value]
                ])
              ])
            ]),
            r("label", dr, [
              s[128] || (s[128] = r("span", { class: "world-label" }, "世界设定 / 前言", -1)),
              z(r("textarea", {
                "onUpdate:modelValue": s[45] || (s[45] = (u) => Ie.value = u),
                class: "world-text",
                rows: "3",
                placeholder: "例：她住在一座临海小城，开着一家旧书店，养了一只叫煤球的猫。"
              }, null, 512), [
                [rt, Ie.value]
              ])
            ]),
            r("label", fr, [
              s[129] || (s[129] = r("span", { class: "world-label" }, "演员表（每行一个：名字 — 名字|关系；关系可为 朋友/同事/家人）", -1)),
              z(r("textarea", {
                "onUpdate:modelValue": s[46] || (s[46] = (u) => Le.value = u),
                class: "world-text",
                rows: "4",
                placeholder: `林小满|朋友
阿哲|同事
妈妈|家人`
              }, null, 512), [
                [rt, Le.value]
              ])
            ]),
            r("label", _r, [
              s[130] || (s[130] = r("span", { class: "world-label" }, "地点（逗号或换行分隔）", -1)),
              z(r("textarea", {
                "onUpdate:modelValue": s[47] || (s[47] = (u) => pe.value = u),
                class: "world-text",
                rows: "2",
                placeholder: "楼下便利店, 常去的咖啡馆, 城西书店"
              }, null, 512), [
                [rt, pe.value]
              ])
            ]),
            r("div", pr, [
              r("button", {
                class: "btn filled sm",
                type: "button",
                disabled: zt.value,
                onClick: Ft
              }, y(zt.value ? "生成中…" : "✦ 只生成地图（保留设定）"), 9, mr),
              r("button", {
                class: "btn tonic sm",
                type: "button",
                disabled: zt.value,
                onClick: Ji
              }, y(zt.value ? "生成中…" : "AI 完善设定 + 生成地图"), 9, vr),
              s[131] || (s[131] = r("span", { class: "hint" }, "「只生成地图」不会动上面的设定文本；「完善设定」会用它重写设定。", -1))
            ])
          ]),
          r("article", gr, [
            r("div", yr, [
              r("h3", null, [
                s[134] || (s[134] = le("世界地图 ", -1)),
                r("span", wr, y(D.value.locations.length), 1)
              ]),
              Bt.value ? (T(), M("span", br, y(Bt.value.fictional ? "虚构" : "真实") + " · " + y([Bt.value.country, Bt.value.city, Bt.value.district].filter(Boolean).join(" / ") || "未命名"), 1)) : et("", !0)
            ]),
            Bt.value?.premise ? (T(), M("p", xr, y(Bt.value.premise), 1)) : et("", !0),
            r("div", Lr, [
              r("div", {
                ref_key: "mapEl",
                ref: Ne,
                class: we(["world-map-leaflet", { "is-empty": !D.value.locations.length }])
              }, null, 2),
              me.value ? (T(), M("div", Pr, "底图加载失败（可能离线），仍可查看城市标记")) : et("", !0),
              D.value.locations.length ? (T(), M(Nt, { key: 1 }, [
                D.value.kind !== "real" && D.value.nation ? (T(), M("button", {
                  key: 0,
                  type: "button",
                  class: "wm-scope",
                  onClick: wi
                }, y(Dt.value === "city" ? "全国视图" : "城市视图"), 1)) : et("", !0),
                r("button", {
                  type: "button",
                  class: "wm-reset",
                  onClick: yi
                }, "⟲ 复位视角"),
                D.value.kind !== "real" && Dt.value === "city" ? (T(), M("div", Tr, [...s[135] || (s[135] = [
                  r("i", null, "N", -1)
                ])])) : et("", !0)
              ], 64)) : et("", !0)
            ]),
            D.value.locations.length ? et("", !0) : (T(), M("p", kr, "还没有地图。点上面的「AI 完善并生成地图」。")),
            D.value.locations.length ? (T(), M("div", Cr, [
              (T(!0), M(Nt, null, ie(gi.value, (u) => (T(), M("span", { key: u }, [
                r("i", {
                  class: we("k-" + u)
                }, null, 2),
                le(y(ji[u]), 1)
              ]))), 128)),
              r("span", null, [
                s[136] || (s[136] = r("i", { class: "k-actor" }, null, -1)),
                le("角色（" + y(D.value.actors.length) + "）", 1)
              ]),
              D.value.kind !== "real" ? (T(), M(Nt, { key: 0 }, [
                s[137] || (s[137] = bs('<span data-v-facba01d><i class="k-hw" data-v-facba01d></i>高速/环线</span><span data-v-facba01d><i class="k-arterial" data-v-facba01d></i>主干道</span><span data-v-facba01d><i class="k-street" data-v-facba01d></i>街道</span><span data-v-facba01d><i class="k-metro" data-v-facba01d></i>地铁</span><span data-v-facba01d><i class="k-bus" data-v-facba01d></i>公交</span><span data-v-facba01d><i class="k-park2" data-v-facba01d></i>公园</span><span data-v-facba01d><i class="k-water" data-v-facba01d></i>水域</span>', 7))
              ], 64)) : et("", !0)
            ])) : et("", !0),
            D.value.locations.length && D.value.kind !== "real" && Dt.value === "city" ? (T(), M("div", Mr, [
              (D.value.metro || []).length ? (T(), M("div", Sr, [
                s[138] || (s[138] = r("h4", null, "地铁线路表", -1)),
                r("ul", null, [
                  (T(!0), M(Nt, null, ie(D.value.metro, (u, E) => (T(), M("li", {
                    key: "m" + E
                  }, [
                    r("b", {
                      style: Hi({ color: u.color })
                    }, y(u.name), 5),
                    r("span", null, y((u.stations || []).map((b) => b.name).filter(Boolean).join(" · ")), 1)
                  ]))), 128))
                ])
              ])) : et("", !0),
              (D.value.bus || []).length ? (T(), M("div", zr, [
                s[139] || (s[139] = r("h4", null, "公交线路表", -1)),
                r("ul", null, [
                  (T(!0), M(Nt, null, ie(D.value.bus, (u, E) => (T(), M("li", {
                    key: "b" + E
                  }, [
                    r("b", {
                      style: Hi({ color: u.color })
                    }, y(u.name), 5),
                    r("span", null, y((u.stops || []).map((b) => b.name).filter(Boolean).join(" · ")), 1)
                  ]))), 128))
                ])
              ])) : et("", !0)
            ])) : et("", !0)
          ]),
          r("article", Er, [
            r("div", Or, [
              r("h3", null, [
                s[140] || (s[140] = le("最近世界事件 ", -1)),
                r("span", Zr, y(xt.value.length), 1)
              ]),
              xt.value.length ? (T(), M("button", {
                key: 0,
                type: "button",
                class: "btn tonic sm",
                onClick: w
              }, "清除世界事件")) : et("", !0)
            ]),
            r("ol", Ir, [
              (T(!0), M(Nt, null, ie(xt.value, (u) => (T(), M("li", {
                key: u.id
              }, [
                r("span", Ar, y(u.created_at), 1),
                r("strong", null, y(u.summary), 1)
              ]))), 128)),
              xt.value.length ? et("", !0) : (T(), M("li", Br, "还没有世界事件（开启后由本地模型生成）。"))
            ])
          ])
        ], 512), [
          [Ln, W.value === "world"]
        ]),
        z(r("section", Nr, [
          s[144] || (s[144] = r("div", { class: "section-head" }, [
            r("div", null, [
              r("h2", null, "状态"),
              r("p", { class: "desc" }, "承诺账本、结构化用户模型与价值取向。")
            ])
          ], -1)),
          r("article", Rr, [
            r("h3", null, [
              s[141] || (s[141] = le("承诺账本 ", -1)),
              r("span", Dr, y(Lt.value.length), 1)
            ]),
            r("ol", Vr, [
              (T(!0), M(Nt, null, ie(Lt.value, (u) => (T(), M("li", {
                key: u.id
              }, [
                r("strong", null, y(u.text), 1),
                r("span", Fr, y(u.user_id), 1)
              ]))), 128)),
              Lt.value.length ? et("", !0) : (T(), M("li", Ur, "没有未了结的承诺。"))
            ])
          ]),
          r("div", Wr, [
            r("article", Hr, [
              s[142] || (s[142] = r("h3", null, "用户模型", -1)),
              r("ol", Gr, [
                (T(!0), M(Nt, null, ie(st.value, (u) => (T(), M("li", {
                  key: u.user_id
                }, [
                  r("strong", null, y(u.user_id), 1),
                  r("span", jr, "喜欢：" + y(R(u.preferences).join("、") || "—"), 1),
                  r("span", qr, "雷区：" + y(R(u.taboos).join("、") || "—"), 1),
                  r("span", $r, "关心：" + y(R(u.concerns).join("、") || "—"), 1)
                ]))), 128)),
                st.value.length ? et("", !0) : (T(), M("li", Kr, "还没有结构化画像。"))
              ])
            ]),
            r("article", Jr, [
              s[143] || (s[143] = r("h3", null, "价值取向", -1)),
              r("ol", Yr, [
                (T(!0), M(Nt, null, ie(q.value, (u) => (T(), M("li", {
                  key: u.k
                }, [
                  r("strong", null, y(u.k), 1),
                  r("span", Xr, y(Number(u.v).toFixed(2)), 1)
                ]))), 128)),
                q.value.length ? et("", !0) : (T(), M("li", Qr, "还没有形成稳定价值取向。"))
              ])
            ])
          ])
        ], 512), [
          [Ln, W.value === "state"]
        ]),
        r("section", tl, [
          s[148] || (s[148] = r("div", { class: "section-head" }, [
            r("div", null, [
              r("h2", null, "危险操作"),
              r("p", { class: "desc" }, "日常操作不可撤销：撤回一句话、删除一条记忆都是永久的。这里保留唯一一次「重来」的机会。")
            ])
          ], -1)),
          r("div", el, [
            r("article", il, [
              s[145] || (s[145] = r("h3", null, "重置整个人", -1)),
              s[146] || (s[146] = r("p", { class: "hint" }, "清空记忆与备份、关系、承诺、目标、日记与梦境、价值取向、人设演化与认知内核，回到出厂状态。你自己的设置会保留。", -1)),
              s[147] || (s[147] = r("p", {
                class: "hint",
                style: { "margin-top": "10px" }
              }, [
                r("strong", null, "需要二次确认。")
              ], -1)),
              r("div", nl, [
                r("button", {
                  class: "btn danger",
                  disabled: Ae.value,
                  onClick: xi
                }, y(Ae.value ? "重置中…" : "重置整个人"), 9, ol)
              ])
            ])
          ])
        ])
      ], 512),
      ze(xs)
    ], 64));
  }
}), ul = /* @__PURE__ */ Ps(al, [["__scopeId", "data-v-facba01d"]]);
export {
  ul as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('life-plugin-style')){const s=document.createElement('style');s.id='life-plugin-style';s.textContent=".confirm-scrim{position:fixed;inset:0;z-index:var(--z-modal);background:#21173566;backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.confirm-dialog{width:min(440px,100%);background:var(--md-surface-container-high, var(--md-surface, #fff));color:var(--md-on-surface);border:1px solid var(--md-outline-variant, transparent);border-radius:28px;padding:28px;box-shadow:0 24px 70px #18132d33;outline:none}.confirm-dialog h2{margin:0 0 10px;font-size:22px;font-weight:650}.confirm-dialog p{margin:0;font-size:14px;line-height:1.65;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.confirm-dialog footer{display:flex;justify-content:flex-end;gap:12px;margin-top:24px}.confirm-dialog footer button{border:0;border-radius:999px;padding:12px 22px;font:inherit;font-weight:600;cursor:pointer;background:var(--md-secondary-container, #e7e0ec);color:var(--md-on-secondary-container, #1d1b20)}.confirm-dialog footer .confirm-primary{background:var(--md-primary, #6750a4);color:var(--md-on-primary, #fff)}.confirm-dialog footer .confirm-primary.danger{background:var(--md-error, #b3261e);color:var(--md-on-error, #fff)}.confirm-dialog footer button:focus-visible{outline:3px solid var(--md-primary);outline-offset:3px}.confirm-dialog:focus-visible{outline:3px solid var(--md-primary);outline-offset:2px}@media (prefers-reduced-motion: reduce){.confirm-dialog{animation:none;transition:none}}.leaflet-pane,.leaflet-tile,.leaflet-marker-icon,.leaflet-marker-shadow,.leaflet-tile-container,.leaflet-pane>svg,.leaflet-pane>canvas,.leaflet-zoom-box,.leaflet-image-layer,.leaflet-layer{position:absolute;left:0;top:0}.leaflet-container{overflow:hidden}.leaflet-tile,.leaflet-marker-icon,.leaflet-marker-shadow{-webkit-user-select:none;-moz-user-select:none;user-select:none;-webkit-user-drag:none}.leaflet-tile::selection{background:transparent}.leaflet-safari .leaflet-tile{image-rendering:-webkit-optimize-contrast}.leaflet-safari .leaflet-tile-container{width:1600px;height:1600px;-webkit-transform-origin:0 0}.leaflet-marker-icon,.leaflet-marker-shadow{display:block}.leaflet-container .leaflet-overlay-pane svg{max-width:none!important;max-height:none!important}.leaflet-container .leaflet-marker-pane img,.leaflet-container .leaflet-shadow-pane img,.leaflet-container .leaflet-tile-pane img,.leaflet-container img.leaflet-image-layer,.leaflet-container .leaflet-tile{max-width:none!important;max-height:none!important;width:auto;padding:0}.leaflet-container img.leaflet-tile{mix-blend-mode:plus-lighter}.leaflet-container.leaflet-touch-zoom{-ms-touch-action:pan-x pan-y;touch-action:pan-x pan-y}.leaflet-container.leaflet-touch-drag{-ms-touch-action:pinch-zoom;touch-action:none;touch-action:pinch-zoom}.leaflet-container.leaflet-touch-drag.leaflet-touch-zoom{-ms-touch-action:none;touch-action:none}.leaflet-container{-webkit-tap-highlight-color:transparent}.leaflet-container a{-webkit-tap-highlight-color:rgba(51,181,229,.4)}.leaflet-tile{filter:inherit;visibility:hidden}.leaflet-tile-loaded{visibility:inherit}.leaflet-zoom-box{width:0;height:0;-moz-box-sizing:border-box;box-sizing:border-box;z-index:800}.leaflet-overlay-pane svg{-moz-user-select:none}.leaflet-pane{z-index:400}.leaflet-tile-pane{z-index:200}.leaflet-overlay-pane{z-index:400}.leaflet-shadow-pane{z-index:500}.leaflet-marker-pane{z-index:600}.leaflet-tooltip-pane{z-index:650}.leaflet-popup-pane{z-index:700}.leaflet-map-pane canvas{z-index:100}.leaflet-map-pane svg{z-index:200}.leaflet-vml-shape{width:1px;height:1px}.lvml{behavior:url(#default#VML);display:inline-block;position:absolute}.leaflet-control{position:relative;z-index:800;pointer-events:visiblePainted;pointer-events:auto}.leaflet-top,.leaflet-bottom{position:absolute;z-index:1000;pointer-events:none}.leaflet-top{top:0}.leaflet-right{right:0}.leaflet-bottom{bottom:0}.leaflet-left{left:0}.leaflet-control{float:left;clear:both}.leaflet-right .leaflet-control{float:right}.leaflet-top .leaflet-control{margin-top:10px}.leaflet-bottom .leaflet-control{margin-bottom:10px}.leaflet-left .leaflet-control{margin-left:10px}.leaflet-right .leaflet-control{margin-right:10px}.leaflet-fade-anim .leaflet-popup{opacity:0;-webkit-transition:opacity .2s linear;-moz-transition:opacity .2s linear;transition:opacity .2s linear}.leaflet-fade-anim .leaflet-map-pane .leaflet-popup{opacity:1}.leaflet-zoom-animated{-webkit-transform-origin:0 0;-ms-transform-origin:0 0;transform-origin:0 0}svg.leaflet-zoom-animated{will-change:transform}.leaflet-zoom-anim .leaflet-zoom-animated{-webkit-transition:-webkit-transform .25s cubic-bezier(0,0,.25,1);-moz-transition:-moz-transform .25s cubic-bezier(0,0,.25,1);transition:transform .25s cubic-bezier(0,0,.25,1)}.leaflet-zoom-anim .leaflet-tile,.leaflet-pan-anim .leaflet-tile{-webkit-transition:none;-moz-transition:none;transition:none}.leaflet-zoom-anim .leaflet-zoom-hide{visibility:hidden}.leaflet-interactive{cursor:pointer}.leaflet-grab{cursor:-webkit-grab;cursor:-moz-grab;cursor:grab}.leaflet-crosshair,.leaflet-crosshair .leaflet-interactive{cursor:crosshair}.leaflet-popup-pane,.leaflet-control{cursor:auto}.leaflet-dragging .leaflet-grab,.leaflet-dragging .leaflet-grab .leaflet-interactive,.leaflet-dragging .leaflet-marker-draggable{cursor:move;cursor:-webkit-grabbing;cursor:-moz-grabbing;cursor:grabbing}.leaflet-marker-icon,.leaflet-marker-shadow,.leaflet-image-layer,.leaflet-pane>svg path,.leaflet-tile-container{pointer-events:none}.leaflet-marker-icon.leaflet-interactive,.leaflet-image-layer.leaflet-interactive,.leaflet-pane>svg path.leaflet-interactive,svg.leaflet-image-layer.leaflet-interactive path{pointer-events:visiblePainted;pointer-events:auto}.leaflet-container{background:#ddd;outline-offset:1px}.leaflet-container a{color:#0078a8}.leaflet-zoom-box{border:2px dotted #38f;background:#ffffff80}.leaflet-container{font-family:Helvetica Neue,Arial,Helvetica,sans-serif;font-size:12px;font-size:.75rem;line-height:1.5}.leaflet-bar{box-shadow:0 1px 5px #000000a6;border-radius:4px}.leaflet-bar a{background-color:#fff;border-bottom:1px solid #ccc;width:26px;height:26px;line-height:26px;display:block;text-align:center;text-decoration:none;color:#000}.leaflet-bar a,.leaflet-control-layers-toggle{background-position:50% 50%;background-repeat:no-repeat;display:block}.leaflet-bar a:hover,.leaflet-bar a:focus{background-color:#f4f4f4}.leaflet-bar a:first-child{border-top-left-radius:4px;border-top-right-radius:4px}.leaflet-bar a:last-child{border-bottom-left-radius:4px;border-bottom-right-radius:4px;border-bottom:none}.leaflet-bar a.leaflet-disabled{cursor:default;background-color:#f4f4f4;color:#bbb}.leaflet-touch .leaflet-bar a{width:30px;height:30px;line-height:30px}.leaflet-touch .leaflet-bar a:first-child{border-top-left-radius:2px;border-top-right-radius:2px}.leaflet-touch .leaflet-bar a:last-child{border-bottom-left-radius:2px;border-bottom-right-radius:2px}.leaflet-control-zoom-in,.leaflet-control-zoom-out{font:700 18px Lucida Console,Monaco,monospace;text-indent:1px}.leaflet-touch .leaflet-control-zoom-in,.leaflet-touch .leaflet-control-zoom-out{font-size:22px}.leaflet-control-layers{box-shadow:0 1px 5px #0006;background:#fff;border-radius:5px}.leaflet-control-layers-toggle{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAQAAAADQ4RFAAACf0lEQVR4AY1UM3gkARTePdvdoTxXKc+qTl3aU5U6b2Kbkz3Gtq3Zw6ziLGNPzrYx7946Tr6/ee/XeCQ4D3ykPtL5tHno4n0d/h3+xfuWHGLX81cn7r0iTNzjr7LrlxCqPtkbTQEHeqOrTy4Yyt3VCi/IOB0v7rVC7q45Q3Gr5K6jt+3Gl5nCoDD4MtO+j96Wu8atmhGqcNGHObuf8OM/x3AMx38+4Z2sPqzCxRFK2aF2e5Jol56XTLyggAMTL56XOMoS1W4pOyjUcGGQdZxU6qRh7B9Zp+PfpOFlqt0zyDZckPi1ttmIp03jX8gyJ8a/PG2yutpS/Vol7peZIbZcKBAEEheEIAgFbDkz5H6Zrkm2hVWGiXKiF4Ycw0RWKdtC16Q7qe3X4iOMxruonzegJzWaXFrU9utOSsLUmrc0YjeWYjCW4PDMADElpJSSQ0vQvA1Tm6/JlKnqFs1EGyZiFCqnRZTEJJJiKRYzVYzJck2Rm6P4iH+cmSY0YzimYa8l0EtTODFWhcMIMVqdsI2uiTvKmTisIDHJ3od5GILVhBCarCfVRmo4uTjkhrhzkiBV7SsaqS+TzrzM1qpGGUFt28pIySQHR6h7F6KSwGWm97ay+Z+ZqMcEjEWebE7wxCSQwpkhJqoZA5ivCdZDjJepuJ9IQjGGUmuXJdBFUygxVqVsxFsLMbDe8ZbDYVCGKxs+W080max1hFCarCfV+C1KATwcnvE9gRRuMP2prdbWGowm1KB1y+zwMMENkM755cJ2yPDtqhTI6ED1M/82yIDtC/4j4BijjeObflpO9I9MwXTCsSX8jWAFeHr05WoLTJ5G8IQVS/7vwR6ohirYM7f6HzYpogfS3R2OAAAAAElFTkSuQmCC);width:36px;height:36px}.leaflet-retina .leaflet-control-layers-toggle{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAQAAABvcdNgAAAEsklEQVR4AWL4TydIhpZK1kpWOlg0w3ZXP6D2soBtG42jeI6ZmQTHzAxiTbSJsYLjO9HhP+WOmcuhciVnmHVQcJnp7DFvScowZorad/+V/fVzMdMT2g9Cv9guXGv/7pYOrXh2U+RRR3dSd9JRx6bIFc/ekqHI29JC6pJ5ZEh1yWkhkbcFeSjxgx3L2m1cb1C7bceyxA+CNjT/Ifff+/kDk2u/w/33/IeCMOSaWZ4glosqT3DNnNZQ7Cs58/3Ce5HL78iZH/vKVIaYlqzfdLu8Vi7dnvUbEza5Idt36tquZFldl6N5Z/POLof0XLK61mZCmJSWjVF9tEjUluu74IUXvgttuVIHE7YxSkaYhJZam7yiM9Pv82JYfl9nptxZaxMJE4YSPty+vF0+Y2up9d3wwijfjZbabqm/3bZ9ecKHsiGmRflnn1MW4pjHf9oLufyn2z3y1D6n8g8TZhxyzipLNPnAUpsOiuWimg52psrTZYnOWYNDTMuWBWa0tJb4rgq1UvmutpaYEbZlwU3CLJm/ayYjHW5/h7xWLn9Hh1vepDkyf7dE7MtT5LR4e7yYpHrkhOUpEfssBLq2pPhAqoSWKUkk7EDqkmK6RrCEzqDjhNDWNE+XSMvkJRDWlZTmCW0l0PHQGRZY5t1L83kT0Y3l2SItk5JAWHl2dCOBm+fPu3fo5/3v61RMCO9Jx2EEYYhb0rmNQMX/vm7gqOEJLcXTGw3CAuRNeyaPWwjR8PRqKQ1PDA/dpv+on9Shox52WFnx0KY8onHayrJzm87i5h9xGw/tfkev0jGsQizqezUKjk12hBMKJ4kbCqGPVNXudyyrShovGw5CgxsRICxF6aRmSjlBnHRzg7Gx8fKqEubI2rahQYdR1YgDIRQO7JvQyD52hoIQx0mxa0ODtW2Iozn1le2iIRdzwWewedyZzewidueOGqlsn1MvcnQpuVwLGG3/IR1hIKxCjelIDZ8ldqWz25jWAsnldEnK0Zxro19TGVb2ffIZEsIO89EIEDvKMPrzmBOQcKQ+rroye6NgRRxqR4U8EAkz0CL6uSGOm6KQCdWjvjRiSP1BPalCRS5iQYiEIvxuBMJEWgzSoHADcVMuN7IuqqTeyUPq22qFimFtxDyBBJEwNyt6TM88blFHao/6tWWhuuOM4SAK4EI4QmFHA+SEyWlp4EQoJ13cYGzMu7yszEIBOm2rVmHUNqwAIQabISNMRstmdhNWcFLsSm+0tjJH1MdRxO5Nx0WDMhCtgD6OKgZeljJqJKc9po8juskR9XN0Y1lZ3mWjLR9JCO1jRDMd0fpYC2VnvjBSEFg7wBENc0R9HFlb0xvF1+TBEpF68d+DHR6IOWVv2BECtxo46hOFUBd/APU57WIoEwJhIi2CdpyZX0m93BZicktMj1AS9dClteUFAUNUIEygRZCtik5zSxI9MubTBH1GOiHsiLJ3OCoSZkILa9PxiN0EbvhsAo8tdAf9Seepd36lGWHmtNANTv5Jd0z4QYyeo/UEJqxKRpg5LZx6btLPsOaEmdMyxYdlc8LMaJnikDlhclqmPiQnTEpLUIZEwkRagjYkEibQErwhkTAKCLQEbUgkzJQWc/0PstHHcfEdQ+UAAAAASUVORK5CYII=);background-size:26px 26px}.leaflet-touch .leaflet-control-layers-toggle{width:44px;height:44px}.leaflet-control-layers .leaflet-control-layers-list,.leaflet-control-layers-expanded .leaflet-control-layers-toggle{display:none}.leaflet-control-layers-expanded .leaflet-control-layers-list{display:block;position:relative}.leaflet-control-layers-expanded{padding:6px 10px 6px 6px;color:#333;background:#fff}.leaflet-control-layers-scrollbar{overflow-y:scroll;overflow-x:hidden;padding-right:5px}.leaflet-control-layers-selector{margin-top:2px;position:relative;top:1px}.leaflet-control-layers label{display:block;font-size:13px;font-size:1.08333em}.leaflet-control-layers-separator{height:0;border-top:1px solid #ddd;margin:5px -10px 5px -6px}.leaflet-default-icon-path{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII=)}.leaflet-container .leaflet-control-attribution{background:#fff;background:#fffc;margin:0}.leaflet-control-attribution,.leaflet-control-scale-line{padding:0 5px;color:#333;line-height:1.4}.leaflet-control-attribution a{text-decoration:none}.leaflet-control-attribution a:hover,.leaflet-control-attribution a:focus{text-decoration:underline}.leaflet-attribution-flag{display:inline!important;vertical-align:baseline!important;width:1em;height:.6669em}.leaflet-left .leaflet-control-scale{margin-left:5px}.leaflet-bottom .leaflet-control-scale{margin-bottom:5px}.leaflet-control-scale-line{border:2px solid #777;border-top:none;line-height:1.1;padding:2px 5px 1px;white-space:nowrap;-moz-box-sizing:border-box;box-sizing:border-box;background:#fffc;text-shadow:1px 1px #fff}.leaflet-control-scale-line:not(:first-child){border-top:2px solid #777;border-bottom:none;margin-top:-2px}.leaflet-control-scale-line:not(:first-child):not(:last-child){border-bottom:2px solid #777}.leaflet-touch .leaflet-control-attribution,.leaflet-touch .leaflet-control-layers,.leaflet-touch .leaflet-bar{box-shadow:none}.leaflet-touch .leaflet-control-layers,.leaflet-touch .leaflet-bar{border:2px solid rgba(0,0,0,.2);background-clip:padding-box}.leaflet-popup{position:absolute;text-align:center;margin-bottom:20px}.leaflet-popup-content-wrapper{padding:1px;text-align:left;border-radius:12px}.leaflet-popup-content{margin:13px 24px 13px 20px;line-height:1.3;font-size:13px;font-size:1.08333em;min-height:1px}.leaflet-popup-content p{margin:1.3em 0}.leaflet-popup-tip-container{width:40px;height:20px;position:absolute;left:50%;margin-top:-1px;margin-left:-20px;overflow:hidden;pointer-events:none}.leaflet-popup-tip{width:17px;height:17px;padding:1px;margin:-10px auto 0;pointer-events:auto;-webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);-ms-transform:rotate(45deg);transform:rotate(45deg)}.leaflet-popup-content-wrapper,.leaflet-popup-tip{background:#fff;color:#333;box-shadow:0 3px 14px #0006}.leaflet-container a.leaflet-popup-close-button{position:absolute;top:0;right:0;border:none;text-align:center;width:24px;height:24px;font:16px/24px Tahoma,Verdana,sans-serif;color:#757575;text-decoration:none;background:transparent}.leaflet-container a.leaflet-popup-close-button:hover,.leaflet-container a.leaflet-popup-close-button:focus{color:#585858}.leaflet-popup-scrolled{overflow:auto}.leaflet-oldie .leaflet-popup-content-wrapper{-ms-zoom:1}.leaflet-oldie .leaflet-popup-tip{width:24px;margin:0 auto;-ms-filter:\"progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678)\";filter:progid:DXImageTransform.Microsoft.Matrix(M11=.70710678,M12=.70710678,M21=-.70710678,M22=.70710678)}.leaflet-oldie .leaflet-control-zoom,.leaflet-oldie .leaflet-control-layers,.leaflet-oldie .leaflet-popup-content-wrapper,.leaflet-oldie .leaflet-popup-tip{border:1px solid #999}.leaflet-div-icon{background:#fff;border:1px solid #666}.leaflet-tooltip{position:absolute;padding:6px;background-color:#fff;border:1px solid #fff;border-radius:3px;color:#222;white-space:nowrap;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none;box-shadow:0 1px 3px #0006}.leaflet-tooltip.leaflet-interactive{cursor:pointer;pointer-events:auto}.leaflet-tooltip-top:before,.leaflet-tooltip-bottom:before,.leaflet-tooltip-left:before,.leaflet-tooltip-right:before{position:absolute;pointer-events:none;border:6px solid transparent;background:transparent;content:\"\"}.leaflet-tooltip-bottom{margin-top:6px}.leaflet-tooltip-top{margin-top:-6px}.leaflet-tooltip-bottom:before,.leaflet-tooltip-top:before{left:50%;margin-left:-6px}.leaflet-tooltip-top:before{bottom:0;margin-bottom:-12px;border-top-color:#fff}.leaflet-tooltip-bottom:before{top:0;margin-top:-12px;margin-left:-6px;border-bottom-color:#fff}.leaflet-tooltip-left{margin-left:-6px}.leaflet-tooltip-right{margin-left:6px}.leaflet-tooltip-left:before,.leaflet-tooltip-right:before{top:50%;margin-top:-6px}.leaflet-tooltip-left:before{right:0;margin-right:-12px;border-left-color:#fff}.leaflet-tooltip-right:before{left:0;margin-left:-12px;border-right-color:#fff}@media print{.leaflet-control{-webkit-print-color-adjust:exact;print-color-adjust:exact}}#app .app-select{min-width:0;position:relative;font-size:inherit}#app .app-select.input{padding:0;border:0;min-height:0;background:transparent}#app .app-select-trigger{display:flex;align-items:center;justify-content:space-between;gap:10px;width:100%;min-height:52px;padding:0 14px 0 16px;border:1px solid transparent;border-radius:16px;background-color:var(--md-surface-container-high);color:var(--md-on-surface);font:inherit;font-size:15px;text-align:left;cursor:pointer;box-shadow:none;transition:background-color var(--duration-short),border-color var(--duration-short),box-shadow var(--duration-medium),border-radius var(--duration-medium) var(--ease-spring)}#app .app-select-trigger:hover:not(:disabled){background-color:var(--md-surface-container-highest)}#app .app-select-trigger[aria-expanded=true],#app .app-select-trigger:focus-visible{border-color:var(--md-primary);background-color:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent);outline:none}#app .app-select-trigger:disabled{opacity:.5;cursor:not-allowed}.app-select-value{white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.app-select-chevron{flex-shrink:0;width:26px;height:26px;display:grid;place-items:center;border-radius:50%;color:var(--md-on-surface-variant);transition:transform var(--duration-medium) var(--ease-spring),background-color var(--duration-short)}#app .app-select-trigger:hover .app-select-chevron{background:color-mix(in srgb,var(--md-on-surface) 8%,transparent)}.app-select-chevron svg{transition:transform var(--duration-medium) var(--ease-spring)}.app-select-chevron svg.is-open{transform:rotate(180deg)}.app-select-menu{position:fixed;z-index:var(--z-popover);overflow-y:auto;overscroll-behavior:contain;padding:8px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:24px;background:var(--md-surface-container-low);color:var(--md-on-surface);box-shadow:0 18px 50px -12px color-mix(in srgb,var(--md-scrim,#000) 45%,transparent),0 4px 14px -4px #16244026;font-family:var(--font-family);font-size:14px;transform-origin:top}.app-select-menu.opens-up{transform-origin:bottom}.app-select-option{display:flex;justify-content:space-between;align-items:center;gap:12px;min-height:46px;padding:0 14px;border-radius:14px;cursor:pointer;overflow-wrap:anywhere;line-height:1.4;color:var(--md-on-surface);transition:background-color var(--duration-short),border-radius var(--duration-medium) var(--ease-spring),color var(--duration-short)}.app-select-option>span{min-width:0}.app-select-check{flex-shrink:0;width:24px;height:24px;display:grid;place-items:center;border-radius:50%;color:var(--md-primary)}.app-select-option.highlighted{background:color-mix(in srgb,var(--md-on-surface) 8%,transparent)}.app-select-option.selected{background:var(--md-primary-container);color:var(--md-on-primary-container);font-weight:650}.app-select-option.selected .app-select-check{background:var(--md-primary);color:var(--md-on-primary)}.app-select-option.disabled{opacity:.4;cursor:not-allowed}.app-select-empty{padding:18px;color:var(--md-on-surface-variant);text-align:center;font-size:13px}.select-menu-enter-active{transition:opacity var(--duration-short) var(--ease-emphasized),transform var(--duration-medium) var(--ease-spring)}.select-menu-leave-active{transition:opacity var(--duration-short),transform var(--duration-short)}.select-menu-enter-from,.select-menu-leave-to{opacity:0;transform:translateY(-6px) scale(.97)}@media (prefers-reduced-motion: reduce){#app .app-select-trigger{transition:background-color var(--duration-short),border-color var(--duration-short),box-shadow var(--duration-medium)}.app-select-chevron,.app-select-chevron svg,.app-select-option{transition:none}.select-menu-enter-active,.select-menu-leave-active{transition:opacity var(--duration-short)}.select-menu-enter-from,.select-menu-leave-to{transform:none}}.pcp[data-v-facba01d]{--r-xs:10px;--r-sm:14px;--r-md:20px;--r-lg:28px;--r-xl:36px;--spring:cubic-bezier(.2,.9,.25,1.15);height:100%;overflow-y:auto;padding:var(--space-xl) var(--space-xl) 96px;background:var(--md-surface);color:var(--md-on-surface);max-width:1240px;margin:0 auto}h1[data-v-facba01d],h2[data-v-facba01d],h3[data-v-facba01d],h4[data-v-facba01d]{margin:0;letter-spacing:-.01em}.eyebrow[data-v-facba01d]{margin:0 0 8px;color:var(--md-primary);font:700 12px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.18em}.eyebrow b[data-v-facba01d]{font-size:9px}.hero[data-v-facba01d]{position:relative;border-radius:var(--r-xl);padding:28px 28px 22px;margin-bottom:22px;background:linear-gradient(135deg,var(--md-primary-container),var(--md-surface-container-high) 70%);color:var(--md-on-surface);box-shadow:var(--shadow-1);overflow:hidden}.hero[data-v-facba01d]:after{content:\"\";position:absolute;right:-60px;top:-60px;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,color-mix(in srgb,var(--md-primary) 34%,transparent),transparent 68%);pointer-events:none}.hero-main[data-v-facba01d]{display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;align-items:flex-start;position:relative;z-index:1}.hero-copy h1[data-v-facba01d]{font-size:clamp(26px,3.4vw,40px);font-weight:800}.sub[data-v-facba01d]{margin:8px 0 0;max-width:620px;font-size:14px;line-height:1.6;color:var(--md-on-surface-variant)}.hero-actions[data-v-facba01d]{display:flex;gap:10px;align-items:center;flex-wrap:wrap}.fab[data-v-facba01d]{height:52px;padding:0 22px;border:0;border-radius:18px;background:var(--md-primary);color:var(--md-on-primary,#fff);font:700 14px/1 inherit;display:inline-flex;align-items:center;gap:10px;cursor:pointer;box-shadow:0 6px 18px color-mix(in srgb,var(--md-primary) 34%,transparent);transition:transform .28s var(--spring),box-shadow .28s}@media (hover: hover) and (pointer: fine){.fab[data-v-facba01d]:hover:not(:disabled){transform:translateY(-2px) scale(1.02)}}.fab[data-v-facba01d]:disabled{opacity:.6;cursor:not-allowed}.fab-ic[data-v-facba01d]{font-size:17px}.state-row[data-v-facba01d]{position:relative;z-index:1;display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;align-items:center}.pill[data-v-facba01d]{padding:6px 14px;border-radius:999px;background:color-mix(in srgb,var(--md-surface-container-lowest) 70%,transparent);font-size:13px;font-weight:700}.pill.soft[data-v-facba01d]{font-weight:500;color:var(--md-on-surface-variant)}.pill.bad[data-v-facba01d]{background:#ffdcc6;color:#7a3a00}.banner[data-v-facba01d]{padding:12px 16px;border-radius:var(--r-sm);font-size:13px;margin:0 0 16px}.banner.err[data-v-facba01d]{background:var(--md-error-container);color:var(--md-on-error-container)}.banner.ok[data-v-facba01d]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tabs[data-v-facba01d]{display:flex;gap:8px;overflow-x:auto;padding:6px 4px 14px;margin-bottom:6px;scrollbar-width:thin}.tab[data-v-facba01d]{flex:0 0 auto;display:inline-flex;align-items:center;gap:8px;height:44px;padding:0 18px;border:1px solid var(--md-outline-variant);border-radius:999px;background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font:700 13px/1 inherit;cursor:pointer;transition:background .25s,color .25s,transform .25s var(--spring)}.tab i[data-v-facba01d]{font-style:normal;font:700 12px/1 ui-monospace,monospace;opacity:.6}.tab-ic[data-v-facba01d]{font-size:14px}.tab[data-v-facba01d]:hover{background:var(--md-surface-container-high)}.tab.active[data-v-facba01d]{background:var(--md-primary);color:var(--md-on-primary,#fff);border-color:transparent;transform:translateY(-1px);box-shadow:0 6px 16px color-mix(in srgb,var(--md-primary) 30%,transparent)}.tab.active i[data-v-facba01d]{opacity:.85}.panel[data-v-facba01d]{animation:fade-facba01d .32s var(--spring)}@keyframes fade-facba01d{0%{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}.section-head[data-v-facba01d]{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap;margin:8px 0 18px}.section-head h2[data-v-facba01d]{font-size:22px;font-weight:800}.desc[data-v-facba01d]{margin:6px 0 0;font-size:13px;color:var(--md-on-surface-variant);max-width:720px;line-height:1.55}.head-actions[data-v-facba01d]{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.btn[data-v-facba01d]{height:40px;padding:0 16px;border:1px solid transparent;border-radius:999px;font:700 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:8px;transition:transform .22s var(--spring),background .22s,box-shadow .22s}.btn.sm[data-v-facba01d]{height:34px;padding:0 14px;font-size:13px}.btn[data-v-facba01d]:disabled{opacity:.5;cursor:not-allowed}@media (hover: hover) and (pointer: fine){.btn[data-v-facba01d]:hover:not(:disabled){transform:translateY(-1px)}}.btn.filled[data-v-facba01d]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn.tonic[data-v-facba01d]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn.text[data-v-facba01d]{background:transparent;color:var(--md-primary)}.btn.danger[data-v-facba01d]{background:var(--md-error-container);color:var(--md-on-error-container)}.link[data-v-facba01d]{border:0;background:transparent;color:var(--md-primary);font:700 12px/1 inherit;cursor:pointer;padding:4px}.card[data-v-facba01d]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--r-lg);padding:20px;margin-bottom:16px}.card>h3[data-v-facba01d]{font-size:16px;font-weight:750;margin-bottom:14px;display:flex;align-items:center;gap:8px}.card.sub[data-v-facba01d]{padding:16px;margin-bottom:0}.grid2[data-v-facba01d]{display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start}.grid3[data-v-facba01d]{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;align-items:start}.sub-label[data-v-facba01d]{margin:16px 0 8px;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--md-on-surface-variant)}.hint[data-v-facba01d]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.55;margin:6px 0}.world-field[data-v-facba01d]{display:block;margin:10px 0}.world-label[data-v-facba01d]{display:block;font-size:12px;font-weight:600;color:var(--md-on-surface-variant);margin-bottom:4px}.world-text[data-v-facba01d]{width:100%;min-height:64px;padding:10px 14px;border:1px solid var(--md-outline-variant);border-radius:var(--r-sm);background:var(--md-surface-container-high);color:var(--md-on-surface);font:inherit;font-size:13px;line-height:1.5;resize:vertical;outline:none}.world-text[data-v-facba01d]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 14%,transparent)}.world-actions[data-v-facba01d]{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-top:12px}.wm-head[data-v-facba01d]{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;margin-bottom:6px}.wm-place[data-v-facba01d]{font-size:12px;color:var(--md-on-surface-variant)}.wm-premise[data-v-facba01d]{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin:2px 0 8px}.wm-map-wrap[data-v-facba01d]{position:relative;margin-top:8px}.world-map-leaflet[data-v-facba01d]{height:clamp(460px,72vh,820px);border-radius:16px;overflow:hidden;border:1px solid var(--md-outline-variant);background:#e8edf2}.world-map-leaflet.is-empty[data-v-facba01d]{display:none}.wm-reset[data-v-facba01d]{position:absolute;top:10px;right:10px;z-index:var(--z-overlay);border:1px solid var(--md-outline-variant);background:#fffffff0;color:#33404c;border-radius:10px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer;box-shadow:0 1px 4px #0000002e}.wm-reset[data-v-facba01d]:hover{background:#fff}.wm-compass[data-v-facba01d]{position:absolute;left:12px;bottom:12px;z-index:var(--z-overlay);width:38px;height:38px;border-radius:50%;background:#ffffffeb;border:1px solid #b9c3cd;box-shadow:0 1px 4px #0000002e;display:grid;place-items:center}.wm-compass i[data-v-facba01d]{font-style:normal;font-size:12px;font-weight:800;color:#d64545;position:relative}.wm-compass i[data-v-facba01d]:before{content:\"\";position:absolute;left:50%;top:-9px;transform:translate(-50%);border-left:4px solid transparent;border-right:4px solid transparent;border-bottom:9px solid #33404c}.wm-scope[data-v-facba01d]{position:absolute;bottom:12px;right:12px;z-index:var(--z-overlay);border:1px solid var(--md-outline-variant);background:#fffffff0;color:#33404c;border-radius:10px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer;box-shadow:0 1px 4px #0000002e}.wm-scope[data-v-facba01d]:hover{background:#fff}.wm-offline[data-v-facba01d]{position:absolute;left:50%;bottom:12px;transform:translate(-50%);z-index:var(--z-overlay);background:#d1495bf0;color:#fff;font-size:12px;font-weight:600;padding:5px 12px;border-radius:10px;box-shadow:0 1px 4px #00000040}.wm-routes[data-v-facba01d]{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:18px;margin-top:14px}.wm-routes h4[data-v-facba01d]{margin:0 0 6px;font-size:13px;font-weight:800}.wm-routes ul[data-v-facba01d]{list-style:none;margin:0;padding:0}.wm-routes li[data-v-facba01d]{display:flex;gap:10px;padding:4px 0;border-bottom:1px dashed color-mix(in srgb,var(--md-outline-variant) 70%,transparent);font-size:12.5px}.wm-routes b[data-v-facba01d]{flex:0 0 88px}.wm-routes span[data-v-facba01d]{color:var(--md-on-surface-variant);line-height:1.5}.wm-legend[data-v-facba01d]{display:flex;flex-wrap:wrap;gap:14px;margin-top:12px;font-size:12px;color:var(--md-on-surface-variant)}.wm-legend span[data-v-facba01d]{display:inline-flex;align-items:center;gap:6px}.wm-legend i[data-v-facba01d]{width:12px;height:12px;border-radius:50%;display:inline-block;border:1.5px solid rgba(255,255,255,.7)}.wm-legend i.k-home[data-v-facba01d]{background:#e07a5f}.wm-legend i.k-work[data-v-facba01d]{background:#5b8def}.wm-legend i.k-shop[data-v-facba01d]{background:#e0a23d}.wm-legend i.k-food[data-v-facba01d]{background:#57a773}.wm-legend i.k-park[data-v-facba01d]{background:#3faead}.wm-legend i.k-transit[data-v-facba01d]{background:#8b6fd6}.wm-legend i.k-other[data-v-facba01d]{background:#8a94a6}.wm-legend i.k-actor[data-v-facba01d]{background:#fff;border-color:#d1495b;box-shadow:inset 0 0 0 3px #d1495b}.wm-legend i.k-metro[data-v-facba01d]{background:#d64545}.wm-legend i.k-bus[data-v-facba01d]{background:#e08a2e}.wm-legend i.k-park2[data-v-facba01d]{background:#9bd08f}.wm-legend i.k-water[data-v-facba01d]{background:#8fbfe6}.wm-legend i.k-hw[data-v-facba01d]{background:#f08c2e}.wm-legend i.k-arterial[data-v-facba01d]{background:#f7cf8a}.wm-legend i.k-street[data-v-facba01d]{background:#fff;border-color:#b9c3cd}.meta[data-v-facba01d]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5}.empty[data-v-facba01d]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant)}.field[data-v-facba01d]{width:100%;height:48px;padding:0 16px;border:1px solid var(--md-outline-variant);border-radius:var(--r-sm);background:var(--md-surface-container-high);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none;transition:border-color .2s,box-shadow .2s}.field[data-v-facba01d]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 14%,transparent)}.field.tiny[data-v-facba01d]{width:104px;height:38px;padding:0 12px;font-size:13px}.switches[data-v-facba01d]{display:flex;gap:16px;flex-wrap:wrap;margin:8px 0}.sw[data-v-facba01d]{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:var(--md-on-surface-variant);cursor:pointer}.sw input[data-v-facba01d]{width:18px;height:18px;accent-color:var(--md-primary)}.settings-grid[data-v-facba01d]{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px}.settings-grid label[data-v-facba01d]{display:flex;flex-direction:column;gap:4px;font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}.settings-grid .field[data-v-facba01d]{height:40px}.cog-metric[data-v-facba01d]{display:flex;flex-direction:column;gap:4px;padding:10px 12px;border-radius:var(--r-sm);background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant)}.cog-metric span[data-v-facba01d]{font-size:11px;font-weight:700;letter-spacing:.04em;color:var(--md-on-surface-variant)}.cog-metric strong[data-v-facba01d]{font-size:16px;font-weight:800;letter-spacing:-.01em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.som-channels[data-v-facba01d]{margin-top:10px;display:flex;flex-direction:column;gap:6px}.som-chan[data-v-facba01d]{display:grid;grid-template-columns:52px 1fr 48px;align-items:center;gap:10px}.som-chan-name[data-v-facba01d]{font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}.som-chan-bar[data-v-facba01d]{display:block;height:8px;border-radius:999px;background:var(--md-surface-container);overflow:hidden}.som-chan-bar i[data-v-facba01d]{display:block;width:100%;height:100%;border-radius:999px;background:var(--md-primary);transform-origin:left;transition:transform var(--duration-medium) var(--ease-out);will-change:transform}.som-chan-val[data-v-facba01d]{font-size:12px;font-weight:700;text-align:right;color:var(--md-on-surface-variant)}.chip[data-v-facba01d]{display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 12px;border-radius:999px;font-size:12px;font-weight:700;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.chip.muted[data-v-facba01d]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}.chip.ok[data-v-facba01d]{background:var(--md-success-container);color:#0d3b1e}.count-pill[data-v-facba01d]{margin-left:auto;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);border-radius:999px;padding:3px 10px;font-size:12px;font-weight:700}.count-pill.ok[data-v-facba01d]{background:var(--md-success-container);color:#0d3b1e}.actions-row[data-v-facba01d]{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:8px}#app .pcp .card[data-v-facba01d]{border-color:color-mix(in srgb,var(--md-outline-variant) 55%,transparent);background:var(--md-surface-container-low);box-shadow:var(--shadow-1)}#app .pcp .field[data-v-facba01d]{height:52px;border-radius:16px;border-color:transparent;background:var(--md-surface-container-high)}#app .pcp .field[data-v-facba01d]:focus{border-color:var(--md-primary);background:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}#app .pcp .field.tiny[data-v-facba01d]{height:40px}#app .pcp .settings-grid .field[data-v-facba01d]{height:44px}#app .pcp .btn[data-v-facba01d]{height:44px;padding:0 20px}#app .pcp .btn.sm[data-v-facba01d]{height:36px;padding:0 15px}#app .pcp .cog-metric[data-v-facba01d]{background:var(--md-surface-container)}@media (prefers-reduced-motion: reduce){.panel[data-v-facba01d]{animation:none}.fab[data-v-facba01d],.btn[data-v-facba01d],.tab[data-v-facba01d],.som-chan-bar i[data-v-facba01d]{transition:none}.fab[data-v-facba01d]:hover:not(:disabled),.btn[data-v-facba01d]:hover:not(:disabled),.tab.active[data-v-facba01d]{transform:none}}@media (prefers-color-scheme: dark){.pill.bad[data-v-facba01d]{background:#5a2d00;color:#ffd7b0}}@media (max-width:820px){.grid2[data-v-facba01d],.grid3[data-v-facba01d]{grid-template-columns:1fr}.settings-grid label.wide[data-v-facba01d]{grid-column:span 1}}@media (max-width:560px){.pcp[data-v-facba01d]{padding:var(--space-lg) var(--space-lg) 80px}.hero[data-v-facba01d]{padding:20px}.hero-actions[data-v-facba01d]{width:100%}}.wm-pin-holder,.wm-actor-holder{background:none;border:none}.wm-pin{position:absolute;left:0;top:0;width:16px;height:16px;border-radius:50%;background:var(--c,#8a94a6);border:3px solid #fff;box-shadow:0 2px 6px #00000073;transform:translate(-50%,-50%)}.wm-pin:after{content:\"\";position:absolute;left:50%;top:100%;width:2px;height:8px;background:#fff;transform:translate(-50%);opacity:.7}.wm-pin-label{position:absolute;left:12px;top:-9px;white-space:nowrap;background:#12141ad1;color:#fff;font-size:12px;font-weight:600;padding:2px 8px;border-radius:10px;pointer-events:none}.wm-actor-badge{position:absolute;left:0;top:0;width:26px;height:26px;border-radius:50%;background:#fff;color:#d1495b;border:3px solid #d1495b;font-size:14px;font-weight:800;line-height:1;display:grid;place-items:center;transform:translate(-50%,-50%);box-shadow:0 2px 6px #00000080;z-index:600}.wm-actor-name{position:absolute;left:0;top:20px;white-space:nowrap;background:#d1495b;color:#fff;font-size:11px;font-weight:700;padding:1px 7px;border-radius:9px;transform:translate(-50%)}.wm-district{background:none;border:none}.wm-district-inner{position:absolute;left:0;top:0;transform:translate(-50%,-50%);white-space:nowrap;font-size:12px;font-weight:800;letter-spacing:.2em;color:#5c6b78;text-shadow:0 1px 0 rgba(255,255,255,.9);pointer-events:none}.wm-route{background:none;border:none}.wm-route-inner{position:absolute;left:0;top:0;transform:translate(-50%,-50%);background:var(--c,#333);color:#fff;font-size:10px;font-weight:700;padding:1px 6px;border-radius:8px;white-space:nowrap;box-shadow:0 1px 3px #00000059;pointer-events:none}.wm-zoom-low .wm-minor{display:none}.wm-station .wm-route-inner{background:#fff;color:#33404c;border:1.5px solid var(--c,#888);border-radius:6px;font-size:9px;font-weight:700;padding:1px 5px}.leaflet-container{font-family:inherit;background:#e8edf2;border-radius:16px}.leaflet-container a{color:#2f6fed}.leaflet-popup-content{font-size:13px;line-height:1.5}.page[data-v-c4f2d266]{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}.page-inner[data-v-c4f2d266]{max-width:1180px;margin:0 auto}.page-header[data-v-c4f2d266]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.eyebrow[data-v-c4f2d266]{margin:0 0 6px;color:var(--md-primary);font:700 12px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.page-header h1[data-v-c4f2d266]{margin:0;font-size:var(--font-size-lg);font-weight:650;letter-spacing:-.01em}.subtitle[data-v-c4f2d266]{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-c4f2d266]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0;flex-wrap:wrap}.btn[data-v-c4f2d266]{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s,background .15s}.btn[data-v-c4f2d266]:disabled{opacity:.55;cursor:not-allowed}.btn[data-v-c4f2d266]:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}.btn-sm[data-v-c4f2d266]{height:30px;padding:0 12px;font-size:12px}.btn-primary[data-v-c4f2d266]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn-tonal[data-v-c4f2d266]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn-danger[data-v-c4f2d266]{background:var(--md-error-container);color:var(--md-on-error-container)}.stat-grid[data-v-c4f2d266]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-c4f2d266]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}.stat-head[data-v-c4f2d266]{display:flex;align-items:center;gap:10px}.stat-label[data-v-c4f2d266]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-c4f2d266]{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1}.stat-hint[data-v-c4f2d266]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-c4f2d266]{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-c4f2d266]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-c4f2d266]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-c4f2d266]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-c4f2d266]{background:var(--md-success-container);color:#0d3b1e}.card[data-v-c4f2d266]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);box-shadow:var(--shadow-1);padding:var(--space-lg)}.card-head[data-v-c4f2d266]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.card-title[data-v-c4f2d266]{margin:0;font-size:16px;font-weight:650}.tabs[data-v-c4f2d266]{display:inline-flex;gap:4px;padding:4px;border-radius:999px;background:var(--md-surface-container-high);margin-bottom:var(--space-lg)}.tabs button[data-v-c4f2d266]{border:0;background:transparent;border-radius:999px;padding:8px 18px;font-size:13px;font-weight:600;color:var(--md-on-surface-variant);cursor:pointer}.tabs button.active[data-v-c4f2d266]{background:var(--md-surface-container-lowest);color:var(--md-primary);box-shadow:var(--shadow-1)}.toolbar[data-v-c4f2d266]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:var(--space-lg);padding:var(--space-md)}.search-field[data-v-c4f2d266]{display:flex;align-items:center;gap:10px;flex:1;min-width:220px}.search-icon[data-v-c4f2d266]{color:var(--md-on-surface-variant);flex-shrink:0}.search-field input[data-v-c4f2d266]{flex:1;min-width:0;height:38px;border:0;background:transparent;outline:none;color:var(--md-on-surface);font-size:14px}.search-field input[data-v-c4f2d266]:focus-visible{outline:3px solid var(--md-primary);outline-offset:2px}.search-field.mini[data-v-c4f2d266]{padding:8px 12px;border:1px solid var(--md-outline-variant);border-radius:10px;margin-bottom:12px}.select[data-v-c4f2d266]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.select select[data-v-c4f2d266]{height:34px;border:1px solid var(--md-outline-variant);border-radius:9px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);padding:0 10px;font:inherit;font-size:13px}.chip[data-v-c4f2d266]{height:26px;padding:0 11px;border-radius:999px;font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:6px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0}.chip.muted[data-v-c4f2d266]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}.tier-short[data-v-c4f2d266]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tier-long[data-v-c4f2d266]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.chip-ok[data-v-c4f2d266]{background:var(--md-success-container);color:#0d3b1e}.chip-warn[data-v-c4f2d266]{background:#fff1dc;color:#7a4400}.error-banner[data-v-c4f2d266]{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:var(--md-on-error-container);font-size:13px;margin:var(--space-lg) 0}.notice[data-v-c4f2d266]{padding:10px 16px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;margin-top:var(--space-md)}.memory-list[data-v-c4f2d266]{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:var(--space-lg)}.memory-card[data-v-c4f2d266]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:12px;transition:border-color .15s,box-shadow .15s}.memory-card-enter-active[data-v-c4f2d266]{transition:opacity .2s var(--ease-emphasized-decel),transform .2s var(--ease-emphasized-decel)}.memory-card-leave-active[data-v-c4f2d266]{transition:opacity .16s var(--ease-emphasized-accel),transform .16s var(--ease-emphasized-accel)}.memory-card-enter-from[data-v-c4f2d266]{opacity:0;transform:translateY(6px) scale(.98)}.memory-card-leave-to[data-v-c4f2d266]{opacity:0;transform:scale(.98)}.memory-card-move[data-v-c4f2d266]{transition:transform .26s var(--ease-emphasized)}@media (prefers-reduced-motion: reduce){.memory-card-enter-active[data-v-c4f2d266],.memory-card-leave-active[data-v-c4f2d266],.memory-card-move[data-v-c4f2d266]{transition-duration:1ms}.memory-card-enter-from[data-v-c4f2d266],.memory-card-leave-to[data-v-c4f2d266]{transform:none}}.memory-card[data-v-c4f2d266]:hover{border-color:color-mix(in srgb,var(--md-primary) 45%,var(--md-outline-variant));box-shadow:var(--shadow-2)}.card-top[data-v-c4f2d266]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.btn-icon[data-v-c4f2d266]{position:relative;width:30px;height:30px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--md-on-surface-variant);display:grid;place-items:center;cursor:pointer;margin-left:auto}.btn-icon[data-v-c4f2d266]:after{content:\"\";position:absolute;top:50%;left:50%;width:44px;height:44px;transform:translate(-50%,-50%)}.btn-icon.danger[data-v-c4f2d266]:hover{background:var(--md-error-container);color:var(--md-error)}.memory-content[data-v-c4f2d266]{margin:0;line-height:1.65;font-size:14px;white-space:pre-wrap}.tags[data-v-c4f2d266]{display:flex;gap:6px;flex-wrap:wrap}.tags span[data-v-c4f2d266]{font-size:12px;font-weight:500;color:var(--md-on-primary-container);background:var(--md-primary-container);padding:3px 8px;border-radius:999px}.memory-foot[data-v-c4f2d266]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding-top:12px;border-top:1px solid var(--md-outline-variant)}.meter[data-v-c4f2d266]{display:flex;align-items:center;gap:7px;font-size:12px;color:var(--md-on-surface-variant)}.meter-bar[data-v-c4f2d266]{width:56px;height:5px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-c4f2d266]{display:block;height:100%;width:100%;transform-origin:left;transform:scaleX(var(--v,0%));border-radius:999px;transition:transform .3s var(--ease-out,ease)}.fill-primary[data-v-c4f2d266]{background:var(--md-primary)}.fill-secondary[data-v-c4f2d266]{background:var(--md-secondary,#536255)}.meter-text[data-v-c4f2d266]{margin-left:auto;font-size:12px;color:var(--md-on-surface-variant)}.detail[data-v-c4f2d266]{border-top:1px solid var(--md-outline-variant);padding-top:10px}.detail dl[data-v-c4f2d266]{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0;font-size:12px}.detail dt[data-v-c4f2d266]{color:var(--md-on-surface-variant);font-weight:600}.detail dd[data-v-c4f2d266]{margin:3px 0 0;overflow-wrap:anywhere}.detail code[data-v-c4f2d266]{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px}.card-actions[data-v-c4f2d266]{display:flex;gap:8px;justify-content:flex-end}.hidden-input[data-v-c4f2d266]{display:none}.empty-state[data-v-c4f2d266]{padding:56px 24px;text-align:center;background:var(--md-surface-container);border:1px dashed var(--md-outline-variant);border-radius:var(--radius-lg);color:var(--md-on-surface-variant)}.empty-state p[data-v-c4f2d266]{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}.empty-state .hint[data-v-c4f2d266]{margin-top:8px;font-size:13px;font-weight:400;opacity:.85}.pager[data-v-c4f2d266]{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:var(--space-lg)}.grid-notes[data-v-c4f2d266]{display:grid;grid-template-columns:minmax(0,340px) 1fr;gap:var(--space-lg)}.stack-form[data-v-c4f2d266]{display:flex;flex-direction:column;gap:10px}.input[data-v-c4f2d266]{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none}.input[data-v-c4f2d266]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}.input.area[data-v-c4f2d266]{height:auto;padding:10px 14px;min-height:120px;resize:vertical;line-height:1.6}.note-list[data-v-c4f2d266],.reflection-list[data-v-c4f2d266]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}.note-item[data-v-c4f2d266]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}.note-main[data-v-c4f2d266]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.note-main strong[data-v-c4f2d266]{font-size:14px;font-weight:600;overflow-wrap:anywhere}.item-meta[data-v-c4f2d266]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.note-actions[data-v-c4f2d266]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-c4f2d266]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.reader[data-v-c4f2d266]{margin-top:var(--space-lg)}.reader pre[data-v-c4f2d266]{margin:0;max-height:460px;overflow:auto;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;line-height:1.7;white-space:pre-wrap;background:var(--md-surface-container);padding:14px 16px;border-radius:12px}.reflection .card-title[data-v-c4f2d266]{font-size:14px;font-weight:600}.reflection details[data-v-c4f2d266]{margin-top:6px}.reflection summary[data-v-c4f2d266]{cursor:pointer;font-size:12px;color:var(--md-on-surface-variant)}.quote[data-v-c4f2d266]{margin:8px 0 0;font-size:13px;line-height:1.6;background:var(--md-surface-container);padding:8px 12px;border-radius:8px;white-space:pre-wrap;overflow-wrap:anywhere}#app .memory-page .page-header h1[data-v-c4f2d266]{font-size:clamp(24px,2.8vw,34px);font-weight:800;letter-spacing:-.02em}#app .memory-page .stat-grid[data-v-c4f2d266]{gap:var(--space-lg)}#app .memory-page .stat-card[data-v-c4f2d266],#app .memory-page .card[data-v-c4f2d266],#app .memory-page .memory-card[data-v-c4f2d266]{border-color:color-mix(in srgb,var(--md-outline-variant) 55%,transparent);background:var(--md-surface-container-low);box-shadow:var(--shadow-1)}#app .memory-page .stat-card[data-v-c4f2d266]{border-radius:24px;transition:transform .28s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),box-shadow .28s}@media (hover: hover) and (pointer: fine){#app .memory-page .stat-card[data-v-c4f2d266]:hover{transform:translateY(-2px);box-shadow:var(--shadow-2)}}#app .memory-page .stat-value[data-v-c4f2d266]{font-size:34px;font-weight:800;letter-spacing:-.02em}#app .memory-page .icon-badge[data-v-c4f2d266]{width:44px;height:44px;border-radius:16px 16px 16px 6px}#app .memory-page .card[data-v-c4f2d266],#app .memory-page .memory-card[data-v-c4f2d266]{border-radius:24px}#app .memory-page .memory-card[data-v-c4f2d266]{transition:transform .26s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),box-shadow .22s,border-color .2s}@media (hover: hover) and (pointer: fine){#app .memory-page .memory-card[data-v-c4f2d266]:hover{transform:translateY(-2px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--md-primary) 30%,var(--md-outline-variant))}}#app .memory-page .btn[data-v-c4f2d266]{height:44px;padding:0 20px;border-radius:999px;font-weight:700}#app .memory-page .btn-sm[data-v-c4f2d266]{height:34px;padding:0 14px;font-size:13px}#app .memory-page .btn-tonal[data-v-c4f2d266]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}#app .memory-page .btn-primary[data-v-c4f2d266]{background:var(--md-primary);color:var(--md-on-primary);box-shadow:0 6px 16px color-mix(in srgb,var(--md-primary) 28%,transparent)}#app .memory-page .input[data-v-c4f2d266]{height:48px;border:1px solid transparent;border-radius:14px;background:var(--md-surface-container-high);transition:background-color .18s,border-color .18s,box-shadow .2s}#app .memory-page .input[data-v-c4f2d266]:focus{border-color:var(--md-primary);background:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}#app .memory-page .input.area[data-v-c4f2d266]{height:auto;padding:14px 16px}#app .memory-page .search-field input[data-v-c4f2d266]{height:44px}#app .memory-page .search-field.mini[data-v-c4f2d266]{border-color:transparent;background:var(--md-surface-container-high);border-radius:14px}#app .memory-page .select select[data-v-c4f2d266]{height:44px;border-color:transparent;border-radius:14px;background:var(--md-surface-container-high);padding:0 14px}#app .memory-page .tabs[data-v-c4f2d266]{padding:5px;border-radius:999px;background:var(--md-surface-container-high)}#app .memory-page .tabs button[data-v-c4f2d266]{border-radius:999px;padding:9px 20px;font-weight:650}#app .memory-page .tabs button.active[data-v-c4f2d266]{background:var(--md-primary);color:var(--md-on-primary);box-shadow:var(--shadow-1)}#app .memory-page .note-item[data-v-c4f2d266]{border-radius:16px;border-color:color-mix(in srgb,var(--md-outline-variant) 45%,transparent);background:var(--md-surface-container-low)}@media (prefers-reduced-motion: reduce){#app .memory-page .stat-card[data-v-c4f2d266]:hover,#app .memory-page .memory-card[data-v-c4f2d266]:hover{transform:none}.meter-bar i[data-v-c4f2d266]{transition:none}}@media (max-width:900px){.stat-grid[data-v-c4f2d266]{grid-template-columns:repeat(2,1fr)}.grid-notes[data-v-c4f2d266]{grid-template-columns:1fr}}@media (max-width:640px){.page[data-v-c4f2d266]{padding:var(--space-lg)}.header-actions[data-v-c4f2d266]{padding-top:0}.memory-list[data-v-c4f2d266]{grid-template-columns:1fr}}\n";document.head.appendChild(s)}})();
