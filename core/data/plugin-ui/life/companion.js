import { defineComponent as Uo, ref as G, computed as A, onMounted as Fn, openBlock as _, createElementBlock as v, createElementVNode as n, createTextVNode as N, toDisplayString as r, createCommentVNode as E, Fragment as Q, renderList as Te, normalizeClass as Y, createVNode as Oe, Transition as Ca, withCtx as Bo, unref as Ve, withDirectives as P, vModelText as C, vModelCheckbox as fe, TransitionGroup as Ma, nextTick as Hn, watch as ui, onUnmounted as Zo, vShow as un, normalizeStyle as et } from "vue";
import { useRouter as za } from "vue-router";
import { i18n as Wn, useConfirm as Fo, AppSelect as De } from "@0kay/host";
function Ea(me) {
  return me && me.__esModule && Object.prototype.hasOwnProperty.call(me, "default") ? me.default : me;
}
var cn = { exports: {} };
var Oa = cn.exports, No;
function Aa() {
  return No || (No = 1, (function(me, g) {
    (function(a, re) {
      re(g);
    })(Oa, (function(a) {
      var re = "1.9.4";
      function Z(e) {
        var t, i, o, s;
        for (i = 1, o = arguments.length; i < o; i++) {
          s = arguments[i];
          for (t in s)
            e[t] = s[t];
        }
        return e;
      }
      var ae = Object.create || /* @__PURE__ */ (function() {
        function e() {
        }
        return function(t) {
          return e.prototype = t, new e();
        };
      })();
      function J(e, t) {
        var i = Array.prototype.slice;
        if (e.bind)
          return e.bind.apply(e, i.call(arguments, 1));
        var o = i.call(arguments, 2);
        return function() {
          return e.apply(t, o.length ? o.concat(i.call(arguments)) : arguments);
        };
      }
      var Fe = 0;
      function K(e) {
        return "_leaflet_id" in e || (e._leaflet_id = ++Fe), e._leaflet_id;
      }
      function Ae(e, t, i) {
        var o, s, c, d;
        return d = function() {
          o = !1, s && (c.apply(i, s), s = !1);
        }, c = function() {
          o ? s = arguments : (e.apply(i, arguments), setTimeout(d, t), o = !0);
        }, c;
      }
      function we(e, t, i) {
        var o = t[1], s = t[0], c = o - s;
        return e === o && i ? e : ((e - s) % c + c) % c + s;
      }
      function de() {
        return !1;
      }
      function B(e, t) {
        if (t === !1)
          return e;
        var i = Math.pow(10, t === void 0 ? 6 : t);
        return Math.round(e * i) / i;
      }
      function Xe(e) {
        return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "");
      }
      function xe(e) {
        return Xe(e).split(/\s+/);
      }
      function he(e, t) {
        Object.prototype.hasOwnProperty.call(e, "options") || (e.options = e.options ? ae(e.options) : {});
        for (var i in t)
          e.options[i] = t[i];
        return e.options;
      }
      function jt(e, t, i) {
        var o = [];
        for (var s in e)
          o.push(encodeURIComponent(i ? s.toUpperCase() : s) + "=" + encodeURIComponent(e[s]));
        return (!t || t.indexOf("?") === -1 ? "?" : "&") + o.join("&");
      }
      var Ot = /\{ *([\w_ -]+) *\}/g;
      function ut(e, t) {
        return e.replace(Ot, function(i, o) {
          var s = t[o];
          if (s === void 0)
            throw new Error("No value provided for variable " + i);
          return typeof s == "function" && (s = s(t)), s;
        });
      }
      var He = Array.isArray || function(e) {
        return Object.prototype.toString.call(e) === "[object Array]";
      };
      function qt(e, t) {
        for (var i = 0; i < e.length; i++)
          if (e[i] === t)
            return i;
        return -1;
      }
      var At = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
      function Kt(e) {
        return window["webkit" + e] || window["moz" + e] || window["ms" + e];
      }
      var Yt = 0;
      function ci(e) {
        var t = +/* @__PURE__ */ new Date(), i = Math.max(0, 16 - (t - Yt));
        return Yt = t + i, window.setTimeout(e, i);
      }
      var It = window.requestAnimationFrame || Kt("RequestAnimationFrame") || ci, $e = window.cancelAnimationFrame || Kt("CancelAnimationFrame") || Kt("CancelRequestAnimationFrame") || function(e) {
        window.clearTimeout(e);
      };
      function Se(e, t, i) {
        if (i && It === ci)
          e.call(t);
        else
          return It.call(window, J(e, t));
      }
      function Pe(e) {
        e && $e.call(window, e);
      }
      var Bt = {
        __proto__: null,
        extend: Z,
        create: ae,
        bind: J,
        get lastId() {
          return Fe;
        },
        stamp: K,
        throttle: Ae,
        wrapNum: we,
        falseFn: de,
        formatNum: B,
        trim: Xe,
        splitWords: xe,
        setOptions: he,
        getParamString: jt,
        template: ut,
        isArray: He,
        indexOf: qt,
        emptyImageUrl: At,
        requestFn: It,
        cancelFn: $e,
        requestAnimFrame: Se,
        cancelAnimFrame: Pe
      };
      function je() {
      }
      je.extend = function(e) {
        var t = function() {
          he(this), this.initialize && this.initialize.apply(this, arguments), this.callInitHooks();
        }, i = t.__super__ = this.prototype, o = ae(i);
        o.constructor = t, t.prototype = o;
        for (var s in this)
          Object.prototype.hasOwnProperty.call(this, s) && s !== "prototype" && s !== "__super__" && (t[s] = this[s]);
        return e.statics && Z(t, e.statics), e.includes && (di(e.includes), Z.apply(null, [o].concat(e.includes))), Z(o, e), delete o.statics, delete o.includes, o.options && (o.options = i.options ? ae(i.options) : {}, Z(o.options, e.options)), o._initHooks = [], o.callInitHooks = function() {
          if (!this._initHooksCalled) {
            i.callInitHooks && i.callInitHooks.call(this), this._initHooksCalled = !0;
            for (var c = 0, d = o._initHooks.length; c < d; c++)
              o._initHooks[c].call(this);
          }
        }, t;
      }, je.include = function(e) {
        var t = this.prototype.options;
        return Z(this.prototype, e), e.options && (this.prototype.options = t, this.mergeOptions(e.options)), this;
      }, je.mergeOptions = function(e) {
        return Z(this.prototype.options, e), this;
      }, je.addInitHook = function(e) {
        var t = Array.prototype.slice.call(arguments, 1), i = typeof e == "function" ? e : function() {
          this[e].apply(this, t);
        };
        return this.prototype._initHooks = this.prototype._initHooks || [], this.prototype._initHooks.push(i), this;
      };
      function di(e) {
        if (!(typeof L > "u" || !L || !L.Mixin)) {
          e = He(e) ? e : [e];
          for (var t = 0; t < e.length; t++)
            e[t] === L.Mixin.Events && console.warn("Deprecated include of L.Mixin.Events: this property will be removed in future releases, please inherit from L.Evented instead.", new Error().stack);
        }
      }
      var Ue = {
        /* @method on(type: String, fn: Function, context?: Object): this
         * Adds a listener function (`fn`) to a particular event type of the object. You can optionally specify the context of the listener (object the this keyword will point to). You can also pass several space-separated types (e.g. `'click dblclick'`).
         *
         * @alternative
         * @method on(eventMap: Object): this
         * Adds a set of type/listener pairs, e.g. `{click: onClick, mousemove: onMouseMove}`
         */
        on: function(e, t, i) {
          if (typeof e == "object")
            for (var o in e)
              this._on(o, e[o], t);
          else {
            e = xe(e);
            for (var s = 0, c = e.length; s < c; s++)
              this._on(e[s], t, i);
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
        off: function(e, t, i) {
          if (!arguments.length)
            delete this._events;
          else if (typeof e == "object")
            for (var o in e)
              this._off(o, e[o], t);
          else {
            e = xe(e);
            for (var s = arguments.length === 1, c = 0, d = e.length; c < d; c++)
              s ? this._off(e[c]) : this._off(e[c], t, i);
          }
          return this;
        },
        // attach listener (without syntactic sugar now)
        _on: function(e, t, i, o) {
          if (typeof t != "function") {
            console.warn("wrong listener type: " + typeof t);
            return;
          }
          if (this._listens(e, t, i) === !1) {
            i === this && (i = void 0);
            var s = { fn: t, ctx: i };
            o && (s.once = !0), this._events = this._events || {}, this._events[e] = this._events[e] || [], this._events[e].push(s);
          }
        },
        _off: function(e, t, i) {
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
            var d = this._listens(e, t, i);
            if (d !== !1) {
              var p = o[d];
              this._firingCount && (p.fn = de, this._events[e] = o = o.slice()), o.splice(d, 1);
            }
          }
        },
        // @method fire(type: String, data?: Object, propagate?: Boolean): this
        // Fires an event of the specified type. You can optionally provide a data
        // object — the first argument of the listener function will contain its
        // properties. The event can optionally be propagated to event parents.
        fire: function(e, t, i) {
          if (!this.listens(e, i))
            return this;
          var o = Z({}, t, {
            type: e,
            target: this,
            sourceTarget: t && t.sourceTarget || this
          });
          if (this._events) {
            var s = this._events[e];
            if (s) {
              this._firingCount = this._firingCount + 1 || 1;
              for (var c = 0, d = s.length; c < d; c++) {
                var p = s[c], f = p.fn;
                p.once && this.off(e, f, p.ctx), f.call(p.ctx || this, o);
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
        listens: function(e, t, i, o) {
          typeof e != "string" && console.warn('"string" type argument expected');
          var s = t;
          typeof t != "function" && (o = !!t, s = void 0, i = void 0);
          var c = this._events && this._events[e];
          if (c && c.length && this._listens(e, s, i) !== !1)
            return !0;
          if (o) {
            for (var d in this._eventParents)
              if (this._eventParents[d].listens(e, t, i, o))
                return !0;
          }
          return !1;
        },
        // returns the index (number) or false
        _listens: function(e, t, i) {
          if (!this._events)
            return !1;
          var o = this._events[e] || [];
          if (!t)
            return !!o.length;
          i === this && (i = void 0);
          for (var s = 0, c = o.length; s < c; s++)
            if (o[s].fn === t && o[s].ctx === i)
              return s;
          return !1;
        },
        // @method once(…): this
        // Behaves as [`on(…)`](#evented-on), except the listener will only get fired once and then removed.
        once: function(e, t, i) {
          if (typeof e == "object")
            for (var o in e)
              this._on(o, e[o], t, !0);
          else {
            e = xe(e);
            for (var s = 0, c = e.length; s < c; s++)
              this._on(e[s], t, i, !0);
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
            this._eventParents[t].fire(e.type, Z({
              layer: e.target,
              propagatedFrom: e.target
            }, e), !0);
        }
      };
      Ue.addEventListener = Ue.on, Ue.removeEventListener = Ue.clearAllEventListeners = Ue.off, Ue.addOneTimeEventListener = Ue.once, Ue.fireEvent = Ue.fire, Ue.hasEventListeners = Ue.listens;
      var xt = je.extend(Ue);
      function M(e, t, i) {
        this.x = i ? Math.round(e) : e, this.y = i ? Math.round(t) : t;
      }
      var _t = Math.trunc || function(e) {
        return e > 0 ? Math.floor(e) : Math.ceil(e);
      };
      M.prototype = {
        // @method clone(): Point
        // Returns a copy of the current point.
        clone: function() {
          return new M(this.x, this.y);
        },
        // @method add(otherPoint: Point): Point
        // Returns the result of addition of the current and the given points.
        add: function(e) {
          return this.clone()._add(V(e));
        },
        _add: function(e) {
          return this.x += e.x, this.y += e.y, this;
        },
        // @method subtract(otherPoint: Point): Point
        // Returns the result of subtraction of the given point from the current.
        subtract: function(e) {
          return this.clone()._subtract(V(e));
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
          return new M(this.x * e.x, this.y * e.y);
        },
        // @method unscaleBy(scale: Point): Point
        // Inverse of `scaleBy`. Divide each coordinate of the current point by
        // each coordinate of `scale`.
        unscaleBy: function(e) {
          return new M(this.x / e.x, this.y / e.y);
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
          return this.x = _t(this.x), this.y = _t(this.y), this;
        },
        // @method distanceTo(otherPoint: Point): Number
        // Returns the cartesian distance between the current and the given points.
        distanceTo: function(e) {
          e = V(e);
          var t = e.x - this.x, i = e.y - this.y;
          return Math.sqrt(t * t + i * i);
        },
        // @method equals(otherPoint: Point): Boolean
        // Returns `true` if the given point has the same coordinates.
        equals: function(e) {
          return e = V(e), e.x === this.x && e.y === this.y;
        },
        // @method contains(otherPoint: Point): Boolean
        // Returns `true` if both coordinates of the given point are less than the corresponding current point coordinates (in absolute values).
        contains: function(e) {
          return e = V(e), Math.abs(e.x) <= Math.abs(this.x) && Math.abs(e.y) <= Math.abs(this.y);
        },
        // @method toString(): String
        // Returns a string representation of the point for debugging purposes.
        toString: function() {
          return "Point(" + B(this.x) + ", " + B(this.y) + ")";
        }
      };
      function V(e, t, i) {
        return e instanceof M ? e : He(e) ? new M(e[0], e[1]) : e == null ? e : typeof e == "object" && "x" in e && "y" in e ? new M(e.x, e.y) : new M(e, t, i);
      }
      function m(e, t) {
        if (e)
          for (var i = t ? [e, t] : e, o = 0, s = i.length; o < s; o++)
            this.extend(i[o]);
      }
      m.prototype = {
        // @method extend(point: Point): this
        // Extends the bounds to contain the given point.
        // @alternative
        // @method extend(otherBounds: Bounds): this
        // Extend the bounds to contain the given bounds
        extend: function(e) {
          var t, i;
          if (!e)
            return this;
          if (e instanceof M || typeof e[0] == "number" || "x" in e)
            t = i = V(e);
          else if (e = T(e), t = e.min, i = e.max, !t || !i)
            return this;
          return !this.min && !this.max ? (this.min = t.clone(), this.max = i.clone()) : (this.min.x = Math.min(t.x, this.min.x), this.max.x = Math.max(i.x, this.max.x), this.min.y = Math.min(t.y, this.min.y), this.max.y = Math.max(i.y, this.max.y)), this;
        },
        // @method getCenter(round?: Boolean): Point
        // Returns the center point of the bounds.
        getCenter: function(e) {
          return V(
            (this.min.x + this.max.x) / 2,
            (this.min.y + this.max.y) / 2,
            e
          );
        },
        // @method getBottomLeft(): Point
        // Returns the bottom-left point of the bounds.
        getBottomLeft: function() {
          return V(this.min.x, this.max.y);
        },
        // @method getTopRight(): Point
        // Returns the top-right point of the bounds.
        getTopRight: function() {
          return V(this.max.x, this.min.y);
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
          var t, i;
          return typeof e[0] == "number" || e instanceof M ? e = V(e) : e = T(e), e instanceof m ? (t = e.min, i = e.max) : t = i = e, t.x >= this.min.x && i.x <= this.max.x && t.y >= this.min.y && i.y <= this.max.y;
        },
        // @method intersects(otherBounds: Bounds): Boolean
        // Returns `true` if the rectangle intersects the given bounds. Two bounds
        // intersect if they have at least one point in common.
        intersects: function(e) {
          e = T(e);
          var t = this.min, i = this.max, o = e.min, s = e.max, c = s.x >= t.x && o.x <= i.x, d = s.y >= t.y && o.y <= i.y;
          return c && d;
        },
        // @method overlaps(otherBounds: Bounds): Boolean
        // Returns `true` if the rectangle overlaps the given bounds. Two bounds
        // overlap if their intersection is an area.
        overlaps: function(e) {
          e = T(e);
          var t = this.min, i = this.max, o = e.min, s = e.max, c = s.x > t.x && o.x < i.x, d = s.y > t.y && o.y < i.y;
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
        pad: function(e) {
          var t = this.min, i = this.max, o = Math.abs(t.x - i.x) * e, s = Math.abs(t.y - i.y) * e;
          return T(
            V(t.x - o, t.y - s),
            V(i.x + o, i.y + s)
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
      function y(e, t) {
        if (e)
          for (var i = t ? [e, t] : e, o = 0, s = i.length; o < s; o++)
            this.extend(i[o]);
      }
      y.prototype = {
        // @method extend(latlng: LatLng): this
        // Extend the bounds to contain the given point
        // @alternative
        // @method extend(otherBounds: LatLngBounds): this
        // Extend the bounds to contain the given bounds
        extend: function(e) {
          var t = this._southWest, i = this._northEast, o, s;
          if (e instanceof X)
            o = e, s = e;
          else if (e instanceof y) {
            if (o = e._southWest, s = e._northEast, !o || !s)
              return this;
          } else
            return e ? this.extend($(e) || ee(e)) : this;
          return !t && !i ? (this._southWest = new X(o.lat, o.lng), this._northEast = new X(s.lat, s.lng)) : (t.lat = Math.min(o.lat, t.lat), t.lng = Math.min(o.lng, t.lng), i.lat = Math.max(s.lat, i.lat), i.lng = Math.max(s.lng, i.lng)), this;
        },
        // @method pad(bufferRatio: Number): LatLngBounds
        // Returns bounds created by extending or retracting the current bounds by a given ratio in each direction.
        // For example, a ratio of 0.5 extends the bounds by 50% in each direction.
        // Negative values will retract the bounds.
        pad: function(e) {
          var t = this._southWest, i = this._northEast, o = Math.abs(t.lat - i.lat) * e, s = Math.abs(t.lng - i.lng) * e;
          return new y(
            new X(t.lat - o, t.lng - s),
            new X(i.lat + o, i.lng + s)
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
          typeof e[0] == "number" || e instanceof X || "lat" in e ? e = $(e) : e = ee(e);
          var t = this._southWest, i = this._northEast, o, s;
          return e instanceof y ? (o = e.getSouthWest(), s = e.getNorthEast()) : o = s = e, o.lat >= t.lat && s.lat <= i.lat && o.lng >= t.lng && s.lng <= i.lng;
        },
        // @method intersects(otherBounds: LatLngBounds): Boolean
        // Returns `true` if the rectangle intersects the given bounds. Two bounds intersect if they have at least one point in common.
        intersects: function(e) {
          e = ee(e);
          var t = this._southWest, i = this._northEast, o = e.getSouthWest(), s = e.getNorthEast(), c = s.lat >= t.lat && o.lat <= i.lat, d = s.lng >= t.lng && o.lng <= i.lng;
          return c && d;
        },
        // @method overlaps(otherBounds: LatLngBounds): Boolean
        // Returns `true` if the rectangle overlaps the given bounds. Two bounds overlap if their intersection is an area.
        overlaps: function(e) {
          e = ee(e);
          var t = this._southWest, i = this._northEast, o = e.getSouthWest(), s = e.getNorthEast(), c = s.lat > t.lat && o.lat < i.lat, d = s.lng > t.lng && o.lng < i.lng;
          return c && d;
        },
        // @method toBBoxString(): String
        // Returns a string with bounding box coordinates in a 'southwest_lng,southwest_lat,northeast_lng,northeast_lat' format. Useful for sending requests to web services that return geo data.
        toBBoxString: function() {
          return [this.getWest(), this.getSouth(), this.getEast(), this.getNorth()].join(",");
        },
        // @method equals(otherBounds: LatLngBounds, maxMargin?: Number): Boolean
        // Returns `true` if the rectangle is equivalent (within a small margin of error) to the given bounds. The margin of error can be overridden by setting `maxMargin` to a small number.
        equals: function(e, t) {
          return e ? (e = ee(e), this._southWest.equals(e.getSouthWest(), t) && this._northEast.equals(e.getNorthEast(), t)) : !1;
        },
        // @method isValid(): Boolean
        // Returns `true` if the bounds are properly initialized.
        isValid: function() {
          return !!(this._southWest && this._northEast);
        }
      };
      function ee(e, t) {
        return e instanceof y ? e : new y(e, t);
      }
      function X(e, t, i) {
        if (isNaN(e) || isNaN(t))
          throw new Error("Invalid LatLng object: (" + e + ", " + t + ")");
        this.lat = +e, this.lng = +t, i !== void 0 && (this.alt = +i);
      }
      X.prototype = {
        // @method equals(otherLatLng: LatLng, maxMargin?: Number): Boolean
        // Returns `true` if the given `LatLng` point is at the same position (within a small margin of error). The margin of error can be overridden by setting `maxMargin` to a small number.
        equals: function(e, t) {
          if (!e)
            return !1;
          e = $(e);
          var i = Math.max(
            Math.abs(this.lat - e.lat),
            Math.abs(this.lng - e.lng)
          );
          return i <= (t === void 0 ? 1e-9 : t);
        },
        // @method toString(): String
        // Returns a string representation of the point (for debugging purposes).
        toString: function(e) {
          return "LatLng(" + B(this.lat, e) + ", " + B(this.lng, e) + ")";
        },
        // @method distanceTo(otherLatLng: LatLng): Number
        // Returns the distance (in meters) to the given `LatLng` calculated using the [Spherical Law of Cosines](https://en.wikipedia.org/wiki/Spherical_law_of_cosines).
        distanceTo: function(e) {
          return Be.distance(this, $(e));
        },
        // @method wrap(): LatLng
        // Returns a new `LatLng` object with the longitude wrapped so it's always between -180 and +180 degrees.
        wrap: function() {
          return Be.wrapLatLng(this);
        },
        // @method toBounds(sizeInMeters: Number): LatLngBounds
        // Returns a new `LatLngBounds` object in which each boundary is `sizeInMeters/2` meters apart from the `LatLng`.
        toBounds: function(e) {
          var t = 180 * e / 40075017, i = t / Math.cos(Math.PI / 180 * this.lat);
          return ee(
            [this.lat - t, this.lng - i],
            [this.lat + t, this.lng + i]
          );
        },
        clone: function() {
          return new X(this.lat, this.lng, this.alt);
        }
      };
      function $(e, t, i) {
        return e instanceof X ? e : He(e) && typeof e[0] != "object" ? e.length === 3 ? new X(e[0], e[1], e[2]) : e.length === 2 ? new X(e[0], e[1]) : null : e == null ? e : typeof e == "object" && "lat" in e ? new X(e.lat, "lng" in e ? e.lng : e.lon, e.alt) : t === void 0 ? null : new X(e, t, i);
      }
      var ge = {
        // @method latLngToPoint(latlng: LatLng, zoom: Number): Point
        // Projects geographical coordinates into pixel coordinates for a given zoom.
        latLngToPoint: function(e, t) {
          var i = this.projection.project(e), o = this.scale(t);
          return this.transformation._transform(i, o);
        },
        // @method pointToLatLng(point: Point, zoom: Number): LatLng
        // The inverse of `latLngToPoint`. Projects pixel coordinates on a given
        // zoom into geographical coordinates.
        pointToLatLng: function(e, t) {
          var i = this.scale(t), o = this.transformation.untransform(e, i);
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
          var t = this.projection.bounds, i = this.scale(e), o = this.transformation.transform(t.min, i), s = this.transformation.transform(t.max, i);
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
          var t = this.wrapLng ? we(e.lng, this.wrapLng, !0) : e.lng, i = this.wrapLat ? we(e.lat, this.wrapLat, !0) : e.lat, o = e.alt;
          return new X(i, t, o);
        },
        // @method wrapLatLngBounds(bounds: LatLngBounds): LatLngBounds
        // Returns a `LatLngBounds` with the same size as the given one, ensuring
        // that its center is within the CRS's bounds.
        // Only accepts actual `L.LatLngBounds` instances, not arrays.
        wrapLatLngBounds: function(e) {
          var t = e.getCenter(), i = this.wrapLatLng(t), o = t.lat - i.lat, s = t.lng - i.lng;
          if (o === 0 && s === 0)
            return e;
          var c = e.getSouthWest(), d = e.getNorthEast(), p = new X(c.lat - o, c.lng - s), f = new X(d.lat - o, d.lng - s);
          return new y(p, f);
        }
      }, Be = Z({}, ge, {
        wrapLng: [-180, 180],
        // Mean Earth Radius, as recommended for use by
        // the International Union of Geodesy and Geophysics,
        // see https://rosettacode.org/wiki/Haversine_formula
        R: 6371e3,
        // distance between two geographical points using spherical law of cosines approximation
        distance: function(e, t) {
          var i = Math.PI / 180, o = e.lat * i, s = t.lat * i, c = Math.sin((t.lat - e.lat) * i / 2), d = Math.sin((t.lng - e.lng) * i / 2), p = c * c + Math.cos(o) * Math.cos(s) * d * d, f = 2 * Math.atan2(Math.sqrt(p), Math.sqrt(1 - p));
          return this.R * f;
        }
      }), F = 6378137, Ri = {
        R: F,
        MAX_LATITUDE: 85.0511287798,
        project: function(e) {
          var t = Math.PI / 180, i = this.MAX_LATITUDE, o = Math.max(Math.min(i, e.lat), -i), s = Math.sin(o * t);
          return new M(
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
          var e = F * Math.PI;
          return new m([-e, -e], [e, e]);
        })()
      };
      function Vi(e, t, i, o) {
        if (He(e)) {
          this._a = e[0], this._b = e[1], this._c = e[2], this._d = e[3];
          return;
        }
        this._a = e, this._b = t, this._c = i, this._d = o;
      }
      Vi.prototype = {
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
          return t = t || 1, new M(
            (e.x / t - this._b) / this._a,
            (e.y / t - this._d) / this._c
          );
        }
      };
      function Zt(e, t, i, o) {
        return new Vi(e, t, i, o);
      }
      var hi = Z({}, Be, {
        code: "EPSG:3857",
        projection: Ri,
        transformation: (function() {
          var e = 0.5 / (Math.PI * Ri.R);
          return Zt(e, 0.5, -e, 0.5);
        })()
      }), dn = Z({}, hi, {
        code: "EPSG:900913"
      });
      function hn(e) {
        return document.createElementNS("http://www.w3.org/2000/svg", e);
      }
      function ct(e, t) {
        var i = "", o, s, c, d, p, f;
        for (o = 0, c = e.length; o < c; o++) {
          for (p = e[o], s = 0, d = p.length; s < d; s++)
            f = p[s], i += (s ? "L" : "M") + f.x + " " + f.y;
          i += t ? I.svg ? "z" : "x" : "";
        }
        return i || "M0 0";
      }
      var Di = document.documentElement.style, ye = "ActiveXObject" in window, vt = ye && !document.addEventListener, pi = "msLaunchUri" in navigator && !("documentMode" in document), Jt = nt("webkit"), pn = nt("android"), $i = nt("android 2") || nt("android 3"), fn = parseInt(/WebKit\/([0-9]+)|$/.exec(navigator.userAgent)[1], 10), mn = pn && nt("Google") && fn < 537 && !("AudioNode" in window), Ui = !!window.opera, _n = !pi && nt("chrome"), Fi = nt("gecko") && !Jt && !Ui && !ye, vn = !_n && nt("safari"), gn = nt("phantom"), yn = "OTransition" in Di, Le = navigator.platform.indexOf("Win") === 0, Xt = ye && "transition" in Di, Qt = "WebKitCSSMatrix" in window && "m11" in new window.WebKitCSSMatrix() && !$i, Hi = "MozPerspective" in Di, bn = !window.L_DISABLE_3D && (Xt || Qt || Hi) && !yn && !gn, kt = typeof orientation < "u" || nt("mobile"), fi = kt && Jt, Nt = kt && Qt, mi = !window.PointerEvent && window.MSPointerEvent, ei = !!(window.PointerEvent || mi), ti = "ontouchstart" in window || !!window.TouchEvent, wn = !window.L_NO_TOUCH && (ti || ei), xn = kt && Ui, le = kt && Fi, dt = (window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI) > 1, ht = (function() {
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
      })(), tt = (function() {
        return !!document.createElement("canvas").getContext;
      })(), it = !!(document.createElementNS && hn("svg").createSVGRect), Gn = !!it && (function() {
        var e = document.createElement("div");
        return e.innerHTML = "<svg/>", (e.firstChild && e.firstChild.namespaceURI) === "http://www.w3.org/2000/svg";
      })(), jn = !it && (function() {
        try {
          var e = document.createElement("div");
          e.innerHTML = '<v:shape adj="1"/>';
          var t = e.firstChild;
          return t.style.behavior = "url(#default#VML)", t && typeof t.adj == "object";
        } catch {
          return !1;
        }
      })(), qn = navigator.platform.indexOf("Mac") === 0, Kn = navigator.platform.indexOf("Linux") === 0;
      function nt(e) {
        return navigator.userAgent.toLowerCase().indexOf(e) >= 0;
      }
      var I = {
        ie: ye,
        ielt9: vt,
        edge: pi,
        webkit: Jt,
        android: pn,
        android23: $i,
        androidStock: mn,
        opera: Ui,
        chrome: _n,
        gecko: Fi,
        safari: vn,
        phantom: gn,
        opera12: yn,
        win: Le,
        ie3d: Xt,
        webkit3d: Qt,
        gecko3d: Hi,
        any3d: bn,
        mobile: kt,
        mobileWebkit: fi,
        mobileWebkit3d: Nt,
        msPointer: mi,
        pointer: ei,
        touch: wn,
        touchNative: ti,
        mobileOpera: xn,
        mobileGecko: le,
        retina: dt,
        passiveEvents: ht,
        canvas: tt,
        svg: it,
        vml: jn,
        inlineSvg: Gn,
        mac: qn,
        linux: Kn
      }, kn = I.msPointer ? "MSPointerDown" : "pointerdown", Pn = I.msPointer ? "MSPointerMove" : "pointermove", _i = I.msPointer ? "MSPointerUp" : "pointerup", Wi = I.msPointer ? "MSPointerCancel" : "pointercancel", vi = {
        touchstart: kn,
        touchmove: Pn,
        touchend: _i,
        touchcancel: Wi
      }, Gi = {
        touchstart: wi,
        touchmove: Pt,
        touchend: Pt,
        touchcancel: Pt
      }, Rt = {}, Ln = !1;
      function w(e, t, i) {
        return t === "touchstart" && bi(), Gi[t] ? (i = Gi[t].bind(this, i), e.addEventListener(vi[t], i, !1), i) : (console.warn("wrong event specified:", t), de);
      }
      function gi(e, t, i) {
        if (!vi[t]) {
          console.warn("wrong event specified:", t);
          return;
        }
        e.removeEventListener(vi[t], i, !1);
      }
      function Yn(e) {
        Rt[e.pointerId] = e;
      }
      function yi(e) {
        Rt[e.pointerId] && (Rt[e.pointerId] = e);
      }
      function ii(e) {
        delete Rt[e.pointerId];
      }
      function bi() {
        Ln || (document.addEventListener(kn, Yn, !0), document.addEventListener(Pn, yi, !0), document.addEventListener(_i, ii, !0), document.addEventListener(Wi, ii, !0), Ln = !0);
      }
      function Pt(e, t) {
        if (t.pointerType !== (t.MSPOINTER_TYPE_MOUSE || "mouse")) {
          t.touches = [];
          for (var i in Rt)
            t.touches.push(Rt[i]);
          t.changedTouches = [t], e(t);
        }
      }
      function wi(e, t) {
        t.MSPOINTER_TYPE_TOUCH && t.pointerType === t.MSPOINTER_TYPE_TOUCH && Ze(t), Pt(e, t);
      }
      function xi(e) {
        var t = {}, i, o;
        for (o in e)
          i = e[o], t[o] = i && i.bind ? i.bind(e) : i;
        return e = t, t.type = "dblclick", t.detail = 2, t.isTrusted = !1, t._simulated = !0, t;
      }
      var ki = 200;
      function Pi(e, t) {
        e.addEventListener("dblclick", t);
        var i = 0, o;
        function s(c) {
          if (c.detail !== 1) {
            o = c.detail;
            return;
          }
          if (!(c.pointerType === "mouse" || c.sourceCapabilities && !c.sourceCapabilities.firesTouchEvents)) {
            var d = Mi(c);
            if (!(d.some(function(f) {
              return f instanceof HTMLLabelElement && f.attributes.for;
            }) && !d.some(function(f) {
              return f instanceof HTMLInputElement || f instanceof HTMLSelectElement;
            }))) {
              var p = Date.now();
              p - i <= ki ? (o++, o === 2 && t(xi(c))) : o = 1, i = p;
            }
          }
        }
        return e.addEventListener("click", s), {
          dblclick: t,
          simDblclick: s
        };
      }
      function ot(e, t) {
        e.removeEventListener("dblclick", t.dblclick), e.removeEventListener("click", t.simDblclick);
      }
      var Vt = gt(
        ["transform", "webkitTransform", "OTransform", "MozTransform", "msTransform"]
      ), ni = gt(
        ["webkitTransition", "transition", "OTransition", "MozTransition", "msTransition"]
      ), at = ni === "webkitTransition" || ni === "OTransition" ? ni + "End" : "transitionend";
      function te(e) {
        return typeof e == "string" ? document.getElementById(e) : e;
      }
      function oi(e, t) {
        var i = e.style[t] || e.currentStyle && e.currentStyle[t];
        if ((!i || i === "auto") && document.defaultView) {
          var o = document.defaultView.getComputedStyle(e, null);
          i = o ? o[t] : null;
        }
        return i === "auto" ? null : i;
      }
      function se(e, t, i) {
        var o = document.createElement(e);
        return o.className = t || "", i && i.appendChild(o), o;
      }
      function be(e) {
        var t = e.parentNode;
        t && t.removeChild(e);
      }
      function ai(e) {
        for (; e.firstChild; )
          e.removeChild(e.firstChild);
      }
      function Dt(e) {
        var t = e.parentNode;
        t && t.lastChild !== e && t.appendChild(e);
      }
      function Ce(e) {
        var t = e.parentNode;
        t && t.firstChild !== e && t.insertBefore(e, t.firstChild);
      }
      function $t(e, t) {
        if (e.classList !== void 0)
          return e.classList.contains(t);
        var i = Ut(e);
        return i.length > 0 && new RegExp("(^|\\s)" + t + "(\\s|$)").test(i);
      }
      function j(e, t) {
        if (e.classList !== void 0)
          for (var i = xe(t), o = 0, s = i.length; o < s; o++)
            e.classList.add(i[o]);
        else if (!$t(e, t)) {
          var c = Ut(e);
          D(e, (c ? c + " " : "") + t);
        }
      }
      function q(e, t) {
        e.classList !== void 0 ? e.classList.remove(t) : D(e, Xe((" " + Ut(e) + " ").replace(" " + t + " ", " ")));
      }
      function D(e, t) {
        e.className.baseVal === void 0 ? e.className = t : e.className.baseVal = t;
      }
      function Ut(e) {
        return e.correspondingElement && (e = e.correspondingElement), e.className.baseVal === void 0 ? e.className : e.className.baseVal;
      }
      function We(e, t) {
        "opacity" in e.style ? e.style.opacity = t : "filter" in e.style && Tn(e, t);
      }
      function Tn(e, t) {
        var i = !1, o = "DXImageTransform.Microsoft.Alpha";
        try {
          i = e.filters.item(o);
        } catch {
          if (t === 1)
            return;
        }
        t = Math.round(t * 100), i ? (i.Enabled = t !== 100, i.Opacity = t) : e.style.filter += " progid:" + o + "(opacity=" + t + ")";
      }
      function gt(e) {
        for (var t = document.documentElement.style, i = 0; i < e.length; i++)
          if (e[i] in t)
            return e[i];
        return !1;
      }
      function qe(e, t, i) {
        var o = t || new M(0, 0);
        e.style[Vt] = (I.ie3d ? "translate(" + o.x + "px," + o.y + "px)" : "translate3d(" + o.x + "px," + o.y + "px,0)") + (i ? " scale(" + i + ")" : "");
      }
      function _e(e, t) {
        e._leaflet_pos = t, I.any3d ? qe(e, t) : (e.style.left = t.x + "px", e.style.top = t.y + "px");
      }
      function pt(e) {
        return e._leaflet_pos || new M(0, 0);
      }
      var Ke, si, ji;
      if ("onselectstart" in document)
        Ke = function() {
          H(window, "selectstart", Ze);
        }, si = function() {
          pe(window, "selectstart", Ze);
        };
      else {
        var yt = gt(
          ["userSelect", "WebkitUserSelect", "OUserSelect", "MozUserSelect", "msUserSelect"]
        );
        Ke = function() {
          if (yt) {
            var e = document.documentElement.style;
            ji = e[yt], e[yt] = "none";
          }
        }, si = function() {
          yt && (document.documentElement.style[yt] = ji, ji = void 0);
        };
      }
      function Ne() {
        H(window, "dragstart", Ze);
      }
      function Ye() {
        pe(window, "dragstart", Ze);
      }
      var Li, qi;
      function Ti(e) {
        for (; e.tabIndex === -1; )
          e = e.parentNode;
        e.style && (Si(), Li = e, qi = e.style.outlineStyle, e.style.outlineStyle = "none", H(window, "keydown", Si));
      }
      function Si() {
        Li && (Li.style.outlineStyle = qi, Li = void 0, qi = void 0, pe(window, "keydown", Si));
      }
      function Ci(e) {
        do
          e = e.parentNode;
        while ((!e.offsetWidth || !e.offsetHeight) && e !== document.body);
        return e;
      }
      function Ki(e) {
        var t = e.getBoundingClientRect();
        return {
          x: t.width / e.offsetWidth || 1,
          y: t.height / e.offsetHeight || 1,
          boundingClientRect: t
        };
      }
      var Lt = {
        __proto__: null,
        TRANSFORM: Vt,
        TRANSITION: ni,
        TRANSITION_END: at,
        get: te,
        getStyle: oi,
        create: se,
        remove: be,
        empty: ai,
        toFront: Dt,
        toBack: Ce,
        hasClass: $t,
        addClass: j,
        removeClass: q,
        setClass: D,
        getClass: Ut,
        setOpacity: We,
        testProp: gt,
        setTransform: qe,
        setPosition: _e,
        getPosition: pt,
        get disableTextSelection() {
          return Ke;
        },
        get enableTextSelection() {
          return si;
        },
        disableImageDrag: Ne,
        enableImageDrag: Ye,
        preventOutline: Ti,
        restoreOutline: Si,
        getSizedParentNode: Ci,
        getScale: Ki
      };
      function H(e, t, i, o) {
        if (t && typeof t == "object")
          for (var s in t)
            Ji(e, s, t[s], i);
        else {
          t = xe(t);
          for (var c = 0, d = t.length; c < d; c++)
            Ji(e, t[c], i, o);
        }
        return this;
      }
      var st = "_leaflet_events";
      function pe(e, t, i, o) {
        if (arguments.length === 1)
          Sn(e), delete e[st];
        else if (t && typeof t == "object")
          for (var s in t)
            Xi(e, s, t[s], i);
        else if (t = xe(t), arguments.length === 2)
          Sn(e, function(p) {
            return qt(t, p) !== -1;
          });
        else
          for (var c = 0, d = t.length; c < d; c++)
            Xi(e, t[c], i, o);
        return this;
      }
      function Sn(e, t) {
        for (var i in e[st]) {
          var o = i.split(/\d/)[0];
          (!t || t(o)) && Xi(e, o, null, null, i);
        }
      }
      var Yi = {
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        wheel: !("onwheel" in window) && "mousewheel"
      };
      function Ji(e, t, i, o) {
        var s = t + K(i) + (o ? "_" + K(o) : "");
        if (e[st] && e[st][s])
          return this;
        var c = function(p) {
          return i.call(o || e, p || window.event);
        }, d = c;
        !I.touchNative && I.pointer && t.indexOf("touch") === 0 ? c = w(e, t, c) : I.touch && t === "dblclick" ? c = Pi(e, c) : "addEventListener" in e ? t === "touchstart" || t === "touchmove" || t === "wheel" || t === "mousewheel" ? e.addEventListener(Yi[t] || t, c, I.passiveEvents ? { passive: !1 } : !1) : t === "mouseenter" || t === "mouseleave" ? (c = function(p) {
          p = p || window.event, Ht(e, p) && d(p);
        }, e.addEventListener(Yi[t], c, !1)) : e.addEventListener(t, d, !1) : e.attachEvent("on" + t, c), e[st] = e[st] || {}, e[st][s] = c;
      }
      function Xi(e, t, i, o, s) {
        s = s || t + K(i) + (o ? "_" + K(o) : "");
        var c = e[st] && e[st][s];
        if (!c)
          return this;
        !I.touchNative && I.pointer && t.indexOf("touch") === 0 ? gi(e, t, c) : I.touch && t === "dblclick" ? ot(e, c) : "removeEventListener" in e ? e.removeEventListener(Yi[t] || t, c, !1) : e.detachEvent("on" + t, c), e[st][s] = null;
      }
      function Tt(e) {
        return e.stopPropagation ? e.stopPropagation() : e.originalEvent ? e.originalEvent._stopped = !0 : e.cancelBubble = !0, this;
      }
      function Ft(e) {
        return Ji(e, "wheel", Tt), this;
      }
      function bt(e) {
        return H(e, "mousedown touchstart dblclick contextmenu", Tt), e._leaflet_disable_click = !0, this;
      }
      function Ze(e) {
        return e.preventDefault ? e.preventDefault() : e.returnValue = !1, this;
      }
      function ie(e) {
        return Ze(e), Tt(e), this;
      }
      function Mi(e) {
        if (e.composedPath)
          return e.composedPath();
        for (var t = [], i = e.target; i; )
          t.push(i), i = i.parentNode;
        return t;
      }
      function Qi(e, t) {
        if (!t)
          return new M(e.clientX, e.clientY);
        var i = Ki(t), o = i.boundingClientRect;
        return new M(
          // offset.left/top values are in page scale (like clientX/Y),
          // whereas clientLeft/Top (border width) values are the original values (before CSS scale applies).
          (e.clientX - o.left) / i.x - t.clientLeft,
          (e.clientY - o.top) / i.y - t.clientTop
        );
      }
      var Cn = I.linux && I.chrome ? window.devicePixelRatio : I.mac ? window.devicePixelRatio * 3 : window.devicePixelRatio > 0 ? 2 * window.devicePixelRatio : 1;
      function b(e) {
        return I.edge ? e.wheelDeltaY / 2 : (
          // Don't trust window-geometry-based delta
          e.deltaY && e.deltaMode === 0 ? -e.deltaY / Cn : (
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
      function Ht(e, t) {
        var i = t.relatedTarget;
        if (!i)
          return !0;
        try {
          for (; i && i !== e; )
            i = i.parentNode;
        } catch {
          return !1;
        }
        return i !== e;
      }
      var Jn = {
        __proto__: null,
        on: H,
        off: pe,
        stopPropagation: Tt,
        disableScrollPropagation: Ft,
        disableClickPropagation: bt,
        preventDefault: Ze,
        stop: ie,
        getPropagationPath: Mi,
        getMousePosition: Qi,
        getWheelDelta: b,
        isExternalTarget: Ht,
        addListener: H,
        removeListener: pe
      }, Mn = xt.extend({
        // @method run(el: HTMLElement, newPos: Point, duration?: Number, easeLinearity?: Number)
        // Run an animation of a given element to a new position, optionally setting
        // duration in seconds (`0.25` by default) and easing linearity factor (3rd
        // argument of the [cubic bezier curve](https://cubic-bezier.com/#0,0,.5,1),
        // `0.5` by default).
        run: function(e, t, i, o) {
          this.stop(), this._el = e, this._inProgress = !0, this._duration = i || 0.25, this._easeOutPower = 1 / Math.max(o || 0.5, 0.2), this._startPos = pt(e), this._offset = t.subtract(this._startPos), this._startTime = +/* @__PURE__ */ new Date(), this.fire("start"), this._animate();
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
          var t = +/* @__PURE__ */ new Date() - this._startTime, i = this._duration * 1e3;
          t < i ? this._runFrame(this._easeOut(t / i), e) : (this._runFrame(1), this._complete());
        },
        _runFrame: function(e, t) {
          var i = this._startPos.add(this._offset.multiplyBy(e));
          t && i._round(), _e(this._el, i), this.fire("step");
        },
        _complete: function() {
          Pe(this._animId), this._inProgress = !1, this.fire("end");
        },
        _easeOut: function(e) {
          return 1 - Math.pow(1 - e, this._easeOutPower);
        }
      }), oe = xt.extend({
        options: {
          // @section Map State Options
          // @option crs: CRS = L.CRS.EPSG3857
          // The [Coordinate Reference System](#crs) to use. Don't change this if you're not
          // sure what it means.
          crs: hi,
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
          t = he(this, t), this._handlers = [], this._layers = {}, this._zoomBoundLayers = {}, this._sizeChanged = !0, this._initContainer(e), this._initLayout(), this._onResize = J(this._onResize, this), this._initEvents(), t.maxBounds && this.setMaxBounds(t.maxBounds), t.zoom !== void 0 && (this._zoom = this._limitZoom(t.zoom)), t.center && t.zoom !== void 0 && this.setView($(t.center), t.zoom, { reset: !0 }), this.callInitHooks(), this._zoomAnimated = ni && I.any3d && !I.mobileOpera && this.options.zoomAnimation, this._zoomAnimated && (this._createAnimProxy(), H(this._proxy, at, this._catchTransitionEnd, this)), this._addLayers(this.options.layers);
        },
        // @section Methods for modifying map state
        // @method setView(center: LatLng, zoom: Number, options?: Zoom/pan options): this
        // Sets the view of the map (geographical center and zoom) with the given
        // animation options.
        setView: function(e, t, i) {
          if (t = t === void 0 ? this._zoom : this._limitZoom(t), e = this._limitCenter($(e), t, this.options.maxBounds), i = i || {}, this._stop(), this._loaded && !i.reset && i !== !0) {
            i.animate !== void 0 && (i.zoom = Z({ animate: i.animate }, i.zoom), i.pan = Z({ animate: i.animate, duration: i.duration }, i.pan));
            var o = this._zoom !== t ? this._tryAnimatedZoom && this._tryAnimatedZoom(e, t, i.zoom) : this._tryAnimatedPan(e, i.pan);
            if (o)
              return clearTimeout(this._sizeTimer), this;
          }
          return this._resetView(e, t, i.pan && i.pan.noMoveStart), this;
        },
        // @method setZoom(zoom: Number, options?: Zoom/pan options): this
        // Sets the zoom of the map.
        setZoom: function(e, t) {
          return this._loaded ? this.setView(this.getCenter(), e, { zoom: t }) : (this._zoom = e, this);
        },
        // @method zoomIn(delta?: Number, options?: Zoom options): this
        // Increases the zoom of the map by `delta` ([`zoomDelta`](#map-zoomdelta) by default).
        zoomIn: function(e, t) {
          return e = e || (I.any3d ? this.options.zoomDelta : 1), this.setZoom(this._zoom + e, t);
        },
        // @method zoomOut(delta?: Number, options?: Zoom options): this
        // Decreases the zoom of the map by `delta` ([`zoomDelta`](#map-zoomdelta) by default).
        zoomOut: function(e, t) {
          return e = e || (I.any3d ? this.options.zoomDelta : 1), this.setZoom(this._zoom - e, t);
        },
        // @method setZoomAround(latlng: LatLng, zoom: Number, options: Zoom options): this
        // Zooms the map while keeping a specified geographical point on the map
        // stationary (e.g. used internally for scroll zoom and double-click zoom).
        // @alternative
        // @method setZoomAround(offset: Point, zoom: Number, options: Zoom options): this
        // Zooms the map while keeping a specified pixel on the map (relative to the top-left corner) stationary.
        setZoomAround: function(e, t, i) {
          var o = this.getZoomScale(t), s = this.getSize().divideBy(2), c = e instanceof M ? e : this.latLngToContainerPoint(e), d = c.subtract(s).multiplyBy(1 - 1 / o), p = this.containerPointToLatLng(s.add(d));
          return this.setView(p, t, { zoom: i });
        },
        _getBoundsCenterZoom: function(e, t) {
          t = t || {}, e = e.getBounds ? e.getBounds() : ee(e);
          var i = V(t.paddingTopLeft || t.padding || [0, 0]), o = V(t.paddingBottomRight || t.padding || [0, 0]), s = this.getBoundsZoom(e, !1, i.add(o));
          if (s = typeof t.maxZoom == "number" ? Math.min(t.maxZoom, s) : s, s === 1 / 0)
            return {
              center: e.getCenter(),
              zoom: s
            };
          var c = o.subtract(i).divideBy(2), d = this.project(e.getSouthWest(), s), p = this.project(e.getNorthEast(), s), f = this.unproject(d.add(p).divideBy(2).add(c), s);
          return {
            center: f,
            zoom: s
          };
        },
        // @method fitBounds(bounds: LatLngBounds, options?: fitBounds options): this
        // Sets a map view that contains the given geographical bounds with the
        // maximum zoom level possible.
        fitBounds: function(e, t) {
          if (e = ee(e), !e.isValid())
            throw new Error("Bounds are not valid.");
          var i = this._getBoundsCenterZoom(e, t);
          return this.setView(i.center, i.zoom, t);
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
          if (e = V(e).round(), t = t || {}, !e.x && !e.y)
            return this.fire("moveend");
          if (t.animate !== !0 && !this.getSize().contains(e))
            return this._resetView(this.unproject(this.project(this.getCenter()).add(e)), this.getZoom()), this;
          if (this._panAnim || (this._panAnim = new Mn(), this._panAnim.on({
            step: this._onPanTransitionStep,
            end: this._onPanTransitionEnd
          }, this)), t.noMoveStart || this.fire("movestart"), t.animate !== !1) {
            j(this._mapPane, "leaflet-pan-anim");
            var i = this._getMapPanePos().subtract(e).round();
            this._panAnim.run(this._mapPane, i, t.duration || 0.25, t.easeLinearity);
          } else
            this._rawPanBy(e), this.fire("move").fire("moveend");
          return this;
        },
        // @method flyTo(latlng: LatLng, zoom?: Number, options?: Zoom/pan options): this
        // Sets the view of the map (geographical center and zoom) performing a smooth
        // pan-zoom animation.
        flyTo: function(e, t, i) {
          if (i = i || {}, i.animate === !1 || !I.any3d)
            return this.setView(e, t, i);
          this._stop();
          var o = this.project(this.getCenter()), s = this.project(e), c = this.getSize(), d = this._zoom;
          e = $(e), t = t === void 0 ? d : t;
          var p = Math.max(c.x, c.y), f = p * this.getZoomScale(d, t), x = s.distanceTo(o) || 1, S = 1.42, U = S * S;
          function ne(Ie) {
            var Un = Ie ? -1 : 1, Pa = Ie ? f : p, La = f * f - p * p + Un * U * U * x * x, Ta = 2 * Pa * U * x, so = La / Ta, Io = Math.sqrt(so * so + 1) - so, Sa = Io < 1e-9 ? -18 : Math.log(Io);
            return Sa;
          }
          function Ge(Ie) {
            return (Math.exp(Ie) - Math.exp(-Ie)) / 2;
          }
          function Re(Ie) {
            return (Math.exp(Ie) + Math.exp(-Ie)) / 2;
          }
          function lt(Ie) {
            return Ge(Ie) / Re(Ie);
          }
          var Je = ne(0);
          function Ni(Ie) {
            return p * (Re(Je) / Re(Je + S * Ie));
          }
          function ba(Ie) {
            return p * (Re(Je) * lt(Je + S * Ie) - Ge(Je)) / U;
          }
          function wa(Ie) {
            return 1 - Math.pow(1 - Ie, 1.5);
          }
          var xa = Date.now(), Oo = (ne(1) - Je) / S, ka = i.duration ? 1e3 * i.duration : 1e3 * Oo * 0.8;
          function Ao() {
            var Ie = (Date.now() - xa) / ka, Un = wa(Ie) * Oo;
            Ie <= 1 ? (this._flyToFrame = Se(Ao, this), this._move(
              this.unproject(o.add(s.subtract(o).multiplyBy(ba(Un) / x)), d),
              this.getScaleZoom(p / Ni(Un), d),
              { flyTo: !0 }
            )) : this._move(e, t)._moveEnd(!0);
          }
          return this._moveStart(!0, i.noMoveStart), Ao.call(this), this;
        },
        // @method flyToBounds(bounds: LatLngBounds, options?: fitBounds options): this
        // Sets the view of the map with a smooth animation like [`flyTo`](#map-flyto),
        // but takes a bounds parameter like [`fitBounds`](#map-fitbounds).
        flyToBounds: function(e, t) {
          var i = this._getBoundsCenterZoom(e, t);
          return this.flyTo(i.center, i.zoom, t);
        },
        // @method setMaxBounds(bounds: LatLngBounds): this
        // Restricts the map view to the given bounds (see the [maxBounds](#map-maxbounds) option).
        setMaxBounds: function(e) {
          return e = ee(e), this.listens("moveend", this._panInsideMaxBounds) && this.off("moveend", this._panInsideMaxBounds), e.isValid() ? (this.options.maxBounds = e, this._loaded && this._panInsideMaxBounds(), this.on("moveend", this._panInsideMaxBounds)) : (this.options.maxBounds = null, this);
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
          var i = this.getCenter(), o = this._limitCenter(i, this._zoom, ee(e));
          return i.equals(o) || this.panTo(o, t), this._enforcingBounds = !1, this;
        },
        // @method panInside(latlng: LatLng, options?: padding options): this
        // Pans the map the minimum amount to make the `latlng` visible. Use
        // padding options to fit the display to more restricted bounds.
        // If `latlng` is already within the (optionally padded) display bounds,
        // the map will not be panned.
        panInside: function(e, t) {
          t = t || {};
          var i = V(t.paddingTopLeft || t.padding || [0, 0]), o = V(t.paddingBottomRight || t.padding || [0, 0]), s = this.project(this.getCenter()), c = this.project(e), d = this.getPixelBounds(), p = T([d.min.add(i), d.max.subtract(o)]), f = p.getSize();
          if (!p.contains(c)) {
            this._enforcingBounds = !0;
            var x = c.subtract(p.getCenter()), S = p.extend(c).getSize().subtract(f);
            s.x += x.x < 0 ? -S.x : S.x, s.y += x.y < 0 ? -S.y : S.y, this.panTo(this.unproject(s), t), this._enforcingBounds = !1;
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
          e = Z({
            animate: !1,
            pan: !0
          }, e === !0 ? { animate: !0 } : e);
          var t = this.getSize();
          this._sizeChanged = !0, this._lastCenter = null;
          var i = this.getSize(), o = t.divideBy(2).round(), s = i.divideBy(2).round(), c = o.subtract(s);
          return !c.x && !c.y ? this : (e.animate && e.pan ? this.panBy(c) : (e.pan && this._rawPanBy(c), this.fire("move"), e.debounceMoveend ? (clearTimeout(this._sizeTimer), this._sizeTimer = setTimeout(J(this.fire, this, "moveend"), 200)) : this.fire("moveend")), this.fire("resize", {
            oldSize: t,
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
        locate: function(e) {
          if (e = this._locateOptions = Z({
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
          var t = J(this._handleGeolocationResponse, this), i = J(this._handleGeolocationError, this);
          return e.watch ? this._locationWatchId = navigator.geolocation.watchPosition(t, i, e) : navigator.geolocation.getCurrentPosition(t, i, e), this;
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
            var t = e.code, i = e.message || (t === 1 ? "permission denied" : t === 2 ? "position unavailable" : "timeout");
            this._locateOptions.setView && !this._loaded && this.fitWorld(), this.fire("locationerror", {
              code: t,
              message: "Geolocation error: " + i + "."
            });
          }
        },
        _handleGeolocationResponse: function(e) {
          if (this._container._leaflet_id) {
            var t = e.coords.latitude, i = e.coords.longitude, o = new X(t, i), s = o.toBounds(e.coords.accuracy * 2), c = this._locateOptions;
            if (c.setView) {
              var d = this.getBoundsZoom(s);
              this.setView(o, c.maxZoom ? Math.min(d, c.maxZoom) : d);
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
          var i = this[e] = new t(this);
          return this._handlers.push(i), this.options[e] && i.enable(), this;
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
          this._locationWatchId !== void 0 && this.stopLocate(), this._stop(), be(this._mapPane), this._clearControlPos && this._clearControlPos(), this._resizeRequest && (Pe(this._resizeRequest), this._resizeRequest = null), this._clearHandlers(), this._loaded && this.fire("unload");
          var e;
          for (e in this._layers)
            this._layers[e].remove();
          for (e in this._panes)
            be(this._panes[e]);
          return this._layers = [], this._panes = [], delete this._mapPane, delete this._renderer, this;
        },
        // @section Other Methods
        // @method createPane(name: String, container?: HTMLElement): HTMLElement
        // Creates a new [map pane](#map-pane) with the given name if it doesn't exist already,
        // then returns it. The pane is created as a child of `container`, or
        // as a child of the main map pane if not set.
        createPane: function(e, t) {
          var i = "leaflet-pane" + (e ? " leaflet-" + e.replace("Pane", "") + "-pane" : ""), o = se("div", i, t || this._mapPane);
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
          var e = this.getPixelBounds(), t = this.unproject(e.getBottomLeft()), i = this.unproject(e.getTopRight());
          return new y(t, i);
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
        getBoundsZoom: function(e, t, i) {
          e = ee(e), i = V(i || [0, 0]);
          var o = this.getZoom() || 0, s = this.getMinZoom(), c = this.getMaxZoom(), d = e.getNorthWest(), p = e.getSouthEast(), f = this.getSize().subtract(i), x = T(this.project(p, o), this.project(d, o)).getSize(), S = I.any3d ? this.options.zoomSnap : 1, U = f.x / x.x, ne = f.y / x.y, Ge = t ? Math.max(U, ne) : Math.min(U, ne);
          return o = this.getScaleZoom(Ge, o), S && (o = Math.round(o / (S / 100)) * (S / 100), o = t ? Math.ceil(o / S) * S : Math.floor(o / S) * S), Math.max(s, Math.min(c, o));
        },
        // @method getSize(): Point
        // Returns the current size of the map container (in pixels).
        getSize: function() {
          return (!this._size || this._sizeChanged) && (this._size = new M(
            this._container.clientWidth || 0,
            this._container.clientHeight || 0
          ), this._sizeChanged = !1), this._size.clone();
        },
        // @method getPixelBounds(): Bounds
        // Returns the bounds of the current map view in projected pixel
        // coordinates (sometimes useful in layer and overlay implementations).
        getPixelBounds: function(e, t) {
          var i = this._getTopLeftPoint(e, t);
          return new m(i, i.add(this.getSize()));
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
          var i = this.options.crs;
          return t = t === void 0 ? this._zoom : t, i.scale(e) / i.scale(t);
        },
        // @method getScaleZoom(scale: Number, fromZoom: Number): Number
        // Returns the zoom level that the map would end up at, if it is at `fromZoom`
        // level and everything is scaled by a factor of `scale`. Inverse of
        // [`getZoomScale`](#map-getZoomScale).
        getScaleZoom: function(e, t) {
          var i = this.options.crs;
          t = t === void 0 ? this._zoom : t;
          var o = i.zoom(e * i.scale(t));
          return isNaN(o) ? 1 / 0 : o;
        },
        // @method project(latlng: LatLng, zoom: Number): Point
        // Projects a geographical coordinate `LatLng` according to the projection
        // of the map's CRS, then scales it according to `zoom` and the CRS's
        // `Transformation`. The result is pixel coordinate relative to
        // the CRS origin.
        project: function(e, t) {
          return t = t === void 0 ? this._zoom : t, this.options.crs.latLngToPoint($(e), t);
        },
        // @method unproject(point: Point, zoom: Number): LatLng
        // Inverse of [`project`](#map-project).
        unproject: function(e, t) {
          return t = t === void 0 ? this._zoom : t, this.options.crs.pointToLatLng(V(e), t);
        },
        // @method layerPointToLatLng(point: Point): LatLng
        // Given a pixel coordinate relative to the [origin pixel](#map-getpixelorigin),
        // returns the corresponding geographical coordinate (for the current zoom level).
        layerPointToLatLng: function(e) {
          var t = V(e).add(this.getPixelOrigin());
          return this.unproject(t);
        },
        // @method latLngToLayerPoint(latlng: LatLng): Point
        // Given a geographical coordinate, returns the corresponding pixel coordinate
        // relative to the [origin pixel](#map-getpixelorigin).
        latLngToLayerPoint: function(e) {
          var t = this.project($(e))._round();
          return t._subtract(this.getPixelOrigin());
        },
        // @method wrapLatLng(latlng: LatLng): LatLng
        // Returns a `LatLng` where `lat` and `lng` has been wrapped according to the
        // map's CRS's `wrapLat` and `wrapLng` properties, if they are outside the
        // CRS's bounds.
        // By default this means longitude is wrapped around the dateline so its
        // value is between -180 and +180 degrees.
        wrapLatLng: function(e) {
          return this.options.crs.wrapLatLng($(e));
        },
        // @method wrapLatLngBounds(bounds: LatLngBounds): LatLngBounds
        // Returns a `LatLngBounds` with the same size as the given one, ensuring that
        // its center is within the CRS's bounds.
        // By default this means the center longitude is wrapped around the dateline so its
        // value is between -180 and +180 degrees, and the majority of the bounds
        // overlaps the CRS's bounds.
        wrapLatLngBounds: function(e) {
          return this.options.crs.wrapLatLngBounds(ee(e));
        },
        // @method distance(latlng1: LatLng, latlng2: LatLng): Number
        // Returns the distance between two geographical coordinates according to
        // the map's CRS. By default this measures distance in meters.
        distance: function(e, t) {
          return this.options.crs.distance($(e), $(t));
        },
        // @method containerPointToLayerPoint(point: Point): Point
        // Given a pixel coordinate relative to the map container, returns the corresponding
        // pixel coordinate relative to the [origin pixel](#map-getpixelorigin).
        containerPointToLayerPoint: function(e) {
          return V(e).subtract(this._getMapPanePos());
        },
        // @method layerPointToContainerPoint(point: Point): Point
        // Given a pixel coordinate relative to the [origin pixel](#map-getpixelorigin),
        // returns the corresponding pixel coordinate relative to the map container.
        layerPointToContainerPoint: function(e) {
          return V(e).add(this._getMapPanePos());
        },
        // @method containerPointToLatLng(point: Point): LatLng
        // Given a pixel coordinate relative to the map container, returns
        // the corresponding geographical coordinate (for the current zoom level).
        containerPointToLatLng: function(e) {
          var t = this.containerPointToLayerPoint(V(e));
          return this.layerPointToLatLng(t);
        },
        // @method latLngToContainerPoint(latlng: LatLng): Point
        // Given a geographical coordinate, returns the corresponding pixel coordinate
        // relative to the map container.
        latLngToContainerPoint: function(e) {
          return this.layerPointToContainerPoint(this.latLngToLayerPoint($(e)));
        },
        // @method mouseEventToContainerPoint(ev: MouseEvent): Point
        // Given a MouseEvent object, returns the pixel coordinate relative to the
        // map container where the event took place.
        mouseEventToContainerPoint: function(e) {
          return Qi(e, this._container);
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
          var t = this._container = te(e);
          if (t) {
            if (t._leaflet_id)
              throw new Error("Map container is already initialized.");
          } else throw new Error("Map container not found.");
          H(t, "scroll", this._onScroll, this), this._containerId = K(t);
        },
        _initLayout: function() {
          var e = this._container;
          this._fadeAnimated = this.options.fadeAnimation && I.any3d, j(e, "leaflet-container" + (I.touch ? " leaflet-touch" : "") + (I.retina ? " leaflet-retina" : "") + (I.ielt9 ? " leaflet-oldie" : "") + (I.safari ? " leaflet-safari" : "") + (this._fadeAnimated ? " leaflet-fade-anim" : ""));
          var t = oi(e, "position");
          t !== "absolute" && t !== "relative" && t !== "fixed" && t !== "sticky" && (e.style.position = "relative"), this._initPanes(), this._initControlPos && this._initControlPos();
        },
        _initPanes: function() {
          var e = this._panes = {};
          this._paneRenderers = {}, this._mapPane = this.createPane("mapPane", this._container), _e(this._mapPane, new M(0, 0)), this.createPane("tilePane"), this.createPane("overlayPane"), this.createPane("shadowPane"), this.createPane("markerPane"), this.createPane("tooltipPane"), this.createPane("popupPane"), this.options.markerZoomAnimation || (j(e.markerPane, "leaflet-zoom-hide"), j(e.shadowPane, "leaflet-zoom-hide"));
        },
        // private methods that modify map state
        // @section Map state change events
        _resetView: function(e, t, i) {
          _e(this._mapPane, new M(0, 0));
          var o = !this._loaded;
          this._loaded = !0, t = this._limitZoom(t), this.fire("viewprereset");
          var s = this._zoom !== t;
          this._moveStart(s, i)._move(e, t)._moveEnd(s), this.fire("viewreset"), o && this.fire("load");
        },
        _moveStart: function(e, t) {
          return e && this.fire("zoomstart"), t || this.fire("movestart"), this;
        },
        _move: function(e, t, i, o) {
          t === void 0 && (t = this._zoom);
          var s = this._zoom !== t;
          return this._zoom = t, this._lastCenter = e, this._pixelOrigin = this._getNewPixelOrigin(e), o ? i && i.pinch && this.fire("zoom", i) : ((s || i && i.pinch) && this.fire("zoom", i), this.fire("move", i)), this;
        },
        _moveEnd: function(e) {
          return e && this.fire("zoomend"), this.fire("moveend");
        },
        _stop: function() {
          return Pe(this._flyToFrame), this._panAnim && this._panAnim.stop(), this;
        },
        _rawPanBy: function(e) {
          _e(this._mapPane, this._getMapPanePos().subtract(e));
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
          var t = e ? pe : H;
          t(this._container, "click dblclick mousedown mouseup mouseover mouseout mousemove contextmenu keypress keydown keyup", this._handleDOMEvent, this), this.options.trackResize && t(window, "resize", this._onResize, this), I.any3d && this.options.transform3DLimit && (e ? this.off : this.on).call(this, "moveend", this._onMoveEnd);
        },
        _onResize: function() {
          Pe(this._resizeRequest), this._resizeRequest = Se(
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
          for (var i = [], o, s = t === "mouseout" || t === "mouseover", c = e.target || e.srcElement, d = !1; c; ) {
            if (o = this._targets[K(c)], o && (t === "click" || t === "preclick") && this._draggableMoved(o)) {
              d = !0;
              break;
            }
            if (o && o.listens(t, !0) && (s && !Ht(c, e) || (i.push(o), s)) || c === this._container)
              break;
            c = c.parentNode;
          }
          return !i.length && !d && !s && this.listens(t, !0) && (i = [this]), i;
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
            var i = e.type;
            i === "mousedown" && Ti(t), this._fireDOMEvent(e, i);
          }
        },
        _mouseEvents: ["click", "dblclick", "mouseover", "mouseout", "contextmenu"],
        _fireDOMEvent: function(e, t, i) {
          if (e.type === "click") {
            var o = Z({}, e);
            o.type = "preclick", this._fireDOMEvent(o, o.type, i);
          }
          var s = this._findEventTargets(e, t);
          if (i) {
            for (var c = [], d = 0; d < i.length; d++)
              i[d].listens(t, !0) && c.push(i[d]);
            s = c.concat(s);
          }
          if (s.length) {
            t === "contextmenu" && Ze(e);
            var p = s[0], f = {
              originalEvent: e
            };
            if (e.type !== "keypress" && e.type !== "keydown" && e.type !== "keyup") {
              var x = p.getLatLng && (!p._radius || p._radius <= 10);
              f.containerPoint = x ? this.latLngToContainerPoint(p.getLatLng()) : this.mouseEventToContainerPoint(e), f.layerPoint = this.containerPointToLayerPoint(f.containerPoint), f.latlng = x ? p.getLatLng() : this.layerPointToLatLng(f.layerPoint);
            }
            for (d = 0; d < s.length; d++)
              if (s[d].fire(t, f, !0), f.originalEvent._stopped || s[d].options.bubblingMouseEvents === !1 && qt(this._mouseEvents, t) !== -1)
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
          return pt(this._mapPane) || new M(0, 0);
        },
        _moved: function() {
          var e = this._getMapPanePos();
          return e && !e.equals([0, 0]);
        },
        _getTopLeftPoint: function(e, t) {
          var i = e && t !== void 0 ? this._getNewPixelOrigin(e, t) : this.getPixelOrigin();
          return i.subtract(this._getMapPanePos());
        },
        _getNewPixelOrigin: function(e, t) {
          var i = this.getSize()._divideBy(2);
          return this.project(e, t)._subtract(i)._add(this._getMapPanePos())._round();
        },
        _latLngToNewLayerPoint: function(e, t, i) {
          var o = this._getNewPixelOrigin(i, t);
          return this.project(e, t)._subtract(o);
        },
        _latLngBoundsToNewLayerBounds: function(e, t, i) {
          var o = this._getNewPixelOrigin(i, t);
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
        _limitCenter: function(e, t, i) {
          if (!i)
            return e;
          var o = this.project(e, t), s = this.getSize().divideBy(2), c = new m(o.subtract(s), o.add(s)), d = this._getBoundsOffset(c, i, t);
          return Math.abs(d.x) <= 1 && Math.abs(d.y) <= 1 ? e : this.unproject(o.add(d), t);
        },
        // adjust offset for view to get inside bounds
        _limitOffset: function(e, t) {
          if (!t)
            return e;
          var i = this.getPixelBounds(), o = new m(i.min.add(e), i.max.add(e));
          return e.add(this._getBoundsOffset(o, t));
        },
        // returns offset needed for pxBounds to get inside maxBounds at a specified zoom
        _getBoundsOffset: function(e, t, i) {
          var o = T(
            this.project(t.getNorthEast(), i),
            this.project(t.getSouthWest(), i)
          ), s = o.min.subtract(e.min), c = o.max.subtract(e.max), d = this._rebound(s.x, -c.x), p = this._rebound(s.y, -c.y);
          return new M(d, p);
        },
        _rebound: function(e, t) {
          return e + t > 0 ? Math.round(e - t) / 2 : Math.max(0, Math.ceil(e)) - Math.max(0, Math.floor(t));
        },
        _limitZoom: function(e) {
          var t = this.getMinZoom(), i = this.getMaxZoom(), o = I.any3d ? this.options.zoomSnap : 1;
          return o && (e = Math.round(e / o) * o), Math.max(t, Math.min(i, e));
        },
        _onPanTransitionStep: function() {
          this.fire("move");
        },
        _onPanTransitionEnd: function() {
          q(this._mapPane, "leaflet-pan-anim"), this.fire("moveend");
        },
        _tryAnimatedPan: function(e, t) {
          var i = this._getCenterOffset(e)._trunc();
          return (t && t.animate) !== !0 && !this.getSize().contains(i) ? !1 : (this.panBy(i, t), !0);
        },
        _createAnimProxy: function() {
          var e = this._proxy = se("div", "leaflet-proxy leaflet-zoom-animated");
          this._panes.mapPane.appendChild(e), this.on("zoomanim", function(t) {
            var i = Vt, o = this._proxy.style[i];
            qe(this._proxy, this.project(t.center, t.zoom), this.getZoomScale(t.zoom, 1)), o === this._proxy.style[i] && this._animatingZoom && this._onZoomTransitionEnd();
          }, this), this.on("load moveend", this._animMoveEnd, this), this._on("unload", this._destroyAnimProxy, this);
        },
        _destroyAnimProxy: function() {
          be(this._proxy), this.off("load moveend", this._animMoveEnd, this), delete this._proxy;
        },
        _animMoveEnd: function() {
          var e = this.getCenter(), t = this.getZoom();
          qe(this._proxy, this.project(e, t), this.getZoomScale(t, 1));
        },
        _catchTransitionEnd: function(e) {
          this._animatingZoom && e.propertyName.indexOf("transform") >= 0 && this._onZoomTransitionEnd();
        },
        _nothingToAnimate: function() {
          return !this._container.getElementsByClassName("leaflet-zoom-animated").length;
        },
        _tryAnimatedZoom: function(e, t, i) {
          if (this._animatingZoom)
            return !0;
          if (i = i || {}, !this._zoomAnimated || i.animate === !1 || this._nothingToAnimate() || Math.abs(t - this._zoom) > this.options.zoomAnimationThreshold)
            return !1;
          var o = this.getZoomScale(t), s = this._getCenterOffset(e)._divideBy(1 - 1 / o);
          return i.animate !== !0 && !this.getSize().contains(s) ? !1 : (Se(function() {
            this._moveStart(!0, i.noMoveStart || !1)._animateZoom(e, t, !0);
          }, this), !0);
        },
        _animateZoom: function(e, t, i, o) {
          this._mapPane && (i && (this._animatingZoom = !0, this._animateToCenter = e, this._animateToZoom = t, j(this._mapPane, "leaflet-zoom-anim")), this.fire("zoomanim", {
            center: e,
            zoom: t,
            noUpdate: o
          }), this._tempFireZoomEvent || (this._tempFireZoomEvent = this._zoom !== this._animateToZoom), this._move(this._animateToCenter, this._animateToZoom, void 0, !0), setTimeout(J(this._onZoomTransitionEnd, this), 250));
        },
        _onZoomTransitionEnd: function() {
          this._animatingZoom && (this._mapPane && q(this._mapPane, "leaflet-zoom-anim"), this._animatingZoom = !1, this._move(this._animateToCenter, this._animateToZoom, void 0, !0), this._tempFireZoomEvent && this.fire("zoom"), delete this._tempFireZoomEvent, this.fire("move"), this._moveEnd(!0));
        }
      });
      function Xn(e, t) {
        return new oe(e, t);
      }
      var Qe = je.extend({
        // @section
        // @aka Control Options
        options: {
          // @option position: String = 'topright'
          // The position of the control (one of the map corners). Possible values are `'topleft'`,
          // `'topright'`, `'bottomleft'` or `'bottomright'`
          position: "topright"
        },
        initialize: function(e) {
          he(this, e);
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
          var t = this._container = this.onAdd(e), i = this.getPosition(), o = e._controlCorners[i];
          return j(t, "leaflet-control"), i.indexOf("bottom") !== -1 ? o.insertBefore(t, o.firstChild) : o.appendChild(t), this._map.on("unload", this.remove, this), this;
        },
        // @method remove: this
        // Removes the control from the map it is currently active on.
        remove: function() {
          return this._map ? (be(this._container), this.onRemove && this.onRemove(this._map), this._map.off("unload", this.remove, this), this._map = null, this) : this;
        },
        _refocusOnMap: function(e) {
          this._map && e && e.screenX > 0 && e.screenY > 0 && this._map.getContainer().focus();
        }
      }), ri = function(e) {
        return new Qe(e);
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
          var e = this._controlCorners = {}, t = "leaflet-", i = this._controlContainer = se("div", t + "control-container", this._container);
          function o(s, c) {
            var d = t + s + " " + t + c;
            e[s + c] = se("div", d, i);
          }
          o("top", "left"), o("top", "right"), o("bottom", "left"), o("bottom", "right");
        },
        _clearControlPos: function() {
          for (var e in this._controlCorners)
            be(this._controlCorners[e]);
          be(this._controlContainer), delete this._controlCorners, delete this._controlContainer;
        }
      });
      var zi = Qe.extend({
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
          sortFunction: function(e, t, i, o) {
            return i < o ? -1 : o < i ? 1 : 0;
          }
        },
        initialize: function(e, t, i) {
          he(this, i), this._layerControlInputs = [], this._layers = [], this._lastZIndex = 0, this._handlingClick = !1, this._preventClick = !1;
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
          return Qe.prototype.addTo.call(this, e), this._expandIfNotCollapsed();
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
          j(this._container, "leaflet-control-layers-expanded"), this._section.style.height = null;
          var e = this._map.getSize().y - (this._container.offsetTop + 50);
          return e < this._section.clientHeight ? (j(this._section, "leaflet-control-layers-scrollbar"), this._section.style.height = e + "px") : q(this._section, "leaflet-control-layers-scrollbar"), this._checkDisabledLayers(), this;
        },
        // @method collapse(): this
        // Collapse the control container if expanded.
        collapse: function() {
          return q(this._container, "leaflet-control-layers-expanded"), this;
        },
        _initLayout: function() {
          var e = "leaflet-control-layers", t = this._container = se("div", e), i = this.options.collapsed;
          t.setAttribute("aria-haspopup", !0), bt(t), Ft(t);
          var o = this._section = se("section", e + "-list");
          i && (this._map.on("click", this.collapse, this), H(t, {
            mouseenter: this._expandSafely,
            mouseleave: this.collapse
          }, this));
          var s = this._layersLink = se("a", e + "-toggle", t);
          s.href = "#", s.title = "Layers", s.setAttribute("role", "button"), H(s, {
            keydown: function(c) {
              c.keyCode === 13 && this._expandSafely();
            },
            // Certain screen readers intercept the key event and instead send a click event
            click: function(c) {
              Ze(c), this._expandSafely();
            }
          }, this), i || this.expand(), this._baseLayersList = se("div", e + "-base", o), this._separator = se("div", e + "-separator", o), this._overlaysList = se("div", e + "-overlays", o), t.appendChild(o);
        },
        _getLayer: function(e) {
          for (var t = 0; t < this._layers.length; t++)
            if (this._layers[t] && K(this._layers[t].layer) === e)
              return this._layers[t];
        },
        _addLayer: function(e, t, i) {
          this._map && e.on("add remove", this._onLayerChange, this), this._layers.push({
            layer: e,
            name: t,
            overlay: i
          }), this.options.sortLayers && this._layers.sort(J(function(o, s) {
            return this.options.sortFunction(o.layer, s.layer, o.name, s.name);
          }, this)), this.options.autoZIndex && e.setZIndex && (this._lastZIndex++, e.setZIndex(this._lastZIndex)), this._expandIfNotCollapsed();
        },
        _update: function() {
          if (!this._container)
            return this;
          ai(this._baseLayersList), ai(this._overlaysList), this._layerControlInputs = [];
          var e, t, i, o, s = 0;
          for (i = 0; i < this._layers.length; i++)
            o = this._layers[i], this._addItem(o), t = t || o.overlay, e = e || !o.overlay, s += o.overlay ? 0 : 1;
          return this.options.hideSingleBase && (e = e && s > 1, this._baseLayersList.style.display = e ? "" : "none"), this._separator.style.display = t && e ? "" : "none", this;
        },
        _onLayerChange: function(e) {
          this._handlingClick || this._update();
          var t = this._getLayer(K(e.target)), i = t.overlay ? e.type === "add" ? "overlayadd" : "overlayremove" : e.type === "add" ? "baselayerchange" : null;
          i && this._map.fire(i, t);
        },
        // IE7 bugs out if you create a radio dynamically, so you have to do it this hacky way (see https://stackoverflow.com/a/119079)
        _createRadioElement: function(e, t) {
          var i = '<input type="radio" class="leaflet-control-layers-selector" name="' + e + '"' + (t ? ' checked="checked"' : "") + "/>", o = document.createElement("div");
          return o.innerHTML = i, o.firstChild;
        },
        _addItem: function(e) {
          var t = document.createElement("label"), i = this._map.hasLayer(e.layer), o;
          e.overlay ? (o = document.createElement("input"), o.type = "checkbox", o.className = "leaflet-control-layers-selector", o.defaultChecked = i) : o = this._createRadioElement("leaflet-base-layers_" + K(this), i), this._layerControlInputs.push(o), o.layerId = K(e.layer), H(o, "click", this._onInputClick, this);
          var s = document.createElement("span");
          s.innerHTML = " " + e.name;
          var c = document.createElement("span");
          t.appendChild(c), c.appendChild(o), c.appendChild(s);
          var d = e.overlay ? this._overlaysList : this._baseLayersList;
          return d.appendChild(t), this._checkDisabledLayers(), t;
        },
        _onInputClick: function() {
          if (!this._preventClick) {
            var e = this._layerControlInputs, t, i, o = [], s = [];
            this._handlingClick = !0;
            for (var c = e.length - 1; c >= 0; c--)
              t = e[c], i = this._getLayer(t.layerId).layer, t.checked ? o.push(i) : t.checked || s.push(i);
            for (c = 0; c < s.length; c++)
              this._map.hasLayer(s[c]) && this._map.removeLayer(s[c]);
            for (c = 0; c < o.length; c++)
              this._map.hasLayer(o[c]) || this._map.addLayer(o[c]);
            this._handlingClick = !1, this._refocusOnMap();
          }
        },
        _checkDisabledLayers: function() {
          for (var e = this._layerControlInputs, t, i, o = this._map.getZoom(), s = e.length - 1; s >= 0; s--)
            t = e[s], i = this._getLayer(t.layerId).layer, t.disabled = i.options.minZoom !== void 0 && o < i.options.minZoom || i.options.maxZoom !== void 0 && o > i.options.maxZoom;
        },
        _expandIfNotCollapsed: function() {
          return this._map && !this.options.collapsed && this.expand(), this;
        },
        _expandSafely: function() {
          var e = this._section;
          this._preventClick = !0, H(e, "click", Ze), this.expand();
          var t = this;
          setTimeout(function() {
            pe(e, "click", Ze), t._preventClick = !1;
          });
        }
      }), en = function(e, t, i) {
        return new zi(e, t, i);
      }, Ei = Qe.extend({
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
          var t = "leaflet-control-zoom", i = se("div", t + " leaflet-bar"), o = this.options;
          return this._zoomInButton = this._createButton(
            o.zoomInText,
            o.zoomInTitle,
            t + "-in",
            i,
            this._zoomIn
          ), this._zoomOutButton = this._createButton(
            o.zoomOutText,
            o.zoomOutTitle,
            t + "-out",
            i,
            this._zoomOut
          ), this._updateDisabled(), e.on("zoomend zoomlevelschange", this._updateDisabled, this), i;
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
        _createButton: function(e, t, i, o, s) {
          var c = se("a", i, o);
          return c.innerHTML = e, c.href = "#", c.title = t, c.setAttribute("role", "button"), c.setAttribute("aria-label", t), bt(c), H(c, "click", ie), H(c, "click", s, this), H(c, "click", this._refocusOnMap, this), c;
        },
        _updateDisabled: function() {
          var e = this._map, t = "leaflet-disabled";
          q(this._zoomInButton, t), q(this._zoomOutButton, t), this._zoomInButton.setAttribute("aria-disabled", "false"), this._zoomOutButton.setAttribute("aria-disabled", "false"), (this._disabled || e._zoom === e.getMinZoom()) && (j(this._zoomOutButton, t), this._zoomOutButton.setAttribute("aria-disabled", "true")), (this._disabled || e._zoom === e.getMaxZoom()) && (j(this._zoomInButton, t), this._zoomInButton.setAttribute("aria-disabled", "true"));
        }
      });
      oe.mergeOptions({
        zoomControl: !0
      }), oe.addInitHook(function() {
        this.options.zoomControl && (this.zoomControl = new Ei(), this.addControl(this.zoomControl));
      });
      var zn = function(e) {
        return new Ei(e);
      }, h = Qe.extend({
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
          var t = "leaflet-control-scale", i = se("div", t), o = this.options;
          return this._addScales(o, t + "-line", i), e.on(o.updateWhenIdle ? "moveend" : "move", this._update, this), e.whenReady(this._update, this), i;
        },
        onRemove: function(e) {
          e.off(this.options.updateWhenIdle ? "moveend" : "move", this._update, this);
        },
        _addScales: function(e, t, i) {
          e.metric && (this._mScale = se("div", t, i)), e.imperial && (this._iScale = se("div", t, i));
        },
        _update: function() {
          var e = this._map, t = e.getSize().y / 2, i = e.distance(
            e.containerPointToLatLng([0, t]),
            e.containerPointToLatLng([this.options.maxWidth, t])
          );
          this._updateScales(i);
        },
        _updateScales: function(e) {
          this.options.metric && e && this._updateMetric(e), this.options.imperial && e && this._updateImperial(e);
        },
        _updateMetric: function(e) {
          var t = this._getRoundNum(e), i = t < 1e3 ? t + " m" : t / 1e3 + " km";
          this._updateScale(this._mScale, i, t / e);
        },
        _updateImperial: function(e) {
          var t = e * 3.2808399, i, o, s;
          t > 5280 ? (i = t / 5280, o = this._getRoundNum(i), this._updateScale(this._iScale, o + " mi", o / i)) : (s = this._getRoundNum(t), this._updateScale(this._iScale, s + " ft", s / t));
        },
        _updateScale: function(e, t, i) {
          e.style.width = Math.round(this.options.maxWidth * i) + "px", e.innerHTML = t;
        },
        _getRoundNum: function(e) {
          var t = Math.pow(10, (Math.floor(e) + "").length - 1), i = e / t;
          return i = i >= 10 ? 10 : i >= 5 ? 5 : i >= 3 ? 3 : i >= 2 ? 2 : 1, t * i;
        }
      }), u = function(e) {
        return new h(e);
      }, l = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" class="leaflet-attribution-flag"><path fill="#4C7BE1" d="M0 0h12v4H0z"/><path fill="#FFD500" d="M0 4h12v3H0z"/><path fill="#E0BC00" d="M0 7h12v1H0z"/></svg>', O = Qe.extend({
        // @section
        // @aka Control.Attribution options
        options: {
          position: "bottomright",
          // @option prefix: String|false = 'Leaflet'
          // The HTML text shown before the attributions. Pass `false` to disable.
          prefix: '<a href="https://leafletjs.com" title="A JavaScript library for interactive maps">' + (I.inlineSvg ? l + " " : "") + "Leaflet</a>"
        },
        initialize: function(e) {
          he(this, e), this._attributions = {};
        },
        onAdd: function(e) {
          e.attributionControl = this, this._container = se("div", "leaflet-control-attribution"), bt(this._container);
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
            var i = [];
            this.options.prefix && i.push(this.options.prefix), e.length && i.push(e.join(", ")), this._container.innerHTML = i.join(' <span aria-hidden="true">|</span> ');
          }
        }
      });
      oe.mergeOptions({
        attributionControl: !0
      }), oe.addInitHook(function() {
        this.options.attributionControl && new O().addTo(this);
      });
      var z = function(e) {
        return new O(e);
      };
      Qe.Layers = zi, Qe.Zoom = Ei, Qe.Scale = h, Qe.Attribution = O, ri.layers = en, ri.zoom = zn, ri.scale = u, ri.attribution = z;
      var W = je.extend({
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
      W.addTo = function(e, t) {
        return e.addHandler(t, this), this;
      };
      var ue = { Events: Ue }, ke = I.touch ? "touchstart mousedown" : "mousedown", ft = xt.extend({
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
        initialize: function(e, t, i, o) {
          he(this, o), this._element = e, this._dragStartTarget = t || e, this._preventOutline = i;
        },
        // @method enable()
        // Enables the dragging ability
        enable: function() {
          this._enabled || (H(this._dragStartTarget, ke, this._onDown, this), this._enabled = !0);
        },
        // @method disable()
        // Disables the dragging ability
        disable: function() {
          this._enabled && (ft._dragging === this && this.finishDrag(!0), pe(this._dragStartTarget, ke, this._onDown, this), this._enabled = !1, this._moved = !1);
        },
        _onDown: function(e) {
          if (this._enabled && (this._moved = !1, !$t(this._element, "leaflet-zoom-anim"))) {
            if (e.touches && e.touches.length !== 1) {
              ft._dragging === this && this.finishDrag();
              return;
            }
            if (!(ft._dragging || e.shiftKey || e.which !== 1 && e.button !== 1 && !e.touches) && (ft._dragging = this, this._preventOutline && Ti(this._element), Ne(), Ke(), !this._moving)) {
              this.fire("down");
              var t = e.touches ? e.touches[0] : e, i = Ci(this._element);
              this._startPoint = new M(t.clientX, t.clientY), this._startPos = pt(this._element), this._parentScale = Ki(i);
              var o = e.type === "mousedown";
              H(document, o ? "mousemove" : "touchmove", this._onMove, this), H(document, o ? "mouseup" : "touchend touchcancel", this._onUp, this);
            }
          }
        },
        _onMove: function(e) {
          if (this._enabled) {
            if (e.touches && e.touches.length > 1) {
              this._moved = !0;
              return;
            }
            var t = e.touches && e.touches.length === 1 ? e.touches[0] : e, i = new M(t.clientX, t.clientY)._subtract(this._startPoint);
            !i.x && !i.y || Math.abs(i.x) + Math.abs(i.y) < this.options.clickTolerance || (i.x /= this._parentScale.x, i.y /= this._parentScale.y, Ze(e), this._moved || (this.fire("dragstart"), this._moved = !0, j(document.body, "leaflet-dragging"), this._lastTarget = e.target || e.srcElement, window.SVGElementInstance && this._lastTarget instanceof window.SVGElementInstance && (this._lastTarget = this._lastTarget.correspondingUseElement), j(this._lastTarget, "leaflet-drag-target")), this._newPos = this._startPos.add(i), this._moving = !0, this._lastEvent = e, this._updatePosition());
          }
        },
        _updatePosition: function() {
          var e = { originalEvent: this._lastEvent };
          this.fire("predrag", e), _e(this._element, this._newPos), this.fire("drag", e);
        },
        _onUp: function() {
          this._enabled && this.finishDrag();
        },
        finishDrag: function(e) {
          q(document.body, "leaflet-dragging"), this._lastTarget && (q(this._lastTarget, "leaflet-drag-target"), this._lastTarget = null), pe(document, "mousemove touchmove", this._onMove, this), pe(document, "mouseup touchend touchcancel", this._onUp, this), Ye(), si();
          var t = this._moved && this._moving;
          this._moving = !1, ft._dragging = !1, t && this.fire("dragend", {
            noInertia: e,
            distance: this._newPos.distanceTo(this._startPos)
          });
        }
      });
      function tn(e, t, i) {
        var o, s = [1, 4, 2, 8], c, d, p, f, x, S, U, ne;
        for (c = 0, S = e.length; c < S; c++)
          e[c]._code = li(e[c], t);
        for (p = 0; p < 4; p++) {
          for (U = s[p], o = [], c = 0, S = e.length, d = S - 1; c < S; d = c++)
            f = e[c], x = e[d], f._code & U ? x._code & U || (ne = En(x, f, U, t, i), ne._code = li(ne, t), o.push(ne)) : (x._code & U && (ne = En(x, f, U, t, i), ne._code = li(ne, t), o.push(ne)), o.push(f));
          e = o;
        }
        return e;
      }
      function nn(e, t) {
        var i, o, s, c, d, p, f, x, S;
        if (!e || e.length === 0)
          throw new Error("latlngs not passed");
        rt(e) || (console.warn("latlngs are not flat! Only the first ring will be used"), e = e[0]);
        var U = $([0, 0]), ne = ee(e), Ge = ne.getNorthWest().distanceTo(ne.getSouthWest()) * ne.getNorthEast().distanceTo(ne.getNorthWest());
        Ge < 1700 && (U = k(e));
        var Re = e.length, lt = [];
        for (i = 0; i < Re; i++) {
          var Je = $(e[i]);
          lt.push(t.project($([Je.lat - U.lat, Je.lng - U.lng])));
        }
        for (p = f = x = 0, i = 0, o = Re - 1; i < Re; o = i++)
          s = lt[i], c = lt[o], d = s.y * c.x - c.y * s.x, f += (s.x + c.x) * d, x += (s.y + c.y) * d, p += d * 3;
        p === 0 ? S = lt[0] : S = [f / p, x / p];
        var Ni = t.unproject(V(S));
        return $([Ni.lat + U.lat, Ni.lng + U.lng]);
      }
      function k(e) {
        for (var t = 0, i = 0, o = 0, s = 0; s < e.length; s++) {
          var c = $(e[s]);
          t += c.lat, i += c.lng, o++;
        }
        return $([t / o, i / o]);
      }
      var ce = {
        __proto__: null,
        clipPolygon: tn,
        polygonCenter: nn,
        centroid: k
      };
      function ve(e, t) {
        if (!t || !e.length)
          return e.slice();
        var i = t * t;
        return e = jo(e, i), e = Ee(e, i), e;
      }
      function Me(e, t, i) {
        return Math.sqrt(on(e, t, i, !0));
      }
      function ze(e, t, i) {
        return on(e, t, i);
      }
      function Ee(e, t) {
        var i = e.length, o = typeof Uint8Array < "u" ? Uint8Array : Array, s = new o(i);
        s[0] = s[i - 1] = 1, Qn(e, s, t, 0, i - 1);
        var c, d = [];
        for (c = 0; c < i; c++)
          s[c] && d.push(e[c]);
        return d;
      }
      function Qn(e, t, i, o, s) {
        var c = 0, d, p, f;
        for (p = o + 1; p <= s - 1; p++)
          f = on(e[p], e[o], e[s], !0), f > c && (d = p, c = f);
        c > i && (t[d] = 1, Qn(e, t, i, o, d), Qn(e, t, i, d, s));
      }
      function jo(e, t) {
        for (var i = [e[0]], o = 1, s = 0, c = e.length; o < c; o++)
          qo(e[o], e[s]) > t && (i.push(e[o]), s = o);
        return s < c - 1 && i.push(e[c - 1]), i;
      }
      var ro;
      function lo(e, t, i, o, s) {
        var c = o ? ro : li(e, i), d = li(t, i), p, f, x;
        for (ro = d; ; ) {
          if (!(c | d))
            return [e, t];
          if (c & d)
            return !1;
          p = c || d, f = En(e, t, p, i, s), x = li(f, i), p === c ? (e = f, c = x) : (t = f, d = x);
        }
      }
      function En(e, t, i, o, s) {
        var c = t.x - e.x, d = t.y - e.y, p = o.min, f = o.max, x, S;
        return i & 8 ? (x = e.x + c * (f.y - e.y) / d, S = f.y) : i & 4 ? (x = e.x + c * (p.y - e.y) / d, S = p.y) : i & 2 ? (x = f.x, S = e.y + d * (f.x - e.x) / c) : i & 1 && (x = p.x, S = e.y + d * (p.x - e.x) / c), new M(x, S, s);
      }
      function li(e, t) {
        var i = 0;
        return e.x < t.min.x ? i |= 1 : e.x > t.max.x && (i |= 2), e.y < t.min.y ? i |= 4 : e.y > t.max.y && (i |= 8), i;
      }
      function qo(e, t) {
        var i = t.x - e.x, o = t.y - e.y;
        return i * i + o * o;
      }
      function on(e, t, i, o) {
        var s = t.x, c = t.y, d = i.x - s, p = i.y - c, f = d * d + p * p, x;
        return f > 0 && (x = ((e.x - s) * d + (e.y - c) * p) / f, x > 1 ? (s = i.x, c = i.y) : x > 0 && (s += d * x, c += p * x)), d = e.x - s, p = e.y - c, o ? d * d + p * p : new M(s, c);
      }
      function rt(e) {
        return !He(e[0]) || typeof e[0][0] != "object" && typeof e[0][0] < "u";
      }
      function uo(e) {
        return console.warn("Deprecated use of _flat, please use L.LineUtil.isFlat instead."), rt(e);
      }
      function co(e, t) {
        var i, o, s, c, d, p, f, x;
        if (!e || e.length === 0)
          throw new Error("latlngs not passed");
        rt(e) || (console.warn("latlngs are not flat! Only the first ring will be used"), e = e[0]);
        var S = $([0, 0]), U = ee(e), ne = U.getNorthWest().distanceTo(U.getSouthWest()) * U.getNorthEast().distanceTo(U.getNorthWest());
        ne < 1700 && (S = k(e));
        var Ge = e.length, Re = [];
        for (i = 0; i < Ge; i++) {
          var lt = $(e[i]);
          Re.push(t.project($([lt.lat - S.lat, lt.lng - S.lng])));
        }
        for (i = 0, o = 0; i < Ge - 1; i++)
          o += Re[i].distanceTo(Re[i + 1]) / 2;
        if (o === 0)
          x = Re[0];
        else
          for (i = 0, c = 0; i < Ge - 1; i++)
            if (d = Re[i], p = Re[i + 1], s = d.distanceTo(p), c += s, c > o) {
              f = (c - o) / s, x = [
                p.x - f * (p.x - d.x),
                p.y - f * (p.y - d.y)
              ];
              break;
            }
        var Je = t.unproject(V(x));
        return $([Je.lat + S.lat, Je.lng + S.lng]);
      }
      var Ko = {
        __proto__: null,
        simplify: ve,
        pointToSegmentDistance: Me,
        closestPointOnSegment: ze,
        clipSegment: lo,
        _getEdgeIntersection: En,
        _getBitCode: li,
        _sqClosestPointOnSegment: on,
        isFlat: rt,
        _flat: uo,
        polylineCenter: co
      }, eo = {
        project: function(e) {
          return new M(e.lng, e.lat);
        },
        unproject: function(e) {
          return new X(e.y, e.x);
        },
        bounds: new m([-180, -90], [180, 90])
      }, to = {
        R: 6378137,
        R_MINOR: 6356752314245179e-9,
        bounds: new m([-2003750834279e-5, -1549657073972e-5], [2003750834279e-5, 1876465623138e-5]),
        project: function(e) {
          var t = Math.PI / 180, i = this.R, o = e.lat * t, s = this.R_MINOR / i, c = Math.sqrt(1 - s * s), d = c * Math.sin(o), p = Math.tan(Math.PI / 4 - o / 2) / Math.pow((1 - d) / (1 + d), c / 2);
          return o = -i * Math.log(Math.max(p, 1e-10)), new M(e.lng * t * i, o);
        },
        unproject: function(e) {
          for (var t = 180 / Math.PI, i = this.R, o = this.R_MINOR / i, s = Math.sqrt(1 - o * o), c = Math.exp(-e.y / i), d = Math.PI / 2 - 2 * Math.atan(c), p = 0, f = 0.1, x; p < 15 && Math.abs(f) > 1e-7; p++)
            x = s * Math.sin(d), x = Math.pow((1 - x) / (1 + x), s / 2), f = Math.PI / 2 - 2 * Math.atan(c * x) - d, d += f;
          return new X(d * t, e.x * t / i);
        }
      }, Yo = {
        __proto__: null,
        LonLat: eo,
        Mercator: to,
        SphericalMercator: Ri
      }, Jo = Z({}, Be, {
        code: "EPSG:3395",
        projection: to,
        transformation: (function() {
          var e = 0.5 / (Math.PI * to.R);
          return Zt(e, 0.5, -e, 0.5);
        })()
      }), ho = Z({}, Be, {
        code: "EPSG:4326",
        projection: eo,
        transformation: Zt(1 / 180, 1, -1 / 180, 0.5)
      }), Xo = Z({}, ge, {
        projection: eo,
        transformation: Zt(1, 0, -1, 0),
        scale: function(e) {
          return Math.pow(2, e);
        },
        zoom: function(e) {
          return Math.log(e) / Math.LN2;
        },
        distance: function(e, t) {
          var i = t.lng - e.lng, o = t.lat - e.lat;
          return Math.sqrt(i * i + o * o);
        },
        infinite: !0
      });
      ge.Earth = Be, ge.EPSG3395 = Jo, ge.EPSG3857 = hi, ge.EPSG900913 = dn, ge.EPSG4326 = ho, ge.Simple = Xo;
      var mt = xt.extend({
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
              var i = this.getEvents();
              t.on(i, this), this.once("remove", function() {
                t.off(i, this);
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
          for (var i in this._layers)
            e.call(t, this._layers[i]);
          return this;
        },
        _addLayers: function(e) {
          e = e ? He(e) ? e : [e] : [];
          for (var t = 0, i = e.length; t < i; t++)
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
          var e = 1 / 0, t = -1 / 0, i = this._getZoomSpan();
          for (var o in this._zoomBoundLayers) {
            var s = this._zoomBoundLayers[o].options;
            e = s.minZoom === void 0 ? e : Math.min(e, s.minZoom), t = s.maxZoom === void 0 ? t : Math.max(t, s.maxZoom);
          }
          this._layersMaxZoom = t === -1 / 0 ? void 0 : t, this._layersMinZoom = e === 1 / 0 ? void 0 : e, i !== this._getZoomSpan() && this.fire("zoomlevelschange"), this.options.maxZoom === void 0 && this._layersMaxZoom && this.getZoom() > this._layersMaxZoom && this.setZoom(this._layersMaxZoom), this.options.minZoom === void 0 && this._layersMinZoom && this.getZoom() < this._layersMinZoom && this.setZoom(this._layersMinZoom);
        }
      });
      var Oi = mt.extend({
        initialize: function(e, t) {
          he(this, t), this._layers = {};
          var i, o;
          if (e)
            for (i = 0, o = e.length; i < o; i++)
              this.addLayer(e[i]);
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
          var t = Array.prototype.slice.call(arguments, 1), i, o;
          for (i in this._layers)
            o = this._layers[i], o[e] && o[e].apply(o, t);
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
          for (var i in this._layers)
            e.call(t, this._layers[i]);
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
        return new Oi(e, t);
      }, St = Oi.extend({
        addLayer: function(e) {
          return this.hasLayer(e) ? this : (e.addEventParent(this), Oi.prototype.addLayer.call(this, e), this.fire("layeradd", { layer: e }));
        },
        removeLayer: function(e) {
          return this.hasLayer(e) ? (e in this._layers && (e = this._layers[e]), e.removeEventParent(this), Oi.prototype.removeLayer.call(this, e), this.fire("layerremove", { layer: e })) : this;
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
          var e = new y();
          for (var t in this._layers) {
            var i = this._layers[t];
            e.extend(i.getBounds ? i.getBounds() : i.getLatLng());
          }
          return e;
        }
      }), ea = function(e, t) {
        return new St(e, t);
      }, Ai = je.extend({
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
          he(this, e);
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
          var i = this._getIconUrl(e);
          if (!i) {
            if (e === "icon")
              throw new Error("iconUrl not set in Icon options (see the docs).");
            return null;
          }
          var o = this._createImg(i, t && t.tagName === "IMG" ? t : null);
          return this._setIconStyles(o, e), (this.options.crossOrigin || this.options.crossOrigin === "") && (o.crossOrigin = this.options.crossOrigin === !0 ? "" : this.options.crossOrigin), o;
        },
        _setIconStyles: function(e, t) {
          var i = this.options, o = i[t + "Size"];
          typeof o == "number" && (o = [o, o]);
          var s = V(o), c = V(t === "shadow" && i.shadowAnchor || i.iconAnchor || s && s.divideBy(2, !0));
          e.className = "leaflet-marker-" + t + " " + (i.className || ""), c && (e.style.marginLeft = -c.x + "px", e.style.marginTop = -c.y + "px"), s && (e.style.width = s.x + "px", e.style.height = s.y + "px");
        },
        _createImg: function(e, t) {
          return t = t || document.createElement("img"), t.src = e, t;
        },
        _getIconUrl: function(e) {
          return I.retina && this.options[e + "RetinaUrl"] || this.options[e + "Url"];
        }
      });
      function ta(e) {
        return new Ai(e);
      }
      var an = Ai.extend({
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
          return typeof an.imagePath != "string" && (an.imagePath = this._detectIconPath()), (this.options.imagePath || an.imagePath) + Ai.prototype._getIconUrl.call(this, e);
        },
        _stripUrl: function(e) {
          var t = function(i, o, s) {
            var c = o.exec(i);
            return c && c[s];
          };
          return e = t(e, /^url\((['"])?(.+)\1\)$/, 2), e && t(e, /^(.*)marker-icon\.png$/, 1);
        },
        _detectIconPath: function() {
          var e = se("div", "leaflet-default-icon-path", document.body), t = oi(e, "background-image") || oi(e, "backgroundImage");
          if (document.body.removeChild(e), t = this._stripUrl(t), t)
            return t;
          var i = document.querySelector('link[href$="leaflet.css"]');
          return i ? i.href.substring(0, i.href.length - 11 - 1) : "";
        }
      }), po = W.extend({
        initialize: function(e) {
          this._marker = e;
        },
        addHooks: function() {
          var e = this._marker._icon;
          this._draggable || (this._draggable = new ft(e, e, !0)), this._draggable.on({
            dragstart: this._onDragStart,
            predrag: this._onPreDrag,
            drag: this._onDrag,
            dragend: this._onDragEnd
          }, this).enable(), j(e, "leaflet-marker-draggable");
        },
        removeHooks: function() {
          this._draggable.off({
            dragstart: this._onDragStart,
            predrag: this._onPreDrag,
            drag: this._onDrag,
            dragend: this._onDragEnd
          }, this).disable(), this._marker._icon && q(this._marker._icon, "leaflet-marker-draggable");
        },
        moved: function() {
          return this._draggable && this._draggable._moved;
        },
        _adjustPan: function(e) {
          var t = this._marker, i = t._map, o = this._marker.options.autoPanSpeed, s = this._marker.options.autoPanPadding, c = pt(t._icon), d = i.getPixelBounds(), p = i.getPixelOrigin(), f = T(
            d.min._subtract(p).add(s),
            d.max._subtract(p).subtract(s)
          );
          if (!f.contains(c)) {
            var x = V(
              (Math.max(f.max.x, c.x) - f.max.x) / (d.max.x - f.max.x) - (Math.min(f.min.x, c.x) - f.min.x) / (d.min.x - f.min.x),
              (Math.max(f.max.y, c.y) - f.max.y) / (d.max.y - f.max.y) - (Math.min(f.min.y, c.y) - f.min.y) / (d.min.y - f.min.y)
            ).multiplyBy(o);
            i.panBy(x, { animate: !1 }), this._draggable._newPos._add(x), this._draggable._startPos._add(x), _e(t._icon, this._draggable._newPos), this._onDrag(e), this._panRequest = Se(this._adjustPan.bind(this, e));
          }
        },
        _onDragStart: function() {
          this._oldLatLng = this._marker.getLatLng(), this._marker.closePopup && this._marker.closePopup(), this._marker.fire("movestart").fire("dragstart");
        },
        _onPreDrag: function(e) {
          this._marker.options.autoPan && (Pe(this._panRequest), this._panRequest = Se(this._adjustPan.bind(this, e)));
        },
        _onDrag: function(e) {
          var t = this._marker, i = t._shadow, o = pt(t._icon), s = t._map.layerPointToLatLng(o);
          i && _e(i, o), t._latlng = s, e.latlng = s, e.oldLatLng = this._oldLatLng, t.fire("move", e).fire("drag", e);
        },
        _onDragEnd: function(e) {
          Pe(this._panRequest), delete this._oldLatLng, this._marker.fire("moveend").fire("dragend", e);
        }
      }), On = mt.extend({
        // @section
        // @aka Marker options
        options: {
          // @option icon: Icon = *
          // Icon instance to use for rendering the marker.
          // See [Icon documentation](#L.Icon) for details on how to customize the marker icon.
          // If not specified, a common instance of `L.Icon.Default` is used.
          icon: new an(),
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
          he(this, t), this._latlng = $(e);
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
          return this._latlng = $(e), this.update(), this.fire("move", { oldLatLng: t, latlng: this._latlng });
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
          var e = this.options, t = "leaflet-zoom-" + (this._zoomAnimated ? "animated" : "hide"), i = e.icon.createIcon(this._icon), o = !1;
          i !== this._icon && (this._icon && this._removeIcon(), o = !0, e.title && (i.title = e.title), i.tagName === "IMG" && (i.alt = e.alt || "")), j(i, t), e.keyboard && (i.tabIndex = "0", i.setAttribute("role", "button")), this._icon = i, e.riseOnHover && this.on({
            mouseover: this._bringToFront,
            mouseout: this._resetZIndex
          }), this.options.autoPanOnFocus && H(i, "focus", this._panOnFocus, this);
          var s = e.icon.createShadow(this._shadow), c = !1;
          s !== this._shadow && (this._removeShadow(), c = !0), s && (j(s, t), s.alt = ""), this._shadow = s, e.opacity < 1 && this._updateOpacity(), o && this.getPane().appendChild(this._icon), this._initInteraction(), s && c && this.getPane(e.shadowPane).appendChild(this._shadow);
        },
        _removeIcon: function() {
          this.options.riseOnHover && this.off({
            mouseover: this._bringToFront,
            mouseout: this._resetZIndex
          }), this.options.autoPanOnFocus && pe(this._icon, "focus", this._panOnFocus, this), be(this._icon), this.removeInteractiveTarget(this._icon), this._icon = null;
        },
        _removeShadow: function() {
          this._shadow && be(this._shadow), this._shadow = null;
        },
        _setPos: function(e) {
          this._icon && _e(this._icon, e), this._shadow && _e(this._shadow, e), this._zIndex = e.y + this.options.zIndexOffset, this._resetZIndex();
        },
        _updateZIndex: function(e) {
          this._icon && (this._icon.style.zIndex = this._zIndex + e);
        },
        _animateZoom: function(e) {
          var t = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center).round();
          this._setPos(t);
        },
        _initInteraction: function() {
          if (this.options.interactive && (j(this._icon, "leaflet-interactive"), this.addInteractiveTarget(this._icon), po)) {
            var e = this.options.draggable;
            this.dragging && (e = this.dragging.enabled(), this.dragging.disable()), this.dragging = new po(this), e && this.dragging.enable();
          }
        },
        // @method setOpacity(opacity: Number): this
        // Changes the opacity of the marker.
        setOpacity: function(e) {
          return this.options.opacity = e, this._map && this._updateOpacity(), this;
        },
        _updateOpacity: function() {
          var e = this.options.opacity;
          this._icon && We(this._icon, e), this._shadow && We(this._shadow, e);
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
            var t = this.options.icon.options, i = t.iconSize ? V(t.iconSize) : V(0, 0), o = t.iconAnchor ? V(t.iconAnchor) : V(0, 0);
            e.panInside(this._latlng, {
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
      function ia(e, t) {
        return new On(e, t);
      }
      var Wt = mt.extend({
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
          return he(this, e), this._renderer && (this._renderer._updateStyle(this), this.options.stroke && e && Object.prototype.hasOwnProperty.call(e, "weight") && this._updateBounds()), this;
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
      }), An = Wt.extend({
        // @section
        // @aka CircleMarker options
        options: {
          fill: !0,
          // @option radius: Number = 10
          // Radius of the circle marker, in pixels
          radius: 10
        },
        initialize: function(e, t) {
          he(this, t), this._latlng = $(e), this._radius = this.options.radius;
        },
        // @method setLatLng(latLng: LatLng): this
        // Sets the position of a circle marker to a new location.
        setLatLng: function(e) {
          var t = this._latlng;
          return this._latlng = $(e), this.redraw(), this.fire("move", { oldLatLng: t, latlng: this._latlng });
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
          return Wt.prototype.setStyle.call(this, e), this.setRadius(t), this;
        },
        _project: function() {
          this._point = this._map.latLngToLayerPoint(this._latlng), this._updateBounds();
        },
        _updateBounds: function() {
          var e = this._radius, t = this._radiusY || e, i = this._clickTolerance(), o = [e + i, t + i];
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
      function na(e, t) {
        return new An(e, t);
      }
      var io = An.extend({
        initialize: function(e, t, i) {
          if (typeof t == "number" && (t = Z({}, i, { radius: t })), he(this, t), this._latlng = $(e), isNaN(this.options.radius))
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
          return new y(
            this._map.layerPointToLatLng(this._point.subtract(e)),
            this._map.layerPointToLatLng(this._point.add(e))
          );
        },
        setStyle: Wt.prototype.setStyle,
        _project: function() {
          var e = this._latlng.lng, t = this._latlng.lat, i = this._map, o = i.options.crs;
          if (o.distance === Be.distance) {
            var s = Math.PI / 180, c = this._mRadius / Be.R / s, d = i.project([t + c, e]), p = i.project([t - c, e]), f = d.add(p).divideBy(2), x = i.unproject(f).lat, S = Math.acos((Math.cos(c * s) - Math.sin(t * s) * Math.sin(x * s)) / (Math.cos(t * s) * Math.cos(x * s))) / s;
            (isNaN(S) || S === 0) && (S = c / Math.cos(Math.PI / 180 * t)), this._point = f.subtract(i.getPixelOrigin()), this._radius = isNaN(S) ? 0 : f.x - i.project([x, e - S]).x, this._radiusY = f.y - d.y;
          } else {
            var U = o.unproject(o.project(this._latlng).subtract([this._mRadius, 0]));
            this._point = i.latLngToLayerPoint(this._latlng), this._radius = this._point.x - i.latLngToLayerPoint(U).x;
          }
          this._updateBounds();
        }
      });
      function oa(e, t, i) {
        return new io(e, t, i);
      }
      var Ct = Wt.extend({
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
          he(this, t), this._setLatLngs(e);
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
          for (var t = 1 / 0, i = null, o = on, s, c, d = 0, p = this._parts.length; d < p; d++)
            for (var f = this._parts[d], x = 1, S = f.length; x < S; x++) {
              s = f[x - 1], c = f[x];
              var U = o(e, s, c, !0);
              U < t && (t = U, i = o(e, s, c));
            }
          return i && (i.distance = Math.sqrt(t)), i;
        },
        // @method getCenter(): LatLng
        // Returns the center ([centroid](https://en.wikipedia.org/wiki/Centroid)) of the polyline.
        getCenter: function() {
          if (!this._map)
            throw new Error("Must add layer to map before using getCenter()");
          return co(this._defaultShape(), this._map.options.crs);
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
          return t = t || this._defaultShape(), e = $(e), t.push(e), this._bounds.extend(e), this.redraw();
        },
        _setLatLngs: function(e) {
          this._bounds = new y(), this._latlngs = this._convertLatLngs(e);
        },
        _defaultShape: function() {
          return rt(this._latlngs) ? this._latlngs : this._latlngs[0];
        },
        // recursively convert latlngs input into actual LatLng instances; calculate bounds along the way
        _convertLatLngs: function(e) {
          for (var t = [], i = rt(e), o = 0, s = e.length; o < s; o++)
            i ? (t[o] = $(e[o]), this._bounds.extend(t[o])) : t[o] = this._convertLatLngs(e[o]);
          return t;
        },
        _project: function() {
          var e = new m();
          this._rings = [], this._projectLatlngs(this._latlngs, this._rings, e), this._bounds.isValid() && e.isValid() && (this._rawPxBounds = e, this._updateBounds());
        },
        _updateBounds: function() {
          var e = this._clickTolerance(), t = new M(e, e);
          this._rawPxBounds && (this._pxBounds = new m([
            this._rawPxBounds.min.subtract(t),
            this._rawPxBounds.max.add(t)
          ]));
        },
        // recursively turns latlngs into a set of rings with projected coordinates
        _projectLatlngs: function(e, t, i) {
          var o = e[0] instanceof X, s = e.length, c, d;
          if (o) {
            for (d = [], c = 0; c < s; c++)
              d[c] = this._map.latLngToLayerPoint(e[c]), i.extend(d[c]);
            t.push(d);
          } else
            for (c = 0; c < s; c++)
              this._projectLatlngs(e[c], t, i);
        },
        // clip polyline by renderer bounds so that we have less to render for performance
        _clipPoints: function() {
          var e = this._renderer._bounds;
          if (this._parts = [], !(!this._pxBounds || !this._pxBounds.intersects(e))) {
            if (this.options.noClip) {
              this._parts = this._rings;
              return;
            }
            var t = this._parts, i, o, s, c, d, p, f;
            for (i = 0, s = 0, c = this._rings.length; i < c; i++)
              for (f = this._rings[i], o = 0, d = f.length; o < d - 1; o++)
                p = lo(f[o], f[o + 1], e, o, !0), p && (t[s] = t[s] || [], t[s].push(p[0]), (p[1] !== f[o + 1] || o === d - 2) && (t[s].push(p[1]), s++));
          }
        },
        // simplify each clipped part of the polyline for performance
        _simplifyPoints: function() {
          for (var e = this._parts, t = this.options.smoothFactor, i = 0, o = e.length; i < o; i++)
            e[i] = ve(e[i], t);
        },
        _update: function() {
          this._map && (this._clipPoints(), this._simplifyPoints(), this._updatePath());
        },
        _updatePath: function() {
          this._renderer._updatePoly(this);
        },
        // Needed by the `Canvas` renderer for interactivity
        _containsPoint: function(e, t) {
          var i, o, s, c, d, p, f = this._clickTolerance();
          if (!this._pxBounds || !this._pxBounds.contains(e))
            return !1;
          for (i = 0, c = this._parts.length; i < c; i++)
            for (p = this._parts[i], o = 0, d = p.length, s = d - 1; o < d; s = o++)
              if (!(!t && o === 0) && Me(e, p[s], p[o]) <= f)
                return !0;
          return !1;
        }
      });
      function aa(e, t) {
        return new Ct(e, t);
      }
      Ct._flat = uo;
      var Ii = Ct.extend({
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
          return nn(this._defaultShape(), this._map.options.crs);
        },
        _convertLatLngs: function(e) {
          var t = Ct.prototype._convertLatLngs.call(this, e), i = t.length;
          return i >= 2 && t[0] instanceof X && t[0].equals(t[i - 1]) && t.pop(), t;
        },
        _setLatLngs: function(e) {
          Ct.prototype._setLatLngs.call(this, e), rt(this._latlngs) && (this._latlngs = [this._latlngs]);
        },
        _defaultShape: function() {
          return rt(this._latlngs[0]) ? this._latlngs[0] : this._latlngs[0][0];
        },
        _clipPoints: function() {
          var e = this._renderer._bounds, t = this.options.weight, i = new M(t, t);
          if (e = new m(e.min.subtract(i), e.max.add(i)), this._parts = [], !(!this._pxBounds || !this._pxBounds.intersects(e))) {
            if (this.options.noClip) {
              this._parts = this._rings;
              return;
            }
            for (var o = 0, s = this._rings.length, c; o < s; o++)
              c = tn(this._rings[o], e, !0), c.length && this._parts.push(c);
          }
        },
        _updatePath: function() {
          this._renderer._updatePoly(this, !0);
        },
        // Needed by the `Canvas` renderer for interactivity
        _containsPoint: function(e) {
          var t = !1, i, o, s, c, d, p, f, x;
          if (!this._pxBounds || !this._pxBounds.contains(e))
            return !1;
          for (c = 0, f = this._parts.length; c < f; c++)
            for (i = this._parts[c], d = 0, x = i.length, p = x - 1; d < x; p = d++)
              o = i[d], s = i[p], o.y > e.y != s.y > e.y && e.x < (s.x - o.x) * (e.y - o.y) / (s.y - o.y) + o.x && (t = !t);
          return t || Ct.prototype._containsPoint.call(this, e, !0);
        }
      });
      function sa(e, t) {
        return new Ii(e, t);
      }
      var Mt = St.extend({
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
          he(this, t), this._layers = {}, e && this.addData(e);
        },
        // @method addData( <GeoJSON> data ): this
        // Adds a GeoJSON object to the layer.
        addData: function(e) {
          var t = He(e) ? e : e.features, i, o, s;
          if (t) {
            for (i = 0, o = t.length; i < o; i++)
              s = t[i], (s.geometries || s.geometry || s.features || s.coordinates) && this.addData(s);
            return this;
          }
          var c = this.options;
          if (c.filter && !c.filter(e))
            return this;
          var d = In(e, c);
          return d ? (d.feature = Nn(e), d.defaultOptions = d.options, this.resetStyle(d), c.onEachFeature && c.onEachFeature(e, d), this.addLayer(d)) : this;
        },
        // @method resetStyle( <Path> layer? ): this
        // Resets the given vector layer's style to the original GeoJSON style, useful for resetting style after hover events.
        // If `layer` is omitted, the style of all features in the current layer is reset.
        resetStyle: function(e) {
          return e === void 0 ? this.eachLayer(this.resetStyle, this) : (e.options = Z({}, e.defaultOptions), this._setLayerStyle(e, this.options.style), this);
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
      function In(e, t) {
        var i = e.type === "Feature" ? e.geometry : e, o = i ? i.coordinates : null, s = [], c = t && t.pointToLayer, d = t && t.coordsToLatLng || no, p, f, x, S;
        if (!o && !i)
          return null;
        switch (i.type) {
          case "Point":
            return p = d(o), fo(c, e, p, t);
          case "MultiPoint":
            for (x = 0, S = o.length; x < S; x++)
              p = d(o[x]), s.push(fo(c, e, p, t));
            return new St(s);
          case "LineString":
          case "MultiLineString":
            return f = Bn(o, i.type === "LineString" ? 0 : 1, d), new Ct(f, t);
          case "Polygon":
          case "MultiPolygon":
            return f = Bn(o, i.type === "Polygon" ? 1 : 2, d), new Ii(f, t);
          case "GeometryCollection":
            for (x = 0, S = i.geometries.length; x < S; x++) {
              var U = In({
                geometry: i.geometries[x],
                type: "Feature",
                properties: e.properties
              }, t);
              U && s.push(U);
            }
            return new St(s);
          case "FeatureCollection":
            for (x = 0, S = i.features.length; x < S; x++) {
              var ne = In(i.features[x], t);
              ne && s.push(ne);
            }
            return new St(s);
          default:
            throw new Error("Invalid GeoJSON object.");
        }
      }
      function fo(e, t, i, o) {
        return e ? e(t, i) : new On(i, o && o.markersInheritOptions && o);
      }
      function no(e) {
        return new X(e[1], e[0], e[2]);
      }
      function Bn(e, t, i) {
        for (var o = [], s = 0, c = e.length, d; s < c; s++)
          d = t ? Bn(e[s], t - 1, i) : (i || no)(e[s]), o.push(d);
        return o;
      }
      function oo(e, t) {
        return e = $(e), e.alt !== void 0 ? [B(e.lng, t), B(e.lat, t), B(e.alt, t)] : [B(e.lng, t), B(e.lat, t)];
      }
      function Zn(e, t, i, o) {
        for (var s = [], c = 0, d = e.length; c < d; c++)
          s.push(t ? Zn(e[c], rt(e[c]) ? 0 : t - 1, i, o) : oo(e[c], o));
        return !t && i && s.length > 0 && s.push(s[0].slice()), s;
      }
      function Bi(e, t) {
        return e.feature ? Z({}, e.feature, { geometry: t }) : Nn(t);
      }
      function Nn(e) {
        return e.type === "Feature" || e.type === "FeatureCollection" ? e : {
          type: "Feature",
          properties: {},
          geometry: e
        };
      }
      var ao = {
        toGeoJSON: function(e) {
          return Bi(this, {
            type: "Point",
            coordinates: oo(this.getLatLng(), e)
          });
        }
      };
      On.include(ao), io.include(ao), An.include(ao), Ct.include({
        toGeoJSON: function(e) {
          var t = !rt(this._latlngs), i = Zn(this._latlngs, t ? 1 : 0, !1, e);
          return Bi(this, {
            type: (t ? "Multi" : "") + "LineString",
            coordinates: i
          });
        }
      }), Ii.include({
        toGeoJSON: function(e) {
          var t = !rt(this._latlngs), i = t && !rt(this._latlngs[0]), o = Zn(this._latlngs, i ? 2 : t ? 1 : 0, !0, e);
          return t || (o = [o]), Bi(this, {
            type: (i ? "Multi" : "") + "Polygon",
            coordinates: o
          });
        }
      }), Oi.include({
        toMultiPoint: function(e) {
          var t = [];
          return this.eachLayer(function(i) {
            t.push(i.toGeoJSON(e).geometry.coordinates);
          }), Bi(this, {
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
          var i = t === "GeometryCollection", o = [];
          return this.eachLayer(function(s) {
            if (s.toGeoJSON) {
              var c = s.toGeoJSON(e);
              if (i)
                o.push(c.geometry);
              else {
                var d = Nn(c);
                d.type === "FeatureCollection" ? o.push.apply(o, d.features) : o.push(d);
              }
            }
          }), i ? Bi(this, {
            geometries: o,
            type: "GeometryCollection"
          }) : {
            type: "FeatureCollection",
            features: o
          };
        }
      });
      function mo(e, t) {
        return new Mt(e, t);
      }
      var ra = mo, Rn = mt.extend({
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
        initialize: function(e, t, i) {
          this._url = e, this._bounds = ee(t), he(this, i);
        },
        onAdd: function() {
          this._image || (this._initImage(), this.options.opacity < 1 && this._updateOpacity()), this.options.interactive && (j(this._image, "leaflet-interactive"), this.addInteractiveTarget(this._image)), this.getPane().appendChild(this._image), this._reset();
        },
        onRemove: function() {
          be(this._image), this.options.interactive && this.removeInteractiveTarget(this._image);
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
          return this._map && Dt(this._image), this;
        },
        // @method bringToBack(): this
        // Brings the layer to the bottom of all overlays.
        bringToBack: function() {
          return this._map && Ce(this._image), this;
        },
        // @method setUrl(url: String): this
        // Changes the URL of the image.
        setUrl: function(e) {
          return this._url = e, this._image && (this._image.src = e), this;
        },
        // @method setBounds(bounds: LatLngBounds): this
        // Update the bounds that this ImageOverlay covers
        setBounds: function(e) {
          return this._bounds = ee(e), this._map && this._reset(), this;
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
          var e = this._url.tagName === "IMG", t = this._image = e ? this._url : se("img");
          if (j(t, "leaflet-image-layer"), this._zoomAnimated && j(t, "leaflet-zoom-animated"), this.options.className && j(t, this.options.className), t.onselectstart = de, t.onmousemove = de, t.onload = J(this.fire, this, "load"), t.onerror = J(this._overlayOnError, this, "error"), (this.options.crossOrigin || this.options.crossOrigin === "") && (t.crossOrigin = this.options.crossOrigin === !0 ? "" : this.options.crossOrigin), this.options.zIndex && this._updateZIndex(), e) {
            this._url = t.src;
            return;
          }
          t.src = this._url, t.alt = this.options.alt;
        },
        _animateZoom: function(e) {
          var t = this._map.getZoomScale(e.zoom), i = this._map._latLngBoundsToNewLayerBounds(this._bounds, e.zoom, e.center).min;
          qe(this._image, i, t);
        },
        _reset: function() {
          var e = this._image, t = new m(
            this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
            this._map.latLngToLayerPoint(this._bounds.getSouthEast())
          ), i = t.getSize();
          _e(e, t.min), e.style.width = i.x + "px", e.style.height = i.y + "px";
        },
        _updateOpacity: function() {
          We(this._image, this.options.opacity);
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
      }), la = function(e, t, i) {
        return new Rn(e, t, i);
      }, _o = Rn.extend({
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
          var e = this._url.tagName === "VIDEO", t = this._image = e ? this._url : se("video");
          if (j(t, "leaflet-image-layer"), this._zoomAnimated && j(t, "leaflet-zoom-animated"), this.options.className && j(t, this.options.className), t.onselectstart = de, t.onmousemove = de, t.onloadeddata = J(this.fire, this, "load"), e) {
            for (var i = t.getElementsByTagName("source"), o = [], s = 0; s < i.length; s++)
              o.push(i[s].src);
            this._url = i.length > 0 ? o : [t.src];
            return;
          }
          He(this._url) || (this._url = [this._url]), !this.options.keepAspectRatio && Object.prototype.hasOwnProperty.call(t.style, "objectFit") && (t.style.objectFit = "fill"), t.autoplay = !!this.options.autoplay, t.loop = !!this.options.loop, t.muted = !!this.options.muted, t.playsInline = !!this.options.playsInline;
          for (var c = 0; c < this._url.length; c++) {
            var d = se("source");
            d.src = this._url[c], t.appendChild(d);
          }
        }
        // @method getElement(): HTMLVideoElement
        // Returns the instance of [`HTMLVideoElement`](https://developer.mozilla.org/docs/Web/API/HTMLVideoElement)
        // used by this overlay.
      });
      function ua(e, t, i) {
        return new _o(e, t, i);
      }
      var vo = Rn.extend({
        _initImage: function() {
          var e = this._image = this._url;
          j(e, "leaflet-image-layer"), this._zoomAnimated && j(e, "leaflet-zoom-animated"), this.options.className && j(e, this.options.className), e.onselectstart = de, e.onmousemove = de;
        }
        // @method getElement(): SVGElement
        // Returns the instance of [`SVGElement`](https://developer.mozilla.org/docs/Web/API/SVGElement)
        // used by this overlay.
      });
      function ca(e, t, i) {
        return new vo(e, t, i);
      }
      var wt = mt.extend({
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
          e && (e instanceof X || He(e)) ? (this._latlng = $(e), he(this, t)) : (he(this, e), this._source = t), this.options.content && (this._content = this.options.content);
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
          this._zoomAnimated = e._zoomAnimated, this._container || this._initLayout(), e._fadeAnimated && We(this._container, 0), clearTimeout(this._removeTimeout), this.getPane().appendChild(this._container), this.update(), e._fadeAnimated && We(this._container, 1), this.bringToFront(), this.options.interactive && (j(this._container, "leaflet-interactive"), this.addInteractiveTarget(this._container));
        },
        onRemove: function(e) {
          e._fadeAnimated ? (We(this._container, 0), this._removeTimeout = setTimeout(J(be, void 0, this._container), 200)) : be(this._container), this.options.interactive && (q(this._container, "leaflet-interactive"), this.removeInteractiveTarget(this._container));
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
          return this._latlng = $(e), this._map && (this._updatePosition(), this._adjustPan()), this;
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
          return this._map && Dt(this._container), this;
        },
        // @method bringToBack: this
        // Brings this overlay to the back of other overlays (in the same map pane).
        bringToBack: function() {
          return this._map && Ce(this._container), this;
        },
        // prepare bound overlay to open: update latlng pos / content source (for FeatureGroup)
        _prepareOpen: function(e) {
          var t = this._source;
          if (!t._map)
            return !1;
          if (t instanceof St) {
            t = null;
            var i = this._source._layers;
            for (var o in i)
              if (i[o]._map) {
                t = i[o];
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
            var e = this._map.latLngToLayerPoint(this._latlng), t = V(this.options.offset), i = this._getAnchor();
            this._zoomAnimated ? _e(this._container, e.add(i)) : t = t.add(e).add(i);
            var o = this._containerBottom = -t.y, s = this._containerLeft = -Math.round(this._containerWidth / 2) + t.x;
            this._container.style.bottom = o + "px", this._container.style.left = s + "px";
          }
        },
        _getAnchor: function() {
          return [0, 0];
        }
      });
      oe.include({
        _initOverlay: function(e, t, i, o) {
          var s = t;
          return s instanceof e || (s = new e(o).setContent(t)), i && s.setLatLng(i), s;
        }
      }), mt.include({
        _initOverlay: function(e, t, i, o) {
          var s = i;
          return s instanceof e ? (he(s, o), s._source = this) : (s = t && !o ? t : new e(o, this), s.setContent(i)), s;
        }
      });
      var Vn = wt.extend({
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
          return e = arguments.length ? e : this._source._map, !e.hasLayer(this) && e._popup && e._popup.options.autoClose && e.removeLayer(e._popup), e._popup = this, wt.prototype.openOn.call(this, e);
        },
        onAdd: function(e) {
          wt.prototype.onAdd.call(this, e), e.fire("popupopen", { popup: this }), this._source && (this._source.fire("popupopen", { popup: this }, !0), this._source instanceof Wt || this._source.on("preclick", Tt));
        },
        onRemove: function(e) {
          wt.prototype.onRemove.call(this, e), e.fire("popupclose", { popup: this }), this._source && (this._source.fire("popupclose", { popup: this }, !0), this._source instanceof Wt || this._source.off("preclick", Tt));
        },
        getEvents: function() {
          var e = wt.prototype.getEvents.call(this);
          return (this.options.closeOnClick !== void 0 ? this.options.closeOnClick : this._map.options.closePopupOnClick) && (e.preclick = this.close), this.options.keepInView && (e.moveend = this._adjustPan), e;
        },
        _initLayout: function() {
          var e = "leaflet-popup", t = this._container = se(
            "div",
            e + " " + (this.options.className || "") + " leaflet-zoom-animated"
          ), i = this._wrapper = se("div", e + "-content-wrapper", t);
          if (this._contentNode = se("div", e + "-content", i), bt(t), Ft(this._contentNode), H(t, "contextmenu", Tt), this._tipContainer = se("div", e + "-tip-container", t), this._tip = se("div", e + "-tip", this._tipContainer), this.options.closeButton) {
            var o = this._closeButton = se("a", e + "-close-button", t);
            o.setAttribute("role", "button"), o.setAttribute("aria-label", "Close popup"), o.href = "#close", o.innerHTML = '<span aria-hidden="true">&#215;</span>', H(o, "click", function(s) {
              Ze(s), this.close();
            }, this);
          }
        },
        _updateLayout: function() {
          var e = this._contentNode, t = e.style;
          t.width = "", t.whiteSpace = "nowrap";
          var i = e.offsetWidth;
          i = Math.min(i, this.options.maxWidth), i = Math.max(i, this.options.minWidth), t.width = i + 1 + "px", t.whiteSpace = "", t.height = "";
          var o = e.offsetHeight, s = this.options.maxHeight, c = "leaflet-popup-scrolled";
          s && o > s ? (t.height = s + "px", j(e, c)) : q(e, c), this._containerWidth = this._container.offsetWidth;
        },
        _animateZoom: function(e) {
          var t = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center), i = this._getAnchor();
          _e(this._container, t.add(i));
        },
        _adjustPan: function() {
          if (this.options.autoPan) {
            if (this._map._panAnim && this._map._panAnim.stop(), this._autopanning) {
              this._autopanning = !1;
              return;
            }
            var e = this._map, t = parseInt(oi(this._container, "marginBottom"), 10) || 0, i = this._container.offsetHeight + t, o = this._containerWidth, s = new M(this._containerLeft, -i - this._containerBottom);
            s._add(pt(this._container));
            var c = e.layerPointToContainerPoint(s), d = V(this.options.autoPanPadding), p = V(this.options.autoPanPaddingTopLeft || d), f = V(this.options.autoPanPaddingBottomRight || d), x = e.getSize(), S = 0, U = 0;
            c.x + o + f.x > x.x && (S = c.x + o - x.x + f.x), c.x - S - p.x < 0 && (S = c.x - p.x), c.y + i + f.y > x.y && (U = c.y + i - x.y + f.y), c.y - U - p.y < 0 && (U = c.y - p.y), (S || U) && (this.options.keepInView && (this._autopanning = !0), e.fire("autopanstart").panBy([S, U]));
          }
        },
        _getAnchor: function() {
          return V(this._source && this._source._getPopupAnchor ? this._source._getPopupAnchor() : [0, 0]);
        }
      }), da = function(e, t) {
        return new Vn(e, t);
      };
      oe.mergeOptions({
        closePopupOnClick: !0
      }), oe.include({
        // @method openPopup(popup: Popup): this
        // Opens the specified popup while closing the previously opened (to make sure only one is opened at one time for usability).
        // @alternative
        // @method openPopup(content: String|HTMLElement, latlng: LatLng, options?: Popup options): this
        // Creates a popup with the specified content and options and opens it in the given point on a map.
        openPopup: function(e, t, i) {
          return this._initOverlay(Vn, e, t, i).openOn(this), this;
        },
        // @method closePopup(popup?: Popup): this
        // Closes the popup previously opened with [openPopup](#map-openpopup) (or the given one).
        closePopup: function(e) {
          return e = arguments.length ? e : this._popup, e && e.close(), this;
        }
      }), mt.include({
        // @method bindPopup(content: String|HTMLElement|Function|Popup, options?: Popup options): this
        // Binds a popup to the layer with the passed `content` and sets up the
        // necessary event listeners. If a `Function` is passed it will receive
        // the layer as the first argument and should return a `String` or `HTMLElement`.
        bindPopup: function(e, t) {
          return this._popup = this._initOverlay(Vn, this._popup, e, t), this._popupHandlersAdded || (this.on({
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
          return this._popup && (this instanceof St || (this._popup._source = this), this._popup._prepareOpen(e || this._latlng) && this._popup.openOn(this._map)), this;
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
            ie(e);
            var t = e.layer || e.target;
            if (this._popup._source === t && !(t instanceof Wt)) {
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
      var Dn = wt.extend({
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
          wt.prototype.onAdd.call(this, e), this.setOpacity(this.options.opacity), e.fire("tooltipopen", { tooltip: this }), this._source && (this.addEventParent(this._source), this._source.fire("tooltipopen", { tooltip: this }, !0));
        },
        onRemove: function(e) {
          wt.prototype.onRemove.call(this, e), e.fire("tooltipclose", { tooltip: this }), this._source && (this.removeEventParent(this._source), this._source.fire("tooltipclose", { tooltip: this }, !0));
        },
        getEvents: function() {
          var e = wt.prototype.getEvents.call(this);
          return this.options.permanent || (e.preclick = this.close), e;
        },
        _initLayout: function() {
          var e = "leaflet-tooltip", t = e + " " + (this.options.className || "") + " leaflet-zoom-" + (this._zoomAnimated ? "animated" : "hide");
          this._contentNode = this._container = se("div", t), this._container.setAttribute("role", "tooltip"), this._container.setAttribute("id", "leaflet-tooltip-" + K(this));
        },
        _updateLayout: function() {
        },
        _adjustPan: function() {
        },
        _setPosition: function(e) {
          var t, i, o = this._map, s = this._container, c = o.latLngToContainerPoint(o.getCenter()), d = o.layerPointToContainerPoint(e), p = this.options.direction, f = s.offsetWidth, x = s.offsetHeight, S = V(this.options.offset), U = this._getAnchor();
          p === "top" ? (t = f / 2, i = x) : p === "bottom" ? (t = f / 2, i = 0) : p === "center" ? (t = f / 2, i = x / 2) : p === "right" ? (t = 0, i = x / 2) : p === "left" ? (t = f, i = x / 2) : d.x < c.x ? (p = "right", t = 0, i = x / 2) : (p = "left", t = f + (S.x + U.x) * 2, i = x / 2), e = e.subtract(V(t, i, !0)).add(S).add(U), q(s, "leaflet-tooltip-right"), q(s, "leaflet-tooltip-left"), q(s, "leaflet-tooltip-top"), q(s, "leaflet-tooltip-bottom"), j(s, "leaflet-tooltip-" + p), _e(s, e);
        },
        _updatePosition: function() {
          var e = this._map.latLngToLayerPoint(this._latlng);
          this._setPosition(e);
        },
        setOpacity: function(e) {
          this.options.opacity = e, this._container && We(this._container, e);
        },
        _animateZoom: function(e) {
          var t = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center);
          this._setPosition(t);
        },
        _getAnchor: function() {
          return V(this._source && this._source._getTooltipAnchor && !this.options.sticky ? this._source._getTooltipAnchor() : [0, 0]);
        }
      }), ha = function(e, t) {
        return new Dn(e, t);
      };
      oe.include({
        // @method openTooltip(tooltip: Tooltip): this
        // Opens the specified tooltip.
        // @alternative
        // @method openTooltip(content: String|HTMLElement, latlng: LatLng, options?: Tooltip options): this
        // Creates a tooltip with the specified content and options and open it.
        openTooltip: function(e, t, i) {
          return this._initOverlay(Dn, e, t, i).openOn(this), this;
        },
        // @method closeTooltip(tooltip: Tooltip): this
        // Closes the tooltip given as parameter.
        closeTooltip: function(e) {
          return e.close(), this;
        }
      }), mt.include({
        // @method bindTooltip(content: String|HTMLElement|Function|Tooltip, options?: Tooltip options): this
        // Binds a tooltip to the layer with the passed `content` and sets up the
        // necessary event listeners. If a `Function` is passed it will receive
        // the layer as the first argument and should return a `String` or `HTMLElement`.
        bindTooltip: function(e, t) {
          return this._tooltip && this.isTooltipOpen() && this.unbindTooltip(), this._tooltip = this._initOverlay(Dn, this._tooltip, e, t), this._initTooltipInteractions(), this._tooltip.options.permanent && this._map && this._map.hasLayer(this) && this.openTooltip(), this;
        },
        // @method unbindTooltip(): this
        // Removes the tooltip previously bound with `bindTooltip`.
        unbindTooltip: function() {
          return this._tooltip && (this._initTooltipInteractions(!0), this.closeTooltip(), this._tooltip = null), this;
        },
        _initTooltipInteractions: function(e) {
          if (!(!e && this._tooltipHandlersAdded)) {
            var t = e ? "off" : "on", i = {
              remove: this.closeTooltip,
              move: this._moveTooltip
            };
            this._tooltip.options.permanent ? i.add = this._openTooltip : (i.mouseover = this._openTooltip, i.mouseout = this.closeTooltip, i.click = this._openTooltip, this._map ? this._addFocusListeners() : i.add = this._addFocusListeners), this._tooltip.options.sticky && (i.mousemove = this._moveTooltip), this[t](i), this._tooltipHandlersAdded = !e;
          }
        },
        // @method openTooltip(latlng?: LatLng): this
        // Opens the bound tooltip at the specified `latlng` or at the default tooltip anchor if no `latlng` is passed.
        openTooltip: function(e) {
          return this._tooltip && (this instanceof St || (this._tooltip._source = this), this._tooltip._prepareOpen(e) && (this._tooltip.openOn(this._map), this.getElement ? this._setAriaDescribedByOnLayer(this) : this.eachLayer && this.eachLayer(this._setAriaDescribedByOnLayer, this))), this;
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
          t && (H(t, "focus", function() {
            this._tooltip._source = e, this.openTooltip();
          }, this), H(t, "blur", this.closeTooltip, this));
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
          var t = e.latlng, i, o;
          this._tooltip.options.sticky && e.originalEvent && (i = this._map.mouseEventToContainerPoint(e.originalEvent), o = this._map.containerPointToLayerPoint(i), t = this._map.layerPointToLatLng(o)), this._tooltip.setLatLng(t);
        }
      });
      var go = Ai.extend({
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
          var t = e && e.tagName === "DIV" ? e : document.createElement("div"), i = this.options;
          if (i.html instanceof Element ? (ai(t), t.appendChild(i.html)) : t.innerHTML = i.html !== !1 ? i.html : "", i.bgPos) {
            var o = V(i.bgPos);
            t.style.backgroundPosition = -o.x + "px " + -o.y + "px";
          }
          return this._setIconStyles(t, "icon"), t;
        },
        createShadow: function() {
          return null;
        }
      });
      function pa(e) {
        return new go(e);
      }
      Ai.Default = an;
      var sn = mt.extend({
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
          updateWhenIdle: I.mobile,
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
          he(this, e);
        },
        onAdd: function() {
          this._initContainer(), this._levels = {}, this._tiles = {}, this._resetView();
        },
        beforeAdd: function(e) {
          e._addZoomLimit(this);
        },
        onRemove: function(e) {
          this._removeAllTiles(), be(this._container), e._removeZoomLimit(this), this._container = null, this._tileZoom = void 0;
        },
        // @method bringToFront: this
        // Brings the tile layer to the top of all tile layers.
        bringToFront: function() {
          return this._map && (Dt(this._container), this._setAutoZIndex(Math.max)), this;
        },
        // @method bringToBack: this
        // Brings the tile layer to the bottom of all tile layers.
        bringToBack: function() {
          return this._map && (Ce(this._container), this._setAutoZIndex(Math.min)), this;
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
          return this.options.updateWhenIdle || (this._onMove || (this._onMove = Ae(this._onMoveEnd, this.options.updateInterval, this)), e.move = this._onMove), this._zoomAnimated && (e.zoomanim = this._animateZoom), e;
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
          return e instanceof M ? e : new M(e, e);
        },
        _updateZIndex: function() {
          this._container && this.options.zIndex !== void 0 && this.options.zIndex !== null && (this._container.style.zIndex = this.options.zIndex);
        },
        _setAutoZIndex: function(e) {
          for (var t = this.getPane().children, i = -e(-1 / 0, 1 / 0), o = 0, s = t.length, c; o < s; o++)
            c = t[o].style.zIndex, t[o] !== this._container && c && (i = e(i, +c));
          isFinite(i) && (this.options.zIndex = i + e(-1, 1), this._updateZIndex());
        },
        _updateOpacity: function() {
          if (this._map && !I.ielt9) {
            We(this._container, this.options.opacity);
            var e = +/* @__PURE__ */ new Date(), t = !1, i = !1;
            for (var o in this._tiles) {
              var s = this._tiles[o];
              if (!(!s.current || !s.loaded)) {
                var c = Math.min(1, (e - s.loaded) / 200);
                We(s.el, c), c < 1 ? t = !0 : (s.active ? i = !0 : this._onOpaqueTile(s), s.active = !0);
              }
            }
            i && !this._noPrune && this._pruneTiles(), t && (Pe(this._fadeFrame), this._fadeFrame = Se(this._updateOpacity, this));
          }
        },
        _onOpaqueTile: de,
        _initContainer: function() {
          this._container || (this._container = se("div", "leaflet-layer " + (this.options.className || "")), this._updateZIndex(), this.options.opacity < 1 && this._updateOpacity(), this.getPane().appendChild(this._container));
        },
        _updateLevels: function() {
          var e = this._tileZoom, t = this.options.maxZoom;
          if (e !== void 0) {
            for (var i in this._levels)
              i = Number(i), this._levels[i].el.children.length || i === e ? (this._levels[i].el.style.zIndex = t - Math.abs(e - i), this._onUpdateLevel(i)) : (be(this._levels[i].el), this._removeTilesAtZoom(i), this._onRemoveLevel(i), delete this._levels[i]);
            var o = this._levels[e], s = this._map;
            return o || (o = this._levels[e] = {}, o.el = se("div", "leaflet-tile-container leaflet-zoom-animated", this._container), o.el.style.zIndex = t, o.origin = s.project(s.unproject(s.getPixelOrigin()), e).round(), o.zoom = e, this._setZoomTransform(o, s.getCenter(), s.getZoom()), de(o.el.offsetWidth), this._onCreateLevel(o)), this._level = o, o;
          }
        },
        _onUpdateLevel: de,
        _onRemoveLevel: de,
        _onCreateLevel: de,
        _pruneTiles: function() {
          if (this._map) {
            var e, t, i = this._map.getZoom();
            if (i > this.options.maxZoom || i < this.options.minZoom) {
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
            be(this._levels[e].el), this._onRemoveLevel(Number(e)), delete this._levels[e];
          this._removeAllTiles(), this._tileZoom = void 0;
        },
        _retainParent: function(e, t, i, o) {
          var s = Math.floor(e / 2), c = Math.floor(t / 2), d = i - 1, p = new M(+s, +c);
          p.z = +d;
          var f = this._tileCoordsToKey(p), x = this._tiles[f];
          return x && x.active ? (x.retain = !0, !0) : (x && x.loaded && (x.retain = !0), d > o ? this._retainParent(s, c, d, o) : !1);
        },
        _retainChildren: function(e, t, i, o) {
          for (var s = 2 * e; s < 2 * e + 2; s++)
            for (var c = 2 * t; c < 2 * t + 2; c++) {
              var d = new M(s, c);
              d.z = i + 1;
              var p = this._tileCoordsToKey(d), f = this._tiles[p];
              if (f && f.active) {
                f.retain = !0;
                continue;
              } else f && f.loaded && (f.retain = !0);
              i + 1 < o && this._retainChildren(s, c, i + 1, o);
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
        _setView: function(e, t, i, o) {
          var s = Math.round(t);
          this.options.maxZoom !== void 0 && s > this.options.maxZoom || this.options.minZoom !== void 0 && s < this.options.minZoom ? s = void 0 : s = this._clampZoom(s);
          var c = this.options.updateWhenZooming && s !== this._tileZoom;
          (!o || c) && (this._tileZoom = s, this._abortLoading && this._abortLoading(), this._updateLevels(), this._resetGrid(), s !== void 0 && this._update(e), i || this._pruneTiles(), this._noPrune = !!i), this._setZoomTransforms(e, t);
        },
        _setZoomTransforms: function(e, t) {
          for (var i in this._levels)
            this._setZoomTransform(this._levels[i], e, t);
        },
        _setZoomTransform: function(e, t, i) {
          var o = this._map.getZoomScale(i, e.zoom), s = e.origin.multiplyBy(o).subtract(this._map._getNewPixelOrigin(t, i)).round();
          I.any3d ? qe(e.el, s, o) : _e(e.el, s);
        },
        _resetGrid: function() {
          var e = this._map, t = e.options.crs, i = this._tileSize = this.getTileSize(), o = this._tileZoom, s = this._map.getPixelWorldBounds(this._tileZoom);
          s && (this._globalTileRange = this._pxBoundsToTileRange(s)), this._wrapX = t.wrapLng && !this.options.noWrap && [
            Math.floor(e.project([0, t.wrapLng[0]], o).x / i.x),
            Math.ceil(e.project([0, t.wrapLng[1]], o).x / i.y)
          ], this._wrapY = t.wrapLat && !this.options.noWrap && [
            Math.floor(e.project([t.wrapLat[0], 0], o).y / i.x),
            Math.ceil(e.project([t.wrapLat[1], 0], o).y / i.y)
          ];
        },
        _onMoveEnd: function() {
          !this._map || this._map._animatingZoom || this._update();
        },
        _getTiledPixelBounds: function(e) {
          var t = this._map, i = t._animatingZoom ? Math.max(t._animateToZoom, t.getZoom()) : t.getZoom(), o = t.getZoomScale(i, this._tileZoom), s = t.project(e, this._tileZoom).floor(), c = t.getSize().divideBy(o * 2);
          return new m(s.subtract(c), s.add(c));
        },
        // Private method to load tiles in the grid's active zoom level according to map bounds
        _update: function(e) {
          var t = this._map;
          if (t) {
            var i = this._clampZoom(t.getZoom());
            if (e === void 0 && (e = t.getCenter()), this._tileZoom !== void 0) {
              var o = this._getTiledPixelBounds(e), s = this._pxBoundsToTileRange(o), c = s.getCenter(), d = [], p = this.options.keepBuffer, f = new m(
                s.getBottomLeft().subtract([p, -p]),
                s.getTopRight().add([p, -p])
              );
              if (!(isFinite(s.min.x) && isFinite(s.min.y) && isFinite(s.max.x) && isFinite(s.max.y)))
                throw new Error("Attempted to load an infinite number of tiles");
              for (var x in this._tiles) {
                var S = this._tiles[x].coords;
                (S.z !== this._tileZoom || !f.contains(new M(S.x, S.y))) && (this._tiles[x].current = !1);
              }
              if (Math.abs(i - this._tileZoom) > 1) {
                this._setView(e, i);
                return;
              }
              for (var U = s.min.y; U <= s.max.y; U++)
                for (var ne = s.min.x; ne <= s.max.x; ne++) {
                  var Ge = new M(ne, U);
                  if (Ge.z = this._tileZoom, !!this._isValidTile(Ge)) {
                    var Re = this._tiles[this._tileCoordsToKey(Ge)];
                    Re ? Re.current = !0 : d.push(Ge);
                  }
                }
              if (d.sort(function(Je, Ni) {
                return Je.distanceTo(c) - Ni.distanceTo(c);
              }), d.length !== 0) {
                this._loading || (this._loading = !0, this.fire("loading"));
                var lt = document.createDocumentFragment();
                for (ne = 0; ne < d.length; ne++)
                  this._addTile(d[ne], lt);
                this._level.el.appendChild(lt);
              }
            }
          }
        },
        _isValidTile: function(e) {
          var t = this._map.options.crs;
          if (!t.infinite) {
            var i = this._globalTileRange;
            if (!t.wrapLng && (e.x < i.min.x || e.x > i.max.x) || !t.wrapLat && (e.y < i.min.y || e.y > i.max.y))
              return !1;
          }
          if (!this.options.bounds)
            return !0;
          var o = this._tileCoordsToBounds(e);
          return ee(this.options.bounds).overlaps(o);
        },
        _keyToBounds: function(e) {
          return this._tileCoordsToBounds(this._keyToTileCoords(e));
        },
        _tileCoordsToNwSe: function(e) {
          var t = this._map, i = this.getTileSize(), o = e.scaleBy(i), s = o.add(i), c = t.unproject(o, e.z), d = t.unproject(s, e.z);
          return [c, d];
        },
        // converts tile coordinates to its geographical bounds
        _tileCoordsToBounds: function(e) {
          var t = this._tileCoordsToNwSe(e), i = new y(t[0], t[1]);
          return this.options.noWrap || (i = this._map.wrapLatLngBounds(i)), i;
        },
        // converts tile coordinates to key for the tile cache
        _tileCoordsToKey: function(e) {
          return e.x + ":" + e.y + ":" + e.z;
        },
        // converts tile cache key to coordinates
        _keyToTileCoords: function(e) {
          var t = e.split(":"), i = new M(+t[0], +t[1]);
          return i.z = +t[2], i;
        },
        _removeTile: function(e) {
          var t = this._tiles[e];
          t && (be(t.el), delete this._tiles[e], this.fire("tileunload", {
            tile: t.el,
            coords: this._keyToTileCoords(e)
          }));
        },
        _initTile: function(e) {
          j(e, "leaflet-tile");
          var t = this.getTileSize();
          e.style.width = t.x + "px", e.style.height = t.y + "px", e.onselectstart = de, e.onmousemove = de, I.ielt9 && this.options.opacity < 1 && We(e, this.options.opacity);
        },
        _addTile: function(e, t) {
          var i = this._getTilePos(e), o = this._tileCoordsToKey(e), s = this.createTile(this._wrapCoords(e), J(this._tileReady, this, e));
          this._initTile(s), this.createTile.length < 2 && Se(J(this._tileReady, this, e, null, s)), _e(s, i), this._tiles[o] = {
            el: s,
            coords: e,
            current: !0
          }, t.appendChild(s), this.fire("tileloadstart", {
            tile: s,
            coords: e
          });
        },
        _tileReady: function(e, t, i) {
          t && this.fire("tileerror", {
            error: t,
            tile: i,
            coords: e
          });
          var o = this._tileCoordsToKey(e);
          i = this._tiles[o], i && (i.loaded = +/* @__PURE__ */ new Date(), this._map._fadeAnimated ? (We(i.el, 0), Pe(this._fadeFrame), this._fadeFrame = Se(this._updateOpacity, this)) : (i.active = !0, this._pruneTiles()), t || (j(i.el, "leaflet-tile-loaded"), this.fire("tileload", {
            tile: i.el,
            coords: e
          })), this._noTilesToLoad() && (this._loading = !1, this.fire("load"), I.ielt9 || !this._map._fadeAnimated ? Se(this._pruneTiles, this) : setTimeout(J(this._pruneTiles, this), 250)));
        },
        _getTilePos: function(e) {
          return e.scaleBy(this.getTileSize()).subtract(this._level.origin);
        },
        _wrapCoords: function(e) {
          var t = new M(
            this._wrapX ? we(e.x, this._wrapX) : e.x,
            this._wrapY ? we(e.y, this._wrapY) : e.y
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
        return new sn(e);
      }
      var Zi = sn.extend({
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
          this._url = e, t = he(this, t), t.detectRetina && I.retina && t.maxZoom > 0 ? (t.tileSize = Math.floor(t.tileSize / 2), t.zoomReverse ? (t.zoomOffset--, t.minZoom = Math.min(t.maxZoom, t.minZoom + 1)) : (t.zoomOffset++, t.maxZoom = Math.max(t.minZoom, t.maxZoom - 1)), t.minZoom = Math.max(0, t.minZoom)) : t.zoomReverse ? t.minZoom = Math.min(t.maxZoom, t.minZoom) : t.maxZoom = Math.max(t.minZoom, t.maxZoom), typeof t.subdomains == "string" && (t.subdomains = t.subdomains.split("")), this.on("tileunload", this._onTileRemove);
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
          var i = document.createElement("img");
          return H(i, "load", J(this._tileOnLoad, this, t, i)), H(i, "error", J(this._tileOnError, this, t, i)), (this.options.crossOrigin || this.options.crossOrigin === "") && (i.crossOrigin = this.options.crossOrigin === !0 ? "" : this.options.crossOrigin), typeof this.options.referrerPolicy == "string" && (i.referrerPolicy = this.options.referrerPolicy), i.alt = "", i.src = this.getTileUrl(e), i;
        },
        // @section Extension methods
        // @uninheritable
        // Layers extending `TileLayer` might reimplement the following method.
        // @method getTileUrl(coords: Object): String
        // Called only internally, returns the URL for a tile given its coordinates.
        // Classes extending `TileLayer` can override this function to provide custom tile URL naming schemes.
        getTileUrl: function(e) {
          var t = {
            r: I.retina ? "@2x" : "",
            s: this._getSubdomain(e),
            x: e.x,
            y: e.y,
            z: this._getZoomForUrl()
          };
          if (this._map && !this._map.options.crs.infinite) {
            var i = this._globalTileRange.max.y - e.y;
            this.options.tms && (t.y = i), t["-y"] = i;
          }
          return ut(this._url, Z(t, this.options));
        },
        _tileOnLoad: function(e, t) {
          I.ielt9 ? setTimeout(J(e, this, null, t), 0) : e(null, t);
        },
        _tileOnError: function(e, t, i) {
          var o = this.options.errorTileUrl;
          o && t.getAttribute("src") !== o && (t.src = o), e(i, t);
        },
        _onTileRemove: function(e) {
          e.tile.onload = null;
        },
        _getZoomForUrl: function() {
          var e = this._tileZoom, t = this.options.maxZoom, i = this.options.zoomReverse, o = this.options.zoomOffset;
          return i && (e = t - e), e + o;
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
              t.src = At;
              var i = this._tiles[e].coords;
              be(t), delete this._tiles[e], this.fire("tileabort", {
                tile: t,
                coords: i
              });
            }
        },
        _removeTile: function(e) {
          var t = this._tiles[e];
          if (t)
            return t.el.setAttribute("src", At), sn.prototype._removeTile.call(this, e);
        },
        _tileReady: function(e, t, i) {
          if (!(!this._map || i && i.getAttribute("src") === At))
            return sn.prototype._tileReady.call(this, e, t, i);
        }
      });
      function yo(e, t) {
        return new Zi(e, t);
      }
      var bo = Zi.extend({
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
          var i = Z({}, this.defaultWmsParams);
          for (var o in t)
            o in this.options || (i[o] = t[o]);
          t = he(this, t);
          var s = t.detectRetina && I.retina ? 2 : 1, c = this.getTileSize();
          i.width = c.x * s, i.height = c.y * s, this.wmsParams = i;
        },
        onAdd: function(e) {
          this._crs = this.options.crs || e.options.crs, this._wmsVersion = parseFloat(this.wmsParams.version);
          var t = this._wmsVersion >= 1.3 ? "crs" : "srs";
          this.wmsParams[t] = this._crs.code, Zi.prototype.onAdd.call(this, e);
        },
        getTileUrl: function(e) {
          var t = this._tileCoordsToNwSe(e), i = this._crs, o = T(i.project(t[0]), i.project(t[1])), s = o.min, c = o.max, d = (this._wmsVersion >= 1.3 && this._crs === ho ? [s.y, s.x, c.y, c.x] : [s.x, s.y, c.x, c.y]).join(","), p = Zi.prototype.getTileUrl.call(this, e);
          return p + jt(this.wmsParams, p, this.options.uppercase) + (this.options.uppercase ? "&BBOX=" : "&bbox=") + d;
        },
        // @method setParams(params: Object, noRedraw?: Boolean): this
        // Merges an object with the new parameters and re-requests tiles on the current screen (unless `noRedraw` was set to true).
        setParams: function(e, t) {
          return Z(this.wmsParams, e), t || this.redraw(), this;
        }
      });
      function ma(e, t) {
        return new bo(e, t);
      }
      Zi.WMS = bo, yo.wms = ma;
      var zt = mt.extend({
        // @section
        // @aka Renderer options
        options: {
          // @option padding: Number = 0.1
          // How much to extend the clip area around the map view (relative to its size)
          // e.g. 0.1 would be 10% of map view in each direction
          padding: 0.1
        },
        initialize: function(e) {
          he(this, e), K(this), this._layers = this._layers || {};
        },
        onAdd: function() {
          this._container || (this._initContainer(), j(this._container, "leaflet-zoom-animated")), this.getPane().appendChild(this._container), this._update(), this.on("update", this._updatePaths, this);
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
          var i = this._map.getZoomScale(t, this._zoom), o = this._map.getSize().multiplyBy(0.5 + this.options.padding), s = this._map.project(this._center, t), c = o.multiplyBy(-i).add(s).subtract(this._map._getNewPixelOrigin(e, t));
          I.any3d ? qe(this._container, c, i) : _e(this._container, c);
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
          var e = this.options.padding, t = this._map.getSize(), i = this._map.containerPointToLayerPoint(t.multiplyBy(-e)).round();
          this._bounds = new m(i, i.add(t.multiplyBy(1 + e * 2)).round()), this._center = this._map.getCenter(), this._zoom = this._map.getZoom();
        }
      }), wo = zt.extend({
        // @section
        // @aka Canvas options
        options: {
          // @option tolerance: Number = 0
          // How much to extend the click tolerance around a path/object on the map.
          tolerance: 0
        },
        getEvents: function() {
          var e = zt.prototype.getEvents.call(this);
          return e.viewprereset = this._onViewPreReset, e;
        },
        _onViewPreReset: function() {
          this._postponeUpdatePaths = !0;
        },
        onAdd: function() {
          zt.prototype.onAdd.call(this), this._draw();
        },
        _initContainer: function() {
          var e = this._container = document.createElement("canvas");
          H(e, "mousemove", this._onMouseMove, this), H(e, "click dblclick mousedown mouseup contextmenu", this._onClick, this), H(e, "mouseout", this._handleMouseOut, this), e._leaflet_disable_events = !0, this._ctx = e.getContext("2d");
        },
        _destroyContainer: function() {
          Pe(this._redrawRequest), delete this._ctx, be(this._container), pe(this._container), delete this._container;
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
            zt.prototype._update.call(this);
            var e = this._bounds, t = this._container, i = e.getSize(), o = I.retina ? 2 : 1;
            _e(t, e.min), t.width = o * i.x, t.height = o * i.y, t.style.width = i.x + "px", t.style.height = i.y + "px", I.retina && this._ctx.scale(2, 2), this._ctx.translate(-e.min.x, -e.min.y), this.fire("update");
          }
        },
        _reset: function() {
          zt.prototype._reset.call(this), this._postponeUpdatePaths && (this._postponeUpdatePaths = !1, this._updatePaths());
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
          var t = e._order, i = t.next, o = t.prev;
          i ? i.prev = o : this._drawLast = o, o ? o.next = i : this._drawFirst = i, delete e._order, delete this._layers[K(e)], this._requestRedraw(e);
        },
        _updatePath: function(e) {
          this._extendRedrawBounds(e), e._project(), e._update(), this._requestRedraw(e);
        },
        _updateStyle: function(e) {
          this._updateDashArray(e), this._requestRedraw(e);
        },
        _updateDashArray: function(e) {
          if (typeof e.options.dashArray == "string") {
            var t = e.options.dashArray.split(/[, ]+/), i = [], o, s;
            for (s = 0; s < t.length; s++) {
              if (o = Number(t[s]), isNaN(o))
                return;
              i.push(o);
            }
            e.options._dashArray = i;
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
            var i = t.getSize();
            this._ctx.beginPath(), this._ctx.rect(t.min.x, t.min.y, i.x, i.y), this._ctx.clip();
          }
          this._drawing = !0;
          for (var o = this._drawFirst; o; o = o.next)
            e = o.layer, (!t || e._pxBounds && e._pxBounds.intersects(t)) && e._updatePath();
          this._drawing = !1, this._ctx.restore();
        },
        _updatePoly: function(e, t) {
          if (this._drawing) {
            var i, o, s, c, d = e._parts, p = d.length, f = this._ctx;
            if (p) {
              for (f.beginPath(), i = 0; i < p; i++) {
                for (o = 0, s = d[i].length; o < s; o++)
                  c = d[i][o], f[o ? "lineTo" : "moveTo"](c.x, c.y);
                t && f.closePath();
              }
              this._fillStroke(f, e);
            }
          }
        },
        _updateCircle: function(e) {
          if (!(!this._drawing || e._empty())) {
            var t = e._point, i = this._ctx, o = Math.max(Math.round(e._radius), 1), s = (Math.max(Math.round(e._radiusY), 1) || o) / o;
            s !== 1 && (i.save(), i.scale(1, s)), i.beginPath(), i.arc(t.x, t.y / s, o, 0, Math.PI * 2, !1), s !== 1 && i.restore(), this._fillStroke(i, e);
          }
        },
        _fillStroke: function(e, t) {
          var i = t.options;
          i.fill && (e.globalAlpha = i.fillOpacity, e.fillStyle = i.fillColor || i.color, e.fill(i.fillRule || "evenodd")), i.stroke && i.weight !== 0 && (e.setLineDash && e.setLineDash(t.options && t.options._dashArray || []), e.globalAlpha = i.opacity, e.lineWidth = i.weight, e.strokeStyle = i.color, e.lineCap = i.lineCap, e.lineJoin = i.lineJoin, e.stroke());
        },
        // Canvas obviously doesn't have mouse events for individual drawn objects,
        // so we emulate that by calculating what's under the mouse on mousemove/click manually
        _onClick: function(e) {
          for (var t = this._map.mouseEventToLayerPoint(e), i, o, s = this._drawFirst; s; s = s.next)
            i = s.layer, i.options.interactive && i._containsPoint(t) && (!(e.type === "click" || e.type === "preclick") || !this._map._draggableMoved(i)) && (o = i);
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
          t && (q(this._container, "leaflet-interactive"), this._fireEvent([t], e, "mouseout"), this._hoveredLayer = null, this._mouseHoverThrottled = !1);
        },
        _handleMouseHover: function(e, t) {
          if (!this._mouseHoverThrottled) {
            for (var i, o, s = this._drawFirst; s; s = s.next)
              i = s.layer, i.options.interactive && i._containsPoint(t) && (o = i);
            o !== this._hoveredLayer && (this._handleMouseOut(e), o && (j(this._container, "leaflet-interactive"), this._fireEvent([o], e, "mouseover"), this._hoveredLayer = o)), this._fireEvent(this._hoveredLayer ? [this._hoveredLayer] : !1, e), this._mouseHoverThrottled = !0, setTimeout(J(function() {
              this._mouseHoverThrottled = !1;
            }, this), 32);
          }
        },
        _fireEvent: function(e, t, i) {
          this._map._fireDOMEvent(t, i || t.type, e);
        },
        _bringToFront: function(e) {
          var t = e._order;
          if (t) {
            var i = t.next, o = t.prev;
            if (i)
              i.prev = o;
            else
              return;
            o ? o.next = i : i && (this._drawFirst = i), t.prev = this._drawLast, this._drawLast.next = t, t.next = null, this._drawLast = t, this._requestRedraw(e);
          }
        },
        _bringToBack: function(e) {
          var t = e._order;
          if (t) {
            var i = t.next, o = t.prev;
            if (o)
              o.next = i;
            else
              return;
            i ? i.prev = o : o && (this._drawLast = o), t.prev = null, t.next = this._drawFirst, this._drawFirst.prev = t, this._drawFirst = t, this._requestRedraw(e);
          }
        }
      });
      function xo(e) {
        return I.canvas ? new wo(e) : null;
      }
      var rn = (function() {
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
          this._container = se("div", "leaflet-vml-container");
        },
        _update: function() {
          this._map._animatingZoom || (zt.prototype._update.call(this), this.fire("update"));
        },
        _initPath: function(e) {
          var t = e._container = rn("shape");
          j(t, "leaflet-vml-shape " + (this.options.className || "")), t.coordsize = "1 1", e._path = rn("path"), t.appendChild(e._path), this._updateStyle(e), this._layers[K(e)] = e;
        },
        _addPath: function(e) {
          var t = e._container;
          this._container.appendChild(t), e.options.interactive && e.addInteractiveTarget(t);
        },
        _removePath: function(e) {
          var t = e._container;
          be(t), e.removeInteractiveTarget(t), delete this._layers[K(e)];
        },
        _updateStyle: function(e) {
          var t = e._stroke, i = e._fill, o = e.options, s = e._container;
          s.stroked = !!o.stroke, s.filled = !!o.fill, o.stroke ? (t || (t = e._stroke = rn("stroke")), s.appendChild(t), t.weight = o.weight + "px", t.color = o.color, t.opacity = o.opacity, o.dashArray ? t.dashStyle = He(o.dashArray) ? o.dashArray.join(" ") : o.dashArray.replace(/( *, *)/g, " ") : t.dashStyle = "", t.endcap = o.lineCap.replace("butt", "flat"), t.joinstyle = o.lineJoin) : t && (s.removeChild(t), e._stroke = null), o.fill ? (i || (i = e._fill = rn("fill")), s.appendChild(i), i.color = o.fillColor || o.color, i.opacity = o.fillOpacity) : i && (s.removeChild(i), e._fill = null);
        },
        _updateCircle: function(e) {
          var t = e._point.round(), i = Math.round(e._radius), o = Math.round(e._radiusY || i);
          this._setPath(e, e._empty() ? "M0 0" : "AL " + t.x + "," + t.y + " " + i + "," + o + " 0," + 65535 * 360);
        },
        _setPath: function(e, t) {
          e._path.v = t;
        },
        _bringToFront: function(e) {
          Dt(e._container);
        },
        _bringToBack: function(e) {
          Ce(e._container);
        }
      }, $n = I.vml ? rn : hn, ln = zt.extend({
        _initContainer: function() {
          this._container = $n("svg"), this._container.setAttribute("pointer-events", "none"), this._rootGroup = $n("g"), this._container.appendChild(this._rootGroup);
        },
        _destroyContainer: function() {
          be(this._container), pe(this._container), delete this._container, delete this._rootGroup, delete this._svgSize;
        },
        _update: function() {
          if (!(this._map._animatingZoom && this._bounds)) {
            zt.prototype._update.call(this);
            var e = this._bounds, t = e.getSize(), i = this._container;
            (!this._svgSize || !this._svgSize.equals(t)) && (this._svgSize = t, i.setAttribute("width", t.x), i.setAttribute("height", t.y)), _e(i, e.min), i.setAttribute("viewBox", [e.min.x, e.min.y, t.x, t.y].join(" ")), this.fire("update");
          }
        },
        // methods below are called by vector layers implementations
        _initPath: function(e) {
          var t = e._path = $n("path");
          e.options.className && j(t, e.options.className), e.options.interactive && j(t, "leaflet-interactive"), this._updateStyle(e), this._layers[K(e)] = e;
        },
        _addPath: function(e) {
          this._rootGroup || this._initContainer(), this._rootGroup.appendChild(e._path), e.addInteractiveTarget(e._path);
        },
        _removePath: function(e) {
          be(e._path), e.removeInteractiveTarget(e._path), delete this._layers[K(e)];
        },
        _updatePath: function(e) {
          e._project(), e._update();
        },
        _updateStyle: function(e) {
          var t = e._path, i = e.options;
          t && (i.stroke ? (t.setAttribute("stroke", i.color), t.setAttribute("stroke-opacity", i.opacity), t.setAttribute("stroke-width", i.weight), t.setAttribute("stroke-linecap", i.lineCap), t.setAttribute("stroke-linejoin", i.lineJoin), i.dashArray ? t.setAttribute("stroke-dasharray", i.dashArray) : t.removeAttribute("stroke-dasharray"), i.dashOffset ? t.setAttribute("stroke-dashoffset", i.dashOffset) : t.removeAttribute("stroke-dashoffset")) : t.setAttribute("stroke", "none"), i.fill ? (t.setAttribute("fill", i.fillColor || i.color), t.setAttribute("fill-opacity", i.fillOpacity), t.setAttribute("fill-rule", i.fillRule || "evenodd")) : t.setAttribute("fill", "none"));
        },
        _updatePoly: function(e, t) {
          this._setPath(e, ct(e._parts, t));
        },
        _updateCircle: function(e) {
          var t = e._point, i = Math.max(Math.round(e._radius), 1), o = Math.max(Math.round(e._radiusY), 1) || i, s = "a" + i + "," + o + " 0 1,0 ", c = e._empty() ? "M0 0" : "M" + (t.x - i) + "," + t.y + s + i * 2 + ",0 " + s + -i * 2 + ",0 ";
          this._setPath(e, c);
        },
        _setPath: function(e, t) {
          e._path.setAttribute("d", t);
        },
        // SVG does not have the concept of zIndex so we resort to changing the DOM order of elements
        _bringToFront: function(e) {
          Dt(e._path);
        },
        _bringToBack: function(e) {
          Ce(e._path);
        }
      });
      I.vml && ln.include(_a);
      function ko(e) {
        return I.svg || I.vml ? new ln(e) : null;
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
          return this.options.preferCanvas && xo(e) || ko(e);
        }
      });
      var Po = Ii.extend({
        initialize: function(e, t) {
          Ii.prototype.initialize.call(this, this._boundsToLatLngs(e), t);
        },
        // @method setBounds(latLngBounds: LatLngBounds): this
        // Redraws the rectangle with the passed bounds.
        setBounds: function(e) {
          return this.setLatLngs(this._boundsToLatLngs(e));
        },
        _boundsToLatLngs: function(e) {
          return e = ee(e), [
            e.getSouthWest(),
            e.getNorthWest(),
            e.getNorthEast(),
            e.getSouthEast()
          ];
        }
      });
      function va(e, t) {
        return new Po(e, t);
      }
      ln.create = $n, ln.pointsToPath = ct, Mt.geometryToLayer = In, Mt.coordsToLatLng = no, Mt.coordsToLatLngs = Bn, Mt.latLngToCoords = oo, Mt.latLngsToCoords = Zn, Mt.getFeature = Bi, Mt.asFeature = Nn, oe.mergeOptions({
        // @option boxZoom: Boolean = true
        // Whether the map can be zoomed to a rectangular area specified by
        // dragging the mouse while pressing the shift key.
        boxZoom: !0
      });
      var Lo = W.extend({
        initialize: function(e) {
          this._map = e, this._container = e._container, this._pane = e._panes.overlayPane, this._resetStateTimeout = 0, e.on("unload", this._destroy, this);
        },
        addHooks: function() {
          H(this._container, "mousedown", this._onMouseDown, this);
        },
        removeHooks: function() {
          pe(this._container, "mousedown", this._onMouseDown, this);
        },
        moved: function() {
          return this._moved;
        },
        _destroy: function() {
          be(this._pane), delete this._pane;
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
          this._clearDeferredResetState(), this._resetState(), Ke(), Ne(), this._startPoint = this._map.mouseEventToContainerPoint(e), H(document, {
            contextmenu: ie,
            mousemove: this._onMouseMove,
            mouseup: this._onMouseUp,
            keydown: this._onKeyDown
          }, this);
        },
        _onMouseMove: function(e) {
          this._moved || (this._moved = !0, this._box = se("div", "leaflet-zoom-box", this._container), j(this._container, "leaflet-crosshair"), this._map.fire("boxzoomstart")), this._point = this._map.mouseEventToContainerPoint(e);
          var t = new m(this._point, this._startPoint), i = t.getSize();
          _e(this._box, t.min), this._box.style.width = i.x + "px", this._box.style.height = i.y + "px";
        },
        _finish: function() {
          this._moved && (be(this._box), q(this._container, "leaflet-crosshair")), si(), Ye(), pe(document, {
            contextmenu: ie,
            mousemove: this._onMouseMove,
            mouseup: this._onMouseUp,
            keydown: this._onKeyDown
          }, this);
        },
        _onMouseUp: function(e) {
          if (!(e.which !== 1 && e.button !== 1) && (this._finish(), !!this._moved)) {
            this._clearDeferredResetState(), this._resetStateTimeout = setTimeout(J(this._resetState, this), 0);
            var t = new y(
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
      oe.addInitHook("addHandler", "boxZoom", Lo), oe.mergeOptions({
        // @option doubleClickZoom: Boolean|String = true
        // Whether the map can be zoomed in by double clicking on it and
        // zoomed out by double clicking while holding shift. If passed
        // `'center'`, double-click zoom will zoom to the center of the
        //  view regardless of where the mouse was.
        doubleClickZoom: !0
      });
      var To = W.extend({
        addHooks: function() {
          this._map.on("dblclick", this._onDoubleClick, this);
        },
        removeHooks: function() {
          this._map.off("dblclick", this._onDoubleClick, this);
        },
        _onDoubleClick: function(e) {
          var t = this._map, i = t.getZoom(), o = t.options.zoomDelta, s = e.originalEvent.shiftKey ? i - o : i + o;
          t.options.doubleClickZoom === "center" ? t.setZoom(s) : t.setZoomAround(e.containerPoint, s);
        }
      });
      oe.addInitHook("addHandler", "doubleClickZoom", To), oe.mergeOptions({
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
      var So = W.extend({
        addHooks: function() {
          if (!this._draggable) {
            var e = this._map;
            this._draggable = new ft(e._mapPane, e._container), this._draggable.on({
              dragstart: this._onDragStart,
              drag: this._onDrag,
              dragend: this._onDragEnd
            }, this), this._draggable.on("predrag", this._onPreDragLimit, this), e.options.worldCopyJump && (this._draggable.on("predrag", this._onPreDragWrap, this), e.on("zoomend", this._onZoomEnd, this), e.whenReady(this._onZoomEnd, this));
          }
          j(this._map._container, "leaflet-grab leaflet-touch-drag"), this._draggable.enable(), this._positions = [], this._times = [];
        },
        removeHooks: function() {
          q(this._map._container, "leaflet-grab"), q(this._map._container, "leaflet-touch-drag"), this._draggable.disable();
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
            var t = ee(this._map.options.maxBounds);
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
            var t = this._lastTime = +/* @__PURE__ */ new Date(), i = this._lastPos = this._draggable._absPos || this._draggable._newPos;
            this._positions.push(i), this._times.push(t), this._prunePositions(t);
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
          var e = this._worldWidth, t = Math.round(e / 2), i = this._initialWorldOffset, o = this._draggable._newPos.x, s = (o - t + i) % e + t - i, c = (o + t + i) % e - t - i, d = Math.abs(s + i) < Math.abs(c + i) ? s : c;
          this._draggable._absPos = this._draggable._newPos.clone(), this._draggable._newPos.x = d;
        },
        _onDragEnd: function(e) {
          var t = this._map, i = t.options, o = !i.inertia || e.noInertia || this._times.length < 2;
          if (t.fire("dragend", e), o)
            t.fire("moveend");
          else {
            this._prunePositions(+/* @__PURE__ */ new Date());
            var s = this._lastPos.subtract(this._positions[0]), c = (this._lastTime - this._times[0]) / 1e3, d = i.easeLinearity, p = s.multiplyBy(d / c), f = p.distanceTo([0, 0]), x = Math.min(i.inertiaMaxSpeed, f), S = p.multiplyBy(x / f), U = x / (i.inertiaDeceleration * d), ne = S.multiplyBy(-U / 2).round();
            !ne.x && !ne.y ? t.fire("moveend") : (ne = t._limitOffset(ne, t.options.maxBounds), Se(function() {
              t.panBy(ne, {
                duration: U,
                easeLinearity: d,
                noMoveStart: !0,
                animate: !0
              });
            }));
          }
        }
      });
      oe.addInitHook("addHandler", "dragging", So), oe.mergeOptions({
        // @option keyboard: Boolean = true
        // Makes the map focusable and allows users to navigate the map with keyboard
        // arrows and `+`/`-` keys.
        keyboard: !0,
        // @option keyboardPanDelta: Number = 80
        // Amount of pixels to pan when pressing an arrow key.
        keyboardPanDelta: 80
      });
      var Co = W.extend({
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
          e.tabIndex <= 0 && (e.tabIndex = "0"), H(e, {
            focus: this._onFocus,
            blur: this._onBlur,
            mousedown: this._onMouseDown
          }, this), this._map.on({
            focus: this._addHooks,
            blur: this._removeHooks
          }, this);
        },
        removeHooks: function() {
          this._removeHooks(), pe(this._map._container, {
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
            var e = document.body, t = document.documentElement, i = e.scrollTop || t.scrollTop, o = e.scrollLeft || t.scrollLeft;
            this._map._container.focus(), window.scrollTo(o, i);
          }
        },
        _onFocus: function() {
          this._focused = !0, this._map.fire("focus");
        },
        _onBlur: function() {
          this._focused = !1, this._map.fire("blur");
        },
        _setPanDelta: function(e) {
          var t = this._panKeys = {}, i = this.keyCodes, o, s;
          for (o = 0, s = i.left.length; o < s; o++)
            t[i.left[o]] = [-1 * e, 0];
          for (o = 0, s = i.right.length; o < s; o++)
            t[i.right[o]] = [e, 0];
          for (o = 0, s = i.down.length; o < s; o++)
            t[i.down[o]] = [0, e];
          for (o = 0, s = i.up.length; o < s; o++)
            t[i.up[o]] = [0, -1 * e];
        },
        _setZoomDelta: function(e) {
          var t = this._zoomKeys = {}, i = this.keyCodes, o, s;
          for (o = 0, s = i.zoomIn.length; o < s; o++)
            t[i.zoomIn[o]] = e;
          for (o = 0, s = i.zoomOut.length; o < s; o++)
            t[i.zoomOut[o]] = -e;
        },
        _addHooks: function() {
          H(document, "keydown", this._onKeyDown, this);
        },
        _removeHooks: function() {
          pe(document, "keydown", this._onKeyDown, this);
        },
        _onKeyDown: function(e) {
          if (!(e.altKey || e.ctrlKey || e.metaKey)) {
            var t = e.keyCode, i = this._map, o;
            if (t in this._panKeys) {
              if (!i._panAnim || !i._panAnim._inProgress)
                if (o = this._panKeys[t], e.shiftKey && (o = V(o).multiplyBy(3)), i.options.maxBounds && (o = i._limitOffset(V(o), i.options.maxBounds)), i.options.worldCopyJump) {
                  var s = i.wrapLatLng(i.unproject(i.project(i.getCenter()).add(o)));
                  i.panTo(s);
                } else
                  i.panBy(o);
            } else if (t in this._zoomKeys)
              i.setZoom(i.getZoom() + (e.shiftKey ? 3 : 1) * this._zoomKeys[t]);
            else if (t === 27 && i._popup && i._popup.options.closeOnEscapeKey)
              i.closePopup();
            else
              return;
            ie(e);
          }
        }
      });
      oe.addInitHook("addHandler", "keyboard", Co), oe.mergeOptions({
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
      var Mo = W.extend({
        addHooks: function() {
          H(this._map._container, "wheel", this._onWheelScroll, this), this._delta = 0;
        },
        removeHooks: function() {
          pe(this._map._container, "wheel", this._onWheelScroll, this);
        },
        _onWheelScroll: function(e) {
          var t = b(e), i = this._map.options.wheelDebounceTime;
          this._delta += t, this._lastMousePos = this._map.mouseEventToContainerPoint(e), this._startTime || (this._startTime = +/* @__PURE__ */ new Date());
          var o = Math.max(i - (+/* @__PURE__ */ new Date() - this._startTime), 0);
          clearTimeout(this._timer), this._timer = setTimeout(J(this._performZoom, this), o), ie(e);
        },
        _performZoom: function() {
          var e = this._map, t = e.getZoom(), i = this._map.options.zoomSnap || 0;
          e._stop();
          var o = this._delta / (this._map.options.wheelPxPerZoomLevel * 4), s = 4 * Math.log(2 / (1 + Math.exp(-Math.abs(o)))) / Math.LN2, c = i ? Math.ceil(s / i) * i : s, d = e._limitZoom(t + (this._delta > 0 ? c : -c)) - t;
          this._delta = 0, this._startTime = null, d && (e.options.scrollWheelZoom === "center" ? e.setZoom(t + d) : e.setZoomAround(this._lastMousePos, t + d));
        }
      });
      oe.addInitHook("addHandler", "scrollWheelZoom", Mo);
      var ga = 600;
      oe.mergeOptions({
        // @section Touch interaction options
        // @option tapHold: Boolean
        // Enables simulation of `contextmenu` event, default is `true` for mobile Safari.
        tapHold: I.touchNative && I.safari && I.mobile,
        // @option tapTolerance: Number = 15
        // The max number of pixels a user can shift his finger during touch
        // for it to be considered a valid tap.
        tapTolerance: 15
      });
      var zo = W.extend({
        addHooks: function() {
          H(this._map._container, "touchstart", this._onDown, this);
        },
        removeHooks: function() {
          pe(this._map._container, "touchstart", this._onDown, this);
        },
        _onDown: function(e) {
          if (clearTimeout(this._holdTimeout), e.touches.length === 1) {
            var t = e.touches[0];
            this._startPos = this._newPos = new M(t.clientX, t.clientY), this._holdTimeout = setTimeout(J(function() {
              this._cancel(), this._isTapValid() && (H(document, "touchend", Ze), H(document, "touchend touchcancel", this._cancelClickPrevent), this._simulateEvent("contextmenu", t));
            }, this), ga), H(document, "touchend touchcancel contextmenu", this._cancel, this), H(document, "touchmove", this._onMove, this);
          }
        },
        _cancelClickPrevent: function e() {
          pe(document, "touchend", Ze), pe(document, "touchend touchcancel", e);
        },
        _cancel: function() {
          clearTimeout(this._holdTimeout), pe(document, "touchend touchcancel contextmenu", this._cancel, this), pe(document, "touchmove", this._onMove, this);
        },
        _onMove: function(e) {
          var t = e.touches[0];
          this._newPos = new M(t.clientX, t.clientY);
        },
        _isTapValid: function() {
          return this._newPos.distanceTo(this._startPos) <= this._map.options.tapTolerance;
        },
        _simulateEvent: function(e, t) {
          var i = new MouseEvent(e, {
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
          i._simulated = !0, t.target.dispatchEvent(i);
        }
      });
      oe.addInitHook("addHandler", "tapHold", zo), oe.mergeOptions({
        // @section Touch interaction options
        // @option touchZoom: Boolean|String = *
        // Whether the map can be zoomed by touch-dragging with two fingers. If
        // passed `'center'`, it will zoom to the center of the view regardless of
        // where the touch events (fingers) were. Enabled for touch-capable web
        // browsers.
        touchZoom: I.touch,
        // @option bounceAtZoomLimits: Boolean = true
        // Set it to false if you don't want the map to zoom beyond min/max zoom
        // and then bounce back when pinch-zooming.
        bounceAtZoomLimits: !0
      });
      var Eo = W.extend({
        addHooks: function() {
          j(this._map._container, "leaflet-touch-zoom"), H(this._map._container, "touchstart", this._onTouchStart, this);
        },
        removeHooks: function() {
          q(this._map._container, "leaflet-touch-zoom"), pe(this._map._container, "touchstart", this._onTouchStart, this);
        },
        _onTouchStart: function(e) {
          var t = this._map;
          if (!(!e.touches || e.touches.length !== 2 || t._animatingZoom || this._zooming)) {
            var i = t.mouseEventToContainerPoint(e.touches[0]), o = t.mouseEventToContainerPoint(e.touches[1]);
            this._centerPoint = t.getSize()._divideBy(2), this._startLatLng = t.containerPointToLatLng(this._centerPoint), t.options.touchZoom !== "center" && (this._pinchStartLatLng = t.containerPointToLatLng(i.add(o)._divideBy(2))), this._startDist = i.distanceTo(o), this._startZoom = t.getZoom(), this._moved = !1, this._zooming = !0, t._stop(), H(document, "touchmove", this._onTouchMove, this), H(document, "touchend touchcancel", this._onTouchEnd, this), Ze(e);
          }
        },
        _onTouchMove: function(e) {
          if (!(!e.touches || e.touches.length !== 2 || !this._zooming)) {
            var t = this._map, i = t.mouseEventToContainerPoint(e.touches[0]), o = t.mouseEventToContainerPoint(e.touches[1]), s = i.distanceTo(o) / this._startDist;
            if (this._zoom = t.getScaleZoom(s, this._startZoom), !t.options.bounceAtZoomLimits && (this._zoom < t.getMinZoom() && s < 1 || this._zoom > t.getMaxZoom() && s > 1) && (this._zoom = t._limitZoom(this._zoom)), t.options.touchZoom === "center") {
              if (this._center = this._startLatLng, s === 1)
                return;
            } else {
              var c = i._add(o)._divideBy(2)._subtract(this._centerPoint);
              if (s === 1 && c.x === 0 && c.y === 0)
                return;
              this._center = t.unproject(t.project(this._pinchStartLatLng, this._zoom).subtract(c), this._zoom);
            }
            this._moved || (t._moveStart(!0, !1), this._moved = !0), Pe(this._animRequest);
            var d = J(t._move, t, this._center, this._zoom, { pinch: !0, round: !1 }, void 0);
            this._animRequest = Se(d, this, !0), Ze(e);
          }
        },
        _onTouchEnd: function() {
          if (!this._moved || !this._zooming) {
            this._zooming = !1;
            return;
          }
          this._zooming = !1, Pe(this._animRequest), pe(document, "touchmove", this._onTouchMove, this), pe(document, "touchend touchcancel", this._onTouchEnd, this), this._map.options.zoomAnimation ? this._map._animateZoom(this._center, this._map._limitZoom(this._zoom), !0, this._map.options.zoomSnap) : this._map._resetView(this._center, this._map._limitZoom(this._zoom));
        }
      });
      oe.addInitHook("addHandler", "touchZoom", Eo), oe.BoxZoom = Lo, oe.DoubleClickZoom = To, oe.Drag = So, oe.Keyboard = Co, oe.ScrollWheelZoom = Mo, oe.TapHold = zo, oe.TouchZoom = Eo, a.Bounds = m, a.Browser = I, a.CRS = ge, a.Canvas = wo, a.Circle = io, a.CircleMarker = An, a.Class = je, a.Control = Qe, a.DivIcon = go, a.DivOverlay = wt, a.DomEvent = Jn, a.DomUtil = Lt, a.Draggable = ft, a.Evented = xt, a.FeatureGroup = St, a.GeoJSON = Mt, a.GridLayer = sn, a.Handler = W, a.Icon = Ai, a.ImageOverlay = Rn, a.LatLng = X, a.LatLngBounds = y, a.Layer = mt, a.LayerGroup = Oi, a.LineUtil = Ko, a.Map = oe, a.Marker = On, a.Mixin = ue, a.Path = Wt, a.Point = M, a.PolyUtil = ce, a.Polygon = Ii, a.Polyline = Ct, a.Popup = Vn, a.PosAnimation = Mn, a.Projection = Yo, a.Rectangle = Po, a.Renderer = zt, a.SVG = ln, a.SVGOverlay = vo, a.TileLayer = Zi, a.Tooltip = Dn, a.Transformation = Vi, a.Util = Bt, a.VideoOverlay = _o, a.bind = J, a.bounds = T, a.canvas = xo, a.circle = oa, a.circleMarker = na, a.control = ri, a.divIcon = pa, a.extend = Z, a.featureGroup = ea, a.geoJSON = mo, a.geoJson = ra, a.gridLayer = fa, a.icon = ta, a.imageOverlay = la, a.latLng = $, a.latLngBounds = ee, a.layerGroup = Qo, a.map = Xn, a.marker = ia, a.point = V, a.polygon = sa, a.polyline = aa, a.popup = da, a.rectangle = va, a.setOptions = he, a.stamp = K, a.svg = ko, a.svgOverlay = ca, a.tileLayer = yo, a.tooltip = ha, a.transformation = Zt, a.version = re, a.videoOverlay = ua;
      var ya = window.L;
      a.noConflict = function() {
        return window.L = ya, this;
      }, window.L = a;
    }));
  })(cn, cn.exports)), cn.exports;
}
var Ia = Aa();
const R = /* @__PURE__ */ Ea(Ia), Ro = (me, g) => Wn.global.t(me, {});
function Gt(me) {
  const g = String(me?.message || me || "");
  return /connection refused|Unavailable|actively refused|dial tcp|ECONNREFUSED|LIFE is unavailable|life unavailable|502|503/i.test(g) ? Ro("life.kit.notReady") : g || Ro("life.kit.actionFailed");
}
const Ho = (me) => new Promise((g) => setTimeout(g, me)), Wo = 3200;
async function Et(me, g = {}) {
  let a = null;
  for (let re = 0; re < 3; re++)
    try {
      const Z = await fetch("/api/life/companion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: me, payload: g })
      });
      if (!Z.ok) throw Error(await Z.text() || String(Z.status));
      return await Z.json().catch(() => ({}));
    } catch (Z) {
      a = Z;
      const ae = /connection refused|Unavailable|actively refused|dial tcp|ECONNREFUSED|502|503|life unavailable/i.test(String(Z?.message || Z));
      if (re < 2 && ae) {
        await Ho(1200);
        continue;
      }
      throw Z;
    }
  throw a;
}
async function Vo(me = "/api/life/companion") {
  const g = await fetch(me);
  if (!g.ok) throw Error(await g.text() || String(g.status));
  return g.json();
}
function Go(me) {
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
function Ba(me, g) {
  if (typeof document > "u" || document.getElementById(me)) return;
  const a = document.createElement("style");
  a.id = me, a.textContent = g, document.head.appendChild(a);
}
const Za = { class: "lsp" }, Na = { class: "hero" }, Ra = { class: "hero-main" }, Va = { class: "hero-copy" }, Da = { class: "sub" }, $a = { class: "hero-actions" }, Ua = ["disabled"], Fa = { class: "state-row" }, Ha = { class: "pill soft" }, Wa = { class: "pill soft" }, Ga = { class: "pill soft" }, ja = {
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
}, es = { class: "adapter-row" }, ts = { class: "pill muted" }, is = {
  class: "meta",
  style: { "margin-top": "6px" }
}, ns = { class: "pill soft" }, os = { class: "meta" }, as = {
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
}, Zs = ["disabled"], Do = "life-plugin-adapters-style", Ns = /* @__PURE__ */ Uo({
  __name: "AdapterSettingsPage",
  setup(me) {
    const { confirm: g } = Fo(), a = (m, T) => Wn.global.t(m, T ?? {}), re = G(!0), Z = G(""), ae = G("");
    function J(m) {
      ae.value = m, setTimeout(() => {
        ae.value === m && (ae.value = "");
      }, Wo);
    }
    const Fe = G([]), K = G([]), Ae = G([]), we = G(!1), de = G(null), B = G(xe()), Xe = G(null);
    function xe() {
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
    function he(m) {
      return K.value.find((T) => T.id === m) || { id: m };
    }
    function jt(m) {
      const T = he(m.id);
      return m.enabled ? T.connected ? { label: a("life.adapters.stateConnected", { n: T.clients || 0 }), tone: "ok" } : T.running ? {
        label: a(m.direction === "connect" ? "life.adapters.stateConnecting" : "life.adapters.stateWaiting"),
        tone: "wait"
      } : { label: T.error ? a("life.adapters.stateFailed") : a("life.adapters.stateIdle"), tone: "bad" } : { label: a("life.adapters.stateDisabled"), tone: "muted" };
    }
    A(() => Ae.value.filter((m) => m.implemented).map((m) => m.id));
    const Ot = A(() => Ae.value.filter((m) => !m.implemented).map((m) => m.id));
    async function ut() {
      re.value = !0, Z.value = "";
      try {
        const [m, T, y] = await Promise.all([
          Et("adapter_list"),
          Et("adapter_platforms"),
          Et("adapter_routes_get")
        ]);
        Fe.value = m?.instances || [], K.value = m?.runtime || [], Ae.value = T?.platforms || [], $e.value = (y?.routes || []).map(di), Se.value = y?.default_config_id || "default", B.value = { ...xe(), ws_port: He() };
      } catch (m) {
        Z.value = Gt(m);
      } finally {
        re.value = !1;
      }
    }
    function He() {
      const m = new Set(Fe.value.map((y) => Number(y.ws_port) || 0));
      let T = 6199;
      for (; m.has(T) && T < 65535; ) T += 1;
      return T;
    }
    async function qt() {
      de.value = "", B.value = {
        ...xe(),
        ws_port: He()
      }, await Hn(), Xe.value?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    async function At(m) {
      de.value = m.id, B.value = {
        ...xe(),
        ...m,
        trigger_keywords: Array.isArray(m.trigger_keywords) ? m.trigger_keywords.join(",") : m.trigger_keywords || ""
      }, await Hn(), Xe.value?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    async function Kt() {
      we.value = !0;
      try {
        const m = { ...B.value };
        m.id && !m.ws_token && delete m.ws_token, m.id && !m.access_token && delete m.access_token, m.trigger_keywords = String(m.trigger_keywords || "").split(",").map((X) => X.trim()).filter(Boolean);
        const T = Number(m.ws_port);
        m.ws_port === "" || m.ws_port === null || m.ws_port === void 0 ? delete m.ws_port : T > 0 ? m.ws_port = T : delete m.ws_port, m.id || delete m.id;
        const y = await Et("adapter_upsert", { instance: m });
        if (y && y.ok === !1) throw Error(y.error || a("life.adapters.saveFailed"));
        y?.sync?.failed?.includes(y?.instance?.id) && m.enabled ? J(a("life.adapters.savedUnlistened")) : J(m.enabled === !1 ? a("life.adapters.savedDisabled") : a("life.adapters.savedListening")), de.value = null, await ut();
      } catch (m) {
        Z.value = Gt(m);
      } finally {
        we.value = !1;
      }
    }
    async function Yt(m) {
      we.value = !0;
      try {
        await Et("adapter_toggle", { id: m.id, enabled: !m.enabled }), J(m.enabled ? a("life.adapters.toggledDisabled", { name: m.name }) : a("life.adapters.toggledEnabled", { name: m.name })), await ut();
      } catch (T) {
        Z.value = Gt(T);
      } finally {
        we.value = !1;
      }
    }
    async function ci(m) {
      if (await g({
        title: a("life.adapters.deleteTitle"),
        message: a("life.adapters.deleteMessage", { name: m.name }),
        confirmLabel: a("life.adapters.delete"),
        danger: !0
      })) {
        we.value = !0;
        try {
          await Et("adapter_delete", { id: m.id }), J(a("life.adapters.deleted")), de.value === m.id && (de.value = null), await ut();
        } catch (y) {
          Z.value = Gt(y);
        } finally {
          we.value = !1;
        }
      }
    }
    async function It() {
      we.value = !0;
      try {
        const T = (await Et("adapter_sync"))?.failed || [];
        J(T.length ? a("life.adapters.resyncFailed", { count: T.length, names: T.join(a("life.adapters.listSeparator")) }) : a("life.adapters.resynced")), await ut();
      } catch (m) {
        Z.value = Gt(m);
      } finally {
        we.value = !1;
      }
    }
    const $e = G([]), Se = G("default"), Pe = G({ pattern: "*", config_id: "default" }), Bt = G(!1);
    let je = 0;
    function di(m) {
      return { ...m, _key: `rule-${++je}` };
    }
    const Ue = (m) => ({ pattern: m.pattern, config_id: m.config_id });
    function xt() {
      const m = String(Pe.value.pattern || "").trim();
      if (!m) {
        Z.value = a("life.adapters.routePatternRequired");
        return;
      }
      $e.value = [...$e.value, di({ pattern: m, config_id: String(Pe.value.config_id || "default").trim() || "default" })], Pe.value = { pattern: "*", config_id: "default" }, Z.value = "";
    }
    function M(m) {
      $e.value = $e.value.filter((T, y) => y !== m);
    }
    function _t(m, T) {
      const y = [...$e.value], ee = m + T;
      if (ee < 0 || ee >= y.length) return;
      const [X] = y.splice(m, 1);
      y.splice(ee, 0, X), $e.value = y;
    }
    async function V() {
      Bt.value = !0;
      try {
        await Et("adapter_routes_set", {
          routes: $e.value.map(Ue),
          default_config_id: String(Se.value || "default").trim() || "default"
        }), J(a("life.adapters.routesSaved"));
      } catch (m) {
        Z.value = Gt(m);
      } finally {
        Bt.value = !1;
      }
    }
    if (typeof document < "u" && !document.getElementById(Do)) {
      const m = document.createElement("style");
      m.id = Do, m.textContent = Go("lsp") + `
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
    return Fn(ut), (m, T) => (_(), v("main", Za, [
      n("header", Na, [
        n("div", Ra, [
          n("div", Va, [
            T[17] || (T[17] = n(
              "p",
              { class: "eyebrow" },
              [
                n("b", null, "●"),
                N(" L.I.F.E · MESSAGING PLATFORMS")
              ],
              -1
              /* CACHED */
            )),
            n(
              "h1",
              null,
              r(a("life.adapters.title")),
              1
              /* TEXT */
            ),
            n("p", Da, [
              N(
                r(a("life.adapters.subtitleBefore")),
                1
                /* TEXT */
              ),
              n(
                "b",
                null,
                r(a("life.adapters.subtitleServer")),
                1
                /* TEXT */
              ),
              N(
                r(a("life.adapters.subtitleAfter")),
                1
                /* TEXT */
              )
            ])
          ]),
          n("div", $a, [
            n("button", {
              class: "fab",
              disabled: we.value || re.value,
              onClick: It
            }, [
              T[18] || (T[18] = n(
                "span",
                {
                  class: "fab-ic",
                  "aria-hidden": "true"
                },
                "↻",
                -1
                /* CACHED */
              )),
              N(
                r(we.value ? a("life.adapters.processing") : a("life.adapters.relisten")),
                1
                /* TEXT */
              )
            ], 8, Ua)
          ])
        ]),
        n("div", Fa, [
          n(
            "span",
            Ha,
            r(a("life.adapters.adapterCount", { n: Fe.value.length })),
            1
            /* TEXT */
          ),
          n(
            "span",
            Wa,
            r(a("life.adapters.enabledCount", { n: Fe.value.filter((y) => y.enabled).length })),
            1
            /* TEXT */
          ),
          n(
            "span",
            Ga,
            r(a("life.adapters.connectedCount", { n: K.value.filter((y) => y.connected).length })),
            1
            /* TEXT */
          )
        ])
      ]),
      Z.value ? (_(), v(
        "p",
        ja,
        r(Z.value),
        1
        /* TEXT */
      )) : E("v-if", !0),
      ae.value ? (_(), v(
        "p",
        qa,
        r(ae.value),
        1
        /* TEXT */
      )) : E("v-if", !0),
      re.value ? (_(), v(
        "p",
        Ka,
        r(a("life.adapters.loadingConfig")),
        1
        /* TEXT */
      )) : E("v-if", !0),
      re.value ? E("v-if", !0) : (_(), v(
        Q,
        { key: 3 },
        [
          n("article", Ya, [
            n("h3", null, [
              N(
                r(a("life.adapters.adaptersHeading")) + " ",
                1
                /* TEXT */
              ),
              n(
                "span",
                Ja,
                r(Fe.value.length),
                1
                /* TEXT */
              ),
              n(
                "button",
                {
                  class: "btn filled sm",
                  style: { "margin-left": "auto" },
                  onClick: qt
                },
                r(a("life.adapters.addAdapter")),
                1
                /* TEXT */
              )
            ]),
            Fe.value.length ? (_(), v("ol", Qa, [
              (_(!0), v(
                Q,
                null,
                Te(Fe.value, (y) => (_(), v("li", {
                  key: y.id
                }, [
                  n("div", es, [
                    n(
                      "strong",
                      null,
                      r(y.name || y.id),
                      1
                      /* TEXT */
                    ),
                    n(
                      "span",
                      {
                        class: Y(["pill", jt(y).tone])
                      },
                      r(jt(y).label),
                      3
                      /* TEXT, CLASS */
                    ),
                    n(
                      "span",
                      ts,
                      r(y.platform),
                      1
                      /* TEXT */
                    )
                  ]),
                  n("div", is, [
                    n(
                      "span",
                      ns,
                      r(y.direction === "connect" ? a("life.adapters.directionConnect") : a("life.adapters.directionReverse")),
                      1
                      /* TEXT */
                    ),
                    N(
                      " " + r(y.direction === "connect" ? a("life.adapters.connectingTo", { target: `${y.ws_host}:${y.ws_port}${y.ws_path || ""}` }) : a("life.adapters.listening", { host: y.ws_host, port: y.ws_port })) + " · " + r(a("life.adapters.personaInline")) + " ",
                      1
                      /* TEXT */
                    ),
                    n(
                      "code",
                      null,
                      r(y.config_id),
                      1
                      /* TEXT */
                    ),
                    y.http_url ? (_(), v(
                      Q,
                      { key: 0 },
                      [
                        N(
                          " · HTTP " + r(y.http_url),
                          1
                          /* TEXT */
                        )
                      ],
                      64
                      /* STABLE_FRAGMENT */
                    )) : E("v-if", !0)
                  ]),
                  n("div", os, [
                    n(
                      "span",
                      {
                        class: Y({ "token-warn": !y.has_ws_token && y.ws_host === "0.0.0.0" })
                      },
                      r(y.has_ws_token ? a("life.adapters.tokenSet") : a("life.adapters.tokenUnset")),
                      3
                      /* TEXT, CLASS */
                    ),
                    y.trigger_keywords && y.trigger_keywords.length ? (_(), v(
                      Q,
                      { key: 0 },
                      [
                        N(
                          " · " + r(a("life.adapters.triggerWords")) + " " + r(y.trigger_keywords.join(a("life.adapters.listSeparator"))),
                          1
                          /* TEXT */
                        )
                      ],
                      64
                      /* STABLE_FRAGMENT */
                    )) : E("v-if", !0)
                  ]),
                  he(y.id).error ? (_(), v(
                    "p",
                    as,
                    r(a("life.adapters.listenError", { error: he(y.id).error })),
                    1
                    /* TEXT */
                  )) : E("v-if", !0),
                  n("div", ss, [
                    n("button", {
                      class: "btn sm",
                      disabled: we.value,
                      onClick: (ee) => Yt(y)
                    }, r(y.enabled ? a("life.adapters.disable") : a("life.adapters.enable")), 9, rs),
                    n("button", {
                      class: "btn sm",
                      onClick: (ee) => At(y)
                    }, r(a("life.adapters.edit")), 9, ls),
                    n("button", {
                      class: "btn sm danger",
                      disabled: we.value,
                      onClick: (ee) => ci(y)
                    }, r(a("life.adapters.delete")), 9, us)
                  ])
                ]))),
                128
                /* KEYED_FRAGMENT */
              ))
            ])) : (_(), v(
              "p",
              Xa,
              r(a("life.adapters.emptyAdapters")),
              1
              /* TEXT */
            ))
          ]),
          Oe(Ca, { name: "lsp-fade" }, {
            default: Bo(() => [
              de.value !== null ? (_(), v(
                "article",
                {
                  key: 0,
                  ref_key: "editorEl",
                  ref: Xe,
                  class: "card"
                },
                [
                  n(
                    "h3",
                    null,
                    r(B.value.id ? a("life.adapters.editAdapterTitle") : a("life.adapters.addAdapterTitle")),
                    1
                    /* TEXT */
                  ),
                  n("div", cs, [
                    n("label", null, [
                      n(
                        "span",
                        null,
                        r(a("life.adapters.platformCategory")),
                        1
                        /* TEXT */
                      ),
                      Oe(Ve(De), {
                        modelValue: B.value.platform,
                        "onUpdate:modelValue": T[0] || (T[0] = (y) => B.value.platform = y),
                        options: Ae.value.map((y) => ({ value: y.id, label: y.id + (y.implemented ? "" : a("life.adapters.notImplemented")) }))
                      }, null, 8, ["modelValue", "options"])
                    ]),
                    n("label", null, [
                      n(
                        "span",
                        null,
                        r(a("life.adapters.direction")),
                        1
                        /* TEXT */
                      ),
                      Oe(Ve(De), {
                        modelValue: B.value.direction,
                        "onUpdate:modelValue": T[1] || (T[1] = (y) => B.value.direction = y),
                        options: [
                          { value: "reverse", label: a("life.adapters.directionReverse") },
                          { value: "connect", label: a("life.adapters.directionConnect") }
                        ]
                      }, null, 8, ["modelValue", "options"])
                    ]),
                    n("label", null, [
                      n(
                        "span",
                        null,
                        r(a("life.adapters.botName")),
                        1
                        /* TEXT */
                      ),
                      P(n(
                        "input",
                        {
                          "onUpdate:modelValue": T[2] || (T[2] = (y) => B.value.name = y),
                          class: "field",
                          placeholder: "napcat"
                        },
                        null,
                        512
                        /* NEED_PATCH */
                      ), [
                        [C, B.value.name]
                      ])
                    ]),
                    n("label", null, [
                      n(
                        "span",
                        null,
                        r(a("life.adapters.wsHost")),
                        1
                        /* TEXT */
                      ),
                      P(n(
                        "input",
                        {
                          "onUpdate:modelValue": T[3] || (T[3] = (y) => B.value.ws_host = y),
                          class: "field",
                          placeholder: "0.0.0.0"
                        },
                        null,
                        512
                        /* NEED_PATCH */
                      ), [
                        [C, B.value.ws_host]
                      ])
                    ]),
                    n("label", null, [
                      n(
                        "span",
                        null,
                        r(a("life.adapters.wsPort")),
                        1
                        /* TEXT */
                      ),
                      P(n(
                        "input",
                        {
                          "onUpdate:modelValue": T[4] || (T[4] = (y) => B.value.ws_port = y),
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
                          C,
                          B.value.ws_port,
                          void 0,
                          { number: !0 }
                        ]
                      ])
                    ]),
                    B.value.direction === "connect" ? (_(), v("label", ds, [
                      n(
                        "span",
                        null,
                        r(a("life.adapters.wsPath")),
                        1
                        /* TEXT */
                      ),
                      P(n("input", {
                        "onUpdate:modelValue": T[5] || (T[5] = (y) => B.value.ws_path = y),
                        class: "field",
                        placeholder: a("life.adapters.wsPathPlaceholder")
                      }, null, 8, hs), [
                        [C, B.value.ws_path]
                      ])
                    ])) : E("v-if", !0),
                    n("label", null, [
                      n(
                        "span",
                        null,
                        r(a("life.adapters.wsToken")),
                        1
                        /* TEXT */
                      ),
                      P(n("input", {
                        "onUpdate:modelValue": T[6] || (T[6] = (y) => B.value.ws_token = y),
                        class: "field",
                        type: "password",
                        placeholder: a("life.adapters.wsTokenPlaceholder")
                      }, null, 8, ps), [
                        [C, B.value.ws_token]
                      ])
                    ]),
                    n("label", null, [
                      n(
                        "span",
                        null,
                        r(a("life.adapters.httpUrl")),
                        1
                        /* TEXT */
                      ),
                      P(n("input", {
                        "onUpdate:modelValue": T[7] || (T[7] = (y) => B.value.http_url = y),
                        class: "field",
                        placeholder: a("life.adapters.httpUrlPlaceholder")
                      }, null, 8, fs), [
                        [C, B.value.http_url]
                      ])
                    ]),
                    n("label", null, [
                      n(
                        "span",
                        null,
                        r(a("life.adapters.accessToken")),
                        1
                        /* TEXT */
                      ),
                      P(n("input", {
                        "onUpdate:modelValue": T[8] || (T[8] = (y) => B.value.access_token = y),
                        class: "field",
                        placeholder: a("life.adapters.accessTokenPlaceholder")
                      }, null, 8, ms), [
                        [C, B.value.access_token]
                      ])
                    ]),
                    n("label", null, [
                      n(
                        "span",
                        null,
                        r(a("life.adapters.configFile")),
                        1
                        /* TEXT */
                      ),
                      P(n(
                        "input",
                        {
                          "onUpdate:modelValue": T[9] || (T[9] = (y) => B.value.config_id = y),
                          class: "field",
                          placeholder: "default"
                        },
                        null,
                        512
                        /* NEED_PATCH */
                      ), [
                        [C, B.value.config_id]
                      ])
                    ]),
                    n("label", null, [
                      n(
                        "span",
                        null,
                        r(a("life.adapters.triggerKeywordsInherit")),
                        1
                        /* TEXT */
                      ),
                      P(n("input", {
                        "onUpdate:modelValue": T[10] || (T[10] = (y) => B.value.trigger_keywords = y),
                        class: "field",
                        placeholder: a("life.adapters.triggerKeywordsPlaceholder")
                      }, null, 8, _s), [
                        [C, B.value.trigger_keywords]
                      ])
                    ])
                  ]),
                  n(
                    "p",
                    vs,
                    r(a("life.adapters.directionHint")),
                    1
                    /* TEXT */
                  ),
                  n("label", gs, [
                    P(n(
                      "input",
                      {
                        "onUpdate:modelValue": T[11] || (T[11] = (y) => B.value.enabled = y),
                        type: "checkbox"
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [fe, B.value.enabled]
                    ]),
                    n(
                      "span",
                      null,
                      r(a("life.adapters.enableThisAdapter")),
                      1
                      /* TEXT */
                    )
                  ]),
                  n("label", ys, [
                    P(n(
                      "input",
                      {
                        "onUpdate:modelValue": T[12] || (T[12] = (y) => B.value.observe_group = y),
                        type: "checkbox"
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [fe, B.value.observe_group]
                    ]),
                    n(
                      "span",
                      null,
                      r(a("life.adapters.observeGroup")),
                      1
                      /* TEXT */
                    )
                  ]),
                  Ot.value.length ? (_(), v(
                    "p",
                    bs,
                    r(a("life.adapters.pendingPlatforms", { names: Ot.value.join(a("life.adapters.listSeparator")) })),
                    1
                    /* TEXT */
                  )) : E("v-if", !0),
                  n("div", ws, [
                    n("button", {
                      class: "btn filled sm",
                      disabled: we.value,
                      onClick: Kt
                    }, r(we.value ? a("life.adapters.saving") : a("life.adapters.save")), 9, xs),
                    n(
                      "button",
                      {
                        class: "btn sm",
                        onClick: T[13] || (T[13] = (y) => de.value = null)
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
          n("article", ks, [
            n(
              "h3",
              null,
              r(a("life.adapters.routesTitle")),
              1
              /* TEXT */
            ),
            n("p", Ps, [
              N(
                r(a("life.adapters.routesHintBefore")),
                1
                /* TEXT */
              ),
              n(
                "b",
                null,
                r(a("life.adapters.routesHintOrder")),
                1
                /* TEXT */
              ),
              N(
                r(a("life.adapters.routesHintAfterOrder")),
                1
                /* TEXT */
              ),
              T[19] || (T[19] = n(
                "code",
                null,
                "*",
                -1
                /* CACHED */
              )),
              N(
                r(a("life.adapters.routesHintMatchAll")),
                1
                /* TEXT */
              ),
              n(
                "code",
                null,
                r(a("life.adapters.routeRegexExample")),
                1
                /* TEXT */
              ),
              N(
                r(a("life.adapters.routesHintAnd")),
                1
                /* TEXT */
              ),
              n(
                "code",
                null,
                r(a("life.adapters.routePrefixExample")),
                1
                /* TEXT */
              ),
              N(
                r(a("life.adapters.routesHintTail")),
                1
                /* TEXT */
              ),
              T[20] || (T[20] = n(
                "code",
                null,
                "/sid",
                -1
                /* CACHED */
              )),
              N(
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
              default: Bo(() => [
                (_(!0), v(
                  Q,
                  null,
                  Te($e.value, (y, ee) => (_(), v("li", {
                    key: y._key,
                    class: "rule-row"
                  }, [
                    n(
                      "span",
                      Ls,
                      r(ee + 1),
                      1
                      /* TEXT */
                    ),
                    n(
                      "code",
                      null,
                      r(y.pattern),
                      1
                      /* TEXT */
                    ),
                    n(
                      "span",
                      Ts,
                      "→ " + r(y.config_id),
                      1
                      /* TEXT */
                    ),
                    n("span", Ss, [
                      n("button", {
                        class: "btn sm",
                        disabled: ee === 0,
                        "aria-label": a("life.adapters.moveUp"),
                        title: a("life.adapters.moveUp"),
                        onClick: (X) => _t(ee, -1)
                      }, "↑", 8, Cs),
                      n("button", {
                        class: "btn sm",
                        disabled: ee === $e.value.length - 1,
                        "aria-label": a("life.adapters.moveDown"),
                        title: a("life.adapters.moveDown"),
                        onClick: (X) => _t(ee, 1)
                      }, "↓", 8, Ms),
                      n("button", {
                        class: "btn sm danger",
                        "aria-label": a("life.adapters.delete"),
                        onClick: (X) => M(ee)
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
            $e.value.length ? E("v-if", !0) : (_(), v(
              "p",
              Es,
              r(a("life.adapters.emptyRoutes")),
              1
              /* TEXT */
            )),
            n("div", Os, [
              n("label", null, [
                n(
                  "span",
                  null,
                  r(a("life.adapters.sessionPattern")) + "*",
                  1
                  /* TEXT */
                ),
                P(n("input", {
                  "onUpdate:modelValue": T[14] || (T[14] = (y) => Pe.value.pattern = y),
                  class: "field",
                  placeholder: a("life.adapters.sessionPatternPlaceholder")
                }, null, 8, As), [
                  [C, Pe.value.pattern]
                ])
              ]),
              n("label", null, [
                n(
                  "span",
                  null,
                  r(a("life.adapters.configFile")),
                  1
                  /* TEXT */
                ),
                P(n(
                  "input",
                  {
                    "onUpdate:modelValue": T[15] || (T[15] = (y) => Pe.value.config_id = y),
                    class: "field",
                    placeholder: "default"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [C, Pe.value.config_id]
                ])
              ])
            ]),
            n("div", Is, [
              n(
                "button",
                {
                  class: "btn sm",
                  onClick: xt
                },
                r(a("life.adapters.addRule")),
                1
                /* TEXT */
              ),
              n("label", Bs, [
                n(
                  "span",
                  null,
                  r(a("life.adapters.defaultConfig")),
                  1
                  /* TEXT */
                ),
                P(n(
                  "input",
                  {
                    "onUpdate:modelValue": T[16] || (T[16] = (y) => Se.value = y),
                    class: "field",
                    placeholder: "default"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [C, Se.value]
                ])
              ]),
              n("button", {
                class: "btn filled sm",
                disabled: Bt.value,
                onClick: V
              }, r(Bt.value ? a("life.adapters.saving") : a("life.adapters.saveRoutes")), 9, Zs)
            ])
          ])
        ],
        64
        /* STABLE_FRAGMENT */
      ))
    ]));
  }
}), Rs = { class: "hero" }, Vs = { class: "hero-main" }, Ds = { class: "hero-copy" }, $s = { class: "sub" }, Us = { class: "hero-actions" }, Fs = ["disabled"], Hs = ["disabled"], Ws = ["disabled"], Gs = { class: "state-row" }, js = { class: "pill soft" }, qs = { class: "pill soft" }, Ks = { class: "pill soft" }, Ys = {
  key: 0,
  class: "banner err"
}, Js = {
  key: 1,
  class: "banner ok"
}, Xs = ["aria-label"], Qs = ["onClick"], er = { class: "tab-ic" }, tr = {
  "data-panel": "persona",
  class: "panel"
}, ir = { class: "section-head" }, nr = { class: "desc" }, or = { class: "head-actions" }, ar = ["disabled"], sr = ["disabled"], rr = { class: "card" }, lr = { class: "settings-grid" }, ur = { class: "pfield" }, cr = { class: "pfield" }, dr = { class: "pfield" }, hr = { class: "pfield" }, pr = { class: "hint" }, fr = {
  key: 0,
  class: "card"
}, mr = { class: "count-pill ok" }, _r = { class: "settings-grid" }, vr = { class: "hint" }, gr = {
  key: 0,
  class: "hint"
}, yr = { class: "settings-grid" }, br = { class: "settings-grid" }, wr = { class: "pdetails" }, xr = {
  class: "settings-grid",
  style: { "margin-top": "10px" }
}, kr = { class: "settings-grid" }, Pr = ["value"], Lr = { class: "hint" }, Tr = {
  key: 2,
  class: "hint"
}, Sr = { class: "settings-grid" }, Cr = ["value"], Mr = { class: "hint" }, zr = {
  key: 4,
  class: "hint"
}, Er = { class: "settings-grid" }, Or = ["value"], Ar = { class: "hint" }, Ir = {
  key: 6,
  class: "hint"
}, Br = {
  "data-panel": "cognition",
  class: "panel"
}, Zr = { class: "section-head" }, Nr = { class: "desc" }, Rr = { class: "head-actions" }, Vr = ["disabled"], Dr = { class: "card" }, $r = { class: "settings-grid" }, Ur = { class: "cog-metric" }, Fr = { class: "cog-metric" }, Hr = { class: "cog-metric" }, Wr = { class: "cog-metric" }, Gr = { class: "cog-metric" }, jr = { class: "cog-metric" }, qr = {
  key: 0,
  class: "hint"
}, Kr = {
  key: 1,
  class: "hint"
}, Yr = {
  key: 2,
  class: "hint"
}, Jr = { style: { display: "flex", gap: "12px", "align-items": "center", "flex-wrap": "wrap", "margin-top": "10px" } }, Xr = { class: "sw" }, Qr = ["disabled"], el = { class: "hint" }, tl = { class: "card" }, il = {
  key: 0,
  class: "count-pill sync-pill"
}, nl = {
  key: 0,
  class: "empty"
}, ol = { class: "sub-label" }, al = { class: "hint" }, sl = { class: "at-a-glance" }, rl = ["aria-label"], ll = { class: "plot-label plot-n" }, ul = { class: "plot-label plot-s" }, cl = { class: "plot-label plot-w" }, dl = { class: "plot-label plot-e" }, hl = {
  class: "mood-plot",
  viewBox: "0 0 120 120",
  "aria-hidden": "true"
}, pl = ["cx", "cy"], fl = ["cx", "cy"], ml = { class: "plot-quadrant" }, _l = { class: "glance-col" }, vl = { class: "glance-title" }, gl = ["title"], yl = { class: "gauge-head" }, bl = { class: "gauge-name" }, wl = { class: "gauge-alias" }, xl = { class: "gauge-val" }, kl = { class: "gauge-effect" }, Pl = { class: "glance-col" }, Ll = { class: "glance-title" }, Tl = ["title"], Sl = { class: "gauge-head" }, Cl = { class: "gauge-name" }, Ml = { class: "gauge-alias" }, zl = { class: "gauge-val" }, El = { class: "gauge-effect" }, Ol = { class: "sub-label" }, Al = { class: "hint" }, Il = { class: "gauge-grid" }, Bl = ["title"], Zl = { class: "gauge-head" }, Nl = { class: "gauge-name" }, Rl = { class: "gauge-alias" }, Vl = { class: "gauge-val" }, Dl = { class: "gauge-effect" }, $l = {
  key: 0,
  class: "som-channels"
}, Ul = { class: "som-chan-name" }, Fl = { class: "som-chan-bar" }, Hl = { class: "som-chan-val" }, Wl = {
  key: 0,
  class: "hint"
}, Gl = { class: "sub-label" }, jl = { class: "hint" }, ql = { class: "gauge-grid" }, Kl = ["title"], Yl = { class: "gauge-head" }, Jl = { class: "gauge-name" }, Xl = { class: "gauge-alias" }, Ql = { class: "gauge-val" }, eu = { class: "gauge-effect" }, tu = { class: "chip-row" }, iu = { class: "chip muted" }, nu = { class: "chip muted" }, ou = { class: "sub-label" }, au = { class: "hint" }, su = { class: "chip-row" }, ru = { class: "chip" }, lu = { class: "chip muted" }, uu = { class: "chip muted" }, cu = { class: "gauge-grid" }, du = ["title"], hu = { class: "gauge-head" }, pu = { class: "gauge-name" }, fu = { class: "gauge-alias" }, mu = { class: "gauge-val" }, _u = { class: "gauge-effect" }, vu = { class: "sub-label" }, gu = { class: "hint" }, yu = { class: "chip-row" }, bu = { class: "chip" }, wu = { class: "gauge-grid" }, xu = ["title"], ku = { class: "gauge-head" }, Pu = { class: "gauge-name" }, Lu = { class: "gauge-alias" }, Tu = { class: "gauge-val" }, Su = { class: "gauge-effect" }, Cu = { class: "sub-label" }, Mu = { class: "hint" }, zu = { class: "chip-row" }, Eu = { class: "chip" }, Ou = { class: "chip muted" }, Au = { class: "gauge-grid" }, Iu = ["title"], Bu = { class: "gauge-head" }, Zu = { class: "gauge-name" }, Nu = { class: "gauge-alias" }, Ru = { class: "gauge-val" }, Vu = { class: "gauge-effect" }, Du = { class: "sub-label" }, $u = { class: "hint" }, Uu = { class: "chip-row" }, Fu = { class: "chip" }, Hu = { class: "chip muted" }, Wu = {
  key: 0,
  class: "chip muted"
}, Gu = {
  key: 1,
  class: "chip warn"
}, ju = { class: "gauge-grid" }, qu = ["title"], Ku = { class: "gauge-head" }, Yu = { class: "gauge-name" }, Ju = { class: "gauge-alias" }, Xu = { class: "gauge-val" }, Qu = { class: "gauge-effect" }, ec = { class: "pdetails" }, tc = {
  class: "settings-grid",
  style: { "margin-top": "10px" }
}, ic = {
  key: 0,
  class: "cog-metric"
}, nc = {
  key: 1,
  class: "cog-metric"
}, oc = {
  key: 2,
  class: "cog-metric"
}, ac = {
  key: 3,
  class: "cog-metric"
}, sc = {
  key: 4,
  class: "cog-metric"
}, rc = {
  key: 5,
  class: "cog-metric"
}, lc = {
  key: 6,
  class: "cog-metric"
}, uc = {
  key: 7,
  class: "cog-metric"
}, cc = { class: "pdetails" }, dc = {
  class: "settings-grid",
  style: { "margin-top": "10px" }
}, hc = { class: "cog-metric" }, pc = { class: "cog-metric" }, fc = { class: "cog-metric" }, mc = { class: "cog-metric" }, _c = { class: "cog-metric" }, vc = { class: "cog-metric" }, gc = { class: "cog-metric" }, yc = { class: "cog-metric" }, bc = { class: "cog-metric" }, wc = { class: "cog-metric" }, xc = { class: "cog-metric" }, kc = { class: "cog-metric" }, Pc = {
  key: 0,
  class: "cog-metric"
}, Lc = {
  key: 2,
  class: "hint"
}, Tc = {
  key: 3,
  class: "hint"
}, Sc = {
  key: 4,
  class: "hint"
}, Cc = {
  key: 5,
  class: "hint"
}, Mc = {
  key: 6,
  class: "hint"
}, zc = { class: "card" }, Ec = { class: "switches" }, Oc = { class: "sw" }, Ac = { class: "sw" }, Ic = { class: "sw" }, Bc = { class: "sw" }, Zc = { class: "sw" }, Nc = { class: "sw" }, Rc = { class: "hint" }, Vc = { class: "card" }, Dc = { class: "hint" }, $c = { class: "preset-row" }, Uc = ["onClick"], Fc = { class: "grid2" }, Hc = { class: "card" }, Wc = { class: "settings-grid" }, Gc = { class: "switches" }, jc = { class: "sw" }, qc = { class: "sw" }, Kc = { class: "sw" }, Yc = { class: "sw" }, Jc = { class: "sw" }, Xc = { class: "card" }, Qc = { class: "settings-grid" }, ed = { class: "sw" }, td = { class: "sw" }, id = { class: "sw" }, nd = { class: "card" }, od = { class: "settings-grid" }, ad = { class: "sw" }, sd = { class: "card" }, rd = { class: "settings-grid" }, ld = { class: "sw" }, ud = { class: "card" }, cd = { class: "settings-grid" }, dd = { class: "sw" }, hd = { class: "card" }, pd = { class: "hint" }, fd = { class: "sw" }, md = { class: "settings-grid" }, _d = { class: "hint" }, vd = { class: "card" }, gd = { class: "hint" }, yd = { class: "sw" }, bd = { class: "settings-grid" }, wd = { class: "hint" }, xd = { class: "card" }, kd = { class: "hint" }, Pd = { class: "sw" }, Ld = { class: "settings-grid" }, Td = { class: "hint" }, Sd = { class: "card" }, Cd = { class: "hint" }, Md = { class: "sw" }, zd = { class: "settings-grid" }, Ed = { class: "hint" }, Od = { class: "hint" }, Ad = { class: "card" }, Id = { class: "hint" }, Bd = { class: "switches" }, Zd = { class: "sw" }, Nd = { class: "sw" }, Rd = { class: "sw" }, Vd = { class: "sw" }, Dd = {
  "data-panel": "world",
  class: "panel"
}, $d = { class: "section-head" }, Ud = { class: "desc" }, Fd = { class: "head-actions" }, Hd = { class: "card" }, Wd = { class: "settings-grid" }, Gd = { class: "hint" }, jd = { class: "card" }, qd = { class: "hint" }, Kd = { class: "world-field" }, Yd = { class: "world-label" }, Jd = ["placeholder"], Xd = { class: "card" }, Qd = { class: "hint" }, eh = { class: "settings-grid" }, th = ["placeholder"], ih = ["placeholder"], nh = ["placeholder"], oh = { class: "world-field" }, ah = { class: "world-label" }, sh = ["placeholder"], rh = { class: "world-field" }, lh = { class: "world-label" }, uh = ["placeholder"], ch = { class: "world-field" }, dh = { class: "world-label" }, hh = ["placeholder"], ph = { class: "world-actions" }, fh = ["disabled"], mh = ["disabled"], _h = { class: "hint" }, vh = { class: "card" }, gh = { class: "wm-head" }, yh = { class: "count-pill" }, bh = {
  key: 0,
  class: "wm-place"
}, wh = {
  key: 0,
  class: "hint wm-premise"
}, xh = { class: "wm-map-wrap" }, kh = {
  key: 0,
  class: "wm-offline"
}, Ph = {
  key: 1,
  class: "wm-compass",
  "aria-hidden": "true"
}, Lh = {
  key: 1,
  class: "empty"
}, Th = {
  key: 2,
  class: "wm-legend"
}, Sh = {
  key: 3,
  class: "wm-routes"
}, Ch = {
  key: 0,
  class: "wm-routes-col"
}, Mh = {
  key: 1,
  class: "wm-routes-col"
}, zh = { class: "card" }, Eh = { class: "wm-head" }, Oh = { class: "count-pill" }, Ah = { class: "feed" }, Ih = { class: "meta" }, Bh = {
  key: 0,
  class: "empty"
}, Zh = {
  "data-panel": "adapters",
  class: "panel"
}, Nh = {
  "data-panel": "state",
  class: "panel"
}, Rh = { class: "section-head" }, Vh = { class: "desc" }, Dh = { class: "card" }, $h = { class: "count-pill" }, Uh = { class: "hint" }, Fh = { class: "feed" }, Hh = { class: "rel-head" }, Wh = { class: "meta" }, Gh = { class: "rel-track-row" }, jh = { class: "rel-track-label" }, qh = ["aria-label"], Kh = { class: "rel-stage-name" }, Yh = ["title"], Jh = { class: "gauge-head" }, Xh = { class: "gauge-name" }, Qh = { class: "gauge-alias" }, ep = { class: "gauge-val" }, tp = { class: "gauge-bar signed" }, ip = { class: "gauge-effect" }, np = {
  key: 0,
  class: "rel-mode"
}, op = { class: "chip" }, ap = { class: "meta" }, sp = {
  key: 0,
  class: "empty"
}, rp = { class: "card" }, lp = { class: "count-pill" }, up = { class: "hint" }, cp = { class: "feed" }, dp = { class: "meta" }, hp = {
  key: 0,
  class: "empty"
}, pp = { class: "grid2" }, fp = { class: "card" }, mp = { class: "hint" }, _p = { class: "feed" }, vp = { class: "meta" }, gp = { class: "meta" }, yp = { class: "meta" }, bp = {
  key: 0,
  class: "empty"
}, wp = { class: "card" }, xp = { class: "hint" }, kp = { class: "feed" }, Pp = { class: "value-name" }, Lp = { class: "value-bar" }, Tp = { class: "value-num" }, Sp = {
  key: 0,
  class: "empty"
}, Cp = { class: "section" }, Mp = { class: "section-head" }, zp = { class: "desc" }, Ep = { class: "grid2" }, Op = { class: "card" }, Ap = { class: "hint" }, Ip = {
  class: "hint",
  style: { "margin-top": "10px" }
}, Bp = { style: { "margin-top": "14px", display: "flex", gap: "10px", "flex-wrap": "wrap" } }, Zp = ["disabled"], $o = 0.15, Np = "https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}", Rp = /* @__PURE__ */ Uo({
  __name: "CompanionPage",
  setup(me) {
    const { confirm: g } = Fo(), a = (h, u) => Wn.global.t(h, u ?? {});
    za();
    const re = (h) => Wn.global.t(h, {}, { locale: "zh" }), Z = (h) => h.map((u) => ({ value: re(`life.companion.${u}`), label: a(`life.companion.${u}`) })), ae = G({ settings: {}, cognition: null }), J = G(!1), Fe = G(""), K = G(""), Ae = G("cognition"), we = G(null), de = [
      { key: "cognition", i: "01", labelKey: "life.companion.nav.cognition", icon: "◉" },
      { key: "persona", i: "02", labelKey: "life.companion.nav.persona", icon: "✎" },
      { key: "world", i: "03", labelKey: "life.companion.nav.world", icon: "✦" },
      { key: "adapters", i: "04", labelKey: "life.companion.nav.adapters", icon: "✉" },
      { key: "state", i: "05", labelKey: "life.companion.nav.state", icon: "☺" }
    ];
    function B(h) {
      K.value = h, setTimeout(() => {
        K.value === h && (K.value = "");
      }, Wo);
    }
    async function Xe(h = 0) {
      J.value = !0, Fe.value = "";
      try {
        ae.value = await Vo("/api/life/companion"), Ki(), J.value = !1;
      } catch (u) {
        if (h < 4)
          return await Ho(1500), Xe(h + 1);
        Fe.value = Gt(u), J.value = !1;
      }
    }
    async function xe(h, u) {
      try {
        const l = await Et(h, u);
        return await Xe(), l;
      } catch (l) {
        return Fe.value = Gt(l), null;
      }
    }
    function he(h) {
      Ae.value = h;
      const u = matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", l = we.value;
      l ? l.scrollTo({ top: 0, behavior: u }) : window.scrollTo({ top: 0, behavior: u });
    }
    function jt(h) {
      const u = we.value?.querySelector(`section[data-panel="${h}"]`);
      u && (u.classList.remove("panel-replay"), u.offsetWidth, u.classList.add("panel-replay"), u.addEventListener("animationend", () => u.classList.remove("panel-replay"), { once: !0 }));
    }
    ui(Ae, (h) => {
      Hn(() => jt(h));
    }), ui(Ae, (h) => {
      h === "adapters" && Sn();
    });
    const Ot = {
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
        return re("life.companion.attach.dependent");
      },
      cog_tsundere_enabled: "0",
      get cog_tsundere_type() {
        return re("life.companion.tsundere.classic");
      },
      cog_yandere_enabled: "0",
      get cog_yandere_type() {
        return re("life.companion.yandere.mode.yandere");
      },
      cog_personadyn_enabled: "0",
      get cog_personadyn_type() {
        return re("life.companion.pdt.0");
      },
      get cog_personadyn_gender() {
        return re("life.companion.pdGender.unspecified");
      },
      cog_memory_encode: "1",
      cog_sleep_replay: "1",
      cog_memory_reconsolidate: "1",
      cog_cls_interleave: "1"
    }, ut = [
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
    ], He = ["cog_affect_profile", "cog_language_framing", "cog_attachment_type", "cog_tsundere_type", "cog_yandere_type", "cog_personadyn_type", "cog_personadyn_gender"], qt = A(() => Z(["attach.secluded", "attach.dependent", "attach.delusional", "attach.monitoring", "attach.selfHarm", "attach.exclusion"])), At = A(() => Z(["tsundere.classic", "tsundere.cold", "tsundere.gruff", "tsundere.indulgent"])), Kt = A(() => Z(["yandere.mode.yandere", "yandere.mode.tsundere", "yandere.mode.neutral", "yandere.mode.hybrid"])), Yt = [
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
    A(() => Yt.map((h, u) => ({ label: a(`life.companion.pdg.${u}`), keys: h })));
    const ci = A(() => [...new Set(Yt.flat())].map((h) => ({ value: re(`life.companion.${h}`), label: a(`life.companion.${h}`) }))), It = A(() => Z(["pdGender.unspecified", "pdGender.maleScript", "pdGender.femaleScript", "pdGender.neutral", "pdGender.highTradMale", "pdGender.lowTradMale", "pdGender.highTradFemale", "pdGender.feminist"])), $e = A(() => ["typical", "depression", "anxiety", "bpd", "alexithymia"].map((h) => ({ value: h, label: a(`life.companion.profile.${h}`) }))), Se = A(() => [
      "independent",
      "interchanging",
      "cognitive_determinism",
      "weak_whorf",
      "thinking_for_speaking",
      "radical_connectionism",
      "determinism"
    ].map((h) => ({ value: h, label: a(`life.companion.framing.${h}`) }))), Pe = ["egocentric", "subjective", "self-reflective", "mutual", "societal-symbolic"], Bt = A(() => Pe.map((h, u) => ({ value: String(u), label: a(`life.companion.stage.${h}`) }))), je = A({
      get: () => String(Number(w.value.cog_social_stage ?? 2)),
      set: (h) => {
        w.value.cog_social_stage = Number(h);
      }
    });
    function di(h) {
      return String(ae.value.settings?.[h] ?? Ot[h] ?? "");
    }
    function Ue() {
      const h = {};
      for (const [u, l] of Object.entries(Ot)) {
        const O = di(u) || l;
        h[u] = ut.includes(u) ? O === "1" : He.includes(u) ? O : Number(O);
      }
      return h;
    }
    function xt() {
      const h = {};
      for (const [u, l] of Object.entries(Ot)) {
        const O = w.value[u];
        ut.includes(u) ? h[u] = O ? "1" : "0" : h[u] = String(O ?? l);
      }
      return h;
    }
    const M = A(() => ae.value.cognition || null), _t = A(() => M.value?.last_control || null), V = A(() => M.value?.wave1 || null), m = A(() => M.value?.wave2 || null), T = A(() => M.value?.wave3 || null), y = A(() => M.value?.wave4a || null), ee = A(() => M.value?.wave4b || null), X = A(() => M.value?.persona || null), $ = A(() => M.value?.attachment || null), ge = A(() => M.value?.tsundere || null), Be = A(() => M.value?.yandere || null), F = A(() => M.value?.personadyn || null), Ri = A(() => {
      const h = F.value?.big5;
      return h ? ["o_open", "c_conscientious", "e_extravert", "a_agreeable", "n_neurotic"].map((l) => Le(h[l], 2)).join(" · ") : "—";
    }), Vi = A(() => {
      const h = F.value?.hexaco;
      return h ? ["h_honesty", "hex_e", "hex_x", "hex_a", "hex_c", "hex_o"].map((l) => Le(h[l], 2)).join(" · ") : "—";
    });
    function Zt(h, u = 3) {
      return h ? Object.entries(h).filter(([, l]) => typeof l == "number").sort((l, O) => O[1] - l[1]).slice(0, u).map(([l, O]) => `${vn(l)} ${Le(O, 2)}`) : [];
    }
    const hi = A(() => Zt(F.value?.desires, 3)), dn = A(() => Zt(F.value?.emotions, 3)), hn = A(() => {
      const h = F.value?.learning?.theta_drift;
      return h ? Object.values(h).reduce((u, l) => u + Math.abs(l || 0), 0) : 0;
    }), ct = A(() => m.value?.episode || null), Di = (h) => {
      const u = { euthymic: "life.companion.episode.euthymic", subthreshold: "life.companion.episode.subthreshold", episode: "life.companion.episode.episode" };
      return u[h] ? a(u[h]) : "—";
    }, ye = A(() => M.value?.life || null), vt = G(!1), pi = G("start"), Jt = G(!0);
    function pn() {
      const h = ye.value?.born_at;
      if (!h) return "—";
      const u = Date.now() - new Date(h).getTime();
      if (!isFinite(u) || u < 0) return "—";
      const l = Math.floor(u / 864e5), O = Math.floor(u % 864e5 / 36e5);
      return l > 0 ? a("life.companion.life.ageDaysHours", { days: l, hours: O }) : a("life.companion.life.ageHours", { hours: O });
    }
    function $i() {
      return pi.value === "start" ? a("life.companion.life.starting") : a("life.companion.life.pausing");
    }
    async function fn() {
      vt.value = !0, pi.value = "start";
      try {
        const h = await xe("life_start", { greet: Jt.value });
        h && B(h.greeting ? a("life.companion.flash.lifeStartedGreeting", { greeting: h.greeting }) : a("life.companion.flash.lifeStarted"));
      } finally {
        vt.value = !1;
      }
    }
    async function mn() {
      vt.value = !0, pi.value = "stop";
      try {
        await xe("life_stop", {}) && B(a("life.companion.flash.lifeStopped"));
      } finally {
        vt.value = !1;
      }
    }
    function Ui(h, u) {
      Object.assign(w.value, h), H().then(() => B(a("life.companion.flash.presetApplied", { label: u })));
    }
    const _n = [
      { labelKey: "life.companion.preset.regular", fields: { cog_affect_enabled: !0, cog_affect_profile: "typical", cog_affect_threat: 0.2, cog_affect_reward: 1, cog_attachment_enabled: !1, cog_tsundere_enabled: !1, cog_personadyn_enabled: !1 } },
      { labelKey: "life.companion.preset.depression", fields: { cog_affect_enabled: !0, cog_affect_profile: "depression", cog_affect_threat: 0.45, cog_affect_reward: 0.7 } },
      { labelKey: "life.companion.preset.tsundere", fields: { cog_tsundere_enabled: !0, cog_tsundere_type: re("life.companion.tsundere.classic") } },
      { labelKey: "life.companion.preset.personadyn", fields: { cog_personadyn_enabled: !0, cog_personadyn_type: re("life.companion.pdt.1") } },
      { labelKey: "life.companion.preset.yandereSecluded", fields: { cog_affect_enabled: !0, cog_affect_profile: "depression", cog_attachment_enabled: !0, cog_attachment_type: re("life.companion.attach.secluded") } },
      { labelKey: "life.companion.preset.yandereDependent", fields: { cog_affect_enabled: !0, cog_attachment_enabled: !0, cog_attachment_type: re("life.companion.attach.dependent") } },
      { labelKey: "life.companion.preset.yandereDelusional", fields: { cog_affect_enabled: !0, cog_affect_profile: "depression", cog_attachment_enabled: !0, cog_attachment_type: re("life.companion.attach.delusional") } }
    ], Fi = A(() => M.value?.wave2?.somatic_channels || null), vn = (h) => {
      const u = { fatigue: "channel.fatigue", pain: "channel.pain", cardiorespiratory: "channel.cardiorespiratory", gastrointestinal: "channel.gastrointestinal", dizziness: "channel.dizziness", sleep: "channel.sleep" };
      return u[h] ? a(`life.companion.${u[h]}`) : h;
    }, gn = (h) => Math.max(0.02, Math.min(1, Number(h))).toFixed(3), yn = A(() => {
      const h = X.value?.evidence || {};
      return Object.entries(h).map(([u, l]) => a("life.companion.evidencePair", { dim: u, words: l.join(a("life.companion.listSeparator")) })).join(a("life.companion.evidenceSeparator"));
    });
    function Le(h, u = 3) {
      return h == null || h === "" ? "—" : Number(h).toFixed(u);
    }
    const Xt = A(() => (ae.value.timeline || []).filter((h) => h.topic === re("life.companion.val.world")).slice(0, 30)), Qt = A(() => ae.value.commitments || []), Hi = A(() => ae.value.user_model || []), bn = A(() => Object.entries(ae.value.values || {}).map(([h, u]) => ({ k: h, v: Number(u) })).sort((h, u) => Math.abs(u.v) - Math.abs(h.v)).slice(0, 20));
    function kt(h) {
      try {
        const u = JSON.parse(h || "[]");
        return Array.isArray(u) ? u : [];
      } catch {
        return [];
      }
    }
    const fi = A(() => ae.value.emotion || null), Nt = A(() => ae.value.circadian || null), mi = A(() => ae.value.relationships || []), ei = (h) => Math.max(0, Math.min(1, h)), ti = A(() => {
      const h = fi.value || {}, u = Math.max(-1, Math.min(1, Number(h.valence) || 0)), l = ei(Number(h.arousal ?? 0.5));
      return { x: (10 + (u + 1) / 2 * 100).toFixed(1), y: (110 - l * 100).toFixed(1) };
    }), wn = A(() => {
      const h = fi.value;
      if (!h) return "life.companion.quadrant.serene";
      const u = Number(h.valence) >= 0, l = Number(h.arousal) >= 0.5;
      return u ? l ? "life.companion.quadrant.excited" : "life.companion.quadrant.serene" : l ? "life.companion.quadrant.tense" : "life.companion.quadrant.gloomy";
    }), xn = (h) => h <= -$o ? "lo" : h >= $o ? "hi" : "mid";
    function le(h, u, l, O) {
      const z = Number(l);
      if (!isFinite(z)) return null;
      const W = ei(z / O.max), ue = O.signed ? xn(z) : W < 0.34 ? "lo" : W < 0.67 ? "mid" : "hi", ke = {
        label: u,
        value: z,
        max: O.max,
        kind: O.kind,
        signed: !!O.signed,
        effect: a(`life.companion.effect.${h}`),
        display: Le(z, 2),
        alias: a(`life.companion.alias.${h}`),
        state: a(`life.companion.gw.${h}.${ue}`),
        stateTone: "mid"
      };
      return ke.stateTone = ke.signed ? ke.value >= 0 ? "good" : "bad" : ht(ke), ke;
    }
    function dt(h) {
      return ei(h.value / h.max);
    }
    function ht(h) {
      const u = dt(h);
      return h.kind === "neutral" ? "mid" : h.kind === "bad" ? u >= 0.67 ? "bad" : u < 0.34 ? "good" : "mid" : u >= 0.67 ? "good" : u < 0.34 ? "bad" : "mid";
    }
    function tt(h) {
      const u = ei(Math.abs(h)) * 50;
      return { width: `${u}%`, left: h >= 0 ? "50%" : `${50 - u}%` };
    }
    const it = (h) => h.filter((u) => u !== null), Gn = A(() => {
      const h = fi.value || {};
      return it([
        le("valence", a("life.companion.gauge.valence"), h.valence, { max: 1, kind: "neutral", signed: !0 }),
        le("arousal", a("life.companion.gauge.arousal"), h.arousal, { max: 1, kind: "neutral" }),
        le("connection", a("life.companion.gauge.connection"), h.connection, { max: 1, kind: "good" }),
        le("irritation", a("life.companion.gauge.irritation"), h.irritation, { max: 1, kind: "bad" })
      ]);
    }), jn = A(() => {
      const h = Nt.value || {};
      return it([
        le("energy", a("life.companion.body.energy"), h.mental_energy, { max: 100, kind: "good" }),
        le("hunger", a("life.companion.body.hunger"), h.hunger, { max: 100, kind: "bad" }),
        le("health", a("life.companion.body.health"), h.health, { max: 100, kind: "good" })
      ]);
    }), qn = A(() => it([
      le("mood", a("life.companion.gauge.mood"), m.value?.mood, { max: 1, kind: "neutral", signed: !0 }),
      le("vagal", a("life.companion.gauge.vagal"), m.value?.vagal_tone, { max: 1, kind: "good" }),
      le("somatization", a("life.companion.gauge.somatization"), m.value?.somatization_index, { max: 1, kind: "bad" }),
      le("healthAnxiety", a("life.companion.gauge.healthAnxiety"), m.value?.health_anxiety, { max: 1, kind: "bad" }),
      le("somaticBurden", a("life.companion.gauge.somaticBurden"), m.value?.somatic_burden, { max: 1, kind: "bad" }),
      le("allostatic", a("life.companion.gauge.allostatic"), m.value?.allostatic_load, { max: 1, kind: "bad" }),
      le("loneliness", a("life.companion.gauge.loneliness"), m.value?.loneliness, { max: 1, kind: "bad" })
    ])), Kn = A(() => it([
      le("empathy", a("life.companion.gauge.empathy"), y.value?.empathy, { max: 1, kind: "good" }),
      le("patience", a("life.companion.gauge.patience"), ee.value?.patience, { max: 1, kind: "good" })
    ])), nt = A(() => it([
      le("distress", a("life.companion.gauge.distress"), $.value?.distress, { max: 1, kind: "bad" }),
      le("comorbid", a("life.companion.gauge.comorbid"), $.value?.comorbid_depression, { max: 1, kind: "bad" })
    ])), I = A(() => it([
      le("affection", a("life.companion.gauge.affection"), ge.value?.affection, { max: 1, kind: "good" }),
      le("tsun", a("life.companion.gauge.tsun"), ge.value?.expression, { max: 1, kind: "neutral" }),
      le("fixation", a("life.companion.gauge.fixation"), ge.value?.fixation, { max: 1, kind: "bad" })
    ])), kn = A(() => it([
      le("jealousy", a("life.companion.gauge.jealousy"), Be.value?.jealousy, { max: 1, kind: "bad" }),
      le("intensity", a("life.companion.gauge.intensity"), Be.value?.intensity, { max: 1, kind: "neutral" }),
      le("darkness", a("life.companion.gauge.darkness"), Be.value?.darkness, { max: 1, kind: "bad" })
    ])), Pn = A(() => it([
      le("pdPressure", a("life.companion.gauge.pdPressure"), F.value?.pressure, { max: 1, kind: "bad" }),
      le("pdAffection", a("life.companion.gauge.pdAffection"), F.value?.affection, { max: 1, kind: "good" }),
      le("pdAnxiety", a("life.companion.gauge.pdAnxiety"), F.value?.anxiety, { max: 1, kind: "bad" }),
      le("pdPossession", a("life.companion.gauge.pdPossession"), F.value?.possessiveness, { max: 1, kind: "bad" }),
      le("pdTrust", a("life.companion.gauge.pdTrust"), F.value?.trust, { max: 1, kind: "good" }),
      le("pdSelfControl", a("life.companion.gauge.pdSelfControl"), F.value?.self_control, { max: 1, kind: "good" }),
      le("pdSuppression", a("life.companion.gauge.pdSuppression"), F.value?.suppression, { max: 1, kind: "bad" })
    ])), _i = ["警惕", "疏离", "陌生", "认识", "熟悉", "友好", "亲近", "亲密"], Wi = ["回避", "受伤", "放松", "活泼", "温暖", "亲近", "爱意"], vi = (h) => _i.includes(h) ? a(`life.companion.relStage.${h}`) : h || "—", Gi = (h) => _i.indexOf(h), Rt = (h) => Wi.includes(h) ? a(`life.companion.interaction.${h}`) : h || "—", Ln = (h) => Wi.includes(h) ? a(`life.companion.interactionEffect.${h}`) : "", w = G({}), gi = G("off"), Yn = A(() => [
      { value: "off", label: a("life.companion.worldDensity.off") },
      { value: "texture", label: a("life.companion.worldDensity.texture") },
      { value: "full", label: a("life.companion.worldDensity.full") }
    ]), yi = G("fictional"), ii = G(""), bi = G(""), Pt = G(""), wi = G(""), xi = G(""), ki = G(""), Pi = G(""), ot = G(!1), Vt = G(!1), ni = A(() => [
      { value: "fictional", label: a("life.companion.worldFictional.fictional") },
      { value: "real", label: a("life.companion.worldFictional.real") }
    ]), at = A(() => ae.value.worldview || null), te = A(() => at.value?.map || { locations: [], edges: [], actors: [], width: 1e3, height: 700, title: "" }), oi = A(() => at.value?.actor_locations || {}), se = ["home", "work", "shop", "food", "park", "transit", "other"], be = { home: "life.companion.kind.home", work: "life.companion.kind.work", shop: "life.companion.kind.shop", food: "life.companion.kind.food", park: "life.companion.kind.park", transit: "life.companion.kind.transit", other: "life.companion.kind.other" }, ai = { home: "#e07a5f", work: "#5b8def", shop: "#e0a23d", food: "#57a773", park: "#3faead", transit: "#8b6fd6", other: "#8a94a6" }, Dt = A(() => se.filter((h) => (te.value.locations || []).some((u) => (u.kind || "other") === h)));
    function Ce(h) {
      const u = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
      return String(h ?? "").replace(/[&<>"']/g, (l) => u[l]);
    }
    const $t = G(null), j = G(!1);
    let q = null, D = null, Ut = "";
    const We = ["#2b4250", "#33495a", "#2f4a44", "#3a4258", "#463f4f", "#3d4a3a", "#4a4436", "#39485c"], Tn = ["#dfe4ea", "#d6dce4", "#e6eaf0", "#cfd7e0"];
    let gt = "";
    const qe = G("city"), _e = {};
    function pt(h, u, l) {
      (_e[h] || (_e[h] = [])).push({ layer: u, base: l });
    }
    function Ke(h) {
      gt = gt === h ? "" : h;
      for (const [u, l] of Object.entries(_e)) {
        const O = u === gt;
        for (const { layer: z, base: W } of l)
          z.setStyle && z.setStyle({ ...W, weight: (W.weight || 2) + (O ? 3.5 : 0), opacity: O ? 1 : W.opacity ?? 1 }), O && z.bringToFront && z.bringToFront();
      }
    }
    function si() {
      gt = "", Ci(!1);
    }
    function ji() {
      qe.value = qe.value === "city" ? "nation" : "city", Ci(!1);
    }
    function yt() {
      return { w: te.value.width || 1e3, h: te.value.height || 700 };
    }
    function Ne(h, u) {
      return [yt().h - u, h];
    }
    function Ye(h, u) {
      return R.divIcon({ className: "wm-route", html: `<span class="wm-route-inner" style="--c:${u}">${Ce(h)}</span>`, iconSize: [0, 0], iconAnchor: [0, 0] });
    }
    function Li(h, u) {
      return R.divIcon({ className: "wm-route wm-minor", html: `<span class="wm-route-inner" style="--c:${u}">${Ce(h)}</span>`, iconSize: [0, 0], iconAnchor: [0, 0] });
    }
    function qi(h, u) {
      return R.divIcon({ className: "wm-route wm-station", html: `<span class="wm-route-inner" style="--c:${u}">${Ce(h)}</span>`, iconSize: [0, 0], iconAnchor: [0, 0] });
    }
    function Ti(h) {
      const u = [], l = [];
      for (const O of h) {
        const z = String(O.text).length * 13 + 20, W = 22;
        u.some((ke) => Math.abs(ke.x - O.x) < (ke.w + z) / 2 && Math.abs(ke.y - O.y) < (ke.h + W) / 2) || (u.push({ x: O.x, y: O.y, w: z, h: W }), l.push(O));
      }
      return l;
    }
    function Si() {
      const h = te.value.kind === "real" ? "real" : "fictional";
      if (q && Ut !== h && (q.remove(), q = null, D = null), !(q || !$t.value)) {
        if (h === "real") {
          j.value = !1, q = R.map($t.value, { zoomControl: !0, attributionControl: !0 }).setView([35, 105], 5);
          const u = R.tileLayer(Np, { subdomains: ["1", "2", "3", "4"], maxZoom: 19, minZoom: 3, attribution: a("life.companion.map.attribution") });
          u.on("tileerror", () => {
            j.value = !0;
          }), u.on("load", () => {
            j.value = !1;
          }), u.addTo(q);
        } else {
          j.value = !1;
          const { w: u, h: l } = yt();
          q = R.map($t.value, { crs: R.CRS.Simple, zoomControl: !0, attributionControl: !1, minZoom: -3, maxZoom: 3 }).setView([l / 2, u / 2], -1.5);
          for (const [z, W] of [["pWater", 350], ["pParks", 360], ["pBlocks", 370], ["pRoads", 380], ["pMetro", 400], ["pBus", 410], ["pLabels", 620]])
            q.createPane(z), q.getPane(z).style.zIndex = String(W);
          const O = () => q.getContainer().classList.toggle("wm-zoom-low", q.getZoom() < 0);
          q.on("zoomend", O), setTimeout(O, 0);
        }
        Ut = h, D = R.layerGroup().addTo(q);
      }
    }
    function Ci(h = !1) {
      if (!q || !D) return;
      D.clearLayers();
      for (const z of Object.keys(_e)) delete _e[z];
      gt = "";
      const u = te.value.locations || [];
      if (!u.length) return;
      const l = Ut !== "real", O = {};
      for (const z of u) O[z.id] = z;
      if (l) {
        const { w: z, h: W } = yt(), ue = (k) => k.map((ce) => Ne(ce[0], ce[1])), ke = te.value.nation;
        if (qe.value === "nation" && ke) {
          R.rectangle([[0, 0], [W, z]], { pane: "pWater", stroke: !1, fillColor: "#d9e6f0", fillOpacity: 1 }).addTo(D), R.polygon(ue(ke.land), { pane: "pWater", color: "#8fbfe6", weight: 1.5, fillColor: "#f4efe1", fillOpacity: 1 }).addTo(D), (ke.provinces || []).forEach((k, ce) => {
            R.polygon(ue(k.points), { pane: "pParks", color: "#c9b98f", weight: 1, fillColor: ce % 2 ? "#ece2c8" : "#e4d7b4", fillOpacity: 0.55 }).addTo(D), R.marker(ue([k.label])[0], { pane: "pLabels", interactive: !1, icon: Ye(k.name, "#8a7a5c") }).addTo(D);
          }), (ke.routes || []).forEach((k) => R.polyline(ue(k.points), { pane: "pRoads", color: "#b98a4a", weight: 2.5, dashArray: "2 7" }).addTo(D)), (ke.cities || []).forEach((k) => {
            const ce = Ne(k.x, k.y);
            R.circleMarker(ce, { pane: "pLabels", radius: k.capital ? 9 : 6, color: "#ffffff", weight: 2, fillColor: k.capital ? "#d64545" : "#3a6ea5", fillOpacity: 1 }).bindPopup(Ce(k.name)).addTo(D), R.marker(ce, { pane: "pLabels", interactive: !1, icon: Ye(k.name, k.capital ? "#d64545" : "#3a6ea5") }).addTo(D);
          }), q.fitBounds([[0, 0], [W, z]], { padding: [6, 6] });
          return;
        }
        R.rectangle([[0, 0], [W, z]], { pane: "pWater", stroke: !1, fillColor: "#eef1f4", fillOpacity: 1 }).addTo(D), (te.value.compounds || []).forEach((k) => {
          R.polygon(ue(k.points), { pane: "pParks", color: "#c9b98f", weight: 1.2, dashArray: "7 5", fillColor: "#f3ead0", fillOpacity: 0.5 }).addTo(D), R.marker(ue(k.points)[0], { pane: "pLabels", interactive: !1, icon: Ye(k.name, "#a9884a") }).addTo(D);
        }), (te.value.lakes || []).forEach((k) => {
          R.polygon(ue(k.points), { pane: "pWater", color: "#8fbfe6", weight: 1.5, fillColor: "#bcd9f0", fillOpacity: 1 }).addTo(D), k.name && k.name !== "" && R.marker(Ne(k.label[0], k.label[1]), { pane: "pLabels", interactive: !1, icon: Ye(k.name, "#3d7fb5") }).addTo(D);
        }), (te.value.rivers || []).forEach((k) => {
          R.polyline(ue(k.points), { pane: "pWater", color: "#8fbfe6", weight: 16, lineCap: "round", lineJoin: "round" }).addTo(D), R.polyline(ue(k.points), { pane: "pWater", color: "#bcd9f0", weight: 11, lineCap: "round", lineJoin: "round" }).addTo(D), k.name && k.name !== "" && R.marker(ue(k.points)[Math.floor(k.points.length / 2)], { pane: "pLabels", interactive: !1, icon: Ye(k.name, "#3d7fb5") }).addTo(D);
        }), (te.value.parks || []).forEach((k) => {
          R.polygon(ue(k.points), { pane: "pParks", color: "#a9d3a0", weight: 1, fillColor: "#c9e6c4", fillOpacity: 1 }).addTo(D), (k.trees || []).forEach((ce) => R.circleMarker(Ne(ce[0], ce[1]), { pane: "pParks", radius: 2.6, stroke: !1, fillColor: "#82bd79", fillOpacity: 1 }).addTo(D)), k.name && k.name !== re("life.companion.val.park") && R.marker(ue(k.points)[0], { pane: "pLabels", interactive: !1, icon: Ye(k.name, "#5a9e52") }).addTo(D);
        });
        const ft = [];
        (te.value.blocks || []).forEach((k) => {
          const ce = ue(k.points);
          if (R.polygon(ce.map((ve) => [ve[0] - 3, ve[1] + 3]), { pane: "pBlocks", stroke: !1, fillColor: "#5b6b7a", fillOpacity: 0.16 }).addTo(D), R.polygon(ce, { pane: "pBlocks", color: "#b9c3cd", weight: 1, fillColor: Tn[(k.shade || 0) % Tn.length], fillOpacity: 1 }).addTo(D), k.tower) {
            const ve = ce.reduce((ze, Ee) => ze + Ee[0], 0) / ce.length, Me = ce.reduce((ze, Ee) => ze + Ee[1], 0) / ce.length;
            R.polygon(
              ce.map((ze) => [ve + (ze[0] - ve) * 0.5, Me + (ze[1] - Me) * 0.5]),
              { pane: "pBlocks", color: "#aab4c0", weight: 1, fillColor: "#eef2f6", fillOpacity: 1 }
            ).addTo(D);
          }
          if (k.name) {
            const ve = k.points.reduce((ze, Ee) => ze + Ee[0], 0) / k.points.length, Me = k.points.reduce((ze, Ee) => ze + Ee[1], 0) / k.points.length;
            ft.push({ x: ve, y: Me, text: k.name, color: k.tower ? "#6b5b8a" : "#7a8794" });
          }
        }), (te.value.named_buildings || []).forEach((k) => {
          R.circleMarker(Ne(k.x, k.y), { pane: "pLabels", radius: 4, color: "#ffffff", weight: 1.5, fillColor: "#8a5a2b", fillOpacity: 1 }).addTo(D), R.marker(Ne(k.x, k.y), { pane: "pLabels", interactive: !1, icon: Ye(k.name, "#8a5a2b") }).addTo(D);
        });
        for (const k of Ti(ft))
          R.marker(Ne(k.x, k.y), { pane: "pLabels", interactive: !1, icon: Li(k.text, k.color) }).addTo(D);
        const tn = {
          highway: { casing: 13, fill: 6.5, color: "#f08c2e" },
          arterial: { casing: 10, fill: 4.5, color: "#f7cf8a" },
          street: { casing: 5, fill: 2.4, color: "#ffffff" }
        };
        (te.value.streets || []).forEach((k) => {
          const ce = tn[k.kind] || tn.street, ve = ue(k.points);
          R.polyline(ve, { pane: "pRoads", color: "#ffffff", weight: ce.casing, lineCap: "round", lineJoin: "round" }).addTo(D), R.polyline(ve, { pane: "pRoads", color: ce.color, weight: ce.fill, lineCap: "round", lineJoin: "round" }).addTo(D);
        }), (te.value.roads || []).forEach((k, ce) => {
          if (!k.name) return;
          const ve = ue(k.points), Me = "road:" + ce;
          R.polyline(ve, { pane: "pRoads", color: "#ffffff", weight: 11, lineCap: "round", lineJoin: "round" }).addTo(D);
          const ze = { pane: "pRoads", color: "#f6c56b", weight: 5, opacity: 1, lineCap: "round", lineJoin: "round" };
          pt(Me, R.polyline(ve, ze).on("click", () => Ke(Me)).addTo(D), ze), R.marker(ve[Math.floor(ve.length / 2)], { pane: "pLabels", interactive: !0, icon: Ye(k.name, "#9a8358") }).on("click", () => Ke(Me)).addTo(D);
        }), (te.value.districts || []).forEach((k, ce) => {
          R.circle(Ne(k.x, k.y), { pane: "pRoads", radius: k.r || 200, color: "#93a2b0", weight: 1, dashArray: "4 7", fillColor: We[ce % We.length], fillOpacity: 0.08 }).addTo(D), R.marker(Ne(k.x, k.y), { pane: "pLabels", interactive: !1, icon: R.divIcon({ className: "wm-district", html: `<span class="wm-district-inner">${Ce(k.name)}</span>`, iconSize: [0, 0], iconAnchor: [0, 0] }) }).addTo(D);
        });
        const nn = [];
        (te.value.metro || []).forEach((k, ce) => {
          const ve = ue(k.points), Me = "metro:" + ce;
          R.polyline(ve, { pane: "pMetro", color: "#ffffff", weight: 8, lineCap: "round", lineJoin: "round" }).addTo(D);
          const ze = { pane: "pMetro", color: k.color, weight: 4.5, opacity: 0.92, lineCap: "round", lineJoin: "round" };
          pt(Me, R.polyline(ve, ze).on("click", () => Ke(Me)).addTo(D), ze), (k.stations || []).forEach((Ee) => {
            R.circleMarker(Ne(Ee.x, Ee.y), { pane: "pMetro", radius: 5, color: "#ffffff", weight: 2.5, fillColor: k.color, fillOpacity: 1 }).bindPopup(Ce(Ee.name || k.name)).on("click", () => Ke(Me)).addTo(D), Ee.name && nn.push({ x: Ee.x, y: Ee.y, text: Ee.name, color: k.color });
          }), R.marker(ve[Math.floor(ve.length / 2)], { pane: "pLabels", interactive: !0, icon: Ye(k.name, k.color) }).on("click", () => Ke(Me)).addTo(D);
        }), (te.value.bus || []).forEach((k, ce) => {
          const ve = ue(k.points), Me = "bus:" + ce, ze = { pane: "pBus", color: k.color, weight: 3, opacity: 0.95, dashArray: "7 7", lineCap: "round" };
          pt(Me, R.polyline(ve, ze).on("click", () => Ke(Me)).addTo(D), ze), (k.stops || []).forEach((Ee) => R.circleMarker(Ne(Ee.x, Ee.y), { pane: "pBus", radius: 3.2, color: "#ffffff", weight: 1.5, fillColor: k.color, fillOpacity: 1 }).bindPopup(Ce(Ee.name || k.name)).on("click", () => Ke(Me)).addTo(D)), R.marker(ve[Math.floor(ve.length / 2)], { pane: "pLabels", interactive: !0, icon: Ye(k.name, k.color) }).on("click", () => Ke(Me)).addTo(D);
        });
        for (const k of Ti(nn))
          R.marker(Ne(k.x, k.y), { pane: "pLabels", interactive: !1, icon: qi(k.text, k.color) }).addTo(D);
      } else
        for (const z of te.value.edges || []) {
          const W = O[z[0]], ue = O[z[1]];
          W?.lat != null && ue?.lat != null && R.polyline([[W.lat, W.lng], [ue.lat, ue.lng]], { color: "#5b8def", weight: 3, opacity: 0.55, dashArray: "2 8", lineCap: "round" }).addTo(D);
        }
      for (const z of u) {
        const W = ai[z.kind] || ai.other, ue = l ? Ne(z.x, z.y) : z.lat != null ? [z.lat, z.lng] : null;
        if (!ue) continue;
        const ke = R.divIcon({
          className: "wm-pin-holder",
          html: `<span class="wm-pin" style="--c:${W}"></span><span class="wm-pin-label">${Ce(z.name)}</span>`,
          iconSize: [0, 0],
          iconAnchor: [0, 0]
        });
        R.marker(ue, { icon: ke }).bindPopup(`<b>${Ce(z.name)}</b>${z.desc ? "<br>" + Ce(z.desc) : ""}`).addTo(D);
      }
      for (const z of te.value.actors || []) {
        const W = O[oi.value[z.id] || z.location];
        if (!W) continue;
        const ue = l ? Ne(W.x, W.y) : W.lat != null ? [W.lat, W.lng] : null;
        if (!ue) continue;
        const ke = R.divIcon({
          className: "wm-actor-holder",
          html: `<span class="wm-actor-badge">${Ce((z.name || "?").slice(0, 1))}</span><span class="wm-actor-name">${Ce(z.name)}</span>`,
          iconSize: [0, 0],
          iconAnchor: [0, 0]
        });
        R.marker(ue, { icon: ke }).bindPopup(`${Ce(z.name)} · ${Ce(W.name)}`).addTo(D);
      }
      if (!h)
        if (l) {
          const { w: z, h: W } = yt();
          q.fitBounds([[0, 0], [W, z]], { padding: [0, 0] });
        } else {
          const z = u.filter((W) => W.lat != null).map((W) => [W.lat, W.lng]);
          z.length > 1 ? q.fitBounds(z, { padding: [56, 56], maxZoom: 15 }) : z.length === 1 && q.setView(z[0], 14);
        }
    }
    ui([Ae, () => ae.value.worldview], async () => {
      Ae.value === "world" && (await Hn(), Si(), Ci(), q && setTimeout(() => q.invalidateSize(), 80));
    }), Zo(() => {
      q && (q.remove(), q = null, D = null);
    });
    function Ki() {
      w.value = { ...Ue() }, gi.value = String(ae.value.settings?.world_density || "off"), yi.value = String(ae.value.settings?.world_fictional || "fictional"), ii.value = String(ae.value.settings?.world_country || ""), bi.value = String(ae.value.settings?.world_city || ""), Pt.value = String(ae.value.settings?.world_district || ""), wi.value = String(ae.value.settings?.world_premise || ""), xi.value = String(ae.value.settings?.persona_text || ""), ki.value = String(ae.value.settings?.world_actors || ""), Pi.value = String(ae.value.settings?.world_places || "");
    }
    const Lt = G(!1);
    async function H() {
      if (!Lt.value) {
        Lt.value = !0;
        try {
          const h = {
            ...xt(),
            world_density: gi.value,
            world_fictional: yi.value,
            world_country: ii.value,
            world_city: bi.value,
            world_district: Pt.value,
            world_premise: wi.value,
            world_actors: ki.value,
            world_places: Pi.value,
            persona_text: xi.value
          }, u = await xe("settings_set", { settings: h });
          u?.rejected?.length ? B(a("life.companion.flash.settingsSavedIgnored", { items: u.rejected.join(a("life.companion.listSeparator")) })) : B(a("life.companion.flash.settingsSaved"));
        } finally {
          Lt.value = !1;
        }
      }
    }
    const st = G([]), pe = G([]);
    G(!1);
    async function Sn() {
      const h = await xe("adapter_list", {});
      h && (st.value = h.instances || [], pe.value = h.runtime || []);
    }
    async function Yi() {
      if (!(ot.value || !await g({
        title: a("life.companion.world.rewriteTitle"),
        message: a("life.companion.world.rewriteMessage"),
        confirmLabel: a("life.companion.world.overwriteConfirm"),
        danger: !0
      }))) {
        ot.value = !0;
        try {
          (await xe("world_generate", { instructions: "" }))?.worldview && B(a("life.companion.flash.worldGenerated"));
        } finally {
          ot.value = !1;
        }
      }
    }
    async function Ji() {
      if (!ot.value) {
        ot.value = !0;
        try {
          (await xe("world_map_generate", { instructions: "" }))?.worldview && B(a("life.companion.flash.mapRegenerated"));
        } finally {
          ot.value = !1;
        }
      }
    }
    async function Xi() {
      if (!await g({
        title: a("life.companion.world.clearTitle"),
        message: a("life.companion.world.clearMessage"),
        confirmLabel: a("life.companion.world.clearConfirm"),
        danger: !0
      })) return;
      await xe("world_clear", {}) && B(a("life.companion.flash.worldCleared"));
    }
    async function Tt() {
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
        Vt.value = !0;
        try {
          await xe("reset_person", {}), B(a("life.companion.flash.personReset")), await Xe();
        } finally {
          Vt.value = !1;
        }
      }
    }
    const Ft = () => ({ name: "", avatar: "", birthDate: "", gender: "", description: "", personality: "", greeting: "", customPrompt: "" }), bt = A(() => [
      { value: "", label: a("life.companion.gender.none") },
      { value: "female", label: a("life.companion.gender.female") },
      { value: "male", label: a("life.companion.gender.male") },
      { value: "other", label: a("life.companion.gender.other") }
    ]);
    function Ze(h) {
      return (bt.value.find((u) => u.value === h) || bt.value[0]).label;
    }
    const ie = G(Ft()), Mi = G(!1);
    function Qi() {
      return globalThis.__0KAY_HOST__;
    }
    function Cn() {
      const h = Qi();
      if (h?.getPersona) {
        ie.value = { ...Ft(), ...h.getPersona() || {} };
        return;
      }
      try {
        const u = JSON.parse(localStorage.getItem("0kay_config") || "{}");
        ie.value = { ...Ft(), ...u.persona || {} };
      } catch {
        ie.value = Ft();
      }
    }
    const b = G(null), Ht = G(!1), Jn = A(() => [
      { value: "", label: a("life.companion.gender.undecidedBracket") },
      ...(b.value?.options?.character || []).map((h) => ({ value: h.key, label: h.label }))
    ]), Mn = A(() => [
      { value: "", label: a("life.companion.gender.undecidedBracket") },
      ...(b.value?.options?.relationship || []).map((h) => ({
        value: h.key,
        label: h.label + (h.pathological ? a("life.companion.relationship.pathologicalSuffix") : "")
      }))
    ]);
    function oe() {
      return { text: [ie.value.description, ie.value.personality].filter((h) => String(h || "").trim()).join(`
`) };
    }
    ui(() => [ie.value.description, ie.value.personality, ie.value.customPrompt], () => {
      b.value = null;
    });
    function Xn(h) {
      return (b.value?.options?.relationship || []).find((u) => u.key === h);
    }
    ui(() => b.value?.relationship?.key, (h) => {
      const u = b.value?.attachment;
      if (!u) return;
      const l = Xn(h);
      u.type = l?.pathological && l.attachment_type || "";
    }, { immediate: !0 }), ui(() => b.value?.attachment?.type, (h) => {
      const u = b.value?.attachment;
      if (!(!h || !u)) {
        (!u.initial || typeof u.initial != "object") && (u.initial = {});
        for (const [l, O] of Object.entries({ A: 0.05, Am: 0, Tr: 0.5, J: 0, X: 0.05, S: 0.6, O: 0 }))
          u.initial[l] == null && (u.initial[l] = O);
      }
    });
    async function Qe() {
      const h = oe();
      if (!h.text.trim()) {
        B(a("life.companion.flash.needDescriptionOrPersonality"));
        return;
      }
      Ht.value = !0;
      try {
        const u = await xe("persona_analyze", { text: h.text, gender: ie.value.gender });
        u && (b.value = u, b.value.personadynGender = u.personadyn?.gender || w.cog_personadyn_gender || re("life.companion.pdGender.unspecified"), !ie.value.gender && u.gender && (ie.value.gender = u.gender), B(u.source === "llm" ? a("life.companion.flash.analyzedLlm") : a("life.companion.flash.analyzedLocal")));
      } finally {
        Ht.value = !1;
      }
    }
    async function ri() {
      if (!b.value) {
        B(a("life.companion.flash.needLlmFirst"));
        return;
      }
      Mi.value = !0;
      try {
        const h = oe(), u = { ...b.value.traits || {} };
        if (u.gender = b.value.gender || ie.value.gender || null, u.character = b.value.character?.key || null, u.relationship = b.value.relationship?.key || null, u.expression = b.value.character?.expression || b.value.expression || null, delete u.axes, !await xe("persona_apply", {
          text: h.text,
          traits: u,
          attachment: b.value.attachment || {},
          tsundere: b.value.tsundere || {},
          personadyn: {
            ...b.value.personadyn || {},
            gender: b.value.personadynGender || w.cog_personadyn_gender || re("life.companion.pdGender.unspecified")
          }
        })) return;
        const O = Qi();
        if (O?.setPersona)
          O.setPersona({ ...ie.value }), O.saveConfig?.();
        else {
          const z = JSON.parse(localStorage.getItem("0kay_config") || "{}");
          z.persona = { ...z.persona || {}, ...ie.value }, localStorage.setItem("0kay_config", JSON.stringify(z));
        }
        B(a("life.companion.flash.personaSaved"));
      } finally {
        Mi.value = !1;
      }
    }
    Fn(Cn), ui(Ae, (h) => {
      h === "persona" && Cn();
    }), Fn(Xe);
    const zi = G("");
    let en;
    async function Ei() {
      if (document.visibilityState === "visible")
        try {
          ae.value = await Vo("/api/life/companion"), zi.value = (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        } catch {
        }
    }
    function zn() {
      document.visibilityState === "visible" && Ei();
    }
    return Fn(() => {
      en = setInterval(() => {
        Ei();
      }, 12e3), document.addEventListener("visibilitychange", zn);
    }), Zo(() => {
      en && clearInterval(en), document.removeEventListener("visibilitychange", zn);
    }), Ba("life-plugin-kit", Go("pcp")), (h, u) => (_(), v(
      "main",
      {
        class: "pcp",
        ref_key: "pageEl",
        ref: we
      },
      [
        n("header", Rs, [
          n("div", Vs, [
            n("div", Ds, [
              u[100] || (u[100] = n(
                "p",
                { class: "eyebrow" },
                [
                  n("b", null, "◉"),
                  N(" L.I.F.E / COGNITION")
                ],
                -1
                /* CACHED */
              )),
              n(
                "h1",
                null,
                r(a("life.companion.title")),
                1
                /* TEXT */
              ),
              n(
                "p",
                $s,
                r(a("life.companion.subtitle")),
                1
                /* TEXT */
              )
            ]),
            n("div", Us, [
              n("button", {
                class: Y(["btn", { tonic: !ye.value?.alive }]),
                disabled: vt.value || J.value,
                onClick: u[0] || (u[0] = (l) => ye.value?.alive ? mn() : fn())
              }, r(vt.value ? $i() : ye.value?.alive ? a("life.companion.life.pause") : a("life.companion.life.start")), 11, Fs),
              n("button", {
                class: "fab",
                disabled: Lt.value || J.value,
                onClick: H
              }, [
                u[101] || (u[101] = n(
                  "span",
                  { class: "fab-ic" },
                  "✦",
                  -1
                  /* CACHED */
                )),
                N(
                  r(Lt.value ? a("life.companion.saving") : a("life.companion.saveSettings")),
                  1
                  /* TEXT */
                )
              ], 8, Hs),
              n("button", {
                class: "btn tonic",
                disabled: J.value,
                onClick: Xe
              }, r(J.value ? a("life.companion.refreshing") : a("life.companion.refresh")), 9, Ws)
            ])
          ]),
          n("div", Gs, [
            n(
              "span",
              {
                class: Y(["pill", { bad: M.value && !M.value.enabled }])
              },
              r(a("life.companion.cognitionCore")) + " " + r(M.value?.available === !1 ? a("life.companion.status.unavailable") : M.value?.enabled ? a("life.companion.status.running") : a("life.companion.status.stopped")),
              3
              /* TEXT, CLASS */
            ),
            n(
              "span",
              js,
              r(a("life.companion.state.decidedTurns", { n: V.value?.turns ?? 0 })),
              1
              /* TEXT */
            ),
            n(
              "span",
              qs,
              r(a("life.companion.state.engrams", { n: V.value?.engrams ?? 0 })),
              1
              /* TEXT */
            ),
            n(
              "span",
              Ks,
              r(a("life.companion.state.lexicon", { n: T.value?.lexicon_size ?? 0 })),
              1
              /* TEXT */
            )
          ])
        ]),
        Fe.value ? (_(), v(
          "p",
          Ys,
          r(Fe.value),
          1
          /* TEXT */
        )) : E("v-if", !0),
        K.value ? (_(), v(
          "p",
          Js,
          r(K.value),
          1
          /* TEXT */
        )) : E("v-if", !0),
        n("nav", {
          class: "tabs",
          "aria-label": a("life.companion.view")
        }, [
          (_(), v(
            Q,
            null,
            Te(de, (l) => n("button", {
              key: l.key,
              class: Y(["tab", { active: Ae.value === l.key }]),
              onClick: (O) => he(l.key)
            }, [
              n(
                "i",
                null,
                r(l.i),
                1
                /* TEXT */
              ),
              n(
                "span",
                er,
                r(l.icon),
                1
                /* TEXT */
              ),
              N(
                r(a(l.labelKey)),
                1
                /* TEXT */
              )
            ], 10, Qs)),
            64
            /* STABLE_FRAGMENT */
          ))
        ], 8, Xs),
        P(n(
          "section",
          tr,
          [
            n("div", ir, [
              n("div", null, [
                n(
                  "h2",
                  null,
                  r(a("life.companion.persona.title")),
                  1
                  /* TEXT */
                ),
                n(
                  "p",
                  nr,
                  r(a("life.companion.persona.desc")),
                  1
                  /* TEXT */
                )
              ]),
              n("div", or, [
                n("button", {
                  class: "btn tonic sm",
                  disabled: Ht.value || J.value,
                  onClick: Qe
                }, r(Ht.value ? a("life.companion.persona.analyzing") : a("life.companion.persona.analyze")), 9, ar),
                n("button", {
                  class: "btn filled sm",
                  disabled: Mi.value || !b.value,
                  onClick: ri
                }, r(a("life.companion.persona.save")), 9, sr)
              ])
            ]),
            n("article", rr, [
              n("div", lr, [
                n("label", null, [
                  n(
                    "span",
                    null,
                    r(a("life.companion.persona.name")),
                    1
                    /* TEXT */
                  ),
                  P(n(
                    "input",
                    {
                      "onUpdate:modelValue": u[1] || (u[1] = (l) => ie.value.name = l),
                      class: "field"
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [C, ie.value.name]
                  ])
                ]),
                n("label", null, [
                  n(
                    "span",
                    null,
                    r(a("life.companion.persona.gender")),
                    1
                    /* TEXT */
                  ),
                  Oe(Ve(De), {
                    modelValue: ie.value.gender,
                    "onUpdate:modelValue": u[2] || (u[2] = (l) => ie.value.gender = l),
                    options: bt.value,
                    "aria-label": a("life.companion.persona.gender")
                  }, null, 8, ["modelValue", "options", "aria-label"])
                ]),
                n("label", null, [
                  n(
                    "span",
                    null,
                    r(a("life.companion.persona.avatarUrl")),
                    1
                    /* TEXT */
                  ),
                  P(n(
                    "input",
                    {
                      "onUpdate:modelValue": u[3] || (u[3] = (l) => ie.value.avatar = l),
                      class: "field"
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [C, ie.value.avatar]
                  ])
                ]),
                n("label", null, [
                  n(
                    "span",
                    null,
                    r(a("life.companion.persona.birthday")),
                    1
                    /* TEXT */
                  ),
                  P(n(
                    "input",
                    {
                      "onUpdate:modelValue": u[4] || (u[4] = (l) => ie.value.birthDate = l),
                      type: "date",
                      class: "field"
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [C, ie.value.birthDate]
                  ])
                ])
              ]),
              n("label", ur, [
                n(
                  "span",
                  null,
                  r(a("life.companion.persona.description")),
                  1
                  /* TEXT */
                ),
                P(n(
                  "textarea",
                  {
                    "onUpdate:modelValue": u[5] || (u[5] = (l) => ie.value.description = l),
                    rows: "3",
                    class: "field"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [C, ie.value.description]
                ])
              ]),
              n("label", cr, [
                n(
                  "span",
                  null,
                  r(a("life.companion.persona.personality")),
                  1
                  /* TEXT */
                ),
                P(n(
                  "textarea",
                  {
                    "onUpdate:modelValue": u[6] || (u[6] = (l) => ie.value.personality = l),
                    rows: "3",
                    class: "field"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [C, ie.value.personality]
                ])
              ]),
              n("label", dr, [
                n(
                  "span",
                  null,
                  r(a("life.companion.persona.greeting")),
                  1
                  /* TEXT */
                ),
                P(n(
                  "textarea",
                  {
                    "onUpdate:modelValue": u[7] || (u[7] = (l) => ie.value.greeting = l),
                    rows: "2",
                    class: "field"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [C, ie.value.greeting]
                ])
              ]),
              n("label", hr, [
                n(
                  "span",
                  null,
                  r(a("life.companion.persona.customPrompt")),
                  1
                  /* TEXT */
                ),
                P(n(
                  "textarea",
                  {
                    "onUpdate:modelValue": u[8] || (u[8] = (l) => ie.value.customPrompt = l),
                    rows: "5",
                    class: "field"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [C, ie.value.customPrompt]
                ])
              ]),
              n(
                "p",
                pr,
                r(a("life.companion.persona.hint")),
                1
                /* TEXT */
              )
            ]),
            b.value ? (_(), v("article", fr, [
              n("h3", null, [
                N(
                  r(a("life.companion.persona.analysisResult")) + " ",
                  1
                  /* TEXT */
                ),
                n(
                  "span",
                  mr,
                  r(b.value.source === "llm" ? a("life.companion.persona.sourceLlm") : a("life.companion.persona.sourceLocal")),
                  1
                  /* TEXT */
                )
              ]),
              n("div", _r, [
                n("label", null, [
                  n(
                    "span",
                    null,
                    r(a("life.companion.persona.gender")),
                    1
                    /* TEXT */
                  ),
                  Oe(Ve(De), {
                    modelValue: b.value.gender,
                    "onUpdate:modelValue": u[9] || (u[9] = (l) => b.value.gender = l),
                    options: bt.value,
                    "aria-label": a("life.companion.persona.gender")
                  }, null, 8, ["modelValue", "options", "aria-label"])
                ]),
                n("label", null, [
                  n(
                    "span",
                    null,
                    r(a("life.companion.persona.characterArchetype")),
                    1
                    /* TEXT */
                  ),
                  Oe(Ve(De), {
                    modelValue: b.value.character.key,
                    "onUpdate:modelValue": u[10] || (u[10] = (l) => b.value.character.key = l),
                    options: Jn.value,
                    "aria-label": a("life.companion.persona.characterArchetype")
                  }, null, 8, ["modelValue", "options", "aria-label"])
                ]),
                n("label", null, [
                  n(
                    "span",
                    null,
                    r(a("life.companion.persona.relationshipType")),
                    1
                    /* TEXT */
                  ),
                  Oe(Ve(De), {
                    modelValue: b.value.relationship.key,
                    "onUpdate:modelValue": u[11] || (u[11] = (l) => b.value.relationship.key = l),
                    options: Mn.value,
                    "aria-label": a("life.companion.persona.relationshipTypeAria")
                  }, null, 8, ["modelValue", "options", "aria-label"])
                ])
              ]),
              n("p", vr, [
                N(
                  r(a("life.companion.persona.genderLine", { gender: Ze(b.value.gender) })) + " ",
                  1
                  /* TEXT */
                ),
                b.value.relationship?.label ? (_(), v(
                  Q,
                  { key: 0 },
                  [
                    N(
                      r(a("life.companion.persona.relationshipLine", { label: b.value.relationship.label })) + " ",
                      1
                      /* TEXT */
                    ),
                    b.value.relationship.pathological ? (_(), v(
                      Q,
                      { key: 0 },
                      [
                        N(
                          r(a("life.companion.persona.pathologicalNote")),
                          1
                          /* TEXT */
                        )
                      ],
                      64
                      /* STABLE_FRAGMENT */
                    )) : (_(), v(
                      Q,
                      { key: 1 },
                      [
                        N(
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
              b.value.character?.expression || b.value.expression ? (_(), v(
                "p",
                gr,
                r(a("life.companion.persona.speakingStyle", { style: b.value.character?.expression || b.value.expression })),
                1
                /* TEXT */
              )) : E("v-if", !0),
              n(
                "h4",
                null,
                r(a("life.companion.persona.emotionSomatic")),
                1
                /* TEXT */
              ),
              n("div", yr, [
                n("label", null, [
                  n(
                    "span",
                    null,
                    r(a("life.companion.persona.threatBaseline")),
                    1
                    /* TEXT */
                  ),
                  P(n(
                    "input",
                    {
                      "onUpdate:modelValue": u[12] || (u[12] = (l) => b.value.traits.threat_baseline = l),
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
                      C,
                      b.value.traits.threat_baseline,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                n("label", null, [
                  n(
                    "span",
                    null,
                    r(a("life.companion.persona.rewardBaseline")),
                    1
                    /* TEXT */
                  ),
                  P(n(
                    "input",
                    {
                      "onUpdate:modelValue": u[13] || (u[13] = (l) => b.value.traits.reward_baseline = l),
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
                      C,
                      b.value.traits.reward_baseline,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                n("label", null, [
                  n(
                    "span",
                    null,
                    r(a("life.companion.persona.catastrophizing")),
                    1
                    /* TEXT */
                  ),
                  P(n(
                    "input",
                    {
                      "onUpdate:modelValue": u[14] || (u[14] = (l) => b.value.traits.catastrophizing = l),
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
                      C,
                      b.value.traits.catastrophizing,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                n("label", null, [
                  n(
                    "span",
                    null,
                    r(a("life.companion.persona.erqProfile")),
                    1
                    /* TEXT */
                  ),
                  Oe(Ve(De), {
                    modelValue: b.value.traits.erq_profile,
                    "onUpdate:modelValue": u[15] || (u[15] = (l) => b.value.traits.erq_profile = l),
                    options: $e.value,
                    "aria-label": a("life.companion.persona.erqProfile")
                  }, null, 8, ["modelValue", "options", "aria-label"])
                ]),
                n("label", null, [
                  n(
                    "span",
                    null,
                    r(a("life.companion.persona.sleepHour")),
                    1
                    /* TEXT */
                  ),
                  P(n(
                    "input",
                    {
                      "onUpdate:modelValue": u[16] || (u[16] = (l) => b.value.traits.sleep_hour = l),
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
                      C,
                      b.value.traits.sleep_hour,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ])
              ]),
              n(
                "h4",
                null,
                r(a("life.companion.persona.personalityDims")),
                1
                /* TEXT */
              ),
              n("div", br, [
                n("label", null, [
                  n(
                    "span",
                    null,
                    r(a("life.companion.persona.extraversion")),
                    1
                    /* TEXT */
                  ),
                  P(n(
                    "input",
                    {
                      "onUpdate:modelValue": u[17] || (u[17] = (l) => b.value.traits.extraversion = l),
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
                      C,
                      b.value.traits.extraversion,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                n("label", null, [
                  n(
                    "span",
                    null,
                    r(a("life.companion.persona.agreeableness")),
                    1
                    /* TEXT */
                  ),
                  P(n(
                    "input",
                    {
                      "onUpdate:modelValue": u[18] || (u[18] = (l) => b.value.traits.agreeableness = l),
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
                      C,
                      b.value.traits.agreeableness,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                n("label", null, [
                  n(
                    "span",
                    null,
                    r(a("life.companion.persona.conscientiousness")),
                    1
                    /* TEXT */
                  ),
                  P(n(
                    "input",
                    {
                      "onUpdate:modelValue": u[19] || (u[19] = (l) => b.value.traits.conscientiousness = l),
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
                      C,
                      b.value.traits.conscientiousness,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                n("label", null, [
                  n(
                    "span",
                    null,
                    r(a("life.companion.persona.openness")),
                    1
                    /* TEXT */
                  ),
                  P(n(
                    "input",
                    {
                      "onUpdate:modelValue": u[20] || (u[20] = (l) => b.value.traits.openness = l),
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
                      C,
                      b.value.traits.openness,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                n("label", null, [
                  n(
                    "span",
                    null,
                    r(a("life.companion.persona.attachAnxiety")),
                    1
                    /* TEXT */
                  ),
                  P(n(
                    "input",
                    {
                      "onUpdate:modelValue": u[21] || (u[21] = (l) => b.value.traits.attach_anxiety = l),
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
                      C,
                      b.value.traits.attach_anxiety,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                n("label", null, [
                  n(
                    "span",
                    null,
                    r(a("life.companion.persona.attachAvoidance")),
                    1
                    /* TEXT */
                  ),
                  P(n(
                    "input",
                    {
                      "onUpdate:modelValue": u[22] || (u[22] = (l) => b.value.traits.attach_avoidance = l),
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
                      C,
                      b.value.traits.attach_avoidance,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ])
              ]),
              n("details", wr, [
                n(
                  "summary",
                  null,
                  r(a("life.companion.persona.moreStyle")),
                  1
                  /* TEXT */
                ),
                n("div", xr, [
                  n("label", null, [
                    n(
                      "span",
                      null,
                      r(a("life.companion.persona.expressiveness")),
                      1
                      /* TEXT */
                    ),
                    P(n(
                      "input",
                      {
                        "onUpdate:modelValue": u[23] || (u[23] = (l) => b.value.traits.expressiveness = l),
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
                        C,
                        b.value.traits.expressiveness,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  n("label", null, [
                    n(
                      "span",
                      null,
                      r(a("life.companion.persona.initiative")),
                      1
                      /* TEXT */
                    ),
                    P(n(
                      "input",
                      {
                        "onUpdate:modelValue": u[24] || (u[24] = (l) => b.value.traits.initiative = l),
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
                        C,
                        b.value.traits.initiative,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  n("label", null, [
                    n(
                      "span",
                      null,
                      r(a("life.companion.persona.humor")),
                      1
                      /* TEXT */
                    ),
                    P(n(
                      "input",
                      {
                        "onUpdate:modelValue": u[25] || (u[25] = (l) => b.value.traits.humor = l),
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
                        C,
                        b.value.traits.humor,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  n("label", null, [
                    n(
                      "span",
                      null,
                      r(a("life.companion.persona.warmth")),
                      1
                      /* TEXT */
                    ),
                    P(n(
                      "input",
                      {
                        "onUpdate:modelValue": u[26] || (u[26] = (l) => b.value.traits.warmth = l),
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
                        C,
                        b.value.traits.warmth,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  n("label", null, [
                    n(
                      "span",
                      null,
                      r(a("life.companion.persona.formality")),
                      1
                      /* TEXT */
                    ),
                    P(n(
                      "input",
                      {
                        "onUpdate:modelValue": u[27] || (u[27] = (l) => b.value.traits.formality = l),
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
                        C,
                        b.value.traits.formality,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  n("label", null, [
                    n(
                      "span",
                      null,
                      r(a("life.companion.persona.assertiveness")),
                      1
                      /* TEXT */
                    ),
                    P(n(
                      "input",
                      {
                        "onUpdate:modelValue": u[28] || (u[28] = (l) => b.value.traits.assertiveness = l),
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
                        C,
                        b.value.traits.assertiveness,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ])
                ])
              ]),
              b.value.attachment.type ? (_(), v(
                Q,
                { key: 1 },
                [
                  n(
                    "h4",
                    null,
                    r(a("life.companion.persona.attachmentHeading", { label: b.value.relationship.label })),
                    1
                    /* TEXT */
                  ),
                  n("div", kr, [
                    n("label", null, [
                      n(
                        "span",
                        null,
                        r(a("life.companion.persona.attachTypeByRelationship")),
                        1
                        /* TEXT */
                      ),
                      n("input", {
                        class: "field",
                        value: a("life.companion.attachmentTypeValue", { type: b.value.attachment.type, label: b.value.relationship.label || "" }),
                        disabled: ""
                      }, null, 8, Pr)
                    ]),
                    n("label", null, [
                      n(
                        "span",
                        null,
                        r(a("life.companion.persona.initialAnxietyX")),
                        1
                        /* TEXT */
                      ),
                      P(n(
                        "input",
                        {
                          "onUpdate:modelValue": u[29] || (u[29] = (l) => b.value.attachment.initial.X = l),
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
                          C,
                          b.value.attachment.initial.X,
                          void 0,
                          { number: !0 }
                        ]
                      ])
                    ]),
                    n("label", null, [
                      n(
                        "span",
                        null,
                        r(a("life.companion.persona.initialSecurityS")),
                        1
                        /* TEXT */
                      ),
                      P(n(
                        "input",
                        {
                          "onUpdate:modelValue": u[30] || (u[30] = (l) => b.value.attachment.initial.S = l),
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
                          C,
                          b.value.attachment.initial.S,
                          void 0,
                          { number: !0 }
                        ]
                      ])
                    ])
                  ]),
                  n(
                    "p",
                    Lr,
                    r(a("life.companion.persona.attachmentHint")),
                    1
                    /* TEXT */
                  )
                ],
                64
                /* STABLE_FRAGMENT */
              )) : (_(), v(
                "p",
                Tr,
                r(a("life.companion.persona.attachmentDisabled")),
                1
                /* TEXT */
              )),
              b.value.tsundere && b.value.tsundere.type ? (_(), v(
                Q,
                { key: 3 },
                [
                  n(
                    "h4",
                    null,
                    r(a("life.companion.persona.tsundereHeading")),
                    1
                    /* TEXT */
                  ),
                  n("div", Sr, [
                    n("label", null, [
                      n(
                        "span",
                        null,
                        r(a("life.companion.persona.tsundereType")),
                        1
                        /* TEXT */
                      ),
                      n("input", {
                        class: "field",
                        value: b.value.tsundere.type,
                        disabled: ""
                      }, null, 8, Cr)
                    ]),
                    n("label", null, [
                      n(
                        "span",
                        null,
                        r(a("life.companion.persona.initialAffectionA")),
                        1
                        /* TEXT */
                      ),
                      P(n(
                        "input",
                        {
                          "onUpdate:modelValue": u[31] || (u[31] = (l) => b.value.tsundere.initial.A = l),
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
                          C,
                          b.value.tsundere.initial.A,
                          void 0,
                          { number: !0 }
                        ]
                      ])
                    ]),
                    n("label", null, [
                      n(
                        "span",
                        null,
                        r(a("life.companion.persona.initialTsunExpressionT")),
                        1
                        /* TEXT */
                      ),
                      P(n(
                        "input",
                        {
                          "onUpdate:modelValue": u[32] || (u[32] = (l) => b.value.tsundere.initial.T = l),
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
                          C,
                          b.value.tsundere.initial.T,
                          void 0,
                          { number: !0 }
                        ]
                      ])
                    ]),
                    n("label", null, [
                      n(
                        "span",
                        null,
                        r(a("life.companion.persona.initialYandereY")),
                        1
                        /* TEXT */
                      ),
                      P(n(
                        "input",
                        {
                          "onUpdate:modelValue": u[33] || (u[33] = (l) => b.value.tsundere.initial.Y = l),
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
                          C,
                          b.value.tsundere.initial.Y,
                          void 0,
                          { number: !0 }
                        ]
                      ])
                    ])
                  ]),
                  n(
                    "p",
                    Mr,
                    r(a("life.companion.persona.tsundereHint")),
                    1
                    /* TEXT */
                  )
                ],
                64
                /* STABLE_FRAGMENT */
              )) : (_(), v(
                "p",
                zr,
                r(a("life.companion.persona.tsundereDisabled")),
                1
                /* TEXT */
              )),
              b.value.personadyn && b.value.personadyn.type ? (_(), v(
                Q,
                { key: 5 },
                [
                  n(
                    "h4",
                    null,
                    r(a("life.companion.persona.personadynHeading")),
                    1
                    /* TEXT */
                  ),
                  n("div", Er, [
                    n("label", null, [
                      n(
                        "span",
                        null,
                        r(a("life.companion.persona.personaArchetype")),
                        1
                        /* TEXT */
                      ),
                      n("input", {
                        class: "field",
                        value: b.value.personadyn.type,
                        disabled: ""
                      }, null, 8, Or)
                    ]),
                    n("label", null, [
                      n(
                        "span",
                        null,
                        r(a("life.companion.persona.initialAffectionA")),
                        1
                        /* TEXT */
                      ),
                      P(n(
                        "input",
                        {
                          "onUpdate:modelValue": u[34] || (u[34] = (l) => b.value.personadyn.initial.A = l),
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
                          C,
                          b.value.personadyn.initial.A,
                          void 0,
                          { number: !0 }
                        ]
                      ])
                    ]),
                    n("label", null, [
                      n(
                        "span",
                        null,
                        r(a("life.companion.persona.initialAnxietyX")),
                        1
                        /* TEXT */
                      ),
                      P(n(
                        "input",
                        {
                          "onUpdate:modelValue": u[35] || (u[35] = (l) => b.value.personadyn.initial.X = l),
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
                          C,
                          b.value.personadyn.initial.X,
                          void 0,
                          { number: !0 }
                        ]
                      ])
                    ]),
                    n("label", null, [
                      n(
                        "span",
                        null,
                        r(a("life.companion.persona.initialPossessionO")),
                        1
                        /* TEXT */
                      ),
                      P(n(
                        "input",
                        {
                          "onUpdate:modelValue": u[36] || (u[36] = (l) => b.value.personadyn.initial.O = l),
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
                          C,
                          b.value.personadyn.initial.O,
                          void 0,
                          { number: !0 }
                        ]
                      ])
                    ]),
                    n("label", null, [
                      n(
                        "span",
                        null,
                        r(a("life.companion.persona.initialTrustTr")),
                        1
                        /* TEXT */
                      ),
                      P(n(
                        "input",
                        {
                          "onUpdate:modelValue": u[37] || (u[37] = (l) => b.value.personadyn.initial.Tr = l),
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
                          C,
                          b.value.personadyn.initial.Tr,
                          void 0,
                          { number: !0 }
                        ]
                      ])
                    ]),
                    n("label", null, [
                      n(
                        "span",
                        null,
                        r(a("life.companion.persona.initialSelfControlK")),
                        1
                        /* TEXT */
                      ),
                      P(n(
                        "input",
                        {
                          "onUpdate:modelValue": u[38] || (u[38] = (l) => b.value.personadyn.initial.K = l),
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
                          C,
                          b.value.personadyn.initial.K,
                          void 0,
                          { number: !0 }
                        ]
                      ])
                    ]),
                    n("label", null, [
                      n(
                        "span",
                        null,
                        r(a("life.companion.persona.genderSocialScript")),
                        1
                        /* TEXT */
                      ),
                      Oe(Ve(De), {
                        modelValue: b.value.personadynGender,
                        "onUpdate:modelValue": u[39] || (u[39] = (l) => b.value.personadynGender = l),
                        options: It.value,
                        "aria-label": a("life.companion.persona.genderSocialScriptAria")
                      }, null, 8, ["modelValue", "options", "aria-label"])
                    ])
                  ]),
                  n(
                    "p",
                    Ar,
                    r(a("life.companion.persona.personadynHint")),
                    1
                    /* TEXT */
                  )
                ],
                64
                /* STABLE_FRAGMENT */
              )) : (_(), v(
                "p",
                Ir,
                r(a("life.companion.persona.personadynDisabled")),
                1
                /* TEXT */
              ))
            ])) : E("v-if", !0)
          ],
          512
          /* NEED_PATCH */
        ), [
          [un, Ae.value === "persona"]
        ]),
        P(n(
          "section",
          Br,
          [
            n("div", Zr, [
              n("div", null, [
                n(
                  "h2",
                  null,
                  r(a("life.companion.cognition.title")),
                  1
                  /* TEXT */
                ),
                n(
                  "p",
                  Nr,
                  r(a("life.companion.cognition.desc")),
                  1
                  /* TEXT */
                )
              ]),
              n("div", Rr, [
                n("button", {
                  class: "btn filled sm",
                  disabled: Lt.value,
                  onClick: H
                }, r(Lt.value ? a("life.companion.saving") : a("life.companion.saveSettings")), 9, Vr)
              ])
            ]),
            n("article", Dr, [
              n("h3", null, [
                N(
                  r(a("life.companion.life.title")) + " ",
                  1
                  /* TEXT */
                ),
                n(
                  "span",
                  {
                    class: Y(["count-pill", { ok: ye.value?.alive }])
                  },
                  r(ye.value?.alive ? a("life.companion.life.alive") : a("life.companion.life.notStarted")),
                  3
                  /* TEXT, CLASS */
                )
              ]),
              n("div", $r, [
                n("div", Ur, [
                  n(
                    "span",
                    null,
                    r(a("life.companion.life.status")),
                    1
                    /* TEXT */
                  ),
                  n(
                    "strong",
                    null,
                    r(ye.value?.alive ? a("life.companion.life.alive") : a("life.companion.life.notStarted")),
                    1
                    /* TEXT */
                  )
                ]),
                n("div", Fr, [
                  n(
                    "span",
                    null,
                    r(a("life.companion.life.livedFor")),
                    1
                    /* TEXT */
                  ),
                  n(
                    "strong",
                    null,
                    r(pn()),
                    1
                    /* TEXT */
                  )
                ]),
                n("div", Hr, [
                  n(
                    "span",
                    null,
                    r(a("life.companion.life.ticks")),
                    1
                    /* TEXT */
                  ),
                  n(
                    "strong",
                    null,
                    r(ye.value?.ticks ?? 0),
                    1
                    /* TEXT */
                  )
                ]),
                n("div", Wr, [
                  n(
                    "span",
                    null,
                    r(a("life.companion.life.residentThinking")),
                    1
                    /* TEXT */
                  ),
                  n(
                    "strong",
                    null,
                    r(ye.value?.resident_running ? a("life.companion.status.running") : a("life.companion.status.stopped")),
                    1
                    /* TEXT */
                  )
                ]),
                n("div", Gr, [
                  n(
                    "span",
                    null,
                    r(a("life.companion.life.proactive")),
                    1
                    /* TEXT */
                  ),
                  n(
                    "strong",
                    null,
                    r(ye.value?.proactive_enabled ? a("life.companion.on") : a("life.companion.off")),
                    1
                    /* TEXT */
                  )
                ]),
                n("div", jr, [
                  n(
                    "span",
                    null,
                    r(a("life.companion.life.lastThought")),
                    1
                    /* TEXT */
                  ),
                  n(
                    "strong",
                    null,
                    r((ye.value?.last_tick || "").slice(0, 16).replace("T", " ") || "—"),
                    1
                    /* TEXT */
                  )
                ])
              ]),
              ye.value?.last_thought ? (_(), v(
                "p",
                qr,
                r(a("life.companion.life.currentThought", { text: ye.value.last_thought })),
                1
                /* TEXT */
              )) : E("v-if", !0),
              ye.value?.focus ? (_(), v(
                "p",
                Kr,
                r(a("life.companion.life.focus", { text: ye.value.focus })),
                1
                /* TEXT */
              )) : E("v-if", !0),
              ye.value?.active_goal ? (_(), v(
                "p",
                Yr,
                r(a("life.companion.life.goal", { text: ye.value.active_goal })),
                1
                /* TEXT */
              )) : E("v-if", !0),
              n("div", Jr, [
                n("label", Xr, [
                  P(n(
                    "input",
                    {
                      type: "checkbox",
                      "onUpdate:modelValue": u[40] || (u[40] = (l) => Jt.value = l)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [fe, Jt.value]
                  ]),
                  n(
                    "span",
                    null,
                    r(a("life.companion.life.greetOnStart")),
                    1
                    /* TEXT */
                  )
                ]),
                n("button", {
                  class: Y(["btn sm", { filled: !ye.value?.alive }]),
                  disabled: vt.value || J.value,
                  onClick: u[41] || (u[41] = (l) => ye.value?.alive ? mn() : fn())
                }, r(vt.value ? $i() : ye.value?.alive ? a("life.companion.life.pause") : a("life.companion.life.start")), 11, Qr)
              ]),
              n(
                "p",
                el,
                r(a("life.companion.life.hint")),
                1
                /* TEXT */
              )
            ]),
            n("article", tl, [
              n("h3", null, [
                N(
                  r(a("life.companion.realtime.title")) + " ",
                  1
                  /* TEXT */
                ),
                n(
                  "span",
                  {
                    class: Y(["count-pill", { ok: M.value?.enabled }])
                  },
                  r(M.value?.enabled ? a("life.companion.status.running") : a("life.companion.status.stopped")),
                  3
                  /* TEXT, CLASS */
                ),
                zi.value ? (_(), v(
                  "span",
                  il,
                  r(a("life.companion.realtime.updatedAt", { time: zi.value })),
                  1
                  /* TEXT */
                )) : E("v-if", !0)
              ]),
              M.value ? (_(), v(
                Q,
                { key: 1 },
                [
                  n(
                    "div",
                    ol,
                    r(a("life.companion.realtime.atAGlance")),
                    1
                    /* TEXT */
                  ),
                  n(
                    "p",
                    al,
                    r(a("life.companion.realtime.atAGlanceHint")),
                    1
                    /* TEXT */
                  ),
                  n("div", sl, [
                    fi.value ? (_(), v("div", {
                      key: 0,
                      class: "mood-plot-wrap",
                      role: "img",
                      "aria-label": a(wn.value)
                    }, [
                      n(
                        "span",
                        ll,
                        r(a("life.companion.axis.arousalHigh")),
                        1
                        /* TEXT */
                      ),
                      n(
                        "span",
                        ul,
                        r(a("life.companion.axis.arousalLow")),
                        1
                        /* TEXT */
                      ),
                      n(
                        "span",
                        cl,
                        r(a("life.companion.axis.valenceLow")),
                        1
                        /* TEXT */
                      ),
                      n(
                        "span",
                        dl,
                        r(a("life.companion.axis.valenceHigh")),
                        1
                        /* TEXT */
                      ),
                      (_(), v("svg", hl, [
                        u[102] || (u[102] = n(
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
                        u[103] || (u[103] = n(
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
                        u[104] || (u[104] = n(
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
                        n("circle", {
                          class: "plot-halo",
                          cx: ti.value.x,
                          cy: ti.value.y,
                          r: "12"
                        }, null, 8, pl),
                        n("circle", {
                          class: "plot-dot",
                          cx: ti.value.x,
                          cy: ti.value.y,
                          r: "5"
                        }, null, 8, fl)
                      ])),
                      n(
                        "span",
                        ml,
                        r(a(wn.value)),
                        1
                        /* TEXT */
                      )
                    ], 8, rl)) : E("v-if", !0),
                    n("div", _l, [
                      n(
                        "p",
                        vl,
                        r(a("life.companion.realtime.section.mood")),
                        1
                        /* TEXT */
                      ),
                      (_(!0), v(
                        Q,
                        null,
                        Te(Gn.value, (l) => (_(), v("div", {
                          key: l.label,
                          class: "gauge",
                          title: l.effect
                        }, [
                          n("span", yl, [
                            n("span", bl, [
                              N(
                                r(l.label),
                                1
                                /* TEXT */
                              ),
                              n(
                                "em",
                                wl,
                                r(l.alias),
                                1
                                /* TEXT */
                              )
                            ]),
                            n("span", xl, [
                              n(
                                "b",
                                {
                                  class: Y(["gauge-state", l.stateTone])
                                },
                                r(l.state),
                                3
                                /* TEXT, CLASS */
                              ),
                              N(
                                " " + r(l.display),
                                1
                                /* TEXT */
                              )
                            ])
                          ]),
                          n(
                            "span",
                            {
                              class: Y(["gauge-bar", { signed: l.signed }])
                            },
                            [
                              n(
                                "i",
                                {
                                  class: Y(["gauge-fill", l.signed ? l.value >= 0 ? "good" : "bad" : ht(l)]),
                                  style: et(l.signed ? tt(l.value) : { width: (dt(l) * 100).toFixed(1) + "%" })
                                },
                                null,
                                6
                                /* CLASS, STYLE */
                              )
                            ],
                            2
                            /* CLASS */
                          ),
                          n(
                            "span",
                            kl,
                            r(l.effect),
                            1
                            /* TEXT */
                          )
                        ], 8, gl))),
                        128
                        /* KEYED_FRAGMENT */
                      ))
                    ]),
                    n("div", Pl, [
                      n("p", Ll, [
                        N(
                          r(a("life.companion.body.title")) + " ",
                          1
                          /* TEXT */
                        ),
                        n(
                          "span",
                          {
                            class: Y(["chip", { muted: Nt.value?.is_sleeping, ok: Nt.value && !Nt.value.is_sleeping }])
                          },
                          r(Nt.value ? Nt.value.is_sleeping ? a("life.companion.body.sleeping") : a("life.companion.body.awake") : "—"),
                          3
                          /* TEXT, CLASS */
                        )
                      ]),
                      (_(!0), v(
                        Q,
                        null,
                        Te(jn.value, (l) => (_(), v("div", {
                          key: l.label,
                          class: "gauge",
                          title: l.effect
                        }, [
                          n("span", Sl, [
                            n("span", Cl, [
                              N(
                                r(l.label),
                                1
                                /* TEXT */
                              ),
                              n(
                                "em",
                                Ml,
                                r(l.alias),
                                1
                                /* TEXT */
                              )
                            ]),
                            n("span", zl, [
                              n(
                                "b",
                                {
                                  class: Y(["gauge-state", l.stateTone])
                                },
                                r(l.state),
                                3
                                /* TEXT, CLASS */
                              ),
                              N(
                                " " + r(l.display),
                                1
                                /* TEXT */
                              )
                            ])
                          ]),
                          n(
                            "span",
                            {
                              class: Y(["gauge-bar", { signed: l.signed }])
                            },
                            [
                              n(
                                "i",
                                {
                                  class: Y(["gauge-fill", l.signed ? l.value >= 0 ? "good" : "bad" : ht(l)]),
                                  style: et(l.signed ? tt(l.value) : { width: (dt(l) * 100).toFixed(1) + "%" })
                                },
                                null,
                                6
                                /* CLASS, STYLE */
                              )
                            ],
                            2
                            /* CLASS */
                          ),
                          n(
                            "span",
                            El,
                            r(l.effect),
                            1
                            /* TEXT */
                          )
                        ], 8, Tl))),
                        128
                        /* KEYED_FRAGMENT */
                      ))
                    ])
                  ]),
                  n(
                    "div",
                    Ol,
                    r(a("life.companion.realtime.section.mood")),
                    1
                    /* TEXT */
                  ),
                  n(
                    "p",
                    Al,
                    r(a("life.companion.realtime.sectionSub.mood")),
                    1
                    /* TEXT */
                  ),
                  n("div", Il, [
                    (_(!0), v(
                      Q,
                      null,
                      Te(qn.value, (l) => (_(), v("div", {
                        key: l.label,
                        class: "gauge",
                        title: l.effect
                      }, [
                        n("span", Zl, [
                          n("span", Nl, [
                            N(
                              r(l.label),
                              1
                              /* TEXT */
                            ),
                            n(
                              "em",
                              Rl,
                              r(l.alias),
                              1
                              /* TEXT */
                            )
                          ]),
                          n("span", Vl, [
                            n(
                              "b",
                              {
                                class: Y(["gauge-state", l.stateTone])
                              },
                              r(l.state),
                              3
                              /* TEXT, CLASS */
                            ),
                            N(
                              " " + r(l.display),
                              1
                              /* TEXT */
                            )
                          ])
                        ]),
                        n(
                          "span",
                          {
                            class: Y(["gauge-bar", { signed: l.signed }])
                          },
                          [
                            n(
                              "i",
                              {
                                class: Y(["gauge-fill", l.signed ? l.value >= 0 ? "good" : "bad" : ht(l)]),
                                style: et(l.signed ? tt(l.value) : { width: (dt(l) * 100).toFixed(1) + "%" })
                              },
                              null,
                              6
                              /* CLASS, STYLE */
                            )
                          ],
                          2
                          /* CLASS */
                        ),
                        n(
                          "span",
                          Dl,
                          r(l.effect),
                          1
                          /* TEXT */
                        )
                      ], 8, Bl))),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ]),
                  Fi.value ? (_(), v("div", $l, [
                    (_(!0), v(
                      Q,
                      null,
                      Te(Fi.value, (l, O) => (_(), v("div", {
                        key: O,
                        class: "som-chan"
                      }, [
                        n(
                          "span",
                          Ul,
                          r(vn(O)),
                          1
                          /* TEXT */
                        ),
                        n("span", Fl, [
                          n(
                            "i",
                            {
                              style: et({ transform: "scaleX(" + gn(l) + ")" })
                            },
                            null,
                            4
                            /* STYLE */
                          )
                        ]),
                        n(
                          "span",
                          Hl,
                          r(Le(l, 2)),
                          1
                          /* TEXT */
                        )
                      ]))),
                      128
                      /* KEYED_FRAGMENT */
                    )),
                    Number(m.value?.somatic_chronicity) > 0.1 ? (_(), v(
                      "p",
                      Wl,
                      r(a("life.companion.realtime.somaticChronicity", { value: Le(m.value?.somatic_chronicity) })),
                      1
                      /* TEXT */
                    )) : E("v-if", !0)
                  ])) : E("v-if", !0),
                  y.value || ee.value ? (_(), v(
                    Q,
                    { key: 1 },
                    [
                      n(
                        "div",
                        Gl,
                        r(a("life.companion.realtime.section.social")),
                        1
                        /* TEXT */
                      ),
                      n(
                        "p",
                        jl,
                        r(a("life.companion.realtime.sectionSub.social")),
                        1
                        /* TEXT */
                      ),
                      n("div", ql, [
                        (_(!0), v(
                          Q,
                          null,
                          Te(Kn.value, (l) => (_(), v("div", {
                            key: l.label,
                            class: "gauge",
                            title: l.effect
                          }, [
                            n("span", Yl, [
                              n("span", Jl, [
                                N(
                                  r(l.label),
                                  1
                                  /* TEXT */
                                ),
                                n(
                                  "em",
                                  Xl,
                                  r(l.alias),
                                  1
                                  /* TEXT */
                                )
                              ]),
                              n("span", Ql, [
                                n(
                                  "b",
                                  {
                                    class: Y(["gauge-state", l.stateTone])
                                  },
                                  r(l.state),
                                  3
                                  /* TEXT, CLASS */
                                ),
                                N(
                                  " " + r(l.display),
                                  1
                                  /* TEXT */
                                )
                              ])
                            ]),
                            n(
                              "span",
                              {
                                class: Y(["gauge-bar", { signed: l.signed }])
                              },
                              [
                                n(
                                  "i",
                                  {
                                    class: Y(["gauge-fill", l.signed ? l.value >= 0 ? "good" : "bad" : ht(l)]),
                                    style: et(l.signed ? tt(l.value) : { width: (dt(l) * 100).toFixed(1) + "%" })
                                  },
                                  null,
                                  6
                                  /* CLASS, STYLE */
                                )
                              ],
                              2
                              /* CLASS */
                            ),
                            n(
                              "span",
                              eu,
                              r(l.effect),
                              1
                              /* TEXT */
                            )
                          ], 8, Kl))),
                          128
                          /* KEYED_FRAGMENT */
                        ))
                      ]),
                      n("div", tu, [
                        n(
                          "span",
                          iu,
                          r(a("life.companion.metric.perspectiveStage")) + " " + r(y.value?.perspective_name || "—"),
                          1
                          /* TEXT */
                        ),
                        n(
                          "span",
                          nu,
                          r(a("life.companion.metric.attentionState")) + " " + r(ee.value?.attention_state || "—"),
                          1
                          /* TEXT */
                        )
                      ])
                    ],
                    64
                    /* STABLE_FRAGMENT */
                  )) : E("v-if", !0),
                  $.value?.enabled ? (_(), v(
                    Q,
                    { key: 2 },
                    [
                      n(
                        "div",
                        ou,
                        r(a("life.companion.realtime.section.attachment")),
                        1
                        /* TEXT */
                      ),
                      n(
                        "p",
                        au,
                        r(a("life.companion.realtime.sectionSub.attachment")),
                        1
                        /* TEXT */
                      ),
                      n("div", su, [
                        n(
                          "span",
                          ru,
                          r($.value.label || $.value.type),
                          1
                          /* TEXT */
                        ),
                        n(
                          "span",
                          lu,
                          r(a("life.companion.metric.severity")) + " " + r(Le($.value.severity, 2)) + " · " + r($.value.band),
                          1
                          /* TEXT */
                        ),
                        n(
                          "span",
                          uu,
                          r(a("life.companion.metric.dominantTendency")) + " " + r($.value.dominant || "—"),
                          1
                          /* TEXT */
                        ),
                        n(
                          "span",
                          {
                            class: Y(["chip", $.value.safe_mode ? "warn" : "muted"])
                          },
                          r(a("life.companion.metric.safetyLayer")) + " " + r($.value.safe_mode ? a("life.companion.metric.triggered") : a("life.companion.metric.normal")),
                          3
                          /* TEXT, CLASS */
                        )
                      ]),
                      n("div", cu, [
                        (_(!0), v(
                          Q,
                          null,
                          Te(nt.value, (l) => (_(), v("div", {
                            key: l.label,
                            class: "gauge",
                            title: l.effect
                          }, [
                            n("span", hu, [
                              n("span", pu, [
                                N(
                                  r(l.label),
                                  1
                                  /* TEXT */
                                ),
                                n(
                                  "em",
                                  fu,
                                  r(l.alias),
                                  1
                                  /* TEXT */
                                )
                              ]),
                              n("span", mu, [
                                n(
                                  "b",
                                  {
                                    class: Y(["gauge-state", l.stateTone])
                                  },
                                  r(l.state),
                                  3
                                  /* TEXT, CLASS */
                                ),
                                N(
                                  " " + r(l.display),
                                  1
                                  /* TEXT */
                                )
                              ])
                            ]),
                            n(
                              "span",
                              {
                                class: Y(["gauge-bar", { signed: l.signed }])
                              },
                              [
                                n(
                                  "i",
                                  {
                                    class: Y(["gauge-fill", l.signed ? l.value >= 0 ? "good" : "bad" : ht(l)]),
                                    style: et(l.signed ? tt(l.value) : { width: (dt(l) * 100).toFixed(1) + "%" })
                                  },
                                  null,
                                  6
                                  /* CLASS, STYLE */
                                )
                              ],
                              2
                              /* CLASS */
                            ),
                            n(
                              "span",
                              _u,
                              r(l.effect),
                              1
                              /* TEXT */
                            )
                          ], 8, du))),
                          128
                          /* KEYED_FRAGMENT */
                        ))
                      ])
                    ],
                    64
                    /* STABLE_FRAGMENT */
                  )) : E("v-if", !0),
                  ge.value?.enabled ? (_(), v(
                    Q,
                    { key: 3 },
                    [
                      n(
                        "div",
                        vu,
                        r(a("life.companion.realtime.section.tsundere")),
                        1
                        /* TEXT */
                      ),
                      n(
                        "p",
                        gu,
                        r(a("life.companion.realtime.sectionSub.tsundere")),
                        1
                        /* TEXT */
                      ),
                      n("div", yu, [
                        n(
                          "span",
                          bu,
                          r(ge.value.label || ge.value.type),
                          1
                          /* TEXT */
                        ),
                        n(
                          "span",
                          {
                            class: Y(["chip", ge.value.safe_mode ? "warn" : "muted"])
                          },
                          r(a("life.companion.metric.safetyLayer")) + " " + r(ge.value.safe_mode ? a("life.companion.metric.triggered") : a("life.companion.metric.normal")),
                          3
                          /* TEXT, CLASS */
                        )
                      ]),
                      n("div", wu, [
                        (_(!0), v(
                          Q,
                          null,
                          Te(I.value, (l) => (_(), v("div", {
                            key: l.label,
                            class: "gauge",
                            title: l.effect
                          }, [
                            n("span", ku, [
                              n("span", Pu, [
                                N(
                                  r(l.label),
                                  1
                                  /* TEXT */
                                ),
                                n(
                                  "em",
                                  Lu,
                                  r(l.alias),
                                  1
                                  /* TEXT */
                                )
                              ]),
                              n("span", Tu, [
                                n(
                                  "b",
                                  {
                                    class: Y(["gauge-state", l.stateTone])
                                  },
                                  r(l.state),
                                  3
                                  /* TEXT, CLASS */
                                ),
                                N(
                                  " " + r(l.display),
                                  1
                                  /* TEXT */
                                )
                              ])
                            ]),
                            n(
                              "span",
                              {
                                class: Y(["gauge-bar", { signed: l.signed }])
                              },
                              [
                                n(
                                  "i",
                                  {
                                    class: Y(["gauge-fill", l.signed ? l.value >= 0 ? "good" : "bad" : ht(l)]),
                                    style: et(l.signed ? tt(l.value) : { width: (dt(l) * 100).toFixed(1) + "%" })
                                  },
                                  null,
                                  6
                                  /* CLASS, STYLE */
                                )
                              ],
                              2
                              /* CLASS */
                            ),
                            n(
                              "span",
                              Su,
                              r(l.effect),
                              1
                              /* TEXT */
                            )
                          ], 8, xu))),
                          128
                          /* KEYED_FRAGMENT */
                        ))
                      ])
                    ],
                    64
                    /* STABLE_FRAGMENT */
                  )) : E("v-if", !0),
                  Be.value?.enabled ? (_(), v(
                    Q,
                    { key: 4 },
                    [
                      n(
                        "div",
                        Cu,
                        r(a("life.companion.realtime.section.yandere")),
                        1
                        /* TEXT */
                      ),
                      n(
                        "p",
                        Mu,
                        r(a("life.companion.realtime.sectionSub.yandere")),
                        1
                        /* TEXT */
                      ),
                      n("div", zu, [
                        n(
                          "span",
                          Eu,
                          r(Be.value.label || Be.value.type),
                          1
                          /* TEXT */
                        ),
                        n(
                          "span",
                          Ou,
                          r(a("life.companion.metric.yandereMode")) + " " + r(Be.value.mode) + " · " + r(Be.value.label_russell),
                          1
                          /* TEXT */
                        ),
                        n(
                          "span",
                          {
                            class: Y(["chip", Be.value.safe_mode ? "warn" : "muted"])
                          },
                          r(a("life.companion.metric.safetyLayer")) + " " + r(Be.value.safe_mode ? a("life.companion.metric.triggered") : a("life.companion.metric.normal")),
                          3
                          /* TEXT, CLASS */
                        )
                      ]),
                      n("div", Au, [
                        (_(!0), v(
                          Q,
                          null,
                          Te(kn.value, (l) => (_(), v("div", {
                            key: l.label,
                            class: "gauge",
                            title: l.effect
                          }, [
                            n("span", Bu, [
                              n("span", Zu, [
                                N(
                                  r(l.label),
                                  1
                                  /* TEXT */
                                ),
                                n(
                                  "em",
                                  Nu,
                                  r(l.alias),
                                  1
                                  /* TEXT */
                                )
                              ]),
                              n("span", Ru, [
                                n(
                                  "b",
                                  {
                                    class: Y(["gauge-state", l.stateTone])
                                  },
                                  r(l.state),
                                  3
                                  /* TEXT, CLASS */
                                ),
                                N(
                                  " " + r(l.display),
                                  1
                                  /* TEXT */
                                )
                              ])
                            ]),
                            n(
                              "span",
                              {
                                class: Y(["gauge-bar", { signed: l.signed }])
                              },
                              [
                                n(
                                  "i",
                                  {
                                    class: Y(["gauge-fill", l.signed ? l.value >= 0 ? "good" : "bad" : ht(l)]),
                                    style: et(l.signed ? tt(l.value) : { width: (dt(l) * 100).toFixed(1) + "%" })
                                  },
                                  null,
                                  6
                                  /* CLASS, STYLE */
                                )
                              ],
                              2
                              /* CLASS */
                            ),
                            n(
                              "span",
                              Vu,
                              r(l.effect),
                              1
                              /* TEXT */
                            )
                          ], 8, Iu))),
                          128
                          /* KEYED_FRAGMENT */
                        ))
                      ])
                    ],
                    64
                    /* STABLE_FRAGMENT */
                  )) : E("v-if", !0),
                  F.value?.enabled ? (_(), v(
                    Q,
                    { key: 5 },
                    [
                      n(
                        "div",
                        Du,
                        r(a("life.companion.realtime.section.pd")),
                        1
                        /* TEXT */
                      ),
                      n(
                        "p",
                        $u,
                        r(a("life.companion.realtime.sectionSub.pd")),
                        1
                        /* TEXT */
                      ),
                      n("div", Uu, [
                        n(
                          "span",
                          Fu,
                          r(F.value.label || F.value.type),
                          1
                          /* TEXT */
                        ),
                        n(
                          "span",
                          Hu,
                          r(a("life.companion.metric.emergentMode")) + " " + r(F.value.mode_label || F.value.mode) + " · " + r(F.value.band),
                          1
                          /* TEXT */
                        ),
                        F.value.gender ? (_(), v(
                          "span",
                          Wu,
                          r(F.value.gender),
                          1
                          /* TEXT */
                        )) : E("v-if", !0),
                        F.value.clinical ? (_(), v(
                          "span",
                          Gu,
                          r(a("life.companion.simulationMode")),
                          1
                          /* TEXT */
                        )) : E("v-if", !0)
                      ]),
                      n("div", ju, [
                        (_(!0), v(
                          Q,
                          null,
                          Te(Pn.value, (l) => (_(), v("div", {
                            key: l.label,
                            class: "gauge",
                            title: l.effect
                          }, [
                            n("span", Ku, [
                              n("span", Yu, [
                                N(
                                  r(l.label),
                                  1
                                  /* TEXT */
                                ),
                                n(
                                  "em",
                                  Ju,
                                  r(l.alias),
                                  1
                                  /* TEXT */
                                )
                              ]),
                              n("span", Xu, [
                                n(
                                  "b",
                                  {
                                    class: Y(["gauge-state", l.stateTone])
                                  },
                                  r(l.state),
                                  3
                                  /* TEXT, CLASS */
                                ),
                                N(
                                  " " + r(l.display),
                                  1
                                  /* TEXT */
                                )
                              ])
                            ]),
                            n(
                              "span",
                              {
                                class: Y(["gauge-bar", { signed: l.signed }])
                              },
                              [
                                n(
                                  "i",
                                  {
                                    class: Y(["gauge-fill", l.signed ? l.value >= 0 ? "good" : "bad" : ht(l)]),
                                    style: et(l.signed ? tt(l.value) : { width: (dt(l) * 100).toFixed(1) + "%" })
                                  },
                                  null,
                                  6
                                  /* CLASS, STYLE */
                                )
                              ],
                              2
                              /* CLASS */
                            ),
                            n(
                              "span",
                              Qu,
                              r(l.effect),
                              1
                              /* TEXT */
                            )
                          ], 8, qu))),
                          128
                          /* KEYED_FRAGMENT */
                        ))
                      ]),
                      n("details", ec, [
                        n(
                          "summary",
                          null,
                          r(a("life.companion.realtime.moreReadouts")),
                          1
                          /* TEXT */
                        ),
                        n("div", tc, [
                          F.value.help_seek != null ? (_(), v("div", ic, [
                            n(
                              "span",
                              null,
                              r(a("life.companion.metric.helpSeeking")),
                              1
                              /* TEXT */
                            ),
                            n(
                              "strong",
                              null,
                              r(Le(F.value.help_seek, 2)),
                              1
                              /* TEXT */
                            )
                          ])) : E("v-if", !0),
                          F.value.big5 ? (_(), v("div", nc, [
                            u[105] || (u[105] = n(
                              "span",
                              null,
                              "Big5 O·C·E·A·N",
                              -1
                              /* CACHED */
                            )),
                            n(
                              "strong",
                              null,
                              r(Ri.value),
                              1
                              /* TEXT */
                            )
                          ])) : E("v-if", !0),
                          F.value.hexaco ? (_(), v("div", oc, [
                            u[106] || (u[106] = n(
                              "span",
                              null,
                              "HEXACO H·E·X·A·C·O",
                              -1
                              /* CACHED */
                            )),
                            n(
                              "strong",
                              null,
                              r(Vi.value),
                              1
                              /* TEXT */
                            )
                          ])) : E("v-if", !0),
                          F.value.mbti ? (_(), v("div", ac, [
                            u[107] || (u[107] = n(
                              "span",
                              null,
                              "MBTI / DISC",
                              -1
                              /* CACHED */
                            )),
                            n(
                              "strong",
                              null,
                              r(F.value.mbti) + " · " + r(F.value.disc || "—"),
                              1
                              /* TEXT */
                            )
                          ])) : E("v-if", !0),
                          F.value.theta_dim ? (_(), v("div", sc, [
                            n(
                              "span",
                              null,
                              r(a("life.companion.metric.thetaDim")),
                              1
                              /* TEXT */
                            ),
                            n(
                              "strong",
                              null,
                              r(a("life.companion.dimensionsValue", { n: F.value.theta_dim })) + " · " + r(F.value.family || "—"),
                              1
                              /* TEXT */
                            )
                          ])) : E("v-if", !0),
                          hi.value.length ? (_(), v("div", rc, [
                            n(
                              "span",
                              null,
                              r(a("life.companion.metric.topDesires")),
                              1
                              /* TEXT */
                            ),
                            n(
                              "strong",
                              null,
                              r(hi.value.join(" · ")),
                              1
                              /* TEXT */
                            )
                          ])) : E("v-if", !0),
                          dn.value.length ? (_(), v("div", lc, [
                            n(
                              "span",
                              null,
                              r(a("life.companion.metric.topEmotions")),
                              1
                              /* TEXT */
                            ),
                            n(
                              "strong",
                              null,
                              r(dn.value.join(" · ")),
                              1
                              /* TEXT */
                            )
                          ])) : E("v-if", !0),
                          F.value.learning?.enabled ? (_(), v("div", uc, [
                            n(
                              "span",
                              null,
                              r(a("life.companion.metric.learningState")),
                              1
                              /* TEXT */
                            ),
                            n(
                              "strong",
                              null,
                              r(F.value.learning.q_size) + " · " + r(Le(hn.value, 3)),
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
                  n("details", cc, [
                    n(
                      "summary",
                      null,
                      r(a("life.companion.realtime.moreReadouts")),
                      1
                      /* TEXT */
                    ),
                    n("div", dc, [
                      n("div", hc, [
                        n(
                          "span",
                          null,
                          r(a("life.companion.metric.arbitrationMode")),
                          1
                          /* TEXT */
                        ),
                        n(
                          "strong",
                          null,
                          r(_t.value?.mode || "—"),
                          1
                          /* TEXT */
                        )
                      ]),
                      n("div", pc, [
                        n(
                          "span",
                          null,
                          r(a("life.companion.metric.currentStrategy")),
                          1
                          /* TEXT */
                        ),
                        n(
                          "strong",
                          null,
                          r(_t.value?.action || "—"),
                          1
                          /* TEXT */
                        )
                      ]),
                      n("div", fc, [
                        n(
                          "span",
                          null,
                          r(a("life.companion.metric.controlNeed")),
                          1
                          /* TEXT */
                        ),
                        n(
                          "strong",
                          null,
                          r(Le(_t.value?.need)),
                          1
                          /* TEXT */
                        )
                      ]),
                      n("div", mc, [
                        n(
                          "span",
                          null,
                          r(a("life.companion.metric.confidence")),
                          1
                          /* TEXT */
                        ),
                        n(
                          "strong",
                          null,
                          r(Le(_t.value?.confidence)),
                          1
                          /* TEXT */
                        )
                      ]),
                      n("div", _c, [
                        n(
                          "span",
                          null,
                          r(a("life.companion.metric.decidedTurns")),
                          1
                          /* TEXT */
                        ),
                        n(
                          "strong",
                          null,
                          r(V.value?.turns ?? 0),
                          1
                          /* TEXT */
                        )
                      ]),
                      n("div", vc, [
                        n(
                          "span",
                          null,
                          r(a("life.companion.metric.engrams")),
                          1
                          /* TEXT */
                        ),
                        n(
                          "strong",
                          null,
                          r(V.value?.engrams ?? 0),
                          1
                          /* TEXT */
                        )
                      ]),
                      n("div", gc, [
                        n(
                          "span",
                          null,
                          r(a("life.companion.metric.reliability")),
                          1
                          /* TEXT */
                        ),
                        n(
                          "strong",
                          null,
                          r(Le(V.value?.reliability)),
                          1
                          /* TEXT */
                        )
                      ]),
                      n("div", yc, [
                        n(
                          "span",
                          null,
                          r(a("life.companion.metric.personaTraits")),
                          1
                          /* TEXT */
                        ),
                        n(
                          "strong",
                          null,
                          r(X.value?.applied ? X.value.source === "llm" ? a("life.companion.metric.appliedLlm") : a("life.companion.metric.appliedLocal") : a("life.companion.metric.notParsed")),
                          1
                          /* TEXT */
                        )
                      ]),
                      n("div", bc, [
                        n(
                          "span",
                          null,
                          r(a("life.companion.metric.lexicon")),
                          1
                          /* TEXT */
                        ),
                        n(
                          "strong",
                          null,
                          r(T.value?.lexicon_size ?? 0),
                          1
                          /* TEXT */
                        )
                      ]),
                      ct.value ? (_(), v(
                        Q,
                        { key: 0 },
                        [
                          n("div", wc, [
                            n(
                              "span",
                              null,
                              r(a("life.companion.metric.episodeCourse")),
                              1
                              /* TEXT */
                            ),
                            n(
                              "strong",
                              null,
                              r(Di(ct.value.state)),
                              1
                              /* TEXT */
                            )
                          ]),
                          n("div", xc, [
                            n(
                              "span",
                              null,
                              r(a("life.companion.metric.episodeSeverity")),
                              1
                              /* TEXT */
                            ),
                            n(
                              "strong",
                              null,
                              r(Le(ct.value.severity, 2)),
                              1
                              /* TEXT */
                            )
                          ]),
                          n("div", kc, [
                            n(
                              "span",
                              null,
                              r(a("life.companion.metric.episodesRelapses")),
                              1
                              /* TEXT */
                            ),
                            n(
                              "strong",
                              null,
                              r(ct.value.episodes) + " / " + r(ct.value.relapses),
                              1
                              /* TEXT */
                            )
                          ]),
                          ct.value.state === "episode" ? (_(), v("div", Pc, [
                            n(
                              "span",
                              null,
                              r(a("life.companion.metric.duration")),
                              1
                              /* TEXT */
                            ),
                            n(
                              "strong",
                              null,
                              r(a("life.companion.daysValue", { n: Le(ct.value.days_in_episode, 1) })),
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
              )) : (_(), v(
                "div",
                nl,
                r(a("life.companion.realtime.empty")),
                1
                /* TEXT */
              )),
              ct.value ? (_(), v(
                "p",
                Lc,
                r(a("life.companion.realtime.episodeHint")),
                1
                /* TEXT */
              )) : E("v-if", !0),
              $.value?.enabled ? (_(), v(
                "p",
                Tc,
                r(a("life.companion.realtime.attachmentHint", { label: $.value.label, severity: Le($.value.severity, 2), band: $.value.band, safety: $.value.safe_mode ? a("life.companion.realtime.safetyOnEmotion") : a("life.companion.realtime.safetyOff") })),
                1
                /* TEXT */
              )) : E("v-if", !0),
              ge.value?.enabled ? (_(), v(
                "p",
                Sc,
                r(a("life.companion.realtime.tsundereHint", { label: ge.value.label || ge.value.type, affection: Le(ge.value.affection, 2), expression: Le(ge.value.expression, 2), fixation: Le(ge.value.fixation, 2), band: ge.value.band, safety: ge.value.safe_mode ? a("life.companion.realtime.safetyOnFeeling") : a("life.companion.realtime.safetyOff") })),
                1
                /* TEXT */
              )) : E("v-if", !0),
              F.value?.enabled ? (_(), v(
                "p",
                Cc,
                r(a("life.companion.realtime.personadynHint", { label: F.value.label || F.value.type, family: F.value.family || "—", theta: F.value.theta_dim, mode: F.value.mode_label || F.value.mode, pressure: Le(F.value.pressure, 2), band: F.value.band, gender: F.value.gender || re("life.companion.pdGender.unspecified"), learning: F.value.learning?.enabled ? a("life.companion.realtime.learningOnline") : "", safety: F.value.safe_mode ? a("life.companion.realtime.safetyOnFeeling") : a("life.companion.realtime.safetyOff") })),
                1
                /* TEXT */
              )) : E("v-if", !0),
              X.value?.applied ? (_(), v(
                "p",
                Mc,
                r(a("life.companion.realtime.personaApplied", { source: X.value.source === "llm" ? a("life.companion.realtime.personaSourceLlm") : a("life.companion.realtime.personaSourceLocal"), evidence: yn.value || "—" })),
                1
                /* TEXT */
              )) : E("v-if", !0)
            ]),
            n("article", zc, [
              n(
                "h3",
                null,
                r(a("life.companion.switches.title")),
                1
                /* TEXT */
              ),
              n("div", Ec, [
                n("label", Oc, [
                  P(n(
                    "input",
                    {
                      type: "checkbox",
                      "onUpdate:modelValue": u[42] || (u[42] = (l) => w.value.cog_enabled = l)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [fe, w.value.cog_enabled]
                  ]),
                  n(
                    "span",
                    null,
                    r(a("life.companion.switches.enableCognition")),
                    1
                    /* TEXT */
                  )
                ]),
                n("label", Ac, [
                  P(n(
                    "input",
                    {
                      type: "checkbox",
                      "onUpdate:modelValue": u[43] || (u[43] = (l) => w.value.cog_lite_mode = l)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [fe, w.value.cog_lite_mode]
                  ]),
                  n(
                    "span",
                    null,
                    r(a("life.companion.switches.liteMode")),
                    1
                    /* TEXT */
                  )
                ]),
                n("label", Ic, [
                  P(n(
                    "input",
                    {
                      type: "checkbox",
                      "onUpdate:modelValue": u[44] || (u[44] = (l) => w.value.cog_modulate_affect = l)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [fe, w.value.cog_modulate_affect]
                  ]),
                  n(
                    "span",
                    null,
                    r(a("life.companion.switches.modulateAffect")),
                    1
                    /* TEXT */
                  )
                ]),
                n("label", Bc, [
                  P(n(
                    "input",
                    {
                      type: "checkbox",
                      "onUpdate:modelValue": u[45] || (u[45] = (l) => w.value.cog_modulate_language = l)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [fe, w.value.cog_modulate_language]
                  ]),
                  n(
                    "span",
                    null,
                    r(a("life.companion.switches.modulateLanguage")),
                    1
                    /* TEXT */
                  )
                ]),
                n("label", Zc, [
                  P(n(
                    "input",
                    {
                      type: "checkbox",
                      "onUpdate:modelValue": u[46] || (u[46] = (l) => w.value.cog_modulate_social = l)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [fe, w.value.cog_modulate_social]
                  ]),
                  n(
                    "span",
                    null,
                    r(a("life.companion.switches.modulateSocial")),
                    1
                    /* TEXT */
                  )
                ]),
                n("label", Nc, [
                  P(n(
                    "input",
                    {
                      type: "checkbox",
                      "onUpdate:modelValue": u[47] || (u[47] = (l) => w.value.cog_modulate_selfhood = l)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [fe, w.value.cog_modulate_selfhood]
                  ]),
                  n(
                    "span",
                    null,
                    r(a("life.companion.switches.modulateSelfhood")),
                    1
                    /* TEXT */
                  )
                ])
              ]),
              n(
                "p",
                Rc,
                r(a("life.companion.switches.hint")),
                1
                /* TEXT */
              )
            ]),
            n("article", Vc, [
              n(
                "h3",
                null,
                r(a("life.companion.presets.title")),
                1
                /* TEXT */
              ),
              n(
                "p",
                Dc,
                r(a("life.companion.presets.hint")),
                1
                /* TEXT */
              ),
              n("div", $c, [
                (_(), v(
                  Q,
                  null,
                  Te(_n, (l) => n("button", {
                    key: l.label,
                    type: "button",
                    class: "btn sm",
                    onClick: (O) => Ui(l.fields, l.label)
                  }, r(a(l.labelKey)), 9, Uc)),
                  64
                  /* STABLE_FRAGMENT */
                ))
              ])
            ]),
            n("div", Fc, [
              n("article", Hc, [
                n(
                  "h3",
                  null,
                  r(a("life.companion.decision.title")),
                  1
                  /* TEXT */
                ),
                n("div", Wc, [
                  n("label", null, [
                    n(
                      "span",
                      null,
                      r(a("life.companion.decision.planDepth")),
                      1
                      /* TEXT */
                    ),
                    P(n(
                      "input",
                      {
                        "onUpdate:modelValue": u[48] || (u[48] = (l) => w.value.cog_plan_depth = l),
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
                        C,
                        w.value.cog_plan_depth,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  n("label", null, [
                    n(
                      "span",
                      null,
                      r(a("life.companion.decision.wmCapacity")),
                      1
                      /* TEXT */
                    ),
                    P(n(
                      "input",
                      {
                        "onUpdate:modelValue": u[49] || (u[49] = (l) => w.value.cog_wm_capacity = l),
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
                        C,
                        w.value.cog_wm_capacity,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  n("label", null, [
                    n(
                      "span",
                      null,
                      r(a("life.companion.decision.strategyTemp")),
                      1
                      /* TEXT */
                    ),
                    P(n(
                      "input",
                      {
                        "onUpdate:modelValue": u[50] || (u[50] = (l) => w.value.cog_tau = l),
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
                        C,
                        w.value.cog_tau,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  n("label", null, [
                    n(
                      "span",
                      null,
                      r(a("life.companion.decision.discount")),
                      1
                      /* TEXT */
                    ),
                    P(n(
                      "input",
                      {
                        "onUpdate:modelValue": u[51] || (u[51] = (l) => w.value.cog_gamma = l),
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
                        C,
                        w.value.cog_gamma,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  n("label", null, [
                    n(
                      "span",
                      null,
                      r(a("life.companion.decision.habitRate")),
                      1
                      /* TEXT */
                    ),
                    P(n(
                      "input",
                      {
                        "onUpdate:modelValue": u[52] || (u[52] = (l) => w.value.cog_alpha_habit = l),
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
                        C,
                        w.value.cog_alpha_habit,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  n("label", null, [
                    n(
                      "span",
                      null,
                      r(a("life.companion.decision.modelfreeRate")),
                      1
                      /* TEXT */
                    ),
                    P(n(
                      "input",
                      {
                        "onUpdate:modelValue": u[53] || (u[53] = (l) => w.value.cog_alpha_mf = l),
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
                        C,
                        w.value.cog_alpha_mf,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  n("label", null, [
                    n(
                      "span",
                      null,
                      r(a("life.companion.decision.surpriseThreshold")),
                      1
                      /* TEXT */
                    ),
                    P(n(
                      "input",
                      {
                        "onUpdate:modelValue": u[54] || (u[54] = (l) => w.value.cog_theta_pe = l),
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
                        C,
                        w.value.cog_theta_pe,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  n("label", null, [
                    n(
                      "span",
                      null,
                      r(a("life.companion.decision.noveltyThreshold")),
                      1
                      /* TEXT */
                    ),
                    P(n(
                      "input",
                      {
                        "onUpdate:modelValue": u[55] || (u[55] = (l) => w.value.cog_theta_n = l),
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
                        C,
                        w.value.cog_theta_n,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  n("label", null, [
                    n(
                      "span",
                      null,
                      r(a("life.companion.decision.prospectionHorizon")),
                      1
                      /* TEXT */
                    ),
                    P(n(
                      "input",
                      {
                        "onUpdate:modelValue": u[56] || (u[56] = (l) => w.value.cog_prospection_horizon = l),
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
                        C,
                        w.value.cog_prospection_horizon,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ])
                ]),
                n("div", Gc, [
                  n("label", jc, [
                    P(n(
                      "input",
                      {
                        type: "checkbox",
                        "onUpdate:modelValue": u[57] || (u[57] = (l) => w.value.cog_use_thalamic_gate = l)
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [fe, w.value.cog_use_thalamic_gate]
                    ]),
                    n(
                      "span",
                      null,
                      r(a("life.companion.decision.thalamicGate")),
                      1
                      /* TEXT */
                    )
                  ]),
                  n("label", qc, [
                    P(n(
                      "input",
                      {
                        type: "checkbox",
                        "onUpdate:modelValue": u[58] || (u[58] = (l) => w.value.cog_use_cerebellum = l)
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [fe, w.value.cog_use_cerebellum]
                    ]),
                    n(
                      "span",
                      null,
                      r(a("life.companion.decision.cerebellum")),
                      1
                      /* TEXT */
                    )
                  ]),
                  n("label", Kc, [
                    P(n(
                      "input",
                      {
                        type: "checkbox",
                        "onUpdate:modelValue": u[59] || (u[59] = (l) => w.value.cog_use_ofc_map = l)
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [fe, w.value.cog_use_ofc_map]
                    ]),
                    n(
                      "span",
                      null,
                      r(a("life.companion.decision.ofcMap")),
                      1
                      /* TEXT */
                    )
                  ]),
                  n("label", Yc, [
                    P(n(
                      "input",
                      {
                        type: "checkbox",
                        "onUpdate:modelValue": u[60] || (u[60] = (l) => w.value.cog_use_prospection = l)
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [fe, w.value.cog_use_prospection]
                    ]),
                    n(
                      "span",
                      null,
                      r(a("life.companion.decision.prospection")),
                      1
                      /* TEXT */
                    )
                  ]),
                  n("label", Jc, [
                    P(n(
                      "input",
                      {
                        type: "checkbox",
                        "onUpdate:modelValue": u[61] || (u[61] = (l) => w.value.cog_use_limbic_bias = l)
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [fe, w.value.cog_use_limbic_bias]
                    ]),
                    n(
                      "span",
                      null,
                      r(a("life.companion.decision.limbicBias")),
                      1
                      /* TEXT */
                    )
                  ])
                ])
              ]),
              n("article", Xc, [
                n(
                  "h3",
                  null,
                  r(a("life.companion.affect.title")),
                  1
                  /* TEXT */
                ),
                n("div", Qc, [
                  n("label", null, [
                    n(
                      "span",
                      null,
                      r(a("life.companion.persona.erqProfile")),
                      1
                      /* TEXT */
                    ),
                    Oe(Ve(De), {
                      modelValue: w.value.cog_affect_profile,
                      "onUpdate:modelValue": u[62] || (u[62] = (l) => w.value.cog_affect_profile = l),
                      options: $e.value,
                      "aria-label": a("life.companion.persona.erqProfile")
                    }, null, 8, ["modelValue", "options", "aria-label"])
                  ]),
                  n("label", null, [
                    n(
                      "span",
                      null,
                      r(a("life.companion.affect.vagalBaseline")),
                      1
                      /* TEXT */
                    ),
                    P(n(
                      "input",
                      {
                        "onUpdate:modelValue": u[63] || (u[63] = (l) => w.value.cog_affect_vagal = l),
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
                        C,
                        w.value.cog_affect_vagal,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  n("label", null, [
                    n(
                      "span",
                      null,
                      r(a("life.companion.persona.threatBaseline")),
                      1
                      /* TEXT */
                    ),
                    P(n(
                      "input",
                      {
                        "onUpdate:modelValue": u[64] || (u[64] = (l) => w.value.cog_affect_threat = l),
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
                        C,
                        w.value.cog_affect_threat,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  n("label", null, [
                    n(
                      "span",
                      null,
                      r(a("life.companion.persona.rewardBaseline")),
                      1
                      /* TEXT */
                    ),
                    P(n(
                      "input",
                      {
                        "onUpdate:modelValue": u[65] || (u[65] = (l) => w.value.cog_affect_reward = l),
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
                        C,
                        w.value.cog_affect_reward,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ])
                ]),
                n("label", ed, [
                  P(n(
                    "input",
                    {
                      type: "checkbox",
                      "onUpdate:modelValue": u[66] || (u[66] = (l) => w.value.cog_affect_enabled = l)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [fe, w.value.cog_affect_enabled]
                  ]),
                  n(
                    "span",
                    null,
                    r(a("life.companion.affect.enable")),
                    1
                    /* TEXT */
                  )
                ]),
                n("label", td, [
                  P(n(
                    "input",
                    {
                      type: "checkbox",
                      "onUpdate:modelValue": u[67] || (u[67] = (l) => w.value.cog_affect_somatic = l)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [fe, w.value.cog_affect_somatic]
                  ]),
                  n(
                    "span",
                    null,
                    r(a("life.companion.affect.somatic")),
                    1
                    /* TEXT */
                  )
                ]),
                n("label", id, [
                  P(n(
                    "input",
                    {
                      type: "checkbox",
                      "onUpdate:modelValue": u[68] || (u[68] = (l) => w.value.cog_affect_persona_llm = l)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [fe, w.value.cog_affect_persona_llm]
                  ]),
                  n(
                    "span",
                    null,
                    r(a("life.companion.affect.personaLlm")),
                    1
                    /* TEXT */
                  )
                ])
              ]),
              n("article", nd, [
                n(
                  "h3",
                  null,
                  r(a("life.companion.language.title")),
                  1
                  /* TEXT */
                ),
                n("div", od, [
                  n("label", null, [
                    n(
                      "span",
                      null,
                      r(a("life.companion.language.framing")),
                      1
                      /* TEXT */
                    ),
                    Oe(Ve(De), {
                      modelValue: w.value.cog_language_framing,
                      "onUpdate:modelValue": u[69] || (u[69] = (l) => w.value.cog_language_framing = l),
                      options: Se.value,
                      "aria-label": a("life.companion.language.framing")
                    }, null, 8, ["modelValue", "options", "aria-label"])
                  ]),
                  n("label", null, [
                    n(
                      "span",
                      null,
                      r(a("life.companion.language.boundary")),
                      1
                      /* TEXT */
                    ),
                    P(n(
                      "input",
                      {
                        "onUpdate:modelValue": u[70] || (u[70] = (l) => w.value.cog_language_boundary = l),
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
                        C,
                        w.value.cog_language_boundary,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ])
                ]),
                n("label", ad, [
                  P(n(
                    "input",
                    {
                      type: "checkbox",
                      "onUpdate:modelValue": u[71] || (u[71] = (l) => w.value.cog_language_enabled = l)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [fe, w.value.cog_language_enabled]
                  ]),
                  n(
                    "span",
                    null,
                    r(a("life.companion.language.enable")),
                    1
                    /* TEXT */
                  )
                ])
              ]),
              n("article", sd, [
                n(
                  "h3",
                  null,
                  r(a("life.companion.social.title")),
                  1
                  /* TEXT */
                ),
                n("div", rd, [
                  n("label", null, [
                    n(
                      "span",
                      null,
                      r(a("life.companion.metric.empathy")),
                      1
                      /* TEXT */
                    ),
                    P(n(
                      "input",
                      {
                        "onUpdate:modelValue": u[72] || (u[72] = (l) => w.value.cog_social_empathy = l),
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
                        C,
                        w.value.cog_social_empathy,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  n("label", null, [
                    n(
                      "span",
                      null,
                      r(a("life.companion.social.perspectiveStage")),
                      1
                      /* TEXT */
                    ),
                    Oe(Ve(De), {
                      modelValue: je.value,
                      "onUpdate:modelValue": u[73] || (u[73] = (l) => je.value = l),
                      options: Bt.value,
                      "aria-label": a("life.companion.social.perspectiveStage")
                    }, null, 8, ["modelValue", "options", "aria-label"])
                  ])
                ]),
                n("label", ld, [
                  P(n(
                    "input",
                    {
                      type: "checkbox",
                      "onUpdate:modelValue": u[74] || (u[74] = (l) => w.value.cog_social_enabled = l)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [fe, w.value.cog_social_enabled]
                  ]),
                  n(
                    "span",
                    null,
                    r(a("life.companion.social.enable")),
                    1
                    /* TEXT */
                  )
                ])
              ]),
              n("article", ud, [
                n(
                  "h3",
                  null,
                  r(a("life.companion.selfhood.title")),
                  1
                  /* TEXT */
                ),
                n("div", cd, [
                  n("label", null, [
                    n(
                      "span",
                      null,
                      r(a("life.companion.selfhood.timeDiscount")),
                      1
                      /* TEXT */
                    ),
                    P(n(
                      "input",
                      {
                        "onUpdate:modelValue": u[75] || (u[75] = (l) => w.value.cog_selfhood_discount = l),
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
                        C,
                        w.value.cog_selfhood_discount,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  n("label", null, [
                    n(
                      "span",
                      null,
                      r(a("life.companion.selfhood.detailScale")),
                      1
                      /* TEXT */
                    ),
                    P(n(
                      "input",
                      {
                        "onUpdate:modelValue": u[76] || (u[76] = (l) => w.value.cog_selfhood_detail = l),
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
                        C,
                        w.value.cog_selfhood_detail,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ])
                ]),
                n("label", dd, [
                  P(n(
                    "input",
                    {
                      type: "checkbox",
                      "onUpdate:modelValue": u[77] || (u[77] = (l) => w.value.cog_selfhood_enabled = l)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [fe, w.value.cog_selfhood_enabled]
                  ]),
                  n(
                    "span",
                    null,
                    r(a("life.companion.selfhood.enable")),
                    1
                    /* TEXT */
                  )
                ])
              ]),
              n("article", hd, [
                n(
                  "h3",
                  null,
                  r(a("life.companion.attachmentCard.title")),
                  1
                  /* TEXT */
                ),
                n(
                  "p",
                  pd,
                  r(a("life.companion.attachmentCard.hint")),
                  1
                  /* TEXT */
                ),
                n("label", fd, [
                  P(n(
                    "input",
                    {
                      type: "checkbox",
                      "onUpdate:modelValue": u[78] || (u[78] = (l) => w.value.cog_attachment_enabled = l)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [fe, w.value.cog_attachment_enabled]
                  ]),
                  n(
                    "span",
                    null,
                    r(a("life.companion.attachmentCard.enable")),
                    1
                    /* TEXT */
                  )
                ]),
                n("div", md, [
                  n("label", null, [
                    n(
                      "span",
                      null,
                      r(a("life.companion.metric.attachmentType")),
                      1
                      /* TEXT */
                    ),
                    Oe(Ve(De), {
                      modelValue: w.value.cog_attachment_type,
                      "onUpdate:modelValue": u[79] || (u[79] = (l) => w.value.cog_attachment_type = l),
                      options: qt.value,
                      "aria-label": a("life.companion.metric.attachmentType")
                    }, null, 8, ["modelValue", "options", "aria-label"])
                  ])
                ]),
                n(
                  "p",
                  _d,
                  r(a("life.companion.attachmentCard.hint2")),
                  1
                  /* TEXT */
                )
              ]),
              n("article", vd, [
                n(
                  "h3",
                  null,
                  r(a("life.companion.tsundereCard.title")),
                  1
                  /* TEXT */
                ),
                n(
                  "p",
                  gd,
                  r(a("life.companion.tsundereCard.hint")),
                  1
                  /* TEXT */
                ),
                n("label", yd, [
                  P(n(
                    "input",
                    {
                      type: "checkbox",
                      "onUpdate:modelValue": u[80] || (u[80] = (l) => w.value.cog_tsundere_enabled = l)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [fe, w.value.cog_tsundere_enabled]
                  ]),
                  n(
                    "span",
                    null,
                    r(a("life.companion.tsundereCard.enable")),
                    1
                    /* TEXT */
                  )
                ]),
                n("div", bd, [
                  n("label", null, [
                    n(
                      "span",
                      null,
                      r(a("life.companion.persona.tsundereType")),
                      1
                      /* TEXT */
                    ),
                    Oe(Ve(De), {
                      modelValue: w.value.cog_tsundere_type,
                      "onUpdate:modelValue": u[81] || (u[81] = (l) => w.value.cog_tsundere_type = l),
                      options: At.value,
                      "aria-label": a("life.companion.persona.tsundereType")
                    }, null, 8, ["modelValue", "options", "aria-label"])
                  ])
                ]),
                n(
                  "p",
                  wd,
                  r(a("life.companion.tsundereCard.hint2")),
                  1
                  /* TEXT */
                )
              ]),
              n("article", xd, [
                n(
                  "h3",
                  null,
                  r(a("life.companion.yandereCard.title")),
                  1
                  /* TEXT */
                ),
                n(
                  "p",
                  kd,
                  r(a("life.companion.yandereCard.hint")),
                  1
                  /* TEXT */
                ),
                n("label", Pd, [
                  P(n(
                    "input",
                    {
                      type: "checkbox",
                      "onUpdate:modelValue": u[82] || (u[82] = (l) => w.value.cog_yandere_enabled = l)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [fe, w.value.cog_yandere_enabled]
                  ]),
                  n(
                    "span",
                    null,
                    r(a("life.companion.yandereCard.enable")),
                    1
                    /* TEXT */
                  )
                ]),
                n("div", Ld, [
                  n("label", null, [
                    n(
                      "span",
                      null,
                      r(a("life.companion.yandereCard.type")),
                      1
                      /* TEXT */
                    ),
                    Oe(Ve(De), {
                      modelValue: w.value.cog_yandere_type,
                      "onUpdate:modelValue": u[83] || (u[83] = (l) => w.value.cog_yandere_type = l),
                      options: Kt.value,
                      "aria-label": a("life.companion.yandereCard.type")
                    }, null, 8, ["modelValue", "options", "aria-label"])
                  ])
                ]),
                n(
                  "p",
                  Td,
                  r(a("life.companion.yandereCard.hint2")),
                  1
                  /* TEXT */
                )
              ]),
              n("article", Sd, [
                n(
                  "h3",
                  null,
                  r(a("life.companion.personadynCard.title")),
                  1
                  /* TEXT */
                ),
                n(
                  "p",
                  Cd,
                  r(a("life.companion.personadynCard.hint")),
                  1
                  /* TEXT */
                ),
                n("label", Md, [
                  P(n(
                    "input",
                    {
                      type: "checkbox",
                      "onUpdate:modelValue": u[84] || (u[84] = (l) => w.value.cog_personadyn_enabled = l)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [fe, w.value.cog_personadyn_enabled]
                  ]),
                  n(
                    "span",
                    null,
                    r(a("life.companion.personadynCard.enable")),
                    1
                    /* TEXT */
                  )
                ]),
                n("div", zd, [
                  n("label", null, [
                    n(
                      "span",
                      null,
                      r(a("life.companion.persona.personaArchetype")),
                      1
                      /* TEXT */
                    ),
                    Oe(Ve(De), {
                      modelValue: w.value.cog_personadyn_type,
                      "onUpdate:modelValue": u[85] || (u[85] = (l) => w.value.cog_personadyn_type = l),
                      options: ci.value,
                      "aria-label": a("life.companion.persona.personaArchetype")
                    }, null, 8, ["modelValue", "options", "aria-label"])
                  ]),
                  n("label", null, [
                    n(
                      "span",
                      null,
                      r(a("life.companion.persona.genderSocialScript")),
                      1
                      /* TEXT */
                    ),
                    Oe(Ve(De), {
                      modelValue: w.value.cog_personadyn_gender,
                      "onUpdate:modelValue": u[86] || (u[86] = (l) => w.value.cog_personadyn_gender = l),
                      options: It.value,
                      "aria-label": a("life.companion.persona.genderSocialScriptAria")
                    }, null, 8, ["modelValue", "options", "aria-label"])
                  ])
                ]),
                n(
                  "p",
                  Ed,
                  r(a("life.companion.personadynCard.hint2")),
                  1
                  /* TEXT */
                ),
                n(
                  "p",
                  Od,
                  r(a("life.companion.personadynCard.hint3")),
                  1
                  /* TEXT */
                )
              ]),
              n("article", Ad, [
                n(
                  "h3",
                  null,
                  r(a("life.companion.memoryCard.title")),
                  1
                  /* TEXT */
                ),
                n(
                  "p",
                  Id,
                  r(a("life.companion.memoryCard.hint")),
                  1
                  /* TEXT */
                ),
                n("div", Bd, [
                  n("label", Zd, [
                    P(n(
                      "input",
                      {
                        type: "checkbox",
                        "onUpdate:modelValue": u[87] || (u[87] = (l) => w.value.cog_memory_encode = l)
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [fe, w.value.cog_memory_encode]
                    ]),
                    n(
                      "span",
                      null,
                      r(a("life.companion.memoryCard.selectiveEncoding")),
                      1
                      /* TEXT */
                    )
                  ]),
                  n("label", Nd, [
                    P(n(
                      "input",
                      {
                        type: "checkbox",
                        "onUpdate:modelValue": u[88] || (u[88] = (l) => w.value.cog_sleep_replay = l)
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [fe, w.value.cog_sleep_replay]
                    ]),
                    n(
                      "span",
                      null,
                      r(a("life.companion.memoryCard.sleepReplay")),
                      1
                      /* TEXT */
                    )
                  ]),
                  n("label", Rd, [
                    P(n(
                      "input",
                      {
                        type: "checkbox",
                        "onUpdate:modelValue": u[89] || (u[89] = (l) => w.value.cog_memory_reconsolidate = l)
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [fe, w.value.cog_memory_reconsolidate]
                    ]),
                    n(
                      "span",
                      null,
                      r(a("life.companion.memoryCard.reconsolidate")),
                      1
                      /* TEXT */
                    )
                  ]),
                  n("label", Vd, [
                    P(n(
                      "input",
                      {
                        type: "checkbox",
                        "onUpdate:modelValue": u[90] || (u[90] = (l) => w.value.cog_cls_interleave = l)
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [fe, w.value.cog_cls_interleave]
                    ]),
                    n(
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
          [un, Ae.value === "cognition"]
        ]),
        P(n(
          "section",
          Dd,
          [
            n("div", $d, [
              n("div", null, [
                n(
                  "h2",
                  null,
                  r(a("life.companion.world.title")),
                  1
                  /* TEXT */
                ),
                n(
                  "p",
                  Ud,
                  r(a("life.companion.world.desc")),
                  1
                  /* TEXT */
                )
              ]),
              n("div", Fd, [
                n(
                  "button",
                  {
                    class: "btn filled sm",
                    onClick: H
                  },
                  r(a("life.companion.saveSettings")),
                  1
                  /* TEXT */
                )
              ])
            ]),
            n("article", Hd, [
              n(
                "h3",
                null,
                r(a("life.companion.world.density")),
                1
                /* TEXT */
              ),
              n("div", Wd, [
                n("label", null, [
                  n(
                    "span",
                    null,
                    r(a("life.companion.world.density")),
                    1
                    /* TEXT */
                  ),
                  Oe(Ve(De), {
                    modelValue: gi.value,
                    "onUpdate:modelValue": u[91] || (u[91] = (l) => gi.value = l),
                    options: Yn.value,
                    "aria-label": a("life.companion.world.densityAria")
                  }, null, 8, ["modelValue", "options", "aria-label"])
                ])
              ]),
              n(
                "p",
                Gd,
                r(a("life.companion.world.densityHint")),
                1
                /* TEXT */
              )
            ]),
            n("article", jd, [
              n(
                "h3",
                null,
                r(a("life.companion.world.personaTraits")),
                1
                /* TEXT */
              ),
              n(
                "p",
                qd,
                r(a("life.companion.world.personaTraitsHint")),
                1
                /* TEXT */
              ),
              n("label", Kd, [
                n(
                  "span",
                  Yd,
                  r(a("life.companion.world.personaText")),
                  1
                  /* TEXT */
                ),
                P(n("textarea", {
                  "onUpdate:modelValue": u[92] || (u[92] = (l) => xi.value = l),
                  class: "world-text",
                  rows: "4",
                  placeholder: a("life.companion.world.personaPlaceholder")
                }, null, 8, Jd), [
                  [C, xi.value]
                ])
              ])
            ]),
            n("article", Xd, [
              n(
                "h3",
                null,
                r(a("life.companion.world.location")),
                1
                /* TEXT */
              ),
              n(
                "p",
                Qd,
                r(a("life.companion.world.locationHint")),
                1
                /* TEXT */
              ),
              n("div", eh, [
                n("label", null, [
                  n(
                    "span",
                    null,
                    r(a("life.companion.world.worldType")),
                    1
                    /* TEXT */
                  ),
                  Oe(Ve(De), {
                    modelValue: yi.value,
                    "onUpdate:modelValue": u[93] || (u[93] = (l) => yi.value = l),
                    options: ni.value,
                    "aria-label": a("life.companion.world.worldType")
                  }, null, 8, ["modelValue", "options", "aria-label"])
                ]),
                n("label", null, [
                  n(
                    "span",
                    null,
                    r(a("life.companion.world.country")),
                    1
                    /* TEXT */
                  ),
                  P(n("input", {
                    "onUpdate:modelValue": u[94] || (u[94] = (l) => ii.value = l),
                    class: "field",
                    placeholder: a("life.companion.world.countryPlaceholder")
                  }, null, 8, th), [
                    [C, ii.value]
                  ])
                ]),
                n("label", null, [
                  n(
                    "span",
                    null,
                    r(a("life.companion.world.city")),
                    1
                    /* TEXT */
                  ),
                  P(n("input", {
                    "onUpdate:modelValue": u[95] || (u[95] = (l) => bi.value = l),
                    class: "field",
                    placeholder: a("life.companion.world.cityPlaceholder")
                  }, null, 8, ih), [
                    [C, bi.value]
                  ])
                ]),
                n("label", null, [
                  n(
                    "span",
                    null,
                    r(a("life.companion.world.district")),
                    1
                    /* TEXT */
                  ),
                  P(n("input", {
                    "onUpdate:modelValue": u[96] || (u[96] = (l) => Pt.value = l),
                    class: "field",
                    placeholder: a("life.companion.world.districtPlaceholder")
                  }, null, 8, nh), [
                    [C, Pt.value]
                  ])
                ])
              ]),
              n("label", oh, [
                n(
                  "span",
                  ah,
                  r(a("life.companion.world.premiseLabel")),
                  1
                  /* TEXT */
                ),
                P(n("textarea", {
                  "onUpdate:modelValue": u[97] || (u[97] = (l) => wi.value = l),
                  class: "world-text",
                  rows: "3",
                  placeholder: a("life.companion.world.premisePlaceholder")
                }, null, 8, sh), [
                  [C, wi.value]
                ])
              ]),
              n("label", rh, [
                n(
                  "span",
                  lh,
                  r(a("life.companion.world.actorsLabel")),
                  1
                  /* TEXT */
                ),
                P(n("textarea", {
                  "onUpdate:modelValue": u[98] || (u[98] = (l) => ki.value = l),
                  class: "world-text",
                  rows: "4",
                  placeholder: a("life.companion.world.actorsPlaceholder")
                }, null, 8, uh), [
                  [C, ki.value]
                ])
              ]),
              n("label", ch, [
                n(
                  "span",
                  dh,
                  r(a("life.companion.world.placesLabel")),
                  1
                  /* TEXT */
                ),
                P(n("textarea", {
                  "onUpdate:modelValue": u[99] || (u[99] = (l) => Pi.value = l),
                  class: "world-text",
                  rows: "2",
                  placeholder: a("life.companion.world.placesPlaceholder")
                }, null, 8, hh), [
                  [C, Pi.value]
                ])
              ]),
              n("div", ph, [
                n("button", {
                  class: "btn filled sm",
                  type: "button",
                  disabled: ot.value,
                  onClick: Ji
                }, r(ot.value ? a("life.companion.world.generating") : a("life.companion.world.generateMapOnly")), 9, fh),
                n("button", {
                  class: "btn tonic sm",
                  type: "button",
                  disabled: ot.value,
                  onClick: Yi
                }, r(ot.value ? a("life.companion.world.generating") : a("life.companion.world.generateWorld")), 9, mh),
                n(
                  "span",
                  _h,
                  r(a("life.companion.world.generateHint")),
                  1
                  /* TEXT */
                )
              ])
            ]),
            n("article", vh, [
              n("div", gh, [
                n("h3", null, [
                  N(
                    r(a("life.companion.world.map")) + " ",
                    1
                    /* TEXT */
                  ),
                  n(
                    "span",
                    yh,
                    r(te.value.locations.length),
                    1
                    /* TEXT */
                  )
                ]),
                at.value ? (_(), v(
                  "span",
                  bh,
                  r(at.value.fictional ? a("life.companion.worldFictional.fictional") : a("life.companion.worldFictional.real")) + " · " + r([at.value.country, at.value.city, at.value.district].filter(Boolean).join(" / ") || a("life.companion.world.unnamed")),
                  1
                  /* TEXT */
                )) : E("v-if", !0)
              ]),
              at.value?.premise ? (_(), v(
                "p",
                wh,
                r(at.value.premise),
                1
                /* TEXT */
              )) : E("v-if", !0),
              n("div", xh, [
                n(
                  "div",
                  {
                    ref_key: "mapEl",
                    ref: $t,
                    class: Y(["world-map-leaflet", { "is-empty": !te.value.locations.length }])
                  },
                  null,
                  2
                  /* CLASS */
                ),
                j.value ? (_(), v(
                  "div",
                  kh,
                  r(a("life.companion.world.offline")),
                  1
                  /* TEXT */
                )) : E("v-if", !0),
                te.value.locations.length ? (_(), v(
                  Q,
                  { key: 1 },
                  [
                    te.value.kind !== "real" && te.value.nation ? (_(), v(
                      "button",
                      {
                        key: 0,
                        type: "button",
                        class: "wm-scope",
                        onClick: ji
                      },
                      r(qe.value === "city" ? a("life.companion.world.nationView") : a("life.companion.world.cityView")),
                      1
                      /* TEXT */
                    )) : E("v-if", !0),
                    n(
                      "button",
                      {
                        type: "button",
                        class: "wm-reset",
                        onClick: si
                      },
                      r(a("life.companion.world.resetView")),
                      1
                      /* TEXT */
                    ),
                    te.value.kind !== "real" && qe.value === "city" ? (_(), v("div", Ph, [...u[108] || (u[108] = [
                      n(
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
              te.value.locations.length ? E("v-if", !0) : (_(), v(
                "p",
                Lh,
                r(a("life.companion.world.noMap")),
                1
                /* TEXT */
              )),
              te.value.locations.length ? (_(), v("div", Th, [
                (_(!0), v(
                  Q,
                  null,
                  Te(Dt.value, (l) => (_(), v("span", { key: l }, [
                    n(
                      "i",
                      {
                        class: Y("k-" + l)
                      },
                      null,
                      2
                      /* CLASS */
                    ),
                    N(
                      r(a(be[l])),
                      1
                      /* TEXT */
                    )
                  ]))),
                  128
                  /* KEYED_FRAGMENT */
                )),
                n("span", null, [
                  u[109] || (u[109] = n(
                    "i",
                    { class: "k-actor" },
                    null,
                    -1
                    /* CACHED */
                  )),
                  N(
                    r(a("life.companion.world.actorsCount", { n: te.value.actors.length })),
                    1
                    /* TEXT */
                  )
                ]),
                te.value.kind !== "real" ? (_(), v(
                  Q,
                  { key: 0 },
                  [
                    n("span", null, [
                      u[110] || (u[110] = n(
                        "i",
                        { class: "k-hw" },
                        null,
                        -1
                        /* CACHED */
                      )),
                      N(
                        r(a("life.companion.world.highwayLoop")),
                        1
                        /* TEXT */
                      )
                    ]),
                    n("span", null, [
                      u[111] || (u[111] = n(
                        "i",
                        { class: "k-arterial" },
                        null,
                        -1
                        /* CACHED */
                      )),
                      N(
                        r(a("life.companion.world.arterial")),
                        1
                        /* TEXT */
                      )
                    ]),
                    n("span", null, [
                      u[112] || (u[112] = n(
                        "i",
                        { class: "k-street" },
                        null,
                        -1
                        /* CACHED */
                      )),
                      N(
                        r(a("life.companion.world.street")),
                        1
                        /* TEXT */
                      )
                    ]),
                    n("span", null, [
                      u[113] || (u[113] = n(
                        "i",
                        { class: "k-metro" },
                        null,
                        -1
                        /* CACHED */
                      )),
                      N(
                        r(a("life.companion.world.metro")),
                        1
                        /* TEXT */
                      )
                    ]),
                    n("span", null, [
                      u[114] || (u[114] = n(
                        "i",
                        { class: "k-bus" },
                        null,
                        -1
                        /* CACHED */
                      )),
                      N(
                        r(a("life.companion.world.bus")),
                        1
                        /* TEXT */
                      )
                    ]),
                    n("span", null, [
                      u[115] || (u[115] = n(
                        "i",
                        { class: "k-park2" },
                        null,
                        -1
                        /* CACHED */
                      )),
                      N(
                        r(a("life.companion.kind.park")),
                        1
                        /* TEXT */
                      )
                    ]),
                    n("span", null, [
                      u[116] || (u[116] = n(
                        "i",
                        { class: "k-water" },
                        null,
                        -1
                        /* CACHED */
                      )),
                      N(
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
              te.value.locations.length && te.value.kind !== "real" && qe.value === "city" ? (_(), v("div", Sh, [
                (te.value.metro || []).length ? (_(), v("div", Ch, [
                  n(
                    "h4",
                    null,
                    r(a("life.companion.world.metroRoutes")),
                    1
                    /* TEXT */
                  ),
                  n("ul", null, [
                    (_(!0), v(
                      Q,
                      null,
                      Te(te.value.metro, (l, O) => (_(), v("li", {
                        key: "m" + O
                      }, [
                        n(
                          "b",
                          {
                            style: et({ color: l.color })
                          },
                          r(l.name),
                          5
                          /* TEXT, STYLE */
                        ),
                        n(
                          "span",
                          null,
                          r((l.stations || []).map((z) => z.name).filter(Boolean).join(" · ")),
                          1
                          /* TEXT */
                        )
                      ]))),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ])
                ])) : E("v-if", !0),
                (te.value.bus || []).length ? (_(), v("div", Mh, [
                  n(
                    "h4",
                    null,
                    r(a("life.companion.world.busRoutes")),
                    1
                    /* TEXT */
                  ),
                  n("ul", null, [
                    (_(!0), v(
                      Q,
                      null,
                      Te(te.value.bus, (l, O) => (_(), v("li", {
                        key: "b" + O
                      }, [
                        n(
                          "b",
                          {
                            style: et({ color: l.color })
                          },
                          r(l.name),
                          5
                          /* TEXT, STYLE */
                        ),
                        n(
                          "span",
                          null,
                          r((l.stops || []).map((z) => z.name).filter(Boolean).join(" · ")),
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
            n("article", zh, [
              n("div", Eh, [
                n("h3", null, [
                  N(
                    r(a("life.companion.world.recentEvents")) + " ",
                    1
                    /* TEXT */
                  ),
                  n(
                    "span",
                    Oh,
                    r(Xt.value.length),
                    1
                    /* TEXT */
                  )
                ]),
                Xt.value.length ? (_(), v(
                  "button",
                  {
                    key: 0,
                    type: "button",
                    class: "btn tonic sm",
                    onClick: Xi
                  },
                  r(a("life.companion.world.clearTitle")),
                  1
                  /* TEXT */
                )) : E("v-if", !0)
              ]),
              n("ol", Ah, [
                (_(!0), v(
                  Q,
                  null,
                  Te(Xt.value, (l) => (_(), v("li", {
                    key: l.id
                  }, [
                    n(
                      "span",
                      Ih,
                      r(l.created_at),
                      1
                      /* TEXT */
                    ),
                    n(
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
                Xt.value.length ? E("v-if", !0) : (_(), v(
                  "li",
                  Bh,
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
          [un, Ae.value === "world"]
        ]),
        P(n(
          "section",
          Zh,
          [
            Oe(Ns)
          ],
          512
          /* NEED_PATCH */
        ), [
          [un, Ae.value === "adapters"]
        ]),
        P(n(
          "section",
          Nh,
          [
            n("div", Rh, [
              n("div", null, [
                n(
                  "h2",
                  null,
                  r(a("life.companion.state.title")),
                  1
                  /* TEXT */
                ),
                n(
                  "p",
                  Vh,
                  r(a("life.companion.state.desc")),
                  1
                  /* TEXT */
                )
              ])
            ]),
            n("article", Dh, [
              n("h3", null, [
                N(
                  r(a("life.companion.state.relationships")) + " ",
                  1
                  /* TEXT */
                ),
                n(
                  "span",
                  $h,
                  r(mi.value.length),
                  1
                  /* TEXT */
                )
              ]),
              n(
                "p",
                Uh,
                r(a("life.companion.state.relationshipsHint")),
                1
                /* TEXT */
              ),
              n("ol", Fh, [
                (_(!0), v(
                  Q,
                  null,
                  Te(mi.value, (l) => (_(), v("li", {
                    key: l.user_id,
                    class: "rel-card"
                  }, [
                    n("div", Hh, [
                      n(
                        "strong",
                        null,
                        r(l.user_id),
                        1
                        /* TEXT */
                      ),
                      n(
                        "span",
                        Wh,
                        r(a("life.companion.state.lastSeenLabel")) + " " + r((l.last_seen || "").slice(0, 16).replace("T", " ") || "—"),
                        1
                        /* TEXT */
                      )
                    ]),
                    n("div", Gh, [
                      n(
                        "span",
                        jh,
                        r(a("life.companion.state.stage")),
                        1
                        /* TEXT */
                      ),
                      n("span", {
                        class: "rel-track",
                        role: "img",
                        "aria-label": vi(l.stage)
                      }, [
                        (_(), v(
                          Q,
                          null,
                          Te(_i, (O, z) => n(
                            "span",
                            {
                              key: O,
                              class: Y(["rel-seg", { done: z < Gi(l.stage), cur: z === Gi(l.stage) }])
                            },
                            null,
                            2
                            /* CLASS */
                          )),
                          64
                          /* STABLE_FRAGMENT */
                        ))
                      ], 8, qh),
                      n(
                        "span",
                        Kh,
                        r(vi(l.stage)),
                        1
                        /* TEXT */
                      )
                    ]),
                    n("div", {
                      class: "gauge",
                      title: a("life.companion.effect.affinity")
                    }, [
                      n("span", Jh, [
                        n("span", Xh, [
                          N(
                            r(a("life.companion.state.affinity")),
                            1
                            /* TEXT */
                          ),
                          n(
                            "em",
                            Qh,
                            r(a("life.companion.alias.affinity")),
                            1
                            /* TEXT */
                          )
                        ]),
                        n("span", ep, [
                          n(
                            "b",
                            {
                              class: Y(["gauge-state", Number(l.affinity) >= 0 ? "good" : "bad"])
                            },
                            r(a("life.companion.gw.affinity." + xn(Number(l.affinity) || 0))),
                            3
                            /* TEXT, CLASS */
                          ),
                          N(
                            " " + r(Le(l.affinity, 2)),
                            1
                            /* TEXT */
                          )
                        ])
                      ]),
                      n("span", tp, [
                        n(
                          "i",
                          {
                            class: Y(["gauge-fill", Number(l.affinity) >= 0 ? "good" : "bad"]),
                            style: et(tt(Number(l.affinity) || 0))
                          },
                          null,
                          6
                          /* CLASS, STYLE */
                        )
                      ]),
                      n(
                        "span",
                        ip,
                        r(a("life.companion.effect.affinity")),
                        1
                        /* TEXT */
                      )
                    ], 8, Yh),
                    l.interaction ? (_(), v("div", np, [
                      n(
                        "span",
                        op,
                        r(a("life.companion.state.interaction")) + " · " + r(Rt(l.interaction)),
                        1
                        /* TEXT */
                      ),
                      n(
                        "span",
                        ap,
                        r(Ln(l.interaction)),
                        1
                        /* TEXT */
                      )
                    ])) : E("v-if", !0)
                  ]))),
                  128
                  /* KEYED_FRAGMENT */
                )),
                mi.value.length ? E("v-if", !0) : (_(), v(
                  "li",
                  sp,
                  r(a("life.companion.state.noRelationships")),
                  1
                  /* TEXT */
                ))
              ])
            ]),
            n("article", rp, [
              n("h3", null, [
                N(
                  r(a("life.companion.state.commitments")) + " ",
                  1
                  /* TEXT */
                ),
                n(
                  "span",
                  lp,
                  r(Qt.value.length),
                  1
                  /* TEXT */
                )
              ]),
              n(
                "p",
                up,
                r(a("life.companion.state.commitmentsHint")),
                1
                /* TEXT */
              ),
              n("ol", cp, [
                (_(!0), v(
                  Q,
                  null,
                  Te(Qt.value, (l) => (_(), v("li", {
                    key: l.id
                  }, [
                    n(
                      "strong",
                      null,
                      r(l.text),
                      1
                      /* TEXT */
                    ),
                    n(
                      "span",
                      dp,
                      r(l.user_id),
                      1
                      /* TEXT */
                    )
                  ]))),
                  128
                  /* KEYED_FRAGMENT */
                )),
                Qt.value.length ? E("v-if", !0) : (_(), v(
                  "li",
                  hp,
                  r(a("life.companion.state.noCommitments")),
                  1
                  /* TEXT */
                ))
              ])
            ]),
            n("div", pp, [
              n("article", fp, [
                n(
                  "h3",
                  null,
                  r(a("life.companion.state.userModel")),
                  1
                  /* TEXT */
                ),
                n(
                  "p",
                  mp,
                  r(a("life.companion.state.userModelHint")),
                  1
                  /* TEXT */
                ),
                n("ol", _p, [
                  (_(!0), v(
                    Q,
                    null,
                    Te(Hi.value, (l) => (_(), v("li", {
                      key: l.user_id
                    }, [
                      n(
                        "strong",
                        null,
                        r(l.user_id),
                        1
                        /* TEXT */
                      ),
                      n(
                        "span",
                        vp,
                        r(a("life.companion.state.likes", { items: kt(l.preferences).join(a("life.companion.listSeparator")) || "—" })),
                        1
                        /* TEXT */
                      ),
                      n(
                        "span",
                        gp,
                        r(a("life.companion.state.taboos", { items: kt(l.taboos).join(a("life.companion.listSeparator")) || "—" })),
                        1
                        /* TEXT */
                      ),
                      n(
                        "span",
                        yp,
                        r(a("life.companion.state.concerns", { items: kt(l.concerns).join(a("life.companion.listSeparator")) || "—" })),
                        1
                        /* TEXT */
                      )
                    ]))),
                    128
                    /* KEYED_FRAGMENT */
                  )),
                  Hi.value.length ? E("v-if", !0) : (_(), v(
                    "li",
                    bp,
                    r(a("life.companion.state.noUserModel")),
                    1
                    /* TEXT */
                  ))
                ])
              ]),
              n("article", wp, [
                n(
                  "h3",
                  null,
                  r(a("life.companion.state.values")),
                  1
                  /* TEXT */
                ),
                n(
                  "p",
                  xp,
                  r(a("life.companion.state.valuesHint")),
                  1
                  /* TEXT */
                ),
                n("ol", kp, [
                  (_(!0), v(
                    Q,
                    null,
                    Te(bn.value, (l) => (_(), v("li", {
                      key: l.k,
                      class: "value-row"
                    }, [
                      n(
                        "span",
                        Pp,
                        r(l.k),
                        1
                        /* TEXT */
                      ),
                      n("span", Lp, [
                        n(
                          "i",
                          {
                            class: Y(l.v >= 0 ? "good" : "bad"),
                            style: et(tt(l.v))
                          },
                          null,
                          6
                          /* CLASS, STYLE */
                        )
                      ]),
                      n(
                        "span",
                        Tp,
                        r(l.v.toFixed(2)),
                        1
                        /* TEXT */
                      )
                    ]))),
                    128
                    /* KEYED_FRAGMENT */
                  )),
                  bn.value.length ? E("v-if", !0) : (_(), v(
                    "li",
                    Sp,
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
          [un, Ae.value === "state"]
        ]),
        n("section", Cp, [
          n("div", Mp, [
            n("div", null, [
              n(
                "h2",
                null,
                r(a("life.companion.danger.title")),
                1
                /* TEXT */
              ),
              n(
                "p",
                zp,
                r(a("life.companion.danger.desc")),
                1
                /* TEXT */
              )
            ])
          ]),
          n("div", Ep, [
            n("article", Op, [
              n(
                "h3",
                null,
                r(a("life.companion.danger.reset")),
                1
                /* TEXT */
              ),
              n(
                "p",
                Ap,
                r(a("life.companion.danger.resetHint")),
                1
                /* TEXT */
              ),
              n("p", Ip, [
                n(
                  "strong",
                  null,
                  r(a("life.companion.danger.doubleConfirm")),
                  1
                  /* TEXT */
                )
              ]),
              n("div", Bp, [
                n("button", {
                  class: "btn danger",
                  disabled: Vt.value,
                  onClick: Tt
                }, r(Vt.value ? a("life.companion.danger.resetting") : a("life.companion.danger.reset")), 9, Zp)
              ])
            ])
          ])
        ])
      ],
      512
      /* NEED_PATCH */
    ));
  }
}), Vp = (me, g) => {
  const a = me.__vccOpts || me;
  for (const [re, Z] of g)
    a[re] = Z;
  return a;
}, Fp = /* @__PURE__ */ Vp(Rp, [["__scopeId", "data-v-4443f246"]]);
export {
  Fp as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('life-plugin-style')){const s=document.createElement('style');s.id='life-plugin-style';s.textContent=".leaflet-pane,.leaflet-tile,.leaflet-marker-icon,.leaflet-marker-shadow,.leaflet-tile-container,.leaflet-pane>svg,.leaflet-pane>canvas,.leaflet-zoom-box,.leaflet-image-layer,.leaflet-layer{position:absolute;left:0;top:0}.leaflet-container{overflow:hidden}.leaflet-tile,.leaflet-marker-icon,.leaflet-marker-shadow{-webkit-user-select:none;-moz-user-select:none;user-select:none;-webkit-user-drag:none}.leaflet-tile::selection{background:transparent}.leaflet-safari .leaflet-tile{image-rendering:-webkit-optimize-contrast}.leaflet-safari .leaflet-tile-container{width:1600px;height:1600px;-webkit-transform-origin:0 0}.leaflet-marker-icon,.leaflet-marker-shadow{display:block}.leaflet-container .leaflet-overlay-pane svg{max-width:none!important;max-height:none!important}.leaflet-container .leaflet-marker-pane img,.leaflet-container .leaflet-shadow-pane img,.leaflet-container .leaflet-tile-pane img,.leaflet-container img.leaflet-image-layer,.leaflet-container .leaflet-tile{max-width:none!important;max-height:none!important;width:auto;padding:0}.leaflet-container img.leaflet-tile{mix-blend-mode:plus-lighter}.leaflet-container.leaflet-touch-zoom{-ms-touch-action:pan-x pan-y;touch-action:pan-x pan-y}.leaflet-container.leaflet-touch-drag{-ms-touch-action:pinch-zoom;touch-action:none;touch-action:pinch-zoom}.leaflet-container.leaflet-touch-drag.leaflet-touch-zoom{-ms-touch-action:none;touch-action:none}.leaflet-container{-webkit-tap-highlight-color:transparent}.leaflet-container a{-webkit-tap-highlight-color:rgba(51,181,229,.4)}.leaflet-tile{filter:inherit;visibility:hidden}.leaflet-tile-loaded{visibility:inherit}.leaflet-zoom-box{width:0;height:0;-moz-box-sizing:border-box;box-sizing:border-box;z-index:800}.leaflet-overlay-pane svg{-moz-user-select:none}.leaflet-pane{z-index:400}.leaflet-tile-pane{z-index:200}.leaflet-overlay-pane{z-index:400}.leaflet-shadow-pane{z-index:500}.leaflet-marker-pane{z-index:600}.leaflet-tooltip-pane{z-index:650}.leaflet-popup-pane{z-index:700}.leaflet-map-pane canvas{z-index:100}.leaflet-map-pane svg{z-index:200}.leaflet-vml-shape{width:1px;height:1px}.lvml{behavior:url(#default#VML);display:inline-block;position:absolute}.leaflet-control{position:relative;z-index:800;pointer-events:visiblePainted;pointer-events:auto}.leaflet-top,.leaflet-bottom{position:absolute;z-index:1000;pointer-events:none}.leaflet-top{top:0}.leaflet-right{right:0}.leaflet-bottom{bottom:0}.leaflet-left{left:0}.leaflet-control{float:left;clear:both}.leaflet-right .leaflet-control{float:right}.leaflet-top .leaflet-control{margin-top:10px}.leaflet-bottom .leaflet-control{margin-bottom:10px}.leaflet-left .leaflet-control{margin-left:10px}.leaflet-right .leaflet-control{margin-right:10px}.leaflet-fade-anim .leaflet-popup{opacity:0;-webkit-transition:opacity .2s linear;-moz-transition:opacity .2s linear;transition:opacity .2s linear}.leaflet-fade-anim .leaflet-map-pane .leaflet-popup{opacity:1}.leaflet-zoom-animated{-webkit-transform-origin:0 0;-ms-transform-origin:0 0;transform-origin:0 0}svg.leaflet-zoom-animated{will-change:transform}.leaflet-zoom-anim .leaflet-zoom-animated{-webkit-transition:-webkit-transform .25s cubic-bezier(0,0,.25,1);-moz-transition:-moz-transform .25s cubic-bezier(0,0,.25,1);transition:transform .25s cubic-bezier(0,0,.25,1)}.leaflet-zoom-anim .leaflet-tile,.leaflet-pan-anim .leaflet-tile{-webkit-transition:none;-moz-transition:none;transition:none}.leaflet-zoom-anim .leaflet-zoom-hide{visibility:hidden}.leaflet-interactive{cursor:pointer}.leaflet-grab{cursor:-webkit-grab;cursor:-moz-grab;cursor:grab}.leaflet-crosshair,.leaflet-crosshair .leaflet-interactive{cursor:crosshair}.leaflet-popup-pane,.leaflet-control{cursor:auto}.leaflet-dragging .leaflet-grab,.leaflet-dragging .leaflet-grab .leaflet-interactive,.leaflet-dragging .leaflet-marker-draggable{cursor:move;cursor:-webkit-grabbing;cursor:-moz-grabbing;cursor:grabbing}.leaflet-marker-icon,.leaflet-marker-shadow,.leaflet-image-layer,.leaflet-pane>svg path,.leaflet-tile-container{pointer-events:none}.leaflet-marker-icon.leaflet-interactive,.leaflet-image-layer.leaflet-interactive,.leaflet-pane>svg path.leaflet-interactive,svg.leaflet-image-layer.leaflet-interactive path{pointer-events:visiblePainted;pointer-events:auto}.leaflet-container{background:#ddd;outline-offset:1px}.leaflet-container a{color:#0078a8}.leaflet-zoom-box{border:2px dotted #38f;background:#ffffff80}.leaflet-container{font-family:Helvetica Neue,Arial,Helvetica,sans-serif;font-size:12px;font-size:.75rem;line-height:1.5}.leaflet-bar{box-shadow:0 1px 5px #000000a6;border-radius:4px}.leaflet-bar a{background-color:#fff;border-bottom:1px solid #ccc;width:26px;height:26px;line-height:26px;display:block;text-align:center;text-decoration:none;color:#000}.leaflet-bar a,.leaflet-control-layers-toggle{background-position:50% 50%;background-repeat:no-repeat;display:block}.leaflet-bar a:hover,.leaflet-bar a:focus{background-color:#f4f4f4}.leaflet-bar a:first-child{border-top-left-radius:4px;border-top-right-radius:4px}.leaflet-bar a:last-child{border-bottom-left-radius:4px;border-bottom-right-radius:4px;border-bottom:none}.leaflet-bar a.leaflet-disabled{cursor:default;background-color:#f4f4f4;color:#bbb}.leaflet-touch .leaflet-bar a{width:30px;height:30px;line-height:30px}.leaflet-touch .leaflet-bar a:first-child{border-top-left-radius:2px;border-top-right-radius:2px}.leaflet-touch .leaflet-bar a:last-child{border-bottom-left-radius:2px;border-bottom-right-radius:2px}.leaflet-control-zoom-in,.leaflet-control-zoom-out{font:700 18px Lucida Console,Monaco,monospace;text-indent:1px}.leaflet-touch .leaflet-control-zoom-in,.leaflet-touch .leaflet-control-zoom-out{font-size:22px}.leaflet-control-layers{box-shadow:0 1px 5px #0006;background:#fff;border-radius:5px}.leaflet-control-layers-toggle{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAQAAAADQ4RFAAACf0lEQVR4AY1UM3gkARTePdvdoTxXKc+qTl3aU5U6b2Kbkz3Gtq3Zw6ziLGNPzrYx7946Tr6/ee/XeCQ4D3ykPtL5tHno4n0d/h3+xfuWHGLX81cn7r0iTNzjr7LrlxCqPtkbTQEHeqOrTy4Yyt3VCi/IOB0v7rVC7q45Q3Gr5K6jt+3Gl5nCoDD4MtO+j96Wu8atmhGqcNGHObuf8OM/x3AMx38+4Z2sPqzCxRFK2aF2e5Jol56XTLyggAMTL56XOMoS1W4pOyjUcGGQdZxU6qRh7B9Zp+PfpOFlqt0zyDZckPi1ttmIp03jX8gyJ8a/PG2yutpS/Vol7peZIbZcKBAEEheEIAgFbDkz5H6Zrkm2hVWGiXKiF4Ycw0RWKdtC16Q7qe3X4iOMxruonzegJzWaXFrU9utOSsLUmrc0YjeWYjCW4PDMADElpJSSQ0vQvA1Tm6/JlKnqFs1EGyZiFCqnRZTEJJJiKRYzVYzJck2Rm6P4iH+cmSY0YzimYa8l0EtTODFWhcMIMVqdsI2uiTvKmTisIDHJ3od5GILVhBCarCfVRmo4uTjkhrhzkiBV7SsaqS+TzrzM1qpGGUFt28pIySQHR6h7F6KSwGWm97ay+Z+ZqMcEjEWebE7wxCSQwpkhJqoZA5ivCdZDjJepuJ9IQjGGUmuXJdBFUygxVqVsxFsLMbDe8ZbDYVCGKxs+W080max1hFCarCfV+C1KATwcnvE9gRRuMP2prdbWGowm1KB1y+zwMMENkM755cJ2yPDtqhTI6ED1M/82yIDtC/4j4BijjeObflpO9I9MwXTCsSX8jWAFeHr05WoLTJ5G8IQVS/7vwR6ohirYM7f6HzYpogfS3R2OAAAAAElFTkSuQmCC);width:36px;height:36px}.leaflet-retina .leaflet-control-layers-toggle{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAQAAABvcdNgAAAEsklEQVR4AWL4TydIhpZK1kpWOlg0w3ZXP6D2soBtG42jeI6ZmQTHzAxiTbSJsYLjO9HhP+WOmcuhciVnmHVQcJnp7DFvScowZorad/+V/fVzMdMT2g9Cv9guXGv/7pYOrXh2U+RRR3dSd9JRx6bIFc/ekqHI29JC6pJ5ZEh1yWkhkbcFeSjxgx3L2m1cb1C7bceyxA+CNjT/Ifff+/kDk2u/w/33/IeCMOSaWZ4glosqT3DNnNZQ7Cs58/3Ce5HL78iZH/vKVIaYlqzfdLu8Vi7dnvUbEza5Idt36tquZFldl6N5Z/POLof0XLK61mZCmJSWjVF9tEjUluu74IUXvgttuVIHE7YxSkaYhJZam7yiM9Pv82JYfl9nptxZaxMJE4YSPty+vF0+Y2up9d3wwijfjZbabqm/3bZ9ecKHsiGmRflnn1MW4pjHf9oLufyn2z3y1D6n8g8TZhxyzipLNPnAUpsOiuWimg52psrTZYnOWYNDTMuWBWa0tJb4rgq1UvmutpaYEbZlwU3CLJm/ayYjHW5/h7xWLn9Hh1vepDkyf7dE7MtT5LR4e7yYpHrkhOUpEfssBLq2pPhAqoSWKUkk7EDqkmK6RrCEzqDjhNDWNE+XSMvkJRDWlZTmCW0l0PHQGRZY5t1L83kT0Y3l2SItk5JAWHl2dCOBm+fPu3fo5/3v61RMCO9Jx2EEYYhb0rmNQMX/vm7gqOEJLcXTGw3CAuRNeyaPWwjR8PRqKQ1PDA/dpv+on9Shox52WFnx0KY8onHayrJzm87i5h9xGw/tfkev0jGsQizqezUKjk12hBMKJ4kbCqGPVNXudyyrShovGw5CgxsRICxF6aRmSjlBnHRzg7Gx8fKqEubI2rahQYdR1YgDIRQO7JvQyD52hoIQx0mxa0ODtW2Iozn1le2iIRdzwWewedyZzewidueOGqlsn1MvcnQpuVwLGG3/IR1hIKxCjelIDZ8ldqWz25jWAsnldEnK0Zxro19TGVb2ffIZEsIO89EIEDvKMPrzmBOQcKQ+rroye6NgRRxqR4U8EAkz0CL6uSGOm6KQCdWjvjRiSP1BPalCRS5iQYiEIvxuBMJEWgzSoHADcVMuN7IuqqTeyUPq22qFimFtxDyBBJEwNyt6TM88blFHao/6tWWhuuOM4SAK4EI4QmFHA+SEyWlp4EQoJ13cYGzMu7yszEIBOm2rVmHUNqwAIQabISNMRstmdhNWcFLsSm+0tjJH1MdRxO5Nx0WDMhCtgD6OKgZeljJqJKc9po8juskR9XN0Y1lZ3mWjLR9JCO1jRDMd0fpYC2VnvjBSEFg7wBENc0R9HFlb0xvF1+TBEpF68d+DHR6IOWVv2BECtxo46hOFUBd/APU57WIoEwJhIi2CdpyZX0m93BZicktMj1AS9dClteUFAUNUIEygRZCtik5zSxI9MubTBH1GOiHsiLJ3OCoSZkILa9PxiN0EbvhsAo8tdAf9Seepd36lGWHmtNANTv5Jd0z4QYyeo/UEJqxKRpg5LZx6btLPsOaEmdMyxYdlc8LMaJnikDlhclqmPiQnTEpLUIZEwkRagjYkEibQErwhkTAKCLQEbUgkzJQWc/0PstHHcfEdQ+UAAAAASUVORK5CYII=);background-size:26px 26px}.leaflet-touch .leaflet-control-layers-toggle{width:44px;height:44px}.leaflet-control-layers .leaflet-control-layers-list,.leaflet-control-layers-expanded .leaflet-control-layers-toggle{display:none}.leaflet-control-layers-expanded .leaflet-control-layers-list{display:block;position:relative}.leaflet-control-layers-expanded{padding:6px 10px 6px 6px;color:#333;background:#fff}.leaflet-control-layers-scrollbar{overflow-y:scroll;overflow-x:hidden;padding-right:5px}.leaflet-control-layers-selector{margin-top:2px;position:relative;top:1px}.leaflet-control-layers label{display:block;font-size:13px;font-size:1.08333em}.leaflet-control-layers-separator{height:0;border-top:1px solid #ddd;margin:5px -10px 5px -6px}.leaflet-default-icon-path{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII=)}.leaflet-container .leaflet-control-attribution{background:#fff;background:#fffc;margin:0}.leaflet-control-attribution,.leaflet-control-scale-line{padding:0 5px;color:#333;line-height:1.4}.leaflet-control-attribution a{text-decoration:none}.leaflet-control-attribution a:hover,.leaflet-control-attribution a:focus{text-decoration:underline}.leaflet-attribution-flag{display:inline!important;vertical-align:baseline!important;width:1em;height:.6669em}.leaflet-left .leaflet-control-scale{margin-left:5px}.leaflet-bottom .leaflet-control-scale{margin-bottom:5px}.leaflet-control-scale-line{border:2px solid #777;border-top:none;line-height:1.1;padding:2px 5px 1px;white-space:nowrap;-moz-box-sizing:border-box;box-sizing:border-box;background:#fffc;text-shadow:1px 1px #fff}.leaflet-control-scale-line:not(:first-child){border-top:2px solid #777;border-bottom:none;margin-top:-2px}.leaflet-control-scale-line:not(:first-child):not(:last-child){border-bottom:2px solid #777}.leaflet-touch .leaflet-control-attribution,.leaflet-touch .leaflet-control-layers,.leaflet-touch .leaflet-bar{box-shadow:none}.leaflet-touch .leaflet-control-layers,.leaflet-touch .leaflet-bar{border:2px solid rgba(0,0,0,.2);background-clip:padding-box}.leaflet-popup{position:absolute;text-align:center;margin-bottom:20px}.leaflet-popup-content-wrapper{padding:1px;text-align:left;border-radius:12px}.leaflet-popup-content{margin:13px 24px 13px 20px;line-height:1.3;font-size:13px;font-size:1.08333em;min-height:1px}.leaflet-popup-content p{margin:1.3em 0}.leaflet-popup-tip-container{width:40px;height:20px;position:absolute;left:50%;margin-top:-1px;margin-left:-20px;overflow:hidden;pointer-events:none}.leaflet-popup-tip{width:17px;height:17px;padding:1px;margin:-10px auto 0;pointer-events:auto;-webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);-ms-transform:rotate(45deg);transform:rotate(45deg)}.leaflet-popup-content-wrapper,.leaflet-popup-tip{background:#fff;color:#333;box-shadow:0 3px 14px #0006}.leaflet-container a.leaflet-popup-close-button{position:absolute;top:0;right:0;border:none;text-align:center;width:24px;height:24px;font:16px/24px Tahoma,Verdana,sans-serif;color:#757575;text-decoration:none;background:transparent}.leaflet-container a.leaflet-popup-close-button:hover,.leaflet-container a.leaflet-popup-close-button:focus{color:#585858}.leaflet-popup-scrolled{overflow:auto}.leaflet-oldie .leaflet-popup-content-wrapper{-ms-zoom:1}.leaflet-oldie .leaflet-popup-tip{width:24px;margin:0 auto;-ms-filter:\"progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678)\";filter:progid:DXImageTransform.Microsoft.Matrix(M11=.70710678,M12=.70710678,M21=-.70710678,M22=.70710678)}.leaflet-oldie .leaflet-control-zoom,.leaflet-oldie .leaflet-control-layers,.leaflet-oldie .leaflet-popup-content-wrapper,.leaflet-oldie .leaflet-popup-tip{border:1px solid #999}.leaflet-div-icon{background:#fff;border:1px solid #666}.leaflet-tooltip{position:absolute;padding:6px;background-color:#fff;border:1px solid #fff;border-radius:3px;color:#222;white-space:nowrap;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none;box-shadow:0 1px 3px #0006}.leaflet-tooltip.leaflet-interactive{cursor:pointer;pointer-events:auto}.leaflet-tooltip-top:before,.leaflet-tooltip-bottom:before,.leaflet-tooltip-left:before,.leaflet-tooltip-right:before{position:absolute;pointer-events:none;border:6px solid transparent;background:transparent;content:\"\"}.leaflet-tooltip-bottom{margin-top:6px}.leaflet-tooltip-top{margin-top:-6px}.leaflet-tooltip-bottom:before,.leaflet-tooltip-top:before{left:50%;margin-left:-6px}.leaflet-tooltip-top:before{bottom:0;margin-bottom:-12px;border-top-color:#fff}.leaflet-tooltip-bottom:before{top:0;margin-top:-12px;margin-left:-6px;border-bottom-color:#fff}.leaflet-tooltip-left{margin-left:-6px}.leaflet-tooltip-right{margin-left:6px}.leaflet-tooltip-left:before,.leaflet-tooltip-right:before{top:50%;margin-top:-6px}.leaflet-tooltip-left:before{right:0;margin-right:-12px;border-left-color:#fff}.leaflet-tooltip-right:before{left:0;margin-left:-12px;border-right-color:#fff}@media print{.leaflet-control{-webkit-print-color-adjust:exact;print-color-adjust:exact}}.world-field[data-v-4443f246]{display:block;margin:10px 0}.world-label[data-v-4443f246]{display:block;font-size:12px;font-weight:600;color:var(--md-on-surface-variant);margin-bottom:4px}.world-text[data-v-4443f246]{width:100%;min-height:64px;padding:10px 14px;border:1px solid var(--md-outline-variant);border-radius:var(--r-sm);background:var(--md-surface-container-high);color:var(--md-on-surface);font:inherit;font-size:13px;line-height:1.5;resize:vertical;outline:none}.world-text[data-v-4443f246]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 14%,transparent)}.world-actions[data-v-4443f246]{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-top:12px}.wm-head[data-v-4443f246]{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;margin-bottom:6px}.wm-place[data-v-4443f246]{font-size:12px;color:var(--md-on-surface-variant)}.wm-premise[data-v-4443f246]{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin:2px 0 8px}.wm-map-wrap[data-v-4443f246]{position:relative;margin-top:8px}.world-map-leaflet[data-v-4443f246]{height:clamp(460px,72vh,820px);border-radius:16px;overflow:hidden;border:1px solid var(--md-outline-variant);background:#e8edf2}.world-map-leaflet.is-empty[data-v-4443f246]{display:none}.wm-reset[data-v-4443f246]{position:absolute;top:10px;right:10px;z-index:var(--z-overlay,2000);border:1px solid var(--md-outline-variant);background:#fffffff0;color:#33404c;border-radius:10px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer;box-shadow:0 1px 4px #0000002e}.wm-reset[data-v-4443f246]:hover{background:#fff}.wm-compass[data-v-4443f246]{position:absolute;left:12px;bottom:12px;z-index:var(--z-overlay,2000);width:38px;height:38px;border-radius:50%;background:#ffffffeb;border:1px solid #b9c3cd;box-shadow:0 1px 4px #0000002e;display:grid;place-items:center}.wm-compass i[data-v-4443f246]{font-style:normal;font-size:12px;font-weight:800;color:#d64545;position:relative}.wm-compass i[data-v-4443f246]:before{content:\"\";position:absolute;left:50%;top:-9px;transform:translate(-50%);border-left:4px solid transparent;border-right:4px solid transparent;border-bottom:9px solid #33404c}.wm-scope[data-v-4443f246]{position:absolute;bottom:12px;right:12px;z-index:var(--z-overlay,2000);border:1px solid var(--md-outline-variant);background:#fffffff0;color:#33404c;border-radius:10px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer;box-shadow:0 1px 4px #0000002e}.wm-scope[data-v-4443f246]:hover{background:#fff}.wm-offline[data-v-4443f246]{position:absolute;left:50%;bottom:12px;transform:translate(-50%);z-index:var(--z-overlay,2000);background:#d1495bf0;color:#fff;font-size:12px;font-weight:600;padding:5px 12px;border-radius:10px;box-shadow:0 1px 4px #00000040}.wm-routes[data-v-4443f246]{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(280px,100%),1fr));gap:18px;margin-top:14px}.wm-routes h4[data-v-4443f246]{margin:0 0 6px;font-size:13px;font-weight:800}.wm-routes ul[data-v-4443f246]{list-style:none;margin:0;padding:0}.wm-routes li[data-v-4443f246]{display:flex;gap:10px;padding:4px 0;border-bottom:1px dashed color-mix(in srgb,var(--md-outline-variant) 70%,transparent);font-size:12.5px}.wm-routes b[data-v-4443f246]{flex:0 0 88px}.wm-routes span[data-v-4443f246]{color:var(--md-on-surface-variant);line-height:1.5}.wm-legend[data-v-4443f246]{display:flex;flex-wrap:wrap;gap:14px;margin-top:12px;font-size:12px;color:var(--md-on-surface-variant)}.wm-legend span[data-v-4443f246]{display:inline-flex;align-items:center;gap:6px}.wm-legend i[data-v-4443f246]{width:12px;height:12px;border-radius:50%;display:inline-block;border:1.5px solid rgba(255,255,255,.7)}.wm-legend i.k-home[data-v-4443f246]{background:#e07a5f}.wm-legend i.k-work[data-v-4443f246]{background:#5b8def}.wm-legend i.k-shop[data-v-4443f246]{background:#e0a23d}.wm-legend i.k-food[data-v-4443f246]{background:#57a773}.wm-legend i.k-park[data-v-4443f246]{background:#3faead}.wm-legend i.k-transit[data-v-4443f246]{background:#8b6fd6}.wm-legend i.k-other[data-v-4443f246]{background:#8a94a6}.wm-legend i.k-actor[data-v-4443f246]{background:#fff;border-color:#d1495b;box-shadow:inset 0 0 0 3px #d1495b}.wm-legend i.k-metro[data-v-4443f246]{background:#d64545}.wm-legend i.k-bus[data-v-4443f246]{background:#e08a2e}.wm-legend i.k-park2[data-v-4443f246]{background:#9bd08f}.wm-legend i.k-water[data-v-4443f246]{background:#8fbfe6}.wm-legend i.k-hw[data-v-4443f246]{background:#f08c2e}.wm-legend i.k-arterial[data-v-4443f246]{background:#f7cf8a}.wm-legend i.k-street[data-v-4443f246]{background:#fff;border-color:#b9c3cd}.pfield[data-v-4443f246]{display:flex;flex-direction:column;gap:4px;margin-top:10px;font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}#app .pcp .pfield textarea.field[data-v-4443f246]{height:auto;min-height:70px;padding:10px 12px;resize:vertical;line-height:1.5}.cog-metric[data-v-4443f246]{display:flex;flex-direction:column;gap:4px;padding:10px 12px;border-radius:var(--r-sm);background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant)}.cog-metric span[data-v-4443f246]{font-size:11px;font-weight:700;letter-spacing:.04em;color:var(--md-on-surface-variant)}.cog-metric strong[data-v-4443f246]{font-size:16px;font-weight:800;letter-spacing:-.01em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.cog-metric.warn[data-v-4443f246]{border-color:var(--md-error,#b3261e);background:color-mix(in srgb,var(--md-error,#b3261e) 8%,transparent)}.cog-metric.warn span[data-v-4443f246],.cog-metric.warn strong[data-v-4443f246]{color:var(--md-error,#b3261e)}.som-channels[data-v-4443f246]{margin-top:10px;display:flex;flex-direction:column;gap:6px}.som-chan[data-v-4443f246]{display:grid;grid-template-columns:minmax(52px,88px) minmax(0,1fr) 48px;align-items:center;gap:10px}.som-chan-name[data-v-4443f246]{font-size:12px;font-weight:600;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.som-chan-bar[data-v-4443f246]{display:block;height:8px;border-radius:999px;background:var(--md-surface-container);overflow:hidden}.som-chan-bar i[data-v-4443f246]{display:block;width:100%;height:100%;border-radius:999px;background:var(--md-primary);transform-origin:left;transition:transform var(--duration-medium) var(--ease-out);will-change:transform}.som-chan-val[data-v-4443f246]{font-size:12px;font-weight:700;text-align:right;color:var(--md-on-surface-variant)}.at-a-glance[data-v-4443f246]{display:grid;grid-template-columns:190px minmax(0,1fr) minmax(0,1fr);gap:14px;align-items:start;margin:8px 0 4px}@media(max-width:900px){.at-a-glance[data-v-4443f246]{grid-template-columns:1fr 1fr}}@media(max-width:620px){.at-a-glance[data-v-4443f246]{grid-template-columns:1fr}}.mood-plot-wrap[data-v-4443f246]{position:relative;width:190px;padding:26px 22px 40px;background:var(--md-surface-container);border:1px solid color-mix(in srgb,var(--md-outline-variant) 60%,transparent);border-radius:var(--r-md);box-sizing:border-box}.mood-plot[data-v-4443f246]{display:block;width:100%}.plot-frame[data-v-4443f246]{fill:var(--md-surface-container-lowest);stroke:var(--md-outline-variant)}.plot-grid[data-v-4443f246]{stroke:var(--md-outline-variant);stroke-width:1;stroke-dasharray:3 4}.plot-dot[data-v-4443f246]{fill:var(--md-primary)}.plot-halo[data-v-4443f246]{fill:var(--md-primary);opacity:.22}.plot-label[data-v-4443f246]{position:absolute;font-size:10px;font-weight:700;letter-spacing:.04em;color:var(--md-on-surface-variant);pointer-events:none}.plot-n[data-v-4443f246]{top:6px;left:50%;transform:translate(-50%)}.plot-s[data-v-4443f246]{bottom:26px;left:50%;transform:translate(-50%)}.plot-w[data-v-4443f246]{left:8px;top:50%;transform:translateY(-58%)}.plot-e[data-v-4443f246]{right:8px;top:50%;transform:translateY(-58%)}.plot-quadrant[data-v-4443f246]{position:absolute;left:0;right:0;bottom:8px;text-align:center;font-size:12px;font-weight:800;color:var(--md-primary)}.glance-col[data-v-4443f246]{display:flex;flex-direction:column;gap:8px;min-width:0}.glance-title[data-v-4443f246]{display:flex;align-items:center;gap:8px;margin:0;font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--md-on-surface-variant)}.gauge-grid[data-v-4443f246]{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:10px;margin:8px 0}.gauge[data-v-4443f246]{display:flex;flex-direction:column;gap:5px;padding:10px 12px;border-radius:var(--r-sm);background:var(--md-surface-container);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);min-width:0}.gauge-head[data-v-4443f246]{display:flex;justify-content:space-between;align-items:baseline;gap:8px}.gauge-name[data-v-4443f246]{font-size:12px;font-weight:700;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.gauge-alias[data-v-4443f246]{font-style:normal;font-weight:500;font-size:11px;color:var(--md-on-surface-variant);opacity:.8;margin-left:6px}.gauge-val[data-v-4443f246]{font-size:13px;font-weight:800;font-variant-numeric:tabular-nums;white-space:nowrap}.gauge-state[data-v-4443f246]{font-weight:800;margin-right:2px}.gauge-state.good[data-v-4443f246]{color:var(--md-success)}.gauge-state.mid[data-v-4443f246]{color:var(--md-primary)}.gauge-state.bad[data-v-4443f246]{color:var(--md-error)}.gauge-bar[data-v-4443f246]{position:relative;display:block;height:8px;border-radius:999px;background:var(--md-surface-container-highest);overflow:visible}.gauge-bar.signed[data-v-4443f246]:before{content:\"\";position:absolute;left:50%;top:-3px;bottom:-3px;width:2px;border-radius:1px;background:var(--md-outline-variant)}.gauge-fill[data-v-4443f246]{position:absolute;top:0;bottom:0;border-radius:999px;transition:width .35s var(--ease-out,.25s ease),left .35s var(--ease-out,.25s ease)}.gauge-fill.good[data-v-4443f246]{background:var(--md-success)}.gauge-fill.mid[data-v-4443f246]{background:var(--md-primary)}.gauge-fill.bad[data-v-4443f246]{background:var(--md-error)}.gauge-effect[data-v-4443f246]{font-size:11px;line-height:1.45;color:var(--md-on-surface-variant)}.chip-row[data-v-4443f246]{display:flex;gap:8px;flex-wrap:wrap;margin:8px 0}.chip.warn[data-v-4443f246]{background:var(--md-error-container);color:var(--md-on-error-container)}.rel-card[data-v-4443f246]{display:flex;flex-direction:column;gap:10px}.rel-head[data-v-4443f246]{display:flex;justify-content:space-between;gap:10px;align-items:baseline;flex-wrap:wrap}.rel-track-row[data-v-4443f246]{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:10px;align-items:center}.rel-track-label[data-v-4443f246],.rel-stage-name[data-v-4443f246]{font-size:11px;font-weight:800;letter-spacing:.04em;color:var(--md-on-surface-variant);white-space:nowrap}.rel-stage-name[data-v-4443f246]{color:var(--md-primary)}.rel-track[data-v-4443f246]{display:flex;gap:3px;height:10px;border-radius:999px;overflow:hidden;background:var(--md-surface-container-highest)}.rel-seg[data-v-4443f246]{flex:1 1 0;background:color-mix(in srgb,var(--md-outline-variant) 45%,transparent)}.rel-seg.done[data-v-4443f246]{background:color-mix(in srgb,var(--md-primary) 45%,transparent)}.rel-seg.cur[data-v-4443f246]{background:var(--md-primary)}.rel-mode[data-v-4443f246]{display:flex;flex-direction:column;gap:4px;align-items:flex-start}.value-row[data-v-4443f246]{display:grid;grid-template-columns:minmax(72px,140px) minmax(0,1fr) 44px;gap:10px;align-items:center}.value-name[data-v-4443f246]{font-size:13px;font-weight:700;overflow-wrap:anywhere}.value-bar[data-v-4443f246]{position:relative;display:block;height:8px;border-radius:999px;background:var(--md-surface-container-highest)}.value-bar[data-v-4443f246]:before{content:\"\";position:absolute;left:50%;top:-3px;bottom:-3px;width:2px;border-radius:1px;background:var(--md-outline-variant)}.value-bar i[data-v-4443f246]{position:absolute;top:0;bottom:0;border-radius:999px;transition:width .35s var(--ease-out,.25s ease),left .35s var(--ease-out,.25s ease)}.value-bar i.good[data-v-4443f246]{background:var(--md-success)}.value-bar i.bad[data-v-4443f246]{background:var(--md-error)}.value-num[data-v-4443f246]{font-size:12px;font-weight:800;text-align:right;font-variant-numeric:tabular-nums;color:var(--md-on-surface-variant)}.chip[data-v-4443f246]{display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 12px;border-radius:999px;font-size:12px;font-weight:700;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.chip.muted[data-v-4443f246]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}.chip.ok[data-v-4443f246]{background:var(--md-success-container);color:var(--md-on-success-container,#0d3b1e)}#app .pcp .cog-metric[data-v-4443f246]{background:var(--md-surface-container)}.sync-pill[data-v-4443f246]{font-weight:500;opacity:.85}html[data-theme=dark] #app .pcp .world-map-leaflet{background:#10151c}html[data-theme=dark] #app .pcp .wm-reset,html[data-theme=dark] #app .pcp .wm-scope{background:color-mix(in srgb,var(--md-surface-container-high) 94%,transparent);color:var(--md-on-surface)}html[data-theme=dark] #app .pcp .wm-reset:hover,html[data-theme=dark] #app .pcp .wm-scope:hover{background:var(--md-surface-container-highest)}html[data-theme=dark] #app .pcp .wm-compass{background:color-mix(in srgb,var(--md-surface-container-high) 92%,transparent);border-color:var(--md-outline-variant)}html[data-theme=dark] .wm-district-inner{color:#aeb9c4;text-shadow:none}html[data-theme=dark] .wm-station .wm-route-inner{background:#1a2230;color:#d7dee6}html[data-theme=dark] .leaflet-container{background:#10151c}.wm-pin-holder,.wm-actor-holder{background:none;border:none}.wm-pin{position:absolute;left:0;top:0;width:16px;height:16px;border-radius:50%;background:var(--c,#8a94a6);border:3px solid #fff;box-shadow:0 2px 6px #00000073;transform:translate(-50%,-50%)}.wm-pin:after{content:\"\";position:absolute;left:50%;top:100%;width:2px;height:8px;background:#fff;transform:translate(-50%);opacity:.7}.wm-pin-label{position:absolute;left:12px;top:-9px;white-space:nowrap;background:#12141ad1;color:#fff;font-size:12px;font-weight:600;padding:2px 8px;border-radius:10px;pointer-events:none}.wm-actor-badge{position:absolute;left:0;top:0;width:26px;height:26px;border-radius:50%;background:#fff;color:#d1495b;border:3px solid #d1495b;font-size:14px;font-weight:800;line-height:1;display:grid;place-items:center;transform:translate(-50%,-50%);box-shadow:0 2px 6px #00000080;z-index:600}.wm-actor-name{position:absolute;left:0;top:20px;white-space:nowrap;background:#d1495b;color:#fff;font-size:11px;font-weight:700;padding:1px 7px;border-radius:9px;transform:translate(-50%)}.wm-district{background:none;border:none}.wm-district-inner{position:absolute;left:0;top:0;transform:translate(-50%,-50%);white-space:nowrap;font-size:12px;font-weight:800;letter-spacing:.2em;color:#5c6b78;text-shadow:0 1px 0 rgba(255,255,255,.9);pointer-events:none}.wm-route{background:none;border:none}.wm-route-inner{position:absolute;left:0;top:0;transform:translate(-50%,-50%);background:var(--c,#333);color:#fff;font-size:10px;font-weight:700;padding:1px 6px;border-radius:8px;white-space:nowrap;box-shadow:0 1px 3px #00000059;pointer-events:none}.wm-zoom-low .wm-minor{display:none}.wm-station .wm-route-inner{background:#fff;color:#33404c;border:1.5px solid var(--c,#888);border-radius:6px;font-size:9px;font-weight:700;padding:1px 5px}.leaflet-container{font-family:inherit;background:#e8edf2;border-radius:16px}.leaflet-container a{color:#2f6fed}.leaflet-popup-content{font-size:13px;line-height:1.5}\n";document.head.appendChild(s)}})();
