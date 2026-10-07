import { defineComponent as ga, ref as $, watch as De, nextTick as bo, computed as D, onUnmounted as wo, onMounted as Bn, openBlock as b, createElementBlock as w, createElementVNode as o, createTextVNode as ft, toDisplayString as u, normalizeClass as ke, createCommentVNode as Z, Fragment as pt, renderList as oe, withDirectives as y, vModelText as S, createVNode as Ct, unref as Et, vShow as Fi, vModelCheckbox as at, normalizeStyle as Nn } from "vue";
import { useRouter as ya } from "vue-router";
import { useConfirm as ba, AppSelect as At, i18n as xo } from "@0kay/host";
import { i as wa, b as Po, s as xa, f as Lo, a as Pa, l as La, F as Ta } from "./assets/kit-Du4J5J-o.js";
import { _ as ka } from "./assets/AdapterSettingsPage.vue_vue_type_script_setup_true_lang-BLhwQTnp.js";
import { _ as Sa } from "./assets/_plugin-vue_export-helper-CHgC5LLL.js";
function Ca(Se) {
  return Se && Se.__esModule && Object.prototype.hasOwnProperty.call(Se, "default") ? Se.default : Se;
}
var Hi = { exports: {} };
var Ma = Hi.exports, To;
function za() {
  return To || (To = 1, (function(Se, Re) {
    (function(s, vt) {
      vt(Re);
    })(Ma, (function(s) {
      var vt = "1.9.4";
      function J(t) {
        var e, i, n, a;
        for (i = 1, n = arguments.length; i < n; i++) {
          a = arguments[i];
          for (e in a)
            t[e] = a[e];
        }
        return t;
      }
      var st = Object.create || /* @__PURE__ */ (function() {
        function t() {
        }
        return function(e) {
          return t.prototype = e, new t();
        };
      })();
      function q(t, e) {
        var i = Array.prototype.slice;
        if (t.bind)
          return t.bind.apply(t, i.call(arguments, 1));
        var n = i.call(arguments, 2);
        return function() {
          return t.apply(e, n.length ? n.concat(i.call(arguments)) : arguments);
        };
      }
      var de = 0;
      function U(t) {
        return "_leaflet_id" in t || (t._leaflet_id = ++de), t._leaflet_id;
      }
      function Mt(t, e, i) {
        var n, a, l, h;
        return h = function() {
          n = !1, a && (l.apply(i, a), a = !1);
        }, l = function() {
          n ? a = arguments : (t.apply(i, arguments), setTimeout(h, e), n = !0);
        }, l;
      }
      function ae(t, e, i) {
        var n = e[1], a = e[0], l = n - a;
        return t === n && i ? t : ((t - a) % l + l) % l + a;
      }
      function lt() {
        return !1;
      }
      function rt(t, e) {
        if (e === !1)
          return t;
        var i = Math.pow(10, e === void 0 ? 6 : e);
        return Math.round(t * i) / i;
      }
      function se(t) {
        return t.trim ? t.trim() : t.replace(/^\s+|\s+$/g, "");
      }
      function yt(t) {
        return se(t).split(/\s+/);
      }
      function et(t, e) {
        Object.prototype.hasOwnProperty.call(t, "options") || (t.options = t.options ? st(t.options) : {});
        for (var i in e)
          t.options[i] = e[i];
        return t.options;
      }
      function Wi(t, e, i) {
        var n = [];
        for (var a in t)
          n.push(encodeURIComponent(i ? a.toUpperCase() : a) + "=" + encodeURIComponent(t[a]));
        return (!e || e.indexOf("?") === -1 ? "?" : "&") + n.join("&");
      }
      var _i = /\{ *([\w_ -]+) *\}/g;
      function vi(t, e) {
        return t.replace(_i, function(i, n) {
          var a = e[n];
          if (a === void 0)
            throw new Error("No value provided for variable " + i);
          return typeof a == "function" && (a = a(e)), a;
        });
      }
      var Bt = Array.isArray || function(t) {
        return Object.prototype.toString.call(t) === "[object Array]";
      };
      function gi(t, e) {
        for (var i = 0; i < t.length; i++)
          if (t[i] === e)
            return i;
        return -1;
      }
      var Ve = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
      function Ue(t) {
        return window["webkit" + t] || window["moz" + t] || window["ms" + t];
      }
      var Gi = 0;
      function yi(t) {
        var e = +/* @__PURE__ */ new Date(), i = Math.max(0, 16 - (e - Gi));
        return Gi = e + i, window.setTimeout(t, i);
      }
      var Fe = window.requestAnimationFrame || Ue("RequestAnimationFrame") || yi, ji = window.cancelAnimationFrame || Ue("CancelAnimationFrame") || Ue("CancelRequestAnimationFrame") || function(t) {
        window.clearTimeout(t);
      };
      function kt(t, e, i) {
        if (i && Fe === yi)
          t.call(e);
        else
          return Fe.call(window, q(t, e));
      }
      function Zt(t) {
        t && ji.call(window, t);
      }
      var qi = {
        __proto__: null,
        extend: J,
        create: st,
        bind: q,
        get lastId() {
          return de;
        },
        stamp: U,
        throttle: Mt,
        wrapNum: ae,
        falseFn: lt,
        formatNum: rt,
        trim: se,
        splitWords: yt,
        setOptions: et,
        getParamString: Wi,
        template: vi,
        isArray: Bt,
        indexOf: gi,
        emptyImageUrl: Ve,
        requestFn: Fe,
        cancelFn: ji,
        requestAnimFrame: kt,
        cancelAnimFrame: Zt
      };
      function Ht() {
      }
      Ht.extend = function(t) {
        var e = function() {
          et(this), this.initialize && this.initialize.apply(this, arguments), this.callInitHooks();
        }, i = e.__super__ = this.prototype, n = st(i);
        n.constructor = e, e.prototype = n;
        for (var a in this)
          Object.prototype.hasOwnProperty.call(this, a) && a !== "prototype" && a !== "__super__" && (e[a] = this[a]);
        return t.statics && J(e, t.statics), t.includes && (pn(t.includes), J.apply(null, [n].concat(t.includes))), J(n, t), delete n.statics, delete n.includes, n.options && (n.options = i.options ? st(i.options) : {}, J(n.options, t.options)), n._initHooks = [], n.callInitHooks = function() {
          if (!this._initHooksCalled) {
            i.callInitHooks && i.callInitHooks.call(this), this._initHooksCalled = !0;
            for (var l = 0, h = n._initHooks.length; l < h; l++)
              n._initHooks[l].call(this);
          }
        }, e;
      }, Ht.include = function(t) {
        var e = this.prototype.options;
        return J(this.prototype, t), t.options && (this.prototype.options = e, this.mergeOptions(t.options)), this;
      }, Ht.mergeOptions = function(t) {
        return J(this.prototype.options, t), this;
      }, Ht.addInitHook = function(t) {
        var e = Array.prototype.slice.call(arguments, 1), i = typeof t == "function" ? t : function() {
          this[t].apply(this, e);
        };
        return this.prototype._initHooks = this.prototype._initHooks || [], this.prototype._initHooks.push(i), this;
      };
      function pn(t) {
        if (!(typeof L > "u" || !L || !L.Mixin)) {
          t = Bt(t) ? t : [t];
          for (var e = 0; e < t.length; e++)
            t[e] === L.Mixin.Events && console.warn("Deprecated include of L.Mixin.Events: this property will be removed in future releases, please inherit from L.Evented instead.", new Error().stack);
        }
      }
      var zt = {
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
            t = yt(t);
            for (var a = 0, l = t.length; a < l; a++)
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
            t = yt(t);
            for (var a = arguments.length === 1, l = 0, h = t.length; l < h; l++)
              a ? this._off(t[l]) : this._off(t[l], e, i);
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
          var n, a, l;
          if (this._events && (n = this._events[t], !!n)) {
            if (arguments.length === 1) {
              if (this._firingCount)
                for (a = 0, l = n.length; a < l; a++)
                  n[a].fn = lt;
              delete this._events[t];
              return;
            }
            if (typeof e != "function") {
              console.warn("wrong listener type: " + typeof e);
              return;
            }
            var h = this._listens(t, e, i);
            if (h !== !1) {
              var f = n[h];
              this._firingCount && (f.fn = lt, this._events[t] = n = n.slice()), n.splice(h, 1);
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
          var n = J({}, e, {
            type: t,
            target: this,
            sourceTarget: e && e.sourceTarget || this
          });
          if (this._events) {
            var a = this._events[t];
            if (a) {
              this._firingCount = this._firingCount + 1 || 1;
              for (var l = 0, h = a.length; l < h; l++) {
                var f = a[l], p = f.fn;
                f.once && this.off(t, p, f.ctx), p.call(f.ctx || this, n);
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
          var l = this._events && this._events[t];
          if (l && l.length && this._listens(t, a, i) !== !1)
            return !0;
          if (n) {
            for (var h in this._eventParents)
              if (this._eventParents[h].listens(t, e, i, n))
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
          for (var a = 0, l = n.length; a < l; a++)
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
            t = yt(t);
            for (var a = 0, l = t.length; a < l; a++)
              this._on(t[a], e, i, !0);
          }
          return this;
        },
        // @method addEventParent(obj: Evented): this
        // Adds an event parent - an `Evented` that will receive propagated events
        addEventParent: function(t) {
          return this._eventParents = this._eventParents || {}, this._eventParents[U(t)] = t, this;
        },
        // @method removeEventParent(obj: Evented): this
        // Removes an event parent, so it will stop receiving propagated events
        removeEventParent: function(t) {
          return this._eventParents && delete this._eventParents[U(t)], this;
        },
        _propagateEvent: function(t) {
          for (var e in this._eventParents)
            this._eventParents[e].fire(t.type, J({
              layer: t.target,
              propagatedFrom: t.target
            }, t), !0);
        }
      };
      zt.addEventListener = zt.on, zt.removeEventListener = zt.clearAllEventListeners = zt.off, zt.addOneTimeEventListener = zt.once, zt.fireEvent = zt.fire, zt.hasEventListeners = zt.listens;
      var ot = Ht.extend(zt);
      function I(t, e, i) {
        this.x = i ? Math.round(t) : t, this.y = i ? Math.round(e) : e;
      }
      var fe = Math.trunc || function(t) {
        return t > 0 ? Math.floor(t) : Math.ceil(t);
      };
      I.prototype = {
        // @method clone(): Point
        // Returns a copy of the current point.
        clone: function() {
          return new I(this.x, this.y);
        },
        // @method add(otherPoint: Point): Point
        // Returns the result of addition of the current and the given points.
        add: function(t) {
          return this.clone()._add(M(t));
        },
        _add: function(t) {
          return this.x += t.x, this.y += t.y, this;
        },
        // @method subtract(otherPoint: Point): Point
        // Returns the result of subtraction of the given point from the current.
        subtract: function(t) {
          return this.clone()._subtract(M(t));
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
          return new I(this.x * t.x, this.y * t.y);
        },
        // @method unscaleBy(scale: Point): Point
        // Inverse of `scaleBy`. Divide each coordinate of the current point by
        // each coordinate of `scale`.
        unscaleBy: function(t) {
          return new I(this.x / t.x, this.y / t.y);
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
          return this.x = fe(this.x), this.y = fe(this.y), this;
        },
        // @method distanceTo(otherPoint: Point): Number
        // Returns the cartesian distance between the current and the given points.
        distanceTo: function(t) {
          t = M(t);
          var e = t.x - this.x, i = t.y - this.y;
          return Math.sqrt(e * e + i * i);
        },
        // @method equals(otherPoint: Point): Boolean
        // Returns `true` if the given point has the same coordinates.
        equals: function(t) {
          return t = M(t), t.x === this.x && t.y === this.y;
        },
        // @method contains(otherPoint: Point): Boolean
        // Returns `true` if both coordinates of the given point are less than the corresponding current point coordinates (in absolute values).
        contains: function(t) {
          return t = M(t), Math.abs(t.x) <= Math.abs(this.x) && Math.abs(t.y) <= Math.abs(this.y);
        },
        // @method toString(): String
        // Returns a string representation of the point for debugging purposes.
        toString: function() {
          return "Point(" + rt(this.x) + ", " + rt(this.y) + ")";
        }
      };
      function M(t, e, i) {
        return t instanceof I ? t : Bt(t) ? new I(t[0], t[1]) : t == null ? t : typeof t == "object" && "x" in t && "y" in t ? new I(t.x, t.y) : new I(t, e, i);
      }
      function it(t, e) {
        if (t)
          for (var i = e ? [t, e] : t, n = 0, a = i.length; n < a; n++)
            this.extend(i[n]);
      }
      it.prototype = {
        // @method extend(point: Point): this
        // Extends the bounds to contain the given point.
        // @alternative
        // @method extend(otherBounds: Bounds): this
        // Extend the bounds to contain the given bounds
        extend: function(t) {
          var e, i;
          if (!t)
            return this;
          if (t instanceof I || typeof t[0] == "number" || "x" in t)
            e = i = M(t);
          else if (t = xt(t), e = t.min, i = t.max, !e || !i)
            return this;
          return !this.min && !this.max ? (this.min = e.clone(), this.max = i.clone()) : (this.min.x = Math.min(e.x, this.min.x), this.max.x = Math.max(i.x, this.max.x), this.min.y = Math.min(e.y, this.min.y), this.max.y = Math.max(i.y, this.max.y)), this;
        },
        // @method getCenter(round?: Boolean): Point
        // Returns the center point of the bounds.
        getCenter: function(t) {
          return M(
            (this.min.x + this.max.x) / 2,
            (this.min.y + this.max.y) / 2,
            t
          );
        },
        // @method getBottomLeft(): Point
        // Returns the bottom-left point of the bounds.
        getBottomLeft: function() {
          return M(this.min.x, this.max.y);
        },
        // @method getTopRight(): Point
        // Returns the top-right point of the bounds.
        getTopRight: function() {
          return M(this.max.x, this.min.y);
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
          return typeof t[0] == "number" || t instanceof I ? t = M(t) : t = xt(t), t instanceof it ? (e = t.min, i = t.max) : e = i = t, e.x >= this.min.x && i.x <= this.max.x && e.y >= this.min.y && i.y <= this.max.y;
        },
        // @method intersects(otherBounds: Bounds): Boolean
        // Returns `true` if the rectangle intersects the given bounds. Two bounds
        // intersect if they have at least one point in common.
        intersects: function(t) {
          t = xt(t);
          var e = this.min, i = this.max, n = t.min, a = t.max, l = a.x >= e.x && n.x <= i.x, h = a.y >= e.y && n.y <= i.y;
          return l && h;
        },
        // @method overlaps(otherBounds: Bounds): Boolean
        // Returns `true` if the rectangle overlaps the given bounds. Two bounds
        // overlap if their intersection is an area.
        overlaps: function(t) {
          t = xt(t);
          var e = this.min, i = this.max, n = t.min, a = t.max, l = a.x > e.x && n.x < i.x, h = a.y > e.y && n.y < i.y;
          return l && h;
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
          return xt(
            M(e.x - n, e.y - a),
            M(i.x + n, i.y + a)
          );
        },
        // @method equals(otherBounds: Bounds): Boolean
        // Returns `true` if the rectangle is equivalent to the given bounds.
        equals: function(t) {
          return t ? (t = xt(t), this.min.equals(t.getTopLeft()) && this.max.equals(t.getBottomRight())) : !1;
        }
      };
      function xt(t, e) {
        return !t || t instanceof it ? t : new it(t, e);
      }
      function Pt(t, e) {
        if (t)
          for (var i = e ? [t, e] : t, n = 0, a = i.length; n < a; n++)
            this.extend(i[n]);
      }
      Pt.prototype = {
        // @method extend(latlng: LatLng): this
        // Extend the bounds to contain the given point
        // @alternative
        // @method extend(otherBounds: LatLngBounds): this
        // Extend the bounds to contain the given bounds
        extend: function(t) {
          var e = this._southWest, i = this._northEast, n, a;
          if (t instanceof B)
            n = t, a = t;
          else if (t instanceof Pt) {
            if (n = t._southWest, a = t._northEast, !n || !a)
              return this;
          } else
            return t ? this.extend(O(t) || nt(t)) : this;
          return !e && !i ? (this._southWest = new B(n.lat, n.lng), this._northEast = new B(a.lat, a.lng)) : (e.lat = Math.min(n.lat, e.lat), e.lng = Math.min(n.lng, e.lng), i.lat = Math.max(a.lat, i.lat), i.lng = Math.max(a.lng, i.lng)), this;
        },
        // @method pad(bufferRatio: Number): LatLngBounds
        // Returns bounds created by extending or retracting the current bounds by a given ratio in each direction.
        // For example, a ratio of 0.5 extends the bounds by 50% in each direction.
        // Negative values will retract the bounds.
        pad: function(t) {
          var e = this._southWest, i = this._northEast, n = Math.abs(e.lat - i.lat) * t, a = Math.abs(e.lng - i.lng) * t;
          return new Pt(
            new B(e.lat - n, e.lng - a),
            new B(i.lat + n, i.lng + a)
          );
        },
        // @method getCenter(): LatLng
        // Returns the center point of the bounds.
        getCenter: function() {
          return new B(
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
          return new B(this.getNorth(), this.getWest());
        },
        // @method getSouthEast(): LatLng
        // Returns the south-east point of the bounds.
        getSouthEast: function() {
          return new B(this.getSouth(), this.getEast());
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
          typeof t[0] == "number" || t instanceof B || "lat" in t ? t = O(t) : t = nt(t);
          var e = this._southWest, i = this._northEast, n, a;
          return t instanceof Pt ? (n = t.getSouthWest(), a = t.getNorthEast()) : n = a = t, n.lat >= e.lat && a.lat <= i.lat && n.lng >= e.lng && a.lng <= i.lng;
        },
        // @method intersects(otherBounds: LatLngBounds): Boolean
        // Returns `true` if the rectangle intersects the given bounds. Two bounds intersect if they have at least one point in common.
        intersects: function(t) {
          t = nt(t);
          var e = this._southWest, i = this._northEast, n = t.getSouthWest(), a = t.getNorthEast(), l = a.lat >= e.lat && n.lat <= i.lat, h = a.lng >= e.lng && n.lng <= i.lng;
          return l && h;
        },
        // @method overlaps(otherBounds: LatLngBounds): Boolean
        // Returns `true` if the rectangle overlaps the given bounds. Two bounds overlap if their intersection is an area.
        overlaps: function(t) {
          t = nt(t);
          var e = this._southWest, i = this._northEast, n = t.getSouthWest(), a = t.getNorthEast(), l = a.lat > e.lat && n.lat < i.lat, h = a.lng > e.lng && n.lng < i.lng;
          return l && h;
        },
        // @method toBBoxString(): String
        // Returns a string with bounding box coordinates in a 'southwest_lng,southwest_lat,northeast_lng,northeast_lat' format. Useful for sending requests to web services that return geo data.
        toBBoxString: function() {
          return [this.getWest(), this.getSouth(), this.getEast(), this.getNorth()].join(",");
        },
        // @method equals(otherBounds: LatLngBounds, maxMargin?: Number): Boolean
        // Returns `true` if the rectangle is equivalent (within a small margin of error) to the given bounds. The margin of error can be overridden by setting `maxMargin` to a small number.
        equals: function(t, e) {
          return t ? (t = nt(t), this._southWest.equals(t.getSouthWest(), e) && this._northEast.equals(t.getNorthEast(), e)) : !1;
        },
        // @method isValid(): Boolean
        // Returns `true` if the bounds are properly initialized.
        isValid: function() {
          return !!(this._southWest && this._northEast);
        }
      };
      function nt(t, e) {
        return t instanceof Pt ? t : new Pt(t, e);
      }
      function B(t, e, i) {
        if (isNaN(t) || isNaN(e))
          throw new Error("Invalid LatLng object: (" + t + ", " + e + ")");
        this.lat = +t, this.lng = +e, i !== void 0 && (this.alt = +i);
      }
      B.prototype = {
        // @method equals(otherLatLng: LatLng, maxMargin?: Number): Boolean
        // Returns `true` if the given `LatLng` point is at the same position (within a small margin of error). The margin of error can be overridden by setting `maxMargin` to a small number.
        equals: function(t, e) {
          if (!t)
            return !1;
          t = O(t);
          var i = Math.max(
            Math.abs(this.lat - t.lat),
            Math.abs(this.lng - t.lng)
          );
          return i <= (e === void 0 ? 1e-9 : e);
        },
        // @method toString(): String
        // Returns a string representation of the point (for debugging purposes).
        toString: function(t) {
          return "LatLng(" + rt(this.lat, t) + ", " + rt(this.lng, t) + ")";
        },
        // @method distanceTo(otherLatLng: LatLng): Number
        // Returns the distance (in meters) to the given `LatLng` calculated using the [Spherical Law of Cosines](https://en.wikipedia.org/wiki/Spherical_law_of_cosines).
        distanceTo: function(t) {
          return Kt.distance(this, O(t));
        },
        // @method wrap(): LatLng
        // Returns a new `LatLng` object with the longitude wrapped so it's always between -180 and +180 degrees.
        wrap: function() {
          return Kt.wrapLatLng(this);
        },
        // @method toBounds(sizeInMeters: Number): LatLngBounds
        // Returns a new `LatLngBounds` object in which each boundary is `sizeInMeters/2` meters apart from the `LatLng`.
        toBounds: function(t) {
          var e = 180 * t / 40075017, i = e / Math.cos(Math.PI / 180 * this.lat);
          return nt(
            [this.lat - e, this.lng - i],
            [this.lat + e, this.lng + i]
          );
        },
        clone: function() {
          return new B(this.lat, this.lng, this.alt);
        }
      };
      function O(t, e, i) {
        return t instanceof B ? t : Bt(t) && typeof t[0] != "object" ? t.length === 3 ? new B(t[0], t[1], t[2]) : t.length === 2 ? new B(t[0], t[1]) : null : t == null ? t : typeof t == "object" && "lat" in t ? new B(t.lat, "lng" in t ? t.lng : t.lon, t.alt) : e === void 0 ? null : new B(t, e, i);
      }
      var C = {
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
          return new it(n, a);
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
          var e = this.wrapLng ? ae(t.lng, this.wrapLng, !0) : t.lng, i = this.wrapLat ? ae(t.lat, this.wrapLat, !0) : t.lat, n = t.alt;
          return new B(i, e, n);
        },
        // @method wrapLatLngBounds(bounds: LatLngBounds): LatLngBounds
        // Returns a `LatLngBounds` with the same size as the given one, ensuring
        // that its center is within the CRS's bounds.
        // Only accepts actual `L.LatLngBounds` instances, not arrays.
        wrapLatLngBounds: function(t) {
          var e = t.getCenter(), i = this.wrapLatLng(e), n = e.lat - i.lat, a = e.lng - i.lng;
          if (n === 0 && a === 0)
            return t;
          var l = t.getSouthWest(), h = t.getNorthEast(), f = new B(l.lat - n, l.lng - a), p = new B(h.lat - n, h.lng - a);
          return new Pt(f, p);
        }
      }, Kt = J({}, C, {
        wrapLng: [-180, 180],
        // Mean Earth Radius, as recommended for use by
        // the International Union of Geodesy and Geophysics,
        // see https://rosettacode.org/wiki/Haversine_formula
        R: 6371e3,
        // distance between two geographical points using spherical law of cosines approximation
        distance: function(t, e) {
          var i = Math.PI / 180, n = t.lat * i, a = e.lat * i, l = Math.sin((e.lat - t.lat) * i / 2), h = Math.sin((e.lng - t.lng) * i / 2), f = l * l + Math.cos(n) * Math.cos(a) * h * h, p = 2 * Math.atan2(Math.sqrt(f), Math.sqrt(1 - f));
          return this.R * p;
        }
      }), Ki = 6378137, He = {
        R: Ki,
        MAX_LATITUDE: 85.0511287798,
        project: function(t) {
          var e = Math.PI / 180, i = this.MAX_LATITUDE, n = Math.max(Math.min(i, t.lat), -i), a = Math.sin(n * e);
          return new I(
            this.R * t.lng * e,
            this.R * Math.log((1 + a) / (1 - a)) / 2
          );
        },
        unproject: function(t) {
          var e = 180 / Math.PI;
          return new B(
            (2 * Math.atan(Math.exp(t.y / this.R)) - Math.PI / 2) * e,
            t.x * e / this.R
          );
        },
        bounds: (function() {
          var t = Ki * Math.PI;
          return new it([-t, -t], [t, t]);
        })()
      };
      function We(t, e, i, n) {
        if (Bt(t)) {
          this._a = t[0], this._b = t[1], this._c = t[2], this._d = t[3];
          return;
        }
        this._a = t, this._b = e, this._c = i, this._d = n;
      }
      We.prototype = {
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
          return e = e || 1, new I(
            (t.x / e - this._b) / this._a,
            (t.y / e - this._d) / this._c
          );
        }
      };
      function pe(t, e, i, n) {
        return new We(t, e, i, n);
      }
      var bi = J({}, Kt, {
        code: "EPSG:3857",
        projection: He,
        transformation: (function() {
          var t = 0.5 / (Math.PI * He.R);
          return pe(t, 0.5, -t, 0.5);
        })()
      }), $t = J({}, bi, {
        code: "EPSG:900913"
      });
      function $i(t) {
        return document.createElementNS("http://www.w3.org/2000/svg", t);
      }
      function ut(t, e) {
        var i = "", n, a, l, h, f, p;
        for (n = 0, l = t.length; n < l; n++) {
          for (f = t[n], a = 0, h = f.length; a < h; a++)
            p = f[a], i += (a ? "L" : "M") + p.x + " " + p.y;
          i += e ? T.svg ? "z" : "x" : "";
        }
        return i || "M0 0";
      }
      var Nt = document.documentElement.style, me = "ActiveXObject" in window, wi = me && !document.addEventListener, Yi = "msLaunchUri" in navigator && !("documentMode" in document), Ge = Rt("webkit"), xi = Rt("android"), Pi = Rt("android 2") || Rt("android 3"), mn = parseInt(/WebKit\/([0-9]+)|$/.exec(navigator.userAgent)[1], 10), _n = xi && Rt("Google") && mn < 537 && !("AudioNode" in window), je = !!window.opera, Li = !Yi && Rt("chrome"), Ji = Rt("gecko") && !Ge && !je && !me, vn = !Li && Rt("safari"), R = Rt("phantom"), Ce = "OTransition" in Nt, Ti = navigator.platform.indexOf("Win") === 0, ki = me && "transition" in Nt, qe = "WebKitCSSMatrix" in window && "m11" in new window.WebKitCSSMatrix() && !Pi, Ke = "MozPerspective" in Nt, g = !window.L_DISABLE_3D && (ki || qe || Ke) && !Ce && !R, Yt = typeof orientation < "u" || Rt("mobile"), gn = Yt && Ge, $e = Yt && qe, Me = !window.PointerEvent && window.MSPointerEvent, ze = !!(window.PointerEvent || Me), Oe = "ontouchstart" in window || !!window.TouchEvent, Ye = !window.L_NO_TOUCH && (Oe || ze), Je = Yt && je, Xe = Yt && Ji, Qe = (window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI) > 1, Dt = (function() {
        var t = !1;
        try {
          var e = Object.defineProperty({}, "passive", {
            get: function() {
              t = !0;
            }
          });
          window.addEventListener("testPassiveEventSupport", lt, e), window.removeEventListener("testPassiveEventSupport", lt, e);
        } catch {
        }
        return t;
      })(), ti = (function() {
        return !!document.createElement("canvas").getContext;
      })(), Si = !!(document.createElementNS && $i("svg").createSVGRect), Wt = !!Si && (function() {
        var t = document.createElement("div");
        return t.innerHTML = "<svg/>", (t.firstChild && t.firstChild.namespaceURI) === "http://www.w3.org/2000/svg";
      })(), W = !Si && (function() {
        try {
          var t = document.createElement("div");
          t.innerHTML = '<v:shape adj="1"/>';
          var e = t.firstChild;
          return e.style.behavior = "url(#default#VML)", e && typeof e.adj == "object";
        } catch {
          return !1;
        }
      })(), yn = navigator.platform.indexOf("Mac") === 0, bn = navigator.platform.indexOf("Linux") === 0;
      function Rt(t) {
        return navigator.userAgent.toLowerCase().indexOf(t) >= 0;
      }
      var T = {
        ie: me,
        ielt9: wi,
        edge: Yi,
        webkit: Ge,
        android: xi,
        android23: Pi,
        androidStock: _n,
        opera: je,
        chrome: Li,
        gecko: Ji,
        safari: vn,
        phantom: R,
        opera12: Ce,
        win: Ti,
        ie3d: ki,
        webkit3d: qe,
        gecko3d: Ke,
        any3d: g,
        mobile: Yt,
        mobileWebkit: gn,
        mobileWebkit3d: $e,
        msPointer: Me,
        pointer: ze,
        touch: Ye,
        touchNative: Oe,
        mobileOpera: Je,
        mobileGecko: Xe,
        retina: Qe,
        passiveEvents: Dt,
        canvas: ti,
        svg: Si,
        vml: W,
        inlineSvg: Wt,
        mac: yn,
        linux: bn
      }, Xi = T.msPointer ? "MSPointerDown" : "pointerdown", Lt = T.msPointer ? "MSPointerMove" : "pointermove", Ee = T.msPointer ? "MSPointerUp" : "pointerup", _e = T.msPointer ? "MSPointerCancel" : "pointercancel", Q = {
        touchstart: Xi,
        touchmove: Lt,
        touchend: Ee,
        touchcancel: _e
      }, E = {
        touchstart: wn,
        touchmove: ii,
        touchend: ii,
        touchcancel: ii
      }, Jt = {}, Ci = !1;
      function Qi(t, e, i) {
        return e === "touchstart" && Xt(), E[e] ? (i = E[e].bind(this, i), t.addEventListener(Q[e], i, !1), i) : (console.warn("wrong event specified:", e), lt);
      }
      function Ae(t, e, i) {
        if (!Q[e]) {
          console.warn("wrong event specified:", e);
          return;
        }
        t.removeEventListener(Q[e], i, !1);
      }
      function ve(t) {
        Jt[t.pointerId] = t;
      }
      function ge(t) {
        Jt[t.pointerId] && (Jt[t.pointerId] = t);
      }
      function ei(t) {
        delete Jt[t.pointerId];
      }
      function Xt() {
        Ci || (document.addEventListener(Xi, ve, !0), document.addEventListener(Lt, ge, !0), document.addEventListener(Ee, ei, !0), document.addEventListener(_e, ei, !0), Ci = !0);
      }
      function ii(t, e) {
        if (e.pointerType !== (e.MSPOINTER_TYPE_MOUSE || "mouse")) {
          e.touches = [];
          for (var i in Jt)
            e.touches.push(Jt[i]);
          e.changedTouches = [e], t(e);
        }
      }
      function wn(t, e) {
        e.MSPOINTER_TYPE_TOUCH && e.pointerType === e.MSPOINTER_TYPE_TOUCH && m(e), ii(t, e);
      }
      function ni(t) {
        var e = {}, i, n;
        for (n in t)
          i = t[n], e[n] = i && i.bind ? i.bind(t) : i;
        return t = e, e.type = "dblclick", e.detail = 2, e.isTrusted = !1, e._simulated = !0, e;
      }
      var St = 200;
      function Vt(t, e) {
        t.addEventListener("dblclick", e);
        var i = 0, n;
        function a(l) {
          if (l.detail !== 1) {
            n = l.detail;
            return;
          }
          if (!(l.pointerType === "mouse" || l.sourceCapabilities && !l.sourceCapabilities.firesTouchEvents)) {
            var h = tt(l);
            if (!(h.some(function(p) {
              return p instanceof HTMLLabelElement && p.attributes.for;
            }) && !h.some(function(p) {
              return p instanceof HTMLInputElement || p instanceof HTMLSelectElement;
            }))) {
              var f = Date.now();
              f - i <= St ? (n++, n === 2 && e(ni(l))) : n = 1, i = f;
            }
          }
        }
        return t.addEventListener("click", a), {
          dblclick: e,
          simDblclick: a
        };
      }
      function xn(t, e) {
        t.removeEventListener("dblclick", e.dblclick), t.removeEventListener("click", e.simDblclick);
      }
      var Mi = j(
        ["transform", "webkitTransform", "OTransform", "MozTransform", "msTransform"]
      ), ye = j(
        ["webkitTransition", "transition", "OTransition", "MozTransition", "msTransition"]
      ), tn = ye === "webkitTransition" || ye === "OTransition" ? ye + "End" : "transitionend";
      function oi(t) {
        return typeof t == "string" ? document.getElementById(t) : t;
      }
      function Ze(t, e) {
        var i = t.style[e] || t.currentStyle && t.currentStyle[e];
        if ((!i || i === "auto") && document.defaultView) {
          var n = document.defaultView.getComputedStyle(t, null);
          i = n ? n[e] : null;
        }
        return i === "auto" ? null : i;
      }
      function V(t, e, i) {
        var n = document.createElement(t);
        return n.className = e || "", i && i.appendChild(n), n;
      }
      function X(t) {
        var e = t.parentNode;
        e && e.removeChild(t);
      }
      function ai(t) {
        for (; t.firstChild; )
          t.removeChild(t.firstChild);
      }
      function be(t) {
        var e = t.parentNode;
        e && e.lastChild !== t && e.appendChild(t);
      }
      function we(t) {
        var e = t.parentNode;
        e && e.firstChild !== t && e.insertBefore(t, e.firstChild);
      }
      function zi(t, e) {
        if (t.classList !== void 0)
          return t.classList.contains(e);
        var i = re(t);
        return i.length > 0 && new RegExp("(^|\\s)" + e + "(\\s|$)").test(i);
      }
      function N(t, e) {
        if (t.classList !== void 0)
          for (var i = yt(e), n = 0, a = i.length; n < a; n++)
            t.classList.add(i[n]);
        else if (!zi(t, e)) {
          var l = re(t);
          Oi(t, (l ? l + " " : "") + e);
        }
      }
      function ct(t, e) {
        t.classList !== void 0 ? t.classList.remove(e) : Oi(t, se((" " + re(t) + " ").replace(" " + e + " ", " ")));
      }
      function Oi(t, e) {
        t.className.baseVal === void 0 ? t.className = e : t.className.baseVal = e;
      }
      function re(t) {
        return t.correspondingElement && (t = t.correspondingElement), t.className.baseVal === void 0 ? t.className : t.className.baseVal;
      }
      function Tt(t, e) {
        "opacity" in t.style ? t.style.opacity = e : "filter" in t.style && Pn(t, e);
      }
      function Pn(t, e) {
        var i = !1, n = "DXImageTransform.Microsoft.Alpha";
        try {
          i = t.filters.item(n);
        } catch {
          if (e === 1)
            return;
        }
        e = Math.round(e * 100), i ? (i.Enabled = e !== 100, i.Opacity = e) : t.style.filter += " progid:" + n + "(opacity=" + e + ")";
      }
      function j(t) {
        for (var e = document.documentElement.style, i = 0; i < t.length; i++)
          if (t[i] in e)
            return t[i];
        return !1;
      }
      function Gt(t, e, i) {
        var n = e || new I(0, 0);
        t.style[Mi] = (T.ie3d ? "translate(" + n.x + "px," + n.y + "px)" : "translate3d(" + n.x + "px," + n.y + "px,0)") + (i ? " scale(" + i + ")" : "");
      }
      function ht(t, e) {
        t._leaflet_pos = e, T.any3d ? Gt(t, e) : (t.style.left = e.x + "px", t.style.top = e.y + "px");
      }
      function Qt(t) {
        return t._leaflet_pos || new I(0, 0);
      }
      var _, te, Ei;
      if ("onselectstart" in document)
        _ = function() {
          r(window, "selectstart", m);
        }, te = function() {
          x(window, "selectstart", m);
        };
      else {
        var Ie = j(
          ["userSelect", "WebkitUserSelect", "OUserSelect", "MozUserSelect", "msUserSelect"]
        );
        _ = function() {
          if (Ie) {
            var t = document.documentElement.style;
            Ei = t[Ie], t[Ie] = "none";
          }
        }, te = function() {
          Ie && (document.documentElement.style[Ie] = Ei, Ei = void 0);
        };
      }
      function si() {
        r(window, "dragstart", m);
      }
      function Ai() {
        x(window, "dragstart", m);
      }
      var ri, Zi;
      function Be(t) {
        for (; t.tabIndex === -1; )
          t = t.parentNode;
        t.style && (xe(), ri = t, Zi = t.style.outlineStyle, t.style.outlineStyle = "none", r(window, "keydown", xe));
      }
      function xe() {
        ri && (ri.style.outlineStyle = Zi, ri = void 0, Zi = void 0, x(window, "keydown", xe));
      }
      function Ii(t) {
        do
          t = t.parentNode;
        while ((!t.offsetWidth || !t.offsetHeight) && t !== document.body);
        return t;
      }
      function li(t) {
        var e = t.getBoundingClientRect();
        return {
          x: e.width / t.offsetWidth || 1,
          y: e.height / t.offsetHeight || 1,
          boundingClientRect: e
        };
      }
      var d = {
        __proto__: null,
        TRANSFORM: Mi,
        TRANSITION: ye,
        TRANSITION_END: tn,
        get: oi,
        getStyle: Ze,
        create: V,
        remove: X,
        empty: ai,
        toFront: be,
        toBack: we,
        hasClass: zi,
        addClass: N,
        removeClass: ct,
        setClass: Oi,
        getClass: re,
        setOpacity: Tt,
        testProp: j,
        setTransform: Gt,
        setPosition: ht,
        getPosition: Qt,
        get disableTextSelection() {
          return _;
        },
        get enableTextSelection() {
          return te;
        },
        disableImageDrag: si,
        enableImageDrag: Ai,
        preventOutline: Be,
        restoreOutline: xe,
        getSizedParentNode: Ii,
        getScale: li
      };
      function r(t, e, i, n) {
        if (e && typeof e == "object")
          for (var a in e)
            Y(t, a, e[a], i);
        else {
          e = yt(e);
          for (var l = 0, h = e.length; l < h; l++)
            Y(t, e[l], i, n);
        }
        return this;
      }
      var c = "_leaflet_events";
      function x(t, e, i, n) {
        if (arguments.length === 1)
          k(t), delete t[c];
        else if (e && typeof e == "object")
          for (var a in e)
            bt(t, a, e[a], i);
        else if (e = yt(e), arguments.length === 2)
          k(t, function(f) {
            return gi(e, f) !== -1;
          });
        else
          for (var l = 0, h = e.length; l < h; l++)
            bt(t, e[l], i, n);
        return this;
      }
      function k(t, e) {
        for (var i in t[c]) {
          var n = i.split(/\d/)[0];
          (!e || e(n)) && bt(t, n, null, null, i);
        }
      }
      var G = {
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        wheel: !("onwheel" in window) && "mousewheel"
      };
      function Y(t, e, i, n) {
        var a = e + U(i) + (n ? "_" + U(n) : "");
        if (t[c] && t[c][a])
          return this;
        var l = function(f) {
          return i.call(n || t, f || window.event);
        }, h = l;
        !T.touchNative && T.pointer && e.indexOf("touch") === 0 ? l = Qi(t, e, l) : T.touch && e === "dblclick" ? l = Vt(t, l) : "addEventListener" in t ? e === "touchstart" || e === "touchmove" || e === "wheel" || e === "mousewheel" ? t.addEventListener(G[e] || e, l, T.passiveEvents ? { passive: !1 } : !1) : e === "mouseenter" || e === "mouseleave" ? (l = function(f) {
          f = f || window.event, Ln(t, f) && h(f);
        }, t.addEventListener(G[e], l, !1)) : t.addEventListener(e, h, !1) : t.attachEvent("on" + e, l), t[c] = t[c] || {}, t[c][a] = l;
      }
      function bt(t, e, i, n, a) {
        a = a || e + U(i) + (n ? "_" + U(n) : "");
        var l = t[c] && t[c][a];
        if (!l)
          return this;
        !T.touchNative && T.pointer && e.indexOf("touch") === 0 ? Ae(t, e, l) : T.touch && e === "dblclick" ? xn(t, l) : "removeEventListener" in t ? t.removeEventListener(G[e] || e, l, !1) : t.detachEvent("on" + e, l), t[c][a] = null;
      }
      function ee(t) {
        return t.stopPropagation ? t.stopPropagation() : t.originalEvent ? t.originalEvent._stopped = !0 : t.cancelBubble = !0, this;
      }
      function ui(t) {
        return Y(t, "wheel", ee), this;
      }
      function Pe(t) {
        return r(t, "mousedown touchstart dblclick contextmenu", ee), t._leaflet_disable_click = !0, this;
      }
      function m(t) {
        return t.preventDefault ? t.preventDefault() : t.returnValue = !1, this;
      }
      function F(t) {
        return m(t), ee(t), this;
      }
      function tt(t) {
        if (t.composedPath)
          return t.composedPath();
        for (var e = [], i = t.target; i; )
          e.push(i), i = i.parentNode;
        return e;
      }
      function mt(t, e) {
        if (!e)
          return new I(t.clientX, t.clientY);
        var i = li(e), n = i.boundingClientRect;
        return new I(
          // offset.left/top values are in page scale (like clientX/Y),
          // whereas clientLeft/Top (border width) values are the original values (before CSS scale applies).
          (t.clientX - n.left) / i.x - e.clientLeft,
          (t.clientY - n.top) / i.y - e.clientTop
        );
      }
      var _t = T.linux && T.chrome ? window.devicePixelRatio : T.mac ? window.devicePixelRatio * 3 : window.devicePixelRatio > 0 ? 2 * window.devicePixelRatio : 1;
      function dt(t) {
        return T.edge ? t.wheelDeltaY / 2 : (
          // Don't trust window-geometry-based delta
          t.deltaY && t.deltaMode === 0 ? -t.deltaY / _t : (
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
      function Ln(t, e) {
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
      var ko = {
        __proto__: null,
        on: r,
        off: x,
        stopPropagation: ee,
        disableScrollPropagation: ui,
        disableClickPropagation: Pe,
        preventDefault: m,
        stop: F,
        getPropagationPath: tt,
        getMousePosition: mt,
        getWheelDelta: dt,
        isExternalTarget: Ln,
        addListener: r,
        removeListener: x
      }, Dn = ot.extend({
        // @method run(el: HTMLElement, newPos: Point, duration?: Number, easeLinearity?: Number)
        // Run an animation of a given element to a new position, optionally setting
        // duration in seconds (`0.25` by default) and easing linearity factor (3rd
        // argument of the [cubic bezier curve](https://cubic-bezier.com/#0,0,.5,1),
        // `0.5` by default).
        run: function(t, e, i, n) {
          this.stop(), this._el = t, this._inProgress = !0, this._duration = i || 0.25, this._easeOutPower = 1 / Math.max(n || 0.5, 0.2), this._startPos = Qt(t), this._offset = e.subtract(this._startPos), this._startTime = +/* @__PURE__ */ new Date(), this.fire("start"), this._animate();
        },
        // @method stop()
        // Stops the animation (if currently running).
        stop: function() {
          this._inProgress && (this._step(!0), this._complete());
        },
        _animate: function() {
          this._animId = kt(this._animate, this), this._step();
        },
        _step: function(t) {
          var e = +/* @__PURE__ */ new Date() - this._startTime, i = this._duration * 1e3;
          e < i ? this._runFrame(this._easeOut(e / i), t) : (this._runFrame(1), this._complete());
        },
        _runFrame: function(t, e) {
          var i = this._startPos.add(this._offset.multiplyBy(t));
          e && i._round(), ht(this._el, i), this.fire("step");
        },
        _complete: function() {
          Zt(this._animId), this._inProgress = !1, this.fire("end");
        },
        _easeOut: function(t) {
          return 1 - Math.pow(1 - t, this._easeOutPower);
        }
      }), K = ot.extend({
        options: {
          // @section Map State Options
          // @option crs: CRS = L.CRS.EPSG3857
          // The [Coordinate Reference System](#crs) to use. Don't change this if you're not
          // sure what it means.
          crs: bi,
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
          e = et(this, e), this._handlers = [], this._layers = {}, this._zoomBoundLayers = {}, this._sizeChanged = !0, this._initContainer(t), this._initLayout(), this._onResize = q(this._onResize, this), this._initEvents(), e.maxBounds && this.setMaxBounds(e.maxBounds), e.zoom !== void 0 && (this._zoom = this._limitZoom(e.zoom)), e.center && e.zoom !== void 0 && this.setView(O(e.center), e.zoom, { reset: !0 }), this.callInitHooks(), this._zoomAnimated = ye && T.any3d && !T.mobileOpera && this.options.zoomAnimation, this._zoomAnimated && (this._createAnimProxy(), r(this._proxy, tn, this._catchTransitionEnd, this)), this._addLayers(this.options.layers);
        },
        // @section Methods for modifying map state
        // @method setView(center: LatLng, zoom: Number, options?: Zoom/pan options): this
        // Sets the view of the map (geographical center and zoom) with the given
        // animation options.
        setView: function(t, e, i) {
          if (e = e === void 0 ? this._zoom : this._limitZoom(e), t = this._limitCenter(O(t), e, this.options.maxBounds), i = i || {}, this._stop(), this._loaded && !i.reset && i !== !0) {
            i.animate !== void 0 && (i.zoom = J({ animate: i.animate }, i.zoom), i.pan = J({ animate: i.animate, duration: i.duration }, i.pan));
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
          return t = t || (T.any3d ? this.options.zoomDelta : 1), this.setZoom(this._zoom + t, e);
        },
        // @method zoomOut(delta?: Number, options?: Zoom options): this
        // Decreases the zoom of the map by `delta` ([`zoomDelta`](#map-zoomdelta) by default).
        zoomOut: function(t, e) {
          return t = t || (T.any3d ? this.options.zoomDelta : 1), this.setZoom(this._zoom - t, e);
        },
        // @method setZoomAround(latlng: LatLng, zoom: Number, options: Zoom options): this
        // Zooms the map while keeping a specified geographical point on the map
        // stationary (e.g. used internally for scroll zoom and double-click zoom).
        // @alternative
        // @method setZoomAround(offset: Point, zoom: Number, options: Zoom options): this
        // Zooms the map while keeping a specified pixel on the map (relative to the top-left corner) stationary.
        setZoomAround: function(t, e, i) {
          var n = this.getZoomScale(e), a = this.getSize().divideBy(2), l = t instanceof I ? t : this.latLngToContainerPoint(t), h = l.subtract(a).multiplyBy(1 - 1 / n), f = this.containerPointToLatLng(a.add(h));
          return this.setView(f, e, { zoom: i });
        },
        _getBoundsCenterZoom: function(t, e) {
          e = e || {}, t = t.getBounds ? t.getBounds() : nt(t);
          var i = M(e.paddingTopLeft || e.padding || [0, 0]), n = M(e.paddingBottomRight || e.padding || [0, 0]), a = this.getBoundsZoom(t, !1, i.add(n));
          if (a = typeof e.maxZoom == "number" ? Math.min(e.maxZoom, a) : a, a === 1 / 0)
            return {
              center: t.getCenter(),
              zoom: a
            };
          var l = n.subtract(i).divideBy(2), h = this.project(t.getSouthWest(), a), f = this.project(t.getNorthEast(), a), p = this.unproject(h.add(f).divideBy(2).add(l), a);
          return {
            center: p,
            zoom: a
          };
        },
        // @method fitBounds(bounds: LatLngBounds, options?: fitBounds options): this
        // Sets a map view that contains the given geographical bounds with the
        // maximum zoom level possible.
        fitBounds: function(t, e) {
          if (t = nt(t), !t.isValid())
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
          if (t = M(t).round(), e = e || {}, !t.x && !t.y)
            return this.fire("moveend");
          if (e.animate !== !0 && !this.getSize().contains(t))
            return this._resetView(this.unproject(this.project(this.getCenter()).add(t)), this.getZoom()), this;
          if (this._panAnim || (this._panAnim = new Dn(), this._panAnim.on({
            step: this._onPanTransitionStep,
            end: this._onPanTransitionEnd
          }, this)), e.noMoveStart || this.fire("movestart"), e.animate !== !1) {
            N(this._mapPane, "leaflet-pan-anim");
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
          if (i = i || {}, i.animate === !1 || !T.any3d)
            return this.setView(t, e, i);
          this._stop();
          var n = this.project(this.getCenter()), a = this.project(t), l = this.getSize(), h = this._zoom;
          t = O(t), e = e === void 0 ? h : e;
          var f = Math.max(l.x, l.y), p = f * this.getZoomScale(h, e), v = a.distanceTo(n) || 1, P = 1.42, A = P * P;
          function H(gt) {
            var fn = gt ? -1 : 1, pa = gt ? p : f, ma = p * p - f * f + fn * A * A * v * v, _a = 2 * pa * A * v, In = ma / _a, yo = Math.sqrt(In * In + 1) - In, va = yo < 1e-9 ? -18 : Math.log(yo);
            return va;
          }
          function Ot(gt) {
            return (Math.exp(gt) - Math.exp(-gt)) / 2;
          }
          function wt(gt) {
            return (Math.exp(gt) + Math.exp(-gt)) / 2;
          }
          function Ft(gt) {
            return Ot(gt) / wt(gt);
          }
          var It = H(0);
          function mi(gt) {
            return f * (wt(It) / wt(It + P * gt));
          }
          function ca(gt) {
            return f * (wt(It) * Ft(It + P * gt) - Ot(It)) / A;
          }
          function ha(gt) {
            return 1 - Math.pow(1 - gt, 1.5);
          }
          var da = Date.now(), vo = (H(1) - It) / P, fa = i.duration ? 1e3 * i.duration : 1e3 * vo * 0.8;
          function go() {
            var gt = (Date.now() - da) / fa, fn = ha(gt) * vo;
            gt <= 1 ? (this._flyToFrame = kt(go, this), this._move(
              this.unproject(n.add(a.subtract(n).multiplyBy(ca(fn) / v)), h),
              this.getScaleZoom(f / mi(fn), h),
              { flyTo: !0 }
            )) : this._move(t, e)._moveEnd(!0);
          }
          return this._moveStart(!0, i.noMoveStart), go.call(this), this;
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
          return t = nt(t), this.listens("moveend", this._panInsideMaxBounds) && this.off("moveend", this._panInsideMaxBounds), t.isValid() ? (this.options.maxBounds = t, this._loaded && this._panInsideMaxBounds(), this.on("moveend", this._panInsideMaxBounds)) : (this.options.maxBounds = null, this);
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
          var i = this.getCenter(), n = this._limitCenter(i, this._zoom, nt(t));
          return i.equals(n) || this.panTo(n, e), this._enforcingBounds = !1, this;
        },
        // @method panInside(latlng: LatLng, options?: padding options): this
        // Pans the map the minimum amount to make the `latlng` visible. Use
        // padding options to fit the display to more restricted bounds.
        // If `latlng` is already within the (optionally padded) display bounds,
        // the map will not be panned.
        panInside: function(t, e) {
          e = e || {};
          var i = M(e.paddingTopLeft || e.padding || [0, 0]), n = M(e.paddingBottomRight || e.padding || [0, 0]), a = this.project(this.getCenter()), l = this.project(t), h = this.getPixelBounds(), f = xt([h.min.add(i), h.max.subtract(n)]), p = f.getSize();
          if (!f.contains(l)) {
            this._enforcingBounds = !0;
            var v = l.subtract(f.getCenter()), P = f.extend(l).getSize().subtract(p);
            a.x += v.x < 0 ? -P.x : P.x, a.y += v.y < 0 ? -P.y : P.y, this.panTo(this.unproject(a), e), this._enforcingBounds = !1;
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
          t = J({
            animate: !1,
            pan: !0
          }, t === !0 ? { animate: !0 } : t);
          var e = this.getSize();
          this._sizeChanged = !0, this._lastCenter = null;
          var i = this.getSize(), n = e.divideBy(2).round(), a = i.divideBy(2).round(), l = n.subtract(a);
          return !l.x && !l.y ? this : (t.animate && t.pan ? this.panBy(l) : (t.pan && this._rawPanBy(l), this.fire("move"), t.debounceMoveend ? (clearTimeout(this._sizeTimer), this._sizeTimer = setTimeout(q(this.fire, this, "moveend"), 200)) : this.fire("moveend")), this.fire("resize", {
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
          if (t = this._locateOptions = J({
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
          var e = q(this._handleGeolocationResponse, this), i = q(this._handleGeolocationError, this);
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
            var e = t.coords.latitude, i = t.coords.longitude, n = new B(e, i), a = n.toBounds(t.coords.accuracy * 2), l = this._locateOptions;
            if (l.setView) {
              var h = this.getBoundsZoom(a);
              this.setView(n, l.maxZoom ? Math.min(h, l.maxZoom) : h);
            }
            var f = {
              latlng: n,
              bounds: a,
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
          this._locationWatchId !== void 0 && this.stopLocate(), this._stop(), X(this._mapPane), this._clearControlPos && this._clearControlPos(), this._resizeRequest && (Zt(this._resizeRequest), this._resizeRequest = null), this._clearHandlers(), this._loaded && this.fire("unload");
          var t;
          for (t in this._layers)
            this._layers[t].remove();
          for (t in this._panes)
            X(this._panes[t]);
          return this._layers = [], this._panes = [], delete this._mapPane, delete this._renderer, this;
        },
        // @section Other Methods
        // @method createPane(name: String, container?: HTMLElement): HTMLElement
        // Creates a new [map pane](#map-pane) with the given name if it doesn't exist already,
        // then returns it. The pane is created as a child of `container`, or
        // as a child of the main map pane if not set.
        createPane: function(t, e) {
          var i = "leaflet-pane" + (t ? " leaflet-" + t.replace("Pane", "") + "-pane" : ""), n = V("div", i, e || this._mapPane);
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
          return new Pt(e, i);
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
          t = nt(t), i = M(i || [0, 0]);
          var n = this.getZoom() || 0, a = this.getMinZoom(), l = this.getMaxZoom(), h = t.getNorthWest(), f = t.getSouthEast(), p = this.getSize().subtract(i), v = xt(this.project(f, n), this.project(h, n)).getSize(), P = T.any3d ? this.options.zoomSnap : 1, A = p.x / v.x, H = p.y / v.y, Ot = e ? Math.max(A, H) : Math.min(A, H);
          return n = this.getScaleZoom(Ot, n), P && (n = Math.round(n / (P / 100)) * (P / 100), n = e ? Math.ceil(n / P) * P : Math.floor(n / P) * P), Math.max(a, Math.min(l, n));
        },
        // @method getSize(): Point
        // Returns the current size of the map container (in pixels).
        getSize: function() {
          return (!this._size || this._sizeChanged) && (this._size = new I(
            this._container.clientWidth || 0,
            this._container.clientHeight || 0
          ), this._sizeChanged = !1), this._size.clone();
        },
        // @method getPixelBounds(): Bounds
        // Returns the bounds of the current map view in projected pixel
        // coordinates (sometimes useful in layer and overlay implementations).
        getPixelBounds: function(t, e) {
          var i = this._getTopLeftPoint(t, e);
          return new it(i, i.add(this.getSize()));
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
          return e = e === void 0 ? this._zoom : e, this.options.crs.latLngToPoint(O(t), e);
        },
        // @method unproject(point: Point, zoom: Number): LatLng
        // Inverse of [`project`](#map-project).
        unproject: function(t, e) {
          return e = e === void 0 ? this._zoom : e, this.options.crs.pointToLatLng(M(t), e);
        },
        // @method layerPointToLatLng(point: Point): LatLng
        // Given a pixel coordinate relative to the [origin pixel](#map-getpixelorigin),
        // returns the corresponding geographical coordinate (for the current zoom level).
        layerPointToLatLng: function(t) {
          var e = M(t).add(this.getPixelOrigin());
          return this.unproject(e);
        },
        // @method latLngToLayerPoint(latlng: LatLng): Point
        // Given a geographical coordinate, returns the corresponding pixel coordinate
        // relative to the [origin pixel](#map-getpixelorigin).
        latLngToLayerPoint: function(t) {
          var e = this.project(O(t))._round();
          return e._subtract(this.getPixelOrigin());
        },
        // @method wrapLatLng(latlng: LatLng): LatLng
        // Returns a `LatLng` where `lat` and `lng` has been wrapped according to the
        // map's CRS's `wrapLat` and `wrapLng` properties, if they are outside the
        // CRS's bounds.
        // By default this means longitude is wrapped around the dateline so its
        // value is between -180 and +180 degrees.
        wrapLatLng: function(t) {
          return this.options.crs.wrapLatLng(O(t));
        },
        // @method wrapLatLngBounds(bounds: LatLngBounds): LatLngBounds
        // Returns a `LatLngBounds` with the same size as the given one, ensuring that
        // its center is within the CRS's bounds.
        // By default this means the center longitude is wrapped around the dateline so its
        // value is between -180 and +180 degrees, and the majority of the bounds
        // overlaps the CRS's bounds.
        wrapLatLngBounds: function(t) {
          return this.options.crs.wrapLatLngBounds(nt(t));
        },
        // @method distance(latlng1: LatLng, latlng2: LatLng): Number
        // Returns the distance between two geographical coordinates according to
        // the map's CRS. By default this measures distance in meters.
        distance: function(t, e) {
          return this.options.crs.distance(O(t), O(e));
        },
        // @method containerPointToLayerPoint(point: Point): Point
        // Given a pixel coordinate relative to the map container, returns the corresponding
        // pixel coordinate relative to the [origin pixel](#map-getpixelorigin).
        containerPointToLayerPoint: function(t) {
          return M(t).subtract(this._getMapPanePos());
        },
        // @method layerPointToContainerPoint(point: Point): Point
        // Given a pixel coordinate relative to the [origin pixel](#map-getpixelorigin),
        // returns the corresponding pixel coordinate relative to the map container.
        layerPointToContainerPoint: function(t) {
          return M(t).add(this._getMapPanePos());
        },
        // @method containerPointToLatLng(point: Point): LatLng
        // Given a pixel coordinate relative to the map container, returns
        // the corresponding geographical coordinate (for the current zoom level).
        containerPointToLatLng: function(t) {
          var e = this.containerPointToLayerPoint(M(t));
          return this.layerPointToLatLng(e);
        },
        // @method latLngToContainerPoint(latlng: LatLng): Point
        // Given a geographical coordinate, returns the corresponding pixel coordinate
        // relative to the map container.
        latLngToContainerPoint: function(t) {
          return this.layerPointToContainerPoint(this.latLngToLayerPoint(O(t)));
        },
        // @method mouseEventToContainerPoint(ev: MouseEvent): Point
        // Given a MouseEvent object, returns the pixel coordinate relative to the
        // map container where the event took place.
        mouseEventToContainerPoint: function(t) {
          return mt(t, this._container);
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
          var e = this._container = oi(t);
          if (e) {
            if (e._leaflet_id)
              throw new Error("Map container is already initialized.");
          } else throw new Error("Map container not found.");
          r(e, "scroll", this._onScroll, this), this._containerId = U(e);
        },
        _initLayout: function() {
          var t = this._container;
          this._fadeAnimated = this.options.fadeAnimation && T.any3d, N(t, "leaflet-container" + (T.touch ? " leaflet-touch" : "") + (T.retina ? " leaflet-retina" : "") + (T.ielt9 ? " leaflet-oldie" : "") + (T.safari ? " leaflet-safari" : "") + (this._fadeAnimated ? " leaflet-fade-anim" : ""));
          var e = Ze(t, "position");
          e !== "absolute" && e !== "relative" && e !== "fixed" && e !== "sticky" && (t.style.position = "relative"), this._initPanes(), this._initControlPos && this._initControlPos();
        },
        _initPanes: function() {
          var t = this._panes = {};
          this._paneRenderers = {}, this._mapPane = this.createPane("mapPane", this._container), ht(this._mapPane, new I(0, 0)), this.createPane("tilePane"), this.createPane("overlayPane"), this.createPane("shadowPane"), this.createPane("markerPane"), this.createPane("tooltipPane"), this.createPane("popupPane"), this.options.markerZoomAnimation || (N(t.markerPane, "leaflet-zoom-hide"), N(t.shadowPane, "leaflet-zoom-hide"));
        },
        // private methods that modify map state
        // @section Map state change events
        _resetView: function(t, e, i) {
          ht(this._mapPane, new I(0, 0));
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
          return Zt(this._flyToFrame), this._panAnim && this._panAnim.stop(), this;
        },
        _rawPanBy: function(t) {
          ht(this._mapPane, this._getMapPanePos().subtract(t));
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
          this._targets = {}, this._targets[U(this._container)] = this;
          var e = t ? x : r;
          e(this._container, "click dblclick mousedown mouseup mouseover mouseout mousemove contextmenu keypress keydown keyup", this._handleDOMEvent, this), this.options.trackResize && e(window, "resize", this._onResize, this), T.any3d && this.options.transform3DLimit && (t ? this.off : this.on).call(this, "moveend", this._onMoveEnd);
        },
        _onResize: function() {
          Zt(this._resizeRequest), this._resizeRequest = kt(
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
          for (var i = [], n, a = e === "mouseout" || e === "mouseover", l = t.target || t.srcElement, h = !1; l; ) {
            if (n = this._targets[U(l)], n && (e === "click" || e === "preclick") && this._draggableMoved(n)) {
              h = !0;
              break;
            }
            if (n && n.listens(e, !0) && (a && !Ln(l, t) || (i.push(n), a)) || l === this._container)
              break;
            l = l.parentNode;
          }
          return !i.length && !h && !a && this.listens(e, !0) && (i = [this]), i;
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
            i === "mousedown" && Be(e), this._fireDOMEvent(t, i);
          }
        },
        _mouseEvents: ["click", "dblclick", "mouseover", "mouseout", "contextmenu"],
        _fireDOMEvent: function(t, e, i) {
          if (t.type === "click") {
            var n = J({}, t);
            n.type = "preclick", this._fireDOMEvent(n, n.type, i);
          }
          var a = this._findEventTargets(t, e);
          if (i) {
            for (var l = [], h = 0; h < i.length; h++)
              i[h].listens(e, !0) && l.push(i[h]);
            a = l.concat(a);
          }
          if (a.length) {
            e === "contextmenu" && m(t);
            var f = a[0], p = {
              originalEvent: t
            };
            if (t.type !== "keypress" && t.type !== "keydown" && t.type !== "keyup") {
              var v = f.getLatLng && (!f._radius || f._radius <= 10);
              p.containerPoint = v ? this.latLngToContainerPoint(f.getLatLng()) : this.mouseEventToContainerPoint(t), p.layerPoint = this.containerPointToLayerPoint(p.containerPoint), p.latlng = v ? f.getLatLng() : this.layerPointToLatLng(p.layerPoint);
            }
            for (h = 0; h < a.length; h++)
              if (a[h].fire(e, p, !0), p.originalEvent._stopped || a[h].options.bubblingMouseEvents === !1 && gi(this._mouseEvents, e) !== -1)
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
          return Qt(this._mapPane) || new I(0, 0);
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
          var n = this.project(t, e), a = this.getSize().divideBy(2), l = new it(n.subtract(a), n.add(a)), h = this._getBoundsOffset(l, i, e);
          return Math.abs(h.x) <= 1 && Math.abs(h.y) <= 1 ? t : this.unproject(n.add(h), e);
        },
        // adjust offset for view to get inside bounds
        _limitOffset: function(t, e) {
          if (!e)
            return t;
          var i = this.getPixelBounds(), n = new it(i.min.add(t), i.max.add(t));
          return t.add(this._getBoundsOffset(n, e));
        },
        // returns offset needed for pxBounds to get inside maxBounds at a specified zoom
        _getBoundsOffset: function(t, e, i) {
          var n = xt(
            this.project(e.getNorthEast(), i),
            this.project(e.getSouthWest(), i)
          ), a = n.min.subtract(t.min), l = n.max.subtract(t.max), h = this._rebound(a.x, -l.x), f = this._rebound(a.y, -l.y);
          return new I(h, f);
        },
        _rebound: function(t, e) {
          return t + e > 0 ? Math.round(t - e) / 2 : Math.max(0, Math.ceil(t)) - Math.max(0, Math.floor(e));
        },
        _limitZoom: function(t) {
          var e = this.getMinZoom(), i = this.getMaxZoom(), n = T.any3d ? this.options.zoomSnap : 1;
          return n && (t = Math.round(t / n) * n), Math.max(e, Math.min(i, t));
        },
        _onPanTransitionStep: function() {
          this.fire("move");
        },
        _onPanTransitionEnd: function() {
          ct(this._mapPane, "leaflet-pan-anim"), this.fire("moveend");
        },
        _tryAnimatedPan: function(t, e) {
          var i = this._getCenterOffset(t)._trunc();
          return (e && e.animate) !== !0 && !this.getSize().contains(i) ? !1 : (this.panBy(i, e), !0);
        },
        _createAnimProxy: function() {
          var t = this._proxy = V("div", "leaflet-proxy leaflet-zoom-animated");
          this._panes.mapPane.appendChild(t), this.on("zoomanim", function(e) {
            var i = Mi, n = this._proxy.style[i];
            Gt(this._proxy, this.project(e.center, e.zoom), this.getZoomScale(e.zoom, 1)), n === this._proxy.style[i] && this._animatingZoom && this._onZoomTransitionEnd();
          }, this), this.on("load moveend", this._animMoveEnd, this), this._on("unload", this._destroyAnimProxy, this);
        },
        _destroyAnimProxy: function() {
          X(this._proxy), this.off("load moveend", this._animMoveEnd, this), delete this._proxy;
        },
        _animMoveEnd: function() {
          var t = this.getCenter(), e = this.getZoom();
          Gt(this._proxy, this.project(t, e), this.getZoomScale(e, 1));
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
          return i.animate !== !0 && !this.getSize().contains(a) ? !1 : (kt(function() {
            this._moveStart(!0, i.noMoveStart || !1)._animateZoom(t, e, !0);
          }, this), !0);
        },
        _animateZoom: function(t, e, i, n) {
          this._mapPane && (i && (this._animatingZoom = !0, this._animateToCenter = t, this._animateToZoom = e, N(this._mapPane, "leaflet-zoom-anim")), this.fire("zoomanim", {
            center: t,
            zoom: e,
            noUpdate: n
          }), this._tempFireZoomEvent || (this._tempFireZoomEvent = this._zoom !== this._animateToZoom), this._move(this._animateToCenter, this._animateToZoom, void 0, !0), setTimeout(q(this._onZoomTransitionEnd, this), 250));
        },
        _onZoomTransitionEnd: function() {
          this._animatingZoom && (this._mapPane && ct(this._mapPane, "leaflet-zoom-anim"), this._animatingZoom = !1, this._move(this._animateToCenter, this._animateToZoom, void 0, !0), this._tempFireZoomEvent && this.fire("zoom"), delete this._tempFireZoomEvent, this.fire("move"), this._moveEnd(!0));
        }
      });
      function So(t, e) {
        return new K(t, e);
      }
      var jt = Ht.extend({
        // @section
        // @aka Control Options
        options: {
          // @option position: String = 'topright'
          // The position of the control (one of the map corners). Possible values are `'topleft'`,
          // `'topright'`, `'bottomleft'` or `'bottomright'`
          position: "topright"
        },
        initialize: function(t) {
          et(this, t);
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
          return N(e, "leaflet-control"), i.indexOf("bottom") !== -1 ? n.insertBefore(e, n.firstChild) : n.appendChild(e), this._map.on("unload", this.remove, this), this;
        },
        // @method remove: this
        // Removes the control from the map it is currently active on.
        remove: function() {
          return this._map ? (X(this._container), this.onRemove && this.onRemove(this._map), this._map.off("unload", this.remove, this), this._map = null, this) : this;
        },
        _refocusOnMap: function(t) {
          this._map && t && t.screenX > 0 && t.screenY > 0 && this._map.getContainer().focus();
        }
      }), Bi = function(t) {
        return new jt(t);
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
          var t = this._controlCorners = {}, e = "leaflet-", i = this._controlContainer = V("div", e + "control-container", this._container);
          function n(a, l) {
            var h = e + a + " " + e + l;
            t[a + l] = V("div", h, i);
          }
          n("top", "left"), n("top", "right"), n("bottom", "left"), n("bottom", "right");
        },
        _clearControlPos: function() {
          for (var t in this._controlCorners)
            X(this._controlCorners[t]);
          X(this._controlContainer), delete this._controlCorners, delete this._controlContainer;
        }
      });
      var Rn = jt.extend({
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
          et(this, i), this._layerControlInputs = [], this._layers = [], this._lastZIndex = 0, this._handlingClick = !1, this._preventClick = !1;
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
          return jt.prototype.addTo.call(this, t), this._expandIfNotCollapsed();
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
          var e = this._getLayer(U(t));
          return e && this._layers.splice(this._layers.indexOf(e), 1), this._map ? this._update() : this;
        },
        // @method expand(): this
        // Expand the control container if collapsed.
        expand: function() {
          N(this._container, "leaflet-control-layers-expanded"), this._section.style.height = null;
          var t = this._map.getSize().y - (this._container.offsetTop + 50);
          return t < this._section.clientHeight ? (N(this._section, "leaflet-control-layers-scrollbar"), this._section.style.height = t + "px") : ct(this._section, "leaflet-control-layers-scrollbar"), this._checkDisabledLayers(), this;
        },
        // @method collapse(): this
        // Collapse the control container if expanded.
        collapse: function() {
          return ct(this._container, "leaflet-control-layers-expanded"), this;
        },
        _initLayout: function() {
          var t = "leaflet-control-layers", e = this._container = V("div", t), i = this.options.collapsed;
          e.setAttribute("aria-haspopup", !0), Pe(e), ui(e);
          var n = this._section = V("section", t + "-list");
          i && (this._map.on("click", this.collapse, this), r(e, {
            mouseenter: this._expandSafely,
            mouseleave: this.collapse
          }, this));
          var a = this._layersLink = V("a", t + "-toggle", e);
          a.href = "#", a.title = "Layers", a.setAttribute("role", "button"), r(a, {
            keydown: function(l) {
              l.keyCode === 13 && this._expandSafely();
            },
            // Certain screen readers intercept the key event and instead send a click event
            click: function(l) {
              m(l), this._expandSafely();
            }
          }, this), i || this.expand(), this._baseLayersList = V("div", t + "-base", n), this._separator = V("div", t + "-separator", n), this._overlaysList = V("div", t + "-overlays", n), e.appendChild(n);
        },
        _getLayer: function(t) {
          for (var e = 0; e < this._layers.length; e++)
            if (this._layers[e] && U(this._layers[e].layer) === t)
              return this._layers[e];
        },
        _addLayer: function(t, e, i) {
          this._map && t.on("add remove", this._onLayerChange, this), this._layers.push({
            layer: t,
            name: e,
            overlay: i
          }), this.options.sortLayers && this._layers.sort(q(function(n, a) {
            return this.options.sortFunction(n.layer, a.layer, n.name, a.name);
          }, this)), this.options.autoZIndex && t.setZIndex && (this._lastZIndex++, t.setZIndex(this._lastZIndex)), this._expandIfNotCollapsed();
        },
        _update: function() {
          if (!this._container)
            return this;
          ai(this._baseLayersList), ai(this._overlaysList), this._layerControlInputs = [];
          var t, e, i, n, a = 0;
          for (i = 0; i < this._layers.length; i++)
            n = this._layers[i], this._addItem(n), e = e || n.overlay, t = t || !n.overlay, a += n.overlay ? 0 : 1;
          return this.options.hideSingleBase && (t = t && a > 1, this._baseLayersList.style.display = t ? "" : "none"), this._separator.style.display = e && t ? "" : "none", this;
        },
        _onLayerChange: function(t) {
          this._handlingClick || this._update();
          var e = this._getLayer(U(t.target)), i = e.overlay ? t.type === "add" ? "overlayadd" : "overlayremove" : t.type === "add" ? "baselayerchange" : null;
          i && this._map.fire(i, e);
        },
        // IE7 bugs out if you create a radio dynamically, so you have to do it this hacky way (see https://stackoverflow.com/a/119079)
        _createRadioElement: function(t, e) {
          var i = '<input type="radio" class="leaflet-control-layers-selector" name="' + t + '"' + (e ? ' checked="checked"' : "") + "/>", n = document.createElement("div");
          return n.innerHTML = i, n.firstChild;
        },
        _addItem: function(t) {
          var e = document.createElement("label"), i = this._map.hasLayer(t.layer), n;
          t.overlay ? (n = document.createElement("input"), n.type = "checkbox", n.className = "leaflet-control-layers-selector", n.defaultChecked = i) : n = this._createRadioElement("leaflet-base-layers_" + U(this), i), this._layerControlInputs.push(n), n.layerId = U(t.layer), r(n, "click", this._onInputClick, this);
          var a = document.createElement("span");
          a.innerHTML = " " + t.name;
          var l = document.createElement("span");
          e.appendChild(l), l.appendChild(n), l.appendChild(a);
          var h = t.overlay ? this._overlaysList : this._baseLayersList;
          return h.appendChild(e), this._checkDisabledLayers(), e;
        },
        _onInputClick: function() {
          if (!this._preventClick) {
            var t = this._layerControlInputs, e, i, n = [], a = [];
            this._handlingClick = !0;
            for (var l = t.length - 1; l >= 0; l--)
              e = t[l], i = this._getLayer(e.layerId).layer, e.checked ? n.push(i) : e.checked || a.push(i);
            for (l = 0; l < a.length; l++)
              this._map.hasLayer(a[l]) && this._map.removeLayer(a[l]);
            for (l = 0; l < n.length; l++)
              this._map.hasLayer(n[l]) || this._map.addLayer(n[l]);
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
          this._preventClick = !0, r(t, "click", m), this.expand();
          var e = this;
          setTimeout(function() {
            x(t, "click", m), e._preventClick = !1;
          });
        }
      }), Co = function(t, e, i) {
        return new Rn(t, e, i);
      }, Tn = jt.extend({
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
          var e = "leaflet-control-zoom", i = V("div", e + " leaflet-bar"), n = this.options;
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
          var l = V("a", i, n);
          return l.innerHTML = t, l.href = "#", l.title = e, l.setAttribute("role", "button"), l.setAttribute("aria-label", e), Pe(l), r(l, "click", F), r(l, "click", a, this), r(l, "click", this._refocusOnMap, this), l;
        },
        _updateDisabled: function() {
          var t = this._map, e = "leaflet-disabled";
          ct(this._zoomInButton, e), ct(this._zoomOutButton, e), this._zoomInButton.setAttribute("aria-disabled", "false"), this._zoomOutButton.setAttribute("aria-disabled", "false"), (this._disabled || t._zoom === t.getMinZoom()) && (N(this._zoomOutButton, e), this._zoomOutButton.setAttribute("aria-disabled", "true")), (this._disabled || t._zoom === t.getMaxZoom()) && (N(this._zoomInButton, e), this._zoomInButton.setAttribute("aria-disabled", "true"));
        }
      });
      K.mergeOptions({
        zoomControl: !0
      }), K.addInitHook(function() {
        this.options.zoomControl && (this.zoomControl = new Tn(), this.addControl(this.zoomControl));
      });
      var Mo = function(t) {
        return new Tn(t);
      }, Vn = jt.extend({
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
          var e = "leaflet-control-scale", i = V("div", e), n = this.options;
          return this._addScales(n, e + "-line", i), t.on(n.updateWhenIdle ? "moveend" : "move", this._update, this), t.whenReady(this._update, this), i;
        },
        onRemove: function(t) {
          t.off(this.options.updateWhenIdle ? "moveend" : "move", this._update, this);
        },
        _addScales: function(t, e, i) {
          t.metric && (this._mScale = V("div", e, i)), t.imperial && (this._iScale = V("div", e, i));
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
      }), zo = function(t) {
        return new Vn(t);
      }, Oo = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" class="leaflet-attribution-flag"><path fill="#4C7BE1" d="M0 0h12v4H0z"/><path fill="#FFD500" d="M0 4h12v3H0z"/><path fill="#E0BC00" d="M0 7h12v1H0z"/></svg>', kn = jt.extend({
        // @section
        // @aka Control.Attribution options
        options: {
          position: "bottomright",
          // @option prefix: String|false = 'Leaflet'
          // The HTML text shown before the attributions. Pass `false` to disable.
          prefix: '<a href="https://leafletjs.com" title="A JavaScript library for interactive maps">' + (T.inlineSvg ? Oo + " " : "") + "Leaflet</a>"
        },
        initialize: function(t) {
          et(this, t), this._attributions = {};
        },
        onAdd: function(t) {
          t.attributionControl = this, this._container = V("div", "leaflet-control-attribution"), Pe(this._container);
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
        this.options.attributionControl && new kn().addTo(this);
      });
      var Eo = function(t) {
        return new kn(t);
      };
      jt.Layers = Rn, jt.Zoom = Tn, jt.Scale = Vn, jt.Attribution = kn, Bi.layers = Co, Bi.zoom = Mo, Bi.scale = zo, Bi.attribution = Eo;
      var ie = Ht.extend({
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
      ie.addTo = function(t, e) {
        return t.addHandler(e, this), this;
      };
      var Ao = { Events: zt }, Un = T.touch ? "touchstart mousedown" : "mousedown", Le = ot.extend({
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
          et(this, n), this._element = t, this._dragStartTarget = e || t, this._preventOutline = i;
        },
        // @method enable()
        // Enables the dragging ability
        enable: function() {
          this._enabled || (r(this._dragStartTarget, Un, this._onDown, this), this._enabled = !0);
        },
        // @method disable()
        // Disables the dragging ability
        disable: function() {
          this._enabled && (Le._dragging === this && this.finishDrag(!0), x(this._dragStartTarget, Un, this._onDown, this), this._enabled = !1, this._moved = !1);
        },
        _onDown: function(t) {
          if (this._enabled && (this._moved = !1, !zi(this._element, "leaflet-zoom-anim"))) {
            if (t.touches && t.touches.length !== 1) {
              Le._dragging === this && this.finishDrag();
              return;
            }
            if (!(Le._dragging || t.shiftKey || t.which !== 1 && t.button !== 1 && !t.touches) && (Le._dragging = this, this._preventOutline && Be(this._element), si(), _(), !this._moving)) {
              this.fire("down");
              var e = t.touches ? t.touches[0] : t, i = Ii(this._element);
              this._startPoint = new I(e.clientX, e.clientY), this._startPos = Qt(this._element), this._parentScale = li(i);
              var n = t.type === "mousedown";
              r(document, n ? "mousemove" : "touchmove", this._onMove, this), r(document, n ? "mouseup" : "touchend touchcancel", this._onUp, this);
            }
          }
        },
        _onMove: function(t) {
          if (this._enabled) {
            if (t.touches && t.touches.length > 1) {
              this._moved = !0;
              return;
            }
            var e = t.touches && t.touches.length === 1 ? t.touches[0] : t, i = new I(e.clientX, e.clientY)._subtract(this._startPoint);
            !i.x && !i.y || Math.abs(i.x) + Math.abs(i.y) < this.options.clickTolerance || (i.x /= this._parentScale.x, i.y /= this._parentScale.y, m(t), this._moved || (this.fire("dragstart"), this._moved = !0, N(document.body, "leaflet-dragging"), this._lastTarget = t.target || t.srcElement, window.SVGElementInstance && this._lastTarget instanceof window.SVGElementInstance && (this._lastTarget = this._lastTarget.correspondingUseElement), N(this._lastTarget, "leaflet-drag-target")), this._newPos = this._startPos.add(i), this._moving = !0, this._lastEvent = t, this._updatePosition());
          }
        },
        _updatePosition: function() {
          var t = { originalEvent: this._lastEvent };
          this.fire("predrag", t), ht(this._element, this._newPos), this.fire("drag", t);
        },
        _onUp: function() {
          this._enabled && this.finishDrag();
        },
        finishDrag: function(t) {
          ct(document.body, "leaflet-dragging"), this._lastTarget && (ct(this._lastTarget, "leaflet-drag-target"), this._lastTarget = null), x(document, "mousemove touchmove", this._onMove, this), x(document, "mouseup touchend touchcancel", this._onUp, this), Ai(), te();
          var e = this._moved && this._moving;
          this._moving = !1, Le._dragging = !1, e && this.fire("dragend", {
            noInertia: t,
            distance: this._newPos.distanceTo(this._startPos)
          });
        }
      });
      function Fn(t, e, i) {
        var n, a = [1, 4, 2, 8], l, h, f, p, v, P, A, H;
        for (l = 0, P = t.length; l < P; l++)
          t[l]._code = Ne(t[l], e);
        for (f = 0; f < 4; f++) {
          for (A = a[f], n = [], l = 0, P = t.length, h = P - 1; l < P; h = l++)
            p = t[l], v = t[h], p._code & A ? v._code & A || (H = en(v, p, A, e, i), H._code = Ne(H, e), n.push(H)) : (v._code & A && (H = en(v, p, A, e, i), H._code = Ne(H, e), n.push(H)), n.push(p));
          t = n;
        }
        return t;
      }
      function Hn(t, e) {
        var i, n, a, l, h, f, p, v, P;
        if (!t || t.length === 0)
          throw new Error("latlngs not passed");
        Ut(t) || (console.warn("latlngs are not flat! Only the first ring will be used"), t = t[0]);
        var A = O([0, 0]), H = nt(t), Ot = H.getNorthWest().distanceTo(H.getSouthWest()) * H.getNorthEast().distanceTo(H.getNorthWest());
        Ot < 1700 && (A = Sn(t));
        var wt = t.length, Ft = [];
        for (i = 0; i < wt; i++) {
          var It = O(t[i]);
          Ft.push(e.project(O([It.lat - A.lat, It.lng - A.lng])));
        }
        for (f = p = v = 0, i = 0, n = wt - 1; i < wt; n = i++)
          a = Ft[i], l = Ft[n], h = a.y * l.x - l.y * a.x, p += (a.x + l.x) * h, v += (a.y + l.y) * h, f += h * 3;
        f === 0 ? P = Ft[0] : P = [p / f, v / f];
        var mi = e.unproject(M(P));
        return O([mi.lat + A.lat, mi.lng + A.lng]);
      }
      function Sn(t) {
        for (var e = 0, i = 0, n = 0, a = 0; a < t.length; a++) {
          var l = O(t[a]);
          e += l.lat, i += l.lng, n++;
        }
        return O([e / n, i / n]);
      }
      var Zo = {
        __proto__: null,
        clipPolygon: Fn,
        polygonCenter: Hn,
        centroid: Sn
      };
      function Wn(t, e) {
        if (!e || !t.length)
          return t.slice();
        var i = e * e;
        return t = No(t, i), t = Bo(t, i), t;
      }
      function Gn(t, e, i) {
        return Math.sqrt(Ni(t, e, i, !0));
      }
      function Io(t, e, i) {
        return Ni(t, e, i);
      }
      function Bo(t, e) {
        var i = t.length, n = typeof Uint8Array < "u" ? Uint8Array : Array, a = new n(i);
        a[0] = a[i - 1] = 1, Cn(t, a, e, 0, i - 1);
        var l, h = [];
        for (l = 0; l < i; l++)
          a[l] && h.push(t[l]);
        return h;
      }
      function Cn(t, e, i, n, a) {
        var l = 0, h, f, p;
        for (f = n + 1; f <= a - 1; f++)
          p = Ni(t[f], t[n], t[a], !0), p > l && (h = f, l = p);
        l > i && (e[h] = 1, Cn(t, e, i, n, h), Cn(t, e, i, h, a));
      }
      function No(t, e) {
        for (var i = [t[0]], n = 1, a = 0, l = t.length; n < l; n++)
          Do(t[n], t[a]) > e && (i.push(t[n]), a = n);
        return a < l - 1 && i.push(t[l - 1]), i;
      }
      var jn;
      function qn(t, e, i, n, a) {
        var l = n ? jn : Ne(t, i), h = Ne(e, i), f, p, v;
        for (jn = h; ; ) {
          if (!(l | h))
            return [t, e];
          if (l & h)
            return !1;
          f = l || h, p = en(t, e, f, i, a), v = Ne(p, i), f === l ? (t = p, l = v) : (e = p, h = v);
        }
      }
      function en(t, e, i, n, a) {
        var l = e.x - t.x, h = e.y - t.y, f = n.min, p = n.max, v, P;
        return i & 8 ? (v = t.x + l * (p.y - t.y) / h, P = p.y) : i & 4 ? (v = t.x + l * (f.y - t.y) / h, P = f.y) : i & 2 ? (v = p.x, P = t.y + h * (p.x - t.x) / l) : i & 1 && (v = f.x, P = t.y + h * (f.x - t.x) / l), new I(v, P, a);
      }
      function Ne(t, e) {
        var i = 0;
        return t.x < e.min.x ? i |= 1 : t.x > e.max.x && (i |= 2), t.y < e.min.y ? i |= 4 : t.y > e.max.y && (i |= 8), i;
      }
      function Do(t, e) {
        var i = e.x - t.x, n = e.y - t.y;
        return i * i + n * n;
      }
      function Ni(t, e, i, n) {
        var a = e.x, l = e.y, h = i.x - a, f = i.y - l, p = h * h + f * f, v;
        return p > 0 && (v = ((t.x - a) * h + (t.y - l) * f) / p, v > 1 ? (a = i.x, l = i.y) : v > 0 && (a += h * v, l += f * v)), h = t.x - a, f = t.y - l, n ? h * h + f * f : new I(a, l);
      }
      function Ut(t) {
        return !Bt(t[0]) || typeof t[0][0] != "object" && typeof t[0][0] < "u";
      }
      function Kn(t) {
        return console.warn("Deprecated use of _flat, please use L.LineUtil.isFlat instead."), Ut(t);
      }
      function $n(t, e) {
        var i, n, a, l, h, f, p, v;
        if (!t || t.length === 0)
          throw new Error("latlngs not passed");
        Ut(t) || (console.warn("latlngs are not flat! Only the first ring will be used"), t = t[0]);
        var P = O([0, 0]), A = nt(t), H = A.getNorthWest().distanceTo(A.getSouthWest()) * A.getNorthEast().distanceTo(A.getNorthWest());
        H < 1700 && (P = Sn(t));
        var Ot = t.length, wt = [];
        for (i = 0; i < Ot; i++) {
          var Ft = O(t[i]);
          wt.push(e.project(O([Ft.lat - P.lat, Ft.lng - P.lng])));
        }
        for (i = 0, n = 0; i < Ot - 1; i++)
          n += wt[i].distanceTo(wt[i + 1]) / 2;
        if (n === 0)
          v = wt[0];
        else
          for (i = 0, l = 0; i < Ot - 1; i++)
            if (h = wt[i], f = wt[i + 1], a = h.distanceTo(f), l += a, l > n) {
              p = (l - n) / a, v = [
                f.x - p * (f.x - h.x),
                f.y - p * (f.y - h.y)
              ];
              break;
            }
        var It = e.unproject(M(v));
        return O([It.lat + P.lat, It.lng + P.lng]);
      }
      var Ro = {
        __proto__: null,
        simplify: Wn,
        pointToSegmentDistance: Gn,
        closestPointOnSegment: Io,
        clipSegment: qn,
        _getEdgeIntersection: en,
        _getBitCode: Ne,
        _sqClosestPointOnSegment: Ni,
        isFlat: Ut,
        _flat: Kn,
        polylineCenter: $n
      }, Mn = {
        project: function(t) {
          return new I(t.lng, t.lat);
        },
        unproject: function(t) {
          return new B(t.y, t.x);
        },
        bounds: new it([-180, -90], [180, 90])
      }, zn = {
        R: 6378137,
        R_MINOR: 6356752314245179e-9,
        bounds: new it([-2003750834279e-5, -1549657073972e-5], [2003750834279e-5, 1876465623138e-5]),
        project: function(t) {
          var e = Math.PI / 180, i = this.R, n = t.lat * e, a = this.R_MINOR / i, l = Math.sqrt(1 - a * a), h = l * Math.sin(n), f = Math.tan(Math.PI / 4 - n / 2) / Math.pow((1 - h) / (1 + h), l / 2);
          return n = -i * Math.log(Math.max(f, 1e-10)), new I(t.lng * e * i, n);
        },
        unproject: function(t) {
          for (var e = 180 / Math.PI, i = this.R, n = this.R_MINOR / i, a = Math.sqrt(1 - n * n), l = Math.exp(-t.y / i), h = Math.PI / 2 - 2 * Math.atan(l), f = 0, p = 0.1, v; f < 15 && Math.abs(p) > 1e-7; f++)
            v = a * Math.sin(h), v = Math.pow((1 - v) / (1 + v), a / 2), p = Math.PI / 2 - 2 * Math.atan(l * v) - h, h += p;
          return new B(h * e, t.x * e / i);
        }
      }, Vo = {
        __proto__: null,
        LonLat: Mn,
        Mercator: zn,
        SphericalMercator: He
      }, Uo = J({}, Kt, {
        code: "EPSG:3395",
        projection: zn,
        transformation: (function() {
          var t = 0.5 / (Math.PI * zn.R);
          return pe(t, 0.5, -t, 0.5);
        })()
      }), Yn = J({}, Kt, {
        code: "EPSG:4326",
        projection: Mn,
        transformation: pe(1 / 180, 1, -1 / 180, 0.5)
      }), Fo = J({}, C, {
        projection: Mn,
        transformation: pe(1, 0, -1, 0),
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
      C.Earth = Kt, C.EPSG3395 = Uo, C.EPSG3857 = bi, C.EPSG900913 = $t, C.EPSG4326 = Yn, C.Simple = Fo;
      var qt = ot.extend({
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
          return this._map._targets[U(t)] = this, this;
        },
        removeInteractiveTarget: function(t) {
          return delete this._map._targets[U(t)], this;
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
          var e = U(t);
          return this._layers[e] ? this : (this._layers[e] = t, t._mapToAdd = this, t.beforeAdd && t.beforeAdd(this), this.whenReady(t._layerAdd, t), this);
        },
        // @method removeLayer(layer: Layer): this
        // Removes the given layer from the map.
        removeLayer: function(t) {
          var e = U(t);
          return this._layers[e] ? (this._loaded && t.onRemove(this), delete this._layers[e], this._loaded && (this.fire("layerremove", { layer: t }), t.fire("remove")), t._map = t._mapToAdd = null, this) : this;
        },
        // @method hasLayer(layer: Layer): Boolean
        // Returns `true` if the given layer is currently added to the map
        hasLayer: function(t) {
          return U(t) in this._layers;
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
          t = t ? Bt(t) ? t : [t] : [];
          for (var e = 0, i = t.length; e < i; e++)
            this.addLayer(t[e]);
        },
        _addZoomLimit: function(t) {
          (!isNaN(t.options.maxZoom) || !isNaN(t.options.minZoom)) && (this._zoomBoundLayers[U(t)] = t, this._updateZoomLevels());
        },
        _removeZoomLimit: function(t) {
          var e = U(t);
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
      var ci = qt.extend({
        initialize: function(t, e) {
          et(this, e), this._layers = {};
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
          return U(t);
        }
      }), Ho = function(t, e) {
        return new ci(t, e);
      }, le = ci.extend({
        addLayer: function(t) {
          return this.hasLayer(t) ? this : (t.addEventParent(this), ci.prototype.addLayer.call(this, t), this.fire("layeradd", { layer: t }));
        },
        removeLayer: function(t) {
          return this.hasLayer(t) ? (t in this._layers && (t = this._layers[t]), t.removeEventParent(this), ci.prototype.removeLayer.call(this, t), this.fire("layerremove", { layer: t })) : this;
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
          var t = new Pt();
          for (var e in this._layers) {
            var i = this._layers[e];
            t.extend(i.getBounds ? i.getBounds() : i.getLatLng());
          }
          return t;
        }
      }), Wo = function(t, e) {
        return new le(t, e);
      }, hi = Ht.extend({
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
          et(this, t);
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
          var a = M(n), l = M(e === "shadow" && i.shadowAnchor || i.iconAnchor || a && a.divideBy(2, !0));
          t.className = "leaflet-marker-" + e + " " + (i.className || ""), l && (t.style.marginLeft = -l.x + "px", t.style.marginTop = -l.y + "px"), a && (t.style.width = a.x + "px", t.style.height = a.y + "px");
        },
        _createImg: function(t, e) {
          return e = e || document.createElement("img"), e.src = t, e;
        },
        _getIconUrl: function(t) {
          return T.retina && this.options[t + "RetinaUrl"] || this.options[t + "Url"];
        }
      });
      function Go(t) {
        return new hi(t);
      }
      var Di = hi.extend({
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
          return typeof Di.imagePath != "string" && (Di.imagePath = this._detectIconPath()), (this.options.imagePath || Di.imagePath) + hi.prototype._getIconUrl.call(this, t);
        },
        _stripUrl: function(t) {
          var e = function(i, n, a) {
            var l = n.exec(i);
            return l && l[a];
          };
          return t = e(t, /^url\((['"])?(.+)\1\)$/, 2), t && e(t, /^(.*)marker-icon\.png$/, 1);
        },
        _detectIconPath: function() {
          var t = V("div", "leaflet-default-icon-path", document.body), e = Ze(t, "background-image") || Ze(t, "backgroundImage");
          if (document.body.removeChild(t), e = this._stripUrl(e), e)
            return e;
          var i = document.querySelector('link[href$="leaflet.css"]');
          return i ? i.href.substring(0, i.href.length - 11 - 1) : "";
        }
      }), Jn = ie.extend({
        initialize: function(t) {
          this._marker = t;
        },
        addHooks: function() {
          var t = this._marker._icon;
          this._draggable || (this._draggable = new Le(t, t, !0)), this._draggable.on({
            dragstart: this._onDragStart,
            predrag: this._onPreDrag,
            drag: this._onDrag,
            dragend: this._onDragEnd
          }, this).enable(), N(t, "leaflet-marker-draggable");
        },
        removeHooks: function() {
          this._draggable.off({
            dragstart: this._onDragStart,
            predrag: this._onPreDrag,
            drag: this._onDrag,
            dragend: this._onDragEnd
          }, this).disable(), this._marker._icon && ct(this._marker._icon, "leaflet-marker-draggable");
        },
        moved: function() {
          return this._draggable && this._draggable._moved;
        },
        _adjustPan: function(t) {
          var e = this._marker, i = e._map, n = this._marker.options.autoPanSpeed, a = this._marker.options.autoPanPadding, l = Qt(e._icon), h = i.getPixelBounds(), f = i.getPixelOrigin(), p = xt(
            h.min._subtract(f).add(a),
            h.max._subtract(f).subtract(a)
          );
          if (!p.contains(l)) {
            var v = M(
              (Math.max(p.max.x, l.x) - p.max.x) / (h.max.x - p.max.x) - (Math.min(p.min.x, l.x) - p.min.x) / (h.min.x - p.min.x),
              (Math.max(p.max.y, l.y) - p.max.y) / (h.max.y - p.max.y) - (Math.min(p.min.y, l.y) - p.min.y) / (h.min.y - p.min.y)
            ).multiplyBy(n);
            i.panBy(v, { animate: !1 }), this._draggable._newPos._add(v), this._draggable._startPos._add(v), ht(e._icon, this._draggable._newPos), this._onDrag(t), this._panRequest = kt(this._adjustPan.bind(this, t));
          }
        },
        _onDragStart: function() {
          this._oldLatLng = this._marker.getLatLng(), this._marker.closePopup && this._marker.closePopup(), this._marker.fire("movestart").fire("dragstart");
        },
        _onPreDrag: function(t) {
          this._marker.options.autoPan && (Zt(this._panRequest), this._panRequest = kt(this._adjustPan.bind(this, t)));
        },
        _onDrag: function(t) {
          var e = this._marker, i = e._shadow, n = Qt(e._icon), a = e._map.layerPointToLatLng(n);
          i && ht(i, n), e._latlng = a, t.latlng = a, t.oldLatLng = this._oldLatLng, e.fire("move", t).fire("drag", t);
        },
        _onDragEnd: function(t) {
          Zt(this._panRequest), delete this._oldLatLng, this._marker.fire("moveend").fire("dragend", t);
        }
      }), nn = qt.extend({
        // @section
        // @aka Marker options
        options: {
          // @option icon: Icon = *
          // Icon instance to use for rendering the marker.
          // See [Icon documentation](#L.Icon) for details on how to customize the marker icon.
          // If not specified, a common instance of `L.Icon.Default` is used.
          icon: new Di(),
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
          et(this, e), this._latlng = O(t);
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
          return this._latlng = O(t), this.update(), this.fire("move", { oldLatLng: e, latlng: this._latlng });
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
          i !== this._icon && (this._icon && this._removeIcon(), n = !0, t.title && (i.title = t.title), i.tagName === "IMG" && (i.alt = t.alt || "")), N(i, e), t.keyboard && (i.tabIndex = "0", i.setAttribute("role", "button")), this._icon = i, t.riseOnHover && this.on({
            mouseover: this._bringToFront,
            mouseout: this._resetZIndex
          }), this.options.autoPanOnFocus && r(i, "focus", this._panOnFocus, this);
          var a = t.icon.createShadow(this._shadow), l = !1;
          a !== this._shadow && (this._removeShadow(), l = !0), a && (N(a, e), a.alt = ""), this._shadow = a, t.opacity < 1 && this._updateOpacity(), n && this.getPane().appendChild(this._icon), this._initInteraction(), a && l && this.getPane(t.shadowPane).appendChild(this._shadow);
        },
        _removeIcon: function() {
          this.options.riseOnHover && this.off({
            mouseover: this._bringToFront,
            mouseout: this._resetZIndex
          }), this.options.autoPanOnFocus && x(this._icon, "focus", this._panOnFocus, this), X(this._icon), this.removeInteractiveTarget(this._icon), this._icon = null;
        },
        _removeShadow: function() {
          this._shadow && X(this._shadow), this._shadow = null;
        },
        _setPos: function(t) {
          this._icon && ht(this._icon, t), this._shadow && ht(this._shadow, t), this._zIndex = t.y + this.options.zIndexOffset, this._resetZIndex();
        },
        _updateZIndex: function(t) {
          this._icon && (this._icon.style.zIndex = this._zIndex + t);
        },
        _animateZoom: function(t) {
          var e = this._map._latLngToNewLayerPoint(this._latlng, t.zoom, t.center).round();
          this._setPos(e);
        },
        _initInteraction: function() {
          if (this.options.interactive && (N(this._icon, "leaflet-interactive"), this.addInteractiveTarget(this._icon), Jn)) {
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
          this._icon && Tt(this._icon, t), this._shadow && Tt(this._shadow, t);
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
            var e = this.options.icon.options, i = e.iconSize ? M(e.iconSize) : M(0, 0), n = e.iconAnchor ? M(e.iconAnchor) : M(0, 0);
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
        return new nn(t, e);
      }
      var Te = qt.extend({
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
          return et(this, t), this._renderer && (this._renderer._updateStyle(this), this.options.stroke && t && Object.prototype.hasOwnProperty.call(t, "weight") && this._updateBounds()), this;
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
      }), on = Te.extend({
        // @section
        // @aka CircleMarker options
        options: {
          fill: !0,
          // @option radius: Number = 10
          // Radius of the circle marker, in pixels
          radius: 10
        },
        initialize: function(t, e) {
          et(this, e), this._latlng = O(t), this._radius = this.options.radius;
        },
        // @method setLatLng(latLng: LatLng): this
        // Sets the position of a circle marker to a new location.
        setLatLng: function(t) {
          var e = this._latlng;
          return this._latlng = O(t), this.redraw(), this.fire("move", { oldLatLng: e, latlng: this._latlng });
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
          return Te.prototype.setStyle.call(this, t), this.setRadius(e), this;
        },
        _project: function() {
          this._point = this._map.latLngToLayerPoint(this._latlng), this._updateBounds();
        },
        _updateBounds: function() {
          var t = this._radius, e = this._radiusY || t, i = this._clickTolerance(), n = [t + i, e + i];
          this._pxBounds = new it(this._point.subtract(n), this._point.add(n));
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
      function qo(t, e) {
        return new on(t, e);
      }
      var On = on.extend({
        initialize: function(t, e, i) {
          if (typeof e == "number" && (e = J({}, i, { radius: e })), et(this, e), this._latlng = O(t), isNaN(this.options.radius))
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
          return new Pt(
            this._map.layerPointToLatLng(this._point.subtract(t)),
            this._map.layerPointToLatLng(this._point.add(t))
          );
        },
        setStyle: Te.prototype.setStyle,
        _project: function() {
          var t = this._latlng.lng, e = this._latlng.lat, i = this._map, n = i.options.crs;
          if (n.distance === Kt.distance) {
            var a = Math.PI / 180, l = this._mRadius / Kt.R / a, h = i.project([e + l, t]), f = i.project([e - l, t]), p = h.add(f).divideBy(2), v = i.unproject(p).lat, P = Math.acos((Math.cos(l * a) - Math.sin(e * a) * Math.sin(v * a)) / (Math.cos(e * a) * Math.cos(v * a))) / a;
            (isNaN(P) || P === 0) && (P = l / Math.cos(Math.PI / 180 * e)), this._point = p.subtract(i.getPixelOrigin()), this._radius = isNaN(P) ? 0 : p.x - i.project([v, t - P]).x, this._radiusY = p.y - h.y;
          } else {
            var A = n.unproject(n.project(this._latlng).subtract([this._mRadius, 0]));
            this._point = i.latLngToLayerPoint(this._latlng), this._radius = this._point.x - i.latLngToLayerPoint(A).x;
          }
          this._updateBounds();
        }
      });
      function Ko(t, e, i) {
        return new On(t, e, i);
      }
      var ue = Te.extend({
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
          et(this, e), this._setLatLngs(t);
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
          for (var e = 1 / 0, i = null, n = Ni, a, l, h = 0, f = this._parts.length; h < f; h++)
            for (var p = this._parts[h], v = 1, P = p.length; v < P; v++) {
              a = p[v - 1], l = p[v];
              var A = n(t, a, l, !0);
              A < e && (e = A, i = n(t, a, l));
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
          return e = e || this._defaultShape(), t = O(t), e.push(t), this._bounds.extend(t), this.redraw();
        },
        _setLatLngs: function(t) {
          this._bounds = new Pt(), this._latlngs = this._convertLatLngs(t);
        },
        _defaultShape: function() {
          return Ut(this._latlngs) ? this._latlngs : this._latlngs[0];
        },
        // recursively convert latlngs input into actual LatLng instances; calculate bounds along the way
        _convertLatLngs: function(t) {
          for (var e = [], i = Ut(t), n = 0, a = t.length; n < a; n++)
            i ? (e[n] = O(t[n]), this._bounds.extend(e[n])) : e[n] = this._convertLatLngs(t[n]);
          return e;
        },
        _project: function() {
          var t = new it();
          this._rings = [], this._projectLatlngs(this._latlngs, this._rings, t), this._bounds.isValid() && t.isValid() && (this._rawPxBounds = t, this._updateBounds());
        },
        _updateBounds: function() {
          var t = this._clickTolerance(), e = new I(t, t);
          this._rawPxBounds && (this._pxBounds = new it([
            this._rawPxBounds.min.subtract(e),
            this._rawPxBounds.max.add(e)
          ]));
        },
        // recursively turns latlngs into a set of rings with projected coordinates
        _projectLatlngs: function(t, e, i) {
          var n = t[0] instanceof B, a = t.length, l, h;
          if (n) {
            for (h = [], l = 0; l < a; l++)
              h[l] = this._map.latLngToLayerPoint(t[l]), i.extend(h[l]);
            e.push(h);
          } else
            for (l = 0; l < a; l++)
              this._projectLatlngs(t[l], e, i);
        },
        // clip polyline by renderer bounds so that we have less to render for performance
        _clipPoints: function() {
          var t = this._renderer._bounds;
          if (this._parts = [], !(!this._pxBounds || !this._pxBounds.intersects(t))) {
            if (this.options.noClip) {
              this._parts = this._rings;
              return;
            }
            var e = this._parts, i, n, a, l, h, f, p;
            for (i = 0, a = 0, l = this._rings.length; i < l; i++)
              for (p = this._rings[i], n = 0, h = p.length; n < h - 1; n++)
                f = qn(p[n], p[n + 1], t, n, !0), f && (e[a] = e[a] || [], e[a].push(f[0]), (f[1] !== p[n + 1] || n === h - 2) && (e[a].push(f[1]), a++));
          }
        },
        // simplify each clipped part of the polyline for performance
        _simplifyPoints: function() {
          for (var t = this._parts, e = this.options.smoothFactor, i = 0, n = t.length; i < n; i++)
            t[i] = Wn(t[i], e);
        },
        _update: function() {
          this._map && (this._clipPoints(), this._simplifyPoints(), this._updatePath());
        },
        _updatePath: function() {
          this._renderer._updatePoly(this);
        },
        // Needed by the `Canvas` renderer for interactivity
        _containsPoint: function(t, e) {
          var i, n, a, l, h, f, p = this._clickTolerance();
          if (!this._pxBounds || !this._pxBounds.contains(t))
            return !1;
          for (i = 0, l = this._parts.length; i < l; i++)
            for (f = this._parts[i], n = 0, h = f.length, a = h - 1; n < h; a = n++)
              if (!(!e && n === 0) && Gn(t, f[a], f[n]) <= p)
                return !0;
          return !1;
        }
      });
      function $o(t, e) {
        return new ue(t, e);
      }
      ue._flat = Kn;
      var di = ue.extend({
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
          return Hn(this._defaultShape(), this._map.options.crs);
        },
        _convertLatLngs: function(t) {
          var e = ue.prototype._convertLatLngs.call(this, t), i = e.length;
          return i >= 2 && e[0] instanceof B && e[0].equals(e[i - 1]) && e.pop(), e;
        },
        _setLatLngs: function(t) {
          ue.prototype._setLatLngs.call(this, t), Ut(this._latlngs) && (this._latlngs = [this._latlngs]);
        },
        _defaultShape: function() {
          return Ut(this._latlngs[0]) ? this._latlngs[0] : this._latlngs[0][0];
        },
        _clipPoints: function() {
          var t = this._renderer._bounds, e = this.options.weight, i = new I(e, e);
          if (t = new it(t.min.subtract(i), t.max.add(i)), this._parts = [], !(!this._pxBounds || !this._pxBounds.intersects(t))) {
            if (this.options.noClip) {
              this._parts = this._rings;
              return;
            }
            for (var n = 0, a = this._rings.length, l; n < a; n++)
              l = Fn(this._rings[n], t, !0), l.length && this._parts.push(l);
          }
        },
        _updatePath: function() {
          this._renderer._updatePoly(this, !0);
        },
        // Needed by the `Canvas` renderer for interactivity
        _containsPoint: function(t) {
          var e = !1, i, n, a, l, h, f, p, v;
          if (!this._pxBounds || !this._pxBounds.contains(t))
            return !1;
          for (l = 0, p = this._parts.length; l < p; l++)
            for (i = this._parts[l], h = 0, v = i.length, f = v - 1; h < v; f = h++)
              n = i[h], a = i[f], n.y > t.y != a.y > t.y && t.x < (a.x - n.x) * (t.y - n.y) / (a.y - n.y) + n.x && (e = !e);
          return e || ue.prototype._containsPoint.call(this, t, !0);
        }
      });
      function Yo(t, e) {
        return new di(t, e);
      }
      var ce = le.extend({
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
          et(this, e), this._layers = {}, t && this.addData(t);
        },
        // @method addData( <GeoJSON> data ): this
        // Adds a GeoJSON object to the layer.
        addData: function(t) {
          var e = Bt(t) ? t : t.features, i, n, a;
          if (e) {
            for (i = 0, n = e.length; i < n; i++)
              a = e[i], (a.geometries || a.geometry || a.features || a.coordinates) && this.addData(a);
            return this;
          }
          var l = this.options;
          if (l.filter && !l.filter(t))
            return this;
          var h = an(t, l);
          return h ? (h.feature = ln(t), h.defaultOptions = h.options, this.resetStyle(h), l.onEachFeature && l.onEachFeature(t, h), this.addLayer(h)) : this;
        },
        // @method resetStyle( <Path> layer? ): this
        // Resets the given vector layer's style to the original GeoJSON style, useful for resetting style after hover events.
        // If `layer` is omitted, the style of all features in the current layer is reset.
        resetStyle: function(t) {
          return t === void 0 ? this.eachLayer(this.resetStyle, this) : (t.options = J({}, t.defaultOptions), this._setLayerStyle(t, this.options.style), this);
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
      function an(t, e) {
        var i = t.type === "Feature" ? t.geometry : t, n = i ? i.coordinates : null, a = [], l = e && e.pointToLayer, h = e && e.coordsToLatLng || En, f, p, v, P;
        if (!n && !i)
          return null;
        switch (i.type) {
          case "Point":
            return f = h(n), Xn(l, t, f, e);
          case "MultiPoint":
            for (v = 0, P = n.length; v < P; v++)
              f = h(n[v]), a.push(Xn(l, t, f, e));
            return new le(a);
          case "LineString":
          case "MultiLineString":
            return p = sn(n, i.type === "LineString" ? 0 : 1, h), new ue(p, e);
          case "Polygon":
          case "MultiPolygon":
            return p = sn(n, i.type === "Polygon" ? 1 : 2, h), new di(p, e);
          case "GeometryCollection":
            for (v = 0, P = i.geometries.length; v < P; v++) {
              var A = an({
                geometry: i.geometries[v],
                type: "Feature",
                properties: t.properties
              }, e);
              A && a.push(A);
            }
            return new le(a);
          case "FeatureCollection":
            for (v = 0, P = i.features.length; v < P; v++) {
              var H = an(i.features[v], e);
              H && a.push(H);
            }
            return new le(a);
          default:
            throw new Error("Invalid GeoJSON object.");
        }
      }
      function Xn(t, e, i, n) {
        return t ? t(e, i) : new nn(i, n && n.markersInheritOptions && n);
      }
      function En(t) {
        return new B(t[1], t[0], t[2]);
      }
      function sn(t, e, i) {
        for (var n = [], a = 0, l = t.length, h; a < l; a++)
          h = e ? sn(t[a], e - 1, i) : (i || En)(t[a]), n.push(h);
        return n;
      }
      function An(t, e) {
        return t = O(t), t.alt !== void 0 ? [rt(t.lng, e), rt(t.lat, e), rt(t.alt, e)] : [rt(t.lng, e), rt(t.lat, e)];
      }
      function rn(t, e, i, n) {
        for (var a = [], l = 0, h = t.length; l < h; l++)
          a.push(e ? rn(t[l], Ut(t[l]) ? 0 : e - 1, i, n) : An(t[l], n));
        return !e && i && a.length > 0 && a.push(a[0].slice()), a;
      }
      function fi(t, e) {
        return t.feature ? J({}, t.feature, { geometry: e }) : ln(e);
      }
      function ln(t) {
        return t.type === "Feature" || t.type === "FeatureCollection" ? t : {
          type: "Feature",
          properties: {},
          geometry: t
        };
      }
      var Zn = {
        toGeoJSON: function(t) {
          return fi(this, {
            type: "Point",
            coordinates: An(this.getLatLng(), t)
          });
        }
      };
      nn.include(Zn), On.include(Zn), on.include(Zn), ue.include({
        toGeoJSON: function(t) {
          var e = !Ut(this._latlngs), i = rn(this._latlngs, e ? 1 : 0, !1, t);
          return fi(this, {
            type: (e ? "Multi" : "") + "LineString",
            coordinates: i
          });
        }
      }), di.include({
        toGeoJSON: function(t) {
          var e = !Ut(this._latlngs), i = e && !Ut(this._latlngs[0]), n = rn(this._latlngs, i ? 2 : e ? 1 : 0, !0, t);
          return e || (n = [n]), fi(this, {
            type: (i ? "Multi" : "") + "Polygon",
            coordinates: n
          });
        }
      }), ci.include({
        toMultiPoint: function(t) {
          var e = [];
          return this.eachLayer(function(i) {
            e.push(i.toGeoJSON(t).geometry.coordinates);
          }), fi(this, {
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
              var l = a.toGeoJSON(t);
              if (i)
                n.push(l.geometry);
              else {
                var h = ln(l);
                h.type === "FeatureCollection" ? n.push.apply(n, h.features) : n.push(h);
              }
            }
          }), i ? fi(this, {
            geometries: n,
            type: "GeometryCollection"
          }) : {
            type: "FeatureCollection",
            features: n
          };
        }
      });
      function Qn(t, e) {
        return new ce(t, e);
      }
      var Jo = Qn, un = qt.extend({
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
          this._url = t, this._bounds = nt(e), et(this, i);
        },
        onAdd: function() {
          this._image || (this._initImage(), this.options.opacity < 1 && this._updateOpacity()), this.options.interactive && (N(this._image, "leaflet-interactive"), this.addInteractiveTarget(this._image)), this.getPane().appendChild(this._image), this._reset();
        },
        onRemove: function() {
          X(this._image), this.options.interactive && this.removeInteractiveTarget(this._image);
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
          return this._map && be(this._image), this;
        },
        // @method bringToBack(): this
        // Brings the layer to the bottom of all overlays.
        bringToBack: function() {
          return this._map && we(this._image), this;
        },
        // @method setUrl(url: String): this
        // Changes the URL of the image.
        setUrl: function(t) {
          return this._url = t, this._image && (this._image.src = t), this;
        },
        // @method setBounds(bounds: LatLngBounds): this
        // Update the bounds that this ImageOverlay covers
        setBounds: function(t) {
          return this._bounds = nt(t), this._map && this._reset(), this;
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
          var t = this._url.tagName === "IMG", e = this._image = t ? this._url : V("img");
          if (N(e, "leaflet-image-layer"), this._zoomAnimated && N(e, "leaflet-zoom-animated"), this.options.className && N(e, this.options.className), e.onselectstart = lt, e.onmousemove = lt, e.onload = q(this.fire, this, "load"), e.onerror = q(this._overlayOnError, this, "error"), (this.options.crossOrigin || this.options.crossOrigin === "") && (e.crossOrigin = this.options.crossOrigin === !0 ? "" : this.options.crossOrigin), this.options.zIndex && this._updateZIndex(), t) {
            this._url = e.src;
            return;
          }
          e.src = this._url, e.alt = this.options.alt;
        },
        _animateZoom: function(t) {
          var e = this._map.getZoomScale(t.zoom), i = this._map._latLngBoundsToNewLayerBounds(this._bounds, t.zoom, t.center).min;
          Gt(this._image, i, e);
        },
        _reset: function() {
          var t = this._image, e = new it(
            this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
            this._map.latLngToLayerPoint(this._bounds.getSouthEast())
          ), i = e.getSize();
          ht(t, e.min), t.style.width = i.x + "px", t.style.height = i.y + "px";
        },
        _updateOpacity: function() {
          Tt(this._image, this.options.opacity);
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
      }), Xo = function(t, e, i) {
        return new un(t, e, i);
      }, to = un.extend({
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
          var t = this._url.tagName === "VIDEO", e = this._image = t ? this._url : V("video");
          if (N(e, "leaflet-image-layer"), this._zoomAnimated && N(e, "leaflet-zoom-animated"), this.options.className && N(e, this.options.className), e.onselectstart = lt, e.onmousemove = lt, e.onloadeddata = q(this.fire, this, "load"), t) {
            for (var i = e.getElementsByTagName("source"), n = [], a = 0; a < i.length; a++)
              n.push(i[a].src);
            this._url = i.length > 0 ? n : [e.src];
            return;
          }
          Bt(this._url) || (this._url = [this._url]), !this.options.keepAspectRatio && Object.prototype.hasOwnProperty.call(e.style, "objectFit") && (e.style.objectFit = "fill"), e.autoplay = !!this.options.autoplay, e.loop = !!this.options.loop, e.muted = !!this.options.muted, e.playsInline = !!this.options.playsInline;
          for (var l = 0; l < this._url.length; l++) {
            var h = V("source");
            h.src = this._url[l], e.appendChild(h);
          }
        }
        // @method getElement(): HTMLVideoElement
        // Returns the instance of [`HTMLVideoElement`](https://developer.mozilla.org/docs/Web/API/HTMLVideoElement)
        // used by this overlay.
      });
      function Qo(t, e, i) {
        return new to(t, e, i);
      }
      var eo = un.extend({
        _initImage: function() {
          var t = this._image = this._url;
          N(t, "leaflet-image-layer"), this._zoomAnimated && N(t, "leaflet-zoom-animated"), this.options.className && N(t, this.options.className), t.onselectstart = lt, t.onmousemove = lt;
        }
        // @method getElement(): SVGElement
        // Returns the instance of [`SVGElement`](https://developer.mozilla.org/docs/Web/API/SVGElement)
        // used by this overlay.
      });
      function ta(t, e, i) {
        return new eo(t, e, i);
      }
      var ne = qt.extend({
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
          t && (t instanceof B || Bt(t)) ? (this._latlng = O(t), et(this, e)) : (et(this, t), this._source = e), this.options.content && (this._content = this.options.content);
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
          this._zoomAnimated = t._zoomAnimated, this._container || this._initLayout(), t._fadeAnimated && Tt(this._container, 0), clearTimeout(this._removeTimeout), this.getPane().appendChild(this._container), this.update(), t._fadeAnimated && Tt(this._container, 1), this.bringToFront(), this.options.interactive && (N(this._container, "leaflet-interactive"), this.addInteractiveTarget(this._container));
        },
        onRemove: function(t) {
          t._fadeAnimated ? (Tt(this._container, 0), this._removeTimeout = setTimeout(q(X, void 0, this._container), 200)) : X(this._container), this.options.interactive && (ct(this._container, "leaflet-interactive"), this.removeInteractiveTarget(this._container));
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
          return this._latlng = O(t), this._map && (this._updatePosition(), this._adjustPan()), this;
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
          return this._map && be(this._container), this;
        },
        // @method bringToBack: this
        // Brings this overlay to the back of other overlays (in the same map pane).
        bringToBack: function() {
          return this._map && we(this._container), this;
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
            var t = this._map.latLngToLayerPoint(this._latlng), e = M(this.options.offset), i = this._getAnchor();
            this._zoomAnimated ? ht(this._container, t.add(i)) : e = e.add(t).add(i);
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
      }), qt.include({
        _initOverlay: function(t, e, i, n) {
          var a = i;
          return a instanceof t ? (et(a, n), a._source = this) : (a = e && !n ? e : new t(n, this), a.setContent(i)), a;
        }
      });
      var cn = ne.extend({
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
          return t = arguments.length ? t : this._source._map, !t.hasLayer(this) && t._popup && t._popup.options.autoClose && t.removeLayer(t._popup), t._popup = this, ne.prototype.openOn.call(this, t);
        },
        onAdd: function(t) {
          ne.prototype.onAdd.call(this, t), t.fire("popupopen", { popup: this }), this._source && (this._source.fire("popupopen", { popup: this }, !0), this._source instanceof Te || this._source.on("preclick", ee));
        },
        onRemove: function(t) {
          ne.prototype.onRemove.call(this, t), t.fire("popupclose", { popup: this }), this._source && (this._source.fire("popupclose", { popup: this }, !0), this._source instanceof Te || this._source.off("preclick", ee));
        },
        getEvents: function() {
          var t = ne.prototype.getEvents.call(this);
          return (this.options.closeOnClick !== void 0 ? this.options.closeOnClick : this._map.options.closePopupOnClick) && (t.preclick = this.close), this.options.keepInView && (t.moveend = this._adjustPan), t;
        },
        _initLayout: function() {
          var t = "leaflet-popup", e = this._container = V(
            "div",
            t + " " + (this.options.className || "") + " leaflet-zoom-animated"
          ), i = this._wrapper = V("div", t + "-content-wrapper", e);
          if (this._contentNode = V("div", t + "-content", i), Pe(e), ui(this._contentNode), r(e, "contextmenu", ee), this._tipContainer = V("div", t + "-tip-container", e), this._tip = V("div", t + "-tip", this._tipContainer), this.options.closeButton) {
            var n = this._closeButton = V("a", t + "-close-button", e);
            n.setAttribute("role", "button"), n.setAttribute("aria-label", "Close popup"), n.href = "#close", n.innerHTML = '<span aria-hidden="true">&#215;</span>', r(n, "click", function(a) {
              m(a), this.close();
            }, this);
          }
        },
        _updateLayout: function() {
          var t = this._contentNode, e = t.style;
          e.width = "", e.whiteSpace = "nowrap";
          var i = t.offsetWidth;
          i = Math.min(i, this.options.maxWidth), i = Math.max(i, this.options.minWidth), e.width = i + 1 + "px", e.whiteSpace = "", e.height = "";
          var n = t.offsetHeight, a = this.options.maxHeight, l = "leaflet-popup-scrolled";
          a && n > a ? (e.height = a + "px", N(t, l)) : ct(t, l), this._containerWidth = this._container.offsetWidth;
        },
        _animateZoom: function(t) {
          var e = this._map._latLngToNewLayerPoint(this._latlng, t.zoom, t.center), i = this._getAnchor();
          ht(this._container, e.add(i));
        },
        _adjustPan: function() {
          if (this.options.autoPan) {
            if (this._map._panAnim && this._map._panAnim.stop(), this._autopanning) {
              this._autopanning = !1;
              return;
            }
            var t = this._map, e = parseInt(Ze(this._container, "marginBottom"), 10) || 0, i = this._container.offsetHeight + e, n = this._containerWidth, a = new I(this._containerLeft, -i - this._containerBottom);
            a._add(Qt(this._container));
            var l = t.layerPointToContainerPoint(a), h = M(this.options.autoPanPadding), f = M(this.options.autoPanPaddingTopLeft || h), p = M(this.options.autoPanPaddingBottomRight || h), v = t.getSize(), P = 0, A = 0;
            l.x + n + p.x > v.x && (P = l.x + n - v.x + p.x), l.x - P - f.x < 0 && (P = l.x - f.x), l.y + i + p.y > v.y && (A = l.y + i - v.y + p.y), l.y - A - f.y < 0 && (A = l.y - f.y), (P || A) && (this.options.keepInView && (this._autopanning = !0), t.fire("autopanstart").panBy([P, A]));
          }
        },
        _getAnchor: function() {
          return M(this._source && this._source._getPopupAnchor ? this._source._getPopupAnchor() : [0, 0]);
        }
      }), ea = function(t, e) {
        return new cn(t, e);
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
          return this._initOverlay(cn, t, e, i).openOn(this), this;
        },
        // @method closePopup(popup?: Popup): this
        // Closes the popup previously opened with [openPopup](#map-openpopup) (or the given one).
        closePopup: function(t) {
          return t = arguments.length ? t : this._popup, t && t.close(), this;
        }
      }), qt.include({
        // @method bindPopup(content: String|HTMLElement|Function|Popup, options?: Popup options): this
        // Binds a popup to the layer with the passed `content` and sets up the
        // necessary event listeners. If a `Function` is passed it will receive
        // the layer as the first argument and should return a `String` or `HTMLElement`.
        bindPopup: function(t, e) {
          return this._popup = this._initOverlay(cn, this._popup, t, e), this._popupHandlersAdded || (this.on({
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
            F(t);
            var e = t.layer || t.target;
            if (this._popup._source === e && !(e instanceof Te)) {
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
      var hn = ne.extend({
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
          ne.prototype.onAdd.call(this, t), this.setOpacity(this.options.opacity), t.fire("tooltipopen", { tooltip: this }), this._source && (this.addEventParent(this._source), this._source.fire("tooltipopen", { tooltip: this }, !0));
        },
        onRemove: function(t) {
          ne.prototype.onRemove.call(this, t), t.fire("tooltipclose", { tooltip: this }), this._source && (this.removeEventParent(this._source), this._source.fire("tooltipclose", { tooltip: this }, !0));
        },
        getEvents: function() {
          var t = ne.prototype.getEvents.call(this);
          return this.options.permanent || (t.preclick = this.close), t;
        },
        _initLayout: function() {
          var t = "leaflet-tooltip", e = t + " " + (this.options.className || "") + " leaflet-zoom-" + (this._zoomAnimated ? "animated" : "hide");
          this._contentNode = this._container = V("div", e), this._container.setAttribute("role", "tooltip"), this._container.setAttribute("id", "leaflet-tooltip-" + U(this));
        },
        _updateLayout: function() {
        },
        _adjustPan: function() {
        },
        _setPosition: function(t) {
          var e, i, n = this._map, a = this._container, l = n.latLngToContainerPoint(n.getCenter()), h = n.layerPointToContainerPoint(t), f = this.options.direction, p = a.offsetWidth, v = a.offsetHeight, P = M(this.options.offset), A = this._getAnchor();
          f === "top" ? (e = p / 2, i = v) : f === "bottom" ? (e = p / 2, i = 0) : f === "center" ? (e = p / 2, i = v / 2) : f === "right" ? (e = 0, i = v / 2) : f === "left" ? (e = p, i = v / 2) : h.x < l.x ? (f = "right", e = 0, i = v / 2) : (f = "left", e = p + (P.x + A.x) * 2, i = v / 2), t = t.subtract(M(e, i, !0)).add(P).add(A), ct(a, "leaflet-tooltip-right"), ct(a, "leaflet-tooltip-left"), ct(a, "leaflet-tooltip-top"), ct(a, "leaflet-tooltip-bottom"), N(a, "leaflet-tooltip-" + f), ht(a, t);
        },
        _updatePosition: function() {
          var t = this._map.latLngToLayerPoint(this._latlng);
          this._setPosition(t);
        },
        setOpacity: function(t) {
          this.options.opacity = t, this._container && Tt(this._container, t);
        },
        _animateZoom: function(t) {
          var e = this._map._latLngToNewLayerPoint(this._latlng, t.zoom, t.center);
          this._setPosition(e);
        },
        _getAnchor: function() {
          return M(this._source && this._source._getTooltipAnchor && !this.options.sticky ? this._source._getTooltipAnchor() : [0, 0]);
        }
      }), ia = function(t, e) {
        return new hn(t, e);
      };
      K.include({
        // @method openTooltip(tooltip: Tooltip): this
        // Opens the specified tooltip.
        // @alternative
        // @method openTooltip(content: String|HTMLElement, latlng: LatLng, options?: Tooltip options): this
        // Creates a tooltip with the specified content and options and open it.
        openTooltip: function(t, e, i) {
          return this._initOverlay(hn, t, e, i).openOn(this), this;
        },
        // @method closeTooltip(tooltip: Tooltip): this
        // Closes the tooltip given as parameter.
        closeTooltip: function(t) {
          return t.close(), this;
        }
      }), qt.include({
        // @method bindTooltip(content: String|HTMLElement|Function|Tooltip, options?: Tooltip options): this
        // Binds a tooltip to the layer with the passed `content` and sets up the
        // necessary event listeners. If a `Function` is passed it will receive
        // the layer as the first argument and should return a `String` or `HTMLElement`.
        bindTooltip: function(t, e) {
          return this._tooltip && this.isTooltipOpen() && this.unbindTooltip(), this._tooltip = this._initOverlay(hn, this._tooltip, t, e), this._initTooltipInteractions(), this._tooltip.options.permanent && this._map && this._map.hasLayer(this) && this.openTooltip(), this;
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
          e && (r(e, "focus", function() {
            this._tooltip._source = t, this.openTooltip();
          }, this), r(e, "blur", this.closeTooltip, this));
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
      var io = hi.extend({
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
          if (i.html instanceof Element ? (ai(e), e.appendChild(i.html)) : e.innerHTML = i.html !== !1 ? i.html : "", i.bgPos) {
            var n = M(i.bgPos);
            e.style.backgroundPosition = -n.x + "px " + -n.y + "px";
          }
          return this._setIconStyles(e, "icon"), e;
        },
        createShadow: function() {
          return null;
        }
      });
      function na(t) {
        return new io(t);
      }
      hi.Default = Di;
      var Ri = qt.extend({
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
          updateWhenIdle: T.mobile,
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
          et(this, t);
        },
        onAdd: function() {
          this._initContainer(), this._levels = {}, this._tiles = {}, this._resetView();
        },
        beforeAdd: function(t) {
          t._addZoomLimit(this);
        },
        onRemove: function(t) {
          this._removeAllTiles(), X(this._container), t._removeZoomLimit(this), this._container = null, this._tileZoom = void 0;
        },
        // @method bringToFront: this
        // Brings the tile layer to the top of all tile layers.
        bringToFront: function() {
          return this._map && (be(this._container), this._setAutoZIndex(Math.max)), this;
        },
        // @method bringToBack: this
        // Brings the tile layer to the bottom of all tile layers.
        bringToBack: function() {
          return this._map && (we(this._container), this._setAutoZIndex(Math.min)), this;
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
          return this.options.updateWhenIdle || (this._onMove || (this._onMove = Mt(this._onMoveEnd, this.options.updateInterval, this)), t.move = this._onMove), this._zoomAnimated && (t.zoomanim = this._animateZoom), t;
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
          return t instanceof I ? t : new I(t, t);
        },
        _updateZIndex: function() {
          this._container && this.options.zIndex !== void 0 && this.options.zIndex !== null && (this._container.style.zIndex = this.options.zIndex);
        },
        _setAutoZIndex: function(t) {
          for (var e = this.getPane().children, i = -t(-1 / 0, 1 / 0), n = 0, a = e.length, l; n < a; n++)
            l = e[n].style.zIndex, e[n] !== this._container && l && (i = t(i, +l));
          isFinite(i) && (this.options.zIndex = i + t(-1, 1), this._updateZIndex());
        },
        _updateOpacity: function() {
          if (this._map && !T.ielt9) {
            Tt(this._container, this.options.opacity);
            var t = +/* @__PURE__ */ new Date(), e = !1, i = !1;
            for (var n in this._tiles) {
              var a = this._tiles[n];
              if (!(!a.current || !a.loaded)) {
                var l = Math.min(1, (t - a.loaded) / 200);
                Tt(a.el, l), l < 1 ? e = !0 : (a.active ? i = !0 : this._onOpaqueTile(a), a.active = !0);
              }
            }
            i && !this._noPrune && this._pruneTiles(), e && (Zt(this._fadeFrame), this._fadeFrame = kt(this._updateOpacity, this));
          }
        },
        _onOpaqueTile: lt,
        _initContainer: function() {
          this._container || (this._container = V("div", "leaflet-layer " + (this.options.className || "")), this._updateZIndex(), this.options.opacity < 1 && this._updateOpacity(), this.getPane().appendChild(this._container));
        },
        _updateLevels: function() {
          var t = this._tileZoom, e = this.options.maxZoom;
          if (t !== void 0) {
            for (var i in this._levels)
              i = Number(i), this._levels[i].el.children.length || i === t ? (this._levels[i].el.style.zIndex = e - Math.abs(t - i), this._onUpdateLevel(i)) : (X(this._levels[i].el), this._removeTilesAtZoom(i), this._onRemoveLevel(i), delete this._levels[i]);
            var n = this._levels[t], a = this._map;
            return n || (n = this._levels[t] = {}, n.el = V("div", "leaflet-tile-container leaflet-zoom-animated", this._container), n.el.style.zIndex = e, n.origin = a.project(a.unproject(a.getPixelOrigin()), t).round(), n.zoom = t, this._setZoomTransform(n, a.getCenter(), a.getZoom()), lt(n.el.offsetWidth), this._onCreateLevel(n)), this._level = n, n;
          }
        },
        _onUpdateLevel: lt,
        _onRemoveLevel: lt,
        _onCreateLevel: lt,
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
            X(this._levels[t].el), this._onRemoveLevel(Number(t)), delete this._levels[t];
          this._removeAllTiles(), this._tileZoom = void 0;
        },
        _retainParent: function(t, e, i, n) {
          var a = Math.floor(t / 2), l = Math.floor(e / 2), h = i - 1, f = new I(+a, +l);
          f.z = +h;
          var p = this._tileCoordsToKey(f), v = this._tiles[p];
          return v && v.active ? (v.retain = !0, !0) : (v && v.loaded && (v.retain = !0), h > n ? this._retainParent(a, l, h, n) : !1);
        },
        _retainChildren: function(t, e, i, n) {
          for (var a = 2 * t; a < 2 * t + 2; a++)
            for (var l = 2 * e; l < 2 * e + 2; l++) {
              var h = new I(a, l);
              h.z = i + 1;
              var f = this._tileCoordsToKey(h), p = this._tiles[f];
              if (p && p.active) {
                p.retain = !0;
                continue;
              } else p && p.loaded && (p.retain = !0);
              i + 1 < n && this._retainChildren(a, l, i + 1, n);
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
          var l = this.options.updateWhenZooming && a !== this._tileZoom;
          (!n || l) && (this._tileZoom = a, this._abortLoading && this._abortLoading(), this._updateLevels(), this._resetGrid(), a !== void 0 && this._update(t), i || this._pruneTiles(), this._noPrune = !!i), this._setZoomTransforms(t, e);
        },
        _setZoomTransforms: function(t, e) {
          for (var i in this._levels)
            this._setZoomTransform(this._levels[i], t, e);
        },
        _setZoomTransform: function(t, e, i) {
          var n = this._map.getZoomScale(i, t.zoom), a = t.origin.multiplyBy(n).subtract(this._map._getNewPixelOrigin(e, i)).round();
          T.any3d ? Gt(t.el, a, n) : ht(t.el, a);
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
          var e = this._map, i = e._animatingZoom ? Math.max(e._animateToZoom, e.getZoom()) : e.getZoom(), n = e.getZoomScale(i, this._tileZoom), a = e.project(t, this._tileZoom).floor(), l = e.getSize().divideBy(n * 2);
          return new it(a.subtract(l), a.add(l));
        },
        // Private method to load tiles in the grid's active zoom level according to map bounds
        _update: function(t) {
          var e = this._map;
          if (e) {
            var i = this._clampZoom(e.getZoom());
            if (t === void 0 && (t = e.getCenter()), this._tileZoom !== void 0) {
              var n = this._getTiledPixelBounds(t), a = this._pxBoundsToTileRange(n), l = a.getCenter(), h = [], f = this.options.keepBuffer, p = new it(
                a.getBottomLeft().subtract([f, -f]),
                a.getTopRight().add([f, -f])
              );
              if (!(isFinite(a.min.x) && isFinite(a.min.y) && isFinite(a.max.x) && isFinite(a.max.y)))
                throw new Error("Attempted to load an infinite number of tiles");
              for (var v in this._tiles) {
                var P = this._tiles[v].coords;
                (P.z !== this._tileZoom || !p.contains(new I(P.x, P.y))) && (this._tiles[v].current = !1);
              }
              if (Math.abs(i - this._tileZoom) > 1) {
                this._setView(t, i);
                return;
              }
              for (var A = a.min.y; A <= a.max.y; A++)
                for (var H = a.min.x; H <= a.max.x; H++) {
                  var Ot = new I(H, A);
                  if (Ot.z = this._tileZoom, !!this._isValidTile(Ot)) {
                    var wt = this._tiles[this._tileCoordsToKey(Ot)];
                    wt ? wt.current = !0 : h.push(Ot);
                  }
                }
              if (h.sort(function(It, mi) {
                return It.distanceTo(l) - mi.distanceTo(l);
              }), h.length !== 0) {
                this._loading || (this._loading = !0, this.fire("loading"));
                var Ft = document.createDocumentFragment();
                for (H = 0; H < h.length; H++)
                  this._addTile(h[H], Ft);
                this._level.el.appendChild(Ft);
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
          return nt(this.options.bounds).overlaps(n);
        },
        _keyToBounds: function(t) {
          return this._tileCoordsToBounds(this._keyToTileCoords(t));
        },
        _tileCoordsToNwSe: function(t) {
          var e = this._map, i = this.getTileSize(), n = t.scaleBy(i), a = n.add(i), l = e.unproject(n, t.z), h = e.unproject(a, t.z);
          return [l, h];
        },
        // converts tile coordinates to its geographical bounds
        _tileCoordsToBounds: function(t) {
          var e = this._tileCoordsToNwSe(t), i = new Pt(e[0], e[1]);
          return this.options.noWrap || (i = this._map.wrapLatLngBounds(i)), i;
        },
        // converts tile coordinates to key for the tile cache
        _tileCoordsToKey: function(t) {
          return t.x + ":" + t.y + ":" + t.z;
        },
        // converts tile cache key to coordinates
        _keyToTileCoords: function(t) {
          var e = t.split(":"), i = new I(+e[0], +e[1]);
          return i.z = +e[2], i;
        },
        _removeTile: function(t) {
          var e = this._tiles[t];
          e && (X(e.el), delete this._tiles[t], this.fire("tileunload", {
            tile: e.el,
            coords: this._keyToTileCoords(t)
          }));
        },
        _initTile: function(t) {
          N(t, "leaflet-tile");
          var e = this.getTileSize();
          t.style.width = e.x + "px", t.style.height = e.y + "px", t.onselectstart = lt, t.onmousemove = lt, T.ielt9 && this.options.opacity < 1 && Tt(t, this.options.opacity);
        },
        _addTile: function(t, e) {
          var i = this._getTilePos(t), n = this._tileCoordsToKey(t), a = this.createTile(this._wrapCoords(t), q(this._tileReady, this, t));
          this._initTile(a), this.createTile.length < 2 && kt(q(this._tileReady, this, t, null, a)), ht(a, i), this._tiles[n] = {
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
          i = this._tiles[n], i && (i.loaded = +/* @__PURE__ */ new Date(), this._map._fadeAnimated ? (Tt(i.el, 0), Zt(this._fadeFrame), this._fadeFrame = kt(this._updateOpacity, this)) : (i.active = !0, this._pruneTiles()), e || (N(i.el, "leaflet-tile-loaded"), this.fire("tileload", {
            tile: i.el,
            coords: t
          })), this._noTilesToLoad() && (this._loading = !1, this.fire("load"), T.ielt9 || !this._map._fadeAnimated ? kt(this._pruneTiles, this) : setTimeout(q(this._pruneTiles, this), 250)));
        },
        _getTilePos: function(t) {
          return t.scaleBy(this.getTileSize()).subtract(this._level.origin);
        },
        _wrapCoords: function(t) {
          var e = new I(
            this._wrapX ? ae(t.x, this._wrapX) : t.x,
            this._wrapY ? ae(t.y, this._wrapY) : t.y
          );
          return e.z = t.z, e;
        },
        _pxBoundsToTileRange: function(t) {
          var e = this.getTileSize();
          return new it(
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
      function oa(t) {
        return new Ri(t);
      }
      var pi = Ri.extend({
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
          this._url = t, e = et(this, e), e.detectRetina && T.retina && e.maxZoom > 0 ? (e.tileSize = Math.floor(e.tileSize / 2), e.zoomReverse ? (e.zoomOffset--, e.minZoom = Math.min(e.maxZoom, e.minZoom + 1)) : (e.zoomOffset++, e.maxZoom = Math.max(e.minZoom, e.maxZoom - 1)), e.minZoom = Math.max(0, e.minZoom)) : e.zoomReverse ? e.minZoom = Math.min(e.maxZoom, e.minZoom) : e.maxZoom = Math.max(e.minZoom, e.maxZoom), typeof e.subdomains == "string" && (e.subdomains = e.subdomains.split("")), this.on("tileunload", this._onTileRemove);
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
          return r(i, "load", q(this._tileOnLoad, this, e, i)), r(i, "error", q(this._tileOnError, this, e, i)), (this.options.crossOrigin || this.options.crossOrigin === "") && (i.crossOrigin = this.options.crossOrigin === !0 ? "" : this.options.crossOrigin), typeof this.options.referrerPolicy == "string" && (i.referrerPolicy = this.options.referrerPolicy), i.alt = "", i.src = this.getTileUrl(t), i;
        },
        // @section Extension methods
        // @uninheritable
        // Layers extending `TileLayer` might reimplement the following method.
        // @method getTileUrl(coords: Object): String
        // Called only internally, returns the URL for a tile given its coordinates.
        // Classes extending `TileLayer` can override this function to provide custom tile URL naming schemes.
        getTileUrl: function(t) {
          var e = {
            r: T.retina ? "@2x" : "",
            s: this._getSubdomain(t),
            x: t.x,
            y: t.y,
            z: this._getZoomForUrl()
          };
          if (this._map && !this._map.options.crs.infinite) {
            var i = this._globalTileRange.max.y - t.y;
            this.options.tms && (e.y = i), e["-y"] = i;
          }
          return vi(this._url, J(e, this.options));
        },
        _tileOnLoad: function(t, e) {
          T.ielt9 ? setTimeout(q(t, this, null, e), 0) : t(null, e);
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
            if (this._tiles[t].coords.z !== this._tileZoom && (e = this._tiles[t].el, e.onload = lt, e.onerror = lt, !e.complete)) {
              e.src = Ve;
              var i = this._tiles[t].coords;
              X(e), delete this._tiles[t], this.fire("tileabort", {
                tile: e,
                coords: i
              });
            }
        },
        _removeTile: function(t) {
          var e = this._tiles[t];
          if (e)
            return e.el.setAttribute("src", Ve), Ri.prototype._removeTile.call(this, t);
        },
        _tileReady: function(t, e, i) {
          if (!(!this._map || i && i.getAttribute("src") === Ve))
            return Ri.prototype._tileReady.call(this, t, e, i);
        }
      });
      function no(t, e) {
        return new pi(t, e);
      }
      var oo = pi.extend({
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
          var i = J({}, this.defaultWmsParams);
          for (var n in e)
            n in this.options || (i[n] = e[n]);
          e = et(this, e);
          var a = e.detectRetina && T.retina ? 2 : 1, l = this.getTileSize();
          i.width = l.x * a, i.height = l.y * a, this.wmsParams = i;
        },
        onAdd: function(t) {
          this._crs = this.options.crs || t.options.crs, this._wmsVersion = parseFloat(this.wmsParams.version);
          var e = this._wmsVersion >= 1.3 ? "crs" : "srs";
          this.wmsParams[e] = this._crs.code, pi.prototype.onAdd.call(this, t);
        },
        getTileUrl: function(t) {
          var e = this._tileCoordsToNwSe(t), i = this._crs, n = xt(i.project(e[0]), i.project(e[1])), a = n.min, l = n.max, h = (this._wmsVersion >= 1.3 && this._crs === Yn ? [a.y, a.x, l.y, l.x] : [a.x, a.y, l.x, l.y]).join(","), f = pi.prototype.getTileUrl.call(this, t);
          return f + Wi(this.wmsParams, f, this.options.uppercase) + (this.options.uppercase ? "&BBOX=" : "&bbox=") + h;
        },
        // @method setParams(params: Object, noRedraw?: Boolean): this
        // Merges an object with the new parameters and re-requests tiles on the current screen (unless `noRedraw` was set to true).
        setParams: function(t, e) {
          return J(this.wmsParams, t), e || this.redraw(), this;
        }
      });
      function aa(t, e) {
        return new oo(t, e);
      }
      pi.WMS = oo, no.wms = aa;
      var he = qt.extend({
        // @section
        // @aka Renderer options
        options: {
          // @option padding: Number = 0.1
          // How much to extend the clip area around the map view (relative to its size)
          // e.g. 0.1 would be 10% of map view in each direction
          padding: 0.1
        },
        initialize: function(t) {
          et(this, t), U(this), this._layers = this._layers || {};
        },
        onAdd: function() {
          this._container || (this._initContainer(), N(this._container, "leaflet-zoom-animated")), this.getPane().appendChild(this._container), this._update(), this.on("update", this._updatePaths, this);
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
          var i = this._map.getZoomScale(e, this._zoom), n = this._map.getSize().multiplyBy(0.5 + this.options.padding), a = this._map.project(this._center, e), l = n.multiplyBy(-i).add(a).subtract(this._map._getNewPixelOrigin(t, e));
          T.any3d ? Gt(this._container, l, i) : ht(this._container, l);
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
          this._bounds = new it(i, i.add(e.multiplyBy(1 + t * 2)).round()), this._center = this._map.getCenter(), this._zoom = this._map.getZoom();
        }
      }), ao = he.extend({
        // @section
        // @aka Canvas options
        options: {
          // @option tolerance: Number = 0
          // How much to extend the click tolerance around a path/object on the map.
          tolerance: 0
        },
        getEvents: function() {
          var t = he.prototype.getEvents.call(this);
          return t.viewprereset = this._onViewPreReset, t;
        },
        _onViewPreReset: function() {
          this._postponeUpdatePaths = !0;
        },
        onAdd: function() {
          he.prototype.onAdd.call(this), this._draw();
        },
        _initContainer: function() {
          var t = this._container = document.createElement("canvas");
          r(t, "mousemove", this._onMouseMove, this), r(t, "click dblclick mousedown mouseup contextmenu", this._onClick, this), r(t, "mouseout", this._handleMouseOut, this), t._leaflet_disable_events = !0, this._ctx = t.getContext("2d");
        },
        _destroyContainer: function() {
          Zt(this._redrawRequest), delete this._ctx, X(this._container), x(this._container), delete this._container;
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
            he.prototype._update.call(this);
            var t = this._bounds, e = this._container, i = t.getSize(), n = T.retina ? 2 : 1;
            ht(e, t.min), e.width = n * i.x, e.height = n * i.y, e.style.width = i.x + "px", e.style.height = i.y + "px", T.retina && this._ctx.scale(2, 2), this._ctx.translate(-t.min.x, -t.min.y), this.fire("update");
          }
        },
        _reset: function() {
          he.prototype._reset.call(this), this._postponeUpdatePaths && (this._postponeUpdatePaths = !1, this._updatePaths());
        },
        _initPath: function(t) {
          this._updateDashArray(t), this._layers[U(t)] = t;
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
          i ? i.prev = n : this._drawLast = n, n ? n.next = i : this._drawFirst = i, delete t._order, delete this._layers[U(t)], this._requestRedraw(t);
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
          this._map && (this._extendRedrawBounds(t), this._redrawRequest = this._redrawRequest || kt(this._redraw, this));
        },
        _extendRedrawBounds: function(t) {
          if (t._pxBounds) {
            var e = (t.options.weight || 0) + 1;
            this._redrawBounds = this._redrawBounds || new it(), this._redrawBounds.extend(t._pxBounds.min.subtract([e, e])), this._redrawBounds.extend(t._pxBounds.max.add([e, e]));
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
            var i, n, a, l, h = t._parts, f = h.length, p = this._ctx;
            if (f) {
              for (p.beginPath(), i = 0; i < f; i++) {
                for (n = 0, a = h[i].length; n < a; n++)
                  l = h[i][n], p[n ? "lineTo" : "moveTo"](l.x, l.y);
                e && p.closePath();
              }
              this._fillStroke(p, t);
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
          e && (ct(this._container, "leaflet-interactive"), this._fireEvent([e], t, "mouseout"), this._hoveredLayer = null, this._mouseHoverThrottled = !1);
        },
        _handleMouseHover: function(t, e) {
          if (!this._mouseHoverThrottled) {
            for (var i, n, a = this._drawFirst; a; a = a.next)
              i = a.layer, i.options.interactive && i._containsPoint(e) && (n = i);
            n !== this._hoveredLayer && (this._handleMouseOut(t), n && (N(this._container, "leaflet-interactive"), this._fireEvent([n], t, "mouseover"), this._hoveredLayer = n)), this._fireEvent(this._hoveredLayer ? [this._hoveredLayer] : !1, t), this._mouseHoverThrottled = !0, setTimeout(q(function() {
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
        return T.canvas ? new ao(t) : null;
      }
      var Vi = (function() {
        try {
          return document.namespaces.add("lvml", "urn:schemas-microsoft-com:vml"), function(t) {
            return document.createElement("<lvml:" + t + ' class="lvml">');
          };
        } catch {
        }
        return function(t) {
          return document.createElement("<" + t + ' xmlns="urn:schemas-microsoft.com:vml" class="lvml">');
        };
      })(), sa = {
        _initContainer: function() {
          this._container = V("div", "leaflet-vml-container");
        },
        _update: function() {
          this._map._animatingZoom || (he.prototype._update.call(this), this.fire("update"));
        },
        _initPath: function(t) {
          var e = t._container = Vi("shape");
          N(e, "leaflet-vml-shape " + (this.options.className || "")), e.coordsize = "1 1", t._path = Vi("path"), e.appendChild(t._path), this._updateStyle(t), this._layers[U(t)] = t;
        },
        _addPath: function(t) {
          var e = t._container;
          this._container.appendChild(e), t.options.interactive && t.addInteractiveTarget(e);
        },
        _removePath: function(t) {
          var e = t._container;
          X(e), t.removeInteractiveTarget(e), delete this._layers[U(t)];
        },
        _updateStyle: function(t) {
          var e = t._stroke, i = t._fill, n = t.options, a = t._container;
          a.stroked = !!n.stroke, a.filled = !!n.fill, n.stroke ? (e || (e = t._stroke = Vi("stroke")), a.appendChild(e), e.weight = n.weight + "px", e.color = n.color, e.opacity = n.opacity, n.dashArray ? e.dashStyle = Bt(n.dashArray) ? n.dashArray.join(" ") : n.dashArray.replace(/( *, *)/g, " ") : e.dashStyle = "", e.endcap = n.lineCap.replace("butt", "flat"), e.joinstyle = n.lineJoin) : e && (a.removeChild(e), t._stroke = null), n.fill ? (i || (i = t._fill = Vi("fill")), a.appendChild(i), i.color = n.fillColor || n.color, i.opacity = n.fillOpacity) : i && (a.removeChild(i), t._fill = null);
        },
        _updateCircle: function(t) {
          var e = t._point.round(), i = Math.round(t._radius), n = Math.round(t._radiusY || i);
          this._setPath(t, t._empty() ? "M0 0" : "AL " + e.x + "," + e.y + " " + i + "," + n + " 0," + 65535 * 360);
        },
        _setPath: function(t, e) {
          t._path.v = e;
        },
        _bringToFront: function(t) {
          be(t._container);
        },
        _bringToBack: function(t) {
          we(t._container);
        }
      }, dn = T.vml ? Vi : $i, Ui = he.extend({
        _initContainer: function() {
          this._container = dn("svg"), this._container.setAttribute("pointer-events", "none"), this._rootGroup = dn("g"), this._container.appendChild(this._rootGroup);
        },
        _destroyContainer: function() {
          X(this._container), x(this._container), delete this._container, delete this._rootGroup, delete this._svgSize;
        },
        _update: function() {
          if (!(this._map._animatingZoom && this._bounds)) {
            he.prototype._update.call(this);
            var t = this._bounds, e = t.getSize(), i = this._container;
            (!this._svgSize || !this._svgSize.equals(e)) && (this._svgSize = e, i.setAttribute("width", e.x), i.setAttribute("height", e.y)), ht(i, t.min), i.setAttribute("viewBox", [t.min.x, t.min.y, e.x, e.y].join(" ")), this.fire("update");
          }
        },
        // methods below are called by vector layers implementations
        _initPath: function(t) {
          var e = t._path = dn("path");
          t.options.className && N(e, t.options.className), t.options.interactive && N(e, "leaflet-interactive"), this._updateStyle(t), this._layers[U(t)] = t;
        },
        _addPath: function(t) {
          this._rootGroup || this._initContainer(), this._rootGroup.appendChild(t._path), t.addInteractiveTarget(t._path);
        },
        _removePath: function(t) {
          X(t._path), t.removeInteractiveTarget(t._path), delete this._layers[U(t)];
        },
        _updatePath: function(t) {
          t._project(), t._update();
        },
        _updateStyle: function(t) {
          var e = t._path, i = t.options;
          e && (i.stroke ? (e.setAttribute("stroke", i.color), e.setAttribute("stroke-opacity", i.opacity), e.setAttribute("stroke-width", i.weight), e.setAttribute("stroke-linecap", i.lineCap), e.setAttribute("stroke-linejoin", i.lineJoin), i.dashArray ? e.setAttribute("stroke-dasharray", i.dashArray) : e.removeAttribute("stroke-dasharray"), i.dashOffset ? e.setAttribute("stroke-dashoffset", i.dashOffset) : e.removeAttribute("stroke-dashoffset")) : e.setAttribute("stroke", "none"), i.fill ? (e.setAttribute("fill", i.fillColor || i.color), e.setAttribute("fill-opacity", i.fillOpacity), e.setAttribute("fill-rule", i.fillRule || "evenodd")) : e.setAttribute("fill", "none"));
        },
        _updatePoly: function(t, e) {
          this._setPath(t, ut(t._parts, e));
        },
        _updateCircle: function(t) {
          var e = t._point, i = Math.max(Math.round(t._radius), 1), n = Math.max(Math.round(t._radiusY), 1) || i, a = "a" + i + "," + n + " 0 1,0 ", l = t._empty() ? "M0 0" : "M" + (e.x - i) + "," + e.y + a + i * 2 + ",0 " + a + -i * 2 + ",0 ";
          this._setPath(t, l);
        },
        _setPath: function(t, e) {
          t._path.setAttribute("d", e);
        },
        // SVG does not have the concept of zIndex so we resort to changing the DOM order of elements
        _bringToFront: function(t) {
          be(t._path);
        },
        _bringToBack: function(t) {
          we(t._path);
        }
      });
      T.vml && Ui.include(sa);
      function ro(t) {
        return T.svg || T.vml ? new Ui(t) : null;
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
          return this.options.preferCanvas && so(t) || ro(t);
        }
      });
      var lo = di.extend({
        initialize: function(t, e) {
          di.prototype.initialize.call(this, this._boundsToLatLngs(t), e);
        },
        // @method setBounds(latLngBounds: LatLngBounds): this
        // Redraws the rectangle with the passed bounds.
        setBounds: function(t) {
          return this.setLatLngs(this._boundsToLatLngs(t));
        },
        _boundsToLatLngs: function(t) {
          return t = nt(t), [
            t.getSouthWest(),
            t.getNorthWest(),
            t.getNorthEast(),
            t.getSouthEast()
          ];
        }
      });
      function ra(t, e) {
        return new lo(t, e);
      }
      Ui.create = dn, Ui.pointsToPath = ut, ce.geometryToLayer = an, ce.coordsToLatLng = En, ce.coordsToLatLngs = sn, ce.latLngToCoords = An, ce.latLngsToCoords = rn, ce.getFeature = fi, ce.asFeature = ln, K.mergeOptions({
        // @option boxZoom: Boolean = true
        // Whether the map can be zoomed to a rectangular area specified by
        // dragging the mouse while pressing the shift key.
        boxZoom: !0
      });
      var uo = ie.extend({
        initialize: function(t) {
          this._map = t, this._container = t._container, this._pane = t._panes.overlayPane, this._resetStateTimeout = 0, t.on("unload", this._destroy, this);
        },
        addHooks: function() {
          r(this._container, "mousedown", this._onMouseDown, this);
        },
        removeHooks: function() {
          x(this._container, "mousedown", this._onMouseDown, this);
        },
        moved: function() {
          return this._moved;
        },
        _destroy: function() {
          X(this._pane), delete this._pane;
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
          this._clearDeferredResetState(), this._resetState(), _(), si(), this._startPoint = this._map.mouseEventToContainerPoint(t), r(document, {
            contextmenu: F,
            mousemove: this._onMouseMove,
            mouseup: this._onMouseUp,
            keydown: this._onKeyDown
          }, this);
        },
        _onMouseMove: function(t) {
          this._moved || (this._moved = !0, this._box = V("div", "leaflet-zoom-box", this._container), N(this._container, "leaflet-crosshair"), this._map.fire("boxzoomstart")), this._point = this._map.mouseEventToContainerPoint(t);
          var e = new it(this._point, this._startPoint), i = e.getSize();
          ht(this._box, e.min), this._box.style.width = i.x + "px", this._box.style.height = i.y + "px";
        },
        _finish: function() {
          this._moved && (X(this._box), ct(this._container, "leaflet-crosshair")), te(), Ai(), x(document, {
            contextmenu: F,
            mousemove: this._onMouseMove,
            mouseup: this._onMouseUp,
            keydown: this._onKeyDown
          }, this);
        },
        _onMouseUp: function(t) {
          if (!(t.which !== 1 && t.button !== 1) && (this._finish(), !!this._moved)) {
            this._clearDeferredResetState(), this._resetStateTimeout = setTimeout(q(this._resetState, this), 0);
            var e = new Pt(
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
      K.addInitHook("addHandler", "boxZoom", uo), K.mergeOptions({
        // @option doubleClickZoom: Boolean|String = true
        // Whether the map can be zoomed in by double clicking on it and
        // zoomed out by double clicking while holding shift. If passed
        // `'center'`, double-click zoom will zoom to the center of the
        //  view regardless of where the mouse was.
        doubleClickZoom: !0
      });
      var co = ie.extend({
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
      K.addInitHook("addHandler", "doubleClickZoom", co), K.mergeOptions({
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
      var ho = ie.extend({
        addHooks: function() {
          if (!this._draggable) {
            var t = this._map;
            this._draggable = new Le(t._mapPane, t._container), this._draggable.on({
              dragstart: this._onDragStart,
              drag: this._onDrag,
              dragend: this._onDragEnd
            }, this), this._draggable.on("predrag", this._onPreDragLimit, this), t.options.worldCopyJump && (this._draggable.on("predrag", this._onPreDragWrap, this), t.on("zoomend", this._onZoomEnd, this), t.whenReady(this._onZoomEnd, this));
          }
          N(this._map._container, "leaflet-grab leaflet-touch-drag"), this._draggable.enable(), this._positions = [], this._times = [];
        },
        removeHooks: function() {
          ct(this._map._container, "leaflet-grab"), ct(this._map._container, "leaflet-touch-drag"), this._draggable.disable();
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
            var e = nt(this._map.options.maxBounds);
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
          var t = this._worldWidth, e = Math.round(t / 2), i = this._initialWorldOffset, n = this._draggable._newPos.x, a = (n - e + i) % t + e - i, l = (n + e + i) % t - e - i, h = Math.abs(a + i) < Math.abs(l + i) ? a : l;
          this._draggable._absPos = this._draggable._newPos.clone(), this._draggable._newPos.x = h;
        },
        _onDragEnd: function(t) {
          var e = this._map, i = e.options, n = !i.inertia || t.noInertia || this._times.length < 2;
          if (e.fire("dragend", t), n)
            e.fire("moveend");
          else {
            this._prunePositions(+/* @__PURE__ */ new Date());
            var a = this._lastPos.subtract(this._positions[0]), l = (this._lastTime - this._times[0]) / 1e3, h = i.easeLinearity, f = a.multiplyBy(h / l), p = f.distanceTo([0, 0]), v = Math.min(i.inertiaMaxSpeed, p), P = f.multiplyBy(v / p), A = v / (i.inertiaDeceleration * h), H = P.multiplyBy(-A / 2).round();
            !H.x && !H.y ? e.fire("moveend") : (H = e._limitOffset(H, e.options.maxBounds), kt(function() {
              e.panBy(H, {
                duration: A,
                easeLinearity: h,
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
      var fo = ie.extend({
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
          t.tabIndex <= 0 && (t.tabIndex = "0"), r(t, {
            focus: this._onFocus,
            blur: this._onBlur,
            mousedown: this._onMouseDown
          }, this), this._map.on({
            focus: this._addHooks,
            blur: this._removeHooks
          }, this);
        },
        removeHooks: function() {
          this._removeHooks(), x(this._map._container, {
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
          r(document, "keydown", this._onKeyDown, this);
        },
        _removeHooks: function() {
          x(document, "keydown", this._onKeyDown, this);
        },
        _onKeyDown: function(t) {
          if (!(t.altKey || t.ctrlKey || t.metaKey)) {
            var e = t.keyCode, i = this._map, n;
            if (e in this._panKeys) {
              if (!i._panAnim || !i._panAnim._inProgress)
                if (n = this._panKeys[e], t.shiftKey && (n = M(n).multiplyBy(3)), i.options.maxBounds && (n = i._limitOffset(M(n), i.options.maxBounds)), i.options.worldCopyJump) {
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
            F(t);
          }
        }
      });
      K.addInitHook("addHandler", "keyboard", fo), K.mergeOptions({
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
      var po = ie.extend({
        addHooks: function() {
          r(this._map._container, "wheel", this._onWheelScroll, this), this._delta = 0;
        },
        removeHooks: function() {
          x(this._map._container, "wheel", this._onWheelScroll, this);
        },
        _onWheelScroll: function(t) {
          var e = dt(t), i = this._map.options.wheelDebounceTime;
          this._delta += e, this._lastMousePos = this._map.mouseEventToContainerPoint(t), this._startTime || (this._startTime = +/* @__PURE__ */ new Date());
          var n = Math.max(i - (+/* @__PURE__ */ new Date() - this._startTime), 0);
          clearTimeout(this._timer), this._timer = setTimeout(q(this._performZoom, this), n), F(t);
        },
        _performZoom: function() {
          var t = this._map, e = t.getZoom(), i = this._map.options.zoomSnap || 0;
          t._stop();
          var n = this._delta / (this._map.options.wheelPxPerZoomLevel * 4), a = 4 * Math.log(2 / (1 + Math.exp(-Math.abs(n)))) / Math.LN2, l = i ? Math.ceil(a / i) * i : a, h = t._limitZoom(e + (this._delta > 0 ? l : -l)) - e;
          this._delta = 0, this._startTime = null, h && (t.options.scrollWheelZoom === "center" ? t.setZoom(e + h) : t.setZoomAround(this._lastMousePos, e + h));
        }
      });
      K.addInitHook("addHandler", "scrollWheelZoom", po);
      var la = 600;
      K.mergeOptions({
        // @section Touch interaction options
        // @option tapHold: Boolean
        // Enables simulation of `contextmenu` event, default is `true` for mobile Safari.
        tapHold: T.touchNative && T.safari && T.mobile,
        // @option tapTolerance: Number = 15
        // The max number of pixels a user can shift his finger during touch
        // for it to be considered a valid tap.
        tapTolerance: 15
      });
      var mo = ie.extend({
        addHooks: function() {
          r(this._map._container, "touchstart", this._onDown, this);
        },
        removeHooks: function() {
          x(this._map._container, "touchstart", this._onDown, this);
        },
        _onDown: function(t) {
          if (clearTimeout(this._holdTimeout), t.touches.length === 1) {
            var e = t.touches[0];
            this._startPos = this._newPos = new I(e.clientX, e.clientY), this._holdTimeout = setTimeout(q(function() {
              this._cancel(), this._isTapValid() && (r(document, "touchend", m), r(document, "touchend touchcancel", this._cancelClickPrevent), this._simulateEvent("contextmenu", e));
            }, this), la), r(document, "touchend touchcancel contextmenu", this._cancel, this), r(document, "touchmove", this._onMove, this);
          }
        },
        _cancelClickPrevent: function t() {
          x(document, "touchend", m), x(document, "touchend touchcancel", t);
        },
        _cancel: function() {
          clearTimeout(this._holdTimeout), x(document, "touchend touchcancel contextmenu", this._cancel, this), x(document, "touchmove", this._onMove, this);
        },
        _onMove: function(t) {
          var e = t.touches[0];
          this._newPos = new I(e.clientX, e.clientY);
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
      K.addInitHook("addHandler", "tapHold", mo), K.mergeOptions({
        // @section Touch interaction options
        // @option touchZoom: Boolean|String = *
        // Whether the map can be zoomed by touch-dragging with two fingers. If
        // passed `'center'`, it will zoom to the center of the view regardless of
        // where the touch events (fingers) were. Enabled for touch-capable web
        // browsers.
        touchZoom: T.touch,
        // @option bounceAtZoomLimits: Boolean = true
        // Set it to false if you don't want the map to zoom beyond min/max zoom
        // and then bounce back when pinch-zooming.
        bounceAtZoomLimits: !0
      });
      var _o = ie.extend({
        addHooks: function() {
          N(this._map._container, "leaflet-touch-zoom"), r(this._map._container, "touchstart", this._onTouchStart, this);
        },
        removeHooks: function() {
          ct(this._map._container, "leaflet-touch-zoom"), x(this._map._container, "touchstart", this._onTouchStart, this);
        },
        _onTouchStart: function(t) {
          var e = this._map;
          if (!(!t.touches || t.touches.length !== 2 || e._animatingZoom || this._zooming)) {
            var i = e.mouseEventToContainerPoint(t.touches[0]), n = e.mouseEventToContainerPoint(t.touches[1]);
            this._centerPoint = e.getSize()._divideBy(2), this._startLatLng = e.containerPointToLatLng(this._centerPoint), e.options.touchZoom !== "center" && (this._pinchStartLatLng = e.containerPointToLatLng(i.add(n)._divideBy(2))), this._startDist = i.distanceTo(n), this._startZoom = e.getZoom(), this._moved = !1, this._zooming = !0, e._stop(), r(document, "touchmove", this._onTouchMove, this), r(document, "touchend touchcancel", this._onTouchEnd, this), m(t);
          }
        },
        _onTouchMove: function(t) {
          if (!(!t.touches || t.touches.length !== 2 || !this._zooming)) {
            var e = this._map, i = e.mouseEventToContainerPoint(t.touches[0]), n = e.mouseEventToContainerPoint(t.touches[1]), a = i.distanceTo(n) / this._startDist;
            if (this._zoom = e.getScaleZoom(a, this._startZoom), !e.options.bounceAtZoomLimits && (this._zoom < e.getMinZoom() && a < 1 || this._zoom > e.getMaxZoom() && a > 1) && (this._zoom = e._limitZoom(this._zoom)), e.options.touchZoom === "center") {
              if (this._center = this._startLatLng, a === 1)
                return;
            } else {
              var l = i._add(n)._divideBy(2)._subtract(this._centerPoint);
              if (a === 1 && l.x === 0 && l.y === 0)
                return;
              this._center = e.unproject(e.project(this._pinchStartLatLng, this._zoom).subtract(l), this._zoom);
            }
            this._moved || (e._moveStart(!0, !1), this._moved = !0), Zt(this._animRequest);
            var h = q(e._move, e, this._center, this._zoom, { pinch: !0, round: !1 }, void 0);
            this._animRequest = kt(h, this, !0), m(t);
          }
        },
        _onTouchEnd: function() {
          if (!this._moved || !this._zooming) {
            this._zooming = !1;
            return;
          }
          this._zooming = !1, Zt(this._animRequest), x(document, "touchmove", this._onTouchMove, this), x(document, "touchend touchcancel", this._onTouchEnd, this), this._map.options.zoomAnimation ? this._map._animateZoom(this._center, this._map._limitZoom(this._zoom), !0, this._map.options.zoomSnap) : this._map._resetView(this._center, this._map._limitZoom(this._zoom));
        }
      });
      K.addInitHook("addHandler", "touchZoom", _o), K.BoxZoom = uo, K.DoubleClickZoom = co, K.Drag = ho, K.Keyboard = fo, K.ScrollWheelZoom = po, K.TapHold = mo, K.TouchZoom = _o, s.Bounds = it, s.Browser = T, s.CRS = C, s.Canvas = ao, s.Circle = On, s.CircleMarker = on, s.Class = Ht, s.Control = jt, s.DivIcon = io, s.DivOverlay = ne, s.DomEvent = ko, s.DomUtil = d, s.Draggable = Le, s.Evented = ot, s.FeatureGroup = le, s.GeoJSON = ce, s.GridLayer = Ri, s.Handler = ie, s.Icon = hi, s.ImageOverlay = un, s.LatLng = B, s.LatLngBounds = Pt, s.Layer = qt, s.LayerGroup = ci, s.LineUtil = Ro, s.Map = K, s.Marker = nn, s.Mixin = Ao, s.Path = Te, s.Point = I, s.PolyUtil = Zo, s.Polygon = di, s.Polyline = ue, s.Popup = cn, s.PosAnimation = Dn, s.Projection = Vo, s.Rectangle = lo, s.Renderer = he, s.SVG = Ui, s.SVGOverlay = eo, s.TileLayer = pi, s.Tooltip = hn, s.Transformation = We, s.Util = qi, s.VideoOverlay = to, s.bind = q, s.bounds = xt, s.canvas = so, s.circle = Ko, s.circleMarker = qo, s.control = Bi, s.divIcon = na, s.extend = J, s.featureGroup = Wo, s.geoJSON = Qn, s.geoJson = Jo, s.gridLayer = oa, s.icon = Go, s.imageOverlay = Xo, s.latLng = O, s.latLngBounds = nt, s.layerGroup = Ho, s.map = So, s.marker = jo, s.point = M, s.polygon = Yo, s.polyline = $o, s.popup = ea, s.rectangle = ra, s.setOptions = et, s.stamp = U, s.svg = ro, s.svgOverlay = ta, s.tileLayer = no, s.tooltip = ia, s.transformation = pe, s.version = vt, s.videoOverlay = Qo;
      var ua = window.L;
      s.noConflict = function() {
        return window.L = ua, this;
      }, window.L = s;
    }));
  })(Hi, Hi.exports)), Hi.exports;
}
var Oa = za();
const z = /* @__PURE__ */ Ca(Oa), Ea = { class: "hero" }, Aa = { class: "hero-main" }, Za = { class: "hero-copy" }, Ia = { class: "sub" }, Ba = { class: "hero-actions" }, Na = ["disabled"], Da = ["disabled"], Ra = ["disabled"], Va = { class: "state-row" }, Ua = { class: "pill soft" }, Fa = { class: "pill soft" }, Ha = { class: "pill soft" }, Wa = {
  key: 0,
  class: "banner err"
}, Ga = {
  key: 1,
  class: "banner ok"
}, ja = ["aria-label"], qa = ["onClick"], Ka = { class: "tab-ic" }, $a = {
  "data-panel": "persona",
  class: "panel"
}, Ya = { class: "section-head" }, Ja = { class: "desc" }, Xa = { class: "head-actions" }, Qa = ["disabled"], ts = ["disabled"], es = { class: "card" }, is = { class: "settings-grid" }, ns = { class: "pfield" }, os = { class: "pfield" }, as = { class: "pfield" }, ss = { class: "pfield" }, rs = { class: "hint" }, ls = {
  key: 0,
  class: "card"
}, us = { class: "count-pill ok" }, cs = { class: "settings-grid" }, hs = { class: "hint" }, ds = {
  key: 0,
  class: "hint"
}, fs = { class: "settings-grid" }, ps = { class: "settings-grid" }, ms = { class: "pdetails" }, _s = {
  class: "settings-grid",
  style: { "margin-top": "10px" }
}, vs = { class: "settings-grid" }, gs = ["value"], ys = { class: "hint" }, bs = {
  key: 2,
  class: "hint"
}, ws = { class: "settings-grid" }, xs = ["value"], Ps = { class: "hint" }, Ls = {
  key: 4,
  class: "hint"
}, Ts = { class: "settings-grid" }, ks = ["value"], Ss = { class: "hint" }, Cs = {
  key: 6,
  class: "hint"
}, Ms = {
  "data-panel": "cognition",
  class: "panel"
}, zs = { class: "section-head" }, Os = { class: "desc" }, Es = { class: "head-actions" }, As = ["disabled"], Zs = { class: "card" }, Is = { class: "settings-grid" }, Bs = { class: "cog-metric" }, Ns = { class: "cog-metric" }, Ds = { class: "cog-metric" }, Rs = { class: "cog-metric" }, Vs = { class: "cog-metric" }, Us = { class: "cog-metric" }, Fs = {
  key: 0,
  class: "hint"
}, Hs = {
  key: 1,
  class: "hint"
}, Ws = {
  key: 2,
  class: "hint"
}, Gs = { style: { display: "flex", gap: "12px", "align-items": "center", "flex-wrap": "wrap", "margin-top": "10px" } }, js = { class: "sw" }, qs = ["disabled"], Ks = { class: "hint" }, $s = { class: "card" }, Ys = {
  key: 0,
  class: "count-pill sync-pill"
}, Js = {
  key: 0,
  class: "empty"
}, Xs = {
  key: 1,
  class: "settings-grid"
}, Qs = { class: "cog-metric" }, tr = { class: "cog-metric" }, er = { class: "cog-metric" }, ir = { class: "cog-metric" }, nr = { class: "cog-metric" }, or = { class: "cog-metric" }, ar = { class: "cog-metric" }, sr = { class: "cog-metric" }, rr = { class: "cog-metric" }, lr = { class: "cog-metric" }, ur = { class: "cog-metric" }, cr = { class: "cog-metric" }, hr = { class: "cog-metric" }, dr = { class: "cog-metric" }, fr = { class: "cog-metric" }, pr = { class: "cog-metric" }, mr = { class: "cog-metric" }, _r = { class: "cog-metric" }, vr = { class: "cog-metric" }, gr = { class: "cog-metric" }, yr = { class: "cog-metric" }, br = { class: "cog-metric" }, wr = { class: "cog-metric" }, xr = { class: "cog-metric" }, Pr = { class: "cog-metric" }, Lr = { class: "cog-metric" }, Tr = { class: "cog-metric" }, kr = { class: "cog-metric" }, Sr = { class: "cog-metric" }, Cr = { class: "cog-metric" }, Mr = { class: "cog-metric" }, zr = { class: "cog-metric" }, Or = { class: "cog-metric" }, Er = { class: "cog-metric" }, Ar = {
  key: 0,
  class: "cog-metric"
}, Zr = {
  key: 1,
  class: "cog-metric"
}, Ir = {
  key: 2,
  class: "cog-metric"
}, Br = {
  key: 3,
  class: "cog-metric"
}, Nr = {
  key: 4,
  class: "cog-metric"
}, Dr = {
  key: 5,
  class: "cog-metric"
}, Rr = {
  key: 6,
  class: "cog-metric"
}, Vr = {
  key: 7,
  class: "cog-metric"
}, Ur = {
  key: 8,
  class: "cog-metric"
}, Fr = {
  key: 9,
  class: "cog-metric warn"
}, Hr = { class: "cog-metric" }, Wr = { class: "cog-metric" }, Gr = { class: "cog-metric" }, jr = {
  key: 0,
  class: "cog-metric"
}, qr = {
  key: 2,
  class: "hint"
}, Kr = {
  key: 3,
  class: "hint"
}, $r = {
  key: 4,
  class: "hint"
}, Yr = {
  key: 5,
  class: "hint"
}, Jr = {
  key: 6,
  class: "hint"
}, Xr = {
  key: 7,
  class: "som-channels"
}, Qr = { class: "som-chan-name" }, tl = { class: "som-chan-bar" }, el = { class: "som-chan-val" }, il = {
  key: 0,
  class: "hint"
}, nl = { class: "card" }, ol = { class: "switches" }, al = { class: "sw" }, sl = { class: "sw" }, rl = { class: "sw" }, ll = { class: "sw" }, ul = { class: "sw" }, cl = { class: "sw" }, hl = { class: "hint" }, dl = { class: "card" }, fl = { class: "hint" }, pl = { class: "preset-row" }, ml = ["onClick"], _l = { class: "grid2" }, vl = { class: "card" }, gl = { class: "settings-grid" }, yl = { class: "switches" }, bl = { class: "sw" }, wl = { class: "sw" }, xl = { class: "sw" }, Pl = { class: "sw" }, Ll = { class: "sw" }, Tl = { class: "card" }, kl = { class: "settings-grid" }, Sl = { class: "sw" }, Cl = { class: "sw" }, Ml = { class: "sw" }, zl = { class: "card" }, Ol = { class: "settings-grid" }, El = { class: "sw" }, Al = { class: "card" }, Zl = { class: "settings-grid" }, Il = { class: "sw" }, Bl = { class: "card" }, Nl = { class: "settings-grid" }, Dl = { class: "sw" }, Rl = { class: "card" }, Vl = { class: "hint" }, Ul = { class: "sw" }, Fl = { class: "settings-grid" }, Hl = { class: "hint" }, Wl = { class: "card" }, Gl = { class: "hint" }, jl = { class: "sw" }, ql = { class: "settings-grid" }, Kl = { class: "hint" }, $l = { class: "card" }, Yl = { class: "hint" }, Jl = { class: "sw" }, Xl = { class: "settings-grid" }, Ql = { class: "hint" }, tu = { class: "hint" }, eu = { class: "card" }, iu = { class: "hint" }, nu = { class: "switches" }, ou = { class: "sw" }, au = { class: "sw" }, su = { class: "sw" }, ru = { class: "sw" }, lu = {
  "data-panel": "world",
  class: "panel"
}, uu = { class: "section-head" }, cu = { class: "desc" }, hu = { class: "head-actions" }, du = { class: "card" }, fu = { class: "settings-grid" }, pu = { class: "hint" }, mu = { class: "card" }, _u = { class: "hint" }, vu = { class: "world-field" }, gu = { class: "world-label" }, yu = ["placeholder"], bu = { class: "card" }, wu = { class: "hint" }, xu = { class: "settings-grid" }, Pu = ["placeholder"], Lu = ["placeholder"], Tu = ["placeholder"], ku = { class: "world-field" }, Su = { class: "world-label" }, Cu = ["placeholder"], Mu = { class: "world-field" }, zu = { class: "world-label" }, Ou = ["placeholder"], Eu = { class: "world-field" }, Au = { class: "world-label" }, Zu = ["placeholder"], Iu = { class: "world-actions" }, Bu = ["disabled"], Nu = ["disabled"], Du = { class: "hint" }, Ru = { class: "card" }, Vu = { class: "wm-head" }, Uu = { class: "count-pill" }, Fu = {
  key: 0,
  class: "wm-place"
}, Hu = {
  key: 0,
  class: "hint wm-premise"
}, Wu = { class: "wm-map-wrap" }, Gu = {
  key: 0,
  class: "wm-offline"
}, ju = {
  key: 1,
  class: "wm-compass",
  "aria-hidden": "true"
}, qu = {
  key: 1,
  class: "empty"
}, Ku = {
  key: 2,
  class: "wm-legend"
}, $u = {
  key: 3,
  class: "wm-routes"
}, Yu = {
  key: 0,
  class: "wm-routes-col"
}, Ju = {
  key: 1,
  class: "wm-routes-col"
}, Xu = { class: "card" }, Qu = { class: "wm-head" }, tc = { class: "count-pill" }, ec = { class: "feed" }, ic = { class: "meta" }, nc = {
  key: 0,
  class: "empty"
}, oc = {
  "data-panel": "adapters",
  class: "panel"
}, ac = {
  "data-panel": "state",
  class: "panel"
}, sc = { class: "section-head" }, rc = { class: "desc" }, lc = { class: "card" }, uc = { class: "count-pill" }, cc = { class: "feed" }, hc = { class: "meta" }, dc = {
  key: 0,
  class: "empty"
}, fc = { class: "grid2" }, pc = { class: "card" }, mc = { class: "feed" }, _c = { class: "meta" }, vc = { class: "meta" }, gc = { class: "meta" }, yc = {
  key: 0,
  class: "empty"
}, bc = { class: "card" }, wc = { class: "feed" }, xc = { class: "meta" }, Pc = {
  key: 0,
  class: "empty"
}, Lc = { class: "section" }, Tc = { class: "section-head" }, kc = { class: "desc" }, Sc = { class: "grid2" }, Cc = { class: "card" }, Mc = { class: "hint" }, zc = {
  class: "hint",
  style: { "margin-top": "10px" }
}, Oc = { style: { "margin-top": "14px", display: "flex", gap: "10px", "flex-wrap": "wrap" } }, Ec = ["disabled"], Ac = "https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}", Zc = /* @__PURE__ */ ga({
  __name: "CompanionPage",
  setup(Se) {
    const { confirm: Re } = ba(), s = (d, r) => xo.global.t(d, r ?? {});
    ya();
    const vt = (d) => xo.global.t(d, {}, { locale: "zh" }), J = (d) => d.map((r) => ({ value: vt(`life.companion.${r}`), label: s(`life.companion.${r}`) })), st = $({ settings: {}, cognition: null }), q = $(!1), de = $(""), U = $(""), Mt = $("cognition"), ae = $(null), lt = [
      { key: "cognition", i: "01", labelKey: "life.companion.nav.cognition", icon: "◉" },
      { key: "persona", i: "02", labelKey: "life.companion.nav.persona", icon: "✎" },
      { key: "world", i: "03", labelKey: "life.companion.nav.world", icon: "✦" },
      { key: "adapters", i: "04", labelKey: "life.companion.nav.adapters", icon: "✉" },
      { key: "state", i: "05", labelKey: "life.companion.nav.state", icon: "☺" }
    ];
    function rt(d) {
      U.value = d, setTimeout(() => {
        U.value === d && (U.value = "");
      }, Ta);
    }
    async function se(d = 0) {
      q.value = !0, de.value = "";
      try {
        st.value = await Po("/api/life/companion"), Ze(), q.value = !1;
      } catch (r) {
        if (d < 4)
          return await xa(1500), se(d + 1);
        de.value = Lo(r), q.value = !1;
      }
    }
    async function yt(d, r) {
      try {
        const c = await Pa(d, r);
        return await se(), c;
      } catch (c) {
        return de.value = Lo(c), null;
      }
    }
    function et(d) {
      Mt.value = d;
      const r = matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", c = ae.value;
      c ? c.scrollTo({ top: 0, behavior: r }) : window.scrollTo({ top: 0, behavior: r });
    }
    function Wi(d) {
      const r = ae.value?.querySelector(`section[data-panel="${d}"]`);
      r && (r.classList.remove("panel-replay"), r.offsetWidth, r.classList.add("panel-replay"), r.addEventListener("animationend", () => r.classList.remove("panel-replay"), { once: !0 }));
    }
    De(Mt, (d) => {
      bo(() => Wi(d));
    }), De(Mt, (d) => {
      d === "adapters" && we();
    });
    const _i = {
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
        return vt("life.companion.attach.dependent");
      },
      cog_tsundere_enabled: "0",
      get cog_tsundere_type() {
        return vt("life.companion.tsundere.classic");
      },
      cog_personadyn_enabled: "0",
      get cog_personadyn_type() {
        return vt("life.companion.pdt.0");
      },
      get cog_personadyn_gender() {
        return vt("life.companion.pdGender.unspecified");
      },
      // memory & consolidation. On by default — they are what makes lived
      // experience leave a trace; turn one off to ablate it.
      cog_memory_encode: "1",
      cog_sleep_replay: "1",
      cog_memory_reconsolidate: "1",
      cog_cls_interleave: "1"
    }, vi = [
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
    ], Bt = ["cog_affect_profile", "cog_language_framing", "cog_attachment_type", "cog_tsundere_type", "cog_personadyn_type", "cog_personadyn_gender"], gi = D(() => J(["attach.secluded", "attach.dependent", "attach.delusional", "attach.monitoring", "attach.selfHarm", "attach.exclusion"])), Ve = D(() => J(["tsundere.classic", "tsundere.cold", "tsundere.gruff", "tsundere.indulgent"])), Ue = [
      Array.from({ length: 18 }, (d, r) => `pdt.${r}`),
      Array.from({ length: 10 }, (d, r) => `pdt.${18 + r}`),
      Array.from({ length: 9 }, (d, r) => `pdt.${28 + r}`),
      Array.from({ length: 4 }, (d, r) => `pdt.${37 + r}`),
      Array.from({ length: 13 }, (d, r) => `pdt.${41 + r}`),
      Array.from({ length: 11 }, (d, r) => `pdt.${54 + r}`),
      Array.from({ length: 13 }, (d, r) => `pdt.${65 + r}`),
      Array.from({ length: 16 }, (d, r) => `pdt.${78 + r}`),
      Array.from({ length: 78 }, (d, r) => `pdt.${94 + r}`)
    ];
    D(() => Ue.map((d, r) => ({ label: s(`life.companion.pdg.${r}`), keys: d })));
    const Gi = D(() => [...new Set(Ue.flat())].map((d) => ({ value: vt(`life.companion.${d}`), label: s(`life.companion.${d}`) }))), yi = D(() => J(["pdGender.unspecified", "pdGender.maleScript", "pdGender.femaleScript", "pdGender.neutral", "pdGender.highTradMale", "pdGender.lowTradMale", "pdGender.highTradFemale", "pdGender.feminist"])), Fe = D(() => ["typical", "depression", "anxiety", "bpd", "alexithymia"].map((d) => ({ value: d, label: s(`life.companion.profile.${d}`) }))), ji = D(() => [
      "independent",
      "interchanging",
      "cognitive_determinism",
      "weak_whorf",
      "thinking_for_speaking",
      "radical_connectionism",
      "determinism"
    ].map((d) => ({ value: d, label: s(`life.companion.framing.${d}`) }))), kt = ["egocentric", "subjective", "self-reflective", "mutual", "societal-symbolic"], Zt = D(() => kt.map((d, r) => ({ value: String(r), label: s(`life.companion.stage.${d}`) }))), qi = D({
      get: () => String(Number(g.value.cog_social_stage ?? 2)),
      set: (d) => {
        g.value.cog_social_stage = Number(d);
      }
    });
    function Ht(d) {
      return String(st.value.settings?.[d] ?? _i[d] ?? "");
    }
    function pn() {
      const d = {};
      for (const [r, c] of Object.entries(_i)) {
        const x = Ht(r) || c;
        d[r] = vi.includes(r) ? x === "1" : Bt.includes(r) ? x : Number(x);
      }
      return d;
    }
    function zt() {
      const d = {};
      for (const [r, c] of Object.entries(_i)) {
        const x = g.value[r];
        vi.includes(r) ? d[r] = x ? "1" : "0" : d[r] = String(x ?? c);
      }
      return d;
    }
    const ot = D(() => st.value.cognition || null), I = D(() => ot.value?.last_control || null), fe = D(() => ot.value?.wave1 || null), M = D(() => ot.value?.wave2 || null), it = D(() => ot.value?.wave3 || null), xt = D(() => ot.value?.wave4a || null), Pt = D(() => ot.value?.wave4b || null), nt = D(() => ot.value?.persona || null), B = D(() => ot.value?.attachment || null), O = D(() => ot.value?.tsundere || null), C = D(() => ot.value?.personadyn || null), Kt = D(() => {
      const d = C.value?.big5;
      return d ? ["o_open", "c_conscientious", "e_extravert", "a_agreeable", "n_neurotic"].map((c) => R(d[c], 2)).join(" · ") : "—";
    }), Ki = D(() => {
      const d = C.value?.hexaco;
      return d ? ["h_honesty", "hex_e", "hex_x", "hex_a", "hex_c", "hex_o"].map((c) => R(d[c], 2)).join(" · ") : "—";
    });
    function He(d, r = 3) {
      return d ? Object.entries(d).filter(([, c]) => typeof c == "number").sort((c, x) => x[1] - c[1]).slice(0, r).map(([c, x]) => `${Li(c)} ${R(x, 2)}`) : [];
    }
    const We = D(() => He(C.value?.desires, 3)), pe = D(() => He(C.value?.emotions, 3)), bi = D(() => {
      const d = C.value?.learning?.theta_drift;
      return d ? Object.values(d).reduce((r, c) => r + Math.abs(c || 0), 0) : 0;
    }), $t = D(() => M.value?.episode || null), $i = (d) => {
      const r = { euthymic: "life.companion.episode.euthymic", subthreshold: "life.companion.episode.subthreshold", episode: "life.companion.episode.episode" };
      return r[d] ? s(r[d]) : "—";
    }, ut = D(() => ot.value?.life || null), Nt = $(!1), me = $("start"), wi = $(!0);
    function Yi() {
      const d = ut.value?.born_at;
      if (!d) return "—";
      const r = Date.now() - new Date(d).getTime();
      if (!isFinite(r) || r < 0) return "—";
      const c = Math.floor(r / 864e5), x = Math.floor(r % 864e5 / 36e5);
      return c > 0 ? s("life.companion.life.ageDaysHours", { days: c, hours: x }) : s("life.companion.life.ageHours", { hours: x });
    }
    function Ge() {
      return me.value === "start" ? s("life.companion.life.starting") : s("life.companion.life.pausing");
    }
    async function xi() {
      Nt.value = !0, me.value = "start";
      try {
        const d = await yt("life_start", { greet: wi.value });
        d && rt(d.greeting ? s("life.companion.flash.lifeStartedGreeting", { greeting: d.greeting }) : s("life.companion.flash.lifeStarted"));
      } finally {
        Nt.value = !1;
      }
    }
    async function Pi() {
      Nt.value = !0, me.value = "stop";
      try {
        await yt("life_stop", {}) && rt(s("life.companion.flash.lifeStopped"));
      } finally {
        Nt.value = !1;
      }
    }
    function mn(d, r) {
      Object.assign(g.value, d), X().then(() => rt(s("life.companion.flash.presetApplied", { label: r })));
    }
    const _n = [
      { labelKey: "life.companion.preset.regular", fields: { cog_affect_enabled: !0, cog_affect_profile: "typical", cog_affect_threat: 0.2, cog_affect_reward: 1, cog_attachment_enabled: !1, cog_tsundere_enabled: !1, cog_personadyn_enabled: !1 } },
      { labelKey: "life.companion.preset.depression", fields: { cog_affect_enabled: !0, cog_affect_profile: "depression", cog_affect_threat: 0.45, cog_affect_reward: 0.7 } },
      { labelKey: "life.companion.preset.tsundere", fields: { cog_tsundere_enabled: !0, cog_tsundere_type: vt("life.companion.tsundere.classic") } },
      { labelKey: "life.companion.preset.personadyn", fields: { cog_personadyn_enabled: !0, cog_personadyn_type: vt("life.companion.pdt.1") } },
      { labelKey: "life.companion.preset.yandereSecluded", fields: { cog_affect_enabled: !0, cog_affect_profile: "depression", cog_attachment_enabled: !0, cog_attachment_type: vt("life.companion.attach.secluded") } },
      { labelKey: "life.companion.preset.yandereDependent", fields: { cog_affect_enabled: !0, cog_attachment_enabled: !0, cog_attachment_type: vt("life.companion.attach.dependent") } },
      { labelKey: "life.companion.preset.yandereDelusional", fields: { cog_affect_enabled: !0, cog_affect_profile: "depression", cog_attachment_enabled: !0, cog_attachment_type: vt("life.companion.attach.delusional") } }
    ], je = D(() => ot.value?.wave2?.somatic_channels || null), Li = (d) => {
      const r = { fatigue: "channel.fatigue", pain: "channel.pain", cardiorespiratory: "channel.cardiorespiratory", gastrointestinal: "channel.gastrointestinal", dizziness: "channel.dizziness", sleep: "channel.sleep" };
      return r[d] ? s(`life.companion.${r[d]}`) : d;
    }, Ji = (d) => Math.max(0.02, Math.min(1, Number(d))).toFixed(3), vn = D(() => {
      const d = nt.value?.evidence || {};
      return Object.entries(d).map(([r, c]) => s("life.companion.evidencePair", { dim: r, words: c.join(s("life.companion.listSeparator")) })).join(s("life.companion.evidenceSeparator"));
    });
    function R(d, r = 3) {
      return d == null || d === "" ? "—" : Number(d).toFixed(r);
    }
    const Ce = D(() => (st.value.timeline || []).filter((d) => d.topic === vt("life.companion.val.world")).slice(0, 30)), Ti = D(() => st.value.commitments || []), ki = D(() => st.value.user_model || []), qe = D(() => Object.entries(st.value.values || {}).map(([d, r]) => ({ k: d, v: Number(r) })).sort((d, r) => Math.abs(r.v) - Math.abs(d.v)).slice(0, 20));
    function Ke(d) {
      try {
        const r = JSON.parse(d || "[]");
        return Array.isArray(r) ? r : [];
      } catch {
        return [];
      }
    }
    const g = $({}), Yt = $("off"), gn = D(() => [
      { value: "off", label: s("life.companion.worldDensity.off") },
      { value: "texture", label: s("life.companion.worldDensity.texture") },
      { value: "full", label: s("life.companion.worldDensity.full") }
    ]), $e = $("fictional"), Me = $(""), ze = $(""), Oe = $(""), Ye = $(""), Je = $(""), Xe = $(""), Qe = $(""), Dt = $(!1), ti = $(!1), Si = D(() => [
      { value: "fictional", label: s("life.companion.worldFictional.fictional") },
      { value: "real", label: s("life.companion.worldFictional.real") }
    ]), Wt = D(() => st.value.worldview || null), W = D(() => Wt.value?.map || { locations: [], edges: [], actors: [], width: 1e3, height: 700, title: "" }), yn = D(() => Wt.value?.actor_locations || {}), bn = ["home", "work", "shop", "food", "park", "transit", "other"], Rt = { home: "life.companion.kind.home", work: "life.companion.kind.work", shop: "life.companion.kind.shop", food: "life.companion.kind.food", park: "life.companion.kind.park", transit: "life.companion.kind.transit", other: "life.companion.kind.other" }, T = { home: "#e07a5f", work: "#5b8def", shop: "#e0a23d", food: "#57a773", park: "#3faead", transit: "#8b6fd6", other: "#8a94a6" }, Xi = D(() => bn.filter((d) => (W.value.locations || []).some((r) => (r.kind || "other") === d)));
    function Lt(d) {
      const r = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
      return String(d ?? "").replace(/[&<>"']/g, (c) => r[c]);
    }
    const Ee = $(null), _e = $(!1);
    let Q = null, E = null, Jt = "";
    const Ci = ["#2b4250", "#33495a", "#2f4a44", "#3a4258", "#463f4f", "#3d4a3a", "#4a4436", "#39485c"], Qi = ["#dfe4ea", "#d6dce4", "#e6eaf0", "#cfd7e0"];
    let Ae = "";
    const ve = $("city"), ge = {};
    function ei(d, r, c) {
      (ge[d] || (ge[d] = [])).push({ layer: r, base: c });
    }
    function Xt(d) {
      Ae = Ae === d ? "" : d;
      for (const [r, c] of Object.entries(ge)) {
        const x = r === Ae;
        for (const { layer: k, base: G } of c)
          k.setStyle && k.setStyle({ ...G, weight: (G.weight || 2) + (x ? 3.5 : 0), opacity: x ? 1 : G.opacity ?? 1 }), x && k.bringToFront && k.bringToFront();
      }
    }
    function ii() {
      Ae = "", oi(!1);
    }
    function wn() {
      ve.value = ve.value === "city" ? "nation" : "city", oi(!1);
    }
    function ni() {
      return { w: W.value.width || 1e3, h: W.value.height || 700 };
    }
    function St(d, r) {
      return [ni().h - r, d];
    }
    function Vt(d, r) {
      return z.divIcon({ className: "wm-route", html: `<span class="wm-route-inner" style="--c:${r}">${Lt(d)}</span>`, iconSize: [0, 0], iconAnchor: [0, 0] });
    }
    function xn(d, r) {
      return z.divIcon({ className: "wm-route wm-minor", html: `<span class="wm-route-inner" style="--c:${r}">${Lt(d)}</span>`, iconSize: [0, 0], iconAnchor: [0, 0] });
    }
    function Mi(d, r) {
      return z.divIcon({ className: "wm-route wm-station", html: `<span class="wm-route-inner" style="--c:${r}">${Lt(d)}</span>`, iconSize: [0, 0], iconAnchor: [0, 0] });
    }
    function ye(d) {
      const r = [], c = [];
      for (const x of d) {
        const k = String(x.text).length * 13 + 20, G = 22;
        r.some((bt) => Math.abs(bt.x - x.x) < (bt.w + k) / 2 && Math.abs(bt.y - x.y) < (bt.h + G) / 2) || (r.push({ x: x.x, y: x.y, w: k, h: G }), c.push(x));
      }
      return c;
    }
    function tn() {
      const d = W.value.kind === "real" ? "real" : "fictional";
      if (Q && Jt !== d && (Q.remove(), Q = null, E = null), !(Q || !Ee.value)) {
        if (d === "real") {
          _e.value = !1, Q = z.map(Ee.value, { zoomControl: !0, attributionControl: !0 }).setView([35, 105], 5);
          const r = z.tileLayer(Ac, { subdomains: ["1", "2", "3", "4"], maxZoom: 19, minZoom: 3, attribution: s("life.companion.map.attribution") });
          r.on("tileerror", () => {
            _e.value = !0;
          }), r.on("load", () => {
            _e.value = !1;
          }), r.addTo(Q);
        } else {
          _e.value = !1;
          const { w: r, h: c } = ni();
          Q = z.map(Ee.value, { crs: z.CRS.Simple, zoomControl: !0, attributionControl: !1, minZoom: -3, maxZoom: 3 }).setView([c / 2, r / 2], -1.5);
          for (const [k, G] of [["pWater", 350], ["pParks", 360], ["pBlocks", 370], ["pRoads", 380], ["pMetro", 400], ["pBus", 410], ["pLabels", 620]])
            Q.createPane(k), Q.getPane(k).style.zIndex = String(G);
          const x = () => Q.getContainer().classList.toggle("wm-zoom-low", Q.getZoom() < 0);
          Q.on("zoomend", x), setTimeout(x, 0);
        }
        Jt = d, E = z.layerGroup().addTo(Q);
      }
    }
    function oi(d = !1) {
      if (!Q || !E) return;
      E.clearLayers();
      for (const k of Object.keys(ge)) delete ge[k];
      Ae = "";
      const r = W.value.locations || [];
      if (!r.length) return;
      const c = Jt !== "real", x = {};
      for (const k of r) x[k.id] = k;
      if (c) {
        const { w: k, h: G } = ni(), Y = (m) => m.map((F) => St(F[0], F[1])), bt = W.value.nation;
        if (ve.value === "nation" && bt) {
          z.rectangle([[0, 0], [G, k]], { pane: "pWater", stroke: !1, fillColor: "#d9e6f0", fillOpacity: 1 }).addTo(E), z.polygon(Y(bt.land), { pane: "pWater", color: "#8fbfe6", weight: 1.5, fillColor: "#f4efe1", fillOpacity: 1 }).addTo(E), (bt.provinces || []).forEach((m, F) => {
            z.polygon(Y(m.points), { pane: "pParks", color: "#c9b98f", weight: 1, fillColor: F % 2 ? "#ece2c8" : "#e4d7b4", fillOpacity: 0.55 }).addTo(E), z.marker(Y([m.label])[0], { pane: "pLabels", interactive: !1, icon: Vt(m.name, "#8a7a5c") }).addTo(E);
          }), (bt.routes || []).forEach((m) => z.polyline(Y(m.points), { pane: "pRoads", color: "#b98a4a", weight: 2.5, dashArray: "2 7" }).addTo(E)), (bt.cities || []).forEach((m) => {
            const F = St(m.x, m.y);
            z.circleMarker(F, { pane: "pLabels", radius: m.capital ? 9 : 6, color: "#ffffff", weight: 2, fillColor: m.capital ? "#d64545" : "#3a6ea5", fillOpacity: 1 }).bindPopup(Lt(m.name)).addTo(E), z.marker(F, { pane: "pLabels", interactive: !1, icon: Vt(m.name, m.capital ? "#d64545" : "#3a6ea5") }).addTo(E);
          }), Q.fitBounds([[0, 0], [G, k]], { padding: [6, 6] });
          return;
        }
        z.rectangle([[0, 0], [G, k]], { pane: "pWater", stroke: !1, fillColor: "#eef1f4", fillOpacity: 1 }).addTo(E), (W.value.compounds || []).forEach((m) => {
          z.polygon(Y(m.points), { pane: "pParks", color: "#c9b98f", weight: 1.2, dashArray: "7 5", fillColor: "#f3ead0", fillOpacity: 0.5 }).addTo(E), z.marker(Y(m.points)[0], { pane: "pLabels", interactive: !1, icon: Vt(m.name, "#a9884a") }).addTo(E);
        }), (W.value.lakes || []).forEach((m) => {
          z.polygon(Y(m.points), { pane: "pWater", color: "#8fbfe6", weight: 1.5, fillColor: "#bcd9f0", fillOpacity: 1 }).addTo(E), m.name && m.name !== "" && z.marker(St(m.label[0], m.label[1]), { pane: "pLabels", interactive: !1, icon: Vt(m.name, "#3d7fb5") }).addTo(E);
        }), (W.value.rivers || []).forEach((m) => {
          z.polyline(Y(m.points), { pane: "pWater", color: "#8fbfe6", weight: 16, lineCap: "round", lineJoin: "round" }).addTo(E), z.polyline(Y(m.points), { pane: "pWater", color: "#bcd9f0", weight: 11, lineCap: "round", lineJoin: "round" }).addTo(E), m.name && m.name !== "" && z.marker(Y(m.points)[Math.floor(m.points.length / 2)], { pane: "pLabels", interactive: !1, icon: Vt(m.name, "#3d7fb5") }).addTo(E);
        }), (W.value.parks || []).forEach((m) => {
          z.polygon(Y(m.points), { pane: "pParks", color: "#a9d3a0", weight: 1, fillColor: "#c9e6c4", fillOpacity: 1 }).addTo(E), (m.trees || []).forEach((F) => z.circleMarker(St(F[0], F[1]), { pane: "pParks", radius: 2.6, stroke: !1, fillColor: "#82bd79", fillOpacity: 1 }).addTo(E)), m.name && m.name !== vt("life.companion.val.park") && z.marker(Y(m.points)[0], { pane: "pLabels", interactive: !1, icon: Vt(m.name, "#5a9e52") }).addTo(E);
        });
        const ee = [];
        (W.value.blocks || []).forEach((m) => {
          const F = Y(m.points);
          if (z.polygon(F.map((tt) => [tt[0] - 3, tt[1] + 3]), { pane: "pBlocks", stroke: !1, fillColor: "#5b6b7a", fillOpacity: 0.16 }).addTo(E), z.polygon(F, { pane: "pBlocks", color: "#b9c3cd", weight: 1, fillColor: Qi[(m.shade || 0) % Qi.length], fillOpacity: 1 }).addTo(E), m.tower) {
            const tt = F.reduce((_t, dt) => _t + dt[0], 0) / F.length, mt = F.reduce((_t, dt) => _t + dt[1], 0) / F.length;
            z.polygon(
              F.map((_t) => [tt + (_t[0] - tt) * 0.5, mt + (_t[1] - mt) * 0.5]),
              { pane: "pBlocks", color: "#aab4c0", weight: 1, fillColor: "#eef2f6", fillOpacity: 1 }
            ).addTo(E);
          }
          if (m.name) {
            const tt = m.points.reduce((_t, dt) => _t + dt[0], 0) / m.points.length, mt = m.points.reduce((_t, dt) => _t + dt[1], 0) / m.points.length;
            ee.push({ x: tt, y: mt, text: m.name, color: m.tower ? "#6b5b8a" : "#7a8794" });
          }
        }), (W.value.named_buildings || []).forEach((m) => {
          z.circleMarker(St(m.x, m.y), { pane: "pLabels", radius: 4, color: "#ffffff", weight: 1.5, fillColor: "#8a5a2b", fillOpacity: 1 }).addTo(E), z.marker(St(m.x, m.y), { pane: "pLabels", interactive: !1, icon: Vt(m.name, "#8a5a2b") }).addTo(E);
        });
        for (const m of ye(ee))
          z.marker(St(m.x, m.y), { pane: "pLabels", interactive: !1, icon: xn(m.text, m.color) }).addTo(E);
        const ui = {
          highway: { casing: 13, fill: 6.5, color: "#f08c2e" },
          arterial: { casing: 10, fill: 4.5, color: "#f7cf8a" },
          street: { casing: 5, fill: 2.4, color: "#ffffff" }
        };
        (W.value.streets || []).forEach((m) => {
          const F = ui[m.kind] || ui.street, tt = Y(m.points);
          z.polyline(tt, { pane: "pRoads", color: "#ffffff", weight: F.casing, lineCap: "round", lineJoin: "round" }).addTo(E), z.polyline(tt, { pane: "pRoads", color: F.color, weight: F.fill, lineCap: "round", lineJoin: "round" }).addTo(E);
        }), (W.value.roads || []).forEach((m, F) => {
          if (!m.name) return;
          const tt = Y(m.points), mt = "road:" + F;
          z.polyline(tt, { pane: "pRoads", color: "#ffffff", weight: 11, lineCap: "round", lineJoin: "round" }).addTo(E);
          const _t = { pane: "pRoads", color: "#f6c56b", weight: 5, opacity: 1, lineCap: "round", lineJoin: "round" };
          ei(mt, z.polyline(tt, _t).on("click", () => Xt(mt)).addTo(E), _t), z.marker(tt[Math.floor(tt.length / 2)], { pane: "pLabels", interactive: !0, icon: Vt(m.name, "#9a8358") }).on("click", () => Xt(mt)).addTo(E);
        }), (W.value.districts || []).forEach((m, F) => {
          z.circle(St(m.x, m.y), { pane: "pRoads", radius: m.r || 200, color: "#93a2b0", weight: 1, dashArray: "4 7", fillColor: Ci[F % Ci.length], fillOpacity: 0.08 }).addTo(E), z.marker(St(m.x, m.y), { pane: "pLabels", interactive: !1, icon: z.divIcon({ className: "wm-district", html: `<span class="wm-district-inner">${Lt(m.name)}</span>`, iconSize: [0, 0], iconAnchor: [0, 0] }) }).addTo(E);
        });
        const Pe = [];
        (W.value.metro || []).forEach((m, F) => {
          const tt = Y(m.points), mt = "metro:" + F;
          z.polyline(tt, { pane: "pMetro", color: "#ffffff", weight: 8, lineCap: "round", lineJoin: "round" }).addTo(E);
          const _t = { pane: "pMetro", color: m.color, weight: 4.5, opacity: 0.92, lineCap: "round", lineJoin: "round" };
          ei(mt, z.polyline(tt, _t).on("click", () => Xt(mt)).addTo(E), _t), (m.stations || []).forEach((dt) => {
            z.circleMarker(St(dt.x, dt.y), { pane: "pMetro", radius: 5, color: "#ffffff", weight: 2.5, fillColor: m.color, fillOpacity: 1 }).bindPopup(Lt(dt.name || m.name)).on("click", () => Xt(mt)).addTo(E), dt.name && Pe.push({ x: dt.x, y: dt.y, text: dt.name, color: m.color });
          }), z.marker(tt[Math.floor(tt.length / 2)], { pane: "pLabels", interactive: !0, icon: Vt(m.name, m.color) }).on("click", () => Xt(mt)).addTo(E);
        }), (W.value.bus || []).forEach((m, F) => {
          const tt = Y(m.points), mt = "bus:" + F, _t = { pane: "pBus", color: m.color, weight: 3, opacity: 0.95, dashArray: "7 7", lineCap: "round" };
          ei(mt, z.polyline(tt, _t).on("click", () => Xt(mt)).addTo(E), _t), (m.stops || []).forEach((dt) => z.circleMarker(St(dt.x, dt.y), { pane: "pBus", radius: 3.2, color: "#ffffff", weight: 1.5, fillColor: m.color, fillOpacity: 1 }).bindPopup(Lt(dt.name || m.name)).on("click", () => Xt(mt)).addTo(E)), z.marker(tt[Math.floor(tt.length / 2)], { pane: "pLabels", interactive: !0, icon: Vt(m.name, m.color) }).on("click", () => Xt(mt)).addTo(E);
        });
        for (const m of ye(Pe))
          z.marker(St(m.x, m.y), { pane: "pLabels", interactive: !1, icon: Mi(m.text, m.color) }).addTo(E);
      } else
        for (const k of W.value.edges || []) {
          const G = x[k[0]], Y = x[k[1]];
          G?.lat != null && Y?.lat != null && z.polyline([[G.lat, G.lng], [Y.lat, Y.lng]], { color: "#5b8def", weight: 3, opacity: 0.55, dashArray: "2 8", lineCap: "round" }).addTo(E);
        }
      for (const k of r) {
        const G = T[k.kind] || T.other, Y = c ? St(k.x, k.y) : k.lat != null ? [k.lat, k.lng] : null;
        if (!Y) continue;
        const bt = z.divIcon({
          className: "wm-pin-holder",
          html: `<span class="wm-pin" style="--c:${G}"></span><span class="wm-pin-label">${Lt(k.name)}</span>`,
          iconSize: [0, 0],
          iconAnchor: [0, 0]
        });
        z.marker(Y, { icon: bt }).bindPopup(`<b>${Lt(k.name)}</b>${k.desc ? "<br>" + Lt(k.desc) : ""}`).addTo(E);
      }
      for (const k of W.value.actors || []) {
        const G = x[yn.value[k.id] || k.location];
        if (!G) continue;
        const Y = c ? St(G.x, G.y) : G.lat != null ? [G.lat, G.lng] : null;
        if (!Y) continue;
        const bt = z.divIcon({
          className: "wm-actor-holder",
          html: `<span class="wm-actor-badge">${Lt((k.name || "?").slice(0, 1))}</span><span class="wm-actor-name">${Lt(k.name)}</span>`,
          iconSize: [0, 0],
          iconAnchor: [0, 0]
        });
        z.marker(Y, { icon: bt }).bindPopup(`${Lt(k.name)} · ${Lt(G.name)}`).addTo(E);
      }
      if (!d)
        if (c) {
          const { w: k, h: G } = ni();
          Q.fitBounds([[0, 0], [G, k]], { padding: [0, 0] });
        } else {
          const k = r.filter((G) => G.lat != null).map((G) => [G.lat, G.lng]);
          k.length > 1 ? Q.fitBounds(k, { padding: [56, 56], maxZoom: 15 }) : k.length === 1 && Q.setView(k[0], 14);
        }
    }
    De([Mt, () => st.value.worldview], async () => {
      Mt.value === "world" && (await bo(), tn(), oi(), Q && setTimeout(() => Q.invalidateSize(), 80));
    }), wo(() => {
      Q && (Q.remove(), Q = null, E = null);
    });
    function Ze() {
      g.value = { ...pn() }, Yt.value = String(st.value.settings?.world_density || "off"), $e.value = String(st.value.settings?.world_fictional || "fictional"), Me.value = String(st.value.settings?.world_country || ""), ze.value = String(st.value.settings?.world_city || ""), Oe.value = String(st.value.settings?.world_district || ""), Ye.value = String(st.value.settings?.world_premise || ""), Je.value = String(st.value.settings?.persona_text || ""), Xe.value = String(st.value.settings?.world_actors || ""), Qe.value = String(st.value.settings?.world_places || "");
    }
    const V = $(!1);
    async function X() {
      if (!V.value) {
        V.value = !0;
        try {
          const d = {
            ...zt(),
            world_density: Yt.value,
            world_fictional: $e.value,
            world_country: Me.value,
            world_city: ze.value,
            world_district: Oe.value,
            world_premise: Ye.value,
            world_actors: Xe.value,
            world_places: Qe.value,
            persona_text: Je.value
          }, r = await yt("settings_set", { settings: d });
          r?.rejected?.length ? rt(s("life.companion.flash.settingsSavedIgnored", { items: r.rejected.join(s("life.companion.listSeparator")) })) : rt(s("life.companion.flash.settingsSaved"));
        } finally {
          V.value = !1;
        }
      }
    }
    const ai = $([]), be = $([]);
    $(!1);
    async function we() {
      const d = await yt("adapter_list", {});
      d && (ai.value = d.instances || [], be.value = d.runtime || []);
    }
    async function zi() {
      if (!(Dt.value || !await Re({
        title: s("life.companion.world.rewriteTitle"),
        message: s("life.companion.world.rewriteMessage"),
        confirmLabel: s("life.companion.world.overwriteConfirm"),
        danger: !0
      }))) {
        Dt.value = !0;
        try {
          (await yt("world_generate", { instructions: "" }))?.worldview && rt(s("life.companion.flash.worldGenerated"));
        } finally {
          Dt.value = !1;
        }
      }
    }
    async function N() {
      if (!Dt.value) {
        Dt.value = !0;
        try {
          (await yt("world_map_generate", { instructions: "" }))?.worldview && rt(s("life.companion.flash.mapRegenerated"));
        } finally {
          Dt.value = !1;
        }
      }
    }
    async function ct() {
      if (!await Re({
        title: s("life.companion.world.clearTitle"),
        message: s("life.companion.world.clearMessage"),
        confirmLabel: s("life.companion.world.clearConfirm"),
        danger: !0
      })) return;
      await yt("world_clear", {}) && rt(s("life.companion.flash.worldCleared"));
    }
    async function Oi() {
      if (!(!await Re({
        title: s("life.companion.reset.title"),
        message: s("life.companion.reset.message"),
        confirmLabel: s("life.companion.reset.continue"),
        danger: !0
      }) || !await Re({
        title: s("life.companion.reset.confirmTitle"),
        message: s("life.companion.reset.confirmMessage"),
        confirmLabel: s("life.companion.reset.confirm"),
        danger: !0
      }))) {
        ti.value = !0;
        try {
          await yt("reset_person", {}), rt(s("life.companion.flash.personReset")), await se();
        } finally {
          ti.value = !1;
        }
      }
    }
    const re = () => ({ name: "", avatar: "", birthDate: "", gender: "", description: "", personality: "", greeting: "", customPrompt: "" }), Tt = D(() => [
      { value: "", label: s("life.companion.gender.none") },
      { value: "female", label: s("life.companion.gender.female") },
      { value: "male", label: s("life.companion.gender.male") },
      { value: "other", label: s("life.companion.gender.other") }
    ]);
    function Pn(d) {
      return (Tt.value.find((r) => r.value === d) || Tt.value[0]).label;
    }
    const j = $(re()), Gt = $(!1);
    function ht() {
      return globalThis.__0KAY_HOST__;
    }
    function Qt() {
      const d = ht();
      if (d?.getPersona) {
        j.value = { ...re(), ...d.getPersona() || {} };
        return;
      }
      try {
        const r = JSON.parse(localStorage.getItem("0kay_config") || "{}");
        j.value = { ...re(), ...r.persona || {} };
      } catch {
        j.value = re();
      }
    }
    const _ = $(null), te = $(!1), Ei = D(() => [
      { value: "", label: s("life.companion.gender.undecidedBracket") },
      ...(_.value?.options?.character || []).map((d) => ({ value: d.key, label: d.label }))
    ]), Ie = D(() => [
      { value: "", label: s("life.companion.gender.undecidedBracket") },
      ...(_.value?.options?.relationship || []).map((d) => ({
        value: d.key,
        label: d.label + (d.pathological ? s("life.companion.relationship.pathologicalSuffix") : "")
      }))
    ]);
    function si() {
      return { text: [j.value.description, j.value.personality].filter((d) => String(d || "").trim()).join(`
`) };
    }
    De(() => [j.value.description, j.value.personality, j.value.customPrompt], () => {
      _.value = null;
    });
    function Ai(d) {
      return (_.value?.options?.relationship || []).find((r) => r.key === d);
    }
    De(() => _.value?.relationship?.key, (d) => {
      const r = _.value?.attachment;
      if (!r) return;
      const c = Ai(d);
      r.type = c?.pathological && c.attachment_type || "";
    }, { immediate: !0 }), De(() => _.value?.attachment?.type, (d) => {
      const r = _.value?.attachment;
      if (!(!d || !r)) {
        (!r.initial || typeof r.initial != "object") && (r.initial = {});
        for (const [c, x] of Object.entries({ A: 0.05, Am: 0, Tr: 0.5, J: 0, X: 0.05, S: 0.6, O: 0 }))
          r.initial[c] == null && (r.initial[c] = x);
      }
    });
    async function ri() {
      const d = si();
      if (!d.text.trim()) {
        rt(s("life.companion.flash.needDescriptionOrPersonality"));
        return;
      }
      te.value = !0;
      try {
        const r = await yt("persona_analyze", { text: d.text, gender: j.value.gender });
        r && (_.value = r, _.value.personadynGender = r.personadyn?.gender || g.cog_personadyn_gender || vt("life.companion.pdGender.unspecified"), !j.value.gender && r.gender && (j.value.gender = r.gender), rt(r.source === "llm" ? s("life.companion.flash.analyzedLlm") : s("life.companion.flash.analyzedLocal")));
      } finally {
        te.value = !1;
      }
    }
    async function Zi() {
      if (!_.value) {
        rt(s("life.companion.flash.needLlmFirst"));
        return;
      }
      Gt.value = !0;
      try {
        const d = si(), r = { ..._.value.traits || {} };
        if (r.gender = _.value.gender || j.value.gender || null, r.character = _.value.character?.key || null, r.relationship = _.value.relationship?.key || null, r.expression = _.value.character?.expression || _.value.expression || null, delete r.axes, !await yt("persona_apply", {
          text: d.text,
          traits: r,
          attachment: _.value.attachment || {},
          tsundere: _.value.tsundere || {},
          personadyn: {
            ..._.value.personadyn || {},
            // The owner may override the archetype's implied gender/social script
            // after analysis; the backend applies it as the persona's G group.
            gender: _.value.personadynGender || g.cog_personadyn_gender || vt("life.companion.pdGender.unspecified")
          }
        })) return;
        const x = ht();
        if (x?.setPersona)
          x.setPersona({ ...j.value }), x.saveConfig?.();
        else {
          const k = JSON.parse(localStorage.getItem("0kay_config") || "{}");
          k.persona = { ...k.persona || {}, ...j.value }, localStorage.setItem("0kay_config", JSON.stringify(k));
        }
        rt(s("life.companion.flash.personaSaved"));
      } finally {
        Gt.value = !1;
      }
    }
    Bn(Qt), De(Mt, (d) => {
      d === "persona" && Qt();
    }), Bn(se);
    const Be = $("");
    let xe;
    async function Ii() {
      if (document.visibilityState === "visible")
        try {
          st.value = await Po("/api/life/companion"), Be.value = (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        } catch {
        }
    }
    function li() {
      document.visibilityState === "visible" && Ii();
    }
    return Bn(() => {
      xe = setInterval(() => {
        Ii();
      }, 12e3), document.addEventListener("visibilitychange", li);
    }), wo(() => {
      xe && clearInterval(xe), document.removeEventListener("visibilitychange", li);
    }), wa("life-plugin-kit", La("pcp")), (d, r) => (b(), w("main", {
      class: "pcp",
      ref_key: "pageEl",
      ref: ae
    }, [
      o("header", Ea, [
        o("div", Aa, [
          o("div", Za, [
            r[98] || (r[98] = o("p", { class: "eyebrow" }, [
              o("b", null, "◉"),
              ft(" L.I.F.E / COGNITION")
            ], -1)),
            o("h1", null, u(s("life.companion.title")), 1),
            o("p", Ia, u(s("life.companion.subtitle")), 1)
          ]),
          o("div", Ba, [
            o("button", {
              class: ke(["btn", { tonic: !ut.value?.alive }]),
              disabled: Nt.value || q.value,
              onClick: r[0] || (r[0] = (c) => ut.value?.alive ? Pi() : xi())
            }, u(Nt.value ? Ge() : ut.value?.alive ? s("life.companion.life.pause") : s("life.companion.life.start")), 11, Na),
            o("button", {
              class: "fab",
              disabled: V.value || q.value,
              onClick: X
            }, [
              r[99] || (r[99] = o("span", { class: "fab-ic" }, "✦", -1)),
              ft(u(V.value ? s("life.companion.saving") : s("life.companion.saveSettings")), 1)
            ], 8, Da),
            o("button", {
              class: "btn tonic",
              disabled: q.value,
              onClick: se
            }, u(q.value ? s("life.companion.refreshing") : s("life.companion.refresh")), 9, Ra)
          ])
        ]),
        o("div", Va, [
          o("span", {
            class: ke(["pill", { bad: ot.value && !ot.value.enabled }])
          }, u(s("life.companion.cognitionCore")) + " " + u(ot.value?.available === !1 ? s("life.companion.status.unavailable") : ot.value?.enabled ? s("life.companion.status.running") : s("life.companion.status.stopped")), 3),
          o("span", Ua, u(s("life.companion.state.decidedTurns", { n: fe.value?.turns ?? 0 })), 1),
          o("span", Fa, u(s("life.companion.state.engrams", { n: fe.value?.engrams ?? 0 })), 1),
          o("span", Ha, u(s("life.companion.state.lexicon", { n: it.value?.lexicon_size ?? 0 })), 1)
        ])
      ]),
      de.value ? (b(), w("p", Wa, u(de.value), 1)) : Z("", !0),
      U.value ? (b(), w("p", Ga, u(U.value), 1)) : Z("", !0),
      o("nav", {
        class: "tabs",
        "aria-label": s("life.companion.view")
      }, [
        (b(), w(pt, null, oe(lt, (c) => o("button", {
          key: c.key,
          class: ke(["tab", { active: Mt.value === c.key }]),
          onClick: (x) => et(c.key)
        }, [
          o("i", null, u(c.i), 1),
          o("span", Ka, u(c.icon), 1),
          ft(u(s(c.labelKey)), 1)
        ], 10, qa)), 64))
      ], 8, ja),
      y(o("section", $a, [
        o("div", Ya, [
          o("div", null, [
            o("h2", null, u(s("life.companion.persona.title")), 1),
            o("p", Ja, u(s("life.companion.persona.desc")), 1)
          ]),
          o("div", Xa, [
            o("button", {
              class: "btn tonic sm",
              disabled: te.value || q.value,
              onClick: ri
            }, u(te.value ? s("life.companion.persona.analyzing") : s("life.companion.persona.analyze")), 9, Qa),
            o("button", {
              class: "btn filled sm",
              disabled: Gt.value || !_.value,
              onClick: Zi
            }, u(s("life.companion.persona.save")), 9, ts)
          ])
        ]),
        o("article", es, [
          o("div", is, [
            o("label", null, [
              o("span", null, u(s("life.companion.persona.name")), 1),
              y(o("input", {
                "onUpdate:modelValue": r[1] || (r[1] = (c) => j.value.name = c),
                class: "field"
              }, null, 512), [
                [S, j.value.name]
              ])
            ]),
            o("label", null, [
              o("span", null, u(s("life.companion.persona.gender")), 1),
              Ct(Et(At), {
                modelValue: j.value.gender,
                "onUpdate:modelValue": r[2] || (r[2] = (c) => j.value.gender = c),
                options: Tt.value,
                "aria-label": s("life.companion.persona.gender")
              }, null, 8, ["modelValue", "options", "aria-label"])
            ]),
            o("label", null, [
              o("span", null, u(s("life.companion.persona.avatarUrl")), 1),
              y(o("input", {
                "onUpdate:modelValue": r[3] || (r[3] = (c) => j.value.avatar = c),
                class: "field"
              }, null, 512), [
                [S, j.value.avatar]
              ])
            ]),
            o("label", null, [
              o("span", null, u(s("life.companion.persona.birthday")), 1),
              y(o("input", {
                "onUpdate:modelValue": r[4] || (r[4] = (c) => j.value.birthDate = c),
                type: "date",
                class: "field"
              }, null, 512), [
                [S, j.value.birthDate]
              ])
            ])
          ]),
          o("label", ns, [
            o("span", null, u(s("life.companion.persona.description")), 1),
            y(o("textarea", {
              "onUpdate:modelValue": r[5] || (r[5] = (c) => j.value.description = c),
              rows: "3",
              class: "field"
            }, null, 512), [
              [S, j.value.description]
            ])
          ]),
          o("label", os, [
            o("span", null, u(s("life.companion.persona.personality")), 1),
            y(o("textarea", {
              "onUpdate:modelValue": r[6] || (r[6] = (c) => j.value.personality = c),
              rows: "3",
              class: "field"
            }, null, 512), [
              [S, j.value.personality]
            ])
          ]),
          o("label", as, [
            o("span", null, u(s("life.companion.persona.greeting")), 1),
            y(o("textarea", {
              "onUpdate:modelValue": r[7] || (r[7] = (c) => j.value.greeting = c),
              rows: "2",
              class: "field"
            }, null, 512), [
              [S, j.value.greeting]
            ])
          ]),
          o("label", ss, [
            o("span", null, u(s("life.companion.persona.customPrompt")), 1),
            y(o("textarea", {
              "onUpdate:modelValue": r[8] || (r[8] = (c) => j.value.customPrompt = c),
              rows: "5",
              class: "field"
            }, null, 512), [
              [S, j.value.customPrompt]
            ])
          ]),
          o("p", rs, u(s("life.companion.persona.hint")), 1)
        ]),
        _.value ? (b(), w("article", ls, [
          o("h3", null, [
            ft(u(s("life.companion.persona.analysisResult")) + " ", 1),
            o("span", us, u(_.value.source === "llm" ? s("life.companion.persona.sourceLlm") : s("life.companion.persona.sourceLocal")), 1)
          ]),
          o("div", cs, [
            o("label", null, [
              o("span", null, u(s("life.companion.persona.gender")), 1),
              Ct(Et(At), {
                modelValue: _.value.gender,
                "onUpdate:modelValue": r[9] || (r[9] = (c) => _.value.gender = c),
                options: Tt.value,
                "aria-label": s("life.companion.persona.gender")
              }, null, 8, ["modelValue", "options", "aria-label"])
            ]),
            o("label", null, [
              o("span", null, u(s("life.companion.persona.characterArchetype")), 1),
              Ct(Et(At), {
                modelValue: _.value.character.key,
                "onUpdate:modelValue": r[10] || (r[10] = (c) => _.value.character.key = c),
                options: Ei.value,
                "aria-label": s("life.companion.persona.characterArchetype")
              }, null, 8, ["modelValue", "options", "aria-label"])
            ]),
            o("label", null, [
              o("span", null, u(s("life.companion.persona.relationshipType")), 1),
              Ct(Et(At), {
                modelValue: _.value.relationship.key,
                "onUpdate:modelValue": r[11] || (r[11] = (c) => _.value.relationship.key = c),
                options: Ie.value,
                "aria-label": s("life.companion.persona.relationshipTypeAria")
              }, null, 8, ["modelValue", "options", "aria-label"])
            ])
          ]),
          o("p", hs, [
            ft(u(s("life.companion.persona.genderLine", { gender: Pn(_.value.gender) })) + " ", 1),
            _.value.relationship?.label ? (b(), w(pt, { key: 0 }, [
              ft(u(s("life.companion.persona.relationshipLine", { label: _.value.relationship.label })) + " ", 1),
              _.value.relationship.pathological ? (b(), w(pt, { key: 0 }, [
                ft(u(s("life.companion.persona.pathologicalNote")), 1)
              ], 64)) : (b(), w(pt, { key: 1 }, [
                ft(u(s("life.companion.persona.healthyNote")), 1)
              ], 64))
            ], 64)) : Z("", !0)
          ]),
          _.value.character?.expression || _.value.expression ? (b(), w("p", ds, u(s("life.companion.persona.speakingStyle", { style: _.value.character?.expression || _.value.expression })), 1)) : Z("", !0),
          o("h4", null, u(s("life.companion.persona.emotionSomatic")), 1),
          o("div", fs, [
            o("label", null, [
              o("span", null, u(s("life.companion.persona.threatBaseline")), 1),
              y(o("input", {
                "onUpdate:modelValue": r[12] || (r[12] = (c) => _.value.traits.threat_baseline = c),
                type: "number",
                step: "0.05",
                min: "0",
                max: "1",
                class: "field tiny"
              }, null, 512), [
                [
                  S,
                  _.value.traits.threat_baseline,
                  void 0,
                  { number: !0 }
                ]
              ])
            ]),
            o("label", null, [
              o("span", null, u(s("life.companion.persona.rewardBaseline")), 1),
              y(o("input", {
                "onUpdate:modelValue": r[13] || (r[13] = (c) => _.value.traits.reward_baseline = c),
                type: "number",
                step: "0.1",
                min: "0",
                max: "2",
                class: "field tiny"
              }, null, 512), [
                [
                  S,
                  _.value.traits.reward_baseline,
                  void 0,
                  { number: !0 }
                ]
              ])
            ]),
            o("label", null, [
              o("span", null, u(s("life.companion.persona.catastrophizing")), 1),
              y(o("input", {
                "onUpdate:modelValue": r[14] || (r[14] = (c) => _.value.traits.catastrophizing = c),
                type: "number",
                step: "0.05",
                min: "0",
                max: "1",
                class: "field tiny"
              }, null, 512), [
                [
                  S,
                  _.value.traits.catastrophizing,
                  void 0,
                  { number: !0 }
                ]
              ])
            ]),
            o("label", null, [
              o("span", null, u(s("life.companion.persona.erqProfile")), 1),
              Ct(Et(At), {
                modelValue: _.value.traits.erq_profile,
                "onUpdate:modelValue": r[15] || (r[15] = (c) => _.value.traits.erq_profile = c),
                options: Fe.value,
                "aria-label": s("life.companion.persona.erqProfile")
              }, null, 8, ["modelValue", "options", "aria-label"])
            ]),
            o("label", null, [
              o("span", null, u(s("life.companion.persona.sleepHour")), 1),
              y(o("input", {
                "onUpdate:modelValue": r[16] || (r[16] = (c) => _.value.traits.sleep_hour = c),
                type: "number",
                min: "0",
                max: "23",
                class: "field tiny"
              }, null, 512), [
                [
                  S,
                  _.value.traits.sleep_hour,
                  void 0,
                  { number: !0 }
                ]
              ])
            ])
          ]),
          o("h4", null, u(s("life.companion.persona.personalityDims")), 1),
          o("div", ps, [
            o("label", null, [
              o("span", null, u(s("life.companion.persona.extraversion")), 1),
              y(o("input", {
                "onUpdate:modelValue": r[17] || (r[17] = (c) => _.value.traits.extraversion = c),
                type: "number",
                step: "0.05",
                min: "0",
                max: "1",
                class: "field tiny"
              }, null, 512), [
                [
                  S,
                  _.value.traits.extraversion,
                  void 0,
                  { number: !0 }
                ]
              ])
            ]),
            o("label", null, [
              o("span", null, u(s("life.companion.persona.agreeableness")), 1),
              y(o("input", {
                "onUpdate:modelValue": r[18] || (r[18] = (c) => _.value.traits.agreeableness = c),
                type: "number",
                step: "0.05",
                min: "0",
                max: "1",
                class: "field tiny"
              }, null, 512), [
                [
                  S,
                  _.value.traits.agreeableness,
                  void 0,
                  { number: !0 }
                ]
              ])
            ]),
            o("label", null, [
              o("span", null, u(s("life.companion.persona.conscientiousness")), 1),
              y(o("input", {
                "onUpdate:modelValue": r[19] || (r[19] = (c) => _.value.traits.conscientiousness = c),
                type: "number",
                step: "0.05",
                min: "0",
                max: "1",
                class: "field tiny"
              }, null, 512), [
                [
                  S,
                  _.value.traits.conscientiousness,
                  void 0,
                  { number: !0 }
                ]
              ])
            ]),
            o("label", null, [
              o("span", null, u(s("life.companion.persona.openness")), 1),
              y(o("input", {
                "onUpdate:modelValue": r[20] || (r[20] = (c) => _.value.traits.openness = c),
                type: "number",
                step: "0.05",
                min: "0",
                max: "1",
                class: "field tiny"
              }, null, 512), [
                [
                  S,
                  _.value.traits.openness,
                  void 0,
                  { number: !0 }
                ]
              ])
            ]),
            o("label", null, [
              o("span", null, u(s("life.companion.persona.attachAnxiety")), 1),
              y(o("input", {
                "onUpdate:modelValue": r[21] || (r[21] = (c) => _.value.traits.attach_anxiety = c),
                type: "number",
                step: "0.05",
                min: "0",
                max: "1",
                class: "field tiny"
              }, null, 512), [
                [
                  S,
                  _.value.traits.attach_anxiety,
                  void 0,
                  { number: !0 }
                ]
              ])
            ]),
            o("label", null, [
              o("span", null, u(s("life.companion.persona.attachAvoidance")), 1),
              y(o("input", {
                "onUpdate:modelValue": r[22] || (r[22] = (c) => _.value.traits.attach_avoidance = c),
                type: "number",
                step: "0.05",
                min: "0",
                max: "1",
                class: "field tiny"
              }, null, 512), [
                [
                  S,
                  _.value.traits.attach_avoidance,
                  void 0,
                  { number: !0 }
                ]
              ])
            ])
          ]),
          o("details", ms, [
            o("summary", null, u(s("life.companion.persona.moreStyle")), 1),
            o("div", _s, [
              o("label", null, [
                o("span", null, u(s("life.companion.persona.expressiveness")), 1),
                y(o("input", {
                  "onUpdate:modelValue": r[23] || (r[23] = (c) => _.value.traits.expressiveness = c),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    S,
                    _.value.traits.expressiveness,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              o("label", null, [
                o("span", null, u(s("life.companion.persona.initiative")), 1),
                y(o("input", {
                  "onUpdate:modelValue": r[24] || (r[24] = (c) => _.value.traits.initiative = c),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    S,
                    _.value.traits.initiative,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              o("label", null, [
                o("span", null, u(s("life.companion.persona.humor")), 1),
                y(o("input", {
                  "onUpdate:modelValue": r[25] || (r[25] = (c) => _.value.traits.humor = c),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    S,
                    _.value.traits.humor,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              o("label", null, [
                o("span", null, u(s("life.companion.persona.warmth")), 1),
                y(o("input", {
                  "onUpdate:modelValue": r[26] || (r[26] = (c) => _.value.traits.warmth = c),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    S,
                    _.value.traits.warmth,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              o("label", null, [
                o("span", null, u(s("life.companion.persona.formality")), 1),
                y(o("input", {
                  "onUpdate:modelValue": r[27] || (r[27] = (c) => _.value.traits.formality = c),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    S,
                    _.value.traits.formality,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              o("label", null, [
                o("span", null, u(s("life.companion.persona.assertiveness")), 1),
                y(o("input", {
                  "onUpdate:modelValue": r[28] || (r[28] = (c) => _.value.traits.assertiveness = c),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    S,
                    _.value.traits.assertiveness,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ])
            ])
          ]),
          _.value.attachment.type ? (b(), w(pt, { key: 1 }, [
            o("h4", null, u(s("life.companion.persona.attachmentHeading", { label: _.value.relationship.label })), 1),
            o("div", vs, [
              o("label", null, [
                o("span", null, u(s("life.companion.persona.attachTypeByRelationship")), 1),
                o("input", {
                  class: "field",
                  value: s("life.companion.attachmentTypeValue", { type: _.value.attachment.type, label: _.value.relationship.label || "" }),
                  disabled: ""
                }, null, 8, gs)
              ]),
              o("label", null, [
                o("span", null, u(s("life.companion.persona.initialAnxietyX")), 1),
                y(o("input", {
                  "onUpdate:modelValue": r[29] || (r[29] = (c) => _.value.attachment.initial.X = c),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    S,
                    _.value.attachment.initial.X,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              o("label", null, [
                o("span", null, u(s("life.companion.persona.initialSecurityS")), 1),
                y(o("input", {
                  "onUpdate:modelValue": r[30] || (r[30] = (c) => _.value.attachment.initial.S = c),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    S,
                    _.value.attachment.initial.S,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ])
            ]),
            o("p", ys, u(s("life.companion.persona.attachmentHint")), 1)
          ], 64)) : (b(), w("p", bs, u(s("life.companion.persona.attachmentDisabled")), 1)),
          _.value.tsundere && _.value.tsundere.type ? (b(), w(pt, { key: 3 }, [
            o("h4", null, u(s("life.companion.persona.tsundereHeading")), 1),
            o("div", ws, [
              o("label", null, [
                o("span", null, u(s("life.companion.persona.tsundereType")), 1),
                o("input", {
                  class: "field",
                  value: _.value.tsundere.type,
                  disabled: ""
                }, null, 8, xs)
              ]),
              o("label", null, [
                o("span", null, u(s("life.companion.persona.initialAffectionA")), 1),
                y(o("input", {
                  "onUpdate:modelValue": r[31] || (r[31] = (c) => _.value.tsundere.initial.A = c),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    S,
                    _.value.tsundere.initial.A,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              o("label", null, [
                o("span", null, u(s("life.companion.persona.initialTsunExpressionT")), 1),
                y(o("input", {
                  "onUpdate:modelValue": r[32] || (r[32] = (c) => _.value.tsundere.initial.T = c),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    S,
                    _.value.tsundere.initial.T,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              o("label", null, [
                o("span", null, u(s("life.companion.persona.initialYandereY")), 1),
                y(o("input", {
                  "onUpdate:modelValue": r[33] || (r[33] = (c) => _.value.tsundere.initial.Y = c),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    S,
                    _.value.tsundere.initial.Y,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ])
            ]),
            o("p", Ps, u(s("life.companion.persona.tsundereHint")), 1)
          ], 64)) : (b(), w("p", Ls, u(s("life.companion.persona.tsundereDisabled")), 1)),
          _.value.personadyn && _.value.personadyn.type ? (b(), w(pt, { key: 5 }, [
            o("h4", null, u(s("life.companion.persona.personadynHeading")), 1),
            o("div", Ts, [
              o("label", null, [
                o("span", null, u(s("life.companion.persona.personaArchetype")), 1),
                o("input", {
                  class: "field",
                  value: _.value.personadyn.type,
                  disabled: ""
                }, null, 8, ks)
              ]),
              o("label", null, [
                o("span", null, u(s("life.companion.persona.initialAffectionA")), 1),
                y(o("input", {
                  "onUpdate:modelValue": r[34] || (r[34] = (c) => _.value.personadyn.initial.A = c),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    S,
                    _.value.personadyn.initial.A,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              o("label", null, [
                o("span", null, u(s("life.companion.persona.initialAnxietyX")), 1),
                y(o("input", {
                  "onUpdate:modelValue": r[35] || (r[35] = (c) => _.value.personadyn.initial.X = c),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    S,
                    _.value.personadyn.initial.X,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              o("label", null, [
                o("span", null, u(s("life.companion.persona.initialPossessionO")), 1),
                y(o("input", {
                  "onUpdate:modelValue": r[36] || (r[36] = (c) => _.value.personadyn.initial.O = c),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    S,
                    _.value.personadyn.initial.O,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              o("label", null, [
                o("span", null, u(s("life.companion.persona.initialTrustTr")), 1),
                y(o("input", {
                  "onUpdate:modelValue": r[37] || (r[37] = (c) => _.value.personadyn.initial.Tr = c),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    S,
                    _.value.personadyn.initial.Tr,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              o("label", null, [
                o("span", null, u(s("life.companion.persona.initialSelfControlK")), 1),
                y(o("input", {
                  "onUpdate:modelValue": r[38] || (r[38] = (c) => _.value.personadyn.initial.K = c),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    S,
                    _.value.personadyn.initial.K,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              o("label", null, [
                o("span", null, u(s("life.companion.persona.genderSocialScript")), 1),
                Ct(Et(At), {
                  modelValue: _.value.personadynGender,
                  "onUpdate:modelValue": r[39] || (r[39] = (c) => _.value.personadynGender = c),
                  options: yi.value,
                  "aria-label": s("life.companion.persona.genderSocialScriptAria")
                }, null, 8, ["modelValue", "options", "aria-label"])
              ])
            ]),
            o("p", Ss, u(s("life.companion.persona.personadynHint")), 1)
          ], 64)) : (b(), w("p", Cs, u(s("life.companion.persona.personadynDisabled")), 1))
        ])) : Z("", !0)
      ], 512), [
        [Fi, Mt.value === "persona"]
      ]),
      y(o("section", Ms, [
        o("div", zs, [
          o("div", null, [
            o("h2", null, u(s("life.companion.cognition.title")), 1),
            o("p", Os, u(s("life.companion.cognition.desc")), 1)
          ]),
          o("div", Es, [
            o("button", {
              class: "btn filled sm",
              disabled: V.value,
              onClick: X
            }, u(V.value ? s("life.companion.saving") : s("life.companion.saveSettings")), 9, As)
          ])
        ]),
        o("article", Zs, [
          o("h3", null, [
            ft(u(s("life.companion.life.title")) + " ", 1),
            o("span", {
              class: ke(["count-pill", { ok: ut.value?.alive }])
            }, u(ut.value?.alive ? s("life.companion.life.alive") : s("life.companion.life.notStarted")), 3)
          ]),
          o("div", Is, [
            o("div", Bs, [
              o("span", null, u(s("life.companion.life.status")), 1),
              o("strong", null, u(ut.value?.alive ? s("life.companion.life.alive") : s("life.companion.life.notStarted")), 1)
            ]),
            o("div", Ns, [
              o("span", null, u(s("life.companion.life.livedFor")), 1),
              o("strong", null, u(Yi()), 1)
            ]),
            o("div", Ds, [
              o("span", null, u(s("life.companion.life.ticks")), 1),
              o("strong", null, u(ut.value?.ticks ?? 0), 1)
            ]),
            o("div", Rs, [
              o("span", null, u(s("life.companion.life.residentThinking")), 1),
              o("strong", null, u(ut.value?.resident_running ? s("life.companion.status.running") : s("life.companion.status.stopped")), 1)
            ]),
            o("div", Vs, [
              o("span", null, u(s("life.companion.life.proactive")), 1),
              o("strong", null, u(ut.value?.proactive_enabled ? s("life.companion.on") : s("life.companion.off")), 1)
            ]),
            o("div", Us, [
              o("span", null, u(s("life.companion.life.lastThought")), 1),
              o("strong", null, u((ut.value?.last_tick || "").slice(0, 16).replace("T", " ") || "—"), 1)
            ])
          ]),
          ut.value?.last_thought ? (b(), w("p", Fs, u(s("life.companion.life.currentThought", { text: ut.value.last_thought })), 1)) : Z("", !0),
          ut.value?.focus ? (b(), w("p", Hs, u(s("life.companion.life.focus", { text: ut.value.focus })), 1)) : Z("", !0),
          ut.value?.active_goal ? (b(), w("p", Ws, u(s("life.companion.life.goal", { text: ut.value.active_goal })), 1)) : Z("", !0),
          o("div", Gs, [
            o("label", js, [
              y(o("input", {
                type: "checkbox",
                "onUpdate:modelValue": r[40] || (r[40] = (c) => wi.value = c)
              }, null, 512), [
                [at, wi.value]
              ]),
              o("span", null, u(s("life.companion.life.greetOnStart")), 1)
            ]),
            o("button", {
              class: ke(["btn sm", { filled: !ut.value?.alive }]),
              disabled: Nt.value || q.value,
              onClick: r[41] || (r[41] = (c) => ut.value?.alive ? Pi() : xi())
            }, u(Nt.value ? Ge() : ut.value?.alive ? s("life.companion.life.pause") : s("life.companion.life.start")), 11, qs)
          ]),
          o("p", Ks, u(s("life.companion.life.hint")), 1)
        ]),
        o("article", $s, [
          o("h3", null, [
            ft(u(s("life.companion.realtime.title")) + " ", 1),
            o("span", {
              class: ke(["count-pill", { ok: ot.value?.enabled }])
            }, u(ot.value?.enabled ? s("life.companion.status.running") : s("life.companion.status.stopped")), 3),
            Be.value ? (b(), w("span", Ys, u(s("life.companion.realtime.updatedAt", { time: Be.value })), 1)) : Z("", !0)
          ]),
          ot.value ? (b(), w("div", Xs, [
            o("div", Qs, [
              o("span", null, u(s("life.companion.metric.arbitrationMode")), 1),
              o("strong", null, u(I.value?.mode || "—"), 1)
            ]),
            o("div", tr, [
              o("span", null, u(s("life.companion.metric.currentStrategy")), 1),
              o("strong", null, u(I.value?.action || "—"), 1)
            ]),
            o("div", er, [
              o("span", null, u(s("life.companion.metric.controlNeed")), 1),
              o("strong", null, u(R(I.value?.need)), 1)
            ]),
            o("div", ir, [
              o("span", null, u(s("life.companion.metric.confidence")), 1),
              o("strong", null, u(R(I.value?.confidence)), 1)
            ]),
            o("div", nr, [
              o("span", null, u(s("life.companion.metric.decidedTurns")), 1),
              o("strong", null, u(fe.value?.turns ?? 0), 1)
            ]),
            o("div", or, [
              o("span", null, u(s("life.companion.metric.engrams")), 1),
              o("strong", null, u(fe.value?.engrams ?? 0), 1)
            ]),
            o("div", ar, [
              o("span", null, u(s("life.companion.metric.reliability")), 1),
              o("strong", null, u(R(fe.value?.reliability)), 1)
            ]),
            o("div", sr, [
              o("span", null, u(s("life.companion.metric.mood")), 1),
              o("strong", null, u(R(M.value?.mood)), 1)
            ]),
            o("div", rr, [
              o("span", null, u(s("life.companion.metric.vagalTone")), 1),
              o("strong", null, u(R(M.value?.vagal_tone)), 1)
            ]),
            o("div", lr, [
              o("span", null, u(s("life.companion.metric.somatizationIndex")), 1),
              o("strong", null, u(R(M.value?.somatization_index)), 1)
            ]),
            o("div", ur, [
              o("span", null, u(s("life.companion.metric.healthAnxiety")), 1),
              o("strong", null, u(R(M.value?.health_anxiety)), 1)
            ]),
            o("div", cr, [
              o("span", null, u(s("life.companion.metric.somaticBurden")), 1),
              o("strong", null, u(R(M.value?.somatic_burden)), 1)
            ]),
            o("div", hr, [
              o("span", null, u(s("life.companion.metric.personaTraits")), 1),
              o("strong", null, u(nt.value?.applied ? nt.value.source === "llm" ? s("life.companion.metric.appliedLlm") : s("life.companion.metric.appliedLocal") : s("life.companion.metric.notParsed")), 1)
            ]),
            o("div", dr, [
              o("span", null, u(s("life.companion.metric.lexicon")), 1),
              o("strong", null, u(it.value?.lexicon_size ?? 0), 1)
            ]),
            o("div", fr, [
              o("span", null, u(s("life.companion.metric.empathy")), 1),
              o("strong", null, u(R(xt.value?.empathy)), 1)
            ]),
            o("div", pr, [
              o("span", null, u(s("life.companion.metric.perspectiveStage")), 1),
              o("strong", null, u(xt.value?.perspective_name || "—"), 1)
            ]),
            o("div", mr, [
              o("span", null, u(s("life.companion.metric.attentionState")), 1),
              o("strong", null, u(Pt.value?.attention_state || "—"), 1)
            ]),
            o("div", _r, [
              o("span", null, u(s("life.companion.metric.patience")), 1),
              o("strong", null, u(R(Pt.value?.patience)), 1)
            ]),
            B.value?.enabled ? (b(), w(pt, { key: 0 }, [
              o("div", vr, [
                o("span", null, u(s("life.companion.metric.attachmentType")), 1),
                o("strong", null, u(B.value.label || B.value.type), 1)
              ]),
              o("div", gr, [
                o("span", null, u(s("life.companion.metric.severity")), 1),
                o("strong", null, u(R(B.value.severity, 2)) + " · " + u(B.value.band), 1)
              ]),
              o("div", yr, [
                o("span", null, u(s("life.companion.metric.dominantTendency")), 1),
                o("strong", null, u(B.value.dominant || "—"), 1)
              ]),
              o("div", br, [
                o("span", null, u(s("life.companion.metric.attachmentDistress")), 1),
                o("strong", null, u(R(B.value.distress, 2)), 1)
              ]),
              o("div", wr, [
                o("span", null, u(s("life.companion.metric.comorbidDepression")), 1),
                o("strong", null, u(R(B.value.comorbid_depression, 2)), 1)
              ])
            ], 64)) : Z("", !0),
            O.value?.enabled ? (b(), w(pt, { key: 1 }, [
              o("div", xr, [
                o("span", null, u(s("life.companion.persona.tsundereType")), 1),
                o("strong", null, u(O.value.label || O.value.type), 1)
              ]),
              o("div", Pr, [
                o("span", null, u(s("life.companion.metric.affectionA")), 1),
                o("strong", null, u(R(O.value.affection, 2)), 1)
              ]),
              o("div", Lr, [
                o("span", null, u(s("life.companion.metric.tsunExpressionT")), 1),
                o("strong", null, u(R(O.value.expression, 2)), 1)
              ]),
              o("div", Tr, [
                o("span", null, u(s("life.companion.metric.yandereY")), 1),
                o("strong", null, u(R(O.value.fixation, 2)) + " · " + u(O.value.band), 1)
              ]),
              o("div", kr, [
                o("span", null, u(s("life.companion.metric.safetyLayer")), 1),
                o("strong", null, u(O.value.safe_mode ? s("life.companion.metric.triggered") : s("life.companion.metric.normal")), 1)
              ])
            ], 64)) : Z("", !0),
            C.value?.enabled ? (b(), w(pt, { key: 2 }, [
              o("div", Sr, [
                o("span", null, u(s("life.companion.persona.personaArchetype")), 1),
                o("strong", null, u(C.value.label || C.value.type), 1)
              ]),
              o("div", Cr, [
                o("span", null, u(s("life.companion.metric.emergentMode")), 1),
                o("strong", null, u(C.value.mode_label || C.value.mode), 1)
              ]),
              o("div", Mr, [
                o("span", null, u(s("life.companion.metric.readiness")), 1),
                o("strong", null, u(R(C.value.pressure, 2)) + " · " + u(C.value.band), 1)
              ]),
              o("div", zr, [
                o("span", null, u(s("life.companion.metric.affectionAnxiety")), 1),
                o("strong", null, u(R(C.value.affection, 2)) + " / " + u(R(C.value.anxiety, 2)), 1)
              ]),
              o("div", Or, [
                o("span", null, u(s("life.companion.metric.possessionTrust")), 1),
                o("strong", null, u(R(C.value.possessiveness, 2)) + " / " + u(R(C.value.trust, 2)), 1)
              ]),
              o("div", Er, [
                o("span", null, u(s("life.companion.metric.selfControlSuppression")), 1),
                o("strong", null, u(R(C.value.self_control, 2)) + " / " + u(R(C.value.suppression, 2)), 1)
              ]),
              C.value.gender ? (b(), w("div", Ar, [
                o("span", null, u(s("life.companion.persona.genderSocialScript")), 1),
                o("strong", null, u(C.value.gender), 1)
              ])) : Z("", !0),
              C.value.help_seek != null ? (b(), w("div", Zr, [
                o("span", null, u(s("life.companion.metric.helpSeeking")), 1),
                o("strong", null, u(R(C.value.help_seek, 2)), 1)
              ])) : Z("", !0),
              C.value.big5 ? (b(), w("div", Ir, [
                r[100] || (r[100] = o("span", null, "Big5 O·C·E·A·N", -1)),
                o("strong", null, u(Kt.value), 1)
              ])) : Z("", !0),
              C.value.hexaco ? (b(), w("div", Br, [
                r[101] || (r[101] = o("span", null, "HEXACO H·E·X·A·C·O", -1)),
                o("strong", null, u(Ki.value), 1)
              ])) : Z("", !0),
              C.value.mbti ? (b(), w("div", Nr, [
                r[102] || (r[102] = o("span", null, "MBTI / DISC", -1)),
                o("strong", null, u(C.value.mbti) + " · " + u(C.value.disc || "—"), 1)
              ])) : Z("", !0),
              C.value.theta_dim ? (b(), w("div", Dr, [
                o("span", null, u(s("life.companion.metric.thetaDim")), 1),
                o("strong", null, u(s("life.companion.dimensionsValue", { n: C.value.theta_dim })) + " · " + u(C.value.family || "—"), 1)
              ])) : Z("", !0),
              We.value.length ? (b(), w("div", Rr, [
                o("span", null, u(s("life.companion.metric.topDesires")), 1),
                o("strong", null, u(We.value.join(" · ")), 1)
              ])) : Z("", !0),
              pe.value.length ? (b(), w("div", Vr, [
                o("span", null, u(s("life.companion.metric.topEmotions")), 1),
                o("strong", null, u(pe.value.join(" · ")), 1)
              ])) : Z("", !0),
              C.value.learning?.enabled ? (b(), w("div", Ur, [
                o("span", null, u(s("life.companion.metric.learningState")), 1),
                o("strong", null, u(C.value.learning.q_size) + " · " + u(R(bi.value, 3)), 1)
              ])) : Z("", !0),
              C.value.clinical ? (b(), w("div", Fr, [
                o("span", null, u(s("life.companion.metric.clinicalLabel")), 1),
                o("strong", null, u(s("life.companion.simulationMode")), 1)
              ])) : Z("", !0)
            ], 64)) : Z("", !0),
            $t.value ? (b(), w(pt, { key: 3 }, [
              o("div", Hr, [
                o("span", null, u(s("life.companion.metric.episodeCourse")), 1),
                o("strong", null, u($i($t.value.state)), 1)
              ]),
              o("div", Wr, [
                o("span", null, u(s("life.companion.metric.episodeSeverity")), 1),
                o("strong", null, u(R($t.value.severity, 2)), 1)
              ]),
              o("div", Gr, [
                o("span", null, u(s("life.companion.metric.episodesRelapses")), 1),
                o("strong", null, u($t.value.episodes) + " / " + u($t.value.relapses), 1)
              ]),
              $t.value.state === "episode" ? (b(), w("div", jr, [
                o("span", null, u(s("life.companion.metric.duration")), 1),
                o("strong", null, u(s("life.companion.daysValue", { n: R($t.value.days_in_episode, 1) })), 1)
              ])) : Z("", !0)
            ], 64)) : Z("", !0)
          ])) : (b(), w("div", Js, u(s("life.companion.realtime.empty")), 1)),
          $t.value ? (b(), w("p", qr, u(s("life.companion.realtime.episodeHint")), 1)) : Z("", !0),
          B.value?.enabled ? (b(), w("p", Kr, u(s("life.companion.realtime.attachmentHint", { label: B.value.label, severity: R(B.value.severity, 2), band: B.value.band, safety: B.value.safe_mode ? s("life.companion.realtime.safetyOnEmotion") : s("life.companion.realtime.safetyOff") })), 1)) : Z("", !0),
          O.value?.enabled ? (b(), w("p", $r, u(s("life.companion.realtime.tsundereHint", { label: O.value.label || O.value.type, affection: R(O.value.affection, 2), expression: R(O.value.expression, 2), fixation: R(O.value.fixation, 2), band: O.value.band, safety: O.value.safe_mode ? s("life.companion.realtime.safetyOnFeeling") : s("life.companion.realtime.safetyOff") })), 1)) : Z("", !0),
          C.value?.enabled ? (b(), w("p", Yr, u(s("life.companion.realtime.personadynHint", { label: C.value.label || C.value.type, family: C.value.family || "—", theta: C.value.theta_dim, mode: C.value.mode_label || C.value.mode, pressure: R(C.value.pressure, 2), band: C.value.band, gender: C.value.gender || vt("life.companion.pdGender.unspecified"), learning: C.value.learning?.enabled ? s("life.companion.realtime.learningOnline") : "", safety: C.value.safe_mode ? s("life.companion.realtime.safetyOnFeeling") : s("life.companion.realtime.safetyOff") })), 1)) : Z("", !0),
          nt.value?.applied ? (b(), w("p", Jr, u(s("life.companion.realtime.personaApplied", { source: nt.value.source === "llm" ? s("life.companion.realtime.personaSourceLlm") : s("life.companion.realtime.personaSourceLocal"), evidence: vn.value || "—" })), 1)) : Z("", !0),
          je.value ? (b(), w("div", Xr, [
            (b(!0), w(pt, null, oe(je.value, (c, x) => (b(), w("div", {
              key: x,
              class: "som-chan"
            }, [
              o("span", Qr, u(Li(x)), 1),
              o("span", tl, [
                o("i", {
                  style: Nn({ transform: "scaleX(" + Ji(c) + ")" })
                }, null, 4)
              ]),
              o("span", el, u(R(c, 2)), 1)
            ]))), 128)),
            Number(M.value?.somatic_chronicity) > 0.1 ? (b(), w("p", il, u(s("life.companion.realtime.somaticChronicity", { value: R(M.value?.somatic_chronicity) })), 1)) : Z("", !0)
          ])) : Z("", !0)
        ]),
        o("article", nl, [
          o("h3", null, u(s("life.companion.switches.title")), 1),
          o("div", ol, [
            o("label", al, [
              y(o("input", {
                type: "checkbox",
                "onUpdate:modelValue": r[42] || (r[42] = (c) => g.value.cog_enabled = c)
              }, null, 512), [
                [at, g.value.cog_enabled]
              ]),
              o("span", null, u(s("life.companion.switches.enableCognition")), 1)
            ]),
            o("label", sl, [
              y(o("input", {
                type: "checkbox",
                "onUpdate:modelValue": r[43] || (r[43] = (c) => g.value.cog_lite_mode = c)
              }, null, 512), [
                [at, g.value.cog_lite_mode]
              ]),
              o("span", null, u(s("life.companion.switches.liteMode")), 1)
            ]),
            o("label", rl, [
              y(o("input", {
                type: "checkbox",
                "onUpdate:modelValue": r[44] || (r[44] = (c) => g.value.cog_modulate_affect = c)
              }, null, 512), [
                [at, g.value.cog_modulate_affect]
              ]),
              o("span", null, u(s("life.companion.switches.modulateAffect")), 1)
            ]),
            o("label", ll, [
              y(o("input", {
                type: "checkbox",
                "onUpdate:modelValue": r[45] || (r[45] = (c) => g.value.cog_modulate_language = c)
              }, null, 512), [
                [at, g.value.cog_modulate_language]
              ]),
              o("span", null, u(s("life.companion.switches.modulateLanguage")), 1)
            ]),
            o("label", ul, [
              y(o("input", {
                type: "checkbox",
                "onUpdate:modelValue": r[46] || (r[46] = (c) => g.value.cog_modulate_social = c)
              }, null, 512), [
                [at, g.value.cog_modulate_social]
              ]),
              o("span", null, u(s("life.companion.switches.modulateSocial")), 1)
            ]),
            o("label", cl, [
              y(o("input", {
                type: "checkbox",
                "onUpdate:modelValue": r[47] || (r[47] = (c) => g.value.cog_modulate_selfhood = c)
              }, null, 512), [
                [at, g.value.cog_modulate_selfhood]
              ]),
              o("span", null, u(s("life.companion.switches.modulateSelfhood")), 1)
            ])
          ]),
          o("p", hl, u(s("life.companion.switches.hint")), 1)
        ]),
        o("article", dl, [
          o("h3", null, u(s("life.companion.presets.title")), 1),
          o("p", fl, u(s("life.companion.presets.hint")), 1),
          o("div", pl, [
            (b(), w(pt, null, oe(_n, (c) => o("button", {
              key: c.label,
              type: "button",
              class: "btn sm",
              onClick: (x) => mn(c.fields, c.label)
            }, u(s(c.labelKey)), 9, ml)), 64))
          ])
        ]),
        o("div", _l, [
          o("article", vl, [
            o("h3", null, u(s("life.companion.decision.title")), 1),
            o("div", gl, [
              o("label", null, [
                o("span", null, u(s("life.companion.decision.planDepth")), 1),
                y(o("input", {
                  "onUpdate:modelValue": r[48] || (r[48] = (c) => g.value.cog_plan_depth = c),
                  type: "number",
                  min: "1",
                  max: "6",
                  class: "field tiny"
                }, null, 512), [
                  [
                    S,
                    g.value.cog_plan_depth,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              o("label", null, [
                o("span", null, u(s("life.companion.decision.wmCapacity")), 1),
                y(o("input", {
                  "onUpdate:modelValue": r[49] || (r[49] = (c) => g.value.cog_wm_capacity = c),
                  type: "number",
                  min: "1",
                  max: "12",
                  class: "field tiny"
                }, null, 512), [
                  [
                    S,
                    g.value.cog_wm_capacity,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              o("label", null, [
                o("span", null, u(s("life.companion.decision.strategyTemp")), 1),
                y(o("input", {
                  "onUpdate:modelValue": r[50] || (r[50] = (c) => g.value.cog_tau = c),
                  type: "number",
                  step: "0.05",
                  min: "0.05",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    S,
                    g.value.cog_tau,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              o("label", null, [
                o("span", null, u(s("life.companion.decision.discount")), 1),
                y(o("input", {
                  "onUpdate:modelValue": r[51] || (r[51] = (c) => g.value.cog_gamma = c),
                  type: "number",
                  step: "0.01",
                  min: "0",
                  max: "0.999",
                  class: "field tiny"
                }, null, 512), [
                  [
                    S,
                    g.value.cog_gamma,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              o("label", null, [
                o("span", null, u(s("life.companion.decision.habitRate")), 1),
                y(o("input", {
                  "onUpdate:modelValue": r[52] || (r[52] = (c) => g.value.cog_alpha_habit = c),
                  type: "number",
                  step: "0.01",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    S,
                    g.value.cog_alpha_habit,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              o("label", null, [
                o("span", null, u(s("life.companion.decision.modelfreeRate")), 1),
                y(o("input", {
                  "onUpdate:modelValue": r[53] || (r[53] = (c) => g.value.cog_alpha_mf = c),
                  type: "number",
                  step: "0.01",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    S,
                    g.value.cog_alpha_mf,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              o("label", null, [
                o("span", null, u(s("life.companion.decision.surpriseThreshold")), 1),
                y(o("input", {
                  "onUpdate:modelValue": r[54] || (r[54] = (c) => g.value.cog_theta_pe = c),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    S,
                    g.value.cog_theta_pe,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              o("label", null, [
                o("span", null, u(s("life.companion.decision.noveltyThreshold")), 1),
                y(o("input", {
                  "onUpdate:modelValue": r[55] || (r[55] = (c) => g.value.cog_theta_n = c),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    S,
                    g.value.cog_theta_n,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              o("label", null, [
                o("span", null, u(s("life.companion.decision.prospectionHorizon")), 1),
                y(o("input", {
                  "onUpdate:modelValue": r[56] || (r[56] = (c) => g.value.cog_prospection_horizon = c),
                  type: "number",
                  min: "1",
                  max: "8",
                  class: "field tiny"
                }, null, 512), [
                  [
                    S,
                    g.value.cog_prospection_horizon,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ])
            ]),
            o("div", yl, [
              o("label", bl, [
                y(o("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": r[57] || (r[57] = (c) => g.value.cog_use_thalamic_gate = c)
                }, null, 512), [
                  [at, g.value.cog_use_thalamic_gate]
                ]),
                o("span", null, u(s("life.companion.decision.thalamicGate")), 1)
              ]),
              o("label", wl, [
                y(o("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": r[58] || (r[58] = (c) => g.value.cog_use_cerebellum = c)
                }, null, 512), [
                  [at, g.value.cog_use_cerebellum]
                ]),
                o("span", null, u(s("life.companion.decision.cerebellum")), 1)
              ]),
              o("label", xl, [
                y(o("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": r[59] || (r[59] = (c) => g.value.cog_use_ofc_map = c)
                }, null, 512), [
                  [at, g.value.cog_use_ofc_map]
                ]),
                o("span", null, u(s("life.companion.decision.ofcMap")), 1)
              ]),
              o("label", Pl, [
                y(o("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": r[60] || (r[60] = (c) => g.value.cog_use_prospection = c)
                }, null, 512), [
                  [at, g.value.cog_use_prospection]
                ]),
                o("span", null, u(s("life.companion.decision.prospection")), 1)
              ]),
              o("label", Ll, [
                y(o("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": r[61] || (r[61] = (c) => g.value.cog_use_limbic_bias = c)
                }, null, 512), [
                  [at, g.value.cog_use_limbic_bias]
                ]),
                o("span", null, u(s("life.companion.decision.limbicBias")), 1)
              ])
            ])
          ]),
          o("article", Tl, [
            o("h3", null, u(s("life.companion.affect.title")), 1),
            o("div", kl, [
              o("label", null, [
                o("span", null, u(s("life.companion.persona.erqProfile")), 1),
                Ct(Et(At), {
                  modelValue: g.value.cog_affect_profile,
                  "onUpdate:modelValue": r[62] || (r[62] = (c) => g.value.cog_affect_profile = c),
                  options: Fe.value,
                  "aria-label": s("life.companion.persona.erqProfile")
                }, null, 8, ["modelValue", "options", "aria-label"])
              ]),
              o("label", null, [
                o("span", null, u(s("life.companion.affect.vagalBaseline")), 1),
                y(o("input", {
                  "onUpdate:modelValue": r[63] || (r[63] = (c) => g.value.cog_affect_vagal = c),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    S,
                    g.value.cog_affect_vagal,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              o("label", null, [
                o("span", null, u(s("life.companion.persona.threatBaseline")), 1),
                y(o("input", {
                  "onUpdate:modelValue": r[64] || (r[64] = (c) => g.value.cog_affect_threat = c),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    S,
                    g.value.cog_affect_threat,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              o("label", null, [
                o("span", null, u(s("life.companion.persona.rewardBaseline")), 1),
                y(o("input", {
                  "onUpdate:modelValue": r[65] || (r[65] = (c) => g.value.cog_affect_reward = c),
                  type: "number",
                  step: "0.1",
                  min: "0",
                  max: "2",
                  class: "field tiny"
                }, null, 512), [
                  [
                    S,
                    g.value.cog_affect_reward,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ])
            ]),
            o("label", Sl, [
              y(o("input", {
                type: "checkbox",
                "onUpdate:modelValue": r[66] || (r[66] = (c) => g.value.cog_affect_enabled = c)
              }, null, 512), [
                [at, g.value.cog_affect_enabled]
              ]),
              o("span", null, u(s("life.companion.affect.enable")), 1)
            ]),
            o("label", Cl, [
              y(o("input", {
                type: "checkbox",
                "onUpdate:modelValue": r[67] || (r[67] = (c) => g.value.cog_affect_somatic = c)
              }, null, 512), [
                [at, g.value.cog_affect_somatic]
              ]),
              o("span", null, u(s("life.companion.affect.somatic")), 1)
            ]),
            o("label", Ml, [
              y(o("input", {
                type: "checkbox",
                "onUpdate:modelValue": r[68] || (r[68] = (c) => g.value.cog_affect_persona_llm = c)
              }, null, 512), [
                [at, g.value.cog_affect_persona_llm]
              ]),
              o("span", null, u(s("life.companion.affect.personaLlm")), 1)
            ])
          ]),
          o("article", zl, [
            o("h3", null, u(s("life.companion.language.title")), 1),
            o("div", Ol, [
              o("label", null, [
                o("span", null, u(s("life.companion.language.framing")), 1),
                Ct(Et(At), {
                  modelValue: g.value.cog_language_framing,
                  "onUpdate:modelValue": r[69] || (r[69] = (c) => g.value.cog_language_framing = c),
                  options: ji.value,
                  "aria-label": s("life.companion.language.framing")
                }, null, 8, ["modelValue", "options", "aria-label"])
              ]),
              o("label", null, [
                o("span", null, u(s("life.companion.language.boundary")), 1),
                y(o("input", {
                  "onUpdate:modelValue": r[70] || (r[70] = (c) => g.value.cog_language_boundary = c),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    S,
                    g.value.cog_language_boundary,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ])
            ]),
            o("label", El, [
              y(o("input", {
                type: "checkbox",
                "onUpdate:modelValue": r[71] || (r[71] = (c) => g.value.cog_language_enabled = c)
              }, null, 512), [
                [at, g.value.cog_language_enabled]
              ]),
              o("span", null, u(s("life.companion.language.enable")), 1)
            ])
          ]),
          o("article", Al, [
            o("h3", null, u(s("life.companion.social.title")), 1),
            o("div", Zl, [
              o("label", null, [
                o("span", null, u(s("life.companion.metric.empathy")), 1),
                y(o("input", {
                  "onUpdate:modelValue": r[72] || (r[72] = (c) => g.value.cog_social_empathy = c),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    S,
                    g.value.cog_social_empathy,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              o("label", null, [
                o("span", null, u(s("life.companion.social.perspectiveStage")), 1),
                Ct(Et(At), {
                  modelValue: qi.value,
                  "onUpdate:modelValue": r[73] || (r[73] = (c) => qi.value = c),
                  options: Zt.value,
                  "aria-label": s("life.companion.social.perspectiveStage")
                }, null, 8, ["modelValue", "options", "aria-label"])
              ])
            ]),
            o("label", Il, [
              y(o("input", {
                type: "checkbox",
                "onUpdate:modelValue": r[74] || (r[74] = (c) => g.value.cog_social_enabled = c)
              }, null, 512), [
                [at, g.value.cog_social_enabled]
              ]),
              o("span", null, u(s("life.companion.social.enable")), 1)
            ])
          ]),
          o("article", Bl, [
            o("h3", null, u(s("life.companion.selfhood.title")), 1),
            o("div", Nl, [
              o("label", null, [
                o("span", null, u(s("life.companion.selfhood.timeDiscount")), 1),
                y(o("input", {
                  "onUpdate:modelValue": r[75] || (r[75] = (c) => g.value.cog_selfhood_discount = c),
                  type: "number",
                  step: "0.05",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    S,
                    g.value.cog_selfhood_discount,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              o("label", null, [
                o("span", null, u(s("life.companion.selfhood.detailScale")), 1),
                y(o("input", {
                  "onUpdate:modelValue": r[76] || (r[76] = (c) => g.value.cog_selfhood_detail = c),
                  type: "number",
                  step: "1",
                  min: "1",
                  max: "50",
                  class: "field tiny"
                }, null, 512), [
                  [
                    S,
                    g.value.cog_selfhood_detail,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ])
            ]),
            o("label", Dl, [
              y(o("input", {
                type: "checkbox",
                "onUpdate:modelValue": r[77] || (r[77] = (c) => g.value.cog_selfhood_enabled = c)
              }, null, 512), [
                [at, g.value.cog_selfhood_enabled]
              ]),
              o("span", null, u(s("life.companion.selfhood.enable")), 1)
            ])
          ]),
          o("article", Rl, [
            o("h3", null, u(s("life.companion.attachmentCard.title")), 1),
            o("p", Vl, u(s("life.companion.attachmentCard.hint")), 1),
            o("label", Ul, [
              y(o("input", {
                type: "checkbox",
                "onUpdate:modelValue": r[78] || (r[78] = (c) => g.value.cog_attachment_enabled = c)
              }, null, 512), [
                [at, g.value.cog_attachment_enabled]
              ]),
              o("span", null, u(s("life.companion.attachmentCard.enable")), 1)
            ]),
            o("div", Fl, [
              o("label", null, [
                o("span", null, u(s("life.companion.metric.attachmentType")), 1),
                Ct(Et(At), {
                  modelValue: g.value.cog_attachment_type,
                  "onUpdate:modelValue": r[79] || (r[79] = (c) => g.value.cog_attachment_type = c),
                  options: gi.value,
                  "aria-label": s("life.companion.metric.attachmentType")
                }, null, 8, ["modelValue", "options", "aria-label"])
              ])
            ]),
            o("p", Hl, u(s("life.companion.attachmentCard.hint2")), 1)
          ]),
          o("article", Wl, [
            o("h3", null, u(s("life.companion.tsundereCard.title")), 1),
            o("p", Gl, u(s("life.companion.tsundereCard.hint")), 1),
            o("label", jl, [
              y(o("input", {
                type: "checkbox",
                "onUpdate:modelValue": r[80] || (r[80] = (c) => g.value.cog_tsundere_enabled = c)
              }, null, 512), [
                [at, g.value.cog_tsundere_enabled]
              ]),
              o("span", null, u(s("life.companion.tsundereCard.enable")), 1)
            ]),
            o("div", ql, [
              o("label", null, [
                o("span", null, u(s("life.companion.persona.tsundereType")), 1),
                Ct(Et(At), {
                  modelValue: g.value.cog_tsundere_type,
                  "onUpdate:modelValue": r[81] || (r[81] = (c) => g.value.cog_tsundere_type = c),
                  options: Ve.value,
                  "aria-label": s("life.companion.persona.tsundereType")
                }, null, 8, ["modelValue", "options", "aria-label"])
              ])
            ]),
            o("p", Kl, u(s("life.companion.tsundereCard.hint2")), 1)
          ]),
          o("article", $l, [
            o("h3", null, u(s("life.companion.personadynCard.title")), 1),
            o("p", Yl, u(s("life.companion.personadynCard.hint")), 1),
            o("label", Jl, [
              y(o("input", {
                type: "checkbox",
                "onUpdate:modelValue": r[82] || (r[82] = (c) => g.value.cog_personadyn_enabled = c)
              }, null, 512), [
                [at, g.value.cog_personadyn_enabled]
              ]),
              o("span", null, u(s("life.companion.personadynCard.enable")), 1)
            ]),
            o("div", Xl, [
              o("label", null, [
                o("span", null, u(s("life.companion.persona.personaArchetype")), 1),
                Ct(Et(At), {
                  modelValue: g.value.cog_personadyn_type,
                  "onUpdate:modelValue": r[83] || (r[83] = (c) => g.value.cog_personadyn_type = c),
                  options: Gi.value,
                  "aria-label": s("life.companion.persona.personaArchetype")
                }, null, 8, ["modelValue", "options", "aria-label"])
              ]),
              o("label", null, [
                o("span", null, u(s("life.companion.persona.genderSocialScript")), 1),
                Ct(Et(At), {
                  modelValue: g.value.cog_personadyn_gender,
                  "onUpdate:modelValue": r[84] || (r[84] = (c) => g.value.cog_personadyn_gender = c),
                  options: yi.value,
                  "aria-label": s("life.companion.persona.genderSocialScriptAria")
                }, null, 8, ["modelValue", "options", "aria-label"])
              ])
            ]),
            o("p", Ql, u(s("life.companion.personadynCard.hint2")), 1),
            o("p", tu, u(s("life.companion.personadynCard.hint3")), 1)
          ]),
          o("article", eu, [
            o("h3", null, u(s("life.companion.memoryCard.title")), 1),
            o("p", iu, u(s("life.companion.memoryCard.hint")), 1),
            o("div", nu, [
              o("label", ou, [
                y(o("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": r[85] || (r[85] = (c) => g.value.cog_memory_encode = c)
                }, null, 512), [
                  [at, g.value.cog_memory_encode]
                ]),
                o("span", null, u(s("life.companion.memoryCard.selectiveEncoding")), 1)
              ]),
              o("label", au, [
                y(o("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": r[86] || (r[86] = (c) => g.value.cog_sleep_replay = c)
                }, null, 512), [
                  [at, g.value.cog_sleep_replay]
                ]),
                o("span", null, u(s("life.companion.memoryCard.sleepReplay")), 1)
              ]),
              o("label", su, [
                y(o("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": r[87] || (r[87] = (c) => g.value.cog_memory_reconsolidate = c)
                }, null, 512), [
                  [at, g.value.cog_memory_reconsolidate]
                ]),
                o("span", null, u(s("life.companion.memoryCard.reconsolidate")), 1)
              ]),
              o("label", ru, [
                y(o("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": r[88] || (r[88] = (c) => g.value.cog_cls_interleave = c)
                }, null, 512), [
                  [at, g.value.cog_cls_interleave]
                ]),
                o("span", null, u(s("life.companion.memoryCard.cls")), 1)
              ])
            ])
          ])
        ])
      ], 512), [
        [Fi, Mt.value === "cognition"]
      ]),
      y(o("section", lu, [
        o("div", uu, [
          o("div", null, [
            o("h2", null, u(s("life.companion.world.title")), 1),
            o("p", cu, u(s("life.companion.world.desc")), 1)
          ]),
          o("div", hu, [
            o("button", {
              class: "btn filled sm",
              onClick: X
            }, u(s("life.companion.saveSettings")), 1)
          ])
        ]),
        o("article", du, [
          o("h3", null, u(s("life.companion.world.density")), 1),
          o("div", fu, [
            o("label", null, [
              o("span", null, u(s("life.companion.world.density")), 1),
              Ct(Et(At), {
                modelValue: Yt.value,
                "onUpdate:modelValue": r[89] || (r[89] = (c) => Yt.value = c),
                options: gn.value,
                "aria-label": s("life.companion.world.densityAria")
              }, null, 8, ["modelValue", "options", "aria-label"])
            ])
          ]),
          o("p", pu, u(s("life.companion.world.densityHint")), 1)
        ]),
        o("article", mu, [
          o("h3", null, u(s("life.companion.world.personaTraits")), 1),
          o("p", _u, u(s("life.companion.world.personaTraitsHint")), 1),
          o("label", vu, [
            o("span", gu, u(s("life.companion.world.personaText")), 1),
            y(o("textarea", {
              "onUpdate:modelValue": r[90] || (r[90] = (c) => Je.value = c),
              class: "world-text",
              rows: "4",
              placeholder: s("life.companion.world.personaPlaceholder")
            }, null, 8, yu), [
              [S, Je.value]
            ])
          ])
        ]),
        o("article", bu, [
          o("h3", null, u(s("life.companion.world.location")), 1),
          o("p", wu, u(s("life.companion.world.locationHint")), 1),
          o("div", xu, [
            o("label", null, [
              o("span", null, u(s("life.companion.world.worldType")), 1),
              Ct(Et(At), {
                modelValue: $e.value,
                "onUpdate:modelValue": r[91] || (r[91] = (c) => $e.value = c),
                options: Si.value,
                "aria-label": s("life.companion.world.worldType")
              }, null, 8, ["modelValue", "options", "aria-label"])
            ]),
            o("label", null, [
              o("span", null, u(s("life.companion.world.country")), 1),
              y(o("input", {
                "onUpdate:modelValue": r[92] || (r[92] = (c) => Me.value = c),
                class: "field",
                placeholder: s("life.companion.world.countryPlaceholder")
              }, null, 8, Pu), [
                [S, Me.value]
              ])
            ]),
            o("label", null, [
              o("span", null, u(s("life.companion.world.city")), 1),
              y(o("input", {
                "onUpdate:modelValue": r[93] || (r[93] = (c) => ze.value = c),
                class: "field",
                placeholder: s("life.companion.world.cityPlaceholder")
              }, null, 8, Lu), [
                [S, ze.value]
              ])
            ]),
            o("label", null, [
              o("span", null, u(s("life.companion.world.district")), 1),
              y(o("input", {
                "onUpdate:modelValue": r[94] || (r[94] = (c) => Oe.value = c),
                class: "field",
                placeholder: s("life.companion.world.districtPlaceholder")
              }, null, 8, Tu), [
                [S, Oe.value]
              ])
            ])
          ]),
          o("label", ku, [
            o("span", Su, u(s("life.companion.world.premiseLabel")), 1),
            y(o("textarea", {
              "onUpdate:modelValue": r[95] || (r[95] = (c) => Ye.value = c),
              class: "world-text",
              rows: "3",
              placeholder: s("life.companion.world.premisePlaceholder")
            }, null, 8, Cu), [
              [S, Ye.value]
            ])
          ]),
          o("label", Mu, [
            o("span", zu, u(s("life.companion.world.actorsLabel")), 1),
            y(o("textarea", {
              "onUpdate:modelValue": r[96] || (r[96] = (c) => Xe.value = c),
              class: "world-text",
              rows: "4",
              placeholder: s("life.companion.world.actorsPlaceholder")
            }, null, 8, Ou), [
              [S, Xe.value]
            ])
          ]),
          o("label", Eu, [
            o("span", Au, u(s("life.companion.world.placesLabel")), 1),
            y(o("textarea", {
              "onUpdate:modelValue": r[97] || (r[97] = (c) => Qe.value = c),
              class: "world-text",
              rows: "2",
              placeholder: s("life.companion.world.placesPlaceholder")
            }, null, 8, Zu), [
              [S, Qe.value]
            ])
          ]),
          o("div", Iu, [
            o("button", {
              class: "btn filled sm",
              type: "button",
              disabled: Dt.value,
              onClick: N
            }, u(Dt.value ? s("life.companion.world.generating") : s("life.companion.world.generateMapOnly")), 9, Bu),
            o("button", {
              class: "btn tonic sm",
              type: "button",
              disabled: Dt.value,
              onClick: zi
            }, u(Dt.value ? s("life.companion.world.generating") : s("life.companion.world.generateWorld")), 9, Nu),
            o("span", Du, u(s("life.companion.world.generateHint")), 1)
          ])
        ]),
        o("article", Ru, [
          o("div", Vu, [
            o("h3", null, [
              ft(u(s("life.companion.world.map")) + " ", 1),
              o("span", Uu, u(W.value.locations.length), 1)
            ]),
            Wt.value ? (b(), w("span", Fu, u(Wt.value.fictional ? s("life.companion.worldFictional.fictional") : s("life.companion.worldFictional.real")) + " · " + u([Wt.value.country, Wt.value.city, Wt.value.district].filter(Boolean).join(" / ") || s("life.companion.world.unnamed")), 1)) : Z("", !0)
          ]),
          Wt.value?.premise ? (b(), w("p", Hu, u(Wt.value.premise), 1)) : Z("", !0),
          o("div", Wu, [
            o("div", {
              ref_key: "mapEl",
              ref: Ee,
              class: ke(["world-map-leaflet", { "is-empty": !W.value.locations.length }])
            }, null, 2),
            _e.value ? (b(), w("div", Gu, u(s("life.companion.world.offline")), 1)) : Z("", !0),
            W.value.locations.length ? (b(), w(pt, { key: 1 }, [
              W.value.kind !== "real" && W.value.nation ? (b(), w("button", {
                key: 0,
                type: "button",
                class: "wm-scope",
                onClick: wn
              }, u(ve.value === "city" ? s("life.companion.world.nationView") : s("life.companion.world.cityView")), 1)) : Z("", !0),
              o("button", {
                type: "button",
                class: "wm-reset",
                onClick: ii
              }, u(s("life.companion.world.resetView")), 1),
              W.value.kind !== "real" && ve.value === "city" ? (b(), w("div", ju, [...r[103] || (r[103] = [
                o("i", null, "N", -1)
              ])])) : Z("", !0)
            ], 64)) : Z("", !0)
          ]),
          W.value.locations.length ? Z("", !0) : (b(), w("p", qu, u(s("life.companion.world.noMap")), 1)),
          W.value.locations.length ? (b(), w("div", Ku, [
            (b(!0), w(pt, null, oe(Xi.value, (c) => (b(), w("span", { key: c }, [
              o("i", {
                class: ke("k-" + c)
              }, null, 2),
              ft(u(s(Rt[c])), 1)
            ]))), 128)),
            o("span", null, [
              r[104] || (r[104] = o("i", { class: "k-actor" }, null, -1)),
              ft(u(s("life.companion.world.actorsCount", { n: W.value.actors.length })), 1)
            ]),
            W.value.kind !== "real" ? (b(), w(pt, { key: 0 }, [
              o("span", null, [
                r[105] || (r[105] = o("i", { class: "k-hw" }, null, -1)),
                ft(u(s("life.companion.world.highwayLoop")), 1)
              ]),
              o("span", null, [
                r[106] || (r[106] = o("i", { class: "k-arterial" }, null, -1)),
                ft(u(s("life.companion.world.arterial")), 1)
              ]),
              o("span", null, [
                r[107] || (r[107] = o("i", { class: "k-street" }, null, -1)),
                ft(u(s("life.companion.world.street")), 1)
              ]),
              o("span", null, [
                r[108] || (r[108] = o("i", { class: "k-metro" }, null, -1)),
                ft(u(s("life.companion.world.metro")), 1)
              ]),
              o("span", null, [
                r[109] || (r[109] = o("i", { class: "k-bus" }, null, -1)),
                ft(u(s("life.companion.world.bus")), 1)
              ]),
              o("span", null, [
                r[110] || (r[110] = o("i", { class: "k-park2" }, null, -1)),
                ft(u(s("life.companion.kind.park")), 1)
              ]),
              o("span", null, [
                r[111] || (r[111] = o("i", { class: "k-water" }, null, -1)),
                ft(u(s("life.companion.world.water")), 1)
              ])
            ], 64)) : Z("", !0)
          ])) : Z("", !0),
          W.value.locations.length && W.value.kind !== "real" && ve.value === "city" ? (b(), w("div", $u, [
            (W.value.metro || []).length ? (b(), w("div", Yu, [
              o("h4", null, u(s("life.companion.world.metroRoutes")), 1),
              o("ul", null, [
                (b(!0), w(pt, null, oe(W.value.metro, (c, x) => (b(), w("li", {
                  key: "m" + x
                }, [
                  o("b", {
                    style: Nn({ color: c.color })
                  }, u(c.name), 5),
                  o("span", null, u((c.stations || []).map((k) => k.name).filter(Boolean).join(" · ")), 1)
                ]))), 128))
              ])
            ])) : Z("", !0),
            (W.value.bus || []).length ? (b(), w("div", Ju, [
              o("h4", null, u(s("life.companion.world.busRoutes")), 1),
              o("ul", null, [
                (b(!0), w(pt, null, oe(W.value.bus, (c, x) => (b(), w("li", {
                  key: "b" + x
                }, [
                  o("b", {
                    style: Nn({ color: c.color })
                  }, u(c.name), 5),
                  o("span", null, u((c.stops || []).map((k) => k.name).filter(Boolean).join(" · ")), 1)
                ]))), 128))
              ])
            ])) : Z("", !0)
          ])) : Z("", !0)
        ]),
        o("article", Xu, [
          o("div", Qu, [
            o("h3", null, [
              ft(u(s("life.companion.world.recentEvents")) + " ", 1),
              o("span", tc, u(Ce.value.length), 1)
            ]),
            Ce.value.length ? (b(), w("button", {
              key: 0,
              type: "button",
              class: "btn tonic sm",
              onClick: ct
            }, u(s("life.companion.world.clearTitle")), 1)) : Z("", !0)
          ]),
          o("ol", ec, [
            (b(!0), w(pt, null, oe(Ce.value, (c) => (b(), w("li", {
              key: c.id
            }, [
              o("span", ic, u(c.created_at), 1),
              o("strong", null, u(c.summary), 1)
            ]))), 128)),
            Ce.value.length ? Z("", !0) : (b(), w("li", nc, u(s("life.companion.world.noEvents")), 1))
          ])
        ])
      ], 512), [
        [Fi, Mt.value === "world"]
      ]),
      y(o("section", oc, [
        Ct(ka)
      ], 512), [
        [Fi, Mt.value === "adapters"]
      ]),
      y(o("section", ac, [
        o("div", sc, [
          o("div", null, [
            o("h2", null, u(s("life.companion.state.title")), 1),
            o("p", rc, u(s("life.companion.state.desc")), 1)
          ])
        ]),
        o("article", lc, [
          o("h3", null, [
            ft(u(s("life.companion.state.commitments")) + " ", 1),
            o("span", uc, u(Ti.value.length), 1)
          ]),
          o("ol", cc, [
            (b(!0), w(pt, null, oe(Ti.value, (c) => (b(), w("li", {
              key: c.id
            }, [
              o("strong", null, u(c.text), 1),
              o("span", hc, u(c.user_id), 1)
            ]))), 128)),
            Ti.value.length ? Z("", !0) : (b(), w("li", dc, u(s("life.companion.state.noCommitments")), 1))
          ])
        ]),
        o("div", fc, [
          o("article", pc, [
            o("h3", null, u(s("life.companion.state.userModel")), 1),
            o("ol", mc, [
              (b(!0), w(pt, null, oe(ki.value, (c) => (b(), w("li", {
                key: c.user_id
              }, [
                o("strong", null, u(c.user_id), 1),
                o("span", _c, u(s("life.companion.state.likes", { items: Ke(c.preferences).join(s("life.companion.listSeparator")) || "—" })), 1),
                o("span", vc, u(s("life.companion.state.taboos", { items: Ke(c.taboos).join(s("life.companion.listSeparator")) || "—" })), 1),
                o("span", gc, u(s("life.companion.state.concerns", { items: Ke(c.concerns).join(s("life.companion.listSeparator")) || "—" })), 1)
              ]))), 128)),
              ki.value.length ? Z("", !0) : (b(), w("li", yc, u(s("life.companion.state.noUserModel")), 1))
            ])
          ]),
          o("article", bc, [
            o("h3", null, u(s("life.companion.state.values")), 1),
            o("ol", wc, [
              (b(!0), w(pt, null, oe(qe.value, (c) => (b(), w("li", {
                key: c.k
              }, [
                o("strong", null, u(c.k), 1),
                o("span", xc, u(Number(c.v).toFixed(2)), 1)
              ]))), 128)),
              qe.value.length ? Z("", !0) : (b(), w("li", Pc, u(s("life.companion.state.noValues")), 1))
            ])
          ])
        ])
      ], 512), [
        [Fi, Mt.value === "state"]
      ]),
      o("section", Lc, [
        o("div", Tc, [
          o("div", null, [
            o("h2", null, u(s("life.companion.danger.title")), 1),
            o("p", kc, u(s("life.companion.danger.desc")), 1)
          ])
        ]),
        o("div", Sc, [
          o("article", Cc, [
            o("h3", null, u(s("life.companion.danger.reset")), 1),
            o("p", Mc, u(s("life.companion.danger.resetHint")), 1),
            o("p", zc, [
              o("strong", null, u(s("life.companion.danger.doubleConfirm")), 1)
            ]),
            o("div", Oc, [
              o("button", {
                class: "btn danger",
                disabled: ti.value,
                onClick: Oi
              }, u(ti.value ? s("life.companion.danger.resetting") : s("life.companion.danger.reset")), 9, Ec)
            ])
          ])
        ])
      ])
    ], 512));
  }
}), Uc = /* @__PURE__ */ Sa(Zc, [["__scopeId", "data-v-be260f43"]]);
export {
  Uc as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('life-plugin-style')){const s=document.createElement('style');s.id='life-plugin-style';s.textContent=".page-header[data-v-e12fa355]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.page-header h1[data-v-e12fa355]{margin:0;font-size:clamp(24px,2.8vw,34px);font-weight:800;letter-spacing:-.02em}.subtitle[data-v-e12fa355]{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-e12fa355]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0;flex-wrap:wrap}.stat-grid[data-v-e12fa355]{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(180px,100%),1fr));gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-e12fa355]{background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:var(--r-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px;transition:transform .28s var(--ease-spring),box-shadow .28s}@media(hover:hover)and (pointer:fine){.stat-card[data-v-e12fa355]:hover{transform:translateY(-2px);box-shadow:var(--shadow-2)}}.stat-head[data-v-e12fa355]{display:flex;align-items:center;gap:10px}.stat-label[data-v-e12fa355]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-e12fa355]{font-size:34px;font-weight:800;letter-spacing:-.02em;line-height:1.1}.stat-hint[data-v-e12fa355]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-e12fa355]{width:44px;height:44px;border-radius:16px 16px 16px 6px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-e12fa355]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-e12fa355]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-e12fa355]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-e12fa355]{background:var(--md-success-container);color:var(--md-on-success-container,#0d3b1e)}.card-head[data-v-e12fa355]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.card-title[data-v-e12fa355]{margin:0;font-size:16px;font-weight:650}.toolbar[data-v-e12fa355]{display:flex;align-items:flex-end;gap:14px;flex-wrap:wrap;margin-bottom:var(--space-lg);padding:var(--space-md)}.search-field[data-v-e12fa355]{display:flex;align-items:center;gap:10px;flex:1;min-width:220px;height:52px;padding:0 14px;border-radius:16px;background:var(--md-surface-container-high)}.search-icon[data-v-e12fa355]{color:var(--md-on-surface-variant);flex-shrink:0}.search-field input[data-v-e12fa355]{flex:1;min-width:0;border:0;background:transparent;outline:none;color:var(--md-on-surface);font-size:14px}.search-field input[data-v-e12fa355]:focus-visible{outline:3px solid var(--md-primary);outline-offset:2px}.search-field.mini[data-v-e12fa355]{height:auto;padding:10px 12px;margin-bottom:12px}#app .memory-page .field.area[data-v-e12fa355]{height:auto;min-height:120px;padding:12px 14px;resize:vertical;line-height:1.6}.chip[data-v-e12fa355]{height:26px;padding:0 11px;border-radius:999px;font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:6px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0}.chip.muted[data-v-e12fa355]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}.tier-short[data-v-e12fa355]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tier-long[data-v-e12fa355]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.chip-ok[data-v-e12fa355]{background:var(--md-success-container);color:var(--md-on-success-container,#0d3b1e)}.chip-warn[data-v-e12fa355]{background:var(--md-warning-container);color:var(--md-on-warning-container)}.memory-list[data-v-e12fa355]{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(340px,100%),1fr));gap:var(--space-lg)}.memory-card[data-v-e12fa355]{background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:var(--r-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:12px;transition:transform .26s var(--ease-spring),box-shadow .22s,border-color .2s}@media(hover:hover)and (pointer:fine){.memory-card[data-v-e12fa355]:hover{transform:translateY(-2px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--md-primary) 30%,var(--md-outline-variant))}}.memory-card-enter-active[data-v-e12fa355]{transition:opacity .2s var(--ease-emphasized-decel),transform .2s var(--ease-emphasized-decel)}.memory-card-leave-active[data-v-e12fa355]{transition:opacity .16s var(--ease-emphasized-accel),transform .16s var(--ease-emphasized-accel)}.memory-card-enter-from[data-v-e12fa355]{opacity:0;transform:translateY(6px) scale(.98)}.memory-card-leave-to[data-v-e12fa355]{opacity:0;transform:scale(.98)}.memory-card-move[data-v-e12fa355]{transition:transform .26s var(--ease-emphasized)}@media(prefers-reduced-motion:reduce){.memory-card-enter-active[data-v-e12fa355],.memory-card-leave-active[data-v-e12fa355],.memory-card-move[data-v-e12fa355]{transition-duration:1ms}.memory-card-enter-from[data-v-e12fa355],.memory-card-leave-to[data-v-e12fa355],.stat-card[data-v-e12fa355]:hover,.memory-card[data-v-e12fa355]:hover{transform:none}}.card-top[data-v-e12fa355]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.btn-icon[data-v-e12fa355]{position:relative;width:30px;height:30px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--md-on-surface-variant);display:grid;place-items:center;cursor:pointer;margin-left:auto}#app .memory-page .btn-icon[data-v-e12fa355]{min-height:0}.btn-icon[data-v-e12fa355]:after{content:\"\";position:absolute;top:50%;left:50%;width:44px;height:44px;transform:translate(-50%,-50%)}.btn-icon.danger[data-v-e12fa355]:hover{background:var(--md-error-container);color:var(--md-error)}.memory-content[data-v-e12fa355]{margin:0;line-height:1.65;font-size:14px;white-space:pre-wrap;overflow-wrap:anywhere}.tags[data-v-e12fa355]{display:flex;gap:6px;flex-wrap:wrap}.tags span[data-v-e12fa355]{font-size:12px;font-weight:500;color:var(--md-on-primary-container);background:var(--md-primary-container);padding:3px 8px;border-radius:999px}.memory-foot[data-v-e12fa355]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding-top:12px;border-top:1px solid var(--md-outline-variant)}.meter[data-v-e12fa355]{display:flex;align-items:center;gap:7px;font-size:12px;color:var(--md-on-surface-variant)}.meter-bar[data-v-e12fa355]{width:56px;height:5px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-e12fa355]{display:block;height:100%;width:100%;transform-origin:left;transform:scaleX(var(--v,0%));border-radius:999px;transition:transform .3s var(--ease-out,ease)}.fill-primary[data-v-e12fa355]{background:var(--md-primary)}.fill-secondary[data-v-e12fa355]{background:var(--md-secondary,#536255)}.meter-text[data-v-e12fa355]{margin-left:auto;font-size:12px;color:var(--md-on-surface-variant)}.detail[data-v-e12fa355]{display:grid;grid-template-rows:0fr;transition:grid-template-rows .24s var(--ease-out,ease)}.detail.open[data-v-e12fa355]{grid-template-rows:1fr}.detail-clip[data-v-e12fa355]{overflow:hidden;min-height:0;border-top:0 solid transparent}.detail-clip dl[data-v-e12fa355]{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0;font-size:12px;padding-top:10px}.detail.open .detail-clip[data-v-e12fa355]{border-top-width:1px;border-top-style:solid;border-top-color:var(--md-outline-variant)}.detail dt[data-v-e12fa355]{color:var(--md-on-surface-variant);font-weight:600}.detail dd[data-v-e12fa355]{margin:3px 0 0;overflow-wrap:anywhere}.detail code[data-v-e12fa355]{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px}.card-actions[data-v-e12fa355]{display:flex;gap:8px;justify-content:flex-end}.hidden-input[data-v-e12fa355]{display:none}.empty-state[data-v-e12fa355]{padding:56px 24px;text-align:center;background:var(--md-surface-container);border:1px dashed var(--md-outline-variant);border-radius:var(--r-lg);color:var(--md-on-surface-variant)}.empty-state p[data-v-e12fa355]{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}.empty-state .hint[data-v-e12fa355]{margin-top:8px;font-size:13px;font-weight:400;opacity:.85}.pager[data-v-e12fa355]{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:var(--space-lg)}.grid-notes[data-v-e12fa355]{display:grid;grid-template-columns:minmax(0,340px) 1fr;gap:var(--space-lg)}.stack-form[data-v-e12fa355]{display:flex;flex-direction:column;gap:10px}.note-list[data-v-e12fa355],.reflection-list[data-v-e12fa355]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}.note-item[data-v-e12fa355]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent);border-radius:16px;background:var(--md-surface-container-low)}.note-main[data-v-e12fa355]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.note-main strong[data-v-e12fa355]{font-size:14px;font-weight:600;overflow-wrap:anywhere}.item-meta[data-v-e12fa355]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.note-actions[data-v-e12fa355]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-e12fa355]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.reader[data-v-e12fa355]{margin-top:var(--space-lg)}.reader pre[data-v-e12fa355]{margin:0;max-height:460px;overflow:auto;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;line-height:1.7;white-space:pre-wrap;background:var(--md-surface-container);padding:14px 16px;border-radius:12px}.reflection .card-title[data-v-e12fa355]{font-size:14px;font-weight:600}.reflection details[data-v-e12fa355]{margin-top:6px}.reflection summary[data-v-e12fa355]{cursor:pointer;font-size:12px;color:var(--md-on-surface-variant)}.quote[data-v-e12fa355]{margin:8px 0 0;font-size:13px;line-height:1.6;background:var(--md-surface-container);padding:8px 12px;border-radius:8px;white-space:pre-wrap;overflow-wrap:anywhere}@media(prefers-reduced-motion:reduce){.meter-bar i[data-v-e12fa355]{transition:none}}.tab-body[data-v-e12fa355]{min-width:0}.tab-fade-enter-active[data-v-e12fa355]{transition:opacity .2s var(--ease-emphasized-decel)}.tab-fade-leave-active[data-v-e12fa355]{transition:opacity .14s var(--ease-emphasized-accel)}.tab-fade-enter-from[data-v-e12fa355],.tab-fade-leave-to[data-v-e12fa355]{opacity:0}@media(prefers-reduced-motion:reduce){.tab-fade-enter-active[data-v-e12fa355],.tab-fade-leave-active[data-v-e12fa355]{transition-duration:1ms}}.dynamics-grid[data-v-e12fa355]{display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:18px;align-items:end}@media(max-width:900px){.dynamics-grid[data-v-e12fa355]{grid-template-columns:1fr}}.dyn-track[data-v-e12fa355]{flex:1;height:10px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.dyn-bar[data-v-e12fa355]{display:block;height:100%;border-radius:999px;background:var(--md-primary);transition:width .5s var(--ease-out,ease)}.dyn-hist[data-v-e12fa355]{display:flex;align-items:flex-end;gap:3px;height:60px}.dyn-hist i[data-v-e12fa355]{flex:1;background:var(--md-primary);border-radius:3px 3px 0 0;transition:height .5s var(--ease-out,ease)}.dyn-curve[data-v-e12fa355]{width:100%;height:60px;color:var(--md-primary);display:block}.decay-line[data-v-e12fa355]{stroke-dasharray:1;stroke-dashoffset:1;animation:decay-draw-e12fa355 .9s var(--ease-out,ease) forwards}@keyframes decay-draw-e12fa355{to{stroke-dashoffset:0}}@media(prefers-reduced-motion:reduce){.dyn-bar[data-v-e12fa355],.dyn-hist i[data-v-e12fa355]{transition:none}.decay-line[data-v-e12fa355]{animation:none;stroke-dashoffset:0}}.skeleton-card[data-v-e12fa355]{gap:12px;pointer-events:none}.sk-line[data-v-e12fa355]{display:block;height:12px;border-radius:6px;background:linear-gradient(90deg,var(--md-surface-container-high) 25%,color-mix(in srgb,var(--md-on-surface) 8%,var(--md-surface-container-high)) 45%,var(--md-surface-container-high) 65%);background-size:200% 100%;animation:sk-shimmer-e12fa355 1.4s linear infinite}.sk-line.w30[data-v-e12fa355]{width:30%}.sk-line.w40[data-v-e12fa355]{width:40%}.sk-line.w75[data-v-e12fa355]{width:75%}.sk-line.w90[data-v-e12fa355]{width:90%}@keyframes sk-shimmer-e12fa355{0%{background-position:200% 0}to{background-position:-200% 0}}@media(prefers-reduced-motion:reduce){.sk-line[data-v-e12fa355]{animation:none}}.danger-zone[data-v-e12fa355]{display:flex;justify-content:space-between;align-items:center;gap:var(--space-lg);flex-wrap:wrap;margin-top:var(--space-xl);padding:var(--space-lg);border:1px solid color-mix(in srgb,var(--md-error,#b3261e) 45%,transparent);border-radius:var(--r-lg);background:color-mix(in srgb,var(--md-error,#b3261e) 5%,transparent)}.danger-zone h2[data-v-e12fa355]{margin:0;font-size:15px;font-weight:750;color:var(--md-error,#b3261e)}.danger-zone .hint[data-v-e12fa355]{margin:4px 0 0}.danger-copy[data-v-e12fa355]{flex:1;min-width:240px}@media(max-width:900px){.stat-grid[data-v-e12fa355]{grid-template-columns:repeat(2,1fr)}.grid-notes[data-v-e12fa355]{grid-template-columns:1fr}}@media(max-width:640px){.header-actions[data-v-e12fa355]{padding-top:0}.memory-list[data-v-e12fa355]{grid-template-columns:1fr}}.muted[data-v-3d757c40]{color:var(--md-on-surface-variant);font-size:13px}.pad[data-v-3d757c40]{padding:14px}.dock[data-v-3d757c40]{position:fixed;right:16px;top:76px;z-index:var(--z-panel, 3000);display:flex;flex-direction:column;align-items:center;gap:10px;padding:10px 8px;border-radius:28px;background:var(--md-surface-container-low);box-shadow:var(--shadow-1)}.dock-btn[data-v-3d757c40]{position:relative;width:42px;height:42px;display:grid;place-items:center;border:0;border-radius:14px;background:transparent;color:var(--md-on-surface-variant);cursor:pointer;transition:background-color .16s,color .16s,transform .16s var(--ease-emphasized-decel)}.dock-btn[data-v-3d757c40]:hover{background:var(--md-secondary-container);color:var(--md-on-surface);transform:translateY(-1px)}.dock-btn[data-v-3d757c40]:active{transform:scale(.94)}.dock-btn.active[data-v-3d757c40]{background:color-mix(in srgb,var(--md-primary) 18%,transparent);color:var(--md-primary)}.dock-btn[data-v-3d757c40]:focus-visible{outline:2px solid var(--md-primary);outline-offset:2px}.panel[data-v-3d757c40]{position:fixed;left:0;top:0;z-index:var(--z-panel, 3000);display:flex;flex-direction:column;border:1px solid var(--md-outline-variant);border-radius:14px;overflow:hidden;background:var(--md-surface-container-low);box-shadow:var(--shadow-4);color:var(--md-on-surface)}.toolbar[data-v-3d757c40]{display:flex;align-items:center;gap:6px;padding:7px 9px;background:var(--md-surface-container-high);color:var(--md-on-surface);cursor:grab;touch-action:none;user-select:none;flex:0 0 auto}.toolbar[data-v-3d757c40]:active{cursor:grabbing}.toolbar .grab[data-v-3d757c40]{font-size:13px;line-height:1;color:var(--md-on-surface-variant);padding:0 2px;cursor:grab}.toolbar strong[data-v-3d757c40]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12.5px;font-weight:650}.toolbar .count[data-v-3d757c40]{flex:none;min-width:20px;height:20px;padding:0 6px;display:inline-flex;align-items:center;justify-content:center;border-radius:999px;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);font-size:11.5px;font-weight:700}.toolbar button[data-v-3d757c40]{width:28px;height:28px;padding:0;display:inline-grid;place-items:center;border:0;border-radius:8px;font-size:13px;line-height:1;color:var(--md-on-surface-variant);background:transparent;cursor:pointer;flex-shrink:0}#app .toolbar button[data-v-3d757c40]{min-height:0}.toolbar button[data-v-3d757c40]:hover{background:var(--md-surface-container-highest)}.list-body[data-v-3d757c40]{flex:1;min-height:0;overflow-y:auto;padding:6px;display:flex;flex-direction:column;gap:2px}.row[data-v-3d757c40]{display:flex;gap:10px;align-items:center;width:100%;text-align:left;border:0;background:transparent;color:inherit;font:inherit;padding:8px 9px;border-radius:12px;cursor:pointer}.row[data-v-3d757c40]:hover{background:var(--md-surface-container-high)}.row.selected[data-v-3d757c40]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.row-main[data-v-3d757c40]{min-width:0;flex:1;display:flex;flex-direction:column;gap:2px}.row-top[data-v-3d757c40]{display:flex;justify-content:space-between;gap:8px}.row-top strong[data-v-3d757c40]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:700}.row-top small[data-v-3d757c40]{font-size:11px;opacity:.6;flex:0 0 auto}.row-sub[data-v-3d757c40]{font-size:12px;opacity:.75;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.me[data-v-3d757c40]{color:var(--md-primary);font-weight:700}.row.selected .me[data-v-3d757c40]{color:inherit;opacity:.85}.avatar[data-v-3d757c40]{position:relative;width:38px;height:38px;flex:0 0 38px;border-radius:50%;overflow:hidden;background:var(--md-primary);color:var(--md-on-primary, #fff);display:flex;align-items:center;justify-content:center;font-weight:800}.avatar.group[data-v-3d757c40]{border-radius:12px}.avatar.sm[data-v-3d757c40]{width:26px;height:26px;flex-basis:26px}.avatar img[data-v-3d757c40]{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.fb[data-v-3d757c40]{font-size:14px}.thread[data-v-3d757c40]{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px;min-height:0}.msg[data-v-3d757c40]{display:flex;opacity:1;transform:none;transition:opacity var(--duration-medium) var(--ease-emphasized-decel),transform var(--duration-medium) var(--ease-emphasized-decel)}@starting-style{.msg[data-v-3d757c40]{opacity:0;transform:translateY(4px)}}.msg.out[data-v-3d757c40]{justify-content:flex-end}.bubble[data-v-3d757c40]{max-width:82%;background:var(--md-surface-container-low);border-radius:8px 24px 24px;padding:8px 12px;display:flex;flex-direction:column;gap:3px;box-shadow:var(--shadow-1)}.msg.out .bubble[data-v-3d757c40]{background:var(--md-primary-container);color:var(--md-on-primary-container);border-radius:24px 24px 8px}.sender[data-v-3d757c40]{font-size:11px;font-weight:700;opacity:.75}.text[data-v-3d757c40]{white-space:pre-wrap;word-break:break-word;font-size:13px}.chip[data-v-3d757c40]{align-self:flex-start;font-size:11px;padding:1px 8px;border-radius:999px;background:color-mix(in srgb,currentColor 16%,transparent)}.time[data-v-3d757c40]{align-self:flex-end;font-size:10px;opacity:.6}.composer[data-v-3d757c40]{display:flex;gap:8px;padding:8px 10px;border-top:1px solid var(--md-outline-variant);align-items:flex-end;flex:0 0 auto;flex-wrap:wrap}.send-error[data-v-3d757c40]{flex:1 0 100%;margin:0;padding:6px 10px;border-radius:8px;background:var(--md-error-container);color:var(--md-on-error-container);font-size:12px;overflow-wrap:anywhere}.composer textarea[data-v-3d757c40]{flex:1;resize:none;min-height:38px;max-height:110px;padding:9px 12px;border-radius:12px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-high);color:var(--md-on-surface);font:inherit;outline:none}.composer textarea[data-v-3d757c40]:focus{border-color:var(--md-primary)}.composer button[data-v-3d757c40]{height:38px;padding:0 16px;border:0;border-radius:12px;background:var(--md-primary);color:var(--md-on-primary, #fff);font-weight:700;cursor:pointer}.composer button[data-v-3d757c40]:disabled{opacity:.5;cursor:not-allowed}.resize[data-v-3d757c40]{position:absolute;right:1px;bottom:1px;width:16px;height:16px;cursor:nwse-resize;touch-action:none;opacity:.5;background:repeating-linear-gradient(135deg,transparent 0 3px,var(--md-on-surface-variant) 3px 4px)}.resize[data-v-3d757c40]:hover{opacity:.85}.lsw-scrim[data-v-3d757c40]{position:fixed;inset:0;z-index:var(--z-modal, 4000);background:var(--md-scrim, color-mix(in srgb, #18132d 42%, transparent));backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.lsw-dialog[data-v-3d757c40]{width:min(560px,100%);max-height:85vh;overflow:auto;border-radius:28px;background:var(--md-surface);color:var(--md-on-surface);padding:28px;box-shadow:0 24px 70px #18132d33;outline:none}.lsw-dialog header[data-v-3d757c40]{display:flex;justify-content:space-between;align-items:center;gap:16px}.lsw-eyebrow[data-v-3d757c40]{font-size:12px;letter-spacing:2px;color:var(--md-primary);font-weight:700}.lsw-dialog h2[data-v-3d757c40]{font-size:24px;margin:8px 0}.lsw-meta[data-v-3d757c40]{font-size:12px;color:var(--md-on-surface-variant);overflow-wrap:anywhere;margin:0}.lsw-body[data-v-3d757c40]{margin:16px 0;white-space:pre-wrap;overflow-wrap:anywhere}.lsw-dialog button[data-v-3d757c40]{border:0;border-radius:999px;padding:12px 20px;font:inherit;cursor:pointer;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.lsw-dialog .lsw-primary[data-v-3d757c40]{background:var(--md-primary);color:var(--md-on-primary, #fff)}.lsw-dialog footer[data-v-3d757c40]{display:flex;justify-content:flex-end;gap:12px;margin-top:20px}.lsw-fab[data-v-3d757c40]{position:fixed;right:24px;bottom:24px;z-index:var(--z-toast, 6000);display:inline-flex;align-items:center;gap:8px;border:0;border-radius:999px;padding:12px 20px;background:var(--md-primary);color:var(--md-on-primary, #fff);font:inherit;font-weight:700;cursor:pointer;box-shadow:var(--shadow-3)}.lsw-badge[data-v-3d757c40]{background:var(--md-error);color:var(--md-on-error, #fff);border-radius:999px;padding:0 8px;font-size:12px}.lsw-fade-enter-active[data-v-3d757c40]{transition:opacity .24s var(--ease-emphasized-decel),transform .24s var(--ease-emphasized-decel)}.lsw-fade-leave-active[data-v-3d757c40]{transition:opacity .14s var(--ease-emphasized-accel),transform .14s var(--ease-emphasized-accel)}.lsw-fade-enter-from[data-v-3d757c40],.lsw-fade-leave-to[data-v-3d757c40]{opacity:0;transform:translateY(-6px) scale(.99)}.lsw-fab-enter-active[data-v-3d757c40]{transition:opacity .2s var(--ease-emphasized-decel),transform .2s var(--ease-emphasized-decel)}.lsw-fab-leave-active[data-v-3d757c40]{transition:opacity .14s var(--ease-emphasized-accel),transform .14s var(--ease-emphasized-accel)}.lsw-fab-enter-from[data-v-3d757c40],.lsw-fab-leave-to[data-v-3d757c40]{opacity:0;transform:translateY(12px) scale(.9)}@media(prefers-reduced-motion:reduce){.lsw-fade-enter-active[data-v-3d757c40],.lsw-fade-leave-active[data-v-3d757c40],.lsw-fab-enter-active[data-v-3d757c40],.lsw-fab-leave-active[data-v-3d757c40]{transition-duration:1ms}.msg[data-v-3d757c40]{transition:none}}.leaflet-pane,.leaflet-tile,.leaflet-marker-icon,.leaflet-marker-shadow,.leaflet-tile-container,.leaflet-pane>svg,.leaflet-pane>canvas,.leaflet-zoom-box,.leaflet-image-layer,.leaflet-layer{position:absolute;left:0;top:0}.leaflet-container{overflow:hidden}.leaflet-tile,.leaflet-marker-icon,.leaflet-marker-shadow{-webkit-user-select:none;-moz-user-select:none;user-select:none;-webkit-user-drag:none}.leaflet-tile::selection{background:transparent}.leaflet-safari .leaflet-tile{image-rendering:-webkit-optimize-contrast}.leaflet-safari .leaflet-tile-container{width:1600px;height:1600px;-webkit-transform-origin:0 0}.leaflet-marker-icon,.leaflet-marker-shadow{display:block}.leaflet-container .leaflet-overlay-pane svg{max-width:none!important;max-height:none!important}.leaflet-container .leaflet-marker-pane img,.leaflet-container .leaflet-shadow-pane img,.leaflet-container .leaflet-tile-pane img,.leaflet-container img.leaflet-image-layer,.leaflet-container .leaflet-tile{max-width:none!important;max-height:none!important;width:auto;padding:0}.leaflet-container img.leaflet-tile{mix-blend-mode:plus-lighter}.leaflet-container.leaflet-touch-zoom{-ms-touch-action:pan-x pan-y;touch-action:pan-x pan-y}.leaflet-container.leaflet-touch-drag{-ms-touch-action:pinch-zoom;touch-action:none;touch-action:pinch-zoom}.leaflet-container.leaflet-touch-drag.leaflet-touch-zoom{-ms-touch-action:none;touch-action:none}.leaflet-container{-webkit-tap-highlight-color:transparent}.leaflet-container a{-webkit-tap-highlight-color:rgba(51,181,229,.4)}.leaflet-tile{filter:inherit;visibility:hidden}.leaflet-tile-loaded{visibility:inherit}.leaflet-zoom-box{width:0;height:0;-moz-box-sizing:border-box;box-sizing:border-box;z-index:800}.leaflet-overlay-pane svg{-moz-user-select:none}.leaflet-pane{z-index:400}.leaflet-tile-pane{z-index:200}.leaflet-overlay-pane{z-index:400}.leaflet-shadow-pane{z-index:500}.leaflet-marker-pane{z-index:600}.leaflet-tooltip-pane{z-index:650}.leaflet-popup-pane{z-index:700}.leaflet-map-pane canvas{z-index:100}.leaflet-map-pane svg{z-index:200}.leaflet-vml-shape{width:1px;height:1px}.lvml{behavior:url(#default#VML);display:inline-block;position:absolute}.leaflet-control{position:relative;z-index:800;pointer-events:visiblePainted;pointer-events:auto}.leaflet-top,.leaflet-bottom{position:absolute;z-index:1000;pointer-events:none}.leaflet-top{top:0}.leaflet-right{right:0}.leaflet-bottom{bottom:0}.leaflet-left{left:0}.leaflet-control{float:left;clear:both}.leaflet-right .leaflet-control{float:right}.leaflet-top .leaflet-control{margin-top:10px}.leaflet-bottom .leaflet-control{margin-bottom:10px}.leaflet-left .leaflet-control{margin-left:10px}.leaflet-right .leaflet-control{margin-right:10px}.leaflet-fade-anim .leaflet-popup{opacity:0;-webkit-transition:opacity .2s linear;-moz-transition:opacity .2s linear;transition:opacity .2s linear}.leaflet-fade-anim .leaflet-map-pane .leaflet-popup{opacity:1}.leaflet-zoom-animated{-webkit-transform-origin:0 0;-ms-transform-origin:0 0;transform-origin:0 0}svg.leaflet-zoom-animated{will-change:transform}.leaflet-zoom-anim .leaflet-zoom-animated{-webkit-transition:-webkit-transform .25s cubic-bezier(0,0,.25,1);-moz-transition:-moz-transform .25s cubic-bezier(0,0,.25,1);transition:transform .25s cubic-bezier(0,0,.25,1)}.leaflet-zoom-anim .leaflet-tile,.leaflet-pan-anim .leaflet-tile{-webkit-transition:none;-moz-transition:none;transition:none}.leaflet-zoom-anim .leaflet-zoom-hide{visibility:hidden}.leaflet-interactive{cursor:pointer}.leaflet-grab{cursor:-webkit-grab;cursor:-moz-grab;cursor:grab}.leaflet-crosshair,.leaflet-crosshair .leaflet-interactive{cursor:crosshair}.leaflet-popup-pane,.leaflet-control{cursor:auto}.leaflet-dragging .leaflet-grab,.leaflet-dragging .leaflet-grab .leaflet-interactive,.leaflet-dragging .leaflet-marker-draggable{cursor:move;cursor:-webkit-grabbing;cursor:-moz-grabbing;cursor:grabbing}.leaflet-marker-icon,.leaflet-marker-shadow,.leaflet-image-layer,.leaflet-pane>svg path,.leaflet-tile-container{pointer-events:none}.leaflet-marker-icon.leaflet-interactive,.leaflet-image-layer.leaflet-interactive,.leaflet-pane>svg path.leaflet-interactive,svg.leaflet-image-layer.leaflet-interactive path{pointer-events:visiblePainted;pointer-events:auto}.leaflet-container{background:#ddd;outline-offset:1px}.leaflet-container a{color:#0078a8}.leaflet-zoom-box{border:2px dotted #38f;background:#ffffff80}.leaflet-container{font-family:Helvetica Neue,Arial,Helvetica,sans-serif;font-size:12px;font-size:.75rem;line-height:1.5}.leaflet-bar{box-shadow:0 1px 5px #000000a6;border-radius:4px}.leaflet-bar a{background-color:#fff;border-bottom:1px solid #ccc;width:26px;height:26px;line-height:26px;display:block;text-align:center;text-decoration:none;color:#000}.leaflet-bar a,.leaflet-control-layers-toggle{background-position:50% 50%;background-repeat:no-repeat;display:block}.leaflet-bar a:hover,.leaflet-bar a:focus{background-color:#f4f4f4}.leaflet-bar a:first-child{border-top-left-radius:4px;border-top-right-radius:4px}.leaflet-bar a:last-child{border-bottom-left-radius:4px;border-bottom-right-radius:4px;border-bottom:none}.leaflet-bar a.leaflet-disabled{cursor:default;background-color:#f4f4f4;color:#bbb}.leaflet-touch .leaflet-bar a{width:30px;height:30px;line-height:30px}.leaflet-touch .leaflet-bar a:first-child{border-top-left-radius:2px;border-top-right-radius:2px}.leaflet-touch .leaflet-bar a:last-child{border-bottom-left-radius:2px;border-bottom-right-radius:2px}.leaflet-control-zoom-in,.leaflet-control-zoom-out{font:700 18px Lucida Console,Monaco,monospace;text-indent:1px}.leaflet-touch .leaflet-control-zoom-in,.leaflet-touch .leaflet-control-zoom-out{font-size:22px}.leaflet-control-layers{box-shadow:0 1px 5px #0006;background:#fff;border-radius:5px}.leaflet-control-layers-toggle{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAQAAAADQ4RFAAACf0lEQVR4AY1UM3gkARTePdvdoTxXKc+qTl3aU5U6b2Kbkz3Gtq3Zw6ziLGNPzrYx7946Tr6/ee/XeCQ4D3ykPtL5tHno4n0d/h3+xfuWHGLX81cn7r0iTNzjr7LrlxCqPtkbTQEHeqOrTy4Yyt3VCi/IOB0v7rVC7q45Q3Gr5K6jt+3Gl5nCoDD4MtO+j96Wu8atmhGqcNGHObuf8OM/x3AMx38+4Z2sPqzCxRFK2aF2e5Jol56XTLyggAMTL56XOMoS1W4pOyjUcGGQdZxU6qRh7B9Zp+PfpOFlqt0zyDZckPi1ttmIp03jX8gyJ8a/PG2yutpS/Vol7peZIbZcKBAEEheEIAgFbDkz5H6Zrkm2hVWGiXKiF4Ycw0RWKdtC16Q7qe3X4iOMxruonzegJzWaXFrU9utOSsLUmrc0YjeWYjCW4PDMADElpJSSQ0vQvA1Tm6/JlKnqFs1EGyZiFCqnRZTEJJJiKRYzVYzJck2Rm6P4iH+cmSY0YzimYa8l0EtTODFWhcMIMVqdsI2uiTvKmTisIDHJ3od5GILVhBCarCfVRmo4uTjkhrhzkiBV7SsaqS+TzrzM1qpGGUFt28pIySQHR6h7F6KSwGWm97ay+Z+ZqMcEjEWebE7wxCSQwpkhJqoZA5ivCdZDjJepuJ9IQjGGUmuXJdBFUygxVqVsxFsLMbDe8ZbDYVCGKxs+W080max1hFCarCfV+C1KATwcnvE9gRRuMP2prdbWGowm1KB1y+zwMMENkM755cJ2yPDtqhTI6ED1M/82yIDtC/4j4BijjeObflpO9I9MwXTCsSX8jWAFeHr05WoLTJ5G8IQVS/7vwR6ohirYM7f6HzYpogfS3R2OAAAAAElFTkSuQmCC);width:36px;height:36px}.leaflet-retina .leaflet-control-layers-toggle{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAQAAABvcdNgAAAEsklEQVR4AWL4TydIhpZK1kpWOlg0w3ZXP6D2soBtG42jeI6ZmQTHzAxiTbSJsYLjO9HhP+WOmcuhciVnmHVQcJnp7DFvScowZorad/+V/fVzMdMT2g9Cv9guXGv/7pYOrXh2U+RRR3dSd9JRx6bIFc/ekqHI29JC6pJ5ZEh1yWkhkbcFeSjxgx3L2m1cb1C7bceyxA+CNjT/Ifff+/kDk2u/w/33/IeCMOSaWZ4glosqT3DNnNZQ7Cs58/3Ce5HL78iZH/vKVIaYlqzfdLu8Vi7dnvUbEza5Idt36tquZFldl6N5Z/POLof0XLK61mZCmJSWjVF9tEjUluu74IUXvgttuVIHE7YxSkaYhJZam7yiM9Pv82JYfl9nptxZaxMJE4YSPty+vF0+Y2up9d3wwijfjZbabqm/3bZ9ecKHsiGmRflnn1MW4pjHf9oLufyn2z3y1D6n8g8TZhxyzipLNPnAUpsOiuWimg52psrTZYnOWYNDTMuWBWa0tJb4rgq1UvmutpaYEbZlwU3CLJm/ayYjHW5/h7xWLn9Hh1vepDkyf7dE7MtT5LR4e7yYpHrkhOUpEfssBLq2pPhAqoSWKUkk7EDqkmK6RrCEzqDjhNDWNE+XSMvkJRDWlZTmCW0l0PHQGRZY5t1L83kT0Y3l2SItk5JAWHl2dCOBm+fPu3fo5/3v61RMCO9Jx2EEYYhb0rmNQMX/vm7gqOEJLcXTGw3CAuRNeyaPWwjR8PRqKQ1PDA/dpv+on9Shox52WFnx0KY8onHayrJzm87i5h9xGw/tfkev0jGsQizqezUKjk12hBMKJ4kbCqGPVNXudyyrShovGw5CgxsRICxF6aRmSjlBnHRzg7Gx8fKqEubI2rahQYdR1YgDIRQO7JvQyD52hoIQx0mxa0ODtW2Iozn1le2iIRdzwWewedyZzewidueOGqlsn1MvcnQpuVwLGG3/IR1hIKxCjelIDZ8ldqWz25jWAsnldEnK0Zxro19TGVb2ffIZEsIO89EIEDvKMPrzmBOQcKQ+rroye6NgRRxqR4U8EAkz0CL6uSGOm6KQCdWjvjRiSP1BPalCRS5iQYiEIvxuBMJEWgzSoHADcVMuN7IuqqTeyUPq22qFimFtxDyBBJEwNyt6TM88blFHao/6tWWhuuOM4SAK4EI4QmFHA+SEyWlp4EQoJ13cYGzMu7yszEIBOm2rVmHUNqwAIQabISNMRstmdhNWcFLsSm+0tjJH1MdRxO5Nx0WDMhCtgD6OKgZeljJqJKc9po8juskR9XN0Y1lZ3mWjLR9JCO1jRDMd0fpYC2VnvjBSEFg7wBENc0R9HFlb0xvF1+TBEpF68d+DHR6IOWVv2BECtxo46hOFUBd/APU57WIoEwJhIi2CdpyZX0m93BZicktMj1AS9dClteUFAUNUIEygRZCtik5zSxI9MubTBH1GOiHsiLJ3OCoSZkILa9PxiN0EbvhsAo8tdAf9Seepd36lGWHmtNANTv5Jd0z4QYyeo/UEJqxKRpg5LZx6btLPsOaEmdMyxYdlc8LMaJnikDlhclqmPiQnTEpLUIZEwkRagjYkEibQErwhkTAKCLQEbUgkzJQWc/0PstHHcfEdQ+UAAAAASUVORK5CYII=);background-size:26px 26px}.leaflet-touch .leaflet-control-layers-toggle{width:44px;height:44px}.leaflet-control-layers .leaflet-control-layers-list,.leaflet-control-layers-expanded .leaflet-control-layers-toggle{display:none}.leaflet-control-layers-expanded .leaflet-control-layers-list{display:block;position:relative}.leaflet-control-layers-expanded{padding:6px 10px 6px 6px;color:#333;background:#fff}.leaflet-control-layers-scrollbar{overflow-y:scroll;overflow-x:hidden;padding-right:5px}.leaflet-control-layers-selector{margin-top:2px;position:relative;top:1px}.leaflet-control-layers label{display:block;font-size:13px;font-size:1.08333em}.leaflet-control-layers-separator{height:0;border-top:1px solid #ddd;margin:5px -10px 5px -6px}.leaflet-default-icon-path{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII=)}.leaflet-container .leaflet-control-attribution{background:#fff;background:#fffc;margin:0}.leaflet-control-attribution,.leaflet-control-scale-line{padding:0 5px;color:#333;line-height:1.4}.leaflet-control-attribution a{text-decoration:none}.leaflet-control-attribution a:hover,.leaflet-control-attribution a:focus{text-decoration:underline}.leaflet-attribution-flag{display:inline!important;vertical-align:baseline!important;width:1em;height:.6669em}.leaflet-left .leaflet-control-scale{margin-left:5px}.leaflet-bottom .leaflet-control-scale{margin-bottom:5px}.leaflet-control-scale-line{border:2px solid #777;border-top:none;line-height:1.1;padding:2px 5px 1px;white-space:nowrap;-moz-box-sizing:border-box;box-sizing:border-box;background:#fffc;text-shadow:1px 1px #fff}.leaflet-control-scale-line:not(:first-child){border-top:2px solid #777;border-bottom:none;margin-top:-2px}.leaflet-control-scale-line:not(:first-child):not(:last-child){border-bottom:2px solid #777}.leaflet-touch .leaflet-control-attribution,.leaflet-touch .leaflet-control-layers,.leaflet-touch .leaflet-bar{box-shadow:none}.leaflet-touch .leaflet-control-layers,.leaflet-touch .leaflet-bar{border:2px solid rgba(0,0,0,.2);background-clip:padding-box}.leaflet-popup{position:absolute;text-align:center;margin-bottom:20px}.leaflet-popup-content-wrapper{padding:1px;text-align:left;border-radius:12px}.leaflet-popup-content{margin:13px 24px 13px 20px;line-height:1.3;font-size:13px;font-size:1.08333em;min-height:1px}.leaflet-popup-content p{margin:1.3em 0}.leaflet-popup-tip-container{width:40px;height:20px;position:absolute;left:50%;margin-top:-1px;margin-left:-20px;overflow:hidden;pointer-events:none}.leaflet-popup-tip{width:17px;height:17px;padding:1px;margin:-10px auto 0;pointer-events:auto;-webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);-ms-transform:rotate(45deg);transform:rotate(45deg)}.leaflet-popup-content-wrapper,.leaflet-popup-tip{background:#fff;color:#333;box-shadow:0 3px 14px #0006}.leaflet-container a.leaflet-popup-close-button{position:absolute;top:0;right:0;border:none;text-align:center;width:24px;height:24px;font:16px/24px Tahoma,Verdana,sans-serif;color:#757575;text-decoration:none;background:transparent}.leaflet-container a.leaflet-popup-close-button:hover,.leaflet-container a.leaflet-popup-close-button:focus{color:#585858}.leaflet-popup-scrolled{overflow:auto}.leaflet-oldie .leaflet-popup-content-wrapper{-ms-zoom:1}.leaflet-oldie .leaflet-popup-tip{width:24px;margin:0 auto;-ms-filter:\"progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678)\";filter:progid:DXImageTransform.Microsoft.Matrix(M11=.70710678,M12=.70710678,M21=-.70710678,M22=.70710678)}.leaflet-oldie .leaflet-control-zoom,.leaflet-oldie .leaflet-control-layers,.leaflet-oldie .leaflet-popup-content-wrapper,.leaflet-oldie .leaflet-popup-tip{border:1px solid #999}.leaflet-div-icon{background:#fff;border:1px solid #666}.leaflet-tooltip{position:absolute;padding:6px;background-color:#fff;border:1px solid #fff;border-radius:3px;color:#222;white-space:nowrap;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none;box-shadow:0 1px 3px #0006}.leaflet-tooltip.leaflet-interactive{cursor:pointer;pointer-events:auto}.leaflet-tooltip-top:before,.leaflet-tooltip-bottom:before,.leaflet-tooltip-left:before,.leaflet-tooltip-right:before{position:absolute;pointer-events:none;border:6px solid transparent;background:transparent;content:\"\"}.leaflet-tooltip-bottom{margin-top:6px}.leaflet-tooltip-top{margin-top:-6px}.leaflet-tooltip-bottom:before,.leaflet-tooltip-top:before{left:50%;margin-left:-6px}.leaflet-tooltip-top:before{bottom:0;margin-bottom:-12px;border-top-color:#fff}.leaflet-tooltip-bottom:before{top:0;margin-top:-12px;margin-left:-6px;border-bottom-color:#fff}.leaflet-tooltip-left{margin-left:-6px}.leaflet-tooltip-right{margin-left:6px}.leaflet-tooltip-left:before,.leaflet-tooltip-right:before{top:50%;margin-top:-6px}.leaflet-tooltip-left:before{right:0;margin-right:-12px;border-left-color:#fff}.leaflet-tooltip-right:before{left:0;margin-left:-12px;border-right-color:#fff}@media print{.leaflet-control{-webkit-print-color-adjust:exact;print-color-adjust:exact}}.world-field[data-v-be260f43]{display:block;margin:10px 0}.world-label[data-v-be260f43]{display:block;font-size:12px;font-weight:600;color:var(--md-on-surface-variant);margin-bottom:4px}.world-text[data-v-be260f43]{width:100%;min-height:64px;padding:10px 14px;border:1px solid var(--md-outline-variant);border-radius:var(--r-sm);background:var(--md-surface-container-high);color:var(--md-on-surface);font:inherit;font-size:13px;line-height:1.5;resize:vertical;outline:none}.world-text[data-v-be260f43]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 14%,transparent)}.world-actions[data-v-be260f43]{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-top:12px}.wm-head[data-v-be260f43]{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;margin-bottom:6px}.wm-place[data-v-be260f43]{font-size:12px;color:var(--md-on-surface-variant)}.wm-premise[data-v-be260f43]{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin:2px 0 8px}.wm-map-wrap[data-v-be260f43]{position:relative;margin-top:8px}.world-map-leaflet[data-v-be260f43]{height:clamp(460px,72vh,820px);border-radius:16px;overflow:hidden;border:1px solid var(--md-outline-variant);background:#e8edf2}.world-map-leaflet.is-empty[data-v-be260f43]{display:none}.wm-reset[data-v-be260f43]{position:absolute;top:10px;right:10px;z-index:var(--z-overlay,2000);border:1px solid var(--md-outline-variant);background:#fffffff0;color:#33404c;border-radius:10px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer;box-shadow:0 1px 4px #0000002e}.wm-reset[data-v-be260f43]:hover{background:#fff}.wm-compass[data-v-be260f43]{position:absolute;left:12px;bottom:12px;z-index:var(--z-overlay,2000);width:38px;height:38px;border-radius:50%;background:#ffffffeb;border:1px solid #b9c3cd;box-shadow:0 1px 4px #0000002e;display:grid;place-items:center}.wm-compass i[data-v-be260f43]{font-style:normal;font-size:12px;font-weight:800;color:#d64545;position:relative}.wm-compass i[data-v-be260f43]:before{content:\"\";position:absolute;left:50%;top:-9px;transform:translate(-50%);border-left:4px solid transparent;border-right:4px solid transparent;border-bottom:9px solid #33404c}.wm-scope[data-v-be260f43]{position:absolute;bottom:12px;right:12px;z-index:var(--z-overlay,2000);border:1px solid var(--md-outline-variant);background:#fffffff0;color:#33404c;border-radius:10px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer;box-shadow:0 1px 4px #0000002e}.wm-scope[data-v-be260f43]:hover{background:#fff}.wm-offline[data-v-be260f43]{position:absolute;left:50%;bottom:12px;transform:translate(-50%);z-index:var(--z-overlay,2000);background:#d1495bf0;color:#fff;font-size:12px;font-weight:600;padding:5px 12px;border-radius:10px;box-shadow:0 1px 4px #00000040}.wm-routes[data-v-be260f43]{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(280px,100%),1fr));gap:18px;margin-top:14px}.wm-routes h4[data-v-be260f43]{margin:0 0 6px;font-size:13px;font-weight:800}.wm-routes ul[data-v-be260f43]{list-style:none;margin:0;padding:0}.wm-routes li[data-v-be260f43]{display:flex;gap:10px;padding:4px 0;border-bottom:1px dashed color-mix(in srgb,var(--md-outline-variant) 70%,transparent);font-size:12.5px}.wm-routes b[data-v-be260f43]{flex:0 0 88px}.wm-routes span[data-v-be260f43]{color:var(--md-on-surface-variant);line-height:1.5}.wm-legend[data-v-be260f43]{display:flex;flex-wrap:wrap;gap:14px;margin-top:12px;font-size:12px;color:var(--md-on-surface-variant)}.wm-legend span[data-v-be260f43]{display:inline-flex;align-items:center;gap:6px}.wm-legend i[data-v-be260f43]{width:12px;height:12px;border-radius:50%;display:inline-block;border:1.5px solid rgba(255,255,255,.7)}.wm-legend i.k-home[data-v-be260f43]{background:#e07a5f}.wm-legend i.k-work[data-v-be260f43]{background:#5b8def}.wm-legend i.k-shop[data-v-be260f43]{background:#e0a23d}.wm-legend i.k-food[data-v-be260f43]{background:#57a773}.wm-legend i.k-park[data-v-be260f43]{background:#3faead}.wm-legend i.k-transit[data-v-be260f43]{background:#8b6fd6}.wm-legend i.k-other[data-v-be260f43]{background:#8a94a6}.wm-legend i.k-actor[data-v-be260f43]{background:#fff;border-color:#d1495b;box-shadow:inset 0 0 0 3px #d1495b}.wm-legend i.k-metro[data-v-be260f43]{background:#d64545}.wm-legend i.k-bus[data-v-be260f43]{background:#e08a2e}.wm-legend i.k-park2[data-v-be260f43]{background:#9bd08f}.wm-legend i.k-water[data-v-be260f43]{background:#8fbfe6}.wm-legend i.k-hw[data-v-be260f43]{background:#f08c2e}.wm-legend i.k-arterial[data-v-be260f43]{background:#f7cf8a}.wm-legend i.k-street[data-v-be260f43]{background:#fff;border-color:#b9c3cd}.pfield[data-v-be260f43]{display:flex;flex-direction:column;gap:4px;margin-top:10px;font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}#app .pcp .pfield textarea.field[data-v-be260f43]{height:auto;min-height:70px;padding:10px 12px;resize:vertical;line-height:1.5}.cog-metric[data-v-be260f43]{display:flex;flex-direction:column;gap:4px;padding:10px 12px;border-radius:var(--r-sm);background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant)}.cog-metric span[data-v-be260f43]{font-size:11px;font-weight:700;letter-spacing:.04em;color:var(--md-on-surface-variant)}.cog-metric strong[data-v-be260f43]{font-size:16px;font-weight:800;letter-spacing:-.01em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.cog-metric.warn[data-v-be260f43]{border-color:var(--md-error,#b3261e);background:color-mix(in srgb,var(--md-error,#b3261e) 8%,transparent)}.cog-metric.warn span[data-v-be260f43],.cog-metric.warn strong[data-v-be260f43]{color:var(--md-error,#b3261e)}.som-channels[data-v-be260f43]{margin-top:10px;display:flex;flex-direction:column;gap:6px}.som-chan[data-v-be260f43]{display:grid;grid-template-columns:minmax(52px,88px) minmax(0,1fr) 48px;align-items:center;gap:10px}.som-chan-name[data-v-be260f43]{font-size:12px;font-weight:600;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.som-chan-bar[data-v-be260f43]{display:block;height:8px;border-radius:999px;background:var(--md-surface-container);overflow:hidden}.som-chan-bar i[data-v-be260f43]{display:block;width:100%;height:100%;border-radius:999px;background:var(--md-primary);transform-origin:left;transition:transform var(--duration-medium) var(--ease-out);will-change:transform}.som-chan-val[data-v-be260f43]{font-size:12px;font-weight:700;text-align:right;color:var(--md-on-surface-variant)}.chip[data-v-be260f43]{display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 12px;border-radius:999px;font-size:12px;font-weight:700;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.chip.muted[data-v-be260f43]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}.chip.ok[data-v-be260f43]{background:var(--md-success-container);color:var(--md-on-success-container,#0d3b1e)}#app .pcp .cog-metric[data-v-be260f43]{background:var(--md-surface-container)}.sync-pill[data-v-be260f43]{font-weight:500;opacity:.85}html[data-theme=dark] #app .pcp .world-map-leaflet{background:#10151c}html[data-theme=dark] #app .pcp .wm-reset,html[data-theme=dark] #app .pcp .wm-scope{background:color-mix(in srgb,var(--md-surface-container-high) 94%,transparent);color:var(--md-on-surface)}html[data-theme=dark] #app .pcp .wm-reset:hover,html[data-theme=dark] #app .pcp .wm-scope:hover{background:var(--md-surface-container-highest)}html[data-theme=dark] #app .pcp .wm-compass{background:color-mix(in srgb,var(--md-surface-container-high) 92%,transparent);border-color:var(--md-outline-variant)}html[data-theme=dark] .wm-district-inner{color:#aeb9c4;text-shadow:none}html[data-theme=dark] .wm-station .wm-route-inner{background:#1a2230;color:#d7dee6}html[data-theme=dark] .leaflet-container{background:#10151c}.wm-pin-holder,.wm-actor-holder{background:none;border:none}.wm-pin{position:absolute;left:0;top:0;width:16px;height:16px;border-radius:50%;background:var(--c,#8a94a6);border:3px solid #fff;box-shadow:0 2px 6px #00000073;transform:translate(-50%,-50%)}.wm-pin:after{content:\"\";position:absolute;left:50%;top:100%;width:2px;height:8px;background:#fff;transform:translate(-50%);opacity:.7}.wm-pin-label{position:absolute;left:12px;top:-9px;white-space:nowrap;background:#12141ad1;color:#fff;font-size:12px;font-weight:600;padding:2px 8px;border-radius:10px;pointer-events:none}.wm-actor-badge{position:absolute;left:0;top:0;width:26px;height:26px;border-radius:50%;background:#fff;color:#d1495b;border:3px solid #d1495b;font-size:14px;font-weight:800;line-height:1;display:grid;place-items:center;transform:translate(-50%,-50%);box-shadow:0 2px 6px #00000080;z-index:600}.wm-actor-name{position:absolute;left:0;top:20px;white-space:nowrap;background:#d1495b;color:#fff;font-size:11px;font-weight:700;padding:1px 7px;border-radius:9px;transform:translate(-50%)}.wm-district{background:none;border:none}.wm-district-inner{position:absolute;left:0;top:0;transform:translate(-50%,-50%);white-space:nowrap;font-size:12px;font-weight:800;letter-spacing:.2em;color:#5c6b78;text-shadow:0 1px 0 rgba(255,255,255,.9);pointer-events:none}.wm-route{background:none;border:none}.wm-route-inner{position:absolute;left:0;top:0;transform:translate(-50%,-50%);background:var(--c,#333);color:#fff;font-size:10px;font-weight:700;padding:1px 6px;border-radius:8px;white-space:nowrap;box-shadow:0 1px 3px #00000059;pointer-events:none}.wm-zoom-low .wm-minor{display:none}.wm-station .wm-route-inner{background:#fff;color:#33404c;border:1.5px solid var(--c,#888);border-radius:6px;font-size:9px;font-weight:700;padding:1px 5px}.leaflet-container{font-family:inherit;background:#e8edf2;border-radius:16px}.leaflet-container a{color:#2f6fed}.leaflet-popup-content{font-size:13px;line-height:1.5}\n";document.head.appendChild(s)}})();
