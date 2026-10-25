import { defineComponent as Fo, ref as F, computed as A, onMounted as ci, openBlock as v, createElementBlock as g, createElementVNode as i, createTextVNode as z, toDisplayString as r, createCommentVNode as E, Fragment as Q, renderList as Ee, normalizeClass as D, createVNode as Oe, Transition as Ca, withCtx as Ro, unref as $e, withDirectives as P, vModelText as M, vModelCheckbox as me, TransitionGroup as Ma, nextTick as Fi, watch as pn, onUnmounted as po, vShow as ui, normalizeStyle as ot } from "vue";
import { useRouter as za } from "vue-router";
import { i18n as Wi, useConfirm as Wo, AppSelect as Ue } from "@0kay/host";
function Ea(_e) {
  return _e && _e.__esModule && Object.prototype.hasOwnProperty.call(_e, "default") ? _e.default : _e;
}
var di = { exports: {} };
var Oa = di.exports, Do;
function Aa() {
  return Do || (Do = 1, (function(_e, y) {
    (function(a, Be) {
      Be(y);
    })(Oa, (function(a) {
      var Be = "1.9.4";
      function O(e) {
        var t, n, o, s;
        for (n = 1, o = arguments.length; n < o; n++) {
          s = arguments[n];
          for (t in s)
            e[t] = s[t];
        }
        return e;
      }
      var He = Object.create || /* @__PURE__ */ (function() {
        function e() {
        }
        return function(t) {
          return e.prototype = t, new e();
        };
      })();
      function N(e, t) {
        var n = Array.prototype.slice;
        if (e.bind)
          return e.bind.apply(e, n.call(arguments, 1));
        var o = n.call(arguments, 2);
        return function() {
          return e.apply(t, o.length ? o.concat(n.call(arguments)) : arguments);
        };
      }
      var Le = 0;
      function K(e) {
        return "_leaflet_id" in e || (e._leaflet_id = ++Le), e._leaflet_id;
      }
      function Xe(e, t, n) {
        var o, s, c, h;
        return h = function() {
          o = !1, s && (c.apply(n, s), s = !1);
        }, c = function() {
          o ? s = arguments : (e.apply(n, arguments), setTimeout(h, t), o = !0);
        }, c;
      }
      function ce(e, t, n) {
        var o = t[1], s = t[0], c = o - s;
        return e === o && n ? e : ((e - s) % c + c) % c + s;
      }
      function de() {
        return !1;
      }
      function q(e, t) {
        if (t === !1)
          return e;
        var n = Math.pow(10, t === void 0 ? 6 : t);
        return Math.round(e * n) / n;
      }
      function Te(e) {
        return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "");
      }
      function Ze(e) {
        return Te(e).split(/\s+/);
      }
      function ee(e, t) {
        Object.prototype.hasOwnProperty.call(e, "options") || (e.options = e.options ? He(e.options) : {});
        for (var n in t)
          e.options[n] = t[n];
        return e.options;
      }
      function Yt(e, t, n) {
        var o = [];
        for (var s in e)
          o.push(encodeURIComponent(n ? s.toUpperCase() : s) + "=" + encodeURIComponent(e[s]));
        return (!t || t.indexOf("?") === -1 ? "?" : "&") + o.join("&");
      }
      var fn = /\{ *([\w_ -]+) *\}/g;
      function ge(e, t) {
        return e.replace(fn, function(n, o) {
          var s = t[o];
          if (s === void 0)
            throw new Error("No value provided for variable " + n);
          return typeof s == "function" && (s = s(t)), s;
        });
      }
      var Ne = Array.isArray || function(e) {
        return Object.prototype.toString.call(e) === "[object Array]";
      };
      function Nt(e, t) {
        for (var n = 0; n < e.length; n++)
          if (e[n] === t)
            return n;
        return -1;
      }
      var Rt = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
      function Jt(e) {
        return window["webkit" + e] || window["moz" + e] || window["ms" + e];
      }
      var mn = 0;
      function Dt(e) {
        var t = +/* @__PURE__ */ new Date(), n = Math.max(0, 16 - (t - mn));
        return mn = t + n, window.setTimeout(e, n);
      }
      var Xt = window.requestAnimationFrame || Jt("RequestAnimationFrame") || Dt, Fe = window.cancelAnimationFrame || Jt("CancelAnimationFrame") || Jt("CancelRequestAnimationFrame") || function(e) {
        window.clearTimeout(e);
      };
      function Se(e, t, n) {
        if (n && Xt === Dt)
          e.call(t);
        else
          return Xt.call(window, N(e, t));
      }
      function Ce(e) {
        e && Fe.call(window, e);
      }
      var Vt = {
        __proto__: null,
        extend: O,
        create: He,
        bind: N,
        get lastId() {
          return Le;
        },
        stamp: K,
        throttle: Xe,
        wrapNum: ce,
        falseFn: de,
        formatNum: q,
        trim: Te,
        splitWords: Ze,
        setOptions: ee,
        getParamString: Yt,
        template: ge,
        isArray: Ne,
        indexOf: Nt,
        emptyImageUrl: Rt,
        requestFn: Xt,
        cancelFn: Fe,
        requestAnimFrame: Se,
        cancelAnimFrame: Ce
      };
      function Qe() {
      }
      Qe.extend = function(e) {
        var t = function() {
          ee(this), this.initialize && this.initialize.apply(this, arguments), this.callInitHooks();
        }, n = t.__super__ = this.prototype, o = He(n);
        o.constructor = t, t.prototype = o;
        for (var s in this)
          Object.prototype.hasOwnProperty.call(this, s) && s !== "prototype" && s !== "__super__" && (t[s] = this[s]);
        return e.statics && O(t, e.statics), e.includes && (Qt(e.includes), O.apply(null, [o].concat(e.includes))), O(o, e), delete o.statics, delete o.includes, o.options && (o.options = n.options ? He(n.options) : {}, O(o.options, e.options)), o._initHooks = [], o.callInitHooks = function() {
          if (!this._initHooksCalled) {
            n.callInitHooks && n.callInitHooks.call(this), this._initHooksCalled = !0;
            for (var c = 0, h = o._initHooks.length; c < h; c++)
              o._initHooks[c].call(this);
          }
        }, t;
      }, Qe.include = function(e) {
        var t = this.prototype.options;
        return O(this.prototype, e), e.options && (this.prototype.options = t, this.mergeOptions(e.options)), this;
      }, Qe.mergeOptions = function(e) {
        return O(this.prototype.options, e), this;
      }, Qe.addInitHook = function(e) {
        var t = Array.prototype.slice.call(arguments, 1), n = typeof e == "function" ? e : function() {
          this[e].apply(this, t);
        };
        return this.prototype._initHooks = this.prototype._initHooks || [], this.prototype._initHooks.push(n), this;
      };
      function Qt(e) {
        if (!(typeof L > "u" || !L || !L.Mixin)) {
          e = Ne(e) ? e : [e];
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
            e = Ze(e);
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
            e = Ze(e);
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
                  o[s].fn = de;
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
              this._firingCount && (p.fn = de, this._events[e] = o = o.slice()), o.splice(h, 1);
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
          var o = O({}, t, {
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
            e = Ze(e);
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
            this._eventParents[t].fire(e.type, O({
              layer: e.target,
              propagatedFrom: e.target
            }, e), !0);
        }
      };
      We.addEventListener = We.on, We.removeEventListener = We.clearAllEventListeners = We.off, We.addOneTimeEventListener = We.once, We.fireEvent = We.fire, We.hasEventListeners = We.listens;
      var Pt = Qe.extend(We);
      function W(e, t, n) {
        this.x = n ? Math.round(e) : e, this.y = n ? Math.round(t) : t;
      }
      var en = Math.trunc || function(e) {
        return e > 0 ? Math.floor(e) : Math.ceil(e);
      };
      W.prototype = {
        // @method clone(): Point
        // Returns a copy of the current point.
        clone: function() {
          return new W(this.x, this.y);
        },
        // @method add(otherPoint: Point): Point
        // Returns the result of addition of the current and the given points.
        add: function(e) {
          return this.clone()._add($(e));
        },
        _add: function(e) {
          return this.x += e.x, this.y += e.y, this;
        },
        // @method subtract(otherPoint: Point): Point
        // Returns the result of subtraction of the given point from the current.
        subtract: function(e) {
          return this.clone()._subtract($(e));
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
          return new W(this.x * e.x, this.y * e.y);
        },
        // @method unscaleBy(scale: Point): Point
        // Inverse of `scaleBy`. Divide each coordinate of the current point by
        // each coordinate of `scale`.
        unscaleBy: function(e) {
          return new W(this.x / e.x, this.y / e.y);
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
          return this.x = en(this.x), this.y = en(this.y), this;
        },
        // @method distanceTo(otherPoint: Point): Number
        // Returns the cartesian distance between the current and the given points.
        distanceTo: function(e) {
          e = $(e);
          var t = e.x - this.x, n = e.y - this.y;
          return Math.sqrt(t * t + n * n);
        },
        // @method equals(otherPoint: Point): Boolean
        // Returns `true` if the given point has the same coordinates.
        equals: function(e) {
          return e = $(e), e.x === this.x && e.y === this.y;
        },
        // @method contains(otherPoint: Point): Boolean
        // Returns `true` if both coordinates of the given point are less than the corresponding current point coordinates (in absolute values).
        contains: function(e) {
          return e = $(e), Math.abs(e.x) <= Math.abs(this.x) && Math.abs(e.y) <= Math.abs(this.y);
        },
        // @method toString(): String
        // Returns a string representation of the point for debugging purposes.
        toString: function() {
          return "Point(" + q(this.x) + ", " + q(this.y) + ")";
        }
      };
      function $(e, t, n) {
        return e instanceof W ? e : Ne(e) ? new W(e[0], e[1]) : e == null ? e : typeof e == "object" && "x" in e && "y" in e ? new W(e.x, e.y) : new W(e, t, n);
      }
      function m(e, t) {
        if (e)
          for (var n = t ? [e, t] : e, o = 0, s = n.length; o < s; o++)
            this.extend(n[o]);
      }
      m.prototype = {
        // @method extend(point: Point): this
        // Extends the bounds to contain the given point.
        // @alternative
        // @method extend(otherBounds: Bounds): this
        // Extend the bounds to contain the given bounds
        extend: function(e) {
          var t, n;
          if (!e)
            return this;
          if (e instanceof W || typeof e[0] == "number" || "x" in e)
            t = n = $(e);
          else if (e = T(e), t = e.min, n = e.max, !t || !n)
            return this;
          return !this.min && !this.max ? (this.min = t.clone(), this.max = n.clone()) : (this.min.x = Math.min(t.x, this.min.x), this.max.x = Math.max(n.x, this.max.x), this.min.y = Math.min(t.y, this.min.y), this.max.y = Math.max(n.y, this.max.y)), this;
        },
        // @method getCenter(round?: Boolean): Point
        // Returns the center point of the bounds.
        getCenter: function(e) {
          return $(
            (this.min.x + this.max.x) / 2,
            (this.min.y + this.max.y) / 2,
            e
          );
        },
        // @method getBottomLeft(): Point
        // Returns the bottom-left point of the bounds.
        getBottomLeft: function() {
          return $(this.min.x, this.max.y);
        },
        // @method getTopRight(): Point
        // Returns the top-right point of the bounds.
        getTopRight: function() {
          return $(this.max.x, this.min.y);
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
          return typeof e[0] == "number" || e instanceof W ? e = $(e) : e = T(e), e instanceof m ? (t = e.min, n = e.max) : t = n = e, t.x >= this.min.x && n.x <= this.max.x && t.y >= this.min.y && n.y <= this.max.y;
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
            $(t.x - o, t.y - s),
            $(n.x + o, n.y + s)
          );
        },
        // @method equals(otherBounds: Bounds): Boolean
        // Returns `true` if the rectangle is equivalent to the given bounds.
        equals: function(e) {
          return e ? (e = T(e), this.min.equals(e.getTopLeft()) && this.max.equals(e.getBottomRight())) : !1;
        }
      };
      function T(e, t) {
        return !e || e instanceof m ? e : new m(e, t);
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
          if (e instanceof ne)
            o = e, s = e;
          else if (e instanceof b) {
            if (o = e._southWest, s = e._northEast, !o || !s)
              return this;
          } else
            return e ? this.extend(ie(e) || G(e)) : this;
          return !t && !n ? (this._southWest = new ne(o.lat, o.lng), this._northEast = new ne(s.lat, s.lng)) : (t.lat = Math.min(o.lat, t.lat), t.lng = Math.min(o.lng, t.lng), n.lat = Math.max(s.lat, n.lat), n.lng = Math.max(s.lng, n.lng)), this;
        },
        // @method pad(bufferRatio: Number): LatLngBounds
        // Returns bounds created by extending or retracting the current bounds by a given ratio in each direction.
        // For example, a ratio of 0.5 extends the bounds by 50% in each direction.
        // Negative values will retract the bounds.
        pad: function(e) {
          var t = this._southWest, n = this._northEast, o = Math.abs(t.lat - n.lat) * e, s = Math.abs(t.lng - n.lng) * e;
          return new b(
            new ne(t.lat - o, t.lng - s),
            new ne(n.lat + o, n.lng + s)
          );
        },
        // @method getCenter(): LatLng
        // Returns the center point of the bounds.
        getCenter: function() {
          return new ne(
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
          return new ne(this.getNorth(), this.getWest());
        },
        // @method getSouthEast(): LatLng
        // Returns the south-east point of the bounds.
        getSouthEast: function() {
          return new ne(this.getSouth(), this.getEast());
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
          typeof e[0] == "number" || e instanceof ne || "lat" in e ? e = ie(e) : e = G(e);
          var t = this._southWest, n = this._northEast, o, s;
          return e instanceof b ? (o = e.getSouthWest(), s = e.getNorthEast()) : o = s = e, o.lat >= t.lat && s.lat <= n.lat && o.lng >= t.lng && s.lng <= n.lng;
        },
        // @method intersects(otherBounds: LatLngBounds): Boolean
        // Returns `true` if the rectangle intersects the given bounds. Two bounds intersect if they have at least one point in common.
        intersects: function(e) {
          e = G(e);
          var t = this._southWest, n = this._northEast, o = e.getSouthWest(), s = e.getNorthEast(), c = s.lat >= t.lat && o.lat <= n.lat, h = s.lng >= t.lng && o.lng <= n.lng;
          return c && h;
        },
        // @method overlaps(otherBounds: LatLngBounds): Boolean
        // Returns `true` if the rectangle overlaps the given bounds. Two bounds overlap if their intersection is an area.
        overlaps: function(e) {
          e = G(e);
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
          return e ? (e = G(e), this._southWest.equals(e.getSouthWest(), t) && this._northEast.equals(e.getNorthEast(), t)) : !1;
        },
        // @method isValid(): Boolean
        // Returns `true` if the bounds are properly initialized.
        isValid: function() {
          return !!(this._southWest && this._northEast);
        }
      };
      function G(e, t) {
        return e instanceof b ? e : new b(e, t);
      }
      function ne(e, t, n) {
        if (isNaN(e) || isNaN(t))
          throw new Error("Invalid LatLng object: (" + e + ", " + t + ")");
        this.lat = +e, this.lng = +t, n !== void 0 && (this.alt = +n);
      }
      ne.prototype = {
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
          return "LatLng(" + q(this.lat, e) + ", " + q(this.lng, e) + ")";
        },
        // @method distanceTo(otherLatLng: LatLng): Number
        // Returns the distance (in meters) to the given `LatLng` calculated using the [Spherical Law of Cosines](https://en.wikipedia.org/wiki/Spherical_law_of_cosines).
        distanceTo: function(e) {
          return je.distance(this, ie(e));
        },
        // @method wrap(): LatLng
        // Returns a new `LatLng` object with the longitude wrapped so it's always between -180 and +180 degrees.
        wrap: function() {
          return je.wrapLatLng(this);
        },
        // @method toBounds(sizeInMeters: Number): LatLngBounds
        // Returns a new `LatLngBounds` object in which each boundary is `sizeInMeters/2` meters apart from the `LatLng`.
        toBounds: function(e) {
          var t = 180 * e / 40075017, n = t / Math.cos(Math.PI / 180 * this.lat);
          return G(
            [this.lat - t, this.lng - n],
            [this.lat + t, this.lng + n]
          );
        },
        clone: function() {
          return new ne(this.lat, this.lng, this.alt);
        }
      };
      function ie(e, t, n) {
        return e instanceof ne ? e : Ne(e) && typeof e[0] != "object" ? e.length === 3 ? new ne(e[0], e[1], e[2]) : e.length === 2 ? new ne(e[0], e[1]) : null : e == null ? e : typeof e == "object" && "lat" in e ? new ne(e.lat, "lng" in e ? e.lng : e.lon, e.alt) : t === void 0 ? null : new ne(e, t, n);
      }
      var et = {
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
          return new m(o, s);
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
          var t = this.wrapLng ? ce(e.lng, this.wrapLng, !0) : e.lng, n = this.wrapLat ? ce(e.lat, this.wrapLat, !0) : e.lat, o = e.alt;
          return new ne(n, t, o);
        },
        // @method wrapLatLngBounds(bounds: LatLngBounds): LatLngBounds
        // Returns a `LatLngBounds` with the same size as the given one, ensuring
        // that its center is within the CRS's bounds.
        // Only accepts actual `L.LatLngBounds` instances, not arrays.
        wrapLatLngBounds: function(e) {
          var t = e.getCenter(), n = this.wrapLatLng(t), o = t.lat - n.lat, s = t.lng - n.lng;
          if (o === 0 && s === 0)
            return e;
          var c = e.getSouthWest(), h = e.getNorthEast(), p = new ne(c.lat - o, c.lng - s), f = new ne(h.lat - o, h.lng - s);
          return new b(p, f);
        }
      }, je = O({}, et, {
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
      }), Re = 6378137, Ae = {
        R: Re,
        MAX_LATITUDE: 85.0511287798,
        project: function(e) {
          var t = Math.PI / 180, n = this.MAX_LATITUDE, o = Math.max(Math.min(n, e.lat), -n), s = Math.sin(o * t);
          return new W(
            this.R * e.lng * t,
            this.R * Math.log((1 + s) / (1 - s)) / 2
          );
        },
        unproject: function(e) {
          var t = 180 / Math.PI;
          return new ne(
            (2 * Math.atan(Math.exp(e.y / this.R)) - Math.PI / 2) * t,
            e.x * t / this.R
          );
        },
        bounds: (function() {
          var e = Re * Math.PI;
          return new m([-e, -e], [e, e]);
        })()
      };
      function qe(e, t, n, o) {
        if (Ne(e)) {
          this._a = e[0], this._b = e[1], this._c = e[2], this._d = e[3];
          return;
        }
        this._a = e, this._b = t, this._c = n, this._d = o;
      }
      qe.prototype = {
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
          return t = t || 1, new W(
            (e.x / t - this._b) / this._a,
            (e.y / t - this._d) / this._c
          );
        }
      };
      function V(e, t, n, o) {
        return new qe(e, t, n, o);
      }
      var Dn = O({}, je, {
        code: "EPSG:3857",
        projection: Ae,
        transformation: (function() {
          var e = 0.5 / (Math.PI * Ae.R);
          return V(e, 0.5, -e, 0.5);
        })()
      }), Gi = O({}, Dn, {
        code: "EPSG:900913"
      });
      function Vn(e) {
        return document.createElementNS("http://www.w3.org/2000/svg", e);
      }
      function $n(e, t) {
        var n = "", o, s, c, h, p, f;
        for (o = 0, c = e.length; o < c; o++) {
          for (p = e[o], s = 0, h = p.length; s < h; s++)
            f = p[s], n += (s ? "L" : "M") + f.x + " " + f.y;
          n += t ? Z.svg ? "z" : "x" : "";
        }
        return n || "M0 0";
      }
      var _n = document.documentElement.style, vn = "ActiveXObject" in window, gt = vn && !document.addEventListener, hi = "msLaunchUri" in navigator && !("documentMode" in document), ye = st("webkit"), pt = st("android"), gn = st("android 2") || st("android 3"), Un = parseInt(/WebKit\/([0-9]+)|$/.exec(navigator.userAgent)[1], 10), ji = pt && st("Google") && Un < 537 && !("AudioNode" in window), yn = !!window.opera, Hn = !hi && st("chrome"), Fn = st("gecko") && !ye && !yn && !vn, qi = !Hn && st("safari"), pi = st("phantom"), Wn = "OTransition" in _n, fi = navigator.platform.indexOf("Win") === 0, mi = vn && "transition" in _n, Gn = "WebKitCSSMatrix" in window && "m11" in new window.WebKitCSSMatrix() && !gn, ke = "MozPerspective" in _n, bn = !window.L_DISABLE_3D && (mi || Gn || ke) && !Wn && !pi, Lt = typeof orientation < "u" || st("mobile"), _i = Lt && ye, vi = Lt && Gn, wn = !window.PointerEvent && window.MSPointerEvent, tn = !!(window.PointerEvent || wn), Tt = "ontouchstart" in window || !!window.TouchEvent, jn = !window.L_NO_TOUCH && (Tt || tn), xn = Lt && yn, kn = Lt && Fn, gi = (window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI) > 1, yi = (function() {
        var e = !1;
        try {
          var t = Object.defineProperty({}, "passive", {
            get: function() {
              e = !0;
            }
          });
          window.addEventListener("testPassiveEventSupport", de, t), window.removeEventListener("testPassiveEventSupport", de, t);
        } catch {
        }
        return e;
      })(), he = (function() {
        return !!document.createElement("canvas").getContext;
      })(), tt = !!(document.createElementNS && Vn("svg").createSVGRect), ft = !!tt && (function() {
        var e = document.createElement("div");
        return e.innerHTML = "<svg/>", (e.firstChild && e.firstChild.namespaceURI) === "http://www.w3.org/2000/svg";
      })(), at = !tt && (function() {
        try {
          var e = document.createElement("div");
          e.innerHTML = '<v:shape adj="1"/>';
          var t = e.firstChild;
          return t.style.behavior = "url(#default#VML)", t && typeof t.adj == "object";
        } catch {
          return !1;
        }
      })(), yt = navigator.platform.indexOf("Mac") === 0, Ki = navigator.platform.indexOf("Linux") === 0;
      function st(e) {
        return navigator.userAgent.toLowerCase().indexOf(e) >= 0;
      }
      var Z = {
        ie: vn,
        ielt9: gt,
        edge: hi,
        webkit: ye,
        android: pt,
        android23: gn,
        androidStock: ji,
        opera: yn,
        chrome: Hn,
        gecko: Fn,
        safari: qi,
        phantom: pi,
        opera12: Wn,
        win: fi,
        ie3d: mi,
        webkit3d: Gn,
        gecko3d: ke,
        any3d: bn,
        mobile: Lt,
        mobileWebkit: _i,
        mobileWebkit3d: vi,
        msPointer: wn,
        pointer: tn,
        touch: jn,
        touchNative: Tt,
        mobileOpera: xn,
        mobileGecko: kn,
        retina: gi,
        passiveEvents: yi,
        canvas: he,
        svg: tt,
        vml: at,
        inlineSvg: ft,
        mac: yt,
        linux: Ki
      }, bi = Z.msPointer ? "MSPointerDown" : "pointerdown", wi = Z.msPointer ? "MSPointerMove" : "pointermove", xi = Z.msPointer ? "MSPointerUp" : "pointerup", ki = Z.msPointer ? "MSPointerCancel" : "pointercancel", qn = {
        touchstart: bi,
        touchmove: wi,
        touchend: xi,
        touchcancel: ki
      }, Pn = {
        touchstart: nn,
        touchmove: bt,
        touchend: bt,
        touchcancel: bt
      }, St = {}, Kn = !1;
      function Pi(e, t, n) {
        return t === "touchstart" && Xi(), Pn[t] ? (n = Pn[t].bind(this, n), e.addEventListener(qn[t], n, !1), n) : (console.warn("wrong event specified:", t), de);
      }
      function Yi(e, t, n) {
        if (!qn[t]) {
          console.warn("wrong event specified:", t);
          return;
        }
        e.removeEventListener(qn[t], n, !1);
      }
      function Ji(e) {
        St[e.pointerId] = e;
      }
      function _(e) {
        St[e.pointerId] && (St[e.pointerId] = e);
      }
      function $t(e) {
        delete St[e.pointerId];
      }
      function Xi() {
        Kn || (document.addEventListener(bi, Ji, !0), document.addEventListener(wi, _, !0), document.addEventListener(xi, $t, !0), document.addEventListener(ki, $t, !0), Kn = !0);
      }
      function bt(e, t) {
        if (t.pointerType !== (t.MSPOINTER_TYPE_MOUSE || "mouse")) {
          t.touches = [];
          for (var n in St)
            t.touches.push(St[n]);
          t.changedTouches = [t], e(t);
        }
      }
      function nn(e, t) {
        t.MSPOINTER_TYPE_TOUCH && t.pointerType === t.MSPOINTER_TYPE_TOUCH && Me(t), bt(e, t);
      }
      function on(e) {
        var t = {}, n, o;
        for (o in e)
          n = e[o], t[o] = n && n.bind ? n.bind(e) : n;
        return e = t, t.type = "dblclick", t.detail = 2, t.isTrusted = !1, t._simulated = !0, t;
      }
      var an = 200;
      function sn(e, t) {
        e.addEventListener("dblclick", t);
        var n = 0, o;
        function s(c) {
          if (c.detail !== 1) {
            o = c.detail;
            return;
          }
          if (!(c.pointerType === "mouse" || c.sourceCapabilities && !c.sourceCapabilities.firesTouchEvents)) {
            var h = Ti(c);
            if (!(h.some(function(f) {
              return f instanceof HTMLLabelElement && f.attributes.for;
            }) && !h.some(function(f) {
              return f instanceof HTMLInputElement || f instanceof HTMLSelectElement;
            }))) {
              var p = Date.now();
              p - n <= an ? (o++, o === 2 && t(on(c))) : o = 1, n = p;
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
      var Ct = Wt(
        ["transform", "webkitTransform", "OTransform", "MozTransform", "msTransform"]
      ), mt = Wt(
        ["webkitTransition", "transition", "OTransition", "MozTransition", "msTransition"]
      ), nt = mt === "webkitTransition" || mt === "OTransition" ? mt + "End" : "transitionend";
      function ln(e) {
        return typeof e == "string" ? document.getElementById(e) : e;
      }
      function un(e, t) {
        var n = e.style[t] || e.currentStyle && e.currentStyle[t];
        if ((!n || n === "auto") && document.defaultView) {
          var o = document.defaultView.getComputedStyle(e, null);
          n = o ? o[t] : null;
        }
        return n === "auto" ? null : n;
      }
      function Y(e, t, n) {
        var o = document.createElement(e);
        return o.className = t || "", n && n.appendChild(o), o;
      }
      function I(e) {
        var t = e.parentNode;
        t && t.removeChild(e);
      }
      function Ln(e) {
        for (; e.firstChild; )
          e.removeChild(e.firstChild);
      }
      function Ut(e) {
        var t = e.parentNode;
        t && t.lastChild !== e && t.appendChild(e);
      }
      function Ht(e) {
        var t = e.parentNode;
        t && t.firstChild !== e && t.insertBefore(e, t.firstChild);
      }
      function Tn(e, t) {
        if (e.classList !== void 0)
          return e.classList.contains(t);
        var n = wt(e);
        return n.length > 0 && new RegExp("(^|\\s)" + t + "(\\s|$)").test(n);
      }
      function J(e, t) {
        if (e.classList !== void 0)
          for (var n = Ze(t), o = 0, s = n.length; o < s; o++)
            e.classList.add(n[o]);
        else if (!Tn(e, t)) {
          var c = wt(e);
          Ft(e, (c ? c + " " : "") + t);
        }
      }
      function re(e, t) {
        e.classList !== void 0 ? e.classList.remove(t) : Ft(e, Te((" " + wt(e) + " ").replace(" " + t + " ", " ")));
      }
      function Ft(e, t) {
        e.className.baseVal === void 0 ? e.className = t : e.className.baseVal = t;
      }
      function wt(e) {
        return e.correspondingElement && (e = e.correspondingElement), e.className.baseVal === void 0 ? e.className : e.className.baseVal;
      }
      function le(e, t) {
        "opacity" in e.style ? e.style.opacity = t : "filter" in e.style && U(e, t);
      }
      function U(e, t) {
        var n = !1, o = "DXImageTransform.Microsoft.Alpha";
        try {
          n = e.filters.item(o);
        } catch {
          if (t === 1)
            return;
        }
        t = Math.round(t * 100), n ? (n.Enabled = t !== 100, n.Opacity = t) : e.style.filter += " progid:" + o + "(opacity=" + t + ")";
      }
      function Wt(e) {
        for (var t = document.documentElement.style, n = 0; n < e.length; n++)
          if (e[n] in t)
            return e[n];
        return !1;
      }
      function xt(e, t, n) {
        var o = t || new W(0, 0);
        e.style[Ct] = (Z.ie3d ? "translate(" + o.x + "px," + o.y + "px)" : "translate3d(" + o.x + "px," + o.y + "px,0)") + (n ? " scale(" + n + ")" : "");
      }
      function Pe(e, t) {
        e._leaflet_pos = t, Z.any3d ? xt(e, t) : (e.style.left = t.x + "px", e.style.top = t.y + "px");
      }
      function it(e) {
        return e._leaflet_pos || new W(0, 0);
      }
      var rt, lt, cn;
      if ("onselectstart" in document)
        rt = function() {
          j(window, "selectstart", Me);
        }, lt = function() {
          ue(window, "selectstart", Me);
        };
      else {
        var Ke = Wt(
          ["userSelect", "WebkitUserSelect", "OUserSelect", "MozUserSelect", "msUserSelect"]
        );
        rt = function() {
          if (Ke) {
            var e = document.documentElement.style;
            cn = e[Ke], e[Ke] = "none";
          }
        }, lt = function() {
          Ke && (document.documentElement.style[Ke] = cn, cn = void 0);
        };
      }
      function Yn() {
        j(window, "dragstart", Me);
      }
      function Jn() {
        ue(window, "dragstart", Me);
      }
      var Mt, De;
      function Ye(e) {
        for (; e.tabIndex === -1; )
          e = e.parentNode;
        e.style && (Sn(), Mt = e, De = e.style.outlineStyle, e.style.outlineStyle = "none", j(window, "keydown", Sn));
      }
      function Sn() {
        Mt && (Mt.style.outlineStyle = De, Mt = void 0, De = void 0, ue(window, "keydown", Sn));
      }
      function Li(e) {
        do
          e = e.parentNode;
        while ((!e.offsetWidth || !e.offsetHeight) && e !== document.body);
        return e;
      }
      function Cn(e) {
        var t = e.getBoundingClientRect();
        return {
          x: t.width / e.offsetWidth || 1,
          y: t.height / e.offsetHeight || 1,
          boundingClientRect: t
        };
      }
      var Qi = {
        __proto__: null,
        TRANSFORM: Ct,
        TRANSITION: mt,
        TRANSITION_END: nt,
        get: ln,
        getStyle: un,
        create: Y,
        remove: I,
        empty: Ln,
        toFront: Ut,
        toBack: Ht,
        hasClass: Tn,
        addClass: J,
        removeClass: re,
        setClass: Ft,
        getClass: wt,
        setOpacity: le,
        testProp: Wt,
        setTransform: xt,
        setPosition: Pe,
        getPosition: it,
        get disableTextSelection() {
          return rt;
        },
        get enableTextSelection() {
          return lt;
        },
        disableImageDrag: Yn,
        enableImageDrag: Jn,
        preventOutline: Ye,
        restoreOutline: Sn,
        getSizedParentNode: Li,
        getScale: Cn
      };
      function j(e, t, n, o) {
        if (t && typeof t == "object")
          for (var s in t)
            jt(e, s, t[s], n);
        else {
          t = Ze(t);
          for (var c = 0, h = t.length; c < h; c++)
            jt(e, t[c], n, o);
        }
        return this;
      }
      var ut = "_leaflet_events";
      function ue(e, t, n, o) {
        if (arguments.length === 1)
          Mn(e), delete e[ut];
        else if (t && typeof t == "object")
          for (var s in t)
            zn(e, s, t[s], n);
        else if (t = Ze(t), arguments.length === 2)
          Mn(e, function(p) {
            return Nt(t, p) !== -1;
          });
        else
          for (var c = 0, h = t.length; c < h; c++)
            zn(e, t[c], n, o);
        return this;
      }
      function Mn(e, t) {
        for (var n in e[ut]) {
          var o = n.split(/\d/)[0];
          (!t || t(o)) && zn(e, o, null, null, n);
        }
      }
      var Gt = {
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        wheel: !("onwheel" in window) && "mousewheel"
      };
      function jt(e, t, n, o) {
        var s = t + K(n) + (o ? "_" + K(o) : "");
        if (e[ut] && e[ut][s])
          return this;
        var c = function(p) {
          return n.call(o || e, p || window.event);
        }, h = c;
        !Z.touchNative && Z.pointer && t.indexOf("touch") === 0 ? c = Pi(e, t, c) : Z.touch && t === "dblclick" ? c = sn(e, c) : "addEventListener" in e ? t === "touchstart" || t === "touchmove" || t === "wheel" || t === "mousewheel" ? e.addEventListener(Gt[t] || t, c, Z.passiveEvents ? { passive: !1 } : !1) : t === "mouseenter" || t === "mouseleave" ? (c = function(p) {
          p = p || window.event, Xn(e, p) && h(p);
        }, e.addEventListener(Gt[t], c, !1)) : e.addEventListener(t, h, !1) : e.attachEvent("on" + t, c), e[ut] = e[ut] || {}, e[ut][s] = c;
      }
      function zn(e, t, n, o, s) {
        s = s || t + K(n) + (o ? "_" + K(o) : "");
        var c = e[ut] && e[ut][s];
        if (!c)
          return this;
        !Z.touchNative && Z.pointer && t.indexOf("touch") === 0 ? Yi(e, t, c) : Z.touch && t === "dblclick" ? rn(e, c) : "removeEventListener" in e ? e.removeEventListener(Gt[t] || t, c, !1) : e.detachEvent("on" + t, c), e[ut][s] = null;
      }
      function ct(e) {
        return e.stopPropagation ? e.stopPropagation() : e.originalEvent ? e.originalEvent._stopped = !0 : e.cancelBubble = !0, this;
      }
      function be(e) {
        return jt(e, "wheel", ct), this;
      }
      function dn(e) {
        return j(e, "mousedown touchstart dblclick contextmenu", ct), e._leaflet_disable_click = !0, this;
      }
      function Me(e) {
        return e.preventDefault ? e.preventDefault() : e.returnValue = !1, this;
      }
      function zt(e) {
        return Me(e), ct(e), this;
      }
      function Ti(e) {
        if (e.composedPath)
          return e.composedPath();
        for (var t = [], n = e.target; n; )
          t.push(n), n = n.parentNode;
        return t;
      }
      function Si(e, t) {
        if (!t)
          return new W(e.clientX, e.clientY);
        var n = Cn(t), o = n.boundingClientRect;
        return new W(
          // offset.left/top values are in page scale (like clientX/Y),
          // whereas clientLeft/Top (border width) values are the original values (before CSS scale applies).
          (e.clientX - o.left) / n.x - t.clientLeft,
          (e.clientY - o.top) / n.y - t.clientTop
        );
      }
      var eo = Z.linux && Z.chrome ? window.devicePixelRatio : Z.mac ? window.devicePixelRatio * 3 : window.devicePixelRatio > 0 ? 2 * window.devicePixelRatio : 1;
      function Ci(e) {
        return Z.edge ? e.wheelDeltaY / 2 : (
          // Don't trust window-geometry-based delta
          e.deltaY && e.deltaMode === 0 ? -e.deltaY / eo : (
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
      function Xn(e, t) {
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
      var to = {
        __proto__: null,
        on: j,
        off: ue,
        stopPropagation: ct,
        disableScrollPropagation: be,
        disableClickPropagation: dn,
        preventDefault: Me,
        stop: zt,
        getPropagationPath: Ti,
        getMousePosition: Si,
        getWheelDelta: Ci,
        isExternalTarget: Xn,
        addListener: j,
        removeListener: ue
      }, hn = Pt.extend({
        // @method run(el: HTMLElement, newPos: Point, duration?: Number, easeLinearity?: Number)
        // Run an animation of a given element to a new position, optionally setting
        // duration in seconds (`0.25` by default) and easing linearity factor (3rd
        // argument of the [cubic bezier curve](https://cubic-bezier.com/#0,0,.5,1),
        // `0.5` by default).
        run: function(e, t, n, o) {
          this.stop(), this._el = e, this._inProgress = !0, this._duration = n || 0.25, this._easeOutPower = 1 / Math.max(o || 0.5, 0.2), this._startPos = it(e), this._offset = t.subtract(this._startPos), this._startTime = +/* @__PURE__ */ new Date(), this.fire("start"), this._animate();
        },
        // @method stop()
        // Stops the animation (if currently running).
        stop: function() {
          this._inProgress && (this._step(!0), this._complete());
        },
        _animate: function() {
          this._animId = Se(this._animate, this), this._step();
        },
        _step: function(e) {
          var t = +/* @__PURE__ */ new Date() - this._startTime, n = this._duration * 1e3;
          t < n ? this._runFrame(this._easeOut(t / n), e) : (this._runFrame(1), this._complete());
        },
        _runFrame: function(e, t) {
          var n = this._startPos.add(this._offset.multiplyBy(e));
          t && n._round(), Pe(this._el, n), this.fire("step");
        },
        _complete: function() {
          Ce(this._animId), this._inProgress = !1, this.fire("end");
        },
        _easeOut: function(e) {
          return 1 - Math.pow(1 - e, this._easeOutPower);
        }
      }), te = Pt.extend({
        options: {
          // @section Map State Options
          // @option crs: CRS = L.CRS.EPSG3857
          // The [Coordinate Reference System](#crs) to use. Don't change this if you're not
          // sure what it means.
          crs: Dn,
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
          t = ee(this, t), this._handlers = [], this._layers = {}, this._zoomBoundLayers = {}, this._sizeChanged = !0, this._initContainer(e), this._initLayout(), this._onResize = N(this._onResize, this), this._initEvents(), t.maxBounds && this.setMaxBounds(t.maxBounds), t.zoom !== void 0 && (this._zoom = this._limitZoom(t.zoom)), t.center && t.zoom !== void 0 && this.setView(ie(t.center), t.zoom, { reset: !0 }), this.callInitHooks(), this._zoomAnimated = mt && Z.any3d && !Z.mobileOpera && this.options.zoomAnimation, this._zoomAnimated && (this._createAnimProxy(), j(this._proxy, nt, this._catchTransitionEnd, this)), this._addLayers(this.options.layers);
        },
        // @section Methods for modifying map state
        // @method setView(center: LatLng, zoom: Number, options?: Zoom/pan options): this
        // Sets the view of the map (geographical center and zoom) with the given
        // animation options.
        setView: function(e, t, n) {
          if (t = t === void 0 ? this._zoom : this._limitZoom(t), e = this._limitCenter(ie(e), t, this.options.maxBounds), n = n || {}, this._stop(), this._loaded && !n.reset && n !== !0) {
            n.animate !== void 0 && (n.zoom = O({ animate: n.animate }, n.zoom), n.pan = O({ animate: n.animate, duration: n.duration }, n.pan));
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
          return e = e || (Z.any3d ? this.options.zoomDelta : 1), this.setZoom(this._zoom + e, t);
        },
        // @method zoomOut(delta?: Number, options?: Zoom options): this
        // Decreases the zoom of the map by `delta` ([`zoomDelta`](#map-zoomdelta) by default).
        zoomOut: function(e, t) {
          return e = e || (Z.any3d ? this.options.zoomDelta : 1), this.setZoom(this._zoom - e, t);
        },
        // @method setZoomAround(latlng: LatLng, zoom: Number, options: Zoom options): this
        // Zooms the map while keeping a specified geographical point on the map
        // stationary (e.g. used internally for scroll zoom and double-click zoom).
        // @alternative
        // @method setZoomAround(offset: Point, zoom: Number, options: Zoom options): this
        // Zooms the map while keeping a specified pixel on the map (relative to the top-left corner) stationary.
        setZoomAround: function(e, t, n) {
          var o = this.getZoomScale(t), s = this.getSize().divideBy(2), c = e instanceof W ? e : this.latLngToContainerPoint(e), h = c.subtract(s).multiplyBy(1 - 1 / o), p = this.containerPointToLatLng(s.add(h));
          return this.setView(p, t, { zoom: n });
        },
        _getBoundsCenterZoom: function(e, t) {
          t = t || {}, e = e.getBounds ? e.getBounds() : G(e);
          var n = $(t.paddingTopLeft || t.padding || [0, 0]), o = $(t.paddingBottomRight || t.padding || [0, 0]), s = this.getBoundsZoom(e, !1, n.add(o));
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
          if (e = G(e), !e.isValid())
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
          if (e = $(e).round(), t = t || {}, !e.x && !e.y)
            return this.fire("moveend");
          if (t.animate !== !0 && !this.getSize().contains(e))
            return this._resetView(this.unproject(this.project(this.getCenter()).add(e)), this.getZoom()), this;
          if (this._panAnim || (this._panAnim = new hn(), this._panAnim.on({
            step: this._onPanTransitionStep,
            end: this._onPanTransitionEnd
          }, this)), t.noMoveStart || this.fire("movestart"), t.animate !== !1) {
            J(this._mapPane, "leaflet-pan-anim");
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
          if (n = n || {}, n.animate === !1 || !Z.any3d)
            return this.setView(e, t, n);
          this._stop();
          var o = this.project(this.getCenter()), s = this.project(e), c = this.getSize(), h = this._zoom;
          e = ie(e), t = t === void 0 ? h : t;
          var p = Math.max(c.x, c.y), f = p * this.getZoomScale(h, t), k = s.distanceTo(o) || 1, S = 1.42, H = S * S;
          function se(Ie) {
            var Hi = Ie ? -1 : 1, Pa = Ie ? f : p, La = f * f - p * p + Hi * H * H * k * k, Ta = 2 * Pa * H * k, ho = La / Ta, No = Math.sqrt(ho * ho + 1) - ho, Sa = No < 1e-9 ? -18 : Math.log(No);
            return Sa;
          }
          function Ge(Ie) {
            return (Math.exp(Ie) - Math.exp(-Ie)) / 2;
          }
          function Ve(Ie) {
            return (Math.exp(Ie) + Math.exp(-Ie)) / 2;
          }
          function ht(Ie) {
            return Ge(Ie) / Ve(Ie);
          }
          var Je = se(0);
          function Rn(Ie) {
            return p * (Ve(Je) / Ve(Je + S * Ie));
          }
          function ba(Ie) {
            return p * (Ve(Je) * ht(Je + S * Ie) - Ge(Je)) / H;
          }
          function wa(Ie) {
            return 1 - Math.pow(1 - Ie, 1.5);
          }
          var xa = Date.now(), Bo = (se(1) - Je) / S, ka = n.duration ? 1e3 * n.duration : 1e3 * Bo * 0.8;
          function Zo() {
            var Ie = (Date.now() - xa) / ka, Hi = wa(Ie) * Bo;
            Ie <= 1 ? (this._flyToFrame = Se(Zo, this), this._move(
              this.unproject(o.add(s.subtract(o).multiplyBy(ba(Hi) / k)), h),
              this.getScaleZoom(p / Rn(Hi), h),
              { flyTo: !0 }
            )) : this._move(e, t)._moveEnd(!0);
          }
          return this._moveStart(!0, n.noMoveStart), Zo.call(this), this;
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
          return e = G(e), this.listens("moveend", this._panInsideMaxBounds) && this.off("moveend", this._panInsideMaxBounds), e.isValid() ? (this.options.maxBounds = e, this._loaded && this._panInsideMaxBounds(), this.on("moveend", this._panInsideMaxBounds)) : (this.options.maxBounds = null, this);
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
          var n = this.getCenter(), o = this._limitCenter(n, this._zoom, G(e));
          return n.equals(o) || this.panTo(o, t), this._enforcingBounds = !1, this;
        },
        // @method panInside(latlng: LatLng, options?: padding options): this
        // Pans the map the minimum amount to make the `latlng` visible. Use
        // padding options to fit the display to more restricted bounds.
        // If `latlng` is already within the (optionally padded) display bounds,
        // the map will not be panned.
        panInside: function(e, t) {
          t = t || {};
          var n = $(t.paddingTopLeft || t.padding || [0, 0]), o = $(t.paddingBottomRight || t.padding || [0, 0]), s = this.project(this.getCenter()), c = this.project(e), h = this.getPixelBounds(), p = T([h.min.add(n), h.max.subtract(o)]), f = p.getSize();
          if (!p.contains(c)) {
            this._enforcingBounds = !0;
            var k = c.subtract(p.getCenter()), S = p.extend(c).getSize().subtract(f);
            s.x += k.x < 0 ? -S.x : S.x, s.y += k.y < 0 ? -S.y : S.y, this.panTo(this.unproject(s), t), this._enforcingBounds = !1;
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
          e = O({
            animate: !1,
            pan: !0
          }, e === !0 ? { animate: !0 } : e);
          var t = this.getSize();
          this._sizeChanged = !0, this._lastCenter = null;
          var n = this.getSize(), o = t.divideBy(2).round(), s = n.divideBy(2).round(), c = o.subtract(s);
          return !c.x && !c.y ? this : (e.animate && e.pan ? this.panBy(c) : (e.pan && this._rawPanBy(c), this.fire("move"), e.debounceMoveend ? (clearTimeout(this._sizeTimer), this._sizeTimer = setTimeout(N(this.fire, this, "moveend"), 200)) : this.fire("moveend")), this.fire("resize", {
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
          if (e = this._locateOptions = O({
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
          var t = N(this._handleGeolocationResponse, this), n = N(this._handleGeolocationError, this);
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
            var t = e.coords.latitude, n = e.coords.longitude, o = new ne(t, n), s = o.toBounds(e.coords.accuracy * 2), c = this._locateOptions;
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
          this._locationWatchId !== void 0 && this.stopLocate(), this._stop(), I(this._mapPane), this._clearControlPos && this._clearControlPos(), this._resizeRequest && (Ce(this._resizeRequest), this._resizeRequest = null), this._clearHandlers(), this._loaded && this.fire("unload");
          var e;
          for (e in this._layers)
            this._layers[e].remove();
          for (e in this._panes)
            I(this._panes[e]);
          return this._layers = [], this._panes = [], delete this._mapPane, delete this._renderer, this;
        },
        // @section Other Methods
        // @method createPane(name: String, container?: HTMLElement): HTMLElement
        // Creates a new [map pane](#map-pane) with the given name if it doesn't exist already,
        // then returns it. The pane is created as a child of `container`, or
        // as a child of the main map pane if not set.
        createPane: function(e, t) {
          var n = "leaflet-pane" + (e ? " leaflet-" + e.replace("Pane", "") + "-pane" : ""), o = Y("div", n, t || this._mapPane);
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
          e = G(e), n = $(n || [0, 0]);
          var o = this.getZoom() || 0, s = this.getMinZoom(), c = this.getMaxZoom(), h = e.getNorthWest(), p = e.getSouthEast(), f = this.getSize().subtract(n), k = T(this.project(p, o), this.project(h, o)).getSize(), S = Z.any3d ? this.options.zoomSnap : 1, H = f.x / k.x, se = f.y / k.y, Ge = t ? Math.max(H, se) : Math.min(H, se);
          return o = this.getScaleZoom(Ge, o), S && (o = Math.round(o / (S / 100)) * (S / 100), o = t ? Math.ceil(o / S) * S : Math.floor(o / S) * S), Math.max(s, Math.min(c, o));
        },
        // @method getSize(): Point
        // Returns the current size of the map container (in pixels).
        getSize: function() {
          return (!this._size || this._sizeChanged) && (this._size = new W(
            this._container.clientWidth || 0,
            this._container.clientHeight || 0
          ), this._sizeChanged = !1), this._size.clone();
        },
        // @method getPixelBounds(): Bounds
        // Returns the bounds of the current map view in projected pixel
        // coordinates (sometimes useful in layer and overlay implementations).
        getPixelBounds: function(e, t) {
          var n = this._getTopLeftPoint(e, t);
          return new m(n, n.add(this.getSize()));
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
          return t = t === void 0 ? this._zoom : t, this.options.crs.pointToLatLng($(e), t);
        },
        // @method layerPointToLatLng(point: Point): LatLng
        // Given a pixel coordinate relative to the [origin pixel](#map-getpixelorigin),
        // returns the corresponding geographical coordinate (for the current zoom level).
        layerPointToLatLng: function(e) {
          var t = $(e).add(this.getPixelOrigin());
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
          return this.options.crs.wrapLatLngBounds(G(e));
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
          return $(e).subtract(this._getMapPanePos());
        },
        // @method layerPointToContainerPoint(point: Point): Point
        // Given a pixel coordinate relative to the [origin pixel](#map-getpixelorigin),
        // returns the corresponding pixel coordinate relative to the map container.
        layerPointToContainerPoint: function(e) {
          return $(e).add(this._getMapPanePos());
        },
        // @method containerPointToLatLng(point: Point): LatLng
        // Given a pixel coordinate relative to the map container, returns
        // the corresponding geographical coordinate (for the current zoom level).
        containerPointToLatLng: function(e) {
          var t = this.containerPointToLayerPoint($(e));
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
          return Si(e, this._container);
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
          var t = this._container = ln(e);
          if (t) {
            if (t._leaflet_id)
              throw new Error("Map container is already initialized.");
          } else throw new Error("Map container not found.");
          j(t, "scroll", this._onScroll, this), this._containerId = K(t);
        },
        _initLayout: function() {
          var e = this._container;
          this._fadeAnimated = this.options.fadeAnimation && Z.any3d, J(e, "leaflet-container" + (Z.touch ? " leaflet-touch" : "") + (Z.retina ? " leaflet-retina" : "") + (Z.ielt9 ? " leaflet-oldie" : "") + (Z.safari ? " leaflet-safari" : "") + (this._fadeAnimated ? " leaflet-fade-anim" : ""));
          var t = un(e, "position");
          t !== "absolute" && t !== "relative" && t !== "fixed" && t !== "sticky" && (e.style.position = "relative"), this._initPanes(), this._initControlPos && this._initControlPos();
        },
        _initPanes: function() {
          var e = this._panes = {};
          this._paneRenderers = {}, this._mapPane = this.createPane("mapPane", this._container), Pe(this._mapPane, new W(0, 0)), this.createPane("tilePane"), this.createPane("overlayPane"), this.createPane("shadowPane"), this.createPane("markerPane"), this.createPane("tooltipPane"), this.createPane("popupPane"), this.options.markerZoomAnimation || (J(e.markerPane, "leaflet-zoom-hide"), J(e.shadowPane, "leaflet-zoom-hide"));
        },
        // private methods that modify map state
        // @section Map state change events
        _resetView: function(e, t, n) {
          Pe(this._mapPane, new W(0, 0));
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
          return Ce(this._flyToFrame), this._panAnim && this._panAnim.stop(), this;
        },
        _rawPanBy: function(e) {
          Pe(this._mapPane, this._getMapPanePos().subtract(e));
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
          var t = e ? ue : j;
          t(this._container, "click dblclick mousedown mouseup mouseover mouseout mousemove contextmenu keypress keydown keyup", this._handleDOMEvent, this), this.options.trackResize && t(window, "resize", this._onResize, this), Z.any3d && this.options.transform3DLimit && (e ? this.off : this.on).call(this, "moveend", this._onMoveEnd);
        },
        _onResize: function() {
          Ce(this._resizeRequest), this._resizeRequest = Se(
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
            if (o && o.listens(t, !0) && (s && !Xn(c, e) || (n.push(o), s)) || c === this._container)
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
            n === "mousedown" && Ye(t), this._fireDOMEvent(e, n);
          }
        },
        _mouseEvents: ["click", "dblclick", "mouseover", "mouseout", "contextmenu"],
        _fireDOMEvent: function(e, t, n) {
          if (e.type === "click") {
            var o = O({}, e);
            o.type = "preclick", this._fireDOMEvent(o, o.type, n);
          }
          var s = this._findEventTargets(e, t);
          if (n) {
            for (var c = [], h = 0; h < n.length; h++)
              n[h].listens(t, !0) && c.push(n[h]);
            s = c.concat(s);
          }
          if (s.length) {
            t === "contextmenu" && Me(e);
            var p = s[0], f = {
              originalEvent: e
            };
            if (e.type !== "keypress" && e.type !== "keydown" && e.type !== "keyup") {
              var k = p.getLatLng && (!p._radius || p._radius <= 10);
              f.containerPoint = k ? this.latLngToContainerPoint(p.getLatLng()) : this.mouseEventToContainerPoint(e), f.layerPoint = this.containerPointToLayerPoint(f.containerPoint), f.latlng = k ? p.getLatLng() : this.layerPointToLatLng(f.layerPoint);
            }
            for (h = 0; h < s.length; h++)
              if (s[h].fire(t, f, !0), f.originalEvent._stopped || s[h].options.bubblingMouseEvents === !1 && Nt(this._mouseEvents, t) !== -1)
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
          return it(this._mapPane) || new W(0, 0);
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
          var o = this.project(e, t), s = this.getSize().divideBy(2), c = new m(o.subtract(s), o.add(s)), h = this._getBoundsOffset(c, n, t);
          return Math.abs(h.x) <= 1 && Math.abs(h.y) <= 1 ? e : this.unproject(o.add(h), t);
        },
        // adjust offset for view to get inside bounds
        _limitOffset: function(e, t) {
          if (!t)
            return e;
          var n = this.getPixelBounds(), o = new m(n.min.add(e), n.max.add(e));
          return e.add(this._getBoundsOffset(o, t));
        },
        // returns offset needed for pxBounds to get inside maxBounds at a specified zoom
        _getBoundsOffset: function(e, t, n) {
          var o = T(
            this.project(t.getNorthEast(), n),
            this.project(t.getSouthWest(), n)
          ), s = o.min.subtract(e.min), c = o.max.subtract(e.max), h = this._rebound(s.x, -c.x), p = this._rebound(s.y, -c.y);
          return new W(h, p);
        },
        _rebound: function(e, t) {
          return e + t > 0 ? Math.round(e - t) / 2 : Math.max(0, Math.ceil(e)) - Math.max(0, Math.floor(t));
        },
        _limitZoom: function(e) {
          var t = this.getMinZoom(), n = this.getMaxZoom(), o = Z.any3d ? this.options.zoomSnap : 1;
          return o && (e = Math.round(e / o) * o), Math.max(t, Math.min(n, e));
        },
        _onPanTransitionStep: function() {
          this.fire("move");
        },
        _onPanTransitionEnd: function() {
          re(this._mapPane, "leaflet-pan-anim"), this.fire("moveend");
        },
        _tryAnimatedPan: function(e, t) {
          var n = this._getCenterOffset(e)._trunc();
          return (t && t.animate) !== !0 && !this.getSize().contains(n) ? !1 : (this.panBy(n, t), !0);
        },
        _createAnimProxy: function() {
          var e = this._proxy = Y("div", "leaflet-proxy leaflet-zoom-animated");
          this._panes.mapPane.appendChild(e), this.on("zoomanim", function(t) {
            var n = Ct, o = this._proxy.style[n];
            xt(this._proxy, this.project(t.center, t.zoom), this.getZoomScale(t.zoom, 1)), o === this._proxy.style[n] && this._animatingZoom && this._onZoomTransitionEnd();
          }, this), this.on("load moveend", this._animMoveEnd, this), this._on("unload", this._destroyAnimProxy, this);
        },
        _destroyAnimProxy: function() {
          I(this._proxy), this.off("load moveend", this._animMoveEnd, this), delete this._proxy;
        },
        _animMoveEnd: function() {
          var e = this.getCenter(), t = this.getZoom();
          xt(this._proxy, this.project(e, t), this.getZoomScale(t, 1));
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
          return n.animate !== !0 && !this.getSize().contains(s) ? !1 : (Se(function() {
            this._moveStart(!0, n.noMoveStart || !1)._animateZoom(e, t, !0);
          }, this), !0);
        },
        _animateZoom: function(e, t, n, o) {
          this._mapPane && (n && (this._animatingZoom = !0, this._animateToCenter = e, this._animateToZoom = t, J(this._mapPane, "leaflet-zoom-anim")), this.fire("zoomanim", {
            center: e,
            zoom: t,
            noUpdate: o
          }), this._tempFireZoomEvent || (this._tempFireZoomEvent = this._zoom !== this._animateToZoom), this._move(this._animateToCenter, this._animateToZoom, void 0, !0), setTimeout(N(this._onZoomTransitionEnd, this), 250));
        },
        _onZoomTransitionEnd: function() {
          this._animatingZoom && (this._mapPane && re(this._mapPane, "leaflet-zoom-anim"), this._animatingZoom = !1, this._move(this._animateToCenter, this._animateToZoom, void 0, !0), this._tempFireZoomEvent && this.fire("zoom"), delete this._tempFireZoomEvent, this.fire("move"), this._moveEnd(!0));
        }
      });
      function no(e, t) {
        return new te(e, t);
      }
      var X = Qe.extend({
        // @section
        // @aka Control Options
        options: {
          // @option position: String = 'topright'
          // The position of the control (one of the map corners). Possible values are `'topleft'`,
          // `'topright'`, `'bottomleft'` or `'bottomright'`
          position: "topright"
        },
        initialize: function(e) {
          ee(this, e);
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
          return J(t, "leaflet-control"), n.indexOf("bottom") !== -1 ? o.insertBefore(t, o.firstChild) : o.appendChild(t), this._map.on("unload", this.remove, this), this;
        },
        // @method remove: this
        // Removes the control from the map it is currently active on.
        remove: function() {
          return this._map ? (I(this._container), this.onRemove && this.onRemove(this._map), this._map.off("unload", this.remove, this), this._map = null, this) : this;
        },
        _refocusOnMap: function(e) {
          this._map && e && e.screenX > 0 && e.screenY > 0 && this._map.getContainer().focus();
        }
      }), Et = function(e) {
        return new X(e);
      };
      te.include({
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
          var e = this._controlCorners = {}, t = "leaflet-", n = this._controlContainer = Y("div", t + "control-container", this._container);
          function o(s, c) {
            var h = t + s + " " + t + c;
            e[s + c] = Y("div", h, n);
          }
          o("top", "left"), o("top", "right"), o("bottom", "left"), o("bottom", "right");
        },
        _clearControlPos: function() {
          for (var e in this._controlCorners)
            I(this._controlCorners[e]);
          I(this._controlContainer), delete this._controlCorners, delete this._controlContainer;
        }
      });
      var Qn = X.extend({
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
          ee(this, n), this._layerControlInputs = [], this._layers = [], this._lastZIndex = 0, this._handlingClick = !1, this._preventClick = !1;
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
          return X.prototype.addTo.call(this, e), this._expandIfNotCollapsed();
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
          J(this._container, "leaflet-control-layers-expanded"), this._section.style.height = null;
          var e = this._map.getSize().y - (this._container.offsetTop + 50);
          return e < this._section.clientHeight ? (J(this._section, "leaflet-control-layers-scrollbar"), this._section.style.height = e + "px") : re(this._section, "leaflet-control-layers-scrollbar"), this._checkDisabledLayers(), this;
        },
        // @method collapse(): this
        // Collapse the control container if expanded.
        collapse: function() {
          return re(this._container, "leaflet-control-layers-expanded"), this;
        },
        _initLayout: function() {
          var e = "leaflet-control-layers", t = this._container = Y("div", e), n = this.options.collapsed;
          t.setAttribute("aria-haspopup", !0), dn(t), be(t);
          var o = this._section = Y("section", e + "-list");
          n && (this._map.on("click", this.collapse, this), j(t, {
            mouseenter: this._expandSafely,
            mouseleave: this.collapse
          }, this));
          var s = this._layersLink = Y("a", e + "-toggle", t);
          s.href = "#", s.title = "Layers", s.setAttribute("role", "button"), j(s, {
            keydown: function(c) {
              c.keyCode === 13 && this._expandSafely();
            },
            // Certain screen readers intercept the key event and instead send a click event
            click: function(c) {
              Me(c), this._expandSafely();
            }
          }, this), n || this.expand(), this._baseLayersList = Y("div", e + "-base", o), this._separator = Y("div", e + "-separator", o), this._overlaysList = Y("div", e + "-overlays", o), t.appendChild(o);
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
          }), this.options.sortLayers && this._layers.sort(N(function(o, s) {
            return this.options.sortFunction(o.layer, s.layer, o.name, s.name);
          }, this)), this.options.autoZIndex && e.setZIndex && (this._lastZIndex++, e.setZIndex(this._lastZIndex)), this._expandIfNotCollapsed();
        },
        _update: function() {
          if (!this._container)
            return this;
          Ln(this._baseLayersList), Ln(this._overlaysList), this._layerControlInputs = [];
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
          this._preventClick = !0, j(e, "click", Me), this.expand();
          var t = this;
          setTimeout(function() {
            ue(e, "click", Me), t._preventClick = !1;
          });
        }
      }), Mi = function(e, t, n) {
        return new Qn(e, t, n);
      }, w = X.extend({
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
          var t = "leaflet-control-zoom", n = Y("div", t + " leaflet-bar"), o = this.options;
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
          var c = Y("a", n, o);
          return c.innerHTML = e, c.href = "#", c.title = t, c.setAttribute("role", "button"), c.setAttribute("aria-label", t), dn(c), j(c, "click", zt), j(c, "click", s, this), j(c, "click", this._refocusOnMap, this), c;
        },
        _updateDisabled: function() {
          var e = this._map, t = "leaflet-disabled";
          re(this._zoomInButton, t), re(this._zoomOutButton, t), this._zoomInButton.setAttribute("aria-disabled", "false"), this._zoomOutButton.setAttribute("aria-disabled", "false"), (this._disabled || e._zoom === e.getMinZoom()) && (J(this._zoomOutButton, t), this._zoomOutButton.setAttribute("aria-disabled", "true")), (this._disabled || e._zoom === e.getMaxZoom()) && (J(this._zoomInButton, t), this._zoomInButton.setAttribute("aria-disabled", "true"));
        }
      });
      te.mergeOptions({
        zoomControl: !0
      }), te.addInitHook(function() {
        this.options.zoomControl && (this.zoomControl = new w(), this.addControl(this.zoomControl));
      });
      var En = function(e) {
        return new w(e);
      }, zi = X.extend({
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
          var t = "leaflet-control-scale", n = Y("div", t), o = this.options;
          return this._addScales(o, t + "-line", n), e.on(o.updateWhenIdle ? "moveend" : "move", this._update, this), e.whenReady(this._update, this), n;
        },
        onRemove: function(e) {
          e.off(this.options.updateWhenIdle ? "moveend" : "move", this._update, this);
        },
        _addScales: function(e, t, n) {
          e.metric && (this._mScale = Y("div", t, n)), e.imperial && (this._iScale = Y("div", t, n));
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
      }), io = function(e) {
        return new zi(e);
      }, Ei = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" class="leaflet-attribution-flag"><path fill="#4C7BE1" d="M0 0h12v4H0z"/><path fill="#FFD500" d="M0 4h12v3H0z"/><path fill="#E0BC00" d="M0 7h12v1H0z"/></svg>', ei = X.extend({
        // @section
        // @aka Control.Attribution options
        options: {
          position: "bottomright",
          // @option prefix: String|false = 'Leaflet'
          // The HTML text shown before the attributions. Pass `false` to disable.
          prefix: '<a href="https://leafletjs.com" title="A JavaScript library for interactive maps">' + (Z.inlineSvg ? Ei + " " : "") + "Leaflet</a>"
        },
        initialize: function(e) {
          ee(this, e), this._attributions = {};
        },
        onAdd: function(e) {
          e.attributionControl = this, this._container = Y("div", "leaflet-control-attribution"), dn(this._container);
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
      te.mergeOptions({
        attributionControl: !0
      }), te.addInitHook(function() {
        this.options.attributionControl && new ei().addTo(this);
      });
      var oo = function(e) {
        return new ei(e);
      };
      X.Layers = Qn, X.Zoom = w, X.Scale = zi, X.Attribution = ei, Et.layers = Mi, Et.zoom = En, Et.scale = io, Et.attribution = oo;
      var dt = Qe.extend({
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
      dt.addTo = function(e, t) {
        return e.addHandler(t, this), this;
      };
      var ti = { Events: We }, On = Z.touch ? "touchstart mousedown" : "mousedown", _t = Pt.extend({
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
          ee(this, o), this._element = e, this._dragStartTarget = t || e, this._preventOutline = n;
        },
        // @method enable()
        // Enables the dragging ability
        enable: function() {
          this._enabled || (j(this._dragStartTarget, On, this._onDown, this), this._enabled = !0);
        },
        // @method disable()
        // Disables the dragging ability
        disable: function() {
          this._enabled && (_t._dragging === this && this.finishDrag(!0), ue(this._dragStartTarget, On, this._onDown, this), this._enabled = !1, this._moved = !1);
        },
        _onDown: function(e) {
          if (this._enabled && (this._moved = !1, !Tn(this._element, "leaflet-zoom-anim"))) {
            if (e.touches && e.touches.length !== 1) {
              _t._dragging === this && this.finishDrag();
              return;
            }
            if (!(_t._dragging || e.shiftKey || e.which !== 1 && e.button !== 1 && !e.touches) && (_t._dragging = this, this._preventOutline && Ye(this._element), Yn(), rt(), !this._moving)) {
              this.fire("down");
              var t = e.touches ? e.touches[0] : e, n = Li(this._element);
              this._startPoint = new W(t.clientX, t.clientY), this._startPos = it(this._element), this._parentScale = Cn(n);
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
            var t = e.touches && e.touches.length === 1 ? e.touches[0] : e, n = new W(t.clientX, t.clientY)._subtract(this._startPoint);
            !n.x && !n.y || Math.abs(n.x) + Math.abs(n.y) < this.options.clickTolerance || (n.x /= this._parentScale.x, n.y /= this._parentScale.y, Me(e), this._moved || (this.fire("dragstart"), this._moved = !0, J(document.body, "leaflet-dragging"), this._lastTarget = e.target || e.srcElement, window.SVGElementInstance && this._lastTarget instanceof window.SVGElementInstance && (this._lastTarget = this._lastTarget.correspondingUseElement), J(this._lastTarget, "leaflet-drag-target")), this._newPos = this._startPos.add(n), this._moving = !0, this._lastEvent = e, this._updatePosition());
          }
        },
        _updatePosition: function() {
          var e = { originalEvent: this._lastEvent };
          this.fire("predrag", e), Pe(this._element, this._newPos), this.fire("drag", e);
        },
        _onUp: function() {
          this._enabled && this.finishDrag();
        },
        finishDrag: function(e) {
          re(document.body, "leaflet-dragging"), this._lastTarget && (re(this._lastTarget, "leaflet-drag-target"), this._lastTarget = null), ue(document, "mousemove touchmove", this._onMove, this), ue(document, "mouseup touchend touchcancel", this._onUp, this), Jn(), lt();
          var t = this._moved && this._moving;
          this._moving = !1, _t._dragging = !1, t && this.fire("dragend", {
            noInertia: e,
            distance: this._newPos.distanceTo(this._startPos)
          });
        }
      });
      function ni(e, t, n) {
        var o, s = [1, 4, 2, 8], c, h, p, f, k, S, H, se;
        for (c = 0, S = e.length; c < S; c++)
          e[c]._code = ae(e[c], t);
        for (p = 0; p < 4; p++) {
          for (H = s[p], o = [], c = 0, S = e.length, h = S - 1; c < S; h = c++)
            f = e[c], k = e[h], f._code & H ? k._code & H || (se = x(k, f, H, t, n), se._code = ae(se, t), o.push(se)) : (k._code & H && (se = x(k, f, H, t, n), se._code = ae(se, t), o.push(se)), o.push(f));
          e = o;
        }
        return e;
      }
      function d(e, t) {
        var n, o, s, c, h, p, f, k, S;
        if (!e || e.length === 0)
          throw new Error("latlngs not passed");
        fe(e) || (console.warn("latlngs are not flat! Only the first ring will be used"), e = e[0]);
        var H = ie([0, 0]), se = G(e), Ge = se.getNorthWest().distanceTo(se.getSouthWest()) * se.getNorthEast().distanceTo(se.getNorthWest());
        Ge < 1700 && (H = u(e));
        var Ve = e.length, ht = [];
        for (n = 0; n < Ve; n++) {
          var Je = ie(e[n]);
          ht.push(t.project(ie([Je.lat - H.lat, Je.lng - H.lng])));
        }
        for (p = f = k = 0, n = 0, o = Ve - 1; n < Ve; o = n++)
          s = ht[n], c = ht[o], h = s.y * c.x - c.y * s.x, f += (s.x + c.x) * h, k += (s.y + c.y) * h, p += h * 3;
        p === 0 ? S = ht[0] : S = [f / p, k / p];
        var Rn = t.unproject($(S));
        return ie([Rn.lat + H.lat, Rn.lng + H.lng]);
      }
      function u(e) {
        for (var t = 0, n = 0, o = 0, s = 0; s < e.length; s++) {
          var c = ie(e[s]);
          t += c.lat, n += c.lng, o++;
        }
        return ie([t / o, n / o]);
      }
      var l = {
        __proto__: null,
        clipPolygon: ni,
        polygonCenter: d,
        centroid: u
      };
      function B(e, t) {
        if (!t || !e.length)
          return e.slice();
        var n = t * t;
        return e = Oi(e, n), e = pe(e, n), e;
      }
      function C(e, t, n) {
        return Math.sqrt(xe(e, t, n, !0));
      }
      function oe(e, t, n) {
        return xe(e, t, n);
      }
      function pe(e, t) {
        var n = e.length, o = typeof Uint8Array < "u" ? Uint8Array : Array, s = new o(n);
        s[0] = s[n - 1] = 1, we(e, s, t, 0, n - 1);
        var c, h = [];
        for (c = 0; c < n; c++)
          s[c] && h.push(e[c]);
        return h;
      }
      function we(e, t, n, o, s) {
        var c = 0, h, p, f;
        for (p = o + 1; p <= s - 1; p++)
          f = xe(e[p], e[o], e[s], !0), f > c && (h = p, c = f);
        c > n && (t[h] = 1, we(e, t, n, o, h), we(e, t, n, h, s));
      }
      function Oi(e, t) {
        for (var n = [e[0]], o = 1, s = 0, c = e.length; o < c; o++)
          ve(e[o], e[s]) > t && (n.push(e[o]), s = o);
        return s < c - 1 && n.push(e[c - 1]), n;
      }
      var ii;
      function oi(e, t, n, o, s) {
        var c = o ? ii : ae(e, n), h = ae(t, n), p, f, k;
        for (ii = h; ; ) {
          if (!(c | h))
            return [e, t];
          if (c & h)
            return !1;
          p = c || h, f = x(e, t, p, n, s), k = ae(f, n), p === c ? (e = f, c = k) : (t = f, h = k);
        }
      }
      function x(e, t, n, o, s) {
        var c = t.x - e.x, h = t.y - e.y, p = o.min, f = o.max, k, S;
        return n & 8 ? (k = e.x + c * (f.y - e.y) / h, S = f.y) : n & 4 ? (k = e.x + c * (p.y - e.y) / h, S = p.y) : n & 2 ? (k = f.x, S = e.y + h * (f.x - e.x) / c) : n & 1 && (k = p.x, S = e.y + h * (p.x - e.x) / c), new W(k, S, s);
      }
      function ae(e, t) {
        var n = 0;
        return e.x < t.min.x ? n |= 1 : e.x > t.max.x && (n |= 2), e.y < t.min.y ? n |= 4 : e.y > t.max.y && (n |= 8), n;
      }
      function ve(e, t) {
        var n = t.x - e.x, o = t.y - e.y;
        return n * n + o * o;
      }
      function xe(e, t, n, o) {
        var s = t.x, c = t.y, h = n.x - s, p = n.y - c, f = h * h + p * p, k;
        return f > 0 && (k = ((e.x - s) * h + (e.y - c) * p) / f, k > 1 ? (s = n.x, c = n.y) : k > 0 && (s += h * k, c += p * k)), h = e.x - s, p = e.y - c, o ? h * h + p * p : new W(s, c);
      }
      function fe(e) {
        return !Ne(e[0]) || typeof e[0][0] != "object" && typeof e[0][0] < "u";
      }
      function ze(e) {
        return console.warn("Deprecated use of _flat, please use L.LineUtil.isFlat instead."), fe(e);
      }
      function fo(e, t) {
        var n, o, s, c, h, p, f, k;
        if (!e || e.length === 0)
          throw new Error("latlngs not passed");
        fe(e) || (console.warn("latlngs are not flat! Only the first ring will be used"), e = e[0]);
        var S = ie([0, 0]), H = G(e), se = H.getNorthWest().distanceTo(H.getSouthWest()) * H.getNorthEast().distanceTo(H.getNorthWest());
        se < 1700 && (S = u(e));
        var Ge = e.length, Ve = [];
        for (n = 0; n < Ge; n++) {
          var ht = ie(e[n]);
          Ve.push(t.project(ie([ht.lat - S.lat, ht.lng - S.lng])));
        }
        for (n = 0, o = 0; n < Ge - 1; n++)
          o += Ve[n].distanceTo(Ve[n + 1]) / 2;
        if (o === 0)
          k = Ve[0];
        else
          for (n = 0, c = 0; n < Ge - 1; n++)
            if (h = Ve[n], p = Ve[n + 1], s = h.distanceTo(p), c += s, c > o) {
              f = (c - o) / s, k = [
                p.x - f * (p.x - h.x),
                p.y - f * (p.y - h.y)
              ];
              break;
            }
        var Je = t.unproject($(k));
        return ie([Je.lat + S.lat, Je.lng + S.lng]);
      }
      var Ko = {
        __proto__: null,
        simplify: B,
        pointToSegmentDistance: C,
        closestPointOnSegment: oe,
        clipSegment: oi,
        _getEdgeIntersection: x,
        _getBitCode: ae,
        _sqClosestPointOnSegment: xe,
        isFlat: fe,
        _flat: ze,
        polylineCenter: fo
      }, ao = {
        project: function(e) {
          return new W(e.lng, e.lat);
        },
        unproject: function(e) {
          return new ne(e.y, e.x);
        },
        bounds: new m([-180, -90], [180, 90])
      }, so = {
        R: 6378137,
        R_MINOR: 6356752314245179e-9,
        bounds: new m([-2003750834279e-5, -1549657073972e-5], [2003750834279e-5, 1876465623138e-5]),
        project: function(e) {
          var t = Math.PI / 180, n = this.R, o = e.lat * t, s = this.R_MINOR / n, c = Math.sqrt(1 - s * s), h = c * Math.sin(o), p = Math.tan(Math.PI / 4 - o / 2) / Math.pow((1 - h) / (1 + h), c / 2);
          return o = -n * Math.log(Math.max(p, 1e-10)), new W(e.lng * t * n, o);
        },
        unproject: function(e) {
          for (var t = 180 / Math.PI, n = this.R, o = this.R_MINOR / n, s = Math.sqrt(1 - o * o), c = Math.exp(-e.y / n), h = Math.PI / 2 - 2 * Math.atan(c), p = 0, f = 0.1, k; p < 15 && Math.abs(f) > 1e-7; p++)
            k = s * Math.sin(h), k = Math.pow((1 - k) / (1 + k), s / 2), f = Math.PI / 2 - 2 * Math.atan(c * k) - h, h += f;
          return new ne(h * t, e.x * t / n);
        }
      }, Yo = {
        __proto__: null,
        LonLat: ao,
        Mercator: so,
        SphericalMercator: Ae
      }, Jo = O({}, je, {
        code: "EPSG:3395",
        projection: so,
        transformation: (function() {
          var e = 0.5 / (Math.PI * so.R);
          return V(e, 0.5, -e, 0.5);
        })()
      }), mo = O({}, je, {
        code: "EPSG:4326",
        projection: ao,
        transformation: V(1 / 180, 1, -1 / 180, 0.5)
      }), Xo = O({}, et, {
        projection: ao,
        transformation: V(1, 0, -1, 0),
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
      et.Earth = je, et.EPSG3395 = Jo, et.EPSG3857 = Dn, et.EPSG900913 = Gi, et.EPSG4326 = mo, et.Simple = Xo;
      var vt = Pt.extend({
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
      te.include({
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
          e = e ? Ne(e) ? e : [e] : [];
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
      var An = vt.extend({
        initialize: function(e, t) {
          ee(this, t), this._layers = {};
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
        return new An(e, t);
      }, Ot = An.extend({
        addLayer: function(e) {
          return this.hasLayer(e) ? this : (e.addEventParent(this), An.prototype.addLayer.call(this, e), this.fire("layeradd", { layer: e }));
        },
        removeLayer: function(e) {
          return this.hasLayer(e) ? (e in this._layers && (e = this._layers[e]), e.removeEventParent(this), An.prototype.removeLayer.call(this, e), this.fire("layerremove", { layer: e })) : this;
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
        return new Ot(e, t);
      }, In = Qe.extend({
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
          ee(this, e);
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
          var s = $(o), c = $(t === "shadow" && n.shadowAnchor || n.iconAnchor || s && s.divideBy(2, !0));
          e.className = "leaflet-marker-" + t + " " + (n.className || ""), c && (e.style.marginLeft = -c.x + "px", e.style.marginTop = -c.y + "px"), s && (e.style.width = s.x + "px", e.style.height = s.y + "px");
        },
        _createImg: function(e, t) {
          return t = t || document.createElement("img"), t.src = e, t;
        },
        _getIconUrl: function(e) {
          return Z.retina && this.options[e + "RetinaUrl"] || this.options[e + "Url"];
        }
      });
      function ta(e) {
        return new In(e);
      }
      var ai = In.extend({
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
          return typeof ai.imagePath != "string" && (ai.imagePath = this._detectIconPath()), (this.options.imagePath || ai.imagePath) + In.prototype._getIconUrl.call(this, e);
        },
        _stripUrl: function(e) {
          var t = function(n, o, s) {
            var c = o.exec(n);
            return c && c[s];
          };
          return e = t(e, /^url\((['"])?(.+)\1\)$/, 2), e && t(e, /^(.*)marker-icon\.png$/, 1);
        },
        _detectIconPath: function() {
          var e = Y("div", "leaflet-default-icon-path", document.body), t = un(e, "background-image") || un(e, "backgroundImage");
          if (document.body.removeChild(e), t = this._stripUrl(t), t)
            return t;
          var n = document.querySelector('link[href$="leaflet.css"]');
          return n ? n.href.substring(0, n.href.length - 11 - 1) : "";
        }
      }), _o = dt.extend({
        initialize: function(e) {
          this._marker = e;
        },
        addHooks: function() {
          var e = this._marker._icon;
          this._draggable || (this._draggable = new _t(e, e, !0)), this._draggable.on({
            dragstart: this._onDragStart,
            predrag: this._onPreDrag,
            drag: this._onDrag,
            dragend: this._onDragEnd
          }, this).enable(), J(e, "leaflet-marker-draggable");
        },
        removeHooks: function() {
          this._draggable.off({
            dragstart: this._onDragStart,
            predrag: this._onPreDrag,
            drag: this._onDrag,
            dragend: this._onDragEnd
          }, this).disable(), this._marker._icon && re(this._marker._icon, "leaflet-marker-draggable");
        },
        moved: function() {
          return this._draggable && this._draggable._moved;
        },
        _adjustPan: function(e) {
          var t = this._marker, n = t._map, o = this._marker.options.autoPanSpeed, s = this._marker.options.autoPanPadding, c = it(t._icon), h = n.getPixelBounds(), p = n.getPixelOrigin(), f = T(
            h.min._subtract(p).add(s),
            h.max._subtract(p).subtract(s)
          );
          if (!f.contains(c)) {
            var k = $(
              (Math.max(f.max.x, c.x) - f.max.x) / (h.max.x - f.max.x) - (Math.min(f.min.x, c.x) - f.min.x) / (h.min.x - f.min.x),
              (Math.max(f.max.y, c.y) - f.max.y) / (h.max.y - f.max.y) - (Math.min(f.min.y, c.y) - f.min.y) / (h.min.y - f.min.y)
            ).multiplyBy(o);
            n.panBy(k, { animate: !1 }), this._draggable._newPos._add(k), this._draggable._startPos._add(k), Pe(t._icon, this._draggable._newPos), this._onDrag(e), this._panRequest = Se(this._adjustPan.bind(this, e));
          }
        },
        _onDragStart: function() {
          this._oldLatLng = this._marker.getLatLng(), this._marker.closePopup && this._marker.closePopup(), this._marker.fire("movestart").fire("dragstart");
        },
        _onPreDrag: function(e) {
          this._marker.options.autoPan && (Ce(this._panRequest), this._panRequest = Se(this._adjustPan.bind(this, e)));
        },
        _onDrag: function(e) {
          var t = this._marker, n = t._shadow, o = it(t._icon), s = t._map.layerPointToLatLng(o);
          n && Pe(n, o), t._latlng = s, e.latlng = s, e.oldLatLng = this._oldLatLng, t.fire("move", e).fire("drag", e);
        },
        _onDragEnd: function(e) {
          Ce(this._panRequest), delete this._oldLatLng, this._marker.fire("moveend").fire("dragend", e);
        }
      }), Ai = vt.extend({
        // @section
        // @aka Marker options
        options: {
          // @option icon: Icon = *
          // Icon instance to use for rendering the marker.
          // See [Icon documentation](#L.Icon) for details on how to customize the marker icon.
          // If not specified, a common instance of `L.Icon.Default` is used.
          icon: new ai(),
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
          ee(this, t), this._latlng = ie(e);
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
          n !== this._icon && (this._icon && this._removeIcon(), o = !0, e.title && (n.title = e.title), n.tagName === "IMG" && (n.alt = e.alt || "")), J(n, t), e.keyboard && (n.tabIndex = "0", n.setAttribute("role", "button")), this._icon = n, e.riseOnHover && this.on({
            mouseover: this._bringToFront,
            mouseout: this._resetZIndex
          }), this.options.autoPanOnFocus && j(n, "focus", this._panOnFocus, this);
          var s = e.icon.createShadow(this._shadow), c = !1;
          s !== this._shadow && (this._removeShadow(), c = !0), s && (J(s, t), s.alt = ""), this._shadow = s, e.opacity < 1 && this._updateOpacity(), o && this.getPane().appendChild(this._icon), this._initInteraction(), s && c && this.getPane(e.shadowPane).appendChild(this._shadow);
        },
        _removeIcon: function() {
          this.options.riseOnHover && this.off({
            mouseover: this._bringToFront,
            mouseout: this._resetZIndex
          }), this.options.autoPanOnFocus && ue(this._icon, "focus", this._panOnFocus, this), I(this._icon), this.removeInteractiveTarget(this._icon), this._icon = null;
        },
        _removeShadow: function() {
          this._shadow && I(this._shadow), this._shadow = null;
        },
        _setPos: function(e) {
          this._icon && Pe(this._icon, e), this._shadow && Pe(this._shadow, e), this._zIndex = e.y + this.options.zIndexOffset, this._resetZIndex();
        },
        _updateZIndex: function(e) {
          this._icon && (this._icon.style.zIndex = this._zIndex + e);
        },
        _animateZoom: function(e) {
          var t = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center).round();
          this._setPos(t);
        },
        _initInteraction: function() {
          if (this.options.interactive && (J(this._icon, "leaflet-interactive"), this.addInteractiveTarget(this._icon), _o)) {
            var e = this.options.draggable;
            this.dragging && (e = this.dragging.enabled(), this.dragging.disable()), this.dragging = new _o(this), e && this.dragging.enable();
          }
        },
        // @method setOpacity(opacity: Number): this
        // Changes the opacity of the marker.
        setOpacity: function(e) {
          return this.options.opacity = e, this._map && this._updateOpacity(), this;
        },
        _updateOpacity: function() {
          var e = this.options.opacity;
          this._icon && le(this._icon, e), this._shadow && le(this._shadow, e);
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
            var t = this.options.icon.options, n = t.iconSize ? $(t.iconSize) : $(0, 0), o = t.iconAnchor ? $(t.iconAnchor) : $(0, 0);
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
        return new Ai(e, t);
      }
      var qt = vt.extend({
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
          return ee(this, e), this._renderer && (this._renderer._updateStyle(this), this.options.stroke && e && Object.prototype.hasOwnProperty.call(e, "weight") && this._updateBounds()), this;
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
      }), Ii = qt.extend({
        // @section
        // @aka CircleMarker options
        options: {
          fill: !0,
          // @option radius: Number = 10
          // Radius of the circle marker, in pixels
          radius: 10
        },
        initialize: function(e, t) {
          ee(this, t), this._latlng = ie(e), this._radius = this.options.radius;
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
          return qt.prototype.setStyle.call(this, e), this.setRadius(t), this;
        },
        _project: function() {
          this._point = this._map.latLngToLayerPoint(this._latlng), this._updateBounds();
        },
        _updateBounds: function() {
          var e = this._radius, t = this._radiusY || e, n = this._clickTolerance(), o = [e + n, t + n];
          this._pxBounds = new m(this._point.subtract(o), this._point.add(o));
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
        return new Ii(e, t);
      }
      var ro = Ii.extend({
        initialize: function(e, t, n) {
          if (typeof t == "number" && (t = O({}, n, { radius: t })), ee(this, t), this._latlng = ie(e), isNaN(this.options.radius))
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
        setStyle: qt.prototype.setStyle,
        _project: function() {
          var e = this._latlng.lng, t = this._latlng.lat, n = this._map, o = n.options.crs;
          if (o.distance === je.distance) {
            var s = Math.PI / 180, c = this._mRadius / je.R / s, h = n.project([t + c, e]), p = n.project([t - c, e]), f = h.add(p).divideBy(2), k = n.unproject(f).lat, S = Math.acos((Math.cos(c * s) - Math.sin(t * s) * Math.sin(k * s)) / (Math.cos(t * s) * Math.cos(k * s))) / s;
            (isNaN(S) || S === 0) && (S = c / Math.cos(Math.PI / 180 * t)), this._point = f.subtract(n.getPixelOrigin()), this._radius = isNaN(S) ? 0 : f.x - n.project([k, e - S]).x, this._radiusY = f.y - h.y;
          } else {
            var H = o.unproject(o.project(this._latlng).subtract([this._mRadius, 0]));
            this._point = n.latLngToLayerPoint(this._latlng), this._radius = this._point.x - n.latLngToLayerPoint(H).x;
          }
          this._updateBounds();
        }
      });
      function oa(e, t, n) {
        return new ro(e, t, n);
      }
      var At = qt.extend({
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
          ee(this, t), this._setLatLngs(e);
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
          for (var t = 1 / 0, n = null, o = xe, s, c, h = 0, p = this._parts.length; h < p; h++)
            for (var f = this._parts[h], k = 1, S = f.length; k < S; k++) {
              s = f[k - 1], c = f[k];
              var H = o(e, s, c, !0);
              H < t && (t = H, n = o(e, s, c));
            }
          return n && (n.distance = Math.sqrt(t)), n;
        },
        // @method getCenter(): LatLng
        // Returns the center ([centroid](https://en.wikipedia.org/wiki/Centroid)) of the polyline.
        getCenter: function() {
          if (!this._map)
            throw new Error("Must add layer to map before using getCenter()");
          return fo(this._defaultShape(), this._map.options.crs);
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
          return fe(this._latlngs) ? this._latlngs : this._latlngs[0];
        },
        // recursively convert latlngs input into actual LatLng instances; calculate bounds along the way
        _convertLatLngs: function(e) {
          for (var t = [], n = fe(e), o = 0, s = e.length; o < s; o++)
            n ? (t[o] = ie(e[o]), this._bounds.extend(t[o])) : t[o] = this._convertLatLngs(e[o]);
          return t;
        },
        _project: function() {
          var e = new m();
          this._rings = [], this._projectLatlngs(this._latlngs, this._rings, e), this._bounds.isValid() && e.isValid() && (this._rawPxBounds = e, this._updateBounds());
        },
        _updateBounds: function() {
          var e = this._clickTolerance(), t = new W(e, e);
          this._rawPxBounds && (this._pxBounds = new m([
            this._rawPxBounds.min.subtract(t),
            this._rawPxBounds.max.add(t)
          ]));
        },
        // recursively turns latlngs into a set of rings with projected coordinates
        _projectLatlngs: function(e, t, n) {
          var o = e[0] instanceof ne, s = e.length, c, h;
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
                p = oi(f[o], f[o + 1], e, o, !0), p && (t[s] = t[s] || [], t[s].push(p[0]), (p[1] !== f[o + 1] || o === h - 2) && (t[s].push(p[1]), s++));
          }
        },
        // simplify each clipped part of the polyline for performance
        _simplifyPoints: function() {
          for (var e = this._parts, t = this.options.smoothFactor, n = 0, o = e.length; n < o; n++)
            e[n] = B(e[n], t);
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
              if (!(!t && o === 0) && C(e, p[s], p[o]) <= f)
                return !0;
          return !1;
        }
      });
      function aa(e, t) {
        return new At(e, t);
      }
      At._flat = ze;
      var Bn = At.extend({
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
          return d(this._defaultShape(), this._map.options.crs);
        },
        _convertLatLngs: function(e) {
          var t = At.prototype._convertLatLngs.call(this, e), n = t.length;
          return n >= 2 && t[0] instanceof ne && t[0].equals(t[n - 1]) && t.pop(), t;
        },
        _setLatLngs: function(e) {
          At.prototype._setLatLngs.call(this, e), fe(this._latlngs) && (this._latlngs = [this._latlngs]);
        },
        _defaultShape: function() {
          return fe(this._latlngs[0]) ? this._latlngs[0] : this._latlngs[0][0];
        },
        _clipPoints: function() {
          var e = this._renderer._bounds, t = this.options.weight, n = new W(t, t);
          if (e = new m(e.min.subtract(n), e.max.add(n)), this._parts = [], !(!this._pxBounds || !this._pxBounds.intersects(e))) {
            if (this.options.noClip) {
              this._parts = this._rings;
              return;
            }
            for (var o = 0, s = this._rings.length, c; o < s; o++)
              c = ni(this._rings[o], e, !0), c.length && this._parts.push(c);
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
          return t || At.prototype._containsPoint.call(this, e, !0);
        }
      });
      function sa(e, t) {
        return new Bn(e, t);
      }
      var It = Ot.extend({
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
          ee(this, t), this._layers = {}, e && this.addData(e);
        },
        // @method addData( <GeoJSON> data ): this
        // Adds a GeoJSON object to the layer.
        addData: function(e) {
          var t = Ne(e) ? e : e.features, n, o, s;
          if (t) {
            for (n = 0, o = t.length; n < o; n++)
              s = t[n], (s.geometries || s.geometry || s.features || s.coordinates) && this.addData(s);
            return this;
          }
          var c = this.options;
          if (c.filter && !c.filter(e))
            return this;
          var h = Bi(e, c);
          return h ? (h.feature = Ri(e), h.defaultOptions = h.options, this.resetStyle(h), c.onEachFeature && c.onEachFeature(e, h), this.addLayer(h)) : this;
        },
        // @method resetStyle( <Path> layer? ): this
        // Resets the given vector layer's style to the original GeoJSON style, useful for resetting style after hover events.
        // If `layer` is omitted, the style of all features in the current layer is reset.
        resetStyle: function(e) {
          return e === void 0 ? this.eachLayer(this.resetStyle, this) : (e.options = O({}, e.defaultOptions), this._setLayerStyle(e, this.options.style), this);
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
      function Bi(e, t) {
        var n = e.type === "Feature" ? e.geometry : e, o = n ? n.coordinates : null, s = [], c = t && t.pointToLayer, h = t && t.coordsToLatLng || lo, p, f, k, S;
        if (!o && !n)
          return null;
        switch (n.type) {
          case "Point":
            return p = h(o), vo(c, e, p, t);
          case "MultiPoint":
            for (k = 0, S = o.length; k < S; k++)
              p = h(o[k]), s.push(vo(c, e, p, t));
            return new Ot(s);
          case "LineString":
          case "MultiLineString":
            return f = Zi(o, n.type === "LineString" ? 0 : 1, h), new At(f, t);
          case "Polygon":
          case "MultiPolygon":
            return f = Zi(o, n.type === "Polygon" ? 1 : 2, h), new Bn(f, t);
          case "GeometryCollection":
            for (k = 0, S = n.geometries.length; k < S; k++) {
              var H = Bi({
                geometry: n.geometries[k],
                type: "Feature",
                properties: e.properties
              }, t);
              H && s.push(H);
            }
            return new Ot(s);
          case "FeatureCollection":
            for (k = 0, S = n.features.length; k < S; k++) {
              var se = Bi(n.features[k], t);
              se && s.push(se);
            }
            return new Ot(s);
          default:
            throw new Error("Invalid GeoJSON object.");
        }
      }
      function vo(e, t, n, o) {
        return e ? e(t, n) : new Ai(n, o && o.markersInheritOptions && o);
      }
      function lo(e) {
        return new ne(e[1], e[0], e[2]);
      }
      function Zi(e, t, n) {
        for (var o = [], s = 0, c = e.length, h; s < c; s++)
          h = t ? Zi(e[s], t - 1, n) : (n || lo)(e[s]), o.push(h);
        return o;
      }
      function uo(e, t) {
        return e = ie(e), e.alt !== void 0 ? [q(e.lng, t), q(e.lat, t), q(e.alt, t)] : [q(e.lng, t), q(e.lat, t)];
      }
      function Ni(e, t, n, o) {
        for (var s = [], c = 0, h = e.length; c < h; c++)
          s.push(t ? Ni(e[c], fe(e[c]) ? 0 : t - 1, n, o) : uo(e[c], o));
        return !t && n && s.length > 0 && s.push(s[0].slice()), s;
      }
      function Zn(e, t) {
        return e.feature ? O({}, e.feature, { geometry: t }) : Ri(t);
      }
      function Ri(e) {
        return e.type === "Feature" || e.type === "FeatureCollection" ? e : {
          type: "Feature",
          properties: {},
          geometry: e
        };
      }
      var co = {
        toGeoJSON: function(e) {
          return Zn(this, {
            type: "Point",
            coordinates: uo(this.getLatLng(), e)
          });
        }
      };
      Ai.include(co), ro.include(co), Ii.include(co), At.include({
        toGeoJSON: function(e) {
          var t = !fe(this._latlngs), n = Ni(this._latlngs, t ? 1 : 0, !1, e);
          return Zn(this, {
            type: (t ? "Multi" : "") + "LineString",
            coordinates: n
          });
        }
      }), Bn.include({
        toGeoJSON: function(e) {
          var t = !fe(this._latlngs), n = t && !fe(this._latlngs[0]), o = Ni(this._latlngs, n ? 2 : t ? 1 : 0, !0, e);
          return t || (o = [o]), Zn(this, {
            type: (n ? "Multi" : "") + "Polygon",
            coordinates: o
          });
        }
      }), An.include({
        toMultiPoint: function(e) {
          var t = [];
          return this.eachLayer(function(n) {
            t.push(n.toGeoJSON(e).geometry.coordinates);
          }), Zn(this, {
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
                var h = Ri(c);
                h.type === "FeatureCollection" ? o.push.apply(o, h.features) : o.push(h);
              }
            }
          }), n ? Zn(this, {
            geometries: o,
            type: "GeometryCollection"
          }) : {
            type: "FeatureCollection",
            features: o
          };
        }
      });
      function go(e, t) {
        return new It(e, t);
      }
      var ra = go, Di = vt.extend({
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
          this._url = e, this._bounds = G(t), ee(this, n);
        },
        onAdd: function() {
          this._image || (this._initImage(), this.options.opacity < 1 && this._updateOpacity()), this.options.interactive && (J(this._image, "leaflet-interactive"), this.addInteractiveTarget(this._image)), this.getPane().appendChild(this._image), this._reset();
        },
        onRemove: function() {
          I(this._image), this.options.interactive && this.removeInteractiveTarget(this._image);
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
          return this._map && Ut(this._image), this;
        },
        // @method bringToBack(): this
        // Brings the layer to the bottom of all overlays.
        bringToBack: function() {
          return this._map && Ht(this._image), this;
        },
        // @method setUrl(url: String): this
        // Changes the URL of the image.
        setUrl: function(e) {
          return this._url = e, this._image && (this._image.src = e), this;
        },
        // @method setBounds(bounds: LatLngBounds): this
        // Update the bounds that this ImageOverlay covers
        setBounds: function(e) {
          return this._bounds = G(e), this._map && this._reset(), this;
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
          var e = this._url.tagName === "IMG", t = this._image = e ? this._url : Y("img");
          if (J(t, "leaflet-image-layer"), this._zoomAnimated && J(t, "leaflet-zoom-animated"), this.options.className && J(t, this.options.className), t.onselectstart = de, t.onmousemove = de, t.onload = N(this.fire, this, "load"), t.onerror = N(this._overlayOnError, this, "error"), (this.options.crossOrigin || this.options.crossOrigin === "") && (t.crossOrigin = this.options.crossOrigin === !0 ? "" : this.options.crossOrigin), this.options.zIndex && this._updateZIndex(), e) {
            this._url = t.src;
            return;
          }
          t.src = this._url, t.alt = this.options.alt;
        },
        _animateZoom: function(e) {
          var t = this._map.getZoomScale(e.zoom), n = this._map._latLngBoundsToNewLayerBounds(this._bounds, e.zoom, e.center).min;
          xt(this._image, n, t);
        },
        _reset: function() {
          var e = this._image, t = new m(
            this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
            this._map.latLngToLayerPoint(this._bounds.getSouthEast())
          ), n = t.getSize();
          Pe(e, t.min), e.style.width = n.x + "px", e.style.height = n.y + "px";
        },
        _updateOpacity: function() {
          le(this._image, this.options.opacity);
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
      }), la = function(e, t, n) {
        return new Di(e, t, n);
      }, yo = Di.extend({
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
          var e = this._url.tagName === "VIDEO", t = this._image = e ? this._url : Y("video");
          if (J(t, "leaflet-image-layer"), this._zoomAnimated && J(t, "leaflet-zoom-animated"), this.options.className && J(t, this.options.className), t.onselectstart = de, t.onmousemove = de, t.onloadeddata = N(this.fire, this, "load"), e) {
            for (var n = t.getElementsByTagName("source"), o = [], s = 0; s < n.length; s++)
              o.push(n[s].src);
            this._url = n.length > 0 ? o : [t.src];
            return;
          }
          Ne(this._url) || (this._url = [this._url]), !this.options.keepAspectRatio && Object.prototype.hasOwnProperty.call(t.style, "objectFit") && (t.style.objectFit = "fill"), t.autoplay = !!this.options.autoplay, t.loop = !!this.options.loop, t.muted = !!this.options.muted, t.playsInline = !!this.options.playsInline;
          for (var c = 0; c < this._url.length; c++) {
            var h = Y("source");
            h.src = this._url[c], t.appendChild(h);
          }
        }
        // @method getElement(): HTMLVideoElement
        // Returns the instance of [`HTMLVideoElement`](https://developer.mozilla.org/docs/Web/API/HTMLVideoElement)
        // used by this overlay.
      });
      function ua(e, t, n) {
        return new yo(e, t, n);
      }
      var bo = Di.extend({
        _initImage: function() {
          var e = this._image = this._url;
          J(e, "leaflet-image-layer"), this._zoomAnimated && J(e, "leaflet-zoom-animated"), this.options.className && J(e, this.options.className), e.onselectstart = de, e.onmousemove = de;
        }
        // @method getElement(): SVGElement
        // Returns the instance of [`SVGElement`](https://developer.mozilla.org/docs/Web/API/SVGElement)
        // used by this overlay.
      });
      function ca(e, t, n) {
        return new bo(e, t, n);
      }
      var kt = vt.extend({
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
          e && (e instanceof ne || Ne(e)) ? (this._latlng = ie(e), ee(this, t)) : (ee(this, e), this._source = t), this.options.content && (this._content = this.options.content);
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
          this._zoomAnimated = e._zoomAnimated, this._container || this._initLayout(), e._fadeAnimated && le(this._container, 0), clearTimeout(this._removeTimeout), this.getPane().appendChild(this._container), this.update(), e._fadeAnimated && le(this._container, 1), this.bringToFront(), this.options.interactive && (J(this._container, "leaflet-interactive"), this.addInteractiveTarget(this._container));
        },
        onRemove: function(e) {
          e._fadeAnimated ? (le(this._container, 0), this._removeTimeout = setTimeout(N(I, void 0, this._container), 200)) : I(this._container), this.options.interactive && (re(this._container, "leaflet-interactive"), this.removeInteractiveTarget(this._container));
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
          return this._map && Ut(this._container), this;
        },
        // @method bringToBack: this
        // Brings this overlay to the back of other overlays (in the same map pane).
        bringToBack: function() {
          return this._map && Ht(this._container), this;
        },
        // prepare bound overlay to open: update latlng pos / content source (for FeatureGroup)
        _prepareOpen: function(e) {
          var t = this._source;
          if (!t._map)
            return !1;
          if (t instanceof Ot) {
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
            var e = this._map.latLngToLayerPoint(this._latlng), t = $(this.options.offset), n = this._getAnchor();
            this._zoomAnimated ? Pe(this._container, e.add(n)) : t = t.add(e).add(n);
            var o = this._containerBottom = -t.y, s = this._containerLeft = -Math.round(this._containerWidth / 2) + t.x;
            this._container.style.bottom = o + "px", this._container.style.left = s + "px";
          }
        },
        _getAnchor: function() {
          return [0, 0];
        }
      });
      te.include({
        _initOverlay: function(e, t, n, o) {
          var s = t;
          return s instanceof e || (s = new e(o).setContent(t)), n && s.setLatLng(n), s;
        }
      }), vt.include({
        _initOverlay: function(e, t, n, o) {
          var s = n;
          return s instanceof e ? (ee(s, o), s._source = this) : (s = t && !o ? t : new e(o, this), s.setContent(n)), s;
        }
      });
      var Vi = kt.extend({
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
          return e = arguments.length ? e : this._source._map, !e.hasLayer(this) && e._popup && e._popup.options.autoClose && e.removeLayer(e._popup), e._popup = this, kt.prototype.openOn.call(this, e);
        },
        onAdd: function(e) {
          kt.prototype.onAdd.call(this, e), e.fire("popupopen", { popup: this }), this._source && (this._source.fire("popupopen", { popup: this }, !0), this._source instanceof qt || this._source.on("preclick", ct));
        },
        onRemove: function(e) {
          kt.prototype.onRemove.call(this, e), e.fire("popupclose", { popup: this }), this._source && (this._source.fire("popupclose", { popup: this }, !0), this._source instanceof qt || this._source.off("preclick", ct));
        },
        getEvents: function() {
          var e = kt.prototype.getEvents.call(this);
          return (this.options.closeOnClick !== void 0 ? this.options.closeOnClick : this._map.options.closePopupOnClick) && (e.preclick = this.close), this.options.keepInView && (e.moveend = this._adjustPan), e;
        },
        _initLayout: function() {
          var e = "leaflet-popup", t = this._container = Y(
            "div",
            e + " " + (this.options.className || "") + " leaflet-zoom-animated"
          ), n = this._wrapper = Y("div", e + "-content-wrapper", t);
          if (this._contentNode = Y("div", e + "-content", n), dn(t), be(this._contentNode), j(t, "contextmenu", ct), this._tipContainer = Y("div", e + "-tip-container", t), this._tip = Y("div", e + "-tip", this._tipContainer), this.options.closeButton) {
            var o = this._closeButton = Y("a", e + "-close-button", t);
            o.setAttribute("role", "button"), o.setAttribute("aria-label", "Close popup"), o.href = "#close", o.innerHTML = '<span aria-hidden="true">&#215;</span>', j(o, "click", function(s) {
              Me(s), this.close();
            }, this);
          }
        },
        _updateLayout: function() {
          var e = this._contentNode, t = e.style;
          t.width = "", t.whiteSpace = "nowrap";
          var n = e.offsetWidth;
          n = Math.min(n, this.options.maxWidth), n = Math.max(n, this.options.minWidth), t.width = n + 1 + "px", t.whiteSpace = "", t.height = "";
          var o = e.offsetHeight, s = this.options.maxHeight, c = "leaflet-popup-scrolled";
          s && o > s ? (t.height = s + "px", J(e, c)) : re(e, c), this._containerWidth = this._container.offsetWidth;
        },
        _animateZoom: function(e) {
          var t = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center), n = this._getAnchor();
          Pe(this._container, t.add(n));
        },
        _adjustPan: function() {
          if (this.options.autoPan) {
            if (this._map._panAnim && this._map._panAnim.stop(), this._autopanning) {
              this._autopanning = !1;
              return;
            }
            var e = this._map, t = parseInt(un(this._container, "marginBottom"), 10) || 0, n = this._container.offsetHeight + t, o = this._containerWidth, s = new W(this._containerLeft, -n - this._containerBottom);
            s._add(it(this._container));
            var c = e.layerPointToContainerPoint(s), h = $(this.options.autoPanPadding), p = $(this.options.autoPanPaddingTopLeft || h), f = $(this.options.autoPanPaddingBottomRight || h), k = e.getSize(), S = 0, H = 0;
            c.x + o + f.x > k.x && (S = c.x + o - k.x + f.x), c.x - S - p.x < 0 && (S = c.x - p.x), c.y + n + f.y > k.y && (H = c.y + n - k.y + f.y), c.y - H - p.y < 0 && (H = c.y - p.y), (S || H) && (this.options.keepInView && (this._autopanning = !0), e.fire("autopanstart").panBy([S, H]));
          }
        },
        _getAnchor: function() {
          return $(this._source && this._source._getPopupAnchor ? this._source._getPopupAnchor() : [0, 0]);
        }
      }), da = function(e, t) {
        return new Vi(e, t);
      };
      te.mergeOptions({
        closePopupOnClick: !0
      }), te.include({
        // @method openPopup(popup: Popup): this
        // Opens the specified popup while closing the previously opened (to make sure only one is opened at one time for usability).
        // @alternative
        // @method openPopup(content: String|HTMLElement, latlng: LatLng, options?: Popup options): this
        // Creates a popup with the specified content and options and opens it in the given point on a map.
        openPopup: function(e, t, n) {
          return this._initOverlay(Vi, e, t, n).openOn(this), this;
        },
        // @method closePopup(popup?: Popup): this
        // Closes the popup previously opened with [openPopup](#map-openpopup) (or the given one).
        closePopup: function(e) {
          return e = arguments.length ? e : this._popup, e && e.close(), this;
        }
      }), vt.include({
        // @method bindPopup(content: String|HTMLElement|Function|Popup, options?: Popup options): this
        // Binds a popup to the layer with the passed `content` and sets up the
        // necessary event listeners. If a `Function` is passed it will receive
        // the layer as the first argument and should return a `String` or `HTMLElement`.
        bindPopup: function(e, t) {
          return this._popup = this._initOverlay(Vi, this._popup, e, t), this._popupHandlersAdded || (this.on({
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
          return this._popup && (this instanceof Ot || (this._popup._source = this), this._popup._prepareOpen(e || this._latlng) && this._popup.openOn(this._map)), this;
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
            zt(e);
            var t = e.layer || e.target;
            if (this._popup._source === t && !(t instanceof qt)) {
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
      var $i = kt.extend({
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
          kt.prototype.onAdd.call(this, e), this.setOpacity(this.options.opacity), e.fire("tooltipopen", { tooltip: this }), this._source && (this.addEventParent(this._source), this._source.fire("tooltipopen", { tooltip: this }, !0));
        },
        onRemove: function(e) {
          kt.prototype.onRemove.call(this, e), e.fire("tooltipclose", { tooltip: this }), this._source && (this.removeEventParent(this._source), this._source.fire("tooltipclose", { tooltip: this }, !0));
        },
        getEvents: function() {
          var e = kt.prototype.getEvents.call(this);
          return this.options.permanent || (e.preclick = this.close), e;
        },
        _initLayout: function() {
          var e = "leaflet-tooltip", t = e + " " + (this.options.className || "") + " leaflet-zoom-" + (this._zoomAnimated ? "animated" : "hide");
          this._contentNode = this._container = Y("div", t), this._container.setAttribute("role", "tooltip"), this._container.setAttribute("id", "leaflet-tooltip-" + K(this));
        },
        _updateLayout: function() {
        },
        _adjustPan: function() {
        },
        _setPosition: function(e) {
          var t, n, o = this._map, s = this._container, c = o.latLngToContainerPoint(o.getCenter()), h = o.layerPointToContainerPoint(e), p = this.options.direction, f = s.offsetWidth, k = s.offsetHeight, S = $(this.options.offset), H = this._getAnchor();
          p === "top" ? (t = f / 2, n = k) : p === "bottom" ? (t = f / 2, n = 0) : p === "center" ? (t = f / 2, n = k / 2) : p === "right" ? (t = 0, n = k / 2) : p === "left" ? (t = f, n = k / 2) : h.x < c.x ? (p = "right", t = 0, n = k / 2) : (p = "left", t = f + (S.x + H.x) * 2, n = k / 2), e = e.subtract($(t, n, !0)).add(S).add(H), re(s, "leaflet-tooltip-right"), re(s, "leaflet-tooltip-left"), re(s, "leaflet-tooltip-top"), re(s, "leaflet-tooltip-bottom"), J(s, "leaflet-tooltip-" + p), Pe(s, e);
        },
        _updatePosition: function() {
          var e = this._map.latLngToLayerPoint(this._latlng);
          this._setPosition(e);
        },
        setOpacity: function(e) {
          this.options.opacity = e, this._container && le(this._container, e);
        },
        _animateZoom: function(e) {
          var t = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center);
          this._setPosition(t);
        },
        _getAnchor: function() {
          return $(this._source && this._source._getTooltipAnchor && !this.options.sticky ? this._source._getTooltipAnchor() : [0, 0]);
        }
      }), ha = function(e, t) {
        return new $i(e, t);
      };
      te.include({
        // @method openTooltip(tooltip: Tooltip): this
        // Opens the specified tooltip.
        // @alternative
        // @method openTooltip(content: String|HTMLElement, latlng: LatLng, options?: Tooltip options): this
        // Creates a tooltip with the specified content and options and open it.
        openTooltip: function(e, t, n) {
          return this._initOverlay($i, e, t, n).openOn(this), this;
        },
        // @method closeTooltip(tooltip: Tooltip): this
        // Closes the tooltip given as parameter.
        closeTooltip: function(e) {
          return e.close(), this;
        }
      }), vt.include({
        // @method bindTooltip(content: String|HTMLElement|Function|Tooltip, options?: Tooltip options): this
        // Binds a tooltip to the layer with the passed `content` and sets up the
        // necessary event listeners. If a `Function` is passed it will receive
        // the layer as the first argument and should return a `String` or `HTMLElement`.
        bindTooltip: function(e, t) {
          return this._tooltip && this.isTooltipOpen() && this.unbindTooltip(), this._tooltip = this._initOverlay($i, this._tooltip, e, t), this._initTooltipInteractions(), this._tooltip.options.permanent && this._map && this._map.hasLayer(this) && this.openTooltip(), this;
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
          return this._tooltip && (this instanceof Ot || (this._tooltip._source = this), this._tooltip._prepareOpen(e) && (this._tooltip.openOn(this._map), this.getElement ? this._setAriaDescribedByOnLayer(this) : this.eachLayer && this.eachLayer(this._setAriaDescribedByOnLayer, this))), this;
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
      var wo = In.extend({
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
          if (n.html instanceof Element ? (Ln(t), t.appendChild(n.html)) : t.innerHTML = n.html !== !1 ? n.html : "", n.bgPos) {
            var o = $(n.bgPos);
            t.style.backgroundPosition = -o.x + "px " + -o.y + "px";
          }
          return this._setIconStyles(t, "icon"), t;
        },
        createShadow: function() {
          return null;
        }
      });
      function pa(e) {
        return new wo(e);
      }
      In.Default = ai;
      var si = vt.extend({
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
          updateWhenIdle: Z.mobile,
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
          ee(this, e);
        },
        onAdd: function() {
          this._initContainer(), this._levels = {}, this._tiles = {}, this._resetView();
        },
        beforeAdd: function(e) {
          e._addZoomLimit(this);
        },
        onRemove: function(e) {
          this._removeAllTiles(), I(this._container), e._removeZoomLimit(this), this._container = null, this._tileZoom = void 0;
        },
        // @method bringToFront: this
        // Brings the tile layer to the top of all tile layers.
        bringToFront: function() {
          return this._map && (Ut(this._container), this._setAutoZIndex(Math.max)), this;
        },
        // @method bringToBack: this
        // Brings the tile layer to the bottom of all tile layers.
        bringToBack: function() {
          return this._map && (Ht(this._container), this._setAutoZIndex(Math.min)), this;
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
          return this.options.updateWhenIdle || (this._onMove || (this._onMove = Xe(this._onMoveEnd, this.options.updateInterval, this)), e.move = this._onMove), this._zoomAnimated && (e.zoomanim = this._animateZoom), e;
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
          return e instanceof W ? e : new W(e, e);
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
          if (this._map && !Z.ielt9) {
            le(this._container, this.options.opacity);
            var e = +/* @__PURE__ */ new Date(), t = !1, n = !1;
            for (var o in this._tiles) {
              var s = this._tiles[o];
              if (!(!s.current || !s.loaded)) {
                var c = Math.min(1, (e - s.loaded) / 200);
                le(s.el, c), c < 1 ? t = !0 : (s.active ? n = !0 : this._onOpaqueTile(s), s.active = !0);
              }
            }
            n && !this._noPrune && this._pruneTiles(), t && (Ce(this._fadeFrame), this._fadeFrame = Se(this._updateOpacity, this));
          }
        },
        _onOpaqueTile: de,
        _initContainer: function() {
          this._container || (this._container = Y("div", "leaflet-layer " + (this.options.className || "")), this._updateZIndex(), this.options.opacity < 1 && this._updateOpacity(), this.getPane().appendChild(this._container));
        },
        _updateLevels: function() {
          var e = this._tileZoom, t = this.options.maxZoom;
          if (e !== void 0) {
            for (var n in this._levels)
              n = Number(n), this._levels[n].el.children.length || n === e ? (this._levels[n].el.style.zIndex = t - Math.abs(e - n), this._onUpdateLevel(n)) : (I(this._levels[n].el), this._removeTilesAtZoom(n), this._onRemoveLevel(n), delete this._levels[n]);
            var o = this._levels[e], s = this._map;
            return o || (o = this._levels[e] = {}, o.el = Y("div", "leaflet-tile-container leaflet-zoom-animated", this._container), o.el.style.zIndex = t, o.origin = s.project(s.unproject(s.getPixelOrigin()), e).round(), o.zoom = e, this._setZoomTransform(o, s.getCenter(), s.getZoom()), de(o.el.offsetWidth), this._onCreateLevel(o)), this._level = o, o;
          }
        },
        _onUpdateLevel: de,
        _onRemoveLevel: de,
        _onCreateLevel: de,
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
            I(this._levels[e].el), this._onRemoveLevel(Number(e)), delete this._levels[e];
          this._removeAllTiles(), this._tileZoom = void 0;
        },
        _retainParent: function(e, t, n, o) {
          var s = Math.floor(e / 2), c = Math.floor(t / 2), h = n - 1, p = new W(+s, +c);
          p.z = +h;
          var f = this._tileCoordsToKey(p), k = this._tiles[f];
          return k && k.active ? (k.retain = !0, !0) : (k && k.loaded && (k.retain = !0), h > o ? this._retainParent(s, c, h, o) : !1);
        },
        _retainChildren: function(e, t, n, o) {
          for (var s = 2 * e; s < 2 * e + 2; s++)
            for (var c = 2 * t; c < 2 * t + 2; c++) {
              var h = new W(s, c);
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
          Z.any3d ? xt(e.el, s, o) : Pe(e.el, s);
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
          return new m(s.subtract(c), s.add(c));
        },
        // Private method to load tiles in the grid's active zoom level according to map bounds
        _update: function(e) {
          var t = this._map;
          if (t) {
            var n = this._clampZoom(t.getZoom());
            if (e === void 0 && (e = t.getCenter()), this._tileZoom !== void 0) {
              var o = this._getTiledPixelBounds(e), s = this._pxBoundsToTileRange(o), c = s.getCenter(), h = [], p = this.options.keepBuffer, f = new m(
                s.getBottomLeft().subtract([p, -p]),
                s.getTopRight().add([p, -p])
              );
              if (!(isFinite(s.min.x) && isFinite(s.min.y) && isFinite(s.max.x) && isFinite(s.max.y)))
                throw new Error("Attempted to load an infinite number of tiles");
              for (var k in this._tiles) {
                var S = this._tiles[k].coords;
                (S.z !== this._tileZoom || !f.contains(new W(S.x, S.y))) && (this._tiles[k].current = !1);
              }
              if (Math.abs(n - this._tileZoom) > 1) {
                this._setView(e, n);
                return;
              }
              for (var H = s.min.y; H <= s.max.y; H++)
                for (var se = s.min.x; se <= s.max.x; se++) {
                  var Ge = new W(se, H);
                  if (Ge.z = this._tileZoom, !!this._isValidTile(Ge)) {
                    var Ve = this._tiles[this._tileCoordsToKey(Ge)];
                    Ve ? Ve.current = !0 : h.push(Ge);
                  }
                }
              if (h.sort(function(Je, Rn) {
                return Je.distanceTo(c) - Rn.distanceTo(c);
              }), h.length !== 0) {
                this._loading || (this._loading = !0, this.fire("loading"));
                var ht = document.createDocumentFragment();
                for (se = 0; se < h.length; se++)
                  this._addTile(h[se], ht);
                this._level.el.appendChild(ht);
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
          return G(this.options.bounds).overlaps(o);
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
          var t = e.split(":"), n = new W(+t[0], +t[1]);
          return n.z = +t[2], n;
        },
        _removeTile: function(e) {
          var t = this._tiles[e];
          t && (I(t.el), delete this._tiles[e], this.fire("tileunload", {
            tile: t.el,
            coords: this._keyToTileCoords(e)
          }));
        },
        _initTile: function(e) {
          J(e, "leaflet-tile");
          var t = this.getTileSize();
          e.style.width = t.x + "px", e.style.height = t.y + "px", e.onselectstart = de, e.onmousemove = de, Z.ielt9 && this.options.opacity < 1 && le(e, this.options.opacity);
        },
        _addTile: function(e, t) {
          var n = this._getTilePos(e), o = this._tileCoordsToKey(e), s = this.createTile(this._wrapCoords(e), N(this._tileReady, this, e));
          this._initTile(s), this.createTile.length < 2 && Se(N(this._tileReady, this, e, null, s)), Pe(s, n), this._tiles[o] = {
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
          n = this._tiles[o], n && (n.loaded = +/* @__PURE__ */ new Date(), this._map._fadeAnimated ? (le(n.el, 0), Ce(this._fadeFrame), this._fadeFrame = Se(this._updateOpacity, this)) : (n.active = !0, this._pruneTiles()), t || (J(n.el, "leaflet-tile-loaded"), this.fire("tileload", {
            tile: n.el,
            coords: e
          })), this._noTilesToLoad() && (this._loading = !1, this.fire("load"), Z.ielt9 || !this._map._fadeAnimated ? Se(this._pruneTiles, this) : setTimeout(N(this._pruneTiles, this), 250)));
        },
        _getTilePos: function(e) {
          return e.scaleBy(this.getTileSize()).subtract(this._level.origin);
        },
        _wrapCoords: function(e) {
          var t = new W(
            this._wrapX ? ce(e.x, this._wrapX) : e.x,
            this._wrapY ? ce(e.y, this._wrapY) : e.y
          );
          return t.z = e.z, t;
        },
        _pxBoundsToTileRange: function(e) {
          var t = this.getTileSize();
          return new m(
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
        return new si(e);
      }
      var Nn = si.extend({
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
          this._url = e, t = ee(this, t), t.detectRetina && Z.retina && t.maxZoom > 0 ? (t.tileSize = Math.floor(t.tileSize / 2), t.zoomReverse ? (t.zoomOffset--, t.minZoom = Math.min(t.maxZoom, t.minZoom + 1)) : (t.zoomOffset++, t.maxZoom = Math.max(t.minZoom, t.maxZoom - 1)), t.minZoom = Math.max(0, t.minZoom)) : t.zoomReverse ? t.minZoom = Math.min(t.maxZoom, t.minZoom) : t.maxZoom = Math.max(t.minZoom, t.maxZoom), typeof t.subdomains == "string" && (t.subdomains = t.subdomains.split("")), this.on("tileunload", this._onTileRemove);
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
          return j(n, "load", N(this._tileOnLoad, this, t, n)), j(n, "error", N(this._tileOnError, this, t, n)), (this.options.crossOrigin || this.options.crossOrigin === "") && (n.crossOrigin = this.options.crossOrigin === !0 ? "" : this.options.crossOrigin), typeof this.options.referrerPolicy == "string" && (n.referrerPolicy = this.options.referrerPolicy), n.alt = "", n.src = this.getTileUrl(e), n;
        },
        // @section Extension methods
        // @uninheritable
        // Layers extending `TileLayer` might reimplement the following method.
        // @method getTileUrl(coords: Object): String
        // Called only internally, returns the URL for a tile given its coordinates.
        // Classes extending `TileLayer` can override this function to provide custom tile URL naming schemes.
        getTileUrl: function(e) {
          var t = {
            r: Z.retina ? "@2x" : "",
            s: this._getSubdomain(e),
            x: e.x,
            y: e.y,
            z: this._getZoomForUrl()
          };
          if (this._map && !this._map.options.crs.infinite) {
            var n = this._globalTileRange.max.y - e.y;
            this.options.tms && (t.y = n), t["-y"] = n;
          }
          return ge(this._url, O(t, this.options));
        },
        _tileOnLoad: function(e, t) {
          Z.ielt9 ? setTimeout(N(e, this, null, t), 0) : e(null, t);
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
            if (this._tiles[e].coords.z !== this._tileZoom && (t = this._tiles[e].el, t.onload = de, t.onerror = de, !t.complete)) {
              t.src = Rt;
              var n = this._tiles[e].coords;
              I(t), delete this._tiles[e], this.fire("tileabort", {
                tile: t,
                coords: n
              });
            }
        },
        _removeTile: function(e) {
          var t = this._tiles[e];
          if (t)
            return t.el.setAttribute("src", Rt), si.prototype._removeTile.call(this, e);
        },
        _tileReady: function(e, t, n) {
          if (!(!this._map || n && n.getAttribute("src") === Rt))
            return si.prototype._tileReady.call(this, e, t, n);
        }
      });
      function xo(e, t) {
        return new Nn(e, t);
      }
      var ko = Nn.extend({
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
          var n = O({}, this.defaultWmsParams);
          for (var o in t)
            o in this.options || (n[o] = t[o]);
          t = ee(this, t);
          var s = t.detectRetina && Z.retina ? 2 : 1, c = this.getTileSize();
          n.width = c.x * s, n.height = c.y * s, this.wmsParams = n;
        },
        onAdd: function(e) {
          this._crs = this.options.crs || e.options.crs, this._wmsVersion = parseFloat(this.wmsParams.version);
          var t = this._wmsVersion >= 1.3 ? "crs" : "srs";
          this.wmsParams[t] = this._crs.code, Nn.prototype.onAdd.call(this, e);
        },
        getTileUrl: function(e) {
          var t = this._tileCoordsToNwSe(e), n = this._crs, o = T(n.project(t[0]), n.project(t[1])), s = o.min, c = o.max, h = (this._wmsVersion >= 1.3 && this._crs === mo ? [s.y, s.x, c.y, c.x] : [s.x, s.y, c.x, c.y]).join(","), p = Nn.prototype.getTileUrl.call(this, e);
          return p + Yt(this.wmsParams, p, this.options.uppercase) + (this.options.uppercase ? "&BBOX=" : "&bbox=") + h;
        },
        // @method setParams(params: Object, noRedraw?: Boolean): this
        // Merges an object with the new parameters and re-requests tiles on the current screen (unless `noRedraw` was set to true).
        setParams: function(e, t) {
          return O(this.wmsParams, e), t || this.redraw(), this;
        }
      });
      function ma(e, t) {
        return new ko(e, t);
      }
      Nn.WMS = ko, xo.wms = ma;
      var Bt = vt.extend({
        // @section
        // @aka Renderer options
        options: {
          // @option padding: Number = 0.1
          // How much to extend the clip area around the map view (relative to its size)
          // e.g. 0.1 would be 10% of map view in each direction
          padding: 0.1
        },
        initialize: function(e) {
          ee(this, e), K(this), this._layers = this._layers || {};
        },
        onAdd: function() {
          this._container || (this._initContainer(), J(this._container, "leaflet-zoom-animated")), this.getPane().appendChild(this._container), this._update(), this.on("update", this._updatePaths, this);
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
          Z.any3d ? xt(this._container, c, n) : Pe(this._container, c);
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
          this._bounds = new m(n, n.add(t.multiplyBy(1 + e * 2)).round()), this._center = this._map.getCenter(), this._zoom = this._map.getZoom();
        }
      }), Po = Bt.extend({
        // @section
        // @aka Canvas options
        options: {
          // @option tolerance: Number = 0
          // How much to extend the click tolerance around a path/object on the map.
          tolerance: 0
        },
        getEvents: function() {
          var e = Bt.prototype.getEvents.call(this);
          return e.viewprereset = this._onViewPreReset, e;
        },
        _onViewPreReset: function() {
          this._postponeUpdatePaths = !0;
        },
        onAdd: function() {
          Bt.prototype.onAdd.call(this), this._draw();
        },
        _initContainer: function() {
          var e = this._container = document.createElement("canvas");
          j(e, "mousemove", this._onMouseMove, this), j(e, "click dblclick mousedown mouseup contextmenu", this._onClick, this), j(e, "mouseout", this._handleMouseOut, this), e._leaflet_disable_events = !0, this._ctx = e.getContext("2d");
        },
        _destroyContainer: function() {
          Ce(this._redrawRequest), delete this._ctx, I(this._container), ue(this._container), delete this._container;
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
            Bt.prototype._update.call(this);
            var e = this._bounds, t = this._container, n = e.getSize(), o = Z.retina ? 2 : 1;
            Pe(t, e.min), t.width = o * n.x, t.height = o * n.y, t.style.width = n.x + "px", t.style.height = n.y + "px", Z.retina && this._ctx.scale(2, 2), this._ctx.translate(-e.min.x, -e.min.y), this.fire("update");
          }
        },
        _reset: function() {
          Bt.prototype._reset.call(this), this._postponeUpdatePaths && (this._postponeUpdatePaths = !1, this._updatePaths());
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
          this._map && (this._extendRedrawBounds(e), this._redrawRequest = this._redrawRequest || Se(this._redraw, this));
        },
        _extendRedrawBounds: function(e) {
          if (e._pxBounds) {
            var t = (e.options.weight || 0) + 1;
            this._redrawBounds = this._redrawBounds || new m(), this._redrawBounds.extend(e._pxBounds.min.subtract([t, t])), this._redrawBounds.extend(e._pxBounds.max.add([t, t]));
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
          t && (re(this._container, "leaflet-interactive"), this._fireEvent([t], e, "mouseout"), this._hoveredLayer = null, this._mouseHoverThrottled = !1);
        },
        _handleMouseHover: function(e, t) {
          if (!this._mouseHoverThrottled) {
            for (var n, o, s = this._drawFirst; s; s = s.next)
              n = s.layer, n.options.interactive && n._containsPoint(t) && (o = n);
            o !== this._hoveredLayer && (this._handleMouseOut(e), o && (J(this._container, "leaflet-interactive"), this._fireEvent([o], e, "mouseover"), this._hoveredLayer = o)), this._fireEvent(this._hoveredLayer ? [this._hoveredLayer] : !1, e), this._mouseHoverThrottled = !0, setTimeout(N(function() {
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
      function Lo(e) {
        return Z.canvas ? new Po(e) : null;
      }
      var ri = (function() {
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
          this._container = Y("div", "leaflet-vml-container");
        },
        _update: function() {
          this._map._animatingZoom || (Bt.prototype._update.call(this), this.fire("update"));
        },
        _initPath: function(e) {
          var t = e._container = ri("shape");
          J(t, "leaflet-vml-shape " + (this.options.className || "")), t.coordsize = "1 1", e._path = ri("path"), t.appendChild(e._path), this._updateStyle(e), this._layers[K(e)] = e;
        },
        _addPath: function(e) {
          var t = e._container;
          this._container.appendChild(t), e.options.interactive && e.addInteractiveTarget(t);
        },
        _removePath: function(e) {
          var t = e._container;
          I(t), e.removeInteractiveTarget(t), delete this._layers[K(e)];
        },
        _updateStyle: function(e) {
          var t = e._stroke, n = e._fill, o = e.options, s = e._container;
          s.stroked = !!o.stroke, s.filled = !!o.fill, o.stroke ? (t || (t = e._stroke = ri("stroke")), s.appendChild(t), t.weight = o.weight + "px", t.color = o.color, t.opacity = o.opacity, o.dashArray ? t.dashStyle = Ne(o.dashArray) ? o.dashArray.join(" ") : o.dashArray.replace(/( *, *)/g, " ") : t.dashStyle = "", t.endcap = o.lineCap.replace("butt", "flat"), t.joinstyle = o.lineJoin) : t && (s.removeChild(t), e._stroke = null), o.fill ? (n || (n = e._fill = ri("fill")), s.appendChild(n), n.color = o.fillColor || o.color, n.opacity = o.fillOpacity) : n && (s.removeChild(n), e._fill = null);
        },
        _updateCircle: function(e) {
          var t = e._point.round(), n = Math.round(e._radius), o = Math.round(e._radiusY || n);
          this._setPath(e, e._empty() ? "M0 0" : "AL " + t.x + "," + t.y + " " + n + "," + o + " 0," + 65535 * 360);
        },
        _setPath: function(e, t) {
          e._path.v = t;
        },
        _bringToFront: function(e) {
          Ut(e._container);
        },
        _bringToBack: function(e) {
          Ht(e._container);
        }
      }, Ui = Z.vml ? ri : Vn, li = Bt.extend({
        _initContainer: function() {
          this._container = Ui("svg"), this._container.setAttribute("pointer-events", "none"), this._rootGroup = Ui("g"), this._container.appendChild(this._rootGroup);
        },
        _destroyContainer: function() {
          I(this._container), ue(this._container), delete this._container, delete this._rootGroup, delete this._svgSize;
        },
        _update: function() {
          if (!(this._map._animatingZoom && this._bounds)) {
            Bt.prototype._update.call(this);
            var e = this._bounds, t = e.getSize(), n = this._container;
            (!this._svgSize || !this._svgSize.equals(t)) && (this._svgSize = t, n.setAttribute("width", t.x), n.setAttribute("height", t.y)), Pe(n, e.min), n.setAttribute("viewBox", [e.min.x, e.min.y, t.x, t.y].join(" ")), this.fire("update");
          }
        },
        // methods below are called by vector layers implementations
        _initPath: function(e) {
          var t = e._path = Ui("path");
          e.options.className && J(t, e.options.className), e.options.interactive && J(t, "leaflet-interactive"), this._updateStyle(e), this._layers[K(e)] = e;
        },
        _addPath: function(e) {
          this._rootGroup || this._initContainer(), this._rootGroup.appendChild(e._path), e.addInteractiveTarget(e._path);
        },
        _removePath: function(e) {
          I(e._path), e.removeInteractiveTarget(e._path), delete this._layers[K(e)];
        },
        _updatePath: function(e) {
          e._project(), e._update();
        },
        _updateStyle: function(e) {
          var t = e._path, n = e.options;
          t && (n.stroke ? (t.setAttribute("stroke", n.color), t.setAttribute("stroke-opacity", n.opacity), t.setAttribute("stroke-width", n.weight), t.setAttribute("stroke-linecap", n.lineCap), t.setAttribute("stroke-linejoin", n.lineJoin), n.dashArray ? t.setAttribute("stroke-dasharray", n.dashArray) : t.removeAttribute("stroke-dasharray"), n.dashOffset ? t.setAttribute("stroke-dashoffset", n.dashOffset) : t.removeAttribute("stroke-dashoffset")) : t.setAttribute("stroke", "none"), n.fill ? (t.setAttribute("fill", n.fillColor || n.color), t.setAttribute("fill-opacity", n.fillOpacity), t.setAttribute("fill-rule", n.fillRule || "evenodd")) : t.setAttribute("fill", "none"));
        },
        _updatePoly: function(e, t) {
          this._setPath(e, $n(e._parts, t));
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
          Ut(e._path);
        },
        _bringToBack: function(e) {
          Ht(e._path);
        }
      });
      Z.vml && li.include(_a);
      function To(e) {
        return Z.svg || Z.vml ? new li(e) : null;
      }
      te.include({
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
          return this.options.preferCanvas && Lo(e) || To(e);
        }
      });
      var So = Bn.extend({
        initialize: function(e, t) {
          Bn.prototype.initialize.call(this, this._boundsToLatLngs(e), t);
        },
        // @method setBounds(latLngBounds: LatLngBounds): this
        // Redraws the rectangle with the passed bounds.
        setBounds: function(e) {
          return this.setLatLngs(this._boundsToLatLngs(e));
        },
        _boundsToLatLngs: function(e) {
          return e = G(e), [
            e.getSouthWest(),
            e.getNorthWest(),
            e.getNorthEast(),
            e.getSouthEast()
          ];
        }
      });
      function va(e, t) {
        return new So(e, t);
      }
      li.create = Ui, li.pointsToPath = $n, It.geometryToLayer = Bi, It.coordsToLatLng = lo, It.coordsToLatLngs = Zi, It.latLngToCoords = uo, It.latLngsToCoords = Ni, It.getFeature = Zn, It.asFeature = Ri, te.mergeOptions({
        // @option boxZoom: Boolean = true
        // Whether the map can be zoomed to a rectangular area specified by
        // dragging the mouse while pressing the shift key.
        boxZoom: !0
      });
      var Co = dt.extend({
        initialize: function(e) {
          this._map = e, this._container = e._container, this._pane = e._panes.overlayPane, this._resetStateTimeout = 0, e.on("unload", this._destroy, this);
        },
        addHooks: function() {
          j(this._container, "mousedown", this._onMouseDown, this);
        },
        removeHooks: function() {
          ue(this._container, "mousedown", this._onMouseDown, this);
        },
        moved: function() {
          return this._moved;
        },
        _destroy: function() {
          I(this._pane), delete this._pane;
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
          this._clearDeferredResetState(), this._resetState(), rt(), Yn(), this._startPoint = this._map.mouseEventToContainerPoint(e), j(document, {
            contextmenu: zt,
            mousemove: this._onMouseMove,
            mouseup: this._onMouseUp,
            keydown: this._onKeyDown
          }, this);
        },
        _onMouseMove: function(e) {
          this._moved || (this._moved = !0, this._box = Y("div", "leaflet-zoom-box", this._container), J(this._container, "leaflet-crosshair"), this._map.fire("boxzoomstart")), this._point = this._map.mouseEventToContainerPoint(e);
          var t = new m(this._point, this._startPoint), n = t.getSize();
          Pe(this._box, t.min), this._box.style.width = n.x + "px", this._box.style.height = n.y + "px";
        },
        _finish: function() {
          this._moved && (I(this._box), re(this._container, "leaflet-crosshair")), lt(), Jn(), ue(document, {
            contextmenu: zt,
            mousemove: this._onMouseMove,
            mouseup: this._onMouseUp,
            keydown: this._onKeyDown
          }, this);
        },
        _onMouseUp: function(e) {
          if (!(e.which !== 1 && e.button !== 1) && (this._finish(), !!this._moved)) {
            this._clearDeferredResetState(), this._resetStateTimeout = setTimeout(N(this._resetState, this), 0);
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
      te.addInitHook("addHandler", "boxZoom", Co), te.mergeOptions({
        // @option doubleClickZoom: Boolean|String = true
        // Whether the map can be zoomed in by double clicking on it and
        // zoomed out by double clicking while holding shift. If passed
        // `'center'`, double-click zoom will zoom to the center of the
        //  view regardless of where the mouse was.
        doubleClickZoom: !0
      });
      var Mo = dt.extend({
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
      te.addInitHook("addHandler", "doubleClickZoom", Mo), te.mergeOptions({
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
      var zo = dt.extend({
        addHooks: function() {
          if (!this._draggable) {
            var e = this._map;
            this._draggable = new _t(e._mapPane, e._container), this._draggable.on({
              dragstart: this._onDragStart,
              drag: this._onDrag,
              dragend: this._onDragEnd
            }, this), this._draggable.on("predrag", this._onPreDragLimit, this), e.options.worldCopyJump && (this._draggable.on("predrag", this._onPreDragWrap, this), e.on("zoomend", this._onZoomEnd, this), e.whenReady(this._onZoomEnd, this));
          }
          J(this._map._container, "leaflet-grab leaflet-touch-drag"), this._draggable.enable(), this._positions = [], this._times = [];
        },
        removeHooks: function() {
          re(this._map._container, "leaflet-grab"), re(this._map._container, "leaflet-touch-drag"), this._draggable.disable();
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
            var t = G(this._map.options.maxBounds);
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
            var s = this._lastPos.subtract(this._positions[0]), c = (this._lastTime - this._times[0]) / 1e3, h = n.easeLinearity, p = s.multiplyBy(h / c), f = p.distanceTo([0, 0]), k = Math.min(n.inertiaMaxSpeed, f), S = p.multiplyBy(k / f), H = k / (n.inertiaDeceleration * h), se = S.multiplyBy(-H / 2).round();
            !se.x && !se.y ? t.fire("moveend") : (se = t._limitOffset(se, t.options.maxBounds), Se(function() {
              t.panBy(se, {
                duration: H,
                easeLinearity: h,
                noMoveStart: !0,
                animate: !0
              });
            }));
          }
        }
      });
      te.addInitHook("addHandler", "dragging", zo), te.mergeOptions({
        // @option keyboard: Boolean = true
        // Makes the map focusable and allows users to navigate the map with keyboard
        // arrows and `+`/`-` keys.
        keyboard: !0,
        // @option keyboardPanDelta: Number = 80
        // Amount of pixels to pan when pressing an arrow key.
        keyboardPanDelta: 80
      });
      var Eo = dt.extend({
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
          this._removeHooks(), ue(this._map._container, {
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
          ue(document, "keydown", this._onKeyDown, this);
        },
        _onKeyDown: function(e) {
          if (!(e.altKey || e.ctrlKey || e.metaKey)) {
            var t = e.keyCode, n = this._map, o;
            if (t in this._panKeys) {
              if (!n._panAnim || !n._panAnim._inProgress)
                if (o = this._panKeys[t], e.shiftKey && (o = $(o).multiplyBy(3)), n.options.maxBounds && (o = n._limitOffset($(o), n.options.maxBounds)), n.options.worldCopyJump) {
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
            zt(e);
          }
        }
      });
      te.addInitHook("addHandler", "keyboard", Eo), te.mergeOptions({
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
      var Oo = dt.extend({
        addHooks: function() {
          j(this._map._container, "wheel", this._onWheelScroll, this), this._delta = 0;
        },
        removeHooks: function() {
          ue(this._map._container, "wheel", this._onWheelScroll, this);
        },
        _onWheelScroll: function(e) {
          var t = Ci(e), n = this._map.options.wheelDebounceTime;
          this._delta += t, this._lastMousePos = this._map.mouseEventToContainerPoint(e), this._startTime || (this._startTime = +/* @__PURE__ */ new Date());
          var o = Math.max(n - (+/* @__PURE__ */ new Date() - this._startTime), 0);
          clearTimeout(this._timer), this._timer = setTimeout(N(this._performZoom, this), o), zt(e);
        },
        _performZoom: function() {
          var e = this._map, t = e.getZoom(), n = this._map.options.zoomSnap || 0;
          e._stop();
          var o = this._delta / (this._map.options.wheelPxPerZoomLevel * 4), s = 4 * Math.log(2 / (1 + Math.exp(-Math.abs(o)))) / Math.LN2, c = n ? Math.ceil(s / n) * n : s, h = e._limitZoom(t + (this._delta > 0 ? c : -c)) - t;
          this._delta = 0, this._startTime = null, h && (e.options.scrollWheelZoom === "center" ? e.setZoom(t + h) : e.setZoomAround(this._lastMousePos, t + h));
        }
      });
      te.addInitHook("addHandler", "scrollWheelZoom", Oo);
      var ga = 600;
      te.mergeOptions({
        // @section Touch interaction options
        // @option tapHold: Boolean
        // Enables simulation of `contextmenu` event, default is `true` for mobile Safari.
        tapHold: Z.touchNative && Z.safari && Z.mobile,
        // @option tapTolerance: Number = 15
        // The max number of pixels a user can shift his finger during touch
        // for it to be considered a valid tap.
        tapTolerance: 15
      });
      var Ao = dt.extend({
        addHooks: function() {
          j(this._map._container, "touchstart", this._onDown, this);
        },
        removeHooks: function() {
          ue(this._map._container, "touchstart", this._onDown, this);
        },
        _onDown: function(e) {
          if (clearTimeout(this._holdTimeout), e.touches.length === 1) {
            var t = e.touches[0];
            this._startPos = this._newPos = new W(t.clientX, t.clientY), this._holdTimeout = setTimeout(N(function() {
              this._cancel(), this._isTapValid() && (j(document, "touchend", Me), j(document, "touchend touchcancel", this._cancelClickPrevent), this._simulateEvent("contextmenu", t));
            }, this), ga), j(document, "touchend touchcancel contextmenu", this._cancel, this), j(document, "touchmove", this._onMove, this);
          }
        },
        _cancelClickPrevent: function e() {
          ue(document, "touchend", Me), ue(document, "touchend touchcancel", e);
        },
        _cancel: function() {
          clearTimeout(this._holdTimeout), ue(document, "touchend touchcancel contextmenu", this._cancel, this), ue(document, "touchmove", this._onMove, this);
        },
        _onMove: function(e) {
          var t = e.touches[0];
          this._newPos = new W(t.clientX, t.clientY);
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
      te.addInitHook("addHandler", "tapHold", Ao), te.mergeOptions({
        // @section Touch interaction options
        // @option touchZoom: Boolean|String = *
        // Whether the map can be zoomed by touch-dragging with two fingers. If
        // passed `'center'`, it will zoom to the center of the view regardless of
        // where the touch events (fingers) were. Enabled for touch-capable web
        // browsers.
        touchZoom: Z.touch,
        // @option bounceAtZoomLimits: Boolean = true
        // Set it to false if you don't want the map to zoom beyond min/max zoom
        // and then bounce back when pinch-zooming.
        bounceAtZoomLimits: !0
      });
      var Io = dt.extend({
        addHooks: function() {
          J(this._map._container, "leaflet-touch-zoom"), j(this._map._container, "touchstart", this._onTouchStart, this);
        },
        removeHooks: function() {
          re(this._map._container, "leaflet-touch-zoom"), ue(this._map._container, "touchstart", this._onTouchStart, this);
        },
        _onTouchStart: function(e) {
          var t = this._map;
          if (!(!e.touches || e.touches.length !== 2 || t._animatingZoom || this._zooming)) {
            var n = t.mouseEventToContainerPoint(e.touches[0]), o = t.mouseEventToContainerPoint(e.touches[1]);
            this._centerPoint = t.getSize()._divideBy(2), this._startLatLng = t.containerPointToLatLng(this._centerPoint), t.options.touchZoom !== "center" && (this._pinchStartLatLng = t.containerPointToLatLng(n.add(o)._divideBy(2))), this._startDist = n.distanceTo(o), this._startZoom = t.getZoom(), this._moved = !1, this._zooming = !0, t._stop(), j(document, "touchmove", this._onTouchMove, this), j(document, "touchend touchcancel", this._onTouchEnd, this), Me(e);
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
            this._moved || (t._moveStart(!0, !1), this._moved = !0), Ce(this._animRequest);
            var h = N(t._move, t, this._center, this._zoom, { pinch: !0, round: !1 }, void 0);
            this._animRequest = Se(h, this, !0), Me(e);
          }
        },
        _onTouchEnd: function() {
          if (!this._moved || !this._zooming) {
            this._zooming = !1;
            return;
          }
          this._zooming = !1, Ce(this._animRequest), ue(document, "touchmove", this._onTouchMove, this), ue(document, "touchend touchcancel", this._onTouchEnd, this), this._map.options.zoomAnimation ? this._map._animateZoom(this._center, this._map._limitZoom(this._zoom), !0, this._map.options.zoomSnap) : this._map._resetView(this._center, this._map._limitZoom(this._zoom));
        }
      });
      te.addInitHook("addHandler", "touchZoom", Io), te.BoxZoom = Co, te.DoubleClickZoom = Mo, te.Drag = zo, te.Keyboard = Eo, te.ScrollWheelZoom = Oo, te.TapHold = Ao, te.TouchZoom = Io, a.Bounds = m, a.Browser = Z, a.CRS = et, a.Canvas = Po, a.Circle = ro, a.CircleMarker = Ii, a.Class = Qe, a.Control = X, a.DivIcon = wo, a.DivOverlay = kt, a.DomEvent = to, a.DomUtil = Qi, a.Draggable = _t, a.Evented = Pt, a.FeatureGroup = Ot, a.GeoJSON = It, a.GridLayer = si, a.Handler = dt, a.Icon = In, a.ImageOverlay = Di, a.LatLng = ne, a.LatLngBounds = b, a.Layer = vt, a.LayerGroup = An, a.LineUtil = Ko, a.Map = te, a.Marker = Ai, a.Mixin = ti, a.Path = qt, a.Point = W, a.PolyUtil = l, a.Polygon = Bn, a.Polyline = At, a.Popup = Vi, a.PosAnimation = hn, a.Projection = Yo, a.Rectangle = So, a.Renderer = Bt, a.SVG = li, a.SVGOverlay = bo, a.TileLayer = Nn, a.Tooltip = $i, a.Transformation = qe, a.Util = Vt, a.VideoOverlay = yo, a.bind = N, a.bounds = T, a.canvas = Lo, a.circle = oa, a.circleMarker = ia, a.control = Et, a.divIcon = pa, a.extend = O, a.featureGroup = ea, a.geoJSON = go, a.geoJson = ra, a.gridLayer = fa, a.icon = ta, a.imageOverlay = la, a.latLng = ie, a.latLngBounds = G, a.layerGroup = Qo, a.map = no, a.marker = na, a.point = $, a.polygon = sa, a.polyline = aa, a.popup = da, a.rectangle = va, a.setOptions = ee, a.stamp = K, a.svg = To, a.svgOverlay = ca, a.tileLayer = xo, a.tooltip = ha, a.transformation = V, a.version = Be, a.videoOverlay = ua;
      var ya = window.L;
      a.noConflict = function() {
        return window.L = ya, this;
      }, window.L = a;
    }));
  })(di, di.exports)), di.exports;
}
var Ia = Aa();
const R = /* @__PURE__ */ Ea(Ia), Vo = (_e, y) => Wi.global.t(_e, {});
function Kt(_e) {
  const y = String(_e?.message || _e || "");
  return /connection refused|Unavailable|actively refused|dial tcp|ECONNREFUSED|LIFE is unavailable|life unavailable|502|503/i.test(y) ? Vo("life.kit.notReady") : y || Vo("life.kit.actionFailed");
}
const Go = (_e) => new Promise((y) => setTimeout(y, _e)), jo = 3200;
async function Zt(_e, y = {}) {
  let a = null;
  for (let Be = 0; Be < 3; Be++)
    try {
      const O = await fetch("/api/life/companion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: _e, payload: y })
      });
      if (!O.ok) throw Error(await O.text() || String(O.status));
      return await O.json().catch(() => ({}));
    } catch (O) {
      a = O;
      const He = /connection refused|Unavailable|actively refused|dial tcp|ECONNREFUSED|502|503|life unavailable/i.test(String(O?.message || O));
      if (Be < 2 && He) {
        await Go(1200);
        continue;
      }
      throw O;
    }
  throw a;
}
async function $o(_e = "/api/life/companion") {
  const y = await fetch(_e);
  if (!y.ok) throw Error(await y.text() || String(y.status));
  return y.json();
}
function qo(_e) {
  const y = `.${_e}`;
  return `
${y}{
  --r-xs:10px; --r-sm:14px; --r-md:20px; --r-lg:28px; --r-xl:36px;
  --spring:cubic-bezier(.2,.9,.25,1.15);
  height:100%;overflow-y:auto;padding:var(--space-xl) var(--space-xl) 96px;
  background:var(--md-surface);color:var(--md-on-surface);
  max-width:1240px;margin:0 auto;
}
${y} h1,${y} h2,${y} h3,${y} h4{margin:0;letter-spacing:-.01em}
${y} .eyebrow{margin:0 0 8px;color:var(--md-primary);font:700 12px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.18em}
${y} .eyebrow b{font-size:9px}

/* Hero */
${y} .hero{position:relative;border-radius:var(--r-xl);padding:28px 28px 22px;margin-bottom:22px;
  background:linear-gradient(135deg,var(--md-primary-container),var(--md-surface-container-high) 70%);
  color:var(--md-on-surface);box-shadow:var(--shadow-1);overflow:hidden}
${y} .hero::after{content:'';position:absolute;right:-60px;top:-60px;width:220px;height:220px;border-radius:50%;
  background:radial-gradient(circle,color-mix(in srgb,var(--md-primary) 34%,transparent),transparent 68%);pointer-events:none}
${y} .hero-main{display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;align-items:flex-start;position:relative;z-index:1}
${y} .hero-copy h1{font-size:clamp(26px,3.4vw,40px);font-weight:800}
${y} .sub{margin:8px 0 0;max-width:620px;font-size:14px;line-height:1.6;color:var(--md-on-surface-variant)}
${y} .hero-actions{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
${y} .fab{height:52px;padding:0 22px;border:0;border-radius:18px;background:var(--md-primary);color:var(--md-on-primary,#fff);
  font:700 14px/1 inherit;display:inline-flex;align-items:center;gap:10px;cursor:pointer;box-shadow:0 6px 18px color-mix(in srgb,var(--md-primary) 34%,transparent);
  transition:transform .28s var(--spring),box-shadow .28s}
@media (hover: hover) and (pointer: fine){${y} .fab:hover:not(:disabled){transform:translateY(-2px) scale(1.02)}}
${y} .fab:disabled{opacity:.6;cursor:not-allowed}
${y} .fab-ic{font-size:17px}
${y} .state-row{position:relative;z-index:1;display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;align-items:center}
${y} .pill{padding:6px 14px;border-radius:999px;background:color-mix(in srgb,var(--md-surface-container-lowest) 70%,transparent);font-size:13px;font-weight:700}
${y} .pill.soft{font-weight:500;color:var(--md-on-surface-variant)}
${y} .pill.bad{background:var(--md-warning-container);color:var(--md-on-warning-container)}

${y} .banner{padding:12px 16px;border-radius:var(--r-sm);font-size:13px;margin:0 0 16px}
${y} .banner.err{background:var(--md-error-container);color:var(--md-on-error-container)}
${y} .banner.ok{background:var(--md-primary-container);color:var(--md-on-primary-container)}

/* Tabs */
${y} .tabs{display:flex;gap:8px;overflow-x:auto;padding:6px 4px 14px;margin-bottom:6px;scrollbar-width:thin}
${y} .tab{flex:0 0 auto;display:inline-flex;align-items:center;gap:8px;height:44px;padding:0 18px;border:1px solid var(--md-outline-variant);
  border-radius:999px;background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font:700 13px/1 inherit;cursor:pointer;
  transition:background .25s,color .25s,transform .25s var(--spring)}
${y} .tab i{font-style:normal;font:700 12px/1 ui-monospace,monospace;opacity:.6}
${y} .tab-ic{font-size:14px}
${y} .tab:hover{background:var(--md-surface-container-high)}
${y} .tab.active{background:var(--md-primary);color:var(--md-on-primary,#fff);border-color:transparent;transform:translateY(-1px);
  box-shadow:0 6px 16px color-mix(in srgb,var(--md-primary) 30%,transparent)}
${y} .tab.active i{opacity:.85}

${y} .panel{animation:fade .32s var(--spring)}
@keyframes fade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
/* The v-show panels are permanently mounted, so the entrance animation only
   plays on first paint. A page that switches tabs replays it by toggling this
   class (distinct keyframes, otherwise re-adding the same computed animation
   would not restart it). See CompanionPage replayPanel(). */
${y} .panel-replay{animation:fadeReplay .32s var(--spring)}
@keyframes fadeReplay{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
${y} .section-head{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap;margin:8px 0 18px}
${y} .section-head h2{font-size:22px;font-weight:800}
${y} .desc{margin:6px 0 0;font-size:13px;color:var(--md-on-surface-variant);max-width:720px;line-height:1.55}
${y} .head-actions{display:flex;gap:8px;flex-wrap:wrap;align-items:center}

/* Buttons */
${y} .btn{height:40px;padding:0 16px;border:1px solid transparent;border-radius:999px;font:700 13px/1 inherit;cursor:pointer;
  display:inline-flex;align-items:center;justify-content:center;gap:8px;transition:transform .22s var(--spring),background .22s,box-shadow .22s}
${y} .btn.sm{height:34px;padding:0 14px;font-size:13px}
${y} .btn:disabled{opacity:.5;cursor:not-allowed}
@media (hover: hover) and (pointer: fine){${y} .btn:hover:not(:disabled){transform:translateY(-1px)}}
${y} .btn.filled{background:var(--md-primary);color:var(--md-on-primary,#fff)}
${y} .btn.tonic{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
${y} .btn.text{background:transparent;color:var(--md-primary)}
${y} .btn.danger{background:var(--md-error-container);color:var(--md-on-error-container)}
${y} .link{border:0;background:transparent;color:var(--md-primary);font:700 12px/1 inherit;cursor:pointer;padding:4px}

/* Cards */
${y} .card{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--r-lg);padding:20px;margin-bottom:16px}
${y} .card > h3{font-size:16px;font-weight:750;margin-bottom:14px;display:flex;align-items:center;gap:8px;flex-wrap:wrap}
${y} .card.sub{padding:16px;margin-bottom:0}
/* minmax(0, 1fr) rather than 1fr: a bare 1fr track has an auto minimum, so one
   child with a large min-content width (a long model id, a URL) blows the track
   past the container instead of shrinking. */
${y} .grid2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;align-items:start}
${y} .grid3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;align-items:start}
${y} .sub-label{margin:16px 0 8px;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--md-on-surface-variant)}
${y} .hint{font-size:12px;color:var(--md-on-surface-variant);line-height:1.55;margin:6px 0}
${y} .meta{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}
${y} .empty{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant)}

/* Fields */
${y} .field{width:100%;height:48px;padding:0 16px;border:1px solid var(--md-outline-variant);border-radius:var(--r-sm);
  background:var(--md-surface-container-high);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none;transition:border-color .2s,box-shadow .2s}
${y} .field:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 14%,transparent)}
${y} .field.tiny{width:104px;height:38px;padding:0 12px;font-size:13px}
${y} .switches{display:flex;gap:16px;flex-wrap:wrap;margin:8px 0}
${y} .sw{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:var(--md-on-surface-variant);cursor:pointer}
${y} .sw input{width:18px;height:18px;accent-color:var(--md-primary)}
${y} .settings-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px}
${y} .settings-grid label{display:flex;flex-direction:column;gap:4px;font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}
${y} .settings-grid .field{height:40px}
${y} .fld{display:flex;flex-direction:column;gap:4px;font-size:12px;font-weight:600;color:var(--md-on-surface-variant);min-width:180px}

/* Chips / status */
${y} .count-pill{margin-left:auto;flex:0 0 auto;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);border-radius:999px;padding:3px 10px;font-size:12px;font-weight:700}
${y} .count-pill.ok{background:var(--md-success-container);color:var(--md-on-success-container,#0d3b1e)}
${y} .actions-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:8px}

/* Feed list (adapters, routes, commitments …) */
${y} .feed{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:10px}
${y} .feed > li{padding:14px 16px;border-radius:var(--r-md);background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 60%,transparent)}
${y} .feed > li.empty{background:none;border:0}

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
#app ${y} .card{border-color:color-mix(in srgb,var(--md-outline-variant) 55%,transparent);background:var(--md-surface-container-low);box-shadow:var(--shadow-1)}
#app ${y} .field{height:52px;border-radius:16px;border-color:transparent;background:var(--md-surface-container-high)}
#app ${y} .field:focus{border-color:var(--md-primary);background:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}
#app ${y} .field.tiny{height:40px}
#app ${y} .settings-grid .field{height:44px}
#app ${y} .btn{height:44px;padding:0 20px}
#app ${y} .btn.sm{height:36px;padding:0 15px}

/* Theme-specific overrides key off html[data-theme] — the darkmode plugin's
   toggle — not prefers-color-scheme, so a manual light/dark choice in Settings
   is honored (the injected CSS is global, so html-level selectors are fine). */
@media (prefers-reduced-motion: reduce){
  ${y} .panel{animation:none}
  ${y} .panel-replay{animation:none}
  ${y} .fab,${y} .btn,${y} .tab{transition:none}
  ${y} .fab:hover:not(:disabled),${y} .btn:hover:not(:disabled),${y} .tab.active{transform:none}
}
html[data-theme="dark"] ${y} .pill.bad{background:#5a2d00;color:#ffd7b0}
@media(max-width:820px){${y} .grid2,${y} .grid3{grid-template-columns:1fr}}
@media(max-width:560px){${y}{padding:var(--space-lg) var(--space-lg) 80px}${y} .hero{padding:20px}${y} .hero-actions{width:100%}}
`;
}
function Ba(_e, y) {
  if (typeof document > "u" || document.getElementById(_e)) return;
  const a = document.createElement("style");
  a.id = _e, a.textContent = y, document.head.appendChild(a);
}
const Za = { class: "lsp" }, Na = { class: "hero" }, Ra = { class: "hero-main" }, Da = { class: "hero-copy" }, Va = { class: "sub" }, $a = { class: "hero-actions" }, Ua = ["disabled"], Ha = { class: "state-row" }, Fa = { class: "pill soft" }, Wa = { class: "pill soft" }, Ga = { class: "pill soft" }, ja = {
  key: 0,
  class: "banner err"
}, qa = {
  key: 1,
  class: "banner ok"
}, Ka = {
  key: 2,
  class: "card empty"
}, Ya = { class: "card" }, Ja = { class: "count-pill" }, Xa = {
  key: 0,
  class: "empty"
}, Qa = {
  key: 1,
  class: "feed"
}, es = { class: "adapter-row" }, ts = { class: "pill muted" }, ns = {
  class: "meta",
  style: { "margin-top": "6px" }
}, is = { class: "pill soft" }, os = { class: "meta" }, as = {
  key: 0,
  class: "hint",
  style: { color: "var(--md-error,#b3261e)" }
}, ss = { class: "adapter-actions" }, rs = ["disabled", "onClick"], ls = ["onClick"], us = ["disabled", "onClick"], cs = { class: "settings-grid" }, ds = { key: 0 }, hs = ["placeholder"], ps = ["placeholder"], fs = ["placeholder"], ms = ["placeholder"], _s = ["placeholder"], vs = { class: "hint" }, gs = {
  class: "sw",
  style: { "margin-top": "12px" }
}, ys = {
  class: "sw",
  style: { "margin-top": "12px" }
}, bs = {
  key: 0,
  class: "hint platform-note"
}, ws = { class: "editor-actions" }, xs = ["disabled"], ks = { class: "card" }, Ps = { class: "hint" }, Ls = { class: "idx" }, Ts = { class: "to" }, Ss = { style: { "margin-left": "auto", display: "flex", gap: "8px" } }, Cs = ["disabled", "aria-label", "title", "onClick"], Ms = ["disabled", "aria-label", "title", "onClick"], zs = ["aria-label", "onClick"], Es = {
  key: 0,
  class: "empty"
}, Os = {
  class: "settings-grid",
  style: { "margin-top": "14px" }
}, As = ["placeholder"], Is = { class: "actions-row" }, Bs = {
  class: "fld",
  style: { "margin-left": "auto" }
}, Zs = ["disabled"], Uo = "life-plugin-adapters-style", Ns = /* @__PURE__ */ Fo({
  __name: "AdapterSettingsPage",
  setup(_e) {
    const { confirm: y } = Wo(), a = (m, T) => Wi.global.t(m, T ?? {}), Be = F(!0), O = F(""), He = F("");
    function N(m) {
      He.value = m, setTimeout(() => {
        He.value === m && (He.value = "");
      }, jo);
    }
    const Le = F([]), K = F([]), Xe = F([]), ce = F(!1), de = F(null), q = F(Ze()), Te = F(null);
    function Ze() {
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
    function ee(m) {
      return K.value.find((T) => T.id === m) || { id: m };
    }
    function Yt(m) {
      const T = ee(m.id);
      return m.enabled ? T.connected ? { label: a("life.adapters.stateConnected", { n: T.clients || 0 }), tone: "ok" } : T.running ? {
        label: a(m.direction === "connect" ? "life.adapters.stateConnecting" : "life.adapters.stateWaiting"),
        tone: "wait"
      } : { label: T.error ? a("life.adapters.stateFailed") : a("life.adapters.stateIdle"), tone: "bad" } : { label: a("life.adapters.stateDisabled"), tone: "muted" };
    }
    A(() => Xe.value.filter((m) => m.implemented).map((m) => m.id));
    const fn = A(() => Xe.value.filter((m) => !m.implemented).map((m) => m.id));
    async function ge() {
      Be.value = !0, O.value = "";
      try {
        const [m, T, b] = await Promise.all([
          Zt("adapter_list"),
          Zt("adapter_platforms"),
          Zt("adapter_routes_get")
        ]);
        Le.value = m?.instances || [], K.value = m?.runtime || [], Xe.value = T?.platforms || [], Fe.value = (b?.routes || []).map(Qt), Se.value = b?.default_config_id || "default", q.value = { ...Ze(), ws_port: Ne() };
      } catch (m) {
        O.value = Kt(m);
      } finally {
        Be.value = !1;
      }
    }
    function Ne() {
      const m = new Set(Le.value.map((b) => Number(b.ws_port) || 0));
      let T = 6199;
      for (; m.has(T) && T < 65535; ) T += 1;
      return T;
    }
    async function Nt() {
      de.value = "", q.value = {
        ...Ze(),
        ws_port: Ne()
      }, await Fi(), Te.value?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    async function Rt(m) {
      de.value = m.id, q.value = {
        ...Ze(),
        ...m,
        trigger_keywords: Array.isArray(m.trigger_keywords) ? m.trigger_keywords.join(",") : m.trigger_keywords || ""
      }, await Fi(), Te.value?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    async function Jt() {
      ce.value = !0;
      try {
        const m = { ...q.value };
        m.id && !m.ws_token && delete m.ws_token, m.id && !m.access_token && delete m.access_token, m.trigger_keywords = String(m.trigger_keywords || "").split(",").map((ne) => ne.trim()).filter(Boolean);
        const T = Number(m.ws_port);
        m.ws_port === "" || m.ws_port === null || m.ws_port === void 0 ? delete m.ws_port : T > 0 ? m.ws_port = T : delete m.ws_port, m.id || delete m.id;
        const b = await Zt("adapter_upsert", { instance: m });
        if (b && b.ok === !1) throw Error(b.error || a("life.adapters.saveFailed"));
        b?.sync?.failed?.includes(b?.instance?.id) && m.enabled ? N(a("life.adapters.savedUnlistened")) : N(m.enabled === !1 ? a("life.adapters.savedDisabled") : a("life.adapters.savedListening")), de.value = null, await ge();
      } catch (m) {
        O.value = Kt(m);
      } finally {
        ce.value = !1;
      }
    }
    async function mn(m) {
      ce.value = !0;
      try {
        await Zt("adapter_toggle", { id: m.id, enabled: !m.enabled }), N(m.enabled ? a("life.adapters.toggledDisabled", { name: m.name }) : a("life.adapters.toggledEnabled", { name: m.name })), await ge();
      } catch (T) {
        O.value = Kt(T);
      } finally {
        ce.value = !1;
      }
    }
    async function Dt(m) {
      if (await y({
        title: a("life.adapters.deleteTitle"),
        message: a("life.adapters.deleteMessage", { name: m.name }),
        confirmLabel: a("life.adapters.delete"),
        danger: !0
      })) {
        ce.value = !0;
        try {
          await Zt("adapter_delete", { id: m.id }), N(a("life.adapters.deleted")), de.value === m.id && (de.value = null), await ge();
        } catch (b) {
          O.value = Kt(b);
        } finally {
          ce.value = !1;
        }
      }
    }
    async function Xt() {
      ce.value = !0;
      try {
        const T = (await Zt("adapter_sync"))?.failed || [];
        N(T.length ? a("life.adapters.resyncFailed", { count: T.length, names: T.join(a("life.adapters.listSeparator")) }) : a("life.adapters.resynced")), await ge();
      } catch (m) {
        O.value = Kt(m);
      } finally {
        ce.value = !1;
      }
    }
    const Fe = F([]), Se = F("default"), Ce = F({ pattern: "*", config_id: "default" }), Vt = F(!1);
    let Qe = 0;
    function Qt(m) {
      return { ...m, _key: `rule-${++Qe}` };
    }
    const We = (m) => ({ pattern: m.pattern, config_id: m.config_id });
    function Pt() {
      const m = String(Ce.value.pattern || "").trim();
      if (!m) {
        O.value = a("life.adapters.routePatternRequired");
        return;
      }
      Fe.value = [...Fe.value, Qt({ pattern: m, config_id: String(Ce.value.config_id || "default").trim() || "default" })], Ce.value = { pattern: "*", config_id: "default" }, O.value = "";
    }
    function W(m) {
      Fe.value = Fe.value.filter((T, b) => b !== m);
    }
    function en(m, T) {
      const b = [...Fe.value], G = m + T;
      if (G < 0 || G >= b.length) return;
      const [ne] = b.splice(m, 1);
      b.splice(G, 0, ne), Fe.value = b;
    }
    async function $() {
      Vt.value = !0;
      try {
        await Zt("adapter_routes_set", {
          routes: Fe.value.map(We),
          default_config_id: String(Se.value || "default").trim() || "default"
        }), N(a("life.adapters.routesSaved"));
      } catch (m) {
        O.value = Kt(m);
      } finally {
        Vt.value = !1;
      }
    }
    if (typeof document < "u" && !document.getElementById(Uo)) {
      const m = document.createElement("style");
      m.id = Uo, m.textContent = qo("lsp") + `
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
`, document.head.appendChild(m);
    }
    return ci(ge), (m, T) => (v(), g("main", Za, [
      i("header", Na, [
        i("div", Ra, [
          i("div", Da, [
            T[17] || (T[17] = i(
              "p",
              { class: "eyebrow" },
              [
                i("b", null, "●"),
                z(" L.I.F.E · MESSAGING PLATFORMS")
              ],
              -1
              /* CACHED */
            )),
            i(
              "h1",
              null,
              r(a("life.adapters.title")),
              1
              /* TEXT */
            ),
            i("p", Va, [
              z(
                r(a("life.adapters.subtitleBefore")),
                1
                /* TEXT */
              ),
              i(
                "b",
                null,
                r(a("life.adapters.subtitleServer")),
                1
                /* TEXT */
              ),
              z(
                r(a("life.adapters.subtitleAfter")),
                1
                /* TEXT */
              )
            ])
          ]),
          i("div", $a, [
            i("button", {
              class: "fab",
              disabled: ce.value || Be.value,
              onClick: Xt
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
              z(
                r(ce.value ? a("life.adapters.processing") : a("life.adapters.relisten")),
                1
                /* TEXT */
              )
            ], 8, Ua)
          ])
        ]),
        i("div", Ha, [
          i(
            "span",
            Fa,
            r(a("life.adapters.adapterCount", { n: Le.value.length })),
            1
            /* TEXT */
          ),
          i(
            "span",
            Wa,
            r(a("life.adapters.enabledCount", { n: Le.value.filter((b) => b.enabled).length })),
            1
            /* TEXT */
          ),
          i(
            "span",
            Ga,
            r(a("life.adapters.connectedCount", { n: K.value.filter((b) => b.connected).length })),
            1
            /* TEXT */
          )
        ])
      ]),
      O.value ? (v(), g(
        "p",
        ja,
        r(O.value),
        1
        /* TEXT */
      )) : E("v-if", !0),
      He.value ? (v(), g(
        "p",
        qa,
        r(He.value),
        1
        /* TEXT */
      )) : E("v-if", !0),
      Be.value ? (v(), g(
        "p",
        Ka,
        r(a("life.adapters.loadingConfig")),
        1
        /* TEXT */
      )) : E("v-if", !0),
      Be.value ? E("v-if", !0) : (v(), g(
        Q,
        { key: 3 },
        [
          i("article", Ya, [
            i("h3", null, [
              z(
                r(a("life.adapters.adaptersHeading")) + " ",
                1
                /* TEXT */
              ),
              i(
                "span",
                Ja,
                r(Le.value.length),
                1
                /* TEXT */
              ),
              i(
                "button",
                {
                  class: "btn filled sm",
                  style: { "margin-left": "auto" },
                  onClick: Nt
                },
                r(a("life.adapters.addAdapter")),
                1
                /* TEXT */
              )
            ]),
            Le.value.length ? (v(), g("ol", Qa, [
              (v(!0), g(
                Q,
                null,
                Ee(Le.value, (b) => (v(), g("li", {
                  key: b.id
                }, [
                  i("div", es, [
                    i(
                      "strong",
                      null,
                      r(b.name || b.id),
                      1
                      /* TEXT */
                    ),
                    i(
                      "span",
                      {
                        class: D(["pill", Yt(b).tone])
                      },
                      r(Yt(b).label),
                      3
                      /* TEXT, CLASS */
                    ),
                    i(
                      "span",
                      ts,
                      r(b.platform),
                      1
                      /* TEXT */
                    )
                  ]),
                  i("div", ns, [
                    i(
                      "span",
                      is,
                      r(b.direction === "connect" ? a("life.adapters.directionConnect") : a("life.adapters.directionReverse")),
                      1
                      /* TEXT */
                    ),
                    z(
                      " " + r(b.direction === "connect" ? a("life.adapters.connectingTo", { target: `${b.ws_host}:${b.ws_port}${b.ws_path || ""}` }) : a("life.adapters.listening", { host: b.ws_host, port: b.ws_port })) + " · " + r(a("life.adapters.personaInline")) + " ",
                      1
                      /* TEXT */
                    ),
                    i(
                      "code",
                      null,
                      r(b.config_id),
                      1
                      /* TEXT */
                    ),
                    b.http_url ? (v(), g(
                      Q,
                      { key: 0 },
                      [
                        z(
                          " · HTTP " + r(b.http_url),
                          1
                          /* TEXT */
                        )
                      ],
                      64
                      /* STABLE_FRAGMENT */
                    )) : E("v-if", !0)
                  ]),
                  i("div", os, [
                    i(
                      "span",
                      {
                        class: D({ "token-warn": !b.has_ws_token && b.ws_host === "0.0.0.0" })
                      },
                      r(b.has_ws_token ? a("life.adapters.tokenSet") : a("life.adapters.tokenUnset")),
                      3
                      /* TEXT, CLASS */
                    ),
                    b.trigger_keywords && b.trigger_keywords.length ? (v(), g(
                      Q,
                      { key: 0 },
                      [
                        z(
                          " · " + r(a("life.adapters.triggerWords")) + " " + r(b.trigger_keywords.join(a("life.adapters.listSeparator"))),
                          1
                          /* TEXT */
                        )
                      ],
                      64
                      /* STABLE_FRAGMENT */
                    )) : E("v-if", !0)
                  ]),
                  ee(b.id).error ? (v(), g(
                    "p",
                    as,
                    r(a("life.adapters.listenError", { error: ee(b.id).error })),
                    1
                    /* TEXT */
                  )) : E("v-if", !0),
                  i("div", ss, [
                    i("button", {
                      class: "btn sm",
                      disabled: ce.value,
                      onClick: (G) => mn(b)
                    }, r(b.enabled ? a("life.adapters.disable") : a("life.adapters.enable")), 9, rs),
                    i("button", {
                      class: "btn sm",
                      onClick: (G) => Rt(b)
                    }, r(a("life.adapters.edit")), 9, ls),
                    i("button", {
                      class: "btn sm danger",
                      disabled: ce.value,
                      onClick: (G) => Dt(b)
                    }, r(a("life.adapters.delete")), 9, us)
                  ])
                ]))),
                128
                /* KEYED_FRAGMENT */
              ))
            ])) : (v(), g(
              "p",
              Xa,
              r(a("life.adapters.emptyAdapters")),
              1
              /* TEXT */
            ))
          ]),
          Oe(Ca, { name: "lsp-fade" }, {
            default: Ro(() => [
              de.value !== null ? (v(), g(
                "article",
                {
                  key: 0,
                  ref_key: "editorEl",
                  ref: Te,
                  class: "card"
                },
                [
                  i(
                    "h3",
                    null,
                    r(q.value.id ? a("life.adapters.editAdapterTitle") : a("life.adapters.addAdapterTitle")),
                    1
                    /* TEXT */
                  ),
                  i("div", cs, [
                    i("label", null, [
                      i(
                        "span",
                        null,
                        r(a("life.adapters.platformCategory")),
                        1
                        /* TEXT */
                      ),
                      Oe($e(Ue), {
                        modelValue: q.value.platform,
                        "onUpdate:modelValue": T[0] || (T[0] = (b) => q.value.platform = b),
                        options: Xe.value.map((b) => ({ value: b.id, label: b.id + (b.implemented ? "" : a("life.adapters.notImplemented")) }))
                      }, null, 8, ["modelValue", "options"])
                    ]),
                    i("label", null, [
                      i(
                        "span",
                        null,
                        r(a("life.adapters.direction")),
                        1
                        /* TEXT */
                      ),
                      Oe($e(Ue), {
                        modelValue: q.value.direction,
                        "onUpdate:modelValue": T[1] || (T[1] = (b) => q.value.direction = b),
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
                        r(a("life.adapters.botName")),
                        1
                        /* TEXT */
                      ),
                      P(i(
                        "input",
                        {
                          "onUpdate:modelValue": T[2] || (T[2] = (b) => q.value.name = b),
                          class: "field",
                          placeholder: "napcat"
                        },
                        null,
                        512
                        /* NEED_PATCH */
                      ), [
                        [M, q.value.name]
                      ])
                    ]),
                    i("label", null, [
                      i(
                        "span",
                        null,
                        r(a("life.adapters.wsHost")),
                        1
                        /* TEXT */
                      ),
                      P(i(
                        "input",
                        {
                          "onUpdate:modelValue": T[3] || (T[3] = (b) => q.value.ws_host = b),
                          class: "field",
                          placeholder: "0.0.0.0"
                        },
                        null,
                        512
                        /* NEED_PATCH */
                      ), [
                        [M, q.value.ws_host]
                      ])
                    ]),
                    i("label", null, [
                      i(
                        "span",
                        null,
                        r(a("life.adapters.wsPort")),
                        1
                        /* TEXT */
                      ),
                      P(i(
                        "input",
                        {
                          "onUpdate:modelValue": T[4] || (T[4] = (b) => q.value.ws_port = b),
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
                          M,
                          q.value.ws_port,
                          void 0,
                          { number: !0 }
                        ]
                      ])
                    ]),
                    q.value.direction === "connect" ? (v(), g("label", ds, [
                      i(
                        "span",
                        null,
                        r(a("life.adapters.wsPath")),
                        1
                        /* TEXT */
                      ),
                      P(i("input", {
                        "onUpdate:modelValue": T[5] || (T[5] = (b) => q.value.ws_path = b),
                        class: "field",
                        placeholder: a("life.adapters.wsPathPlaceholder")
                      }, null, 8, hs), [
                        [M, q.value.ws_path]
                      ])
                    ])) : E("v-if", !0),
                    i("label", null, [
                      i(
                        "span",
                        null,
                        r(a("life.adapters.wsToken")),
                        1
                        /* TEXT */
                      ),
                      P(i("input", {
                        "onUpdate:modelValue": T[6] || (T[6] = (b) => q.value.ws_token = b),
                        class: "field",
                        type: "password",
                        placeholder: a("life.adapters.wsTokenPlaceholder")
                      }, null, 8, ps), [
                        [M, q.value.ws_token]
                      ])
                    ]),
                    i("label", null, [
                      i(
                        "span",
                        null,
                        r(a("life.adapters.httpUrl")),
                        1
                        /* TEXT */
                      ),
                      P(i("input", {
                        "onUpdate:modelValue": T[7] || (T[7] = (b) => q.value.http_url = b),
                        class: "field",
                        placeholder: a("life.adapters.httpUrlPlaceholder")
                      }, null, 8, fs), [
                        [M, q.value.http_url]
                      ])
                    ]),
                    i("label", null, [
                      i(
                        "span",
                        null,
                        r(a("life.adapters.accessToken")),
                        1
                        /* TEXT */
                      ),
                      P(i("input", {
                        "onUpdate:modelValue": T[8] || (T[8] = (b) => q.value.access_token = b),
                        class: "field",
                        placeholder: a("life.adapters.accessTokenPlaceholder")
                      }, null, 8, ms), [
                        [M, q.value.access_token]
                      ])
                    ]),
                    i("label", null, [
                      i(
                        "span",
                        null,
                        r(a("life.adapters.configFile")),
                        1
                        /* TEXT */
                      ),
                      P(i(
                        "input",
                        {
                          "onUpdate:modelValue": T[9] || (T[9] = (b) => q.value.config_id = b),
                          class: "field",
                          placeholder: "default"
                        },
                        null,
                        512
                        /* NEED_PATCH */
                      ), [
                        [M, q.value.config_id]
                      ])
                    ]),
                    i("label", null, [
                      i(
                        "span",
                        null,
                        r(a("life.adapters.triggerKeywordsInherit")),
                        1
                        /* TEXT */
                      ),
                      P(i("input", {
                        "onUpdate:modelValue": T[10] || (T[10] = (b) => q.value.trigger_keywords = b),
                        class: "field",
                        placeholder: a("life.adapters.triggerKeywordsPlaceholder")
                      }, null, 8, _s), [
                        [M, q.value.trigger_keywords]
                      ])
                    ])
                  ]),
                  i(
                    "p",
                    vs,
                    r(a("life.adapters.directionHint")),
                    1
                    /* TEXT */
                  ),
                  i("label", gs, [
                    P(i(
                      "input",
                      {
                        "onUpdate:modelValue": T[11] || (T[11] = (b) => q.value.enabled = b),
                        type: "checkbox"
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [me, q.value.enabled]
                    ]),
                    i(
                      "span",
                      null,
                      r(a("life.adapters.enableThisAdapter")),
                      1
                      /* TEXT */
                    )
                  ]),
                  i("label", ys, [
                    P(i(
                      "input",
                      {
                        "onUpdate:modelValue": T[12] || (T[12] = (b) => q.value.observe_group = b),
                        type: "checkbox"
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [me, q.value.observe_group]
                    ]),
                    i(
                      "span",
                      null,
                      r(a("life.adapters.observeGroup")),
                      1
                      /* TEXT */
                    )
                  ]),
                  fn.value.length ? (v(), g(
                    "p",
                    bs,
                    r(a("life.adapters.pendingPlatforms", { names: fn.value.join(a("life.adapters.listSeparator")) })),
                    1
                    /* TEXT */
                  )) : E("v-if", !0),
                  i("div", ws, [
                    i("button", {
                      class: "btn filled sm",
                      disabled: ce.value,
                      onClick: Jt
                    }, r(ce.value ? a("life.adapters.saving") : a("life.adapters.save")), 9, xs),
                    i(
                      "button",
                      {
                        class: "btn sm",
                        onClick: T[13] || (T[13] = (b) => de.value = null)
                      },
                      r(a("life.adapters.cancel")),
                      1
                      /* TEXT */
                    )
                  ])
                ],
                512
                /* NEED_PATCH */
              )) : E("v-if", !0)
            ]),
            _: 1
            /* STABLE */
          }),
          i("article", ks, [
            i(
              "h3",
              null,
              r(a("life.adapters.routesTitle")),
              1
              /* TEXT */
            ),
            i("p", Ps, [
              z(
                r(a("life.adapters.routesHintBefore")),
                1
                /* TEXT */
              ),
              i(
                "b",
                null,
                r(a("life.adapters.routesHintOrder")),
                1
                /* TEXT */
              ),
              z(
                r(a("life.adapters.routesHintAfterOrder")),
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
              z(
                r(a("life.adapters.routesHintMatchAll")),
                1
                /* TEXT */
              ),
              i(
                "code",
                null,
                r(a("life.adapters.routeRegexExample")),
                1
                /* TEXT */
              ),
              z(
                r(a("life.adapters.routesHintAnd")),
                1
                /* TEXT */
              ),
              i(
                "code",
                null,
                r(a("life.adapters.routePrefixExample")),
                1
                /* TEXT */
              ),
              z(
                r(a("life.adapters.routesHintTail")),
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
              z(
                r(a("life.adapters.routesHintSid")),
                1
                /* TEXT */
              )
            ]),
            Oe(Ma, {
              tag: "ol",
              name: "rule-flip",
              class: "feed"
            }, {
              default: Ro(() => [
                (v(!0), g(
                  Q,
                  null,
                  Ee(Fe.value, (b, G) => (v(), g("li", {
                    key: b._key,
                    class: "rule-row"
                  }, [
                    i(
                      "span",
                      Ls,
                      r(G + 1),
                      1
                      /* TEXT */
                    ),
                    i(
                      "code",
                      null,
                      r(b.pattern),
                      1
                      /* TEXT */
                    ),
                    i(
                      "span",
                      Ts,
                      "→ " + r(b.config_id),
                      1
                      /* TEXT */
                    ),
                    i("span", Ss, [
                      i("button", {
                        class: "btn sm",
                        disabled: G === 0,
                        "aria-label": a("life.adapters.moveUp"),
                        title: a("life.adapters.moveUp"),
                        onClick: (ne) => en(G, -1)
                      }, "↑", 8, Cs),
                      i("button", {
                        class: "btn sm",
                        disabled: G === Fe.value.length - 1,
                        "aria-label": a("life.adapters.moveDown"),
                        title: a("life.adapters.moveDown"),
                        onClick: (ne) => en(G, 1)
                      }, "↓", 8, Ms),
                      i("button", {
                        class: "btn sm danger",
                        "aria-label": a("life.adapters.delete"),
                        onClick: (ne) => W(G)
                      }, r(a("life.adapters.delete")), 9, zs)
                    ])
                  ]))),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ]),
              _: 1
              /* STABLE */
            }),
            Fe.value.length ? E("v-if", !0) : (v(), g(
              "p",
              Es,
              r(a("life.adapters.emptyRoutes")),
              1
              /* TEXT */
            )),
            i("div", Os, [
              i("label", null, [
                i(
                  "span",
                  null,
                  r(a("life.adapters.sessionPattern")) + "*",
                  1
                  /* TEXT */
                ),
                P(i("input", {
                  "onUpdate:modelValue": T[14] || (T[14] = (b) => Ce.value.pattern = b),
                  class: "field",
                  placeholder: a("life.adapters.sessionPatternPlaceholder")
                }, null, 8, As), [
                  [M, Ce.value.pattern]
                ])
              ]),
              i("label", null, [
                i(
                  "span",
                  null,
                  r(a("life.adapters.configFile")),
                  1
                  /* TEXT */
                ),
                P(i(
                  "input",
                  {
                    "onUpdate:modelValue": T[15] || (T[15] = (b) => Ce.value.config_id = b),
                    class: "field",
                    placeholder: "default"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [M, Ce.value.config_id]
                ])
              ])
            ]),
            i("div", Is, [
              i(
                "button",
                {
                  class: "btn sm",
                  onClick: Pt
                },
                r(a("life.adapters.addRule")),
                1
                /* TEXT */
              ),
              i("label", Bs, [
                i(
                  "span",
                  null,
                  r(a("life.adapters.defaultConfig")),
                  1
                  /* TEXT */
                ),
                P(i(
                  "input",
                  {
                    "onUpdate:modelValue": T[16] || (T[16] = (b) => Se.value = b),
                    class: "field",
                    placeholder: "default"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [M, Se.value]
                ])
              ]),
              i("button", {
                class: "btn filled sm",
                disabled: Vt.value,
                onClick: $
              }, r(Vt.value ? a("life.adapters.saving") : a("life.adapters.saveRoutes")), 9, Zs)
            ])
          ])
        ],
        64
        /* STABLE_FRAGMENT */
      ))
    ]));
  }
}), Rs = { class: "hero" }, Ds = { class: "hero-main" }, Vs = { class: "hero-copy" }, $s = {
  key: 0,
  class: "dirty-pill"
}, Us = { class: "sub" }, Hs = { class: "hero-actions" }, Fs = ["disabled"], Ws = ["disabled"], Gs = ["disabled"], js = ["disabled"], qs = { class: "state-row" }, Ks = { class: "pill soft" }, Ys = { class: "pill soft" }, Js = { class: "pill soft" }, Xs = {
  key: 0,
  class: "banner err"
}, Qs = {
  key: 1,
  class: "banner ok"
}, er = ["aria-label"], tr = ["onClick"], nr = { class: "tab-ic" }, ir = {
  "data-panel": "persona",
  class: "panel"
}, or = { class: "section-head" }, ar = { class: "desc" }, sr = { class: "head-actions" }, rr = ["disabled"], lr = ["disabled"], ur = { class: "card" }, cr = { class: "settings-grid" }, dr = { class: "pfield" }, hr = { class: "pfield" }, pr = { class: "pfield" }, fr = { class: "pfield" }, mr = { class: "hint" }, _r = {
  key: 0,
  class: "card"
}, vr = { class: "count-pill ok" }, gr = { class: "settings-grid" }, yr = { class: "hint" }, br = {
  key: 0,
  class: "hint"
}, wr = { class: "settings-grid" }, xr = { class: "settings-grid" }, kr = { class: "pdetails" }, Pr = {
  class: "settings-grid",
  style: { "margin-top": "10px" }
}, Lr = { class: "settings-grid" }, Tr = ["value"], Sr = { class: "hint" }, Cr = {
  key: 2,
  class: "hint"
}, Mr = { class: "settings-grid" }, zr = ["value"], Er = { class: "hint" }, Or = {
  key: 4,
  class: "hint"
}, Ar = { class: "settings-grid" }, Ir = ["value"], Br = { class: "hint" }, Zr = {
  key: 6,
  class: "hint"
}, Nr = {
  "data-panel": "cognition",
  class: "panel"
}, Rr = { class: "section-head" }, Dr = { class: "desc" }, Vr = { class: "head-actions" }, $r = ["disabled"], Ur = { class: "card" }, Hr = { class: "settings-grid" }, Fr = { class: "cog-metric" }, Wr = { class: "cog-metric" }, Gr = { class: "cog-metric" }, jr = { class: "cog-metric" }, qr = { class: "cog-metric" }, Kr = { class: "cog-metric" }, Yr = {
  key: 0,
  class: "hint"
}, Jr = {
  key: 1,
  class: "hint"
}, Xr = {
  key: 2,
  class: "hint"
}, Qr = { style: { display: "flex", gap: "12px", "align-items": "center", "flex-wrap": "wrap", "margin-top": "10px" } }, el = { class: "sw" }, tl = ["disabled"], nl = { class: "hint" }, il = { class: "card" }, ol = {
  key: 0,
  class: "count-pill sync-pill"
}, al = {
  key: 0,
  class: "empty"
}, sl = { class: "sub-label" }, rl = { class: "hint" }, ll = { class: "at-a-glance" }, ul = ["aria-label"], cl = { class: "plot-label plot-n" }, dl = { class: "plot-label plot-s" }, hl = { class: "plot-label plot-w" }, pl = { class: "plot-label plot-e" }, fl = {
  class: "mood-plot",
  viewBox: "0 0 120 120",
  "aria-hidden": "true"
}, ml = ["cx", "cy"], _l = ["cx", "cy"], vl = { class: "plot-quadrant" }, gl = { class: "glance-col" }, yl = { class: "glance-title" }, bl = ["title"], wl = { class: "gauge-head" }, xl = { class: "gauge-name" }, kl = { class: "gauge-alias" }, Pl = { class: "gauge-val" }, Ll = { class: "gauge-effect" }, Tl = { class: "glance-col" }, Sl = { class: "glance-title" }, Cl = ["title"], Ml = { class: "gauge-head" }, zl = { class: "gauge-name" }, El = { class: "gauge-alias" }, Ol = { class: "gauge-val" }, Al = { class: "gauge-effect" }, Il = { class: "sub-label" }, Bl = { class: "hint" }, Zl = { class: "gauge-grid" }, Nl = ["title"], Rl = { class: "gauge-head" }, Dl = { class: "gauge-name" }, Vl = { class: "gauge-alias" }, $l = { class: "gauge-val" }, Ul = { class: "gauge-effect" }, Hl = {
  key: 0,
  class: "som-channels"
}, Fl = { class: "som-chan-name" }, Wl = { class: "som-chan-bar" }, Gl = { class: "som-chan-val" }, jl = {
  key: 0,
  class: "hint"
}, ql = { class: "sub-label" }, Kl = { class: "hint" }, Yl = { class: "gauge-grid" }, Jl = ["title"], Xl = { class: "gauge-head" }, Ql = { class: "gauge-name" }, eu = { class: "gauge-alias" }, tu = { class: "gauge-val" }, nu = { class: "gauge-effect" }, iu = { class: "chip-row" }, ou = { class: "chip muted" }, au = { class: "chip muted" }, su = { class: "sub-label" }, ru = { class: "hint" }, lu = { class: "chip-row" }, uu = { class: "chip" }, cu = { class: "chip muted" }, du = { class: "chip muted" }, hu = { class: "gauge-grid" }, pu = ["title"], fu = { class: "gauge-head" }, mu = { class: "gauge-name" }, _u = { class: "gauge-alias" }, vu = { class: "gauge-val" }, gu = { class: "gauge-effect" }, yu = { class: "sub-label" }, bu = { class: "hint" }, wu = { class: "chip-row" }, xu = { class: "chip" }, ku = { class: "gauge-grid" }, Pu = ["title"], Lu = { class: "gauge-head" }, Tu = { class: "gauge-name" }, Su = { class: "gauge-alias" }, Cu = { class: "gauge-val" }, Mu = { class: "gauge-effect" }, zu = { class: "sub-label" }, Eu = { class: "hint" }, Ou = { class: "chip-row" }, Au = { class: "chip" }, Iu = { class: "chip muted" }, Bu = { class: "gauge-grid" }, Zu = ["title"], Nu = { class: "gauge-head" }, Ru = { class: "gauge-name" }, Du = { class: "gauge-alias" }, Vu = { class: "gauge-val" }, $u = { class: "gauge-effect" }, Uu = { class: "sub-label" }, Hu = { class: "hint" }, Fu = { class: "chip-row" }, Wu = { class: "chip" }, Gu = { class: "chip muted" }, ju = {
  key: 0,
  class: "chip muted"
}, qu = {
  key: 1,
  class: "chip warn"
}, Ku = { class: "gauge-grid" }, Yu = ["title"], Ju = { class: "gauge-head" }, Xu = { class: "gauge-name" }, Qu = { class: "gauge-alias" }, ec = { class: "gauge-val" }, tc = { class: "gauge-effect" }, nc = { class: "pdetails" }, ic = {
  class: "settings-grid",
  style: { "margin-top": "10px" }
}, oc = {
  key: 0,
  class: "cog-metric"
}, ac = {
  key: 1,
  class: "cog-metric"
}, sc = {
  key: 2,
  class: "cog-metric"
}, rc = {
  key: 3,
  class: "cog-metric"
}, lc = {
  key: 4,
  class: "cog-metric"
}, uc = {
  key: 5,
  class: "cog-metric"
}, cc = {
  key: 6,
  class: "cog-metric"
}, dc = {
  key: 7,
  class: "cog-metric"
}, hc = { class: "pdetails" }, pc = {
  class: "settings-grid",
  style: { "margin-top": "10px" }
}, fc = { class: "cog-metric" }, mc = { class: "cog-metric" }, _c = { class: "cog-metric" }, vc = { class: "cog-metric" }, gc = { class: "cog-metric" }, yc = { class: "cog-metric" }, bc = { class: "cog-metric" }, wc = { class: "cog-metric" }, xc = { class: "cog-metric" }, kc = { class: "cog-metric" }, Pc = { class: "cog-metric" }, Lc = { class: "cog-metric" }, Tc = {
  key: 0,
  class: "cog-metric"
}, Sc = {
  key: 2,
  class: "hint"
}, Cc = {
  key: 3,
  class: "hint"
}, Mc = {
  key: 4,
  class: "hint"
}, zc = {
  key: 5,
  class: "hint"
}, Ec = {
  key: 6,
  class: "hint"
}, Oc = { class: "card" }, Ac = { class: "switches" }, Ic = { class: "sw" }, Bc = { class: "sw" }, Zc = { class: "sw" }, Nc = { class: "sw" }, Rc = { class: "sw" }, Dc = { class: "sw" }, Vc = { class: "hint" }, $c = { class: "card" }, Uc = { class: "hint" }, Hc = { class: "preset-row" }, Fc = ["onClick"], Wc = { class: "grid2" }, Gc = { class: "card" }, jc = { class: "settings-grid" }, qc = { class: "def-hint" }, Kc = { class: "def-hint" }, Yc = { class: "def-hint" }, Jc = { class: "def-hint" }, Xc = { class: "def-hint" }, Qc = { class: "def-hint" }, ed = { class: "def-hint" }, td = { class: "def-hint" }, nd = { class: "def-hint" }, id = { class: "switches" }, od = { class: "sw" }, ad = { class: "sw" }, sd = { class: "sw" }, rd = { class: "sw" }, ld = { class: "sw" }, ud = { class: "card" }, cd = { class: "settings-grid" }, dd = { class: "def-hint" }, hd = { class: "def-hint" }, pd = { class: "def-hint" }, fd = { class: "sw" }, md = { class: "sw" }, _d = { class: "sw" }, vd = { class: "card" }, gd = { class: "settings-grid" }, yd = { class: "sw" }, bd = { class: "card" }, wd = { class: "settings-grid" }, xd = { class: "sw" }, kd = { class: "card" }, Pd = { class: "settings-grid" }, Ld = { class: "sw" }, Td = { class: "card" }, Sd = { class: "hint" }, Cd = { class: "sw" }, Md = { class: "settings-grid" }, zd = { class: "hint" }, Ed = { class: "card" }, Od = { class: "hint" }, Ad = { class: "sw" }, Id = { class: "settings-grid" }, Bd = { class: "hint" }, Zd = { class: "card" }, Nd = { class: "hint" }, Rd = { class: "sw" }, Dd = { class: "settings-grid" }, Vd = { class: "hint" }, $d = { class: "card" }, Ud = { class: "hint" }, Hd = { class: "sw" }, Fd = { class: "settings-grid" }, Wd = { class: "hint" }, Gd = { class: "hint" }, jd = { class: "card" }, qd = { class: "hint" }, Kd = { class: "switches" }, Yd = { class: "sw" }, Jd = { class: "sw" }, Xd = { class: "sw" }, Qd = { class: "sw" }, eh = {
  "data-panel": "world",
  class: "panel"
}, th = { class: "section-head" }, nh = { class: "desc" }, ih = { class: "head-actions" }, oh = { class: "card" }, ah = { class: "settings-grid" }, sh = { class: "hint" }, rh = { class: "card" }, lh = { class: "hint" }, uh = { class: "world-field" }, ch = { class: "world-label" }, dh = ["placeholder"], hh = { class: "card" }, ph = { class: "hint" }, fh = { class: "settings-grid" }, mh = ["placeholder"], _h = ["placeholder"], vh = ["placeholder"], gh = { class: "world-field" }, yh = { class: "world-label" }, bh = ["placeholder"], wh = { class: "world-field" }, xh = { class: "world-label" }, kh = ["placeholder"], Ph = { class: "world-field" }, Lh = { class: "world-label" }, Th = ["placeholder"], Sh = { class: "world-actions" }, Ch = ["disabled"], Mh = ["disabled"], zh = { class: "hint" }, Eh = { class: "card" }, Oh = { class: "wm-head" }, Ah = { class: "count-pill" }, Ih = {
  key: 0,
  class: "wm-place"
}, Bh = {
  key: 0,
  class: "hint wm-premise"
}, Zh = { class: "wm-map-wrap" }, Nh = {
  key: 0,
  class: "wm-offline"
}, Rh = {
  key: 1,
  class: "wm-compass",
  "aria-hidden": "true"
}, Dh = {
  key: 1,
  class: "empty"
}, Vh = {
  key: 2,
  class: "wm-legend"
}, $h = {
  key: 3,
  class: "wm-routes"
}, Uh = {
  key: 0,
  class: "wm-routes-col"
}, Hh = {
  key: 1,
  class: "wm-routes-col"
}, Fh = { class: "card" }, Wh = { class: "wm-head" }, Gh = { class: "count-pill" }, jh = { class: "feed" }, qh = { class: "meta" }, Kh = {
  key: 0,
  class: "empty"
}, Yh = {
  "data-panel": "adapters",
  class: "panel"
}, Jh = {
  "data-panel": "state",
  class: "panel"
}, Xh = { class: "section-head" }, Qh = { class: "desc" }, ep = { class: "card" }, tp = { class: "count-pill" }, np = { class: "hint" }, ip = { class: "feed" }, op = { class: "rel-head" }, ap = { class: "meta" }, sp = { class: "rel-track-row" }, rp = { class: "rel-track-label" }, lp = ["aria-label"], up = { class: "rel-stage-name" }, cp = ["title"], dp = { class: "gauge-head" }, hp = { class: "gauge-name" }, pp = { class: "gauge-alias" }, fp = { class: "gauge-val" }, mp = { class: "gauge-bar signed" }, _p = { class: "gauge-effect" }, vp = {
  key: 0,
  class: "rel-mode"
}, gp = { class: "chip" }, yp = { class: "meta" }, bp = {
  key: 0,
  class: "empty"
}, wp = { class: "card" }, xp = { class: "count-pill" }, kp = { class: "hint" }, Pp = { class: "feed" }, Lp = { class: "meta" }, Tp = {
  key: 0,
  class: "empty"
}, Sp = { class: "grid2" }, Cp = { class: "card" }, Mp = { class: "hint" }, zp = { class: "feed" }, Ep = { class: "meta" }, Op = { class: "meta" }, Ap = { class: "meta" }, Ip = {
  key: 0,
  class: "empty"
}, Bp = { class: "card" }, Zp = { class: "hint" }, Np = { class: "feed" }, Rp = { class: "value-name" }, Dp = { class: "value-bar" }, Vp = { class: "value-num" }, $p = {
  key: 0,
  class: "empty"
}, Up = { class: "section" }, Hp = { class: "section-head" }, Fp = { class: "desc" }, Wp = { class: "grid2" }, Gp = { class: "card" }, jp = { class: "hint" }, qp = {
  class: "hint",
  style: { "margin-top": "10px" }
}, Kp = { style: { "margin-top": "14px", display: "flex", gap: "10px", "flex-wrap": "wrap" } }, Yp = ["disabled"], Ho = 0.15, Jp = "https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}", Xp = /* @__PURE__ */ Fo({
  __name: "CompanionPage",
  setup(_e) {
    const { confirm: y } = Wo(), a = (d, u) => Wi.global.t(d, u ?? {}), Be = za(), O = (d) => Wi.global.t(d, {}, { locale: "zh" }), He = (d) => d.map((u) => ({ value: u, label: a(`life.companion.${u}`) })), N = F({ settings: {}, cognition: null }), Le = F(!1), K = F(""), Xe = F(""), ce = F("cognition"), de = F(null), q = [
      { key: "cognition", i: "01", labelKey: "life.companion.nav.cognition", icon: "◉" },
      { key: "persona", i: "02", labelKey: "life.companion.nav.persona", icon: "✎" },
      { key: "world", i: "03", labelKey: "life.companion.nav.world", icon: "✦" },
      { key: "adapters", i: "04", labelKey: "life.companion.nav.adapters", icon: "✉" },
      { key: "state", i: "05", labelKey: "life.companion.nav.state", icon: "☺" }
    ];
    function Te(d) {
      Xe.value = d, setTimeout(() => {
        Xe.value === d && (Xe.value = "");
      }, jo);
    }
    async function Ze(d = 0) {
      Le.value = !0, K.value = "";
      try {
        N.value = await $o("/api/life/companion"), ut(), Le.value = !1;
      } catch (u) {
        if (d < 4)
          return await Go(1500), Ze(d + 1);
        K.value = Kt(u), Le.value = !1;
      }
    }
    async function ee(d, u) {
      try {
        const l = await Zt(d, u);
        return await Ze(), l;
      } catch (l) {
        return K.value = Kt(l), null;
      }
    }
    function Yt(d) {
      ce.value = d;
      const u = matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", l = de.value;
      l ? l.scrollTo({ top: 0, behavior: u }) : window.scrollTo({ top: 0, behavior: u });
    }
    function fn(d) {
      const u = de.value?.querySelector(`section[data-panel="${d}"]`);
      u && (u.classList.remove("panel-replay"), u.offsetWidth, u.classList.add("panel-replay"), u.addEventListener("animationend", () => u.classList.remove("panel-replay"), { once: !0 }));
    }
    pn(ce, (d) => {
      Fi(() => fn(d));
    }), pn(ce, (d) => {
      d === "adapters" && Si();
    });
    const ge = {
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
    }, Ne = [
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
    ], Nt = ["cog_affect_profile", "cog_language_framing", "cog_attachment_type", "cog_tsundere_type", "cog_yandere_type", "cog_personadyn_type", "cog_personadyn_gender"], Rt = A(() => He(["attach.secluded", "attach.dependent", "attach.delusional", "attach.monitoring", "attach.selfHarm", "attach.exclusion"])), Jt = A(() => He(["tsundere.classic", "tsundere.cold", "tsundere.gruff", "tsundere.indulgent"])), mn = A(() => He(["yandere.mode.yandere", "yandere.mode.tsundere", "yandere.mode.neutral", "yandere.mode.hybrid"])), Dt = [
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
    A(() => Dt.map((d, u) => ({ label: a(`life.companion.pdg.${u}`), keys: d })));
    const Xt = A(() => [...new Set(Dt.flat())].map((d) => ({ value: d, label: a(`life.companion.${d}`) }))), Fe = A(() => He(["pdGender.unspecified", "pdGender.maleScript", "pdGender.femaleScript", "pdGender.neutral", "pdGender.highTradMale", "pdGender.lowTradMale", "pdGender.highTradFemale", "pdGender.feminist"])), Se = A(() => ["typical", "depression", "anxiety", "bpd", "alexithymia"].map((d) => ({ value: d, label: a(`life.companion.profile.${d}`) }))), Ce = A(() => [
      "independent",
      "interchanging",
      "cognitive_determinism",
      "weak_whorf",
      "thinking_for_speaking",
      "radical_connectionism",
      "determinism"
    ].map((d) => ({ value: d, label: a(`life.companion.framing.${d}`) }))), Vt = ["egocentric", "subjective", "self-reflective", "mutual", "societal-symbolic"], Qe = A(() => Vt.map((d, u) => ({ value: String(u), label: a(`life.companion.stage.${d}`) }))), Qt = A({
      get: () => String(Number(_.value.cog_social_stage ?? 2)),
      set: (d) => {
        _.value.cog_social_stage = Number(d);
      }
    }), We = {
      cog_attachment_type: ["attach.secluded", "attach.dependent", "attach.delusional", "attach.monitoring", "attach.selfHarm", "attach.exclusion"],
      cog_tsundere_type: ["tsundere.classic", "tsundere.cold", "tsundere.gruff", "tsundere.indulgent"],
      cog_yandere_type: ["yandere.mode.yandere", "yandere.mode.tsundere", "yandere.mode.neutral", "yandere.mode.hybrid"],
      cog_personadyn_type: [...new Set(Dt.flat())],
      cog_personadyn_gender: ["pdGender.unspecified", "pdGender.maleScript", "pdGender.femaleScript", "pdGender.neutral", "pdGender.highTradMale", "pdGender.lowTradMale", "pdGender.highTradFemale", "pdGender.feminist"]
    };
    function Pt(d) {
      const u = String(N.value.settings?.[d] ?? ge[d] ?? ""), l = We[d];
      return l && !l.includes(u) ? l.find((C) => O(`life.companion.${C}`) === u) ?? u : u;
    }
    function W(d) {
      const u = String(d ?? "");
      return O(`life.companion.${u}`) !== `life.companion.${u}` ? O(`life.companion.${u}`) : u;
    }
    function en() {
      const d = {};
      for (const [u, l] of Object.entries(ge)) {
        const B = Pt(u) || l;
        d[u] = Ne.includes(u) ? B === "1" : Nt.includes(u) ? B : Number(B);
      }
      return d;
    }
    function $() {
      const d = {};
      for (const [u, l] of Object.entries(ge)) {
        const B = _.value[u];
        Ne.includes(u) ? d[u] = B ? "1" : "0" : d[u] = String(B ?? l);
      }
      return d;
    }
    const m = A(() => N.value.cognition || null), T = A(() => m.value?.last_control || null), b = A(() => m.value?.wave1 || null), G = A(() => m.value?.wave2 || null), ne = A(() => m.value?.wave3 || null), ie = A(() => m.value?.wave4a || null), et = A(() => m.value?.wave4b || null), je = A(() => m.value?.persona || null), Re = A(() => m.value?.attachment || null), Ae = A(() => m.value?.tsundere || null), qe = A(() => m.value?.yandere || null), V = A(() => m.value?.personadyn || null), Dn = A(() => {
      const d = V.value?.big5;
      return d ? ["o_open", "c_conscientious", "e_extravert", "a_agreeable", "n_neurotic"].map((l) => ke(d[l], 2)).join(" · ") : "—";
    }), Gi = A(() => {
      const d = V.value?.hexaco;
      return d ? ["h_honesty", "hex_e", "hex_x", "hex_a", "hex_c", "hex_o"].map((l) => ke(d[l], 2)).join(" · ") : "—";
    });
    function Vn(d, u = 3) {
      return d ? Object.entries(d).filter(([, l]) => typeof l == "number").sort((l, B) => B[1] - l[1]).slice(0, u).map(([l, B]) => `${fi(l)} ${ke(B, 2)}`) : [];
    }
    const $n = A(() => Vn(V.value?.desires, 3)), _n = A(() => Vn(V.value?.emotions, 3)), vn = A(() => {
      const d = V.value?.learning?.theta_drift;
      return d ? Object.values(d).reduce((u, l) => u + Math.abs(l || 0), 0) : 0;
    }), gt = A(() => G.value?.episode || null), hi = (d) => {
      const u = { euthymic: "life.companion.episode.euthymic", subthreshold: "life.companion.episode.subthreshold", episode: "life.companion.episode.episode" };
      return u[d] ? a(u[d]) : "—";
    }, ye = A(() => m.value?.life || null), pt = F(!1), gn = F("start"), Un = F(!0);
    function ji() {
      const d = ye.value?.born_at;
      if (!d) return "—";
      const u = Date.now() - new Date(d).getTime();
      if (!isFinite(u) || u < 0) return "—";
      const l = Math.floor(u / 864e5), B = Math.floor(u % 864e5 / 36e5);
      return l > 0 ? a("life.companion.life.ageDaysHours", { days: l, hours: B }) : a("life.companion.life.ageHours", { hours: B });
    }
    function yn() {
      return gn.value === "start" ? a("life.companion.life.starting") : a("life.companion.life.pausing");
    }
    async function Hn() {
      pt.value = !0, gn.value = "start";
      try {
        const d = await ee("life_start", { greet: Un.value });
        d && Te(d.greeting ? a("life.companion.flash.lifeStartedGreeting", { greeting: d.greeting }) : a("life.companion.flash.lifeStarted"));
      } finally {
        pt.value = !1;
      }
    }
    async function Fn() {
      pt.value = !0, gn.value = "stop";
      try {
        await ee("life_stop", {}) && Te(a("life.companion.flash.lifeStopped"));
      } finally {
        pt.value = !1;
      }
    }
    function qi(d, u) {
      Object.assign(_.value, d), Me().then(() => Te(a("life.companion.flash.presetApplied", { label: u })));
    }
    const pi = [
      { labelKey: "life.companion.preset.regular", fields: { cog_affect_enabled: !0, cog_affect_profile: "typical", cog_affect_threat: 0.2, cog_affect_reward: 1, cog_attachment_enabled: !1, cog_tsundere_enabled: !1, cog_personadyn_enabled: !1 } },
      { labelKey: "life.companion.preset.depression", fields: { cog_affect_enabled: !0, cog_affect_profile: "depression", cog_affect_threat: 0.45, cog_affect_reward: 0.7 } },
      { labelKey: "life.companion.preset.tsundere", fields: { cog_tsundere_enabled: !0, cog_tsundere_type: "tsundere.classic" } },
      { labelKey: "life.companion.preset.personadyn", fields: { cog_personadyn_enabled: !0, cog_personadyn_type: "pdt.1" } },
      { labelKey: "life.companion.preset.yandereSecluded", fields: { cog_affect_enabled: !0, cog_affect_profile: "depression", cog_attachment_enabled: !0, cog_attachment_type: "attach.secluded" } },
      { labelKey: "life.companion.preset.yandereDependent", fields: { cog_affect_enabled: !0, cog_attachment_enabled: !0, cog_attachment_type: O("life.companion.attach.dependent") } },
      { labelKey: "life.companion.preset.yandereDelusional", fields: { cog_affect_enabled: !0, cog_affect_profile: "depression", cog_attachment_enabled: !0, cog_attachment_type: O("life.companion.attach.delusional") } }
    ], Wn = A(() => m.value?.wave2?.somatic_channels || null), fi = (d) => {
      const u = { fatigue: "channel.fatigue", pain: "channel.pain", cardiorespiratory: "channel.cardiorespiratory", gastrointestinal: "channel.gastrointestinal", dizziness: "channel.dizziness", sleep: "channel.sleep" };
      return u[d] ? a(`life.companion.${u[d]}`) : d;
    }, mi = (d) => Math.max(0.02, Math.min(1, Number(d))).toFixed(3), Gn = A(() => {
      const d = je.value?.evidence || {};
      return Object.entries(d).map(([u, l]) => a("life.companion.evidencePair", { dim: u, words: l.join(a("life.companion.listSeparator")) })).join(a("life.companion.evidenceSeparator"));
    });
    function ke(d, u = 3) {
      return d == null || d === "" ? "—" : Number(d).toFixed(u);
    }
    const bn = A(() => (N.value.timeline || []).filter((d) => d.topic === O("life.companion.val.world")).slice(0, 30)), Lt = A(() => N.value.commitments || []), _i = A(() => N.value.user_model || []), vi = A(() => Object.entries(N.value.values || {}).map(([d, u]) => ({ k: d, v: Number(u) })).sort((d, u) => Math.abs(u.v) - Math.abs(d.v)).slice(0, 20));
    function wn(d) {
      try {
        const u = JSON.parse(d || "[]");
        return Array.isArray(u) ? u : [];
      } catch {
        return [];
      }
    }
    const tn = A(() => N.value.emotion || null), Tt = A(() => N.value.circadian || null), jn = A(() => N.value.relationships || []), xn = (d) => Math.max(0, Math.min(1, d)), kn = A(() => {
      const d = tn.value || {}, u = Math.max(-1, Math.min(1, Number(d.valence) || 0)), l = xn(Number(d.arousal ?? 0.5));
      return { x: (10 + (u + 1) / 2 * 100).toFixed(1), y: (110 - l * 100).toFixed(1) };
    }), gi = A(() => {
      const d = tn.value;
      if (!d) return "life.companion.quadrant.serene";
      const u = Number(d.valence) >= 0, l = Number(d.arousal) >= 0.5;
      return u ? l ? "life.companion.quadrant.excited" : "life.companion.quadrant.serene" : l ? "life.companion.quadrant.tense" : "life.companion.quadrant.gloomy";
    }), yi = (d) => d <= -Ho ? "lo" : d >= Ho ? "hi" : "mid";
    function he(d, u, l, B) {
      const C = Number(l);
      if (!isFinite(C)) return null;
      const oe = xn(C / B.max), pe = B.signed ? yi(C) : oe < 0.34 ? "lo" : oe < 0.67 ? "mid" : "hi", we = {
        label: u,
        value: C,
        max: B.max,
        kind: B.kind,
        signed: !!B.signed,
        effect: a(`life.companion.effect.${d}`),
        display: ke(C, 2),
        alias: a(`life.companion.alias.${d}`),
        state: a(`life.companion.gw.${d}.${pe}`),
        stateTone: "mid"
      };
      return we.stateTone = we.signed ? we.value >= 0 ? "good" : "bad" : ft(we), we;
    }
    function tt(d) {
      return xn(d.value / d.max);
    }
    function ft(d) {
      const u = tt(d);
      return d.kind === "neutral" ? "mid" : d.kind === "bad" ? u >= 0.67 ? "bad" : u < 0.34 ? "good" : "mid" : u >= 0.67 ? "good" : u < 0.34 ? "bad" : "mid";
    }
    function at(d) {
      const u = xn(Math.abs(d)) * 50;
      return { width: `${u}%`, left: d >= 0 ? "50%" : `${50 - u}%` };
    }
    const yt = (d) => d.filter((u) => u !== null), Ki = A(() => {
      const d = tn.value || {};
      return yt([
        he("valence", a("life.companion.gauge.valence"), d.valence, { max: 1, kind: "neutral", signed: !0 }),
        he("arousal", a("life.companion.gauge.arousal"), d.arousal, { max: 1, kind: "neutral" }),
        he("connection", a("life.companion.gauge.connection"), d.connection, { max: 1, kind: "good" }),
        he("irritation", a("life.companion.gauge.irritation"), d.irritation, { max: 1, kind: "bad" })
      ]);
    }), st = A(() => {
      const d = Tt.value || {};
      return yt([
        he("energy", a("life.companion.body.energy"), d.mental_energy, { max: 100, kind: "good" }),
        he("hunger", a("life.companion.body.hunger"), d.hunger, { max: 100, kind: "bad" }),
        he("health", a("life.companion.body.health"), d.health, { max: 100, kind: "good" })
      ]);
    }), Z = A(() => yt([
      he("mood", a("life.companion.gauge.mood"), G.value?.mood, { max: 1, kind: "neutral", signed: !0 }),
      he("vagal", a("life.companion.gauge.vagal"), G.value?.vagal_tone, { max: 1, kind: "good" }),
      he("somatization", a("life.companion.gauge.somatization"), G.value?.somatization_index, { max: 1, kind: "bad" }),
      he("healthAnxiety", a("life.companion.gauge.healthAnxiety"), G.value?.health_anxiety, { max: 1, kind: "bad" }),
      he("somaticBurden", a("life.companion.gauge.somaticBurden"), G.value?.somatic_burden, { max: 1, kind: "bad" }),
      he("allostatic", a("life.companion.gauge.allostatic"), G.value?.allostatic_load, { max: 1, kind: "bad" }),
      he("loneliness", a("life.companion.gauge.loneliness"), G.value?.loneliness, { max: 1, kind: "bad" })
    ])), bi = A(() => yt([
      he("empathy", a("life.companion.gauge.empathy"), ie.value?.empathy, { max: 1, kind: "good" }),
      he("patience", a("life.companion.gauge.patience"), et.value?.patience, { max: 1, kind: "good" })
    ])), wi = A(() => yt([
      he("distress", a("life.companion.gauge.distress"), Re.value?.distress, { max: 1, kind: "bad" }),
      he("comorbid", a("life.companion.gauge.comorbid"), Re.value?.comorbid_depression, { max: 1, kind: "bad" })
    ])), xi = A(() => yt([
      he("affection", a("life.companion.gauge.affection"), Ae.value?.affection, { max: 1, kind: "good" }),
      he("tsun", a("life.companion.gauge.tsun"), Ae.value?.expression, { max: 1, kind: "neutral" }),
      he("fixation", a("life.companion.gauge.fixation"), Ae.value?.fixation, { max: 1, kind: "bad" })
    ])), ki = A(() => yt([
      he("jealousy", a("life.companion.gauge.jealousy"), qe.value?.jealousy, { max: 1, kind: "bad" }),
      he("intensity", a("life.companion.gauge.intensity"), qe.value?.intensity, { max: 1, kind: "neutral" }),
      he("darkness", a("life.companion.gauge.darkness"), qe.value?.darkness, { max: 1, kind: "bad" })
    ])), qn = A(() => yt([
      he("pdPressure", a("life.companion.gauge.pdPressure"), V.value?.pressure, { max: 1, kind: "bad" }),
      he("pdAffection", a("life.companion.gauge.pdAffection"), V.value?.affection, { max: 1, kind: "good" }),
      he("pdAnxiety", a("life.companion.gauge.pdAnxiety"), V.value?.anxiety, { max: 1, kind: "bad" }),
      he("pdPossession", a("life.companion.gauge.pdPossession"), V.value?.possessiveness, { max: 1, kind: "bad" }),
      he("pdTrust", a("life.companion.gauge.pdTrust"), V.value?.trust, { max: 1, kind: "good" }),
      he("pdSelfControl", a("life.companion.gauge.pdSelfControl"), V.value?.self_control, { max: 1, kind: "good" }),
      he("pdSuppression", a("life.companion.gauge.pdSuppression"), V.value?.suppression, { max: 1, kind: "bad" })
    ])), Pn = ["警惕", "疏离", "陌生", "认识", "熟悉", "友好", "亲近", "亲密"], St = ["回避", "受伤", "放松", "活泼", "温暖", "亲近", "爱意"], Kn = (d) => Pn.includes(d) ? a(`life.companion.relStage.${d}`) : d || "—", Pi = (d) => Pn.indexOf(d), Yi = (d) => St.includes(d) ? a(`life.companion.interaction.${d}`) : d || "—", Ji = (d) => St.includes(d) ? a(`life.companion.interactionEffect.${d}`) : "", _ = F({}), $t = F("off"), Xi = A(() => [
      { value: "off", label: a("life.companion.worldDensity.off") },
      { value: "texture", label: a("life.companion.worldDensity.texture") },
      { value: "full", label: a("life.companion.worldDensity.full") }
    ]), bt = F("fictional"), nn = F(""), on = F(""), an = F(""), sn = F(""), rn = F(""), Ct = F(""), mt = F(""), nt = F(!1), ln = F(!1), un = A(() => [
      { value: "fictional", label: a("life.companion.worldFictional.fictional") },
      { value: "real", label: a("life.companion.worldFictional.real") }
    ]), Y = A(() => N.value.worldview || null), I = A(() => Y.value?.map || { locations: [], edges: [], actors: [], width: 1e3, height: 700, title: "" }), Ln = A(() => Y.value?.actor_locations || {}), Ut = ["home", "work", "shop", "food", "park", "transit", "other"], Ht = { home: "life.companion.kind.home", work: "life.companion.kind.work", shop: "life.companion.kind.shop", food: "life.companion.kind.food", park: "life.companion.kind.park", transit: "life.companion.kind.transit", other: "life.companion.kind.other" }, Tn = { home: "#e07a5f", work: "#5b8def", shop: "#e0a23d", food: "#57a773", park: "#3faead", transit: "#8b6fd6", other: "#8a94a6" }, J = A(() => Ut.filter((d) => (I.value.locations || []).some((u) => (u.kind || "other") === d)));
    function re(d) {
      const u = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
      return String(d ?? "").replace(/[&<>"']/g, (l) => u[l]);
    }
    const Ft = F(null), wt = F(!1);
    let le = null, U = null, Wt = "";
    const xt = ["#2b4250", "#33495a", "#2f4a44", "#3a4258", "#463f4f", "#3d4a3a", "#4a4436", "#39485c"], Pe = ["#dfe4ea", "#d6dce4", "#e6eaf0", "#cfd7e0"];
    let it = "";
    const rt = F("city"), lt = {};
    function cn(d, u, l) {
      (lt[d] || (lt[d] = [])).push({ layer: u, base: l });
    }
    function Ke(d) {
      it = it === d ? "" : d;
      for (const [u, l] of Object.entries(lt)) {
        const B = u === it;
        for (const { layer: C, base: oe } of l)
          C.setStyle && C.setStyle({ ...oe, weight: (oe.weight || 2) + (B ? 3.5 : 0), opacity: B ? 1 : oe.opacity ?? 1 }), B && C.bringToFront && C.bringToFront();
      }
    }
    function Yn() {
      it = "", j(!1);
    }
    function Jn() {
      rt.value = rt.value === "city" ? "nation" : "city", j(!1);
    }
    function Mt() {
      return { w: I.value.width || 1e3, h: I.value.height || 700 };
    }
    function De(d, u) {
      return [Mt().h - u, d];
    }
    function Ye(d, u) {
      return R.divIcon({ className: "wm-route", html: `<span class="wm-route-inner" style="--c:${u}">${re(d)}</span>`, iconSize: [0, 0], iconAnchor: [0, 0] });
    }
    function Sn(d, u) {
      return R.divIcon({ className: "wm-route wm-minor", html: `<span class="wm-route-inner" style="--c:${u}">${re(d)}</span>`, iconSize: [0, 0], iconAnchor: [0, 0] });
    }
    function Li(d, u) {
      return R.divIcon({ className: "wm-route wm-station", html: `<span class="wm-route-inner" style="--c:${u}">${re(d)}</span>`, iconSize: [0, 0], iconAnchor: [0, 0] });
    }
    function Cn(d) {
      const u = [], l = [];
      for (const B of d) {
        const C = String(B.text).length * 13 + 20, oe = 22;
        u.some((we) => Math.abs(we.x - B.x) < (we.w + C) / 2 && Math.abs(we.y - B.y) < (we.h + oe) / 2) || (u.push({ x: B.x, y: B.y, w: C, h: oe }), l.push(B));
      }
      return l;
    }
    function Qi() {
      const d = I.value.kind === "real" ? "real" : "fictional";
      if (le && Wt !== d && (le.remove(), le = null, U = null), !(le || !Ft.value)) {
        if (d === "real") {
          wt.value = !1, le = R.map(Ft.value, { zoomControl: !0, attributionControl: !0 }).setView([35, 105], 5);
          const u = R.tileLayer(Jp, { subdomains: ["1", "2", "3", "4"], maxZoom: 19, minZoom: 3, attribution: a("life.companion.map.attribution") });
          u.on("tileerror", () => {
            wt.value = !0;
          }), u.on("load", () => {
            wt.value = !1;
          }), u.addTo(le);
        } else {
          wt.value = !1;
          const { w: u, h: l } = Mt();
          le = R.map(Ft.value, { crs: R.CRS.Simple, zoomControl: !0, attributionControl: !1, minZoom: -3, maxZoom: 3 }).setView([l / 2, u / 2], -1.5);
          for (const [C, oe] of [["pWater", 350], ["pParks", 360], ["pBlocks", 370], ["pRoads", 380], ["pMetro", 400], ["pBus", 410], ["pLabels", 620]])
            le.createPane(C), le.getPane(C).style.zIndex = String(oe);
          const B = () => le.getContainer().classList.toggle("wm-zoom-low", le.getZoom() < 0);
          le.on("zoomend", B), setTimeout(B, 0);
        }
        Wt = d, U = R.layerGroup().addTo(le);
      }
    }
    function j(d = !1) {
      if (!le || !U) return;
      U.clearLayers();
      for (const C of Object.keys(lt)) delete lt[C];
      it = "";
      const u = I.value.locations || [];
      if (!u.length) return;
      const l = Wt !== "real", B = {};
      for (const C of u) B[C.id] = C;
      if (l) {
        const { w: C, h: oe } = Mt(), pe = (x) => x.map((ae) => De(ae[0], ae[1])), we = I.value.nation;
        if (rt.value === "nation" && we) {
          R.rectangle([[0, 0], [oe, C]], { pane: "pWater", stroke: !1, fillColor: "#d9e6f0", fillOpacity: 1 }).addTo(U), R.polygon(pe(we.land), { pane: "pWater", color: "#8fbfe6", weight: 1.5, fillColor: "#f4efe1", fillOpacity: 1 }).addTo(U), (we.provinces || []).forEach((x, ae) => {
            R.polygon(pe(x.points), { pane: "pParks", color: "#c9b98f", weight: 1, fillColor: ae % 2 ? "#ece2c8" : "#e4d7b4", fillOpacity: 0.55 }).addTo(U), R.marker(pe([x.label])[0], { pane: "pLabels", interactive: !1, icon: Ye(x.name, "#8a7a5c") }).addTo(U);
          }), (we.routes || []).forEach((x) => R.polyline(pe(x.points), { pane: "pRoads", color: "#b98a4a", weight: 2.5, dashArray: "2 7" }).addTo(U)), (we.cities || []).forEach((x) => {
            const ae = De(x.x, x.y);
            R.circleMarker(ae, { pane: "pLabels", radius: x.capital ? 9 : 6, color: "#ffffff", weight: 2, fillColor: x.capital ? "#d64545" : "#3a6ea5", fillOpacity: 1 }).bindPopup(re(x.name)).addTo(U), R.marker(ae, { pane: "pLabels", interactive: !1, icon: Ye(x.name, x.capital ? "#d64545" : "#3a6ea5") }).addTo(U);
          }), le.fitBounds([[0, 0], [oe, C]], { padding: [6, 6] });
          return;
        }
        R.rectangle([[0, 0], [oe, C]], { pane: "pWater", stroke: !1, fillColor: "#eef1f4", fillOpacity: 1 }).addTo(U), (I.value.compounds || []).forEach((x) => {
          R.polygon(pe(x.points), { pane: "pParks", color: "#c9b98f", weight: 1.2, dashArray: "7 5", fillColor: "#f3ead0", fillOpacity: 0.5 }).addTo(U), R.marker(pe(x.points)[0], { pane: "pLabels", interactive: !1, icon: Ye(x.name, "#a9884a") }).addTo(U);
        }), (I.value.lakes || []).forEach((x) => {
          R.polygon(pe(x.points), { pane: "pWater", color: "#8fbfe6", weight: 1.5, fillColor: "#bcd9f0", fillOpacity: 1 }).addTo(U), x.name && x.name !== "" && R.marker(De(x.label[0], x.label[1]), { pane: "pLabels", interactive: !1, icon: Ye(x.name, "#3d7fb5") }).addTo(U);
        }), (I.value.rivers || []).forEach((x) => {
          R.polyline(pe(x.points), { pane: "pWater", color: "#8fbfe6", weight: 16, lineCap: "round", lineJoin: "round" }).addTo(U), R.polyline(pe(x.points), { pane: "pWater", color: "#bcd9f0", weight: 11, lineCap: "round", lineJoin: "round" }).addTo(U), x.name && x.name !== "" && R.marker(pe(x.points)[Math.floor(x.points.length / 2)], { pane: "pLabels", interactive: !1, icon: Ye(x.name, "#3d7fb5") }).addTo(U);
        }), (I.value.parks || []).forEach((x) => {
          R.polygon(pe(x.points), { pane: "pParks", color: "#a9d3a0", weight: 1, fillColor: "#c9e6c4", fillOpacity: 1 }).addTo(U), (x.trees || []).forEach((ae) => R.circleMarker(De(ae[0], ae[1]), { pane: "pParks", radius: 2.6, stroke: !1, fillColor: "#82bd79", fillOpacity: 1 }).addTo(U)), x.name && x.name !== O("life.companion.val.park") && R.marker(pe(x.points)[0], { pane: "pLabels", interactive: !1, icon: Ye(x.name, "#5a9e52") }).addTo(U);
        });
        const Oi = [];
        (I.value.blocks || []).forEach((x) => {
          const ae = pe(x.points);
          if (R.polygon(ae.map((ve) => [ve[0] - 3, ve[1] + 3]), { pane: "pBlocks", stroke: !1, fillColor: "#5b6b7a", fillOpacity: 0.16 }).addTo(U), R.polygon(ae, { pane: "pBlocks", color: "#b9c3cd", weight: 1, fillColor: Pe[(x.shade || 0) % Pe.length], fillOpacity: 1 }).addTo(U), x.tower) {
            const ve = ae.reduce((fe, ze) => fe + ze[0], 0) / ae.length, xe = ae.reduce((fe, ze) => fe + ze[1], 0) / ae.length;
            R.polygon(
              ae.map((fe) => [ve + (fe[0] - ve) * 0.5, xe + (fe[1] - xe) * 0.5]),
              { pane: "pBlocks", color: "#aab4c0", weight: 1, fillColor: "#eef2f6", fillOpacity: 1 }
            ).addTo(U);
          }
          if (x.name) {
            const ve = x.points.reduce((fe, ze) => fe + ze[0], 0) / x.points.length, xe = x.points.reduce((fe, ze) => fe + ze[1], 0) / x.points.length;
            Oi.push({ x: ve, y: xe, text: x.name, color: x.tower ? "#6b5b8a" : "#7a8794" });
          }
        }), (I.value.named_buildings || []).forEach((x) => {
          R.circleMarker(De(x.x, x.y), { pane: "pLabels", radius: 4, color: "#ffffff", weight: 1.5, fillColor: "#8a5a2b", fillOpacity: 1 }).addTo(U), R.marker(De(x.x, x.y), { pane: "pLabels", interactive: !1, icon: Ye(x.name, "#8a5a2b") }).addTo(U);
        });
        for (const x of Cn(Oi))
          R.marker(De(x.x, x.y), { pane: "pLabels", interactive: !1, icon: Sn(x.text, x.color) }).addTo(U);
        const ii = {
          highway: { casing: 13, fill: 6.5, color: "#f08c2e" },
          arterial: { casing: 10, fill: 4.5, color: "#f7cf8a" },
          street: { casing: 5, fill: 2.4, color: "#ffffff" }
        };
        (I.value.streets || []).forEach((x) => {
          const ae = ii[x.kind] || ii.street, ve = pe(x.points);
          R.polyline(ve, { pane: "pRoads", color: "#ffffff", weight: ae.casing, lineCap: "round", lineJoin: "round" }).addTo(U), R.polyline(ve, { pane: "pRoads", color: ae.color, weight: ae.fill, lineCap: "round", lineJoin: "round" }).addTo(U);
        }), (I.value.roads || []).forEach((x, ae) => {
          if (!x.name) return;
          const ve = pe(x.points), xe = "road:" + ae;
          R.polyline(ve, { pane: "pRoads", color: "#ffffff", weight: 11, lineCap: "round", lineJoin: "round" }).addTo(U);
          const fe = { pane: "pRoads", color: "#f6c56b", weight: 5, opacity: 1, lineCap: "round", lineJoin: "round" };
          cn(xe, R.polyline(ve, fe).on("click", () => Ke(xe)).addTo(U), fe), R.marker(ve[Math.floor(ve.length / 2)], { pane: "pLabels", interactive: !0, icon: Ye(x.name, "#9a8358") }).on("click", () => Ke(xe)).addTo(U);
        }), (I.value.districts || []).forEach((x, ae) => {
          R.circle(De(x.x, x.y), { pane: "pRoads", radius: x.r || 200, color: "#93a2b0", weight: 1, dashArray: "4 7", fillColor: xt[ae % xt.length], fillOpacity: 0.08 }).addTo(U), R.marker(De(x.x, x.y), { pane: "pLabels", interactive: !1, icon: R.divIcon({ className: "wm-district", html: `<span class="wm-district-inner">${re(x.name)}</span>`, iconSize: [0, 0], iconAnchor: [0, 0] }) }).addTo(U);
        });
        const oi = [];
        (I.value.metro || []).forEach((x, ae) => {
          const ve = pe(x.points), xe = "metro:" + ae;
          R.polyline(ve, { pane: "pMetro", color: "#ffffff", weight: 8, lineCap: "round", lineJoin: "round" }).addTo(U);
          const fe = { pane: "pMetro", color: x.color, weight: 4.5, opacity: 0.92, lineCap: "round", lineJoin: "round" };
          cn(xe, R.polyline(ve, fe).on("click", () => Ke(xe)).addTo(U), fe), (x.stations || []).forEach((ze) => {
            R.circleMarker(De(ze.x, ze.y), { pane: "pMetro", radius: 5, color: "#ffffff", weight: 2.5, fillColor: x.color, fillOpacity: 1 }).bindPopup(re(ze.name || x.name)).on("click", () => Ke(xe)).addTo(U), ze.name && oi.push({ x: ze.x, y: ze.y, text: ze.name, color: x.color });
          }), R.marker(ve[Math.floor(ve.length / 2)], { pane: "pLabels", interactive: !0, icon: Ye(x.name, x.color) }).on("click", () => Ke(xe)).addTo(U);
        }), (I.value.bus || []).forEach((x, ae) => {
          const ve = pe(x.points), xe = "bus:" + ae, fe = { pane: "pBus", color: x.color, weight: 3, opacity: 0.95, dashArray: "7 7", lineCap: "round" };
          cn(xe, R.polyline(ve, fe).on("click", () => Ke(xe)).addTo(U), fe), (x.stops || []).forEach((ze) => R.circleMarker(De(ze.x, ze.y), { pane: "pBus", radius: 3.2, color: "#ffffff", weight: 1.5, fillColor: x.color, fillOpacity: 1 }).bindPopup(re(ze.name || x.name)).on("click", () => Ke(xe)).addTo(U)), R.marker(ve[Math.floor(ve.length / 2)], { pane: "pLabels", interactive: !0, icon: Ye(x.name, x.color) }).on("click", () => Ke(xe)).addTo(U);
        });
        for (const x of Cn(oi))
          R.marker(De(x.x, x.y), { pane: "pLabels", interactive: !1, icon: Li(x.text, x.color) }).addTo(U);
      } else
        for (const C of I.value.edges || []) {
          const oe = B[C[0]], pe = B[C[1]];
          oe?.lat != null && pe?.lat != null && R.polyline([[oe.lat, oe.lng], [pe.lat, pe.lng]], { color: "#5b8def", weight: 3, opacity: 0.55, dashArray: "2 8", lineCap: "round" }).addTo(U);
        }
      for (const C of u) {
        const oe = Tn[C.kind] || Tn.other, pe = l ? De(C.x, C.y) : C.lat != null ? [C.lat, C.lng] : null;
        if (!pe) continue;
        const we = R.divIcon({
          className: "wm-pin-holder",
          html: `<span class="wm-pin" style="--c:${oe}"></span><span class="wm-pin-label">${re(C.name)}</span>`,
          iconSize: [0, 0],
          iconAnchor: [0, 0]
        });
        R.marker(pe, { icon: we }).bindPopup(`<b>${re(C.name)}</b>${C.desc ? "<br>" + re(C.desc) : ""}`).addTo(U);
      }
      for (const C of I.value.actors || []) {
        const oe = B[Ln.value[C.id] || C.location];
        if (!oe) continue;
        const pe = l ? De(oe.x, oe.y) : oe.lat != null ? [oe.lat, oe.lng] : null;
        if (!pe) continue;
        const we = R.divIcon({
          className: "wm-actor-holder",
          html: `<span class="wm-actor-badge">${re((C.name || "?").slice(0, 1))}</span><span class="wm-actor-name">${re(C.name)}</span>`,
          iconSize: [0, 0],
          iconAnchor: [0, 0]
        });
        R.marker(pe, { icon: we }).bindPopup(`${re(C.name)} · ${re(oe.name)}`).addTo(U);
      }
      if (!d)
        if (l) {
          const { w: C, h: oe } = Mt();
          le.fitBounds([[0, 0], [oe, C]], { padding: [0, 0] });
        } else {
          const C = u.filter((oe) => oe.lat != null).map((oe) => [oe.lat, oe.lng]);
          C.length > 1 ? le.fitBounds(C, { padding: [56, 56], maxZoom: 15 }) : C.length === 1 && le.setView(C[0], 14);
        }
    }
    pn([ce, () => N.value.worldview], async () => {
      ce.value === "world" && (await Fi(), Qi(), j(), le && setTimeout(() => le.invalidateSize(), 80));
    }), po(() => {
      le && (le.remove(), le = null, U = null);
    });
    function ut() {
      _.value = { ...en() }, $t.value = String(N.value.settings?.world_density || "off"), bt.value = String(N.value.settings?.world_fictional || "fictional"), nn.value = String(N.value.settings?.world_country || ""), on.value = String(N.value.settings?.world_city || ""), an.value = String(N.value.settings?.world_district || ""), sn.value = String(N.value.settings?.world_premise || ""), rn.value = String(N.value.settings?.persona_text || ""), Ct.value = String(N.value.settings?.world_actors || ""), mt.value = String(N.value.settings?.world_places || ""), Gt.value = Mn();
    }
    const ue = F(!1);
    function Mn() {
      return JSON.stringify({
        ...$(),
        world_density: $t.value,
        world_fictional: bt.value,
        world_country: nn.value,
        world_city: on.value,
        world_district: an.value,
        world_premise: sn.value,
        world_actors: Ct.value,
        world_places: mt.value,
        persona_text: rn.value
      });
    }
    const Gt = F(""), jt = A(() => !Le.value && Gt.value !== "" && Mn() !== Gt.value);
    function zn(d) {
      jt.value && (d.preventDefault(), d.returnValue = "");
    }
    let ct = null;
    function be(d) {
      return _.value.cog_enabled ? d ? { cls: "ok", text: a("life.companion.badge.on") } : { cls: "", text: a("life.companion.badge.off") } : { cls: "core-off", text: a("life.companion.badge.coreOff") };
    }
    async function dn() {
      if (await y({
        title: a("life.companion.resetDefaults"),
        message: a("life.companion.resetDefaultsConfirm"),
        confirmLabel: a("life.companion.resetDefaults")
      })) {
        for (const [u, l] of Object.entries(ge))
          _.value[u] = Ne.includes(u) ? l === "1" : Nt.includes(u) ? l : Number(l);
        Te(a("life.companion.flash.resetDefaults"));
      }
    }
    async function Me() {
      if (!ue.value) {
        ue.value = !0;
        try {
          const d = {
            ...$(),
            world_density: $t.value,
            world_fictional: bt.value,
            world_country: nn.value,
            world_city: on.value,
            world_district: an.value,
            world_premise: sn.value,
            world_actors: Ct.value,
            world_places: mt.value,
            persona_text: rn.value
          }, u = await ee("settings_set", { settings: d });
          u?.rejected?.length ? Te(a("life.companion.flash.settingsSavedIgnored", { items: u.rejected.join(a("life.companion.listSeparator")) })) : Te(a("life.companion.flash.settingsSaved")), Gt.value = Mn();
        } finally {
          ue.value = !1;
        }
      }
    }
    const zt = F([]), Ti = F([]);
    F(!1);
    async function Si() {
      const d = await ee("adapter_list", {});
      d && (zt.value = d.instances || [], Ti.value = d.runtime || []);
    }
    async function eo() {
      if (!(nt.value || !await y({
        title: a("life.companion.world.rewriteTitle"),
        message: a("life.companion.world.rewriteMessage"),
        confirmLabel: a("life.companion.world.overwriteConfirm"),
        danger: !0
      }))) {
        nt.value = !0;
        try {
          (await ee("world_generate", { instructions: "" }))?.worldview && Te(a("life.companion.flash.worldGenerated"));
        } finally {
          nt.value = !1;
        }
      }
    }
    async function Ci() {
      if (!nt.value) {
        nt.value = !0;
        try {
          (await ee("world_map_generate", { instructions: "" }))?.worldview && Te(a("life.companion.flash.mapRegenerated"));
        } finally {
          nt.value = !1;
        }
      }
    }
    async function Xn() {
      if (!await y({
        title: a("life.companion.world.clearTitle"),
        message: a("life.companion.world.clearMessage"),
        confirmLabel: a("life.companion.world.clearConfirm"),
        danger: !0
      })) return;
      await ee("world_clear", {}) && Te(a("life.companion.flash.worldCleared"));
    }
    async function to() {
      if (!(!await y({
        title: a("life.companion.reset.title"),
        message: a("life.companion.reset.message"),
        confirmLabel: a("life.companion.reset.continue"),
        danger: !0
      }) || !await y({
        title: a("life.companion.reset.confirmTitle"),
        message: a("life.companion.reset.confirmMessage"),
        confirmLabel: a("life.companion.reset.confirm"),
        danger: !0
      }))) {
        ln.value = !0;
        try {
          await ee("reset_person", {}), Te(a("life.companion.flash.personReset")), await Ze();
        } finally {
          ln.value = !1;
        }
      }
    }
    const hn = () => ({ name: "", avatar: "", birthDate: "", gender: "", description: "", personality: "", greeting: "", customPrompt: "" }), te = A(() => [
      { value: "", label: a("life.companion.gender.none") },
      { value: "female", label: a("life.companion.gender.female") },
      { value: "male", label: a("life.companion.gender.male") },
      { value: "other", label: a("life.companion.gender.other") }
    ]);
    function no(d) {
      return (te.value.find((u) => u.value === d) || te.value[0]).label;
    }
    const X = F(hn()), Et = F(!1);
    function Qn() {
      return globalThis.__0KAY_HOST__;
    }
    function Mi() {
      const d = Qn();
      if (d?.getPersona) {
        X.value = { ...hn(), ...d.getPersona() || {} };
        return;
      }
      try {
        const u = JSON.parse(localStorage.getItem("0kay_config") || "{}");
        X.value = { ...hn(), ...u.persona || {} };
      } catch {
        X.value = hn();
      }
    }
    const w = F(null), En = F(!1), zi = A(() => [
      { value: "", label: a("life.companion.gender.undecidedBracket") },
      ...(w.value?.options?.character || []).map((d) => ({ value: d.key, label: d.label }))
    ]), io = A(() => [
      { value: "", label: a("life.companion.gender.undecidedBracket") },
      ...(w.value?.options?.relationship || []).map((d) => ({
        value: d.key,
        label: d.label + (d.pathological ? a("life.companion.relationship.pathologicalSuffix") : "")
      }))
    ]);
    function Ei() {
      return { text: [X.value.description, X.value.personality].filter((d) => String(d || "").trim()).join(`
`) };
    }
    pn(() => [X.value.description, X.value.personality, X.value.customPrompt], () => {
      w.value = null;
    });
    function ei(d) {
      return (w.value?.options?.relationship || []).find((u) => u.key === d);
    }
    pn(() => w.value?.relationship?.key, (d) => {
      const u = w.value?.attachment;
      if (!u) return;
      const l = ei(d);
      u.type = l?.pathological && l.attachment_type || "";
    }, { immediate: !0 }), pn(() => w.value?.attachment?.type, (d) => {
      const u = w.value?.attachment;
      if (!(!d || !u)) {
        (!u.initial || typeof u.initial != "object") && (u.initial = {});
        for (const [l, B] of Object.entries({ A: 0.05, Am: 0, Tr: 0.5, J: 0, X: 0.05, S: 0.6, O: 0 }))
          u.initial[l] == null && (u.initial[l] = B);
      }
    });
    async function oo() {
      const d = Ei();
      if (!d.text.trim()) {
        Te(a("life.companion.flash.needDescriptionOrPersonality"));
        return;
      }
      En.value = !0;
      try {
        const u = await ee("persona_analyze", { text: d.text, gender: X.value.gender });
        u && (w.value = u, w.value.personadynGender = u.personadyn?.gender || W(_.cog_personadyn_gender) || O("life.companion.pdGender.unspecified"), !X.value.gender && u.gender && (X.value.gender = u.gender), Te(u.source === "llm" ? a("life.companion.flash.analyzedLlm") : a("life.companion.flash.analyzedLocal")));
      } finally {
        En.value = !1;
      }
    }
    async function dt() {
      if (!w.value) {
        Te(a("life.companion.flash.needLlmFirst"));
        return;
      }
      Et.value = !0;
      try {
        const d = Ei(), u = { ...w.value.traits || {} };
        if (u.gender = w.value.gender || X.value.gender || null, u.character = w.value.character?.key || null, u.relationship = w.value.relationship?.key || null, u.expression = w.value.character?.expression || w.value.expression || null, delete u.axes, !await ee("persona_apply", {
          text: d.text,
          traits: u,
          attachment: w.value.attachment || {},
          tsundere: w.value.tsundere || {},
          personadyn: {
            ...w.value.personadyn || {},
            gender: w.value.personadynGender || W(_.cog_personadyn_gender) || O("life.companion.pdGender.unspecified")
          }
        })) return;
        const B = Qn();
        if (B?.setPersona)
          B.setPersona({ ...X.value }), B.saveConfig?.();
        else {
          const C = JSON.parse(localStorage.getItem("0kay_config") || "{}");
          C.persona = { ...C.persona || {}, ...X.value }, localStorage.setItem("0kay_config", JSON.stringify(C));
        }
        Te(a("life.companion.flash.personaSaved"));
      } finally {
        Et.value = !1;
      }
    }
    ci(Mi), pn(ce, (d) => {
      d === "persona" && Mi();
    }), ci(Ze), ci(() => {
      window.addEventListener("beforeunload", zn), Be && (ct = Be.beforeEach(() => jt.value ? !!window.confirm(a("life.companion.unsavedLeave")) : !0));
    }), po(() => {
      window.removeEventListener("beforeunload", zn), ct && (ct(), ct = null);
    });
    const ti = F("");
    let On;
    async function _t() {
      if (document.visibilityState === "visible")
        try {
          N.value = await $o("/api/life/companion"), ti.value = (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        } catch {
        }
    }
    function ni() {
      document.visibilityState === "visible" && _t();
    }
    return ci(() => {
      On = setInterval(() => {
        _t();
      }, 12e3), document.addEventListener("visibilitychange", ni);
    }), po(() => {
      On && clearInterval(On), document.removeEventListener("visibilitychange", ni);
    }), Ba("life-plugin-kit", qo("pcp")), (d, u) => (v(), g(
      "main",
      {
        class: "pcp",
        ref_key: "pageEl",
        ref: de
      },
      [
        i("header", Rs, [
          i("div", Ds, [
            i("div", Vs, [
              u[100] || (u[100] = i(
                "p",
                { class: "eyebrow" },
                [
                  i("b", null, "◉"),
                  z(" L.I.F.E / COGNITION")
                ],
                -1
                /* CACHED */
              )),
              i("h1", null, [
                z(
                  r(a("life.companion.title")) + " ",
                  1
                  /* TEXT */
                ),
                jt.value ? (v(), g(
                  "span",
                  $s,
                  r(a("life.companion.unsavedChanges")),
                  1
                  /* TEXT */
                )) : E("v-if", !0)
              ]),
              i(
                "p",
                Us,
                r(a("life.companion.subtitle")),
                1
                /* TEXT */
              )
            ]),
            i("div", Hs, [
              i("button", {
                class: D(["btn", { tonic: !ye.value?.alive }]),
                disabled: pt.value || Le.value,
                onClick: u[0] || (u[0] = (l) => ye.value?.alive ? Fn() : Hn())
              }, r(pt.value ? yn() : ye.value?.alive ? a("life.companion.life.pause") : a("life.companion.life.start")), 11, Fs),
              i("button", {
                class: D(["fab", { dirty: jt.value }]),
                disabled: ue.value || Le.value,
                onClick: Me
              }, [
                u[101] || (u[101] = i(
                  "span",
                  { class: "fab-ic" },
                  "✦",
                  -1
                  /* CACHED */
                )),
                z(
                  r(ue.value ? a("life.companion.saving") : a("life.companion.saveSettings")),
                  1
                  /* TEXT */
                )
              ], 10, Ws),
              i("button", {
                class: "btn",
                disabled: ue.value || Le.value,
                onClick: dn
              }, r(a("life.companion.resetDefaults")), 9, Gs),
              i("button", {
                class: "btn tonic",
                disabled: Le.value,
                onClick: Ze
              }, r(Le.value ? a("life.companion.refreshing") : a("life.companion.refresh")), 9, js)
            ])
          ]),
          i("div", qs, [
            i(
              "span",
              {
                class: D(["pill", { bad: m.value && !m.value.enabled }])
              },
              r(a("life.companion.cognitionCore")) + " " + r(m.value?.available === !1 ? a("life.companion.status.unavailable") : m.value?.enabled ? a("life.companion.status.running") : a("life.companion.status.stopped")),
              3
              /* TEXT, CLASS */
            ),
            i(
              "span",
              Ks,
              r(a("life.companion.state.decidedTurns", { n: b.value?.turns ?? 0 })),
              1
              /* TEXT */
            ),
            i(
              "span",
              Ys,
              r(a("life.companion.state.engrams", { n: b.value?.engrams ?? 0 })),
              1
              /* TEXT */
            ),
            i(
              "span",
              Js,
              r(a("life.companion.state.lexicon", { n: ne.value?.lexicon_size ?? 0 })),
              1
              /* TEXT */
            )
          ])
        ]),
        K.value ? (v(), g(
          "p",
          Xs,
          r(K.value),
          1
          /* TEXT */
        )) : E("v-if", !0),
        Xe.value ? (v(), g(
          "p",
          Qs,
          r(Xe.value),
          1
          /* TEXT */
        )) : E("v-if", !0),
        i("nav", {
          class: "tabs",
          "aria-label": a("life.companion.view")
        }, [
          (v(), g(
            Q,
            null,
            Ee(q, (l) => i("button", {
              key: l.key,
              class: D(["tab", { active: ce.value === l.key }]),
              onClick: (B) => Yt(l.key)
            }, [
              i(
                "i",
                null,
                r(l.i),
                1
                /* TEXT */
              ),
              i(
                "span",
                nr,
                r(l.icon),
                1
                /* TEXT */
              ),
              z(
                r(a(l.labelKey)),
                1
                /* TEXT */
              )
            ], 10, tr)),
            64
            /* STABLE_FRAGMENT */
          ))
        ], 8, er),
        P(i(
          "section",
          ir,
          [
            i("div", or, [
              i("div", null, [
                i(
                  "h2",
                  null,
                  r(a("life.companion.persona.title")),
                  1
                  /* TEXT */
                ),
                i(
                  "p",
                  ar,
                  r(a("life.companion.persona.desc")),
                  1
                  /* TEXT */
                )
              ]),
              i("div", sr, [
                i("button", {
                  class: "btn tonic sm",
                  disabled: En.value || Le.value,
                  onClick: oo
                }, r(En.value ? a("life.companion.persona.analyzing") : a("life.companion.persona.analyze")), 9, rr),
                i("button", {
                  class: "btn filled sm",
                  disabled: Et.value || !w.value,
                  onClick: dt
                }, r(a("life.companion.persona.save")), 9, lr)
              ])
            ]),
            i("article", ur, [
              i("div", cr, [
                i("label", null, [
                  i(
                    "span",
                    null,
                    r(a("life.companion.persona.name")),
                    1
                    /* TEXT */
                  ),
                  P(i(
                    "input",
                    {
                      "onUpdate:modelValue": u[1] || (u[1] = (l) => X.value.name = l),
                      class: "field"
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [M, X.value.name]
                  ])
                ]),
                i("label", null, [
                  i(
                    "span",
                    null,
                    r(a("life.companion.persona.gender")),
                    1
                    /* TEXT */
                  ),
                  Oe($e(Ue), {
                    modelValue: X.value.gender,
                    "onUpdate:modelValue": u[2] || (u[2] = (l) => X.value.gender = l),
                    options: te.value,
                    "aria-label": a("life.companion.persona.gender")
                  }, null, 8, ["modelValue", "options", "aria-label"])
                ]),
                i("label", null, [
                  i(
                    "span",
                    null,
                    r(a("life.companion.persona.avatarUrl")),
                    1
                    /* TEXT */
                  ),
                  P(i(
                    "input",
                    {
                      "onUpdate:modelValue": u[3] || (u[3] = (l) => X.value.avatar = l),
                      class: "field"
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [M, X.value.avatar]
                  ])
                ]),
                i("label", null, [
                  i(
                    "span",
                    null,
                    r(a("life.companion.persona.birthday")),
                    1
                    /* TEXT */
                  ),
                  P(i(
                    "input",
                    {
                      "onUpdate:modelValue": u[4] || (u[4] = (l) => X.value.birthDate = l),
                      type: "date",
                      class: "field"
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [M, X.value.birthDate]
                  ])
                ])
              ]),
              i("label", dr, [
                i(
                  "span",
                  null,
                  r(a("life.companion.persona.description")),
                  1
                  /* TEXT */
                ),
                P(i(
                  "textarea",
                  {
                    "onUpdate:modelValue": u[5] || (u[5] = (l) => X.value.description = l),
                    rows: "3",
                    class: "field"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [M, X.value.description]
                ])
              ]),
              i("label", hr, [
                i(
                  "span",
                  null,
                  r(a("life.companion.persona.personality")),
                  1
                  /* TEXT */
                ),
                P(i(
                  "textarea",
                  {
                    "onUpdate:modelValue": u[6] || (u[6] = (l) => X.value.personality = l),
                    rows: "3",
                    class: "field"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [M, X.value.personality]
                ])
              ]),
              i("label", pr, [
                i(
                  "span",
                  null,
                  r(a("life.companion.persona.greeting")),
                  1
                  /* TEXT */
                ),
                P(i(
                  "textarea",
                  {
                    "onUpdate:modelValue": u[7] || (u[7] = (l) => X.value.greeting = l),
                    rows: "2",
                    class: "field"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [M, X.value.greeting]
                ])
              ]),
              i("label", fr, [
                i(
                  "span",
                  null,
                  r(a("life.companion.persona.customPrompt")),
                  1
                  /* TEXT */
                ),
                P(i(
                  "textarea",
                  {
                    "onUpdate:modelValue": u[8] || (u[8] = (l) => X.value.customPrompt = l),
                    rows: "5",
                    class: "field"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [M, X.value.customPrompt]
                ])
              ]),
              i(
                "p",
                mr,
                r(a("life.companion.persona.hint")),
                1
                /* TEXT */
              )
            ]),
            w.value ? (v(), g("article", _r, [
              i("h3", null, [
                z(
                  r(a("life.companion.persona.analysisResult")) + " ",
                  1
                  /* TEXT */
                ),
                i(
                  "span",
                  vr,
                  r(w.value.source === "llm" ? a("life.companion.persona.sourceLlm") : a("life.companion.persona.sourceLocal")),
                  1
                  /* TEXT */
                )
              ]),
              i("div", gr, [
                i("label", null, [
                  i(
                    "span",
                    null,
                    r(a("life.companion.persona.gender")),
                    1
                    /* TEXT */
                  ),
                  Oe($e(Ue), {
                    modelValue: w.value.gender,
                    "onUpdate:modelValue": u[9] || (u[9] = (l) => w.value.gender = l),
                    options: te.value,
                    "aria-label": a("life.companion.persona.gender")
                  }, null, 8, ["modelValue", "options", "aria-label"])
                ]),
                i("label", null, [
                  i(
                    "span",
                    null,
                    r(a("life.companion.persona.characterArchetype")),
                    1
                    /* TEXT */
                  ),
                  Oe($e(Ue), {
                    modelValue: w.value.character.key,
                    "onUpdate:modelValue": u[10] || (u[10] = (l) => w.value.character.key = l),
                    options: zi.value,
                    "aria-label": a("life.companion.persona.characterArchetype")
                  }, null, 8, ["modelValue", "options", "aria-label"])
                ]),
                i("label", null, [
                  i(
                    "span",
                    null,
                    r(a("life.companion.persona.relationshipType")),
                    1
                    /* TEXT */
                  ),
                  Oe($e(Ue), {
                    modelValue: w.value.relationship.key,
                    "onUpdate:modelValue": u[11] || (u[11] = (l) => w.value.relationship.key = l),
                    options: io.value,
                    "aria-label": a("life.companion.persona.relationshipTypeAria")
                  }, null, 8, ["modelValue", "options", "aria-label"])
                ])
              ]),
              i("p", yr, [
                z(
                  r(a("life.companion.persona.genderLine", { gender: no(w.value.gender) })) + " ",
                  1
                  /* TEXT */
                ),
                w.value.relationship?.label ? (v(), g(
                  Q,
                  { key: 0 },
                  [
                    z(
                      r(a("life.companion.persona.relationshipLine", { label: w.value.relationship.label })) + " ",
                      1
                      /* TEXT */
                    ),
                    w.value.relationship.pathological ? (v(), g(
                      Q,
                      { key: 0 },
                      [
                        z(
                          r(a("life.companion.persona.pathologicalNote")),
                          1
                          /* TEXT */
                        )
                      ],
                      64
                      /* STABLE_FRAGMENT */
                    )) : (v(), g(
                      Q,
                      { key: 1 },
                      [
                        z(
                          r(a("life.companion.persona.healthyNote")),
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
                )) : E("v-if", !0)
              ]),
              w.value.character?.expression || w.value.expression ? (v(), g(
                "p",
                br,
                r(a("life.companion.persona.speakingStyle", { style: w.value.character?.expression || w.value.expression })),
                1
                /* TEXT */
              )) : E("v-if", !0),
              i(
                "h4",
                null,
                r(a("life.companion.persona.emotionSomatic")),
                1
                /* TEXT */
              ),
              i("div", wr, [
                i("label", null, [
                  i(
                    "span",
                    null,
                    r(a("life.companion.persona.threatBaseline")),
                    1
                    /* TEXT */
                  ),
                  P(i(
                    "input",
                    {
                      "onUpdate:modelValue": u[12] || (u[12] = (l) => w.value.traits.threat_baseline = l),
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
                      M,
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
                    r(a("life.companion.persona.rewardBaseline")),
                    1
                    /* TEXT */
                  ),
                  P(i(
                    "input",
                    {
                      "onUpdate:modelValue": u[13] || (u[13] = (l) => w.value.traits.reward_baseline = l),
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
                      M,
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
                    r(a("life.companion.persona.catastrophizing")),
                    1
                    /* TEXT */
                  ),
                  P(i(
                    "input",
                    {
                      "onUpdate:modelValue": u[14] || (u[14] = (l) => w.value.traits.catastrophizing = l),
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
                      M,
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
                    r(a("life.companion.persona.erqProfile")),
                    1
                    /* TEXT */
                  ),
                  Oe($e(Ue), {
                    modelValue: w.value.traits.erq_profile,
                    "onUpdate:modelValue": u[15] || (u[15] = (l) => w.value.traits.erq_profile = l),
                    options: Se.value,
                    "aria-label": a("life.companion.persona.erqProfile")
                  }, null, 8, ["modelValue", "options", "aria-label"])
                ]),
                i("label", null, [
                  i(
                    "span",
                    null,
                    r(a("life.companion.persona.sleepHour")),
                    1
                    /* TEXT */
                  ),
                  P(i(
                    "input",
                    {
                      "onUpdate:modelValue": u[16] || (u[16] = (l) => w.value.traits.sleep_hour = l),
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
                      M,
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
                r(a("life.companion.persona.personalityDims")),
                1
                /* TEXT */
              ),
              i("div", xr, [
                i("label", null, [
                  i(
                    "span",
                    null,
                    r(a("life.companion.persona.extraversion")),
                    1
                    /* TEXT */
                  ),
                  P(i(
                    "input",
                    {
                      "onUpdate:modelValue": u[17] || (u[17] = (l) => w.value.traits.extraversion = l),
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
                      M,
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
                    r(a("life.companion.persona.agreeableness")),
                    1
                    /* TEXT */
                  ),
                  P(i(
                    "input",
                    {
                      "onUpdate:modelValue": u[18] || (u[18] = (l) => w.value.traits.agreeableness = l),
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
                      M,
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
                    r(a("life.companion.persona.conscientiousness")),
                    1
                    /* TEXT */
                  ),
                  P(i(
                    "input",
                    {
                      "onUpdate:modelValue": u[19] || (u[19] = (l) => w.value.traits.conscientiousness = l),
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
                      M,
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
                    r(a("life.companion.persona.openness")),
                    1
                    /* TEXT */
                  ),
                  P(i(
                    "input",
                    {
                      "onUpdate:modelValue": u[20] || (u[20] = (l) => w.value.traits.openness = l),
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
                      M,
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
                    r(a("life.companion.persona.attachAnxiety")),
                    1
                    /* TEXT */
                  ),
                  P(i(
                    "input",
                    {
                      "onUpdate:modelValue": u[21] || (u[21] = (l) => w.value.traits.attach_anxiety = l),
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
                      M,
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
                    r(a("life.companion.persona.attachAvoidance")),
                    1
                    /* TEXT */
                  ),
                  P(i(
                    "input",
                    {
                      "onUpdate:modelValue": u[22] || (u[22] = (l) => w.value.traits.attach_avoidance = l),
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
                      M,
                      w.value.traits.attach_avoidance,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ])
              ]),
              i("details", kr, [
                i(
                  "summary",
                  null,
                  r(a("life.companion.persona.moreStyle")),
                  1
                  /* TEXT */
                ),
                i("div", Pr, [
                  i("label", null, [
                    i(
                      "span",
                      null,
                      r(a("life.companion.persona.expressiveness")),
                      1
                      /* TEXT */
                    ),
                    P(i(
                      "input",
                      {
                        "onUpdate:modelValue": u[23] || (u[23] = (l) => w.value.traits.expressiveness = l),
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
                        M,
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
                      r(a("life.companion.persona.initiative")),
                      1
                      /* TEXT */
                    ),
                    P(i(
                      "input",
                      {
                        "onUpdate:modelValue": u[24] || (u[24] = (l) => w.value.traits.initiative = l),
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
                        M,
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
                      r(a("life.companion.persona.humor")),
                      1
                      /* TEXT */
                    ),
                    P(i(
                      "input",
                      {
                        "onUpdate:modelValue": u[25] || (u[25] = (l) => w.value.traits.humor = l),
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
                        M,
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
                      r(a("life.companion.persona.warmth")),
                      1
                      /* TEXT */
                    ),
                    P(i(
                      "input",
                      {
                        "onUpdate:modelValue": u[26] || (u[26] = (l) => w.value.traits.warmth = l),
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
                        M,
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
                      r(a("life.companion.persona.formality")),
                      1
                      /* TEXT */
                    ),
                    P(i(
                      "input",
                      {
                        "onUpdate:modelValue": u[27] || (u[27] = (l) => w.value.traits.formality = l),
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
                        M,
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
                      r(a("life.companion.persona.assertiveness")),
                      1
                      /* TEXT */
                    ),
                    P(i(
                      "input",
                      {
                        "onUpdate:modelValue": u[28] || (u[28] = (l) => w.value.traits.assertiveness = l),
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
                        M,
                        w.value.traits.assertiveness,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ])
                ])
              ]),
              w.value.attachment.type ? (v(), g(
                Q,
                { key: 1 },
                [
                  i(
                    "h4",
                    null,
                    r(a("life.companion.persona.attachmentHeading", { label: w.value.relationship.label })),
                    1
                    /* TEXT */
                  ),
                  i("div", Lr, [
                    i("label", null, [
                      i(
                        "span",
                        null,
                        r(a("life.companion.persona.attachTypeByRelationship")),
                        1
                        /* TEXT */
                      ),
                      i("input", {
                        class: "field",
                        value: a("life.companion.attachmentTypeValue", { type: w.value.attachment.type, label: w.value.relationship.label || "" }),
                        disabled: ""
                      }, null, 8, Tr)
                    ]),
                    i("label", null, [
                      i(
                        "span",
                        null,
                        r(a("life.companion.persona.initialAnxietyX")),
                        1
                        /* TEXT */
                      ),
                      P(i(
                        "input",
                        {
                          "onUpdate:modelValue": u[29] || (u[29] = (l) => w.value.attachment.initial.X = l),
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
                          M,
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
                        r(a("life.companion.persona.initialSecurityS")),
                        1
                        /* TEXT */
                      ),
                      P(i(
                        "input",
                        {
                          "onUpdate:modelValue": u[30] || (u[30] = (l) => w.value.attachment.initial.S = l),
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
                          M,
                          w.value.attachment.initial.S,
                          void 0,
                          { number: !0 }
                        ]
                      ])
                    ])
                  ]),
                  i(
                    "p",
                    Sr,
                    r(a("life.companion.persona.attachmentHint")),
                    1
                    /* TEXT */
                  )
                ],
                64
                /* STABLE_FRAGMENT */
              )) : (v(), g(
                "p",
                Cr,
                r(a("life.companion.persona.attachmentDisabled")),
                1
                /* TEXT */
              )),
              w.value.tsundere && w.value.tsundere.type ? (v(), g(
                Q,
                { key: 3 },
                [
                  i(
                    "h4",
                    null,
                    r(a("life.companion.persona.tsundereHeading")),
                    1
                    /* TEXT */
                  ),
                  i("div", Mr, [
                    i("label", null, [
                      i(
                        "span",
                        null,
                        r(a("life.companion.persona.tsundereType")),
                        1
                        /* TEXT */
                      ),
                      i("input", {
                        class: "field",
                        value: w.value.tsundere.type,
                        disabled: ""
                      }, null, 8, zr)
                    ]),
                    i("label", null, [
                      i(
                        "span",
                        null,
                        r(a("life.companion.persona.initialAffectionA")),
                        1
                        /* TEXT */
                      ),
                      P(i(
                        "input",
                        {
                          "onUpdate:modelValue": u[31] || (u[31] = (l) => w.value.tsundere.initial.A = l),
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
                          M,
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
                        r(a("life.companion.persona.initialTsunExpressionT")),
                        1
                        /* TEXT */
                      ),
                      P(i(
                        "input",
                        {
                          "onUpdate:modelValue": u[32] || (u[32] = (l) => w.value.tsundere.initial.T = l),
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
                          M,
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
                        r(a("life.companion.persona.initialYandereY")),
                        1
                        /* TEXT */
                      ),
                      P(i(
                        "input",
                        {
                          "onUpdate:modelValue": u[33] || (u[33] = (l) => w.value.tsundere.initial.Y = l),
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
                          M,
                          w.value.tsundere.initial.Y,
                          void 0,
                          { number: !0 }
                        ]
                      ])
                    ])
                  ]),
                  i(
                    "p",
                    Er,
                    r(a("life.companion.persona.tsundereHint")),
                    1
                    /* TEXT */
                  )
                ],
                64
                /* STABLE_FRAGMENT */
              )) : (v(), g(
                "p",
                Or,
                r(a("life.companion.persona.tsundereDisabled")),
                1
                /* TEXT */
              )),
              w.value.personadyn && w.value.personadyn.type ? (v(), g(
                Q,
                { key: 5 },
                [
                  i(
                    "h4",
                    null,
                    r(a("life.companion.persona.personadynHeading")),
                    1
                    /* TEXT */
                  ),
                  i("div", Ar, [
                    i("label", null, [
                      i(
                        "span",
                        null,
                        r(a("life.companion.persona.personaArchetype")),
                        1
                        /* TEXT */
                      ),
                      i("input", {
                        class: "field",
                        value: w.value.personadyn.type,
                        disabled: ""
                      }, null, 8, Ir)
                    ]),
                    i("label", null, [
                      i(
                        "span",
                        null,
                        r(a("life.companion.persona.initialAffectionA")),
                        1
                        /* TEXT */
                      ),
                      P(i(
                        "input",
                        {
                          "onUpdate:modelValue": u[34] || (u[34] = (l) => w.value.personadyn.initial.A = l),
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
                          M,
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
                        r(a("life.companion.persona.initialAnxietyX")),
                        1
                        /* TEXT */
                      ),
                      P(i(
                        "input",
                        {
                          "onUpdate:modelValue": u[35] || (u[35] = (l) => w.value.personadyn.initial.X = l),
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
                          M,
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
                        r(a("life.companion.persona.initialPossessionO")),
                        1
                        /* TEXT */
                      ),
                      P(i(
                        "input",
                        {
                          "onUpdate:modelValue": u[36] || (u[36] = (l) => w.value.personadyn.initial.O = l),
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
                          M,
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
                        r(a("life.companion.persona.initialTrustTr")),
                        1
                        /* TEXT */
                      ),
                      P(i(
                        "input",
                        {
                          "onUpdate:modelValue": u[37] || (u[37] = (l) => w.value.personadyn.initial.Tr = l),
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
                          M,
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
                        r(a("life.companion.persona.initialSelfControlK")),
                        1
                        /* TEXT */
                      ),
                      P(i(
                        "input",
                        {
                          "onUpdate:modelValue": u[38] || (u[38] = (l) => w.value.personadyn.initial.K = l),
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
                          M,
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
                        r(a("life.companion.persona.genderSocialScript")),
                        1
                        /* TEXT */
                      ),
                      Oe($e(Ue), {
                        modelValue: w.value.personadynGender,
                        "onUpdate:modelValue": u[39] || (u[39] = (l) => w.value.personadynGender = l),
                        options: Fe.value,
                        "aria-label": a("life.companion.persona.genderSocialScriptAria")
                      }, null, 8, ["modelValue", "options", "aria-label"])
                    ])
                  ]),
                  i(
                    "p",
                    Br,
                    r(a("life.companion.persona.personadynHint")),
                    1
                    /* TEXT */
                  )
                ],
                64
                /* STABLE_FRAGMENT */
              )) : (v(), g(
                "p",
                Zr,
                r(a("life.companion.persona.personadynDisabled")),
                1
                /* TEXT */
              ))
            ])) : E("v-if", !0)
          ],
          512
          /* NEED_PATCH */
        ), [
          [ui, ce.value === "persona"]
        ]),
        P(i(
          "section",
          Nr,
          [
            i("div", Rr, [
              i("div", null, [
                i(
                  "h2",
                  null,
                  r(a("life.companion.cognition.title")),
                  1
                  /* TEXT */
                ),
                i(
                  "p",
                  Dr,
                  r(a("life.companion.cognition.desc")),
                  1
                  /* TEXT */
                )
              ]),
              i("div", Vr, [
                i("button", {
                  class: "btn filled sm",
                  disabled: ue.value,
                  onClick: Me
                }, r(ue.value ? a("life.companion.saving") : a("life.companion.saveSettings")), 9, $r)
              ])
            ]),
            i("article", Ur, [
              i("h3", null, [
                z(
                  r(a("life.companion.life.title")) + " ",
                  1
                  /* TEXT */
                ),
                i(
                  "span",
                  {
                    class: D(["count-pill", { ok: ye.value?.alive }])
                  },
                  r(ye.value?.alive ? a("life.companion.life.alive") : a("life.companion.life.notStarted")),
                  3
                  /* TEXT, CLASS */
                )
              ]),
              i("div", Hr, [
                i("div", Fr, [
                  i(
                    "span",
                    null,
                    r(a("life.companion.life.status")),
                    1
                    /* TEXT */
                  ),
                  i(
                    "strong",
                    null,
                    r(ye.value?.alive ? a("life.companion.life.alive") : a("life.companion.life.notStarted")),
                    1
                    /* TEXT */
                  )
                ]),
                i("div", Wr, [
                  i(
                    "span",
                    null,
                    r(a("life.companion.life.livedFor")),
                    1
                    /* TEXT */
                  ),
                  i(
                    "strong",
                    null,
                    r(ji()),
                    1
                    /* TEXT */
                  )
                ]),
                i("div", Gr, [
                  i(
                    "span",
                    null,
                    r(a("life.companion.life.ticks")),
                    1
                    /* TEXT */
                  ),
                  i(
                    "strong",
                    null,
                    r(ye.value?.ticks ?? 0),
                    1
                    /* TEXT */
                  )
                ]),
                i("div", jr, [
                  i(
                    "span",
                    null,
                    r(a("life.companion.life.residentThinking")),
                    1
                    /* TEXT */
                  ),
                  i(
                    "strong",
                    null,
                    r(ye.value?.resident_running ? a("life.companion.status.running") : a("life.companion.status.stopped")),
                    1
                    /* TEXT */
                  )
                ]),
                i("div", qr, [
                  i(
                    "span",
                    null,
                    r(a("life.companion.life.proactive")),
                    1
                    /* TEXT */
                  ),
                  i(
                    "strong",
                    null,
                    r(ye.value?.proactive_enabled ? a("life.companion.on") : a("life.companion.off")),
                    1
                    /* TEXT */
                  )
                ]),
                i("div", Kr, [
                  i(
                    "span",
                    null,
                    r(a("life.companion.life.lastThought")),
                    1
                    /* TEXT */
                  ),
                  i(
                    "strong",
                    null,
                    r((ye.value?.last_tick || "").slice(0, 16).replace("T", " ") || "—"),
                    1
                    /* TEXT */
                  )
                ])
              ]),
              ye.value?.last_thought ? (v(), g(
                "p",
                Yr,
                r(a("life.companion.life.currentThought", { text: ye.value.last_thought })),
                1
                /* TEXT */
              )) : E("v-if", !0),
              ye.value?.focus ? (v(), g(
                "p",
                Jr,
                r(a("life.companion.life.focus", { text: ye.value.focus })),
                1
                /* TEXT */
              )) : E("v-if", !0),
              ye.value?.active_goal ? (v(), g(
                "p",
                Xr,
                r(a("life.companion.life.goal", { text: ye.value.active_goal })),
                1
                /* TEXT */
              )) : E("v-if", !0),
              i("div", Qr, [
                i("label", el, [
                  P(i(
                    "input",
                    {
                      type: "checkbox",
                      "onUpdate:modelValue": u[40] || (u[40] = (l) => Un.value = l)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [me, Un.value]
                  ]),
                  i(
                    "span",
                    null,
                    r(a("life.companion.life.greetOnStart")),
                    1
                    /* TEXT */
                  )
                ]),
                i("button", {
                  class: D(["btn sm", { filled: !ye.value?.alive }]),
                  disabled: pt.value || Le.value,
                  onClick: u[41] || (u[41] = (l) => ye.value?.alive ? Fn() : Hn())
                }, r(pt.value ? yn() : ye.value?.alive ? a("life.companion.life.pause") : a("life.companion.life.start")), 11, tl)
              ]),
              i(
                "p",
                nl,
                r(a("life.companion.life.hint")),
                1
                /* TEXT */
              )
            ]),
            i("article", il, [
              i("h3", null, [
                z(
                  r(a("life.companion.realtime.title")) + " ",
                  1
                  /* TEXT */
                ),
                i(
                  "span",
                  {
                    class: D(["count-pill", { ok: m.value?.enabled }])
                  },
                  r(m.value?.enabled ? a("life.companion.status.running") : a("life.companion.status.stopped")),
                  3
                  /* TEXT, CLASS */
                ),
                ti.value ? (v(), g(
                  "span",
                  ol,
                  r(a("life.companion.realtime.updatedAt", { time: ti.value })),
                  1
                  /* TEXT */
                )) : E("v-if", !0)
              ]),
              m.value ? (v(), g(
                Q,
                { key: 1 },
                [
                  i(
                    "div",
                    sl,
                    r(a("life.companion.realtime.atAGlance")),
                    1
                    /* TEXT */
                  ),
                  i(
                    "p",
                    rl,
                    r(a("life.companion.realtime.atAGlanceHint")),
                    1
                    /* TEXT */
                  ),
                  i("div", ll, [
                    tn.value ? (v(), g("div", {
                      key: 0,
                      class: "mood-plot-wrap",
                      role: "img",
                      "aria-label": a(gi.value)
                    }, [
                      i(
                        "span",
                        cl,
                        r(a("life.companion.axis.arousalHigh")),
                        1
                        /* TEXT */
                      ),
                      i(
                        "span",
                        dl,
                        r(a("life.companion.axis.arousalLow")),
                        1
                        /* TEXT */
                      ),
                      i(
                        "span",
                        hl,
                        r(a("life.companion.axis.valenceLow")),
                        1
                        /* TEXT */
                      ),
                      i(
                        "span",
                        pl,
                        r(a("life.companion.axis.valenceHigh")),
                        1
                        /* TEXT */
                      ),
                      (v(), g("svg", fl, [
                        u[102] || (u[102] = i(
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
                        u[103] || (u[103] = i(
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
                        u[104] || (u[104] = i(
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
                          cx: kn.value.x,
                          cy: kn.value.y,
                          r: "12"
                        }, null, 8, ml),
                        i("circle", {
                          class: "plot-dot",
                          cx: kn.value.x,
                          cy: kn.value.y,
                          r: "5"
                        }, null, 8, _l)
                      ])),
                      i(
                        "span",
                        vl,
                        r(a(gi.value)),
                        1
                        /* TEXT */
                      )
                    ], 8, ul)) : E("v-if", !0),
                    i("div", gl, [
                      i(
                        "p",
                        yl,
                        r(a("life.companion.realtime.section.mood")),
                        1
                        /* TEXT */
                      ),
                      (v(!0), g(
                        Q,
                        null,
                        Ee(Ki.value, (l) => (v(), g("div", {
                          key: l.label,
                          class: "gauge",
                          title: l.effect
                        }, [
                          i("span", wl, [
                            i("span", xl, [
                              z(
                                r(l.label),
                                1
                                /* TEXT */
                              ),
                              i(
                                "em",
                                kl,
                                r(l.alias),
                                1
                                /* TEXT */
                              )
                            ]),
                            i("span", Pl, [
                              i(
                                "b",
                                {
                                  class: D(["gauge-state", l.stateTone])
                                },
                                r(l.state),
                                3
                                /* TEXT, CLASS */
                              ),
                              z(
                                " " + r(l.display),
                                1
                                /* TEXT */
                              )
                            ])
                          ]),
                          i(
                            "span",
                            {
                              class: D(["gauge-bar", { signed: l.signed }])
                            },
                            [
                              i(
                                "i",
                                {
                                  class: D(["gauge-fill", l.signed ? l.value >= 0 ? "good" : "bad" : ft(l)]),
                                  style: ot(l.signed ? at(l.value) : { width: (tt(l) * 100).toFixed(1) + "%" })
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
                            Ll,
                            r(l.effect),
                            1
                            /* TEXT */
                          )
                        ], 8, bl))),
                        128
                        /* KEYED_FRAGMENT */
                      ))
                    ]),
                    i("div", Tl, [
                      i("p", Sl, [
                        z(
                          r(a("life.companion.body.title")) + " ",
                          1
                          /* TEXT */
                        ),
                        i(
                          "span",
                          {
                            class: D(["chip", { muted: Tt.value?.is_sleeping, ok: Tt.value && !Tt.value.is_sleeping }])
                          },
                          r(Tt.value ? Tt.value.is_sleeping ? a("life.companion.body.sleeping") : a("life.companion.body.awake") : "—"),
                          3
                          /* TEXT, CLASS */
                        )
                      ]),
                      (v(!0), g(
                        Q,
                        null,
                        Ee(st.value, (l) => (v(), g("div", {
                          key: l.label,
                          class: "gauge",
                          title: l.effect
                        }, [
                          i("span", Ml, [
                            i("span", zl, [
                              z(
                                r(l.label),
                                1
                                /* TEXT */
                              ),
                              i(
                                "em",
                                El,
                                r(l.alias),
                                1
                                /* TEXT */
                              )
                            ]),
                            i("span", Ol, [
                              i(
                                "b",
                                {
                                  class: D(["gauge-state", l.stateTone])
                                },
                                r(l.state),
                                3
                                /* TEXT, CLASS */
                              ),
                              z(
                                " " + r(l.display),
                                1
                                /* TEXT */
                              )
                            ])
                          ]),
                          i(
                            "span",
                            {
                              class: D(["gauge-bar", { signed: l.signed }])
                            },
                            [
                              i(
                                "i",
                                {
                                  class: D(["gauge-fill", l.signed ? l.value >= 0 ? "good" : "bad" : ft(l)]),
                                  style: ot(l.signed ? at(l.value) : { width: (tt(l) * 100).toFixed(1) + "%" })
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
                            Al,
                            r(l.effect),
                            1
                            /* TEXT */
                          )
                        ], 8, Cl))),
                        128
                        /* KEYED_FRAGMENT */
                      ))
                    ])
                  ]),
                  i(
                    "div",
                    Il,
                    r(a("life.companion.realtime.section.mood")),
                    1
                    /* TEXT */
                  ),
                  i(
                    "p",
                    Bl,
                    r(a("life.companion.realtime.sectionSub.mood")),
                    1
                    /* TEXT */
                  ),
                  i("div", Zl, [
                    (v(!0), g(
                      Q,
                      null,
                      Ee(Z.value, (l) => (v(), g("div", {
                        key: l.label,
                        class: "gauge",
                        title: l.effect
                      }, [
                        i("span", Rl, [
                          i("span", Dl, [
                            z(
                              r(l.label),
                              1
                              /* TEXT */
                            ),
                            i(
                              "em",
                              Vl,
                              r(l.alias),
                              1
                              /* TEXT */
                            )
                          ]),
                          i("span", $l, [
                            i(
                              "b",
                              {
                                class: D(["gauge-state", l.stateTone])
                              },
                              r(l.state),
                              3
                              /* TEXT, CLASS */
                            ),
                            z(
                              " " + r(l.display),
                              1
                              /* TEXT */
                            )
                          ])
                        ]),
                        i(
                          "span",
                          {
                            class: D(["gauge-bar", { signed: l.signed }])
                          },
                          [
                            i(
                              "i",
                              {
                                class: D(["gauge-fill", l.signed ? l.value >= 0 ? "good" : "bad" : ft(l)]),
                                style: ot(l.signed ? at(l.value) : { width: (tt(l) * 100).toFixed(1) + "%" })
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
                          Ul,
                          r(l.effect),
                          1
                          /* TEXT */
                        )
                      ], 8, Nl))),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ]),
                  Wn.value ? (v(), g("div", Hl, [
                    (v(!0), g(
                      Q,
                      null,
                      Ee(Wn.value, (l, B) => (v(), g("div", {
                        key: B,
                        class: "som-chan"
                      }, [
                        i(
                          "span",
                          Fl,
                          r(fi(B)),
                          1
                          /* TEXT */
                        ),
                        i("span", Wl, [
                          i(
                            "i",
                            {
                              style: ot({ transform: "scaleX(" + mi(l) + ")" })
                            },
                            null,
                            4
                            /* STYLE */
                          )
                        ]),
                        i(
                          "span",
                          Gl,
                          r(ke(l, 2)),
                          1
                          /* TEXT */
                        )
                      ]))),
                      128
                      /* KEYED_FRAGMENT */
                    )),
                    Number(G.value?.somatic_chronicity) > 0.1 ? (v(), g(
                      "p",
                      jl,
                      r(a("life.companion.realtime.somaticChronicity", { value: ke(G.value?.somatic_chronicity) })),
                      1
                      /* TEXT */
                    )) : E("v-if", !0)
                  ])) : E("v-if", !0),
                  ie.value || et.value ? (v(), g(
                    Q,
                    { key: 1 },
                    [
                      i(
                        "div",
                        ql,
                        r(a("life.companion.realtime.section.social")),
                        1
                        /* TEXT */
                      ),
                      i(
                        "p",
                        Kl,
                        r(a("life.companion.realtime.sectionSub.social")),
                        1
                        /* TEXT */
                      ),
                      i("div", Yl, [
                        (v(!0), g(
                          Q,
                          null,
                          Ee(bi.value, (l) => (v(), g("div", {
                            key: l.label,
                            class: "gauge",
                            title: l.effect
                          }, [
                            i("span", Xl, [
                              i("span", Ql, [
                                z(
                                  r(l.label),
                                  1
                                  /* TEXT */
                                ),
                                i(
                                  "em",
                                  eu,
                                  r(l.alias),
                                  1
                                  /* TEXT */
                                )
                              ]),
                              i("span", tu, [
                                i(
                                  "b",
                                  {
                                    class: D(["gauge-state", l.stateTone])
                                  },
                                  r(l.state),
                                  3
                                  /* TEXT, CLASS */
                                ),
                                z(
                                  " " + r(l.display),
                                  1
                                  /* TEXT */
                                )
                              ])
                            ]),
                            i(
                              "span",
                              {
                                class: D(["gauge-bar", { signed: l.signed }])
                              },
                              [
                                i(
                                  "i",
                                  {
                                    class: D(["gauge-fill", l.signed ? l.value >= 0 ? "good" : "bad" : ft(l)]),
                                    style: ot(l.signed ? at(l.value) : { width: (tt(l) * 100).toFixed(1) + "%" })
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
                              nu,
                              r(l.effect),
                              1
                              /* TEXT */
                            )
                          ], 8, Jl))),
                          128
                          /* KEYED_FRAGMENT */
                        ))
                      ]),
                      i("div", iu, [
                        i(
                          "span",
                          ou,
                          r(a("life.companion.metric.perspectiveStage")) + " " + r(ie.value?.perspective_name || "—"),
                          1
                          /* TEXT */
                        ),
                        i(
                          "span",
                          au,
                          r(a("life.companion.metric.attentionState")) + " " + r(et.value?.attention_state || "—"),
                          1
                          /* TEXT */
                        )
                      ])
                    ],
                    64
                    /* STABLE_FRAGMENT */
                  )) : E("v-if", !0),
                  Re.value?.enabled ? (v(), g(
                    Q,
                    { key: 2 },
                    [
                      i(
                        "div",
                        su,
                        r(a("life.companion.realtime.section.attachment")),
                        1
                        /* TEXT */
                      ),
                      i(
                        "p",
                        ru,
                        r(a("life.companion.realtime.sectionSub.attachment")),
                        1
                        /* TEXT */
                      ),
                      i("div", lu, [
                        i(
                          "span",
                          uu,
                          r(Re.value.label || Re.value.type),
                          1
                          /* TEXT */
                        ),
                        i(
                          "span",
                          cu,
                          r(a("life.companion.metric.severity")) + " " + r(ke(Re.value.severity, 2)) + " · " + r(Re.value.band),
                          1
                          /* TEXT */
                        ),
                        i(
                          "span",
                          du,
                          r(a("life.companion.metric.dominantTendency")) + " " + r(Re.value.dominant || "—"),
                          1
                          /* TEXT */
                        ),
                        i(
                          "span",
                          {
                            class: D(["chip", Re.value.safe_mode ? "warn" : "muted"])
                          },
                          r(a("life.companion.metric.safetyLayer")) + " " + r(Re.value.safe_mode ? a("life.companion.metric.triggered") : a("life.companion.metric.normal")),
                          3
                          /* TEXT, CLASS */
                        )
                      ]),
                      i("div", hu, [
                        (v(!0), g(
                          Q,
                          null,
                          Ee(wi.value, (l) => (v(), g("div", {
                            key: l.label,
                            class: "gauge",
                            title: l.effect
                          }, [
                            i("span", fu, [
                              i("span", mu, [
                                z(
                                  r(l.label),
                                  1
                                  /* TEXT */
                                ),
                                i(
                                  "em",
                                  _u,
                                  r(l.alias),
                                  1
                                  /* TEXT */
                                )
                              ]),
                              i("span", vu, [
                                i(
                                  "b",
                                  {
                                    class: D(["gauge-state", l.stateTone])
                                  },
                                  r(l.state),
                                  3
                                  /* TEXT, CLASS */
                                ),
                                z(
                                  " " + r(l.display),
                                  1
                                  /* TEXT */
                                )
                              ])
                            ]),
                            i(
                              "span",
                              {
                                class: D(["gauge-bar", { signed: l.signed }])
                              },
                              [
                                i(
                                  "i",
                                  {
                                    class: D(["gauge-fill", l.signed ? l.value >= 0 ? "good" : "bad" : ft(l)]),
                                    style: ot(l.signed ? at(l.value) : { width: (tt(l) * 100).toFixed(1) + "%" })
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
                              gu,
                              r(l.effect),
                              1
                              /* TEXT */
                            )
                          ], 8, pu))),
                          128
                          /* KEYED_FRAGMENT */
                        ))
                      ])
                    ],
                    64
                    /* STABLE_FRAGMENT */
                  )) : E("v-if", !0),
                  Ae.value?.enabled ? (v(), g(
                    Q,
                    { key: 3 },
                    [
                      i(
                        "div",
                        yu,
                        r(a("life.companion.realtime.section.tsundere")),
                        1
                        /* TEXT */
                      ),
                      i(
                        "p",
                        bu,
                        r(a("life.companion.realtime.sectionSub.tsundere")),
                        1
                        /* TEXT */
                      ),
                      i("div", wu, [
                        i(
                          "span",
                          xu,
                          r(Ae.value.label || Ae.value.type),
                          1
                          /* TEXT */
                        ),
                        i(
                          "span",
                          {
                            class: D(["chip", Ae.value.safe_mode ? "warn" : "muted"])
                          },
                          r(a("life.companion.metric.safetyLayer")) + " " + r(Ae.value.safe_mode ? a("life.companion.metric.triggered") : a("life.companion.metric.normal")),
                          3
                          /* TEXT, CLASS */
                        )
                      ]),
                      i("div", ku, [
                        (v(!0), g(
                          Q,
                          null,
                          Ee(xi.value, (l) => (v(), g("div", {
                            key: l.label,
                            class: "gauge",
                            title: l.effect
                          }, [
                            i("span", Lu, [
                              i("span", Tu, [
                                z(
                                  r(l.label),
                                  1
                                  /* TEXT */
                                ),
                                i(
                                  "em",
                                  Su,
                                  r(l.alias),
                                  1
                                  /* TEXT */
                                )
                              ]),
                              i("span", Cu, [
                                i(
                                  "b",
                                  {
                                    class: D(["gauge-state", l.stateTone])
                                  },
                                  r(l.state),
                                  3
                                  /* TEXT, CLASS */
                                ),
                                z(
                                  " " + r(l.display),
                                  1
                                  /* TEXT */
                                )
                              ])
                            ]),
                            i(
                              "span",
                              {
                                class: D(["gauge-bar", { signed: l.signed }])
                              },
                              [
                                i(
                                  "i",
                                  {
                                    class: D(["gauge-fill", l.signed ? l.value >= 0 ? "good" : "bad" : ft(l)]),
                                    style: ot(l.signed ? at(l.value) : { width: (tt(l) * 100).toFixed(1) + "%" })
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
                              Mu,
                              r(l.effect),
                              1
                              /* TEXT */
                            )
                          ], 8, Pu))),
                          128
                          /* KEYED_FRAGMENT */
                        ))
                      ])
                    ],
                    64
                    /* STABLE_FRAGMENT */
                  )) : E("v-if", !0),
                  qe.value?.enabled ? (v(), g(
                    Q,
                    { key: 4 },
                    [
                      i(
                        "div",
                        zu,
                        r(a("life.companion.realtime.section.yandere")),
                        1
                        /* TEXT */
                      ),
                      i(
                        "p",
                        Eu,
                        r(a("life.companion.realtime.sectionSub.yandere")),
                        1
                        /* TEXT */
                      ),
                      i("div", Ou, [
                        i(
                          "span",
                          Au,
                          r(qe.value.label || qe.value.type),
                          1
                          /* TEXT */
                        ),
                        i(
                          "span",
                          Iu,
                          r(a("life.companion.metric.yandereMode")) + " " + r(qe.value.mode) + " · " + r(qe.value.label_russell),
                          1
                          /* TEXT */
                        ),
                        i(
                          "span",
                          {
                            class: D(["chip", qe.value.safe_mode ? "warn" : "muted"])
                          },
                          r(a("life.companion.metric.safetyLayer")) + " " + r(qe.value.safe_mode ? a("life.companion.metric.triggered") : a("life.companion.metric.normal")),
                          3
                          /* TEXT, CLASS */
                        )
                      ]),
                      i("div", Bu, [
                        (v(!0), g(
                          Q,
                          null,
                          Ee(ki.value, (l) => (v(), g("div", {
                            key: l.label,
                            class: "gauge",
                            title: l.effect
                          }, [
                            i("span", Nu, [
                              i("span", Ru, [
                                z(
                                  r(l.label),
                                  1
                                  /* TEXT */
                                ),
                                i(
                                  "em",
                                  Du,
                                  r(l.alias),
                                  1
                                  /* TEXT */
                                )
                              ]),
                              i("span", Vu, [
                                i(
                                  "b",
                                  {
                                    class: D(["gauge-state", l.stateTone])
                                  },
                                  r(l.state),
                                  3
                                  /* TEXT, CLASS */
                                ),
                                z(
                                  " " + r(l.display),
                                  1
                                  /* TEXT */
                                )
                              ])
                            ]),
                            i(
                              "span",
                              {
                                class: D(["gauge-bar", { signed: l.signed }])
                              },
                              [
                                i(
                                  "i",
                                  {
                                    class: D(["gauge-fill", l.signed ? l.value >= 0 ? "good" : "bad" : ft(l)]),
                                    style: ot(l.signed ? at(l.value) : { width: (tt(l) * 100).toFixed(1) + "%" })
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
                              $u,
                              r(l.effect),
                              1
                              /* TEXT */
                            )
                          ], 8, Zu))),
                          128
                          /* KEYED_FRAGMENT */
                        ))
                      ])
                    ],
                    64
                    /* STABLE_FRAGMENT */
                  )) : E("v-if", !0),
                  V.value?.enabled ? (v(), g(
                    Q,
                    { key: 5 },
                    [
                      i(
                        "div",
                        Uu,
                        r(a("life.companion.realtime.section.pd")),
                        1
                        /* TEXT */
                      ),
                      i(
                        "p",
                        Hu,
                        r(a("life.companion.realtime.sectionSub.pd")),
                        1
                        /* TEXT */
                      ),
                      i("div", Fu, [
                        i(
                          "span",
                          Wu,
                          r(V.value.label || V.value.type),
                          1
                          /* TEXT */
                        ),
                        i(
                          "span",
                          Gu,
                          r(a("life.companion.metric.emergentMode")) + " " + r(V.value.mode_label || V.value.mode) + " · " + r(V.value.band),
                          1
                          /* TEXT */
                        ),
                        V.value.gender ? (v(), g(
                          "span",
                          ju,
                          r(V.value.gender),
                          1
                          /* TEXT */
                        )) : E("v-if", !0),
                        V.value.clinical ? (v(), g(
                          "span",
                          qu,
                          r(a("life.companion.simulationMode")),
                          1
                          /* TEXT */
                        )) : E("v-if", !0)
                      ]),
                      i("div", Ku, [
                        (v(!0), g(
                          Q,
                          null,
                          Ee(qn.value, (l) => (v(), g("div", {
                            key: l.label,
                            class: "gauge",
                            title: l.effect
                          }, [
                            i("span", Ju, [
                              i("span", Xu, [
                                z(
                                  r(l.label),
                                  1
                                  /* TEXT */
                                ),
                                i(
                                  "em",
                                  Qu,
                                  r(l.alias),
                                  1
                                  /* TEXT */
                                )
                              ]),
                              i("span", ec, [
                                i(
                                  "b",
                                  {
                                    class: D(["gauge-state", l.stateTone])
                                  },
                                  r(l.state),
                                  3
                                  /* TEXT, CLASS */
                                ),
                                z(
                                  " " + r(l.display),
                                  1
                                  /* TEXT */
                                )
                              ])
                            ]),
                            i(
                              "span",
                              {
                                class: D(["gauge-bar", { signed: l.signed }])
                              },
                              [
                                i(
                                  "i",
                                  {
                                    class: D(["gauge-fill", l.signed ? l.value >= 0 ? "good" : "bad" : ft(l)]),
                                    style: ot(l.signed ? at(l.value) : { width: (tt(l) * 100).toFixed(1) + "%" })
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
                              tc,
                              r(l.effect),
                              1
                              /* TEXT */
                            )
                          ], 8, Yu))),
                          128
                          /* KEYED_FRAGMENT */
                        ))
                      ]),
                      i("details", nc, [
                        i(
                          "summary",
                          null,
                          r(a("life.companion.realtime.moreReadouts")),
                          1
                          /* TEXT */
                        ),
                        i("div", ic, [
                          V.value.help_seek != null ? (v(), g("div", oc, [
                            i(
                              "span",
                              null,
                              r(a("life.companion.metric.helpSeeking")),
                              1
                              /* TEXT */
                            ),
                            i(
                              "strong",
                              null,
                              r(ke(V.value.help_seek, 2)),
                              1
                              /* TEXT */
                            )
                          ])) : E("v-if", !0),
                          V.value.big5 ? (v(), g("div", ac, [
                            u[105] || (u[105] = i(
                              "span",
                              null,
                              "Big5 O·C·E·A·N",
                              -1
                              /* CACHED */
                            )),
                            i(
                              "strong",
                              null,
                              r(Dn.value),
                              1
                              /* TEXT */
                            )
                          ])) : E("v-if", !0),
                          V.value.hexaco ? (v(), g("div", sc, [
                            u[106] || (u[106] = i(
                              "span",
                              null,
                              "HEXACO H·E·X·A·C·O",
                              -1
                              /* CACHED */
                            )),
                            i(
                              "strong",
                              null,
                              r(Gi.value),
                              1
                              /* TEXT */
                            )
                          ])) : E("v-if", !0),
                          V.value.mbti ? (v(), g("div", rc, [
                            u[107] || (u[107] = i(
                              "span",
                              null,
                              "MBTI / DISC",
                              -1
                              /* CACHED */
                            )),
                            i(
                              "strong",
                              null,
                              r(V.value.mbti) + " · " + r(V.value.disc || "—"),
                              1
                              /* TEXT */
                            )
                          ])) : E("v-if", !0),
                          V.value.theta_dim ? (v(), g("div", lc, [
                            i(
                              "span",
                              null,
                              r(a("life.companion.metric.thetaDim")),
                              1
                              /* TEXT */
                            ),
                            i(
                              "strong",
                              null,
                              r(a("life.companion.dimensionsValue", { n: V.value.theta_dim })) + " · " + r(V.value.family || "—"),
                              1
                              /* TEXT */
                            )
                          ])) : E("v-if", !0),
                          $n.value.length ? (v(), g("div", uc, [
                            i(
                              "span",
                              null,
                              r(a("life.companion.metric.topDesires")),
                              1
                              /* TEXT */
                            ),
                            i(
                              "strong",
                              null,
                              r($n.value.join(" · ")),
                              1
                              /* TEXT */
                            )
                          ])) : E("v-if", !0),
                          _n.value.length ? (v(), g("div", cc, [
                            i(
                              "span",
                              null,
                              r(a("life.companion.metric.topEmotions")),
                              1
                              /* TEXT */
                            ),
                            i(
                              "strong",
                              null,
                              r(_n.value.join(" · ")),
                              1
                              /* TEXT */
                            )
                          ])) : E("v-if", !0),
                          V.value.learning?.enabled ? (v(), g("div", dc, [
                            i(
                              "span",
                              null,
                              r(a("life.companion.metric.learningState")),
                              1
                              /* TEXT */
                            ),
                            i(
                              "strong",
                              null,
                              r(V.value.learning.q_size) + " · " + r(ke(vn.value, 3)),
                              1
                              /* TEXT */
                            )
                          ])) : E("v-if", !0)
                        ])
                      ])
                    ],
                    64
                    /* STABLE_FRAGMENT */
                  )) : E("v-if", !0),
                  i("details", hc, [
                    i(
                      "summary",
                      null,
                      r(a("life.companion.realtime.moreReadouts")),
                      1
                      /* TEXT */
                    ),
                    i("div", pc, [
                      i("div", fc, [
                        i(
                          "span",
                          null,
                          r(a("life.companion.metric.arbitrationMode")),
                          1
                          /* TEXT */
                        ),
                        i(
                          "strong",
                          null,
                          r(T.value?.mode || "—"),
                          1
                          /* TEXT */
                        )
                      ]),
                      i("div", mc, [
                        i(
                          "span",
                          null,
                          r(a("life.companion.metric.currentStrategy")),
                          1
                          /* TEXT */
                        ),
                        i(
                          "strong",
                          null,
                          r(T.value?.action || "—"),
                          1
                          /* TEXT */
                        )
                      ]),
                      i("div", _c, [
                        i(
                          "span",
                          null,
                          r(a("life.companion.metric.controlNeed")),
                          1
                          /* TEXT */
                        ),
                        i(
                          "strong",
                          null,
                          r(ke(T.value?.need)),
                          1
                          /* TEXT */
                        )
                      ]),
                      i("div", vc, [
                        i(
                          "span",
                          null,
                          r(a("life.companion.metric.confidence")),
                          1
                          /* TEXT */
                        ),
                        i(
                          "strong",
                          null,
                          r(ke(T.value?.confidence)),
                          1
                          /* TEXT */
                        )
                      ]),
                      i("div", gc, [
                        i(
                          "span",
                          null,
                          r(a("life.companion.metric.decidedTurns")),
                          1
                          /* TEXT */
                        ),
                        i(
                          "strong",
                          null,
                          r(b.value?.turns ?? 0),
                          1
                          /* TEXT */
                        )
                      ]),
                      i("div", yc, [
                        i(
                          "span",
                          null,
                          r(a("life.companion.metric.engrams")),
                          1
                          /* TEXT */
                        ),
                        i(
                          "strong",
                          null,
                          r(b.value?.engrams ?? 0),
                          1
                          /* TEXT */
                        )
                      ]),
                      i("div", bc, [
                        i(
                          "span",
                          null,
                          r(a("life.companion.metric.reliability")),
                          1
                          /* TEXT */
                        ),
                        i(
                          "strong",
                          null,
                          r(ke(b.value?.reliability)),
                          1
                          /* TEXT */
                        )
                      ]),
                      i("div", wc, [
                        i(
                          "span",
                          null,
                          r(a("life.companion.metric.personaTraits")),
                          1
                          /* TEXT */
                        ),
                        i(
                          "strong",
                          null,
                          r(je.value?.applied ? je.value.source === "llm" ? a("life.companion.metric.appliedLlm") : a("life.companion.metric.appliedLocal") : a("life.companion.metric.notParsed")),
                          1
                          /* TEXT */
                        )
                      ]),
                      i("div", xc, [
                        i(
                          "span",
                          null,
                          r(a("life.companion.metric.lexicon")),
                          1
                          /* TEXT */
                        ),
                        i(
                          "strong",
                          null,
                          r(ne.value?.lexicon_size ?? 0),
                          1
                          /* TEXT */
                        )
                      ]),
                      gt.value ? (v(), g(
                        Q,
                        { key: 0 },
                        [
                          i("div", kc, [
                            i(
                              "span",
                              null,
                              r(a("life.companion.metric.episodeCourse")),
                              1
                              /* TEXT */
                            ),
                            i(
                              "strong",
                              null,
                              r(hi(gt.value.state)),
                              1
                              /* TEXT */
                            )
                          ]),
                          i("div", Pc, [
                            i(
                              "span",
                              null,
                              r(a("life.companion.metric.episodeSeverity")),
                              1
                              /* TEXT */
                            ),
                            i(
                              "strong",
                              null,
                              r(ke(gt.value.severity, 2)),
                              1
                              /* TEXT */
                            )
                          ]),
                          i("div", Lc, [
                            i(
                              "span",
                              null,
                              r(a("life.companion.metric.episodesRelapses")),
                              1
                              /* TEXT */
                            ),
                            i(
                              "strong",
                              null,
                              r(gt.value.episodes) + " / " + r(gt.value.relapses),
                              1
                              /* TEXT */
                            )
                          ]),
                          gt.value.state === "episode" ? (v(), g("div", Tc, [
                            i(
                              "span",
                              null,
                              r(a("life.companion.metric.duration")),
                              1
                              /* TEXT */
                            ),
                            i(
                              "strong",
                              null,
                              r(a("life.companion.daysValue", { n: ke(gt.value.days_in_episode, 1) })),
                              1
                              /* TEXT */
                            )
                          ])) : E("v-if", !0)
                        ],
                        64
                        /* STABLE_FRAGMENT */
                      )) : E("v-if", !0)
                    ])
                  ])
                ],
                64
                /* STABLE_FRAGMENT */
              )) : (v(), g(
                "div",
                al,
                r(a("life.companion.realtime.empty")),
                1
                /* TEXT */
              )),
              gt.value ? (v(), g(
                "p",
                Sc,
                r(a("life.companion.realtime.episodeHint")),
                1
                /* TEXT */
              )) : E("v-if", !0),
              Re.value?.enabled ? (v(), g(
                "p",
                Cc,
                r(a("life.companion.realtime.attachmentHint", { label: Re.value.label, severity: ke(Re.value.severity, 2), band: Re.value.band, safety: Re.value.safe_mode ? a("life.companion.realtime.safetyOnEmotion") : a("life.companion.realtime.safetyOff") })),
                1
                /* TEXT */
              )) : E("v-if", !0),
              Ae.value?.enabled ? (v(), g(
                "p",
                Mc,
                r(a("life.companion.realtime.tsundereHint", { label: Ae.value.label || Ae.value.type, affection: ke(Ae.value.affection, 2), expression: ke(Ae.value.expression, 2), fixation: ke(Ae.value.fixation, 2), band: Ae.value.band, safety: Ae.value.safe_mode ? a("life.companion.realtime.safetyOnFeeling") : a("life.companion.realtime.safetyOff") })),
                1
                /* TEXT */
              )) : E("v-if", !0),
              V.value?.enabled ? (v(), g(
                "p",
                zc,
                r(a("life.companion.realtime.personadynHint", { label: V.value.label || V.value.type, family: V.value.family || "—", theta: V.value.theta_dim, mode: V.value.mode_label || V.value.mode, pressure: ke(V.value.pressure, 2), band: V.value.band, gender: V.value.gender || O("life.companion.pdGender.unspecified"), learning: V.value.learning?.enabled ? a("life.companion.realtime.learningOnline") : "", safety: V.value.safe_mode ? a("life.companion.realtime.safetyOnFeeling") : a("life.companion.realtime.safetyOff") })),
                1
                /* TEXT */
              )) : E("v-if", !0),
              je.value?.applied ? (v(), g(
                "p",
                Ec,
                r(a("life.companion.realtime.personaApplied", { source: je.value.source === "llm" ? a("life.companion.realtime.personaSourceLlm") : a("life.companion.realtime.personaSourceLocal"), evidence: Gn.value || "—" })),
                1
                /* TEXT */
              )) : E("v-if", !0)
            ]),
            i("article", Oc, [
              i(
                "h3",
                null,
                r(a("life.companion.switches.title")),
                1
                /* TEXT */
              ),
              i("div", Ac, [
                i("label", Ic, [
                  P(i(
                    "input",
                    {
                      type: "checkbox",
                      "onUpdate:modelValue": u[42] || (u[42] = (l) => _.value.cog_enabled = l)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [me, _.value.cog_enabled]
                  ]),
                  i(
                    "span",
                    null,
                    r(a("life.companion.switches.enableCognition")),
                    1
                    /* TEXT */
                  )
                ]),
                i("label", Bc, [
                  P(i(
                    "input",
                    {
                      type: "checkbox",
                      "onUpdate:modelValue": u[43] || (u[43] = (l) => _.value.cog_lite_mode = l)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [me, _.value.cog_lite_mode]
                  ]),
                  i(
                    "span",
                    null,
                    r(a("life.companion.switches.liteMode")),
                    1
                    /* TEXT */
                  )
                ]),
                i("label", Zc, [
                  P(i(
                    "input",
                    {
                      type: "checkbox",
                      "onUpdate:modelValue": u[44] || (u[44] = (l) => _.value.cog_modulate_affect = l)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [me, _.value.cog_modulate_affect]
                  ]),
                  i(
                    "span",
                    null,
                    r(a("life.companion.switches.modulateAffect")),
                    1
                    /* TEXT */
                  )
                ]),
                i("label", Nc, [
                  P(i(
                    "input",
                    {
                      type: "checkbox",
                      "onUpdate:modelValue": u[45] || (u[45] = (l) => _.value.cog_modulate_language = l)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [me, _.value.cog_modulate_language]
                  ]),
                  i(
                    "span",
                    null,
                    r(a("life.companion.switches.modulateLanguage")),
                    1
                    /* TEXT */
                  )
                ]),
                i("label", Rc, [
                  P(i(
                    "input",
                    {
                      type: "checkbox",
                      "onUpdate:modelValue": u[46] || (u[46] = (l) => _.value.cog_modulate_social = l)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [me, _.value.cog_modulate_social]
                  ]),
                  i(
                    "span",
                    null,
                    r(a("life.companion.switches.modulateSocial")),
                    1
                    /* TEXT */
                  )
                ]),
                i("label", Dc, [
                  P(i(
                    "input",
                    {
                      type: "checkbox",
                      "onUpdate:modelValue": u[47] || (u[47] = (l) => _.value.cog_modulate_selfhood = l)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [me, _.value.cog_modulate_selfhood]
                  ]),
                  i(
                    "span",
                    null,
                    r(a("life.companion.switches.modulateSelfhood")),
                    1
                    /* TEXT */
                  )
                ])
              ]),
              i(
                "p",
                Vc,
                r(a("life.companion.switches.hint")),
                1
                /* TEXT */
              )
            ]),
            i("article", $c, [
              i(
                "h3",
                null,
                r(a("life.companion.presets.title")),
                1
                /* TEXT */
              ),
              i(
                "p",
                Uc,
                r(a("life.companion.presets.hint")),
                1
                /* TEXT */
              ),
              i("div", Hc, [
                (v(), g(
                  Q,
                  null,
                  Ee(pi, (l) => i("button", {
                    key: l.label,
                    type: "button",
                    class: "btn sm",
                    onClick: (B) => qi(l.fields, l.label)
                  }, r(a(l.labelKey)), 9, Fc)),
                  64
                  /* STABLE_FRAGMENT */
                ))
              ])
            ]),
            i("div", Wc, [
              i("article", Gc, [
                i("h3", null, [
                  z(
                    r(a("life.companion.decision.title")) + " ",
                    1
                    /* TEXT */
                  ),
                  i(
                    "span",
                    {
                      class: D(["count-pill", be(!0).cls])
                    },
                    r(be(!0).text),
                    3
                    /* TEXT, CLASS */
                  )
                ]),
                i("div", jc, [
                  i("label", null, [
                    i(
                      "span",
                      null,
                      r(a("life.companion.decision.planDepth")),
                      1
                      /* TEXT */
                    ),
                    i(
                      "small",
                      qc,
                      r(a("life.companion.defaultHint", { n: ge.cog_plan_depth })),
                      1
                      /* TEXT */
                    ),
                    P(i(
                      "input",
                      {
                        "onUpdate:modelValue": u[48] || (u[48] = (l) => _.value.cog_plan_depth = l),
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
                        M,
                        _.value.cog_plan_depth,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  i("label", null, [
                    i(
                      "span",
                      null,
                      r(a("life.companion.decision.wmCapacity")),
                      1
                      /* TEXT */
                    ),
                    i(
                      "small",
                      Kc,
                      r(a("life.companion.defaultHint", { n: ge.cog_wm_capacity })),
                      1
                      /* TEXT */
                    ),
                    P(i(
                      "input",
                      {
                        "onUpdate:modelValue": u[49] || (u[49] = (l) => _.value.cog_wm_capacity = l),
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
                        M,
                        _.value.cog_wm_capacity,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  i("label", null, [
                    i(
                      "span",
                      null,
                      r(a("life.companion.decision.strategyTemp")),
                      1
                      /* TEXT */
                    ),
                    i(
                      "small",
                      Yc,
                      r(a("life.companion.defaultHint", { n: ge.cog_tau })),
                      1
                      /* TEXT */
                    ),
                    P(i(
                      "input",
                      {
                        "onUpdate:modelValue": u[50] || (u[50] = (l) => _.value.cog_tau = l),
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
                        M,
                        _.value.cog_tau,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  i("label", null, [
                    i(
                      "span",
                      null,
                      r(a("life.companion.decision.discount")),
                      1
                      /* TEXT */
                    ),
                    i(
                      "small",
                      Jc,
                      r(a("life.companion.defaultHint", { n: ge.cog_gamma })),
                      1
                      /* TEXT */
                    ),
                    P(i(
                      "input",
                      {
                        "onUpdate:modelValue": u[51] || (u[51] = (l) => _.value.cog_gamma = l),
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
                        M,
                        _.value.cog_gamma,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  i("label", null, [
                    i(
                      "span",
                      null,
                      r(a("life.companion.decision.habitRate")),
                      1
                      /* TEXT */
                    ),
                    i(
                      "small",
                      Xc,
                      r(a("life.companion.defaultHint", { n: ge.cog_alpha_habit })),
                      1
                      /* TEXT */
                    ),
                    P(i(
                      "input",
                      {
                        "onUpdate:modelValue": u[52] || (u[52] = (l) => _.value.cog_alpha_habit = l),
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
                        M,
                        _.value.cog_alpha_habit,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  i("label", null, [
                    i(
                      "span",
                      null,
                      r(a("life.companion.decision.modelfreeRate")),
                      1
                      /* TEXT */
                    ),
                    i(
                      "small",
                      Qc,
                      r(a("life.companion.defaultHint", { n: ge.cog_alpha_mf })),
                      1
                      /* TEXT */
                    ),
                    P(i(
                      "input",
                      {
                        "onUpdate:modelValue": u[53] || (u[53] = (l) => _.value.cog_alpha_mf = l),
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
                        M,
                        _.value.cog_alpha_mf,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  i("label", null, [
                    i(
                      "span",
                      null,
                      r(a("life.companion.decision.surpriseThreshold")),
                      1
                      /* TEXT */
                    ),
                    i(
                      "small",
                      ed,
                      r(a("life.companion.defaultHint", { n: ge.cog_theta_pe })),
                      1
                      /* TEXT */
                    ),
                    P(i(
                      "input",
                      {
                        "onUpdate:modelValue": u[54] || (u[54] = (l) => _.value.cog_theta_pe = l),
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
                        M,
                        _.value.cog_theta_pe,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  i("label", null, [
                    i(
                      "span",
                      null,
                      r(a("life.companion.decision.noveltyThreshold")),
                      1
                      /* TEXT */
                    ),
                    i(
                      "small",
                      td,
                      r(a("life.companion.defaultHint", { n: ge.cog_theta_n })),
                      1
                      /* TEXT */
                    ),
                    P(i(
                      "input",
                      {
                        "onUpdate:modelValue": u[55] || (u[55] = (l) => _.value.cog_theta_n = l),
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
                        M,
                        _.value.cog_theta_n,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  i("label", null, [
                    i(
                      "span",
                      null,
                      r(a("life.companion.decision.prospectionHorizon")),
                      1
                      /* TEXT */
                    ),
                    i(
                      "small",
                      nd,
                      r(a("life.companion.defaultHint", { n: ge.cog_prospection_horizon })),
                      1
                      /* TEXT */
                    ),
                    P(i(
                      "input",
                      {
                        "onUpdate:modelValue": u[56] || (u[56] = (l) => _.value.cog_prospection_horizon = l),
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
                        M,
                        _.value.cog_prospection_horizon,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ])
                ]),
                i("div", id, [
                  i("label", od, [
                    P(i(
                      "input",
                      {
                        type: "checkbox",
                        "onUpdate:modelValue": u[57] || (u[57] = (l) => _.value.cog_use_thalamic_gate = l)
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [me, _.value.cog_use_thalamic_gate]
                    ]),
                    i(
                      "span",
                      null,
                      r(a("life.companion.decision.thalamicGate")),
                      1
                      /* TEXT */
                    )
                  ]),
                  i("label", ad, [
                    P(i(
                      "input",
                      {
                        type: "checkbox",
                        "onUpdate:modelValue": u[58] || (u[58] = (l) => _.value.cog_use_cerebellum = l)
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [me, _.value.cog_use_cerebellum]
                    ]),
                    i(
                      "span",
                      null,
                      r(a("life.companion.decision.cerebellum")),
                      1
                      /* TEXT */
                    )
                  ]),
                  i("label", sd, [
                    P(i(
                      "input",
                      {
                        type: "checkbox",
                        "onUpdate:modelValue": u[59] || (u[59] = (l) => _.value.cog_use_ofc_map = l)
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [me, _.value.cog_use_ofc_map]
                    ]),
                    i(
                      "span",
                      null,
                      r(a("life.companion.decision.ofcMap")),
                      1
                      /* TEXT */
                    )
                  ]),
                  i("label", rd, [
                    P(i(
                      "input",
                      {
                        type: "checkbox",
                        "onUpdate:modelValue": u[60] || (u[60] = (l) => _.value.cog_use_prospection = l)
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [me, _.value.cog_use_prospection]
                    ]),
                    i(
                      "span",
                      null,
                      r(a("life.companion.decision.prospection")),
                      1
                      /* TEXT */
                    )
                  ]),
                  i("label", ld, [
                    P(i(
                      "input",
                      {
                        type: "checkbox",
                        "onUpdate:modelValue": u[61] || (u[61] = (l) => _.value.cog_use_limbic_bias = l)
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [me, _.value.cog_use_limbic_bias]
                    ]),
                    i(
                      "span",
                      null,
                      r(a("life.companion.decision.limbicBias")),
                      1
                      /* TEXT */
                    )
                  ])
                ])
              ]),
              i("article", ud, [
                i("h3", null, [
                  z(
                    r(a("life.companion.affect.title")) + " ",
                    1
                    /* TEXT */
                  ),
                  i(
                    "span",
                    {
                      class: D(["count-pill", be(!!_.value.cog_affect_enabled).cls])
                    },
                    r(be(!!_.value.cog_affect_enabled).text),
                    3
                    /* TEXT, CLASS */
                  )
                ]),
                i("div", cd, [
                  i("label", null, [
                    i(
                      "span",
                      null,
                      r(a("life.companion.persona.erqProfile")),
                      1
                      /* TEXT */
                    ),
                    Oe($e(Ue), {
                      modelValue: _.value.cog_affect_profile,
                      "onUpdate:modelValue": u[62] || (u[62] = (l) => _.value.cog_affect_profile = l),
                      options: Se.value,
                      "aria-label": a("life.companion.persona.erqProfile")
                    }, null, 8, ["modelValue", "options", "aria-label"])
                  ]),
                  i("label", null, [
                    i(
                      "span",
                      null,
                      r(a("life.companion.affect.vagalBaseline")),
                      1
                      /* TEXT */
                    ),
                    i(
                      "small",
                      dd,
                      r(a("life.companion.defaultHint", { n: ge.cog_affect_vagal })),
                      1
                      /* TEXT */
                    ),
                    P(i(
                      "input",
                      {
                        "onUpdate:modelValue": u[63] || (u[63] = (l) => _.value.cog_affect_vagal = l),
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
                        M,
                        _.value.cog_affect_vagal,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  i("label", null, [
                    i(
                      "span",
                      null,
                      r(a("life.companion.persona.threatBaseline")),
                      1
                      /* TEXT */
                    ),
                    i(
                      "small",
                      hd,
                      r(a("life.companion.defaultHint", { n: ge.cog_affect_threat })),
                      1
                      /* TEXT */
                    ),
                    P(i(
                      "input",
                      {
                        "onUpdate:modelValue": u[64] || (u[64] = (l) => _.value.cog_affect_threat = l),
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
                        M,
                        _.value.cog_affect_threat,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  i("label", null, [
                    i(
                      "span",
                      null,
                      r(a("life.companion.persona.rewardBaseline")),
                      1
                      /* TEXT */
                    ),
                    i(
                      "small",
                      pd,
                      r(a("life.companion.defaultHint", { n: ge.cog_affect_reward })),
                      1
                      /* TEXT */
                    ),
                    P(i(
                      "input",
                      {
                        "onUpdate:modelValue": u[65] || (u[65] = (l) => _.value.cog_affect_reward = l),
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
                        M,
                        _.value.cog_affect_reward,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ])
                ]),
                i("label", fd, [
                  P(i(
                    "input",
                    {
                      type: "checkbox",
                      "onUpdate:modelValue": u[66] || (u[66] = (l) => _.value.cog_affect_enabled = l)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [me, _.value.cog_affect_enabled]
                  ]),
                  i(
                    "span",
                    null,
                    r(a("life.companion.affect.enable")),
                    1
                    /* TEXT */
                  )
                ]),
                i("label", md, [
                  P(i(
                    "input",
                    {
                      type: "checkbox",
                      "onUpdate:modelValue": u[67] || (u[67] = (l) => _.value.cog_affect_somatic = l)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [me, _.value.cog_affect_somatic]
                  ]),
                  i(
                    "span",
                    null,
                    r(a("life.companion.affect.somatic")),
                    1
                    /* TEXT */
                  )
                ]),
                i("label", _d, [
                  P(i(
                    "input",
                    {
                      type: "checkbox",
                      "onUpdate:modelValue": u[68] || (u[68] = (l) => _.value.cog_affect_persona_llm = l)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [me, _.value.cog_affect_persona_llm]
                  ]),
                  i(
                    "span",
                    null,
                    r(a("life.companion.affect.personaLlm")),
                    1
                    /* TEXT */
                  )
                ])
              ]),
              i("article", vd, [
                i("h3", null, [
                  z(
                    r(a("life.companion.language.title")) + " ",
                    1
                    /* TEXT */
                  ),
                  i(
                    "span",
                    {
                      class: D(["count-pill", be(!!_.value.cog_language_enabled).cls])
                    },
                    r(be(!!_.value.cog_language_enabled).text),
                    3
                    /* TEXT, CLASS */
                  )
                ]),
                i("div", gd, [
                  i("label", null, [
                    i(
                      "span",
                      null,
                      r(a("life.companion.language.framing")),
                      1
                      /* TEXT */
                    ),
                    Oe($e(Ue), {
                      modelValue: _.value.cog_language_framing,
                      "onUpdate:modelValue": u[69] || (u[69] = (l) => _.value.cog_language_framing = l),
                      options: Ce.value,
                      "aria-label": a("life.companion.language.framing")
                    }, null, 8, ["modelValue", "options", "aria-label"])
                  ]),
                  i("label", null, [
                    i(
                      "span",
                      null,
                      r(a("life.companion.language.boundary")),
                      1
                      /* TEXT */
                    ),
                    P(i(
                      "input",
                      {
                        "onUpdate:modelValue": u[70] || (u[70] = (l) => _.value.cog_language_boundary = l),
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
                        M,
                        _.value.cog_language_boundary,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ])
                ]),
                i("label", yd, [
                  P(i(
                    "input",
                    {
                      type: "checkbox",
                      "onUpdate:modelValue": u[71] || (u[71] = (l) => _.value.cog_language_enabled = l)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [me, _.value.cog_language_enabled]
                  ]),
                  i(
                    "span",
                    null,
                    r(a("life.companion.language.enable")),
                    1
                    /* TEXT */
                  )
                ])
              ]),
              i("article", bd, [
                i("h3", null, [
                  z(
                    r(a("life.companion.social.title")) + " ",
                    1
                    /* TEXT */
                  ),
                  i(
                    "span",
                    {
                      class: D(["count-pill", be(!!_.value.cog_social_enabled).cls])
                    },
                    r(be(!!_.value.cog_social_enabled).text),
                    3
                    /* TEXT, CLASS */
                  )
                ]),
                i("div", wd, [
                  i("label", null, [
                    i(
                      "span",
                      null,
                      r(a("life.companion.metric.empathy")),
                      1
                      /* TEXT */
                    ),
                    P(i(
                      "input",
                      {
                        "onUpdate:modelValue": u[72] || (u[72] = (l) => _.value.cog_social_empathy = l),
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
                        M,
                        _.value.cog_social_empathy,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  i("label", null, [
                    i(
                      "span",
                      null,
                      r(a("life.companion.social.perspectiveStage")),
                      1
                      /* TEXT */
                    ),
                    Oe($e(Ue), {
                      modelValue: Qt.value,
                      "onUpdate:modelValue": u[73] || (u[73] = (l) => Qt.value = l),
                      options: Qe.value,
                      "aria-label": a("life.companion.social.perspectiveStage")
                    }, null, 8, ["modelValue", "options", "aria-label"])
                  ])
                ]),
                i("label", xd, [
                  P(i(
                    "input",
                    {
                      type: "checkbox",
                      "onUpdate:modelValue": u[74] || (u[74] = (l) => _.value.cog_social_enabled = l)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [me, _.value.cog_social_enabled]
                  ]),
                  i(
                    "span",
                    null,
                    r(a("life.companion.social.enable")),
                    1
                    /* TEXT */
                  )
                ])
              ]),
              i("article", kd, [
                i("h3", null, [
                  z(
                    r(a("life.companion.selfhood.title")) + " ",
                    1
                    /* TEXT */
                  ),
                  i(
                    "span",
                    {
                      class: D(["count-pill", be(!!_.value.cog_selfhood_enabled).cls])
                    },
                    r(be(!!_.value.cog_selfhood_enabled).text),
                    3
                    /* TEXT, CLASS */
                  )
                ]),
                i("div", Pd, [
                  i("label", null, [
                    i(
                      "span",
                      null,
                      r(a("life.companion.selfhood.timeDiscount")),
                      1
                      /* TEXT */
                    ),
                    P(i(
                      "input",
                      {
                        "onUpdate:modelValue": u[75] || (u[75] = (l) => _.value.cog_selfhood_discount = l),
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
                        M,
                        _.value.cog_selfhood_discount,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  i("label", null, [
                    i(
                      "span",
                      null,
                      r(a("life.companion.selfhood.detailScale")),
                      1
                      /* TEXT */
                    ),
                    P(i(
                      "input",
                      {
                        "onUpdate:modelValue": u[76] || (u[76] = (l) => _.value.cog_selfhood_detail = l),
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
                        M,
                        _.value.cog_selfhood_detail,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ])
                ]),
                i("label", Ld, [
                  P(i(
                    "input",
                    {
                      type: "checkbox",
                      "onUpdate:modelValue": u[77] || (u[77] = (l) => _.value.cog_selfhood_enabled = l)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [me, _.value.cog_selfhood_enabled]
                  ]),
                  i(
                    "span",
                    null,
                    r(a("life.companion.selfhood.enable")),
                    1
                    /* TEXT */
                  )
                ])
              ]),
              i("article", Td, [
                i("h3", null, [
                  z(
                    r(a("life.companion.attachmentCard.title")) + " ",
                    1
                    /* TEXT */
                  ),
                  i(
                    "span",
                    {
                      class: D(["count-pill", be(!!_.value.cog_attachment_enabled).cls])
                    },
                    r(be(!!_.value.cog_attachment_enabled).text),
                    3
                    /* TEXT, CLASS */
                  )
                ]),
                i(
                  "p",
                  Sd,
                  r(a("life.companion.attachmentCard.hint")),
                  1
                  /* TEXT */
                ),
                i("label", Cd, [
                  P(i(
                    "input",
                    {
                      type: "checkbox",
                      "onUpdate:modelValue": u[78] || (u[78] = (l) => _.value.cog_attachment_enabled = l)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [me, _.value.cog_attachment_enabled]
                  ]),
                  i(
                    "span",
                    null,
                    r(a("life.companion.attachmentCard.enable")),
                    1
                    /* TEXT */
                  )
                ]),
                i("div", Md, [
                  i("label", null, [
                    i(
                      "span",
                      null,
                      r(a("life.companion.metric.attachmentType")),
                      1
                      /* TEXT */
                    ),
                    Oe($e(Ue), {
                      modelValue: _.value.cog_attachment_type,
                      "onUpdate:modelValue": u[79] || (u[79] = (l) => _.value.cog_attachment_type = l),
                      options: Rt.value,
                      "aria-label": a("life.companion.metric.attachmentType")
                    }, null, 8, ["modelValue", "options", "aria-label"])
                  ])
                ]),
                i(
                  "p",
                  zd,
                  r(a("life.companion.attachmentCard.hint2")),
                  1
                  /* TEXT */
                )
              ]),
              i("article", Ed, [
                i("h3", null, [
                  z(
                    r(a("life.companion.tsundereCard.title")) + " ",
                    1
                    /* TEXT */
                  ),
                  i(
                    "span",
                    {
                      class: D(["count-pill", be(!!_.value.cog_tsundere_enabled).cls])
                    },
                    r(be(!!_.value.cog_tsundere_enabled).text),
                    3
                    /* TEXT, CLASS */
                  )
                ]),
                i(
                  "p",
                  Od,
                  r(a("life.companion.tsundereCard.hint")),
                  1
                  /* TEXT */
                ),
                i("label", Ad, [
                  P(i(
                    "input",
                    {
                      type: "checkbox",
                      "onUpdate:modelValue": u[80] || (u[80] = (l) => _.value.cog_tsundere_enabled = l)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [me, _.value.cog_tsundere_enabled]
                  ]),
                  i(
                    "span",
                    null,
                    r(a("life.companion.tsundereCard.enable")),
                    1
                    /* TEXT */
                  )
                ]),
                i("div", Id, [
                  i("label", null, [
                    i(
                      "span",
                      null,
                      r(a("life.companion.persona.tsundereType")),
                      1
                      /* TEXT */
                    ),
                    Oe($e(Ue), {
                      modelValue: _.value.cog_tsundere_type,
                      "onUpdate:modelValue": u[81] || (u[81] = (l) => _.value.cog_tsundere_type = l),
                      options: Jt.value,
                      "aria-label": a("life.companion.persona.tsundereType")
                    }, null, 8, ["modelValue", "options", "aria-label"])
                  ])
                ]),
                i(
                  "p",
                  Bd,
                  r(a("life.companion.tsundereCard.hint2")),
                  1
                  /* TEXT */
                )
              ]),
              i("article", Zd, [
                i("h3", null, [
                  z(
                    r(a("life.companion.yandereCard.title")) + " ",
                    1
                    /* TEXT */
                  ),
                  i(
                    "span",
                    {
                      class: D(["count-pill", be(!!_.value.cog_yandere_enabled).cls])
                    },
                    r(be(!!_.value.cog_yandere_enabled).text),
                    3
                    /* TEXT, CLASS */
                  )
                ]),
                i(
                  "p",
                  Nd,
                  r(a("life.companion.yandereCard.hint")),
                  1
                  /* TEXT */
                ),
                i("label", Rd, [
                  P(i(
                    "input",
                    {
                      type: "checkbox",
                      "onUpdate:modelValue": u[82] || (u[82] = (l) => _.value.cog_yandere_enabled = l)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [me, _.value.cog_yandere_enabled]
                  ]),
                  i(
                    "span",
                    null,
                    r(a("life.companion.yandereCard.enable")),
                    1
                    /* TEXT */
                  )
                ]),
                i("div", Dd, [
                  i("label", null, [
                    i(
                      "span",
                      null,
                      r(a("life.companion.yandereCard.type")),
                      1
                      /* TEXT */
                    ),
                    Oe($e(Ue), {
                      modelValue: _.value.cog_yandere_type,
                      "onUpdate:modelValue": u[83] || (u[83] = (l) => _.value.cog_yandere_type = l),
                      options: mn.value,
                      "aria-label": a("life.companion.yandereCard.type")
                    }, null, 8, ["modelValue", "options", "aria-label"])
                  ])
                ]),
                i(
                  "p",
                  Vd,
                  r(a("life.companion.yandereCard.hint2")),
                  1
                  /* TEXT */
                )
              ]),
              i("article", $d, [
                i("h3", null, [
                  z(
                    r(a("life.companion.personadynCard.title")) + " ",
                    1
                    /* TEXT */
                  ),
                  i(
                    "span",
                    {
                      class: D(["count-pill", be(!!_.value.cog_personadyn_enabled).cls])
                    },
                    r(be(!!_.value.cog_personadyn_enabled).text),
                    3
                    /* TEXT, CLASS */
                  )
                ]),
                i(
                  "p",
                  Ud,
                  r(a("life.companion.personadynCard.hint")),
                  1
                  /* TEXT */
                ),
                i("label", Hd, [
                  P(i(
                    "input",
                    {
                      type: "checkbox",
                      "onUpdate:modelValue": u[84] || (u[84] = (l) => _.value.cog_personadyn_enabled = l)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [me, _.value.cog_personadyn_enabled]
                  ]),
                  i(
                    "span",
                    null,
                    r(a("life.companion.personadynCard.enable")),
                    1
                    /* TEXT */
                  )
                ]),
                i("div", Fd, [
                  i("label", null, [
                    i(
                      "span",
                      null,
                      r(a("life.companion.persona.personaArchetype")),
                      1
                      /* TEXT */
                    ),
                    Oe($e(Ue), {
                      modelValue: _.value.cog_personadyn_type,
                      "onUpdate:modelValue": u[85] || (u[85] = (l) => _.value.cog_personadyn_type = l),
                      options: Xt.value,
                      "aria-label": a("life.companion.persona.personaArchetype")
                    }, null, 8, ["modelValue", "options", "aria-label"])
                  ]),
                  i("label", null, [
                    i(
                      "span",
                      null,
                      r(a("life.companion.persona.genderSocialScript")),
                      1
                      /* TEXT */
                    ),
                    Oe($e(Ue), {
                      modelValue: _.value.cog_personadyn_gender,
                      "onUpdate:modelValue": u[86] || (u[86] = (l) => _.value.cog_personadyn_gender = l),
                      options: Fe.value,
                      "aria-label": a("life.companion.persona.genderSocialScriptAria")
                    }, null, 8, ["modelValue", "options", "aria-label"])
                  ])
                ]),
                i(
                  "p",
                  Wd,
                  r(a("life.companion.personadynCard.hint2")),
                  1
                  /* TEXT */
                ),
                i(
                  "p",
                  Gd,
                  r(a("life.companion.personadynCard.hint3")),
                  1
                  /* TEXT */
                )
              ]),
              i("article", jd, [
                i("h3", null, [
                  z(
                    r(a("life.companion.memoryCard.title")) + " ",
                    1
                    /* TEXT */
                  ),
                  i(
                    "span",
                    {
                      class: D(["count-pill", be(!!_.value.cog_memory_encode).cls])
                    },
                    r(be(!!_.value.cog_memory_encode).text),
                    3
                    /* TEXT, CLASS */
                  )
                ]),
                i(
                  "p",
                  qd,
                  r(a("life.companion.memoryCard.hint")),
                  1
                  /* TEXT */
                ),
                i("div", Kd, [
                  i("label", Yd, [
                    P(i(
                      "input",
                      {
                        type: "checkbox",
                        "onUpdate:modelValue": u[87] || (u[87] = (l) => _.value.cog_memory_encode = l)
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [me, _.value.cog_memory_encode]
                    ]),
                    i(
                      "span",
                      null,
                      r(a("life.companion.memoryCard.selectiveEncoding")),
                      1
                      /* TEXT */
                    )
                  ]),
                  i("label", Jd, [
                    P(i(
                      "input",
                      {
                        type: "checkbox",
                        "onUpdate:modelValue": u[88] || (u[88] = (l) => _.value.cog_sleep_replay = l)
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [me, _.value.cog_sleep_replay]
                    ]),
                    i(
                      "span",
                      null,
                      r(a("life.companion.memoryCard.sleepReplay")),
                      1
                      /* TEXT */
                    )
                  ]),
                  i("label", Xd, [
                    P(i(
                      "input",
                      {
                        type: "checkbox",
                        "onUpdate:modelValue": u[89] || (u[89] = (l) => _.value.cog_memory_reconsolidate = l)
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [me, _.value.cog_memory_reconsolidate]
                    ]),
                    i(
                      "span",
                      null,
                      r(a("life.companion.memoryCard.reconsolidate")),
                      1
                      /* TEXT */
                    )
                  ]),
                  i("label", Qd, [
                    P(i(
                      "input",
                      {
                        type: "checkbox",
                        "onUpdate:modelValue": u[90] || (u[90] = (l) => _.value.cog_cls_interleave = l)
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [me, _.value.cog_cls_interleave]
                    ]),
                    i(
                      "span",
                      null,
                      r(a("life.companion.memoryCard.cls")),
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
          [ui, ce.value === "cognition"]
        ]),
        P(i(
          "section",
          eh,
          [
            i("div", th, [
              i("div", null, [
                i(
                  "h2",
                  null,
                  r(a("life.companion.world.title")),
                  1
                  /* TEXT */
                ),
                i(
                  "p",
                  nh,
                  r(a("life.companion.world.desc")),
                  1
                  /* TEXT */
                )
              ]),
              i("div", ih, [
                i(
                  "button",
                  {
                    class: "btn filled sm",
                    onClick: Me
                  },
                  r(a("life.companion.saveSettings")),
                  1
                  /* TEXT */
                )
              ])
            ]),
            i("article", oh, [
              i(
                "h3",
                null,
                r(a("life.companion.world.density")),
                1
                /* TEXT */
              ),
              i("div", ah, [
                i("label", null, [
                  i(
                    "span",
                    null,
                    r(a("life.companion.world.density")),
                    1
                    /* TEXT */
                  ),
                  Oe($e(Ue), {
                    modelValue: $t.value,
                    "onUpdate:modelValue": u[91] || (u[91] = (l) => $t.value = l),
                    options: Xi.value,
                    "aria-label": a("life.companion.world.densityAria")
                  }, null, 8, ["modelValue", "options", "aria-label"])
                ])
              ]),
              i(
                "p",
                sh,
                r(a("life.companion.world.densityHint")),
                1
                /* TEXT */
              )
            ]),
            i("article", rh, [
              i(
                "h3",
                null,
                r(a("life.companion.world.personaTraits")),
                1
                /* TEXT */
              ),
              i(
                "p",
                lh,
                r(a("life.companion.world.personaTraitsHint")),
                1
                /* TEXT */
              ),
              i("label", uh, [
                i(
                  "span",
                  ch,
                  r(a("life.companion.world.personaText")),
                  1
                  /* TEXT */
                ),
                P(i("textarea", {
                  "onUpdate:modelValue": u[92] || (u[92] = (l) => rn.value = l),
                  class: "world-text",
                  rows: "4",
                  placeholder: a("life.companion.world.personaPlaceholder")
                }, null, 8, dh), [
                  [M, rn.value]
                ])
              ])
            ]),
            i("article", hh, [
              i(
                "h3",
                null,
                r(a("life.companion.world.location")),
                1
                /* TEXT */
              ),
              i(
                "p",
                ph,
                r(a("life.companion.world.locationHint")),
                1
                /* TEXT */
              ),
              i("div", fh, [
                i("label", null, [
                  i(
                    "span",
                    null,
                    r(a("life.companion.world.worldType")),
                    1
                    /* TEXT */
                  ),
                  Oe($e(Ue), {
                    modelValue: bt.value,
                    "onUpdate:modelValue": u[93] || (u[93] = (l) => bt.value = l),
                    options: un.value,
                    "aria-label": a("life.companion.world.worldType")
                  }, null, 8, ["modelValue", "options", "aria-label"])
                ]),
                i("label", null, [
                  i(
                    "span",
                    null,
                    r(a("life.companion.world.country")),
                    1
                    /* TEXT */
                  ),
                  P(i("input", {
                    "onUpdate:modelValue": u[94] || (u[94] = (l) => nn.value = l),
                    class: "field",
                    placeholder: a("life.companion.world.countryPlaceholder")
                  }, null, 8, mh), [
                    [M, nn.value]
                  ])
                ]),
                i("label", null, [
                  i(
                    "span",
                    null,
                    r(a("life.companion.world.city")),
                    1
                    /* TEXT */
                  ),
                  P(i("input", {
                    "onUpdate:modelValue": u[95] || (u[95] = (l) => on.value = l),
                    class: "field",
                    placeholder: a("life.companion.world.cityPlaceholder")
                  }, null, 8, _h), [
                    [M, on.value]
                  ])
                ]),
                i("label", null, [
                  i(
                    "span",
                    null,
                    r(a("life.companion.world.district")),
                    1
                    /* TEXT */
                  ),
                  P(i("input", {
                    "onUpdate:modelValue": u[96] || (u[96] = (l) => an.value = l),
                    class: "field",
                    placeholder: a("life.companion.world.districtPlaceholder")
                  }, null, 8, vh), [
                    [M, an.value]
                  ])
                ])
              ]),
              i("label", gh, [
                i(
                  "span",
                  yh,
                  r(a("life.companion.world.premiseLabel")),
                  1
                  /* TEXT */
                ),
                P(i("textarea", {
                  "onUpdate:modelValue": u[97] || (u[97] = (l) => sn.value = l),
                  class: "world-text",
                  rows: "3",
                  placeholder: a("life.companion.world.premisePlaceholder")
                }, null, 8, bh), [
                  [M, sn.value]
                ])
              ]),
              i("label", wh, [
                i(
                  "span",
                  xh,
                  r(a("life.companion.world.actorsLabel")),
                  1
                  /* TEXT */
                ),
                P(i("textarea", {
                  "onUpdate:modelValue": u[98] || (u[98] = (l) => Ct.value = l),
                  class: "world-text",
                  rows: "4",
                  placeholder: a("life.companion.world.actorsPlaceholder")
                }, null, 8, kh), [
                  [M, Ct.value]
                ])
              ]),
              i("label", Ph, [
                i(
                  "span",
                  Lh,
                  r(a("life.companion.world.placesLabel")),
                  1
                  /* TEXT */
                ),
                P(i("textarea", {
                  "onUpdate:modelValue": u[99] || (u[99] = (l) => mt.value = l),
                  class: "world-text",
                  rows: "2",
                  placeholder: a("life.companion.world.placesPlaceholder")
                }, null, 8, Th), [
                  [M, mt.value]
                ])
              ]),
              i("div", Sh, [
                i("button", {
                  class: "btn filled sm",
                  type: "button",
                  disabled: nt.value,
                  onClick: Ci
                }, r(nt.value ? a("life.companion.world.generating") : a("life.companion.world.generateMapOnly")), 9, Ch),
                i("button", {
                  class: "btn tonic sm",
                  type: "button",
                  disabled: nt.value,
                  onClick: eo
                }, r(nt.value ? a("life.companion.world.generating") : a("life.companion.world.generateWorld")), 9, Mh),
                i(
                  "span",
                  zh,
                  r(a("life.companion.world.generateHint")),
                  1
                  /* TEXT */
                )
              ])
            ]),
            i("article", Eh, [
              i("div", Oh, [
                i("h3", null, [
                  z(
                    r(a("life.companion.world.map")) + " ",
                    1
                    /* TEXT */
                  ),
                  i(
                    "span",
                    Ah,
                    r(I.value.locations.length),
                    1
                    /* TEXT */
                  )
                ]),
                Y.value ? (v(), g(
                  "span",
                  Ih,
                  r(Y.value.fictional ? a("life.companion.worldFictional.fictional") : a("life.companion.worldFictional.real")) + " · " + r([Y.value.country, Y.value.city, Y.value.district].filter(Boolean).join(" / ") || a("life.companion.world.unnamed")),
                  1
                  /* TEXT */
                )) : E("v-if", !0)
              ]),
              Y.value?.premise ? (v(), g(
                "p",
                Bh,
                r(Y.value.premise),
                1
                /* TEXT */
              )) : E("v-if", !0),
              i("div", Zh, [
                i(
                  "div",
                  {
                    ref_key: "mapEl",
                    ref: Ft,
                    class: D(["world-map-leaflet", { "is-empty": !I.value.locations.length }])
                  },
                  null,
                  2
                  /* CLASS */
                ),
                wt.value ? (v(), g(
                  "div",
                  Nh,
                  r(a("life.companion.world.offline")),
                  1
                  /* TEXT */
                )) : E("v-if", !0),
                I.value.locations.length ? (v(), g(
                  Q,
                  { key: 1 },
                  [
                    I.value.kind !== "real" && I.value.nation ? (v(), g(
                      "button",
                      {
                        key: 0,
                        type: "button",
                        class: "wm-scope",
                        onClick: Jn
                      },
                      r(rt.value === "city" ? a("life.companion.world.nationView") : a("life.companion.world.cityView")),
                      1
                      /* TEXT */
                    )) : E("v-if", !0),
                    i(
                      "button",
                      {
                        type: "button",
                        class: "wm-reset",
                        onClick: Yn
                      },
                      r(a("life.companion.world.resetView")),
                      1
                      /* TEXT */
                    ),
                    I.value.kind !== "real" && rt.value === "city" ? (v(), g("div", Rh, [...u[108] || (u[108] = [
                      i(
                        "i",
                        null,
                        "N",
                        -1
                        /* CACHED */
                      )
                    ])])) : E("v-if", !0)
                  ],
                  64
                  /* STABLE_FRAGMENT */
                )) : E("v-if", !0)
              ]),
              I.value.locations.length ? E("v-if", !0) : (v(), g(
                "p",
                Dh,
                r(a("life.companion.world.noMap")),
                1
                /* TEXT */
              )),
              I.value.locations.length ? (v(), g("div", Vh, [
                (v(!0), g(
                  Q,
                  null,
                  Ee(J.value, (l) => (v(), g("span", { key: l }, [
                    i(
                      "i",
                      {
                        class: D("k-" + l)
                      },
                      null,
                      2
                      /* CLASS */
                    ),
                    z(
                      r(a(Ht[l])),
                      1
                      /* TEXT */
                    )
                  ]))),
                  128
                  /* KEYED_FRAGMENT */
                )),
                i("span", null, [
                  u[109] || (u[109] = i(
                    "i",
                    { class: "k-actor" },
                    null,
                    -1
                    /* CACHED */
                  )),
                  z(
                    r(a("life.companion.world.actorsCount", { n: I.value.actors.length })),
                    1
                    /* TEXT */
                  )
                ]),
                I.value.kind !== "real" ? (v(), g(
                  Q,
                  { key: 0 },
                  [
                    i("span", null, [
                      u[110] || (u[110] = i(
                        "i",
                        { class: "k-hw" },
                        null,
                        -1
                        /* CACHED */
                      )),
                      z(
                        r(a("life.companion.world.highwayLoop")),
                        1
                        /* TEXT */
                      )
                    ]),
                    i("span", null, [
                      u[111] || (u[111] = i(
                        "i",
                        { class: "k-arterial" },
                        null,
                        -1
                        /* CACHED */
                      )),
                      z(
                        r(a("life.companion.world.arterial")),
                        1
                        /* TEXT */
                      )
                    ]),
                    i("span", null, [
                      u[112] || (u[112] = i(
                        "i",
                        { class: "k-street" },
                        null,
                        -1
                        /* CACHED */
                      )),
                      z(
                        r(a("life.companion.world.street")),
                        1
                        /* TEXT */
                      )
                    ]),
                    i("span", null, [
                      u[113] || (u[113] = i(
                        "i",
                        { class: "k-metro" },
                        null,
                        -1
                        /* CACHED */
                      )),
                      z(
                        r(a("life.companion.world.metro")),
                        1
                        /* TEXT */
                      )
                    ]),
                    i("span", null, [
                      u[114] || (u[114] = i(
                        "i",
                        { class: "k-bus" },
                        null,
                        -1
                        /* CACHED */
                      )),
                      z(
                        r(a("life.companion.world.bus")),
                        1
                        /* TEXT */
                      )
                    ]),
                    i("span", null, [
                      u[115] || (u[115] = i(
                        "i",
                        { class: "k-park2" },
                        null,
                        -1
                        /* CACHED */
                      )),
                      z(
                        r(a("life.companion.kind.park")),
                        1
                        /* TEXT */
                      )
                    ]),
                    i("span", null, [
                      u[116] || (u[116] = i(
                        "i",
                        { class: "k-water" },
                        null,
                        -1
                        /* CACHED */
                      )),
                      z(
                        r(a("life.companion.world.water")),
                        1
                        /* TEXT */
                      )
                    ])
                  ],
                  64
                  /* STABLE_FRAGMENT */
                )) : E("v-if", !0)
              ])) : E("v-if", !0),
              I.value.locations.length && I.value.kind !== "real" && rt.value === "city" ? (v(), g("div", $h, [
                (I.value.metro || []).length ? (v(), g("div", Uh, [
                  i(
                    "h4",
                    null,
                    r(a("life.companion.world.metroRoutes")),
                    1
                    /* TEXT */
                  ),
                  i("ul", null, [
                    (v(!0), g(
                      Q,
                      null,
                      Ee(I.value.metro, (l, B) => (v(), g("li", {
                        key: "m" + B
                      }, [
                        i(
                          "b",
                          {
                            style: ot({ color: l.color })
                          },
                          r(l.name),
                          5
                          /* TEXT, STYLE */
                        ),
                        i(
                          "span",
                          null,
                          r((l.stations || []).map((C) => C.name).filter(Boolean).join(" · ")),
                          1
                          /* TEXT */
                        )
                      ]))),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ])
                ])) : E("v-if", !0),
                (I.value.bus || []).length ? (v(), g("div", Hh, [
                  i(
                    "h4",
                    null,
                    r(a("life.companion.world.busRoutes")),
                    1
                    /* TEXT */
                  ),
                  i("ul", null, [
                    (v(!0), g(
                      Q,
                      null,
                      Ee(I.value.bus, (l, B) => (v(), g("li", {
                        key: "b" + B
                      }, [
                        i(
                          "b",
                          {
                            style: ot({ color: l.color })
                          },
                          r(l.name),
                          5
                          /* TEXT, STYLE */
                        ),
                        i(
                          "span",
                          null,
                          r((l.stops || []).map((C) => C.name).filter(Boolean).join(" · ")),
                          1
                          /* TEXT */
                        )
                      ]))),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ])
                ])) : E("v-if", !0)
              ])) : E("v-if", !0)
            ]),
            i("article", Fh, [
              i("div", Wh, [
                i("h3", null, [
                  z(
                    r(a("life.companion.world.recentEvents")) + " ",
                    1
                    /* TEXT */
                  ),
                  i(
                    "span",
                    Gh,
                    r(bn.value.length),
                    1
                    /* TEXT */
                  )
                ]),
                bn.value.length ? (v(), g(
                  "button",
                  {
                    key: 0,
                    type: "button",
                    class: "btn tonic sm",
                    onClick: Xn
                  },
                  r(a("life.companion.world.clearTitle")),
                  1
                  /* TEXT */
                )) : E("v-if", !0)
              ]),
              i("ol", jh, [
                (v(!0), g(
                  Q,
                  null,
                  Ee(bn.value, (l) => (v(), g("li", {
                    key: l.id
                  }, [
                    i(
                      "span",
                      qh,
                      r(l.created_at),
                      1
                      /* TEXT */
                    ),
                    i(
                      "strong",
                      null,
                      r(l.summary),
                      1
                      /* TEXT */
                    )
                  ]))),
                  128
                  /* KEYED_FRAGMENT */
                )),
                bn.value.length ? E("v-if", !0) : (v(), g(
                  "li",
                  Kh,
                  r(a("life.companion.world.noEvents")),
                  1
                  /* TEXT */
                ))
              ])
            ])
          ],
          512
          /* NEED_PATCH */
        ), [
          [ui, ce.value === "world"]
        ]),
        P(i(
          "section",
          Yh,
          [
            Oe(Ns)
          ],
          512
          /* NEED_PATCH */
        ), [
          [ui, ce.value === "adapters"]
        ]),
        P(i(
          "section",
          Jh,
          [
            i("div", Xh, [
              i("div", null, [
                i(
                  "h2",
                  null,
                  r(a("life.companion.state.title")),
                  1
                  /* TEXT */
                ),
                i(
                  "p",
                  Qh,
                  r(a("life.companion.state.desc")),
                  1
                  /* TEXT */
                )
              ])
            ]),
            i("article", ep, [
              i("h3", null, [
                z(
                  r(a("life.companion.state.relationships")) + " ",
                  1
                  /* TEXT */
                ),
                i(
                  "span",
                  tp,
                  r(jn.value.length),
                  1
                  /* TEXT */
                )
              ]),
              i(
                "p",
                np,
                r(a("life.companion.state.relationshipsHint")),
                1
                /* TEXT */
              ),
              i("ol", ip, [
                (v(!0), g(
                  Q,
                  null,
                  Ee(jn.value, (l) => (v(), g("li", {
                    key: l.user_id,
                    class: "rel-card"
                  }, [
                    i("div", op, [
                      i(
                        "strong",
                        null,
                        r(l.user_id),
                        1
                        /* TEXT */
                      ),
                      i(
                        "span",
                        ap,
                        r(a("life.companion.state.lastSeenLabel")) + " " + r((l.last_seen || "").slice(0, 16).replace("T", " ") || "—"),
                        1
                        /* TEXT */
                      )
                    ]),
                    i("div", sp, [
                      i(
                        "span",
                        rp,
                        r(a("life.companion.state.stage")),
                        1
                        /* TEXT */
                      ),
                      i("span", {
                        class: "rel-track",
                        role: "img",
                        "aria-label": Kn(l.stage)
                      }, [
                        (v(), g(
                          Q,
                          null,
                          Ee(Pn, (B, C) => i(
                            "span",
                            {
                              key: B,
                              class: D(["rel-seg", { done: C < Pi(l.stage), cur: C === Pi(l.stage) }])
                            },
                            null,
                            2
                            /* CLASS */
                          )),
                          64
                          /* STABLE_FRAGMENT */
                        ))
                      ], 8, lp),
                      i(
                        "span",
                        up,
                        r(Kn(l.stage)),
                        1
                        /* TEXT */
                      )
                    ]),
                    i("div", {
                      class: "gauge",
                      title: a("life.companion.effect.affinity")
                    }, [
                      i("span", dp, [
                        i("span", hp, [
                          z(
                            r(a("life.companion.state.affinity")),
                            1
                            /* TEXT */
                          ),
                          i(
                            "em",
                            pp,
                            r(a("life.companion.alias.affinity")),
                            1
                            /* TEXT */
                          )
                        ]),
                        i("span", fp, [
                          i(
                            "b",
                            {
                              class: D(["gauge-state", Number(l.affinity) >= 0 ? "good" : "bad"])
                            },
                            r(a("life.companion.gw.affinity." + yi(Number(l.affinity) || 0))),
                            3
                            /* TEXT, CLASS */
                          ),
                          z(
                            " " + r(ke(l.affinity, 2)),
                            1
                            /* TEXT */
                          )
                        ])
                      ]),
                      i("span", mp, [
                        i(
                          "i",
                          {
                            class: D(["gauge-fill", Number(l.affinity) >= 0 ? "good" : "bad"]),
                            style: ot(at(Number(l.affinity) || 0))
                          },
                          null,
                          6
                          /* CLASS, STYLE */
                        )
                      ]),
                      i(
                        "span",
                        _p,
                        r(a("life.companion.effect.affinity")),
                        1
                        /* TEXT */
                      )
                    ], 8, cp),
                    l.interaction ? (v(), g("div", vp, [
                      i(
                        "span",
                        gp,
                        r(a("life.companion.state.interaction")) + " · " + r(Yi(l.interaction)),
                        1
                        /* TEXT */
                      ),
                      i(
                        "span",
                        yp,
                        r(Ji(l.interaction)),
                        1
                        /* TEXT */
                      )
                    ])) : E("v-if", !0)
                  ]))),
                  128
                  /* KEYED_FRAGMENT */
                )),
                jn.value.length ? E("v-if", !0) : (v(), g(
                  "li",
                  bp,
                  r(a("life.companion.state.noRelationships")),
                  1
                  /* TEXT */
                ))
              ])
            ]),
            i("article", wp, [
              i("h3", null, [
                z(
                  r(a("life.companion.state.commitments")) + " ",
                  1
                  /* TEXT */
                ),
                i(
                  "span",
                  xp,
                  r(Lt.value.length),
                  1
                  /* TEXT */
                )
              ]),
              i(
                "p",
                kp,
                r(a("life.companion.state.commitmentsHint")),
                1
                /* TEXT */
              ),
              i("ol", Pp, [
                (v(!0), g(
                  Q,
                  null,
                  Ee(Lt.value, (l) => (v(), g("li", {
                    key: l.id
                  }, [
                    i(
                      "strong",
                      null,
                      r(l.text),
                      1
                      /* TEXT */
                    ),
                    i(
                      "span",
                      Lp,
                      r(l.user_id),
                      1
                      /* TEXT */
                    )
                  ]))),
                  128
                  /* KEYED_FRAGMENT */
                )),
                Lt.value.length ? E("v-if", !0) : (v(), g(
                  "li",
                  Tp,
                  r(a("life.companion.state.noCommitments")),
                  1
                  /* TEXT */
                ))
              ])
            ]),
            i("div", Sp, [
              i("article", Cp, [
                i(
                  "h3",
                  null,
                  r(a("life.companion.state.userModel")),
                  1
                  /* TEXT */
                ),
                i(
                  "p",
                  Mp,
                  r(a("life.companion.state.userModelHint")),
                  1
                  /* TEXT */
                ),
                i("ol", zp, [
                  (v(!0), g(
                    Q,
                    null,
                    Ee(_i.value, (l) => (v(), g("li", {
                      key: l.user_id
                    }, [
                      i(
                        "strong",
                        null,
                        r(l.user_id),
                        1
                        /* TEXT */
                      ),
                      i(
                        "span",
                        Ep,
                        r(a("life.companion.state.likes", { items: wn(l.preferences).join(a("life.companion.listSeparator")) || "—" })),
                        1
                        /* TEXT */
                      ),
                      i(
                        "span",
                        Op,
                        r(a("life.companion.state.taboos", { items: wn(l.taboos).join(a("life.companion.listSeparator")) || "—" })),
                        1
                        /* TEXT */
                      ),
                      i(
                        "span",
                        Ap,
                        r(a("life.companion.state.concerns", { items: wn(l.concerns).join(a("life.companion.listSeparator")) || "—" })),
                        1
                        /* TEXT */
                      )
                    ]))),
                    128
                    /* KEYED_FRAGMENT */
                  )),
                  _i.value.length ? E("v-if", !0) : (v(), g(
                    "li",
                    Ip,
                    r(a("life.companion.state.noUserModel")),
                    1
                    /* TEXT */
                  ))
                ])
              ]),
              i("article", Bp, [
                i(
                  "h3",
                  null,
                  r(a("life.companion.state.values")),
                  1
                  /* TEXT */
                ),
                i(
                  "p",
                  Zp,
                  r(a("life.companion.state.valuesHint")),
                  1
                  /* TEXT */
                ),
                i("ol", Np, [
                  (v(!0), g(
                    Q,
                    null,
                    Ee(vi.value, (l) => (v(), g("li", {
                      key: l.k,
                      class: "value-row"
                    }, [
                      i(
                        "span",
                        Rp,
                        r(l.k),
                        1
                        /* TEXT */
                      ),
                      i("span", Dp, [
                        i(
                          "i",
                          {
                            class: D(l.v >= 0 ? "good" : "bad"),
                            style: ot(at(l.v))
                          },
                          null,
                          6
                          /* CLASS, STYLE */
                        )
                      ]),
                      i(
                        "span",
                        Vp,
                        r(l.v.toFixed(2)),
                        1
                        /* TEXT */
                      )
                    ]))),
                    128
                    /* KEYED_FRAGMENT */
                  )),
                  vi.value.length ? E("v-if", !0) : (v(), g(
                    "li",
                    $p,
                    r(a("life.companion.state.noValues")),
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
          [ui, ce.value === "state"]
        ]),
        i("section", Up, [
          i("div", Hp, [
            i("div", null, [
              i(
                "h2",
                null,
                r(a("life.companion.danger.title")),
                1
                /* TEXT */
              ),
              i(
                "p",
                Fp,
                r(a("life.companion.danger.desc")),
                1
                /* TEXT */
              )
            ])
          ]),
          i("div", Wp, [
            i("article", Gp, [
              i(
                "h3",
                null,
                r(a("life.companion.danger.reset")),
                1
                /* TEXT */
              ),
              i(
                "p",
                jp,
                r(a("life.companion.danger.resetHint")),
                1
                /* TEXT */
              ),
              i("p", qp, [
                i(
                  "strong",
                  null,
                  r(a("life.companion.danger.doubleConfirm")),
                  1
                  /* TEXT */
                )
              ]),
              i("div", Kp, [
                i("button", {
                  class: "btn danger",
                  disabled: ln.value,
                  onClick: to
                }, r(ln.value ? a("life.companion.danger.resetting") : a("life.companion.danger.reset")), 9, Yp)
              ])
            ])
          ])
        ])
      ],
      512
      /* NEED_PATCH */
    ));
  }
}), Qp = (_e, y) => {
  const a = _e.__vccOpts || _e;
  for (const [Be, O] of y)
    a[Be] = O;
  return a;
}, of = /* @__PURE__ */ Qp(Xp, [["__scopeId", "data-v-b33f2d64"]]);
export {
  of as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('life-plugin-style')){const s=document.createElement('style');s.id='life-plugin-style';s.textContent=".leaflet-pane,.leaflet-tile,.leaflet-marker-icon,.leaflet-marker-shadow,.leaflet-tile-container,.leaflet-pane>svg,.leaflet-pane>canvas,.leaflet-zoom-box,.leaflet-image-layer,.leaflet-layer{position:absolute;left:0;top:0}.leaflet-container{overflow:hidden}.leaflet-tile,.leaflet-marker-icon,.leaflet-marker-shadow{-webkit-user-select:none;-moz-user-select:none;user-select:none;-webkit-user-drag:none}.leaflet-tile::selection{background:transparent}.leaflet-safari .leaflet-tile{image-rendering:-webkit-optimize-contrast}.leaflet-safari .leaflet-tile-container{width:1600px;height:1600px;-webkit-transform-origin:0 0}.leaflet-marker-icon,.leaflet-marker-shadow{display:block}.leaflet-container .leaflet-overlay-pane svg{max-width:none!important;max-height:none!important}.leaflet-container .leaflet-marker-pane img,.leaflet-container .leaflet-shadow-pane img,.leaflet-container .leaflet-tile-pane img,.leaflet-container img.leaflet-image-layer,.leaflet-container .leaflet-tile{max-width:none!important;max-height:none!important;width:auto;padding:0}.leaflet-container img.leaflet-tile{mix-blend-mode:plus-lighter}.leaflet-container.leaflet-touch-zoom{-ms-touch-action:pan-x pan-y;touch-action:pan-x pan-y}.leaflet-container.leaflet-touch-drag{-ms-touch-action:pinch-zoom;touch-action:none;touch-action:pinch-zoom}.leaflet-container.leaflet-touch-drag.leaflet-touch-zoom{-ms-touch-action:none;touch-action:none}.leaflet-container{-webkit-tap-highlight-color:transparent}.leaflet-container a{-webkit-tap-highlight-color:rgba(51,181,229,.4)}.leaflet-tile{filter:inherit;visibility:hidden}.leaflet-tile-loaded{visibility:inherit}.leaflet-zoom-box{width:0;height:0;-moz-box-sizing:border-box;box-sizing:border-box;z-index:800}.leaflet-overlay-pane svg{-moz-user-select:none}.leaflet-pane{z-index:400}.leaflet-tile-pane{z-index:200}.leaflet-overlay-pane{z-index:400}.leaflet-shadow-pane{z-index:500}.leaflet-marker-pane{z-index:600}.leaflet-tooltip-pane{z-index:650}.leaflet-popup-pane{z-index:700}.leaflet-map-pane canvas{z-index:100}.leaflet-map-pane svg{z-index:200}.leaflet-vml-shape{width:1px;height:1px}.lvml{behavior:url(#default#VML);display:inline-block;position:absolute}.leaflet-control{position:relative;z-index:800;pointer-events:visiblePainted;pointer-events:auto}.leaflet-top,.leaflet-bottom{position:absolute;z-index:1000;pointer-events:none}.leaflet-top{top:0}.leaflet-right{right:0}.leaflet-bottom{bottom:0}.leaflet-left{left:0}.leaflet-control{float:left;clear:both}.leaflet-right .leaflet-control{float:right}.leaflet-top .leaflet-control{margin-top:10px}.leaflet-bottom .leaflet-control{margin-bottom:10px}.leaflet-left .leaflet-control{margin-left:10px}.leaflet-right .leaflet-control{margin-right:10px}.leaflet-fade-anim .leaflet-popup{opacity:0;-webkit-transition:opacity .2s linear;-moz-transition:opacity .2s linear;transition:opacity .2s linear}.leaflet-fade-anim .leaflet-map-pane .leaflet-popup{opacity:1}.leaflet-zoom-animated{-webkit-transform-origin:0 0;-ms-transform-origin:0 0;transform-origin:0 0}svg.leaflet-zoom-animated{will-change:transform}.leaflet-zoom-anim .leaflet-zoom-animated{-webkit-transition:-webkit-transform .25s cubic-bezier(0,0,.25,1);-moz-transition:-moz-transform .25s cubic-bezier(0,0,.25,1);transition:transform .25s cubic-bezier(0,0,.25,1)}.leaflet-zoom-anim .leaflet-tile,.leaflet-pan-anim .leaflet-tile{-webkit-transition:none;-moz-transition:none;transition:none}.leaflet-zoom-anim .leaflet-zoom-hide{visibility:hidden}.leaflet-interactive{cursor:pointer}.leaflet-grab{cursor:-webkit-grab;cursor:-moz-grab;cursor:grab}.leaflet-crosshair,.leaflet-crosshair .leaflet-interactive{cursor:crosshair}.leaflet-popup-pane,.leaflet-control{cursor:auto}.leaflet-dragging .leaflet-grab,.leaflet-dragging .leaflet-grab .leaflet-interactive,.leaflet-dragging .leaflet-marker-draggable{cursor:move;cursor:-webkit-grabbing;cursor:-moz-grabbing;cursor:grabbing}.leaflet-marker-icon,.leaflet-marker-shadow,.leaflet-image-layer,.leaflet-pane>svg path,.leaflet-tile-container{pointer-events:none}.leaflet-marker-icon.leaflet-interactive,.leaflet-image-layer.leaflet-interactive,.leaflet-pane>svg path.leaflet-interactive,svg.leaflet-image-layer.leaflet-interactive path{pointer-events:visiblePainted;pointer-events:auto}.leaflet-container{background:#ddd;outline-offset:1px}.leaflet-container a{color:#0078a8}.leaflet-zoom-box{border:2px dotted #38f;background:#ffffff80}.leaflet-container{font-family:Helvetica Neue,Arial,Helvetica,sans-serif;font-size:12px;font-size:.75rem;line-height:1.5}.leaflet-bar{box-shadow:0 1px 5px #000000a6;border-radius:4px}.leaflet-bar a{background-color:#fff;border-bottom:1px solid #ccc;width:26px;height:26px;line-height:26px;display:block;text-align:center;text-decoration:none;color:#000}.leaflet-bar a,.leaflet-control-layers-toggle{background-position:50% 50%;background-repeat:no-repeat;display:block}.leaflet-bar a:hover,.leaflet-bar a:focus{background-color:#f4f4f4}.leaflet-bar a:first-child{border-top-left-radius:4px;border-top-right-radius:4px}.leaflet-bar a:last-child{border-bottom-left-radius:4px;border-bottom-right-radius:4px;border-bottom:none}.leaflet-bar a.leaflet-disabled{cursor:default;background-color:#f4f4f4;color:#bbb}.leaflet-touch .leaflet-bar a{width:30px;height:30px;line-height:30px}.leaflet-touch .leaflet-bar a:first-child{border-top-left-radius:2px;border-top-right-radius:2px}.leaflet-touch .leaflet-bar a:last-child{border-bottom-left-radius:2px;border-bottom-right-radius:2px}.leaflet-control-zoom-in,.leaflet-control-zoom-out{font:700 18px Lucida Console,Monaco,monospace;text-indent:1px}.leaflet-touch .leaflet-control-zoom-in,.leaflet-touch .leaflet-control-zoom-out{font-size:22px}.leaflet-control-layers{box-shadow:0 1px 5px #0006;background:#fff;border-radius:5px}.leaflet-control-layers-toggle{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAQAAAADQ4RFAAACf0lEQVR4AY1UM3gkARTePdvdoTxXKc+qTl3aU5U6b2Kbkz3Gtq3Zw6ziLGNPzrYx7946Tr6/ee/XeCQ4D3ykPtL5tHno4n0d/h3+xfuWHGLX81cn7r0iTNzjr7LrlxCqPtkbTQEHeqOrTy4Yyt3VCi/IOB0v7rVC7q45Q3Gr5K6jt+3Gl5nCoDD4MtO+j96Wu8atmhGqcNGHObuf8OM/x3AMx38+4Z2sPqzCxRFK2aF2e5Jol56XTLyggAMTL56XOMoS1W4pOyjUcGGQdZxU6qRh7B9Zp+PfpOFlqt0zyDZckPi1ttmIp03jX8gyJ8a/PG2yutpS/Vol7peZIbZcKBAEEheEIAgFbDkz5H6Zrkm2hVWGiXKiF4Ycw0RWKdtC16Q7qe3X4iOMxruonzegJzWaXFrU9utOSsLUmrc0YjeWYjCW4PDMADElpJSSQ0vQvA1Tm6/JlKnqFs1EGyZiFCqnRZTEJJJiKRYzVYzJck2Rm6P4iH+cmSY0YzimYa8l0EtTODFWhcMIMVqdsI2uiTvKmTisIDHJ3od5GILVhBCarCfVRmo4uTjkhrhzkiBV7SsaqS+TzrzM1qpGGUFt28pIySQHR6h7F6KSwGWm97ay+Z+ZqMcEjEWebE7wxCSQwpkhJqoZA5ivCdZDjJepuJ9IQjGGUmuXJdBFUygxVqVsxFsLMbDe8ZbDYVCGKxs+W080max1hFCarCfV+C1KATwcnvE9gRRuMP2prdbWGowm1KB1y+zwMMENkM755cJ2yPDtqhTI6ED1M/82yIDtC/4j4BijjeObflpO9I9MwXTCsSX8jWAFeHr05WoLTJ5G8IQVS/7vwR6ohirYM7f6HzYpogfS3R2OAAAAAElFTkSuQmCC);width:36px;height:36px}.leaflet-retina .leaflet-control-layers-toggle{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAQAAABvcdNgAAAEsklEQVR4AWL4TydIhpZK1kpWOlg0w3ZXP6D2soBtG42jeI6ZmQTHzAxiTbSJsYLjO9HhP+WOmcuhciVnmHVQcJnp7DFvScowZorad/+V/fVzMdMT2g9Cv9guXGv/7pYOrXh2U+RRR3dSd9JRx6bIFc/ekqHI29JC6pJ5ZEh1yWkhkbcFeSjxgx3L2m1cb1C7bceyxA+CNjT/Ifff+/kDk2u/w/33/IeCMOSaWZ4glosqT3DNnNZQ7Cs58/3Ce5HL78iZH/vKVIaYlqzfdLu8Vi7dnvUbEza5Idt36tquZFldl6N5Z/POLof0XLK61mZCmJSWjVF9tEjUluu74IUXvgttuVIHE7YxSkaYhJZam7yiM9Pv82JYfl9nptxZaxMJE4YSPty+vF0+Y2up9d3wwijfjZbabqm/3bZ9ecKHsiGmRflnn1MW4pjHf9oLufyn2z3y1D6n8g8TZhxyzipLNPnAUpsOiuWimg52psrTZYnOWYNDTMuWBWa0tJb4rgq1UvmutpaYEbZlwU3CLJm/ayYjHW5/h7xWLn9Hh1vepDkyf7dE7MtT5LR4e7yYpHrkhOUpEfssBLq2pPhAqoSWKUkk7EDqkmK6RrCEzqDjhNDWNE+XSMvkJRDWlZTmCW0l0PHQGRZY5t1L83kT0Y3l2SItk5JAWHl2dCOBm+fPu3fo5/3v61RMCO9Jx2EEYYhb0rmNQMX/vm7gqOEJLcXTGw3CAuRNeyaPWwjR8PRqKQ1PDA/dpv+on9Shox52WFnx0KY8onHayrJzm87i5h9xGw/tfkev0jGsQizqezUKjk12hBMKJ4kbCqGPVNXudyyrShovGw5CgxsRICxF6aRmSjlBnHRzg7Gx8fKqEubI2rahQYdR1YgDIRQO7JvQyD52hoIQx0mxa0ODtW2Iozn1le2iIRdzwWewedyZzewidueOGqlsn1MvcnQpuVwLGG3/IR1hIKxCjelIDZ8ldqWz25jWAsnldEnK0Zxro19TGVb2ffIZEsIO89EIEDvKMPrzmBOQcKQ+rroye6NgRRxqR4U8EAkz0CL6uSGOm6KQCdWjvjRiSP1BPalCRS5iQYiEIvxuBMJEWgzSoHADcVMuN7IuqqTeyUPq22qFimFtxDyBBJEwNyt6TM88blFHao/6tWWhuuOM4SAK4EI4QmFHA+SEyWlp4EQoJ13cYGzMu7yszEIBOm2rVmHUNqwAIQabISNMRstmdhNWcFLsSm+0tjJH1MdRxO5Nx0WDMhCtgD6OKgZeljJqJKc9po8juskR9XN0Y1lZ3mWjLR9JCO1jRDMd0fpYC2VnvjBSEFg7wBENc0R9HFlb0xvF1+TBEpF68d+DHR6IOWVv2BECtxo46hOFUBd/APU57WIoEwJhIi2CdpyZX0m93BZicktMj1AS9dClteUFAUNUIEygRZCtik5zSxI9MubTBH1GOiHsiLJ3OCoSZkILa9PxiN0EbvhsAo8tdAf9Seepd36lGWHmtNANTv5Jd0z4QYyeo/UEJqxKRpg5LZx6btLPsOaEmdMyxYdlc8LMaJnikDlhclqmPiQnTEpLUIZEwkRagjYkEibQErwhkTAKCLQEbUgkzJQWc/0PstHHcfEdQ+UAAAAASUVORK5CYII=);background-size:26px 26px}.leaflet-touch .leaflet-control-layers-toggle{width:44px;height:44px}.leaflet-control-layers .leaflet-control-layers-list,.leaflet-control-layers-expanded .leaflet-control-layers-toggle{display:none}.leaflet-control-layers-expanded .leaflet-control-layers-list{display:block;position:relative}.leaflet-control-layers-expanded{padding:6px 10px 6px 6px;color:#333;background:#fff}.leaflet-control-layers-scrollbar{overflow-y:scroll;overflow-x:hidden;padding-right:5px}.leaflet-control-layers-selector{margin-top:2px;position:relative;top:1px}.leaflet-control-layers label{display:block;font-size:13px;font-size:1.08333em}.leaflet-control-layers-separator{height:0;border-top:1px solid #ddd;margin:5px -10px 5px -6px}.leaflet-default-icon-path{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII=)}.leaflet-container .leaflet-control-attribution{background:#fff;background:#fffc;margin:0}.leaflet-control-attribution,.leaflet-control-scale-line{padding:0 5px;color:#333;line-height:1.4}.leaflet-control-attribution a{text-decoration:none}.leaflet-control-attribution a:hover,.leaflet-control-attribution a:focus{text-decoration:underline}.leaflet-attribution-flag{display:inline!important;vertical-align:baseline!important;width:1em;height:.6669em}.leaflet-left .leaflet-control-scale{margin-left:5px}.leaflet-bottom .leaflet-control-scale{margin-bottom:5px}.leaflet-control-scale-line{border:2px solid #777;border-top:none;line-height:1.1;padding:2px 5px 1px;white-space:nowrap;-moz-box-sizing:border-box;box-sizing:border-box;background:#fffc;text-shadow:1px 1px #fff}.leaflet-control-scale-line:not(:first-child){border-top:2px solid #777;border-bottom:none;margin-top:-2px}.leaflet-control-scale-line:not(:first-child):not(:last-child){border-bottom:2px solid #777}.leaflet-touch .leaflet-control-attribution,.leaflet-touch .leaflet-control-layers,.leaflet-touch .leaflet-bar{box-shadow:none}.leaflet-touch .leaflet-control-layers,.leaflet-touch .leaflet-bar{border:2px solid rgba(0,0,0,.2);background-clip:padding-box}.leaflet-popup{position:absolute;text-align:center;margin-bottom:20px}.leaflet-popup-content-wrapper{padding:1px;text-align:left;border-radius:12px}.leaflet-popup-content{margin:13px 24px 13px 20px;line-height:1.3;font-size:13px;font-size:1.08333em;min-height:1px}.leaflet-popup-content p{margin:1.3em 0}.leaflet-popup-tip-container{width:40px;height:20px;position:absolute;left:50%;margin-top:-1px;margin-left:-20px;overflow:hidden;pointer-events:none}.leaflet-popup-tip{width:17px;height:17px;padding:1px;margin:-10px auto 0;pointer-events:auto;-webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);-ms-transform:rotate(45deg);transform:rotate(45deg)}.leaflet-popup-content-wrapper,.leaflet-popup-tip{background:#fff;color:#333;box-shadow:0 3px 14px #0006}.leaflet-container a.leaflet-popup-close-button{position:absolute;top:0;right:0;border:none;text-align:center;width:24px;height:24px;font:16px/24px Tahoma,Verdana,sans-serif;color:#757575;text-decoration:none;background:transparent}.leaflet-container a.leaflet-popup-close-button:hover,.leaflet-container a.leaflet-popup-close-button:focus{color:#585858}.leaflet-popup-scrolled{overflow:auto}.leaflet-oldie .leaflet-popup-content-wrapper{-ms-zoom:1}.leaflet-oldie .leaflet-popup-tip{width:24px;margin:0 auto;-ms-filter:\"progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678)\";filter:progid:DXImageTransform.Microsoft.Matrix(M11=.70710678,M12=.70710678,M21=-.70710678,M22=.70710678)}.leaflet-oldie .leaflet-control-zoom,.leaflet-oldie .leaflet-control-layers,.leaflet-oldie .leaflet-popup-content-wrapper,.leaflet-oldie .leaflet-popup-tip{border:1px solid #999}.leaflet-div-icon{background:#fff;border:1px solid #666}.leaflet-tooltip{position:absolute;padding:6px;background-color:#fff;border:1px solid #fff;border-radius:3px;color:#222;white-space:nowrap;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none;box-shadow:0 1px 3px #0006}.leaflet-tooltip.leaflet-interactive{cursor:pointer;pointer-events:auto}.leaflet-tooltip-top:before,.leaflet-tooltip-bottom:before,.leaflet-tooltip-left:before,.leaflet-tooltip-right:before{position:absolute;pointer-events:none;border:6px solid transparent;background:transparent;content:\"\"}.leaflet-tooltip-bottom{margin-top:6px}.leaflet-tooltip-top{margin-top:-6px}.leaflet-tooltip-bottom:before,.leaflet-tooltip-top:before{left:50%;margin-left:-6px}.leaflet-tooltip-top:before{bottom:0;margin-bottom:-12px;border-top-color:#fff}.leaflet-tooltip-bottom:before{top:0;margin-top:-12px;margin-left:-6px;border-bottom-color:#fff}.leaflet-tooltip-left{margin-left:-6px}.leaflet-tooltip-right{margin-left:6px}.leaflet-tooltip-left:before,.leaflet-tooltip-right:before{top:50%;margin-top:-6px}.leaflet-tooltip-left:before{right:0;margin-right:-12px;border-left-color:#fff}.leaflet-tooltip-right:before{left:0;margin-left:-12px;border-right-color:#fff}@media print{.leaflet-control{-webkit-print-color-adjust:exact;print-color-adjust:exact}}.dirty-pill[data-v-b33f2d64]{display:inline-block;vertical-align:middle;margin-left:10px;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:.04em;background:var(--md-tertiary-container,#e8def8);color:var(--md-on-tertiary-container,#1d192b)}.fab.dirty[data-v-b33f2d64]{animation:fab-dirty-b33f2d64 1.6s ease-in-out infinite}@keyframes fab-dirty-b33f2d64{0%,to{box-shadow:0 0 color-mix(in srgb,var(--md-primary,#6750a4) 45%,transparent)}55%{box-shadow:0 0 0 8px transparent}}@media(prefers-reduced-motion:reduce){.fab.dirty[data-v-b33f2d64]{animation:none}}.count-pill.core-off[data-v-b33f2d64]{background:var(--md-surface-container-high,#d8d3dd);color:var(--md-on-surface-variant,#49454f);font-style:normal}.def-hint[data-v-b33f2d64]{display:block;font-size:10.5px;font-weight:500;color:var(--md-on-surface-variant,#49454f);opacity:.85;margin:1px 0 3px}.world-field[data-v-b33f2d64]{display:block;margin:10px 0}.world-label[data-v-b33f2d64]{display:block;font-size:12px;font-weight:600;color:var(--md-on-surface-variant);margin-bottom:4px}.world-text[data-v-b33f2d64]{width:100%;min-height:64px;padding:10px 14px;border:1px solid var(--md-outline-variant);border-radius:var(--r-sm);background:var(--md-surface-container-high);color:var(--md-on-surface);font:inherit;font-size:13px;line-height:1.5;resize:vertical;outline:none}.world-text[data-v-b33f2d64]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 14%,transparent)}.world-actions[data-v-b33f2d64]{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-top:12px}.wm-head[data-v-b33f2d64]{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;margin-bottom:6px}.wm-place[data-v-b33f2d64]{font-size:12px;color:var(--md-on-surface-variant)}.wm-premise[data-v-b33f2d64]{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin:2px 0 8px}.wm-map-wrap[data-v-b33f2d64]{position:relative;margin-top:8px}.world-map-leaflet[data-v-b33f2d64]{height:clamp(460px,72vh,820px);border-radius:16px;overflow:hidden;border:1px solid var(--md-outline-variant);background:#e8edf2}.world-map-leaflet.is-empty[data-v-b33f2d64]{display:none}.wm-reset[data-v-b33f2d64]{position:absolute;top:10px;right:10px;z-index:var(--z-overlay,2000);border:1px solid var(--md-outline-variant);background:#fffffff0;color:#33404c;border-radius:10px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer;box-shadow:0 1px 4px #0000002e}.wm-reset[data-v-b33f2d64]:hover{background:#fff}.wm-compass[data-v-b33f2d64]{position:absolute;left:12px;bottom:12px;z-index:var(--z-overlay,2000);width:38px;height:38px;border-radius:50%;background:#ffffffeb;border:1px solid #b9c3cd;box-shadow:0 1px 4px #0000002e;display:grid;place-items:center}.wm-compass i[data-v-b33f2d64]{font-style:normal;font-size:12px;font-weight:800;color:#d64545;position:relative}.wm-compass i[data-v-b33f2d64]:before{content:\"\";position:absolute;left:50%;top:-9px;transform:translate(-50%);border-left:4px solid transparent;border-right:4px solid transparent;border-bottom:9px solid #33404c}.wm-scope[data-v-b33f2d64]{position:absolute;bottom:12px;right:12px;z-index:var(--z-overlay,2000);border:1px solid var(--md-outline-variant);background:#fffffff0;color:#33404c;border-radius:10px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer;box-shadow:0 1px 4px #0000002e}.wm-scope[data-v-b33f2d64]:hover{background:#fff}.wm-offline[data-v-b33f2d64]{position:absolute;left:50%;bottom:12px;transform:translate(-50%);z-index:var(--z-overlay,2000);background:#d1495bf0;color:#fff;font-size:12px;font-weight:600;padding:5px 12px;border-radius:10px;box-shadow:0 1px 4px #00000040}.wm-routes[data-v-b33f2d64]{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(280px,100%),1fr));gap:18px;margin-top:14px}.wm-routes h4[data-v-b33f2d64]{margin:0 0 6px;font-size:13px;font-weight:800}.wm-routes ul[data-v-b33f2d64]{list-style:none;margin:0;padding:0}.wm-routes li[data-v-b33f2d64]{display:flex;gap:10px;padding:4px 0;border-bottom:1px dashed color-mix(in srgb,var(--md-outline-variant) 70%,transparent);font-size:12.5px}.wm-routes b[data-v-b33f2d64]{flex:0 0 88px}.wm-routes span[data-v-b33f2d64]{color:var(--md-on-surface-variant);line-height:1.5}.wm-legend[data-v-b33f2d64]{display:flex;flex-wrap:wrap;gap:14px;margin-top:12px;font-size:12px;color:var(--md-on-surface-variant)}.wm-legend span[data-v-b33f2d64]{display:inline-flex;align-items:center;gap:6px}.wm-legend i[data-v-b33f2d64]{width:12px;height:12px;border-radius:50%;display:inline-block;border:1.5px solid rgba(255,255,255,.7)}.wm-legend i.k-home[data-v-b33f2d64]{background:#e07a5f}.wm-legend i.k-work[data-v-b33f2d64]{background:#5b8def}.wm-legend i.k-shop[data-v-b33f2d64]{background:#e0a23d}.wm-legend i.k-food[data-v-b33f2d64]{background:#57a773}.wm-legend i.k-park[data-v-b33f2d64]{background:#3faead}.wm-legend i.k-transit[data-v-b33f2d64]{background:#8b6fd6}.wm-legend i.k-other[data-v-b33f2d64]{background:#8a94a6}.wm-legend i.k-actor[data-v-b33f2d64]{background:#fff;border-color:#d1495b;box-shadow:inset 0 0 0 3px #d1495b}.wm-legend i.k-metro[data-v-b33f2d64]{background:#d64545}.wm-legend i.k-bus[data-v-b33f2d64]{background:#e08a2e}.wm-legend i.k-park2[data-v-b33f2d64]{background:#9bd08f}.wm-legend i.k-water[data-v-b33f2d64]{background:#8fbfe6}.wm-legend i.k-hw[data-v-b33f2d64]{background:#f08c2e}.wm-legend i.k-arterial[data-v-b33f2d64]{background:#f7cf8a}.wm-legend i.k-street[data-v-b33f2d64]{background:#fff;border-color:#b9c3cd}.pfield[data-v-b33f2d64]{display:flex;flex-direction:column;gap:4px;margin-top:10px;font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}#app .pcp .pfield textarea.field[data-v-b33f2d64]{height:auto;min-height:70px;padding:10px 12px;resize:vertical;line-height:1.5}.cog-metric[data-v-b33f2d64]{display:flex;flex-direction:column;gap:4px;padding:10px 12px;border-radius:var(--r-sm);background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant)}.cog-metric span[data-v-b33f2d64]{font-size:11px;font-weight:700;letter-spacing:.04em;color:var(--md-on-surface-variant)}.cog-metric strong[data-v-b33f2d64]{font-size:16px;font-weight:800;letter-spacing:-.01em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.cog-metric.warn[data-v-b33f2d64]{border-color:var(--md-error,#b3261e);background:color-mix(in srgb,var(--md-error,#b3261e) 8%,transparent)}.cog-metric.warn span[data-v-b33f2d64],.cog-metric.warn strong[data-v-b33f2d64]{color:var(--md-error,#b3261e)}.som-channels[data-v-b33f2d64]{margin-top:10px;display:flex;flex-direction:column;gap:6px}.som-chan[data-v-b33f2d64]{display:grid;grid-template-columns:minmax(52px,88px) minmax(0,1fr) 48px;align-items:center;gap:10px}.som-chan-name[data-v-b33f2d64]{font-size:12px;font-weight:600;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.som-chan-bar[data-v-b33f2d64]{display:block;height:8px;border-radius:999px;background:var(--md-surface-container);overflow:hidden}.som-chan-bar i[data-v-b33f2d64]{display:block;width:100%;height:100%;border-radius:999px;background:var(--md-primary);transform-origin:left;transition:transform var(--duration-medium) var(--ease-out);will-change:transform}.som-chan-val[data-v-b33f2d64]{font-size:12px;font-weight:700;text-align:right;color:var(--md-on-surface-variant)}.at-a-glance[data-v-b33f2d64]{display:grid;grid-template-columns:190px minmax(0,1fr) minmax(0,1fr);gap:14px;align-items:start;margin:8px 0 4px}@media(max-width:900px){.at-a-glance[data-v-b33f2d64]{grid-template-columns:1fr 1fr}}@media(max-width:620px){.at-a-glance[data-v-b33f2d64]{grid-template-columns:1fr}}.mood-plot-wrap[data-v-b33f2d64]{position:relative;width:190px;padding:26px 22px 40px;background:var(--md-surface-container);border:1px solid color-mix(in srgb,var(--md-outline-variant) 60%,transparent);border-radius:var(--r-md);box-sizing:border-box}.mood-plot[data-v-b33f2d64]{display:block;width:100%}.plot-frame[data-v-b33f2d64]{fill:var(--md-surface-container-lowest);stroke:var(--md-outline-variant)}.plot-grid[data-v-b33f2d64]{stroke:var(--md-outline-variant);stroke-width:1;stroke-dasharray:3 4}.plot-dot[data-v-b33f2d64]{fill:var(--md-primary)}.plot-halo[data-v-b33f2d64]{fill:var(--md-primary);opacity:.22}.plot-label[data-v-b33f2d64]{position:absolute;font-size:10px;font-weight:700;letter-spacing:.04em;color:var(--md-on-surface-variant);pointer-events:none}.plot-n[data-v-b33f2d64]{top:6px;left:50%;transform:translate(-50%)}.plot-s[data-v-b33f2d64]{bottom:26px;left:50%;transform:translate(-50%)}.plot-w[data-v-b33f2d64]{left:8px;top:50%;transform:translateY(-58%)}.plot-e[data-v-b33f2d64]{right:8px;top:50%;transform:translateY(-58%)}.plot-quadrant[data-v-b33f2d64]{position:absolute;left:0;right:0;bottom:8px;text-align:center;font-size:12px;font-weight:800;color:var(--md-primary)}.glance-col[data-v-b33f2d64]{display:flex;flex-direction:column;gap:8px;min-width:0}.glance-title[data-v-b33f2d64]{display:flex;align-items:center;gap:8px;margin:0;font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--md-on-surface-variant)}.gauge-grid[data-v-b33f2d64]{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:10px;margin:8px 0}.gauge[data-v-b33f2d64]{display:flex;flex-direction:column;gap:5px;padding:10px 12px;border-radius:var(--r-sm);background:var(--md-surface-container);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);min-width:0}.gauge-head[data-v-b33f2d64]{display:flex;justify-content:space-between;align-items:baseline;gap:8px}.gauge-name[data-v-b33f2d64]{font-size:12px;font-weight:700;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.gauge-alias[data-v-b33f2d64]{font-style:normal;font-weight:500;font-size:11px;color:var(--md-on-surface-variant);opacity:.8;margin-left:6px}.gauge-val[data-v-b33f2d64]{font-size:13px;font-weight:800;font-variant-numeric:tabular-nums;white-space:nowrap}.gauge-state[data-v-b33f2d64]{font-weight:800;margin-right:2px}.gauge-state.good[data-v-b33f2d64]{color:var(--md-success)}.gauge-state.mid[data-v-b33f2d64]{color:var(--md-primary)}.gauge-state.bad[data-v-b33f2d64]{color:var(--md-error)}.gauge-bar[data-v-b33f2d64]{position:relative;display:block;height:8px;border-radius:999px;background:var(--md-surface-container-highest);overflow:visible}.gauge-bar.signed[data-v-b33f2d64]:before{content:\"\";position:absolute;left:50%;top:-3px;bottom:-3px;width:2px;border-radius:1px;background:var(--md-outline-variant)}.gauge-fill[data-v-b33f2d64]{position:absolute;top:0;bottom:0;border-radius:999px;transition:width .35s var(--ease-out,.25s ease),left .35s var(--ease-out,.25s ease)}.gauge-fill.good[data-v-b33f2d64]{background:var(--md-success)}.gauge-fill.mid[data-v-b33f2d64]{background:var(--md-primary)}.gauge-fill.bad[data-v-b33f2d64]{background:var(--md-error)}.gauge-effect[data-v-b33f2d64]{font-size:11px;line-height:1.45;color:var(--md-on-surface-variant)}.chip-row[data-v-b33f2d64]{display:flex;gap:8px;flex-wrap:wrap;margin:8px 0}.chip.warn[data-v-b33f2d64]{background:var(--md-error-container);color:var(--md-on-error-container)}.rel-card[data-v-b33f2d64]{display:flex;flex-direction:column;gap:10px}.rel-head[data-v-b33f2d64]{display:flex;justify-content:space-between;gap:10px;align-items:baseline;flex-wrap:wrap}.rel-track-row[data-v-b33f2d64]{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:10px;align-items:center}.rel-track-label[data-v-b33f2d64],.rel-stage-name[data-v-b33f2d64]{font-size:11px;font-weight:800;letter-spacing:.04em;color:var(--md-on-surface-variant);white-space:nowrap}.rel-stage-name[data-v-b33f2d64]{color:var(--md-primary)}.rel-track[data-v-b33f2d64]{display:flex;gap:3px;height:10px;border-radius:999px;overflow:hidden;background:var(--md-surface-container-highest)}.rel-seg[data-v-b33f2d64]{flex:1 1 0;background:color-mix(in srgb,var(--md-outline-variant) 45%,transparent)}.rel-seg.done[data-v-b33f2d64]{background:color-mix(in srgb,var(--md-primary) 45%,transparent)}.rel-seg.cur[data-v-b33f2d64]{background:var(--md-primary)}.rel-mode[data-v-b33f2d64]{display:flex;flex-direction:column;gap:4px;align-items:flex-start}.value-row[data-v-b33f2d64]{display:grid;grid-template-columns:minmax(72px,140px) minmax(0,1fr) 44px;gap:10px;align-items:center}.value-name[data-v-b33f2d64]{font-size:13px;font-weight:700;overflow-wrap:anywhere}.value-bar[data-v-b33f2d64]{position:relative;display:block;height:8px;border-radius:999px;background:var(--md-surface-container-highest)}.value-bar[data-v-b33f2d64]:before{content:\"\";position:absolute;left:50%;top:-3px;bottom:-3px;width:2px;border-radius:1px;background:var(--md-outline-variant)}.value-bar i[data-v-b33f2d64]{position:absolute;top:0;bottom:0;border-radius:999px;transition:width .35s var(--ease-out,.25s ease),left .35s var(--ease-out,.25s ease)}.value-bar i.good[data-v-b33f2d64]{background:var(--md-success)}.value-bar i.bad[data-v-b33f2d64]{background:var(--md-error)}.value-num[data-v-b33f2d64]{font-size:12px;font-weight:800;text-align:right;font-variant-numeric:tabular-nums;color:var(--md-on-surface-variant)}.chip[data-v-b33f2d64]{display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 12px;border-radius:999px;font-size:12px;font-weight:700;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.chip.muted[data-v-b33f2d64]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}.chip.ok[data-v-b33f2d64]{background:var(--md-success-container);color:var(--md-on-success-container,#0d3b1e)}#app .pcp .cog-metric[data-v-b33f2d64]{background:var(--md-surface-container)}.sync-pill[data-v-b33f2d64]{font-weight:500;opacity:.85}html[data-theme=dark] #app .pcp .world-map-leaflet{background:#10151c}html[data-theme=dark] #app .pcp .wm-reset,html[data-theme=dark] #app .pcp .wm-scope{background:color-mix(in srgb,var(--md-surface-container-high) 94%,transparent);color:var(--md-on-surface)}html[data-theme=dark] #app .pcp .wm-reset:hover,html[data-theme=dark] #app .pcp .wm-scope:hover{background:var(--md-surface-container-highest)}html[data-theme=dark] #app .pcp .wm-compass{background:color-mix(in srgb,var(--md-surface-container-high) 92%,transparent);border-color:var(--md-outline-variant)}html[data-theme=dark] .wm-district-inner{color:#aeb9c4;text-shadow:none}html[data-theme=dark] .wm-station .wm-route-inner{background:#1a2230;color:#d7dee6}html[data-theme=dark] .leaflet-container{background:#10151c}.wm-pin-holder,.wm-actor-holder{background:none;border:none}.wm-pin{position:absolute;left:0;top:0;width:16px;height:16px;border-radius:50%;background:var(--c,#8a94a6);border:3px solid #fff;box-shadow:0 2px 6px #00000073;transform:translate(-50%,-50%)}.wm-pin:after{content:\"\";position:absolute;left:50%;top:100%;width:2px;height:8px;background:#fff;transform:translate(-50%);opacity:.7}.wm-pin-label{position:absolute;left:12px;top:-9px;white-space:nowrap;background:#12141ad1;color:#fff;font-size:12px;font-weight:600;padding:2px 8px;border-radius:10px;pointer-events:none}.wm-actor-badge{position:absolute;left:0;top:0;width:26px;height:26px;border-radius:50%;background:#fff;color:#d1495b;border:3px solid #d1495b;font-size:14px;font-weight:800;line-height:1;display:grid;place-items:center;transform:translate(-50%,-50%);box-shadow:0 2px 6px #00000080;z-index:600}.wm-actor-name{position:absolute;left:0;top:20px;white-space:nowrap;background:#d1495b;color:#fff;font-size:11px;font-weight:700;padding:1px 7px;border-radius:9px;transform:translate(-50%)}.wm-district{background:none;border:none}.wm-district-inner{position:absolute;left:0;top:0;transform:translate(-50%,-50%);white-space:nowrap;font-size:12px;font-weight:800;letter-spacing:.2em;color:#5c6b78;text-shadow:0 1px 0 rgba(255,255,255,.9);pointer-events:none}.wm-route{background:none;border:none}.wm-route-inner{position:absolute;left:0;top:0;transform:translate(-50%,-50%);background:var(--c,#333);color:#fff;font-size:10px;font-weight:700;padding:1px 6px;border-radius:8px;white-space:nowrap;box-shadow:0 1px 3px #00000059;pointer-events:none}.wm-zoom-low .wm-minor{display:none}.wm-station .wm-route-inner{background:#fff;color:#33404c;border:1.5px solid var(--c,#888);border-radius:6px;font-size:9px;font-weight:700;padding:1px 5px}.leaflet-container{font-family:inherit;background:#e8edf2;border-radius:16px}.leaflet-container a{color:#2f6fed}.leaflet-popup-content{font-size:13px;line-height:1.5}\n";document.head.appendChild(s)}})();
