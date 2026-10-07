import { defineComponent as ya, ref as tt, watch as Ye, nextTick as Oo, computed as C, onUnmounted as Eo, onMounted as io, openBlock as y, createElementBlock as b, createElementVNode as n, createTextVNode as U, toDisplayString as l, normalizeClass as F, createCommentVNode as z, Fragment as K, renderList as Lt, withDirectives as w, vModelText as M, createVNode as Et, unref as Zt, vShow as nn, vModelCheckbox as ct, normalizeStyle as jt } from "vue";
import { useRouter as ba } from "vue-router";
import { useConfirm as wa, AppSelect as It, i18n as Ao } from "@0kay/host";
import { i as xa, b as Zo, s as Pa, f as Io, a as La, l as Ta, F as ka } from "./assets/kit-Du4J5J-o.js";
import { _ as Sa } from "./assets/AdapterSettingsPage.vue_vue_type_script_setup_true_lang-BLhwQTnp.js";
import { _ as Ca } from "./assets/_plugin-vue_export-helper-CHgC5LLL.js";
function Ma(Ie) {
  return Ie && Ie.__esModule && Object.prototype.hasOwnProperty.call(Ie, "default") ? Ie.default : Ie;
}
var on = { exports: {} };
var za = on.exports, Bo;
function Oa() {
  return Bo || (Bo = 1, (function(Ie, Je) {
    (function(a, gt) {
      gt(Je);
    })(za, (function(a) {
      var gt = "1.9.4";
      function et(t) {
        var e, i, o, s;
        for (i = 1, o = arguments.length; i < o; i++) {
          s = arguments[i];
          for (e in s)
            t[e] = s[e];
        }
        return t;
      }
      var at = Object.create || /* @__PURE__ */ (function() {
        function t() {
        }
        return function(e) {
          return t.prototype = e, new t();
        };
      })();
      function $(t, e) {
        var i = Array.prototype.slice;
        if (t.bind)
          return t.bind.apply(t, i.call(arguments, 1));
        var o = i.call(arguments, 2);
        return function() {
          return t.apply(e, o.length ? o.concat(i.call(arguments)) : arguments);
        };
      }
      var Le = 0;
      function H(t) {
        return "_leaflet_id" in t || (t._leaflet_id = ++Le), t._leaflet_id;
      }
      function Bt(t, e, i) {
        var o, s, c, d;
        return d = function() {
          o = !1, s && (c.apply(i, s), s = !1);
        }, c = function() {
          o ? s = arguments : (t.apply(i, arguments), setTimeout(d, e), o = !0);
        }, c;
      }
      function pe(t, e, i) {
        var o = e[1], s = e[0], c = o - s;
        return t === o && i ? t : ((t - s) % c + c) % c + s;
      }
      function mt() {
        return !1;
      }
      function ft(t, e) {
        if (e === !1)
          return t;
        var i = Math.pow(10, e === void 0 ? 6 : e);
        return Math.round(t * i) / i;
      }
      function me(t) {
        return t.trim ? t.trim() : t.replace(/^\s+|\s+$/g, "");
      }
      function St(t) {
        return me(t).split(/\s+/);
      }
      function lt(t, e) {
        Object.prototype.hasOwnProperty.call(t, "options") || (t.options = t.options ? at(t.options) : {});
        for (var i in e)
          t.options[i] = e[i];
        return t.options;
      }
      function an(t, e, i) {
        var o = [];
        for (var s in t)
          o.push(encodeURIComponent(i ? s.toUpperCase() : s) + "=" + encodeURIComponent(t[s]));
        return (!e || e.indexOf("?") === -1 ? "?" : "&") + o.join("&");
      }
      var ki = /\{ *([\w_ -]+) *\}/g;
      function Si(t, e) {
        return t.replace(ki, function(i, o) {
          var s = e[o];
          if (s === void 0)
            throw new Error("No value provided for variable " + i);
          return typeof s == "function" && (s = s(e)), s;
        });
      }
      var Gt = Array.isArray || function(t) {
        return Object.prototype.toString.call(t) === "[object Array]";
      };
      function Ci(t, e) {
        for (var i = 0; i < t.length; i++)
          if (t[i] === e)
            return i;
        return -1;
      }
      var Xe = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
      function Mi(t) {
        return window["webkit" + t] || window["moz" + t] || window["ms" + t];
      }
      var zi = 0;
      function sn(t) {
        var e = +/* @__PURE__ */ new Date(), i = Math.max(0, 16 - (e - zi));
        return zi = e + i, window.setTimeout(t, i);
      }
      var Qe = window.requestAnimationFrame || Mi("RequestAnimationFrame") || sn, Oi = window.cancelAnimationFrame || Mi("CancelAnimationFrame") || Mi("CancelRequestAnimationFrame") || function(t) {
        window.clearTimeout(t);
      };
      function At(t, e, i) {
        if (i && Qe === sn)
          t.call(e);
        else
          return Qe.call(window, $(t, e));
      }
      function Vt(t) {
        t && Oi.call(window, t);
      }
      var Rn = {
        __proto__: null,
        extend: et,
        create: at,
        bind: $,
        get lastId() {
          return Le;
        },
        stamp: H,
        throttle: Bt,
        wrapNum: pe,
        falseFn: mt,
        formatNum: ft,
        trim: me,
        splitWords: St,
        setOptions: lt,
        getParamString: an,
        template: Si,
        isArray: Gt,
        indexOf: Ci,
        emptyImageUrl: Xe,
        requestFn: Qe,
        cancelFn: Oi,
        requestAnimFrame: At,
        cancelAnimFrame: Vt
      };
      function Kt() {
      }
      Kt.extend = function(t) {
        var e = function() {
          lt(this), this.initialize && this.initialize.apply(this, arguments), this.callInitHooks();
        }, i = e.__super__ = this.prototype, o = at(i);
        o.constructor = e, e.prototype = o;
        for (var s in this)
          Object.prototype.hasOwnProperty.call(this, s) && s !== "prototype" && s !== "__super__" && (e[s] = this[s]);
        return t.statics && et(e, t.statics), t.includes && (Vn(t.includes), et.apply(null, [o].concat(t.includes))), et(o, t), delete o.statics, delete o.includes, o.options && (o.options = i.options ? at(i.options) : {}, et(o.options, t.options)), o._initHooks = [], o.callInitHooks = function() {
          if (!this._initHooksCalled) {
            i.callInitHooks && i.callInitHooks.call(this), this._initHooksCalled = !0;
            for (var c = 0, d = o._initHooks.length; c < d; c++)
              o._initHooks[c].call(this);
          }
        }, e;
      }, Kt.include = function(t) {
        var e = this.prototype.options;
        return et(this.prototype, t), t.options && (this.prototype.options = e, this.mergeOptions(t.options)), this;
      }, Kt.mergeOptions = function(t) {
        return et(this.prototype.options, t), this;
      }, Kt.addInitHook = function(t) {
        var e = Array.prototype.slice.call(arguments, 1), i = typeof t == "function" ? t : function() {
          this[t].apply(this, e);
        };
        return this.prototype._initHooks = this.prototype._initHooks || [], this.prototype._initHooks.push(i), this;
      };
      function Vn(t) {
        if (!(typeof L > "u" || !L || !L.Mixin)) {
          t = Gt(t) ? t : [t];
          for (var e = 0; e < t.length; e++)
            t[e] === L.Mixin.Events && console.warn("Deprecated include of L.Mixin.Events: this property will be removed in future releases, please inherit from L.Evented instead.", new Error().stack);
        }
      }
      var Nt = {
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
            t = St(t);
            for (var s = 0, c = t.length; s < c; s++)
              this._on(t[s], e, i);
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
            t = St(t);
            for (var s = arguments.length === 1, c = 0, d = t.length; c < d; c++)
              s ? this._off(t[c]) : this._off(t[c], e, i);
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
            var s = { fn: e, ctx: i };
            o && (s.once = !0), this._events = this._events || {}, this._events[t] = this._events[t] || [], this._events[t].push(s);
          }
        },
        _off: function(t, e, i) {
          var o, s, c;
          if (this._events && (o = this._events[t], !!o)) {
            if (arguments.length === 1) {
              if (this._firingCount)
                for (s = 0, c = o.length; s < c; s++)
                  o[s].fn = mt;
              delete this._events[t];
              return;
            }
            if (typeof e != "function") {
              console.warn("wrong listener type: " + typeof e);
              return;
            }
            var d = this._listens(t, e, i);
            if (d !== !1) {
              var f = o[d];
              this._firingCount && (f.fn = mt, this._events[t] = o = o.slice()), o.splice(d, 1);
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
          var o = et({}, e, {
            type: t,
            target: this,
            sourceTarget: e && e.sourceTarget || this
          });
          if (this._events) {
            var s = this._events[t];
            if (s) {
              this._firingCount = this._firingCount + 1 || 1;
              for (var c = 0, d = s.length; c < d; c++) {
                var f = s[c], p = f.fn;
                f.once && this.off(t, p, f.ctx), p.call(f.ctx || this, o);
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
          var s = e;
          typeof e != "function" && (o = !!e, s = void 0, i = void 0);
          var c = this._events && this._events[t];
          if (c && c.length && this._listens(t, s, i) !== !1)
            return !0;
          if (o) {
            for (var d in this._eventParents)
              if (this._eventParents[d].listens(t, e, i, o))
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
          for (var s = 0, c = o.length; s < c; s++)
            if (o[s].fn === e && o[s].ctx === i)
              return s;
          return !1;
        },
        // @method once(…): this
        // Behaves as [`on(…)`](#evented-on), except the listener will only get fired once and then removed.
        once: function(t, e, i) {
          if (typeof t == "object")
            for (var o in t)
              this._on(o, t[o], e, !0);
          else {
            t = St(t);
            for (var s = 0, c = t.length; s < c; s++)
              this._on(t[s], e, i, !0);
          }
          return this;
        },
        // @method addEventParent(obj: Evented): this
        // Adds an event parent - an `Evented` that will receive propagated events
        addEventParent: function(t) {
          return this._eventParents = this._eventParents || {}, this._eventParents[H(t)] = t, this;
        },
        // @method removeEventParent(obj: Evented): this
        // Removes an event parent, so it will stop receiving propagated events
        removeEventParent: function(t) {
          return this._eventParents && delete this._eventParents[H(t)], this;
        },
        _propagateEvent: function(t) {
          for (var e in this._eventParents)
            this._eventParents[e].fire(t.type, et({
              layer: t.target,
              propagatedFrom: t.target
            }, t), !0);
        }
      };
      Nt.addEventListener = Nt.on, Nt.removeEventListener = Nt.clearAllEventListeners = Nt.off, Nt.addOneTimeEventListener = Nt.once, Nt.fireEvent = Nt.fire, Nt.hasEventListeners = Nt.listens;
      var Be = Kt.extend(Nt);
      function T(t, e, i) {
        this.x = i ? Math.round(t) : t, this.y = i ? Math.round(e) : e;
      }
      var Ne = Math.trunc || function(t) {
        return t > 0 ? Math.floor(t) : Math.ceil(t);
      };
      T.prototype = {
        // @method clone(): Point
        // Returns a copy of the current point.
        clone: function() {
          return new T(this.x, this.y);
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
          return new T(this.x * t.x, this.y * t.y);
        },
        // @method unscaleBy(scale: Point): Point
        // Inverse of `scaleBy`. Divide each coordinate of the current point by
        // each coordinate of `scale`.
        unscaleBy: function(t) {
          return new T(this.x / t.x, this.y / t.y);
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
          return this.x = Ne(this.x), this.y = Ne(this.y), this;
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
          return "Point(" + ft(this.x) + ", " + ft(this.y) + ")";
        }
      };
      function A(t, e, i) {
        return t instanceof T ? t : Gt(t) ? new T(t[0], t[1]) : t == null ? t : typeof t == "object" && "x" in t && "y" in t ? new T(t.x, t.y) : new T(t, e, i);
      }
      function Y(t, e) {
        if (t)
          for (var i = e ? [t, e] : t, o = 0, s = i.length; o < s; o++)
            this.extend(i[o]);
      }
      Y.prototype = {
        // @method extend(point: Point): this
        // Extends the bounds to contain the given point.
        // @alternative
        // @method extend(otherBounds: Bounds): this
        // Extend the bounds to contain the given bounds
        extend: function(t) {
          var e, i;
          if (!t)
            return this;
          if (t instanceof T || typeof t[0] == "number" || "x" in t)
            e = i = A(t);
          else if (t = Ot(t), e = t.min, i = t.max, !e || !i)
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
          return typeof t[0] == "number" || t instanceof T ? t = A(t) : t = Ot(t), t instanceof Y ? (e = t.min, i = t.max) : e = i = t, e.x >= this.min.x && i.x <= this.max.x && e.y >= this.min.y && i.y <= this.max.y;
        },
        // @method intersects(otherBounds: Bounds): Boolean
        // Returns `true` if the rectangle intersects the given bounds. Two bounds
        // intersect if they have at least one point in common.
        intersects: function(t) {
          t = Ot(t);
          var e = this.min, i = this.max, o = t.min, s = t.max, c = s.x >= e.x && o.x <= i.x, d = s.y >= e.y && o.y <= i.y;
          return c && d;
        },
        // @method overlaps(otherBounds: Bounds): Boolean
        // Returns `true` if the rectangle overlaps the given bounds. Two bounds
        // overlap if their intersection is an area.
        overlaps: function(t) {
          t = Ot(t);
          var e = this.min, i = this.max, o = t.min, s = t.max, c = s.x > e.x && o.x < i.x, d = s.y > e.y && o.y < i.y;
          return c && d;
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
          var e = this.min, i = this.max, o = Math.abs(e.x - i.x) * t, s = Math.abs(e.y - i.y) * t;
          return Ot(
            A(e.x - o, e.y - s),
            A(i.x + o, i.y + s)
          );
        },
        // @method equals(otherBounds: Bounds): Boolean
        // Returns `true` if the rectangle is equivalent to the given bounds.
        equals: function(t) {
          return t ? (t = Ot(t), this.min.equals(t.getTopLeft()) && this.max.equals(t.getBottomRight())) : !1;
        }
      };
      function Ot(t, e) {
        return !t || t instanceof Y ? t : new Y(t, e);
      }
      function Ct(t, e) {
        if (t)
          for (var i = e ? [t, e] : t, o = 0, s = i.length; o < s; o++)
            this.extend(i[o]);
      }
      Ct.prototype = {
        // @method extend(latlng: LatLng): this
        // Extend the bounds to contain the given point
        // @alternative
        // @method extend(otherBounds: LatLngBounds): this
        // Extend the bounds to contain the given bounds
        extend: function(t) {
          var e = this._southWest, i = this._northEast, o, s;
          if (t instanceof J)
            o = t, s = t;
          else if (t instanceof Ct) {
            if (o = t._southWest, s = t._northEast, !o || !s)
              return this;
          } else
            return t ? this.extend(Z(t) || pt(t)) : this;
          return !e && !i ? (this._southWest = new J(o.lat, o.lng), this._northEast = new J(s.lat, s.lng)) : (e.lat = Math.min(o.lat, e.lat), e.lng = Math.min(o.lng, e.lng), i.lat = Math.max(s.lat, i.lat), i.lng = Math.max(s.lng, i.lng)), this;
        },
        // @method pad(bufferRatio: Number): LatLngBounds
        // Returns bounds created by extending or retracting the current bounds by a given ratio in each direction.
        // For example, a ratio of 0.5 extends the bounds by 50% in each direction.
        // Negative values will retract the bounds.
        pad: function(t) {
          var e = this._southWest, i = this._northEast, o = Math.abs(e.lat - i.lat) * t, s = Math.abs(e.lng - i.lng) * t;
          return new Ct(
            new J(e.lat - o, e.lng - s),
            new J(i.lat + o, i.lng + s)
          );
        },
        // @method getCenter(): LatLng
        // Returns the center point of the bounds.
        getCenter: function() {
          return new J(
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
          return new J(this.getNorth(), this.getWest());
        },
        // @method getSouthEast(): LatLng
        // Returns the south-east point of the bounds.
        getSouthEast: function() {
          return new J(this.getSouth(), this.getEast());
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
          typeof t[0] == "number" || t instanceof J || "lat" in t ? t = Z(t) : t = pt(t);
          var e = this._southWest, i = this._northEast, o, s;
          return t instanceof Ct ? (o = t.getSouthWest(), s = t.getNorthEast()) : o = s = t, o.lat >= e.lat && s.lat <= i.lat && o.lng >= e.lng && s.lng <= i.lng;
        },
        // @method intersects(otherBounds: LatLngBounds): Boolean
        // Returns `true` if the rectangle intersects the given bounds. Two bounds intersect if they have at least one point in common.
        intersects: function(t) {
          t = pt(t);
          var e = this._southWest, i = this._northEast, o = t.getSouthWest(), s = t.getNorthEast(), c = s.lat >= e.lat && o.lat <= i.lat, d = s.lng >= e.lng && o.lng <= i.lng;
          return c && d;
        },
        // @method overlaps(otherBounds: LatLngBounds): Boolean
        // Returns `true` if the rectangle overlaps the given bounds. Two bounds overlap if their intersection is an area.
        overlaps: function(t) {
          t = pt(t);
          var e = this._southWest, i = this._northEast, o = t.getSouthWest(), s = t.getNorthEast(), c = s.lat > e.lat && o.lat < i.lat, d = s.lng > e.lng && o.lng < i.lng;
          return c && d;
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
        return t instanceof Ct ? t : new Ct(t, e);
      }
      function J(t, e, i) {
        if (isNaN(t) || isNaN(e))
          throw new Error("Invalid LatLng object: (" + t + ", " + e + ")");
        this.lat = +t, this.lng = +e, i !== void 0 && (this.alt = +i);
      }
      J.prototype = {
        // @method equals(otherLatLng: LatLng, maxMargin?: Number): Boolean
        // Returns `true` if the given `LatLng` point is at the same position (within a small margin of error). The margin of error can be overridden by setting `maxMargin` to a small number.
        equals: function(t, e) {
          if (!t)
            return !1;
          t = Z(t);
          var i = Math.max(
            Math.abs(this.lat - t.lat),
            Math.abs(this.lng - t.lng)
          );
          return i <= (e === void 0 ? 1e-9 : e);
        },
        // @method toString(): String
        // Returns a string representation of the point (for debugging purposes).
        toString: function(t) {
          return "LatLng(" + ft(this.lat, t) + ", " + ft(this.lng, t) + ")";
        },
        // @method distanceTo(otherLatLng: LatLng): Number
        // Returns the distance (in meters) to the given `LatLng` calculated using the [Spherical Law of Cosines](https://en.wikipedia.org/wiki/Spherical_law_of_cosines).
        distanceTo: function(t) {
          return Tt.distance(this, Z(t));
        },
        // @method wrap(): LatLng
        // Returns a new `LatLng` object with the longitude wrapped so it's always between -180 and +180 degrees.
        wrap: function() {
          return Tt.wrapLatLng(this);
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
          return new J(this.lat, this.lng, this.alt);
        }
      };
      function Z(t, e, i) {
        return t instanceof J ? t : Gt(t) && typeof t[0] != "object" ? t.length === 3 ? new J(t[0], t[1], t[2]) : t.length === 2 ? new J(t[0], t[1]) : null : t == null ? t : typeof t == "object" && "lat" in t ? new J(t.lat, "lng" in t ? t.lng : t.lon, t.alt) : e === void 0 ? null : new J(t, e, i);
      }
      var ut = {
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
          var e = this.projection.bounds, i = this.scale(t), o = this.transformation.transform(e.min, i), s = this.transformation.transform(e.max, i);
          return new Y(o, s);
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
          var e = this.wrapLng ? pe(t.lng, this.wrapLng, !0) : t.lng, i = this.wrapLat ? pe(t.lat, this.wrapLat, !0) : t.lat, o = t.alt;
          return new J(i, e, o);
        },
        // @method wrapLatLngBounds(bounds: LatLngBounds): LatLngBounds
        // Returns a `LatLngBounds` with the same size as the given one, ensuring
        // that its center is within the CRS's bounds.
        // Only accepts actual `L.LatLngBounds` instances, not arrays.
        wrapLatLngBounds: function(t) {
          var e = t.getCenter(), i = this.wrapLatLng(e), o = e.lat - i.lat, s = e.lng - i.lng;
          if (o === 0 && s === 0)
            return t;
          var c = t.getSouthWest(), d = t.getNorthEast(), f = new J(c.lat - o, c.lng - s), p = new J(d.lat - o, d.lng - s);
          return new Ct(f, p);
        }
      }, Tt = et({}, ut, {
        wrapLng: [-180, 180],
        // Mean Earth Radius, as recommended for use by
        // the International Union of Geodesy and Geophysics,
        // see https://rosettacode.org/wiki/Haversine_formula
        R: 6371e3,
        // distance between two geographical points using spherical law of cosines approximation
        distance: function(t, e) {
          var i = Math.PI / 180, o = t.lat * i, s = e.lat * i, c = Math.sin((e.lat - t.lat) * i / 2), d = Math.sin((e.lng - t.lng) * i / 2), f = c * c + Math.cos(o) * Math.cos(s) * d * d, p = 2 * Math.atan2(Math.sqrt(f), Math.sqrt(1 - f));
          return this.R * p;
        }
      }), B = 6378137, Ei = {
        R: B,
        MAX_LATITUDE: 85.0511287798,
        project: function(t) {
          var e = Math.PI / 180, i = this.MAX_LATITUDE, o = Math.max(Math.min(i, t.lat), -i), s = Math.sin(o * e);
          return new T(
            this.R * t.lng * e,
            this.R * Math.log((1 + s) / (1 - s)) / 2
          );
        },
        unproject: function(t) {
          var e = 180 / Math.PI;
          return new J(
            (2 * Math.atan(Math.exp(t.y / this.R)) - Math.PI / 2) * e,
            t.x * e / this.R
          );
        },
        bounds: (function() {
          var t = B * Math.PI;
          return new Y([-t, -t], [t, t]);
        })()
      };
      function Ai(t, e, i, o) {
        if (Gt(t)) {
          this._a = t[0], this._b = t[1], this._c = t[2], this._d = t[3];
          return;
        }
        this._a = t, this._b = e, this._c = i, this._d = o;
      }
      Ai.prototype = {
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
          return e = e || 1, new T(
            (t.x / e - this._b) / this._a,
            (t.y / e - this._d) / this._c
          );
        }
      };
      function Te(t, e, i, o) {
        return new Ai(t, e, i, o);
      }
      var ti = et({}, Tt, {
        code: "EPSG:3857",
        projection: Ei,
        transformation: (function() {
          var t = 0.5 / (Math.PI * Ei.R);
          return Te(t, 0.5, -t, 0.5);
        })()
      }), rn = et({}, ti, {
        code: "EPSG:900913"
      });
      function ln(t) {
        return document.createElementNS("http://www.w3.org/2000/svg", t);
      }
      function ne(t, e) {
        var i = "", o, s, c, d, f, p;
        for (o = 0, c = t.length; o < c; o++) {
          for (f = t[o], s = 0, d = f.length; s < d; s++)
            p = f[s], i += (s ? "L" : "M") + p.x + " " + p.y;
          i += e ? S.svg ? "z" : "x" : "";
        }
        return i || "M0 0";
      }
      var Zi = document.documentElement.style, dt = "ActiveXObject" in window, ue = dt && !document.addEventListener, ei = "msLaunchUri" in navigator && !("documentMode" in document), De = Jt("webkit"), un = Jt("android"), Ii = Jt("android 2") || Jt("android 3"), cn = parseInt(/WebKit\/([0-9]+)|$/.exec(navigator.userAgent)[1], 10), dn = un && Jt("Google") && cn < 537 && !("AudioNode" in window), Bi = !!window.opera, hn = !ei && Jt("chrome"), Ni = Jt("gecko") && !De && !Bi && !dt, fn = !hn && Jt("safari"), pn = Jt("phantom"), mn = "OTransition" in Zi, vt = navigator.platform.indexOf("Win") === 0, Re = dt && "transition" in Zi, Ve = "WebKitCSSMatrix" in window && "m11" in new window.WebKitCSSMatrix() && !Ii, Di = "MozPerspective" in Zi, _n = !window.L_DISABLE_3D && (Re || Ve || Di) && !mn && !pn, _e = typeof orientation < "u" || Jt("mobile"), ii = _e && De, ke = _e && Ve, ni = !window.PointerEvent && window.MSPointerEvent, Ue = !!(window.PointerEvent || ni), Fe = "ontouchstart" in window || !!window.TouchEvent, vn = !window.L_NO_TOUCH && (Fe || Ue), gn = _e && Bi, Q = _e && Ni, oe = (window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI) > 1, ae = (function() {
        var t = !1;
        try {
          var e = Object.defineProperty({}, "passive", {
            get: function() {
              t = !0;
            }
          });
          window.addEventListener("testPassiveEventSupport", mt, e), window.removeEventListener("testPassiveEventSupport", mt, e);
        } catch {
        }
        return t;
      })(), $t = (function() {
        return !!document.createElement("canvas").getContext;
      })(), Yt = !!(document.createElementNS && ln("svg").createSVGRect), Un = !!Yt && (function() {
        var t = document.createElement("div");
        return t.innerHTML = "<svg/>", (t.firstChild && t.firstChild.namespaceURI) === "http://www.w3.org/2000/svg";
      })(), Fn = !Yt && (function() {
        try {
          var t = document.createElement("div");
          t.innerHTML = '<v:shape adj="1"/>';
          var e = t.firstChild;
          return e.style.behavior = "url(#default#VML)", e && typeof e.adj == "object";
        } catch {
          return !1;
        }
      })(), Hn = navigator.platform.indexOf("Mac") === 0, Wn = navigator.platform.indexOf("Linux") === 0;
      function Jt(t) {
        return navigator.userAgent.toLowerCase().indexOf(t) >= 0;
      }
      var S = {
        ie: dt,
        ielt9: ue,
        edge: ei,
        webkit: De,
        android: un,
        android23: Ii,
        androidStock: dn,
        opera: Bi,
        chrome: hn,
        gecko: Ni,
        safari: fn,
        phantom: pn,
        opera12: mn,
        win: vt,
        ie3d: Re,
        webkit3d: Ve,
        gecko3d: Di,
        any3d: _n,
        mobile: _e,
        mobileWebkit: ii,
        mobileWebkit3d: ke,
        msPointer: ni,
        pointer: Ue,
        touch: vn,
        touchNative: Fe,
        mobileOpera: gn,
        mobileGecko: Q,
        retina: oe,
        passiveEvents: ae,
        canvas: $t,
        svg: Yt,
        vml: Fn,
        inlineSvg: Un,
        mac: Hn,
        linux: Wn
      }, yn = S.msPointer ? "MSPointerDown" : "pointerdown", bn = S.msPointer ? "MSPointerMove" : "pointermove", oi = S.msPointer ? "MSPointerUp" : "pointerup", Ri = S.msPointer ? "MSPointerCancel" : "pointercancel", ai = {
        touchstart: yn,
        touchmove: bn,
        touchend: oi,
        touchcancel: Ri
      }, Vi = {
        touchstart: ui,
        touchmove: ve,
        touchend: ve,
        touchcancel: ve
      }, Se = {}, wn = !1;
      function _(t, e, i) {
        return e === "touchstart" && li(), Vi[e] ? (i = Vi[e].bind(this, i), t.addEventListener(ai[e], i, !1), i) : (console.warn("wrong event specified:", e), mt);
      }
      function si(t, e, i) {
        if (!ai[e]) {
          console.warn("wrong event specified:", e);
          return;
        }
        t.removeEventListener(ai[e], i, !1);
      }
      function Gn(t) {
        Se[t.pointerId] = t;
      }
      function ri(t) {
        Se[t.pointerId] && (Se[t.pointerId] = t);
      }
      function He(t) {
        delete Se[t.pointerId];
      }
      function li() {
        wn || (document.addEventListener(yn, Gn, !0), document.addEventListener(bn, ri, !0), document.addEventListener(oi, He, !0), document.addEventListener(Ri, He, !0), wn = !0);
      }
      function ve(t, e) {
        if (e.pointerType !== (e.MSPOINTER_TYPE_MOUSE || "mouse")) {
          e.touches = [];
          for (var i in Se)
            e.touches.push(Se[i]);
          e.changedTouches = [e], t(e);
        }
      }
      function ui(t, e) {
        e.MSPOINTER_TYPE_TOUCH && e.pointerType === e.MSPOINTER_TYPE_TOUCH && kt(e), ve(t, e);
      }
      function ci(t) {
        var e = {}, i, o;
        for (o in t)
          i = t[o], e[o] = i && i.bind ? i.bind(t) : i;
        return t = e, e.type = "dblclick", e.detail = 2, e.isTrusted = !1, e._simulated = !0, e;
      }
      var di = 200;
      function hi(t, e) {
        t.addEventListener("dblclick", e);
        var i = 0, o;
        function s(c) {
          if (c.detail !== 1) {
            o = c.detail;
            return;
          }
          if (!(c.pointerType === "mouse" || c.sourceCapabilities && !c.sourceCapabilities.firesTouchEvents)) {
            var d = vi(c);
            if (!(d.some(function(p) {
              return p instanceof HTMLLabelElement && p.attributes.for;
            }) && !d.some(function(p) {
              return p instanceof HTMLInputElement || p instanceof HTMLSelectElement;
            }))) {
              var f = Date.now();
              f - i <= di ? (o++, o === 2 && e(ci(c))) : o = 1, i = f;
            }
          }
        }
        return t.addEventListener("click", s), {
          dblclick: e,
          simDblclick: s
        };
      }
      function Xt(t, e) {
        t.removeEventListener("dblclick", e.dblclick), t.removeEventListener("click", e.simDblclick);
      }
      var Ce = ce(
        ["transform", "webkitTransform", "OTransform", "MozTransform", "msTransform"]
      ), We = ce(
        ["webkitTransition", "transition", "OTransition", "MozTransition", "msTransition"]
      ), Qt = We === "webkitTransition" || We === "OTransition" ? We + "End" : "transitionend";
      function W(t) {
        return typeof t == "string" ? document.getElementById(t) : t;
      }
      function Ge(t, e) {
        var i = t.style[e] || t.currentStyle && t.currentStyle[e];
        if ((!i || i === "auto") && document.defaultView) {
          var o = document.defaultView.getComputedStyle(t, null);
          i = o ? o[e] : null;
        }
        return i === "auto" ? null : i;
      }
      function X(t, e, i) {
        var o = document.createElement(t);
        return o.className = e || "", i && i.appendChild(o), o;
      }
      function ht(t) {
        var e = t.parentNode;
        e && e.removeChild(t);
      }
      function qe(t) {
        for (; t.firstChild; )
          t.removeChild(t.firstChild);
      }
      function Me(t) {
        var e = t.parentNode;
        e && e.lastChild !== t && e.appendChild(t);
      }
      function yt(t) {
        var e = t.parentNode;
        e && e.firstChild !== t && e.insertBefore(t, e.firstChild);
      }
      function ze(t, e) {
        if (t.classList !== void 0)
          return t.classList.contains(e);
        var i = Oe(t);
        return i.length > 0 && new RegExp("(^|\\s)" + e + "(\\s|$)").test(i);
      }
      function R(t, e) {
        if (t.classList !== void 0)
          for (var i = St(e), o = 0, s = i.length; o < s; o++)
            t.classList.add(i[o]);
        else if (!ze(t, e)) {
          var c = Oe(t);
          E(t, (c ? c + " " : "") + e);
        }
      }
      function V(t, e) {
        t.classList !== void 0 ? t.classList.remove(e) : E(t, me((" " + Oe(t) + " ").replace(" " + e + " ", " ")));
      }
      function E(t, e) {
        t.className.baseVal === void 0 ? t.className = e : t.className.baseVal = e;
      }
      function Oe(t) {
        return t.correspondingElement && (t = t.correspondingElement), t.className.baseVal === void 0 ? t.className : t.className.baseVal;
      }
      function Dt(t, e) {
        "opacity" in t.style ? t.style.opacity = e : "filter" in t.style && xn(t, e);
      }
      function xn(t, e) {
        var i = !1, o = "DXImageTransform.Microsoft.Alpha";
        try {
          i = t.filters.item(o);
        } catch {
          if (e === 1)
            return;
        }
        e = Math.round(e * 100), i ? (i.Enabled = e !== 100, i.Opacity = e) : t.style.filter += " progid:" + o + "(opacity=" + e + ")";
      }
      function ce(t) {
        for (var e = document.documentElement.style, i = 0; i < t.length; i++)
          if (t[i] in e)
            return t[i];
        return !1;
      }
      function Ut(t, e, i) {
        var o = e || new T(0, 0);
        t.style[Ce] = (S.ie3d ? "translate(" + o.x + "px," + o.y + "px)" : "translate3d(" + o.x + "px," + o.y + "px,0)") + (i ? " scale(" + i + ")" : "");
      }
      function st(t, e) {
        t._leaflet_pos = e, S.any3d ? Ut(t, e) : (t.style.left = e.x + "px", t.style.top = e.y + "px");
      }
      function se(t) {
        return t._leaflet_pos || new T(0, 0);
      }
      var Ft, je, Ui;
      if ("onselectstart" in document)
        Ft = function() {
          N(window, "selectstart", kt);
        }, je = function() {
          ot(window, "selectstart", kt);
        };
      else {
        var de = ce(
          ["userSelect", "WebkitUserSelect", "OUserSelect", "MozUserSelect", "msUserSelect"]
        );
        Ft = function() {
          if (de) {
            var t = document.documentElement.style;
            Ui = t[de], t[de] = "none";
          }
        }, je = function() {
          de && (document.documentElement.style[de] = Ui, Ui = void 0);
        };
      }
      function Mt() {
        N(window, "dragstart", kt);
      }
      function Ht() {
        ot(window, "dragstart", kt);
      }
      var fi, Fi;
      function pi(t) {
        for (; t.tabIndex === -1; )
          t = t.parentNode;
        t.style && (mi(), fi = t, Fi = t.style.outlineStyle, t.style.outlineStyle = "none", N(window, "keydown", mi));
      }
      function mi() {
        fi && (fi.style.outlineStyle = Fi, fi = void 0, Fi = void 0, ot(window, "keydown", mi));
      }
      function _i(t) {
        do
          t = t.parentNode;
        while ((!t.offsetWidth || !t.offsetHeight) && t !== document.body);
        return t;
      }
      function Hi(t) {
        var e = t.getBoundingClientRect();
        return {
          x: e.width / t.offsetWidth || 1,
          y: e.height / t.offsetHeight || 1,
          boundingClientRect: e
        };
      }
      var ge = {
        __proto__: null,
        TRANSFORM: Ce,
        TRANSITION: We,
        TRANSITION_END: Qt,
        get: W,
        getStyle: Ge,
        create: X,
        remove: ht,
        empty: qe,
        toFront: Me,
        toBack: yt,
        hasClass: ze,
        addClass: R,
        removeClass: V,
        setClass: E,
        getClass: Oe,
        setOpacity: Dt,
        testProp: ce,
        setTransform: Ut,
        setPosition: st,
        getPosition: se,
        get disableTextSelection() {
          return Ft;
        },
        get enableTextSelection() {
          return je;
        },
        disableImageDrag: Mt,
        enableImageDrag: Ht,
        preventOutline: pi,
        restoreOutline: mi,
        getSizedParentNode: _i,
        getScale: Hi
      };
      function N(t, e, i, o) {
        if (e && typeof e == "object")
          for (var s in e)
            Gi(t, s, e[s], i);
        else {
          e = St(e);
          for (var c = 0, d = e.length; c < d; c++)
            Gi(t, e[c], i, o);
        }
        return this;
      }
      var te = "_leaflet_events";
      function ot(t, e, i, o) {
        if (arguments.length === 1)
          Pn(t), delete t[te];
        else if (e && typeof e == "object")
          for (var s in e)
            qi(t, s, e[s], i);
        else if (e = St(e), arguments.length === 2)
          Pn(t, function(f) {
            return Ci(e, f) !== -1;
          });
        else
          for (var c = 0, d = e.length; c < d; c++)
            qi(t, e[c], i, o);
        return this;
      }
      function Pn(t, e) {
        for (var i in t[te]) {
          var o = i.split(/\d/)[0];
          (!e || e(o)) && qi(t, o, null, null, i);
        }
      }
      var Wi = {
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        wheel: !("onwheel" in window) && "mousewheel"
      };
      function Gi(t, e, i, o) {
        var s = e + H(i) + (o ? "_" + H(o) : "");
        if (t[te] && t[te][s])
          return this;
        var c = function(f) {
          return i.call(o || t, f || window.event);
        }, d = c;
        !S.touchNative && S.pointer && e.indexOf("touch") === 0 ? c = _(t, e, c) : S.touch && e === "dblclick" ? c = hi(t, c) : "addEventListener" in t ? e === "touchstart" || e === "touchmove" || e === "wheel" || e === "mousewheel" ? t.addEventListener(Wi[e] || e, c, S.passiveEvents ? { passive: !1 } : !1) : e === "mouseenter" || e === "mouseleave" ? (c = function(f) {
          f = f || window.event, Ae(t, f) && d(f);
        }, t.addEventListener(Wi[e], c, !1)) : t.addEventListener(e, d, !1) : t.attachEvent("on" + e, c), t[te] = t[te] || {}, t[te][s] = c;
      }
      function qi(t, e, i, o, s) {
        s = s || e + H(i) + (o ? "_" + H(o) : "");
        var c = t[te] && t[te][s];
        if (!c)
          return this;
        !S.touchNative && S.pointer && e.indexOf("touch") === 0 ? si(t, e, c) : S.touch && e === "dblclick" ? Xt(t, c) : "removeEventListener" in t ? t.removeEventListener(Wi[e] || e, c, !1) : t.detachEvent("on" + e, c), t[te][s] = null;
      }
      function ye(t) {
        return t.stopPropagation ? t.stopPropagation() : t.originalEvent ? t.originalEvent._stopped = !0 : t.cancelBubble = !0, this;
      }
      function Ee(t) {
        return Gi(t, "wheel", ye), this;
      }
      function he(t) {
        return N(t, "mousedown touchstart dblclick contextmenu", ye), t._leaflet_disable_click = !0, this;
      }
      function kt(t) {
        return t.preventDefault ? t.preventDefault() : t.returnValue = !1, this;
      }
      function G(t) {
        return kt(t), ye(t), this;
      }
      function vi(t) {
        if (t.composedPath)
          return t.composedPath();
        for (var e = [], i = t.target; i; )
          e.push(i), i = i.parentNode;
        return e;
      }
      function ji(t, e) {
        if (!e)
          return new T(t.clientX, t.clientY);
        var i = Hi(e), o = i.boundingClientRect;
        return new T(
          // offset.left/top values are in page scale (like clientX/Y),
          // whereas clientLeft/Top (border width) values are the original values (before CSS scale applies).
          (t.clientX - o.left) / i.x - e.clientLeft,
          (t.clientY - o.top) / i.y - e.clientTop
        );
      }
      var Ln = S.linux && S.chrome ? window.devicePixelRatio : S.mac ? window.devicePixelRatio * 3 : window.devicePixelRatio > 0 ? 2 * window.devicePixelRatio : 1;
      function m(t) {
        return S.edge ? t.wheelDeltaY / 2 : (
          // Don't trust window-geometry-based delta
          t.deltaY && t.deltaMode === 0 ? -t.deltaY / Ln : (
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
      function Ae(t, e) {
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
      var qn = {
        __proto__: null,
        on: N,
        off: ot,
        stopPropagation: ye,
        disableScrollPropagation: Ee,
        disableClickPropagation: he,
        preventDefault: kt,
        stop: G,
        getPropagationPath: vi,
        getMousePosition: ji,
        getWheelDelta: m,
        isExternalTarget: Ae,
        addListener: N,
        removeListener: ot
      }, Tn = Be.extend({
        // @method run(el: HTMLElement, newPos: Point, duration?: Number, easeLinearity?: Number)
        // Run an animation of a given element to a new position, optionally setting
        // duration in seconds (`0.25` by default) and easing linearity factor (3rd
        // argument of the [cubic bezier curve](https://cubic-bezier.com/#0,0,.5,1),
        // `0.5` by default).
        run: function(t, e, i, o) {
          this.stop(), this._el = t, this._inProgress = !0, this._duration = i || 0.25, this._easeOutPower = 1 / Math.max(o || 0.5, 0.2), this._startPos = se(t), this._offset = e.subtract(this._startPos), this._startTime = +/* @__PURE__ */ new Date(), this.fire("start"), this._animate();
        },
        // @method stop()
        // Stops the animation (if currently running).
        stop: function() {
          this._inProgress && (this._step(!0), this._complete());
        },
        _animate: function() {
          this._animId = At(this._animate, this), this._step();
        },
        _step: function(t) {
          var e = +/* @__PURE__ */ new Date() - this._startTime, i = this._duration * 1e3;
          e < i ? this._runFrame(this._easeOut(e / i), t) : (this._runFrame(1), this._complete());
        },
        _runFrame: function(t, e) {
          var i = this._startPos.add(this._offset.multiplyBy(t));
          e && i._round(), st(this._el, i), this.fire("step");
        },
        _complete: function() {
          Vt(this._animId), this._inProgress = !1, this.fire("end");
        },
        _easeOut: function(t) {
          return 1 - Math.pow(1 - t, this._easeOutPower);
        }
      }), j = Be.extend({
        options: {
          // @section Map State Options
          // @option crs: CRS = L.CRS.EPSG3857
          // The [Coordinate Reference System](#crs) to use. Don't change this if you're not
          // sure what it means.
          crs: ti,
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
          e = lt(this, e), this._handlers = [], this._layers = {}, this._zoomBoundLayers = {}, this._sizeChanged = !0, this._initContainer(t), this._initLayout(), this._onResize = $(this._onResize, this), this._initEvents(), e.maxBounds && this.setMaxBounds(e.maxBounds), e.zoom !== void 0 && (this._zoom = this._limitZoom(e.zoom)), e.center && e.zoom !== void 0 && this.setView(Z(e.center), e.zoom, { reset: !0 }), this.callInitHooks(), this._zoomAnimated = We && S.any3d && !S.mobileOpera && this.options.zoomAnimation, this._zoomAnimated && (this._createAnimProxy(), N(this._proxy, Qt, this._catchTransitionEnd, this)), this._addLayers(this.options.layers);
        },
        // @section Methods for modifying map state
        // @method setView(center: LatLng, zoom: Number, options?: Zoom/pan options): this
        // Sets the view of the map (geographical center and zoom) with the given
        // animation options.
        setView: function(t, e, i) {
          if (e = e === void 0 ? this._zoom : this._limitZoom(e), t = this._limitCenter(Z(t), e, this.options.maxBounds), i = i || {}, this._stop(), this._loaded && !i.reset && i !== !0) {
            i.animate !== void 0 && (i.zoom = et({ animate: i.animate }, i.zoom), i.pan = et({ animate: i.animate, duration: i.duration }, i.pan));
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
          return t = t || (S.any3d ? this.options.zoomDelta : 1), this.setZoom(this._zoom + t, e);
        },
        // @method zoomOut(delta?: Number, options?: Zoom options): this
        // Decreases the zoom of the map by `delta` ([`zoomDelta`](#map-zoomdelta) by default).
        zoomOut: function(t, e) {
          return t = t || (S.any3d ? this.options.zoomDelta : 1), this.setZoom(this._zoom - t, e);
        },
        // @method setZoomAround(latlng: LatLng, zoom: Number, options: Zoom options): this
        // Zooms the map while keeping a specified geographical point on the map
        // stationary (e.g. used internally for scroll zoom and double-click zoom).
        // @alternative
        // @method setZoomAround(offset: Point, zoom: Number, options: Zoom options): this
        // Zooms the map while keeping a specified pixel on the map (relative to the top-left corner) stationary.
        setZoomAround: function(t, e, i) {
          var o = this.getZoomScale(e), s = this.getSize().divideBy(2), c = t instanceof T ? t : this.latLngToContainerPoint(t), d = c.subtract(s).multiplyBy(1 - 1 / o), f = this.containerPointToLatLng(s.add(d));
          return this.setView(f, e, { zoom: i });
        },
        _getBoundsCenterZoom: function(t, e) {
          e = e || {}, t = t.getBounds ? t.getBounds() : pt(t);
          var i = A(e.paddingTopLeft || e.padding || [0, 0]), o = A(e.paddingBottomRight || e.padding || [0, 0]), s = this.getBoundsZoom(t, !1, i.add(o));
          if (s = typeof e.maxZoom == "number" ? Math.min(e.maxZoom, s) : s, s === 1 / 0)
            return {
              center: t.getCenter(),
              zoom: s
            };
          var c = o.subtract(i).divideBy(2), d = this.project(t.getSouthWest(), s), f = this.project(t.getNorthEast(), s), p = this.unproject(d.add(f).divideBy(2).add(c), s);
          return {
            center: p,
            zoom: s
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
          if (t = A(t).round(), e = e || {}, !t.x && !t.y)
            return this.fire("moveend");
          if (e.animate !== !0 && !this.getSize().contains(t))
            return this._resetView(this.unproject(this.project(this.getCenter()).add(t)), this.getZoom()), this;
          if (this._panAnim || (this._panAnim = new Tn(), this._panAnim.on({
            step: this._onPanTransitionStep,
            end: this._onPanTransitionEnd
          }, this)), e.noMoveStart || this.fire("movestart"), e.animate !== !1) {
            R(this._mapPane, "leaflet-pan-anim");
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
          if (i = i || {}, i.animate === !1 || !S.any3d)
            return this.setView(t, e, i);
          this._stop();
          var o = this.project(this.getCenter()), s = this.project(t), c = this.getSize(), d = this._zoom;
          t = Z(t), e = e === void 0 ? d : e;
          var f = Math.max(c.x, c.y), p = f * this.getZoomScale(d, e), v = s.distanceTo(o) || 1, x = 1.42, I = x * x;
          function q(Pt) {
            var Dn = Pt ? -1 : 1, ma = Pt ? p : f, _a = p * p - f * f + Dn * I * I * v * v, va = 2 * ma * I * v, eo = _a / va, zo = Math.sqrt(eo * eo + 1) - eo, ga = zo < 1e-9 ? -18 : Math.log(zo);
            return ga;
          }
          function Rt(Pt) {
            return (Math.exp(Pt) - Math.exp(-Pt)) / 2;
          }
          function zt(Pt) {
            return (Math.exp(Pt) + Math.exp(-Pt)) / 2;
          }
          function ie(Pt) {
            return Rt(Pt) / zt(Pt);
          }
          var Wt = q(0);
          function Ti(Pt) {
            return f * (zt(Wt) / zt(Wt + x * Pt));
          }
          function da(Pt) {
            return f * (zt(Wt) * ie(Wt + x * Pt) - Rt(Wt)) / I;
          }
          function ha(Pt) {
            return 1 - Math.pow(1 - Pt, 1.5);
          }
          var fa = Date.now(), Co = (q(1) - Wt) / x, pa = i.duration ? 1e3 * i.duration : 1e3 * Co * 0.8;
          function Mo() {
            var Pt = (Date.now() - fa) / pa, Dn = ha(Pt) * Co;
            Pt <= 1 ? (this._flyToFrame = At(Mo, this), this._move(
              this.unproject(o.add(s.subtract(o).multiplyBy(da(Dn) / v)), d),
              this.getScaleZoom(f / Ti(Dn), d),
              { flyTo: !0 }
            )) : this._move(t, e)._moveEnd(!0);
          }
          return this._moveStart(!0, i.noMoveStart), Mo.call(this), this;
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
          var i = this.getCenter(), o = this._limitCenter(i, this._zoom, pt(t));
          return i.equals(o) || this.panTo(o, e), this._enforcingBounds = !1, this;
        },
        // @method panInside(latlng: LatLng, options?: padding options): this
        // Pans the map the minimum amount to make the `latlng` visible. Use
        // padding options to fit the display to more restricted bounds.
        // If `latlng` is already within the (optionally padded) display bounds,
        // the map will not be panned.
        panInside: function(t, e) {
          e = e || {};
          var i = A(e.paddingTopLeft || e.padding || [0, 0]), o = A(e.paddingBottomRight || e.padding || [0, 0]), s = this.project(this.getCenter()), c = this.project(t), d = this.getPixelBounds(), f = Ot([d.min.add(i), d.max.subtract(o)]), p = f.getSize();
          if (!f.contains(c)) {
            this._enforcingBounds = !0;
            var v = c.subtract(f.getCenter()), x = f.extend(c).getSize().subtract(p);
            s.x += v.x < 0 ? -x.x : x.x, s.y += v.y < 0 ? -x.y : x.y, this.panTo(this.unproject(s), e), this._enforcingBounds = !1;
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
          t = et({
            animate: !1,
            pan: !0
          }, t === !0 ? { animate: !0 } : t);
          var e = this.getSize();
          this._sizeChanged = !0, this._lastCenter = null;
          var i = this.getSize(), o = e.divideBy(2).round(), s = i.divideBy(2).round(), c = o.subtract(s);
          return !c.x && !c.y ? this : (t.animate && t.pan ? this.panBy(c) : (t.pan && this._rawPanBy(c), this.fire("move"), t.debounceMoveend ? (clearTimeout(this._sizeTimer), this._sizeTimer = setTimeout($(this.fire, this, "moveend"), 200)) : this.fire("moveend")), this.fire("resize", {
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
          if (t = this._locateOptions = et({
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
          var e = $(this._handleGeolocationResponse, this), i = $(this._handleGeolocationError, this);
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
            var e = t.coords.latitude, i = t.coords.longitude, o = new J(e, i), s = o.toBounds(t.coords.accuracy * 2), c = this._locateOptions;
            if (c.setView) {
              var d = this.getBoundsZoom(s);
              this.setView(o, c.maxZoom ? Math.min(d, c.maxZoom) : d);
            }
            var f = {
              latlng: o,
              bounds: s,
              timestamp: t.timestamp
            };
            for (var p in t.coords)
              typeof t.coords[p] == "number" && (f[p] = t.coords[p]);
            this.fire("locationfound", f);
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
          this._locationWatchId !== void 0 && this.stopLocate(), this._stop(), ht(this._mapPane), this._clearControlPos && this._clearControlPos(), this._resizeRequest && (Vt(this._resizeRequest), this._resizeRequest = null), this._clearHandlers(), this._loaded && this.fire("unload");
          var t;
          for (t in this._layers)
            this._layers[t].remove();
          for (t in this._panes)
            ht(this._panes[t]);
          return this._layers = [], this._panes = [], delete this._mapPane, delete this._renderer, this;
        },
        // @section Other Methods
        // @method createPane(name: String, container?: HTMLElement): HTMLElement
        // Creates a new [map pane](#map-pane) with the given name if it doesn't exist already,
        // then returns it. The pane is created as a child of `container`, or
        // as a child of the main map pane if not set.
        createPane: function(t, e) {
          var i = "leaflet-pane" + (t ? " leaflet-" + t.replace("Pane", "") + "-pane" : ""), o = X("div", i, e || this._mapPane);
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
          return new Ct(e, i);
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
          t = pt(t), i = A(i || [0, 0]);
          var o = this.getZoom() || 0, s = this.getMinZoom(), c = this.getMaxZoom(), d = t.getNorthWest(), f = t.getSouthEast(), p = this.getSize().subtract(i), v = Ot(this.project(f, o), this.project(d, o)).getSize(), x = S.any3d ? this.options.zoomSnap : 1, I = p.x / v.x, q = p.y / v.y, Rt = e ? Math.max(I, q) : Math.min(I, q);
          return o = this.getScaleZoom(Rt, o), x && (o = Math.round(o / (x / 100)) * (x / 100), o = e ? Math.ceil(o / x) * x : Math.floor(o / x) * x), Math.max(s, Math.min(c, o));
        },
        // @method getSize(): Point
        // Returns the current size of the map container (in pixels).
        getSize: function() {
          return (!this._size || this._sizeChanged) && (this._size = new T(
            this._container.clientWidth || 0,
            this._container.clientHeight || 0
          ), this._sizeChanged = !1), this._size.clone();
        },
        // @method getPixelBounds(): Bounds
        // Returns the bounds of the current map view in projected pixel
        // coordinates (sometimes useful in layer and overlay implementations).
        getPixelBounds: function(t, e) {
          var i = this._getTopLeftPoint(t, e);
          return new Y(i, i.add(this.getSize()));
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
          return e = e === void 0 ? this._zoom : e, this.options.crs.latLngToPoint(Z(t), e);
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
          var e = this.project(Z(t))._round();
          return e._subtract(this.getPixelOrigin());
        },
        // @method wrapLatLng(latlng: LatLng): LatLng
        // Returns a `LatLng` where `lat` and `lng` has been wrapped according to the
        // map's CRS's `wrapLat` and `wrapLng` properties, if they are outside the
        // CRS's bounds.
        // By default this means longitude is wrapped around the dateline so its
        // value is between -180 and +180 degrees.
        wrapLatLng: function(t) {
          return this.options.crs.wrapLatLng(Z(t));
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
          return this.options.crs.distance(Z(t), Z(e));
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
          return this.layerPointToContainerPoint(this.latLngToLayerPoint(Z(t)));
        },
        // @method mouseEventToContainerPoint(ev: MouseEvent): Point
        // Given a MouseEvent object, returns the pixel coordinate relative to the
        // map container where the event took place.
        mouseEventToContainerPoint: function(t) {
          return ji(t, this._container);
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
          var e = this._container = W(t);
          if (e) {
            if (e._leaflet_id)
              throw new Error("Map container is already initialized.");
          } else throw new Error("Map container not found.");
          N(e, "scroll", this._onScroll, this), this._containerId = H(e);
        },
        _initLayout: function() {
          var t = this._container;
          this._fadeAnimated = this.options.fadeAnimation && S.any3d, R(t, "leaflet-container" + (S.touch ? " leaflet-touch" : "") + (S.retina ? " leaflet-retina" : "") + (S.ielt9 ? " leaflet-oldie" : "") + (S.safari ? " leaflet-safari" : "") + (this._fadeAnimated ? " leaflet-fade-anim" : ""));
          var e = Ge(t, "position");
          e !== "absolute" && e !== "relative" && e !== "fixed" && e !== "sticky" && (t.style.position = "relative"), this._initPanes(), this._initControlPos && this._initControlPos();
        },
        _initPanes: function() {
          var t = this._panes = {};
          this._paneRenderers = {}, this._mapPane = this.createPane("mapPane", this._container), st(this._mapPane, new T(0, 0)), this.createPane("tilePane"), this.createPane("overlayPane"), this.createPane("shadowPane"), this.createPane("markerPane"), this.createPane("tooltipPane"), this.createPane("popupPane"), this.options.markerZoomAnimation || (R(t.markerPane, "leaflet-zoom-hide"), R(t.shadowPane, "leaflet-zoom-hide"));
        },
        // private methods that modify map state
        // @section Map state change events
        _resetView: function(t, e, i) {
          st(this._mapPane, new T(0, 0));
          var o = !this._loaded;
          this._loaded = !0, e = this._limitZoom(e), this.fire("viewprereset");
          var s = this._zoom !== e;
          this._moveStart(s, i)._move(t, e)._moveEnd(s), this.fire("viewreset"), o && this.fire("load");
        },
        _moveStart: function(t, e) {
          return t && this.fire("zoomstart"), e || this.fire("movestart"), this;
        },
        _move: function(t, e, i, o) {
          e === void 0 && (e = this._zoom);
          var s = this._zoom !== e;
          return this._zoom = e, this._lastCenter = t, this._pixelOrigin = this._getNewPixelOrigin(t), o ? i && i.pinch && this.fire("zoom", i) : ((s || i && i.pinch) && this.fire("zoom", i), this.fire("move", i)), this;
        },
        _moveEnd: function(t) {
          return t && this.fire("zoomend"), this.fire("moveend");
        },
        _stop: function() {
          return Vt(this._flyToFrame), this._panAnim && this._panAnim.stop(), this;
        },
        _rawPanBy: function(t) {
          st(this._mapPane, this._getMapPanePos().subtract(t));
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
          this._targets = {}, this._targets[H(this._container)] = this;
          var e = t ? ot : N;
          e(this._container, "click dblclick mousedown mouseup mouseover mouseout mousemove contextmenu keypress keydown keyup", this._handleDOMEvent, this), this.options.trackResize && e(window, "resize", this._onResize, this), S.any3d && this.options.transform3DLimit && (t ? this.off : this.on).call(this, "moveend", this._onMoveEnd);
        },
        _onResize: function() {
          Vt(this._resizeRequest), this._resizeRequest = At(
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
          for (var i = [], o, s = e === "mouseout" || e === "mouseover", c = t.target || t.srcElement, d = !1; c; ) {
            if (o = this._targets[H(c)], o && (e === "click" || e === "preclick") && this._draggableMoved(o)) {
              d = !0;
              break;
            }
            if (o && o.listens(e, !0) && (s && !Ae(c, t) || (i.push(o), s)) || c === this._container)
              break;
            c = c.parentNode;
          }
          return !i.length && !d && !s && this.listens(e, !0) && (i = [this]), i;
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
            i === "mousedown" && pi(e), this._fireDOMEvent(t, i);
          }
        },
        _mouseEvents: ["click", "dblclick", "mouseover", "mouseout", "contextmenu"],
        _fireDOMEvent: function(t, e, i) {
          if (t.type === "click") {
            var o = et({}, t);
            o.type = "preclick", this._fireDOMEvent(o, o.type, i);
          }
          var s = this._findEventTargets(t, e);
          if (i) {
            for (var c = [], d = 0; d < i.length; d++)
              i[d].listens(e, !0) && c.push(i[d]);
            s = c.concat(s);
          }
          if (s.length) {
            e === "contextmenu" && kt(t);
            var f = s[0], p = {
              originalEvent: t
            };
            if (t.type !== "keypress" && t.type !== "keydown" && t.type !== "keyup") {
              var v = f.getLatLng && (!f._radius || f._radius <= 10);
              p.containerPoint = v ? this.latLngToContainerPoint(f.getLatLng()) : this.mouseEventToContainerPoint(t), p.layerPoint = this.containerPointToLayerPoint(p.containerPoint), p.latlng = v ? f.getLatLng() : this.layerPointToLatLng(p.layerPoint);
            }
            for (d = 0; d < s.length; d++)
              if (s[d].fire(e, p, !0), p.originalEvent._stopped || s[d].options.bubblingMouseEvents === !1 && Ci(this._mouseEvents, e) !== -1)
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
          return se(this._mapPane) || new T(0, 0);
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
          return Ot([
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
          var o = this.project(t, e), s = this.getSize().divideBy(2), c = new Y(o.subtract(s), o.add(s)), d = this._getBoundsOffset(c, i, e);
          return Math.abs(d.x) <= 1 && Math.abs(d.y) <= 1 ? t : this.unproject(o.add(d), e);
        },
        // adjust offset for view to get inside bounds
        _limitOffset: function(t, e) {
          if (!e)
            return t;
          var i = this.getPixelBounds(), o = new Y(i.min.add(t), i.max.add(t));
          return t.add(this._getBoundsOffset(o, e));
        },
        // returns offset needed for pxBounds to get inside maxBounds at a specified zoom
        _getBoundsOffset: function(t, e, i) {
          var o = Ot(
            this.project(e.getNorthEast(), i),
            this.project(e.getSouthWest(), i)
          ), s = o.min.subtract(t.min), c = o.max.subtract(t.max), d = this._rebound(s.x, -c.x), f = this._rebound(s.y, -c.y);
          return new T(d, f);
        },
        _rebound: function(t, e) {
          return t + e > 0 ? Math.round(t - e) / 2 : Math.max(0, Math.ceil(t)) - Math.max(0, Math.floor(e));
        },
        _limitZoom: function(t) {
          var e = this.getMinZoom(), i = this.getMaxZoom(), o = S.any3d ? this.options.zoomSnap : 1;
          return o && (t = Math.round(t / o) * o), Math.max(e, Math.min(i, t));
        },
        _onPanTransitionStep: function() {
          this.fire("move");
        },
        _onPanTransitionEnd: function() {
          V(this._mapPane, "leaflet-pan-anim"), this.fire("moveend");
        },
        _tryAnimatedPan: function(t, e) {
          var i = this._getCenterOffset(t)._trunc();
          return (e && e.animate) !== !0 && !this.getSize().contains(i) ? !1 : (this.panBy(i, e), !0);
        },
        _createAnimProxy: function() {
          var t = this._proxy = X("div", "leaflet-proxy leaflet-zoom-animated");
          this._panes.mapPane.appendChild(t), this.on("zoomanim", function(e) {
            var i = Ce, o = this._proxy.style[i];
            Ut(this._proxy, this.project(e.center, e.zoom), this.getZoomScale(e.zoom, 1)), o === this._proxy.style[i] && this._animatingZoom && this._onZoomTransitionEnd();
          }, this), this.on("load moveend", this._animMoveEnd, this), this._on("unload", this._destroyAnimProxy, this);
        },
        _destroyAnimProxy: function() {
          ht(this._proxy), this.off("load moveend", this._animMoveEnd, this), delete this._proxy;
        },
        _animMoveEnd: function() {
          var t = this.getCenter(), e = this.getZoom();
          Ut(this._proxy, this.project(t, e), this.getZoomScale(e, 1));
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
          var o = this.getZoomScale(e), s = this._getCenterOffset(t)._divideBy(1 - 1 / o);
          return i.animate !== !0 && !this.getSize().contains(s) ? !1 : (At(function() {
            this._moveStart(!0, i.noMoveStart || !1)._animateZoom(t, e, !0);
          }, this), !0);
        },
        _animateZoom: function(t, e, i, o) {
          this._mapPane && (i && (this._animatingZoom = !0, this._animateToCenter = t, this._animateToZoom = e, R(this._mapPane, "leaflet-zoom-anim")), this.fire("zoomanim", {
            center: t,
            zoom: e,
            noUpdate: o
          }), this._tempFireZoomEvent || (this._tempFireZoomEvent = this._zoom !== this._animateToZoom), this._move(this._animateToCenter, this._animateToZoom, void 0, !0), setTimeout($(this._onZoomTransitionEnd, this), 250));
        },
        _onZoomTransitionEnd: function() {
          this._animatingZoom && (this._mapPane && V(this._mapPane, "leaflet-zoom-anim"), this._animatingZoom = !1, this._move(this._animateToCenter, this._animateToZoom, void 0, !0), this._tempFireZoomEvent && this.fire("zoom"), delete this._tempFireZoomEvent, this.fire("move"), this._moveEnd(!0));
        }
      });
      function jn(t, e) {
        return new j(t, e);
      }
      var qt = Kt.extend({
        // @section
        // @aka Control Options
        options: {
          // @option position: String = 'topright'
          // The position of the control (one of the map corners). Possible values are `'topleft'`,
          // `'topright'`, `'bottomleft'` or `'bottomright'`
          position: "topright"
        },
        initialize: function(t) {
          lt(this, t);
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
          return R(e, "leaflet-control"), i.indexOf("bottom") !== -1 ? o.insertBefore(e, o.firstChild) : o.appendChild(e), this._map.on("unload", this.remove, this), this;
        },
        // @method remove: this
        // Removes the control from the map it is currently active on.
        remove: function() {
          return this._map ? (ht(this._container), this.onRemove && this.onRemove(this._map), this._map.off("unload", this.remove, this), this._map = null, this) : this;
        },
        _refocusOnMap: function(t) {
          this._map && t && t.screenX > 0 && t.screenY > 0 && this._map.getContainer().focus();
        }
      }), Ke = function(t) {
        return new qt(t);
      };
      j.include({
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
          var t = this._controlCorners = {}, e = "leaflet-", i = this._controlContainer = X("div", e + "control-container", this._container);
          function o(s, c) {
            var d = e + s + " " + e + c;
            t[s + c] = X("div", d, i);
          }
          o("top", "left"), o("top", "right"), o("bottom", "left"), o("bottom", "right");
        },
        _clearControlPos: function() {
          for (var t in this._controlCorners)
            ht(this._controlCorners[t]);
          ht(this._controlContainer), delete this._controlCorners, delete this._controlContainer;
        }
      });
      var gi = qt.extend({
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
          lt(this, i), this._layerControlInputs = [], this._layers = [], this._lastZIndex = 0, this._handlingClick = !1, this._preventClick = !1;
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
          var e = this._getLayer(H(t));
          return e && this._layers.splice(this._layers.indexOf(e), 1), this._map ? this._update() : this;
        },
        // @method expand(): this
        // Expand the control container if collapsed.
        expand: function() {
          R(this._container, "leaflet-control-layers-expanded"), this._section.style.height = null;
          var t = this._map.getSize().y - (this._container.offsetTop + 50);
          return t < this._section.clientHeight ? (R(this._section, "leaflet-control-layers-scrollbar"), this._section.style.height = t + "px") : V(this._section, "leaflet-control-layers-scrollbar"), this._checkDisabledLayers(), this;
        },
        // @method collapse(): this
        // Collapse the control container if expanded.
        collapse: function() {
          return V(this._container, "leaflet-control-layers-expanded"), this;
        },
        _initLayout: function() {
          var t = "leaflet-control-layers", e = this._container = X("div", t), i = this.options.collapsed;
          e.setAttribute("aria-haspopup", !0), he(e), Ee(e);
          var o = this._section = X("section", t + "-list");
          i && (this._map.on("click", this.collapse, this), N(e, {
            mouseenter: this._expandSafely,
            mouseleave: this.collapse
          }, this));
          var s = this._layersLink = X("a", t + "-toggle", e);
          s.href = "#", s.title = "Layers", s.setAttribute("role", "button"), N(s, {
            keydown: function(c) {
              c.keyCode === 13 && this._expandSafely();
            },
            // Certain screen readers intercept the key event and instead send a click event
            click: function(c) {
              kt(c), this._expandSafely();
            }
          }, this), i || this.expand(), this._baseLayersList = X("div", t + "-base", o), this._separator = X("div", t + "-separator", o), this._overlaysList = X("div", t + "-overlays", o), e.appendChild(o);
        },
        _getLayer: function(t) {
          for (var e = 0; e < this._layers.length; e++)
            if (this._layers[e] && H(this._layers[e].layer) === t)
              return this._layers[e];
        },
        _addLayer: function(t, e, i) {
          this._map && t.on("add remove", this._onLayerChange, this), this._layers.push({
            layer: t,
            name: e,
            overlay: i
          }), this.options.sortLayers && this._layers.sort($(function(o, s) {
            return this.options.sortFunction(o.layer, s.layer, o.name, s.name);
          }, this)), this.options.autoZIndex && t.setZIndex && (this._lastZIndex++, t.setZIndex(this._lastZIndex)), this._expandIfNotCollapsed();
        },
        _update: function() {
          if (!this._container)
            return this;
          qe(this._baseLayersList), qe(this._overlaysList), this._layerControlInputs = [];
          var t, e, i, o, s = 0;
          for (i = 0; i < this._layers.length; i++)
            o = this._layers[i], this._addItem(o), e = e || o.overlay, t = t || !o.overlay, s += o.overlay ? 0 : 1;
          return this.options.hideSingleBase && (t = t && s > 1, this._baseLayersList.style.display = t ? "" : "none"), this._separator.style.display = e && t ? "" : "none", this;
        },
        _onLayerChange: function(t) {
          this._handlingClick || this._update();
          var e = this._getLayer(H(t.target)), i = e.overlay ? t.type === "add" ? "overlayadd" : "overlayremove" : t.type === "add" ? "baselayerchange" : null;
          i && this._map.fire(i, e);
        },
        // IE7 bugs out if you create a radio dynamically, so you have to do it this hacky way (see https://stackoverflow.com/a/119079)
        _createRadioElement: function(t, e) {
          var i = '<input type="radio" class="leaflet-control-layers-selector" name="' + t + '"' + (e ? ' checked="checked"' : "") + "/>", o = document.createElement("div");
          return o.innerHTML = i, o.firstChild;
        },
        _addItem: function(t) {
          var e = document.createElement("label"), i = this._map.hasLayer(t.layer), o;
          t.overlay ? (o = document.createElement("input"), o.type = "checkbox", o.className = "leaflet-control-layers-selector", o.defaultChecked = i) : o = this._createRadioElement("leaflet-base-layers_" + H(this), i), this._layerControlInputs.push(o), o.layerId = H(t.layer), N(o, "click", this._onInputClick, this);
          var s = document.createElement("span");
          s.innerHTML = " " + t.name;
          var c = document.createElement("span");
          e.appendChild(c), c.appendChild(o), c.appendChild(s);
          var d = t.overlay ? this._overlaysList : this._baseLayersList;
          return d.appendChild(e), this._checkDisabledLayers(), e;
        },
        _onInputClick: function() {
          if (!this._preventClick) {
            var t = this._layerControlInputs, e, i, o = [], s = [];
            this._handlingClick = !0;
            for (var c = t.length - 1; c >= 0; c--)
              e = t[c], i = this._getLayer(e.layerId).layer, e.checked ? o.push(i) : e.checked || s.push(i);
            for (c = 0; c < s.length; c++)
              this._map.hasLayer(s[c]) && this._map.removeLayer(s[c]);
            for (c = 0; c < o.length; c++)
              this._map.hasLayer(o[c]) || this._map.addLayer(o[c]);
            this._handlingClick = !1, this._refocusOnMap();
          }
        },
        _checkDisabledLayers: function() {
          for (var t = this._layerControlInputs, e, i, o = this._map.getZoom(), s = t.length - 1; s >= 0; s--)
            e = t[s], i = this._getLayer(e.layerId).layer, e.disabled = i.options.minZoom !== void 0 && o < i.options.minZoom || i.options.maxZoom !== void 0 && o > i.options.maxZoom;
        },
        _expandIfNotCollapsed: function() {
          return this._map && !this.options.collapsed && this.expand(), this;
        },
        _expandSafely: function() {
          var t = this._section;
          this._preventClick = !0, N(t, "click", kt), this.expand();
          var e = this;
          setTimeout(function() {
            ot(t, "click", kt), e._preventClick = !1;
          });
        }
      }), Ki = function(t, e, i) {
        return new gi(t, e, i);
      }, yi = qt.extend({
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
          var e = "leaflet-control-zoom", i = X("div", e + " leaflet-bar"), o = this.options;
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
        _createButton: function(t, e, i, o, s) {
          var c = X("a", i, o);
          return c.innerHTML = t, c.href = "#", c.title = e, c.setAttribute("role", "button"), c.setAttribute("aria-label", e), he(c), N(c, "click", G), N(c, "click", s, this), N(c, "click", this._refocusOnMap, this), c;
        },
        _updateDisabled: function() {
          var t = this._map, e = "leaflet-disabled";
          V(this._zoomInButton, e), V(this._zoomOutButton, e), this._zoomInButton.setAttribute("aria-disabled", "false"), this._zoomOutButton.setAttribute("aria-disabled", "false"), (this._disabled || t._zoom === t.getMinZoom()) && (R(this._zoomOutButton, e), this._zoomOutButton.setAttribute("aria-disabled", "true")), (this._disabled || t._zoom === t.getMaxZoom()) && (R(this._zoomInButton, e), this._zoomInButton.setAttribute("aria-disabled", "true"));
        }
      });
      j.mergeOptions({
        zoomControl: !0
      }), j.addInitHook(function() {
        this.options.zoomControl && (this.zoomControl = new yi(), this.addControl(this.zoomControl));
      });
      var kn = function(t) {
        return new yi(t);
      }, h = qt.extend({
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
          var e = "leaflet-control-scale", i = X("div", e), o = this.options;
          return this._addScales(o, e + "-line", i), t.on(o.updateWhenIdle ? "moveend" : "move", this._update, this), t.whenReady(this._update, this), i;
        },
        onRemove: function(t) {
          t.off(this.options.updateWhenIdle ? "moveend" : "move", this._update, this);
        },
        _addScales: function(t, e, i) {
          t.metric && (this._mScale = X("div", e, i)), t.imperial && (this._iScale = X("div", e, i));
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
          var e = t * 3.2808399, i, o, s;
          e > 5280 ? (i = e / 5280, o = this._getRoundNum(i), this._updateScale(this._iScale, o + " mi", o / i)) : (s = this._getRoundNum(e), this._updateScale(this._iScale, s + " ft", s / e));
        },
        _updateScale: function(t, e, i) {
          t.style.width = Math.round(this.options.maxWidth * i) + "px", t.innerHTML = e;
        },
        _getRoundNum: function(t) {
          var e = Math.pow(10, (Math.floor(t) + "").length - 1), i = t / e;
          return i = i >= 10 ? 10 : i >= 5 ? 5 : i >= 3 ? 3 : i >= 2 ? 2 : 1, e * i;
        }
      }), u = function(t) {
        return new h(t);
      }, r = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" class="leaflet-attribution-flag"><path fill="#4C7BE1" d="M0 0h12v4H0z"/><path fill="#FFD500" d="M0 4h12v3H0z"/><path fill="#E0BC00" d="M0 7h12v1H0z"/></svg>', k = qt.extend({
        // @section
        // @aka Control.Attribution options
        options: {
          position: "bottomright",
          // @option prefix: String|false = 'Leaflet'
          // The HTML text shown before the attributions. Pass `false` to disable.
          prefix: '<a href="https://leafletjs.com" title="A JavaScript library for interactive maps">' + (S.inlineSvg ? r + " " : "") + "Leaflet</a>"
        },
        initialize: function(t) {
          lt(this, t), this._attributions = {};
        },
        onAdd: function(t) {
          t.attributionControl = this, this._container = X("div", "leaflet-control-attribution"), he(this._container);
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
      j.mergeOptions({
        attributionControl: !0
      }), j.addInitHook(function() {
        this.options.attributionControl && new k().addTo(this);
      });
      var P = function(t) {
        return new k(t);
      };
      qt.Layers = gi, qt.Zoom = yi, qt.Scale = h, qt.Attribution = k, Ke.layers = Ki, Ke.zoom = kn, Ke.scale = u, Ke.attribution = P;
      var D = Kt.extend({
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
      D.addTo = function(t, e) {
        return t.addHandler(e, this), this;
      };
      var it = { Events: Nt }, _t = S.touch ? "touchstart mousedown" : "mousedown", re = Be.extend({
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
          lt(this, o), this._element = t, this._dragStartTarget = e || t, this._preventOutline = i;
        },
        // @method enable()
        // Enables the dragging ability
        enable: function() {
          this._enabled || (N(this._dragStartTarget, _t, this._onDown, this), this._enabled = !0);
        },
        // @method disable()
        // Disables the dragging ability
        disable: function() {
          this._enabled && (re._dragging === this && this.finishDrag(!0), ot(this._dragStartTarget, _t, this._onDown, this), this._enabled = !1, this._moved = !1);
        },
        _onDown: function(t) {
          if (this._enabled && (this._moved = !1, !ze(this._element, "leaflet-zoom-anim"))) {
            if (t.touches && t.touches.length !== 1) {
              re._dragging === this && this.finishDrag();
              return;
            }
            if (!(re._dragging || t.shiftKey || t.which !== 1 && t.button !== 1 && !t.touches) && (re._dragging = this, this._preventOutline && pi(this._element), Mt(), Ft(), !this._moving)) {
              this.fire("down");
              var e = t.touches ? t.touches[0] : t, i = _i(this._element);
              this._startPoint = new T(e.clientX, e.clientY), this._startPos = se(this._element), this._parentScale = Hi(i);
              var o = t.type === "mousedown";
              N(document, o ? "mousemove" : "touchmove", this._onMove, this), N(document, o ? "mouseup" : "touchend touchcancel", this._onUp, this);
            }
          }
        },
        _onMove: function(t) {
          if (this._enabled) {
            if (t.touches && t.touches.length > 1) {
              this._moved = !0;
              return;
            }
            var e = t.touches && t.touches.length === 1 ? t.touches[0] : t, i = new T(e.clientX, e.clientY)._subtract(this._startPoint);
            !i.x && !i.y || Math.abs(i.x) + Math.abs(i.y) < this.options.clickTolerance || (i.x /= this._parentScale.x, i.y /= this._parentScale.y, kt(t), this._moved || (this.fire("dragstart"), this._moved = !0, R(document.body, "leaflet-dragging"), this._lastTarget = t.target || t.srcElement, window.SVGElementInstance && this._lastTarget instanceof window.SVGElementInstance && (this._lastTarget = this._lastTarget.correspondingUseElement), R(this._lastTarget, "leaflet-drag-target")), this._newPos = this._startPos.add(i), this._moving = !0, this._lastEvent = t, this._updatePosition());
          }
        },
        _updatePosition: function() {
          var t = { originalEvent: this._lastEvent };
          this.fire("predrag", t), st(this._element, this._newPos), this.fire("drag", t);
        },
        _onUp: function() {
          this._enabled && this.finishDrag();
        },
        finishDrag: function(t) {
          V(document.body, "leaflet-dragging"), this._lastTarget && (V(this._lastTarget, "leaflet-drag-target"), this._lastTarget = null), ot(document, "mousemove touchmove", this._onMove, this), ot(document, "mouseup touchend touchcancel", this._onUp, this), Ht(), je();
          var e = this._moved && this._moving;
          this._moving = !1, re._dragging = !1, e && this.fire("dragend", {
            noInertia: t,
            distance: this._newPos.distanceTo(this._startPos)
          });
        }
      });
      function $i(t, e, i) {
        var o, s = [1, 4, 2, 8], c, d, f, p, v, x, I, q;
        for (c = 0, x = t.length; c < x; c++)
          t[c]._code = $e(t[c], e);
        for (f = 0; f < 4; f++) {
          for (I = s[f], o = [], c = 0, x = t.length, d = x - 1; c < x; d = c++)
            p = t[c], v = t[d], p._code & I ? v._code & I || (q = Sn(v, p, I, e, i), q._code = $e(q, e), o.push(q)) : (v._code & I && (q = Sn(v, p, I, e, i), q._code = $e(q, e), o.push(q)), o.push(p));
          t = o;
        }
        return t;
      }
      function Yi(t, e) {
        var i, o, s, c, d, f, p, v, x;
        if (!t || t.length === 0)
          throw new Error("latlngs not passed");
        ee(t) || (console.warn("latlngs are not flat! Only the first ring will be used"), t = t[0]);
        var I = Z([0, 0]), q = pt(t), Rt = q.getNorthWest().distanceTo(q.getSouthWest()) * q.getNorthEast().distanceTo(q.getNorthWest());
        Rt < 1700 && (I = g(t));
        var zt = t.length, ie = [];
        for (i = 0; i < zt; i++) {
          var Wt = Z(t[i]);
          ie.push(e.project(Z([Wt.lat - I.lat, Wt.lng - I.lng])));
        }
        for (f = p = v = 0, i = 0, o = zt - 1; i < zt; o = i++)
          s = ie[i], c = ie[o], d = s.y * c.x - c.y * s.x, p += (s.x + c.x) * d, v += (s.y + c.y) * d, f += d * 3;
        f === 0 ? x = ie[0] : x = [p / f, v / f];
        var Ti = e.unproject(A(x));
        return Z([Ti.lat + I.lat, Ti.lng + I.lng]);
      }
      function g(t) {
        for (var e = 0, i = 0, o = 0, s = 0; s < t.length; s++) {
          var c = Z(t[s]);
          e += c.lat, i += c.lng, o++;
        }
        return Z([e / o, i / o]);
      }
      var nt = {
        __proto__: null,
        clipPolygon: $i,
        polygonCenter: Yi,
        centroid: g
      };
      function rt(t, e) {
        if (!e || !t.length)
          return t.slice();
        var i = e * e;
        return t = Do(t, i), t = xt(t, i), t;
      }
      function bt(t, e, i) {
        return Math.sqrt(Ji(t, e, i, !0));
      }
      function wt(t, e, i) {
        return Ji(t, e, i);
      }
      function xt(t, e) {
        var i = t.length, o = typeof Uint8Array < "u" ? Uint8Array : Array, s = new o(i);
        s[0] = s[i - 1] = 1, Kn(t, s, e, 0, i - 1);
        var c, d = [];
        for (c = 0; c < i; c++)
          s[c] && d.push(t[c]);
        return d;
      }
      function Kn(t, e, i, o, s) {
        var c = 0, d, f, p;
        for (f = o + 1; f <= s - 1; f++)
          p = Ji(t[f], t[o], t[s], !0), p > c && (d = f, c = p);
        c > i && (e[d] = 1, Kn(t, e, i, o, d), Kn(t, e, i, d, s));
      }
      function Do(t, e) {
        for (var i = [t[0]], o = 1, s = 0, c = t.length; o < c; o++)
          Ro(t[o], t[s]) > e && (i.push(t[o]), s = o);
        return s < c - 1 && i.push(t[c - 1]), i;
      }
      var no;
      function oo(t, e, i, o, s) {
        var c = o ? no : $e(t, i), d = $e(e, i), f, p, v;
        for (no = d; ; ) {
          if (!(c | d))
            return [t, e];
          if (c & d)
            return !1;
          f = c || d, p = Sn(t, e, f, i, s), v = $e(p, i), f === c ? (t = p, c = v) : (e = p, d = v);
        }
      }
      function Sn(t, e, i, o, s) {
        var c = e.x - t.x, d = e.y - t.y, f = o.min, p = o.max, v, x;
        return i & 8 ? (v = t.x + c * (p.y - t.y) / d, x = p.y) : i & 4 ? (v = t.x + c * (f.y - t.y) / d, x = f.y) : i & 2 ? (v = p.x, x = t.y + d * (p.x - t.x) / c) : i & 1 && (v = f.x, x = t.y + d * (f.x - t.x) / c), new T(v, x, s);
      }
      function $e(t, e) {
        var i = 0;
        return t.x < e.min.x ? i |= 1 : t.x > e.max.x && (i |= 2), t.y < e.min.y ? i |= 4 : t.y > e.max.y && (i |= 8), i;
      }
      function Ro(t, e) {
        var i = e.x - t.x, o = e.y - t.y;
        return i * i + o * o;
      }
      function Ji(t, e, i, o) {
        var s = e.x, c = e.y, d = i.x - s, f = i.y - c, p = d * d + f * f, v;
        return p > 0 && (v = ((t.x - s) * d + (t.y - c) * f) / p, v > 1 ? (s = i.x, c = i.y) : v > 0 && (s += d * v, c += f * v)), d = t.x - s, f = t.y - c, o ? d * d + f * f : new T(s, c);
      }
      function ee(t) {
        return !Gt(t[0]) || typeof t[0][0] != "object" && typeof t[0][0] < "u";
      }
      function ao(t) {
        return console.warn("Deprecated use of _flat, please use L.LineUtil.isFlat instead."), ee(t);
      }
      function so(t, e) {
        var i, o, s, c, d, f, p, v;
        if (!t || t.length === 0)
          throw new Error("latlngs not passed");
        ee(t) || (console.warn("latlngs are not flat! Only the first ring will be used"), t = t[0]);
        var x = Z([0, 0]), I = pt(t), q = I.getNorthWest().distanceTo(I.getSouthWest()) * I.getNorthEast().distanceTo(I.getNorthWest());
        q < 1700 && (x = g(t));
        var Rt = t.length, zt = [];
        for (i = 0; i < Rt; i++) {
          var ie = Z(t[i]);
          zt.push(e.project(Z([ie.lat - x.lat, ie.lng - x.lng])));
        }
        for (i = 0, o = 0; i < Rt - 1; i++)
          o += zt[i].distanceTo(zt[i + 1]) / 2;
        if (o === 0)
          v = zt[0];
        else
          for (i = 0, c = 0; i < Rt - 1; i++)
            if (d = zt[i], f = zt[i + 1], s = d.distanceTo(f), c += s, c > o) {
              p = (c - o) / s, v = [
                f.x - p * (f.x - d.x),
                f.y - p * (f.y - d.y)
              ];
              break;
            }
        var Wt = e.unproject(A(v));
        return Z([Wt.lat + x.lat, Wt.lng + x.lng]);
      }
      var Vo = {
        __proto__: null,
        simplify: rt,
        pointToSegmentDistance: bt,
        closestPointOnSegment: wt,
        clipSegment: oo,
        _getEdgeIntersection: Sn,
        _getBitCode: $e,
        _sqClosestPointOnSegment: Ji,
        isFlat: ee,
        _flat: ao,
        polylineCenter: so
      }, $n = {
        project: function(t) {
          return new T(t.lng, t.lat);
        },
        unproject: function(t) {
          return new J(t.y, t.x);
        },
        bounds: new Y([-180, -90], [180, 90])
      }, Yn = {
        R: 6378137,
        R_MINOR: 6356752314245179e-9,
        bounds: new Y([-2003750834279e-5, -1549657073972e-5], [2003750834279e-5, 1876465623138e-5]),
        project: function(t) {
          var e = Math.PI / 180, i = this.R, o = t.lat * e, s = this.R_MINOR / i, c = Math.sqrt(1 - s * s), d = c * Math.sin(o), f = Math.tan(Math.PI / 4 - o / 2) / Math.pow((1 - d) / (1 + d), c / 2);
          return o = -i * Math.log(Math.max(f, 1e-10)), new T(t.lng * e * i, o);
        },
        unproject: function(t) {
          for (var e = 180 / Math.PI, i = this.R, o = this.R_MINOR / i, s = Math.sqrt(1 - o * o), c = Math.exp(-t.y / i), d = Math.PI / 2 - 2 * Math.atan(c), f = 0, p = 0.1, v; f < 15 && Math.abs(p) > 1e-7; f++)
            v = s * Math.sin(d), v = Math.pow((1 - v) / (1 + v), s / 2), p = Math.PI / 2 - 2 * Math.atan(c * v) - d, d += p;
          return new J(d * e, t.x * e / i);
        }
      }, Uo = {
        __proto__: null,
        LonLat: $n,
        Mercator: Yn,
        SphericalMercator: Ei
      }, Fo = et({}, Tt, {
        code: "EPSG:3395",
        projection: Yn,
        transformation: (function() {
          var t = 0.5 / (Math.PI * Yn.R);
          return Te(t, 0.5, -t, 0.5);
        })()
      }), ro = et({}, Tt, {
        code: "EPSG:4326",
        projection: $n,
        transformation: Te(1 / 180, 1, -1 / 180, 0.5)
      }), Ho = et({}, ut, {
        projection: $n,
        transformation: Te(1, 0, -1, 0),
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
      ut.Earth = Tt, ut.EPSG3395 = Fo, ut.EPSG3857 = ti, ut.EPSG900913 = rn, ut.EPSG4326 = ro, ut.Simple = Ho;
      var le = Be.extend({
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
          return this._map._targets[H(t)] = this, this;
        },
        removeInteractiveTarget: function(t) {
          return delete this._map._targets[H(t)], this;
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
      j.include({
        // @method addLayer(layer: Layer): this
        // Adds the given layer to the map
        addLayer: function(t) {
          if (!t._layerAdd)
            throw new Error("The provided object is not a Layer.");
          var e = H(t);
          return this._layers[e] ? this : (this._layers[e] = t, t._mapToAdd = this, t.beforeAdd && t.beforeAdd(this), this.whenReady(t._layerAdd, t), this);
        },
        // @method removeLayer(layer: Layer): this
        // Removes the given layer from the map.
        removeLayer: function(t) {
          var e = H(t);
          return this._layers[e] ? (this._loaded && t.onRemove(this), delete this._layers[e], this._loaded && (this.fire("layerremove", { layer: t }), t.fire("remove")), t._map = t._mapToAdd = null, this) : this;
        },
        // @method hasLayer(layer: Layer): Boolean
        // Returns `true` if the given layer is currently added to the map
        hasLayer: function(t) {
          return H(t) in this._layers;
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
          t = t ? Gt(t) ? t : [t] : [];
          for (var e = 0, i = t.length; e < i; e++)
            this.addLayer(t[e]);
        },
        _addZoomLimit: function(t) {
          (!isNaN(t.options.maxZoom) || !isNaN(t.options.minZoom)) && (this._zoomBoundLayers[H(t)] = t, this._updateZoomLevels());
        },
        _removeZoomLimit: function(t) {
          var e = H(t);
          this._zoomBoundLayers[e] && (delete this._zoomBoundLayers[e], this._updateZoomLevels());
        },
        _updateZoomLevels: function() {
          var t = 1 / 0, e = -1 / 0, i = this._getZoomSpan();
          for (var o in this._zoomBoundLayers) {
            var s = this._zoomBoundLayers[o].options;
            t = s.minZoom === void 0 ? t : Math.min(t, s.minZoom), e = s.maxZoom === void 0 ? e : Math.max(e, s.maxZoom);
          }
          this._layersMaxZoom = e === -1 / 0 ? void 0 : e, this._layersMinZoom = t === 1 / 0 ? void 0 : t, i !== this._getZoomSpan() && this.fire("zoomlevelschange"), this.options.maxZoom === void 0 && this._layersMaxZoom && this.getZoom() > this._layersMaxZoom && this.setZoom(this._layersMaxZoom), this.options.minZoom === void 0 && this._layersMinZoom && this.getZoom() < this._layersMinZoom && this.setZoom(this._layersMinZoom);
        }
      });
      var bi = le.extend({
        initialize: function(t, e) {
          lt(this, e), this._layers = {};
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
          return H(t);
        }
      }), Wo = function(t, e) {
        return new bi(t, e);
      }, be = bi.extend({
        addLayer: function(t) {
          return this.hasLayer(t) ? this : (t.addEventParent(this), bi.prototype.addLayer.call(this, t), this.fire("layeradd", { layer: t }));
        },
        removeLayer: function(t) {
          return this.hasLayer(t) ? (t in this._layers && (t = this._layers[t]), t.removeEventParent(this), bi.prototype.removeLayer.call(this, t), this.fire("layerremove", { layer: t })) : this;
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
          var t = new Ct();
          for (var e in this._layers) {
            var i = this._layers[e];
            t.extend(i.getBounds ? i.getBounds() : i.getLatLng());
          }
          return t;
        }
      }), Go = function(t, e) {
        return new be(t, e);
      }, wi = Kt.extend({
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
          lt(this, t);
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
          var s = A(o), c = A(e === "shadow" && i.shadowAnchor || i.iconAnchor || s && s.divideBy(2, !0));
          t.className = "leaflet-marker-" + e + " " + (i.className || ""), c && (t.style.marginLeft = -c.x + "px", t.style.marginTop = -c.y + "px"), s && (t.style.width = s.x + "px", t.style.height = s.y + "px");
        },
        _createImg: function(t, e) {
          return e = e || document.createElement("img"), e.src = t, e;
        },
        _getIconUrl: function(t) {
          return S.retina && this.options[t + "RetinaUrl"] || this.options[t + "Url"];
        }
      });
      function qo(t) {
        return new wi(t);
      }
      var Xi = wi.extend({
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
          return typeof Xi.imagePath != "string" && (Xi.imagePath = this._detectIconPath()), (this.options.imagePath || Xi.imagePath) + wi.prototype._getIconUrl.call(this, t);
        },
        _stripUrl: function(t) {
          var e = function(i, o, s) {
            var c = o.exec(i);
            return c && c[s];
          };
          return t = e(t, /^url\((['"])?(.+)\1\)$/, 2), t && e(t, /^(.*)marker-icon\.png$/, 1);
        },
        _detectIconPath: function() {
          var t = X("div", "leaflet-default-icon-path", document.body), e = Ge(t, "background-image") || Ge(t, "backgroundImage");
          if (document.body.removeChild(t), e = this._stripUrl(e), e)
            return e;
          var i = document.querySelector('link[href$="leaflet.css"]');
          return i ? i.href.substring(0, i.href.length - 11 - 1) : "";
        }
      }), lo = D.extend({
        initialize: function(t) {
          this._marker = t;
        },
        addHooks: function() {
          var t = this._marker._icon;
          this._draggable || (this._draggable = new re(t, t, !0)), this._draggable.on({
            dragstart: this._onDragStart,
            predrag: this._onPreDrag,
            drag: this._onDrag,
            dragend: this._onDragEnd
          }, this).enable(), R(t, "leaflet-marker-draggable");
        },
        removeHooks: function() {
          this._draggable.off({
            dragstart: this._onDragStart,
            predrag: this._onPreDrag,
            drag: this._onDrag,
            dragend: this._onDragEnd
          }, this).disable(), this._marker._icon && V(this._marker._icon, "leaflet-marker-draggable");
        },
        moved: function() {
          return this._draggable && this._draggable._moved;
        },
        _adjustPan: function(t) {
          var e = this._marker, i = e._map, o = this._marker.options.autoPanSpeed, s = this._marker.options.autoPanPadding, c = se(e._icon), d = i.getPixelBounds(), f = i.getPixelOrigin(), p = Ot(
            d.min._subtract(f).add(s),
            d.max._subtract(f).subtract(s)
          );
          if (!p.contains(c)) {
            var v = A(
              (Math.max(p.max.x, c.x) - p.max.x) / (d.max.x - p.max.x) - (Math.min(p.min.x, c.x) - p.min.x) / (d.min.x - p.min.x),
              (Math.max(p.max.y, c.y) - p.max.y) / (d.max.y - p.max.y) - (Math.min(p.min.y, c.y) - p.min.y) / (d.min.y - p.min.y)
            ).multiplyBy(o);
            i.panBy(v, { animate: !1 }), this._draggable._newPos._add(v), this._draggable._startPos._add(v), st(e._icon, this._draggable._newPos), this._onDrag(t), this._panRequest = At(this._adjustPan.bind(this, t));
          }
        },
        _onDragStart: function() {
          this._oldLatLng = this._marker.getLatLng(), this._marker.closePopup && this._marker.closePopup(), this._marker.fire("movestart").fire("dragstart");
        },
        _onPreDrag: function(t) {
          this._marker.options.autoPan && (Vt(this._panRequest), this._panRequest = At(this._adjustPan.bind(this, t)));
        },
        _onDrag: function(t) {
          var e = this._marker, i = e._shadow, o = se(e._icon), s = e._map.layerPointToLatLng(o);
          i && st(i, o), e._latlng = s, t.latlng = s, t.oldLatLng = this._oldLatLng, e.fire("move", t).fire("drag", t);
        },
        _onDragEnd: function(t) {
          Vt(this._panRequest), delete this._oldLatLng, this._marker.fire("moveend").fire("dragend", t);
        }
      }), Cn = le.extend({
        // @section
        // @aka Marker options
        options: {
          // @option icon: Icon = *
          // Icon instance to use for rendering the marker.
          // See [Icon documentation](#L.Icon) for details on how to customize the marker icon.
          // If not specified, a common instance of `L.Icon.Default` is used.
          icon: new Xi(),
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
          lt(this, e), this._latlng = Z(t);
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
          return this._latlng = Z(t), this.update(), this.fire("move", { oldLatLng: e, latlng: this._latlng });
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
          i !== this._icon && (this._icon && this._removeIcon(), o = !0, t.title && (i.title = t.title), i.tagName === "IMG" && (i.alt = t.alt || "")), R(i, e), t.keyboard && (i.tabIndex = "0", i.setAttribute("role", "button")), this._icon = i, t.riseOnHover && this.on({
            mouseover: this._bringToFront,
            mouseout: this._resetZIndex
          }), this.options.autoPanOnFocus && N(i, "focus", this._panOnFocus, this);
          var s = t.icon.createShadow(this._shadow), c = !1;
          s !== this._shadow && (this._removeShadow(), c = !0), s && (R(s, e), s.alt = ""), this._shadow = s, t.opacity < 1 && this._updateOpacity(), o && this.getPane().appendChild(this._icon), this._initInteraction(), s && c && this.getPane(t.shadowPane).appendChild(this._shadow);
        },
        _removeIcon: function() {
          this.options.riseOnHover && this.off({
            mouseover: this._bringToFront,
            mouseout: this._resetZIndex
          }), this.options.autoPanOnFocus && ot(this._icon, "focus", this._panOnFocus, this), ht(this._icon), this.removeInteractiveTarget(this._icon), this._icon = null;
        },
        _removeShadow: function() {
          this._shadow && ht(this._shadow), this._shadow = null;
        },
        _setPos: function(t) {
          this._icon && st(this._icon, t), this._shadow && st(this._shadow, t), this._zIndex = t.y + this.options.zIndexOffset, this._resetZIndex();
        },
        _updateZIndex: function(t) {
          this._icon && (this._icon.style.zIndex = this._zIndex + t);
        },
        _animateZoom: function(t) {
          var e = this._map._latLngToNewLayerPoint(this._latlng, t.zoom, t.center).round();
          this._setPos(e);
        },
        _initInteraction: function() {
          if (this.options.interactive && (R(this._icon, "leaflet-interactive"), this.addInteractiveTarget(this._icon), lo)) {
            var t = this.options.draggable;
            this.dragging && (t = this.dragging.enabled(), this.dragging.disable()), this.dragging = new lo(this), t && this.dragging.enable();
          }
        },
        // @method setOpacity(opacity: Number): this
        // Changes the opacity of the marker.
        setOpacity: function(t) {
          return this.options.opacity = t, this._map && this._updateOpacity(), this;
        },
        _updateOpacity: function() {
          var t = this.options.opacity;
          this._icon && Dt(this._icon, t), this._shadow && Dt(this._shadow, t);
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
      function jo(t, e) {
        return new Cn(t, e);
      }
      var Ze = le.extend({
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
          return lt(this, t), this._renderer && (this._renderer._updateStyle(this), this.options.stroke && t && Object.prototype.hasOwnProperty.call(t, "weight") && this._updateBounds()), this;
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
      }), Mn = Ze.extend({
        // @section
        // @aka CircleMarker options
        options: {
          fill: !0,
          // @option radius: Number = 10
          // Radius of the circle marker, in pixels
          radius: 10
        },
        initialize: function(t, e) {
          lt(this, e), this._latlng = Z(t), this._radius = this.options.radius;
        },
        // @method setLatLng(latLng: LatLng): this
        // Sets the position of a circle marker to a new location.
        setLatLng: function(t) {
          var e = this._latlng;
          return this._latlng = Z(t), this.redraw(), this.fire("move", { oldLatLng: e, latlng: this._latlng });
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
          return Ze.prototype.setStyle.call(this, t), this.setRadius(e), this;
        },
        _project: function() {
          this._point = this._map.latLngToLayerPoint(this._latlng), this._updateBounds();
        },
        _updateBounds: function() {
          var t = this._radius, e = this._radiusY || t, i = this._clickTolerance(), o = [t + i, e + i];
          this._pxBounds = new Y(this._point.subtract(o), this._point.add(o));
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
      function Ko(t, e) {
        return new Mn(t, e);
      }
      var Jn = Mn.extend({
        initialize: function(t, e, i) {
          if (typeof e == "number" && (e = et({}, i, { radius: e })), lt(this, e), this._latlng = Z(t), isNaN(this.options.radius))
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
          return new Ct(
            this._map.layerPointToLatLng(this._point.subtract(t)),
            this._map.layerPointToLatLng(this._point.add(t))
          );
        },
        setStyle: Ze.prototype.setStyle,
        _project: function() {
          var t = this._latlng.lng, e = this._latlng.lat, i = this._map, o = i.options.crs;
          if (o.distance === Tt.distance) {
            var s = Math.PI / 180, c = this._mRadius / Tt.R / s, d = i.project([e + c, t]), f = i.project([e - c, t]), p = d.add(f).divideBy(2), v = i.unproject(p).lat, x = Math.acos((Math.cos(c * s) - Math.sin(e * s) * Math.sin(v * s)) / (Math.cos(e * s) * Math.cos(v * s))) / s;
            (isNaN(x) || x === 0) && (x = c / Math.cos(Math.PI / 180 * e)), this._point = p.subtract(i.getPixelOrigin()), this._radius = isNaN(x) ? 0 : p.x - i.project([v, t - x]).x, this._radiusY = p.y - d.y;
          } else {
            var I = o.unproject(o.project(this._latlng).subtract([this._mRadius, 0]));
            this._point = i.latLngToLayerPoint(this._latlng), this._radius = this._point.x - i.latLngToLayerPoint(I).x;
          }
          this._updateBounds();
        }
      });
      function $o(t, e, i) {
        return new Jn(t, e, i);
      }
      var we = Ze.extend({
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
          lt(this, e), this._setLatLngs(t);
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
          for (var e = 1 / 0, i = null, o = Ji, s, c, d = 0, f = this._parts.length; d < f; d++)
            for (var p = this._parts[d], v = 1, x = p.length; v < x; v++) {
              s = p[v - 1], c = p[v];
              var I = o(t, s, c, !0);
              I < e && (e = I, i = o(t, s, c));
            }
          return i && (i.distance = Math.sqrt(e)), i;
        },
        // @method getCenter(): LatLng
        // Returns the center ([centroid](https://en.wikipedia.org/wiki/Centroid)) of the polyline.
        getCenter: function() {
          if (!this._map)
            throw new Error("Must add layer to map before using getCenter()");
          return so(this._defaultShape(), this._map.options.crs);
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
          return e = e || this._defaultShape(), t = Z(t), e.push(t), this._bounds.extend(t), this.redraw();
        },
        _setLatLngs: function(t) {
          this._bounds = new Ct(), this._latlngs = this._convertLatLngs(t);
        },
        _defaultShape: function() {
          return ee(this._latlngs) ? this._latlngs : this._latlngs[0];
        },
        // recursively convert latlngs input into actual LatLng instances; calculate bounds along the way
        _convertLatLngs: function(t) {
          for (var e = [], i = ee(t), o = 0, s = t.length; o < s; o++)
            i ? (e[o] = Z(t[o]), this._bounds.extend(e[o])) : e[o] = this._convertLatLngs(t[o]);
          return e;
        },
        _project: function() {
          var t = new Y();
          this._rings = [], this._projectLatlngs(this._latlngs, this._rings, t), this._bounds.isValid() && t.isValid() && (this._rawPxBounds = t, this._updateBounds());
        },
        _updateBounds: function() {
          var t = this._clickTolerance(), e = new T(t, t);
          this._rawPxBounds && (this._pxBounds = new Y([
            this._rawPxBounds.min.subtract(e),
            this._rawPxBounds.max.add(e)
          ]));
        },
        // recursively turns latlngs into a set of rings with projected coordinates
        _projectLatlngs: function(t, e, i) {
          var o = t[0] instanceof J, s = t.length, c, d;
          if (o) {
            for (d = [], c = 0; c < s; c++)
              d[c] = this._map.latLngToLayerPoint(t[c]), i.extend(d[c]);
            e.push(d);
          } else
            for (c = 0; c < s; c++)
              this._projectLatlngs(t[c], e, i);
        },
        // clip polyline by renderer bounds so that we have less to render for performance
        _clipPoints: function() {
          var t = this._renderer._bounds;
          if (this._parts = [], !(!this._pxBounds || !this._pxBounds.intersects(t))) {
            if (this.options.noClip) {
              this._parts = this._rings;
              return;
            }
            var e = this._parts, i, o, s, c, d, f, p;
            for (i = 0, s = 0, c = this._rings.length; i < c; i++)
              for (p = this._rings[i], o = 0, d = p.length; o < d - 1; o++)
                f = oo(p[o], p[o + 1], t, o, !0), f && (e[s] = e[s] || [], e[s].push(f[0]), (f[1] !== p[o + 1] || o === d - 2) && (e[s].push(f[1]), s++));
          }
        },
        // simplify each clipped part of the polyline for performance
        _simplifyPoints: function() {
          for (var t = this._parts, e = this.options.smoothFactor, i = 0, o = t.length; i < o; i++)
            t[i] = rt(t[i], e);
        },
        _update: function() {
          this._map && (this._clipPoints(), this._simplifyPoints(), this._updatePath());
        },
        _updatePath: function() {
          this._renderer._updatePoly(this);
        },
        // Needed by the `Canvas` renderer for interactivity
        _containsPoint: function(t, e) {
          var i, o, s, c, d, f, p = this._clickTolerance();
          if (!this._pxBounds || !this._pxBounds.contains(t))
            return !1;
          for (i = 0, c = this._parts.length; i < c; i++)
            for (f = this._parts[i], o = 0, d = f.length, s = d - 1; o < d; s = o++)
              if (!(!e && o === 0) && bt(t, f[s], f[o]) <= p)
                return !0;
          return !1;
        }
      });
      function Yo(t, e) {
        return new we(t, e);
      }
      we._flat = ao;
      var xi = we.extend({
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
          return Yi(this._defaultShape(), this._map.options.crs);
        },
        _convertLatLngs: function(t) {
          var e = we.prototype._convertLatLngs.call(this, t), i = e.length;
          return i >= 2 && e[0] instanceof J && e[0].equals(e[i - 1]) && e.pop(), e;
        },
        _setLatLngs: function(t) {
          we.prototype._setLatLngs.call(this, t), ee(this._latlngs) && (this._latlngs = [this._latlngs]);
        },
        _defaultShape: function() {
          return ee(this._latlngs[0]) ? this._latlngs[0] : this._latlngs[0][0];
        },
        _clipPoints: function() {
          var t = this._renderer._bounds, e = this.options.weight, i = new T(e, e);
          if (t = new Y(t.min.subtract(i), t.max.add(i)), this._parts = [], !(!this._pxBounds || !this._pxBounds.intersects(t))) {
            if (this.options.noClip) {
              this._parts = this._rings;
              return;
            }
            for (var o = 0, s = this._rings.length, c; o < s; o++)
              c = $i(this._rings[o], t, !0), c.length && this._parts.push(c);
          }
        },
        _updatePath: function() {
          this._renderer._updatePoly(this, !0);
        },
        // Needed by the `Canvas` renderer for interactivity
        _containsPoint: function(t) {
          var e = !1, i, o, s, c, d, f, p, v;
          if (!this._pxBounds || !this._pxBounds.contains(t))
            return !1;
          for (c = 0, p = this._parts.length; c < p; c++)
            for (i = this._parts[c], d = 0, v = i.length, f = v - 1; d < v; f = d++)
              o = i[d], s = i[f], o.y > t.y != s.y > t.y && t.x < (s.x - o.x) * (t.y - o.y) / (s.y - o.y) + o.x && (e = !e);
          return e || we.prototype._containsPoint.call(this, t, !0);
        }
      });
      function Jo(t, e) {
        return new xi(t, e);
      }
      var xe = be.extend({
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
          lt(this, e), this._layers = {}, t && this.addData(t);
        },
        // @method addData( <GeoJSON> data ): this
        // Adds a GeoJSON object to the layer.
        addData: function(t) {
          var e = Gt(t) ? t : t.features, i, o, s;
          if (e) {
            for (i = 0, o = e.length; i < o; i++)
              s = e[i], (s.geometries || s.geometry || s.features || s.coordinates) && this.addData(s);
            return this;
          }
          var c = this.options;
          if (c.filter && !c.filter(t))
            return this;
          var d = zn(t, c);
          return d ? (d.feature = An(t), d.defaultOptions = d.options, this.resetStyle(d), c.onEachFeature && c.onEachFeature(t, d), this.addLayer(d)) : this;
        },
        // @method resetStyle( <Path> layer? ): this
        // Resets the given vector layer's style to the original GeoJSON style, useful for resetting style after hover events.
        // If `layer` is omitted, the style of all features in the current layer is reset.
        resetStyle: function(t) {
          return t === void 0 ? this.eachLayer(this.resetStyle, this) : (t.options = et({}, t.defaultOptions), this._setLayerStyle(t, this.options.style), this);
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
      function zn(t, e) {
        var i = t.type === "Feature" ? t.geometry : t, o = i ? i.coordinates : null, s = [], c = e && e.pointToLayer, d = e && e.coordsToLatLng || Xn, f, p, v, x;
        if (!o && !i)
          return null;
        switch (i.type) {
          case "Point":
            return f = d(o), uo(c, t, f, e);
          case "MultiPoint":
            for (v = 0, x = o.length; v < x; v++)
              f = d(o[v]), s.push(uo(c, t, f, e));
            return new be(s);
          case "LineString":
          case "MultiLineString":
            return p = On(o, i.type === "LineString" ? 0 : 1, d), new we(p, e);
          case "Polygon":
          case "MultiPolygon":
            return p = On(o, i.type === "Polygon" ? 1 : 2, d), new xi(p, e);
          case "GeometryCollection":
            for (v = 0, x = i.geometries.length; v < x; v++) {
              var I = zn({
                geometry: i.geometries[v],
                type: "Feature",
                properties: t.properties
              }, e);
              I && s.push(I);
            }
            return new be(s);
          case "FeatureCollection":
            for (v = 0, x = i.features.length; v < x; v++) {
              var q = zn(i.features[v], e);
              q && s.push(q);
            }
            return new be(s);
          default:
            throw new Error("Invalid GeoJSON object.");
        }
      }
      function uo(t, e, i, o) {
        return t ? t(e, i) : new Cn(i, o && o.markersInheritOptions && o);
      }
      function Xn(t) {
        return new J(t[1], t[0], t[2]);
      }
      function On(t, e, i) {
        for (var o = [], s = 0, c = t.length, d; s < c; s++)
          d = e ? On(t[s], e - 1, i) : (i || Xn)(t[s]), o.push(d);
        return o;
      }
      function Qn(t, e) {
        return t = Z(t), t.alt !== void 0 ? [ft(t.lng, e), ft(t.lat, e), ft(t.alt, e)] : [ft(t.lng, e), ft(t.lat, e)];
      }
      function En(t, e, i, o) {
        for (var s = [], c = 0, d = t.length; c < d; c++)
          s.push(e ? En(t[c], ee(t[c]) ? 0 : e - 1, i, o) : Qn(t[c], o));
        return !e && i && s.length > 0 && s.push(s[0].slice()), s;
      }
      function Pi(t, e) {
        return t.feature ? et({}, t.feature, { geometry: e }) : An(e);
      }
      function An(t) {
        return t.type === "Feature" || t.type === "FeatureCollection" ? t : {
          type: "Feature",
          properties: {},
          geometry: t
        };
      }
      var to = {
        toGeoJSON: function(t) {
          return Pi(this, {
            type: "Point",
            coordinates: Qn(this.getLatLng(), t)
          });
        }
      };
      Cn.include(to), Jn.include(to), Mn.include(to), we.include({
        toGeoJSON: function(t) {
          var e = !ee(this._latlngs), i = En(this._latlngs, e ? 1 : 0, !1, t);
          return Pi(this, {
            type: (e ? "Multi" : "") + "LineString",
            coordinates: i
          });
        }
      }), xi.include({
        toGeoJSON: function(t) {
          var e = !ee(this._latlngs), i = e && !ee(this._latlngs[0]), o = En(this._latlngs, i ? 2 : e ? 1 : 0, !0, t);
          return e || (o = [o]), Pi(this, {
            type: (i ? "Multi" : "") + "Polygon",
            coordinates: o
          });
        }
      }), bi.include({
        toMultiPoint: function(t) {
          var e = [];
          return this.eachLayer(function(i) {
            e.push(i.toGeoJSON(t).geometry.coordinates);
          }), Pi(this, {
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
          return this.eachLayer(function(s) {
            if (s.toGeoJSON) {
              var c = s.toGeoJSON(t);
              if (i)
                o.push(c.geometry);
              else {
                var d = An(c);
                d.type === "FeatureCollection" ? o.push.apply(o, d.features) : o.push(d);
              }
            }
          }), i ? Pi(this, {
            geometries: o,
            type: "GeometryCollection"
          }) : {
            type: "FeatureCollection",
            features: o
          };
        }
      });
      function co(t, e) {
        return new xe(t, e);
      }
      var Xo = co, Zn = le.extend({
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
          this._url = t, this._bounds = pt(e), lt(this, i);
        },
        onAdd: function() {
          this._image || (this._initImage(), this.options.opacity < 1 && this._updateOpacity()), this.options.interactive && (R(this._image, "leaflet-interactive"), this.addInteractiveTarget(this._image)), this.getPane().appendChild(this._image), this._reset();
        },
        onRemove: function() {
          ht(this._image), this.options.interactive && this.removeInteractiveTarget(this._image);
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
          return this._map && Me(this._image), this;
        },
        // @method bringToBack(): this
        // Brings the layer to the bottom of all overlays.
        bringToBack: function() {
          return this._map && yt(this._image), this;
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
          var t = this._url.tagName === "IMG", e = this._image = t ? this._url : X("img");
          if (R(e, "leaflet-image-layer"), this._zoomAnimated && R(e, "leaflet-zoom-animated"), this.options.className && R(e, this.options.className), e.onselectstart = mt, e.onmousemove = mt, e.onload = $(this.fire, this, "load"), e.onerror = $(this._overlayOnError, this, "error"), (this.options.crossOrigin || this.options.crossOrigin === "") && (e.crossOrigin = this.options.crossOrigin === !0 ? "" : this.options.crossOrigin), this.options.zIndex && this._updateZIndex(), t) {
            this._url = e.src;
            return;
          }
          e.src = this._url, e.alt = this.options.alt;
        },
        _animateZoom: function(t) {
          var e = this._map.getZoomScale(t.zoom), i = this._map._latLngBoundsToNewLayerBounds(this._bounds, t.zoom, t.center).min;
          Ut(this._image, i, e);
        },
        _reset: function() {
          var t = this._image, e = new Y(
            this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
            this._map.latLngToLayerPoint(this._bounds.getSouthEast())
          ), i = e.getSize();
          st(t, e.min), t.style.width = i.x + "px", t.style.height = i.y + "px";
        },
        _updateOpacity: function() {
          Dt(this._image, this.options.opacity);
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
      }), Qo = function(t, e, i) {
        return new Zn(t, e, i);
      }, ho = Zn.extend({
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
          var t = this._url.tagName === "VIDEO", e = this._image = t ? this._url : X("video");
          if (R(e, "leaflet-image-layer"), this._zoomAnimated && R(e, "leaflet-zoom-animated"), this.options.className && R(e, this.options.className), e.onselectstart = mt, e.onmousemove = mt, e.onloadeddata = $(this.fire, this, "load"), t) {
            for (var i = e.getElementsByTagName("source"), o = [], s = 0; s < i.length; s++)
              o.push(i[s].src);
            this._url = i.length > 0 ? o : [e.src];
            return;
          }
          Gt(this._url) || (this._url = [this._url]), !this.options.keepAspectRatio && Object.prototype.hasOwnProperty.call(e.style, "objectFit") && (e.style.objectFit = "fill"), e.autoplay = !!this.options.autoplay, e.loop = !!this.options.loop, e.muted = !!this.options.muted, e.playsInline = !!this.options.playsInline;
          for (var c = 0; c < this._url.length; c++) {
            var d = X("source");
            d.src = this._url[c], e.appendChild(d);
          }
        }
        // @method getElement(): HTMLVideoElement
        // Returns the instance of [`HTMLVideoElement`](https://developer.mozilla.org/docs/Web/API/HTMLVideoElement)
        // used by this overlay.
      });
      function ta(t, e, i) {
        return new ho(t, e, i);
      }
      var fo = Zn.extend({
        _initImage: function() {
          var t = this._image = this._url;
          R(t, "leaflet-image-layer"), this._zoomAnimated && R(t, "leaflet-zoom-animated"), this.options.className && R(t, this.options.className), t.onselectstart = mt, t.onmousemove = mt;
        }
        // @method getElement(): SVGElement
        // Returns the instance of [`SVGElement`](https://developer.mozilla.org/docs/Web/API/SVGElement)
        // used by this overlay.
      });
      function ea(t, e, i) {
        return new fo(t, e, i);
      }
      var fe = le.extend({
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
          t && (t instanceof J || Gt(t)) ? (this._latlng = Z(t), lt(this, e)) : (lt(this, t), this._source = e), this.options.content && (this._content = this.options.content);
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
          this._zoomAnimated = t._zoomAnimated, this._container || this._initLayout(), t._fadeAnimated && Dt(this._container, 0), clearTimeout(this._removeTimeout), this.getPane().appendChild(this._container), this.update(), t._fadeAnimated && Dt(this._container, 1), this.bringToFront(), this.options.interactive && (R(this._container, "leaflet-interactive"), this.addInteractiveTarget(this._container));
        },
        onRemove: function(t) {
          t._fadeAnimated ? (Dt(this._container, 0), this._removeTimeout = setTimeout($(ht, void 0, this._container), 200)) : ht(this._container), this.options.interactive && (V(this._container, "leaflet-interactive"), this.removeInteractiveTarget(this._container));
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
          return this._latlng = Z(t), this._map && (this._updatePosition(), this._adjustPan()), this;
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
          return this._map && Me(this._container), this;
        },
        // @method bringToBack: this
        // Brings this overlay to the back of other overlays (in the same map pane).
        bringToBack: function() {
          return this._map && yt(this._container), this;
        },
        // prepare bound overlay to open: update latlng pos / content source (for FeatureGroup)
        _prepareOpen: function(t) {
          var e = this._source;
          if (!e._map)
            return !1;
          if (e instanceof be) {
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
            this._zoomAnimated ? st(this._container, t.add(i)) : e = e.add(t).add(i);
            var o = this._containerBottom = -e.y, s = this._containerLeft = -Math.round(this._containerWidth / 2) + e.x;
            this._container.style.bottom = o + "px", this._container.style.left = s + "px";
          }
        },
        _getAnchor: function() {
          return [0, 0];
        }
      });
      j.include({
        _initOverlay: function(t, e, i, o) {
          var s = e;
          return s instanceof t || (s = new t(o).setContent(e)), i && s.setLatLng(i), s;
        }
      }), le.include({
        _initOverlay: function(t, e, i, o) {
          var s = i;
          return s instanceof t ? (lt(s, o), s._source = this) : (s = e && !o ? e : new t(o, this), s.setContent(i)), s;
        }
      });
      var In = fe.extend({
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
          return t = arguments.length ? t : this._source._map, !t.hasLayer(this) && t._popup && t._popup.options.autoClose && t.removeLayer(t._popup), t._popup = this, fe.prototype.openOn.call(this, t);
        },
        onAdd: function(t) {
          fe.prototype.onAdd.call(this, t), t.fire("popupopen", { popup: this }), this._source && (this._source.fire("popupopen", { popup: this }, !0), this._source instanceof Ze || this._source.on("preclick", ye));
        },
        onRemove: function(t) {
          fe.prototype.onRemove.call(this, t), t.fire("popupclose", { popup: this }), this._source && (this._source.fire("popupclose", { popup: this }, !0), this._source instanceof Ze || this._source.off("preclick", ye));
        },
        getEvents: function() {
          var t = fe.prototype.getEvents.call(this);
          return (this.options.closeOnClick !== void 0 ? this.options.closeOnClick : this._map.options.closePopupOnClick) && (t.preclick = this.close), this.options.keepInView && (t.moveend = this._adjustPan), t;
        },
        _initLayout: function() {
          var t = "leaflet-popup", e = this._container = X(
            "div",
            t + " " + (this.options.className || "") + " leaflet-zoom-animated"
          ), i = this._wrapper = X("div", t + "-content-wrapper", e);
          if (this._contentNode = X("div", t + "-content", i), he(e), Ee(this._contentNode), N(e, "contextmenu", ye), this._tipContainer = X("div", t + "-tip-container", e), this._tip = X("div", t + "-tip", this._tipContainer), this.options.closeButton) {
            var o = this._closeButton = X("a", t + "-close-button", e);
            o.setAttribute("role", "button"), o.setAttribute("aria-label", "Close popup"), o.href = "#close", o.innerHTML = '<span aria-hidden="true">&#215;</span>', N(o, "click", function(s) {
              kt(s), this.close();
            }, this);
          }
        },
        _updateLayout: function() {
          var t = this._contentNode, e = t.style;
          e.width = "", e.whiteSpace = "nowrap";
          var i = t.offsetWidth;
          i = Math.min(i, this.options.maxWidth), i = Math.max(i, this.options.minWidth), e.width = i + 1 + "px", e.whiteSpace = "", e.height = "";
          var o = t.offsetHeight, s = this.options.maxHeight, c = "leaflet-popup-scrolled";
          s && o > s ? (e.height = s + "px", R(t, c)) : V(t, c), this._containerWidth = this._container.offsetWidth;
        },
        _animateZoom: function(t) {
          var e = this._map._latLngToNewLayerPoint(this._latlng, t.zoom, t.center), i = this._getAnchor();
          st(this._container, e.add(i));
        },
        _adjustPan: function() {
          if (this.options.autoPan) {
            if (this._map._panAnim && this._map._panAnim.stop(), this._autopanning) {
              this._autopanning = !1;
              return;
            }
            var t = this._map, e = parseInt(Ge(this._container, "marginBottom"), 10) || 0, i = this._container.offsetHeight + e, o = this._containerWidth, s = new T(this._containerLeft, -i - this._containerBottom);
            s._add(se(this._container));
            var c = t.layerPointToContainerPoint(s), d = A(this.options.autoPanPadding), f = A(this.options.autoPanPaddingTopLeft || d), p = A(this.options.autoPanPaddingBottomRight || d), v = t.getSize(), x = 0, I = 0;
            c.x + o + p.x > v.x && (x = c.x + o - v.x + p.x), c.x - x - f.x < 0 && (x = c.x - f.x), c.y + i + p.y > v.y && (I = c.y + i - v.y + p.y), c.y - I - f.y < 0 && (I = c.y - f.y), (x || I) && (this.options.keepInView && (this._autopanning = !0), t.fire("autopanstart").panBy([x, I]));
          }
        },
        _getAnchor: function() {
          return A(this._source && this._source._getPopupAnchor ? this._source._getPopupAnchor() : [0, 0]);
        }
      }), ia = function(t, e) {
        return new In(t, e);
      };
      j.mergeOptions({
        closePopupOnClick: !0
      }), j.include({
        // @method openPopup(popup: Popup): this
        // Opens the specified popup while closing the previously opened (to make sure only one is opened at one time for usability).
        // @alternative
        // @method openPopup(content: String|HTMLElement, latlng: LatLng, options?: Popup options): this
        // Creates a popup with the specified content and options and opens it in the given point on a map.
        openPopup: function(t, e, i) {
          return this._initOverlay(In, t, e, i).openOn(this), this;
        },
        // @method closePopup(popup?: Popup): this
        // Closes the popup previously opened with [openPopup](#map-openpopup) (or the given one).
        closePopup: function(t) {
          return t = arguments.length ? t : this._popup, t && t.close(), this;
        }
      }), le.include({
        // @method bindPopup(content: String|HTMLElement|Function|Popup, options?: Popup options): this
        // Binds a popup to the layer with the passed `content` and sets up the
        // necessary event listeners. If a `Function` is passed it will receive
        // the layer as the first argument and should return a `String` or `HTMLElement`.
        bindPopup: function(t, e) {
          return this._popup = this._initOverlay(In, this._popup, t, e), this._popupHandlersAdded || (this.on({
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
          return this._popup && (this instanceof be || (this._popup._source = this), this._popup._prepareOpen(t || this._latlng) && this._popup.openOn(this._map)), this;
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
            G(t);
            var e = t.layer || t.target;
            if (this._popup._source === e && !(e instanceof Ze)) {
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
      var Bn = fe.extend({
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
          fe.prototype.onAdd.call(this, t), this.setOpacity(this.options.opacity), t.fire("tooltipopen", { tooltip: this }), this._source && (this.addEventParent(this._source), this._source.fire("tooltipopen", { tooltip: this }, !0));
        },
        onRemove: function(t) {
          fe.prototype.onRemove.call(this, t), t.fire("tooltipclose", { tooltip: this }), this._source && (this.removeEventParent(this._source), this._source.fire("tooltipclose", { tooltip: this }, !0));
        },
        getEvents: function() {
          var t = fe.prototype.getEvents.call(this);
          return this.options.permanent || (t.preclick = this.close), t;
        },
        _initLayout: function() {
          var t = "leaflet-tooltip", e = t + " " + (this.options.className || "") + " leaflet-zoom-" + (this._zoomAnimated ? "animated" : "hide");
          this._contentNode = this._container = X("div", e), this._container.setAttribute("role", "tooltip"), this._container.setAttribute("id", "leaflet-tooltip-" + H(this));
        },
        _updateLayout: function() {
        },
        _adjustPan: function() {
        },
        _setPosition: function(t) {
          var e, i, o = this._map, s = this._container, c = o.latLngToContainerPoint(o.getCenter()), d = o.layerPointToContainerPoint(t), f = this.options.direction, p = s.offsetWidth, v = s.offsetHeight, x = A(this.options.offset), I = this._getAnchor();
          f === "top" ? (e = p / 2, i = v) : f === "bottom" ? (e = p / 2, i = 0) : f === "center" ? (e = p / 2, i = v / 2) : f === "right" ? (e = 0, i = v / 2) : f === "left" ? (e = p, i = v / 2) : d.x < c.x ? (f = "right", e = 0, i = v / 2) : (f = "left", e = p + (x.x + I.x) * 2, i = v / 2), t = t.subtract(A(e, i, !0)).add(x).add(I), V(s, "leaflet-tooltip-right"), V(s, "leaflet-tooltip-left"), V(s, "leaflet-tooltip-top"), V(s, "leaflet-tooltip-bottom"), R(s, "leaflet-tooltip-" + f), st(s, t);
        },
        _updatePosition: function() {
          var t = this._map.latLngToLayerPoint(this._latlng);
          this._setPosition(t);
        },
        setOpacity: function(t) {
          this.options.opacity = t, this._container && Dt(this._container, t);
        },
        _animateZoom: function(t) {
          var e = this._map._latLngToNewLayerPoint(this._latlng, t.zoom, t.center);
          this._setPosition(e);
        },
        _getAnchor: function() {
          return A(this._source && this._source._getTooltipAnchor && !this.options.sticky ? this._source._getTooltipAnchor() : [0, 0]);
        }
      }), na = function(t, e) {
        return new Bn(t, e);
      };
      j.include({
        // @method openTooltip(tooltip: Tooltip): this
        // Opens the specified tooltip.
        // @alternative
        // @method openTooltip(content: String|HTMLElement, latlng: LatLng, options?: Tooltip options): this
        // Creates a tooltip with the specified content and options and open it.
        openTooltip: function(t, e, i) {
          return this._initOverlay(Bn, t, e, i).openOn(this), this;
        },
        // @method closeTooltip(tooltip: Tooltip): this
        // Closes the tooltip given as parameter.
        closeTooltip: function(t) {
          return t.close(), this;
        }
      }), le.include({
        // @method bindTooltip(content: String|HTMLElement|Function|Tooltip, options?: Tooltip options): this
        // Binds a tooltip to the layer with the passed `content` and sets up the
        // necessary event listeners. If a `Function` is passed it will receive
        // the layer as the first argument and should return a `String` or `HTMLElement`.
        bindTooltip: function(t, e) {
          return this._tooltip && this.isTooltipOpen() && this.unbindTooltip(), this._tooltip = this._initOverlay(Bn, this._tooltip, t, e), this._initTooltipInteractions(), this._tooltip.options.permanent && this._map && this._map.hasLayer(this) && this.openTooltip(), this;
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
          return this._tooltip && (this instanceof be || (this._tooltip._source = this), this._tooltip._prepareOpen(t) && (this._tooltip.openOn(this._map), this.getElement ? this._setAriaDescribedByOnLayer(this) : this.eachLayer && this.eachLayer(this._setAriaDescribedByOnLayer, this))), this;
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
          e && (N(e, "focus", function() {
            this._tooltip._source = t, this.openTooltip();
          }, this), N(e, "blur", this.closeTooltip, this));
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
      var po = wi.extend({
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
          if (i.html instanceof Element ? (qe(e), e.appendChild(i.html)) : e.innerHTML = i.html !== !1 ? i.html : "", i.bgPos) {
            var o = A(i.bgPos);
            e.style.backgroundPosition = -o.x + "px " + -o.y + "px";
          }
          return this._setIconStyles(e, "icon"), e;
        },
        createShadow: function() {
          return null;
        }
      });
      function oa(t) {
        return new po(t);
      }
      wi.Default = Xi;
      var Qi = le.extend({
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
        initialize: function(t) {
          lt(this, t);
        },
        onAdd: function() {
          this._initContainer(), this._levels = {}, this._tiles = {}, this._resetView();
        },
        beforeAdd: function(t) {
          t._addZoomLimit(this);
        },
        onRemove: function(t) {
          this._removeAllTiles(), ht(this._container), t._removeZoomLimit(this), this._container = null, this._tileZoom = void 0;
        },
        // @method bringToFront: this
        // Brings the tile layer to the top of all tile layers.
        bringToFront: function() {
          return this._map && (Me(this._container), this._setAutoZIndex(Math.max)), this;
        },
        // @method bringToBack: this
        // Brings the tile layer to the bottom of all tile layers.
        bringToBack: function() {
          return this._map && (yt(this._container), this._setAutoZIndex(Math.min)), this;
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
          return this.options.updateWhenIdle || (this._onMove || (this._onMove = Bt(this._onMoveEnd, this.options.updateInterval, this)), t.move = this._onMove), this._zoomAnimated && (t.zoomanim = this._animateZoom), t;
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
          return t instanceof T ? t : new T(t, t);
        },
        _updateZIndex: function() {
          this._container && this.options.zIndex !== void 0 && this.options.zIndex !== null && (this._container.style.zIndex = this.options.zIndex);
        },
        _setAutoZIndex: function(t) {
          for (var e = this.getPane().children, i = -t(-1 / 0, 1 / 0), o = 0, s = e.length, c; o < s; o++)
            c = e[o].style.zIndex, e[o] !== this._container && c && (i = t(i, +c));
          isFinite(i) && (this.options.zIndex = i + t(-1, 1), this._updateZIndex());
        },
        _updateOpacity: function() {
          if (this._map && !S.ielt9) {
            Dt(this._container, this.options.opacity);
            var t = +/* @__PURE__ */ new Date(), e = !1, i = !1;
            for (var o in this._tiles) {
              var s = this._tiles[o];
              if (!(!s.current || !s.loaded)) {
                var c = Math.min(1, (t - s.loaded) / 200);
                Dt(s.el, c), c < 1 ? e = !0 : (s.active ? i = !0 : this._onOpaqueTile(s), s.active = !0);
              }
            }
            i && !this._noPrune && this._pruneTiles(), e && (Vt(this._fadeFrame), this._fadeFrame = At(this._updateOpacity, this));
          }
        },
        _onOpaqueTile: mt,
        _initContainer: function() {
          this._container || (this._container = X("div", "leaflet-layer " + (this.options.className || "")), this._updateZIndex(), this.options.opacity < 1 && this._updateOpacity(), this.getPane().appendChild(this._container));
        },
        _updateLevels: function() {
          var t = this._tileZoom, e = this.options.maxZoom;
          if (t !== void 0) {
            for (var i in this._levels)
              i = Number(i), this._levels[i].el.children.length || i === t ? (this._levels[i].el.style.zIndex = e - Math.abs(t - i), this._onUpdateLevel(i)) : (ht(this._levels[i].el), this._removeTilesAtZoom(i), this._onRemoveLevel(i), delete this._levels[i]);
            var o = this._levels[t], s = this._map;
            return o || (o = this._levels[t] = {}, o.el = X("div", "leaflet-tile-container leaflet-zoom-animated", this._container), o.el.style.zIndex = e, o.origin = s.project(s.unproject(s.getPixelOrigin()), t).round(), o.zoom = t, this._setZoomTransform(o, s.getCenter(), s.getZoom()), mt(o.el.offsetWidth), this._onCreateLevel(o)), this._level = o, o;
          }
        },
        _onUpdateLevel: mt,
        _onRemoveLevel: mt,
        _onCreateLevel: mt,
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
            ht(this._levels[t].el), this._onRemoveLevel(Number(t)), delete this._levels[t];
          this._removeAllTiles(), this._tileZoom = void 0;
        },
        _retainParent: function(t, e, i, o) {
          var s = Math.floor(t / 2), c = Math.floor(e / 2), d = i - 1, f = new T(+s, +c);
          f.z = +d;
          var p = this._tileCoordsToKey(f), v = this._tiles[p];
          return v && v.active ? (v.retain = !0, !0) : (v && v.loaded && (v.retain = !0), d > o ? this._retainParent(s, c, d, o) : !1);
        },
        _retainChildren: function(t, e, i, o) {
          for (var s = 2 * t; s < 2 * t + 2; s++)
            for (var c = 2 * e; c < 2 * e + 2; c++) {
              var d = new T(s, c);
              d.z = i + 1;
              var f = this._tileCoordsToKey(d), p = this._tiles[f];
              if (p && p.active) {
                p.retain = !0;
                continue;
              } else p && p.loaded && (p.retain = !0);
              i + 1 < o && this._retainChildren(s, c, i + 1, o);
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
          var s = Math.round(e);
          this.options.maxZoom !== void 0 && s > this.options.maxZoom || this.options.minZoom !== void 0 && s < this.options.minZoom ? s = void 0 : s = this._clampZoom(s);
          var c = this.options.updateWhenZooming && s !== this._tileZoom;
          (!o || c) && (this._tileZoom = s, this._abortLoading && this._abortLoading(), this._updateLevels(), this._resetGrid(), s !== void 0 && this._update(t), i || this._pruneTiles(), this._noPrune = !!i), this._setZoomTransforms(t, e);
        },
        _setZoomTransforms: function(t, e) {
          for (var i in this._levels)
            this._setZoomTransform(this._levels[i], t, e);
        },
        _setZoomTransform: function(t, e, i) {
          var o = this._map.getZoomScale(i, t.zoom), s = t.origin.multiplyBy(o).subtract(this._map._getNewPixelOrigin(e, i)).round();
          S.any3d ? Ut(t.el, s, o) : st(t.el, s);
        },
        _resetGrid: function() {
          var t = this._map, e = t.options.crs, i = this._tileSize = this.getTileSize(), o = this._tileZoom, s = this._map.getPixelWorldBounds(this._tileZoom);
          s && (this._globalTileRange = this._pxBoundsToTileRange(s)), this._wrapX = e.wrapLng && !this.options.noWrap && [
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
          var e = this._map, i = e._animatingZoom ? Math.max(e._animateToZoom, e.getZoom()) : e.getZoom(), o = e.getZoomScale(i, this._tileZoom), s = e.project(t, this._tileZoom).floor(), c = e.getSize().divideBy(o * 2);
          return new Y(s.subtract(c), s.add(c));
        },
        // Private method to load tiles in the grid's active zoom level according to map bounds
        _update: function(t) {
          var e = this._map;
          if (e) {
            var i = this._clampZoom(e.getZoom());
            if (t === void 0 && (t = e.getCenter()), this._tileZoom !== void 0) {
              var o = this._getTiledPixelBounds(t), s = this._pxBoundsToTileRange(o), c = s.getCenter(), d = [], f = this.options.keepBuffer, p = new Y(
                s.getBottomLeft().subtract([f, -f]),
                s.getTopRight().add([f, -f])
              );
              if (!(isFinite(s.min.x) && isFinite(s.min.y) && isFinite(s.max.x) && isFinite(s.max.y)))
                throw new Error("Attempted to load an infinite number of tiles");
              for (var v in this._tiles) {
                var x = this._tiles[v].coords;
                (x.z !== this._tileZoom || !p.contains(new T(x.x, x.y))) && (this._tiles[v].current = !1);
              }
              if (Math.abs(i - this._tileZoom) > 1) {
                this._setView(t, i);
                return;
              }
              for (var I = s.min.y; I <= s.max.y; I++)
                for (var q = s.min.x; q <= s.max.x; q++) {
                  var Rt = new T(q, I);
                  if (Rt.z = this._tileZoom, !!this._isValidTile(Rt)) {
                    var zt = this._tiles[this._tileCoordsToKey(Rt)];
                    zt ? zt.current = !0 : d.push(Rt);
                  }
                }
              if (d.sort(function(Wt, Ti) {
                return Wt.distanceTo(c) - Ti.distanceTo(c);
              }), d.length !== 0) {
                this._loading || (this._loading = !0, this.fire("loading"));
                var ie = document.createDocumentFragment();
                for (q = 0; q < d.length; q++)
                  this._addTile(d[q], ie);
                this._level.el.appendChild(ie);
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
          return pt(this.options.bounds).overlaps(o);
        },
        _keyToBounds: function(t) {
          return this._tileCoordsToBounds(this._keyToTileCoords(t));
        },
        _tileCoordsToNwSe: function(t) {
          var e = this._map, i = this.getTileSize(), o = t.scaleBy(i), s = o.add(i), c = e.unproject(o, t.z), d = e.unproject(s, t.z);
          return [c, d];
        },
        // converts tile coordinates to its geographical bounds
        _tileCoordsToBounds: function(t) {
          var e = this._tileCoordsToNwSe(t), i = new Ct(e[0], e[1]);
          return this.options.noWrap || (i = this._map.wrapLatLngBounds(i)), i;
        },
        // converts tile coordinates to key for the tile cache
        _tileCoordsToKey: function(t) {
          return t.x + ":" + t.y + ":" + t.z;
        },
        // converts tile cache key to coordinates
        _keyToTileCoords: function(t) {
          var e = t.split(":"), i = new T(+e[0], +e[1]);
          return i.z = +e[2], i;
        },
        _removeTile: function(t) {
          var e = this._tiles[t];
          e && (ht(e.el), delete this._tiles[t], this.fire("tileunload", {
            tile: e.el,
            coords: this._keyToTileCoords(t)
          }));
        },
        _initTile: function(t) {
          R(t, "leaflet-tile");
          var e = this.getTileSize();
          t.style.width = e.x + "px", t.style.height = e.y + "px", t.onselectstart = mt, t.onmousemove = mt, S.ielt9 && this.options.opacity < 1 && Dt(t, this.options.opacity);
        },
        _addTile: function(t, e) {
          var i = this._getTilePos(t), o = this._tileCoordsToKey(t), s = this.createTile(this._wrapCoords(t), $(this._tileReady, this, t));
          this._initTile(s), this.createTile.length < 2 && At($(this._tileReady, this, t, null, s)), st(s, i), this._tiles[o] = {
            el: s,
            coords: t,
            current: !0
          }, e.appendChild(s), this.fire("tileloadstart", {
            tile: s,
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
          i = this._tiles[o], i && (i.loaded = +/* @__PURE__ */ new Date(), this._map._fadeAnimated ? (Dt(i.el, 0), Vt(this._fadeFrame), this._fadeFrame = At(this._updateOpacity, this)) : (i.active = !0, this._pruneTiles()), e || (R(i.el, "leaflet-tile-loaded"), this.fire("tileload", {
            tile: i.el,
            coords: t
          })), this._noTilesToLoad() && (this._loading = !1, this.fire("load"), S.ielt9 || !this._map._fadeAnimated ? At(this._pruneTiles, this) : setTimeout($(this._pruneTiles, this), 250)));
        },
        _getTilePos: function(t) {
          return t.scaleBy(this.getTileSize()).subtract(this._level.origin);
        },
        _wrapCoords: function(t) {
          var e = new T(
            this._wrapX ? pe(t.x, this._wrapX) : t.x,
            this._wrapY ? pe(t.y, this._wrapY) : t.y
          );
          return e.z = t.z, e;
        },
        _pxBoundsToTileRange: function(t) {
          var e = this.getTileSize();
          return new Y(
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
      function aa(t) {
        return new Qi(t);
      }
      var Li = Qi.extend({
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
          this._url = t, e = lt(this, e), e.detectRetina && S.retina && e.maxZoom > 0 ? (e.tileSize = Math.floor(e.tileSize / 2), e.zoomReverse ? (e.zoomOffset--, e.minZoom = Math.min(e.maxZoom, e.minZoom + 1)) : (e.zoomOffset++, e.maxZoom = Math.max(e.minZoom, e.maxZoom - 1)), e.minZoom = Math.max(0, e.minZoom)) : e.zoomReverse ? e.minZoom = Math.min(e.maxZoom, e.minZoom) : e.maxZoom = Math.max(e.minZoom, e.maxZoom), typeof e.subdomains == "string" && (e.subdomains = e.subdomains.split("")), this.on("tileunload", this._onTileRemove);
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
          return N(i, "load", $(this._tileOnLoad, this, e, i)), N(i, "error", $(this._tileOnError, this, e, i)), (this.options.crossOrigin || this.options.crossOrigin === "") && (i.crossOrigin = this.options.crossOrigin === !0 ? "" : this.options.crossOrigin), typeof this.options.referrerPolicy == "string" && (i.referrerPolicy = this.options.referrerPolicy), i.alt = "", i.src = this.getTileUrl(t), i;
        },
        // @section Extension methods
        // @uninheritable
        // Layers extending `TileLayer` might reimplement the following method.
        // @method getTileUrl(coords: Object): String
        // Called only internally, returns the URL for a tile given its coordinates.
        // Classes extending `TileLayer` can override this function to provide custom tile URL naming schemes.
        getTileUrl: function(t) {
          var e = {
            r: S.retina ? "@2x" : "",
            s: this._getSubdomain(t),
            x: t.x,
            y: t.y,
            z: this._getZoomForUrl()
          };
          if (this._map && !this._map.options.crs.infinite) {
            var i = this._globalTileRange.max.y - t.y;
            this.options.tms && (e.y = i), e["-y"] = i;
          }
          return Si(this._url, et(e, this.options));
        },
        _tileOnLoad: function(t, e) {
          S.ielt9 ? setTimeout($(t, this, null, e), 0) : t(null, e);
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
            if (this._tiles[t].coords.z !== this._tileZoom && (e = this._tiles[t].el, e.onload = mt, e.onerror = mt, !e.complete)) {
              e.src = Xe;
              var i = this._tiles[t].coords;
              ht(e), delete this._tiles[t], this.fire("tileabort", {
                tile: e,
                coords: i
              });
            }
        },
        _removeTile: function(t) {
          var e = this._tiles[t];
          if (e)
            return e.el.setAttribute("src", Xe), Qi.prototype._removeTile.call(this, t);
        },
        _tileReady: function(t, e, i) {
          if (!(!this._map || i && i.getAttribute("src") === Xe))
            return Qi.prototype._tileReady.call(this, t, e, i);
        }
      });
      function mo(t, e) {
        return new Li(t, e);
      }
      var _o = Li.extend({
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
          var i = et({}, this.defaultWmsParams);
          for (var o in e)
            o in this.options || (i[o] = e[o]);
          e = lt(this, e);
          var s = e.detectRetina && S.retina ? 2 : 1, c = this.getTileSize();
          i.width = c.x * s, i.height = c.y * s, this.wmsParams = i;
        },
        onAdd: function(t) {
          this._crs = this.options.crs || t.options.crs, this._wmsVersion = parseFloat(this.wmsParams.version);
          var e = this._wmsVersion >= 1.3 ? "crs" : "srs";
          this.wmsParams[e] = this._crs.code, Li.prototype.onAdd.call(this, t);
        },
        getTileUrl: function(t) {
          var e = this._tileCoordsToNwSe(t), i = this._crs, o = Ot(i.project(e[0]), i.project(e[1])), s = o.min, c = o.max, d = (this._wmsVersion >= 1.3 && this._crs === ro ? [s.y, s.x, c.y, c.x] : [s.x, s.y, c.x, c.y]).join(","), f = Li.prototype.getTileUrl.call(this, t);
          return f + an(this.wmsParams, f, this.options.uppercase) + (this.options.uppercase ? "&BBOX=" : "&bbox=") + d;
        },
        // @method setParams(params: Object, noRedraw?: Boolean): this
        // Merges an object with the new parameters and re-requests tiles on the current screen (unless `noRedraw` was set to true).
        setParams: function(t, e) {
          return et(this.wmsParams, t), e || this.redraw(), this;
        }
      });
      function sa(t, e) {
        return new _o(t, e);
      }
      Li.WMS = _o, mo.wms = sa;
      var Pe = le.extend({
        // @section
        // @aka Renderer options
        options: {
          // @option padding: Number = 0.1
          // How much to extend the clip area around the map view (relative to its size)
          // e.g. 0.1 would be 10% of map view in each direction
          padding: 0.1
        },
        initialize: function(t) {
          lt(this, t), H(this), this._layers = this._layers || {};
        },
        onAdd: function() {
          this._container || (this._initContainer(), R(this._container, "leaflet-zoom-animated")), this.getPane().appendChild(this._container), this._update(), this.on("update", this._updatePaths, this);
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
          var i = this._map.getZoomScale(e, this._zoom), o = this._map.getSize().multiplyBy(0.5 + this.options.padding), s = this._map.project(this._center, e), c = o.multiplyBy(-i).add(s).subtract(this._map._getNewPixelOrigin(t, e));
          S.any3d ? Ut(this._container, c, i) : st(this._container, c);
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
          this._bounds = new Y(i, i.add(e.multiplyBy(1 + t * 2)).round()), this._center = this._map.getCenter(), this._zoom = this._map.getZoom();
        }
      }), vo = Pe.extend({
        // @section
        // @aka Canvas options
        options: {
          // @option tolerance: Number = 0
          // How much to extend the click tolerance around a path/object on the map.
          tolerance: 0
        },
        getEvents: function() {
          var t = Pe.prototype.getEvents.call(this);
          return t.viewprereset = this._onViewPreReset, t;
        },
        _onViewPreReset: function() {
          this._postponeUpdatePaths = !0;
        },
        onAdd: function() {
          Pe.prototype.onAdd.call(this), this._draw();
        },
        _initContainer: function() {
          var t = this._container = document.createElement("canvas");
          N(t, "mousemove", this._onMouseMove, this), N(t, "click dblclick mousedown mouseup contextmenu", this._onClick, this), N(t, "mouseout", this._handleMouseOut, this), t._leaflet_disable_events = !0, this._ctx = t.getContext("2d");
        },
        _destroyContainer: function() {
          Vt(this._redrawRequest), delete this._ctx, ht(this._container), ot(this._container), delete this._container;
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
            Pe.prototype._update.call(this);
            var t = this._bounds, e = this._container, i = t.getSize(), o = S.retina ? 2 : 1;
            st(e, t.min), e.width = o * i.x, e.height = o * i.y, e.style.width = i.x + "px", e.style.height = i.y + "px", S.retina && this._ctx.scale(2, 2), this._ctx.translate(-t.min.x, -t.min.y), this.fire("update");
          }
        },
        _reset: function() {
          Pe.prototype._reset.call(this), this._postponeUpdatePaths && (this._postponeUpdatePaths = !1, this._updatePaths());
        },
        _initPath: function(t) {
          this._updateDashArray(t), this._layers[H(t)] = t;
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
          i ? i.prev = o : this._drawLast = o, o ? o.next = i : this._drawFirst = i, delete t._order, delete this._layers[H(t)], this._requestRedraw(t);
        },
        _updatePath: function(t) {
          this._extendRedrawBounds(t), t._project(), t._update(), this._requestRedraw(t);
        },
        _updateStyle: function(t) {
          this._updateDashArray(t), this._requestRedraw(t);
        },
        _updateDashArray: function(t) {
          if (typeof t.options.dashArray == "string") {
            var e = t.options.dashArray.split(/[, ]+/), i = [], o, s;
            for (s = 0; s < e.length; s++) {
              if (o = Number(e[s]), isNaN(o))
                return;
              i.push(o);
            }
            t.options._dashArray = i;
          } else
            t.options._dashArray = t.options.dashArray;
        },
        _requestRedraw: function(t) {
          this._map && (this._extendRedrawBounds(t), this._redrawRequest = this._redrawRequest || At(this._redraw, this));
        },
        _extendRedrawBounds: function(t) {
          if (t._pxBounds) {
            var e = (t.options.weight || 0) + 1;
            this._redrawBounds = this._redrawBounds || new Y(), this._redrawBounds.extend(t._pxBounds.min.subtract([e, e])), this._redrawBounds.extend(t._pxBounds.max.add([e, e]));
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
            var i, o, s, c, d = t._parts, f = d.length, p = this._ctx;
            if (f) {
              for (p.beginPath(), i = 0; i < f; i++) {
                for (o = 0, s = d[i].length; o < s; o++)
                  c = d[i][o], p[o ? "lineTo" : "moveTo"](c.x, c.y);
                e && p.closePath();
              }
              this._fillStroke(p, t);
            }
          }
        },
        _updateCircle: function(t) {
          if (!(!this._drawing || t._empty())) {
            var e = t._point, i = this._ctx, o = Math.max(Math.round(t._radius), 1), s = (Math.max(Math.round(t._radiusY), 1) || o) / o;
            s !== 1 && (i.save(), i.scale(1, s)), i.beginPath(), i.arc(e.x, e.y / s, o, 0, Math.PI * 2, !1), s !== 1 && i.restore(), this._fillStroke(i, t);
          }
        },
        _fillStroke: function(t, e) {
          var i = e.options;
          i.fill && (t.globalAlpha = i.fillOpacity, t.fillStyle = i.fillColor || i.color, t.fill(i.fillRule || "evenodd")), i.stroke && i.weight !== 0 && (t.setLineDash && t.setLineDash(e.options && e.options._dashArray || []), t.globalAlpha = i.opacity, t.lineWidth = i.weight, t.strokeStyle = i.color, t.lineCap = i.lineCap, t.lineJoin = i.lineJoin, t.stroke());
        },
        // Canvas obviously doesn't have mouse events for individual drawn objects,
        // so we emulate that by calculating what's under the mouse on mousemove/click manually
        _onClick: function(t) {
          for (var e = this._map.mouseEventToLayerPoint(t), i, o, s = this._drawFirst; s; s = s.next)
            i = s.layer, i.options.interactive && i._containsPoint(e) && (!(t.type === "click" || t.type === "preclick") || !this._map._draggableMoved(i)) && (o = i);
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
          e && (V(this._container, "leaflet-interactive"), this._fireEvent([e], t, "mouseout"), this._hoveredLayer = null, this._mouseHoverThrottled = !1);
        },
        _handleMouseHover: function(t, e) {
          if (!this._mouseHoverThrottled) {
            for (var i, o, s = this._drawFirst; s; s = s.next)
              i = s.layer, i.options.interactive && i._containsPoint(e) && (o = i);
            o !== this._hoveredLayer && (this._handleMouseOut(t), o && (R(this._container, "leaflet-interactive"), this._fireEvent([o], t, "mouseover"), this._hoveredLayer = o)), this._fireEvent(this._hoveredLayer ? [this._hoveredLayer] : !1, t), this._mouseHoverThrottled = !0, setTimeout($(function() {
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
      function go(t) {
        return S.canvas ? new vo(t) : null;
      }
      var tn = (function() {
        try {
          return document.namespaces.add("lvml", "urn:schemas-microsoft-com:vml"), function(t) {
            return document.createElement("<lvml:" + t + ' class="lvml">');
          };
        } catch {
        }
        return function(t) {
          return document.createElement("<" + t + ' xmlns="urn:schemas-microsoft.com:vml" class="lvml">');
        };
      })(), ra = {
        _initContainer: function() {
          this._container = X("div", "leaflet-vml-container");
        },
        _update: function() {
          this._map._animatingZoom || (Pe.prototype._update.call(this), this.fire("update"));
        },
        _initPath: function(t) {
          var e = t._container = tn("shape");
          R(e, "leaflet-vml-shape " + (this.options.className || "")), e.coordsize = "1 1", t._path = tn("path"), e.appendChild(t._path), this._updateStyle(t), this._layers[H(t)] = t;
        },
        _addPath: function(t) {
          var e = t._container;
          this._container.appendChild(e), t.options.interactive && t.addInteractiveTarget(e);
        },
        _removePath: function(t) {
          var e = t._container;
          ht(e), t.removeInteractiveTarget(e), delete this._layers[H(t)];
        },
        _updateStyle: function(t) {
          var e = t._stroke, i = t._fill, o = t.options, s = t._container;
          s.stroked = !!o.stroke, s.filled = !!o.fill, o.stroke ? (e || (e = t._stroke = tn("stroke")), s.appendChild(e), e.weight = o.weight + "px", e.color = o.color, e.opacity = o.opacity, o.dashArray ? e.dashStyle = Gt(o.dashArray) ? o.dashArray.join(" ") : o.dashArray.replace(/( *, *)/g, " ") : e.dashStyle = "", e.endcap = o.lineCap.replace("butt", "flat"), e.joinstyle = o.lineJoin) : e && (s.removeChild(e), t._stroke = null), o.fill ? (i || (i = t._fill = tn("fill")), s.appendChild(i), i.color = o.fillColor || o.color, i.opacity = o.fillOpacity) : i && (s.removeChild(i), t._fill = null);
        },
        _updateCircle: function(t) {
          var e = t._point.round(), i = Math.round(t._radius), o = Math.round(t._radiusY || i);
          this._setPath(t, t._empty() ? "M0 0" : "AL " + e.x + "," + e.y + " " + i + "," + o + " 0," + 65535 * 360);
        },
        _setPath: function(t, e) {
          t._path.v = e;
        },
        _bringToFront: function(t) {
          Me(t._container);
        },
        _bringToBack: function(t) {
          yt(t._container);
        }
      }, Nn = S.vml ? tn : ln, en = Pe.extend({
        _initContainer: function() {
          this._container = Nn("svg"), this._container.setAttribute("pointer-events", "none"), this._rootGroup = Nn("g"), this._container.appendChild(this._rootGroup);
        },
        _destroyContainer: function() {
          ht(this._container), ot(this._container), delete this._container, delete this._rootGroup, delete this._svgSize;
        },
        _update: function() {
          if (!(this._map._animatingZoom && this._bounds)) {
            Pe.prototype._update.call(this);
            var t = this._bounds, e = t.getSize(), i = this._container;
            (!this._svgSize || !this._svgSize.equals(e)) && (this._svgSize = e, i.setAttribute("width", e.x), i.setAttribute("height", e.y)), st(i, t.min), i.setAttribute("viewBox", [t.min.x, t.min.y, e.x, e.y].join(" ")), this.fire("update");
          }
        },
        // methods below are called by vector layers implementations
        _initPath: function(t) {
          var e = t._path = Nn("path");
          t.options.className && R(e, t.options.className), t.options.interactive && R(e, "leaflet-interactive"), this._updateStyle(t), this._layers[H(t)] = t;
        },
        _addPath: function(t) {
          this._rootGroup || this._initContainer(), this._rootGroup.appendChild(t._path), t.addInteractiveTarget(t._path);
        },
        _removePath: function(t) {
          ht(t._path), t.removeInteractiveTarget(t._path), delete this._layers[H(t)];
        },
        _updatePath: function(t) {
          t._project(), t._update();
        },
        _updateStyle: function(t) {
          var e = t._path, i = t.options;
          e && (i.stroke ? (e.setAttribute("stroke", i.color), e.setAttribute("stroke-opacity", i.opacity), e.setAttribute("stroke-width", i.weight), e.setAttribute("stroke-linecap", i.lineCap), e.setAttribute("stroke-linejoin", i.lineJoin), i.dashArray ? e.setAttribute("stroke-dasharray", i.dashArray) : e.removeAttribute("stroke-dasharray"), i.dashOffset ? e.setAttribute("stroke-dashoffset", i.dashOffset) : e.removeAttribute("stroke-dashoffset")) : e.setAttribute("stroke", "none"), i.fill ? (e.setAttribute("fill", i.fillColor || i.color), e.setAttribute("fill-opacity", i.fillOpacity), e.setAttribute("fill-rule", i.fillRule || "evenodd")) : e.setAttribute("fill", "none"));
        },
        _updatePoly: function(t, e) {
          this._setPath(t, ne(t._parts, e));
        },
        _updateCircle: function(t) {
          var e = t._point, i = Math.max(Math.round(t._radius), 1), o = Math.max(Math.round(t._radiusY), 1) || i, s = "a" + i + "," + o + " 0 1,0 ", c = t._empty() ? "M0 0" : "M" + (e.x - i) + "," + e.y + s + i * 2 + ",0 " + s + -i * 2 + ",0 ";
          this._setPath(t, c);
        },
        _setPath: function(t, e) {
          t._path.setAttribute("d", e);
        },
        // SVG does not have the concept of zIndex so we resort to changing the DOM order of elements
        _bringToFront: function(t) {
          Me(t._path);
        },
        _bringToBack: function(t) {
          yt(t._path);
        }
      });
      S.vml && en.include(ra);
      function yo(t) {
        return S.svg || S.vml ? new en(t) : null;
      }
      j.include({
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
          return this.options.preferCanvas && go(t) || yo(t);
        }
      });
      var bo = xi.extend({
        initialize: function(t, e) {
          xi.prototype.initialize.call(this, this._boundsToLatLngs(t), e);
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
      function la(t, e) {
        return new bo(t, e);
      }
      en.create = Nn, en.pointsToPath = ne, xe.geometryToLayer = zn, xe.coordsToLatLng = Xn, xe.coordsToLatLngs = On, xe.latLngToCoords = Qn, xe.latLngsToCoords = En, xe.getFeature = Pi, xe.asFeature = An, j.mergeOptions({
        // @option boxZoom: Boolean = true
        // Whether the map can be zoomed to a rectangular area specified by
        // dragging the mouse while pressing the shift key.
        boxZoom: !0
      });
      var wo = D.extend({
        initialize: function(t) {
          this._map = t, this._container = t._container, this._pane = t._panes.overlayPane, this._resetStateTimeout = 0, t.on("unload", this._destroy, this);
        },
        addHooks: function() {
          N(this._container, "mousedown", this._onMouseDown, this);
        },
        removeHooks: function() {
          ot(this._container, "mousedown", this._onMouseDown, this);
        },
        moved: function() {
          return this._moved;
        },
        _destroy: function() {
          ht(this._pane), delete this._pane;
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
          this._clearDeferredResetState(), this._resetState(), Ft(), Mt(), this._startPoint = this._map.mouseEventToContainerPoint(t), N(document, {
            contextmenu: G,
            mousemove: this._onMouseMove,
            mouseup: this._onMouseUp,
            keydown: this._onKeyDown
          }, this);
        },
        _onMouseMove: function(t) {
          this._moved || (this._moved = !0, this._box = X("div", "leaflet-zoom-box", this._container), R(this._container, "leaflet-crosshair"), this._map.fire("boxzoomstart")), this._point = this._map.mouseEventToContainerPoint(t);
          var e = new Y(this._point, this._startPoint), i = e.getSize();
          st(this._box, e.min), this._box.style.width = i.x + "px", this._box.style.height = i.y + "px";
        },
        _finish: function() {
          this._moved && (ht(this._box), V(this._container, "leaflet-crosshair")), je(), Ht(), ot(document, {
            contextmenu: G,
            mousemove: this._onMouseMove,
            mouseup: this._onMouseUp,
            keydown: this._onKeyDown
          }, this);
        },
        _onMouseUp: function(t) {
          if (!(t.which !== 1 && t.button !== 1) && (this._finish(), !!this._moved)) {
            this._clearDeferredResetState(), this._resetStateTimeout = setTimeout($(this._resetState, this), 0);
            var e = new Ct(
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
      j.addInitHook("addHandler", "boxZoom", wo), j.mergeOptions({
        // @option doubleClickZoom: Boolean|String = true
        // Whether the map can be zoomed in by double clicking on it and
        // zoomed out by double clicking while holding shift. If passed
        // `'center'`, double-click zoom will zoom to the center of the
        //  view regardless of where the mouse was.
        doubleClickZoom: !0
      });
      var xo = D.extend({
        addHooks: function() {
          this._map.on("dblclick", this._onDoubleClick, this);
        },
        removeHooks: function() {
          this._map.off("dblclick", this._onDoubleClick, this);
        },
        _onDoubleClick: function(t) {
          var e = this._map, i = e.getZoom(), o = e.options.zoomDelta, s = t.originalEvent.shiftKey ? i - o : i + o;
          e.options.doubleClickZoom === "center" ? e.setZoom(s) : e.setZoomAround(t.containerPoint, s);
        }
      });
      j.addInitHook("addHandler", "doubleClickZoom", xo), j.mergeOptions({
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
      var Po = D.extend({
        addHooks: function() {
          if (!this._draggable) {
            var t = this._map;
            this._draggable = new re(t._mapPane, t._container), this._draggable.on({
              dragstart: this._onDragStart,
              drag: this._onDrag,
              dragend: this._onDragEnd
            }, this), this._draggable.on("predrag", this._onPreDragLimit, this), t.options.worldCopyJump && (this._draggable.on("predrag", this._onPreDragWrap, this), t.on("zoomend", this._onZoomEnd, this), t.whenReady(this._onZoomEnd, this));
          }
          R(this._map._container, "leaflet-grab leaflet-touch-drag"), this._draggable.enable(), this._positions = [], this._times = [];
        },
        removeHooks: function() {
          V(this._map._container, "leaflet-grab"), V(this._map._container, "leaflet-touch-drag"), this._draggable.disable();
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
            this._offsetLimit = Ot(
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
          var t = this._worldWidth, e = Math.round(t / 2), i = this._initialWorldOffset, o = this._draggable._newPos.x, s = (o - e + i) % t + e - i, c = (o + e + i) % t - e - i, d = Math.abs(s + i) < Math.abs(c + i) ? s : c;
          this._draggable._absPos = this._draggable._newPos.clone(), this._draggable._newPos.x = d;
        },
        _onDragEnd: function(t) {
          var e = this._map, i = e.options, o = !i.inertia || t.noInertia || this._times.length < 2;
          if (e.fire("dragend", t), o)
            e.fire("moveend");
          else {
            this._prunePositions(+/* @__PURE__ */ new Date());
            var s = this._lastPos.subtract(this._positions[0]), c = (this._lastTime - this._times[0]) / 1e3, d = i.easeLinearity, f = s.multiplyBy(d / c), p = f.distanceTo([0, 0]), v = Math.min(i.inertiaMaxSpeed, p), x = f.multiplyBy(v / p), I = v / (i.inertiaDeceleration * d), q = x.multiplyBy(-I / 2).round();
            !q.x && !q.y ? e.fire("moveend") : (q = e._limitOffset(q, e.options.maxBounds), At(function() {
              e.panBy(q, {
                duration: I,
                easeLinearity: d,
                noMoveStart: !0,
                animate: !0
              });
            }));
          }
        }
      });
      j.addInitHook("addHandler", "dragging", Po), j.mergeOptions({
        // @option keyboard: Boolean = true
        // Makes the map focusable and allows users to navigate the map with keyboard
        // arrows and `+`/`-` keys.
        keyboard: !0,
        // @option keyboardPanDelta: Number = 80
        // Amount of pixels to pan when pressing an arrow key.
        keyboardPanDelta: 80
      });
      var Lo = D.extend({
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
          t.tabIndex <= 0 && (t.tabIndex = "0"), N(t, {
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
          var e = this._panKeys = {}, i = this.keyCodes, o, s;
          for (o = 0, s = i.left.length; o < s; o++)
            e[i.left[o]] = [-1 * t, 0];
          for (o = 0, s = i.right.length; o < s; o++)
            e[i.right[o]] = [t, 0];
          for (o = 0, s = i.down.length; o < s; o++)
            e[i.down[o]] = [0, t];
          for (o = 0, s = i.up.length; o < s; o++)
            e[i.up[o]] = [0, -1 * t];
        },
        _setZoomDelta: function(t) {
          var e = this._zoomKeys = {}, i = this.keyCodes, o, s;
          for (o = 0, s = i.zoomIn.length; o < s; o++)
            e[i.zoomIn[o]] = t;
          for (o = 0, s = i.zoomOut.length; o < s; o++)
            e[i.zoomOut[o]] = -t;
        },
        _addHooks: function() {
          N(document, "keydown", this._onKeyDown, this);
        },
        _removeHooks: function() {
          ot(document, "keydown", this._onKeyDown, this);
        },
        _onKeyDown: function(t) {
          if (!(t.altKey || t.ctrlKey || t.metaKey)) {
            var e = t.keyCode, i = this._map, o;
            if (e in this._panKeys) {
              if (!i._panAnim || !i._panAnim._inProgress)
                if (o = this._panKeys[e], t.shiftKey && (o = A(o).multiplyBy(3)), i.options.maxBounds && (o = i._limitOffset(A(o), i.options.maxBounds)), i.options.worldCopyJump) {
                  var s = i.wrapLatLng(i.unproject(i.project(i.getCenter()).add(o)));
                  i.panTo(s);
                } else
                  i.panBy(o);
            } else if (e in this._zoomKeys)
              i.setZoom(i.getZoom() + (t.shiftKey ? 3 : 1) * this._zoomKeys[e]);
            else if (e === 27 && i._popup && i._popup.options.closeOnEscapeKey)
              i.closePopup();
            else
              return;
            G(t);
          }
        }
      });
      j.addInitHook("addHandler", "keyboard", Lo), j.mergeOptions({
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
      var To = D.extend({
        addHooks: function() {
          N(this._map._container, "wheel", this._onWheelScroll, this), this._delta = 0;
        },
        removeHooks: function() {
          ot(this._map._container, "wheel", this._onWheelScroll, this);
        },
        _onWheelScroll: function(t) {
          var e = m(t), i = this._map.options.wheelDebounceTime;
          this._delta += e, this._lastMousePos = this._map.mouseEventToContainerPoint(t), this._startTime || (this._startTime = +/* @__PURE__ */ new Date());
          var o = Math.max(i - (+/* @__PURE__ */ new Date() - this._startTime), 0);
          clearTimeout(this._timer), this._timer = setTimeout($(this._performZoom, this), o), G(t);
        },
        _performZoom: function() {
          var t = this._map, e = t.getZoom(), i = this._map.options.zoomSnap || 0;
          t._stop();
          var o = this._delta / (this._map.options.wheelPxPerZoomLevel * 4), s = 4 * Math.log(2 / (1 + Math.exp(-Math.abs(o)))) / Math.LN2, c = i ? Math.ceil(s / i) * i : s, d = t._limitZoom(e + (this._delta > 0 ? c : -c)) - e;
          this._delta = 0, this._startTime = null, d && (t.options.scrollWheelZoom === "center" ? t.setZoom(e + d) : t.setZoomAround(this._lastMousePos, e + d));
        }
      });
      j.addInitHook("addHandler", "scrollWheelZoom", To);
      var ua = 600;
      j.mergeOptions({
        // @section Touch interaction options
        // @option tapHold: Boolean
        // Enables simulation of `contextmenu` event, default is `true` for mobile Safari.
        tapHold: S.touchNative && S.safari && S.mobile,
        // @option tapTolerance: Number = 15
        // The max number of pixels a user can shift his finger during touch
        // for it to be considered a valid tap.
        tapTolerance: 15
      });
      var ko = D.extend({
        addHooks: function() {
          N(this._map._container, "touchstart", this._onDown, this);
        },
        removeHooks: function() {
          ot(this._map._container, "touchstart", this._onDown, this);
        },
        _onDown: function(t) {
          if (clearTimeout(this._holdTimeout), t.touches.length === 1) {
            var e = t.touches[0];
            this._startPos = this._newPos = new T(e.clientX, e.clientY), this._holdTimeout = setTimeout($(function() {
              this._cancel(), this._isTapValid() && (N(document, "touchend", kt), N(document, "touchend touchcancel", this._cancelClickPrevent), this._simulateEvent("contextmenu", e));
            }, this), ua), N(document, "touchend touchcancel contextmenu", this._cancel, this), N(document, "touchmove", this._onMove, this);
          }
        },
        _cancelClickPrevent: function t() {
          ot(document, "touchend", kt), ot(document, "touchend touchcancel", t);
        },
        _cancel: function() {
          clearTimeout(this._holdTimeout), ot(document, "touchend touchcancel contextmenu", this._cancel, this), ot(document, "touchmove", this._onMove, this);
        },
        _onMove: function(t) {
          var e = t.touches[0];
          this._newPos = new T(e.clientX, e.clientY);
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
      j.addInitHook("addHandler", "tapHold", ko), j.mergeOptions({
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
      var So = D.extend({
        addHooks: function() {
          R(this._map._container, "leaflet-touch-zoom"), N(this._map._container, "touchstart", this._onTouchStart, this);
        },
        removeHooks: function() {
          V(this._map._container, "leaflet-touch-zoom"), ot(this._map._container, "touchstart", this._onTouchStart, this);
        },
        _onTouchStart: function(t) {
          var e = this._map;
          if (!(!t.touches || t.touches.length !== 2 || e._animatingZoom || this._zooming)) {
            var i = e.mouseEventToContainerPoint(t.touches[0]), o = e.mouseEventToContainerPoint(t.touches[1]);
            this._centerPoint = e.getSize()._divideBy(2), this._startLatLng = e.containerPointToLatLng(this._centerPoint), e.options.touchZoom !== "center" && (this._pinchStartLatLng = e.containerPointToLatLng(i.add(o)._divideBy(2))), this._startDist = i.distanceTo(o), this._startZoom = e.getZoom(), this._moved = !1, this._zooming = !0, e._stop(), N(document, "touchmove", this._onTouchMove, this), N(document, "touchend touchcancel", this._onTouchEnd, this), kt(t);
          }
        },
        _onTouchMove: function(t) {
          if (!(!t.touches || t.touches.length !== 2 || !this._zooming)) {
            var e = this._map, i = e.mouseEventToContainerPoint(t.touches[0]), o = e.mouseEventToContainerPoint(t.touches[1]), s = i.distanceTo(o) / this._startDist;
            if (this._zoom = e.getScaleZoom(s, this._startZoom), !e.options.bounceAtZoomLimits && (this._zoom < e.getMinZoom() && s < 1 || this._zoom > e.getMaxZoom() && s > 1) && (this._zoom = e._limitZoom(this._zoom)), e.options.touchZoom === "center") {
              if (this._center = this._startLatLng, s === 1)
                return;
            } else {
              var c = i._add(o)._divideBy(2)._subtract(this._centerPoint);
              if (s === 1 && c.x === 0 && c.y === 0)
                return;
              this._center = e.unproject(e.project(this._pinchStartLatLng, this._zoom).subtract(c), this._zoom);
            }
            this._moved || (e._moveStart(!0, !1), this._moved = !0), Vt(this._animRequest);
            var d = $(e._move, e, this._center, this._zoom, { pinch: !0, round: !1 }, void 0);
            this._animRequest = At(d, this, !0), kt(t);
          }
        },
        _onTouchEnd: function() {
          if (!this._moved || !this._zooming) {
            this._zooming = !1;
            return;
          }
          this._zooming = !1, Vt(this._animRequest), ot(document, "touchmove", this._onTouchMove, this), ot(document, "touchend touchcancel", this._onTouchEnd, this), this._map.options.zoomAnimation ? this._map._animateZoom(this._center, this._map._limitZoom(this._zoom), !0, this._map.options.zoomSnap) : this._map._resetView(this._center, this._map._limitZoom(this._zoom));
        }
      });
      j.addInitHook("addHandler", "touchZoom", So), j.BoxZoom = wo, j.DoubleClickZoom = xo, j.Drag = Po, j.Keyboard = Lo, j.ScrollWheelZoom = To, j.TapHold = ko, j.TouchZoom = So, a.Bounds = Y, a.Browser = S, a.CRS = ut, a.Canvas = vo, a.Circle = Jn, a.CircleMarker = Mn, a.Class = Kt, a.Control = qt, a.DivIcon = po, a.DivOverlay = fe, a.DomEvent = qn, a.DomUtil = ge, a.Draggable = re, a.Evented = Be, a.FeatureGroup = be, a.GeoJSON = xe, a.GridLayer = Qi, a.Handler = D, a.Icon = wi, a.ImageOverlay = Zn, a.LatLng = J, a.LatLngBounds = Ct, a.Layer = le, a.LayerGroup = bi, a.LineUtil = Vo, a.Map = j, a.Marker = Cn, a.Mixin = it, a.Path = Ze, a.Point = T, a.PolyUtil = nt, a.Polygon = xi, a.Polyline = we, a.Popup = In, a.PosAnimation = Tn, a.Projection = Uo, a.Rectangle = bo, a.Renderer = Pe, a.SVG = en, a.SVGOverlay = fo, a.TileLayer = Li, a.Tooltip = Bn, a.Transformation = Ai, a.Util = Rn, a.VideoOverlay = ho, a.bind = $, a.bounds = Ot, a.canvas = go, a.circle = $o, a.circleMarker = Ko, a.control = Ke, a.divIcon = oa, a.extend = et, a.featureGroup = Go, a.geoJSON = co, a.geoJson = Xo, a.gridLayer = aa, a.icon = qo, a.imageOverlay = Qo, a.latLng = Z, a.latLngBounds = pt, a.layerGroup = Wo, a.map = jn, a.marker = jo, a.point = A, a.polygon = Jo, a.polyline = Yo, a.popup = ia, a.rectangle = la, a.setOptions = lt, a.stamp = H, a.svg = yo, a.svgOverlay = ea, a.tileLayer = mo, a.tooltip = na, a.transformation = Te, a.version = gt, a.videoOverlay = ta;
      var ca = window.L;
      a.noConflict = function() {
        return window.L = ca, this;
      }, window.L = a;
    }));
  })(on, on.exports)), on.exports;
}
var Ea = Oa();
const O = /* @__PURE__ */ Ma(Ea), Aa = { class: "hero" }, Za = { class: "hero-main" }, Ia = { class: "hero-copy" }, Ba = { class: "sub" }, Na = { class: "hero-actions" }, Da = ["disabled"], Ra = ["disabled"], Va = ["disabled"], Ua = { class: "state-row" }, Fa = { class: "pill soft" }, Ha = { class: "pill soft" }, Wa = { class: "pill soft" }, Ga = {
  key: 0,
  class: "banner err"
}, qa = {
  key: 1,
  class: "banner ok"
}, ja = ["aria-label"], Ka = ["onClick"], $a = { class: "tab-ic" }, Ya = {
  "data-panel": "persona",
  class: "panel"
}, Ja = { class: "section-head" }, Xa = { class: "desc" }, Qa = { class: "head-actions" }, ts = ["disabled"], es = ["disabled"], is = { class: "card" }, ns = { class: "settings-grid" }, os = { class: "pfield" }, as = { class: "pfield" }, ss = { class: "pfield" }, rs = { class: "pfield" }, ls = { class: "hint" }, us = {
  key: 0,
  class: "card"
}, cs = { class: "count-pill ok" }, ds = { class: "settings-grid" }, hs = { class: "hint" }, fs = {
  key: 0,
  class: "hint"
}, ps = { class: "settings-grid" }, ms = { class: "settings-grid" }, _s = { class: "pdetails" }, vs = {
  class: "settings-grid",
  style: { "margin-top": "10px" }
}, gs = { class: "settings-grid" }, ys = ["value"], bs = { class: "hint" }, ws = {
  key: 2,
  class: "hint"
}, xs = { class: "settings-grid" }, Ps = ["value"], Ls = { class: "hint" }, Ts = {
  key: 4,
  class: "hint"
}, ks = { class: "settings-grid" }, Ss = ["value"], Cs = { class: "hint" }, Ms = {
  key: 6,
  class: "hint"
}, zs = {
  "data-panel": "cognition",
  class: "panel"
}, Os = { class: "section-head" }, Es = { class: "desc" }, As = { class: "head-actions" }, Zs = ["disabled"], Is = { class: "card" }, Bs = { class: "settings-grid" }, Ns = { class: "cog-metric" }, Ds = { class: "cog-metric" }, Rs = { class: "cog-metric" }, Vs = { class: "cog-metric" }, Us = { class: "cog-metric" }, Fs = { class: "cog-metric" }, Hs = {
  key: 0,
  class: "hint"
}, Ws = {
  key: 1,
  class: "hint"
}, Gs = {
  key: 2,
  class: "hint"
}, qs = { style: { display: "flex", gap: "12px", "align-items": "center", "flex-wrap": "wrap", "margin-top": "10px" } }, js = { class: "sw" }, Ks = ["disabled"], $s = { class: "hint" }, Ys = { class: "card" }, Js = {
  key: 0,
  class: "count-pill sync-pill"
}, Xs = {
  key: 0,
  class: "empty"
}, Qs = { class: "sub-label" }, tr = { class: "hint" }, er = { class: "at-a-glance" }, ir = ["aria-label"], nr = { class: "plot-label plot-n" }, or = { class: "plot-label plot-s" }, ar = { class: "plot-label plot-w" }, sr = { class: "plot-label plot-e" }, rr = {
  class: "mood-plot",
  viewBox: "0 0 120 120",
  "aria-hidden": "true"
}, lr = ["cx", "cy"], ur = ["cx", "cy"], cr = { class: "plot-quadrant" }, dr = { class: "glance-col" }, hr = { class: "glance-title" }, fr = ["title"], pr = { class: "gauge-head" }, mr = { class: "gauge-name" }, _r = { class: "gauge-alias" }, vr = { class: "gauge-val" }, gr = { class: "gauge-effect" }, yr = { class: "glance-col" }, br = { class: "glance-title" }, wr = ["title"], xr = { class: "gauge-head" }, Pr = { class: "gauge-name" }, Lr = { class: "gauge-alias" }, Tr = { class: "gauge-val" }, kr = { class: "gauge-effect" }, Sr = { class: "sub-label" }, Cr = { class: "hint" }, Mr = { class: "gauge-grid" }, zr = ["title"], Or = { class: "gauge-head" }, Er = { class: "gauge-name" }, Ar = { class: "gauge-alias" }, Zr = { class: "gauge-val" }, Ir = { class: "gauge-effect" }, Br = {
  key: 0,
  class: "som-channels"
}, Nr = { class: "som-chan-name" }, Dr = { class: "som-chan-bar" }, Rr = { class: "som-chan-val" }, Vr = {
  key: 0,
  class: "hint"
}, Ur = { class: "sub-label" }, Fr = { class: "hint" }, Hr = { class: "gauge-grid" }, Wr = ["title"], Gr = { class: "gauge-head" }, qr = { class: "gauge-name" }, jr = { class: "gauge-alias" }, Kr = { class: "gauge-val" }, $r = { class: "gauge-effect" }, Yr = { class: "chip-row" }, Jr = { class: "chip muted" }, Xr = { class: "chip muted" }, Qr = { class: "sub-label" }, tl = { class: "hint" }, el = { class: "chip-row" }, il = { class: "chip" }, nl = { class: "chip muted" }, ol = { class: "chip muted" }, al = { class: "gauge-grid" }, sl = ["title"], rl = { class: "gauge-head" }, ll = { class: "gauge-name" }, ul = { class: "gauge-alias" }, cl = { class: "gauge-val" }, dl = { class: "gauge-effect" }, hl = { class: "sub-label" }, fl = { class: "hint" }, pl = { class: "chip-row" }, ml = { class: "chip" }, _l = { class: "gauge-grid" }, vl = ["title"], gl = { class: "gauge-head" }, yl = { class: "gauge-name" }, bl = { class: "gauge-alias" }, wl = { class: "gauge-val" }, xl = { class: "gauge-effect" }, Pl = { class: "sub-label" }, Ll = { class: "hint" }, Tl = { class: "chip-row" }, kl = { class: "chip" }, Sl = { class: "chip muted" }, Cl = { class: "gauge-grid" }, Ml = ["title"], zl = { class: "gauge-head" }, Ol = { class: "gauge-name" }, El = { class: "gauge-alias" }, Al = { class: "gauge-val" }, Zl = { class: "gauge-effect" }, Il = { class: "sub-label" }, Bl = { class: "hint" }, Nl = { class: "chip-row" }, Dl = { class: "chip" }, Rl = { class: "chip muted" }, Vl = {
  key: 0,
  class: "chip muted"
}, Ul = {
  key: 1,
  class: "chip warn"
}, Fl = { class: "gauge-grid" }, Hl = ["title"], Wl = { class: "gauge-head" }, Gl = { class: "gauge-name" }, ql = { class: "gauge-alias" }, jl = { class: "gauge-val" }, Kl = { class: "gauge-effect" }, $l = { class: "pdetails" }, Yl = {
  class: "settings-grid",
  style: { "margin-top": "10px" }
}, Jl = {
  key: 0,
  class: "cog-metric"
}, Xl = {
  key: 1,
  class: "cog-metric"
}, Ql = {
  key: 2,
  class: "cog-metric"
}, tu = {
  key: 3,
  class: "cog-metric"
}, eu = {
  key: 4,
  class: "cog-metric"
}, iu = {
  key: 5,
  class: "cog-metric"
}, nu = {
  key: 6,
  class: "cog-metric"
}, ou = {
  key: 7,
  class: "cog-metric"
}, au = { class: "pdetails" }, su = {
  class: "settings-grid",
  style: { "margin-top": "10px" }
}, ru = { class: "cog-metric" }, lu = { class: "cog-metric" }, uu = { class: "cog-metric" }, cu = { class: "cog-metric" }, du = { class: "cog-metric" }, hu = { class: "cog-metric" }, fu = { class: "cog-metric" }, pu = { class: "cog-metric" }, mu = { class: "cog-metric" }, _u = { class: "cog-metric" }, vu = { class: "cog-metric" }, gu = { class: "cog-metric" }, yu = {
  key: 0,
  class: "cog-metric"
}, bu = {
  key: 2,
  class: "hint"
}, wu = {
  key: 3,
  class: "hint"
}, xu = {
  key: 4,
  class: "hint"
}, Pu = {
  key: 5,
  class: "hint"
}, Lu = {
  key: 6,
  class: "hint"
}, Tu = { class: "card" }, ku = { class: "switches" }, Su = { class: "sw" }, Cu = { class: "sw" }, Mu = { class: "sw" }, zu = { class: "sw" }, Ou = { class: "sw" }, Eu = { class: "sw" }, Au = { class: "hint" }, Zu = { class: "card" }, Iu = { class: "hint" }, Bu = { class: "preset-row" }, Nu = ["onClick"], Du = { class: "grid2" }, Ru = { class: "card" }, Vu = { class: "settings-grid" }, Uu = { class: "switches" }, Fu = { class: "sw" }, Hu = { class: "sw" }, Wu = { class: "sw" }, Gu = { class: "sw" }, qu = { class: "sw" }, ju = { class: "card" }, Ku = { class: "settings-grid" }, $u = { class: "sw" }, Yu = { class: "sw" }, Ju = { class: "sw" }, Xu = { class: "card" }, Qu = { class: "settings-grid" }, tc = { class: "sw" }, ec = { class: "card" }, ic = { class: "settings-grid" }, nc = { class: "sw" }, oc = { class: "card" }, ac = { class: "settings-grid" }, sc = { class: "sw" }, rc = { class: "card" }, lc = { class: "hint" }, uc = { class: "sw" }, cc = { class: "settings-grid" }, dc = { class: "hint" }, hc = { class: "card" }, fc = { class: "hint" }, pc = { class: "sw" }, mc = { class: "settings-grid" }, _c = { class: "hint" }, vc = { class: "card" }, gc = { class: "hint" }, yc = { class: "sw" }, bc = { class: "settings-grid" }, wc = { class: "hint" }, xc = { class: "card" }, Pc = { class: "hint" }, Lc = { class: "sw" }, Tc = { class: "settings-grid" }, kc = { class: "hint" }, Sc = { class: "hint" }, Cc = { class: "card" }, Mc = { class: "hint" }, zc = { class: "switches" }, Oc = { class: "sw" }, Ec = { class: "sw" }, Ac = { class: "sw" }, Zc = { class: "sw" }, Ic = {
  "data-panel": "world",
  class: "panel"
}, Bc = { class: "section-head" }, Nc = { class: "desc" }, Dc = { class: "head-actions" }, Rc = { class: "card" }, Vc = { class: "settings-grid" }, Uc = { class: "hint" }, Fc = { class: "card" }, Hc = { class: "hint" }, Wc = { class: "world-field" }, Gc = { class: "world-label" }, qc = ["placeholder"], jc = { class: "card" }, Kc = { class: "hint" }, $c = { class: "settings-grid" }, Yc = ["placeholder"], Jc = ["placeholder"], Xc = ["placeholder"], Qc = { class: "world-field" }, td = { class: "world-label" }, ed = ["placeholder"], id = { class: "world-field" }, nd = { class: "world-label" }, od = ["placeholder"], ad = { class: "world-field" }, sd = { class: "world-label" }, rd = ["placeholder"], ld = { class: "world-actions" }, ud = ["disabled"], cd = ["disabled"], dd = { class: "hint" }, hd = { class: "card" }, fd = { class: "wm-head" }, pd = { class: "count-pill" }, md = {
  key: 0,
  class: "wm-place"
}, _d = {
  key: 0,
  class: "hint wm-premise"
}, vd = { class: "wm-map-wrap" }, gd = {
  key: 0,
  class: "wm-offline"
}, yd = {
  key: 1,
  class: "wm-compass",
  "aria-hidden": "true"
}, bd = {
  key: 1,
  class: "empty"
}, wd = {
  key: 2,
  class: "wm-legend"
}, xd = {
  key: 3,
  class: "wm-routes"
}, Pd = {
  key: 0,
  class: "wm-routes-col"
}, Ld = {
  key: 1,
  class: "wm-routes-col"
}, Td = { class: "card" }, kd = { class: "wm-head" }, Sd = { class: "count-pill" }, Cd = { class: "feed" }, Md = { class: "meta" }, zd = {
  key: 0,
  class: "empty"
}, Od = {
  "data-panel": "adapters",
  class: "panel"
}, Ed = {
  "data-panel": "state",
  class: "panel"
}, Ad = { class: "section-head" }, Zd = { class: "desc" }, Id = { class: "card" }, Bd = { class: "count-pill" }, Nd = { class: "hint" }, Dd = { class: "feed" }, Rd = { class: "rel-head" }, Vd = { class: "meta" }, Ud = { class: "rel-track-row" }, Fd = { class: "rel-track-label" }, Hd = ["aria-label"], Wd = { class: "rel-stage-name" }, Gd = ["title"], qd = { class: "gauge-head" }, jd = { class: "gauge-name" }, Kd = { class: "gauge-alias" }, $d = { class: "gauge-val" }, Yd = { class: "gauge-bar signed" }, Jd = { class: "gauge-effect" }, Xd = {
  key: 0,
  class: "rel-mode"
}, Qd = { class: "chip" }, th = { class: "meta" }, eh = {
  key: 0,
  class: "empty"
}, ih = { class: "card" }, nh = { class: "count-pill" }, oh = { class: "hint" }, ah = { class: "feed" }, sh = { class: "meta" }, rh = {
  key: 0,
  class: "empty"
}, lh = { class: "grid2" }, uh = { class: "card" }, ch = { class: "hint" }, dh = { class: "feed" }, hh = { class: "meta" }, fh = { class: "meta" }, ph = { class: "meta" }, mh = {
  key: 0,
  class: "empty"
}, _h = { class: "card" }, vh = { class: "hint" }, gh = { class: "feed" }, yh = { class: "value-name" }, bh = { class: "value-bar" }, wh = { class: "value-num" }, xh = {
  key: 0,
  class: "empty"
}, Ph = { class: "section" }, Lh = { class: "section-head" }, Th = { class: "desc" }, kh = { class: "grid2" }, Sh = { class: "card" }, Ch = { class: "hint" }, Mh = {
  class: "hint",
  style: { "margin-top": "10px" }
}, zh = { style: { "margin-top": "14px", display: "flex", gap: "10px", "flex-wrap": "wrap" } }, Oh = ["disabled"], No = 0.15, Eh = "https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}", Ah = /* @__PURE__ */ ya({
  __name: "CompanionPage",
  setup(Ie) {
    const { confirm: Je } = wa(), a = (h, u) => Ao.global.t(h, u ?? {});
    ba();
    const gt = (h) => Ao.global.t(h, {}, { locale: "zh" }), et = (h) => h.map((u) => ({ value: gt(`life.companion.${u}`), label: a(`life.companion.${u}`) })), at = tt({ settings: {}, cognition: null }), $ = tt(!1), Le = tt(""), H = tt(""), Bt = tt("cognition"), pe = tt(null), mt = [
      { key: "cognition", i: "01", labelKey: "life.companion.nav.cognition", icon: "◉" },
      { key: "persona", i: "02", labelKey: "life.companion.nav.persona", icon: "✎" },
      { key: "world", i: "03", labelKey: "life.companion.nav.world", icon: "✦" },
      { key: "adapters", i: "04", labelKey: "life.companion.nav.adapters", icon: "✉" },
      { key: "state", i: "05", labelKey: "life.companion.nav.state", icon: "☺" }
    ];
    function ft(h) {
      H.value = h, setTimeout(() => {
        H.value === h && (H.value = "");
      }, ka);
    }
    async function me(h = 0) {
      $.value = !0, Le.value = "";
      try {
        at.value = await Zo("/api/life/companion"), Hi(), $.value = !1;
      } catch (u) {
        if (h < 4)
          return await Pa(1500), me(h + 1);
        Le.value = Io(u), $.value = !1;
      }
    }
    async function St(h, u) {
      try {
        const r = await La(h, u);
        return await me(), r;
      } catch (r) {
        return Le.value = Io(r), null;
      }
    }
    function lt(h) {
      Bt.value = h;
      const u = matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", r = pe.value;
      r ? r.scrollTo({ top: 0, behavior: u }) : window.scrollTo({ top: 0, behavior: u });
    }
    function an(h) {
      const u = pe.value?.querySelector(`section[data-panel="${h}"]`);
      u && (u.classList.remove("panel-replay"), u.offsetWidth, u.classList.add("panel-replay"), u.addEventListener("animationend", () => u.classList.remove("panel-replay"), { once: !0 }));
    }
    Ye(Bt, (h) => {
      Oo(() => an(h));
    }), Ye(Bt, (h) => {
      h === "adapters" && Pn();
    });
    const ki = {
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
      get cog_attachment_type() {
        return gt("life.companion.attach.dependent");
      },
      cog_tsundere_enabled: "0",
      get cog_tsundere_type() {
        return gt("life.companion.tsundere.classic");
      },
      cog_yandere_enabled: "0",
      get cog_yandere_type() {
        return gt("life.companion.yandere.mode.yandere");
      },
      cog_personadyn_enabled: "0",
      get cog_personadyn_type() {
        return gt("life.companion.pdt.0");
      },
      get cog_personadyn_gender() {
        return gt("life.companion.pdGender.unspecified");
      },
      // memory & consolidation. On by default — they are what makes lived
      // experience leave a trace; turn one off to ablate it.
      cog_memory_encode: "1",
      cog_sleep_replay: "1",
      cog_memory_reconsolidate: "1",
      cog_cls_interleave: "1"
    }, Si = [
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
    ], Gt = ["cog_affect_profile", "cog_language_framing", "cog_attachment_type", "cog_tsundere_type", "cog_yandere_type", "cog_personadyn_type", "cog_personadyn_gender"], Ci = C(() => et(["attach.secluded", "attach.dependent", "attach.delusional", "attach.monitoring", "attach.selfHarm", "attach.exclusion"])), Xe = C(() => et(["tsundere.classic", "tsundere.cold", "tsundere.gruff", "tsundere.indulgent"])), Mi = C(() => et(["yandere.mode.yandere", "yandere.mode.tsundere", "yandere.mode.neutral", "yandere.mode.hybrid"])), zi = [
      Array.from({ length: 18 }, (h, u) => `pdt.${u}`),
      Array.from({ length: 10 }, (h, u) => `pdt.${18 + u}`),
      Array.from({ length: 9 }, (h, u) => `pdt.${28 + u}`),
      Array.from({ length: 4 }, (h, u) => `pdt.${37 + u}`),
      Array.from({ length: 13 }, (h, u) => `pdt.${41 + u}`),
      Array.from({ length: 11 }, (h, u) => `pdt.${54 + u}`),
      Array.from({ length: 13 }, (h, u) => `pdt.${65 + u}`),
      Array.from({ length: 16 }, (h, u) => `pdt.${78 + u}`),
      Array.from({ length: 78 }, (h, u) => `pdt.${94 + u}`)
    ];
    C(() => zi.map((h, u) => ({ label: a(`life.companion.pdg.${u}`), keys: h })));
    const sn = C(() => [...new Set(zi.flat())].map((h) => ({ value: gt(`life.companion.${h}`), label: a(`life.companion.${h}`) }))), Qe = C(() => et(["pdGender.unspecified", "pdGender.maleScript", "pdGender.femaleScript", "pdGender.neutral", "pdGender.highTradMale", "pdGender.lowTradMale", "pdGender.highTradFemale", "pdGender.feminist"])), Oi = C(() => ["typical", "depression", "anxiety", "bpd", "alexithymia"].map((h) => ({ value: h, label: a(`life.companion.profile.${h}`) }))), At = C(() => [
      "independent",
      "interchanging",
      "cognitive_determinism",
      "weak_whorf",
      "thinking_for_speaking",
      "radical_connectionism",
      "determinism"
    ].map((h) => ({ value: h, label: a(`life.companion.framing.${h}`) }))), Vt = ["egocentric", "subjective", "self-reflective", "mutual", "societal-symbolic"], Rn = C(() => Vt.map((h, u) => ({ value: String(u), label: a(`life.companion.stage.${h}`) }))), Kt = C({
      get: () => String(Number(_.value.cog_social_stage ?? 2)),
      set: (h) => {
        _.value.cog_social_stage = Number(h);
      }
    });
    function Vn(h) {
      return String(at.value.settings?.[h] ?? ki[h] ?? "");
    }
    function Nt() {
      const h = {};
      for (const [u, r] of Object.entries(ki)) {
        const k = Vn(u) || r;
        h[u] = Si.includes(u) ? k === "1" : Gt.includes(u) ? k : Number(k);
      }
      return h;
    }
    function Be() {
      const h = {};
      for (const [u, r] of Object.entries(ki)) {
        const k = _.value[u];
        Si.includes(u) ? h[u] = k ? "1" : "0" : h[u] = String(k ?? r);
      }
      return h;
    }
    const T = C(() => at.value.cognition || null), Ne = C(() => T.value?.last_control || null), A = C(() => T.value?.wave1 || null), Y = C(() => T.value?.wave2 || null), Ot = C(() => T.value?.wave3 || null), Ct = C(() => T.value?.wave4a || null), pt = C(() => T.value?.wave4b || null), J = C(() => T.value?.persona || null), Z = C(() => T.value?.attachment || null), ut = C(() => T.value?.tsundere || null), Tt = C(() => T.value?.yandere || null), B = C(() => T.value?.personadyn || null), Ei = C(() => {
      const h = B.value?.big5;
      return h ? ["o_open", "c_conscientious", "e_extravert", "a_agreeable", "n_neurotic"].map((r) => vt(h[r], 2)).join(" · ") : "—";
    }), Ai = C(() => {
      const h = B.value?.hexaco;
      return h ? ["h_honesty", "hex_e", "hex_x", "hex_a", "hex_c", "hex_o"].map((r) => vt(h[r], 2)).join(" · ") : "—";
    });
    function Te(h, u = 3) {
      return h ? Object.entries(h).filter(([, r]) => typeof r == "number").sort((r, k) => k[1] - r[1]).slice(0, u).map(([r, k]) => `${fn(r)} ${vt(k, 2)}`) : [];
    }
    const ti = C(() => Te(B.value?.desires, 3)), rn = C(() => Te(B.value?.emotions, 3)), ln = C(() => {
      const h = B.value?.learning?.theta_drift;
      return h ? Object.values(h).reduce((u, r) => u + Math.abs(r || 0), 0) : 0;
    }), ne = C(() => Y.value?.episode || null), Zi = (h) => {
      const u = { euthymic: "life.companion.episode.euthymic", subthreshold: "life.companion.episode.subthreshold", episode: "life.companion.episode.episode" };
      return u[h] ? a(u[h]) : "—";
    }, dt = C(() => T.value?.life || null), ue = tt(!1), ei = tt("start"), De = tt(!0);
    function un() {
      const h = dt.value?.born_at;
      if (!h) return "—";
      const u = Date.now() - new Date(h).getTime();
      if (!isFinite(u) || u < 0) return "—";
      const r = Math.floor(u / 864e5), k = Math.floor(u % 864e5 / 36e5);
      return r > 0 ? a("life.companion.life.ageDaysHours", { days: r, hours: k }) : a("life.companion.life.ageHours", { hours: k });
    }
    function Ii() {
      return ei.value === "start" ? a("life.companion.life.starting") : a("life.companion.life.pausing");
    }
    async function cn() {
      ue.value = !0, ei.value = "start";
      try {
        const h = await St("life_start", { greet: De.value });
        h && ft(h.greeting ? a("life.companion.flash.lifeStartedGreeting", { greeting: h.greeting }) : a("life.companion.flash.lifeStarted"));
      } finally {
        ue.value = !1;
      }
    }
    async function dn() {
      ue.value = !0, ei.value = "stop";
      try {
        await St("life_stop", {}) && ft(a("life.companion.flash.lifeStopped"));
      } finally {
        ue.value = !1;
      }
    }
    function Bi(h, u) {
      Object.assign(_.value, h), N().then(() => ft(a("life.companion.flash.presetApplied", { label: u })));
    }
    const hn = [
      { labelKey: "life.companion.preset.regular", fields: { cog_affect_enabled: !0, cog_affect_profile: "typical", cog_affect_threat: 0.2, cog_affect_reward: 1, cog_attachment_enabled: !1, cog_tsundere_enabled: !1, cog_personadyn_enabled: !1 } },
      { labelKey: "life.companion.preset.depression", fields: { cog_affect_enabled: !0, cog_affect_profile: "depression", cog_affect_threat: 0.45, cog_affect_reward: 0.7 } },
      { labelKey: "life.companion.preset.tsundere", fields: { cog_tsundere_enabled: !0, cog_tsundere_type: gt("life.companion.tsundere.classic") } },
      { labelKey: "life.companion.preset.personadyn", fields: { cog_personadyn_enabled: !0, cog_personadyn_type: gt("life.companion.pdt.1") } },
      { labelKey: "life.companion.preset.yandereSecluded", fields: { cog_affect_enabled: !0, cog_affect_profile: "depression", cog_attachment_enabled: !0, cog_attachment_type: gt("life.companion.attach.secluded") } },
      { labelKey: "life.companion.preset.yandereDependent", fields: { cog_affect_enabled: !0, cog_attachment_enabled: !0, cog_attachment_type: gt("life.companion.attach.dependent") } },
      { labelKey: "life.companion.preset.yandereDelusional", fields: { cog_affect_enabled: !0, cog_affect_profile: "depression", cog_attachment_enabled: !0, cog_attachment_type: gt("life.companion.attach.delusional") } }
    ], Ni = C(() => T.value?.wave2?.somatic_channels || null), fn = (h) => {
      const u = { fatigue: "channel.fatigue", pain: "channel.pain", cardiorespiratory: "channel.cardiorespiratory", gastrointestinal: "channel.gastrointestinal", dizziness: "channel.dizziness", sleep: "channel.sleep" };
      return u[h] ? a(`life.companion.${u[h]}`) : h;
    }, pn = (h) => Math.max(0.02, Math.min(1, Number(h))).toFixed(3), mn = C(() => {
      const h = J.value?.evidence || {};
      return Object.entries(h).map(([u, r]) => a("life.companion.evidencePair", { dim: u, words: r.join(a("life.companion.listSeparator")) })).join(a("life.companion.evidenceSeparator"));
    });
    function vt(h, u = 3) {
      return h == null || h === "" ? "—" : Number(h).toFixed(u);
    }
    const Re = C(() => (at.value.timeline || []).filter((h) => h.topic === gt("life.companion.val.world")).slice(0, 30)), Ve = C(() => at.value.commitments || []), Di = C(() => at.value.user_model || []), _n = C(() => Object.entries(at.value.values || {}).map(([h, u]) => ({ k: h, v: Number(u) })).sort((h, u) => Math.abs(u.v) - Math.abs(h.v)).slice(0, 20));
    function _e(h) {
      try {
        const u = JSON.parse(h || "[]");
        return Array.isArray(u) ? u : [];
      } catch {
        return [];
      }
    }
    const ii = C(() => at.value.emotion || null), ke = C(() => at.value.circadian || null), ni = C(() => at.value.relationships || []), Ue = (h) => Math.max(0, Math.min(1, h)), Fe = C(() => {
      const h = ii.value || {}, u = Math.max(-1, Math.min(1, Number(h.valence) || 0)), r = Ue(Number(h.arousal ?? 0.5));
      return { x: (10 + (u + 1) / 2 * 100).toFixed(1), y: (110 - r * 100).toFixed(1) };
    }), vn = C(() => {
      const h = ii.value;
      if (!h) return "life.companion.quadrant.serene";
      const u = Number(h.valence) >= 0, r = Number(h.arousal) >= 0.5;
      return u ? r ? "life.companion.quadrant.excited" : "life.companion.quadrant.serene" : r ? "life.companion.quadrant.tense" : "life.companion.quadrant.gloomy";
    }), gn = (h) => h <= -No ? "lo" : h >= No ? "hi" : "mid";
    function Q(h, u, r, k) {
      const P = Number(r);
      if (!isFinite(P)) return null;
      const D = Ue(P / k.max), it = k.signed ? gn(P) : D < 0.34 ? "lo" : D < 0.67 ? "mid" : "hi", _t = {
        label: u,
        value: P,
        max: k.max,
        kind: k.kind,
        signed: !!k.signed,
        effect: a(`life.companion.effect.${h}`),
        display: vt(P, 2),
        alias: a(`life.companion.alias.${h}`),
        state: a(`life.companion.gw.${h}.${it}`),
        stateTone: "mid"
      };
      return _t.stateTone = _t.signed ? _t.value >= 0 ? "good" : "bad" : ae(_t), _t;
    }
    function oe(h) {
      return Ue(h.value / h.max);
    }
    function ae(h) {
      const u = oe(h);
      return h.kind === "neutral" ? "mid" : h.kind === "bad" ? u >= 0.67 ? "bad" : u < 0.34 ? "good" : "mid" : u >= 0.67 ? "good" : u < 0.34 ? "bad" : "mid";
    }
    function $t(h) {
      const u = Ue(Math.abs(h)) * 50;
      return { width: `${u}%`, left: h >= 0 ? "50%" : `${50 - u}%` };
    }
    const Yt = (h) => h.filter((u) => u !== null), Un = C(() => {
      const h = ii.value || {};
      return Yt([
        Q("valence", a("life.companion.gauge.valence"), h.valence, { max: 1, kind: "neutral", signed: !0 }),
        Q("arousal", a("life.companion.gauge.arousal"), h.arousal, { max: 1, kind: "neutral" }),
        Q("connection", a("life.companion.gauge.connection"), h.connection, { max: 1, kind: "good" }),
        Q("irritation", a("life.companion.gauge.irritation"), h.irritation, { max: 1, kind: "bad" })
      ]);
    }), Fn = C(() => {
      const h = ke.value || {};
      return Yt([
        Q("energy", a("life.companion.body.energy"), h.mental_energy, { max: 100, kind: "good" }),
        Q("hunger", a("life.companion.body.hunger"), h.hunger, { max: 100, kind: "bad" }),
        Q("health", a("life.companion.body.health"), h.health, { max: 100, kind: "good" })
      ]);
    }), Hn = C(() => Yt([
      Q("mood", a("life.companion.gauge.mood"), Y.value?.mood, { max: 1, kind: "neutral", signed: !0 }),
      Q("vagal", a("life.companion.gauge.vagal"), Y.value?.vagal_tone, { max: 1, kind: "good" }),
      Q("somatization", a("life.companion.gauge.somatization"), Y.value?.somatization_index, { max: 1, kind: "bad" }),
      Q("healthAnxiety", a("life.companion.gauge.healthAnxiety"), Y.value?.health_anxiety, { max: 1, kind: "bad" }),
      Q("somaticBurden", a("life.companion.gauge.somaticBurden"), Y.value?.somatic_burden, { max: 1, kind: "bad" }),
      Q("allostatic", a("life.companion.gauge.allostatic"), Y.value?.allostatic_load, { max: 1, kind: "bad" }),
      Q("loneliness", a("life.companion.gauge.loneliness"), Y.value?.loneliness, { max: 1, kind: "bad" })
    ])), Wn = C(() => Yt([
      Q("empathy", a("life.companion.gauge.empathy"), Ct.value?.empathy, { max: 1, kind: "good" }),
      Q("patience", a("life.companion.gauge.patience"), pt.value?.patience, { max: 1, kind: "good" })
    ])), Jt = C(() => Yt([
      Q("distress", a("life.companion.gauge.distress"), Z.value?.distress, { max: 1, kind: "bad" }),
      Q("comorbid", a("life.companion.gauge.comorbid"), Z.value?.comorbid_depression, { max: 1, kind: "bad" })
    ])), S = C(() => Yt([
      Q("affection", a("life.companion.gauge.affection"), ut.value?.affection, { max: 1, kind: "good" }),
      Q("tsun", a("life.companion.gauge.tsun"), ut.value?.expression, { max: 1, kind: "neutral" }),
      Q("fixation", a("life.companion.gauge.fixation"), ut.value?.fixation, { max: 1, kind: "bad" })
    ])), yn = C(() => Yt([
      Q("jealousy", a("life.companion.gauge.jealousy"), Tt.value?.jealousy, { max: 1, kind: "bad" }),
      Q("intensity", a("life.companion.gauge.intensity"), Tt.value?.intensity, { max: 1, kind: "neutral" }),
      Q("darkness", a("life.companion.gauge.darkness"), Tt.value?.darkness, { max: 1, kind: "bad" })
    ])), bn = C(() => Yt([
      Q("pdPressure", a("life.companion.gauge.pdPressure"), B.value?.pressure, { max: 1, kind: "bad" }),
      Q("pdAffection", a("life.companion.gauge.pdAffection"), B.value?.affection, { max: 1, kind: "good" }),
      Q("pdAnxiety", a("life.companion.gauge.pdAnxiety"), B.value?.anxiety, { max: 1, kind: "bad" }),
      Q("pdPossession", a("life.companion.gauge.pdPossession"), B.value?.possessiveness, { max: 1, kind: "bad" }),
      Q("pdTrust", a("life.companion.gauge.pdTrust"), B.value?.trust, { max: 1, kind: "good" }),
      Q("pdSelfControl", a("life.companion.gauge.pdSelfControl"), B.value?.self_control, { max: 1, kind: "good" }),
      Q("pdSuppression", a("life.companion.gauge.pdSuppression"), B.value?.suppression, { max: 1, kind: "bad" })
    ])), oi = ["警惕", "疏离", "陌生", "认识", "熟悉", "友好", "亲近", "亲密"], Ri = ["回避", "受伤", "放松", "活泼", "温暖", "亲近", "爱意"], ai = (h) => oi.includes(h) ? a(`life.companion.relStage.${h}`) : h || "—", Vi = (h) => oi.indexOf(h), Se = (h) => Ri.includes(h) ? a(`life.companion.interaction.${h}`) : h || "—", wn = (h) => Ri.includes(h) ? a(`life.companion.interactionEffect.${h}`) : "", _ = tt({}), si = tt("off"), Gn = C(() => [
      { value: "off", label: a("life.companion.worldDensity.off") },
      { value: "texture", label: a("life.companion.worldDensity.texture") },
      { value: "full", label: a("life.companion.worldDensity.full") }
    ]), ri = tt("fictional"), He = tt(""), li = tt(""), ve = tt(""), ui = tt(""), ci = tt(""), di = tt(""), hi = tt(""), Xt = tt(!1), Ce = tt(!1), We = C(() => [
      { value: "fictional", label: a("life.companion.worldFictional.fictional") },
      { value: "real", label: a("life.companion.worldFictional.real") }
    ]), Qt = C(() => at.value.worldview || null), W = C(() => Qt.value?.map || { locations: [], edges: [], actors: [], width: 1e3, height: 700, title: "" }), Ge = C(() => Qt.value?.actor_locations || {}), X = ["home", "work", "shop", "food", "park", "transit", "other"], ht = { home: "life.companion.kind.home", work: "life.companion.kind.work", shop: "life.companion.kind.shop", food: "life.companion.kind.food", park: "life.companion.kind.park", transit: "life.companion.kind.transit", other: "life.companion.kind.other" }, qe = { home: "#e07a5f", work: "#5b8def", shop: "#e0a23d", food: "#57a773", park: "#3faead", transit: "#8b6fd6", other: "#8a94a6" }, Me = C(() => X.filter((h) => (W.value.locations || []).some((u) => (u.kind || "other") === h)));
    function yt(h) {
      const u = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
      return String(h ?? "").replace(/[&<>"']/g, (r) => u[r]);
    }
    const ze = tt(null), R = tt(!1);
    let V = null, E = null, Oe = "";
    const Dt = ["#2b4250", "#33495a", "#2f4a44", "#3a4258", "#463f4f", "#3d4a3a", "#4a4436", "#39485c"], xn = ["#dfe4ea", "#d6dce4", "#e6eaf0", "#cfd7e0"];
    let ce = "";
    const Ut = tt("city"), st = {};
    function se(h, u, r) {
      (st[h] || (st[h] = [])).push({ layer: u, base: r });
    }
    function Ft(h) {
      ce = ce === h ? "" : h;
      for (const [u, r] of Object.entries(st)) {
        const k = u === ce;
        for (const { layer: P, base: D } of r)
          P.setStyle && P.setStyle({ ...D, weight: (D.weight || 2) + (k ? 3.5 : 0), opacity: k ? 1 : D.opacity ?? 1 }), k && P.bringToFront && P.bringToFront();
      }
    }
    function je() {
      ce = "", _i(!1);
    }
    function Ui() {
      Ut.value = Ut.value === "city" ? "nation" : "city", _i(!1);
    }
    function de() {
      return { w: W.value.width || 1e3, h: W.value.height || 700 };
    }
    function Mt(h, u) {
      return [de().h - u, h];
    }
    function Ht(h, u) {
      return O.divIcon({ className: "wm-route", html: `<span class="wm-route-inner" style="--c:${u}">${yt(h)}</span>`, iconSize: [0, 0], iconAnchor: [0, 0] });
    }
    function fi(h, u) {
      return O.divIcon({ className: "wm-route wm-minor", html: `<span class="wm-route-inner" style="--c:${u}">${yt(h)}</span>`, iconSize: [0, 0], iconAnchor: [0, 0] });
    }
    function Fi(h, u) {
      return O.divIcon({ className: "wm-route wm-station", html: `<span class="wm-route-inner" style="--c:${u}">${yt(h)}</span>`, iconSize: [0, 0], iconAnchor: [0, 0] });
    }
    function pi(h) {
      const u = [], r = [];
      for (const k of h) {
        const P = String(k.text).length * 13 + 20, D = 22;
        u.some((_t) => Math.abs(_t.x - k.x) < (_t.w + P) / 2 && Math.abs(_t.y - k.y) < (_t.h + D) / 2) || (u.push({ x: k.x, y: k.y, w: P, h: D }), r.push(k));
      }
      return r;
    }
    function mi() {
      const h = W.value.kind === "real" ? "real" : "fictional";
      if (V && Oe !== h && (V.remove(), V = null, E = null), !(V || !ze.value)) {
        if (h === "real") {
          R.value = !1, V = O.map(ze.value, { zoomControl: !0, attributionControl: !0 }).setView([35, 105], 5);
          const u = O.tileLayer(Eh, { subdomains: ["1", "2", "3", "4"], maxZoom: 19, minZoom: 3, attribution: a("life.companion.map.attribution") });
          u.on("tileerror", () => {
            R.value = !0;
          }), u.on("load", () => {
            R.value = !1;
          }), u.addTo(V);
        } else {
          R.value = !1;
          const { w: u, h: r } = de();
          V = O.map(ze.value, { crs: O.CRS.Simple, zoomControl: !0, attributionControl: !1, minZoom: -3, maxZoom: 3 }).setView([r / 2, u / 2], -1.5);
          for (const [P, D] of [["pWater", 350], ["pParks", 360], ["pBlocks", 370], ["pRoads", 380], ["pMetro", 400], ["pBus", 410], ["pLabels", 620]])
            V.createPane(P), V.getPane(P).style.zIndex = String(D);
          const k = () => V.getContainer().classList.toggle("wm-zoom-low", V.getZoom() < 0);
          V.on("zoomend", k), setTimeout(k, 0);
        }
        Oe = h, E = O.layerGroup().addTo(V);
      }
    }
    function _i(h = !1) {
      if (!V || !E) return;
      E.clearLayers();
      for (const P of Object.keys(st)) delete st[P];
      ce = "";
      const u = W.value.locations || [];
      if (!u.length) return;
      const r = Oe !== "real", k = {};
      for (const P of u) k[P.id] = P;
      if (r) {
        const { w: P, h: D } = de(), it = (g) => g.map((nt) => Mt(nt[0], nt[1])), _t = W.value.nation;
        if (Ut.value === "nation" && _t) {
          O.rectangle([[0, 0], [D, P]], { pane: "pWater", stroke: !1, fillColor: "#d9e6f0", fillOpacity: 1 }).addTo(E), O.polygon(it(_t.land), { pane: "pWater", color: "#8fbfe6", weight: 1.5, fillColor: "#f4efe1", fillOpacity: 1 }).addTo(E), (_t.provinces || []).forEach((g, nt) => {
            O.polygon(it(g.points), { pane: "pParks", color: "#c9b98f", weight: 1, fillColor: nt % 2 ? "#ece2c8" : "#e4d7b4", fillOpacity: 0.55 }).addTo(E), O.marker(it([g.label])[0], { pane: "pLabels", interactive: !1, icon: Ht(g.name, "#8a7a5c") }).addTo(E);
          }), (_t.routes || []).forEach((g) => O.polyline(it(g.points), { pane: "pRoads", color: "#b98a4a", weight: 2.5, dashArray: "2 7" }).addTo(E)), (_t.cities || []).forEach((g) => {
            const nt = Mt(g.x, g.y);
            O.circleMarker(nt, { pane: "pLabels", radius: g.capital ? 9 : 6, color: "#ffffff", weight: 2, fillColor: g.capital ? "#d64545" : "#3a6ea5", fillOpacity: 1 }).bindPopup(yt(g.name)).addTo(E), O.marker(nt, { pane: "pLabels", interactive: !1, icon: Ht(g.name, g.capital ? "#d64545" : "#3a6ea5") }).addTo(E);
          }), V.fitBounds([[0, 0], [D, P]], { padding: [6, 6] });
          return;
        }
        O.rectangle([[0, 0], [D, P]], { pane: "pWater", stroke: !1, fillColor: "#eef1f4", fillOpacity: 1 }).addTo(E), (W.value.compounds || []).forEach((g) => {
          O.polygon(it(g.points), { pane: "pParks", color: "#c9b98f", weight: 1.2, dashArray: "7 5", fillColor: "#f3ead0", fillOpacity: 0.5 }).addTo(E), O.marker(it(g.points)[0], { pane: "pLabels", interactive: !1, icon: Ht(g.name, "#a9884a") }).addTo(E);
        }), (W.value.lakes || []).forEach((g) => {
          O.polygon(it(g.points), { pane: "pWater", color: "#8fbfe6", weight: 1.5, fillColor: "#bcd9f0", fillOpacity: 1 }).addTo(E), g.name && g.name !== "" && O.marker(Mt(g.label[0], g.label[1]), { pane: "pLabels", interactive: !1, icon: Ht(g.name, "#3d7fb5") }).addTo(E);
        }), (W.value.rivers || []).forEach((g) => {
          O.polyline(it(g.points), { pane: "pWater", color: "#8fbfe6", weight: 16, lineCap: "round", lineJoin: "round" }).addTo(E), O.polyline(it(g.points), { pane: "pWater", color: "#bcd9f0", weight: 11, lineCap: "round", lineJoin: "round" }).addTo(E), g.name && g.name !== "" && O.marker(it(g.points)[Math.floor(g.points.length / 2)], { pane: "pLabels", interactive: !1, icon: Ht(g.name, "#3d7fb5") }).addTo(E);
        }), (W.value.parks || []).forEach((g) => {
          O.polygon(it(g.points), { pane: "pParks", color: "#a9d3a0", weight: 1, fillColor: "#c9e6c4", fillOpacity: 1 }).addTo(E), (g.trees || []).forEach((nt) => O.circleMarker(Mt(nt[0], nt[1]), { pane: "pParks", radius: 2.6, stroke: !1, fillColor: "#82bd79", fillOpacity: 1 }).addTo(E)), g.name && g.name !== gt("life.companion.val.park") && O.marker(it(g.points)[0], { pane: "pLabels", interactive: !1, icon: Ht(g.name, "#5a9e52") }).addTo(E);
        });
        const re = [];
        (W.value.blocks || []).forEach((g) => {
          const nt = it(g.points);
          if (O.polygon(nt.map((rt) => [rt[0] - 3, rt[1] + 3]), { pane: "pBlocks", stroke: !1, fillColor: "#5b6b7a", fillOpacity: 0.16 }).addTo(E), O.polygon(nt, { pane: "pBlocks", color: "#b9c3cd", weight: 1, fillColor: xn[(g.shade || 0) % xn.length], fillOpacity: 1 }).addTo(E), g.tower) {
            const rt = nt.reduce((wt, xt) => wt + xt[0], 0) / nt.length, bt = nt.reduce((wt, xt) => wt + xt[1], 0) / nt.length;
            O.polygon(
              nt.map((wt) => [rt + (wt[0] - rt) * 0.5, bt + (wt[1] - bt) * 0.5]),
              { pane: "pBlocks", color: "#aab4c0", weight: 1, fillColor: "#eef2f6", fillOpacity: 1 }
            ).addTo(E);
          }
          if (g.name) {
            const rt = g.points.reduce((wt, xt) => wt + xt[0], 0) / g.points.length, bt = g.points.reduce((wt, xt) => wt + xt[1], 0) / g.points.length;
            re.push({ x: rt, y: bt, text: g.name, color: g.tower ? "#6b5b8a" : "#7a8794" });
          }
        }), (W.value.named_buildings || []).forEach((g) => {
          O.circleMarker(Mt(g.x, g.y), { pane: "pLabels", radius: 4, color: "#ffffff", weight: 1.5, fillColor: "#8a5a2b", fillOpacity: 1 }).addTo(E), O.marker(Mt(g.x, g.y), { pane: "pLabels", interactive: !1, icon: Ht(g.name, "#8a5a2b") }).addTo(E);
        });
        for (const g of pi(re))
          O.marker(Mt(g.x, g.y), { pane: "pLabels", interactive: !1, icon: fi(g.text, g.color) }).addTo(E);
        const $i = {
          highway: { casing: 13, fill: 6.5, color: "#f08c2e" },
          arterial: { casing: 10, fill: 4.5, color: "#f7cf8a" },
          street: { casing: 5, fill: 2.4, color: "#ffffff" }
        };
        (W.value.streets || []).forEach((g) => {
          const nt = $i[g.kind] || $i.street, rt = it(g.points);
          O.polyline(rt, { pane: "pRoads", color: "#ffffff", weight: nt.casing, lineCap: "round", lineJoin: "round" }).addTo(E), O.polyline(rt, { pane: "pRoads", color: nt.color, weight: nt.fill, lineCap: "round", lineJoin: "round" }).addTo(E);
        }), (W.value.roads || []).forEach((g, nt) => {
          if (!g.name) return;
          const rt = it(g.points), bt = "road:" + nt;
          O.polyline(rt, { pane: "pRoads", color: "#ffffff", weight: 11, lineCap: "round", lineJoin: "round" }).addTo(E);
          const wt = { pane: "pRoads", color: "#f6c56b", weight: 5, opacity: 1, lineCap: "round", lineJoin: "round" };
          se(bt, O.polyline(rt, wt).on("click", () => Ft(bt)).addTo(E), wt), O.marker(rt[Math.floor(rt.length / 2)], { pane: "pLabels", interactive: !0, icon: Ht(g.name, "#9a8358") }).on("click", () => Ft(bt)).addTo(E);
        }), (W.value.districts || []).forEach((g, nt) => {
          O.circle(Mt(g.x, g.y), { pane: "pRoads", radius: g.r || 200, color: "#93a2b0", weight: 1, dashArray: "4 7", fillColor: Dt[nt % Dt.length], fillOpacity: 0.08 }).addTo(E), O.marker(Mt(g.x, g.y), { pane: "pLabels", interactive: !1, icon: O.divIcon({ className: "wm-district", html: `<span class="wm-district-inner">${yt(g.name)}</span>`, iconSize: [0, 0], iconAnchor: [0, 0] }) }).addTo(E);
        });
        const Yi = [];
        (W.value.metro || []).forEach((g, nt) => {
          const rt = it(g.points), bt = "metro:" + nt;
          O.polyline(rt, { pane: "pMetro", color: "#ffffff", weight: 8, lineCap: "round", lineJoin: "round" }).addTo(E);
          const wt = { pane: "pMetro", color: g.color, weight: 4.5, opacity: 0.92, lineCap: "round", lineJoin: "round" };
          se(bt, O.polyline(rt, wt).on("click", () => Ft(bt)).addTo(E), wt), (g.stations || []).forEach((xt) => {
            O.circleMarker(Mt(xt.x, xt.y), { pane: "pMetro", radius: 5, color: "#ffffff", weight: 2.5, fillColor: g.color, fillOpacity: 1 }).bindPopup(yt(xt.name || g.name)).on("click", () => Ft(bt)).addTo(E), xt.name && Yi.push({ x: xt.x, y: xt.y, text: xt.name, color: g.color });
          }), O.marker(rt[Math.floor(rt.length / 2)], { pane: "pLabels", interactive: !0, icon: Ht(g.name, g.color) }).on("click", () => Ft(bt)).addTo(E);
        }), (W.value.bus || []).forEach((g, nt) => {
          const rt = it(g.points), bt = "bus:" + nt, wt = { pane: "pBus", color: g.color, weight: 3, opacity: 0.95, dashArray: "7 7", lineCap: "round" };
          se(bt, O.polyline(rt, wt).on("click", () => Ft(bt)).addTo(E), wt), (g.stops || []).forEach((xt) => O.circleMarker(Mt(xt.x, xt.y), { pane: "pBus", radius: 3.2, color: "#ffffff", weight: 1.5, fillColor: g.color, fillOpacity: 1 }).bindPopup(yt(xt.name || g.name)).on("click", () => Ft(bt)).addTo(E)), O.marker(rt[Math.floor(rt.length / 2)], { pane: "pLabels", interactive: !0, icon: Ht(g.name, g.color) }).on("click", () => Ft(bt)).addTo(E);
        });
        for (const g of pi(Yi))
          O.marker(Mt(g.x, g.y), { pane: "pLabels", interactive: !1, icon: Fi(g.text, g.color) }).addTo(E);
      } else
        for (const P of W.value.edges || []) {
          const D = k[P[0]], it = k[P[1]];
          D?.lat != null && it?.lat != null && O.polyline([[D.lat, D.lng], [it.lat, it.lng]], { color: "#5b8def", weight: 3, opacity: 0.55, dashArray: "2 8", lineCap: "round" }).addTo(E);
        }
      for (const P of u) {
        const D = qe[P.kind] || qe.other, it = r ? Mt(P.x, P.y) : P.lat != null ? [P.lat, P.lng] : null;
        if (!it) continue;
        const _t = O.divIcon({
          className: "wm-pin-holder",
          html: `<span class="wm-pin" style="--c:${D}"></span><span class="wm-pin-label">${yt(P.name)}</span>`,
          iconSize: [0, 0],
          iconAnchor: [0, 0]
        });
        O.marker(it, { icon: _t }).bindPopup(`<b>${yt(P.name)}</b>${P.desc ? "<br>" + yt(P.desc) : ""}`).addTo(E);
      }
      for (const P of W.value.actors || []) {
        const D = k[Ge.value[P.id] || P.location];
        if (!D) continue;
        const it = r ? Mt(D.x, D.y) : D.lat != null ? [D.lat, D.lng] : null;
        if (!it) continue;
        const _t = O.divIcon({
          className: "wm-actor-holder",
          html: `<span class="wm-actor-badge">${yt((P.name || "?").slice(0, 1))}</span><span class="wm-actor-name">${yt(P.name)}</span>`,
          iconSize: [0, 0],
          iconAnchor: [0, 0]
        });
        O.marker(it, { icon: _t }).bindPopup(`${yt(P.name)} · ${yt(D.name)}`).addTo(E);
      }
      if (!h)
        if (r) {
          const { w: P, h: D } = de();
          V.fitBounds([[0, 0], [D, P]], { padding: [0, 0] });
        } else {
          const P = u.filter((D) => D.lat != null).map((D) => [D.lat, D.lng]);
          P.length > 1 ? V.fitBounds(P, { padding: [56, 56], maxZoom: 15 }) : P.length === 1 && V.setView(P[0], 14);
        }
    }
    Ye([Bt, () => at.value.worldview], async () => {
      Bt.value === "world" && (await Oo(), mi(), _i(), V && setTimeout(() => V.invalidateSize(), 80));
    }), Eo(() => {
      V && (V.remove(), V = null, E = null);
    });
    function Hi() {
      _.value = { ...Nt() }, si.value = String(at.value.settings?.world_density || "off"), ri.value = String(at.value.settings?.world_fictional || "fictional"), He.value = String(at.value.settings?.world_country || ""), li.value = String(at.value.settings?.world_city || ""), ve.value = String(at.value.settings?.world_district || ""), ui.value = String(at.value.settings?.world_premise || ""), ci.value = String(at.value.settings?.persona_text || ""), di.value = String(at.value.settings?.world_actors || ""), hi.value = String(at.value.settings?.world_places || "");
    }
    const ge = tt(!1);
    async function N() {
      if (!ge.value) {
        ge.value = !0;
        try {
          const h = {
            ...Be(),
            world_density: si.value,
            world_fictional: ri.value,
            world_country: He.value,
            world_city: li.value,
            world_district: ve.value,
            world_premise: ui.value,
            world_actors: di.value,
            world_places: hi.value,
            persona_text: ci.value
          }, u = await St("settings_set", { settings: h });
          u?.rejected?.length ? ft(a("life.companion.flash.settingsSavedIgnored", { items: u.rejected.join(a("life.companion.listSeparator")) })) : ft(a("life.companion.flash.settingsSaved"));
        } finally {
          ge.value = !1;
        }
      }
    }
    const te = tt([]), ot = tt([]);
    tt(!1);
    async function Pn() {
      const h = await St("adapter_list", {});
      h && (te.value = h.instances || [], ot.value = h.runtime || []);
    }
    async function Wi() {
      if (!(Xt.value || !await Je({
        title: a("life.companion.world.rewriteTitle"),
        message: a("life.companion.world.rewriteMessage"),
        confirmLabel: a("life.companion.world.overwriteConfirm"),
        danger: !0
      }))) {
        Xt.value = !0;
        try {
          (await St("world_generate", { instructions: "" }))?.worldview && ft(a("life.companion.flash.worldGenerated"));
        } finally {
          Xt.value = !1;
        }
      }
    }
    async function Gi() {
      if (!Xt.value) {
        Xt.value = !0;
        try {
          (await St("world_map_generate", { instructions: "" }))?.worldview && ft(a("life.companion.flash.mapRegenerated"));
        } finally {
          Xt.value = !1;
        }
      }
    }
    async function qi() {
      if (!await Je({
        title: a("life.companion.world.clearTitle"),
        message: a("life.companion.world.clearMessage"),
        confirmLabel: a("life.companion.world.clearConfirm"),
        danger: !0
      })) return;
      await St("world_clear", {}) && ft(a("life.companion.flash.worldCleared"));
    }
    async function ye() {
      if (!(!await Je({
        title: a("life.companion.reset.title"),
        message: a("life.companion.reset.message"),
        confirmLabel: a("life.companion.reset.continue"),
        danger: !0
      }) || !await Je({
        title: a("life.companion.reset.confirmTitle"),
        message: a("life.companion.reset.confirmMessage"),
        confirmLabel: a("life.companion.reset.confirm"),
        danger: !0
      }))) {
        Ce.value = !0;
        try {
          await St("reset_person", {}), ft(a("life.companion.flash.personReset")), await me();
        } finally {
          Ce.value = !1;
        }
      }
    }
    const Ee = () => ({ name: "", avatar: "", birthDate: "", gender: "", description: "", personality: "", greeting: "", customPrompt: "" }), he = C(() => [
      { value: "", label: a("life.companion.gender.none") },
      { value: "female", label: a("life.companion.gender.female") },
      { value: "male", label: a("life.companion.gender.male") },
      { value: "other", label: a("life.companion.gender.other") }
    ]);
    function kt(h) {
      return (he.value.find((u) => u.value === h) || he.value[0]).label;
    }
    const G = tt(Ee()), vi = tt(!1);
    function ji() {
      return globalThis.__0KAY_HOST__;
    }
    function Ln() {
      const h = ji();
      if (h?.getPersona) {
        G.value = { ...Ee(), ...h.getPersona() || {} };
        return;
      }
      try {
        const u = JSON.parse(localStorage.getItem("0kay_config") || "{}");
        G.value = { ...Ee(), ...u.persona || {} };
      } catch {
        G.value = Ee();
      }
    }
    const m = tt(null), Ae = tt(!1), qn = C(() => [
      { value: "", label: a("life.companion.gender.undecidedBracket") },
      ...(m.value?.options?.character || []).map((h) => ({ value: h.key, label: h.label }))
    ]), Tn = C(() => [
      { value: "", label: a("life.companion.gender.undecidedBracket") },
      ...(m.value?.options?.relationship || []).map((h) => ({
        value: h.key,
        label: h.label + (h.pathological ? a("life.companion.relationship.pathologicalSuffix") : "")
      }))
    ]);
    function j() {
      return { text: [G.value.description, G.value.personality].filter((h) => String(h || "").trim()).join(`
`) };
    }
    Ye(() => [G.value.description, G.value.personality, G.value.customPrompt], () => {
      m.value = null;
    });
    function jn(h) {
      return (m.value?.options?.relationship || []).find((u) => u.key === h);
    }
    Ye(() => m.value?.relationship?.key, (h) => {
      const u = m.value?.attachment;
      if (!u) return;
      const r = jn(h);
      u.type = r?.pathological && r.attachment_type || "";
    }, { immediate: !0 }), Ye(() => m.value?.attachment?.type, (h) => {
      const u = m.value?.attachment;
      if (!(!h || !u)) {
        (!u.initial || typeof u.initial != "object") && (u.initial = {});
        for (const [r, k] of Object.entries({ A: 0.05, Am: 0, Tr: 0.5, J: 0, X: 0.05, S: 0.6, O: 0 }))
          u.initial[r] == null && (u.initial[r] = k);
      }
    });
    async function qt() {
      const h = j();
      if (!h.text.trim()) {
        ft(a("life.companion.flash.needDescriptionOrPersonality"));
        return;
      }
      Ae.value = !0;
      try {
        const u = await St("persona_analyze", { text: h.text, gender: G.value.gender });
        u && (m.value = u, m.value.personadynGender = u.personadyn?.gender || _.cog_personadyn_gender || gt("life.companion.pdGender.unspecified"), !G.value.gender && u.gender && (G.value.gender = u.gender), ft(u.source === "llm" ? a("life.companion.flash.analyzedLlm") : a("life.companion.flash.analyzedLocal")));
      } finally {
        Ae.value = !1;
      }
    }
    async function Ke() {
      if (!m.value) {
        ft(a("life.companion.flash.needLlmFirst"));
        return;
      }
      vi.value = !0;
      try {
        const h = j(), u = { ...m.value.traits || {} };
        if (u.gender = m.value.gender || G.value.gender || null, u.character = m.value.character?.key || null, u.relationship = m.value.relationship?.key || null, u.expression = m.value.character?.expression || m.value.expression || null, delete u.axes, !await St("persona_apply", {
          text: h.text,
          traits: u,
          attachment: m.value.attachment || {},
          tsundere: m.value.tsundere || {},
          personadyn: {
            ...m.value.personadyn || {},
            // The owner may override the archetype's implied gender/social script
            // after analysis; the backend applies it as the persona's G group.
            gender: m.value.personadynGender || _.cog_personadyn_gender || gt("life.companion.pdGender.unspecified")
          }
        })) return;
        const k = ji();
        if (k?.setPersona)
          k.setPersona({ ...G.value }), k.saveConfig?.();
        else {
          const P = JSON.parse(localStorage.getItem("0kay_config") || "{}");
          P.persona = { ...P.persona || {}, ...G.value }, localStorage.setItem("0kay_config", JSON.stringify(P));
        }
        ft(a("life.companion.flash.personaSaved"));
      } finally {
        vi.value = !1;
      }
    }
    io(Ln), Ye(Bt, (h) => {
      h === "persona" && Ln();
    }), io(me);
    const gi = tt("");
    let Ki;
    async function yi() {
      if (document.visibilityState === "visible")
        try {
          at.value = await Zo("/api/life/companion"), gi.value = (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        } catch {
        }
    }
    function kn() {
      document.visibilityState === "visible" && yi();
    }
    return io(() => {
      Ki = setInterval(() => {
        yi();
      }, 12e3), document.addEventListener("visibilitychange", kn);
    }), Eo(() => {
      Ki && clearInterval(Ki), document.removeEventListener("visibilitychange", kn);
    }), xa("life-plugin-kit", Ta("pcp")), (h, u) => (y(), b("main", {
      class: "pcp",
      ref_key: "pageEl",
      ref: pe
    }, [
      n("header", Aa, [
        n("div", Za, [
          n("div", Ia, [
            u[100] || (u[100] = n("p", { class: "eyebrow" }, [
              n("b", null, "◉"),
              U(" L.I.F.E / COGNITION")
            ], -1)),
            n("h1", null, l(a("life.companion.title")), 1),
            n("p", Ba, l(a("life.companion.subtitle")), 1)
          ]),
          n("div", Na, [
            n("button", {
              class: F(["btn", { tonic: !dt.value?.alive }]),
              disabled: ue.value || $.value,
              onClick: u[0] || (u[0] = (r) => dt.value?.alive ? dn() : cn())
            }, l(ue.value ? Ii() : dt.value?.alive ? a("life.companion.life.pause") : a("life.companion.life.start")), 11, Da),
            n("button", {
              class: "fab",
              disabled: ge.value || $.value,
              onClick: N
            }, [
              u[101] || (u[101] = n("span", { class: "fab-ic" }, "✦", -1)),
              U(l(ge.value ? a("life.companion.saving") : a("life.companion.saveSettings")), 1)
            ], 8, Ra),
            n("button", {
              class: "btn tonic",
              disabled: $.value,
              onClick: me
            }, l($.value ? a("life.companion.refreshing") : a("life.companion.refresh")), 9, Va)
          ])
        ]),
        n("div", Ua, [
          n("span", {
            class: F(["pill", { bad: T.value && !T.value.enabled }])
          }, l(a("life.companion.cognitionCore")) + " " + l(T.value?.available === !1 ? a("life.companion.status.unavailable") : T.value?.enabled ? a("life.companion.status.running") : a("life.companion.status.stopped")), 3),
          n("span", Fa, l(a("life.companion.state.decidedTurns", { n: A.value?.turns ?? 0 })), 1),
          n("span", Ha, l(a("life.companion.state.engrams", { n: A.value?.engrams ?? 0 })), 1),
          n("span", Wa, l(a("life.companion.state.lexicon", { n: Ot.value?.lexicon_size ?? 0 })), 1)
        ])
      ]),
      Le.value ? (y(), b("p", Ga, l(Le.value), 1)) : z("", !0),
      H.value ? (y(), b("p", qa, l(H.value), 1)) : z("", !0),
      n("nav", {
        class: "tabs",
        "aria-label": a("life.companion.view")
      }, [
        (y(), b(K, null, Lt(mt, (r) => n("button", {
          key: r.key,
          class: F(["tab", { active: Bt.value === r.key }]),
          onClick: (k) => lt(r.key)
        }, [
          n("i", null, l(r.i), 1),
          n("span", $a, l(r.icon), 1),
          U(l(a(r.labelKey)), 1)
        ], 10, Ka)), 64))
      ], 8, ja),
      w(n("section", Ya, [
        n("div", Ja, [
          n("div", null, [
            n("h2", null, l(a("life.companion.persona.title")), 1),
            n("p", Xa, l(a("life.companion.persona.desc")), 1)
          ]),
          n("div", Qa, [
            n("button", {
              class: "btn tonic sm",
              disabled: Ae.value || $.value,
              onClick: qt
            }, l(Ae.value ? a("life.companion.persona.analyzing") : a("life.companion.persona.analyze")), 9, ts),
            n("button", {
              class: "btn filled sm",
              disabled: vi.value || !m.value,
              onClick: Ke
            }, l(a("life.companion.persona.save")), 9, es)
          ])
        ]),
        n("article", is, [
          n("div", ns, [
            n("label", null, [
              n("span", null, l(a("life.companion.persona.name")), 1),
              w(n("input", {
                "onUpdate:modelValue": u[1] || (u[1] = (r) => G.value.name = r),
                class: "field"
              }, null, 512), [
                [M, G.value.name]
              ])
            ]),
            n("label", null, [
              n("span", null, l(a("life.companion.persona.gender")), 1),
              Et(Zt(It), {
                modelValue: G.value.gender,
                "onUpdate:modelValue": u[2] || (u[2] = (r) => G.value.gender = r),
                options: he.value,
                "aria-label": a("life.companion.persona.gender")
              }, null, 8, ["modelValue", "options", "aria-label"])
            ]),
            n("label", null, [
              n("span", null, l(a("life.companion.persona.avatarUrl")), 1),
              w(n("input", {
                "onUpdate:modelValue": u[3] || (u[3] = (r) => G.value.avatar = r),
                class: "field"
              }, null, 512), [
                [M, G.value.avatar]
              ])
            ]),
            n("label", null, [
              n("span", null, l(a("life.companion.persona.birthday")), 1),
              w(n("input", {
                "onUpdate:modelValue": u[4] || (u[4] = (r) => G.value.birthDate = r),
                type: "date",
                class: "field"
              }, null, 512), [
                [M, G.value.birthDate]
              ])
            ])
          ]),
          n("label", os, [
            n("span", null, l(a("life.companion.persona.description")), 1),
            w(n("textarea", {
              "onUpdate:modelValue": u[5] || (u[5] = (r) => G.value.description = r),
              rows: "3",
              class: "field"
            }, null, 512), [
              [M, G.value.description]
            ])
          ]),
          n("label", as, [
            n("span", null, l(a("life.companion.persona.personality")), 1),
            w(n("textarea", {
              "onUpdate:modelValue": u[6] || (u[6] = (r) => G.value.personality = r),
              rows: "3",
              class: "field"
            }, null, 512), [
              [M, G.value.personality]
            ])
          ]),
          n("label", ss, [
            n("span", null, l(a("life.companion.persona.greeting")), 1),
            w(n("textarea", {
              "onUpdate:modelValue": u[7] || (u[7] = (r) => G.value.greeting = r),
              rows: "2",
              class: "field"
            }, null, 512), [
              [M, G.value.greeting]
            ])
          ]),
          n("label", rs, [
            n("span", null, l(a("life.companion.persona.customPrompt")), 1),
            w(n("textarea", {
              "onUpdate:modelValue": u[8] || (u[8] = (r) => G.value.customPrompt = r),
              rows: "5",
              class: "field"
            }, null, 512), [
              [M, G.value.customPrompt]
            ])
          ]),
          n("p", ls, l(a("life.companion.persona.hint")), 1)
        ]),
        m.value ? (y(), b("article", us, [
          n("h3", null, [
            U(l(a("life.companion.persona.analysisResult")) + " ", 1),
            n("span", cs, l(m.value.source === "llm" ? a("life.companion.persona.sourceLlm") : a("life.companion.persona.sourceLocal")), 1)
          ]),
          n("div", ds, [
            n("label", null, [
              n("span", null, l(a("life.companion.persona.gender")), 1),
              Et(Zt(It), {
                modelValue: m.value.gender,
                "onUpdate:modelValue": u[9] || (u[9] = (r) => m.value.gender = r),
                options: he.value,
                "aria-label": a("life.companion.persona.gender")
              }, null, 8, ["modelValue", "options", "aria-label"])
            ]),
            n("label", null, [
              n("span", null, l(a("life.companion.persona.characterArchetype")), 1),
              Et(Zt(It), {
                modelValue: m.value.character.key,
                "onUpdate:modelValue": u[10] || (u[10] = (r) => m.value.character.key = r),
                options: qn.value,
                "aria-label": a("life.companion.persona.characterArchetype")
              }, null, 8, ["modelValue", "options", "aria-label"])
            ]),
            n("label", null, [
              n("span", null, l(a("life.companion.persona.relationshipType")), 1),
              Et(Zt(It), {
                modelValue: m.value.relationship.key,
                "onUpdate:modelValue": u[11] || (u[11] = (r) => m.value.relationship.key = r),
                options: Tn.value,
                "aria-label": a("life.companion.persona.relationshipTypeAria")
              }, null, 8, ["modelValue", "options", "aria-label"])
            ])
          ]),
          n("p", hs, [
            U(l(a("life.companion.persona.genderLine", { gender: kt(m.value.gender) })) + " ", 1),
            m.value.relationship?.label ? (y(), b(K, { key: 0 }, [
              U(l(a("life.companion.persona.relationshipLine", { label: m.value.relationship.label })) + " ", 1),
              m.value.relationship.pathological ? (y(), b(K, { key: 0 }, [
                U(l(a("life.companion.persona.pathologicalNote")), 1)
              ], 64)) : (y(), b(K, { key: 1 }, [
                U(l(a("life.companion.persona.healthyNote")), 1)
              ], 64))
            ], 64)) : z("", !0)
          ]),
          m.value.character?.expression || m.value.expression ? (y(), b("p", fs, l(a("life.companion.persona.speakingStyle", { style: m.value.character?.expression || m.value.expression })), 1)) : z("", !0),
          n("h4", null, l(a("life.companion.persona.emotionSomatic")), 1),
          n("div", ps, [
            n("label", null, [
              n("span", null, l(a("life.companion.persona.threatBaseline")), 1),
              w(n("input", {
                "onUpdate:modelValue": u[12] || (u[12] = (r) => m.value.traits.threat_baseline = r),
                type: "number",
                step: "0.05",
                min: "0",
                max: "1",
                class: "field tiny"
              }, null, 512), [
                [
                  M,
                  m.value.traits.threat_baseline,
                  void 0,
                  { number: !0 }
                ]
              ])
            ]),
            n("label", null, [
              n("span", null, l(a("life.companion.persona.rewardBaseline")), 1),
              w(n("input", {
                "onUpdate:modelValue": u[13] || (u[13] = (r) => m.value.traits.reward_baseline = r),
                type: "number",
                step: "0.1",
                min: "0",
                max: "2",
                class: "field tiny"
              }, null, 512), [
                [
                  M,
                  m.value.traits.reward_baseline,
                  void 0,
                  { number: !0 }
                ]
              ])
            ]),
            n("label", null, [
              n("span", null, l(a("life.companion.persona.catastrophizing")), 1),
              w(n("input", {
                "onUpdate:modelValue": u[14] || (u[14] = (r) => m.value.traits.catastrophizing = r),
                type: "number",
                step: "0.05",
                min: "0",
                max: "1",
                class: "field tiny"
              }, null, 512), [
                [
                  M,
                  m.value.traits.catastrophizing,
                  void 0,
                  { number: !0 }
                ]
              ])
            ]),
            n("label", null, [
              n("span", null, l(a("life.companion.persona.erqProfile")), 1),
              Et(Zt(It), {
                modelValue: m.value.traits.erq_profile,
                "onUpdate:modelValue": u[15] || (u[15] = (r) => m.value.traits.erq_profile = r),
                options: Oi.value,
                "aria-label": a("life.companion.persona.erqProfile")
              }, null, 8, ["modelValue", "options", "aria-label"])
            ]),
            n("label", null, [
              n("span", null, l(a("life.companion.persona.sleepHour")), 1),
              w(n("input", {
                "onUpdate:modelValue": u[16] || (u[16] = (r) => m.value.traits.sleep_hour = r),
                type: "number",
                min: "0",
                max: "23",
                class: "field tiny"
              }, null, 512), [
                [
                  M,
                  m.value.traits.sleep_hour,
                  void 0,
                  { number: !0 }
                ]
              ])
            ])
          ]),
          n("h4", null, l(a("life.companion.persona.personalityDims")), 1),
          n("div", ms, [
            n("label", null, [
              n("span", null, l(a("life.companion.persona.extraversion")), 1),
              w(n("input", {
                "onUpdate:modelValue": u[17] || (u[17] = (r) => m.value.traits.extraversion = r),
                type: "number",
                step: "0.05",
                min: "0",
                max: "1",
                class: "field tiny"
              }, null, 512), [
                [
                  M,
                  m.value.traits.extraversion,
                  void 0,
                  { number: !0 }
                ]
              ])
            ]),
            n("label", null, [
              n("span", null, l(a("life.companion.persona.agreeableness")), 1),
              w(n("input", {
                "onUpdate:modelValue": u[18] || (u[18] = (r) => m.value.traits.agreeableness = r),
                type: "number",
                step: "0.05",
                min: "0",
                max: "1",
                class: "field tiny"
              }, null, 512), [
                [
                  M,
                  m.value.traits.agreeableness,
                  void 0,
                  { number: !0 }
                ]
              ])
            ]),
            n("label", null, [
              n("span", null, l(a("life.companion.persona.conscientiousness")), 1),
              w(n("input", {
                "onUpdate:modelValue": u[19] || (u[19] = (r) => m.value.traits.conscientiousness = r),
                type: "number",
                step: "0.05",
                min: "0",
                max: "1",
                class: "field tiny"
              }, null, 512), [
                [
                  M,
                  m.value.traits.conscientiousness,
                  void 0,
                  { number: !0 }
                ]
              ])
            ]),
            n("label", null, [
              n("span", null, l(a("life.companion.persona.openness")), 1),
              w(n("input", {
                "onUpdate:modelValue": u[20] || (u[20] = (r) => m.value.traits.openness = r),
                type: "number",
                step: "0.05",
                min: "0",
                max: "1",
                class: "field tiny"
              }, null, 512), [
                [
                  M,
                  m.value.traits.openness,
                  void 0,
                  { number: !0 }
                ]
              ])
            ]),
            n("label", null, [
              n("span", null, l(a("life.companion.persona.attachAnxiety")), 1),
              w(n("input", {
                "onUpdate:modelValue": u[21] || (u[21] = (r) => m.value.traits.attach_anxiety = r),
                type: "number",
                step: "0.05",
                min: "0",
                max: "1",
                class: "field tiny"
              }, null, 512), [
                [
                  M,
                  m.value.traits.attach_anxiety,
                  void 0,
                  { number: !0 }
                ]
              ])
            ]),
            n("label", null, [
              n("span", null, l(a("life.companion.persona.attachAvoidance")), 1),
              w(n("input", {
                "onUpdate:modelValue": u[22] || (u[22] = (r) => m.value.traits.attach_avoidance = r),
                type: "number",
                step: "0.05",
                min: "0",
                max: "1",
                class: "field tiny"
              }, null, 512), [
                [
                  M,
                  m.value.traits.attach_avoidance,
                  void 0,
                  { number: !0 }
                ]
              ])
            ])
          ]),
          n("details", _s, [
            n("summary", null, l(a("life.companion.persona.moreStyle")), 1),
            n("div", vs, [
              n("label", null, [
                n("span", null, l(a("life.companion.persona.expressiveness")), 1),
                w(n("input", {
                  "onUpdate:modelValue": u[23] || (u[23] = (r) => m.value.traits.expressiveness = r),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    M,
                    m.value.traits.expressiveness,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              n("label", null, [
                n("span", null, l(a("life.companion.persona.initiative")), 1),
                w(n("input", {
                  "onUpdate:modelValue": u[24] || (u[24] = (r) => m.value.traits.initiative = r),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    M,
                    m.value.traits.initiative,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              n("label", null, [
                n("span", null, l(a("life.companion.persona.humor")), 1),
                w(n("input", {
                  "onUpdate:modelValue": u[25] || (u[25] = (r) => m.value.traits.humor = r),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    M,
                    m.value.traits.humor,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              n("label", null, [
                n("span", null, l(a("life.companion.persona.warmth")), 1),
                w(n("input", {
                  "onUpdate:modelValue": u[26] || (u[26] = (r) => m.value.traits.warmth = r),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    M,
                    m.value.traits.warmth,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              n("label", null, [
                n("span", null, l(a("life.companion.persona.formality")), 1),
                w(n("input", {
                  "onUpdate:modelValue": u[27] || (u[27] = (r) => m.value.traits.formality = r),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    M,
                    m.value.traits.formality,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              n("label", null, [
                n("span", null, l(a("life.companion.persona.assertiveness")), 1),
                w(n("input", {
                  "onUpdate:modelValue": u[28] || (u[28] = (r) => m.value.traits.assertiveness = r),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    M,
                    m.value.traits.assertiveness,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ])
            ])
          ]),
          m.value.attachment.type ? (y(), b(K, { key: 1 }, [
            n("h4", null, l(a("life.companion.persona.attachmentHeading", { label: m.value.relationship.label })), 1),
            n("div", gs, [
              n("label", null, [
                n("span", null, l(a("life.companion.persona.attachTypeByRelationship")), 1),
                n("input", {
                  class: "field",
                  value: a("life.companion.attachmentTypeValue", { type: m.value.attachment.type, label: m.value.relationship.label || "" }),
                  disabled: ""
                }, null, 8, ys)
              ]),
              n("label", null, [
                n("span", null, l(a("life.companion.persona.initialAnxietyX")), 1),
                w(n("input", {
                  "onUpdate:modelValue": u[29] || (u[29] = (r) => m.value.attachment.initial.X = r),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    M,
                    m.value.attachment.initial.X,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              n("label", null, [
                n("span", null, l(a("life.companion.persona.initialSecurityS")), 1),
                w(n("input", {
                  "onUpdate:modelValue": u[30] || (u[30] = (r) => m.value.attachment.initial.S = r),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    M,
                    m.value.attachment.initial.S,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ])
            ]),
            n("p", bs, l(a("life.companion.persona.attachmentHint")), 1)
          ], 64)) : (y(), b("p", ws, l(a("life.companion.persona.attachmentDisabled")), 1)),
          m.value.tsundere && m.value.tsundere.type ? (y(), b(K, { key: 3 }, [
            n("h4", null, l(a("life.companion.persona.tsundereHeading")), 1),
            n("div", xs, [
              n("label", null, [
                n("span", null, l(a("life.companion.persona.tsundereType")), 1),
                n("input", {
                  class: "field",
                  value: m.value.tsundere.type,
                  disabled: ""
                }, null, 8, Ps)
              ]),
              n("label", null, [
                n("span", null, l(a("life.companion.persona.initialAffectionA")), 1),
                w(n("input", {
                  "onUpdate:modelValue": u[31] || (u[31] = (r) => m.value.tsundere.initial.A = r),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    M,
                    m.value.tsundere.initial.A,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              n("label", null, [
                n("span", null, l(a("life.companion.persona.initialTsunExpressionT")), 1),
                w(n("input", {
                  "onUpdate:modelValue": u[32] || (u[32] = (r) => m.value.tsundere.initial.T = r),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    M,
                    m.value.tsundere.initial.T,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              n("label", null, [
                n("span", null, l(a("life.companion.persona.initialYandereY")), 1),
                w(n("input", {
                  "onUpdate:modelValue": u[33] || (u[33] = (r) => m.value.tsundere.initial.Y = r),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    M,
                    m.value.tsundere.initial.Y,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ])
            ]),
            n("p", Ls, l(a("life.companion.persona.tsundereHint")), 1)
          ], 64)) : (y(), b("p", Ts, l(a("life.companion.persona.tsundereDisabled")), 1)),
          m.value.personadyn && m.value.personadyn.type ? (y(), b(K, { key: 5 }, [
            n("h4", null, l(a("life.companion.persona.personadynHeading")), 1),
            n("div", ks, [
              n("label", null, [
                n("span", null, l(a("life.companion.persona.personaArchetype")), 1),
                n("input", {
                  class: "field",
                  value: m.value.personadyn.type,
                  disabled: ""
                }, null, 8, Ss)
              ]),
              n("label", null, [
                n("span", null, l(a("life.companion.persona.initialAffectionA")), 1),
                w(n("input", {
                  "onUpdate:modelValue": u[34] || (u[34] = (r) => m.value.personadyn.initial.A = r),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    M,
                    m.value.personadyn.initial.A,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              n("label", null, [
                n("span", null, l(a("life.companion.persona.initialAnxietyX")), 1),
                w(n("input", {
                  "onUpdate:modelValue": u[35] || (u[35] = (r) => m.value.personadyn.initial.X = r),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    M,
                    m.value.personadyn.initial.X,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              n("label", null, [
                n("span", null, l(a("life.companion.persona.initialPossessionO")), 1),
                w(n("input", {
                  "onUpdate:modelValue": u[36] || (u[36] = (r) => m.value.personadyn.initial.O = r),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    M,
                    m.value.personadyn.initial.O,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              n("label", null, [
                n("span", null, l(a("life.companion.persona.initialTrustTr")), 1),
                w(n("input", {
                  "onUpdate:modelValue": u[37] || (u[37] = (r) => m.value.personadyn.initial.Tr = r),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    M,
                    m.value.personadyn.initial.Tr,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              n("label", null, [
                n("span", null, l(a("life.companion.persona.initialSelfControlK")), 1),
                w(n("input", {
                  "onUpdate:modelValue": u[38] || (u[38] = (r) => m.value.personadyn.initial.K = r),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    M,
                    m.value.personadyn.initial.K,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              n("label", null, [
                n("span", null, l(a("life.companion.persona.genderSocialScript")), 1),
                Et(Zt(It), {
                  modelValue: m.value.personadynGender,
                  "onUpdate:modelValue": u[39] || (u[39] = (r) => m.value.personadynGender = r),
                  options: Qe.value,
                  "aria-label": a("life.companion.persona.genderSocialScriptAria")
                }, null, 8, ["modelValue", "options", "aria-label"])
              ])
            ]),
            n("p", Cs, l(a("life.companion.persona.personadynHint")), 1)
          ], 64)) : (y(), b("p", Ms, l(a("life.companion.persona.personadynDisabled")), 1))
        ])) : z("", !0)
      ], 512), [
        [nn, Bt.value === "persona"]
      ]),
      w(n("section", zs, [
        n("div", Os, [
          n("div", null, [
            n("h2", null, l(a("life.companion.cognition.title")), 1),
            n("p", Es, l(a("life.companion.cognition.desc")), 1)
          ]),
          n("div", As, [
            n("button", {
              class: "btn filled sm",
              disabled: ge.value,
              onClick: N
            }, l(ge.value ? a("life.companion.saving") : a("life.companion.saveSettings")), 9, Zs)
          ])
        ]),
        n("article", Is, [
          n("h3", null, [
            U(l(a("life.companion.life.title")) + " ", 1),
            n("span", {
              class: F(["count-pill", { ok: dt.value?.alive }])
            }, l(dt.value?.alive ? a("life.companion.life.alive") : a("life.companion.life.notStarted")), 3)
          ]),
          n("div", Bs, [
            n("div", Ns, [
              n("span", null, l(a("life.companion.life.status")), 1),
              n("strong", null, l(dt.value?.alive ? a("life.companion.life.alive") : a("life.companion.life.notStarted")), 1)
            ]),
            n("div", Ds, [
              n("span", null, l(a("life.companion.life.livedFor")), 1),
              n("strong", null, l(un()), 1)
            ]),
            n("div", Rs, [
              n("span", null, l(a("life.companion.life.ticks")), 1),
              n("strong", null, l(dt.value?.ticks ?? 0), 1)
            ]),
            n("div", Vs, [
              n("span", null, l(a("life.companion.life.residentThinking")), 1),
              n("strong", null, l(dt.value?.resident_running ? a("life.companion.status.running") : a("life.companion.status.stopped")), 1)
            ]),
            n("div", Us, [
              n("span", null, l(a("life.companion.life.proactive")), 1),
              n("strong", null, l(dt.value?.proactive_enabled ? a("life.companion.on") : a("life.companion.off")), 1)
            ]),
            n("div", Fs, [
              n("span", null, l(a("life.companion.life.lastThought")), 1),
              n("strong", null, l((dt.value?.last_tick || "").slice(0, 16).replace("T", " ") || "—"), 1)
            ])
          ]),
          dt.value?.last_thought ? (y(), b("p", Hs, l(a("life.companion.life.currentThought", { text: dt.value.last_thought })), 1)) : z("", !0),
          dt.value?.focus ? (y(), b("p", Ws, l(a("life.companion.life.focus", { text: dt.value.focus })), 1)) : z("", !0),
          dt.value?.active_goal ? (y(), b("p", Gs, l(a("life.companion.life.goal", { text: dt.value.active_goal })), 1)) : z("", !0),
          n("div", qs, [
            n("label", js, [
              w(n("input", {
                type: "checkbox",
                "onUpdate:modelValue": u[40] || (u[40] = (r) => De.value = r)
              }, null, 512), [
                [ct, De.value]
              ]),
              n("span", null, l(a("life.companion.life.greetOnStart")), 1)
            ]),
            n("button", {
              class: F(["btn sm", { filled: !dt.value?.alive }]),
              disabled: ue.value || $.value,
              onClick: u[41] || (u[41] = (r) => dt.value?.alive ? dn() : cn())
            }, l(ue.value ? Ii() : dt.value?.alive ? a("life.companion.life.pause") : a("life.companion.life.start")), 11, Ks)
          ]),
          n("p", $s, l(a("life.companion.life.hint")), 1)
        ]),
        n("article", Ys, [
          n("h3", null, [
            U(l(a("life.companion.realtime.title")) + " ", 1),
            n("span", {
              class: F(["count-pill", { ok: T.value?.enabled }])
            }, l(T.value?.enabled ? a("life.companion.status.running") : a("life.companion.status.stopped")), 3),
            gi.value ? (y(), b("span", Js, l(a("life.companion.realtime.updatedAt", { time: gi.value })), 1)) : z("", !0)
          ]),
          T.value ? (y(), b(K, { key: 1 }, [
            n("div", Qs, l(a("life.companion.realtime.atAGlance")), 1),
            n("p", tr, l(a("life.companion.realtime.atAGlanceHint")), 1),
            n("div", er, [
              ii.value ? (y(), b("div", {
                key: 0,
                class: "mood-plot-wrap",
                role: "img",
                "aria-label": a(vn.value)
              }, [
                n("span", nr, l(a("life.companion.axis.arousalHigh")), 1),
                n("span", or, l(a("life.companion.axis.arousalLow")), 1),
                n("span", ar, l(a("life.companion.axis.valenceLow")), 1),
                n("span", sr, l(a("life.companion.axis.valenceHigh")), 1),
                (y(), b("svg", rr, [
                  u[102] || (u[102] = n("rect", {
                    class: "plot-frame",
                    x: "10",
                    y: "10",
                    width: "100",
                    height: "100",
                    rx: "12"
                  }, null, -1)),
                  u[103] || (u[103] = n("line", {
                    class: "plot-grid",
                    x1: "60",
                    y1: "10",
                    x2: "60",
                    y2: "110"
                  }, null, -1)),
                  u[104] || (u[104] = n("line", {
                    class: "plot-grid",
                    x1: "10",
                    y1: "60",
                    x2: "110",
                    y2: "60"
                  }, null, -1)),
                  n("circle", {
                    class: "plot-halo",
                    cx: Fe.value.x,
                    cy: Fe.value.y,
                    r: "12"
                  }, null, 8, lr),
                  n("circle", {
                    class: "plot-dot",
                    cx: Fe.value.x,
                    cy: Fe.value.y,
                    r: "5"
                  }, null, 8, ur)
                ])),
                n("span", cr, l(a(vn.value)), 1)
              ], 8, ir)) : z("", !0),
              n("div", dr, [
                n("p", hr, l(a("life.companion.realtime.section.mood")), 1),
                (y(!0), b(K, null, Lt(Un.value, (r) => (y(), b("div", {
                  key: r.label,
                  class: "gauge",
                  title: r.effect
                }, [
                  n("span", pr, [
                    n("span", mr, [
                      U(l(r.label), 1),
                      n("em", _r, l(r.alias), 1)
                    ]),
                    n("span", vr, [
                      n("b", {
                        class: F(["gauge-state", r.stateTone])
                      }, l(r.state), 3),
                      U(" " + l(r.display), 1)
                    ])
                  ]),
                  n("span", {
                    class: F(["gauge-bar", { signed: r.signed }])
                  }, [
                    n("i", {
                      class: F(["gauge-fill", r.signed ? r.value >= 0 ? "good" : "bad" : ae(r)]),
                      style: jt(r.signed ? $t(r.value) : { width: (oe(r) * 100).toFixed(1) + "%" })
                    }, null, 6)
                  ], 2),
                  n("span", gr, l(r.effect), 1)
                ], 8, fr))), 128))
              ]),
              n("div", yr, [
                n("p", br, [
                  U(l(a("life.companion.body.title")) + " ", 1),
                  n("span", {
                    class: F(["chip", { muted: ke.value?.is_sleeping, ok: ke.value && !ke.value.is_sleeping }])
                  }, l(ke.value ? ke.value.is_sleeping ? a("life.companion.body.sleeping") : a("life.companion.body.awake") : "—"), 3)
                ]),
                (y(!0), b(K, null, Lt(Fn.value, (r) => (y(), b("div", {
                  key: r.label,
                  class: "gauge",
                  title: r.effect
                }, [
                  n("span", xr, [
                    n("span", Pr, [
                      U(l(r.label), 1),
                      n("em", Lr, l(r.alias), 1)
                    ]),
                    n("span", Tr, [
                      n("b", {
                        class: F(["gauge-state", r.stateTone])
                      }, l(r.state), 3),
                      U(" " + l(r.display), 1)
                    ])
                  ]),
                  n("span", {
                    class: F(["gauge-bar", { signed: r.signed }])
                  }, [
                    n("i", {
                      class: F(["gauge-fill", r.signed ? r.value >= 0 ? "good" : "bad" : ae(r)]),
                      style: jt(r.signed ? $t(r.value) : { width: (oe(r) * 100).toFixed(1) + "%" })
                    }, null, 6)
                  ], 2),
                  n("span", kr, l(r.effect), 1)
                ], 8, wr))), 128))
              ])
            ]),
            n("div", Sr, l(a("life.companion.realtime.section.mood")), 1),
            n("p", Cr, l(a("life.companion.realtime.sectionSub.mood")), 1),
            n("div", Mr, [
              (y(!0), b(K, null, Lt(Hn.value, (r) => (y(), b("div", {
                key: r.label,
                class: "gauge",
                title: r.effect
              }, [
                n("span", Or, [
                  n("span", Er, [
                    U(l(r.label), 1),
                    n("em", Ar, l(r.alias), 1)
                  ]),
                  n("span", Zr, [
                    n("b", {
                      class: F(["gauge-state", r.stateTone])
                    }, l(r.state), 3),
                    U(" " + l(r.display), 1)
                  ])
                ]),
                n("span", {
                  class: F(["gauge-bar", { signed: r.signed }])
                }, [
                  n("i", {
                    class: F(["gauge-fill", r.signed ? r.value >= 0 ? "good" : "bad" : ae(r)]),
                    style: jt(r.signed ? $t(r.value) : { width: (oe(r) * 100).toFixed(1) + "%" })
                  }, null, 6)
                ], 2),
                n("span", Ir, l(r.effect), 1)
              ], 8, zr))), 128))
            ]),
            Ni.value ? (y(), b("div", Br, [
              (y(!0), b(K, null, Lt(Ni.value, (r, k) => (y(), b("div", {
                key: k,
                class: "som-chan"
              }, [
                n("span", Nr, l(fn(k)), 1),
                n("span", Dr, [
                  n("i", {
                    style: jt({ transform: "scaleX(" + pn(r) + ")" })
                  }, null, 4)
                ]),
                n("span", Rr, l(vt(r, 2)), 1)
              ]))), 128)),
              Number(Y.value?.somatic_chronicity) > 0.1 ? (y(), b("p", Vr, l(a("life.companion.realtime.somaticChronicity", { value: vt(Y.value?.somatic_chronicity) })), 1)) : z("", !0)
            ])) : z("", !0),
            Ct.value || pt.value ? (y(), b(K, { key: 1 }, [
              n("div", Ur, l(a("life.companion.realtime.section.social")), 1),
              n("p", Fr, l(a("life.companion.realtime.sectionSub.social")), 1),
              n("div", Hr, [
                (y(!0), b(K, null, Lt(Wn.value, (r) => (y(), b("div", {
                  key: r.label,
                  class: "gauge",
                  title: r.effect
                }, [
                  n("span", Gr, [
                    n("span", qr, [
                      U(l(r.label), 1),
                      n("em", jr, l(r.alias), 1)
                    ]),
                    n("span", Kr, [
                      n("b", {
                        class: F(["gauge-state", r.stateTone])
                      }, l(r.state), 3),
                      U(" " + l(r.display), 1)
                    ])
                  ]),
                  n("span", {
                    class: F(["gauge-bar", { signed: r.signed }])
                  }, [
                    n("i", {
                      class: F(["gauge-fill", r.signed ? r.value >= 0 ? "good" : "bad" : ae(r)]),
                      style: jt(r.signed ? $t(r.value) : { width: (oe(r) * 100).toFixed(1) + "%" })
                    }, null, 6)
                  ], 2),
                  n("span", $r, l(r.effect), 1)
                ], 8, Wr))), 128))
              ]),
              n("div", Yr, [
                n("span", Jr, l(a("life.companion.metric.perspectiveStage")) + " " + l(Ct.value?.perspective_name || "—"), 1),
                n("span", Xr, l(a("life.companion.metric.attentionState")) + " " + l(pt.value?.attention_state || "—"), 1)
              ])
            ], 64)) : z("", !0),
            Z.value?.enabled ? (y(), b(K, { key: 2 }, [
              n("div", Qr, l(a("life.companion.realtime.section.attachment")), 1),
              n("p", tl, l(a("life.companion.realtime.sectionSub.attachment")), 1),
              n("div", el, [
                n("span", il, l(Z.value.label || Z.value.type), 1),
                n("span", nl, l(a("life.companion.metric.severity")) + " " + l(vt(Z.value.severity, 2)) + " · " + l(Z.value.band), 1),
                n("span", ol, l(a("life.companion.metric.dominantTendency")) + " " + l(Z.value.dominant || "—"), 1),
                n("span", {
                  class: F(["chip", Z.value.safe_mode ? "warn" : "muted"])
                }, l(a("life.companion.metric.safetyLayer")) + " " + l(Z.value.safe_mode ? a("life.companion.metric.triggered") : a("life.companion.metric.normal")), 3)
              ]),
              n("div", al, [
                (y(!0), b(K, null, Lt(Jt.value, (r) => (y(), b("div", {
                  key: r.label,
                  class: "gauge",
                  title: r.effect
                }, [
                  n("span", rl, [
                    n("span", ll, [
                      U(l(r.label), 1),
                      n("em", ul, l(r.alias), 1)
                    ]),
                    n("span", cl, [
                      n("b", {
                        class: F(["gauge-state", r.stateTone])
                      }, l(r.state), 3),
                      U(" " + l(r.display), 1)
                    ])
                  ]),
                  n("span", {
                    class: F(["gauge-bar", { signed: r.signed }])
                  }, [
                    n("i", {
                      class: F(["gauge-fill", r.signed ? r.value >= 0 ? "good" : "bad" : ae(r)]),
                      style: jt(r.signed ? $t(r.value) : { width: (oe(r) * 100).toFixed(1) + "%" })
                    }, null, 6)
                  ], 2),
                  n("span", dl, l(r.effect), 1)
                ], 8, sl))), 128))
              ])
            ], 64)) : z("", !0),
            ut.value?.enabled ? (y(), b(K, { key: 3 }, [
              n("div", hl, l(a("life.companion.realtime.section.tsundere")), 1),
              n("p", fl, l(a("life.companion.realtime.sectionSub.tsundere")), 1),
              n("div", pl, [
                n("span", ml, l(ut.value.label || ut.value.type), 1),
                n("span", {
                  class: F(["chip", ut.value.safe_mode ? "warn" : "muted"])
                }, l(a("life.companion.metric.safetyLayer")) + " " + l(ut.value.safe_mode ? a("life.companion.metric.triggered") : a("life.companion.metric.normal")), 3)
              ]),
              n("div", _l, [
                (y(!0), b(K, null, Lt(S.value, (r) => (y(), b("div", {
                  key: r.label,
                  class: "gauge",
                  title: r.effect
                }, [
                  n("span", gl, [
                    n("span", yl, [
                      U(l(r.label), 1),
                      n("em", bl, l(r.alias), 1)
                    ]),
                    n("span", wl, [
                      n("b", {
                        class: F(["gauge-state", r.stateTone])
                      }, l(r.state), 3),
                      U(" " + l(r.display), 1)
                    ])
                  ]),
                  n("span", {
                    class: F(["gauge-bar", { signed: r.signed }])
                  }, [
                    n("i", {
                      class: F(["gauge-fill", r.signed ? r.value >= 0 ? "good" : "bad" : ae(r)]),
                      style: jt(r.signed ? $t(r.value) : { width: (oe(r) * 100).toFixed(1) + "%" })
                    }, null, 6)
                  ], 2),
                  n("span", xl, l(r.effect), 1)
                ], 8, vl))), 128))
              ])
            ], 64)) : z("", !0),
            Tt.value?.enabled ? (y(), b(K, { key: 4 }, [
              n("div", Pl, l(a("life.companion.realtime.section.yandere")), 1),
              n("p", Ll, l(a("life.companion.realtime.sectionSub.yandere")), 1),
              n("div", Tl, [
                n("span", kl, l(Tt.value.label || Tt.value.type), 1),
                n("span", Sl, l(a("life.companion.metric.yandereMode")) + " " + l(Tt.value.mode) + " · " + l(Tt.value.label_russell), 1),
                n("span", {
                  class: F(["chip", Tt.value.safe_mode ? "warn" : "muted"])
                }, l(a("life.companion.metric.safetyLayer")) + " " + l(Tt.value.safe_mode ? a("life.companion.metric.triggered") : a("life.companion.metric.normal")), 3)
              ]),
              n("div", Cl, [
                (y(!0), b(K, null, Lt(yn.value, (r) => (y(), b("div", {
                  key: r.label,
                  class: "gauge",
                  title: r.effect
                }, [
                  n("span", zl, [
                    n("span", Ol, [
                      U(l(r.label), 1),
                      n("em", El, l(r.alias), 1)
                    ]),
                    n("span", Al, [
                      n("b", {
                        class: F(["gauge-state", r.stateTone])
                      }, l(r.state), 3),
                      U(" " + l(r.display), 1)
                    ])
                  ]),
                  n("span", {
                    class: F(["gauge-bar", { signed: r.signed }])
                  }, [
                    n("i", {
                      class: F(["gauge-fill", r.signed ? r.value >= 0 ? "good" : "bad" : ae(r)]),
                      style: jt(r.signed ? $t(r.value) : { width: (oe(r) * 100).toFixed(1) + "%" })
                    }, null, 6)
                  ], 2),
                  n("span", Zl, l(r.effect), 1)
                ], 8, Ml))), 128))
              ])
            ], 64)) : z("", !0),
            B.value?.enabled ? (y(), b(K, { key: 5 }, [
              n("div", Il, l(a("life.companion.realtime.section.pd")), 1),
              n("p", Bl, l(a("life.companion.realtime.sectionSub.pd")), 1),
              n("div", Nl, [
                n("span", Dl, l(B.value.label || B.value.type), 1),
                n("span", Rl, l(a("life.companion.metric.emergentMode")) + " " + l(B.value.mode_label || B.value.mode) + " · " + l(B.value.band), 1),
                B.value.gender ? (y(), b("span", Vl, l(B.value.gender), 1)) : z("", !0),
                B.value.clinical ? (y(), b("span", Ul, l(a("life.companion.simulationMode")), 1)) : z("", !0)
              ]),
              n("div", Fl, [
                (y(!0), b(K, null, Lt(bn.value, (r) => (y(), b("div", {
                  key: r.label,
                  class: "gauge",
                  title: r.effect
                }, [
                  n("span", Wl, [
                    n("span", Gl, [
                      U(l(r.label), 1),
                      n("em", ql, l(r.alias), 1)
                    ]),
                    n("span", jl, [
                      n("b", {
                        class: F(["gauge-state", r.stateTone])
                      }, l(r.state), 3),
                      U(" " + l(r.display), 1)
                    ])
                  ]),
                  n("span", {
                    class: F(["gauge-bar", { signed: r.signed }])
                  }, [
                    n("i", {
                      class: F(["gauge-fill", r.signed ? r.value >= 0 ? "good" : "bad" : ae(r)]),
                      style: jt(r.signed ? $t(r.value) : { width: (oe(r) * 100).toFixed(1) + "%" })
                    }, null, 6)
                  ], 2),
                  n("span", Kl, l(r.effect), 1)
                ], 8, Hl))), 128))
              ]),
              n("details", $l, [
                n("summary", null, l(a("life.companion.realtime.moreReadouts")), 1),
                n("div", Yl, [
                  B.value.help_seek != null ? (y(), b("div", Jl, [
                    n("span", null, l(a("life.companion.metric.helpSeeking")), 1),
                    n("strong", null, l(vt(B.value.help_seek, 2)), 1)
                  ])) : z("", !0),
                  B.value.big5 ? (y(), b("div", Xl, [
                    u[105] || (u[105] = n("span", null, "Big5 O·C·E·A·N", -1)),
                    n("strong", null, l(Ei.value), 1)
                  ])) : z("", !0),
                  B.value.hexaco ? (y(), b("div", Ql, [
                    u[106] || (u[106] = n("span", null, "HEXACO H·E·X·A·C·O", -1)),
                    n("strong", null, l(Ai.value), 1)
                  ])) : z("", !0),
                  B.value.mbti ? (y(), b("div", tu, [
                    u[107] || (u[107] = n("span", null, "MBTI / DISC", -1)),
                    n("strong", null, l(B.value.mbti) + " · " + l(B.value.disc || "—"), 1)
                  ])) : z("", !0),
                  B.value.theta_dim ? (y(), b("div", eu, [
                    n("span", null, l(a("life.companion.metric.thetaDim")), 1),
                    n("strong", null, l(a("life.companion.dimensionsValue", { n: B.value.theta_dim })) + " · " + l(B.value.family || "—"), 1)
                  ])) : z("", !0),
                  ti.value.length ? (y(), b("div", iu, [
                    n("span", null, l(a("life.companion.metric.topDesires")), 1),
                    n("strong", null, l(ti.value.join(" · ")), 1)
                  ])) : z("", !0),
                  rn.value.length ? (y(), b("div", nu, [
                    n("span", null, l(a("life.companion.metric.topEmotions")), 1),
                    n("strong", null, l(rn.value.join(" · ")), 1)
                  ])) : z("", !0),
                  B.value.learning?.enabled ? (y(), b("div", ou, [
                    n("span", null, l(a("life.companion.metric.learningState")), 1),
                    n("strong", null, l(B.value.learning.q_size) + " · " + l(vt(ln.value, 3)), 1)
                  ])) : z("", !0)
                ])
              ])
            ], 64)) : z("", !0),
            n("details", au, [
              n("summary", null, l(a("life.companion.realtime.moreReadouts")), 1),
              n("div", su, [
                n("div", ru, [
                  n("span", null, l(a("life.companion.metric.arbitrationMode")), 1),
                  n("strong", null, l(Ne.value?.mode || "—"), 1)
                ]),
                n("div", lu, [
                  n("span", null, l(a("life.companion.metric.currentStrategy")), 1),
                  n("strong", null, l(Ne.value?.action || "—"), 1)
                ]),
                n("div", uu, [
                  n("span", null, l(a("life.companion.metric.controlNeed")), 1),
                  n("strong", null, l(vt(Ne.value?.need)), 1)
                ]),
                n("div", cu, [
                  n("span", null, l(a("life.companion.metric.confidence")), 1),
                  n("strong", null, l(vt(Ne.value?.confidence)), 1)
                ]),
                n("div", du, [
                  n("span", null, l(a("life.companion.metric.decidedTurns")), 1),
                  n("strong", null, l(A.value?.turns ?? 0), 1)
                ]),
                n("div", hu, [
                  n("span", null, l(a("life.companion.metric.engrams")), 1),
                  n("strong", null, l(A.value?.engrams ?? 0), 1)
                ]),
                n("div", fu, [
                  n("span", null, l(a("life.companion.metric.reliability")), 1),
                  n("strong", null, l(vt(A.value?.reliability)), 1)
                ]),
                n("div", pu, [
                  n("span", null, l(a("life.companion.metric.personaTraits")), 1),
                  n("strong", null, l(J.value?.applied ? J.value.source === "llm" ? a("life.companion.metric.appliedLlm") : a("life.companion.metric.appliedLocal") : a("life.companion.metric.notParsed")), 1)
                ]),
                n("div", mu, [
                  n("span", null, l(a("life.companion.metric.lexicon")), 1),
                  n("strong", null, l(Ot.value?.lexicon_size ?? 0), 1)
                ]),
                ne.value ? (y(), b(K, { key: 0 }, [
                  n("div", _u, [
                    n("span", null, l(a("life.companion.metric.episodeCourse")), 1),
                    n("strong", null, l(Zi(ne.value.state)), 1)
                  ]),
                  n("div", vu, [
                    n("span", null, l(a("life.companion.metric.episodeSeverity")), 1),
                    n("strong", null, l(vt(ne.value.severity, 2)), 1)
                  ]),
                  n("div", gu, [
                    n("span", null, l(a("life.companion.metric.episodesRelapses")), 1),
                    n("strong", null, l(ne.value.episodes) + " / " + l(ne.value.relapses), 1)
                  ]),
                  ne.value.state === "episode" ? (y(), b("div", yu, [
                    n("span", null, l(a("life.companion.metric.duration")), 1),
                    n("strong", null, l(a("life.companion.daysValue", { n: vt(ne.value.days_in_episode, 1) })), 1)
                  ])) : z("", !0)
                ], 64)) : z("", !0)
              ])
            ])
          ], 64)) : (y(), b("div", Xs, l(a("life.companion.realtime.empty")), 1)),
          ne.value ? (y(), b("p", bu, l(a("life.companion.realtime.episodeHint")), 1)) : z("", !0),
          Z.value?.enabled ? (y(), b("p", wu, l(a("life.companion.realtime.attachmentHint", { label: Z.value.label, severity: vt(Z.value.severity, 2), band: Z.value.band, safety: Z.value.safe_mode ? a("life.companion.realtime.safetyOnEmotion") : a("life.companion.realtime.safetyOff") })), 1)) : z("", !0),
          ut.value?.enabled ? (y(), b("p", xu, l(a("life.companion.realtime.tsundereHint", { label: ut.value.label || ut.value.type, affection: vt(ut.value.affection, 2), expression: vt(ut.value.expression, 2), fixation: vt(ut.value.fixation, 2), band: ut.value.band, safety: ut.value.safe_mode ? a("life.companion.realtime.safetyOnFeeling") : a("life.companion.realtime.safetyOff") })), 1)) : z("", !0),
          B.value?.enabled ? (y(), b("p", Pu, l(a("life.companion.realtime.personadynHint", { label: B.value.label || B.value.type, family: B.value.family || "—", theta: B.value.theta_dim, mode: B.value.mode_label || B.value.mode, pressure: vt(B.value.pressure, 2), band: B.value.band, gender: B.value.gender || gt("life.companion.pdGender.unspecified"), learning: B.value.learning?.enabled ? a("life.companion.realtime.learningOnline") : "", safety: B.value.safe_mode ? a("life.companion.realtime.safetyOnFeeling") : a("life.companion.realtime.safetyOff") })), 1)) : z("", !0),
          J.value?.applied ? (y(), b("p", Lu, l(a("life.companion.realtime.personaApplied", { source: J.value.source === "llm" ? a("life.companion.realtime.personaSourceLlm") : a("life.companion.realtime.personaSourceLocal"), evidence: mn.value || "—" })), 1)) : z("", !0)
        ]),
        n("article", Tu, [
          n("h3", null, l(a("life.companion.switches.title")), 1),
          n("div", ku, [
            n("label", Su, [
              w(n("input", {
                type: "checkbox",
                "onUpdate:modelValue": u[42] || (u[42] = (r) => _.value.cog_enabled = r)
              }, null, 512), [
                [ct, _.value.cog_enabled]
              ]),
              n("span", null, l(a("life.companion.switches.enableCognition")), 1)
            ]),
            n("label", Cu, [
              w(n("input", {
                type: "checkbox",
                "onUpdate:modelValue": u[43] || (u[43] = (r) => _.value.cog_lite_mode = r)
              }, null, 512), [
                [ct, _.value.cog_lite_mode]
              ]),
              n("span", null, l(a("life.companion.switches.liteMode")), 1)
            ]),
            n("label", Mu, [
              w(n("input", {
                type: "checkbox",
                "onUpdate:modelValue": u[44] || (u[44] = (r) => _.value.cog_modulate_affect = r)
              }, null, 512), [
                [ct, _.value.cog_modulate_affect]
              ]),
              n("span", null, l(a("life.companion.switches.modulateAffect")), 1)
            ]),
            n("label", zu, [
              w(n("input", {
                type: "checkbox",
                "onUpdate:modelValue": u[45] || (u[45] = (r) => _.value.cog_modulate_language = r)
              }, null, 512), [
                [ct, _.value.cog_modulate_language]
              ]),
              n("span", null, l(a("life.companion.switches.modulateLanguage")), 1)
            ]),
            n("label", Ou, [
              w(n("input", {
                type: "checkbox",
                "onUpdate:modelValue": u[46] || (u[46] = (r) => _.value.cog_modulate_social = r)
              }, null, 512), [
                [ct, _.value.cog_modulate_social]
              ]),
              n("span", null, l(a("life.companion.switches.modulateSocial")), 1)
            ]),
            n("label", Eu, [
              w(n("input", {
                type: "checkbox",
                "onUpdate:modelValue": u[47] || (u[47] = (r) => _.value.cog_modulate_selfhood = r)
              }, null, 512), [
                [ct, _.value.cog_modulate_selfhood]
              ]),
              n("span", null, l(a("life.companion.switches.modulateSelfhood")), 1)
            ])
          ]),
          n("p", Au, l(a("life.companion.switches.hint")), 1)
        ]),
        n("article", Zu, [
          n("h3", null, l(a("life.companion.presets.title")), 1),
          n("p", Iu, l(a("life.companion.presets.hint")), 1),
          n("div", Bu, [
            (y(), b(K, null, Lt(hn, (r) => n("button", {
              key: r.label,
              type: "button",
              class: "btn sm",
              onClick: (k) => Bi(r.fields, r.label)
            }, l(a(r.labelKey)), 9, Nu)), 64))
          ])
        ]),
        n("div", Du, [
          n("article", Ru, [
            n("h3", null, l(a("life.companion.decision.title")), 1),
            n("div", Vu, [
              n("label", null, [
                n("span", null, l(a("life.companion.decision.planDepth")), 1),
                w(n("input", {
                  "onUpdate:modelValue": u[48] || (u[48] = (r) => _.value.cog_plan_depth = r),
                  type: "number",
                  min: "1",
                  max: "6",
                  class: "field tiny"
                }, null, 512), [
                  [
                    M,
                    _.value.cog_plan_depth,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              n("label", null, [
                n("span", null, l(a("life.companion.decision.wmCapacity")), 1),
                w(n("input", {
                  "onUpdate:modelValue": u[49] || (u[49] = (r) => _.value.cog_wm_capacity = r),
                  type: "number",
                  min: "1",
                  max: "12",
                  class: "field tiny"
                }, null, 512), [
                  [
                    M,
                    _.value.cog_wm_capacity,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              n("label", null, [
                n("span", null, l(a("life.companion.decision.strategyTemp")), 1),
                w(n("input", {
                  "onUpdate:modelValue": u[50] || (u[50] = (r) => _.value.cog_tau = r),
                  type: "number",
                  step: "0.05",
                  min: "0.05",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    M,
                    _.value.cog_tau,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              n("label", null, [
                n("span", null, l(a("life.companion.decision.discount")), 1),
                w(n("input", {
                  "onUpdate:modelValue": u[51] || (u[51] = (r) => _.value.cog_gamma = r),
                  type: "number",
                  step: "0.01",
                  min: "0",
                  max: "0.999",
                  class: "field tiny"
                }, null, 512), [
                  [
                    M,
                    _.value.cog_gamma,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              n("label", null, [
                n("span", null, l(a("life.companion.decision.habitRate")), 1),
                w(n("input", {
                  "onUpdate:modelValue": u[52] || (u[52] = (r) => _.value.cog_alpha_habit = r),
                  type: "number",
                  step: "0.01",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    M,
                    _.value.cog_alpha_habit,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              n("label", null, [
                n("span", null, l(a("life.companion.decision.modelfreeRate")), 1),
                w(n("input", {
                  "onUpdate:modelValue": u[53] || (u[53] = (r) => _.value.cog_alpha_mf = r),
                  type: "number",
                  step: "0.01",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    M,
                    _.value.cog_alpha_mf,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              n("label", null, [
                n("span", null, l(a("life.companion.decision.surpriseThreshold")), 1),
                w(n("input", {
                  "onUpdate:modelValue": u[54] || (u[54] = (r) => _.value.cog_theta_pe = r),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    M,
                    _.value.cog_theta_pe,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              n("label", null, [
                n("span", null, l(a("life.companion.decision.noveltyThreshold")), 1),
                w(n("input", {
                  "onUpdate:modelValue": u[55] || (u[55] = (r) => _.value.cog_theta_n = r),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    M,
                    _.value.cog_theta_n,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              n("label", null, [
                n("span", null, l(a("life.companion.decision.prospectionHorizon")), 1),
                w(n("input", {
                  "onUpdate:modelValue": u[56] || (u[56] = (r) => _.value.cog_prospection_horizon = r),
                  type: "number",
                  min: "1",
                  max: "8",
                  class: "field tiny"
                }, null, 512), [
                  [
                    M,
                    _.value.cog_prospection_horizon,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ])
            ]),
            n("div", Uu, [
              n("label", Fu, [
                w(n("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": u[57] || (u[57] = (r) => _.value.cog_use_thalamic_gate = r)
                }, null, 512), [
                  [ct, _.value.cog_use_thalamic_gate]
                ]),
                n("span", null, l(a("life.companion.decision.thalamicGate")), 1)
              ]),
              n("label", Hu, [
                w(n("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": u[58] || (u[58] = (r) => _.value.cog_use_cerebellum = r)
                }, null, 512), [
                  [ct, _.value.cog_use_cerebellum]
                ]),
                n("span", null, l(a("life.companion.decision.cerebellum")), 1)
              ]),
              n("label", Wu, [
                w(n("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": u[59] || (u[59] = (r) => _.value.cog_use_ofc_map = r)
                }, null, 512), [
                  [ct, _.value.cog_use_ofc_map]
                ]),
                n("span", null, l(a("life.companion.decision.ofcMap")), 1)
              ]),
              n("label", Gu, [
                w(n("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": u[60] || (u[60] = (r) => _.value.cog_use_prospection = r)
                }, null, 512), [
                  [ct, _.value.cog_use_prospection]
                ]),
                n("span", null, l(a("life.companion.decision.prospection")), 1)
              ]),
              n("label", qu, [
                w(n("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": u[61] || (u[61] = (r) => _.value.cog_use_limbic_bias = r)
                }, null, 512), [
                  [ct, _.value.cog_use_limbic_bias]
                ]),
                n("span", null, l(a("life.companion.decision.limbicBias")), 1)
              ])
            ])
          ]),
          n("article", ju, [
            n("h3", null, l(a("life.companion.affect.title")), 1),
            n("div", Ku, [
              n("label", null, [
                n("span", null, l(a("life.companion.persona.erqProfile")), 1),
                Et(Zt(It), {
                  modelValue: _.value.cog_affect_profile,
                  "onUpdate:modelValue": u[62] || (u[62] = (r) => _.value.cog_affect_profile = r),
                  options: Oi.value,
                  "aria-label": a("life.companion.persona.erqProfile")
                }, null, 8, ["modelValue", "options", "aria-label"])
              ]),
              n("label", null, [
                n("span", null, l(a("life.companion.affect.vagalBaseline")), 1),
                w(n("input", {
                  "onUpdate:modelValue": u[63] || (u[63] = (r) => _.value.cog_affect_vagal = r),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    M,
                    _.value.cog_affect_vagal,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              n("label", null, [
                n("span", null, l(a("life.companion.persona.threatBaseline")), 1),
                w(n("input", {
                  "onUpdate:modelValue": u[64] || (u[64] = (r) => _.value.cog_affect_threat = r),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    M,
                    _.value.cog_affect_threat,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              n("label", null, [
                n("span", null, l(a("life.companion.persona.rewardBaseline")), 1),
                w(n("input", {
                  "onUpdate:modelValue": u[65] || (u[65] = (r) => _.value.cog_affect_reward = r),
                  type: "number",
                  step: "0.1",
                  min: "0",
                  max: "2",
                  class: "field tiny"
                }, null, 512), [
                  [
                    M,
                    _.value.cog_affect_reward,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ])
            ]),
            n("label", $u, [
              w(n("input", {
                type: "checkbox",
                "onUpdate:modelValue": u[66] || (u[66] = (r) => _.value.cog_affect_enabled = r)
              }, null, 512), [
                [ct, _.value.cog_affect_enabled]
              ]),
              n("span", null, l(a("life.companion.affect.enable")), 1)
            ]),
            n("label", Yu, [
              w(n("input", {
                type: "checkbox",
                "onUpdate:modelValue": u[67] || (u[67] = (r) => _.value.cog_affect_somatic = r)
              }, null, 512), [
                [ct, _.value.cog_affect_somatic]
              ]),
              n("span", null, l(a("life.companion.affect.somatic")), 1)
            ]),
            n("label", Ju, [
              w(n("input", {
                type: "checkbox",
                "onUpdate:modelValue": u[68] || (u[68] = (r) => _.value.cog_affect_persona_llm = r)
              }, null, 512), [
                [ct, _.value.cog_affect_persona_llm]
              ]),
              n("span", null, l(a("life.companion.affect.personaLlm")), 1)
            ])
          ]),
          n("article", Xu, [
            n("h3", null, l(a("life.companion.language.title")), 1),
            n("div", Qu, [
              n("label", null, [
                n("span", null, l(a("life.companion.language.framing")), 1),
                Et(Zt(It), {
                  modelValue: _.value.cog_language_framing,
                  "onUpdate:modelValue": u[69] || (u[69] = (r) => _.value.cog_language_framing = r),
                  options: At.value,
                  "aria-label": a("life.companion.language.framing")
                }, null, 8, ["modelValue", "options", "aria-label"])
              ]),
              n("label", null, [
                n("span", null, l(a("life.companion.language.boundary")), 1),
                w(n("input", {
                  "onUpdate:modelValue": u[70] || (u[70] = (r) => _.value.cog_language_boundary = r),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    M,
                    _.value.cog_language_boundary,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ])
            ]),
            n("label", tc, [
              w(n("input", {
                type: "checkbox",
                "onUpdate:modelValue": u[71] || (u[71] = (r) => _.value.cog_language_enabled = r)
              }, null, 512), [
                [ct, _.value.cog_language_enabled]
              ]),
              n("span", null, l(a("life.companion.language.enable")), 1)
            ])
          ]),
          n("article", ec, [
            n("h3", null, l(a("life.companion.social.title")), 1),
            n("div", ic, [
              n("label", null, [
                n("span", null, l(a("life.companion.metric.empathy")), 1),
                w(n("input", {
                  "onUpdate:modelValue": u[72] || (u[72] = (r) => _.value.cog_social_empathy = r),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    M,
                    _.value.cog_social_empathy,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              n("label", null, [
                n("span", null, l(a("life.companion.social.perspectiveStage")), 1),
                Et(Zt(It), {
                  modelValue: Kt.value,
                  "onUpdate:modelValue": u[73] || (u[73] = (r) => Kt.value = r),
                  options: Rn.value,
                  "aria-label": a("life.companion.social.perspectiveStage")
                }, null, 8, ["modelValue", "options", "aria-label"])
              ])
            ]),
            n("label", nc, [
              w(n("input", {
                type: "checkbox",
                "onUpdate:modelValue": u[74] || (u[74] = (r) => _.value.cog_social_enabled = r)
              }, null, 512), [
                [ct, _.value.cog_social_enabled]
              ]),
              n("span", null, l(a("life.companion.social.enable")), 1)
            ])
          ]),
          n("article", oc, [
            n("h3", null, l(a("life.companion.selfhood.title")), 1),
            n("div", ac, [
              n("label", null, [
                n("span", null, l(a("life.companion.selfhood.timeDiscount")), 1),
                w(n("input", {
                  "onUpdate:modelValue": u[75] || (u[75] = (r) => _.value.cog_selfhood_discount = r),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    M,
                    _.value.cog_selfhood_discount,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              n("label", null, [
                n("span", null, l(a("life.companion.selfhood.detailScale")), 1),
                w(n("input", {
                  "onUpdate:modelValue": u[76] || (u[76] = (r) => _.value.cog_selfhood_detail = r),
                  type: "number",
                  step: "1",
                  min: "1",
                  max: "50",
                  class: "field tiny"
                }, null, 512), [
                  [
                    M,
                    _.value.cog_selfhood_detail,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ])
            ]),
            n("label", sc, [
              w(n("input", {
                type: "checkbox",
                "onUpdate:modelValue": u[77] || (u[77] = (r) => _.value.cog_selfhood_enabled = r)
              }, null, 512), [
                [ct, _.value.cog_selfhood_enabled]
              ]),
              n("span", null, l(a("life.companion.selfhood.enable")), 1)
            ])
          ]),
          n("article", rc, [
            n("h3", null, l(a("life.companion.attachmentCard.title")), 1),
            n("p", lc, l(a("life.companion.attachmentCard.hint")), 1),
            n("label", uc, [
              w(n("input", {
                type: "checkbox",
                "onUpdate:modelValue": u[78] || (u[78] = (r) => _.value.cog_attachment_enabled = r)
              }, null, 512), [
                [ct, _.value.cog_attachment_enabled]
              ]),
              n("span", null, l(a("life.companion.attachmentCard.enable")), 1)
            ]),
            n("div", cc, [
              n("label", null, [
                n("span", null, l(a("life.companion.metric.attachmentType")), 1),
                Et(Zt(It), {
                  modelValue: _.value.cog_attachment_type,
                  "onUpdate:modelValue": u[79] || (u[79] = (r) => _.value.cog_attachment_type = r),
                  options: Ci.value,
                  "aria-label": a("life.companion.metric.attachmentType")
                }, null, 8, ["modelValue", "options", "aria-label"])
              ])
            ]),
            n("p", dc, l(a("life.companion.attachmentCard.hint2")), 1)
          ]),
          n("article", hc, [
            n("h3", null, l(a("life.companion.tsundereCard.title")), 1),
            n("p", fc, l(a("life.companion.tsundereCard.hint")), 1),
            n("label", pc, [
              w(n("input", {
                type: "checkbox",
                "onUpdate:modelValue": u[80] || (u[80] = (r) => _.value.cog_tsundere_enabled = r)
              }, null, 512), [
                [ct, _.value.cog_tsundere_enabled]
              ]),
              n("span", null, l(a("life.companion.tsundereCard.enable")), 1)
            ]),
            n("div", mc, [
              n("label", null, [
                n("span", null, l(a("life.companion.persona.tsundereType")), 1),
                Et(Zt(It), {
                  modelValue: _.value.cog_tsundere_type,
                  "onUpdate:modelValue": u[81] || (u[81] = (r) => _.value.cog_tsundere_type = r),
                  options: Xe.value,
                  "aria-label": a("life.companion.persona.tsundereType")
                }, null, 8, ["modelValue", "options", "aria-label"])
              ])
            ]),
            n("p", _c, l(a("life.companion.tsundereCard.hint2")), 1)
          ]),
          n("article", vc, [
            n("h3", null, l(a("life.companion.yandereCard.title")), 1),
            n("p", gc, l(a("life.companion.yandereCard.hint")), 1),
            n("label", yc, [
              w(n("input", {
                type: "checkbox",
                "onUpdate:modelValue": u[82] || (u[82] = (r) => _.value.cog_yandere_enabled = r)
              }, null, 512), [
                [ct, _.value.cog_yandere_enabled]
              ]),
              n("span", null, l(a("life.companion.yandereCard.enable")), 1)
            ]),
            n("div", bc, [
              n("label", null, [
                n("span", null, l(a("life.companion.yandereCard.type")), 1),
                Et(Zt(It), {
                  modelValue: _.value.cog_yandere_type,
                  "onUpdate:modelValue": u[83] || (u[83] = (r) => _.value.cog_yandere_type = r),
                  options: Mi.value,
                  "aria-label": a("life.companion.yandereCard.type")
                }, null, 8, ["modelValue", "options", "aria-label"])
              ])
            ]),
            n("p", wc, l(a("life.companion.yandereCard.hint2")), 1)
          ]),
          n("article", xc, [
            n("h3", null, l(a("life.companion.personadynCard.title")), 1),
            n("p", Pc, l(a("life.companion.personadynCard.hint")), 1),
            n("label", Lc, [
              w(n("input", {
                type: "checkbox",
                "onUpdate:modelValue": u[84] || (u[84] = (r) => _.value.cog_personadyn_enabled = r)
              }, null, 512), [
                [ct, _.value.cog_personadyn_enabled]
              ]),
              n("span", null, l(a("life.companion.personadynCard.enable")), 1)
            ]),
            n("div", Tc, [
              n("label", null, [
                n("span", null, l(a("life.companion.persona.personaArchetype")), 1),
                Et(Zt(It), {
                  modelValue: _.value.cog_personadyn_type,
                  "onUpdate:modelValue": u[85] || (u[85] = (r) => _.value.cog_personadyn_type = r),
                  options: sn.value,
                  "aria-label": a("life.companion.persona.personaArchetype")
                }, null, 8, ["modelValue", "options", "aria-label"])
              ]),
              n("label", null, [
                n("span", null, l(a("life.companion.persona.genderSocialScript")), 1),
                Et(Zt(It), {
                  modelValue: _.value.cog_personadyn_gender,
                  "onUpdate:modelValue": u[86] || (u[86] = (r) => _.value.cog_personadyn_gender = r),
                  options: Qe.value,
                  "aria-label": a("life.companion.persona.genderSocialScriptAria")
                }, null, 8, ["modelValue", "options", "aria-label"])
              ])
            ]),
            n("p", kc, l(a("life.companion.personadynCard.hint2")), 1),
            n("p", Sc, l(a("life.companion.personadynCard.hint3")), 1)
          ]),
          n("article", Cc, [
            n("h3", null, l(a("life.companion.memoryCard.title")), 1),
            n("p", Mc, l(a("life.companion.memoryCard.hint")), 1),
            n("div", zc, [
              n("label", Oc, [
                w(n("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": u[87] || (u[87] = (r) => _.value.cog_memory_encode = r)
                }, null, 512), [
                  [ct, _.value.cog_memory_encode]
                ]),
                n("span", null, l(a("life.companion.memoryCard.selectiveEncoding")), 1)
              ]),
              n("label", Ec, [
                w(n("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": u[88] || (u[88] = (r) => _.value.cog_sleep_replay = r)
                }, null, 512), [
                  [ct, _.value.cog_sleep_replay]
                ]),
                n("span", null, l(a("life.companion.memoryCard.sleepReplay")), 1)
              ]),
              n("label", Ac, [
                w(n("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": u[89] || (u[89] = (r) => _.value.cog_memory_reconsolidate = r)
                }, null, 512), [
                  [ct, _.value.cog_memory_reconsolidate]
                ]),
                n("span", null, l(a("life.companion.memoryCard.reconsolidate")), 1)
              ]),
              n("label", Zc, [
                w(n("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": u[90] || (u[90] = (r) => _.value.cog_cls_interleave = r)
                }, null, 512), [
                  [ct, _.value.cog_cls_interleave]
                ]),
                n("span", null, l(a("life.companion.memoryCard.cls")), 1)
              ])
            ])
          ])
        ])
      ], 512), [
        [nn, Bt.value === "cognition"]
      ]),
      w(n("section", Ic, [
        n("div", Bc, [
          n("div", null, [
            n("h2", null, l(a("life.companion.world.title")), 1),
            n("p", Nc, l(a("life.companion.world.desc")), 1)
          ]),
          n("div", Dc, [
            n("button", {
              class: "btn filled sm",
              onClick: N
            }, l(a("life.companion.saveSettings")), 1)
          ])
        ]),
        n("article", Rc, [
          n("h3", null, l(a("life.companion.world.density")), 1),
          n("div", Vc, [
            n("label", null, [
              n("span", null, l(a("life.companion.world.density")), 1),
              Et(Zt(It), {
                modelValue: si.value,
                "onUpdate:modelValue": u[91] || (u[91] = (r) => si.value = r),
                options: Gn.value,
                "aria-label": a("life.companion.world.densityAria")
              }, null, 8, ["modelValue", "options", "aria-label"])
            ])
          ]),
          n("p", Uc, l(a("life.companion.world.densityHint")), 1)
        ]),
        n("article", Fc, [
          n("h3", null, l(a("life.companion.world.personaTraits")), 1),
          n("p", Hc, l(a("life.companion.world.personaTraitsHint")), 1),
          n("label", Wc, [
            n("span", Gc, l(a("life.companion.world.personaText")), 1),
            w(n("textarea", {
              "onUpdate:modelValue": u[92] || (u[92] = (r) => ci.value = r),
              class: "world-text",
              rows: "4",
              placeholder: a("life.companion.world.personaPlaceholder")
            }, null, 8, qc), [
              [M, ci.value]
            ])
          ])
        ]),
        n("article", jc, [
          n("h3", null, l(a("life.companion.world.location")), 1),
          n("p", Kc, l(a("life.companion.world.locationHint")), 1),
          n("div", $c, [
            n("label", null, [
              n("span", null, l(a("life.companion.world.worldType")), 1),
              Et(Zt(It), {
                modelValue: ri.value,
                "onUpdate:modelValue": u[93] || (u[93] = (r) => ri.value = r),
                options: We.value,
                "aria-label": a("life.companion.world.worldType")
              }, null, 8, ["modelValue", "options", "aria-label"])
            ]),
            n("label", null, [
              n("span", null, l(a("life.companion.world.country")), 1),
              w(n("input", {
                "onUpdate:modelValue": u[94] || (u[94] = (r) => He.value = r),
                class: "field",
                placeholder: a("life.companion.world.countryPlaceholder")
              }, null, 8, Yc), [
                [M, He.value]
              ])
            ]),
            n("label", null, [
              n("span", null, l(a("life.companion.world.city")), 1),
              w(n("input", {
                "onUpdate:modelValue": u[95] || (u[95] = (r) => li.value = r),
                class: "field",
                placeholder: a("life.companion.world.cityPlaceholder")
              }, null, 8, Jc), [
                [M, li.value]
              ])
            ]),
            n("label", null, [
              n("span", null, l(a("life.companion.world.district")), 1),
              w(n("input", {
                "onUpdate:modelValue": u[96] || (u[96] = (r) => ve.value = r),
                class: "field",
                placeholder: a("life.companion.world.districtPlaceholder")
              }, null, 8, Xc), [
                [M, ve.value]
              ])
            ])
          ]),
          n("label", Qc, [
            n("span", td, l(a("life.companion.world.premiseLabel")), 1),
            w(n("textarea", {
              "onUpdate:modelValue": u[97] || (u[97] = (r) => ui.value = r),
              class: "world-text",
              rows: "3",
              placeholder: a("life.companion.world.premisePlaceholder")
            }, null, 8, ed), [
              [M, ui.value]
            ])
          ]),
          n("label", id, [
            n("span", nd, l(a("life.companion.world.actorsLabel")), 1),
            w(n("textarea", {
              "onUpdate:modelValue": u[98] || (u[98] = (r) => di.value = r),
              class: "world-text",
              rows: "4",
              placeholder: a("life.companion.world.actorsPlaceholder")
            }, null, 8, od), [
              [M, di.value]
            ])
          ]),
          n("label", ad, [
            n("span", sd, l(a("life.companion.world.placesLabel")), 1),
            w(n("textarea", {
              "onUpdate:modelValue": u[99] || (u[99] = (r) => hi.value = r),
              class: "world-text",
              rows: "2",
              placeholder: a("life.companion.world.placesPlaceholder")
            }, null, 8, rd), [
              [M, hi.value]
            ])
          ]),
          n("div", ld, [
            n("button", {
              class: "btn filled sm",
              type: "button",
              disabled: Xt.value,
              onClick: Gi
            }, l(Xt.value ? a("life.companion.world.generating") : a("life.companion.world.generateMapOnly")), 9, ud),
            n("button", {
              class: "btn tonic sm",
              type: "button",
              disabled: Xt.value,
              onClick: Wi
            }, l(Xt.value ? a("life.companion.world.generating") : a("life.companion.world.generateWorld")), 9, cd),
            n("span", dd, l(a("life.companion.world.generateHint")), 1)
          ])
        ]),
        n("article", hd, [
          n("div", fd, [
            n("h3", null, [
              U(l(a("life.companion.world.map")) + " ", 1),
              n("span", pd, l(W.value.locations.length), 1)
            ]),
            Qt.value ? (y(), b("span", md, l(Qt.value.fictional ? a("life.companion.worldFictional.fictional") : a("life.companion.worldFictional.real")) + " · " + l([Qt.value.country, Qt.value.city, Qt.value.district].filter(Boolean).join(" / ") || a("life.companion.world.unnamed")), 1)) : z("", !0)
          ]),
          Qt.value?.premise ? (y(), b("p", _d, l(Qt.value.premise), 1)) : z("", !0),
          n("div", vd, [
            n("div", {
              ref_key: "mapEl",
              ref: ze,
              class: F(["world-map-leaflet", { "is-empty": !W.value.locations.length }])
            }, null, 2),
            R.value ? (y(), b("div", gd, l(a("life.companion.world.offline")), 1)) : z("", !0),
            W.value.locations.length ? (y(), b(K, { key: 1 }, [
              W.value.kind !== "real" && W.value.nation ? (y(), b("button", {
                key: 0,
                type: "button",
                class: "wm-scope",
                onClick: Ui
              }, l(Ut.value === "city" ? a("life.companion.world.nationView") : a("life.companion.world.cityView")), 1)) : z("", !0),
              n("button", {
                type: "button",
                class: "wm-reset",
                onClick: je
              }, l(a("life.companion.world.resetView")), 1),
              W.value.kind !== "real" && Ut.value === "city" ? (y(), b("div", yd, [...u[108] || (u[108] = [
                n("i", null, "N", -1)
              ])])) : z("", !0)
            ], 64)) : z("", !0)
          ]),
          W.value.locations.length ? z("", !0) : (y(), b("p", bd, l(a("life.companion.world.noMap")), 1)),
          W.value.locations.length ? (y(), b("div", wd, [
            (y(!0), b(K, null, Lt(Me.value, (r) => (y(), b("span", { key: r }, [
              n("i", {
                class: F("k-" + r)
              }, null, 2),
              U(l(a(ht[r])), 1)
            ]))), 128)),
            n("span", null, [
              u[109] || (u[109] = n("i", { class: "k-actor" }, null, -1)),
              U(l(a("life.companion.world.actorsCount", { n: W.value.actors.length })), 1)
            ]),
            W.value.kind !== "real" ? (y(), b(K, { key: 0 }, [
              n("span", null, [
                u[110] || (u[110] = n("i", { class: "k-hw" }, null, -1)),
                U(l(a("life.companion.world.highwayLoop")), 1)
              ]),
              n("span", null, [
                u[111] || (u[111] = n("i", { class: "k-arterial" }, null, -1)),
                U(l(a("life.companion.world.arterial")), 1)
              ]),
              n("span", null, [
                u[112] || (u[112] = n("i", { class: "k-street" }, null, -1)),
                U(l(a("life.companion.world.street")), 1)
              ]),
              n("span", null, [
                u[113] || (u[113] = n("i", { class: "k-metro" }, null, -1)),
                U(l(a("life.companion.world.metro")), 1)
              ]),
              n("span", null, [
                u[114] || (u[114] = n("i", { class: "k-bus" }, null, -1)),
                U(l(a("life.companion.world.bus")), 1)
              ]),
              n("span", null, [
                u[115] || (u[115] = n("i", { class: "k-park2" }, null, -1)),
                U(l(a("life.companion.kind.park")), 1)
              ]),
              n("span", null, [
                u[116] || (u[116] = n("i", { class: "k-water" }, null, -1)),
                U(l(a("life.companion.world.water")), 1)
              ])
            ], 64)) : z("", !0)
          ])) : z("", !0),
          W.value.locations.length && W.value.kind !== "real" && Ut.value === "city" ? (y(), b("div", xd, [
            (W.value.metro || []).length ? (y(), b("div", Pd, [
              n("h4", null, l(a("life.companion.world.metroRoutes")), 1),
              n("ul", null, [
                (y(!0), b(K, null, Lt(W.value.metro, (r, k) => (y(), b("li", {
                  key: "m" + k
                }, [
                  n("b", {
                    style: jt({ color: r.color })
                  }, l(r.name), 5),
                  n("span", null, l((r.stations || []).map((P) => P.name).filter(Boolean).join(" · ")), 1)
                ]))), 128))
              ])
            ])) : z("", !0),
            (W.value.bus || []).length ? (y(), b("div", Ld, [
              n("h4", null, l(a("life.companion.world.busRoutes")), 1),
              n("ul", null, [
                (y(!0), b(K, null, Lt(W.value.bus, (r, k) => (y(), b("li", {
                  key: "b" + k
                }, [
                  n("b", {
                    style: jt({ color: r.color })
                  }, l(r.name), 5),
                  n("span", null, l((r.stops || []).map((P) => P.name).filter(Boolean).join(" · ")), 1)
                ]))), 128))
              ])
            ])) : z("", !0)
          ])) : z("", !0)
        ]),
        n("article", Td, [
          n("div", kd, [
            n("h3", null, [
              U(l(a("life.companion.world.recentEvents")) + " ", 1),
              n("span", Sd, l(Re.value.length), 1)
            ]),
            Re.value.length ? (y(), b("button", {
              key: 0,
              type: "button",
              class: "btn tonic sm",
              onClick: qi
            }, l(a("life.companion.world.clearTitle")), 1)) : z("", !0)
          ]),
          n("ol", Cd, [
            (y(!0), b(K, null, Lt(Re.value, (r) => (y(), b("li", {
              key: r.id
            }, [
              n("span", Md, l(r.created_at), 1),
              n("strong", null, l(r.summary), 1)
            ]))), 128)),
            Re.value.length ? z("", !0) : (y(), b("li", zd, l(a("life.companion.world.noEvents")), 1))
          ])
        ])
      ], 512), [
        [nn, Bt.value === "world"]
      ]),
      w(n("section", Od, [
        Et(Sa)
      ], 512), [
        [nn, Bt.value === "adapters"]
      ]),
      w(n("section", Ed, [
        n("div", Ad, [
          n("div", null, [
            n("h2", null, l(a("life.companion.state.title")), 1),
            n("p", Zd, l(a("life.companion.state.desc")), 1)
          ])
        ]),
        n("article", Id, [
          n("h3", null, [
            U(l(a("life.companion.state.relationships")) + " ", 1),
            n("span", Bd, l(ni.value.length), 1)
          ]),
          n("p", Nd, l(a("life.companion.state.relationshipsHint")), 1),
          n("ol", Dd, [
            (y(!0), b(K, null, Lt(ni.value, (r) => (y(), b("li", {
              key: r.user_id,
              class: "rel-card"
            }, [
              n("div", Rd, [
                n("strong", null, l(r.user_id), 1),
                n("span", Vd, l(a("life.companion.state.lastSeenLabel")) + " " + l((r.last_seen || "").slice(0, 16).replace("T", " ") || "—"), 1)
              ]),
              n("div", Ud, [
                n("span", Fd, l(a("life.companion.state.stage")), 1),
                n("span", {
                  class: "rel-track",
                  role: "img",
                  "aria-label": ai(r.stage)
                }, [
                  (y(), b(K, null, Lt(oi, (k, P) => n("span", {
                    key: k,
                    class: F(["rel-seg", { done: P < Vi(r.stage), cur: P === Vi(r.stage) }])
                  }, null, 2)), 64))
                ], 8, Hd),
                n("span", Wd, l(ai(r.stage)), 1)
              ]),
              n("div", {
                class: "gauge",
                title: a("life.companion.effect.affinity")
              }, [
                n("span", qd, [
                  n("span", jd, [
                    U(l(a("life.companion.state.affinity")), 1),
                    n("em", Kd, l(a("life.companion.alias.affinity")), 1)
                  ]),
                  n("span", $d, [
                    n("b", {
                      class: F(["gauge-state", Number(r.affinity) >= 0 ? "good" : "bad"])
                    }, l(a("life.companion.gw.affinity." + gn(Number(r.affinity) || 0))), 3),
                    U(" " + l(vt(r.affinity, 2)), 1)
                  ])
                ]),
                n("span", Yd, [
                  n("i", {
                    class: F(["gauge-fill", Number(r.affinity) >= 0 ? "good" : "bad"]),
                    style: jt($t(Number(r.affinity) || 0))
                  }, null, 6)
                ]),
                n("span", Jd, l(a("life.companion.effect.affinity")), 1)
              ], 8, Gd),
              r.interaction ? (y(), b("div", Xd, [
                n("span", Qd, l(a("life.companion.state.interaction")) + " · " + l(Se(r.interaction)), 1),
                n("span", th, l(wn(r.interaction)), 1)
              ])) : z("", !0)
            ]))), 128)),
            ni.value.length ? z("", !0) : (y(), b("li", eh, l(a("life.companion.state.noRelationships")), 1))
          ])
        ]),
        n("article", ih, [
          n("h3", null, [
            U(l(a("life.companion.state.commitments")) + " ", 1),
            n("span", nh, l(Ve.value.length), 1)
          ]),
          n("p", oh, l(a("life.companion.state.commitmentsHint")), 1),
          n("ol", ah, [
            (y(!0), b(K, null, Lt(Ve.value, (r) => (y(), b("li", {
              key: r.id
            }, [
              n("strong", null, l(r.text), 1),
              n("span", sh, l(r.user_id), 1)
            ]))), 128)),
            Ve.value.length ? z("", !0) : (y(), b("li", rh, l(a("life.companion.state.noCommitments")), 1))
          ])
        ]),
        n("div", lh, [
          n("article", uh, [
            n("h3", null, l(a("life.companion.state.userModel")), 1),
            n("p", ch, l(a("life.companion.state.userModelHint")), 1),
            n("ol", dh, [
              (y(!0), b(K, null, Lt(Di.value, (r) => (y(), b("li", {
                key: r.user_id
              }, [
                n("strong", null, l(r.user_id), 1),
                n("span", hh, l(a("life.companion.state.likes", { items: _e(r.preferences).join(a("life.companion.listSeparator")) || "—" })), 1),
                n("span", fh, l(a("life.companion.state.taboos", { items: _e(r.taboos).join(a("life.companion.listSeparator")) || "—" })), 1),
                n("span", ph, l(a("life.companion.state.concerns", { items: _e(r.concerns).join(a("life.companion.listSeparator")) || "—" })), 1)
              ]))), 128)),
              Di.value.length ? z("", !0) : (y(), b("li", mh, l(a("life.companion.state.noUserModel")), 1))
            ])
          ]),
          n("article", _h, [
            n("h3", null, l(a("life.companion.state.values")), 1),
            n("p", vh, l(a("life.companion.state.valuesHint")), 1),
            n("ol", gh, [
              (y(!0), b(K, null, Lt(_n.value, (r) => (y(), b("li", {
                key: r.k,
                class: "value-row"
              }, [
                n("span", yh, l(r.k), 1),
                n("span", bh, [
                  n("i", {
                    class: F(r.v >= 0 ? "good" : "bad"),
                    style: jt($t(r.v))
                  }, null, 6)
                ]),
                n("span", wh, l(r.v.toFixed(2)), 1)
              ]))), 128)),
              _n.value.length ? z("", !0) : (y(), b("li", xh, l(a("life.companion.state.noValues")), 1))
            ])
          ])
        ])
      ], 512), [
        [nn, Bt.value === "state"]
      ]),
      n("section", Ph, [
        n("div", Lh, [
          n("div", null, [
            n("h2", null, l(a("life.companion.danger.title")), 1),
            n("p", Th, l(a("life.companion.danger.desc")), 1)
          ])
        ]),
        n("div", kh, [
          n("article", Sh, [
            n("h3", null, l(a("life.companion.danger.reset")), 1),
            n("p", Ch, l(a("life.companion.danger.resetHint")), 1),
            n("p", Mh, [
              n("strong", null, l(a("life.companion.danger.doubleConfirm")), 1)
            ]),
            n("div", zh, [
              n("button", {
                class: "btn danger",
                disabled: Ce.value,
                onClick: ye
              }, l(Ce.value ? a("life.companion.danger.resetting") : a("life.companion.danger.reset")), 9, Oh)
            ])
          ])
        ])
      ])
    ], 512));
  }
}), Vh = /* @__PURE__ */ Ca(Ah, [["__scopeId", "data-v-7d345f44"]]);
export {
  Vh as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('life-plugin-style')){const s=document.createElement('style');s.id='life-plugin-style';s.textContent=".page-header[data-v-e12fa355]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.page-header h1[data-v-e12fa355]{margin:0;font-size:clamp(24px,2.8vw,34px);font-weight:800;letter-spacing:-.02em}.subtitle[data-v-e12fa355]{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-e12fa355]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0;flex-wrap:wrap}.stat-grid[data-v-e12fa355]{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(180px,100%),1fr));gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-e12fa355]{background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:var(--r-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px;transition:transform .28s var(--ease-spring),box-shadow .28s}@media(hover:hover)and (pointer:fine){.stat-card[data-v-e12fa355]:hover{transform:translateY(-2px);box-shadow:var(--shadow-2)}}.stat-head[data-v-e12fa355]{display:flex;align-items:center;gap:10px}.stat-label[data-v-e12fa355]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-e12fa355]{font-size:34px;font-weight:800;letter-spacing:-.02em;line-height:1.1}.stat-hint[data-v-e12fa355]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-e12fa355]{width:44px;height:44px;border-radius:16px 16px 16px 6px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-e12fa355]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-e12fa355]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-e12fa355]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-e12fa355]{background:var(--md-success-container);color:var(--md-on-success-container,#0d3b1e)}.card-head[data-v-e12fa355]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.card-title[data-v-e12fa355]{margin:0;font-size:16px;font-weight:650}.toolbar[data-v-e12fa355]{display:flex;align-items:flex-end;gap:14px;flex-wrap:wrap;margin-bottom:var(--space-lg);padding:var(--space-md)}.search-field[data-v-e12fa355]{display:flex;align-items:center;gap:10px;flex:1;min-width:220px;height:52px;padding:0 14px;border-radius:16px;background:var(--md-surface-container-high)}.search-icon[data-v-e12fa355]{color:var(--md-on-surface-variant);flex-shrink:0}.search-field input[data-v-e12fa355]{flex:1;min-width:0;border:0;background:transparent;outline:none;color:var(--md-on-surface);font-size:14px}.search-field input[data-v-e12fa355]:focus-visible{outline:3px solid var(--md-primary);outline-offset:2px}.search-field.mini[data-v-e12fa355]{height:auto;padding:10px 12px;margin-bottom:12px}#app .memory-page .field.area[data-v-e12fa355]{height:auto;min-height:120px;padding:12px 14px;resize:vertical;line-height:1.6}.chip[data-v-e12fa355]{height:26px;padding:0 11px;border-radius:999px;font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:6px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0}.chip.muted[data-v-e12fa355]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}.tier-short[data-v-e12fa355]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tier-long[data-v-e12fa355]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.chip-ok[data-v-e12fa355]{background:var(--md-success-container);color:var(--md-on-success-container,#0d3b1e)}.chip-warn[data-v-e12fa355]{background:var(--md-warning-container);color:var(--md-on-warning-container)}.memory-list[data-v-e12fa355]{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(340px,100%),1fr));gap:var(--space-lg)}.memory-card[data-v-e12fa355]{background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:var(--r-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:12px;transition:transform .26s var(--ease-spring),box-shadow .22s,border-color .2s}@media(hover:hover)and (pointer:fine){.memory-card[data-v-e12fa355]:hover{transform:translateY(-2px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--md-primary) 30%,var(--md-outline-variant))}}.memory-card-enter-active[data-v-e12fa355]{transition:opacity .2s var(--ease-emphasized-decel),transform .2s var(--ease-emphasized-decel)}.memory-card-leave-active[data-v-e12fa355]{transition:opacity .16s var(--ease-emphasized-accel),transform .16s var(--ease-emphasized-accel)}.memory-card-enter-from[data-v-e12fa355]{opacity:0;transform:translateY(6px) scale(.98)}.memory-card-leave-to[data-v-e12fa355]{opacity:0;transform:scale(.98)}.memory-card-move[data-v-e12fa355]{transition:transform .26s var(--ease-emphasized)}@media(prefers-reduced-motion:reduce){.memory-card-enter-active[data-v-e12fa355],.memory-card-leave-active[data-v-e12fa355],.memory-card-move[data-v-e12fa355]{transition-duration:1ms}.memory-card-enter-from[data-v-e12fa355],.memory-card-leave-to[data-v-e12fa355],.stat-card[data-v-e12fa355]:hover,.memory-card[data-v-e12fa355]:hover{transform:none}}.card-top[data-v-e12fa355]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.btn-icon[data-v-e12fa355]{position:relative;width:30px;height:30px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--md-on-surface-variant);display:grid;place-items:center;cursor:pointer;margin-left:auto}#app .memory-page .btn-icon[data-v-e12fa355]{min-height:0}.btn-icon[data-v-e12fa355]:after{content:\"\";position:absolute;top:50%;left:50%;width:44px;height:44px;transform:translate(-50%,-50%)}.btn-icon.danger[data-v-e12fa355]:hover{background:var(--md-error-container);color:var(--md-error)}.memory-content[data-v-e12fa355]{margin:0;line-height:1.65;font-size:14px;white-space:pre-wrap;overflow-wrap:anywhere}.tags[data-v-e12fa355]{display:flex;gap:6px;flex-wrap:wrap}.tags span[data-v-e12fa355]{font-size:12px;font-weight:500;color:var(--md-on-primary-container);background:var(--md-primary-container);padding:3px 8px;border-radius:999px}.memory-foot[data-v-e12fa355]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding-top:12px;border-top:1px solid var(--md-outline-variant)}.meter[data-v-e12fa355]{display:flex;align-items:center;gap:7px;font-size:12px;color:var(--md-on-surface-variant)}.meter-bar[data-v-e12fa355]{width:56px;height:5px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-e12fa355]{display:block;height:100%;width:100%;transform-origin:left;transform:scaleX(var(--v,0%));border-radius:999px;transition:transform .3s var(--ease-out,ease)}.fill-primary[data-v-e12fa355]{background:var(--md-primary)}.fill-secondary[data-v-e12fa355]{background:var(--md-secondary,#536255)}.meter-text[data-v-e12fa355]{margin-left:auto;font-size:12px;color:var(--md-on-surface-variant)}.detail[data-v-e12fa355]{display:grid;grid-template-rows:0fr;transition:grid-template-rows .24s var(--ease-out,ease)}.detail.open[data-v-e12fa355]{grid-template-rows:1fr}.detail-clip[data-v-e12fa355]{overflow:hidden;min-height:0;border-top:0 solid transparent}.detail-clip dl[data-v-e12fa355]{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0;font-size:12px;padding-top:10px}.detail.open .detail-clip[data-v-e12fa355]{border-top-width:1px;border-top-style:solid;border-top-color:var(--md-outline-variant)}.detail dt[data-v-e12fa355]{color:var(--md-on-surface-variant);font-weight:600}.detail dd[data-v-e12fa355]{margin:3px 0 0;overflow-wrap:anywhere}.detail code[data-v-e12fa355]{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px}.card-actions[data-v-e12fa355]{display:flex;gap:8px;justify-content:flex-end}.hidden-input[data-v-e12fa355]{display:none}.empty-state[data-v-e12fa355]{padding:56px 24px;text-align:center;background:var(--md-surface-container);border:1px dashed var(--md-outline-variant);border-radius:var(--r-lg);color:var(--md-on-surface-variant)}.empty-state p[data-v-e12fa355]{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}.empty-state .hint[data-v-e12fa355]{margin-top:8px;font-size:13px;font-weight:400;opacity:.85}.pager[data-v-e12fa355]{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:var(--space-lg)}.grid-notes[data-v-e12fa355]{display:grid;grid-template-columns:minmax(0,340px) 1fr;gap:var(--space-lg)}.stack-form[data-v-e12fa355]{display:flex;flex-direction:column;gap:10px}.note-list[data-v-e12fa355],.reflection-list[data-v-e12fa355]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}.note-item[data-v-e12fa355]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent);border-radius:16px;background:var(--md-surface-container-low)}.note-main[data-v-e12fa355]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.note-main strong[data-v-e12fa355]{font-size:14px;font-weight:600;overflow-wrap:anywhere}.item-meta[data-v-e12fa355]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.note-actions[data-v-e12fa355]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-e12fa355]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.reader[data-v-e12fa355]{margin-top:var(--space-lg)}.reader pre[data-v-e12fa355]{margin:0;max-height:460px;overflow:auto;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;line-height:1.7;white-space:pre-wrap;background:var(--md-surface-container);padding:14px 16px;border-radius:12px}.reflection .card-title[data-v-e12fa355]{font-size:14px;font-weight:600}.reflection details[data-v-e12fa355]{margin-top:6px}.reflection summary[data-v-e12fa355]{cursor:pointer;font-size:12px;color:var(--md-on-surface-variant)}.quote[data-v-e12fa355]{margin:8px 0 0;font-size:13px;line-height:1.6;background:var(--md-surface-container);padding:8px 12px;border-radius:8px;white-space:pre-wrap;overflow-wrap:anywhere}@media(prefers-reduced-motion:reduce){.meter-bar i[data-v-e12fa355]{transition:none}}.tab-body[data-v-e12fa355]{min-width:0}.tab-fade-enter-active[data-v-e12fa355]{transition:opacity .2s var(--ease-emphasized-decel)}.tab-fade-leave-active[data-v-e12fa355]{transition:opacity .14s var(--ease-emphasized-accel)}.tab-fade-enter-from[data-v-e12fa355],.tab-fade-leave-to[data-v-e12fa355]{opacity:0}@media(prefers-reduced-motion:reduce){.tab-fade-enter-active[data-v-e12fa355],.tab-fade-leave-active[data-v-e12fa355]{transition-duration:1ms}}.dynamics-grid[data-v-e12fa355]{display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:18px;align-items:end}@media(max-width:900px){.dynamics-grid[data-v-e12fa355]{grid-template-columns:1fr}}.dyn-track[data-v-e12fa355]{flex:1;height:10px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.dyn-bar[data-v-e12fa355]{display:block;height:100%;border-radius:999px;background:var(--md-primary);transition:width .5s var(--ease-out,ease)}.dyn-hist[data-v-e12fa355]{display:flex;align-items:flex-end;gap:3px;height:60px}.dyn-hist i[data-v-e12fa355]{flex:1;background:var(--md-primary);border-radius:3px 3px 0 0;transition:height .5s var(--ease-out,ease)}.dyn-curve[data-v-e12fa355]{width:100%;height:60px;color:var(--md-primary);display:block}.decay-line[data-v-e12fa355]{stroke-dasharray:1;stroke-dashoffset:1;animation:decay-draw-e12fa355 .9s var(--ease-out,ease) forwards}@keyframes decay-draw-e12fa355{to{stroke-dashoffset:0}}@media(prefers-reduced-motion:reduce){.dyn-bar[data-v-e12fa355],.dyn-hist i[data-v-e12fa355]{transition:none}.decay-line[data-v-e12fa355]{animation:none;stroke-dashoffset:0}}.skeleton-card[data-v-e12fa355]{gap:12px;pointer-events:none}.sk-line[data-v-e12fa355]{display:block;height:12px;border-radius:6px;background:linear-gradient(90deg,var(--md-surface-container-high) 25%,color-mix(in srgb,var(--md-on-surface) 8%,var(--md-surface-container-high)) 45%,var(--md-surface-container-high) 65%);background-size:200% 100%;animation:sk-shimmer-e12fa355 1.4s linear infinite}.sk-line.w30[data-v-e12fa355]{width:30%}.sk-line.w40[data-v-e12fa355]{width:40%}.sk-line.w75[data-v-e12fa355]{width:75%}.sk-line.w90[data-v-e12fa355]{width:90%}@keyframes sk-shimmer-e12fa355{0%{background-position:200% 0}to{background-position:-200% 0}}@media(prefers-reduced-motion:reduce){.sk-line[data-v-e12fa355]{animation:none}}.danger-zone[data-v-e12fa355]{display:flex;justify-content:space-between;align-items:center;gap:var(--space-lg);flex-wrap:wrap;margin-top:var(--space-xl);padding:var(--space-lg);border:1px solid color-mix(in srgb,var(--md-error,#b3261e) 45%,transparent);border-radius:var(--r-lg);background:color-mix(in srgb,var(--md-error,#b3261e) 5%,transparent)}.danger-zone h2[data-v-e12fa355]{margin:0;font-size:15px;font-weight:750;color:var(--md-error,#b3261e)}.danger-zone .hint[data-v-e12fa355]{margin:4px 0 0}.danger-copy[data-v-e12fa355]{flex:1;min-width:240px}@media(max-width:900px){.stat-grid[data-v-e12fa355]{grid-template-columns:repeat(2,1fr)}.grid-notes[data-v-e12fa355]{grid-template-columns:1fr}}@media(max-width:640px){.header-actions[data-v-e12fa355]{padding-top:0}.memory-list[data-v-e12fa355]{grid-template-columns:1fr}}.muted[data-v-3d757c40]{color:var(--md-on-surface-variant);font-size:13px}.pad[data-v-3d757c40]{padding:14px}.dock[data-v-3d757c40]{position:fixed;right:16px;top:76px;z-index:var(--z-panel, 3000);display:flex;flex-direction:column;align-items:center;gap:10px;padding:10px 8px;border-radius:28px;background:var(--md-surface-container-low);box-shadow:var(--shadow-1)}.dock-btn[data-v-3d757c40]{position:relative;width:42px;height:42px;display:grid;place-items:center;border:0;border-radius:14px;background:transparent;color:var(--md-on-surface-variant);cursor:pointer;transition:background-color .16s,color .16s,transform .16s var(--ease-emphasized-decel)}.dock-btn[data-v-3d757c40]:hover{background:var(--md-secondary-container);color:var(--md-on-surface);transform:translateY(-1px)}.dock-btn[data-v-3d757c40]:active{transform:scale(.94)}.dock-btn.active[data-v-3d757c40]{background:color-mix(in srgb,var(--md-primary) 18%,transparent);color:var(--md-primary)}.dock-btn[data-v-3d757c40]:focus-visible{outline:2px solid var(--md-primary);outline-offset:2px}.panel[data-v-3d757c40]{position:fixed;left:0;top:0;z-index:var(--z-panel, 3000);display:flex;flex-direction:column;border:1px solid var(--md-outline-variant);border-radius:14px;overflow:hidden;background:var(--md-surface-container-low);box-shadow:var(--shadow-4);color:var(--md-on-surface)}.toolbar[data-v-3d757c40]{display:flex;align-items:center;gap:6px;padding:7px 9px;background:var(--md-surface-container-high);color:var(--md-on-surface);cursor:grab;touch-action:none;user-select:none;flex:0 0 auto}.toolbar[data-v-3d757c40]:active{cursor:grabbing}.toolbar .grab[data-v-3d757c40]{font-size:13px;line-height:1;color:var(--md-on-surface-variant);padding:0 2px;cursor:grab}.toolbar strong[data-v-3d757c40]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12.5px;font-weight:650}.toolbar .count[data-v-3d757c40]{flex:none;min-width:20px;height:20px;padding:0 6px;display:inline-flex;align-items:center;justify-content:center;border-radius:999px;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);font-size:11.5px;font-weight:700}.toolbar button[data-v-3d757c40]{width:28px;height:28px;padding:0;display:inline-grid;place-items:center;border:0;border-radius:8px;font-size:13px;line-height:1;color:var(--md-on-surface-variant);background:transparent;cursor:pointer;flex-shrink:0}#app .toolbar button[data-v-3d757c40]{min-height:0}.toolbar button[data-v-3d757c40]:hover{background:var(--md-surface-container-highest)}.list-body[data-v-3d757c40]{flex:1;min-height:0;overflow-y:auto;padding:6px;display:flex;flex-direction:column;gap:2px}.row[data-v-3d757c40]{display:flex;gap:10px;align-items:center;width:100%;text-align:left;border:0;background:transparent;color:inherit;font:inherit;padding:8px 9px;border-radius:12px;cursor:pointer}.row[data-v-3d757c40]:hover{background:var(--md-surface-container-high)}.row.selected[data-v-3d757c40]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.row-main[data-v-3d757c40]{min-width:0;flex:1;display:flex;flex-direction:column;gap:2px}.row-top[data-v-3d757c40]{display:flex;justify-content:space-between;gap:8px}.row-top strong[data-v-3d757c40]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:700}.row-top small[data-v-3d757c40]{font-size:11px;opacity:.6;flex:0 0 auto}.row-sub[data-v-3d757c40]{font-size:12px;opacity:.75;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.me[data-v-3d757c40]{color:var(--md-primary);font-weight:700}.row.selected .me[data-v-3d757c40]{color:inherit;opacity:.85}.avatar[data-v-3d757c40]{position:relative;width:38px;height:38px;flex:0 0 38px;border-radius:50%;overflow:hidden;background:var(--md-primary);color:var(--md-on-primary, #fff);display:flex;align-items:center;justify-content:center;font-weight:800}.avatar.group[data-v-3d757c40]{border-radius:12px}.avatar.sm[data-v-3d757c40]{width:26px;height:26px;flex-basis:26px}.avatar img[data-v-3d757c40]{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.fb[data-v-3d757c40]{font-size:14px}.thread[data-v-3d757c40]{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px;min-height:0}.msg[data-v-3d757c40]{display:flex;opacity:1;transform:none;transition:opacity var(--duration-medium) var(--ease-emphasized-decel),transform var(--duration-medium) var(--ease-emphasized-decel)}@starting-style{.msg[data-v-3d757c40]{opacity:0;transform:translateY(4px)}}.msg.out[data-v-3d757c40]{justify-content:flex-end}.bubble[data-v-3d757c40]{max-width:82%;background:var(--md-surface-container-low);border-radius:8px 24px 24px;padding:8px 12px;display:flex;flex-direction:column;gap:3px;box-shadow:var(--shadow-1)}.msg.out .bubble[data-v-3d757c40]{background:var(--md-primary-container);color:var(--md-on-primary-container);border-radius:24px 24px 8px}.sender[data-v-3d757c40]{font-size:11px;font-weight:700;opacity:.75}.text[data-v-3d757c40]{white-space:pre-wrap;word-break:break-word;font-size:13px}.chip[data-v-3d757c40]{align-self:flex-start;font-size:11px;padding:1px 8px;border-radius:999px;background:color-mix(in srgb,currentColor 16%,transparent)}.time[data-v-3d757c40]{align-self:flex-end;font-size:10px;opacity:.6}.composer[data-v-3d757c40]{display:flex;gap:8px;padding:8px 10px;border-top:1px solid var(--md-outline-variant);align-items:flex-end;flex:0 0 auto;flex-wrap:wrap}.send-error[data-v-3d757c40]{flex:1 0 100%;margin:0;padding:6px 10px;border-radius:8px;background:var(--md-error-container);color:var(--md-on-error-container);font-size:12px;overflow-wrap:anywhere}.composer textarea[data-v-3d757c40]{flex:1;resize:none;min-height:38px;max-height:110px;padding:9px 12px;border-radius:12px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-high);color:var(--md-on-surface);font:inherit;outline:none}.composer textarea[data-v-3d757c40]:focus{border-color:var(--md-primary)}.composer button[data-v-3d757c40]{height:38px;padding:0 16px;border:0;border-radius:12px;background:var(--md-primary);color:var(--md-on-primary, #fff);font-weight:700;cursor:pointer}.composer button[data-v-3d757c40]:disabled{opacity:.5;cursor:not-allowed}.resize[data-v-3d757c40]{position:absolute;right:1px;bottom:1px;width:16px;height:16px;cursor:nwse-resize;touch-action:none;opacity:.5;background:repeating-linear-gradient(135deg,transparent 0 3px,var(--md-on-surface-variant) 3px 4px)}.resize[data-v-3d757c40]:hover{opacity:.85}.lsw-scrim[data-v-3d757c40]{position:fixed;inset:0;z-index:var(--z-modal, 4000);background:var(--md-scrim, color-mix(in srgb, #18132d 42%, transparent));backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.lsw-dialog[data-v-3d757c40]{width:min(560px,100%);max-height:85vh;overflow:auto;border-radius:28px;background:var(--md-surface);color:var(--md-on-surface);padding:28px;box-shadow:0 24px 70px #18132d33;outline:none}.lsw-dialog header[data-v-3d757c40]{display:flex;justify-content:space-between;align-items:center;gap:16px}.lsw-eyebrow[data-v-3d757c40]{font-size:12px;letter-spacing:2px;color:var(--md-primary);font-weight:700}.lsw-dialog h2[data-v-3d757c40]{font-size:24px;margin:8px 0}.lsw-meta[data-v-3d757c40]{font-size:12px;color:var(--md-on-surface-variant);overflow-wrap:anywhere;margin:0}.lsw-body[data-v-3d757c40]{margin:16px 0;white-space:pre-wrap;overflow-wrap:anywhere}.lsw-dialog button[data-v-3d757c40]{border:0;border-radius:999px;padding:12px 20px;font:inherit;cursor:pointer;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.lsw-dialog .lsw-primary[data-v-3d757c40]{background:var(--md-primary);color:var(--md-on-primary, #fff)}.lsw-dialog footer[data-v-3d757c40]{display:flex;justify-content:flex-end;gap:12px;margin-top:20px}.lsw-fab[data-v-3d757c40]{position:fixed;right:24px;bottom:24px;z-index:var(--z-toast, 6000);display:inline-flex;align-items:center;gap:8px;border:0;border-radius:999px;padding:12px 20px;background:var(--md-primary);color:var(--md-on-primary, #fff);font:inherit;font-weight:700;cursor:pointer;box-shadow:var(--shadow-3)}.lsw-badge[data-v-3d757c40]{background:var(--md-error);color:var(--md-on-error, #fff);border-radius:999px;padding:0 8px;font-size:12px}.lsw-fade-enter-active[data-v-3d757c40]{transition:opacity .24s var(--ease-emphasized-decel),transform .24s var(--ease-emphasized-decel)}.lsw-fade-leave-active[data-v-3d757c40]{transition:opacity .14s var(--ease-emphasized-accel),transform .14s var(--ease-emphasized-accel)}.lsw-fade-enter-from[data-v-3d757c40],.lsw-fade-leave-to[data-v-3d757c40]{opacity:0;transform:translateY(-6px) scale(.99)}.lsw-fab-enter-active[data-v-3d757c40]{transition:opacity .2s var(--ease-emphasized-decel),transform .2s var(--ease-emphasized-decel)}.lsw-fab-leave-active[data-v-3d757c40]{transition:opacity .14s var(--ease-emphasized-accel),transform .14s var(--ease-emphasized-accel)}.lsw-fab-enter-from[data-v-3d757c40],.lsw-fab-leave-to[data-v-3d757c40]{opacity:0;transform:translateY(12px) scale(.9)}@media(prefers-reduced-motion:reduce){.lsw-fade-enter-active[data-v-3d757c40],.lsw-fade-leave-active[data-v-3d757c40],.lsw-fab-enter-active[data-v-3d757c40],.lsw-fab-leave-active[data-v-3d757c40]{transition-duration:1ms}.msg[data-v-3d757c40]{transition:none}}.leaflet-pane,.leaflet-tile,.leaflet-marker-icon,.leaflet-marker-shadow,.leaflet-tile-container,.leaflet-pane>svg,.leaflet-pane>canvas,.leaflet-zoom-box,.leaflet-image-layer,.leaflet-layer{position:absolute;left:0;top:0}.leaflet-container{overflow:hidden}.leaflet-tile,.leaflet-marker-icon,.leaflet-marker-shadow{-webkit-user-select:none;-moz-user-select:none;user-select:none;-webkit-user-drag:none}.leaflet-tile::selection{background:transparent}.leaflet-safari .leaflet-tile{image-rendering:-webkit-optimize-contrast}.leaflet-safari .leaflet-tile-container{width:1600px;height:1600px;-webkit-transform-origin:0 0}.leaflet-marker-icon,.leaflet-marker-shadow{display:block}.leaflet-container .leaflet-overlay-pane svg{max-width:none!important;max-height:none!important}.leaflet-container .leaflet-marker-pane img,.leaflet-container .leaflet-shadow-pane img,.leaflet-container .leaflet-tile-pane img,.leaflet-container img.leaflet-image-layer,.leaflet-container .leaflet-tile{max-width:none!important;max-height:none!important;width:auto;padding:0}.leaflet-container img.leaflet-tile{mix-blend-mode:plus-lighter}.leaflet-container.leaflet-touch-zoom{-ms-touch-action:pan-x pan-y;touch-action:pan-x pan-y}.leaflet-container.leaflet-touch-drag{-ms-touch-action:pinch-zoom;touch-action:none;touch-action:pinch-zoom}.leaflet-container.leaflet-touch-drag.leaflet-touch-zoom{-ms-touch-action:none;touch-action:none}.leaflet-container{-webkit-tap-highlight-color:transparent}.leaflet-container a{-webkit-tap-highlight-color:rgba(51,181,229,.4)}.leaflet-tile{filter:inherit;visibility:hidden}.leaflet-tile-loaded{visibility:inherit}.leaflet-zoom-box{width:0;height:0;-moz-box-sizing:border-box;box-sizing:border-box;z-index:800}.leaflet-overlay-pane svg{-moz-user-select:none}.leaflet-pane{z-index:400}.leaflet-tile-pane{z-index:200}.leaflet-overlay-pane{z-index:400}.leaflet-shadow-pane{z-index:500}.leaflet-marker-pane{z-index:600}.leaflet-tooltip-pane{z-index:650}.leaflet-popup-pane{z-index:700}.leaflet-map-pane canvas{z-index:100}.leaflet-map-pane svg{z-index:200}.leaflet-vml-shape{width:1px;height:1px}.lvml{behavior:url(#default#VML);display:inline-block;position:absolute}.leaflet-control{position:relative;z-index:800;pointer-events:visiblePainted;pointer-events:auto}.leaflet-top,.leaflet-bottom{position:absolute;z-index:1000;pointer-events:none}.leaflet-top{top:0}.leaflet-right{right:0}.leaflet-bottom{bottom:0}.leaflet-left{left:0}.leaflet-control{float:left;clear:both}.leaflet-right .leaflet-control{float:right}.leaflet-top .leaflet-control{margin-top:10px}.leaflet-bottom .leaflet-control{margin-bottom:10px}.leaflet-left .leaflet-control{margin-left:10px}.leaflet-right .leaflet-control{margin-right:10px}.leaflet-fade-anim .leaflet-popup{opacity:0;-webkit-transition:opacity .2s linear;-moz-transition:opacity .2s linear;transition:opacity .2s linear}.leaflet-fade-anim .leaflet-map-pane .leaflet-popup{opacity:1}.leaflet-zoom-animated{-webkit-transform-origin:0 0;-ms-transform-origin:0 0;transform-origin:0 0}svg.leaflet-zoom-animated{will-change:transform}.leaflet-zoom-anim .leaflet-zoom-animated{-webkit-transition:-webkit-transform .25s cubic-bezier(0,0,.25,1);-moz-transition:-moz-transform .25s cubic-bezier(0,0,.25,1);transition:transform .25s cubic-bezier(0,0,.25,1)}.leaflet-zoom-anim .leaflet-tile,.leaflet-pan-anim .leaflet-tile{-webkit-transition:none;-moz-transition:none;transition:none}.leaflet-zoom-anim .leaflet-zoom-hide{visibility:hidden}.leaflet-interactive{cursor:pointer}.leaflet-grab{cursor:-webkit-grab;cursor:-moz-grab;cursor:grab}.leaflet-crosshair,.leaflet-crosshair .leaflet-interactive{cursor:crosshair}.leaflet-popup-pane,.leaflet-control{cursor:auto}.leaflet-dragging .leaflet-grab,.leaflet-dragging .leaflet-grab .leaflet-interactive,.leaflet-dragging .leaflet-marker-draggable{cursor:move;cursor:-webkit-grabbing;cursor:-moz-grabbing;cursor:grabbing}.leaflet-marker-icon,.leaflet-marker-shadow,.leaflet-image-layer,.leaflet-pane>svg path,.leaflet-tile-container{pointer-events:none}.leaflet-marker-icon.leaflet-interactive,.leaflet-image-layer.leaflet-interactive,.leaflet-pane>svg path.leaflet-interactive,svg.leaflet-image-layer.leaflet-interactive path{pointer-events:visiblePainted;pointer-events:auto}.leaflet-container{background:#ddd;outline-offset:1px}.leaflet-container a{color:#0078a8}.leaflet-zoom-box{border:2px dotted #38f;background:#ffffff80}.leaflet-container{font-family:Helvetica Neue,Arial,Helvetica,sans-serif;font-size:12px;font-size:.75rem;line-height:1.5}.leaflet-bar{box-shadow:0 1px 5px #000000a6;border-radius:4px}.leaflet-bar a{background-color:#fff;border-bottom:1px solid #ccc;width:26px;height:26px;line-height:26px;display:block;text-align:center;text-decoration:none;color:#000}.leaflet-bar a,.leaflet-control-layers-toggle{background-position:50% 50%;background-repeat:no-repeat;display:block}.leaflet-bar a:hover,.leaflet-bar a:focus{background-color:#f4f4f4}.leaflet-bar a:first-child{border-top-left-radius:4px;border-top-right-radius:4px}.leaflet-bar a:last-child{border-bottom-left-radius:4px;border-bottom-right-radius:4px;border-bottom:none}.leaflet-bar a.leaflet-disabled{cursor:default;background-color:#f4f4f4;color:#bbb}.leaflet-touch .leaflet-bar a{width:30px;height:30px;line-height:30px}.leaflet-touch .leaflet-bar a:first-child{border-top-left-radius:2px;border-top-right-radius:2px}.leaflet-touch .leaflet-bar a:last-child{border-bottom-left-radius:2px;border-bottom-right-radius:2px}.leaflet-control-zoom-in,.leaflet-control-zoom-out{font:700 18px Lucida Console,Monaco,monospace;text-indent:1px}.leaflet-touch .leaflet-control-zoom-in,.leaflet-touch .leaflet-control-zoom-out{font-size:22px}.leaflet-control-layers{box-shadow:0 1px 5px #0006;background:#fff;border-radius:5px}.leaflet-control-layers-toggle{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAQAAAADQ4RFAAACf0lEQVR4AY1UM3gkARTePdvdoTxXKc+qTl3aU5U6b2Kbkz3Gtq3Zw6ziLGNPzrYx7946Tr6/ee/XeCQ4D3ykPtL5tHno4n0d/h3+xfuWHGLX81cn7r0iTNzjr7LrlxCqPtkbTQEHeqOrTy4Yyt3VCi/IOB0v7rVC7q45Q3Gr5K6jt+3Gl5nCoDD4MtO+j96Wu8atmhGqcNGHObuf8OM/x3AMx38+4Z2sPqzCxRFK2aF2e5Jol56XTLyggAMTL56XOMoS1W4pOyjUcGGQdZxU6qRh7B9Zp+PfpOFlqt0zyDZckPi1ttmIp03jX8gyJ8a/PG2yutpS/Vol7peZIbZcKBAEEheEIAgFbDkz5H6Zrkm2hVWGiXKiF4Ycw0RWKdtC16Q7qe3X4iOMxruonzegJzWaXFrU9utOSsLUmrc0YjeWYjCW4PDMADElpJSSQ0vQvA1Tm6/JlKnqFs1EGyZiFCqnRZTEJJJiKRYzVYzJck2Rm6P4iH+cmSY0YzimYa8l0EtTODFWhcMIMVqdsI2uiTvKmTisIDHJ3od5GILVhBCarCfVRmo4uTjkhrhzkiBV7SsaqS+TzrzM1qpGGUFt28pIySQHR6h7F6KSwGWm97ay+Z+ZqMcEjEWebE7wxCSQwpkhJqoZA5ivCdZDjJepuJ9IQjGGUmuXJdBFUygxVqVsxFsLMbDe8ZbDYVCGKxs+W080max1hFCarCfV+C1KATwcnvE9gRRuMP2prdbWGowm1KB1y+zwMMENkM755cJ2yPDtqhTI6ED1M/82yIDtC/4j4BijjeObflpO9I9MwXTCsSX8jWAFeHr05WoLTJ5G8IQVS/7vwR6ohirYM7f6HzYpogfS3R2OAAAAAElFTkSuQmCC);width:36px;height:36px}.leaflet-retina .leaflet-control-layers-toggle{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAQAAABvcdNgAAAEsklEQVR4AWL4TydIhpZK1kpWOlg0w3ZXP6D2soBtG42jeI6ZmQTHzAxiTbSJsYLjO9HhP+WOmcuhciVnmHVQcJnp7DFvScowZorad/+V/fVzMdMT2g9Cv9guXGv/7pYOrXh2U+RRR3dSd9JRx6bIFc/ekqHI29JC6pJ5ZEh1yWkhkbcFeSjxgx3L2m1cb1C7bceyxA+CNjT/Ifff+/kDk2u/w/33/IeCMOSaWZ4glosqT3DNnNZQ7Cs58/3Ce5HL78iZH/vKVIaYlqzfdLu8Vi7dnvUbEza5Idt36tquZFldl6N5Z/POLof0XLK61mZCmJSWjVF9tEjUluu74IUXvgttuVIHE7YxSkaYhJZam7yiM9Pv82JYfl9nptxZaxMJE4YSPty+vF0+Y2up9d3wwijfjZbabqm/3bZ9ecKHsiGmRflnn1MW4pjHf9oLufyn2z3y1D6n8g8TZhxyzipLNPnAUpsOiuWimg52psrTZYnOWYNDTMuWBWa0tJb4rgq1UvmutpaYEbZlwU3CLJm/ayYjHW5/h7xWLn9Hh1vepDkyf7dE7MtT5LR4e7yYpHrkhOUpEfssBLq2pPhAqoSWKUkk7EDqkmK6RrCEzqDjhNDWNE+XSMvkJRDWlZTmCW0l0PHQGRZY5t1L83kT0Y3l2SItk5JAWHl2dCOBm+fPu3fo5/3v61RMCO9Jx2EEYYhb0rmNQMX/vm7gqOEJLcXTGw3CAuRNeyaPWwjR8PRqKQ1PDA/dpv+on9Shox52WFnx0KY8onHayrJzm87i5h9xGw/tfkev0jGsQizqezUKjk12hBMKJ4kbCqGPVNXudyyrShovGw5CgxsRICxF6aRmSjlBnHRzg7Gx8fKqEubI2rahQYdR1YgDIRQO7JvQyD52hoIQx0mxa0ODtW2Iozn1le2iIRdzwWewedyZzewidueOGqlsn1MvcnQpuVwLGG3/IR1hIKxCjelIDZ8ldqWz25jWAsnldEnK0Zxro19TGVb2ffIZEsIO89EIEDvKMPrzmBOQcKQ+rroye6NgRRxqR4U8EAkz0CL6uSGOm6KQCdWjvjRiSP1BPalCRS5iQYiEIvxuBMJEWgzSoHADcVMuN7IuqqTeyUPq22qFimFtxDyBBJEwNyt6TM88blFHao/6tWWhuuOM4SAK4EI4QmFHA+SEyWlp4EQoJ13cYGzMu7yszEIBOm2rVmHUNqwAIQabISNMRstmdhNWcFLsSm+0tjJH1MdRxO5Nx0WDMhCtgD6OKgZeljJqJKc9po8juskR9XN0Y1lZ3mWjLR9JCO1jRDMd0fpYC2VnvjBSEFg7wBENc0R9HFlb0xvF1+TBEpF68d+DHR6IOWVv2BECtxo46hOFUBd/APU57WIoEwJhIi2CdpyZX0m93BZicktMj1AS9dClteUFAUNUIEygRZCtik5zSxI9MubTBH1GOiHsiLJ3OCoSZkILa9PxiN0EbvhsAo8tdAf9Seepd36lGWHmtNANTv5Jd0z4QYyeo/UEJqxKRpg5LZx6btLPsOaEmdMyxYdlc8LMaJnikDlhclqmPiQnTEpLUIZEwkRagjYkEibQErwhkTAKCLQEbUgkzJQWc/0PstHHcfEdQ+UAAAAASUVORK5CYII=);background-size:26px 26px}.leaflet-touch .leaflet-control-layers-toggle{width:44px;height:44px}.leaflet-control-layers .leaflet-control-layers-list,.leaflet-control-layers-expanded .leaflet-control-layers-toggle{display:none}.leaflet-control-layers-expanded .leaflet-control-layers-list{display:block;position:relative}.leaflet-control-layers-expanded{padding:6px 10px 6px 6px;color:#333;background:#fff}.leaflet-control-layers-scrollbar{overflow-y:scroll;overflow-x:hidden;padding-right:5px}.leaflet-control-layers-selector{margin-top:2px;position:relative;top:1px}.leaflet-control-layers label{display:block;font-size:13px;font-size:1.08333em}.leaflet-control-layers-separator{height:0;border-top:1px solid #ddd;margin:5px -10px 5px -6px}.leaflet-default-icon-path{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII=)}.leaflet-container .leaflet-control-attribution{background:#fff;background:#fffc;margin:0}.leaflet-control-attribution,.leaflet-control-scale-line{padding:0 5px;color:#333;line-height:1.4}.leaflet-control-attribution a{text-decoration:none}.leaflet-control-attribution a:hover,.leaflet-control-attribution a:focus{text-decoration:underline}.leaflet-attribution-flag{display:inline!important;vertical-align:baseline!important;width:1em;height:.6669em}.leaflet-left .leaflet-control-scale{margin-left:5px}.leaflet-bottom .leaflet-control-scale{margin-bottom:5px}.leaflet-control-scale-line{border:2px solid #777;border-top:none;line-height:1.1;padding:2px 5px 1px;white-space:nowrap;-moz-box-sizing:border-box;box-sizing:border-box;background:#fffc;text-shadow:1px 1px #fff}.leaflet-control-scale-line:not(:first-child){border-top:2px solid #777;border-bottom:none;margin-top:-2px}.leaflet-control-scale-line:not(:first-child):not(:last-child){border-bottom:2px solid #777}.leaflet-touch .leaflet-control-attribution,.leaflet-touch .leaflet-control-layers,.leaflet-touch .leaflet-bar{box-shadow:none}.leaflet-touch .leaflet-control-layers,.leaflet-touch .leaflet-bar{border:2px solid rgba(0,0,0,.2);background-clip:padding-box}.leaflet-popup{position:absolute;text-align:center;margin-bottom:20px}.leaflet-popup-content-wrapper{padding:1px;text-align:left;border-radius:12px}.leaflet-popup-content{margin:13px 24px 13px 20px;line-height:1.3;font-size:13px;font-size:1.08333em;min-height:1px}.leaflet-popup-content p{margin:1.3em 0}.leaflet-popup-tip-container{width:40px;height:20px;position:absolute;left:50%;margin-top:-1px;margin-left:-20px;overflow:hidden;pointer-events:none}.leaflet-popup-tip{width:17px;height:17px;padding:1px;margin:-10px auto 0;pointer-events:auto;-webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);-ms-transform:rotate(45deg);transform:rotate(45deg)}.leaflet-popup-content-wrapper,.leaflet-popup-tip{background:#fff;color:#333;box-shadow:0 3px 14px #0006}.leaflet-container a.leaflet-popup-close-button{position:absolute;top:0;right:0;border:none;text-align:center;width:24px;height:24px;font:16px/24px Tahoma,Verdana,sans-serif;color:#757575;text-decoration:none;background:transparent}.leaflet-container a.leaflet-popup-close-button:hover,.leaflet-container a.leaflet-popup-close-button:focus{color:#585858}.leaflet-popup-scrolled{overflow:auto}.leaflet-oldie .leaflet-popup-content-wrapper{-ms-zoom:1}.leaflet-oldie .leaflet-popup-tip{width:24px;margin:0 auto;-ms-filter:\"progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678)\";filter:progid:DXImageTransform.Microsoft.Matrix(M11=.70710678,M12=.70710678,M21=-.70710678,M22=.70710678)}.leaflet-oldie .leaflet-control-zoom,.leaflet-oldie .leaflet-control-layers,.leaflet-oldie .leaflet-popup-content-wrapper,.leaflet-oldie .leaflet-popup-tip{border:1px solid #999}.leaflet-div-icon{background:#fff;border:1px solid #666}.leaflet-tooltip{position:absolute;padding:6px;background-color:#fff;border:1px solid #fff;border-radius:3px;color:#222;white-space:nowrap;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none;box-shadow:0 1px 3px #0006}.leaflet-tooltip.leaflet-interactive{cursor:pointer;pointer-events:auto}.leaflet-tooltip-top:before,.leaflet-tooltip-bottom:before,.leaflet-tooltip-left:before,.leaflet-tooltip-right:before{position:absolute;pointer-events:none;border:6px solid transparent;background:transparent;content:\"\"}.leaflet-tooltip-bottom{margin-top:6px}.leaflet-tooltip-top{margin-top:-6px}.leaflet-tooltip-bottom:before,.leaflet-tooltip-top:before{left:50%;margin-left:-6px}.leaflet-tooltip-top:before{bottom:0;margin-bottom:-12px;border-top-color:#fff}.leaflet-tooltip-bottom:before{top:0;margin-top:-12px;margin-left:-6px;border-bottom-color:#fff}.leaflet-tooltip-left{margin-left:-6px}.leaflet-tooltip-right{margin-left:6px}.leaflet-tooltip-left:before,.leaflet-tooltip-right:before{top:50%;margin-top:-6px}.leaflet-tooltip-left:before{right:0;margin-right:-12px;border-left-color:#fff}.leaflet-tooltip-right:before{left:0;margin-left:-12px;border-right-color:#fff}@media print{.leaflet-control{-webkit-print-color-adjust:exact;print-color-adjust:exact}}.world-field[data-v-7d345f44]{display:block;margin:10px 0}.world-label[data-v-7d345f44]{display:block;font-size:12px;font-weight:600;color:var(--md-on-surface-variant);margin-bottom:4px}.world-text[data-v-7d345f44]{width:100%;min-height:64px;padding:10px 14px;border:1px solid var(--md-outline-variant);border-radius:var(--r-sm);background:var(--md-surface-container-high);color:var(--md-on-surface);font:inherit;font-size:13px;line-height:1.5;resize:vertical;outline:none}.world-text[data-v-7d345f44]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 14%,transparent)}.world-actions[data-v-7d345f44]{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-top:12px}.wm-head[data-v-7d345f44]{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;margin-bottom:6px}.wm-place[data-v-7d345f44]{font-size:12px;color:var(--md-on-surface-variant)}.wm-premise[data-v-7d345f44]{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin:2px 0 8px}.wm-map-wrap[data-v-7d345f44]{position:relative;margin-top:8px}.world-map-leaflet[data-v-7d345f44]{height:clamp(460px,72vh,820px);border-radius:16px;overflow:hidden;border:1px solid var(--md-outline-variant);background:#e8edf2}.world-map-leaflet.is-empty[data-v-7d345f44]{display:none}.wm-reset[data-v-7d345f44]{position:absolute;top:10px;right:10px;z-index:var(--z-overlay,2000);border:1px solid var(--md-outline-variant);background:#fffffff0;color:#33404c;border-radius:10px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer;box-shadow:0 1px 4px #0000002e}.wm-reset[data-v-7d345f44]:hover{background:#fff}.wm-compass[data-v-7d345f44]{position:absolute;left:12px;bottom:12px;z-index:var(--z-overlay,2000);width:38px;height:38px;border-radius:50%;background:#ffffffeb;border:1px solid #b9c3cd;box-shadow:0 1px 4px #0000002e;display:grid;place-items:center}.wm-compass i[data-v-7d345f44]{font-style:normal;font-size:12px;font-weight:800;color:#d64545;position:relative}.wm-compass i[data-v-7d345f44]:before{content:\"\";position:absolute;left:50%;top:-9px;transform:translate(-50%);border-left:4px solid transparent;border-right:4px solid transparent;border-bottom:9px solid #33404c}.wm-scope[data-v-7d345f44]{position:absolute;bottom:12px;right:12px;z-index:var(--z-overlay,2000);border:1px solid var(--md-outline-variant);background:#fffffff0;color:#33404c;border-radius:10px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer;box-shadow:0 1px 4px #0000002e}.wm-scope[data-v-7d345f44]:hover{background:#fff}.wm-offline[data-v-7d345f44]{position:absolute;left:50%;bottom:12px;transform:translate(-50%);z-index:var(--z-overlay,2000);background:#d1495bf0;color:#fff;font-size:12px;font-weight:600;padding:5px 12px;border-radius:10px;box-shadow:0 1px 4px #00000040}.wm-routes[data-v-7d345f44]{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(280px,100%),1fr));gap:18px;margin-top:14px}.wm-routes h4[data-v-7d345f44]{margin:0 0 6px;font-size:13px;font-weight:800}.wm-routes ul[data-v-7d345f44]{list-style:none;margin:0;padding:0}.wm-routes li[data-v-7d345f44]{display:flex;gap:10px;padding:4px 0;border-bottom:1px dashed color-mix(in srgb,var(--md-outline-variant) 70%,transparent);font-size:12.5px}.wm-routes b[data-v-7d345f44]{flex:0 0 88px}.wm-routes span[data-v-7d345f44]{color:var(--md-on-surface-variant);line-height:1.5}.wm-legend[data-v-7d345f44]{display:flex;flex-wrap:wrap;gap:14px;margin-top:12px;font-size:12px;color:var(--md-on-surface-variant)}.wm-legend span[data-v-7d345f44]{display:inline-flex;align-items:center;gap:6px}.wm-legend i[data-v-7d345f44]{width:12px;height:12px;border-radius:50%;display:inline-block;border:1.5px solid rgba(255,255,255,.7)}.wm-legend i.k-home[data-v-7d345f44]{background:#e07a5f}.wm-legend i.k-work[data-v-7d345f44]{background:#5b8def}.wm-legend i.k-shop[data-v-7d345f44]{background:#e0a23d}.wm-legend i.k-food[data-v-7d345f44]{background:#57a773}.wm-legend i.k-park[data-v-7d345f44]{background:#3faead}.wm-legend i.k-transit[data-v-7d345f44]{background:#8b6fd6}.wm-legend i.k-other[data-v-7d345f44]{background:#8a94a6}.wm-legend i.k-actor[data-v-7d345f44]{background:#fff;border-color:#d1495b;box-shadow:inset 0 0 0 3px #d1495b}.wm-legend i.k-metro[data-v-7d345f44]{background:#d64545}.wm-legend i.k-bus[data-v-7d345f44]{background:#e08a2e}.wm-legend i.k-park2[data-v-7d345f44]{background:#9bd08f}.wm-legend i.k-water[data-v-7d345f44]{background:#8fbfe6}.wm-legend i.k-hw[data-v-7d345f44]{background:#f08c2e}.wm-legend i.k-arterial[data-v-7d345f44]{background:#f7cf8a}.wm-legend i.k-street[data-v-7d345f44]{background:#fff;border-color:#b9c3cd}.pfield[data-v-7d345f44]{display:flex;flex-direction:column;gap:4px;margin-top:10px;font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}#app .pcp .pfield textarea.field[data-v-7d345f44]{height:auto;min-height:70px;padding:10px 12px;resize:vertical;line-height:1.5}.cog-metric[data-v-7d345f44]{display:flex;flex-direction:column;gap:4px;padding:10px 12px;border-radius:var(--r-sm);background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant)}.cog-metric span[data-v-7d345f44]{font-size:11px;font-weight:700;letter-spacing:.04em;color:var(--md-on-surface-variant)}.cog-metric strong[data-v-7d345f44]{font-size:16px;font-weight:800;letter-spacing:-.01em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.cog-metric.warn[data-v-7d345f44]{border-color:var(--md-error,#b3261e);background:color-mix(in srgb,var(--md-error,#b3261e) 8%,transparent)}.cog-metric.warn span[data-v-7d345f44],.cog-metric.warn strong[data-v-7d345f44]{color:var(--md-error,#b3261e)}.som-channels[data-v-7d345f44]{margin-top:10px;display:flex;flex-direction:column;gap:6px}.som-chan[data-v-7d345f44]{display:grid;grid-template-columns:minmax(52px,88px) minmax(0,1fr) 48px;align-items:center;gap:10px}.som-chan-name[data-v-7d345f44]{font-size:12px;font-weight:600;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.som-chan-bar[data-v-7d345f44]{display:block;height:8px;border-radius:999px;background:var(--md-surface-container);overflow:hidden}.som-chan-bar i[data-v-7d345f44]{display:block;width:100%;height:100%;border-radius:999px;background:var(--md-primary);transform-origin:left;transition:transform var(--duration-medium) var(--ease-out);will-change:transform}.som-chan-val[data-v-7d345f44]{font-size:12px;font-weight:700;text-align:right;color:var(--md-on-surface-variant)}.at-a-glance[data-v-7d345f44]{display:grid;grid-template-columns:190px minmax(0,1fr) minmax(0,1fr);gap:14px;align-items:start;margin:8px 0 4px}@media(max-width:900px){.at-a-glance[data-v-7d345f44]{grid-template-columns:1fr 1fr}}@media(max-width:620px){.at-a-glance[data-v-7d345f44]{grid-template-columns:1fr}}.mood-plot-wrap[data-v-7d345f44]{position:relative;width:190px;padding:26px 22px 40px;background:var(--md-surface-container);border:1px solid color-mix(in srgb,var(--md-outline-variant) 60%,transparent);border-radius:var(--r-md);box-sizing:border-box}.mood-plot[data-v-7d345f44]{display:block;width:100%}.plot-frame[data-v-7d345f44]{fill:var(--md-surface-container-lowest);stroke:var(--md-outline-variant)}.plot-grid[data-v-7d345f44]{stroke:var(--md-outline-variant);stroke-width:1;stroke-dasharray:3 4}.plot-dot[data-v-7d345f44]{fill:var(--md-primary)}.plot-halo[data-v-7d345f44]{fill:var(--md-primary);opacity:.22}.plot-label[data-v-7d345f44]{position:absolute;font-size:10px;font-weight:700;letter-spacing:.04em;color:var(--md-on-surface-variant);pointer-events:none}.plot-n[data-v-7d345f44]{top:6px;left:50%;transform:translate(-50%)}.plot-s[data-v-7d345f44]{bottom:26px;left:50%;transform:translate(-50%)}.plot-w[data-v-7d345f44]{left:8px;top:50%;transform:translateY(-58%)}.plot-e[data-v-7d345f44]{right:8px;top:50%;transform:translateY(-58%)}.plot-quadrant[data-v-7d345f44]{position:absolute;left:0;right:0;bottom:8px;text-align:center;font-size:12px;font-weight:800;color:var(--md-primary)}.glance-col[data-v-7d345f44]{display:flex;flex-direction:column;gap:8px;min-width:0}.glance-title[data-v-7d345f44]{display:flex;align-items:center;gap:8px;margin:0;font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--md-on-surface-variant)}.gauge-grid[data-v-7d345f44]{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:10px;margin:8px 0}.gauge[data-v-7d345f44]{display:flex;flex-direction:column;gap:5px;padding:10px 12px;border-radius:var(--r-sm);background:var(--md-surface-container);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);min-width:0}.gauge-head[data-v-7d345f44]{display:flex;justify-content:space-between;align-items:baseline;gap:8px}.gauge-name[data-v-7d345f44]{font-size:12px;font-weight:700;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.gauge-alias[data-v-7d345f44]{font-style:normal;font-weight:500;font-size:11px;color:var(--md-on-surface-variant);opacity:.8;margin-left:6px}.gauge-val[data-v-7d345f44]{font-size:13px;font-weight:800;font-variant-numeric:tabular-nums;white-space:nowrap}.gauge-state[data-v-7d345f44]{font-weight:800;margin-right:2px}.gauge-state.good[data-v-7d345f44]{color:var(--md-success)}.gauge-state.mid[data-v-7d345f44]{color:var(--md-primary)}.gauge-state.bad[data-v-7d345f44]{color:var(--md-error)}.gauge-bar[data-v-7d345f44]{position:relative;display:block;height:8px;border-radius:999px;background:var(--md-surface-container-highest);overflow:visible}.gauge-bar.signed[data-v-7d345f44]:before{content:\"\";position:absolute;left:50%;top:-3px;bottom:-3px;width:2px;border-radius:1px;background:var(--md-outline-variant)}.gauge-fill[data-v-7d345f44]{position:absolute;top:0;bottom:0;border-radius:999px;transition:width .35s var(--ease-out,.25s ease),left .35s var(--ease-out,.25s ease)}.gauge-fill.good[data-v-7d345f44]{background:var(--md-success)}.gauge-fill.mid[data-v-7d345f44]{background:var(--md-primary)}.gauge-fill.bad[data-v-7d345f44]{background:var(--md-error)}.gauge-effect[data-v-7d345f44]{font-size:11px;line-height:1.45;color:var(--md-on-surface-variant)}.chip-row[data-v-7d345f44]{display:flex;gap:8px;flex-wrap:wrap;margin:8px 0}.chip.warn[data-v-7d345f44]{background:var(--md-error-container);color:var(--md-on-error-container)}.rel-card[data-v-7d345f44]{display:flex;flex-direction:column;gap:10px}.rel-head[data-v-7d345f44]{display:flex;justify-content:space-between;gap:10px;align-items:baseline;flex-wrap:wrap}.rel-track-row[data-v-7d345f44]{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:10px;align-items:center}.rel-track-label[data-v-7d345f44],.rel-stage-name[data-v-7d345f44]{font-size:11px;font-weight:800;letter-spacing:.04em;color:var(--md-on-surface-variant);white-space:nowrap}.rel-stage-name[data-v-7d345f44]{color:var(--md-primary)}.rel-track[data-v-7d345f44]{display:flex;gap:3px;height:10px;border-radius:999px;overflow:hidden;background:var(--md-surface-container-highest)}.rel-seg[data-v-7d345f44]{flex:1 1 0;background:color-mix(in srgb,var(--md-outline-variant) 45%,transparent)}.rel-seg.done[data-v-7d345f44]{background:color-mix(in srgb,var(--md-primary) 45%,transparent)}.rel-seg.cur[data-v-7d345f44]{background:var(--md-primary)}.rel-mode[data-v-7d345f44]{display:flex;flex-direction:column;gap:4px;align-items:flex-start}.value-row[data-v-7d345f44]{display:grid;grid-template-columns:minmax(72px,140px) minmax(0,1fr) 44px;gap:10px;align-items:center}.value-name[data-v-7d345f44]{font-size:13px;font-weight:700;overflow-wrap:anywhere}.value-bar[data-v-7d345f44]{position:relative;display:block;height:8px;border-radius:999px;background:var(--md-surface-container-highest)}.value-bar[data-v-7d345f44]:before{content:\"\";position:absolute;left:50%;top:-3px;bottom:-3px;width:2px;border-radius:1px;background:var(--md-outline-variant)}.value-bar i[data-v-7d345f44]{position:absolute;top:0;bottom:0;border-radius:999px;transition:width .35s var(--ease-out,.25s ease),left .35s var(--ease-out,.25s ease)}.value-bar i.good[data-v-7d345f44]{background:var(--md-success)}.value-bar i.bad[data-v-7d345f44]{background:var(--md-error)}.value-num[data-v-7d345f44]{font-size:12px;font-weight:800;text-align:right;font-variant-numeric:tabular-nums;color:var(--md-on-surface-variant)}.chip[data-v-7d345f44]{display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 12px;border-radius:999px;font-size:12px;font-weight:700;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.chip.muted[data-v-7d345f44]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}.chip.ok[data-v-7d345f44]{background:var(--md-success-container);color:var(--md-on-success-container,#0d3b1e)}#app .pcp .cog-metric[data-v-7d345f44]{background:var(--md-surface-container)}.sync-pill[data-v-7d345f44]{font-weight:500;opacity:.85}html[data-theme=dark] #app .pcp .world-map-leaflet{background:#10151c}html[data-theme=dark] #app .pcp .wm-reset,html[data-theme=dark] #app .pcp .wm-scope{background:color-mix(in srgb,var(--md-surface-container-high) 94%,transparent);color:var(--md-on-surface)}html[data-theme=dark] #app .pcp .wm-reset:hover,html[data-theme=dark] #app .pcp .wm-scope:hover{background:var(--md-surface-container-highest)}html[data-theme=dark] #app .pcp .wm-compass{background:color-mix(in srgb,var(--md-surface-container-high) 92%,transparent);border-color:var(--md-outline-variant)}html[data-theme=dark] .wm-district-inner{color:#aeb9c4;text-shadow:none}html[data-theme=dark] .wm-station .wm-route-inner{background:#1a2230;color:#d7dee6}html[data-theme=dark] .leaflet-container{background:#10151c}.wm-pin-holder,.wm-actor-holder{background:none;border:none}.wm-pin{position:absolute;left:0;top:0;width:16px;height:16px;border-radius:50%;background:var(--c,#8a94a6);border:3px solid #fff;box-shadow:0 2px 6px #00000073;transform:translate(-50%,-50%)}.wm-pin:after{content:\"\";position:absolute;left:50%;top:100%;width:2px;height:8px;background:#fff;transform:translate(-50%);opacity:.7}.wm-pin-label{position:absolute;left:12px;top:-9px;white-space:nowrap;background:#12141ad1;color:#fff;font-size:12px;font-weight:600;padding:2px 8px;border-radius:10px;pointer-events:none}.wm-actor-badge{position:absolute;left:0;top:0;width:26px;height:26px;border-radius:50%;background:#fff;color:#d1495b;border:3px solid #d1495b;font-size:14px;font-weight:800;line-height:1;display:grid;place-items:center;transform:translate(-50%,-50%);box-shadow:0 2px 6px #00000080;z-index:600}.wm-actor-name{position:absolute;left:0;top:20px;white-space:nowrap;background:#d1495b;color:#fff;font-size:11px;font-weight:700;padding:1px 7px;border-radius:9px;transform:translate(-50%)}.wm-district{background:none;border:none}.wm-district-inner{position:absolute;left:0;top:0;transform:translate(-50%,-50%);white-space:nowrap;font-size:12px;font-weight:800;letter-spacing:.2em;color:#5c6b78;text-shadow:0 1px 0 rgba(255,255,255,.9);pointer-events:none}.wm-route{background:none;border:none}.wm-route-inner{position:absolute;left:0;top:0;transform:translate(-50%,-50%);background:var(--c,#333);color:#fff;font-size:10px;font-weight:700;padding:1px 6px;border-radius:8px;white-space:nowrap;box-shadow:0 1px 3px #00000059;pointer-events:none}.wm-zoom-low .wm-minor{display:none}.wm-station .wm-route-inner{background:#fff;color:#33404c;border:1.5px solid var(--c,#888);border-radius:6px;font-size:9px;font-weight:700;padding:1px 5px}.leaflet-container{font-family:inherit;background:#e8edf2;border-radius:16px}.leaflet-container a{color:#2f6fed}.leaflet-popup-content{font-size:13px;line-height:1.5}\n";document.head.appendChild(s)}})();
