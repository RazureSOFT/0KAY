import { defineComponent as wo, ref as J, computed as st, watch as He, nextTick as Pi, onMounted as En, onUnmounted as xo, openBlock as P, createElementBlock as T, mergeProps as vs, createElementVNode as s, unref as Qi, toDisplayString as m, normalizeClass as Yt, createBlock as gs, Teleport as ys, createVNode as Rt, Transition as bs, withCtx as ws, withModifiers as yo, normalizeStyle as en, Fragment as wt, renderList as Jt, createCommentVNode as G, createTextVNode as It, withDirectives as b, vModelText as Z, vShow as tn, vModelCheckbox as vt, createStaticVNode as xs } from "vue";
import { _ as Ls, u as Ps, a as Ts } from "./assets/_plugin-vue_export-helper-Bl_tmTjg.js";
function ks(zt) {
  return zt && zt.__esModule && Object.prototype.hasOwnProperty.call(zt, "default") ? zt.default : zt;
}
var Ti = { exports: {} };
var Cs = Ti.exports, bo;
function Ss() {
  return bo || (bo = 1, (function(zt, ge) {
    (function(f, Et) {
      Et(ge);
    })(Cs, (function(f) {
      var Et = "1.9.4";
      function q(t) {
        var e, i, n, a;
        for (i = 1, n = arguments.length; i < n; i++) {
          a = arguments[i];
          for (e in a)
            t[e] = a[e];
        }
        return t;
      }
      var Dt = Object.create || /* @__PURE__ */ (function() {
        function t() {
        }
        return function(e) {
          return t.prototype = e, new t();
        };
      })();
      function H(t, e) {
        var i = Array.prototype.slice;
        if (t.bind)
          return t.bind.apply(t, i.call(arguments, 1));
        var n = i.call(arguments, 2);
        return function() {
          return t.apply(e, n.length ? n.concat(i.call(arguments)) : arguments);
        };
      }
      var Xt = 0;
      function R(t) {
        return "_leaflet_id" in t || (t._leaflet_id = ++Xt), t._leaflet_id;
      }
      function X(t, e, i) {
        var n, a, r, u;
        return u = function() {
          n = !1, a && (r.apply(i, a), a = !1);
        }, r = function() {
          n ? a = arguments : (t.apply(i, arguments), setTimeout(u, e), n = !0);
        }, r;
      }
      function ut(t, e, i) {
        var n = e[1], a = e[0], r = n - a;
        return t === n && i ? t : ((t - a) % r + r) % r + a;
      }
      function nt() {
        return !1;
      }
      function gt(t, e) {
        if (e === !1)
          return t;
        var i = Math.pow(10, e === void 0 ? 6 : e);
        return Math.round(t * i) / i;
      }
      function Pt(t) {
        return t.trim ? t.trim() : t.replace(/^\s+|\s+$/g, "");
      }
      function ht(t) {
        return Pt(t).split(/\s+/);
      }
      function tt(t, e) {
        Object.prototype.hasOwnProperty.call(t, "options") || (t.options = t.options ? Dt(t.options) : {});
        for (var i in e)
          t.options[i] = e[i];
        return t.options;
      }
      function Qt(t, e, i) {
        var n = [];
        for (var a in t)
          n.push(encodeURIComponent(i ? a.toUpperCase() : a) + "=" + encodeURIComponent(t[a]));
        return (!e || e.indexOf("?") === -1 ? "?" : "&") + n.join("&");
      }
      var We = /\{ *([\w_ -]+) *\}/g;
      function te(t, e) {
        return t.replace(We, function(i, n) {
          var a = e[n];
          if (a === void 0)
            throw new Error("No value provided for variable " + i);
          return typeof a == "function" && (a = a(e)), a;
        });
      }
      var yt = Array.isArray || function(t) {
        return Object.prototype.toString.call(t) === "[object Array]";
      };
      function de(t, e) {
        for (var i = 0; i < t.length; i++)
          if (t[i] === e)
            return i;
        return -1;
      }
      var ee = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
      function ce(t) {
        return window["webkit" + t] || window["moz" + t] || window["ms" + t];
      }
      var je = 0;
      function Ce(t) {
        var e = +/* @__PURE__ */ new Date(), i = Math.max(0, 16 - (e - je));
        return je = e + i, window.setTimeout(t, i);
      }
      var ye = window.requestAnimationFrame || ce("RequestAnimationFrame") || Ce, y = window.cancelAnimationFrame || ce("CancelAnimationFrame") || ce("CancelRequestAnimationFrame") || function(t) {
        window.clearTimeout(t);
      };
      function z(t, e, i) {
        if (i && ye === Ce)
          t.call(e);
        else
          return ye.call(window, H(t, e));
      }
      function W(t) {
        t && y.call(window, t);
      }
      var it = {
        __proto__: null,
        extend: q,
        create: Dt,
        bind: H,
        get lastId() {
          return Xt;
        },
        stamp: R,
        throttle: X,
        wrapNum: ut,
        falseFn: nt,
        formatNum: gt,
        trim: Pt,
        splitWords: ht,
        setOptions: tt,
        getParamString: Qt,
        template: te,
        isArray: yt,
        indexOf: de,
        emptyImageUrl: ee,
        requestFn: ye,
        cancelFn: y,
        requestAnimFrame: z,
        cancelAnimFrame: W
      };
      function xt() {
      }
      xt.extend = function(t) {
        var e = function() {
          tt(this), this.initialize && this.initialize.apply(this, arguments), this.callInitHooks();
        }, i = e.__super__ = this.prototype, n = Dt(i);
        n.constructor = e, e.prototype = n;
        for (var a in this)
          Object.prototype.hasOwnProperty.call(this, a) && a !== "prototype" && a !== "__super__" && (e[a] = this[a]);
        return t.statics && q(e, t.statics), t.includes && (Ge(t.includes), q.apply(null, [n].concat(t.includes))), q(n, t), delete n.statics, delete n.includes, n.options && (n.options = i.options ? Dt(i.options) : {}, q(n.options, t.options)), n._initHooks = [], n.callInitHooks = function() {
          if (!this._initHooksCalled) {
            i.callInitHooks && i.callInitHooks.call(this), this._initHooksCalled = !0;
            for (var r = 0, u = n._initHooks.length; r < u; r++)
              n._initHooks[r].call(this);
          }
        }, e;
      }, xt.include = function(t) {
        var e = this.prototype.options;
        return q(this.prototype, t), t.options && (this.prototype.options = e, this.mergeOptions(t.options)), this;
      }, xt.mergeOptions = function(t) {
        return q(this.prototype.options, t), this;
      }, xt.addInitHook = function(t) {
        var e = Array.prototype.slice.call(arguments, 1), i = typeof t == "function" ? t : function() {
          this[t].apply(this, e);
        };
        return this.prototype._initHooks = this.prototype._initHooks || [], this.prototype._initHooks.push(i), this;
      };
      function Ge(t) {
        if (!(typeof L > "u" || !L || !L.Mixin)) {
          t = yt(t) ? t : [t];
          for (var e = 0; e < t.length; e++)
            t[e] === L.Mixin.Events && console.warn("Deprecated include of L.Mixin.Events: this property will be removed in future releases, please inherit from L.Evented instead.", new Error().stack);
        }
      }
      var Lt = {
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
            for (var a = 0, r = t.length; a < r; a++)
              this._on(t[a], e, i);
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
            for (var a = arguments.length === 1, r = 0, u = t.length; r < u; r++)
              a ? this._off(t[r]) : this._off(t[r], e, i);
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
            var a = { fn: e, ctx: i };
            n && (a.once = !0), this._events = this._events || {}, this._events[t] = this._events[t] || [], this._events[t].push(a);
          }
        },
        _off: function(t, e, i) {
          var n, a, r;
          if (this._events && (n = this._events[t], !!n)) {
            if (arguments.length === 1) {
              if (this._firingCount)
                for (a = 0, r = n.length; a < r; a++)
                  n[a].fn = nt;
              delete this._events[t];
              return;
            }
            if (typeof e != "function") {
              console.warn("wrong listener type: " + typeof e);
              return;
            }
            var u = this._listens(t, e, i);
            if (u !== !1) {
              var h = n[u];
              this._firingCount && (h.fn = nt, this._events[t] = n = n.slice()), n.splice(u, 1);
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
          var n = q({}, e, {
            type: t,
            target: this,
            sourceTarget: e && e.sourceTarget || this
          });
          if (this._events) {
            var a = this._events[t];
            if (a) {
              this._firingCount = this._firingCount + 1 || 1;
              for (var r = 0, u = a.length; r < u; r++) {
                var h = a[r], d = h.fn;
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
          var a = e;
          typeof e != "function" && (n = !!e, a = void 0, i = void 0);
          var r = this._events && this._events[t];
          if (r && r.length && this._listens(t, a, i) !== !1)
            return !0;
          if (n) {
            for (var u in this._eventParents)
              if (this._eventParents[u].listens(t, e, i, n))
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
          for (var a = 0, r = n.length; a < r; a++)
            if (n[a].fn === e && n[a].ctx === i)
              return a;
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
            for (var a = 0, r = t.length; a < r; a++)
              this._on(t[a], e, i, !0);
          }
          return this;
        },
        // @method addEventParent(obj: Evented): this
        // Adds an event parent - an `Evented` that will receive propagated events
        addEventParent: function(t) {
          return this._eventParents = this._eventParents || {}, this._eventParents[R(t)] = t, this;
        },
        // @method removeEventParent(obj: Evented): this
        // Removes an event parent, so it will stop receiving propagated events
        removeEventParent: function(t) {
          return this._eventParents && delete this._eventParents[R(t)], this;
        },
        _propagateEvent: function(t) {
          for (var e in this._eventParents)
            this._eventParents[e].fire(t.type, q({
              layer: t.target,
              propagatedFrom: t.target
            }, t), !0);
        }
      };
      Lt.addEventListener = Lt.on, Lt.removeEventListener = Lt.clearAllEventListeners = Lt.off, Lt.addOneTimeEventListener = Lt.once, Lt.fireEvent = Lt.fire, Lt.hasEventListeners = Lt.listens;
      var Wt = xt.extend(Lt);
      function S(t, e, i) {
        this.x = i ? Math.round(t) : t, this.y = i ? Math.round(e) : e;
      }
      var jt = Math.trunc || function(t) {
        return t > 0 ? Math.floor(t) : Math.ceil(t);
      };
      S.prototype = {
        // @method clone(): Point
        // Returns a copy of the current point.
        clone: function() {
          return new S(this.x, this.y);
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
          return new S(this.x * t.x, this.y * t.y);
        },
        // @method unscaleBy(scale: Point): Point
        // Inverse of `scaleBy`. Divide each coordinate of the current point by
        // each coordinate of `scale`.
        unscaleBy: function(t) {
          return new S(this.x / t.x, this.y / t.y);
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
          return this.x = jt(this.x), this.y = jt(this.y), this;
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
          return "Point(" + gt(this.x) + ", " + gt(this.y) + ")";
        }
      };
      function I(t, e, i) {
        return t instanceof S ? t : yt(t) ? new S(t[0], t[1]) : t == null ? t : typeof t == "object" && "x" in t && "y" in t ? new S(t.x, t.y) : new S(t, e, i);
      }
      function A(t, e) {
        if (t)
          for (var i = e ? [t, e] : t, n = 0, a = i.length; n < a; n++)
            this.extend(i[n]);
      }
      A.prototype = {
        // @method extend(point: Point): this
        // Extends the bounds to contain the given point.
        // @alternative
        // @method extend(otherBounds: Bounds): this
        // Extend the bounds to contain the given bounds
        extend: function(t) {
          var e, i;
          if (!t)
            return this;
          if (t instanceof S || typeof t[0] == "number" || "x" in t)
            e = i = I(t);
          else if (t = dt(t), e = t.min, i = t.max, !e || !i)
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
          return typeof t[0] == "number" || t instanceof S ? t = I(t) : t = dt(t), t instanceof A ? (e = t.min, i = t.max) : e = i = t, e.x >= this.min.x && i.x <= this.max.x && e.y >= this.min.y && i.y <= this.max.y;
        },
        // @method intersects(otherBounds: Bounds): Boolean
        // Returns `true` if the rectangle intersects the given bounds. Two bounds
        // intersect if they have at least one point in common.
        intersects: function(t) {
          t = dt(t);
          var e = this.min, i = this.max, n = t.min, a = t.max, r = a.x >= e.x && n.x <= i.x, u = a.y >= e.y && n.y <= i.y;
          return r && u;
        },
        // @method overlaps(otherBounds: Bounds): Boolean
        // Returns `true` if the rectangle overlaps the given bounds. Two bounds
        // overlap if their intersection is an area.
        overlaps: function(t) {
          t = dt(t);
          var e = this.min, i = this.max, n = t.min, a = t.max, r = a.x > e.x && n.x < i.x, u = a.y > e.y && n.y < i.y;
          return r && u;
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
          var e = this.min, i = this.max, n = Math.abs(e.x - i.x) * t, a = Math.abs(e.y - i.y) * t;
          return dt(
            I(e.x - n, e.y - a),
            I(i.x + n, i.y + a)
          );
        },
        // @method equals(otherBounds: Bounds): Boolean
        // Returns `true` if the rectangle is equivalent to the given bounds.
        equals: function(t) {
          return t ? (t = dt(t), this.min.equals(t.getTopLeft()) && this.max.equals(t.getBottomRight())) : !1;
        }
      };
      function dt(t, e) {
        return !t || t instanceof A ? t : new A(t, e);
      }
      function Tt(t, e) {
        if (t)
          for (var i = e ? [t, e] : t, n = 0, a = i.length; n < a; n++)
            this.extend(i[n]);
      }
      Tt.prototype = {
        // @method extend(latlng: LatLng): this
        // Extend the bounds to contain the given point
        // @alternative
        // @method extend(otherBounds: LatLngBounds): this
        // Extend the bounds to contain the given bounds
        extend: function(t) {
          var e = this._southWest, i = this._northEast, n, a;
          if (t instanceof Q)
            n = t, a = t;
          else if (t instanceof Tt) {
            if (n = t._southWest, a = t._northEast, !n || !a)
              return this;
          } else
            return t ? this.extend(F(t) || pt(t)) : this;
          return !e && !i ? (this._southWest = new Q(n.lat, n.lng), this._northEast = new Q(a.lat, a.lng)) : (e.lat = Math.min(n.lat, e.lat), e.lng = Math.min(n.lng, e.lng), i.lat = Math.max(a.lat, i.lat), i.lng = Math.max(a.lng, i.lng)), this;
        },
        // @method pad(bufferRatio: Number): LatLngBounds
        // Returns bounds created by extending or retracting the current bounds by a given ratio in each direction.
        // For example, a ratio of 0.5 extends the bounds by 50% in each direction.
        // Negative values will retract the bounds.
        pad: function(t) {
          var e = this._southWest, i = this._northEast, n = Math.abs(e.lat - i.lat) * t, a = Math.abs(e.lng - i.lng) * t;
          return new Tt(
            new Q(e.lat - n, e.lng - a),
            new Q(i.lat + n, i.lng + a)
          );
        },
        // @method getCenter(): LatLng
        // Returns the center point of the bounds.
        getCenter: function() {
          return new Q(
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
          return new Q(this.getNorth(), this.getWest());
        },
        // @method getSouthEast(): LatLng
        // Returns the south-east point of the bounds.
        getSouthEast: function() {
          return new Q(this.getSouth(), this.getEast());
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
          typeof t[0] == "number" || t instanceof Q || "lat" in t ? t = F(t) : t = pt(t);
          var e = this._southWest, i = this._northEast, n, a;
          return t instanceof Tt ? (n = t.getSouthWest(), a = t.getNorthEast()) : n = a = t, n.lat >= e.lat && a.lat <= i.lat && n.lng >= e.lng && a.lng <= i.lng;
        },
        // @method intersects(otherBounds: LatLngBounds): Boolean
        // Returns `true` if the rectangle intersects the given bounds. Two bounds intersect if they have at least one point in common.
        intersects: function(t) {
          t = pt(t);
          var e = this._southWest, i = this._northEast, n = t.getSouthWest(), a = t.getNorthEast(), r = a.lat >= e.lat && n.lat <= i.lat, u = a.lng >= e.lng && n.lng <= i.lng;
          return r && u;
        },
        // @method overlaps(otherBounds: LatLngBounds): Boolean
        // Returns `true` if the rectangle overlaps the given bounds. Two bounds overlap if their intersection is an area.
        overlaps: function(t) {
          t = pt(t);
          var e = this._southWest, i = this._northEast, n = t.getSouthWest(), a = t.getNorthEast(), r = a.lat > e.lat && n.lat < i.lat, u = a.lng > e.lng && n.lng < i.lng;
          return r && u;
        },
        // @method toBBoxString(): String
        // Returns a string with bounding box coordinates in a 'southwest_lng,southwest_lat,northeast_lng,northeast_lat' format. Useful for sending requests to web services that return geo data.
        toBBoxString: function() {
          return [this.getWest(), this.getSouth(), this.getEast(), this.getNorth()].join(",");
        },
        // @method equals(otherBounds: LatLngBounds, maxMargin?: Number): Boolean
        // Returns `true` if the rectangle is equivalent (within a small margin of error) to the given bounds. The margin of error can be overridden by setting `maxMargin` to a small number.
        equals: function(t, e) {
          return t ? (t = pt(t), this._southWest.equals(t.getSouthWest(), e) && this._northEast.equals(t.getNorthEast(), e)) : !1;
        },
        // @method isValid(): Boolean
        // Returns `true` if the bounds are properly initialized.
        isValid: function() {
          return !!(this._southWest && this._northEast);
        }
      };
      function pt(t, e) {
        return t instanceof Tt ? t : new Tt(t, e);
      }
      function Q(t, e, i) {
        if (isNaN(t) || isNaN(e))
          throw new Error("Invalid LatLng object: (" + t + ", " + e + ")");
        this.lat = +t, this.lng = +e, i !== void 0 && (this.alt = +i);
      }
      Q.prototype = {
        // @method equals(otherLatLng: LatLng, maxMargin?: Number): Boolean
        // Returns `true` if the given `LatLng` point is at the same position (within a small margin of error). The margin of error can be overridden by setting `maxMargin` to a small number.
        equals: function(t, e) {
          if (!t)
            return !1;
          t = F(t);
          var i = Math.max(
            Math.abs(this.lat - t.lat),
            Math.abs(this.lng - t.lng)
          );
          return i <= (e === void 0 ? 1e-9 : e);
        },
        // @method toString(): String
        // Returns a string representation of the point (for debugging purposes).
        toString: function(t) {
          return "LatLng(" + gt(this.lat, t) + ", " + gt(this.lng, t) + ")";
        },
        // @method distanceTo(otherLatLng: LatLng): Number
        // Returns the distance (in meters) to the given `LatLng` calculated using the [Spherical Law of Cosines](https://en.wikipedia.org/wiki/Spherical_law_of_cosines).
        distanceTo: function(t) {
          return ie.distance(this, F(t));
        },
        // @method wrap(): LatLng
        // Returns a new `LatLng` object with the longitude wrapped so it's always between -180 and +180 degrees.
        wrap: function() {
          return ie.wrapLatLng(this);
        },
        // @method toBounds(sizeInMeters: Number): LatLngBounds
        // Returns a new `LatLngBounds` object in which each boundary is `sizeInMeters/2` meters apart from the `LatLng`.
        toBounds: function(t) {
          var e = 180 * t / 40075017, i = e / Math.cos(Math.PI / 180 * this.lat);
          return pt(
            [this.lat - e, this.lng - i],
            [this.lat + e, this.lng + i]
          );
        },
        clone: function() {
          return new Q(this.lat, this.lng, this.alt);
        }
      };
      function F(t, e, i) {
        return t instanceof Q ? t : yt(t) && typeof t[0] != "object" ? t.length === 3 ? new Q(t[0], t[1], t[2]) : t.length === 2 ? new Q(t[0], t[1]) : null : t == null ? t : typeof t == "object" && "lat" in t ? new Q(t.lat, "lng" in t ? t.lng : t.lon, t.alt) : e === void 0 ? null : new Q(t, e, i);
      }
      var Gt = {
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
          var e = this.projection.bounds, i = this.scale(t), n = this.transformation.transform(e.min, i), a = this.transformation.transform(e.max, i);
          return new A(n, a);
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
          return new Q(i, e, n);
        },
        // @method wrapLatLngBounds(bounds: LatLngBounds): LatLngBounds
        // Returns a `LatLngBounds` with the same size as the given one, ensuring
        // that its center is within the CRS's bounds.
        // Only accepts actual `L.LatLngBounds` instances, not arrays.
        wrapLatLngBounds: function(t) {
          var e = t.getCenter(), i = this.wrapLatLng(e), n = e.lat - i.lat, a = e.lng - i.lng;
          if (n === 0 && a === 0)
            return t;
          var r = t.getSouthWest(), u = t.getNorthEast(), h = new Q(r.lat - n, r.lng - a), d = new Q(u.lat - n, u.lng - a);
          return new Tt(h, d);
        }
      }, ie = q({}, Gt, {
        wrapLng: [-180, 180],
        // Mean Earth Radius, as recommended for use by
        // the International Union of Geodesy and Geophysics,
        // see https://rosettacode.org/wiki/Haversine_formula
        R: 6371e3,
        // distance between two geographical points using spherical law of cosines approximation
        distance: function(t, e) {
          var i = Math.PI / 180, n = t.lat * i, a = e.lat * i, r = Math.sin((e.lat - t.lat) * i / 2), u = Math.sin((e.lng - t.lng) * i / 2), h = r * r + Math.cos(n) * Math.cos(a) * u * u, d = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
          return this.R * d;
        }
      }), ui = 6378137, hi = {
        R: ui,
        MAX_LATITUDE: 85.0511287798,
        project: function(t) {
          var e = Math.PI / 180, i = this.MAX_LATITUDE, n = Math.max(Math.min(i, t.lat), -i), a = Math.sin(n * e);
          return new S(
            this.R * t.lng * e,
            this.R * Math.log((1 + a) / (1 - a)) / 2
          );
        },
        unproject: function(t) {
          var e = 180 / Math.PI;
          return new Q(
            (2 * Math.atan(Math.exp(t.y / this.R)) - Math.PI / 2) * e,
            t.x * e / this.R
          );
        },
        bounds: (function() {
          var t = ui * Math.PI;
          return new A([-t, -t], [t, t]);
        })()
      };
      function di(t, e, i, n) {
        if (yt(t)) {
          this._a = t[0], this._b = t[1], this._c = t[2], this._d = t[3];
          return;
        }
        this._a = t, this._b = e, this._c = i, this._d = n;
      }
      di.prototype = {
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
          return e = e || 1, new S(
            (t.x / e - this._b) / this._a,
            (t.y / e - this._d) / this._c
          );
        }
      };
      function Se(t, e, i, n) {
        return new di(t, e, i, n);
      }
      var _t = q({}, ie, {
        code: "EPSG:3857",
        projection: hi,
        transformation: (function() {
          var t = 0.5 / (Math.PI * hi.R);
          return Se(t, 0.5, -t, 0.5);
        })()
      }), qe = q({}, _t, {
        code: "EPSG:900913"
      });
      function $e(t) {
        return document.createElementNS("http://www.w3.org/2000/svg", t);
      }
      function ci(t, e) {
        var i = "", n, a, r, u, h, d;
        for (n = 0, r = t.length; n < r; n++) {
          for (h = t[n], a = 0, u = h.length; a < u; a++)
            d = h[a], i += (a ? "L" : "M") + d.x + " " + d.y;
          i += e ? k.svg ? "z" : "x" : "";
        }
        return i || "M0 0";
      }
      var Ke = document.documentElement.style, be = "ActiveXObject" in window, v = be && !document.addEventListener, Me = "msLaunchUri" in navigator && !("documentMode" in document), fi = Ut("webkit"), ze = Ut("android"), Ee = Ut("android 2") || Ut("android 3"), Je = parseInt(/WebKit\/([0-9]+)|$/.exec(navigator.userAgent)[1], 10), Ye = ze && Ut("Google") && Je < 537 && !("AudioNode" in window), we = !!window.opera, Oe = !Me && Ut("chrome"), Ze = Ut("gecko") && !fi && !we && !be, Xe = !Oe && Ut("safari"), Bt = Ut("phantom"), Ie = "OTransition" in Ke, nn = navigator.platform.indexOf("Win") === 0, Vt = be && "transition" in Ke, D = "WebKitCSSMatrix" in window && "m11" in new window.WebKitCSSMatrix() && !Ee, ki = "MozPerspective" in Ke, on = !window.L_DISABLE_3D && (Vt || D || ki) && !Ie && !Bt, Ae = typeof orientation < "u" || Ut("mobile"), Ci = Ae && fi, sn = Ae && D, Ct = !window.PointerEvent && window.MSPointerEvent, Be = !!(window.PointerEvent || Ct), xe = "ontouchstart" in window || !!window.TouchEvent, at = !window.L_NO_TOUCH && (xe || Be), E = Ae && we, pi = Ae && Ze, Si = (window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI) > 1, Mi = (function() {
        var t = !1;
        try {
          var e = Object.defineProperty({}, "passive", {
            get: function() {
              t = !0;
            }
          });
          window.addEventListener("testPassiveEventSupport", nt, e), window.removeEventListener("testPassiveEventSupport", nt, e);
        } catch {
        }
        return t;
      })(), Ne = (function() {
        return !!document.createElement("canvas").getContext;
      })(), ne = !!(document.createElementNS && $e("svg").createSVGRect), Le = !!ne && (function() {
        var t = document.createElement("div");
        return t.innerHTML = "<svg/>", (t.firstChild && t.firstChild.namespaceURI) === "http://www.w3.org/2000/svg";
      })(), _i = !ne && (function() {
        try {
          var t = document.createElement("div");
          t.innerHTML = '<v:shape adj="1"/>';
          var e = t.firstChild;
          return e.style.behavior = "url(#default#VML)", e && typeof e.adj == "object";
        } catch {
          return !1;
        }
      })(), oe = navigator.platform.indexOf("Mac") === 0, an = navigator.platform.indexOf("Linux") === 0;
      function Ut(t) {
        return navigator.userAgent.toLowerCase().indexOf(t) >= 0;
      }
      var k = {
        ie: be,
        ielt9: v,
        edge: Me,
        webkit: fi,
        android: ze,
        android23: Ee,
        androidStock: Ye,
        opera: we,
        chrome: Oe,
        gecko: Ze,
        safari: Xe,
        phantom: Bt,
        opera12: Ie,
        win: nn,
        ie3d: Vt,
        webkit3d: D,
        gecko3d: ki,
        any3d: on,
        mobile: Ae,
        mobileWebkit: Ci,
        mobileWebkit3d: sn,
        msPointer: Ct,
        pointer: Be,
        touch: at,
        touchNative: xe,
        mobileOpera: E,
        mobileGecko: pi,
        retina: Si,
        passiveEvents: Mi,
        canvas: Ne,
        svg: ne,
        vml: _i,
        inlineSvg: Le,
        mac: oe,
        linux: an
      }, St = k.msPointer ? "MSPointerDown" : "pointerdown", Nt = k.msPointer ? "MSPointerMove" : "pointermove", zi = k.msPointer ? "MSPointerUp" : "pointerup", Ei = k.msPointer ? "MSPointerCancel" : "pointercancel", Qe = {
        touchstart: St,
        touchmove: Nt,
        touchend: zi,
        touchcancel: Ei
      }, Oi = {
        touchstart: hn,
        touchmove: fe,
        touchend: fe,
        touchcancel: fe
      }, se = {}, Zi = !1;
      function ti(t, e, i) {
        return e === "touchstart" && ei(), Oi[e] ? (i = Oi[e].bind(this, i), t.addEventListener(Qe[e], i, !1), i) : (console.warn("wrong event specified:", e), nt);
      }
      function rn(t, e, i) {
        if (!Qe[e]) {
          console.warn("wrong event specified:", e);
          return;
        }
        t.removeEventListener(Qe[e], i, !1);
      }
      function ln(t) {
        se[t.pointerId] = t;
      }
      function un(t) {
        se[t.pointerId] && (se[t.pointerId] = t);
      }
      function Ii(t) {
        delete se[t.pointerId];
      }
      function ei() {
        Zi || (document.addEventListener(St, ln, !0), document.addEventListener(Nt, un, !0), document.addEventListener(zi, Ii, !0), document.addEventListener(Ei, Ii, !0), Zi = !0);
      }
      function fe(t, e) {
        if (e.pointerType !== (e.MSPOINTER_TYPE_MOUSE || "mouse")) {
          e.touches = [];
          for (var i in se)
            e.touches.push(se[i]);
          e.changedTouches = [e], t(e);
        }
      }
      function hn(t, e) {
        e.MSPOINTER_TYPE_TOUCH && e.pointerType === e.MSPOINTER_TYPE_TOUCH && Mt(e), fe(t, e);
      }
      function Y(t) {
        var e = {}, i, n;
        for (n in t)
          i = t[n], e[n] = i && i.bind ? i.bind(t) : i;
        return t = e, e.type = "dblclick", e.detail = 2, e.isTrusted = !1, e._simulated = !0, e;
      }
      var mi = 200;
      function Ai(t, e) {
        t.addEventListener("dblclick", e);
        var i = 0, n;
        function a(r) {
          if (r.detail !== 1) {
            n = r.detail;
            return;
          }
          if (!(r.pointerType === "mouse" || r.sourceCapabilities && !r.sourceCapabilities.firesTouchEvents)) {
            var u = In(r);
            if (!(u.some(function(d) {
              return d instanceof HTMLLabelElement && d.attributes.for;
            }) && !u.some(function(d) {
              return d instanceof HTMLInputElement || d instanceof HTMLSelectElement;
            }))) {
              var h = Date.now();
              h - i <= mi ? (n++, n === 2 && e(Y(r))) : n = 1, i = h;
            }
          }
        }
        return t.addEventListener("click", a), {
          dblclick: e,
          simDblclick: a
        };
      }
      function Bi(t, e) {
        t.removeEventListener("dblclick", e.dblclick), t.removeEventListener("click", e.simDblclick);
      }
      var g = De(
        ["transform", "webkitTransform", "OTransform", "MozTransform", "msTransform"]
      ), ae = De(
        ["webkitTransition", "transition", "OTransition", "MozTransition", "msTransition"]
      ), Ni = ae === "webkitTransition" || ae === "OTransition" ? ae + "End" : "transitionend";
      function Ri(t) {
        return typeof t == "string" ? document.getElementById(t) : t;
      }
      function Re(t, e) {
        var i = t.style[e] || t.currentStyle && t.currentStyle[e];
        if ((!i || i === "auto") && document.defaultView) {
          var n = document.defaultView.getComputedStyle(t, null);
          i = n ? n[e] : null;
        }
        return i === "auto" ? null : i;
      }
      function $(t, e, i) {
        var n = document.createElement(t);
        return n.className = e || "", i && i.appendChild(n), n;
      }
      function rt(t) {
        var e = t.parentNode;
        e && e.removeChild(t);
      }
      function ii(t) {
        for (; t.firstChild; )
          t.removeChild(t.firstChild);
      }
      function Pe(t) {
        var e = t.parentNode;
        e && e.lastChild !== t && e.appendChild(t);
      }
      function c(t) {
        var e = t.parentNode;
        e && e.firstChild !== t && e.insertBefore(t, e.firstChild);
      }
      function o(t, e) {
        if (t.classList !== void 0)
          return t.classList.contains(e);
        var i = V(t);
        return i.length > 0 && new RegExp("(^|\\s)" + e + "(\\s|$)").test(i);
      }
      function l(t, e) {
        if (t.classList !== void 0)
          for (var i = ht(e), n = 0, a = i.length; n < a; n++)
            t.classList.add(i[n]);
        else if (!o(t, e)) {
          var r = V(t);
          C(t, (r ? r + " " : "") + e);
        }
      }
      function w(t, e) {
        t.classList !== void 0 ? t.classList.remove(e) : C(t, Pt((" " + V(t) + " ").replace(" " + e + " ", " ")));
      }
      function C(t, e) {
        t.className.baseVal === void 0 ? t.className = e : t.className.baseVal = e;
      }
      function V(t) {
        return t.correspondingElement && (t = t.correspondingElement), t.className.baseVal === void 0 ? t.className : t.className.baseVal;
      }
      function N(t, e) {
        "opacity" in t.style ? t.style.opacity = e : "filter" in t.style && Ot(t, e);
      }
      function Ot(t, e) {
        var i = !1, n = "DXImageTransform.Microsoft.Alpha";
        try {
          i = t.filters.item(n);
        } catch {
          if (e === 1)
            return;
        }
        e = Math.round(e * 100), i ? (i.Enabled = e !== 100, i.Opacity = e) : t.style.filter += " progid:" + n + "(opacity=" + e + ")";
      }
      function De(t) {
        for (var e = document.documentElement.style, i = 0; i < t.length; i++)
          if (t[i] in e)
            return t[i];
        return !1;
      }
      function re(t, e, i) {
        var n = e || new S(0, 0);
        t.style[g] = (k.ie3d ? "translate(" + n.x + "px," + n.y + "px)" : "translate3d(" + n.x + "px," + n.y + "px,0)") + (i ? " scale(" + i + ")" : "");
      }
      function ct(t, e) {
        t._leaflet_pos = e, k.any3d ? re(t, e) : (t.style.left = e.x + "px", t.style.top = e.y + "px");
      }
      function p(t) {
        return t._leaflet_pos || new S(0, 0);
      }
      var j, et, mt;
      if ("onselectstart" in document)
        j = function() {
          B(window, "selectstart", Mt);
        }, et = function() {
          ot(window, "selectstart", Mt);
        };
      else {
        var lt = De(
          ["userSelect", "WebkitUserSelect", "OUserSelect", "MozUserSelect", "msUserSelect"]
        );
        j = function() {
          if (lt) {
            var t = document.documentElement.style;
            mt = t[lt], t[lt] = "none";
          }
        }, et = function() {
          lt && (document.documentElement.style[lt] = mt, mt = void 0);
        };
      }
      function ft() {
        B(window, "dragstart", Mt);
      }
      function dn() {
        ot(window, "dragstart", Mt);
      }
      var Di, cn;
      function fn(t) {
        for (; t.tabIndex === -1; )
          t = t.parentNode;
        t.style && (Vi(), Di = t, cn = t.style.outlineStyle, t.style.outlineStyle = "none", B(window, "keydown", Vi));
      }
      function Vi() {
        Di && (Di.style.outlineStyle = cn, Di = void 0, cn = void 0, ot(window, "keydown", Vi));
      }
      function On(t) {
        do
          t = t.parentNode;
        while ((!t.offsetWidth || !t.offsetHeight) && t !== document.body);
        return t;
      }
      function pn(t) {
        var e = t.getBoundingClientRect();
        return {
          x: e.width / t.offsetWidth || 1,
          y: e.height / t.offsetHeight || 1,
          boundingClientRect: e
        };
      }
      var Lo = {
        __proto__: null,
        TRANSFORM: g,
        TRANSITION: ae,
        TRANSITION_END: Ni,
        get: Ri,
        getStyle: Re,
        create: $,
        remove: rt,
        empty: ii,
        toFront: Pe,
        toBack: c,
        hasClass: o,
        addClass: l,
        removeClass: w,
        setClass: C,
        getClass: V,
        setOpacity: N,
        testProp: De,
        setTransform: re,
        setPosition: ct,
        getPosition: p,
        get disableTextSelection() {
          return j;
        },
        get enableTextSelection() {
          return et;
        },
        disableImageDrag: ft,
        enableImageDrag: dn,
        preventOutline: fn,
        restoreOutline: Vi,
        getSizedParentNode: On,
        getScale: pn
      };
      function B(t, e, i, n) {
        if (e && typeof e == "object")
          for (var a in e)
            mn(t, a, e[a], i);
        else {
          e = ht(e);
          for (var r = 0, u = e.length; r < u; r++)
            mn(t, e[r], i, n);
        }
        return this;
      }
      var le = "_leaflet_events";
      function ot(t, e, i, n) {
        if (arguments.length === 1)
          Zn(t), delete t[le];
        else if (e && typeof e == "object")
          for (var a in e)
            vn(t, a, e[a], i);
        else if (e = ht(e), arguments.length === 2)
          Zn(t, function(h) {
            return de(e, h) !== -1;
          });
        else
          for (var r = 0, u = e.length; r < u; r++)
            vn(t, e[r], i, n);
        return this;
      }
      function Zn(t, e) {
        for (var i in t[le]) {
          var n = i.split(/\d/)[0];
          (!e || e(n)) && vn(t, n, null, null, i);
        }
      }
      var _n = {
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        wheel: !("onwheel" in window) && "mousewheel"
      };
      function mn(t, e, i, n) {
        var a = e + R(i) + (n ? "_" + R(n) : "");
        if (t[le] && t[le][a])
          return this;
        var r = function(h) {
          return i.call(n || t, h || window.event);
        }, u = r;
        !k.touchNative && k.pointer && e.indexOf("touch") === 0 ? r = ti(t, e, r) : k.touch && e === "dblclick" ? r = Ai(t, r) : "addEventListener" in t ? e === "touchstart" || e === "touchmove" || e === "wheel" || e === "mousewheel" ? t.addEventListener(_n[e] || e, r, k.passiveEvents ? { passive: !1 } : !1) : e === "mouseenter" || e === "mouseleave" ? (r = function(h) {
          h = h || window.event, yn(t, h) && u(h);
        }, t.addEventListener(_n[e], r, !1)) : t.addEventListener(e, u, !1) : t.attachEvent("on" + e, r), t[le] = t[le] || {}, t[le][a] = r;
      }
      function vn(t, e, i, n, a) {
        a = a || e + R(i) + (n ? "_" + R(n) : "");
        var r = t[le] && t[le][a];
        if (!r)
          return this;
        !k.touchNative && k.pointer && e.indexOf("touch") === 0 ? rn(t, e, r) : k.touch && e === "dblclick" ? Bi(t, r) : "removeEventListener" in t ? t.removeEventListener(_n[e] || e, r, !1) : t.detachEvent("on" + e, r), t[le][a] = null;
      }
      function Ve(t) {
        return t.stopPropagation ? t.stopPropagation() : t.originalEvent ? t.originalEvent._stopped = !0 : t.cancelBubble = !0, this;
      }
      function gn(t) {
        return mn(t, "wheel", Ve), this;
      }
      function vi(t) {
        return B(t, "mousedown touchstart dblclick contextmenu", Ve), t._leaflet_disable_click = !0, this;
      }
      function Mt(t) {
        return t.preventDefault ? t.preventDefault() : t.returnValue = !1, this;
      }
      function Ue(t) {
        return Mt(t), Ve(t), this;
      }
      function In(t) {
        if (t.composedPath)
          return t.composedPath();
        for (var e = [], i = t.target; i; )
          e.push(i), i = i.parentNode;
        return e;
      }
      function An(t, e) {
        if (!e)
          return new S(t.clientX, t.clientY);
        var i = pn(e), n = i.boundingClientRect;
        return new S(
          // offset.left/top values are in page scale (like clientX/Y),
          // whereas clientLeft/Top (border width) values are the original values (before CSS scale applies).
          (t.clientX - n.left) / i.x - e.clientLeft,
          (t.clientY - n.top) / i.y - e.clientTop
        );
      }
      var Po = k.linux && k.chrome ? window.devicePixelRatio : k.mac ? window.devicePixelRatio * 3 : window.devicePixelRatio > 0 ? 2 * window.devicePixelRatio : 1;
      function Bn(t) {
        return k.edge ? t.wheelDeltaY / 2 : (
          // Don't trust window-geometry-based delta
          t.deltaY && t.deltaMode === 0 ? -t.deltaY / Po : (
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
      function yn(t, e) {
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
      var To = {
        __proto__: null,
        on: B,
        off: ot,
        stopPropagation: Ve,
        disableScrollPropagation: gn,
        disableClickPropagation: vi,
        preventDefault: Mt,
        stop: Ue,
        getPropagationPath: In,
        getMousePosition: An,
        getWheelDelta: Bn,
        isExternalTarget: yn,
        addListener: B,
        removeListener: ot
      }, Nn = Wt.extend({
        // @method run(el: HTMLElement, newPos: Point, duration?: Number, easeLinearity?: Number)
        // Run an animation of a given element to a new position, optionally setting
        // duration in seconds (`0.25` by default) and easing linearity factor (3rd
        // argument of the [cubic bezier curve](https://cubic-bezier.com/#0,0,.5,1),
        // `0.5` by default).
        run: function(t, e, i, n) {
          this.stop(), this._el = t, this._inProgress = !0, this._duration = i || 0.25, this._easeOutPower = 1 / Math.max(n || 0.5, 0.2), this._startPos = p(t), this._offset = e.subtract(this._startPos), this._startTime = +/* @__PURE__ */ new Date(), this.fire("start"), this._animate();
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
          e && i._round(), ct(this._el, i), this.fire("step");
        },
        _complete: function() {
          W(this._animId), this._inProgress = !1, this.fire("end");
        },
        _easeOut: function(t) {
          return 1 - Math.pow(1 - t, this._easeOutPower);
        }
      }), K = Wt.extend({
        options: {
          // @section Map State Options
          // @option crs: CRS = L.CRS.EPSG3857
          // The [Coordinate Reference System](#crs) to use. Don't change this if you're not
          // sure what it means.
          crs: _t,
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
          e = tt(this, e), this._handlers = [], this._layers = {}, this._zoomBoundLayers = {}, this._sizeChanged = !0, this._initContainer(t), this._initLayout(), this._onResize = H(this._onResize, this), this._initEvents(), e.maxBounds && this.setMaxBounds(e.maxBounds), e.zoom !== void 0 && (this._zoom = this._limitZoom(e.zoom)), e.center && e.zoom !== void 0 && this.setView(F(e.center), e.zoom, { reset: !0 }), this.callInitHooks(), this._zoomAnimated = ae && k.any3d && !k.mobileOpera && this.options.zoomAnimation, this._zoomAnimated && (this._createAnimProxy(), B(this._proxy, Ni, this._catchTransitionEnd, this)), this._addLayers(this.options.layers);
        },
        // @section Methods for modifying map state
        // @method setView(center: LatLng, zoom: Number, options?: Zoom/pan options): this
        // Sets the view of the map (geographical center and zoom) with the given
        // animation options.
        setView: function(t, e, i) {
          if (e = e === void 0 ? this._zoom : this._limitZoom(e), t = this._limitCenter(F(t), e, this.options.maxBounds), i = i || {}, this._stop(), this._loaded && !i.reset && i !== !0) {
            i.animate !== void 0 && (i.zoom = q({ animate: i.animate }, i.zoom), i.pan = q({ animate: i.animate, duration: i.duration }, i.pan));
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
          return t = t || (k.any3d ? this.options.zoomDelta : 1), this.setZoom(this._zoom + t, e);
        },
        // @method zoomOut(delta?: Number, options?: Zoom options): this
        // Decreases the zoom of the map by `delta` ([`zoomDelta`](#map-zoomdelta) by default).
        zoomOut: function(t, e) {
          return t = t || (k.any3d ? this.options.zoomDelta : 1), this.setZoom(this._zoom - t, e);
        },
        // @method setZoomAround(latlng: LatLng, zoom: Number, options: Zoom options): this
        // Zooms the map while keeping a specified geographical point on the map
        // stationary (e.g. used internally for scroll zoom and double-click zoom).
        // @alternative
        // @method setZoomAround(offset: Point, zoom: Number, options: Zoom options): this
        // Zooms the map while keeping a specified pixel on the map (relative to the top-left corner) stationary.
        setZoomAround: function(t, e, i) {
          var n = this.getZoomScale(e), a = this.getSize().divideBy(2), r = t instanceof S ? t : this.latLngToContainerPoint(t), u = r.subtract(a).multiplyBy(1 - 1 / n), h = this.containerPointToLatLng(a.add(u));
          return this.setView(h, e, { zoom: i });
        },
        _getBoundsCenterZoom: function(t, e) {
          e = e || {}, t = t.getBounds ? t.getBounds() : pt(t);
          var i = I(e.paddingTopLeft || e.padding || [0, 0]), n = I(e.paddingBottomRight || e.padding || [0, 0]), a = this.getBoundsZoom(t, !1, i.add(n));
          if (a = typeof e.maxZoom == "number" ? Math.min(e.maxZoom, a) : a, a === 1 / 0)
            return {
              center: t.getCenter(),
              zoom: a
            };
          var r = n.subtract(i).divideBy(2), u = this.project(t.getSouthWest(), a), h = this.project(t.getNorthEast(), a), d = this.unproject(u.add(h).divideBy(2).add(r), a);
          return {
            center: d,
            zoom: a
          };
        },
        // @method fitBounds(bounds: LatLngBounds, options?: fitBounds options): this
        // Sets a map view that contains the given geographical bounds with the
        // maximum zoom level possible.
        fitBounds: function(t, e) {
          if (t = pt(t), !t.isValid())
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
          if (this._panAnim || (this._panAnim = new Nn(), this._panAnim.on({
            step: this._onPanTransitionStep,
            end: this._onPanTransitionEnd
          }, this)), e.noMoveStart || this.fire("movestart"), e.animate !== !1) {
            l(this._mapPane, "leaflet-pan-anim");
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
          if (i = i || {}, i.animate === !1 || !k.any3d)
            return this.setView(t, e, i);
          this._stop();
          var n = this.project(this.getCenter()), a = this.project(t), r = this.getSize(), u = this._zoom;
          t = F(t), e = e === void 0 ? u : e;
          var h = Math.max(r.x, r.y), d = h * this.getZoomScale(u, e), _ = a.distanceTo(n) || 1, x = 1.42, O = x * x;
          function U(bt) {
            var Xi = bt ? -1 : 1, fs = bt ? d : h, ps = d * d - h * h + Xi * O * O * _ * _, _s = 2 * fs * O * _, zn = ps / _s, go = Math.sqrt(zn * zn + 1) - zn, ms = go < 1e-9 ? -18 : Math.log(go);
            return ms;
          }
          function Zt(bt) {
            return (Math.exp(bt) - Math.exp(-bt)) / 2;
          }
          function kt(bt) {
            return (Math.exp(bt) + Math.exp(-bt)) / 2;
          }
          function Ht(bt) {
            return Zt(bt) / kt(bt);
          }
          var At = U(0);
          function li(bt) {
            return h * (kt(At) / kt(At + x * bt));
          }
          function us(bt) {
            return h * (kt(At) * Ht(At + x * bt) - Zt(At)) / O;
          }
          function hs(bt) {
            return 1 - Math.pow(1 - bt, 1.5);
          }
          var ds = Date.now(), mo = (U(1) - At) / x, cs = i.duration ? 1e3 * i.duration : 1e3 * mo * 0.8;
          function vo() {
            var bt = (Date.now() - ds) / cs, Xi = hs(bt) * mo;
            bt <= 1 ? (this._flyToFrame = z(vo, this), this._move(
              this.unproject(n.add(a.subtract(n).multiplyBy(us(Xi) / _)), u),
              this.getScaleZoom(h / li(Xi), u),
              { flyTo: !0 }
            )) : this._move(t, e)._moveEnd(!0);
          }
          return this._moveStart(!0, i.noMoveStart), vo.call(this), this;
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
          return t = pt(t), this.listens("moveend", this._panInsideMaxBounds) && this.off("moveend", this._panInsideMaxBounds), t.isValid() ? (this.options.maxBounds = t, this._loaded && this._panInsideMaxBounds(), this.on("moveend", this._panInsideMaxBounds)) : (this.options.maxBounds = null, this);
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
          var i = this.getCenter(), n = this._limitCenter(i, this._zoom, pt(t));
          return i.equals(n) || this.panTo(n, e), this._enforcingBounds = !1, this;
        },
        // @method panInside(latlng: LatLng, options?: padding options): this
        // Pans the map the minimum amount to make the `latlng` visible. Use
        // padding options to fit the display to more restricted bounds.
        // If `latlng` is already within the (optionally padded) display bounds,
        // the map will not be panned.
        panInside: function(t, e) {
          e = e || {};
          var i = I(e.paddingTopLeft || e.padding || [0, 0]), n = I(e.paddingBottomRight || e.padding || [0, 0]), a = this.project(this.getCenter()), r = this.project(t), u = this.getPixelBounds(), h = dt([u.min.add(i), u.max.subtract(n)]), d = h.getSize();
          if (!h.contains(r)) {
            this._enforcingBounds = !0;
            var _ = r.subtract(h.getCenter()), x = h.extend(r).getSize().subtract(d);
            a.x += _.x < 0 ? -x.x : x.x, a.y += _.y < 0 ? -x.y : x.y, this.panTo(this.unproject(a), e), this._enforcingBounds = !1;
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
          t = q({
            animate: !1,
            pan: !0
          }, t === !0 ? { animate: !0 } : t);
          var e = this.getSize();
          this._sizeChanged = !0, this._lastCenter = null;
          var i = this.getSize(), n = e.divideBy(2).round(), a = i.divideBy(2).round(), r = n.subtract(a);
          return !r.x && !r.y ? this : (t.animate && t.pan ? this.panBy(r) : (t.pan && this._rawPanBy(r), this.fire("move"), t.debounceMoveend ? (clearTimeout(this._sizeTimer), this._sizeTimer = setTimeout(H(this.fire, this, "moveend"), 200)) : this.fire("moveend")), this.fire("resize", {
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
          if (t = this._locateOptions = q({
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
          var e = H(this._handleGeolocationResponse, this), i = H(this._handleGeolocationError, this);
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
            var e = t.coords.latitude, i = t.coords.longitude, n = new Q(e, i), a = n.toBounds(t.coords.accuracy * 2), r = this._locateOptions;
            if (r.setView) {
              var u = this.getBoundsZoom(a);
              this.setView(n, r.maxZoom ? Math.min(u, r.maxZoom) : u);
            }
            var h = {
              latlng: n,
              bounds: a,
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
          this._locationWatchId !== void 0 && this.stopLocate(), this._stop(), rt(this._mapPane), this._clearControlPos && this._clearControlPos(), this._resizeRequest && (W(this._resizeRequest), this._resizeRequest = null), this._clearHandlers(), this._loaded && this.fire("unload");
          var t;
          for (t in this._layers)
            this._layers[t].remove();
          for (t in this._panes)
            rt(this._panes[t]);
          return this._layers = [], this._panes = [], delete this._mapPane, delete this._renderer, this;
        },
        // @section Other Methods
        // @method createPane(name: String, container?: HTMLElement): HTMLElement
        // Creates a new [map pane](#map-pane) with the given name if it doesn't exist already,
        // then returns it. The pane is created as a child of `container`, or
        // as a child of the main map pane if not set.
        createPane: function(t, e) {
          var i = "leaflet-pane" + (t ? " leaflet-" + t.replace("Pane", "") + "-pane" : ""), n = $("div", i, e || this._mapPane);
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
          return new Tt(e, i);
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
          t = pt(t), i = I(i || [0, 0]);
          var n = this.getZoom() || 0, a = this.getMinZoom(), r = this.getMaxZoom(), u = t.getNorthWest(), h = t.getSouthEast(), d = this.getSize().subtract(i), _ = dt(this.project(h, n), this.project(u, n)).getSize(), x = k.any3d ? this.options.zoomSnap : 1, O = d.x / _.x, U = d.y / _.y, Zt = e ? Math.max(O, U) : Math.min(O, U);
          return n = this.getScaleZoom(Zt, n), x && (n = Math.round(n / (x / 100)) * (x / 100), n = e ? Math.ceil(n / x) * x : Math.floor(n / x) * x), Math.max(a, Math.min(r, n));
        },
        // @method getSize(): Point
        // Returns the current size of the map container (in pixels).
        getSize: function() {
          return (!this._size || this._sizeChanged) && (this._size = new S(
            this._container.clientWidth || 0,
            this._container.clientHeight || 0
          ), this._sizeChanged = !1), this._size.clone();
        },
        // @method getPixelBounds(): Bounds
        // Returns the bounds of the current map view in projected pixel
        // coordinates (sometimes useful in layer and overlay implementations).
        getPixelBounds: function(t, e) {
          var i = this._getTopLeftPoint(t, e);
          return new A(i, i.add(this.getSize()));
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
          return e = e === void 0 ? this._zoom : e, this.options.crs.latLngToPoint(F(t), e);
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
          var e = this.project(F(t))._round();
          return e._subtract(this.getPixelOrigin());
        },
        // @method wrapLatLng(latlng: LatLng): LatLng
        // Returns a `LatLng` where `lat` and `lng` has been wrapped according to the
        // map's CRS's `wrapLat` and `wrapLng` properties, if they are outside the
        // CRS's bounds.
        // By default this means longitude is wrapped around the dateline so its
        // value is between -180 and +180 degrees.
        wrapLatLng: function(t) {
          return this.options.crs.wrapLatLng(F(t));
        },
        // @method wrapLatLngBounds(bounds: LatLngBounds): LatLngBounds
        // Returns a `LatLngBounds` with the same size as the given one, ensuring that
        // its center is within the CRS's bounds.
        // By default this means the center longitude is wrapped around the dateline so its
        // value is between -180 and +180 degrees, and the majority of the bounds
        // overlaps the CRS's bounds.
        wrapLatLngBounds: function(t) {
          return this.options.crs.wrapLatLngBounds(pt(t));
        },
        // @method distance(latlng1: LatLng, latlng2: LatLng): Number
        // Returns the distance between two geographical coordinates according to
        // the map's CRS. By default this measures distance in meters.
        distance: function(t, e) {
          return this.options.crs.distance(F(t), F(e));
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
          return this.layerPointToContainerPoint(this.latLngToLayerPoint(F(t)));
        },
        // @method mouseEventToContainerPoint(ev: MouseEvent): Point
        // Given a MouseEvent object, returns the pixel coordinate relative to the
        // map container where the event took place.
        mouseEventToContainerPoint: function(t) {
          return An(t, this._container);
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
          var e = this._container = Ri(t);
          if (e) {
            if (e._leaflet_id)
              throw new Error("Map container is already initialized.");
          } else throw new Error("Map container not found.");
          B(e, "scroll", this._onScroll, this), this._containerId = R(e);
        },
        _initLayout: function() {
          var t = this._container;
          this._fadeAnimated = this.options.fadeAnimation && k.any3d, l(t, "leaflet-container" + (k.touch ? " leaflet-touch" : "") + (k.retina ? " leaflet-retina" : "") + (k.ielt9 ? " leaflet-oldie" : "") + (k.safari ? " leaflet-safari" : "") + (this._fadeAnimated ? " leaflet-fade-anim" : ""));
          var e = Re(t, "position");
          e !== "absolute" && e !== "relative" && e !== "fixed" && e !== "sticky" && (t.style.position = "relative"), this._initPanes(), this._initControlPos && this._initControlPos();
        },
        _initPanes: function() {
          var t = this._panes = {};
          this._paneRenderers = {}, this._mapPane = this.createPane("mapPane", this._container), ct(this._mapPane, new S(0, 0)), this.createPane("tilePane"), this.createPane("overlayPane"), this.createPane("shadowPane"), this.createPane("markerPane"), this.createPane("tooltipPane"), this.createPane("popupPane"), this.options.markerZoomAnimation || (l(t.markerPane, "leaflet-zoom-hide"), l(t.shadowPane, "leaflet-zoom-hide"));
        },
        // private methods that modify map state
        // @section Map state change events
        _resetView: function(t, e, i) {
          ct(this._mapPane, new S(0, 0));
          var n = !this._loaded;
          this._loaded = !0, e = this._limitZoom(e), this.fire("viewprereset");
          var a = this._zoom !== e;
          this._moveStart(a, i)._move(t, e)._moveEnd(a), this.fire("viewreset"), n && this.fire("load");
        },
        _moveStart: function(t, e) {
          return t && this.fire("zoomstart"), e || this.fire("movestart"), this;
        },
        _move: function(t, e, i, n) {
          e === void 0 && (e = this._zoom);
          var a = this._zoom !== e;
          return this._zoom = e, this._lastCenter = t, this._pixelOrigin = this._getNewPixelOrigin(t), n ? i && i.pinch && this.fire("zoom", i) : ((a || i && i.pinch) && this.fire("zoom", i), this.fire("move", i)), this;
        },
        _moveEnd: function(t) {
          return t && this.fire("zoomend"), this.fire("moveend");
        },
        _stop: function() {
          return W(this._flyToFrame), this._panAnim && this._panAnim.stop(), this;
        },
        _rawPanBy: function(t) {
          ct(this._mapPane, this._getMapPanePos().subtract(t));
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
          this._targets = {}, this._targets[R(this._container)] = this;
          var e = t ? ot : B;
          e(this._container, "click dblclick mousedown mouseup mouseover mouseout mousemove contextmenu keypress keydown keyup", this._handleDOMEvent, this), this.options.trackResize && e(window, "resize", this._onResize, this), k.any3d && this.options.transform3DLimit && (t ? this.off : this.on).call(this, "moveend", this._onMoveEnd);
        },
        _onResize: function() {
          W(this._resizeRequest), this._resizeRequest = z(
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
          for (var i = [], n, a = e === "mouseout" || e === "mouseover", r = t.target || t.srcElement, u = !1; r; ) {
            if (n = this._targets[R(r)], n && (e === "click" || e === "preclick") && this._draggableMoved(n)) {
              u = !0;
              break;
            }
            if (n && n.listens(e, !0) && (a && !yn(r, t) || (i.push(n), a)) || r === this._container)
              break;
            r = r.parentNode;
          }
          return !i.length && !u && !a && this.listens(e, !0) && (i = [this]), i;
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
            i === "mousedown" && fn(e), this._fireDOMEvent(t, i);
          }
        },
        _mouseEvents: ["click", "dblclick", "mouseover", "mouseout", "contextmenu"],
        _fireDOMEvent: function(t, e, i) {
          if (t.type === "click") {
            var n = q({}, t);
            n.type = "preclick", this._fireDOMEvent(n, n.type, i);
          }
          var a = this._findEventTargets(t, e);
          if (i) {
            for (var r = [], u = 0; u < i.length; u++)
              i[u].listens(e, !0) && r.push(i[u]);
            a = r.concat(a);
          }
          if (a.length) {
            e === "contextmenu" && Mt(t);
            var h = a[0], d = {
              originalEvent: t
            };
            if (t.type !== "keypress" && t.type !== "keydown" && t.type !== "keyup") {
              var _ = h.getLatLng && (!h._radius || h._radius <= 10);
              d.containerPoint = _ ? this.latLngToContainerPoint(h.getLatLng()) : this.mouseEventToContainerPoint(t), d.layerPoint = this.containerPointToLayerPoint(d.containerPoint), d.latlng = _ ? h.getLatLng() : this.layerPointToLatLng(d.layerPoint);
            }
            for (u = 0; u < a.length; u++)
              if (a[u].fire(e, d, !0), d.originalEvent._stopped || a[u].options.bubblingMouseEvents === !1 && de(this._mouseEvents, e) !== -1)
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
          return p(this._mapPane) || new S(0, 0);
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
          return dt([
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
          var n = this.project(t, e), a = this.getSize().divideBy(2), r = new A(n.subtract(a), n.add(a)), u = this._getBoundsOffset(r, i, e);
          return Math.abs(u.x) <= 1 && Math.abs(u.y) <= 1 ? t : this.unproject(n.add(u), e);
        },
        // adjust offset for view to get inside bounds
        _limitOffset: function(t, e) {
          if (!e)
            return t;
          var i = this.getPixelBounds(), n = new A(i.min.add(t), i.max.add(t));
          return t.add(this._getBoundsOffset(n, e));
        },
        // returns offset needed for pxBounds to get inside maxBounds at a specified zoom
        _getBoundsOffset: function(t, e, i) {
          var n = dt(
            this.project(e.getNorthEast(), i),
            this.project(e.getSouthWest(), i)
          ), a = n.min.subtract(t.min), r = n.max.subtract(t.max), u = this._rebound(a.x, -r.x), h = this._rebound(a.y, -r.y);
          return new S(u, h);
        },
        _rebound: function(t, e) {
          return t + e > 0 ? Math.round(t - e) / 2 : Math.max(0, Math.ceil(t)) - Math.max(0, Math.floor(e));
        },
        _limitZoom: function(t) {
          var e = this.getMinZoom(), i = this.getMaxZoom(), n = k.any3d ? this.options.zoomSnap : 1;
          return n && (t = Math.round(t / n) * n), Math.max(e, Math.min(i, t));
        },
        _onPanTransitionStep: function() {
          this.fire("move");
        },
        _onPanTransitionEnd: function() {
          w(this._mapPane, "leaflet-pan-anim"), this.fire("moveend");
        },
        _tryAnimatedPan: function(t, e) {
          var i = this._getCenterOffset(t)._trunc();
          return (e && e.animate) !== !0 && !this.getSize().contains(i) ? !1 : (this.panBy(i, e), !0);
        },
        _createAnimProxy: function() {
          var t = this._proxy = $("div", "leaflet-proxy leaflet-zoom-animated");
          this._panes.mapPane.appendChild(t), this.on("zoomanim", function(e) {
            var i = g, n = this._proxy.style[i];
            re(this._proxy, this.project(e.center, e.zoom), this.getZoomScale(e.zoom, 1)), n === this._proxy.style[i] && this._animatingZoom && this._onZoomTransitionEnd();
          }, this), this.on("load moveend", this._animMoveEnd, this), this._on("unload", this._destroyAnimProxy, this);
        },
        _destroyAnimProxy: function() {
          rt(this._proxy), this.off("load moveend", this._animMoveEnd, this), delete this._proxy;
        },
        _animMoveEnd: function() {
          var t = this.getCenter(), e = this.getZoom();
          re(this._proxy, this.project(t, e), this.getZoomScale(e, 1));
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
          var n = this.getZoomScale(e), a = this._getCenterOffset(t)._divideBy(1 - 1 / n);
          return i.animate !== !0 && !this.getSize().contains(a) ? !1 : (z(function() {
            this._moveStart(!0, i.noMoveStart || !1)._animateZoom(t, e, !0);
          }, this), !0);
        },
        _animateZoom: function(t, e, i, n) {
          this._mapPane && (i && (this._animatingZoom = !0, this._animateToCenter = t, this._animateToZoom = e, l(this._mapPane, "leaflet-zoom-anim")), this.fire("zoomanim", {
            center: t,
            zoom: e,
            noUpdate: n
          }), this._tempFireZoomEvent || (this._tempFireZoomEvent = this._zoom !== this._animateToZoom), this._move(this._animateToCenter, this._animateToZoom, void 0, !0), setTimeout(H(this._onZoomTransitionEnd, this), 250));
        },
        _onZoomTransitionEnd: function() {
          this._animatingZoom && (this._mapPane && w(this._mapPane, "leaflet-zoom-anim"), this._animatingZoom = !1, this._move(this._animateToCenter, this._animateToZoom, void 0, !0), this._tempFireZoomEvent && this.fire("zoom"), delete this._tempFireZoomEvent, this.fire("move"), this._moveEnd(!0));
        }
      });
      function ko(t, e) {
        return new K(t, e);
      }
      var qt = xt.extend({
        // @section
        // @aka Control Options
        options: {
          // @option position: String = 'topright'
          // The position of the control (one of the map corners). Possible values are `'topleft'`,
          // `'topright'`, `'bottomleft'` or `'bottomright'`
          position: "topright"
        },
        initialize: function(t) {
          tt(this, t);
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
          return l(e, "leaflet-control"), i.indexOf("bottom") !== -1 ? n.insertBefore(e, n.firstChild) : n.appendChild(e), this._map.on("unload", this.remove, this), this;
        },
        // @method remove: this
        // Removes the control from the map it is currently active on.
        remove: function() {
          return this._map ? (rt(this._container), this.onRemove && this.onRemove(this._map), this._map.off("unload", this.remove, this), this._map = null, this) : this;
        },
        _refocusOnMap: function(t) {
          this._map && t && t.screenX > 0 && t.screenY > 0 && this._map.getContainer().focus();
        }
      }), gi = function(t) {
        return new qt(t);
      };
      K.include({
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
          var t = this._controlCorners = {}, e = "leaflet-", i = this._controlContainer = $("div", e + "control-container", this._container);
          function n(a, r) {
            var u = e + a + " " + e + r;
            t[a + r] = $("div", u, i);
          }
          n("top", "left"), n("top", "right"), n("bottom", "left"), n("bottom", "right");
        },
        _clearControlPos: function() {
          for (var t in this._controlCorners)
            rt(this._controlCorners[t]);
          rt(this._controlContainer), delete this._controlCorners, delete this._controlContainer;
        }
      });
      var Rn = qt.extend({
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
          tt(this, i), this._layerControlInputs = [], this._layers = [], this._lastZIndex = 0, this._handlingClick = !1, this._preventClick = !1;
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
          var e = this._getLayer(R(t));
          return e && this._layers.splice(this._layers.indexOf(e), 1), this._map ? this._update() : this;
        },
        // @method expand(): this
        // Expand the control container if collapsed.
        expand: function() {
          l(this._container, "leaflet-control-layers-expanded"), this._section.style.height = null;
          var t = this._map.getSize().y - (this._container.offsetTop + 50);
          return t < this._section.clientHeight ? (l(this._section, "leaflet-control-layers-scrollbar"), this._section.style.height = t + "px") : w(this._section, "leaflet-control-layers-scrollbar"), this._checkDisabledLayers(), this;
        },
        // @method collapse(): this
        // Collapse the control container if expanded.
        collapse: function() {
          return w(this._container, "leaflet-control-layers-expanded"), this;
        },
        _initLayout: function() {
          var t = "leaflet-control-layers", e = this._container = $("div", t), i = this.options.collapsed;
          e.setAttribute("aria-haspopup", !0), vi(e), gn(e);
          var n = this._section = $("section", t + "-list");
          i && (this._map.on("click", this.collapse, this), B(e, {
            mouseenter: this._expandSafely,
            mouseleave: this.collapse
          }, this));
          var a = this._layersLink = $("a", t + "-toggle", e);
          a.href = "#", a.title = "Layers", a.setAttribute("role", "button"), B(a, {
            keydown: function(r) {
              r.keyCode === 13 && this._expandSafely();
            },
            // Certain screen readers intercept the key event and instead send a click event
            click: function(r) {
              Mt(r), this._expandSafely();
            }
          }, this), i || this.expand(), this._baseLayersList = $("div", t + "-base", n), this._separator = $("div", t + "-separator", n), this._overlaysList = $("div", t + "-overlays", n), e.appendChild(n);
        },
        _getLayer: function(t) {
          for (var e = 0; e < this._layers.length; e++)
            if (this._layers[e] && R(this._layers[e].layer) === t)
              return this._layers[e];
        },
        _addLayer: function(t, e, i) {
          this._map && t.on("add remove", this._onLayerChange, this), this._layers.push({
            layer: t,
            name: e,
            overlay: i
          }), this.options.sortLayers && this._layers.sort(H(function(n, a) {
            return this.options.sortFunction(n.layer, a.layer, n.name, a.name);
          }, this)), this.options.autoZIndex && t.setZIndex && (this._lastZIndex++, t.setZIndex(this._lastZIndex)), this._expandIfNotCollapsed();
        },
        _update: function() {
          if (!this._container)
            return this;
          ii(this._baseLayersList), ii(this._overlaysList), this._layerControlInputs = [];
          var t, e, i, n, a = 0;
          for (i = 0; i < this._layers.length; i++)
            n = this._layers[i], this._addItem(n), e = e || n.overlay, t = t || !n.overlay, a += n.overlay ? 0 : 1;
          return this.options.hideSingleBase && (t = t && a > 1, this._baseLayersList.style.display = t ? "" : "none"), this._separator.style.display = e && t ? "" : "none", this;
        },
        _onLayerChange: function(t) {
          this._handlingClick || this._update();
          var e = this._getLayer(R(t.target)), i = e.overlay ? t.type === "add" ? "overlayadd" : "overlayremove" : t.type === "add" ? "baselayerchange" : null;
          i && this._map.fire(i, e);
        },
        // IE7 bugs out if you create a radio dynamically, so you have to do it this hacky way (see https://stackoverflow.com/a/119079)
        _createRadioElement: function(t, e) {
          var i = '<input type="radio" class="leaflet-control-layers-selector" name="' + t + '"' + (e ? ' checked="checked"' : "") + "/>", n = document.createElement("div");
          return n.innerHTML = i, n.firstChild;
        },
        _addItem: function(t) {
          var e = document.createElement("label"), i = this._map.hasLayer(t.layer), n;
          t.overlay ? (n = document.createElement("input"), n.type = "checkbox", n.className = "leaflet-control-layers-selector", n.defaultChecked = i) : n = this._createRadioElement("leaflet-base-layers_" + R(this), i), this._layerControlInputs.push(n), n.layerId = R(t.layer), B(n, "click", this._onInputClick, this);
          var a = document.createElement("span");
          a.innerHTML = " " + t.name;
          var r = document.createElement("span");
          e.appendChild(r), r.appendChild(n), r.appendChild(a);
          var u = t.overlay ? this._overlaysList : this._baseLayersList;
          return u.appendChild(e), this._checkDisabledLayers(), e;
        },
        _onInputClick: function() {
          if (!this._preventClick) {
            var t = this._layerControlInputs, e, i, n = [], a = [];
            this._handlingClick = !0;
            for (var r = t.length - 1; r >= 0; r--)
              e = t[r], i = this._getLayer(e.layerId).layer, e.checked ? n.push(i) : e.checked || a.push(i);
            for (r = 0; r < a.length; r++)
              this._map.hasLayer(a[r]) && this._map.removeLayer(a[r]);
            for (r = 0; r < n.length; r++)
              this._map.hasLayer(n[r]) || this._map.addLayer(n[r]);
            this._handlingClick = !1, this._refocusOnMap();
          }
        },
        _checkDisabledLayers: function() {
          for (var t = this._layerControlInputs, e, i, n = this._map.getZoom(), a = t.length - 1; a >= 0; a--)
            e = t[a], i = this._getLayer(e.layerId).layer, e.disabled = i.options.minZoom !== void 0 && n < i.options.minZoom || i.options.maxZoom !== void 0 && n > i.options.maxZoom;
        },
        _expandIfNotCollapsed: function() {
          return this._map && !this.options.collapsed && this.expand(), this;
        },
        _expandSafely: function() {
          var t = this._section;
          this._preventClick = !0, B(t, "click", Mt), this.expand();
          var e = this;
          setTimeout(function() {
            ot(t, "click", Mt), e._preventClick = !1;
          });
        }
      }), Co = function(t, e, i) {
        return new Rn(t, e, i);
      }, bn = qt.extend({
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
          var e = "leaflet-control-zoom", i = $("div", e + " leaflet-bar"), n = this.options;
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
        _createButton: function(t, e, i, n, a) {
          var r = $("a", i, n);
          return r.innerHTML = t, r.href = "#", r.title = e, r.setAttribute("role", "button"), r.setAttribute("aria-label", e), vi(r), B(r, "click", Ue), B(r, "click", a, this), B(r, "click", this._refocusOnMap, this), r;
        },
        _updateDisabled: function() {
          var t = this._map, e = "leaflet-disabled";
          w(this._zoomInButton, e), w(this._zoomOutButton, e), this._zoomInButton.setAttribute("aria-disabled", "false"), this._zoomOutButton.setAttribute("aria-disabled", "false"), (this._disabled || t._zoom === t.getMinZoom()) && (l(this._zoomOutButton, e), this._zoomOutButton.setAttribute("aria-disabled", "true")), (this._disabled || t._zoom === t.getMaxZoom()) && (l(this._zoomInButton, e), this._zoomInButton.setAttribute("aria-disabled", "true"));
        }
      });
      K.mergeOptions({
        zoomControl: !0
      }), K.addInitHook(function() {
        this.options.zoomControl && (this.zoomControl = new bn(), this.addControl(this.zoomControl));
      });
      var So = function(t) {
        return new bn(t);
      }, Dn = qt.extend({
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
          var e = "leaflet-control-scale", i = $("div", e), n = this.options;
          return this._addScales(n, e + "-line", i), t.on(n.updateWhenIdle ? "moveend" : "move", this._update, this), t.whenReady(this._update, this), i;
        },
        onRemove: function(t) {
          t.off(this.options.updateWhenIdle ? "moveend" : "move", this._update, this);
        },
        _addScales: function(t, e, i) {
          t.metric && (this._mScale = $("div", e, i)), t.imperial && (this._iScale = $("div", e, i));
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
          var e = t * 3.2808399, i, n, a;
          e > 5280 ? (i = e / 5280, n = this._getRoundNum(i), this._updateScale(this._iScale, n + " mi", n / i)) : (a = this._getRoundNum(e), this._updateScale(this._iScale, a + " ft", a / e));
        },
        _updateScale: function(t, e, i) {
          t.style.width = Math.round(this.options.maxWidth * i) + "px", t.innerHTML = e;
        },
        _getRoundNum: function(t) {
          var e = Math.pow(10, (Math.floor(t) + "").length - 1), i = t / e;
          return i = i >= 10 ? 10 : i >= 5 ? 5 : i >= 3 ? 3 : i >= 2 ? 2 : 1, e * i;
        }
      }), Mo = function(t) {
        return new Dn(t);
      }, zo = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" class="leaflet-attribution-flag"><path fill="#4C7BE1" d="M0 0h12v4H0z"/><path fill="#FFD500" d="M0 4h12v3H0z"/><path fill="#E0BC00" d="M0 7h12v1H0z"/></svg>', wn = qt.extend({
        // @section
        // @aka Control.Attribution options
        options: {
          position: "bottomright",
          // @option prefix: String|false = 'Leaflet'
          // The HTML text shown before the attributions. Pass `false` to disable.
          prefix: '<a href="https://leafletjs.com" title="A JavaScript library for interactive maps">' + (k.inlineSvg ? zo + " " : "") + "Leaflet</a>"
        },
        initialize: function(t) {
          tt(this, t), this._attributions = {};
        },
        onAdd: function(t) {
          t.attributionControl = this, this._container = $("div", "leaflet-control-attribution"), vi(this._container);
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
      K.mergeOptions({
        attributionControl: !0
      }), K.addInitHook(function() {
        this.options.attributionControl && new wn().addTo(this);
      });
      var Eo = function(t) {
        return new wn(t);
      };
      qt.Layers = Rn, qt.Zoom = bn, qt.Scale = Dn, qt.Attribution = wn, gi.layers = Co, gi.zoom = So, gi.scale = Mo, gi.attribution = Eo;
      var ue = xt.extend({
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
      ue.addTo = function(t, e) {
        return t.addHandler(e, this), this;
      };
      var Oo = { Events: Lt }, Vn = k.touch ? "touchstart mousedown" : "mousedown", Te = Wt.extend({
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
          tt(this, n), this._element = t, this._dragStartTarget = e || t, this._preventOutline = i;
        },
        // @method enable()
        // Enables the dragging ability
        enable: function() {
          this._enabled || (B(this._dragStartTarget, Vn, this._onDown, this), this._enabled = !0);
        },
        // @method disable()
        // Disables the dragging ability
        disable: function() {
          this._enabled && (Te._dragging === this && this.finishDrag(!0), ot(this._dragStartTarget, Vn, this._onDown, this), this._enabled = !1, this._moved = !1);
        },
        _onDown: function(t) {
          if (this._enabled && (this._moved = !1, !o(this._element, "leaflet-zoom-anim"))) {
            if (t.touches && t.touches.length !== 1) {
              Te._dragging === this && this.finishDrag();
              return;
            }
            if (!(Te._dragging || t.shiftKey || t.which !== 1 && t.button !== 1 && !t.touches) && (Te._dragging = this, this._preventOutline && fn(this._element), ft(), j(), !this._moving)) {
              this.fire("down");
              var e = t.touches ? t.touches[0] : t, i = On(this._element);
              this._startPoint = new S(e.clientX, e.clientY), this._startPos = p(this._element), this._parentScale = pn(i);
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
            var e = t.touches && t.touches.length === 1 ? t.touches[0] : t, i = new S(e.clientX, e.clientY)._subtract(this._startPoint);
            !i.x && !i.y || Math.abs(i.x) + Math.abs(i.y) < this.options.clickTolerance || (i.x /= this._parentScale.x, i.y /= this._parentScale.y, Mt(t), this._moved || (this.fire("dragstart"), this._moved = !0, l(document.body, "leaflet-dragging"), this._lastTarget = t.target || t.srcElement, window.SVGElementInstance && this._lastTarget instanceof window.SVGElementInstance && (this._lastTarget = this._lastTarget.correspondingUseElement), l(this._lastTarget, "leaflet-drag-target")), this._newPos = this._startPos.add(i), this._moving = !0, this._lastEvent = t, this._updatePosition());
          }
        },
        _updatePosition: function() {
          var t = { originalEvent: this._lastEvent };
          this.fire("predrag", t), ct(this._element, this._newPos), this.fire("drag", t);
        },
        _onUp: function() {
          this._enabled && this.finishDrag();
        },
        finishDrag: function(t) {
          w(document.body, "leaflet-dragging"), this._lastTarget && (w(this._lastTarget, "leaflet-drag-target"), this._lastTarget = null), ot(document, "mousemove touchmove", this._onMove, this), ot(document, "mouseup touchend touchcancel", this._onUp, this), dn(), et();
          var e = this._moved && this._moving;
          this._moving = !1, Te._dragging = !1, e && this.fire("dragend", {
            noInertia: t,
            distance: this._newPos.distanceTo(this._startPos)
          });
        }
      });
      function Un(t, e, i) {
        var n, a = [1, 4, 2, 8], r, u, h, d, _, x, O, U;
        for (r = 0, x = t.length; r < x; r++)
          t[r]._code = Fe(t[r], e);
        for (h = 0; h < 4; h++) {
          for (O = a[h], n = [], r = 0, x = t.length, u = x - 1; r < x; u = r++)
            d = t[r], _ = t[u], d._code & O ? _._code & O || (U = Ui(_, d, O, e, i), U._code = Fe(U, e), n.push(U)) : (_._code & O && (U = Ui(_, d, O, e, i), U._code = Fe(U, e), n.push(U)), n.push(d));
          t = n;
        }
        return t;
      }
      function Fn(t, e) {
        var i, n, a, r, u, h, d, _, x;
        if (!t || t.length === 0)
          throw new Error("latlngs not passed");
        Ft(t) || (console.warn("latlngs are not flat! Only the first ring will be used"), t = t[0]);
        var O = F([0, 0]), U = pt(t), Zt = U.getNorthWest().distanceTo(U.getSouthWest()) * U.getNorthEast().distanceTo(U.getNorthWest());
        Zt < 1700 && (O = xn(t));
        var kt = t.length, Ht = [];
        for (i = 0; i < kt; i++) {
          var At = F(t[i]);
          Ht.push(e.project(F([At.lat - O.lat, At.lng - O.lng])));
        }
        for (h = d = _ = 0, i = 0, n = kt - 1; i < kt; n = i++)
          a = Ht[i], r = Ht[n], u = a.y * r.x - r.y * a.x, d += (a.x + r.x) * u, _ += (a.y + r.y) * u, h += u * 3;
        h === 0 ? x = Ht[0] : x = [d / h, _ / h];
        var li = e.unproject(I(x));
        return F([li.lat + O.lat, li.lng + O.lng]);
      }
      function xn(t) {
        for (var e = 0, i = 0, n = 0, a = 0; a < t.length; a++) {
          var r = F(t[a]);
          e += r.lat, i += r.lng, n++;
        }
        return F([e / n, i / n]);
      }
      var Zo = {
        __proto__: null,
        clipPolygon: Un,
        polygonCenter: Fn,
        centroid: xn
      };
      function Hn(t, e) {
        if (!e || !t.length)
          return t.slice();
        var i = e * e;
        return t = Bo(t, i), t = Ao(t, i), t;
      }
      function Wn(t, e, i) {
        return Math.sqrt(yi(t, e, i, !0));
      }
      function Io(t, e, i) {
        return yi(t, e, i);
      }
      function Ao(t, e) {
        var i = t.length, n = typeof Uint8Array < "u" ? Uint8Array : Array, a = new n(i);
        a[0] = a[i - 1] = 1, Ln(t, a, e, 0, i - 1);
        var r, u = [];
        for (r = 0; r < i; r++)
          a[r] && u.push(t[r]);
        return u;
      }
      function Ln(t, e, i, n, a) {
        var r = 0, u, h, d;
        for (h = n + 1; h <= a - 1; h++)
          d = yi(t[h], t[n], t[a], !0), d > r && (u = h, r = d);
        r > i && (e[u] = 1, Ln(t, e, i, n, u), Ln(t, e, i, u, a));
      }
      function Bo(t, e) {
        for (var i = [t[0]], n = 1, a = 0, r = t.length; n < r; n++)
          No(t[n], t[a]) > e && (i.push(t[n]), a = n);
        return a < r - 1 && i.push(t[r - 1]), i;
      }
      var jn;
      function Gn(t, e, i, n, a) {
        var r = n ? jn : Fe(t, i), u = Fe(e, i), h, d, _;
        for (jn = u; ; ) {
          if (!(r | u))
            return [t, e];
          if (r & u)
            return !1;
          h = r || u, d = Ui(t, e, h, i, a), _ = Fe(d, i), h === r ? (t = d, r = _) : (e = d, u = _);
        }
      }
      function Ui(t, e, i, n, a) {
        var r = e.x - t.x, u = e.y - t.y, h = n.min, d = n.max, _, x;
        return i & 8 ? (_ = t.x + r * (d.y - t.y) / u, x = d.y) : i & 4 ? (_ = t.x + r * (h.y - t.y) / u, x = h.y) : i & 2 ? (_ = d.x, x = t.y + u * (d.x - t.x) / r) : i & 1 && (_ = h.x, x = t.y + u * (h.x - t.x) / r), new S(_, x, a);
      }
      function Fe(t, e) {
        var i = 0;
        return t.x < e.min.x ? i |= 1 : t.x > e.max.x && (i |= 2), t.y < e.min.y ? i |= 4 : t.y > e.max.y && (i |= 8), i;
      }
      function No(t, e) {
        var i = e.x - t.x, n = e.y - t.y;
        return i * i + n * n;
      }
      function yi(t, e, i, n) {
        var a = e.x, r = e.y, u = i.x - a, h = i.y - r, d = u * u + h * h, _;
        return d > 0 && (_ = ((t.x - a) * u + (t.y - r) * h) / d, _ > 1 ? (a = i.x, r = i.y) : _ > 0 && (a += u * _, r += h * _)), u = t.x - a, h = t.y - r, n ? u * u + h * h : new S(a, r);
      }
      function Ft(t) {
        return !yt(t[0]) || typeof t[0][0] != "object" && typeof t[0][0] < "u";
      }
      function qn(t) {
        return console.warn("Deprecated use of _flat, please use L.LineUtil.isFlat instead."), Ft(t);
      }
      function $n(t, e) {
        var i, n, a, r, u, h, d, _;
        if (!t || t.length === 0)
          throw new Error("latlngs not passed");
        Ft(t) || (console.warn("latlngs are not flat! Only the first ring will be used"), t = t[0]);
        var x = F([0, 0]), O = pt(t), U = O.getNorthWest().distanceTo(O.getSouthWest()) * O.getNorthEast().distanceTo(O.getNorthWest());
        U < 1700 && (x = xn(t));
        var Zt = t.length, kt = [];
        for (i = 0; i < Zt; i++) {
          var Ht = F(t[i]);
          kt.push(e.project(F([Ht.lat - x.lat, Ht.lng - x.lng])));
        }
        for (i = 0, n = 0; i < Zt - 1; i++)
          n += kt[i].distanceTo(kt[i + 1]) / 2;
        if (n === 0)
          _ = kt[0];
        else
          for (i = 0, r = 0; i < Zt - 1; i++)
            if (u = kt[i], h = kt[i + 1], a = u.distanceTo(h), r += a, r > n) {
              d = (r - n) / a, _ = [
                h.x - d * (h.x - u.x),
                h.y - d * (h.y - u.y)
              ];
              break;
            }
        var At = e.unproject(I(_));
        return F([At.lat + x.lat, At.lng + x.lng]);
      }
      var Ro = {
        __proto__: null,
        simplify: Hn,
        pointToSegmentDistance: Wn,
        closestPointOnSegment: Io,
        clipSegment: Gn,
        _getEdgeIntersection: Ui,
        _getBitCode: Fe,
        _sqClosestPointOnSegment: yi,
        isFlat: Ft,
        _flat: qn,
        polylineCenter: $n
      }, Pn = {
        project: function(t) {
          return new S(t.lng, t.lat);
        },
        unproject: function(t) {
          return new Q(t.y, t.x);
        },
        bounds: new A([-180, -90], [180, 90])
      }, Tn = {
        R: 6378137,
        R_MINOR: 6356752314245179e-9,
        bounds: new A([-2003750834279e-5, -1549657073972e-5], [2003750834279e-5, 1876465623138e-5]),
        project: function(t) {
          var e = Math.PI / 180, i = this.R, n = t.lat * e, a = this.R_MINOR / i, r = Math.sqrt(1 - a * a), u = r * Math.sin(n), h = Math.tan(Math.PI / 4 - n / 2) / Math.pow((1 - u) / (1 + u), r / 2);
          return n = -i * Math.log(Math.max(h, 1e-10)), new S(t.lng * e * i, n);
        },
        unproject: function(t) {
          for (var e = 180 / Math.PI, i = this.R, n = this.R_MINOR / i, a = Math.sqrt(1 - n * n), r = Math.exp(-t.y / i), u = Math.PI / 2 - 2 * Math.atan(r), h = 0, d = 0.1, _; h < 15 && Math.abs(d) > 1e-7; h++)
            _ = a * Math.sin(u), _ = Math.pow((1 - _) / (1 + _), a / 2), d = Math.PI / 2 - 2 * Math.atan(r * _) - u, u += d;
          return new Q(u * e, t.x * e / i);
        }
      }, Do = {
        __proto__: null,
        LonLat: Pn,
        Mercator: Tn,
        SphericalMercator: hi
      }, Vo = q({}, ie, {
        code: "EPSG:3395",
        projection: Tn,
        transformation: (function() {
          var t = 0.5 / (Math.PI * Tn.R);
          return Se(t, 0.5, -t, 0.5);
        })()
      }), Kn = q({}, ie, {
        code: "EPSG:4326",
        projection: Pn,
        transformation: Se(1 / 180, 1, -1 / 180, 0.5)
      }), Uo = q({}, Gt, {
        projection: Pn,
        transformation: Se(1, 0, -1, 0),
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
      Gt.Earth = ie, Gt.EPSG3395 = Vo, Gt.EPSG3857 = _t, Gt.EPSG900913 = qe, Gt.EPSG4326 = Kn, Gt.Simple = Uo;
      var $t = Wt.extend({
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
          return this._map._targets[R(t)] = this, this;
        },
        removeInteractiveTarget: function(t) {
          return delete this._map._targets[R(t)], this;
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
      K.include({
        // @method addLayer(layer: Layer): this
        // Adds the given layer to the map
        addLayer: function(t) {
          if (!t._layerAdd)
            throw new Error("The provided object is not a Layer.");
          var e = R(t);
          return this._layers[e] ? this : (this._layers[e] = t, t._mapToAdd = this, t.beforeAdd && t.beforeAdd(this), this.whenReady(t._layerAdd, t), this);
        },
        // @method removeLayer(layer: Layer): this
        // Removes the given layer from the map.
        removeLayer: function(t) {
          var e = R(t);
          return this._layers[e] ? (this._loaded && t.onRemove(this), delete this._layers[e], this._loaded && (this.fire("layerremove", { layer: t }), t.fire("remove")), t._map = t._mapToAdd = null, this) : this;
        },
        // @method hasLayer(layer: Layer): Boolean
        // Returns `true` if the given layer is currently added to the map
        hasLayer: function(t) {
          return R(t) in this._layers;
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
          t = t ? yt(t) ? t : [t] : [];
          for (var e = 0, i = t.length; e < i; e++)
            this.addLayer(t[e]);
        },
        _addZoomLimit: function(t) {
          (!isNaN(t.options.maxZoom) || !isNaN(t.options.minZoom)) && (this._zoomBoundLayers[R(t)] = t, this._updateZoomLevels());
        },
        _removeZoomLimit: function(t) {
          var e = R(t);
          this._zoomBoundLayers[e] && (delete this._zoomBoundLayers[e], this._updateZoomLevels());
        },
        _updateZoomLevels: function() {
          var t = 1 / 0, e = -1 / 0, i = this._getZoomSpan();
          for (var n in this._zoomBoundLayers) {
            var a = this._zoomBoundLayers[n].options;
            t = a.minZoom === void 0 ? t : Math.min(t, a.minZoom), e = a.maxZoom === void 0 ? e : Math.max(e, a.maxZoom);
          }
          this._layersMaxZoom = e === -1 / 0 ? void 0 : e, this._layersMinZoom = t === 1 / 0 ? void 0 : t, i !== this._getZoomSpan() && this.fire("zoomlevelschange"), this.options.maxZoom === void 0 && this._layersMaxZoom && this.getZoom() > this._layersMaxZoom && this.setZoom(this._layersMaxZoom), this.options.minZoom === void 0 && this._layersMinZoom && this.getZoom() < this._layersMinZoom && this.setZoom(this._layersMinZoom);
        }
      });
      var ni = $t.extend({
        initialize: function(t, e) {
          tt(this, e), this._layers = {};
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
          return R(t);
        }
      }), Fo = function(t, e) {
        return new ni(t, e);
      }, pe = ni.extend({
        addLayer: function(t) {
          return this.hasLayer(t) ? this : (t.addEventParent(this), ni.prototype.addLayer.call(this, t), this.fire("layeradd", { layer: t }));
        },
        removeLayer: function(t) {
          return this.hasLayer(t) ? (t in this._layers && (t = this._layers[t]), t.removeEventParent(this), ni.prototype.removeLayer.call(this, t), this.fire("layerremove", { layer: t })) : this;
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
          var t = new Tt();
          for (var e in this._layers) {
            var i = this._layers[e];
            t.extend(i.getBounds ? i.getBounds() : i.getLatLng());
          }
          return t;
        }
      }), Ho = function(t, e) {
        return new pe(t, e);
      }, oi = xt.extend({
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
          tt(this, t);
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
          var a = I(n), r = I(e === "shadow" && i.shadowAnchor || i.iconAnchor || a && a.divideBy(2, !0));
          t.className = "leaflet-marker-" + e + " " + (i.className || ""), r && (t.style.marginLeft = -r.x + "px", t.style.marginTop = -r.y + "px"), a && (t.style.width = a.x + "px", t.style.height = a.y + "px");
        },
        _createImg: function(t, e) {
          return e = e || document.createElement("img"), e.src = t, e;
        },
        _getIconUrl: function(t) {
          return k.retina && this.options[t + "RetinaUrl"] || this.options[t + "Url"];
        }
      });
      function Wo(t) {
        return new oi(t);
      }
      var bi = oi.extend({
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
          return typeof bi.imagePath != "string" && (bi.imagePath = this._detectIconPath()), (this.options.imagePath || bi.imagePath) + oi.prototype._getIconUrl.call(this, t);
        },
        _stripUrl: function(t) {
          var e = function(i, n, a) {
            var r = n.exec(i);
            return r && r[a];
          };
          return t = e(t, /^url\((['"])?(.+)\1\)$/, 2), t && e(t, /^(.*)marker-icon\.png$/, 1);
        },
        _detectIconPath: function() {
          var t = $("div", "leaflet-default-icon-path", document.body), e = Re(t, "background-image") || Re(t, "backgroundImage");
          if (document.body.removeChild(t), e = this._stripUrl(e), e)
            return e;
          var i = document.querySelector('link[href$="leaflet.css"]');
          return i ? i.href.substring(0, i.href.length - 11 - 1) : "";
        }
      }), Jn = ue.extend({
        initialize: function(t) {
          this._marker = t;
        },
        addHooks: function() {
          var t = this._marker._icon;
          this._draggable || (this._draggable = new Te(t, t, !0)), this._draggable.on({
            dragstart: this._onDragStart,
            predrag: this._onPreDrag,
            drag: this._onDrag,
            dragend: this._onDragEnd
          }, this).enable(), l(t, "leaflet-marker-draggable");
        },
        removeHooks: function() {
          this._draggable.off({
            dragstart: this._onDragStart,
            predrag: this._onPreDrag,
            drag: this._onDrag,
            dragend: this._onDragEnd
          }, this).disable(), this._marker._icon && w(this._marker._icon, "leaflet-marker-draggable");
        },
        moved: function() {
          return this._draggable && this._draggable._moved;
        },
        _adjustPan: function(t) {
          var e = this._marker, i = e._map, n = this._marker.options.autoPanSpeed, a = this._marker.options.autoPanPadding, r = p(e._icon), u = i.getPixelBounds(), h = i.getPixelOrigin(), d = dt(
            u.min._subtract(h).add(a),
            u.max._subtract(h).subtract(a)
          );
          if (!d.contains(r)) {
            var _ = I(
              (Math.max(d.max.x, r.x) - d.max.x) / (u.max.x - d.max.x) - (Math.min(d.min.x, r.x) - d.min.x) / (u.min.x - d.min.x),
              (Math.max(d.max.y, r.y) - d.max.y) / (u.max.y - d.max.y) - (Math.min(d.min.y, r.y) - d.min.y) / (u.min.y - d.min.y)
            ).multiplyBy(n);
            i.panBy(_, { animate: !1 }), this._draggable._newPos._add(_), this._draggable._startPos._add(_), ct(e._icon, this._draggable._newPos), this._onDrag(t), this._panRequest = z(this._adjustPan.bind(this, t));
          }
        },
        _onDragStart: function() {
          this._oldLatLng = this._marker.getLatLng(), this._marker.closePopup && this._marker.closePopup(), this._marker.fire("movestart").fire("dragstart");
        },
        _onPreDrag: function(t) {
          this._marker.options.autoPan && (W(this._panRequest), this._panRequest = z(this._adjustPan.bind(this, t)));
        },
        _onDrag: function(t) {
          var e = this._marker, i = e._shadow, n = p(e._icon), a = e._map.layerPointToLatLng(n);
          i && ct(i, n), e._latlng = a, t.latlng = a, t.oldLatLng = this._oldLatLng, e.fire("move", t).fire("drag", t);
        },
        _onDragEnd: function(t) {
          W(this._panRequest), delete this._oldLatLng, this._marker.fire("moveend").fire("dragend", t);
        }
      }), Fi = $t.extend({
        // @section
        // @aka Marker options
        options: {
          // @option icon: Icon = *
          // Icon instance to use for rendering the marker.
          // See [Icon documentation](#L.Icon) for details on how to customize the marker icon.
          // If not specified, a common instance of `L.Icon.Default` is used.
          icon: new bi(),
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
          tt(this, e), this._latlng = F(t);
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
          return this._latlng = F(t), this.update(), this.fire("move", { oldLatLng: e, latlng: this._latlng });
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
          i !== this._icon && (this._icon && this._removeIcon(), n = !0, t.title && (i.title = t.title), i.tagName === "IMG" && (i.alt = t.alt || "")), l(i, e), t.keyboard && (i.tabIndex = "0", i.setAttribute("role", "button")), this._icon = i, t.riseOnHover && this.on({
            mouseover: this._bringToFront,
            mouseout: this._resetZIndex
          }), this.options.autoPanOnFocus && B(i, "focus", this._panOnFocus, this);
          var a = t.icon.createShadow(this._shadow), r = !1;
          a !== this._shadow && (this._removeShadow(), r = !0), a && (l(a, e), a.alt = ""), this._shadow = a, t.opacity < 1 && this._updateOpacity(), n && this.getPane().appendChild(this._icon), this._initInteraction(), a && r && this.getPane(t.shadowPane).appendChild(this._shadow);
        },
        _removeIcon: function() {
          this.options.riseOnHover && this.off({
            mouseover: this._bringToFront,
            mouseout: this._resetZIndex
          }), this.options.autoPanOnFocus && ot(this._icon, "focus", this._panOnFocus, this), rt(this._icon), this.removeInteractiveTarget(this._icon), this._icon = null;
        },
        _removeShadow: function() {
          this._shadow && rt(this._shadow), this._shadow = null;
        },
        _setPos: function(t) {
          this._icon && ct(this._icon, t), this._shadow && ct(this._shadow, t), this._zIndex = t.y + this.options.zIndexOffset, this._resetZIndex();
        },
        _updateZIndex: function(t) {
          this._icon && (this._icon.style.zIndex = this._zIndex + t);
        },
        _animateZoom: function(t) {
          var e = this._map._latLngToNewLayerPoint(this._latlng, t.zoom, t.center).round();
          this._setPos(e);
        },
        _initInteraction: function() {
          if (this.options.interactive && (l(this._icon, "leaflet-interactive"), this.addInteractiveTarget(this._icon), Jn)) {
            var t = this.options.draggable;
            this.dragging && (t = this.dragging.enabled(), this.dragging.disable()), this.dragging = new Jn(this), t && this.dragging.enable();
          }
        },
        // @method setOpacity(opacity: Number): this
        // Changes the opacity of the marker.
        setOpacity: function(t) {
          return this.options.opacity = t, this._map && this._updateOpacity(), this;
        },
        _updateOpacity: function() {
          var t = this.options.opacity;
          this._icon && N(this._icon, t), this._shadow && N(this._shadow, t);
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
      function jo(t, e) {
        return new Fi(t, e);
      }
      var ke = $t.extend({
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
          return tt(this, t), this._renderer && (this._renderer._updateStyle(this), this.options.stroke && t && Object.prototype.hasOwnProperty.call(t, "weight") && this._updateBounds()), this;
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
      }), Hi = ke.extend({
        // @section
        // @aka CircleMarker options
        options: {
          fill: !0,
          // @option radius: Number = 10
          // Radius of the circle marker, in pixels
          radius: 10
        },
        initialize: function(t, e) {
          tt(this, e), this._latlng = F(t), this._radius = this.options.radius;
        },
        // @method setLatLng(latLng: LatLng): this
        // Sets the position of a circle marker to a new location.
        setLatLng: function(t) {
          var e = this._latlng;
          return this._latlng = F(t), this.redraw(), this.fire("move", { oldLatLng: e, latlng: this._latlng });
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
          return ke.prototype.setStyle.call(this, t), this.setRadius(e), this;
        },
        _project: function() {
          this._point = this._map.latLngToLayerPoint(this._latlng), this._updateBounds();
        },
        _updateBounds: function() {
          var t = this._radius, e = this._radiusY || t, i = this._clickTolerance(), n = [t + i, e + i];
          this._pxBounds = new A(this._point.subtract(n), this._point.add(n));
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
        return new Hi(t, e);
      }
      var kn = Hi.extend({
        initialize: function(t, e, i) {
          if (typeof e == "number" && (e = q({}, i, { radius: e })), tt(this, e), this._latlng = F(t), isNaN(this.options.radius))
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
          return new Tt(
            this._map.layerPointToLatLng(this._point.subtract(t)),
            this._map.layerPointToLatLng(this._point.add(t))
          );
        },
        setStyle: ke.prototype.setStyle,
        _project: function() {
          var t = this._latlng.lng, e = this._latlng.lat, i = this._map, n = i.options.crs;
          if (n.distance === ie.distance) {
            var a = Math.PI / 180, r = this._mRadius / ie.R / a, u = i.project([e + r, t]), h = i.project([e - r, t]), d = u.add(h).divideBy(2), _ = i.unproject(d).lat, x = Math.acos((Math.cos(r * a) - Math.sin(e * a) * Math.sin(_ * a)) / (Math.cos(e * a) * Math.cos(_ * a))) / a;
            (isNaN(x) || x === 0) && (x = r / Math.cos(Math.PI / 180 * e)), this._point = d.subtract(i.getPixelOrigin()), this._radius = isNaN(x) ? 0 : d.x - i.project([_, t - x]).x, this._radiusY = d.y - u.y;
          } else {
            var O = n.unproject(n.project(this._latlng).subtract([this._mRadius, 0]));
            this._point = i.latLngToLayerPoint(this._latlng), this._radius = this._point.x - i.latLngToLayerPoint(O).x;
          }
          this._updateBounds();
        }
      });
      function qo(t, e, i) {
        return new kn(t, e, i);
      }
      var _e = ke.extend({
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
          tt(this, e), this._setLatLngs(t);
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
          for (var e = 1 / 0, i = null, n = yi, a, r, u = 0, h = this._parts.length; u < h; u++)
            for (var d = this._parts[u], _ = 1, x = d.length; _ < x; _++) {
              a = d[_ - 1], r = d[_];
              var O = n(t, a, r, !0);
              O < e && (e = O, i = n(t, a, r));
            }
          return i && (i.distance = Math.sqrt(e)), i;
        },
        // @method getCenter(): LatLng
        // Returns the center ([centroid](https://en.wikipedia.org/wiki/Centroid)) of the polyline.
        getCenter: function() {
          if (!this._map)
            throw new Error("Must add layer to map before using getCenter()");
          return $n(this._defaultShape(), this._map.options.crs);
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
          return e = e || this._defaultShape(), t = F(t), e.push(t), this._bounds.extend(t), this.redraw();
        },
        _setLatLngs: function(t) {
          this._bounds = new Tt(), this._latlngs = this._convertLatLngs(t);
        },
        _defaultShape: function() {
          return Ft(this._latlngs) ? this._latlngs : this._latlngs[0];
        },
        // recursively convert latlngs input into actual LatLng instances; calculate bounds along the way
        _convertLatLngs: function(t) {
          for (var e = [], i = Ft(t), n = 0, a = t.length; n < a; n++)
            i ? (e[n] = F(t[n]), this._bounds.extend(e[n])) : e[n] = this._convertLatLngs(t[n]);
          return e;
        },
        _project: function() {
          var t = new A();
          this._rings = [], this._projectLatlngs(this._latlngs, this._rings, t), this._bounds.isValid() && t.isValid() && (this._rawPxBounds = t, this._updateBounds());
        },
        _updateBounds: function() {
          var t = this._clickTolerance(), e = new S(t, t);
          this._rawPxBounds && (this._pxBounds = new A([
            this._rawPxBounds.min.subtract(e),
            this._rawPxBounds.max.add(e)
          ]));
        },
        // recursively turns latlngs into a set of rings with projected coordinates
        _projectLatlngs: function(t, e, i) {
          var n = t[0] instanceof Q, a = t.length, r, u;
          if (n) {
            for (u = [], r = 0; r < a; r++)
              u[r] = this._map.latLngToLayerPoint(t[r]), i.extend(u[r]);
            e.push(u);
          } else
            for (r = 0; r < a; r++)
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
            var e = this._parts, i, n, a, r, u, h, d;
            for (i = 0, a = 0, r = this._rings.length; i < r; i++)
              for (d = this._rings[i], n = 0, u = d.length; n < u - 1; n++)
                h = Gn(d[n], d[n + 1], t, n, !0), h && (e[a] = e[a] || [], e[a].push(h[0]), (h[1] !== d[n + 1] || n === u - 2) && (e[a].push(h[1]), a++));
          }
        },
        // simplify each clipped part of the polyline for performance
        _simplifyPoints: function() {
          for (var t = this._parts, e = this.options.smoothFactor, i = 0, n = t.length; i < n; i++)
            t[i] = Hn(t[i], e);
        },
        _update: function() {
          this._map && (this._clipPoints(), this._simplifyPoints(), this._updatePath());
        },
        _updatePath: function() {
          this._renderer._updatePoly(this);
        },
        // Needed by the `Canvas` renderer for interactivity
        _containsPoint: function(t, e) {
          var i, n, a, r, u, h, d = this._clickTolerance();
          if (!this._pxBounds || !this._pxBounds.contains(t))
            return !1;
          for (i = 0, r = this._parts.length; i < r; i++)
            for (h = this._parts[i], n = 0, u = h.length, a = u - 1; n < u; a = n++)
              if (!(!e && n === 0) && Wn(t, h[a], h[n]) <= d)
                return !0;
          return !1;
        }
      });
      function $o(t, e) {
        return new _e(t, e);
      }
      _e._flat = qn;
      var si = _e.extend({
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
          return Fn(this._defaultShape(), this._map.options.crs);
        },
        _convertLatLngs: function(t) {
          var e = _e.prototype._convertLatLngs.call(this, t), i = e.length;
          return i >= 2 && e[0] instanceof Q && e[0].equals(e[i - 1]) && e.pop(), e;
        },
        _setLatLngs: function(t) {
          _e.prototype._setLatLngs.call(this, t), Ft(this._latlngs) && (this._latlngs = [this._latlngs]);
        },
        _defaultShape: function() {
          return Ft(this._latlngs[0]) ? this._latlngs[0] : this._latlngs[0][0];
        },
        _clipPoints: function() {
          var t = this._renderer._bounds, e = this.options.weight, i = new S(e, e);
          if (t = new A(t.min.subtract(i), t.max.add(i)), this._parts = [], !(!this._pxBounds || !this._pxBounds.intersects(t))) {
            if (this.options.noClip) {
              this._parts = this._rings;
              return;
            }
            for (var n = 0, a = this._rings.length, r; n < a; n++)
              r = Un(this._rings[n], t, !0), r.length && this._parts.push(r);
          }
        },
        _updatePath: function() {
          this._renderer._updatePoly(this, !0);
        },
        // Needed by the `Canvas` renderer for interactivity
        _containsPoint: function(t) {
          var e = !1, i, n, a, r, u, h, d, _;
          if (!this._pxBounds || !this._pxBounds.contains(t))
            return !1;
          for (r = 0, d = this._parts.length; r < d; r++)
            for (i = this._parts[r], u = 0, _ = i.length, h = _ - 1; u < _; h = u++)
              n = i[u], a = i[h], n.y > t.y != a.y > t.y && t.x < (a.x - n.x) * (t.y - n.y) / (a.y - n.y) + n.x && (e = !e);
          return e || _e.prototype._containsPoint.call(this, t, !0);
        }
      });
      function Ko(t, e) {
        return new si(t, e);
      }
      var me = pe.extend({
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
          tt(this, e), this._layers = {}, t && this.addData(t);
        },
        // @method addData( <GeoJSON> data ): this
        // Adds a GeoJSON object to the layer.
        addData: function(t) {
          var e = yt(t) ? t : t.features, i, n, a;
          if (e) {
            for (i = 0, n = e.length; i < n; i++)
              a = e[i], (a.geometries || a.geometry || a.features || a.coordinates) && this.addData(a);
            return this;
          }
          var r = this.options;
          if (r.filter && !r.filter(t))
            return this;
          var u = Wi(t, r);
          return u ? (u.feature = qi(t), u.defaultOptions = u.options, this.resetStyle(u), r.onEachFeature && r.onEachFeature(t, u), this.addLayer(u)) : this;
        },
        // @method resetStyle( <Path> layer? ): this
        // Resets the given vector layer's style to the original GeoJSON style, useful for resetting style after hover events.
        // If `layer` is omitted, the style of all features in the current layer is reset.
        resetStyle: function(t) {
          return t === void 0 ? this.eachLayer(this.resetStyle, this) : (t.options = q({}, t.defaultOptions), this._setLayerStyle(t, this.options.style), this);
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
      function Wi(t, e) {
        var i = t.type === "Feature" ? t.geometry : t, n = i ? i.coordinates : null, a = [], r = e && e.pointToLayer, u = e && e.coordsToLatLng || Cn, h, d, _, x;
        if (!n && !i)
          return null;
        switch (i.type) {
          case "Point":
            return h = u(n), Yn(r, t, h, e);
          case "MultiPoint":
            for (_ = 0, x = n.length; _ < x; _++)
              h = u(n[_]), a.push(Yn(r, t, h, e));
            return new pe(a);
          case "LineString":
          case "MultiLineString":
            return d = ji(n, i.type === "LineString" ? 0 : 1, u), new _e(d, e);
          case "Polygon":
          case "MultiPolygon":
            return d = ji(n, i.type === "Polygon" ? 1 : 2, u), new si(d, e);
          case "GeometryCollection":
            for (_ = 0, x = i.geometries.length; _ < x; _++) {
              var O = Wi({
                geometry: i.geometries[_],
                type: "Feature",
                properties: t.properties
              }, e);
              O && a.push(O);
            }
            return new pe(a);
          case "FeatureCollection":
            for (_ = 0, x = i.features.length; _ < x; _++) {
              var U = Wi(i.features[_], e);
              U && a.push(U);
            }
            return new pe(a);
          default:
            throw new Error("Invalid GeoJSON object.");
        }
      }
      function Yn(t, e, i, n) {
        return t ? t(e, i) : new Fi(i, n && n.markersInheritOptions && n);
      }
      function Cn(t) {
        return new Q(t[1], t[0], t[2]);
      }
      function ji(t, e, i) {
        for (var n = [], a = 0, r = t.length, u; a < r; a++)
          u = e ? ji(t[a], e - 1, i) : (i || Cn)(t[a]), n.push(u);
        return n;
      }
      function Sn(t, e) {
        return t = F(t), t.alt !== void 0 ? [gt(t.lng, e), gt(t.lat, e), gt(t.alt, e)] : [gt(t.lng, e), gt(t.lat, e)];
      }
      function Gi(t, e, i, n) {
        for (var a = [], r = 0, u = t.length; r < u; r++)
          a.push(e ? Gi(t[r], Ft(t[r]) ? 0 : e - 1, i, n) : Sn(t[r], n));
        return !e && i && a.length > 0 && a.push(a[0].slice()), a;
      }
      function ai(t, e) {
        return t.feature ? q({}, t.feature, { geometry: e }) : qi(e);
      }
      function qi(t) {
        return t.type === "Feature" || t.type === "FeatureCollection" ? t : {
          type: "Feature",
          properties: {},
          geometry: t
        };
      }
      var Mn = {
        toGeoJSON: function(t) {
          return ai(this, {
            type: "Point",
            coordinates: Sn(this.getLatLng(), t)
          });
        }
      };
      Fi.include(Mn), kn.include(Mn), Hi.include(Mn), _e.include({
        toGeoJSON: function(t) {
          var e = !Ft(this._latlngs), i = Gi(this._latlngs, e ? 1 : 0, !1, t);
          return ai(this, {
            type: (e ? "Multi" : "") + "LineString",
            coordinates: i
          });
        }
      }), si.include({
        toGeoJSON: function(t) {
          var e = !Ft(this._latlngs), i = e && !Ft(this._latlngs[0]), n = Gi(this._latlngs, i ? 2 : e ? 1 : 0, !0, t);
          return e || (n = [n]), ai(this, {
            type: (i ? "Multi" : "") + "Polygon",
            coordinates: n
          });
        }
      }), ni.include({
        toMultiPoint: function(t) {
          var e = [];
          return this.eachLayer(function(i) {
            e.push(i.toGeoJSON(t).geometry.coordinates);
          }), ai(this, {
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
          return this.eachLayer(function(a) {
            if (a.toGeoJSON) {
              var r = a.toGeoJSON(t);
              if (i)
                n.push(r.geometry);
              else {
                var u = qi(r);
                u.type === "FeatureCollection" ? n.push.apply(n, u.features) : n.push(u);
              }
            }
          }), i ? ai(this, {
            geometries: n,
            type: "GeometryCollection"
          }) : {
            type: "FeatureCollection",
            features: n
          };
        }
      });
      function Xn(t, e) {
        return new me(t, e);
      }
      var Jo = Xn, $i = $t.extend({
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
          this._url = t, this._bounds = pt(e), tt(this, i);
        },
        onAdd: function() {
          this._image || (this._initImage(), this.options.opacity < 1 && this._updateOpacity()), this.options.interactive && (l(this._image, "leaflet-interactive"), this.addInteractiveTarget(this._image)), this.getPane().appendChild(this._image), this._reset();
        },
        onRemove: function() {
          rt(this._image), this.options.interactive && this.removeInteractiveTarget(this._image);
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
          return this._map && Pe(this._image), this;
        },
        // @method bringToBack(): this
        // Brings the layer to the bottom of all overlays.
        bringToBack: function() {
          return this._map && c(this._image), this;
        },
        // @method setUrl(url: String): this
        // Changes the URL of the image.
        setUrl: function(t) {
          return this._url = t, this._image && (this._image.src = t), this;
        },
        // @method setBounds(bounds: LatLngBounds): this
        // Update the bounds that this ImageOverlay covers
        setBounds: function(t) {
          return this._bounds = pt(t), this._map && this._reset(), this;
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
          var t = this._url.tagName === "IMG", e = this._image = t ? this._url : $("img");
          if (l(e, "leaflet-image-layer"), this._zoomAnimated && l(e, "leaflet-zoom-animated"), this.options.className && l(e, this.options.className), e.onselectstart = nt, e.onmousemove = nt, e.onload = H(this.fire, this, "load"), e.onerror = H(this._overlayOnError, this, "error"), (this.options.crossOrigin || this.options.crossOrigin === "") && (e.crossOrigin = this.options.crossOrigin === !0 ? "" : this.options.crossOrigin), this.options.zIndex && this._updateZIndex(), t) {
            this._url = e.src;
            return;
          }
          e.src = this._url, e.alt = this.options.alt;
        },
        _animateZoom: function(t) {
          var e = this._map.getZoomScale(t.zoom), i = this._map._latLngBoundsToNewLayerBounds(this._bounds, t.zoom, t.center).min;
          re(this._image, i, e);
        },
        _reset: function() {
          var t = this._image, e = new A(
            this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
            this._map.latLngToLayerPoint(this._bounds.getSouthEast())
          ), i = e.getSize();
          ct(t, e.min), t.style.width = i.x + "px", t.style.height = i.y + "px";
        },
        _updateOpacity: function() {
          N(this._image, this.options.opacity);
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
      }), Yo = function(t, e, i) {
        return new $i(t, e, i);
      }, Qn = $i.extend({
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
          var t = this._url.tagName === "VIDEO", e = this._image = t ? this._url : $("video");
          if (l(e, "leaflet-image-layer"), this._zoomAnimated && l(e, "leaflet-zoom-animated"), this.options.className && l(e, this.options.className), e.onselectstart = nt, e.onmousemove = nt, e.onloadeddata = H(this.fire, this, "load"), t) {
            for (var i = e.getElementsByTagName("source"), n = [], a = 0; a < i.length; a++)
              n.push(i[a].src);
            this._url = i.length > 0 ? n : [e.src];
            return;
          }
          yt(this._url) || (this._url = [this._url]), !this.options.keepAspectRatio && Object.prototype.hasOwnProperty.call(e.style, "objectFit") && (e.style.objectFit = "fill"), e.autoplay = !!this.options.autoplay, e.loop = !!this.options.loop, e.muted = !!this.options.muted, e.playsInline = !!this.options.playsInline;
          for (var r = 0; r < this._url.length; r++) {
            var u = $("source");
            u.src = this._url[r], e.appendChild(u);
          }
        }
        // @method getElement(): HTMLVideoElement
        // Returns the instance of [`HTMLVideoElement`](https://developer.mozilla.org/docs/Web/API/HTMLVideoElement)
        // used by this overlay.
      });
      function Xo(t, e, i) {
        return new Qn(t, e, i);
      }
      var to = $i.extend({
        _initImage: function() {
          var t = this._image = this._url;
          l(t, "leaflet-image-layer"), this._zoomAnimated && l(t, "leaflet-zoom-animated"), this.options.className && l(t, this.options.className), t.onselectstart = nt, t.onmousemove = nt;
        }
        // @method getElement(): SVGElement
        // Returns the instance of [`SVGElement`](https://developer.mozilla.org/docs/Web/API/SVGElement)
        // used by this overlay.
      });
      function Qo(t, e, i) {
        return new to(t, e, i);
      }
      var he = $t.extend({
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
          t && (t instanceof Q || yt(t)) ? (this._latlng = F(t), tt(this, e)) : (tt(this, t), this._source = e), this.options.content && (this._content = this.options.content);
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
          this._zoomAnimated = t._zoomAnimated, this._container || this._initLayout(), t._fadeAnimated && N(this._container, 0), clearTimeout(this._removeTimeout), this.getPane().appendChild(this._container), this.update(), t._fadeAnimated && N(this._container, 1), this.bringToFront(), this.options.interactive && (l(this._container, "leaflet-interactive"), this.addInteractiveTarget(this._container));
        },
        onRemove: function(t) {
          t._fadeAnimated ? (N(this._container, 0), this._removeTimeout = setTimeout(H(rt, void 0, this._container), 200)) : rt(this._container), this.options.interactive && (w(this._container, "leaflet-interactive"), this.removeInteractiveTarget(this._container));
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
          return this._latlng = F(t), this._map && (this._updatePosition(), this._adjustPan()), this;
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
          return this._map && Pe(this._container), this;
        },
        // @method bringToBack: this
        // Brings this overlay to the back of other overlays (in the same map pane).
        bringToBack: function() {
          return this._map && c(this._container), this;
        },
        // prepare bound overlay to open: update latlng pos / content source (for FeatureGroup)
        _prepareOpen: function(t) {
          var e = this._source;
          if (!e._map)
            return !1;
          if (e instanceof pe) {
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
            this._zoomAnimated ? ct(this._container, t.add(i)) : e = e.add(t).add(i);
            var n = this._containerBottom = -e.y, a = this._containerLeft = -Math.round(this._containerWidth / 2) + e.x;
            this._container.style.bottom = n + "px", this._container.style.left = a + "px";
          }
        },
        _getAnchor: function() {
          return [0, 0];
        }
      });
      K.include({
        _initOverlay: function(t, e, i, n) {
          var a = e;
          return a instanceof t || (a = new t(n).setContent(e)), i && a.setLatLng(i), a;
        }
      }), $t.include({
        _initOverlay: function(t, e, i, n) {
          var a = i;
          return a instanceof t ? (tt(a, n), a._source = this) : (a = e && !n ? e : new t(n, this), a.setContent(i)), a;
        }
      });
      var Ki = he.extend({
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
          return t = arguments.length ? t : this._source._map, !t.hasLayer(this) && t._popup && t._popup.options.autoClose && t.removeLayer(t._popup), t._popup = this, he.prototype.openOn.call(this, t);
        },
        onAdd: function(t) {
          he.prototype.onAdd.call(this, t), t.fire("popupopen", { popup: this }), this._source && (this._source.fire("popupopen", { popup: this }, !0), this._source instanceof ke || this._source.on("preclick", Ve));
        },
        onRemove: function(t) {
          he.prototype.onRemove.call(this, t), t.fire("popupclose", { popup: this }), this._source && (this._source.fire("popupclose", { popup: this }, !0), this._source instanceof ke || this._source.off("preclick", Ve));
        },
        getEvents: function() {
          var t = he.prototype.getEvents.call(this);
          return (this.options.closeOnClick !== void 0 ? this.options.closeOnClick : this._map.options.closePopupOnClick) && (t.preclick = this.close), this.options.keepInView && (t.moveend = this._adjustPan), t;
        },
        _initLayout: function() {
          var t = "leaflet-popup", e = this._container = $(
            "div",
            t + " " + (this.options.className || "") + " leaflet-zoom-animated"
          ), i = this._wrapper = $("div", t + "-content-wrapper", e);
          if (this._contentNode = $("div", t + "-content", i), vi(e), gn(this._contentNode), B(e, "contextmenu", Ve), this._tipContainer = $("div", t + "-tip-container", e), this._tip = $("div", t + "-tip", this._tipContainer), this.options.closeButton) {
            var n = this._closeButton = $("a", t + "-close-button", e);
            n.setAttribute("role", "button"), n.setAttribute("aria-label", "Close popup"), n.href = "#close", n.innerHTML = '<span aria-hidden="true">&#215;</span>', B(n, "click", function(a) {
              Mt(a), this.close();
            }, this);
          }
        },
        _updateLayout: function() {
          var t = this._contentNode, e = t.style;
          e.width = "", e.whiteSpace = "nowrap";
          var i = t.offsetWidth;
          i = Math.min(i, this.options.maxWidth), i = Math.max(i, this.options.minWidth), e.width = i + 1 + "px", e.whiteSpace = "", e.height = "";
          var n = t.offsetHeight, a = this.options.maxHeight, r = "leaflet-popup-scrolled";
          a && n > a ? (e.height = a + "px", l(t, r)) : w(t, r), this._containerWidth = this._container.offsetWidth;
        },
        _animateZoom: function(t) {
          var e = this._map._latLngToNewLayerPoint(this._latlng, t.zoom, t.center), i = this._getAnchor();
          ct(this._container, e.add(i));
        },
        _adjustPan: function() {
          if (this.options.autoPan) {
            if (this._map._panAnim && this._map._panAnim.stop(), this._autopanning) {
              this._autopanning = !1;
              return;
            }
            var t = this._map, e = parseInt(Re(this._container, "marginBottom"), 10) || 0, i = this._container.offsetHeight + e, n = this._containerWidth, a = new S(this._containerLeft, -i - this._containerBottom);
            a._add(p(this._container));
            var r = t.layerPointToContainerPoint(a), u = I(this.options.autoPanPadding), h = I(this.options.autoPanPaddingTopLeft || u), d = I(this.options.autoPanPaddingBottomRight || u), _ = t.getSize(), x = 0, O = 0;
            r.x + n + d.x > _.x && (x = r.x + n - _.x + d.x), r.x - x - h.x < 0 && (x = r.x - h.x), r.y + i + d.y > _.y && (O = r.y + i - _.y + d.y), r.y - O - h.y < 0 && (O = r.y - h.y), (x || O) && (this.options.keepInView && (this._autopanning = !0), t.fire("autopanstart").panBy([x, O]));
          }
        },
        _getAnchor: function() {
          return I(this._source && this._source._getPopupAnchor ? this._source._getPopupAnchor() : [0, 0]);
        }
      }), ts = function(t, e) {
        return new Ki(t, e);
      };
      K.mergeOptions({
        closePopupOnClick: !0
      }), K.include({
        // @method openPopup(popup: Popup): this
        // Opens the specified popup while closing the previously opened (to make sure only one is opened at one time for usability).
        // @alternative
        // @method openPopup(content: String|HTMLElement, latlng: LatLng, options?: Popup options): this
        // Creates a popup with the specified content and options and opens it in the given point on a map.
        openPopup: function(t, e, i) {
          return this._initOverlay(Ki, t, e, i).openOn(this), this;
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
          return this._popup = this._initOverlay(Ki, this._popup, t, e), this._popupHandlersAdded || (this.on({
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
          return this._popup && (this instanceof pe || (this._popup._source = this), this._popup._prepareOpen(t || this._latlng) && this._popup.openOn(this._map)), this;
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
            Ue(t);
            var e = t.layer || t.target;
            if (this._popup._source === e && !(e instanceof ke)) {
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
      var Ji = he.extend({
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
          he.prototype.onAdd.call(this, t), this.setOpacity(this.options.opacity), t.fire("tooltipopen", { tooltip: this }), this._source && (this.addEventParent(this._source), this._source.fire("tooltipopen", { tooltip: this }, !0));
        },
        onRemove: function(t) {
          he.prototype.onRemove.call(this, t), t.fire("tooltipclose", { tooltip: this }), this._source && (this.removeEventParent(this._source), this._source.fire("tooltipclose", { tooltip: this }, !0));
        },
        getEvents: function() {
          var t = he.prototype.getEvents.call(this);
          return this.options.permanent || (t.preclick = this.close), t;
        },
        _initLayout: function() {
          var t = "leaflet-tooltip", e = t + " " + (this.options.className || "") + " leaflet-zoom-" + (this._zoomAnimated ? "animated" : "hide");
          this._contentNode = this._container = $("div", e), this._container.setAttribute("role", "tooltip"), this._container.setAttribute("id", "leaflet-tooltip-" + R(this));
        },
        _updateLayout: function() {
        },
        _adjustPan: function() {
        },
        _setPosition: function(t) {
          var e, i, n = this._map, a = this._container, r = n.latLngToContainerPoint(n.getCenter()), u = n.layerPointToContainerPoint(t), h = this.options.direction, d = a.offsetWidth, _ = a.offsetHeight, x = I(this.options.offset), O = this._getAnchor();
          h === "top" ? (e = d / 2, i = _) : h === "bottom" ? (e = d / 2, i = 0) : h === "center" ? (e = d / 2, i = _ / 2) : h === "right" ? (e = 0, i = _ / 2) : h === "left" ? (e = d, i = _ / 2) : u.x < r.x ? (h = "right", e = 0, i = _ / 2) : (h = "left", e = d + (x.x + O.x) * 2, i = _ / 2), t = t.subtract(I(e, i, !0)).add(x).add(O), w(a, "leaflet-tooltip-right"), w(a, "leaflet-tooltip-left"), w(a, "leaflet-tooltip-top"), w(a, "leaflet-tooltip-bottom"), l(a, "leaflet-tooltip-" + h), ct(a, t);
        },
        _updatePosition: function() {
          var t = this._map.latLngToLayerPoint(this._latlng);
          this._setPosition(t);
        },
        setOpacity: function(t) {
          this.options.opacity = t, this._container && N(this._container, t);
        },
        _animateZoom: function(t) {
          var e = this._map._latLngToNewLayerPoint(this._latlng, t.zoom, t.center);
          this._setPosition(e);
        },
        _getAnchor: function() {
          return I(this._source && this._source._getTooltipAnchor && !this.options.sticky ? this._source._getTooltipAnchor() : [0, 0]);
        }
      }), es = function(t, e) {
        return new Ji(t, e);
      };
      K.include({
        // @method openTooltip(tooltip: Tooltip): this
        // Opens the specified tooltip.
        // @alternative
        // @method openTooltip(content: String|HTMLElement, latlng: LatLng, options?: Tooltip options): this
        // Creates a tooltip with the specified content and options and open it.
        openTooltip: function(t, e, i) {
          return this._initOverlay(Ji, t, e, i).openOn(this), this;
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
          return this._tooltip && this.isTooltipOpen() && this.unbindTooltip(), this._tooltip = this._initOverlay(Ji, this._tooltip, t, e), this._initTooltipInteractions(), this._tooltip.options.permanent && this._map && this._map.hasLayer(this) && this.openTooltip(), this;
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
          return this._tooltip && (this instanceof pe || (this._tooltip._source = this), this._tooltip._prepareOpen(t) && (this._tooltip.openOn(this._map), this.getElement ? this._setAriaDescribedByOnLayer(this) : this.eachLayer && this.eachLayer(this._setAriaDescribedByOnLayer, this))), this;
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
      var eo = oi.extend({
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
          if (i.html instanceof Element ? (ii(e), e.appendChild(i.html)) : e.innerHTML = i.html !== !1 ? i.html : "", i.bgPos) {
            var n = I(i.bgPos);
            e.style.backgroundPosition = -n.x + "px " + -n.y + "px";
          }
          return this._setIconStyles(e, "icon"), e;
        },
        createShadow: function() {
          return null;
        }
      });
      function is(t) {
        return new eo(t);
      }
      oi.Default = bi;
      var wi = $t.extend({
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
          updateWhenIdle: k.mobile,
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
          tt(this, t);
        },
        onAdd: function() {
          this._initContainer(), this._levels = {}, this._tiles = {}, this._resetView();
        },
        beforeAdd: function(t) {
          t._addZoomLimit(this);
        },
        onRemove: function(t) {
          this._removeAllTiles(), rt(this._container), t._removeZoomLimit(this), this._container = null, this._tileZoom = void 0;
        },
        // @method bringToFront: this
        // Brings the tile layer to the top of all tile layers.
        bringToFront: function() {
          return this._map && (Pe(this._container), this._setAutoZIndex(Math.max)), this;
        },
        // @method bringToBack: this
        // Brings the tile layer to the bottom of all tile layers.
        bringToBack: function() {
          return this._map && (c(this._container), this._setAutoZIndex(Math.min)), this;
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
          return this.options.updateWhenIdle || (this._onMove || (this._onMove = X(this._onMoveEnd, this.options.updateInterval, this)), t.move = this._onMove), this._zoomAnimated && (t.zoomanim = this._animateZoom), t;
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
          return t instanceof S ? t : new S(t, t);
        },
        _updateZIndex: function() {
          this._container && this.options.zIndex !== void 0 && this.options.zIndex !== null && (this._container.style.zIndex = this.options.zIndex);
        },
        _setAutoZIndex: function(t) {
          for (var e = this.getPane().children, i = -t(-1 / 0, 1 / 0), n = 0, a = e.length, r; n < a; n++)
            r = e[n].style.zIndex, e[n] !== this._container && r && (i = t(i, +r));
          isFinite(i) && (this.options.zIndex = i + t(-1, 1), this._updateZIndex());
        },
        _updateOpacity: function() {
          if (this._map && !k.ielt9) {
            N(this._container, this.options.opacity);
            var t = +/* @__PURE__ */ new Date(), e = !1, i = !1;
            for (var n in this._tiles) {
              var a = this._tiles[n];
              if (!(!a.current || !a.loaded)) {
                var r = Math.min(1, (t - a.loaded) / 200);
                N(a.el, r), r < 1 ? e = !0 : (a.active ? i = !0 : this._onOpaqueTile(a), a.active = !0);
              }
            }
            i && !this._noPrune && this._pruneTiles(), e && (W(this._fadeFrame), this._fadeFrame = z(this._updateOpacity, this));
          }
        },
        _onOpaqueTile: nt,
        _initContainer: function() {
          this._container || (this._container = $("div", "leaflet-layer " + (this.options.className || "")), this._updateZIndex(), this.options.opacity < 1 && this._updateOpacity(), this.getPane().appendChild(this._container));
        },
        _updateLevels: function() {
          var t = this._tileZoom, e = this.options.maxZoom;
          if (t !== void 0) {
            for (var i in this._levels)
              i = Number(i), this._levels[i].el.children.length || i === t ? (this._levels[i].el.style.zIndex = e - Math.abs(t - i), this._onUpdateLevel(i)) : (rt(this._levels[i].el), this._removeTilesAtZoom(i), this._onRemoveLevel(i), delete this._levels[i]);
            var n = this._levels[t], a = this._map;
            return n || (n = this._levels[t] = {}, n.el = $("div", "leaflet-tile-container leaflet-zoom-animated", this._container), n.el.style.zIndex = e, n.origin = a.project(a.unproject(a.getPixelOrigin()), t).round(), n.zoom = t, this._setZoomTransform(n, a.getCenter(), a.getZoom()), nt(n.el.offsetWidth), this._onCreateLevel(n)), this._level = n, n;
          }
        },
        _onUpdateLevel: nt,
        _onRemoveLevel: nt,
        _onCreateLevel: nt,
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
            rt(this._levels[t].el), this._onRemoveLevel(Number(t)), delete this._levels[t];
          this._removeAllTiles(), this._tileZoom = void 0;
        },
        _retainParent: function(t, e, i, n) {
          var a = Math.floor(t / 2), r = Math.floor(e / 2), u = i - 1, h = new S(+a, +r);
          h.z = +u;
          var d = this._tileCoordsToKey(h), _ = this._tiles[d];
          return _ && _.active ? (_.retain = !0, !0) : (_ && _.loaded && (_.retain = !0), u > n ? this._retainParent(a, r, u, n) : !1);
        },
        _retainChildren: function(t, e, i, n) {
          for (var a = 2 * t; a < 2 * t + 2; a++)
            for (var r = 2 * e; r < 2 * e + 2; r++) {
              var u = new S(a, r);
              u.z = i + 1;
              var h = this._tileCoordsToKey(u), d = this._tiles[h];
              if (d && d.active) {
                d.retain = !0;
                continue;
              } else d && d.loaded && (d.retain = !0);
              i + 1 < n && this._retainChildren(a, r, i + 1, n);
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
          var a = Math.round(e);
          this.options.maxZoom !== void 0 && a > this.options.maxZoom || this.options.minZoom !== void 0 && a < this.options.minZoom ? a = void 0 : a = this._clampZoom(a);
          var r = this.options.updateWhenZooming && a !== this._tileZoom;
          (!n || r) && (this._tileZoom = a, this._abortLoading && this._abortLoading(), this._updateLevels(), this._resetGrid(), a !== void 0 && this._update(t), i || this._pruneTiles(), this._noPrune = !!i), this._setZoomTransforms(t, e);
        },
        _setZoomTransforms: function(t, e) {
          for (var i in this._levels)
            this._setZoomTransform(this._levels[i], t, e);
        },
        _setZoomTransform: function(t, e, i) {
          var n = this._map.getZoomScale(i, t.zoom), a = t.origin.multiplyBy(n).subtract(this._map._getNewPixelOrigin(e, i)).round();
          k.any3d ? re(t.el, a, n) : ct(t.el, a);
        },
        _resetGrid: function() {
          var t = this._map, e = t.options.crs, i = this._tileSize = this.getTileSize(), n = this._tileZoom, a = this._map.getPixelWorldBounds(this._tileZoom);
          a && (this._globalTileRange = this._pxBoundsToTileRange(a)), this._wrapX = e.wrapLng && !this.options.noWrap && [
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
          var e = this._map, i = e._animatingZoom ? Math.max(e._animateToZoom, e.getZoom()) : e.getZoom(), n = e.getZoomScale(i, this._tileZoom), a = e.project(t, this._tileZoom).floor(), r = e.getSize().divideBy(n * 2);
          return new A(a.subtract(r), a.add(r));
        },
        // Private method to load tiles in the grid's active zoom level according to map bounds
        _update: function(t) {
          var e = this._map;
          if (e) {
            var i = this._clampZoom(e.getZoom());
            if (t === void 0 && (t = e.getCenter()), this._tileZoom !== void 0) {
              var n = this._getTiledPixelBounds(t), a = this._pxBoundsToTileRange(n), r = a.getCenter(), u = [], h = this.options.keepBuffer, d = new A(
                a.getBottomLeft().subtract([h, -h]),
                a.getTopRight().add([h, -h])
              );
              if (!(isFinite(a.min.x) && isFinite(a.min.y) && isFinite(a.max.x) && isFinite(a.max.y)))
                throw new Error("Attempted to load an infinite number of tiles");
              for (var _ in this._tiles) {
                var x = this._tiles[_].coords;
                (x.z !== this._tileZoom || !d.contains(new S(x.x, x.y))) && (this._tiles[_].current = !1);
              }
              if (Math.abs(i - this._tileZoom) > 1) {
                this._setView(t, i);
                return;
              }
              for (var O = a.min.y; O <= a.max.y; O++)
                for (var U = a.min.x; U <= a.max.x; U++) {
                  var Zt = new S(U, O);
                  if (Zt.z = this._tileZoom, !!this._isValidTile(Zt)) {
                    var kt = this._tiles[this._tileCoordsToKey(Zt)];
                    kt ? kt.current = !0 : u.push(Zt);
                  }
                }
              if (u.sort(function(At, li) {
                return At.distanceTo(r) - li.distanceTo(r);
              }), u.length !== 0) {
                this._loading || (this._loading = !0, this.fire("loading"));
                var Ht = document.createDocumentFragment();
                for (U = 0; U < u.length; U++)
                  this._addTile(u[U], Ht);
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
          return pt(this.options.bounds).overlaps(n);
        },
        _keyToBounds: function(t) {
          return this._tileCoordsToBounds(this._keyToTileCoords(t));
        },
        _tileCoordsToNwSe: function(t) {
          var e = this._map, i = this.getTileSize(), n = t.scaleBy(i), a = n.add(i), r = e.unproject(n, t.z), u = e.unproject(a, t.z);
          return [r, u];
        },
        // converts tile coordinates to its geographical bounds
        _tileCoordsToBounds: function(t) {
          var e = this._tileCoordsToNwSe(t), i = new Tt(e[0], e[1]);
          return this.options.noWrap || (i = this._map.wrapLatLngBounds(i)), i;
        },
        // converts tile coordinates to key for the tile cache
        _tileCoordsToKey: function(t) {
          return t.x + ":" + t.y + ":" + t.z;
        },
        // converts tile cache key to coordinates
        _keyToTileCoords: function(t) {
          var e = t.split(":"), i = new S(+e[0], +e[1]);
          return i.z = +e[2], i;
        },
        _removeTile: function(t) {
          var e = this._tiles[t];
          e && (rt(e.el), delete this._tiles[t], this.fire("tileunload", {
            tile: e.el,
            coords: this._keyToTileCoords(t)
          }));
        },
        _initTile: function(t) {
          l(t, "leaflet-tile");
          var e = this.getTileSize();
          t.style.width = e.x + "px", t.style.height = e.y + "px", t.onselectstart = nt, t.onmousemove = nt, k.ielt9 && this.options.opacity < 1 && N(t, this.options.opacity);
        },
        _addTile: function(t, e) {
          var i = this._getTilePos(t), n = this._tileCoordsToKey(t), a = this.createTile(this._wrapCoords(t), H(this._tileReady, this, t));
          this._initTile(a), this.createTile.length < 2 && z(H(this._tileReady, this, t, null, a)), ct(a, i), this._tiles[n] = {
            el: a,
            coords: t,
            current: !0
          }, e.appendChild(a), this.fire("tileloadstart", {
            tile: a,
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
          i = this._tiles[n], i && (i.loaded = +/* @__PURE__ */ new Date(), this._map._fadeAnimated ? (N(i.el, 0), W(this._fadeFrame), this._fadeFrame = z(this._updateOpacity, this)) : (i.active = !0, this._pruneTiles()), e || (l(i.el, "leaflet-tile-loaded"), this.fire("tileload", {
            tile: i.el,
            coords: t
          })), this._noTilesToLoad() && (this._loading = !1, this.fire("load"), k.ielt9 || !this._map._fadeAnimated ? z(this._pruneTiles, this) : setTimeout(H(this._pruneTiles, this), 250)));
        },
        _getTilePos: function(t) {
          return t.scaleBy(this.getTileSize()).subtract(this._level.origin);
        },
        _wrapCoords: function(t) {
          var e = new S(
            this._wrapX ? ut(t.x, this._wrapX) : t.x,
            this._wrapY ? ut(t.y, this._wrapY) : t.y
          );
          return e.z = t.z, e;
        },
        _pxBoundsToTileRange: function(t) {
          var e = this.getTileSize();
          return new A(
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
      function ns(t) {
        return new wi(t);
      }
      var ri = wi.extend({
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
          this._url = t, e = tt(this, e), e.detectRetina && k.retina && e.maxZoom > 0 ? (e.tileSize = Math.floor(e.tileSize / 2), e.zoomReverse ? (e.zoomOffset--, e.minZoom = Math.min(e.maxZoom, e.minZoom + 1)) : (e.zoomOffset++, e.maxZoom = Math.max(e.minZoom, e.maxZoom - 1)), e.minZoom = Math.max(0, e.minZoom)) : e.zoomReverse ? e.minZoom = Math.min(e.maxZoom, e.minZoom) : e.maxZoom = Math.max(e.minZoom, e.maxZoom), typeof e.subdomains == "string" && (e.subdomains = e.subdomains.split("")), this.on("tileunload", this._onTileRemove);
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
          return B(i, "load", H(this._tileOnLoad, this, e, i)), B(i, "error", H(this._tileOnError, this, e, i)), (this.options.crossOrigin || this.options.crossOrigin === "") && (i.crossOrigin = this.options.crossOrigin === !0 ? "" : this.options.crossOrigin), typeof this.options.referrerPolicy == "string" && (i.referrerPolicy = this.options.referrerPolicy), i.alt = "", i.src = this.getTileUrl(t), i;
        },
        // @section Extension methods
        // @uninheritable
        // Layers extending `TileLayer` might reimplement the following method.
        // @method getTileUrl(coords: Object): String
        // Called only internally, returns the URL for a tile given its coordinates.
        // Classes extending `TileLayer` can override this function to provide custom tile URL naming schemes.
        getTileUrl: function(t) {
          var e = {
            r: k.retina ? "@2x" : "",
            s: this._getSubdomain(t),
            x: t.x,
            y: t.y,
            z: this._getZoomForUrl()
          };
          if (this._map && !this._map.options.crs.infinite) {
            var i = this._globalTileRange.max.y - t.y;
            this.options.tms && (e.y = i), e["-y"] = i;
          }
          return te(this._url, q(e, this.options));
        },
        _tileOnLoad: function(t, e) {
          k.ielt9 ? setTimeout(H(t, this, null, e), 0) : t(null, e);
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
            if (this._tiles[t].coords.z !== this._tileZoom && (e = this._tiles[t].el, e.onload = nt, e.onerror = nt, !e.complete)) {
              e.src = ee;
              var i = this._tiles[t].coords;
              rt(e), delete this._tiles[t], this.fire("tileabort", {
                tile: e,
                coords: i
              });
            }
        },
        _removeTile: function(t) {
          var e = this._tiles[t];
          if (e)
            return e.el.setAttribute("src", ee), wi.prototype._removeTile.call(this, t);
        },
        _tileReady: function(t, e, i) {
          if (!(!this._map || i && i.getAttribute("src") === ee))
            return wi.prototype._tileReady.call(this, t, e, i);
        }
      });
      function io(t, e) {
        return new ri(t, e);
      }
      var no = ri.extend({
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
          var i = q({}, this.defaultWmsParams);
          for (var n in e)
            n in this.options || (i[n] = e[n]);
          e = tt(this, e);
          var a = e.detectRetina && k.retina ? 2 : 1, r = this.getTileSize();
          i.width = r.x * a, i.height = r.y * a, this.wmsParams = i;
        },
        onAdd: function(t) {
          this._crs = this.options.crs || t.options.crs, this._wmsVersion = parseFloat(this.wmsParams.version);
          var e = this._wmsVersion >= 1.3 ? "crs" : "srs";
          this.wmsParams[e] = this._crs.code, ri.prototype.onAdd.call(this, t);
        },
        getTileUrl: function(t) {
          var e = this._tileCoordsToNwSe(t), i = this._crs, n = dt(i.project(e[0]), i.project(e[1])), a = n.min, r = n.max, u = (this._wmsVersion >= 1.3 && this._crs === Kn ? [a.y, a.x, r.y, r.x] : [a.x, a.y, r.x, r.y]).join(","), h = ri.prototype.getTileUrl.call(this, t);
          return h + Qt(this.wmsParams, h, this.options.uppercase) + (this.options.uppercase ? "&BBOX=" : "&bbox=") + u;
        },
        // @method setParams(params: Object, noRedraw?: Boolean): this
        // Merges an object with the new parameters and re-requests tiles on the current screen (unless `noRedraw` was set to true).
        setParams: function(t, e) {
          return q(this.wmsParams, t), e || this.redraw(), this;
        }
      });
      function os(t, e) {
        return new no(t, e);
      }
      ri.WMS = no, io.wms = os;
      var ve = $t.extend({
        // @section
        // @aka Renderer options
        options: {
          // @option padding: Number = 0.1
          // How much to extend the clip area around the map view (relative to its size)
          // e.g. 0.1 would be 10% of map view in each direction
          padding: 0.1
        },
        initialize: function(t) {
          tt(this, t), R(this), this._layers = this._layers || {};
        },
        onAdd: function() {
          this._container || (this._initContainer(), l(this._container, "leaflet-zoom-animated")), this.getPane().appendChild(this._container), this._update(), this.on("update", this._updatePaths, this);
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
          var i = this._map.getZoomScale(e, this._zoom), n = this._map.getSize().multiplyBy(0.5 + this.options.padding), a = this._map.project(this._center, e), r = n.multiplyBy(-i).add(a).subtract(this._map._getNewPixelOrigin(t, e));
          k.any3d ? re(this._container, r, i) : ct(this._container, r);
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
          this._bounds = new A(i, i.add(e.multiplyBy(1 + t * 2)).round()), this._center = this._map.getCenter(), this._zoom = this._map.getZoom();
        }
      }), oo = ve.extend({
        // @section
        // @aka Canvas options
        options: {
          // @option tolerance: Number = 0
          // How much to extend the click tolerance around a path/object on the map.
          tolerance: 0
        },
        getEvents: function() {
          var t = ve.prototype.getEvents.call(this);
          return t.viewprereset = this._onViewPreReset, t;
        },
        _onViewPreReset: function() {
          this._postponeUpdatePaths = !0;
        },
        onAdd: function() {
          ve.prototype.onAdd.call(this), this._draw();
        },
        _initContainer: function() {
          var t = this._container = document.createElement("canvas");
          B(t, "mousemove", this._onMouseMove, this), B(t, "click dblclick mousedown mouseup contextmenu", this._onClick, this), B(t, "mouseout", this._handleMouseOut, this), t._leaflet_disable_events = !0, this._ctx = t.getContext("2d");
        },
        _destroyContainer: function() {
          W(this._redrawRequest), delete this._ctx, rt(this._container), ot(this._container), delete this._container;
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
            ve.prototype._update.call(this);
            var t = this._bounds, e = this._container, i = t.getSize(), n = k.retina ? 2 : 1;
            ct(e, t.min), e.width = n * i.x, e.height = n * i.y, e.style.width = i.x + "px", e.style.height = i.y + "px", k.retina && this._ctx.scale(2, 2), this._ctx.translate(-t.min.x, -t.min.y), this.fire("update");
          }
        },
        _reset: function() {
          ve.prototype._reset.call(this), this._postponeUpdatePaths && (this._postponeUpdatePaths = !1, this._updatePaths());
        },
        _initPath: function(t) {
          this._updateDashArray(t), this._layers[R(t)] = t;
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
          i ? i.prev = n : this._drawLast = n, n ? n.next = i : this._drawFirst = i, delete t._order, delete this._layers[R(t)], this._requestRedraw(t);
        },
        _updatePath: function(t) {
          this._extendRedrawBounds(t), t._project(), t._update(), this._requestRedraw(t);
        },
        _updateStyle: function(t) {
          this._updateDashArray(t), this._requestRedraw(t);
        },
        _updateDashArray: function(t) {
          if (typeof t.options.dashArray == "string") {
            var e = t.options.dashArray.split(/[, ]+/), i = [], n, a;
            for (a = 0; a < e.length; a++) {
              if (n = Number(e[a]), isNaN(n))
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
            this._redrawBounds = this._redrawBounds || new A(), this._redrawBounds.extend(t._pxBounds.min.subtract([e, e])), this._redrawBounds.extend(t._pxBounds.max.add([e, e]));
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
            var i, n, a, r, u = t._parts, h = u.length, d = this._ctx;
            if (h) {
              for (d.beginPath(), i = 0; i < h; i++) {
                for (n = 0, a = u[i].length; n < a; n++)
                  r = u[i][n], d[n ? "lineTo" : "moveTo"](r.x, r.y);
                e && d.closePath();
              }
              this._fillStroke(d, t);
            }
          }
        },
        _updateCircle: function(t) {
          if (!(!this._drawing || t._empty())) {
            var e = t._point, i = this._ctx, n = Math.max(Math.round(t._radius), 1), a = (Math.max(Math.round(t._radiusY), 1) || n) / n;
            a !== 1 && (i.save(), i.scale(1, a)), i.beginPath(), i.arc(e.x, e.y / a, n, 0, Math.PI * 2, !1), a !== 1 && i.restore(), this._fillStroke(i, t);
          }
        },
        _fillStroke: function(t, e) {
          var i = e.options;
          i.fill && (t.globalAlpha = i.fillOpacity, t.fillStyle = i.fillColor || i.color, t.fill(i.fillRule || "evenodd")), i.stroke && i.weight !== 0 && (t.setLineDash && t.setLineDash(e.options && e.options._dashArray || []), t.globalAlpha = i.opacity, t.lineWidth = i.weight, t.strokeStyle = i.color, t.lineCap = i.lineCap, t.lineJoin = i.lineJoin, t.stroke());
        },
        // Canvas obviously doesn't have mouse events for individual drawn objects,
        // so we emulate that by calculating what's under the mouse on mousemove/click manually
        _onClick: function(t) {
          for (var e = this._map.mouseEventToLayerPoint(t), i, n, a = this._drawFirst; a; a = a.next)
            i = a.layer, i.options.interactive && i._containsPoint(e) && (!(t.type === "click" || t.type === "preclick") || !this._map._draggableMoved(i)) && (n = i);
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
          e && (w(this._container, "leaflet-interactive"), this._fireEvent([e], t, "mouseout"), this._hoveredLayer = null, this._mouseHoverThrottled = !1);
        },
        _handleMouseHover: function(t, e) {
          if (!this._mouseHoverThrottled) {
            for (var i, n, a = this._drawFirst; a; a = a.next)
              i = a.layer, i.options.interactive && i._containsPoint(e) && (n = i);
            n !== this._hoveredLayer && (this._handleMouseOut(t), n && (l(this._container, "leaflet-interactive"), this._fireEvent([n], t, "mouseover"), this._hoveredLayer = n)), this._fireEvent(this._hoveredLayer ? [this._hoveredLayer] : !1, t), this._mouseHoverThrottled = !0, setTimeout(H(function() {
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
      function so(t) {
        return k.canvas ? new oo(t) : null;
      }
      var xi = (function() {
        try {
          return document.namespaces.add("lvml", "urn:schemas-microsoft-com:vml"), function(t) {
            return document.createElement("<lvml:" + t + ' class="lvml">');
          };
        } catch {
        }
        return function(t) {
          return document.createElement("<" + t + ' xmlns="urn:schemas-microsoft.com:vml" class="lvml">');
        };
      })(), ss = {
        _initContainer: function() {
          this._container = $("div", "leaflet-vml-container");
        },
        _update: function() {
          this._map._animatingZoom || (ve.prototype._update.call(this), this.fire("update"));
        },
        _initPath: function(t) {
          var e = t._container = xi("shape");
          l(e, "leaflet-vml-shape " + (this.options.className || "")), e.coordsize = "1 1", t._path = xi("path"), e.appendChild(t._path), this._updateStyle(t), this._layers[R(t)] = t;
        },
        _addPath: function(t) {
          var e = t._container;
          this._container.appendChild(e), t.options.interactive && t.addInteractiveTarget(e);
        },
        _removePath: function(t) {
          var e = t._container;
          rt(e), t.removeInteractiveTarget(e), delete this._layers[R(t)];
        },
        _updateStyle: function(t) {
          var e = t._stroke, i = t._fill, n = t.options, a = t._container;
          a.stroked = !!n.stroke, a.filled = !!n.fill, n.stroke ? (e || (e = t._stroke = xi("stroke")), a.appendChild(e), e.weight = n.weight + "px", e.color = n.color, e.opacity = n.opacity, n.dashArray ? e.dashStyle = yt(n.dashArray) ? n.dashArray.join(" ") : n.dashArray.replace(/( *, *)/g, " ") : e.dashStyle = "", e.endcap = n.lineCap.replace("butt", "flat"), e.joinstyle = n.lineJoin) : e && (a.removeChild(e), t._stroke = null), n.fill ? (i || (i = t._fill = xi("fill")), a.appendChild(i), i.color = n.fillColor || n.color, i.opacity = n.fillOpacity) : i && (a.removeChild(i), t._fill = null);
        },
        _updateCircle: function(t) {
          var e = t._point.round(), i = Math.round(t._radius), n = Math.round(t._radiusY || i);
          this._setPath(t, t._empty() ? "M0 0" : "AL " + e.x + "," + e.y + " " + i + "," + n + " 0," + 65535 * 360);
        },
        _setPath: function(t, e) {
          t._path.v = e;
        },
        _bringToFront: function(t) {
          Pe(t._container);
        },
        _bringToBack: function(t) {
          c(t._container);
        }
      }, Yi = k.vml ? xi : $e, Li = ve.extend({
        _initContainer: function() {
          this._container = Yi("svg"), this._container.setAttribute("pointer-events", "none"), this._rootGroup = Yi("g"), this._container.appendChild(this._rootGroup);
        },
        _destroyContainer: function() {
          rt(this._container), ot(this._container), delete this._container, delete this._rootGroup, delete this._svgSize;
        },
        _update: function() {
          if (!(this._map._animatingZoom && this._bounds)) {
            ve.prototype._update.call(this);
            var t = this._bounds, e = t.getSize(), i = this._container;
            (!this._svgSize || !this._svgSize.equals(e)) && (this._svgSize = e, i.setAttribute("width", e.x), i.setAttribute("height", e.y)), ct(i, t.min), i.setAttribute("viewBox", [t.min.x, t.min.y, e.x, e.y].join(" ")), this.fire("update");
          }
        },
        // methods below are called by vector layers implementations
        _initPath: function(t) {
          var e = t._path = Yi("path");
          t.options.className && l(e, t.options.className), t.options.interactive && l(e, "leaflet-interactive"), this._updateStyle(t), this._layers[R(t)] = t;
        },
        _addPath: function(t) {
          this._rootGroup || this._initContainer(), this._rootGroup.appendChild(t._path), t.addInteractiveTarget(t._path);
        },
        _removePath: function(t) {
          rt(t._path), t.removeInteractiveTarget(t._path), delete this._layers[R(t)];
        },
        _updatePath: function(t) {
          t._project(), t._update();
        },
        _updateStyle: function(t) {
          var e = t._path, i = t.options;
          e && (i.stroke ? (e.setAttribute("stroke", i.color), e.setAttribute("stroke-opacity", i.opacity), e.setAttribute("stroke-width", i.weight), e.setAttribute("stroke-linecap", i.lineCap), e.setAttribute("stroke-linejoin", i.lineJoin), i.dashArray ? e.setAttribute("stroke-dasharray", i.dashArray) : e.removeAttribute("stroke-dasharray"), i.dashOffset ? e.setAttribute("stroke-dashoffset", i.dashOffset) : e.removeAttribute("stroke-dashoffset")) : e.setAttribute("stroke", "none"), i.fill ? (e.setAttribute("fill", i.fillColor || i.color), e.setAttribute("fill-opacity", i.fillOpacity), e.setAttribute("fill-rule", i.fillRule || "evenodd")) : e.setAttribute("fill", "none"));
        },
        _updatePoly: function(t, e) {
          this._setPath(t, ci(t._parts, e));
        },
        _updateCircle: function(t) {
          var e = t._point, i = Math.max(Math.round(t._radius), 1), n = Math.max(Math.round(t._radiusY), 1) || i, a = "a" + i + "," + n + " 0 1,0 ", r = t._empty() ? "M0 0" : "M" + (e.x - i) + "," + e.y + a + i * 2 + ",0 " + a + -i * 2 + ",0 ";
          this._setPath(t, r);
        },
        _setPath: function(t, e) {
          t._path.setAttribute("d", e);
        },
        // SVG does not have the concept of zIndex so we resort to changing the DOM order of elements
        _bringToFront: function(t) {
          Pe(t._path);
        },
        _bringToBack: function(t) {
          c(t._path);
        }
      });
      k.vml && Li.include(ss);
      function ao(t) {
        return k.svg || k.vml ? new Li(t) : null;
      }
      K.include({
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
          return this.options.preferCanvas && so(t) || ao(t);
        }
      });
      var ro = si.extend({
        initialize: function(t, e) {
          si.prototype.initialize.call(this, this._boundsToLatLngs(t), e);
        },
        // @method setBounds(latLngBounds: LatLngBounds): this
        // Redraws the rectangle with the passed bounds.
        setBounds: function(t) {
          return this.setLatLngs(this._boundsToLatLngs(t));
        },
        _boundsToLatLngs: function(t) {
          return t = pt(t), [
            t.getSouthWest(),
            t.getNorthWest(),
            t.getNorthEast(),
            t.getSouthEast()
          ];
        }
      });
      function as(t, e) {
        return new ro(t, e);
      }
      Li.create = Yi, Li.pointsToPath = ci, me.geometryToLayer = Wi, me.coordsToLatLng = Cn, me.coordsToLatLngs = ji, me.latLngToCoords = Sn, me.latLngsToCoords = Gi, me.getFeature = ai, me.asFeature = qi, K.mergeOptions({
        // @option boxZoom: Boolean = true
        // Whether the map can be zoomed to a rectangular area specified by
        // dragging the mouse while pressing the shift key.
        boxZoom: !0
      });
      var lo = ue.extend({
        initialize: function(t) {
          this._map = t, this._container = t._container, this._pane = t._panes.overlayPane, this._resetStateTimeout = 0, t.on("unload", this._destroy, this);
        },
        addHooks: function() {
          B(this._container, "mousedown", this._onMouseDown, this);
        },
        removeHooks: function() {
          ot(this._container, "mousedown", this._onMouseDown, this);
        },
        moved: function() {
          return this._moved;
        },
        _destroy: function() {
          rt(this._pane), delete this._pane;
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
          this._clearDeferredResetState(), this._resetState(), j(), ft(), this._startPoint = this._map.mouseEventToContainerPoint(t), B(document, {
            contextmenu: Ue,
            mousemove: this._onMouseMove,
            mouseup: this._onMouseUp,
            keydown: this._onKeyDown
          }, this);
        },
        _onMouseMove: function(t) {
          this._moved || (this._moved = !0, this._box = $("div", "leaflet-zoom-box", this._container), l(this._container, "leaflet-crosshair"), this._map.fire("boxzoomstart")), this._point = this._map.mouseEventToContainerPoint(t);
          var e = new A(this._point, this._startPoint), i = e.getSize();
          ct(this._box, e.min), this._box.style.width = i.x + "px", this._box.style.height = i.y + "px";
        },
        _finish: function() {
          this._moved && (rt(this._box), w(this._container, "leaflet-crosshair")), et(), dn(), ot(document, {
            contextmenu: Ue,
            mousemove: this._onMouseMove,
            mouseup: this._onMouseUp,
            keydown: this._onKeyDown
          }, this);
        },
        _onMouseUp: function(t) {
          if (!(t.which !== 1 && t.button !== 1) && (this._finish(), !!this._moved)) {
            this._clearDeferredResetState(), this._resetStateTimeout = setTimeout(H(this._resetState, this), 0);
            var e = new Tt(
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
      K.addInitHook("addHandler", "boxZoom", lo), K.mergeOptions({
        // @option doubleClickZoom: Boolean|String = true
        // Whether the map can be zoomed in by double clicking on it and
        // zoomed out by double clicking while holding shift. If passed
        // `'center'`, double-click zoom will zoom to the center of the
        //  view regardless of where the mouse was.
        doubleClickZoom: !0
      });
      var uo = ue.extend({
        addHooks: function() {
          this._map.on("dblclick", this._onDoubleClick, this);
        },
        removeHooks: function() {
          this._map.off("dblclick", this._onDoubleClick, this);
        },
        _onDoubleClick: function(t) {
          var e = this._map, i = e.getZoom(), n = e.options.zoomDelta, a = t.originalEvent.shiftKey ? i - n : i + n;
          e.options.doubleClickZoom === "center" ? e.setZoom(a) : e.setZoomAround(t.containerPoint, a);
        }
      });
      K.addInitHook("addHandler", "doubleClickZoom", uo), K.mergeOptions({
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
      var ho = ue.extend({
        addHooks: function() {
          if (!this._draggable) {
            var t = this._map;
            this._draggable = new Te(t._mapPane, t._container), this._draggable.on({
              dragstart: this._onDragStart,
              drag: this._onDrag,
              dragend: this._onDragEnd
            }, this), this._draggable.on("predrag", this._onPreDragLimit, this), t.options.worldCopyJump && (this._draggable.on("predrag", this._onPreDragWrap, this), t.on("zoomend", this._onZoomEnd, this), t.whenReady(this._onZoomEnd, this));
          }
          l(this._map._container, "leaflet-grab leaflet-touch-drag"), this._draggable.enable(), this._positions = [], this._times = [];
        },
        removeHooks: function() {
          w(this._map._container, "leaflet-grab"), w(this._map._container, "leaflet-touch-drag"), this._draggable.disable();
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
            var e = pt(this._map.options.maxBounds);
            this._offsetLimit = dt(
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
          var t = this._worldWidth, e = Math.round(t / 2), i = this._initialWorldOffset, n = this._draggable._newPos.x, a = (n - e + i) % t + e - i, r = (n + e + i) % t - e - i, u = Math.abs(a + i) < Math.abs(r + i) ? a : r;
          this._draggable._absPos = this._draggable._newPos.clone(), this._draggable._newPos.x = u;
        },
        _onDragEnd: function(t) {
          var e = this._map, i = e.options, n = !i.inertia || t.noInertia || this._times.length < 2;
          if (e.fire("dragend", t), n)
            e.fire("moveend");
          else {
            this._prunePositions(+/* @__PURE__ */ new Date());
            var a = this._lastPos.subtract(this._positions[0]), r = (this._lastTime - this._times[0]) / 1e3, u = i.easeLinearity, h = a.multiplyBy(u / r), d = h.distanceTo([0, 0]), _ = Math.min(i.inertiaMaxSpeed, d), x = h.multiplyBy(_ / d), O = _ / (i.inertiaDeceleration * u), U = x.multiplyBy(-O / 2).round();
            !U.x && !U.y ? e.fire("moveend") : (U = e._limitOffset(U, e.options.maxBounds), z(function() {
              e.panBy(U, {
                duration: O,
                easeLinearity: u,
                noMoveStart: !0,
                animate: !0
              });
            }));
          }
        }
      });
      K.addInitHook("addHandler", "dragging", ho), K.mergeOptions({
        // @option keyboard: Boolean = true
        // Makes the map focusable and allows users to navigate the map with keyboard
        // arrows and `+`/`-` keys.
        keyboard: !0,
        // @option keyboardPanDelta: Number = 80
        // Amount of pixels to pan when pressing an arrow key.
        keyboardPanDelta: 80
      });
      var co = ue.extend({
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
          this._removeHooks(), ot(this._map._container, {
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
          var e = this._panKeys = {}, i = this.keyCodes, n, a;
          for (n = 0, a = i.left.length; n < a; n++)
            e[i.left[n]] = [-1 * t, 0];
          for (n = 0, a = i.right.length; n < a; n++)
            e[i.right[n]] = [t, 0];
          for (n = 0, a = i.down.length; n < a; n++)
            e[i.down[n]] = [0, t];
          for (n = 0, a = i.up.length; n < a; n++)
            e[i.up[n]] = [0, -1 * t];
        },
        _setZoomDelta: function(t) {
          var e = this._zoomKeys = {}, i = this.keyCodes, n, a;
          for (n = 0, a = i.zoomIn.length; n < a; n++)
            e[i.zoomIn[n]] = t;
          for (n = 0, a = i.zoomOut.length; n < a; n++)
            e[i.zoomOut[n]] = -t;
        },
        _addHooks: function() {
          B(document, "keydown", this._onKeyDown, this);
        },
        _removeHooks: function() {
          ot(document, "keydown", this._onKeyDown, this);
        },
        _onKeyDown: function(t) {
          if (!(t.altKey || t.ctrlKey || t.metaKey)) {
            var e = t.keyCode, i = this._map, n;
            if (e in this._panKeys) {
              if (!i._panAnim || !i._panAnim._inProgress)
                if (n = this._panKeys[e], t.shiftKey && (n = I(n).multiplyBy(3)), i.options.maxBounds && (n = i._limitOffset(I(n), i.options.maxBounds)), i.options.worldCopyJump) {
                  var a = i.wrapLatLng(i.unproject(i.project(i.getCenter()).add(n)));
                  i.panTo(a);
                } else
                  i.panBy(n);
            } else if (e in this._zoomKeys)
              i.setZoom(i.getZoom() + (t.shiftKey ? 3 : 1) * this._zoomKeys[e]);
            else if (e === 27 && i._popup && i._popup.options.closeOnEscapeKey)
              i.closePopup();
            else
              return;
            Ue(t);
          }
        }
      });
      K.addInitHook("addHandler", "keyboard", co), K.mergeOptions({
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
      var fo = ue.extend({
        addHooks: function() {
          B(this._map._container, "wheel", this._onWheelScroll, this), this._delta = 0;
        },
        removeHooks: function() {
          ot(this._map._container, "wheel", this._onWheelScroll, this);
        },
        _onWheelScroll: function(t) {
          var e = Bn(t), i = this._map.options.wheelDebounceTime;
          this._delta += e, this._lastMousePos = this._map.mouseEventToContainerPoint(t), this._startTime || (this._startTime = +/* @__PURE__ */ new Date());
          var n = Math.max(i - (+/* @__PURE__ */ new Date() - this._startTime), 0);
          clearTimeout(this._timer), this._timer = setTimeout(H(this._performZoom, this), n), Ue(t);
        },
        _performZoom: function() {
          var t = this._map, e = t.getZoom(), i = this._map.options.zoomSnap || 0;
          t._stop();
          var n = this._delta / (this._map.options.wheelPxPerZoomLevel * 4), a = 4 * Math.log(2 / (1 + Math.exp(-Math.abs(n)))) / Math.LN2, r = i ? Math.ceil(a / i) * i : a, u = t._limitZoom(e + (this._delta > 0 ? r : -r)) - e;
          this._delta = 0, this._startTime = null, u && (t.options.scrollWheelZoom === "center" ? t.setZoom(e + u) : t.setZoomAround(this._lastMousePos, e + u));
        }
      });
      K.addInitHook("addHandler", "scrollWheelZoom", fo);
      var rs = 600;
      K.mergeOptions({
        // @section Touch interaction options
        // @option tapHold: Boolean
        // Enables simulation of `contextmenu` event, default is `true` for mobile Safari.
        tapHold: k.touchNative && k.safari && k.mobile,
        // @option tapTolerance: Number = 15
        // The max number of pixels a user can shift his finger during touch
        // for it to be considered a valid tap.
        tapTolerance: 15
      });
      var po = ue.extend({
        addHooks: function() {
          B(this._map._container, "touchstart", this._onDown, this);
        },
        removeHooks: function() {
          ot(this._map._container, "touchstart", this._onDown, this);
        },
        _onDown: function(t) {
          if (clearTimeout(this._holdTimeout), t.touches.length === 1) {
            var e = t.touches[0];
            this._startPos = this._newPos = new S(e.clientX, e.clientY), this._holdTimeout = setTimeout(H(function() {
              this._cancel(), this._isTapValid() && (B(document, "touchend", Mt), B(document, "touchend touchcancel", this._cancelClickPrevent), this._simulateEvent("contextmenu", e));
            }, this), rs), B(document, "touchend touchcancel contextmenu", this._cancel, this), B(document, "touchmove", this._onMove, this);
          }
        },
        _cancelClickPrevent: function t() {
          ot(document, "touchend", Mt), ot(document, "touchend touchcancel", t);
        },
        _cancel: function() {
          clearTimeout(this._holdTimeout), ot(document, "touchend touchcancel contextmenu", this._cancel, this), ot(document, "touchmove", this._onMove, this);
        },
        _onMove: function(t) {
          var e = t.touches[0];
          this._newPos = new S(e.clientX, e.clientY);
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
      K.addInitHook("addHandler", "tapHold", po), K.mergeOptions({
        // @section Touch interaction options
        // @option touchZoom: Boolean|String = *
        // Whether the map can be zoomed by touch-dragging with two fingers. If
        // passed `'center'`, it will zoom to the center of the view regardless of
        // where the touch events (fingers) were. Enabled for touch-capable web
        // browsers.
        touchZoom: k.touch,
        // @option bounceAtZoomLimits: Boolean = true
        // Set it to false if you don't want the map to zoom beyond min/max zoom
        // and then bounce back when pinch-zooming.
        bounceAtZoomLimits: !0
      });
      var _o = ue.extend({
        addHooks: function() {
          l(this._map._container, "leaflet-touch-zoom"), B(this._map._container, "touchstart", this._onTouchStart, this);
        },
        removeHooks: function() {
          w(this._map._container, "leaflet-touch-zoom"), ot(this._map._container, "touchstart", this._onTouchStart, this);
        },
        _onTouchStart: function(t) {
          var e = this._map;
          if (!(!t.touches || t.touches.length !== 2 || e._animatingZoom || this._zooming)) {
            var i = e.mouseEventToContainerPoint(t.touches[0]), n = e.mouseEventToContainerPoint(t.touches[1]);
            this._centerPoint = e.getSize()._divideBy(2), this._startLatLng = e.containerPointToLatLng(this._centerPoint), e.options.touchZoom !== "center" && (this._pinchStartLatLng = e.containerPointToLatLng(i.add(n)._divideBy(2))), this._startDist = i.distanceTo(n), this._startZoom = e.getZoom(), this._moved = !1, this._zooming = !0, e._stop(), B(document, "touchmove", this._onTouchMove, this), B(document, "touchend touchcancel", this._onTouchEnd, this), Mt(t);
          }
        },
        _onTouchMove: function(t) {
          if (!(!t.touches || t.touches.length !== 2 || !this._zooming)) {
            var e = this._map, i = e.mouseEventToContainerPoint(t.touches[0]), n = e.mouseEventToContainerPoint(t.touches[1]), a = i.distanceTo(n) / this._startDist;
            if (this._zoom = e.getScaleZoom(a, this._startZoom), !e.options.bounceAtZoomLimits && (this._zoom < e.getMinZoom() && a < 1 || this._zoom > e.getMaxZoom() && a > 1) && (this._zoom = e._limitZoom(this._zoom)), e.options.touchZoom === "center") {
              if (this._center = this._startLatLng, a === 1)
                return;
            } else {
              var r = i._add(n)._divideBy(2)._subtract(this._centerPoint);
              if (a === 1 && r.x === 0 && r.y === 0)
                return;
              this._center = e.unproject(e.project(this._pinchStartLatLng, this._zoom).subtract(r), this._zoom);
            }
            this._moved || (e._moveStart(!0, !1), this._moved = !0), W(this._animRequest);
            var u = H(e._move, e, this._center, this._zoom, { pinch: !0, round: !1 }, void 0);
            this._animRequest = z(u, this, !0), Mt(t);
          }
        },
        _onTouchEnd: function() {
          if (!this._moved || !this._zooming) {
            this._zooming = !1;
            return;
          }
          this._zooming = !1, W(this._animRequest), ot(document, "touchmove", this._onTouchMove, this), ot(document, "touchend touchcancel", this._onTouchEnd, this), this._map.options.zoomAnimation ? this._map._animateZoom(this._center, this._map._limitZoom(this._zoom), !0, this._map.options.zoomSnap) : this._map._resetView(this._center, this._map._limitZoom(this._zoom));
        }
      });
      K.addInitHook("addHandler", "touchZoom", _o), K.BoxZoom = lo, K.DoubleClickZoom = uo, K.Drag = ho, K.Keyboard = co, K.ScrollWheelZoom = fo, K.TapHold = po, K.TouchZoom = _o, f.Bounds = A, f.Browser = k, f.CRS = Gt, f.Canvas = oo, f.Circle = kn, f.CircleMarker = Hi, f.Class = xt, f.Control = qt, f.DivIcon = eo, f.DivOverlay = he, f.DomEvent = To, f.DomUtil = Lo, f.Draggable = Te, f.Evented = Wt, f.FeatureGroup = pe, f.GeoJSON = me, f.GridLayer = wi, f.Handler = ue, f.Icon = oi, f.ImageOverlay = $i, f.LatLng = Q, f.LatLngBounds = Tt, f.Layer = $t, f.LayerGroup = ni, f.LineUtil = Ro, f.Map = K, f.Marker = Fi, f.Mixin = Oo, f.Path = ke, f.Point = S, f.PolyUtil = Zo, f.Polygon = si, f.Polyline = _e, f.Popup = Ki, f.PosAnimation = Nn, f.Projection = Do, f.Rectangle = ro, f.Renderer = ve, f.SVG = Li, f.SVGOverlay = to, f.TileLayer = ri, f.Tooltip = Ji, f.Transformation = di, f.Util = it, f.VideoOverlay = Qn, f.bind = H, f.bounds = dt, f.canvas = so, f.circle = qo, f.circleMarker = Go, f.control = gi, f.divIcon = is, f.extend = q, f.featureGroup = Ho, f.geoJSON = Xn, f.geoJson = Jo, f.gridLayer = ns, f.icon = Wo, f.imageOverlay = Yo, f.latLng = F, f.latLngBounds = pt, f.layerGroup = Fo, f.map = ko, f.marker = jo, f.point = I, f.polygon = Ko, f.polyline = $o, f.popup = ts, f.rectangle = as, f.setOptions = tt, f.stamp = R, f.svg = ao, f.svgOverlay = Qo, f.tileLayer = io, f.tooltip = es, f.transformation = Se, f.version = Et, f.videoOverlay = Xo;
      var ls = window.L;
      f.noConflict = function() {
        return window.L = ls, this;
      }, window.L = f;
    }));
  })(Ti, Ti.exports)), Ti.exports;
}
var Ms = Ss();
const M = /* @__PURE__ */ ks(Ms), zs = ["aria-expanded", "aria-controls", "aria-activedescendant", "aria-label", "disabled"], Es = { class: "app-select-value" }, Os = {
  class: "app-select-chevron",
  "aria-hidden": "true"
}, Zs = ["id", "aria-label"], Is = ["id", "aria-selected", "aria-disabled", "data-index", "onPointermove", "onClick"], As = {
  key: 0,
  class: "app-select-check",
  "aria-hidden": "true"
}, Bs = {
  key: 0,
  class: "app-select-empty"
}, Kt = /* @__PURE__ */ wo({
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
  setup(zt, { emit: ge }) {
    const f = zt, Et = ge;
    let q = 0;
    const Dt = (y) => `${y}-${++q}`, H = J("zh-CN"), Xt = J(null), R = J(null), X = J(!1), ut = J(-1), nt = J({}), gt = J(!1), Pt = Dt("select"), ht = st(() => f.options.map((y) => typeof y == "string" ? { value: y, label: y } : y)), tt = st(() => ht.value.find((y) => y.value === f.modelValue)?.label || f.modelValue || f.placeholder);
    let Qt = "", We = 0;
    function te() {
      const y = Xt.value?.getBoundingClientRect();
      if (!y) return;
      const z = window.visualViewport?.height || innerHeight, W = window.visualViewport?.width || innerWidth, it = z - y.bottom - 10, xt = y.top - 10;
      gt.value = y.top >= Math.min(320, ht.value.length * 46 + 12) + 8 || it < Math.min(320, ht.value.length * 46 + 12) && xt > it;
      const Ge = Math.max(48, Math.min(340, gt.value ? xt : it)), Lt = Math.min(Math.max(y.width, 220), W - 16);
      nt.value = { position: "fixed", left: `${Math.max(8, Math.min(y.left, W - Lt - 8))}px`, width: `${Lt}px`, maxHeight: `${Ge}px`, ...gt.value ? { bottom: `${z - y.top + 8}px` } : { top: `${y.bottom + 8}px` } };
    }
    function yt(y = !1) {
      X.value = !1, Qt = "", y && Xt.value?.focus();
    }
    async function de() {
      f.disabled || X.value || (X.value = !0, ut.value = ht.value.findIndex((y) => y.value === f.modelValue && !y.disabled), ut.value < 0 && (ut.value = ht.value.findIndex((y) => !y.disabled)), te(), await Pi(), ee());
    }
    function ee() {
      R.value?.querySelector(`[data-index="${ut.value}"]`)?.scrollIntoView({ block: "nearest" });
    }
    function ce(y) {
      const z = ht.value[y];
      !z || z.disabled || (Et("update:modelValue", z.value), Et("change", z.value), yt(!0));
    }
    async function je(y) {
      if (!(f.disabled || y.isComposing)) {
        if (y.key === "Tab") {
          yt();
          return;
        }
        if (y.key === "Escape") {
          X.value && (y.preventDefault(), yt(!0));
          return;
        }
        if (["ArrowDown", "ArrowUp", "Home", "End", "Enter", " "].includes(y.key)) {
          if (y.preventDefault(), !X.value) {
            await de();
            return;
          }
          if (y.key === "Enter" || y.key === " ") {
            ce(ut.value);
            return;
          }
          const z = ht.value.map((it, xt) => it.disabled ? -1 : xt).filter((it) => it >= 0);
          if (!z.length) return;
          const W = z.indexOf(ut.value);
          ut.value = y.key === "Home" ? z[0] : y.key === "End" ? z[z.length - 1] : z[(W + (y.key === "ArrowDown" ? 1 : -1) + z.length) % z.length], await Pi(), ee();
          return;
        }
        if (y.key.length === 1 && !y.ctrlKey && !y.metaKey && !y.altKey) {
          await de();
          const z = Date.now();
          Qt = z - We > 700 ? y.key : Qt + y.key, We = z;
          const W = ht.value.findIndex((it) => !it.disabled && it.label.toLocaleLowerCase().startsWith(Qt.toLocaleLowerCase()));
          W >= 0 && (ut.value = W, await Pi(), ee());
        }
      }
    }
    function Ce(y) {
      const z = y.target;
      !Xt.value?.contains(z) && !R.value?.contains(z) && yt();
    }
    function ye(y) {
      X.value && (!(y.target instanceof Node) || !R.value?.contains(y.target)) && te();
    }
    return He(() => f.disabled, (y) => {
      y && yt();
    }), He(ht, () => {
      X.value && (ut.value >= ht.value.length && (ut.value = ht.value.findIndex((y) => !y.disabled)), Pi(te));
    }), En(() => {
      document.addEventListener("pointerdown", Ce, !0), window.addEventListener("resize", te), window.addEventListener("scroll", ye, !0);
    }), xo(() => {
      document.removeEventListener("pointerdown", Ce, !0), window.removeEventListener("resize", te), window.removeEventListener("scroll", ye, !0);
    }), (y, z) => (P(), T("div", vs(y.$attrs, {
      class: ["app-select", { "is-disabled": zt.disabled, "is-open": X.value }]
    }), [
      s("button", {
        ref_key: "trigger",
        ref: Xt,
        type: "button",
        class: "app-select-trigger",
        role: "combobox",
        "aria-haspopup": "listbox",
        "aria-expanded": X.value,
        "aria-controls": X.value ? Qi(Pt) : void 0,
        "aria-activedescendant": X.value && ut.value >= 0 ? `${Qi(Pt)}-${ut.value}` : void 0,
        "aria-label": zt.ariaLabel,
        disabled: zt.disabled,
        onClick: z[0] || (z[0] = (W) => X.value ? yt() : de()),
        onKeydown: je
      }, [
        s("span", Es, m(tt.value), 1),
        s("span", Os, [
          (P(), T("svg", {
            class: Yt({ "is-open": X.value }),
            width: "18",
            height: "18",
            viewBox: "0 0 24 24",
            fill: "none"
          }, [...z[2] || (z[2] = [
            s("path", {
              d: "m6 9 6 6 6-6",
              stroke: "currentColor",
              "stroke-width": "1.9",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            }, null, -1)
          ])], 2))
        ])
      ], 40, zs),
      (P(), gs(ys, { to: "body" }, [
        Rt(bs, { name: "select-menu" }, {
          default: ws(() => [
            X.value ? (P(), T("div", {
              key: 0,
              id: Qi(Pt),
              ref_key: "menu",
              ref: R,
              class: Yt(["app-select-menu", { "opens-up": gt.value }]),
              style: en(nt.value),
              role: "listbox",
              "aria-label": zt.ariaLabel || "选项",
              onPointerdown: z[1] || (z[1] = yo(() => {
              }, ["prevent"]))
            }, [
              (P(!0), T(wt, null, Jt(ht.value, (W, it) => (P(), T("div", {
                id: `${Qi(Pt)}-${it}`,
                key: `${W.value}:${it}`,
                role: "option",
                "aria-selected": W.value === zt.modelValue,
                "aria-disabled": !!W.disabled,
                "data-index": it,
                class: Yt(["app-select-option", { highlighted: ut.value === it, selected: W.value === zt.modelValue, disabled: W.disabled }]),
                onPointermove: (xt) => !W.disabled && (ut.value = it),
                onClick: yo((xt) => ce(it), ["stop"])
              }, [
                s("span", null, m(W.label), 1),
                W.value === zt.modelValue ? (P(), T("span", As, [...z[3] || (z[3] = [
                  s("svg", {
                    width: "16",
                    height: "16",
                    viewBox: "0 0 24 24",
                    fill: "none"
                  }, [
                    s("path", {
                      d: "m5 12 4 4L19 6",
                      stroke: "currentColor",
                      "stroke-width": "2.4",
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round"
                    })
                  ], -1)
                ])])) : G("", !0)
              ], 42, Is))), 128)),
              ht.value.length ? G("", !0) : (P(), T("div", Bs, m(H.value === "en" ? "No options available" : "暂无可选项"), 1))
            ], 46, Zs)) : G("", !0)
          ]),
          _: 1
        })
      ]))
    ], 16));
  }
}), Ns = { class: "hero" }, Rs = { class: "hero-main" }, Ds = { class: "hero-actions" }, Vs = ["disabled"], Us = ["disabled"], Fs = ["disabled"], Hs = { class: "state-row" }, Ws = { class: "pill soft" }, js = { class: "pill soft" }, Gs = { class: "pill soft" }, qs = {
  key: 0,
  class: "banner err"
}, $s = {
  key: 1,
  class: "banner ok"
}, Ks = {
  class: "tabs",
  "aria-label": "视图"
}, Js = ["onClick"], Ys = { class: "tab-ic" }, Xs = { class: "panel" }, Qs = { class: "section-head" }, ta = { class: "head-actions" }, ea = ["disabled"], ia = ["disabled"], na = { class: "card" }, oa = { class: "settings-grid" }, sa = { class: "pfield" }, aa = { class: "pfield" }, ra = { class: "pfield" }, la = { class: "pfield" }, ua = {
  key: 0,
  class: "card"
}, ha = { class: "count-pill ok" }, da = { class: "settings-grid" }, ca = { class: "hint" }, fa = {
  key: 0,
  class: "hint"
}, pa = { class: "settings-grid" }, _a = { class: "settings-grid" }, ma = { class: "pdetails" }, va = {
  class: "settings-grid",
  style: { "margin-top": "10px" }
}, ga = { class: "settings-grid" }, ya = ["value"], ba = {
  key: 2,
  class: "hint"
}, wa = { class: "panel" }, xa = { class: "card" }, La = { class: "settings-grid" }, Pa = { class: "cog-metric" }, Ta = { class: "cog-metric" }, ka = { class: "cog-metric" }, Ca = { class: "cog-metric" }, Sa = { class: "cog-metric" }, Ma = { class: "cog-metric" }, za = {
  key: 0,
  class: "hint"
}, Ea = {
  key: 1,
  class: "hint"
}, Oa = {
  key: 2,
  class: "hint"
}, Za = { style: { display: "flex", gap: "12px", "align-items": "center", "flex-wrap": "wrap", "margin-top": "10px" } }, Ia = { class: "sw" }, Aa = ["disabled"], Ba = { class: "card" }, Na = {
  key: 0,
  class: "empty"
}, Ra = {
  key: 1,
  class: "settings-grid"
}, Da = { class: "cog-metric" }, Va = { class: "cog-metric" }, Ua = { class: "cog-metric" }, Fa = { class: "cog-metric" }, Ha = { class: "cog-metric" }, Wa = { class: "cog-metric" }, ja = { class: "cog-metric" }, Ga = { class: "cog-metric" }, qa = { class: "cog-metric" }, $a = { class: "cog-metric" }, Ka = { class: "cog-metric" }, Ja = { class: "cog-metric" }, Ya = { class: "cog-metric" }, Xa = { class: "cog-metric" }, Qa = { class: "cog-metric" }, tr = { class: "cog-metric" }, er = { class: "cog-metric" }, ir = { class: "cog-metric" }, nr = { class: "cog-metric" }, or = { class: "cog-metric" }, sr = { class: "cog-metric" }, ar = { class: "cog-metric" }, rr = { class: "cog-metric" }, lr = { class: "cog-metric" }, ur = { class: "cog-metric" }, hr = { class: "cog-metric" }, dr = {
  key: 0,
  class: "cog-metric"
}, cr = {
  key: 2,
  class: "hint"
}, fr = {
  key: 3,
  class: "hint"
}, pr = {
  key: 4,
  class: "hint"
}, _r = {
  key: 5,
  class: "som-channels"
}, mr = { class: "som-chan-name" }, vr = { class: "som-chan-bar" }, gr = { class: "som-chan-val" }, yr = {
  key: 0,
  class: "hint"
}, br = { class: "card" }, wr = { class: "switches" }, xr = { class: "sw" }, Lr = { class: "sw" }, Pr = { class: "sw" }, Tr = { class: "sw" }, kr = { class: "sw" }, Cr = { class: "card" }, Sr = { class: "preset-row" }, Mr = ["onClick"], zr = { class: "grid2" }, Er = { class: "card" }, Or = { class: "settings-grid" }, Zr = { class: "switches" }, Ir = { class: "sw" }, Ar = { class: "sw" }, Br = { class: "sw" }, Nr = { class: "sw" }, Rr = { class: "sw" }, Dr = { class: "card" }, Vr = { class: "settings-grid" }, Ur = { class: "sw" }, Fr = { class: "sw" }, Hr = { class: "sw" }, Wr = { class: "card" }, jr = { class: "settings-grid" }, Gr = { class: "sw" }, qr = { class: "card" }, $r = { class: "settings-grid" }, Kr = { class: "sw" }, Jr = { class: "card" }, Yr = { class: "settings-grid" }, Xr = { class: "sw" }, Qr = { class: "card" }, tl = { class: "sw" }, el = { class: "settings-grid" }, il = { class: "card" }, nl = { class: "switches" }, ol = { class: "sw" }, sl = { class: "sw" }, al = { class: "sw" }, rl = { class: "sw" }, ll = { class: "panel" }, ul = { class: "card" }, hl = { class: "settings-grid" }, dl = { class: "card" }, cl = { class: "world-field" }, fl = { class: "card" }, pl = { class: "settings-grid" }, _l = { class: "world-field" }, ml = { class: "world-field" }, vl = { class: "world-field" }, gl = { class: "world-actions" }, yl = ["disabled"], bl = ["disabled"], wl = { class: "card" }, xl = { class: "wm-head" }, Ll = { class: "count-pill" }, Pl = {
  key: 0,
  class: "wm-place"
}, Tl = {
  key: 0,
  class: "hint wm-premise"
}, kl = { class: "wm-map-wrap" }, Cl = {
  key: 0,
  class: "wm-offline"
}, Sl = {
  key: 1,
  class: "wm-compass",
  "aria-hidden": "true"
}, Ml = {
  key: 1,
  class: "empty"
}, zl = {
  key: 2,
  class: "wm-legend"
}, El = {
  key: 3,
  class: "wm-routes"
}, Ol = {
  key: 0,
  class: "wm-routes-col"
}, Zl = {
  key: 1,
  class: "wm-routes-col"
}, Il = { class: "card" }, Al = { class: "wm-head" }, Bl = { class: "count-pill" }, Nl = { class: "feed" }, Rl = { class: "meta" }, Dl = {
  key: 0,
  class: "empty"
}, Vl = { class: "panel" }, Ul = { class: "card" }, Fl = { class: "count-pill" }, Hl = { class: "feed" }, Wl = { class: "meta" }, jl = {
  key: 0,
  class: "empty"
}, Gl = { class: "grid2" }, ql = { class: "card" }, $l = { class: "feed" }, Kl = { class: "meta" }, Jl = { class: "meta" }, Yl = { class: "meta" }, Xl = {
  key: 0,
  class: "empty"
}, Ql = { class: "card" }, tu = { class: "feed" }, eu = { class: "meta" }, iu = {
  key: 0,
  class: "empty"
}, nu = { class: "section" }, ou = { class: "grid2" }, su = { class: "card" }, au = { style: { "margin-top": "14px", display: "flex", gap: "10px", "flex-wrap": "wrap" } }, ru = ["disabled"], lu = "https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}", uu = /* @__PURE__ */ wo({
  __name: "CompanionPage",
  setup(zt) {
    const { confirm: ge } = Ps(), f = J({ settings: {}, cognition: null }), Et = J(!1), q = J(""), Dt = J(""), H = J("cognition"), Xt = J(null), R = [
      { key: "cognition", i: "01", label: "认知", icon: "◉" },
      { key: "persona", i: "02", label: "人设", icon: "✎" },
      { key: "world", i: "03", label: "世界", icon: "✦" },
      { key: "state", i: "04", label: "状态", icon: "☺" }
    ];
    function X(c) {
      Dt.value = c, setTimeout(() => {
        Dt.value === c && (Dt.value = "");
      }, 2500);
    }
    function ut(c) {
      const o = String(c?.message || c || "");
      return /connection refused|Unavailable|actively refused|dial tcp|ECONNREFUSED|LIFE is unavailable|life unavailable|502|503/i.test(o) ? "LIFE 服务暂时未就绪（可能正在启动或重启），已自动重试。稍候刷新即可。" : o || "操作失败";
    }
    const nt = (c) => new Promise((o) => setTimeout(o, c));
    async function gt(c = 0) {
      Et.value = !0, q.value = "";
      try {
        const o = await fetch("/api/life/companion");
        if (!o.ok) throw Error(await o.text() || String(o.status));
        f.value = await o.json(), Zi(), Et.value = !1;
      } catch (o) {
        if (c < 4)
          return await nt(1500), gt(c + 1);
        q.value = ut(o), Et.value = !1;
      }
    }
    async function Pt(c, o) {
      for (let l = 0; l < 3; l++)
        try {
          const w = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: c, payload: o }) });
          if (!w.ok) throw Error(await w.text());
          const C = await w.json().catch(() => ({}));
          return await gt(), C;
        } catch (w) {
          if (l < 2 && /connection refused|Unavailable|actively refused|dial tcp|502|503|life unavailable/i.test(String(w?.message || w))) {
            await nt(1200);
            continue;
          }
          return q.value = ut(w), null;
        }
      return null;
    }
    function ht(c) {
      H.value = c;
      const o = matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", l = Xt.value;
      l ? l.scrollTo({ top: 0, behavior: o }) : window.scrollTo({ top: 0, behavior: o });
    }
    const tt = {
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
    }, Qt = [
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
    ], We = ["cog_affect_profile", "cog_language_framing", "cog_attachment_type"], te = ["独占型", "依存型", "妄想型", "监视型", "自伤型", "排除型"], yt = ["typical", "depression", "anxiety", "bpd", "alexithymia"], de = [
      "independent",
      "interchanging",
      "cognitive_determinism",
      "weak_whorf",
      "thinking_for_speaking",
      "radical_connectionism",
      "determinism"
    ], ee = ["0 · egocentric", "1 · subjective", "2 · self-reflective", "3 · mutual", "4 · societal-symbolic"], ce = st({
      get: () => `${Number(v.value.cog_social_stage ?? 2)} · ${["egocentric", "subjective", "self-reflective", "mutual", "societal-symbolic"][Number(v.value.cog_social_stage ?? 2)] || "self-reflective"}`,
      set: (c) => {
        v.value.cog_social_stage = Number(String(c).split("·")[0].trim());
      }
    });
    function je(c) {
      return String(f.value.settings?.[c] ?? tt[c] ?? "");
    }
    function Ce() {
      const c = {};
      for (const [o, l] of Object.entries(tt)) {
        const w = je(o) || l;
        c[o] = Qt.includes(o) ? w === "1" : We.includes(o) ? w : Number(w);
      }
      return c;
    }
    function ye() {
      const c = {};
      for (const [o, l] of Object.entries(tt)) {
        const w = v.value[o];
        Qt.includes(o) ? c[o] = w ? "1" : "0" : c[o] = String(w ?? l);
      }
      return c;
    }
    const y = st(() => f.value.cognition || null), z = st(() => y.value?.last_control || null), W = st(() => y.value?.wave1 || null), it = st(() => y.value?.wave2 || null), xt = st(() => y.value?.wave3 || null), Ge = st(() => y.value?.wave4a || null), Lt = st(() => y.value?.wave4b || null), Wt = st(() => y.value?.persona || null), S = st(() => y.value?.attachment || null), jt = st(() => it.value?.episode || null), I = (c) => ({ euthymic: "平稳", subthreshold: "下滑中", episode: "低落发作" })[c] || "—", A = st(() => y.value?.life || null), dt = J(!1), Tt = J(!0);
    function pt() {
      const c = A.value?.born_at;
      if (!c) return "—";
      const o = Date.now() - new Date(c).getTime();
      if (!isFinite(o) || o < 0) return "—";
      const l = Math.floor(o / 864e5), w = Math.floor(o % 864e5 / 36e5);
      return l > 0 ? `${l} 天 ${w} 小时` : `${w} 小时`;
    }
    async function Q() {
      dt.value = !0;
      try {
        const c = await Pt("life_start", { greet: Tt.value });
        c && X(c.greeting ? `她开始生活了：${c.greeting}` : "生命已开始：她开始有自己的生活了");
      } finally {
        dt.value = !1;
      }
    }
    async function F() {
      dt.value = !0;
      try {
        await Pt("life_stop", {}) && X("已暂停：她不再主动思考，记忆与内心状态保留");
      } finally {
        dt.value = !1;
      }
    }
    function Gt(c, o) {
      Object.assign(v.value, c), ti().then(() => X(`已套用并保存「${o}」`));
    }
    const ie = [
      { label: "常规", fields: { cog_affect_enabled: !0, cog_affect_profile: "typical", cog_affect_threat: 0.2, cog_affect_reward: 1, cog_attachment_enabled: !1 } },
      { label: "抑郁倾向", fields: { cog_affect_enabled: !0, cog_affect_profile: "depression", cog_affect_threat: 0.45, cog_affect_reward: 0.7 } },
      { label: "病娇·独占", fields: { cog_affect_enabled: !0, cog_affect_profile: "depression", cog_attachment_enabled: !0, cog_attachment_type: "独占型" } },
      { label: "病娇·依存", fields: { cog_affect_enabled: !0, cog_attachment_enabled: !0, cog_attachment_type: "依存型" } },
      { label: "病娇·妄想", fields: { cog_affect_enabled: !0, cog_affect_profile: "depression", cog_attachment_enabled: !0, cog_attachment_type: "妄想型" } }
    ], ui = st(() => y.value?.wave2?.somatic_channels || null), hi = (c) => ({
      fatigue: "疲劳",
      pain: "疼痛",
      cardiorespiratory: "心慌",
      gastrointestinal: "胃肠",
      dizziness: "头晕",
      sleep: "睡眠"
    })[c] || c, di = (c) => Math.max(0.02, Math.min(1, Number(c))).toFixed(3), Se = st(() => {
      const c = Wt.value?.evidence || {};
      return Object.entries(c).map(([o, l]) => `${o}(${l.join("、")})`).join("；");
    });
    function _t(c, o = 3) {
      return c == null || c === "" ? "—" : Number(c).toFixed(o);
    }
    const qe = st(() => (f.value.timeline || []).filter((c) => c.topic === "世界").slice(0, 30)), $e = st(() => f.value.commitments || []), ci = st(() => f.value.user_model || []), Ke = st(() => Object.entries(f.value.values || {}).map(([c, o]) => ({ k: c, v: Number(o) })).sort((c, o) => Math.abs(o.v) - Math.abs(c.v)).slice(0, 20));
    function be(c) {
      try {
        const o = JSON.parse(c || "[]");
        return Array.isArray(o) ? o : [];
      } catch {
        return [];
      }
    }
    const v = J({}), Me = J("off"), fi = [{ value: "off", label: "关闭" }, { value: "texture", label: "纹理（只记录）" }, { value: "full", label: "完整（可主动提及）" }], ze = J("fictional"), Ee = J(""), Je = J(""), Ye = J(""), we = J(""), Oe = J(""), Ze = J(""), Xe = J(""), Bt = J(!1), Ie = J(!1), nn = [{ value: "fictional", label: "虚构" }, { value: "real", label: "真实" }], Vt = st(() => f.value.worldview || null), D = st(() => Vt.value?.map || { locations: [], edges: [], actors: [], width: 1e3, height: 700, title: "" }), ki = st(() => Vt.value?.actor_locations || {}), on = ["home", "work", "shop", "food", "park", "transit", "other"], Ae = { home: "家", work: "工作", shop: "商店", food: "餐饮", park: "公园", transit: "交通", other: "其他" }, Ci = { home: "#e07a5f", work: "#5b8def", shop: "#e0a23d", food: "#57a773", park: "#3faead", transit: "#8b6fd6", other: "#8a94a6" }, sn = st(() => on.filter((c) => (D.value.locations || []).some((o) => (o.kind || "other") === c)));
    function Ct(c) {
      const o = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
      return String(c ?? "").replace(/[&<>"']/g, (l) => o[l]);
    }
    const Be = J(null), xe = J(!1);
    let at = null, E = null, pi = "";
    const Si = ["#2b4250", "#33495a", "#2f4a44", "#3a4258", "#463f4f", "#3d4a3a", "#4a4436", "#39485c"], Mi = ["#dfe4ea", "#d6dce4", "#e6eaf0", "#cfd7e0"];
    let Ne = "";
    const ne = J("city"), Le = {};
    function _i(c, o, l) {
      (Le[c] || (Le[c] = [])).push({ layer: o, base: l });
    }
    function oe(c) {
      Ne = Ne === c ? "" : c;
      for (const [o, l] of Object.entries(Le)) {
        const w = o === Ne;
        for (const { layer: C, base: V } of l)
          C.setStyle && C.setStyle({ ...V, weight: (V.weight || 2) + (w ? 3.5 : 0), opacity: w ? 1 : V.opacity ?? 1 }), w && C.bringToFront && C.bringToFront();
      }
    }
    function an() {
      Ne = "", se(!1);
    }
    function Ut() {
      ne.value = ne.value === "city" ? "nation" : "city", se(!1);
    }
    function k() {
      return { w: D.value.width || 1e3, h: D.value.height || 700 };
    }
    function St(c, o) {
      return [k().h - o, c];
    }
    function Nt(c, o) {
      return M.divIcon({ className: "wm-route", html: `<span class="wm-route-inner" style="--c:${o}">${Ct(c)}</span>`, iconSize: [0, 0], iconAnchor: [0, 0] });
    }
    function zi(c, o) {
      return M.divIcon({ className: "wm-route wm-minor", html: `<span class="wm-route-inner" style="--c:${o}">${Ct(c)}</span>`, iconSize: [0, 0], iconAnchor: [0, 0] });
    }
    function Ei(c, o) {
      return M.divIcon({ className: "wm-route wm-station", html: `<span class="wm-route-inner" style="--c:${o}">${Ct(c)}</span>`, iconSize: [0, 0], iconAnchor: [0, 0] });
    }
    function Qe(c) {
      const o = [], l = [];
      for (const w of c) {
        const C = String(w.text).length * 13 + 20, V = 22;
        o.some((Ot) => Math.abs(Ot.x - w.x) < (Ot.w + C) / 2 && Math.abs(Ot.y - w.y) < (Ot.h + V) / 2) || (o.push({ x: w.x, y: w.y, w: C, h: V }), l.push(w));
      }
      return l;
    }
    function Oi() {
      const c = D.value.kind === "real" ? "real" : "fictional";
      if (at && pi !== c && (at.remove(), at = null, E = null), !(at || !Be.value)) {
        if (c === "real") {
          xe.value = !1, at = M.map(Be.value, { zoomControl: !0, attributionControl: !0 }).setView([35, 105], 5);
          const o = M.tileLayer(lu, { subdomains: ["1", "2", "3", "4"], maxZoom: 19, minZoom: 3, attribution: "© 高德地图" });
          o.on("tileerror", () => {
            xe.value = !0;
          }), o.on("load", () => {
            xe.value = !1;
          }), o.addTo(at);
        } else {
          xe.value = !1;
          const { w: o, h: l } = k();
          at = M.map(Be.value, { crs: M.CRS.Simple, zoomControl: !0, attributionControl: !1, minZoom: -3, maxZoom: 3 }).setView([l / 2, o / 2], -1.5);
          for (const [C, V] of [["pWater", 350], ["pParks", 360], ["pBlocks", 370], ["pRoads", 380], ["pMetro", 400], ["pBus", 410], ["pLabels", 620]])
            at.createPane(C), at.getPane(C).style.zIndex = String(V);
          const w = () => at.getContainer().classList.toggle("wm-zoom-low", at.getZoom() < 0);
          at.on("zoomend", w), setTimeout(w, 0);
        }
        pi = c, E = M.layerGroup().addTo(at);
      }
    }
    function se(c = !1) {
      if (!at || !E) return;
      E.clearLayers();
      for (const C of Object.keys(Le)) delete Le[C];
      Ne = "";
      const o = D.value.locations || [];
      if (!o.length) return;
      const l = pi !== "real", w = {};
      for (const C of o) w[C.id] = C;
      if (l) {
        const { w: C, h: V } = k(), N = (p) => p.map((j) => St(j[0], j[1])), Ot = D.value.nation;
        if (ne.value === "nation" && Ot) {
          M.rectangle([[0, 0], [V, C]], { pane: "pWater", stroke: !1, fillColor: "#d9e6f0", fillOpacity: 1 }).addTo(E), M.polygon(N(Ot.land), { pane: "pWater", color: "#8fbfe6", weight: 1.5, fillColor: "#f4efe1", fillOpacity: 1 }).addTo(E), (Ot.provinces || []).forEach((p, j) => {
            M.polygon(N(p.points), { pane: "pParks", color: "#c9b98f", weight: 1, fillColor: j % 2 ? "#ece2c8" : "#e4d7b4", fillOpacity: 0.55 }).addTo(E), M.marker(N([p.label])[0], { pane: "pLabels", interactive: !1, icon: Nt(p.name, "#8a7a5c") }).addTo(E);
          }), (Ot.routes || []).forEach((p) => M.polyline(N(p.points), { pane: "pRoads", color: "#b98a4a", weight: 2.5, dashArray: "2 7" }).addTo(E)), (Ot.cities || []).forEach((p) => {
            const j = St(p.x, p.y);
            M.circleMarker(j, { pane: "pLabels", radius: p.capital ? 9 : 6, color: "#ffffff", weight: 2, fillColor: p.capital ? "#d64545" : "#3a6ea5", fillOpacity: 1 }).bindPopup(Ct(p.name)).addTo(E), M.marker(j, { pane: "pLabels", interactive: !1, icon: Nt(p.name, p.capital ? "#d64545" : "#3a6ea5") }).addTo(E);
          }), at.fitBounds([[0, 0], [V, C]], { padding: [6, 6] });
          return;
        }
        M.rectangle([[0, 0], [V, C]], { pane: "pWater", stroke: !1, fillColor: "#eef1f4", fillOpacity: 1 }).addTo(E), (D.value.compounds || []).forEach((p) => {
          M.polygon(N(p.points), { pane: "pParks", color: "#c9b98f", weight: 1.2, dashArray: "7 5", fillColor: "#f3ead0", fillOpacity: 0.5 }).addTo(E), M.marker(N(p.points)[0], { pane: "pLabels", interactive: !1, icon: Nt(p.name, "#a9884a") }).addTo(E);
        }), (D.value.lakes || []).forEach((p) => {
          M.polygon(N(p.points), { pane: "pWater", color: "#8fbfe6", weight: 1.5, fillColor: "#bcd9f0", fillOpacity: 1 }).addTo(E), p.name && p.name !== "" && M.marker(St(p.label[0], p.label[1]), { pane: "pLabels", interactive: !1, icon: Nt(p.name, "#3d7fb5") }).addTo(E);
        }), (D.value.rivers || []).forEach((p) => {
          M.polyline(N(p.points), { pane: "pWater", color: "#8fbfe6", weight: 16, lineCap: "round", lineJoin: "round" }).addTo(E), M.polyline(N(p.points), { pane: "pWater", color: "#bcd9f0", weight: 11, lineCap: "round", lineJoin: "round" }).addTo(E), p.name && p.name !== "" && M.marker(N(p.points)[Math.floor(p.points.length / 2)], { pane: "pLabels", interactive: !1, icon: Nt(p.name, "#3d7fb5") }).addTo(E);
        }), (D.value.parks || []).forEach((p) => {
          M.polygon(N(p.points), { pane: "pParks", color: "#a9d3a0", weight: 1, fillColor: "#c9e6c4", fillOpacity: 1 }).addTo(E), (p.trees || []).forEach((j) => M.circleMarker(St(j[0], j[1]), { pane: "pParks", radius: 2.6, stroke: !1, fillColor: "#82bd79", fillOpacity: 1 }).addTo(E)), p.name && p.name !== "公园" && M.marker(N(p.points)[0], { pane: "pLabels", interactive: !1, icon: Nt(p.name, "#5a9e52") }).addTo(E);
        });
        const De = [];
        (D.value.blocks || []).forEach((p) => {
          const j = N(p.points);
          if (M.polygon(j.map((et) => [et[0] - 3, et[1] + 3]), { pane: "pBlocks", stroke: !1, fillColor: "#5b6b7a", fillOpacity: 0.16 }).addTo(E), M.polygon(j, { pane: "pBlocks", color: "#b9c3cd", weight: 1, fillColor: Mi[(p.shade || 0) % Mi.length], fillOpacity: 1 }).addTo(E), p.tower) {
            const et = j.reduce((lt, ft) => lt + ft[0], 0) / j.length, mt = j.reduce((lt, ft) => lt + ft[1], 0) / j.length;
            M.polygon(
              j.map((lt) => [et + (lt[0] - et) * 0.5, mt + (lt[1] - mt) * 0.5]),
              { pane: "pBlocks", color: "#aab4c0", weight: 1, fillColor: "#eef2f6", fillOpacity: 1 }
            ).addTo(E);
          }
          if (p.name) {
            const et = p.points.reduce((lt, ft) => lt + ft[0], 0) / p.points.length, mt = p.points.reduce((lt, ft) => lt + ft[1], 0) / p.points.length;
            De.push({ x: et, y: mt, text: p.name, color: p.tower ? "#6b5b8a" : "#7a8794" });
          }
        }), (D.value.named_buildings || []).forEach((p) => {
          M.circleMarker(St(p.x, p.y), { pane: "pLabels", radius: 4, color: "#ffffff", weight: 1.5, fillColor: "#8a5a2b", fillOpacity: 1 }).addTo(E), M.marker(St(p.x, p.y), { pane: "pLabels", interactive: !1, icon: Nt(p.name, "#8a5a2b") }).addTo(E);
        });
        for (const p of Qe(De))
          M.marker(St(p.x, p.y), { pane: "pLabels", interactive: !1, icon: zi(p.text, p.color) }).addTo(E);
        const re = {
          highway: { casing: 13, fill: 6.5, color: "#f08c2e" },
          arterial: { casing: 10, fill: 4.5, color: "#f7cf8a" },
          street: { casing: 5, fill: 2.4, color: "#ffffff" }
        };
        (D.value.streets || []).forEach((p) => {
          const j = re[p.kind] || re.street, et = N(p.points);
          M.polyline(et, { pane: "pRoads", color: "#ffffff", weight: j.casing, lineCap: "round", lineJoin: "round" }).addTo(E), M.polyline(et, { pane: "pRoads", color: j.color, weight: j.fill, lineCap: "round", lineJoin: "round" }).addTo(E);
        }), (D.value.roads || []).forEach((p, j) => {
          if (!p.name) return;
          const et = N(p.points), mt = "road:" + j;
          M.polyline(et, { pane: "pRoads", color: "#ffffff", weight: 11, lineCap: "round", lineJoin: "round" }).addTo(E);
          const lt = { pane: "pRoads", color: "#f6c56b", weight: 5, opacity: 1, lineCap: "round", lineJoin: "round" };
          _i(mt, M.polyline(et, lt).on("click", () => oe(mt)).addTo(E), lt), M.marker(et[Math.floor(et.length / 2)], { pane: "pLabels", interactive: !0, icon: Nt(p.name, "#9a8358") }).on("click", () => oe(mt)).addTo(E);
        }), (D.value.districts || []).forEach((p, j) => {
          M.circle(St(p.x, p.y), { pane: "pRoads", radius: p.r || 200, color: "#93a2b0", weight: 1, dashArray: "4 7", fillColor: Si[j % Si.length], fillOpacity: 0.08 }).addTo(E), M.marker(St(p.x, p.y), { pane: "pLabels", interactive: !1, icon: M.divIcon({ className: "wm-district", html: `<span class="wm-district-inner">${Ct(p.name)}</span>`, iconSize: [0, 0], iconAnchor: [0, 0] }) }).addTo(E);
        });
        const ct = [];
        (D.value.metro || []).forEach((p, j) => {
          const et = N(p.points), mt = "metro:" + j;
          M.polyline(et, { pane: "pMetro", color: "#ffffff", weight: 8, lineCap: "round", lineJoin: "round" }).addTo(E);
          const lt = { pane: "pMetro", color: p.color, weight: 4.5, opacity: 0.92, lineCap: "round", lineJoin: "round" };
          _i(mt, M.polyline(et, lt).on("click", () => oe(mt)).addTo(E), lt), (p.stations || []).forEach((ft) => {
            M.circleMarker(St(ft.x, ft.y), { pane: "pMetro", radius: 5, color: "#ffffff", weight: 2.5, fillColor: p.color, fillOpacity: 1 }).bindPopup(Ct(ft.name || p.name)).on("click", () => oe(mt)).addTo(E), ft.name && ct.push({ x: ft.x, y: ft.y, text: ft.name, color: p.color });
          }), M.marker(et[Math.floor(et.length / 2)], { pane: "pLabels", interactive: !0, icon: Nt(p.name, p.color) }).on("click", () => oe(mt)).addTo(E);
        }), (D.value.bus || []).forEach((p, j) => {
          const et = N(p.points), mt = "bus:" + j, lt = { pane: "pBus", color: p.color, weight: 3, opacity: 0.95, dashArray: "7 7", lineCap: "round" };
          _i(mt, M.polyline(et, lt).on("click", () => oe(mt)).addTo(E), lt), (p.stops || []).forEach((ft) => M.circleMarker(St(ft.x, ft.y), { pane: "pBus", radius: 3.2, color: "#ffffff", weight: 1.5, fillColor: p.color, fillOpacity: 1 }).bindPopup(Ct(ft.name || p.name)).on("click", () => oe(mt)).addTo(E)), M.marker(et[Math.floor(et.length / 2)], { pane: "pLabels", interactive: !0, icon: Nt(p.name, p.color) }).on("click", () => oe(mt)).addTo(E);
        });
        for (const p of Qe(ct))
          M.marker(St(p.x, p.y), { pane: "pLabels", interactive: !1, icon: Ei(p.text, p.color) }).addTo(E);
      } else
        for (const C of D.value.edges || []) {
          const V = w[C[0]], N = w[C[1]];
          V?.lat != null && N?.lat != null && M.polyline([[V.lat, V.lng], [N.lat, N.lng]], { color: "#5b8def", weight: 3, opacity: 0.55, dashArray: "2 8", lineCap: "round" }).addTo(E);
        }
      for (const C of o) {
        const V = Ci[C.kind] || Ci.other, N = l ? St(C.x, C.y) : C.lat != null ? [C.lat, C.lng] : null;
        if (!N) continue;
        const Ot = M.divIcon({
          className: "wm-pin-holder",
          html: `<span class="wm-pin" style="--c:${V}"></span><span class="wm-pin-label">${Ct(C.name)}</span>`,
          iconSize: [0, 0],
          iconAnchor: [0, 0]
        });
        M.marker(N, { icon: Ot }).bindPopup(`<b>${Ct(C.name)}</b>${C.desc ? "<br>" + Ct(C.desc) : ""}`).addTo(E);
      }
      for (const C of D.value.actors || []) {
        const V = w[ki.value[C.id] || C.location];
        if (!V) continue;
        const N = l ? St(V.x, V.y) : V.lat != null ? [V.lat, V.lng] : null;
        if (!N) continue;
        const Ot = M.divIcon({
          className: "wm-actor-holder",
          html: `<span class="wm-actor-badge">${Ct((C.name || "?").slice(0, 1))}</span><span class="wm-actor-name">${Ct(C.name)}</span>`,
          iconSize: [0, 0],
          iconAnchor: [0, 0]
        });
        M.marker(N, { icon: Ot }).bindPopup(`${Ct(C.name)} · ${Ct(V.name)}`).addTo(E);
      }
      if (!c)
        if (l) {
          const { w: C, h: V } = k();
          at.fitBounds([[0, 0], [V, C]], { padding: [0, 0] });
        } else {
          const C = o.filter((V) => V.lat != null).map((V) => [V.lat, V.lng]);
          C.length > 1 ? at.fitBounds(C, { padding: [56, 56], maxZoom: 15 }) : C.length === 1 && at.setView(C[0], 14);
        }
    }
    He([H, () => f.value.worldview], async () => {
      H.value === "world" && (await Pi(), Oi(), se(), at && setTimeout(() => at.invalidateSize(), 80));
    }), xo(() => {
      at && (at.remove(), at = null, E = null);
    });
    function Zi() {
      v.value = { ...Ce() }, Me.value = String(f.value.settings?.world_density || "off"), ze.value = String(f.value.settings?.world_fictional || "fictional"), Ee.value = String(f.value.settings?.world_country || ""), Je.value = String(f.value.settings?.world_city || ""), Ye.value = String(f.value.settings?.world_district || ""), we.value = String(f.value.settings?.world_premise || ""), Oe.value = String(f.value.settings?.persona_text || ""), Ze.value = String(f.value.settings?.world_actors || ""), Xe.value = String(f.value.settings?.world_places || "");
    }
    async function ti() {
      const c = {
        ...ye(),
        world_density: Me.value,
        world_fictional: ze.value,
        world_country: Ee.value,
        world_city: Je.value,
        world_district: Ye.value,
        world_premise: we.value,
        world_actors: Ze.value,
        world_places: Xe.value,
        persona_text: Oe.value
      }, o = await Pt("settings_set", { settings: c });
      o?.rejected?.length ? X(`已保存，忽略无效项：${o.rejected.join("、")}`) : X("设置已保存");
    }
    async function rn() {
      if (!(Bt.value || !await ge({
        title: "✦ AI 重写设定",
        message: "这会用模型结果覆盖上面的 国家 / 城市 / 前言 / 演员 / 地点 等设定。只想更新地图，请用「只生成地图（保留设定）」",
        confirmLabel: "覆盖并生成",
        danger: !0
      }))) {
        Bt.value = !0;
        try {
          (await Pt("world_generate", { instructions: "" }))?.worldview && X("已由 AI 完善世界观并生成地图");
        } finally {
          Bt.value = !1;
        }
      }
    }
    async function ln() {
      if (!Bt.value) {
        Bt.value = !0;
        try {
          (await Pt("world_map_generate", { instructions: "" }))?.worldview && X("已按当前设定重新生成地图（设定未改动）");
        } finally {
          Bt.value = !1;
        }
      }
    }
    async function un() {
      if (!await ge({
        title: "清除世界事件",
        message: "会删除时间线里所有「世界」事件、世界触发的主动消息与相关记忆，并重置世界状态（演员位置等）。此操作不可撤销。",
        confirmLabel: "清除",
        danger: !0
      })) return;
      await Pt("world_clear", {}) && X("已清除世界事件并重置世界状态");
    }
    async function Ii() {
      if (!(!await ge({
        title: "重置整个人",
        message: `这是唯一一次可以「重来」的操作——日常里删除一条记忆或撤回一句话都是不可逆的。

会清空：全部记忆与本地备份、关系与亲密度、承诺、目标与进展日志、未完成话题、用户画像与用户模型、价值取向、人设演化、日记与梦境、每日复盘、技能与常用表达、社交节点与边、群内关系、时间线与见闻、主动消息与回执，以及认知内核（自我叙事、互惠关系、情感历史、学到的价值表）。

会保留：你自己的设置（限额、端点、群策略、日历规则）。

此操作不可撤销。`,
        confirmLabel: "继续",
        danger: !0
      }) || !await ge({
        title: "再确认一次",
        message: "真的要把这个人恢复到出厂状态吗？之后他不会再记得发生过的任何事。",
        confirmLabel: "重置整个人",
        danger: !0
      }))) {
        Ie.value = !0;
        try {
          await Pt("reset_person", {}), X("已重置整个人"), await gt();
        } finally {
          Ie.value = !1;
        }
      }
    }
    const ei = () => ({ name: "", avatar: "", birthDate: "", gender: "", description: "", personality: "", greeting: "", customPrompt: "" }), fe = [
      { value: "", label: "不判定" },
      { value: "female", label: "女" },
      { value: "male", label: "男" },
      { value: "other", label: "其它" }
    ];
    function hn(c) {
      return (fe.find((o) => o.value === c) || fe[0]).label;
    }
    const Y = J(ei()), mi = J(!1);
    function Ai() {
      return globalThis.__0KAY_HOST__;
    }
    function Bi() {
      const c = Ai();
      if (c?.getPersona) {
        Y.value = { ...ei(), ...c.getPersona() || {} };
        return;
      }
      try {
        const o = JSON.parse(localStorage.getItem("0kay_config") || "{}");
        Y.value = { ...ei(), ...o.persona || {} };
      } catch {
        Y.value = ei();
      }
    }
    const g = J(null), ae = J(!1), Ni = ["typical", "depression", "anxiety", "bpd", "alexithymia"], Ri = st(() => [
      { value: "", label: "（不判定）" },
      ...(g.value?.options?.character || []).map((c) => ({ value: c.key, label: c.label }))
    ]), Re = st(() => [
      { value: "", label: "（不判定）" },
      ...(g.value?.options?.relationship || []).map((c) => ({
        value: c.key,
        label: c.label + (c.pathological ? " · 病娇族" : "")
      }))
    ]);
    function $() {
      return { text: [Y.value.description, Y.value.personality].filter((c) => String(c || "").trim()).join(`
`) };
    }
    He(() => [Y.value.description, Y.value.personality, Y.value.customPrompt], () => {
      g.value = null;
    });
    function rt(c) {
      return (g.value?.options?.relationship || []).find((o) => o.key === c);
    }
    He(() => g.value?.relationship?.key, (c) => {
      const o = g.value?.attachment;
      if (!o) return;
      const l = rt(c);
      o.type = l?.pathological && l.attachment_type || "";
    }, { immediate: !0 }), He(() => g.value?.attachment?.type, (c) => {
      const o = g.value?.attachment;
      if (!(!c || !o)) {
        (!o.initial || typeof o.initial != "object") && (o.initial = {});
        for (const [l, w] of Object.entries({ A: 0.05, Am: 0, Tr: 0.5, J: 0, X: 0.05, S: 0.6, O: 0 }))
          o.initial[l] == null && (o.initial[l] = w);
      }
    });
    async function ii() {
      const c = $();
      if (!c.text.trim()) {
        X("请先填写「描述」或「性格」");
        return;
      }
      ae.value = !0;
      try {
        const o = await Pt("persona_analyze", { text: c.text, gender: Y.value.gender });
        o && (g.value = o, !Y.value.gender && o.gender && (Y.value.gender = o.gender), X(o.source === "llm" ? "已由模型理解，请核对/微调参数" : "模型不可用，已用本地词典理解，请核对"));
      } finally {
        ae.value = !1;
      }
    }
    async function Pe() {
      if (!g.value) {
        X("请先点「LLM 理解」并核对参数，再保存");
        return;
      }
      mi.value = !0;
      try {
        const c = $(), o = { ...g.value.traits || {} };
        if (o.gender = g.value.gender || Y.value.gender || null, o.character = g.value.character?.key || null, o.relationship = g.value.relationship?.key || null, o.expression = g.value.character?.expression || g.value.expression || null, delete o.axes, !await Pt("persona_apply", {
          text: c.text,
          traits: o,
          attachment: g.value.attachment || {}
        })) return;
        const w = Ai();
        if (w?.setPersona)
          w.setPersona({ ...Y.value }), w.saveConfig?.();
        else {
          const C = JSON.parse(localStorage.getItem("0kay_config") || "{}");
          C.persona = { ...C.persona || {}, ...Y.value }, localStorage.setItem("0kay_config", JSON.stringify(C));
        }
        X("人设与参数已保存");
      } finally {
        mi.value = !1;
      }
    }
    return En(Bi), He(H, (c) => {
      c === "persona" && Bi();
    }), En(gt), (c, o) => (P(), T(wt, null, [
      s("main", {
        class: "pcp",
        ref_key: "pageEl",
        ref: Xt
      }, [
        s("header", Ns, [
          s("div", Rs, [
            o[84] || (o[84] = s("div", { class: "hero-copy" }, [
              s("p", { class: "eyebrow" }, [
                s("b", null, "◉"),
                It(" L.I.F.E / COGNITION")
              ]),
              s("h1", null, "陪伴面板 · 认知内核"),
              s("p", { class: "sub" }, "五套认知回路（决策仲裁 / 情感生理 / 语言习得 / 社会学习 / 自我与时间）。它们始终在后台记录状态；只有打开对应的「调节」开关，状态才会写进提示词。全部关闭时行为与旧版完全一致。")
            ], -1)),
            s("div", Ds, [
              s("button", {
                class: Yt(["btn", { tonic: !A.value?.alive }]),
                disabled: dt.value || Et.value,
                onClick: o[0] || (o[0] = (l) => A.value?.alive ? F() : Q())
              }, m(dt.value ? "…" : A.value?.alive ? "⏸ 暂停生命" : "❍ 开始生命"), 11, Vs),
              s("button", {
                class: "fab",
                disabled: Et.value,
                onClick: ti
              }, [...o[83] || (o[83] = [
                s("span", { class: "fab-ic" }, "✦", -1),
                It("保存设置", -1)
              ])], 8, Us),
              s("button", {
                class: "btn tonic",
                disabled: Et.value,
                onClick: gt
              }, m(Et.value ? "刷新中…" : "刷新"), 9, Fs)
            ])
          ]),
          s("div", Hs, [
            s("span", {
              class: Yt(["pill", { bad: y.value && !y.value.enabled }])
            }, "认知内核 " + m(y.value?.available === !1 ? "不可用" : y.value?.enabled ? "运行中" : "已停止"), 3),
            s("span", Ws, "已决策 " + m(W.value?.turns ?? 0) + " 轮", 1),
            s("span", js, "情景痕迹 " + m(W.value?.engrams ?? 0), 1),
            s("span", Gs, "词汇量 " + m(xt.value?.lexicon_size ?? 0), 1)
          ])
        ]),
        q.value ? (P(), T("p", qs, m(q.value), 1)) : G("", !0),
        Dt.value ? (P(), T("p", $s, m(Dt.value), 1)) : G("", !0),
        s("nav", Ks, [
          (P(), T(wt, null, Jt(R, (l) => s("button", {
            key: l.key,
            class: Yt(["tab", { active: H.value === l.key }]),
            onClick: (w) => ht(l.key)
          }, [
            s("i", null, m(l.i), 1),
            s("span", Ys, m(l.icon), 1),
            It(m(l.label), 1)
          ], 10, Js)), 64))
        ]),
        b(s("section", Xs, [
          s("div", Qs, [
            o[85] || (o[85] = s("div", null, [
              s("h2", null, "人设"),
              s("p", { class: "desc" }, "角色的名字、描述与性格。描述 + 性格是模型读取人设的全部来源：它同时驱动情绪画像、依恋动力学（病娇）的型别与初始值、以及抑郁倾向。改完文字后必须先用「LLM 理解」解析成参数、核对微调，才能保存。")
            ], -1)),
            s("div", ta, [
              s("button", {
                class: "btn tonic sm",
                disabled: ae.value || Et.value,
                onClick: ii
              }, m(ae.value ? "理解中…" : "LLM 理解"), 9, ea),
              s("button", {
                class: "btn filled sm",
                disabled: mi.value || !g.value,
                onClick: Pe
              }, "保存人设", 8, ia)
            ])
          ]),
          s("article", na, [
            s("div", oa, [
              s("label", null, [
                o[86] || (o[86] = s("span", null, "名字", -1)),
                b(s("input", {
                  "onUpdate:modelValue": o[1] || (o[1] = (l) => Y.value.name = l),
                  class: "field"
                }, null, 512), [
                  [Z, Y.value.name]
                ])
              ]),
              s("label", null, [
                o[87] || (o[87] = s("span", null, "性别", -1)),
                Rt(Kt, {
                  modelValue: Y.value.gender,
                  "onUpdate:modelValue": o[2] || (o[2] = (l) => Y.value.gender = l),
                  options: fe,
                  "aria-label": "性别"
                }, null, 8, ["modelValue"])
              ]),
              s("label", null, [
                o[88] || (o[88] = s("span", null, "头像 URL", -1)),
                b(s("input", {
                  "onUpdate:modelValue": o[3] || (o[3] = (l) => Y.value.avatar = l),
                  class: "field"
                }, null, 512), [
                  [Z, Y.value.avatar]
                ])
              ]),
              s("label", null, [
                o[89] || (o[89] = s("span", null, "生日", -1)),
                b(s("input", {
                  "onUpdate:modelValue": o[4] || (o[4] = (l) => Y.value.birthDate = l),
                  type: "date",
                  class: "field"
                }, null, 512), [
                  [Z, Y.value.birthDate]
                ])
              ])
            ]),
            s("label", sa, [
              o[90] || (o[90] = s("span", null, "描述", -1)),
              b(s("textarea", {
                "onUpdate:modelValue": o[5] || (o[5] = (l) => Y.value.description = l),
                rows: "3",
                class: "field"
              }, null, 512), [
                [Z, Y.value.description]
              ])
            ]),
            s("label", aa, [
              o[91] || (o[91] = s("span", null, "性格", -1)),
              b(s("textarea", {
                "onUpdate:modelValue": o[6] || (o[6] = (l) => Y.value.personality = l),
                rows: "3",
                class: "field"
              }, null, 512), [
                [Z, Y.value.personality]
              ])
            ]),
            s("label", ra, [
              o[92] || (o[92] = s("span", null, "问候语", -1)),
              b(s("textarea", {
                "onUpdate:modelValue": o[7] || (o[7] = (l) => Y.value.greeting = l),
                rows: "2",
                class: "field"
              }, null, 512), [
                [Z, Y.value.greeting]
              ])
            ]),
            s("label", la, [
              o[93] || (o[93] = s("span", null, "自定义提示词（作为 system 提示逐字发送）", -1)),
              b(s("textarea", {
                "onUpdate:modelValue": o[8] || (o[8] = (l) => Y.value.customPrompt = l),
                rows: "5",
                class: "field"
              }, null, 512), [
                [Z, Y.value.customPrompt]
              ])
            ]),
            o[94] || (o[94] = s("p", { class: "hint" }, "填写/修改「描述」或「性格」后，先点右上角「LLM 理解」：模型会把文字解析成下面的参数，你核对或微调后「保存人设」才会写回；改了文字需要重新理解。", -1))
          ]),
          g.value ? (P(), T("article", ua, [
            s("h3", null, [
              o[95] || (o[95] = It("解析结果 ", -1)),
              s("span", ha, m(g.value.source === "llm" ? "模型理解" : "本地词典"), 1)
            ]),
            s("div", da, [
              s("label", null, [
                o[96] || (o[96] = s("span", null, "性别", -1)),
                Rt(Kt, {
                  modelValue: g.value.gender,
                  "onUpdate:modelValue": o[9] || (o[9] = (l) => g.value.gender = l),
                  options: fe,
                  "aria-label": "性别"
                }, null, 8, ["modelValue"])
              ]),
              s("label", null, [
                o[97] || (o[97] = s("span", null, "性格原型", -1)),
                Rt(Kt, {
                  modelValue: g.value.character.key,
                  "onUpdate:modelValue": o[10] || (o[10] = (l) => g.value.character.key = l),
                  options: Ri.value,
                  "aria-label": "性格原型"
                }, null, 8, ["modelValue", "options"])
              ]),
              s("label", null, [
                o[98] || (o[98] = s("span", null, "关系 / 依恋类型", -1)),
                Rt(Kt, {
                  modelValue: g.value.relationship.key,
                  "onUpdate:modelValue": o[11] || (o[11] = (l) => g.value.relationship.key = l),
                  options: Re.value,
                  "aria-label": "关系类型"
                }, null, 8, ["modelValue", "options"])
              ])
            ]),
            s("p", ca, [
              It(" 性别：" + m(hn(g.value.gender)) + "。 ", 1),
              g.value.relationship?.label ? (P(), T(wt, { key: 0 }, [
                It(" 关系判定：" + m(g.value.relationship.label) + " ", 1),
                g.value.relationship.pathological ? (P(), T(wt, { key: 0 }, [
                  It("（病娇族 → 才会启用依恋动力学）")
                ], 64)) : (P(), T(wt, { key: 1 }, [
                  It("（健康型 → 不启用病态依恋）")
                ], 64))
              ], 64)) : G("", !0)
            ]),
            g.value.character?.expression || g.value.expression ? (P(), T("p", fa, "说话风格：" + m(g.value.character?.expression || g.value.expression), 1)) : G("", !0),
            o[121] || (o[121] = s("h4", null, "情绪 / 躯体参数", -1)),
            s("div", pa, [
              s("label", null, [
                o[99] || (o[99] = s("span", null, "威胁基线", -1)),
                b(s("input", {
                  "onUpdate:modelValue": o[12] || (o[12] = (l) => g.value.traits.threat_baseline = l),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    Z,
                    g.value.traits.threat_baseline,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              s("label", null, [
                o[100] || (o[100] = s("span", null, "奖赏基线", -1)),
                b(s("input", {
                  "onUpdate:modelValue": o[13] || (o[13] = (l) => g.value.traits.reward_baseline = l),
                  type: "number",
                  step: "0.1",
                  min: "0",
                  max: "2",
                  class: "field tiny"
                }, null, 512), [
                  [
                    Z,
                    g.value.traits.reward_baseline,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              s("label", null, [
                o[101] || (o[101] = s("span", null, "灾难化", -1)),
                b(s("input", {
                  "onUpdate:modelValue": o[14] || (o[14] = (l) => g.value.traits.catastrophizing = l),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    Z,
                    g.value.traits.catastrophizing,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              s("label", null, [
                o[102] || (o[102] = s("span", null, "情绪调节画像", -1)),
                Rt(Kt, {
                  modelValue: g.value.traits.erq_profile,
                  "onUpdate:modelValue": o[15] || (o[15] = (l) => g.value.traits.erq_profile = l),
                  options: Ni,
                  "aria-label": "情绪调节画像"
                }, null, 8, ["modelValue"])
              ]),
              s("label", null, [
                o[103] || (o[103] = s("span", null, "作息（睡眠小时 0-23）", -1)),
                b(s("input", {
                  "onUpdate:modelValue": o[16] || (o[16] = (l) => g.value.traits.sleep_hour = l),
                  type: "number",
                  min: "0",
                  max: "23",
                  class: "field tiny"
                }, null, 512), [
                  [
                    Z,
                    g.value.traits.sleep_hour,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ])
            ]),
            o[122] || (o[122] = s("h4", null, "性格维度", -1)),
            s("div", _a, [
              s("label", null, [
                o[104] || (o[104] = s("span", null, "外向性", -1)),
                b(s("input", {
                  "onUpdate:modelValue": o[17] || (o[17] = (l) => g.value.traits.extraversion = l),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    Z,
                    g.value.traits.extraversion,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              s("label", null, [
                o[105] || (o[105] = s("span", null, "宜人性", -1)),
                b(s("input", {
                  "onUpdate:modelValue": o[18] || (o[18] = (l) => g.value.traits.agreeableness = l),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    Z,
                    g.value.traits.agreeableness,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              s("label", null, [
                o[106] || (o[106] = s("span", null, "尽责性", -1)),
                b(s("input", {
                  "onUpdate:modelValue": o[19] || (o[19] = (l) => g.value.traits.conscientiousness = l),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    Z,
                    g.value.traits.conscientiousness,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              s("label", null, [
                o[107] || (o[107] = s("span", null, "开放性", -1)),
                b(s("input", {
                  "onUpdate:modelValue": o[20] || (o[20] = (l) => g.value.traits.openness = l),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    Z,
                    g.value.traits.openness,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              s("label", null, [
                o[108] || (o[108] = s("span", null, "依恋焦虑", -1)),
                b(s("input", {
                  "onUpdate:modelValue": o[21] || (o[21] = (l) => g.value.traits.attach_anxiety = l),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    Z,
                    g.value.traits.attach_anxiety,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              s("label", null, [
                o[109] || (o[109] = s("span", null, "依恋回避", -1)),
                b(s("input", {
                  "onUpdate:modelValue": o[22] || (o[22] = (l) => g.value.traits.attach_avoidance = l),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    Z,
                    g.value.traits.attach_avoidance,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ])
            ]),
            s("details", ma, [
              o[116] || (o[116] = s("summary", null, "更多风格参数（表达 / 语气）", -1)),
              s("div", va, [
                s("label", null, [
                  o[110] || (o[110] = s("span", null, "表达欲", -1)),
                  b(s("input", {
                    "onUpdate:modelValue": o[23] || (o[23] = (l) => g.value.traits.expressiveness = l),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      Z,
                      g.value.traits.expressiveness,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                s("label", null, [
                  o[111] || (o[111] = s("span", null, "主动性", -1)),
                  b(s("input", {
                    "onUpdate:modelValue": o[24] || (o[24] = (l) => g.value.traits.initiative = l),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      Z,
                      g.value.traits.initiative,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                s("label", null, [
                  o[112] || (o[112] = s("span", null, "幽默", -1)),
                  b(s("input", {
                    "onUpdate:modelValue": o[25] || (o[25] = (l) => g.value.traits.humor = l),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      Z,
                      g.value.traits.humor,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                s("label", null, [
                  o[113] || (o[113] = s("span", null, "亲和", -1)),
                  b(s("input", {
                    "onUpdate:modelValue": o[26] || (o[26] = (l) => g.value.traits.warmth = l),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      Z,
                      g.value.traits.warmth,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                s("label", null, [
                  o[114] || (o[114] = s("span", null, "正式程度", -1)),
                  b(s("input", {
                    "onUpdate:modelValue": o[27] || (o[27] = (l) => g.value.traits.formality = l),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      Z,
                      g.value.traits.formality,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                s("label", null, [
                  o[115] || (o[115] = s("span", null, "强势 / 支配", -1)),
                  b(s("input", {
                    "onUpdate:modelValue": o[28] || (o[28] = (l) => g.value.traits.assertiveness = l),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      Z,
                      g.value.traits.assertiveness,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ])
              ])
            ]),
            g.value.attachment.type ? (P(), T(wt, { key: 1 }, [
              s("h4", null, "病态依恋 · 由关系类型「" + m(g.value.relationship.label) + "」决定", 1),
              s("div", ga, [
                s("label", null, [
                  o[117] || (o[117] = s("span", null, "依恋型别（随关系类型）", -1)),
                  s("input", {
                    class: "field",
                    value: g.value.attachment.type + "（" + (g.value.relationship.label || "") + "）",
                    disabled: ""
                  }, null, 8, ya)
                ]),
                s("label", null, [
                  o[118] || (o[118] = s("span", null, "初始焦虑 X", -1)),
                  b(s("input", {
                    "onUpdate:modelValue": o[29] || (o[29] = (l) => g.value.attachment.initial.X = l),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      Z,
                      g.value.attachment.initial.X,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                s("label", null, [
                  o[119] || (o[119] = s("span", null, "初始安全感 S", -1)),
                  b(s("input", {
                    "onUpdate:modelValue": o[30] || (o[30] = (l) => g.value.attachment.initial.S = l),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      Z,
                      g.value.attachment.initial.S,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ])
              ]),
              o[120] || (o[120] = s("p", { class: "hint" }, "文字只是来源，真正保存进 LIFE 的是这里调好的数值。依恋型别由「关系/依恋类型」自动决定，改关系类型即可换型别。想更贴合「病娇常伴抑郁」，把情绪调节画像设为 depression。", -1))
            ], 64)) : (P(), T("p", ba, "当前关系类型不是病娇族，不启用病态依恋动力学（病度、嫉妒、执念等由关系动力学单独驱动）。"))
          ])) : G("", !0)
        ], 512), [
          [tn, H.value === "persona"]
        ]),
        b(s("section", wa, [
          s("div", { class: "section-head" }, [
            o[123] || (o[123] = s("div", null, [
              s("h2", null, "认知内核"),
              s("p", { class: "desc" }, "实时状态与全部参数。改动后点右上角「保存设置」才会生效。")
            ], -1)),
            s("div", { class: "head-actions" }, [
              s("button", {
                class: "btn filled sm",
                onClick: ti
              }, "保存设置")
            ])
          ]),
          s("article", xa, [
            s("h3", null, [
              o[124] || (o[124] = It("生命 ", -1)),
              s("span", {
                class: Yt(["count-pill", { ok: A.value?.alive }])
              }, m(A.value?.alive ? "活着" : "未开始 / 已暂停"), 3)
            ]),
            s("div", La, [
              s("div", Pa, [
                o[125] || (o[125] = s("span", null, "状态", -1)),
                s("strong", null, m(A.value?.alive ? "活着" : "未开始 / 已暂停"), 1)
              ]),
              s("div", Ta, [
                o[126] || (o[126] = s("span", null, "已活", -1)),
                s("strong", null, m(pt()), 1)
              ]),
              s("div", ka, [
                o[127] || (o[127] = s("span", null, "思考步数", -1)),
                s("strong", null, m(A.value?.ticks ?? 0), 1)
              ]),
              s("div", Ca, [
                o[128] || (o[128] = s("span", null, "常驻思考", -1)),
                s("strong", null, m(A.value?.resident_running ? "运行中" : "停止"), 1)
              ]),
              s("div", Sa, [
                o[129] || (o[129] = s("span", null, "主动行为", -1)),
                s("strong", null, m(A.value?.proactive_enabled ? "开" : "关"), 1)
              ]),
              s("div", Ma, [
                o[130] || (o[130] = s("span", null, "上次思考", -1)),
                s("strong", null, m((A.value?.last_tick || "").slice(0, 16).replace("T", " ") || "—"), 1)
              ])
            ]),
            A.value?.last_thought ? (P(), T("p", za, "此刻的念头：" + m(A.value.last_thought), 1)) : G("", !0),
            A.value?.focus ? (P(), T("p", Ea, "当前专注：" + m(A.value.focus), 1)) : G("", !0),
            A.value?.active_goal ? (P(), T("p", Oa, "想推进的目标：" + m(A.value.active_goal), 1)) : G("", !0),
            s("div", Za, [
              s("label", Ia, [
                b(s("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": o[31] || (o[31] = (l) => Tt.value = l)
                }, null, 512), [
                  [vt, Tt.value]
                ]),
                o[131] || (o[131] = s("span", null, "开始时让她先主动说一句", -1))
              ]),
              s("button", {
                class: Yt(["btn sm", { filled: !A.value?.alive }]),
                disabled: dt.value || Et.value,
                onClick: o[32] || (o[32] = (l) => A.value?.alive ? F() : Q())
              }, m(dt.value ? "…" : A.value?.alive ? "⏸ 暂停生命" : "❍ 开始生命"), 11, Aa)
            ]),
            o[132] || (o[132] = s("p", { class: "hint" }, "「开始生命」一次打开：认知内核 + 常驻思考 + 主动行为（主动消息/做梦），并立刻让她想第一件事。暂停后不再自主思考，但内心状态与记忆都保留。", -1))
          ]),
          s("article", Ba, [
            s("h3", null, [
              o[133] || (o[133] = It("实时状态 ", -1)),
              s("span", {
                class: Yt(["count-pill", { ok: y.value?.enabled }])
              }, m(y.value?.enabled ? "运行中" : "已停止"), 3)
            ]),
            y.value ? (P(), T("div", Ra, [
              s("div", Da, [
                o[134] || (o[134] = s("span", null, "仲裁模式", -1)),
                s("strong", null, m(z.value?.mode || "—"), 1)
              ]),
              s("div", Va, [
                o[135] || (o[135] = s("span", null, "本轮策略", -1)),
                s("strong", null, m(z.value?.action || "—"), 1)
              ]),
              s("div", Ua, [
                o[136] || (o[136] = s("span", null, "控制需求", -1)),
                s("strong", null, m(_t(z.value?.need)), 1)
              ]),
              s("div", Fa, [
                o[137] || (o[137] = s("span", null, "置信度", -1)),
                s("strong", null, m(_t(z.value?.confidence)), 1)
              ]),
              s("div", Ha, [
                o[138] || (o[138] = s("span", null, "已决策轮数", -1)),
                s("strong", null, m(W.value?.turns ?? 0), 1)
              ]),
              s("div", Wa, [
                o[139] || (o[139] = s("span", null, "情景痕迹", -1)),
                s("strong", null, m(W.value?.engrams ?? 0), 1)
              ]),
              s("div", ja, [
                o[140] || (o[140] = s("span", null, "模型可靠性", -1)),
                s("strong", null, m(_t(W.value?.reliability)), 1)
              ]),
              s("div", Ga, [
                o[141] || (o[141] = s("span", null, "心境", -1)),
                s("strong", null, m(_t(it.value?.mood)), 1)
              ]),
              s("div", qa, [
                o[142] || (o[142] = s("span", null, "迷走张力", -1)),
                s("strong", null, m(_t(it.value?.vagal_tone)), 1)
              ]),
              s("div", $a, [
                o[143] || (o[143] = s("span", null, "躯体化指数", -1)),
                s("strong", null, m(_t(it.value?.somatization_index)), 1)
              ]),
              s("div", Ka, [
                o[144] || (o[144] = s("span", null, "健康焦虑", -1)),
                s("strong", null, m(_t(it.value?.health_anxiety)), 1)
              ]),
              s("div", Ja, [
                o[145] || (o[145] = s("span", null, "躯体负担", -1)),
                s("strong", null, m(_t(it.value?.somatic_burden)), 1)
              ]),
              s("div", Ya, [
                o[146] || (o[146] = s("span", null, "人设特质", -1)),
                s("strong", null, m(Wt.value?.applied ? Wt.value.source === "llm" ? "已应用 · LLM" : "已应用 · 词典" : "未解析"), 1)
              ]),
              s("div", Xa, [
                o[147] || (o[147] = s("span", null, "词汇量", -1)),
                s("strong", null, m(xt.value?.lexicon_size ?? 0), 1)
              ]),
              s("div", Qa, [
                o[148] || (o[148] = s("span", null, "共情权重", -1)),
                s("strong", null, m(_t(Ge.value?.empathy)), 1)
              ]),
              s("div", tr, [
                o[149] || (o[149] = s("span", null, "视角阶段", -1)),
                s("strong", null, m(Ge.value?.perspective_name || "—"), 1)
              ]),
              s("div", er, [
                o[150] || (o[150] = s("span", null, "注意状态", -1)),
                s("strong", null, m(Lt.value?.attention_state || "—"), 1)
              ]),
              s("div", ir, [
                o[151] || (o[151] = s("span", null, "耐心", -1)),
                s("strong", null, m(_t(Lt.value?.patience)), 1)
              ]),
              S.value?.enabled ? (P(), T(wt, { key: 0 }, [
                s("div", nr, [
                  o[152] || (o[152] = s("span", null, "依恋型别", -1)),
                  s("strong", null, m(S.value.label || S.value.type), 1)
                ]),
                s("div", or, [
                  o[153] || (o[153] = s("span", null, "病度", -1)),
                  s("strong", null, m(_t(S.value.severity, 2)) + " · " + m(S.value.band), 1)
                ]),
                s("div", sr, [
                  o[154] || (o[154] = s("span", null, "主导倾向", -1)),
                  s("strong", null, m(S.value.dominant || "—"), 1)
                ]),
                s("div", ar, [
                  o[155] || (o[155] = s("span", null, "依恋压力", -1)),
                  s("strong", null, m(_t(S.value.distress, 2)), 1)
                ]),
                s("div", rr, [
                  o[156] || (o[156] = s("span", null, "抑郁共病", -1)),
                  s("strong", null, m(_t(S.value.comorbid_depression, 2)), 1)
                ])
              ], 64)) : G("", !0),
              jt.value ? (P(), T(wt, { key: 1 }, [
                s("div", lr, [
                  o[157] || (o[157] = s("span", null, "情绪病程", -1)),
                  s("strong", null, m(I(jt.value.state)), 1)
                ]),
                s("div", ur, [
                  o[158] || (o[158] = s("span", null, "病程严重度", -1)),
                  s("strong", null, m(_t(jt.value.severity, 2)), 1)
                ]),
                s("div", hr, [
                  o[159] || (o[159] = s("span", null, "发作 / 复发", -1)),
                  s("strong", null, m(jt.value.episodes) + " / " + m(jt.value.relapses), 1)
                ]),
                jt.value.state === "episode" ? (P(), T("div", dr, [
                  o[160] || (o[160] = s("span", null, "已持续", -1)),
                  s("strong", null, m(_t(jt.value.days_in_episode, 1)) + " 天", 1)
                ])) : G("", !0)
              ], 64)) : G("", !0)
            ])) : (P(), T("div", Na, "尚无状态数据（刷新后显示）")),
            jt.value ? (P(), T("p", cr, " 情绪病程：连续两次评估越过阈值才算「低落发作」，连续两次回落才算「缓解」；缓解期内再次发作计为「复发」。 它由情绪、快感缺失、稳态负荷、反刍、睡眠合成——沉默与慢性压力会把它推高。 ")) : G("", !0),
            S.value?.enabled ? (P(), T("p", fr, " 依恋动力学已开启：" + m(S.value.label) + "。病度 " + m(_t(S.value.severity, 2)) + "（" + m(S.value.band) + "）由依恋、嫉妒、焦虑、执念等合成； " + m(S.value.safe_mode ? "已进入安全层（只表达情绪、不给伤害方法）。" : "低于 0.85 不会触发安全层。") + " 它与抑郁双向影响：低落会放大不安、依恋压力也会拖累情绪。 ", 1)) : G("", !0),
            Wt.value?.applied ? (P(), T("p", pr, "人设特质已生效（" + m(Wt.value.source === "llm" ? "LLM 精修" : "本地词典") + "）：" + m(Se.value || "—") + "。改人设请到 设置 → 人设，下一条消息自动生效。", 1)) : G("", !0),
            ui.value ? (P(), T("div", _r, [
              (P(!0), T(wt, null, Jt(ui.value, (l, w) => (P(), T("div", {
                key: w,
                class: "som-chan"
              }, [
                s("span", mr, m(hi(w)), 1),
                s("span", vr, [
                  s("i", {
                    style: en({ transform: "scaleX(" + di(l) + ")" })
                  }, null, 4)
                ]),
                s("span", gr, m(_t(l, 2)), 1)
              ]))), 128)),
              Number(it.value?.somatic_chronicity) > 0.1 ? (P(), T("p", yr, "慢性化程度 " + m(_t(it.value?.somatic_chronicity)) + " — 反复报告的通道已开始敏化。", 1)) : G("", !0)
            ])) : G("", !0)
          ]),
          s("article", br, [
            o[166] || (o[166] = s("h3", null, "总开关与提示词调节", -1)),
            s("div", wr, [
              s("label", xr, [
                b(s("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": o[33] || (o[33] = (l) => v.value.cog_enabled = l)
                }, null, 512), [
                  [vt, v.value.cog_enabled]
                ]),
                o[161] || (o[161] = s("span", null, "启用认知内核", -1))
              ]),
              s("label", Lr, [
                b(s("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": o[34] || (o[34] = (l) => v.value.cog_modulate_affect = l)
                }, null, 512), [
                  [vt, v.value.cog_modulate_affect]
                ]),
                o[162] || (o[162] = s("span", null, "情感影响提示词", -1))
              ]),
              s("label", Pr, [
                b(s("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": o[35] || (o[35] = (l) => v.value.cog_modulate_language = l)
                }, null, 512), [
                  [vt, v.value.cog_modulate_language]
                ]),
                o[163] || (o[163] = s("span", null, "语言影响提示词", -1))
              ]),
              s("label", Tr, [
                b(s("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": o[36] || (o[36] = (l) => v.value.cog_modulate_social = l)
                }, null, 512), [
                  [vt, v.value.cog_modulate_social]
                ]),
                o[164] || (o[164] = s("span", null, "社会认知影响提示词", -1))
              ]),
              s("label", kr, [
                b(s("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": o[37] || (o[37] = (l) => v.value.cog_modulate_selfhood = l)
                }, null, 512), [
                  [vt, v.value.cog_modulate_selfhood]
                ]),
                o[165] || (o[165] = s("span", null, "自我与时间影响提示词", -1))
              ])
            ])
          ]),
          s("article", Cr, [
            o[167] || (o[167] = s("h3", null, "快速预设", -1)),
            o[168] || (o[168] = s("p", { class: "hint" }, '一键套用常见配置并保存（套用后仍可逐项微调）：常规、抑郁倾向、病娇（独占 / 依存 / 妄想）。病娇预设会同时把情绪调节画像设为 depression，贴合"常伴抑郁"。', -1)),
            s("div", Sr, [
              (P(), T(wt, null, Jt(ie, (l) => s("button", {
                key: l.label,
                type: "button",
                class: "btn sm",
                onClick: (w) => Gt(l.fields, l.label)
              }, m(l.label), 9, Mr)), 64))
            ])
          ]),
          s("div", zr, [
            s("article", Er, [
              o[183] || (o[183] = s("h3", null, "决策仲裁（第一波）", -1)),
              s("div", Or, [
                s("label", null, [
                  o[169] || (o[169] = s("span", null, "规划深度", -1)),
                  b(s("input", {
                    "onUpdate:modelValue": o[38] || (o[38] = (l) => v.value.cog_plan_depth = l),
                    type: "number",
                    min: "1",
                    max: "6",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      Z,
                      v.value.cog_plan_depth,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                s("label", null, [
                  o[170] || (o[170] = s("span", null, "工作记忆容量", -1)),
                  b(s("input", {
                    "onUpdate:modelValue": o[39] || (o[39] = (l) => v.value.cog_wm_capacity = l),
                    type: "number",
                    min: "1",
                    max: "12",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      Z,
                      v.value.cog_wm_capacity,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                s("label", null, [
                  o[171] || (o[171] = s("span", null, "策略温度 τ", -1)),
                  b(s("input", {
                    "onUpdate:modelValue": o[40] || (o[40] = (l) => v.value.cog_tau = l),
                    type: "number",
                    step: "0.05",
                    min: "0.05",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      Z,
                      v.value.cog_tau,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                s("label", null, [
                  o[172] || (o[172] = s("span", null, "折扣 γ", -1)),
                  b(s("input", {
                    "onUpdate:modelValue": o[41] || (o[41] = (l) => v.value.cog_gamma = l),
                    type: "number",
                    step: "0.01",
                    min: "0",
                    max: "0.999",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      Z,
                      v.value.cog_gamma,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                s("label", null, [
                  o[173] || (o[173] = s("span", null, "习惯学习率", -1)),
                  b(s("input", {
                    "onUpdate:modelValue": o[42] || (o[42] = (l) => v.value.cog_alpha_habit = l),
                    type: "number",
                    step: "0.01",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      Z,
                      v.value.cog_alpha_habit,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                s("label", null, [
                  o[174] || (o[174] = s("span", null, "无模型学习率", -1)),
                  b(s("input", {
                    "onUpdate:modelValue": o[43] || (o[43] = (l) => v.value.cog_alpha_mf = l),
                    type: "number",
                    step: "0.01",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      Z,
                      v.value.cog_alpha_mf,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                s("label", null, [
                  o[175] || (o[175] = s("span", null, "惊讶阈值 θ_pe", -1)),
                  b(s("input", {
                    "onUpdate:modelValue": o[44] || (o[44] = (l) => v.value.cog_theta_pe = l),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      Z,
                      v.value.cog_theta_pe,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                s("label", null, [
                  o[176] || (o[176] = s("span", null, "新颖阈值 θ_n", -1)),
                  b(s("input", {
                    "onUpdate:modelValue": o[45] || (o[45] = (l) => v.value.cog_theta_n = l),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      Z,
                      v.value.cog_theta_n,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                s("label", null, [
                  o[177] || (o[177] = s("span", null, "前瞻视野", -1)),
                  b(s("input", {
                    "onUpdate:modelValue": o[46] || (o[46] = (l) => v.value.cog_prospection_horizon = l),
                    type: "number",
                    min: "1",
                    max: "8",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      Z,
                      v.value.cog_prospection_horizon,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ])
              ]),
              s("div", Zr, [
                s("label", Ir, [
                  b(s("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": o[47] || (o[47] = (l) => v.value.cog_use_thalamic_gate = l)
                  }, null, 512), [
                    [vt, v.value.cog_use_thalamic_gate]
                  ]),
                  o[178] || (o[178] = s("span", null, "丘脑门控", -1))
                ]),
                s("label", Ar, [
                  b(s("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": o[48] || (o[48] = (l) => v.value.cog_use_cerebellum = l)
                  }, null, 512), [
                    [vt, v.value.cog_use_cerebellum]
                  ]),
                  o[179] || (o[179] = s("span", null, "小脑预测误差", -1))
                ]),
                s("label", Br, [
                  b(s("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": o[49] || (o[49] = (l) => v.value.cog_use_ofc_map = l)
                  }, null, 512), [
                    [vt, v.value.cog_use_ofc_map]
                  ]),
                  o[180] || (o[180] = s("span", null, "OFC 认知地图", -1))
                ]),
                s("label", Nr, [
                  b(s("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": o[50] || (o[50] = (l) => v.value.cog_use_prospection = l)
                  }, null, 512), [
                    [vt, v.value.cog_use_prospection]
                  ]),
                  o[181] || (o[181] = s("span", null, "未来奖赏前瞻", -1))
                ]),
                s("label", Rr, [
                  b(s("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": o[51] || (o[51] = (l) => v.value.cog_use_limbic_bias = l)
                  }, null, 512), [
                    [vt, v.value.cog_use_limbic_bias]
                  ]),
                  o[182] || (o[182] = s("span", null, "边缘系统偏向", -1))
                ])
              ])
            ]),
            s("article", Dr, [
              o[191] || (o[191] = s("h3", null, "情感与生理（第二波）", -1)),
              s("div", Vr, [
                s("label", null, [
                  o[184] || (o[184] = s("span", null, "情绪调节画像", -1)),
                  Rt(Kt, {
                    modelValue: v.value.cog_affect_profile,
                    "onUpdate:modelValue": o[52] || (o[52] = (l) => v.value.cog_affect_profile = l),
                    options: yt,
                    "aria-label": "情绪调节画像"
                  }, null, 8, ["modelValue"])
                ]),
                s("label", null, [
                  o[185] || (o[185] = s("span", null, "迷走基线", -1)),
                  b(s("input", {
                    "onUpdate:modelValue": o[53] || (o[53] = (l) => v.value.cog_affect_vagal = l),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      Z,
                      v.value.cog_affect_vagal,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                s("label", null, [
                  o[186] || (o[186] = s("span", null, "威胁基线", -1)),
                  b(s("input", {
                    "onUpdate:modelValue": o[54] || (o[54] = (l) => v.value.cog_affect_threat = l),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      Z,
                      v.value.cog_affect_threat,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                s("label", null, [
                  o[187] || (o[187] = s("span", null, "奖赏基线", -1)),
                  b(s("input", {
                    "onUpdate:modelValue": o[55] || (o[55] = (l) => v.value.cog_affect_reward = l),
                    type: "number",
                    step: "0.1",
                    min: "0",
                    max: "2",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      Z,
                      v.value.cog_affect_reward,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ])
              ]),
              s("label", Ur, [
                b(s("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": o[56] || (o[56] = (l) => v.value.cog_affect_enabled = l)
                }, null, 512), [
                  [vt, v.value.cog_affect_enabled]
                ]),
                o[188] || (o[188] = s("span", null, "启用情感与生理回路", -1))
              ]),
              s("label", Fr, [
                b(s("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": o[57] || (o[57] = (l) => v.value.cog_affect_somatic = l)
                }, null, 512), [
                  [vt, v.value.cog_affect_somatic]
                ]),
                o[189] || (o[189] = s("span", null, "启用躯体化网关（人设含体弱、心慌等标记时自动开启）", -1))
              ]),
              s("label", Hr, [
                b(s("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": o[58] || (o[58] = (l) => v.value.cog_affect_persona_llm = l)
                }, null, 512), [
                  [vt, v.value.cog_affect_persona_llm]
                ]),
                o[190] || (o[190] = s("span", null, "人设特质由模型理解（改动人设后下一条消息精修一次，失败自动回退本地词典）", -1))
              ])
            ]),
            s("article", Wr, [
              o[195] || (o[195] = s("h3", null, "语言习得（第三波）", -1)),
              s("div", jr, [
                s("label", null, [
                  o[192] || (o[192] = s("span", null, "语言-思维耦合", -1)),
                  Rt(Kt, {
                    modelValue: v.value.cog_language_framing,
                    "onUpdate:modelValue": o[59] || (o[59] = (l) => v.value.cog_language_framing = l),
                    options: de,
                    "aria-label": "语言-思维耦合"
                  }, null, 8, ["modelValue"])
                ]),
                s("label", null, [
                  o[193] || (o[193] = s("span", null, "分词边界阈值", -1)),
                  b(s("input", {
                    "onUpdate:modelValue": o[60] || (o[60] = (l) => v.value.cog_language_boundary = l),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      Z,
                      v.value.cog_language_boundary,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ])
              ]),
              s("label", Gr, [
                b(s("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": o[61] || (o[61] = (l) => v.value.cog_language_enabled = l)
                }, null, 512), [
                  [vt, v.value.cog_language_enabled]
                ]),
                o[194] || (o[194] = s("span", null, "启用语言习得回路", -1))
              ])
            ]),
            s("article", qr, [
              o[199] || (o[199] = s("h3", null, "社会学习（第四波）", -1)),
              s("div", $r, [
                s("label", null, [
                  o[196] || (o[196] = s("span", null, "共情权重", -1)),
                  b(s("input", {
                    "onUpdate:modelValue": o[62] || (o[62] = (l) => v.value.cog_social_empathy = l),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      Z,
                      v.value.cog_social_empathy,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                s("label", null, [
                  o[197] || (o[197] = s("span", null, "观点采择阶段", -1)),
                  Rt(Kt, {
                    modelValue: ce.value,
                    "onUpdate:modelValue": o[63] || (o[63] = (l) => ce.value = l),
                    options: ee,
                    "aria-label": "观点采择阶段"
                  }, null, 8, ["modelValue"])
                ])
              ]),
              s("label", Kr, [
                b(s("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": o[64] || (o[64] = (l) => v.value.cog_social_enabled = l)
                }, null, 512), [
                  [vt, v.value.cog_social_enabled]
                ]),
                o[198] || (o[198] = s("span", null, "启用社会学习回路", -1))
              ])
            ]),
            s("article", Jr, [
              o[203] || (o[203] = s("h3", null, "自我与时间（第四波）", -1)),
              s("div", Yr, [
                s("label", null, [
                  o[200] || (o[200] = s("span", null, "时间折扣 k", -1)),
                  b(s("input", {
                    "onUpdate:modelValue": o[65] || (o[65] = (l) => v.value.cog_selfhood_discount = l),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      Z,
                      v.value.cog_selfhood_discount,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                s("label", null, [
                  o[201] || (o[201] = s("span", null, "人设细节尺度", -1)),
                  b(s("input", {
                    "onUpdate:modelValue": o[66] || (o[66] = (l) => v.value.cog_selfhood_detail = l),
                    type: "number",
                    step: "1",
                    min: "1",
                    max: "50",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      Z,
                      v.value.cog_selfhood_detail,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ])
              ]),
              s("label", Xr, [
                b(s("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": o[67] || (o[67] = (l) => v.value.cog_selfhood_enabled = l)
                }, null, 512), [
                  [vt, v.value.cog_selfhood_enabled]
                ]),
                o[202] || (o[202] = s("span", null, "启用自我与时间回路", -1))
              ])
            ]),
            s("article", Qr, [
              o[206] || (o[206] = s("h3", null, "病态依恋 / 病娇（可选）", -1)),
              o[207] || (o[207] = s("p", { class: "hint" }, ' 把"占有欲、嫉妒、黏人、多疑"做成一个**会自己演化的状态**，而不是一句人设标签。默认关闭； 开启后由真实互动驱动——你的消息、回复快慢、沉默天数、是否提到别人、睡眠——并和抑郁互相影响。 无论多严重，极重度（≥0.85）都会自动进入安全层：只表达情绪、请求陪伴，不生成自伤或伤人的方法。 ', -1)),
              s("label", tl, [
                b(s("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": o[68] || (o[68] = (l) => v.value.cog_attachment_enabled = l)
                }, null, 512), [
                  [vt, v.value.cog_attachment_enabled]
                ]),
                o[204] || (o[204] = s("span", null, "启用依恋动力学", -1))
              ]),
              s("div", el, [
                s("label", null, [
                  o[205] || (o[205] = s("span", null, "依恋型别", -1)),
                  Rt(Kt, {
                    modelValue: v.value.cog_attachment_type,
                    "onUpdate:modelValue": o[69] || (o[69] = (l) => v.value.cog_attachment_type = l),
                    options: te,
                    "aria-label": "依恋型别"
                  }, null, 8, ["modelValue"])
                ])
              ]),
              o[208] || (o[208] = s("p", { class: "hint" }, ' 怎么配：① 打开开关并选型别（独占 / 依存 / 妄想 / 监视 / 自伤 / 排除）—— 型别只改变"同一种动力的权重"，不是硬编码台词；或 ② 直接在人设里写关键词， 系统会自动启用并按人设填初始值：如"占有欲强、爱吃醋"→独占型，"很黏人、离不开你"→依存型， "老是查岗、跟踪"→监视型，"疑神疑鬼、总觉得被骗"→妄想型。想更贴近"病娇常伴抑郁"， 把上方「情绪调节画像」设为 depression，两者会互相加重。 ', -1))
            ]),
            s("article", il, [
              o[213] || (o[213] = s("h3", null, "记忆与巩固（默认开启）", -1)),
              o[214] || (o[214] = s("p", { class: "hint" }, "这四项决定「经历会不会留下痕迹」：写入情景记忆、睡眠期回放、日终再巩固、交错学习（CLS）。默认开启——关掉时人格被固定在人设上，经历不留痕，行为与无认知内核时完全一致（可逐个消融）。", -1)),
              s("div", nl, [
                s("label", ol, [
                  b(s("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": o[70] || (o[70] = (l) => v.value.cog_memory_encode = l)
                  }, null, 512), [
                    [vt, v.value.cog_memory_encode]
                  ]),
                  o[209] || (o[209] = s("span", null, "选择性情景编码", -1))
                ]),
                s("label", sl, [
                  b(s("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": o[71] || (o[71] = (l) => v.value.cog_sleep_replay = l)
                  }, null, 512), [
                    [vt, v.value.cog_sleep_replay]
                  ]),
                  o[210] || (o[210] = s("span", null, "睡眠期回放巩固", -1))
                ]),
                s("label", al, [
                  b(s("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": o[72] || (o[72] = (l) => v.value.cog_memory_reconsolidate = l)
                  }, null, 512), [
                    [vt, v.value.cog_memory_reconsolidate]
                  ]),
                  o[211] || (o[211] = s("span", null, "日终痕迹再巩固", -1))
                ]),
                s("label", rl, [
                  b(s("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": o[73] || (o[73] = (l) => v.value.cog_cls_interleave = l)
                  }, null, 512), [
                    [vt, v.value.cog_cls_interleave]
                  ]),
                  o[212] || (o[212] = s("span", null, "交错学习 + 一致性门控（CLS）", -1))
                ])
              ])
            ])
          ])
        ], 512), [
          [tn, H.value === "cognition"]
        ]),
        b(s("section", ll, [
          s("div", { class: "section-head" }, [
            o[215] || (o[215] = s("div", null, [
              s("h2", null, "世界"),
              s("p", { class: "desc" }, "本地小模型驱动的虚构生活世界：事件、演员表与账本。默认关闭。")
            ], -1)),
            s("div", { class: "head-actions" }, [
              s("button", {
                class: "btn filled sm",
                onClick: ti
              }, "保存设置")
            ])
          ]),
          s("article", ul, [
            o[217] || (o[217] = s("h3", null, "虚构浓度", -1)),
            s("div", hl, [
              s("label", null, [
                o[216] || (o[216] = s("span", null, "world_density", -1)),
                Rt(Kt, {
                  modelValue: Me.value,
                  "onUpdate:modelValue": o[74] || (o[74] = (l) => Me.value = l),
                  options: fi,
                  "aria-label": "虚构浓度"
                }, null, 8, ["modelValue"])
              ])
            ]),
            o[218] || (o[218] = s("p", { class: "hint" }, "off 完全不影响现有行为；texture 只把事件写进时间线与记忆；full 允许作为主动话题提及（上线需你明确确认）。", -1))
          ]),
          s("article", dl, [
            o[220] || (o[220] = s("h3", null, "人设 → 特质数据", -1)),
            o[221] || (o[221] = s("p", { class: "hint" }, "把角色人设写在这里（性格、体质、作息、情绪风格）。保存后解析为认知内核的特质参数（威胁、奖赏基线、情绪调节画像、躯体化增益、作息等）：默认先由本地词典即时生效，并由模型对改动人设做一次精修（失败自动回退词典）。写明「体弱多病 / 心慌失眠」等会自动开启躯体化网关。", -1)),
            s("label", cl, [
              o[219] || (o[219] = s("span", { class: "world-label" }, "人设文本", -1)),
              b(s("textarea", {
                "onUpdate:modelValue": o[75] || (o[75] = (l) => Oe.value = l),
                class: "world-text",
                rows: "4",
                placeholder: "例：她性格开朗但容易焦虑，体质偏弱，经常心慌失眠，遇到事爱钻牛角尖。"
              }, null, 512), [
                [Z, Oe.value]
              ])
            ])
          ]),
          s("article", fl, [
            o[230] || (o[230] = s("h3", null, "世界观 · 定位", -1)),
            o[231] || (o[231] = s("p", { class: "hint" }, "说清这是哪里：国家 / 城市 / 小区（可真实可虚构）。填不全也没关系——点「AI 完善」会补全设定并生成一份带坐标的地图。改了演员或地点后，之前生成的事件会作废、重新开始。", -1)),
            s("div", pl, [
              s("label", null, [
                o[222] || (o[222] = s("span", null, "世界类型", -1)),
                Rt(Kt, {
                  modelValue: ze.value,
                  "onUpdate:modelValue": o[76] || (o[76] = (l) => ze.value = l),
                  options: nn,
                  "aria-label": "世界类型"
                }, null, 8, ["modelValue"])
              ]),
              s("label", null, [
                o[223] || (o[223] = s("span", null, "国家", -1)),
                b(s("input", {
                  "onUpdate:modelValue": o[77] || (o[77] = (l) => Ee.value = l),
                  class: "field",
                  placeholder: "中国 / 架空：曦京"
                }, null, 512), [
                  [Z, Ee.value]
                ])
              ]),
              s("label", null, [
                o[224] || (o[224] = s("span", null, "城市", -1)),
                b(s("input", {
                  "onUpdate:modelValue": o[78] || (o[78] = (l) => Je.value = l),
                  class: "field",
                  placeholder: "杭州 / 临海市"
                }, null, 512), [
                  [Z, Je.value]
                ])
              ]),
              s("label", null, [
                o[225] || (o[225] = s("span", null, "城区 · 小区", -1)),
                b(s("input", {
                  "onUpdate:modelValue": o[79] || (o[79] = (l) => Ye.value = l),
                  class: "field",
                  placeholder: "西湖区 · 文一西路"
                }, null, 512), [
                  [Z, Ye.value]
                ])
              ])
            ]),
            s("label", _l, [
              o[226] || (o[226] = s("span", { class: "world-label" }, "世界设定 / 前言", -1)),
              b(s("textarea", {
                "onUpdate:modelValue": o[80] || (o[80] = (l) => we.value = l),
                class: "world-text",
                rows: "3",
                placeholder: "例：她住在一座临海小城，开着一家旧书店，养了一只叫煤球的猫。"
              }, null, 512), [
                [Z, we.value]
              ])
            ]),
            s("label", ml, [
              o[227] || (o[227] = s("span", { class: "world-label" }, "演员表（每行一个：名字 — 名字|关系；关系可为 朋友/同事/家人）", -1)),
              b(s("textarea", {
                "onUpdate:modelValue": o[81] || (o[81] = (l) => Ze.value = l),
                class: "world-text",
                rows: "4",
                placeholder: `林小满|朋友
阿哲|同事
妈妈|家人`
              }, null, 512), [
                [Z, Ze.value]
              ])
            ]),
            s("label", vl, [
              o[228] || (o[228] = s("span", { class: "world-label" }, "地点（逗号或换行分隔）", -1)),
              b(s("textarea", {
                "onUpdate:modelValue": o[82] || (o[82] = (l) => Xe.value = l),
                class: "world-text",
                rows: "2",
                placeholder: "楼下便利店, 常去的咖啡馆, 城西书店"
              }, null, 512), [
                [Z, Xe.value]
              ])
            ]),
            s("div", gl, [
              s("button", {
                class: "btn filled sm",
                type: "button",
                disabled: Bt.value,
                onClick: ln
              }, m(Bt.value ? "生成中…" : "✦ 只生成地图（保留设定）"), 9, yl),
              s("button", {
                class: "btn tonic sm",
                type: "button",
                disabled: Bt.value,
                onClick: rn
              }, m(Bt.value ? "生成中…" : "AI 完善设定 + 生成地图"), 9, bl),
              o[229] || (o[229] = s("span", { class: "hint" }, "「只生成地图」不会动上面的设定文本；「完善设定」会用它重写设定。", -1))
            ])
          ]),
          s("article", wl, [
            s("div", xl, [
              s("h3", null, [
                o[232] || (o[232] = It("世界地图 ", -1)),
                s("span", Ll, m(D.value.locations.length), 1)
              ]),
              Vt.value ? (P(), T("span", Pl, m(Vt.value.fictional ? "虚构" : "真实") + " · " + m([Vt.value.country, Vt.value.city, Vt.value.district].filter(Boolean).join(" / ") || "未命名"), 1)) : G("", !0)
            ]),
            Vt.value?.premise ? (P(), T("p", Tl, m(Vt.value.premise), 1)) : G("", !0),
            s("div", kl, [
              s("div", {
                ref_key: "mapEl",
                ref: Be,
                class: Yt(["world-map-leaflet", { "is-empty": !D.value.locations.length }])
              }, null, 2),
              xe.value ? (P(), T("div", Cl, "底图加载失败（可能离线），仍可查看城市标记")) : G("", !0),
              D.value.locations.length ? (P(), T(wt, { key: 1 }, [
                D.value.kind !== "real" && D.value.nation ? (P(), T("button", {
                  key: 0,
                  type: "button",
                  class: "wm-scope",
                  onClick: Ut
                }, m(ne.value === "city" ? "全国视图" : "城市视图"), 1)) : G("", !0),
                s("button", {
                  type: "button",
                  class: "wm-reset",
                  onClick: an
                }, "⟲ 复位视角"),
                D.value.kind !== "real" && ne.value === "city" ? (P(), T("div", Sl, [...o[233] || (o[233] = [
                  s("i", null, "N", -1)
                ])])) : G("", !0)
              ], 64)) : G("", !0)
            ]),
            D.value.locations.length ? G("", !0) : (P(), T("p", Ml, "还没有地图。点上面的「AI 完善并生成地图」。")),
            D.value.locations.length ? (P(), T("div", zl, [
              (P(!0), T(wt, null, Jt(sn.value, (l) => (P(), T("span", { key: l }, [
                s("i", {
                  class: Yt("k-" + l)
                }, null, 2),
                It(m(Ae[l]), 1)
              ]))), 128)),
              s("span", null, [
                o[234] || (o[234] = s("i", { class: "k-actor" }, null, -1)),
                It("角色（" + m(D.value.actors.length) + "）", 1)
              ]),
              D.value.kind !== "real" ? (P(), T(wt, { key: 0 }, [
                o[235] || (o[235] = xs('<span data-v-8c76afd1><i class="k-hw" data-v-8c76afd1></i>高速/环线</span><span data-v-8c76afd1><i class="k-arterial" data-v-8c76afd1></i>主干道</span><span data-v-8c76afd1><i class="k-street" data-v-8c76afd1></i>街道</span><span data-v-8c76afd1><i class="k-metro" data-v-8c76afd1></i>地铁</span><span data-v-8c76afd1><i class="k-bus" data-v-8c76afd1></i>公交</span><span data-v-8c76afd1><i class="k-park2" data-v-8c76afd1></i>公园</span><span data-v-8c76afd1><i class="k-water" data-v-8c76afd1></i>水域</span>', 7))
              ], 64)) : G("", !0)
            ])) : G("", !0),
            D.value.locations.length && D.value.kind !== "real" && ne.value === "city" ? (P(), T("div", El, [
              (D.value.metro || []).length ? (P(), T("div", Ol, [
                o[236] || (o[236] = s("h4", null, "地铁线路表", -1)),
                s("ul", null, [
                  (P(!0), T(wt, null, Jt(D.value.metro, (l, w) => (P(), T("li", {
                    key: "m" + w
                  }, [
                    s("b", {
                      style: en({ color: l.color })
                    }, m(l.name), 5),
                    s("span", null, m((l.stations || []).map((C) => C.name).filter(Boolean).join(" · ")), 1)
                  ]))), 128))
                ])
              ])) : G("", !0),
              (D.value.bus || []).length ? (P(), T("div", Zl, [
                o[237] || (o[237] = s("h4", null, "公交线路表", -1)),
                s("ul", null, [
                  (P(!0), T(wt, null, Jt(D.value.bus, (l, w) => (P(), T("li", {
                    key: "b" + w
                  }, [
                    s("b", {
                      style: en({ color: l.color })
                    }, m(l.name), 5),
                    s("span", null, m((l.stops || []).map((C) => C.name).filter(Boolean).join(" · ")), 1)
                  ]))), 128))
                ])
              ])) : G("", !0)
            ])) : G("", !0)
          ]),
          s("article", Il, [
            s("div", Al, [
              s("h3", null, [
                o[238] || (o[238] = It("最近世界事件 ", -1)),
                s("span", Bl, m(qe.value.length), 1)
              ]),
              qe.value.length ? (P(), T("button", {
                key: 0,
                type: "button",
                class: "btn tonic sm",
                onClick: un
              }, "清除世界事件")) : G("", !0)
            ]),
            s("ol", Nl, [
              (P(!0), T(wt, null, Jt(qe.value, (l) => (P(), T("li", {
                key: l.id
              }, [
                s("span", Rl, m(l.created_at), 1),
                s("strong", null, m(l.summary), 1)
              ]))), 128)),
              qe.value.length ? G("", !0) : (P(), T("li", Dl, "还没有世界事件（开启后由本地模型生成）。"))
            ])
          ])
        ], 512), [
          [tn, H.value === "world"]
        ]),
        b(s("section", Vl, [
          o[242] || (o[242] = s("div", { class: "section-head" }, [
            s("div", null, [
              s("h2", null, "状态"),
              s("p", { class: "desc" }, "承诺账本、结构化用户模型与价值取向。")
            ])
          ], -1)),
          s("article", Ul, [
            s("h3", null, [
              o[239] || (o[239] = It("承诺账本 ", -1)),
              s("span", Fl, m($e.value.length), 1)
            ]),
            s("ol", Hl, [
              (P(!0), T(wt, null, Jt($e.value, (l) => (P(), T("li", {
                key: l.id
              }, [
                s("strong", null, m(l.text), 1),
                s("span", Wl, m(l.user_id), 1)
              ]))), 128)),
              $e.value.length ? G("", !0) : (P(), T("li", jl, "没有未了结的承诺。"))
            ])
          ]),
          s("div", Gl, [
            s("article", ql, [
              o[240] || (o[240] = s("h3", null, "用户模型", -1)),
              s("ol", $l, [
                (P(!0), T(wt, null, Jt(ci.value, (l) => (P(), T("li", {
                  key: l.user_id
                }, [
                  s("strong", null, m(l.user_id), 1),
                  s("span", Kl, "喜欢：" + m(be(l.preferences).join("、") || "—"), 1),
                  s("span", Jl, "雷区：" + m(be(l.taboos).join("、") || "—"), 1),
                  s("span", Yl, "关心：" + m(be(l.concerns).join("、") || "—"), 1)
                ]))), 128)),
                ci.value.length ? G("", !0) : (P(), T("li", Xl, "还没有结构化画像。"))
              ])
            ]),
            s("article", Ql, [
              o[241] || (o[241] = s("h3", null, "价值取向", -1)),
              s("ol", tu, [
                (P(!0), T(wt, null, Jt(Ke.value, (l) => (P(), T("li", {
                  key: l.k
                }, [
                  s("strong", null, m(l.k), 1),
                  s("span", eu, m(Number(l.v).toFixed(2)), 1)
                ]))), 128)),
                Ke.value.length ? G("", !0) : (P(), T("li", iu, "还没有形成稳定价值取向。"))
              ])
            ])
          ])
        ], 512), [
          [tn, H.value === "state"]
        ]),
        s("section", nu, [
          o[246] || (o[246] = s("div", { class: "section-head" }, [
            s("div", null, [
              s("h2", null, "危险操作"),
              s("p", { class: "desc" }, "日常操作不可撤销：撤回一句话、删除一条记忆都是永久的。这里保留唯一一次「重来」的机会。")
            ])
          ], -1)),
          s("div", ou, [
            s("article", su, [
              o[243] || (o[243] = s("h3", null, "重置整个人", -1)),
              o[244] || (o[244] = s("p", { class: "hint" }, "清空记忆与备份、关系、承诺、目标、日记与梦境、价值取向、人设演化与认知内核，回到出厂状态。你自己的设置会保留。", -1)),
              o[245] || (o[245] = s("p", {
                class: "hint",
                style: { "margin-top": "10px" }
              }, [
                s("strong", null, "需要二次确认。")
              ], -1)),
              s("div", au, [
                s("button", {
                  class: "btn danger",
                  disabled: Ie.value,
                  onClick: Ii
                }, m(Ie.value ? "重置中…" : "重置整个人"), 9, ru)
              ])
            ])
          ])
        ])
      ], 512),
      Rt(Ls)
    ], 64));
  }
}), cu = /* @__PURE__ */ Ts(uu, [["__scopeId", "data-v-8c76afd1"]]);
export {
  cu as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('life-plugin-style')){const s=document.createElement('style');s.id='life-plugin-style';s.textContent=".confirm-scrim{position:fixed;inset:0;z-index:var(--z-modal);background:#21173566;backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.confirm-dialog{width:min(440px,100%);background:var(--md-surface-container-high, var(--md-surface, #fff));color:var(--md-on-surface);border:1px solid var(--md-outline-variant, transparent);border-radius:28px;padding:28px;box-shadow:0 24px 70px #18132d33;outline:none}.confirm-dialog h2{margin:0 0 10px;font-size:22px;font-weight:650}.confirm-dialog p{margin:0;font-size:14px;line-height:1.65;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.confirm-dialog footer{display:flex;justify-content:flex-end;gap:12px;margin-top:24px}.confirm-dialog footer button{border:0;border-radius:999px;padding:12px 22px;font:inherit;font-weight:600;cursor:pointer;background:var(--md-secondary-container, #e7e0ec);color:var(--md-on-secondary-container, #1d1b20)}.confirm-dialog footer .confirm-primary{background:var(--md-primary, #6750a4);color:var(--md-on-primary, #fff)}.confirm-dialog footer .confirm-primary.danger{background:var(--md-error, #b3261e);color:var(--md-on-error, #fff)}.confirm-dialog footer button:focus-visible{outline:3px solid var(--md-primary);outline-offset:3px}.confirm-dialog:focus-visible{outline:3px solid var(--md-primary);outline-offset:2px}@media(prefers-reduced-motion:reduce){.confirm-dialog{animation:none;transition:none}}.leaflet-pane,.leaflet-tile,.leaflet-marker-icon,.leaflet-marker-shadow,.leaflet-tile-container,.leaflet-pane>svg,.leaflet-pane>canvas,.leaflet-zoom-box,.leaflet-image-layer,.leaflet-layer{position:absolute;left:0;top:0}.leaflet-container{overflow:hidden}.leaflet-tile,.leaflet-marker-icon,.leaflet-marker-shadow{-webkit-user-select:none;-moz-user-select:none;user-select:none;-webkit-user-drag:none}.leaflet-tile::selection{background:transparent}.leaflet-safari .leaflet-tile{image-rendering:-webkit-optimize-contrast}.leaflet-safari .leaflet-tile-container{width:1600px;height:1600px;-webkit-transform-origin:0 0}.leaflet-marker-icon,.leaflet-marker-shadow{display:block}.leaflet-container .leaflet-overlay-pane svg{max-width:none!important;max-height:none!important}.leaflet-container .leaflet-marker-pane img,.leaflet-container .leaflet-shadow-pane img,.leaflet-container .leaflet-tile-pane img,.leaflet-container img.leaflet-image-layer,.leaflet-container .leaflet-tile{max-width:none!important;max-height:none!important;width:auto;padding:0}.leaflet-container img.leaflet-tile{mix-blend-mode:plus-lighter}.leaflet-container.leaflet-touch-zoom{-ms-touch-action:pan-x pan-y;touch-action:pan-x pan-y}.leaflet-container.leaflet-touch-drag{-ms-touch-action:pinch-zoom;touch-action:none;touch-action:pinch-zoom}.leaflet-container.leaflet-touch-drag.leaflet-touch-zoom{-ms-touch-action:none;touch-action:none}.leaflet-container{-webkit-tap-highlight-color:transparent}.leaflet-container a{-webkit-tap-highlight-color:rgba(51,181,229,.4)}.leaflet-tile{filter:inherit;visibility:hidden}.leaflet-tile-loaded{visibility:inherit}.leaflet-zoom-box{width:0;height:0;-moz-box-sizing:border-box;box-sizing:border-box;z-index:800}.leaflet-overlay-pane svg{-moz-user-select:none}.leaflet-pane{z-index:400}.leaflet-tile-pane{z-index:200}.leaflet-overlay-pane{z-index:400}.leaflet-shadow-pane{z-index:500}.leaflet-marker-pane{z-index:600}.leaflet-tooltip-pane{z-index:650}.leaflet-popup-pane{z-index:700}.leaflet-map-pane canvas{z-index:100}.leaflet-map-pane svg{z-index:200}.leaflet-vml-shape{width:1px;height:1px}.lvml{behavior:url(#default#VML);display:inline-block;position:absolute}.leaflet-control{position:relative;z-index:800;pointer-events:visiblePainted;pointer-events:auto}.leaflet-top,.leaflet-bottom{position:absolute;z-index:1000;pointer-events:none}.leaflet-top{top:0}.leaflet-right{right:0}.leaflet-bottom{bottom:0}.leaflet-left{left:0}.leaflet-control{float:left;clear:both}.leaflet-right .leaflet-control{float:right}.leaflet-top .leaflet-control{margin-top:10px}.leaflet-bottom .leaflet-control{margin-bottom:10px}.leaflet-left .leaflet-control{margin-left:10px}.leaflet-right .leaflet-control{margin-right:10px}.leaflet-fade-anim .leaflet-popup{opacity:0;-webkit-transition:opacity .2s linear;-moz-transition:opacity .2s linear;transition:opacity .2s linear}.leaflet-fade-anim .leaflet-map-pane .leaflet-popup{opacity:1}.leaflet-zoom-animated{-webkit-transform-origin:0 0;-ms-transform-origin:0 0;transform-origin:0 0}svg.leaflet-zoom-animated{will-change:transform}.leaflet-zoom-anim .leaflet-zoom-animated{-webkit-transition:-webkit-transform .25s cubic-bezier(0,0,.25,1);-moz-transition:-moz-transform .25s cubic-bezier(0,0,.25,1);transition:transform .25s cubic-bezier(0,0,.25,1)}.leaflet-zoom-anim .leaflet-tile,.leaflet-pan-anim .leaflet-tile{-webkit-transition:none;-moz-transition:none;transition:none}.leaflet-zoom-anim .leaflet-zoom-hide{visibility:hidden}.leaflet-interactive{cursor:pointer}.leaflet-grab{cursor:-webkit-grab;cursor:-moz-grab;cursor:grab}.leaflet-crosshair,.leaflet-crosshair .leaflet-interactive{cursor:crosshair}.leaflet-popup-pane,.leaflet-control{cursor:auto}.leaflet-dragging .leaflet-grab,.leaflet-dragging .leaflet-grab .leaflet-interactive,.leaflet-dragging .leaflet-marker-draggable{cursor:move;cursor:-webkit-grabbing;cursor:-moz-grabbing;cursor:grabbing}.leaflet-marker-icon,.leaflet-marker-shadow,.leaflet-image-layer,.leaflet-pane>svg path,.leaflet-tile-container{pointer-events:none}.leaflet-marker-icon.leaflet-interactive,.leaflet-image-layer.leaflet-interactive,.leaflet-pane>svg path.leaflet-interactive,svg.leaflet-image-layer.leaflet-interactive path{pointer-events:visiblePainted;pointer-events:auto}.leaflet-container{background:#ddd;outline-offset:1px}.leaflet-container a{color:#0078a8}.leaflet-zoom-box{border:2px dotted #38f;background:#ffffff80}.leaflet-container{font-family:Helvetica Neue,Arial,Helvetica,sans-serif;font-size:12px;font-size:.75rem;line-height:1.5}.leaflet-bar{box-shadow:0 1px 5px #000000a6;border-radius:4px}.leaflet-bar a{background-color:#fff;border-bottom:1px solid #ccc;width:26px;height:26px;line-height:26px;display:block;text-align:center;text-decoration:none;color:#000}.leaflet-bar a,.leaflet-control-layers-toggle{background-position:50% 50%;background-repeat:no-repeat;display:block}.leaflet-bar a:hover,.leaflet-bar a:focus{background-color:#f4f4f4}.leaflet-bar a:first-child{border-top-left-radius:4px;border-top-right-radius:4px}.leaflet-bar a:last-child{border-bottom-left-radius:4px;border-bottom-right-radius:4px;border-bottom:none}.leaflet-bar a.leaflet-disabled{cursor:default;background-color:#f4f4f4;color:#bbb}.leaflet-touch .leaflet-bar a{width:30px;height:30px;line-height:30px}.leaflet-touch .leaflet-bar a:first-child{border-top-left-radius:2px;border-top-right-radius:2px}.leaflet-touch .leaflet-bar a:last-child{border-bottom-left-radius:2px;border-bottom-right-radius:2px}.leaflet-control-zoom-in,.leaflet-control-zoom-out{font:700 18px Lucida Console,Monaco,monospace;text-indent:1px}.leaflet-touch .leaflet-control-zoom-in,.leaflet-touch .leaflet-control-zoom-out{font-size:22px}.leaflet-control-layers{box-shadow:0 1px 5px #0006;background:#fff;border-radius:5px}.leaflet-control-layers-toggle{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAQAAAADQ4RFAAACf0lEQVR4AY1UM3gkARTePdvdoTxXKc+qTl3aU5U6b2Kbkz3Gtq3Zw6ziLGNPzrYx7946Tr6/ee/XeCQ4D3ykPtL5tHno4n0d/h3+xfuWHGLX81cn7r0iTNzjr7LrlxCqPtkbTQEHeqOrTy4Yyt3VCi/IOB0v7rVC7q45Q3Gr5K6jt+3Gl5nCoDD4MtO+j96Wu8atmhGqcNGHObuf8OM/x3AMx38+4Z2sPqzCxRFK2aF2e5Jol56XTLyggAMTL56XOMoS1W4pOyjUcGGQdZxU6qRh7B9Zp+PfpOFlqt0zyDZckPi1ttmIp03jX8gyJ8a/PG2yutpS/Vol7peZIbZcKBAEEheEIAgFbDkz5H6Zrkm2hVWGiXKiF4Ycw0RWKdtC16Q7qe3X4iOMxruonzegJzWaXFrU9utOSsLUmrc0YjeWYjCW4PDMADElpJSSQ0vQvA1Tm6/JlKnqFs1EGyZiFCqnRZTEJJJiKRYzVYzJck2Rm6P4iH+cmSY0YzimYa8l0EtTODFWhcMIMVqdsI2uiTvKmTisIDHJ3od5GILVhBCarCfVRmo4uTjkhrhzkiBV7SsaqS+TzrzM1qpGGUFt28pIySQHR6h7F6KSwGWm97ay+Z+ZqMcEjEWebE7wxCSQwpkhJqoZA5ivCdZDjJepuJ9IQjGGUmuXJdBFUygxVqVsxFsLMbDe8ZbDYVCGKxs+W080max1hFCarCfV+C1KATwcnvE9gRRuMP2prdbWGowm1KB1y+zwMMENkM755cJ2yPDtqhTI6ED1M/82yIDtC/4j4BijjeObflpO9I9MwXTCsSX8jWAFeHr05WoLTJ5G8IQVS/7vwR6ohirYM7f6HzYpogfS3R2OAAAAAElFTkSuQmCC);width:36px;height:36px}.leaflet-retina .leaflet-control-layers-toggle{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAQAAABvcdNgAAAEsklEQVR4AWL4TydIhpZK1kpWOlg0w3ZXP6D2soBtG42jeI6ZmQTHzAxiTbSJsYLjO9HhP+WOmcuhciVnmHVQcJnp7DFvScowZorad/+V/fVzMdMT2g9Cv9guXGv/7pYOrXh2U+RRR3dSd9JRx6bIFc/ekqHI29JC6pJ5ZEh1yWkhkbcFeSjxgx3L2m1cb1C7bceyxA+CNjT/Ifff+/kDk2u/w/33/IeCMOSaWZ4glosqT3DNnNZQ7Cs58/3Ce5HL78iZH/vKVIaYlqzfdLu8Vi7dnvUbEza5Idt36tquZFldl6N5Z/POLof0XLK61mZCmJSWjVF9tEjUluu74IUXvgttuVIHE7YxSkaYhJZam7yiM9Pv82JYfl9nptxZaxMJE4YSPty+vF0+Y2up9d3wwijfjZbabqm/3bZ9ecKHsiGmRflnn1MW4pjHf9oLufyn2z3y1D6n8g8TZhxyzipLNPnAUpsOiuWimg52psrTZYnOWYNDTMuWBWa0tJb4rgq1UvmutpaYEbZlwU3CLJm/ayYjHW5/h7xWLn9Hh1vepDkyf7dE7MtT5LR4e7yYpHrkhOUpEfssBLq2pPhAqoSWKUkk7EDqkmK6RrCEzqDjhNDWNE+XSMvkJRDWlZTmCW0l0PHQGRZY5t1L83kT0Y3l2SItk5JAWHl2dCOBm+fPu3fo5/3v61RMCO9Jx2EEYYhb0rmNQMX/vm7gqOEJLcXTGw3CAuRNeyaPWwjR8PRqKQ1PDA/dpv+on9Shox52WFnx0KY8onHayrJzm87i5h9xGw/tfkev0jGsQizqezUKjk12hBMKJ4kbCqGPVNXudyyrShovGw5CgxsRICxF6aRmSjlBnHRzg7Gx8fKqEubI2rahQYdR1YgDIRQO7JvQyD52hoIQx0mxa0ODtW2Iozn1le2iIRdzwWewedyZzewidueOGqlsn1MvcnQpuVwLGG3/IR1hIKxCjelIDZ8ldqWz25jWAsnldEnK0Zxro19TGVb2ffIZEsIO89EIEDvKMPrzmBOQcKQ+rroye6NgRRxqR4U8EAkz0CL6uSGOm6KQCdWjvjRiSP1BPalCRS5iQYiEIvxuBMJEWgzSoHADcVMuN7IuqqTeyUPq22qFimFtxDyBBJEwNyt6TM88blFHao/6tWWhuuOM4SAK4EI4QmFHA+SEyWlp4EQoJ13cYGzMu7yszEIBOm2rVmHUNqwAIQabISNMRstmdhNWcFLsSm+0tjJH1MdRxO5Nx0WDMhCtgD6OKgZeljJqJKc9po8juskR9XN0Y1lZ3mWjLR9JCO1jRDMd0fpYC2VnvjBSEFg7wBENc0R9HFlb0xvF1+TBEpF68d+DHR6IOWVv2BECtxo46hOFUBd/APU57WIoEwJhIi2CdpyZX0m93BZicktMj1AS9dClteUFAUNUIEygRZCtik5zSxI9MubTBH1GOiHsiLJ3OCoSZkILa9PxiN0EbvhsAo8tdAf9Seepd36lGWHmtNANTv5Jd0z4QYyeo/UEJqxKRpg5LZx6btLPsOaEmdMyxYdlc8LMaJnikDlhclqmPiQnTEpLUIZEwkRagjYkEibQErwhkTAKCLQEbUgkzJQWc/0PstHHcfEdQ+UAAAAASUVORK5CYII=);background-size:26px 26px}.leaflet-touch .leaflet-control-layers-toggle{width:44px;height:44px}.leaflet-control-layers .leaflet-control-layers-list,.leaflet-control-layers-expanded .leaflet-control-layers-toggle{display:none}.leaflet-control-layers-expanded .leaflet-control-layers-list{display:block;position:relative}.leaflet-control-layers-expanded{padding:6px 10px 6px 6px;color:#333;background:#fff}.leaflet-control-layers-scrollbar{overflow-y:scroll;overflow-x:hidden;padding-right:5px}.leaflet-control-layers-selector{margin-top:2px;position:relative;top:1px}.leaflet-control-layers label{display:block;font-size:13px;font-size:1.08333em}.leaflet-control-layers-separator{height:0;border-top:1px solid #ddd;margin:5px -10px 5px -6px}.leaflet-default-icon-path{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII=)}.leaflet-container .leaflet-control-attribution{background:#fff;background:#fffc;margin:0}.leaflet-control-attribution,.leaflet-control-scale-line{padding:0 5px;color:#333;line-height:1.4}.leaflet-control-attribution a{text-decoration:none}.leaflet-control-attribution a:hover,.leaflet-control-attribution a:focus{text-decoration:underline}.leaflet-attribution-flag{display:inline!important;vertical-align:baseline!important;width:1em;height:.6669em}.leaflet-left .leaflet-control-scale{margin-left:5px}.leaflet-bottom .leaflet-control-scale{margin-bottom:5px}.leaflet-control-scale-line{border:2px solid #777;border-top:none;line-height:1.1;padding:2px 5px 1px;white-space:nowrap;-moz-box-sizing:border-box;box-sizing:border-box;background:#fffc;text-shadow:1px 1px #fff}.leaflet-control-scale-line:not(:first-child){border-top:2px solid #777;border-bottom:none;margin-top:-2px}.leaflet-control-scale-line:not(:first-child):not(:last-child){border-bottom:2px solid #777}.leaflet-touch .leaflet-control-attribution,.leaflet-touch .leaflet-control-layers,.leaflet-touch .leaflet-bar{box-shadow:none}.leaflet-touch .leaflet-control-layers,.leaflet-touch .leaflet-bar{border:2px solid rgba(0,0,0,.2);background-clip:padding-box}.leaflet-popup{position:absolute;text-align:center;margin-bottom:20px}.leaflet-popup-content-wrapper{padding:1px;text-align:left;border-radius:12px}.leaflet-popup-content{margin:13px 24px 13px 20px;line-height:1.3;font-size:13px;font-size:1.08333em;min-height:1px}.leaflet-popup-content p{margin:1.3em 0}.leaflet-popup-tip-container{width:40px;height:20px;position:absolute;left:50%;margin-top:-1px;margin-left:-20px;overflow:hidden;pointer-events:none}.leaflet-popup-tip{width:17px;height:17px;padding:1px;margin:-10px auto 0;pointer-events:auto;-webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);-ms-transform:rotate(45deg);transform:rotate(45deg)}.leaflet-popup-content-wrapper,.leaflet-popup-tip{background:#fff;color:#333;box-shadow:0 3px 14px #0006}.leaflet-container a.leaflet-popup-close-button{position:absolute;top:0;right:0;border:none;text-align:center;width:24px;height:24px;font:16px/24px Tahoma,Verdana,sans-serif;color:#757575;text-decoration:none;background:transparent}.leaflet-container a.leaflet-popup-close-button:hover,.leaflet-container a.leaflet-popup-close-button:focus{color:#585858}.leaflet-popup-scrolled{overflow:auto}.leaflet-oldie .leaflet-popup-content-wrapper{-ms-zoom:1}.leaflet-oldie .leaflet-popup-tip{width:24px;margin:0 auto;-ms-filter:\"progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678)\";filter:progid:DXImageTransform.Microsoft.Matrix(M11=.70710678,M12=.70710678,M21=-.70710678,M22=.70710678)}.leaflet-oldie .leaflet-control-zoom,.leaflet-oldie .leaflet-control-layers,.leaflet-oldie .leaflet-popup-content-wrapper,.leaflet-oldie .leaflet-popup-tip{border:1px solid #999}.leaflet-div-icon{background:#fff;border:1px solid #666}.leaflet-tooltip{position:absolute;padding:6px;background-color:#fff;border:1px solid #fff;border-radius:3px;color:#222;white-space:nowrap;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none;box-shadow:0 1px 3px #0006}.leaflet-tooltip.leaflet-interactive{cursor:pointer;pointer-events:auto}.leaflet-tooltip-top:before,.leaflet-tooltip-bottom:before,.leaflet-tooltip-left:before,.leaflet-tooltip-right:before{position:absolute;pointer-events:none;border:6px solid transparent;background:transparent;content:\"\"}.leaflet-tooltip-bottom{margin-top:6px}.leaflet-tooltip-top{margin-top:-6px}.leaflet-tooltip-bottom:before,.leaflet-tooltip-top:before{left:50%;margin-left:-6px}.leaflet-tooltip-top:before{bottom:0;margin-bottom:-12px;border-top-color:#fff}.leaflet-tooltip-bottom:before{top:0;margin-top:-12px;margin-left:-6px;border-bottom-color:#fff}.leaflet-tooltip-left{margin-left:-6px}.leaflet-tooltip-right{margin-left:6px}.leaflet-tooltip-left:before,.leaflet-tooltip-right:before{top:50%;margin-top:-6px}.leaflet-tooltip-left:before{right:0;margin-right:-12px;border-left-color:#fff}.leaflet-tooltip-right:before{left:0;margin-left:-12px;border-right-color:#fff}@media print{.leaflet-control{-webkit-print-color-adjust:exact;print-color-adjust:exact}}#app .app-select{min-width:0;position:relative;font-size:inherit}#app .app-select.input{padding:0;border:0;min-height:0;background:transparent}#app .app-select-trigger{display:flex;align-items:center;justify-content:space-between;gap:10px;width:100%;min-height:52px;padding:0 14px 0 16px;border:1px solid transparent;border-radius:16px;background-color:var(--md-surface-container-high);color:var(--md-on-surface);font:inherit;font-size:15px;text-align:left;cursor:pointer;box-shadow:none;transition:background-color var(--duration-short),border-color var(--duration-short),box-shadow var(--duration-medium),border-radius var(--duration-medium) var(--ease-spring)}#app .app-select-trigger:hover:not(:disabled){background-color:var(--md-surface-container-highest)}#app .app-select-trigger[aria-expanded=true],#app .app-select-trigger:focus-visible{border-color:var(--md-primary);background-color:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent);outline:none}#app .app-select-trigger:disabled{opacity:.5;cursor:not-allowed}.app-select-value{white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.app-select-chevron{flex-shrink:0;width:26px;height:26px;display:grid;place-items:center;border-radius:50%;color:var(--md-on-surface-variant);transition:transform var(--duration-medium) var(--ease-spring),background-color var(--duration-short)}#app .app-select-trigger:hover .app-select-chevron{background:color-mix(in srgb,var(--md-on-surface) 8%,transparent)}.app-select-chevron svg{transition:transform var(--duration-medium) var(--ease-spring)}.app-select-chevron svg.is-open{transform:rotate(180deg)}.app-select-menu{position:fixed;z-index:var(--z-popover);overflow-y:auto;overscroll-behavior:contain;padding:8px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:24px;background:var(--md-surface-container-low);color:var(--md-on-surface);box-shadow:0 18px 50px -12px color-mix(in srgb,var(--md-scrim,#000) 45%,transparent),0 4px 14px -4px #16244026;font-family:var(--font-family);font-size:14px;transform-origin:top}.app-select-menu.opens-up{transform-origin:bottom}.app-select-option{display:flex;justify-content:space-between;align-items:center;gap:12px;min-height:46px;padding:0 14px;border-radius:14px;cursor:pointer;overflow-wrap:anywhere;line-height:1.4;color:var(--md-on-surface);transition:background-color var(--duration-short),border-radius var(--duration-medium) var(--ease-spring),color var(--duration-short)}.app-select-option>span{min-width:0}.app-select-check{flex-shrink:0;width:24px;height:24px;display:grid;place-items:center;border-radius:50%;color:var(--md-primary)}.app-select-option.highlighted{background:color-mix(in srgb,var(--md-on-surface) 8%,transparent)}.app-select-option.selected{background:var(--md-primary-container);color:var(--md-on-primary-container);font-weight:650}.app-select-option.selected .app-select-check{background:var(--md-primary);color:var(--md-on-primary)}.app-select-option.disabled{opacity:.4;cursor:not-allowed}.app-select-empty{padding:18px;color:var(--md-on-surface-variant);text-align:center;font-size:13px}.select-menu-enter-active{transition:opacity var(--duration-short) var(--ease-emphasized),transform var(--duration-medium) var(--ease-spring)}.select-menu-leave-active{transition:opacity var(--duration-short),transform var(--duration-short)}.select-menu-enter-from,.select-menu-leave-to{opacity:0;transform:translateY(-6px) scale(.97)}@media(prefers-reduced-motion:reduce){#app .app-select-trigger{transition:background-color var(--duration-short),border-color var(--duration-short),box-shadow var(--duration-medium)}.app-select-chevron,.app-select-chevron svg,.app-select-option{transition:none}.select-menu-enter-active,.select-menu-leave-active{transition:opacity var(--duration-short)}.select-menu-enter-from,.select-menu-leave-to{transform:none}}.pcp[data-v-8c76afd1]{--r-xs:10px;--r-sm:14px;--r-md:20px;--r-lg:28px;--r-xl:36px;--spring:cubic-bezier(.2,.9,.25,1.15);height:100%;overflow-y:auto;padding:var(--space-xl) var(--space-xl) 96px;background:var(--md-surface);color:var(--md-on-surface);max-width:1240px;margin:0 auto}h1[data-v-8c76afd1],h2[data-v-8c76afd1],h3[data-v-8c76afd1],h4[data-v-8c76afd1]{margin:0;letter-spacing:-.01em}.eyebrow[data-v-8c76afd1]{margin:0 0 8px;color:var(--md-primary);font:700 12px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.18em}.eyebrow b[data-v-8c76afd1]{font-size:9px}.hero[data-v-8c76afd1]{position:relative;border-radius:var(--r-xl);padding:28px 28px 22px;margin-bottom:22px;background:linear-gradient(135deg,var(--md-primary-container),var(--md-surface-container-high) 70%);color:var(--md-on-surface);box-shadow:var(--shadow-1);overflow:hidden}.hero[data-v-8c76afd1]:after{content:\"\";position:absolute;right:-60px;top:-60px;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,color-mix(in srgb,var(--md-primary) 34%,transparent),transparent 68%);pointer-events:none}.hero-main[data-v-8c76afd1]{display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;align-items:flex-start;position:relative;z-index:1}.hero-copy h1[data-v-8c76afd1]{font-size:clamp(26px,3.4vw,40px);font-weight:800}.sub[data-v-8c76afd1]{margin:8px 0 0;max-width:620px;font-size:14px;line-height:1.6;color:var(--md-on-surface-variant)}.hero-actions[data-v-8c76afd1]{display:flex;gap:10px;align-items:center;flex-wrap:wrap}.fab[data-v-8c76afd1]{height:52px;padding:0 22px;border:0;border-radius:18px;background:var(--md-primary);color:var(--md-on-primary,#fff);font:700 14px/1 inherit;display:inline-flex;align-items:center;gap:10px;cursor:pointer;box-shadow:0 6px 18px color-mix(in srgb,var(--md-primary) 34%,transparent);transition:transform .28s var(--spring),box-shadow .28s}@media(hover:hover)and (pointer:fine){.fab[data-v-8c76afd1]:hover:not(:disabled){transform:translateY(-2px) scale(1.02)}}.fab[data-v-8c76afd1]:disabled{opacity:.6;cursor:not-allowed}.fab-ic[data-v-8c76afd1]{font-size:17px}.state-row[data-v-8c76afd1]{position:relative;z-index:1;display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;align-items:center}.pill[data-v-8c76afd1]{padding:6px 14px;border-radius:999px;background:color-mix(in srgb,var(--md-surface-container-lowest) 70%,transparent);font-size:13px;font-weight:700}.pill.soft[data-v-8c76afd1]{font-weight:500;color:var(--md-on-surface-variant)}.pill.bad[data-v-8c76afd1]{background:#ffdcc6;color:#7a3a00}.banner[data-v-8c76afd1]{padding:12px 16px;border-radius:var(--r-sm);font-size:13px;margin:0 0 16px}.banner.err[data-v-8c76afd1]{background:var(--md-error-container);color:var(--md-on-error-container)}.banner.ok[data-v-8c76afd1]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tabs[data-v-8c76afd1]{display:flex;gap:8px;overflow-x:auto;padding:6px 4px 14px;margin-bottom:6px;scrollbar-width:thin}.tab[data-v-8c76afd1]{flex:0 0 auto;display:inline-flex;align-items:center;gap:8px;height:44px;padding:0 18px;border:1px solid var(--md-outline-variant);border-radius:999px;background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font:700 13px/1 inherit;cursor:pointer;transition:background .25s,color .25s,transform .25s var(--spring)}.tab i[data-v-8c76afd1]{font-style:normal;font:700 12px/1 ui-monospace,monospace;opacity:.6}.tab-ic[data-v-8c76afd1]{font-size:14px}.tab[data-v-8c76afd1]:hover{background:var(--md-surface-container-high)}.tab.active[data-v-8c76afd1]{background:var(--md-primary);color:var(--md-on-primary,#fff);border-color:transparent;transform:translateY(-1px);box-shadow:0 6px 16px color-mix(in srgb,var(--md-primary) 30%,transparent)}.tab.active i[data-v-8c76afd1]{opacity:.85}.panel[data-v-8c76afd1]{animation:fade-8c76afd1 .32s var(--spring)}@keyframes fade-8c76afd1{0%{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}.section-head[data-v-8c76afd1]{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap;margin:8px 0 18px}.section-head h2[data-v-8c76afd1]{font-size:22px;font-weight:800}.desc[data-v-8c76afd1]{margin:6px 0 0;font-size:13px;color:var(--md-on-surface-variant);max-width:720px;line-height:1.55}.head-actions[data-v-8c76afd1]{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.btn[data-v-8c76afd1]{height:40px;padding:0 16px;border:1px solid transparent;border-radius:999px;font:700 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:8px;transition:transform .22s var(--spring),background .22s,box-shadow .22s}.btn.sm[data-v-8c76afd1]{height:34px;padding:0 14px;font-size:13px}.btn[data-v-8c76afd1]:disabled{opacity:.5;cursor:not-allowed}@media(hover:hover)and (pointer:fine){.btn[data-v-8c76afd1]:hover:not(:disabled){transform:translateY(-1px)}}.btn.filled[data-v-8c76afd1]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn.tonic[data-v-8c76afd1]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn.text[data-v-8c76afd1]{background:transparent;color:var(--md-primary)}.btn.danger[data-v-8c76afd1]{background:var(--md-error-container);color:var(--md-on-error-container)}.link[data-v-8c76afd1]{border:0;background:transparent;color:var(--md-primary);font:700 12px/1 inherit;cursor:pointer;padding:4px}.card[data-v-8c76afd1]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--r-lg);padding:20px;margin-bottom:16px}.card>h3[data-v-8c76afd1]{font-size:16px;font-weight:750;margin-bottom:14px;display:flex;align-items:center;gap:8px}.card.sub[data-v-8c76afd1]{padding:16px;margin-bottom:0}.grid2[data-v-8c76afd1]{display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start}.grid3[data-v-8c76afd1]{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;align-items:start}.sub-label[data-v-8c76afd1]{margin:16px 0 8px;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--md-on-surface-variant)}.hint[data-v-8c76afd1]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.55;margin:6px 0}.world-field[data-v-8c76afd1]{display:block;margin:10px 0}.world-label[data-v-8c76afd1]{display:block;font-size:12px;font-weight:600;color:var(--md-on-surface-variant);margin-bottom:4px}.world-text[data-v-8c76afd1]{width:100%;min-height:64px;padding:10px 14px;border:1px solid var(--md-outline-variant);border-radius:var(--r-sm);background:var(--md-surface-container-high);color:var(--md-on-surface);font:inherit;font-size:13px;line-height:1.5;resize:vertical;outline:none}.world-text[data-v-8c76afd1]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 14%,transparent)}.world-actions[data-v-8c76afd1]{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-top:12px}.wm-head[data-v-8c76afd1]{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;margin-bottom:6px}.wm-place[data-v-8c76afd1]{font-size:12px;color:var(--md-on-surface-variant)}.wm-premise[data-v-8c76afd1]{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin:2px 0 8px}.wm-map-wrap[data-v-8c76afd1]{position:relative;margin-top:8px}.world-map-leaflet[data-v-8c76afd1]{height:clamp(460px,72vh,820px);border-radius:16px;overflow:hidden;border:1px solid var(--md-outline-variant);background:#e8edf2}.world-map-leaflet.is-empty[data-v-8c76afd1]{display:none}.wm-reset[data-v-8c76afd1]{position:absolute;top:10px;right:10px;z-index:var(--z-overlay);border:1px solid var(--md-outline-variant);background:#fffffff0;color:#33404c;border-radius:10px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer;box-shadow:0 1px 4px #0000002e}.wm-reset[data-v-8c76afd1]:hover{background:#fff}.wm-compass[data-v-8c76afd1]{position:absolute;left:12px;bottom:12px;z-index:var(--z-overlay);width:38px;height:38px;border-radius:50%;background:#ffffffeb;border:1px solid #b9c3cd;box-shadow:0 1px 4px #0000002e;display:grid;place-items:center}.wm-compass i[data-v-8c76afd1]{font-style:normal;font-size:12px;font-weight:800;color:#d64545;position:relative}.wm-compass i[data-v-8c76afd1]:before{content:\"\";position:absolute;left:50%;top:-9px;transform:translate(-50%);border-left:4px solid transparent;border-right:4px solid transparent;border-bottom:9px solid #33404c}.wm-scope[data-v-8c76afd1]{position:absolute;bottom:12px;right:12px;z-index:var(--z-overlay);border:1px solid var(--md-outline-variant);background:#fffffff0;color:#33404c;border-radius:10px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer;box-shadow:0 1px 4px #0000002e}.wm-scope[data-v-8c76afd1]:hover{background:#fff}.wm-offline[data-v-8c76afd1]{position:absolute;left:50%;bottom:12px;transform:translate(-50%);z-index:var(--z-overlay);background:#d1495bf0;color:#fff;font-size:12px;font-weight:600;padding:5px 12px;border-radius:10px;box-shadow:0 1px 4px #00000040}.wm-routes[data-v-8c76afd1]{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:18px;margin-top:14px}.wm-routes h4[data-v-8c76afd1]{margin:0 0 6px;font-size:13px;font-weight:800}.wm-routes ul[data-v-8c76afd1]{list-style:none;margin:0;padding:0}.wm-routes li[data-v-8c76afd1]{display:flex;gap:10px;padding:4px 0;border-bottom:1px dashed color-mix(in srgb,var(--md-outline-variant) 70%,transparent);font-size:12.5px}.wm-routes b[data-v-8c76afd1]{flex:0 0 88px}.wm-routes span[data-v-8c76afd1]{color:var(--md-on-surface-variant);line-height:1.5}.wm-legend[data-v-8c76afd1]{display:flex;flex-wrap:wrap;gap:14px;margin-top:12px;font-size:12px;color:var(--md-on-surface-variant)}.wm-legend span[data-v-8c76afd1]{display:inline-flex;align-items:center;gap:6px}.wm-legend i[data-v-8c76afd1]{width:12px;height:12px;border-radius:50%;display:inline-block;border:1.5px solid rgba(255,255,255,.7)}.wm-legend i.k-home[data-v-8c76afd1]{background:#e07a5f}.wm-legend i.k-work[data-v-8c76afd1]{background:#5b8def}.wm-legend i.k-shop[data-v-8c76afd1]{background:#e0a23d}.wm-legend i.k-food[data-v-8c76afd1]{background:#57a773}.wm-legend i.k-park[data-v-8c76afd1]{background:#3faead}.wm-legend i.k-transit[data-v-8c76afd1]{background:#8b6fd6}.wm-legend i.k-other[data-v-8c76afd1]{background:#8a94a6}.wm-legend i.k-actor[data-v-8c76afd1]{background:#fff;border-color:#d1495b;box-shadow:inset 0 0 0 3px #d1495b}.wm-legend i.k-metro[data-v-8c76afd1]{background:#d64545}.wm-legend i.k-bus[data-v-8c76afd1]{background:#e08a2e}.wm-legend i.k-park2[data-v-8c76afd1]{background:#9bd08f}.wm-legend i.k-water[data-v-8c76afd1]{background:#8fbfe6}.wm-legend i.k-hw[data-v-8c76afd1]{background:#f08c2e}.wm-legend i.k-arterial[data-v-8c76afd1]{background:#f7cf8a}.wm-legend i.k-street[data-v-8c76afd1]{background:#fff;border-color:#b9c3cd}.meta[data-v-8c76afd1]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5}.empty[data-v-8c76afd1]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant)}.field[data-v-8c76afd1]{width:100%;height:48px;padding:0 16px;border:1px solid var(--md-outline-variant);border-radius:var(--r-sm);background:var(--md-surface-container-high);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none;transition:border-color .2s,box-shadow .2s}.field[data-v-8c76afd1]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 14%,transparent)}.field.tiny[data-v-8c76afd1]{width:104px;height:38px;padding:0 12px;font-size:13px}.preset-row[data-v-8c76afd1]{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}.switches[data-v-8c76afd1]{display:flex;gap:16px;flex-wrap:wrap;margin:8px 0}.sw[data-v-8c76afd1]{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:var(--md-on-surface-variant);cursor:pointer}.sw input[data-v-8c76afd1]{width:18px;height:18px;accent-color:var(--md-primary)}.settings-grid[data-v-8c76afd1]{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px}.settings-grid label[data-v-8c76afd1]{display:flex;flex-direction:column;gap:4px;font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}.settings-grid .field[data-v-8c76afd1]{height:40px}.pfield[data-v-8c76afd1]{display:flex;flex-direction:column;gap:4px;margin-top:10px;font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}.pfield textarea.field[data-v-8c76afd1]{height:auto;min-height:70px;padding:10px 12px;resize:vertical;line-height:1.5}.cog-metric[data-v-8c76afd1]{display:flex;flex-direction:column;gap:4px;padding:10px 12px;border-radius:var(--r-sm);background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant)}.cog-metric span[data-v-8c76afd1]{font-size:11px;font-weight:700;letter-spacing:.04em;color:var(--md-on-surface-variant)}.cog-metric strong[data-v-8c76afd1]{font-size:16px;font-weight:800;letter-spacing:-.01em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.som-channels[data-v-8c76afd1]{margin-top:10px;display:flex;flex-direction:column;gap:6px}.som-chan[data-v-8c76afd1]{display:grid;grid-template-columns:52px 1fr 48px;align-items:center;gap:10px}.som-chan-name[data-v-8c76afd1]{font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}.som-chan-bar[data-v-8c76afd1]{display:block;height:8px;border-radius:999px;background:var(--md-surface-container);overflow:hidden}.som-chan-bar i[data-v-8c76afd1]{display:block;width:100%;height:100%;border-radius:999px;background:var(--md-primary);transform-origin:left;transition:transform var(--duration-medium) var(--ease-out);will-change:transform}.som-chan-val[data-v-8c76afd1]{font-size:12px;font-weight:700;text-align:right;color:var(--md-on-surface-variant)}.chip[data-v-8c76afd1]{display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 12px;border-radius:999px;font-size:12px;font-weight:700;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.chip.muted[data-v-8c76afd1]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}.chip.ok[data-v-8c76afd1]{background:var(--md-success-container);color:#0d3b1e}.count-pill[data-v-8c76afd1]{margin-left:auto;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);border-radius:999px;padding:3px 10px;font-size:12px;font-weight:700}.count-pill.ok[data-v-8c76afd1]{background:var(--md-success-container);color:#0d3b1e}.actions-row[data-v-8c76afd1]{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:8px}#app .pcp .card[data-v-8c76afd1]{border-color:color-mix(in srgb,var(--md-outline-variant) 55%,transparent);background:var(--md-surface-container-low);box-shadow:var(--shadow-1)}#app .pcp .field[data-v-8c76afd1]{height:52px;border-radius:16px;border-color:transparent;background:var(--md-surface-container-high)}#app .pcp .field[data-v-8c76afd1]:focus{border-color:var(--md-primary);background:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}#app .pcp .field.tiny[data-v-8c76afd1]{height:40px}#app .pcp .settings-grid .field[data-v-8c76afd1]{height:44px}#app .pcp .btn[data-v-8c76afd1]{height:44px;padding:0 20px}#app .pcp .btn.sm[data-v-8c76afd1]{height:36px;padding:0 15px}#app .pcp .cog-metric[data-v-8c76afd1]{background:var(--md-surface-container)}@media(prefers-reduced-motion:reduce){.panel[data-v-8c76afd1]{animation:none}.fab[data-v-8c76afd1],.btn[data-v-8c76afd1],.tab[data-v-8c76afd1],.som-chan-bar i[data-v-8c76afd1]{transition:none}.fab[data-v-8c76afd1]:hover:not(:disabled),.btn[data-v-8c76afd1]:hover:not(:disabled),.tab.active[data-v-8c76afd1]{transform:none}}@media(prefers-color-scheme:dark){.pill.bad[data-v-8c76afd1]{background:#5a2d00;color:#ffd7b0}}@media(max-width:820px){.grid2[data-v-8c76afd1],.grid3[data-v-8c76afd1]{grid-template-columns:1fr}.settings-grid label.wide[data-v-8c76afd1]{grid-column:span 1}}@media(max-width:560px){.pcp[data-v-8c76afd1]{padding:var(--space-lg) var(--space-lg) 80px}.hero[data-v-8c76afd1]{padding:20px}.hero-actions[data-v-8c76afd1]{width:100%}}.wm-pin-holder,.wm-actor-holder{background:none;border:none}.wm-pin{position:absolute;left:0;top:0;width:16px;height:16px;border-radius:50%;background:var(--c,#8a94a6);border:3px solid #fff;box-shadow:0 2px 6px #00000073;transform:translate(-50%,-50%)}.wm-pin:after{content:\"\";position:absolute;left:50%;top:100%;width:2px;height:8px;background:#fff;transform:translate(-50%);opacity:.7}.wm-pin-label{position:absolute;left:12px;top:-9px;white-space:nowrap;background:#12141ad1;color:#fff;font-size:12px;font-weight:600;padding:2px 8px;border-radius:10px;pointer-events:none}.wm-actor-badge{position:absolute;left:0;top:0;width:26px;height:26px;border-radius:50%;background:#fff;color:#d1495b;border:3px solid #d1495b;font-size:14px;font-weight:800;line-height:1;display:grid;place-items:center;transform:translate(-50%,-50%);box-shadow:0 2px 6px #00000080;z-index:600}.wm-actor-name{position:absolute;left:0;top:20px;white-space:nowrap;background:#d1495b;color:#fff;font-size:11px;font-weight:700;padding:1px 7px;border-radius:9px;transform:translate(-50%)}.wm-district{background:none;border:none}.wm-district-inner{position:absolute;left:0;top:0;transform:translate(-50%,-50%);white-space:nowrap;font-size:12px;font-weight:800;letter-spacing:.2em;color:#5c6b78;text-shadow:0 1px 0 rgba(255,255,255,.9);pointer-events:none}.wm-route{background:none;border:none}.wm-route-inner{position:absolute;left:0;top:0;transform:translate(-50%,-50%);background:var(--c,#333);color:#fff;font-size:10px;font-weight:700;padding:1px 6px;border-radius:8px;white-space:nowrap;box-shadow:0 1px 3px #00000059;pointer-events:none}.wm-zoom-low .wm-minor{display:none}.wm-station .wm-route-inner{background:#fff;color:#33404c;border:1.5px solid var(--c,#888);border-radius:6px;font-size:9px;font-weight:700;padding:1px 5px}.leaflet-container{font-family:inherit;background:#e8edf2;border-radius:16px}.leaflet-container a{color:#2f6fed}.leaflet-popup-content{font-size:13px;line-height:1.5}.page[data-v-c4f2d266]{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}.page-inner[data-v-c4f2d266]{max-width:1180px;margin:0 auto}.page-header[data-v-c4f2d266]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.eyebrow[data-v-c4f2d266]{margin:0 0 6px;color:var(--md-primary);font:700 12px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.page-header h1[data-v-c4f2d266]{margin:0;font-size:var(--font-size-lg);font-weight:650;letter-spacing:-.01em}.subtitle[data-v-c4f2d266]{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-c4f2d266]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0;flex-wrap:wrap}.btn[data-v-c4f2d266]{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s,background .15s}.btn[data-v-c4f2d266]:disabled{opacity:.55;cursor:not-allowed}.btn[data-v-c4f2d266]:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}.btn-sm[data-v-c4f2d266]{height:30px;padding:0 12px;font-size:12px}.btn-primary[data-v-c4f2d266]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn-tonal[data-v-c4f2d266]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn-danger[data-v-c4f2d266]{background:var(--md-error-container);color:var(--md-on-error-container)}.stat-grid[data-v-c4f2d266]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-c4f2d266]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}.stat-head[data-v-c4f2d266]{display:flex;align-items:center;gap:10px}.stat-label[data-v-c4f2d266]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-c4f2d266]{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1}.stat-hint[data-v-c4f2d266]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-c4f2d266]{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-c4f2d266]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-c4f2d266]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-c4f2d266]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-c4f2d266]{background:var(--md-success-container);color:#0d3b1e}.card[data-v-c4f2d266]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);box-shadow:var(--shadow-1);padding:var(--space-lg)}.card-head[data-v-c4f2d266]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.card-title[data-v-c4f2d266]{margin:0;font-size:16px;font-weight:650}.tabs[data-v-c4f2d266]{display:inline-flex;gap:4px;padding:4px;border-radius:999px;background:var(--md-surface-container-high);margin-bottom:var(--space-lg)}.tabs button[data-v-c4f2d266]{border:0;background:transparent;border-radius:999px;padding:8px 18px;font-size:13px;font-weight:600;color:var(--md-on-surface-variant);cursor:pointer}.tabs button.active[data-v-c4f2d266]{background:var(--md-surface-container-lowest);color:var(--md-primary);box-shadow:var(--shadow-1)}.toolbar[data-v-c4f2d266]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:var(--space-lg);padding:var(--space-md)}.search-field[data-v-c4f2d266]{display:flex;align-items:center;gap:10px;flex:1;min-width:220px}.search-icon[data-v-c4f2d266]{color:var(--md-on-surface-variant);flex-shrink:0}.search-field input[data-v-c4f2d266]{flex:1;min-width:0;height:38px;border:0;background:transparent;outline:none;color:var(--md-on-surface);font-size:14px}.search-field input[data-v-c4f2d266]:focus-visible{outline:3px solid var(--md-primary);outline-offset:2px}.search-field.mini[data-v-c4f2d266]{padding:8px 12px;border:1px solid var(--md-outline-variant);border-radius:10px;margin-bottom:12px}.select[data-v-c4f2d266]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.select select[data-v-c4f2d266]{height:34px;border:1px solid var(--md-outline-variant);border-radius:9px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);padding:0 10px;font:inherit;font-size:13px}.chip[data-v-c4f2d266]{height:26px;padding:0 11px;border-radius:999px;font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:6px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0}.chip.muted[data-v-c4f2d266]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}.tier-short[data-v-c4f2d266]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tier-long[data-v-c4f2d266]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.chip-ok[data-v-c4f2d266]{background:var(--md-success-container);color:#0d3b1e}.chip-warn[data-v-c4f2d266]{background:#fff1dc;color:#7a4400}.error-banner[data-v-c4f2d266]{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:var(--md-on-error-container);font-size:13px;margin:var(--space-lg) 0}.notice[data-v-c4f2d266]{padding:10px 16px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;margin-top:var(--space-md)}.memory-list[data-v-c4f2d266]{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:var(--space-lg)}.memory-card[data-v-c4f2d266]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:12px;transition:border-color .15s,box-shadow .15s}.memory-card-enter-active[data-v-c4f2d266]{transition:opacity .2s var(--ease-emphasized-decel),transform .2s var(--ease-emphasized-decel)}.memory-card-leave-active[data-v-c4f2d266]{transition:opacity .16s var(--ease-emphasized-accel),transform .16s var(--ease-emphasized-accel)}.memory-card-enter-from[data-v-c4f2d266]{opacity:0;transform:translateY(6px) scale(.98)}.memory-card-leave-to[data-v-c4f2d266]{opacity:0;transform:scale(.98)}.memory-card-move[data-v-c4f2d266]{transition:transform .26s var(--ease-emphasized)}@media(prefers-reduced-motion:reduce){.memory-card-enter-active[data-v-c4f2d266],.memory-card-leave-active[data-v-c4f2d266],.memory-card-move[data-v-c4f2d266]{transition-duration:1ms}.memory-card-enter-from[data-v-c4f2d266],.memory-card-leave-to[data-v-c4f2d266]{transform:none}}.memory-card[data-v-c4f2d266]:hover{border-color:color-mix(in srgb,var(--md-primary) 45%,var(--md-outline-variant));box-shadow:var(--shadow-2)}.card-top[data-v-c4f2d266]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.btn-icon[data-v-c4f2d266]{position:relative;width:30px;height:30px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--md-on-surface-variant);display:grid;place-items:center;cursor:pointer;margin-left:auto}.btn-icon[data-v-c4f2d266]:after{content:\"\";position:absolute;top:50%;left:50%;width:44px;height:44px;transform:translate(-50%,-50%)}.btn-icon.danger[data-v-c4f2d266]:hover{background:var(--md-error-container);color:var(--md-error)}.memory-content[data-v-c4f2d266]{margin:0;line-height:1.65;font-size:14px;white-space:pre-wrap}.tags[data-v-c4f2d266]{display:flex;gap:6px;flex-wrap:wrap}.tags span[data-v-c4f2d266]{font-size:12px;font-weight:500;color:var(--md-on-primary-container);background:var(--md-primary-container);padding:3px 8px;border-radius:999px}.memory-foot[data-v-c4f2d266]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding-top:12px;border-top:1px solid var(--md-outline-variant)}.meter[data-v-c4f2d266]{display:flex;align-items:center;gap:7px;font-size:12px;color:var(--md-on-surface-variant)}.meter-bar[data-v-c4f2d266]{width:56px;height:5px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-c4f2d266]{display:block;height:100%;width:100%;transform-origin:left;transform:scaleX(var(--v,0%));border-radius:999px;transition:transform .3s var(--ease-out,ease)}.fill-primary[data-v-c4f2d266]{background:var(--md-primary)}.fill-secondary[data-v-c4f2d266]{background:var(--md-secondary,#536255)}.meter-text[data-v-c4f2d266]{margin-left:auto;font-size:12px;color:var(--md-on-surface-variant)}.detail[data-v-c4f2d266]{border-top:1px solid var(--md-outline-variant);padding-top:10px}.detail dl[data-v-c4f2d266]{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0;font-size:12px}.detail dt[data-v-c4f2d266]{color:var(--md-on-surface-variant);font-weight:600}.detail dd[data-v-c4f2d266]{margin:3px 0 0;overflow-wrap:anywhere}.detail code[data-v-c4f2d266]{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px}.card-actions[data-v-c4f2d266]{display:flex;gap:8px;justify-content:flex-end}.hidden-input[data-v-c4f2d266]{display:none}.empty-state[data-v-c4f2d266]{padding:56px 24px;text-align:center;background:var(--md-surface-container);border:1px dashed var(--md-outline-variant);border-radius:var(--radius-lg);color:var(--md-on-surface-variant)}.empty-state p[data-v-c4f2d266]{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}.empty-state .hint[data-v-c4f2d266]{margin-top:8px;font-size:13px;font-weight:400;opacity:.85}.pager[data-v-c4f2d266]{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:var(--space-lg)}.grid-notes[data-v-c4f2d266]{display:grid;grid-template-columns:minmax(0,340px) 1fr;gap:var(--space-lg)}.stack-form[data-v-c4f2d266]{display:flex;flex-direction:column;gap:10px}.input[data-v-c4f2d266]{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none}.input[data-v-c4f2d266]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}.input.area[data-v-c4f2d266]{height:auto;padding:10px 14px;min-height:120px;resize:vertical;line-height:1.6}.note-list[data-v-c4f2d266],.reflection-list[data-v-c4f2d266]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}.note-item[data-v-c4f2d266]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}.note-main[data-v-c4f2d266]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.note-main strong[data-v-c4f2d266]{font-size:14px;font-weight:600;overflow-wrap:anywhere}.item-meta[data-v-c4f2d266]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.note-actions[data-v-c4f2d266]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-c4f2d266]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.reader[data-v-c4f2d266]{margin-top:var(--space-lg)}.reader pre[data-v-c4f2d266]{margin:0;max-height:460px;overflow:auto;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;line-height:1.7;white-space:pre-wrap;background:var(--md-surface-container);padding:14px 16px;border-radius:12px}.reflection .card-title[data-v-c4f2d266]{font-size:14px;font-weight:600}.reflection details[data-v-c4f2d266]{margin-top:6px}.reflection summary[data-v-c4f2d266]{cursor:pointer;font-size:12px;color:var(--md-on-surface-variant)}.quote[data-v-c4f2d266]{margin:8px 0 0;font-size:13px;line-height:1.6;background:var(--md-surface-container);padding:8px 12px;border-radius:8px;white-space:pre-wrap;overflow-wrap:anywhere}#app .memory-page .page-header h1[data-v-c4f2d266]{font-size:clamp(24px,2.8vw,34px);font-weight:800;letter-spacing:-.02em}#app .memory-page .stat-grid[data-v-c4f2d266]{gap:var(--space-lg)}#app .memory-page .stat-card[data-v-c4f2d266],#app .memory-page .card[data-v-c4f2d266],#app .memory-page .memory-card[data-v-c4f2d266]{border-color:color-mix(in srgb,var(--md-outline-variant) 55%,transparent);background:var(--md-surface-container-low);box-shadow:var(--shadow-1)}#app .memory-page .stat-card[data-v-c4f2d266]{border-radius:24px;transition:transform .28s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),box-shadow .28s}@media(hover:hover)and (pointer:fine){#app .memory-page .stat-card[data-v-c4f2d266]:hover{transform:translateY(-2px);box-shadow:var(--shadow-2)}}#app .memory-page .stat-value[data-v-c4f2d266]{font-size:34px;font-weight:800;letter-spacing:-.02em}#app .memory-page .icon-badge[data-v-c4f2d266]{width:44px;height:44px;border-radius:16px 16px 16px 6px}#app .memory-page .card[data-v-c4f2d266],#app .memory-page .memory-card[data-v-c4f2d266]{border-radius:24px}#app .memory-page .memory-card[data-v-c4f2d266]{transition:transform .26s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),box-shadow .22s,border-color .2s}@media(hover:hover)and (pointer:fine){#app .memory-page .memory-card[data-v-c4f2d266]:hover{transform:translateY(-2px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--md-primary) 30%,var(--md-outline-variant))}}#app .memory-page .btn[data-v-c4f2d266]{height:44px;padding:0 20px;border-radius:999px;font-weight:700}#app .memory-page .btn-sm[data-v-c4f2d266]{height:34px;padding:0 14px;font-size:13px}#app .memory-page .btn-tonal[data-v-c4f2d266]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}#app .memory-page .btn-primary[data-v-c4f2d266]{background:var(--md-primary);color:var(--md-on-primary);box-shadow:0 6px 16px color-mix(in srgb,var(--md-primary) 28%,transparent)}#app .memory-page .input[data-v-c4f2d266]{height:48px;border:1px solid transparent;border-radius:14px;background:var(--md-surface-container-high);transition:background-color .18s,border-color .18s,box-shadow .2s}#app .memory-page .input[data-v-c4f2d266]:focus{border-color:var(--md-primary);background:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}#app .memory-page .input.area[data-v-c4f2d266]{height:auto;padding:14px 16px}#app .memory-page .search-field input[data-v-c4f2d266]{height:44px}#app .memory-page .search-field.mini[data-v-c4f2d266]{border-color:transparent;background:var(--md-surface-container-high);border-radius:14px}#app .memory-page .select select[data-v-c4f2d266]{height:44px;border-color:transparent;border-radius:14px;background:var(--md-surface-container-high);padding:0 14px}#app .memory-page .tabs[data-v-c4f2d266]{padding:5px;border-radius:999px;background:var(--md-surface-container-high)}#app .memory-page .tabs button[data-v-c4f2d266]{border-radius:999px;padding:9px 20px;font-weight:650}#app .memory-page .tabs button.active[data-v-c4f2d266]{background:var(--md-primary);color:var(--md-on-primary);box-shadow:var(--shadow-1)}#app .memory-page .note-item[data-v-c4f2d266]{border-radius:16px;border-color:color-mix(in srgb,var(--md-outline-variant) 45%,transparent);background:var(--md-surface-container-low)}@media(prefers-reduced-motion:reduce){#app .memory-page .stat-card[data-v-c4f2d266]:hover,#app .memory-page .memory-card[data-v-c4f2d266]:hover{transform:none}.meter-bar i[data-v-c4f2d266]{transition:none}}@media(max-width:900px){.stat-grid[data-v-c4f2d266]{grid-template-columns:repeat(2,1fr)}.grid-notes[data-v-c4f2d266]{grid-template-columns:1fr}}@media(max-width:640px){.page[data-v-c4f2d266]{padding:var(--space-lg)}.header-actions[data-v-c4f2d266]{padding-top:0}.memory-list[data-v-c4f2d266]{grid-template-columns:1fr}}\n";document.head.appendChild(s)}})();
