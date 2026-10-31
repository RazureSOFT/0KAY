import { defineComponent as qo, ref as $, computed as B, onMounted as mi, openBlock as _, createElementBlock as v, createElementVNode as i, createTextVNode as O, toDisplayString as l, createCommentVNode as A, Fragment as q, renderList as be, normalizeClass as R, createVNode as Ee, Transition as Ca, withCtx as Uo, unref as Ne, withDirectives as x, vModelText as E, vModelCheckbox as he, TransitionGroup as Ma, nextTick as Ki, watch as wn, onUnmounted as yo, vShow as Gn, normalizeStyle as ut, vModelDynamic as za } from "vue";
import { useRouter as Ea } from "vue-router";
import { i18n as Yi, useConfirm as Ko, AppSelect as De } from "@0kay/host";
function Oa(me) {
  return me && me.__esModule && Object.prototype.hasOwnProperty.call(me, "default") ? me.default : me;
}
var _i = { exports: {} };
var Aa = _i.exports, Fo;
function Ia() {
  return Fo || (Fo = 1, (function(me, g) {
    (function(a, Re) {
      Re(g);
    })(Aa, (function(a) {
      var Re = "1.9.4";
      function I(e) {
        var t, n, o, s;
        for (n = 1, o = arguments.length; n < o; n++) {
          s = arguments[n];
          for (t in s)
            e[t] = s[t];
        }
        return e;
      }
      var Fe = Object.create || /* @__PURE__ */ (function() {
        function e() {
        }
        return function(t) {
          return e.prototype = t, new e();
        };
      })();
      function Z(e, t) {
        var n = Array.prototype.slice;
        if (e.bind)
          return e.bind.apply(e, n.call(arguments, 1));
        var o = n.call(arguments, 2);
        return function() {
          return e.apply(t, o.length ? o.concat(n.call(arguments)) : arguments);
        };
      }
      var Pe = 0;
      function K(e) {
        return "_leaflet_id" in e || (e._leaflet_id = ++Pe), e._leaflet_id;
      }
      function tt(e, t, n) {
        var o, s, c, h;
        return h = function() {
          o = !1, s && (c.apply(n, s), s = !1);
        }, c = function() {
          o ? s = arguments : (e.apply(n, arguments), setTimeout(h, t), o = !0);
        }, c;
      }
      function se(e, t, n) {
        var o = t[1], s = t[0], c = o - s;
        return e === o && n ? e : ((e - s) % c + c) % c + s;
      }
      function re() {
        return !1;
      }
      function W(e, t) {
        if (t === !1)
          return e;
        var n = Math.pow(10, t === void 0 ? 6 : t);
        return Math.round(e * n) / n;
      }
      function Ht(e) {
        return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "");
      }
      function Ye(e) {
        return Ht(e).split(/\s+/);
      }
      function de(e, t) {
        Object.prototype.hasOwnProperty.call(e, "options") || (e.options = e.options ? Fe(e.options) : {});
        for (var n in t)
          e.options[n] = t[n];
        return e.options;
      }
      function Wt(e, t, n) {
        var o = [];
        for (var s in e)
          o.push(encodeURIComponent(n ? s.toUpperCase() : s) + "=" + encodeURIComponent(e[s]));
        return (!t || t.indexOf("?") === -1 ? "?" : "&") + o.join("&");
      }
      var xn = /\{ *([\w_ -]+) *\}/g;
      function Lt(e, t) {
        return e.replace(xn, function(n, o) {
          var s = t[o];
          if (s === void 0)
            throw new Error("No value provided for variable " + n);
          return typeof s == "function" && (s = s(t)), s;
        });
      }
      var He = Array.isArray || function(e) {
        return Object.prototype.toString.call(e) === "[object Array]";
      };
      function Ae(e, t) {
        for (var n = 0; n < e.length; n++)
          if (e[n] === t)
            return n;
        return -1;
      }
      var ct = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
      function Ge(e) {
        return window["webkit" + e] || window["moz" + e] || window["ms" + e];
      }
      var kn = 0;
      function Pn(e) {
        var t = +/* @__PURE__ */ new Date(), n = Math.max(0, 16 - (t - kn));
        return kn = t + n, window.setTimeout(e, n);
      }
      var Le = window.requestAnimationFrame || Ge("RequestAnimationFrame") || Pn, Ve = window.cancelAnimationFrame || Ge("CancelAnimationFrame") || Ge("CancelRequestAnimationFrame") || function(e) {
        window.clearTimeout(e);
      };
      function Te(e, t, n) {
        if (n && Le === Pn)
          e.call(t);
        else
          return Le.call(window, Z(e, t));
      }
      function Se(e) {
        e && Ve.call(window, e);
      }
      var Gt = {
        __proto__: null,
        extend: I,
        create: Fe,
        bind: Z,
        get lastId() {
          return Pe;
        },
        stamp: K,
        throttle: tt,
        wrapNum: se,
        falseFn: re,
        formatNum: W,
        trim: Ht,
        splitWords: Ye,
        setOptions: de,
        getParamString: Wt,
        template: Lt,
        isArray: He,
        indexOf: Ae,
        emptyImageUrl: ct,
        requestFn: Le,
        cancelFn: Ve,
        requestAnimFrame: Te,
        cancelAnimFrame: Se
      };
      function nt() {
      }
      nt.extend = function(e) {
        var t = function() {
          de(this), this.initialize && this.initialize.apply(this, arguments), this.callInitHooks();
        }, n = t.__super__ = this.prototype, o = Fe(n);
        o.constructor = t, t.prototype = o;
        for (var s in this)
          Object.prototype.hasOwnProperty.call(this, s) && s !== "prototype" && s !== "__super__" && (t[s] = this[s]);
        return e.statics && I(t, e.statics), e.includes && (jt(e.includes), I.apply(null, [o].concat(e.includes))), I(o, e), delete o.statics, delete o.includes, o.options && (o.options = n.options ? Fe(n.options) : {}, I(o.options, e.options)), o._initHooks = [], o.callInitHooks = function() {
          if (!this._initHooksCalled) {
            n.callInitHooks && n.callInitHooks.call(this), this._initHooksCalled = !0;
            for (var c = 0, h = o._initHooks.length; c < h; c++)
              o._initHooks[c].call(this);
          }
        }, t;
      }, nt.include = function(e) {
        var t = this.prototype.options;
        return I(this.prototype, e), e.options && (this.prototype.options = t, this.mergeOptions(e.options)), this;
      }, nt.mergeOptions = function(e) {
        return I(this.prototype.options, e), this;
      }, nt.addInitHook = function(e) {
        var t = Array.prototype.slice.call(arguments, 1), n = typeof e == "function" ? e : function() {
          this[e].apply(this, t);
        };
        return this.prototype._initHooks = this.prototype._initHooks || [], this.prototype._initHooks.push(n), this;
      };
      function jt(e) {
        if (!(typeof L > "u" || !L || !L.Mixin)) {
          e = He(e) ? e : [e];
          for (var t = 0; t < e.length; t++)
            e[t] === L.Mixin.Events && console.warn("Deprecated include of L.Mixin.Events: this property will be removed in future releases, please inherit from L.Evented instead.", new Error().stack);
        }
      }
      var We = {
        /* @method on(type: String, fn: Function, context?: Object): this
         * Adds a listener function (`fn`) to a particular event type of the object. You can optionally specify the context of the listener (object the this keyword will point to). You can also pass several space-separated types (e.g. `'click dblclick'`).
         *
         * @alternative
         * @method on(eventMap: Object): this
         * Adds a set of type/listener pairs, e.g. `{click: onClick, mousemove: onMouseMove}`
         */
        on: function(e, t, n) {
          if (typeof e == "object")
            for (var o in e)
              this._on(o, e[o], t);
          else {
            e = Ye(e);
            for (var s = 0, c = e.length; s < c; s++)
              this._on(e[s], t, n);
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
        off: function(e, t, n) {
          if (!arguments.length)
            delete this._events;
          else if (typeof e == "object")
            for (var o in e)
              this._off(o, e[o], t);
          else {
            e = Ye(e);
            for (var s = arguments.length === 1, c = 0, h = e.length; c < h; c++)
              s ? this._off(e[c]) : this._off(e[c], t, n);
          }
          return this;
        },
        // attach listener (without syntactic sugar now)
        _on: function(e, t, n, o) {
          if (typeof t != "function") {
            console.warn("wrong listener type: " + typeof t);
            return;
          }
          if (this._listens(e, t, n) === !1) {
            n === this && (n = void 0);
            var s = { fn: t, ctx: n };
            o && (s.once = !0), this._events = this._events || {}, this._events[e] = this._events[e] || [], this._events[e].push(s);
          }
        },
        _off: function(e, t, n) {
          var o, s, c;
          if (this._events && (o = this._events[e], !!o)) {
            if (arguments.length === 1) {
              if (this._firingCount)
                for (s = 0, c = o.length; s < c; s++)
                  o[s].fn = re;
              delete this._events[e];
              return;
            }
            if (typeof t != "function") {
              console.warn("wrong listener type: " + typeof t);
              return;
            }
            var h = this._listens(e, t, n);
            if (h !== !1) {
              var p = o[h];
              this._firingCount && (p.fn = re, this._events[e] = o = o.slice()), o.splice(h, 1);
            }
          }
        },
        // @method fire(type: String, data?: Object, propagate?: Boolean): this
        // Fires an event of the specified type. You can optionally provide a data
        // object — the first argument of the listener function will contain its
        // properties. The event can optionally be propagated to event parents.
        fire: function(e, t, n) {
          if (!this.listens(e, n))
            return this;
          var o = I({}, t, {
            type: e,
            target: this,
            sourceTarget: t && t.sourceTarget || this
          });
          if (this._events) {
            var s = this._events[e];
            if (s) {
              this._firingCount = this._firingCount + 1 || 1;
              for (var c = 0, h = s.length; c < h; c++) {
                var p = s[c], f = p.fn;
                p.once && this.off(e, f, p.ctx), f.call(p.ctx || this, o);
              }
              this._firingCount--;
            }
          }
          return n && this._propagateEvent(o), this;
        },
        // @method listens(type: String, propagate?: Boolean): Boolean
        // @method listens(type: String, fn: Function, context?: Object, propagate?: Boolean): Boolean
        // Returns `true` if a particular event type has any listeners attached to it.
        // The verification can optionally be propagated, it will return `true` if parents have the listener attached to it.
        listens: function(e, t, n, o) {
          typeof e != "string" && console.warn('"string" type argument expected');
          var s = t;
          typeof t != "function" && (o = !!t, s = void 0, n = void 0);
          var c = this._events && this._events[e];
          if (c && c.length && this._listens(e, s, n) !== !1)
            return !0;
          if (o) {
            for (var h in this._eventParents)
              if (this._eventParents[h].listens(e, t, n, o))
                return !0;
          }
          return !1;
        },
        // returns the index (number) or false
        _listens: function(e, t, n) {
          if (!this._events)
            return !1;
          var o = this._events[e] || [];
          if (!t)
            return !!o.length;
          n === this && (n = void 0);
          for (var s = 0, c = o.length; s < c; s++)
            if (o[s].fn === t && o[s].ctx === n)
              return s;
          return !1;
        },
        // @method once(…): this
        // Behaves as [`on(…)`](#evented-on), except the listener will only get fired once and then removed.
        once: function(e, t, n) {
          if (typeof e == "object")
            for (var o in e)
              this._on(o, e[o], t, !0);
          else {
            e = Ye(e);
            for (var s = 0, c = e.length; s < c; s++)
              this._on(e[s], t, n, !0);
          }
          return this;
        },
        // @method addEventParent(obj: Evented): this
        // Adds an event parent - an `Evented` that will receive propagated events
        addEventParent: function(e) {
          return this._eventParents = this._eventParents || {}, this._eventParents[K(e)] = e, this;
        },
        // @method removeEventParent(obj: Evented): this
        // Removes an event parent, so it will stop receiving propagated events
        removeEventParent: function(e) {
          return this._eventParents && delete this._eventParents[K(e)], this;
        },
        _propagateEvent: function(e) {
          for (var t in this._eventParents)
            this._eventParents[t].fire(e.type, I({
              layer: e.target,
              propagatedFrom: e.target
            }, e), !0);
        }
      };
      We.addEventListener = We.on, We.removeEventListener = We.clearAllEventListeners = We.off, We.addOneTimeEventListener = We.once, We.fireEvent = We.fire, We.hasEventListeners = We.listens;
      var Tt = nt.extend(We);
      function F(e, t, n) {
        this.x = n ? Math.round(e) : e, this.y = n ? Math.round(t) : t;
      }
      var nn = Math.trunc || function(e) {
        return e > 0 ? Math.floor(e) : Math.ceil(e);
      };
      F.prototype = {
        // @method clone(): Point
        // Returns a copy of the current point.
        clone: function() {
          return new F(this.x, this.y);
        },
        // @method add(otherPoint: Point): Point
        // Returns the result of addition of the current and the given points.
        add: function(e) {
          return this.clone()._add(U(e));
        },
        _add: function(e) {
          return this.x += e.x, this.y += e.y, this;
        },
        // @method subtract(otherPoint: Point): Point
        // Returns the result of subtraction of the given point from the current.
        subtract: function(e) {
          return this.clone()._subtract(U(e));
        },
        _subtract: function(e) {
          return this.x -= e.x, this.y -= e.y, this;
        },
        // @method divideBy(num: Number): Point
        // Returns the result of division of the current point by the given number.
        divideBy: function(e) {
          return this.clone()._divideBy(e);
        },
        _divideBy: function(e) {
          return this.x /= e, this.y /= e, this;
        },
        // @method multiplyBy(num: Number): Point
        // Returns the result of multiplication of the current point by the given number.
        multiplyBy: function(e) {
          return this.clone()._multiplyBy(e);
        },
        _multiplyBy: function(e) {
          return this.x *= e, this.y *= e, this;
        },
        // @method scaleBy(scale: Point): Point
        // Multiply each coordinate of the current point by each coordinate of
        // `scale`. In linear algebra terms, multiply the point by the
        // [scaling matrix](https://en.wikipedia.org/wiki/Scaling_%28geometry%29#Matrix_representation)
        // defined by `scale`.
        scaleBy: function(e) {
          return new F(this.x * e.x, this.y * e.y);
        },
        // @method unscaleBy(scale: Point): Point
        // Inverse of `scaleBy`. Divide each coordinate of the current point by
        // each coordinate of `scale`.
        unscaleBy: function(e) {
          return new F(this.x / e.x, this.y / e.y);
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
          return this.x = nn(this.x), this.y = nn(this.y), this;
        },
        // @method distanceTo(otherPoint: Point): Number
        // Returns the cartesian distance between the current and the given points.
        distanceTo: function(e) {
          e = U(e);
          var t = e.x - this.x, n = e.y - this.y;
          return Math.sqrt(t * t + n * n);
        },
        // @method equals(otherPoint: Point): Boolean
        // Returns `true` if the given point has the same coordinates.
        equals: function(e) {
          return e = U(e), e.x === this.x && e.y === this.y;
        },
        // @method contains(otherPoint: Point): Boolean
        // Returns `true` if both coordinates of the given point are less than the corresponding current point coordinates (in absolute values).
        contains: function(e) {
          return e = U(e), Math.abs(e.x) <= Math.abs(this.x) && Math.abs(e.y) <= Math.abs(this.y);
        },
        // @method toString(): String
        // Returns a string representation of the point for debugging purposes.
        toString: function() {
          return "Point(" + W(this.x) + ", " + W(this.y) + ")";
        }
      };
      function U(e, t, n) {
        return e instanceof F ? e : He(e) ? new F(e[0], e[1]) : e == null ? e : typeof e == "object" && "x" in e && "y" in e ? new F(e.x, e.y) : new F(e, t, n);
      }
      function y(e, t) {
        if (e)
          for (var n = t ? [e, t] : e, o = 0, s = n.length; o < s; o++)
            this.extend(n[o]);
      }
      y.prototype = {
        // @method extend(point: Point): this
        // Extends the bounds to contain the given point.
        // @alternative
        // @method extend(otherBounds: Bounds): this
        // Extend the bounds to contain the given bounds
        extend: function(e) {
          var t, n;
          if (!e)
            return this;
          if (e instanceof F || typeof e[0] == "number" || "x" in e)
            t = n = U(e);
          else if (e = T(e), t = e.min, n = e.max, !t || !n)
            return this;
          return !this.min && !this.max ? (this.min = t.clone(), this.max = n.clone()) : (this.min.x = Math.min(t.x, this.min.x), this.max.x = Math.max(n.x, this.max.x), this.min.y = Math.min(t.y, this.min.y), this.max.y = Math.max(n.y, this.max.y)), this;
        },
        // @method getCenter(round?: Boolean): Point
        // Returns the center point of the bounds.
        getCenter: function(e) {
          return U(
            (this.min.x + this.max.x) / 2,
            (this.min.y + this.max.y) / 2,
            e
          );
        },
        // @method getBottomLeft(): Point
        // Returns the bottom-left point of the bounds.
        getBottomLeft: function() {
          return U(this.min.x, this.max.y);
        },
        // @method getTopRight(): Point
        // Returns the top-right point of the bounds.
        getTopRight: function() {
          return U(this.max.x, this.min.y);
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
        contains: function(e) {
          var t, n;
          return typeof e[0] == "number" || e instanceof F ? e = U(e) : e = T(e), e instanceof y ? (t = e.min, n = e.max) : t = n = e, t.x >= this.min.x && n.x <= this.max.x && t.y >= this.min.y && n.y <= this.max.y;
        },
        // @method intersects(otherBounds: Bounds): Boolean
        // Returns `true` if the rectangle intersects the given bounds. Two bounds
        // intersect if they have at least one point in common.
        intersects: function(e) {
          e = T(e);
          var t = this.min, n = this.max, o = e.min, s = e.max, c = s.x >= t.x && o.x <= n.x, h = s.y >= t.y && o.y <= n.y;
          return c && h;
        },
        // @method overlaps(otherBounds: Bounds): Boolean
        // Returns `true` if the rectangle overlaps the given bounds. Two bounds
        // overlap if their intersection is an area.
        overlaps: function(e) {
          e = T(e);
          var t = this.min, n = this.max, o = e.min, s = e.max, c = s.x > t.x && o.x < n.x, h = s.y > t.y && o.y < n.y;
          return c && h;
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
        pad: function(e) {
          var t = this.min, n = this.max, o = Math.abs(t.x - n.x) * e, s = Math.abs(t.y - n.y) * e;
          return T(
            U(t.x - o, t.y - s),
            U(n.x + o, n.y + s)
          );
        },
        // @method equals(otherBounds: Bounds): Boolean
        // Returns `true` if the rectangle is equivalent to the given bounds.
        equals: function(e) {
          return e ? (e = T(e), this.min.equals(e.getTopLeft()) && this.max.equals(e.getBottomRight())) : !1;
        }
      };
      function T(e, t) {
        return !e || e instanceof y ? e : new y(e, t);
      }
      function b(e, t) {
        if (e)
          for (var n = t ? [e, t] : e, o = 0, s = n.length; o < s; o++)
            this.extend(n[o]);
      }
      b.prototype = {
        // @method extend(latlng: LatLng): this
        // Extend the bounds to contain the given point
        // @alternative
        // @method extend(otherBounds: LatLngBounds): this
        // Extend the bounds to contain the given bounds
        extend: function(e) {
          var t = this._southWest, n = this._northEast, o, s;
          if (e instanceof X)
            o = e, s = e;
          else if (e instanceof b) {
            if (o = e._southWest, s = e._northEast, !o || !s)
              return this;
          } else
            return e ? this.extend(ie(e) || ne(e)) : this;
          return !t && !n ? (this._southWest = new X(o.lat, o.lng), this._northEast = new X(s.lat, s.lng)) : (t.lat = Math.min(o.lat, t.lat), t.lng = Math.min(o.lng, t.lng), n.lat = Math.max(s.lat, n.lat), n.lng = Math.max(s.lng, n.lng)), this;
        },
        // @method pad(bufferRatio: Number): LatLngBounds
        // Returns bounds created by extending or retracting the current bounds by a given ratio in each direction.
        // For example, a ratio of 0.5 extends the bounds by 50% in each direction.
        // Negative values will retract the bounds.
        pad: function(e) {
          var t = this._southWest, n = this._northEast, o = Math.abs(t.lat - n.lat) * e, s = Math.abs(t.lng - n.lng) * e;
          return new b(
            new X(t.lat - o, t.lng - s),
            new X(n.lat + o, n.lng + s)
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
        contains: function(e) {
          typeof e[0] == "number" || e instanceof X || "lat" in e ? e = ie(e) : e = ne(e);
          var t = this._southWest, n = this._northEast, o, s;
          return e instanceof b ? (o = e.getSouthWest(), s = e.getNorthEast()) : o = s = e, o.lat >= t.lat && s.lat <= n.lat && o.lng >= t.lng && s.lng <= n.lng;
        },
        // @method intersects(otherBounds: LatLngBounds): Boolean
        // Returns `true` if the rectangle intersects the given bounds. Two bounds intersect if they have at least one point in common.
        intersects: function(e) {
          e = ne(e);
          var t = this._southWest, n = this._northEast, o = e.getSouthWest(), s = e.getNorthEast(), c = s.lat >= t.lat && o.lat <= n.lat, h = s.lng >= t.lng && o.lng <= n.lng;
          return c && h;
        },
        // @method overlaps(otherBounds: LatLngBounds): Boolean
        // Returns `true` if the rectangle overlaps the given bounds. Two bounds overlap if their intersection is an area.
        overlaps: function(e) {
          e = ne(e);
          var t = this._southWest, n = this._northEast, o = e.getSouthWest(), s = e.getNorthEast(), c = s.lat > t.lat && o.lat < n.lat, h = s.lng > t.lng && o.lng < n.lng;
          return c && h;
        },
        // @method toBBoxString(): String
        // Returns a string with bounding box coordinates in a 'southwest_lng,southwest_lat,northeast_lng,northeast_lat' format. Useful for sending requests to web services that return geo data.
        toBBoxString: function() {
          return [this.getWest(), this.getSouth(), this.getEast(), this.getNorth()].join(",");
        },
        // @method equals(otherBounds: LatLngBounds, maxMargin?: Number): Boolean
        // Returns `true` if the rectangle is equivalent (within a small margin of error) to the given bounds. The margin of error can be overridden by setting `maxMargin` to a small number.
        equals: function(e, t) {
          return e ? (e = ne(e), this._southWest.equals(e.getSouthWest(), t) && this._northEast.equals(e.getNorthEast(), t)) : !1;
        },
        // @method isValid(): Boolean
        // Returns `true` if the bounds are properly initialized.
        isValid: function() {
          return !!(this._southWest && this._northEast);
        }
      };
      function ne(e, t) {
        return e instanceof b ? e : new b(e, t);
      }
      function X(e, t, n) {
        if (isNaN(e) || isNaN(t))
          throw new Error("Invalid LatLng object: (" + e + ", " + t + ")");
        this.lat = +e, this.lng = +t, n !== void 0 && (this.alt = +n);
      }
      X.prototype = {
        // @method equals(otherLatLng: LatLng, maxMargin?: Number): Boolean
        // Returns `true` if the given `LatLng` point is at the same position (within a small margin of error). The margin of error can be overridden by setting `maxMargin` to a small number.
        equals: function(e, t) {
          if (!e)
            return !1;
          e = ie(e);
          var n = Math.max(
            Math.abs(this.lat - e.lat),
            Math.abs(this.lng - e.lng)
          );
          return n <= (t === void 0 ? 1e-9 : t);
        },
        // @method toString(): String
        // Returns a string representation of the point (for debugging purposes).
        toString: function(e) {
          return "LatLng(" + W(this.lat, e) + ", " + W(this.lng, e) + ")";
        },
        // @method distanceTo(otherLatLng: LatLng): Number
        // Returns the distance (in meters) to the given `LatLng` calculated using the [Spherical Law of Cosines](https://en.wikipedia.org/wiki/Spherical_law_of_cosines).
        distanceTo: function(e) {
          return pe.distance(this, ie(e));
        },
        // @method wrap(): LatLng
        // Returns a new `LatLng` object with the longitude wrapped so it's always between -180 and +180 degrees.
        wrap: function() {
          return pe.wrapLatLng(this);
        },
        // @method toBounds(sizeInMeters: Number): LatLngBounds
        // Returns a new `LatLngBounds` object in which each boundary is `sizeInMeters/2` meters apart from the `LatLng`.
        toBounds: function(e) {
          var t = 180 * e / 40075017, n = t / Math.cos(Math.PI / 180 * this.lat);
          return ne(
            [this.lat - t, this.lng - n],
            [this.lat + t, this.lng + n]
          );
        },
        clone: function() {
          return new X(this.lat, this.lng, this.alt);
        }
      };
      function ie(e, t, n) {
        return e instanceof X ? e : He(e) && typeof e[0] != "object" ? e.length === 3 ? new X(e[0], e[1], e[2]) : e.length === 2 ? new X(e[0], e[1]) : null : e == null ? e : typeof e == "object" && "lat" in e ? new X(e.lat, "lng" in e ? e.lng : e.lon, e.alt) : t === void 0 ? null : new X(e, t, n);
      }
      var dt = {
        // @method latLngToPoint(latlng: LatLng, zoom: Number): Point
        // Projects geographical coordinates into pixel coordinates for a given zoom.
        latLngToPoint: function(e, t) {
          var n = this.projection.project(e), o = this.scale(t);
          return this.transformation._transform(n, o);
        },
        // @method pointToLatLng(point: Point, zoom: Number): LatLng
        // The inverse of `latLngToPoint`. Projects pixel coordinates on a given
        // zoom into geographical coordinates.
        pointToLatLng: function(e, t) {
          var n = this.scale(t), o = this.transformation.untransform(e, n);
          return this.projection.unproject(o);
        },
        // @method project(latlng: LatLng): Point
        // Projects geographical coordinates into coordinates in units accepted for
        // this CRS (e.g. meters for EPSG:3857, for passing it to WMS services).
        project: function(e) {
          return this.projection.project(e);
        },
        // @method unproject(point: Point): LatLng
        // Given a projected coordinate returns the corresponding LatLng.
        // The inverse of `project`.
        unproject: function(e) {
          return this.projection.unproject(e);
        },
        // @method scale(zoom: Number): Number
        // Returns the scale used when transforming projected coordinates into
        // pixel coordinates for a particular zoom. For example, it returns
        // `256 * 2^zoom` for Mercator-based CRS.
        scale: function(e) {
          return 256 * Math.pow(2, e);
        },
        // @method zoom(scale: Number): Number
        // Inverse of `scale()`, returns the zoom level corresponding to a scale
        // factor of `scale`.
        zoom: function(e) {
          return Math.log(e / 256) / Math.LN2;
        },
        // @method getProjectedBounds(zoom: Number): Bounds
        // Returns the projection's bounds scaled and transformed for the provided `zoom`.
        getProjectedBounds: function(e) {
          if (this.infinite)
            return null;
          var t = this.projection.bounds, n = this.scale(e), o = this.transformation.transform(t.min, n), s = this.transformation.transform(t.max, n);
          return new y(o, s);
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
        wrapLatLng: function(e) {
          var t = this.wrapLng ? se(e.lng, this.wrapLng, !0) : e.lng, n = this.wrapLat ? se(e.lat, this.wrapLat, !0) : e.lat, o = e.alt;
          return new X(n, t, o);
        },
        // @method wrapLatLngBounds(bounds: LatLngBounds): LatLngBounds
        // Returns a `LatLngBounds` with the same size as the given one, ensuring
        // that its center is within the CRS's bounds.
        // Only accepts actual `L.LatLngBounds` instances, not arrays.
        wrapLatLngBounds: function(e) {
          var t = e.getCenter(), n = this.wrapLatLng(t), o = t.lat - n.lat, s = t.lng - n.lng;
          if (o === 0 && s === 0)
            return e;
          var c = e.getSouthWest(), h = e.getNorthEast(), p = new X(c.lat - o, c.lng - s), f = new X(h.lat - o, h.lng - s);
          return new b(p, f);
        }
      }, pe = I({}, dt, {
        wrapLng: [-180, 180],
        // Mean Earth Radius, as recommended for use by
        // the International Union of Geodesy and Geophysics,
        // see https://rosettacode.org/wiki/Haversine_formula
        R: 6371e3,
        // distance between two geographical points using spherical law of cosines approximation
        distance: function(e, t) {
          var n = Math.PI / 180, o = e.lat * n, s = t.lat * n, c = Math.sin((t.lat - e.lat) * n / 2), h = Math.sin((t.lng - e.lng) * n / 2), p = c * c + Math.cos(o) * Math.cos(s) * h * h, f = 2 * Math.atan2(Math.sqrt(p), Math.sqrt(1 - p));
          return this.R * f;
        }
      }), on = 6378137, Bt = {
        R: on,
        MAX_LATITUDE: 85.0511287798,
        project: function(e) {
          var t = Math.PI / 180, n = this.MAX_LATITUDE, o = Math.max(Math.min(n, e.lat), -n), s = Math.sin(o * t);
          return new F(
            this.R * e.lng * t,
            this.R * Math.log((1 + s) / (1 - s)) / 2
          );
        },
        unproject: function(e) {
          var t = 180 / Math.PI;
          return new X(
            (2 * Math.atan(Math.exp(e.y / this.R)) - Math.PI / 2) * t,
            e.x * t / this.R
          );
        },
        bounds: (function() {
          var e = on * Math.PI;
          return new y([-e, -e], [e, e]);
        })()
      };
      function Je(e, t, n, o) {
        if (He(e)) {
          this._a = e[0], this._b = e[1], this._c = e[2], this._d = e[3];
          return;
        }
        this._a = e, this._b = t, this._c = n, this._d = o;
      }
      Je.prototype = {
        // @method transform(point: Point, scale?: Number): Point
        // Returns a transformed point, optionally multiplied by the given scale.
        // Only accepts actual `L.Point` instances, not arrays.
        transform: function(e, t) {
          return this._transform(e.clone(), t);
        },
        // destructive transform (faster)
        _transform: function(e, t) {
          return t = t || 1, e.x = t * (this._a * e.x + this._b), e.y = t * (this._c * e.y + this._d), e;
        },
        // @method untransform(point: Point, scale?: Number): Point
        // Returns the reverse transformation of the given point, optionally divided
        // by the given scale. Only accepts actual `L.Point` instances, not arrays.
        untransform: function(e, t) {
          return t = t || 1, new F(
            (e.x / t - this._b) / this._a,
            (e.y / t - this._d) / this._c
          );
        }
      };
      function qt(e, t, n, o) {
        return new Je(e, t, n, o);
      }
      var an = I({}, pe, {
        code: "EPSG:3857",
        projection: Bt,
        transformation: (function() {
          var e = 0.5 / (Math.PI * Bt.R);
          return qt(e, 0.5, -e, 0.5);
        })()
      }), jn = I({}, an, {
        code: "EPSG:900913"
      });
      function Kt(e) {
        return document.createElementNS("http://www.w3.org/2000/svg", e);
      }
      function $e(e, t) {
        var n = "", o, s, c, h, p, f;
        for (o = 0, c = e.length; o < c; o++) {
          for (p = e[o], s = 0, h = p.length; s < h; s++)
            f = p[s], n += (s ? "L" : "M") + f.x + " " + f.y;
          n += t ? S.svg ? "z" : "x" : "";
        }
        return n || "M0 0";
      }
      var Ie = document.documentElement.style, je = "ActiveXObject" in window, H = je && !document.addEventListener, vi = "msLaunchUri" in navigator && !("documentMode" in document), qn = it("webkit"), Kn = it("android"), Yn = it("android 2") || it("android 3"), gi = parseInt(/WebKit\/([0-9]+)|$/.exec(navigator.userAgent)[1], 10), Ji = Kn && it("Google") && gi < 537 && !("AudioNode" in window), ht = !!window.opera, yi = !vi && it("chrome"), we = it("gecko") && !qn && !ht && !je, St = !yi && it("safari"), Ln = it("phantom"), Tn = "OTransition" in Ie, Xi = navigator.platform.indexOf("Win") === 0, Jn = je && "transition" in Ie, Sn = "WebKitCSSMatrix" in window && "m11" in new window.WebKitCSSMatrix() && !Yn, Xn = "MozPerspective" in Ie, Qi = !window.L_DISABLE_3D && (Jn || Sn || Xn) && !Tn && !Ln, sn = typeof orientation < "u" || it("mobile"), bi = sn && qn, wi = sn && Sn, xi = !window.PointerEvent && window.MSPointerEvent, ki = !!(window.PointerEvent || xi), xe = "ontouchstart" in window || !!window.TouchEvent, Cn = !window.L_NO_TOUCH && (xe || ki), Qn = sn && ht, Pi = sn && we, Li = (window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI) > 1, ei = (function() {
        var e = !1;
        try {
          var t = Object.defineProperty({}, "passive", {
            get: function() {
              e = !0;
            }
          });
          window.addEventListener("testPassiveEventSupport", re, t), window.removeEventListener("testPassiveEventSupport", re, t);
        } catch {
        }
        return e;
      })(), Mn = (function() {
        return !!document.createElement("canvas").getContext;
      })(), Ct = !!(document.createElementNS && Kt("svg").createSVGRect), ti = !!Ct && (function() {
        var e = document.createElement("div");
        return e.innerHTML = "<svg/>", (e.firstChild && e.firstChild.namespaceURI) === "http://www.w3.org/2000/svg";
      })(), zn = !Ct && (function() {
        try {
          var e = document.createElement("div");
          e.innerHTML = '<v:shape adj="1"/>';
          var t = e.firstChild;
          return t.style.behavior = "url(#default#VML)", t && typeof t.adj == "object";
        } catch {
          return !1;
        }
      })(), En = navigator.platform.indexOf("Mac") === 0, Ti = navigator.platform.indexOf("Linux") === 0;
      function it(e) {
        return navigator.userAgent.toLowerCase().indexOf(e) >= 0;
      }
      var S = {
        ie: je,
        ielt9: H,
        edge: vi,
        webkit: qn,
        android: Kn,
        android23: Yn,
        androidStock: Ji,
        opera: ht,
        chrome: yi,
        gecko: we,
        safari: St,
        phantom: Ln,
        opera12: Tn,
        win: Xi,
        ie3d: Jn,
        webkit3d: Sn,
        gecko3d: Xn,
        any3d: Qi,
        mobile: sn,
        mobileWebkit: bi,
        mobileWebkit3d: wi,
        msPointer: xi,
        pointer: ki,
        touch: Cn,
        touchNative: xe,
        mobileOpera: Qn,
        mobileGecko: Pi,
        retina: Li,
        passiveEvents: ei,
        canvas: Mn,
        svg: Ct,
        vml: zn,
        inlineSvg: ti,
        mac: En,
        linux: Ti
      }, pt = S.msPointer ? "MSPointerDown" : "pointerdown", ft = S.msPointer ? "MSPointerMove" : "pointermove", ot = S.msPointer ? "MSPointerUp" : "pointerup", yt = S.msPointer ? "MSPointerCancel" : "pointercancel", ni = {
        touchstart: pt,
        touchmove: ft,
        touchend: ot,
        touchcancel: yt
      }, Si = {
        touchstart: zi,
        touchmove: ln,
        touchend: ln,
        touchcancel: ln
      }, Yt = {}, Ci = !1;
      function eo(e, t, n) {
        return t === "touchstart" && Mi(), Si[t] ? (n = Si[t].bind(this, n), e.addEventListener(ni[t], n, !1), n) : (console.warn("wrong event specified:", t), re);
      }
      function to(e, t, n) {
        if (!ni[t]) {
          console.warn("wrong event specified:", t);
          return;
        }
        e.removeEventListener(ni[t], n, !1);
      }
      function no(e) {
        Yt[e.pointerId] = e;
      }
      function io(e) {
        Yt[e.pointerId] && (Yt[e.pointerId] = e);
      }
      function On(e) {
        delete Yt[e.pointerId];
      }
      function Mi() {
        Ci || (document.addEventListener(pt, no, !0), document.addEventListener(ft, io, !0), document.addEventListener(ot, On, !0), document.addEventListener(yt, On, !0), Ci = !0);
      }
      function ln(e, t) {
        if (t.pointerType !== (t.MSPOINTER_TYPE_MOUSE || "mouse")) {
          t.touches = [];
          for (var n in Yt)
            t.touches.push(Yt[n]);
          t.changedTouches = [t], e(t);
        }
      }
      function zi(e, t) {
        t.MSPOINTER_TYPE_TOUCH && t.pointerType === t.MSPOINTER_TYPE_TOUCH && ve(t), ln(e, t);
      }
      function oo(e) {
        var t = {}, n, o;
        for (o in e)
          n = e[o], t[o] = n && n.bind ? n.bind(e) : n;
        return e = t, t.type = "dblclick", t.detail = 2, t.isTrusted = !1, t._simulated = !0, t;
      }
      var ao = 200;
      function m(e, t) {
        e.addEventListener("dblclick", t);
        var n = 0, o;
        function s(c) {
          if (c.detail !== 1) {
            o = c.detail;
            return;
          }
          if (!(c.pointerType === "mouse" || c.sourceCapabilities && !c.sourceCapabilities.firesTouchEvents)) {
            var h = fn(c);
            if (!(h.some(function(f) {
              return f instanceof HTMLLabelElement && f.attributes.for;
            }) && !h.some(function(f) {
              return f instanceof HTMLInputElement || f instanceof HTMLSelectElement;
            }))) {
              var p = Date.now();
              p - n <= ao ? (o++, o === 2 && t(oo(c))) : o = 1, n = p;
            }
          }
        }
        return e.addEventListener("click", s), {
          dblclick: t,
          simDblclick: s
        };
      }
      function rn(e, t) {
        e.removeEventListener("dblclick", t.dblclick), e.removeEventListener("click", t.simDblclick);
      }
      var Zt = An(
        ["transform", "webkitTransform", "OTransform", "MozTransform", "msTransform"]
      ), un = An(
        ["webkitTransition", "transition", "OTransition", "MozTransition", "msTransition"]
      ), Jt = un === "webkitTransition" || un === "OTransition" ? un + "End" : "transitionend";
      function Xt(e) {
        return typeof e == "string" ? document.getElementById(e) : e;
      }
      function bt(e, t) {
        var n = e.style[t] || e.currentStyle && e.currentStyle[t];
        if ((!n || n === "auto") && document.defaultView) {
          var o = document.defaultView.getComputedStyle(e, null);
          n = o ? o[t] : null;
        }
        return n === "auto" ? null : n;
      }
      function Q(e, t, n) {
        var o = document.createElement(e);
        return o.className = t || "", n && n.appendChild(o), o;
      }
      function fe(e) {
        var t = e.parentNode;
        t && t.removeChild(e);
      }
      function Mt(e) {
        for (; e.firstChild; )
          e.removeChild(e.firstChild);
      }
      function mt(e) {
        var t = e.parentNode;
        t && t.lastChild !== e && t.appendChild(e);
      }
      function _t(e) {
        var t = e.parentNode;
        t && t.firstChild !== e && t.insertBefore(e, t.firstChild);
      }
      function Xe(e, t) {
        if (e.classList !== void 0)
          return e.classList.contains(t);
        var n = J(e);
        return n.length > 0 && new RegExp("(^|\\s)" + t + "(\\s|$)").test(n);
      }
      function G(e, t) {
        if (e.classList !== void 0)
          for (var n = Ye(t), o = 0, s = n.length; o < s; o++)
            e.classList.add(n[o]);
        else if (!Xe(e, t)) {
          var c = J(e);
          at(e, (c ? c + " " : "") + t);
        }
      }
      function ke(e, t) {
        e.classList !== void 0 ? e.classList.remove(t) : at(e, Ht((" " + J(e) + " ").replace(" " + t + " ", " ")));
      }
      function at(e, t) {
        e.className.baseVal === void 0 ? e.className = t : e.className.baseVal = t;
      }
      function J(e) {
        return e.correspondingElement && (e = e.correspondingElement), e.className.baseVal === void 0 ? e.className : e.className.baseVal;
      }
      function Qe(e, t) {
        "opacity" in e.style ? e.style.opacity = t : "filter" in e.style && so(e, t);
      }
      function so(e, t) {
        var n = !1, o = "DXImageTransform.Microsoft.Alpha";
        try {
          n = e.filters.item(o);
        } catch {
          if (t === 1)
            return;
        }
        t = Math.round(t * 100), n ? (n.Enabled = t !== 100, n.Opacity = t) : e.style.filter += " progid:" + o + "(opacity=" + t + ")";
      }
      function An(e) {
        for (var t = document.documentElement.style, n = 0; n < e.length; n++)
          if (e[n] in t)
            return e[n];
        return !1;
      }
      function zt(e, t, n) {
        var o = t || new F(0, 0);
        e.style[Zt] = (S.ie3d ? "translate(" + o.x + "px," + o.y + "px)" : "translate3d(" + o.x + "px," + o.y + "px,0)") + (n ? " scale(" + n + ")" : "");
      }
      function Ce(e, t) {
        e._leaflet_pos = t, S.any3d ? zt(e, t) : (e.style.left = t.x + "px", e.style.top = t.y + "px");
      }
      function Me(e) {
        return e._leaflet_pos || new F(0, 0);
      }
      var Et, wt, _e;
      if ("onselectstart" in document)
        Et = function() {
          j(window, "selectstart", ve);
        }, wt = function() {
          Y(window, "selectstart", ve);
        };
      else {
        var N = An(
          ["userSelect", "WebkitUserSelect", "OUserSelect", "MozUserSelect", "msUserSelect"]
        );
        Et = function() {
          if (N) {
            var e = document.documentElement.style;
            _e = e[N], e[N] = "none";
          }
        }, wt = function() {
          N && (document.documentElement.style[N] = _e, _e = void 0);
        };
      }
      function cn() {
        j(window, "dragstart", ve);
      }
      function In() {
        Y(window, "dragstart", ve);
      }
      var dn, Nt;
      function Ot(e) {
        for (; e.tabIndex === -1; )
          e = e.parentNode;
        e.style && (xt(), dn = e, Nt = e.style.outlineStyle, e.style.outlineStyle = "none", j(window, "keydown", xt));
      }
      function xt() {
        dn && (dn.style.outlineStyle = Nt, dn = void 0, Nt = void 0, Y(window, "keydown", xt));
      }
      function Bn(e) {
        do
          e = e.parentNode;
        while ((!e.offsetWidth || !e.offsetHeight) && e !== document.body);
        return e;
      }
      function vt(e) {
        var t = e.getBoundingClientRect();
        return {
          x: t.width / e.offsetWidth || 1,
          y: t.height / e.offsetHeight || 1,
          boundingClientRect: t
        };
      }
      var lo = {
        __proto__: null,
        TRANSFORM: Zt,
        TRANSITION: un,
        TRANSITION_END: Jt,
        get: Xt,
        getStyle: bt,
        create: Q,
        remove: fe,
        empty: Mt,
        toFront: mt,
        toBack: _t,
        hasClass: Xe,
        addClass: G,
        removeClass: ke,
        setClass: at,
        getClass: J,
        setOpacity: Qe,
        testProp: An,
        setTransform: zt,
        setPosition: Ce,
        getPosition: Me,
        get disableTextSelection() {
          return Et;
        },
        get enableTextSelection() {
          return wt;
        },
        disableImageDrag: cn,
        enableImageDrag: In,
        preventOutline: Ot,
        restoreOutline: xt,
        getSizedParentNode: Bn,
        getScale: vt
      };
      function j(e, t, n, o) {
        if (t && typeof t == "object")
          for (var s in t)
            oi(e, s, t[s], n);
        else {
          t = Ye(t);
          for (var c = 0, h = t.length; c < h; c++)
            oi(e, t[c], n, o);
        }
        return this;
      }
      var qe = "_leaflet_events";
      function Y(e, t, n, o) {
        if (arguments.length === 1)
          st(e), delete e[qe];
        else if (t && typeof t == "object")
          for (var s in t)
            Zn(e, s, t[s], n);
        else if (t = Ye(t), arguments.length === 2)
          st(e, function(p) {
            return Ae(t, p) !== -1;
          });
        else
          for (var c = 0, h = t.length; c < h; c++)
            Zn(e, t[c], n, o);
        return this;
      }
      function st(e, t) {
        for (var n in e[qe]) {
          var o = n.split(/\d/)[0];
          (!t || t(o)) && Zn(e, o, null, null, n);
        }
      }
      var ii = {
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        wheel: !("onwheel" in window) && "mousewheel"
      };
      function oi(e, t, n, o) {
        var s = t + K(n) + (o ? "_" + K(o) : "");
        if (e[qe] && e[qe][s])
          return this;
        var c = function(p) {
          return n.call(o || e, p || window.event);
        }, h = c;
        !S.touchNative && S.pointer && t.indexOf("touch") === 0 ? c = eo(e, t, c) : S.touch && t === "dblclick" ? c = m(e, c) : "addEventListener" in e ? t === "touchstart" || t === "touchmove" || t === "wheel" || t === "mousewheel" ? e.addEventListener(ii[t] || t, c, S.passiveEvents ? { passive: !1 } : !1) : t === "mouseenter" || t === "mouseleave" ? (c = function(p) {
          p = p || window.event, ye(e, p) && h(p);
        }, e.addEventListener(ii[t], c, !1)) : e.addEventListener(t, h, !1) : e.attachEvent("on" + t, c), e[qe] = e[qe] || {}, e[qe][s] = c;
      }
      function Zn(e, t, n, o, s) {
        s = s || t + K(n) + (o ? "_" + K(o) : "");
        var c = e[qe] && e[qe][s];
        if (!c)
          return this;
        !S.touchNative && S.pointer && t.indexOf("touch") === 0 ? to(e, t, c) : S.touch && t === "dblclick" ? rn(e, c) : "removeEventListener" in e ? e.removeEventListener(ii[t] || t, c, !1) : e.detachEvent("on" + t, c), e[qe][s] = null;
      }
      function Dt(e) {
        return e.stopPropagation ? e.stopPropagation() : e.originalEvent ? e.originalEvent._stopped = !0 : e.cancelBubble = !0, this;
      }
      function hn(e) {
        return oi(e, "wheel", Dt), this;
      }
      function pn(e) {
        return j(e, "mousedown touchstart dblclick contextmenu", Dt), e._leaflet_disable_click = !0, this;
      }
      function ve(e) {
        return e.preventDefault ? e.preventDefault() : e.returnValue = !1, this;
      }
      function kt(e) {
        return ve(e), Dt(e), this;
      }
      function fn(e) {
        if (e.composedPath)
          return e.composedPath();
        for (var t = [], n = e.target; n; )
          t.push(n), n = n.parentNode;
        return t;
      }
      function mn(e, t) {
        if (!t)
          return new F(e.clientX, e.clientY);
        var n = vt(t), o = n.boundingClientRect;
        return new F(
          // offset.left/top values are in page scale (like clientX/Y),
          // whereas clientLeft/Top (border width) values are the original values (before CSS scale applies).
          (e.clientX - o.left) / n.x - t.clientLeft,
          (e.clientY - o.top) / n.y - t.clientTop
        );
      }
      var Ei = S.linux && S.chrome ? window.devicePixelRatio : S.mac ? window.devicePixelRatio * 3 : window.devicePixelRatio > 0 ? 2 * window.devicePixelRatio : 1;
      function _n(e) {
        return S.edge ? e.wheelDeltaY / 2 : (
          // Don't trust window-geometry-based delta
          e.deltaY && e.deltaMode === 0 ? -e.deltaY / Ei : (
            // Pixels
            e.deltaY && e.deltaMode === 1 ? -e.deltaY * 20 : (
              // Lines
              e.deltaY && e.deltaMode === 2 ? -e.deltaY * 60 : (
                // Pages
                e.deltaX || e.deltaZ ? 0 : (
                  // Skip horizontal/depth wheel events
                  e.wheelDelta ? (e.wheelDeltaY || e.wheelDelta) / 2 : (
                    // Legacy IE pixels
                    e.detail && Math.abs(e.detail) < 32765 ? -e.detail * 20 : (
                      // Legacy Moz lines
                      e.detail ? e.detail / -32765 * 60 : (
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
      function ye(e, t) {
        var n = t.relatedTarget;
        if (!n)
          return !0;
        try {
          for (; n && n !== e; )
            n = n.parentNode;
        } catch {
          return !1;
        }
        return n !== e;
      }
      var ro = {
        __proto__: null,
        on: j,
        off: Y,
        stopPropagation: Dt,
        disableScrollPropagation: hn,
        disableClickPropagation: pn,
        preventDefault: ve,
        stop: kt,
        getPropagationPath: fn,
        getMousePosition: mn,
        getWheelDelta: _n,
        isExternalTarget: ye,
        addListener: j,
        removeListener: Y
      }, Qt = Tt.extend({
        // @method run(el: HTMLElement, newPos: Point, duration?: Number, easeLinearity?: Number)
        // Run an animation of a given element to a new position, optionally setting
        // duration in seconds (`0.25` by default) and easing linearity factor (3rd
        // argument of the [cubic bezier curve](https://cubic-bezier.com/#0,0,.5,1),
        // `0.5` by default).
        run: function(e, t, n, o) {
          this.stop(), this._el = e, this._inProgress = !0, this._duration = n || 0.25, this._easeOutPower = 1 / Math.max(o || 0.5, 0.2), this._startPos = Me(e), this._offset = t.subtract(this._startPos), this._startTime = +/* @__PURE__ */ new Date(), this.fire("start"), this._animate();
        },
        // @method stop()
        // Stops the animation (if currently running).
        stop: function() {
          this._inProgress && (this._step(!0), this._complete());
        },
        _animate: function() {
          this._animId = Te(this._animate, this), this._step();
        },
        _step: function(e) {
          var t = +/* @__PURE__ */ new Date() - this._startTime, n = this._duration * 1e3;
          t < n ? this._runFrame(this._easeOut(t / n), e) : (this._runFrame(1), this._complete());
        },
        _runFrame: function(e, t) {
          var n = this._startPos.add(this._offset.multiplyBy(e));
          t && n._round(), Ce(this._el, n), this.fire("step");
        },
        _complete: function() {
          Se(this._animId), this._inProgress = !1, this.fire("end");
        },
        _easeOut: function(e) {
          return 1 - Math.pow(1 - e, this._easeOutPower);
        }
      }), oe = Tt.extend({
        options: {
          // @section Map State Options
          // @option crs: CRS = L.CRS.EPSG3857
          // The [Coordinate Reference System](#crs) to use. Don't change this if you're not
          // sure what it means.
          crs: an,
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
        initialize: function(e, t) {
          t = de(this, t), this._handlers = [], this._layers = {}, this._zoomBoundLayers = {}, this._sizeChanged = !0, this._initContainer(e), this._initLayout(), this._onResize = Z(this._onResize, this), this._initEvents(), t.maxBounds && this.setMaxBounds(t.maxBounds), t.zoom !== void 0 && (this._zoom = this._limitZoom(t.zoom)), t.center && t.zoom !== void 0 && this.setView(ie(t.center), t.zoom, { reset: !0 }), this.callInitHooks(), this._zoomAnimated = un && S.any3d && !S.mobileOpera && this.options.zoomAnimation, this._zoomAnimated && (this._createAnimProxy(), j(this._proxy, Jt, this._catchTransitionEnd, this)), this._addLayers(this.options.layers);
        },
        // @section Methods for modifying map state
        // @method setView(center: LatLng, zoom: Number, options?: Zoom/pan options): this
        // Sets the view of the map (geographical center and zoom) with the given
        // animation options.
        setView: function(e, t, n) {
          if (t = t === void 0 ? this._zoom : this._limitZoom(t), e = this._limitCenter(ie(e), t, this.options.maxBounds), n = n || {}, this._stop(), this._loaded && !n.reset && n !== !0) {
            n.animate !== void 0 && (n.zoom = I({ animate: n.animate }, n.zoom), n.pan = I({ animate: n.animate, duration: n.duration }, n.pan));
            var o = this._zoom !== t ? this._tryAnimatedZoom && this._tryAnimatedZoom(e, t, n.zoom) : this._tryAnimatedPan(e, n.pan);
            if (o)
              return clearTimeout(this._sizeTimer), this;
          }
          return this._resetView(e, t, n.pan && n.pan.noMoveStart), this;
        },
        // @method setZoom(zoom: Number, options?: Zoom/pan options): this
        // Sets the zoom of the map.
        setZoom: function(e, t) {
          return this._loaded ? this.setView(this.getCenter(), e, { zoom: t }) : (this._zoom = e, this);
        },
        // @method zoomIn(delta?: Number, options?: Zoom options): this
        // Increases the zoom of the map by `delta` ([`zoomDelta`](#map-zoomdelta) by default).
        zoomIn: function(e, t) {
          return e = e || (S.any3d ? this.options.zoomDelta : 1), this.setZoom(this._zoom + e, t);
        },
        // @method zoomOut(delta?: Number, options?: Zoom options): this
        // Decreases the zoom of the map by `delta` ([`zoomDelta`](#map-zoomdelta) by default).
        zoomOut: function(e, t) {
          return e = e || (S.any3d ? this.options.zoomDelta : 1), this.setZoom(this._zoom - e, t);
        },
        // @method setZoomAround(latlng: LatLng, zoom: Number, options: Zoom options): this
        // Zooms the map while keeping a specified geographical point on the map
        // stationary (e.g. used internally for scroll zoom and double-click zoom).
        // @alternative
        // @method setZoomAround(offset: Point, zoom: Number, options: Zoom options): this
        // Zooms the map while keeping a specified pixel on the map (relative to the top-left corner) stationary.
        setZoomAround: function(e, t, n) {
          var o = this.getZoomScale(t), s = this.getSize().divideBy(2), c = e instanceof F ? e : this.latLngToContainerPoint(e), h = c.subtract(s).multiplyBy(1 - 1 / o), p = this.containerPointToLatLng(s.add(h));
          return this.setView(p, t, { zoom: n });
        },
        _getBoundsCenterZoom: function(e, t) {
          t = t || {}, e = e.getBounds ? e.getBounds() : ne(e);
          var n = U(t.paddingTopLeft || t.padding || [0, 0]), o = U(t.paddingBottomRight || t.padding || [0, 0]), s = this.getBoundsZoom(e, !1, n.add(o));
          if (s = typeof t.maxZoom == "number" ? Math.min(t.maxZoom, s) : s, s === 1 / 0)
            return {
              center: e.getCenter(),
              zoom: s
            };
          var c = o.subtract(n).divideBy(2), h = this.project(e.getSouthWest(), s), p = this.project(e.getNorthEast(), s), f = this.unproject(h.add(p).divideBy(2).add(c), s);
          return {
            center: f,
            zoom: s
          };
        },
        // @method fitBounds(bounds: LatLngBounds, options?: fitBounds options): this
        // Sets a map view that contains the given geographical bounds with the
        // maximum zoom level possible.
        fitBounds: function(e, t) {
          if (e = ne(e), !e.isValid())
            throw new Error("Bounds are not valid.");
          var n = this._getBoundsCenterZoom(e, t);
          return this.setView(n.center, n.zoom, t);
        },
        // @method fitWorld(options?: fitBounds options): this
        // Sets a map view that mostly contains the whole world with the maximum
        // zoom level possible.
        fitWorld: function(e) {
          return this.fitBounds([[-90, -180], [90, 180]], e);
        },
        // @method panTo(latlng: LatLng, options?: Pan options): this
        // Pans the map to a given center.
        panTo: function(e, t) {
          return this.setView(e, this._zoom, { pan: t });
        },
        // @method panBy(offset: Point, options?: Pan options): this
        // Pans the map by a given number of pixels (animated).
        panBy: function(e, t) {
          if (e = U(e).round(), t = t || {}, !e.x && !e.y)
            return this.fire("moveend");
          if (t.animate !== !0 && !this.getSize().contains(e))
            return this._resetView(this.unproject(this.project(this.getCenter()).add(e)), this.getZoom()), this;
          if (this._panAnim || (this._panAnim = new Qt(), this._panAnim.on({
            step: this._onPanTransitionStep,
            end: this._onPanTransitionEnd
          }, this)), t.noMoveStart || this.fire("movestart"), t.animate !== !1) {
            G(this._mapPane, "leaflet-pan-anim");
            var n = this._getMapPanePos().subtract(e).round();
            this._panAnim.run(this._mapPane, n, t.duration || 0.25, t.easeLinearity);
          } else
            this._rawPanBy(e), this.fire("move").fire("moveend");
          return this;
        },
        // @method flyTo(latlng: LatLng, zoom?: Number, options?: Zoom/pan options): this
        // Sets the view of the map (geographical center and zoom) performing a smooth
        // pan-zoom animation.
        flyTo: function(e, t, n) {
          if (n = n || {}, n.animate === !1 || !S.any3d)
            return this.setView(e, t, n);
          this._stop();
          var o = this.project(this.getCenter()), s = this.project(e), c = this.getSize(), h = this._zoom;
          e = ie(e), t = t === void 0 ? h : t;
          var p = Math.max(c.x, c.y), f = p * this.getZoomScale(h, t), k = s.distanceTo(o) || 1, z = 1.42, V = z * z;
          function te(Ze) {
            var qi = Ze ? -1 : 1, Pa = Ze ? f : p, La = f * f - p * p + qi * V * V * k * k, Ta = 2 * Pa * V * k, go = La / Ta, $o = Math.sqrt(go * go + 1) - go, Sa = $o < 1e-9 ? -18 : Math.log($o);
            return Sa;
          }
          function Ke(Ze) {
            return (Math.exp(Ze) - Math.exp(-Ze)) / 2;
          }
          function Ue(Ze) {
            return (Math.exp(Ze) + Math.exp(-Ze)) / 2;
          }
          function gt(Ze) {
            return Ke(Ze) / Ue(Ze);
          }
          var et = te(0);
          function Wn(Ze) {
            return p * (Ue(et) / Ue(et + z * Ze));
          }
          function ba(Ze) {
            return p * (Ue(et) * gt(et + z * Ze) - Ke(et)) / V;
          }
          function wa(Ze) {
            return 1 - Math.pow(1 - Ze, 1.5);
          }
          var xa = Date.now(), Ro = (te(1) - et) / z, ka = n.duration ? 1e3 * n.duration : 1e3 * Ro * 0.8;
          function Vo() {
            var Ze = (Date.now() - xa) / ka, qi = wa(Ze) * Ro;
            Ze <= 1 ? (this._flyToFrame = Te(Vo, this), this._move(
              this.unproject(o.add(s.subtract(o).multiplyBy(ba(qi) / k)), h),
              this.getScaleZoom(p / Wn(qi), h),
              { flyTo: !0 }
            )) : this._move(e, t)._moveEnd(!0);
          }
          return this._moveStart(!0, n.noMoveStart), Vo.call(this), this;
        },
        // @method flyToBounds(bounds: LatLngBounds, options?: fitBounds options): this
        // Sets the view of the map with a smooth animation like [`flyTo`](#map-flyto),
        // but takes a bounds parameter like [`fitBounds`](#map-fitbounds).
        flyToBounds: function(e, t) {
          var n = this._getBoundsCenterZoom(e, t);
          return this.flyTo(n.center, n.zoom, t);
        },
        // @method setMaxBounds(bounds: LatLngBounds): this
        // Restricts the map view to the given bounds (see the [maxBounds](#map-maxbounds) option).
        setMaxBounds: function(e) {
          return e = ne(e), this.listens("moveend", this._panInsideMaxBounds) && this.off("moveend", this._panInsideMaxBounds), e.isValid() ? (this.options.maxBounds = e, this._loaded && this._panInsideMaxBounds(), this.on("moveend", this._panInsideMaxBounds)) : (this.options.maxBounds = null, this);
        },
        // @method setMinZoom(zoom: Number): this
        // Sets the lower limit for the available zoom levels (see the [minZoom](#map-minzoom) option).
        setMinZoom: function(e) {
          var t = this.options.minZoom;
          return this.options.minZoom = e, this._loaded && t !== e && (this.fire("zoomlevelschange"), this.getZoom() < this.options.minZoom) ? this.setZoom(e) : this;
        },
        // @method setMaxZoom(zoom: Number): this
        // Sets the upper limit for the available zoom levels (see the [maxZoom](#map-maxzoom) option).
        setMaxZoom: function(e) {
          var t = this.options.maxZoom;
          return this.options.maxZoom = e, this._loaded && t !== e && (this.fire("zoomlevelschange"), this.getZoom() > this.options.maxZoom) ? this.setZoom(e) : this;
        },
        // @method panInsideBounds(bounds: LatLngBounds, options?: Pan options): this
        // Pans the map to the closest view that would lie inside the given bounds (if it's not already), controlling the animation using the options specific, if any.
        panInsideBounds: function(e, t) {
          this._enforcingBounds = !0;
          var n = this.getCenter(), o = this._limitCenter(n, this._zoom, ne(e));
          return n.equals(o) || this.panTo(o, t), this._enforcingBounds = !1, this;
        },
        // @method panInside(latlng: LatLng, options?: padding options): this
        // Pans the map the minimum amount to make the `latlng` visible. Use
        // padding options to fit the display to more restricted bounds.
        // If `latlng` is already within the (optionally padded) display bounds,
        // the map will not be panned.
        panInside: function(e, t) {
          t = t || {};
          var n = U(t.paddingTopLeft || t.padding || [0, 0]), o = U(t.paddingBottomRight || t.padding || [0, 0]), s = this.project(this.getCenter()), c = this.project(e), h = this.getPixelBounds(), p = T([h.min.add(n), h.max.subtract(o)]), f = p.getSize();
          if (!p.contains(c)) {
            this._enforcingBounds = !0;
            var k = c.subtract(p.getCenter()), z = p.extend(c).getSize().subtract(f);
            s.x += k.x < 0 ? -z.x : z.x, s.y += k.y < 0 ? -z.y : z.y, this.panTo(this.unproject(s), t), this._enforcingBounds = !1;
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
        invalidateSize: function(e) {
          if (!this._loaded)
            return this;
          e = I({
            animate: !1,
            pan: !0
          }, e === !0 ? { animate: !0 } : e);
          var t = this.getSize();
          this._sizeChanged = !0, this._lastCenter = null;
          var n = this.getSize(), o = t.divideBy(2).round(), s = n.divideBy(2).round(), c = o.subtract(s);
          return !c.x && !c.y ? this : (e.animate && e.pan ? this.panBy(c) : (e.pan && this._rawPanBy(c), this.fire("move"), e.debounceMoveend ? (clearTimeout(this._sizeTimer), this._sizeTimer = setTimeout(Z(this.fire, this, "moveend"), 200)) : this.fire("moveend")), this.fire("resize", {
            oldSize: t,
            newSize: n
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
        locate: function(e) {
          if (e = this._locateOptions = I({
            timeout: 1e4,
            watch: !1
            // setView: false
            // maxZoom: <Number>
            // maximumAge: 0
            // enableHighAccuracy: false
          }, e), !("geolocation" in navigator))
            return this._handleGeolocationError({
              code: 0,
              message: "Geolocation not supported."
            }), this;
          var t = Z(this._handleGeolocationResponse, this), n = Z(this._handleGeolocationError, this);
          return e.watch ? this._locationWatchId = navigator.geolocation.watchPosition(t, n, e) : navigator.geolocation.getCurrentPosition(t, n, e), this;
        },
        // @method stopLocate(): this
        // Stops watching location previously initiated by `map.locate({watch: true})`
        // and aborts resetting the map view if map.locate was called with
        // `{setView: true}`.
        stopLocate: function() {
          return navigator.geolocation && navigator.geolocation.clearWatch && navigator.geolocation.clearWatch(this._locationWatchId), this._locateOptions && (this._locateOptions.setView = !1), this;
        },
        _handleGeolocationError: function(e) {
          if (this._container._leaflet_id) {
            var t = e.code, n = e.message || (t === 1 ? "permission denied" : t === 2 ? "position unavailable" : "timeout");
            this._locateOptions.setView && !this._loaded && this.fitWorld(), this.fire("locationerror", {
              code: t,
              message: "Geolocation error: " + n + "."
            });
          }
        },
        _handleGeolocationResponse: function(e) {
          if (this._container._leaflet_id) {
            var t = e.coords.latitude, n = e.coords.longitude, o = new X(t, n), s = o.toBounds(e.coords.accuracy * 2), c = this._locateOptions;
            if (c.setView) {
              var h = this.getBoundsZoom(s);
              this.setView(o, c.maxZoom ? Math.min(h, c.maxZoom) : h);
            }
            var p = {
              latlng: o,
              bounds: s,
              timestamp: e.timestamp
            };
            for (var f in e.coords)
              typeof e.coords[f] == "number" && (p[f] = e.coords[f]);
            this.fire("locationfound", p);
          }
        },
        // TODO Appropriate docs section?
        // @section Other Methods
        // @method addHandler(name: String, HandlerClass: Function): this
        // Adds a new `Handler` to the map, given its name and constructor function.
        addHandler: function(e, t) {
          if (!t)
            return this;
          var n = this[e] = new t(this);
          return this._handlers.push(n), this.options[e] && n.enable(), this;
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
          this._locationWatchId !== void 0 && this.stopLocate(), this._stop(), fe(this._mapPane), this._clearControlPos && this._clearControlPos(), this._resizeRequest && (Se(this._resizeRequest), this._resizeRequest = null), this._clearHandlers(), this._loaded && this.fire("unload");
          var e;
          for (e in this._layers)
            this._layers[e].remove();
          for (e in this._panes)
            fe(this._panes[e]);
          return this._layers = [], this._panes = [], delete this._mapPane, delete this._renderer, this;
        },
        // @section Other Methods
        // @method createPane(name: String, container?: HTMLElement): HTMLElement
        // Creates a new [map pane](#map-pane) with the given name if it doesn't exist already,
        // then returns it. The pane is created as a child of `container`, or
        // as a child of the main map pane if not set.
        createPane: function(e, t) {
          var n = "leaflet-pane" + (e ? " leaflet-" + e.replace("Pane", "") + "-pane" : ""), o = Q("div", n, t || this._mapPane);
          return e && (this._panes[e] = o), o;
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
          var e = this.getPixelBounds(), t = this.unproject(e.getBottomLeft()), n = this.unproject(e.getTopRight());
          return new b(t, n);
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
        getBoundsZoom: function(e, t, n) {
          e = ne(e), n = U(n || [0, 0]);
          var o = this.getZoom() || 0, s = this.getMinZoom(), c = this.getMaxZoom(), h = e.getNorthWest(), p = e.getSouthEast(), f = this.getSize().subtract(n), k = T(this.project(p, o), this.project(h, o)).getSize(), z = S.any3d ? this.options.zoomSnap : 1, V = f.x / k.x, te = f.y / k.y, Ke = t ? Math.max(V, te) : Math.min(V, te);
          return o = this.getScaleZoom(Ke, o), z && (o = Math.round(o / (z / 100)) * (z / 100), o = t ? Math.ceil(o / z) * z : Math.floor(o / z) * z), Math.max(s, Math.min(c, o));
        },
        // @method getSize(): Point
        // Returns the current size of the map container (in pixels).
        getSize: function() {
          return (!this._size || this._sizeChanged) && (this._size = new F(
            this._container.clientWidth || 0,
            this._container.clientHeight || 0
          ), this._sizeChanged = !1), this._size.clone();
        },
        // @method getPixelBounds(): Bounds
        // Returns the bounds of the current map view in projected pixel
        // coordinates (sometimes useful in layer and overlay implementations).
        getPixelBounds: function(e, t) {
          var n = this._getTopLeftPoint(e, t);
          return new y(n, n.add(this.getSize()));
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
        getPixelWorldBounds: function(e) {
          return this.options.crs.getProjectedBounds(e === void 0 ? this.getZoom() : e);
        },
        // @section Other Methods
        // @method getPane(pane: String|HTMLElement): HTMLElement
        // Returns a [map pane](#map-pane), given its name or its HTML element (its identity).
        getPane: function(e) {
          return typeof e == "string" ? this._panes[e] : e;
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
        getZoomScale: function(e, t) {
          var n = this.options.crs;
          return t = t === void 0 ? this._zoom : t, n.scale(e) / n.scale(t);
        },
        // @method getScaleZoom(scale: Number, fromZoom: Number): Number
        // Returns the zoom level that the map would end up at, if it is at `fromZoom`
        // level and everything is scaled by a factor of `scale`. Inverse of
        // [`getZoomScale`](#map-getZoomScale).
        getScaleZoom: function(e, t) {
          var n = this.options.crs;
          t = t === void 0 ? this._zoom : t;
          var o = n.zoom(e * n.scale(t));
          return isNaN(o) ? 1 / 0 : o;
        },
        // @method project(latlng: LatLng, zoom: Number): Point
        // Projects a geographical coordinate `LatLng` according to the projection
        // of the map's CRS, then scales it according to `zoom` and the CRS's
        // `Transformation`. The result is pixel coordinate relative to
        // the CRS origin.
        project: function(e, t) {
          return t = t === void 0 ? this._zoom : t, this.options.crs.latLngToPoint(ie(e), t);
        },
        // @method unproject(point: Point, zoom: Number): LatLng
        // Inverse of [`project`](#map-project).
        unproject: function(e, t) {
          return t = t === void 0 ? this._zoom : t, this.options.crs.pointToLatLng(U(e), t);
        },
        // @method layerPointToLatLng(point: Point): LatLng
        // Given a pixel coordinate relative to the [origin pixel](#map-getpixelorigin),
        // returns the corresponding geographical coordinate (for the current zoom level).
        layerPointToLatLng: function(e) {
          var t = U(e).add(this.getPixelOrigin());
          return this.unproject(t);
        },
        // @method latLngToLayerPoint(latlng: LatLng): Point
        // Given a geographical coordinate, returns the corresponding pixel coordinate
        // relative to the [origin pixel](#map-getpixelorigin).
        latLngToLayerPoint: function(e) {
          var t = this.project(ie(e))._round();
          return t._subtract(this.getPixelOrigin());
        },
        // @method wrapLatLng(latlng: LatLng): LatLng
        // Returns a `LatLng` where `lat` and `lng` has been wrapped according to the
        // map's CRS's `wrapLat` and `wrapLng` properties, if they are outside the
        // CRS's bounds.
        // By default this means longitude is wrapped around the dateline so its
        // value is between -180 and +180 degrees.
        wrapLatLng: function(e) {
          return this.options.crs.wrapLatLng(ie(e));
        },
        // @method wrapLatLngBounds(bounds: LatLngBounds): LatLngBounds
        // Returns a `LatLngBounds` with the same size as the given one, ensuring that
        // its center is within the CRS's bounds.
        // By default this means the center longitude is wrapped around the dateline so its
        // value is between -180 and +180 degrees, and the majority of the bounds
        // overlaps the CRS's bounds.
        wrapLatLngBounds: function(e) {
          return this.options.crs.wrapLatLngBounds(ne(e));
        },
        // @method distance(latlng1: LatLng, latlng2: LatLng): Number
        // Returns the distance between two geographical coordinates according to
        // the map's CRS. By default this measures distance in meters.
        distance: function(e, t) {
          return this.options.crs.distance(ie(e), ie(t));
        },
        // @method containerPointToLayerPoint(point: Point): Point
        // Given a pixel coordinate relative to the map container, returns the corresponding
        // pixel coordinate relative to the [origin pixel](#map-getpixelorigin).
        containerPointToLayerPoint: function(e) {
          return U(e).subtract(this._getMapPanePos());
        },
        // @method layerPointToContainerPoint(point: Point): Point
        // Given a pixel coordinate relative to the [origin pixel](#map-getpixelorigin),
        // returns the corresponding pixel coordinate relative to the map container.
        layerPointToContainerPoint: function(e) {
          return U(e).add(this._getMapPanePos());
        },
        // @method containerPointToLatLng(point: Point): LatLng
        // Given a pixel coordinate relative to the map container, returns
        // the corresponding geographical coordinate (for the current zoom level).
        containerPointToLatLng: function(e) {
          var t = this.containerPointToLayerPoint(U(e));
          return this.layerPointToLatLng(t);
        },
        // @method latLngToContainerPoint(latlng: LatLng): Point
        // Given a geographical coordinate, returns the corresponding pixel coordinate
        // relative to the map container.
        latLngToContainerPoint: function(e) {
          return this.layerPointToContainerPoint(this.latLngToLayerPoint(ie(e)));
        },
        // @method mouseEventToContainerPoint(ev: MouseEvent): Point
        // Given a MouseEvent object, returns the pixel coordinate relative to the
        // map container where the event took place.
        mouseEventToContainerPoint: function(e) {
          return mn(e, this._container);
        },
        // @method mouseEventToLayerPoint(ev: MouseEvent): Point
        // Given a MouseEvent object, returns the pixel coordinate relative to
        // the [origin pixel](#map-getpixelorigin) where the event took place.
        mouseEventToLayerPoint: function(e) {
          return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(e));
        },
        // @method mouseEventToLatLng(ev: MouseEvent): LatLng
        // Given a MouseEvent object, returns geographical coordinate where the
        // event took place.
        mouseEventToLatLng: function(e) {
          return this.layerPointToLatLng(this.mouseEventToLayerPoint(e));
        },
        // map initialization methods
        _initContainer: function(e) {
          var t = this._container = Xt(e);
          if (t) {
            if (t._leaflet_id)
              throw new Error("Map container is already initialized.");
          } else throw new Error("Map container not found.");
          j(t, "scroll", this._onScroll, this), this._containerId = K(t);
        },
        _initLayout: function() {
          var e = this._container;
          this._fadeAnimated = this.options.fadeAnimation && S.any3d, G(e, "leaflet-container" + (S.touch ? " leaflet-touch" : "") + (S.retina ? " leaflet-retina" : "") + (S.ielt9 ? " leaflet-oldie" : "") + (S.safari ? " leaflet-safari" : "") + (this._fadeAnimated ? " leaflet-fade-anim" : ""));
          var t = bt(e, "position");
          t !== "absolute" && t !== "relative" && t !== "fixed" && t !== "sticky" && (e.style.position = "relative"), this._initPanes(), this._initControlPos && this._initControlPos();
        },
        _initPanes: function() {
          var e = this._panes = {};
          this._paneRenderers = {}, this._mapPane = this.createPane("mapPane", this._container), Ce(this._mapPane, new F(0, 0)), this.createPane("tilePane"), this.createPane("overlayPane"), this.createPane("shadowPane"), this.createPane("markerPane"), this.createPane("tooltipPane"), this.createPane("popupPane"), this.options.markerZoomAnimation || (G(e.markerPane, "leaflet-zoom-hide"), G(e.shadowPane, "leaflet-zoom-hide"));
        },
        // private methods that modify map state
        // @section Map state change events
        _resetView: function(e, t, n) {
          Ce(this._mapPane, new F(0, 0));
          var o = !this._loaded;
          this._loaded = !0, t = this._limitZoom(t), this.fire("viewprereset");
          var s = this._zoom !== t;
          this._moveStart(s, n)._move(e, t)._moveEnd(s), this.fire("viewreset"), o && this.fire("load");
        },
        _moveStart: function(e, t) {
          return e && this.fire("zoomstart"), t || this.fire("movestart"), this;
        },
        _move: function(e, t, n, o) {
          t === void 0 && (t = this._zoom);
          var s = this._zoom !== t;
          return this._zoom = t, this._lastCenter = e, this._pixelOrigin = this._getNewPixelOrigin(e), o ? n && n.pinch && this.fire("zoom", n) : ((s || n && n.pinch) && this.fire("zoom", n), this.fire("move", n)), this;
        },
        _moveEnd: function(e) {
          return e && this.fire("zoomend"), this.fire("moveend");
        },
        _stop: function() {
          return Se(this._flyToFrame), this._panAnim && this._panAnim.stop(), this;
        },
        _rawPanBy: function(e) {
          Ce(this._mapPane, this._getMapPanePos().subtract(e));
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
        _initEvents: function(e) {
          this._targets = {}, this._targets[K(this._container)] = this;
          var t = e ? Y : j;
          t(this._container, "click dblclick mousedown mouseup mouseover mouseout mousemove contextmenu keypress keydown keyup", this._handleDOMEvent, this), this.options.trackResize && t(window, "resize", this._onResize, this), S.any3d && this.options.transform3DLimit && (e ? this.off : this.on).call(this, "moveend", this._onMoveEnd);
        },
        _onResize: function() {
          Se(this._resizeRequest), this._resizeRequest = Te(
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
          var e = this._getMapPanePos();
          Math.max(Math.abs(e.x), Math.abs(e.y)) >= this.options.transform3DLimit && this._resetView(this.getCenter(), this.getZoom());
        },
        _findEventTargets: function(e, t) {
          for (var n = [], o, s = t === "mouseout" || t === "mouseover", c = e.target || e.srcElement, h = !1; c; ) {
            if (o = this._targets[K(c)], o && (t === "click" || t === "preclick") && this._draggableMoved(o)) {
              h = !0;
              break;
            }
            if (o && o.listens(t, !0) && (s && !ye(c, e) || (n.push(o), s)) || c === this._container)
              break;
            c = c.parentNode;
          }
          return !n.length && !h && !s && this.listens(t, !0) && (n = [this]), n;
        },
        _isClickDisabled: function(e) {
          for (; e && e !== this._container; ) {
            if (e._leaflet_disable_click)
              return !0;
            e = e.parentNode;
          }
        },
        _handleDOMEvent: function(e) {
          var t = e.target || e.srcElement;
          if (!(!this._loaded || t._leaflet_disable_events || e.type === "click" && this._isClickDisabled(t))) {
            var n = e.type;
            n === "mousedown" && Ot(t), this._fireDOMEvent(e, n);
          }
        },
        _mouseEvents: ["click", "dblclick", "mouseover", "mouseout", "contextmenu"],
        _fireDOMEvent: function(e, t, n) {
          if (e.type === "click") {
            var o = I({}, e);
            o.type = "preclick", this._fireDOMEvent(o, o.type, n);
          }
          var s = this._findEventTargets(e, t);
          if (n) {
            for (var c = [], h = 0; h < n.length; h++)
              n[h].listens(t, !0) && c.push(n[h]);
            s = c.concat(s);
          }
          if (s.length) {
            t === "contextmenu" && ve(e);
            var p = s[0], f = {
              originalEvent: e
            };
            if (e.type !== "keypress" && e.type !== "keydown" && e.type !== "keyup") {
              var k = p.getLatLng && (!p._radius || p._radius <= 10);
              f.containerPoint = k ? this.latLngToContainerPoint(p.getLatLng()) : this.mouseEventToContainerPoint(e), f.layerPoint = this.containerPointToLayerPoint(f.containerPoint), f.latlng = k ? p.getLatLng() : this.layerPointToLatLng(f.layerPoint);
            }
            for (h = 0; h < s.length; h++)
              if (s[h].fire(t, f, !0), f.originalEvent._stopped || s[h].options.bubblingMouseEvents === !1 && Ae(this._mouseEvents, t) !== -1)
                return;
          }
        },
        _draggableMoved: function(e) {
          return e = e.dragging && e.dragging.enabled() ? e : this, e.dragging && e.dragging.moved() || this.boxZoom && this.boxZoom.moved();
        },
        _clearHandlers: function() {
          for (var e = 0, t = this._handlers.length; e < t; e++)
            this._handlers[e].disable();
        },
        // @section Other Methods
        // @method whenReady(fn: Function, context?: Object): this
        // Runs the given function `fn` when the map gets initialized with
        // a view (center and zoom) and at least one layer, or immediately
        // if it's already initialized, optionally passing a function context.
        whenReady: function(e, t) {
          return this._loaded ? e.call(t || this, { target: this }) : this.on("load", e, t), this;
        },
        // private methods for getting map state
        _getMapPanePos: function() {
          return Me(this._mapPane) || new F(0, 0);
        },
        _moved: function() {
          var e = this._getMapPanePos();
          return e && !e.equals([0, 0]);
        },
        _getTopLeftPoint: function(e, t) {
          var n = e && t !== void 0 ? this._getNewPixelOrigin(e, t) : this.getPixelOrigin();
          return n.subtract(this._getMapPanePos());
        },
        _getNewPixelOrigin: function(e, t) {
          var n = this.getSize()._divideBy(2);
          return this.project(e, t)._subtract(n)._add(this._getMapPanePos())._round();
        },
        _latLngToNewLayerPoint: function(e, t, n) {
          var o = this._getNewPixelOrigin(n, t);
          return this.project(e, t)._subtract(o);
        },
        _latLngBoundsToNewLayerBounds: function(e, t, n) {
          var o = this._getNewPixelOrigin(n, t);
          return T([
            this.project(e.getSouthWest(), t)._subtract(o),
            this.project(e.getNorthWest(), t)._subtract(o),
            this.project(e.getSouthEast(), t)._subtract(o),
            this.project(e.getNorthEast(), t)._subtract(o)
          ]);
        },
        // layer point of the current center
        _getCenterLayerPoint: function() {
          return this.containerPointToLayerPoint(this.getSize()._divideBy(2));
        },
        // offset of the specified place to the current center in pixels
        _getCenterOffset: function(e) {
          return this.latLngToLayerPoint(e).subtract(this._getCenterLayerPoint());
        },
        // adjust center for view to get inside bounds
        _limitCenter: function(e, t, n) {
          if (!n)
            return e;
          var o = this.project(e, t), s = this.getSize().divideBy(2), c = new y(o.subtract(s), o.add(s)), h = this._getBoundsOffset(c, n, t);
          return Math.abs(h.x) <= 1 && Math.abs(h.y) <= 1 ? e : this.unproject(o.add(h), t);
        },
        // adjust offset for view to get inside bounds
        _limitOffset: function(e, t) {
          if (!t)
            return e;
          var n = this.getPixelBounds(), o = new y(n.min.add(e), n.max.add(e));
          return e.add(this._getBoundsOffset(o, t));
        },
        // returns offset needed for pxBounds to get inside maxBounds at a specified zoom
        _getBoundsOffset: function(e, t, n) {
          var o = T(
            this.project(t.getNorthEast(), n),
            this.project(t.getSouthWest(), n)
          ), s = o.min.subtract(e.min), c = o.max.subtract(e.max), h = this._rebound(s.x, -c.x), p = this._rebound(s.y, -c.y);
          return new F(h, p);
        },
        _rebound: function(e, t) {
          return e + t > 0 ? Math.round(e - t) / 2 : Math.max(0, Math.ceil(e)) - Math.max(0, Math.floor(t));
        },
        _limitZoom: function(e) {
          var t = this.getMinZoom(), n = this.getMaxZoom(), o = S.any3d ? this.options.zoomSnap : 1;
          return o && (e = Math.round(e / o) * o), Math.max(t, Math.min(n, e));
        },
        _onPanTransitionStep: function() {
          this.fire("move");
        },
        _onPanTransitionEnd: function() {
          ke(this._mapPane, "leaflet-pan-anim"), this.fire("moveend");
        },
        _tryAnimatedPan: function(e, t) {
          var n = this._getCenterOffset(e)._trunc();
          return (t && t.animate) !== !0 && !this.getSize().contains(n) ? !1 : (this.panBy(n, t), !0);
        },
        _createAnimProxy: function() {
          var e = this._proxy = Q("div", "leaflet-proxy leaflet-zoom-animated");
          this._panes.mapPane.appendChild(e), this.on("zoomanim", function(t) {
            var n = Zt, o = this._proxy.style[n];
            zt(this._proxy, this.project(t.center, t.zoom), this.getZoomScale(t.zoom, 1)), o === this._proxy.style[n] && this._animatingZoom && this._onZoomTransitionEnd();
          }, this), this.on("load moveend", this._animMoveEnd, this), this._on("unload", this._destroyAnimProxy, this);
        },
        _destroyAnimProxy: function() {
          fe(this._proxy), this.off("load moveend", this._animMoveEnd, this), delete this._proxy;
        },
        _animMoveEnd: function() {
          var e = this.getCenter(), t = this.getZoom();
          zt(this._proxy, this.project(e, t), this.getZoomScale(t, 1));
        },
        _catchTransitionEnd: function(e) {
          this._animatingZoom && e.propertyName.indexOf("transform") >= 0 && this._onZoomTransitionEnd();
        },
        _nothingToAnimate: function() {
          return !this._container.getElementsByClassName("leaflet-zoom-animated").length;
        },
        _tryAnimatedZoom: function(e, t, n) {
          if (this._animatingZoom)
            return !0;
          if (n = n || {}, !this._zoomAnimated || n.animate === !1 || this._nothingToAnimate() || Math.abs(t - this._zoom) > this.options.zoomAnimationThreshold)
            return !1;
          var o = this.getZoomScale(t), s = this._getCenterOffset(e)._divideBy(1 - 1 / o);
          return n.animate !== !0 && !this.getSize().contains(s) ? !1 : (Te(function() {
            this._moveStart(!0, n.noMoveStart || !1)._animateZoom(e, t, !0);
          }, this), !0);
        },
        _animateZoom: function(e, t, n, o) {
          this._mapPane && (n && (this._animatingZoom = !0, this._animateToCenter = e, this._animateToZoom = t, G(this._mapPane, "leaflet-zoom-anim")), this.fire("zoomanim", {
            center: e,
            zoom: t,
            noUpdate: o
          }), this._tempFireZoomEvent || (this._tempFireZoomEvent = this._zoom !== this._animateToZoom), this._move(this._animateToCenter, this._animateToZoom, void 0, !0), setTimeout(Z(this._onZoomTransitionEnd, this), 250));
        },
        _onZoomTransitionEnd: function() {
          this._animatingZoom && (this._mapPane && ke(this._mapPane, "leaflet-zoom-anim"), this._animatingZoom = !1, this._move(this._animateToCenter, this._animateToZoom, void 0, !0), this._tempFireZoomEvent && this.fire("zoom"), delete this._tempFireZoomEvent, this.fire("move"), this._moveEnd(!0));
        }
      });
      function uo(e, t) {
        return new oe(e, t);
      }
      var lt = nt.extend({
        // @section
        // @aka Control Options
        options: {
          // @option position: String = 'topright'
          // The position of the control (one of the map corners). Possible values are `'topleft'`,
          // `'topright'`, `'bottomleft'` or `'bottomright'`
          position: "topright"
        },
        initialize: function(e) {
          de(this, e);
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
        setPosition: function(e) {
          var t = this._map;
          return t && t.removeControl(this), this.options.position = e, t && t.addControl(this), this;
        },
        // @method getContainer: HTMLElement
        // Returns the HTMLElement that contains the control.
        getContainer: function() {
          return this._container;
        },
        // @method addTo(map: Map): this
        // Adds the control to the given map.
        addTo: function(e) {
          this.remove(), this._map = e;
          var t = this._container = this.onAdd(e), n = this.getPosition(), o = e._controlCorners[n];
          return G(t, "leaflet-control"), n.indexOf("bottom") !== -1 ? o.insertBefore(t, o.firstChild) : o.appendChild(t), this._map.on("unload", this.remove, this), this;
        },
        // @method remove: this
        // Removes the control from the map it is currently active on.
        remove: function() {
          return this._map ? (fe(this._container), this.onRemove && this.onRemove(this._map), this._map.off("unload", this.remove, this), this._map = null, this) : this;
        },
        _refocusOnMap: function(e) {
          this._map && e && e.screenX > 0 && e.screenY > 0 && this._map.getContainer().focus();
        }
      }), vn = function(e) {
        return new lt(e);
      };
      oe.include({
        // @method addControl(control: Control): this
        // Adds the given control to the map
        addControl: function(e) {
          return e.addTo(this), this;
        },
        // @method removeControl(control: Control): this
        // Removes the given control from the map
        removeControl: function(e) {
          return e.remove(), this;
        },
        _initControlPos: function() {
          var e = this._controlCorners = {}, t = "leaflet-", n = this._controlContainer = Q("div", t + "control-container", this._container);
          function o(s, c) {
            var h = t + s + " " + t + c;
            e[s + c] = Q("div", h, n);
          }
          o("top", "left"), o("top", "right"), o("bottom", "left"), o("bottom", "right");
        },
        _clearControlPos: function() {
          for (var e in this._controlCorners)
            fe(this._controlCorners[e]);
          fe(this._controlContainer), delete this._controlCorners, delete this._controlContainer;
        }
      });
      var Oi = lt.extend({
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
          sortFunction: function(e, t, n, o) {
            return n < o ? -1 : o < n ? 1 : 0;
          }
        },
        initialize: function(e, t, n) {
          de(this, n), this._layerControlInputs = [], this._layers = [], this._lastZIndex = 0, this._handlingClick = !1, this._preventClick = !1;
          for (var o in e)
            this._addLayer(e[o], o);
          for (o in t)
            this._addLayer(t[o], o, !0);
        },
        onAdd: function(e) {
          this._initLayout(), this._update(), this._map = e, e.on("zoomend", this._checkDisabledLayers, this);
          for (var t = 0; t < this._layers.length; t++)
            this._layers[t].layer.on("add remove", this._onLayerChange, this);
          return this._container;
        },
        addTo: function(e) {
          return lt.prototype.addTo.call(this, e), this._expandIfNotCollapsed();
        },
        onRemove: function() {
          this._map.off("zoomend", this._checkDisabledLayers, this);
          for (var e = 0; e < this._layers.length; e++)
            this._layers[e].layer.off("add remove", this._onLayerChange, this);
        },
        // @method addBaseLayer(layer: Layer, name: String): this
        // Adds a base layer (radio button entry) with the given name to the control.
        addBaseLayer: function(e, t) {
          return this._addLayer(e, t), this._map ? this._update() : this;
        },
        // @method addOverlay(layer: Layer, name: String): this
        // Adds an overlay (checkbox entry) with the given name to the control.
        addOverlay: function(e, t) {
          return this._addLayer(e, t, !0), this._map ? this._update() : this;
        },
        // @method removeLayer(layer: Layer): this
        // Remove the given layer from the control.
        removeLayer: function(e) {
          e.off("add remove", this._onLayerChange, this);
          var t = this._getLayer(K(e));
          return t && this._layers.splice(this._layers.indexOf(t), 1), this._map ? this._update() : this;
        },
        // @method expand(): this
        // Expand the control container if collapsed.
        expand: function() {
          G(this._container, "leaflet-control-layers-expanded"), this._section.style.height = null;
          var e = this._map.getSize().y - (this._container.offsetTop + 50);
          return e < this._section.clientHeight ? (G(this._section, "leaflet-control-layers-scrollbar"), this._section.style.height = e + "px") : ke(this._section, "leaflet-control-layers-scrollbar"), this._checkDisabledLayers(), this;
        },
        // @method collapse(): this
        // Collapse the control container if expanded.
        collapse: function() {
          return ke(this._container, "leaflet-control-layers-expanded"), this;
        },
        _initLayout: function() {
          var e = "leaflet-control-layers", t = this._container = Q("div", e), n = this.options.collapsed;
          t.setAttribute("aria-haspopup", !0), pn(t), hn(t);
          var o = this._section = Q("section", e + "-list");
          n && (this._map.on("click", this.collapse, this), j(t, {
            mouseenter: this._expandSafely,
            mouseleave: this.collapse
          }, this));
          var s = this._layersLink = Q("a", e + "-toggle", t);
          s.href = "#", s.title = "Layers", s.setAttribute("role", "button"), j(s, {
            keydown: function(c) {
              c.keyCode === 13 && this._expandSafely();
            },
            // Certain screen readers intercept the key event and instead send a click event
            click: function(c) {
              ve(c), this._expandSafely();
            }
          }, this), n || this.expand(), this._baseLayersList = Q("div", e + "-base", o), this._separator = Q("div", e + "-separator", o), this._overlaysList = Q("div", e + "-overlays", o), t.appendChild(o);
        },
        _getLayer: function(e) {
          for (var t = 0; t < this._layers.length; t++)
            if (this._layers[t] && K(this._layers[t].layer) === e)
              return this._layers[t];
        },
        _addLayer: function(e, t, n) {
          this._map && e.on("add remove", this._onLayerChange, this), this._layers.push({
            layer: e,
            name: t,
            overlay: n
          }), this.options.sortLayers && this._layers.sort(Z(function(o, s) {
            return this.options.sortFunction(o.layer, s.layer, o.name, s.name);
          }, this)), this.options.autoZIndex && e.setZIndex && (this._lastZIndex++, e.setZIndex(this._lastZIndex)), this._expandIfNotCollapsed();
        },
        _update: function() {
          if (!this._container)
            return this;
          Mt(this._baseLayersList), Mt(this._overlaysList), this._layerControlInputs = [];
          var e, t, n, o, s = 0;
          for (n = 0; n < this._layers.length; n++)
            o = this._layers[n], this._addItem(o), t = t || o.overlay, e = e || !o.overlay, s += o.overlay ? 0 : 1;
          return this.options.hideSingleBase && (e = e && s > 1, this._baseLayersList.style.display = e ? "" : "none"), this._separator.style.display = t && e ? "" : "none", this;
        },
        _onLayerChange: function(e) {
          this._handlingClick || this._update();
          var t = this._getLayer(K(e.target)), n = t.overlay ? e.type === "add" ? "overlayadd" : "overlayremove" : e.type === "add" ? "baselayerchange" : null;
          n && this._map.fire(n, t);
        },
        // IE7 bugs out if you create a radio dynamically, so you have to do it this hacky way (see https://stackoverflow.com/a/119079)
        _createRadioElement: function(e, t) {
          var n = '<input type="radio" class="leaflet-control-layers-selector" name="' + e + '"' + (t ? ' checked="checked"' : "") + "/>", o = document.createElement("div");
          return o.innerHTML = n, o.firstChild;
        },
        _addItem: function(e) {
          var t = document.createElement("label"), n = this._map.hasLayer(e.layer), o;
          e.overlay ? (o = document.createElement("input"), o.type = "checkbox", o.className = "leaflet-control-layers-selector", o.defaultChecked = n) : o = this._createRadioElement("leaflet-base-layers_" + K(this), n), this._layerControlInputs.push(o), o.layerId = K(e.layer), j(o, "click", this._onInputClick, this);
          var s = document.createElement("span");
          s.innerHTML = " " + e.name;
          var c = document.createElement("span");
          t.appendChild(c), c.appendChild(o), c.appendChild(s);
          var h = e.overlay ? this._overlaysList : this._baseLayersList;
          return h.appendChild(t), this._checkDisabledLayers(), t;
        },
        _onInputClick: function() {
          if (!this._preventClick) {
            var e = this._layerControlInputs, t, n, o = [], s = [];
            this._handlingClick = !0;
            for (var c = e.length - 1; c >= 0; c--)
              t = e[c], n = this._getLayer(t.layerId).layer, t.checked ? o.push(n) : t.checked || s.push(n);
            for (c = 0; c < s.length; c++)
              this._map.hasLayer(s[c]) && this._map.removeLayer(s[c]);
            for (c = 0; c < o.length; c++)
              this._map.hasLayer(o[c]) || this._map.addLayer(o[c]);
            this._handlingClick = !1, this._refocusOnMap();
          }
        },
        _checkDisabledLayers: function() {
          for (var e = this._layerControlInputs, t, n, o = this._map.getZoom(), s = e.length - 1; s >= 0; s--)
            t = e[s], n = this._getLayer(t.layerId).layer, t.disabled = n.options.minZoom !== void 0 && o < n.options.minZoom || n.options.maxZoom !== void 0 && o > n.options.maxZoom;
        },
        _expandIfNotCollapsed: function() {
          return this._map && !this.options.collapsed && this.expand(), this;
        },
        _expandSafely: function() {
          var e = this._section;
          this._preventClick = !0, j(e, "click", ve), this.expand();
          var t = this;
          setTimeout(function() {
            Y(e, "click", ve), t._preventClick = !1;
          });
        }
      }), co = function(e, t, n) {
        return new Oi(e, t, n);
      }, ai = lt.extend({
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
        onAdd: function(e) {
          var t = "leaflet-control-zoom", n = Q("div", t + " leaflet-bar"), o = this.options;
          return this._zoomInButton = this._createButton(
            o.zoomInText,
            o.zoomInTitle,
            t + "-in",
            n,
            this._zoomIn
          ), this._zoomOutButton = this._createButton(
            o.zoomOutText,
            o.zoomOutTitle,
            t + "-out",
            n,
            this._zoomOut
          ), this._updateDisabled(), e.on("zoomend zoomlevelschange", this._updateDisabled, this), n;
        },
        onRemove: function(e) {
          e.off("zoomend zoomlevelschange", this._updateDisabled, this);
        },
        disable: function() {
          return this._disabled = !0, this._updateDisabled(), this;
        },
        enable: function() {
          return this._disabled = !1, this._updateDisabled(), this;
        },
        _zoomIn: function(e) {
          !this._disabled && this._map._zoom < this._map.getMaxZoom() && this._map.zoomIn(this._map.options.zoomDelta * (e.shiftKey ? 3 : 1));
        },
        _zoomOut: function(e) {
          !this._disabled && this._map._zoom > this._map.getMinZoom() && this._map.zoomOut(this._map.options.zoomDelta * (e.shiftKey ? 3 : 1));
        },
        _createButton: function(e, t, n, o, s) {
          var c = Q("a", n, o);
          return c.innerHTML = e, c.href = "#", c.title = t, c.setAttribute("role", "button"), c.setAttribute("aria-label", t), pn(c), j(c, "click", kt), j(c, "click", s, this), j(c, "click", this._refocusOnMap, this), c;
        },
        _updateDisabled: function() {
          var e = this._map, t = "leaflet-disabled";
          ke(this._zoomInButton, t), ke(this._zoomOutButton, t), this._zoomInButton.setAttribute("aria-disabled", "false"), this._zoomOutButton.setAttribute("aria-disabled", "false"), (this._disabled || e._zoom === e.getMinZoom()) && (G(this._zoomOutButton, t), this._zoomOutButton.setAttribute("aria-disabled", "true")), (this._disabled || e._zoom === e.getMaxZoom()) && (G(this._zoomInButton, t), this._zoomInButton.setAttribute("aria-disabled", "true"));
        }
      });
      oe.mergeOptions({
        zoomControl: !0
      }), oe.addInitHook(function() {
        this.options.zoomControl && (this.zoomControl = new ai(), this.addControl(this.zoomControl));
      });
      var Nn = function(e) {
        return new ai(e);
      }, gn = lt.extend({
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
        onAdd: function(e) {
          var t = "leaflet-control-scale", n = Q("div", t), o = this.options;
          return this._addScales(o, t + "-line", n), e.on(o.updateWhenIdle ? "moveend" : "move", this._update, this), e.whenReady(this._update, this), n;
        },
        onRemove: function(e) {
          e.off(this.options.updateWhenIdle ? "moveend" : "move", this._update, this);
        },
        _addScales: function(e, t, n) {
          e.metric && (this._mScale = Q("div", t, n)), e.imperial && (this._iScale = Q("div", t, n));
        },
        _update: function() {
          var e = this._map, t = e.getSize().y / 2, n = e.distance(
            e.containerPointToLatLng([0, t]),
            e.containerPointToLatLng([this.options.maxWidth, t])
          );
          this._updateScales(n);
        },
        _updateScales: function(e) {
          this.options.metric && e && this._updateMetric(e), this.options.imperial && e && this._updateImperial(e);
        },
        _updateMetric: function(e) {
          var t = this._getRoundNum(e), n = t < 1e3 ? t + " m" : t / 1e3 + " km";
          this._updateScale(this._mScale, n, t / e);
        },
        _updateImperial: function(e) {
          var t = e * 3.2808399, n, o, s;
          t > 5280 ? (n = t / 5280, o = this._getRoundNum(n), this._updateScale(this._iScale, o + " mi", o / n)) : (s = this._getRoundNum(t), this._updateScale(this._iScale, s + " ft", s / t));
        },
        _updateScale: function(e, t, n) {
          e.style.width = Math.round(this.options.maxWidth * n) + "px", e.innerHTML = t;
        },
        _getRoundNum: function(e) {
          var t = Math.pow(10, (Math.floor(e) + "").length - 1), n = e / t;
          return n = n >= 10 ? 10 : n >= 5 ? 5 : n >= 3 ? 3 : n >= 2 ? 2 : 1, t * n;
        }
      }), ho = function(e) {
        return new gn(e);
      }, ce = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" class="leaflet-attribution-flag"><path fill="#4C7BE1" d="M0 0h12v4H0z"/><path fill="#FFD500" d="M0 4h12v3H0z"/><path fill="#E0BC00" d="M0 7h12v1H0z"/></svg>', yn = lt.extend({
        // @section
        // @aka Control.Attribution options
        options: {
          position: "bottomright",
          // @option prefix: String|false = 'Leaflet'
          // The HTML text shown before the attributions. Pass `false` to disable.
          prefix: '<a href="https://leafletjs.com" title="A JavaScript library for interactive maps">' + (S.inlineSvg ? ce + " " : "") + "Leaflet</a>"
        },
        initialize: function(e) {
          de(this, e), this._attributions = {};
        },
        onAdd: function(e) {
          e.attributionControl = this, this._container = Q("div", "leaflet-control-attribution"), pn(this._container);
          for (var t in e._layers)
            e._layers[t].getAttribution && this.addAttribution(e._layers[t].getAttribution());
          return this._update(), e.on("layeradd", this._addAttribution, this), this._container;
        },
        onRemove: function(e) {
          e.off("layeradd", this._addAttribution, this);
        },
        _addAttribution: function(e) {
          e.layer.getAttribution && (this.addAttribution(e.layer.getAttribution()), e.layer.once("remove", function() {
            this.removeAttribution(e.layer.getAttribution());
          }, this));
        },
        // @method setPrefix(prefix: String|false): this
        // The HTML text shown before the attributions. Pass `false` to disable.
        setPrefix: function(e) {
          return this.options.prefix = e, this._update(), this;
        },
        // @method addAttribution(text: String): this
        // Adds an attribution text (e.g. `'&copy; OpenStreetMap contributors'`).
        addAttribution: function(e) {
          return e ? (this._attributions[e] || (this._attributions[e] = 0), this._attributions[e]++, this._update(), this) : this;
        },
        // @method removeAttribution(text: String): this
        // Removes an attribution text.
        removeAttribution: function(e) {
          return e ? (this._attributions[e] && (this._attributions[e]--, this._update()), this) : this;
        },
        _update: function() {
          if (this._map) {
            var e = [];
            for (var t in this._attributions)
              this._attributions[t] && e.push(t);
            var n = [];
            this.options.prefix && n.push(this.options.prefix), e.length && n.push(e.join(", ")), this._container.innerHTML = n.join(' <span aria-hidden="true">|</span> ');
          }
        }
      });
      oe.mergeOptions({
        attributionControl: !0
      }), oe.addInitHook(function() {
        this.options.attributionControl && new yn().addTo(this);
      });
      var Ai = function(e) {
        return new yn(e);
      };
      lt.Layers = Oi, lt.Zoom = ai, lt.Scale = gn, lt.Attribution = yn, vn.layers = co, vn.zoom = Nn, vn.scale = ho, vn.attribution = Ai;
      var rt = nt.extend({
        initialize: function(e) {
          this._map = e;
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
      rt.addTo = function(e, t) {
        return e.addHandler(t, this), this;
      };
      var w = { Events: We }, bn = S.touch ? "touchstart mousedown" : "mousedown", At = Tt.extend({
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
        initialize: function(e, t, n, o) {
          de(this, o), this._element = e, this._dragStartTarget = t || e, this._preventOutline = n;
        },
        // @method enable()
        // Enables the dragging ability
        enable: function() {
          this._enabled || (j(this._dragStartTarget, bn, this._onDown, this), this._enabled = !0);
        },
        // @method disable()
        // Disables the dragging ability
        disable: function() {
          this._enabled && (At._dragging === this && this.finishDrag(!0), Y(this._dragStartTarget, bn, this._onDown, this), this._enabled = !1, this._moved = !1);
        },
        _onDown: function(e) {
          if (this._enabled && (this._moved = !1, !Xe(this._element, "leaflet-zoom-anim"))) {
            if (e.touches && e.touches.length !== 1) {
              At._dragging === this && this.finishDrag();
              return;
            }
            if (!(At._dragging || e.shiftKey || e.which !== 1 && e.button !== 1 && !e.touches) && (At._dragging = this, this._preventOutline && Ot(this._element), cn(), Et(), !this._moving)) {
              this.fire("down");
              var t = e.touches ? e.touches[0] : e, n = Bn(this._element);
              this._startPoint = new F(t.clientX, t.clientY), this._startPos = Me(this._element), this._parentScale = vt(n);
              var o = e.type === "mousedown";
              j(document, o ? "mousemove" : "touchmove", this._onMove, this), j(document, o ? "mouseup" : "touchend touchcancel", this._onUp, this);
            }
          }
        },
        _onMove: function(e) {
          if (this._enabled) {
            if (e.touches && e.touches.length > 1) {
              this._moved = !0;
              return;
            }
            var t = e.touches && e.touches.length === 1 ? e.touches[0] : e, n = new F(t.clientX, t.clientY)._subtract(this._startPoint);
            !n.x && !n.y || Math.abs(n.x) + Math.abs(n.y) < this.options.clickTolerance || (n.x /= this._parentScale.x, n.y /= this._parentScale.y, ve(e), this._moved || (this.fire("dragstart"), this._moved = !0, G(document.body, "leaflet-dragging"), this._lastTarget = e.target || e.srcElement, window.SVGElementInstance && this._lastTarget instanceof window.SVGElementInstance && (this._lastTarget = this._lastTarget.correspondingUseElement), G(this._lastTarget, "leaflet-drag-target")), this._newPos = this._startPos.add(n), this._moving = !0, this._lastEvent = e, this._updatePosition());
          }
        },
        _updatePosition: function() {
          var e = { originalEvent: this._lastEvent };
          this.fire("predrag", e), Ce(this._element, this._newPos), this.fire("drag", e);
        },
        _onUp: function() {
          this._enabled && this.finishDrag();
        },
        finishDrag: function(e) {
          ke(document.body, "leaflet-dragging"), this._lastTarget && (ke(this._lastTarget, "leaflet-drag-target"), this._lastTarget = null), Y(document, "mousemove touchmove", this._onMove, this), Y(document, "mouseup touchend touchcancel", this._onUp, this), In(), wt();
          var t = this._moved && this._moving;
          this._moving = !1, At._dragging = !1, t && this.fire("dragend", {
            noInertia: e,
            distance: this._newPos.distanceTo(this._startPos)
          });
        }
      });
      function Ii(e, t, n) {
        var o, s = [1, 4, 2, 8], c, h, p, f, k, z, V, te;
        for (c = 0, z = e.length; c < z; c++)
          e[c]._code = M(e[c], t);
        for (p = 0; p < 4; p++) {
          for (V = s[p], o = [], c = 0, z = e.length, h = z - 1; c < z; h = c++)
            f = e[c], k = e[h], f._code & V ? k._code & V || (te = C(k, f, V, t, n), te._code = M(te, t), o.push(te)) : (k._code & V && (te = C(k, f, V, t, n), te._code = M(te, t), o.push(te)), o.push(f));
          e = o;
        }
        return e;
      }
      function si(e, t) {
        var n, o, s, c, h, p, f, k, z;
        if (!e || e.length === 0)
          throw new Error("latlngs not passed");
        ue(e) || (console.warn("latlngs are not flat! Only the first ring will be used"), e = e[0]);
        var V = ie([0, 0]), te = ne(e), Ke = te.getNorthWest().distanceTo(te.getSouthWest()) * te.getNorthEast().distanceTo(te.getNorthWest());
        Ke < 1700 && (V = li(e));
        var Ue = e.length, gt = [];
        for (n = 0; n < Ue; n++) {
          var et = ie(e[n]);
          gt.push(t.project(ie([et.lat - V.lat, et.lng - V.lng])));
        }
        for (p = f = k = 0, n = 0, o = Ue - 1; n < Ue; o = n++)
          s = gt[n], c = gt[o], h = s.y * c.x - c.y * s.x, f += (s.x + c.x) * h, k += (s.y + c.y) * h, p += h * 3;
        p === 0 ? z = gt[0] : z = [f / p, k / p];
        var Wn = t.unproject(U(z));
        return ie([Wn.lat + V.lat, Wn.lng + V.lng]);
      }
      function li(e) {
        for (var t = 0, n = 0, o = 0, s = 0; s < e.length; s++) {
          var c = ie(e[s]);
          t += c.lat, n += c.lng, o++;
        }
        return ie([t / o, n / o]);
      }
      var po = {
        __proto__: null,
        clipPolygon: Ii,
        polygonCenter: si,
        centroid: li
      };
      function Bi(e, t) {
        if (!t || !e.length)
          return e.slice();
        var n = t * t;
        return e = d(e, n), e = Zi(e, n), e;
      }
      function Dn(e, t, n) {
        return Math.sqrt(ae(e, t, n, !0));
      }
      function ri(e, t, n) {
        return ae(e, t, n);
      }
      function Zi(e, t) {
        var n = e.length, o = typeof Uint8Array < "u" ? Uint8Array : Array, s = new o(n);
        s[0] = s[n - 1] = 1, Rn(e, s, t, 0, n - 1);
        var c, h = [];
        for (c = 0; c < n; c++)
          s[c] && h.push(e[c]);
        return h;
      }
      function Rn(e, t, n, o, s) {
        var c = 0, h, p, f;
        for (p = o + 1; p <= s - 1; p++)
          f = ae(e[p], e[o], e[s], !0), f > c && (h = p, c = f);
        c > n && (t[h] = 1, Rn(e, t, n, o, h), Rn(e, t, n, h, s));
      }
      function d(e, t) {
        for (var n = [e[0]], o = 1, s = 0, c = e.length; o < c; o++)
          ee(e[o], e[s]) > t && (n.push(e[o]), s = o);
        return s < c - 1 && n.push(e[c - 1]), n;
      }
      var u;
      function r(e, t, n, o, s) {
        var c = o ? u : M(e, n), h = M(t, n), p, f, k;
        for (u = h; ; ) {
          if (!(c | h))
            return [e, t];
          if (c & h)
            return !1;
          p = c || h, f = C(e, t, p, n, s), k = M(f, n), p === c ? (e = f, c = k) : (t = f, h = k);
        }
      }
      function C(e, t, n, o, s) {
        var c = t.x - e.x, h = t.y - e.y, p = o.min, f = o.max, k, z;
        return n & 8 ? (k = e.x + c * (f.y - e.y) / h, z = f.y) : n & 4 ? (k = e.x + c * (p.y - e.y) / h, z = p.y) : n & 2 ? (k = f.x, z = e.y + h * (f.x - e.x) / c) : n & 1 && (k = p.x, z = e.y + h * (p.x - e.x) / c), new F(k, z, s);
      }
      function M(e, t) {
        var n = 0;
        return e.x < t.min.x ? n |= 1 : e.x > t.max.x && (n |= 2), e.y < t.min.y ? n |= 4 : e.y > t.max.y && (n |= 8), n;
      }
      function ee(e, t) {
        var n = t.x - e.x, o = t.y - e.y;
        return n * n + o * o;
      }
      function ae(e, t, n, o) {
        var s = t.x, c = t.y, h = n.x - s, p = n.y - c, f = h * h + p * p, k;
        return f > 0 && (k = ((e.x - s) * h + (e.y - c) * p) / f, k > 1 ? (s = n.x, c = n.y) : k > 0 && (s += h * k, c += p * k)), h = e.x - s, p = e.y - c, o ? h * h + p * p : new F(s, c);
      }
      function ue(e) {
        return !He(e[0]) || typeof e[0][0] != "object" && typeof e[0][0] < "u";
      }
      function ui(e) {
        return console.warn("Deprecated use of _flat, please use L.LineUtil.isFlat instead."), ue(e);
      }
      function ci(e, t) {
        var n, o, s, c, h, p, f, k;
        if (!e || e.length === 0)
          throw new Error("latlngs not passed");
        ue(e) || (console.warn("latlngs are not flat! Only the first ring will be used"), e = e[0]);
        var z = ie([0, 0]), V = ne(e), te = V.getNorthWest().distanceTo(V.getSouthWest()) * V.getNorthEast().distanceTo(V.getNorthWest());
        te < 1700 && (z = li(e));
        var Ke = e.length, Ue = [];
        for (n = 0; n < Ke; n++) {
          var gt = ie(e[n]);
          Ue.push(t.project(ie([gt.lat - z.lat, gt.lng - z.lng])));
        }
        for (n = 0, o = 0; n < Ke - 1; n++)
          o += Ue[n].distanceTo(Ue[n + 1]) / 2;
        if (o === 0)
          k = Ue[0];
        else
          for (n = 0, c = 0; n < Ke - 1; n++)
            if (h = Ue[n], p = Ue[n + 1], s = h.distanceTo(p), c += s, c > o) {
              f = (c - o) / s, k = [
                p.x - f * (p.x - h.x),
                p.y - f * (p.y - h.y)
              ];
              break;
            }
        var et = t.unproject(U(k));
        return ie([et.lat + z.lat, et.lng + z.lng]);
      }
      var Ni = {
        __proto__: null,
        simplify: Bi,
        pointToSegmentDistance: Dn,
        closestPointOnSegment: ri,
        clipSegment: r,
        _getEdgeIntersection: C,
        _getBitCode: M,
        _sqClosestPointOnSegment: ae,
        isFlat: ue,
        _flat: ui,
        polylineCenter: ci
      }, P = {
        project: function(e) {
          return new F(e.lng, e.lat);
        },
        unproject: function(e) {
          return new X(e.y, e.x);
        },
        bounds: new y([-180, -90], [180, 90])
      }, le = {
        R: 6378137,
        R_MINOR: 6356752314245179e-9,
        bounds: new y([-2003750834279e-5, -1549657073972e-5], [2003750834279e-5, 1876465623138e-5]),
        project: function(e) {
          var t = Math.PI / 180, n = this.R, o = e.lat * t, s = this.R_MINOR / n, c = Math.sqrt(1 - s * s), h = c * Math.sin(o), p = Math.tan(Math.PI / 4 - o / 2) / Math.pow((1 - h) / (1 + h), c / 2);
          return o = -n * Math.log(Math.max(p, 1e-10)), new F(e.lng * t * n, o);
        },
        unproject: function(e) {
          for (var t = 180 / Math.PI, n = this.R, o = this.R_MINOR / n, s = Math.sqrt(1 - o * o), c = Math.exp(-e.y / n), h = Math.PI / 2 - 2 * Math.atan(c), p = 0, f = 0.1, k; p < 15 && Math.abs(f) > 1e-7; p++)
            k = s * Math.sin(h), k = Math.pow((1 - k) / (1 + k), s / 2), f = Math.PI / 2 - 2 * Math.atan(c * k) - h, h += f;
          return new X(h * t, e.x * t / n);
        }
      }, ge = {
        __proto__: null,
        LonLat: P,
        Mercator: le,
        SphericalMercator: Bt
      }, Be = I({}, pe, {
        code: "EPSG:3395",
        projection: le,
        transformation: (function() {
          var e = 0.5 / (Math.PI * le.R);
          return qt(e, 0.5, -e, 0.5);
        })()
      }), ze = I({}, pe, {
        code: "EPSG:4326",
        projection: P,
        transformation: qt(1 / 180, 1, -1 / 180, 0.5)
      }), Oe = I({}, dt, {
        projection: P,
        transformation: qt(1, 0, -1, 0),
        scale: function(e) {
          return Math.pow(2, e);
        },
        zoom: function(e) {
          return Math.log(e) / Math.LN2;
        },
        distance: function(e, t) {
          var n = t.lng - e.lng, o = t.lat - e.lat;
          return Math.sqrt(n * n + o * o);
        },
        infinite: !0
      });
      dt.Earth = pe, dt.EPSG3395 = Be, dt.EPSG3857 = an, dt.EPSG900913 = jn, dt.EPSG4326 = ze, dt.Simple = Oe;
      var Pt = Tt.extend({
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
        addTo: function(e) {
          return e.addLayer(this), this;
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
        removeFrom: function(e) {
          return e && e.removeLayer(this), this;
        },
        // @method getPane(name? : String): HTMLElement
        // Returns the `HTMLElement` representing the named pane on the map. If `name` is omitted, returns the pane for this layer.
        getPane: function(e) {
          return this._map.getPane(e ? this.options[e] || e : this.options.pane);
        },
        addInteractiveTarget: function(e) {
          return this._map._targets[K(e)] = this, this;
        },
        removeInteractiveTarget: function(e) {
          return delete this._map._targets[K(e)], this;
        },
        // @method getAttribution: String
        // Used by the `attribution control`, returns the [attribution option](#gridlayer-attribution).
        getAttribution: function() {
          return this.options.attribution;
        },
        _layerAdd: function(e) {
          var t = e.target;
          if (t.hasLayer(this)) {
            if (this._map = t, this._zoomAnimated = t._zoomAnimated, this.getEvents) {
              var n = this.getEvents();
              t.on(n, this), this.once("remove", function() {
                t.off(n, this);
              }, this);
            }
            this.onAdd(t), this.fire("add"), t.fire("layeradd", { layer: this });
          }
        }
      });
      oe.include({
        // @method addLayer(layer: Layer): this
        // Adds the given layer to the map
        addLayer: function(e) {
          if (!e._layerAdd)
            throw new Error("The provided object is not a Layer.");
          var t = K(e);
          return this._layers[t] ? this : (this._layers[t] = e, e._mapToAdd = this, e.beforeAdd && e.beforeAdd(this), this.whenReady(e._layerAdd, e), this);
        },
        // @method removeLayer(layer: Layer): this
        // Removes the given layer from the map.
        removeLayer: function(e) {
          var t = K(e);
          return this._layers[t] ? (this._loaded && e.onRemove(this), delete this._layers[t], this._loaded && (this.fire("layerremove", { layer: e }), e.fire("remove")), e._map = e._mapToAdd = null, this) : this;
        },
        // @method hasLayer(layer: Layer): Boolean
        // Returns `true` if the given layer is currently added to the map
        hasLayer: function(e) {
          return K(e) in this._layers;
        },
        /* @method eachLayer(fn: Function, context?: Object): this
         * Iterates over the layers of the map, optionally specifying context of the iterator function.
         * ```
         * map.eachLayer(function(layer){
         *     layer.bindPopup('Hello');
         * });
         * ```
         */
        eachLayer: function(e, t) {
          for (var n in this._layers)
            e.call(t, this._layers[n]);
          return this;
        },
        _addLayers: function(e) {
          e = e ? He(e) ? e : [e] : [];
          for (var t = 0, n = e.length; t < n; t++)
            this.addLayer(e[t]);
        },
        _addZoomLimit: function(e) {
          (!isNaN(e.options.maxZoom) || !isNaN(e.options.minZoom)) && (this._zoomBoundLayers[K(e)] = e, this._updateZoomLevels());
        },
        _removeZoomLimit: function(e) {
          var t = K(e);
          this._zoomBoundLayers[t] && (delete this._zoomBoundLayers[t], this._updateZoomLevels());
        },
        _updateZoomLevels: function() {
          var e = 1 / 0, t = -1 / 0, n = this._getZoomSpan();
          for (var o in this._zoomBoundLayers) {
            var s = this._zoomBoundLayers[o].options;
            e = s.minZoom === void 0 ? e : Math.min(e, s.minZoom), t = s.maxZoom === void 0 ? t : Math.max(t, s.maxZoom);
          }
          this._layersMaxZoom = t === -1 / 0 ? void 0 : t, this._layersMinZoom = e === 1 / 0 ? void 0 : e, n !== this._getZoomSpan() && this.fire("zoomlevelschange"), this.options.maxZoom === void 0 && this._layersMaxZoom && this.getZoom() > this._layersMaxZoom && this.setZoom(this._layersMaxZoom), this.options.minZoom === void 0 && this._layersMinZoom && this.getZoom() < this._layersMinZoom && this.setZoom(this._layersMinZoom);
        }
      });
      var Vn = Pt.extend({
        initialize: function(e, t) {
          de(this, t), this._layers = {};
          var n, o;
          if (e)
            for (n = 0, o = e.length; n < o; n++)
              this.addLayer(e[n]);
        },
        // @method addLayer(layer: Layer): this
        // Adds the given layer to the group.
        addLayer: function(e) {
          var t = this.getLayerId(e);
          return this._layers[t] = e, this._map && this._map.addLayer(e), this;
        },
        // @method removeLayer(layer: Layer): this
        // Removes the given layer from the group.
        // @alternative
        // @method removeLayer(id: Number): this
        // Removes the layer with the given internal ID from the group.
        removeLayer: function(e) {
          var t = e in this._layers ? e : this.getLayerId(e);
          return this._map && this._layers[t] && this._map.removeLayer(this._layers[t]), delete this._layers[t], this;
        },
        // @method hasLayer(layer: Layer): Boolean
        // Returns `true` if the given layer is currently added to the group.
        // @alternative
        // @method hasLayer(id: Number): Boolean
        // Returns `true` if the given internal ID is currently added to the group.
        hasLayer: function(e) {
          var t = typeof e == "number" ? e : this.getLayerId(e);
          return t in this._layers;
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
        invoke: function(e) {
          var t = Array.prototype.slice.call(arguments, 1), n, o;
          for (n in this._layers)
            o = this._layers[n], o[e] && o[e].apply(o, t);
          return this;
        },
        onAdd: function(e) {
          this.eachLayer(e.addLayer, e);
        },
        onRemove: function(e) {
          this.eachLayer(e.removeLayer, e);
        },
        // @method eachLayer(fn: Function, context?: Object): this
        // Iterates over the layers of the group, optionally specifying context of the iterator function.
        // ```js
        // group.eachLayer(function (layer) {
        // 	layer.bindPopup('Hello');
        // });
        // ```
        eachLayer: function(e, t) {
          for (var n in this._layers)
            e.call(t, this._layers[n]);
          return this;
        },
        // @method getLayer(id: Number): Layer
        // Returns the layer with the given internal ID.
        getLayer: function(e) {
          return this._layers[e];
        },
        // @method getLayers(): Layer[]
        // Returns an array of all the layers added to the group.
        getLayers: function() {
          var e = [];
          return this.eachLayer(e.push, e), e;
        },
        // @method setZIndex(zIndex: Number): this
        // Calls `setZIndex` on every layer contained in this group, passing the z-index.
        setZIndex: function(e) {
          return this.invoke("setZIndex", e);
        },
        // @method getLayerId(layer: Layer): Number
        // Returns the internal ID for a layer
        getLayerId: function(e) {
          return K(e);
        }
      }), Qo = function(e, t) {
        return new Vn(e, t);
      }, Rt = Vn.extend({
        addLayer: function(e) {
          return this.hasLayer(e) ? this : (e.addEventParent(this), Vn.prototype.addLayer.call(this, e), this.fire("layeradd", { layer: e }));
        },
        removeLayer: function(e) {
          return this.hasLayer(e) ? (e in this._layers && (e = this._layers[e]), e.removeEventParent(this), Vn.prototype.removeLayer.call(this, e), this.fire("layerremove", { layer: e })) : this;
        },
        // @method setStyle(style: Path options): this
        // Sets the given path options to each layer of the group that has a `setStyle` method.
        setStyle: function(e) {
          return this.invoke("setStyle", e);
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
          var e = new b();
          for (var t in this._layers) {
            var n = this._layers[t];
            e.extend(n.getBounds ? n.getBounds() : n.getLatLng());
          }
          return e;
        }
      }), ea = function(e, t) {
        return new Rt(e, t);
      }, $n = nt.extend({
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
        initialize: function(e) {
          de(this, e);
        },
        // @method createIcon(oldIcon?: HTMLElement): HTMLElement
        // Called internally when the icon has to be shown, returns a `<img>` HTML element
        // styled according to the options.
        createIcon: function(e) {
          return this._createIcon("icon", e);
        },
        // @method createShadow(oldIcon?: HTMLElement): HTMLElement
        // As `createIcon`, but for the shadow beneath it.
        createShadow: function(e) {
          return this._createIcon("shadow", e);
        },
        _createIcon: function(e, t) {
          var n = this._getIconUrl(e);
          if (!n) {
            if (e === "icon")
              throw new Error("iconUrl not set in Icon options (see the docs).");
            return null;
          }
          var o = this._createImg(n, t && t.tagName === "IMG" ? t : null);
          return this._setIconStyles(o, e), (this.options.crossOrigin || this.options.crossOrigin === "") && (o.crossOrigin = this.options.crossOrigin === !0 ? "" : this.options.crossOrigin), o;
        },
        _setIconStyles: function(e, t) {
          var n = this.options, o = n[t + "Size"];
          typeof o == "number" && (o = [o, o]);
          var s = U(o), c = U(t === "shadow" && n.shadowAnchor || n.iconAnchor || s && s.divideBy(2, !0));
          e.className = "leaflet-marker-" + t + " " + (n.className || ""), c && (e.style.marginLeft = -c.x + "px", e.style.marginTop = -c.y + "px"), s && (e.style.width = s.x + "px", e.style.height = s.y + "px");
        },
        _createImg: function(e, t) {
          return t = t || document.createElement("img"), t.src = e, t;
        },
        _getIconUrl: function(e) {
          return S.retina && this.options[e + "RetinaUrl"] || this.options[e + "Url"];
        }
      });
      function ta(e) {
        return new $n(e);
      }
      var di = $n.extend({
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
        _getIconUrl: function(e) {
          return typeof di.imagePath != "string" && (di.imagePath = this._detectIconPath()), (this.options.imagePath || di.imagePath) + $n.prototype._getIconUrl.call(this, e);
        },
        _stripUrl: function(e) {
          var t = function(n, o, s) {
            var c = o.exec(n);
            return c && c[s];
          };
          return e = t(e, /^url\((['"])?(.+)\1\)$/, 2), e && t(e, /^(.*)marker-icon\.png$/, 1);
        },
        _detectIconPath: function() {
          var e = Q("div", "leaflet-default-icon-path", document.body), t = bt(e, "background-image") || bt(e, "backgroundImage");
          if (document.body.removeChild(e), t = this._stripUrl(t), t)
            return t;
          var n = document.querySelector('link[href$="leaflet.css"]');
          return n ? n.href.substring(0, n.href.length - 11 - 1) : "";
        }
      }), bo = rt.extend({
        initialize: function(e) {
          this._marker = e;
        },
        addHooks: function() {
          var e = this._marker._icon;
          this._draggable || (this._draggable = new At(e, e, !0)), this._draggable.on({
            dragstart: this._onDragStart,
            predrag: this._onPreDrag,
            drag: this._onDrag,
            dragend: this._onDragEnd
          }, this).enable(), G(e, "leaflet-marker-draggable");
        },
        removeHooks: function() {
          this._draggable.off({
            dragstart: this._onDragStart,
            predrag: this._onPreDrag,
            drag: this._onDrag,
            dragend: this._onDragEnd
          }, this).disable(), this._marker._icon && ke(this._marker._icon, "leaflet-marker-draggable");
        },
        moved: function() {
          return this._draggable && this._draggable._moved;
        },
        _adjustPan: function(e) {
          var t = this._marker, n = t._map, o = this._marker.options.autoPanSpeed, s = this._marker.options.autoPanPadding, c = Me(t._icon), h = n.getPixelBounds(), p = n.getPixelOrigin(), f = T(
            h.min._subtract(p).add(s),
            h.max._subtract(p).subtract(s)
          );
          if (!f.contains(c)) {
            var k = U(
              (Math.max(f.max.x, c.x) - f.max.x) / (h.max.x - f.max.x) - (Math.min(f.min.x, c.x) - f.min.x) / (h.min.x - f.min.x),
              (Math.max(f.max.y, c.y) - f.max.y) / (h.max.y - f.max.y) - (Math.min(f.min.y, c.y) - f.min.y) / (h.min.y - f.min.y)
            ).multiplyBy(o);
            n.panBy(k, { animate: !1 }), this._draggable._newPos._add(k), this._draggable._startPos._add(k), Ce(t._icon, this._draggable._newPos), this._onDrag(e), this._panRequest = Te(this._adjustPan.bind(this, e));
          }
        },
        _onDragStart: function() {
          this._oldLatLng = this._marker.getLatLng(), this._marker.closePopup && this._marker.closePopup(), this._marker.fire("movestart").fire("dragstart");
        },
        _onPreDrag: function(e) {
          this._marker.options.autoPan && (Se(this._panRequest), this._panRequest = Te(this._adjustPan.bind(this, e)));
        },
        _onDrag: function(e) {
          var t = this._marker, n = t._shadow, o = Me(t._icon), s = t._map.layerPointToLatLng(o);
          n && Ce(n, o), t._latlng = s, e.latlng = s, e.oldLatLng = this._oldLatLng, t.fire("move", e).fire("drag", e);
        },
        _onDragEnd: function(e) {
          Se(this._panRequest), delete this._oldLatLng, this._marker.fire("moveend").fire("dragend", e);
        }
      }), Di = Pt.extend({
        // @section
        // @aka Marker options
        options: {
          // @option icon: Icon = *
          // Icon instance to use for rendering the marker.
          // See [Icon documentation](#L.Icon) for details on how to customize the marker icon.
          // If not specified, a common instance of `L.Icon.Default` is used.
          icon: new di(),
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
        initialize: function(e, t) {
          de(this, t), this._latlng = ie(e);
        },
        onAdd: function(e) {
          this._zoomAnimated = this._zoomAnimated && e.options.markerZoomAnimation, this._zoomAnimated && e.on("zoomanim", this._animateZoom, this), this._initIcon(), this.update();
        },
        onRemove: function(e) {
          this.dragging && this.dragging.enabled() && (this.options.draggable = !0, this.dragging.removeHooks()), delete this.dragging, this._zoomAnimated && e.off("zoomanim", this._animateZoom, this), this._removeIcon(), this._removeShadow();
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
        setLatLng: function(e) {
          var t = this._latlng;
          return this._latlng = ie(e), this.update(), this.fire("move", { oldLatLng: t, latlng: this._latlng });
        },
        // @method setZIndexOffset(offset: Number): this
        // Changes the [zIndex offset](#marker-zindexoffset) of the marker.
        setZIndexOffset: function(e) {
          return this.options.zIndexOffset = e, this.update();
        },
        // @method getIcon: Icon
        // Returns the current icon used by the marker
        getIcon: function() {
          return this.options.icon;
        },
        // @method setIcon(icon: Icon): this
        // Changes the marker icon.
        setIcon: function(e) {
          return this.options.icon = e, this._map && (this._initIcon(), this.update()), this._popup && this.bindPopup(this._popup, this._popup.options), this;
        },
        getElement: function() {
          return this._icon;
        },
        update: function() {
          if (this._icon && this._map) {
            var e = this._map.latLngToLayerPoint(this._latlng).round();
            this._setPos(e);
          }
          return this;
        },
        _initIcon: function() {
          var e = this.options, t = "leaflet-zoom-" + (this._zoomAnimated ? "animated" : "hide"), n = e.icon.createIcon(this._icon), o = !1;
          n !== this._icon && (this._icon && this._removeIcon(), o = !0, e.title && (n.title = e.title), n.tagName === "IMG" && (n.alt = e.alt || "")), G(n, t), e.keyboard && (n.tabIndex = "0", n.setAttribute("role", "button")), this._icon = n, e.riseOnHover && this.on({
            mouseover: this._bringToFront,
            mouseout: this._resetZIndex
          }), this.options.autoPanOnFocus && j(n, "focus", this._panOnFocus, this);
          var s = e.icon.createShadow(this._shadow), c = !1;
          s !== this._shadow && (this._removeShadow(), c = !0), s && (G(s, t), s.alt = ""), this._shadow = s, e.opacity < 1 && this._updateOpacity(), o && this.getPane().appendChild(this._icon), this._initInteraction(), s && c && this.getPane(e.shadowPane).appendChild(this._shadow);
        },
        _removeIcon: function() {
          this.options.riseOnHover && this.off({
            mouseover: this._bringToFront,
            mouseout: this._resetZIndex
          }), this.options.autoPanOnFocus && Y(this._icon, "focus", this._panOnFocus, this), fe(this._icon), this.removeInteractiveTarget(this._icon), this._icon = null;
        },
        _removeShadow: function() {
          this._shadow && fe(this._shadow), this._shadow = null;
        },
        _setPos: function(e) {
          this._icon && Ce(this._icon, e), this._shadow && Ce(this._shadow, e), this._zIndex = e.y + this.options.zIndexOffset, this._resetZIndex();
        },
        _updateZIndex: function(e) {
          this._icon && (this._icon.style.zIndex = this._zIndex + e);
        },
        _animateZoom: function(e) {
          var t = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center).round();
          this._setPos(t);
        },
        _initInteraction: function() {
          if (this.options.interactive && (G(this._icon, "leaflet-interactive"), this.addInteractiveTarget(this._icon), bo)) {
            var e = this.options.draggable;
            this.dragging && (e = this.dragging.enabled(), this.dragging.disable()), this.dragging = new bo(this), e && this.dragging.enable();
          }
        },
        // @method setOpacity(opacity: Number): this
        // Changes the opacity of the marker.
        setOpacity: function(e) {
          return this.options.opacity = e, this._map && this._updateOpacity(), this;
        },
        _updateOpacity: function() {
          var e = this.options.opacity;
          this._icon && Qe(this._icon, e), this._shadow && Qe(this._shadow, e);
        },
        _bringToFront: function() {
          this._updateZIndex(this.options.riseOffset);
        },
        _resetZIndex: function() {
          this._updateZIndex(0);
        },
        _panOnFocus: function() {
          var e = this._map;
          if (e) {
            var t = this.options.icon.options, n = t.iconSize ? U(t.iconSize) : U(0, 0), o = t.iconAnchor ? U(t.iconAnchor) : U(0, 0);
            e.panInside(this._latlng, {
              paddingTopLeft: o,
              paddingBottomRight: n.subtract(o)
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
      function na(e, t) {
        return new Di(e, t);
      }
      var en = Pt.extend({
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
        beforeAdd: function(e) {
          this._renderer = e.getRenderer(this);
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
        setStyle: function(e) {
          return de(this, e), this._renderer && (this._renderer._updateStyle(this), this.options.stroke && e && Object.prototype.hasOwnProperty.call(e, "weight") && this._updateBounds()), this;
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
      }), Ri = en.extend({
        // @section
        // @aka CircleMarker options
        options: {
          fill: !0,
          // @option radius: Number = 10
          // Radius of the circle marker, in pixels
          radius: 10
        },
        initialize: function(e, t) {
          de(this, t), this._latlng = ie(e), this._radius = this.options.radius;
        },
        // @method setLatLng(latLng: LatLng): this
        // Sets the position of a circle marker to a new location.
        setLatLng: function(e) {
          var t = this._latlng;
          return this._latlng = ie(e), this.redraw(), this.fire("move", { oldLatLng: t, latlng: this._latlng });
        },
        // @method getLatLng(): LatLng
        // Returns the current geographical position of the circle marker
        getLatLng: function() {
          return this._latlng;
        },
        // @method setRadius(radius: Number): this
        // Sets the radius of a circle marker. Units are in pixels.
        setRadius: function(e) {
          return this.options.radius = this._radius = e, this.redraw();
        },
        // @method getRadius(): Number
        // Returns the current radius of the circle
        getRadius: function() {
          return this._radius;
        },
        setStyle: function(e) {
          var t = e && e.radius || this._radius;
          return en.prototype.setStyle.call(this, e), this.setRadius(t), this;
        },
        _project: function() {
          this._point = this._map.latLngToLayerPoint(this._latlng), this._updateBounds();
        },
        _updateBounds: function() {
          var e = this._radius, t = this._radiusY || e, n = this._clickTolerance(), o = [e + n, t + n];
          this._pxBounds = new y(this._point.subtract(o), this._point.add(o));
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
        _containsPoint: function(e) {
          return e.distanceTo(this._point) <= this._radius + this._clickTolerance();
        }
      });
      function ia(e, t) {
        return new Ri(e, t);
      }
      var fo = Ri.extend({
        initialize: function(e, t, n) {
          if (typeof t == "number" && (t = I({}, n, { radius: t })), de(this, t), this._latlng = ie(e), isNaN(this.options.radius))
            throw new Error("Circle radius cannot be NaN");
          this._mRadius = this.options.radius;
        },
        // @method setRadius(radius: Number): this
        // Sets the radius of a circle. Units are in meters.
        setRadius: function(e) {
          return this._mRadius = e, this.redraw();
        },
        // @method getRadius(): Number
        // Returns the current radius of a circle. Units are in meters.
        getRadius: function() {
          return this._mRadius;
        },
        // @method getBounds(): LatLngBounds
        // Returns the `LatLngBounds` of the path.
        getBounds: function() {
          var e = [this._radius, this._radiusY || this._radius];
          return new b(
            this._map.layerPointToLatLng(this._point.subtract(e)),
            this._map.layerPointToLatLng(this._point.add(e))
          );
        },
        setStyle: en.prototype.setStyle,
        _project: function() {
          var e = this._latlng.lng, t = this._latlng.lat, n = this._map, o = n.options.crs;
          if (o.distance === pe.distance) {
            var s = Math.PI / 180, c = this._mRadius / pe.R / s, h = n.project([t + c, e]), p = n.project([t - c, e]), f = h.add(p).divideBy(2), k = n.unproject(f).lat, z = Math.acos((Math.cos(c * s) - Math.sin(t * s) * Math.sin(k * s)) / (Math.cos(t * s) * Math.cos(k * s))) / s;
            (isNaN(z) || z === 0) && (z = c / Math.cos(Math.PI / 180 * t)), this._point = f.subtract(n.getPixelOrigin()), this._radius = isNaN(z) ? 0 : f.x - n.project([k, e - z]).x, this._radiusY = f.y - h.y;
          } else {
            var V = o.unproject(o.project(this._latlng).subtract([this._mRadius, 0]));
            this._point = n.latLngToLayerPoint(this._latlng), this._radius = this._point.x - n.latLngToLayerPoint(V).x;
          }
          this._updateBounds();
        }
      });
      function oa(e, t, n) {
        return new fo(e, t, n);
      }
      var Vt = en.extend({
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
        initialize: function(e, t) {
          de(this, t), this._setLatLngs(e);
        },
        // @method getLatLngs(): LatLng[]
        // Returns an array of the points in the path, or nested arrays of points in case of multi-polyline.
        getLatLngs: function() {
          return this._latlngs;
        },
        // @method setLatLngs(latlngs: LatLng[]): this
        // Replaces all the points in the polyline with the given array of geographical points.
        setLatLngs: function(e) {
          return this._setLatLngs(e), this.redraw();
        },
        // @method isEmpty(): Boolean
        // Returns `true` if the Polyline has no LatLngs.
        isEmpty: function() {
          return !this._latlngs.length;
        },
        // @method closestLayerPoint(p: Point): Point
        // Returns the point closest to `p` on the Polyline.
        closestLayerPoint: function(e) {
          for (var t = 1 / 0, n = null, o = ae, s, c, h = 0, p = this._parts.length; h < p; h++)
            for (var f = this._parts[h], k = 1, z = f.length; k < z; k++) {
              s = f[k - 1], c = f[k];
              var V = o(e, s, c, !0);
              V < t && (t = V, n = o(e, s, c));
            }
          return n && (n.distance = Math.sqrt(t)), n;
        },
        // @method getCenter(): LatLng
        // Returns the center ([centroid](https://en.wikipedia.org/wiki/Centroid)) of the polyline.
        getCenter: function() {
          if (!this._map)
            throw new Error("Must add layer to map before using getCenter()");
          return ci(this._defaultShape(), this._map.options.crs);
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
        addLatLng: function(e, t) {
          return t = t || this._defaultShape(), e = ie(e), t.push(e), this._bounds.extend(e), this.redraw();
        },
        _setLatLngs: function(e) {
          this._bounds = new b(), this._latlngs = this._convertLatLngs(e);
        },
        _defaultShape: function() {
          return ue(this._latlngs) ? this._latlngs : this._latlngs[0];
        },
        // recursively convert latlngs input into actual LatLng instances; calculate bounds along the way
        _convertLatLngs: function(e) {
          for (var t = [], n = ue(e), o = 0, s = e.length; o < s; o++)
            n ? (t[o] = ie(e[o]), this._bounds.extend(t[o])) : t[o] = this._convertLatLngs(e[o]);
          return t;
        },
        _project: function() {
          var e = new y();
          this._rings = [], this._projectLatlngs(this._latlngs, this._rings, e), this._bounds.isValid() && e.isValid() && (this._rawPxBounds = e, this._updateBounds());
        },
        _updateBounds: function() {
          var e = this._clickTolerance(), t = new F(e, e);
          this._rawPxBounds && (this._pxBounds = new y([
            this._rawPxBounds.min.subtract(t),
            this._rawPxBounds.max.add(t)
          ]));
        },
        // recursively turns latlngs into a set of rings with projected coordinates
        _projectLatlngs: function(e, t, n) {
          var o = e[0] instanceof X, s = e.length, c, h;
          if (o) {
            for (h = [], c = 0; c < s; c++)
              h[c] = this._map.latLngToLayerPoint(e[c]), n.extend(h[c]);
            t.push(h);
          } else
            for (c = 0; c < s; c++)
              this._projectLatlngs(e[c], t, n);
        },
        // clip polyline by renderer bounds so that we have less to render for performance
        _clipPoints: function() {
          var e = this._renderer._bounds;
          if (this._parts = [], !(!this._pxBounds || !this._pxBounds.intersects(e))) {
            if (this.options.noClip) {
              this._parts = this._rings;
              return;
            }
            var t = this._parts, n, o, s, c, h, p, f;
            for (n = 0, s = 0, c = this._rings.length; n < c; n++)
              for (f = this._rings[n], o = 0, h = f.length; o < h - 1; o++)
                p = r(f[o], f[o + 1], e, o, !0), p && (t[s] = t[s] || [], t[s].push(p[0]), (p[1] !== f[o + 1] || o === h - 2) && (t[s].push(p[1]), s++));
          }
        },
        // simplify each clipped part of the polyline for performance
        _simplifyPoints: function() {
          for (var e = this._parts, t = this.options.smoothFactor, n = 0, o = e.length; n < o; n++)
            e[n] = Bi(e[n], t);
        },
        _update: function() {
          this._map && (this._clipPoints(), this._simplifyPoints(), this._updatePath());
        },
        _updatePath: function() {
          this._renderer._updatePoly(this);
        },
        // Needed by the `Canvas` renderer for interactivity
        _containsPoint: function(e, t) {
          var n, o, s, c, h, p, f = this._clickTolerance();
          if (!this._pxBounds || !this._pxBounds.contains(e))
            return !1;
          for (n = 0, c = this._parts.length; n < c; n++)
            for (p = this._parts[n], o = 0, h = p.length, s = h - 1; o < h; s = o++)
              if (!(!t && o === 0) && Dn(e, p[s], p[o]) <= f)
                return !0;
          return !1;
        }
      });
      function aa(e, t) {
        return new Vt(e, t);
      }
      Vt._flat = ui;
      var Un = Vt.extend({
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
          return si(this._defaultShape(), this._map.options.crs);
        },
        _convertLatLngs: function(e) {
          var t = Vt.prototype._convertLatLngs.call(this, e), n = t.length;
          return n >= 2 && t[0] instanceof X && t[0].equals(t[n - 1]) && t.pop(), t;
        },
        _setLatLngs: function(e) {
          Vt.prototype._setLatLngs.call(this, e), ue(this._latlngs) && (this._latlngs = [this._latlngs]);
        },
        _defaultShape: function() {
          return ue(this._latlngs[0]) ? this._latlngs[0] : this._latlngs[0][0];
        },
        _clipPoints: function() {
          var e = this._renderer._bounds, t = this.options.weight, n = new F(t, t);
          if (e = new y(e.min.subtract(n), e.max.add(n)), this._parts = [], !(!this._pxBounds || !this._pxBounds.intersects(e))) {
            if (this.options.noClip) {
              this._parts = this._rings;
              return;
            }
            for (var o = 0, s = this._rings.length, c; o < s; o++)
              c = Ii(this._rings[o], e, !0), c.length && this._parts.push(c);
          }
        },
        _updatePath: function() {
          this._renderer._updatePoly(this, !0);
        },
        // Needed by the `Canvas` renderer for interactivity
        _containsPoint: function(e) {
          var t = !1, n, o, s, c, h, p, f, k;
          if (!this._pxBounds || !this._pxBounds.contains(e))
            return !1;
          for (c = 0, f = this._parts.length; c < f; c++)
            for (n = this._parts[c], h = 0, k = n.length, p = k - 1; h < k; p = h++)
              o = n[h], s = n[p], o.y > e.y != s.y > e.y && e.x < (s.x - o.x) * (e.y - o.y) / (s.y - o.y) + o.x && (t = !t);
          return t || Vt.prototype._containsPoint.call(this, e, !0);
        }
      });
      function sa(e, t) {
        return new Un(e, t);
      }
      var $t = Rt.extend({
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
        initialize: function(e, t) {
          de(this, t), this._layers = {}, e && this.addData(e);
        },
        // @method addData( <GeoJSON> data ): this
        // Adds a GeoJSON object to the layer.
        addData: function(e) {
          var t = He(e) ? e : e.features, n, o, s;
          if (t) {
            for (n = 0, o = t.length; n < o; n++)
              s = t[n], (s.geometries || s.geometry || s.features || s.coordinates) && this.addData(s);
            return this;
          }
          var c = this.options;
          if (c.filter && !c.filter(e))
            return this;
          var h = Vi(e, c);
          return h ? (h.feature = Fi(e), h.defaultOptions = h.options, this.resetStyle(h), c.onEachFeature && c.onEachFeature(e, h), this.addLayer(h)) : this;
        },
        // @method resetStyle( <Path> layer? ): this
        // Resets the given vector layer's style to the original GeoJSON style, useful for resetting style after hover events.
        // If `layer` is omitted, the style of all features in the current layer is reset.
        resetStyle: function(e) {
          return e === void 0 ? this.eachLayer(this.resetStyle, this) : (e.options = I({}, e.defaultOptions), this._setLayerStyle(e, this.options.style), this);
        },
        // @method setStyle( <Function> style ): this
        // Changes styles of GeoJSON vector layers with the given style function.
        setStyle: function(e) {
          return this.eachLayer(function(t) {
            this._setLayerStyle(t, e);
          }, this);
        },
        _setLayerStyle: function(e, t) {
          e.setStyle && (typeof t == "function" && (t = t(e.feature)), e.setStyle(t));
        }
      });
      function Vi(e, t) {
        var n = e.type === "Feature" ? e.geometry : e, o = n ? n.coordinates : null, s = [], c = t && t.pointToLayer, h = t && t.coordsToLatLng || mo, p, f, k, z;
        if (!o && !n)
          return null;
        switch (n.type) {
          case "Point":
            return p = h(o), wo(c, e, p, t);
          case "MultiPoint":
            for (k = 0, z = o.length; k < z; k++)
              p = h(o[k]), s.push(wo(c, e, p, t));
            return new Rt(s);
          case "LineString":
          case "MultiLineString":
            return f = $i(o, n.type === "LineString" ? 0 : 1, h), new Vt(f, t);
          case "Polygon":
          case "MultiPolygon":
            return f = $i(o, n.type === "Polygon" ? 1 : 2, h), new Un(f, t);
          case "GeometryCollection":
            for (k = 0, z = n.geometries.length; k < z; k++) {
              var V = Vi({
                geometry: n.geometries[k],
                type: "Feature",
                properties: e.properties
              }, t);
              V && s.push(V);
            }
            return new Rt(s);
          case "FeatureCollection":
            for (k = 0, z = n.features.length; k < z; k++) {
              var te = Vi(n.features[k], t);
              te && s.push(te);
            }
            return new Rt(s);
          default:
            throw new Error("Invalid GeoJSON object.");
        }
      }
      function wo(e, t, n, o) {
        return e ? e(t, n) : new Di(n, o && o.markersInheritOptions && o);
      }
      function mo(e) {
        return new X(e[1], e[0], e[2]);
      }
      function $i(e, t, n) {
        for (var o = [], s = 0, c = e.length, h; s < c; s++)
          h = t ? $i(e[s], t - 1, n) : (n || mo)(e[s]), o.push(h);
        return o;
      }
      function _o(e, t) {
        return e = ie(e), e.alt !== void 0 ? [W(e.lng, t), W(e.lat, t), W(e.alt, t)] : [W(e.lng, t), W(e.lat, t)];
      }
      function Ui(e, t, n, o) {
        for (var s = [], c = 0, h = e.length; c < h; c++)
          s.push(t ? Ui(e[c], ue(e[c]) ? 0 : t - 1, n, o) : _o(e[c], o));
        return !t && n && s.length > 0 && s.push(s[0].slice()), s;
      }
      function Fn(e, t) {
        return e.feature ? I({}, e.feature, { geometry: t }) : Fi(t);
      }
      function Fi(e) {
        return e.type === "Feature" || e.type === "FeatureCollection" ? e : {
          type: "Feature",
          properties: {},
          geometry: e
        };
      }
      var vo = {
        toGeoJSON: function(e) {
          return Fn(this, {
            type: "Point",
            coordinates: _o(this.getLatLng(), e)
          });
        }
      };
      Di.include(vo), fo.include(vo), Ri.include(vo), Vt.include({
        toGeoJSON: function(e) {
          var t = !ue(this._latlngs), n = Ui(this._latlngs, t ? 1 : 0, !1, e);
          return Fn(this, {
            type: (t ? "Multi" : "") + "LineString",
            coordinates: n
          });
        }
      }), Un.include({
        toGeoJSON: function(e) {
          var t = !ue(this._latlngs), n = t && !ue(this._latlngs[0]), o = Ui(this._latlngs, n ? 2 : t ? 1 : 0, !0, e);
          return t || (o = [o]), Fn(this, {
            type: (n ? "Multi" : "") + "Polygon",
            coordinates: o
          });
        }
      }), Vn.include({
        toMultiPoint: function(e) {
          var t = [];
          return this.eachLayer(function(n) {
            t.push(n.toGeoJSON(e).geometry.coordinates);
          }), Fn(this, {
            type: "MultiPoint",
            coordinates: t
          });
        },
        // @method toGeoJSON(precision?: Number|false): Object
        // Coordinates values are rounded with [`formatNum`](#util-formatnum) function with given `precision`.
        // Returns a [`GeoJSON`](https://en.wikipedia.org/wiki/GeoJSON) representation of the layer group (as a GeoJSON `FeatureCollection`, `GeometryCollection`, or `MultiPoint`).
        toGeoJSON: function(e) {
          var t = this.feature && this.feature.geometry && this.feature.geometry.type;
          if (t === "MultiPoint")
            return this.toMultiPoint(e);
          var n = t === "GeometryCollection", o = [];
          return this.eachLayer(function(s) {
            if (s.toGeoJSON) {
              var c = s.toGeoJSON(e);
              if (n)
                o.push(c.geometry);
              else {
                var h = Fi(c);
                h.type === "FeatureCollection" ? o.push.apply(o, h.features) : o.push(h);
              }
            }
          }), n ? Fn(this, {
            geometries: o,
            type: "GeometryCollection"
          }) : {
            type: "FeatureCollection",
            features: o
          };
        }
      });
      function xo(e, t) {
        return new $t(e, t);
      }
      var la = xo, Hi = Pt.extend({
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
        initialize: function(e, t, n) {
          this._url = e, this._bounds = ne(t), de(this, n);
        },
        onAdd: function() {
          this._image || (this._initImage(), this.options.opacity < 1 && this._updateOpacity()), this.options.interactive && (G(this._image, "leaflet-interactive"), this.addInteractiveTarget(this._image)), this.getPane().appendChild(this._image), this._reset();
        },
        onRemove: function() {
          fe(this._image), this.options.interactive && this.removeInteractiveTarget(this._image);
        },
        // @method setOpacity(opacity: Number): this
        // Sets the opacity of the overlay.
        setOpacity: function(e) {
          return this.options.opacity = e, this._image && this._updateOpacity(), this;
        },
        setStyle: function(e) {
          return e.opacity && this.setOpacity(e.opacity), this;
        },
        // @method bringToFront(): this
        // Brings the layer to the top of all overlays.
        bringToFront: function() {
          return this._map && mt(this._image), this;
        },
        // @method bringToBack(): this
        // Brings the layer to the bottom of all overlays.
        bringToBack: function() {
          return this._map && _t(this._image), this;
        },
        // @method setUrl(url: String): this
        // Changes the URL of the image.
        setUrl: function(e) {
          return this._url = e, this._image && (this._image.src = e), this;
        },
        // @method setBounds(bounds: LatLngBounds): this
        // Update the bounds that this ImageOverlay covers
        setBounds: function(e) {
          return this._bounds = ne(e), this._map && this._reset(), this;
        },
        getEvents: function() {
          var e = {
            zoom: this._reset,
            viewreset: this._reset
          };
          return this._zoomAnimated && (e.zoomanim = this._animateZoom), e;
        },
        // @method setZIndex(value: Number): this
        // Changes the [zIndex](#imageoverlay-zindex) of the image overlay.
        setZIndex: function(e) {
          return this.options.zIndex = e, this._updateZIndex(), this;
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
          var e = this._url.tagName === "IMG", t = this._image = e ? this._url : Q("img");
          if (G(t, "leaflet-image-layer"), this._zoomAnimated && G(t, "leaflet-zoom-animated"), this.options.className && G(t, this.options.className), t.onselectstart = re, t.onmousemove = re, t.onload = Z(this.fire, this, "load"), t.onerror = Z(this._overlayOnError, this, "error"), (this.options.crossOrigin || this.options.crossOrigin === "") && (t.crossOrigin = this.options.crossOrigin === !0 ? "" : this.options.crossOrigin), this.options.zIndex && this._updateZIndex(), e) {
            this._url = t.src;
            return;
          }
          t.src = this._url, t.alt = this.options.alt;
        },
        _animateZoom: function(e) {
          var t = this._map.getZoomScale(e.zoom), n = this._map._latLngBoundsToNewLayerBounds(this._bounds, e.zoom, e.center).min;
          zt(this._image, n, t);
        },
        _reset: function() {
          var e = this._image, t = new y(
            this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
            this._map.latLngToLayerPoint(this._bounds.getSouthEast())
          ), n = t.getSize();
          Ce(e, t.min), e.style.width = n.x + "px", e.style.height = n.y + "px";
        },
        _updateOpacity: function() {
          Qe(this._image, this.options.opacity);
        },
        _updateZIndex: function() {
          this._image && this.options.zIndex !== void 0 && this.options.zIndex !== null && (this._image.style.zIndex = this.options.zIndex);
        },
        _overlayOnError: function() {
          this.fire("error");
          var e = this.options.errorOverlayUrl;
          e && this._url !== e && (this._url = e, this._image.src = e);
        },
        // @method getCenter(): LatLng
        // Returns the center of the ImageOverlay.
        getCenter: function() {
          return this._bounds.getCenter();
        }
      }), ra = function(e, t, n) {
        return new Hi(e, t, n);
      }, ko = Hi.extend({
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
          var e = this._url.tagName === "VIDEO", t = this._image = e ? this._url : Q("video");
          if (G(t, "leaflet-image-layer"), this._zoomAnimated && G(t, "leaflet-zoom-animated"), this.options.className && G(t, this.options.className), t.onselectstart = re, t.onmousemove = re, t.onloadeddata = Z(this.fire, this, "load"), e) {
            for (var n = t.getElementsByTagName("source"), o = [], s = 0; s < n.length; s++)
              o.push(n[s].src);
            this._url = n.length > 0 ? o : [t.src];
            return;
          }
          He(this._url) || (this._url = [this._url]), !this.options.keepAspectRatio && Object.prototype.hasOwnProperty.call(t.style, "objectFit") && (t.style.objectFit = "fill"), t.autoplay = !!this.options.autoplay, t.loop = !!this.options.loop, t.muted = !!this.options.muted, t.playsInline = !!this.options.playsInline;
          for (var c = 0; c < this._url.length; c++) {
            var h = Q("source");
            h.src = this._url[c], t.appendChild(h);
          }
        }
        // @method getElement(): HTMLVideoElement
        // Returns the instance of [`HTMLVideoElement`](https://developer.mozilla.org/docs/Web/API/HTMLVideoElement)
        // used by this overlay.
      });
      function ua(e, t, n) {
        return new ko(e, t, n);
      }
      var Po = Hi.extend({
        _initImage: function() {
          var e = this._image = this._url;
          G(e, "leaflet-image-layer"), this._zoomAnimated && G(e, "leaflet-zoom-animated"), this.options.className && G(e, this.options.className), e.onselectstart = re, e.onmousemove = re;
        }
        // @method getElement(): SVGElement
        // Returns the instance of [`SVGElement`](https://developer.mozilla.org/docs/Web/API/SVGElement)
        // used by this overlay.
      });
      function ca(e, t, n) {
        return new Po(e, t, n);
      }
      var It = Pt.extend({
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
        initialize: function(e, t) {
          e && (e instanceof X || He(e)) ? (this._latlng = ie(e), de(this, t)) : (de(this, e), this._source = t), this.options.content && (this._content = this.options.content);
        },
        // @method openOn(map: Map): this
        // Adds the overlay to the map.
        // Alternative to `map.openPopup(popup)`/`.openTooltip(tooltip)`.
        openOn: function(e) {
          return e = arguments.length ? e : this._source._map, e.hasLayer(this) || e.addLayer(this), this;
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
        toggle: function(e) {
          return this._map ? this.close() : (arguments.length ? this._source = e : e = this._source, this._prepareOpen(), this.openOn(e._map)), this;
        },
        onAdd: function(e) {
          this._zoomAnimated = e._zoomAnimated, this._container || this._initLayout(), e._fadeAnimated && Qe(this._container, 0), clearTimeout(this._removeTimeout), this.getPane().appendChild(this._container), this.update(), e._fadeAnimated && Qe(this._container, 1), this.bringToFront(), this.options.interactive && (G(this._container, "leaflet-interactive"), this.addInteractiveTarget(this._container));
        },
        onRemove: function(e) {
          e._fadeAnimated ? (Qe(this._container, 0), this._removeTimeout = setTimeout(Z(fe, void 0, this._container), 200)) : fe(this._container), this.options.interactive && (ke(this._container, "leaflet-interactive"), this.removeInteractiveTarget(this._container));
        },
        // @namespace DivOverlay
        // @method getLatLng: LatLng
        // Returns the geographical point of the overlay.
        getLatLng: function() {
          return this._latlng;
        },
        // @method setLatLng(latlng: LatLng): this
        // Sets the geographical point where the overlay will open.
        setLatLng: function(e) {
          return this._latlng = ie(e), this._map && (this._updatePosition(), this._adjustPan()), this;
        },
        // @method getContent: String|HTMLElement
        // Returns the content of the overlay.
        getContent: function() {
          return this._content;
        },
        // @method setContent(htmlContent: String|HTMLElement|Function): this
        // Sets the HTML content of the overlay. If a function is passed the source layer will be passed to the function.
        // The function should return a `String` or `HTMLElement` to be used in the overlay.
        setContent: function(e) {
          return this._content = e, this.update(), this;
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
          var e = {
            zoom: this._updatePosition,
            viewreset: this._updatePosition
          };
          return this._zoomAnimated && (e.zoomanim = this._animateZoom), e;
        },
        // @method isOpen: Boolean
        // Returns `true` when the overlay is visible on the map.
        isOpen: function() {
          return !!this._map && this._map.hasLayer(this);
        },
        // @method bringToFront: this
        // Brings this overlay in front of other overlays (in the same map pane).
        bringToFront: function() {
          return this._map && mt(this._container), this;
        },
        // @method bringToBack: this
        // Brings this overlay to the back of other overlays (in the same map pane).
        bringToBack: function() {
          return this._map && _t(this._container), this;
        },
        // prepare bound overlay to open: update latlng pos / content source (for FeatureGroup)
        _prepareOpen: function(e) {
          var t = this._source;
          if (!t._map)
            return !1;
          if (t instanceof Rt) {
            t = null;
            var n = this._source._layers;
            for (var o in n)
              if (n[o]._map) {
                t = n[o];
                break;
              }
            if (!t)
              return !1;
            this._source = t;
          }
          if (!e)
            if (t.getCenter)
              e = t.getCenter();
            else if (t.getLatLng)
              e = t.getLatLng();
            else if (t.getBounds)
              e = t.getBounds().getCenter();
            else
              throw new Error("Unable to get source layer LatLng.");
          return this.setLatLng(e), this._map && this.update(), !0;
        },
        _updateContent: function() {
          if (this._content) {
            var e = this._contentNode, t = typeof this._content == "function" ? this._content(this._source || this) : this._content;
            if (typeof t == "string")
              e.innerHTML = t;
            else {
              for (; e.hasChildNodes(); )
                e.removeChild(e.firstChild);
              e.appendChild(t);
            }
            this.fire("contentupdate");
          }
        },
        _updatePosition: function() {
          if (this._map) {
            var e = this._map.latLngToLayerPoint(this._latlng), t = U(this.options.offset), n = this._getAnchor();
            this._zoomAnimated ? Ce(this._container, e.add(n)) : t = t.add(e).add(n);
            var o = this._containerBottom = -t.y, s = this._containerLeft = -Math.round(this._containerWidth / 2) + t.x;
            this._container.style.bottom = o + "px", this._container.style.left = s + "px";
          }
        },
        _getAnchor: function() {
          return [0, 0];
        }
      });
      oe.include({
        _initOverlay: function(e, t, n, o) {
          var s = t;
          return s instanceof e || (s = new e(o).setContent(t)), n && s.setLatLng(n), s;
        }
      }), Pt.include({
        _initOverlay: function(e, t, n, o) {
          var s = n;
          return s instanceof e ? (de(s, o), s._source = this) : (s = t && !o ? t : new e(o, this), s.setContent(n)), s;
        }
      });
      var Wi = It.extend({
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
        openOn: function(e) {
          return e = arguments.length ? e : this._source._map, !e.hasLayer(this) && e._popup && e._popup.options.autoClose && e.removeLayer(e._popup), e._popup = this, It.prototype.openOn.call(this, e);
        },
        onAdd: function(e) {
          It.prototype.onAdd.call(this, e), e.fire("popupopen", { popup: this }), this._source && (this._source.fire("popupopen", { popup: this }, !0), this._source instanceof en || this._source.on("preclick", Dt));
        },
        onRemove: function(e) {
          It.prototype.onRemove.call(this, e), e.fire("popupclose", { popup: this }), this._source && (this._source.fire("popupclose", { popup: this }, !0), this._source instanceof en || this._source.off("preclick", Dt));
        },
        getEvents: function() {
          var e = It.prototype.getEvents.call(this);
          return (this.options.closeOnClick !== void 0 ? this.options.closeOnClick : this._map.options.closePopupOnClick) && (e.preclick = this.close), this.options.keepInView && (e.moveend = this._adjustPan), e;
        },
        _initLayout: function() {
          var e = "leaflet-popup", t = this._container = Q(
            "div",
            e + " " + (this.options.className || "") + " leaflet-zoom-animated"
          ), n = this._wrapper = Q("div", e + "-content-wrapper", t);
          if (this._contentNode = Q("div", e + "-content", n), pn(t), hn(this._contentNode), j(t, "contextmenu", Dt), this._tipContainer = Q("div", e + "-tip-container", t), this._tip = Q("div", e + "-tip", this._tipContainer), this.options.closeButton) {
            var o = this._closeButton = Q("a", e + "-close-button", t);
            o.setAttribute("role", "button"), o.setAttribute("aria-label", "Close popup"), o.href = "#close", o.innerHTML = '<span aria-hidden="true">&#215;</span>', j(o, "click", function(s) {
              ve(s), this.close();
            }, this);
          }
        },
        _updateLayout: function() {
          var e = this._contentNode, t = e.style;
          t.width = "", t.whiteSpace = "nowrap";
          var n = e.offsetWidth;
          n = Math.min(n, this.options.maxWidth), n = Math.max(n, this.options.minWidth), t.width = n + 1 + "px", t.whiteSpace = "", t.height = "";
          var o = e.offsetHeight, s = this.options.maxHeight, c = "leaflet-popup-scrolled";
          s && o > s ? (t.height = s + "px", G(e, c)) : ke(e, c), this._containerWidth = this._container.offsetWidth;
        },
        _animateZoom: function(e) {
          var t = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center), n = this._getAnchor();
          Ce(this._container, t.add(n));
        },
        _adjustPan: function() {
          if (this.options.autoPan) {
            if (this._map._panAnim && this._map._panAnim.stop(), this._autopanning) {
              this._autopanning = !1;
              return;
            }
            var e = this._map, t = parseInt(bt(this._container, "marginBottom"), 10) || 0, n = this._container.offsetHeight + t, o = this._containerWidth, s = new F(this._containerLeft, -n - this._containerBottom);
            s._add(Me(this._container));
            var c = e.layerPointToContainerPoint(s), h = U(this.options.autoPanPadding), p = U(this.options.autoPanPaddingTopLeft || h), f = U(this.options.autoPanPaddingBottomRight || h), k = e.getSize(), z = 0, V = 0;
            c.x + o + f.x > k.x && (z = c.x + o - k.x + f.x), c.x - z - p.x < 0 && (z = c.x - p.x), c.y + n + f.y > k.y && (V = c.y + n - k.y + f.y), c.y - V - p.y < 0 && (V = c.y - p.y), (z || V) && (this.options.keepInView && (this._autopanning = !0), e.fire("autopanstart").panBy([z, V]));
          }
        },
        _getAnchor: function() {
          return U(this._source && this._source._getPopupAnchor ? this._source._getPopupAnchor() : [0, 0]);
        }
      }), da = function(e, t) {
        return new Wi(e, t);
      };
      oe.mergeOptions({
        closePopupOnClick: !0
      }), oe.include({
        // @method openPopup(popup: Popup): this
        // Opens the specified popup while closing the previously opened (to make sure only one is opened at one time for usability).
        // @alternative
        // @method openPopup(content: String|HTMLElement, latlng: LatLng, options?: Popup options): this
        // Creates a popup with the specified content and options and opens it in the given point on a map.
        openPopup: function(e, t, n) {
          return this._initOverlay(Wi, e, t, n).openOn(this), this;
        },
        // @method closePopup(popup?: Popup): this
        // Closes the popup previously opened with [openPopup](#map-openpopup) (or the given one).
        closePopup: function(e) {
          return e = arguments.length ? e : this._popup, e && e.close(), this;
        }
      }), Pt.include({
        // @method bindPopup(content: String|HTMLElement|Function|Popup, options?: Popup options): this
        // Binds a popup to the layer with the passed `content` and sets up the
        // necessary event listeners. If a `Function` is passed it will receive
        // the layer as the first argument and should return a `String` or `HTMLElement`.
        bindPopup: function(e, t) {
          return this._popup = this._initOverlay(Wi, this._popup, e, t), this._popupHandlersAdded || (this.on({
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
        openPopup: function(e) {
          return this._popup && (this instanceof Rt || (this._popup._source = this), this._popup._prepareOpen(e || this._latlng) && this._popup.openOn(this._map)), this;
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
        setPopupContent: function(e) {
          return this._popup && this._popup.setContent(e), this;
        },
        // @method getPopup(): Popup
        // Returns the popup bound to this layer.
        getPopup: function() {
          return this._popup;
        },
        _openPopup: function(e) {
          if (!(!this._popup || !this._map)) {
            kt(e);
            var t = e.layer || e.target;
            if (this._popup._source === t && !(t instanceof en)) {
              this._map.hasLayer(this._popup) ? this.closePopup() : this.openPopup(e.latlng);
              return;
            }
            this._popup._source = t, this.openPopup(e.latlng);
          }
        },
        _movePopup: function(e) {
          this._popup.setLatLng(e.latlng);
        },
        _onKeyPress: function(e) {
          e.originalEvent.keyCode === 13 && this._openPopup(e);
        }
      });
      var Gi = It.extend({
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
        onAdd: function(e) {
          It.prototype.onAdd.call(this, e), this.setOpacity(this.options.opacity), e.fire("tooltipopen", { tooltip: this }), this._source && (this.addEventParent(this._source), this._source.fire("tooltipopen", { tooltip: this }, !0));
        },
        onRemove: function(e) {
          It.prototype.onRemove.call(this, e), e.fire("tooltipclose", { tooltip: this }), this._source && (this.removeEventParent(this._source), this._source.fire("tooltipclose", { tooltip: this }, !0));
        },
        getEvents: function() {
          var e = It.prototype.getEvents.call(this);
          return this.options.permanent || (e.preclick = this.close), e;
        },
        _initLayout: function() {
          var e = "leaflet-tooltip", t = e + " " + (this.options.className || "") + " leaflet-zoom-" + (this._zoomAnimated ? "animated" : "hide");
          this._contentNode = this._container = Q("div", t), this._container.setAttribute("role", "tooltip"), this._container.setAttribute("id", "leaflet-tooltip-" + K(this));
        },
        _updateLayout: function() {
        },
        _adjustPan: function() {
        },
        _setPosition: function(e) {
          var t, n, o = this._map, s = this._container, c = o.latLngToContainerPoint(o.getCenter()), h = o.layerPointToContainerPoint(e), p = this.options.direction, f = s.offsetWidth, k = s.offsetHeight, z = U(this.options.offset), V = this._getAnchor();
          p === "top" ? (t = f / 2, n = k) : p === "bottom" ? (t = f / 2, n = 0) : p === "center" ? (t = f / 2, n = k / 2) : p === "right" ? (t = 0, n = k / 2) : p === "left" ? (t = f, n = k / 2) : h.x < c.x ? (p = "right", t = 0, n = k / 2) : (p = "left", t = f + (z.x + V.x) * 2, n = k / 2), e = e.subtract(U(t, n, !0)).add(z).add(V), ke(s, "leaflet-tooltip-right"), ke(s, "leaflet-tooltip-left"), ke(s, "leaflet-tooltip-top"), ke(s, "leaflet-tooltip-bottom"), G(s, "leaflet-tooltip-" + p), Ce(s, e);
        },
        _updatePosition: function() {
          var e = this._map.latLngToLayerPoint(this._latlng);
          this._setPosition(e);
        },
        setOpacity: function(e) {
          this.options.opacity = e, this._container && Qe(this._container, e);
        },
        _animateZoom: function(e) {
          var t = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center);
          this._setPosition(t);
        },
        _getAnchor: function() {
          return U(this._source && this._source._getTooltipAnchor && !this.options.sticky ? this._source._getTooltipAnchor() : [0, 0]);
        }
      }), ha = function(e, t) {
        return new Gi(e, t);
      };
      oe.include({
        // @method openTooltip(tooltip: Tooltip): this
        // Opens the specified tooltip.
        // @alternative
        // @method openTooltip(content: String|HTMLElement, latlng: LatLng, options?: Tooltip options): this
        // Creates a tooltip with the specified content and options and open it.
        openTooltip: function(e, t, n) {
          return this._initOverlay(Gi, e, t, n).openOn(this), this;
        },
        // @method closeTooltip(tooltip: Tooltip): this
        // Closes the tooltip given as parameter.
        closeTooltip: function(e) {
          return e.close(), this;
        }
      }), Pt.include({
        // @method bindTooltip(content: String|HTMLElement|Function|Tooltip, options?: Tooltip options): this
        // Binds a tooltip to the layer with the passed `content` and sets up the
        // necessary event listeners. If a `Function` is passed it will receive
        // the layer as the first argument and should return a `String` or `HTMLElement`.
        bindTooltip: function(e, t) {
          return this._tooltip && this.isTooltipOpen() && this.unbindTooltip(), this._tooltip = this._initOverlay(Gi, this._tooltip, e, t), this._initTooltipInteractions(), this._tooltip.options.permanent && this._map && this._map.hasLayer(this) && this.openTooltip(), this;
        },
        // @method unbindTooltip(): this
        // Removes the tooltip previously bound with `bindTooltip`.
        unbindTooltip: function() {
          return this._tooltip && (this._initTooltipInteractions(!0), this.closeTooltip(), this._tooltip = null), this;
        },
        _initTooltipInteractions: function(e) {
          if (!(!e && this._tooltipHandlersAdded)) {
            var t = e ? "off" : "on", n = {
              remove: this.closeTooltip,
              move: this._moveTooltip
            };
            this._tooltip.options.permanent ? n.add = this._openTooltip : (n.mouseover = this._openTooltip, n.mouseout = this.closeTooltip, n.click = this._openTooltip, this._map ? this._addFocusListeners() : n.add = this._addFocusListeners), this._tooltip.options.sticky && (n.mousemove = this._moveTooltip), this[t](n), this._tooltipHandlersAdded = !e;
          }
        },
        // @method openTooltip(latlng?: LatLng): this
        // Opens the bound tooltip at the specified `latlng` or at the default tooltip anchor if no `latlng` is passed.
        openTooltip: function(e) {
          return this._tooltip && (this instanceof Rt || (this._tooltip._source = this), this._tooltip._prepareOpen(e) && (this._tooltip.openOn(this._map), this.getElement ? this._setAriaDescribedByOnLayer(this) : this.eachLayer && this.eachLayer(this._setAriaDescribedByOnLayer, this))), this;
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
        setTooltipContent: function(e) {
          return this._tooltip && this._tooltip.setContent(e), this;
        },
        // @method getTooltip(): Tooltip
        // Returns the tooltip bound to this layer.
        getTooltip: function() {
          return this._tooltip;
        },
        _addFocusListeners: function() {
          this.getElement ? this._addFocusListenersOnLayer(this) : this.eachLayer && this.eachLayer(this._addFocusListenersOnLayer, this);
        },
        _addFocusListenersOnLayer: function(e) {
          var t = typeof e.getElement == "function" && e.getElement();
          t && (j(t, "focus", function() {
            this._tooltip._source = e, this.openTooltip();
          }, this), j(t, "blur", this.closeTooltip, this));
        },
        _setAriaDescribedByOnLayer: function(e) {
          var t = typeof e.getElement == "function" && e.getElement();
          t && t.setAttribute("aria-describedby", this._tooltip._container.id);
        },
        _openTooltip: function(e) {
          if (!(!this._tooltip || !this._map)) {
            if (this._map.dragging && this._map.dragging.moving() && !this._openOnceFlag) {
              this._openOnceFlag = !0;
              var t = this;
              this._map.once("moveend", function() {
                t._openOnceFlag = !1, t._openTooltip(e);
              });
              return;
            }
            this._tooltip._source = e.layer || e.target, this.openTooltip(this._tooltip.options.sticky ? e.latlng : void 0);
          }
        },
        _moveTooltip: function(e) {
          var t = e.latlng, n, o;
          this._tooltip.options.sticky && e.originalEvent && (n = this._map.mouseEventToContainerPoint(e.originalEvent), o = this._map.containerPointToLayerPoint(n), t = this._map.layerPointToLatLng(o)), this._tooltip.setLatLng(t);
        }
      });
      var Lo = $n.extend({
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
        createIcon: function(e) {
          var t = e && e.tagName === "DIV" ? e : document.createElement("div"), n = this.options;
          if (n.html instanceof Element ? (Mt(t), t.appendChild(n.html)) : t.innerHTML = n.html !== !1 ? n.html : "", n.bgPos) {
            var o = U(n.bgPos);
            t.style.backgroundPosition = -o.x + "px " + -o.y + "px";
          }
          return this._setIconStyles(t, "icon"), t;
        },
        createShadow: function() {
          return null;
        }
      });
      function pa(e) {
        return new Lo(e);
      }
      $n.Default = di;
      var hi = Pt.extend({
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
          updateWhenIdle: S.mobile,
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
        initialize: function(e) {
          de(this, e);
        },
        onAdd: function() {
          this._initContainer(), this._levels = {}, this._tiles = {}, this._resetView();
        },
        beforeAdd: function(e) {
          e._addZoomLimit(this);
        },
        onRemove: function(e) {
          this._removeAllTiles(), fe(this._container), e._removeZoomLimit(this), this._container = null, this._tileZoom = void 0;
        },
        // @method bringToFront: this
        // Brings the tile layer to the top of all tile layers.
        bringToFront: function() {
          return this._map && (mt(this._container), this._setAutoZIndex(Math.max)), this;
        },
        // @method bringToBack: this
        // Brings the tile layer to the bottom of all tile layers.
        bringToBack: function() {
          return this._map && (_t(this._container), this._setAutoZIndex(Math.min)), this;
        },
        // @method getContainer: HTMLElement
        // Returns the HTML element that contains the tiles for this layer.
        getContainer: function() {
          return this._container;
        },
        // @method setOpacity(opacity: Number): this
        // Changes the [opacity](#gridlayer-opacity) of the grid layer.
        setOpacity: function(e) {
          return this.options.opacity = e, this._updateOpacity(), this;
        },
        // @method setZIndex(zIndex: Number): this
        // Changes the [zIndex](#gridlayer-zindex) of the grid layer.
        setZIndex: function(e) {
          return this.options.zIndex = e, this._updateZIndex(), this;
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
            var e = this._clampZoom(this._map.getZoom());
            e !== this._tileZoom && (this._tileZoom = e, this._updateLevels()), this._update();
          }
          return this;
        },
        getEvents: function() {
          var e = {
            viewprereset: this._invalidateAll,
            viewreset: this._resetView,
            zoom: this._resetView,
            moveend: this._onMoveEnd
          };
          return this.options.updateWhenIdle || (this._onMove || (this._onMove = tt(this._onMoveEnd, this.options.updateInterval, this)), e.move = this._onMove), this._zoomAnimated && (e.zoomanim = this._animateZoom), e;
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
          var e = this.options.tileSize;
          return e instanceof F ? e : new F(e, e);
        },
        _updateZIndex: function() {
          this._container && this.options.zIndex !== void 0 && this.options.zIndex !== null && (this._container.style.zIndex = this.options.zIndex);
        },
        _setAutoZIndex: function(e) {
          for (var t = this.getPane().children, n = -e(-1 / 0, 1 / 0), o = 0, s = t.length, c; o < s; o++)
            c = t[o].style.zIndex, t[o] !== this._container && c && (n = e(n, +c));
          isFinite(n) && (this.options.zIndex = n + e(-1, 1), this._updateZIndex());
        },
        _updateOpacity: function() {
          if (this._map && !S.ielt9) {
            Qe(this._container, this.options.opacity);
            var e = +/* @__PURE__ */ new Date(), t = !1, n = !1;
            for (var o in this._tiles) {
              var s = this._tiles[o];
              if (!(!s.current || !s.loaded)) {
                var c = Math.min(1, (e - s.loaded) / 200);
                Qe(s.el, c), c < 1 ? t = !0 : (s.active ? n = !0 : this._onOpaqueTile(s), s.active = !0);
              }
            }
            n && !this._noPrune && this._pruneTiles(), t && (Se(this._fadeFrame), this._fadeFrame = Te(this._updateOpacity, this));
          }
        },
        _onOpaqueTile: re,
        _initContainer: function() {
          this._container || (this._container = Q("div", "leaflet-layer " + (this.options.className || "")), this._updateZIndex(), this.options.opacity < 1 && this._updateOpacity(), this.getPane().appendChild(this._container));
        },
        _updateLevels: function() {
          var e = this._tileZoom, t = this.options.maxZoom;
          if (e !== void 0) {
            for (var n in this._levels)
              n = Number(n), this._levels[n].el.children.length || n === e ? (this._levels[n].el.style.zIndex = t - Math.abs(e - n), this._onUpdateLevel(n)) : (fe(this._levels[n].el), this._removeTilesAtZoom(n), this._onRemoveLevel(n), delete this._levels[n]);
            var o = this._levels[e], s = this._map;
            return o || (o = this._levels[e] = {}, o.el = Q("div", "leaflet-tile-container leaflet-zoom-animated", this._container), o.el.style.zIndex = t, o.origin = s.project(s.unproject(s.getPixelOrigin()), e).round(), o.zoom = e, this._setZoomTransform(o, s.getCenter(), s.getZoom()), re(o.el.offsetWidth), this._onCreateLevel(o)), this._level = o, o;
          }
        },
        _onUpdateLevel: re,
        _onRemoveLevel: re,
        _onCreateLevel: re,
        _pruneTiles: function() {
          if (this._map) {
            var e, t, n = this._map.getZoom();
            if (n > this.options.maxZoom || n < this.options.minZoom) {
              this._removeAllTiles();
              return;
            }
            for (e in this._tiles)
              t = this._tiles[e], t.retain = t.current;
            for (e in this._tiles)
              if (t = this._tiles[e], t.current && !t.active) {
                var o = t.coords;
                this._retainParent(o.x, o.y, o.z, o.z - 5) || this._retainChildren(o.x, o.y, o.z, o.z + 2);
              }
            for (e in this._tiles)
              this._tiles[e].retain || this._removeTile(e);
          }
        },
        _removeTilesAtZoom: function(e) {
          for (var t in this._tiles)
            this._tiles[t].coords.z === e && this._removeTile(t);
        },
        _removeAllTiles: function() {
          for (var e in this._tiles)
            this._removeTile(e);
        },
        _invalidateAll: function() {
          for (var e in this._levels)
            fe(this._levels[e].el), this._onRemoveLevel(Number(e)), delete this._levels[e];
          this._removeAllTiles(), this._tileZoom = void 0;
        },
        _retainParent: function(e, t, n, o) {
          var s = Math.floor(e / 2), c = Math.floor(t / 2), h = n - 1, p = new F(+s, +c);
          p.z = +h;
          var f = this._tileCoordsToKey(p), k = this._tiles[f];
          return k && k.active ? (k.retain = !0, !0) : (k && k.loaded && (k.retain = !0), h > o ? this._retainParent(s, c, h, o) : !1);
        },
        _retainChildren: function(e, t, n, o) {
          for (var s = 2 * e; s < 2 * e + 2; s++)
            for (var c = 2 * t; c < 2 * t + 2; c++) {
              var h = new F(s, c);
              h.z = n + 1;
              var p = this._tileCoordsToKey(h), f = this._tiles[p];
              if (f && f.active) {
                f.retain = !0;
                continue;
              } else f && f.loaded && (f.retain = !0);
              n + 1 < o && this._retainChildren(s, c, n + 1, o);
            }
        },
        _resetView: function(e) {
          var t = e && (e.pinch || e.flyTo);
          this._setView(this._map.getCenter(), this._map.getZoom(), t, t);
        },
        _animateZoom: function(e) {
          this._setView(e.center, e.zoom, !0, e.noUpdate);
        },
        _clampZoom: function(e) {
          var t = this.options;
          return t.minNativeZoom !== void 0 && e < t.minNativeZoom ? t.minNativeZoom : t.maxNativeZoom !== void 0 && t.maxNativeZoom < e ? t.maxNativeZoom : e;
        },
        _setView: function(e, t, n, o) {
          var s = Math.round(t);
          this.options.maxZoom !== void 0 && s > this.options.maxZoom || this.options.minZoom !== void 0 && s < this.options.minZoom ? s = void 0 : s = this._clampZoom(s);
          var c = this.options.updateWhenZooming && s !== this._tileZoom;
          (!o || c) && (this._tileZoom = s, this._abortLoading && this._abortLoading(), this._updateLevels(), this._resetGrid(), s !== void 0 && this._update(e), n || this._pruneTiles(), this._noPrune = !!n), this._setZoomTransforms(e, t);
        },
        _setZoomTransforms: function(e, t) {
          for (var n in this._levels)
            this._setZoomTransform(this._levels[n], e, t);
        },
        _setZoomTransform: function(e, t, n) {
          var o = this._map.getZoomScale(n, e.zoom), s = e.origin.multiplyBy(o).subtract(this._map._getNewPixelOrigin(t, n)).round();
          S.any3d ? zt(e.el, s, o) : Ce(e.el, s);
        },
        _resetGrid: function() {
          var e = this._map, t = e.options.crs, n = this._tileSize = this.getTileSize(), o = this._tileZoom, s = this._map.getPixelWorldBounds(this._tileZoom);
          s && (this._globalTileRange = this._pxBoundsToTileRange(s)), this._wrapX = t.wrapLng && !this.options.noWrap && [
            Math.floor(e.project([0, t.wrapLng[0]], o).x / n.x),
            Math.ceil(e.project([0, t.wrapLng[1]], o).x / n.y)
          ], this._wrapY = t.wrapLat && !this.options.noWrap && [
            Math.floor(e.project([t.wrapLat[0], 0], o).y / n.x),
            Math.ceil(e.project([t.wrapLat[1], 0], o).y / n.y)
          ];
        },
        _onMoveEnd: function() {
          !this._map || this._map._animatingZoom || this._update();
        },
        _getTiledPixelBounds: function(e) {
          var t = this._map, n = t._animatingZoom ? Math.max(t._animateToZoom, t.getZoom()) : t.getZoom(), o = t.getZoomScale(n, this._tileZoom), s = t.project(e, this._tileZoom).floor(), c = t.getSize().divideBy(o * 2);
          return new y(s.subtract(c), s.add(c));
        },
        // Private method to load tiles in the grid's active zoom level according to map bounds
        _update: function(e) {
          var t = this._map;
          if (t) {
            var n = this._clampZoom(t.getZoom());
            if (e === void 0 && (e = t.getCenter()), this._tileZoom !== void 0) {
              var o = this._getTiledPixelBounds(e), s = this._pxBoundsToTileRange(o), c = s.getCenter(), h = [], p = this.options.keepBuffer, f = new y(
                s.getBottomLeft().subtract([p, -p]),
                s.getTopRight().add([p, -p])
              );
              if (!(isFinite(s.min.x) && isFinite(s.min.y) && isFinite(s.max.x) && isFinite(s.max.y)))
                throw new Error("Attempted to load an infinite number of tiles");
              for (var k in this._tiles) {
                var z = this._tiles[k].coords;
                (z.z !== this._tileZoom || !f.contains(new F(z.x, z.y))) && (this._tiles[k].current = !1);
              }
              if (Math.abs(n - this._tileZoom) > 1) {
                this._setView(e, n);
                return;
              }
              for (var V = s.min.y; V <= s.max.y; V++)
                for (var te = s.min.x; te <= s.max.x; te++) {
                  var Ke = new F(te, V);
                  if (Ke.z = this._tileZoom, !!this._isValidTile(Ke)) {
                    var Ue = this._tiles[this._tileCoordsToKey(Ke)];
                    Ue ? Ue.current = !0 : h.push(Ke);
                  }
                }
              if (h.sort(function(et, Wn) {
                return et.distanceTo(c) - Wn.distanceTo(c);
              }), h.length !== 0) {
                this._loading || (this._loading = !0, this.fire("loading"));
                var gt = document.createDocumentFragment();
                for (te = 0; te < h.length; te++)
                  this._addTile(h[te], gt);
                this._level.el.appendChild(gt);
              }
            }
          }
        },
        _isValidTile: function(e) {
          var t = this._map.options.crs;
          if (!t.infinite) {
            var n = this._globalTileRange;
            if (!t.wrapLng && (e.x < n.min.x || e.x > n.max.x) || !t.wrapLat && (e.y < n.min.y || e.y > n.max.y))
              return !1;
          }
          if (!this.options.bounds)
            return !0;
          var o = this._tileCoordsToBounds(e);
          return ne(this.options.bounds).overlaps(o);
        },
        _keyToBounds: function(e) {
          return this._tileCoordsToBounds(this._keyToTileCoords(e));
        },
        _tileCoordsToNwSe: function(e) {
          var t = this._map, n = this.getTileSize(), o = e.scaleBy(n), s = o.add(n), c = t.unproject(o, e.z), h = t.unproject(s, e.z);
          return [c, h];
        },
        // converts tile coordinates to its geographical bounds
        _tileCoordsToBounds: function(e) {
          var t = this._tileCoordsToNwSe(e), n = new b(t[0], t[1]);
          return this.options.noWrap || (n = this._map.wrapLatLngBounds(n)), n;
        },
        // converts tile coordinates to key for the tile cache
        _tileCoordsToKey: function(e) {
          return e.x + ":" + e.y + ":" + e.z;
        },
        // converts tile cache key to coordinates
        _keyToTileCoords: function(e) {
          var t = e.split(":"), n = new F(+t[0], +t[1]);
          return n.z = +t[2], n;
        },
        _removeTile: function(e) {
          var t = this._tiles[e];
          t && (fe(t.el), delete this._tiles[e], this.fire("tileunload", {
            tile: t.el,
            coords: this._keyToTileCoords(e)
          }));
        },
        _initTile: function(e) {
          G(e, "leaflet-tile");
          var t = this.getTileSize();
          e.style.width = t.x + "px", e.style.height = t.y + "px", e.onselectstart = re, e.onmousemove = re, S.ielt9 && this.options.opacity < 1 && Qe(e, this.options.opacity);
        },
        _addTile: function(e, t) {
          var n = this._getTilePos(e), o = this._tileCoordsToKey(e), s = this.createTile(this._wrapCoords(e), Z(this._tileReady, this, e));
          this._initTile(s), this.createTile.length < 2 && Te(Z(this._tileReady, this, e, null, s)), Ce(s, n), this._tiles[o] = {
            el: s,
            coords: e,
            current: !0
          }, t.appendChild(s), this.fire("tileloadstart", {
            tile: s,
            coords: e
          });
        },
        _tileReady: function(e, t, n) {
          t && this.fire("tileerror", {
            error: t,
            tile: n,
            coords: e
          });
          var o = this._tileCoordsToKey(e);
          n = this._tiles[o], n && (n.loaded = +/* @__PURE__ */ new Date(), this._map._fadeAnimated ? (Qe(n.el, 0), Se(this._fadeFrame), this._fadeFrame = Te(this._updateOpacity, this)) : (n.active = !0, this._pruneTiles()), t || (G(n.el, "leaflet-tile-loaded"), this.fire("tileload", {
            tile: n.el,
            coords: e
          })), this._noTilesToLoad() && (this._loading = !1, this.fire("load"), S.ielt9 || !this._map._fadeAnimated ? Te(this._pruneTiles, this) : setTimeout(Z(this._pruneTiles, this), 250)));
        },
        _getTilePos: function(e) {
          return e.scaleBy(this.getTileSize()).subtract(this._level.origin);
        },
        _wrapCoords: function(e) {
          var t = new F(
            this._wrapX ? se(e.x, this._wrapX) : e.x,
            this._wrapY ? se(e.y, this._wrapY) : e.y
          );
          return t.z = e.z, t;
        },
        _pxBoundsToTileRange: function(e) {
          var t = this.getTileSize();
          return new y(
            e.min.unscaleBy(t).floor(),
            e.max.unscaleBy(t).ceil().subtract([1, 1])
          );
        },
        _noTilesToLoad: function() {
          for (var e in this._tiles)
            if (!this._tiles[e].loaded)
              return !1;
          return !0;
        }
      });
      function fa(e) {
        return new hi(e);
      }
      var Hn = hi.extend({
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
        initialize: function(e, t) {
          this._url = e, t = de(this, t), t.detectRetina && S.retina && t.maxZoom > 0 ? (t.tileSize = Math.floor(t.tileSize / 2), t.zoomReverse ? (t.zoomOffset--, t.minZoom = Math.min(t.maxZoom, t.minZoom + 1)) : (t.zoomOffset++, t.maxZoom = Math.max(t.minZoom, t.maxZoom - 1)), t.minZoom = Math.max(0, t.minZoom)) : t.zoomReverse ? t.minZoom = Math.min(t.maxZoom, t.minZoom) : t.maxZoom = Math.max(t.minZoom, t.maxZoom), typeof t.subdomains == "string" && (t.subdomains = t.subdomains.split("")), this.on("tileunload", this._onTileRemove);
        },
        // @method setUrl(url: String, noRedraw?: Boolean): this
        // Updates the layer's URL template and redraws it (unless `noRedraw` is set to `true`).
        // If the URL does not change, the layer will not be redrawn unless
        // the noRedraw parameter is set to false.
        setUrl: function(e, t) {
          return this._url === e && t === void 0 && (t = !0), this._url = e, t || this.redraw(), this;
        },
        // @method createTile(coords: Object, done?: Function): HTMLElement
        // Called only internally, overrides GridLayer's [`createTile()`](#gridlayer-createtile)
        // to return an `<img>` HTML element with the appropriate image URL given `coords`. The `done`
        // callback is called when the tile has been loaded.
        createTile: function(e, t) {
          var n = document.createElement("img");
          return j(n, "load", Z(this._tileOnLoad, this, t, n)), j(n, "error", Z(this._tileOnError, this, t, n)), (this.options.crossOrigin || this.options.crossOrigin === "") && (n.crossOrigin = this.options.crossOrigin === !0 ? "" : this.options.crossOrigin), typeof this.options.referrerPolicy == "string" && (n.referrerPolicy = this.options.referrerPolicy), n.alt = "", n.src = this.getTileUrl(e), n;
        },
        // @section Extension methods
        // @uninheritable
        // Layers extending `TileLayer` might reimplement the following method.
        // @method getTileUrl(coords: Object): String
        // Called only internally, returns the URL for a tile given its coordinates.
        // Classes extending `TileLayer` can override this function to provide custom tile URL naming schemes.
        getTileUrl: function(e) {
          var t = {
            r: S.retina ? "@2x" : "",
            s: this._getSubdomain(e),
            x: e.x,
            y: e.y,
            z: this._getZoomForUrl()
          };
          if (this._map && !this._map.options.crs.infinite) {
            var n = this._globalTileRange.max.y - e.y;
            this.options.tms && (t.y = n), t["-y"] = n;
          }
          return Lt(this._url, I(t, this.options));
        },
        _tileOnLoad: function(e, t) {
          S.ielt9 ? setTimeout(Z(e, this, null, t), 0) : e(null, t);
        },
        _tileOnError: function(e, t, n) {
          var o = this.options.errorTileUrl;
          o && t.getAttribute("src") !== o && (t.src = o), e(n, t);
        },
        _onTileRemove: function(e) {
          e.tile.onload = null;
        },
        _getZoomForUrl: function() {
          var e = this._tileZoom, t = this.options.maxZoom, n = this.options.zoomReverse, o = this.options.zoomOffset;
          return n && (e = t - e), e + o;
        },
        _getSubdomain: function(e) {
          var t = Math.abs(e.x + e.y) % this.options.subdomains.length;
          return this.options.subdomains[t];
        },
        // stops loading all tiles in the background layer
        _abortLoading: function() {
          var e, t;
          for (e in this._tiles)
            if (this._tiles[e].coords.z !== this._tileZoom && (t = this._tiles[e].el, t.onload = re, t.onerror = re, !t.complete)) {
              t.src = ct;
              var n = this._tiles[e].coords;
              fe(t), delete this._tiles[e], this.fire("tileabort", {
                tile: t,
                coords: n
              });
            }
        },
        _removeTile: function(e) {
          var t = this._tiles[e];
          if (t)
            return t.el.setAttribute("src", ct), hi.prototype._removeTile.call(this, e);
        },
        _tileReady: function(e, t, n) {
          if (!(!this._map || n && n.getAttribute("src") === ct))
            return hi.prototype._tileReady.call(this, e, t, n);
        }
      });
      function To(e, t) {
        return new Hn(e, t);
      }
      var So = Hn.extend({
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
        initialize: function(e, t) {
          this._url = e;
          var n = I({}, this.defaultWmsParams);
          for (var o in t)
            o in this.options || (n[o] = t[o]);
          t = de(this, t);
          var s = t.detectRetina && S.retina ? 2 : 1, c = this.getTileSize();
          n.width = c.x * s, n.height = c.y * s, this.wmsParams = n;
        },
        onAdd: function(e) {
          this._crs = this.options.crs || e.options.crs, this._wmsVersion = parseFloat(this.wmsParams.version);
          var t = this._wmsVersion >= 1.3 ? "crs" : "srs";
          this.wmsParams[t] = this._crs.code, Hn.prototype.onAdd.call(this, e);
        },
        getTileUrl: function(e) {
          var t = this._tileCoordsToNwSe(e), n = this._crs, o = T(n.project(t[0]), n.project(t[1])), s = o.min, c = o.max, h = (this._wmsVersion >= 1.3 && this._crs === ze ? [s.y, s.x, c.y, c.x] : [s.x, s.y, c.x, c.y]).join(","), p = Hn.prototype.getTileUrl.call(this, e);
          return p + Wt(this.wmsParams, p, this.options.uppercase) + (this.options.uppercase ? "&BBOX=" : "&bbox=") + h;
        },
        // @method setParams(params: Object, noRedraw?: Boolean): this
        // Merges an object with the new parameters and re-requests tiles on the current screen (unless `noRedraw` was set to true).
        setParams: function(e, t) {
          return I(this.wmsParams, e), t || this.redraw(), this;
        }
      });
      function ma(e, t) {
        return new So(e, t);
      }
      Hn.WMS = So, To.wms = ma;
      var Ut = Pt.extend({
        // @section
        // @aka Renderer options
        options: {
          // @option padding: Number = 0.1
          // How much to extend the clip area around the map view (relative to its size)
          // e.g. 0.1 would be 10% of map view in each direction
          padding: 0.1
        },
        initialize: function(e) {
          de(this, e), K(this), this._layers = this._layers || {};
        },
        onAdd: function() {
          this._container || (this._initContainer(), G(this._container, "leaflet-zoom-animated")), this.getPane().appendChild(this._container), this._update(), this.on("update", this._updatePaths, this);
        },
        onRemove: function() {
          this.off("update", this._updatePaths, this), this._destroyContainer();
        },
        getEvents: function() {
          var e = {
            viewreset: this._reset,
            zoom: this._onZoom,
            moveend: this._update,
            zoomend: this._onZoomEnd
          };
          return this._zoomAnimated && (e.zoomanim = this._onAnimZoom), e;
        },
        _onAnimZoom: function(e) {
          this._updateTransform(e.center, e.zoom);
        },
        _onZoom: function() {
          this._updateTransform(this._map.getCenter(), this._map.getZoom());
        },
        _updateTransform: function(e, t) {
          var n = this._map.getZoomScale(t, this._zoom), o = this._map.getSize().multiplyBy(0.5 + this.options.padding), s = this._map.project(this._center, t), c = o.multiplyBy(-n).add(s).subtract(this._map._getNewPixelOrigin(e, t));
          S.any3d ? zt(this._container, c, n) : Ce(this._container, c);
        },
        _reset: function() {
          this._update(), this._updateTransform(this._center, this._zoom);
          for (var e in this._layers)
            this._layers[e]._reset();
        },
        _onZoomEnd: function() {
          for (var e in this._layers)
            this._layers[e]._project();
        },
        _updatePaths: function() {
          for (var e in this._layers)
            this._layers[e]._update();
        },
        _update: function() {
          var e = this.options.padding, t = this._map.getSize(), n = this._map.containerPointToLayerPoint(t.multiplyBy(-e)).round();
          this._bounds = new y(n, n.add(t.multiplyBy(1 + e * 2)).round()), this._center = this._map.getCenter(), this._zoom = this._map.getZoom();
        }
      }), Co = Ut.extend({
        // @section
        // @aka Canvas options
        options: {
          // @option tolerance: Number = 0
          // How much to extend the click tolerance around a path/object on the map.
          tolerance: 0
        },
        getEvents: function() {
          var e = Ut.prototype.getEvents.call(this);
          return e.viewprereset = this._onViewPreReset, e;
        },
        _onViewPreReset: function() {
          this._postponeUpdatePaths = !0;
        },
        onAdd: function() {
          Ut.prototype.onAdd.call(this), this._draw();
        },
        _initContainer: function() {
          var e = this._container = document.createElement("canvas");
          j(e, "mousemove", this._onMouseMove, this), j(e, "click dblclick mousedown mouseup contextmenu", this._onClick, this), j(e, "mouseout", this._handleMouseOut, this), e._leaflet_disable_events = !0, this._ctx = e.getContext("2d");
        },
        _destroyContainer: function() {
          Se(this._redrawRequest), delete this._ctx, fe(this._container), Y(this._container), delete this._container;
        },
        _updatePaths: function() {
          if (!this._postponeUpdatePaths) {
            var e;
            this._redrawBounds = null;
            for (var t in this._layers)
              e = this._layers[t], e._update();
            this._redraw();
          }
        },
        _update: function() {
          if (!(this._map._animatingZoom && this._bounds)) {
            Ut.prototype._update.call(this);
            var e = this._bounds, t = this._container, n = e.getSize(), o = S.retina ? 2 : 1;
            Ce(t, e.min), t.width = o * n.x, t.height = o * n.y, t.style.width = n.x + "px", t.style.height = n.y + "px", S.retina && this._ctx.scale(2, 2), this._ctx.translate(-e.min.x, -e.min.y), this.fire("update");
          }
        },
        _reset: function() {
          Ut.prototype._reset.call(this), this._postponeUpdatePaths && (this._postponeUpdatePaths = !1, this._updatePaths());
        },
        _initPath: function(e) {
          this._updateDashArray(e), this._layers[K(e)] = e;
          var t = e._order = {
            layer: e,
            prev: this._drawLast,
            next: null
          };
          this._drawLast && (this._drawLast.next = t), this._drawLast = t, this._drawFirst = this._drawFirst || this._drawLast;
        },
        _addPath: function(e) {
          this._requestRedraw(e);
        },
        _removePath: function(e) {
          var t = e._order, n = t.next, o = t.prev;
          n ? n.prev = o : this._drawLast = o, o ? o.next = n : this._drawFirst = n, delete e._order, delete this._layers[K(e)], this._requestRedraw(e);
        },
        _updatePath: function(e) {
          this._extendRedrawBounds(e), e._project(), e._update(), this._requestRedraw(e);
        },
        _updateStyle: function(e) {
          this._updateDashArray(e), this._requestRedraw(e);
        },
        _updateDashArray: function(e) {
          if (typeof e.options.dashArray == "string") {
            var t = e.options.dashArray.split(/[, ]+/), n = [], o, s;
            for (s = 0; s < t.length; s++) {
              if (o = Number(t[s]), isNaN(o))
                return;
              n.push(o);
            }
            e.options._dashArray = n;
          } else
            e.options._dashArray = e.options.dashArray;
        },
        _requestRedraw: function(e) {
          this._map && (this._extendRedrawBounds(e), this._redrawRequest = this._redrawRequest || Te(this._redraw, this));
        },
        _extendRedrawBounds: function(e) {
          if (e._pxBounds) {
            var t = (e.options.weight || 0) + 1;
            this._redrawBounds = this._redrawBounds || new y(), this._redrawBounds.extend(e._pxBounds.min.subtract([t, t])), this._redrawBounds.extend(e._pxBounds.max.add([t, t]));
          }
        },
        _redraw: function() {
          this._redrawRequest = null, this._redrawBounds && (this._redrawBounds.min._floor(), this._redrawBounds.max._ceil()), this._clear(), this._draw(), this._redrawBounds = null;
        },
        _clear: function() {
          var e = this._redrawBounds;
          if (e) {
            var t = e.getSize();
            this._ctx.clearRect(e.min.x, e.min.y, t.x, t.y);
          } else
            this._ctx.save(), this._ctx.setTransform(1, 0, 0, 1, 0, 0), this._ctx.clearRect(0, 0, this._container.width, this._container.height), this._ctx.restore();
        },
        _draw: function() {
          var e, t = this._redrawBounds;
          if (this._ctx.save(), t) {
            var n = t.getSize();
            this._ctx.beginPath(), this._ctx.rect(t.min.x, t.min.y, n.x, n.y), this._ctx.clip();
          }
          this._drawing = !0;
          for (var o = this._drawFirst; o; o = o.next)
            e = o.layer, (!t || e._pxBounds && e._pxBounds.intersects(t)) && e._updatePath();
          this._drawing = !1, this._ctx.restore();
        },
        _updatePoly: function(e, t) {
          if (this._drawing) {
            var n, o, s, c, h = e._parts, p = h.length, f = this._ctx;
            if (p) {
              for (f.beginPath(), n = 0; n < p; n++) {
                for (o = 0, s = h[n].length; o < s; o++)
                  c = h[n][o], f[o ? "lineTo" : "moveTo"](c.x, c.y);
                t && f.closePath();
              }
              this._fillStroke(f, e);
            }
          }
        },
        _updateCircle: function(e) {
          if (!(!this._drawing || e._empty())) {
            var t = e._point, n = this._ctx, o = Math.max(Math.round(e._radius), 1), s = (Math.max(Math.round(e._radiusY), 1) || o) / o;
            s !== 1 && (n.save(), n.scale(1, s)), n.beginPath(), n.arc(t.x, t.y / s, o, 0, Math.PI * 2, !1), s !== 1 && n.restore(), this._fillStroke(n, e);
          }
        },
        _fillStroke: function(e, t) {
          var n = t.options;
          n.fill && (e.globalAlpha = n.fillOpacity, e.fillStyle = n.fillColor || n.color, e.fill(n.fillRule || "evenodd")), n.stroke && n.weight !== 0 && (e.setLineDash && e.setLineDash(t.options && t.options._dashArray || []), e.globalAlpha = n.opacity, e.lineWidth = n.weight, e.strokeStyle = n.color, e.lineCap = n.lineCap, e.lineJoin = n.lineJoin, e.stroke());
        },
        // Canvas obviously doesn't have mouse events for individual drawn objects,
        // so we emulate that by calculating what's under the mouse on mousemove/click manually
        _onClick: function(e) {
          for (var t = this._map.mouseEventToLayerPoint(e), n, o, s = this._drawFirst; s; s = s.next)
            n = s.layer, n.options.interactive && n._containsPoint(t) && (!(e.type === "click" || e.type === "preclick") || !this._map._draggableMoved(n)) && (o = n);
          this._fireEvent(o ? [o] : !1, e);
        },
        _onMouseMove: function(e) {
          if (!(!this._map || this._map.dragging.moving() || this._map._animatingZoom)) {
            var t = this._map.mouseEventToLayerPoint(e);
            this._handleMouseHover(e, t);
          }
        },
        _handleMouseOut: function(e) {
          var t = this._hoveredLayer;
          t && (ke(this._container, "leaflet-interactive"), this._fireEvent([t], e, "mouseout"), this._hoveredLayer = null, this._mouseHoverThrottled = !1);
        },
        _handleMouseHover: function(e, t) {
          if (!this._mouseHoverThrottled) {
            for (var n, o, s = this._drawFirst; s; s = s.next)
              n = s.layer, n.options.interactive && n._containsPoint(t) && (o = n);
            o !== this._hoveredLayer && (this._handleMouseOut(e), o && (G(this._container, "leaflet-interactive"), this._fireEvent([o], e, "mouseover"), this._hoveredLayer = o)), this._fireEvent(this._hoveredLayer ? [this._hoveredLayer] : !1, e), this._mouseHoverThrottled = !0, setTimeout(Z(function() {
              this._mouseHoverThrottled = !1;
            }, this), 32);
          }
        },
        _fireEvent: function(e, t, n) {
          this._map._fireDOMEvent(t, n || t.type, e);
        },
        _bringToFront: function(e) {
          var t = e._order;
          if (t) {
            var n = t.next, o = t.prev;
            if (n)
              n.prev = o;
            else
              return;
            o ? o.next = n : n && (this._drawFirst = n), t.prev = this._drawLast, this._drawLast.next = t, t.next = null, this._drawLast = t, this._requestRedraw(e);
          }
        },
        _bringToBack: function(e) {
          var t = e._order;
          if (t) {
            var n = t.next, o = t.prev;
            if (o)
              o.next = n;
            else
              return;
            n ? n.prev = o : o && (this._drawLast = o), t.prev = null, t.next = this._drawFirst, this._drawFirst.prev = t, this._drawFirst = t, this._requestRedraw(e);
          }
        }
      });
      function Mo(e) {
        return S.canvas ? new Co(e) : null;
      }
      var pi = (function() {
        try {
          return document.namespaces.add("lvml", "urn:schemas-microsoft-com:vml"), function(e) {
            return document.createElement("<lvml:" + e + ' class="lvml">');
          };
        } catch {
        }
        return function(e) {
          return document.createElement("<" + e + ' xmlns="urn:schemas-microsoft.com:vml" class="lvml">');
        };
      })(), _a = {
        _initContainer: function() {
          this._container = Q("div", "leaflet-vml-container");
        },
        _update: function() {
          this._map._animatingZoom || (Ut.prototype._update.call(this), this.fire("update"));
        },
        _initPath: function(e) {
          var t = e._container = pi("shape");
          G(t, "leaflet-vml-shape " + (this.options.className || "")), t.coordsize = "1 1", e._path = pi("path"), t.appendChild(e._path), this._updateStyle(e), this._layers[K(e)] = e;
        },
        _addPath: function(e) {
          var t = e._container;
          this._container.appendChild(t), e.options.interactive && e.addInteractiveTarget(t);
        },
        _removePath: function(e) {
          var t = e._container;
          fe(t), e.removeInteractiveTarget(t), delete this._layers[K(e)];
        },
        _updateStyle: function(e) {
          var t = e._stroke, n = e._fill, o = e.options, s = e._container;
          s.stroked = !!o.stroke, s.filled = !!o.fill, o.stroke ? (t || (t = e._stroke = pi("stroke")), s.appendChild(t), t.weight = o.weight + "px", t.color = o.color, t.opacity = o.opacity, o.dashArray ? t.dashStyle = He(o.dashArray) ? o.dashArray.join(" ") : o.dashArray.replace(/( *, *)/g, " ") : t.dashStyle = "", t.endcap = o.lineCap.replace("butt", "flat"), t.joinstyle = o.lineJoin) : t && (s.removeChild(t), e._stroke = null), o.fill ? (n || (n = e._fill = pi("fill")), s.appendChild(n), n.color = o.fillColor || o.color, n.opacity = o.fillOpacity) : n && (s.removeChild(n), e._fill = null);
        },
        _updateCircle: function(e) {
          var t = e._point.round(), n = Math.round(e._radius), o = Math.round(e._radiusY || n);
          this._setPath(e, e._empty() ? "M0 0" : "AL " + t.x + "," + t.y + " " + n + "," + o + " 0," + 65535 * 360);
        },
        _setPath: function(e, t) {
          e._path.v = t;
        },
        _bringToFront: function(e) {
          mt(e._container);
        },
        _bringToBack: function(e) {
          _t(e._container);
        }
      }, ji = S.vml ? pi : Kt, fi = Ut.extend({
        _initContainer: function() {
          this._container = ji("svg"), this._container.setAttribute("pointer-events", "none"), this._rootGroup = ji("g"), this._container.appendChild(this._rootGroup);
        },
        _destroyContainer: function() {
          fe(this._container), Y(this._container), delete this._container, delete this._rootGroup, delete this._svgSize;
        },
        _update: function() {
          if (!(this._map._animatingZoom && this._bounds)) {
            Ut.prototype._update.call(this);
            var e = this._bounds, t = e.getSize(), n = this._container;
            (!this._svgSize || !this._svgSize.equals(t)) && (this._svgSize = t, n.setAttribute("width", t.x), n.setAttribute("height", t.y)), Ce(n, e.min), n.setAttribute("viewBox", [e.min.x, e.min.y, t.x, t.y].join(" ")), this.fire("update");
          }
        },
        // methods below are called by vector layers implementations
        _initPath: function(e) {
          var t = e._path = ji("path");
          e.options.className && G(t, e.options.className), e.options.interactive && G(t, "leaflet-interactive"), this._updateStyle(e), this._layers[K(e)] = e;
        },
        _addPath: function(e) {
          this._rootGroup || this._initContainer(), this._rootGroup.appendChild(e._path), e.addInteractiveTarget(e._path);
        },
        _removePath: function(e) {
          fe(e._path), e.removeInteractiveTarget(e._path), delete this._layers[K(e)];
        },
        _updatePath: function(e) {
          e._project(), e._update();
        },
        _updateStyle: function(e) {
          var t = e._path, n = e.options;
          t && (n.stroke ? (t.setAttribute("stroke", n.color), t.setAttribute("stroke-opacity", n.opacity), t.setAttribute("stroke-width", n.weight), t.setAttribute("stroke-linecap", n.lineCap), t.setAttribute("stroke-linejoin", n.lineJoin), n.dashArray ? t.setAttribute("stroke-dasharray", n.dashArray) : t.removeAttribute("stroke-dasharray"), n.dashOffset ? t.setAttribute("stroke-dashoffset", n.dashOffset) : t.removeAttribute("stroke-dashoffset")) : t.setAttribute("stroke", "none"), n.fill ? (t.setAttribute("fill", n.fillColor || n.color), t.setAttribute("fill-opacity", n.fillOpacity), t.setAttribute("fill-rule", n.fillRule || "evenodd")) : t.setAttribute("fill", "none"));
        },
        _updatePoly: function(e, t) {
          this._setPath(e, $e(e._parts, t));
        },
        _updateCircle: function(e) {
          var t = e._point, n = Math.max(Math.round(e._radius), 1), o = Math.max(Math.round(e._radiusY), 1) || n, s = "a" + n + "," + o + " 0 1,0 ", c = e._empty() ? "M0 0" : "M" + (t.x - n) + "," + t.y + s + n * 2 + ",0 " + s + -n * 2 + ",0 ";
          this._setPath(e, c);
        },
        _setPath: function(e, t) {
          e._path.setAttribute("d", t);
        },
        // SVG does not have the concept of zIndex so we resort to changing the DOM order of elements
        _bringToFront: function(e) {
          mt(e._path);
        },
        _bringToBack: function(e) {
          _t(e._path);
        }
      });
      S.vml && fi.include(_a);
      function zo(e) {
        return S.svg || S.vml ? new fi(e) : null;
      }
      oe.include({
        // @namespace Map; @method getRenderer(layer: Path): Renderer
        // Returns the instance of `Renderer` that should be used to render the given
        // `Path`. It will ensure that the `renderer` options of the map and paths
        // are respected, and that the renderers do exist on the map.
        getRenderer: function(e) {
          var t = e.options.renderer || this._getPaneRenderer(e.options.pane) || this.options.renderer || this._renderer;
          return t || (t = this._renderer = this._createRenderer()), this.hasLayer(t) || this.addLayer(t), t;
        },
        _getPaneRenderer: function(e) {
          if (e === "overlayPane" || e === void 0)
            return !1;
          var t = this._paneRenderers[e];
          return t === void 0 && (t = this._createRenderer({ pane: e }), this._paneRenderers[e] = t), t;
        },
        _createRenderer: function(e) {
          return this.options.preferCanvas && Mo(e) || zo(e);
        }
      });
      var Eo = Un.extend({
        initialize: function(e, t) {
          Un.prototype.initialize.call(this, this._boundsToLatLngs(e), t);
        },
        // @method setBounds(latLngBounds: LatLngBounds): this
        // Redraws the rectangle with the passed bounds.
        setBounds: function(e) {
          return this.setLatLngs(this._boundsToLatLngs(e));
        },
        _boundsToLatLngs: function(e) {
          return e = ne(e), [
            e.getSouthWest(),
            e.getNorthWest(),
            e.getNorthEast(),
            e.getSouthEast()
          ];
        }
      });
      function va(e, t) {
        return new Eo(e, t);
      }
      fi.create = ji, fi.pointsToPath = $e, $t.geometryToLayer = Vi, $t.coordsToLatLng = mo, $t.coordsToLatLngs = $i, $t.latLngToCoords = _o, $t.latLngsToCoords = Ui, $t.getFeature = Fn, $t.asFeature = Fi, oe.mergeOptions({
        // @option boxZoom: Boolean = true
        // Whether the map can be zoomed to a rectangular area specified by
        // dragging the mouse while pressing the shift key.
        boxZoom: !0
      });
      var Oo = rt.extend({
        initialize: function(e) {
          this._map = e, this._container = e._container, this._pane = e._panes.overlayPane, this._resetStateTimeout = 0, e.on("unload", this._destroy, this);
        },
        addHooks: function() {
          j(this._container, "mousedown", this._onMouseDown, this);
        },
        removeHooks: function() {
          Y(this._container, "mousedown", this._onMouseDown, this);
        },
        moved: function() {
          return this._moved;
        },
        _destroy: function() {
          fe(this._pane), delete this._pane;
        },
        _resetState: function() {
          this._resetStateTimeout = 0, this._moved = !1;
        },
        _clearDeferredResetState: function() {
          this._resetStateTimeout !== 0 && (clearTimeout(this._resetStateTimeout), this._resetStateTimeout = 0);
        },
        _onMouseDown: function(e) {
          if (!e.shiftKey || e.which !== 1 && e.button !== 1)
            return !1;
          this._clearDeferredResetState(), this._resetState(), Et(), cn(), this._startPoint = this._map.mouseEventToContainerPoint(e), j(document, {
            contextmenu: kt,
            mousemove: this._onMouseMove,
            mouseup: this._onMouseUp,
            keydown: this._onKeyDown
          }, this);
        },
        _onMouseMove: function(e) {
          this._moved || (this._moved = !0, this._box = Q("div", "leaflet-zoom-box", this._container), G(this._container, "leaflet-crosshair"), this._map.fire("boxzoomstart")), this._point = this._map.mouseEventToContainerPoint(e);
          var t = new y(this._point, this._startPoint), n = t.getSize();
          Ce(this._box, t.min), this._box.style.width = n.x + "px", this._box.style.height = n.y + "px";
        },
        _finish: function() {
          this._moved && (fe(this._box), ke(this._container, "leaflet-crosshair")), wt(), In(), Y(document, {
            contextmenu: kt,
            mousemove: this._onMouseMove,
            mouseup: this._onMouseUp,
            keydown: this._onKeyDown
          }, this);
        },
        _onMouseUp: function(e) {
          if (!(e.which !== 1 && e.button !== 1) && (this._finish(), !!this._moved)) {
            this._clearDeferredResetState(), this._resetStateTimeout = setTimeout(Z(this._resetState, this), 0);
            var t = new b(
              this._map.containerPointToLatLng(this._startPoint),
              this._map.containerPointToLatLng(this._point)
            );
            this._map.fitBounds(t).fire("boxzoomend", { boxZoomBounds: t });
          }
        },
        _onKeyDown: function(e) {
          e.keyCode === 27 && (this._finish(), this._clearDeferredResetState(), this._resetState());
        }
      });
      oe.addInitHook("addHandler", "boxZoom", Oo), oe.mergeOptions({
        // @option doubleClickZoom: Boolean|String = true
        // Whether the map can be zoomed in by double clicking on it and
        // zoomed out by double clicking while holding shift. If passed
        // `'center'`, double-click zoom will zoom to the center of the
        //  view regardless of where the mouse was.
        doubleClickZoom: !0
      });
      var Ao = rt.extend({
        addHooks: function() {
          this._map.on("dblclick", this._onDoubleClick, this);
        },
        removeHooks: function() {
          this._map.off("dblclick", this._onDoubleClick, this);
        },
        _onDoubleClick: function(e) {
          var t = this._map, n = t.getZoom(), o = t.options.zoomDelta, s = e.originalEvent.shiftKey ? n - o : n + o;
          t.options.doubleClickZoom === "center" ? t.setZoom(s) : t.setZoomAround(e.containerPoint, s);
        }
      });
      oe.addInitHook("addHandler", "doubleClickZoom", Ao), oe.mergeOptions({
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
      var Io = rt.extend({
        addHooks: function() {
          if (!this._draggable) {
            var e = this._map;
            this._draggable = new At(e._mapPane, e._container), this._draggable.on({
              dragstart: this._onDragStart,
              drag: this._onDrag,
              dragend: this._onDragEnd
            }, this), this._draggable.on("predrag", this._onPreDragLimit, this), e.options.worldCopyJump && (this._draggable.on("predrag", this._onPreDragWrap, this), e.on("zoomend", this._onZoomEnd, this), e.whenReady(this._onZoomEnd, this));
          }
          G(this._map._container, "leaflet-grab leaflet-touch-drag"), this._draggable.enable(), this._positions = [], this._times = [];
        },
        removeHooks: function() {
          ke(this._map._container, "leaflet-grab"), ke(this._map._container, "leaflet-touch-drag"), this._draggable.disable();
        },
        moved: function() {
          return this._draggable && this._draggable._moved;
        },
        moving: function() {
          return this._draggable && this._draggable._moving;
        },
        _onDragStart: function() {
          var e = this._map;
          if (e._stop(), this._map.options.maxBounds && this._map.options.maxBoundsViscosity) {
            var t = ne(this._map.options.maxBounds);
            this._offsetLimit = T(
              this._map.latLngToContainerPoint(t.getNorthWest()).multiplyBy(-1),
              this._map.latLngToContainerPoint(t.getSouthEast()).multiplyBy(-1).add(this._map.getSize())
            ), this._viscosity = Math.min(1, Math.max(0, this._map.options.maxBoundsViscosity));
          } else
            this._offsetLimit = null;
          e.fire("movestart").fire("dragstart"), e.options.inertia && (this._positions = [], this._times = []);
        },
        _onDrag: function(e) {
          if (this._map.options.inertia) {
            var t = this._lastTime = +/* @__PURE__ */ new Date(), n = this._lastPos = this._draggable._absPos || this._draggable._newPos;
            this._positions.push(n), this._times.push(t), this._prunePositions(t);
          }
          this._map.fire("move", e).fire("drag", e);
        },
        _prunePositions: function(e) {
          for (; this._positions.length > 1 && e - this._times[0] > 50; )
            this._positions.shift(), this._times.shift();
        },
        _onZoomEnd: function() {
          var e = this._map.getSize().divideBy(2), t = this._map.latLngToLayerPoint([0, 0]);
          this._initialWorldOffset = t.subtract(e).x, this._worldWidth = this._map.getPixelWorldBounds().getSize().x;
        },
        _viscousLimit: function(e, t) {
          return e - (e - t) * this._viscosity;
        },
        _onPreDragLimit: function() {
          if (!(!this._viscosity || !this._offsetLimit)) {
            var e = this._draggable._newPos.subtract(this._draggable._startPos), t = this._offsetLimit;
            e.x < t.min.x && (e.x = this._viscousLimit(e.x, t.min.x)), e.y < t.min.y && (e.y = this._viscousLimit(e.y, t.min.y)), e.x > t.max.x && (e.x = this._viscousLimit(e.x, t.max.x)), e.y > t.max.y && (e.y = this._viscousLimit(e.y, t.max.y)), this._draggable._newPos = this._draggable._startPos.add(e);
          }
        },
        _onPreDragWrap: function() {
          var e = this._worldWidth, t = Math.round(e / 2), n = this._initialWorldOffset, o = this._draggable._newPos.x, s = (o - t + n) % e + t - n, c = (o + t + n) % e - t - n, h = Math.abs(s + n) < Math.abs(c + n) ? s : c;
          this._draggable._absPos = this._draggable._newPos.clone(), this._draggable._newPos.x = h;
        },
        _onDragEnd: function(e) {
          var t = this._map, n = t.options, o = !n.inertia || e.noInertia || this._times.length < 2;
          if (t.fire("dragend", e), o)
            t.fire("moveend");
          else {
            this._prunePositions(+/* @__PURE__ */ new Date());
            var s = this._lastPos.subtract(this._positions[0]), c = (this._lastTime - this._times[0]) / 1e3, h = n.easeLinearity, p = s.multiplyBy(h / c), f = p.distanceTo([0, 0]), k = Math.min(n.inertiaMaxSpeed, f), z = p.multiplyBy(k / f), V = k / (n.inertiaDeceleration * h), te = z.multiplyBy(-V / 2).round();
            !te.x && !te.y ? t.fire("moveend") : (te = t._limitOffset(te, t.options.maxBounds), Te(function() {
              t.panBy(te, {
                duration: V,
                easeLinearity: h,
                noMoveStart: !0,
                animate: !0
              });
            }));
          }
        }
      });
      oe.addInitHook("addHandler", "dragging", Io), oe.mergeOptions({
        // @option keyboard: Boolean = true
        // Makes the map focusable and allows users to navigate the map with keyboard
        // arrows and `+`/`-` keys.
        keyboard: !0,
        // @option keyboardPanDelta: Number = 80
        // Amount of pixels to pan when pressing an arrow key.
        keyboardPanDelta: 80
      });
      var Bo = rt.extend({
        keyCodes: {
          left: [37],
          right: [39],
          down: [40],
          up: [38],
          zoomIn: [187, 107, 61, 171],
          zoomOut: [189, 109, 54, 173]
        },
        initialize: function(e) {
          this._map = e, this._setPanDelta(e.options.keyboardPanDelta), this._setZoomDelta(e.options.zoomDelta);
        },
        addHooks: function() {
          var e = this._map._container;
          e.tabIndex <= 0 && (e.tabIndex = "0"), j(e, {
            focus: this._onFocus,
            blur: this._onBlur,
            mousedown: this._onMouseDown
          }, this), this._map.on({
            focus: this._addHooks,
            blur: this._removeHooks
          }, this);
        },
        removeHooks: function() {
          this._removeHooks(), Y(this._map._container, {
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
            var e = document.body, t = document.documentElement, n = e.scrollTop || t.scrollTop, o = e.scrollLeft || t.scrollLeft;
            this._map._container.focus(), window.scrollTo(o, n);
          }
        },
        _onFocus: function() {
          this._focused = !0, this._map.fire("focus");
        },
        _onBlur: function() {
          this._focused = !1, this._map.fire("blur");
        },
        _setPanDelta: function(e) {
          var t = this._panKeys = {}, n = this.keyCodes, o, s;
          for (o = 0, s = n.left.length; o < s; o++)
            t[n.left[o]] = [-1 * e, 0];
          for (o = 0, s = n.right.length; o < s; o++)
            t[n.right[o]] = [e, 0];
          for (o = 0, s = n.down.length; o < s; o++)
            t[n.down[o]] = [0, e];
          for (o = 0, s = n.up.length; o < s; o++)
            t[n.up[o]] = [0, -1 * e];
        },
        _setZoomDelta: function(e) {
          var t = this._zoomKeys = {}, n = this.keyCodes, o, s;
          for (o = 0, s = n.zoomIn.length; o < s; o++)
            t[n.zoomIn[o]] = e;
          for (o = 0, s = n.zoomOut.length; o < s; o++)
            t[n.zoomOut[o]] = -e;
        },
        _addHooks: function() {
          j(document, "keydown", this._onKeyDown, this);
        },
        _removeHooks: function() {
          Y(document, "keydown", this._onKeyDown, this);
        },
        _onKeyDown: function(e) {
          if (!(e.altKey || e.ctrlKey || e.metaKey)) {
            var t = e.keyCode, n = this._map, o;
            if (t in this._panKeys) {
              if (!n._panAnim || !n._panAnim._inProgress)
                if (o = this._panKeys[t], e.shiftKey && (o = U(o).multiplyBy(3)), n.options.maxBounds && (o = n._limitOffset(U(o), n.options.maxBounds)), n.options.worldCopyJump) {
                  var s = n.wrapLatLng(n.unproject(n.project(n.getCenter()).add(o)));
                  n.panTo(s);
                } else
                  n.panBy(o);
            } else if (t in this._zoomKeys)
              n.setZoom(n.getZoom() + (e.shiftKey ? 3 : 1) * this._zoomKeys[t]);
            else if (t === 27 && n._popup && n._popup.options.closeOnEscapeKey)
              n.closePopup();
            else
              return;
            kt(e);
          }
        }
      });
      oe.addInitHook("addHandler", "keyboard", Bo), oe.mergeOptions({
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
      var Zo = rt.extend({
        addHooks: function() {
          j(this._map._container, "wheel", this._onWheelScroll, this), this._delta = 0;
        },
        removeHooks: function() {
          Y(this._map._container, "wheel", this._onWheelScroll, this);
        },
        _onWheelScroll: function(e) {
          var t = _n(e), n = this._map.options.wheelDebounceTime;
          this._delta += t, this._lastMousePos = this._map.mouseEventToContainerPoint(e), this._startTime || (this._startTime = +/* @__PURE__ */ new Date());
          var o = Math.max(n - (+/* @__PURE__ */ new Date() - this._startTime), 0);
          clearTimeout(this._timer), this._timer = setTimeout(Z(this._performZoom, this), o), kt(e);
        },
        _performZoom: function() {
          var e = this._map, t = e.getZoom(), n = this._map.options.zoomSnap || 0;
          e._stop();
          var o = this._delta / (this._map.options.wheelPxPerZoomLevel * 4), s = 4 * Math.log(2 / (1 + Math.exp(-Math.abs(o)))) / Math.LN2, c = n ? Math.ceil(s / n) * n : s, h = e._limitZoom(t + (this._delta > 0 ? c : -c)) - t;
          this._delta = 0, this._startTime = null, h && (e.options.scrollWheelZoom === "center" ? e.setZoom(t + h) : e.setZoomAround(this._lastMousePos, t + h));
        }
      });
      oe.addInitHook("addHandler", "scrollWheelZoom", Zo);
      var ga = 600;
      oe.mergeOptions({
        // @section Touch interaction options
        // @option tapHold: Boolean
        // Enables simulation of `contextmenu` event, default is `true` for mobile Safari.
        tapHold: S.touchNative && S.safari && S.mobile,
        // @option tapTolerance: Number = 15
        // The max number of pixels a user can shift his finger during touch
        // for it to be considered a valid tap.
        tapTolerance: 15
      });
      var No = rt.extend({
        addHooks: function() {
          j(this._map._container, "touchstart", this._onDown, this);
        },
        removeHooks: function() {
          Y(this._map._container, "touchstart", this._onDown, this);
        },
        _onDown: function(e) {
          if (clearTimeout(this._holdTimeout), e.touches.length === 1) {
            var t = e.touches[0];
            this._startPos = this._newPos = new F(t.clientX, t.clientY), this._holdTimeout = setTimeout(Z(function() {
              this._cancel(), this._isTapValid() && (j(document, "touchend", ve), j(document, "touchend touchcancel", this._cancelClickPrevent), this._simulateEvent("contextmenu", t));
            }, this), ga), j(document, "touchend touchcancel contextmenu", this._cancel, this), j(document, "touchmove", this._onMove, this);
          }
        },
        _cancelClickPrevent: function e() {
          Y(document, "touchend", ve), Y(document, "touchend touchcancel", e);
        },
        _cancel: function() {
          clearTimeout(this._holdTimeout), Y(document, "touchend touchcancel contextmenu", this._cancel, this), Y(document, "touchmove", this._onMove, this);
        },
        _onMove: function(e) {
          var t = e.touches[0];
          this._newPos = new F(t.clientX, t.clientY);
        },
        _isTapValid: function() {
          return this._newPos.distanceTo(this._startPos) <= this._map.options.tapTolerance;
        },
        _simulateEvent: function(e, t) {
          var n = new MouseEvent(e, {
            bubbles: !0,
            cancelable: !0,
            view: window,
            // detail: 1,
            screenX: t.screenX,
            screenY: t.screenY,
            clientX: t.clientX,
            clientY: t.clientY
            // button: 2,
            // buttons: 2
          });
          n._simulated = !0, t.target.dispatchEvent(n);
        }
      });
      oe.addInitHook("addHandler", "tapHold", No), oe.mergeOptions({
        // @section Touch interaction options
        // @option touchZoom: Boolean|String = *
        // Whether the map can be zoomed by touch-dragging with two fingers. If
        // passed `'center'`, it will zoom to the center of the view regardless of
        // where the touch events (fingers) were. Enabled for touch-capable web
        // browsers.
        touchZoom: S.touch,
        // @option bounceAtZoomLimits: Boolean = true
        // Set it to false if you don't want the map to zoom beyond min/max zoom
        // and then bounce back when pinch-zooming.
        bounceAtZoomLimits: !0
      });
      var Do = rt.extend({
        addHooks: function() {
          G(this._map._container, "leaflet-touch-zoom"), j(this._map._container, "touchstart", this._onTouchStart, this);
        },
        removeHooks: function() {
          ke(this._map._container, "leaflet-touch-zoom"), Y(this._map._container, "touchstart", this._onTouchStart, this);
        },
        _onTouchStart: function(e) {
          var t = this._map;
          if (!(!e.touches || e.touches.length !== 2 || t._animatingZoom || this._zooming)) {
            var n = t.mouseEventToContainerPoint(e.touches[0]), o = t.mouseEventToContainerPoint(e.touches[1]);
            this._centerPoint = t.getSize()._divideBy(2), this._startLatLng = t.containerPointToLatLng(this._centerPoint), t.options.touchZoom !== "center" && (this._pinchStartLatLng = t.containerPointToLatLng(n.add(o)._divideBy(2))), this._startDist = n.distanceTo(o), this._startZoom = t.getZoom(), this._moved = !1, this._zooming = !0, t._stop(), j(document, "touchmove", this._onTouchMove, this), j(document, "touchend touchcancel", this._onTouchEnd, this), ve(e);
          }
        },
        _onTouchMove: function(e) {
          if (!(!e.touches || e.touches.length !== 2 || !this._zooming)) {
            var t = this._map, n = t.mouseEventToContainerPoint(e.touches[0]), o = t.mouseEventToContainerPoint(e.touches[1]), s = n.distanceTo(o) / this._startDist;
            if (this._zoom = t.getScaleZoom(s, this._startZoom), !t.options.bounceAtZoomLimits && (this._zoom < t.getMinZoom() && s < 1 || this._zoom > t.getMaxZoom() && s > 1) && (this._zoom = t._limitZoom(this._zoom)), t.options.touchZoom === "center") {
              if (this._center = this._startLatLng, s === 1)
                return;
            } else {
              var c = n._add(o)._divideBy(2)._subtract(this._centerPoint);
              if (s === 1 && c.x === 0 && c.y === 0)
                return;
              this._center = t.unproject(t.project(this._pinchStartLatLng, this._zoom).subtract(c), this._zoom);
            }
            this._moved || (t._moveStart(!0, !1), this._moved = !0), Se(this._animRequest);
            var h = Z(t._move, t, this._center, this._zoom, { pinch: !0, round: !1 }, void 0);
            this._animRequest = Te(h, this, !0), ve(e);
          }
        },
        _onTouchEnd: function() {
          if (!this._moved || !this._zooming) {
            this._zooming = !1;
            return;
          }
          this._zooming = !1, Se(this._animRequest), Y(document, "touchmove", this._onTouchMove, this), Y(document, "touchend touchcancel", this._onTouchEnd, this), this._map.options.zoomAnimation ? this._map._animateZoom(this._center, this._map._limitZoom(this._zoom), !0, this._map.options.zoomSnap) : this._map._resetView(this._center, this._map._limitZoom(this._zoom));
        }
      });
      oe.addInitHook("addHandler", "touchZoom", Do), oe.BoxZoom = Oo, oe.DoubleClickZoom = Ao, oe.Drag = Io, oe.Keyboard = Bo, oe.ScrollWheelZoom = Zo, oe.TapHold = No, oe.TouchZoom = Do, a.Bounds = y, a.Browser = S, a.CRS = dt, a.Canvas = Co, a.Circle = fo, a.CircleMarker = Ri, a.Class = nt, a.Control = lt, a.DivIcon = Lo, a.DivOverlay = It, a.DomEvent = ro, a.DomUtil = lo, a.Draggable = At, a.Evented = Tt, a.FeatureGroup = Rt, a.GeoJSON = $t, a.GridLayer = hi, a.Handler = rt, a.Icon = $n, a.ImageOverlay = Hi, a.LatLng = X, a.LatLngBounds = b, a.Layer = Pt, a.LayerGroup = Vn, a.LineUtil = Ni, a.Map = oe, a.Marker = Di, a.Mixin = w, a.Path = en, a.Point = F, a.PolyUtil = po, a.Polygon = Un, a.Polyline = Vt, a.Popup = Wi, a.PosAnimation = Qt, a.Projection = ge, a.Rectangle = Eo, a.Renderer = Ut, a.SVG = fi, a.SVGOverlay = Po, a.TileLayer = Hn, a.Tooltip = Gi, a.Transformation = Je, a.Util = Gt, a.VideoOverlay = ko, a.bind = Z, a.bounds = T, a.canvas = Mo, a.circle = oa, a.circleMarker = ia, a.control = vn, a.divIcon = pa, a.extend = I, a.featureGroup = ea, a.geoJSON = xo, a.geoJson = la, a.gridLayer = fa, a.icon = ta, a.imageOverlay = ra, a.latLng = ie, a.latLngBounds = ne, a.layerGroup = Qo, a.map = uo, a.marker = na, a.point = U, a.polygon = sa, a.polyline = aa, a.popup = da, a.rectangle = va, a.setOptions = de, a.stamp = K, a.svg = zo, a.svgOverlay = ca, a.tileLayer = To, a.tooltip = ha, a.transformation = qt, a.version = Re, a.videoOverlay = ua;
      var ya = window.L;
      a.noConflict = function() {
        return window.L = ya, this;
      }, window.L = a;
    }));
  })(_i, _i.exports)), _i.exports;
}
var Ba = Ia();
const D = /* @__PURE__ */ Oa(Ba), Ho = (me, g) => Yi.global.t(me, {});
function tn(me) {
  const g = String(me?.message || me || "");
  return /connection refused|Unavailable|actively refused|dial tcp|ECONNREFUSED|LIFE is unavailable|life unavailable|502|503/i.test(g) ? Ho("life.kit.notReady") : g || Ho("life.kit.actionFailed");
}
const Yo = (me) => new Promise((g) => setTimeout(g, me)), Jo = 3200;
async function Ft(me, g = {}) {
  let a = null;
  for (let Re = 0; Re < 3; Re++)
    try {
      const I = await fetch("/api/life/companion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: me, payload: g })
      });
      if (!I.ok) throw Error(await I.text() || String(I.status));
      return await I.json().catch(() => ({}));
    } catch (I) {
      a = I;
      const Fe = /connection refused|Unavailable|actively refused|dial tcp|ECONNREFUSED|502|503|life unavailable/i.test(String(I?.message || I));
      if (Re < 2 && Fe) {
        await Yo(1200);
        continue;
      }
      throw I;
    }
  throw a;
}
async function Wo(me = "/api/life/companion") {
  const g = await fetch(me);
  if (!g.ok) throw Error(await g.text() || String(g.status));
  return g.json();
}
function Xo(me) {
  const g = `.${me}`;
  return `
${g}{
  --r-xs:10px; --r-sm:14px; --r-md:20px; --r-lg:28px; --r-xl:36px;
  --spring:cubic-bezier(.2,.9,.25,1.15);
  height:100%;overflow-y:auto;padding:var(--space-xl) var(--space-xl) 96px;
  background:var(--md-surface);color:var(--md-on-surface);
  max-width:1240px;margin:0 auto;
}
${g} h1,${g} h2,${g} h3,${g} h4{margin:0;letter-spacing:-.01em}
${g} .eyebrow{margin:0 0 8px;color:var(--md-primary);font:700 12px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.18em}
${g} .eyebrow b{font-size:9px}

/* Hero */
${g} .hero{position:relative;border-radius:var(--r-xl);padding:28px 28px 22px;margin-bottom:22px;
  background:linear-gradient(135deg,var(--md-primary-container),var(--md-surface-container-high) 70%);
  color:var(--md-on-surface);box-shadow:var(--shadow-1);overflow:hidden}
${g} .hero::after{content:'';position:absolute;right:-60px;top:-60px;width:220px;height:220px;border-radius:50%;
  background:radial-gradient(circle,color-mix(in srgb,var(--md-primary) 34%,transparent),transparent 68%);pointer-events:none}
${g} .hero-main{display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;align-items:flex-start;position:relative;z-index:1}
${g} .hero-copy h1{font-size:clamp(26px,3.4vw,40px);font-weight:800}
${g} .sub{margin:8px 0 0;max-width:620px;font-size:14px;line-height:1.6;color:var(--md-on-surface-variant)}
${g} .hero-actions{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
${g} .fab{height:52px;padding:0 22px;border:0;border-radius:18px;background:var(--md-primary);color:var(--md-on-primary,#fff);
  font:700 14px/1 inherit;display:inline-flex;align-items:center;gap:10px;cursor:pointer;box-shadow:0 6px 18px color-mix(in srgb,var(--md-primary) 34%,transparent);
  transition:transform .28s var(--spring),box-shadow .28s}
@media (hover: hover) and (pointer: fine){${g} .fab:hover:not(:disabled){transform:translateY(-2px) scale(1.02)}}
${g} .fab:disabled{opacity:.6;cursor:not-allowed}
${g} .fab-ic{font-size:17px}
${g} .state-row{position:relative;z-index:1;display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;align-items:center}
${g} .pill{padding:6px 14px;border-radius:999px;background:color-mix(in srgb,var(--md-surface-container-lowest) 70%,transparent);font-size:13px;font-weight:700}
${g} .pill.soft{font-weight:500;color:var(--md-on-surface-variant)}
${g} .pill.bad{background:var(--md-warning-container);color:var(--md-on-warning-container)}

${g} .banner{padding:12px 16px;border-radius:var(--r-sm);font-size:13px;margin:0 0 16px}
${g} .banner.err{background:var(--md-error-container);color:var(--md-on-error-container)}
${g} .banner.ok{background:var(--md-primary-container);color:var(--md-on-primary-container)}

/* Tabs */
${g} .tabs{display:flex;gap:8px;overflow-x:auto;padding:6px 4px 14px;margin-bottom:6px;scrollbar-width:thin}
${g} .tab{flex:0 0 auto;display:inline-flex;align-items:center;gap:8px;height:44px;padding:0 18px;border:1px solid var(--md-outline-variant);
  border-radius:999px;background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font:700 13px/1 inherit;cursor:pointer;
  transition:background .25s,color .25s,transform .25s var(--spring)}
${g} .tab i{font-style:normal;font:700 12px/1 ui-monospace,monospace;opacity:.6}
${g} .tab-ic{font-size:14px}
${g} .tab:hover{background:var(--md-surface-container-high)}
${g} .tab.active{background:var(--md-primary);color:var(--md-on-primary,#fff);border-color:transparent;transform:translateY(-1px);
  box-shadow:0 6px 16px color-mix(in srgb,var(--md-primary) 30%,transparent)}
${g} .tab.active i{opacity:.85}

${g} .panel{animation:fade .32s var(--spring)}
@keyframes fade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
/* The v-show panels are permanently mounted, so the entrance animation only
   plays on first paint. A page that switches tabs replays it by toggling this
   class (distinct keyframes, otherwise re-adding the same computed animation
   would not restart it). See CompanionPage replayPanel(). */
${g} .panel-replay{animation:fadeReplay .32s var(--spring)}
@keyframes fadeReplay{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
${g} .section-head{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap;margin:8px 0 18px}
${g} .section-head h2{font-size:22px;font-weight:800}
${g} .desc{margin:6px 0 0;font-size:13px;color:var(--md-on-surface-variant);max-width:720px;line-height:1.55}
${g} .head-actions{display:flex;gap:8px;flex-wrap:wrap;align-items:center}

/* Buttons */
${g} .btn{height:40px;padding:0 16px;border:1px solid transparent;border-radius:999px;font:700 13px/1 inherit;cursor:pointer;
  display:inline-flex;align-items:center;justify-content:center;gap:8px;transition:transform .22s var(--spring),background .22s,box-shadow .22s}
${g} .btn.sm{height:34px;padding:0 14px;font-size:13px}
${g} .btn:disabled{opacity:.5;cursor:not-allowed}
@media (hover: hover) and (pointer: fine){${g} .btn:hover:not(:disabled){transform:translateY(-1px)}}
${g} .btn.filled{background:var(--md-primary);color:var(--md-on-primary,#fff)}
${g} .btn.tonic{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
${g} .btn.text{background:transparent;color:var(--md-primary)}
${g} .btn.danger{background:var(--md-error-container);color:var(--md-on-error-container)}
${g} .link{border:0;background:transparent;color:var(--md-primary);font:700 12px/1 inherit;cursor:pointer;padding:4px}

/* Cards */
${g} .card{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--r-lg);padding:20px;margin-bottom:16px}
${g} .card > h3{font-size:16px;font-weight:750;margin-bottom:14px;display:flex;align-items:center;gap:8px;flex-wrap:wrap}
${g} .card.sub{padding:16px;margin-bottom:0}
/* minmax(0, 1fr) rather than 1fr: a bare 1fr track has an auto minimum, so one
   child with a large min-content width (a long model id, a URL) blows the track
   past the container instead of shrinking. */
${g} .grid2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;align-items:start}
${g} .grid3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;align-items:start}
${g} .sub-label{margin:16px 0 8px;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--md-on-surface-variant)}
${g} .hint{font-size:12px;color:var(--md-on-surface-variant);line-height:1.55;margin:6px 0}
${g} .meta{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}
${g} .empty{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant)}

/* Fields */
${g} .field{width:100%;height:48px;padding:0 16px;border:1px solid var(--md-outline-variant);border-radius:var(--r-sm);
  background:var(--md-surface-container-high);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none;transition:border-color .2s,box-shadow .2s}
${g} .field:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 14%,transparent)}
${g} .field.tiny{width:104px;height:38px;padding:0 12px;font-size:13px}
${g} .switches{display:flex;gap:16px;flex-wrap:wrap;margin:8px 0}
${g} .sw{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:var(--md-on-surface-variant);cursor:pointer}
${g} .sw input{width:18px;height:18px;accent-color:var(--md-primary)}
${g} .settings-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px}
${g} .settings-grid label{display:flex;flex-direction:column;gap:4px;font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}
${g} .settings-grid .field{height:40px}
${g} .fld{display:flex;flex-direction:column;gap:4px;font-size:12px;font-weight:600;color:var(--md-on-surface-variant);min-width:180px}

/* Chips / status */
${g} .count-pill{margin-left:auto;flex:0 0 auto;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);border-radius:999px;padding:3px 10px;font-size:12px;font-weight:700}
${g} .count-pill.ok{background:var(--md-success-container);color:var(--md-on-success-container,#0d3b1e)}
${g} .actions-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:8px}

/* Feed list (adapters, routes, commitments …) */
${g} .feed{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:10px}
${g} .feed > li{padding:14px 16px;border-radius:var(--r-md);background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 60%,transparent)}
${g} .feed > li.empty{background:none;border:0}

/* Material 3 Expressive align.
 *
 * Read this block as the source of truth for in-host sizing. These #app-prefixed
 * rules are (1,2,0) and supersede the base layer above, so the base .field
 * height/radius/background, .btn height, .field.tiny height and
 * .settings-grid .field height never render while the page is mounted in the
 * host. The base values are kept on purpose as the standalone fallback for a
 * page rendered without an #app ancestor — they are not dead, just shadowed.
 *
 * (No backticks in these comments: the whole sheet is a JS template literal.) */
#app ${g} .card{border-color:color-mix(in srgb,var(--md-outline-variant) 55%,transparent);background:var(--md-surface-container-low);box-shadow:var(--shadow-1)}
#app ${g} .field{height:52px;border-radius:16px;border-color:transparent;background:var(--md-surface-container-high)}
#app ${g} .field:focus{border-color:var(--md-primary);background:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}
#app ${g} .field.tiny{height:40px}
#app ${g} .settings-grid .field{height:44px}
#app ${g} .btn{height:44px;padding:0 20px}
#app ${g} .btn.sm{height:36px;padding:0 15px}

/* Theme-specific overrides key off html[data-theme] — the darkmode plugin's
   toggle — not prefers-color-scheme, so a manual light/dark choice in Settings
   is honored (the injected CSS is global, so html-level selectors are fine). */
@media (prefers-reduced-motion: reduce){
  ${g} .panel{animation:none}
  ${g} .panel-replay{animation:none}
  ${g} .fab,${g} .btn,${g} .tab{transition:none}
  ${g} .fab:hover:not(:disabled),${g} .btn:hover:not(:disabled),${g} .tab.active{transform:none}
}
html[data-theme="dark"] ${g} .pill.bad{background:#5a2d00;color:#ffd7b0}
@media(max-width:820px){${g} .grid2,${g} .grid3{grid-template-columns:1fr}}
@media(max-width:560px){${g}{padding:var(--space-lg) var(--space-lg) 80px}${g} .hero{padding:20px}${g} .hero-actions{width:100%}}
`;
}
function Za(me, g) {
  if (typeof document > "u" || document.getElementById(me)) return;
  const a = document.createElement("style");
  a.id = me, a.textContent = g, document.head.appendChild(a);
}
const Na = { class: "lsp" }, Da = { class: "hero" }, Ra = { class: "hero-main" }, Va = { class: "hero-copy" }, $a = { class: "sub" }, Ua = { class: "hero-actions" }, Fa = ["disabled"], Ha = { class: "state-row" }, Wa = { class: "pill soft" }, Ga = { class: "pill soft" }, ja = { class: "pill soft" }, qa = {
  key: 0,
  class: "banner err"
}, Ka = {
  key: 1,
  class: "banner ok"
}, Ya = {
  key: 2,
  class: "card empty"
}, Ja = { class: "card" }, Xa = { class: "count-pill" }, Qa = {
  key: 0,
  class: "empty"
}, es = {
  key: 1,
  class: "feed"
}, ts = { class: "adapter-row" }, ns = { class: "pill muted" }, is = {
  class: "meta",
  style: { "margin-top": "6px" }
}, os = { class: "pill soft" }, as = { class: "meta" }, ss = {
  key: 0,
  class: "hint",
  style: { color: "var(--md-error,#b3261e)" }
}, ls = { class: "adapter-actions" }, rs = ["disabled", "onClick"], us = ["onClick"], cs = ["disabled", "onClick"], ds = { class: "settings-grid" }, hs = { key: 0 }, ps = ["placeholder"], fs = ["placeholder"], ms = ["placeholder"], _s = ["placeholder"], vs = ["placeholder"], gs = { class: "hint" }, ys = {
  class: "sw",
  style: { "margin-top": "12px" }
}, bs = {
  class: "sw",
  style: { "margin-top": "12px" }
}, ws = {
  key: 0,
  class: "hint platform-note"
}, xs = { class: "editor-actions" }, ks = ["disabled"], Ps = { class: "card" }, Ls = { class: "hint" }, Ts = { class: "idx" }, Ss = { class: "to" }, Cs = { style: { "margin-left": "auto", display: "flex", gap: "8px" } }, Ms = ["disabled", "aria-label", "title", "onClick"], zs = ["disabled", "aria-label", "title", "onClick"], Es = ["aria-label", "onClick"], Os = {
  key: 0,
  class: "empty"
}, As = {
  class: "settings-grid",
  style: { "margin-top": "14px" }
}, Is = ["placeholder"], Bs = { class: "actions-row" }, Zs = {
  class: "fld",
  style: { "margin-left": "auto" }
}, Ns = ["disabled"], Go = "life-plugin-adapters-style", Ds = /* @__PURE__ */ qo({
  __name: "AdapterSettingsPage",
  setup(me) {
    const { confirm: g } = Ko(), a = (y, T) => Yi.global.t(y, T ?? {}), Re = $(!0), I = $(""), Fe = $("");
    function Z(y) {
      Fe.value = y, setTimeout(() => {
        Fe.value === y && (Fe.value = "");
      }, Jo);
    }
    const Pe = $([]), K = $([]), tt = $([]), se = $(!1), re = $(null), W = $(Ye()), Ht = $(null);
    function Ye() {
      return {
        id: "",
        name: "",
        platform: "aiocqhttp",
        enabled: !0,
        direction: "reverse",
        ws_path: "/ws",
        ws_host: "127.0.0.1",
        ws_port: 6199,
        ws_token: "",
        http_url: "",
        access_token: "",
        config_id: "default",
        trigger_keywords: "",
        observe_group: !0
      };
    }
    function de(y) {
      return K.value.find((T) => T.id === y) || { id: y };
    }
    function Wt(y) {
      const T = de(y.id);
      return y.enabled ? T.connected ? { label: a("life.adapters.stateConnected", { n: T.clients || 0 }), tone: "ok" } : T.running ? {
        label: a(y.direction === "connect" ? "life.adapters.stateConnecting" : "life.adapters.stateWaiting"),
        tone: "wait"
      } : { label: T.error ? a("life.adapters.stateFailed") : a("life.adapters.stateIdle"), tone: "bad" } : { label: a("life.adapters.stateDisabled"), tone: "muted" };
    }
    B(() => tt.value.filter((y) => y.implemented).map((y) => y.id));
    const xn = B(() => tt.value.filter((y) => !y.implemented).map((y) => y.id));
    async function Lt() {
      Re.value = !0, I.value = "";
      try {
        const [y, T, b] = await Promise.all([
          Ft("adapter_list"),
          Ft("adapter_platforms"),
          Ft("adapter_routes_get")
        ]);
        Pe.value = y?.instances || [], K.value = y?.runtime || [], tt.value = T?.platforms || [], Ve.value = (b?.routes || []).map(jt), Te.value = b?.default_config_id || "default", W.value = { ...Ye(), ws_port: He() };
      } catch (y) {
        I.value = tn(y);
      } finally {
        Re.value = !1;
      }
    }
    function He() {
      const y = new Set(Pe.value.map((b) => Number(b.ws_port) || 0));
      let T = 6199;
      for (; y.has(T) && T < 65535; ) T += 1;
      return T;
    }
    async function Ae() {
      re.value = "", W.value = {
        ...Ye(),
        ws_port: He()
      }, await Ki(), Ht.value?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    async function ct(y) {
      re.value = y.id, W.value = {
        ...Ye(),
        ...y,
        trigger_keywords: Array.isArray(y.trigger_keywords) ? y.trigger_keywords.join(",") : y.trigger_keywords || ""
      }, await Ki(), Ht.value?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    async function Ge() {
      se.value = !0;
      try {
        const y = { ...W.value };
        y.id && !y.ws_token && delete y.ws_token, y.id && !y.access_token && delete y.access_token, y.trigger_keywords = String(y.trigger_keywords || "").split(",").map((X) => X.trim()).filter(Boolean);
        const T = Number(y.ws_port);
        y.ws_port === "" || y.ws_port === null || y.ws_port === void 0 ? delete y.ws_port : T > 0 ? y.ws_port = T : delete y.ws_port, y.id || delete y.id;
        const b = await Ft("adapter_upsert", { instance: y });
        if (b && b.ok === !1) throw Error(b.error || a("life.adapters.saveFailed"));
        b?.sync?.failed?.includes(b?.instance?.id) && y.enabled ? Z(a("life.adapters.savedUnlistened")) : Z(y.enabled === !1 ? a("life.adapters.savedDisabled") : a("life.adapters.savedListening")), re.value = null, await Lt();
      } catch (y) {
        I.value = tn(y);
      } finally {
        se.value = !1;
      }
    }
    async function kn(y) {
      se.value = !0;
      try {
        await Ft("adapter_toggle", { id: y.id, enabled: !y.enabled }), Z(y.enabled ? a("life.adapters.toggledDisabled", { name: y.name }) : a("life.adapters.toggledEnabled", { name: y.name })), await Lt();
      } catch (T) {
        I.value = tn(T);
      } finally {
        se.value = !1;
      }
    }
    async function Pn(y) {
      if (await g({
        title: a("life.adapters.deleteTitle"),
        message: a("life.adapters.deleteMessage", { name: y.name }),
        confirmLabel: a("life.adapters.delete"),
        danger: !0
      })) {
        se.value = !0;
        try {
          await Ft("adapter_delete", { id: y.id }), Z(a("life.adapters.deleted")), re.value === y.id && (re.value = null), await Lt();
        } catch (b) {
          I.value = tn(b);
        } finally {
          se.value = !1;
        }
      }
    }
    async function Le() {
      se.value = !0;
      try {
        const T = (await Ft("adapter_sync"))?.failed || [];
        Z(T.length ? a("life.adapters.resyncFailed", { count: T.length, names: T.join(a("life.adapters.listSeparator")) }) : a("life.adapters.resynced")), await Lt();
      } catch (y) {
        I.value = tn(y);
      } finally {
        se.value = !1;
      }
    }
    const Ve = $([]), Te = $("default"), Se = $({ pattern: "*", config_id: "default" }), Gt = $(!1);
    let nt = 0;
    function jt(y) {
      return { ...y, _key: `rule-${++nt}` };
    }
    const We = (y) => ({ pattern: y.pattern, config_id: y.config_id });
    function Tt() {
      const y = String(Se.value.pattern || "").trim();
      if (!y) {
        I.value = a("life.adapters.routePatternRequired");
        return;
      }
      Ve.value = [...Ve.value, jt({ pattern: y, config_id: String(Se.value.config_id || "default").trim() || "default" })], Se.value = { pattern: "*", config_id: "default" }, I.value = "";
    }
    function F(y) {
      Ve.value = Ve.value.filter((T, b) => b !== y);
    }
    function nn(y, T) {
      const b = [...Ve.value], ne = y + T;
      if (ne < 0 || ne >= b.length) return;
      const [X] = b.splice(y, 1);
      b.splice(ne, 0, X), Ve.value = b;
    }
    async function U() {
      Gt.value = !0;
      try {
        await Ft("adapter_routes_set", {
          routes: Ve.value.map(We),
          default_config_id: String(Te.value || "default").trim() || "default"
        }), Z(a("life.adapters.routesSaved"));
      } catch (y) {
        I.value = tn(y);
      } finally {
        Gt.value = !1;
      }
    }
    if (typeof document < "u" && !document.getElementById(Go)) {
      const y = document.createElement("style");
      y.id = Go, y.textContent = Xo("lsp") + `
.lsp .adapter-row{display:flex;flex-wrap:wrap;align-items:center;gap:10px}
.lsp .adapter-row strong{font-size:15px;font-weight:750;overflow-wrap:anywhere}
.lsp .adapter-row .meta{flex:1 1 100%}
.lsp .adapter-actions{display:flex;gap:8px;flex-wrap:wrap;flex:1 1 100%}
.lsp .rule-row{display:flex;flex-wrap:wrap;align-items:center;gap:10px}
/* A route pattern is an unbreakable regex / path; without this it pushes the
   row (and the card) wider than its column. */
.lsp .rule-row code{font:600 12px/1.4 ui-monospace,monospace;background:var(--md-surface-container-high);
  padding:2px 8px;border-radius:8px;color:var(--md-on-surface);overflow-wrap:anywhere;max-width:100%}
.lsp .rule-row .idx{font:700 12px/1 ui-monospace,monospace;color:var(--md-on-surface-variant);min-width:20px}
.lsp .rule-row .to{color:var(--md-primary);font-weight:700;font-size:13px}
.lsp .pill{font-size:12px;padding:4px 12px;transition:background .3s,color .3s}
.lsp .pill.wait{background:var(--md-secondary-container);color:var(--md-on-secondary-container);display:inline-flex;align-items:center;gap:6px}
/* "Waiting for a client" breathes so it reads as alive, not frozen. */
.lsp .pill.wait::before{content:'';flex:0 0 auto;width:7px;height:7px;border-radius:50%;background:currentColor;animation:lsp-breath 1.6s ease-in-out infinite}
@keyframes lsp-breath{0%,100%{opacity:.25;transform:scale(.8)}50%{opacity:1;transform:scale(1)}}
.lsp .pill.ok{background:var(--md-success-container);color:var(--md-on-success-container,#0d3b1e)}
.lsp .pill.muted{background:var(--md-surface-container-high);color:var(--md-on-surface-variant)}
.lsp .pill.bad{background:var(--md-error-container);color:var(--md-on-error-container)}
.lsp .platform-note{margin:10px 0 0}
.lsp .token-warn{color:var(--md-error,#b3261e);font-weight:700}
.lsp .editor-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}
/* Editor card fade-in when "Add/Edit adapter" mounts it. */
.lsp .lsp-fade-enter-active{transition:opacity 220ms var(--ease-emphasized-decel),transform 220ms var(--ease-emphasized-decel)}
.lsp .lsp-fade-enter-from{opacity:0;transform:translateY(6px)}
/* Route-rule FLIP: rows glide to their new position on ↑↓ reorder. */
.lsp .rule-flip-move{transition:transform 260ms var(--ease-emphasized)}
.lsp .rule-flip-enter-active{transition:opacity 200ms var(--ease-emphasized-decel),transform 200ms var(--ease-emphasized-decel)}
.lsp .rule-flip-enter-from{opacity:0;transform:translateY(4px)}
.lsp .rule-flip-leave-active{transition:opacity 140ms var(--ease-emphasized-accel)}
.lsp .rule-flip-leave-to{opacity:0}
@media (prefers-reduced-motion: reduce){
  .lsp .pill.wait::before{animation:none}
  .lsp .lsp-fade-enter-active,.lsp .rule-flip-move,.lsp .rule-flip-enter-active,.lsp .rule-flip-leave-active{transition-duration:1ms}
}
`, document.head.appendChild(y);
    }
    return mi(Lt), (y, T) => (_(), v("main", Na, [
      i("header", Da, [
        i("div", Ra, [
          i("div", Va, [
            T[17] || (T[17] = i(
              "p",
              { class: "eyebrow" },
              [
                i("b", null, "●"),
                O(" L.I.F.E · MESSAGING PLATFORMS")
              ],
              -1
              /* CACHED */
            )),
            i(
              "h1",
              null,
              l(a("life.adapters.title")),
              1
              /* TEXT */
            ),
            i("p", $a, [
              O(
                l(a("life.adapters.subtitleBefore")),
                1
                /* TEXT */
              ),
              i(
                "b",
                null,
                l(a("life.adapters.subtitleServer")),
                1
                /* TEXT */
              ),
              O(
                l(a("life.adapters.subtitleAfter")),
                1
                /* TEXT */
              )
            ])
          ]),
          i("div", Ua, [
            i("button", {
              class: "fab",
              disabled: se.value || Re.value,
              onClick: Le
            }, [
              T[18] || (T[18] = i(
                "span",
                {
                  class: "fab-ic",
                  "aria-hidden": "true"
                },
                "↻",
                -1
                /* CACHED */
              )),
              O(
                l(se.value ? a("life.adapters.processing") : a("life.adapters.relisten")),
                1
                /* TEXT */
              )
            ], 8, Fa)
          ])
        ]),
        i("div", Ha, [
          i(
            "span",
            Wa,
            l(a("life.adapters.adapterCount", { n: Pe.value.length })),
            1
            /* TEXT */
          ),
          i(
            "span",
            Ga,
            l(a("life.adapters.enabledCount", { n: Pe.value.filter((b) => b.enabled).length })),
            1
            /* TEXT */
          ),
          i(
            "span",
            ja,
            l(a("life.adapters.connectedCount", { n: K.value.filter((b) => b.connected).length })),
            1
            /* TEXT */
          )
        ])
      ]),
      I.value ? (_(), v(
        "p",
        qa,
        l(I.value),
        1
        /* TEXT */
      )) : A("v-if", !0),
      Fe.value ? (_(), v(
        "p",
        Ka,
        l(Fe.value),
        1
        /* TEXT */
      )) : A("v-if", !0),
      Re.value ? (_(), v(
        "p",
        Ya,
        l(a("life.adapters.loadingConfig")),
        1
        /* TEXT */
      )) : A("v-if", !0),
      Re.value ? A("v-if", !0) : (_(), v(
        q,
        { key: 3 },
        [
          i("article", Ja, [
            i("h3", null, [
              O(
                l(a("life.adapters.adaptersHeading")) + " ",
                1
                /* TEXT */
              ),
              i(
                "span",
                Xa,
                l(Pe.value.length),
                1
                /* TEXT */
              ),
              i(
                "button",
                {
                  class: "btn filled sm",
                  style: { "margin-left": "auto" },
                  onClick: Ae
                },
                l(a("life.adapters.addAdapter")),
                1
                /* TEXT */
              )
            ]),
            Pe.value.length ? (_(), v("ol", es, [
              (_(!0), v(
                q,
                null,
                be(Pe.value, (b) => (_(), v("li", {
                  key: b.id
                }, [
                  i("div", ts, [
                    i(
                      "strong",
                      null,
                      l(b.name || b.id),
                      1
                      /* TEXT */
                    ),
                    i(
                      "span",
                      {
                        class: R(["pill", Wt(b).tone])
                      },
                      l(Wt(b).label),
                      3
                      /* TEXT, CLASS */
                    ),
                    i(
                      "span",
                      ns,
                      l(b.platform),
                      1
                      /* TEXT */
                    )
                  ]),
                  i("div", is, [
                    i(
                      "span",
                      os,
                      l(b.direction === "connect" ? a("life.adapters.directionConnect") : a("life.adapters.directionReverse")),
                      1
                      /* TEXT */
                    ),
                    O(
                      " " + l(b.direction === "connect" ? a("life.adapters.connectingTo", { target: `${b.ws_host}:${b.ws_port}${b.ws_path || ""}` }) : a("life.adapters.listening", { host: b.ws_host, port: b.ws_port })) + " · " + l(a("life.adapters.personaInline")) + " ",
                      1
                      /* TEXT */
                    ),
                    i(
                      "code",
                      null,
                      l(b.config_id),
                      1
                      /* TEXT */
                    ),
                    b.http_url ? (_(), v(
                      q,
                      { key: 0 },
                      [
                        O(
                          " · HTTP " + l(b.http_url),
                          1
                          /* TEXT */
                        )
                      ],
                      64
                      /* STABLE_FRAGMENT */
                    )) : A("v-if", !0)
                  ]),
                  i("div", as, [
                    i(
                      "span",
                      {
                        class: R({ "token-warn": !b.has_ws_token && b.ws_host === "0.0.0.0" })
                      },
                      l(b.has_ws_token ? a("life.adapters.tokenSet") : a("life.adapters.tokenUnset")),
                      3
                      /* TEXT, CLASS */
                    ),
                    b.trigger_keywords && b.trigger_keywords.length ? (_(), v(
                      q,
                      { key: 0 },
                      [
                        O(
                          " · " + l(a("life.adapters.triggerWords")) + " " + l(b.trigger_keywords.join(a("life.adapters.listSeparator"))),
                          1
                          /* TEXT */
                        )
                      ],
                      64
                      /* STABLE_FRAGMENT */
                    )) : A("v-if", !0)
                  ]),
                  de(b.id).error ? (_(), v(
                    "p",
                    ss,
                    l(a("life.adapters.listenError", { error: de(b.id).error })),
                    1
                    /* TEXT */
                  )) : A("v-if", !0),
                  i("div", ls, [
                    i("button", {
                      class: "btn sm",
                      disabled: se.value,
                      onClick: (ne) => kn(b)
                    }, l(b.enabled ? a("life.adapters.disable") : a("life.adapters.enable")), 9, rs),
                    i("button", {
                      class: "btn sm",
                      onClick: (ne) => ct(b)
                    }, l(a("life.adapters.edit")), 9, us),
                    i("button", {
                      class: "btn sm danger",
                      disabled: se.value,
                      onClick: (ne) => Pn(b)
                    }, l(a("life.adapters.delete")), 9, cs)
                  ])
                ]))),
                128
                /* KEYED_FRAGMENT */
              ))
            ])) : (_(), v(
              "p",
              Qa,
              l(a("life.adapters.emptyAdapters")),
              1
              /* TEXT */
            ))
          ]),
          Ee(Ca, { name: "lsp-fade" }, {
            default: Uo(() => [
              re.value !== null ? (_(), v(
                "article",
                {
                  key: 0,
                  ref_key: "editorEl",
                  ref: Ht,
                  class: "card"
                },
                [
                  i(
                    "h3",
                    null,
                    l(W.value.id ? a("life.adapters.editAdapterTitle") : a("life.adapters.addAdapterTitle")),
                    1
                    /* TEXT */
                  ),
                  i("div", ds, [
                    i("label", null, [
                      i(
                        "span",
                        null,
                        l(a("life.adapters.platformCategory")),
                        1
                        /* TEXT */
                      ),
                      Ee(Ne(De), {
                        modelValue: W.value.platform,
                        "onUpdate:modelValue": T[0] || (T[0] = (b) => W.value.platform = b),
                        options: tt.value.map((b) => ({ value: b.id, label: b.id + (b.implemented ? "" : a("life.adapters.notImplemented")) }))
                      }, null, 8, ["modelValue", "options"])
                    ]),
                    i("label", null, [
                      i(
                        "span",
                        null,
                        l(a("life.adapters.direction")),
                        1
                        /* TEXT */
                      ),
                      Ee(Ne(De), {
                        modelValue: W.value.direction,
                        "onUpdate:modelValue": T[1] || (T[1] = (b) => W.value.direction = b),
                        options: [
                          { value: "reverse", label: a("life.adapters.directionReverse") },
                          { value: "connect", label: a("life.adapters.directionConnect") }
                        ]
                      }, null, 8, ["modelValue", "options"])
                    ]),
                    i("label", null, [
                      i(
                        "span",
                        null,
                        l(a("life.adapters.botName")),
                        1
                        /* TEXT */
                      ),
                      x(i(
                        "input",
                        {
                          "onUpdate:modelValue": T[2] || (T[2] = (b) => W.value.name = b),
                          class: "field",
                          placeholder: "napcat"
                        },
                        null,
                        512
                        /* NEED_PATCH */
                      ), [
                        [E, W.value.name]
                      ])
                    ]),
                    i("label", null, [
                      i(
                        "span",
                        null,
                        l(a("life.adapters.wsHost")),
                        1
                        /* TEXT */
                      ),
                      x(i(
                        "input",
                        {
                          "onUpdate:modelValue": T[3] || (T[3] = (b) => W.value.ws_host = b),
                          class: "field",
                          placeholder: "0.0.0.0"
                        },
                        null,
                        512
                        /* NEED_PATCH */
                      ), [
                        [E, W.value.ws_host]
                      ])
                    ]),
                    i("label", null, [
                      i(
                        "span",
                        null,
                        l(a("life.adapters.wsPort")),
                        1
                        /* TEXT */
                      ),
                      x(i(
                        "input",
                        {
                          "onUpdate:modelValue": T[4] || (T[4] = (b) => W.value.ws_port = b),
                          class: "field",
                          type: "number",
                          min: "1",
                          max: "65535",
                          placeholder: "6199"
                        },
                        null,
                        512
                        /* NEED_PATCH */
                      ), [
                        [
                          E,
                          W.value.ws_port,
                          void 0,
                          { number: !0 }
                        ]
                      ])
                    ]),
                    W.value.direction === "connect" ? (_(), v("label", hs, [
                      i(
                        "span",
                        null,
                        l(a("life.adapters.wsPath")),
                        1
                        /* TEXT */
                      ),
                      x(i("input", {
                        "onUpdate:modelValue": T[5] || (T[5] = (b) => W.value.ws_path = b),
                        class: "field",
                        placeholder: a("life.adapters.wsPathPlaceholder")
                      }, null, 8, ps), [
                        [E, W.value.ws_path]
                      ])
                    ])) : A("v-if", !0),
                    i("label", null, [
                      i(
                        "span",
                        null,
                        l(a("life.adapters.wsToken")),
                        1
                        /* TEXT */
                      ),
                      x(i("input", {
                        "onUpdate:modelValue": T[6] || (T[6] = (b) => W.value.ws_token = b),
                        class: "field",
                        type: "password",
                        placeholder: a("life.adapters.wsTokenPlaceholder")
                      }, null, 8, fs), [
                        [E, W.value.ws_token]
                      ])
                    ]),
                    i("label", null, [
                      i(
                        "span",
                        null,
                        l(a("life.adapters.httpUrl")),
                        1
                        /* TEXT */
                      ),
                      x(i("input", {
                        "onUpdate:modelValue": T[7] || (T[7] = (b) => W.value.http_url = b),
                        class: "field",
                        placeholder: a("life.adapters.httpUrlPlaceholder")
                      }, null, 8, ms), [
                        [E, W.value.http_url]
                      ])
                    ]),
                    i("label", null, [
                      i(
                        "span",
                        null,
                        l(a("life.adapters.accessToken")),
                        1
                        /* TEXT */
                      ),
                      x(i("input", {
                        "onUpdate:modelValue": T[8] || (T[8] = (b) => W.value.access_token = b),
                        class: "field",
                        placeholder: a("life.adapters.accessTokenPlaceholder")
                      }, null, 8, _s), [
                        [E, W.value.access_token]
                      ])
                    ]),
                    i("label", null, [
                      i(
                        "span",
                        null,
                        l(a("life.adapters.configFile")),
                        1
                        /* TEXT */
                      ),
                      x(i(
                        "input",
                        {
                          "onUpdate:modelValue": T[9] || (T[9] = (b) => W.value.config_id = b),
                          class: "field",
                          placeholder: "default"
                        },
                        null,
                        512
                        /* NEED_PATCH */
                      ), [
                        [E, W.value.config_id]
                      ])
                    ]),
                    i("label", null, [
                      i(
                        "span",
                        null,
                        l(a("life.adapters.triggerKeywordsInherit")),
                        1
                        /* TEXT */
                      ),
                      x(i("input", {
                        "onUpdate:modelValue": T[10] || (T[10] = (b) => W.value.trigger_keywords = b),
                        class: "field",
                        placeholder: a("life.adapters.triggerKeywordsPlaceholder")
                      }, null, 8, vs), [
                        [E, W.value.trigger_keywords]
                      ])
                    ])
                  ]),
                  i(
                    "p",
                    gs,
                    l(a("life.adapters.directionHint")),
                    1
                    /* TEXT */
                  ),
                  i("label", ys, [
                    x(i(
                      "input",
                      {
                        "onUpdate:modelValue": T[11] || (T[11] = (b) => W.value.enabled = b),
                        type: "checkbox"
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [he, W.value.enabled]
                    ]),
                    i(
                      "span",
                      null,
                      l(a("life.adapters.enableThisAdapter")),
                      1
                      /* TEXT */
                    )
                  ]),
                  i("label", bs, [
                    x(i(
                      "input",
                      {
                        "onUpdate:modelValue": T[12] || (T[12] = (b) => W.value.observe_group = b),
                        type: "checkbox"
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [he, W.value.observe_group]
                    ]),
                    i(
                      "span",
                      null,
                      l(a("life.adapters.observeGroup")),
                      1
                      /* TEXT */
                    )
                  ]),
                  xn.value.length ? (_(), v(
                    "p",
                    ws,
                    l(a("life.adapters.pendingPlatforms", { names: xn.value.join(a("life.adapters.listSeparator")) })),
                    1
                    /* TEXT */
                  )) : A("v-if", !0),
                  i("div", xs, [
                    i("button", {
                      class: "btn filled sm",
                      disabled: se.value,
                      onClick: Ge
                    }, l(se.value ? a("life.adapters.saving") : a("life.adapters.save")), 9, ks),
                    i(
                      "button",
                      {
                        class: "btn sm",
                        onClick: T[13] || (T[13] = (b) => re.value = null)
                      },
                      l(a("life.adapters.cancel")),
                      1
                      /* TEXT */
                    )
                  ])
                ],
                512
                /* NEED_PATCH */
              )) : A("v-if", !0)
            ]),
            _: 1
            /* STABLE */
          }),
          i("article", Ps, [
            i(
              "h3",
              null,
              l(a("life.adapters.routesTitle")),
              1
              /* TEXT */
            ),
            i("p", Ls, [
              O(
                l(a("life.adapters.routesHintBefore")),
                1
                /* TEXT */
              ),
              i(
                "b",
                null,
                l(a("life.adapters.routesHintOrder")),
                1
                /* TEXT */
              ),
              O(
                l(a("life.adapters.routesHintAfterOrder")),
                1
                /* TEXT */
              ),
              T[19] || (T[19] = i(
                "code",
                null,
                "*",
                -1
                /* CACHED */
              )),
              O(
                l(a("life.adapters.routesHintMatchAll")),
                1
                /* TEXT */
              ),
              i(
                "code",
                null,
                l(a("life.adapters.routeRegexExample")),
                1
                /* TEXT */
              ),
              O(
                l(a("life.adapters.routesHintAnd")),
                1
                /* TEXT */
              ),
              i(
                "code",
                null,
                l(a("life.adapters.routePrefixExample")),
                1
                /* TEXT */
              ),
              O(
                l(a("life.adapters.routesHintTail")),
                1
                /* TEXT */
              ),
              T[20] || (T[20] = i(
                "code",
                null,
                "/sid",
                -1
                /* CACHED */
              )),
              O(
                l(a("life.adapters.routesHintSid")),
                1
                /* TEXT */
              )
            ]),
            Ee(Ma, {
              tag: "ol",
              name: "rule-flip",
              class: "feed"
            }, {
              default: Uo(() => [
                (_(!0), v(
                  q,
                  null,
                  be(Ve.value, (b, ne) => (_(), v("li", {
                    key: b._key,
                    class: "rule-row"
                  }, [
                    i(
                      "span",
                      Ts,
                      l(ne + 1),
                      1
                      /* TEXT */
                    ),
                    i(
                      "code",
                      null,
                      l(b.pattern),
                      1
                      /* TEXT */
                    ),
                    i(
                      "span",
                      Ss,
                      "→ " + l(b.config_id),
                      1
                      /* TEXT */
                    ),
                    i("span", Cs, [
                      i("button", {
                        class: "btn sm",
                        disabled: ne === 0,
                        "aria-label": a("life.adapters.moveUp"),
                        title: a("life.adapters.moveUp"),
                        onClick: (X) => nn(ne, -1)
                      }, "↑", 8, Ms),
                      i("button", {
                        class: "btn sm",
                        disabled: ne === Ve.value.length - 1,
                        "aria-label": a("life.adapters.moveDown"),
                        title: a("life.adapters.moveDown"),
                        onClick: (X) => nn(ne, 1)
                      }, "↓", 8, zs),
                      i("button", {
                        class: "btn sm danger",
                        "aria-label": a("life.adapters.delete"),
                        onClick: (X) => F(ne)
                      }, l(a("life.adapters.delete")), 9, Es)
                    ])
                  ]))),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ]),
              _: 1
              /* STABLE */
            }),
            Ve.value.length ? A("v-if", !0) : (_(), v(
              "p",
              Os,
              l(a("life.adapters.emptyRoutes")),
              1
              /* TEXT */
            )),
            i("div", As, [
              i("label", null, [
                i(
                  "span",
                  null,
                  l(a("life.adapters.sessionPattern")) + "*",
                  1
                  /* TEXT */
                ),
                x(i("input", {
                  "onUpdate:modelValue": T[14] || (T[14] = (b) => Se.value.pattern = b),
                  class: "field",
                  placeholder: a("life.adapters.sessionPatternPlaceholder")
                }, null, 8, Is), [
                  [E, Se.value.pattern]
                ])
              ]),
              i("label", null, [
                i(
                  "span",
                  null,
                  l(a("life.adapters.configFile")),
                  1
                  /* TEXT */
                ),
                x(i(
                  "input",
                  {
                    "onUpdate:modelValue": T[15] || (T[15] = (b) => Se.value.config_id = b),
                    class: "field",
                    placeholder: "default"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [E, Se.value.config_id]
                ])
              ])
            ]),
            i("div", Bs, [
              i(
                "button",
                {
                  class: "btn sm",
                  onClick: Tt
                },
                l(a("life.adapters.addRule")),
                1
                /* TEXT */
              ),
              i("label", Zs, [
                i(
                  "span",
                  null,
                  l(a("life.adapters.defaultConfig")),
                  1
                  /* TEXT */
                ),
                x(i(
                  "input",
                  {
                    "onUpdate:modelValue": T[16] || (T[16] = (b) => Te.value = b),
                    class: "field",
                    placeholder: "default"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [E, Te.value]
                ])
              ]),
              i("button", {
                class: "btn filled sm",
                disabled: Gt.value,
                onClick: U
              }, l(Gt.value ? a("life.adapters.saving") : a("life.adapters.saveRoutes")), 9, Ns)
            ])
          ])
        ],
        64
        /* STABLE_FRAGMENT */
      ))
    ]));
  }
}), Rs = { class: "hero" }, Vs = { class: "hero-main" }, $s = { class: "hero-copy" }, Us = {
  key: 0,
  class: "dirty-pill"
}, Fs = { class: "sub" }, Hs = { class: "hero-actions" }, Ws = ["disabled"], Gs = ["disabled"], js = ["disabled"], qs = ["disabled"], Ks = { class: "state-row" }, Ys = { class: "pill soft" }, Js = { class: "pill soft" }, Xs = { class: "pill soft" }, Qs = {
  key: 0,
  class: "banner err"
}, el = {
  key: 1,
  class: "banner ok"
}, tl = ["aria-label"], nl = ["onClick"], il = { class: "tab-ic" }, ol = {
  "data-panel": "persona",
  class: "panel"
}, al = { class: "section-head" }, sl = { class: "desc" }, ll = { class: "head-actions" }, rl = ["disabled"], ul = ["disabled"], cl = { class: "card" }, dl = { class: "settings-grid" }, hl = { class: "pfield" }, pl = { class: "pfield" }, fl = { class: "pfield" }, ml = { class: "pfield" }, _l = { class: "hint" }, vl = {
  key: 0,
  class: "card"
}, gl = { class: "count-pill ok" }, yl = { class: "settings-grid" }, bl = { class: "hint" }, wl = {
  key: 0,
  class: "hint"
}, xl = { class: "settings-grid" }, kl = { class: "settings-grid" }, Pl = { class: "pdetails" }, Ll = {
  class: "settings-grid",
  style: { "margin-top": "10px" }
}, Tl = { class: "settings-grid" }, Sl = ["value"], Cl = { class: "hint" }, Ml = {
  key: 2,
  class: "hint"
}, zl = { class: "settings-grid" }, El = ["value"], Ol = { class: "hint" }, Al = {
  key: 4,
  class: "hint"
}, Il = { class: "settings-grid" }, Bl = ["value"], Zl = { class: "hint" }, Nl = {
  key: 6,
  class: "hint"
}, Dl = {
  "data-panel": "cognition",
  class: "panel"
}, Rl = { class: "section-head" }, Vl = { class: "desc" }, $l = { class: "head-actions" }, Ul = ["disabled"], Fl = { class: "card" }, Hl = { class: "settings-grid" }, Wl = { class: "cog-metric" }, Gl = { class: "cog-metric" }, jl = { class: "cog-metric" }, ql = { class: "cog-metric" }, Kl = { class: "cog-metric" }, Yl = { class: "cog-metric" }, Jl = {
  key: 0,
  class: "hint"
}, Xl = {
  key: 1,
  class: "hint"
}, Ql = {
  key: 2,
  class: "hint"
}, er = { style: { display: "flex", gap: "12px", "align-items": "center", "flex-wrap": "wrap", "margin-top": "10px" } }, tr = { class: "sw" }, nr = ["disabled"], ir = { class: "hint" }, or = { class: "card" }, ar = {
  key: 0,
  class: "count-pill sync-pill"
}, sr = {
  key: 0,
  class: "empty"
}, lr = { class: "sub-label" }, rr = { class: "hint" }, ur = { class: "at-a-glance" }, cr = ["aria-label"], dr = { class: "plot-label plot-n" }, hr = { class: "plot-label plot-s" }, pr = { class: "plot-label plot-w" }, fr = { class: "plot-label plot-e" }, mr = {
  class: "mood-plot",
  viewBox: "0 0 120 120",
  "aria-hidden": "true"
}, _r = ["cx", "cy"], vr = ["cx", "cy"], gr = { class: "plot-quadrant" }, yr = { class: "glance-col" }, br = { class: "glance-title" }, wr = ["title"], xr = { class: "gauge-head" }, kr = { class: "gauge-name" }, Pr = { class: "gauge-alias" }, Lr = { class: "gauge-val" }, Tr = { class: "gauge-effect" }, Sr = { class: "glance-col" }, Cr = { class: "glance-title" }, Mr = ["title"], zr = { class: "gauge-head" }, Er = { class: "gauge-name" }, Or = { class: "gauge-alias" }, Ar = { class: "gauge-val" }, Ir = { class: "gauge-effect" }, Br = { class: "sub-label" }, Zr = { class: "hint" }, Nr = { class: "gauge-grid" }, Dr = ["title"], Rr = { class: "gauge-head" }, Vr = { class: "gauge-name" }, $r = { class: "gauge-alias" }, Ur = { class: "gauge-val" }, Fr = { class: "gauge-effect" }, Hr = {
  key: 0,
  class: "som-channels"
}, Wr = { class: "som-chan-name" }, Gr = { class: "som-chan-bar" }, jr = { class: "som-chan-val" }, qr = {
  key: 0,
  class: "hint"
}, Kr = { class: "sub-label" }, Yr = { class: "hint" }, Jr = { class: "gauge-grid" }, Xr = ["title"], Qr = { class: "gauge-head" }, eu = { class: "gauge-name" }, tu = { class: "gauge-alias" }, nu = { class: "gauge-val" }, iu = { class: "gauge-effect" }, ou = { class: "chip-row" }, au = { class: "chip muted" }, su = { class: "chip muted" }, lu = { class: "sub-label" }, ru = { class: "hint" }, uu = { class: "chip-row" }, cu = { class: "chip" }, du = { class: "chip muted" }, hu = { class: "chip muted" }, pu = { class: "gauge-grid" }, fu = ["title"], mu = { class: "gauge-head" }, _u = { class: "gauge-name" }, vu = { class: "gauge-alias" }, gu = { class: "gauge-val" }, yu = { class: "gauge-effect" }, bu = { class: "sub-label" }, wu = { class: "hint" }, xu = { class: "chip-row" }, ku = { class: "chip" }, Pu = { class: "gauge-grid" }, Lu = ["title"], Tu = { class: "gauge-head" }, Su = { class: "gauge-name" }, Cu = { class: "gauge-alias" }, Mu = { class: "gauge-val" }, zu = { class: "gauge-effect" }, Eu = { class: "sub-label" }, Ou = { class: "hint" }, Au = { class: "chip-row" }, Iu = { class: "chip" }, Bu = { class: "chip muted" }, Zu = { class: "gauge-grid" }, Nu = ["title"], Du = { class: "gauge-head" }, Ru = { class: "gauge-name" }, Vu = { class: "gauge-alias" }, $u = { class: "gauge-val" }, Uu = { class: "gauge-effect" }, Fu = { class: "sub-label" }, Hu = { class: "hint" }, Wu = { class: "chip-row" }, Gu = { class: "chip" }, ju = { class: "chip muted" }, qu = {
  key: 0,
  class: "chip muted"
}, Ku = {
  key: 1,
  class: "chip warn"
}, Yu = { class: "gauge-grid" }, Ju = ["title"], Xu = { class: "gauge-head" }, Qu = { class: "gauge-name" }, ec = { class: "gauge-alias" }, tc = { class: "gauge-val" }, nc = { class: "gauge-effect" }, ic = { class: "pdetails" }, oc = {
  class: "settings-grid",
  style: { "margin-top": "10px" }
}, ac = {
  key: 0,
  class: "cog-metric"
}, sc = {
  key: 1,
  class: "cog-metric"
}, lc = {
  key: 2,
  class: "cog-metric"
}, rc = {
  key: 3,
  class: "cog-metric"
}, uc = {
  key: 4,
  class: "cog-metric"
}, cc = {
  key: 5,
  class: "cog-metric"
}, dc = {
  key: 6,
  class: "cog-metric"
}, hc = {
  key: 7,
  class: "cog-metric"
}, pc = { class: "pdetails" }, fc = {
  class: "settings-grid",
  style: { "margin-top": "10px" }
}, mc = { class: "cog-metric" }, _c = { class: "cog-metric" }, vc = { class: "cog-metric" }, gc = { class: "cog-metric" }, yc = { class: "cog-metric" }, bc = { class: "cog-metric" }, wc = { class: "cog-metric" }, xc = { class: "cog-metric" }, kc = { class: "cog-metric" }, Pc = { class: "cog-metric" }, Lc = { class: "cog-metric" }, Tc = { class: "cog-metric" }, Sc = {
  key: 0,
  class: "cog-metric"
}, Cc = {
  key: 2,
  class: "hint"
}, Mc = {
  key: 3,
  class: "hint"
}, zc = {
  key: 4,
  class: "hint"
}, Ec = {
  key: 5,
  class: "hint"
}, Oc = {
  key: 6,
  class: "hint"
}, Ac = { class: "card" }, Ic = { class: "switches" }, Bc = { class: "sw" }, Zc = { class: "sw" }, Nc = { class: "sw" }, Dc = { class: "sw" }, Rc = { class: "sw" }, Vc = { class: "sw" }, $c = { class: "hint" }, Uc = { class: "card" }, Fc = { class: "hint" }, Hc = { class: "preset-row" }, Wc = ["onClick"], Gc = { class: "grid2" }, jc = { class: "card" }, qc = { class: "settings-grid" }, Kc = { class: "def-hint" }, Yc = { class: "def-hint" }, Jc = { class: "def-hint" }, Xc = { class: "def-hint" }, Qc = { class: "def-hint" }, ed = { class: "def-hint" }, td = { class: "def-hint" }, nd = { class: "def-hint" }, id = { class: "def-hint" }, od = { class: "switches" }, ad = { class: "sw" }, sd = { class: "sw" }, ld = { class: "sw" }, rd = { class: "sw" }, ud = { class: "sw" }, cd = { class: "card" }, dd = { class: "settings-grid" }, hd = { class: "def-hint" }, pd = { class: "def-hint" }, fd = { class: "def-hint" }, md = { class: "sw" }, _d = { class: "sw" }, vd = { class: "sw" }, gd = { class: "card" }, yd = { class: "settings-grid" }, bd = { class: "sw" }, wd = { class: "card" }, xd = { class: "settings-grid" }, kd = { class: "sw" }, Pd = { class: "card" }, Ld = { class: "settings-grid" }, Td = { class: "sw" }, Sd = { class: "card" }, Cd = { class: "hint" }, Md = { class: "sw" }, zd = { class: "settings-grid" }, Ed = { class: "hint" }, Od = { class: "card" }, Ad = { class: "hint" }, Id = { class: "sw" }, Bd = { class: "settings-grid" }, Zd = { class: "hint" }, Nd = { class: "card" }, Dd = { class: "hint" }, Rd = { class: "sw" }, Vd = { class: "settings-grid" }, $d = { class: "hint" }, Ud = { class: "card" }, Fd = { class: "hint" }, Hd = { class: "sw" }, Wd = { class: "settings-grid" }, Gd = { class: "hint" }, jd = { class: "hint" }, qd = { class: "card" }, Kd = { class: "hint" }, Yd = { class: "switches" }, Jd = { class: "sw" }, Xd = { class: "sw" }, Qd = { class: "sw" }, eh = { class: "sw" }, th = {
  "data-panel": "world",
  class: "panel"
}, nh = { class: "section-head" }, ih = { class: "desc" }, oh = { class: "head-actions" }, ah = { class: "card" }, sh = { class: "settings-grid" }, lh = { class: "sw" }, rh = { class: "hint" }, uh = { class: "hint" }, ch = { class: "card" }, dh = { class: "hint" }, hh = { class: "world-field" }, ph = { class: "world-label" }, fh = ["placeholder"], mh = { class: "card" }, _h = { class: "hint" }, vh = { class: "settings-grid" }, gh = ["placeholder"], yh = ["placeholder"], bh = ["placeholder"], wh = { class: "world-field" }, xh = { class: "world-label" }, kh = ["placeholder"], Ph = { class: "world-field" }, Lh = { class: "world-label" }, Th = ["placeholder"], Sh = { class: "world-field" }, Ch = { class: "world-label" }, Mh = ["placeholder"], zh = { class: "world-actions" }, Eh = ["disabled"], Oh = ["disabled"], Ah = { class: "hint" }, Ih = { class: "card" }, Bh = { class: "wm-head" }, Zh = { class: "count-pill" }, Nh = {
  key: 0,
  class: "wm-place"
}, Dh = {
  key: 0,
  class: "hint wm-premise"
}, Rh = { class: "wm-map-wrap" }, Vh = {
  key: 0,
  class: "wm-offline"
}, $h = {
  key: 1,
  class: "wm-compass",
  "aria-hidden": "true"
}, Uh = {
  key: 1,
  class: "empty"
}, Fh = {
  key: 2,
  class: "wm-legend"
}, Hh = {
  key: 3,
  class: "wm-routes"
}, Wh = {
  key: 0,
  class: "wm-routes-col"
}, Gh = {
  key: 1,
  class: "wm-routes-col"
}, jh = { class: "card" }, qh = { class: "wm-head" }, Kh = { class: "count-pill" }, Yh = { class: "feed" }, Jh = { class: "meta" }, Xh = {
  key: 0,
  class: "empty"
}, Qh = {
  "data-panel": "behavior",
  class: "panel"
}, ep = { class: "section-head" }, tp = { class: "desc" }, np = { class: "head-actions" }, ip = { class: "settings-grid" }, op = {
  key: 0,
  class: "sw"
}, ap = ["onUpdate:modelValue"], sp = { key: 1 }, lp = {
  key: 2,
  class: "world-field"
}, rp = { class: "world-label" }, up = ["onUpdate:modelValue"], cp = { key: 3 }, dp = ["onUpdate:modelValue", "type", "min", "max", "step"], hp = {
  "data-panel": "adapters",
  class: "panel"
}, pp = {
  "data-panel": "state",
  class: "panel"
}, fp = { class: "section-head" }, mp = { class: "desc" }, _p = { class: "card" }, vp = { class: "count-pill" }, gp = { class: "hint" }, yp = { class: "feed" }, bp = { class: "rel-head" }, wp = { class: "meta" }, xp = { class: "rel-track-row" }, kp = { class: "rel-track-label" }, Pp = ["aria-label"], Lp = { class: "rel-stage-name" }, Tp = ["title"], Sp = { class: "gauge-head" }, Cp = { class: "gauge-name" }, Mp = { class: "gauge-alias" }, zp = { class: "gauge-val" }, Ep = { class: "gauge-bar signed" }, Op = { class: "gauge-effect" }, Ap = {
  key: 0,
  class: "rel-mode"
}, Ip = { class: "chip" }, Bp = { class: "meta" }, Zp = {
  key: 0,
  class: "empty"
}, Np = { class: "card" }, Dp = { class: "count-pill" }, Rp = { class: "hint" }, Vp = { class: "feed" }, $p = { class: "meta" }, Up = {
  key: 0,
  class: "empty"
}, Fp = { class: "grid2" }, Hp = { class: "card" }, Wp = { class: "hint" }, Gp = { class: "feed" }, jp = { class: "meta" }, qp = { class: "meta" }, Kp = { class: "meta" }, Yp = {
  key: 0,
  class: "empty"
}, Jp = { class: "card" }, Xp = { class: "hint" }, Qp = { class: "feed" }, ef = { class: "value-name" }, tf = { class: "value-bar" }, nf = { class: "value-num" }, of = {
  key: 0,
  class: "empty"
}, af = { class: "section" }, sf = { class: "section-head" }, lf = { class: "desc" }, rf = { class: "grid2" }, uf = { class: "card" }, cf = { class: "hint" }, df = {
  class: "hint",
  style: { "margin-top": "10px" }
}, hf = { style: { "margin-top": "14px", display: "flex", gap: "10px", "flex-wrap": "wrap" } }, pf = ["disabled"], jo = 0.15, ff = "https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}", mf = /* @__PURE__ */ qo({
  __name: "CompanionPage",
  setup(me) {
    const { confirm: g } = Ko(), a = (d, u) => Yi.global.t(d, u ?? {}), Re = Ea(), I = (d) => Yi.global.t(d, {}, { locale: "zh" }), Fe = (d) => d.map((u) => ({ value: u, label: a(`life.companion.${u}`) })), Z = $({ settings: {}, cognition: null }), Pe = $(!1), K = $(""), tt = $(""), se = $("cognition"), re = $(null), W = [
      { key: "cognition", i: "01", labelKey: "life.companion.nav.cognition", icon: "◉" },
      { key: "persona", i: "02", labelKey: "life.companion.nav.persona", icon: "✎" },
      { key: "world", i: "03", labelKey: "life.companion.nav.world", icon: "✦" },
      { key: "behavior", i: "06", labelKey: "life.companion.beh.nav", icon: "⚙" },
      { key: "adapters", i: "04", labelKey: "life.companion.nav.adapters", icon: "✉" },
      { key: "state", i: "05", labelKey: "life.companion.nav.state", icon: "☺" }
    ], Ye = ["警惕", "疏离", "陌生", "认识", "熟悉", "友好", "亲近", "亲密"].map((d) => ({ value: d, label: d })), de = [
      { title: "life.companion.beh.groupProactive", fields: [
        { key: "enable_proactive", label: "life.companion.beh.enableProactive", type: "bool" },
        { key: "proactive_daily_limit", label: "life.companion.beh.proactiveDailyLimit", type: "int", min: 0, max: 50 },
        { key: "proactive_target_limit", label: "life.companion.beh.proactiveTargetLimit", type: "int", min: 0, max: 20 },
        { key: "min_interval_minutes", label: "life.companion.beh.minIntervalMinutes", type: "int", min: 0, max: 1440 },
        { key: "idle_minutes", label: "life.companion.beh.idleMinutes", type: "int", min: 1, max: 1440 },
        { key: "check_interval_seconds", label: "life.companion.beh.checkIntervalSeconds", type: "int", min: 30, max: 86400 },
        { key: "burst_max", label: "life.companion.beh.burstMax", type: "int", min: 1, max: 20 },
        { key: "quiet_start", label: "life.companion.beh.quietStart", type: "int", min: 0, max: 23 },
        { key: "quiet_end", label: "life.companion.beh.quietEnd", type: "int", min: 0, max: 23 },
        { key: "reply_deceleration", label: "life.companion.beh.replyDeceleration", type: "bool" },
        { key: "daily_token_limit", label: "life.companion.beh.dailyTokenLimit", type: "int", min: 0, max: 1e9 }
      ] },
      { title: "life.companion.beh.groupBond", fields: [
        { key: "enable_exclusive_bond", label: "life.companion.beh.enableExclusiveBond", type: "bool" },
        { key: "enable_group_observe", label: "life.companion.beh.enableGroupObserve", type: "bool" },
        { key: "enable_dream", label: "life.companion.beh.enableDream", type: "bool" },
        { key: "affinity_decay_per_day", label: "life.companion.beh.affinityDecayPerDay", type: "float", min: 0, max: 1, step: 0.01 },
        { key: "affinity_decay_after_days", label: "life.companion.beh.affinityDecayAfterDays", type: "int", min: 0, max: 365 }
      ] },
      { title: "life.companion.beh.groupEnvironment", fields: [
        { key: "enable_environment_fetch", label: "life.companion.beh.enableEnvironmentFetch", type: "bool" },
        { key: "env_timezone", label: "life.companion.beh.envTimezone", type: "text" },
        { key: "env_city", label: "life.companion.beh.envCity", type: "text" },
        { key: "env_latitude", label: "life.companion.beh.envLatitude", type: "float", min: -90, max: 90, step: 1e-4 },
        { key: "env_longitude", label: "life.companion.beh.envLongitude", type: "float", min: -180, max: 180, step: 1e-4 },
        { key: "weather_cache_minutes", label: "life.companion.beh.weatherCacheMinutes", type: "int", min: 5, max: 1440 }
      ] },
      { title: "life.companion.beh.groupContent", fields: [
        { key: "enable_content_fetch", label: "life.companion.beh.enableContentFetch", type: "bool" },
        { key: "news_feeds", label: "life.companion.beh.newsFeeds", type: "longtext" },
        { key: "content_items_per_feed", label: "life.companion.beh.contentItemsPerFeed", type: "int", min: 1, max: 20 }
      ] },
      { title: "life.companion.beh.groupVoice", fields: [
        { key: "tts_endpoint", label: "life.companion.beh.ttsEndpoint", type: "text" },
        { key: "proactive_tts", label: "life.companion.beh.proactiveTts", type: "bool" }
      ] },
      { title: "life.companion.beh.groupAccess", fields: [
        { key: "owner_user_ids", label: "life.companion.beh.ownerUserIds", type: "text" },
        { key: "secondary_user_ids", label: "life.companion.beh.secondaryUserIds", type: "text" },
        { key: "owner_opacity", label: "life.companion.beh.ownerOpacity", type: "bool" },
        { key: "other_stage_cap", label: "life.companion.beh.otherStageCap", type: "stage" },
        { key: "secondary_stage_cap", label: "life.companion.beh.secondaryStageCap", type: "stage" }
      ] },
      { title: "life.companion.beh.groupAdvanced", fields: [
        { key: "model_routes", label: "life.companion.beh.modelRoutes", type: "longtext" },
        { key: "persona_traits_override", label: "life.companion.beh.personaTraitsOverride", type: "longtext" },
        { key: "attachment_override", label: "life.companion.beh.attachmentOverride", type: "longtext" },
        { key: "tsundere_override", label: "life.companion.beh.tsundereOverride", type: "longtext" },
        { key: "personadyn_override", label: "life.companion.beh.personadynOverride", type: "longtext" }
      ] }
    ], Wt = de.flatMap((d) => d.fields);
    function xn(d, u) {
      if (d.type === "bool") return String(u ?? "0") === "1";
      if (d.type === "int") {
        const r = Number(u);
        return Number.isFinite(r) ? r : 0;
      }
      if (d.type === "float") {
        if (u === "" || u === null || u === void 0) return "";
        const r = Number(u);
        return Number.isFinite(r) ? r : "";
      }
      return String(u ?? "");
    }
    function Lt() {
      const d = Z.value.settings || {};
      for (const u of Wt) m.value[u.key] = xn(u, d[u.key]);
    }
    function He() {
      const d = {};
      for (const u of Wt) {
        const r = m.value[u.key];
        u.type === "bool" ? d[u.key] = r ? "1" : "0" : d[u.key] = r === "" || r === null || r === void 0 ? "" : String(r);
      }
      return d;
    }
    function Ae(d) {
      tt.value = d, setTimeout(() => {
        tt.value === d && (tt.value = "");
      }, Jo);
    }
    async function ct(d = 0) {
      Pe.value = !0, K.value = "";
      try {
        Z.value = await Wo("/api/life/companion"), pn(), Pe.value = !1;
      } catch (u) {
        if (d < 4)
          return await Yo(1500), ct(d + 1);
        K.value = tn(u), Pe.value = !1;
      }
    }
    async function Ge(d, u) {
      try {
        const r = await Ft(d, u);
        return await ct(), r;
      } catch (r) {
        return K.value = tn(r), null;
      }
    }
    function kn(d) {
      se.value = d;
      const u = matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", r = re.value;
      r ? r.scrollTo({ top: 0, behavior: u }) : window.scrollTo({ top: 0, behavior: u });
    }
    function Pn(d) {
      const u = re.value?.querySelector(`section[data-panel="${d}"]`);
      u && (u.classList.remove("panel-replay"), u.offsetWidth, u.classList.add("panel-replay"), u.addEventListener("animationend", () => u.classList.remove("panel-replay"), { once: !0 }));
    }
    wn(se, (d) => {
      Ki(() => Pn(d));
    }), wn(se, (d) => {
      d === "adapters" && lt();
    });
    const Le = {
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
      cog_attachment_type: "attach.dependent",
      cog_tsundere_enabled: "0",
      cog_tsundere_type: "tsundere.classic",
      cog_yandere_enabled: "0",
      cog_yandere_type: "yandere.mode.yandere",
      cog_personadyn_enabled: "0",
      cog_personadyn_type: "pdt.0",
      cog_personadyn_gender: "pdGender.unspecified",
      cog_memory_encode: "1",
      cog_sleep_replay: "1",
      cog_memory_reconsolidate: "1",
      cog_cls_interleave: "1"
    }, Ve = [
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
      "cog_yandere_enabled",
      "cog_personadyn_enabled",
      "cog_memory_encode",
      "cog_sleep_replay",
      "cog_memory_reconsolidate",
      "cog_cls_interleave"
    ], Te = ["cog_affect_profile", "cog_language_framing", "cog_attachment_type", "cog_tsundere_type", "cog_yandere_type", "cog_personadyn_type", "cog_personadyn_gender"], Se = B(() => Fe(["attach.secluded", "attach.dependent", "attach.delusional", "attach.monitoring", "attach.selfHarm", "attach.exclusion"])), Gt = B(() => Fe(["tsundere.classic", "tsundere.cold", "tsundere.gruff", "tsundere.indulgent"])), nt = B(() => Fe(["yandere.mode.yandere", "yandere.mode.tsundere", "yandere.mode.neutral", "yandere.mode.hybrid"])), jt = [
      Array.from({ length: 18 }, (d, u) => `pdt.${u}`),
      Array.from({ length: 10 }, (d, u) => `pdt.${18 + u}`),
      Array.from({ length: 9 }, (d, u) => `pdt.${28 + u}`),
      Array.from({ length: 4 }, (d, u) => `pdt.${37 + u}`),
      Array.from({ length: 13 }, (d, u) => `pdt.${41 + u}`),
      Array.from({ length: 11 }, (d, u) => `pdt.${54 + u}`),
      Array.from({ length: 13 }, (d, u) => `pdt.${65 + u}`),
      Array.from({ length: 16 }, (d, u) => `pdt.${78 + u}`),
      Array.from({ length: 78 }, (d, u) => `pdt.${94 + u}`)
    ];
    B(() => jt.map((d, u) => ({ label: a(`life.companion.pdg.${u}`), keys: d })));
    const We = B(() => [...new Set(jt.flat())].map((d) => ({ value: d, label: a(`life.companion.${d}`) }))), Tt = B(() => Fe(["pdGender.unspecified", "pdGender.maleScript", "pdGender.femaleScript", "pdGender.neutral", "pdGender.highTradMale", "pdGender.lowTradMale", "pdGender.highTradFemale", "pdGender.feminist"])), F = B(() => ["typical", "depression", "anxiety", "bpd", "alexithymia"].map((d) => ({ value: d, label: a(`life.companion.profile.${d}`) }))), nn = B(() => [
      "independent",
      "interchanging",
      "cognitive_determinism",
      "weak_whorf",
      "thinking_for_speaking",
      "radical_connectionism",
      "determinism"
    ].map((d) => ({ value: d, label: a(`life.companion.framing.${d}`) }))), U = ["egocentric", "subjective", "self-reflective", "mutual", "societal-symbolic"], y = B(() => U.map((d, u) => ({ value: String(u), label: a(`life.companion.stage.${d}`) }))), T = B({
      get: () => String(Number(m.value.cog_social_stage ?? 2)),
      set: (d) => {
        m.value.cog_social_stage = Number(d);
      }
    }), b = {
      cog_attachment_type: ["attach.secluded", "attach.dependent", "attach.delusional", "attach.monitoring", "attach.selfHarm", "attach.exclusion"],
      cog_tsundere_type: ["tsundere.classic", "tsundere.cold", "tsundere.gruff", "tsundere.indulgent"],
      cog_yandere_type: ["yandere.mode.yandere", "yandere.mode.tsundere", "yandere.mode.neutral", "yandere.mode.hybrid"],
      cog_personadyn_type: [...new Set(jt.flat())],
      cog_personadyn_gender: ["pdGender.unspecified", "pdGender.maleScript", "pdGender.femaleScript", "pdGender.neutral", "pdGender.highTradMale", "pdGender.lowTradMale", "pdGender.highTradFemale", "pdGender.feminist"]
    };
    function ne(d) {
      const u = String(Z.value.settings?.[d] ?? Le[d] ?? ""), r = b[d];
      return r && !r.includes(u) ? r.find((M) => I(`life.companion.${M}`) === u) ?? u : u;
    }
    function X(d) {
      const u = String(d ?? "");
      return I(`life.companion.${u}`) !== `life.companion.${u}` ? I(`life.companion.${u}`) : u;
    }
    function ie() {
      const d = {};
      for (const [u, r] of Object.entries(Le)) {
        const C = ne(u) || r;
        d[u] = Ve.includes(u) ? C === "1" : Te.includes(u) ? C : Number(C);
      }
      return d;
    }
    function dt() {
      const d = {};
      for (const [u, r] of Object.entries(Le)) {
        const C = m.value[u];
        Ve.includes(u) ? d[u] = C ? "1" : "0" : d[u] = String(C ?? r);
      }
      return d;
    }
    const pe = B(() => Z.value.cognition || null), on = B(() => pe.value?.last_control || null), Bt = B(() => pe.value?.wave1 || null), Je = B(() => pe.value?.wave2 || null), qt = B(() => pe.value?.wave3 || null), an = B(() => pe.value?.wave4a || null), jn = B(() => pe.value?.wave4b || null), Kt = B(() => pe.value?.persona || null), $e = B(() => pe.value?.attachment || null), Ie = B(() => pe.value?.tsundere || null), je = B(() => pe.value?.yandere || null), H = B(() => pe.value?.personadyn || null), vi = B(() => {
      const d = H.value?.big5;
      return d ? ["o_open", "c_conscientious", "e_extravert", "a_agreeable", "n_neurotic"].map((r) => xe(d[r], 2)).join(" · ") : "—";
    }), qn = B(() => {
      const d = H.value?.hexaco;
      return d ? ["h_honesty", "hex_e", "hex_x", "hex_a", "hex_c", "hex_o"].map((r) => xe(d[r], 2)).join(" · ") : "—";
    });
    function Kn(d, u = 3) {
      return d ? Object.entries(d).filter(([, r]) => typeof r == "number").sort((r, C) => C[1] - r[1]).slice(0, u).map(([r, C]) => `${wi(r)} ${xe(C, 2)}`) : [];
    }
    const Yn = B(() => Kn(H.value?.desires, 3)), gi = B(() => Kn(H.value?.emotions, 3)), Ji = B(() => {
      const d = H.value?.learning?.theta_drift;
      return d ? Object.values(d).reduce((u, r) => u + Math.abs(r || 0), 0) : 0;
    }), ht = B(() => Je.value?.episode || null), yi = (d) => {
      const u = { euthymic: "life.companion.episode.euthymic", subthreshold: "life.companion.episode.subthreshold", episode: "life.companion.episode.episode" };
      return u[d] ? a(u[d]) : "—";
    }, we = B(() => pe.value?.life || null), St = $(!1), Ln = $("start"), Tn = $(!0);
    function Xi() {
      const d = we.value?.born_at;
      if (!d) return "—";
      const u = Date.now() - new Date(d).getTime();
      if (!isFinite(u) || u < 0) return "—";
      const r = Math.floor(u / 864e5), C = Math.floor(u % 864e5 / 36e5);
      return r > 0 ? a("life.companion.life.ageDaysHours", { days: r, hours: C }) : a("life.companion.life.ageHours", { hours: C });
    }
    function Jn() {
      return Ln.value === "start" ? a("life.companion.life.starting") : a("life.companion.life.pausing");
    }
    async function Sn() {
      St.value = !0, Ln.value = "start";
      try {
        const d = await Ge("life_start", { greet: Tn.value });
        d && Ae(d.greeting ? a("life.companion.flash.lifeStartedGreeting", { greeting: d.greeting }) : a("life.companion.flash.lifeStarted"));
      } finally {
        St.value = !1;
      }
    }
    async function Xn() {
      St.value = !0, Ln.value = "stop";
      try {
        await Ge("life_stop", {}) && Ae(a("life.companion.flash.lifeStopped"));
      } finally {
        St.value = !1;
      }
    }
    function Qi(d, u) {
      Object.assign(m.value, d), Qt().then(() => Ae(a("life.companion.flash.presetApplied", { label: u })));
    }
    const sn = [
      { labelKey: "life.companion.preset.regular", fields: { cog_affect_enabled: !0, cog_affect_profile: "typical", cog_affect_threat: 0.2, cog_affect_reward: 1, cog_attachment_enabled: !1, cog_tsundere_enabled: !1, cog_personadyn_enabled: !1 } },
      { labelKey: "life.companion.preset.depression", fields: { cog_affect_enabled: !0, cog_affect_profile: "depression", cog_affect_threat: 0.45, cog_affect_reward: 0.7 } },
      { labelKey: "life.companion.preset.tsundere", fields: { cog_tsundere_enabled: !0, cog_tsundere_type: "tsundere.classic" } },
      { labelKey: "life.companion.preset.personadyn", fields: { cog_personadyn_enabled: !0, cog_personadyn_type: "pdt.1" } },
      { labelKey: "life.companion.preset.yandereSecluded", fields: { cog_affect_enabled: !0, cog_affect_profile: "depression", cog_attachment_enabled: !0, cog_attachment_type: "attach.secluded" } },
      { labelKey: "life.companion.preset.yandereDependent", fields: { cog_affect_enabled: !0, cog_attachment_enabled: !0, cog_attachment_type: I("life.companion.attach.dependent") } },
      { labelKey: "life.companion.preset.yandereDelusional", fields: { cog_affect_enabled: !0, cog_affect_profile: "depression", cog_attachment_enabled: !0, cog_attachment_type: I("life.companion.attach.delusional") } }
    ], bi = B(() => pe.value?.wave2?.somatic_channels || null), wi = (d) => {
      const u = { fatigue: "channel.fatigue", pain: "channel.pain", cardiorespiratory: "channel.cardiorespiratory", gastrointestinal: "channel.gastrointestinal", dizziness: "channel.dizziness", sleep: "channel.sleep" };
      return u[d] ? a(`life.companion.${u[d]}`) : d;
    }, xi = (d) => Math.max(0.02, Math.min(1, Number(d))).toFixed(3), ki = B(() => {
      const d = Kt.value?.evidence || {};
      return Object.entries(d).map(([u, r]) => a("life.companion.evidencePair", { dim: u, words: r.join(a("life.companion.listSeparator")) })).join(a("life.companion.evidenceSeparator"));
    });
    function xe(d, u = 3) {
      return d == null || d === "" ? "—" : Number(d).toFixed(u);
    }
    const Cn = B(() => (Z.value.timeline || []).filter((d) => d.topic === I("life.companion.val.world")).slice(0, 30)), Qn = B(() => Z.value.commitments || []), Pi = B(() => Z.value.user_model || []), Li = B(() => Object.entries(Z.value.values || {}).map(([d, u]) => ({ k: d, v: Number(u) })).sort((d, u) => Math.abs(u.v) - Math.abs(d.v)).slice(0, 20));
    function ei(d) {
      try {
        const u = JSON.parse(d || "[]");
        return Array.isArray(u) ? u : [];
      } catch {
        return [];
      }
    }
    const Mn = B(() => Z.value.emotion || null), Ct = B(() => Z.value.circadian || null), ti = B(() => Z.value.relationships || []), zn = (d) => Math.max(0, Math.min(1, d)), En = B(() => {
      const d = Mn.value || {}, u = Math.max(-1, Math.min(1, Number(d.valence) || 0)), r = zn(Number(d.arousal ?? 0.5));
      return { x: (10 + (u + 1) / 2 * 100).toFixed(1), y: (110 - r * 100).toFixed(1) };
    }), Ti = B(() => {
      const d = Mn.value;
      if (!d) return "life.companion.quadrant.serene";
      const u = Number(d.valence) >= 0, r = Number(d.arousal) >= 0.5;
      return u ? r ? "life.companion.quadrant.excited" : "life.companion.quadrant.serene" : r ? "life.companion.quadrant.tense" : "life.companion.quadrant.gloomy";
    }), it = (d) => d <= -jo ? "lo" : d >= jo ? "hi" : "mid";
    function S(d, u, r, C) {
      const M = Number(r);
      if (!isFinite(M)) return null;
      const ee = zn(M / C.max), ae = C.signed ? it(M) : ee < 0.34 ? "lo" : ee < 0.67 ? "mid" : "hi", ue = {
        label: u,
        value: M,
        max: C.max,
        kind: C.kind,
        signed: !!C.signed,
        effect: a(`life.companion.effect.${d}`),
        display: xe(M, 2),
        alias: a(`life.companion.alias.${d}`),
        state: a(`life.companion.gw.${d}.${ae}`),
        stateTone: "mid"
      };
      return ue.stateTone = ue.signed ? ue.value >= 0 ? "good" : "bad" : ft(ue), ue;
    }
    function pt(d) {
      return zn(d.value / d.max);
    }
    function ft(d) {
      const u = pt(d);
      return d.kind === "neutral" ? "mid" : d.kind === "bad" ? u >= 0.67 ? "bad" : u < 0.34 ? "good" : "mid" : u >= 0.67 ? "good" : u < 0.34 ? "bad" : "mid";
    }
    function ot(d) {
      const u = zn(Math.abs(d)) * 50;
      return { width: `${u}%`, left: d >= 0 ? "50%" : `${50 - u}%` };
    }
    const yt = (d) => d.filter((u) => u !== null), ni = B(() => {
      const d = Mn.value || {};
      return yt([
        S("valence", a("life.companion.gauge.valence"), d.valence, { max: 1, kind: "neutral", signed: !0 }),
        S("arousal", a("life.companion.gauge.arousal"), d.arousal, { max: 1, kind: "neutral" }),
        S("connection", a("life.companion.gauge.connection"), d.connection, { max: 1, kind: "good" }),
        S("irritation", a("life.companion.gauge.irritation"), d.irritation, { max: 1, kind: "bad" })
      ]);
    }), Si = B(() => {
      const d = Ct.value || {};
      return yt([
        S("energy", a("life.companion.body.energy"), d.mental_energy, { max: 100, kind: "good" }),
        S("hunger", a("life.companion.body.hunger"), d.hunger, { max: 100, kind: "bad" }),
        S("health", a("life.companion.body.health"), d.health, { max: 100, kind: "good" })
      ]);
    }), Yt = B(() => yt([
      S("mood", a("life.companion.gauge.mood"), Je.value?.mood, { max: 1, kind: "neutral", signed: !0 }),
      S("vagal", a("life.companion.gauge.vagal"), Je.value?.vagal_tone, { max: 1, kind: "good" }),
      S("somatization", a("life.companion.gauge.somatization"), Je.value?.somatization_index, { max: 1, kind: "bad" }),
      S("healthAnxiety", a("life.companion.gauge.healthAnxiety"), Je.value?.health_anxiety, { max: 1, kind: "bad" }),
      S("somaticBurden", a("life.companion.gauge.somaticBurden"), Je.value?.somatic_burden, { max: 1, kind: "bad" }),
      S("allostatic", a("life.companion.gauge.allostatic"), Je.value?.allostatic_load, { max: 1, kind: "bad" }),
      S("loneliness", a("life.companion.gauge.loneliness"), Je.value?.loneliness, { max: 1, kind: "bad" })
    ])), Ci = B(() => yt([
      S("empathy", a("life.companion.gauge.empathy"), an.value?.empathy, { max: 1, kind: "good" }),
      S("patience", a("life.companion.gauge.patience"), jn.value?.patience, { max: 1, kind: "good" })
    ])), eo = B(() => yt([
      S("distress", a("life.companion.gauge.distress"), $e.value?.distress, { max: 1, kind: "bad" }),
      S("comorbid", a("life.companion.gauge.comorbid"), $e.value?.comorbid_depression, { max: 1, kind: "bad" })
    ])), to = B(() => yt([
      S("affection", a("life.companion.gauge.affection"), Ie.value?.affection, { max: 1, kind: "good" }),
      S("tsun", a("life.companion.gauge.tsun"), Ie.value?.expression, { max: 1, kind: "neutral" }),
      S("fixation", a("life.companion.gauge.fixation"), Ie.value?.fixation, { max: 1, kind: "bad" })
    ])), no = B(() => yt([
      S("jealousy", a("life.companion.gauge.jealousy"), je.value?.jealousy, { max: 1, kind: "bad" }),
      S("intensity", a("life.companion.gauge.intensity"), je.value?.intensity, { max: 1, kind: "neutral" }),
      S("darkness", a("life.companion.gauge.darkness"), je.value?.darkness, { max: 1, kind: "bad" })
    ])), io = B(() => yt([
      S("pdPressure", a("life.companion.gauge.pdPressure"), H.value?.pressure, { max: 1, kind: "bad" }),
      S("pdAffection", a("life.companion.gauge.pdAffection"), H.value?.affection, { max: 1, kind: "good" }),
      S("pdAnxiety", a("life.companion.gauge.pdAnxiety"), H.value?.anxiety, { max: 1, kind: "bad" }),
      S("pdPossession", a("life.companion.gauge.pdPossession"), H.value?.possessiveness, { max: 1, kind: "bad" }),
      S("pdTrust", a("life.companion.gauge.pdTrust"), H.value?.trust, { max: 1, kind: "good" }),
      S("pdSelfControl", a("life.companion.gauge.pdSelfControl"), H.value?.self_control, { max: 1, kind: "good" }),
      S("pdSuppression", a("life.companion.gauge.pdSuppression"), H.value?.suppression, { max: 1, kind: "bad" })
    ])), On = ["警惕", "疏离", "陌生", "认识", "熟悉", "友好", "亲近", "亲密"], Mi = ["回避", "受伤", "放松", "活泼", "温暖", "亲近", "爱意"], ln = (d) => On.includes(d) ? a(`life.companion.relStage.${d}`) : d || "—", zi = (d) => On.indexOf(d), oo = (d) => Mi.includes(d) ? a(`life.companion.interaction.${d}`) : d || "—", ao = (d) => Mi.includes(d) ? a(`life.companion.interactionEffect.${d}`) : "", m = $({}), rn = $("off"), Zt = $(!0), un = B(() => [
      { value: "off", label: a("life.companion.worldDensity.off") },
      { value: "texture", label: a("life.companion.worldDensity.texture") },
      { value: "full", label: a("life.companion.worldDensity.full") }
    ]), Jt = $("fictional"), Xt = $(""), bt = $(""), Q = $(""), fe = $(""), Mt = $(""), mt = $(""), _t = $(""), Xe = $(!1), G = $(!1), ke = B(() => [
      { value: "fictional", label: a("life.companion.worldFictional.fictional") },
      { value: "real", label: a("life.companion.worldFictional.real") }
    ]), at = B(() => Z.value.worldview || null), J = B(() => at.value?.map || { locations: [], edges: [], actors: [], width: 1e3, height: 700, title: "" }), Qe = B(() => at.value?.actor_locations || {}), so = ["home", "work", "shop", "food", "park", "transit", "other"], An = { home: "life.companion.kind.home", work: "life.companion.kind.work", shop: "life.companion.kind.shop", food: "life.companion.kind.food", park: "life.companion.kind.park", transit: "life.companion.kind.transit", other: "life.companion.kind.other" }, zt = { home: "#e07a5f", work: "#5b8def", shop: "#e0a23d", food: "#57a773", park: "#3faead", transit: "#8b6fd6", other: "#8a94a6" }, Ce = B(() => so.filter((d) => (J.value.locations || []).some((u) => (u.kind || "other") === d)));
    function Me(d) {
      const u = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
      return String(d ?? "").replace(/[&<>"']/g, (r) => u[r]);
    }
    const Et = $(null), wt = $(!1);
    let _e = null, N = null, cn = "";
    const In = ["#2b4250", "#33495a", "#2f4a44", "#3a4258", "#463f4f", "#3d4a3a", "#4a4436", "#39485c"], dn = ["#dfe4ea", "#d6dce4", "#e6eaf0", "#cfd7e0"];
    let Nt = "";
    const Ot = $("city"), xt = {};
    function Bn(d, u, r) {
      (xt[d] || (xt[d] = [])).push({ layer: u, base: r });
    }
    function vt(d) {
      Nt = Nt === d ? "" : d;
      for (const [u, r] of Object.entries(xt)) {
        const C = u === Nt;
        for (const { layer: M, base: ee } of r)
          M.setStyle && M.setStyle({ ...ee, weight: (ee.weight || 2) + (C ? 3.5 : 0), opacity: C ? 1 : ee.opacity ?? 1 }), C && M.bringToFront && M.bringToFront();
      }
    }
    function lo() {
      Nt = "", hn(!1);
    }
    function j() {
      Ot.value = Ot.value === "city" ? "nation" : "city", hn(!1);
    }
    function qe() {
      return { w: J.value.width || 1e3, h: J.value.height || 700 };
    }
    function Y(d, u) {
      return [qe().h - u, d];
    }
    function st(d, u) {
      return D.divIcon({ className: "wm-route", html: `<span class="wm-route-inner" style="--c:${u}">${Me(d)}</span>`, iconSize: [0, 0], iconAnchor: [0, 0] });
    }
    function ii(d, u) {
      return D.divIcon({ className: "wm-route wm-minor", html: `<span class="wm-route-inner" style="--c:${u}">${Me(d)}</span>`, iconSize: [0, 0], iconAnchor: [0, 0] });
    }
    function oi(d, u) {
      return D.divIcon({ className: "wm-route wm-station", html: `<span class="wm-route-inner" style="--c:${u}">${Me(d)}</span>`, iconSize: [0, 0], iconAnchor: [0, 0] });
    }
    function Zn(d) {
      const u = [], r = [];
      for (const C of d) {
        const M = String(C.text).length * 13 + 20, ee = 22;
        u.some((ue) => Math.abs(ue.x - C.x) < (ue.w + M) / 2 && Math.abs(ue.y - C.y) < (ue.h + ee) / 2) || (u.push({ x: C.x, y: C.y, w: M, h: ee }), r.push(C));
      }
      return r;
    }
    function Dt() {
      const d = J.value.kind === "real" ? "real" : "fictional";
      if (_e && cn !== d && (_e.remove(), _e = null, N = null), !(_e || !Et.value)) {
        if (d === "real") {
          wt.value = !1, _e = D.map(Et.value, { zoomControl: !0, attributionControl: !0 }).setView([35, 105], 5);
          const u = D.tileLayer(ff, { subdomains: ["1", "2", "3", "4"], maxZoom: 19, minZoom: 3, attribution: a("life.companion.map.attribution") });
          u.on("tileerror", () => {
            wt.value = !0;
          }), u.on("load", () => {
            wt.value = !1;
          }), u.addTo(_e);
        } else {
          wt.value = !1;
          const { w: u, h: r } = qe();
          _e = D.map(Et.value, { crs: D.CRS.Simple, zoomControl: !0, attributionControl: !1, minZoom: -3, maxZoom: 3 }).setView([r / 2, u / 2], -1.5);
          for (const [M, ee] of [["pWater", 350], ["pParks", 360], ["pBlocks", 370], ["pRoads", 380], ["pMetro", 400], ["pBus", 410], ["pLabels", 620]])
            _e.createPane(M), _e.getPane(M).style.zIndex = String(ee);
          const C = () => _e.getContainer().classList.toggle("wm-zoom-low", _e.getZoom() < 0);
          _e.on("zoomend", C), setTimeout(C, 0);
        }
        cn = d, N = D.layerGroup().addTo(_e);
      }
    }
    function hn(d = !1) {
      if (!_e || !N) return;
      N.clearLayers();
      for (const M of Object.keys(xt)) delete xt[M];
      Nt = "";
      const u = J.value.locations || [];
      if (!u.length) return;
      const r = cn !== "real", C = {};
      for (const M of u) C[M.id] = M;
      if (r) {
        const { w: M, h: ee } = qe(), ae = (P) => P.map((le) => Y(le[0], le[1])), ue = J.value.nation;
        if (Ot.value === "nation" && ue) {
          D.rectangle([[0, 0], [ee, M]], { pane: "pWater", stroke: !1, fillColor: "#d9e6f0", fillOpacity: 1 }).addTo(N), D.polygon(ae(ue.land), { pane: "pWater", color: "#8fbfe6", weight: 1.5, fillColor: "#f4efe1", fillOpacity: 1 }).addTo(N), (ue.provinces || []).forEach((P, le) => {
            D.polygon(ae(P.points), { pane: "pParks", color: "#c9b98f", weight: 1, fillColor: le % 2 ? "#ece2c8" : "#e4d7b4", fillOpacity: 0.55 }).addTo(N), D.marker(ae([P.label])[0], { pane: "pLabels", interactive: !1, icon: st(P.name, "#8a7a5c") }).addTo(N);
          }), (ue.routes || []).forEach((P) => D.polyline(ae(P.points), { pane: "pRoads", color: "#b98a4a", weight: 2.5, dashArray: "2 7" }).addTo(N)), (ue.cities || []).forEach((P) => {
            const le = Y(P.x, P.y);
            D.circleMarker(le, { pane: "pLabels", radius: P.capital ? 9 : 6, color: "#ffffff", weight: 2, fillColor: P.capital ? "#d64545" : "#3a6ea5", fillOpacity: 1 }).bindPopup(Me(P.name)).addTo(N), D.marker(le, { pane: "pLabels", interactive: !1, icon: st(P.name, P.capital ? "#d64545" : "#3a6ea5") }).addTo(N);
          }), _e.fitBounds([[0, 0], [ee, M]], { padding: [6, 6] });
          return;
        }
        D.rectangle([[0, 0], [ee, M]], { pane: "pWater", stroke: !1, fillColor: "#eef1f4", fillOpacity: 1 }).addTo(N), (J.value.compounds || []).forEach((P) => {
          D.polygon(ae(P.points), { pane: "pParks", color: "#c9b98f", weight: 1.2, dashArray: "7 5", fillColor: "#f3ead0", fillOpacity: 0.5 }).addTo(N), D.marker(ae(P.points)[0], { pane: "pLabels", interactive: !1, icon: st(P.name, "#a9884a") }).addTo(N);
        }), (J.value.lakes || []).forEach((P) => {
          D.polygon(ae(P.points), { pane: "pWater", color: "#8fbfe6", weight: 1.5, fillColor: "#bcd9f0", fillOpacity: 1 }).addTo(N), P.name && P.name !== "" && D.marker(Y(P.label[0], P.label[1]), { pane: "pLabels", interactive: !1, icon: st(P.name, "#3d7fb5") }).addTo(N);
        }), (J.value.rivers || []).forEach((P) => {
          D.polyline(ae(P.points), { pane: "pWater", color: "#8fbfe6", weight: 16, lineCap: "round", lineJoin: "round" }).addTo(N), D.polyline(ae(P.points), { pane: "pWater", color: "#bcd9f0", weight: 11, lineCap: "round", lineJoin: "round" }).addTo(N), P.name && P.name !== "" && D.marker(ae(P.points)[Math.floor(P.points.length / 2)], { pane: "pLabels", interactive: !1, icon: st(P.name, "#3d7fb5") }).addTo(N);
        }), (J.value.parks || []).forEach((P) => {
          D.polygon(ae(P.points), { pane: "pParks", color: "#a9d3a0", weight: 1, fillColor: "#c9e6c4", fillOpacity: 1 }).addTo(N), (P.trees || []).forEach((le) => D.circleMarker(Y(le[0], le[1]), { pane: "pParks", radius: 2.6, stroke: !1, fillColor: "#82bd79", fillOpacity: 1 }).addTo(N)), P.name && P.name !== I("life.companion.val.park") && D.marker(ae(P.points)[0], { pane: "pLabels", interactive: !1, icon: st(P.name, "#5a9e52") }).addTo(N);
        });
        const ui = [];
        (J.value.blocks || []).forEach((P) => {
          const le = ae(P.points);
          if (D.polygon(le.map((ge) => [ge[0] - 3, ge[1] + 3]), { pane: "pBlocks", stroke: !1, fillColor: "#5b6b7a", fillOpacity: 0.16 }).addTo(N), D.polygon(le, { pane: "pBlocks", color: "#b9c3cd", weight: 1, fillColor: dn[(P.shade || 0) % dn.length], fillOpacity: 1 }).addTo(N), P.tower) {
            const ge = le.reduce((ze, Oe) => ze + Oe[0], 0) / le.length, Be = le.reduce((ze, Oe) => ze + Oe[1], 0) / le.length;
            D.polygon(
              le.map((ze) => [ge + (ze[0] - ge) * 0.5, Be + (ze[1] - Be) * 0.5]),
              { pane: "pBlocks", color: "#aab4c0", weight: 1, fillColor: "#eef2f6", fillOpacity: 1 }
            ).addTo(N);
          }
          if (P.name) {
            const ge = P.points.reduce((ze, Oe) => ze + Oe[0], 0) / P.points.length, Be = P.points.reduce((ze, Oe) => ze + Oe[1], 0) / P.points.length;
            ui.push({ x: ge, y: Be, text: P.name, color: P.tower ? "#6b5b8a" : "#7a8794" });
          }
        }), (J.value.named_buildings || []).forEach((P) => {
          D.circleMarker(Y(P.x, P.y), { pane: "pLabels", radius: 4, color: "#ffffff", weight: 1.5, fillColor: "#8a5a2b", fillOpacity: 1 }).addTo(N), D.marker(Y(P.x, P.y), { pane: "pLabels", interactive: !1, icon: st(P.name, "#8a5a2b") }).addTo(N);
        });
        for (const P of Zn(ui))
          D.marker(Y(P.x, P.y), { pane: "pLabels", interactive: !1, icon: ii(P.text, P.color) }).addTo(N);
        const ci = {
          highway: { casing: 13, fill: 6.5, color: "#f08c2e" },
          arterial: { casing: 10, fill: 4.5, color: "#f7cf8a" },
          street: { casing: 5, fill: 2.4, color: "#ffffff" }
        };
        (J.value.streets || []).forEach((P) => {
          const le = ci[P.kind] || ci.street, ge = ae(P.points);
          D.polyline(ge, { pane: "pRoads", color: "#ffffff", weight: le.casing, lineCap: "round", lineJoin: "round" }).addTo(N), D.polyline(ge, { pane: "pRoads", color: le.color, weight: le.fill, lineCap: "round", lineJoin: "round" }).addTo(N);
        }), (J.value.roads || []).forEach((P, le) => {
          if (!P.name) return;
          const ge = ae(P.points), Be = "road:" + le;
          D.polyline(ge, { pane: "pRoads", color: "#ffffff", weight: 11, lineCap: "round", lineJoin: "round" }).addTo(N);
          const ze = { pane: "pRoads", color: "#f6c56b", weight: 5, opacity: 1, lineCap: "round", lineJoin: "round" };
          Bn(Be, D.polyline(ge, ze).on("click", () => vt(Be)).addTo(N), ze), D.marker(ge[Math.floor(ge.length / 2)], { pane: "pLabels", interactive: !0, icon: st(P.name, "#9a8358") }).on("click", () => vt(Be)).addTo(N);
        }), (J.value.districts || []).forEach((P, le) => {
          D.circle(Y(P.x, P.y), { pane: "pRoads", radius: P.r || 200, color: "#93a2b0", weight: 1, dashArray: "4 7", fillColor: In[le % In.length], fillOpacity: 0.08 }).addTo(N), D.marker(Y(P.x, P.y), { pane: "pLabels", interactive: !1, icon: D.divIcon({ className: "wm-district", html: `<span class="wm-district-inner">${Me(P.name)}</span>`, iconSize: [0, 0], iconAnchor: [0, 0] }) }).addTo(N);
        });
        const Ni = [];
        (J.value.metro || []).forEach((P, le) => {
          const ge = ae(P.points), Be = "metro:" + le;
          D.polyline(ge, { pane: "pMetro", color: "#ffffff", weight: 8, lineCap: "round", lineJoin: "round" }).addTo(N);
          const ze = { pane: "pMetro", color: P.color, weight: 4.5, opacity: 0.92, lineCap: "round", lineJoin: "round" };
          Bn(Be, D.polyline(ge, ze).on("click", () => vt(Be)).addTo(N), ze), (P.stations || []).forEach((Oe) => {
            D.circleMarker(Y(Oe.x, Oe.y), { pane: "pMetro", radius: 5, color: "#ffffff", weight: 2.5, fillColor: P.color, fillOpacity: 1 }).bindPopup(Me(Oe.name || P.name)).on("click", () => vt(Be)).addTo(N), Oe.name && Ni.push({ x: Oe.x, y: Oe.y, text: Oe.name, color: P.color });
          }), D.marker(ge[Math.floor(ge.length / 2)], { pane: "pLabels", interactive: !0, icon: st(P.name, P.color) }).on("click", () => vt(Be)).addTo(N);
        }), (J.value.bus || []).forEach((P, le) => {
          const ge = ae(P.points), Be = "bus:" + le, ze = { pane: "pBus", color: P.color, weight: 3, opacity: 0.95, dashArray: "7 7", lineCap: "round" };
          Bn(Be, D.polyline(ge, ze).on("click", () => vt(Be)).addTo(N), ze), (P.stops || []).forEach((Oe) => D.circleMarker(Y(Oe.x, Oe.y), { pane: "pBus", radius: 3.2, color: "#ffffff", weight: 1.5, fillColor: P.color, fillOpacity: 1 }).bindPopup(Me(Oe.name || P.name)).on("click", () => vt(Be)).addTo(N)), D.marker(ge[Math.floor(ge.length / 2)], { pane: "pLabels", interactive: !0, icon: st(P.name, P.color) }).on("click", () => vt(Be)).addTo(N);
        });
        for (const P of Zn(Ni))
          D.marker(Y(P.x, P.y), { pane: "pLabels", interactive: !1, icon: oi(P.text, P.color) }).addTo(N);
      } else
        for (const M of J.value.edges || []) {
          const ee = C[M[0]], ae = C[M[1]];
          ee?.lat != null && ae?.lat != null && D.polyline([[ee.lat, ee.lng], [ae.lat, ae.lng]], { color: "#5b8def", weight: 3, opacity: 0.55, dashArray: "2 8", lineCap: "round" }).addTo(N);
        }
      for (const M of u) {
        const ee = zt[M.kind] || zt.other, ae = r ? Y(M.x, M.y) : M.lat != null ? [M.lat, M.lng] : null;
        if (!ae) continue;
        const ue = D.divIcon({
          className: "wm-pin-holder",
          html: `<span class="wm-pin" style="--c:${ee}"></span><span class="wm-pin-label">${Me(M.name)}</span>`,
          iconSize: [0, 0],
          iconAnchor: [0, 0]
        });
        D.marker(ae, { icon: ue }).bindPopup(`<b>${Me(M.name)}</b>${M.desc ? "<br>" + Me(M.desc) : ""}`).addTo(N);
      }
      for (const M of J.value.actors || []) {
        const ee = C[Qe.value[M.id] || M.location];
        if (!ee) continue;
        const ae = r ? Y(ee.x, ee.y) : ee.lat != null ? [ee.lat, ee.lng] : null;
        if (!ae) continue;
        const ue = D.divIcon({
          className: "wm-actor-holder",
          html: `<span class="wm-actor-badge">${Me((M.name || "?").slice(0, 1))}</span><span class="wm-actor-name">${Me(M.name)}</span>`,
          iconSize: [0, 0],
          iconAnchor: [0, 0]
        });
        D.marker(ae, { icon: ue }).bindPopup(`${Me(M.name)} · ${Me(ee.name)}`).addTo(N);
      }
      if (!d)
        if (r) {
          const { w: M, h: ee } = qe();
          _e.fitBounds([[0, 0], [ee, M]], { padding: [0, 0] });
        } else {
          const M = u.filter((ee) => ee.lat != null).map((ee) => [ee.lat, ee.lng]);
          M.length > 1 ? _e.fitBounds(M, { padding: [56, 56], maxZoom: 15 }) : M.length === 1 && _e.setView(M[0], 14);
        }
    }
    wn([se, () => Z.value.worldview], async () => {
      se.value === "world" && (await Ki(), Dt(), hn(), _e && setTimeout(() => _e.invalidateSize(), 80));
    }), yo(() => {
      _e && (_e.remove(), _e = null, N = null);
    });
    function pn() {
      m.value = { ...ie() }, Lt(), rn.value = String(Z.value.settings?.world_density || "off"), Zt.value = String(Z.value.settings?.world_scene ?? "1") !== "0", Jt.value = String(Z.value.settings?.world_fictional || "fictional"), Xt.value = String(Z.value.settings?.world_country || ""), bt.value = String(Z.value.settings?.world_city || ""), Q.value = String(Z.value.settings?.world_district || ""), fe.value = String(Z.value.settings?.world_premise || ""), Mt.value = String(Z.value.settings?.persona_text || ""), mt.value = String(Z.value.settings?.world_actors || ""), _t.value = String(Z.value.settings?.world_places || ""), fn.value = kt();
    }
    const ve = $(!1);
    function kt() {
      return JSON.stringify({
        ...dt(),
        ...He(),
        world_density: rn.value,
        world_scene: Zt.value ? "1" : "0",
        world_fictional: Jt.value,
        world_country: Xt.value,
        world_city: bt.value,
        world_district: Q.value,
        world_premise: fe.value,
        world_actors: mt.value,
        world_places: _t.value,
        persona_text: Mt.value
      });
    }
    const fn = $(""), mn = B(() => !Pe.value && fn.value !== "" && kt() !== fn.value);
    function Ei(d) {
      mn.value && (d.preventDefault(), d.returnValue = "");
    }
    let _n = null;
    function ye(d) {
      return m.value.cog_enabled ? d ? { cls: "ok", text: a("life.companion.badge.on") } : { cls: "", text: a("life.companion.badge.off") } : { cls: "core-off", text: a("life.companion.badge.coreOff") };
    }
    async function ro() {
      if (await g({
        title: a("life.companion.resetDefaults"),
        message: a("life.companion.resetDefaultsConfirm"),
        confirmLabel: a("life.companion.resetDefaults")
      })) {
        for (const [u, r] of Object.entries(Le))
          m.value[u] = Ve.includes(u) ? r === "1" : Te.includes(u) ? r : Number(r);
        Ae(a("life.companion.flash.resetDefaults"));
      }
    }
    async function Qt() {
      if (!ve.value) {
        ve.value = !0;
        try {
          const d = {
            ...dt(),
            ...He(),
            world_density: rn.value,
            world_scene: Zt.value ? "1" : "0",
            world_fictional: Jt.value,
            world_country: Xt.value,
            world_city: bt.value,
            world_district: Q.value,
            world_premise: fe.value,
            world_actors: mt.value,
            world_places: _t.value,
            persona_text: Mt.value
          }, u = await Ge("settings_set", { settings: d });
          u?.rejected?.length ? Ae(a("life.companion.flash.settingsSavedIgnored", { items: u.rejected.join(a("life.companion.listSeparator")) })) : Ae(a("life.companion.flash.settingsSaved")), fn.value = kt();
        } finally {
          ve.value = !1;
        }
      }
    }
    const oe = $([]), uo = $([]);
    $(!1);
    async function lt() {
      const d = await Ge("adapter_list", {});
      d && (oe.value = d.instances || [], uo.value = d.runtime || []);
    }
    async function vn() {
      if (!(Xe.value || !await g({
        title: a("life.companion.world.rewriteTitle"),
        message: a("life.companion.world.rewriteMessage"),
        confirmLabel: a("life.companion.world.overwriteConfirm"),
        danger: !0
      }))) {
        Xe.value = !0;
        try {
          (await Ge("world_generate", { instructions: "" }))?.worldview && Ae(a("life.companion.flash.worldGenerated"));
        } finally {
          Xe.value = !1;
        }
      }
    }
    async function Oi() {
      if (!Xe.value) {
        Xe.value = !0;
        try {
          (await Ge("world_map_generate", { instructions: "" }))?.worldview && Ae(a("life.companion.flash.mapRegenerated"));
        } finally {
          Xe.value = !1;
        }
      }
    }
    async function co() {
      if (!await g({
        title: a("life.companion.world.clearTitle"),
        message: a("life.companion.world.clearMessage"),
        confirmLabel: a("life.companion.world.clearConfirm"),
        danger: !0
      })) return;
      await Ge("world_clear", {}) && Ae(a("life.companion.flash.worldCleared"));
    }
    async function ai() {
      if (!(!await g({
        title: a("life.companion.reset.title"),
        message: a("life.companion.reset.message"),
        confirmLabel: a("life.companion.reset.continue"),
        danger: !0
      }) || !await g({
        title: a("life.companion.reset.confirmTitle"),
        message: a("life.companion.reset.confirmMessage"),
        confirmLabel: a("life.companion.reset.confirm"),
        danger: !0
      }))) {
        G.value = !0;
        try {
          await Ge("reset_person", {}), Ae(a("life.companion.flash.personReset")), await ct();
        } finally {
          G.value = !1;
        }
      }
    }
    const Nn = () => ({ name: "", avatar: "", birthDate: "", gender: "", description: "", personality: "", greeting: "", customPrompt: "" }), gn = B(() => [
      { value: "", label: a("life.companion.gender.none") },
      { value: "female", label: a("life.companion.gender.female") },
      { value: "male", label: a("life.companion.gender.male") },
      { value: "other", label: a("life.companion.gender.other") }
    ]);
    function ho(d) {
      return (gn.value.find((u) => u.value === d) || gn.value[0]).label;
    }
    const ce = $(Nn()), yn = $(!1);
    function Ai() {
      return globalThis.__0KAY_HOST__;
    }
    function rt() {
      const d = Ai();
      if (d?.getPersona) {
        ce.value = { ...Nn(), ...d.getPersona() || {} };
        return;
      }
      try {
        const u = JSON.parse(localStorage.getItem("0kay_config") || "{}");
        ce.value = { ...Nn(), ...u.persona || {} };
      } catch {
        ce.value = Nn();
      }
    }
    const w = $(null), bn = $(!1), At = B(() => [
      { value: "", label: a("life.companion.gender.undecidedBracket") },
      ...(w.value?.options?.character || []).map((d) => ({ value: d.key, label: d.label }))
    ]), Ii = B(() => [
      { value: "", label: a("life.companion.gender.undecidedBracket") },
      ...(w.value?.options?.relationship || []).map((d) => ({
        value: d.key,
        label: d.label + (d.pathological ? a("life.companion.relationship.pathologicalSuffix") : "")
      }))
    ]);
    function si() {
      return { text: [ce.value.description, ce.value.personality].filter((d) => String(d || "").trim()).join(`
`) };
    }
    wn(() => [ce.value.description, ce.value.personality, ce.value.customPrompt], () => {
      w.value = null;
    });
    function li(d) {
      return (w.value?.options?.relationship || []).find((u) => u.key === d);
    }
    wn(() => w.value?.relationship?.key, (d) => {
      const u = w.value?.attachment;
      if (!u) return;
      const r = li(d);
      u.type = r?.pathological && r.attachment_type || "";
    }, { immediate: !0 }), wn(() => w.value?.attachment?.type, (d) => {
      const u = w.value?.attachment;
      if (!(!d || !u)) {
        (!u.initial || typeof u.initial != "object") && (u.initial = {});
        for (const [r, C] of Object.entries({ A: 0.05, Am: 0, Tr: 0.5, J: 0, X: 0.05, S: 0.6, O: 0 }))
          u.initial[r] == null && (u.initial[r] = C);
      }
    });
    async function po() {
      const d = si();
      if (!d.text.trim()) {
        Ae(a("life.companion.flash.needDescriptionOrPersonality"));
        return;
      }
      bn.value = !0;
      try {
        const u = await Ge("persona_analyze", { text: d.text, gender: ce.value.gender });
        u && (w.value = u, w.value.personadynGender = u.personadyn?.gender || X(m.cog_personadyn_gender) || I("life.companion.pdGender.unspecified"), !ce.value.gender && u.gender && (ce.value.gender = u.gender), Ae(u.source === "llm" ? a("life.companion.flash.analyzedLlm") : a("life.companion.flash.analyzedLocal")));
      } finally {
        bn.value = !1;
      }
    }
    async function Bi() {
      if (!w.value) {
        Ae(a("life.companion.flash.needLlmFirst"));
        return;
      }
      yn.value = !0;
      try {
        const d = si(), u = { ...w.value.traits || {} };
        if (u.gender = w.value.gender || ce.value.gender || null, u.character = w.value.character?.key || null, u.relationship = w.value.relationship?.key || null, u.expression = w.value.character?.expression || w.value.expression || null, delete u.axes, !await Ge("persona_apply", {
          text: d.text,
          traits: u,
          attachment: w.value.attachment || {},
          tsundere: w.value.tsundere || {},
          personadyn: {
            ...w.value.personadyn || {},
            gender: w.value.personadynGender || X(m.cog_personadyn_gender) || I("life.companion.pdGender.unspecified")
          }
        })) return;
        const C = Ai();
        if (C?.setPersona)
          C.setPersona({ ...ce.value }), C.saveConfig?.();
        else {
          const M = JSON.parse(localStorage.getItem("0kay_config") || "{}");
          M.persona = { ...M.persona || {}, ...ce.value }, localStorage.setItem("0kay_config", JSON.stringify(M));
        }
        Ae(a("life.companion.flash.personaSaved"));
      } finally {
        yn.value = !1;
      }
    }
    mi(rt), wn(se, (d) => {
      d === "persona" && rt();
    }), mi(ct), mi(() => {
      window.addEventListener("beforeunload", Ei), Re && (_n = Re.beforeEach(() => mn.value ? !!window.confirm(a("life.companion.unsavedLeave")) : !0));
    }), yo(() => {
      window.removeEventListener("beforeunload", Ei), _n && (_n(), _n = null);
    });
    const Dn = $("");
    let ri;
    async function Zi() {
      if (document.visibilityState === "visible")
        try {
          Z.value = await Wo("/api/life/companion"), Dn.value = (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        } catch {
        }
    }
    function Rn() {
      document.visibilityState === "visible" && Zi();
    }
    return mi(() => {
      ri = setInterval(() => {
        Zi();
      }, 12e3), document.addEventListener("visibilitychange", Rn);
    }), yo(() => {
      ri && clearInterval(ri), document.removeEventListener("visibilitychange", Rn);
    }), Za("life-plugin-kit", Xo("pcp")), (d, u) => (_(), v(
      "main",
      {
        class: "pcp",
        ref_key: "pageEl",
        ref: re
      },
      [
        i("header", Rs, [
          i("div", Vs, [
            i("div", $s, [
              u[101] || (u[101] = i(
                "p",
                { class: "eyebrow" },
                [
                  i("b", null, "◉"),
                  O(" L.I.F.E / COGNITION")
                ],
                -1
                /* CACHED */
              )),
              i("h1", null, [
                O(
                  l(a("life.companion.title")) + " ",
                  1
                  /* TEXT */
                ),
                mn.value ? (_(), v(
                  "span",
                  Us,
                  l(a("life.companion.unsavedChanges")),
                  1
                  /* TEXT */
                )) : A("v-if", !0)
              ]),
              i(
                "p",
                Fs,
                l(a("life.companion.subtitle")),
                1
                /* TEXT */
              )
            ]),
            i("div", Hs, [
              i("button", {
                class: R(["btn", { tonic: !we.value?.alive }]),
                disabled: St.value || Pe.value,
                onClick: u[0] || (u[0] = (r) => we.value?.alive ? Xn() : Sn())
              }, l(St.value ? Jn() : we.value?.alive ? a("life.companion.life.pause") : a("life.companion.life.start")), 11, Ws),
              i("button", {
                class: R(["fab", { dirty: mn.value }]),
                disabled: ve.value || Pe.value,
                onClick: Qt
              }, [
                u[102] || (u[102] = i(
                  "span",
                  { class: "fab-ic" },
                  "✦",
                  -1
                  /* CACHED */
                )),
                O(
                  l(ve.value ? a("life.companion.saving") : a("life.companion.saveSettings")),
                  1
                  /* TEXT */
                )
              ], 10, Gs),
              i("button", {
                class: "btn",
                disabled: ve.value || Pe.value,
                onClick: ro
              }, l(a("life.companion.resetDefaults")), 9, js),
              i("button", {
                class: "btn tonic",
                disabled: Pe.value,
                onClick: ct
              }, l(Pe.value ? a("life.companion.refreshing") : a("life.companion.refresh")), 9, qs)
            ])
          ]),
          i("div", Ks, [
            i(
              "span",
              {
                class: R(["pill", { bad: pe.value && !pe.value.enabled }])
              },
              l(a("life.companion.cognitionCore")) + " " + l(pe.value?.available === !1 ? a("life.companion.status.unavailable") : pe.value?.enabled ? a("life.companion.status.running") : a("life.companion.status.stopped")),
              3
              /* TEXT, CLASS */
            ),
            i(
              "span",
              Ys,
              l(a("life.companion.state.decidedTurns", { n: Bt.value?.turns ?? 0 })),
              1
              /* TEXT */
            ),
            i(
              "span",
              Js,
              l(a("life.companion.state.engrams", { n: Bt.value?.engrams ?? 0 })),
              1
              /* TEXT */
            ),
            i(
              "span",
              Xs,
              l(a("life.companion.state.lexicon", { n: qt.value?.lexicon_size ?? 0 })),
              1
              /* TEXT */
            )
          ])
        ]),
        K.value ? (_(), v(
          "p",
          Qs,
          l(K.value),
          1
          /* TEXT */
        )) : A("v-if", !0),
        tt.value ? (_(), v(
          "p",
          el,
          l(tt.value),
          1
          /* TEXT */
        )) : A("v-if", !0),
        i("nav", {
          class: "tabs",
          "aria-label": a("life.companion.view")
        }, [
          (_(), v(
            q,
            null,
            be(W, (r) => i("button", {
              key: r.key,
              class: R(["tab", { active: se.value === r.key }]),
              onClick: (C) => kn(r.key)
            }, [
              i(
                "i",
                null,
                l(r.i),
                1
                /* TEXT */
              ),
              i(
                "span",
                il,
                l(r.icon),
                1
                /* TEXT */
              ),
              O(
                l(a(r.labelKey)),
                1
                /* TEXT */
              )
            ], 10, nl)),
            64
            /* STABLE_FRAGMENT */
          ))
        ], 8, tl),
        x(i(
          "section",
          ol,
          [
            i("div", al, [
              i("div", null, [
                i(
                  "h2",
                  null,
                  l(a("life.companion.persona.title")),
                  1
                  /* TEXT */
                ),
                i(
                  "p",
                  sl,
                  l(a("life.companion.persona.desc")),
                  1
                  /* TEXT */
                )
              ]),
              i("div", ll, [
                i("button", {
                  class: "btn tonic sm",
                  disabled: bn.value || Pe.value,
                  onClick: po
                }, l(bn.value ? a("life.companion.persona.analyzing") : a("life.companion.persona.analyze")), 9, rl),
                i("button", {
                  class: "btn filled sm",
                  disabled: yn.value || !w.value,
                  onClick: Bi
                }, l(a("life.companion.persona.save")), 9, ul)
              ])
            ]),
            i("article", cl, [
              i("div", dl, [
                i("label", null, [
                  i(
                    "span",
                    null,
                    l(a("life.companion.persona.name")),
                    1
                    /* TEXT */
                  ),
                  x(i(
                    "input",
                    {
                      "onUpdate:modelValue": u[1] || (u[1] = (r) => ce.value.name = r),
                      class: "field"
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [E, ce.value.name]
                  ])
                ]),
                i("label", null, [
                  i(
                    "span",
                    null,
                    l(a("life.companion.persona.gender")),
                    1
                    /* TEXT */
                  ),
                  Ee(Ne(De), {
                    modelValue: ce.value.gender,
                    "onUpdate:modelValue": u[2] || (u[2] = (r) => ce.value.gender = r),
                    options: gn.value,
                    "aria-label": a("life.companion.persona.gender")
                  }, null, 8, ["modelValue", "options", "aria-label"])
                ]),
                i("label", null, [
                  i(
                    "span",
                    null,
                    l(a("life.companion.persona.avatarUrl")),
                    1
                    /* TEXT */
                  ),
                  x(i(
                    "input",
                    {
                      "onUpdate:modelValue": u[3] || (u[3] = (r) => ce.value.avatar = r),
                      class: "field"
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [E, ce.value.avatar]
                  ])
                ]),
                i("label", null, [
                  i(
                    "span",
                    null,
                    l(a("life.companion.persona.birthday")),
                    1
                    /* TEXT */
                  ),
                  x(i(
                    "input",
                    {
                      "onUpdate:modelValue": u[4] || (u[4] = (r) => ce.value.birthDate = r),
                      type: "date",
                      class: "field"
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [E, ce.value.birthDate]
                  ])
                ])
              ]),
              i("label", hl, [
                i(
                  "span",
                  null,
                  l(a("life.companion.persona.description")),
                  1
                  /* TEXT */
                ),
                x(i(
                  "textarea",
                  {
                    "onUpdate:modelValue": u[5] || (u[5] = (r) => ce.value.description = r),
                    rows: "3",
                    class: "field"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [E, ce.value.description]
                ])
              ]),
              i("label", pl, [
                i(
                  "span",
                  null,
                  l(a("life.companion.persona.personality")),
                  1
                  /* TEXT */
                ),
                x(i(
                  "textarea",
                  {
                    "onUpdate:modelValue": u[6] || (u[6] = (r) => ce.value.personality = r),
                    rows: "3",
                    class: "field"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [E, ce.value.personality]
                ])
              ]),
              i("label", fl, [
                i(
                  "span",
                  null,
                  l(a("life.companion.persona.greeting")),
                  1
                  /* TEXT */
                ),
                x(i(
                  "textarea",
                  {
                    "onUpdate:modelValue": u[7] || (u[7] = (r) => ce.value.greeting = r),
                    rows: "2",
                    class: "field"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [E, ce.value.greeting]
                ])
              ]),
              i("label", ml, [
                i(
                  "span",
                  null,
                  l(a("life.companion.persona.customPrompt")),
                  1
                  /* TEXT */
                ),
                x(i(
                  "textarea",
                  {
                    "onUpdate:modelValue": u[8] || (u[8] = (r) => ce.value.customPrompt = r),
                    rows: "5",
                    class: "field"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [E, ce.value.customPrompt]
                ])
              ]),
              i(
                "p",
                _l,
                l(a("life.companion.persona.hint")),
                1
                /* TEXT */
              )
            ]),
            w.value ? (_(), v("article", vl, [
              i("h3", null, [
                O(
                  l(a("life.companion.persona.analysisResult")) + " ",
                  1
                  /* TEXT */
                ),
                i(
                  "span",
                  gl,
                  l(w.value.source === "llm" ? a("life.companion.persona.sourceLlm") : a("life.companion.persona.sourceLocal")),
                  1
                  /* TEXT */
                )
              ]),
              i("div", yl, [
                i("label", null, [
                  i(
                    "span",
                    null,
                    l(a("life.companion.persona.gender")),
                    1
                    /* TEXT */
                  ),
                  Ee(Ne(De), {
                    modelValue: w.value.gender,
                    "onUpdate:modelValue": u[9] || (u[9] = (r) => w.value.gender = r),
                    options: gn.value,
                    "aria-label": a("life.companion.persona.gender")
                  }, null, 8, ["modelValue", "options", "aria-label"])
                ]),
                i("label", null, [
                  i(
                    "span",
                    null,
                    l(a("life.companion.persona.characterArchetype")),
                    1
                    /* TEXT */
                  ),
                  Ee(Ne(De), {
                    modelValue: w.value.character.key,
                    "onUpdate:modelValue": u[10] || (u[10] = (r) => w.value.character.key = r),
                    options: At.value,
                    "aria-label": a("life.companion.persona.characterArchetype")
                  }, null, 8, ["modelValue", "options", "aria-label"])
                ]),
                i("label", null, [
                  i(
                    "span",
                    null,
                    l(a("life.companion.persona.relationshipType")),
                    1
                    /* TEXT */
                  ),
                  Ee(Ne(De), {
                    modelValue: w.value.relationship.key,
                    "onUpdate:modelValue": u[11] || (u[11] = (r) => w.value.relationship.key = r),
                    options: Ii.value,
                    "aria-label": a("life.companion.persona.relationshipTypeAria")
                  }, null, 8, ["modelValue", "options", "aria-label"])
                ])
              ]),
              i("p", bl, [
                O(
                  l(a("life.companion.persona.genderLine", { gender: ho(w.value.gender) })) + " ",
                  1
                  /* TEXT */
                ),
                w.value.relationship?.label ? (_(), v(
                  q,
                  { key: 0 },
                  [
                    O(
                      l(a("life.companion.persona.relationshipLine", { label: w.value.relationship.label })) + " ",
                      1
                      /* TEXT */
                    ),
                    w.value.relationship.pathological ? (_(), v(
                      q,
                      { key: 0 },
                      [
                        O(
                          l(a("life.companion.persona.pathologicalNote")),
                          1
                          /* TEXT */
                        )
                      ],
                      64
                      /* STABLE_FRAGMENT */
                    )) : (_(), v(
                      q,
                      { key: 1 },
                      [
                        O(
                          l(a("life.companion.persona.healthyNote")),
                          1
                          /* TEXT */
                        )
                      ],
                      64
                      /* STABLE_FRAGMENT */
                    ))
                  ],
                  64
                  /* STABLE_FRAGMENT */
                )) : A("v-if", !0)
              ]),
              w.value.character?.expression || w.value.expression ? (_(), v(
                "p",
                wl,
                l(a("life.companion.persona.speakingStyle", { style: w.value.character?.expression || w.value.expression })),
                1
                /* TEXT */
              )) : A("v-if", !0),
              i(
                "h4",
                null,
                l(a("life.companion.persona.emotionSomatic")),
                1
                /* TEXT */
              ),
              i("div", xl, [
                i("label", null, [
                  i(
                    "span",
                    null,
                    l(a("life.companion.persona.threatBaseline")),
                    1
                    /* TEXT */
                  ),
                  x(i(
                    "input",
                    {
                      "onUpdate:modelValue": u[12] || (u[12] = (r) => w.value.traits.threat_baseline = r),
                      type: "number",
                      step: "0.05",
                      min: "0",
                      max: "1",
                      class: "field tiny"
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [
                      E,
                      w.value.traits.threat_baseline,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                i("label", null, [
                  i(
                    "span",
                    null,
                    l(a("life.companion.persona.rewardBaseline")),
                    1
                    /* TEXT */
                  ),
                  x(i(
                    "input",
                    {
                      "onUpdate:modelValue": u[13] || (u[13] = (r) => w.value.traits.reward_baseline = r),
                      type: "number",
                      step: "0.1",
                      min: "0",
                      max: "2",
                      class: "field tiny"
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [
                      E,
                      w.value.traits.reward_baseline,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                i("label", null, [
                  i(
                    "span",
                    null,
                    l(a("life.companion.persona.catastrophizing")),
                    1
                    /* TEXT */
                  ),
                  x(i(
                    "input",
                    {
                      "onUpdate:modelValue": u[14] || (u[14] = (r) => w.value.traits.catastrophizing = r),
                      type: "number",
                      step: "0.05",
                      min: "0",
                      max: "1",
                      class: "field tiny"
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [
                      E,
                      w.value.traits.catastrophizing,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                i("label", null, [
                  i(
                    "span",
                    null,
                    l(a("life.companion.persona.erqProfile")),
                    1
                    /* TEXT */
                  ),
                  Ee(Ne(De), {
                    modelValue: w.value.traits.erq_profile,
                    "onUpdate:modelValue": u[15] || (u[15] = (r) => w.value.traits.erq_profile = r),
                    options: F.value,
                    "aria-label": a("life.companion.persona.erqProfile")
                  }, null, 8, ["modelValue", "options", "aria-label"])
                ]),
                i("label", null, [
                  i(
                    "span",
                    null,
                    l(a("life.companion.persona.sleepHour")),
                    1
                    /* TEXT */
                  ),
                  x(i(
                    "input",
                    {
                      "onUpdate:modelValue": u[16] || (u[16] = (r) => w.value.traits.sleep_hour = r),
                      type: "number",
                      min: "0",
                      max: "23",
                      class: "field tiny"
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [
                      E,
                      w.value.traits.sleep_hour,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ])
              ]),
              i(
                "h4",
                null,
                l(a("life.companion.persona.personalityDims")),
                1
                /* TEXT */
              ),
              i("div", kl, [
                i("label", null, [
                  i(
                    "span",
                    null,
                    l(a("life.companion.persona.extraversion")),
                    1
                    /* TEXT */
                  ),
                  x(i(
                    "input",
                    {
                      "onUpdate:modelValue": u[17] || (u[17] = (r) => w.value.traits.extraversion = r),
                      type: "number",
                      step: "0.05",
                      min: "0",
                      max: "1",
                      class: "field tiny"
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [
                      E,
                      w.value.traits.extraversion,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                i("label", null, [
                  i(
                    "span",
                    null,
                    l(a("life.companion.persona.agreeableness")),
                    1
                    /* TEXT */
                  ),
                  x(i(
                    "input",
                    {
                      "onUpdate:modelValue": u[18] || (u[18] = (r) => w.value.traits.agreeableness = r),
                      type: "number",
                      step: "0.05",
                      min: "0",
                      max: "1",
                      class: "field tiny"
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [
                      E,
                      w.value.traits.agreeableness,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                i("label", null, [
                  i(
                    "span",
                    null,
                    l(a("life.companion.persona.conscientiousness")),
                    1
                    /* TEXT */
                  ),
                  x(i(
                    "input",
                    {
                      "onUpdate:modelValue": u[19] || (u[19] = (r) => w.value.traits.conscientiousness = r),
                      type: "number",
                      step: "0.05",
                      min: "0",
                      max: "1",
                      class: "field tiny"
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [
                      E,
                      w.value.traits.conscientiousness,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                i("label", null, [
                  i(
                    "span",
                    null,
                    l(a("life.companion.persona.openness")),
                    1
                    /* TEXT */
                  ),
                  x(i(
                    "input",
                    {
                      "onUpdate:modelValue": u[20] || (u[20] = (r) => w.value.traits.openness = r),
                      type: "number",
                      step: "0.05",
                      min: "0",
                      max: "1",
                      class: "field tiny"
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [
                      E,
                      w.value.traits.openness,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                i("label", null, [
                  i(
                    "span",
                    null,
                    l(a("life.companion.persona.attachAnxiety")),
                    1
                    /* TEXT */
                  ),
                  x(i(
                    "input",
                    {
                      "onUpdate:modelValue": u[21] || (u[21] = (r) => w.value.traits.attach_anxiety = r),
                      type: "number",
                      step: "0.05",
                      min: "0",
                      max: "1",
                      class: "field tiny"
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [
                      E,
                      w.value.traits.attach_anxiety,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                i("label", null, [
                  i(
                    "span",
                    null,
                    l(a("life.companion.persona.attachAvoidance")),
                    1
                    /* TEXT */
                  ),
                  x(i(
                    "input",
                    {
                      "onUpdate:modelValue": u[22] || (u[22] = (r) => w.value.traits.attach_avoidance = r),
                      type: "number",
                      step: "0.05",
                      min: "0",
                      max: "1",
                      class: "field tiny"
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [
                      E,
                      w.value.traits.attach_avoidance,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ])
              ]),
              i("details", Pl, [
                i(
                  "summary",
                  null,
                  l(a("life.companion.persona.moreStyle")),
                  1
                  /* TEXT */
                ),
                i("div", Ll, [
                  i("label", null, [
                    i(
                      "span",
                      null,
                      l(a("life.companion.persona.expressiveness")),
                      1
                      /* TEXT */
                    ),
                    x(i(
                      "input",
                      {
                        "onUpdate:modelValue": u[23] || (u[23] = (r) => w.value.traits.expressiveness = r),
                        type: "number",
                        step: "0.05",
                        min: "0",
                        max: "1",
                        class: "field tiny"
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [
                        E,
                        w.value.traits.expressiveness,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  i("label", null, [
                    i(
                      "span",
                      null,
                      l(a("life.companion.persona.initiative")),
                      1
                      /* TEXT */
                    ),
                    x(i(
                      "input",
                      {
                        "onUpdate:modelValue": u[24] || (u[24] = (r) => w.value.traits.initiative = r),
                        type: "number",
                        step: "0.05",
                        min: "0",
                        max: "1",
                        class: "field tiny"
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [
                        E,
                        w.value.traits.initiative,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  i("label", null, [
                    i(
                      "span",
                      null,
                      l(a("life.companion.persona.humor")),
                      1
                      /* TEXT */
                    ),
                    x(i(
                      "input",
                      {
                        "onUpdate:modelValue": u[25] || (u[25] = (r) => w.value.traits.humor = r),
                        type: "number",
                        step: "0.05",
                        min: "0",
                        max: "1",
                        class: "field tiny"
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [
                        E,
                        w.value.traits.humor,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  i("label", null, [
                    i(
                      "span",
                      null,
                      l(a("life.companion.persona.warmth")),
                      1
                      /* TEXT */
                    ),
                    x(i(
                      "input",
                      {
                        "onUpdate:modelValue": u[26] || (u[26] = (r) => w.value.traits.warmth = r),
                        type: "number",
                        step: "0.05",
                        min: "0",
                        max: "1",
                        class: "field tiny"
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [
                        E,
                        w.value.traits.warmth,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  i("label", null, [
                    i(
                      "span",
                      null,
                      l(a("life.companion.persona.formality")),
                      1
                      /* TEXT */
                    ),
                    x(i(
                      "input",
                      {
                        "onUpdate:modelValue": u[27] || (u[27] = (r) => w.value.traits.formality = r),
                        type: "number",
                        step: "0.05",
                        min: "0",
                        max: "1",
                        class: "field tiny"
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [
                        E,
                        w.value.traits.formality,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  i("label", null, [
                    i(
                      "span",
                      null,
                      l(a("life.companion.persona.assertiveness")),
                      1
                      /* TEXT */
                    ),
                    x(i(
                      "input",
                      {
                        "onUpdate:modelValue": u[28] || (u[28] = (r) => w.value.traits.assertiveness = r),
                        type: "number",
                        step: "0.05",
                        min: "0",
                        max: "1",
                        class: "field tiny"
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [
                        E,
                        w.value.traits.assertiveness,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ])
                ])
              ]),
              w.value.attachment.type ? (_(), v(
                q,
                { key: 1 },
                [
                  i(
                    "h4",
                    null,
                    l(a("life.companion.persona.attachmentHeading", { label: w.value.relationship.label })),
                    1
                    /* TEXT */
                  ),
                  i("div", Tl, [
                    i("label", null, [
                      i(
                        "span",
                        null,
                        l(a("life.companion.persona.attachTypeByRelationship")),
                        1
                        /* TEXT */
                      ),
                      i("input", {
                        class: "field",
                        value: a("life.companion.attachmentTypeValue", { type: w.value.attachment.type, label: w.value.relationship.label || "" }),
                        disabled: ""
                      }, null, 8, Sl)
                    ]),
                    i("label", null, [
                      i(
                        "span",
                        null,
                        l(a("life.companion.persona.initialAnxietyX")),
                        1
                        /* TEXT */
                      ),
                      x(i(
                        "input",
                        {
                          "onUpdate:modelValue": u[29] || (u[29] = (r) => w.value.attachment.initial.X = r),
                          type: "number",
                          step: "0.05",
                          min: "0",
                          max: "1",
                          class: "field tiny"
                        },
                        null,
                        512
                        /* NEED_PATCH */
                      ), [
                        [
                          E,
                          w.value.attachment.initial.X,
                          void 0,
                          { number: !0 }
                        ]
                      ])
                    ]),
                    i("label", null, [
                      i(
                        "span",
                        null,
                        l(a("life.companion.persona.initialSecurityS")),
                        1
                        /* TEXT */
                      ),
                      x(i(
                        "input",
                        {
                          "onUpdate:modelValue": u[30] || (u[30] = (r) => w.value.attachment.initial.S = r),
                          type: "number",
                          step: "0.05",
                          min: "0",
                          max: "1",
                          class: "field tiny"
                        },
                        null,
                        512
                        /* NEED_PATCH */
                      ), [
                        [
                          E,
                          w.value.attachment.initial.S,
                          void 0,
                          { number: !0 }
                        ]
                      ])
                    ])
                  ]),
                  i(
                    "p",
                    Cl,
                    l(a("life.companion.persona.attachmentHint")),
                    1
                    /* TEXT */
                  )
                ],
                64
                /* STABLE_FRAGMENT */
              )) : (_(), v(
                "p",
                Ml,
                l(a("life.companion.persona.attachmentDisabled")),
                1
                /* TEXT */
              )),
              w.value.tsundere && w.value.tsundere.type ? (_(), v(
                q,
                { key: 3 },
                [
                  i(
                    "h4",
                    null,
                    l(a("life.companion.persona.tsundereHeading")),
                    1
                    /* TEXT */
                  ),
                  i("div", zl, [
                    i("label", null, [
                      i(
                        "span",
                        null,
                        l(a("life.companion.persona.tsundereType")),
                        1
                        /* TEXT */
                      ),
                      i("input", {
                        class: "field",
                        value: w.value.tsundere.type,
                        disabled: ""
                      }, null, 8, El)
                    ]),
                    i("label", null, [
                      i(
                        "span",
                        null,
                        l(a("life.companion.persona.initialAffectionA")),
                        1
                        /* TEXT */
                      ),
                      x(i(
                        "input",
                        {
                          "onUpdate:modelValue": u[31] || (u[31] = (r) => w.value.tsundere.initial.A = r),
                          type: "number",
                          step: "0.05",
                          min: "0",
                          max: "1",
                          class: "field tiny"
                        },
                        null,
                        512
                        /* NEED_PATCH */
                      ), [
                        [
                          E,
                          w.value.tsundere.initial.A,
                          void 0,
                          { number: !0 }
                        ]
                      ])
                    ]),
                    i("label", null, [
                      i(
                        "span",
                        null,
                        l(a("life.companion.persona.initialTsunExpressionT")),
                        1
                        /* TEXT */
                      ),
                      x(i(
                        "input",
                        {
                          "onUpdate:modelValue": u[32] || (u[32] = (r) => w.value.tsundere.initial.T = r),
                          type: "number",
                          step: "0.05",
                          min: "0",
                          max: "1",
                          class: "field tiny"
                        },
                        null,
                        512
                        /* NEED_PATCH */
                      ), [
                        [
                          E,
                          w.value.tsundere.initial.T,
                          void 0,
                          { number: !0 }
                        ]
                      ])
                    ]),
                    i("label", null, [
                      i(
                        "span",
                        null,
                        l(a("life.companion.persona.initialYandereY")),
                        1
                        /* TEXT */
                      ),
                      x(i(
                        "input",
                        {
                          "onUpdate:modelValue": u[33] || (u[33] = (r) => w.value.tsundere.initial.Y = r),
                          type: "number",
                          step: "0.05",
                          min: "0",
                          max: "1",
                          class: "field tiny"
                        },
                        null,
                        512
                        /* NEED_PATCH */
                      ), [
                        [
                          E,
                          w.value.tsundere.initial.Y,
                          void 0,
                          { number: !0 }
                        ]
                      ])
                    ])
                  ]),
                  i(
                    "p",
                    Ol,
                    l(a("life.companion.persona.tsundereHint")),
                    1
                    /* TEXT */
                  )
                ],
                64
                /* STABLE_FRAGMENT */
              )) : (_(), v(
                "p",
                Al,
                l(a("life.companion.persona.tsundereDisabled")),
                1
                /* TEXT */
              )),
              w.value.personadyn && w.value.personadyn.type ? (_(), v(
                q,
                { key: 5 },
                [
                  i(
                    "h4",
                    null,
                    l(a("life.companion.persona.personadynHeading")),
                    1
                    /* TEXT */
                  ),
                  i("div", Il, [
                    i("label", null, [
                      i(
                        "span",
                        null,
                        l(a("life.companion.persona.personaArchetype")),
                        1
                        /* TEXT */
                      ),
                      i("input", {
                        class: "field",
                        value: w.value.personadyn.type,
                        disabled: ""
                      }, null, 8, Bl)
                    ]),
                    i("label", null, [
                      i(
                        "span",
                        null,
                        l(a("life.companion.persona.initialAffectionA")),
                        1
                        /* TEXT */
                      ),
                      x(i(
                        "input",
                        {
                          "onUpdate:modelValue": u[34] || (u[34] = (r) => w.value.personadyn.initial.A = r),
                          type: "number",
                          step: "0.05",
                          min: "0",
                          max: "1",
                          class: "field tiny"
                        },
                        null,
                        512
                        /* NEED_PATCH */
                      ), [
                        [
                          E,
                          w.value.personadyn.initial.A,
                          void 0,
                          { number: !0 }
                        ]
                      ])
                    ]),
                    i("label", null, [
                      i(
                        "span",
                        null,
                        l(a("life.companion.persona.initialAnxietyX")),
                        1
                        /* TEXT */
                      ),
                      x(i(
                        "input",
                        {
                          "onUpdate:modelValue": u[35] || (u[35] = (r) => w.value.personadyn.initial.X = r),
                          type: "number",
                          step: "0.05",
                          min: "0",
                          max: "1",
                          class: "field tiny"
                        },
                        null,
                        512
                        /* NEED_PATCH */
                      ), [
                        [
                          E,
                          w.value.personadyn.initial.X,
                          void 0,
                          { number: !0 }
                        ]
                      ])
                    ]),
                    i("label", null, [
                      i(
                        "span",
                        null,
                        l(a("life.companion.persona.initialPossessionO")),
                        1
                        /* TEXT */
                      ),
                      x(i(
                        "input",
                        {
                          "onUpdate:modelValue": u[36] || (u[36] = (r) => w.value.personadyn.initial.O = r),
                          type: "number",
                          step: "0.05",
                          min: "0",
                          max: "1",
                          class: "field tiny"
                        },
                        null,
                        512
                        /* NEED_PATCH */
                      ), [
                        [
                          E,
                          w.value.personadyn.initial.O,
                          void 0,
                          { number: !0 }
                        ]
                      ])
                    ]),
                    i("label", null, [
                      i(
                        "span",
                        null,
                        l(a("life.companion.persona.initialTrustTr")),
                        1
                        /* TEXT */
                      ),
                      x(i(
                        "input",
                        {
                          "onUpdate:modelValue": u[37] || (u[37] = (r) => w.value.personadyn.initial.Tr = r),
                          type: "number",
                          step: "0.05",
                          min: "0",
                          max: "1",
                          class: "field tiny"
                        },
                        null,
                        512
                        /* NEED_PATCH */
                      ), [
                        [
                          E,
                          w.value.personadyn.initial.Tr,
                          void 0,
                          { number: !0 }
                        ]
                      ])
                    ]),
                    i("label", null, [
                      i(
                        "span",
                        null,
                        l(a("life.companion.persona.initialSelfControlK")),
                        1
                        /* TEXT */
                      ),
                      x(i(
                        "input",
                        {
                          "onUpdate:modelValue": u[38] || (u[38] = (r) => w.value.personadyn.initial.K = r),
                          type: "number",
                          step: "0.05",
                          min: "0",
                          max: "1",
                          class: "field tiny"
                        },
                        null,
                        512
                        /* NEED_PATCH */
                      ), [
                        [
                          E,
                          w.value.personadyn.initial.K,
                          void 0,
                          { number: !0 }
                        ]
                      ])
                    ]),
                    i("label", null, [
                      i(
                        "span",
                        null,
                        l(a("life.companion.persona.genderSocialScript")),
                        1
                        /* TEXT */
                      ),
                      Ee(Ne(De), {
                        modelValue: w.value.personadynGender,
                        "onUpdate:modelValue": u[39] || (u[39] = (r) => w.value.personadynGender = r),
                        options: Tt.value,
                        "aria-label": a("life.companion.persona.genderSocialScriptAria")
                      }, null, 8, ["modelValue", "options", "aria-label"])
                    ])
                  ]),
                  i(
                    "p",
                    Zl,
                    l(a("life.companion.persona.personadynHint")),
                    1
                    /* TEXT */
                  )
                ],
                64
                /* STABLE_FRAGMENT */
              )) : (_(), v(
                "p",
                Nl,
                l(a("life.companion.persona.personadynDisabled")),
                1
                /* TEXT */
              ))
            ])) : A("v-if", !0)
          ],
          512
          /* NEED_PATCH */
        ), [
          [Gn, se.value === "persona"]
        ]),
        x(i(
          "section",
          Dl,
          [
            i("div", Rl, [
              i("div", null, [
                i(
                  "h2",
                  null,
                  l(a("life.companion.cognition.title")),
                  1
                  /* TEXT */
                ),
                i(
                  "p",
                  Vl,
                  l(a("life.companion.cognition.desc")),
                  1
                  /* TEXT */
                )
              ]),
              i("div", $l, [
                i("button", {
                  class: "btn filled sm",
                  disabled: ve.value,
                  onClick: Qt
                }, l(ve.value ? a("life.companion.saving") : a("life.companion.saveSettings")), 9, Ul)
              ])
            ]),
            i("article", Fl, [
              i("h3", null, [
                O(
                  l(a("life.companion.life.title")) + " ",
                  1
                  /* TEXT */
                ),
                i(
                  "span",
                  {
                    class: R(["count-pill", { ok: we.value?.alive }])
                  },
                  l(we.value?.alive ? a("life.companion.life.alive") : a("life.companion.life.notStarted")),
                  3
                  /* TEXT, CLASS */
                )
              ]),
              i("div", Hl, [
                i("div", Wl, [
                  i(
                    "span",
                    null,
                    l(a("life.companion.life.status")),
                    1
                    /* TEXT */
                  ),
                  i(
                    "strong",
                    null,
                    l(we.value?.alive ? a("life.companion.life.alive") : a("life.companion.life.notStarted")),
                    1
                    /* TEXT */
                  )
                ]),
                i("div", Gl, [
                  i(
                    "span",
                    null,
                    l(a("life.companion.life.livedFor")),
                    1
                    /* TEXT */
                  ),
                  i(
                    "strong",
                    null,
                    l(Xi()),
                    1
                    /* TEXT */
                  )
                ]),
                i("div", jl, [
                  i(
                    "span",
                    null,
                    l(a("life.companion.life.ticks")),
                    1
                    /* TEXT */
                  ),
                  i(
                    "strong",
                    null,
                    l(we.value?.ticks ?? 0),
                    1
                    /* TEXT */
                  )
                ]),
                i("div", ql, [
                  i(
                    "span",
                    null,
                    l(a("life.companion.life.residentThinking")),
                    1
                    /* TEXT */
                  ),
                  i(
                    "strong",
                    null,
                    l(we.value?.resident_running ? a("life.companion.status.running") : a("life.companion.status.stopped")),
                    1
                    /* TEXT */
                  )
                ]),
                i("div", Kl, [
                  i(
                    "span",
                    null,
                    l(a("life.companion.life.proactive")),
                    1
                    /* TEXT */
                  ),
                  i(
                    "strong",
                    null,
                    l(we.value?.proactive_enabled ? a("life.companion.on") : a("life.companion.off")),
                    1
                    /* TEXT */
                  )
                ]),
                i("div", Yl, [
                  i(
                    "span",
                    null,
                    l(a("life.companion.life.lastThought")),
                    1
                    /* TEXT */
                  ),
                  i(
                    "strong",
                    null,
                    l((we.value?.last_tick || "").slice(0, 16).replace("T", " ") || "—"),
                    1
                    /* TEXT */
                  )
                ])
              ]),
              we.value?.last_thought ? (_(), v(
                "p",
                Jl,
                l(a("life.companion.life.currentThought", { text: we.value.last_thought })),
                1
                /* TEXT */
              )) : A("v-if", !0),
              we.value?.focus ? (_(), v(
                "p",
                Xl,
                l(a("life.companion.life.focus", { text: we.value.focus })),
                1
                /* TEXT */
              )) : A("v-if", !0),
              we.value?.active_goal ? (_(), v(
                "p",
                Ql,
                l(a("life.companion.life.goal", { text: we.value.active_goal })),
                1
                /* TEXT */
              )) : A("v-if", !0),
              i("div", er, [
                i("label", tr, [
                  x(i(
                    "input",
                    {
                      type: "checkbox",
                      "onUpdate:modelValue": u[40] || (u[40] = (r) => Tn.value = r)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [he, Tn.value]
                  ]),
                  i(
                    "span",
                    null,
                    l(a("life.companion.life.greetOnStart")),
                    1
                    /* TEXT */
                  )
                ]),
                i("button", {
                  class: R(["btn sm", { filled: !we.value?.alive }]),
                  disabled: St.value || Pe.value,
                  onClick: u[41] || (u[41] = (r) => we.value?.alive ? Xn() : Sn())
                }, l(St.value ? Jn() : we.value?.alive ? a("life.companion.life.pause") : a("life.companion.life.start")), 11, nr)
              ]),
              i(
                "p",
                ir,
                l(a("life.companion.life.hint")),
                1
                /* TEXT */
              )
            ]),
            i("article", or, [
              i("h3", null, [
                O(
                  l(a("life.companion.realtime.title")) + " ",
                  1
                  /* TEXT */
                ),
                i(
                  "span",
                  {
                    class: R(["count-pill", { ok: pe.value?.enabled }])
                  },
                  l(pe.value?.enabled ? a("life.companion.status.running") : a("life.companion.status.stopped")),
                  3
                  /* TEXT, CLASS */
                ),
                Dn.value ? (_(), v(
                  "span",
                  ar,
                  l(a("life.companion.realtime.updatedAt", { time: Dn.value })),
                  1
                  /* TEXT */
                )) : A("v-if", !0)
              ]),
              pe.value ? (_(), v(
                q,
                { key: 1 },
                [
                  i(
                    "div",
                    lr,
                    l(a("life.companion.realtime.atAGlance")),
                    1
                    /* TEXT */
                  ),
                  i(
                    "p",
                    rr,
                    l(a("life.companion.realtime.atAGlanceHint")),
                    1
                    /* TEXT */
                  ),
                  i("div", ur, [
                    Mn.value ? (_(), v("div", {
                      key: 0,
                      class: "mood-plot-wrap",
                      role: "img",
                      "aria-label": a(Ti.value)
                    }, [
                      i(
                        "span",
                        dr,
                        l(a("life.companion.axis.arousalHigh")),
                        1
                        /* TEXT */
                      ),
                      i(
                        "span",
                        hr,
                        l(a("life.companion.axis.arousalLow")),
                        1
                        /* TEXT */
                      ),
                      i(
                        "span",
                        pr,
                        l(a("life.companion.axis.valenceLow")),
                        1
                        /* TEXT */
                      ),
                      i(
                        "span",
                        fr,
                        l(a("life.companion.axis.valenceHigh")),
                        1
                        /* TEXT */
                      ),
                      (_(), v("svg", mr, [
                        u[103] || (u[103] = i(
                          "rect",
                          {
                            class: "plot-frame",
                            x: "10",
                            y: "10",
                            width: "100",
                            height: "100",
                            rx: "12"
                          },
                          null,
                          -1
                          /* CACHED */
                        )),
                        u[104] || (u[104] = i(
                          "line",
                          {
                            class: "plot-grid",
                            x1: "60",
                            y1: "10",
                            x2: "60",
                            y2: "110"
                          },
                          null,
                          -1
                          /* CACHED */
                        )),
                        u[105] || (u[105] = i(
                          "line",
                          {
                            class: "plot-grid",
                            x1: "10",
                            y1: "60",
                            x2: "110",
                            y2: "60"
                          },
                          null,
                          -1
                          /* CACHED */
                        )),
                        i("circle", {
                          class: "plot-halo",
                          cx: En.value.x,
                          cy: En.value.y,
                          r: "12"
                        }, null, 8, _r),
                        i("circle", {
                          class: "plot-dot",
                          cx: En.value.x,
                          cy: En.value.y,
                          r: "5"
                        }, null, 8, vr)
                      ])),
                      i(
                        "span",
                        gr,
                        l(a(Ti.value)),
                        1
                        /* TEXT */
                      )
                    ], 8, cr)) : A("v-if", !0),
                    i("div", yr, [
                      i(
                        "p",
                        br,
                        l(a("life.companion.realtime.section.mood")),
                        1
                        /* TEXT */
                      ),
                      (_(!0), v(
                        q,
                        null,
                        be(ni.value, (r) => (_(), v("div", {
                          key: r.label,
                          class: "gauge",
                          title: r.effect
                        }, [
                          i("span", xr, [
                            i("span", kr, [
                              O(
                                l(r.label),
                                1
                                /* TEXT */
                              ),
                              i(
                                "em",
                                Pr,
                                l(r.alias),
                                1
                                /* TEXT */
                              )
                            ]),
                            i("span", Lr, [
                              i(
                                "b",
                                {
                                  class: R(["gauge-state", r.stateTone])
                                },
                                l(r.state),
                                3
                                /* TEXT, CLASS */
                              ),
                              O(
                                " " + l(r.display),
                                1
                                /* TEXT */
                              )
                            ])
                          ]),
                          i(
                            "span",
                            {
                              class: R(["gauge-bar", { signed: r.signed }])
                            },
                            [
                              i(
                                "i",
                                {
                                  class: R(["gauge-fill", r.signed ? r.value >= 0 ? "good" : "bad" : ft(r)]),
                                  style: ut(r.signed ? ot(r.value) : { width: (pt(r) * 100).toFixed(1) + "%" })
                                },
                                null,
                                6
                                /* CLASS, STYLE */
                              )
                            ],
                            2
                            /* CLASS */
                          ),
                          i(
                            "span",
                            Tr,
                            l(r.effect),
                            1
                            /* TEXT */
                          )
                        ], 8, wr))),
                        128
                        /* KEYED_FRAGMENT */
                      ))
                    ]),
                    i("div", Sr, [
                      i("p", Cr, [
                        O(
                          l(a("life.companion.body.title")) + " ",
                          1
                          /* TEXT */
                        ),
                        i(
                          "span",
                          {
                            class: R(["chip", { muted: Ct.value?.is_sleeping, ok: Ct.value && !Ct.value.is_sleeping }])
                          },
                          l(Ct.value ? Ct.value.is_sleeping ? a("life.companion.body.sleeping") : a("life.companion.body.awake") : "—"),
                          3
                          /* TEXT, CLASS */
                        )
                      ]),
                      (_(!0), v(
                        q,
                        null,
                        be(Si.value, (r) => (_(), v("div", {
                          key: r.label,
                          class: "gauge",
                          title: r.effect
                        }, [
                          i("span", zr, [
                            i("span", Er, [
                              O(
                                l(r.label),
                                1
                                /* TEXT */
                              ),
                              i(
                                "em",
                                Or,
                                l(r.alias),
                                1
                                /* TEXT */
                              )
                            ]),
                            i("span", Ar, [
                              i(
                                "b",
                                {
                                  class: R(["gauge-state", r.stateTone])
                                },
                                l(r.state),
                                3
                                /* TEXT, CLASS */
                              ),
                              O(
                                " " + l(r.display),
                                1
                                /* TEXT */
                              )
                            ])
                          ]),
                          i(
                            "span",
                            {
                              class: R(["gauge-bar", { signed: r.signed }])
                            },
                            [
                              i(
                                "i",
                                {
                                  class: R(["gauge-fill", r.signed ? r.value >= 0 ? "good" : "bad" : ft(r)]),
                                  style: ut(r.signed ? ot(r.value) : { width: (pt(r) * 100).toFixed(1) + "%" })
                                },
                                null,
                                6
                                /* CLASS, STYLE */
                              )
                            ],
                            2
                            /* CLASS */
                          ),
                          i(
                            "span",
                            Ir,
                            l(r.effect),
                            1
                            /* TEXT */
                          )
                        ], 8, Mr))),
                        128
                        /* KEYED_FRAGMENT */
                      ))
                    ])
                  ]),
                  i(
                    "div",
                    Br,
                    l(a("life.companion.realtime.section.mood")),
                    1
                    /* TEXT */
                  ),
                  i(
                    "p",
                    Zr,
                    l(a("life.companion.realtime.sectionSub.mood")),
                    1
                    /* TEXT */
                  ),
                  i("div", Nr, [
                    (_(!0), v(
                      q,
                      null,
                      be(Yt.value, (r) => (_(), v("div", {
                        key: r.label,
                        class: "gauge",
                        title: r.effect
                      }, [
                        i("span", Rr, [
                          i("span", Vr, [
                            O(
                              l(r.label),
                              1
                              /* TEXT */
                            ),
                            i(
                              "em",
                              $r,
                              l(r.alias),
                              1
                              /* TEXT */
                            )
                          ]),
                          i("span", Ur, [
                            i(
                              "b",
                              {
                                class: R(["gauge-state", r.stateTone])
                              },
                              l(r.state),
                              3
                              /* TEXT, CLASS */
                            ),
                            O(
                              " " + l(r.display),
                              1
                              /* TEXT */
                            )
                          ])
                        ]),
                        i(
                          "span",
                          {
                            class: R(["gauge-bar", { signed: r.signed }])
                          },
                          [
                            i(
                              "i",
                              {
                                class: R(["gauge-fill", r.signed ? r.value >= 0 ? "good" : "bad" : ft(r)]),
                                style: ut(r.signed ? ot(r.value) : { width: (pt(r) * 100).toFixed(1) + "%" })
                              },
                              null,
                              6
                              /* CLASS, STYLE */
                            )
                          ],
                          2
                          /* CLASS */
                        ),
                        i(
                          "span",
                          Fr,
                          l(r.effect),
                          1
                          /* TEXT */
                        )
                      ], 8, Dr))),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ]),
                  bi.value ? (_(), v("div", Hr, [
                    (_(!0), v(
                      q,
                      null,
                      be(bi.value, (r, C) => (_(), v("div", {
                        key: C,
                        class: "som-chan"
                      }, [
                        i(
                          "span",
                          Wr,
                          l(wi(C)),
                          1
                          /* TEXT */
                        ),
                        i("span", Gr, [
                          i(
                            "i",
                            {
                              style: ut({ transform: "scaleX(" + xi(r) + ")" })
                            },
                            null,
                            4
                            /* STYLE */
                          )
                        ]),
                        i(
                          "span",
                          jr,
                          l(xe(r, 2)),
                          1
                          /* TEXT */
                        )
                      ]))),
                      128
                      /* KEYED_FRAGMENT */
                    )),
                    Number(Je.value?.somatic_chronicity) > 0.1 ? (_(), v(
                      "p",
                      qr,
                      l(a("life.companion.realtime.somaticChronicity", { value: xe(Je.value?.somatic_chronicity) })),
                      1
                      /* TEXT */
                    )) : A("v-if", !0)
                  ])) : A("v-if", !0),
                  an.value || jn.value ? (_(), v(
                    q,
                    { key: 1 },
                    [
                      i(
                        "div",
                        Kr,
                        l(a("life.companion.realtime.section.social")),
                        1
                        /* TEXT */
                      ),
                      i(
                        "p",
                        Yr,
                        l(a("life.companion.realtime.sectionSub.social")),
                        1
                        /* TEXT */
                      ),
                      i("div", Jr, [
                        (_(!0), v(
                          q,
                          null,
                          be(Ci.value, (r) => (_(), v("div", {
                            key: r.label,
                            class: "gauge",
                            title: r.effect
                          }, [
                            i("span", Qr, [
                              i("span", eu, [
                                O(
                                  l(r.label),
                                  1
                                  /* TEXT */
                                ),
                                i(
                                  "em",
                                  tu,
                                  l(r.alias),
                                  1
                                  /* TEXT */
                                )
                              ]),
                              i("span", nu, [
                                i(
                                  "b",
                                  {
                                    class: R(["gauge-state", r.stateTone])
                                  },
                                  l(r.state),
                                  3
                                  /* TEXT, CLASS */
                                ),
                                O(
                                  " " + l(r.display),
                                  1
                                  /* TEXT */
                                )
                              ])
                            ]),
                            i(
                              "span",
                              {
                                class: R(["gauge-bar", { signed: r.signed }])
                              },
                              [
                                i(
                                  "i",
                                  {
                                    class: R(["gauge-fill", r.signed ? r.value >= 0 ? "good" : "bad" : ft(r)]),
                                    style: ut(r.signed ? ot(r.value) : { width: (pt(r) * 100).toFixed(1) + "%" })
                                  },
                                  null,
                                  6
                                  /* CLASS, STYLE */
                                )
                              ],
                              2
                              /* CLASS */
                            ),
                            i(
                              "span",
                              iu,
                              l(r.effect),
                              1
                              /* TEXT */
                            )
                          ], 8, Xr))),
                          128
                          /* KEYED_FRAGMENT */
                        ))
                      ]),
                      i("div", ou, [
                        i(
                          "span",
                          au,
                          l(a("life.companion.metric.perspectiveStage")) + " " + l(an.value?.perspective_name || "—"),
                          1
                          /* TEXT */
                        ),
                        i(
                          "span",
                          su,
                          l(a("life.companion.metric.attentionState")) + " " + l(jn.value?.attention_state || "—"),
                          1
                          /* TEXT */
                        )
                      ])
                    ],
                    64
                    /* STABLE_FRAGMENT */
                  )) : A("v-if", !0),
                  $e.value?.enabled ? (_(), v(
                    q,
                    { key: 2 },
                    [
                      i(
                        "div",
                        lu,
                        l(a("life.companion.realtime.section.attachment")),
                        1
                        /* TEXT */
                      ),
                      i(
                        "p",
                        ru,
                        l(a("life.companion.realtime.sectionSub.attachment")),
                        1
                        /* TEXT */
                      ),
                      i("div", uu, [
                        i(
                          "span",
                          cu,
                          l($e.value.label || $e.value.type),
                          1
                          /* TEXT */
                        ),
                        i(
                          "span",
                          du,
                          l(a("life.companion.metric.severity")) + " " + l(xe($e.value.severity, 2)) + " · " + l($e.value.band),
                          1
                          /* TEXT */
                        ),
                        i(
                          "span",
                          hu,
                          l(a("life.companion.metric.dominantTendency")) + " " + l($e.value.dominant || "—"),
                          1
                          /* TEXT */
                        ),
                        i(
                          "span",
                          {
                            class: R(["chip", $e.value.safe_mode ? "warn" : "muted"])
                          },
                          l(a("life.companion.metric.safetyLayer")) + " " + l($e.value.safe_mode ? a("life.companion.metric.triggered") : a("life.companion.metric.normal")),
                          3
                          /* TEXT, CLASS */
                        )
                      ]),
                      i("div", pu, [
                        (_(!0), v(
                          q,
                          null,
                          be(eo.value, (r) => (_(), v("div", {
                            key: r.label,
                            class: "gauge",
                            title: r.effect
                          }, [
                            i("span", mu, [
                              i("span", _u, [
                                O(
                                  l(r.label),
                                  1
                                  /* TEXT */
                                ),
                                i(
                                  "em",
                                  vu,
                                  l(r.alias),
                                  1
                                  /* TEXT */
                                )
                              ]),
                              i("span", gu, [
                                i(
                                  "b",
                                  {
                                    class: R(["gauge-state", r.stateTone])
                                  },
                                  l(r.state),
                                  3
                                  /* TEXT, CLASS */
                                ),
                                O(
                                  " " + l(r.display),
                                  1
                                  /* TEXT */
                                )
                              ])
                            ]),
                            i(
                              "span",
                              {
                                class: R(["gauge-bar", { signed: r.signed }])
                              },
                              [
                                i(
                                  "i",
                                  {
                                    class: R(["gauge-fill", r.signed ? r.value >= 0 ? "good" : "bad" : ft(r)]),
                                    style: ut(r.signed ? ot(r.value) : { width: (pt(r) * 100).toFixed(1) + "%" })
                                  },
                                  null,
                                  6
                                  /* CLASS, STYLE */
                                )
                              ],
                              2
                              /* CLASS */
                            ),
                            i(
                              "span",
                              yu,
                              l(r.effect),
                              1
                              /* TEXT */
                            )
                          ], 8, fu))),
                          128
                          /* KEYED_FRAGMENT */
                        ))
                      ])
                    ],
                    64
                    /* STABLE_FRAGMENT */
                  )) : A("v-if", !0),
                  Ie.value?.enabled ? (_(), v(
                    q,
                    { key: 3 },
                    [
                      i(
                        "div",
                        bu,
                        l(a("life.companion.realtime.section.tsundere")),
                        1
                        /* TEXT */
                      ),
                      i(
                        "p",
                        wu,
                        l(a("life.companion.realtime.sectionSub.tsundere")),
                        1
                        /* TEXT */
                      ),
                      i("div", xu, [
                        i(
                          "span",
                          ku,
                          l(Ie.value.label || Ie.value.type),
                          1
                          /* TEXT */
                        ),
                        i(
                          "span",
                          {
                            class: R(["chip", Ie.value.safe_mode ? "warn" : "muted"])
                          },
                          l(a("life.companion.metric.safetyLayer")) + " " + l(Ie.value.safe_mode ? a("life.companion.metric.triggered") : a("life.companion.metric.normal")),
                          3
                          /* TEXT, CLASS */
                        )
                      ]),
                      i("div", Pu, [
                        (_(!0), v(
                          q,
                          null,
                          be(to.value, (r) => (_(), v("div", {
                            key: r.label,
                            class: "gauge",
                            title: r.effect
                          }, [
                            i("span", Tu, [
                              i("span", Su, [
                                O(
                                  l(r.label),
                                  1
                                  /* TEXT */
                                ),
                                i(
                                  "em",
                                  Cu,
                                  l(r.alias),
                                  1
                                  /* TEXT */
                                )
                              ]),
                              i("span", Mu, [
                                i(
                                  "b",
                                  {
                                    class: R(["gauge-state", r.stateTone])
                                  },
                                  l(r.state),
                                  3
                                  /* TEXT, CLASS */
                                ),
                                O(
                                  " " + l(r.display),
                                  1
                                  /* TEXT */
                                )
                              ])
                            ]),
                            i(
                              "span",
                              {
                                class: R(["gauge-bar", { signed: r.signed }])
                              },
                              [
                                i(
                                  "i",
                                  {
                                    class: R(["gauge-fill", r.signed ? r.value >= 0 ? "good" : "bad" : ft(r)]),
                                    style: ut(r.signed ? ot(r.value) : { width: (pt(r) * 100).toFixed(1) + "%" })
                                  },
                                  null,
                                  6
                                  /* CLASS, STYLE */
                                )
                              ],
                              2
                              /* CLASS */
                            ),
                            i(
                              "span",
                              zu,
                              l(r.effect),
                              1
                              /* TEXT */
                            )
                          ], 8, Lu))),
                          128
                          /* KEYED_FRAGMENT */
                        ))
                      ])
                    ],
                    64
                    /* STABLE_FRAGMENT */
                  )) : A("v-if", !0),
                  je.value?.enabled ? (_(), v(
                    q,
                    { key: 4 },
                    [
                      i(
                        "div",
                        Eu,
                        l(a("life.companion.realtime.section.yandere")),
                        1
                        /* TEXT */
                      ),
                      i(
                        "p",
                        Ou,
                        l(a("life.companion.realtime.sectionSub.yandere")),
                        1
                        /* TEXT */
                      ),
                      i("div", Au, [
                        i(
                          "span",
                          Iu,
                          l(je.value.label || je.value.type),
                          1
                          /* TEXT */
                        ),
                        i(
                          "span",
                          Bu,
                          l(a("life.companion.metric.yandereMode")) + " " + l(je.value.mode) + " · " + l(je.value.label_russell),
                          1
                          /* TEXT */
                        ),
                        i(
                          "span",
                          {
                            class: R(["chip", je.value.safe_mode ? "warn" : "muted"])
                          },
                          l(a("life.companion.metric.safetyLayer")) + " " + l(je.value.safe_mode ? a("life.companion.metric.triggered") : a("life.companion.metric.normal")),
                          3
                          /* TEXT, CLASS */
                        )
                      ]),
                      i("div", Zu, [
                        (_(!0), v(
                          q,
                          null,
                          be(no.value, (r) => (_(), v("div", {
                            key: r.label,
                            class: "gauge",
                            title: r.effect
                          }, [
                            i("span", Du, [
                              i("span", Ru, [
                                O(
                                  l(r.label),
                                  1
                                  /* TEXT */
                                ),
                                i(
                                  "em",
                                  Vu,
                                  l(r.alias),
                                  1
                                  /* TEXT */
                                )
                              ]),
                              i("span", $u, [
                                i(
                                  "b",
                                  {
                                    class: R(["gauge-state", r.stateTone])
                                  },
                                  l(r.state),
                                  3
                                  /* TEXT, CLASS */
                                ),
                                O(
                                  " " + l(r.display),
                                  1
                                  /* TEXT */
                                )
                              ])
                            ]),
                            i(
                              "span",
                              {
                                class: R(["gauge-bar", { signed: r.signed }])
                              },
                              [
                                i(
                                  "i",
                                  {
                                    class: R(["gauge-fill", r.signed ? r.value >= 0 ? "good" : "bad" : ft(r)]),
                                    style: ut(r.signed ? ot(r.value) : { width: (pt(r) * 100).toFixed(1) + "%" })
                                  },
                                  null,
                                  6
                                  /* CLASS, STYLE */
                                )
                              ],
                              2
                              /* CLASS */
                            ),
                            i(
                              "span",
                              Uu,
                              l(r.effect),
                              1
                              /* TEXT */
                            )
                          ], 8, Nu))),
                          128
                          /* KEYED_FRAGMENT */
                        ))
                      ])
                    ],
                    64
                    /* STABLE_FRAGMENT */
                  )) : A("v-if", !0),
                  H.value?.enabled ? (_(), v(
                    q,
                    { key: 5 },
                    [
                      i(
                        "div",
                        Fu,
                        l(a("life.companion.realtime.section.pd")),
                        1
                        /* TEXT */
                      ),
                      i(
                        "p",
                        Hu,
                        l(a("life.companion.realtime.sectionSub.pd")),
                        1
                        /* TEXT */
                      ),
                      i("div", Wu, [
                        i(
                          "span",
                          Gu,
                          l(H.value.label || H.value.type),
                          1
                          /* TEXT */
                        ),
                        i(
                          "span",
                          ju,
                          l(a("life.companion.metric.emergentMode")) + " " + l(H.value.mode_label || H.value.mode) + " · " + l(H.value.band),
                          1
                          /* TEXT */
                        ),
                        H.value.gender ? (_(), v(
                          "span",
                          qu,
                          l(H.value.gender),
                          1
                          /* TEXT */
                        )) : A("v-if", !0),
                        H.value.clinical ? (_(), v(
                          "span",
                          Ku,
                          l(a("life.companion.simulationMode")),
                          1
                          /* TEXT */
                        )) : A("v-if", !0)
                      ]),
                      i("div", Yu, [
                        (_(!0), v(
                          q,
                          null,
                          be(io.value, (r) => (_(), v("div", {
                            key: r.label,
                            class: "gauge",
                            title: r.effect
                          }, [
                            i("span", Xu, [
                              i("span", Qu, [
                                O(
                                  l(r.label),
                                  1
                                  /* TEXT */
                                ),
                                i(
                                  "em",
                                  ec,
                                  l(r.alias),
                                  1
                                  /* TEXT */
                                )
                              ]),
                              i("span", tc, [
                                i(
                                  "b",
                                  {
                                    class: R(["gauge-state", r.stateTone])
                                  },
                                  l(r.state),
                                  3
                                  /* TEXT, CLASS */
                                ),
                                O(
                                  " " + l(r.display),
                                  1
                                  /* TEXT */
                                )
                              ])
                            ]),
                            i(
                              "span",
                              {
                                class: R(["gauge-bar", { signed: r.signed }])
                              },
                              [
                                i(
                                  "i",
                                  {
                                    class: R(["gauge-fill", r.signed ? r.value >= 0 ? "good" : "bad" : ft(r)]),
                                    style: ut(r.signed ? ot(r.value) : { width: (pt(r) * 100).toFixed(1) + "%" })
                                  },
                                  null,
                                  6
                                  /* CLASS, STYLE */
                                )
                              ],
                              2
                              /* CLASS */
                            ),
                            i(
                              "span",
                              nc,
                              l(r.effect),
                              1
                              /* TEXT */
                            )
                          ], 8, Ju))),
                          128
                          /* KEYED_FRAGMENT */
                        ))
                      ]),
                      i("details", ic, [
                        i(
                          "summary",
                          null,
                          l(a("life.companion.realtime.moreReadouts")),
                          1
                          /* TEXT */
                        ),
                        i("div", oc, [
                          H.value.help_seek != null ? (_(), v("div", ac, [
                            i(
                              "span",
                              null,
                              l(a("life.companion.metric.helpSeeking")),
                              1
                              /* TEXT */
                            ),
                            i(
                              "strong",
                              null,
                              l(xe(H.value.help_seek, 2)),
                              1
                              /* TEXT */
                            )
                          ])) : A("v-if", !0),
                          H.value.big5 ? (_(), v("div", sc, [
                            u[106] || (u[106] = i(
                              "span",
                              null,
                              "Big5 O·C·E·A·N",
                              -1
                              /* CACHED */
                            )),
                            i(
                              "strong",
                              null,
                              l(vi.value),
                              1
                              /* TEXT */
                            )
                          ])) : A("v-if", !0),
                          H.value.hexaco ? (_(), v("div", lc, [
                            u[107] || (u[107] = i(
                              "span",
                              null,
                              "HEXACO H·E·X·A·C·O",
                              -1
                              /* CACHED */
                            )),
                            i(
                              "strong",
                              null,
                              l(qn.value),
                              1
                              /* TEXT */
                            )
                          ])) : A("v-if", !0),
                          H.value.mbti ? (_(), v("div", rc, [
                            u[108] || (u[108] = i(
                              "span",
                              null,
                              "MBTI / DISC",
                              -1
                              /* CACHED */
                            )),
                            i(
                              "strong",
                              null,
                              l(H.value.mbti) + " · " + l(H.value.disc || "—"),
                              1
                              /* TEXT */
                            )
                          ])) : A("v-if", !0),
                          H.value.theta_dim ? (_(), v("div", uc, [
                            i(
                              "span",
                              null,
                              l(a("life.companion.metric.thetaDim")),
                              1
                              /* TEXT */
                            ),
                            i(
                              "strong",
                              null,
                              l(a("life.companion.dimensionsValue", { n: H.value.theta_dim })) + " · " + l(H.value.family || "—"),
                              1
                              /* TEXT */
                            )
                          ])) : A("v-if", !0),
                          Yn.value.length ? (_(), v("div", cc, [
                            i(
                              "span",
                              null,
                              l(a("life.companion.metric.topDesires")),
                              1
                              /* TEXT */
                            ),
                            i(
                              "strong",
                              null,
                              l(Yn.value.join(" · ")),
                              1
                              /* TEXT */
                            )
                          ])) : A("v-if", !0),
                          gi.value.length ? (_(), v("div", dc, [
                            i(
                              "span",
                              null,
                              l(a("life.companion.metric.topEmotions")),
                              1
                              /* TEXT */
                            ),
                            i(
                              "strong",
                              null,
                              l(gi.value.join(" · ")),
                              1
                              /* TEXT */
                            )
                          ])) : A("v-if", !0),
                          H.value.learning?.enabled ? (_(), v("div", hc, [
                            i(
                              "span",
                              null,
                              l(a("life.companion.metric.learningState")),
                              1
                              /* TEXT */
                            ),
                            i(
                              "strong",
                              null,
                              l(H.value.learning.q_size) + " · " + l(xe(Ji.value, 3)),
                              1
                              /* TEXT */
                            )
                          ])) : A("v-if", !0)
                        ])
                      ])
                    ],
                    64
                    /* STABLE_FRAGMENT */
                  )) : A("v-if", !0),
                  i("details", pc, [
                    i(
                      "summary",
                      null,
                      l(a("life.companion.realtime.moreReadouts")),
                      1
                      /* TEXT */
                    ),
                    i("div", fc, [
                      i("div", mc, [
                        i(
                          "span",
                          null,
                          l(a("life.companion.metric.arbitrationMode")),
                          1
                          /* TEXT */
                        ),
                        i(
                          "strong",
                          null,
                          l(on.value?.mode || "—"),
                          1
                          /* TEXT */
                        )
                      ]),
                      i("div", _c, [
                        i(
                          "span",
                          null,
                          l(a("life.companion.metric.currentStrategy")),
                          1
                          /* TEXT */
                        ),
                        i(
                          "strong",
                          null,
                          l(on.value?.action || "—"),
                          1
                          /* TEXT */
                        )
                      ]),
                      i("div", vc, [
                        i(
                          "span",
                          null,
                          l(a("life.companion.metric.controlNeed")),
                          1
                          /* TEXT */
                        ),
                        i(
                          "strong",
                          null,
                          l(xe(on.value?.need)),
                          1
                          /* TEXT */
                        )
                      ]),
                      i("div", gc, [
                        i(
                          "span",
                          null,
                          l(a("life.companion.metric.confidence")),
                          1
                          /* TEXT */
                        ),
                        i(
                          "strong",
                          null,
                          l(xe(on.value?.confidence)),
                          1
                          /* TEXT */
                        )
                      ]),
                      i("div", yc, [
                        i(
                          "span",
                          null,
                          l(a("life.companion.metric.decidedTurns")),
                          1
                          /* TEXT */
                        ),
                        i(
                          "strong",
                          null,
                          l(Bt.value?.turns ?? 0),
                          1
                          /* TEXT */
                        )
                      ]),
                      i("div", bc, [
                        i(
                          "span",
                          null,
                          l(a("life.companion.metric.engrams")),
                          1
                          /* TEXT */
                        ),
                        i(
                          "strong",
                          null,
                          l(Bt.value?.engrams ?? 0),
                          1
                          /* TEXT */
                        )
                      ]),
                      i("div", wc, [
                        i(
                          "span",
                          null,
                          l(a("life.companion.metric.reliability")),
                          1
                          /* TEXT */
                        ),
                        i(
                          "strong",
                          null,
                          l(xe(Bt.value?.reliability)),
                          1
                          /* TEXT */
                        )
                      ]),
                      i("div", xc, [
                        i(
                          "span",
                          null,
                          l(a("life.companion.metric.personaTraits")),
                          1
                          /* TEXT */
                        ),
                        i(
                          "strong",
                          null,
                          l(Kt.value?.applied ? Kt.value.source === "llm" ? a("life.companion.metric.appliedLlm") : a("life.companion.metric.appliedLocal") : a("life.companion.metric.notParsed")),
                          1
                          /* TEXT */
                        )
                      ]),
                      i("div", kc, [
                        i(
                          "span",
                          null,
                          l(a("life.companion.metric.lexicon")),
                          1
                          /* TEXT */
                        ),
                        i(
                          "strong",
                          null,
                          l(qt.value?.lexicon_size ?? 0),
                          1
                          /* TEXT */
                        )
                      ]),
                      ht.value ? (_(), v(
                        q,
                        { key: 0 },
                        [
                          i("div", Pc, [
                            i(
                              "span",
                              null,
                              l(a("life.companion.metric.episodeCourse")),
                              1
                              /* TEXT */
                            ),
                            i(
                              "strong",
                              null,
                              l(yi(ht.value.state)),
                              1
                              /* TEXT */
                            )
                          ]),
                          i("div", Lc, [
                            i(
                              "span",
                              null,
                              l(a("life.companion.metric.episodeSeverity")),
                              1
                              /* TEXT */
                            ),
                            i(
                              "strong",
                              null,
                              l(xe(ht.value.severity, 2)),
                              1
                              /* TEXT */
                            )
                          ]),
                          i("div", Tc, [
                            i(
                              "span",
                              null,
                              l(a("life.companion.metric.episodesRelapses")),
                              1
                              /* TEXT */
                            ),
                            i(
                              "strong",
                              null,
                              l(ht.value.episodes) + " / " + l(ht.value.relapses),
                              1
                              /* TEXT */
                            )
                          ]),
                          ht.value.state === "episode" ? (_(), v("div", Sc, [
                            i(
                              "span",
                              null,
                              l(a("life.companion.metric.duration")),
                              1
                              /* TEXT */
                            ),
                            i(
                              "strong",
                              null,
                              l(a("life.companion.daysValue", { n: xe(ht.value.days_in_episode, 1) })),
                              1
                              /* TEXT */
                            )
                          ])) : A("v-if", !0)
                        ],
                        64
                        /* STABLE_FRAGMENT */
                      )) : A("v-if", !0)
                    ])
                  ])
                ],
                64
                /* STABLE_FRAGMENT */
              )) : (_(), v(
                "div",
                sr,
                l(a("life.companion.realtime.empty")),
                1
                /* TEXT */
              )),
              ht.value ? (_(), v(
                "p",
                Cc,
                l(a("life.companion.realtime.episodeHint")),
                1
                /* TEXT */
              )) : A("v-if", !0),
              $e.value?.enabled ? (_(), v(
                "p",
                Mc,
                l(a("life.companion.realtime.attachmentHint", { label: $e.value.label, severity: xe($e.value.severity, 2), band: $e.value.band, safety: $e.value.safe_mode ? a("life.companion.realtime.safetyOnEmotion") : a("life.companion.realtime.safetyOff") })),
                1
                /* TEXT */
              )) : A("v-if", !0),
              Ie.value?.enabled ? (_(), v(
                "p",
                zc,
                l(a("life.companion.realtime.tsundereHint", { label: Ie.value.label || Ie.value.type, affection: xe(Ie.value.affection, 2), expression: xe(Ie.value.expression, 2), fixation: xe(Ie.value.fixation, 2), band: Ie.value.band, safety: Ie.value.safe_mode ? a("life.companion.realtime.safetyOnFeeling") : a("life.companion.realtime.safetyOff") })),
                1
                /* TEXT */
              )) : A("v-if", !0),
              H.value?.enabled ? (_(), v(
                "p",
                Ec,
                l(a("life.companion.realtime.personadynHint", { label: H.value.label || H.value.type, family: H.value.family || "—", theta: H.value.theta_dim, mode: H.value.mode_label || H.value.mode, pressure: xe(H.value.pressure, 2), band: H.value.band, gender: H.value.gender || I("life.companion.pdGender.unspecified"), learning: H.value.learning?.enabled ? a("life.companion.realtime.learningOnline") : "", safety: H.value.safe_mode ? a("life.companion.realtime.safetyOnFeeling") : a("life.companion.realtime.safetyOff") })),
                1
                /* TEXT */
              )) : A("v-if", !0),
              Kt.value?.applied ? (_(), v(
                "p",
                Oc,
                l(a("life.companion.realtime.personaApplied", { source: Kt.value.source === "llm" ? a("life.companion.realtime.personaSourceLlm") : a("life.companion.realtime.personaSourceLocal"), evidence: ki.value || "—" })),
                1
                /* TEXT */
              )) : A("v-if", !0)
            ]),
            i("article", Ac, [
              i(
                "h3",
                null,
                l(a("life.companion.switches.title")),
                1
                /* TEXT */
              ),
              i("div", Ic, [
                i("label", Bc, [
                  x(i(
                    "input",
                    {
                      type: "checkbox",
                      "onUpdate:modelValue": u[42] || (u[42] = (r) => m.value.cog_enabled = r)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [he, m.value.cog_enabled]
                  ]),
                  i(
                    "span",
                    null,
                    l(a("life.companion.switches.enableCognition")),
                    1
                    /* TEXT */
                  )
                ]),
                i("label", Zc, [
                  x(i(
                    "input",
                    {
                      type: "checkbox",
                      "onUpdate:modelValue": u[43] || (u[43] = (r) => m.value.cog_lite_mode = r)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [he, m.value.cog_lite_mode]
                  ]),
                  i(
                    "span",
                    null,
                    l(a("life.companion.switches.liteMode")),
                    1
                    /* TEXT */
                  )
                ]),
                i("label", Nc, [
                  x(i(
                    "input",
                    {
                      type: "checkbox",
                      "onUpdate:modelValue": u[44] || (u[44] = (r) => m.value.cog_modulate_affect = r)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [he, m.value.cog_modulate_affect]
                  ]),
                  i(
                    "span",
                    null,
                    l(a("life.companion.switches.modulateAffect")),
                    1
                    /* TEXT */
                  )
                ]),
                i("label", Dc, [
                  x(i(
                    "input",
                    {
                      type: "checkbox",
                      "onUpdate:modelValue": u[45] || (u[45] = (r) => m.value.cog_modulate_language = r)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [he, m.value.cog_modulate_language]
                  ]),
                  i(
                    "span",
                    null,
                    l(a("life.companion.switches.modulateLanguage")),
                    1
                    /* TEXT */
                  )
                ]),
                i("label", Rc, [
                  x(i(
                    "input",
                    {
                      type: "checkbox",
                      "onUpdate:modelValue": u[46] || (u[46] = (r) => m.value.cog_modulate_social = r)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [he, m.value.cog_modulate_social]
                  ]),
                  i(
                    "span",
                    null,
                    l(a("life.companion.switches.modulateSocial")),
                    1
                    /* TEXT */
                  )
                ]),
                i("label", Vc, [
                  x(i(
                    "input",
                    {
                      type: "checkbox",
                      "onUpdate:modelValue": u[47] || (u[47] = (r) => m.value.cog_modulate_selfhood = r)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [he, m.value.cog_modulate_selfhood]
                  ]),
                  i(
                    "span",
                    null,
                    l(a("life.companion.switches.modulateSelfhood")),
                    1
                    /* TEXT */
                  )
                ])
              ]),
              i(
                "p",
                $c,
                l(a("life.companion.switches.hint")),
                1
                /* TEXT */
              )
            ]),
            i("article", Uc, [
              i(
                "h3",
                null,
                l(a("life.companion.presets.title")),
                1
                /* TEXT */
              ),
              i(
                "p",
                Fc,
                l(a("life.companion.presets.hint")),
                1
                /* TEXT */
              ),
              i("div", Hc, [
                (_(), v(
                  q,
                  null,
                  be(sn, (r) => i("button", {
                    key: r.label,
                    type: "button",
                    class: "btn sm",
                    onClick: (C) => Qi(r.fields, r.label)
                  }, l(a(r.labelKey)), 9, Wc)),
                  64
                  /* STABLE_FRAGMENT */
                ))
              ])
            ]),
            i("div", Gc, [
              i("article", jc, [
                i("h3", null, [
                  O(
                    l(a("life.companion.decision.title")) + " ",
                    1
                    /* TEXT */
                  ),
                  i(
                    "span",
                    {
                      class: R(["count-pill", ye(!0).cls])
                    },
                    l(ye(!0).text),
                    3
                    /* TEXT, CLASS */
                  )
                ]),
                i("div", qc, [
                  i("label", null, [
                    i(
                      "span",
                      null,
                      l(a("life.companion.decision.planDepth")),
                      1
                      /* TEXT */
                    ),
                    i(
                      "small",
                      Kc,
                      l(a("life.companion.defaultHint", { n: Le.cog_plan_depth })),
                      1
                      /* TEXT */
                    ),
                    x(i(
                      "input",
                      {
                        "onUpdate:modelValue": u[48] || (u[48] = (r) => m.value.cog_plan_depth = r),
                        type: "number",
                        min: "1",
                        max: "6",
                        class: "field tiny"
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [
                        E,
                        m.value.cog_plan_depth,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  i("label", null, [
                    i(
                      "span",
                      null,
                      l(a("life.companion.decision.wmCapacity")),
                      1
                      /* TEXT */
                    ),
                    i(
                      "small",
                      Yc,
                      l(a("life.companion.defaultHint", { n: Le.cog_wm_capacity })),
                      1
                      /* TEXT */
                    ),
                    x(i(
                      "input",
                      {
                        "onUpdate:modelValue": u[49] || (u[49] = (r) => m.value.cog_wm_capacity = r),
                        type: "number",
                        min: "1",
                        max: "12",
                        class: "field tiny"
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [
                        E,
                        m.value.cog_wm_capacity,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  i("label", null, [
                    i(
                      "span",
                      null,
                      l(a("life.companion.decision.strategyTemp")),
                      1
                      /* TEXT */
                    ),
                    i(
                      "small",
                      Jc,
                      l(a("life.companion.defaultHint", { n: Le.cog_tau })),
                      1
                      /* TEXT */
                    ),
                    x(i(
                      "input",
                      {
                        "onUpdate:modelValue": u[50] || (u[50] = (r) => m.value.cog_tau = r),
                        type: "number",
                        step: "0.05",
                        min: "0.05",
                        max: "1",
                        class: "field tiny"
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [
                        E,
                        m.value.cog_tau,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  i("label", null, [
                    i(
                      "span",
                      null,
                      l(a("life.companion.decision.discount")),
                      1
                      /* TEXT */
                    ),
                    i(
                      "small",
                      Xc,
                      l(a("life.companion.defaultHint", { n: Le.cog_gamma })),
                      1
                      /* TEXT */
                    ),
                    x(i(
                      "input",
                      {
                        "onUpdate:modelValue": u[51] || (u[51] = (r) => m.value.cog_gamma = r),
                        type: "number",
                        step: "0.01",
                        min: "0",
                        max: "0.999",
                        class: "field tiny"
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [
                        E,
                        m.value.cog_gamma,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  i("label", null, [
                    i(
                      "span",
                      null,
                      l(a("life.companion.decision.habitRate")),
                      1
                      /* TEXT */
                    ),
                    i(
                      "small",
                      Qc,
                      l(a("life.companion.defaultHint", { n: Le.cog_alpha_habit })),
                      1
                      /* TEXT */
                    ),
                    x(i(
                      "input",
                      {
                        "onUpdate:modelValue": u[52] || (u[52] = (r) => m.value.cog_alpha_habit = r),
                        type: "number",
                        step: "0.01",
                        min: "0",
                        max: "1",
                        class: "field tiny"
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [
                        E,
                        m.value.cog_alpha_habit,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  i("label", null, [
                    i(
                      "span",
                      null,
                      l(a("life.companion.decision.modelfreeRate")),
                      1
                      /* TEXT */
                    ),
                    i(
                      "small",
                      ed,
                      l(a("life.companion.defaultHint", { n: Le.cog_alpha_mf })),
                      1
                      /* TEXT */
                    ),
                    x(i(
                      "input",
                      {
                        "onUpdate:modelValue": u[53] || (u[53] = (r) => m.value.cog_alpha_mf = r),
                        type: "number",
                        step: "0.01",
                        min: "0",
                        max: "1",
                        class: "field tiny"
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [
                        E,
                        m.value.cog_alpha_mf,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  i("label", null, [
                    i(
                      "span",
                      null,
                      l(a("life.companion.decision.surpriseThreshold")),
                      1
                      /* TEXT */
                    ),
                    i(
                      "small",
                      td,
                      l(a("life.companion.defaultHint", { n: Le.cog_theta_pe })),
                      1
                      /* TEXT */
                    ),
                    x(i(
                      "input",
                      {
                        "onUpdate:modelValue": u[54] || (u[54] = (r) => m.value.cog_theta_pe = r),
                        type: "number",
                        step: "0.05",
                        min: "0",
                        max: "1",
                        class: "field tiny"
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [
                        E,
                        m.value.cog_theta_pe,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  i("label", null, [
                    i(
                      "span",
                      null,
                      l(a("life.companion.decision.noveltyThreshold")),
                      1
                      /* TEXT */
                    ),
                    i(
                      "small",
                      nd,
                      l(a("life.companion.defaultHint", { n: Le.cog_theta_n })),
                      1
                      /* TEXT */
                    ),
                    x(i(
                      "input",
                      {
                        "onUpdate:modelValue": u[55] || (u[55] = (r) => m.value.cog_theta_n = r),
                        type: "number",
                        step: "0.05",
                        min: "0",
                        max: "1",
                        class: "field tiny"
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [
                        E,
                        m.value.cog_theta_n,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  i("label", null, [
                    i(
                      "span",
                      null,
                      l(a("life.companion.decision.prospectionHorizon")),
                      1
                      /* TEXT */
                    ),
                    i(
                      "small",
                      id,
                      l(a("life.companion.defaultHint", { n: Le.cog_prospection_horizon })),
                      1
                      /* TEXT */
                    ),
                    x(i(
                      "input",
                      {
                        "onUpdate:modelValue": u[56] || (u[56] = (r) => m.value.cog_prospection_horizon = r),
                        type: "number",
                        min: "1",
                        max: "8",
                        class: "field tiny"
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [
                        E,
                        m.value.cog_prospection_horizon,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ])
                ]),
                i("div", od, [
                  i("label", ad, [
                    x(i(
                      "input",
                      {
                        type: "checkbox",
                        "onUpdate:modelValue": u[57] || (u[57] = (r) => m.value.cog_use_thalamic_gate = r)
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [he, m.value.cog_use_thalamic_gate]
                    ]),
                    i(
                      "span",
                      null,
                      l(a("life.companion.decision.thalamicGate")),
                      1
                      /* TEXT */
                    )
                  ]),
                  i("label", sd, [
                    x(i(
                      "input",
                      {
                        type: "checkbox",
                        "onUpdate:modelValue": u[58] || (u[58] = (r) => m.value.cog_use_cerebellum = r)
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [he, m.value.cog_use_cerebellum]
                    ]),
                    i(
                      "span",
                      null,
                      l(a("life.companion.decision.cerebellum")),
                      1
                      /* TEXT */
                    )
                  ]),
                  i("label", ld, [
                    x(i(
                      "input",
                      {
                        type: "checkbox",
                        "onUpdate:modelValue": u[59] || (u[59] = (r) => m.value.cog_use_ofc_map = r)
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [he, m.value.cog_use_ofc_map]
                    ]),
                    i(
                      "span",
                      null,
                      l(a("life.companion.decision.ofcMap")),
                      1
                      /* TEXT */
                    )
                  ]),
                  i("label", rd, [
                    x(i(
                      "input",
                      {
                        type: "checkbox",
                        "onUpdate:modelValue": u[60] || (u[60] = (r) => m.value.cog_use_prospection = r)
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [he, m.value.cog_use_prospection]
                    ]),
                    i(
                      "span",
                      null,
                      l(a("life.companion.decision.prospection")),
                      1
                      /* TEXT */
                    )
                  ]),
                  i("label", ud, [
                    x(i(
                      "input",
                      {
                        type: "checkbox",
                        "onUpdate:modelValue": u[61] || (u[61] = (r) => m.value.cog_use_limbic_bias = r)
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [he, m.value.cog_use_limbic_bias]
                    ]),
                    i(
                      "span",
                      null,
                      l(a("life.companion.decision.limbicBias")),
                      1
                      /* TEXT */
                    )
                  ])
                ])
              ]),
              i("article", cd, [
                i("h3", null, [
                  O(
                    l(a("life.companion.affect.title")) + " ",
                    1
                    /* TEXT */
                  ),
                  i(
                    "span",
                    {
                      class: R(["count-pill", ye(!!m.value.cog_affect_enabled).cls])
                    },
                    l(ye(!!m.value.cog_affect_enabled).text),
                    3
                    /* TEXT, CLASS */
                  )
                ]),
                i("div", dd, [
                  i("label", null, [
                    i(
                      "span",
                      null,
                      l(a("life.companion.persona.erqProfile")),
                      1
                      /* TEXT */
                    ),
                    Ee(Ne(De), {
                      modelValue: m.value.cog_affect_profile,
                      "onUpdate:modelValue": u[62] || (u[62] = (r) => m.value.cog_affect_profile = r),
                      options: F.value,
                      "aria-label": a("life.companion.persona.erqProfile")
                    }, null, 8, ["modelValue", "options", "aria-label"])
                  ]),
                  i("label", null, [
                    i(
                      "span",
                      null,
                      l(a("life.companion.affect.vagalBaseline")),
                      1
                      /* TEXT */
                    ),
                    i(
                      "small",
                      hd,
                      l(a("life.companion.defaultHint", { n: Le.cog_affect_vagal })),
                      1
                      /* TEXT */
                    ),
                    x(i(
                      "input",
                      {
                        "onUpdate:modelValue": u[63] || (u[63] = (r) => m.value.cog_affect_vagal = r),
                        type: "number",
                        step: "0.05",
                        min: "0",
                        max: "1",
                        class: "field tiny"
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [
                        E,
                        m.value.cog_affect_vagal,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  i("label", null, [
                    i(
                      "span",
                      null,
                      l(a("life.companion.persona.threatBaseline")),
                      1
                      /* TEXT */
                    ),
                    i(
                      "small",
                      pd,
                      l(a("life.companion.defaultHint", { n: Le.cog_affect_threat })),
                      1
                      /* TEXT */
                    ),
                    x(i(
                      "input",
                      {
                        "onUpdate:modelValue": u[64] || (u[64] = (r) => m.value.cog_affect_threat = r),
                        type: "number",
                        step: "0.05",
                        min: "0",
                        max: "1",
                        class: "field tiny"
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [
                        E,
                        m.value.cog_affect_threat,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  i("label", null, [
                    i(
                      "span",
                      null,
                      l(a("life.companion.persona.rewardBaseline")),
                      1
                      /* TEXT */
                    ),
                    i(
                      "small",
                      fd,
                      l(a("life.companion.defaultHint", { n: Le.cog_affect_reward })),
                      1
                      /* TEXT */
                    ),
                    x(i(
                      "input",
                      {
                        "onUpdate:modelValue": u[65] || (u[65] = (r) => m.value.cog_affect_reward = r),
                        type: "number",
                        step: "0.1",
                        min: "0",
                        max: "2",
                        class: "field tiny"
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [
                        E,
                        m.value.cog_affect_reward,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ])
                ]),
                i("label", md, [
                  x(i(
                    "input",
                    {
                      type: "checkbox",
                      "onUpdate:modelValue": u[66] || (u[66] = (r) => m.value.cog_affect_enabled = r)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [he, m.value.cog_affect_enabled]
                  ]),
                  i(
                    "span",
                    null,
                    l(a("life.companion.affect.enable")),
                    1
                    /* TEXT */
                  )
                ]),
                i("label", _d, [
                  x(i(
                    "input",
                    {
                      type: "checkbox",
                      "onUpdate:modelValue": u[67] || (u[67] = (r) => m.value.cog_affect_somatic = r)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [he, m.value.cog_affect_somatic]
                  ]),
                  i(
                    "span",
                    null,
                    l(a("life.companion.affect.somatic")),
                    1
                    /* TEXT */
                  )
                ]),
                i("label", vd, [
                  x(i(
                    "input",
                    {
                      type: "checkbox",
                      "onUpdate:modelValue": u[68] || (u[68] = (r) => m.value.cog_affect_persona_llm = r)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [he, m.value.cog_affect_persona_llm]
                  ]),
                  i(
                    "span",
                    null,
                    l(a("life.companion.affect.personaLlm")),
                    1
                    /* TEXT */
                  )
                ])
              ]),
              i("article", gd, [
                i("h3", null, [
                  O(
                    l(a("life.companion.language.title")) + " ",
                    1
                    /* TEXT */
                  ),
                  i(
                    "span",
                    {
                      class: R(["count-pill", ye(!!m.value.cog_language_enabled).cls])
                    },
                    l(ye(!!m.value.cog_language_enabled).text),
                    3
                    /* TEXT, CLASS */
                  )
                ]),
                i("div", yd, [
                  i("label", null, [
                    i(
                      "span",
                      null,
                      l(a("life.companion.language.framing")),
                      1
                      /* TEXT */
                    ),
                    Ee(Ne(De), {
                      modelValue: m.value.cog_language_framing,
                      "onUpdate:modelValue": u[69] || (u[69] = (r) => m.value.cog_language_framing = r),
                      options: nn.value,
                      "aria-label": a("life.companion.language.framing")
                    }, null, 8, ["modelValue", "options", "aria-label"])
                  ]),
                  i("label", null, [
                    i(
                      "span",
                      null,
                      l(a("life.companion.language.boundary")),
                      1
                      /* TEXT */
                    ),
                    x(i(
                      "input",
                      {
                        "onUpdate:modelValue": u[70] || (u[70] = (r) => m.value.cog_language_boundary = r),
                        type: "number",
                        step: "0.05",
                        min: "0",
                        max: "1",
                        class: "field tiny"
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [
                        E,
                        m.value.cog_language_boundary,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ])
                ]),
                i("label", bd, [
                  x(i(
                    "input",
                    {
                      type: "checkbox",
                      "onUpdate:modelValue": u[71] || (u[71] = (r) => m.value.cog_language_enabled = r)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [he, m.value.cog_language_enabled]
                  ]),
                  i(
                    "span",
                    null,
                    l(a("life.companion.language.enable")),
                    1
                    /* TEXT */
                  )
                ])
              ]),
              i("article", wd, [
                i("h3", null, [
                  O(
                    l(a("life.companion.social.title")) + " ",
                    1
                    /* TEXT */
                  ),
                  i(
                    "span",
                    {
                      class: R(["count-pill", ye(!!m.value.cog_social_enabled).cls])
                    },
                    l(ye(!!m.value.cog_social_enabled).text),
                    3
                    /* TEXT, CLASS */
                  )
                ]),
                i("div", xd, [
                  i("label", null, [
                    i(
                      "span",
                      null,
                      l(a("life.companion.metric.empathy")),
                      1
                      /* TEXT */
                    ),
                    x(i(
                      "input",
                      {
                        "onUpdate:modelValue": u[72] || (u[72] = (r) => m.value.cog_social_empathy = r),
                        type: "number",
                        step: "0.05",
                        min: "0",
                        max: "1",
                        class: "field tiny"
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [
                        E,
                        m.value.cog_social_empathy,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  i("label", null, [
                    i(
                      "span",
                      null,
                      l(a("life.companion.social.perspectiveStage")),
                      1
                      /* TEXT */
                    ),
                    Ee(Ne(De), {
                      modelValue: T.value,
                      "onUpdate:modelValue": u[73] || (u[73] = (r) => T.value = r),
                      options: y.value,
                      "aria-label": a("life.companion.social.perspectiveStage")
                    }, null, 8, ["modelValue", "options", "aria-label"])
                  ])
                ]),
                i("label", kd, [
                  x(i(
                    "input",
                    {
                      type: "checkbox",
                      "onUpdate:modelValue": u[74] || (u[74] = (r) => m.value.cog_social_enabled = r)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [he, m.value.cog_social_enabled]
                  ]),
                  i(
                    "span",
                    null,
                    l(a("life.companion.social.enable")),
                    1
                    /* TEXT */
                  )
                ])
              ]),
              i("article", Pd, [
                i("h3", null, [
                  O(
                    l(a("life.companion.selfhood.title")) + " ",
                    1
                    /* TEXT */
                  ),
                  i(
                    "span",
                    {
                      class: R(["count-pill", ye(!!m.value.cog_selfhood_enabled).cls])
                    },
                    l(ye(!!m.value.cog_selfhood_enabled).text),
                    3
                    /* TEXT, CLASS */
                  )
                ]),
                i("div", Ld, [
                  i("label", null, [
                    i(
                      "span",
                      null,
                      l(a("life.companion.selfhood.timeDiscount")),
                      1
                      /* TEXT */
                    ),
                    x(i(
                      "input",
                      {
                        "onUpdate:modelValue": u[75] || (u[75] = (r) => m.value.cog_selfhood_discount = r),
                        type: "number",
                        step: "0.05",
                        min: "0",
                        max: "1",
                        class: "field tiny"
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [
                        E,
                        m.value.cog_selfhood_discount,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  i("label", null, [
                    i(
                      "span",
                      null,
                      l(a("life.companion.selfhood.detailScale")),
                      1
                      /* TEXT */
                    ),
                    x(i(
                      "input",
                      {
                        "onUpdate:modelValue": u[76] || (u[76] = (r) => m.value.cog_selfhood_detail = r),
                        type: "number",
                        step: "1",
                        min: "1",
                        max: "50",
                        class: "field tiny"
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [
                        E,
                        m.value.cog_selfhood_detail,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ])
                ]),
                i("label", Td, [
                  x(i(
                    "input",
                    {
                      type: "checkbox",
                      "onUpdate:modelValue": u[77] || (u[77] = (r) => m.value.cog_selfhood_enabled = r)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [he, m.value.cog_selfhood_enabled]
                  ]),
                  i(
                    "span",
                    null,
                    l(a("life.companion.selfhood.enable")),
                    1
                    /* TEXT */
                  )
                ])
              ]),
              i("article", Sd, [
                i("h3", null, [
                  O(
                    l(a("life.companion.attachmentCard.title")) + " ",
                    1
                    /* TEXT */
                  ),
                  i(
                    "span",
                    {
                      class: R(["count-pill", ye(!!m.value.cog_attachment_enabled).cls])
                    },
                    l(ye(!!m.value.cog_attachment_enabled).text),
                    3
                    /* TEXT, CLASS */
                  )
                ]),
                i(
                  "p",
                  Cd,
                  l(a("life.companion.attachmentCard.hint")),
                  1
                  /* TEXT */
                ),
                i("label", Md, [
                  x(i(
                    "input",
                    {
                      type: "checkbox",
                      "onUpdate:modelValue": u[78] || (u[78] = (r) => m.value.cog_attachment_enabled = r)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [he, m.value.cog_attachment_enabled]
                  ]),
                  i(
                    "span",
                    null,
                    l(a("life.companion.attachmentCard.enable")),
                    1
                    /* TEXT */
                  )
                ]),
                i("div", zd, [
                  i("label", null, [
                    i(
                      "span",
                      null,
                      l(a("life.companion.metric.attachmentType")),
                      1
                      /* TEXT */
                    ),
                    Ee(Ne(De), {
                      modelValue: m.value.cog_attachment_type,
                      "onUpdate:modelValue": u[79] || (u[79] = (r) => m.value.cog_attachment_type = r),
                      options: Se.value,
                      "aria-label": a("life.companion.metric.attachmentType")
                    }, null, 8, ["modelValue", "options", "aria-label"])
                  ])
                ]),
                i(
                  "p",
                  Ed,
                  l(a("life.companion.attachmentCard.hint2")),
                  1
                  /* TEXT */
                )
              ]),
              i("article", Od, [
                i("h3", null, [
                  O(
                    l(a("life.companion.tsundereCard.title")) + " ",
                    1
                    /* TEXT */
                  ),
                  i(
                    "span",
                    {
                      class: R(["count-pill", ye(!!m.value.cog_tsundere_enabled).cls])
                    },
                    l(ye(!!m.value.cog_tsundere_enabled).text),
                    3
                    /* TEXT, CLASS */
                  )
                ]),
                i(
                  "p",
                  Ad,
                  l(a("life.companion.tsundereCard.hint")),
                  1
                  /* TEXT */
                ),
                i("label", Id, [
                  x(i(
                    "input",
                    {
                      type: "checkbox",
                      "onUpdate:modelValue": u[80] || (u[80] = (r) => m.value.cog_tsundere_enabled = r)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [he, m.value.cog_tsundere_enabled]
                  ]),
                  i(
                    "span",
                    null,
                    l(a("life.companion.tsundereCard.enable")),
                    1
                    /* TEXT */
                  )
                ]),
                i("div", Bd, [
                  i("label", null, [
                    i(
                      "span",
                      null,
                      l(a("life.companion.persona.tsundereType")),
                      1
                      /* TEXT */
                    ),
                    Ee(Ne(De), {
                      modelValue: m.value.cog_tsundere_type,
                      "onUpdate:modelValue": u[81] || (u[81] = (r) => m.value.cog_tsundere_type = r),
                      options: Gt.value,
                      "aria-label": a("life.companion.persona.tsundereType")
                    }, null, 8, ["modelValue", "options", "aria-label"])
                  ])
                ]),
                i(
                  "p",
                  Zd,
                  l(a("life.companion.tsundereCard.hint2")),
                  1
                  /* TEXT */
                )
              ]),
              i("article", Nd, [
                i("h3", null, [
                  O(
                    l(a("life.companion.yandereCard.title")) + " ",
                    1
                    /* TEXT */
                  ),
                  i(
                    "span",
                    {
                      class: R(["count-pill", ye(!!m.value.cog_yandere_enabled).cls])
                    },
                    l(ye(!!m.value.cog_yandere_enabled).text),
                    3
                    /* TEXT, CLASS */
                  )
                ]),
                i(
                  "p",
                  Dd,
                  l(a("life.companion.yandereCard.hint")),
                  1
                  /* TEXT */
                ),
                i("label", Rd, [
                  x(i(
                    "input",
                    {
                      type: "checkbox",
                      "onUpdate:modelValue": u[82] || (u[82] = (r) => m.value.cog_yandere_enabled = r)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [he, m.value.cog_yandere_enabled]
                  ]),
                  i(
                    "span",
                    null,
                    l(a("life.companion.yandereCard.enable")),
                    1
                    /* TEXT */
                  )
                ]),
                i("div", Vd, [
                  i("label", null, [
                    i(
                      "span",
                      null,
                      l(a("life.companion.yandereCard.type")),
                      1
                      /* TEXT */
                    ),
                    Ee(Ne(De), {
                      modelValue: m.value.cog_yandere_type,
                      "onUpdate:modelValue": u[83] || (u[83] = (r) => m.value.cog_yandere_type = r),
                      options: nt.value,
                      "aria-label": a("life.companion.yandereCard.type")
                    }, null, 8, ["modelValue", "options", "aria-label"])
                  ])
                ]),
                i(
                  "p",
                  $d,
                  l(a("life.companion.yandereCard.hint2")),
                  1
                  /* TEXT */
                )
              ]),
              i("article", Ud, [
                i("h3", null, [
                  O(
                    l(a("life.companion.personadynCard.title")) + " ",
                    1
                    /* TEXT */
                  ),
                  i(
                    "span",
                    {
                      class: R(["count-pill", ye(!!m.value.cog_personadyn_enabled).cls])
                    },
                    l(ye(!!m.value.cog_personadyn_enabled).text),
                    3
                    /* TEXT, CLASS */
                  )
                ]),
                i(
                  "p",
                  Fd,
                  l(a("life.companion.personadynCard.hint")),
                  1
                  /* TEXT */
                ),
                i("label", Hd, [
                  x(i(
                    "input",
                    {
                      type: "checkbox",
                      "onUpdate:modelValue": u[84] || (u[84] = (r) => m.value.cog_personadyn_enabled = r)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [he, m.value.cog_personadyn_enabled]
                  ]),
                  i(
                    "span",
                    null,
                    l(a("life.companion.personadynCard.enable")),
                    1
                    /* TEXT */
                  )
                ]),
                i("div", Wd, [
                  i("label", null, [
                    i(
                      "span",
                      null,
                      l(a("life.companion.persona.personaArchetype")),
                      1
                      /* TEXT */
                    ),
                    Ee(Ne(De), {
                      modelValue: m.value.cog_personadyn_type,
                      "onUpdate:modelValue": u[85] || (u[85] = (r) => m.value.cog_personadyn_type = r),
                      options: We.value,
                      "aria-label": a("life.companion.persona.personaArchetype")
                    }, null, 8, ["modelValue", "options", "aria-label"])
                  ]),
                  i("label", null, [
                    i(
                      "span",
                      null,
                      l(a("life.companion.persona.genderSocialScript")),
                      1
                      /* TEXT */
                    ),
                    Ee(Ne(De), {
                      modelValue: m.value.cog_personadyn_gender,
                      "onUpdate:modelValue": u[86] || (u[86] = (r) => m.value.cog_personadyn_gender = r),
                      options: Tt.value,
                      "aria-label": a("life.companion.persona.genderSocialScriptAria")
                    }, null, 8, ["modelValue", "options", "aria-label"])
                  ])
                ]),
                i(
                  "p",
                  Gd,
                  l(a("life.companion.personadynCard.hint2")),
                  1
                  /* TEXT */
                ),
                i(
                  "p",
                  jd,
                  l(a("life.companion.personadynCard.hint3")),
                  1
                  /* TEXT */
                )
              ]),
              i("article", qd, [
                i("h3", null, [
                  O(
                    l(a("life.companion.memoryCard.title")) + " ",
                    1
                    /* TEXT */
                  ),
                  i(
                    "span",
                    {
                      class: R(["count-pill", ye(!!m.value.cog_memory_encode).cls])
                    },
                    l(ye(!!m.value.cog_memory_encode).text),
                    3
                    /* TEXT, CLASS */
                  )
                ]),
                i(
                  "p",
                  Kd,
                  l(a("life.companion.memoryCard.hint")),
                  1
                  /* TEXT */
                ),
                i("div", Yd, [
                  i("label", Jd, [
                    x(i(
                      "input",
                      {
                        type: "checkbox",
                        "onUpdate:modelValue": u[87] || (u[87] = (r) => m.value.cog_memory_encode = r)
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [he, m.value.cog_memory_encode]
                    ]),
                    i(
                      "span",
                      null,
                      l(a("life.companion.memoryCard.selectiveEncoding")),
                      1
                      /* TEXT */
                    )
                  ]),
                  i("label", Xd, [
                    x(i(
                      "input",
                      {
                        type: "checkbox",
                        "onUpdate:modelValue": u[88] || (u[88] = (r) => m.value.cog_sleep_replay = r)
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [he, m.value.cog_sleep_replay]
                    ]),
                    i(
                      "span",
                      null,
                      l(a("life.companion.memoryCard.sleepReplay")),
                      1
                      /* TEXT */
                    )
                  ]),
                  i("label", Qd, [
                    x(i(
                      "input",
                      {
                        type: "checkbox",
                        "onUpdate:modelValue": u[89] || (u[89] = (r) => m.value.cog_memory_reconsolidate = r)
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [he, m.value.cog_memory_reconsolidate]
                    ]),
                    i(
                      "span",
                      null,
                      l(a("life.companion.memoryCard.reconsolidate")),
                      1
                      /* TEXT */
                    )
                  ]),
                  i("label", eh, [
                    x(i(
                      "input",
                      {
                        type: "checkbox",
                        "onUpdate:modelValue": u[90] || (u[90] = (r) => m.value.cog_cls_interleave = r)
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [he, m.value.cog_cls_interleave]
                    ]),
                    i(
                      "span",
                      null,
                      l(a("life.companion.memoryCard.cls")),
                      1
                      /* TEXT */
                    )
                  ])
                ])
              ])
            ])
          ],
          512
          /* NEED_PATCH */
        ), [
          [Gn, se.value === "cognition"]
        ]),
        x(i(
          "section",
          th,
          [
            i("div", nh, [
              i("div", null, [
                i(
                  "h2",
                  null,
                  l(a("life.companion.world.title")),
                  1
                  /* TEXT */
                ),
                i(
                  "p",
                  ih,
                  l(a("life.companion.world.desc")),
                  1
                  /* TEXT */
                )
              ]),
              i("div", oh, [
                i(
                  "button",
                  {
                    class: "btn filled sm",
                    onClick: Qt
                  },
                  l(a("life.companion.saveSettings")),
                  1
                  /* TEXT */
                )
              ])
            ]),
            i("article", ah, [
              i(
                "h3",
                null,
                l(a("life.companion.world.density")),
                1
                /* TEXT */
              ),
              i("div", sh, [
                i("label", null, [
                  i(
                    "span",
                    null,
                    l(a("life.companion.world.density")),
                    1
                    /* TEXT */
                  ),
                  Ee(Ne(De), {
                    modelValue: rn.value,
                    "onUpdate:modelValue": u[91] || (u[91] = (r) => rn.value = r),
                    options: un.value,
                    "aria-label": a("life.companion.world.densityAria")
                  }, null, 8, ["modelValue", "options", "aria-label"])
                ]),
                i("label", lh, [
                  x(i(
                    "input",
                    {
                      type: "checkbox",
                      "onUpdate:modelValue": u[92] || (u[92] = (r) => Zt.value = r)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [he, Zt.value]
                  ]),
                  i(
                    "span",
                    null,
                    l(a("life.companion.world.scene")),
                    1
                    /* TEXT */
                  )
                ])
              ]),
              i(
                "p",
                rh,
                l(a("life.companion.world.sceneHint")),
                1
                /* TEXT */
              ),
              i(
                "p",
                uh,
                l(a("life.companion.world.densityHint")),
                1
                /* TEXT */
              )
            ]),
            i("article", ch, [
              i(
                "h3",
                null,
                l(a("life.companion.world.personaTraits")),
                1
                /* TEXT */
              ),
              i(
                "p",
                dh,
                l(a("life.companion.world.personaTraitsHint")),
                1
                /* TEXT */
              ),
              i("label", hh, [
                i(
                  "span",
                  ph,
                  l(a("life.companion.world.personaText")),
                  1
                  /* TEXT */
                ),
                x(i("textarea", {
                  "onUpdate:modelValue": u[93] || (u[93] = (r) => Mt.value = r),
                  class: "world-text",
                  rows: "4",
                  placeholder: a("life.companion.world.personaPlaceholder")
                }, null, 8, fh), [
                  [E, Mt.value]
                ])
              ])
            ]),
            i("article", mh, [
              i(
                "h3",
                null,
                l(a("life.companion.world.location")),
                1
                /* TEXT */
              ),
              i(
                "p",
                _h,
                l(a("life.companion.world.locationHint")),
                1
                /* TEXT */
              ),
              i("div", vh, [
                i("label", null, [
                  i(
                    "span",
                    null,
                    l(a("life.companion.world.worldType")),
                    1
                    /* TEXT */
                  ),
                  Ee(Ne(De), {
                    modelValue: Jt.value,
                    "onUpdate:modelValue": u[94] || (u[94] = (r) => Jt.value = r),
                    options: ke.value,
                    "aria-label": a("life.companion.world.worldType")
                  }, null, 8, ["modelValue", "options", "aria-label"])
                ]),
                i("label", null, [
                  i(
                    "span",
                    null,
                    l(a("life.companion.world.country")),
                    1
                    /* TEXT */
                  ),
                  x(i("input", {
                    "onUpdate:modelValue": u[95] || (u[95] = (r) => Xt.value = r),
                    class: "field",
                    placeholder: a("life.companion.world.countryPlaceholder")
                  }, null, 8, gh), [
                    [E, Xt.value]
                  ])
                ]),
                i("label", null, [
                  i(
                    "span",
                    null,
                    l(a("life.companion.world.city")),
                    1
                    /* TEXT */
                  ),
                  x(i("input", {
                    "onUpdate:modelValue": u[96] || (u[96] = (r) => bt.value = r),
                    class: "field",
                    placeholder: a("life.companion.world.cityPlaceholder")
                  }, null, 8, yh), [
                    [E, bt.value]
                  ])
                ]),
                i("label", null, [
                  i(
                    "span",
                    null,
                    l(a("life.companion.world.district")),
                    1
                    /* TEXT */
                  ),
                  x(i("input", {
                    "onUpdate:modelValue": u[97] || (u[97] = (r) => Q.value = r),
                    class: "field",
                    placeholder: a("life.companion.world.districtPlaceholder")
                  }, null, 8, bh), [
                    [E, Q.value]
                  ])
                ])
              ]),
              i("label", wh, [
                i(
                  "span",
                  xh,
                  l(a("life.companion.world.premiseLabel")),
                  1
                  /* TEXT */
                ),
                x(i("textarea", {
                  "onUpdate:modelValue": u[98] || (u[98] = (r) => fe.value = r),
                  class: "world-text",
                  rows: "3",
                  placeholder: a("life.companion.world.premisePlaceholder")
                }, null, 8, kh), [
                  [E, fe.value]
                ])
              ]),
              i("label", Ph, [
                i(
                  "span",
                  Lh,
                  l(a("life.companion.world.actorsLabel")),
                  1
                  /* TEXT */
                ),
                x(i("textarea", {
                  "onUpdate:modelValue": u[99] || (u[99] = (r) => mt.value = r),
                  class: "world-text",
                  rows: "4",
                  placeholder: a("life.companion.world.actorsPlaceholder")
                }, null, 8, Th), [
                  [E, mt.value]
                ])
              ]),
              i("label", Sh, [
                i(
                  "span",
                  Ch,
                  l(a("life.companion.world.placesLabel")),
                  1
                  /* TEXT */
                ),
                x(i("textarea", {
                  "onUpdate:modelValue": u[100] || (u[100] = (r) => _t.value = r),
                  class: "world-text",
                  rows: "2",
                  placeholder: a("life.companion.world.placesPlaceholder")
                }, null, 8, Mh), [
                  [E, _t.value]
                ])
              ]),
              i("div", zh, [
                i("button", {
                  class: "btn filled sm",
                  type: "button",
                  disabled: Xe.value,
                  onClick: Oi
                }, l(Xe.value ? a("life.companion.world.generating") : a("life.companion.world.generateMapOnly")), 9, Eh),
                i("button", {
                  class: "btn tonic sm",
                  type: "button",
                  disabled: Xe.value,
                  onClick: vn
                }, l(Xe.value ? a("life.companion.world.generating") : a("life.companion.world.generateWorld")), 9, Oh),
                i(
                  "span",
                  Ah,
                  l(a("life.companion.world.generateHint")),
                  1
                  /* TEXT */
                )
              ])
            ]),
            i("article", Ih, [
              i("div", Bh, [
                i("h3", null, [
                  O(
                    l(a("life.companion.world.map")) + " ",
                    1
                    /* TEXT */
                  ),
                  i(
                    "span",
                    Zh,
                    l(J.value.locations.length),
                    1
                    /* TEXT */
                  )
                ]),
                at.value ? (_(), v(
                  "span",
                  Nh,
                  l(at.value.fictional ? a("life.companion.worldFictional.fictional") : a("life.companion.worldFictional.real")) + " · " + l([at.value.country, at.value.city, at.value.district].filter(Boolean).join(" / ") || a("life.companion.world.unnamed")),
                  1
                  /* TEXT */
                )) : A("v-if", !0)
              ]),
              at.value?.premise ? (_(), v(
                "p",
                Dh,
                l(at.value.premise),
                1
                /* TEXT */
              )) : A("v-if", !0),
              i("div", Rh, [
                i(
                  "div",
                  {
                    ref_key: "mapEl",
                    ref: Et,
                    class: R(["world-map-leaflet", { "is-empty": !J.value.locations.length }])
                  },
                  null,
                  2
                  /* CLASS */
                ),
                wt.value ? (_(), v(
                  "div",
                  Vh,
                  l(a("life.companion.world.offline")),
                  1
                  /* TEXT */
                )) : A("v-if", !0),
                J.value.locations.length ? (_(), v(
                  q,
                  { key: 1 },
                  [
                    J.value.kind !== "real" && J.value.nation ? (_(), v(
                      "button",
                      {
                        key: 0,
                        type: "button",
                        class: "wm-scope",
                        onClick: j
                      },
                      l(Ot.value === "city" ? a("life.companion.world.nationView") : a("life.companion.world.cityView")),
                      1
                      /* TEXT */
                    )) : A("v-if", !0),
                    i(
                      "button",
                      {
                        type: "button",
                        class: "wm-reset",
                        onClick: lo
                      },
                      l(a("life.companion.world.resetView")),
                      1
                      /* TEXT */
                    ),
                    J.value.kind !== "real" && Ot.value === "city" ? (_(), v("div", $h, [...u[109] || (u[109] = [
                      i(
                        "i",
                        null,
                        "N",
                        -1
                        /* CACHED */
                      )
                    ])])) : A("v-if", !0)
                  ],
                  64
                  /* STABLE_FRAGMENT */
                )) : A("v-if", !0)
              ]),
              J.value.locations.length ? A("v-if", !0) : (_(), v(
                "p",
                Uh,
                l(a("life.companion.world.noMap")),
                1
                /* TEXT */
              )),
              J.value.locations.length ? (_(), v("div", Fh, [
                (_(!0), v(
                  q,
                  null,
                  be(Ce.value, (r) => (_(), v("span", { key: r }, [
                    i(
                      "i",
                      {
                        class: R("k-" + r)
                      },
                      null,
                      2
                      /* CLASS */
                    ),
                    O(
                      l(a(An[r])),
                      1
                      /* TEXT */
                    )
                  ]))),
                  128
                  /* KEYED_FRAGMENT */
                )),
                i("span", null, [
                  u[110] || (u[110] = i(
                    "i",
                    { class: "k-actor" },
                    null,
                    -1
                    /* CACHED */
                  )),
                  O(
                    l(a("life.companion.world.actorsCount", { n: J.value.actors.length })),
                    1
                    /* TEXT */
                  )
                ]),
                J.value.kind !== "real" ? (_(), v(
                  q,
                  { key: 0 },
                  [
                    i("span", null, [
                      u[111] || (u[111] = i(
                        "i",
                        { class: "k-hw" },
                        null,
                        -1
                        /* CACHED */
                      )),
                      O(
                        l(a("life.companion.world.highwayLoop")),
                        1
                        /* TEXT */
                      )
                    ]),
                    i("span", null, [
                      u[112] || (u[112] = i(
                        "i",
                        { class: "k-arterial" },
                        null,
                        -1
                        /* CACHED */
                      )),
                      O(
                        l(a("life.companion.world.arterial")),
                        1
                        /* TEXT */
                      )
                    ]),
                    i("span", null, [
                      u[113] || (u[113] = i(
                        "i",
                        { class: "k-street" },
                        null,
                        -1
                        /* CACHED */
                      )),
                      O(
                        l(a("life.companion.world.street")),
                        1
                        /* TEXT */
                      )
                    ]),
                    i("span", null, [
                      u[114] || (u[114] = i(
                        "i",
                        { class: "k-metro" },
                        null,
                        -1
                        /* CACHED */
                      )),
                      O(
                        l(a("life.companion.world.metro")),
                        1
                        /* TEXT */
                      )
                    ]),
                    i("span", null, [
                      u[115] || (u[115] = i(
                        "i",
                        { class: "k-bus" },
                        null,
                        -1
                        /* CACHED */
                      )),
                      O(
                        l(a("life.companion.world.bus")),
                        1
                        /* TEXT */
                      )
                    ]),
                    i("span", null, [
                      u[116] || (u[116] = i(
                        "i",
                        { class: "k-park2" },
                        null,
                        -1
                        /* CACHED */
                      )),
                      O(
                        l(a("life.companion.kind.park")),
                        1
                        /* TEXT */
                      )
                    ]),
                    i("span", null, [
                      u[117] || (u[117] = i(
                        "i",
                        { class: "k-water" },
                        null,
                        -1
                        /* CACHED */
                      )),
                      O(
                        l(a("life.companion.world.water")),
                        1
                        /* TEXT */
                      )
                    ])
                  ],
                  64
                  /* STABLE_FRAGMENT */
                )) : A("v-if", !0)
              ])) : A("v-if", !0),
              J.value.locations.length && J.value.kind !== "real" && Ot.value === "city" ? (_(), v("div", Hh, [
                (J.value.metro || []).length ? (_(), v("div", Wh, [
                  i(
                    "h4",
                    null,
                    l(a("life.companion.world.metroRoutes")),
                    1
                    /* TEXT */
                  ),
                  i("ul", null, [
                    (_(!0), v(
                      q,
                      null,
                      be(J.value.metro, (r, C) => (_(), v("li", {
                        key: "m" + C
                      }, [
                        i(
                          "b",
                          {
                            style: ut({ color: r.color })
                          },
                          l(r.name),
                          5
                          /* TEXT, STYLE */
                        ),
                        i(
                          "span",
                          null,
                          l((r.stations || []).map((M) => M.name).filter(Boolean).join(" · ")),
                          1
                          /* TEXT */
                        )
                      ]))),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ])
                ])) : A("v-if", !0),
                (J.value.bus || []).length ? (_(), v("div", Gh, [
                  i(
                    "h4",
                    null,
                    l(a("life.companion.world.busRoutes")),
                    1
                    /* TEXT */
                  ),
                  i("ul", null, [
                    (_(!0), v(
                      q,
                      null,
                      be(J.value.bus, (r, C) => (_(), v("li", {
                        key: "b" + C
                      }, [
                        i(
                          "b",
                          {
                            style: ut({ color: r.color })
                          },
                          l(r.name),
                          5
                          /* TEXT, STYLE */
                        ),
                        i(
                          "span",
                          null,
                          l((r.stops || []).map((M) => M.name).filter(Boolean).join(" · ")),
                          1
                          /* TEXT */
                        )
                      ]))),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ])
                ])) : A("v-if", !0)
              ])) : A("v-if", !0)
            ]),
            i("article", jh, [
              i("div", qh, [
                i("h3", null, [
                  O(
                    l(a("life.companion.world.recentEvents")) + " ",
                    1
                    /* TEXT */
                  ),
                  i(
                    "span",
                    Kh,
                    l(Cn.value.length),
                    1
                    /* TEXT */
                  )
                ]),
                Cn.value.length ? (_(), v(
                  "button",
                  {
                    key: 0,
                    type: "button",
                    class: "btn tonic sm",
                    onClick: co
                  },
                  l(a("life.companion.world.clearTitle")),
                  1
                  /* TEXT */
                )) : A("v-if", !0)
              ]),
              i("ol", Yh, [
                (_(!0), v(
                  q,
                  null,
                  be(Cn.value, (r) => (_(), v("li", {
                    key: r.id
                  }, [
                    i(
                      "span",
                      Jh,
                      l(r.created_at),
                      1
                      /* TEXT */
                    ),
                    i(
                      "strong",
                      null,
                      l(r.summary),
                      1
                      /* TEXT */
                    )
                  ]))),
                  128
                  /* KEYED_FRAGMENT */
                )),
                Cn.value.length ? A("v-if", !0) : (_(), v(
                  "li",
                  Xh,
                  l(a("life.companion.world.noEvents")),
                  1
                  /* TEXT */
                ))
              ])
            ])
          ],
          512
          /* NEED_PATCH */
        ), [
          [Gn, se.value === "world"]
        ]),
        x(i(
          "section",
          Qh,
          [
            i("div", ep, [
              i("div", null, [
                i(
                  "h2",
                  null,
                  l(a("life.companion.beh.title")),
                  1
                  /* TEXT */
                ),
                i(
                  "p",
                  tp,
                  l(a("life.companion.beh.hint")),
                  1
                  /* TEXT */
                )
              ]),
              i("div", np, [
                i(
                  "button",
                  {
                    class: "btn filled sm",
                    onClick: Qt
                  },
                  l(a("life.companion.saveSettings")),
                  1
                  /* TEXT */
                )
              ])
            ]),
            (_(), v(
              q,
              null,
              be(de, (r) => i("article", {
                key: r.title,
                class: "card"
              }, [
                i(
                  "h3",
                  null,
                  l(a(r.title)),
                  1
                  /* TEXT */
                ),
                i("div", ip, [
                  (_(!0), v(
                    q,
                    null,
                    be(r.fields, (C) => (_(), v(
                      q,
                      {
                        key: C.key
                      },
                      [
                        C.type === "bool" ? (_(), v("label", op, [
                          x(i("input", {
                            type: "checkbox",
                            "onUpdate:modelValue": (M) => m.value[C.key] = M
                          }, null, 8, ap), [
                            [he, m.value[C.key]]
                          ]),
                          i(
                            "span",
                            null,
                            l(a(C.label)),
                            1
                            /* TEXT */
                          )
                        ])) : C.type === "stage" ? (_(), v("label", sp, [
                          i(
                            "span",
                            null,
                            l(a(C.label)),
                            1
                            /* TEXT */
                          ),
                          Ee(Ne(De), {
                            modelValue: m.value[C.key],
                            "onUpdate:modelValue": (M) => m.value[C.key] = M,
                            options: Ne(Ye),
                            "aria-label": a(C.label)
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "aria-label"])
                        ])) : C.type === "longtext" ? (_(), v("label", lp, [
                          i(
                            "span",
                            rp,
                            l(a(C.label)),
                            1
                            /* TEXT */
                          ),
                          x(i("textarea", {
                            "onUpdate:modelValue": (M) => m.value[C.key] = M,
                            class: "world-text",
                            rows: "2"
                          }, null, 8, up), [
                            [E, m.value[C.key]]
                          ])
                        ])) : (_(), v("label", cp, [
                          i(
                            "span",
                            null,
                            l(a(C.label)),
                            1
                            /* TEXT */
                          ),
                          x(i("input", {
                            "onUpdate:modelValue": (M) => m.value[C.key] = M,
                            type: C.type === "text" ? "text" : "number",
                            min: C.min,
                            max: C.max,
                            step: C.step,
                            class: "field"
                          }, null, 8, dp), [
                            [za, m.value[C.key]]
                          ])
                        ]))
                      ],
                      64
                      /* STABLE_FRAGMENT */
                    ))),
                    128
                    /* KEYED_FRAGMENT */
                  ))
                ])
              ])),
              64
              /* STABLE_FRAGMENT */
            ))
          ],
          512
          /* NEED_PATCH */
        ), [
          [Gn, se.value === "behavior"]
        ]),
        x(i(
          "section",
          hp,
          [
            Ee(Ds)
          ],
          512
          /* NEED_PATCH */
        ), [
          [Gn, se.value === "adapters"]
        ]),
        x(i(
          "section",
          pp,
          [
            i("div", fp, [
              i("div", null, [
                i(
                  "h2",
                  null,
                  l(a("life.companion.state.title")),
                  1
                  /* TEXT */
                ),
                i(
                  "p",
                  mp,
                  l(a("life.companion.state.desc")),
                  1
                  /* TEXT */
                )
              ])
            ]),
            i("article", _p, [
              i("h3", null, [
                O(
                  l(a("life.companion.state.relationships")) + " ",
                  1
                  /* TEXT */
                ),
                i(
                  "span",
                  vp,
                  l(ti.value.length),
                  1
                  /* TEXT */
                )
              ]),
              i(
                "p",
                gp,
                l(a("life.companion.state.relationshipsHint")),
                1
                /* TEXT */
              ),
              i("ol", yp, [
                (_(!0), v(
                  q,
                  null,
                  be(ti.value, (r) => (_(), v("li", {
                    key: r.user_id,
                    class: "rel-card"
                  }, [
                    i("div", bp, [
                      i(
                        "strong",
                        null,
                        l(r.user_id),
                        1
                        /* TEXT */
                      ),
                      i(
                        "span",
                        wp,
                        l(a("life.companion.state.lastSeenLabel")) + " " + l((r.last_seen || "").slice(0, 16).replace("T", " ") || "—"),
                        1
                        /* TEXT */
                      )
                    ]),
                    i("div", xp, [
                      i(
                        "span",
                        kp,
                        l(a("life.companion.state.stage")),
                        1
                        /* TEXT */
                      ),
                      i("span", {
                        class: "rel-track",
                        role: "img",
                        "aria-label": ln(r.stage)
                      }, [
                        (_(), v(
                          q,
                          null,
                          be(On, (C, M) => i(
                            "span",
                            {
                              key: C,
                              class: R(["rel-seg", { done: M < zi(r.stage), cur: M === zi(r.stage) }])
                            },
                            null,
                            2
                            /* CLASS */
                          )),
                          64
                          /* STABLE_FRAGMENT */
                        ))
                      ], 8, Pp),
                      i(
                        "span",
                        Lp,
                        l(ln(r.stage)),
                        1
                        /* TEXT */
                      )
                    ]),
                    i("div", {
                      class: "gauge",
                      title: a("life.companion.effect.affinity")
                    }, [
                      i("span", Sp, [
                        i("span", Cp, [
                          O(
                            l(a("life.companion.state.affinity")),
                            1
                            /* TEXT */
                          ),
                          i(
                            "em",
                            Mp,
                            l(a("life.companion.alias.affinity")),
                            1
                            /* TEXT */
                          )
                        ]),
                        i("span", zp, [
                          i(
                            "b",
                            {
                              class: R(["gauge-state", Number(r.affinity) >= 0 ? "good" : "bad"])
                            },
                            l(a("life.companion.gw.affinity." + it(Number(r.affinity) || 0))),
                            3
                            /* TEXT, CLASS */
                          ),
                          O(
                            " " + l(xe(r.affinity, 2)),
                            1
                            /* TEXT */
                          )
                        ])
                      ]),
                      i("span", Ep, [
                        i(
                          "i",
                          {
                            class: R(["gauge-fill", Number(r.affinity) >= 0 ? "good" : "bad"]),
                            style: ut(ot(Number(r.affinity) || 0))
                          },
                          null,
                          6
                          /* CLASS, STYLE */
                        )
                      ]),
                      i(
                        "span",
                        Op,
                        l(a("life.companion.effect.affinity")),
                        1
                        /* TEXT */
                      )
                    ], 8, Tp),
                    r.interaction ? (_(), v("div", Ap, [
                      i(
                        "span",
                        Ip,
                        l(a("life.companion.state.interaction")) + " · " + l(oo(r.interaction)),
                        1
                        /* TEXT */
                      ),
                      i(
                        "span",
                        Bp,
                        l(ao(r.interaction)),
                        1
                        /* TEXT */
                      )
                    ])) : A("v-if", !0)
                  ]))),
                  128
                  /* KEYED_FRAGMENT */
                )),
                ti.value.length ? A("v-if", !0) : (_(), v(
                  "li",
                  Zp,
                  l(a("life.companion.state.noRelationships")),
                  1
                  /* TEXT */
                ))
              ])
            ]),
            i("article", Np, [
              i("h3", null, [
                O(
                  l(a("life.companion.state.commitments")) + " ",
                  1
                  /* TEXT */
                ),
                i(
                  "span",
                  Dp,
                  l(Qn.value.length),
                  1
                  /* TEXT */
                )
              ]),
              i(
                "p",
                Rp,
                l(a("life.companion.state.commitmentsHint")),
                1
                /* TEXT */
              ),
              i("ol", Vp, [
                (_(!0), v(
                  q,
                  null,
                  be(Qn.value, (r) => (_(), v("li", {
                    key: r.id
                  }, [
                    i(
                      "strong",
                      null,
                      l(r.text),
                      1
                      /* TEXT */
                    ),
                    i(
                      "span",
                      $p,
                      l(r.user_id),
                      1
                      /* TEXT */
                    )
                  ]))),
                  128
                  /* KEYED_FRAGMENT */
                )),
                Qn.value.length ? A("v-if", !0) : (_(), v(
                  "li",
                  Up,
                  l(a("life.companion.state.noCommitments")),
                  1
                  /* TEXT */
                ))
              ])
            ]),
            i("div", Fp, [
              i("article", Hp, [
                i(
                  "h3",
                  null,
                  l(a("life.companion.state.userModel")),
                  1
                  /* TEXT */
                ),
                i(
                  "p",
                  Wp,
                  l(a("life.companion.state.userModelHint")),
                  1
                  /* TEXT */
                ),
                i("ol", Gp, [
                  (_(!0), v(
                    q,
                    null,
                    be(Pi.value, (r) => (_(), v("li", {
                      key: r.user_id
                    }, [
                      i(
                        "strong",
                        null,
                        l(r.user_id),
                        1
                        /* TEXT */
                      ),
                      i(
                        "span",
                        jp,
                        l(a("life.companion.state.likes", { items: ei(r.preferences).join(a("life.companion.listSeparator")) || "—" })),
                        1
                        /* TEXT */
                      ),
                      i(
                        "span",
                        qp,
                        l(a("life.companion.state.taboos", { items: ei(r.taboos).join(a("life.companion.listSeparator")) || "—" })),
                        1
                        /* TEXT */
                      ),
                      i(
                        "span",
                        Kp,
                        l(a("life.companion.state.concerns", { items: ei(r.concerns).join(a("life.companion.listSeparator")) || "—" })),
                        1
                        /* TEXT */
                      )
                    ]))),
                    128
                    /* KEYED_FRAGMENT */
                  )),
                  Pi.value.length ? A("v-if", !0) : (_(), v(
                    "li",
                    Yp,
                    l(a("life.companion.state.noUserModel")),
                    1
                    /* TEXT */
                  ))
                ])
              ]),
              i("article", Jp, [
                i(
                  "h3",
                  null,
                  l(a("life.companion.state.values")),
                  1
                  /* TEXT */
                ),
                i(
                  "p",
                  Xp,
                  l(a("life.companion.state.valuesHint")),
                  1
                  /* TEXT */
                ),
                i("ol", Qp, [
                  (_(!0), v(
                    q,
                    null,
                    be(Li.value, (r) => (_(), v("li", {
                      key: r.k,
                      class: "value-row"
                    }, [
                      i(
                        "span",
                        ef,
                        l(r.k),
                        1
                        /* TEXT */
                      ),
                      i("span", tf, [
                        i(
                          "i",
                          {
                            class: R(r.v >= 0 ? "good" : "bad"),
                            style: ut(ot(r.v))
                          },
                          null,
                          6
                          /* CLASS, STYLE */
                        )
                      ]),
                      i(
                        "span",
                        nf,
                        l(r.v.toFixed(2)),
                        1
                        /* TEXT */
                      )
                    ]))),
                    128
                    /* KEYED_FRAGMENT */
                  )),
                  Li.value.length ? A("v-if", !0) : (_(), v(
                    "li",
                    of,
                    l(a("life.companion.state.noValues")),
                    1
                    /* TEXT */
                  ))
                ])
              ])
            ])
          ],
          512
          /* NEED_PATCH */
        ), [
          [Gn, se.value === "state"]
        ]),
        i("section", af, [
          i("div", sf, [
            i("div", null, [
              i(
                "h2",
                null,
                l(a("life.companion.danger.title")),
                1
                /* TEXT */
              ),
              i(
                "p",
                lf,
                l(a("life.companion.danger.desc")),
                1
                /* TEXT */
              )
            ])
          ]),
          i("div", rf, [
            i("article", uf, [
              i(
                "h3",
                null,
                l(a("life.companion.danger.reset")),
                1
                /* TEXT */
              ),
              i(
                "p",
                cf,
                l(a("life.companion.danger.resetHint")),
                1
                /* TEXT */
              ),
              i("p", df, [
                i(
                  "strong",
                  null,
                  l(a("life.companion.danger.doubleConfirm")),
                  1
                  /* TEXT */
                )
              ]),
              i("div", hf, [
                i("button", {
                  class: "btn danger",
                  disabled: G.value,
                  onClick: ai
                }, l(G.value ? a("life.companion.danger.resetting") : a("life.companion.danger.reset")), 9, pf)
              ])
            ])
          ])
        ])
      ],
      512
      /* NEED_PATCH */
    ));
  }
}), _f = (me, g) => {
  const a = me.__vccOpts || me;
  for (const [Re, I] of g)
    a[Re] = I;
  return a;
}, bf = /* @__PURE__ */ _f(mf, [["__scopeId", "data-v-5782dfcc"]]);
export {
  bf as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('life-plugin-style')){const s=document.createElement('style');s.id='life-plugin-style';s.textContent=".leaflet-pane,.leaflet-tile,.leaflet-marker-icon,.leaflet-marker-shadow,.leaflet-tile-container,.leaflet-pane>svg,.leaflet-pane>canvas,.leaflet-zoom-box,.leaflet-image-layer,.leaflet-layer{position:absolute;left:0;top:0}.leaflet-container{overflow:hidden}.leaflet-tile,.leaflet-marker-icon,.leaflet-marker-shadow{-webkit-user-select:none;-moz-user-select:none;user-select:none;-webkit-user-drag:none}.leaflet-tile::selection{background:transparent}.leaflet-safari .leaflet-tile{image-rendering:-webkit-optimize-contrast}.leaflet-safari .leaflet-tile-container{width:1600px;height:1600px;-webkit-transform-origin:0 0}.leaflet-marker-icon,.leaflet-marker-shadow{display:block}.leaflet-container .leaflet-overlay-pane svg{max-width:none!important;max-height:none!important}.leaflet-container .leaflet-marker-pane img,.leaflet-container .leaflet-shadow-pane img,.leaflet-container .leaflet-tile-pane img,.leaflet-container img.leaflet-image-layer,.leaflet-container .leaflet-tile{max-width:none!important;max-height:none!important;width:auto;padding:0}.leaflet-container img.leaflet-tile{mix-blend-mode:plus-lighter}.leaflet-container.leaflet-touch-zoom{-ms-touch-action:pan-x pan-y;touch-action:pan-x pan-y}.leaflet-container.leaflet-touch-drag{-ms-touch-action:pinch-zoom;touch-action:none;touch-action:pinch-zoom}.leaflet-container.leaflet-touch-drag.leaflet-touch-zoom{-ms-touch-action:none;touch-action:none}.leaflet-container{-webkit-tap-highlight-color:transparent}.leaflet-container a{-webkit-tap-highlight-color:rgba(51,181,229,.4)}.leaflet-tile{filter:inherit;visibility:hidden}.leaflet-tile-loaded{visibility:inherit}.leaflet-zoom-box{width:0;height:0;-moz-box-sizing:border-box;box-sizing:border-box;z-index:800}.leaflet-overlay-pane svg{-moz-user-select:none}.leaflet-pane{z-index:400}.leaflet-tile-pane{z-index:200}.leaflet-overlay-pane{z-index:400}.leaflet-shadow-pane{z-index:500}.leaflet-marker-pane{z-index:600}.leaflet-tooltip-pane{z-index:650}.leaflet-popup-pane{z-index:700}.leaflet-map-pane canvas{z-index:100}.leaflet-map-pane svg{z-index:200}.leaflet-vml-shape{width:1px;height:1px}.lvml{behavior:url(#default#VML);display:inline-block;position:absolute}.leaflet-control{position:relative;z-index:800;pointer-events:visiblePainted;pointer-events:auto}.leaflet-top,.leaflet-bottom{position:absolute;z-index:1000;pointer-events:none}.leaflet-top{top:0}.leaflet-right{right:0}.leaflet-bottom{bottom:0}.leaflet-left{left:0}.leaflet-control{float:left;clear:both}.leaflet-right .leaflet-control{float:right}.leaflet-top .leaflet-control{margin-top:10px}.leaflet-bottom .leaflet-control{margin-bottom:10px}.leaflet-left .leaflet-control{margin-left:10px}.leaflet-right .leaflet-control{margin-right:10px}.leaflet-fade-anim .leaflet-popup{opacity:0;-webkit-transition:opacity .2s linear;-moz-transition:opacity .2s linear;transition:opacity .2s linear}.leaflet-fade-anim .leaflet-map-pane .leaflet-popup{opacity:1}.leaflet-zoom-animated{-webkit-transform-origin:0 0;-ms-transform-origin:0 0;transform-origin:0 0}svg.leaflet-zoom-animated{will-change:transform}.leaflet-zoom-anim .leaflet-zoom-animated{-webkit-transition:-webkit-transform .25s cubic-bezier(0,0,.25,1);-moz-transition:-moz-transform .25s cubic-bezier(0,0,.25,1);transition:transform .25s cubic-bezier(0,0,.25,1)}.leaflet-zoom-anim .leaflet-tile,.leaflet-pan-anim .leaflet-tile{-webkit-transition:none;-moz-transition:none;transition:none}.leaflet-zoom-anim .leaflet-zoom-hide{visibility:hidden}.leaflet-interactive{cursor:pointer}.leaflet-grab{cursor:-webkit-grab;cursor:-moz-grab;cursor:grab}.leaflet-crosshair,.leaflet-crosshair .leaflet-interactive{cursor:crosshair}.leaflet-popup-pane,.leaflet-control{cursor:auto}.leaflet-dragging .leaflet-grab,.leaflet-dragging .leaflet-grab .leaflet-interactive,.leaflet-dragging .leaflet-marker-draggable{cursor:move;cursor:-webkit-grabbing;cursor:-moz-grabbing;cursor:grabbing}.leaflet-marker-icon,.leaflet-marker-shadow,.leaflet-image-layer,.leaflet-pane>svg path,.leaflet-tile-container{pointer-events:none}.leaflet-marker-icon.leaflet-interactive,.leaflet-image-layer.leaflet-interactive,.leaflet-pane>svg path.leaflet-interactive,svg.leaflet-image-layer.leaflet-interactive path{pointer-events:visiblePainted;pointer-events:auto}.leaflet-container{background:#ddd;outline-offset:1px}.leaflet-container a{color:#0078a8}.leaflet-zoom-box{border:2px dotted #38f;background:#ffffff80}.leaflet-container{font-family:Helvetica Neue,Arial,Helvetica,sans-serif;font-size:12px;font-size:.75rem;line-height:1.5}.leaflet-bar{box-shadow:0 1px 5px #000000a6;border-radius:4px}.leaflet-bar a{background-color:#fff;border-bottom:1px solid #ccc;width:26px;height:26px;line-height:26px;display:block;text-align:center;text-decoration:none;color:#000}.leaflet-bar a,.leaflet-control-layers-toggle{background-position:50% 50%;background-repeat:no-repeat;display:block}.leaflet-bar a:hover,.leaflet-bar a:focus{background-color:#f4f4f4}.leaflet-bar a:first-child{border-top-left-radius:4px;border-top-right-radius:4px}.leaflet-bar a:last-child{border-bottom-left-radius:4px;border-bottom-right-radius:4px;border-bottom:none}.leaflet-bar a.leaflet-disabled{cursor:default;background-color:#f4f4f4;color:#bbb}.leaflet-touch .leaflet-bar a{width:30px;height:30px;line-height:30px}.leaflet-touch .leaflet-bar a:first-child{border-top-left-radius:2px;border-top-right-radius:2px}.leaflet-touch .leaflet-bar a:last-child{border-bottom-left-radius:2px;border-bottom-right-radius:2px}.leaflet-control-zoom-in,.leaflet-control-zoom-out{font:700 18px Lucida Console,Monaco,monospace;text-indent:1px}.leaflet-touch .leaflet-control-zoom-in,.leaflet-touch .leaflet-control-zoom-out{font-size:22px}.leaflet-control-layers{box-shadow:0 1px 5px #0006;background:#fff;border-radius:5px}.leaflet-control-layers-toggle{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAQAAAADQ4RFAAACf0lEQVR4AY1UM3gkARTePdvdoTxXKc+qTl3aU5U6b2Kbkz3Gtq3Zw6ziLGNPzrYx7946Tr6/ee/XeCQ4D3ykPtL5tHno4n0d/h3+xfuWHGLX81cn7r0iTNzjr7LrlxCqPtkbTQEHeqOrTy4Yyt3VCi/IOB0v7rVC7q45Q3Gr5K6jt+3Gl5nCoDD4MtO+j96Wu8atmhGqcNGHObuf8OM/x3AMx38+4Z2sPqzCxRFK2aF2e5Jol56XTLyggAMTL56XOMoS1W4pOyjUcGGQdZxU6qRh7B9Zp+PfpOFlqt0zyDZckPi1ttmIp03jX8gyJ8a/PG2yutpS/Vol7peZIbZcKBAEEheEIAgFbDkz5H6Zrkm2hVWGiXKiF4Ycw0RWKdtC16Q7qe3X4iOMxruonzegJzWaXFrU9utOSsLUmrc0YjeWYjCW4PDMADElpJSSQ0vQvA1Tm6/JlKnqFs1EGyZiFCqnRZTEJJJiKRYzVYzJck2Rm6P4iH+cmSY0YzimYa8l0EtTODFWhcMIMVqdsI2uiTvKmTisIDHJ3od5GILVhBCarCfVRmo4uTjkhrhzkiBV7SsaqS+TzrzM1qpGGUFt28pIySQHR6h7F6KSwGWm97ay+Z+ZqMcEjEWebE7wxCSQwpkhJqoZA5ivCdZDjJepuJ9IQjGGUmuXJdBFUygxVqVsxFsLMbDe8ZbDYVCGKxs+W080max1hFCarCfV+C1KATwcnvE9gRRuMP2prdbWGowm1KB1y+zwMMENkM755cJ2yPDtqhTI6ED1M/82yIDtC/4j4BijjeObflpO9I9MwXTCsSX8jWAFeHr05WoLTJ5G8IQVS/7vwR6ohirYM7f6HzYpogfS3R2OAAAAAElFTkSuQmCC);width:36px;height:36px}.leaflet-retina .leaflet-control-layers-toggle{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAQAAABvcdNgAAAEsklEQVR4AWL4TydIhpZK1kpWOlg0w3ZXP6D2soBtG42jeI6ZmQTHzAxiTbSJsYLjO9HhP+WOmcuhciVnmHVQcJnp7DFvScowZorad/+V/fVzMdMT2g9Cv9guXGv/7pYOrXh2U+RRR3dSd9JRx6bIFc/ekqHI29JC6pJ5ZEh1yWkhkbcFeSjxgx3L2m1cb1C7bceyxA+CNjT/Ifff+/kDk2u/w/33/IeCMOSaWZ4glosqT3DNnNZQ7Cs58/3Ce5HL78iZH/vKVIaYlqzfdLu8Vi7dnvUbEza5Idt36tquZFldl6N5Z/POLof0XLK61mZCmJSWjVF9tEjUluu74IUXvgttuVIHE7YxSkaYhJZam7yiM9Pv82JYfl9nptxZaxMJE4YSPty+vF0+Y2up9d3wwijfjZbabqm/3bZ9ecKHsiGmRflnn1MW4pjHf9oLufyn2z3y1D6n8g8TZhxyzipLNPnAUpsOiuWimg52psrTZYnOWYNDTMuWBWa0tJb4rgq1UvmutpaYEbZlwU3CLJm/ayYjHW5/h7xWLn9Hh1vepDkyf7dE7MtT5LR4e7yYpHrkhOUpEfssBLq2pPhAqoSWKUkk7EDqkmK6RrCEzqDjhNDWNE+XSMvkJRDWlZTmCW0l0PHQGRZY5t1L83kT0Y3l2SItk5JAWHl2dCOBm+fPu3fo5/3v61RMCO9Jx2EEYYhb0rmNQMX/vm7gqOEJLcXTGw3CAuRNeyaPWwjR8PRqKQ1PDA/dpv+on9Shox52WFnx0KY8onHayrJzm87i5h9xGw/tfkev0jGsQizqezUKjk12hBMKJ4kbCqGPVNXudyyrShovGw5CgxsRICxF6aRmSjlBnHRzg7Gx8fKqEubI2rahQYdR1YgDIRQO7JvQyD52hoIQx0mxa0ODtW2Iozn1le2iIRdzwWewedyZzewidueOGqlsn1MvcnQpuVwLGG3/IR1hIKxCjelIDZ8ldqWz25jWAsnldEnK0Zxro19TGVb2ffIZEsIO89EIEDvKMPrzmBOQcKQ+rroye6NgRRxqR4U8EAkz0CL6uSGOm6KQCdWjvjRiSP1BPalCRS5iQYiEIvxuBMJEWgzSoHADcVMuN7IuqqTeyUPq22qFimFtxDyBBJEwNyt6TM88blFHao/6tWWhuuOM4SAK4EI4QmFHA+SEyWlp4EQoJ13cYGzMu7yszEIBOm2rVmHUNqwAIQabISNMRstmdhNWcFLsSm+0tjJH1MdRxO5Nx0WDMhCtgD6OKgZeljJqJKc9po8juskR9XN0Y1lZ3mWjLR9JCO1jRDMd0fpYC2VnvjBSEFg7wBENc0R9HFlb0xvF1+TBEpF68d+DHR6IOWVv2BECtxo46hOFUBd/APU57WIoEwJhIi2CdpyZX0m93BZicktMj1AS9dClteUFAUNUIEygRZCtik5zSxI9MubTBH1GOiHsiLJ3OCoSZkILa9PxiN0EbvhsAo8tdAf9Seepd36lGWHmtNANTv5Jd0z4QYyeo/UEJqxKRpg5LZx6btLPsOaEmdMyxYdlc8LMaJnikDlhclqmPiQnTEpLUIZEwkRagjYkEibQErwhkTAKCLQEbUgkzJQWc/0PstHHcfEdQ+UAAAAASUVORK5CYII=);background-size:26px 26px}.leaflet-touch .leaflet-control-layers-toggle{width:44px;height:44px}.leaflet-control-layers .leaflet-control-layers-list,.leaflet-control-layers-expanded .leaflet-control-layers-toggle{display:none}.leaflet-control-layers-expanded .leaflet-control-layers-list{display:block;position:relative}.leaflet-control-layers-expanded{padding:6px 10px 6px 6px;color:#333;background:#fff}.leaflet-control-layers-scrollbar{overflow-y:scroll;overflow-x:hidden;padding-right:5px}.leaflet-control-layers-selector{margin-top:2px;position:relative;top:1px}.leaflet-control-layers label{display:block;font-size:13px;font-size:1.08333em}.leaflet-control-layers-separator{height:0;border-top:1px solid #ddd;margin:5px -10px 5px -6px}.leaflet-default-icon-path{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII=)}.leaflet-container .leaflet-control-attribution{background:#fff;background:#fffc;margin:0}.leaflet-control-attribution,.leaflet-control-scale-line{padding:0 5px;color:#333;line-height:1.4}.leaflet-control-attribution a{text-decoration:none}.leaflet-control-attribution a:hover,.leaflet-control-attribution a:focus{text-decoration:underline}.leaflet-attribution-flag{display:inline!important;vertical-align:baseline!important;width:1em;height:.6669em}.leaflet-left .leaflet-control-scale{margin-left:5px}.leaflet-bottom .leaflet-control-scale{margin-bottom:5px}.leaflet-control-scale-line{border:2px solid #777;border-top:none;line-height:1.1;padding:2px 5px 1px;white-space:nowrap;-moz-box-sizing:border-box;box-sizing:border-box;background:#fffc;text-shadow:1px 1px #fff}.leaflet-control-scale-line:not(:first-child){border-top:2px solid #777;border-bottom:none;margin-top:-2px}.leaflet-control-scale-line:not(:first-child):not(:last-child){border-bottom:2px solid #777}.leaflet-touch .leaflet-control-attribution,.leaflet-touch .leaflet-control-layers,.leaflet-touch .leaflet-bar{box-shadow:none}.leaflet-touch .leaflet-control-layers,.leaflet-touch .leaflet-bar{border:2px solid rgba(0,0,0,.2);background-clip:padding-box}.leaflet-popup{position:absolute;text-align:center;margin-bottom:20px}.leaflet-popup-content-wrapper{padding:1px;text-align:left;border-radius:12px}.leaflet-popup-content{margin:13px 24px 13px 20px;line-height:1.3;font-size:13px;font-size:1.08333em;min-height:1px}.leaflet-popup-content p{margin:1.3em 0}.leaflet-popup-tip-container{width:40px;height:20px;position:absolute;left:50%;margin-top:-1px;margin-left:-20px;overflow:hidden;pointer-events:none}.leaflet-popup-tip{width:17px;height:17px;padding:1px;margin:-10px auto 0;pointer-events:auto;-webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);-ms-transform:rotate(45deg);transform:rotate(45deg)}.leaflet-popup-content-wrapper,.leaflet-popup-tip{background:#fff;color:#333;box-shadow:0 3px 14px #0006}.leaflet-container a.leaflet-popup-close-button{position:absolute;top:0;right:0;border:none;text-align:center;width:24px;height:24px;font:16px/24px Tahoma,Verdana,sans-serif;color:#757575;text-decoration:none;background:transparent}.leaflet-container a.leaflet-popup-close-button:hover,.leaflet-container a.leaflet-popup-close-button:focus{color:#585858}.leaflet-popup-scrolled{overflow:auto}.leaflet-oldie .leaflet-popup-content-wrapper{-ms-zoom:1}.leaflet-oldie .leaflet-popup-tip{width:24px;margin:0 auto;-ms-filter:\"progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678)\";filter:progid:DXImageTransform.Microsoft.Matrix(M11=.70710678,M12=.70710678,M21=-.70710678,M22=.70710678)}.leaflet-oldie .leaflet-control-zoom,.leaflet-oldie .leaflet-control-layers,.leaflet-oldie .leaflet-popup-content-wrapper,.leaflet-oldie .leaflet-popup-tip{border:1px solid #999}.leaflet-div-icon{background:#fff;border:1px solid #666}.leaflet-tooltip{position:absolute;padding:6px;background-color:#fff;border:1px solid #fff;border-radius:3px;color:#222;white-space:nowrap;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none;box-shadow:0 1px 3px #0006}.leaflet-tooltip.leaflet-interactive{cursor:pointer;pointer-events:auto}.leaflet-tooltip-top:before,.leaflet-tooltip-bottom:before,.leaflet-tooltip-left:before,.leaflet-tooltip-right:before{position:absolute;pointer-events:none;border:6px solid transparent;background:transparent;content:\"\"}.leaflet-tooltip-bottom{margin-top:6px}.leaflet-tooltip-top{margin-top:-6px}.leaflet-tooltip-bottom:before,.leaflet-tooltip-top:before{left:50%;margin-left:-6px}.leaflet-tooltip-top:before{bottom:0;margin-bottom:-12px;border-top-color:#fff}.leaflet-tooltip-bottom:before{top:0;margin-top:-12px;margin-left:-6px;border-bottom-color:#fff}.leaflet-tooltip-left{margin-left:-6px}.leaflet-tooltip-right{margin-left:6px}.leaflet-tooltip-left:before,.leaflet-tooltip-right:before{top:50%;margin-top:-6px}.leaflet-tooltip-left:before{right:0;margin-right:-12px;border-left-color:#fff}.leaflet-tooltip-right:before{left:0;margin-left:-12px;border-right-color:#fff}@media print{.leaflet-control{-webkit-print-color-adjust:exact;print-color-adjust:exact}}.pcp .card[data-v-5782dfcc]{background:var(--md-surface-container-lowest, #fff);border:1px solid color-mix(in srgb,var(--md-outline-variant) 60%,transparent);border-radius:24px;padding:22px;box-shadow:0 1px 2px #0000000a}.pcp .section[data-v-5782dfcc]{display:flex;flex-direction:column;gap:14px}.pcp .section-head[data-v-5782dfcc]{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.pcp .section-head h2[data-v-5782dfcc],.pcp .section-head h3[data-v-5782dfcc]{margin:0;font-size:15px;font-weight:700}.pcp .grid2[data-v-5782dfcc]{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px}.pcp .grid3[data-v-5782dfcc]{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px}.pcp .panel[data-v-5782dfcc]{display:flex;flex-direction:column;gap:10px;padding:16px;border-radius:18px;background:var(--md-surface-container)}.pcp .tabs[data-v-5782dfcc]{display:flex;gap:6px;flex-wrap:wrap;align-items:center}.pcp .tab[data-v-5782dfcc]{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:999px;border:1px solid transparent;background:transparent;color:var(--md-on-surface-variant);font-size:12.5px;font-weight:600;cursor:pointer;transition:background .12s ease,color .12s ease}.pcp .tab[data-v-5782dfcc]:hover{background:color-mix(in srgb,var(--md-on-surface) 8%,transparent)}.pcp .tab.active[data-v-5782dfcc],.pcp .tab.filled[data-v-5782dfcc]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.pcp .tab-ic[data-v-5782dfcc]{display:grid;place-items:center;opacity:.85}.pcp .head-actions[data-v-5782dfcc]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.pcp .switches[data-v-5782dfcc]{display:flex;flex-direction:column;gap:8px}.pcp .preset-row[data-v-5782dfcc]{display:flex;gap:8px;flex-wrap:wrap}.pcp .settings-grid[data-v-5782dfcc]{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px}.pcp .meta[data-v-5782dfcc]{display:flex;gap:10px;flex-wrap:wrap;font-size:12px;color:var(--md-on-surface-variant)}.pcp .desc[data-v-5782dfcc],.pcp .hint[data-v-5782dfcc],.pcp .tiny[data-v-5782dfcc],.pcp .sub-label[data-v-5782dfcc]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5}.pcp .tiny[data-v-5782dfcc]{font-size:11px;opacity:.85}.pcp .empty[data-v-5782dfcc]{padding:22px;text-align:center;color:var(--md-on-surface-variant);font-size:12.5px;border-radius:16px;background:var(--md-surface-container)}.pcp .feed[data-v-5782dfcc]{display:flex;flex-direction:column;gap:10px}.pcp .i[data-v-5782dfcc],.pcp .k[data-v-5782dfcc]{font-style:normal}.pcp .banner[data-v-5782dfcc]{padding:10px 14px;border-radius:12px;font-size:12.5px;background:var(--md-surface-container)}.pcp .banner.ok[data-v-5782dfcc]{background:color-mix(in srgb,#2e7d52 14%,transparent);color:#2e7d52}.pcp .banner.warn[data-v-5782dfcc]{background:color-mix(in srgb,#b26a00 16%,transparent);color:#b26a00}.pcp .expanded[data-v-5782dfcc]{max-height:none}.pcp .settings-grid .sm[data-v-5782dfcc]{max-width:160px}.pcp .wm-routes-col[data-v-5782dfcc]{display:flex;flex-direction:column;gap:8px}.pcp[data-v-5782dfcc]{display:flex;flex-direction:column;gap:18px;padding:22px 24px 40px;max-width:1180px;margin:0 auto}.pcp .hero[data-v-5782dfcc]{display:flex;flex-direction:column;gap:12px;flex:0 0 auto;min-height:fit-content;overflow:visible}.pcp .hero-main[data-v-5782dfcc]{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;flex-wrap:wrap}.pcp .hero-copy[data-v-5782dfcc]{min-width:0}.pcp .eyebrow[data-v-5782dfcc]{margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:.12em;color:var(--md-primary)}.pcp .hero-copy h1[data-v-5782dfcc]{margin:0;font-size:26px;line-height:1.2;font-weight:700}.pcp .hero-copy .sub[data-v-5782dfcc]{margin:6px 0 0;font-size:13px;color:var(--md-on-surface-variant);max-width:60ch}.pcp .hero-actions[data-v-5782dfcc]{display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:flex-end}.pcp .hero-actions .btn[data-v-5782dfcc]{padding:8px 14px;border-radius:10px;font-size:12.5px;white-space:nowrap}.pcp .hero-actions .fab[data-v-5782dfcc]{display:inline-flex;align-items:center;gap:6px;padding:9px 16px;border-radius:999px;font-size:12.5px;white-space:nowrap}.pcp .hero-actions .fab-ic[data-v-5782dfcc]{font-size:12px;opacity:.9}.pcp .state-row[data-v-5782dfcc]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.pcp .state-row .pill[data-v-5782dfcc]{display:inline-flex;align-items:center;gap:6px;padding:4px 11px;border-radius:999px;font-size:11.5px;font-weight:600;background:var(--md-surface-container);color:var(--md-on-surface-variant)}.pcp .state-row .pill.soft[data-v-5782dfcc]{opacity:.85;font-weight:500}.pcp .state-row .pill.bad[data-v-5782dfcc]{background:color-mix(in srgb,var(--md-error, #ba1a1a) 16%,transparent);color:var(--md-error, #ba1a1a)}.pcp .banner[data-v-5782dfcc]{margin:0;padding:10px 14px;border-radius:10px;font-size:12.5px}.pcp .banner.err[data-v-5782dfcc]{background:color-mix(in srgb,var(--md-error, #ba1a1a) 14%,transparent);color:var(--md-error, #ba1a1a)}@media(max-width:720px){.pcp[data-v-5782dfcc]{padding:16px 14px 32px}.pcp .hero-actions[data-v-5782dfcc]{justify-content:flex-start}.pcp .hero-copy h1[data-v-5782dfcc]{font-size:22px}}.dirty-pill[data-v-5782dfcc]{display:inline-block;vertical-align:middle;margin-left:10px;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:.04em;background:var(--md-tertiary-container,#e8def8);color:var(--md-on-tertiary-container,#1d192b)}.fab.dirty[data-v-5782dfcc]{animation:fab-dirty-5782dfcc 1.6s ease-in-out infinite}@keyframes fab-dirty-5782dfcc{0%,to{box-shadow:0 0 color-mix(in srgb,var(--md-primary,#6750a4) 45%,transparent)}55%{box-shadow:0 0 0 8px transparent}}@media(prefers-reduced-motion:reduce){.fab.dirty[data-v-5782dfcc]{animation:none}}.count-pill.core-off[data-v-5782dfcc]{background:var(--md-surface-container-high,#d8d3dd);color:var(--md-on-surface-variant,#49454f);font-style:normal}.def-hint[data-v-5782dfcc]{display:block;font-size:10.5px;font-weight:500;color:var(--md-on-surface-variant,#49454f);opacity:.85;margin:1px 0 3px}.world-field[data-v-5782dfcc]{display:block;margin:10px 0}.world-label[data-v-5782dfcc]{display:block;font-size:12px;font-weight:600;color:var(--md-on-surface-variant);margin-bottom:4px}.world-text[data-v-5782dfcc]{width:100%;min-height:64px;padding:10px 14px;border:1px solid var(--md-outline-variant);border-radius:var(--r-sm);background:var(--md-surface-container-high);color:var(--md-on-surface);font:inherit;font-size:13px;line-height:1.5;resize:vertical;outline:none}.world-text[data-v-5782dfcc]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 14%,transparent)}.world-actions[data-v-5782dfcc]{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-top:12px}.wm-head[data-v-5782dfcc]{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;margin-bottom:6px}.wm-place[data-v-5782dfcc]{font-size:12px;color:var(--md-on-surface-variant)}.wm-premise[data-v-5782dfcc]{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin:2px 0 8px}.wm-map-wrap[data-v-5782dfcc]{position:relative;margin-top:8px}.world-map-leaflet[data-v-5782dfcc]{height:clamp(460px,72vh,820px);border-radius:16px;overflow:hidden;border:1px solid var(--md-outline-variant);background:#e8edf2}.world-map-leaflet.is-empty[data-v-5782dfcc]{display:none}.wm-reset[data-v-5782dfcc]{position:absolute;top:10px;right:10px;z-index:var(--z-overlay,2000);border:1px solid var(--md-outline-variant);background:#fffffff0;color:#33404c;border-radius:10px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer;box-shadow:0 1px 4px #0000002e}.wm-reset[data-v-5782dfcc]:hover{background:#fff}.wm-compass[data-v-5782dfcc]{position:absolute;left:12px;bottom:12px;z-index:var(--z-overlay,2000);width:38px;height:38px;border-radius:50%;background:#ffffffeb;border:1px solid #b9c3cd;box-shadow:0 1px 4px #0000002e;display:grid;place-items:center}.wm-compass i[data-v-5782dfcc]{font-style:normal;font-size:12px;font-weight:800;color:#d64545;position:relative}.wm-compass i[data-v-5782dfcc]:before{content:\"\";position:absolute;left:50%;top:-9px;transform:translate(-50%);border-left:4px solid transparent;border-right:4px solid transparent;border-bottom:9px solid #33404c}.wm-scope[data-v-5782dfcc]{position:absolute;bottom:12px;right:12px;z-index:var(--z-overlay,2000);border:1px solid var(--md-outline-variant);background:#fffffff0;color:#33404c;border-radius:10px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer;box-shadow:0 1px 4px #0000002e}.wm-scope[data-v-5782dfcc]:hover{background:#fff}.wm-offline[data-v-5782dfcc]{position:absolute;left:50%;bottom:12px;transform:translate(-50%);z-index:var(--z-overlay,2000);background:#d1495bf0;color:#fff;font-size:12px;font-weight:600;padding:5px 12px;border-radius:10px;box-shadow:0 1px 4px #00000040}.wm-routes[data-v-5782dfcc]{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(280px,100%),1fr));gap:18px;margin-top:14px}.wm-routes h4[data-v-5782dfcc]{margin:0 0 6px;font-size:13px;font-weight:800}.wm-routes ul[data-v-5782dfcc]{list-style:none;margin:0;padding:0}.wm-routes li[data-v-5782dfcc]{display:flex;gap:10px;padding:4px 0;border-bottom:1px dashed color-mix(in srgb,var(--md-outline-variant) 70%,transparent);font-size:12.5px}.wm-routes b[data-v-5782dfcc]{flex:0 0 88px}.wm-routes span[data-v-5782dfcc]{color:var(--md-on-surface-variant);line-height:1.5}.wm-legend[data-v-5782dfcc]{display:flex;flex-wrap:wrap;gap:14px;margin-top:12px;font-size:12px;color:var(--md-on-surface-variant)}.wm-legend span[data-v-5782dfcc]{display:inline-flex;align-items:center;gap:6px}.wm-legend i[data-v-5782dfcc]{width:12px;height:12px;border-radius:50%;display:inline-block;border:1.5px solid rgba(255,255,255,.7)}.wm-legend i.k-home[data-v-5782dfcc]{background:#e07a5f}.wm-legend i.k-work[data-v-5782dfcc]{background:#5b8def}.wm-legend i.k-shop[data-v-5782dfcc]{background:#e0a23d}.wm-legend i.k-food[data-v-5782dfcc]{background:#57a773}.wm-legend i.k-park[data-v-5782dfcc]{background:#3faead}.wm-legend i.k-transit[data-v-5782dfcc]{background:#8b6fd6}.wm-legend i.k-other[data-v-5782dfcc]{background:#8a94a6}.wm-legend i.k-actor[data-v-5782dfcc]{background:#fff;border-color:#d1495b;box-shadow:inset 0 0 0 3px #d1495b}.wm-legend i.k-metro[data-v-5782dfcc]{background:#d64545}.wm-legend i.k-bus[data-v-5782dfcc]{background:#e08a2e}.wm-legend i.k-park2[data-v-5782dfcc]{background:#9bd08f}.wm-legend i.k-water[data-v-5782dfcc]{background:#8fbfe6}.wm-legend i.k-hw[data-v-5782dfcc]{background:#f08c2e}.wm-legend i.k-arterial[data-v-5782dfcc]{background:#f7cf8a}.wm-legend i.k-street[data-v-5782dfcc]{background:#fff;border-color:#b9c3cd}.pfield[data-v-5782dfcc]{display:flex;flex-direction:column;gap:4px;margin-top:10px;font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}#app .pcp .pfield textarea.field[data-v-5782dfcc]{height:auto;min-height:70px;padding:10px 12px;resize:vertical;line-height:1.5}.cog-metric[data-v-5782dfcc]{display:flex;flex-direction:column;gap:4px;padding:10px 12px;border-radius:var(--r-sm);background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant)}.cog-metric span[data-v-5782dfcc]{font-size:11px;font-weight:700;letter-spacing:.04em;color:var(--md-on-surface-variant)}.cog-metric strong[data-v-5782dfcc]{font-size:16px;font-weight:800;letter-spacing:-.01em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.cog-metric.warn[data-v-5782dfcc]{border-color:var(--md-error,#b3261e);background:color-mix(in srgb,var(--md-error,#b3261e) 8%,transparent)}.cog-metric.warn span[data-v-5782dfcc],.cog-metric.warn strong[data-v-5782dfcc]{color:var(--md-error,#b3261e)}.som-channels[data-v-5782dfcc]{margin-top:10px;display:flex;flex-direction:column;gap:6px}.som-chan[data-v-5782dfcc]{display:grid;grid-template-columns:minmax(52px,88px) minmax(0,1fr) 48px;align-items:center;gap:10px}.som-chan-name[data-v-5782dfcc]{font-size:12px;font-weight:600;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.som-chan-bar[data-v-5782dfcc]{display:block;height:8px;border-radius:999px;background:var(--md-surface-container);overflow:hidden}.som-chan-bar i[data-v-5782dfcc]{display:block;width:100%;height:100%;border-radius:999px;background:var(--md-primary);transform-origin:left;transition:transform var(--duration-medium) var(--ease-out);will-change:transform}.som-chan-val[data-v-5782dfcc]{font-size:12px;font-weight:700;text-align:right;color:var(--md-on-surface-variant)}.at-a-glance[data-v-5782dfcc]{display:grid;grid-template-columns:190px minmax(0,1fr) minmax(0,1fr);gap:14px;align-items:start;margin:8px 0 4px}@media(max-width:900px){.at-a-glance[data-v-5782dfcc]{grid-template-columns:1fr 1fr}}@media(max-width:620px){.at-a-glance[data-v-5782dfcc]{grid-template-columns:1fr}}.mood-plot-wrap[data-v-5782dfcc]{position:relative;width:190px;padding:26px 22px 40px;background:var(--md-surface-container);border:1px solid color-mix(in srgb,var(--md-outline-variant) 60%,transparent);border-radius:var(--r-md);box-sizing:border-box}.mood-plot[data-v-5782dfcc]{display:block;width:100%}.plot-frame[data-v-5782dfcc]{fill:var(--md-surface-container-lowest);stroke:var(--md-outline-variant)}.plot-grid[data-v-5782dfcc]{stroke:var(--md-outline-variant);stroke-width:1;stroke-dasharray:3 4}.plot-dot[data-v-5782dfcc]{fill:var(--md-primary)}.plot-halo[data-v-5782dfcc]{fill:var(--md-primary);opacity:.22}.plot-label[data-v-5782dfcc]{position:absolute;font-size:10px;font-weight:700;letter-spacing:.04em;color:var(--md-on-surface-variant);pointer-events:none}.plot-n[data-v-5782dfcc]{top:6px;left:50%;transform:translate(-50%)}.plot-s[data-v-5782dfcc]{bottom:26px;left:50%;transform:translate(-50%)}.plot-w[data-v-5782dfcc]{left:8px;top:50%;transform:translateY(-58%)}.plot-e[data-v-5782dfcc]{right:8px;top:50%;transform:translateY(-58%)}.plot-quadrant[data-v-5782dfcc]{position:absolute;left:0;right:0;bottom:8px;text-align:center;font-size:12px;font-weight:800;color:var(--md-primary)}.glance-col[data-v-5782dfcc]{display:flex;flex-direction:column;gap:8px;min-width:0}.glance-title[data-v-5782dfcc]{display:flex;align-items:center;gap:8px;margin:0;font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--md-on-surface-variant)}.gauge-grid[data-v-5782dfcc]{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:10px;margin:8px 0}.gauge[data-v-5782dfcc]{display:flex;flex-direction:column;gap:5px;padding:10px 12px;border-radius:var(--r-sm);background:var(--md-surface-container);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);min-width:0}.gauge-head[data-v-5782dfcc]{display:flex;justify-content:space-between;align-items:baseline;gap:8px}.gauge-name[data-v-5782dfcc]{font-size:12px;font-weight:700;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.gauge-alias[data-v-5782dfcc]{font-style:normal;font-weight:500;font-size:11px;color:var(--md-on-surface-variant);opacity:.8;margin-left:6px}.gauge-val[data-v-5782dfcc]{font-size:13px;font-weight:800;font-variant-numeric:tabular-nums;white-space:nowrap}.gauge-state[data-v-5782dfcc]{font-weight:800;margin-right:2px}.gauge-state.good[data-v-5782dfcc]{color:var(--md-success)}.gauge-state.mid[data-v-5782dfcc]{color:var(--md-primary)}.gauge-state.bad[data-v-5782dfcc]{color:var(--md-error)}.gauge-bar[data-v-5782dfcc]{position:relative;display:block;height:8px;border-radius:999px;background:var(--md-surface-container-highest);overflow:visible}.gauge-bar.signed[data-v-5782dfcc]:before{content:\"\";position:absolute;left:50%;top:-3px;bottom:-3px;width:2px;border-radius:1px;background:var(--md-outline-variant)}.gauge-fill[data-v-5782dfcc]{position:absolute;top:0;bottom:0;border-radius:999px;transition:width .35s var(--ease-out,.25s ease),left .35s var(--ease-out,.25s ease)}.gauge-fill.good[data-v-5782dfcc]{background:var(--md-success)}.gauge-fill.mid[data-v-5782dfcc]{background:var(--md-primary)}.gauge-fill.bad[data-v-5782dfcc]{background:var(--md-error)}.gauge-effect[data-v-5782dfcc]{font-size:11px;line-height:1.45;color:var(--md-on-surface-variant)}.chip-row[data-v-5782dfcc]{display:flex;gap:8px;flex-wrap:wrap;margin:8px 0}.chip.warn[data-v-5782dfcc]{background:var(--md-error-container);color:var(--md-on-error-container)}.rel-card[data-v-5782dfcc]{display:flex;flex-direction:column;gap:10px}.rel-head[data-v-5782dfcc]{display:flex;justify-content:space-between;gap:10px;align-items:baseline;flex-wrap:wrap}.rel-track-row[data-v-5782dfcc]{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:10px;align-items:center}.rel-track-label[data-v-5782dfcc],.rel-stage-name[data-v-5782dfcc]{font-size:11px;font-weight:800;letter-spacing:.04em;color:var(--md-on-surface-variant);white-space:nowrap}.rel-stage-name[data-v-5782dfcc]{color:var(--md-primary)}.rel-track[data-v-5782dfcc]{display:flex;gap:3px;height:10px;border-radius:999px;overflow:hidden;background:var(--md-surface-container-highest)}.rel-seg[data-v-5782dfcc]{flex:1 1 0;background:color-mix(in srgb,var(--md-outline-variant) 45%,transparent)}.rel-seg.done[data-v-5782dfcc]{background:color-mix(in srgb,var(--md-primary) 45%,transparent)}.rel-seg.cur[data-v-5782dfcc]{background:var(--md-primary)}.rel-mode[data-v-5782dfcc]{display:flex;flex-direction:column;gap:4px;align-items:flex-start}.value-row[data-v-5782dfcc]{display:grid;grid-template-columns:minmax(72px,140px) minmax(0,1fr) 44px;gap:10px;align-items:center}.value-name[data-v-5782dfcc]{font-size:13px;font-weight:700;overflow-wrap:anywhere}.value-bar[data-v-5782dfcc]{position:relative;display:block;height:8px;border-radius:999px;background:var(--md-surface-container-highest)}.value-bar[data-v-5782dfcc]:before{content:\"\";position:absolute;left:50%;top:-3px;bottom:-3px;width:2px;border-radius:1px;background:var(--md-outline-variant)}.value-bar i[data-v-5782dfcc]{position:absolute;top:0;bottom:0;border-radius:999px;transition:width .35s var(--ease-out,.25s ease),left .35s var(--ease-out,.25s ease)}.value-bar i.good[data-v-5782dfcc]{background:var(--md-success)}.value-bar i.bad[data-v-5782dfcc]{background:var(--md-error)}.value-num[data-v-5782dfcc]{font-size:12px;font-weight:800;text-align:right;font-variant-numeric:tabular-nums;color:var(--md-on-surface-variant)}.chip[data-v-5782dfcc]{display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 12px;border-radius:999px;font-size:12px;font-weight:700;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.chip.muted[data-v-5782dfcc]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}.chip.ok[data-v-5782dfcc]{background:var(--md-success-container);color:var(--md-on-success-container,#0d3b1e)}#app .pcp .cog-metric[data-v-5782dfcc]{background:var(--md-surface-container)}.sync-pill[data-v-5782dfcc]{font-weight:500;opacity:.85}html[data-theme=dark] #app .pcp .world-map-leaflet{background:#10151c}html[data-theme=dark] #app .pcp .wm-reset,html[data-theme=dark] #app .pcp .wm-scope{background:color-mix(in srgb,var(--md-surface-container-high) 94%,transparent);color:var(--md-on-surface)}html[data-theme=dark] #app .pcp .wm-reset:hover,html[data-theme=dark] #app .pcp .wm-scope:hover{background:var(--md-surface-container-highest)}html[data-theme=dark] #app .pcp .wm-compass{background:color-mix(in srgb,var(--md-surface-container-high) 92%,transparent);border-color:var(--md-outline-variant)}html[data-theme=dark] .wm-district-inner{color:#aeb9c4;text-shadow:none}html[data-theme=dark] .wm-station .wm-route-inner{background:#1a2230;color:#d7dee6}html[data-theme=dark] .leaflet-container{background:#10151c}.wm-pin-holder,.wm-actor-holder{background:none;border:none}.wm-pin{position:absolute;left:0;top:0;width:16px;height:16px;border-radius:50%;background:var(--c,#8a94a6);border:3px solid #fff;box-shadow:0 2px 6px #00000073;transform:translate(-50%,-50%)}.wm-pin:after{content:\"\";position:absolute;left:50%;top:100%;width:2px;height:8px;background:#fff;transform:translate(-50%);opacity:.7}.wm-pin-label{position:absolute;left:12px;top:-9px;white-space:nowrap;background:#12141ad1;color:#fff;font-size:12px;font-weight:600;padding:2px 8px;border-radius:10px;pointer-events:none}.wm-actor-badge{position:absolute;left:0;top:0;width:26px;height:26px;border-radius:50%;background:#fff;color:#d1495b;border:3px solid #d1495b;font-size:14px;font-weight:800;line-height:1;display:grid;place-items:center;transform:translate(-50%,-50%);box-shadow:0 2px 6px #00000080;z-index:600}.wm-actor-name{position:absolute;left:0;top:20px;white-space:nowrap;background:#d1495b;color:#fff;font-size:11px;font-weight:700;padding:1px 7px;border-radius:9px;transform:translate(-50%)}.wm-district{background:none;border:none}.wm-district-inner{position:absolute;left:0;top:0;transform:translate(-50%,-50%);white-space:nowrap;font-size:12px;font-weight:800;letter-spacing:.2em;color:#5c6b78;text-shadow:0 1px 0 rgba(255,255,255,.9);pointer-events:none}.wm-route{background:none;border:none}.wm-route-inner{position:absolute;left:0;top:0;transform:translate(-50%,-50%);background:var(--c,#333);color:#fff;font-size:10px;font-weight:700;padding:1px 6px;border-radius:8px;white-space:nowrap;box-shadow:0 1px 3px #00000059;pointer-events:none}.wm-zoom-low .wm-minor{display:none}.wm-station .wm-route-inner{background:#fff;color:#33404c;border:1.5px solid var(--c,#888);border-radius:6px;font-size:9px;font-weight:700;padding:1px 5px}.leaflet-container{font-family:inherit;background:#e8edf2;border-radius:16px}.leaflet-container a{color:#2f6fed}.leaflet-popup-content{font-size:13px;line-height:1.5}.pcp .btn{padding:8px 14px;border-radius:10px;font-size:12.5px;font-weight:600}.pcp .btn.tonic{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.pcp .btn.danger{background:color-mix(in srgb,var(--md-error, #ba1a1a) 14%,transparent);color:var(--md-error, #ba1a1a)}.pcp .fld{display:flex;flex-direction:column;gap:4px}.pcp .sw{display:flex;align-items:center;justify-content:space-between;gap:12px}.pcp .pdetails{display:flex;flex-direction:column;gap:6px}.pcp .cognition,.pcp .circadianNow{display:flex;gap:10px;flex-wrap:wrap;align-items:center}\n";document.head.appendChild(s)}})();
