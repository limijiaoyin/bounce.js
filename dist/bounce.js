!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Bounce=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var Component, EasingClasses, Matrix4D;

Matrix4D = _dereq_("../math/matrix4d");

EasingClasses = {
  bounce: _dereq_("../easing/bounce"),
  sway: _dereq_("../easing/sway"),
  hardbounce: _dereq_("../easing/hardbounce"),
  hardsway: _dereq_("../easing/hardsway"),
  easeInSine: _dereq_("../easing/easeinsine"),
  moveOut: _dereq_("../easing/moveout")
};

Component = (function() {
  Component.prototype.easing = "bounce";

  Component.prototype.duration = 1000;

  Component.prototype.delay = 0;

  Component.prototype.from = null;

  Component.prototype.to = null;

  function Component(options) {
    options || (options = {});
    if (options.easing != null) {
      this.easing = options.easing;
    }
    if (options.duration != null) {
      this.duration = options.duration;
    }
    if (options.delay != null) {
      this.delay = options.delay;
    }
    if (options.from != null) {
      this.from = options.from;
    }
    if (options.to != null) {
      this.to = options.to;
    }
    this.easingObject = new EasingClasses[this.easing](options);
  }

  Component.prototype.calculateEase = function(ratio) {
    return this.easingObject.calculate(ratio);
  };

  Component.prototype.getMatrix = function() {
    return new Matrix4D().identity();
  };

  Component.prototype.getEasedMatrix = function(ratio) {
    return this.getMatrix();
  };

  Component.prototype.serialize = function() {
    var key, ref, serialized, value;
    serialized = {
      type: this.constructor.name.toLowerCase(),
      easing: this.easing,
      duration: this.duration,
      delay: this.delay,
      from: this.from,
      to: this.to
    };
    ref = this.easingObject.serialize();
    for (key in ref) {
      value = ref[key];
      serialized[key] = value;
    }
    return serialized;
  };

  return Component;

})();

module.exports = Component;



},{"../easing/bounce":6,"../easing/easeinsine":7,"../easing/hardbounce":8,"../easing/hardsway":9,"../easing/moveout":11,"../easing/sway":12,"../math/matrix4d":15}],2:[function(_dereq_,module,exports){
var Component, Matrix4D, Rotate, Vector2D,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Matrix4D = _dereq_("../math/matrix4d");

Vector2D = _dereq_("../math/vector2d");

Component = _dereq_("./index");

Rotate = (function(superClass) {
  extend(Rotate, superClass);

  Rotate.prototype.from = 0;

  Rotate.prototype.to = 90;

  function Rotate() {
    Rotate.__super__.constructor.apply(this, arguments);
    this.diff = this.to - this.from;
  }

  Rotate.prototype.getMatrix = function(degrees) {
    var c, radians, s;
    radians = (degrees / 180) * Math.PI;
    c = Math.cos(radians);
    s = Math.sin(radians);
    return new Matrix4D([c, -s, 0, 0, s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  };

  Rotate.prototype.getEasedMatrix = function(ratio) {
    var easedAngle, easedRatio;
    easedRatio = this.calculateEase(ratio);
    easedAngle = this.from + this.diff * easedRatio;
    return this.getMatrix(easedAngle);
  };

  return Rotate;

})(Component);

module.exports = Rotate;



},{"../math/matrix4d":15,"../math/vector2d":16,"./index":1}],3:[function(_dereq_,module,exports){
var Component, Matrix4D, Scale, Vector2D,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Matrix4D = _dereq_("../math/matrix4d");

Vector2D = _dereq_("../math/vector2d");

Component = _dereq_("./index");

Scale = (function(superClass) {
  extend(Scale, superClass);

  Scale.prototype.from = {
    x: 0.5,
    y: 0.5
  };

  Scale.prototype.to = {
    x: 1,
    y: 1
  };

  function Scale() {
    Scale.__super__.constructor.apply(this, arguments);
    this.fromVector = new Vector2D(this.from.x, this.from.y);
    this.toVector = new Vector2D(this.to.x, this.to.y);
    this.diff = this.toVector.clone().subtract(this.fromVector);
  }

  Scale.prototype.getMatrix = function(x, y) {
    var z;
    z = 1;
    return new Matrix4D([x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1]);
  };

  Scale.prototype.getEasedMatrix = function(ratio) {
    var easedRatio, easedVector;
    easedRatio = this.calculateEase(ratio);
    easedVector = this.fromVector.clone().add(this.diff.clone().multiply(easedRatio));
    return this.getMatrix(easedVector.x, easedVector.y);
  };

  return Scale;

})(Component);

module.exports = Scale;



},{"../math/matrix4d":15,"../math/vector2d":16,"./index":1}],4:[function(_dereq_,module,exports){
var Component, Matrix4D, Skew, Vector2D,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Matrix4D = _dereq_("../math/matrix4d");

Vector2D = _dereq_("../math/vector2d");

Component = _dereq_("./index");

Skew = (function(superClass) {
  extend(Skew, superClass);

  Skew.prototype.from = {
    x: 0,
    y: 0
  };

  Skew.prototype.to = {
    x: 20,
    y: 0
  };

  function Skew() {
    Skew.__super__.constructor.apply(this, arguments);
    this.fromVector = new Vector2D(this.from.x, this.from.y);
    this.toVector = new Vector2D(this.to.x, this.to.y);
    this.diff = this.toVector.clone().subtract(this.fromVector);
  }

  Skew.prototype.getMatrix = function(degreesX, degreesY) {
    var radiansX, radiansY, tx, ty;
    radiansX = (degreesX / 180) * Math.PI;
    radiansY = (degreesY / 180) * Math.PI;
    tx = Math.tan(radiansX);
    ty = Math.tan(radiansY);
    return new Matrix4D([1, tx, 0, 0, ty, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  };

  Skew.prototype.getEasedMatrix = function(ratio) {
    var easedRatio, easedVector;
    easedRatio = this.calculateEase(ratio);
    easedVector = this.fromVector.clone().add(this.diff.clone().multiply(easedRatio));
    return this.getMatrix(easedVector.x, easedVector.y);
  };

  return Skew;

})(Component);

module.exports = Skew;



},{"../math/matrix4d":15,"../math/vector2d":16,"./index":1}],5:[function(_dereq_,module,exports){
var Component, Matrix4D, Translate, Vector2D,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Matrix4D = _dereq_("../math/matrix4d");

Vector2D = _dereq_("../math/vector2d");

Component = _dereq_("./index");

Translate = (function(superClass) {
  extend(Translate, superClass);

  Translate.prototype.from = {
    x: 0,
    y: 0
  };

  Translate.prototype.to = {
    x: 0,
    y: 0
  };

  function Translate() {
    Translate.__super__.constructor.apply(this, arguments);
    this.fromVector = new Vector2D(this.from.x, this.from.y);
    this.toVector = new Vector2D(this.to.x, this.to.y);
    this.diff = this.toVector.clone().subtract(this.fromVector);
  }

  Translate.prototype.getMatrix = function(x, y) {
    var z;
    z = 0;
    return new Matrix4D([1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1]);
  };

  Translate.prototype.getEasedMatrix = function(ratio) {
    var easedRatio, easedVector;
    easedRatio = this.calculateEase(ratio);
    easedVector = this.fromVector.clone().add(this.diff.clone().multiply(easedRatio));
    return this.getMatrix(easedVector.x, easedVector.y);
  };

  return Translate;

})(Component);

module.exports = Translate;



},{"../math/matrix4d":15,"../math/vector2d":16,"./index":1}],6:[function(_dereq_,module,exports){
var BounceEasing, Easing,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Easing = _dereq_("./index");

BounceEasing = (function(superClass) {
  extend(BounceEasing, superClass);

  BounceEasing.prototype.bounces = 4;

  BounceEasing.prototype.stiffness = 3;

  function BounceEasing(options) {
    var threshold;
    if (options == null) {
      options = {};
    }
    BounceEasing.__super__.constructor.apply(this, arguments);
    if (options.stiffness != null) {
      this.stiffness = options.stiffness;
    }
    if (options.bounces != null) {
      this.bounces = options.bounces;
    }
    this.alpha = this.stiffness / 100;
    threshold = 0.005 / Math.pow(10, this.stiffness);
    this.limit = Math.floor(Math.log(threshold) / -this.alpha);
    this.omega = this.calculateOmega(this.bounces, this.limit);
  }

  BounceEasing.prototype.calculate = function(ratio) {
    var t;
    if (ratio >= 1) {
      return 1;
    }
    t = ratio * this.limit;
    return 1 - this.exponent(t) * this.oscillation(t);
  };

  BounceEasing.prototype.calculateOmega = function(bounces, limit) {
    return (this.bounces + 0.5) * Math.PI / this.limit;
  };

  BounceEasing.prototype.exponent = function(t) {
    return Math.pow(Math.E, -this.alpha * t);
  };

  BounceEasing.prototype.oscillation = function(t) {
    return Math.cos(this.omega * t);
  };

  BounceEasing.prototype.serialize = function() {
    return {
      stiffness: this.stiffness,
      bounces: this.bounces
    };
  };

  return BounceEasing;

})(Easing);

module.exports = BounceEasing;



},{"./index":10}],7:[function(_dereq_,module,exports){
var Easing, InSineEasing,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Easing = _dereq_("./index");

InSineEasing = (function(superClass) {
  extend(InSineEasing, superClass);

  function InSineEasing(options) {
    if (options == null) {
      options = {};
    }
    InSineEasing.__super__.constructor.apply(this, arguments);
    this.a = 0.105263;
    this.a2 = this.a * this.a;
    this.om2a = 1 - 2 * this.a;
    this.om2a2 = this.om2a * this.om2a;
  }

  InSineEasing.prototype.calculate = function(ratio) {
    if (ratio >= 1) {
      return 1;
    }
    return (this.a2 + this.om2a * ratio + this.a2 - 2 * this.a * Math.sqrt(this.a2 + this.om2a * ratio)) / this.om2a2;
  };

  return InSineEasing;

})(Easing);

module.exports = InSineEasing;



},{"./index":10}],8:[function(_dereq_,module,exports){
var BounceEasing, HardBounceEasing,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

BounceEasing = _dereq_("./bounce");

HardBounceEasing = (function(superClass) {
  extend(HardBounceEasing, superClass);

  function HardBounceEasing() {
    return HardBounceEasing.__super__.constructor.apply(this, arguments);
  }

  HardBounceEasing.prototype.oscillation = function(t) {
    return Math.abs(Math.cos(this.omega * t));
  };

  return HardBounceEasing;

})(BounceEasing);

module.exports = HardBounceEasing;



},{"./bounce":6}],9:[function(_dereq_,module,exports){
var HardSwayEasing, SwayEasing,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

SwayEasing = _dereq_("./sway");

HardSwayEasing = (function(superClass) {
  extend(HardSwayEasing, superClass);

  function HardSwayEasing() {
    return HardSwayEasing.__super__.constructor.apply(this, arguments);
  }

  HardSwayEasing.prototype.oscillation = function(t) {
    return Math.abs(Math.sin(this.omega * t));
  };

  return HardSwayEasing;

})(SwayEasing);

module.exports = HardSwayEasing;



},{"./sway":12}],10:[function(_dereq_,module,exports){
var Easing, MathHelpers;

MathHelpers = _dereq_("../math/helpers");

Easing = (function() {
  function Easing() {}

  Easing.prototype.calculate = function(ratio) {
    return ratio;
  };

  Easing.prototype.serialize = function() {
    return {};
  };

  Easing.prototype.findOptimalKeyPoints = function(threshold, resolution) {
    var area, halfway, i, keyPoint, keyPoints, loops, result, values;
    if (threshold == null) {
      threshold = 1.0;
    }
    if (resolution == null) {
      resolution = 1000;
    }
    keyPoints = [0];
    values = (function() {
      var j, ref, results;
      results = [];
      for (i = j = 0, ref = resolution; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        results.push(this.calculate(i / resolution));
      }
      return results;
    }).call(this);
    keyPoints = keyPoints.concat(MathHelpers.findTurningPoints(values));
    keyPoints.push(resolution - 1);
    i = 0;
    loops = 1000;
    while (loops--) {
      if (i === keyPoints.length - 1) {
        break;
      }
      area = MathHelpers.areaBetweenLineAndCurve(values, keyPoints[i], keyPoints[i + 1]);
      if (area <= threshold) {
        i++;
      } else {
        halfway = Math.round(keyPoints[i] + (keyPoints[i + 1] - keyPoints[i]) / 2);
        keyPoints.splice(i + 1, 0, halfway);
      }
    }
    if (loops === 0) {
      return [];
    }
    return result = (function() {
      var j, len, results;
      results = [];
      for (j = 0, len = keyPoints.length; j < len; j++) {
        keyPoint = keyPoints[j];
        results.push(keyPoint / (resolution - 1));
      }
      return results;
    })();
  };

  return Easing;

})();

module.exports = Easing;



},{"../math/helpers":14}],11:[function(_dereq_,module,exports){
var Easing, MoveOut, t,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Easing = _dereq_("./index");

t = _dereq_("timing-function");

MoveOut = (function(superClass) {
  extend(MoveOut, superClass);

  function MoveOut(options) {
    if (options == null) {
      options = {};
    }
    MoveOut.__super__.constructor.apply(this, arguments);
  }

  MoveOut.prototype.calculate = function(ratio) {
    var func;
    if (ratio >= 1) {
      return 1;
    }
    func = t.get(0.11, -0.33, 0.76, -0.03);
    return func(ratio);
  };

  return MoveOut;

})(Easing);

module.exports = MoveOut;



},{"./index":10,"timing-function":18}],12:[function(_dereq_,module,exports){
var BounceEasing, SwayEasing,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

BounceEasing = _dereq_("./bounce");

SwayEasing = (function(superClass) {
  extend(SwayEasing, superClass);

  function SwayEasing() {
    return SwayEasing.__super__.constructor.apply(this, arguments);
  }

  SwayEasing.prototype.calculate = function(ratio) {
    var t;
    if (ratio >= 1) {
      return 0;
    }
    t = ratio * this.limit;
    return this.exponent(t) * this.oscillation(t);
  };

  SwayEasing.prototype.calculateOmega = function(bounces, limit) {
    return this.bounces * Math.PI / this.limit;
  };

  SwayEasing.prototype.oscillation = function(t) {
    return Math.sin(this.omega * t);
  };

  return SwayEasing;

})(BounceEasing);

module.exports = SwayEasing;



},{"./bounce":6}],13:[function(_dereq_,module,exports){
var Bounce, ComponentClasses, Matrix4D;

Matrix4D = _dereq_("./math/matrix4d");

ComponentClasses = {
  scale: _dereq_("./components/scale"),
  rotate: _dereq_("./components/rotate"),
  translate: _dereq_("./components/translate"),
  skew: _dereq_("./components/skew")
};

Bounce = (function() {
  Bounce.FPS = 30;

  Bounce.counter = 1;

  Bounce.cache = {};

  Bounce.prototype.components = null;

  Bounce.prototype.duration = 0;

  function Bounce() {
    this.components = [];
  }

  Bounce.prototype.scale = function(options) {
    return this.addComponent(new ComponentClasses["scale"](options));
  };

  Bounce.prototype.rotate = function(options) {
    return this.addComponent(new ComponentClasses["rotate"](options));
  };

  Bounce.prototype.translate = function(options) {
    return this.addComponent(new ComponentClasses["translate"](options));
  };

  Bounce.prototype.skew = function(options) {
    return this.addComponent(new ComponentClasses["skew"](options));
  };

  Bounce.prototype.addComponent = function(component) {
    this.components.push(component);
    this.updateDuration();
    return this;
  };

  Bounce.prototype.serialize = function() {
    var component, j, len, ref, serialized;
    serialized = [];
    ref = this.components;
    for (j = 0, len = ref.length; j < len; j++) {
      component = ref[j];
      serialized.push(component.serialize());
    }
    return serialized;
  };

  Bounce.prototype.deserialize = function(serialized) {
    var j, len, options;
    for (j = 0, len = serialized.length; j < len; j++) {
      options = serialized[j];
      this.addComponent(new ComponentClasses[options.type](options));
    }
    return this;
  };

  Bounce.prototype.updateDuration = function() {
    return this.duration = this.components.map(function(component) {
      return component.duration + component.delay;
    }).reduce(function(a, b) {
      return Math.max(a, b);
    });
  };

  Bounce.prototype.define = function(name) {
    var temp;
    temp = JSON.stringify(this.serialize());
    if (Bounce.cache[temp]) {
      this.name = Bounce.cache[temp];
    } else {
      this.name = name || Bounce.generateName();
      Bounce.cache[temp] = this.name;
      this.styleElement = document.createElement("style");
      this.styleElement.innerHTML = this.getKeyframeCSS({
        name: this.name,
        prefix: true
      });
      document.body.appendChild(this.styleElement);
    }
    return this;
  };

  Bounce.prototype.applyTo = function(elements, options) {
    var css, deferred, element, j, k, len, len1, prefix, prefixes, ref;
    if (options == null) {
      options = {};
    }
    this.define();
    if (!elements.length) {
      elements = [elements];
    }
    prefixes = this.getPrefixes();
    deferred = null;
    if (window.jQuery && window.jQuery.Deferred) {
      deferred = new window.jQuery.Deferred();
    }
    for (j = 0, len = elements.length; j < len; j++) {
      element = elements[j];
      ref = prefixes.animation;
      for (k = 0, len1 = ref.length; k < len1; k++) {
        prefix = ref[k];
        css = [this.name, this.duration + "ms", "linear", "both"];
        if (options.loop) {
          css.push("infinite");
        }
        element.style[prefix + "animation"] = css.join(" ");
      }
    }
    if (!options.loop) {
      setTimeout(((function(_this) {
        return function() {
          if (options.remove) {
            _this.remove();
          }
          if (typeof options.onComplete === "function") {
            options.onComplete();
          }
          if (deferred) {
            return deferred.resolve();
          }
        };
      })(this)), this.duration);
    }
    return deferred;
  };

  Bounce.prototype.remove = function() {
    var ref;
    if (!this.styleElement) {
      return;
    }
    if (this.styleElement.remove) {
      return this.styleElement.remove();
    } else {
      return (ref = this.styleElement.parentNode) != null ? ref.removeChild(this.styleElement) : void 0;
    }
  };

  Bounce.prototype.getPrefixes = function(force) {
    var prefixes, style;
    prefixes = {
      transform: [""],
      animation: [""]
    };
    style = document.createElement("dummy").style;
    if (force || (!("transform" in style) && "webkitTransform" in style)) {
      prefixes.transform = ["-webkit-", ""];
    }
    if (force || (!("animation" in style) && "webkitAnimation" in style)) {
      prefixes.animation = ["-webkit-", ""];
    }
    return prefixes;
  };

  Bounce.prototype.getKeyframeCSS = function(options) {
    var animations, j, k, key, keyframeList, keyframes, l, len, len1, len2, matrix, prefix, prefixes, ref, ref1, ref2, transformString, transforms;
    if (options == null) {
      options = {};
    }
    this.name = options.name || Bounce.generateName();
    prefixes = {
      transform: [""],
      animation: [""]
    };
    if (options.prefix || options.forcePrefix) {
      prefixes = this.getPrefixes(options.forcePrefix);
    }
    keyframeList = [];
    keyframes = this.getKeyframes(options);
    ref = this.keys;
    for (j = 0, len = ref.length; j < len; j++) {
      key = ref[j];
      matrix = keyframes[key];
      transformString = "matrix3d" + matrix;
      transforms = [];
      ref1 = prefixes.transform;
      for (k = 0, len1 = ref1.length; k < len1; k++) {
        prefix = ref1[k];
        transforms.push(prefix + "transform: " + transformString + ";");
      }
      keyframeList.push((Math.round(key * 100 * 100) / 100) + "% { " + (transforms.join(" ")) + " }");
    }
    animations = [];
    ref2 = prefixes.animation;
    for (l = 0, len2 = ref2.length; l < len2; l++) {
      prefix = ref2[l];
      animations.push("@" + prefix + "keyframes " + this.name + " { \n  " + (keyframeList.join("\n  ")) + " \n}");
    }
    return animations.join("\n\n");
  };

  Bounce.prototype.getKeyframes = function(options) {
    var component, componentKeys, currentTime, frames, i, j, k, key, keyframes, keys, l, len, len1, len2, m, matrix, ratio, ref, ref1, ref2;
    if (options == null) {
      options = {};
    }
    keys = [0, 1];
    if (options.optimized) {
      ref = this.components;
      for (j = 0, len = ref.length; j < len; j++) {
        component = ref[j];
        componentKeys = component.easingObject.findOptimalKeyPoints().map((function(_this) {
          return function(key) {
            return (key * component.duration / _this.duration) + (component.delay / _this.duration);
          };
        })(this));
        if (component.delay) {
          componentKeys.push((component.delay / this.duration) - 0.001);
        }
        keys = keys.concat(componentKeys);
      }
    } else {
      frames = Math.round((this.duration / 1000) * Bounce.FPS);
      for (i = k = 0, ref1 = frames; 0 <= ref1 ? k <= ref1 : k >= ref1; i = 0 <= ref1 ? ++k : --k) {
        keys.push(i / frames);
      }
    }
    keys = keys.sort(function(a, b) {
      return a - b;
    });
    this.keys = [];
    keyframes = {};
    for (l = 0, len1 = keys.length; l < len1; l++) {
      key = keys[l];
      if (keyframes[key]) {
        continue;
      }
      matrix = new Matrix4D().identity();
      ref2 = this.components;
      for (m = 0, len2 = ref2.length; m < len2; m++) {
        component = ref2[m];
        currentTime = key * this.duration;
        if ((component.delay - currentTime) > 1e-8) {
          continue;
        }
        ratio = (key - component.delay / this.duration) / (component.duration / this.duration);
        matrix.multiply(component.getEasedMatrix(ratio));
      }
      this.keys.push(key);
      keyframes[key] = matrix.transpose().toFixed(3);
    }
    return keyframes;
  };

  Bounce.generateName = function() {
    return "animation-" + (Bounce.counter++);
  };

  Bounce.isSupported = function() {
    var j, k, len, len1, property, propertyIsSupported, propertyList, propertyLists, style;
    style = document.createElement("dummy").style;
    propertyLists = [["transform", "webkitTransform"], ["animation", "webkitAnimation"]];
    for (j = 0, len = propertyLists.length; j < len; j++) {
      propertyList = propertyLists[j];
      propertyIsSupported = false;
      for (k = 0, len1 = propertyList.length; k < len1; k++) {
        property = propertyList[k];
        propertyIsSupported || (propertyIsSupported = property in style);
      }
      if (!propertyIsSupported) {
        return false;
      }
    }
    return true;
  };

  return Bounce;

})();

module.exports = Bounce;



},{"./components/rotate":2,"./components/scale":3,"./components/skew":4,"./components/translate":5,"./math/matrix4d":15}],14:[function(_dereq_,module,exports){
var MathHelpers;

MathHelpers = (function() {
  function MathHelpers() {}

  MathHelpers.prototype.sign = function(value) {
    if (value < 0) {
      return -1;
    }
    return 1;
  };

  MathHelpers.prototype.findTurningPoints = function(values) {
    var i, j, ref, signA, signB, turningPoints;
    turningPoints = [];
    for (i = j = 1, ref = values.length - 1; 1 <= ref ? j < ref : j > ref; i = 1 <= ref ? ++j : --j) {
      signA = this.sign(values[i] - values[i - 1]);
      signB = this.sign(values[i + 1] - values[i]);
      if (signA !== signB) {
        turningPoints.push(i);
      }
    }
    return turningPoints;
  };

  MathHelpers.prototype.areaBetweenLineAndCurve = function(values, start, end) {
    var area, curveValue, i, j, length, lineValue, ref, yEnd, yStart;
    length = end - start;
    yStart = values[start];
    yEnd = values[end];
    area = 0;
    for (i = j = 0, ref = length; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      curveValue = values[start + i];
      lineValue = yStart + (i / length) * (yEnd - yStart);
      area += Math.abs(lineValue - curveValue);
    }
    return area;
  };

  return MathHelpers;

})();

module.exports = new MathHelpers;



},{}],15:[function(_dereq_,module,exports){
var Matrix4D;

Matrix4D = (function() {
  Matrix4D.prototype._array = null;

  function Matrix4D(array) {
    this._array = (array != null ? array.slice(0) : void 0) || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  }

  Matrix4D.prototype.equals = function(matrix) {
    return this.toString() === matrix.toString();
  };

  Matrix4D.prototype.identity = function() {
    this.setArray([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    return this;
  };

  Matrix4D.prototype.multiply = function(matrix) {
    var i, j, k, l, m, o, res, value;
    res = new Matrix4D;
    for (i = l = 0; l < 4; i = ++l) {
      for (j = m = 0; m < 4; j = ++m) {
        for (k = o = 0; o < 4; k = ++o) {
          value = res.get(i, j) + this.get(i, k) * matrix.get(k, j);
          res.set(i, j, value);
        }
      }
    }
    return this.copy(res);
  };

  Matrix4D.prototype.transpose = function() {
    var a;
    a = this.getArray();
    this.setArray([a[0], a[4], a[8], a[12], a[1], a[5], a[9], a[13], a[2], a[6], a[10], a[14], a[3], a[7], a[11], a[15]]);
    return this;
  };

  Matrix4D.prototype.get = function(row, column) {
    return this.getArray()[row * 4 + column];
  };

  Matrix4D.prototype.set = function(row, column, value) {
    return this._array[row * 4 + column] = value;
  };

  Matrix4D.prototype.copy = function(matrix) {
    this._array = matrix.getArray();
    return this;
  };

  Matrix4D.prototype.clone = function() {
    return new Matrix4D(this.getArray());
  };

  Matrix4D.prototype.getArray = function() {
    return this._array.slice(0);
  };

  Matrix4D.prototype.setArray = function(array) {
    this._array = array;
    return this;
  };

  Matrix4D.prototype.toString = function() {
    return "(" + (this.getArray().join(", ")) + ")";
  };

  Matrix4D.prototype.toFixed = function(n) {
    var value;
    this._array = (function() {
      var l, len, ref, results;
      ref = this._array;
      results = [];
      for (l = 0, len = ref.length; l < len; l++) {
        value = ref[l];
        results.push(parseFloat(value.toFixed(n)));
      }
      return results;
    }).call(this);
    return this;
  };

  return Matrix4D;

})();

module.exports = Matrix4D;



},{}],16:[function(_dereq_,module,exports){
var Vector2D;

Vector2D = (function() {
  Vector2D.prototype.x = 0;

  Vector2D.prototype.y = 0;

  function Vector2D(x, y) {
    this.x = x != null ? x : 0;
    this.y = y != null ? y : 0;
  }

  Vector2D.prototype.add = function(vector) {
    if (!Vector2D.isVector2D(vector)) {
      return this._addScalar(vector);
    }
    this.x += vector.x;
    this.y += vector.y;
    return this;
  };

  Vector2D.prototype._addScalar = function(n) {
    this.x += n;
    this.y += n;
    return this;
  };

  Vector2D.prototype.subtract = function(vector) {
    if (!Vector2D.isVector2D(vector)) {
      return this._subtractScalar(vector);
    }
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
  };

  Vector2D.prototype._subtractScalar = function(n) {
    return this._addScalar(-n);
  };

  Vector2D.prototype.multiply = function(vector) {
    if (!Vector2D.isVector2D(vector)) {
      return this._multiplyScalar(vector);
    }
    this.x *= vector.x;
    this.y *= vector.y;
    return this;
  };

  Vector2D.prototype._multiplyScalar = function(n) {
    this.x *= n;
    this.y *= n;
    return this;
  };

  Vector2D.prototype.divide = function(vector) {
    if (!Vector2D.isVector2D(vector)) {
      return this._divideScalar(vector);
    }
    this.x /= vector.x;
    this.y /= vector.y;
    return this;
  };

  Vector2D.prototype._divideScalar = function(n) {
    return this._multiplyScalar(1 / n);
  };

  Vector2D.prototype.clone = function() {
    return new Vector2D(this.x, this.y);
  };

  Vector2D.prototype.copy = function(vector) {
    this.x = vector.x;
    this.y = vector.y;
    return this;
  };

  Vector2D.prototype.equals = function(vector) {
    return vector.x === this.x && vector.y === this.y;
  };

  Vector2D.prototype.toString = function() {
    return "(" + this.x + ", " + this.y + ")";
  };

  Vector2D.prototype.toFixed = function(n) {
    this.x = parseFloat(this.x.toFixed(n));
    this.y = parseFloat(this.y.toFixed(n));
    return this;
  };

  Vector2D.prototype.toArray = function() {
    return [this.x, this.y];
  };

  Vector2D.isVector2D = function(item) {
    return item instanceof Vector2D;
  };

  return Vector2D;

})();

module.exports = Vector2D;



},{}],17:[function(_dereq_,module,exports){
// Generated by CoffeeScript 1.8.0

/*
 * Source: http://stackoverflow.com/a/11697909/607997
 * http://codepen.io/onedayitwillmake/details/EHDmw
 * by Mario Gonzalez
 */

/*
 * Solver for cubic bezier curve with implicit control points at (0,0) and (1.0, 1.0)
 */
var UnitBezier;

module.exports = UnitBezier = (function() {
  function UnitBezier(p1x, p1y, p2x, p2y) {
    this.set(p1x, p1y, p2x, p2y);
  }

  UnitBezier.prototype.set = function(p1x, p1y, p2x, p2y) {
    this._cx = 3.0 * p1x;
    this._bx = 3.0 * (p2x - p1x) - this._cx;
    this._ax = 1.0 - this._cx - this._bx;
    this._cy = 3.0 * p1y;
    this._by = 3.0 * (p2y - p1y) - this._cy;
    this._ay = 1.0 - this._cy - this._by;
  };

  UnitBezier.epsilon = 1e-6;

  UnitBezier.prototype._sampleCurveX = function(t) {
    return ((this._ax * t + this._bx) * t + this._cx) * t;
  };

  UnitBezier.prototype._sampleCurveY = function(t) {
    return ((this._ay * t + this._by) * t + this._cy) * t;
  };

  UnitBezier.prototype._sampleCurveDerivativeX = function(t) {
    return (3.0 * this._ax * t + 2.0 * this._bx) * t + this._cx;
  };

  UnitBezier.prototype._solveCurveX = function(x, epsilon) {
    var d2, i, t0, t1, t2, x2;
    t0 = void 0;
    t1 = void 0;
    t2 = void 0;
    x2 = void 0;
    d2 = void 0;
    i = void 0;
    t2 = x;
    i = 0;
    while (i < 8) {
      x2 = this._sampleCurveX(t2) - x;
      if (Math.abs(x2) < epsilon) {
        return t2;
      }
      d2 = this._sampleCurveDerivativeX(t2);
      if (Math.abs(d2) < epsilon) {
        break;
      }
      t2 = t2 - x2 / d2;
      i++;
    }
    t0 = 0.0;
    t1 = 1.0;
    t2 = x;
    if (t2 < t0) {
      return t0;
    }
    if (t2 > t1) {
      return t1;
    }
    while (t0 < t1) {
      x2 = this._sampleCurveX(t2);
      if (Math.abs(x2 - x) < epsilon) {
        return t2;
      }
      if (x > x2) {
        t0 = t2;
      } else {
        t1 = t2;
      }
      t2 = (t1 - t0) * .5 + t0;
    }
    return t2;
  };

  UnitBezier.prototype.solve = function(x, epsilon) {
    return this._sampleCurveY(this._solveCurveX(x, epsilon));
  };

  UnitBezier.prototype.solveSimple = function(x) {
    return this._sampleCurveY(this._solveCurveX(x, 1e-6));
  };

  return UnitBezier;

})();

},{}],18:[function(_dereq_,module,exports){
// Generated by CoffeeScript 1.8.0
var UnitBezier, isFinite, timingFunction;

UnitBezier = _dereq_('./UnitBezier');

module.exports = timingFunction = {
  UnitBezier: UnitBezier,
  linear: function(p) {
    return p;
  },
  define: function(name, func) {
    var _func, _name;
    if (typeof name === 'object') {
      for (_name in name) {
        _func = name[_name];
        timingFunction.define(_name, _func);
      }
      return;
    }
    return timingFunction[name] = {
      easeIn: func,
      easeOut: function(p, x) {
        return 1 - func(1 - p, x);
      },
      easeInOut: function(p, x) {
        if (p <= 0.5) {
          return 0.5 * func(p * 2, x);
        } else {
          return 0.5 * (2 - func(2 * (1 - p), x));
        }
      }
    };
  },
  get: function(func, x) {
    var b, comp, f, i, part, parts, _i, _j, _len, _len1;
    if (func instanceof Function) {
      return func;
    } else if ((arguments[1] != null) && (arguments[2] != null) && (arguments[3] != null)) {
      b = new UnitBezier(arguments[0], arguments[1], arguments[2], arguments[3]);
      return function(p) {
        return b.solveSimple(p);
      };
    }
    if (Array.isArray(func)) {
      return timingFunction.get.apply(null, func);
    }
    if (typeof func !== 'string') {
      throw Error("func should either be a function or a string, like 'cubic.easeOut'");
    }
    if (func.match(/\,/)) {
      parts = func.split(/\,/);
      if (parts.length !== 4) {
        throw Error("Invalid func '" + func + "'");
      }
      for (i = _i = 0, _len = parts.length; _i < _len; i = ++_i) {
        part = parts[i];
        comp = parseFloat(part.replace(/\s+/g, ''));
        if (!isFinite(comp)) {
          throw Error("Invalid number '" + part + "' in '" + func + "'");
        }
        parts[i] = comp;
      }
      b = new UnitBezier(parts[0], parts[1], parts[2], parts[3]);
      return function(p) {
        return b.solveSimple(p);
      };
    }
    parts = func.split('.');
    f = timingFunction;
    for (_j = 0, _len1 = parts.length; _j < _len1; _j++) {
      part = parts[_j];
      f = f[part];
    }
    if (typeof f === 'undefined') {
      throw Error("Cannot find easing function '" + func + "'");
    }
    if (x != null) {
      return function(p) {
        return f(p, x);
      };
    }
    return f;
  }
};

timingFunction.define({
  quad: function(p) {
    return Math.pow(p, 2);
  },
  cubic: function(p) {
    return Math.pow(p, 3);
  },
  quart: function(p) {
    return Math.pow(p, 4);
  },
  quint: function(p) {
    return Math.pow(p, 5);
  },
  expo: function(p) {
    return Math.pow(2, 8 * (p - 1));
  },
  circ: function(p) {
    return 1 - Math.sin(Math.cos(p));
  },
  sine: function(p) {
    return 1 - Math.cos(p * Math.PI / 2);
  },
  elastic: function(p, x) {
    return Math.pow(2, 10 * (p - 1)) * Math.cos(20 * Math.PI * x / 3 * p);
  },
  bow: function(p, x) {
    return Math.pow(p, 2) * ((x + 1) * p - x);
  },
  bounce: function(p) {
    for(var a = 0, b = 1, result; 1; a += b, b /= 2) {

			if (p >= (7 - 4 * a) / 11) {

				return -Math.pow((11 - 6 * a - 11 * p) / 4, 2) + Math.pow(b, 2)
			}

		}//;
  }
});

isFinite = function(value) {
  if (typeof value !== 'number') {
    return false;
  }
  if (value !== value || value === Infinity || value === -Infinity) {
    return false;
  }
  return true;
};

},{"./UnitBezier":17}]},{},[13])
(13)
});