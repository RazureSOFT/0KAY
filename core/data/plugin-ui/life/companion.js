import { defineComponent as fs, ref as Q, watch as ai, computed as X, nextTick as ps, onUnmounted as _s, onMounted as vo, openBlock as w, createElementBlock as x, Fragment as pt, createElementVNode as s, createTextVNode as gt, normalizeClass as he, toDisplayString as h, createCommentVNode as I, renderList as $t, withDirectives as y, vModelText as S, createVNode as St, vShow as Ai, vModelCheckbox as ct, normalizeStyle as On, createStaticVNode as ms } from "vue";
import { i as vs, _ as zt, b as gs, s as ys, f as go, a as bs, l as ws } from "./assets/kit-CXR4p1ZZ.js";
import { _ as xs, u as Ls } from "./assets/ConfirmDialog.vue_vue_type_style_index_0_lang-BWG9soEK.js";
import { _ as Ps } from "./assets/_plugin-vue_export-helper-CHgC5LLL.js";
function Ts(be) {
  return be && be.__esModule && Object.prototype.hasOwnProperty.call(be, "default") ? be.default : be;
}
var Ii = { exports: {} };
var ks = Ii.exports, yo;
function Cs() {
  return yo || (yo = 1, (function(be, Ee) {
    (function(g, It) {
      It(Ee);
    })(ks, (function(g) {
      var It = "1.9.4";
      function K(t) {
        var e, i, o, a;
        for (i = 1, o = arguments.length; i < o; i++) {
          a = arguments[i];
          for (e in a)
            t[e] = a[e];
        }
        return t;
      }
      var Xt = Object.create || /* @__PURE__ */ (function() {
        function t() {
        }
        return function(e) {
          return t.prototype = e, new t();
        };
      })();
      function U(t, e) {
        var i = Array.prototype.slice;
        if (t.bind)
          return t.bind.apply(t, i.call(arguments, 1));
        var o = i.call(arguments, 2);
        return function() {
          return t.apply(e, o.length ? o.concat(i.call(arguments)) : arguments);
        };
      }
      var ri = 0;
      function W(t) {
        return "_leaflet_id" in t || (t._leaflet_id = ++ri), t._leaflet_id;
      }
      function wt(t, e, i) {
        var o, a, r, u;
        return u = function() {
          o = !1, a && (r.apply(i, a), a = !1);
        }, r = function() {
          o ? a = arguments : (t.apply(i, arguments), setTimeout(u, e), o = !0);
        }, r;
      }
      function ce(t, e, i) {
        var o = e[1], a = e[0], r = o - a;
        return t === o && i ? t : ((t - a) % r + r) % r + a;
      }
      function st() {
        return !1;
      }
      function mt(t, e) {
        if (e === !1)
          return t;
        var i = Math.pow(10, e === void 0 ? 6 : e);
        return Math.round(t * i) / i;
      }
      function li(t) {
        return t.trim ? t.trim() : t.replace(/^\s+|\s+$/g, "");
      }
      function Wt(t) {
        return li(t).split(/\s+/);
      }
      function at(t, e) {
        Object.prototype.hasOwnProperty.call(t, "options") || (t.options = t.options ? Xt(t.options) : {});
        for (var i in e)
          t.options[i] = e[i];
        return t.options;
      }
      function Zi(t, e, i) {
        var o = [];
        for (var a in t)
          o.push(encodeURIComponent(i ? a.toUpperCase() : a) + "=" + encodeURIComponent(t[a]));
        return (!e || e.indexOf("?") === -1 ? "?" : "&") + o.join("&");
      }
      var an = /\{ *([\w_ -]+) *\}/g;
      function Bi(t, e) {
        return t.replace(an, function(i, o) {
          var a = e[o];
          if (a === void 0)
            throw new Error("No value provided for variable " + i);
          return typeof a == "function" && (a = a(e)), a;
        });
      }
      var Dt = Array.isArray || function(t) {
        return Object.prototype.toString.call(t) === "[object Array]";
      };
      function ui(t, e) {
        for (var i = 0; i < t.length; i++)
          if (t[i] === e)
            return i;
        return -1;
      }
      var Ae = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
      function Ie(t) {
        return window["webkit" + t] || window["moz" + t] || window["ms" + t];
      }
      var Ni = 0;
      function Di(t) {
        var e = +/* @__PURE__ */ new Date(), i = Math.max(0, 16 - (e - Ni));
        return Ni = e + i, window.setTimeout(t, i);
      }
      var di = window.requestAnimationFrame || Ie("RequestAnimationFrame") || Di, hi = window.cancelAnimationFrame || Ie("CancelAnimationFrame") || Ie("CancelRequestAnimationFrame") || function(t) {
        window.clearTimeout(t);
      };
      function Pt(t, e, i) {
        if (i && di === Di)
          t.call(e);
        else
          return di.call(window, U(t, e));
      }
      function Ot(t) {
        t && hi.call(window, t);
      }
      var rn = {
        __proto__: null,
        extend: K,
        create: Xt,
        bind: U,
        get lastId() {
          return ri;
        },
        stamp: W,
        throttle: wt,
        wrapNum: ce,
        falseFn: st,
        formatNum: mt,
        trim: li,
        splitWords: Wt,
        setOptions: at,
        getParamString: Zi,
        template: Bi,
        isArray: Dt,
        indexOf: ui,
        emptyImageUrl: Ae,
        requestFn: di,
        cancelFn: hi,
        requestAnimFrame: Pt,
        cancelAnimFrame: Ot
      };
      function tt() {
      }
      tt.extend = function(t) {
        var e = function() {
          at(this), this.initialize && this.initialize.apply(this, arguments), this.callInitHooks();
        }, i = e.__super__ = this.prototype, o = Xt(i);
        o.constructor = e, e.prototype = o;
        for (var a in this)
          Object.prototype.hasOwnProperty.call(this, a) && a !== "prototype" && a !== "__super__" && (e[a] = this[a]);
        return t.statics && K(e, t.statics), t.includes && (Ze(t.includes), K.apply(null, [o].concat(t.includes))), K(o, t), delete o.statics, delete o.includes, o.options && (o.options = i.options ? Xt(i.options) : {}, K(o.options, t.options)), o._initHooks = [], o.callInitHooks = function() {
          if (!this._initHooksCalled) {
            i.callInitHooks && i.callInitHooks.call(this), this._initHooksCalled = !0;
            for (var r = 0, u = o._initHooks.length; r < u; r++)
              o._initHooks[r].call(this);
          }
        }, e;
      }, tt.include = function(t) {
        var e = this.prototype.options;
        return K(this.prototype, t), t.options && (this.prototype.options = e, this.mergeOptions(t.options)), this;
      }, tt.mergeOptions = function(t) {
        return K(this.prototype.options, t), this;
      }, tt.addInitHook = function(t) {
        var e = Array.prototype.slice.call(arguments, 1), i = typeof t == "function" ? t : function() {
          this[t].apply(this, e);
        };
        return this.prototype._initHooks = this.prototype._initHooks || [], this.prototype._initHooks.push(i), this;
      };
      function Ze(t) {
        if (!(typeof L > "u" || !L || !L.Mixin)) {
          t = Dt(t) ? t : [t];
          for (var e = 0; e < t.length; e++)
            t[e] === L.Mixin.Events && console.warn("Deprecated include of L.Mixin.Events: this property will be removed in future releases, please inherit from L.Evented instead.", new Error().stack);
        }
      }
      var yt = {
        /* @method on(type: String, fn: Function, context?: Object): this
         * Adds a listener function (`fn`) to a particular event type of the object. You can optionally specify the context of the listener (object the this keyword will point to). You can also pass several space-separated types (e.g. `'click dblclick'`).
         *
         * @alternative
         * @method on(eventMap: Object): this
         * Adds a set of type/listener pairs, e.g. `{click: onClick, mousemove: onMouseMove}`
         */
        on: function(t, e, i) {
          if (typeof t == "object")
            for (var o in t)
              this._on(o, t[o], e);
          else {
            t = Wt(t);
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
            for (var o in t)
              this._off(o, t[o], e);
          else {
            t = Wt(t);
            for (var a = arguments.length === 1, r = 0, u = t.length; r < u; r++)
              a ? this._off(t[r]) : this._off(t[r], e, i);
          }
          return this;
        },
        // attach listener (without syntactic sugar now)
        _on: function(t, e, i, o) {
          if (typeof e != "function") {
            console.warn("wrong listener type: " + typeof e);
            return;
          }
          if (this._listens(t, e, i) === !1) {
            i === this && (i = void 0);
            var a = { fn: e, ctx: i };
            o && (a.once = !0), this._events = this._events || {}, this._events[t] = this._events[t] || [], this._events[t].push(a);
          }
        },
        _off: function(t, e, i) {
          var o, a, r;
          if (this._events && (o = this._events[t], !!o)) {
            if (arguments.length === 1) {
              if (this._firingCount)
                for (a = 0, r = o.length; a < r; a++)
                  o[a].fn = st;
              delete this._events[t];
              return;
            }
            if (typeof e != "function") {
              console.warn("wrong listener type: " + typeof e);
              return;
            }
            var u = this._listens(t, e, i);
            if (u !== !1) {
              var d = o[u];
              this._firingCount && (d.fn = st, this._events[t] = o = o.slice()), o.splice(u, 1);
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
          var o = K({}, e, {
            type: t,
            target: this,
            sourceTarget: e && e.sourceTarget || this
          });
          if (this._events) {
            var a = this._events[t];
            if (a) {
              this._firingCount = this._firingCount + 1 || 1;
              for (var r = 0, u = a.length; r < u; r++) {
                var d = a[r], c = d.fn;
                d.once && this.off(t, c, d.ctx), c.call(d.ctx || this, o);
              }
              this._firingCount--;
            }
          }
          return i && this._propagateEvent(o), this;
        },
        // @method listens(type: String, propagate?: Boolean): Boolean
        // @method listens(type: String, fn: Function, context?: Object, propagate?: Boolean): Boolean
        // Returns `true` if a particular event type has any listeners attached to it.
        // The verification can optionally be propagated, it will return `true` if parents have the listener attached to it.
        listens: function(t, e, i, o) {
          typeof t != "string" && console.warn('"string" type argument expected');
          var a = e;
          typeof e != "function" && (o = !!e, a = void 0, i = void 0);
          var r = this._events && this._events[t];
          if (r && r.length && this._listens(t, a, i) !== !1)
            return !0;
          if (o) {
            for (var u in this._eventParents)
              if (this._eventParents[u].listens(t, e, i, o))
                return !0;
          }
          return !1;
        },
        // returns the index (number) or false
        _listens: function(t, e, i) {
          if (!this._events)
            return !1;
          var o = this._events[t] || [];
          if (!e)
            return !!o.length;
          i === this && (i = void 0);
          for (var a = 0, r = o.length; a < r; a++)
            if (o[a].fn === e && o[a].ctx === i)
              return a;
          return !1;
        },
        // @method once(…): this
        // Behaves as [`on(…)`](#evented-on), except the listener will only get fired once and then removed.
        once: function(t, e, i) {
          if (typeof t == "object")
            for (var o in t)
              this._on(o, t[o], e, !0);
          else {
            t = Wt(t);
            for (var a = 0, r = t.length; a < r; a++)
              this._on(t[a], e, i, !0);
          }
          return this;
        },
        // @method addEventParent(obj: Evented): this
        // Adds an event parent - an `Evented` that will receive propagated events
        addEventParent: function(t) {
          return this._eventParents = this._eventParents || {}, this._eventParents[W(t)] = t, this;
        },
        // @method removeEventParent(obj: Evented): this
        // Removes an event parent, so it will stop receiving propagated events
        removeEventParent: function(t) {
          return this._eventParents && delete this._eventParents[W(t)], this;
        },
        _propagateEvent: function(t) {
          for (var e in this._eventParents)
            this._eventParents[e].fire(t.type, K({
              layer: t.target,
              propagatedFrom: t.target
            }, t), !0);
        }
      };
      yt.addEventListener = yt.on, yt.removeEventListener = yt.clearAllEventListeners = yt.off, yt.addOneTimeEventListener = yt.once, yt.fireEvent = yt.fire, yt.hasEventListeners = yt.listens;
      var Et = tt.extend(yt);
      function Z(t, e, i) {
        this.x = i ? Math.round(t) : t, this.y = i ? Math.round(e) : e;
      }
      var ci = Math.trunc || function(t) {
        return t > 0 ? Math.floor(t) : Math.ceil(t);
      };
      Z.prototype = {
        // @method clone(): Point
        // Returns a copy of the current point.
        clone: function() {
          return new Z(this.x, this.y);
        },
        // @method add(otherPoint: Point): Point
        // Returns the result of addition of the current and the given points.
        add: function(t) {
          return this.clone()._add(A(t));
        },
        _add: function(t) {
          return this.x += t.x, this.y += t.y, this;
        },
        // @method subtract(otherPoint: Point): Point
        // Returns the result of subtraction of the given point from the current.
        subtract: function(t) {
          return this.clone()._subtract(A(t));
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
          return new Z(this.x * t.x, this.y * t.y);
        },
        // @method unscaleBy(scale: Point): Point
        // Inverse of `scaleBy`. Divide each coordinate of the current point by
        // each coordinate of `scale`.
        unscaleBy: function(t) {
          return new Z(this.x / t.x, this.y / t.y);
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
          return this.x = ci(this.x), this.y = ci(this.y), this;
        },
        // @method distanceTo(otherPoint: Point): Number
        // Returns the cartesian distance between the current and the given points.
        distanceTo: function(t) {
          t = A(t);
          var e = t.x - this.x, i = t.y - this.y;
          return Math.sqrt(e * e + i * i);
        },
        // @method equals(otherPoint: Point): Boolean
        // Returns `true` if the given point has the same coordinates.
        equals: function(t) {
          return t = A(t), t.x === this.x && t.y === this.y;
        },
        // @method contains(otherPoint: Point): Boolean
        // Returns `true` if both coordinates of the given point are less than the corresponding current point coordinates (in absolute values).
        contains: function(t) {
          return t = A(t), Math.abs(t.x) <= Math.abs(this.x) && Math.abs(t.y) <= Math.abs(this.y);
        },
        // @method toString(): String
        // Returns a string representation of the point for debugging purposes.
        toString: function() {
          return "Point(" + mt(this.x) + ", " + mt(this.y) + ")";
        }
      };
      function A(t, e, i) {
        return t instanceof Z ? t : Dt(t) ? new Z(t[0], t[1]) : t == null ? t : typeof t == "object" && "x" in t && "y" in t ? new Z(t.x, t.y) : new Z(t, e, i);
      }
      function et(t, e) {
        if (t)
          for (var i = e ? [t, e] : t, o = 0, a = i.length; o < a; o++)
            this.extend(i[o]);
      }
      et.prototype = {
        // @method extend(point: Point): this
        // Extends the bounds to contain the given point.
        // @alternative
        // @method extend(otherBounds: Bounds): this
        // Extend the bounds to contain the given bounds
        extend: function(t) {
          var e, i;
          if (!t)
            return this;
          if (t instanceof Z || typeof t[0] == "number" || "x" in t)
            e = i = A(t);
          else if (t = nt(t), e = t.min, i = t.max, !e || !i)
            return this;
          return !this.min && !this.max ? (this.min = e.clone(), this.max = i.clone()) : (this.min.x = Math.min(e.x, this.min.x), this.max.x = Math.max(i.x, this.max.x), this.min.y = Math.min(e.y, this.min.y), this.max.y = Math.max(i.y, this.max.y)), this;
        },
        // @method getCenter(round?: Boolean): Point
        // Returns the center point of the bounds.
        getCenter: function(t) {
          return A(
            (this.min.x + this.max.x) / 2,
            (this.min.y + this.max.y) / 2,
            t
          );
        },
        // @method getBottomLeft(): Point
        // Returns the bottom-left point of the bounds.
        getBottomLeft: function() {
          return A(this.min.x, this.max.y);
        },
        // @method getTopRight(): Point
        // Returns the top-right point of the bounds.
        getTopRight: function() {
          return A(this.max.x, this.min.y);
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
          return typeof t[0] == "number" || t instanceof Z ? t = A(t) : t = nt(t), t instanceof et ? (e = t.min, i = t.max) : e = i = t, e.x >= this.min.x && i.x <= this.max.x && e.y >= this.min.y && i.y <= this.max.y;
        },
        // @method intersects(otherBounds: Bounds): Boolean
        // Returns `true` if the rectangle intersects the given bounds. Two bounds
        // intersect if they have at least one point in common.
        intersects: function(t) {
          t = nt(t);
          var e = this.min, i = this.max, o = t.min, a = t.max, r = a.x >= e.x && o.x <= i.x, u = a.y >= e.y && o.y <= i.y;
          return r && u;
        },
        // @method overlaps(otherBounds: Bounds): Boolean
        // Returns `true` if the rectangle overlaps the given bounds. Two bounds
        // overlap if their intersection is an area.
        overlaps: function(t) {
          t = nt(t);
          var e = this.min, i = this.max, o = t.min, a = t.max, r = a.x > e.x && o.x < i.x, u = a.y > e.y && o.y < i.y;
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
          var e = this.min, i = this.max, o = Math.abs(e.x - i.x) * t, a = Math.abs(e.y - i.y) * t;
          return nt(
            A(e.x - o, e.y - a),
            A(i.x + o, i.y + a)
          );
        },
        // @method equals(otherBounds: Bounds): Boolean
        // Returns `true` if the rectangle is equivalent to the given bounds.
        equals: function(t) {
          return t ? (t = nt(t), this.min.equals(t.getTopLeft()) && this.max.equals(t.getBottomRight())) : !1;
        }
      };
      function nt(t, e) {
        return !t || t instanceof et ? t : new et(t, e);
      }
      function $(t, e) {
        if (t)
          for (var i = e ? [t, e] : t, o = 0, a = i.length; o < a; o++)
            this.extend(i[o]);
      }
      $.prototype = {
        // @method extend(latlng: LatLng): this
        // Extend the bounds to contain the given point
        // @alternative
        // @method extend(otherBounds: LatLngBounds): this
        // Extend the bounds to contain the given bounds
        extend: function(t) {
          var e = this._southWest, i = this._northEast, o, a;
          if (t instanceof Y)
            o = t, a = t;
          else if (t instanceof $) {
            if (o = t._southWest, a = t._northEast, !o || !a)
              return this;
          } else
            return t ? this.extend(F(t) || T(t)) : this;
          return !e && !i ? (this._southWest = new Y(o.lat, o.lng), this._northEast = new Y(a.lat, a.lng)) : (e.lat = Math.min(o.lat, e.lat), e.lng = Math.min(o.lng, e.lng), i.lat = Math.max(a.lat, i.lat), i.lng = Math.max(a.lng, i.lng)), this;
        },
        // @method pad(bufferRatio: Number): LatLngBounds
        // Returns bounds created by extending or retracting the current bounds by a given ratio in each direction.
        // For example, a ratio of 0.5 extends the bounds by 50% in each direction.
        // Negative values will retract the bounds.
        pad: function(t) {
          var e = this._southWest, i = this._northEast, o = Math.abs(e.lat - i.lat) * t, a = Math.abs(e.lng - i.lng) * t;
          return new $(
            new Y(e.lat - o, e.lng - a),
            new Y(i.lat + o, i.lng + a)
          );
        },
        // @method getCenter(): LatLng
        // Returns the center point of the bounds.
        getCenter: function() {
          return new Y(
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
          return new Y(this.getNorth(), this.getWest());
        },
        // @method getSouthEast(): LatLng
        // Returns the south-east point of the bounds.
        getSouthEast: function() {
          return new Y(this.getSouth(), this.getEast());
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
          typeof t[0] == "number" || t instanceof Y || "lat" in t ? t = F(t) : t = T(t);
          var e = this._southWest, i = this._northEast, o, a;
          return t instanceof $ ? (o = t.getSouthWest(), a = t.getNorthEast()) : o = a = t, o.lat >= e.lat && a.lat <= i.lat && o.lng >= e.lng && a.lng <= i.lng;
        },
        // @method intersects(otherBounds: LatLngBounds): Boolean
        // Returns `true` if the rectangle intersects the given bounds. Two bounds intersect if they have at least one point in common.
        intersects: function(t) {
          t = T(t);
          var e = this._southWest, i = this._northEast, o = t.getSouthWest(), a = t.getNorthEast(), r = a.lat >= e.lat && o.lat <= i.lat, u = a.lng >= e.lng && o.lng <= i.lng;
          return r && u;
        },
        // @method overlaps(otherBounds: LatLngBounds): Boolean
        // Returns `true` if the rectangle overlaps the given bounds. Two bounds overlap if their intersection is an area.
        overlaps: function(t) {
          t = T(t);
          var e = this._southWest, i = this._northEast, o = t.getSouthWest(), a = t.getNorthEast(), r = a.lat > e.lat && o.lat < i.lat, u = a.lng > e.lng && o.lng < i.lng;
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
          return t ? (t = T(t), this._southWest.equals(t.getSouthWest(), e) && this._northEast.equals(t.getNorthEast(), e)) : !1;
        },
        // @method isValid(): Boolean
        // Returns `true` if the bounds are properly initialized.
        isValid: function() {
          return !!(this._southWest && this._northEast);
        }
      };
      function T(t, e) {
        return t instanceof $ ? t : new $(t, e);
      }
      function Y(t, e, i) {
        if (isNaN(t) || isNaN(e))
          throw new Error("Invalid LatLng object: (" + t + ", " + e + ")");
        this.lat = +t, this.lng = +e, i !== void 0 && (this.alt = +i);
      }
      Y.prototype = {
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
          return "LatLng(" + mt(this.lat, t) + ", " + mt(this.lng, t) + ")";
        },
        // @method distanceTo(otherLatLng: LatLng): Number
        // Returns the distance (in meters) to the given `LatLng` calculated using the [Spherical Law of Cosines](https://en.wikipedia.org/wiki/Spherical_law_of_cosines).
        distanceTo: function(t) {
          return Gt.distance(this, F(t));
        },
        // @method wrap(): LatLng
        // Returns a new `LatLng` object with the longitude wrapped so it's always between -180 and +180 degrees.
        wrap: function() {
          return Gt.wrapLatLng(this);
        },
        // @method toBounds(sizeInMeters: Number): LatLngBounds
        // Returns a new `LatLngBounds` object in which each boundary is `sizeInMeters/2` meters apart from the `LatLng`.
        toBounds: function(t) {
          var e = 180 * t / 40075017, i = e / Math.cos(Math.PI / 180 * this.lat);
          return T(
            [this.lat - e, this.lng - i],
            [this.lat + e, this.lng + i]
          );
        },
        clone: function() {
          return new Y(this.lat, this.lng, this.alt);
        }
      };
      function F(t, e, i) {
        return t instanceof Y ? t : Dt(t) && typeof t[0] != "object" ? t.length === 3 ? new Y(t[0], t[1], t[2]) : t.length === 2 ? new Y(t[0], t[1]) : null : t == null ? t : typeof t == "object" && "lat" in t ? new Y(t.lat, "lng" in t ? t.lng : t.lon, t.alt) : e === void 0 ? null : new Y(t, e, i);
      }
      var Rt = {
        // @method latLngToPoint(latlng: LatLng, zoom: Number): Point
        // Projects geographical coordinates into pixel coordinates for a given zoom.
        latLngToPoint: function(t, e) {
          var i = this.projection.project(t), o = this.scale(e);
          return this.transformation._transform(i, o);
        },
        // @method pointToLatLng(point: Point, zoom: Number): LatLng
        // The inverse of `latLngToPoint`. Projects pixel coordinates on a given
        // zoom into geographical coordinates.
        pointToLatLng: function(t, e) {
          var i = this.scale(e), o = this.transformation.untransform(t, i);
          return this.projection.unproject(o);
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
          var e = this.projection.bounds, i = this.scale(t), o = this.transformation.transform(e.min, i), a = this.transformation.transform(e.max, i);
          return new et(o, a);
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
          var e = this.wrapLng ? ce(t.lng, this.wrapLng, !0) : t.lng, i = this.wrapLat ? ce(t.lat, this.wrapLat, !0) : t.lat, o = t.alt;
          return new Y(i, e, o);
        },
        // @method wrapLatLngBounds(bounds: LatLngBounds): LatLngBounds
        // Returns a `LatLngBounds` with the same size as the given one, ensuring
        // that its center is within the CRS's bounds.
        // Only accepts actual `L.LatLngBounds` instances, not arrays.
        wrapLatLngBounds: function(t) {
          var e = t.getCenter(), i = this.wrapLatLng(e), o = e.lat - i.lat, a = e.lng - i.lng;
          if (o === 0 && a === 0)
            return t;
          var r = t.getSouthWest(), u = t.getNorthEast(), d = new Y(r.lat - o, r.lng - a), c = new Y(u.lat - o, u.lng - a);
          return new $(d, c);
        }
      }, Gt = K({}, Rt, {
        wrapLng: [-180, 180],
        // Mean Earth Radius, as recommended for use by
        // the International Union of Geodesy and Geophysics,
        // see https://rosettacode.org/wiki/Haversine_formula
        R: 6371e3,
        // distance between two geographical points using spherical law of cosines approximation
        distance: function(t, e) {
          var i = Math.PI / 180, o = t.lat * i, a = e.lat * i, r = Math.sin((e.lat - t.lat) * i / 2), u = Math.sin((e.lng - t.lng) * i / 2), d = r * r + Math.cos(o) * Math.cos(a) * u * u, c = 2 * Math.atan2(Math.sqrt(d), Math.sqrt(1 - d));
          return this.R * c;
        }
      }), fi = 6378137, pi = {
        R: fi,
        MAX_LATITUDE: 85.0511287798,
        project: function(t) {
          var e = Math.PI / 180, i = this.MAX_LATITUDE, o = Math.max(Math.min(i, t.lat), -i), a = Math.sin(o * e);
          return new Z(
            this.R * t.lng * e,
            this.R * Math.log((1 + a) / (1 - a)) / 2
          );
        },
        unproject: function(t) {
          var e = 180 / Math.PI;
          return new Y(
            (2 * Math.atan(Math.exp(t.y / this.R)) - Math.PI / 2) * e,
            t.x * e / this.R
          );
        },
        bounds: (function() {
          var t = fi * Math.PI;
          return new et([-t, -t], [t, t]);
        })()
      };
      function Vt(t, e, i, o) {
        if (Dt(t)) {
          this._a = t[0], this._b = t[1], this._c = t[2], this._d = t[3];
          return;
        }
        this._a = t, this._b = e, this._c = i, this._d = o;
      }
      Vt.prototype = {
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
          return e = e || 1, new Z(
            (t.x / e - this._b) / this._a,
            (t.y / e - this._d) / this._c
          );
        }
      };
      function we(t, e, i, o) {
        return new Vt(t, e, i, o);
      }
      var ft = K({}, Gt, {
        code: "EPSG:3857",
        projection: pi,
        transformation: (function() {
          var t = 0.5 / (Math.PI * pi.R);
          return we(t, 0.5, -t, 0.5);
        })()
      }), Yt = K({}, ft, {
        code: "EPSG:900913"
      });
      function Be(t) {
        return document.createElementNS("http://www.w3.org/2000/svg", t);
      }
      function Ri(t, e) {
        var i = "", o, a, r, u, d, c;
        for (o = 0, r = t.length; o < r; o++) {
          for (d = t[o], a = 0, u = d.length; a < u; a++)
            c = d[a], i += (a ? "L" : "M") + c.x + " " + c.y;
          i += e ? b.svg ? "z" : "x" : "";
        }
        return i || "M0 0";
      }
      var Ne = document.documentElement.style, xe = "ActiveXObject" in window, ln = xe && !document.addEventListener, Vi = "msLaunchUri" in navigator && !("documentMode" in document), De = kt("webkit"), _i = kt("android"), Ui = kt("android 2") || kt("android 3"), un = parseInt(/WebKit\/([0-9]+)|$/.exec(navigator.userAgent)[1], 10), N = _i && kt("Google") && un < 537 && !("AudioNode" in window), fe = !!window.opera, Re = !Vi && kt("chrome"), mi = kt("gecko") && !De && !fe && !xe, Fi = !Re && kt("safari"), Ve = kt("phantom"), m = "OTransition" in Ne, Ue = navigator.platform.indexOf("Win") === 0, Hi = xe && "transition" in Ne, pe = "WebKitCSSMatrix" in window && "m11" in new window.WebKitCSSMatrix() && !Ui, Le = "MozPerspective" in Ne, Fe = !window.L_DISABLE_3D && (Hi || pe || Le) && !m && !Ve, Jt = typeof orientation < "u" || kt("mobile"), He = Jt && De, We = Jt && pe, Pe = !window.PointerEvent && window.MSPointerEvent, Te = !!(window.PointerEvent || Pe), Zt = "ontouchstart" in window || !!window.TouchEvent, Ge = !window.L_NO_TOUCH && (Zt || Te), dn = Jt && fe, jt = Jt && mi, R = (window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI) > 1, hn = (function() {
        var t = !1;
        try {
          var e = Object.defineProperty({}, "passive", {
            get: function() {
              t = !0;
            }
          });
          window.addEventListener("testPassiveEventSupport", st, e), window.removeEventListener("testPassiveEventSupport", st, e);
        } catch {
        }
        return t;
      })(), cn = (function() {
        return !!document.createElement("canvas").getContext;
      })(), vi = !!(document.createElementNS && Be("svg").createSVGRect), Wi = !!vi && (function() {
        var t = document.createElement("div");
        return t.innerHTML = "<svg/>", (t.firstChild && t.firstChild.namespaceURI) === "http://www.w3.org/2000/svg";
      })(), fn = !vi && (function() {
        try {
          var t = document.createElement("div");
          t.innerHTML = '<v:shape adj="1"/>';
          var e = t.firstChild;
          return e.style.behavior = "url(#default#VML)", e && typeof e.adj == "object";
        } catch {
          return !1;
        }
      })(), Tt = navigator.platform.indexOf("Mac") === 0, je = navigator.platform.indexOf("Linux") === 0;
      function kt(t) {
        return navigator.userAgent.toLowerCase().indexOf(t) >= 0;
      }
      var b = {
        ie: xe,
        ielt9: ln,
        edge: Vi,
        webkit: De,
        android: _i,
        android23: Ui,
        androidStock: N,
        opera: fe,
        chrome: Re,
        gecko: mi,
        safari: Fi,
        phantom: Ve,
        opera12: m,
        win: Ue,
        ie3d: Hi,
        webkit3d: pe,
        gecko3d: Le,
        any3d: Fe,
        mobile: Jt,
        mobileWebkit: He,
        mobileWebkit3d: We,
        msPointer: Pe,
        pointer: Te,
        touch: Ge,
        touchNative: Zt,
        mobileOpera: dn,
        mobileGecko: jt,
        retina: R,
        passiveEvents: hn,
        canvas: cn,
        svg: vi,
        vml: fn,
        inlineSvg: Wi,
        mac: Tt,
        linux: je
      }, O = b.msPointer ? "MSPointerDown" : "pointerdown", qe = b.msPointer ? "MSPointerMove" : "pointermove", gi = b.msPointer ? "MSPointerUp" : "pointerup", yi = b.msPointer ? "MSPointerCancel" : "pointercancel", ne = {
        touchstart: O,
        touchmove: qe,
        touchend: gi,
        touchcancel: yi
      }, oe = {
        touchstart: mn,
        touchmove: Xe,
        touchend: Xe,
        touchcancel: Xe
      }, Bt = {}, Ke = !1;
      function Qt(t, e, i) {
        return e === "touchstart" && Ut(), oe[e] ? (i = oe[e].bind(this, i), t.addEventListener(ne[e], i, !1), i) : (console.warn("wrong event specified:", e), st);
      }
      function pn(t, e, i) {
        if (!ne[e]) {
          console.warn("wrong event specified:", e);
          return;
        }
        t.removeEventListener(ne[e], i, !1);
      }
      function _n(t) {
        Bt[t.pointerId] = t;
      }
      function $e(t) {
        Bt[t.pointerId] && (Bt[t.pointerId] = t);
      }
      function xt(t) {
        delete Bt[t.pointerId];
      }
      function Ut() {
        Ke || (document.addEventListener(O, _n, !0), document.addEventListener(qe, $e, !0), document.addEventListener(gi, xt, !0), document.addEventListener(yi, xt, !0), Ke = !0);
      }
      function Xe(t, e) {
        if (e.pointerType !== (e.MSPOINTER_TYPE_MOUSE || "mouse")) {
          e.touches = [];
          for (var i in Bt)
            e.touches.push(Bt[i]);
          e.changedTouches = [e], t(e);
        }
      }
      function mn(t, e) {
        e.MSPOINTER_TYPE_TOUCH && e.pointerType === e.MSPOINTER_TYPE_TOUCH && Lt(e), Xe(t, e);
      }
      function Gi(t) {
        var e = {}, i, o;
        for (o in t)
          i = t[o], e[o] = i && i.bind ? i.bind(t) : i;
        return t = e, e.type = "dblclick", e.detail = 2, e.isTrusted = !1, e._simulated = !0, e;
      }
      var vn = 200;
      function bi(t, e) {
        t.addEventListener("dblclick", e);
        var i = 0, o;
        function a(r) {
          if (r.detail !== 1) {
            o = r.detail;
            return;
          }
          if (!(r.pointerType === "mouse" || r.sourceCapabilities && !r.sourceCapabilities.firesTouchEvents)) {
            var u = En(r);
            if (!(u.some(function(c) {
              return c instanceof HTMLLabelElement && c.attributes.for;
            }) && !u.some(function(c) {
              return c instanceof HTMLInputElement || c instanceof HTMLSelectElement;
            }))) {
              var d = Date.now();
              d - i <= vn ? (o++, o === 2 && e(Gi(r))) : o = 1, i = d;
            }
          }
        }
        return t.addEventListener("click", a), {
          dblclick: e,
          simDblclick: a
        };
      }
      function gn(t, e) {
        t.removeEventListener("dblclick", e.dblclick), t.removeEventListener("click", e.simDblclick);
      }
      var _e = ke(
        ["transform", "webkitTransform", "OTransform", "MozTransform", "msTransform"]
      ), te = ke(
        ["webkitTransition", "transition", "OTransition", "MozTransition", "msTransition"]
      ), wi = te === "webkitTransition" || te === "OTransition" ? te + "End" : "transitionend";
      function Ye(t) {
        return typeof t == "string" ? document.getElementById(t) : t;
      }
      function se(t, e) {
        var i = t.style[e] || t.currentStyle && t.currentStyle[e];
        if ((!i || i === "auto") && document.defaultView) {
          var o = document.defaultView.getComputedStyle(t, null);
          i = o ? o[e] : null;
        }
        return i === "auto" ? null : i;
      }
      function G(t, e, i) {
        var o = document.createElement(t);
        return o.className = e || "", i && i.appendChild(o), o;
      }
      function ut(t) {
        var e = t.parentNode;
        e && e.removeChild(t);
      }
      function Je(t) {
        for (; t.firstChild; )
          t.removeChild(t.firstChild);
      }
      function me(t) {
        var e = t.parentNode;
        e && e.lastChild !== t && e.appendChild(t);
      }
      function ve(t) {
        var e = t.parentNode;
        e && e.firstChild !== t && e.insertBefore(t, e.firstChild);
      }
      function xi(t, e) {
        if (t.classList !== void 0)
          return t.classList.contains(e);
        var i = H(t);
        return i.length > 0 && new RegExp("(^|\\s)" + e + "(\\s|$)").test(i);
      }
      function B(t, e) {
        if (t.classList !== void 0)
          for (var i = Wt(e), o = 0, a = i.length; o < a; o++)
            t.classList.add(i[o]);
        else if (!xi(t, e)) {
          var r = H(t);
          Li(t, (r ? r + " " : "") + e);
        }
      }
      function rt(t, e) {
        t.classList !== void 0 ? t.classList.remove(e) : Li(t, li((" " + H(t) + " ").replace(" " + e + " ", " ")));
      }
      function Li(t, e) {
        t.className.baseVal === void 0 ? t.className = e : t.className.baseVal = e;
      }
      function H(t) {
        return t.correspondingElement && (t = t.correspondingElement), t.className.baseVal === void 0 ? t.className : t.className.baseVal;
      }
      function Ct(t, e) {
        "opacity" in t.style ? t.style.opacity = e : "filter" in t.style && ji(t, e);
      }
      function ji(t, e) {
        var i = !1, o = "DXImageTransform.Microsoft.Alpha";
        try {
          i = t.filters.item(o);
        } catch {
          if (e === 1)
            return;
        }
        e = Math.round(e * 100), i ? (i.Enabled = e !== 100, i.Opacity = e) : t.style.filter += " progid:" + o + "(opacity=" + e + ")";
      }
      function ke(t) {
        for (var e = document.documentElement.style, i = 0; i < t.length; i++)
          if (t[i] in e)
            return t[i];
        return !1;
      }
      function p(t, e, i) {
        var o = e || new Z(0, 0);
        t.style[_e] = (b.ie3d ? "translate(" + o.x + "px," + o.y + "px)" : "translate3d(" + o.x + "px," + o.y + "px,0)") + (i ? " scale(" + i + ")" : "");
      }
      function dt(t, e) {
        t._leaflet_pos = e, b.any3d ? p(t, e) : (t.style.left = e.x + "px", t.style.top = e.y + "px");
      }
      function ae(t) {
        return t._leaflet_pos || new Z(0, 0);
      }
      var Ce, Se, Qe;
      if ("onselectstart" in document)
        Ce = function() {
          C(window, "selectstart", Lt);
        }, Se = function() {
          it(window, "selectstart", Lt);
        };
      else {
        var Me = ke(
          ["userSelect", "WebkitUserSelect", "OUserSelect", "MozUserSelect", "msUserSelect"]
        );
        Ce = function() {
          if (Me) {
            var t = document.documentElement.style;
            Qe = t[Me], t[Me] = "none";
          }
        }, Se = function() {
          Me && (document.documentElement.style[Me] = Qe, Qe = void 0);
        };
      }
      function Pi() {
        C(window, "dragstart", Lt);
      }
      function Ti() {
        it(window, "dragstart", Lt);
      }
      var f, n;
      function l(t) {
        for (; t.tabIndex === -1; )
          t = t.parentNode;
        t.style && (z(), f = t, n = t.style.outlineStyle, t.style.outlineStyle = "none", C(window, "keydown", z));
      }
      function z() {
        f && (f.style.outlineStyle = n, f = void 0, n = void 0, it(window, "keydown", z));
      }
      function k(t) {
        do
          t = t.parentNode;
        while ((!t.offsetWidth || !t.offsetHeight) && t !== document.body);
        return t;
      }
      function V(t) {
        var e = t.getBoundingClientRect();
        return {
          x: e.width / t.offsetWidth || 1,
          y: e.height / t.offsetHeight || 1,
          boundingClientRect: e
        };
      }
      var J = {
        __proto__: null,
        TRANSFORM: _e,
        TRANSITION: te,
        TRANSITION_END: wi,
        get: Ye,
        getStyle: se,
        create: G,
        remove: ut,
        empty: Je,
        toFront: me,
        toBack: ve,
        hasClass: xi,
        addClass: B,
        removeClass: rt,
        setClass: Li,
        getClass: H,
        setOpacity: Ct,
        testProp: ke,
        setTransform: p,
        setPosition: dt,
        getPosition: ae,
        get disableTextSelection() {
          return Ce;
        },
        get enableTextSelection() {
          return Se;
        },
        disableImageDrag: Pi,
        enableImageDrag: Ti,
        preventOutline: l,
        restoreOutline: z,
        getSizedParentNode: k,
        getScale: V
      };
      function C(t, e, i, o) {
        if (e && typeof e == "object")
          for (var a in e)
            j(t, a, e[a], i);
        else {
          e = Wt(e);
          for (var r = 0, u = e.length; r < u; r++)
            j(t, e[r], i, o);
        }
        return this;
      }
      var Nt = "_leaflet_events";
      function it(t, e, i, o) {
        if (arguments.length === 1)
          ki(t), delete t[Nt];
        else if (e && typeof e == "object")
          for (var a in e)
            ot(t, a, e[a], i);
        else if (e = Wt(e), arguments.length === 2)
          ki(t, function(d) {
            return ui(e, d) !== -1;
          });
        else
          for (var r = 0, u = e.length; r < u; r++)
            ot(t, e[r], i, o);
        return this;
      }
      function ki(t, e) {
        for (var i in t[Nt]) {
          var o = i.split(/\d/)[0];
          (!e || e(o)) && ot(t, o, null, null, i);
        }
      }
      var v = {
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        wheel: !("onwheel" in window) && "mousewheel"
      };
      function j(t, e, i, o) {
        var a = e + W(i) + (o ? "_" + W(o) : "");
        if (t[Nt] && t[Nt][a])
          return this;
        var r = function(d) {
          return i.call(o || t, d || window.event);
        }, u = r;
        !b.touchNative && b.pointer && e.indexOf("touch") === 0 ? r = Qt(t, e, r) : b.touch && e === "dblclick" ? r = bi(t, r) : "addEventListener" in t ? e === "touchstart" || e === "touchmove" || e === "wheel" || e === "mousewheel" ? t.addEventListener(v[e] || e, r, b.passiveEvents ? { passive: !1 } : !1) : e === "mouseenter" || e === "mouseleave" ? (r = function(d) {
          d = d || window.event, yn(t, d) && u(d);
        }, t.addEventListener(v[e], r, !1)) : t.addEventListener(e, u, !1) : t.attachEvent("on" + e, r), t[Nt] = t[Nt] || {}, t[Nt][a] = r;
      }
      function ot(t, e, i, o, a) {
        a = a || e + W(i) + (o ? "_" + W(o) : "");
        var r = t[Nt] && t[Nt][a];
        if (!r)
          return this;
        !b.touchNative && b.pointer && e.indexOf("touch") === 0 ? pn(t, e, r) : b.touch && e === "dblclick" ? gn(t, r) : "removeEventListener" in t ? t.removeEventListener(v[e] || e, r, !1) : t.detachEvent("on" + e, r), t[Nt][a] = null;
      }
      function lt(t) {
        return t.stopPropagation ? t.stopPropagation() : t.originalEvent ? t.originalEvent._stopped = !0 : t.cancelBubble = !0, this;
      }
      function _t(t) {
        return j(t, "wheel", lt), this;
      }
      function ht(t) {
        return C(t, "mousedown touchstart dblclick contextmenu", lt), t._leaflet_disable_click = !0, this;
      }
      function Lt(t) {
        return t.preventDefault ? t.preventDefault() : t.returnValue = !1, this;
      }
      function ze(t) {
        return Lt(t), lt(t), this;
      }
      function En(t) {
        if (t.composedPath)
          return t.composedPath();
        for (var e = [], i = t.target; i; )
          e.push(i), i = i.parentNode;
        return e;
      }
      function An(t, e) {
        if (!e)
          return new Z(t.clientX, t.clientY);
        var i = V(e), o = i.boundingClientRect;
        return new Z(
          // offset.left/top values are in page scale (like clientX/Y),
          // whereas clientLeft/Top (border width) values are the original values (before CSS scale applies).
          (t.clientX - o.left) / i.x - e.clientLeft,
          (t.clientY - o.top) / i.y - e.clientTop
        );
      }
      var bo = b.linux && b.chrome ? window.devicePixelRatio : b.mac ? window.devicePixelRatio * 3 : window.devicePixelRatio > 0 ? 2 * window.devicePixelRatio : 1;
      function In(t) {
        return b.edge ? t.wheelDeltaY / 2 : (
          // Don't trust window-geometry-based delta
          t.deltaY && t.deltaMode === 0 ? -t.deltaY / bo : (
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
      var wo = {
        __proto__: null,
        on: C,
        off: it,
        stopPropagation: lt,
        disableScrollPropagation: _t,
        disableClickPropagation: ht,
        preventDefault: Lt,
        stop: ze,
        getPropagationPath: En,
        getMousePosition: An,
        getWheelDelta: In,
        isExternalTarget: yn,
        addListener: C,
        removeListener: it
      }, Zn = Et.extend({
        // @method run(el: HTMLElement, newPos: Point, duration?: Number, easeLinearity?: Number)
        // Run an animation of a given element to a new position, optionally setting
        // duration in seconds (`0.25` by default) and easing linearity factor (3rd
        // argument of the [cubic bezier curve](https://cubic-bezier.com/#0,0,.5,1),
        // `0.5` by default).
        run: function(t, e, i, o) {
          this.stop(), this._el = t, this._inProgress = !0, this._duration = i || 0.25, this._easeOutPower = 1 / Math.max(o || 0.5, 0.2), this._startPos = ae(t), this._offset = e.subtract(this._startPos), this._startTime = +/* @__PURE__ */ new Date(), this.fire("start"), this._animate();
        },
        // @method stop()
        // Stops the animation (if currently running).
        stop: function() {
          this._inProgress && (this._step(!0), this._complete());
        },
        _animate: function() {
          this._animId = Pt(this._animate, this), this._step();
        },
        _step: function(t) {
          var e = +/* @__PURE__ */ new Date() - this._startTime, i = this._duration * 1e3;
          e < i ? this._runFrame(this._easeOut(e / i), t) : (this._runFrame(1), this._complete());
        },
        _runFrame: function(t, e) {
          var i = this._startPos.add(this._offset.multiplyBy(t));
          e && i._round(), dt(this._el, i), this.fire("step");
        },
        _complete: function() {
          Ot(this._animId), this._inProgress = !1, this.fire("end");
        },
        _easeOut: function(t) {
          return 1 - Math.pow(1 - t, this._easeOutPower);
        }
      }), q = Et.extend({
        options: {
          // @section Map State Options
          // @option crs: CRS = L.CRS.EPSG3857
          // The [Coordinate Reference System](#crs) to use. Don't change this if you're not
          // sure what it means.
          crs: ft,
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
          e = at(this, e), this._handlers = [], this._layers = {}, this._zoomBoundLayers = {}, this._sizeChanged = !0, this._initContainer(t), this._initLayout(), this._onResize = U(this._onResize, this), this._initEvents(), e.maxBounds && this.setMaxBounds(e.maxBounds), e.zoom !== void 0 && (this._zoom = this._limitZoom(e.zoom)), e.center && e.zoom !== void 0 && this.setView(F(e.center), e.zoom, { reset: !0 }), this.callInitHooks(), this._zoomAnimated = te && b.any3d && !b.mobileOpera && this.options.zoomAnimation, this._zoomAnimated && (this._createAnimProxy(), C(this._proxy, wi, this._catchTransitionEnd, this)), this._addLayers(this.options.layers);
        },
        // @section Methods for modifying map state
        // @method setView(center: LatLng, zoom: Number, options?: Zoom/pan options): this
        // Sets the view of the map (geographical center and zoom) with the given
        // animation options.
        setView: function(t, e, i) {
          if (e = e === void 0 ? this._zoom : this._limitZoom(e), t = this._limitCenter(F(t), e, this.options.maxBounds), i = i || {}, this._stop(), this._loaded && !i.reset && i !== !0) {
            i.animate !== void 0 && (i.zoom = K({ animate: i.animate }, i.zoom), i.pan = K({ animate: i.animate, duration: i.duration }, i.pan));
            var o = this._zoom !== e ? this._tryAnimatedZoom && this._tryAnimatedZoom(t, e, i.zoom) : this._tryAnimatedPan(t, i.pan);
            if (o)
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
          return t = t || (b.any3d ? this.options.zoomDelta : 1), this.setZoom(this._zoom + t, e);
        },
        // @method zoomOut(delta?: Number, options?: Zoom options): this
        // Decreases the zoom of the map by `delta` ([`zoomDelta`](#map-zoomdelta) by default).
        zoomOut: function(t, e) {
          return t = t || (b.any3d ? this.options.zoomDelta : 1), this.setZoom(this._zoom - t, e);
        },
        // @method setZoomAround(latlng: LatLng, zoom: Number, options: Zoom options): this
        // Zooms the map while keeping a specified geographical point on the map
        // stationary (e.g. used internally for scroll zoom and double-click zoom).
        // @alternative
        // @method setZoomAround(offset: Point, zoom: Number, options: Zoom options): this
        // Zooms the map while keeping a specified pixel on the map (relative to the top-left corner) stationary.
        setZoomAround: function(t, e, i) {
          var o = this.getZoomScale(e), a = this.getSize().divideBy(2), r = t instanceof Z ? t : this.latLngToContainerPoint(t), u = r.subtract(a).multiplyBy(1 - 1 / o), d = this.containerPointToLatLng(a.add(u));
          return this.setView(d, e, { zoom: i });
        },
        _getBoundsCenterZoom: function(t, e) {
          e = e || {}, t = t.getBounds ? t.getBounds() : T(t);
          var i = A(e.paddingTopLeft || e.padding || [0, 0]), o = A(e.paddingBottomRight || e.padding || [0, 0]), a = this.getBoundsZoom(t, !1, i.add(o));
          if (a = typeof e.maxZoom == "number" ? Math.min(e.maxZoom, a) : a, a === 1 / 0)
            return {
              center: t.getCenter(),
              zoom: a
            };
          var r = o.subtract(i).divideBy(2), u = this.project(t.getSouthWest(), a), d = this.project(t.getNorthEast(), a), c = this.unproject(u.add(d).divideBy(2).add(r), a);
          return {
            center: c,
            zoom: a
          };
        },
        // @method fitBounds(bounds: LatLngBounds, options?: fitBounds options): this
        // Sets a map view that contains the given geographical bounds with the
        // maximum zoom level possible.
        fitBounds: function(t, e) {
          if (t = T(t), !t.isValid())
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
          if (t = A(t).round(), e = e || {}, !t.x && !t.y)
            return this.fire("moveend");
          if (e.animate !== !0 && !this.getSize().contains(t))
            return this._resetView(this.unproject(this.project(this.getCenter()).add(t)), this.getZoom()), this;
          if (this._panAnim || (this._panAnim = new Zn(), this._panAnim.on({
            step: this._onPanTransitionStep,
            end: this._onPanTransitionEnd
          }, this)), e.noMoveStart || this.fire("movestart"), e.animate !== !1) {
            B(this._mapPane, "leaflet-pan-anim");
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
          if (i = i || {}, i.animate === !1 || !b.any3d)
            return this.setView(t, e, i);
          this._stop();
          var o = this.project(this.getCenter()), a = this.project(t), r = this.getSize(), u = this._zoom;
          t = F(t), e = e === void 0 ? u : e;
          var d = Math.max(r.x, r.y), c = d * this.getZoomScale(u, e), _ = a.distanceTo(o) || 1, P = 1.42, E = P * P;
          function D(vt) {
            var sn = vt ? -1 : 1, us = vt ? c : d, ds = c * c - d * d + sn * E * E * _ * _, hs = 2 * us * E * _, zn = ds / hs, mo = Math.sqrt(zn * zn + 1) - zn, cs = mo < 1e-9 ? -18 : Math.log(mo);
            return cs;
          }
          function Mt(vt) {
            return (Math.exp(vt) - Math.exp(-vt)) / 2;
          }
          function bt(vt) {
            return (Math.exp(vt) + Math.exp(-vt)) / 2;
          }
          function Ht(vt) {
            return Mt(vt) / bt(vt);
          }
          var At = D(0);
          function si(vt) {
            return d * (bt(At) / bt(At + P * vt));
          }
          function ss(vt) {
            return d * (bt(At) * Ht(At + P * vt) - Mt(At)) / E;
          }
          function as(vt) {
            return 1 - Math.pow(1 - vt, 1.5);
          }
          var rs = Date.now(), po = (D(1) - At) / P, ls = i.duration ? 1e3 * i.duration : 1e3 * po * 0.8;
          function _o() {
            var vt = (Date.now() - rs) / ls, sn = as(vt) * po;
            vt <= 1 ? (this._flyToFrame = Pt(_o, this), this._move(
              this.unproject(o.add(a.subtract(o).multiplyBy(ss(sn) / _)), u),
              this.getScaleZoom(d / si(sn), u),
              { flyTo: !0 }
            )) : this._move(t, e)._moveEnd(!0);
          }
          return this._moveStart(!0, i.noMoveStart), _o.call(this), this;
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
          return t = T(t), this.listens("moveend", this._panInsideMaxBounds) && this.off("moveend", this._panInsideMaxBounds), t.isValid() ? (this.options.maxBounds = t, this._loaded && this._panInsideMaxBounds(), this.on("moveend", this._panInsideMaxBounds)) : (this.options.maxBounds = null, this);
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
          var i = this.getCenter(), o = this._limitCenter(i, this._zoom, T(t));
          return i.equals(o) || this.panTo(o, e), this._enforcingBounds = !1, this;
        },
        // @method panInside(latlng: LatLng, options?: padding options): this
        // Pans the map the minimum amount to make the `latlng` visible. Use
        // padding options to fit the display to more restricted bounds.
        // If `latlng` is already within the (optionally padded) display bounds,
        // the map will not be panned.
        panInside: function(t, e) {
          e = e || {};
          var i = A(e.paddingTopLeft || e.padding || [0, 0]), o = A(e.paddingBottomRight || e.padding || [0, 0]), a = this.project(this.getCenter()), r = this.project(t), u = this.getPixelBounds(), d = nt([u.min.add(i), u.max.subtract(o)]), c = d.getSize();
          if (!d.contains(r)) {
            this._enforcingBounds = !0;
            var _ = r.subtract(d.getCenter()), P = d.extend(r).getSize().subtract(c);
            a.x += _.x < 0 ? -P.x : P.x, a.y += _.y < 0 ? -P.y : P.y, this.panTo(this.unproject(a), e), this._enforcingBounds = !1;
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
          t = K({
            animate: !1,
            pan: !0
          }, t === !0 ? { animate: !0 } : t);
          var e = this.getSize();
          this._sizeChanged = !0, this._lastCenter = null;
          var i = this.getSize(), o = e.divideBy(2).round(), a = i.divideBy(2).round(), r = o.subtract(a);
          return !r.x && !r.y ? this : (t.animate && t.pan ? this.panBy(r) : (t.pan && this._rawPanBy(r), this.fire("move"), t.debounceMoveend ? (clearTimeout(this._sizeTimer), this._sizeTimer = setTimeout(U(this.fire, this, "moveend"), 200)) : this.fire("moveend")), this.fire("resize", {
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
          if (t = this._locateOptions = K({
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
          var e = U(this._handleGeolocationResponse, this), i = U(this._handleGeolocationError, this);
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
            var e = t.coords.latitude, i = t.coords.longitude, o = new Y(e, i), a = o.toBounds(t.coords.accuracy * 2), r = this._locateOptions;
            if (r.setView) {
              var u = this.getBoundsZoom(a);
              this.setView(o, r.maxZoom ? Math.min(u, r.maxZoom) : u);
            }
            var d = {
              latlng: o,
              bounds: a,
              timestamp: t.timestamp
            };
            for (var c in t.coords)
              typeof t.coords[c] == "number" && (d[c] = t.coords[c]);
            this.fire("locationfound", d);
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
          this._locationWatchId !== void 0 && this.stopLocate(), this._stop(), ut(this._mapPane), this._clearControlPos && this._clearControlPos(), this._resizeRequest && (Ot(this._resizeRequest), this._resizeRequest = null), this._clearHandlers(), this._loaded && this.fire("unload");
          var t;
          for (t in this._layers)
            this._layers[t].remove();
          for (t in this._panes)
            ut(this._panes[t]);
          return this._layers = [], this._panes = [], delete this._mapPane, delete this._renderer, this;
        },
        // @section Other Methods
        // @method createPane(name: String, container?: HTMLElement): HTMLElement
        // Creates a new [map pane](#map-pane) with the given name if it doesn't exist already,
        // then returns it. The pane is created as a child of `container`, or
        // as a child of the main map pane if not set.
        createPane: function(t, e) {
          var i = "leaflet-pane" + (t ? " leaflet-" + t.replace("Pane", "") + "-pane" : ""), o = G("div", i, e || this._mapPane);
          return t && (this._panes[t] = o), o;
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
          return new $(e, i);
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
          t = T(t), i = A(i || [0, 0]);
          var o = this.getZoom() || 0, a = this.getMinZoom(), r = this.getMaxZoom(), u = t.getNorthWest(), d = t.getSouthEast(), c = this.getSize().subtract(i), _ = nt(this.project(d, o), this.project(u, o)).getSize(), P = b.any3d ? this.options.zoomSnap : 1, E = c.x / _.x, D = c.y / _.y, Mt = e ? Math.max(E, D) : Math.min(E, D);
          return o = this.getScaleZoom(Mt, o), P && (o = Math.round(o / (P / 100)) * (P / 100), o = e ? Math.ceil(o / P) * P : Math.floor(o / P) * P), Math.max(a, Math.min(r, o));
        },
        // @method getSize(): Point
        // Returns the current size of the map container (in pixels).
        getSize: function() {
          return (!this._size || this._sizeChanged) && (this._size = new Z(
            this._container.clientWidth || 0,
            this._container.clientHeight || 0
          ), this._sizeChanged = !1), this._size.clone();
        },
        // @method getPixelBounds(): Bounds
        // Returns the bounds of the current map view in projected pixel
        // coordinates (sometimes useful in layer and overlay implementations).
        getPixelBounds: function(t, e) {
          var i = this._getTopLeftPoint(t, e);
          return new et(i, i.add(this.getSize()));
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
          var o = i.zoom(t * i.scale(e));
          return isNaN(o) ? 1 / 0 : o;
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
          return e = e === void 0 ? this._zoom : e, this.options.crs.pointToLatLng(A(t), e);
        },
        // @method layerPointToLatLng(point: Point): LatLng
        // Given a pixel coordinate relative to the [origin pixel](#map-getpixelorigin),
        // returns the corresponding geographical coordinate (for the current zoom level).
        layerPointToLatLng: function(t) {
          var e = A(t).add(this.getPixelOrigin());
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
          return this.options.crs.wrapLatLngBounds(T(t));
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
          return A(t).subtract(this._getMapPanePos());
        },
        // @method layerPointToContainerPoint(point: Point): Point
        // Given a pixel coordinate relative to the [origin pixel](#map-getpixelorigin),
        // returns the corresponding pixel coordinate relative to the map container.
        layerPointToContainerPoint: function(t) {
          return A(t).add(this._getMapPanePos());
        },
        // @method containerPointToLatLng(point: Point): LatLng
        // Given a pixel coordinate relative to the map container, returns
        // the corresponding geographical coordinate (for the current zoom level).
        containerPointToLatLng: function(t) {
          var e = this.containerPointToLayerPoint(A(t));
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
          var e = this._container = Ye(t);
          if (e) {
            if (e._leaflet_id)
              throw new Error("Map container is already initialized.");
          } else throw new Error("Map container not found.");
          C(e, "scroll", this._onScroll, this), this._containerId = W(e);
        },
        _initLayout: function() {
          var t = this._container;
          this._fadeAnimated = this.options.fadeAnimation && b.any3d, B(t, "leaflet-container" + (b.touch ? " leaflet-touch" : "") + (b.retina ? " leaflet-retina" : "") + (b.ielt9 ? " leaflet-oldie" : "") + (b.safari ? " leaflet-safari" : "") + (this._fadeAnimated ? " leaflet-fade-anim" : ""));
          var e = se(t, "position");
          e !== "absolute" && e !== "relative" && e !== "fixed" && e !== "sticky" && (t.style.position = "relative"), this._initPanes(), this._initControlPos && this._initControlPos();
        },
        _initPanes: function() {
          var t = this._panes = {};
          this._paneRenderers = {}, this._mapPane = this.createPane("mapPane", this._container), dt(this._mapPane, new Z(0, 0)), this.createPane("tilePane"), this.createPane("overlayPane"), this.createPane("shadowPane"), this.createPane("markerPane"), this.createPane("tooltipPane"), this.createPane("popupPane"), this.options.markerZoomAnimation || (B(t.markerPane, "leaflet-zoom-hide"), B(t.shadowPane, "leaflet-zoom-hide"));
        },
        // private methods that modify map state
        // @section Map state change events
        _resetView: function(t, e, i) {
          dt(this._mapPane, new Z(0, 0));
          var o = !this._loaded;
          this._loaded = !0, e = this._limitZoom(e), this.fire("viewprereset");
          var a = this._zoom !== e;
          this._moveStart(a, i)._move(t, e)._moveEnd(a), this.fire("viewreset"), o && this.fire("load");
        },
        _moveStart: function(t, e) {
          return t && this.fire("zoomstart"), e || this.fire("movestart"), this;
        },
        _move: function(t, e, i, o) {
          e === void 0 && (e = this._zoom);
          var a = this._zoom !== e;
          return this._zoom = e, this._lastCenter = t, this._pixelOrigin = this._getNewPixelOrigin(t), o ? i && i.pinch && this.fire("zoom", i) : ((a || i && i.pinch) && this.fire("zoom", i), this.fire("move", i)), this;
        },
        _moveEnd: function(t) {
          return t && this.fire("zoomend"), this.fire("moveend");
        },
        _stop: function() {
          return Ot(this._flyToFrame), this._panAnim && this._panAnim.stop(), this;
        },
        _rawPanBy: function(t) {
          dt(this._mapPane, this._getMapPanePos().subtract(t));
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
          this._targets = {}, this._targets[W(this._container)] = this;
          var e = t ? it : C;
          e(this._container, "click dblclick mousedown mouseup mouseover mouseout mousemove contextmenu keypress keydown keyup", this._handleDOMEvent, this), this.options.trackResize && e(window, "resize", this._onResize, this), b.any3d && this.options.transform3DLimit && (t ? this.off : this.on).call(this, "moveend", this._onMoveEnd);
        },
        _onResize: function() {
          Ot(this._resizeRequest), this._resizeRequest = Pt(
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
          for (var i = [], o, a = e === "mouseout" || e === "mouseover", r = t.target || t.srcElement, u = !1; r; ) {
            if (o = this._targets[W(r)], o && (e === "click" || e === "preclick") && this._draggableMoved(o)) {
              u = !0;
              break;
            }
            if (o && o.listens(e, !0) && (a && !yn(r, t) || (i.push(o), a)) || r === this._container)
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
            i === "mousedown" && l(e), this._fireDOMEvent(t, i);
          }
        },
        _mouseEvents: ["click", "dblclick", "mouseover", "mouseout", "contextmenu"],
        _fireDOMEvent: function(t, e, i) {
          if (t.type === "click") {
            var o = K({}, t);
            o.type = "preclick", this._fireDOMEvent(o, o.type, i);
          }
          var a = this._findEventTargets(t, e);
          if (i) {
            for (var r = [], u = 0; u < i.length; u++)
              i[u].listens(e, !0) && r.push(i[u]);
            a = r.concat(a);
          }
          if (a.length) {
            e === "contextmenu" && Lt(t);
            var d = a[0], c = {
              originalEvent: t
            };
            if (t.type !== "keypress" && t.type !== "keydown" && t.type !== "keyup") {
              var _ = d.getLatLng && (!d._radius || d._radius <= 10);
              c.containerPoint = _ ? this.latLngToContainerPoint(d.getLatLng()) : this.mouseEventToContainerPoint(t), c.layerPoint = this.containerPointToLayerPoint(c.containerPoint), c.latlng = _ ? d.getLatLng() : this.layerPointToLatLng(c.layerPoint);
            }
            for (u = 0; u < a.length; u++)
              if (a[u].fire(e, c, !0), c.originalEvent._stopped || a[u].options.bubblingMouseEvents === !1 && ui(this._mouseEvents, e) !== -1)
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
          return ae(this._mapPane) || new Z(0, 0);
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
          var o = this._getNewPixelOrigin(i, e);
          return this.project(t, e)._subtract(o);
        },
        _latLngBoundsToNewLayerBounds: function(t, e, i) {
          var o = this._getNewPixelOrigin(i, e);
          return nt([
            this.project(t.getSouthWest(), e)._subtract(o),
            this.project(t.getNorthWest(), e)._subtract(o),
            this.project(t.getSouthEast(), e)._subtract(o),
            this.project(t.getNorthEast(), e)._subtract(o)
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
          var o = this.project(t, e), a = this.getSize().divideBy(2), r = new et(o.subtract(a), o.add(a)), u = this._getBoundsOffset(r, i, e);
          return Math.abs(u.x) <= 1 && Math.abs(u.y) <= 1 ? t : this.unproject(o.add(u), e);
        },
        // adjust offset for view to get inside bounds
        _limitOffset: function(t, e) {
          if (!e)
            return t;
          var i = this.getPixelBounds(), o = new et(i.min.add(t), i.max.add(t));
          return t.add(this._getBoundsOffset(o, e));
        },
        // returns offset needed for pxBounds to get inside maxBounds at a specified zoom
        _getBoundsOffset: function(t, e, i) {
          var o = nt(
            this.project(e.getNorthEast(), i),
            this.project(e.getSouthWest(), i)
          ), a = o.min.subtract(t.min), r = o.max.subtract(t.max), u = this._rebound(a.x, -r.x), d = this._rebound(a.y, -r.y);
          return new Z(u, d);
        },
        _rebound: function(t, e) {
          return t + e > 0 ? Math.round(t - e) / 2 : Math.max(0, Math.ceil(t)) - Math.max(0, Math.floor(e));
        },
        _limitZoom: function(t) {
          var e = this.getMinZoom(), i = this.getMaxZoom(), o = b.any3d ? this.options.zoomSnap : 1;
          return o && (t = Math.round(t / o) * o), Math.max(e, Math.min(i, t));
        },
        _onPanTransitionStep: function() {
          this.fire("move");
        },
        _onPanTransitionEnd: function() {
          rt(this._mapPane, "leaflet-pan-anim"), this.fire("moveend");
        },
        _tryAnimatedPan: function(t, e) {
          var i = this._getCenterOffset(t)._trunc();
          return (e && e.animate) !== !0 && !this.getSize().contains(i) ? !1 : (this.panBy(i, e), !0);
        },
        _createAnimProxy: function() {
          var t = this._proxy = G("div", "leaflet-proxy leaflet-zoom-animated");
          this._panes.mapPane.appendChild(t), this.on("zoomanim", function(e) {
            var i = _e, o = this._proxy.style[i];
            p(this._proxy, this.project(e.center, e.zoom), this.getZoomScale(e.zoom, 1)), o === this._proxy.style[i] && this._animatingZoom && this._onZoomTransitionEnd();
          }, this), this.on("load moveend", this._animMoveEnd, this), this._on("unload", this._destroyAnimProxy, this);
        },
        _destroyAnimProxy: function() {
          ut(this._proxy), this.off("load moveend", this._animMoveEnd, this), delete this._proxy;
        },
        _animMoveEnd: function() {
          var t = this.getCenter(), e = this.getZoom();
          p(this._proxy, this.project(t, e), this.getZoomScale(e, 1));
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
          var o = this.getZoomScale(e), a = this._getCenterOffset(t)._divideBy(1 - 1 / o);
          return i.animate !== !0 && !this.getSize().contains(a) ? !1 : (Pt(function() {
            this._moveStart(!0, i.noMoveStart || !1)._animateZoom(t, e, !0);
          }, this), !0);
        },
        _animateZoom: function(t, e, i, o) {
          this._mapPane && (i && (this._animatingZoom = !0, this._animateToCenter = t, this._animateToZoom = e, B(this._mapPane, "leaflet-zoom-anim")), this.fire("zoomanim", {
            center: t,
            zoom: e,
            noUpdate: o
          }), this._tempFireZoomEvent || (this._tempFireZoomEvent = this._zoom !== this._animateToZoom), this._move(this._animateToCenter, this._animateToZoom, void 0, !0), setTimeout(U(this._onZoomTransitionEnd, this), 250));
        },
        _onZoomTransitionEnd: function() {
          this._animatingZoom && (this._mapPane && rt(this._mapPane, "leaflet-zoom-anim"), this._animatingZoom = !1, this._move(this._animateToCenter, this._animateToZoom, void 0, !0), this._tempFireZoomEvent && this.fire("zoom"), delete this._tempFireZoomEvent, this.fire("move"), this._moveEnd(!0));
        }
      });
      function xo(t, e) {
        return new q(t, e);
      }
      var qt = tt.extend({
        // @section
        // @aka Control Options
        options: {
          // @option position: String = 'topright'
          // The position of the control (one of the map corners). Possible values are `'topleft'`,
          // `'topright'`, `'bottomleft'` or `'bottomright'`
          position: "topright"
        },
        initialize: function(t) {
          at(this, t);
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
          var e = this._container = this.onAdd(t), i = this.getPosition(), o = t._controlCorners[i];
          return B(e, "leaflet-control"), i.indexOf("bottom") !== -1 ? o.insertBefore(e, o.firstChild) : o.appendChild(e), this._map.on("unload", this.remove, this), this;
        },
        // @method remove: this
        // Removes the control from the map it is currently active on.
        remove: function() {
          return this._map ? (ut(this._container), this.onRemove && this.onRemove(this._map), this._map.off("unload", this.remove, this), this._map = null, this) : this;
        },
        _refocusOnMap: function(t) {
          this._map && t && t.screenX > 0 && t.screenY > 0 && this._map.getContainer().focus();
        }
      }), Ci = function(t) {
        return new qt(t);
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
          var t = this._controlCorners = {}, e = "leaflet-", i = this._controlContainer = G("div", e + "control-container", this._container);
          function o(a, r) {
            var u = e + a + " " + e + r;
            t[a + r] = G("div", u, i);
          }
          o("top", "left"), o("top", "right"), o("bottom", "left"), o("bottom", "right");
        },
        _clearControlPos: function() {
          for (var t in this._controlCorners)
            ut(this._controlCorners[t]);
          ut(this._controlContainer), delete this._controlCorners, delete this._controlContainer;
        }
      });
      var Bn = qt.extend({
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
          sortFunction: function(t, e, i, o) {
            return i < o ? -1 : o < i ? 1 : 0;
          }
        },
        initialize: function(t, e, i) {
          at(this, i), this._layerControlInputs = [], this._layers = [], this._lastZIndex = 0, this._handlingClick = !1, this._preventClick = !1;
          for (var o in t)
            this._addLayer(t[o], o);
          for (o in e)
            this._addLayer(e[o], o, !0);
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
          var e = this._getLayer(W(t));
          return e && this._layers.splice(this._layers.indexOf(e), 1), this._map ? this._update() : this;
        },
        // @method expand(): this
        // Expand the control container if collapsed.
        expand: function() {
          B(this._container, "leaflet-control-layers-expanded"), this._section.style.height = null;
          var t = this._map.getSize().y - (this._container.offsetTop + 50);
          return t < this._section.clientHeight ? (B(this._section, "leaflet-control-layers-scrollbar"), this._section.style.height = t + "px") : rt(this._section, "leaflet-control-layers-scrollbar"), this._checkDisabledLayers(), this;
        },
        // @method collapse(): this
        // Collapse the control container if expanded.
        collapse: function() {
          return rt(this._container, "leaflet-control-layers-expanded"), this;
        },
        _initLayout: function() {
          var t = "leaflet-control-layers", e = this._container = G("div", t), i = this.options.collapsed;
          e.setAttribute("aria-haspopup", !0), ht(e), _t(e);
          var o = this._section = G("section", t + "-list");
          i && (this._map.on("click", this.collapse, this), C(e, {
            mouseenter: this._expandSafely,
            mouseleave: this.collapse
          }, this));
          var a = this._layersLink = G("a", t + "-toggle", e);
          a.href = "#", a.title = "Layers", a.setAttribute("role", "button"), C(a, {
            keydown: function(r) {
              r.keyCode === 13 && this._expandSafely();
            },
            // Certain screen readers intercept the key event and instead send a click event
            click: function(r) {
              Lt(r), this._expandSafely();
            }
          }, this), i || this.expand(), this._baseLayersList = G("div", t + "-base", o), this._separator = G("div", t + "-separator", o), this._overlaysList = G("div", t + "-overlays", o), e.appendChild(o);
        },
        _getLayer: function(t) {
          for (var e = 0; e < this._layers.length; e++)
            if (this._layers[e] && W(this._layers[e].layer) === t)
              return this._layers[e];
        },
        _addLayer: function(t, e, i) {
          this._map && t.on("add remove", this._onLayerChange, this), this._layers.push({
            layer: t,
            name: e,
            overlay: i
          }), this.options.sortLayers && this._layers.sort(U(function(o, a) {
            return this.options.sortFunction(o.layer, a.layer, o.name, a.name);
          }, this)), this.options.autoZIndex && t.setZIndex && (this._lastZIndex++, t.setZIndex(this._lastZIndex)), this._expandIfNotCollapsed();
        },
        _update: function() {
          if (!this._container)
            return this;
          Je(this._baseLayersList), Je(this._overlaysList), this._layerControlInputs = [];
          var t, e, i, o, a = 0;
          for (i = 0; i < this._layers.length; i++)
            o = this._layers[i], this._addItem(o), e = e || o.overlay, t = t || !o.overlay, a += o.overlay ? 0 : 1;
          return this.options.hideSingleBase && (t = t && a > 1, this._baseLayersList.style.display = t ? "" : "none"), this._separator.style.display = e && t ? "" : "none", this;
        },
        _onLayerChange: function(t) {
          this._handlingClick || this._update();
          var e = this._getLayer(W(t.target)), i = e.overlay ? t.type === "add" ? "overlayadd" : "overlayremove" : t.type === "add" ? "baselayerchange" : null;
          i && this._map.fire(i, e);
        },
        // IE7 bugs out if you create a radio dynamically, so you have to do it this hacky way (see https://stackoverflow.com/a/119079)
        _createRadioElement: function(t, e) {
          var i = '<input type="radio" class="leaflet-control-layers-selector" name="' + t + '"' + (e ? ' checked="checked"' : "") + "/>", o = document.createElement("div");
          return o.innerHTML = i, o.firstChild;
        },
        _addItem: function(t) {
          var e = document.createElement("label"), i = this._map.hasLayer(t.layer), o;
          t.overlay ? (o = document.createElement("input"), o.type = "checkbox", o.className = "leaflet-control-layers-selector", o.defaultChecked = i) : o = this._createRadioElement("leaflet-base-layers_" + W(this), i), this._layerControlInputs.push(o), o.layerId = W(t.layer), C(o, "click", this._onInputClick, this);
          var a = document.createElement("span");
          a.innerHTML = " " + t.name;
          var r = document.createElement("span");
          e.appendChild(r), r.appendChild(o), r.appendChild(a);
          var u = t.overlay ? this._overlaysList : this._baseLayersList;
          return u.appendChild(e), this._checkDisabledLayers(), e;
        },
        _onInputClick: function() {
          if (!this._preventClick) {
            var t = this._layerControlInputs, e, i, o = [], a = [];
            this._handlingClick = !0;
            for (var r = t.length - 1; r >= 0; r--)
              e = t[r], i = this._getLayer(e.layerId).layer, e.checked ? o.push(i) : e.checked || a.push(i);
            for (r = 0; r < a.length; r++)
              this._map.hasLayer(a[r]) && this._map.removeLayer(a[r]);
            for (r = 0; r < o.length; r++)
              this._map.hasLayer(o[r]) || this._map.addLayer(o[r]);
            this._handlingClick = !1, this._refocusOnMap();
          }
        },
        _checkDisabledLayers: function() {
          for (var t = this._layerControlInputs, e, i, o = this._map.getZoom(), a = t.length - 1; a >= 0; a--)
            e = t[a], i = this._getLayer(e.layerId).layer, e.disabled = i.options.minZoom !== void 0 && o < i.options.minZoom || i.options.maxZoom !== void 0 && o > i.options.maxZoom;
        },
        _expandIfNotCollapsed: function() {
          return this._map && !this.options.collapsed && this.expand(), this;
        },
        _expandSafely: function() {
          var t = this._section;
          this._preventClick = !0, C(t, "click", Lt), this.expand();
          var e = this;
          setTimeout(function() {
            it(t, "click", Lt), e._preventClick = !1;
          });
        }
      }), Lo = function(t, e, i) {
        return new Bn(t, e, i);
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
          var e = "leaflet-control-zoom", i = G("div", e + " leaflet-bar"), o = this.options;
          return this._zoomInButton = this._createButton(
            o.zoomInText,
            o.zoomInTitle,
            e + "-in",
            i,
            this._zoomIn
          ), this._zoomOutButton = this._createButton(
            o.zoomOutText,
            o.zoomOutTitle,
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
        _createButton: function(t, e, i, o, a) {
          var r = G("a", i, o);
          return r.innerHTML = t, r.href = "#", r.title = e, r.setAttribute("role", "button"), r.setAttribute("aria-label", e), ht(r), C(r, "click", ze), C(r, "click", a, this), C(r, "click", this._refocusOnMap, this), r;
        },
        _updateDisabled: function() {
          var t = this._map, e = "leaflet-disabled";
          rt(this._zoomInButton, e), rt(this._zoomOutButton, e), this._zoomInButton.setAttribute("aria-disabled", "false"), this._zoomOutButton.setAttribute("aria-disabled", "false"), (this._disabled || t._zoom === t.getMinZoom()) && (B(this._zoomOutButton, e), this._zoomOutButton.setAttribute("aria-disabled", "true")), (this._disabled || t._zoom === t.getMaxZoom()) && (B(this._zoomInButton, e), this._zoomInButton.setAttribute("aria-disabled", "true"));
        }
      });
      q.mergeOptions({
        zoomControl: !0
      }), q.addInitHook(function() {
        this.options.zoomControl && (this.zoomControl = new bn(), this.addControl(this.zoomControl));
      });
      var Po = function(t) {
        return new bn(t);
      }, Nn = qt.extend({
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
          var e = "leaflet-control-scale", i = G("div", e), o = this.options;
          return this._addScales(o, e + "-line", i), t.on(o.updateWhenIdle ? "moveend" : "move", this._update, this), t.whenReady(this._update, this), i;
        },
        onRemove: function(t) {
          t.off(this.options.updateWhenIdle ? "moveend" : "move", this._update, this);
        },
        _addScales: function(t, e, i) {
          t.metric && (this._mScale = G("div", e, i)), t.imperial && (this._iScale = G("div", e, i));
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
          var e = t * 3.2808399, i, o, a;
          e > 5280 ? (i = e / 5280, o = this._getRoundNum(i), this._updateScale(this._iScale, o + " mi", o / i)) : (a = this._getRoundNum(e), this._updateScale(this._iScale, a + " ft", a / e));
        },
        _updateScale: function(t, e, i) {
          t.style.width = Math.round(this.options.maxWidth * i) + "px", t.innerHTML = e;
        },
        _getRoundNum: function(t) {
          var e = Math.pow(10, (Math.floor(t) + "").length - 1), i = t / e;
          return i = i >= 10 ? 10 : i >= 5 ? 5 : i >= 3 ? 3 : i >= 2 ? 2 : 1, e * i;
        }
      }), To = function(t) {
        return new Nn(t);
      }, ko = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" class="leaflet-attribution-flag"><path fill="#4C7BE1" d="M0 0h12v4H0z"/><path fill="#FFD500" d="M0 4h12v3H0z"/><path fill="#E0BC00" d="M0 7h12v1H0z"/></svg>', wn = qt.extend({
        // @section
        // @aka Control.Attribution options
        options: {
          position: "bottomright",
          // @option prefix: String|false = 'Leaflet'
          // The HTML text shown before the attributions. Pass `false` to disable.
          prefix: '<a href="https://leafletjs.com" title="A JavaScript library for interactive maps">' + (b.inlineSvg ? ko + " " : "") + "Leaflet</a>"
        },
        initialize: function(t) {
          at(this, t), this._attributions = {};
        },
        onAdd: function(t) {
          t.attributionControl = this, this._container = G("div", "leaflet-control-attribution"), ht(this._container);
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
        this.options.attributionControl && new wn().addTo(this);
      });
      var Co = function(t) {
        return new wn(t);
      };
      qt.Layers = Bn, qt.Zoom = bn, qt.Scale = Nn, qt.Attribution = wn, Ci.layers = Lo, Ci.zoom = Po, Ci.scale = To, Ci.attribution = Co;
      var ee = tt.extend({
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
      ee.addTo = function(t, e) {
        return t.addHandler(e, this), this;
      };
      var So = { Events: yt }, Dn = b.touch ? "touchstart mousedown" : "mousedown", ge = Et.extend({
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
        initialize: function(t, e, i, o) {
          at(this, o), this._element = t, this._dragStartTarget = e || t, this._preventOutline = i;
        },
        // @method enable()
        // Enables the dragging ability
        enable: function() {
          this._enabled || (C(this._dragStartTarget, Dn, this._onDown, this), this._enabled = !0);
        },
        // @method disable()
        // Disables the dragging ability
        disable: function() {
          this._enabled && (ge._dragging === this && this.finishDrag(!0), it(this._dragStartTarget, Dn, this._onDown, this), this._enabled = !1, this._moved = !1);
        },
        _onDown: function(t) {
          if (this._enabled && (this._moved = !1, !xi(this._element, "leaflet-zoom-anim"))) {
            if (t.touches && t.touches.length !== 1) {
              ge._dragging === this && this.finishDrag();
              return;
            }
            if (!(ge._dragging || t.shiftKey || t.which !== 1 && t.button !== 1 && !t.touches) && (ge._dragging = this, this._preventOutline && l(this._element), Pi(), Ce(), !this._moving)) {
              this.fire("down");
              var e = t.touches ? t.touches[0] : t, i = k(this._element);
              this._startPoint = new Z(e.clientX, e.clientY), this._startPos = ae(this._element), this._parentScale = V(i);
              var o = t.type === "mousedown";
              C(document, o ? "mousemove" : "touchmove", this._onMove, this), C(document, o ? "mouseup" : "touchend touchcancel", this._onUp, this);
            }
          }
        },
        _onMove: function(t) {
          if (this._enabled) {
            if (t.touches && t.touches.length > 1) {
              this._moved = !0;
              return;
            }
            var e = t.touches && t.touches.length === 1 ? t.touches[0] : t, i = new Z(e.clientX, e.clientY)._subtract(this._startPoint);
            !i.x && !i.y || Math.abs(i.x) + Math.abs(i.y) < this.options.clickTolerance || (i.x /= this._parentScale.x, i.y /= this._parentScale.y, Lt(t), this._moved || (this.fire("dragstart"), this._moved = !0, B(document.body, "leaflet-dragging"), this._lastTarget = t.target || t.srcElement, window.SVGElementInstance && this._lastTarget instanceof window.SVGElementInstance && (this._lastTarget = this._lastTarget.correspondingUseElement), B(this._lastTarget, "leaflet-drag-target")), this._newPos = this._startPos.add(i), this._moving = !0, this._lastEvent = t, this._updatePosition());
          }
        },
        _updatePosition: function() {
          var t = { originalEvent: this._lastEvent };
          this.fire("predrag", t), dt(this._element, this._newPos), this.fire("drag", t);
        },
        _onUp: function() {
          this._enabled && this.finishDrag();
        },
        finishDrag: function(t) {
          rt(document.body, "leaflet-dragging"), this._lastTarget && (rt(this._lastTarget, "leaflet-drag-target"), this._lastTarget = null), it(document, "mousemove touchmove", this._onMove, this), it(document, "mouseup touchend touchcancel", this._onUp, this), Ti(), Se();
          var e = this._moved && this._moving;
          this._moving = !1, ge._dragging = !1, e && this.fire("dragend", {
            noInertia: t,
            distance: this._newPos.distanceTo(this._startPos)
          });
        }
      });
      function Rn(t, e, i) {
        var o, a = [1, 4, 2, 8], r, u, d, c, _, P, E, D;
        for (r = 0, P = t.length; r < P; r++)
          t[r]._code = Oe(t[r], e);
        for (d = 0; d < 4; d++) {
          for (E = a[d], o = [], r = 0, P = t.length, u = P - 1; r < P; u = r++)
            c = t[r], _ = t[u], c._code & E ? _._code & E || (D = qi(_, c, E, e, i), D._code = Oe(D, e), o.push(D)) : (_._code & E && (D = qi(_, c, E, e, i), D._code = Oe(D, e), o.push(D)), o.push(c));
          t = o;
        }
        return t;
      }
      function Vn(t, e) {
        var i, o, a, r, u, d, c, _, P;
        if (!t || t.length === 0)
          throw new Error("latlngs not passed");
        Ft(t) || (console.warn("latlngs are not flat! Only the first ring will be used"), t = t[0]);
        var E = F([0, 0]), D = T(t), Mt = D.getNorthWest().distanceTo(D.getSouthWest()) * D.getNorthEast().distanceTo(D.getNorthWest());
        Mt < 1700 && (E = xn(t));
        var bt = t.length, Ht = [];
        for (i = 0; i < bt; i++) {
          var At = F(t[i]);
          Ht.push(e.project(F([At.lat - E.lat, At.lng - E.lng])));
        }
        for (d = c = _ = 0, i = 0, o = bt - 1; i < bt; o = i++)
          a = Ht[i], r = Ht[o], u = a.y * r.x - r.y * a.x, c += (a.x + r.x) * u, _ += (a.y + r.y) * u, d += u * 3;
        d === 0 ? P = Ht[0] : P = [c / d, _ / d];
        var si = e.unproject(A(P));
        return F([si.lat + E.lat, si.lng + E.lng]);
      }
      function xn(t) {
        for (var e = 0, i = 0, o = 0, a = 0; a < t.length; a++) {
          var r = F(t[a]);
          e += r.lat, i += r.lng, o++;
        }
        return F([e / o, i / o]);
      }
      var Mo = {
        __proto__: null,
        clipPolygon: Rn,
        polygonCenter: Vn,
        centroid: xn
      };
      function Un(t, e) {
        if (!e || !t.length)
          return t.slice();
        var i = e * e;
        return t = Eo(t, i), t = Oo(t, i), t;
      }
      function Fn(t, e, i) {
        return Math.sqrt(Si(t, e, i, !0));
      }
      function zo(t, e, i) {
        return Si(t, e, i);
      }
      function Oo(t, e) {
        var i = t.length, o = typeof Uint8Array < "u" ? Uint8Array : Array, a = new o(i);
        a[0] = a[i - 1] = 1, Ln(t, a, e, 0, i - 1);
        var r, u = [];
        for (r = 0; r < i; r++)
          a[r] && u.push(t[r]);
        return u;
      }
      function Ln(t, e, i, o, a) {
        var r = 0, u, d, c;
        for (d = o + 1; d <= a - 1; d++)
          c = Si(t[d], t[o], t[a], !0), c > r && (u = d, r = c);
        r > i && (e[u] = 1, Ln(t, e, i, o, u), Ln(t, e, i, u, a));
      }
      function Eo(t, e) {
        for (var i = [t[0]], o = 1, a = 0, r = t.length; o < r; o++)
          Ao(t[o], t[a]) > e && (i.push(t[o]), a = o);
        return a < r - 1 && i.push(t[r - 1]), i;
      }
      var Hn;
      function Wn(t, e, i, o, a) {
        var r = o ? Hn : Oe(t, i), u = Oe(e, i), d, c, _;
        for (Hn = u; ; ) {
          if (!(r | u))
            return [t, e];
          if (r & u)
            return !1;
          d = r || u, c = qi(t, e, d, i, a), _ = Oe(c, i), d === r ? (t = c, r = _) : (e = c, u = _);
        }
      }
      function qi(t, e, i, o, a) {
        var r = e.x - t.x, u = e.y - t.y, d = o.min, c = o.max, _, P;
        return i & 8 ? (_ = t.x + r * (c.y - t.y) / u, P = c.y) : i & 4 ? (_ = t.x + r * (d.y - t.y) / u, P = d.y) : i & 2 ? (_ = c.x, P = t.y + u * (c.x - t.x) / r) : i & 1 && (_ = d.x, P = t.y + u * (d.x - t.x) / r), new Z(_, P, a);
      }
      function Oe(t, e) {
        var i = 0;
        return t.x < e.min.x ? i |= 1 : t.x > e.max.x && (i |= 2), t.y < e.min.y ? i |= 4 : t.y > e.max.y && (i |= 8), i;
      }
      function Ao(t, e) {
        var i = e.x - t.x, o = e.y - t.y;
        return i * i + o * o;
      }
      function Si(t, e, i, o) {
        var a = e.x, r = e.y, u = i.x - a, d = i.y - r, c = u * u + d * d, _;
        return c > 0 && (_ = ((t.x - a) * u + (t.y - r) * d) / c, _ > 1 ? (a = i.x, r = i.y) : _ > 0 && (a += u * _, r += d * _)), u = t.x - a, d = t.y - r, o ? u * u + d * d : new Z(a, r);
      }
      function Ft(t) {
        return !Dt(t[0]) || typeof t[0][0] != "object" && typeof t[0][0] < "u";
      }
      function Gn(t) {
        return console.warn("Deprecated use of _flat, please use L.LineUtil.isFlat instead."), Ft(t);
      }
      function jn(t, e) {
        var i, o, a, r, u, d, c, _;
        if (!t || t.length === 0)
          throw new Error("latlngs not passed");
        Ft(t) || (console.warn("latlngs are not flat! Only the first ring will be used"), t = t[0]);
        var P = F([0, 0]), E = T(t), D = E.getNorthWest().distanceTo(E.getSouthWest()) * E.getNorthEast().distanceTo(E.getNorthWest());
        D < 1700 && (P = xn(t));
        var Mt = t.length, bt = [];
        for (i = 0; i < Mt; i++) {
          var Ht = F(t[i]);
          bt.push(e.project(F([Ht.lat - P.lat, Ht.lng - P.lng])));
        }
        for (i = 0, o = 0; i < Mt - 1; i++)
          o += bt[i].distanceTo(bt[i + 1]) / 2;
        if (o === 0)
          _ = bt[0];
        else
          for (i = 0, r = 0; i < Mt - 1; i++)
            if (u = bt[i], d = bt[i + 1], a = u.distanceTo(d), r += a, r > o) {
              c = (r - o) / a, _ = [
                d.x - c * (d.x - u.x),
                d.y - c * (d.y - u.y)
              ];
              break;
            }
        var At = e.unproject(A(_));
        return F([At.lat + P.lat, At.lng + P.lng]);
      }
      var Io = {
        __proto__: null,
        simplify: Un,
        pointToSegmentDistance: Fn,
        closestPointOnSegment: zo,
        clipSegment: Wn,
        _getEdgeIntersection: qi,
        _getBitCode: Oe,
        _sqClosestPointOnSegment: Si,
        isFlat: Ft,
        _flat: Gn,
        polylineCenter: jn
      }, Pn = {
        project: function(t) {
          return new Z(t.lng, t.lat);
        },
        unproject: function(t) {
          return new Y(t.y, t.x);
        },
        bounds: new et([-180, -90], [180, 90])
      }, Tn = {
        R: 6378137,
        R_MINOR: 6356752314245179e-9,
        bounds: new et([-2003750834279e-5, -1549657073972e-5], [2003750834279e-5, 1876465623138e-5]),
        project: function(t) {
          var e = Math.PI / 180, i = this.R, o = t.lat * e, a = this.R_MINOR / i, r = Math.sqrt(1 - a * a), u = r * Math.sin(o), d = Math.tan(Math.PI / 4 - o / 2) / Math.pow((1 - u) / (1 + u), r / 2);
          return o = -i * Math.log(Math.max(d, 1e-10)), new Z(t.lng * e * i, o);
        },
        unproject: function(t) {
          for (var e = 180 / Math.PI, i = this.R, o = this.R_MINOR / i, a = Math.sqrt(1 - o * o), r = Math.exp(-t.y / i), u = Math.PI / 2 - 2 * Math.atan(r), d = 0, c = 0.1, _; d < 15 && Math.abs(c) > 1e-7; d++)
            _ = a * Math.sin(u), _ = Math.pow((1 - _) / (1 + _), a / 2), c = Math.PI / 2 - 2 * Math.atan(r * _) - u, u += c;
          return new Y(u * e, t.x * e / i);
        }
      }, Zo = {
        __proto__: null,
        LonLat: Pn,
        Mercator: Tn,
        SphericalMercator: pi
      }, Bo = K({}, Gt, {
        code: "EPSG:3395",
        projection: Tn,
        transformation: (function() {
          var t = 0.5 / (Math.PI * Tn.R);
          return we(t, 0.5, -t, 0.5);
        })()
      }), qn = K({}, Gt, {
        code: "EPSG:4326",
        projection: Pn,
        transformation: we(1 / 180, 1, -1 / 180, 0.5)
      }), No = K({}, Rt, {
        projection: Pn,
        transformation: we(1, 0, -1, 0),
        scale: function(t) {
          return Math.pow(2, t);
        },
        zoom: function(t) {
          return Math.log(t) / Math.LN2;
        },
        distance: function(t, e) {
          var i = e.lng - t.lng, o = e.lat - t.lat;
          return Math.sqrt(i * i + o * o);
        },
        infinite: !0
      });
      Rt.Earth = Gt, Rt.EPSG3395 = Bo, Rt.EPSG3857 = ft, Rt.EPSG900913 = Yt, Rt.EPSG4326 = qn, Rt.Simple = No;
      var Kt = Et.extend({
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
          return this._map._targets[W(t)] = this, this;
        },
        removeInteractiveTarget: function(t) {
          return delete this._map._targets[W(t)], this;
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
          var e = W(t);
          return this._layers[e] ? this : (this._layers[e] = t, t._mapToAdd = this, t.beforeAdd && t.beforeAdd(this), this.whenReady(t._layerAdd, t), this);
        },
        // @method removeLayer(layer: Layer): this
        // Removes the given layer from the map.
        removeLayer: function(t) {
          var e = W(t);
          return this._layers[e] ? (this._loaded && t.onRemove(this), delete this._layers[e], this._loaded && (this.fire("layerremove", { layer: t }), t.fire("remove")), t._map = t._mapToAdd = null, this) : this;
        },
        // @method hasLayer(layer: Layer): Boolean
        // Returns `true` if the given layer is currently added to the map
        hasLayer: function(t) {
          return W(t) in this._layers;
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
          t = t ? Dt(t) ? t : [t] : [];
          for (var e = 0, i = t.length; e < i; e++)
            this.addLayer(t[e]);
        },
        _addZoomLimit: function(t) {
          (!isNaN(t.options.maxZoom) || !isNaN(t.options.minZoom)) && (this._zoomBoundLayers[W(t)] = t, this._updateZoomLevels());
        },
        _removeZoomLimit: function(t) {
          var e = W(t);
          this._zoomBoundLayers[e] && (delete this._zoomBoundLayers[e], this._updateZoomLevels());
        },
        _updateZoomLevels: function() {
          var t = 1 / 0, e = -1 / 0, i = this._getZoomSpan();
          for (var o in this._zoomBoundLayers) {
            var a = this._zoomBoundLayers[o].options;
            t = a.minZoom === void 0 ? t : Math.min(t, a.minZoom), e = a.maxZoom === void 0 ? e : Math.max(e, a.maxZoom);
          }
          this._layersMaxZoom = e === -1 / 0 ? void 0 : e, this._layersMinZoom = t === 1 / 0 ? void 0 : t, i !== this._getZoomSpan() && this.fire("zoomlevelschange"), this.options.maxZoom === void 0 && this._layersMaxZoom && this.getZoom() > this._layersMaxZoom && this.setZoom(this._layersMaxZoom), this.options.minZoom === void 0 && this._layersMinZoom && this.getZoom() < this._layersMinZoom && this.setZoom(this._layersMinZoom);
        }
      });
      var ti = Kt.extend({
        initialize: function(t, e) {
          at(this, e), this._layers = {};
          var i, o;
          if (t)
            for (i = 0, o = t.length; i < o; i++)
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
          var e = Array.prototype.slice.call(arguments, 1), i, o;
          for (i in this._layers)
            o = this._layers[i], o[t] && o[t].apply(o, e);
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
          return W(t);
        }
      }), Do = function(t, e) {
        return new ti(t, e);
      }, re = ti.extend({
        addLayer: function(t) {
          return this.hasLayer(t) ? this : (t.addEventParent(this), ti.prototype.addLayer.call(this, t), this.fire("layeradd", { layer: t }));
        },
        removeLayer: function(t) {
          return this.hasLayer(t) ? (t in this._layers && (t = this._layers[t]), t.removeEventParent(this), ti.prototype.removeLayer.call(this, t), this.fire("layerremove", { layer: t })) : this;
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
          var t = new $();
          for (var e in this._layers) {
            var i = this._layers[e];
            t.extend(i.getBounds ? i.getBounds() : i.getLatLng());
          }
          return t;
        }
      }), Ro = function(t, e) {
        return new re(t, e);
      }, ei = tt.extend({
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
          at(this, t);
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
          var o = this._createImg(i, e && e.tagName === "IMG" ? e : null);
          return this._setIconStyles(o, t), (this.options.crossOrigin || this.options.crossOrigin === "") && (o.crossOrigin = this.options.crossOrigin === !0 ? "" : this.options.crossOrigin), o;
        },
        _setIconStyles: function(t, e) {
          var i = this.options, o = i[e + "Size"];
          typeof o == "number" && (o = [o, o]);
          var a = A(o), r = A(e === "shadow" && i.shadowAnchor || i.iconAnchor || a && a.divideBy(2, !0));
          t.className = "leaflet-marker-" + e + " " + (i.className || ""), r && (t.style.marginLeft = -r.x + "px", t.style.marginTop = -r.y + "px"), a && (t.style.width = a.x + "px", t.style.height = a.y + "px");
        },
        _createImg: function(t, e) {
          return e = e || document.createElement("img"), e.src = t, e;
        },
        _getIconUrl: function(t) {
          return b.retina && this.options[t + "RetinaUrl"] || this.options[t + "Url"];
        }
      });
      function Vo(t) {
        return new ei(t);
      }
      var Mi = ei.extend({
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
          return typeof Mi.imagePath != "string" && (Mi.imagePath = this._detectIconPath()), (this.options.imagePath || Mi.imagePath) + ei.prototype._getIconUrl.call(this, t);
        },
        _stripUrl: function(t) {
          var e = function(i, o, a) {
            var r = o.exec(i);
            return r && r[a];
          };
          return t = e(t, /^url\((['"])?(.+)\1\)$/, 2), t && e(t, /^(.*)marker-icon\.png$/, 1);
        },
        _detectIconPath: function() {
          var t = G("div", "leaflet-default-icon-path", document.body), e = se(t, "background-image") || se(t, "backgroundImage");
          if (document.body.removeChild(t), e = this._stripUrl(e), e)
            return e;
          var i = document.querySelector('link[href$="leaflet.css"]');
          return i ? i.href.substring(0, i.href.length - 11 - 1) : "";
        }
      }), Kn = ee.extend({
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
          }, this).enable(), B(t, "leaflet-marker-draggable");
        },
        removeHooks: function() {
          this._draggable.off({
            dragstart: this._onDragStart,
            predrag: this._onPreDrag,
            drag: this._onDrag,
            dragend: this._onDragEnd
          }, this).disable(), this._marker._icon && rt(this._marker._icon, "leaflet-marker-draggable");
        },
        moved: function() {
          return this._draggable && this._draggable._moved;
        },
        _adjustPan: function(t) {
          var e = this._marker, i = e._map, o = this._marker.options.autoPanSpeed, a = this._marker.options.autoPanPadding, r = ae(e._icon), u = i.getPixelBounds(), d = i.getPixelOrigin(), c = nt(
            u.min._subtract(d).add(a),
            u.max._subtract(d).subtract(a)
          );
          if (!c.contains(r)) {
            var _ = A(
              (Math.max(c.max.x, r.x) - c.max.x) / (u.max.x - c.max.x) - (Math.min(c.min.x, r.x) - c.min.x) / (u.min.x - c.min.x),
              (Math.max(c.max.y, r.y) - c.max.y) / (u.max.y - c.max.y) - (Math.min(c.min.y, r.y) - c.min.y) / (u.min.y - c.min.y)
            ).multiplyBy(o);
            i.panBy(_, { animate: !1 }), this._draggable._newPos._add(_), this._draggable._startPos._add(_), dt(e._icon, this._draggable._newPos), this._onDrag(t), this._panRequest = Pt(this._adjustPan.bind(this, t));
          }
        },
        _onDragStart: function() {
          this._oldLatLng = this._marker.getLatLng(), this._marker.closePopup && this._marker.closePopup(), this._marker.fire("movestart").fire("dragstart");
        },
        _onPreDrag: function(t) {
          this._marker.options.autoPan && (Ot(this._panRequest), this._panRequest = Pt(this._adjustPan.bind(this, t)));
        },
        _onDrag: function(t) {
          var e = this._marker, i = e._shadow, o = ae(e._icon), a = e._map.layerPointToLatLng(o);
          i && dt(i, o), e._latlng = a, t.latlng = a, t.oldLatLng = this._oldLatLng, e.fire("move", t).fire("drag", t);
        },
        _onDragEnd: function(t) {
          Ot(this._panRequest), delete this._oldLatLng, this._marker.fire("moveend").fire("dragend", t);
        }
      }), Ki = Kt.extend({
        // @section
        // @aka Marker options
        options: {
          // @option icon: Icon = *
          // Icon instance to use for rendering the marker.
          // See [Icon documentation](#L.Icon) for details on how to customize the marker icon.
          // If not specified, a common instance of `L.Icon.Default` is used.
          icon: new Mi(),
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
          at(this, e), this._latlng = F(t);
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
          var t = this.options, e = "leaflet-zoom-" + (this._zoomAnimated ? "animated" : "hide"), i = t.icon.createIcon(this._icon), o = !1;
          i !== this._icon && (this._icon && this._removeIcon(), o = !0, t.title && (i.title = t.title), i.tagName === "IMG" && (i.alt = t.alt || "")), B(i, e), t.keyboard && (i.tabIndex = "0", i.setAttribute("role", "button")), this._icon = i, t.riseOnHover && this.on({
            mouseover: this._bringToFront,
            mouseout: this._resetZIndex
          }), this.options.autoPanOnFocus && C(i, "focus", this._panOnFocus, this);
          var a = t.icon.createShadow(this._shadow), r = !1;
          a !== this._shadow && (this._removeShadow(), r = !0), a && (B(a, e), a.alt = ""), this._shadow = a, t.opacity < 1 && this._updateOpacity(), o && this.getPane().appendChild(this._icon), this._initInteraction(), a && r && this.getPane(t.shadowPane).appendChild(this._shadow);
        },
        _removeIcon: function() {
          this.options.riseOnHover && this.off({
            mouseover: this._bringToFront,
            mouseout: this._resetZIndex
          }), this.options.autoPanOnFocus && it(this._icon, "focus", this._panOnFocus, this), ut(this._icon), this.removeInteractiveTarget(this._icon), this._icon = null;
        },
        _removeShadow: function() {
          this._shadow && ut(this._shadow), this._shadow = null;
        },
        _setPos: function(t) {
          this._icon && dt(this._icon, t), this._shadow && dt(this._shadow, t), this._zIndex = t.y + this.options.zIndexOffset, this._resetZIndex();
        },
        _updateZIndex: function(t) {
          this._icon && (this._icon.style.zIndex = this._zIndex + t);
        },
        _animateZoom: function(t) {
          var e = this._map._latLngToNewLayerPoint(this._latlng, t.zoom, t.center).round();
          this._setPos(e);
        },
        _initInteraction: function() {
          if (this.options.interactive && (B(this._icon, "leaflet-interactive"), this.addInteractiveTarget(this._icon), Kn)) {
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
          this._icon && Ct(this._icon, t), this._shadow && Ct(this._shadow, t);
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
            var e = this.options.icon.options, i = e.iconSize ? A(e.iconSize) : A(0, 0), o = e.iconAnchor ? A(e.iconAnchor) : A(0, 0);
            t.panInside(this._latlng, {
              paddingTopLeft: o,
              paddingBottomRight: i.subtract(o)
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
      function Uo(t, e) {
        return new Ki(t, e);
      }
      var ye = Kt.extend({
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
          return at(this, t), this._renderer && (this._renderer._updateStyle(this), this.options.stroke && t && Object.prototype.hasOwnProperty.call(t, "weight") && this._updateBounds()), this;
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
      }), $i = ye.extend({
        // @section
        // @aka CircleMarker options
        options: {
          fill: !0,
          // @option radius: Number = 10
          // Radius of the circle marker, in pixels
          radius: 10
        },
        initialize: function(t, e) {
          at(this, e), this._latlng = F(t), this._radius = this.options.radius;
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
          return ye.prototype.setStyle.call(this, t), this.setRadius(e), this;
        },
        _project: function() {
          this._point = this._map.latLngToLayerPoint(this._latlng), this._updateBounds();
        },
        _updateBounds: function() {
          var t = this._radius, e = this._radiusY || t, i = this._clickTolerance(), o = [t + i, e + i];
          this._pxBounds = new et(this._point.subtract(o), this._point.add(o));
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
      function Fo(t, e) {
        return new $i(t, e);
      }
      var kn = $i.extend({
        initialize: function(t, e, i) {
          if (typeof e == "number" && (e = K({}, i, { radius: e })), at(this, e), this._latlng = F(t), isNaN(this.options.radius))
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
          return new $(
            this._map.layerPointToLatLng(this._point.subtract(t)),
            this._map.layerPointToLatLng(this._point.add(t))
          );
        },
        setStyle: ye.prototype.setStyle,
        _project: function() {
          var t = this._latlng.lng, e = this._latlng.lat, i = this._map, o = i.options.crs;
          if (o.distance === Gt.distance) {
            var a = Math.PI / 180, r = this._mRadius / Gt.R / a, u = i.project([e + r, t]), d = i.project([e - r, t]), c = u.add(d).divideBy(2), _ = i.unproject(c).lat, P = Math.acos((Math.cos(r * a) - Math.sin(e * a) * Math.sin(_ * a)) / (Math.cos(e * a) * Math.cos(_ * a))) / a;
            (isNaN(P) || P === 0) && (P = r / Math.cos(Math.PI / 180 * e)), this._point = c.subtract(i.getPixelOrigin()), this._radius = isNaN(P) ? 0 : c.x - i.project([_, t - P]).x, this._radiusY = c.y - u.y;
          } else {
            var E = o.unproject(o.project(this._latlng).subtract([this._mRadius, 0]));
            this._point = i.latLngToLayerPoint(this._latlng), this._radius = this._point.x - i.latLngToLayerPoint(E).x;
          }
          this._updateBounds();
        }
      });
      function Ho(t, e, i) {
        return new kn(t, e, i);
      }
      var le = ye.extend({
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
          at(this, e), this._setLatLngs(t);
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
          for (var e = 1 / 0, i = null, o = Si, a, r, u = 0, d = this._parts.length; u < d; u++)
            for (var c = this._parts[u], _ = 1, P = c.length; _ < P; _++) {
              a = c[_ - 1], r = c[_];
              var E = o(t, a, r, !0);
              E < e && (e = E, i = o(t, a, r));
            }
          return i && (i.distance = Math.sqrt(e)), i;
        },
        // @method getCenter(): LatLng
        // Returns the center ([centroid](https://en.wikipedia.org/wiki/Centroid)) of the polyline.
        getCenter: function() {
          if (!this._map)
            throw new Error("Must add layer to map before using getCenter()");
          return jn(this._defaultShape(), this._map.options.crs);
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
          this._bounds = new $(), this._latlngs = this._convertLatLngs(t);
        },
        _defaultShape: function() {
          return Ft(this._latlngs) ? this._latlngs : this._latlngs[0];
        },
        // recursively convert latlngs input into actual LatLng instances; calculate bounds along the way
        _convertLatLngs: function(t) {
          for (var e = [], i = Ft(t), o = 0, a = t.length; o < a; o++)
            i ? (e[o] = F(t[o]), this._bounds.extend(e[o])) : e[o] = this._convertLatLngs(t[o]);
          return e;
        },
        _project: function() {
          var t = new et();
          this._rings = [], this._projectLatlngs(this._latlngs, this._rings, t), this._bounds.isValid() && t.isValid() && (this._rawPxBounds = t, this._updateBounds());
        },
        _updateBounds: function() {
          var t = this._clickTolerance(), e = new Z(t, t);
          this._rawPxBounds && (this._pxBounds = new et([
            this._rawPxBounds.min.subtract(e),
            this._rawPxBounds.max.add(e)
          ]));
        },
        // recursively turns latlngs into a set of rings with projected coordinates
        _projectLatlngs: function(t, e, i) {
          var o = t[0] instanceof Y, a = t.length, r, u;
          if (o) {
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
            var e = this._parts, i, o, a, r, u, d, c;
            for (i = 0, a = 0, r = this._rings.length; i < r; i++)
              for (c = this._rings[i], o = 0, u = c.length; o < u - 1; o++)
                d = Wn(c[o], c[o + 1], t, o, !0), d && (e[a] = e[a] || [], e[a].push(d[0]), (d[1] !== c[o + 1] || o === u - 2) && (e[a].push(d[1]), a++));
          }
        },
        // simplify each clipped part of the polyline for performance
        _simplifyPoints: function() {
          for (var t = this._parts, e = this.options.smoothFactor, i = 0, o = t.length; i < o; i++)
            t[i] = Un(t[i], e);
        },
        _update: function() {
          this._map && (this._clipPoints(), this._simplifyPoints(), this._updatePath());
        },
        _updatePath: function() {
          this._renderer._updatePoly(this);
        },
        // Needed by the `Canvas` renderer for interactivity
        _containsPoint: function(t, e) {
          var i, o, a, r, u, d, c = this._clickTolerance();
          if (!this._pxBounds || !this._pxBounds.contains(t))
            return !1;
          for (i = 0, r = this._parts.length; i < r; i++)
            for (d = this._parts[i], o = 0, u = d.length, a = u - 1; o < u; a = o++)
              if (!(!e && o === 0) && Fn(t, d[a], d[o]) <= c)
                return !0;
          return !1;
        }
      });
      function Wo(t, e) {
        return new le(t, e);
      }
      le._flat = Gn;
      var ii = le.extend({
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
          return Vn(this._defaultShape(), this._map.options.crs);
        },
        _convertLatLngs: function(t) {
          var e = le.prototype._convertLatLngs.call(this, t), i = e.length;
          return i >= 2 && e[0] instanceof Y && e[0].equals(e[i - 1]) && e.pop(), e;
        },
        _setLatLngs: function(t) {
          le.prototype._setLatLngs.call(this, t), Ft(this._latlngs) && (this._latlngs = [this._latlngs]);
        },
        _defaultShape: function() {
          return Ft(this._latlngs[0]) ? this._latlngs[0] : this._latlngs[0][0];
        },
        _clipPoints: function() {
          var t = this._renderer._bounds, e = this.options.weight, i = new Z(e, e);
          if (t = new et(t.min.subtract(i), t.max.add(i)), this._parts = [], !(!this._pxBounds || !this._pxBounds.intersects(t))) {
            if (this.options.noClip) {
              this._parts = this._rings;
              return;
            }
            for (var o = 0, a = this._rings.length, r; o < a; o++)
              r = Rn(this._rings[o], t, !0), r.length && this._parts.push(r);
          }
        },
        _updatePath: function() {
          this._renderer._updatePoly(this, !0);
        },
        // Needed by the `Canvas` renderer for interactivity
        _containsPoint: function(t) {
          var e = !1, i, o, a, r, u, d, c, _;
          if (!this._pxBounds || !this._pxBounds.contains(t))
            return !1;
          for (r = 0, c = this._parts.length; r < c; r++)
            for (i = this._parts[r], u = 0, _ = i.length, d = _ - 1; u < _; d = u++)
              o = i[u], a = i[d], o.y > t.y != a.y > t.y && t.x < (a.x - o.x) * (t.y - o.y) / (a.y - o.y) + o.x && (e = !e);
          return e || le.prototype._containsPoint.call(this, t, !0);
        }
      });
      function Go(t, e) {
        return new ii(t, e);
      }
      var ue = re.extend({
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
          at(this, e), this._layers = {}, t && this.addData(t);
        },
        // @method addData( <GeoJSON> data ): this
        // Adds a GeoJSON object to the layer.
        addData: function(t) {
          var e = Dt(t) ? t : t.features, i, o, a;
          if (e) {
            for (i = 0, o = e.length; i < o; i++)
              a = e[i], (a.geometries || a.geometry || a.features || a.coordinates) && this.addData(a);
            return this;
          }
          var r = this.options;
          if (r.filter && !r.filter(t))
            return this;
          var u = Xi(t, r);
          return u ? (u.feature = Qi(t), u.defaultOptions = u.options, this.resetStyle(u), r.onEachFeature && r.onEachFeature(t, u), this.addLayer(u)) : this;
        },
        // @method resetStyle( <Path> layer? ): this
        // Resets the given vector layer's style to the original GeoJSON style, useful for resetting style after hover events.
        // If `layer` is omitted, the style of all features in the current layer is reset.
        resetStyle: function(t) {
          return t === void 0 ? this.eachLayer(this.resetStyle, this) : (t.options = K({}, t.defaultOptions), this._setLayerStyle(t, this.options.style), this);
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
      function Xi(t, e) {
        var i = t.type === "Feature" ? t.geometry : t, o = i ? i.coordinates : null, a = [], r = e && e.pointToLayer, u = e && e.coordsToLatLng || Cn, d, c, _, P;
        if (!o && !i)
          return null;
        switch (i.type) {
          case "Point":
            return d = u(o), $n(r, t, d, e);
          case "MultiPoint":
            for (_ = 0, P = o.length; _ < P; _++)
              d = u(o[_]), a.push($n(r, t, d, e));
            return new re(a);
          case "LineString":
          case "MultiLineString":
            return c = Yi(o, i.type === "LineString" ? 0 : 1, u), new le(c, e);
          case "Polygon":
          case "MultiPolygon":
            return c = Yi(o, i.type === "Polygon" ? 1 : 2, u), new ii(c, e);
          case "GeometryCollection":
            for (_ = 0, P = i.geometries.length; _ < P; _++) {
              var E = Xi({
                geometry: i.geometries[_],
                type: "Feature",
                properties: t.properties
              }, e);
              E && a.push(E);
            }
            return new re(a);
          case "FeatureCollection":
            for (_ = 0, P = i.features.length; _ < P; _++) {
              var D = Xi(i.features[_], e);
              D && a.push(D);
            }
            return new re(a);
          default:
            throw new Error("Invalid GeoJSON object.");
        }
      }
      function $n(t, e, i, o) {
        return t ? t(e, i) : new Ki(i, o && o.markersInheritOptions && o);
      }
      function Cn(t) {
        return new Y(t[1], t[0], t[2]);
      }
      function Yi(t, e, i) {
        for (var o = [], a = 0, r = t.length, u; a < r; a++)
          u = e ? Yi(t[a], e - 1, i) : (i || Cn)(t[a]), o.push(u);
        return o;
      }
      function Sn(t, e) {
        return t = F(t), t.alt !== void 0 ? [mt(t.lng, e), mt(t.lat, e), mt(t.alt, e)] : [mt(t.lng, e), mt(t.lat, e)];
      }
      function Ji(t, e, i, o) {
        for (var a = [], r = 0, u = t.length; r < u; r++)
          a.push(e ? Ji(t[r], Ft(t[r]) ? 0 : e - 1, i, o) : Sn(t[r], o));
        return !e && i && a.length > 0 && a.push(a[0].slice()), a;
      }
      function ni(t, e) {
        return t.feature ? K({}, t.feature, { geometry: e }) : Qi(e);
      }
      function Qi(t) {
        return t.type === "Feature" || t.type === "FeatureCollection" ? t : {
          type: "Feature",
          properties: {},
          geometry: t
        };
      }
      var Mn = {
        toGeoJSON: function(t) {
          return ni(this, {
            type: "Point",
            coordinates: Sn(this.getLatLng(), t)
          });
        }
      };
      Ki.include(Mn), kn.include(Mn), $i.include(Mn), le.include({
        toGeoJSON: function(t) {
          var e = !Ft(this._latlngs), i = Ji(this._latlngs, e ? 1 : 0, !1, t);
          return ni(this, {
            type: (e ? "Multi" : "") + "LineString",
            coordinates: i
          });
        }
      }), ii.include({
        toGeoJSON: function(t) {
          var e = !Ft(this._latlngs), i = e && !Ft(this._latlngs[0]), o = Ji(this._latlngs, i ? 2 : e ? 1 : 0, !0, t);
          return e || (o = [o]), ni(this, {
            type: (i ? "Multi" : "") + "Polygon",
            coordinates: o
          });
        }
      }), ti.include({
        toMultiPoint: function(t) {
          var e = [];
          return this.eachLayer(function(i) {
            e.push(i.toGeoJSON(t).geometry.coordinates);
          }), ni(this, {
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
          var i = e === "GeometryCollection", o = [];
          return this.eachLayer(function(a) {
            if (a.toGeoJSON) {
              var r = a.toGeoJSON(t);
              if (i)
                o.push(r.geometry);
              else {
                var u = Qi(r);
                u.type === "FeatureCollection" ? o.push.apply(o, u.features) : o.push(u);
              }
            }
          }), i ? ni(this, {
            geometries: o,
            type: "GeometryCollection"
          }) : {
            type: "FeatureCollection",
            features: o
          };
        }
      });
      function Xn(t, e) {
        return new ue(t, e);
      }
      var jo = Xn, tn = Kt.extend({
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
          this._url = t, this._bounds = T(e), at(this, i);
        },
        onAdd: function() {
          this._image || (this._initImage(), this.options.opacity < 1 && this._updateOpacity()), this.options.interactive && (B(this._image, "leaflet-interactive"), this.addInteractiveTarget(this._image)), this.getPane().appendChild(this._image), this._reset();
        },
        onRemove: function() {
          ut(this._image), this.options.interactive && this.removeInteractiveTarget(this._image);
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
          return this._map && me(this._image), this;
        },
        // @method bringToBack(): this
        // Brings the layer to the bottom of all overlays.
        bringToBack: function() {
          return this._map && ve(this._image), this;
        },
        // @method setUrl(url: String): this
        // Changes the URL of the image.
        setUrl: function(t) {
          return this._url = t, this._image && (this._image.src = t), this;
        },
        // @method setBounds(bounds: LatLngBounds): this
        // Update the bounds that this ImageOverlay covers
        setBounds: function(t) {
          return this._bounds = T(t), this._map && this._reset(), this;
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
          var t = this._url.tagName === "IMG", e = this._image = t ? this._url : G("img");
          if (B(e, "leaflet-image-layer"), this._zoomAnimated && B(e, "leaflet-zoom-animated"), this.options.className && B(e, this.options.className), e.onselectstart = st, e.onmousemove = st, e.onload = U(this.fire, this, "load"), e.onerror = U(this._overlayOnError, this, "error"), (this.options.crossOrigin || this.options.crossOrigin === "") && (e.crossOrigin = this.options.crossOrigin === !0 ? "" : this.options.crossOrigin), this.options.zIndex && this._updateZIndex(), t) {
            this._url = e.src;
            return;
          }
          e.src = this._url, e.alt = this.options.alt;
        },
        _animateZoom: function(t) {
          var e = this._map.getZoomScale(t.zoom), i = this._map._latLngBoundsToNewLayerBounds(this._bounds, t.zoom, t.center).min;
          p(this._image, i, e);
        },
        _reset: function() {
          var t = this._image, e = new et(
            this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
            this._map.latLngToLayerPoint(this._bounds.getSouthEast())
          ), i = e.getSize();
          dt(t, e.min), t.style.width = i.x + "px", t.style.height = i.y + "px";
        },
        _updateOpacity: function() {
          Ct(this._image, this.options.opacity);
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
      }), qo = function(t, e, i) {
        return new tn(t, e, i);
      }, Yn = tn.extend({
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
          var t = this._url.tagName === "VIDEO", e = this._image = t ? this._url : G("video");
          if (B(e, "leaflet-image-layer"), this._zoomAnimated && B(e, "leaflet-zoom-animated"), this.options.className && B(e, this.options.className), e.onselectstart = st, e.onmousemove = st, e.onloadeddata = U(this.fire, this, "load"), t) {
            for (var i = e.getElementsByTagName("source"), o = [], a = 0; a < i.length; a++)
              o.push(i[a].src);
            this._url = i.length > 0 ? o : [e.src];
            return;
          }
          Dt(this._url) || (this._url = [this._url]), !this.options.keepAspectRatio && Object.prototype.hasOwnProperty.call(e.style, "objectFit") && (e.style.objectFit = "fill"), e.autoplay = !!this.options.autoplay, e.loop = !!this.options.loop, e.muted = !!this.options.muted, e.playsInline = !!this.options.playsInline;
          for (var r = 0; r < this._url.length; r++) {
            var u = G("source");
            u.src = this._url[r], e.appendChild(u);
          }
        }
        // @method getElement(): HTMLVideoElement
        // Returns the instance of [`HTMLVideoElement`](https://developer.mozilla.org/docs/Web/API/HTMLVideoElement)
        // used by this overlay.
      });
      function Ko(t, e, i) {
        return new Yn(t, e, i);
      }
      var Jn = tn.extend({
        _initImage: function() {
          var t = this._image = this._url;
          B(t, "leaflet-image-layer"), this._zoomAnimated && B(t, "leaflet-zoom-animated"), this.options.className && B(t, this.options.className), t.onselectstart = st, t.onmousemove = st;
        }
        // @method getElement(): SVGElement
        // Returns the instance of [`SVGElement`](https://developer.mozilla.org/docs/Web/API/SVGElement)
        // used by this overlay.
      });
      function $o(t, e, i) {
        return new Jn(t, e, i);
      }
      var ie = Kt.extend({
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
          t && (t instanceof Y || Dt(t)) ? (this._latlng = F(t), at(this, e)) : (at(this, t), this._source = e), this.options.content && (this._content = this.options.content);
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
          this._zoomAnimated = t._zoomAnimated, this._container || this._initLayout(), t._fadeAnimated && Ct(this._container, 0), clearTimeout(this._removeTimeout), this.getPane().appendChild(this._container), this.update(), t._fadeAnimated && Ct(this._container, 1), this.bringToFront(), this.options.interactive && (B(this._container, "leaflet-interactive"), this.addInteractiveTarget(this._container));
        },
        onRemove: function(t) {
          t._fadeAnimated ? (Ct(this._container, 0), this._removeTimeout = setTimeout(U(ut, void 0, this._container), 200)) : ut(this._container), this.options.interactive && (rt(this._container, "leaflet-interactive"), this.removeInteractiveTarget(this._container));
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
          return this._map && me(this._container), this;
        },
        // @method bringToBack: this
        // Brings this overlay to the back of other overlays (in the same map pane).
        bringToBack: function() {
          return this._map && ve(this._container), this;
        },
        // prepare bound overlay to open: update latlng pos / content source (for FeatureGroup)
        _prepareOpen: function(t) {
          var e = this._source;
          if (!e._map)
            return !1;
          if (e instanceof re) {
            e = null;
            var i = this._source._layers;
            for (var o in i)
              if (i[o]._map) {
                e = i[o];
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
            var t = this._map.latLngToLayerPoint(this._latlng), e = A(this.options.offset), i = this._getAnchor();
            this._zoomAnimated ? dt(this._container, t.add(i)) : e = e.add(t).add(i);
            var o = this._containerBottom = -e.y, a = this._containerLeft = -Math.round(this._containerWidth / 2) + e.x;
            this._container.style.bottom = o + "px", this._container.style.left = a + "px";
          }
        },
        _getAnchor: function() {
          return [0, 0];
        }
      });
      q.include({
        _initOverlay: function(t, e, i, o) {
          var a = e;
          return a instanceof t || (a = new t(o).setContent(e)), i && a.setLatLng(i), a;
        }
      }), Kt.include({
        _initOverlay: function(t, e, i, o) {
          var a = i;
          return a instanceof t ? (at(a, o), a._source = this) : (a = e && !o ? e : new t(o, this), a.setContent(i)), a;
        }
      });
      var en = ie.extend({
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
          return t = arguments.length ? t : this._source._map, !t.hasLayer(this) && t._popup && t._popup.options.autoClose && t.removeLayer(t._popup), t._popup = this, ie.prototype.openOn.call(this, t);
        },
        onAdd: function(t) {
          ie.prototype.onAdd.call(this, t), t.fire("popupopen", { popup: this }), this._source && (this._source.fire("popupopen", { popup: this }, !0), this._source instanceof ye || this._source.on("preclick", lt));
        },
        onRemove: function(t) {
          ie.prototype.onRemove.call(this, t), t.fire("popupclose", { popup: this }), this._source && (this._source.fire("popupclose", { popup: this }, !0), this._source instanceof ye || this._source.off("preclick", lt));
        },
        getEvents: function() {
          var t = ie.prototype.getEvents.call(this);
          return (this.options.closeOnClick !== void 0 ? this.options.closeOnClick : this._map.options.closePopupOnClick) && (t.preclick = this.close), this.options.keepInView && (t.moveend = this._adjustPan), t;
        },
        _initLayout: function() {
          var t = "leaflet-popup", e = this._container = G(
            "div",
            t + " " + (this.options.className || "") + " leaflet-zoom-animated"
          ), i = this._wrapper = G("div", t + "-content-wrapper", e);
          if (this._contentNode = G("div", t + "-content", i), ht(e), _t(this._contentNode), C(e, "contextmenu", lt), this._tipContainer = G("div", t + "-tip-container", e), this._tip = G("div", t + "-tip", this._tipContainer), this.options.closeButton) {
            var o = this._closeButton = G("a", t + "-close-button", e);
            o.setAttribute("role", "button"), o.setAttribute("aria-label", "Close popup"), o.href = "#close", o.innerHTML = '<span aria-hidden="true">&#215;</span>', C(o, "click", function(a) {
              Lt(a), this.close();
            }, this);
          }
        },
        _updateLayout: function() {
          var t = this._contentNode, e = t.style;
          e.width = "", e.whiteSpace = "nowrap";
          var i = t.offsetWidth;
          i = Math.min(i, this.options.maxWidth), i = Math.max(i, this.options.minWidth), e.width = i + 1 + "px", e.whiteSpace = "", e.height = "";
          var o = t.offsetHeight, a = this.options.maxHeight, r = "leaflet-popup-scrolled";
          a && o > a ? (e.height = a + "px", B(t, r)) : rt(t, r), this._containerWidth = this._container.offsetWidth;
        },
        _animateZoom: function(t) {
          var e = this._map._latLngToNewLayerPoint(this._latlng, t.zoom, t.center), i = this._getAnchor();
          dt(this._container, e.add(i));
        },
        _adjustPan: function() {
          if (this.options.autoPan) {
            if (this._map._panAnim && this._map._panAnim.stop(), this._autopanning) {
              this._autopanning = !1;
              return;
            }
            var t = this._map, e = parseInt(se(this._container, "marginBottom"), 10) || 0, i = this._container.offsetHeight + e, o = this._containerWidth, a = new Z(this._containerLeft, -i - this._containerBottom);
            a._add(ae(this._container));
            var r = t.layerPointToContainerPoint(a), u = A(this.options.autoPanPadding), d = A(this.options.autoPanPaddingTopLeft || u), c = A(this.options.autoPanPaddingBottomRight || u), _ = t.getSize(), P = 0, E = 0;
            r.x + o + c.x > _.x && (P = r.x + o - _.x + c.x), r.x - P - d.x < 0 && (P = r.x - d.x), r.y + i + c.y > _.y && (E = r.y + i - _.y + c.y), r.y - E - d.y < 0 && (E = r.y - d.y), (P || E) && (this.options.keepInView && (this._autopanning = !0), t.fire("autopanstart").panBy([P, E]));
          }
        },
        _getAnchor: function() {
          return A(this._source && this._source._getPopupAnchor ? this._source._getPopupAnchor() : [0, 0]);
        }
      }), Xo = function(t, e) {
        return new en(t, e);
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
          return this._initOverlay(en, t, e, i).openOn(this), this;
        },
        // @method closePopup(popup?: Popup): this
        // Closes the popup previously opened with [openPopup](#map-openpopup) (or the given one).
        closePopup: function(t) {
          return t = arguments.length ? t : this._popup, t && t.close(), this;
        }
      }), Kt.include({
        // @method bindPopup(content: String|HTMLElement|Function|Popup, options?: Popup options): this
        // Binds a popup to the layer with the passed `content` and sets up the
        // necessary event listeners. If a `Function` is passed it will receive
        // the layer as the first argument and should return a `String` or `HTMLElement`.
        bindPopup: function(t, e) {
          return this._popup = this._initOverlay(en, this._popup, t, e), this._popupHandlersAdded || (this.on({
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
          return this._popup && (this instanceof re || (this._popup._source = this), this._popup._prepareOpen(t || this._latlng) && this._popup.openOn(this._map)), this;
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
            ze(t);
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
      var nn = ie.extend({
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
          ie.prototype.onAdd.call(this, t), this.setOpacity(this.options.opacity), t.fire("tooltipopen", { tooltip: this }), this._source && (this.addEventParent(this._source), this._source.fire("tooltipopen", { tooltip: this }, !0));
        },
        onRemove: function(t) {
          ie.prototype.onRemove.call(this, t), t.fire("tooltipclose", { tooltip: this }), this._source && (this.removeEventParent(this._source), this._source.fire("tooltipclose", { tooltip: this }, !0));
        },
        getEvents: function() {
          var t = ie.prototype.getEvents.call(this);
          return this.options.permanent || (t.preclick = this.close), t;
        },
        _initLayout: function() {
          var t = "leaflet-tooltip", e = t + " " + (this.options.className || "") + " leaflet-zoom-" + (this._zoomAnimated ? "animated" : "hide");
          this._contentNode = this._container = G("div", e), this._container.setAttribute("role", "tooltip"), this._container.setAttribute("id", "leaflet-tooltip-" + W(this));
        },
        _updateLayout: function() {
        },
        _adjustPan: function() {
        },
        _setPosition: function(t) {
          var e, i, o = this._map, a = this._container, r = o.latLngToContainerPoint(o.getCenter()), u = o.layerPointToContainerPoint(t), d = this.options.direction, c = a.offsetWidth, _ = a.offsetHeight, P = A(this.options.offset), E = this._getAnchor();
          d === "top" ? (e = c / 2, i = _) : d === "bottom" ? (e = c / 2, i = 0) : d === "center" ? (e = c / 2, i = _ / 2) : d === "right" ? (e = 0, i = _ / 2) : d === "left" ? (e = c, i = _ / 2) : u.x < r.x ? (d = "right", e = 0, i = _ / 2) : (d = "left", e = c + (P.x + E.x) * 2, i = _ / 2), t = t.subtract(A(e, i, !0)).add(P).add(E), rt(a, "leaflet-tooltip-right"), rt(a, "leaflet-tooltip-left"), rt(a, "leaflet-tooltip-top"), rt(a, "leaflet-tooltip-bottom"), B(a, "leaflet-tooltip-" + d), dt(a, t);
        },
        _updatePosition: function() {
          var t = this._map.latLngToLayerPoint(this._latlng);
          this._setPosition(t);
        },
        setOpacity: function(t) {
          this.options.opacity = t, this._container && Ct(this._container, t);
        },
        _animateZoom: function(t) {
          var e = this._map._latLngToNewLayerPoint(this._latlng, t.zoom, t.center);
          this._setPosition(e);
        },
        _getAnchor: function() {
          return A(this._source && this._source._getTooltipAnchor && !this.options.sticky ? this._source._getTooltipAnchor() : [0, 0]);
        }
      }), Yo = function(t, e) {
        return new nn(t, e);
      };
      q.include({
        // @method openTooltip(tooltip: Tooltip): this
        // Opens the specified tooltip.
        // @alternative
        // @method openTooltip(content: String|HTMLElement, latlng: LatLng, options?: Tooltip options): this
        // Creates a tooltip with the specified content and options and open it.
        openTooltip: function(t, e, i) {
          return this._initOverlay(nn, t, e, i).openOn(this), this;
        },
        // @method closeTooltip(tooltip: Tooltip): this
        // Closes the tooltip given as parameter.
        closeTooltip: function(t) {
          return t.close(), this;
        }
      }), Kt.include({
        // @method bindTooltip(content: String|HTMLElement|Function|Tooltip, options?: Tooltip options): this
        // Binds a tooltip to the layer with the passed `content` and sets up the
        // necessary event listeners. If a `Function` is passed it will receive
        // the layer as the first argument and should return a `String` or `HTMLElement`.
        bindTooltip: function(t, e) {
          return this._tooltip && this.isTooltipOpen() && this.unbindTooltip(), this._tooltip = this._initOverlay(nn, this._tooltip, t, e), this._initTooltipInteractions(), this._tooltip.options.permanent && this._map && this._map.hasLayer(this) && this.openTooltip(), this;
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
          return this._tooltip && (this instanceof re || (this._tooltip._source = this), this._tooltip._prepareOpen(t) && (this._tooltip.openOn(this._map), this.getElement ? this._setAriaDescribedByOnLayer(this) : this.eachLayer && this.eachLayer(this._setAriaDescribedByOnLayer, this))), this;
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
          e && (C(e, "focus", function() {
            this._tooltip._source = t, this.openTooltip();
          }, this), C(e, "blur", this.closeTooltip, this));
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
          var e = t.latlng, i, o;
          this._tooltip.options.sticky && t.originalEvent && (i = this._map.mouseEventToContainerPoint(t.originalEvent), o = this._map.containerPointToLayerPoint(i), e = this._map.layerPointToLatLng(o)), this._tooltip.setLatLng(e);
        }
      });
      var Qn = ei.extend({
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
          if (i.html instanceof Element ? (Je(e), e.appendChild(i.html)) : e.innerHTML = i.html !== !1 ? i.html : "", i.bgPos) {
            var o = A(i.bgPos);
            e.style.backgroundPosition = -o.x + "px " + -o.y + "px";
          }
          return this._setIconStyles(e, "icon"), e;
        },
        createShadow: function() {
          return null;
        }
      });
      function Jo(t) {
        return new Qn(t);
      }
      ei.Default = Mi;
      var zi = Kt.extend({
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
          updateWhenIdle: b.mobile,
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
          at(this, t);
        },
        onAdd: function() {
          this._initContainer(), this._levels = {}, this._tiles = {}, this._resetView();
        },
        beforeAdd: function(t) {
          t._addZoomLimit(this);
        },
        onRemove: function(t) {
          this._removeAllTiles(), ut(this._container), t._removeZoomLimit(this), this._container = null, this._tileZoom = void 0;
        },
        // @method bringToFront: this
        // Brings the tile layer to the top of all tile layers.
        bringToFront: function() {
          return this._map && (me(this._container), this._setAutoZIndex(Math.max)), this;
        },
        // @method bringToBack: this
        // Brings the tile layer to the bottom of all tile layers.
        bringToBack: function() {
          return this._map && (ve(this._container), this._setAutoZIndex(Math.min)), this;
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
          return this.options.updateWhenIdle || (this._onMove || (this._onMove = wt(this._onMoveEnd, this.options.updateInterval, this)), t.move = this._onMove), this._zoomAnimated && (t.zoomanim = this._animateZoom), t;
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
          return t instanceof Z ? t : new Z(t, t);
        },
        _updateZIndex: function() {
          this._container && this.options.zIndex !== void 0 && this.options.zIndex !== null && (this._container.style.zIndex = this.options.zIndex);
        },
        _setAutoZIndex: function(t) {
          for (var e = this.getPane().children, i = -t(-1 / 0, 1 / 0), o = 0, a = e.length, r; o < a; o++)
            r = e[o].style.zIndex, e[o] !== this._container && r && (i = t(i, +r));
          isFinite(i) && (this.options.zIndex = i + t(-1, 1), this._updateZIndex());
        },
        _updateOpacity: function() {
          if (this._map && !b.ielt9) {
            Ct(this._container, this.options.opacity);
            var t = +/* @__PURE__ */ new Date(), e = !1, i = !1;
            for (var o in this._tiles) {
              var a = this._tiles[o];
              if (!(!a.current || !a.loaded)) {
                var r = Math.min(1, (t - a.loaded) / 200);
                Ct(a.el, r), r < 1 ? e = !0 : (a.active ? i = !0 : this._onOpaqueTile(a), a.active = !0);
              }
            }
            i && !this._noPrune && this._pruneTiles(), e && (Ot(this._fadeFrame), this._fadeFrame = Pt(this._updateOpacity, this));
          }
        },
        _onOpaqueTile: st,
        _initContainer: function() {
          this._container || (this._container = G("div", "leaflet-layer " + (this.options.className || "")), this._updateZIndex(), this.options.opacity < 1 && this._updateOpacity(), this.getPane().appendChild(this._container));
        },
        _updateLevels: function() {
          var t = this._tileZoom, e = this.options.maxZoom;
          if (t !== void 0) {
            for (var i in this._levels)
              i = Number(i), this._levels[i].el.children.length || i === t ? (this._levels[i].el.style.zIndex = e - Math.abs(t - i), this._onUpdateLevel(i)) : (ut(this._levels[i].el), this._removeTilesAtZoom(i), this._onRemoveLevel(i), delete this._levels[i]);
            var o = this._levels[t], a = this._map;
            return o || (o = this._levels[t] = {}, o.el = G("div", "leaflet-tile-container leaflet-zoom-animated", this._container), o.el.style.zIndex = e, o.origin = a.project(a.unproject(a.getPixelOrigin()), t).round(), o.zoom = t, this._setZoomTransform(o, a.getCenter(), a.getZoom()), st(o.el.offsetWidth), this._onCreateLevel(o)), this._level = o, o;
          }
        },
        _onUpdateLevel: st,
        _onRemoveLevel: st,
        _onCreateLevel: st,
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
                var o = e.coords;
                this._retainParent(o.x, o.y, o.z, o.z - 5) || this._retainChildren(o.x, o.y, o.z, o.z + 2);
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
            ut(this._levels[t].el), this._onRemoveLevel(Number(t)), delete this._levels[t];
          this._removeAllTiles(), this._tileZoom = void 0;
        },
        _retainParent: function(t, e, i, o) {
          var a = Math.floor(t / 2), r = Math.floor(e / 2), u = i - 1, d = new Z(+a, +r);
          d.z = +u;
          var c = this._tileCoordsToKey(d), _ = this._tiles[c];
          return _ && _.active ? (_.retain = !0, !0) : (_ && _.loaded && (_.retain = !0), u > o ? this._retainParent(a, r, u, o) : !1);
        },
        _retainChildren: function(t, e, i, o) {
          for (var a = 2 * t; a < 2 * t + 2; a++)
            for (var r = 2 * e; r < 2 * e + 2; r++) {
              var u = new Z(a, r);
              u.z = i + 1;
              var d = this._tileCoordsToKey(u), c = this._tiles[d];
              if (c && c.active) {
                c.retain = !0;
                continue;
              } else c && c.loaded && (c.retain = !0);
              i + 1 < o && this._retainChildren(a, r, i + 1, o);
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
        _setView: function(t, e, i, o) {
          var a = Math.round(e);
          this.options.maxZoom !== void 0 && a > this.options.maxZoom || this.options.minZoom !== void 0 && a < this.options.minZoom ? a = void 0 : a = this._clampZoom(a);
          var r = this.options.updateWhenZooming && a !== this._tileZoom;
          (!o || r) && (this._tileZoom = a, this._abortLoading && this._abortLoading(), this._updateLevels(), this._resetGrid(), a !== void 0 && this._update(t), i || this._pruneTiles(), this._noPrune = !!i), this._setZoomTransforms(t, e);
        },
        _setZoomTransforms: function(t, e) {
          for (var i in this._levels)
            this._setZoomTransform(this._levels[i], t, e);
        },
        _setZoomTransform: function(t, e, i) {
          var o = this._map.getZoomScale(i, t.zoom), a = t.origin.multiplyBy(o).subtract(this._map._getNewPixelOrigin(e, i)).round();
          b.any3d ? p(t.el, a, o) : dt(t.el, a);
        },
        _resetGrid: function() {
          var t = this._map, e = t.options.crs, i = this._tileSize = this.getTileSize(), o = this._tileZoom, a = this._map.getPixelWorldBounds(this._tileZoom);
          a && (this._globalTileRange = this._pxBoundsToTileRange(a)), this._wrapX = e.wrapLng && !this.options.noWrap && [
            Math.floor(t.project([0, e.wrapLng[0]], o).x / i.x),
            Math.ceil(t.project([0, e.wrapLng[1]], o).x / i.y)
          ], this._wrapY = e.wrapLat && !this.options.noWrap && [
            Math.floor(t.project([e.wrapLat[0], 0], o).y / i.x),
            Math.ceil(t.project([e.wrapLat[1], 0], o).y / i.y)
          ];
        },
        _onMoveEnd: function() {
          !this._map || this._map._animatingZoom || this._update();
        },
        _getTiledPixelBounds: function(t) {
          var e = this._map, i = e._animatingZoom ? Math.max(e._animateToZoom, e.getZoom()) : e.getZoom(), o = e.getZoomScale(i, this._tileZoom), a = e.project(t, this._tileZoom).floor(), r = e.getSize().divideBy(o * 2);
          return new et(a.subtract(r), a.add(r));
        },
        // Private method to load tiles in the grid's active zoom level according to map bounds
        _update: function(t) {
          var e = this._map;
          if (e) {
            var i = this._clampZoom(e.getZoom());
            if (t === void 0 && (t = e.getCenter()), this._tileZoom !== void 0) {
              var o = this._getTiledPixelBounds(t), a = this._pxBoundsToTileRange(o), r = a.getCenter(), u = [], d = this.options.keepBuffer, c = new et(
                a.getBottomLeft().subtract([d, -d]),
                a.getTopRight().add([d, -d])
              );
              if (!(isFinite(a.min.x) && isFinite(a.min.y) && isFinite(a.max.x) && isFinite(a.max.y)))
                throw new Error("Attempted to load an infinite number of tiles");
              for (var _ in this._tiles) {
                var P = this._tiles[_].coords;
                (P.z !== this._tileZoom || !c.contains(new Z(P.x, P.y))) && (this._tiles[_].current = !1);
              }
              if (Math.abs(i - this._tileZoom) > 1) {
                this._setView(t, i);
                return;
              }
              for (var E = a.min.y; E <= a.max.y; E++)
                for (var D = a.min.x; D <= a.max.x; D++) {
                  var Mt = new Z(D, E);
                  if (Mt.z = this._tileZoom, !!this._isValidTile(Mt)) {
                    var bt = this._tiles[this._tileCoordsToKey(Mt)];
                    bt ? bt.current = !0 : u.push(Mt);
                  }
                }
              if (u.sort(function(At, si) {
                return At.distanceTo(r) - si.distanceTo(r);
              }), u.length !== 0) {
                this._loading || (this._loading = !0, this.fire("loading"));
                var Ht = document.createDocumentFragment();
                for (D = 0; D < u.length; D++)
                  this._addTile(u[D], Ht);
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
          var o = this._tileCoordsToBounds(t);
          return T(this.options.bounds).overlaps(o);
        },
        _keyToBounds: function(t) {
          return this._tileCoordsToBounds(this._keyToTileCoords(t));
        },
        _tileCoordsToNwSe: function(t) {
          var e = this._map, i = this.getTileSize(), o = t.scaleBy(i), a = o.add(i), r = e.unproject(o, t.z), u = e.unproject(a, t.z);
          return [r, u];
        },
        // converts tile coordinates to its geographical bounds
        _tileCoordsToBounds: function(t) {
          var e = this._tileCoordsToNwSe(t), i = new $(e[0], e[1]);
          return this.options.noWrap || (i = this._map.wrapLatLngBounds(i)), i;
        },
        // converts tile coordinates to key for the tile cache
        _tileCoordsToKey: function(t) {
          return t.x + ":" + t.y + ":" + t.z;
        },
        // converts tile cache key to coordinates
        _keyToTileCoords: function(t) {
          var e = t.split(":"), i = new Z(+e[0], +e[1]);
          return i.z = +e[2], i;
        },
        _removeTile: function(t) {
          var e = this._tiles[t];
          e && (ut(e.el), delete this._tiles[t], this.fire("tileunload", {
            tile: e.el,
            coords: this._keyToTileCoords(t)
          }));
        },
        _initTile: function(t) {
          B(t, "leaflet-tile");
          var e = this.getTileSize();
          t.style.width = e.x + "px", t.style.height = e.y + "px", t.onselectstart = st, t.onmousemove = st, b.ielt9 && this.options.opacity < 1 && Ct(t, this.options.opacity);
        },
        _addTile: function(t, e) {
          var i = this._getTilePos(t), o = this._tileCoordsToKey(t), a = this.createTile(this._wrapCoords(t), U(this._tileReady, this, t));
          this._initTile(a), this.createTile.length < 2 && Pt(U(this._tileReady, this, t, null, a)), dt(a, i), this._tiles[o] = {
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
          var o = this._tileCoordsToKey(t);
          i = this._tiles[o], i && (i.loaded = +/* @__PURE__ */ new Date(), this._map._fadeAnimated ? (Ct(i.el, 0), Ot(this._fadeFrame), this._fadeFrame = Pt(this._updateOpacity, this)) : (i.active = !0, this._pruneTiles()), e || (B(i.el, "leaflet-tile-loaded"), this.fire("tileload", {
            tile: i.el,
            coords: t
          })), this._noTilesToLoad() && (this._loading = !1, this.fire("load"), b.ielt9 || !this._map._fadeAnimated ? Pt(this._pruneTiles, this) : setTimeout(U(this._pruneTiles, this), 250)));
        },
        _getTilePos: function(t) {
          return t.scaleBy(this.getTileSize()).subtract(this._level.origin);
        },
        _wrapCoords: function(t) {
          var e = new Z(
            this._wrapX ? ce(t.x, this._wrapX) : t.x,
            this._wrapY ? ce(t.y, this._wrapY) : t.y
          );
          return e.z = t.z, e;
        },
        _pxBoundsToTileRange: function(t) {
          var e = this.getTileSize();
          return new et(
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
      function Qo(t) {
        return new zi(t);
      }
      var oi = zi.extend({
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
          this._url = t, e = at(this, e), e.detectRetina && b.retina && e.maxZoom > 0 ? (e.tileSize = Math.floor(e.tileSize / 2), e.zoomReverse ? (e.zoomOffset--, e.minZoom = Math.min(e.maxZoom, e.minZoom + 1)) : (e.zoomOffset++, e.maxZoom = Math.max(e.minZoom, e.maxZoom - 1)), e.minZoom = Math.max(0, e.minZoom)) : e.zoomReverse ? e.minZoom = Math.min(e.maxZoom, e.minZoom) : e.maxZoom = Math.max(e.minZoom, e.maxZoom), typeof e.subdomains == "string" && (e.subdomains = e.subdomains.split("")), this.on("tileunload", this._onTileRemove);
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
          return C(i, "load", U(this._tileOnLoad, this, e, i)), C(i, "error", U(this._tileOnError, this, e, i)), (this.options.crossOrigin || this.options.crossOrigin === "") && (i.crossOrigin = this.options.crossOrigin === !0 ? "" : this.options.crossOrigin), typeof this.options.referrerPolicy == "string" && (i.referrerPolicy = this.options.referrerPolicy), i.alt = "", i.src = this.getTileUrl(t), i;
        },
        // @section Extension methods
        // @uninheritable
        // Layers extending `TileLayer` might reimplement the following method.
        // @method getTileUrl(coords: Object): String
        // Called only internally, returns the URL for a tile given its coordinates.
        // Classes extending `TileLayer` can override this function to provide custom tile URL naming schemes.
        getTileUrl: function(t) {
          var e = {
            r: b.retina ? "@2x" : "",
            s: this._getSubdomain(t),
            x: t.x,
            y: t.y,
            z: this._getZoomForUrl()
          };
          if (this._map && !this._map.options.crs.infinite) {
            var i = this._globalTileRange.max.y - t.y;
            this.options.tms && (e.y = i), e["-y"] = i;
          }
          return Bi(this._url, K(e, this.options));
        },
        _tileOnLoad: function(t, e) {
          b.ielt9 ? setTimeout(U(t, this, null, e), 0) : t(null, e);
        },
        _tileOnError: function(t, e, i) {
          var o = this.options.errorTileUrl;
          o && e.getAttribute("src") !== o && (e.src = o), t(i, e);
        },
        _onTileRemove: function(t) {
          t.tile.onload = null;
        },
        _getZoomForUrl: function() {
          var t = this._tileZoom, e = this.options.maxZoom, i = this.options.zoomReverse, o = this.options.zoomOffset;
          return i && (t = e - t), t + o;
        },
        _getSubdomain: function(t) {
          var e = Math.abs(t.x + t.y) % this.options.subdomains.length;
          return this.options.subdomains[e];
        },
        // stops loading all tiles in the background layer
        _abortLoading: function() {
          var t, e;
          for (t in this._tiles)
            if (this._tiles[t].coords.z !== this._tileZoom && (e = this._tiles[t].el, e.onload = st, e.onerror = st, !e.complete)) {
              e.src = Ae;
              var i = this._tiles[t].coords;
              ut(e), delete this._tiles[t], this.fire("tileabort", {
                tile: e,
                coords: i
              });
            }
        },
        _removeTile: function(t) {
          var e = this._tiles[t];
          if (e)
            return e.el.setAttribute("src", Ae), zi.prototype._removeTile.call(this, t);
        },
        _tileReady: function(t, e, i) {
          if (!(!this._map || i && i.getAttribute("src") === Ae))
            return zi.prototype._tileReady.call(this, t, e, i);
        }
      });
      function to(t, e) {
        return new oi(t, e);
      }
      var eo = oi.extend({
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
          var i = K({}, this.defaultWmsParams);
          for (var o in e)
            o in this.options || (i[o] = e[o]);
          e = at(this, e);
          var a = e.detectRetina && b.retina ? 2 : 1, r = this.getTileSize();
          i.width = r.x * a, i.height = r.y * a, this.wmsParams = i;
        },
        onAdd: function(t) {
          this._crs = this.options.crs || t.options.crs, this._wmsVersion = parseFloat(this.wmsParams.version);
          var e = this._wmsVersion >= 1.3 ? "crs" : "srs";
          this.wmsParams[e] = this._crs.code, oi.prototype.onAdd.call(this, t);
        },
        getTileUrl: function(t) {
          var e = this._tileCoordsToNwSe(t), i = this._crs, o = nt(i.project(e[0]), i.project(e[1])), a = o.min, r = o.max, u = (this._wmsVersion >= 1.3 && this._crs === qn ? [a.y, a.x, r.y, r.x] : [a.x, a.y, r.x, r.y]).join(","), d = oi.prototype.getTileUrl.call(this, t);
          return d + Zi(this.wmsParams, d, this.options.uppercase) + (this.options.uppercase ? "&BBOX=" : "&bbox=") + u;
        },
        // @method setParams(params: Object, noRedraw?: Boolean): this
        // Merges an object with the new parameters and re-requests tiles on the current screen (unless `noRedraw` was set to true).
        setParams: function(t, e) {
          return K(this.wmsParams, t), e || this.redraw(), this;
        }
      });
      function ts(t, e) {
        return new eo(t, e);
      }
      oi.WMS = eo, to.wms = ts;
      var de = Kt.extend({
        // @section
        // @aka Renderer options
        options: {
          // @option padding: Number = 0.1
          // How much to extend the clip area around the map view (relative to its size)
          // e.g. 0.1 would be 10% of map view in each direction
          padding: 0.1
        },
        initialize: function(t) {
          at(this, t), W(this), this._layers = this._layers || {};
        },
        onAdd: function() {
          this._container || (this._initContainer(), B(this._container, "leaflet-zoom-animated")), this.getPane().appendChild(this._container), this._update(), this.on("update", this._updatePaths, this);
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
          var i = this._map.getZoomScale(e, this._zoom), o = this._map.getSize().multiplyBy(0.5 + this.options.padding), a = this._map.project(this._center, e), r = o.multiplyBy(-i).add(a).subtract(this._map._getNewPixelOrigin(t, e));
          b.any3d ? p(this._container, r, i) : dt(this._container, r);
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
          this._bounds = new et(i, i.add(e.multiplyBy(1 + t * 2)).round()), this._center = this._map.getCenter(), this._zoom = this._map.getZoom();
        }
      }), io = de.extend({
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
          C(t, "mousemove", this._onMouseMove, this), C(t, "click dblclick mousedown mouseup contextmenu", this._onClick, this), C(t, "mouseout", this._handleMouseOut, this), t._leaflet_disable_events = !0, this._ctx = t.getContext("2d");
        },
        _destroyContainer: function() {
          Ot(this._redrawRequest), delete this._ctx, ut(this._container), it(this._container), delete this._container;
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
            var t = this._bounds, e = this._container, i = t.getSize(), o = b.retina ? 2 : 1;
            dt(e, t.min), e.width = o * i.x, e.height = o * i.y, e.style.width = i.x + "px", e.style.height = i.y + "px", b.retina && this._ctx.scale(2, 2), this._ctx.translate(-t.min.x, -t.min.y), this.fire("update");
          }
        },
        _reset: function() {
          de.prototype._reset.call(this), this._postponeUpdatePaths && (this._postponeUpdatePaths = !1, this._updatePaths());
        },
        _initPath: function(t) {
          this._updateDashArray(t), this._layers[W(t)] = t;
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
          var e = t._order, i = e.next, o = e.prev;
          i ? i.prev = o : this._drawLast = o, o ? o.next = i : this._drawFirst = i, delete t._order, delete this._layers[W(t)], this._requestRedraw(t);
        },
        _updatePath: function(t) {
          this._extendRedrawBounds(t), t._project(), t._update(), this._requestRedraw(t);
        },
        _updateStyle: function(t) {
          this._updateDashArray(t), this._requestRedraw(t);
        },
        _updateDashArray: function(t) {
          if (typeof t.options.dashArray == "string") {
            var e = t.options.dashArray.split(/[, ]+/), i = [], o, a;
            for (a = 0; a < e.length; a++) {
              if (o = Number(e[a]), isNaN(o))
                return;
              i.push(o);
            }
            t.options._dashArray = i;
          } else
            t.options._dashArray = t.options.dashArray;
        },
        _requestRedraw: function(t) {
          this._map && (this._extendRedrawBounds(t), this._redrawRequest = this._redrawRequest || Pt(this._redraw, this));
        },
        _extendRedrawBounds: function(t) {
          if (t._pxBounds) {
            var e = (t.options.weight || 0) + 1;
            this._redrawBounds = this._redrawBounds || new et(), this._redrawBounds.extend(t._pxBounds.min.subtract([e, e])), this._redrawBounds.extend(t._pxBounds.max.add([e, e]));
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
          for (var o = this._drawFirst; o; o = o.next)
            t = o.layer, (!e || t._pxBounds && t._pxBounds.intersects(e)) && t._updatePath();
          this._drawing = !1, this._ctx.restore();
        },
        _updatePoly: function(t, e) {
          if (this._drawing) {
            var i, o, a, r, u = t._parts, d = u.length, c = this._ctx;
            if (d) {
              for (c.beginPath(), i = 0; i < d; i++) {
                for (o = 0, a = u[i].length; o < a; o++)
                  r = u[i][o], c[o ? "lineTo" : "moveTo"](r.x, r.y);
                e && c.closePath();
              }
              this._fillStroke(c, t);
            }
          }
        },
        _updateCircle: function(t) {
          if (!(!this._drawing || t._empty())) {
            var e = t._point, i = this._ctx, o = Math.max(Math.round(t._radius), 1), a = (Math.max(Math.round(t._radiusY), 1) || o) / o;
            a !== 1 && (i.save(), i.scale(1, a)), i.beginPath(), i.arc(e.x, e.y / a, o, 0, Math.PI * 2, !1), a !== 1 && i.restore(), this._fillStroke(i, t);
          }
        },
        _fillStroke: function(t, e) {
          var i = e.options;
          i.fill && (t.globalAlpha = i.fillOpacity, t.fillStyle = i.fillColor || i.color, t.fill(i.fillRule || "evenodd")), i.stroke && i.weight !== 0 && (t.setLineDash && t.setLineDash(e.options && e.options._dashArray || []), t.globalAlpha = i.opacity, t.lineWidth = i.weight, t.strokeStyle = i.color, t.lineCap = i.lineCap, t.lineJoin = i.lineJoin, t.stroke());
        },
        // Canvas obviously doesn't have mouse events for individual drawn objects,
        // so we emulate that by calculating what's under the mouse on mousemove/click manually
        _onClick: function(t) {
          for (var e = this._map.mouseEventToLayerPoint(t), i, o, a = this._drawFirst; a; a = a.next)
            i = a.layer, i.options.interactive && i._containsPoint(e) && (!(t.type === "click" || t.type === "preclick") || !this._map._draggableMoved(i)) && (o = i);
          this._fireEvent(o ? [o] : !1, t);
        },
        _onMouseMove: function(t) {
          if (!(!this._map || this._map.dragging.moving() || this._map._animatingZoom)) {
            var e = this._map.mouseEventToLayerPoint(t);
            this._handleMouseHover(t, e);
          }
        },
        _handleMouseOut: function(t) {
          var e = this._hoveredLayer;
          e && (rt(this._container, "leaflet-interactive"), this._fireEvent([e], t, "mouseout"), this._hoveredLayer = null, this._mouseHoverThrottled = !1);
        },
        _handleMouseHover: function(t, e) {
          if (!this._mouseHoverThrottled) {
            for (var i, o, a = this._drawFirst; a; a = a.next)
              i = a.layer, i.options.interactive && i._containsPoint(e) && (o = i);
            o !== this._hoveredLayer && (this._handleMouseOut(t), o && (B(this._container, "leaflet-interactive"), this._fireEvent([o], t, "mouseover"), this._hoveredLayer = o)), this._fireEvent(this._hoveredLayer ? [this._hoveredLayer] : !1, t), this._mouseHoverThrottled = !0, setTimeout(U(function() {
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
            var i = e.next, o = e.prev;
            if (i)
              i.prev = o;
            else
              return;
            o ? o.next = i : i && (this._drawFirst = i), e.prev = this._drawLast, this._drawLast.next = e, e.next = null, this._drawLast = e, this._requestRedraw(t);
          }
        },
        _bringToBack: function(t) {
          var e = t._order;
          if (e) {
            var i = e.next, o = e.prev;
            if (o)
              o.next = i;
            else
              return;
            i ? i.prev = o : o && (this._drawLast = o), e.prev = null, e.next = this._drawFirst, this._drawFirst.prev = e, this._drawFirst = e, this._requestRedraw(t);
          }
        }
      });
      function no(t) {
        return b.canvas ? new io(t) : null;
      }
      var Oi = (function() {
        try {
          return document.namespaces.add("lvml", "urn:schemas-microsoft-com:vml"), function(t) {
            return document.createElement("<lvml:" + t + ' class="lvml">');
          };
        } catch {
        }
        return function(t) {
          return document.createElement("<" + t + ' xmlns="urn:schemas-microsoft.com:vml" class="lvml">');
        };
      })(), es = {
        _initContainer: function() {
          this._container = G("div", "leaflet-vml-container");
        },
        _update: function() {
          this._map._animatingZoom || (de.prototype._update.call(this), this.fire("update"));
        },
        _initPath: function(t) {
          var e = t._container = Oi("shape");
          B(e, "leaflet-vml-shape " + (this.options.className || "")), e.coordsize = "1 1", t._path = Oi("path"), e.appendChild(t._path), this._updateStyle(t), this._layers[W(t)] = t;
        },
        _addPath: function(t) {
          var e = t._container;
          this._container.appendChild(e), t.options.interactive && t.addInteractiveTarget(e);
        },
        _removePath: function(t) {
          var e = t._container;
          ut(e), t.removeInteractiveTarget(e), delete this._layers[W(t)];
        },
        _updateStyle: function(t) {
          var e = t._stroke, i = t._fill, o = t.options, a = t._container;
          a.stroked = !!o.stroke, a.filled = !!o.fill, o.stroke ? (e || (e = t._stroke = Oi("stroke")), a.appendChild(e), e.weight = o.weight + "px", e.color = o.color, e.opacity = o.opacity, o.dashArray ? e.dashStyle = Dt(o.dashArray) ? o.dashArray.join(" ") : o.dashArray.replace(/( *, *)/g, " ") : e.dashStyle = "", e.endcap = o.lineCap.replace("butt", "flat"), e.joinstyle = o.lineJoin) : e && (a.removeChild(e), t._stroke = null), o.fill ? (i || (i = t._fill = Oi("fill")), a.appendChild(i), i.color = o.fillColor || o.color, i.opacity = o.fillOpacity) : i && (a.removeChild(i), t._fill = null);
        },
        _updateCircle: function(t) {
          var e = t._point.round(), i = Math.round(t._radius), o = Math.round(t._radiusY || i);
          this._setPath(t, t._empty() ? "M0 0" : "AL " + e.x + "," + e.y + " " + i + "," + o + " 0," + 65535 * 360);
        },
        _setPath: function(t, e) {
          t._path.v = e;
        },
        _bringToFront: function(t) {
          me(t._container);
        },
        _bringToBack: function(t) {
          ve(t._container);
        }
      }, on = b.vml ? Oi : Be, Ei = de.extend({
        _initContainer: function() {
          this._container = on("svg"), this._container.setAttribute("pointer-events", "none"), this._rootGroup = on("g"), this._container.appendChild(this._rootGroup);
        },
        _destroyContainer: function() {
          ut(this._container), it(this._container), delete this._container, delete this._rootGroup, delete this._svgSize;
        },
        _update: function() {
          if (!(this._map._animatingZoom && this._bounds)) {
            de.prototype._update.call(this);
            var t = this._bounds, e = t.getSize(), i = this._container;
            (!this._svgSize || !this._svgSize.equals(e)) && (this._svgSize = e, i.setAttribute("width", e.x), i.setAttribute("height", e.y)), dt(i, t.min), i.setAttribute("viewBox", [t.min.x, t.min.y, e.x, e.y].join(" ")), this.fire("update");
          }
        },
        // methods below are called by vector layers implementations
        _initPath: function(t) {
          var e = t._path = on("path");
          t.options.className && B(e, t.options.className), t.options.interactive && B(e, "leaflet-interactive"), this._updateStyle(t), this._layers[W(t)] = t;
        },
        _addPath: function(t) {
          this._rootGroup || this._initContainer(), this._rootGroup.appendChild(t._path), t.addInteractiveTarget(t._path);
        },
        _removePath: function(t) {
          ut(t._path), t.removeInteractiveTarget(t._path), delete this._layers[W(t)];
        },
        _updatePath: function(t) {
          t._project(), t._update();
        },
        _updateStyle: function(t) {
          var e = t._path, i = t.options;
          e && (i.stroke ? (e.setAttribute("stroke", i.color), e.setAttribute("stroke-opacity", i.opacity), e.setAttribute("stroke-width", i.weight), e.setAttribute("stroke-linecap", i.lineCap), e.setAttribute("stroke-linejoin", i.lineJoin), i.dashArray ? e.setAttribute("stroke-dasharray", i.dashArray) : e.removeAttribute("stroke-dasharray"), i.dashOffset ? e.setAttribute("stroke-dashoffset", i.dashOffset) : e.removeAttribute("stroke-dashoffset")) : e.setAttribute("stroke", "none"), i.fill ? (e.setAttribute("fill", i.fillColor || i.color), e.setAttribute("fill-opacity", i.fillOpacity), e.setAttribute("fill-rule", i.fillRule || "evenodd")) : e.setAttribute("fill", "none"));
        },
        _updatePoly: function(t, e) {
          this._setPath(t, Ri(t._parts, e));
        },
        _updateCircle: function(t) {
          var e = t._point, i = Math.max(Math.round(t._radius), 1), o = Math.max(Math.round(t._radiusY), 1) || i, a = "a" + i + "," + o + " 0 1,0 ", r = t._empty() ? "M0 0" : "M" + (e.x - i) + "," + e.y + a + i * 2 + ",0 " + a + -i * 2 + ",0 ";
          this._setPath(t, r);
        },
        _setPath: function(t, e) {
          t._path.setAttribute("d", e);
        },
        // SVG does not have the concept of zIndex so we resort to changing the DOM order of elements
        _bringToFront: function(t) {
          me(t._path);
        },
        _bringToBack: function(t) {
          ve(t._path);
        }
      });
      b.vml && Ei.include(es);
      function oo(t) {
        return b.svg || b.vml ? new Ei(t) : null;
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
          return this.options.preferCanvas && no(t) || oo(t);
        }
      });
      var so = ii.extend({
        initialize: function(t, e) {
          ii.prototype.initialize.call(this, this._boundsToLatLngs(t), e);
        },
        // @method setBounds(latLngBounds: LatLngBounds): this
        // Redraws the rectangle with the passed bounds.
        setBounds: function(t) {
          return this.setLatLngs(this._boundsToLatLngs(t));
        },
        _boundsToLatLngs: function(t) {
          return t = T(t), [
            t.getSouthWest(),
            t.getNorthWest(),
            t.getNorthEast(),
            t.getSouthEast()
          ];
        }
      });
      function is(t, e) {
        return new so(t, e);
      }
      Ei.create = on, Ei.pointsToPath = Ri, ue.geometryToLayer = Xi, ue.coordsToLatLng = Cn, ue.coordsToLatLngs = Yi, ue.latLngToCoords = Sn, ue.latLngsToCoords = Ji, ue.getFeature = ni, ue.asFeature = Qi, q.mergeOptions({
        // @option boxZoom: Boolean = true
        // Whether the map can be zoomed to a rectangular area specified by
        // dragging the mouse while pressing the shift key.
        boxZoom: !0
      });
      var ao = ee.extend({
        initialize: function(t) {
          this._map = t, this._container = t._container, this._pane = t._panes.overlayPane, this._resetStateTimeout = 0, t.on("unload", this._destroy, this);
        },
        addHooks: function() {
          C(this._container, "mousedown", this._onMouseDown, this);
        },
        removeHooks: function() {
          it(this._container, "mousedown", this._onMouseDown, this);
        },
        moved: function() {
          return this._moved;
        },
        _destroy: function() {
          ut(this._pane), delete this._pane;
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
          this._clearDeferredResetState(), this._resetState(), Ce(), Pi(), this._startPoint = this._map.mouseEventToContainerPoint(t), C(document, {
            contextmenu: ze,
            mousemove: this._onMouseMove,
            mouseup: this._onMouseUp,
            keydown: this._onKeyDown
          }, this);
        },
        _onMouseMove: function(t) {
          this._moved || (this._moved = !0, this._box = G("div", "leaflet-zoom-box", this._container), B(this._container, "leaflet-crosshair"), this._map.fire("boxzoomstart")), this._point = this._map.mouseEventToContainerPoint(t);
          var e = new et(this._point, this._startPoint), i = e.getSize();
          dt(this._box, e.min), this._box.style.width = i.x + "px", this._box.style.height = i.y + "px";
        },
        _finish: function() {
          this._moved && (ut(this._box), rt(this._container, "leaflet-crosshair")), Se(), Ti(), it(document, {
            contextmenu: ze,
            mousemove: this._onMouseMove,
            mouseup: this._onMouseUp,
            keydown: this._onKeyDown
          }, this);
        },
        _onMouseUp: function(t) {
          if (!(t.which !== 1 && t.button !== 1) && (this._finish(), !!this._moved)) {
            this._clearDeferredResetState(), this._resetStateTimeout = setTimeout(U(this._resetState, this), 0);
            var e = new $(
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
      q.addInitHook("addHandler", "boxZoom", ao), q.mergeOptions({
        // @option doubleClickZoom: Boolean|String = true
        // Whether the map can be zoomed in by double clicking on it and
        // zoomed out by double clicking while holding shift. If passed
        // `'center'`, double-click zoom will zoom to the center of the
        //  view regardless of where the mouse was.
        doubleClickZoom: !0
      });
      var ro = ee.extend({
        addHooks: function() {
          this._map.on("dblclick", this._onDoubleClick, this);
        },
        removeHooks: function() {
          this._map.off("dblclick", this._onDoubleClick, this);
        },
        _onDoubleClick: function(t) {
          var e = this._map, i = e.getZoom(), o = e.options.zoomDelta, a = t.originalEvent.shiftKey ? i - o : i + o;
          e.options.doubleClickZoom === "center" ? e.setZoom(a) : e.setZoomAround(t.containerPoint, a);
        }
      });
      q.addInitHook("addHandler", "doubleClickZoom", ro), q.mergeOptions({
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
      var lo = ee.extend({
        addHooks: function() {
          if (!this._draggable) {
            var t = this._map;
            this._draggable = new ge(t._mapPane, t._container), this._draggable.on({
              dragstart: this._onDragStart,
              drag: this._onDrag,
              dragend: this._onDragEnd
            }, this), this._draggable.on("predrag", this._onPreDragLimit, this), t.options.worldCopyJump && (this._draggable.on("predrag", this._onPreDragWrap, this), t.on("zoomend", this._onZoomEnd, this), t.whenReady(this._onZoomEnd, this));
          }
          B(this._map._container, "leaflet-grab leaflet-touch-drag"), this._draggable.enable(), this._positions = [], this._times = [];
        },
        removeHooks: function() {
          rt(this._map._container, "leaflet-grab"), rt(this._map._container, "leaflet-touch-drag"), this._draggable.disable();
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
            var e = T(this._map.options.maxBounds);
            this._offsetLimit = nt(
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
          var t = this._worldWidth, e = Math.round(t / 2), i = this._initialWorldOffset, o = this._draggable._newPos.x, a = (o - e + i) % t + e - i, r = (o + e + i) % t - e - i, u = Math.abs(a + i) < Math.abs(r + i) ? a : r;
          this._draggable._absPos = this._draggable._newPos.clone(), this._draggable._newPos.x = u;
        },
        _onDragEnd: function(t) {
          var e = this._map, i = e.options, o = !i.inertia || t.noInertia || this._times.length < 2;
          if (e.fire("dragend", t), o)
            e.fire("moveend");
          else {
            this._prunePositions(+/* @__PURE__ */ new Date());
            var a = this._lastPos.subtract(this._positions[0]), r = (this._lastTime - this._times[0]) / 1e3, u = i.easeLinearity, d = a.multiplyBy(u / r), c = d.distanceTo([0, 0]), _ = Math.min(i.inertiaMaxSpeed, c), P = d.multiplyBy(_ / c), E = _ / (i.inertiaDeceleration * u), D = P.multiplyBy(-E / 2).round();
            !D.x && !D.y ? e.fire("moveend") : (D = e._limitOffset(D, e.options.maxBounds), Pt(function() {
              e.panBy(D, {
                duration: E,
                easeLinearity: u,
                noMoveStart: !0,
                animate: !0
              });
            }));
          }
        }
      });
      q.addInitHook("addHandler", "dragging", lo), q.mergeOptions({
        // @option keyboard: Boolean = true
        // Makes the map focusable and allows users to navigate the map with keyboard
        // arrows and `+`/`-` keys.
        keyboard: !0,
        // @option keyboardPanDelta: Number = 80
        // Amount of pixels to pan when pressing an arrow key.
        keyboardPanDelta: 80
      });
      var uo = ee.extend({
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
          t.tabIndex <= 0 && (t.tabIndex = "0"), C(t, {
            focus: this._onFocus,
            blur: this._onBlur,
            mousedown: this._onMouseDown
          }, this), this._map.on({
            focus: this._addHooks,
            blur: this._removeHooks
          }, this);
        },
        removeHooks: function() {
          this._removeHooks(), it(this._map._container, {
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
            var t = document.body, e = document.documentElement, i = t.scrollTop || e.scrollTop, o = t.scrollLeft || e.scrollLeft;
            this._map._container.focus(), window.scrollTo(o, i);
          }
        },
        _onFocus: function() {
          this._focused = !0, this._map.fire("focus");
        },
        _onBlur: function() {
          this._focused = !1, this._map.fire("blur");
        },
        _setPanDelta: function(t) {
          var e = this._panKeys = {}, i = this.keyCodes, o, a;
          for (o = 0, a = i.left.length; o < a; o++)
            e[i.left[o]] = [-1 * t, 0];
          for (o = 0, a = i.right.length; o < a; o++)
            e[i.right[o]] = [t, 0];
          for (o = 0, a = i.down.length; o < a; o++)
            e[i.down[o]] = [0, t];
          for (o = 0, a = i.up.length; o < a; o++)
            e[i.up[o]] = [0, -1 * t];
        },
        _setZoomDelta: function(t) {
          var e = this._zoomKeys = {}, i = this.keyCodes, o, a;
          for (o = 0, a = i.zoomIn.length; o < a; o++)
            e[i.zoomIn[o]] = t;
          for (o = 0, a = i.zoomOut.length; o < a; o++)
            e[i.zoomOut[o]] = -t;
        },
        _addHooks: function() {
          C(document, "keydown", this._onKeyDown, this);
        },
        _removeHooks: function() {
          it(document, "keydown", this._onKeyDown, this);
        },
        _onKeyDown: function(t) {
          if (!(t.altKey || t.ctrlKey || t.metaKey)) {
            var e = t.keyCode, i = this._map, o;
            if (e in this._panKeys) {
              if (!i._panAnim || !i._panAnim._inProgress)
                if (o = this._panKeys[e], t.shiftKey && (o = A(o).multiplyBy(3)), i.options.maxBounds && (o = i._limitOffset(A(o), i.options.maxBounds)), i.options.worldCopyJump) {
                  var a = i.wrapLatLng(i.unproject(i.project(i.getCenter()).add(o)));
                  i.panTo(a);
                } else
                  i.panBy(o);
            } else if (e in this._zoomKeys)
              i.setZoom(i.getZoom() + (t.shiftKey ? 3 : 1) * this._zoomKeys[e]);
            else if (e === 27 && i._popup && i._popup.options.closeOnEscapeKey)
              i.closePopup();
            else
              return;
            ze(t);
          }
        }
      });
      q.addInitHook("addHandler", "keyboard", uo), q.mergeOptions({
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
      var ho = ee.extend({
        addHooks: function() {
          C(this._map._container, "wheel", this._onWheelScroll, this), this._delta = 0;
        },
        removeHooks: function() {
          it(this._map._container, "wheel", this._onWheelScroll, this);
        },
        _onWheelScroll: function(t) {
          var e = In(t), i = this._map.options.wheelDebounceTime;
          this._delta += e, this._lastMousePos = this._map.mouseEventToContainerPoint(t), this._startTime || (this._startTime = +/* @__PURE__ */ new Date());
          var o = Math.max(i - (+/* @__PURE__ */ new Date() - this._startTime), 0);
          clearTimeout(this._timer), this._timer = setTimeout(U(this._performZoom, this), o), ze(t);
        },
        _performZoom: function() {
          var t = this._map, e = t.getZoom(), i = this._map.options.zoomSnap || 0;
          t._stop();
          var o = this._delta / (this._map.options.wheelPxPerZoomLevel * 4), a = 4 * Math.log(2 / (1 + Math.exp(-Math.abs(o)))) / Math.LN2, r = i ? Math.ceil(a / i) * i : a, u = t._limitZoom(e + (this._delta > 0 ? r : -r)) - e;
          this._delta = 0, this._startTime = null, u && (t.options.scrollWheelZoom === "center" ? t.setZoom(e + u) : t.setZoomAround(this._lastMousePos, e + u));
        }
      });
      q.addInitHook("addHandler", "scrollWheelZoom", ho);
      var ns = 600;
      q.mergeOptions({
        // @section Touch interaction options
        // @option tapHold: Boolean
        // Enables simulation of `contextmenu` event, default is `true` for mobile Safari.
        tapHold: b.touchNative && b.safari && b.mobile,
        // @option tapTolerance: Number = 15
        // The max number of pixels a user can shift his finger during touch
        // for it to be considered a valid tap.
        tapTolerance: 15
      });
      var co = ee.extend({
        addHooks: function() {
          C(this._map._container, "touchstart", this._onDown, this);
        },
        removeHooks: function() {
          it(this._map._container, "touchstart", this._onDown, this);
        },
        _onDown: function(t) {
          if (clearTimeout(this._holdTimeout), t.touches.length === 1) {
            var e = t.touches[0];
            this._startPos = this._newPos = new Z(e.clientX, e.clientY), this._holdTimeout = setTimeout(U(function() {
              this._cancel(), this._isTapValid() && (C(document, "touchend", Lt), C(document, "touchend touchcancel", this._cancelClickPrevent), this._simulateEvent("contextmenu", e));
            }, this), ns), C(document, "touchend touchcancel contextmenu", this._cancel, this), C(document, "touchmove", this._onMove, this);
          }
        },
        _cancelClickPrevent: function t() {
          it(document, "touchend", Lt), it(document, "touchend touchcancel", t);
        },
        _cancel: function() {
          clearTimeout(this._holdTimeout), it(document, "touchend touchcancel contextmenu", this._cancel, this), it(document, "touchmove", this._onMove, this);
        },
        _onMove: function(t) {
          var e = t.touches[0];
          this._newPos = new Z(e.clientX, e.clientY);
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
      q.addInitHook("addHandler", "tapHold", co), q.mergeOptions({
        // @section Touch interaction options
        // @option touchZoom: Boolean|String = *
        // Whether the map can be zoomed by touch-dragging with two fingers. If
        // passed `'center'`, it will zoom to the center of the view regardless of
        // where the touch events (fingers) were. Enabled for touch-capable web
        // browsers.
        touchZoom: b.touch,
        // @option bounceAtZoomLimits: Boolean = true
        // Set it to false if you don't want the map to zoom beyond min/max zoom
        // and then bounce back when pinch-zooming.
        bounceAtZoomLimits: !0
      });
      var fo = ee.extend({
        addHooks: function() {
          B(this._map._container, "leaflet-touch-zoom"), C(this._map._container, "touchstart", this._onTouchStart, this);
        },
        removeHooks: function() {
          rt(this._map._container, "leaflet-touch-zoom"), it(this._map._container, "touchstart", this._onTouchStart, this);
        },
        _onTouchStart: function(t) {
          var e = this._map;
          if (!(!t.touches || t.touches.length !== 2 || e._animatingZoom || this._zooming)) {
            var i = e.mouseEventToContainerPoint(t.touches[0]), o = e.mouseEventToContainerPoint(t.touches[1]);
            this._centerPoint = e.getSize()._divideBy(2), this._startLatLng = e.containerPointToLatLng(this._centerPoint), e.options.touchZoom !== "center" && (this._pinchStartLatLng = e.containerPointToLatLng(i.add(o)._divideBy(2))), this._startDist = i.distanceTo(o), this._startZoom = e.getZoom(), this._moved = !1, this._zooming = !0, e._stop(), C(document, "touchmove", this._onTouchMove, this), C(document, "touchend touchcancel", this._onTouchEnd, this), Lt(t);
          }
        },
        _onTouchMove: function(t) {
          if (!(!t.touches || t.touches.length !== 2 || !this._zooming)) {
            var e = this._map, i = e.mouseEventToContainerPoint(t.touches[0]), o = e.mouseEventToContainerPoint(t.touches[1]), a = i.distanceTo(o) / this._startDist;
            if (this._zoom = e.getScaleZoom(a, this._startZoom), !e.options.bounceAtZoomLimits && (this._zoom < e.getMinZoom() && a < 1 || this._zoom > e.getMaxZoom() && a > 1) && (this._zoom = e._limitZoom(this._zoom)), e.options.touchZoom === "center") {
              if (this._center = this._startLatLng, a === 1)
                return;
            } else {
              var r = i._add(o)._divideBy(2)._subtract(this._centerPoint);
              if (a === 1 && r.x === 0 && r.y === 0)
                return;
              this._center = e.unproject(e.project(this._pinchStartLatLng, this._zoom).subtract(r), this._zoom);
            }
            this._moved || (e._moveStart(!0, !1), this._moved = !0), Ot(this._animRequest);
            var u = U(e._move, e, this._center, this._zoom, { pinch: !0, round: !1 }, void 0);
            this._animRequest = Pt(u, this, !0), Lt(t);
          }
        },
        _onTouchEnd: function() {
          if (!this._moved || !this._zooming) {
            this._zooming = !1;
            return;
          }
          this._zooming = !1, Ot(this._animRequest), it(document, "touchmove", this._onTouchMove, this), it(document, "touchend touchcancel", this._onTouchEnd, this), this._map.options.zoomAnimation ? this._map._animateZoom(this._center, this._map._limitZoom(this._zoom), !0, this._map.options.zoomSnap) : this._map._resetView(this._center, this._map._limitZoom(this._zoom));
        }
      });
      q.addInitHook("addHandler", "touchZoom", fo), q.BoxZoom = ao, q.DoubleClickZoom = ro, q.Drag = lo, q.Keyboard = uo, q.ScrollWheelZoom = ho, q.TapHold = co, q.TouchZoom = fo, g.Bounds = et, g.Browser = b, g.CRS = Rt, g.Canvas = io, g.Circle = kn, g.CircleMarker = $i, g.Class = tt, g.Control = qt, g.DivIcon = Qn, g.DivOverlay = ie, g.DomEvent = wo, g.DomUtil = J, g.Draggable = ge, g.Evented = Et, g.FeatureGroup = re, g.GeoJSON = ue, g.GridLayer = zi, g.Handler = ee, g.Icon = ei, g.ImageOverlay = tn, g.LatLng = Y, g.LatLngBounds = $, g.Layer = Kt, g.LayerGroup = ti, g.LineUtil = Io, g.Map = q, g.Marker = Ki, g.Mixin = So, g.Path = ye, g.Point = Z, g.PolyUtil = Mo, g.Polygon = ii, g.Polyline = le, g.Popup = en, g.PosAnimation = Zn, g.Projection = Zo, g.Rectangle = so, g.Renderer = de, g.SVG = Ei, g.SVGOverlay = Jn, g.TileLayer = oi, g.Tooltip = nn, g.Transformation = Vt, g.Util = rn, g.VideoOverlay = Yn, g.bind = U, g.bounds = nt, g.canvas = no, g.circle = Ho, g.circleMarker = Fo, g.control = Ci, g.divIcon = Jo, g.extend = K, g.featureGroup = Ro, g.geoJSON = Xn, g.geoJson = jo, g.gridLayer = Qo, g.icon = Vo, g.imageOverlay = qo, g.latLng = F, g.latLngBounds = T, g.layerGroup = Do, g.map = xo, g.marker = Uo, g.point = A, g.polygon = Go, g.polyline = Wo, g.popup = Xo, g.rectangle = is, g.setOptions = at, g.stamp = W, g.svg = oo, g.svgOverlay = $o, g.tileLayer = to, g.tooltip = Yo, g.transformation = we, g.version = It, g.videoOverlay = Ko;
      var os = window.L;
      g.noConflict = function() {
        return window.L = os, this;
      }, window.L = g;
    }));
  })(Ii, Ii.exports)), Ii.exports;
}
var Ss = Cs();
const M = /* @__PURE__ */ Ts(Ss), Ms = { class: "hero" }, zs = { class: "hero-main" }, Os = { class: "hero-actions" }, Es = ["disabled"], As = ["disabled"], Is = ["disabled"], Zs = { class: "state-row" }, Bs = { class: "pill soft" }, Ns = { class: "pill soft" }, Ds = { class: "pill soft" }, Rs = {
  key: 0,
  class: "banner err"
}, Vs = {
  key: 1,
  class: "banner ok"
}, Us = {
  class: "tabs",
  "aria-label": "视图"
}, Fs = ["onClick"], Hs = { class: "tab-ic" }, Ws = { class: "panel" }, Gs = { class: "section-head" }, js = { class: "head-actions" }, qs = ["disabled"], Ks = ["disabled"], $s = { class: "card" }, Xs = { class: "settings-grid" }, Ys = { class: "pfield" }, Js = { class: "pfield" }, Qs = { class: "pfield" }, ta = { class: "pfield" }, ea = {
  key: 0,
  class: "card"
}, ia = { class: "count-pill ok" }, na = { class: "settings-grid" }, oa = { class: "hint" }, sa = {
  key: 0,
  class: "hint"
}, aa = { class: "settings-grid" }, ra = { class: "settings-grid" }, la = { class: "pdetails" }, ua = {
  class: "settings-grid",
  style: { "margin-top": "10px" }
}, da = { class: "settings-grid" }, ha = ["value"], ca = {
  key: 2,
  class: "hint"
}, fa = { class: "settings-grid" }, pa = ["value"], _a = {
  key: 4,
  class: "hint"
}, ma = { class: "settings-grid" }, va = ["value"], ga = {
  key: 6,
  class: "hint"
}, ya = { class: "panel" }, ba = { class: "card" }, wa = { class: "settings-grid" }, xa = { class: "cog-metric" }, La = { class: "cog-metric" }, Pa = { class: "cog-metric" }, Ta = { class: "cog-metric" }, ka = { class: "cog-metric" }, Ca = { class: "cog-metric" }, Sa = {
  key: 0,
  class: "hint"
}, Ma = {
  key: 1,
  class: "hint"
}, za = {
  key: 2,
  class: "hint"
}, Oa = { style: { display: "flex", gap: "12px", "align-items": "center", "flex-wrap": "wrap", "margin-top": "10px" } }, Ea = { class: "sw" }, Aa = ["disabled"], Ia = { class: "card" }, Za = {
  key: 0,
  class: "empty"
}, Ba = {
  key: 1,
  class: "settings-grid"
}, Na = { class: "cog-metric" }, Da = { class: "cog-metric" }, Ra = { class: "cog-metric" }, Va = { class: "cog-metric" }, Ua = { class: "cog-metric" }, Fa = { class: "cog-metric" }, Ha = { class: "cog-metric" }, Wa = { class: "cog-metric" }, Ga = { class: "cog-metric" }, ja = { class: "cog-metric" }, qa = { class: "cog-metric" }, Ka = { class: "cog-metric" }, $a = { class: "cog-metric" }, Xa = { class: "cog-metric" }, Ya = { class: "cog-metric" }, Ja = { class: "cog-metric" }, Qa = { class: "cog-metric" }, tr = { class: "cog-metric" }, er = { class: "cog-metric" }, ir = { class: "cog-metric" }, nr = { class: "cog-metric" }, or = { class: "cog-metric" }, sr = { class: "cog-metric" }, ar = { class: "cog-metric" }, rr = { class: "cog-metric" }, lr = { class: "cog-metric" }, ur = { class: "cog-metric" }, dr = { class: "cog-metric" }, hr = { class: "cog-metric" }, cr = { class: "cog-metric" }, fr = { class: "cog-metric" }, pr = { class: "cog-metric" }, _r = { class: "cog-metric" }, mr = { class: "cog-metric" }, vr = {
  key: 0,
  class: "cog-metric"
}, gr = {
  key: 1,
  class: "cog-metric"
}, yr = {
  key: 2,
  class: "cog-metric"
}, br = {
  key: 3,
  class: "cog-metric"
}, wr = {
  key: 4,
  class: "cog-metric"
}, xr = {
  key: 5,
  class: "cog-metric"
}, Lr = {
  key: 6,
  class: "cog-metric"
}, Pr = {
  key: 7,
  class: "cog-metric"
}, Tr = {
  key: 8,
  class: "cog-metric"
}, kr = {
  key: 9,
  class: "cog-metric warn"
}, Cr = { class: "cog-metric" }, Sr = { class: "cog-metric" }, Mr = { class: "cog-metric" }, zr = {
  key: 0,
  class: "cog-metric"
}, Or = {
  key: 2,
  class: "hint"
}, Er = {
  key: 3,
  class: "hint"
}, Ar = {
  key: 4,
  class: "hint"
}, Ir = {
  key: 5,
  class: "hint"
}, Zr = {
  key: 6,
  class: "hint"
}, Br = {
  key: 7,
  class: "som-channels"
}, Nr = { class: "som-chan-name" }, Dr = { class: "som-chan-bar" }, Rr = { class: "som-chan-val" }, Vr = {
  key: 0,
  class: "hint"
}, Ur = { class: "card" }, Fr = { class: "switches" }, Hr = { class: "sw" }, Wr = { class: "sw" }, Gr = { class: "sw" }, jr = { class: "sw" }, qr = { class: "sw" }, Kr = { class: "sw" }, $r = { class: "card" }, Xr = { class: "preset-row" }, Yr = ["onClick"], Jr = { class: "grid2" }, Qr = { class: "card" }, tl = { class: "settings-grid" }, el = { class: "switches" }, il = { class: "sw" }, nl = { class: "sw" }, ol = { class: "sw" }, sl = { class: "sw" }, al = { class: "sw" }, rl = { class: "card" }, ll = { class: "settings-grid" }, ul = { class: "sw" }, dl = { class: "sw" }, hl = { class: "sw" }, cl = { class: "card" }, fl = { class: "settings-grid" }, pl = { class: "sw" }, _l = { class: "card" }, ml = { class: "settings-grid" }, vl = { class: "sw" }, gl = { class: "card" }, yl = { class: "settings-grid" }, bl = { class: "sw" }, wl = { class: "card" }, xl = { class: "sw" }, Ll = { class: "settings-grid" }, Pl = { class: "card" }, Tl = { class: "sw" }, kl = { class: "settings-grid" }, Cl = { class: "card" }, Sl = { class: "sw" }, Ml = { class: "settings-grid" }, zl = { class: "card" }, Ol = { class: "switches" }, El = { class: "sw" }, Al = { class: "sw" }, Il = { class: "sw" }, Zl = { class: "sw" }, Bl = { class: "panel" }, Nl = { class: "card" }, Dl = { class: "settings-grid" }, Rl = { class: "card" }, Vl = { class: "world-field" }, Ul = { class: "card" }, Fl = { class: "settings-grid" }, Hl = { class: "world-field" }, Wl = { class: "world-field" }, Gl = { class: "world-field" }, jl = { class: "world-actions" }, ql = ["disabled"], Kl = ["disabled"], $l = { class: "card" }, Xl = { class: "wm-head" }, Yl = { class: "count-pill" }, Jl = {
  key: 0,
  class: "wm-place"
}, Ql = {
  key: 0,
  class: "hint wm-premise"
}, tu = { class: "wm-map-wrap" }, eu = {
  key: 0,
  class: "wm-offline"
}, iu = {
  key: 1,
  class: "wm-compass",
  "aria-hidden": "true"
}, nu = {
  key: 1,
  class: "empty"
}, ou = {
  key: 2,
  class: "wm-legend"
}, su = {
  key: 3,
  class: "wm-routes"
}, au = {
  key: 0,
  class: "wm-routes-col"
}, ru = {
  key: 1,
  class: "wm-routes-col"
}, lu = { class: "card" }, uu = { class: "wm-head" }, du = { class: "count-pill" }, hu = { class: "feed" }, cu = { class: "meta" }, fu = {
  key: 0,
  class: "empty"
}, pu = { class: "panel" }, _u = { class: "section-head" }, mu = { class: "head-actions" }, vu = ["disabled"], gu = { class: "card" }, yu = { class: "count-pill" }, bu = {
  key: 0,
  class: "empty"
}, wu = {
  key: 1,
  class: "feed"
}, xu = { class: "meta" }, Lu = { class: "meta" }, Pu = { class: "panel" }, Tu = { class: "card" }, ku = { class: "count-pill" }, Cu = { class: "feed" }, Su = { class: "meta" }, Mu = {
  key: 0,
  class: "empty"
}, zu = { class: "grid2" }, Ou = { class: "card" }, Eu = { class: "feed" }, Au = { class: "meta" }, Iu = { class: "meta" }, Zu = { class: "meta" }, Bu = {
  key: 0,
  class: "empty"
}, Nu = { class: "card" }, Du = { class: "feed" }, Ru = { class: "meta" }, Vu = {
  key: 0,
  class: "empty"
}, Uu = { class: "section" }, Fu = { class: "grid2" }, Hu = { class: "card" }, Wu = { style: { "margin-top": "14px", display: "flex", gap: "10px", "flex-wrap": "wrap" } }, Gu = ["disabled"], ju = "life_adapters", qu = "https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}", Ku = /* @__PURE__ */ fs({
  __name: "CompanionPage",
  setup(be) {
    const { confirm: Ee } = Ls(), g = Q({ settings: {}, cognition: null }), It = Q(!1), K = Q(""), Xt = Q(""), U = Q("cognition"), ri = Q(null), W = [
      { key: "cognition", i: "01", label: "认知", icon: "◉" },
      { key: "persona", i: "02", label: "人设", icon: "✎" },
      { key: "world", i: "03", label: "世界", icon: "✦" },
      { key: "adapters", i: "04", label: "消息平台", icon: "✉" },
      { key: "state", i: "05", label: "状态", icon: "☺" }
    ];
    function wt(f) {
      Xt.value = f, setTimeout(() => {
        Xt.value === f && (Xt.value = "");
      }, 2500);
    }
    function ce() {
      const f = `/settings?tab=${ju}`;
      window.location.href = f;
    }
    async function st(f = 0) {
      It.value = !0, K.value = "";
      try {
        g.value = await gs("/api/life/companion"), gn(), It.value = !1;
      } catch (n) {
        if (f < 4)
          return await ys(1500), st(f + 1);
        K.value = go(n), It.value = !1;
      }
    }
    async function mt(f, n) {
      try {
        const l = await bs(f, n);
        return await st(), l;
      } catch (l) {
        return K.value = go(l), null;
      }
    }
    function li(f) {
      U.value = f;
      const n = matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", l = ri.value;
      l ? l.scrollTo({ top: 0, behavior: n }) : window.scrollTo({ top: 0, behavior: n });
    }
    ai(U, (f) => {
      f === "adapters" && G();
    });
    const Wt = {
      cog_enabled: "1",
      cog_lite_mode: "0",
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
      cog_tsundere_enabled: "0",
      cog_tsundere_type: "经典傲娇",
      cog_personadyn_enabled: "0",
      cog_personadyn_type: "正常/安全型",
      cog_personadyn_gender: "未指定",
      // memory & consolidation. On by default — they are what makes lived
      // experience leave a trace; turn one off to ablate it.
      cog_memory_encode: "1",
      cog_sleep_replay: "1",
      cog_memory_reconsolidate: "1",
      cog_cls_interleave: "1"
    }, at = [
      "cog_enabled",
      "cog_lite_mode",
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
      "cog_tsundere_enabled",
      "cog_personadyn_enabled",
      "cog_memory_encode",
      "cog_sleep_replay",
      "cog_memory_reconsolidate",
      "cog_cls_interleave"
    ], Zi = ["cog_affect_profile", "cog_language_framing", "cog_attachment_type", "cog_tsundere_type", "cog_personadyn_type", "cog_personadyn_gender"], an = ["独占型", "依存型", "妄想型", "监视型", "自伤型", "排除型"], Bi = ["经典傲娇", "高冷傲娇", "暴躁傲娇", "迁就傲娇"], ui = [
      { label: "ACG 经典", keys: [
        "正常/安全型",
        "傲娇型",
        "病娇型",
        "傲娇转病娇",
        "三无/高冷型",
        "天然呆型",
        "温柔/治愈型",
        "元气/活泼型",
        "腹黑型",
        "忠犬型",
        "依赖型",
        "回避型",
        "控制/女王型",
        "小恶魔型",
        "暴躁型",
        "理性/冷静型",
        "自卑/忧郁型",
        "混沌/疯狂型"
      ] },
      { label: "依恋与关系", keys: ["安全型", "焦虑型", "恐惧型", "混乱型", "讨好型", "拯救者", "受害者", "迫害者", "反依赖型", "共依型"] },
      { label: "九型人格", keys: ["1 完美主义", "2 助人者", "3 成就者", "4 自我型", "5 观察者", "6 忠诚者", "7 享乐者", "8 挑战者", "9 和平者"] },
      { label: "DISC", keys: ["D 支配", "I 影响", "S 稳健", "C 谨慎"] },
      { label: "社会角色", keys: ["领导者", "追随者", "照顾者", "隐士", "殉道者", "叛逆者", "改革者", "保守者", "投机者", "调停者", "破坏者", "观察者", "局外人"] },
      { label: "动机与价值", keys: ["成就型", "权力型", "归属型", "安全型（动机）", "探索型", "秩序型", "审美型", "利他型", "利己型", "享乐型", "自我实现型"] },
      { label: "认知风格", keys: ["分析型", "直觉型", "系统型", "发散型", "聚合型", "场依存", "场独立", "冲动型", "反思型", "反刍型", "灾难化型", "乐观型", "悲观型"] },
      { label: "女性 / 中性 ACG", keys: ["御姐", "病弱", "中二", "无口", "毒舌", "弱气", "强气", "黑化", "暴走", "地雷系", "阳角", "阴角", "社恐", "社牛", "纯爱", "修罗场"] },
      { label: "男性原型", keys: ["安全男", "焦虑男", "回避男", "恐惧男", "混乱男", "讨好男", "拯救者男", "控制男", "反依赖男", "共依男", "依赖男", "霸总", "暖男", "忠犬男", "狼狗", "奶狗", "爹系", "少年", "大叔", "硬汉", "草食男", "肉食男", "海王", "渣男", "直男", "凤凰男", "妈宝男", "巨婴", "软饭男", "接盘侠", "备胎", "舔狗", "工具人", "老实人", "老好人", "暴君", "帝王", "将军", "谋士", "骑士", "浪子", "隐士", "侠客", "反派", "病娇男", "傲娇男", "腹黑男", "中二男", "宅男", "社恐男", "社牛男", "忧郁男", "艺术男", "理工男", "体育男", "金融男", "文艺男", "禁欲系", "清冷男", "疯批男", "病弱男", "黑化男", "龙傲天", "废柴", "逆袭男", "救世主", "殉道者男", "破坏者男", "观察者男", "三无男", "天然呆男", "小恶魔男", "元气男", "高冷男", "纯爱男", "修罗场男", "弱气男", "强气男"] }
    ], Ae = [...new Set(ui.flatMap((f) => f.keys))], Ie = ["未指定", "男性脚本", "女性脚本", "中性", "高传统男性", "低传统男性", "高传统女性", "女性主义"], Ni = ["typical", "depression", "anxiety", "bpd", "alexithymia"], Di = [
      "independent",
      "interchanging",
      "cognitive_determinism",
      "weak_whorf",
      "thinking_for_speaking",
      "radical_connectionism",
      "determinism"
    ], di = ["0 · egocentric", "1 · subjective", "2 · self-reflective", "3 · mutual", "4 · societal-symbolic"], hi = X({
      get: () => `${Number(m.value.cog_social_stage ?? 2)} · ${["egocentric", "subjective", "self-reflective", "mutual", "societal-symbolic"][Number(m.value.cog_social_stage ?? 2)] || "self-reflective"}`,
      set: (f) => {
        m.value.cog_social_stage = Number(String(f).split("·")[0].trim());
      }
    });
    function Pt(f) {
      return String(g.value.settings?.[f] ?? Wt[f] ?? "");
    }
    function Ot() {
      const f = {};
      for (const [n, l] of Object.entries(Wt)) {
        const z = Pt(n) || l;
        f[n] = at.includes(n) ? z === "1" : Zi.includes(n) ? z : Number(z);
      }
      return f;
    }
    function rn() {
      const f = {};
      for (const [n, l] of Object.entries(Wt)) {
        const z = m.value[n];
        at.includes(n) ? f[n] = z ? "1" : "0" : f[n] = String(z ?? l);
      }
      return f;
    }
    const tt = X(() => g.value.cognition || null), Ze = X(() => tt.value?.last_control || null), yt = X(() => tt.value?.wave1 || null), Et = X(() => tt.value?.wave2 || null), Z = X(() => tt.value?.wave3 || null), ci = X(() => tt.value?.wave4a || null), A = X(() => tt.value?.wave4b || null), et = X(() => tt.value?.persona || null), nt = X(() => tt.value?.attachment || null), $ = X(() => tt.value?.tsundere || null), T = X(() => tt.value?.personadyn || null), Y = X(() => {
      const f = T.value?.big5;
      return f ? ["o_open", "c_conscientious", "e_extravert", "a_agreeable", "n_neurotic"].map((l) => N(f[l], 2)).join(" · ") : "—";
    }), F = X(() => {
      const f = T.value?.hexaco;
      return f ? ["h_honesty", "hex_e", "hex_x", "hex_a", "hex_c", "hex_o"].map((l) => N(f[l], 2)).join(" · ") : "—";
    });
    function Rt(f, n = 3) {
      return f ? Object.entries(f).filter(([, l]) => typeof l == "number").sort((l, z) => z[1] - l[1]).slice(0, n).map(([l, z]) => `${_i(l)} ${N(z, 2)}`) : [];
    }
    const Gt = X(() => Rt(T.value?.desires, 3)), fi = X(() => Rt(T.value?.emotions, 3)), pi = X(() => {
      const f = T.value?.learning?.theta_drift;
      return f ? Object.values(f).reduce((n, l) => n + Math.abs(l || 0), 0) : 0;
    }), Vt = X(() => Et.value?.episode || null), we = (f) => ({ euthymic: "平稳", subthreshold: "下滑中", episode: "低落发作" })[f] || "—", ft = X(() => tt.value?.life || null), Yt = Q(!1), Be = Q(!0);
    function Ri() {
      const f = ft.value?.born_at;
      if (!f) return "—";
      const n = Date.now() - new Date(f).getTime();
      if (!isFinite(n) || n < 0) return "—";
      const l = Math.floor(n / 864e5), z = Math.floor(n % 864e5 / 36e5);
      return l > 0 ? `${l} 天 ${z} 小时` : `${z} 小时`;
    }
    async function Ne() {
      Yt.value = !0;
      try {
        const f = await mt("life_start", { greet: Be.value });
        f && wt(f.greeting ? `她开始生活了：${f.greeting}` : "生命已开始：她开始有自己的生活了");
      } finally {
        Yt.value = !1;
      }
    }
    async function xe() {
      Yt.value = !0;
      try {
        await mt("life_stop", {}) && wt("已暂停：她不再主动思考，记忆与内心状态保留");
      } finally {
        Yt.value = !1;
      }
    }
    function ln(f, n) {
      Object.assign(m.value, f), _e().then(() => wt(`已套用并保存「${n}」`));
    }
    const Vi = [
      { label: "常规", fields: { cog_affect_enabled: !0, cog_affect_profile: "typical", cog_affect_threat: 0.2, cog_affect_reward: 1, cog_attachment_enabled: !1, cog_tsundere_enabled: !1, cog_personadyn_enabled: !1 } },
      { label: "抑郁倾向", fields: { cog_affect_enabled: !0, cog_affect_profile: "depression", cog_affect_threat: 0.45, cog_affect_reward: 0.7 } },
      { label: "傲娇", fields: { cog_tsundere_enabled: !0, cog_tsundere_type: "经典傲娇" } },
      { label: "人格动力学", fields: { cog_personadyn_enabled: !0, cog_personadyn_type: "傲娇型" } },
      { label: "病娇·独占", fields: { cog_affect_enabled: !0, cog_affect_profile: "depression", cog_attachment_enabled: !0, cog_attachment_type: "独占型" } },
      { label: "病娇·依存", fields: { cog_affect_enabled: !0, cog_attachment_enabled: !0, cog_attachment_type: "依存型" } },
      { label: "病娇·妄想", fields: { cog_affect_enabled: !0, cog_affect_profile: "depression", cog_attachment_enabled: !0, cog_attachment_type: "妄想型" } }
    ], De = X(() => tt.value?.wave2?.somatic_channels || null), _i = (f) => ({
      fatigue: "疲劳",
      pain: "疼痛",
      cardiorespiratory: "心慌",
      gastrointestinal: "胃肠",
      dizziness: "头晕",
      sleep: "睡眠"
    })[f] || f, Ui = (f) => Math.max(0.02, Math.min(1, Number(f))).toFixed(3), un = X(() => {
      const f = et.value?.evidence || {};
      return Object.entries(f).map(([n, l]) => `${n}(${l.join("、")})`).join("；");
    });
    function N(f, n = 3) {
      return f == null || f === "" ? "—" : Number(f).toFixed(n);
    }
    const fe = X(() => (g.value.timeline || []).filter((f) => f.topic === "世界").slice(0, 30)), Re = X(() => g.value.commitments || []), mi = X(() => g.value.user_model || []), Fi = X(() => Object.entries(g.value.values || {}).map(([f, n]) => ({ k: f, v: Number(n) })).sort((f, n) => Math.abs(n.v) - Math.abs(f.v)).slice(0, 20));
    function Ve(f) {
      try {
        const n = JSON.parse(f || "[]");
        return Array.isArray(n) ? n : [];
      } catch {
        return [];
      }
    }
    const m = Q({}), Ue = Q("off"), Hi = [{ value: "off", label: "关闭" }, { value: "texture", label: "纹理（只记录）" }, { value: "full", label: "完整（可主动提及）" }], pe = Q("fictional"), Le = Q(""), Fe = Q(""), Jt = Q(""), He = Q(""), We = Q(""), Pe = Q(""), Te = Q(""), Zt = Q(!1), Ge = Q(!1), dn = [{ value: "fictional", label: "虚构" }, { value: "real", label: "真实" }], jt = X(() => g.value.worldview || null), R = X(() => jt.value?.map || { locations: [], edges: [], actors: [], width: 1e3, height: 700, title: "" }), hn = X(() => jt.value?.actor_locations || {}), cn = ["home", "work", "shop", "food", "park", "transit", "other"], vi = { home: "家", work: "工作", shop: "商店", food: "餐饮", park: "公园", transit: "交通", other: "其他" }, Wi = { home: "#e07a5f", work: "#5b8def", shop: "#e0a23d", food: "#57a773", park: "#3faead", transit: "#8b6fd6", other: "#8a94a6" }, fn = X(() => cn.filter((f) => (R.value.locations || []).some((n) => (n.kind || "other") === f)));
    function Tt(f) {
      const n = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
      return String(f ?? "").replace(/[&<>"']/g, (l) => n[l]);
    }
    const je = Q(null), kt = Q(!1);
    let b = null, O = null, qe = "";
    const gi = ["#2b4250", "#33495a", "#2f4a44", "#3a4258", "#463f4f", "#3d4a3a", "#4a4436", "#39485c"], yi = ["#dfe4ea", "#d6dce4", "#e6eaf0", "#cfd7e0"];
    let ne = "";
    const oe = Q("city"), Bt = {};
    function Ke(f, n, l) {
      (Bt[f] || (Bt[f] = [])).push({ layer: n, base: l });
    }
    function Qt(f) {
      ne = ne === f ? "" : f;
      for (const [n, l] of Object.entries(Bt)) {
        const z = n === ne;
        for (const { layer: k, base: V } of l)
          k.setStyle && k.setStyle({ ...V, weight: (V.weight || 2) + (z ? 3.5 : 0), opacity: z ? 1 : V.opacity ?? 1 }), z && k.bringToFront && k.bringToFront();
      }
    }
    function pn() {
      ne = "", bi(!1);
    }
    function _n() {
      oe.value = oe.value === "city" ? "nation" : "city", bi(!1);
    }
    function $e() {
      return { w: R.value.width || 1e3, h: R.value.height || 700 };
    }
    function xt(f, n) {
      return [$e().h - n, f];
    }
    function Ut(f, n) {
      return M.divIcon({ className: "wm-route", html: `<span class="wm-route-inner" style="--c:${n}">${Tt(f)}</span>`, iconSize: [0, 0], iconAnchor: [0, 0] });
    }
    function Xe(f, n) {
      return M.divIcon({ className: "wm-route wm-minor", html: `<span class="wm-route-inner" style="--c:${n}">${Tt(f)}</span>`, iconSize: [0, 0], iconAnchor: [0, 0] });
    }
    function mn(f, n) {
      return M.divIcon({ className: "wm-route wm-station", html: `<span class="wm-route-inner" style="--c:${n}">${Tt(f)}</span>`, iconSize: [0, 0], iconAnchor: [0, 0] });
    }
    function Gi(f) {
      const n = [], l = [];
      for (const z of f) {
        const k = String(z.text).length * 13 + 20, V = 22;
        n.some((C) => Math.abs(C.x - z.x) < (C.w + k) / 2 && Math.abs(C.y - z.y) < (C.h + V) / 2) || (n.push({ x: z.x, y: z.y, w: k, h: V }), l.push(z));
      }
      return l;
    }
    function vn() {
      const f = R.value.kind === "real" ? "real" : "fictional";
      if (b && qe !== f && (b.remove(), b = null, O = null), !(b || !je.value)) {
        if (f === "real") {
          kt.value = !1, b = M.map(je.value, { zoomControl: !0, attributionControl: !0 }).setView([35, 105], 5);
          const n = M.tileLayer(qu, { subdomains: ["1", "2", "3", "4"], maxZoom: 19, minZoom: 3, attribution: "© 高德地图" });
          n.on("tileerror", () => {
            kt.value = !0;
          }), n.on("load", () => {
            kt.value = !1;
          }), n.addTo(b);
        } else {
          kt.value = !1;
          const { w: n, h: l } = $e();
          b = M.map(je.value, { crs: M.CRS.Simple, zoomControl: !0, attributionControl: !1, minZoom: -3, maxZoom: 3 }).setView([l / 2, n / 2], -1.5);
          for (const [k, V] of [["pWater", 350], ["pParks", 360], ["pBlocks", 370], ["pRoads", 380], ["pMetro", 400], ["pBus", 410], ["pLabels", 620]])
            b.createPane(k), b.getPane(k).style.zIndex = String(V);
          const z = () => b.getContainer().classList.toggle("wm-zoom-low", b.getZoom() < 0);
          b.on("zoomend", z), setTimeout(z, 0);
        }
        qe = f, O = M.layerGroup().addTo(b);
      }
    }
    function bi(f = !1) {
      if (!b || !O) return;
      O.clearLayers();
      for (const k of Object.keys(Bt)) delete Bt[k];
      ne = "";
      const n = R.value.locations || [];
      if (!n.length) return;
      const l = qe !== "real", z = {};
      for (const k of n) z[k.id] = k;
      if (l) {
        const { w: k, h: V } = $e(), J = (v) => v.map((j) => xt(j[0], j[1])), C = R.value.nation;
        if (oe.value === "nation" && C) {
          M.rectangle([[0, 0], [V, k]], { pane: "pWater", stroke: !1, fillColor: "#d9e6f0", fillOpacity: 1 }).addTo(O), M.polygon(J(C.land), { pane: "pWater", color: "#8fbfe6", weight: 1.5, fillColor: "#f4efe1", fillOpacity: 1 }).addTo(O), (C.provinces || []).forEach((v, j) => {
            M.polygon(J(v.points), { pane: "pParks", color: "#c9b98f", weight: 1, fillColor: j % 2 ? "#ece2c8" : "#e4d7b4", fillOpacity: 0.55 }).addTo(O), M.marker(J([v.label])[0], { pane: "pLabels", interactive: !1, icon: Ut(v.name, "#8a7a5c") }).addTo(O);
          }), (C.routes || []).forEach((v) => M.polyline(J(v.points), { pane: "pRoads", color: "#b98a4a", weight: 2.5, dashArray: "2 7" }).addTo(O)), (C.cities || []).forEach((v) => {
            const j = xt(v.x, v.y);
            M.circleMarker(j, { pane: "pLabels", radius: v.capital ? 9 : 6, color: "#ffffff", weight: 2, fillColor: v.capital ? "#d64545" : "#3a6ea5", fillOpacity: 1 }).bindPopup(Tt(v.name)).addTo(O), M.marker(j, { pane: "pLabels", interactive: !1, icon: Ut(v.name, v.capital ? "#d64545" : "#3a6ea5") }).addTo(O);
          }), b.fitBounds([[0, 0], [V, k]], { padding: [6, 6] });
          return;
        }
        M.rectangle([[0, 0], [V, k]], { pane: "pWater", stroke: !1, fillColor: "#eef1f4", fillOpacity: 1 }).addTo(O), (R.value.compounds || []).forEach((v) => {
          M.polygon(J(v.points), { pane: "pParks", color: "#c9b98f", weight: 1.2, dashArray: "7 5", fillColor: "#f3ead0", fillOpacity: 0.5 }).addTo(O), M.marker(J(v.points)[0], { pane: "pLabels", interactive: !1, icon: Ut(v.name, "#a9884a") }).addTo(O);
        }), (R.value.lakes || []).forEach((v) => {
          M.polygon(J(v.points), { pane: "pWater", color: "#8fbfe6", weight: 1.5, fillColor: "#bcd9f0", fillOpacity: 1 }).addTo(O), v.name && v.name !== "" && M.marker(xt(v.label[0], v.label[1]), { pane: "pLabels", interactive: !1, icon: Ut(v.name, "#3d7fb5") }).addTo(O);
        }), (R.value.rivers || []).forEach((v) => {
          M.polyline(J(v.points), { pane: "pWater", color: "#8fbfe6", weight: 16, lineCap: "round", lineJoin: "round" }).addTo(O), M.polyline(J(v.points), { pane: "pWater", color: "#bcd9f0", weight: 11, lineCap: "round", lineJoin: "round" }).addTo(O), v.name && v.name !== "" && M.marker(J(v.points)[Math.floor(v.points.length / 2)], { pane: "pLabels", interactive: !1, icon: Ut(v.name, "#3d7fb5") }).addTo(O);
        }), (R.value.parks || []).forEach((v) => {
          M.polygon(J(v.points), { pane: "pParks", color: "#a9d3a0", weight: 1, fillColor: "#c9e6c4", fillOpacity: 1 }).addTo(O), (v.trees || []).forEach((j) => M.circleMarker(xt(j[0], j[1]), { pane: "pParks", radius: 2.6, stroke: !1, fillColor: "#82bd79", fillOpacity: 1 }).addTo(O)), v.name && v.name !== "公园" && M.marker(J(v.points)[0], { pane: "pLabels", interactive: !1, icon: Ut(v.name, "#5a9e52") }).addTo(O);
        });
        const Nt = [];
        (R.value.blocks || []).forEach((v) => {
          const j = J(v.points);
          if (M.polygon(j.map((ot) => [ot[0] - 3, ot[1] + 3]), { pane: "pBlocks", stroke: !1, fillColor: "#5b6b7a", fillOpacity: 0.16 }).addTo(O), M.polygon(j, { pane: "pBlocks", color: "#b9c3cd", weight: 1, fillColor: yi[(v.shade || 0) % yi.length], fillOpacity: 1 }).addTo(O), v.tower) {
            const ot = j.reduce((_t, ht) => _t + ht[0], 0) / j.length, lt = j.reduce((_t, ht) => _t + ht[1], 0) / j.length;
            M.polygon(
              j.map((_t) => [ot + (_t[0] - ot) * 0.5, lt + (_t[1] - lt) * 0.5]),
              { pane: "pBlocks", color: "#aab4c0", weight: 1, fillColor: "#eef2f6", fillOpacity: 1 }
            ).addTo(O);
          }
          if (v.name) {
            const ot = v.points.reduce((_t, ht) => _t + ht[0], 0) / v.points.length, lt = v.points.reduce((_t, ht) => _t + ht[1], 0) / v.points.length;
            Nt.push({ x: ot, y: lt, text: v.name, color: v.tower ? "#6b5b8a" : "#7a8794" });
          }
        }), (R.value.named_buildings || []).forEach((v) => {
          M.circleMarker(xt(v.x, v.y), { pane: "pLabels", radius: 4, color: "#ffffff", weight: 1.5, fillColor: "#8a5a2b", fillOpacity: 1 }).addTo(O), M.marker(xt(v.x, v.y), { pane: "pLabels", interactive: !1, icon: Ut(v.name, "#8a5a2b") }).addTo(O);
        });
        for (const v of Gi(Nt))
          M.marker(xt(v.x, v.y), { pane: "pLabels", interactive: !1, icon: Xe(v.text, v.color) }).addTo(O);
        const it = {
          highway: { casing: 13, fill: 6.5, color: "#f08c2e" },
          arterial: { casing: 10, fill: 4.5, color: "#f7cf8a" },
          street: { casing: 5, fill: 2.4, color: "#ffffff" }
        };
        (R.value.streets || []).forEach((v) => {
          const j = it[v.kind] || it.street, ot = J(v.points);
          M.polyline(ot, { pane: "pRoads", color: "#ffffff", weight: j.casing, lineCap: "round", lineJoin: "round" }).addTo(O), M.polyline(ot, { pane: "pRoads", color: j.color, weight: j.fill, lineCap: "round", lineJoin: "round" }).addTo(O);
        }), (R.value.roads || []).forEach((v, j) => {
          if (!v.name) return;
          const ot = J(v.points), lt = "road:" + j;
          M.polyline(ot, { pane: "pRoads", color: "#ffffff", weight: 11, lineCap: "round", lineJoin: "round" }).addTo(O);
          const _t = { pane: "pRoads", color: "#f6c56b", weight: 5, opacity: 1, lineCap: "round", lineJoin: "round" };
          Ke(lt, M.polyline(ot, _t).on("click", () => Qt(lt)).addTo(O), _t), M.marker(ot[Math.floor(ot.length / 2)], { pane: "pLabels", interactive: !0, icon: Ut(v.name, "#9a8358") }).on("click", () => Qt(lt)).addTo(O);
        }), (R.value.districts || []).forEach((v, j) => {
          M.circle(xt(v.x, v.y), { pane: "pRoads", radius: v.r || 200, color: "#93a2b0", weight: 1, dashArray: "4 7", fillColor: gi[j % gi.length], fillOpacity: 0.08 }).addTo(O), M.marker(xt(v.x, v.y), { pane: "pLabels", interactive: !1, icon: M.divIcon({ className: "wm-district", html: `<span class="wm-district-inner">${Tt(v.name)}</span>`, iconSize: [0, 0], iconAnchor: [0, 0] }) }).addTo(O);
        });
        const ki = [];
        (R.value.metro || []).forEach((v, j) => {
          const ot = J(v.points), lt = "metro:" + j;
          M.polyline(ot, { pane: "pMetro", color: "#ffffff", weight: 8, lineCap: "round", lineJoin: "round" }).addTo(O);
          const _t = { pane: "pMetro", color: v.color, weight: 4.5, opacity: 0.92, lineCap: "round", lineJoin: "round" };
          Ke(lt, M.polyline(ot, _t).on("click", () => Qt(lt)).addTo(O), _t), (v.stations || []).forEach((ht) => {
            M.circleMarker(xt(ht.x, ht.y), { pane: "pMetro", radius: 5, color: "#ffffff", weight: 2.5, fillColor: v.color, fillOpacity: 1 }).bindPopup(Tt(ht.name || v.name)).on("click", () => Qt(lt)).addTo(O), ht.name && ki.push({ x: ht.x, y: ht.y, text: ht.name, color: v.color });
          }), M.marker(ot[Math.floor(ot.length / 2)], { pane: "pLabels", interactive: !0, icon: Ut(v.name, v.color) }).on("click", () => Qt(lt)).addTo(O);
        }), (R.value.bus || []).forEach((v, j) => {
          const ot = J(v.points), lt = "bus:" + j, _t = { pane: "pBus", color: v.color, weight: 3, opacity: 0.95, dashArray: "7 7", lineCap: "round" };
          Ke(lt, M.polyline(ot, _t).on("click", () => Qt(lt)).addTo(O), _t), (v.stops || []).forEach((ht) => M.circleMarker(xt(ht.x, ht.y), { pane: "pBus", radius: 3.2, color: "#ffffff", weight: 1.5, fillColor: v.color, fillOpacity: 1 }).bindPopup(Tt(ht.name || v.name)).on("click", () => Qt(lt)).addTo(O)), M.marker(ot[Math.floor(ot.length / 2)], { pane: "pLabels", interactive: !0, icon: Ut(v.name, v.color) }).on("click", () => Qt(lt)).addTo(O);
        });
        for (const v of Gi(ki))
          M.marker(xt(v.x, v.y), { pane: "pLabels", interactive: !1, icon: mn(v.text, v.color) }).addTo(O);
      } else
        for (const k of R.value.edges || []) {
          const V = z[k[0]], J = z[k[1]];
          V?.lat != null && J?.lat != null && M.polyline([[V.lat, V.lng], [J.lat, J.lng]], { color: "#5b8def", weight: 3, opacity: 0.55, dashArray: "2 8", lineCap: "round" }).addTo(O);
        }
      for (const k of n) {
        const V = Wi[k.kind] || Wi.other, J = l ? xt(k.x, k.y) : k.lat != null ? [k.lat, k.lng] : null;
        if (!J) continue;
        const C = M.divIcon({
          className: "wm-pin-holder",
          html: `<span class="wm-pin" style="--c:${V}"></span><span class="wm-pin-label">${Tt(k.name)}</span>`,
          iconSize: [0, 0],
          iconAnchor: [0, 0]
        });
        M.marker(J, { icon: C }).bindPopup(`<b>${Tt(k.name)}</b>${k.desc ? "<br>" + Tt(k.desc) : ""}`).addTo(O);
      }
      for (const k of R.value.actors || []) {
        const V = z[hn.value[k.id] || k.location];
        if (!V) continue;
        const J = l ? xt(V.x, V.y) : V.lat != null ? [V.lat, V.lng] : null;
        if (!J) continue;
        const C = M.divIcon({
          className: "wm-actor-holder",
          html: `<span class="wm-actor-badge">${Tt((k.name || "?").slice(0, 1))}</span><span class="wm-actor-name">${Tt(k.name)}</span>`,
          iconSize: [0, 0],
          iconAnchor: [0, 0]
        });
        M.marker(J, { icon: C }).bindPopup(`${Tt(k.name)} · ${Tt(V.name)}`).addTo(O);
      }
      if (!f)
        if (l) {
          const { w: k, h: V } = $e();
          b.fitBounds([[0, 0], [V, k]], { padding: [0, 0] });
        } else {
          const k = n.filter((V) => V.lat != null).map((V) => [V.lat, V.lng]);
          k.length > 1 ? b.fitBounds(k, { padding: [56, 56], maxZoom: 15 }) : k.length === 1 && b.setView(k[0], 14);
        }
    }
    ai([U, () => g.value.worldview], async () => {
      U.value === "world" && (await ps(), vn(), bi(), b && setTimeout(() => b.invalidateSize(), 80));
    }), _s(() => {
      b && (b.remove(), b = null, O = null);
    });
    function gn() {
      m.value = { ...Ot() }, Ue.value = String(g.value.settings?.world_density || "off"), pe.value = String(g.value.settings?.world_fictional || "fictional"), Le.value = String(g.value.settings?.world_country || ""), Fe.value = String(g.value.settings?.world_city || ""), Jt.value = String(g.value.settings?.world_district || ""), He.value = String(g.value.settings?.world_premise || ""), We.value = String(g.value.settings?.persona_text || ""), Pe.value = String(g.value.settings?.world_actors || ""), Te.value = String(g.value.settings?.world_places || "");
    }
    async function _e() {
      const f = {
        ...rn(),
        world_density: Ue.value,
        world_fictional: pe.value,
        world_country: Le.value,
        world_city: Fe.value,
        world_district: Jt.value,
        world_premise: He.value,
        world_actors: Pe.value,
        world_places: Te.value,
        persona_text: We.value
      }, n = await mt("settings_set", { settings: f });
      n?.rejected?.length ? wt(`已保存，忽略无效项：${n.rejected.join("、")}`) : wt("设置已保存");
    }
    const te = Q([]), wi = Q([]), Ye = Q(!1);
    function se(f) {
      return wi.value.find((n) => n.id === f) || {};
    }
    async function G() {
      const f = await mt("adapter_list", {});
      f && (te.value = f.instances || [], wi.value = f.runtime || []);
    }
    async function ut() {
      Ye.value = !0;
      try {
        await mt("adapter_sync", {}), wt("已按配置重新监听");
      } finally {
        Ye.value = !1;
      }
    }
    async function Je() {
      if (!(Zt.value || !await Ee({
        title: "✦ AI 重写设定",
        message: "这会用模型结果覆盖上面的 国家 / 城市 / 前言 / 演员 / 地点 等设定。只想更新地图，请用「只生成地图（保留设定）」",
        confirmLabel: "覆盖并生成",
        danger: !0
      }))) {
        Zt.value = !0;
        try {
          (await mt("world_generate", { instructions: "" }))?.worldview && wt("已由 AI 完善世界观并生成地图");
        } finally {
          Zt.value = !1;
        }
      }
    }
    async function me() {
      if (!Zt.value) {
        Zt.value = !0;
        try {
          (await mt("world_map_generate", { instructions: "" }))?.worldview && wt("已按当前设定重新生成地图（设定未改动）");
        } finally {
          Zt.value = !1;
        }
      }
    }
    async function ve() {
      if (!await Ee({
        title: "清除世界事件",
        message: "会删除时间线里所有「世界」事件、世界触发的主动消息与相关记忆，并重置世界状态（演员位置等）。此操作不可撤销。",
        confirmLabel: "清除",
        danger: !0
      })) return;
      await mt("world_clear", {}) && wt("已清除世界事件并重置世界状态");
    }
    async function xi() {
      if (!(!await Ee({
        title: "重置整个人",
        message: `这是唯一一次可以「重来」的操作——日常里删除一条记忆或撤回一句话都是不可逆的。

会清空：全部记忆与本地备份、关系与亲密度、承诺、目标与进展日志、未完成话题、用户画像与用户模型、价值取向、人设演化、日记与梦境、每日复盘、技能与常用表达、社交节点与边、群内关系、时间线与见闻、主动消息与回执，以及认知内核（自我叙事、互惠关系、情感历史、学到的价值表）。

会保留：你自己的设置（限额、端点、群策略、日历规则）。

此操作不可撤销。`,
        confirmLabel: "继续",
        danger: !0
      }) || !await Ee({
        title: "再确认一次",
        message: "真的要把这个人恢复到出厂状态吗？之后他不会再记得发生过的任何事。",
        confirmLabel: "重置整个人",
        danger: !0
      }))) {
        Ge.value = !0;
        try {
          await mt("reset_person", {}), wt("已重置整个人"), await st();
        } finally {
          Ge.value = !1;
        }
      }
    }
    const B = () => ({ name: "", avatar: "", birthDate: "", gender: "", description: "", personality: "", greeting: "", customPrompt: "" }), rt = [
      { value: "", label: "不判定" },
      { value: "female", label: "女" },
      { value: "male", label: "男" },
      { value: "other", label: "其它" }
    ];
    function Li(f) {
      return (rt.find((n) => n.value === f) || rt[0]).label;
    }
    const H = Q(B()), Ct = Q(!1);
    function ji() {
      return globalThis.__0KAY_HOST__;
    }
    function ke() {
      const f = ji();
      if (f?.getPersona) {
        H.value = { ...B(), ...f.getPersona() || {} };
        return;
      }
      try {
        const n = JSON.parse(localStorage.getItem("0kay_config") || "{}");
        H.value = { ...B(), ...n.persona || {} };
      } catch {
        H.value = B();
      }
    }
    const p = Q(null), dt = Q(!1), ae = ["typical", "depression", "anxiety", "bpd", "alexithymia"], Ce = X(() => [
      { value: "", label: "（不判定）" },
      ...(p.value?.options?.character || []).map((f) => ({ value: f.key, label: f.label }))
    ]), Se = X(() => [
      { value: "", label: "（不判定）" },
      ...(p.value?.options?.relationship || []).map((f) => ({
        value: f.key,
        label: f.label + (f.pathological ? " · 病娇族" : "")
      }))
    ]);
    function Qe() {
      return { text: [H.value.description, H.value.personality].filter((f) => String(f || "").trim()).join(`
`) };
    }
    ai(() => [H.value.description, H.value.personality, H.value.customPrompt], () => {
      p.value = null;
    });
    function Me(f) {
      return (p.value?.options?.relationship || []).find((n) => n.key === f);
    }
    ai(() => p.value?.relationship?.key, (f) => {
      const n = p.value?.attachment;
      if (!n) return;
      const l = Me(f);
      n.type = l?.pathological && l.attachment_type || "";
    }, { immediate: !0 }), ai(() => p.value?.attachment?.type, (f) => {
      const n = p.value?.attachment;
      if (!(!f || !n)) {
        (!n.initial || typeof n.initial != "object") && (n.initial = {});
        for (const [l, z] of Object.entries({ A: 0.05, Am: 0, Tr: 0.5, J: 0, X: 0.05, S: 0.6, O: 0 }))
          n.initial[l] == null && (n.initial[l] = z);
      }
    });
    async function Pi() {
      const f = Qe();
      if (!f.text.trim()) {
        wt("请先填写「描述」或「性格」");
        return;
      }
      dt.value = !0;
      try {
        const n = await mt("persona_analyze", { text: f.text, gender: H.value.gender });
        n && (p.value = n, p.value.personadynGender = n.personadyn?.gender || m.cog_personadyn_gender || "未指定", !H.value.gender && n.gender && (H.value.gender = n.gender), wt(n.source === "llm" ? "已由模型理解，请核对/微调参数" : "模型不可用，已用本地词典理解，请核对"));
      } finally {
        dt.value = !1;
      }
    }
    async function Ti() {
      if (!p.value) {
        wt("请先点「LLM 理解」并核对参数，再保存");
        return;
      }
      Ct.value = !0;
      try {
        const f = Qe(), n = { ...p.value.traits || {} };
        if (n.gender = p.value.gender || H.value.gender || null, n.character = p.value.character?.key || null, n.relationship = p.value.relationship?.key || null, n.expression = p.value.character?.expression || p.value.expression || null, delete n.axes, !await mt("persona_apply", {
          text: f.text,
          traits: n,
          attachment: p.value.attachment || {},
          tsundere: p.value.tsundere || {},
          personadyn: {
            ...p.value.personadyn || {},
            // The owner may override the archetype's implied gender/social script
            // after analysis; the backend applies it as the persona's G group.
            gender: p.value.personadynGender || m.cog_personadyn_gender || "未指定"
          }
        })) return;
        const z = ji();
        if (z?.setPersona)
          z.setPersona({ ...H.value }), z.saveConfig?.();
        else {
          const k = JSON.parse(localStorage.getItem("0kay_config") || "{}");
          k.persona = { ...k.persona || {}, ...H.value }, localStorage.setItem("0kay_config", JSON.stringify(k));
        }
        wt("人设与参数已保存");
      } finally {
        Ct.value = !1;
      }
    }
    return vo(ke), ai(U, (f) => {
      f === "persona" && ke();
    }), vo(st), vs("life-plugin-kit", ws("pcp")), (f, n) => (w(), x(pt, null, [
      s("main", {
        class: "pcp",
        ref_key: "pageEl",
        ref: ri
      }, [
        s("header", Ms, [
          s("div", zs, [
            n[99] || (n[99] = s("div", { class: "hero-copy" }, [
              s("p", { class: "eyebrow" }, [
                s("b", null, "◉"),
                gt(" L.I.F.E / COGNITION")
              ]),
              s("h1", null, "陪伴面板 · 认知内核"),
              s("p", { class: "sub" }, "五套认知回路（决策仲裁 / 情感生理 / 语言习得 / 社会学习 / 自我与时间）。它们始终在后台记录状态；只有打开对应的「调节」开关，状态才会写进提示词。全部关闭时行为与旧版完全一致。")
            ], -1)),
            s("div", Os, [
              s("button", {
                class: he(["btn", { tonic: !ft.value?.alive }]),
                disabled: Yt.value || It.value,
                onClick: n[0] || (n[0] = (l) => ft.value?.alive ? xe() : Ne())
              }, h(Yt.value ? "…" : ft.value?.alive ? "⏸ 暂停生命" : "❍ 开始生命"), 11, Es),
              s("button", {
                class: "fab",
                disabled: It.value,
                onClick: _e
              }, [...n[98] || (n[98] = [
                s("span", { class: "fab-ic" }, "✦", -1),
                gt("保存设置", -1)
              ])], 8, As),
              s("button", {
                class: "btn tonic",
                disabled: It.value,
                onClick: st
              }, h(It.value ? "刷新中…" : "刷新"), 9, Is)
            ])
          ]),
          s("div", Zs, [
            s("span", {
              class: he(["pill", { bad: tt.value && !tt.value.enabled }])
            }, "认知内核 " + h(tt.value?.available === !1 ? "不可用" : tt.value?.enabled ? "运行中" : "已停止"), 3),
            s("span", Bs, "已决策 " + h(yt.value?.turns ?? 0) + " 轮", 1),
            s("span", Ns, "情景痕迹 " + h(yt.value?.engrams ?? 0), 1),
            s("span", Ds, "词汇量 " + h(Z.value?.lexicon_size ?? 0), 1)
          ])
        ]),
        K.value ? (w(), x("p", Rs, h(K.value), 1)) : I("", !0),
        Xt.value ? (w(), x("p", Vs, h(Xt.value), 1)) : I("", !0),
        s("nav", Us, [
          (w(), x(pt, null, $t(W, (l) => s("button", {
            key: l.key,
            class: he(["tab", { active: U.value === l.key }]),
            onClick: (z) => li(l.key)
          }, [
            s("i", null, h(l.i), 1),
            s("span", Hs, h(l.icon), 1),
            gt(h(l.label), 1)
          ], 10, Fs)), 64))
        ]),
        y(s("section", Ws, [
          s("div", Gs, [
            n[100] || (n[100] = s("div", null, [
              s("h2", null, "人设"),
              s("p", { class: "desc" }, "角色的名字、描述与性格。描述 + 性格是模型读取人设的全部来源：它同时驱动情绪画像、依恋动力学（病娇）的型别与初始值、以及抑郁倾向。改完文字后必须先用「LLM 理解」解析成参数、核对微调，才能保存。")
            ], -1)),
            s("div", js, [
              s("button", {
                class: "btn tonic sm",
                disabled: dt.value || It.value,
                onClick: Pi
              }, h(dt.value ? "理解中…" : "LLM 理解"), 9, qs),
              s("button", {
                class: "btn filled sm",
                disabled: Ct.value || !p.value,
                onClick: Ti
              }, "保存人设", 8, Ks)
            ])
          ]),
          s("article", $s, [
            s("div", Xs, [
              s("label", null, [
                n[101] || (n[101] = s("span", null, "名字", -1)),
                y(s("input", {
                  "onUpdate:modelValue": n[1] || (n[1] = (l) => H.value.name = l),
                  class: "field"
                }, null, 512), [
                  [S, H.value.name]
                ])
              ]),
              s("label", null, [
                n[102] || (n[102] = s("span", null, "性别", -1)),
                St(zt, {
                  modelValue: H.value.gender,
                  "onUpdate:modelValue": n[2] || (n[2] = (l) => H.value.gender = l),
                  options: rt,
                  "aria-label": "性别"
                }, null, 8, ["modelValue"])
              ]),
              s("label", null, [
                n[103] || (n[103] = s("span", null, "头像 URL", -1)),
                y(s("input", {
                  "onUpdate:modelValue": n[3] || (n[3] = (l) => H.value.avatar = l),
                  class: "field"
                }, null, 512), [
                  [S, H.value.avatar]
                ])
              ]),
              s("label", null, [
                n[104] || (n[104] = s("span", null, "生日", -1)),
                y(s("input", {
                  "onUpdate:modelValue": n[4] || (n[4] = (l) => H.value.birthDate = l),
                  type: "date",
                  class: "field"
                }, null, 512), [
                  [S, H.value.birthDate]
                ])
              ])
            ]),
            s("label", Ys, [
              n[105] || (n[105] = s("span", null, "描述", -1)),
              y(s("textarea", {
                "onUpdate:modelValue": n[5] || (n[5] = (l) => H.value.description = l),
                rows: "3",
                class: "field"
              }, null, 512), [
                [S, H.value.description]
              ])
            ]),
            s("label", Js, [
              n[106] || (n[106] = s("span", null, "性格", -1)),
              y(s("textarea", {
                "onUpdate:modelValue": n[6] || (n[6] = (l) => H.value.personality = l),
                rows: "3",
                class: "field"
              }, null, 512), [
                [S, H.value.personality]
              ])
            ]),
            s("label", Qs, [
              n[107] || (n[107] = s("span", null, "问候语", -1)),
              y(s("textarea", {
                "onUpdate:modelValue": n[7] || (n[7] = (l) => H.value.greeting = l),
                rows: "2",
                class: "field"
              }, null, 512), [
                [S, H.value.greeting]
              ])
            ]),
            s("label", ta, [
              n[108] || (n[108] = s("span", null, "自定义提示词（作为 system 提示逐字发送）", -1)),
              y(s("textarea", {
                "onUpdate:modelValue": n[8] || (n[8] = (l) => H.value.customPrompt = l),
                rows: "5",
                class: "field"
              }, null, 512), [
                [S, H.value.customPrompt]
              ])
            ]),
            n[109] || (n[109] = s("p", { class: "hint" }, "填写/修改「描述」或「性格」后，先点右上角「LLM 理解」：模型会把文字解析成下面的参数，你核对或微调后「保存人设」才会写回；改了文字需要重新理解。", -1))
          ]),
          p.value ? (w(), x("article", ea, [
            s("h3", null, [
              n[110] || (n[110] = gt("解析结果 ", -1)),
              s("span", ia, h(p.value.source === "llm" ? "模型理解" : "本地词典"), 1)
            ]),
            s("div", na, [
              s("label", null, [
                n[111] || (n[111] = s("span", null, "性别", -1)),
                St(zt, {
                  modelValue: p.value.gender,
                  "onUpdate:modelValue": n[9] || (n[9] = (l) => p.value.gender = l),
                  options: rt,
                  "aria-label": "性别"
                }, null, 8, ["modelValue"])
              ]),
              s("label", null, [
                n[112] || (n[112] = s("span", null, "性格原型", -1)),
                St(zt, {
                  modelValue: p.value.character.key,
                  "onUpdate:modelValue": n[10] || (n[10] = (l) => p.value.character.key = l),
                  options: Ce.value,
                  "aria-label": "性格原型"
                }, null, 8, ["modelValue", "options"])
              ]),
              s("label", null, [
                n[113] || (n[113] = s("span", null, "关系 / 依恋类型", -1)),
                St(zt, {
                  modelValue: p.value.relationship.key,
                  "onUpdate:modelValue": n[11] || (n[11] = (l) => p.value.relationship.key = l),
                  options: Se.value,
                  "aria-label": "关系类型"
                }, null, 8, ["modelValue", "options"])
              ])
            ]),
            s("p", oa, [
              gt(" 性别：" + h(Li(p.value.gender)) + "。 ", 1),
              p.value.relationship?.label ? (w(), x(pt, { key: 0 }, [
                gt(" 关系判定：" + h(p.value.relationship.label) + " ", 1),
                p.value.relationship.pathological ? (w(), x(pt, { key: 0 }, [
                  gt("（病娇族 → 才会启用依恋动力学）")
                ], 64)) : (w(), x(pt, { key: 1 }, [
                  gt("（健康型 → 不启用病态依恋）")
                ], 64))
              ], 64)) : I("", !0)
            ]),
            p.value.character?.expression || p.value.expression ? (w(), x("p", sa, "说话风格：" + h(p.value.character?.expression || p.value.expression), 1)) : I("", !0),
            n[151] || (n[151] = s("h4", null, "情绪 / 躯体参数", -1)),
            s("div", aa, [
              s("label", null, [
                n[114] || (n[114] = s("span", null, "威胁基线", -1)),
                y(s("input", {
                  "onUpdate:modelValue": n[12] || (n[12] = (l) => p.value.traits.threat_baseline = l),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    S,
                    p.value.traits.threat_baseline,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              s("label", null, [
                n[115] || (n[115] = s("span", null, "奖赏基线", -1)),
                y(s("input", {
                  "onUpdate:modelValue": n[13] || (n[13] = (l) => p.value.traits.reward_baseline = l),
                  type: "number",
                  step: "0.1",
                  min: "0",
                  max: "2",
                  class: "field tiny"
                }, null, 512), [
                  [
                    S,
                    p.value.traits.reward_baseline,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              s("label", null, [
                n[116] || (n[116] = s("span", null, "灾难化", -1)),
                y(s("input", {
                  "onUpdate:modelValue": n[14] || (n[14] = (l) => p.value.traits.catastrophizing = l),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    S,
                    p.value.traits.catastrophizing,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              s("label", null, [
                n[117] || (n[117] = s("span", null, "情绪调节画像", -1)),
                St(zt, {
                  modelValue: p.value.traits.erq_profile,
                  "onUpdate:modelValue": n[15] || (n[15] = (l) => p.value.traits.erq_profile = l),
                  options: ae,
                  "aria-label": "情绪调节画像"
                }, null, 8, ["modelValue"])
              ]),
              s("label", null, [
                n[118] || (n[118] = s("span", null, "作息（睡眠小时 0-23）", -1)),
                y(s("input", {
                  "onUpdate:modelValue": n[16] || (n[16] = (l) => p.value.traits.sleep_hour = l),
                  type: "number",
                  min: "0",
                  max: "23",
                  class: "field tiny"
                }, null, 512), [
                  [
                    S,
                    p.value.traits.sleep_hour,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ])
            ]),
            n[152] || (n[152] = s("h4", null, "性格维度", -1)),
            s("div", ra, [
              s("label", null, [
                n[119] || (n[119] = s("span", null, "外向性", -1)),
                y(s("input", {
                  "onUpdate:modelValue": n[17] || (n[17] = (l) => p.value.traits.extraversion = l),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    S,
                    p.value.traits.extraversion,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              s("label", null, [
                n[120] || (n[120] = s("span", null, "宜人性", -1)),
                y(s("input", {
                  "onUpdate:modelValue": n[18] || (n[18] = (l) => p.value.traits.agreeableness = l),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    S,
                    p.value.traits.agreeableness,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              s("label", null, [
                n[121] || (n[121] = s("span", null, "尽责性", -1)),
                y(s("input", {
                  "onUpdate:modelValue": n[19] || (n[19] = (l) => p.value.traits.conscientiousness = l),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    S,
                    p.value.traits.conscientiousness,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              s("label", null, [
                n[122] || (n[122] = s("span", null, "开放性", -1)),
                y(s("input", {
                  "onUpdate:modelValue": n[20] || (n[20] = (l) => p.value.traits.openness = l),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    S,
                    p.value.traits.openness,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              s("label", null, [
                n[123] || (n[123] = s("span", null, "依恋焦虑", -1)),
                y(s("input", {
                  "onUpdate:modelValue": n[21] || (n[21] = (l) => p.value.traits.attach_anxiety = l),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    S,
                    p.value.traits.attach_anxiety,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              s("label", null, [
                n[124] || (n[124] = s("span", null, "依恋回避", -1)),
                y(s("input", {
                  "onUpdate:modelValue": n[22] || (n[22] = (l) => p.value.traits.attach_avoidance = l),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    S,
                    p.value.traits.attach_avoidance,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ])
            ]),
            s("details", la, [
              n[131] || (n[131] = s("summary", null, "更多风格参数（表达 / 语气）", -1)),
              s("div", ua, [
                s("label", null, [
                  n[125] || (n[125] = s("span", null, "表达欲", -1)),
                  y(s("input", {
                    "onUpdate:modelValue": n[23] || (n[23] = (l) => p.value.traits.expressiveness = l),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      S,
                      p.value.traits.expressiveness,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                s("label", null, [
                  n[126] || (n[126] = s("span", null, "主动性", -1)),
                  y(s("input", {
                    "onUpdate:modelValue": n[24] || (n[24] = (l) => p.value.traits.initiative = l),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      S,
                      p.value.traits.initiative,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                s("label", null, [
                  n[127] || (n[127] = s("span", null, "幽默", -1)),
                  y(s("input", {
                    "onUpdate:modelValue": n[25] || (n[25] = (l) => p.value.traits.humor = l),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      S,
                      p.value.traits.humor,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                s("label", null, [
                  n[128] || (n[128] = s("span", null, "亲和", -1)),
                  y(s("input", {
                    "onUpdate:modelValue": n[26] || (n[26] = (l) => p.value.traits.warmth = l),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      S,
                      p.value.traits.warmth,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                s("label", null, [
                  n[129] || (n[129] = s("span", null, "正式程度", -1)),
                  y(s("input", {
                    "onUpdate:modelValue": n[27] || (n[27] = (l) => p.value.traits.formality = l),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      S,
                      p.value.traits.formality,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                s("label", null, [
                  n[130] || (n[130] = s("span", null, "强势 / 支配", -1)),
                  y(s("input", {
                    "onUpdate:modelValue": n[28] || (n[28] = (l) => p.value.traits.assertiveness = l),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      S,
                      p.value.traits.assertiveness,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ])
              ])
            ]),
            p.value.attachment.type ? (w(), x(pt, { key: 1 }, [
              s("h4", null, "病态依恋 · 由关系类型「" + h(p.value.relationship.label) + "」决定", 1),
              s("div", da, [
                s("label", null, [
                  n[132] || (n[132] = s("span", null, "依恋型别（随关系类型）", -1)),
                  s("input", {
                    class: "field",
                    value: p.value.attachment.type + "（" + (p.value.relationship.label || "") + "）",
                    disabled: ""
                  }, null, 8, ha)
                ]),
                s("label", null, [
                  n[133] || (n[133] = s("span", null, "初始焦虑 X", -1)),
                  y(s("input", {
                    "onUpdate:modelValue": n[29] || (n[29] = (l) => p.value.attachment.initial.X = l),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      S,
                      p.value.attachment.initial.X,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                s("label", null, [
                  n[134] || (n[134] = s("span", null, "初始安全感 S", -1)),
                  y(s("input", {
                    "onUpdate:modelValue": n[30] || (n[30] = (l) => p.value.attachment.initial.S = l),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      S,
                      p.value.attachment.initial.S,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ])
              ]),
              n[135] || (n[135] = s("p", { class: "hint" }, "文字只是来源，真正保存进 LIFE 的是这里调好的数值。依恋型别由「关系/依恋类型」自动决定，改关系类型即可换型别。想更贴合「病娇常伴抑郁」，把情绪调节画像设为 depression。", -1))
            ], 64)) : (w(), x("p", ca, "当前关系类型不是病娇族，不启用病态依恋动力学（病度、嫉妒、执念等由关系动力学单独驱动）。")),
            p.value.tsundere && p.value.tsundere.type ? (w(), x(pt, { key: 3 }, [
              n[140] || (n[140] = s("h4", null, "傲娇动力学 · 由人设关键词决定", -1)),
              s("div", fa, [
                s("label", null, [
                  n[136] || (n[136] = s("span", null, "傲娇型别", -1)),
                  s("input", {
                    class: "field",
                    value: p.value.tsundere.type,
                    disabled: ""
                  }, null, 8, pa)
                ]),
                s("label", null, [
                  n[137] || (n[137] = s("span", null, "初始好感 A", -1)),
                  y(s("input", {
                    "onUpdate:modelValue": n[31] || (n[31] = (l) => p.value.tsundere.initial.A = l),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      S,
                      p.value.tsundere.initial.A,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                s("label", null, [
                  n[138] || (n[138] = s("span", null, "初始傲娇表达 T", -1)),
                  y(s("input", {
                    "onUpdate:modelValue": n[32] || (n[32] = (l) => p.value.tsundere.initial.T = l),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      S,
                      p.value.tsundere.initial.T,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                s("label", null, [
                  n[139] || (n[139] = s("span", null, "初始病娇执念 Y", -1)),
                  y(s("input", {
                    "onUpdate:modelValue": n[33] || (n[33] = (l) => p.value.tsundere.initial.Y = l),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      S,
                      p.value.tsundere.initial.Y,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ])
              ]),
              n[141] || (n[141] = s("p", { class: "hint" }, "文字只是来源，真正保存进 LIFE 的是这里调好的数值。改人设里的关键词即可换型别（口嫌体正直→经典，高冷→高冷，暴躁→暴躁，迁就→迁就）。", -1))
            ], 64)) : (w(), x("p", _a, "人设里没有傲娇关键词，不启用傲娇动力学（可在下方「傲娇 / 病娇动力学」卡片手动开启）。")),
            p.value.personadyn && p.value.personadyn.type ? (w(), x(pt, { key: 5 }, [
              n[149] || (n[149] = s("h4", null, "人格动力学 · 由人设关键词决定", -1)),
              s("div", ma, [
                s("label", null, [
                  n[142] || (n[142] = s("span", null, "人格原型", -1)),
                  s("input", {
                    class: "field",
                    value: p.value.personadyn.type,
                    disabled: ""
                  }, null, 8, va)
                ]),
                s("label", null, [
                  n[143] || (n[143] = s("span", null, "初始好感 A", -1)),
                  y(s("input", {
                    "onUpdate:modelValue": n[34] || (n[34] = (l) => p.value.personadyn.initial.A = l),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      S,
                      p.value.personadyn.initial.A,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                s("label", null, [
                  n[144] || (n[144] = s("span", null, "初始焦虑 X", -1)),
                  y(s("input", {
                    "onUpdate:modelValue": n[35] || (n[35] = (l) => p.value.personadyn.initial.X = l),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      S,
                      p.value.personadyn.initial.X,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                s("label", null, [
                  n[145] || (n[145] = s("span", null, "初始占有 O", -1)),
                  y(s("input", {
                    "onUpdate:modelValue": n[36] || (n[36] = (l) => p.value.personadyn.initial.O = l),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      S,
                      p.value.personadyn.initial.O,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                s("label", null, [
                  n[146] || (n[146] = s("span", null, "初始信任 Tr", -1)),
                  y(s("input", {
                    "onUpdate:modelValue": n[37] || (n[37] = (l) => p.value.personadyn.initial.Tr = l),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      S,
                      p.value.personadyn.initial.Tr,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                s("label", null, [
                  n[147] || (n[147] = s("span", null, "初始自控 K", -1)),
                  y(s("input", {
                    "onUpdate:modelValue": n[38] || (n[38] = (l) => p.value.personadyn.initial.K = l),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      S,
                      p.value.personadyn.initial.K,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                s("label", null, [
                  n[148] || (n[148] = s("span", null, "性别 / 社会脚本 G", -1)),
                  St(zt, {
                    modelValue: p.value.personadynGender,
                    "onUpdate:modelValue": n[39] || (n[39] = (l) => p.value.personadynGender = l),
                    options: Ie,
                    "aria-label": "性别社会脚本"
                  }, null, 8, ["modelValue"])
                ])
              ]),
              n[150] || (n[150] = s("p", { class: "hint" }, "文字只是来源，真正保存进 LIFE 的是这里调好的数值。改人设里的关键词即可换原型（傲娇→傲娇型，病娇/占有→病娇型，高冷→三无，暴躁→暴躁…）。原型自带 12 族 / 69 维 θ 基线，选「未指定」时沿用原型隐含的社会脚本。", -1))
            ], 64)) : (w(), x("p", ga, "人设里没有匹配的人格原型关键词，不启用人格动力学（可在下方「人格动力学」卡片手动开启）。"))
          ])) : I("", !0)
        ], 512), [
          [Ai, U.value === "persona"]
        ]),
        y(s("section", ya, [
          s("div", { class: "section-head" }, [
            n[153] || (n[153] = s("div", null, [
              s("h2", null, "认知内核"),
              s("p", { class: "desc" }, "实时状态与全部参数。改动后点右上角「保存设置」才会生效。")
            ], -1)),
            s("div", { class: "head-actions" }, [
              s("button", {
                class: "btn filled sm",
                onClick: _e
              }, "保存设置")
            ])
          ]),
          s("article", ba, [
            s("h3", null, [
              n[154] || (n[154] = gt("生命 ", -1)),
              s("span", {
                class: he(["count-pill", { ok: ft.value?.alive }])
              }, h(ft.value?.alive ? "活着" : "未开始 / 已暂停"), 3)
            ]),
            s("div", wa, [
              s("div", xa, [
                n[155] || (n[155] = s("span", null, "状态", -1)),
                s("strong", null, h(ft.value?.alive ? "活着" : "未开始 / 已暂停"), 1)
              ]),
              s("div", La, [
                n[156] || (n[156] = s("span", null, "已活", -1)),
                s("strong", null, h(Ri()), 1)
              ]),
              s("div", Pa, [
                n[157] || (n[157] = s("span", null, "思考步数", -1)),
                s("strong", null, h(ft.value?.ticks ?? 0), 1)
              ]),
              s("div", Ta, [
                n[158] || (n[158] = s("span", null, "常驻思考", -1)),
                s("strong", null, h(ft.value?.resident_running ? "运行中" : "停止"), 1)
              ]),
              s("div", ka, [
                n[159] || (n[159] = s("span", null, "主动行为", -1)),
                s("strong", null, h(ft.value?.proactive_enabled ? "开" : "关"), 1)
              ]),
              s("div", Ca, [
                n[160] || (n[160] = s("span", null, "上次思考", -1)),
                s("strong", null, h((ft.value?.last_tick || "").slice(0, 16).replace("T", " ") || "—"), 1)
              ])
            ]),
            ft.value?.last_thought ? (w(), x("p", Sa, "此刻的念头：" + h(ft.value.last_thought), 1)) : I("", !0),
            ft.value?.focus ? (w(), x("p", Ma, "当前专注：" + h(ft.value.focus), 1)) : I("", !0),
            ft.value?.active_goal ? (w(), x("p", za, "想推进的目标：" + h(ft.value.active_goal), 1)) : I("", !0),
            s("div", Oa, [
              s("label", Ea, [
                y(s("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": n[40] || (n[40] = (l) => Be.value = l)
                }, null, 512), [
                  [ct, Be.value]
                ]),
                n[161] || (n[161] = s("span", null, "开始时让她先主动说一句", -1))
              ]),
              s("button", {
                class: he(["btn sm", { filled: !ft.value?.alive }]),
                disabled: Yt.value || It.value,
                onClick: n[41] || (n[41] = (l) => ft.value?.alive ? xe() : Ne())
              }, h(Yt.value ? "…" : ft.value?.alive ? "⏸ 暂停生命" : "❍ 开始生命"), 11, Aa)
            ]),
            n[162] || (n[162] = s("p", { class: "hint" }, "「开始生命」一次打开：认知内核 + 常驻思考 + 主动行为（主动消息/做梦），并立刻让她想第一件事。暂停后不再自主思考，但内心状态与记忆都保留。", -1))
          ]),
          s("article", Ia, [
            s("h3", null, [
              n[163] || (n[163] = gt("实时状态 ", -1)),
              s("span", {
                class: he(["count-pill", { ok: tt.value?.enabled }])
              }, h(tt.value?.enabled ? "运行中" : "已停止"), 3)
            ]),
            tt.value ? (w(), x("div", Ba, [
              s("div", Na, [
                n[164] || (n[164] = s("span", null, "仲裁模式", -1)),
                s("strong", null, h(Ze.value?.mode || "—"), 1)
              ]),
              s("div", Da, [
                n[165] || (n[165] = s("span", null, "本轮策略", -1)),
                s("strong", null, h(Ze.value?.action || "—"), 1)
              ]),
              s("div", Ra, [
                n[166] || (n[166] = s("span", null, "控制需求", -1)),
                s("strong", null, h(N(Ze.value?.need)), 1)
              ]),
              s("div", Va, [
                n[167] || (n[167] = s("span", null, "置信度", -1)),
                s("strong", null, h(N(Ze.value?.confidence)), 1)
              ]),
              s("div", Ua, [
                n[168] || (n[168] = s("span", null, "已决策轮数", -1)),
                s("strong", null, h(yt.value?.turns ?? 0), 1)
              ]),
              s("div", Fa, [
                n[169] || (n[169] = s("span", null, "情景痕迹", -1)),
                s("strong", null, h(yt.value?.engrams ?? 0), 1)
              ]),
              s("div", Ha, [
                n[170] || (n[170] = s("span", null, "模型可靠性", -1)),
                s("strong", null, h(N(yt.value?.reliability)), 1)
              ]),
              s("div", Wa, [
                n[171] || (n[171] = s("span", null, "心境", -1)),
                s("strong", null, h(N(Et.value?.mood)), 1)
              ]),
              s("div", Ga, [
                n[172] || (n[172] = s("span", null, "迷走张力", -1)),
                s("strong", null, h(N(Et.value?.vagal_tone)), 1)
              ]),
              s("div", ja, [
                n[173] || (n[173] = s("span", null, "躯体化指数", -1)),
                s("strong", null, h(N(Et.value?.somatization_index)), 1)
              ]),
              s("div", qa, [
                n[174] || (n[174] = s("span", null, "健康焦虑", -1)),
                s("strong", null, h(N(Et.value?.health_anxiety)), 1)
              ]),
              s("div", Ka, [
                n[175] || (n[175] = s("span", null, "躯体负担", -1)),
                s("strong", null, h(N(Et.value?.somatic_burden)), 1)
              ]),
              s("div", $a, [
                n[176] || (n[176] = s("span", null, "人设特质", -1)),
                s("strong", null, h(et.value?.applied ? et.value.source === "llm" ? "已应用 · LLM" : "已应用 · 词典" : "未解析"), 1)
              ]),
              s("div", Xa, [
                n[177] || (n[177] = s("span", null, "词汇量", -1)),
                s("strong", null, h(Z.value?.lexicon_size ?? 0), 1)
              ]),
              s("div", Ya, [
                n[178] || (n[178] = s("span", null, "共情权重", -1)),
                s("strong", null, h(N(ci.value?.empathy)), 1)
              ]),
              s("div", Ja, [
                n[179] || (n[179] = s("span", null, "视角阶段", -1)),
                s("strong", null, h(ci.value?.perspective_name || "—"), 1)
              ]),
              s("div", Qa, [
                n[180] || (n[180] = s("span", null, "注意状态", -1)),
                s("strong", null, h(A.value?.attention_state || "—"), 1)
              ]),
              s("div", tr, [
                n[181] || (n[181] = s("span", null, "耐心", -1)),
                s("strong", null, h(N(A.value?.patience)), 1)
              ]),
              nt.value?.enabled ? (w(), x(pt, { key: 0 }, [
                s("div", er, [
                  n[182] || (n[182] = s("span", null, "依恋型别", -1)),
                  s("strong", null, h(nt.value.label || nt.value.type), 1)
                ]),
                s("div", ir, [
                  n[183] || (n[183] = s("span", null, "病度", -1)),
                  s("strong", null, h(N(nt.value.severity, 2)) + " · " + h(nt.value.band), 1)
                ]),
                s("div", nr, [
                  n[184] || (n[184] = s("span", null, "主导倾向", -1)),
                  s("strong", null, h(nt.value.dominant || "—"), 1)
                ]),
                s("div", or, [
                  n[185] || (n[185] = s("span", null, "依恋压力", -1)),
                  s("strong", null, h(N(nt.value.distress, 2)), 1)
                ]),
                s("div", sr, [
                  n[186] || (n[186] = s("span", null, "抑郁共病", -1)),
                  s("strong", null, h(N(nt.value.comorbid_depression, 2)), 1)
                ])
              ], 64)) : I("", !0),
              $.value?.enabled ? (w(), x(pt, { key: 1 }, [
                s("div", ar, [
                  n[187] || (n[187] = s("span", null, "傲娇型别", -1)),
                  s("strong", null, h($.value.label || $.value.type), 1)
                ]),
                s("div", rr, [
                  n[188] || (n[188] = s("span", null, "好感 A", -1)),
                  s("strong", null, h(N($.value.affection, 2)), 1)
                ]),
                s("div", lr, [
                  n[189] || (n[189] = s("span", null, "傲娇表达 T", -1)),
                  s("strong", null, h(N($.value.expression, 2)), 1)
                ]),
                s("div", ur, [
                  n[190] || (n[190] = s("span", null, "病娇执念 Y", -1)),
                  s("strong", null, h(N($.value.fixation, 2)) + " · " + h($.value.band), 1)
                ]),
                s("div", dr, [
                  n[191] || (n[191] = s("span", null, "安全层", -1)),
                  s("strong", null, h($.value.safe_mode ? "已触发" : "正常"), 1)
                ])
              ], 64)) : I("", !0),
              T.value?.enabled ? (w(), x(pt, { key: 2 }, [
                s("div", hr, [
                  n[192] || (n[192] = s("span", null, "人格原型", -1)),
                  s("strong", null, h(T.value.label || T.value.type), 1)
                ]),
                s("div", cr, [
                  n[193] || (n[193] = s("span", null, "涌现模式", -1)),
                  s("strong", null, h(T.value.mode_label || T.value.mode), 1)
                ]),
                s("div", fr, [
                  n[194] || (n[194] = s("span", null, "就绪度", -1)),
                  s("strong", null, h(N(T.value.pressure, 2)) + " · " + h(T.value.band), 1)
                ]),
                s("div", pr, [
                  n[195] || (n[195] = s("span", null, "好感 A / 焦虑 X", -1)),
                  s("strong", null, h(N(T.value.affection, 2)) + " / " + h(N(T.value.anxiety, 2)), 1)
                ]),
                s("div", _r, [
                  n[196] || (n[196] = s("span", null, "占有 O / 信任 Tr", -1)),
                  s("strong", null, h(N(T.value.possessiveness, 2)) + " / " + h(N(T.value.trust, 2)), 1)
                ]),
                s("div", mr, [
                  n[197] || (n[197] = s("span", null, "自控 K / 抑制 S", -1)),
                  s("strong", null, h(N(T.value.self_control, 2)) + " / " + h(N(T.value.suppression, 2)), 1)
                ]),
                T.value.gender ? (w(), x("div", vr, [
                  n[198] || (n[198] = s("span", null, "性别 / 社会脚本 G", -1)),
                  s("strong", null, h(T.value.gender), 1)
                ])) : I("", !0),
                T.value.help_seek != null ? (w(), x("div", gr, [
                  n[199] || (n[199] = s("span", null, "求助倾向", -1)),
                  s("strong", null, h(N(T.value.help_seek, 2)), 1)
                ])) : I("", !0),
                T.value.big5 ? (w(), x("div", yr, [
                  n[200] || (n[200] = s("span", null, "Big5 O·C·E·A·N", -1)),
                  s("strong", null, h(Y.value), 1)
                ])) : I("", !0),
                T.value.hexaco ? (w(), x("div", br, [
                  n[201] || (n[201] = s("span", null, "HEXACO H·E·X·A·C·O", -1)),
                  s("strong", null, h(F.value), 1)
                ])) : I("", !0),
                T.value.mbti ? (w(), x("div", wr, [
                  n[202] || (n[202] = s("span", null, "MBTI / DISC", -1)),
                  s("strong", null, h(T.value.mbti) + " · " + h(T.value.disc || "—"), 1)
                ])) : I("", !0),
                T.value.theta_dim ? (w(), x("div", xr, [
                  n[203] || (n[203] = s("span", null, "θ 维度 / 区域族", -1)),
                  s("strong", null, h(T.value.theta_dim) + " 维 · " + h(T.value.family || "—"), 1)
                ])) : I("", !0),
                Gt.value.length ? (w(), x("div", Lr, [
                  n[204] || (n[204] = s("span", null, "主导欲望", -1)),
                  s("strong", null, h(Gt.value.join(" · ")), 1)
                ])) : I("", !0),
                fi.value.length ? (w(), x("div", Pr, [
                  n[205] || (n[205] = s("span", null, "主导情绪", -1)),
                  s("strong", null, h(fi.value.join(" · ")), 1)
                ])) : I("", !0),
                T.value.learning?.enabled ? (w(), x("div", Tr, [
                  n[206] || (n[206] = s("span", null, "学习 Q 状态数 / θ 漂移", -1)),
                  s("strong", null, h(T.value.learning.q_size) + " · " + h(N(pi.value, 3)), 1)
                ])) : I("", !0),
                T.value.clinical ? (w(), x("div", kr, [...n[207] || (n[207] = [
                  s("span", null, "临床标签", -1),
                  s("strong", null, "仿真模式（仅抽象标签）", -1)
                ])])) : I("", !0)
              ], 64)) : I("", !0),
              Vt.value ? (w(), x(pt, { key: 3 }, [
                s("div", Cr, [
                  n[208] || (n[208] = s("span", null, "情绪病程", -1)),
                  s("strong", null, h(we(Vt.value.state)), 1)
                ]),
                s("div", Sr, [
                  n[209] || (n[209] = s("span", null, "病程严重度", -1)),
                  s("strong", null, h(N(Vt.value.severity, 2)), 1)
                ]),
                s("div", Mr, [
                  n[210] || (n[210] = s("span", null, "发作 / 复发", -1)),
                  s("strong", null, h(Vt.value.episodes) + " / " + h(Vt.value.relapses), 1)
                ]),
                Vt.value.state === "episode" ? (w(), x("div", zr, [
                  n[211] || (n[211] = s("span", null, "已持续", -1)),
                  s("strong", null, h(N(Vt.value.days_in_episode, 1)) + " 天", 1)
                ])) : I("", !0)
              ], 64)) : I("", !0)
            ])) : (w(), x("div", Za, "尚无状态数据（刷新后显示）")),
            Vt.value ? (w(), x("p", Or, " 情绪病程：连续两次评估越过阈值才算「低落发作」，连续两次回落才算「缓解」；缓解期内再次发作计为「复发」。 它由情绪、快感缺失、稳态负荷、反刍、睡眠合成——沉默与慢性压力会把它推高。 ")) : I("", !0),
            nt.value?.enabled ? (w(), x("p", Er, " 依恋动力学已开启：" + h(nt.value.label) + "。病度 " + h(N(nt.value.severity, 2)) + "（" + h(nt.value.band) + "）由依恋、嫉妒、焦虑、执念等合成； " + h(nt.value.safe_mode ? "已进入安全层（只表达情绪、不给伤害方法）。" : "低于 0.85 不会触发安全层。") + " 它与抑郁双向影响：低落会放大不安、依恋压力也会拖累情绪。 ", 1)) : I("", !0),
            $.value?.enabled ? (w(), x("p", Ar, " 傲娇动力学已开启：" + h($.value.label || $.value.type) + "。好感 A " + h(N($.value.affection, 2)) + " / 傲娇表达 T " + h(N($.value.expression, 2)) + " / 病娇执念 Y " + h(N($.value.fixation, 2)) + "（" + h($.value.band) + "）。 Y 越过 0.60 进入「过渡/黑化倾向」，越过 1.00 视为「病娇」——可逆。它由真实信号驱动：亲密度、回复延迟、被冷落天数，以及对方提及「别人」。 " + h($.value.safe_mode ? "已进入安全层（只表达占有情绪，不给伤害方法）。" : "低于 0.85 不会触发安全层。"), 1)) : I("", !0),
            T.value?.enabled ? (w(), x("p", Ir, " 人格动力学已开启：" + h(T.value.label || T.value.type) + "（" + h(T.value.family || "—") + " 族，θ " + h(T.value.theta_dim) + " 维），当前涌现模式「" + h(T.value.mode_label || T.value.mode) + "」。 就绪度 " + h(N(T.value.pressure, 2)) + "（" + h(T.value.band) + "）由占有 O、焦虑 X、自控 K、信任 Tr 四条件联合给出——模式判定需要四条同时越阈，性欲不是根因。 傲娇过滤来自「高好感 × 高抑制」（表达被延迟、被反话包裹）；黑化是近似不可逆的相变（敏化滞后 + 模式—行为锁定）。 状态由 16 维欲望 D 与 16 维情绪 x 驱动，可读出 Big5 / HEXACO / MBTI / DISC 与主导欲望、情绪；性别·社会脚本 G 会改变表达抑制与求助倾向（" + h(T.value.gender || "未指定") + "）。 " + h(T.value.learning?.enabled ? "学习算子 L 在线：结果会小幅更新 Q 值与 θ 漂移。" : "") + " " + h(T.value.safe_mode ? "已进入安全层（只表达感受、请求陪伴，不给伤害方法）。" : "低于 0.85 不会触发安全层。"), 1)) : I("", !0),
            et.value?.applied ? (w(), x("p", Zr, "人设特质已生效（" + h(et.value.source === "llm" ? "LLM 精修" : "本地词典") + "）：" + h(un.value || "—") + "。改人设请到 设置 → 人设，下一条消息自动生效。", 1)) : I("", !0),
            De.value ? (w(), x("div", Br, [
              (w(!0), x(pt, null, $t(De.value, (l, z) => (w(), x("div", {
                key: z,
                class: "som-chan"
              }, [
                s("span", Nr, h(_i(z)), 1),
                s("span", Dr, [
                  s("i", {
                    style: On({ transform: "scaleX(" + Ui(l) + ")" })
                  }, null, 4)
                ]),
                s("span", Rr, h(N(l, 2)), 1)
              ]))), 128)),
              Number(Et.value?.somatic_chronicity) > 0.1 ? (w(), x("p", Vr, "慢性化程度 " + h(N(Et.value?.somatic_chronicity)) + " — 反复报告的通道已开始敏化。", 1)) : I("", !0)
            ])) : I("", !0)
          ]),
          s("article", Ur, [
            n[218] || (n[218] = s("h3", null, "总开关与提示词调节", -1)),
            s("div", Fr, [
              s("label", Hr, [
                y(s("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": n[42] || (n[42] = (l) => m.value.cog_enabled = l)
                }, null, 512), [
                  [ct, m.value.cog_enabled]
                ]),
                n[212] || (n[212] = s("span", null, "启用认知内核", -1))
              ]),
              s("label", Wr, [
                y(s("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": n[43] || (n[43] = (l) => m.value.cog_lite_mode = l)
                }, null, 512), [
                  [ct, m.value.cog_lite_mode]
                ]),
                n[213] || (n[213] = s("span", null, "极简省 token 模式", -1))
              ]),
              s("label", Gr, [
                y(s("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": n[44] || (n[44] = (l) => m.value.cog_modulate_affect = l)
                }, null, 512), [
                  [ct, m.value.cog_modulate_affect]
                ]),
                n[214] || (n[214] = s("span", null, "情感影响提示词", -1))
              ]),
              s("label", jr, [
                y(s("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": n[45] || (n[45] = (l) => m.value.cog_modulate_language = l)
                }, null, 512), [
                  [ct, m.value.cog_modulate_language]
                ]),
                n[215] || (n[215] = s("span", null, "语言影响提示词", -1))
              ]),
              s("label", qr, [
                y(s("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": n[46] || (n[46] = (l) => m.value.cog_modulate_social = l)
                }, null, 512), [
                  [ct, m.value.cog_modulate_social]
                ]),
                n[216] || (n[216] = s("span", null, "社会认知影响提示词", -1))
              ]),
              s("label", Kr, [
                y(s("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": n[47] || (n[47] = (l) => m.value.cog_modulate_selfhood = l)
                }, null, 512), [
                  [ct, m.value.cog_modulate_selfhood]
                ]),
                n[217] || (n[217] = s("span", null, "自我与时间影响提示词", -1))
              ])
            ]),
            n[219] || (n[219] = s("p", { class: "hint" }, " 极简省 token 模式：把 THINK + OUTPUT 两段长提示词合并为一条最小指令，并跳过工具表、技能表、外部观察与认知波次上下文—— 每轮消耗显著下降，适合长时间闲聊。角色仍会按人设推理，只是脚手架更少。关掉即恢复完整模式。 ", -1))
          ]),
          s("article", $r, [
            n[220] || (n[220] = s("h3", null, "快速预设", -1)),
            n[221] || (n[221] = s("p", { class: "hint" }, '一键套用常见配置并保存（套用后仍可逐项微调）：常规、抑郁倾向、病娇（独占 / 依存 / 妄想）。病娇预设会同时把情绪调节画像设为 depression，贴合"常伴抑郁"。', -1)),
            s("div", Xr, [
              (w(), x(pt, null, $t(Vi, (l) => s("button", {
                key: l.label,
                type: "button",
                class: "btn sm",
                onClick: (z) => ln(l.fields, l.label)
              }, h(l.label), 9, Yr)), 64))
            ])
          ]),
          s("div", Jr, [
            s("article", Qr, [
              n[236] || (n[236] = s("h3", null, "决策仲裁（第一波）", -1)),
              s("div", tl, [
                s("label", null, [
                  n[222] || (n[222] = s("span", null, "规划深度", -1)),
                  y(s("input", {
                    "onUpdate:modelValue": n[48] || (n[48] = (l) => m.value.cog_plan_depth = l),
                    type: "number",
                    min: "1",
                    max: "6",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      S,
                      m.value.cog_plan_depth,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                s("label", null, [
                  n[223] || (n[223] = s("span", null, "工作记忆容量", -1)),
                  y(s("input", {
                    "onUpdate:modelValue": n[49] || (n[49] = (l) => m.value.cog_wm_capacity = l),
                    type: "number",
                    min: "1",
                    max: "12",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      S,
                      m.value.cog_wm_capacity,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                s("label", null, [
                  n[224] || (n[224] = s("span", null, "策略温度 τ", -1)),
                  y(s("input", {
                    "onUpdate:modelValue": n[50] || (n[50] = (l) => m.value.cog_tau = l),
                    type: "number",
                    step: "0.05",
                    min: "0.05",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      S,
                      m.value.cog_tau,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                s("label", null, [
                  n[225] || (n[225] = s("span", null, "折扣 γ", -1)),
                  y(s("input", {
                    "onUpdate:modelValue": n[51] || (n[51] = (l) => m.value.cog_gamma = l),
                    type: "number",
                    step: "0.01",
                    min: "0",
                    max: "0.999",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      S,
                      m.value.cog_gamma,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                s("label", null, [
                  n[226] || (n[226] = s("span", null, "习惯学习率", -1)),
                  y(s("input", {
                    "onUpdate:modelValue": n[52] || (n[52] = (l) => m.value.cog_alpha_habit = l),
                    type: "number",
                    step: "0.01",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      S,
                      m.value.cog_alpha_habit,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                s("label", null, [
                  n[227] || (n[227] = s("span", null, "无模型学习率", -1)),
                  y(s("input", {
                    "onUpdate:modelValue": n[53] || (n[53] = (l) => m.value.cog_alpha_mf = l),
                    type: "number",
                    step: "0.01",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      S,
                      m.value.cog_alpha_mf,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                s("label", null, [
                  n[228] || (n[228] = s("span", null, "惊讶阈值 θ_pe", -1)),
                  y(s("input", {
                    "onUpdate:modelValue": n[54] || (n[54] = (l) => m.value.cog_theta_pe = l),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      S,
                      m.value.cog_theta_pe,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                s("label", null, [
                  n[229] || (n[229] = s("span", null, "新颖阈值 θ_n", -1)),
                  y(s("input", {
                    "onUpdate:modelValue": n[55] || (n[55] = (l) => m.value.cog_theta_n = l),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      S,
                      m.value.cog_theta_n,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                s("label", null, [
                  n[230] || (n[230] = s("span", null, "前瞻视野", -1)),
                  y(s("input", {
                    "onUpdate:modelValue": n[56] || (n[56] = (l) => m.value.cog_prospection_horizon = l),
                    type: "number",
                    min: "1",
                    max: "8",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      S,
                      m.value.cog_prospection_horizon,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ])
              ]),
              s("div", el, [
                s("label", il, [
                  y(s("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": n[57] || (n[57] = (l) => m.value.cog_use_thalamic_gate = l)
                  }, null, 512), [
                    [ct, m.value.cog_use_thalamic_gate]
                  ]),
                  n[231] || (n[231] = s("span", null, "丘脑门控", -1))
                ]),
                s("label", nl, [
                  y(s("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": n[58] || (n[58] = (l) => m.value.cog_use_cerebellum = l)
                  }, null, 512), [
                    [ct, m.value.cog_use_cerebellum]
                  ]),
                  n[232] || (n[232] = s("span", null, "小脑预测误差", -1))
                ]),
                s("label", ol, [
                  y(s("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": n[59] || (n[59] = (l) => m.value.cog_use_ofc_map = l)
                  }, null, 512), [
                    [ct, m.value.cog_use_ofc_map]
                  ]),
                  n[233] || (n[233] = s("span", null, "OFC 认知地图", -1))
                ]),
                s("label", sl, [
                  y(s("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": n[60] || (n[60] = (l) => m.value.cog_use_prospection = l)
                  }, null, 512), [
                    [ct, m.value.cog_use_prospection]
                  ]),
                  n[234] || (n[234] = s("span", null, "未来奖赏前瞻", -1))
                ]),
                s("label", al, [
                  y(s("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": n[61] || (n[61] = (l) => m.value.cog_use_limbic_bias = l)
                  }, null, 512), [
                    [ct, m.value.cog_use_limbic_bias]
                  ]),
                  n[235] || (n[235] = s("span", null, "边缘系统偏向", -1))
                ])
              ])
            ]),
            s("article", rl, [
              n[244] || (n[244] = s("h3", null, "情感与生理（第二波）", -1)),
              s("div", ll, [
                s("label", null, [
                  n[237] || (n[237] = s("span", null, "情绪调节画像", -1)),
                  St(zt, {
                    modelValue: m.value.cog_affect_profile,
                    "onUpdate:modelValue": n[62] || (n[62] = (l) => m.value.cog_affect_profile = l),
                    options: Ni,
                    "aria-label": "情绪调节画像"
                  }, null, 8, ["modelValue"])
                ]),
                s("label", null, [
                  n[238] || (n[238] = s("span", null, "迷走基线", -1)),
                  y(s("input", {
                    "onUpdate:modelValue": n[63] || (n[63] = (l) => m.value.cog_affect_vagal = l),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      S,
                      m.value.cog_affect_vagal,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                s("label", null, [
                  n[239] || (n[239] = s("span", null, "威胁基线", -1)),
                  y(s("input", {
                    "onUpdate:modelValue": n[64] || (n[64] = (l) => m.value.cog_affect_threat = l),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      S,
                      m.value.cog_affect_threat,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                s("label", null, [
                  n[240] || (n[240] = s("span", null, "奖赏基线", -1)),
                  y(s("input", {
                    "onUpdate:modelValue": n[65] || (n[65] = (l) => m.value.cog_affect_reward = l),
                    type: "number",
                    step: "0.1",
                    min: "0",
                    max: "2",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      S,
                      m.value.cog_affect_reward,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ])
              ]),
              s("label", ul, [
                y(s("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": n[66] || (n[66] = (l) => m.value.cog_affect_enabled = l)
                }, null, 512), [
                  [ct, m.value.cog_affect_enabled]
                ]),
                n[241] || (n[241] = s("span", null, "启用情感与生理回路", -1))
              ]),
              s("label", dl, [
                y(s("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": n[67] || (n[67] = (l) => m.value.cog_affect_somatic = l)
                }, null, 512), [
                  [ct, m.value.cog_affect_somatic]
                ]),
                n[242] || (n[242] = s("span", null, "启用躯体化网关（人设含体弱、心慌等标记时自动开启）", -1))
              ]),
              s("label", hl, [
                y(s("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": n[68] || (n[68] = (l) => m.value.cog_affect_persona_llm = l)
                }, null, 512), [
                  [ct, m.value.cog_affect_persona_llm]
                ]),
                n[243] || (n[243] = s("span", null, "人设特质由模型理解（改动人设后下一条消息精修一次，失败自动回退本地词典）", -1))
              ])
            ]),
            s("article", cl, [
              n[248] || (n[248] = s("h3", null, "语言习得（第三波）", -1)),
              s("div", fl, [
                s("label", null, [
                  n[245] || (n[245] = s("span", null, "语言-思维耦合", -1)),
                  St(zt, {
                    modelValue: m.value.cog_language_framing,
                    "onUpdate:modelValue": n[69] || (n[69] = (l) => m.value.cog_language_framing = l),
                    options: Di,
                    "aria-label": "语言-思维耦合"
                  }, null, 8, ["modelValue"])
                ]),
                s("label", null, [
                  n[246] || (n[246] = s("span", null, "分词边界阈值", -1)),
                  y(s("input", {
                    "onUpdate:modelValue": n[70] || (n[70] = (l) => m.value.cog_language_boundary = l),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      S,
                      m.value.cog_language_boundary,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ])
              ]),
              s("label", pl, [
                y(s("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": n[71] || (n[71] = (l) => m.value.cog_language_enabled = l)
                }, null, 512), [
                  [ct, m.value.cog_language_enabled]
                ]),
                n[247] || (n[247] = s("span", null, "启用语言习得回路", -1))
              ])
            ]),
            s("article", _l, [
              n[252] || (n[252] = s("h3", null, "社会学习（第四波）", -1)),
              s("div", ml, [
                s("label", null, [
                  n[249] || (n[249] = s("span", null, "共情权重", -1)),
                  y(s("input", {
                    "onUpdate:modelValue": n[72] || (n[72] = (l) => m.value.cog_social_empathy = l),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      S,
                      m.value.cog_social_empathy,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                s("label", null, [
                  n[250] || (n[250] = s("span", null, "观点采择阶段", -1)),
                  St(zt, {
                    modelValue: hi.value,
                    "onUpdate:modelValue": n[73] || (n[73] = (l) => hi.value = l),
                    options: di,
                    "aria-label": "观点采择阶段"
                  }, null, 8, ["modelValue"])
                ])
              ]),
              s("label", vl, [
                y(s("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": n[74] || (n[74] = (l) => m.value.cog_social_enabled = l)
                }, null, 512), [
                  [ct, m.value.cog_social_enabled]
                ]),
                n[251] || (n[251] = s("span", null, "启用社会学习回路", -1))
              ])
            ]),
            s("article", gl, [
              n[256] || (n[256] = s("h3", null, "自我与时间（第四波）", -1)),
              s("div", yl, [
                s("label", null, [
                  n[253] || (n[253] = s("span", null, "时间折扣 k", -1)),
                  y(s("input", {
                    "onUpdate:modelValue": n[75] || (n[75] = (l) => m.value.cog_selfhood_discount = l),
                    type: "number",
                    step: "0.05",
                    min: "0",
                    max: "1",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      S,
                      m.value.cog_selfhood_discount,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                s("label", null, [
                  n[254] || (n[254] = s("span", null, "人设细节尺度", -1)),
                  y(s("input", {
                    "onUpdate:modelValue": n[76] || (n[76] = (l) => m.value.cog_selfhood_detail = l),
                    type: "number",
                    step: "1",
                    min: "1",
                    max: "50",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      S,
                      m.value.cog_selfhood_detail,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ])
              ]),
              s("label", bl, [
                y(s("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": n[77] || (n[77] = (l) => m.value.cog_selfhood_enabled = l)
                }, null, 512), [
                  [ct, m.value.cog_selfhood_enabled]
                ]),
                n[255] || (n[255] = s("span", null, "启用自我与时间回路", -1))
              ])
            ]),
            s("article", wl, [
              n[259] || (n[259] = s("h3", null, "病态依恋 / 病娇（可选）", -1)),
              n[260] || (n[260] = s("p", { class: "hint" }, ' 把"占有欲、嫉妒、黏人、多疑"做成一个**会自己演化的状态**，而不是一句人设标签。默认关闭； 开启后由真实互动驱动——你的消息、回复快慢、沉默天数、是否提到别人、睡眠——并和抑郁互相影响。 无论多严重，极重度（≥0.85）都会自动进入安全层：只表达情绪、请求陪伴，不生成自伤或伤人的方法。 ', -1)),
              s("label", xl, [
                y(s("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": n[78] || (n[78] = (l) => m.value.cog_attachment_enabled = l)
                }, null, 512), [
                  [ct, m.value.cog_attachment_enabled]
                ]),
                n[257] || (n[257] = s("span", null, "启用依恋动力学", -1))
              ]),
              s("div", Ll, [
                s("label", null, [
                  n[258] || (n[258] = s("span", null, "依恋型别", -1)),
                  St(zt, {
                    modelValue: m.value.cog_attachment_type,
                    "onUpdate:modelValue": n[79] || (n[79] = (l) => m.value.cog_attachment_type = l),
                    options: an,
                    "aria-label": "依恋型别"
                  }, null, 8, ["modelValue"])
                ])
              ]),
              n[261] || (n[261] = s("p", { class: "hint" }, ' 怎么配：① 打开开关并选型别（独占 / 依存 / 妄想 / 监视 / 自伤 / 排除）—— 型别只改变"同一种动力的权重"，不是硬编码台词；或 ② 直接在人设里写关键词， 系统会自动启用并按人设填初始值：如"占有欲强、爱吃醋"→独占型，"很黏人、离不开你"→依存型， "老是查岗、跟踪"→监视型，"疑神疑鬼、总觉得被骗"→妄想型。想更贴近"病娇常伴抑郁"， 把上方「情绪调节画像」设为 depression，两者会互相加重。 ', -1))
            ]),
            s("article", Pl, [
              n[264] || (n[264] = s("h3", null, "傲娇 / 病娇动力学（可选）", -1)),
              n[265] || (n[265] = s("p", { class: "hint" }, ' 把"表面毒舌、内心温柔"和"以爱为名的执念"做成同一个**会自己演化的三变量系统** （好感 A / 傲娇表达 T / 病娇执念 Y）。默认关闭；开启后由真实互动驱动—— 你的消息温度、回复快慢、沉默天数、是否提到别人——并且病娇化是可逆的： 停止冷遇、持续关爱就会退回傲娇。极重度（≥0.85）自动进入安全层。 ', -1)),
              s("label", Tl, [
                y(s("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": n[80] || (n[80] = (l) => m.value.cog_tsundere_enabled = l)
                }, null, 512), [
                  [ct, m.value.cog_tsundere_enabled]
                ]),
                n[262] || (n[262] = s("span", null, "启用傲娇动力学", -1))
              ]),
              s("div", kl, [
                s("label", null, [
                  n[263] || (n[263] = s("span", null, "傲娇型别", -1)),
                  St(zt, {
                    modelValue: m.value.cog_tsundere_type,
                    "onUpdate:modelValue": n[81] || (n[81] = (l) => m.value.cog_tsundere_type = l),
                    options: Bi,
                    "aria-label": "傲娇型别"
                  }, null, 8, ["modelValue"])
                ])
              ]),
              n[266] || (n[266] = s("p", { class: "hint" }, ' 怎么配：① 打开开关并选型别（经典 / 高冷 / 暴躁 / 迁就）——型别只改变 "同一种动力的权重"（黑化快慢、嘴硬程度），不是硬编码台词；或 ② 直接在人设里写关键词， 系统会自动启用并按人设填初始值：如"口嫌体正直、嘴硬"→经典傲娇，"高冷、冰山"→高冷傲娇， "一点就炸、暴躁"→暴躁傲娇，"好脾气、别扭地关心"→迁就傲娇。若人设里还写了"病娇/占有欲"， 建议同时启用上方「病态依恋」，两者会互相影响。 ', -1))
            ]),
            s("article", Cl, [
              n[270] || (n[270] = s("h3", null, "人格动力学（可选 · 完整版）", -1)),
              n[271] || (n[271] = s("p", { class: "hint" }, ' 把「性格标签」变成参数空间里的动力学系统：慢变人格参数 θ（12 组 / 69 维：大五、HEXACO、 依恋、气质、调节、暗黑、动机、认知、关系、价值、临床、表达）+ 快变欲望向量 D（16 维） + 情绪状态 x（16 维）+ 模式状态机 T + 性别/社会脚本参数组 G + 学习/发展算子 L。默认关闭； 开启后由真实互动驱动，三种模式会自然涌现：**正常型是稳定吸引子**（扰动后指数回落到基线）、 **傲娇是"高好感×高抑制"的过滤态**、**病娇是"高占有×高焦虑×低信任×低自控"的正反馈**—— 并且傲娇→病娇是可观测、可测试、近似不可逆（敏化滞后）的相变。就绪度 ≥0.85 自动进入安全层。 ', -1)),
              s("label", Sl, [
                y(s("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": n[82] || (n[82] = (l) => m.value.cog_personadyn_enabled = l)
                }, null, 512), [
                  [ct, m.value.cog_personadyn_enabled]
                ]),
                n[267] || (n[267] = s("span", null, "启用人格动力学", -1))
              ]),
              s("div", Ml, [
                s("label", null, [
                  n[268] || (n[268] = s("span", null, "人格原型", -1)),
                  St(zt, {
                    modelValue: m.value.cog_personadyn_type,
                    "onUpdate:modelValue": n[83] || (n[83] = (l) => m.value.cog_personadyn_type = l),
                    options: Ae,
                    "aria-label": "人格原型"
                  }, null, 8, ["modelValue"])
                ]),
                s("label", null, [
                  n[269] || (n[269] = s("span", null, "性别 / 社会脚本 G", -1)),
                  St(zt, {
                    modelValue: m.value.cog_personadyn_gender,
                    "onUpdate:modelValue": n[84] || (n[84] = (l) => m.value.cog_personadyn_gender = l),
                    options: Ie,
                    "aria-label": "性别社会脚本"
                  }, null, 8, ["modelValue"])
                ])
              ]),
              n[272] || (n[272] = s("p", { class: "hint" }, " 类型库共 187 个区域（依恋 12 · 大五/HEXACO 组合 · 临床仿真 16 · 九型 9 · MBTI 16 自动派生 · DISC 4 · 社会角色 13 · 动机 11 · 认知风格 13 · ACG 女性/中性 16 · 男性原型 77 + 经典 18）。 **类型只是参数空间中的区域，不是硬编码台词**：定义 (θ, D⁰, x_eq, w, g, T, A) 即可新增一种。 临床仿真型（边缘/自恋/抑郁…）只做抽象标签且**禁止部署**——面板不会给出具体方法。 「性别/社会脚本」是 G=(M,F,GRC,EM,DR,AR,SR,SC,HS)：改变表达增益 g、威胁信号 s、自控 K、 共情 C、求助倾向与决策效用 R_G(a)；选「未指定」时所有公式与不带脚本时完全一致。 ", -1)),
              n[273] || (n[273] = s("p", { class: "hint" }, ' 怎么配：① 打开开关并选原型——原型只改变参数，不是硬编码台词； 或 ② 直接在人设里写关键词，系统自动启用并按人设填初始值：如"嘴上不饶人其实很黏"→傲娇型， "病娇、占有欲极强"→病娇型，"霸总、说一不二"→霸总（自动套用「高传统男性」脚本）。 它与「傲娇 / 病娇动力学」可以同时开：后者是三变量速写，前者是完整的 θ/D/x/f/g/T/G/L 框架，两者互不冲突。 ', -1))
            ]),
            s("article", zl, [
              n[278] || (n[278] = s("h3", null, "记忆与巩固（默认开启）", -1)),
              n[279] || (n[279] = s("p", { class: "hint" }, "这四项决定「经历会不会留下痕迹」：写入情景记忆、睡眠期回放、日终再巩固、交错学习（CLS）。默认开启——关掉时人格被固定在人设上，经历不留痕，行为与无认知内核时完全一致（可逐个消融）。", -1)),
              s("div", Ol, [
                s("label", El, [
                  y(s("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": n[85] || (n[85] = (l) => m.value.cog_memory_encode = l)
                  }, null, 512), [
                    [ct, m.value.cog_memory_encode]
                  ]),
                  n[274] || (n[274] = s("span", null, "选择性情景编码", -1))
                ]),
                s("label", Al, [
                  y(s("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": n[86] || (n[86] = (l) => m.value.cog_sleep_replay = l)
                  }, null, 512), [
                    [ct, m.value.cog_sleep_replay]
                  ]),
                  n[275] || (n[275] = s("span", null, "睡眠期回放巩固", -1))
                ]),
                s("label", Il, [
                  y(s("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": n[87] || (n[87] = (l) => m.value.cog_memory_reconsolidate = l)
                  }, null, 512), [
                    [ct, m.value.cog_memory_reconsolidate]
                  ]),
                  n[276] || (n[276] = s("span", null, "日终痕迹再巩固", -1))
                ]),
                s("label", Zl, [
                  y(s("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": n[88] || (n[88] = (l) => m.value.cog_cls_interleave = l)
                  }, null, 512), [
                    [ct, m.value.cog_cls_interleave]
                  ]),
                  n[277] || (n[277] = s("span", null, "交错学习 + 一致性门控（CLS）", -1))
                ])
              ])
            ])
          ])
        ], 512), [
          [Ai, U.value === "cognition"]
        ]),
        y(s("section", Bl, [
          s("div", { class: "section-head" }, [
            n[280] || (n[280] = s("div", null, [
              s("h2", null, "世界"),
              s("p", { class: "desc" }, "本地小模型驱动的虚构生活世界：事件、演员表与账本。默认关闭。")
            ], -1)),
            s("div", { class: "head-actions" }, [
              s("button", {
                class: "btn filled sm",
                onClick: _e
              }, "保存设置")
            ])
          ]),
          s("article", Nl, [
            n[282] || (n[282] = s("h3", null, "虚构浓度", -1)),
            s("div", Dl, [
              s("label", null, [
                n[281] || (n[281] = s("span", null, "world_density", -1)),
                St(zt, {
                  modelValue: Ue.value,
                  "onUpdate:modelValue": n[89] || (n[89] = (l) => Ue.value = l),
                  options: Hi,
                  "aria-label": "虚构浓度"
                }, null, 8, ["modelValue"])
              ])
            ]),
            n[283] || (n[283] = s("p", { class: "hint" }, "off 完全不影响现有行为；texture 只把事件写进时间线与记忆；full 允许作为主动话题提及（上线需你明确确认）。", -1))
          ]),
          s("article", Rl, [
            n[285] || (n[285] = s("h3", null, "人设 → 特质数据", -1)),
            n[286] || (n[286] = s("p", { class: "hint" }, "把角色人设写在这里（性格、体质、作息、情绪风格）。保存后解析为认知内核的特质参数（威胁、奖赏基线、情绪调节画像、躯体化增益、作息等）：默认先由本地词典即时生效，并由模型对改动人设做一次精修（失败自动回退词典）。写明「体弱多病 / 心慌失眠」等会自动开启躯体化网关。", -1)),
            s("label", Vl, [
              n[284] || (n[284] = s("span", { class: "world-label" }, "人设文本", -1)),
              y(s("textarea", {
                "onUpdate:modelValue": n[90] || (n[90] = (l) => We.value = l),
                class: "world-text",
                rows: "4",
                placeholder: "例：她性格开朗但容易焦虑，体质偏弱，经常心慌失眠，遇到事爱钻牛角尖。"
              }, null, 512), [
                [S, We.value]
              ])
            ])
          ]),
          s("article", Ul, [
            n[295] || (n[295] = s("h3", null, "世界观 · 定位", -1)),
            n[296] || (n[296] = s("p", { class: "hint" }, "说清这是哪里：国家 / 城市 / 小区（可真实可虚构）。填不全也没关系——点「AI 完善」会补全设定并生成一份带坐标的地图。改了演员或地点后，之前生成的事件会作废、重新开始。", -1)),
            s("div", Fl, [
              s("label", null, [
                n[287] || (n[287] = s("span", null, "世界类型", -1)),
                St(zt, {
                  modelValue: pe.value,
                  "onUpdate:modelValue": n[91] || (n[91] = (l) => pe.value = l),
                  options: dn,
                  "aria-label": "世界类型"
                }, null, 8, ["modelValue"])
              ]),
              s("label", null, [
                n[288] || (n[288] = s("span", null, "国家", -1)),
                y(s("input", {
                  "onUpdate:modelValue": n[92] || (n[92] = (l) => Le.value = l),
                  class: "field",
                  placeholder: "中国 / 架空：曦京"
                }, null, 512), [
                  [S, Le.value]
                ])
              ]),
              s("label", null, [
                n[289] || (n[289] = s("span", null, "城市", -1)),
                y(s("input", {
                  "onUpdate:modelValue": n[93] || (n[93] = (l) => Fe.value = l),
                  class: "field",
                  placeholder: "杭州 / 临海市"
                }, null, 512), [
                  [S, Fe.value]
                ])
              ]),
              s("label", null, [
                n[290] || (n[290] = s("span", null, "城区 · 小区", -1)),
                y(s("input", {
                  "onUpdate:modelValue": n[94] || (n[94] = (l) => Jt.value = l),
                  class: "field",
                  placeholder: "西湖区 · 文一西路"
                }, null, 512), [
                  [S, Jt.value]
                ])
              ])
            ]),
            s("label", Hl, [
              n[291] || (n[291] = s("span", { class: "world-label" }, "世界设定 / 前言", -1)),
              y(s("textarea", {
                "onUpdate:modelValue": n[95] || (n[95] = (l) => He.value = l),
                class: "world-text",
                rows: "3",
                placeholder: "例：她住在一座临海小城，开着一家旧书店，养了一只叫煤球的猫。"
              }, null, 512), [
                [S, He.value]
              ])
            ]),
            s("label", Wl, [
              n[292] || (n[292] = s("span", { class: "world-label" }, "演员表（每行一个：名字 — 名字|关系；关系可为 朋友/同事/家人）", -1)),
              y(s("textarea", {
                "onUpdate:modelValue": n[96] || (n[96] = (l) => Pe.value = l),
                class: "world-text",
                rows: "4",
                placeholder: `林小满|朋友
阿哲|同事
妈妈|家人`
              }, null, 512), [
                [S, Pe.value]
              ])
            ]),
            s("label", Gl, [
              n[293] || (n[293] = s("span", { class: "world-label" }, "地点（逗号或换行分隔）", -1)),
              y(s("textarea", {
                "onUpdate:modelValue": n[97] || (n[97] = (l) => Te.value = l),
                class: "world-text",
                rows: "2",
                placeholder: "楼下便利店, 常去的咖啡馆, 城西书店"
              }, null, 512), [
                [S, Te.value]
              ])
            ]),
            s("div", jl, [
              s("button", {
                class: "btn filled sm",
                type: "button",
                disabled: Zt.value,
                onClick: me
              }, h(Zt.value ? "生成中…" : "✦ 只生成地图（保留设定）"), 9, ql),
              s("button", {
                class: "btn tonic sm",
                type: "button",
                disabled: Zt.value,
                onClick: Je
              }, h(Zt.value ? "生成中…" : "AI 完善设定 + 生成地图"), 9, Kl),
              n[294] || (n[294] = s("span", { class: "hint" }, "「只生成地图」不会动上面的设定文本；「完善设定」会用它重写设定。", -1))
            ])
          ]),
          s("article", $l, [
            s("div", Xl, [
              s("h3", null, [
                n[297] || (n[297] = gt("世界地图 ", -1)),
                s("span", Yl, h(R.value.locations.length), 1)
              ]),
              jt.value ? (w(), x("span", Jl, h(jt.value.fictional ? "虚构" : "真实") + " · " + h([jt.value.country, jt.value.city, jt.value.district].filter(Boolean).join(" / ") || "未命名"), 1)) : I("", !0)
            ]),
            jt.value?.premise ? (w(), x("p", Ql, h(jt.value.premise), 1)) : I("", !0),
            s("div", tu, [
              s("div", {
                ref_key: "mapEl",
                ref: je,
                class: he(["world-map-leaflet", { "is-empty": !R.value.locations.length }])
              }, null, 2),
              kt.value ? (w(), x("div", eu, "底图加载失败（可能离线），仍可查看城市标记")) : I("", !0),
              R.value.locations.length ? (w(), x(pt, { key: 1 }, [
                R.value.kind !== "real" && R.value.nation ? (w(), x("button", {
                  key: 0,
                  type: "button",
                  class: "wm-scope",
                  onClick: _n
                }, h(oe.value === "city" ? "全国视图" : "城市视图"), 1)) : I("", !0),
                s("button", {
                  type: "button",
                  class: "wm-reset",
                  onClick: pn
                }, "⟲ 复位视角"),
                R.value.kind !== "real" && oe.value === "city" ? (w(), x("div", iu, [...n[298] || (n[298] = [
                  s("i", null, "N", -1)
                ])])) : I("", !0)
              ], 64)) : I("", !0)
            ]),
            R.value.locations.length ? I("", !0) : (w(), x("p", nu, "还没有地图。点上面的「AI 完善并生成地图」。")),
            R.value.locations.length ? (w(), x("div", ou, [
              (w(!0), x(pt, null, $t(fn.value, (l) => (w(), x("span", { key: l }, [
                s("i", {
                  class: he("k-" + l)
                }, null, 2),
                gt(h(vi[l]), 1)
              ]))), 128)),
              s("span", null, [
                n[299] || (n[299] = s("i", { class: "k-actor" }, null, -1)),
                gt("角色（" + h(R.value.actors.length) + "）", 1)
              ]),
              R.value.kind !== "real" ? (w(), x(pt, { key: 0 }, [
                n[300] || (n[300] = ms('<span data-v-48211299><i class="k-hw" data-v-48211299></i>高速/环线</span><span data-v-48211299><i class="k-arterial" data-v-48211299></i>主干道</span><span data-v-48211299><i class="k-street" data-v-48211299></i>街道</span><span data-v-48211299><i class="k-metro" data-v-48211299></i>地铁</span><span data-v-48211299><i class="k-bus" data-v-48211299></i>公交</span><span data-v-48211299><i class="k-park2" data-v-48211299></i>公园</span><span data-v-48211299><i class="k-water" data-v-48211299></i>水域</span>', 7))
              ], 64)) : I("", !0)
            ])) : I("", !0),
            R.value.locations.length && R.value.kind !== "real" && oe.value === "city" ? (w(), x("div", su, [
              (R.value.metro || []).length ? (w(), x("div", au, [
                n[301] || (n[301] = s("h4", null, "地铁线路表", -1)),
                s("ul", null, [
                  (w(!0), x(pt, null, $t(R.value.metro, (l, z) => (w(), x("li", {
                    key: "m" + z
                  }, [
                    s("b", {
                      style: On({ color: l.color })
                    }, h(l.name), 5),
                    s("span", null, h((l.stations || []).map((k) => k.name).filter(Boolean).join(" · ")), 1)
                  ]))), 128))
                ])
              ])) : I("", !0),
              (R.value.bus || []).length ? (w(), x("div", ru, [
                n[302] || (n[302] = s("h4", null, "公交线路表", -1)),
                s("ul", null, [
                  (w(!0), x(pt, null, $t(R.value.bus, (l, z) => (w(), x("li", {
                    key: "b" + z
                  }, [
                    s("b", {
                      style: On({ color: l.color })
                    }, h(l.name), 5),
                    s("span", null, h((l.stops || []).map((k) => k.name).filter(Boolean).join(" · ")), 1)
                  ]))), 128))
                ])
              ])) : I("", !0)
            ])) : I("", !0)
          ]),
          s("article", lu, [
            s("div", uu, [
              s("h3", null, [
                n[303] || (n[303] = gt("最近世界事件 ", -1)),
                s("span", du, h(fe.value.length), 1)
              ]),
              fe.value.length ? (w(), x("button", {
                key: 0,
                type: "button",
                class: "btn tonic sm",
                onClick: ve
              }, "清除世界事件")) : I("", !0)
            ]),
            s("ol", hu, [
              (w(!0), x(pt, null, $t(fe.value, (l) => (w(), x("li", {
                key: l.id
              }, [
                s("span", cu, h(l.created_at), 1),
                s("strong", null, h(l.summary), 1)
              ]))), 128)),
              fe.value.length ? I("", !0) : (w(), x("li", fu, "还没有世界事件（开启后由本地模型生成）。"))
            ])
          ])
        ], 512), [
          [Ai, U.value === "world"]
        ]),
        y(s("section", pu, [
          s("div", _u, [
            n[304] || (n[304] = s("div", null, [
              s("h2", null, "消息平台"),
              s("p", { class: "desc" }, [
                gt("把角色接入 QQ / 企业微信 / 飞书 / Discord / Telegram 等平台。L.I.F.E 作为"),
                s("b", null, "服务端"),
                gt("监听反向 WebSocket，由 NapCat 等客户端连入。可同时运行多个机器人，各自独立启停。")
              ])
            ], -1)),
            s("div", mu, [
              s("button", {
                class: "btn sm",
                disabled: Ye.value,
                onClick: ut
              }, "重新监听", 8, vu),
              s("button", {
                class: "btn filled sm",
                onClick: ce
              }, "管理适配器 →")
            ])
          ]),
          s("article", gu, [
            s("h3", null, [
              n[305] || (n[305] = gt("适配器 ", -1)),
              s("span", yu, h(te.value.length), 1)
            ]),
            n[306] || (n[306] = s("p", { class: "hint" }, [
              gt(" 这里只显示运行状态。新增、编辑、删除适配器，以及配置文件路由， 都在 "),
              s("b", null, "设置 → 消息平台"),
              gt(" 页面完成。 ")
            ], -1)),
            te.value.length ? (w(), x("ol", wu, [
              (w(!0), x(pt, null, $t(te.value, (l) => (w(), x("li", {
                key: l.id
              }, [
                s("strong", null, h(l.name || l.id), 1),
                s("span", {
                  class: he(["pill soft", { ok: se(l.id).connected }])
                }, h(se(l.id).connected ? "已连接" : l.enabled ? "等待客户端接入" : "未启用"), 3),
                s("span", xu, h(l.platform) + " · ws://" + h(l.ws_host) + ":" + h(l.ws_port) + " · 人设 " + h(l.config_id), 1),
                s("span", Lu, h(se(l.id).clients || 0) + " 个客户端 · " + h(l.ws_token ? "Token 已设置" : "无 Token（建议设置）"), 1)
              ]))), 128))
            ])) : (w(), x("div", bu, "还没有适配器，点右上角「管理适配器」接入第一个机器人。")),
            s("div", { class: "actions-row" }, [
              s("button", {
                class: "btn sm",
                onClick: ce
              }, "设置 → 消息平台")
            ])
          ])
        ], 512), [
          [Ai, U.value === "adapters"]
        ]),
        y(s("section", Pu, [
          n[310] || (n[310] = s("div", { class: "section-head" }, [
            s("div", null, [
              s("h2", null, "状态"),
              s("p", { class: "desc" }, "承诺账本、结构化用户模型与价值取向。")
            ])
          ], -1)),
          s("article", Tu, [
            s("h3", null, [
              n[307] || (n[307] = gt("承诺账本 ", -1)),
              s("span", ku, h(Re.value.length), 1)
            ]),
            s("ol", Cu, [
              (w(!0), x(pt, null, $t(Re.value, (l) => (w(), x("li", {
                key: l.id
              }, [
                s("strong", null, h(l.text), 1),
                s("span", Su, h(l.user_id), 1)
              ]))), 128)),
              Re.value.length ? I("", !0) : (w(), x("li", Mu, "没有未了结的承诺。"))
            ])
          ]),
          s("div", zu, [
            s("article", Ou, [
              n[308] || (n[308] = s("h3", null, "用户模型", -1)),
              s("ol", Eu, [
                (w(!0), x(pt, null, $t(mi.value, (l) => (w(), x("li", {
                  key: l.user_id
                }, [
                  s("strong", null, h(l.user_id), 1),
                  s("span", Au, "喜欢：" + h(Ve(l.preferences).join("、") || "—"), 1),
                  s("span", Iu, "雷区：" + h(Ve(l.taboos).join("、") || "—"), 1),
                  s("span", Zu, "关心：" + h(Ve(l.concerns).join("、") || "—"), 1)
                ]))), 128)),
                mi.value.length ? I("", !0) : (w(), x("li", Bu, "还没有结构化画像。"))
              ])
            ]),
            s("article", Nu, [
              n[309] || (n[309] = s("h3", null, "价值取向", -1)),
              s("ol", Du, [
                (w(!0), x(pt, null, $t(Fi.value, (l) => (w(), x("li", {
                  key: l.k
                }, [
                  s("strong", null, h(l.k), 1),
                  s("span", Ru, h(Number(l.v).toFixed(2)), 1)
                ]))), 128)),
                Fi.value.length ? I("", !0) : (w(), x("li", Vu, "还没有形成稳定价值取向。"))
              ])
            ])
          ])
        ], 512), [
          [Ai, U.value === "state"]
        ]),
        s("section", Uu, [
          n[314] || (n[314] = s("div", { class: "section-head" }, [
            s("div", null, [
              s("h2", null, "危险操作"),
              s("p", { class: "desc" }, "日常操作不可撤销：撤回一句话、删除一条记忆都是永久的。这里保留唯一一次「重来」的机会。")
            ])
          ], -1)),
          s("div", Fu, [
            s("article", Hu, [
              n[311] || (n[311] = s("h3", null, "重置整个人", -1)),
              n[312] || (n[312] = s("p", { class: "hint" }, "清空记忆与备份、关系、承诺、目标、日记与梦境、价值取向、人设演化与认知内核，回到出厂状态。你自己的设置会保留。", -1)),
              n[313] || (n[313] = s("p", {
                class: "hint",
                style: { "margin-top": "10px" }
              }, [
                s("strong", null, "需要二次确认。")
              ], -1)),
              s("div", Wu, [
                s("button", {
                  class: "btn danger",
                  disabled: Ge.value,
                  onClick: xi
                }, h(Ge.value ? "重置中…" : "重置整个人"), 9, Gu)
              ])
            ])
          ])
        ])
      ], 512),
      St(xs)
    ], 64));
  }
}), Qu = /* @__PURE__ */ Ps(Ku, [["__scopeId", "data-v-48211299"]]);
export {
  Qu as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('life-plugin-style')){const s=document.createElement('style');s.id='life-plugin-style';s.textContent="#app .app-select{min-width:0;position:relative;font-size:inherit}#app .app-select.input{padding:0;border:0;min-height:0;background:transparent}#app .app-select-trigger{display:flex;align-items:center;justify-content:space-between;gap:10px;width:100%;min-height:52px;padding:0 14px 0 16px;border:1px solid transparent;border-radius:16px;background-color:var(--md-surface-container-high);color:var(--md-on-surface);font:inherit;font-size:15px;text-align:left;cursor:pointer;box-shadow:none;transition:background-color var(--duration-short),border-color var(--duration-short),box-shadow var(--duration-medium),border-radius var(--duration-medium) var(--ease-spring)}#app .app-select-trigger:hover:not(:disabled){background-color:var(--md-surface-container-highest)}#app .app-select-trigger[aria-expanded=true],#app .app-select-trigger:focus-visible{border-color:var(--md-primary);background-color:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent);outline:none}#app .app-select-trigger:disabled{opacity:.5;cursor:not-allowed}.app-select-value{white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.app-select-chevron{flex-shrink:0;width:26px;height:26px;display:grid;place-items:center;border-radius:50%;color:var(--md-on-surface-variant);transition:transform var(--duration-medium) var(--ease-spring),background-color var(--duration-short)}#app .app-select-trigger:hover .app-select-chevron{background:color-mix(in srgb,var(--md-on-surface) 8%,transparent)}.app-select-chevron svg{transition:transform var(--duration-medium) var(--ease-spring)}.app-select-chevron svg.is-open{transform:rotate(180deg)}.app-select-menu{position:fixed;z-index:var(--z-popover);overflow-y:auto;overscroll-behavior:contain;padding:8px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:24px;background:var(--md-surface-container-low);color:var(--md-on-surface);box-shadow:0 18px 50px -12px color-mix(in srgb,var(--md-scrim,#000) 45%,transparent),0 4px 14px -4px #16244026;font-family:var(--font-family);font-size:14px;transform-origin:top}.app-select-menu.opens-up{transform-origin:bottom}.app-select-option{display:flex;justify-content:space-between;align-items:center;gap:12px;min-height:46px;padding:0 14px;border-radius:14px;cursor:pointer;overflow-wrap:anywhere;line-height:1.4;color:var(--md-on-surface);transition:background-color var(--duration-short),border-radius var(--duration-medium) var(--ease-spring),color var(--duration-short)}.app-select-option>span{min-width:0}.app-select-check{flex-shrink:0;width:24px;height:24px;display:grid;place-items:center;border-radius:50%;color:var(--md-primary)}.app-select-option.highlighted{background:color-mix(in srgb,var(--md-on-surface) 8%,transparent)}.app-select-option.selected{background:var(--md-primary-container);color:var(--md-on-primary-container);font-weight:650}.app-select-option.selected .app-select-check{background:var(--md-primary);color:var(--md-on-primary)}.app-select-option.disabled{opacity:.4;cursor:not-allowed}.app-select-empty{padding:18px;color:var(--md-on-surface-variant);text-align:center;font-size:13px}.select-menu-enter-active{transition:opacity var(--duration-short) var(--ease-emphasized),transform var(--duration-medium) var(--ease-spring)}.select-menu-leave-active{transition:opacity var(--duration-short),transform var(--duration-short)}.select-menu-enter-from,.select-menu-leave-to{opacity:0;transform:translateY(-6px) scale(.97)}@media(prefers-reduced-motion:reduce){#app .app-select-trigger{transition:background-color var(--duration-short),border-color var(--duration-short),box-shadow var(--duration-medium)}.app-select-chevron,.app-select-chevron svg,.app-select-option{transition:none}.select-menu-enter-active,.select-menu-leave-active{transition:opacity var(--duration-short)}.select-menu-enter-from,.select-menu-leave-to{transform:none}}.confirm-scrim{position:fixed;inset:0;z-index:var(--z-modal);background:#21173566;backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.confirm-dialog{width:min(440px,100%);background:var(--md-surface-container-high, var(--md-surface, #fff));color:var(--md-on-surface);border:1px solid var(--md-outline-variant, transparent);border-radius:28px;padding:28px;box-shadow:0 24px 70px #18132d33;outline:none}.confirm-dialog h2{margin:0 0 10px;font-size:22px;font-weight:650}.confirm-dialog p{margin:0;font-size:14px;line-height:1.65;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.confirm-dialog footer{display:flex;justify-content:flex-end;gap:12px;margin-top:24px}.confirm-dialog footer button{border:0;border-radius:999px;padding:12px 22px;font:inherit;font-weight:600;cursor:pointer;background:var(--md-secondary-container, #e7e0ec);color:var(--md-on-secondary-container, #1d1b20)}.confirm-dialog footer .confirm-primary{background:var(--md-primary, #6750a4);color:var(--md-on-primary, #fff)}.confirm-dialog footer .confirm-primary.danger{background:var(--md-error, #b3261e);color:var(--md-on-error, #fff)}.confirm-dialog footer button:focus-visible{outline:3px solid var(--md-primary);outline-offset:3px}.confirm-dialog:focus-visible{outline:3px solid var(--md-primary);outline-offset:2px}@media(prefers-reduced-motion:reduce){.confirm-dialog{animation:none;transition:none}}.leaflet-pane,.leaflet-tile,.leaflet-marker-icon,.leaflet-marker-shadow,.leaflet-tile-container,.leaflet-pane>svg,.leaflet-pane>canvas,.leaflet-zoom-box,.leaflet-image-layer,.leaflet-layer{position:absolute;left:0;top:0}.leaflet-container{overflow:hidden}.leaflet-tile,.leaflet-marker-icon,.leaflet-marker-shadow{-webkit-user-select:none;-moz-user-select:none;user-select:none;-webkit-user-drag:none}.leaflet-tile::selection{background:transparent}.leaflet-safari .leaflet-tile{image-rendering:-webkit-optimize-contrast}.leaflet-safari .leaflet-tile-container{width:1600px;height:1600px;-webkit-transform-origin:0 0}.leaflet-marker-icon,.leaflet-marker-shadow{display:block}.leaflet-container .leaflet-overlay-pane svg{max-width:none!important;max-height:none!important}.leaflet-container .leaflet-marker-pane img,.leaflet-container .leaflet-shadow-pane img,.leaflet-container .leaflet-tile-pane img,.leaflet-container img.leaflet-image-layer,.leaflet-container .leaflet-tile{max-width:none!important;max-height:none!important;width:auto;padding:0}.leaflet-container img.leaflet-tile{mix-blend-mode:plus-lighter}.leaflet-container.leaflet-touch-zoom{-ms-touch-action:pan-x pan-y;touch-action:pan-x pan-y}.leaflet-container.leaflet-touch-drag{-ms-touch-action:pinch-zoom;touch-action:none;touch-action:pinch-zoom}.leaflet-container.leaflet-touch-drag.leaflet-touch-zoom{-ms-touch-action:none;touch-action:none}.leaflet-container{-webkit-tap-highlight-color:transparent}.leaflet-container a{-webkit-tap-highlight-color:rgba(51,181,229,.4)}.leaflet-tile{filter:inherit;visibility:hidden}.leaflet-tile-loaded{visibility:inherit}.leaflet-zoom-box{width:0;height:0;-moz-box-sizing:border-box;box-sizing:border-box;z-index:800}.leaflet-overlay-pane svg{-moz-user-select:none}.leaflet-pane{z-index:400}.leaflet-tile-pane{z-index:200}.leaflet-overlay-pane{z-index:400}.leaflet-shadow-pane{z-index:500}.leaflet-marker-pane{z-index:600}.leaflet-tooltip-pane{z-index:650}.leaflet-popup-pane{z-index:700}.leaflet-map-pane canvas{z-index:100}.leaflet-map-pane svg{z-index:200}.leaflet-vml-shape{width:1px;height:1px}.lvml{behavior:url(#default#VML);display:inline-block;position:absolute}.leaflet-control{position:relative;z-index:800;pointer-events:visiblePainted;pointer-events:auto}.leaflet-top,.leaflet-bottom{position:absolute;z-index:1000;pointer-events:none}.leaflet-top{top:0}.leaflet-right{right:0}.leaflet-bottom{bottom:0}.leaflet-left{left:0}.leaflet-control{float:left;clear:both}.leaflet-right .leaflet-control{float:right}.leaflet-top .leaflet-control{margin-top:10px}.leaflet-bottom .leaflet-control{margin-bottom:10px}.leaflet-left .leaflet-control{margin-left:10px}.leaflet-right .leaflet-control{margin-right:10px}.leaflet-fade-anim .leaflet-popup{opacity:0;-webkit-transition:opacity .2s linear;-moz-transition:opacity .2s linear;transition:opacity .2s linear}.leaflet-fade-anim .leaflet-map-pane .leaflet-popup{opacity:1}.leaflet-zoom-animated{-webkit-transform-origin:0 0;-ms-transform-origin:0 0;transform-origin:0 0}svg.leaflet-zoom-animated{will-change:transform}.leaflet-zoom-anim .leaflet-zoom-animated{-webkit-transition:-webkit-transform .25s cubic-bezier(0,0,.25,1);-moz-transition:-moz-transform .25s cubic-bezier(0,0,.25,1);transition:transform .25s cubic-bezier(0,0,.25,1)}.leaflet-zoom-anim .leaflet-tile,.leaflet-pan-anim .leaflet-tile{-webkit-transition:none;-moz-transition:none;transition:none}.leaflet-zoom-anim .leaflet-zoom-hide{visibility:hidden}.leaflet-interactive{cursor:pointer}.leaflet-grab{cursor:-webkit-grab;cursor:-moz-grab;cursor:grab}.leaflet-crosshair,.leaflet-crosshair .leaflet-interactive{cursor:crosshair}.leaflet-popup-pane,.leaflet-control{cursor:auto}.leaflet-dragging .leaflet-grab,.leaflet-dragging .leaflet-grab .leaflet-interactive,.leaflet-dragging .leaflet-marker-draggable{cursor:move;cursor:-webkit-grabbing;cursor:-moz-grabbing;cursor:grabbing}.leaflet-marker-icon,.leaflet-marker-shadow,.leaflet-image-layer,.leaflet-pane>svg path,.leaflet-tile-container{pointer-events:none}.leaflet-marker-icon.leaflet-interactive,.leaflet-image-layer.leaflet-interactive,.leaflet-pane>svg path.leaflet-interactive,svg.leaflet-image-layer.leaflet-interactive path{pointer-events:visiblePainted;pointer-events:auto}.leaflet-container{background:#ddd;outline-offset:1px}.leaflet-container a{color:#0078a8}.leaflet-zoom-box{border:2px dotted #38f;background:#ffffff80}.leaflet-container{font-family:Helvetica Neue,Arial,Helvetica,sans-serif;font-size:12px;font-size:.75rem;line-height:1.5}.leaflet-bar{box-shadow:0 1px 5px #000000a6;border-radius:4px}.leaflet-bar a{background-color:#fff;border-bottom:1px solid #ccc;width:26px;height:26px;line-height:26px;display:block;text-align:center;text-decoration:none;color:#000}.leaflet-bar a,.leaflet-control-layers-toggle{background-position:50% 50%;background-repeat:no-repeat;display:block}.leaflet-bar a:hover,.leaflet-bar a:focus{background-color:#f4f4f4}.leaflet-bar a:first-child{border-top-left-radius:4px;border-top-right-radius:4px}.leaflet-bar a:last-child{border-bottom-left-radius:4px;border-bottom-right-radius:4px;border-bottom:none}.leaflet-bar a.leaflet-disabled{cursor:default;background-color:#f4f4f4;color:#bbb}.leaflet-touch .leaflet-bar a{width:30px;height:30px;line-height:30px}.leaflet-touch .leaflet-bar a:first-child{border-top-left-radius:2px;border-top-right-radius:2px}.leaflet-touch .leaflet-bar a:last-child{border-bottom-left-radius:2px;border-bottom-right-radius:2px}.leaflet-control-zoom-in,.leaflet-control-zoom-out{font:700 18px Lucida Console,Monaco,monospace;text-indent:1px}.leaflet-touch .leaflet-control-zoom-in,.leaflet-touch .leaflet-control-zoom-out{font-size:22px}.leaflet-control-layers{box-shadow:0 1px 5px #0006;background:#fff;border-radius:5px}.leaflet-control-layers-toggle{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAQAAAADQ4RFAAACf0lEQVR4AY1UM3gkARTePdvdoTxXKc+qTl3aU5U6b2Kbkz3Gtq3Zw6ziLGNPzrYx7946Tr6/ee/XeCQ4D3ykPtL5tHno4n0d/h3+xfuWHGLX81cn7r0iTNzjr7LrlxCqPtkbTQEHeqOrTy4Yyt3VCi/IOB0v7rVC7q45Q3Gr5K6jt+3Gl5nCoDD4MtO+j96Wu8atmhGqcNGHObuf8OM/x3AMx38+4Z2sPqzCxRFK2aF2e5Jol56XTLyggAMTL56XOMoS1W4pOyjUcGGQdZxU6qRh7B9Zp+PfpOFlqt0zyDZckPi1ttmIp03jX8gyJ8a/PG2yutpS/Vol7peZIbZcKBAEEheEIAgFbDkz5H6Zrkm2hVWGiXKiF4Ycw0RWKdtC16Q7qe3X4iOMxruonzegJzWaXFrU9utOSsLUmrc0YjeWYjCW4PDMADElpJSSQ0vQvA1Tm6/JlKnqFs1EGyZiFCqnRZTEJJJiKRYzVYzJck2Rm6P4iH+cmSY0YzimYa8l0EtTODFWhcMIMVqdsI2uiTvKmTisIDHJ3od5GILVhBCarCfVRmo4uTjkhrhzkiBV7SsaqS+TzrzM1qpGGUFt28pIySQHR6h7F6KSwGWm97ay+Z+ZqMcEjEWebE7wxCSQwpkhJqoZA5ivCdZDjJepuJ9IQjGGUmuXJdBFUygxVqVsxFsLMbDe8ZbDYVCGKxs+W080max1hFCarCfV+C1KATwcnvE9gRRuMP2prdbWGowm1KB1y+zwMMENkM755cJ2yPDtqhTI6ED1M/82yIDtC/4j4BijjeObflpO9I9MwXTCsSX8jWAFeHr05WoLTJ5G8IQVS/7vwR6ohirYM7f6HzYpogfS3R2OAAAAAElFTkSuQmCC);width:36px;height:36px}.leaflet-retina .leaflet-control-layers-toggle{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAQAAABvcdNgAAAEsklEQVR4AWL4TydIhpZK1kpWOlg0w3ZXP6D2soBtG42jeI6ZmQTHzAxiTbSJsYLjO9HhP+WOmcuhciVnmHVQcJnp7DFvScowZorad/+V/fVzMdMT2g9Cv9guXGv/7pYOrXh2U+RRR3dSd9JRx6bIFc/ekqHI29JC6pJ5ZEh1yWkhkbcFeSjxgx3L2m1cb1C7bceyxA+CNjT/Ifff+/kDk2u/w/33/IeCMOSaWZ4glosqT3DNnNZQ7Cs58/3Ce5HL78iZH/vKVIaYlqzfdLu8Vi7dnvUbEza5Idt36tquZFldl6N5Z/POLof0XLK61mZCmJSWjVF9tEjUluu74IUXvgttuVIHE7YxSkaYhJZam7yiM9Pv82JYfl9nptxZaxMJE4YSPty+vF0+Y2up9d3wwijfjZbabqm/3bZ9ecKHsiGmRflnn1MW4pjHf9oLufyn2z3y1D6n8g8TZhxyzipLNPnAUpsOiuWimg52psrTZYnOWYNDTMuWBWa0tJb4rgq1UvmutpaYEbZlwU3CLJm/ayYjHW5/h7xWLn9Hh1vepDkyf7dE7MtT5LR4e7yYpHrkhOUpEfssBLq2pPhAqoSWKUkk7EDqkmK6RrCEzqDjhNDWNE+XSMvkJRDWlZTmCW0l0PHQGRZY5t1L83kT0Y3l2SItk5JAWHl2dCOBm+fPu3fo5/3v61RMCO9Jx2EEYYhb0rmNQMX/vm7gqOEJLcXTGw3CAuRNeyaPWwjR8PRqKQ1PDA/dpv+on9Shox52WFnx0KY8onHayrJzm87i5h9xGw/tfkev0jGsQizqezUKjk12hBMKJ4kbCqGPVNXudyyrShovGw5CgxsRICxF6aRmSjlBnHRzg7Gx8fKqEubI2rahQYdR1YgDIRQO7JvQyD52hoIQx0mxa0ODtW2Iozn1le2iIRdzwWewedyZzewidueOGqlsn1MvcnQpuVwLGG3/IR1hIKxCjelIDZ8ldqWz25jWAsnldEnK0Zxro19TGVb2ffIZEsIO89EIEDvKMPrzmBOQcKQ+rroye6NgRRxqR4U8EAkz0CL6uSGOm6KQCdWjvjRiSP1BPalCRS5iQYiEIvxuBMJEWgzSoHADcVMuN7IuqqTeyUPq22qFimFtxDyBBJEwNyt6TM88blFHao/6tWWhuuOM4SAK4EI4QmFHA+SEyWlp4EQoJ13cYGzMu7yszEIBOm2rVmHUNqwAIQabISNMRstmdhNWcFLsSm+0tjJH1MdRxO5Nx0WDMhCtgD6OKgZeljJqJKc9po8juskR9XN0Y1lZ3mWjLR9JCO1jRDMd0fpYC2VnvjBSEFg7wBENc0R9HFlb0xvF1+TBEpF68d+DHR6IOWVv2BECtxo46hOFUBd/APU57WIoEwJhIi2CdpyZX0m93BZicktMj1AS9dClteUFAUNUIEygRZCtik5zSxI9MubTBH1GOiHsiLJ3OCoSZkILa9PxiN0EbvhsAo8tdAf9Seepd36lGWHmtNANTv5Jd0z4QYyeo/UEJqxKRpg5LZx6btLPsOaEmdMyxYdlc8LMaJnikDlhclqmPiQnTEpLUIZEwkRagjYkEibQErwhkTAKCLQEbUgkzJQWc/0PstHHcfEdQ+UAAAAASUVORK5CYII=);background-size:26px 26px}.leaflet-touch .leaflet-control-layers-toggle{width:44px;height:44px}.leaflet-control-layers .leaflet-control-layers-list,.leaflet-control-layers-expanded .leaflet-control-layers-toggle{display:none}.leaflet-control-layers-expanded .leaflet-control-layers-list{display:block;position:relative}.leaflet-control-layers-expanded{padding:6px 10px 6px 6px;color:#333;background:#fff}.leaflet-control-layers-scrollbar{overflow-y:scroll;overflow-x:hidden;padding-right:5px}.leaflet-control-layers-selector{margin-top:2px;position:relative;top:1px}.leaflet-control-layers label{display:block;font-size:13px;font-size:1.08333em}.leaflet-control-layers-separator{height:0;border-top:1px solid #ddd;margin:5px -10px 5px -6px}.leaflet-default-icon-path{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII=)}.leaflet-container .leaflet-control-attribution{background:#fff;background:#fffc;margin:0}.leaflet-control-attribution,.leaflet-control-scale-line{padding:0 5px;color:#333;line-height:1.4}.leaflet-control-attribution a{text-decoration:none}.leaflet-control-attribution a:hover,.leaflet-control-attribution a:focus{text-decoration:underline}.leaflet-attribution-flag{display:inline!important;vertical-align:baseline!important;width:1em;height:.6669em}.leaflet-left .leaflet-control-scale{margin-left:5px}.leaflet-bottom .leaflet-control-scale{margin-bottom:5px}.leaflet-control-scale-line{border:2px solid #777;border-top:none;line-height:1.1;padding:2px 5px 1px;white-space:nowrap;-moz-box-sizing:border-box;box-sizing:border-box;background:#fffc;text-shadow:1px 1px #fff}.leaflet-control-scale-line:not(:first-child){border-top:2px solid #777;border-bottom:none;margin-top:-2px}.leaflet-control-scale-line:not(:first-child):not(:last-child){border-bottom:2px solid #777}.leaflet-touch .leaflet-control-attribution,.leaflet-touch .leaflet-control-layers,.leaflet-touch .leaflet-bar{box-shadow:none}.leaflet-touch .leaflet-control-layers,.leaflet-touch .leaflet-bar{border:2px solid rgba(0,0,0,.2);background-clip:padding-box}.leaflet-popup{position:absolute;text-align:center;margin-bottom:20px}.leaflet-popup-content-wrapper{padding:1px;text-align:left;border-radius:12px}.leaflet-popup-content{margin:13px 24px 13px 20px;line-height:1.3;font-size:13px;font-size:1.08333em;min-height:1px}.leaflet-popup-content p{margin:1.3em 0}.leaflet-popup-tip-container{width:40px;height:20px;position:absolute;left:50%;margin-top:-1px;margin-left:-20px;overflow:hidden;pointer-events:none}.leaflet-popup-tip{width:17px;height:17px;padding:1px;margin:-10px auto 0;pointer-events:auto;-webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);-ms-transform:rotate(45deg);transform:rotate(45deg)}.leaflet-popup-content-wrapper,.leaflet-popup-tip{background:#fff;color:#333;box-shadow:0 3px 14px #0006}.leaflet-container a.leaflet-popup-close-button{position:absolute;top:0;right:0;border:none;text-align:center;width:24px;height:24px;font:16px/24px Tahoma,Verdana,sans-serif;color:#757575;text-decoration:none;background:transparent}.leaflet-container a.leaflet-popup-close-button:hover,.leaflet-container a.leaflet-popup-close-button:focus{color:#585858}.leaflet-popup-scrolled{overflow:auto}.leaflet-oldie .leaflet-popup-content-wrapper{-ms-zoom:1}.leaflet-oldie .leaflet-popup-tip{width:24px;margin:0 auto;-ms-filter:\"progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678)\";filter:progid:DXImageTransform.Microsoft.Matrix(M11=.70710678,M12=.70710678,M21=-.70710678,M22=.70710678)}.leaflet-oldie .leaflet-control-zoom,.leaflet-oldie .leaflet-control-layers,.leaflet-oldie .leaflet-popup-content-wrapper,.leaflet-oldie .leaflet-popup-tip{border:1px solid #999}.leaflet-div-icon{background:#fff;border:1px solid #666}.leaflet-tooltip{position:absolute;padding:6px;background-color:#fff;border:1px solid #fff;border-radius:3px;color:#222;white-space:nowrap;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none;box-shadow:0 1px 3px #0006}.leaflet-tooltip.leaflet-interactive{cursor:pointer;pointer-events:auto}.leaflet-tooltip-top:before,.leaflet-tooltip-bottom:before,.leaflet-tooltip-left:before,.leaflet-tooltip-right:before{position:absolute;pointer-events:none;border:6px solid transparent;background:transparent;content:\"\"}.leaflet-tooltip-bottom{margin-top:6px}.leaflet-tooltip-top{margin-top:-6px}.leaflet-tooltip-bottom:before,.leaflet-tooltip-top:before{left:50%;margin-left:-6px}.leaflet-tooltip-top:before{bottom:0;margin-bottom:-12px;border-top-color:#fff}.leaflet-tooltip-bottom:before{top:0;margin-top:-12px;margin-left:-6px;border-bottom-color:#fff}.leaflet-tooltip-left{margin-left:-6px}.leaflet-tooltip-right{margin-left:6px}.leaflet-tooltip-left:before,.leaflet-tooltip-right:before{top:50%;margin-top:-6px}.leaflet-tooltip-left:before{right:0;margin-right:-12px;border-left-color:#fff}.leaflet-tooltip-right:before{left:0;margin-left:-12px;border-right-color:#fff}@media print{.leaflet-control{-webkit-print-color-adjust:exact;print-color-adjust:exact}}.world-field[data-v-48211299]{display:block;margin:10px 0}.world-label[data-v-48211299]{display:block;font-size:12px;font-weight:600;color:var(--md-on-surface-variant);margin-bottom:4px}.world-text[data-v-48211299]{width:100%;min-height:64px;padding:10px 14px;border:1px solid var(--md-outline-variant);border-radius:var(--r-sm);background:var(--md-surface-container-high);color:var(--md-on-surface);font:inherit;font-size:13px;line-height:1.5;resize:vertical;outline:none}.world-text[data-v-48211299]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 14%,transparent)}.world-actions[data-v-48211299]{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-top:12px}.wm-head[data-v-48211299]{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;margin-bottom:6px}.wm-place[data-v-48211299]{font-size:12px;color:var(--md-on-surface-variant)}.wm-premise[data-v-48211299]{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin:2px 0 8px}.wm-map-wrap[data-v-48211299]{position:relative;margin-top:8px}.world-map-leaflet[data-v-48211299]{height:clamp(460px,72vh,820px);border-radius:16px;overflow:hidden;border:1px solid var(--md-outline-variant);background:#e8edf2}.world-map-leaflet.is-empty[data-v-48211299]{display:none}.wm-reset[data-v-48211299]{position:absolute;top:10px;right:10px;z-index:var(--z-overlay);border:1px solid var(--md-outline-variant);background:#fffffff0;color:#33404c;border-radius:10px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer;box-shadow:0 1px 4px #0000002e}.wm-reset[data-v-48211299]:hover{background:#fff}.wm-compass[data-v-48211299]{position:absolute;left:12px;bottom:12px;z-index:var(--z-overlay);width:38px;height:38px;border-radius:50%;background:#ffffffeb;border:1px solid #b9c3cd;box-shadow:0 1px 4px #0000002e;display:grid;place-items:center}.wm-compass i[data-v-48211299]{font-style:normal;font-size:12px;font-weight:800;color:#d64545;position:relative}.wm-compass i[data-v-48211299]:before{content:\"\";position:absolute;left:50%;top:-9px;transform:translate(-50%);border-left:4px solid transparent;border-right:4px solid transparent;border-bottom:9px solid #33404c}.wm-scope[data-v-48211299]{position:absolute;bottom:12px;right:12px;z-index:var(--z-overlay);border:1px solid var(--md-outline-variant);background:#fffffff0;color:#33404c;border-radius:10px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer;box-shadow:0 1px 4px #0000002e}.wm-scope[data-v-48211299]:hover{background:#fff}.wm-offline[data-v-48211299]{position:absolute;left:50%;bottom:12px;transform:translate(-50%);z-index:var(--z-overlay);background:#d1495bf0;color:#fff;font-size:12px;font-weight:600;padding:5px 12px;border-radius:10px;box-shadow:0 1px 4px #00000040}.wm-routes[data-v-48211299]{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:18px;margin-top:14px}.wm-routes h4[data-v-48211299]{margin:0 0 6px;font-size:13px;font-weight:800}.wm-routes ul[data-v-48211299]{list-style:none;margin:0;padding:0}.wm-routes li[data-v-48211299]{display:flex;gap:10px;padding:4px 0;border-bottom:1px dashed color-mix(in srgb,var(--md-outline-variant) 70%,transparent);font-size:12.5px}.wm-routes b[data-v-48211299]{flex:0 0 88px}.wm-routes span[data-v-48211299]{color:var(--md-on-surface-variant);line-height:1.5}.wm-legend[data-v-48211299]{display:flex;flex-wrap:wrap;gap:14px;margin-top:12px;font-size:12px;color:var(--md-on-surface-variant)}.wm-legend span[data-v-48211299]{display:inline-flex;align-items:center;gap:6px}.wm-legend i[data-v-48211299]{width:12px;height:12px;border-radius:50%;display:inline-block;border:1.5px solid rgba(255,255,255,.7)}.wm-legend i.k-home[data-v-48211299]{background:#e07a5f}.wm-legend i.k-work[data-v-48211299]{background:#5b8def}.wm-legend i.k-shop[data-v-48211299]{background:#e0a23d}.wm-legend i.k-food[data-v-48211299]{background:#57a773}.wm-legend i.k-park[data-v-48211299]{background:#3faead}.wm-legend i.k-transit[data-v-48211299]{background:#8b6fd6}.wm-legend i.k-other[data-v-48211299]{background:#8a94a6}.wm-legend i.k-actor[data-v-48211299]{background:#fff;border-color:#d1495b;box-shadow:inset 0 0 0 3px #d1495b}.wm-legend i.k-metro[data-v-48211299]{background:#d64545}.wm-legend i.k-bus[data-v-48211299]{background:#e08a2e}.wm-legend i.k-park2[data-v-48211299]{background:#9bd08f}.wm-legend i.k-water[data-v-48211299]{background:#8fbfe6}.wm-legend i.k-hw[data-v-48211299]{background:#f08c2e}.wm-legend i.k-arterial[data-v-48211299]{background:#f7cf8a}.wm-legend i.k-street[data-v-48211299]{background:#fff;border-color:#b9c3cd}.pfield[data-v-48211299]{display:flex;flex-direction:column;gap:4px;margin-top:10px;font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}.pfield textarea.field[data-v-48211299]{height:auto;min-height:70px;padding:10px 12px;resize:vertical;line-height:1.5}.cog-metric[data-v-48211299]{display:flex;flex-direction:column;gap:4px;padding:10px 12px;border-radius:var(--r-sm);background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant)}.cog-metric span[data-v-48211299]{font-size:11px;font-weight:700;letter-spacing:.04em;color:var(--md-on-surface-variant)}.cog-metric strong[data-v-48211299]{font-size:16px;font-weight:800;letter-spacing:-.01em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.cog-metric.warn[data-v-48211299]{border-color:var(--md-error,#b3261e);background:color-mix(in srgb,var(--md-error,#b3261e) 8%,transparent)}.cog-metric.warn span[data-v-48211299],.cog-metric.warn strong[data-v-48211299]{color:var(--md-error,#b3261e)}.som-channels[data-v-48211299]{margin-top:10px;display:flex;flex-direction:column;gap:6px}.som-chan[data-v-48211299]{display:grid;grid-template-columns:52px 1fr 48px;align-items:center;gap:10px}.som-chan-name[data-v-48211299]{font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}.som-chan-bar[data-v-48211299]{display:block;height:8px;border-radius:999px;background:var(--md-surface-container);overflow:hidden}.som-chan-bar i[data-v-48211299]{display:block;width:100%;height:100%;border-radius:999px;background:var(--md-primary);transform-origin:left;transition:transform var(--duration-medium) var(--ease-out);will-change:transform}.som-chan-val[data-v-48211299]{font-size:12px;font-weight:700;text-align:right;color:var(--md-on-surface-variant)}.chip[data-v-48211299]{display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 12px;border-radius:999px;font-size:12px;font-weight:700;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.chip.muted[data-v-48211299]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}.chip.ok[data-v-48211299]{background:var(--md-success-container);color:#0d3b1e}#app .pcp .cog-metric[data-v-48211299]{background:var(--md-surface-container)}.wm-pin-holder,.wm-actor-holder{background:none;border:none}.wm-pin{position:absolute;left:0;top:0;width:16px;height:16px;border-radius:50%;background:var(--c,#8a94a6);border:3px solid #fff;box-shadow:0 2px 6px #00000073;transform:translate(-50%,-50%)}.wm-pin:after{content:\"\";position:absolute;left:50%;top:100%;width:2px;height:8px;background:#fff;transform:translate(-50%);opacity:.7}.wm-pin-label{position:absolute;left:12px;top:-9px;white-space:nowrap;background:#12141ad1;color:#fff;font-size:12px;font-weight:600;padding:2px 8px;border-radius:10px;pointer-events:none}.wm-actor-badge{position:absolute;left:0;top:0;width:26px;height:26px;border-radius:50%;background:#fff;color:#d1495b;border:3px solid #d1495b;font-size:14px;font-weight:800;line-height:1;display:grid;place-items:center;transform:translate(-50%,-50%);box-shadow:0 2px 6px #00000080;z-index:600}.wm-actor-name{position:absolute;left:0;top:20px;white-space:nowrap;background:#d1495b;color:#fff;font-size:11px;font-weight:700;padding:1px 7px;border-radius:9px;transform:translate(-50%)}.wm-district{background:none;border:none}.wm-district-inner{position:absolute;left:0;top:0;transform:translate(-50%,-50%);white-space:nowrap;font-size:12px;font-weight:800;letter-spacing:.2em;color:#5c6b78;text-shadow:0 1px 0 rgba(255,255,255,.9);pointer-events:none}.wm-route{background:none;border:none}.wm-route-inner{position:absolute;left:0;top:0;transform:translate(-50%,-50%);background:var(--c,#333);color:#fff;font-size:10px;font-weight:700;padding:1px 6px;border-radius:8px;white-space:nowrap;box-shadow:0 1px 3px #00000059;pointer-events:none}.wm-zoom-low .wm-minor{display:none}.wm-station .wm-route-inner{background:#fff;color:#33404c;border:1.5px solid var(--c,#888);border-radius:6px;font-size:9px;font-weight:700;padding:1px 5px}.leaflet-container{font-family:inherit;background:#e8edf2;border-radius:16px}.leaflet-container a{color:#2f6fed}.leaflet-popup-content{font-size:13px;line-height:1.5}.page[data-v-ae079c13]{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}.page-inner[data-v-ae079c13]{max-width:1180px;margin:0 auto}.page-header[data-v-ae079c13]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.eyebrow[data-v-ae079c13]{margin:0 0 6px;color:var(--md-primary);font:700 12px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.page-header h1[data-v-ae079c13]{margin:0;font-size:var(--font-size-lg);font-weight:650;letter-spacing:-.01em}.subtitle[data-v-ae079c13]{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-ae079c13]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0;flex-wrap:wrap}.btn[data-v-ae079c13]{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s,background .15s}.btn[data-v-ae079c13]:disabled{opacity:.55;cursor:not-allowed}.btn[data-v-ae079c13]:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}.btn-sm[data-v-ae079c13]{height:30px;padding:0 12px;font-size:12px}.btn-primary[data-v-ae079c13]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn-tonal[data-v-ae079c13]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn-danger[data-v-ae079c13]{background:var(--md-error-container);color:var(--md-on-error-container)}.stat-grid[data-v-ae079c13]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-ae079c13]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}.stat-head[data-v-ae079c13]{display:flex;align-items:center;gap:10px}.stat-label[data-v-ae079c13]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-ae079c13]{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1}.stat-hint[data-v-ae079c13]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-ae079c13]{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-ae079c13]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-ae079c13]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-ae079c13]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-ae079c13]{background:var(--md-success-container);color:#0d3b1e}.card[data-v-ae079c13]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);box-shadow:var(--shadow-1);padding:var(--space-lg)}.card-head[data-v-ae079c13]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.card-title[data-v-ae079c13]{margin:0;font-size:16px;font-weight:650}.tabs[data-v-ae079c13]{display:inline-flex;gap:4px;padding:4px;border-radius:999px;background:var(--md-surface-container-high);margin-bottom:var(--space-lg)}.tabs button[data-v-ae079c13]{border:0;background:transparent;border-radius:999px;padding:8px 18px;font-size:13px;font-weight:600;color:var(--md-on-surface-variant);cursor:pointer}.tabs button.active[data-v-ae079c13]{background:var(--md-surface-container-lowest);color:var(--md-primary);box-shadow:var(--shadow-1)}.toolbar[data-v-ae079c13]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:var(--space-lg);padding:var(--space-md)}.search-field[data-v-ae079c13]{display:flex;align-items:center;gap:10px;flex:1;min-width:220px}.search-icon[data-v-ae079c13]{color:var(--md-on-surface-variant);flex-shrink:0}.search-field input[data-v-ae079c13]{flex:1;min-width:0;height:38px;border:0;background:transparent;outline:none;color:var(--md-on-surface);font-size:14px}.search-field input[data-v-ae079c13]:focus-visible{outline:3px solid var(--md-primary);outline-offset:2px}.search-field.mini[data-v-ae079c13]{padding:8px 12px;border:1px solid var(--md-outline-variant);border-radius:10px;margin-bottom:12px}.select[data-v-ae079c13]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.select select[data-v-ae079c13]{height:34px;border:1px solid var(--md-outline-variant);border-radius:9px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);padding:0 10px;font:inherit;font-size:13px}.chip[data-v-ae079c13]{height:26px;padding:0 11px;border-radius:999px;font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:6px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0}.chip.muted[data-v-ae079c13]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}.tier-short[data-v-ae079c13]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tier-long[data-v-ae079c13]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.chip-ok[data-v-ae079c13]{background:var(--md-success-container);color:#0d3b1e}.chip-warn[data-v-ae079c13]{background:var(--md-warning-container);color:var(--md-on-warning-container)}.error-banner[data-v-ae079c13]{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:var(--md-on-error-container);font-size:13px;margin:var(--space-lg) 0}.notice[data-v-ae079c13]{padding:10px 16px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;margin-top:var(--space-md)}.memory-list[data-v-ae079c13]{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:var(--space-lg)}.memory-card[data-v-ae079c13]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:12px;transition:border-color .15s,box-shadow .15s}.memory-card-enter-active[data-v-ae079c13]{transition:opacity .2s var(--ease-emphasized-decel),transform .2s var(--ease-emphasized-decel)}.memory-card-leave-active[data-v-ae079c13]{transition:opacity .16s var(--ease-emphasized-accel),transform .16s var(--ease-emphasized-accel)}.memory-card-enter-from[data-v-ae079c13]{opacity:0;transform:translateY(6px) scale(.98)}.memory-card-leave-to[data-v-ae079c13]{opacity:0;transform:scale(.98)}.memory-card-move[data-v-ae079c13]{transition:transform .26s var(--ease-emphasized)}@media(prefers-reduced-motion:reduce){.memory-card-enter-active[data-v-ae079c13],.memory-card-leave-active[data-v-ae079c13],.memory-card-move[data-v-ae079c13]{transition-duration:1ms}.memory-card-enter-from[data-v-ae079c13],.memory-card-leave-to[data-v-ae079c13]{transform:none}}.memory-card[data-v-ae079c13]:hover{border-color:color-mix(in srgb,var(--md-primary) 45%,var(--md-outline-variant));box-shadow:var(--shadow-2)}.card-top[data-v-ae079c13]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.btn-icon[data-v-ae079c13]{position:relative;width:30px;height:30px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--md-on-surface-variant);display:grid;place-items:center;cursor:pointer;margin-left:auto}.btn-icon[data-v-ae079c13]:after{content:\"\";position:absolute;top:50%;left:50%;width:44px;height:44px;transform:translate(-50%,-50%)}.btn-icon.danger[data-v-ae079c13]:hover{background:var(--md-error-container);color:var(--md-error)}.memory-content[data-v-ae079c13]{margin:0;line-height:1.65;font-size:14px;white-space:pre-wrap}.tags[data-v-ae079c13]{display:flex;gap:6px;flex-wrap:wrap}.tags span[data-v-ae079c13]{font-size:12px;font-weight:500;color:var(--md-on-primary-container);background:var(--md-primary-container);padding:3px 8px;border-radius:999px}.memory-foot[data-v-ae079c13]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding-top:12px;border-top:1px solid var(--md-outline-variant)}.meter[data-v-ae079c13]{display:flex;align-items:center;gap:7px;font-size:12px;color:var(--md-on-surface-variant)}.meter-bar[data-v-ae079c13]{width:56px;height:5px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-ae079c13]{display:block;height:100%;width:100%;transform-origin:left;transform:scaleX(var(--v,0%));border-radius:999px;transition:transform .3s var(--ease-out,ease)}.fill-primary[data-v-ae079c13]{background:var(--md-primary)}.fill-secondary[data-v-ae079c13]{background:var(--md-secondary,#536255)}.meter-text[data-v-ae079c13]{margin-left:auto;font-size:12px;color:var(--md-on-surface-variant)}.detail[data-v-ae079c13]{border-top:1px solid var(--md-outline-variant);padding-top:10px}.detail dl[data-v-ae079c13]{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0;font-size:12px}.detail dt[data-v-ae079c13]{color:var(--md-on-surface-variant);font-weight:600}.detail dd[data-v-ae079c13]{margin:3px 0 0;overflow-wrap:anywhere}.detail code[data-v-ae079c13]{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px}.card-actions[data-v-ae079c13]{display:flex;gap:8px;justify-content:flex-end}.hidden-input[data-v-ae079c13]{display:none}.empty-state[data-v-ae079c13]{padding:56px 24px;text-align:center;background:var(--md-surface-container);border:1px dashed var(--md-outline-variant);border-radius:var(--radius-lg);color:var(--md-on-surface-variant)}.empty-state p[data-v-ae079c13]{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}.empty-state .hint[data-v-ae079c13]{margin-top:8px;font-size:13px;font-weight:400;opacity:.85}.pager[data-v-ae079c13]{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:var(--space-lg)}.grid-notes[data-v-ae079c13]{display:grid;grid-template-columns:minmax(0,340px) 1fr;gap:var(--space-lg)}.stack-form[data-v-ae079c13]{display:flex;flex-direction:column;gap:10px}.input[data-v-ae079c13]{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none}.input[data-v-ae079c13]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}.input.area[data-v-ae079c13]{height:auto;padding:10px 14px;min-height:120px;resize:vertical;line-height:1.6}.note-list[data-v-ae079c13],.reflection-list[data-v-ae079c13]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}.note-item[data-v-ae079c13]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}.note-main[data-v-ae079c13]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.note-main strong[data-v-ae079c13]{font-size:14px;font-weight:600;overflow-wrap:anywhere}.item-meta[data-v-ae079c13]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.note-actions[data-v-ae079c13]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-ae079c13]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.reader[data-v-ae079c13]{margin-top:var(--space-lg)}.reader pre[data-v-ae079c13]{margin:0;max-height:460px;overflow:auto;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;line-height:1.7;white-space:pre-wrap;background:var(--md-surface-container);padding:14px 16px;border-radius:12px}.reflection .card-title[data-v-ae079c13]{font-size:14px;font-weight:600}.reflection details[data-v-ae079c13]{margin-top:6px}.reflection summary[data-v-ae079c13]{cursor:pointer;font-size:12px;color:var(--md-on-surface-variant)}.quote[data-v-ae079c13]{margin:8px 0 0;font-size:13px;line-height:1.6;background:var(--md-surface-container);padding:8px 12px;border-radius:8px;white-space:pre-wrap;overflow-wrap:anywhere}#app .memory-page .page-header h1[data-v-ae079c13]{font-size:clamp(24px,2.8vw,34px);font-weight:800;letter-spacing:-.02em}#app .memory-page .stat-grid[data-v-ae079c13]{gap:var(--space-lg)}#app .memory-page .stat-card[data-v-ae079c13],#app .memory-page .card[data-v-ae079c13],#app .memory-page .memory-card[data-v-ae079c13]{border-color:color-mix(in srgb,var(--md-outline-variant) 55%,transparent);background:var(--md-surface-container-low);box-shadow:var(--shadow-1)}#app .memory-page .stat-card[data-v-ae079c13]{border-radius:24px;transition:transform .28s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),box-shadow .28s}@media(hover:hover)and (pointer:fine){#app .memory-page .stat-card[data-v-ae079c13]:hover{transform:translateY(-2px);box-shadow:var(--shadow-2)}}#app .memory-page .stat-value[data-v-ae079c13]{font-size:34px;font-weight:800;letter-spacing:-.02em}#app .memory-page .icon-badge[data-v-ae079c13]{width:44px;height:44px;border-radius:16px 16px 16px 6px}#app .memory-page .card[data-v-ae079c13],#app .memory-page .memory-card[data-v-ae079c13]{border-radius:24px}#app .memory-page .memory-card[data-v-ae079c13]{transition:transform .26s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),box-shadow .22s,border-color .2s}@media(hover:hover)and (pointer:fine){#app .memory-page .memory-card[data-v-ae079c13]:hover{transform:translateY(-2px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--md-primary) 30%,var(--md-outline-variant))}}#app .memory-page .btn[data-v-ae079c13]{height:44px;padding:0 20px;border-radius:999px;font-weight:700}#app .memory-page .btn-sm[data-v-ae079c13]{height:34px;padding:0 14px;font-size:13px}#app .memory-page .btn-tonal[data-v-ae079c13]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}#app .memory-page .btn-primary[data-v-ae079c13]{background:var(--md-primary);color:var(--md-on-primary);box-shadow:0 6px 16px color-mix(in srgb,var(--md-primary) 28%,transparent)}#app .memory-page .input[data-v-ae079c13]{height:48px;border:1px solid transparent;border-radius:14px;background:var(--md-surface-container-high);transition:background-color .18s,border-color .18s,box-shadow .2s}#app .memory-page .input[data-v-ae079c13]:focus{border-color:var(--md-primary);background:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}#app .memory-page .input.area[data-v-ae079c13]{height:auto;padding:14px 16px}#app .memory-page .search-field input[data-v-ae079c13]{height:44px}#app .memory-page .search-field.mini[data-v-ae079c13]{border-color:transparent;background:var(--md-surface-container-high);border-radius:14px}#app .memory-page .select select[data-v-ae079c13]{height:44px;border-color:transparent;border-radius:14px;background:var(--md-surface-container-high);padding:0 14px}#app .memory-page .tabs[data-v-ae079c13]{padding:5px;border-radius:999px;background:var(--md-surface-container-high)}#app .memory-page .tabs button[data-v-ae079c13]{border-radius:999px;padding:9px 20px;font-weight:650}#app .memory-page .tabs button.active[data-v-ae079c13]{background:var(--md-primary);color:var(--md-on-primary);box-shadow:var(--shadow-1)}#app .memory-page .note-item[data-v-ae079c13]{border-radius:16px;border-color:color-mix(in srgb,var(--md-outline-variant) 45%,transparent);background:var(--md-surface-container-low)}@media(prefers-reduced-motion:reduce){#app .memory-page .stat-card[data-v-ae079c13]:hover,#app .memory-page .memory-card[data-v-ae079c13]:hover{transform:none}.meter-bar i[data-v-ae079c13]{transition:none}}@media(max-width:900px){.stat-grid[data-v-ae079c13]{grid-template-columns:repeat(2,1fr)}.grid-notes[data-v-ae079c13]{grid-template-columns:1fr}}@media(max-width:640px){.page[data-v-ae079c13]{padding:var(--space-lg)}.header-actions[data-v-ae079c13]{padding-top:0}.memory-list[data-v-ae079c13]{grid-template-columns:1fr}}\n";document.head.appendChild(s)}})();
