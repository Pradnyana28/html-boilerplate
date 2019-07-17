/*!
  * Bootstrap v4.3.1 (https://getbootstrap.com/)
  * Copyright 2011-2019 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('jquery')) : typeof define === 'function' && define.amd ? define(['exports', 'jquery'], factory) : (global = global || self, factory(global.bootstrap = {}, global.jQuery));
})(this, function (exports, $) {
  'use strict';

  $ = $ && $.hasOwnProperty('default') ? $['default'] : $;

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }
  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.3.1): util.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  /**
   * ------------------------------------------------------------------------
   * Private TransitionEnd Helpers
   * ------------------------------------------------------------------------
   */


  var TRANSITION_END = 'transitionend';
  var MAX_UID = 1000000;
  var MILLISECONDS_MULTIPLIER = 1000; // Shoutout AngusCroll (https://goo.gl/pxwQGp)

  function toType(obj) {
    return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase();
  }

  function getSpecialTransitionEndEvent() {
    return {
      bindType: TRANSITION_END,
      delegateType: TRANSITION_END,
      handle: function handle(event) {
        if ($(event.target).is(this)) {
          return event.handleObj.handler.apply(this, arguments); // eslint-disable-line prefer-rest-params
        }

        return undefined; // eslint-disable-line no-undefined
      }
    };
  }

  function transitionEndEmulator(duration) {
    var _this = this;

    var called = false;
    $(this).one(Util.TRANSITION_END, function () {
      called = true;
    });
    setTimeout(function () {
      if (!called) {
        Util.triggerTransitionEnd(_this);
      }
    }, duration);
    return this;
  }

  function setTransitionEndSupport() {
    $.fn.emulateTransitionEnd = transitionEndEmulator;
    $.event.special[Util.TRANSITION_END] = getSpecialTransitionEndEvent();
  }
  /**
   * --------------------------------------------------------------------------
   * Public Util Api
   * --------------------------------------------------------------------------
   */


  var Util = {
    TRANSITION_END: 'bsTransitionEnd',
    getUID: function getUID(prefix) {
      do {
        // eslint-disable-next-line no-bitwise
        prefix += ~~(Math.random() * MAX_UID); // "~~" acts like a faster Math.floor() here
      } while (document.getElementById(prefix));

      return prefix;
    },
    getSelectorFromElement: function getSelectorFromElement(element) {
      var selector = element.getAttribute('data-target');

      if (!selector || selector === '#') {
        var hrefAttr = element.getAttribute('href');
        selector = hrefAttr && hrefAttr !== '#' ? hrefAttr.trim() : '';
      }

      try {
        return document.querySelector(selector) ? selector : null;
      } catch (err) {
        return null;
      }
    },
    getTransitionDurationFromElement: function getTransitionDurationFromElement(element) {
      if (!element) {
        return 0;
      } // Get transition-duration of the element


      var transitionDuration = $(element).css('transition-duration');
      var transitionDelay = $(element).css('transition-delay');
      var floatTransitionDuration = parseFloat(transitionDuration);
      var floatTransitionDelay = parseFloat(transitionDelay); // Return 0 if element or transition duration is not found

      if (!floatTransitionDuration && !floatTransitionDelay) {
        return 0;
      } // If multiple durations are defined, take the first


      transitionDuration = transitionDuration.split(',')[0];
      transitionDelay = transitionDelay.split(',')[0];
      return (parseFloat(transitionDuration) + parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
    },
    reflow: function reflow(element) {
      return element.offsetHeight;
    },
    triggerTransitionEnd: function triggerTransitionEnd(element) {
      $(element).trigger(TRANSITION_END);
    },
    // TODO: Remove in v5
    supportsTransitionEnd: function supportsTransitionEnd() {
      return Boolean(TRANSITION_END);
    },
    isElement: function isElement(obj) {
      return (obj[0] || obj).nodeType;
    },
    typeCheckConfig: function typeCheckConfig(componentName, config, configTypes) {
      for (var property in configTypes) {
        if (Object.prototype.hasOwnProperty.call(configTypes, property)) {
          var expectedTypes = configTypes[property];
          var value = config[property];
          var valueType = value && Util.isElement(value) ? 'element' : toType(value);

          if (!new RegExp(expectedTypes).test(valueType)) {
            throw new Error(componentName.toUpperCase() + ": " + ("Option \"" + property + "\" provided type \"" + valueType + "\" ") + ("but expected type \"" + expectedTypes + "\"."));
          }
        }
      }
    },
    findShadowRoot: function findShadowRoot(element) {
      if (!document.documentElement.attachShadow) {
        return null;
      } // Can find the shadow root otherwise it'll return the document


      if (typeof element.getRootNode === 'function') {
        var root = element.getRootNode();
        return root instanceof ShadowRoot ? root : null;
      }

      if (element instanceof ShadowRoot) {
        return element;
      } // when we don't find a shadow root


      if (!element.parentNode) {
        return null;
      }

      return Util.findShadowRoot(element.parentNode);
    }
  };
  setTransitionEndSupport();
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME = 'alert';
  var VERSION = '4.3.1';
  var DATA_KEY = 'bs.alert';
  var EVENT_KEY = "." + DATA_KEY;
  var DATA_API_KEY = '.data-api';
  var JQUERY_NO_CONFLICT = $.fn[NAME];
  var Selector = {
    DISMISS: '[data-dismiss="alert"]'
  };
  var Event = {
    CLOSE: "close" + EVENT_KEY,
    CLOSED: "closed" + EVENT_KEY,
    CLICK_DATA_API: "click" + EVENT_KEY + DATA_API_KEY
  };
  var ClassName = {
    ALERT: 'alert',
    FADE: 'fade',
    SHOW: 'show'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Alert =
  /*#__PURE__*/
  function () {
    function Alert(element) {
      this._element = element;
    } // Getters


    var _proto = Alert.prototype; // Public

    _proto.close = function close(element) {
      var rootElement = this._element;

      if (element) {
        rootElement = this._getRootElement(element);
      }

      var customEvent = this._triggerCloseEvent(rootElement);

      if (customEvent.isDefaultPrevented()) {
        return;
      }

      this._removeElement(rootElement);
    };

    _proto.dispose = function dispose() {
      $.removeData(this._element, DATA_KEY);
      this._element = null;
    } // Private
    ;

    _proto._getRootElement = function _getRootElement(element) {
      var selector = Util.getSelectorFromElement(element);
      var parent = false;

      if (selector) {
        parent = document.querySelector(selector);
      }

      if (!parent) {
        parent = $(element).closest("." + ClassName.ALERT)[0];
      }

      return parent;
    };

    _proto._triggerCloseEvent = function _triggerCloseEvent(element) {
      var closeEvent = $.Event(Event.CLOSE);
      $(element).trigger(closeEvent);
      return closeEvent;
    };

    _proto._removeElement = function _removeElement(element) {
      var _this = this;

      $(element).removeClass(ClassName.SHOW);

      if (!$(element).hasClass(ClassName.FADE)) {
        this._destroyElement(element);

        return;
      }

      var transitionDuration = Util.getTransitionDurationFromElement(element);
      $(element).one(Util.TRANSITION_END, function (event) {
        return _this._destroyElement(element, event);
      }).emulateTransitionEnd(transitionDuration);
    };

    _proto._destroyElement = function _destroyElement(element) {
      $(element).detach().trigger(Event.CLOSED).remove();
    } // Static
    ;

    Alert._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var $element = $(this);
        var data = $element.data(DATA_KEY);

        if (!data) {
          data = new Alert(this);
          $element.data(DATA_KEY, data);
        }

        if (config === 'close') {
          data[config](this);
        }
      });
    };

    Alert._handleDismiss = function _handleDismiss(alertInstance) {
      return function (event) {
        if (event) {
          event.preventDefault();
        }

        alertInstance.close(this);
      };
    };

    _createClass(Alert, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION;
      }
    }]);

    return Alert;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(document).on(Event.CLICK_DATA_API, Selector.DISMISS, Alert._handleDismiss(new Alert()));
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME] = Alert._jQueryInterface;
  $.fn[NAME].Constructor = Alert;

  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT;
    return Alert._jQueryInterface;
  };
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */


  var NAME$1 = 'button';
  var VERSION$1 = '4.3.1';
  var DATA_KEY$1 = 'bs.button';
  var EVENT_KEY$1 = "." + DATA_KEY$1;
  var DATA_API_KEY$1 = '.data-api';
  var JQUERY_NO_CONFLICT$1 = $.fn[NAME$1];
  var ClassName$1 = {
    ACTIVE: 'active',
    BUTTON: 'btn',
    FOCUS: 'focus'
  };
  var Selector$1 = {
    DATA_TOGGLE_CARROT: '[data-toggle^="button"]',
    DATA_TOGGLE: '[data-toggle="buttons"]',
    INPUT: 'input:not([type="hidden"])',
    ACTIVE: '.active',
    BUTTON: '.btn'
  };
  var Event$1 = {
    CLICK_DATA_API: "click" + EVENT_KEY$1 + DATA_API_KEY$1,
    FOCUS_BLUR_DATA_API: "focus" + EVENT_KEY$1 + DATA_API_KEY$1 + " " + ("blur" + EVENT_KEY$1 + DATA_API_KEY$1)
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Button =
  /*#__PURE__*/
  function () {
    function Button(element) {
      this._element = element;
    } // Getters


    var _proto = Button.prototype; // Public

    _proto.toggle = function toggle() {
      var triggerChangeEvent = true;
      var addAriaPressed = true;
      var rootElement = $(this._element).closest(Selector$1.DATA_TOGGLE)[0];

      if (rootElement) {
        var input = this._element.querySelector(Selector$1.INPUT);

        if (input) {
          if (input.type === 'radio') {
            if (input.checked && this._element.classList.contains(ClassName$1.ACTIVE)) {
              triggerChangeEvent = false;
            } else {
              var activeElement = rootElement.querySelector(Selector$1.ACTIVE);

              if (activeElement) {
                $(activeElement).removeClass(ClassName$1.ACTIVE);
              }
            }
          }

          if (triggerChangeEvent) {
            if (input.hasAttribute('disabled') || rootElement.hasAttribute('disabled') || input.classList.contains('disabled') || rootElement.classList.contains('disabled')) {
              return;
            }

            input.checked = !this._element.classList.contains(ClassName$1.ACTIVE);
            $(input).trigger('change');
          }

          input.focus();
          addAriaPressed = false;
        }
      }

      if (addAriaPressed) {
        this._element.setAttribute('aria-pressed', !this._element.classList.contains(ClassName$1.ACTIVE));
      }

      if (triggerChangeEvent) {
        $(this._element).toggleClass(ClassName$1.ACTIVE);
      }
    };

    _proto.dispose = function dispose() {
      $.removeData(this._element, DATA_KEY$1);
      this._element = null;
    } // Static
    ;

    Button._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY$1);

        if (!data) {
          data = new Button(this);
          $(this).data(DATA_KEY$1, data);
        }

        if (config === 'toggle') {
          data[config]();
        }
      });
    };

    _createClass(Button, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$1;
      }
    }]);

    return Button;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(document).on(Event$1.CLICK_DATA_API, Selector$1.DATA_TOGGLE_CARROT, function (event) {
    event.preventDefault();
    var button = event.target;

    if (!$(button).hasClass(ClassName$1.BUTTON)) {
      button = $(button).closest(Selector$1.BUTTON);
    }

    Button._jQueryInterface.call($(button), 'toggle');
  }).on(Event$1.FOCUS_BLUR_DATA_API, Selector$1.DATA_TOGGLE_CARROT, function (event) {
    var button = $(event.target).closest(Selector$1.BUTTON)[0];
    $(button).toggleClass(ClassName$1.FOCUS, /^focus(in)?$/.test(event.type));
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME$1] = Button._jQueryInterface;
  $.fn[NAME$1].Constructor = Button;

  $.fn[NAME$1].noConflict = function () {
    $.fn[NAME$1] = JQUERY_NO_CONFLICT$1;
    return Button._jQueryInterface;
  };
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */


  var NAME$2 = 'carousel';
  var VERSION$2 = '4.3.1';
  var DATA_KEY$2 = 'bs.carousel';
  var EVENT_KEY$2 = "." + DATA_KEY$2;
  var DATA_API_KEY$2 = '.data-api';
  var JQUERY_NO_CONFLICT$2 = $.fn[NAME$2];
  var ARROW_LEFT_KEYCODE = 37; // KeyboardEvent.which value for left arrow key

  var ARROW_RIGHT_KEYCODE = 39; // KeyboardEvent.which value for right arrow key

  var TOUCHEVENT_COMPAT_WAIT = 500; // Time for mouse compat events to fire after touch

  var SWIPE_THRESHOLD = 40;
  var Default = {
    interval: 5000,
    keyboard: true,
    slide: false,
    pause: 'hover',
    wrap: true,
    touch: true
  };
  var DefaultType = {
    interval: '(number|boolean)',
    keyboard: 'boolean',
    slide: '(boolean|string)',
    pause: '(string|boolean)',
    wrap: 'boolean',
    touch: 'boolean'
  };
  var Direction = {
    NEXT: 'next',
    PREV: 'prev',
    LEFT: 'left',
    RIGHT: 'right'
  };
  var Event$2 = {
    SLIDE: "slide" + EVENT_KEY$2,
    SLID: "slid" + EVENT_KEY$2,
    KEYDOWN: "keydown" + EVENT_KEY$2,
    MOUSEENTER: "mouseenter" + EVENT_KEY$2,
    MOUSELEAVE: "mouseleave" + EVENT_KEY$2,
    TOUCHSTART: "touchstart" + EVENT_KEY$2,
    TOUCHMOVE: "touchmove" + EVENT_KEY$2,
    TOUCHEND: "touchend" + EVENT_KEY$2,
    POINTERDOWN: "pointerdown" + EVENT_KEY$2,
    POINTERUP: "pointerup" + EVENT_KEY$2,
    DRAG_START: "dragstart" + EVENT_KEY$2,
    LOAD_DATA_API: "load" + EVENT_KEY$2 + DATA_API_KEY$2,
    CLICK_DATA_API: "click" + EVENT_KEY$2 + DATA_API_KEY$2
  };
  var ClassName$2 = {
    CAROUSEL: 'carousel',
    ACTIVE: 'active',
    SLIDE: 'slide',
    RIGHT: 'carousel-item-right',
    LEFT: 'carousel-item-left',
    NEXT: 'carousel-item-next',
    PREV: 'carousel-item-prev',
    ITEM: 'carousel-item',
    POINTER_EVENT: 'pointer-event'
  };
  var Selector$2 = {
    ACTIVE: '.active',
    ACTIVE_ITEM: '.active.carousel-item',
    ITEM: '.carousel-item',
    ITEM_IMG: '.carousel-item img',
    NEXT_PREV: '.carousel-item-next, .carousel-item-prev',
    INDICATORS: '.carousel-indicators',
    DATA_SLIDE: '[data-slide], [data-slide-to]',
    DATA_RIDE: '[data-ride="carousel"]'
  };
  var PointerType = {
    TOUCH: 'touch',
    PEN: 'pen'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Carousel =
  /*#__PURE__*/
  function () {
    function Carousel(element, config) {
      this._items = null;
      this._interval = null;
      this._activeElement = null;
      this._isPaused = false;
      this._isSliding = false;
      this.touchTimeout = null;
      this.touchStartX = 0;
      this.touchDeltaX = 0;
      this._config = this._getConfig(config);
      this._element = element;
      this._indicatorsElement = this._element.querySelector(Selector$2.INDICATORS);
      this._touchSupported = 'ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0;
      this._pointerEvent = Boolean(window.PointerEvent || window.MSPointerEvent);

      this._addEventListeners();
    } // Getters


    var _proto = Carousel.prototype; // Public

    _proto.next = function next() {
      if (!this._isSliding) {
        this._slide(Direction.NEXT);
      }
    };

    _proto.nextWhenVisible = function nextWhenVisible() {
      // Don't call next when the page isn't visible
      // or the carousel or its parent isn't visible
      if (!document.hidden && $(this._element).is(':visible') && $(this._element).css('visibility') !== 'hidden') {
        this.next();
      }
    };

    _proto.prev = function prev() {
      if (!this._isSliding) {
        this._slide(Direction.PREV);
      }
    };

    _proto.pause = function pause(event) {
      if (!event) {
        this._isPaused = true;
      }

      if (this._element.querySelector(Selector$2.NEXT_PREV)) {
        Util.triggerTransitionEnd(this._element);
        this.cycle(true);
      }

      clearInterval(this._interval);
      this._interval = null;
    };

    _proto.cycle = function cycle(event) {
      if (!event) {
        this._isPaused = false;
      }

      if (this._interval) {
        clearInterval(this._interval);
        this._interval = null;
      }

      if (this._config.interval && !this._isPaused) {
        this._interval = setInterval((document.visibilityState ? this.nextWhenVisible : this.next).bind(this), this._config.interval);
      }
    };

    _proto.to = function to(index) {
      var _this = this;

      this._activeElement = this._element.querySelector(Selector$2.ACTIVE_ITEM);

      var activeIndex = this._getItemIndex(this._activeElement);

      if (index > this._items.length - 1 || index < 0) {
        return;
      }

      if (this._isSliding) {
        $(this._element).one(Event$2.SLID, function () {
          return _this.to(index);
        });
        return;
      }

      if (activeIndex === index) {
        this.pause();
        this.cycle();
        return;
      }

      var direction = index > activeIndex ? Direction.NEXT : Direction.PREV;

      this._slide(direction, this._items[index]);
    };

    _proto.dispose = function dispose() {
      $(this._element).off(EVENT_KEY$2);
      $.removeData(this._element, DATA_KEY$2);
      this._items = null;
      this._config = null;
      this._element = null;
      this._interval = null;
      this._isPaused = null;
      this._isSliding = null;
      this._activeElement = null;
      this._indicatorsElement = null;
    } // Private
    ;

    _proto._getConfig = function _getConfig(config) {
      config = _objectSpread({}, Default, config);
      Util.typeCheckConfig(NAME$2, config, DefaultType);
      return config;
    };

    _proto._handleSwipe = function _handleSwipe() {
      var absDeltax = Math.abs(this.touchDeltaX);

      if (absDeltax <= SWIPE_THRESHOLD) {
        return;
      }

      var direction = absDeltax / this.touchDeltaX; // swipe left

      if (direction > 0) {
        this.prev();
      } // swipe right


      if (direction < 0) {
        this.next();
      }
    };

    _proto._addEventListeners = function _addEventListeners() {
      var _this2 = this;

      if (this._config.keyboard) {
        $(this._element).on(Event$2.KEYDOWN, function (event) {
          return _this2._keydown(event);
        });
      }

      if (this._config.pause === 'hover') {
        $(this._element).on(Event$2.MOUSEENTER, function (event) {
          return _this2.pause(event);
        }).on(Event$2.MOUSELEAVE, function (event) {
          return _this2.cycle(event);
        });
      }

      if (this._config.touch) {
        this._addTouchEventListeners();
      }
    };

    _proto._addTouchEventListeners = function _addTouchEventListeners() {
      var _this3 = this;

      if (!this._touchSupported) {
        return;
      }

      var start = function start(event) {
        if (_this3._pointerEvent && PointerType[event.originalEvent.pointerType.toUpperCase()]) {
          _this3.touchStartX = event.originalEvent.clientX;
        } else if (!_this3._pointerEvent) {
          _this3.touchStartX = event.originalEvent.touches[0].clientX;
        }
      };

      var move = function move(event) {
        // ensure swiping with one touch and not pinching
        if (event.originalEvent.touches && event.originalEvent.touches.length > 1) {
          _this3.touchDeltaX = 0;
        } else {
          _this3.touchDeltaX = event.originalEvent.touches[0].clientX - _this3.touchStartX;
        }
      };

      var end = function end(event) {
        if (_this3._pointerEvent && PointerType[event.originalEvent.pointerType.toUpperCase()]) {
          _this3.touchDeltaX = event.originalEvent.clientX - _this3.touchStartX;
        }

        _this3._handleSwipe();

        if (_this3._config.pause === 'hover') {
          // If it's a touch-enabled device, mouseenter/leave are fired as
          // part of the mouse compatibility events on first tap - the carousel
          // would stop cycling until user tapped out of it;
          // here, we listen for touchend, explicitly pause the carousel
          // (as if it's the second time we tap on it, mouseenter compat event
          // is NOT fired) and after a timeout (to allow for mouse compatibility
          // events to fire) we explicitly restart cycling
          _this3.pause();

          if (_this3.touchTimeout) {
            clearTimeout(_this3.touchTimeout);
          }

          _this3.touchTimeout = setTimeout(function (event) {
            return _this3.cycle(event);
          }, TOUCHEVENT_COMPAT_WAIT + _this3._config.interval);
        }
      };

      $(this._element.querySelectorAll(Selector$2.ITEM_IMG)).on(Event$2.DRAG_START, function (e) {
        return e.preventDefault();
      });

      if (this._pointerEvent) {
        $(this._element).on(Event$2.POINTERDOWN, function (event) {
          return start(event);
        });
        $(this._element).on(Event$2.POINTERUP, function (event) {
          return end(event);
        });

        this._element.classList.add(ClassName$2.POINTER_EVENT);
      } else {
        $(this._element).on(Event$2.TOUCHSTART, function (event) {
          return start(event);
        });
        $(this._element).on(Event$2.TOUCHMOVE, function (event) {
          return move(event);
        });
        $(this._element).on(Event$2.TOUCHEND, function (event) {
          return end(event);
        });
      }
    };

    _proto._keydown = function _keydown(event) {
      if (/input|textarea/i.test(event.target.tagName)) {
        return;
      }

      switch (event.which) {
        case ARROW_LEFT_KEYCODE:
          event.preventDefault();
          this.prev();
          break;

        case ARROW_RIGHT_KEYCODE:
          event.preventDefault();
          this.next();
          break;

        default:
      }
    };

    _proto._getItemIndex = function _getItemIndex(element) {
      this._items = element && element.parentNode ? [].slice.call(element.parentNode.querySelectorAll(Selector$2.ITEM)) : [];
      return this._items.indexOf(element);
    };

    _proto._getItemByDirection = function _getItemByDirection(direction, activeElement) {
      var isNextDirection = direction === Direction.NEXT;
      var isPrevDirection = direction === Direction.PREV;

      var activeIndex = this._getItemIndex(activeElement);

      var lastItemIndex = this._items.length - 1;
      var isGoingToWrap = isPrevDirection && activeIndex === 0 || isNextDirection && activeIndex === lastItemIndex;

      if (isGoingToWrap && !this._config.wrap) {
        return activeElement;
      }

      var delta = direction === Direction.PREV ? -1 : 1;
      var itemIndex = (activeIndex + delta) % this._items.length;
      return itemIndex === -1 ? this._items[this._items.length - 1] : this._items[itemIndex];
    };

    _proto._triggerSlideEvent = function _triggerSlideEvent(relatedTarget, eventDirectionName) {
      var targetIndex = this._getItemIndex(relatedTarget);

      var fromIndex = this._getItemIndex(this._element.querySelector(Selector$2.ACTIVE_ITEM));

      var slideEvent = $.Event(Event$2.SLIDE, {
        relatedTarget: relatedTarget,
        direction: eventDirectionName,
        from: fromIndex,
        to: targetIndex
      });
      $(this._element).trigger(slideEvent);
      return slideEvent;
    };

    _proto._setActiveIndicatorElement = function _setActiveIndicatorElement(element) {
      if (this._indicatorsElement) {
        var indicators = [].slice.call(this._indicatorsElement.querySelectorAll(Selector$2.ACTIVE));
        $(indicators).removeClass(ClassName$2.ACTIVE);

        var nextIndicator = this._indicatorsElement.children[this._getItemIndex(element)];

        if (nextIndicator) {
          $(nextIndicator).addClass(ClassName$2.ACTIVE);
        }
      }
    };

    _proto._slide = function _slide(direction, element) {
      var _this4 = this;

      var activeElement = this._element.querySelector(Selector$2.ACTIVE_ITEM);

      var activeElementIndex = this._getItemIndex(activeElement);

      var nextElement = element || activeElement && this._getItemByDirection(direction, activeElement);

      var nextElementIndex = this._getItemIndex(nextElement);

      var isCycling = Boolean(this._interval);
      var directionalClassName;
      var orderClassName;
      var eventDirectionName;

      if (direction === Direction.NEXT) {
        directionalClassName = ClassName$2.LEFT;
        orderClassName = ClassName$2.NEXT;
        eventDirectionName = Direction.LEFT;
      } else {
        directionalClassName = ClassName$2.RIGHT;
        orderClassName = ClassName$2.PREV;
        eventDirectionName = Direction.RIGHT;
      }

      if (nextElement && $(nextElement).hasClass(ClassName$2.ACTIVE)) {
        this._isSliding = false;
        return;
      }

      var slideEvent = this._triggerSlideEvent(nextElement, eventDirectionName);

      if (slideEvent.isDefaultPrevented()) {
        return;
      }

      if (!activeElement || !nextElement) {
        // Some weirdness is happening, so we bail
        return;
      }

      this._isSliding = true;

      if (isCycling) {
        this.pause();
      }

      this._setActiveIndicatorElement(nextElement);

      var slidEvent = $.Event(Event$2.SLID, {
        relatedTarget: nextElement,
        direction: eventDirectionName,
        from: activeElementIndex,
        to: nextElementIndex
      });

      if ($(this._element).hasClass(ClassName$2.SLIDE)) {
        $(nextElement).addClass(orderClassName);
        Util.reflow(nextElement);
        $(activeElement).addClass(directionalClassName);
        $(nextElement).addClass(directionalClassName);
        var nextElementInterval = parseInt(nextElement.getAttribute('data-interval'), 10);

        if (nextElementInterval) {
          this._config.defaultInterval = this._config.defaultInterval || this._config.interval;
          this._config.interval = nextElementInterval;
        } else {
          this._config.interval = this._config.defaultInterval || this._config.interval;
        }

        var transitionDuration = Util.getTransitionDurationFromElement(activeElement);
        $(activeElement).one(Util.TRANSITION_END, function () {
          $(nextElement).removeClass(directionalClassName + " " + orderClassName).addClass(ClassName$2.ACTIVE);
          $(activeElement).removeClass(ClassName$2.ACTIVE + " " + orderClassName + " " + directionalClassName);
          _this4._isSliding = false;
          setTimeout(function () {
            return $(_this4._element).trigger(slidEvent);
          }, 0);
        }).emulateTransitionEnd(transitionDuration);
      } else {
        $(activeElement).removeClass(ClassName$2.ACTIVE);
        $(nextElement).addClass(ClassName$2.ACTIVE);
        this._isSliding = false;
        $(this._element).trigger(slidEvent);
      }

      if (isCycling) {
        this.cycle();
      }
    } // Static
    ;

    Carousel._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY$2);

        var _config = _objectSpread({}, Default, $(this).data());

        if (typeof config === 'object') {
          _config = _objectSpread({}, _config, config);
        }

        var action = typeof config === 'string' ? config : _config.slide;

        if (!data) {
          data = new Carousel(this, _config);
          $(this).data(DATA_KEY$2, data);
        }

        if (typeof config === 'number') {
          data.to(config);
        } else if (typeof action === 'string') {
          if (typeof data[action] === 'undefined') {
            throw new TypeError("No method named \"" + action + "\"");
          }

          data[action]();
        } else if (_config.interval && _config.ride) {
          data.pause();
          data.cycle();
        }
      });
    };

    Carousel._dataApiClickHandler = function _dataApiClickHandler(event) {
      var selector = Util.getSelectorFromElement(this);

      if (!selector) {
        return;
      }

      var target = $(selector)[0];

      if (!target || !$(target).hasClass(ClassName$2.CAROUSEL)) {
        return;
      }

      var config = _objectSpread({}, $(target).data(), $(this).data());

      var slideIndex = this.getAttribute('data-slide-to');

      if (slideIndex) {
        config.interval = false;
      }

      Carousel._jQueryInterface.call($(target), config);

      if (slideIndex) {
        $(target).data(DATA_KEY$2).to(slideIndex);
      }

      event.preventDefault();
    };

    _createClass(Carousel, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$2;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default;
      }
    }]);

    return Carousel;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(document).on(Event$2.CLICK_DATA_API, Selector$2.DATA_SLIDE, Carousel._dataApiClickHandler);
  $(window).on(Event$2.LOAD_DATA_API, function () {
    var carousels = [].slice.call(document.querySelectorAll(Selector$2.DATA_RIDE));

    for (var i = 0, len = carousels.length; i < len; i++) {
      var $carousel = $(carousels[i]);

      Carousel._jQueryInterface.call($carousel, $carousel.data());
    }
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME$2] = Carousel._jQueryInterface;
  $.fn[NAME$2].Constructor = Carousel;

  $.fn[NAME$2].noConflict = function () {
    $.fn[NAME$2] = JQUERY_NO_CONFLICT$2;
    return Carousel._jQueryInterface;
  };
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */


  var NAME$3 = 'collapse';
  var VERSION$3 = '4.3.1';
  var DATA_KEY$3 = 'bs.collapse';
  var EVENT_KEY$3 = "." + DATA_KEY$3;
  var DATA_API_KEY$3 = '.data-api';
  var JQUERY_NO_CONFLICT$3 = $.fn[NAME$3];
  var Default$1 = {
    toggle: true,
    parent: ''
  };
  var DefaultType$1 = {
    toggle: 'boolean',
    parent: '(string|element)'
  };
  var Event$3 = {
    SHOW: "show" + EVENT_KEY$3,
    SHOWN: "shown" + EVENT_KEY$3,
    HIDE: "hide" + EVENT_KEY$3,
    HIDDEN: "hidden" + EVENT_KEY$3,
    CLICK_DATA_API: "click" + EVENT_KEY$3 + DATA_API_KEY$3
  };
  var ClassName$3 = {
    SHOW: 'show',
    COLLAPSE: 'collapse',
    COLLAPSING: 'collapsing',
    COLLAPSED: 'collapsed'
  };
  var Dimension = {
    WIDTH: 'width',
    HEIGHT: 'height'
  };
  var Selector$3 = {
    ACTIVES: '.show, .collapsing',
    DATA_TOGGLE: '[data-toggle="collapse"]'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Collapse =
  /*#__PURE__*/
  function () {
    function Collapse(element, config) {
      this._isTransitioning = false;
      this._element = element;
      this._config = this._getConfig(config);
      this._triggerArray = [].slice.call(document.querySelectorAll("[data-toggle=\"collapse\"][href=\"#" + element.id + "\"]," + ("[data-toggle=\"collapse\"][data-target=\"#" + element.id + "\"]")));
      var toggleList = [].slice.call(document.querySelectorAll(Selector$3.DATA_TOGGLE));

      for (var i = 0, len = toggleList.length; i < len; i++) {
        var elem = toggleList[i];
        var selector = Util.getSelectorFromElement(elem);
        var filterElement = [].slice.call(document.querySelectorAll(selector)).filter(function (foundElem) {
          return foundElem === element;
        });

        if (selector !== null && filterElement.length > 0) {
          this._selector = selector;

          this._triggerArray.push(elem);
        }
      }

      this._parent = this._config.parent ? this._getParent() : null;

      if (!this._config.parent) {
        this._addAriaAndCollapsedClass(this._element, this._triggerArray);
      }

      if (this._config.toggle) {
        this.toggle();
      }
    } // Getters


    var _proto = Collapse.prototype; // Public

    _proto.toggle = function toggle() {
      if ($(this._element).hasClass(ClassName$3.SHOW)) {
        this.hide();
      } else {
        this.show();
      }
    };

    _proto.show = function show() {
      var _this = this;

      if (this._isTransitioning || $(this._element).hasClass(ClassName$3.SHOW)) {
        return;
      }

      var actives;
      var activesData;

      if (this._parent) {
        actives = [].slice.call(this._parent.querySelectorAll(Selector$3.ACTIVES)).filter(function (elem) {
          if (typeof _this._config.parent === 'string') {
            return elem.getAttribute('data-parent') === _this._config.parent;
          }

          return elem.classList.contains(ClassName$3.COLLAPSE);
        });

        if (actives.length === 0) {
          actives = null;
        }
      }

      if (actives) {
        activesData = $(actives).not(this._selector).data(DATA_KEY$3);

        if (activesData && activesData._isTransitioning) {
          return;
        }
      }

      var startEvent = $.Event(Event$3.SHOW);
      $(this._element).trigger(startEvent);

      if (startEvent.isDefaultPrevented()) {
        return;
      }

      if (actives) {
        Collapse._jQueryInterface.call($(actives).not(this._selector), 'hide');

        if (!activesData) {
          $(actives).data(DATA_KEY$3, null);
        }
      }

      var dimension = this._getDimension();

      $(this._element).removeClass(ClassName$3.COLLAPSE).addClass(ClassName$3.COLLAPSING);
      this._element.style[dimension] = 0;

      if (this._triggerArray.length) {
        $(this._triggerArray).removeClass(ClassName$3.COLLAPSED).attr('aria-expanded', true);
      }

      this.setTransitioning(true);

      var complete = function complete() {
        $(_this._element).removeClass(ClassName$3.COLLAPSING).addClass(ClassName$3.COLLAPSE).addClass(ClassName$3.SHOW);
        _this._element.style[dimension] = '';

        _this.setTransitioning(false);

        $(_this._element).trigger(Event$3.SHOWN);
      };

      var capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
      var scrollSize = "scroll" + capitalizedDimension;
      var transitionDuration = Util.getTransitionDurationFromElement(this._element);
      $(this._element).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
      this._element.style[dimension] = this._element[scrollSize] + "px";
    };

    _proto.hide = function hide() {
      var _this2 = this;

      if (this._isTransitioning || !$(this._element).hasClass(ClassName$3.SHOW)) {
        return;
      }

      var startEvent = $.Event(Event$3.HIDE);
      $(this._element).trigger(startEvent);

      if (startEvent.isDefaultPrevented()) {
        return;
      }

      var dimension = this._getDimension();

      this._element.style[dimension] = this._element.getBoundingClientRect()[dimension] + "px";
      Util.reflow(this._element);
      $(this._element).addClass(ClassName$3.COLLAPSING).removeClass(ClassName$3.COLLAPSE).removeClass(ClassName$3.SHOW);
      var triggerArrayLength = this._triggerArray.length;

      if (triggerArrayLength > 0) {
        for (var i = 0; i < triggerArrayLength; i++) {
          var trigger = this._triggerArray[i];
          var selector = Util.getSelectorFromElement(trigger);

          if (selector !== null) {
            var $elem = $([].slice.call(document.querySelectorAll(selector)));

            if (!$elem.hasClass(ClassName$3.SHOW)) {
              $(trigger).addClass(ClassName$3.COLLAPSED).attr('aria-expanded', false);
            }
          }
        }
      }

      this.setTransitioning(true);

      var complete = function complete() {
        _this2.setTransitioning(false);

        $(_this2._element).removeClass(ClassName$3.COLLAPSING).addClass(ClassName$3.COLLAPSE).trigger(Event$3.HIDDEN);
      };

      this._element.style[dimension] = '';
      var transitionDuration = Util.getTransitionDurationFromElement(this._element);
      $(this._element).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
    };

    _proto.setTransitioning = function setTransitioning(isTransitioning) {
      this._isTransitioning = isTransitioning;
    };

    _proto.dispose = function dispose() {
      $.removeData(this._element, DATA_KEY$3);
      this._config = null;
      this._parent = null;
      this._element = null;
      this._triggerArray = null;
      this._isTransitioning = null;
    } // Private
    ;

    _proto._getConfig = function _getConfig(config) {
      config = _objectSpread({}, Default$1, config);
      config.toggle = Boolean(config.toggle); // Coerce string values

      Util.typeCheckConfig(NAME$3, config, DefaultType$1);
      return config;
    };

    _proto._getDimension = function _getDimension() {
      var hasWidth = $(this._element).hasClass(Dimension.WIDTH);
      return hasWidth ? Dimension.WIDTH : Dimension.HEIGHT;
    };

    _proto._getParent = function _getParent() {
      var _this3 = this;

      var parent;

      if (Util.isElement(this._config.parent)) {
        parent = this._config.parent; // It's a jQuery object

        if (typeof this._config.parent.jquery !== 'undefined') {
          parent = this._config.parent[0];
        }
      } else {
        parent = document.querySelector(this._config.parent);
      }

      var selector = "[data-toggle=\"collapse\"][data-parent=\"" + this._config.parent + "\"]";
      var children = [].slice.call(parent.querySelectorAll(selector));
      $(children).each(function (i, element) {
        _this3._addAriaAndCollapsedClass(Collapse._getTargetFromElement(element), [element]);
      });
      return parent;
    };

    _proto._addAriaAndCollapsedClass = function _addAriaAndCollapsedClass(element, triggerArray) {
      var isOpen = $(element).hasClass(ClassName$3.SHOW);

      if (triggerArray.length) {
        $(triggerArray).toggleClass(ClassName$3.COLLAPSED, !isOpen).attr('aria-expanded', isOpen);
      }
    } // Static
    ;

    Collapse._getTargetFromElement = function _getTargetFromElement(element) {
      var selector = Util.getSelectorFromElement(element);
      return selector ? document.querySelector(selector) : null;
    };

    Collapse._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var $this = $(this);
        var data = $this.data(DATA_KEY$3);

        var _config = _objectSpread({}, Default$1, $this.data(), typeof config === 'object' && config ? config : {});

        if (!data && _config.toggle && /show|hide/.test(config)) {
          _config.toggle = false;
        }

        if (!data) {
          data = new Collapse(this, _config);
          $this.data(DATA_KEY$3, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config]();
        }
      });
    };

    _createClass(Collapse, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$3;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default$1;
      }
    }]);

    return Collapse;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(document).on(Event$3.CLICK_DATA_API, Selector$3.DATA_TOGGLE, function (event) {
    // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
    if (event.currentTarget.tagName === 'A') {
      event.preventDefault();
    }

    var $trigger = $(this);
    var selector = Util.getSelectorFromElement(this);
    var selectors = [].slice.call(document.querySelectorAll(selector));
    $(selectors).each(function () {
      var $target = $(this);
      var data = $target.data(DATA_KEY$3);
      var config = data ? 'toggle' : $trigger.data();

      Collapse._jQueryInterface.call($target, config);
    });
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME$3] = Collapse._jQueryInterface;
  $.fn[NAME$3].Constructor = Collapse;

  $.fn[NAME$3].noConflict = function () {
    $.fn[NAME$3] = JQUERY_NO_CONFLICT$3;
    return Collapse._jQueryInterface;
  };
  /**!
   * @fileOverview Kickass library to create and place poppers near their reference elements.
   * @version 1.14.7
   * @license
   * Copyright (c) 2016 Federico Zivolo and contributors
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   */


  var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
  var longerTimeoutBrowsers = ['Edge', 'Trident', 'Firefox'];
  var timeoutDuration = 0;

  for (var i = 0; i < longerTimeoutBrowsers.length; i += 1) {
    if (isBrowser && navigator.userAgent.indexOf(longerTimeoutBrowsers[i]) >= 0) {
      timeoutDuration = 1;
      break;
    }
  }

  function microtaskDebounce(fn) {
    var called = false;
    return function () {
      if (called) {
        return;
      }

      called = true;
      window.Promise.resolve().then(function () {
        called = false;
        fn();
      });
    };
  }

  function taskDebounce(fn) {
    var scheduled = false;
    return function () {
      if (!scheduled) {
        scheduled = true;
        setTimeout(function () {
          scheduled = false;
          fn();
        }, timeoutDuration);
      }
    };
  }

  var supportsMicroTasks = isBrowser && window.Promise;
  /**
  * Create a debounced version of a method, that's asynchronously deferred
  * but called in the minimum time possible.
  *
  * @method
  * @memberof Popper.Utils
  * @argument {Function} fn
  * @returns {Function}
  */

  var debounce = supportsMicroTasks ? microtaskDebounce : taskDebounce;
  /**
   * Check if the given variable is a function
   * @method
   * @memberof Popper.Utils
   * @argument {Any} functionToCheck - variable to check
   * @returns {Boolean} answer to: is a function?
   */

  function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
  }
  /**
   * Get CSS computed property of the given element
   * @method
   * @memberof Popper.Utils
   * @argument {Eement} element
   * @argument {String} property
   */


  function getStyleComputedProperty(element, property) {
    if (element.nodeType !== 1) {
      return [];
    } // NOTE: 1 DOM access here


    var window = element.ownerDocument.defaultView;
    var css = window.getComputedStyle(element, null);
    return property ? css[property] : css;
  }
  /**
   * Returns the parentNode or the host of the element
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element
   * @returns {Element} parent
   */


  function getParentNode(element) {
    if (element.nodeName === 'HTML') {
      return element;
    }

    return element.parentNode || element.host;
  }
  /**
   * Returns the scrolling parent of the given element
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element
   * @returns {Element} scroll parent
   */


  function getScrollParent(element) {
    // Return body, `getScroll` will take care to get the correct `scrollTop` from it
    if (!element) {
      return document.body;
    }

    switch (element.nodeName) {
      case 'HTML':
      case 'BODY':
        return element.ownerDocument.body;

      case '#document':
        return element.body;
    } // Firefox want us to check `-x` and `-y` variations as well


    var _getStyleComputedProp = getStyleComputedProperty(element),
        overflow = _getStyleComputedProp.overflow,
        overflowX = _getStyleComputedProp.overflowX,
        overflowY = _getStyleComputedProp.overflowY;

    if (/(auto|scroll|overlay)/.test(overflow + overflowY + overflowX)) {
      return element;
    }

    return getScrollParent(getParentNode(element));
  }

  var isIE11 = isBrowser && !!(window.MSInputMethodContext && document.documentMode);
  var isIE10 = isBrowser && /MSIE 10/.test(navigator.userAgent);
  /**
   * Determines if the browser is Internet Explorer
   * @method
   * @memberof Popper.Utils
   * @param {Number} version to check
   * @returns {Boolean} isIE
   */

  function isIE(version) {
    if (version === 11) {
      return isIE11;
    }

    if (version === 10) {
      return isIE10;
    }

    return isIE11 || isIE10;
  }
  /**
   * Returns the offset parent of the given element
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element
   * @returns {Element} offset parent
   */


  function getOffsetParent(element) {
    if (!element) {
      return document.documentElement;
    }

    var noOffsetParent = isIE(10) ? document.body : null; // NOTE: 1 DOM access here

    var offsetParent = element.offsetParent || null; // Skip hidden elements which don't have an offsetParent

    while (offsetParent === noOffsetParent && element.nextElementSibling) {
      offsetParent = (element = element.nextElementSibling).offsetParent;
    }

    var nodeName = offsetParent && offsetParent.nodeName;

    if (!nodeName || nodeName === 'BODY' || nodeName === 'HTML') {
      return element ? element.ownerDocument.documentElement : document.documentElement;
    } // .offsetParent will return the closest TH, TD or TABLE in case
    // no offsetParent is present, I hate this job...


    if (['TH', 'TD', 'TABLE'].indexOf(offsetParent.nodeName) !== -1 && getStyleComputedProperty(offsetParent, 'position') === 'static') {
      return getOffsetParent(offsetParent);
    }

    return offsetParent;
  }

  function isOffsetContainer(element) {
    var nodeName = element.nodeName;

    if (nodeName === 'BODY') {
      return false;
    }

    return nodeName === 'HTML' || getOffsetParent(element.firstElementChild) === element;
  }
  /**
   * Finds the root node (document, shadowDOM root) of the given element
   * @method
   * @memberof Popper.Utils
   * @argument {Element} node
   * @returns {Element} root node
   */


  function getRoot(node) {
    if (node.parentNode !== null) {
      return getRoot(node.parentNode);
    }

    return node;
  }
  /**
   * Finds the offset parent common to the two provided nodes
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element1
   * @argument {Element} element2
   * @returns {Element} common offset parent
   */


  function findCommonOffsetParent(element1, element2) {
    // This check is needed to avoid errors in case one of the elements isn't defined for any reason
    if (!element1 || !element1.nodeType || !element2 || !element2.nodeType) {
      return document.documentElement;
    } // Here we make sure to give as "start" the element that comes first in the DOM


    var order = element1.compareDocumentPosition(element2) & Node.DOCUMENT_POSITION_FOLLOWING;
    var start = order ? element1 : element2;
    var end = order ? element2 : element1; // Get common ancestor container

    var range = document.createRange();
    range.setStart(start, 0);
    range.setEnd(end, 0);
    var commonAncestorContainer = range.commonAncestorContainer; // Both nodes are inside #document

    if (element1 !== commonAncestorContainer && element2 !== commonAncestorContainer || start.contains(end)) {
      if (isOffsetContainer(commonAncestorContainer)) {
        return commonAncestorContainer;
      }

      return getOffsetParent(commonAncestorContainer);
    } // one of the nodes is inside shadowDOM, find which one


    var element1root = getRoot(element1);

    if (element1root.host) {
      return findCommonOffsetParent(element1root.host, element2);
    } else {
      return findCommonOffsetParent(element1, getRoot(element2).host);
    }
  }
  /**
   * Gets the scroll value of the given element in the given side (top and left)
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element
   * @argument {String} side `top` or `left`
   * @returns {number} amount of scrolled pixels
   */


  function getScroll(element) {
    var side = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'top';
    var upperSide = side === 'top' ? 'scrollTop' : 'scrollLeft';
    var nodeName = element.nodeName;

    if (nodeName === 'BODY' || nodeName === 'HTML') {
      var html = element.ownerDocument.documentElement;
      var scrollingElement = element.ownerDocument.scrollingElement || html;
      return scrollingElement[upperSide];
    }

    return element[upperSide];
  }
  /*
   * Sum or subtract the element scroll values (left and top) from a given rect object
   * @method
   * @memberof Popper.Utils
   * @param {Object} rect - Rect object you want to change
   * @param {HTMLElement} element - The element from the function reads the scroll values
   * @param {Boolean} subtract - set to true if you want to subtract the scroll values
   * @return {Object} rect - The modifier rect object
   */


  function includeScroll(rect, element) {
    var subtract = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var scrollTop = getScroll(element, 'top');
    var scrollLeft = getScroll(element, 'left');
    var modifier = subtract ? -1 : 1;
    rect.top += scrollTop * modifier;
    rect.bottom += scrollTop * modifier;
    rect.left += scrollLeft * modifier;
    rect.right += scrollLeft * modifier;
    return rect;
  }
  /*
   * Helper to detect borders of a given element
   * @method
   * @memberof Popper.Utils
   * @param {CSSStyleDeclaration} styles
   * Result of `getStyleComputedProperty` on the given element
   * @param {String} axis - `x` or `y`
   * @return {number} borders - The borders size of the given axis
   */


  function getBordersSize(styles, axis) {
    var sideA = axis === 'x' ? 'Left' : 'Top';
    var sideB = sideA === 'Left' ? 'Right' : 'Bottom';
    return parseFloat(styles['border' + sideA + 'Width'], 10) + parseFloat(styles['border' + sideB + 'Width'], 10);
  }

  function getSize(axis, body, html, computedStyle) {
    return Math.max(body['offset' + axis], body['scroll' + axis], html['client' + axis], html['offset' + axis], html['scroll' + axis], isIE(10) ? parseInt(html['offset' + axis]) + parseInt(computedStyle['margin' + (axis === 'Height' ? 'Top' : 'Left')]) + parseInt(computedStyle['margin' + (axis === 'Height' ? 'Bottom' : 'Right')]) : 0);
  }

  function getWindowSizes(document) {
    var body = document.body;
    var html = document.documentElement;
    var computedStyle = isIE(10) && getComputedStyle(html);
    return {
      height: getSize('Height', body, html, computedStyle),
      width: getSize('Width', body, html, computedStyle)
    };
  }

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var defineProperty = function (obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  };

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };
  /**
   * Given element offsets, generate an output similar to getBoundingClientRect
   * @method
   * @memberof Popper.Utils
   * @argument {Object} offsets
   * @returns {Object} ClientRect like output
   */


  function getClientRect(offsets) {
    return _extends({}, offsets, {
      right: offsets.left + offsets.width,
      bottom: offsets.top + offsets.height
    });
  }
  /**
   * Get bounding client rect of given element
   * @method
   * @memberof Popper.Utils
   * @param {HTMLElement} element
   * @return {Object} client rect
   */


  function getBoundingClientRect(element) {
    var rect = {}; // IE10 10 FIX: Please, don't ask, the element isn't
    // considered in DOM in some circumstances...
    // This isn't reproducible in IE10 compatibility mode of IE11

    try {
      if (isIE(10)) {
        rect = element.getBoundingClientRect();
        var scrollTop = getScroll(element, 'top');
        var scrollLeft = getScroll(element, 'left');
        rect.top += scrollTop;
        rect.left += scrollLeft;
        rect.bottom += scrollTop;
        rect.right += scrollLeft;
      } else {
        rect = element.getBoundingClientRect();
      }
    } catch (e) {}

    var result = {
      left: rect.left,
      top: rect.top,
      width: rect.right - rect.left,
      height: rect.bottom - rect.top
    }; // subtract scrollbar size from sizes

    var sizes = element.nodeName === 'HTML' ? getWindowSizes(element.ownerDocument) : {};
    var width = sizes.width || element.clientWidth || result.right - result.left;
    var height = sizes.height || element.clientHeight || result.bottom - result.top;
    var horizScrollbar = element.offsetWidth - width;
    var vertScrollbar = element.offsetHeight - height; // if an hypothetical scrollbar is detected, we must be sure it's not a `border`
    // we make this check conditional for performance reasons

    if (horizScrollbar || vertScrollbar) {
      var styles = getStyleComputedProperty(element);
      horizScrollbar -= getBordersSize(styles, 'x');
      vertScrollbar -= getBordersSize(styles, 'y');
      result.width -= horizScrollbar;
      result.height -= vertScrollbar;
    }

    return getClientRect(result);
  }

  function getOffsetRectRelativeToArbitraryNode(children, parent) {
    var fixedPosition = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var isIE10 = isIE(10);
    var isHTML = parent.nodeName === 'HTML';
    var childrenRect = getBoundingClientRect(children);
    var parentRect = getBoundingClientRect(parent);
    var scrollParent = getScrollParent(children);
    var styles = getStyleComputedProperty(parent);
    var borderTopWidth = parseFloat(styles.borderTopWidth, 10);
    var borderLeftWidth = parseFloat(styles.borderLeftWidth, 10); // In cases where the parent is fixed, we must ignore negative scroll in offset calc

    if (fixedPosition && isHTML) {
      parentRect.top = Math.max(parentRect.top, 0);
      parentRect.left = Math.max(parentRect.left, 0);
    }

    var offsets = getClientRect({
      top: childrenRect.top - parentRect.top - borderTopWidth,
      left: childrenRect.left - parentRect.left - borderLeftWidth,
      width: childrenRect.width,
      height: childrenRect.height
    });
    offsets.marginTop = 0;
    offsets.marginLeft = 0; // Subtract margins of documentElement in case it's being used as parent
    // we do this only on HTML because it's the only element that behaves
    // differently when margins are applied to it. The margins are included in
    // the box of the documentElement, in the other cases not.

    if (!isIE10 && isHTML) {
      var marginTop = parseFloat(styles.marginTop, 10);
      var marginLeft = parseFloat(styles.marginLeft, 10);
      offsets.top -= borderTopWidth - marginTop;
      offsets.bottom -= borderTopWidth - marginTop;
      offsets.left -= borderLeftWidth - marginLeft;
      offsets.right -= borderLeftWidth - marginLeft; // Attach marginTop and marginLeft because in some circumstances we may need them

      offsets.marginTop = marginTop;
      offsets.marginLeft = marginLeft;
    }

    if (isIE10 && !fixedPosition ? parent.contains(scrollParent) : parent === scrollParent && scrollParent.nodeName !== 'BODY') {
      offsets = includeScroll(offsets, parent);
    }

    return offsets;
  }

  function getViewportOffsetRectRelativeToArtbitraryNode(element) {
    var excludeScroll = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var html = element.ownerDocument.documentElement;
    var relativeOffset = getOffsetRectRelativeToArbitraryNode(element, html);
    var width = Math.max(html.clientWidth, window.innerWidth || 0);
    var height = Math.max(html.clientHeight, window.innerHeight || 0);
    var scrollTop = !excludeScroll ? getScroll(html) : 0;
    var scrollLeft = !excludeScroll ? getScroll(html, 'left') : 0;
    var offset = {
      top: scrollTop - relativeOffset.top + relativeOffset.marginTop,
      left: scrollLeft - relativeOffset.left + relativeOffset.marginLeft,
      width: width,
      height: height
    };
    return getClientRect(offset);
  }
  /**
   * Check if the given element is fixed or is inside a fixed parent
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element
   * @argument {Element} customContainer
   * @returns {Boolean} answer to "isFixed?"
   */


  function isFixed(element) {
    var nodeName = element.nodeName;

    if (nodeName === 'BODY' || nodeName === 'HTML') {
      return false;
    }

    if (getStyleComputedProperty(element, 'position') === 'fixed') {
      return true;
    }

    var parentNode = getParentNode(element);

    if (!parentNode) {
      return false;
    }

    return isFixed(parentNode);
  }
  /**
   * Finds the first parent of an element that has a transformed property defined
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element
   * @returns {Element} first transformed parent or documentElement
   */


  function getFixedPositionOffsetParent(element) {
    // This check is needed to avoid errors in case one of the elements isn't defined for any reason
    if (!element || !element.parentElement || isIE()) {
      return document.documentElement;
    }

    var el = element.parentElement;

    while (el && getStyleComputedProperty(el, 'transform') === 'none') {
      el = el.parentElement;
    }

    return el || document.documentElement;
  }
  /**
   * Computed the boundaries limits and return them
   * @method
   * @memberof Popper.Utils
   * @param {HTMLElement} popper
   * @param {HTMLElement} reference
   * @param {number} padding
   * @param {HTMLElement} boundariesElement - Element used to define the boundaries
   * @param {Boolean} fixedPosition - Is in fixed position mode
   * @returns {Object} Coordinates of the boundaries
   */


  function getBoundaries(popper, reference, padding, boundariesElement) {
    var fixedPosition = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false; // NOTE: 1 DOM access here

    var boundaries = {
      top: 0,
      left: 0
    };
    var offsetParent = fixedPosition ? getFixedPositionOffsetParent(popper) : findCommonOffsetParent(popper, reference); // Handle viewport case

    if (boundariesElement === 'viewport') {
      boundaries = getViewportOffsetRectRelativeToArtbitraryNode(offsetParent, fixedPosition);
    } else {
      // Handle other cases based on DOM element used as boundaries
      var boundariesNode = void 0;

      if (boundariesElement === 'scrollParent') {
        boundariesNode = getScrollParent(getParentNode(reference));

        if (boundariesNode.nodeName === 'BODY') {
          boundariesNode = popper.ownerDocument.documentElement;
        }
      } else if (boundariesElement === 'window') {
        boundariesNode = popper.ownerDocument.documentElement;
      } else {
        boundariesNode = boundariesElement;
      }

      var offsets = getOffsetRectRelativeToArbitraryNode(boundariesNode, offsetParent, fixedPosition); // In case of HTML, we need a different computation

      if (boundariesNode.nodeName === 'HTML' && !isFixed(offsetParent)) {
        var _getWindowSizes = getWindowSizes(popper.ownerDocument),
            height = _getWindowSizes.height,
            width = _getWindowSizes.width;

        boundaries.top += offsets.top - offsets.marginTop;
        boundaries.bottom = height + offsets.top;
        boundaries.left += offsets.left - offsets.marginLeft;
        boundaries.right = width + offsets.left;
      } else {
        // for all the other DOM elements, this one is good
        boundaries = offsets;
      }
    } // Add paddings


    padding = padding || 0;
    var isPaddingNumber = typeof padding === 'number';
    boundaries.left += isPaddingNumber ? padding : padding.left || 0;
    boundaries.top += isPaddingNumber ? padding : padding.top || 0;
    boundaries.right -= isPaddingNumber ? padding : padding.right || 0;
    boundaries.bottom -= isPaddingNumber ? padding : padding.bottom || 0;
    return boundaries;
  }

  function getArea(_ref) {
    var width = _ref.width,
        height = _ref.height;
    return width * height;
  }
  /**
   * Utility used to transform the `auto` placement to the placement with more
   * available space.
   * @method
   * @memberof Popper.Utils
   * @argument {Object} data - The data object generated by update method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */


  function computeAutoPlacement(placement, refRect, popper, reference, boundariesElement) {
    var padding = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

    if (placement.indexOf('auto') === -1) {
      return placement;
    }

    var boundaries = getBoundaries(popper, reference, padding, boundariesElement);
    var rects = {
      top: {
        width: boundaries.width,
        height: refRect.top - boundaries.top
      },
      right: {
        width: boundaries.right - refRect.right,
        height: boundaries.height
      },
      bottom: {
        width: boundaries.width,
        height: boundaries.bottom - refRect.bottom
      },
      left: {
        width: refRect.left - boundaries.left,
        height: boundaries.height
      }
    };
    var sortedAreas = Object.keys(rects).map(function (key) {
      return _extends({
        key: key
      }, rects[key], {
        area: getArea(rects[key])
      });
    }).sort(function (a, b) {
      return b.area - a.area;
    });
    var filteredAreas = sortedAreas.filter(function (_ref2) {
      var width = _ref2.width,
          height = _ref2.height;
      return width >= popper.clientWidth && height >= popper.clientHeight;
    });
    var computedPlacement = filteredAreas.length > 0 ? filteredAreas[0].key : sortedAreas[0].key;
    var variation = placement.split('-')[1];
    return computedPlacement + (variation ? '-' + variation : '');
  }
  /**
   * Get offsets to the reference element
   * @method
   * @memberof Popper.Utils
   * @param {Object} state
   * @param {Element} popper - the popper element
   * @param {Element} reference - the reference element (the popper will be relative to this)
   * @param {Element} fixedPosition - is in fixed position mode
   * @returns {Object} An object containing the offsets which will be applied to the popper
   */


  function getReferenceOffsets(state, popper, reference) {
    var fixedPosition = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    var commonOffsetParent = fixedPosition ? getFixedPositionOffsetParent(popper) : findCommonOffsetParent(popper, reference);
    return getOffsetRectRelativeToArbitraryNode(reference, commonOffsetParent, fixedPosition);
  }
  /**
   * Get the outer sizes of the given element (offset size + margins)
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element
   * @returns {Object} object containing width and height properties
   */


  function getOuterSizes(element) {
    var window = element.ownerDocument.defaultView;
    var styles = window.getComputedStyle(element);
    var x = parseFloat(styles.marginTop || 0) + parseFloat(styles.marginBottom || 0);
    var y = parseFloat(styles.marginLeft || 0) + parseFloat(styles.marginRight || 0);
    var result = {
      width: element.offsetWidth + y,
      height: element.offsetHeight + x
    };
    return result;
  }
  /**
   * Get the opposite placement of the given one
   * @method
   * @memberof Popper.Utils
   * @argument {String} placement
   * @returns {String} flipped placement
   */


  function getOppositePlacement(placement) {
    var hash = {
      left: 'right',
      right: 'left',
      bottom: 'top',
      top: 'bottom'
    };
    return placement.replace(/left|right|bottom|top/g, function (matched) {
      return hash[matched];
    });
  }
  /**
   * Get offsets to the popper
   * @method
   * @memberof Popper.Utils
   * @param {Object} position - CSS position the Popper will get applied
   * @param {HTMLElement} popper - the popper element
   * @param {Object} referenceOffsets - the reference offsets (the popper will be relative to this)
   * @param {String} placement - one of the valid placement options
   * @returns {Object} popperOffsets - An object containing the offsets which will be applied to the popper
   */


  function getPopperOffsets(popper, referenceOffsets, placement) {
    placement = placement.split('-')[0]; // Get popper node sizes

    var popperRect = getOuterSizes(popper); // Add position, width and height to our offsets object

    var popperOffsets = {
      width: popperRect.width,
      height: popperRect.height
    }; // depending by the popper placement we have to compute its offsets slightly differently

    var isHoriz = ['right', 'left'].indexOf(placement) !== -1;
    var mainSide = isHoriz ? 'top' : 'left';
    var secondarySide = isHoriz ? 'left' : 'top';
    var measurement = isHoriz ? 'height' : 'width';
    var secondaryMeasurement = !isHoriz ? 'height' : 'width';
    popperOffsets[mainSide] = referenceOffsets[mainSide] + referenceOffsets[measurement] / 2 - popperRect[measurement] / 2;

    if (placement === secondarySide) {
      popperOffsets[secondarySide] = referenceOffsets[secondarySide] - popperRect[secondaryMeasurement];
    } else {
      popperOffsets[secondarySide] = referenceOffsets[getOppositePlacement(secondarySide)];
    }

    return popperOffsets;
  }
  /**
   * Mimics the `find` method of Array
   * @method
   * @memberof Popper.Utils
   * @argument {Array} arr
   * @argument prop
   * @argument value
   * @returns index or -1
   */


  function find(arr, check) {
    // use native find if supported
    if (Array.prototype.find) {
      return arr.find(check);
    } // use `filter` to obtain the same behavior of `find`


    return arr.filter(check)[0];
  }
  /**
   * Return the index of the matching object
   * @method
   * @memberof Popper.Utils
   * @argument {Array} arr
   * @argument prop
   * @argument value
   * @returns index or -1
   */


  function findIndex(arr, prop, value) {
    // use native findIndex if supported
    if (Array.prototype.findIndex) {
      return arr.findIndex(function (cur) {
        return cur[prop] === value;
      });
    } // use `find` + `indexOf` if `findIndex` isn't supported


    var match = find(arr, function (obj) {
      return obj[prop] === value;
    });
    return arr.indexOf(match);
  }
  /**
   * Loop trough the list of modifiers and run them in order,
   * each of them will then edit the data object.
   * @method
   * @memberof Popper.Utils
   * @param {dataObject} data
   * @param {Array} modifiers
   * @param {String} ends - Optional modifier name used as stopper
   * @returns {dataObject}
   */


  function runModifiers(modifiers, data, ends) {
    var modifiersToRun = ends === undefined ? modifiers : modifiers.slice(0, findIndex(modifiers, 'name', ends));
    modifiersToRun.forEach(function (modifier) {
      if (modifier['function']) {
        // eslint-disable-line dot-notation
        console.warn('`modifier.function` is deprecated, use `modifier.fn`!');
      }

      var fn = modifier['function'] || modifier.fn; // eslint-disable-line dot-notation

      if (modifier.enabled && isFunction(fn)) {
        // Add properties to offsets to make them a complete clientRect object
        // we do this before each modifier to make sure the previous one doesn't
        // mess with these values
        data.offsets.popper = getClientRect(data.offsets.popper);
        data.offsets.reference = getClientRect(data.offsets.reference);
        data = fn(data, modifier);
      }
    });
    return data;
  }
  /**
   * Updates the position of the popper, computing the new offsets and applying
   * the new style.<br />
   * Prefer `scheduleUpdate` over `update` because of performance reasons.
   * @method
   * @memberof Popper
   */


  function update() {
    // if popper is destroyed, don't perform any further update
    if (this.state.isDestroyed) {
      return;
    }

    var data = {
      instance: this,
      styles: {},
      arrowStyles: {},
      attributes: {},
      flipped: false,
      offsets: {}
    }; // compute reference element offsets

    data.offsets.reference = getReferenceOffsets(this.state, this.popper, this.reference, this.options.positionFixed); // compute auto placement, store placement inside the data object,
    // modifiers will be able to edit `placement` if needed
    // and refer to originalPlacement to know the original value

    data.placement = computeAutoPlacement(this.options.placement, data.offsets.reference, this.popper, this.reference, this.options.modifiers.flip.boundariesElement, this.options.modifiers.flip.padding); // store the computed placement inside `originalPlacement`

    data.originalPlacement = data.placement;
    data.positionFixed = this.options.positionFixed; // compute the popper offsets

    data.offsets.popper = getPopperOffsets(this.popper, data.offsets.reference, data.placement);
    data.offsets.popper.position = this.options.positionFixed ? 'fixed' : 'absolute'; // run the modifiers

    data = runModifiers(this.modifiers, data); // the first `update` will call `onCreate` callback
    // the other ones will call `onUpdate` callback

    if (!this.state.isCreated) {
      this.state.isCreated = true;
      this.options.onCreate(data);
    } else {
      this.options.onUpdate(data);
    }
  }
  /**
   * Helper used to know if the given modifier is enabled.
   * @method
   * @memberof Popper.Utils
   * @returns {Boolean}
   */


  function isModifierEnabled(modifiers, modifierName) {
    return modifiers.some(function (_ref) {
      var name = _ref.name,
          enabled = _ref.enabled;
      return enabled && name === modifierName;
    });
  }
  /**
   * Get the prefixed supported property name
   * @method
   * @memberof Popper.Utils
   * @argument {String} property (camelCase)
   * @returns {String} prefixed property (camelCase or PascalCase, depending on the vendor prefix)
   */


  function getSupportedPropertyName(property) {
    var prefixes = [false, 'ms', 'Webkit', 'Moz', 'O'];
    var upperProp = property.charAt(0).toUpperCase() + property.slice(1);

    for (var i = 0; i < prefixes.length; i++) {
      var prefix = prefixes[i];
      var toCheck = prefix ? '' + prefix + upperProp : property;

      if (typeof document.body.style[toCheck] !== 'undefined') {
        return toCheck;
      }
    }

    return null;
  }
  /**
   * Destroys the popper.
   * @method
   * @memberof Popper
   */


  function destroy() {
    this.state.isDestroyed = true; // touch DOM only if `applyStyle` modifier is enabled

    if (isModifierEnabled(this.modifiers, 'applyStyle')) {
      this.popper.removeAttribute('x-placement');
      this.popper.style.position = '';
      this.popper.style.top = '';
      this.popper.style.left = '';
      this.popper.style.right = '';
      this.popper.style.bottom = '';
      this.popper.style.willChange = '';
      this.popper.style[getSupportedPropertyName('transform')] = '';
    }

    this.disableEventListeners(); // remove the popper if user explicity asked for the deletion on destroy
    // do not use `remove` because IE11 doesn't support it

    if (this.options.removeOnDestroy) {
      this.popper.parentNode.removeChild(this.popper);
    }

    return this;
  }
  /**
   * Get the window associated with the element
   * @argument {Element} element
   * @returns {Window}
   */


  function getWindow(element) {
    var ownerDocument = element.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView : window;
  }

  function attachToScrollParents(scrollParent, event, callback, scrollParents) {
    var isBody = scrollParent.nodeName === 'BODY';
    var target = isBody ? scrollParent.ownerDocument.defaultView : scrollParent;
    target.addEventListener(event, callback, {
      passive: true
    });

    if (!isBody) {
      attachToScrollParents(getScrollParent(target.parentNode), event, callback, scrollParents);
    }

    scrollParents.push(target);
  }
  /**
   * Setup needed event listeners used to update the popper position
   * @method
   * @memberof Popper.Utils
   * @private
   */


  function setupEventListeners(reference, options, state, updateBound) {
    // Resize event listener on window
    state.updateBound = updateBound;
    getWindow(reference).addEventListener('resize', state.updateBound, {
      passive: true
    }); // Scroll event listener on scroll parents

    var scrollElement = getScrollParent(reference);
    attachToScrollParents(scrollElement, 'scroll', state.updateBound, state.scrollParents);
    state.scrollElement = scrollElement;
    state.eventsEnabled = true;
    return state;
  }
  /**
   * It will add resize/scroll events and start recalculating
   * position of the popper element when they are triggered.
   * @method
   * @memberof Popper
   */


  function enableEventListeners() {
    if (!this.state.eventsEnabled) {
      this.state = setupEventListeners(this.reference, this.options, this.state, this.scheduleUpdate);
    }
  }
  /**
   * Remove event listeners used to update the popper position
   * @method
   * @memberof Popper.Utils
   * @private
   */


  function removeEventListeners(reference, state) {
    // Remove resize event listener on window
    getWindow(reference).removeEventListener('resize', state.updateBound); // Remove scroll event listener on scroll parents

    state.scrollParents.forEach(function (target) {
      target.removeEventListener('scroll', state.updateBound);
    }); // Reset state

    state.updateBound = null;
    state.scrollParents = [];
    state.scrollElement = null;
    state.eventsEnabled = false;
    return state;
  }
  /**
   * It will remove resize/scroll events and won't recalculate popper position
   * when they are triggered. It also won't trigger `onUpdate` callback anymore,
   * unless you call `update` method manually.
   * @method
   * @memberof Popper
   */


  function disableEventListeners() {
    if (this.state.eventsEnabled) {
      cancelAnimationFrame(this.scheduleUpdate);
      this.state = removeEventListeners(this.reference, this.state);
    }
  }
  /**
   * Tells if a given input is a number
   * @method
   * @memberof Popper.Utils
   * @param {*} input to check
   * @return {Boolean}
   */


  function isNumeric(n) {
    return n !== '' && !isNaN(parseFloat(n)) && isFinite(n);
  }
  /**
   * Set the style to the given popper
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element - Element to apply the style to
   * @argument {Object} styles
   * Object with a list of properties and values which will be applied to the element
   */


  function setStyles(element, styles) {
    Object.keys(styles).forEach(function (prop) {
      var unit = ''; // add unit if the value is numeric and is one of the following

      if (['width', 'height', 'top', 'right', 'bottom', 'left'].indexOf(prop) !== -1 && isNumeric(styles[prop])) {
        unit = 'px';
      }

      element.style[prop] = styles[prop] + unit;
    });
  }
  /**
   * Set the attributes to the given popper
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element - Element to apply the attributes to
   * @argument {Object} styles
   * Object with a list of properties and values which will be applied to the element
   */


  function setAttributes(element, attributes) {
    Object.keys(attributes).forEach(function (prop) {
      var value = attributes[prop];

      if (value !== false) {
        element.setAttribute(prop, attributes[prop]);
      } else {
        element.removeAttribute(prop);
      }
    });
  }
  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by `update` method
   * @argument {Object} data.styles - List of style properties - values to apply to popper element
   * @argument {Object} data.attributes - List of attribute properties - values to apply to popper element
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The same data object
   */


  function applyStyle(data) {
    // any property present in `data.styles` will be applied to the popper,
    // in this way we can make the 3rd party modifiers add custom styles to it
    // Be aware, modifiers could override the properties defined in the previous
    // lines of this modifier!
    setStyles(data.instance.popper, data.styles); // any property present in `data.attributes` will be applied to the popper,
    // they will be set as HTML attributes of the element

    setAttributes(data.instance.popper, data.attributes); // if arrowElement is defined and arrowStyles has some properties

    if (data.arrowElement && Object.keys(data.arrowStyles).length) {
      setStyles(data.arrowElement, data.arrowStyles);
    }

    return data;
  }
  /**
   * Set the x-placement attribute before everything else because it could be used
   * to add margins to the popper margins needs to be calculated to get the
   * correct popper offsets.
   * @method
   * @memberof Popper.modifiers
   * @param {HTMLElement} reference - The reference element used to position the popper
   * @param {HTMLElement} popper - The HTML element used as popper
   * @param {Object} options - Popper.js options
   */


  function applyStyleOnLoad(reference, popper, options, modifierOptions, state) {
    // compute reference element offsets
    var referenceOffsets = getReferenceOffsets(state, popper, reference, options.positionFixed); // compute auto placement, store placement inside the data object,
    // modifiers will be able to edit `placement` if needed
    // and refer to originalPlacement to know the original value

    var placement = computeAutoPlacement(options.placement, referenceOffsets, popper, reference, options.modifiers.flip.boundariesElement, options.modifiers.flip.padding);
    popper.setAttribute('x-placement', placement); // Apply `position` to popper before anything else because
    // without the position applied we can't guarantee correct computations

    setStyles(popper, {
      position: options.positionFixed ? 'fixed' : 'absolute'
    });
    return options;
  }
  /**
   * @function
   * @memberof Popper.Utils
   * @argument {Object} data - The data object generated by `update` method
   * @argument {Boolean} shouldRound - If the offsets should be rounded at all
   * @returns {Object} The popper's position offsets rounded
   *
   * The tale of pixel-perfect positioning. It's still not 100% perfect, but as
   * good as it can be within reason.
   * Discussion here: https://github.com/FezVrasta/popper.js/pull/715
   *
   * Low DPI screens cause a popper to be blurry if not using full pixels (Safari
   * as well on High DPI screens).
   *
   * Firefox prefers no rounding for positioning and does not have blurriness on
   * high DPI screens.
   *
   * Only horizontal placement and left/right values need to be considered.
   */


  function getRoundedOffsets(data, shouldRound) {
    var _data$offsets = data.offsets,
        popper = _data$offsets.popper,
        reference = _data$offsets.reference;
    var round = Math.round,
        floor = Math.floor;

    var noRound = function noRound(v) {
      return v;
    };

    var referenceWidth = round(reference.width);
    var popperWidth = round(popper.width);
    var isVertical = ['left', 'right'].indexOf(data.placement) !== -1;
    var isVariation = data.placement.indexOf('-') !== -1;
    var sameWidthParity = referenceWidth % 2 === popperWidth % 2;
    var bothOddWidth = referenceWidth % 2 === 1 && popperWidth % 2 === 1;
    var horizontalToInteger = !shouldRound ? noRound : isVertical || isVariation || sameWidthParity ? round : floor;
    var verticalToInteger = !shouldRound ? noRound : round;
    return {
      left: horizontalToInteger(bothOddWidth && !isVariation && shouldRound ? popper.left - 1 : popper.left),
      top: verticalToInteger(popper.top),
      bottom: verticalToInteger(popper.bottom),
      right: horizontalToInteger(popper.right)
    };
  }

  var isFirefox = isBrowser && /Firefox/i.test(navigator.userAgent);
  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by `update` method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */

  function computeStyle(data, options) {
    var x = options.x,
        y = options.y;
    var popper = data.offsets.popper; // Remove this legacy support in Popper.js v2

    var legacyGpuAccelerationOption = find(data.instance.modifiers, function (modifier) {
      return modifier.name === 'applyStyle';
    }).gpuAcceleration;

    if (legacyGpuAccelerationOption !== undefined) {
      console.warn('WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!');
    }

    var gpuAcceleration = legacyGpuAccelerationOption !== undefined ? legacyGpuAccelerationOption : options.gpuAcceleration;
    var offsetParent = getOffsetParent(data.instance.popper);
    var offsetParentRect = getBoundingClientRect(offsetParent); // Styles

    var styles = {
      position: popper.position
    };
    var offsets = getRoundedOffsets(data, window.devicePixelRatio < 2 || !isFirefox);
    var sideA = x === 'bottom' ? 'top' : 'bottom';
    var sideB = y === 'right' ? 'left' : 'right'; // if gpuAcceleration is set to `true` and transform is supported,
    //  we use `translate3d` to apply the position to the popper we
    // automatically use the supported prefixed version if needed

    var prefixedProperty = getSupportedPropertyName('transform'); // now, let's make a step back and look at this code closely (wtf?)
    // If the content of the popper grows once it's been positioned, it
    // may happen that the popper gets misplaced because of the new content
    // overflowing its reference element
    // To avoid this problem, we provide two options (x and y), which allow
    // the consumer to define the offset origin.
    // If we position a popper on top of a reference element, we can set
    // `x` to `top` to make the popper grow towards its top instead of
    // its bottom.

    var left = void 0,
        top = void 0;

    if (sideA === 'bottom') {
      // when offsetParent is <html> the positioning is relative to the bottom of the screen (excluding the scrollbar)
      // and not the bottom of the html element
      if (offsetParent.nodeName === 'HTML') {
        top = -offsetParent.clientHeight + offsets.bottom;
      } else {
        top = -offsetParentRect.height + offsets.bottom;
      }
    } else {
      top = offsets.top;
    }

    if (sideB === 'right') {
      if (offsetParent.nodeName === 'HTML') {
        left = -offsetParent.clientWidth + offsets.right;
      } else {
        left = -offsetParentRect.width + offsets.right;
      }
    } else {
      left = offsets.left;
    }

    if (gpuAcceleration && prefixedProperty) {
      styles[prefixedProperty] = 'translate3d(' + left + 'px, ' + top + 'px, 0)';
      styles[sideA] = 0;
      styles[sideB] = 0;
      styles.willChange = 'transform';
    } else {
      // othwerise, we use the standard `top`, `left`, `bottom` and `right` properties
      var invertTop = sideA === 'bottom' ? -1 : 1;
      var invertLeft = sideB === 'right' ? -1 : 1;
      styles[sideA] = top * invertTop;
      styles[sideB] = left * invertLeft;
      styles.willChange = sideA + ', ' + sideB;
    } // Attributes


    var attributes = {
      'x-placement': data.placement
    }; // Update `data` attributes, styles and arrowStyles

    data.attributes = _extends({}, attributes, data.attributes);
    data.styles = _extends({}, styles, data.styles);
    data.arrowStyles = _extends({}, data.offsets.arrow, data.arrowStyles);
    return data;
  }
  /**
   * Helper used to know if the given modifier depends from another one.<br />
   * It checks if the needed modifier is listed and enabled.
   * @method
   * @memberof Popper.Utils
   * @param {Array} modifiers - list of modifiers
   * @param {String} requestingName - name of requesting modifier
   * @param {String} requestedName - name of requested modifier
   * @returns {Boolean}
   */


  function isModifierRequired(modifiers, requestingName, requestedName) {
    var requesting = find(modifiers, function (_ref) {
      var name = _ref.name;
      return name === requestingName;
    });
    var isRequired = !!requesting && modifiers.some(function (modifier) {
      return modifier.name === requestedName && modifier.enabled && modifier.order < requesting.order;
    });

    if (!isRequired) {
      var _requesting = '`' + requestingName + '`';

      var requested = '`' + requestedName + '`';
      console.warn(requested + ' modifier is required by ' + _requesting + ' modifier in order to work, be sure to include it before ' + _requesting + '!');
    }

    return isRequired;
  }
  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by update method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */


  function arrow(data, options) {
    var _data$offsets$arrow; // arrow depends on keepTogether in order to work


    if (!isModifierRequired(data.instance.modifiers, 'arrow', 'keepTogether')) {
      return data;
    }

    var arrowElement = options.element; // if arrowElement is a string, suppose it's a CSS selector

    if (typeof arrowElement === 'string') {
      arrowElement = data.instance.popper.querySelector(arrowElement); // if arrowElement is not found, don't run the modifier

      if (!arrowElement) {
        return data;
      }
    } else {
      // if the arrowElement isn't a query selector we must check that the
      // provided DOM node is child of its popper node
      if (!data.instance.popper.contains(arrowElement)) {
        console.warn('WARNING: `arrow.element` must be child of its popper element!');
        return data;
      }
    }

    var placement = data.placement.split('-')[0];
    var _data$offsets = data.offsets,
        popper = _data$offsets.popper,
        reference = _data$offsets.reference;
    var isVertical = ['left', 'right'].indexOf(placement) !== -1;
    var len = isVertical ? 'height' : 'width';
    var sideCapitalized = isVertical ? 'Top' : 'Left';
    var side = sideCapitalized.toLowerCase();
    var altSide = isVertical ? 'left' : 'top';
    var opSide = isVertical ? 'bottom' : 'right';
    var arrowElementSize = getOuterSizes(arrowElement)[len]; //
    // extends keepTogether behavior making sure the popper and its
    // reference have enough pixels in conjunction
    //
    // top/left side

    if (reference[opSide] - arrowElementSize < popper[side]) {
      data.offsets.popper[side] -= popper[side] - (reference[opSide] - arrowElementSize);
    } // bottom/right side


    if (reference[side] + arrowElementSize > popper[opSide]) {
      data.offsets.popper[side] += reference[side] + arrowElementSize - popper[opSide];
    }

    data.offsets.popper = getClientRect(data.offsets.popper); // compute center of the popper

    var center = reference[side] + reference[len] / 2 - arrowElementSize / 2; // Compute the sideValue using the updated popper offsets
    // take popper margin in account because we don't have this info available

    var css = getStyleComputedProperty(data.instance.popper);
    var popperMarginSide = parseFloat(css['margin' + sideCapitalized], 10);
    var popperBorderSide = parseFloat(css['border' + sideCapitalized + 'Width'], 10);
    var sideValue = center - data.offsets.popper[side] - popperMarginSide - popperBorderSide; // prevent arrowElement from being placed not contiguously to its popper

    sideValue = Math.max(Math.min(popper[len] - arrowElementSize, sideValue), 0);
    data.arrowElement = arrowElement;
    data.offsets.arrow = (_data$offsets$arrow = {}, defineProperty(_data$offsets$arrow, side, Math.round(sideValue)), defineProperty(_data$offsets$arrow, altSide, ''), _data$offsets$arrow);
    return data;
  }
  /**
   * Get the opposite placement variation of the given one
   * @method
   * @memberof Popper.Utils
   * @argument {String} placement variation
   * @returns {String} flipped placement variation
   */


  function getOppositeVariation(variation) {
    if (variation === 'end') {
      return 'start';
    } else if (variation === 'start') {
      return 'end';
    }

    return variation;
  }
  /**
   * List of accepted placements to use as values of the `placement` option.<br />
   * Valid placements are:
   * - `auto`
   * - `top`
   * - `right`
   * - `bottom`
   * - `left`
   *
   * Each placement can have a variation from this list:
   * - `-start`
   * - `-end`
   *
   * Variations are interpreted easily if you think of them as the left to right
   * written languages. Horizontally (`top` and `bottom`), `start` is left and `end`
   * is right.<br />
   * Vertically (`left` and `right`), `start` is top and `end` is bottom.
   *
   * Some valid examples are:
   * - `top-end` (on top of reference, right aligned)
   * - `right-start` (on right of reference, top aligned)
   * - `bottom` (on bottom, centered)
   * - `auto-end` (on the side with more space available, alignment depends by placement)
   *
   * @static
   * @type {Array}
   * @enum {String}
   * @readonly
   * @method placements
   * @memberof Popper
   */


  var placements = ['auto-start', 'auto', 'auto-end', 'top-start', 'top', 'top-end', 'right-start', 'right', 'right-end', 'bottom-end', 'bottom', 'bottom-start', 'left-end', 'left', 'left-start']; // Get rid of `auto` `auto-start` and `auto-end`

  var validPlacements = placements.slice(3);
  /**
   * Given an initial placement, returns all the subsequent placements
   * clockwise (or counter-clockwise).
   *
   * @method
   * @memberof Popper.Utils
   * @argument {String} placement - A valid placement (it accepts variations)
   * @argument {Boolean} counter - Set to true to walk the placements counterclockwise
   * @returns {Array} placements including their variations
   */

  function clockwise(placement) {
    var counter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var index = validPlacements.indexOf(placement);
    var arr = validPlacements.slice(index + 1).concat(validPlacements.slice(0, index));
    return counter ? arr.reverse() : arr;
  }

  var BEHAVIORS = {
    FLIP: 'flip',
    CLOCKWISE: 'clockwise',
    COUNTERCLOCKWISE: 'counterclockwise'
  };
  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by update method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */

  function flip(data, options) {
    // if `inner` modifier is enabled, we can't use the `flip` modifier
    if (isModifierEnabled(data.instance.modifiers, 'inner')) {
      return data;
    }

    if (data.flipped && data.placement === data.originalPlacement) {
      // seems like flip is trying to loop, probably there's not enough space on any of the flippable sides
      return data;
    }

    var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, options.boundariesElement, data.positionFixed);
    var placement = data.placement.split('-')[0];
    var placementOpposite = getOppositePlacement(placement);
    var variation = data.placement.split('-')[1] || '';
    var flipOrder = [];

    switch (options.behavior) {
      case BEHAVIORS.FLIP:
        flipOrder = [placement, placementOpposite];
        break;

      case BEHAVIORS.CLOCKWISE:
        flipOrder = clockwise(placement);
        break;

      case BEHAVIORS.COUNTERCLOCKWISE:
        flipOrder = clockwise(placement, true);
        break;

      default:
        flipOrder = options.behavior;
    }

    flipOrder.forEach(function (step, index) {
      if (placement !== step || flipOrder.length === index + 1) {
        return data;
      }

      placement = data.placement.split('-')[0];
      placementOpposite = getOppositePlacement(placement);
      var popperOffsets = data.offsets.popper;
      var refOffsets = data.offsets.reference; // using floor because the reference offsets may contain decimals we are not going to consider here

      var floor = Math.floor;
      var overlapsRef = placement === 'left' && floor(popperOffsets.right) > floor(refOffsets.left) || placement === 'right' && floor(popperOffsets.left) < floor(refOffsets.right) || placement === 'top' && floor(popperOffsets.bottom) > floor(refOffsets.top) || placement === 'bottom' && floor(popperOffsets.top) < floor(refOffsets.bottom);
      var overflowsLeft = floor(popperOffsets.left) < floor(boundaries.left);
      var overflowsRight = floor(popperOffsets.right) > floor(boundaries.right);
      var overflowsTop = floor(popperOffsets.top) < floor(boundaries.top);
      var overflowsBottom = floor(popperOffsets.bottom) > floor(boundaries.bottom);
      var overflowsBoundaries = placement === 'left' && overflowsLeft || placement === 'right' && overflowsRight || placement === 'top' && overflowsTop || placement === 'bottom' && overflowsBottom; // flip the variation if required

      var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;
      var flippedVariation = !!options.flipVariations && (isVertical && variation === 'start' && overflowsLeft || isVertical && variation === 'end' && overflowsRight || !isVertical && variation === 'start' && overflowsTop || !isVertical && variation === 'end' && overflowsBottom);

      if (overlapsRef || overflowsBoundaries || flippedVariation) {
        // this boolean to detect any flip loop
        data.flipped = true;

        if (overlapsRef || overflowsBoundaries) {
          placement = flipOrder[index + 1];
        }

        if (flippedVariation) {
          variation = getOppositeVariation(variation);
        }

        data.placement = placement + (variation ? '-' + variation : ''); // this object contains `position`, we want to preserve it along with
        // any additional property we may add in the future

        data.offsets.popper = _extends({}, data.offsets.popper, getPopperOffsets(data.instance.popper, data.offsets.reference, data.placement));
        data = runModifiers(data.instance.modifiers, data, 'flip');
      }
    });
    return data;
  }
  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by update method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */


  function keepTogether(data) {
    var _data$offsets = data.offsets,
        popper = _data$offsets.popper,
        reference = _data$offsets.reference;
    var placement = data.placement.split('-')[0];
    var floor = Math.floor;
    var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;
    var side = isVertical ? 'right' : 'bottom';
    var opSide = isVertical ? 'left' : 'top';
    var measurement = isVertical ? 'width' : 'height';

    if (popper[side] < floor(reference[opSide])) {
      data.offsets.popper[opSide] = floor(reference[opSide]) - popper[measurement];
    }

    if (popper[opSide] > floor(reference[side])) {
      data.offsets.popper[opSide] = floor(reference[side]);
    }

    return data;
  }
  /**
   * Converts a string containing value + unit into a px value number
   * @function
   * @memberof {modifiers~offset}
   * @private
   * @argument {String} str - Value + unit string
   * @argument {String} measurement - `height` or `width`
   * @argument {Object} popperOffsets
   * @argument {Object} referenceOffsets
   * @returns {Number|String}
   * Value in pixels, or original string if no values were extracted
   */


  function toValue(str, measurement, popperOffsets, referenceOffsets) {
    // separate value from unit
    var split = str.match(/((?:\-|\+)?\d*\.?\d*)(.*)/);
    var value = +split[1];
    var unit = split[2]; // If it's not a number it's an operator, I guess

    if (!value) {
      return str;
    }

    if (unit.indexOf('%') === 0) {
      var element = void 0;

      switch (unit) {
        case '%p':
          element = popperOffsets;
          break;

        case '%':
        case '%r':
        default:
          element = referenceOffsets;
      }

      var rect = getClientRect(element);
      return rect[measurement] / 100 * value;
    } else if (unit === 'vh' || unit === 'vw') {
      // if is a vh or vw, we calculate the size based on the viewport
      var size = void 0;

      if (unit === 'vh') {
        size = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      } else {
        size = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      }

      return size / 100 * value;
    } else {
      // if is an explicit pixel unit, we get rid of the unit and keep the value
      // if is an implicit unit, it's px, and we return just the value
      return value;
    }
  }
  /**
   * Parse an `offset` string to extrapolate `x` and `y` numeric offsets.
   * @function
   * @memberof {modifiers~offset}
   * @private
   * @argument {String} offset
   * @argument {Object} popperOffsets
   * @argument {Object} referenceOffsets
   * @argument {String} basePlacement
   * @returns {Array} a two cells array with x and y offsets in numbers
   */


  function parseOffset(offset, popperOffsets, referenceOffsets, basePlacement) {
    var offsets = [0, 0]; // Use height if placement is left or right and index is 0 otherwise use width
    // in this way the first offset will use an axis and the second one
    // will use the other one

    var useHeight = ['right', 'left'].indexOf(basePlacement) !== -1; // Split the offset string to obtain a list of values and operands
    // The regex addresses values with the plus or minus sign in front (+10, -20, etc)

    var fragments = offset.split(/(\+|\-)/).map(function (frag) {
      return frag.trim();
    }); // Detect if the offset string contains a pair of values or a single one
    // they could be separated by comma or space

    var divider = fragments.indexOf(find(fragments, function (frag) {
      return frag.search(/,|\s/) !== -1;
    }));

    if (fragments[divider] && fragments[divider].indexOf(',') === -1) {
      console.warn('Offsets separated by white space(s) are deprecated, use a comma (,) instead.');
    } // If divider is found, we divide the list of values and operands to divide
    // them by ofset X and Y.


    var splitRegex = /\s*,\s*|\s+/;
    var ops = divider !== -1 ? [fragments.slice(0, divider).concat([fragments[divider].split(splitRegex)[0]]), [fragments[divider].split(splitRegex)[1]].concat(fragments.slice(divider + 1))] : [fragments]; // Convert the values with units to absolute pixels to allow our computations

    ops = ops.map(function (op, index) {
      // Most of the units rely on the orientation of the popper
      var measurement = (index === 1 ? !useHeight : useHeight) ? 'height' : 'width';
      var mergeWithPrevious = false;
      return op // This aggregates any `+` or `-` sign that aren't considered operators
      // e.g.: 10 + +5 => [10, +, +5]
      .reduce(function (a, b) {
        if (a[a.length - 1] === '' && ['+', '-'].indexOf(b) !== -1) {
          a[a.length - 1] = b;
          mergeWithPrevious = true;
          return a;
        } else if (mergeWithPrevious) {
          a[a.length - 1] += b;
          mergeWithPrevious = false;
          return a;
        } else {
          return a.concat(b);
        }
      }, []) // Here we convert the string values into number values (in px)
      .map(function (str) {
        return toValue(str, measurement, popperOffsets, referenceOffsets);
      });
    }); // Loop trough the offsets arrays and execute the operations

    ops.forEach(function (op, index) {
      op.forEach(function (frag, index2) {
        if (isNumeric(frag)) {
          offsets[index] += frag * (op[index2 - 1] === '-' ? -1 : 1);
        }
      });
    });
    return offsets;
  }
  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by update method
   * @argument {Object} options - Modifiers configuration and options
   * @argument {Number|String} options.offset=0
   * The offset value as described in the modifier description
   * @returns {Object} The data object, properly modified
   */


  function offset(data, _ref) {
    var offset = _ref.offset;
    var placement = data.placement,
        _data$offsets = data.offsets,
        popper = _data$offsets.popper,
        reference = _data$offsets.reference;
    var basePlacement = placement.split('-')[0];
    var offsets = void 0;

    if (isNumeric(+offset)) {
      offsets = [+offset, 0];
    } else {
      offsets = parseOffset(offset, popper, reference, basePlacement);
    }

    if (basePlacement === 'left') {
      popper.top += offsets[0];
      popper.left -= offsets[1];
    } else if (basePlacement === 'right') {
      popper.top += offsets[0];
      popper.left += offsets[1];
    } else if (basePlacement === 'top') {
      popper.left += offsets[0];
      popper.top -= offsets[1];
    } else if (basePlacement === 'bottom') {
      popper.left += offsets[0];
      popper.top += offsets[1];
    }

    data.popper = popper;
    return data;
  }
  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by `update` method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */


  function preventOverflow(data, options) {
    var boundariesElement = options.boundariesElement || getOffsetParent(data.instance.popper); // If offsetParent is the reference element, we really want to
    // go one step up and use the next offsetParent as reference to
    // avoid to make this modifier completely useless and look like broken

    if (data.instance.reference === boundariesElement) {
      boundariesElement = getOffsetParent(boundariesElement);
    } // NOTE: DOM access here
    // resets the popper's position so that the document size can be calculated excluding
    // the size of the popper element itself


    var transformProp = getSupportedPropertyName('transform');
    var popperStyles = data.instance.popper.style; // assignment to help minification

    var top = popperStyles.top,
        left = popperStyles.left,
        transform = popperStyles[transformProp];
    popperStyles.top = '';
    popperStyles.left = '';
    popperStyles[transformProp] = '';
    var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, boundariesElement, data.positionFixed); // NOTE: DOM access here
    // restores the original style properties after the offsets have been computed

    popperStyles.top = top;
    popperStyles.left = left;
    popperStyles[transformProp] = transform;
    options.boundaries = boundaries;
    var order = options.priority;
    var popper = data.offsets.popper;
    var check = {
      primary: function primary(placement) {
        var value = popper[placement];

        if (popper[placement] < boundaries[placement] && !options.escapeWithReference) {
          value = Math.max(popper[placement], boundaries[placement]);
        }

        return defineProperty({}, placement, value);
      },
      secondary: function secondary(placement) {
        var mainSide = placement === 'right' ? 'left' : 'top';
        var value = popper[mainSide];

        if (popper[placement] > boundaries[placement] && !options.escapeWithReference) {
          value = Math.min(popper[mainSide], boundaries[placement] - (placement === 'right' ? popper.width : popper.height));
        }

        return defineProperty({}, mainSide, value);
      }
    };
    order.forEach(function (placement) {
      var side = ['left', 'top'].indexOf(placement) !== -1 ? 'primary' : 'secondary';
      popper = _extends({}, popper, check[side](placement));
    });
    data.offsets.popper = popper;
    return data;
  }
  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by `update` method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */


  function shift(data) {
    var placement = data.placement;
    var basePlacement = placement.split('-')[0];
    var shiftvariation = placement.split('-')[1]; // if shift shiftvariation is specified, run the modifier

    if (shiftvariation) {
      var _data$offsets = data.offsets,
          reference = _data$offsets.reference,
          popper = _data$offsets.popper;
      var isVertical = ['bottom', 'top'].indexOf(basePlacement) !== -1;
      var side = isVertical ? 'left' : 'top';
      var measurement = isVertical ? 'width' : 'height';
      var shiftOffsets = {
        start: defineProperty({}, side, reference[side]),
        end: defineProperty({}, side, reference[side] + reference[measurement] - popper[measurement])
      };
      data.offsets.popper = _extends({}, popper, shiftOffsets[shiftvariation]);
    }

    return data;
  }
  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by update method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */


  function hide(data) {
    if (!isModifierRequired(data.instance.modifiers, 'hide', 'preventOverflow')) {
      return data;
    }

    var refRect = data.offsets.reference;
    var bound = find(data.instance.modifiers, function (modifier) {
      return modifier.name === 'preventOverflow';
    }).boundaries;

    if (refRect.bottom < bound.top || refRect.left > bound.right || refRect.top > bound.bottom || refRect.right < bound.left) {
      // Avoid unnecessary DOM access if visibility hasn't changed
      if (data.hide === true) {
        return data;
      }

      data.hide = true;
      data.attributes['x-out-of-boundaries'] = '';
    } else {
      // Avoid unnecessary DOM access if visibility hasn't changed
      if (data.hide === false) {
        return data;
      }

      data.hide = false;
      data.attributes['x-out-of-boundaries'] = false;
    }

    return data;
  }
  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by `update` method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */


  function inner(data) {
    var placement = data.placement;
    var basePlacement = placement.split('-')[0];
    var _data$offsets = data.offsets,
        popper = _data$offsets.popper,
        reference = _data$offsets.reference;
    var isHoriz = ['left', 'right'].indexOf(basePlacement) !== -1;
    var subtractLength = ['top', 'left'].indexOf(basePlacement) === -1;
    popper[isHoriz ? 'left' : 'top'] = reference[basePlacement] - (subtractLength ? popper[isHoriz ? 'width' : 'height'] : 0);
    data.placement = getOppositePlacement(placement);
    data.offsets.popper = getClientRect(popper);
    return data;
  }
  /**
   * Modifier function, each modifier can have a function of this type assigned
   * to its `fn` property.<br />
   * These functions will be called on each update, this means that you must
   * make sure they are performant enough to avoid performance bottlenecks.
   *
   * @function ModifierFn
   * @argument {dataObject} data - The data object generated by `update` method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {dataObject} The data object, properly modified
   */

  /**
   * Modifiers are plugins used to alter the behavior of your poppers.<br />
   * Popper.js uses a set of 9 modifiers to provide all the basic functionalities
   * needed by the library.
   *
   * Usually you don't want to override the `order`, `fn` and `onLoad` props.
   * All the other properties are configurations that could be tweaked.
   * @namespace modifiers
   */


  var modifiers = {
    /**
     * Modifier used to shift the popper on the start or end of its reference
     * element.<br />
     * It will read the variation of the `placement` property.<br />
     * It can be one either `-end` or `-start`.
     * @memberof modifiers
     * @inner
     */
    shift: {
      /** @prop {number} order=100 - Index used to define the order of execution */
      order: 100,

      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,

      /** @prop {ModifierFn} */
      fn: shift
    },

    /**
     * The `offset` modifier can shift your popper on both its axis.
     *
     * It accepts the following units:
     * - `px` or unit-less, interpreted as pixels
     * - `%` or `%r`, percentage relative to the length of the reference element
     * - `%p`, percentage relative to the length of the popper element
     * - `vw`, CSS viewport width unit
     * - `vh`, CSS viewport height unit
     *
     * For length is intended the main axis relative to the placement of the popper.<br />
     * This means that if the placement is `top` or `bottom`, the length will be the
     * `width`. In case of `left` or `right`, it will be the `height`.
     *
     * You can provide a single value (as `Number` or `String`), or a pair of values
     * as `String` divided by a comma or one (or more) white spaces.<br />
     * The latter is a deprecated method because it leads to confusion and will be
     * removed in v2.<br />
     * Additionally, it accepts additions and subtractions between different units.
     * Note that multiplications and divisions aren't supported.
     *
     * Valid examples are:
     * ```
     * 10
     * '10%'
     * '10, 10'
     * '10%, 10'
     * '10 + 10%'
     * '10 - 5vh + 3%'
     * '-10px + 5vh, 5px - 6%'
     * ```
     * > **NB**: If you desire to apply offsets to your poppers in a way that may make them overlap
     * > with their reference element, unfortunately, you will have to disable the `flip` modifier.
     * > You can read more on this at this [issue](https://github.com/FezVrasta/popper.js/issues/373).
     *
     * @memberof modifiers
     * @inner
     */
    offset: {
      /** @prop {number} order=200 - Index used to define the order of execution */
      order: 200,

      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,

      /** @prop {ModifierFn} */
      fn: offset,

      /** @prop {Number|String} offset=0
       * The offset value as described in the modifier description
       */
      offset: 0
    },

    /**
     * Modifier used to prevent the popper from being positioned outside the boundary.
     *
     * A scenario exists where the reference itself is not within the boundaries.<br />
     * We can say it has "escaped the boundaries" — or just "escaped".<br />
     * In this case we need to decide whether the popper should either:
     *
     * - detach from the reference and remain "trapped" in the boundaries, or
     * - if it should ignore the boundary and "escape with its reference"
     *
     * When `escapeWithReference` is set to`true` and reference is completely
     * outside its boundaries, the popper will overflow (or completely leave)
     * the boundaries in order to remain attached to the edge of the reference.
     *
     * @memberof modifiers
     * @inner
     */
    preventOverflow: {
      /** @prop {number} order=300 - Index used to define the order of execution */
      order: 300,

      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,

      /** @prop {ModifierFn} */
      fn: preventOverflow,

      /**
       * @prop {Array} [priority=['left','right','top','bottom']]
       * Popper will try to prevent overflow following these priorities by default,
       * then, it could overflow on the left and on top of the `boundariesElement`
       */
      priority: ['left', 'right', 'top', 'bottom'],

      /**
       * @prop {number} padding=5
       * Amount of pixel used to define a minimum distance between the boundaries
       * and the popper. This makes sure the popper always has a little padding
       * between the edges of its container
       */
      padding: 5,

      /**
       * @prop {String|HTMLElement} boundariesElement='scrollParent'
       * Boundaries used by the modifier. Can be `scrollParent`, `window`,
       * `viewport` or any DOM element.
       */
      boundariesElement: 'scrollParent'
    },

    /**
     * Modifier used to make sure the reference and its popper stay near each other
     * without leaving any gap between the two. Especially useful when the arrow is
     * enabled and you want to ensure that it points to its reference element.
     * It cares only about the first axis. You can still have poppers with margin
     * between the popper and its reference element.
     * @memberof modifiers
     * @inner
     */
    keepTogether: {
      /** @prop {number} order=400 - Index used to define the order of execution */
      order: 400,

      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,

      /** @prop {ModifierFn} */
      fn: keepTogether
    },

    /**
     * This modifier is used to move the `arrowElement` of the popper to make
     * sure it is positioned between the reference element and its popper element.
     * It will read the outer size of the `arrowElement` node to detect how many
     * pixels of conjunction are needed.
     *
     * It has no effect if no `arrowElement` is provided.
     * @memberof modifiers
     * @inner
     */
    arrow: {
      /** @prop {number} order=500 - Index used to define the order of execution */
      order: 500,

      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,

      /** @prop {ModifierFn} */
      fn: arrow,

      /** @prop {String|HTMLElement} element='[x-arrow]' - Selector or node used as arrow */
      element: '[x-arrow]'
    },

    /**
     * Modifier used to flip the popper's placement when it starts to overlap its
     * reference element.
     *
     * Requires the `preventOverflow` modifier before it in order to work.
     *
     * **NOTE:** this modifier will interrupt the current update cycle and will
     * restart it if it detects the need to flip the placement.
     * @memberof modifiers
     * @inner
     */
    flip: {
      /** @prop {number} order=600 - Index used to define the order of execution */
      order: 600,

      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,

      /** @prop {ModifierFn} */
      fn: flip,

      /**
       * @prop {String|Array} behavior='flip'
       * The behavior used to change the popper's placement. It can be one of
       * `flip`, `clockwise`, `counterclockwise` or an array with a list of valid
       * placements (with optional variations)
       */
      behavior: 'flip',

      /**
       * @prop {number} padding=5
       * The popper will flip if it hits the edges of the `boundariesElement`
       */
      padding: 5,

      /**
       * @prop {String|HTMLElement} boundariesElement='viewport'
       * The element which will define the boundaries of the popper position.
       * The popper will never be placed outside of the defined boundaries
       * (except if `keepTogether` is enabled)
       */
      boundariesElement: 'viewport'
    },

    /**
     * Modifier used to make the popper flow toward the inner of the reference element.
     * By default, when this modifier is disabled, the popper will be placed outside
     * the reference element.
     * @memberof modifiers
     * @inner
     */
    inner: {
      /** @prop {number} order=700 - Index used to define the order of execution */
      order: 700,

      /** @prop {Boolean} enabled=false - Whether the modifier is enabled or not */
      enabled: false,

      /** @prop {ModifierFn} */
      fn: inner
    },

    /**
     * Modifier used to hide the popper when its reference element is outside of the
     * popper boundaries. It will set a `x-out-of-boundaries` attribute which can
     * be used to hide with a CSS selector the popper when its reference is
     * out of boundaries.
     *
     * Requires the `preventOverflow` modifier before it in order to work.
     * @memberof modifiers
     * @inner
     */
    hide: {
      /** @prop {number} order=800 - Index used to define the order of execution */
      order: 800,

      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,

      /** @prop {ModifierFn} */
      fn: hide
    },

    /**
     * Computes the style that will be applied to the popper element to gets
     * properly positioned.
     *
     * Note that this modifier will not touch the DOM, it just prepares the styles
     * so that `applyStyle` modifier can apply it. This separation is useful
     * in case you need to replace `applyStyle` with a custom implementation.
     *
     * This modifier has `850` as `order` value to maintain backward compatibility
     * with previous versions of Popper.js. Expect the modifiers ordering method
     * to change in future major versions of the library.
     *
     * @memberof modifiers
     * @inner
     */
    computeStyle: {
      /** @prop {number} order=850 - Index used to define the order of execution */
      order: 850,

      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,

      /** @prop {ModifierFn} */
      fn: computeStyle,

      /**
       * @prop {Boolean} gpuAcceleration=true
       * If true, it uses the CSS 3D transformation to position the popper.
       * Otherwise, it will use the `top` and `left` properties
       */
      gpuAcceleration: true,

      /**
       * @prop {string} [x='bottom']
       * Where to anchor the X axis (`bottom` or `top`). AKA X offset origin.
       * Change this if your popper should grow in a direction different from `bottom`
       */
      x: 'bottom',

      /**
       * @prop {string} [x='left']
       * Where to anchor the Y axis (`left` or `right`). AKA Y offset origin.
       * Change this if your popper should grow in a direction different from `right`
       */
      y: 'right'
    },

    /**
     * Applies the computed styles to the popper element.
     *
     * All the DOM manipulations are limited to this modifier. This is useful in case
     * you want to integrate Popper.js inside a framework or view library and you
     * want to delegate all the DOM manipulations to it.
     *
     * Note that if you disable this modifier, you must make sure the popper element
     * has its position set to `absolute` before Popper.js can do its work!
     *
     * Just disable this modifier and define your own to achieve the desired effect.
     *
     * @memberof modifiers
     * @inner
     */
    applyStyle: {
      /** @prop {number} order=900 - Index used to define the order of execution */
      order: 900,

      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,

      /** @prop {ModifierFn} */
      fn: applyStyle,

      /** @prop {Function} */
      onLoad: applyStyleOnLoad,

      /**
       * @deprecated since version 1.10.0, the property moved to `computeStyle` modifier
       * @prop {Boolean} gpuAcceleration=true
       * If true, it uses the CSS 3D transformation to position the popper.
       * Otherwise, it will use the `top` and `left` properties
       */
      gpuAcceleration: undefined
    }
  };
  /**
   * The `dataObject` is an object containing all the information used by Popper.js.
   * This object is passed to modifiers and to the `onCreate` and `onUpdate` callbacks.
   * @name dataObject
   * @property {Object} data.instance The Popper.js instance
   * @property {String} data.placement Placement applied to popper
   * @property {String} data.originalPlacement Placement originally defined on init
   * @property {Boolean} data.flipped True if popper has been flipped by flip modifier
   * @property {Boolean} data.hide True if the reference element is out of boundaries, useful to know when to hide the popper
   * @property {HTMLElement} data.arrowElement Node used as arrow by arrow modifier
   * @property {Object} data.styles Any CSS property defined here will be applied to the popper. It expects the JavaScript nomenclature (eg. `marginBottom`)
   * @property {Object} data.arrowStyles Any CSS property defined here will be applied to the popper arrow. It expects the JavaScript nomenclature (eg. `marginBottom`)
   * @property {Object} data.boundaries Offsets of the popper boundaries
   * @property {Object} data.offsets The measurements of popper, reference and arrow elements
   * @property {Object} data.offsets.popper `top`, `left`, `width`, `height` values
   * @property {Object} data.offsets.reference `top`, `left`, `width`, `height` values
   * @property {Object} data.offsets.arrow] `top` and `left` offsets, only one of them will be different from 0
   */

  /**
   * Default options provided to Popper.js constructor.<br />
   * These can be overridden using the `options` argument of Popper.js.<br />
   * To override an option, simply pass an object with the same
   * structure of the `options` object, as the 3rd argument. For example:
   * ```
   * new Popper(ref, pop, {
   *   modifiers: {
   *     preventOverflow: { enabled: false }
   *   }
   * })
   * ```
   * @type {Object}
   * @static
   * @memberof Popper
   */

  var Defaults = {
    /**
     * Popper's placement.
     * @prop {Popper.placements} placement='bottom'
     */
    placement: 'bottom',

    /**
     * Set this to true if you want popper to position it self in 'fixed' mode
     * @prop {Boolean} positionFixed=false
     */
    positionFixed: false,

    /**
     * Whether events (resize, scroll) are initially enabled.
     * @prop {Boolean} eventsEnabled=true
     */
    eventsEnabled: true,

    /**
     * Set to true if you want to automatically remove the popper when
     * you call the `destroy` method.
     * @prop {Boolean} removeOnDestroy=false
     */
    removeOnDestroy: false,

    /**
     * Callback called when the popper is created.<br />
     * By default, it is set to no-op.<br />
     * Access Popper.js instance with `data.instance`.
     * @prop {onCreate}
     */
    onCreate: function onCreate() {},

    /**
     * Callback called when the popper is updated. This callback is not called
     * on the initialization/creation of the popper, but only on subsequent
     * updates.<br />
     * By default, it is set to no-op.<br />
     * Access Popper.js instance with `data.instance`.
     * @prop {onUpdate}
     */
    onUpdate: function onUpdate() {},

    /**
     * List of modifiers used to modify the offsets before they are applied to the popper.
     * They provide most of the functionalities of Popper.js.
     * @prop {modifiers}
     */
    modifiers: modifiers
  };
  /**
   * @callback onCreate
   * @param {dataObject} data
   */

  /**
   * @callback onUpdate
   * @param {dataObject} data
   */
  // Utils
  // Methods

  var Popper = function () {
    /**
     * Creates a new Popper.js instance.
     * @class Popper
     * @param {HTMLElement|referenceObject} reference - The reference element used to position the popper
     * @param {HTMLElement} popper - The HTML element used as the popper
     * @param {Object} options - Your custom options to override the ones defined in [Defaults](#defaults)
     * @return {Object} instance - The generated Popper.js instance
     */
    function Popper(reference, popper) {
      var _this = this;

      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      classCallCheck(this, Popper);

      this.scheduleUpdate = function () {
        return requestAnimationFrame(_this.update);
      }; // make update() debounced, so that it only runs at most once-per-tick


      this.update = debounce(this.update.bind(this)); // with {} we create a new object with the options inside it

      this.options = _extends({}, Popper.Defaults, options); // init state

      this.state = {
        isDestroyed: false,
        isCreated: false,
        scrollParents: []
      }; // get reference and popper elements (allow jQuery wrappers)

      this.reference = reference && reference.jquery ? reference[0] : reference;
      this.popper = popper && popper.jquery ? popper[0] : popper; // Deep merge modifiers options

      this.options.modifiers = {};
      Object.keys(_extends({}, Popper.Defaults.modifiers, options.modifiers)).forEach(function (name) {
        _this.options.modifiers[name] = _extends({}, Popper.Defaults.modifiers[name] || {}, options.modifiers ? options.modifiers[name] : {});
      }); // Refactoring modifiers' list (Object => Array)

      this.modifiers = Object.keys(this.options.modifiers).map(function (name) {
        return _extends({
          name: name
        }, _this.options.modifiers[name]);
      }) // sort the modifiers by order
      .sort(function (a, b) {
        return a.order - b.order;
      }); // modifiers have the ability to execute arbitrary code when Popper.js get inited
      // such code is executed in the same order of its modifier
      // they could add new properties to their options configuration
      // BE AWARE: don't add options to `options.modifiers.name` but to `modifierOptions`!

      this.modifiers.forEach(function (modifierOptions) {
        if (modifierOptions.enabled && isFunction(modifierOptions.onLoad)) {
          modifierOptions.onLoad(_this.reference, _this.popper, _this.options, modifierOptions, _this.state);
        }
      }); // fire the first update to position the popper in the right place

      this.update();
      var eventsEnabled = this.options.eventsEnabled;

      if (eventsEnabled) {
        // setup event listeners, they will take care of update the position in specific situations
        this.enableEventListeners();
      }

      this.state.eventsEnabled = eventsEnabled;
    } // We can't use class properties because they don't get listed in the
    // class prototype and break stuff like Sinon stubs


    createClass(Popper, [{
      key: 'update',
      value: function update$$1() {
        return update.call(this);
      }
    }, {
      key: 'destroy',
      value: function destroy$$1() {
        return destroy.call(this);
      }
    }, {
      key: 'enableEventListeners',
      value: function enableEventListeners$$1() {
        return enableEventListeners.call(this);
      }
    }, {
      key: 'disableEventListeners',
      value: function disableEventListeners$$1() {
        return disableEventListeners.call(this);
      }
      /**
       * Schedules an update. It will run on the next UI update available.
       * @method scheduleUpdate
       * @memberof Popper
       */

      /**
       * Collection of utilities useful when writing custom modifiers.
       * Starting from version 1.7, this method is available only if you
       * include `popper-utils.js` before `popper.js`.
       *
       * **DEPRECATION**: This way to access PopperUtils is deprecated
       * and will be removed in v2! Use the PopperUtils module directly instead.
       * Due to the high instability of the methods contained in Utils, we can't
       * guarantee them to follow semver. Use them at your own risk!
       * @static
       * @private
       * @type {Object}
       * @deprecated since version 1.8
       * @member Utils
       * @memberof Popper
       */

    }]);
    return Popper;
  }();
  /**
   * The `referenceObject` is an object that provides an interface compatible with Popper.js
   * and lets you use it as replacement of a real DOM node.<br />
   * You can use this method to position a popper relatively to a set of coordinates
   * in case you don't have a DOM node to use as reference.
   *
   * ```
   * new Popper(referenceObject, popperNode);
   * ```
   *
   * NB: This feature isn't supported in Internet Explorer 10.
   * @name referenceObject
   * @property {Function} data.getBoundingClientRect
   * A function that returns a set of coordinates compatible with the native `getBoundingClientRect` method.
   * @property {number} data.clientWidth
   * An ES6 getter that will return the width of the virtual reference element.
   * @property {number} data.clientHeight
   * An ES6 getter that will return the height of the virtual reference element.
   */


  Popper.Utils = (typeof window !== 'undefined' ? window : global).PopperUtils;
  Popper.placements = placements;
  Popper.Defaults = Defaults;
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$4 = 'dropdown';
  var VERSION$4 = '4.3.1';
  var DATA_KEY$4 = 'bs.dropdown';
  var EVENT_KEY$4 = "." + DATA_KEY$4;
  var DATA_API_KEY$4 = '.data-api';
  var JQUERY_NO_CONFLICT$4 = $.fn[NAME$4];
  var ESCAPE_KEYCODE = 27; // KeyboardEvent.which value for Escape (Esc) key

  var SPACE_KEYCODE = 32; // KeyboardEvent.which value for space key

  var TAB_KEYCODE = 9; // KeyboardEvent.which value for tab key

  var ARROW_UP_KEYCODE = 38; // KeyboardEvent.which value for up arrow key

  var ARROW_DOWN_KEYCODE = 40; // KeyboardEvent.which value for down arrow key

  var RIGHT_MOUSE_BUTTON_WHICH = 3; // MouseEvent.which value for the right button (assuming a right-handed mouse)

  var REGEXP_KEYDOWN = new RegExp(ARROW_UP_KEYCODE + "|" + ARROW_DOWN_KEYCODE + "|" + ESCAPE_KEYCODE);
  var Event$4 = {
    HIDE: "hide" + EVENT_KEY$4,
    HIDDEN: "hidden" + EVENT_KEY$4,
    SHOW: "show" + EVENT_KEY$4,
    SHOWN: "shown" + EVENT_KEY$4,
    CLICK: "click" + EVENT_KEY$4,
    CLICK_DATA_API: "click" + EVENT_KEY$4 + DATA_API_KEY$4,
    KEYDOWN_DATA_API: "keydown" + EVENT_KEY$4 + DATA_API_KEY$4,
    KEYUP_DATA_API: "keyup" + EVENT_KEY$4 + DATA_API_KEY$4
  };
  var ClassName$4 = {
    DISABLED: 'disabled',
    SHOW: 'show',
    DROPUP: 'dropup',
    DROPRIGHT: 'dropright',
    DROPLEFT: 'dropleft',
    MENURIGHT: 'dropdown-menu-right',
    MENULEFT: 'dropdown-menu-left',
    POSITION_STATIC: 'position-static'
  };
  var Selector$4 = {
    DATA_TOGGLE: '[data-toggle="dropdown"]',
    FORM_CHILD: '.dropdown form',
    MENU: '.dropdown-menu',
    NAVBAR_NAV: '.navbar-nav',
    VISIBLE_ITEMS: '.dropdown-menu .dropdown-item:not(.disabled):not(:disabled)'
  };
  var AttachmentMap = {
    TOP: 'top-start',
    TOPEND: 'top-end',
    BOTTOM: 'bottom-start',
    BOTTOMEND: 'bottom-end',
    RIGHT: 'right-start',
    RIGHTEND: 'right-end',
    LEFT: 'left-start',
    LEFTEND: 'left-end'
  };
  var Default$2 = {
    offset: 0,
    flip: true,
    boundary: 'scrollParent',
    reference: 'toggle',
    display: 'dynamic'
  };
  var DefaultType$2 = {
    offset: '(number|string|function)',
    flip: 'boolean',
    boundary: '(string|element)',
    reference: '(string|element)',
    display: 'string'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Dropdown =
  /*#__PURE__*/
  function () {
    function Dropdown(element, config) {
      this._element = element;
      this._popper = null;
      this._config = this._getConfig(config);
      this._menu = this._getMenuElement();
      this._inNavbar = this._detectNavbar();

      this._addEventListeners();
    } // Getters


    var _proto = Dropdown.prototype; // Public

    _proto.toggle = function toggle() {
      if (this._element.disabled || $(this._element).hasClass(ClassName$4.DISABLED)) {
        return;
      }

      var parent = Dropdown._getParentFromElement(this._element);

      var isActive = $(this._menu).hasClass(ClassName$4.SHOW);

      Dropdown._clearMenus();

      if (isActive) {
        return;
      }

      var relatedTarget = {
        relatedTarget: this._element
      };
      var showEvent = $.Event(Event$4.SHOW, relatedTarget);
      $(parent).trigger(showEvent);

      if (showEvent.isDefaultPrevented()) {
        return;
      } // Disable totally Popper.js for Dropdown in Navbar


      if (!this._inNavbar) {
        /**
         * Check for Popper dependency
         * Popper - https://popper.js.org
         */
        if (typeof Popper === 'undefined') {
          throw new TypeError('Bootstrap\'s dropdowns require Popper.js (https://popper.js.org/)');
        }

        var referenceElement = this._element;

        if (this._config.reference === 'parent') {
          referenceElement = parent;
        } else if (Util.isElement(this._config.reference)) {
          referenceElement = this._config.reference; // Check if it's jQuery element

          if (typeof this._config.reference.jquery !== 'undefined') {
            referenceElement = this._config.reference[0];
          }
        } // If boundary is not `scrollParent`, then set position to `static`
        // to allow the menu to "escape" the scroll parent's boundaries
        // https://github.com/twbs/bootstrap/issues/24251


        if (this._config.boundary !== 'scrollParent') {
          $(parent).addClass(ClassName$4.POSITION_STATIC);
        }

        this._popper = new Popper(referenceElement, this._menu, this._getPopperConfig());
      } // If this is a touch-enabled device we add extra
      // empty mouseover listeners to the body's immediate children;
      // only needed because of broken event delegation on iOS
      // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html


      if ('ontouchstart' in document.documentElement && $(parent).closest(Selector$4.NAVBAR_NAV).length === 0) {
        $(document.body).children().on('mouseover', null, $.noop);
      }

      this._element.focus();

      this._element.setAttribute('aria-expanded', true);

      $(this._menu).toggleClass(ClassName$4.SHOW);
      $(parent).toggleClass(ClassName$4.SHOW).trigger($.Event(Event$4.SHOWN, relatedTarget));
    };

    _proto.show = function show() {
      if (this._element.disabled || $(this._element).hasClass(ClassName$4.DISABLED) || $(this._menu).hasClass(ClassName$4.SHOW)) {
        return;
      }

      var relatedTarget = {
        relatedTarget: this._element
      };
      var showEvent = $.Event(Event$4.SHOW, relatedTarget);

      var parent = Dropdown._getParentFromElement(this._element);

      $(parent).trigger(showEvent);

      if (showEvent.isDefaultPrevented()) {
        return;
      }

      $(this._menu).toggleClass(ClassName$4.SHOW);
      $(parent).toggleClass(ClassName$4.SHOW).trigger($.Event(Event$4.SHOWN, relatedTarget));
    };

    _proto.hide = function hide() {
      if (this._element.disabled || $(this._element).hasClass(ClassName$4.DISABLED) || !$(this._menu).hasClass(ClassName$4.SHOW)) {
        return;
      }

      var relatedTarget = {
        relatedTarget: this._element
      };
      var hideEvent = $.Event(Event$4.HIDE, relatedTarget);

      var parent = Dropdown._getParentFromElement(this._element);

      $(parent).trigger(hideEvent);

      if (hideEvent.isDefaultPrevented()) {
        return;
      }

      $(this._menu).toggleClass(ClassName$4.SHOW);
      $(parent).toggleClass(ClassName$4.SHOW).trigger($.Event(Event$4.HIDDEN, relatedTarget));
    };

    _proto.dispose = function dispose() {
      $.removeData(this._element, DATA_KEY$4);
      $(this._element).off(EVENT_KEY$4);
      this._element = null;
      this._menu = null;

      if (this._popper !== null) {
        this._popper.destroy();

        this._popper = null;
      }
    };

    _proto.update = function update() {
      this._inNavbar = this._detectNavbar();

      if (this._popper !== null) {
        this._popper.scheduleUpdate();
      }
    } // Private
    ;

    _proto._addEventListeners = function _addEventListeners() {
      var _this = this;

      $(this._element).on(Event$4.CLICK, function (event) {
        event.preventDefault();
        event.stopPropagation();

        _this.toggle();
      });
    };

    _proto._getConfig = function _getConfig(config) {
      config = _objectSpread({}, this.constructor.Default, $(this._element).data(), config);
      Util.typeCheckConfig(NAME$4, config, this.constructor.DefaultType);
      return config;
    };

    _proto._getMenuElement = function _getMenuElement() {
      if (!this._menu) {
        var parent = Dropdown._getParentFromElement(this._element);

        if (parent) {
          this._menu = parent.querySelector(Selector$4.MENU);
        }
      }

      return this._menu;
    };

    _proto._getPlacement = function _getPlacement() {
      var $parentDropdown = $(this._element.parentNode);
      var placement = AttachmentMap.BOTTOM; // Handle dropup

      if ($parentDropdown.hasClass(ClassName$4.DROPUP)) {
        placement = AttachmentMap.TOP;

        if ($(this._menu).hasClass(ClassName$4.MENURIGHT)) {
          placement = AttachmentMap.TOPEND;
        }
      } else if ($parentDropdown.hasClass(ClassName$4.DROPRIGHT)) {
        placement = AttachmentMap.RIGHT;
      } else if ($parentDropdown.hasClass(ClassName$4.DROPLEFT)) {
        placement = AttachmentMap.LEFT;
      } else if ($(this._menu).hasClass(ClassName$4.MENURIGHT)) {
        placement = AttachmentMap.BOTTOMEND;
      }

      return placement;
    };

    _proto._detectNavbar = function _detectNavbar() {
      return $(this._element).closest('.navbar').length > 0;
    };

    _proto._getOffset = function _getOffset() {
      var _this2 = this;

      var offset = {};

      if (typeof this._config.offset === 'function') {
        offset.fn = function (data) {
          data.offsets = _objectSpread({}, data.offsets, _this2._config.offset(data.offsets, _this2._element) || {});
          return data;
        };
      } else {
        offset.offset = this._config.offset;
      }

      return offset;
    };

    _proto._getPopperConfig = function _getPopperConfig() {
      var popperConfig = {
        placement: this._getPlacement(),
        modifiers: {
          offset: this._getOffset(),
          flip: {
            enabled: this._config.flip
          },
          preventOverflow: {
            boundariesElement: this._config.boundary
          } // Disable Popper.js if we have a static display

        }
      };

      if (this._config.display === 'static') {
        popperConfig.modifiers.applyStyle = {
          enabled: false
        };
      }

      return popperConfig;
    } // Static
    ;

    Dropdown._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY$4);

        var _config = typeof config === 'object' ? config : null;

        if (!data) {
          data = new Dropdown(this, _config);
          $(this).data(DATA_KEY$4, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config]();
        }
      });
    };

    Dropdown._clearMenus = function _clearMenus(event) {
      if (event && (event.which === RIGHT_MOUSE_BUTTON_WHICH || event.type === 'keyup' && event.which !== TAB_KEYCODE)) {
        return;
      }

      var toggles = [].slice.call(document.querySelectorAll(Selector$4.DATA_TOGGLE));

      for (var i = 0, len = toggles.length; i < len; i++) {
        var parent = Dropdown._getParentFromElement(toggles[i]);

        var context = $(toggles[i]).data(DATA_KEY$4);
        var relatedTarget = {
          relatedTarget: toggles[i]
        };

        if (event && event.type === 'click') {
          relatedTarget.clickEvent = event;
        }

        if (!context) {
          continue;
        }

        var dropdownMenu = context._menu;

        if (!$(parent).hasClass(ClassName$4.SHOW)) {
          continue;
        }

        if (event && (event.type === 'click' && /input|textarea/i.test(event.target.tagName) || event.type === 'keyup' && event.which === TAB_KEYCODE) && $.contains(parent, event.target)) {
          continue;
        }

        var hideEvent = $.Event(Event$4.HIDE, relatedTarget);
        $(parent).trigger(hideEvent);

        if (hideEvent.isDefaultPrevented()) {
          continue;
        } // If this is a touch-enabled device we remove the extra
        // empty mouseover listeners we added for iOS support


        if ('ontouchstart' in document.documentElement) {
          $(document.body).children().off('mouseover', null, $.noop);
        }

        toggles[i].setAttribute('aria-expanded', 'false');
        $(dropdownMenu).removeClass(ClassName$4.SHOW);
        $(parent).removeClass(ClassName$4.SHOW).trigger($.Event(Event$4.HIDDEN, relatedTarget));
      }
    };

    Dropdown._getParentFromElement = function _getParentFromElement(element) {
      var parent;
      var selector = Util.getSelectorFromElement(element);

      if (selector) {
        parent = document.querySelector(selector);
      }

      return parent || element.parentNode;
    } // eslint-disable-next-line complexity
    ;

    Dropdown._dataApiKeydownHandler = function _dataApiKeydownHandler(event) {
      // If not input/textarea:
      //  - And not a key in REGEXP_KEYDOWN => not a dropdown command
      // If input/textarea:
      //  - If space key => not a dropdown command
      //  - If key is other than escape
      //    - If key is not up or down => not a dropdown command
      //    - If trigger inside the menu => not a dropdown command
      if (/input|textarea/i.test(event.target.tagName) ? event.which === SPACE_KEYCODE || event.which !== ESCAPE_KEYCODE && (event.which !== ARROW_DOWN_KEYCODE && event.which !== ARROW_UP_KEYCODE || $(event.target).closest(Selector$4.MENU).length) : !REGEXP_KEYDOWN.test(event.which)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if (this.disabled || $(this).hasClass(ClassName$4.DISABLED)) {
        return;
      }

      var parent = Dropdown._getParentFromElement(this);

      var isActive = $(parent).hasClass(ClassName$4.SHOW);

      if (!isActive || isActive && (event.which === ESCAPE_KEYCODE || event.which === SPACE_KEYCODE)) {
        if (event.which === ESCAPE_KEYCODE) {
          var toggle = parent.querySelector(Selector$4.DATA_TOGGLE);
          $(toggle).trigger('focus');
        }

        $(this).trigger('click');
        return;
      }

      var items = [].slice.call(parent.querySelectorAll(Selector$4.VISIBLE_ITEMS));

      if (items.length === 0) {
        return;
      }

      var index = items.indexOf(event.target);

      if (event.which === ARROW_UP_KEYCODE && index > 0) {
        // Up
        index--;
      }

      if (event.which === ARROW_DOWN_KEYCODE && index < items.length - 1) {
        // Down
        index++;
      }

      if (index < 0) {
        index = 0;
      }

      items[index].focus();
    };

    _createClass(Dropdown, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$4;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default$2;
      }
    }, {
      key: "DefaultType",
      get: function get() {
        return DefaultType$2;
      }
    }]);

    return Dropdown;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(document).on(Event$4.KEYDOWN_DATA_API, Selector$4.DATA_TOGGLE, Dropdown._dataApiKeydownHandler).on(Event$4.KEYDOWN_DATA_API, Selector$4.MENU, Dropdown._dataApiKeydownHandler).on(Event$4.CLICK_DATA_API + " " + Event$4.KEYUP_DATA_API, Dropdown._clearMenus).on(Event$4.CLICK_DATA_API, Selector$4.DATA_TOGGLE, function (event) {
    event.preventDefault();
    event.stopPropagation();

    Dropdown._jQueryInterface.call($(this), 'toggle');
  }).on(Event$4.CLICK_DATA_API, Selector$4.FORM_CHILD, function (e) {
    e.stopPropagation();
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME$4] = Dropdown._jQueryInterface;
  $.fn[NAME$4].Constructor = Dropdown;

  $.fn[NAME$4].noConflict = function () {
    $.fn[NAME$4] = JQUERY_NO_CONFLICT$4;
    return Dropdown._jQueryInterface;
  };
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */


  var NAME$5 = 'modal';
  var VERSION$5 = '4.3.1';
  var DATA_KEY$5 = 'bs.modal';
  var EVENT_KEY$5 = "." + DATA_KEY$5;
  var DATA_API_KEY$5 = '.data-api';
  var JQUERY_NO_CONFLICT$5 = $.fn[NAME$5];
  var ESCAPE_KEYCODE$1 = 27; // KeyboardEvent.which value for Escape (Esc) key

  var Default$3 = {
    backdrop: true,
    keyboard: true,
    focus: true,
    show: true
  };
  var DefaultType$3 = {
    backdrop: '(boolean|string)',
    keyboard: 'boolean',
    focus: 'boolean',
    show: 'boolean'
  };
  var Event$5 = {
    HIDE: "hide" + EVENT_KEY$5,
    HIDDEN: "hidden" + EVENT_KEY$5,
    SHOW: "show" + EVENT_KEY$5,
    SHOWN: "shown" + EVENT_KEY$5,
    FOCUSIN: "focusin" + EVENT_KEY$5,
    RESIZE: "resize" + EVENT_KEY$5,
    CLICK_DISMISS: "click.dismiss" + EVENT_KEY$5,
    KEYDOWN_DISMISS: "keydown.dismiss" + EVENT_KEY$5,
    MOUSEUP_DISMISS: "mouseup.dismiss" + EVENT_KEY$5,
    MOUSEDOWN_DISMISS: "mousedown.dismiss" + EVENT_KEY$5,
    CLICK_DATA_API: "click" + EVENT_KEY$5 + DATA_API_KEY$5
  };
  var ClassName$5 = {
    SCROLLABLE: 'modal-dialog-scrollable',
    SCROLLBAR_MEASURER: 'modal-scrollbar-measure',
    BACKDROP: 'modal-backdrop',
    OPEN: 'modal-open',
    FADE: 'fade',
    SHOW: 'show'
  };
  var Selector$5 = {
    DIALOG: '.modal-dialog',
    MODAL_BODY: '.modal-body',
    DATA_TOGGLE: '[data-toggle="modal"]',
    DATA_DISMISS: '[data-dismiss="modal"]',
    FIXED_CONTENT: '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top',
    STICKY_CONTENT: '.sticky-top'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Modal =
  /*#__PURE__*/
  function () {
    function Modal(element, config) {
      this._config = this._getConfig(config);
      this._element = element;
      this._dialog = element.querySelector(Selector$5.DIALOG);
      this._backdrop = null;
      this._isShown = false;
      this._isBodyOverflowing = false;
      this._ignoreBackdropClick = false;
      this._isTransitioning = false;
      this._scrollbarWidth = 0;
    } // Getters


    var _proto = Modal.prototype; // Public

    _proto.toggle = function toggle(relatedTarget) {
      return this._isShown ? this.hide() : this.show(relatedTarget);
    };

    _proto.show = function show(relatedTarget) {
      var _this = this;

      if (this._isShown || this._isTransitioning) {
        return;
      }

      if ($(this._element).hasClass(ClassName$5.FADE)) {
        this._isTransitioning = true;
      }

      var showEvent = $.Event(Event$5.SHOW, {
        relatedTarget: relatedTarget
      });
      $(this._element).trigger(showEvent);

      if (this._isShown || showEvent.isDefaultPrevented()) {
        return;
      }

      this._isShown = true;

      this._checkScrollbar();

      this._setScrollbar();

      this._adjustDialog();

      this._setEscapeEvent();

      this._setResizeEvent();

      $(this._element).on(Event$5.CLICK_DISMISS, Selector$5.DATA_DISMISS, function (event) {
        return _this.hide(event);
      });
      $(this._dialog).on(Event$5.MOUSEDOWN_DISMISS, function () {
        $(_this._element).one(Event$5.MOUSEUP_DISMISS, function (event) {
          if ($(event.target).is(_this._element)) {
            _this._ignoreBackdropClick = true;
          }
        });
      });

      this._showBackdrop(function () {
        return _this._showElement(relatedTarget);
      });
    };

    _proto.hide = function hide(event) {
      var _this2 = this;

      if (event) {
        event.preventDefault();
      }

      if (!this._isShown || this._isTransitioning) {
        return;
      }

      var hideEvent = $.Event(Event$5.HIDE);
      $(this._element).trigger(hideEvent);

      if (!this._isShown || hideEvent.isDefaultPrevented()) {
        return;
      }

      this._isShown = false;
      var transition = $(this._element).hasClass(ClassName$5.FADE);

      if (transition) {
        this._isTransitioning = true;
      }

      this._setEscapeEvent();

      this._setResizeEvent();

      $(document).off(Event$5.FOCUSIN);
      $(this._element).removeClass(ClassName$5.SHOW);
      $(this._element).off(Event$5.CLICK_DISMISS);
      $(this._dialog).off(Event$5.MOUSEDOWN_DISMISS);

      if (transition) {
        var transitionDuration = Util.getTransitionDurationFromElement(this._element);
        $(this._element).one(Util.TRANSITION_END, function (event) {
          return _this2._hideModal(event);
        }).emulateTransitionEnd(transitionDuration);
      } else {
        this._hideModal();
      }
    };

    _proto.dispose = function dispose() {
      [window, this._element, this._dialog].forEach(function (htmlElement) {
        return $(htmlElement).off(EVENT_KEY$5);
      });
      /**
       * `document` has 2 events `Event.FOCUSIN` and `Event.CLICK_DATA_API`
       * Do not move `document` in `htmlElements` array
       * It will remove `Event.CLICK_DATA_API` event that should remain
       */

      $(document).off(Event$5.FOCUSIN);
      $.removeData(this._element, DATA_KEY$5);
      this._config = null;
      this._element = null;
      this._dialog = null;
      this._backdrop = null;
      this._isShown = null;
      this._isBodyOverflowing = null;
      this._ignoreBackdropClick = null;
      this._isTransitioning = null;
      this._scrollbarWidth = null;
    };

    _proto.handleUpdate = function handleUpdate() {
      this._adjustDialog();
    } // Private
    ;

    _proto._getConfig = function _getConfig(config) {
      config = _objectSpread({}, Default$3, config);
      Util.typeCheckConfig(NAME$5, config, DefaultType$3);
      return config;
    };

    _proto._showElement = function _showElement(relatedTarget) {
      var _this3 = this;

      var transition = $(this._element).hasClass(ClassName$5.FADE);

      if (!this._element.parentNode || this._element.parentNode.nodeType !== Node.ELEMENT_NODE) {
        // Don't move modal's DOM position
        document.body.appendChild(this._element);
      }

      this._element.style.display = 'block';

      this._element.removeAttribute('aria-hidden');

      this._element.setAttribute('aria-modal', true);

      if ($(this._dialog).hasClass(ClassName$5.SCROLLABLE)) {
        this._dialog.querySelector(Selector$5.MODAL_BODY).scrollTop = 0;
      } else {
        this._element.scrollTop = 0;
      }

      if (transition) {
        Util.reflow(this._element);
      }

      $(this._element).addClass(ClassName$5.SHOW);

      if (this._config.focus) {
        this._enforceFocus();
      }

      var shownEvent = $.Event(Event$5.SHOWN, {
        relatedTarget: relatedTarget
      });

      var transitionComplete = function transitionComplete() {
        if (_this3._config.focus) {
          _this3._element.focus();
        }

        _this3._isTransitioning = false;
        $(_this3._element).trigger(shownEvent);
      };

      if (transition) {
        var transitionDuration = Util.getTransitionDurationFromElement(this._dialog);
        $(this._dialog).one(Util.TRANSITION_END, transitionComplete).emulateTransitionEnd(transitionDuration);
      } else {
        transitionComplete();
      }
    };

    _proto._enforceFocus = function _enforceFocus() {
      var _this4 = this;

      $(document).off(Event$5.FOCUSIN) // Guard against infinite focus loop
      .on(Event$5.FOCUSIN, function (event) {
        if (document !== event.target && _this4._element !== event.target && $(_this4._element).has(event.target).length === 0) {
          _this4._element.focus();
        }
      });
    };

    _proto._setEscapeEvent = function _setEscapeEvent() {
      var _this5 = this;

      if (this._isShown && this._config.keyboard) {
        $(this._element).on(Event$5.KEYDOWN_DISMISS, function (event) {
          if (event.which === ESCAPE_KEYCODE$1) {
            event.preventDefault();

            _this5.hide();
          }
        });
      } else if (!this._isShown) {
        $(this._element).off(Event$5.KEYDOWN_DISMISS);
      }
    };

    _proto._setResizeEvent = function _setResizeEvent() {
      var _this6 = this;

      if (this._isShown) {
        $(window).on(Event$5.RESIZE, function (event) {
          return _this6.handleUpdate(event);
        });
      } else {
        $(window).off(Event$5.RESIZE);
      }
    };

    _proto._hideModal = function _hideModal() {
      var _this7 = this;

      this._element.style.display = 'none';

      this._element.setAttribute('aria-hidden', true);

      this._element.removeAttribute('aria-modal');

      this._isTransitioning = false;

      this._showBackdrop(function () {
        $(document.body).removeClass(ClassName$5.OPEN);

        _this7._resetAdjustments();

        _this7._resetScrollbar();

        $(_this7._element).trigger(Event$5.HIDDEN);
      });
    };

    _proto._removeBackdrop = function _removeBackdrop() {
      if (this._backdrop) {
        $(this._backdrop).remove();
        this._backdrop = null;
      }
    };

    _proto._showBackdrop = function _showBackdrop(callback) {
      var _this8 = this;

      var animate = $(this._element).hasClass(ClassName$5.FADE) ? ClassName$5.FADE : '';

      if (this._isShown && this._config.backdrop) {
        this._backdrop = document.createElement('div');
        this._backdrop.className = ClassName$5.BACKDROP;

        if (animate) {
          this._backdrop.classList.add(animate);
        }

        $(this._backdrop).appendTo(document.body);
        $(this._element).on(Event$5.CLICK_DISMISS, function (event) {
          if (_this8._ignoreBackdropClick) {
            _this8._ignoreBackdropClick = false;
            return;
          }

          if (event.target !== event.currentTarget) {
            return;
          }

          if (_this8._config.backdrop === 'static') {
            _this8._element.focus();
          } else {
            _this8.hide();
          }
        });

        if (animate) {
          Util.reflow(this._backdrop);
        }

        $(this._backdrop).addClass(ClassName$5.SHOW);

        if (!callback) {
          return;
        }

        if (!animate) {
          callback();
          return;
        }

        var backdropTransitionDuration = Util.getTransitionDurationFromElement(this._backdrop);
        $(this._backdrop).one(Util.TRANSITION_END, callback).emulateTransitionEnd(backdropTransitionDuration);
      } else if (!this._isShown && this._backdrop) {
        $(this._backdrop).removeClass(ClassName$5.SHOW);

        var callbackRemove = function callbackRemove() {
          _this8._removeBackdrop();

          if (callback) {
            callback();
          }
        };

        if ($(this._element).hasClass(ClassName$5.FADE)) {
          var _backdropTransitionDuration = Util.getTransitionDurationFromElement(this._backdrop);

          $(this._backdrop).one(Util.TRANSITION_END, callbackRemove).emulateTransitionEnd(_backdropTransitionDuration);
        } else {
          callbackRemove();
        }
      } else if (callback) {
        callback();
      }
    } // ----------------------------------------------------------------------
    // the following methods are used to handle overflowing modals
    // todo (fat): these should probably be refactored out of modal.js
    // ----------------------------------------------------------------------
    ;

    _proto._adjustDialog = function _adjustDialog() {
      var isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;

      if (!this._isBodyOverflowing && isModalOverflowing) {
        this._element.style.paddingLeft = this._scrollbarWidth + "px";
      }

      if (this._isBodyOverflowing && !isModalOverflowing) {
        this._element.style.paddingRight = this._scrollbarWidth + "px";
      }
    };

    _proto._resetAdjustments = function _resetAdjustments() {
      this._element.style.paddingLeft = '';
      this._element.style.paddingRight = '';
    };

    _proto._checkScrollbar = function _checkScrollbar() {
      var rect = document.body.getBoundingClientRect();
      this._isBodyOverflowing = rect.left + rect.right < window.innerWidth;
      this._scrollbarWidth = this._getScrollbarWidth();
    };

    _proto._setScrollbar = function _setScrollbar() {
      var _this9 = this;

      if (this._isBodyOverflowing) {
        // Note: DOMNode.style.paddingRight returns the actual value or '' if not set
        //   while $(DOMNode).css('padding-right') returns the calculated value or 0 if not set
        var fixedContent = [].slice.call(document.querySelectorAll(Selector$5.FIXED_CONTENT));
        var stickyContent = [].slice.call(document.querySelectorAll(Selector$5.STICKY_CONTENT)); // Adjust fixed content padding

        $(fixedContent).each(function (index, element) {
          var actualPadding = element.style.paddingRight;
          var calculatedPadding = $(element).css('padding-right');
          $(element).data('padding-right', actualPadding).css('padding-right', parseFloat(calculatedPadding) + _this9._scrollbarWidth + "px");
        }); // Adjust sticky content margin

        $(stickyContent).each(function (index, element) {
          var actualMargin = element.style.marginRight;
          var calculatedMargin = $(element).css('margin-right');
          $(element).data('margin-right', actualMargin).css('margin-right', parseFloat(calculatedMargin) - _this9._scrollbarWidth + "px");
        }); // Adjust body padding

        var actualPadding = document.body.style.paddingRight;
        var calculatedPadding = $(document.body).css('padding-right');
        $(document.body).data('padding-right', actualPadding).css('padding-right', parseFloat(calculatedPadding) + this._scrollbarWidth + "px");
      }

      $(document.body).addClass(ClassName$5.OPEN);
    };

    _proto._resetScrollbar = function _resetScrollbar() {
      // Restore fixed content padding
      var fixedContent = [].slice.call(document.querySelectorAll(Selector$5.FIXED_CONTENT));
      $(fixedContent).each(function (index, element) {
        var padding = $(element).data('padding-right');
        $(element).removeData('padding-right');
        element.style.paddingRight = padding ? padding : '';
      }); // Restore sticky content

      var elements = [].slice.call(document.querySelectorAll("" + Selector$5.STICKY_CONTENT));
      $(elements).each(function (index, element) {
        var margin = $(element).data('margin-right');

        if (typeof margin !== 'undefined') {
          $(element).css('margin-right', margin).removeData('margin-right');
        }
      }); // Restore body padding

      var padding = $(document.body).data('padding-right');
      $(document.body).removeData('padding-right');
      document.body.style.paddingRight = padding ? padding : '';
    };

    _proto._getScrollbarWidth = function _getScrollbarWidth() {
      // thx d.walsh
      var scrollDiv = document.createElement('div');
      scrollDiv.className = ClassName$5.SCROLLBAR_MEASURER;
      document.body.appendChild(scrollDiv);
      var scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
      document.body.removeChild(scrollDiv);
      return scrollbarWidth;
    } // Static
    ;

    Modal._jQueryInterface = function _jQueryInterface(config, relatedTarget) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY$5);

        var _config = _objectSpread({}, Default$3, $(this).data(), typeof config === 'object' && config ? config : {});

        if (!data) {
          data = new Modal(this, _config);
          $(this).data(DATA_KEY$5, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config](relatedTarget);
        } else if (_config.show) {
          data.show(relatedTarget);
        }
      });
    };

    _createClass(Modal, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$5;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default$3;
      }
    }]);

    return Modal;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(document).on(Event$5.CLICK_DATA_API, Selector$5.DATA_TOGGLE, function (event) {
    var _this10 = this;

    var target;
    var selector = Util.getSelectorFromElement(this);

    if (selector) {
      target = document.querySelector(selector);
    }

    var config = $(target).data(DATA_KEY$5) ? 'toggle' : _objectSpread({}, $(target).data(), $(this).data());

    if (this.tagName === 'A' || this.tagName === 'AREA') {
      event.preventDefault();
    }

    var $target = $(target).one(Event$5.SHOW, function (showEvent) {
      if (showEvent.isDefaultPrevented()) {
        // Only register focus restorer if modal will actually get shown
        return;
      }

      $target.one(Event$5.HIDDEN, function () {
        if ($(_this10).is(':visible')) {
          _this10.focus();
        }
      });
    });

    Modal._jQueryInterface.call($(target), config, this);
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME$5] = Modal._jQueryInterface;
  $.fn[NAME$5].Constructor = Modal;

  $.fn[NAME$5].noConflict = function () {
    $.fn[NAME$5] = JQUERY_NO_CONFLICT$5;
    return Modal._jQueryInterface;
  };
  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.3.1): tools/sanitizer.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */


  var uriAttrs = ['background', 'cite', 'href', 'itemtype', 'longdesc', 'poster', 'src', 'xlink:href'];
  var ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i;
  var DefaultWhitelist = {
    // Global attributes allowed on any supplied element below.
    '*': ['class', 'dir', 'id', 'lang', 'role', ARIA_ATTRIBUTE_PATTERN],
    a: ['target', 'href', 'title', 'rel'],
    area: [],
    b: [],
    br: [],
    col: [],
    code: [],
    div: [],
    em: [],
    hr: [],
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
    i: [],
    img: ['src', 'alt', 'title', 'width', 'height'],
    li: [],
    ol: [],
    p: [],
    pre: [],
    s: [],
    small: [],
    span: [],
    sub: [],
    sup: [],
    strong: [],
    u: [],
    ul: []
    /**
     * A pattern that recognizes a commonly useful subset of URLs that are safe.
     *
     * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts
     */

  };
  var SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file):|[^&:/?#]*(?:[/?#]|$))/gi;
  /**
   * A pattern that matches safe data URLs. Only matches image, video and audio types.
   *
   * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts
   */

  var DATA_URL_PATTERN = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+/]+=*$/i;

  function allowedAttribute(attr, allowedAttributeList) {
    var attrName = attr.nodeName.toLowerCase();

    if (allowedAttributeList.indexOf(attrName) !== -1) {
      if (uriAttrs.indexOf(attrName) !== -1) {
        return Boolean(attr.nodeValue.match(SAFE_URL_PATTERN) || attr.nodeValue.match(DATA_URL_PATTERN));
      }

      return true;
    }

    var regExp = allowedAttributeList.filter(function (attrRegex) {
      return attrRegex instanceof RegExp;
    }); // Check if a regular expression validates the attribute.

    for (var i = 0, l = regExp.length; i < l; i++) {
      if (attrName.match(regExp[i])) {
        return true;
      }
    }

    return false;
  }

  function sanitizeHtml(unsafeHtml, whiteList, sanitizeFn) {
    if (unsafeHtml.length === 0) {
      return unsafeHtml;
    }

    if (sanitizeFn && typeof sanitizeFn === 'function') {
      return sanitizeFn(unsafeHtml);
    }

    var domParser = new window.DOMParser();
    var createdDocument = domParser.parseFromString(unsafeHtml, 'text/html');
    var whitelistKeys = Object.keys(whiteList);
    var elements = [].slice.call(createdDocument.body.querySelectorAll('*'));

    var _loop = function _loop(i, len) {
      var el = elements[i];
      var elName = el.nodeName.toLowerCase();

      if (whitelistKeys.indexOf(el.nodeName.toLowerCase()) === -1) {
        el.parentNode.removeChild(el);
        return "continue";
      }

      var attributeList = [].slice.call(el.attributes);
      var whitelistedAttributes = [].concat(whiteList['*'] || [], whiteList[elName] || []);
      attributeList.forEach(function (attr) {
        if (!allowedAttribute(attr, whitelistedAttributes)) {
          el.removeAttribute(attr.nodeName);
        }
      });
    };

    for (var i = 0, len = elements.length; i < len; i++) {
      var _ret = _loop(i, len);

      if (_ret === "continue") continue;
    }

    return createdDocument.body.innerHTML;
  }
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */


  var NAME$6 = 'tooltip';
  var VERSION$6 = '4.3.1';
  var DATA_KEY$6 = 'bs.tooltip';
  var EVENT_KEY$6 = "." + DATA_KEY$6;
  var JQUERY_NO_CONFLICT$6 = $.fn[NAME$6];
  var CLASS_PREFIX = 'bs-tooltip';
  var BSCLS_PREFIX_REGEX = new RegExp("(^|\\s)" + CLASS_PREFIX + "\\S+", 'g');
  var DISALLOWED_ATTRIBUTES = ['sanitize', 'whiteList', 'sanitizeFn'];
  var DefaultType$4 = {
    animation: 'boolean',
    template: 'string',
    title: '(string|element|function)',
    trigger: 'string',
    delay: '(number|object)',
    html: 'boolean',
    selector: '(string|boolean)',
    placement: '(string|function)',
    offset: '(number|string|function)',
    container: '(string|element|boolean)',
    fallbackPlacement: '(string|array)',
    boundary: '(string|element)',
    sanitize: 'boolean',
    sanitizeFn: '(null|function)',
    whiteList: 'object'
  };
  var AttachmentMap$1 = {
    AUTO: 'auto',
    TOP: 'top',
    RIGHT: 'right',
    BOTTOM: 'bottom',
    LEFT: 'left'
  };
  var Default$4 = {
    animation: true,
    template: '<div class="tooltip" role="tooltip">' + '<div class="arrow"></div>' + '<div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    selector: false,
    placement: 'top',
    offset: 0,
    container: false,
    fallbackPlacement: 'flip',
    boundary: 'scrollParent',
    sanitize: true,
    sanitizeFn: null,
    whiteList: DefaultWhitelist
  };
  var HoverState = {
    SHOW: 'show',
    OUT: 'out'
  };
  var Event$6 = {
    HIDE: "hide" + EVENT_KEY$6,
    HIDDEN: "hidden" + EVENT_KEY$6,
    SHOW: "show" + EVENT_KEY$6,
    SHOWN: "shown" + EVENT_KEY$6,
    INSERTED: "inserted" + EVENT_KEY$6,
    CLICK: "click" + EVENT_KEY$6,
    FOCUSIN: "focusin" + EVENT_KEY$6,
    FOCUSOUT: "focusout" + EVENT_KEY$6,
    MOUSEENTER: "mouseenter" + EVENT_KEY$6,
    MOUSELEAVE: "mouseleave" + EVENT_KEY$6
  };
  var ClassName$6 = {
    FADE: 'fade',
    SHOW: 'show'
  };
  var Selector$6 = {
    TOOLTIP: '.tooltip',
    TOOLTIP_INNER: '.tooltip-inner',
    ARROW: '.arrow'
  };
  var Trigger = {
    HOVER: 'hover',
    FOCUS: 'focus',
    CLICK: 'click',
    MANUAL: 'manual'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Tooltip =
  /*#__PURE__*/
  function () {
    function Tooltip(element, config) {
      /**
       * Check for Popper dependency
       * Popper - https://popper.js.org
       */
      if (typeof Popper === 'undefined') {
        throw new TypeError('Bootstrap\'s tooltips require Popper.js (https://popper.js.org/)');
      } // private


      this._isEnabled = true;
      this._timeout = 0;
      this._hoverState = '';
      this._activeTrigger = {};
      this._popper = null; // Protected

      this.element = element;
      this.config = this._getConfig(config);
      this.tip = null;

      this._setListeners();
    } // Getters


    var _proto = Tooltip.prototype; // Public

    _proto.enable = function enable() {
      this._isEnabled = true;
    };

    _proto.disable = function disable() {
      this._isEnabled = false;
    };

    _proto.toggleEnabled = function toggleEnabled() {
      this._isEnabled = !this._isEnabled;
    };

    _proto.toggle = function toggle(event) {
      if (!this._isEnabled) {
        return;
      }

      if (event) {
        var dataKey = this.constructor.DATA_KEY;
        var context = $(event.currentTarget).data(dataKey);

        if (!context) {
          context = new this.constructor(event.currentTarget, this._getDelegateConfig());
          $(event.currentTarget).data(dataKey, context);
        }

        context._activeTrigger.click = !context._activeTrigger.click;

        if (context._isWithActiveTrigger()) {
          context._enter(null, context);
        } else {
          context._leave(null, context);
        }
      } else {
        if ($(this.getTipElement()).hasClass(ClassName$6.SHOW)) {
          this._leave(null, this);

          return;
        }

        this._enter(null, this);
      }
    };

    _proto.dispose = function dispose() {
      clearTimeout(this._timeout);
      $.removeData(this.element, this.constructor.DATA_KEY);
      $(this.element).off(this.constructor.EVENT_KEY);
      $(this.element).closest('.modal').off('hide.bs.modal');

      if (this.tip) {
        $(this.tip).remove();
      }

      this._isEnabled = null;
      this._timeout = null;
      this._hoverState = null;
      this._activeTrigger = null;

      if (this._popper !== null) {
        this._popper.destroy();
      }

      this._popper = null;
      this.element = null;
      this.config = null;
      this.tip = null;
    };

    _proto.show = function show() {
      var _this = this;

      if ($(this.element).css('display') === 'none') {
        throw new Error('Please use show on visible elements');
      }

      var showEvent = $.Event(this.constructor.Event.SHOW);

      if (this.isWithContent() && this._isEnabled) {
        $(this.element).trigger(showEvent);
        var shadowRoot = Util.findShadowRoot(this.element);
        var isInTheDom = $.contains(shadowRoot !== null ? shadowRoot : this.element.ownerDocument.documentElement, this.element);

        if (showEvent.isDefaultPrevented() || !isInTheDom) {
          return;
        }

        var tip = this.getTipElement();
        var tipId = Util.getUID(this.constructor.NAME);
        tip.setAttribute('id', tipId);
        this.element.setAttribute('aria-describedby', tipId);
        this.setContent();

        if (this.config.animation) {
          $(tip).addClass(ClassName$6.FADE);
        }

        var placement = typeof this.config.placement === 'function' ? this.config.placement.call(this, tip, this.element) : this.config.placement;

        var attachment = this._getAttachment(placement);

        this.addAttachmentClass(attachment);

        var container = this._getContainer();

        $(tip).data(this.constructor.DATA_KEY, this);

        if (!$.contains(this.element.ownerDocument.documentElement, this.tip)) {
          $(tip).appendTo(container);
        }

        $(this.element).trigger(this.constructor.Event.INSERTED);
        this._popper = new Popper(this.element, tip, {
          placement: attachment,
          modifiers: {
            offset: this._getOffset(),
            flip: {
              behavior: this.config.fallbackPlacement
            },
            arrow: {
              element: Selector$6.ARROW
            },
            preventOverflow: {
              boundariesElement: this.config.boundary
            }
          },
          onCreate: function onCreate(data) {
            if (data.originalPlacement !== data.placement) {
              _this._handlePopperPlacementChange(data);
            }
          },
          onUpdate: function onUpdate(data) {
            return _this._handlePopperPlacementChange(data);
          }
        });
        $(tip).addClass(ClassName$6.SHOW); // If this is a touch-enabled device we add extra
        // empty mouseover listeners to the body's immediate children;
        // only needed because of broken event delegation on iOS
        // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html

        if ('ontouchstart' in document.documentElement) {
          $(document.body).children().on('mouseover', null, $.noop);
        }

        var complete = function complete() {
          if (_this.config.animation) {
            _this._fixTransition();
          }

          var prevHoverState = _this._hoverState;
          _this._hoverState = null;
          $(_this.element).trigger(_this.constructor.Event.SHOWN);

          if (prevHoverState === HoverState.OUT) {
            _this._leave(null, _this);
          }
        };

        if ($(this.tip).hasClass(ClassName$6.FADE)) {
          var transitionDuration = Util.getTransitionDurationFromElement(this.tip);
          $(this.tip).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
        } else {
          complete();
        }
      }
    };

    _proto.hide = function hide(callback) {
      var _this2 = this;

      var tip = this.getTipElement();
      var hideEvent = $.Event(this.constructor.Event.HIDE);

      var complete = function complete() {
        if (_this2._hoverState !== HoverState.SHOW && tip.parentNode) {
          tip.parentNode.removeChild(tip);
        }

        _this2._cleanTipClass();

        _this2.element.removeAttribute('aria-describedby');

        $(_this2.element).trigger(_this2.constructor.Event.HIDDEN);

        if (_this2._popper !== null) {
          _this2._popper.destroy();
        }

        if (callback) {
          callback();
        }
      };

      $(this.element).trigger(hideEvent);

      if (hideEvent.isDefaultPrevented()) {
        return;
      }

      $(tip).removeClass(ClassName$6.SHOW); // If this is a touch-enabled device we remove the extra
      // empty mouseover listeners we added for iOS support

      if ('ontouchstart' in document.documentElement) {
        $(document.body).children().off('mouseover', null, $.noop);
      }

      this._activeTrigger[Trigger.CLICK] = false;
      this._activeTrigger[Trigger.FOCUS] = false;
      this._activeTrigger[Trigger.HOVER] = false;

      if ($(this.tip).hasClass(ClassName$6.FADE)) {
        var transitionDuration = Util.getTransitionDurationFromElement(tip);
        $(tip).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
      } else {
        complete();
      }

      this._hoverState = '';
    };

    _proto.update = function update() {
      if (this._popper !== null) {
        this._popper.scheduleUpdate();
      }
    } // Protected
    ;

    _proto.isWithContent = function isWithContent() {
      return Boolean(this.getTitle());
    };

    _proto.addAttachmentClass = function addAttachmentClass(attachment) {
      $(this.getTipElement()).addClass(CLASS_PREFIX + "-" + attachment);
    };

    _proto.getTipElement = function getTipElement() {
      this.tip = this.tip || $(this.config.template)[0];
      return this.tip;
    };

    _proto.setContent = function setContent() {
      var tip = this.getTipElement();
      this.setElementContent($(tip.querySelectorAll(Selector$6.TOOLTIP_INNER)), this.getTitle());
      $(tip).removeClass(ClassName$6.FADE + " " + ClassName$6.SHOW);
    };

    _proto.setElementContent = function setElementContent($element, content) {
      if (typeof content === 'object' && (content.nodeType || content.jquery)) {
        // Content is a DOM node or a jQuery
        if (this.config.html) {
          if (!$(content).parent().is($element)) {
            $element.empty().append(content);
          }
        } else {
          $element.text($(content).text());
        }

        return;
      }

      if (this.config.html) {
        if (this.config.sanitize) {
          content = sanitizeHtml(content, this.config.whiteList, this.config.sanitizeFn);
        }

        $element.html(content);
      } else {
        $element.text(content);
      }
    };

    _proto.getTitle = function getTitle() {
      var title = this.element.getAttribute('data-original-title');

      if (!title) {
        title = typeof this.config.title === 'function' ? this.config.title.call(this.element) : this.config.title;
      }

      return title;
    } // Private
    ;

    _proto._getOffset = function _getOffset() {
      var _this3 = this;

      var offset = {};

      if (typeof this.config.offset === 'function') {
        offset.fn = function (data) {
          data.offsets = _objectSpread({}, data.offsets, _this3.config.offset(data.offsets, _this3.element) || {});
          return data;
        };
      } else {
        offset.offset = this.config.offset;
      }

      return offset;
    };

    _proto._getContainer = function _getContainer() {
      if (this.config.container === false) {
        return document.body;
      }

      if (Util.isElement(this.config.container)) {
        return $(this.config.container);
      }

      return $(document).find(this.config.container);
    };

    _proto._getAttachment = function _getAttachment(placement) {
      return AttachmentMap$1[placement.toUpperCase()];
    };

    _proto._setListeners = function _setListeners() {
      var _this4 = this;

      var triggers = this.config.trigger.split(' ');
      triggers.forEach(function (trigger) {
        if (trigger === 'click') {
          $(_this4.element).on(_this4.constructor.Event.CLICK, _this4.config.selector, function (event) {
            return _this4.toggle(event);
          });
        } else if (trigger !== Trigger.MANUAL) {
          var eventIn = trigger === Trigger.HOVER ? _this4.constructor.Event.MOUSEENTER : _this4.constructor.Event.FOCUSIN;
          var eventOut = trigger === Trigger.HOVER ? _this4.constructor.Event.MOUSELEAVE : _this4.constructor.Event.FOCUSOUT;
          $(_this4.element).on(eventIn, _this4.config.selector, function (event) {
            return _this4._enter(event);
          }).on(eventOut, _this4.config.selector, function (event) {
            return _this4._leave(event);
          });
        }
      });
      $(this.element).closest('.modal').on('hide.bs.modal', function () {
        if (_this4.element) {
          _this4.hide();
        }
      });

      if (this.config.selector) {
        this.config = _objectSpread({}, this.config, {
          trigger: 'manual',
          selector: ''
        });
      } else {
        this._fixTitle();
      }
    };

    _proto._fixTitle = function _fixTitle() {
      var titleType = typeof this.element.getAttribute('data-original-title');

      if (this.element.getAttribute('title') || titleType !== 'string') {
        this.element.setAttribute('data-original-title', this.element.getAttribute('title') || '');
        this.element.setAttribute('title', '');
      }
    };

    _proto._enter = function _enter(event, context) {
      var dataKey = this.constructor.DATA_KEY;
      context = context || $(event.currentTarget).data(dataKey);

      if (!context) {
        context = new this.constructor(event.currentTarget, this._getDelegateConfig());
        $(event.currentTarget).data(dataKey, context);
      }

      if (event) {
        context._activeTrigger[event.type === 'focusin' ? Trigger.FOCUS : Trigger.HOVER] = true;
      }

      if ($(context.getTipElement()).hasClass(ClassName$6.SHOW) || context._hoverState === HoverState.SHOW) {
        context._hoverState = HoverState.SHOW;
        return;
      }

      clearTimeout(context._timeout);
      context._hoverState = HoverState.SHOW;

      if (!context.config.delay || !context.config.delay.show) {
        context.show();
        return;
      }

      context._timeout = setTimeout(function () {
        if (context._hoverState === HoverState.SHOW) {
          context.show();
        }
      }, context.config.delay.show);
    };

    _proto._leave = function _leave(event, context) {
      var dataKey = this.constructor.DATA_KEY;
      context = context || $(event.currentTarget).data(dataKey);

      if (!context) {
        context = new this.constructor(event.currentTarget, this._getDelegateConfig());
        $(event.currentTarget).data(dataKey, context);
      }

      if (event) {
        context._activeTrigger[event.type === 'focusout' ? Trigger.FOCUS : Trigger.HOVER] = false;
      }

      if (context._isWithActiveTrigger()) {
        return;
      }

      clearTimeout(context._timeout);
      context._hoverState = HoverState.OUT;

      if (!context.config.delay || !context.config.delay.hide) {
        context.hide();
        return;
      }

      context._timeout = setTimeout(function () {
        if (context._hoverState === HoverState.OUT) {
          context.hide();
        }
      }, context.config.delay.hide);
    };

    _proto._isWithActiveTrigger = function _isWithActiveTrigger() {
      for (var trigger in this._activeTrigger) {
        if (this._activeTrigger[trigger]) {
          return true;
        }
      }

      return false;
    };

    _proto._getConfig = function _getConfig(config) {
      var dataAttributes = $(this.element).data();
      Object.keys(dataAttributes).forEach(function (dataAttr) {
        if (DISALLOWED_ATTRIBUTES.indexOf(dataAttr) !== -1) {
          delete dataAttributes[dataAttr];
        }
      });
      config = _objectSpread({}, this.constructor.Default, dataAttributes, typeof config === 'object' && config ? config : {});

      if (typeof config.delay === 'number') {
        config.delay = {
          show: config.delay,
          hide: config.delay
        };
      }

      if (typeof config.title === 'number') {
        config.title = config.title.toString();
      }

      if (typeof config.content === 'number') {
        config.content = config.content.toString();
      }

      Util.typeCheckConfig(NAME$6, config, this.constructor.DefaultType);

      if (config.sanitize) {
        config.template = sanitizeHtml(config.template, config.whiteList, config.sanitizeFn);
      }

      return config;
    };

    _proto._getDelegateConfig = function _getDelegateConfig() {
      var config = {};

      if (this.config) {
        for (var key in this.config) {
          if (this.constructor.Default[key] !== this.config[key]) {
            config[key] = this.config[key];
          }
        }
      }

      return config;
    };

    _proto._cleanTipClass = function _cleanTipClass() {
      var $tip = $(this.getTipElement());
      var tabClass = $tip.attr('class').match(BSCLS_PREFIX_REGEX);

      if (tabClass !== null && tabClass.length) {
        $tip.removeClass(tabClass.join(''));
      }
    };

    _proto._handlePopperPlacementChange = function _handlePopperPlacementChange(popperData) {
      var popperInstance = popperData.instance;
      this.tip = popperInstance.popper;

      this._cleanTipClass();

      this.addAttachmentClass(this._getAttachment(popperData.placement));
    };

    _proto._fixTransition = function _fixTransition() {
      var tip = this.getTipElement();
      var initConfigAnimation = this.config.animation;

      if (tip.getAttribute('x-placement') !== null) {
        return;
      }

      $(tip).removeClass(ClassName$6.FADE);
      this.config.animation = false;
      this.hide();
      this.show();
      this.config.animation = initConfigAnimation;
    } // Static
    ;

    Tooltip._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY$6);

        var _config = typeof config === 'object' && config;

        if (!data && /dispose|hide/.test(config)) {
          return;
        }

        if (!data) {
          data = new Tooltip(this, _config);
          $(this).data(DATA_KEY$6, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config]();
        }
      });
    };

    _createClass(Tooltip, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$6;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default$4;
      }
    }, {
      key: "NAME",
      get: function get() {
        return NAME$6;
      }
    }, {
      key: "DATA_KEY",
      get: function get() {
        return DATA_KEY$6;
      }
    }, {
      key: "Event",
      get: function get() {
        return Event$6;
      }
    }, {
      key: "EVENT_KEY",
      get: function get() {
        return EVENT_KEY$6;
      }
    }, {
      key: "DefaultType",
      get: function get() {
        return DefaultType$4;
      }
    }]);

    return Tooltip;
  }();
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */


  $.fn[NAME$6] = Tooltip._jQueryInterface;
  $.fn[NAME$6].Constructor = Tooltip;

  $.fn[NAME$6].noConflict = function () {
    $.fn[NAME$6] = JQUERY_NO_CONFLICT$6;
    return Tooltip._jQueryInterface;
  };
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */


  var NAME$7 = 'popover';
  var VERSION$7 = '4.3.1';
  var DATA_KEY$7 = 'bs.popover';
  var EVENT_KEY$7 = "." + DATA_KEY$7;
  var JQUERY_NO_CONFLICT$7 = $.fn[NAME$7];
  var CLASS_PREFIX$1 = 'bs-popover';
  var BSCLS_PREFIX_REGEX$1 = new RegExp("(^|\\s)" + CLASS_PREFIX$1 + "\\S+", 'g');

  var Default$5 = _objectSpread({}, Tooltip.Default, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip">' + '<div class="arrow"></div>' + '<h3 class="popover-header"></h3>' + '<div class="popover-body"></div></div>'
  });

  var DefaultType$5 = _objectSpread({}, Tooltip.DefaultType, {
    content: '(string|element|function)'
  });

  var ClassName$7 = {
    FADE: 'fade',
    SHOW: 'show'
  };
  var Selector$7 = {
    TITLE: '.popover-header',
    CONTENT: '.popover-body'
  };
  var Event$7 = {
    HIDE: "hide" + EVENT_KEY$7,
    HIDDEN: "hidden" + EVENT_KEY$7,
    SHOW: "show" + EVENT_KEY$7,
    SHOWN: "shown" + EVENT_KEY$7,
    INSERTED: "inserted" + EVENT_KEY$7,
    CLICK: "click" + EVENT_KEY$7,
    FOCUSIN: "focusin" + EVENT_KEY$7,
    FOCUSOUT: "focusout" + EVENT_KEY$7,
    MOUSEENTER: "mouseenter" + EVENT_KEY$7,
    MOUSELEAVE: "mouseleave" + EVENT_KEY$7
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Popover =
  /*#__PURE__*/
  function (_Tooltip) {
    _inheritsLoose(Popover, _Tooltip);

    function Popover() {
      return _Tooltip.apply(this, arguments) || this;
    }

    var _proto = Popover.prototype; // Overrides

    _proto.isWithContent = function isWithContent() {
      return this.getTitle() || this._getContent();
    };

    _proto.addAttachmentClass = function addAttachmentClass(attachment) {
      $(this.getTipElement()).addClass(CLASS_PREFIX$1 + "-" + attachment);
    };

    _proto.getTipElement = function getTipElement() {
      this.tip = this.tip || $(this.config.template)[0];
      return this.tip;
    };

    _proto.setContent = function setContent() {
      var $tip = $(this.getTipElement()); // We use append for html objects to maintain js events

      this.setElementContent($tip.find(Selector$7.TITLE), this.getTitle());

      var content = this._getContent();

      if (typeof content === 'function') {
        content = content.call(this.element);
      }

      this.setElementContent($tip.find(Selector$7.CONTENT), content);
      $tip.removeClass(ClassName$7.FADE + " " + ClassName$7.SHOW);
    } // Private
    ;

    _proto._getContent = function _getContent() {
      return this.element.getAttribute('data-content') || this.config.content;
    };

    _proto._cleanTipClass = function _cleanTipClass() {
      var $tip = $(this.getTipElement());
      var tabClass = $tip.attr('class').match(BSCLS_PREFIX_REGEX$1);

      if (tabClass !== null && tabClass.length > 0) {
        $tip.removeClass(tabClass.join(''));
      }
    } // Static
    ;

    Popover._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY$7);

        var _config = typeof config === 'object' ? config : null;

        if (!data && /dispose|hide/.test(config)) {
          return;
        }

        if (!data) {
          data = new Popover(this, _config);
          $(this).data(DATA_KEY$7, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config]();
        }
      });
    };

    _createClass(Popover, null, [{
      key: "VERSION",
      // Getters
      get: function get() {
        return VERSION$7;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default$5;
      }
    }, {
      key: "NAME",
      get: function get() {
        return NAME$7;
      }
    }, {
      key: "DATA_KEY",
      get: function get() {
        return DATA_KEY$7;
      }
    }, {
      key: "Event",
      get: function get() {
        return Event$7;
      }
    }, {
      key: "EVENT_KEY",
      get: function get() {
        return EVENT_KEY$7;
      }
    }, {
      key: "DefaultType",
      get: function get() {
        return DefaultType$5;
      }
    }]);

    return Popover;
  }(Tooltip);
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */


  $.fn[NAME$7] = Popover._jQueryInterface;
  $.fn[NAME$7].Constructor = Popover;

  $.fn[NAME$7].noConflict = function () {
    $.fn[NAME$7] = JQUERY_NO_CONFLICT$7;
    return Popover._jQueryInterface;
  };
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */


  var NAME$8 = 'scrollspy';
  var VERSION$8 = '4.3.1';
  var DATA_KEY$8 = 'bs.scrollspy';
  var EVENT_KEY$8 = "." + DATA_KEY$8;
  var DATA_API_KEY$6 = '.data-api';
  var JQUERY_NO_CONFLICT$8 = $.fn[NAME$8];
  var Default$6 = {
    offset: 10,
    method: 'auto',
    target: ''
  };
  var DefaultType$6 = {
    offset: 'number',
    method: 'string',
    target: '(string|element)'
  };
  var Event$8 = {
    ACTIVATE: "activate" + EVENT_KEY$8,
    SCROLL: "scroll" + EVENT_KEY$8,
    LOAD_DATA_API: "load" + EVENT_KEY$8 + DATA_API_KEY$6
  };
  var ClassName$8 = {
    DROPDOWN_ITEM: 'dropdown-item',
    DROPDOWN_MENU: 'dropdown-menu',
    ACTIVE: 'active'
  };
  var Selector$8 = {
    DATA_SPY: '[data-spy="scroll"]',
    ACTIVE: '.active',
    NAV_LIST_GROUP: '.nav, .list-group',
    NAV_LINKS: '.nav-link',
    NAV_ITEMS: '.nav-item',
    LIST_ITEMS: '.list-group-item',
    DROPDOWN: '.dropdown',
    DROPDOWN_ITEMS: '.dropdown-item',
    DROPDOWN_TOGGLE: '.dropdown-toggle'
  };
  var OffsetMethod = {
    OFFSET: 'offset',
    POSITION: 'position'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var ScrollSpy =
  /*#__PURE__*/
  function () {
    function ScrollSpy(element, config) {
      var _this = this;

      this._element = element;
      this._scrollElement = element.tagName === 'BODY' ? window : element;
      this._config = this._getConfig(config);
      this._selector = this._config.target + " " + Selector$8.NAV_LINKS + "," + (this._config.target + " " + Selector$8.LIST_ITEMS + ",") + (this._config.target + " " + Selector$8.DROPDOWN_ITEMS);
      this._offsets = [];
      this._targets = [];
      this._activeTarget = null;
      this._scrollHeight = 0;
      $(this._scrollElement).on(Event$8.SCROLL, function (event) {
        return _this._process(event);
      });
      this.refresh();

      this._process();
    } // Getters


    var _proto = ScrollSpy.prototype; // Public

    _proto.refresh = function refresh() {
      var _this2 = this;

      var autoMethod = this._scrollElement === this._scrollElement.window ? OffsetMethod.OFFSET : OffsetMethod.POSITION;
      var offsetMethod = this._config.method === 'auto' ? autoMethod : this._config.method;
      var offsetBase = offsetMethod === OffsetMethod.POSITION ? this._getScrollTop() : 0;
      this._offsets = [];
      this._targets = [];
      this._scrollHeight = this._getScrollHeight();
      var targets = [].slice.call(document.querySelectorAll(this._selector));
      targets.map(function (element) {
        var target;
        var targetSelector = Util.getSelectorFromElement(element);

        if (targetSelector) {
          target = document.querySelector(targetSelector);
        }

        if (target) {
          var targetBCR = target.getBoundingClientRect();

          if (targetBCR.width || targetBCR.height) {
            // TODO (fat): remove sketch reliance on jQuery position/offset
            return [$(target)[offsetMethod]().top + offsetBase, targetSelector];
          }
        }

        return null;
      }).filter(function (item) {
        return item;
      }).sort(function (a, b) {
        return a[0] - b[0];
      }).forEach(function (item) {
        _this2._offsets.push(item[0]);

        _this2._targets.push(item[1]);
      });
    };

    _proto.dispose = function dispose() {
      $.removeData(this._element, DATA_KEY$8);
      $(this._scrollElement).off(EVENT_KEY$8);
      this._element = null;
      this._scrollElement = null;
      this._config = null;
      this._selector = null;
      this._offsets = null;
      this._targets = null;
      this._activeTarget = null;
      this._scrollHeight = null;
    } // Private
    ;

    _proto._getConfig = function _getConfig(config) {
      config = _objectSpread({}, Default$6, typeof config === 'object' && config ? config : {});

      if (typeof config.target !== 'string') {
        var id = $(config.target).attr('id');

        if (!id) {
          id = Util.getUID(NAME$8);
          $(config.target).attr('id', id);
        }

        config.target = "#" + id;
      }

      Util.typeCheckConfig(NAME$8, config, DefaultType$6);
      return config;
    };

    _proto._getScrollTop = function _getScrollTop() {
      return this._scrollElement === window ? this._scrollElement.pageYOffset : this._scrollElement.scrollTop;
    };

    _proto._getScrollHeight = function _getScrollHeight() {
      return this._scrollElement.scrollHeight || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    };

    _proto._getOffsetHeight = function _getOffsetHeight() {
      return this._scrollElement === window ? window.innerHeight : this._scrollElement.getBoundingClientRect().height;
    };

    _proto._process = function _process() {
      var scrollTop = this._getScrollTop() + this._config.offset;

      var scrollHeight = this._getScrollHeight();

      var maxScroll = this._config.offset + scrollHeight - this._getOffsetHeight();

      if (this._scrollHeight !== scrollHeight) {
        this.refresh();
      }

      if (scrollTop >= maxScroll) {
        var target = this._targets[this._targets.length - 1];

        if (this._activeTarget !== target) {
          this._activate(target);
        }

        return;
      }

      if (this._activeTarget && scrollTop < this._offsets[0] && this._offsets[0] > 0) {
        this._activeTarget = null;

        this._clear();

        return;
      }

      var offsetLength = this._offsets.length;

      for (var i = offsetLength; i--;) {
        var isActiveTarget = this._activeTarget !== this._targets[i] && scrollTop >= this._offsets[i] && (typeof this._offsets[i + 1] === 'undefined' || scrollTop < this._offsets[i + 1]);

        if (isActiveTarget) {
          this._activate(this._targets[i]);
        }
      }
    };

    _proto._activate = function _activate(target) {
      this._activeTarget = target;

      this._clear();

      var queries = this._selector.split(',').map(function (selector) {
        return selector + "[data-target=\"" + target + "\"]," + selector + "[href=\"" + target + "\"]";
      });

      var $link = $([].slice.call(document.querySelectorAll(queries.join(','))));

      if ($link.hasClass(ClassName$8.DROPDOWN_ITEM)) {
        $link.closest(Selector$8.DROPDOWN).find(Selector$8.DROPDOWN_TOGGLE).addClass(ClassName$8.ACTIVE);
        $link.addClass(ClassName$8.ACTIVE);
      } else {
        // Set triggered link as active
        $link.addClass(ClassName$8.ACTIVE); // Set triggered links parents as active
        // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor

        $link.parents(Selector$8.NAV_LIST_GROUP).prev(Selector$8.NAV_LINKS + ", " + Selector$8.LIST_ITEMS).addClass(ClassName$8.ACTIVE); // Handle special case when .nav-link is inside .nav-item

        $link.parents(Selector$8.NAV_LIST_GROUP).prev(Selector$8.NAV_ITEMS).children(Selector$8.NAV_LINKS).addClass(ClassName$8.ACTIVE);
      }

      $(this._scrollElement).trigger(Event$8.ACTIVATE, {
        relatedTarget: target
      });
    };

    _proto._clear = function _clear() {
      [].slice.call(document.querySelectorAll(this._selector)).filter(function (node) {
        return node.classList.contains(ClassName$8.ACTIVE);
      }).forEach(function (node) {
        return node.classList.remove(ClassName$8.ACTIVE);
      });
    } // Static
    ;

    ScrollSpy._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY$8);

        var _config = typeof config === 'object' && config;

        if (!data) {
          data = new ScrollSpy(this, _config);
          $(this).data(DATA_KEY$8, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config]();
        }
      });
    };

    _createClass(ScrollSpy, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$8;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default$6;
      }
    }]);

    return ScrollSpy;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(window).on(Event$8.LOAD_DATA_API, function () {
    var scrollSpys = [].slice.call(document.querySelectorAll(Selector$8.DATA_SPY));
    var scrollSpysLength = scrollSpys.length;

    for (var i = scrollSpysLength; i--;) {
      var $spy = $(scrollSpys[i]);

      ScrollSpy._jQueryInterface.call($spy, $spy.data());
    }
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME$8] = ScrollSpy._jQueryInterface;
  $.fn[NAME$8].Constructor = ScrollSpy;

  $.fn[NAME$8].noConflict = function () {
    $.fn[NAME$8] = JQUERY_NO_CONFLICT$8;
    return ScrollSpy._jQueryInterface;
  };
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */


  var NAME$9 = 'tab';
  var VERSION$9 = '4.3.1';
  var DATA_KEY$9 = 'bs.tab';
  var EVENT_KEY$9 = "." + DATA_KEY$9;
  var DATA_API_KEY$7 = '.data-api';
  var JQUERY_NO_CONFLICT$9 = $.fn[NAME$9];
  var Event$9 = {
    HIDE: "hide" + EVENT_KEY$9,
    HIDDEN: "hidden" + EVENT_KEY$9,
    SHOW: "show" + EVENT_KEY$9,
    SHOWN: "shown" + EVENT_KEY$9,
    CLICK_DATA_API: "click" + EVENT_KEY$9 + DATA_API_KEY$7
  };
  var ClassName$9 = {
    DROPDOWN_MENU: 'dropdown-menu',
    ACTIVE: 'active',
    DISABLED: 'disabled',
    FADE: 'fade',
    SHOW: 'show'
  };
  var Selector$9 = {
    DROPDOWN: '.dropdown',
    NAV_LIST_GROUP: '.nav, .list-group',
    ACTIVE: '.active',
    ACTIVE_UL: '> li > .active',
    DATA_TOGGLE: '[data-toggle="tab"], [data-toggle="pill"], [data-toggle="list"]',
    DROPDOWN_TOGGLE: '.dropdown-toggle',
    DROPDOWN_ACTIVE_CHILD: '> .dropdown-menu .active'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Tab =
  /*#__PURE__*/
  function () {
    function Tab(element) {
      this._element = element;
    } // Getters


    var _proto = Tab.prototype; // Public

    _proto.show = function show() {
      var _this = this;

      if (this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE && $(this._element).hasClass(ClassName$9.ACTIVE) || $(this._element).hasClass(ClassName$9.DISABLED)) {
        return;
      }

      var target;
      var previous;
      var listElement = $(this._element).closest(Selector$9.NAV_LIST_GROUP)[0];
      var selector = Util.getSelectorFromElement(this._element);

      if (listElement) {
        var itemSelector = listElement.nodeName === 'UL' || listElement.nodeName === 'OL' ? Selector$9.ACTIVE_UL : Selector$9.ACTIVE;
        previous = $.makeArray($(listElement).find(itemSelector));
        previous = previous[previous.length - 1];
      }

      var hideEvent = $.Event(Event$9.HIDE, {
        relatedTarget: this._element
      });
      var showEvent = $.Event(Event$9.SHOW, {
        relatedTarget: previous
      });

      if (previous) {
        $(previous).trigger(hideEvent);
      }

      $(this._element).trigger(showEvent);

      if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) {
        return;
      }

      if (selector) {
        target = document.querySelector(selector);
      }

      this._activate(this._element, listElement);

      var complete = function complete() {
        var hiddenEvent = $.Event(Event$9.HIDDEN, {
          relatedTarget: _this._element
        });
        var shownEvent = $.Event(Event$9.SHOWN, {
          relatedTarget: previous
        });
        $(previous).trigger(hiddenEvent);
        $(_this._element).trigger(shownEvent);
      };

      if (target) {
        this._activate(target, target.parentNode, complete);
      } else {
        complete();
      }
    };

    _proto.dispose = function dispose() {
      $.removeData(this._element, DATA_KEY$9);
      this._element = null;
    } // Private
    ;

    _proto._activate = function _activate(element, container, callback) {
      var _this2 = this;

      var activeElements = container && (container.nodeName === 'UL' || container.nodeName === 'OL') ? $(container).find(Selector$9.ACTIVE_UL) : $(container).children(Selector$9.ACTIVE);
      var active = activeElements[0];
      var isTransitioning = callback && active && $(active).hasClass(ClassName$9.FADE);

      var complete = function complete() {
        return _this2._transitionComplete(element, active, callback);
      };

      if (active && isTransitioning) {
        var transitionDuration = Util.getTransitionDurationFromElement(active);
        $(active).removeClass(ClassName$9.SHOW).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
      } else {
        complete();
      }
    };

    _proto._transitionComplete = function _transitionComplete(element, active, callback) {
      if (active) {
        $(active).removeClass(ClassName$9.ACTIVE);
        var dropdownChild = $(active.parentNode).find(Selector$9.DROPDOWN_ACTIVE_CHILD)[0];

        if (dropdownChild) {
          $(dropdownChild).removeClass(ClassName$9.ACTIVE);
        }

        if (active.getAttribute('role') === 'tab') {
          active.setAttribute('aria-selected', false);
        }
      }

      $(element).addClass(ClassName$9.ACTIVE);

      if (element.getAttribute('role') === 'tab') {
        element.setAttribute('aria-selected', true);
      }

      Util.reflow(element);

      if (element.classList.contains(ClassName$9.FADE)) {
        element.classList.add(ClassName$9.SHOW);
      }

      if (element.parentNode && $(element.parentNode).hasClass(ClassName$9.DROPDOWN_MENU)) {
        var dropdownElement = $(element).closest(Selector$9.DROPDOWN)[0];

        if (dropdownElement) {
          var dropdownToggleList = [].slice.call(dropdownElement.querySelectorAll(Selector$9.DROPDOWN_TOGGLE));
          $(dropdownToggleList).addClass(ClassName$9.ACTIVE);
        }

        element.setAttribute('aria-expanded', true);
      }

      if (callback) {
        callback();
      }
    } // Static
    ;

    Tab._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var $this = $(this);
        var data = $this.data(DATA_KEY$9);

        if (!data) {
          data = new Tab(this);
          $this.data(DATA_KEY$9, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config]();
        }
      });
    };

    _createClass(Tab, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$9;
      }
    }]);

    return Tab;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(document).on(Event$9.CLICK_DATA_API, Selector$9.DATA_TOGGLE, function (event) {
    event.preventDefault();

    Tab._jQueryInterface.call($(this), 'show');
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME$9] = Tab._jQueryInterface;
  $.fn[NAME$9].Constructor = Tab;

  $.fn[NAME$9].noConflict = function () {
    $.fn[NAME$9] = JQUERY_NO_CONFLICT$9;
    return Tab._jQueryInterface;
  };
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */


  var NAME$a = 'toast';
  var VERSION$a = '4.3.1';
  var DATA_KEY$a = 'bs.toast';
  var EVENT_KEY$a = "." + DATA_KEY$a;
  var JQUERY_NO_CONFLICT$a = $.fn[NAME$a];
  var Event$a = {
    CLICK_DISMISS: "click.dismiss" + EVENT_KEY$a,
    HIDE: "hide" + EVENT_KEY$a,
    HIDDEN: "hidden" + EVENT_KEY$a,
    SHOW: "show" + EVENT_KEY$a,
    SHOWN: "shown" + EVENT_KEY$a
  };
  var ClassName$a = {
    FADE: 'fade',
    HIDE: 'hide',
    SHOW: 'show',
    SHOWING: 'showing'
  };
  var DefaultType$7 = {
    animation: 'boolean',
    autohide: 'boolean',
    delay: 'number'
  };
  var Default$7 = {
    animation: true,
    autohide: true,
    delay: 500
  };
  var Selector$a = {
    DATA_DISMISS: '[data-dismiss="toast"]'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Toast =
  /*#__PURE__*/
  function () {
    function Toast(element, config) {
      this._element = element;
      this._config = this._getConfig(config);
      this._timeout = null;

      this._setListeners();
    } // Getters


    var _proto = Toast.prototype; // Public

    _proto.show = function show() {
      var _this = this;

      $(this._element).trigger(Event$a.SHOW);

      if (this._config.animation) {
        this._element.classList.add(ClassName$a.FADE);
      }

      var complete = function complete() {
        _this._element.classList.remove(ClassName$a.SHOWING);

        _this._element.classList.add(ClassName$a.SHOW);

        $(_this._element).trigger(Event$a.SHOWN);

        if (_this._config.autohide) {
          _this.hide();
        }
      };

      this._element.classList.remove(ClassName$a.HIDE);

      this._element.classList.add(ClassName$a.SHOWING);

      if (this._config.animation) {
        var transitionDuration = Util.getTransitionDurationFromElement(this._element);
        $(this._element).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
      } else {
        complete();
      }
    };

    _proto.hide = function hide(withoutTimeout) {
      var _this2 = this;

      if (!this._element.classList.contains(ClassName$a.SHOW)) {
        return;
      }

      $(this._element).trigger(Event$a.HIDE);

      if (withoutTimeout) {
        this._close();
      } else {
        this._timeout = setTimeout(function () {
          _this2._close();
        }, this._config.delay);
      }
    };

    _proto.dispose = function dispose() {
      clearTimeout(this._timeout);
      this._timeout = null;

      if (this._element.classList.contains(ClassName$a.SHOW)) {
        this._element.classList.remove(ClassName$a.SHOW);
      }

      $(this._element).off(Event$a.CLICK_DISMISS);
      $.removeData(this._element, DATA_KEY$a);
      this._element = null;
      this._config = null;
    } // Private
    ;

    _proto._getConfig = function _getConfig(config) {
      config = _objectSpread({}, Default$7, $(this._element).data(), typeof config === 'object' && config ? config : {});
      Util.typeCheckConfig(NAME$a, config, this.constructor.DefaultType);
      return config;
    };

    _proto._setListeners = function _setListeners() {
      var _this3 = this;

      $(this._element).on(Event$a.CLICK_DISMISS, Selector$a.DATA_DISMISS, function () {
        return _this3.hide(true);
      });
    };

    _proto._close = function _close() {
      var _this4 = this;

      var complete = function complete() {
        _this4._element.classList.add(ClassName$a.HIDE);

        $(_this4._element).trigger(Event$a.HIDDEN);
      };

      this._element.classList.remove(ClassName$a.SHOW);

      if (this._config.animation) {
        var transitionDuration = Util.getTransitionDurationFromElement(this._element);
        $(this._element).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
      } else {
        complete();
      }
    } // Static
    ;

    Toast._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var $element = $(this);
        var data = $element.data(DATA_KEY$a);

        var _config = typeof config === 'object' && config;

        if (!data) {
          data = new Toast(this, _config);
          $element.data(DATA_KEY$a, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config](this);
        }
      });
    };

    _createClass(Toast, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$a;
      }
    }, {
      key: "DefaultType",
      get: function get() {
        return DefaultType$7;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default$7;
      }
    }]);

    return Toast;
  }();
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */


  $.fn[NAME$a] = Toast._jQueryInterface;
  $.fn[NAME$a].Constructor = Toast;

  $.fn[NAME$a].noConflict = function () {
    $.fn[NAME$a] = JQUERY_NO_CONFLICT$a;
    return Toast._jQueryInterface;
  };
  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.3.1): index.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */


  (function () {
    if (typeof $ === 'undefined') {
      throw new TypeError('Bootstrap\'s JavaScript requires jQuery. jQuery must be included before Bootstrap\'s JavaScript.');
    }

    var version = $.fn.jquery.split(' ')[0].split('.');
    var minMajor = 1;
    var ltMajor = 2;
    var minMinor = 9;
    var minPatch = 1;
    var maxMajor = 4;

    if (version[0] < ltMajor && version[1] < minMinor || version[0] === minMajor && version[1] === minMinor && version[2] < minPatch || version[0] >= maxMajor) {
      throw new Error('Bootstrap\'s JavaScript requires at least jQuery v1.9.1 but less than v4.0.0');
    }
  })();

  exports.Util = Util;
  exports.Alert = Alert;
  exports.Button = Button;
  exports.Carousel = Carousel;
  exports.Collapse = Collapse;
  exports.Dropdown = Dropdown;
  exports.Modal = Modal;
  exports.Popover = Popover;
  exports.Scrollspy = ScrollSpy;
  exports.Tab = Tab;
  exports.Toast = Toast;
  exports.Tooltip = Tooltip;
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
});
/**
 * File skip-link-focus-fix.js.
 *
 * Helps with accessibility for keyboard only users.
 *
 * Learn more: https://git.io/vWdr2
 */
(function () {
  var isWebkit = navigator.userAgent.toLowerCase().indexOf('webkit') > -1,
      isOpera = navigator.userAgent.toLowerCase().indexOf('opera') > -1,
      isIe = navigator.userAgent.toLowerCase().indexOf('msie') > -1;

  if ((isWebkit || isOpera || isIe) && document.getElementById && window.addEventListener) {
    window.addEventListener('hashchange', function () {
      var id = location.hash.substring(1),
          element;

      if (!/^[A-z0-9_-]+$/.test(id)) {
        return;
      }

      element = document.getElementById(id);

      if (element) {
        if (!/^(?:a|select|input|button|textarea)$/i.test(element.tagName)) {
          element.tabIndex = -1;
        }

        element.focus();
      }
    }, false);
  }
})();
/* @preserve
 * Leaflet 1.5.1+Detached: 2e3e0ffbe87f246eb76d86d2633ddd59b262830b.2e3e0ff, a JS library for interactive maps. http://leafletjs.com
 * (c) 2010-2018 Vladimir Agafonkin, (c) 2010-2011 CloudMade
 */
!function (t, i) {
  "object" == typeof exports && "undefined" != typeof module ? i(exports) : "function" == typeof define && define.amd ? define(["exports"], i) : i(t.L = {});
}(this, function (t) {
  "use strict";

  var i = Object.freeze;

  function h(t) {
    var i, e, n, o;

    for (e = 1, n = arguments.length; e < n; e++) for (i in o = arguments[e]) t[i] = o[i];

    return t;
  }

  Object.freeze = function (t) {
    return t;
  };

  var s = Object.create || function (t) {
    return e.prototype = t, new e();
  };

  function e() {}

  function a(t, i) {
    var e = Array.prototype.slice;
    if (t.bind) return t.bind.apply(t, e.call(arguments, 1));
    var n = e.call(arguments, 2);
    return function () {
      return t.apply(i, n.length ? n.concat(e.call(arguments)) : arguments);
    };
  }

  var n = 0;

  function u(t) {
    return t._leaflet_id = t._leaflet_id || ++n, t._leaflet_id;
  }

  function o(t, i, e) {
    var n, o, s, r;
    return r = function () {
      n = !1, o && (s.apply(e, o), o = !1);
    }, s = function () {
      n ? o = arguments : (t.apply(e, arguments), setTimeout(r, i), n = !0);
    };
  }

  function r(t, i, e) {
    var n = i[1],
        o = i[0],
        s = n - o;
    return t === n && e ? t : ((t - o) % s + s) % s + o;
  }

  function l() {
    return !1;
  }

  function c(t, i) {
    return i = void 0 === i ? 6 : i, +(Math.round(t + "e+" + i) + "e-" + i);
  }

  function _(t) {
    return t.trim ? t.trim() : t.replace(/^\s+|\s+$/g, "");
  }

  function d(t) {
    return _(t).split(/\s+/);
  }

  function p(t, i) {
    for (var e in t.hasOwnProperty("options") || (t.options = t.options ? s(t.options) : {}), i) t.options[e] = i[e];

    return t.options;
  }

  function m(t, i, e) {
    var n = [];

    for (var o in t) n.push(encodeURIComponent(e ? o.toUpperCase() : o) + "=" + encodeURIComponent(t[o]));

    return (i && -1 !== i.indexOf("?") ? "&" : "?") + n.join("&");
  }

  var f = /\{ *([\w_-]+) *\}/g;

  function g(t, n) {
    return t.replace(f, function (t, i) {
      var e = n[i];
      if (void 0 === e) throw new Error("No value provided for variable " + t);
      return "function" == typeof e && (e = e(n)), e;
    });
  }

  var v = Array.isArray || function (t) {
    return "[object Array]" === Object.prototype.toString.call(t);
  };

  function y(t, i) {
    for (var e = 0; e < t.length; e++) if (t[e] === i) return e;

    return -1;
  }

  var x = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

  function w(t) {
    return window["webkit" + t] || window["moz" + t] || window["ms" + t];
  }

  var P = 0;

  function b(t) {
    var i = +new Date(),
        e = Math.max(0, 16 - (i - P));
    return P = i + e, window.setTimeout(t, e);
  }

  var T = window.requestAnimationFrame || w("RequestAnimationFrame") || b,
      z = window.cancelAnimationFrame || w("CancelAnimationFrame") || w("CancelRequestAnimationFrame") || function (t) {
    window.clearTimeout(t);
  };

  function M(t, i, e) {
    if (!e || T !== b) return T.call(window, a(t, i));
    t.call(i);
  }

  function C(t) {
    t && z.call(window, t);
  }

  var S = (Object.freeze || Object)({
    freeze: i,
    extend: h,
    create: s,
    bind: a,
    lastId: n,
    stamp: u,
    throttle: o,
    wrapNum: r,
    falseFn: l,
    formatNum: c,
    trim: _,
    splitWords: d,
    setOptions: p,
    getParamString: m,
    template: g,
    isArray: v,
    indexOf: y,
    emptyImageUrl: x,
    requestFn: T,
    cancelFn: z,
    requestAnimFrame: M,
    cancelAnimFrame: C
  });

  function Z() {}

  Z.extend = function (t) {
    function i() {
      this.initialize && this.initialize.apply(this, arguments), this.callInitHooks();
    }

    var e = i.__super__ = this.prototype,
        n = s(e);

    for (var o in (n.constructor = i).prototype = n, this) this.hasOwnProperty(o) && "prototype" !== o && "__super__" !== o && (i[o] = this[o]);

    return t.statics && (h(i, t.statics), delete t.statics), t.includes && (function (t) {
      if ("undefined" == typeof L || !L || !L.Mixin) return;
      t = v(t) ? t : [t];

      for (var i = 0; i < t.length; i++) t[i] === L.Mixin.Events && console.warn("Deprecated include of L.Mixin.Events: this property will be removed in future releases, please inherit from L.Evented instead.", new Error().stack);
    }(t.includes), h.apply(null, [n].concat(t.includes)), delete t.includes), n.options && (t.options = h(s(n.options), t.options)), h(n, t), n._initHooks = [], n.callInitHooks = function () {
      if (!this._initHooksCalled) {
        e.callInitHooks && e.callInitHooks.call(this), this._initHooksCalled = !0;

        for (var t = 0, i = n._initHooks.length; t < i; t++) n._initHooks[t].call(this);
      }
    }, i;
  }, Z.include = function (t) {
    return h(this.prototype, t), this;
  }, Z.mergeOptions = function (t) {
    return h(this.prototype.options, t), this;
  }, Z.addInitHook = function (t) {
    var i = Array.prototype.slice.call(arguments, 1),
        e = "function" == typeof t ? t : function () {
      this[t].apply(this, i);
    };
    return this.prototype._initHooks = this.prototype._initHooks || [], this.prototype._initHooks.push(e), this;
  };
  var E = {
    on: function (t, i, e) {
      if ("object" == typeof t) for (var n in t) this._on(n, t[n], i);else for (var o = 0, s = (t = d(t)).length; o < s; o++) this._on(t[o], i, e);
      return this;
    },
    off: function (t, i, e) {
      if (t) {
        if ("object" == typeof t) for (var n in t) this._off(n, t[n], i);else for (var o = 0, s = (t = d(t)).length; o < s; o++) this._off(t[o], i, e);
      } else delete this._events;
      return this;
    },
    _on: function (t, i, e) {
      this._events = this._events || {};
      var n = this._events[t];
      n || (n = [], this._events[t] = n), e === this && (e = void 0);

      for (var o = {
        fn: i,
        ctx: e
      }, s = n, r = 0, a = s.length; r < a; r++) if (s[r].fn === i && s[r].ctx === e) return;

      s.push(o);
    },
    _off: function (t, i, e) {
      var n, o, s;
      if (this._events && (n = this._events[t])) if (i) {
        if (e === this && (e = void 0), n) for (o = 0, s = n.length; o < s; o++) {
          var r = n[o];
          if (r.ctx === e && r.fn === i) return r.fn = l, this._firingCount && (this._events[t] = n = n.slice()), void n.splice(o, 1);
        }
      } else {
        for (o = 0, s = n.length; o < s; o++) n[o].fn = l;

        delete this._events[t];
      }
    },
    fire: function (t, i, e) {
      if (!this.listens(t, e)) return this;
      var n = h({}, i, {
        type: t,
        target: this,
        sourceTarget: i && i.sourceTarget || this
      });

      if (this._events) {
        var o = this._events[t];

        if (o) {
          this._firingCount = this._firingCount + 1 || 1;

          for (var s = 0, r = o.length; s < r; s++) {
            var a = o[s];
            a.fn.call(a.ctx || this, n);
          }

          this._firingCount--;
        }
      }

      return e && this._propagateEvent(n), this;
    },
    listens: function (t, i) {
      var e = this._events && this._events[t];
      if (e && e.length) return !0;
      if (i) for (var n in this._eventParents) if (this._eventParents[n].listens(t, i)) return !0;
      return !1;
    },
    once: function (t, i, e) {
      if ("object" == typeof t) {
        for (var n in t) this.once(n, t[n], i);

        return this;
      }

      var o = a(function () {
        this.off(t, i, e).off(t, o, e);
      }, this);
      return this.on(t, i, e).on(t, o, e);
    },
    addEventParent: function (t) {
      return this._eventParents = this._eventParents || {}, this._eventParents[u(t)] = t, this;
    },
    removeEventParent: function (t) {
      return this._eventParents && delete this._eventParents[u(t)], this;
    },
    _propagateEvent: function (t) {
      for (var i in this._eventParents) this._eventParents[i].fire(t.type, h({
        layer: t.target,
        propagatedFrom: t.target
      }, t), !0);
    }
  };
  E.addEventListener = E.on, E.removeEventListener = E.clearAllEventListeners = E.off, E.addOneTimeEventListener = E.once, E.fireEvent = E.fire, E.hasEventListeners = E.listens;
  var k = Z.extend(E);

  function B(t, i, e) {
    this.x = e ? Math.round(t) : t, this.y = e ? Math.round(i) : i;
  }

  var A = Math.trunc || function (t) {
    return 0 < t ? Math.floor(t) : Math.ceil(t);
  };

  function I(t, i, e) {
    return t instanceof B ? t : v(t) ? new B(t[0], t[1]) : null == t ? t : "object" == typeof t && "x" in t && "y" in t ? new B(t.x, t.y) : new B(t, i, e);
  }

  function O(t, i) {
    if (t) for (var e = i ? [t, i] : t, n = 0, o = e.length; n < o; n++) this.extend(e[n]);
  }

  function R(t, i) {
    return !t || t instanceof O ? t : new O(t, i);
  }

  function N(t, i) {
    if (t) for (var e = i ? [t, i] : t, n = 0, o = e.length; n < o; n++) this.extend(e[n]);
  }

  function D(t, i) {
    return t instanceof N ? t : new N(t, i);
  }

  function j(t, i, e) {
    if (isNaN(t) || isNaN(i)) throw new Error("Invalid LatLng object: (" + t + ", " + i + ")");
    this.lat = +t, this.lng = +i, void 0 !== e && (this.alt = +e);
  }

  function W(t, i, e) {
    return t instanceof j ? t : v(t) && "object" != typeof t[0] ? 3 === t.length ? new j(t[0], t[1], t[2]) : 2 === t.length ? new j(t[0], t[1]) : null : null == t ? t : "object" == typeof t && "lat" in t ? new j(t.lat, "lng" in t ? t.lng : t.lon, t.alt) : void 0 === i ? null : new j(t, i, e);
  }

  B.prototype = {
    clone: function () {
      return new B(this.x, this.y);
    },
    add: function (t) {
      return this.clone()._add(I(t));
    },
    _add: function (t) {
      return this.x += t.x, this.y += t.y, this;
    },
    subtract: function (t) {
      return this.clone()._subtract(I(t));
    },
    _subtract: function (t) {
      return this.x -= t.x, this.y -= t.y, this;
    },
    divideBy: function (t) {
      return this.clone()._divideBy(t);
    },
    _divideBy: function (t) {
      return this.x /= t, this.y /= t, this;
    },
    multiplyBy: function (t) {
      return this.clone()._multiplyBy(t);
    },
    _multiplyBy: function (t) {
      return this.x *= t, this.y *= t, this;
    },
    scaleBy: function (t) {
      return new B(this.x * t.x, this.y * t.y);
    },
    unscaleBy: function (t) {
      return new B(this.x / t.x, this.y / t.y);
    },
    round: function () {
      return this.clone()._round();
    },
    _round: function () {
      return this.x = Math.round(this.x), this.y = Math.round(this.y), this;
    },
    floor: function () {
      return this.clone()._floor();
    },
    _floor: function () {
      return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this;
    },
    ceil: function () {
      return this.clone()._ceil();
    },
    _ceil: function () {
      return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this;
    },
    trunc: function () {
      return this.clone()._trunc();
    },
    _trunc: function () {
      return this.x = A(this.x), this.y = A(this.y), this;
    },
    distanceTo: function (t) {
      var i = (t = I(t)).x - this.x,
          e = t.y - this.y;
      return Math.sqrt(i * i + e * e);
    },
    equals: function (t) {
      return (t = I(t)).x === this.x && t.y === this.y;
    },
    contains: function (t) {
      return t = I(t), Math.abs(t.x) <= Math.abs(this.x) && Math.abs(t.y) <= Math.abs(this.y);
    },
    toString: function () {
      return "Point(" + c(this.x) + ", " + c(this.y) + ")";
    }
  }, O.prototype = {
    extend: function (t) {
      return t = I(t), this.min || this.max ? (this.min.x = Math.min(t.x, this.min.x), this.max.x = Math.max(t.x, this.max.x), this.min.y = Math.min(t.y, this.min.y), this.max.y = Math.max(t.y, this.max.y)) : (this.min = t.clone(), this.max = t.clone()), this;
    },
    getCenter: function (t) {
      return new B((this.min.x + this.max.x) / 2, (this.min.y + this.max.y) / 2, t);
    },
    getBottomLeft: function () {
      return new B(this.min.x, this.max.y);
    },
    getTopRight: function () {
      return new B(this.max.x, this.min.y);
    },
    getTopLeft: function () {
      return this.min;
    },
    getBottomRight: function () {
      return this.max;
    },
    getSize: function () {
      return this.max.subtract(this.min);
    },
    contains: function (t) {
      var i, e;
      return (t = "number" == typeof t[0] || t instanceof B ? I(t) : R(t)) instanceof O ? (i = t.min, e = t.max) : i = e = t, i.x >= this.min.x && e.x <= this.max.x && i.y >= this.min.y && e.y <= this.max.y;
    },
    intersects: function (t) {
      t = R(t);
      var i = this.min,
          e = this.max,
          n = t.min,
          o = t.max,
          s = o.x >= i.x && n.x <= e.x,
          r = o.y >= i.y && n.y <= e.y;
      return s && r;
    },
    overlaps: function (t) {
      t = R(t);
      var i = this.min,
          e = this.max,
          n = t.min,
          o = t.max,
          s = o.x > i.x && n.x < e.x,
          r = o.y > i.y && n.y < e.y;
      return s && r;
    },
    isValid: function () {
      return !(!this.min || !this.max);
    }
  }, N.prototype = {
    extend: function (t) {
      var i,
          e,
          n = this._southWest,
          o = this._northEast;
      if (t instanceof j) e = i = t;else {
        if (!(t instanceof N)) return t ? this.extend(W(t) || D(t)) : this;
        if (i = t._southWest, e = t._northEast, !i || !e) return this;
      }
      return n || o ? (n.lat = Math.min(i.lat, n.lat), n.lng = Math.min(i.lng, n.lng), o.lat = Math.max(e.lat, o.lat), o.lng = Math.max(e.lng, o.lng)) : (this._southWest = new j(i.lat, i.lng), this._northEast = new j(e.lat, e.lng)), this;
    },
    pad: function (t) {
      var i = this._southWest,
          e = this._northEast,
          n = Math.abs(i.lat - e.lat) * t,
          o = Math.abs(i.lng - e.lng) * t;
      return new N(new j(i.lat - n, i.lng - o), new j(e.lat + n, e.lng + o));
    },
    getCenter: function () {
      return new j((this._southWest.lat + this._northEast.lat) / 2, (this._southWest.lng + this._northEast.lng) / 2);
    },
    getSouthWest: function () {
      return this._southWest;
    },
    getNorthEast: function () {
      return this._northEast;
    },
    getNorthWest: function () {
      return new j(this.getNorth(), this.getWest());
    },
    getSouthEast: function () {
      return new j(this.getSouth(), this.getEast());
    },
    getWest: function () {
      return this._southWest.lng;
    },
    getSouth: function () {
      return this._southWest.lat;
    },
    getEast: function () {
      return this._northEast.lng;
    },
    getNorth: function () {
      return this._northEast.lat;
    },
    contains: function (t) {
      t = "number" == typeof t[0] || t instanceof j || "lat" in t ? W(t) : D(t);
      var i,
          e,
          n = this._southWest,
          o = this._northEast;
      return t instanceof N ? (i = t.getSouthWest(), e = t.getNorthEast()) : i = e = t, i.lat >= n.lat && e.lat <= o.lat && i.lng >= n.lng && e.lng <= o.lng;
    },
    intersects: function (t) {
      t = D(t);
      var i = this._southWest,
          e = this._northEast,
          n = t.getSouthWest(),
          o = t.getNorthEast(),
          s = o.lat >= i.lat && n.lat <= e.lat,
          r = o.lng >= i.lng && n.lng <= e.lng;
      return s && r;
    },
    overlaps: function (t) {
      t = D(t);
      var i = this._southWest,
          e = this._northEast,
          n = t.getSouthWest(),
          o = t.getNorthEast(),
          s = o.lat > i.lat && n.lat < e.lat,
          r = o.lng > i.lng && n.lng < e.lng;
      return s && r;
    },
    toBBoxString: function () {
      return [this.getWest(), this.getSouth(), this.getEast(), this.getNorth()].join(",");
    },
    equals: function (t, i) {
      return !!t && (t = D(t), this._southWest.equals(t.getSouthWest(), i) && this._northEast.equals(t.getNorthEast(), i));
    },
    isValid: function () {
      return !(!this._southWest || !this._northEast);
    }
  };
  var H,
      F = {
    latLngToPoint: function (t, i) {
      var e = this.projection.project(t),
          n = this.scale(i);
      return this.transformation._transform(e, n);
    },
    pointToLatLng: function (t, i) {
      var e = this.scale(i),
          n = this.transformation.untransform(t, e);
      return this.projection.unproject(n);
    },
    project: function (t) {
      return this.projection.project(t);
    },
    unproject: function (t) {
      return this.projection.unproject(t);
    },
    scale: function (t) {
      return 256 * Math.pow(2, t);
    },
    zoom: function (t) {
      return Math.log(t / 256) / Math.LN2;
    },
    getProjectedBounds: function (t) {
      if (this.infinite) return null;
      var i = this.projection.bounds,
          e = this.scale(t);
      return new O(this.transformation.transform(i.min, e), this.transformation.transform(i.max, e));
    },
    infinite: !(j.prototype = {
      equals: function (t, i) {
        return !!t && (t = W(t), Math.max(Math.abs(this.lat - t.lat), Math.abs(this.lng - t.lng)) <= (void 0 === i ? 1e-9 : i));
      },
      toString: function (t) {
        return "LatLng(" + c(this.lat, t) + ", " + c(this.lng, t) + ")";
      },
      distanceTo: function (t) {
        return U.distance(this, W(t));
      },
      wrap: function () {
        return U.wrapLatLng(this);
      },
      toBounds: function (t) {
        var i = 180 * t / 40075017,
            e = i / Math.cos(Math.PI / 180 * this.lat);
        return D([this.lat - i, this.lng - e], [this.lat + i, this.lng + e]);
      },
      clone: function () {
        return new j(this.lat, this.lng, this.alt);
      }
    }),
    wrapLatLng: function (t) {
      var i = this.wrapLng ? r(t.lng, this.wrapLng, !0) : t.lng;
      return new j(this.wrapLat ? r(t.lat, this.wrapLat, !0) : t.lat, i, t.alt);
    },
    wrapLatLngBounds: function (t) {
      var i = t.getCenter(),
          e = this.wrapLatLng(i),
          n = i.lat - e.lat,
          o = i.lng - e.lng;
      if (0 == n && 0 == o) return t;
      var s = t.getSouthWest(),
          r = t.getNorthEast();
      return new N(new j(s.lat - n, s.lng - o), new j(r.lat - n, r.lng - o));
    }
  },
      U = h({}, F, {
    wrapLng: [-180, 180],
    R: 6371e3,
    distance: function (t, i) {
      var e = Math.PI / 180,
          n = t.lat * e,
          o = i.lat * e,
          s = Math.sin((i.lat - t.lat) * e / 2),
          r = Math.sin((i.lng - t.lng) * e / 2),
          a = s * s + Math.cos(n) * Math.cos(o) * r * r,
          h = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return this.R * h;
    }
  }),
      V = 6378137,
      q = {
    R: V,
    MAX_LATITUDE: 85.0511287798,
    project: function (t) {
      var i = Math.PI / 180,
          e = this.MAX_LATITUDE,
          n = Math.max(Math.min(e, t.lat), -e),
          o = Math.sin(n * i);
      return new B(this.R * t.lng * i, this.R * Math.log((1 + o) / (1 - o)) / 2);
    },
    unproject: function (t) {
      var i = 180 / Math.PI;
      return new j((2 * Math.atan(Math.exp(t.y / this.R)) - Math.PI / 2) * i, t.x * i / this.R);
    },
    bounds: (H = V * Math.PI, new O([-H, -H], [H, H]))
  };

  function G(t, i, e, n) {
    if (v(t)) return this._a = t[0], this._b = t[1], this._c = t[2], void (this._d = t[3]);
    this._a = t, this._b = i, this._c = e, this._d = n;
  }

  function K(t, i, e, n) {
    return new G(t, i, e, n);
  }

  G.prototype = {
    transform: function (t, i) {
      return this._transform(t.clone(), i);
    },
    _transform: function (t, i) {
      return i = i || 1, t.x = i * (this._a * t.x + this._b), t.y = i * (this._c * t.y + this._d), t;
    },
    untransform: function (t, i) {
      return i = i || 1, new B((t.x / i - this._b) / this._a, (t.y / i - this._d) / this._c);
    }
  };
  var Y,
      X = h({}, U, {
    code: "EPSG:3857",
    projection: q,
    transformation: (Y = .5 / (Math.PI * q.R), K(Y, .5, -Y, .5))
  }),
      J = h({}, X, {
    code: "EPSG:900913"
  });

  function $(t) {
    return document.createElementNS("http://www.w3.org/2000/svg", t);
  }

  function Q(t, i) {
    var e,
        n,
        o,
        s,
        r,
        a,
        h = "";

    for (e = 0, o = t.length; e < o; e++) {
      for (n = 0, s = (r = t[e]).length; n < s; n++) h += (n ? "L" : "M") + (a = r[n]).x + " " + a.y;

      h += i ? Zt ? "z" : "x" : "";
    }

    return h || "M0 0";
  }

  var tt = document.documentElement.style,
      it = "ActiveXObject" in window,
      et = it && !document.addEventListener,
      nt = "msLaunchUri" in navigator && !("documentMode" in document),
      ot = kt("webkit"),
      st = kt("android"),
      rt = kt("android 2") || kt("android 3"),
      at = parseInt(/WebKit\/([0-9]+)|$/.exec(navigator.userAgent)[1], 10),
      ht = st && kt("Google") && at < 537 && !("AudioNode" in window),
      ut = !!window.opera,
      lt = kt("chrome"),
      ct = kt("gecko") && !ot && !ut && !it,
      _t = !lt && kt("safari"),
      dt = kt("phantom"),
      pt = "OTransition" in tt,
      mt = 0 === navigator.platform.indexOf("Win"),
      ft = it && "transition" in tt,
      gt = "WebKitCSSMatrix" in window && "m11" in new window.WebKitCSSMatrix() && !rt,
      vt = "MozPerspective" in tt,
      yt = !window.L_DISABLE_3D && (ft || gt || vt) && !pt && !dt,
      xt = "undefined" != typeof orientation || kt("mobile"),
      wt = xt && ot,
      Pt = xt && gt,
      Lt = !window.PointerEvent && window.MSPointerEvent,
      bt = !(!window.PointerEvent && !Lt),
      Tt = !window.L_NO_TOUCH && (bt || "ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch),
      zt = xt && ut,
      Mt = xt && ct,
      Ct = 1 < (window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI),
      St = !!document.createElement("canvas").getContext,
      Zt = !(!document.createElementNS || !$("svg").createSVGRect),
      Et = !Zt && function () {
    try {
      var t = document.createElement("div");
      t.innerHTML = '<v:shape adj="1"/>';
      var i = t.firstChild;
      return i.style.behavior = "url(#default#VML)", i && "object" == typeof i.adj;
    } catch (t) {
      return !1;
    }
  }();

  function kt(t) {
    return 0 <= navigator.userAgent.toLowerCase().indexOf(t);
  }

  var Bt = (Object.freeze || Object)({
    ie: it,
    ielt9: et,
    edge: nt,
    webkit: ot,
    android: st,
    android23: rt,
    androidStock: ht,
    opera: ut,
    chrome: lt,
    gecko: ct,
    safari: _t,
    phantom: dt,
    opera12: pt,
    win: mt,
    ie3d: ft,
    webkit3d: gt,
    gecko3d: vt,
    any3d: yt,
    mobile: xt,
    mobileWebkit: wt,
    mobileWebkit3d: Pt,
    msPointer: Lt,
    pointer: bt,
    touch: Tt,
    mobileOpera: zt,
    mobileGecko: Mt,
    retina: Ct,
    canvas: St,
    svg: Zt,
    vml: Et
  }),
      At = Lt ? "MSPointerDown" : "pointerdown",
      It = Lt ? "MSPointerMove" : "pointermove",
      Ot = Lt ? "MSPointerUp" : "pointerup",
      Rt = Lt ? "MSPointerCancel" : "pointercancel",
      Nt = ["INPUT", "SELECT", "OPTION"],
      Dt = {},
      jt = !1,
      Wt = 0;

  function Ht(t, i, e, n) {
    return "touchstart" === i ? function (t, i, e) {
      var n = a(function (t) {
        if ("mouse" !== t.pointerType && t.MSPOINTER_TYPE_MOUSE && t.pointerType !== t.MSPOINTER_TYPE_MOUSE) {
          if (!(Nt.indexOf(t.target.tagName) < 0)) return;
          Di(t);
        }

        qt(t, i);
      });
      t["_leaflet_touchstart" + e] = n, t.addEventListener(At, n, !1), jt || (document.documentElement.addEventListener(At, Ft, !0), document.documentElement.addEventListener(It, Ut, !0), document.documentElement.addEventListener(Ot, Vt, !0), document.documentElement.addEventListener(Rt, Vt, !0), jt = !0);
    }(t, e, n) : "touchmove" === i ? function (t, i, e) {
      var n = function (t) {
        (t.pointerType !== t.MSPOINTER_TYPE_MOUSE && "mouse" !== t.pointerType || 0 !== t.buttons) && qt(t, i);
      };

      t["_leaflet_touchmove" + e] = n, t.addEventListener(It, n, !1);
    }(t, e, n) : "touchend" === i && function (t, i, e) {
      var n = function (t) {
        qt(t, i);
      };

      t["_leaflet_touchend" + e] = n, t.addEventListener(Ot, n, !1), t.addEventListener(Rt, n, !1);
    }(t, e, n), this;
  }

  function Ft(t) {
    Dt[t.pointerId] = t, Wt++;
  }

  function Ut(t) {
    Dt[t.pointerId] && (Dt[t.pointerId] = t);
  }

  function Vt(t) {
    delete Dt[t.pointerId], Wt--;
  }

  function qt(t, i) {
    for (var e in t.touches = [], Dt) t.touches.push(Dt[e]);

    t.changedTouches = [t], i(t);
  }

  var Gt = Lt ? "MSPointerDown" : bt ? "pointerdown" : "touchstart",
      Kt = Lt ? "MSPointerUp" : bt ? "pointerup" : "touchend",
      Yt = "_leaflet_";

  function Xt(t, o, i) {
    var s,
        r,
        a = !1;

    function e(t) {
      var i;

      if (bt) {
        if (!nt || "mouse" === t.pointerType) return;
        i = Wt;
      } else i = t.touches.length;

      if (!(1 < i)) {
        var e = Date.now(),
            n = e - (s || e);
        r = t.touches ? t.touches[0] : t, a = 0 < n && n <= 250, s = e;
      }
    }

    function n(t) {
      if (a && !r.cancelBubble) {
        if (bt) {
          if (!nt || "mouse" === t.pointerType) return;
          var i,
              e,
              n = {};

          for (e in r) i = r[e], n[e] = i && i.bind ? i.bind(r) : i;

          r = n;
        }

        r.type = "dblclick", r.button = 0, o(r), s = null;
      }
    }

    return t[Yt + Gt + i] = e, t[Yt + Kt + i] = n, t[Yt + "dblclick" + i] = o, t.addEventListener(Gt, e, !1), t.addEventListener(Kt, n, !1), t.addEventListener("dblclick", o, !1), this;
  }

  function Jt(t, i) {
    var e = t[Yt + Gt + i],
        n = t[Yt + Kt + i],
        o = t[Yt + "dblclick" + i];
    return t.removeEventListener(Gt, e, !1), t.removeEventListener(Kt, n, !1), nt || t.removeEventListener("dblclick", o, !1), this;
  }

  var $t,
      Qt,
      ti,
      ii,
      ei,
      ni = yi(["transform", "webkitTransform", "OTransform", "MozTransform", "msTransform"]),
      oi = yi(["webkitTransition", "transition", "OTransition", "MozTransition", "msTransition"]),
      si = "webkitTransition" === oi || "OTransition" === oi ? oi + "End" : "transitionend";

  function ri(t) {
    return "string" == typeof t ? document.getElementById(t) : t;
  }

  function ai(t, i) {
    var e = t.style[i] || t.currentStyle && t.currentStyle[i];

    if ((!e || "auto" === e) && document.defaultView) {
      var n = document.defaultView.getComputedStyle(t, null);
      e = n ? n[i] : null;
    }

    return "auto" === e ? null : e;
  }

  function hi(t, i, e) {
    var n = document.createElement(t);
    return n.className = i || "", e && e.appendChild(n), n;
  }

  function ui(t) {
    var i = t.parentNode;
    i && i.removeChild(t);
  }

  function li(t) {
    for (; t.firstChild;) t.removeChild(t.firstChild);
  }

  function ci(t) {
    var i = t.parentNode;
    i && i.lastChild !== t && i.appendChild(t);
  }

  function _i(t) {
    var i = t.parentNode;
    i && i.firstChild !== t && i.insertBefore(t, i.firstChild);
  }

  function di(t, i) {
    if (void 0 !== t.classList) return t.classList.contains(i);
    var e = gi(t);
    return 0 < e.length && new RegExp("(^|\\s)" + i + "(\\s|$)").test(e);
  }

  function pi(t, i) {
    if (void 0 !== t.classList) for (var e = d(i), n = 0, o = e.length; n < o; n++) t.classList.add(e[n]);else if (!di(t, i)) {
      var s = gi(t);
      fi(t, (s ? s + " " : "") + i);
    }
  }

  function mi(t, i) {
    void 0 !== t.classList ? t.classList.remove(i) : fi(t, _((" " + gi(t) + " ").replace(" " + i + " ", " ")));
  }

  function fi(t, i) {
    void 0 === t.className.baseVal ? t.className = i : t.className.baseVal = i;
  }

  function gi(t) {
    return t.correspondingElement && (t = t.correspondingElement), void 0 === t.className.baseVal ? t.className : t.className.baseVal;
  }

  function vi(t, i) {
    "opacity" in t.style ? t.style.opacity = i : "filter" in t.style && function (t, i) {
      var e = !1,
          n = "DXImageTransform.Microsoft.Alpha";

      try {
        e = t.filters.item(n);
      } catch (t) {
        if (1 === i) return;
      }

      i = Math.round(100 * i), e ? (e.Enabled = 100 !== i, e.Opacity = i) : t.style.filter += " progid:" + n + "(opacity=" + i + ")";
    }(t, i);
  }

  function yi(t) {
    for (var i = document.documentElement.style, e = 0; e < t.length; e++) if (t[e] in i) return t[e];

    return !1;
  }

  function xi(t, i, e) {
    var n = i || new B(0, 0);
    t.style[ni] = (ft ? "translate(" + n.x + "px," + n.y + "px)" : "translate3d(" + n.x + "px," + n.y + "px,0)") + (e ? " scale(" + e + ")" : "");
  }

  function wi(t, i) {
    t._leaflet_pos = i, yt ? xi(t, i) : (t.style.left = i.x + "px", t.style.top = i.y + "px");
  }

  function Pi(t) {
    return t._leaflet_pos || new B(0, 0);
  }

  if ("onselectstart" in document) $t = function () {
    Ei(window, "selectstart", Di);
  }, Qt = function () {
    Bi(window, "selectstart", Di);
  };else {
    var Li = yi(["userSelect", "WebkitUserSelect", "OUserSelect", "MozUserSelect", "msUserSelect"]);
    $t = function () {
      if (Li) {
        var t = document.documentElement.style;
        ti = t[Li], t[Li] = "none";
      }
    }, Qt = function () {
      Li && (document.documentElement.style[Li] = ti, ti = void 0);
    };
  }

  function bi() {
    Ei(window, "dragstart", Di);
  }

  function Ti() {
    Bi(window, "dragstart", Di);
  }

  function zi(t) {
    for (; -1 === t.tabIndex;) t = t.parentNode;

    t.style && (Mi(), ei = (ii = t).style.outline, t.style.outline = "none", Ei(window, "keydown", Mi));
  }

  function Mi() {
    ii && (ii.style.outline = ei, ei = ii = void 0, Bi(window, "keydown", Mi));
  }

  function Ci(t) {
    for (; !((t = t.parentNode).offsetWidth && t.offsetHeight || t === document.body););

    return t;
  }

  function Si(t) {
    var i = t.getBoundingClientRect();
    return {
      x: i.width / t.offsetWidth || 1,
      y: i.height / t.offsetHeight || 1,
      boundingClientRect: i
    };
  }

  var Zi = (Object.freeze || Object)({
    TRANSFORM: ni,
    TRANSITION: oi,
    TRANSITION_END: si,
    get: ri,
    getStyle: ai,
    create: hi,
    remove: ui,
    empty: li,
    toFront: ci,
    toBack: _i,
    hasClass: di,
    addClass: pi,
    removeClass: mi,
    setClass: fi,
    getClass: gi,
    setOpacity: vi,
    testProp: yi,
    setTransform: xi,
    setPosition: wi,
    getPosition: Pi,
    disableTextSelection: $t,
    enableTextSelection: Qt,
    disableImageDrag: bi,
    enableImageDrag: Ti,
    preventOutline: zi,
    restoreOutline: Mi,
    getSizedParentNode: Ci,
    getScale: Si
  });

  function Ei(t, i, e, n) {
    if ("object" == typeof i) for (var o in i) Ai(t, o, i[o], e);else for (var s = 0, r = (i = d(i)).length; s < r; s++) Ai(t, i[s], e, n);
    return this;
  }

  var ki = "_leaflet_events";

  function Bi(t, i, e, n) {
    if ("object" == typeof i) for (var o in i) Ii(t, o, i[o], e);else if (i) for (var s = 0, r = (i = d(i)).length; s < r; s++) Ii(t, i[s], e, n);else {
      for (var a in t[ki]) Ii(t, a, t[ki][a]);

      delete t[ki];
    }
    return this;
  }

  function Ai(i, t, e, n) {
    var o = t + u(e) + (n ? "_" + u(n) : "");
    if (i[ki] && i[ki][o]) return this;

    var s = function (t) {
      return e.call(n || i, t || window.event);
    },
        r = s;

    bt && 0 === t.indexOf("touch") ? Ht(i, t, s, o) : !Tt || "dblclick" !== t || bt && lt ? "addEventListener" in i ? "mousewheel" === t ? i.addEventListener("onwheel" in i ? "wheel" : "mousewheel", s, !1) : "mouseenter" === t || "mouseleave" === t ? (s = function (t) {
      t = t || window.event, Ki(i, t) && r(t);
    }, i.addEventListener("mouseenter" === t ? "mouseover" : "mouseout", s, !1)) : ("click" === t && st && (s = function (t) {
      !function (t, i) {
        var e = t.timeStamp || t.originalEvent && t.originalEvent.timeStamp,
            n = Ui && e - Ui;
        if (n && 100 < n && n < 500 || t.target._simulatedClick && !t._simulated) return ji(t);
        Ui = e, i(t);
      }(t, r);
    }), i.addEventListener(t, s, !1)) : "attachEvent" in i && i.attachEvent("on" + t, s) : Xt(i, s, o), i[ki] = i[ki] || {}, i[ki][o] = s;
  }

  function Ii(t, i, e, n) {
    var o = i + u(e) + (n ? "_" + u(n) : ""),
        s = t[ki] && t[ki][o];
    if (!s) return this;
    bt && 0 === i.indexOf("touch") ? function (t, i, e) {
      var n = t["_leaflet_" + i + e];
      "touchstart" === i ? t.removeEventListener(At, n, !1) : "touchmove" === i ? t.removeEventListener(It, n, !1) : "touchend" === i && (t.removeEventListener(Ot, n, !1), t.removeEventListener(Rt, n, !1));
    }(t, i, o) : !Tt || "dblclick" !== i || bt && lt ? "removeEventListener" in t ? "mousewheel" === i ? t.removeEventListener("onwheel" in t ? "wheel" : "mousewheel", s, !1) : t.removeEventListener("mouseenter" === i ? "mouseover" : "mouseleave" === i ? "mouseout" : i, s, !1) : "detachEvent" in t && t.detachEvent("on" + i, s) : Jt(t, o), t[ki][o] = null;
  }

  function Oi(t) {
    return t.stopPropagation ? t.stopPropagation() : t.originalEvent ? t.originalEvent._stopped = !0 : t.cancelBubble = !0, Gi(t), this;
  }

  function Ri(t) {
    return Ai(t, "mousewheel", Oi), this;
  }

  function Ni(t) {
    return Ei(t, "mousedown touchstart dblclick", Oi), Ai(t, "click", qi), this;
  }

  function Di(t) {
    return t.preventDefault ? t.preventDefault() : t.returnValue = !1, this;
  }

  function ji(t) {
    return Di(t), Oi(t), this;
  }

  function Wi(t, i) {
    if (!i) return new B(t.clientX, t.clientY);
    var e = Si(i),
        n = e.boundingClientRect;
    return new B((t.clientX - n.left) / e.x - i.clientLeft, (t.clientY - n.top) / e.y - i.clientTop);
  }

  var Hi = mt && lt ? 2 * window.devicePixelRatio : ct ? window.devicePixelRatio : 1;

  function Fi(t) {
    return nt ? t.wheelDeltaY / 2 : t.deltaY && 0 === t.deltaMode ? -t.deltaY / Hi : t.deltaY && 1 === t.deltaMode ? 20 * -t.deltaY : t.deltaY && 2 === t.deltaMode ? 60 * -t.deltaY : t.deltaX || t.deltaZ ? 0 : t.wheelDelta ? (t.wheelDeltaY || t.wheelDelta) / 2 : t.detail && Math.abs(t.detail) < 32765 ? 20 * -t.detail : t.detail ? t.detail / -32765 * 60 : 0;
  }

  var Ui,
      Vi = {};

  function qi(t) {
    Vi[t.type] = !0;
  }

  function Gi(t) {
    var i = Vi[t.type];
    return Vi[t.type] = !1, i;
  }

  function Ki(t, i) {
    var e = i.relatedTarget;
    if (!e) return !0;

    try {
      for (; e && e !== t;) e = e.parentNode;
    } catch (t) {
      return !1;
    }

    return e !== t;
  }

  var Yi = (Object.freeze || Object)({
    on: Ei,
    off: Bi,
    stopPropagation: Oi,
    disableScrollPropagation: Ri,
    disableClickPropagation: Ni,
    preventDefault: Di,
    stop: ji,
    getMousePosition: Wi,
    getWheelDelta: Fi,
    fakeStop: qi,
    skipped: Gi,
    isExternalTarget: Ki,
    addListener: Ei,
    removeListener: Bi
  }),
      Xi = k.extend({
    run: function (t, i, e, n) {
      this.stop(), this._el = t, this._inProgress = !0, this._duration = e || .25, this._easeOutPower = 1 / Math.max(n || .5, .2), this._startPos = Pi(t), this._offset = i.subtract(this._startPos), this._startTime = +new Date(), this.fire("start"), this._animate();
    },
    stop: function () {
      this._inProgress && (this._step(!0), this._complete());
    },
    _animate: function () {
      this._animId = M(this._animate, this), this._step();
    },
    _step: function (t) {
      var i = +new Date() - this._startTime,
          e = 1e3 * this._duration;
      i < e ? this._runFrame(this._easeOut(i / e), t) : (this._runFrame(1), this._complete());
    },
    _runFrame: function (t, i) {
      var e = this._startPos.add(this._offset.multiplyBy(t));

      i && e._round(), wi(this._el, e), this.fire("step");
    },
    _complete: function () {
      C(this._animId), this._inProgress = !1, this.fire("end");
    },
    _easeOut: function (t) {
      return 1 - Math.pow(1 - t, this._easeOutPower);
    }
  }),
      Ji = k.extend({
    options: {
      crs: X,
      center: void 0,
      zoom: void 0,
      minZoom: void 0,
      maxZoom: void 0,
      layers: [],
      maxBounds: void 0,
      renderer: void 0,
      zoomAnimation: !0,
      zoomAnimationThreshold: 4,
      fadeAnimation: !0,
      markerZoomAnimation: !0,
      transform3DLimit: 8388608,
      zoomSnap: 1,
      zoomDelta: 1,
      trackResize: !0
    },
    initialize: function (t, i) {
      i = p(this, i), this._handlers = [], this._layers = {}, this._zoomBoundLayers = {}, this._sizeChanged = !0, this._initContainer(t), this._initLayout(), this._onResize = a(this._onResize, this), this._initEvents(), i.maxBounds && this.setMaxBounds(i.maxBounds), void 0 !== i.zoom && (this._zoom = this._limitZoom(i.zoom)), i.center && void 0 !== i.zoom && this.setView(W(i.center), i.zoom, {
        reset: !0
      }), this.callInitHooks(), this._zoomAnimated = oi && yt && !zt && this.options.zoomAnimation, this._zoomAnimated && (this._createAnimProxy(), Ei(this._proxy, si, this._catchTransitionEnd, this)), this._addLayers(this.options.layers);
    },
    setView: function (t, i, e) {
      if ((i = void 0 === i ? this._zoom : this._limitZoom(i), t = this._limitCenter(W(t), i, this.options.maxBounds), e = e || {}, this._stop(), this._loaded && !e.reset && !0 !== e) && (void 0 !== e.animate && (e.zoom = h({
        animate: e.animate
      }, e.zoom), e.pan = h({
        animate: e.animate,
        duration: e.duration
      }, e.pan)), this._zoom !== i ? this._tryAnimatedZoom && this._tryAnimatedZoom(t, i, e.zoom) : this._tryAnimatedPan(t, e.pan))) return clearTimeout(this._sizeTimer), this;
      return this._resetView(t, i), this;
    },
    setZoom: function (t, i) {
      return this._loaded ? this.setView(this.getCenter(), t, {
        zoom: i
      }) : (this._zoom = t, this);
    },
    zoomIn: function (t, i) {
      return t = t || (yt ? this.options.zoomDelta : 1), this.setZoom(this._zoom + t, i);
    },
    zoomOut: function (t, i) {
      return t = t || (yt ? this.options.zoomDelta : 1), this.setZoom(this._zoom - t, i);
    },
    setZoomAround: function (t, i, e) {
      var n = this.getZoomScale(i),
          o = this.getSize().divideBy(2),
          s = (t instanceof B ? t : this.latLngToContainerPoint(t)).subtract(o).multiplyBy(1 - 1 / n),
          r = this.containerPointToLatLng(o.add(s));
      return this.setView(r, i, {
        zoom: e
      });
    },
    _getBoundsCenterZoom: function (t, i) {
      i = i || {}, t = t.getBounds ? t.getBounds() : D(t);
      var e = I(i.paddingTopLeft || i.padding || [0, 0]),
          n = I(i.paddingBottomRight || i.padding || [0, 0]),
          o = this.getBoundsZoom(t, !1, e.add(n));
      if ((o = "number" == typeof i.maxZoom ? Math.min(i.maxZoom, o) : o) === 1 / 0) return {
        center: t.getCenter(),
        zoom: o
      };
      var s = n.subtract(e).divideBy(2),
          r = this.project(t.getSouthWest(), o),
          a = this.project(t.getNorthEast(), o);
      return {
        center: this.unproject(r.add(a).divideBy(2).add(s), o),
        zoom: o
      };
    },
    fitBounds: function (t, i) {
      if (!(t = D(t)).isValid()) throw new Error("Bounds are not valid.");

      var e = this._getBoundsCenterZoom(t, i);

      return this.setView(e.center, e.zoom, i);
    },
    fitWorld: function (t) {
      return this.fitBounds([[-90, -180], [90, 180]], t);
    },
    panTo: function (t, i) {
      return this.setView(t, this._zoom, {
        pan: i
      });
    },
    panBy: function (t, i) {
      if (i = i || {}, !(t = I(t).round()).x && !t.y) return this.fire("moveend");
      if (!0 !== i.animate && !this.getSize().contains(t)) return this._resetView(this.unproject(this.project(this.getCenter()).add(t)), this.getZoom()), this;

      if (this._panAnim || (this._panAnim = new Xi(), this._panAnim.on({
        step: this._onPanTransitionStep,
        end: this._onPanTransitionEnd
      }, this)), i.noMoveStart || this.fire("movestart"), !1 !== i.animate) {
        pi(this._mapPane, "leaflet-pan-anim");

        var e = this._getMapPanePos().subtract(t).round();

        this._panAnim.run(this._mapPane, e, i.duration || .25, i.easeLinearity);
      } else this._rawPanBy(t), this.fire("move").fire("moveend");

      return this;
    },
    flyTo: function (n, o, t) {
      if (!1 === (t = t || {}).animate || !yt) return this.setView(n, o, t);

      this._stop();

      var s = this.project(this.getCenter()),
          r = this.project(n),
          i = this.getSize(),
          a = this._zoom;
      n = W(n), o = void 0 === o ? a : o;

      var h = Math.max(i.x, i.y),
          u = h * this.getZoomScale(a, o),
          l = r.distanceTo(s) || 1,
          c = 1.42,
          _ = c * c;

      function e(t) {
        var i = (u * u - h * h + (t ? -1 : 1) * _ * _ * l * l) / (2 * (t ? u : h) * _ * l),
            e = Math.sqrt(i * i + 1) - i;
        return e < 1e-9 ? -18 : Math.log(e);
      }

      function d(t) {
        return (Math.exp(t) - Math.exp(-t)) / 2;
      }

      function p(t) {
        return (Math.exp(t) + Math.exp(-t)) / 2;
      }

      var m = e(0);

      function f(t) {
        return h * (p(m) * function (t) {
          return d(t) / p(t);
        }(m + c * t) - d(m)) / _;
      }

      var g = Date.now(),
          v = (e(1) - m) / c,
          y = t.duration ? 1e3 * t.duration : 1e3 * v * .8;
      return this._moveStart(!0, t.noMoveStart), function t() {
        var i = (Date.now() - g) / y,
            e = function (t) {
          return 1 - Math.pow(1 - t, 1.5);
        }(i) * v;

        i <= 1 ? (this._flyToFrame = M(t, this), this._move(this.unproject(s.add(r.subtract(s).multiplyBy(f(e) / l)), a), this.getScaleZoom(h / function (t) {
          return h * (p(m) / p(m + c * t));
        }(e), a), {
          flyTo: !0
        })) : this._move(n, o)._moveEnd(!0);
      }.call(this), this;
    },
    flyToBounds: function (t, i) {
      var e = this._getBoundsCenterZoom(t, i);

      return this.flyTo(e.center, e.zoom, i);
    },
    setMaxBounds: function (t) {
      return (t = D(t)).isValid() ? (this.options.maxBounds && this.off("moveend", this._panInsideMaxBounds), this.options.maxBounds = t, this._loaded && this._panInsideMaxBounds(), this.on("moveend", this._panInsideMaxBounds)) : (this.options.maxBounds = null, this.off("moveend", this._panInsideMaxBounds));
    },
    setMinZoom: function (t) {
      var i = this.options.minZoom;
      return this.options.minZoom = t, this._loaded && i !== t && (this.fire("zoomlevelschange"), this.getZoom() < this.options.minZoom) ? this.setZoom(t) : this;
    },
    setMaxZoom: function (t) {
      var i = this.options.maxZoom;
      return this.options.maxZoom = t, this._loaded && i !== t && (this.fire("zoomlevelschange"), this.getZoom() > this.options.maxZoom) ? this.setZoom(t) : this;
    },
    panInsideBounds: function (t, i) {
      this._enforcingBounds = !0;

      var e = this.getCenter(),
          n = this._limitCenter(e, this._zoom, D(t));

      return e.equals(n) || this.panTo(n, i), this._enforcingBounds = !1, this;
    },
    panInside: function (t, i) {
      var e = I((i = i || {}).paddingTopLeft || i.padding || [0, 0]),
          n = I(i.paddingBottomRight || i.padding || [0, 0]),
          o = this.getCenter(),
          s = this.project(o),
          r = this.project(t),
          a = this.getPixelBounds(),
          h = a.getSize().divideBy(2),
          u = R([a.min.add(e), a.max.subtract(n)]);

      if (!u.contains(r)) {
        this._enforcingBounds = !0;
        var l = s.subtract(r),
            c = I(r.x + l.x, r.y + l.y);
        (r.x < u.min.x || r.x > u.max.x) && (c.x = s.x - l.x, 0 < l.x ? c.x += h.x - e.x : c.x -= h.x - n.x), (r.y < u.min.y || r.y > u.max.y) && (c.y = s.y - l.y, 0 < l.y ? c.y += h.y - e.y : c.y -= h.y - n.y), this.panTo(this.unproject(c), i), this._enforcingBounds = !1;
      }

      return this;
    },
    invalidateSize: function (t) {
      if (!this._loaded) return this;
      t = h({
        animate: !1,
        pan: !0
      }, !0 === t ? {
        animate: !0
      } : t);
      var i = this.getSize();
      this._sizeChanged = !0, this._lastCenter = null;
      var e = this.getSize(),
          n = i.divideBy(2).round(),
          o = e.divideBy(2).round(),
          s = n.subtract(o);
      return s.x || s.y ? (t.animate && t.pan ? this.panBy(s) : (t.pan && this._rawPanBy(s), this.fire("move"), t.debounceMoveend ? (clearTimeout(this._sizeTimer), this._sizeTimer = setTimeout(a(this.fire, this, "moveend"), 200)) : this.fire("moveend")), this.fire("resize", {
        oldSize: i,
        newSize: e
      })) : this;
    },
    stop: function () {
      return this.setZoom(this._limitZoom(this._zoom)), this.options.zoomSnap || this.fire("viewreset"), this._stop();
    },
    locate: function (t) {
      if (t = this._locateOptions = h({
        timeout: 1e4,
        watch: !1
      }, t), !("geolocation" in navigator)) return this._handleGeolocationError({
        code: 0,
        message: "Geolocation not supported."
      }), this;
      var i = a(this._handleGeolocationResponse, this),
          e = a(this._handleGeolocationError, this);
      return t.watch ? this._locationWatchId = navigator.geolocation.watchPosition(i, e, t) : navigator.geolocation.getCurrentPosition(i, e, t), this;
    },
    stopLocate: function () {
      return navigator.geolocation && navigator.geolocation.clearWatch && navigator.geolocation.clearWatch(this._locationWatchId), this._locateOptions && (this._locateOptions.setView = !1), this;
    },
    _handleGeolocationError: function (t) {
      var i = t.code,
          e = t.message || (1 === i ? "permission denied" : 2 === i ? "position unavailable" : "timeout");
      this._locateOptions.setView && !this._loaded && this.fitWorld(), this.fire("locationerror", {
        code: i,
        message: "Geolocation error: " + e + "."
      });
    },
    _handleGeolocationResponse: function (t) {
      var i = new j(t.coords.latitude, t.coords.longitude),
          e = i.toBounds(2 * t.coords.accuracy),
          n = this._locateOptions;

      if (n.setView) {
        var o = this.getBoundsZoom(e);
        this.setView(i, n.maxZoom ? Math.min(o, n.maxZoom) : o);
      }

      var s = {
        latlng: i,
        bounds: e,
        timestamp: t.timestamp
      };

      for (var r in t.coords) "number" == typeof t.coords[r] && (s[r] = t.coords[r]);

      this.fire("locationfound", s);
    },
    addHandler: function (t, i) {
      if (!i) return this;
      var e = this[t] = new i(this);
      return this._handlers.push(e), this.options[t] && e.enable(), this;
    },
    remove: function () {
      if (this._initEvents(!0), this._containerId !== this._container._leaflet_id) throw new Error("Map container is being reused by another instance");

      try {
        delete this._container._leaflet_id, delete this._containerId;
      } catch (t) {
        this._container._leaflet_id = void 0, this._containerId = void 0;
      }

      var t;

      for (t in void 0 !== this._locationWatchId && this.stopLocate(), this._stop(), ui(this._mapPane), this._clearControlPos && this._clearControlPos(), this._resizeRequest && (C(this._resizeRequest), this._resizeRequest = null), this._clearHandlers(), this._loaded && this.fire("unload"), this._layers) this._layers[t].remove();

      for (t in this._panes) ui(this._panes[t]);

      return this._layers = [], this._panes = [], delete this._mapPane, delete this._renderer, this;
    },
    createPane: function (t, i) {
      var e = hi("div", "leaflet-pane" + (t ? " leaflet-" + t.replace("Pane", "") + "-pane" : ""), i || this._mapPane);
      return t && (this._panes[t] = e), e;
    },
    getCenter: function () {
      return this._checkIfLoaded(), this._lastCenter && !this._moved() ? this._lastCenter : this.layerPointToLatLng(this._getCenterLayerPoint());
    },
    getZoom: function () {
      return this._zoom;
    },
    getBounds: function () {
      var t = this.getPixelBounds();
      return new N(this.unproject(t.getBottomLeft()), this.unproject(t.getTopRight()));
    },
    getMinZoom: function () {
      return void 0 === this.options.minZoom ? this._layersMinZoom || 0 : this.options.minZoom;
    },
    getMaxZoom: function () {
      return void 0 === this.options.maxZoom ? void 0 === this._layersMaxZoom ? 1 / 0 : this._layersMaxZoom : this.options.maxZoom;
    },
    getBoundsZoom: function (t, i, e) {
      t = D(t), e = I(e || [0, 0]);

      var n = this.getZoom() || 0,
          o = this.getMinZoom(),
          s = this.getMaxZoom(),
          r = t.getNorthWest(),
          a = t.getSouthEast(),
          h = this.getSize().subtract(e),
          u = R(this.project(a, n), this.project(r, n)).getSize(),
          l = yt ? this.options.zoomSnap : 1,
          c = h.x / u.x,
          _ = h.y / u.y,
          d = i ? Math.max(c, _) : Math.min(c, _);

      return n = this.getScaleZoom(d, n), l && (n = Math.round(n / (l / 100)) * (l / 100), n = i ? Math.ceil(n / l) * l : Math.floor(n / l) * l), Math.max(o, Math.min(s, n));
    },
    getSize: function () {
      return this._size && !this._sizeChanged || (this._size = new B(this._container.clientWidth || 0, this._container.clientHeight || 0), this._sizeChanged = !1), this._size.clone();
    },
    getPixelBounds: function (t, i) {
      var e = this._getTopLeftPoint(t, i);

      return new O(e, e.add(this.getSize()));
    },
    getPixelOrigin: function () {
      return this._checkIfLoaded(), this._pixelOrigin;
    },
    getPixelWorldBounds: function (t) {
      return this.options.crs.getProjectedBounds(void 0 === t ? this.getZoom() : t);
    },
    getPane: function (t) {
      return "string" == typeof t ? this._panes[t] : t;
    },
    getPanes: function () {
      return this._panes;
    },
    getContainer: function () {
      return this._container;
    },
    getZoomScale: function (t, i) {
      var e = this.options.crs;
      return i = void 0 === i ? this._zoom : i, e.scale(t) / e.scale(i);
    },
    getScaleZoom: function (t, i) {
      var e = this.options.crs;
      i = void 0 === i ? this._zoom : i;
      var n = e.zoom(t * e.scale(i));
      return isNaN(n) ? 1 / 0 : n;
    },
    project: function (t, i) {
      return i = void 0 === i ? this._zoom : i, this.options.crs.latLngToPoint(W(t), i);
    },
    unproject: function (t, i) {
      return i = void 0 === i ? this._zoom : i, this.options.crs.pointToLatLng(I(t), i);
    },
    layerPointToLatLng: function (t) {
      var i = I(t).add(this.getPixelOrigin());
      return this.unproject(i);
    },
    latLngToLayerPoint: function (t) {
      return this.project(W(t))._round()._subtract(this.getPixelOrigin());
    },
    wrapLatLng: function (t) {
      return this.options.crs.wrapLatLng(W(t));
    },
    wrapLatLngBounds: function (t) {
      return this.options.crs.wrapLatLngBounds(D(t));
    },
    distance: function (t, i) {
      return this.options.crs.distance(W(t), W(i));
    },
    containerPointToLayerPoint: function (t) {
      return I(t).subtract(this._getMapPanePos());
    },
    layerPointToContainerPoint: function (t) {
      return I(t).add(this._getMapPanePos());
    },
    containerPointToLatLng: function (t) {
      var i = this.containerPointToLayerPoint(I(t));
      return this.layerPointToLatLng(i);
    },
    latLngToContainerPoint: function (t) {
      return this.layerPointToContainerPoint(this.latLngToLayerPoint(W(t)));
    },
    mouseEventToContainerPoint: function (t) {
      return Wi(t, this._container);
    },
    mouseEventToLayerPoint: function (t) {
      return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(t));
    },
    mouseEventToLatLng: function (t) {
      return this.layerPointToLatLng(this.mouseEventToLayerPoint(t));
    },
    _initContainer: function (t) {
      var i = this._container = ri(t);
      if (!i) throw new Error("Map container not found.");
      if (i._leaflet_id) throw new Error("Map container is already initialized.");
      Ei(i, "scroll", this._onScroll, this), this._containerId = u(i);
    },
    _initLayout: function () {
      var t = this._container;
      this._fadeAnimated = this.options.fadeAnimation && yt, pi(t, "leaflet-container" + (Tt ? " leaflet-touch" : "") + (Ct ? " leaflet-retina" : "") + (et ? " leaflet-oldie" : "") + (_t ? " leaflet-safari" : "") + (this._fadeAnimated ? " leaflet-fade-anim" : ""));
      var i = ai(t, "position");
      "absolute" !== i && "relative" !== i && "fixed" !== i && (t.style.position = "relative"), this._initPanes(), this._initControlPos && this._initControlPos();
    },
    _initPanes: function () {
      var t = this._panes = {};
      this._paneRenderers = {}, this._mapPane = this.createPane("mapPane", this._container), wi(this._mapPane, new B(0, 0)), this.createPane("tilePane"), this.createPane("shadowPane"), this.createPane("overlayPane"), this.createPane("markerPane"), this.createPane("tooltipPane"), this.createPane("popupPane"), this.options.markerZoomAnimation || (pi(t.markerPane, "leaflet-zoom-hide"), pi(t.shadowPane, "leaflet-zoom-hide"));
    },
    _resetView: function (t, i) {
      wi(this._mapPane, new B(0, 0));
      var e = !this._loaded;
      this._loaded = !0, i = this._limitZoom(i), this.fire("viewprereset");
      var n = this._zoom !== i;
      this._moveStart(n, !1)._move(t, i)._moveEnd(n), this.fire("viewreset"), e && this.fire("load");
    },
    _moveStart: function (t, i) {
      return t && this.fire("zoomstart"), i || this.fire("movestart"), this;
    },
    _move: function (t, i, e) {
      void 0 === i && (i = this._zoom);
      var n = this._zoom !== i;
      return this._zoom = i, this._lastCenter = t, this._pixelOrigin = this._getNewPixelOrigin(t), (n || e && e.pinch) && this.fire("zoom", e), this.fire("move", e);
    },
    _moveEnd: function (t) {
      return t && this.fire("zoomend"), this.fire("moveend");
    },
    _stop: function () {
      return C(this._flyToFrame), this._panAnim && this._panAnim.stop(), this;
    },
    _rawPanBy: function (t) {
      wi(this._mapPane, this._getMapPanePos().subtract(t));
    },
    _getZoomSpan: function () {
      return this.getMaxZoom() - this.getMinZoom();
    },
    _panInsideMaxBounds: function () {
      this._enforcingBounds || this.panInsideBounds(this.options.maxBounds);
    },
    _checkIfLoaded: function () {
      if (!this._loaded) throw new Error("Set map center and zoom first.");
    },
    _initEvents: function (t) {
      this._targets = {};
      var i = t ? Bi : Ei;
      i((this._targets[u(this._container)] = this)._container, "click dblclick mousedown mouseup mouseover mouseout mousemove contextmenu keypress keydown keyup", this._handleDOMEvent, this), this.options.trackResize && i(window, "resize", this._onResize, this), yt && this.options.transform3DLimit && (t ? this.off : this.on).call(this, "moveend", this._onMoveEnd);
    },
    _onResize: function () {
      C(this._resizeRequest), this._resizeRequest = M(function () {
        this.invalidateSize({
          debounceMoveend: !0
        });
      }, this);
    },
    _onScroll: function () {
      this._container.scrollTop = 0, this._container.scrollLeft = 0;
    },
    _onMoveEnd: function () {
      var t = this._getMapPanePos();

      Math.max(Math.abs(t.x), Math.abs(t.y)) >= this.options.transform3DLimit && this._resetView(this.getCenter(), this.getZoom());
    },
    _findEventTargets: function (t, i) {
      for (var e, n = [], o = "mouseout" === i || "mouseover" === i, s = t.target || t.srcElement, r = !1; s;) {
        if ((e = this._targets[u(s)]) && ("click" === i || "preclick" === i) && !t._simulated && this._draggableMoved(e)) {
          r = !0;
          break;
        }

        if (e && e.listens(i, !0)) {
          if (o && !Ki(s, t)) break;
          if (n.push(e), o) break;
        }

        if (s === this._container) break;
        s = s.parentNode;
      }

      return n.length || r || o || !Ki(s, t) || (n = [this]), n;
    },
    _handleDOMEvent: function (t) {
      if (this._loaded && !Gi(t)) {
        var i = t.type;
        "mousedown" !== i && "keypress" !== i && "keyup" !== i && "keydown" !== i || zi(t.target || t.srcElement), this._fireDOMEvent(t, i);
      }
    },
    _mouseEvents: ["click", "dblclick", "mouseover", "mouseout", "contextmenu"],
    _fireDOMEvent: function (t, i, e) {
      if ("click" === t.type) {
        var n = h({}, t);
        n.type = "preclick", this._fireDOMEvent(n, n.type, e);
      }

      if (!t._stopped && (e = (e || []).concat(this._findEventTargets(t, i))).length) {
        var o = e[0];
        "contextmenu" === i && o.listens(i, !0) && Di(t);
        var s = {
          originalEvent: t
        };

        if ("keypress" !== t.type && "keydown" !== t.type && "keyup" !== t.type) {
          var r = o.getLatLng && (!o._radius || o._radius <= 10);
          s.containerPoint = r ? this.latLngToContainerPoint(o.getLatLng()) : this.mouseEventToContainerPoint(t), s.layerPoint = this.containerPointToLayerPoint(s.containerPoint), s.latlng = r ? o.getLatLng() : this.layerPointToLatLng(s.layerPoint);
        }

        for (var a = 0; a < e.length; a++) if (e[a].fire(i, s, !0), s.originalEvent._stopped || !1 === e[a].options.bubblingMouseEvents && -1 !== y(this._mouseEvents, i)) return;
      }
    },
    _draggableMoved: function (t) {
      return (t = t.dragging && t.dragging.enabled() ? t : this).dragging && t.dragging.moved() || this.boxZoom && this.boxZoom.moved();
    },
    _clearHandlers: function () {
      for (var t = 0, i = this._handlers.length; t < i; t++) this._handlers[t].disable();
    },
    whenReady: function (t, i) {
      return this._loaded ? t.call(i || this, {
        target: this
      }) : this.on("load", t, i), this;
    },
    _getMapPanePos: function () {
      return Pi(this._mapPane) || new B(0, 0);
    },
    _moved: function () {
      var t = this._getMapPanePos();

      return t && !t.equals([0, 0]);
    },
    _getTopLeftPoint: function (t, i) {
      return (t && void 0 !== i ? this._getNewPixelOrigin(t, i) : this.getPixelOrigin()).subtract(this._getMapPanePos());
    },
    _getNewPixelOrigin: function (t, i) {
      var e = this.getSize()._divideBy(2);

      return this.project(t, i)._subtract(e)._add(this._getMapPanePos())._round();
    },
    _latLngToNewLayerPoint: function (t, i, e) {
      var n = this._getNewPixelOrigin(e, i);

      return this.project(t, i)._subtract(n);
    },
    _latLngBoundsToNewLayerBounds: function (t, i, e) {
      var n = this._getNewPixelOrigin(e, i);

      return R([this.project(t.getSouthWest(), i)._subtract(n), this.project(t.getNorthWest(), i)._subtract(n), this.project(t.getSouthEast(), i)._subtract(n), this.project(t.getNorthEast(), i)._subtract(n)]);
    },
    _getCenterLayerPoint: function () {
      return this.containerPointToLayerPoint(this.getSize()._divideBy(2));
    },
    _getCenterOffset: function (t) {
      return this.latLngToLayerPoint(t).subtract(this._getCenterLayerPoint());
    },
    _limitCenter: function (t, i, e) {
      if (!e) return t;

      var n = this.project(t, i),
          o = this.getSize().divideBy(2),
          s = new O(n.subtract(o), n.add(o)),
          r = this._getBoundsOffset(s, e, i);

      return r.round().equals([0, 0]) ? t : this.unproject(n.add(r), i);
    },
    _limitOffset: function (t, i) {
      if (!i) return t;
      var e = this.getPixelBounds(),
          n = new O(e.min.add(t), e.max.add(t));
      return t.add(this._getBoundsOffset(n, i));
    },
    _getBoundsOffset: function (t, i, e) {
      var n = R(this.project(i.getNorthEast(), e), this.project(i.getSouthWest(), e)),
          o = n.min.subtract(t.min),
          s = n.max.subtract(t.max);
      return new B(this._rebound(o.x, -s.x), this._rebound(o.y, -s.y));
    },
    _rebound: function (t, i) {
      return 0 < t + i ? Math.round(t - i) / 2 : Math.max(0, Math.ceil(t)) - Math.max(0, Math.floor(i));
    },
    _limitZoom: function (t) {
      var i = this.getMinZoom(),
          e = this.getMaxZoom(),
          n = yt ? this.options.zoomSnap : 1;
      return n && (t = Math.round(t / n) * n), Math.max(i, Math.min(e, t));
    },
    _onPanTransitionStep: function () {
      this.fire("move");
    },
    _onPanTransitionEnd: function () {
      mi(this._mapPane, "leaflet-pan-anim"), this.fire("moveend");
    },
    _tryAnimatedPan: function (t, i) {
      var e = this._getCenterOffset(t)._trunc();

      return !(!0 !== (i && i.animate) && !this.getSize().contains(e)) && (this.panBy(e, i), !0);
    },
    _createAnimProxy: function () {
      var t = this._proxy = hi("div", "leaflet-proxy leaflet-zoom-animated");
      this._panes.mapPane.appendChild(t), this.on("zoomanim", function (t) {
        var i = ni,
            e = this._proxy.style[i];
        xi(this._proxy, this.project(t.center, t.zoom), this.getZoomScale(t.zoom, 1)), e === this._proxy.style[i] && this._animatingZoom && this._onZoomTransitionEnd();
      }, this), this.on("load moveend", function () {
        var t = this.getCenter(),
            i = this.getZoom();
        xi(this._proxy, this.project(t, i), this.getZoomScale(i, 1));
      }, this), this._on("unload", this._destroyAnimProxy, this);
    },
    _destroyAnimProxy: function () {
      ui(this._proxy), delete this._proxy;
    },
    _catchTransitionEnd: function (t) {
      this._animatingZoom && 0 <= t.propertyName.indexOf("transform") && this._onZoomTransitionEnd();
    },
    _nothingToAnimate: function () {
      return !this._container.getElementsByClassName("leaflet-zoom-animated").length;
    },
    _tryAnimatedZoom: function (t, i, e) {
      if (this._animatingZoom) return !0;
      if (e = e || {}, !this._zoomAnimated || !1 === e.animate || this._nothingToAnimate() || Math.abs(i - this._zoom) > this.options.zoomAnimationThreshold) return !1;

      var n = this.getZoomScale(i),
          o = this._getCenterOffset(t)._divideBy(1 - 1 / n);

      return !(!0 !== e.animate && !this.getSize().contains(o)) && (M(function () {
        this._moveStart(!0, !1)._animateZoom(t, i, !0);
      }, this), !0);
    },
    _animateZoom: function (t, i, e, n) {
      this._mapPane && (e && (this._animatingZoom = !0, this._animateToCenter = t, this._animateToZoom = i, pi(this._mapPane, "leaflet-zoom-anim")), this.fire("zoomanim", {
        center: t,
        zoom: i,
        noUpdate: n
      }), setTimeout(a(this._onZoomTransitionEnd, this), 250));
    },
    _onZoomTransitionEnd: function () {
      this._animatingZoom && (this._mapPane && mi(this._mapPane, "leaflet-zoom-anim"), this._animatingZoom = !1, this._move(this._animateToCenter, this._animateToZoom), M(function () {
        this._moveEnd(!0);
      }, this));
    }
  });

  function $i(t) {
    return new Qi(t);
  }

  var Qi = Z.extend({
    options: {
      position: "topright"
    },
    initialize: function (t) {
      p(this, t);
    },
    getPosition: function () {
      return this.options.position;
    },
    setPosition: function (t) {
      var i = this._map;
      return i && i.removeControl(this), this.options.position = t, i && i.addControl(this), this;
    },
    getContainer: function () {
      return this._container;
    },
    addTo: function (t) {
      this.remove(), this._map = t;
      var i = this._container = this.onAdd(t),
          e = this.getPosition(),
          n = t._controlCorners[e];
      return pi(i, "leaflet-control"), -1 !== e.indexOf("bottom") ? n.insertBefore(i, n.firstChild) : n.appendChild(i), this._map.on("unload", this.remove, this), this;
    },
    remove: function () {
      return this._map && (ui(this._container), this.onRemove && this.onRemove(this._map), this._map.off("unload", this.remove, this), this._map = null), this;
    },
    _refocusOnMap: function (t) {
      this._map && t && 0 < t.screenX && 0 < t.screenY && this._map.getContainer().focus();
    }
  });
  Ji.include({
    addControl: function (t) {
      return t.addTo(this), this;
    },
    removeControl: function (t) {
      return t.remove(), this;
    },
    _initControlPos: function () {
      var n = this._controlCorners = {},
          o = "leaflet-",
          s = this._controlContainer = hi("div", o + "control-container", this._container);

      function t(t, i) {
        var e = o + t + " " + o + i;
        n[t + i] = hi("div", e, s);
      }

      t("top", "left"), t("top", "right"), t("bottom", "left"), t("bottom", "right");
    },
    _clearControlPos: function () {
      for (var t in this._controlCorners) ui(this._controlCorners[t]);

      ui(this._controlContainer), delete this._controlCorners, delete this._controlContainer;
    }
  });
  var te = Qi.extend({
    options: {
      collapsed: !0,
      position: "topright",
      autoZIndex: !0,
      hideSingleBase: !1,
      sortLayers: !1,
      sortFunction: function (t, i, e, n) {
        return e < n ? -1 : n < e ? 1 : 0;
      }
    },
    initialize: function (t, i, e) {
      for (var n in p(this, e), this._layerControlInputs = [], this._layers = [], this._lastZIndex = 0, this._handlingClick = !1, t) this._addLayer(t[n], n);

      for (n in i) this._addLayer(i[n], n, !0);
    },
    onAdd: function (t) {
      this._initLayout(), this._update(), (this._map = t).on("zoomend", this._checkDisabledLayers, this);

      for (var i = 0; i < this._layers.length; i++) this._layers[i].layer.on("add remove", this._onLayerChange, this);

      return this._container;
    },
    addTo: function (t) {
      return Qi.prototype.addTo.call(this, t), this._expandIfNotCollapsed();
    },
    onRemove: function () {
      this._map.off("zoomend", this._checkDisabledLayers, this);

      for (var t = 0; t < this._layers.length; t++) this._layers[t].layer.off("add remove", this._onLayerChange, this);
    },
    addBaseLayer: function (t, i) {
      return this._addLayer(t, i), this._map ? this._update() : this;
    },
    addOverlay: function (t, i) {
      return this._addLayer(t, i, !0), this._map ? this._update() : this;
    },
    removeLayer: function (t) {
      t.off("add remove", this._onLayerChange, this);

      var i = this._getLayer(u(t));

      return i && this._layers.splice(this._layers.indexOf(i), 1), this._map ? this._update() : this;
    },
    expand: function () {
      pi(this._container, "leaflet-control-layers-expanded"), this._section.style.height = null;
      var t = this._map.getSize().y - (this._container.offsetTop + 50);
      return t < this._section.clientHeight ? (pi(this._section, "leaflet-control-layers-scrollbar"), this._section.style.height = t + "px") : mi(this._section, "leaflet-control-layers-scrollbar"), this._checkDisabledLayers(), this;
    },
    collapse: function () {
      return mi(this._container, "leaflet-control-layers-expanded"), this;
    },
    _initLayout: function () {
      var t = "leaflet-control-layers",
          i = this._container = hi("div", t),
          e = this.options.collapsed;
      i.setAttribute("aria-haspopup", !0), Ni(i), Ri(i);
      var n = this._section = hi("section", t + "-list");
      e && (this._map.on("click", this.collapse, this), st || Ei(i, {
        mouseenter: this.expand,
        mouseleave: this.collapse
      }, this));
      var o = this._layersLink = hi("a", t + "-toggle", i);
      o.href = "#", o.title = "Layers", Tt ? (Ei(o, "click", ji), Ei(o, "click", this.expand, this)) : Ei(o, "focus", this.expand, this), e || this.expand(), this._baseLayersList = hi("div", t + "-base", n), this._separator = hi("div", t + "-separator", n), this._overlaysList = hi("div", t + "-overlays", n), i.appendChild(n);
    },
    _getLayer: function (t) {
      for (var i = 0; i < this._layers.length; i++) if (this._layers[i] && u(this._layers[i].layer) === t) return this._layers[i];
    },
    _addLayer: function (t, i, e) {
      this._map && t.on("add remove", this._onLayerChange, this), this._layers.push({
        layer: t,
        name: i,
        overlay: e
      }), this.options.sortLayers && this._layers.sort(a(function (t, i) {
        return this.options.sortFunction(t.layer, i.layer, t.name, i.name);
      }, this)), this.options.autoZIndex && t.setZIndex && (this._lastZIndex++, t.setZIndex(this._lastZIndex)), this._expandIfNotCollapsed();
    },
    _update: function () {
      if (!this._container) return this;
      li(this._baseLayersList), li(this._overlaysList), this._layerControlInputs = [];
      var t,
          i,
          e,
          n,
          o = 0;

      for (e = 0; e < this._layers.length; e++) n = this._layers[e], this._addItem(n), i = i || n.overlay, t = t || !n.overlay, o += n.overlay ? 0 : 1;

      return this.options.hideSingleBase && (t = t && 1 < o, this._baseLayersList.style.display = t ? "" : "none"), this._separator.style.display = i && t ? "" : "none", this;
    },
    _onLayerChange: function (t) {
      this._handlingClick || this._update();

      var i = this._getLayer(u(t.target)),
          e = i.overlay ? "add" === t.type ? "overlayadd" : "overlayremove" : "add" === t.type ? "baselayerchange" : null;

      e && this._map.fire(e, i);
    },
    _createRadioElement: function (t, i) {
      var e = '<input type="radio" class="leaflet-control-layers-selector" name="' + t + '"' + (i ? ' checked="checked"' : "") + "/>",
          n = document.createElement("div");
      return n.innerHTML = e, n.firstChild;
    },
    _addItem: function (t) {
      var i,
          e = document.createElement("label"),
          n = this._map.hasLayer(t.layer);

      t.overlay ? ((i = document.createElement("input")).type = "checkbox", i.className = "leaflet-control-layers-selector", i.defaultChecked = n) : i = this._createRadioElement("leaflet-base-layers_" + u(this), n), this._layerControlInputs.push(i), i.layerId = u(t.layer), Ei(i, "click", this._onInputClick, this);
      var o = document.createElement("span");
      o.innerHTML = " " + t.name;
      var s = document.createElement("div");
      return e.appendChild(s), s.appendChild(i), s.appendChild(o), (t.overlay ? this._overlaysList : this._baseLayersList).appendChild(e), this._checkDisabledLayers(), e;
    },
    _onInputClick: function () {
      var t,
          i,
          e = this._layerControlInputs,
          n = [],
          o = [];
      this._handlingClick = !0;

      for (var s = e.length - 1; 0 <= s; s--) t = e[s], i = this._getLayer(t.layerId).layer, t.checked ? n.push(i) : t.checked || o.push(i);

      for (s = 0; s < o.length; s++) this._map.hasLayer(o[s]) && this._map.removeLayer(o[s]);

      for (s = 0; s < n.length; s++) this._map.hasLayer(n[s]) || this._map.addLayer(n[s]);

      this._handlingClick = !1, this._refocusOnMap();
    },
    _checkDisabledLayers: function () {
      for (var t, i, e = this._layerControlInputs, n = this._map.getZoom(), o = e.length - 1; 0 <= o; o--) t = e[o], i = this._getLayer(t.layerId).layer, t.disabled = void 0 !== i.options.minZoom && n < i.options.minZoom || void 0 !== i.options.maxZoom && n > i.options.maxZoom;
    },
    _expandIfNotCollapsed: function () {
      return this._map && !this.options.collapsed && this.expand(), this;
    },
    _expand: function () {
      return this.expand();
    },
    _collapse: function () {
      return this.collapse();
    }
  }),
      ie = Qi.extend({
    options: {
      position: "topleft",
      zoomInText: "+",
      zoomInTitle: "Zoom in",
      zoomOutText: "&#x2212;",
      zoomOutTitle: "Zoom out"
    },
    onAdd: function (t) {
      var i = "leaflet-control-zoom",
          e = hi("div", i + " leaflet-bar"),
          n = this.options;
      return this._zoomInButton = this._createButton(n.zoomInText, n.zoomInTitle, i + "-in", e, this._zoomIn), this._zoomOutButton = this._createButton(n.zoomOutText, n.zoomOutTitle, i + "-out", e, this._zoomOut), this._updateDisabled(), t.on("zoomend zoomlevelschange", this._updateDisabled, this), e;
    },
    onRemove: function (t) {
      t.off("zoomend zoomlevelschange", this._updateDisabled, this);
    },
    disable: function () {
      return this._disabled = !0, this._updateDisabled(), this;
    },
    enable: function () {
      return this._disabled = !1, this._updateDisabled(), this;
    },
    _zoomIn: function (t) {
      !this._disabled && this._map._zoom < this._map.getMaxZoom() && this._map.zoomIn(this._map.options.zoomDelta * (t.shiftKey ? 3 : 1));
    },
    _zoomOut: function (t) {
      !this._disabled && this._map._zoom > this._map.getMinZoom() && this._map.zoomOut(this._map.options.zoomDelta * (t.shiftKey ? 3 : 1));
    },
    _createButton: function (t, i, e, n, o) {
      var s = hi("a", e, n);
      return s.innerHTML = t, s.href = "#", s.title = i, s.setAttribute("role", "button"), s.setAttribute("aria-label", i), Ni(s), Ei(s, "click", ji), Ei(s, "click", o, this), Ei(s, "click", this._refocusOnMap, this), s;
    },
    _updateDisabled: function () {
      var t = this._map,
          i = "leaflet-disabled";
      mi(this._zoomInButton, i), mi(this._zoomOutButton, i), !this._disabled && t._zoom !== t.getMinZoom() || pi(this._zoomOutButton, i), !this._disabled && t._zoom !== t.getMaxZoom() || pi(this._zoomInButton, i);
    }
  });
  Ji.mergeOptions({
    zoomControl: !0
  }), Ji.addInitHook(function () {
    this.options.zoomControl && (this.zoomControl = new ie(), this.addControl(this.zoomControl));
  });
  var ee = Qi.extend({
    options: {
      position: "bottomleft",
      maxWidth: 100,
      metric: !0,
      imperial: !0
    },
    onAdd: function (t) {
      var i = "leaflet-control-scale",
          e = hi("div", i),
          n = this.options;
      return this._addScales(n, i + "-line", e), t.on(n.updateWhenIdle ? "moveend" : "move", this._update, this), t.whenReady(this._update, this), e;
    },
    onRemove: function (t) {
      t.off(this.options.updateWhenIdle ? "moveend" : "move", this._update, this);
    },
    _addScales: function (t, i, e) {
      t.metric && (this._mScale = hi("div", i, e)), t.imperial && (this._iScale = hi("div", i, e));
    },
    _update: function () {
      var t = this._map,
          i = t.getSize().y / 2,
          e = t.distance(t.containerPointToLatLng([0, i]), t.containerPointToLatLng([this.options.maxWidth, i]));

      this._updateScales(e);
    },
    _updateScales: function (t) {
      this.options.metric && t && this._updateMetric(t), this.options.imperial && t && this._updateImperial(t);
    },
    _updateMetric: function (t) {
      var i = this._getRoundNum(t),
          e = i < 1e3 ? i + " m" : i / 1e3 + " km";

      this._updateScale(this._mScale, e, i / t);
    },
    _updateImperial: function (t) {
      var i,
          e,
          n,
          o = 3.2808399 * t;
      5280 < o ? (i = o / 5280, e = this._getRoundNum(i), this._updateScale(this._iScale, e + " mi", e / i)) : (n = this._getRoundNum(o), this._updateScale(this._iScale, n + " ft", n / o));
    },
    _updateScale: function (t, i, e) {
      t.style.width = Math.round(this.options.maxWidth * e) + "px", t.innerHTML = i;
    },
    _getRoundNum: function (t) {
      var i = Math.pow(10, (Math.floor(t) + "").length - 1),
          e = t / i;
      return i * (e = 10 <= e ? 10 : 5 <= e ? 5 : 3 <= e ? 3 : 2 <= e ? 2 : 1);
    }
  }),
      ne = Qi.extend({
    options: {
      position: "bottomright",
      prefix: '<a href="https://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>'
    },
    initialize: function (t) {
      p(this, t), this._attributions = {};
    },
    onAdd: function (t) {
      for (var i in (t.attributionControl = this)._container = hi("div", "leaflet-control-attribution"), Ni(this._container), t._layers) t._layers[i].getAttribution && this.addAttribution(t._layers[i].getAttribution());

      return this._update(), this._container;
    },
    setPrefix: function (t) {
      return this.options.prefix = t, this._update(), this;
    },
    addAttribution: function (t) {
      return t && (this._attributions[t] || (this._attributions[t] = 0), this._attributions[t]++, this._update()), this;
    },
    removeAttribution: function (t) {
      return t && this._attributions[t] && (this._attributions[t]--, this._update()), this;
    },
    _update: function () {
      if (this._map) {
        var t = [];

        for (var i in this._attributions) this._attributions[i] && t.push(i);

        var e = [];
        this.options.prefix && e.push(this.options.prefix), t.length && e.push(t.join(", ")), this._container.innerHTML = e.join(" | ");
      }
    }
  });
  Ji.mergeOptions({
    attributionControl: !0
  }), Ji.addInitHook(function () {
    this.options.attributionControl && new ne().addTo(this);
  });
  Qi.Layers = te, Qi.Zoom = ie, Qi.Scale = ee, Qi.Attribution = ne, $i.layers = function (t, i, e) {
    return new te(t, i, e);
  }, $i.zoom = function (t) {
    return new ie(t);
  }, $i.scale = function (t) {
    return new ee(t);
  }, $i.attribution = function (t) {
    return new ne(t);
  };
  var oe = Z.extend({
    initialize: function (t) {
      this._map = t;
    },
    enable: function () {
      return this._enabled || (this._enabled = !0, this.addHooks()), this;
    },
    disable: function () {
      return this._enabled && (this._enabled = !1, this.removeHooks()), this;
    },
    enabled: function () {
      return !!this._enabled;
    }
  });

  oe.addTo = function (t, i) {
    return t.addHandler(i, this), this;
  };

  var se,
      re = {
    Events: E
  },
      ae = Tt ? "touchstart mousedown" : "mousedown",
      he = {
    mousedown: "mouseup",
    touchstart: "touchend",
    pointerdown: "touchend",
    MSPointerDown: "touchend"
  },
      ue = {
    mousedown: "mousemove",
    touchstart: "touchmove",
    pointerdown: "touchmove",
    MSPointerDown: "touchmove"
  },
      le = k.extend({
    options: {
      clickTolerance: 3
    },
    initialize: function (t, i, e, n) {
      p(this, n), this._element = t, this._dragStartTarget = i || t, this._preventOutline = e;
    },
    enable: function () {
      this._enabled || (Ei(this._dragStartTarget, ae, this._onDown, this), this._enabled = !0);
    },
    disable: function () {
      this._enabled && (le._dragging === this && this.finishDrag(), Bi(this._dragStartTarget, ae, this._onDown, this), this._enabled = !1, this._moved = !1);
    },
    _onDown: function (t) {
      if (!t._simulated && this._enabled && (this._moved = !1, !di(this._element, "leaflet-zoom-anim") && !(le._dragging || t.shiftKey || 1 !== t.which && 1 !== t.button && !t.touches || ((le._dragging = this)._preventOutline && zi(this._element), bi(), $t(), this._moving)))) {
        this.fire("down");
        var i = t.touches ? t.touches[0] : t,
            e = Ci(this._element);
        this._startPoint = new B(i.clientX, i.clientY), this._parentScale = Si(e), Ei(document, ue[t.type], this._onMove, this), Ei(document, he[t.type], this._onUp, this);
      }
    },
    _onMove: function (t) {
      if (!t._simulated && this._enabled) if (t.touches && 1 < t.touches.length) this._moved = !0;else {
        var i = t.touches && 1 === t.touches.length ? t.touches[0] : t,
            e = new B(i.clientX, i.clientY)._subtract(this._startPoint);

        (e.x || e.y) && (Math.abs(e.x) + Math.abs(e.y) < this.options.clickTolerance || (e.x /= this._parentScale.x, e.y /= this._parentScale.y, Di(t), this._moved || (this.fire("dragstart"), this._moved = !0, this._startPos = Pi(this._element).subtract(e), pi(document.body, "leaflet-dragging"), this._lastTarget = t.target || t.srcElement, window.SVGElementInstance && this._lastTarget instanceof SVGElementInstance && (this._lastTarget = this._lastTarget.correspondingUseElement), pi(this._lastTarget, "leaflet-drag-target")), this._newPos = this._startPos.add(e), this._moving = !0, C(this._animRequest), this._lastEvent = t, this._animRequest = M(this._updatePosition, this, !0)));
      }
    },
    _updatePosition: function () {
      var t = {
        originalEvent: this._lastEvent
      };
      this.fire("predrag", t), wi(this._element, this._newPos), this.fire("drag", t);
    },
    _onUp: function (t) {
      !t._simulated && this._enabled && this.finishDrag();
    },
    finishDrag: function () {
      for (var t in mi(document.body, "leaflet-dragging"), this._lastTarget && (mi(this._lastTarget, "leaflet-drag-target"), this._lastTarget = null), ue) Bi(document, ue[t], this._onMove, this), Bi(document, he[t], this._onUp, this);

      Ti(), Qt(), this._moved && this._moving && (C(this._animRequest), this.fire("dragend", {
        distance: this._newPos.distanceTo(this._startPos)
      })), this._moving = !1, le._dragging = !1;
    }
  });

  function ce(t, i) {
    if (!i || !t.length) return t.slice();
    var e = i * i;
    return t = function (t, i) {
      var e = t.length,
          n = new (typeof Uint8Array != void 0 + "" ? Uint8Array : Array)(e);
      n[0] = n[e - 1] = 1, function t(i, e, n, o, s) {
        var r,
            a,
            h,
            u = 0;

        for (a = o + 1; a <= s - 1; a++) h = fe(i[a], i[o], i[s], !0), u < h && (r = a, u = h);

        n < u && (e[r] = 1, t(i, e, n, o, r), t(i, e, n, r, s));
      }(t, n, i, 0, e - 1);
      var o,
          s = [];

      for (o = 0; o < e; o++) n[o] && s.push(t[o]);

      return s;
    }(t = function (t, i) {
      for (var e = [t[0]], n = 1, o = 0, s = t.length; n < s; n++) r = t[n], a = t[o], void 0, h = a.x - r.x, u = a.y - r.y, i < h * h + u * u && (e.push(t[n]), o = n);

      var r, a, h, u;
      o < s - 1 && e.push(t[s - 1]);
      return e;
    }(t, e), e);
  }

  function _e(t, i, e) {
    return Math.sqrt(fe(t, i, e, !0));
  }

  function de(t, i, e, n, o) {
    var s,
        r,
        a,
        h = n ? se : me(t, e),
        u = me(i, e);

    for (se = u;;) {
      if (!(h | u)) return [t, i];
      if (h & u) return !1;
      a = me(r = pe(t, i, s = h || u, e, o), e), s === h ? (t = r, h = a) : (i = r, u = a);
    }
  }

  function pe(t, i, e, n, o) {
    var s,
        r,
        a = i.x - t.x,
        h = i.y - t.y,
        u = n.min,
        l = n.max;
    return 8 & e ? (s = t.x + a * (l.y - t.y) / h, r = l.y) : 4 & e ? (s = t.x + a * (u.y - t.y) / h, r = u.y) : 2 & e ? (s = l.x, r = t.y + h * (l.x - t.x) / a) : 1 & e && (s = u.x, r = t.y + h * (u.x - t.x) / a), new B(s, r, o);
  }

  function me(t, i) {
    var e = 0;
    return t.x < i.min.x ? e |= 1 : t.x > i.max.x && (e |= 2), t.y < i.min.y ? e |= 4 : t.y > i.max.y && (e |= 8), e;
  }

  function fe(t, i, e, n) {
    var o,
        s = i.x,
        r = i.y,
        a = e.x - s,
        h = e.y - r,
        u = a * a + h * h;
    return 0 < u && (1 < (o = ((t.x - s) * a + (t.y - r) * h) / u) ? (s = e.x, r = e.y) : 0 < o && (s += a * o, r += h * o)), a = t.x - s, h = t.y - r, n ? a * a + h * h : new B(s, r);
  }

  function ge(t) {
    return !v(t[0]) || "object" != typeof t[0][0] && void 0 !== t[0][0];
  }

  function ve(t) {
    return console.warn("Deprecated use of _flat, please use L.LineUtil.isFlat instead."), ge(t);
  }

  var ye = (Object.freeze || Object)({
    simplify: ce,
    pointToSegmentDistance: _e,
    closestPointOnSegment: function (t, i, e) {
      return fe(t, i, e);
    },
    clipSegment: de,
    _getEdgeIntersection: pe,
    _getBitCode: me,
    _sqClosestPointOnSegment: fe,
    isFlat: ge,
    _flat: ve
  });

  function xe(t, i, e) {
    var n,
        o,
        s,
        r,
        a,
        h,
        u,
        l,
        c,
        _ = [1, 4, 2, 8];

    for (o = 0, u = t.length; o < u; o++) t[o]._code = me(t[o], i);

    for (r = 0; r < 4; r++) {
      for (l = _[r], n = [], o = 0, s = (u = t.length) - 1; o < u; s = o++) a = t[o], h = t[s], a._code & l ? h._code & l || ((c = pe(h, a, l, i, e))._code = me(c, i), n.push(c)) : (h._code & l && ((c = pe(h, a, l, i, e))._code = me(c, i), n.push(c)), n.push(a));

      t = n;
    }

    return t;
  }

  var we,
      Pe = (Object.freeze || Object)({
    clipPolygon: xe
  }),
      Le = {
    project: function (t) {
      return new B(t.lng, t.lat);
    },
    unproject: function (t) {
      return new j(t.y, t.x);
    },
    bounds: new O([-180, -90], [180, 90])
  },
      be = {
    R: 6378137,
    R_MINOR: 6356752.314245179,
    bounds: new O([-20037508.34279, -15496570.73972], [20037508.34279, 18764656.23138]),
    project: function (t) {
      var i = Math.PI / 180,
          e = this.R,
          n = t.lat * i,
          o = this.R_MINOR / e,
          s = Math.sqrt(1 - o * o),
          r = s * Math.sin(n),
          a = Math.tan(Math.PI / 4 - n / 2) / Math.pow((1 - r) / (1 + r), s / 2);
      return n = -e * Math.log(Math.max(a, 1e-10)), new B(t.lng * i * e, n);
    },
    unproject: function (t) {
      for (var i, e = 180 / Math.PI, n = this.R, o = this.R_MINOR / n, s = Math.sqrt(1 - o * o), r = Math.exp(-t.y / n), a = Math.PI / 2 - 2 * Math.atan(r), h = 0, u = .1; h < 15 && 1e-7 < Math.abs(u); h++) i = s * Math.sin(a), i = Math.pow((1 - i) / (1 + i), s / 2), a += u = Math.PI / 2 - 2 * Math.atan(r * i) - a;

      return new j(a * e, t.x * e / n);
    }
  },
      Te = (Object.freeze || Object)({
    LonLat: Le,
    Mercator: be,
    SphericalMercator: q
  }),
      ze = h({}, U, {
    code: "EPSG:3395",
    projection: be,
    transformation: (we = .5 / (Math.PI * be.R), K(we, .5, -we, .5))
  }),
      Me = h({}, U, {
    code: "EPSG:4326",
    projection: Le,
    transformation: K(1 / 180, 1, -1 / 180, .5)
  }),
      Ce = h({}, F, {
    projection: Le,
    transformation: K(1, 0, -1, 0),
    scale: function (t) {
      return Math.pow(2, t);
    },
    zoom: function (t) {
      return Math.log(t) / Math.LN2;
    },
    distance: function (t, i) {
      var e = i.lng - t.lng,
          n = i.lat - t.lat;
      return Math.sqrt(e * e + n * n);
    },
    infinite: !0
  });
  F.Earth = U, F.EPSG3395 = ze, F.EPSG3857 = X, F.EPSG900913 = J, F.EPSG4326 = Me, F.Simple = Ce;
  var Se = k.extend({
    options: {
      pane: "overlayPane",
      attribution: null,
      bubblingMouseEvents: !0
    },
    addTo: function (t) {
      return t.addLayer(this), this;
    },
    remove: function () {
      return this.removeFrom(this._map || this._mapToAdd);
    },
    removeFrom: function (t) {
      return t && t.removeLayer(this), this;
    },
    getPane: function (t) {
      return this._map.getPane(t ? this.options[t] || t : this.options.pane);
    },
    addInteractiveTarget: function (t) {
      return this._map._targets[u(t)] = this;
    },
    removeInteractiveTarget: function (t) {
      return delete this._map._targets[u(t)], this;
    },
    getAttribution: function () {
      return this.options.attribution;
    },
    _layerAdd: function (t) {
      var i = t.target;

      if (i.hasLayer(this)) {
        if (this._map = i, this._zoomAnimated = i._zoomAnimated, this.getEvents) {
          var e = this.getEvents();
          i.on(e, this), this.once("remove", function () {
            i.off(e, this);
          }, this);
        }

        this.onAdd(i), this.getAttribution && i.attributionControl && i.attributionControl.addAttribution(this.getAttribution()), this.fire("add"), i.fire("layeradd", {
          layer: this
        });
      }
    }
  });
  Ji.include({
    addLayer: function (t) {
      if (!t._layerAdd) throw new Error("The provided object is not a Layer.");
      var i = u(t);
      return this._layers[i] || ((this._layers[i] = t)._mapToAdd = this, t.beforeAdd && t.beforeAdd(this), this.whenReady(t._layerAdd, t)), this;
    },
    removeLayer: function (t) {
      var i = u(t);
      return this._layers[i] && (this._loaded && t.onRemove(this), t.getAttribution && this.attributionControl && this.attributionControl.removeAttribution(t.getAttribution()), delete this._layers[i], this._loaded && (this.fire("layerremove", {
        layer: t
      }), t.fire("remove")), t._map = t._mapToAdd = null), this;
    },
    hasLayer: function (t) {
      return !!t && u(t) in this._layers;
    },
    eachLayer: function (t, i) {
      for (var e in this._layers) t.call(i, this._layers[e]);

      return this;
    },
    _addLayers: function (t) {
      for (var i = 0, e = (t = t ? v(t) ? t : [t] : []).length; i < e; i++) this.addLayer(t[i]);
    },
    _addZoomLimit: function (t) {
      !isNaN(t.options.maxZoom) && isNaN(t.options.minZoom) || (this._zoomBoundLayers[u(t)] = t, this._updateZoomLevels());
    },
    _removeZoomLimit: function (t) {
      var i = u(t);
      this._zoomBoundLayers[i] && (delete this._zoomBoundLayers[i], this._updateZoomLevels());
    },
    _updateZoomLevels: function () {
      var t = 1 / 0,
          i = -1 / 0,
          e = this._getZoomSpan();

      for (var n in this._zoomBoundLayers) {
        var o = this._zoomBoundLayers[n].options;
        t = void 0 === o.minZoom ? t : Math.min(t, o.minZoom), i = void 0 === o.maxZoom ? i : Math.max(i, o.maxZoom);
      }

      this._layersMaxZoom = i === -1 / 0 ? void 0 : i, this._layersMinZoom = t === 1 / 0 ? void 0 : t, e !== this._getZoomSpan() && this.fire("zoomlevelschange"), void 0 === this.options.maxZoom && this._layersMaxZoom && this.getZoom() > this._layersMaxZoom && this.setZoom(this._layersMaxZoom), void 0 === this.options.minZoom && this._layersMinZoom && this.getZoom() < this._layersMinZoom && this.setZoom(this._layersMinZoom);
    }
  });
  var Ze = Se.extend({
    initialize: function (t, i) {
      var e, n;
      if (p(this, i), this._layers = {}, t) for (e = 0, n = t.length; e < n; e++) this.addLayer(t[e]);
    },
    addLayer: function (t) {
      var i = this.getLayerId(t);
      return this._layers[i] = t, this._map && this._map.addLayer(t), this;
    },
    removeLayer: function (t) {
      var i = t in this._layers ? t : this.getLayerId(t);
      return this._map && this._layers[i] && this._map.removeLayer(this._layers[i]), delete this._layers[i], this;
    },
    hasLayer: function (t) {
      return !!t && (t in this._layers || this.getLayerId(t) in this._layers);
    },
    clearLayers: function () {
      return this.eachLayer(this.removeLayer, this);
    },
    invoke: function (t) {
      var i,
          e,
          n = Array.prototype.slice.call(arguments, 1);

      for (i in this._layers) (e = this._layers[i])[t] && e[t].apply(e, n);

      return this;
    },
    onAdd: function (t) {
      this.eachLayer(t.addLayer, t);
    },
    onRemove: function (t) {
      this.eachLayer(t.removeLayer, t);
    },
    eachLayer: function (t, i) {
      for (var e in this._layers) t.call(i, this._layers[e]);

      return this;
    },
    getLayer: function (t) {
      return this._layers[t];
    },
    getLayers: function () {
      var t = [];
      return this.eachLayer(t.push, t), t;
    },
    setZIndex: function (t) {
      return this.invoke("setZIndex", t);
    },
    getLayerId: function (t) {
      return u(t);
    }
  }),
      Ee = Ze.extend({
    addLayer: function (t) {
      return this.hasLayer(t) ? this : (t.addEventParent(this), Ze.prototype.addLayer.call(this, t), this.fire("layeradd", {
        layer: t
      }));
    },
    removeLayer: function (t) {
      return this.hasLayer(t) ? (t in this._layers && (t = this._layers[t]), t.removeEventParent(this), Ze.prototype.removeLayer.call(this, t), this.fire("layerremove", {
        layer: t
      })) : this;
    },
    setStyle: function (t) {
      return this.invoke("setStyle", t);
    },
    bringToFront: function () {
      return this.invoke("bringToFront");
    },
    bringToBack: function () {
      return this.invoke("bringToBack");
    },
    getBounds: function () {
      var t = new N();

      for (var i in this._layers) {
        var e = this._layers[i];
        t.extend(e.getBounds ? e.getBounds() : e.getLatLng());
      }

      return t;
    }
  }),
      ke = Z.extend({
    options: {
      popupAnchor: [0, 0],
      tooltipAnchor: [0, 0]
    },
    initialize: function (t) {
      p(this, t);
    },
    createIcon: function (t) {
      return this._createIcon("icon", t);
    },
    createShadow: function (t) {
      return this._createIcon("shadow", t);
    },
    _createIcon: function (t, i) {
      var e = this._getIconUrl(t);

      if (!e) {
        if ("icon" === t) throw new Error("iconUrl not set in Icon options (see the docs).");
        return null;
      }

      var n = this._createImg(e, i && "IMG" === i.tagName ? i : null);

      return this._setIconStyles(n, t), n;
    },
    _setIconStyles: function (t, i) {
      var e = this.options,
          n = e[i + "Size"];
      "number" == typeof n && (n = [n, n]);
      var o = I(n),
          s = I("shadow" === i && e.shadowAnchor || e.iconAnchor || o && o.divideBy(2, !0));
      t.className = "leaflet-marker-" + i + " " + (e.className || ""), s && (t.style.marginLeft = -s.x + "px", t.style.marginTop = -s.y + "px"), o && (t.style.width = o.x + "px", t.style.height = o.y + "px");
    },
    _createImg: function (t, i) {
      return (i = i || document.createElement("img")).src = t, i;
    },
    _getIconUrl: function (t) {
      return Ct && this.options[t + "RetinaUrl"] || this.options[t + "Url"];
    }
  });
  var Be = ke.extend({
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
    _getIconUrl: function (t) {
      return Be.imagePath || (Be.imagePath = this._detectIconPath()), (this.options.imagePath || Be.imagePath) + ke.prototype._getIconUrl.call(this, t);
    },
    _detectIconPath: function () {
      var t = hi("div", "leaflet-default-icon-path", document.body),
          i = ai(t, "background-image") || ai(t, "backgroundImage");
      return document.body.removeChild(t), i = null === i || 0 !== i.indexOf("url") ? "" : i.replace(/^url\(["']?/, "").replace(/marker-icon\.png["']?\)$/, "");
    }
  }),
      Ae = oe.extend({
    initialize: function (t) {
      this._marker = t;
    },
    addHooks: function () {
      var t = this._marker._icon;
      this._draggable || (this._draggable = new le(t, t, !0)), this._draggable.on({
        dragstart: this._onDragStart,
        predrag: this._onPreDrag,
        drag: this._onDrag,
        dragend: this._onDragEnd
      }, this).enable(), pi(t, "leaflet-marker-draggable");
    },
    removeHooks: function () {
      this._draggable.off({
        dragstart: this._onDragStart,
        predrag: this._onPreDrag,
        drag: this._onDrag,
        dragend: this._onDragEnd
      }, this).disable(), this._marker._icon && mi(this._marker._icon, "leaflet-marker-draggable");
    },
    moved: function () {
      return this._draggable && this._draggable._moved;
    },
    _adjustPan: function (t) {
      var i = this._marker,
          e = i._map,
          n = this._marker.options.autoPanSpeed,
          o = this._marker.options.autoPanPadding,
          s = Pi(i._icon),
          r = e.getPixelBounds(),
          a = e.getPixelOrigin(),
          h = R(r.min._subtract(a).add(o), r.max._subtract(a).subtract(o));

      if (!h.contains(s)) {
        var u = I((Math.max(h.max.x, s.x) - h.max.x) / (r.max.x - h.max.x) - (Math.min(h.min.x, s.x) - h.min.x) / (r.min.x - h.min.x), (Math.max(h.max.y, s.y) - h.max.y) / (r.max.y - h.max.y) - (Math.min(h.min.y, s.y) - h.min.y) / (r.min.y - h.min.y)).multiplyBy(n);
        e.panBy(u, {
          animate: !1
        }), this._draggable._newPos._add(u), this._draggable._startPos._add(u), wi(i._icon, this._draggable._newPos), this._onDrag(t), this._panRequest = M(this._adjustPan.bind(this, t));
      }
    },
    _onDragStart: function () {
      this._oldLatLng = this._marker.getLatLng(), this._marker.closePopup().fire("movestart").fire("dragstart");
    },
    _onPreDrag: function (t) {
      this._marker.options.autoPan && (C(this._panRequest), this._panRequest = M(this._adjustPan.bind(this, t)));
    },
    _onDrag: function (t) {
      var i = this._marker,
          e = i._shadow,
          n = Pi(i._icon),
          o = i._map.layerPointToLatLng(n);

      e && wi(e, n), i._latlng = o, t.latlng = o, t.oldLatLng = this._oldLatLng, i.fire("move", t).fire("drag", t);
    },
    _onDragEnd: function (t) {
      C(this._panRequest), delete this._oldLatLng, this._marker.fire("moveend").fire("dragend", t);
    }
  }),
      Ie = Se.extend({
    options: {
      icon: new Be(),
      interactive: !0,
      keyboard: !0,
      title: "",
      alt: "",
      zIndexOffset: 0,
      opacity: 1,
      riseOnHover: !1,
      riseOffset: 250,
      pane: "markerPane",
      shadowPane: "shadowPane",
      bubblingMouseEvents: !1,
      draggable: !1,
      autoPan: !1,
      autoPanPadding: [50, 50],
      autoPanSpeed: 10
    },
    initialize: function (t, i) {
      p(this, i), this._latlng = W(t);
    },
    onAdd: function (t) {
      this._zoomAnimated = this._zoomAnimated && t.options.markerZoomAnimation, this._zoomAnimated && t.on("zoomanim", this._animateZoom, this), this._initIcon(), this.update();
    },
    onRemove: function (t) {
      this.dragging && this.dragging.enabled() && (this.options.draggable = !0, this.dragging.removeHooks()), delete this.dragging, this._zoomAnimated && t.off("zoomanim", this._animateZoom, this), this._removeIcon(), this._removeShadow();
    },
    getEvents: function () {
      return {
        zoom: this.update,
        viewreset: this.update
      };
    },
    getLatLng: function () {
      return this._latlng;
    },
    setLatLng: function (t) {
      var i = this._latlng;
      return this._latlng = W(t), this.update(), this.fire("move", {
        oldLatLng: i,
        latlng: this._latlng
      });
    },
    setZIndexOffset: function (t) {
      return this.options.zIndexOffset = t, this.update();
    },
    getIcon: function () {
      return this.options.icon;
    },
    setIcon: function (t) {
      return this.options.icon = t, this._map && (this._initIcon(), this.update()), this._popup && this.bindPopup(this._popup, this._popup.options), this;
    },
    getElement: function () {
      return this._icon;
    },
    update: function () {
      if (this._icon && this._map) {
        var t = this._map.latLngToLayerPoint(this._latlng).round();

        this._setPos(t);
      }

      return this;
    },
    _initIcon: function () {
      var t = this.options,
          i = "leaflet-zoom-" + (this._zoomAnimated ? "animated" : "hide"),
          e = t.icon.createIcon(this._icon),
          n = !1;
      e !== this._icon && (this._icon && this._removeIcon(), n = !0, t.title && (e.title = t.title), "IMG" === e.tagName && (e.alt = t.alt || "")), pi(e, i), t.keyboard && (e.tabIndex = "0"), this._icon = e, t.riseOnHover && this.on({
        mouseover: this._bringToFront,
        mouseout: this._resetZIndex
      });
      var o = t.icon.createShadow(this._shadow),
          s = !1;
      o !== this._shadow && (this._removeShadow(), s = !0), o && (pi(o, i), o.alt = ""), this._shadow = o, t.opacity < 1 && this._updateOpacity(), n && this.getPane().appendChild(this._icon), this._initInteraction(), o && s && this.getPane(t.shadowPane).appendChild(this._shadow);
    },
    _removeIcon: function () {
      this.options.riseOnHover && this.off({
        mouseover: this._bringToFront,
        mouseout: this._resetZIndex
      }), ui(this._icon), this.removeInteractiveTarget(this._icon), this._icon = null;
    },
    _removeShadow: function () {
      this._shadow && ui(this._shadow), this._shadow = null;
    },
    _setPos: function (t) {
      wi(this._icon, t), this._shadow && wi(this._shadow, t), this._zIndex = t.y + this.options.zIndexOffset, this._resetZIndex();
    },
    _updateZIndex: function (t) {
      this._icon.style.zIndex = this._zIndex + t;
    },
    _animateZoom: function (t) {
      var i = this._map._latLngToNewLayerPoint(this._latlng, t.zoom, t.center).round();

      this._setPos(i);
    },
    _initInteraction: function () {
      if (this.options.interactive && (pi(this._icon, "leaflet-interactive"), this.addInteractiveTarget(this._icon), Ae)) {
        var t = this.options.draggable;
        this.dragging && (t = this.dragging.enabled(), this.dragging.disable()), this.dragging = new Ae(this), t && this.dragging.enable();
      }
    },
    setOpacity: function (t) {
      return this.options.opacity = t, this._map && this._updateOpacity(), this;
    },
    _updateOpacity: function () {
      var t = this.options.opacity;
      this._icon && vi(this._icon, t), this._shadow && vi(this._shadow, t);
    },
    _bringToFront: function () {
      this._updateZIndex(this.options.riseOffset);
    },
    _resetZIndex: function () {
      this._updateZIndex(0);
    },
    _getPopupAnchor: function () {
      return this.options.icon.options.popupAnchor;
    },
    _getTooltipAnchor: function () {
      return this.options.icon.options.tooltipAnchor;
    }
  });
  var Oe = Se.extend({
    options: {
      stroke: !0,
      color: "#3388ff",
      weight: 3,
      opacity: 1,
      lineCap: "round",
      lineJoin: "round",
      dashArray: null,
      dashOffset: null,
      fill: !1,
      fillColor: null,
      fillOpacity: .2,
      fillRule: "evenodd",
      interactive: !0,
      bubblingMouseEvents: !0
    },
    beforeAdd: function (t) {
      this._renderer = t.getRenderer(this);
    },
    onAdd: function () {
      this._renderer._initPath(this), this._reset(), this._renderer._addPath(this);
    },
    onRemove: function () {
      this._renderer._removePath(this);
    },
    redraw: function () {
      return this._map && this._renderer._updatePath(this), this;
    },
    setStyle: function (t) {
      return p(this, t), this._renderer && (this._renderer._updateStyle(this), this.options.stroke && t.hasOwnProperty("weight") && this._updateBounds()), this;
    },
    bringToFront: function () {
      return this._renderer && this._renderer._bringToFront(this), this;
    },
    bringToBack: function () {
      return this._renderer && this._renderer._bringToBack(this), this;
    },
    getElement: function () {
      return this._path;
    },
    _reset: function () {
      this._project(), this._update();
    },
    _clickTolerance: function () {
      return (this.options.stroke ? this.options.weight / 2 : 0) + this._renderer.options.tolerance;
    }
  }),
      Re = Oe.extend({
    options: {
      fill: !0,
      radius: 10
    },
    initialize: function (t, i) {
      p(this, i), this._latlng = W(t), this._radius = this.options.radius;
    },
    setLatLng: function (t) {
      return this._latlng = W(t), this.redraw(), this.fire("move", {
        latlng: this._latlng
      });
    },
    getLatLng: function () {
      return this._latlng;
    },
    setRadius: function (t) {
      return this.options.radius = this._radius = t, this.redraw();
    },
    getRadius: function () {
      return this._radius;
    },
    setStyle: function (t) {
      var i = t && t.radius || this._radius;
      return Oe.prototype.setStyle.call(this, t), this.setRadius(i), this;
    },
    _project: function () {
      this._point = this._map.latLngToLayerPoint(this._latlng), this._updateBounds();
    },
    _updateBounds: function () {
      var t = this._radius,
          i = this._radiusY || t,
          e = this._clickTolerance(),
          n = [t + e, i + e];

      this._pxBounds = new O(this._point.subtract(n), this._point.add(n));
    },
    _update: function () {
      this._map && this._updatePath();
    },
    _updatePath: function () {
      this._renderer._updateCircle(this);
    },
    _empty: function () {
      return this._radius && !this._renderer._bounds.intersects(this._pxBounds);
    },
    _containsPoint: function (t) {
      return t.distanceTo(this._point) <= this._radius + this._clickTolerance();
    }
  });
  var Ne = Re.extend({
    initialize: function (t, i, e) {
      if ("number" == typeof i && (i = h({}, e, {
        radius: i
      })), p(this, i), this._latlng = W(t), isNaN(this.options.radius)) throw new Error("Circle radius cannot be NaN");
      this._mRadius = this.options.radius;
    },
    setRadius: function (t) {
      return this._mRadius = t, this.redraw();
    },
    getRadius: function () {
      return this._mRadius;
    },
    getBounds: function () {
      var t = [this._radius, this._radiusY || this._radius];
      return new N(this._map.layerPointToLatLng(this._point.subtract(t)), this._map.layerPointToLatLng(this._point.add(t)));
    },
    setStyle: Oe.prototype.setStyle,
    _project: function () {
      var t = this._latlng.lng,
          i = this._latlng.lat,
          e = this._map,
          n = e.options.crs;

      if (n.distance === U.distance) {
        var o = Math.PI / 180,
            s = this._mRadius / U.R / o,
            r = e.project([i + s, t]),
            a = e.project([i - s, t]),
            h = r.add(a).divideBy(2),
            u = e.unproject(h).lat,
            l = Math.acos((Math.cos(s * o) - Math.sin(i * o) * Math.sin(u * o)) / (Math.cos(i * o) * Math.cos(u * o))) / o;
        !isNaN(l) && 0 !== l || (l = s / Math.cos(Math.PI / 180 * i)), this._point = h.subtract(e.getPixelOrigin()), this._radius = isNaN(l) ? 0 : h.x - e.project([u, t - l]).x, this._radiusY = h.y - r.y;
      } else {
        var c = n.unproject(n.project(this._latlng).subtract([this._mRadius, 0]));
        this._point = e.latLngToLayerPoint(this._latlng), this._radius = this._point.x - e.latLngToLayerPoint(c).x;
      }

      this._updateBounds();
    }
  });
  var De = Oe.extend({
    options: {
      smoothFactor: 1,
      noClip: !1
    },
    initialize: function (t, i) {
      p(this, i), this._setLatLngs(t);
    },
    getLatLngs: function () {
      return this._latlngs;
    },
    setLatLngs: function (t) {
      return this._setLatLngs(t), this.redraw();
    },
    isEmpty: function () {
      return !this._latlngs.length;
    },
    closestLayerPoint: function (t) {
      for (var i, e, n = 1 / 0, o = null, s = fe, r = 0, a = this._parts.length; r < a; r++) for (var h = this._parts[r], u = 1, l = h.length; u < l; u++) {
        var c = s(t, i = h[u - 1], e = h[u], !0);
        c < n && (n = c, o = s(t, i, e));
      }

      return o && (o.distance = Math.sqrt(n)), o;
    },
    getCenter: function () {
      if (!this._map) throw new Error("Must add layer to map before using getCenter()");
      var t,
          i,
          e,
          n,
          o,
          s,
          r,
          a = this._rings[0],
          h = a.length;
      if (!h) return null;

      for (i = t = 0; t < h - 1; t++) i += a[t].distanceTo(a[t + 1]) / 2;

      if (0 === i) return this._map.layerPointToLatLng(a[0]);

      for (n = t = 0; t < h - 1; t++) if (o = a[t], s = a[t + 1], i < (n += e = o.distanceTo(s))) return r = (n - i) / e, this._map.layerPointToLatLng([s.x - r * (s.x - o.x), s.y - r * (s.y - o.y)]);
    },
    getBounds: function () {
      return this._bounds;
    },
    addLatLng: function (t, i) {
      return i = i || this._defaultShape(), t = W(t), i.push(t), this._bounds.extend(t), this.redraw();
    },
    _setLatLngs: function (t) {
      this._bounds = new N(), this._latlngs = this._convertLatLngs(t);
    },
    _defaultShape: function () {
      return ge(this._latlngs) ? this._latlngs : this._latlngs[0];
    },
    _convertLatLngs: function (t) {
      for (var i = [], e = ge(t), n = 0, o = t.length; n < o; n++) e ? (i[n] = W(t[n]), this._bounds.extend(i[n])) : i[n] = this._convertLatLngs(t[n]);

      return i;
    },
    _project: function () {
      var t = new O();
      this._rings = [], this._projectLatlngs(this._latlngs, this._rings, t), this._bounds.isValid() && t.isValid() && (this._rawPxBounds = t, this._updateBounds());
    },
    _updateBounds: function () {
      var t = this._clickTolerance(),
          i = new B(t, t);

      this._pxBounds = new O([this._rawPxBounds.min.subtract(i), this._rawPxBounds.max.add(i)]);
    },
    _projectLatlngs: function (t, i, e) {
      var n,
          o,
          s = t[0] instanceof j,
          r = t.length;

      if (s) {
        for (o = [], n = 0; n < r; n++) o[n] = this._map.latLngToLayerPoint(t[n]), e.extend(o[n]);

        i.push(o);
      } else for (n = 0; n < r; n++) this._projectLatlngs(t[n], i, e);
    },
    _clipPoints: function () {
      var t = this._renderer._bounds;
      if (this._parts = [], this._pxBounds && this._pxBounds.intersects(t)) if (this.options.noClip) this._parts = this._rings;else {
        var i,
            e,
            n,
            o,
            s,
            r,
            a,
            h = this._parts;

        for (n = i = 0, o = this._rings.length; i < o; i++) for (e = 0, s = (a = this._rings[i]).length; e < s - 1; e++) (r = de(a[e], a[e + 1], t, e, !0)) && (h[n] = h[n] || [], h[n].push(r[0]), r[1] === a[e + 1] && e !== s - 2 || (h[n].push(r[1]), n++));
      }
    },
    _simplifyPoints: function () {
      for (var t = this._parts, i = this.options.smoothFactor, e = 0, n = t.length; e < n; e++) t[e] = ce(t[e], i);
    },
    _update: function () {
      this._map && (this._clipPoints(), this._simplifyPoints(), this._updatePath());
    },
    _updatePath: function () {
      this._renderer._updatePoly(this);
    },
    _containsPoint: function (t, i) {
      var e,
          n,
          o,
          s,
          r,
          a,
          h = this._clickTolerance();

      if (!this._pxBounds || !this._pxBounds.contains(t)) return !1;

      for (e = 0, s = this._parts.length; e < s; e++) for (n = 0, o = (r = (a = this._parts[e]).length) - 1; n < r; o = n++) if ((i || 0 !== n) && _e(t, a[o], a[n]) <= h) return !0;

      return !1;
    }
  });
  De._flat = ve;
  var je = De.extend({
    options: {
      fill: !0
    },
    isEmpty: function () {
      return !this._latlngs.length || !this._latlngs[0].length;
    },
    getCenter: function () {
      if (!this._map) throw new Error("Must add layer to map before using getCenter()");
      var t,
          i,
          e,
          n,
          o,
          s,
          r,
          a,
          h,
          u = this._rings[0],
          l = u.length;
      if (!l) return null;

      for (s = r = a = 0, t = 0, i = l - 1; t < l; i = t++) e = u[t], n = u[i], o = e.y * n.x - n.y * e.x, r += (e.x + n.x) * o, a += (e.y + n.y) * o, s += 3 * o;

      return h = 0 === s ? u[0] : [r / s, a / s], this._map.layerPointToLatLng(h);
    },
    _convertLatLngs: function (t) {
      var i = De.prototype._convertLatLngs.call(this, t),
          e = i.length;

      return 2 <= e && i[0] instanceof j && i[0].equals(i[e - 1]) && i.pop(), i;
    },
    _setLatLngs: function (t) {
      De.prototype._setLatLngs.call(this, t), ge(this._latlngs) && (this._latlngs = [this._latlngs]);
    },
    _defaultShape: function () {
      return ge(this._latlngs[0]) ? this._latlngs[0] : this._latlngs[0][0];
    },
    _clipPoints: function () {
      var t = this._renderer._bounds,
          i = this.options.weight,
          e = new B(i, i);
      if (t = new O(t.min.subtract(e), t.max.add(e)), this._parts = [], this._pxBounds && this._pxBounds.intersects(t)) if (this.options.noClip) this._parts = this._rings;else for (var n, o = 0, s = this._rings.length; o < s; o++) (n = xe(this._rings[o], t, !0)).length && this._parts.push(n);
    },
    _updatePath: function () {
      this._renderer._updatePoly(this, !0);
    },
    _containsPoint: function (t) {
      var i,
          e,
          n,
          o,
          s,
          r,
          a,
          h,
          u = !1;
      if (!this._pxBounds || !this._pxBounds.contains(t)) return !1;

      for (o = 0, a = this._parts.length; o < a; o++) for (s = 0, r = (h = (i = this._parts[o]).length) - 1; s < h; r = s++) e = i[s], n = i[r], e.y > t.y != n.y > t.y && t.x < (n.x - e.x) * (t.y - e.y) / (n.y - e.y) + e.x && (u = !u);

      return u || De.prototype._containsPoint.call(this, t, !0);
    }
  });
  var We = Ee.extend({
    initialize: function (t, i) {
      p(this, i), this._layers = {}, t && this.addData(t);
    },
    addData: function (t) {
      var i,
          e,
          n,
          o = v(t) ? t : t.features;

      if (o) {
        for (i = 0, e = o.length; i < e; i++) ((n = o[i]).geometries || n.geometry || n.features || n.coordinates) && this.addData(n);

        return this;
      }

      var s = this.options;
      if (s.filter && !s.filter(t)) return this;
      var r = He(t, s);
      return r ? (r.feature = Ke(t), r.defaultOptions = r.options, this.resetStyle(r), s.onEachFeature && s.onEachFeature(t, r), this.addLayer(r)) : this;
    },
    resetStyle: function (t) {
      return t.options = h({}, t.defaultOptions), this._setLayerStyle(t, this.options.style), this;
    },
    setStyle: function (i) {
      return this.eachLayer(function (t) {
        this._setLayerStyle(t, i);
      }, this);
    },
    _setLayerStyle: function (t, i) {
      t.setStyle && ("function" == typeof i && (i = i(t.feature)), t.setStyle(i));
    }
  });

  function He(t, i) {
    var e,
        n,
        o,
        s,
        r = "Feature" === t.type ? t.geometry : t,
        a = r ? r.coordinates : null,
        h = [],
        u = i && i.pointToLayer,
        l = i && i.coordsToLatLng || Fe;
    if (!a && !r) return null;

    switch (r.type) {
      case "Point":
        return e = l(a), u ? u(t, e) : new Ie(e);

      case "MultiPoint":
        for (o = 0, s = a.length; o < s; o++) e = l(a[o]), h.push(u ? u(t, e) : new Ie(e));

        return new Ee(h);

      case "LineString":
      case "MultiLineString":
        return n = Ue(a, "LineString" === r.type ? 0 : 1, l), new De(n, i);

      case "Polygon":
      case "MultiPolygon":
        return n = Ue(a, "Polygon" === r.type ? 1 : 2, l), new je(n, i);

      case "GeometryCollection":
        for (o = 0, s = r.geometries.length; o < s; o++) {
          var c = He({
            geometry: r.geometries[o],
            type: "Feature",
            properties: t.properties
          }, i);
          c && h.push(c);
        }

        return new Ee(h);

      default:
        throw new Error("Invalid GeoJSON object.");
    }
  }

  function Fe(t) {
    return new j(t[1], t[0], t[2]);
  }

  function Ue(t, i, e) {
    for (var n, o = [], s = 0, r = t.length; s < r; s++) n = i ? Ue(t[s], i - 1, e) : (e || Fe)(t[s]), o.push(n);

    return o;
  }

  function Ve(t, i) {
    return i = "number" == typeof i ? i : 6, void 0 !== t.alt ? [c(t.lng, i), c(t.lat, i), c(t.alt, i)] : [c(t.lng, i), c(t.lat, i)];
  }

  function qe(t, i, e, n) {
    for (var o = [], s = 0, r = t.length; s < r; s++) o.push(i ? qe(t[s], i - 1, e, n) : Ve(t[s], n));

    return !i && e && o.push(o[0]), o;
  }

  function Ge(t, i) {
    return t.feature ? h({}, t.feature, {
      geometry: i
    }) : Ke(i);
  }

  function Ke(t) {
    return "Feature" === t.type || "FeatureCollection" === t.type ? t : {
      type: "Feature",
      properties: {},
      geometry: t
    };
  }

  var Ye = {
    toGeoJSON: function (t) {
      return Ge(this, {
        type: "Point",
        coordinates: Ve(this.getLatLng(), t)
      });
    }
  };

  function Xe(t, i) {
    return new We(t, i);
  }

  Ie.include(Ye), Ne.include(Ye), Re.include(Ye), De.include({
    toGeoJSON: function (t) {
      var i = !ge(this._latlngs);
      return Ge(this, {
        type: (i ? "Multi" : "") + "LineString",
        coordinates: qe(this._latlngs, i ? 1 : 0, !1, t)
      });
    }
  }), je.include({
    toGeoJSON: function (t) {
      var i = !ge(this._latlngs),
          e = i && !ge(this._latlngs[0]),
          n = qe(this._latlngs, e ? 2 : i ? 1 : 0, !0, t);
      return i || (n = [n]), Ge(this, {
        type: (e ? "Multi" : "") + "Polygon",
        coordinates: n
      });
    }
  }), Ze.include({
    toMultiPoint: function (i) {
      var e = [];
      return this.eachLayer(function (t) {
        e.push(t.toGeoJSON(i).geometry.coordinates);
      }), Ge(this, {
        type: "MultiPoint",
        coordinates: e
      });
    },
    toGeoJSON: function (n) {
      var t = this.feature && this.feature.geometry && this.feature.geometry.type;
      if ("MultiPoint" === t) return this.toMultiPoint(n);
      var o = "GeometryCollection" === t,
          s = [];
      return this.eachLayer(function (t) {
        if (t.toGeoJSON) {
          var i = t.toGeoJSON(n);
          if (o) s.push(i.geometry);else {
            var e = Ke(i);
            "FeatureCollection" === e.type ? s.push.apply(s, e.features) : s.push(e);
          }
        }
      }), o ? Ge(this, {
        geometries: s,
        type: "GeometryCollection"
      }) : {
        type: "FeatureCollection",
        features: s
      };
    }
  });
  var Je = Xe,
      $e = Se.extend({
    options: {
      opacity: 1,
      alt: "",
      interactive: !1,
      crossOrigin: !1,
      errorOverlayUrl: "",
      zIndex: 1,
      className: ""
    },
    initialize: function (t, i, e) {
      this._url = t, this._bounds = D(i), p(this, e);
    },
    onAdd: function () {
      this._image || (this._initImage(), this.options.opacity < 1 && this._updateOpacity()), this.options.interactive && (pi(this._image, "leaflet-interactive"), this.addInteractiveTarget(this._image)), this.getPane().appendChild(this._image), this._reset();
    },
    onRemove: function () {
      ui(this._image), this.options.interactive && this.removeInteractiveTarget(this._image);
    },
    setOpacity: function (t) {
      return this.options.opacity = t, this._image && this._updateOpacity(), this;
    },
    setStyle: function (t) {
      return t.opacity && this.setOpacity(t.opacity), this;
    },
    bringToFront: function () {
      return this._map && ci(this._image), this;
    },
    bringToBack: function () {
      return this._map && _i(this._image), this;
    },
    setUrl: function (t) {
      return this._url = t, this._image && (this._image.src = t), this;
    },
    setBounds: function (t) {
      return this._bounds = D(t), this._map && this._reset(), this;
    },
    getEvents: function () {
      var t = {
        zoom: this._reset,
        viewreset: this._reset
      };
      return this._zoomAnimated && (t.zoomanim = this._animateZoom), t;
    },
    setZIndex: function (t) {
      return this.options.zIndex = t, this._updateZIndex(), this;
    },
    getBounds: function () {
      return this._bounds;
    },
    getElement: function () {
      return this._image;
    },
    _initImage: function () {
      var t = "IMG" === this._url.tagName,
          i = this._image = t ? this._url : hi("img");
      pi(i, "leaflet-image-layer"), this._zoomAnimated && pi(i, "leaflet-zoom-animated"), this.options.className && pi(i, this.options.className), i.onselectstart = l, i.onmousemove = l, i.onload = a(this.fire, this, "load"), i.onerror = a(this._overlayOnError, this, "error"), !this.options.crossOrigin && "" !== this.options.crossOrigin || (i.crossOrigin = !0 === this.options.crossOrigin ? "" : this.options.crossOrigin), this.options.zIndex && this._updateZIndex(), t ? this._url = i.src : (i.src = this._url, i.alt = this.options.alt);
    },
    _animateZoom: function (t) {
      var i = this._map.getZoomScale(t.zoom),
          e = this._map._latLngBoundsToNewLayerBounds(this._bounds, t.zoom, t.center).min;

      xi(this._image, e, i);
    },
    _reset: function () {
      var t = this._image,
          i = new O(this._map.latLngToLayerPoint(this._bounds.getNorthWest()), this._map.latLngToLayerPoint(this._bounds.getSouthEast())),
          e = i.getSize();
      wi(t, i.min), t.style.width = e.x + "px", t.style.height = e.y + "px";
    },
    _updateOpacity: function () {
      vi(this._image, this.options.opacity);
    },
    _updateZIndex: function () {
      this._image && void 0 !== this.options.zIndex && null !== this.options.zIndex && (this._image.style.zIndex = this.options.zIndex);
    },
    _overlayOnError: function () {
      this.fire("error");
      var t = this.options.errorOverlayUrl;
      t && this._url !== t && (this._url = t, this._image.src = t);
    }
  }),
      Qe = $e.extend({
    options: {
      autoplay: !0,
      loop: !0,
      keepAspectRatio: !0
    },
    _initImage: function () {
      var t = "VIDEO" === this._url.tagName,
          i = this._image = t ? this._url : hi("video");

      if (pi(i, "leaflet-image-layer"), this._zoomAnimated && pi(i, "leaflet-zoom-animated"), i.onselectstart = l, i.onmousemove = l, i.onloadeddata = a(this.fire, this, "load"), t) {
        for (var e = i.getElementsByTagName("source"), n = [], o = 0; o < e.length; o++) n.push(e[o].src);

        this._url = 0 < e.length ? n : [i.src];
      } else {
        v(this._url) || (this._url = [this._url]), !this.options.keepAspectRatio && i.style.hasOwnProperty("objectFit") && (i.style.objectFit = "fill"), i.autoplay = !!this.options.autoplay, i.loop = !!this.options.loop;

        for (var s = 0; s < this._url.length; s++) {
          var r = hi("source");
          r.src = this._url[s], i.appendChild(r);
        }
      }
    }
  });
  var tn = $e.extend({
    _initImage: function () {
      var t = this._image = this._url;
      pi(t, "leaflet-image-layer"), this._zoomAnimated && pi(t, "leaflet-zoom-animated"), t.onselectstart = l, t.onmousemove = l;
    }
  });
  var en = Se.extend({
    options: {
      offset: [0, 7],
      className: "",
      pane: "popupPane"
    },
    initialize: function (t, i) {
      p(this, t), this._source = i;
    },
    onAdd: function (t) {
      this._zoomAnimated = t._zoomAnimated, this._container || this._initLayout(), t._fadeAnimated && vi(this._container, 0), clearTimeout(this._removeTimeout), this.getPane().appendChild(this._container), this.update(), t._fadeAnimated && vi(this._container, 1), this.bringToFront();
    },
    onRemove: function (t) {
      t._fadeAnimated ? (vi(this._container, 0), this._removeTimeout = setTimeout(a(ui, void 0, this._container), 200)) : ui(this._container);
    },
    getLatLng: function () {
      return this._latlng;
    },
    setLatLng: function (t) {
      return this._latlng = W(t), this._map && (this._updatePosition(), this._adjustPan()), this;
    },
    getContent: function () {
      return this._content;
    },
    setContent: function (t) {
      return this._content = t, this.update(), this;
    },
    getElement: function () {
      return this._container;
    },
    update: function () {
      this._map && (this._container.style.visibility = "hidden", this._updateContent(), this._updateLayout(), this._updatePosition(), this._container.style.visibility = "", this._adjustPan());
    },
    getEvents: function () {
      var t = {
        zoom: this._updatePosition,
        viewreset: this._updatePosition
      };
      return this._zoomAnimated && (t.zoomanim = this._animateZoom), t;
    },
    isOpen: function () {
      return !!this._map && this._map.hasLayer(this);
    },
    bringToFront: function () {
      return this._map && ci(this._container), this;
    },
    bringToBack: function () {
      return this._map && _i(this._container), this;
    },
    _prepareOpen: function (t, i, e) {
      if (i instanceof Se || (e = i, i = t), i instanceof Ee) for (var n in t._layers) {
        i = t._layers[n];
        break;
      }
      if (!e) if (i.getCenter) e = i.getCenter();else {
        if (!i.getLatLng) throw new Error("Unable to get source layer LatLng.");
        e = i.getLatLng();
      }
      return this._source = i, this.update(), e;
    },
    _updateContent: function () {
      if (this._content) {
        var t = this._contentNode,
            i = "function" == typeof this._content ? this._content(this._source || this) : this._content;
        if ("string" == typeof i) t.innerHTML = i;else {
          for (; t.hasChildNodes();) t.removeChild(t.firstChild);

          t.appendChild(i);
        }
        this.fire("contentupdate");
      }
    },
    _updatePosition: function () {
      if (this._map) {
        var t = this._map.latLngToLayerPoint(this._latlng),
            i = I(this.options.offset),
            e = this._getAnchor();

        this._zoomAnimated ? wi(this._container, t.add(e)) : i = i.add(t).add(e);
        var n = this._containerBottom = -i.y,
            o = this._containerLeft = -Math.round(this._containerWidth / 2) + i.x;
        this._container.style.bottom = n + "px", this._container.style.left = o + "px";
      }
    },
    _getAnchor: function () {
      return [0, 0];
    }
  }),
      nn = en.extend({
    options: {
      maxWidth: 300,
      minWidth: 50,
      maxHeight: null,
      autoPan: !0,
      autoPanPaddingTopLeft: null,
      autoPanPaddingBottomRight: null,
      autoPanPadding: [5, 5],
      keepInView: !1,
      closeButton: !0,
      autoClose: !0,
      closeOnEscapeKey: !0,
      className: ""
    },
    openOn: function (t) {
      return t.openPopup(this), this;
    },
    onAdd: function (t) {
      en.prototype.onAdd.call(this, t), t.fire("popupopen", {
        popup: this
      }), this._source && (this._source.fire("popupopen", {
        popup: this
      }, !0), this._source instanceof Oe || this._source.on("preclick", Oi));
    },
    onRemove: function (t) {
      en.prototype.onRemove.call(this, t), t.fire("popupclose", {
        popup: this
      }), this._source && (this._source.fire("popupclose", {
        popup: this
      }, !0), this._source instanceof Oe || this._source.off("preclick", Oi));
    },
    getEvents: function () {
      var t = en.prototype.getEvents.call(this);
      return (void 0 !== this.options.closeOnClick ? this.options.closeOnClick : this._map.options.closePopupOnClick) && (t.preclick = this._close), this.options.keepInView && (t.moveend = this._adjustPan), t;
    },
    _close: function () {
      this._map && this._map.closePopup(this);
    },
    _initLayout: function () {
      var t = "leaflet-popup",
          i = this._container = hi("div", t + " " + (this.options.className || "") + " leaflet-zoom-animated"),
          e = this._wrapper = hi("div", t + "-content-wrapper", i);

      if (this._contentNode = hi("div", t + "-content", e), Ni(e), Ri(this._contentNode), Ei(e, "contextmenu", Oi), this._tipContainer = hi("div", t + "-tip-container", i), this._tip = hi("div", t + "-tip", this._tipContainer), this.options.closeButton) {
        var n = this._closeButton = hi("a", t + "-close-button", i);
        n.href = "#close", n.innerHTML = "&#215;", Ei(n, "click", this._onCloseButtonClick, this);
      }
    },
    _updateLayout: function () {
      var t = this._contentNode,
          i = t.style;
      i.width = "", i.whiteSpace = "nowrap";
      var e = t.offsetWidth;
      e = Math.min(e, this.options.maxWidth), e = Math.max(e, this.options.minWidth), i.width = e + 1 + "px", i.whiteSpace = "", i.height = "";
      var n = t.offsetHeight,
          o = this.options.maxHeight,
          s = "leaflet-popup-scrolled";
      o && o < n ? (i.height = o + "px", pi(t, s)) : mi(t, s), this._containerWidth = this._container.offsetWidth;
    },
    _animateZoom: function (t) {
      var i = this._map._latLngToNewLayerPoint(this._latlng, t.zoom, t.center),
          e = this._getAnchor();

      wi(this._container, i.add(e));
    },
    _adjustPan: function () {
      if (this.options.autoPan) {
        this._map._panAnim && this._map._panAnim.stop();
        var t = this._map,
            i = parseInt(ai(this._container, "marginBottom"), 10) || 0,
            e = this._container.offsetHeight + i,
            n = this._containerWidth,
            o = new B(this._containerLeft, -e - this._containerBottom);

        o._add(Pi(this._container));

        var s = t.layerPointToContainerPoint(o),
            r = I(this.options.autoPanPadding),
            a = I(this.options.autoPanPaddingTopLeft || r),
            h = I(this.options.autoPanPaddingBottomRight || r),
            u = t.getSize(),
            l = 0,
            c = 0;
        s.x + n + h.x > u.x && (l = s.x + n - u.x + h.x), s.x - l - a.x < 0 && (l = s.x - a.x), s.y + e + h.y > u.y && (c = s.y + e - u.y + h.y), s.y - c - a.y < 0 && (c = s.y - a.y), (l || c) && t.fire("autopanstart").panBy([l, c]);
      }
    },
    _onCloseButtonClick: function (t) {
      this._close(), ji(t);
    },
    _getAnchor: function () {
      return I(this._source && this._source._getPopupAnchor ? this._source._getPopupAnchor() : [0, 0]);
    }
  });
  Ji.mergeOptions({
    closePopupOnClick: !0
  }), Ji.include({
    openPopup: function (t, i, e) {
      return t instanceof nn || (t = new nn(e).setContent(t)), i && t.setLatLng(i), this.hasLayer(t) ? this : (this._popup && this._popup.options.autoClose && this.closePopup(), this._popup = t, this.addLayer(t));
    },
    closePopup: function (t) {
      return t && t !== this._popup || (t = this._popup, this._popup = null), t && this.removeLayer(t), this;
    }
  }), Se.include({
    bindPopup: function (t, i) {
      return t instanceof nn ? (p(t, i), (this._popup = t)._source = this) : (this._popup && !i || (this._popup = new nn(i, this)), this._popup.setContent(t)), this._popupHandlersAdded || (this.on({
        click: this._openPopup,
        keypress: this._onKeyPress,
        remove: this.closePopup,
        move: this._movePopup
      }), this._popupHandlersAdded = !0), this;
    },
    unbindPopup: function () {
      return this._popup && (this.off({
        click: this._openPopup,
        keypress: this._onKeyPress,
        remove: this.closePopup,
        move: this._movePopup
      }), this._popupHandlersAdded = !1, this._popup = null), this;
    },
    openPopup: function (t, i) {
      return this._popup && this._map && (i = this._popup._prepareOpen(this, t, i), this._map.openPopup(this._popup, i)), this;
    },
    closePopup: function () {
      return this._popup && this._popup._close(), this;
    },
    togglePopup: function (t) {
      return this._popup && (this._popup._map ? this.closePopup() : this.openPopup(t)), this;
    },
    isPopupOpen: function () {
      return !!this._popup && this._popup.isOpen();
    },
    setPopupContent: function (t) {
      return this._popup && this._popup.setContent(t), this;
    },
    getPopup: function () {
      return this._popup;
    },
    _openPopup: function (t) {
      var i = t.layer || t.target;
      this._popup && this._map && (ji(t), i instanceof Oe ? this.openPopup(t.layer || t.target, t.latlng) : this._map.hasLayer(this._popup) && this._popup._source === i ? this.closePopup() : this.openPopup(i, t.latlng));
    },
    _movePopup: function (t) {
      this._popup.setLatLng(t.latlng);
    },
    _onKeyPress: function (t) {
      13 === t.originalEvent.keyCode && this._openPopup(t);
    }
  });
  var on = en.extend({
    options: {
      pane: "tooltipPane",
      offset: [0, 0],
      direction: "auto",
      permanent: !1,
      sticky: !1,
      interactive: !1,
      opacity: .9
    },
    onAdd: function (t) {
      en.prototype.onAdd.call(this, t), this.setOpacity(this.options.opacity), t.fire("tooltipopen", {
        tooltip: this
      }), this._source && this._source.fire("tooltipopen", {
        tooltip: this
      }, !0);
    },
    onRemove: function (t) {
      en.prototype.onRemove.call(this, t), t.fire("tooltipclose", {
        tooltip: this
      }), this._source && this._source.fire("tooltipclose", {
        tooltip: this
      }, !0);
    },
    getEvents: function () {
      var t = en.prototype.getEvents.call(this);
      return Tt && !this.options.permanent && (t.preclick = this._close), t;
    },
    _close: function () {
      this._map && this._map.closeTooltip(this);
    },
    _initLayout: function () {
      var t = "leaflet-tooltip " + (this.options.className || "") + " leaflet-zoom-" + (this._zoomAnimated ? "animated" : "hide");
      this._contentNode = this._container = hi("div", t);
    },
    _updateLayout: function () {},
    _adjustPan: function () {},
    _setPosition: function (t) {
      var i = this._map,
          e = this._container,
          n = i.latLngToContainerPoint(i.getCenter()),
          o = i.layerPointToContainerPoint(t),
          s = this.options.direction,
          r = e.offsetWidth,
          a = e.offsetHeight,
          h = I(this.options.offset),
          u = this._getAnchor();

      t = "top" === s ? t.add(I(-r / 2 + h.x, -a + h.y + u.y, !0)) : "bottom" === s ? t.subtract(I(r / 2 - h.x, -h.y, !0)) : "center" === s ? t.subtract(I(r / 2 + h.x, a / 2 - u.y + h.y, !0)) : "right" === s || "auto" === s && o.x < n.x ? (s = "right", t.add(I(h.x + u.x, u.y - a / 2 + h.y, !0))) : (s = "left", t.subtract(I(r + u.x - h.x, a / 2 - u.y - h.y, !0))), mi(e, "leaflet-tooltip-right"), mi(e, "leaflet-tooltip-left"), mi(e, "leaflet-tooltip-top"), mi(e, "leaflet-tooltip-bottom"), pi(e, "leaflet-tooltip-" + s), wi(e, t);
    },
    _updatePosition: function () {
      var t = this._map.latLngToLayerPoint(this._latlng);

      this._setPosition(t);
    },
    setOpacity: function (t) {
      this.options.opacity = t, this._container && vi(this._container, t);
    },
    _animateZoom: function (t) {
      var i = this._map._latLngToNewLayerPoint(this._latlng, t.zoom, t.center);

      this._setPosition(i);
    },
    _getAnchor: function () {
      return I(this._source && this._source._getTooltipAnchor && !this.options.sticky ? this._source._getTooltipAnchor() : [0, 0]);
    }
  });
  Ji.include({
    openTooltip: function (t, i, e) {
      return t instanceof on || (t = new on(e).setContent(t)), i && t.setLatLng(i), this.hasLayer(t) ? this : this.addLayer(t);
    },
    closeTooltip: function (t) {
      return t && this.removeLayer(t), this;
    }
  }), Se.include({
    bindTooltip: function (t, i) {
      return t instanceof on ? (p(t, i), (this._tooltip = t)._source = this) : (this._tooltip && !i || (this._tooltip = new on(i, this)), this._tooltip.setContent(t)), this._initTooltipInteractions(), this._tooltip.options.permanent && this._map && this._map.hasLayer(this) && this.openTooltip(), this;
    },
    unbindTooltip: function () {
      return this._tooltip && (this._initTooltipInteractions(!0), this.closeTooltip(), this._tooltip = null), this;
    },
    _initTooltipInteractions: function (t) {
      if (t || !this._tooltipHandlersAdded) {
        var i = t ? "off" : "on",
            e = {
          remove: this.closeTooltip,
          move: this._moveTooltip
        };
        this._tooltip.options.permanent ? e.add = this._openTooltip : (e.mouseover = this._openTooltip, e.mouseout = this.closeTooltip, this._tooltip.options.sticky && (e.mousemove = this._moveTooltip), Tt && (e.click = this._openTooltip)), this[i](e), this._tooltipHandlersAdded = !t;
      }
    },
    openTooltip: function (t, i) {
      return this._tooltip && this._map && (i = this._tooltip._prepareOpen(this, t, i), this._map.openTooltip(this._tooltip, i), this._tooltip.options.interactive && this._tooltip._container && (pi(this._tooltip._container, "leaflet-clickable"), this.addInteractiveTarget(this._tooltip._container))), this;
    },
    closeTooltip: function () {
      return this._tooltip && (this._tooltip._close(), this._tooltip.options.interactive && this._tooltip._container && (mi(this._tooltip._container, "leaflet-clickable"), this.removeInteractiveTarget(this._tooltip._container))), this;
    },
    toggleTooltip: function (t) {
      return this._tooltip && (this._tooltip._map ? this.closeTooltip() : this.openTooltip(t)), this;
    },
    isTooltipOpen: function () {
      return this._tooltip.isOpen();
    },
    setTooltipContent: function (t) {
      return this._tooltip && this._tooltip.setContent(t), this;
    },
    getTooltip: function () {
      return this._tooltip;
    },
    _openTooltip: function (t) {
      var i = t.layer || t.target;
      this._tooltip && this._map && this.openTooltip(i, this._tooltip.options.sticky ? t.latlng : void 0);
    },
    _moveTooltip: function (t) {
      var i,
          e,
          n = t.latlng;
      this._tooltip.options.sticky && t.originalEvent && (i = this._map.mouseEventToContainerPoint(t.originalEvent), e = this._map.containerPointToLayerPoint(i), n = this._map.layerPointToLatLng(e)), this._tooltip.setLatLng(n);
    }
  });
  var sn = ke.extend({
    options: {
      iconSize: [12, 12],
      html: !1,
      bgPos: null,
      className: "leaflet-div-icon"
    },
    createIcon: function (t) {
      var i = t && "DIV" === t.tagName ? t : document.createElement("div"),
          e = this.options;

      if (e.html instanceof Element ? (li(i), i.appendChild(e.html)) : i.innerHTML = !1 !== e.html ? e.html : "", e.bgPos) {
        var n = I(e.bgPos);
        i.style.backgroundPosition = -n.x + "px " + -n.y + "px";
      }

      return this._setIconStyles(i, "icon"), i;
    },
    createShadow: function () {
      return null;
    }
  });
  ke.Default = Be;
  var rn = Se.extend({
    options: {
      tileSize: 256,
      opacity: 1,
      updateWhenIdle: xt,
      updateWhenZooming: !0,
      updateInterval: 200,
      zIndex: 1,
      bounds: null,
      minZoom: 0,
      maxZoom: void 0,
      maxNativeZoom: void 0,
      minNativeZoom: void 0,
      noWrap: !1,
      pane: "tilePane",
      className: "",
      keepBuffer: 2
    },
    initialize: function (t) {
      p(this, t);
    },
    onAdd: function () {
      this._initContainer(), this._levels = {}, this._tiles = {}, this._resetView(), this._update();
    },
    beforeAdd: function (t) {
      t._addZoomLimit(this);
    },
    onRemove: function (t) {
      this._removeAllTiles(), ui(this._container), t._removeZoomLimit(this), this._container = null, this._tileZoom = void 0;
    },
    bringToFront: function () {
      return this._map && (ci(this._container), this._setAutoZIndex(Math.max)), this;
    },
    bringToBack: function () {
      return this._map && (_i(this._container), this._setAutoZIndex(Math.min)), this;
    },
    getContainer: function () {
      return this._container;
    },
    setOpacity: function (t) {
      return this.options.opacity = t, this._updateOpacity(), this;
    },
    setZIndex: function (t) {
      return this.options.zIndex = t, this._updateZIndex(), this;
    },
    isLoading: function () {
      return this._loading;
    },
    redraw: function () {
      return this._map && (this._removeAllTiles(), this._update()), this;
    },
    getEvents: function () {
      var t = {
        viewprereset: this._invalidateAll,
        viewreset: this._resetView,
        zoom: this._resetView,
        moveend: this._onMoveEnd
      };
      return this.options.updateWhenIdle || (this._onMove || (this._onMove = o(this._onMoveEnd, this.options.updateInterval, this)), t.move = this._onMove), this._zoomAnimated && (t.zoomanim = this._animateZoom), t;
    },
    createTile: function () {
      return document.createElement("div");
    },
    getTileSize: function () {
      var t = this.options.tileSize;
      return t instanceof B ? t : new B(t, t);
    },
    _updateZIndex: function () {
      this._container && void 0 !== this.options.zIndex && null !== this.options.zIndex && (this._container.style.zIndex = this.options.zIndex);
    },
    _setAutoZIndex: function (t) {
      for (var i, e = this.getPane().children, n = -t(-1 / 0, 1 / 0), o = 0, s = e.length; o < s; o++) i = e[o].style.zIndex, e[o] !== this._container && i && (n = t(n, +i));

      isFinite(n) && (this.options.zIndex = n + t(-1, 1), this._updateZIndex());
    },
    _updateOpacity: function () {
      if (this._map && !et) {
        vi(this._container, this.options.opacity);
        var t = +new Date(),
            i = !1,
            e = !1;

        for (var n in this._tiles) {
          var o = this._tiles[n];

          if (o.current && o.loaded) {
            var s = Math.min(1, (t - o.loaded) / 200);
            vi(o.el, s), s < 1 ? i = !0 : (o.active ? e = !0 : this._onOpaqueTile(o), o.active = !0);
          }
        }

        e && !this._noPrune && this._pruneTiles(), i && (C(this._fadeFrame), this._fadeFrame = M(this._updateOpacity, this));
      }
    },
    _onOpaqueTile: l,
    _initContainer: function () {
      this._container || (this._container = hi("div", "leaflet-layer " + (this.options.className || "")), this._updateZIndex(), this.options.opacity < 1 && this._updateOpacity(), this.getPane().appendChild(this._container));
    },
    _updateLevels: function () {
      var t = this._tileZoom,
          i = this.options.maxZoom;

      if (void 0 !== t) {
        for (var e in this._levels) this._levels[e].el.children.length || e === t ? (this._levels[e].el.style.zIndex = i - Math.abs(t - e), this._onUpdateLevel(e)) : (ui(this._levels[e].el), this._removeTilesAtZoom(e), this._onRemoveLevel(e), delete this._levels[e]);

        var n = this._levels[t],
            o = this._map;
        return n || ((n = this._levels[t] = {}).el = hi("div", "leaflet-tile-container leaflet-zoom-animated", this._container), n.el.style.zIndex = i, n.origin = o.project(o.unproject(o.getPixelOrigin()), t).round(), n.zoom = t, this._setZoomTransform(n, o.getCenter(), o.getZoom()), n.el.offsetWidth, this._onCreateLevel(n)), this._level = n;
      }
    },
    _onUpdateLevel: l,
    _onRemoveLevel: l,
    _onCreateLevel: l,
    _pruneTiles: function () {
      if (this._map) {
        var t,
            i,
            e = this._map.getZoom();

        if (e > this.options.maxZoom || e < this.options.minZoom) this._removeAllTiles();else {
          for (t in this._tiles) (i = this._tiles[t]).retain = i.current;

          for (t in this._tiles) if ((i = this._tiles[t]).current && !i.active) {
            var n = i.coords;
            this._retainParent(n.x, n.y, n.z, n.z - 5) || this._retainChildren(n.x, n.y, n.z, n.z + 2);
          }

          for (t in this._tiles) this._tiles[t].retain || this._removeTile(t);
        }
      }
    },
    _removeTilesAtZoom: function (t) {
      for (var i in this._tiles) this._tiles[i].coords.z === t && this._removeTile(i);
    },
    _removeAllTiles: function () {
      for (var t in this._tiles) this._removeTile(t);
    },
    _invalidateAll: function () {
      for (var t in this._levels) ui(this._levels[t].el), this._onRemoveLevel(t), delete this._levels[t];

      this._removeAllTiles(), this._tileZoom = void 0;
    },
    _retainParent: function (t, i, e, n) {
      var o = Math.floor(t / 2),
          s = Math.floor(i / 2),
          r = e - 1,
          a = new B(+o, +s);
      a.z = +r;

      var h = this._tileCoordsToKey(a),
          u = this._tiles[h];

      return u && u.active ? u.retain = !0 : (u && u.loaded && (u.retain = !0), n < r && this._retainParent(o, s, r, n));
    },
    _retainChildren: function (t, i, e, n) {
      for (var o = 2 * t; o < 2 * t + 2; o++) for (var s = 2 * i; s < 2 * i + 2; s++) {
        var r = new B(o, s);
        r.z = e + 1;

        var a = this._tileCoordsToKey(r),
            h = this._tiles[a];

        h && h.active ? h.retain = !0 : (h && h.loaded && (h.retain = !0), e + 1 < n && this._retainChildren(o, s, e + 1, n));
      }
    },
    _resetView: function (t) {
      var i = t && (t.pinch || t.flyTo);

      this._setView(this._map.getCenter(), this._map.getZoom(), i, i);
    },
    _animateZoom: function (t) {
      this._setView(t.center, t.zoom, !0, t.noUpdate);
    },
    _clampZoom: function (t) {
      var i = this.options;
      return void 0 !== i.minNativeZoom && t < i.minNativeZoom ? i.minNativeZoom : void 0 !== i.maxNativeZoom && i.maxNativeZoom < t ? i.maxNativeZoom : t;
    },
    _setView: function (t, i, e, n) {
      var o = this._clampZoom(Math.round(i));

      (void 0 !== this.options.maxZoom && o > this.options.maxZoom || void 0 !== this.options.minZoom && o < this.options.minZoom) && (o = void 0);
      var s = this.options.updateWhenZooming && o !== this._tileZoom;
      n && !s || (this._tileZoom = o, this._abortLoading && this._abortLoading(), this._updateLevels(), this._resetGrid(), void 0 !== o && this._update(t), e || this._pruneTiles(), this._noPrune = !!e), this._setZoomTransforms(t, i);
    },
    _setZoomTransforms: function (t, i) {
      for (var e in this._levels) this._setZoomTransform(this._levels[e], t, i);
    },
    _setZoomTransform: function (t, i, e) {
      var n = this._map.getZoomScale(e, t.zoom),
          o = t.origin.multiplyBy(n).subtract(this._map._getNewPixelOrigin(i, e)).round();

      yt ? xi(t.el, o, n) : wi(t.el, o);
    },
    _resetGrid: function () {
      var t = this._map,
          i = t.options.crs,
          e = this._tileSize = this.getTileSize(),
          n = this._tileZoom,
          o = this._map.getPixelWorldBounds(this._tileZoom);

      o && (this._globalTileRange = this._pxBoundsToTileRange(o)), this._wrapX = i.wrapLng && !this.options.noWrap && [Math.floor(t.project([0, i.wrapLng[0]], n).x / e.x), Math.ceil(t.project([0, i.wrapLng[1]], n).x / e.y)], this._wrapY = i.wrapLat && !this.options.noWrap && [Math.floor(t.project([i.wrapLat[0], 0], n).y / e.x), Math.ceil(t.project([i.wrapLat[1], 0], n).y / e.y)];
    },
    _onMoveEnd: function () {
      this._map && !this._map._animatingZoom && this._update();
    },
    _getTiledPixelBounds: function (t) {
      var i = this._map,
          e = i._animatingZoom ? Math.max(i._animateToZoom, i.getZoom()) : i.getZoom(),
          n = i.getZoomScale(e, this._tileZoom),
          o = i.project(t, this._tileZoom).floor(),
          s = i.getSize().divideBy(2 * n);
      return new O(o.subtract(s), o.add(s));
    },
    _update: function (t) {
      var i = this._map;

      if (i) {
        var e = this._clampZoom(i.getZoom());

        if (void 0 === t && (t = i.getCenter()), void 0 !== this._tileZoom) {
          var n = this._getTiledPixelBounds(t),
              o = this._pxBoundsToTileRange(n),
              s = o.getCenter(),
              r = [],
              a = this.options.keepBuffer,
              h = new O(o.getBottomLeft().subtract([a, -a]), o.getTopRight().add([a, -a]));

          if (!(isFinite(o.min.x) && isFinite(o.min.y) && isFinite(o.max.x) && isFinite(o.max.y))) throw new Error("Attempted to load an infinite number of tiles");

          for (var u in this._tiles) {
            var l = this._tiles[u].coords;
            l.z === this._tileZoom && h.contains(new B(l.x, l.y)) || (this._tiles[u].current = !1);
          }

          if (1 < Math.abs(e - this._tileZoom)) this._setView(t, e);else {
            for (var c = o.min.y; c <= o.max.y; c++) for (var _ = o.min.x; _ <= o.max.x; _++) {
              var d = new B(_, c);

              if (d.z = this._tileZoom, this._isValidTile(d)) {
                var p = this._tiles[this._tileCoordsToKey(d)];

                p ? p.current = !0 : r.push(d);
              }
            }

            if (r.sort(function (t, i) {
              return t.distanceTo(s) - i.distanceTo(s);
            }), 0 !== r.length) {
              this._loading || (this._loading = !0, this.fire("loading"));
              var m = document.createDocumentFragment();

              for (_ = 0; _ < r.length; _++) this._addTile(r[_], m);

              this._level.el.appendChild(m);
            }
          }
        }
      }
    },
    _isValidTile: function (t) {
      var i = this._map.options.crs;

      if (!i.infinite) {
        var e = this._globalTileRange;
        if (!i.wrapLng && (t.x < e.min.x || t.x > e.max.x) || !i.wrapLat && (t.y < e.min.y || t.y > e.max.y)) return !1;
      }

      if (!this.options.bounds) return !0;

      var n = this._tileCoordsToBounds(t);

      return D(this.options.bounds).overlaps(n);
    },
    _keyToBounds: function (t) {
      return this._tileCoordsToBounds(this._keyToTileCoords(t));
    },
    _tileCoordsToNwSe: function (t) {
      var i = this._map,
          e = this.getTileSize(),
          n = t.scaleBy(e),
          o = n.add(e);
      return [i.unproject(n, t.z), i.unproject(o, t.z)];
    },
    _tileCoordsToBounds: function (t) {
      var i = this._tileCoordsToNwSe(t),
          e = new N(i[0], i[1]);

      return this.options.noWrap || (e = this._map.wrapLatLngBounds(e)), e;
    },
    _tileCoordsToKey: function (t) {
      return t.x + ":" + t.y + ":" + t.z;
    },
    _keyToTileCoords: function (t) {
      var i = t.split(":"),
          e = new B(+i[0], +i[1]);
      return e.z = +i[2], e;
    },
    _removeTile: function (t) {
      var i = this._tiles[t];
      i && (ui(i.el), delete this._tiles[t], this.fire("tileunload", {
        tile: i.el,
        coords: this._keyToTileCoords(t)
      }));
    },
    _initTile: function (t) {
      pi(t, "leaflet-tile");
      var i = this.getTileSize();
      t.style.width = i.x + "px", t.style.height = i.y + "px", t.onselectstart = l, t.onmousemove = l, et && this.options.opacity < 1 && vi(t, this.options.opacity), st && !rt && (t.style.WebkitBackfaceVisibility = "hidden");
    },
    _addTile: function (t, i) {
      var e = this._getTilePos(t),
          n = this._tileCoordsToKey(t),
          o = this.createTile(this._wrapCoords(t), a(this._tileReady, this, t));

      this._initTile(o), this.createTile.length < 2 && M(a(this._tileReady, this, t, null, o)), wi(o, e), this._tiles[n] = {
        el: o,
        coords: t,
        current: !0
      }, i.appendChild(o), this.fire("tileloadstart", {
        tile: o,
        coords: t
      });
    },
    _tileReady: function (t, i, e) {
      i && this.fire("tileerror", {
        error: i,
        tile: e,
        coords: t
      });

      var n = this._tileCoordsToKey(t);

      (e = this._tiles[n]) && (e.loaded = +new Date(), this._map._fadeAnimated ? (vi(e.el, 0), C(this._fadeFrame), this._fadeFrame = M(this._updateOpacity, this)) : (e.active = !0, this._pruneTiles()), i || (pi(e.el, "leaflet-tile-loaded"), this.fire("tileload", {
        tile: e.el,
        coords: t
      })), this._noTilesToLoad() && (this._loading = !1, this.fire("load"), et || !this._map._fadeAnimated ? M(this._pruneTiles, this) : setTimeout(a(this._pruneTiles, this), 250)));
    },
    _getTilePos: function (t) {
      return t.scaleBy(this.getTileSize()).subtract(this._level.origin);
    },
    _wrapCoords: function (t) {
      var i = new B(this._wrapX ? r(t.x, this._wrapX) : t.x, this._wrapY ? r(t.y, this._wrapY) : t.y);
      return i.z = t.z, i;
    },
    _pxBoundsToTileRange: function (t) {
      var i = this.getTileSize();
      return new O(t.min.unscaleBy(i).floor(), t.max.unscaleBy(i).ceil().subtract([1, 1]));
    },
    _noTilesToLoad: function () {
      for (var t in this._tiles) if (!this._tiles[t].loaded) return !1;

      return !0;
    }
  });
  var an = rn.extend({
    options: {
      minZoom: 0,
      maxZoom: 18,
      subdomains: "abc",
      errorTileUrl: "",
      zoomOffset: 0,
      tms: !1,
      zoomReverse: !1,
      detectRetina: !1,
      crossOrigin: !1
    },
    initialize: function (t, i) {
      this._url = t, (i = p(this, i)).detectRetina && Ct && 0 < i.maxZoom && (i.tileSize = Math.floor(i.tileSize / 2), i.zoomReverse ? (i.zoomOffset--, i.minZoom++) : (i.zoomOffset++, i.maxZoom--), i.minZoom = Math.max(0, i.minZoom)), "string" == typeof i.subdomains && (i.subdomains = i.subdomains.split("")), st || this.on("tileunload", this._onTileRemove);
    },
    setUrl: function (t, i) {
      return this._url === t && void 0 === i && (i = !0), this._url = t, i || this.redraw(), this;
    },
    createTile: function (t, i) {
      var e = document.createElement("img");
      return Ei(e, "load", a(this._tileOnLoad, this, i, e)), Ei(e, "error", a(this._tileOnError, this, i, e)), !this.options.crossOrigin && "" !== this.options.crossOrigin || (e.crossOrigin = !0 === this.options.crossOrigin ? "" : this.options.crossOrigin), e.alt = "", e.setAttribute("role", "presentation"), e.src = this.getTileUrl(t), e;
    },
    getTileUrl: function (t) {
      var i = {
        r: Ct ? "@2x" : "",
        s: this._getSubdomain(t),
        x: t.x,
        y: t.y,
        z: this._getZoomForUrl()
      };

      if (this._map && !this._map.options.crs.infinite) {
        var e = this._globalTileRange.max.y - t.y;
        this.options.tms && (i.y = e), i["-y"] = e;
      }

      return g(this._url, h(i, this.options));
    },
    _tileOnLoad: function (t, i) {
      et ? setTimeout(a(t, this, null, i), 0) : t(null, i);
    },
    _tileOnError: function (t, i, e) {
      var n = this.options.errorTileUrl;
      n && i.getAttribute("src") !== n && (i.src = n), t(e, i);
    },
    _onTileRemove: function (t) {
      t.tile.onload = null;
    },
    _getZoomForUrl: function () {
      var t = this._tileZoom,
          i = this.options.maxZoom;
      return this.options.zoomReverse && (t = i - t), t + this.options.zoomOffset;
    },
    _getSubdomain: function (t) {
      var i = Math.abs(t.x + t.y) % this.options.subdomains.length;
      return this.options.subdomains[i];
    },
    _abortLoading: function () {
      var t, i;

      for (t in this._tiles) this._tiles[t].coords.z !== this._tileZoom && ((i = this._tiles[t].el).onload = l, i.onerror = l, i.complete || (i.src = x, ui(i), delete this._tiles[t]));
    },
    _removeTile: function (t) {
      var i = this._tiles[t];
      if (i) return ht || i.el.setAttribute("src", x), rn.prototype._removeTile.call(this, t);
    },
    _tileReady: function (t, i, e) {
      if (this._map && (!e || e.getAttribute("src") !== x)) return rn.prototype._tileReady.call(this, t, i, e);
    }
  });

  function hn(t, i) {
    return new an(t, i);
  }

  var un = an.extend({
    defaultWmsParams: {
      service: "WMS",
      request: "GetMap",
      layers: "",
      styles: "",
      format: "image/jpeg",
      transparent: !1,
      version: "1.1.1"
    },
    options: {
      crs: null,
      uppercase: !1
    },
    initialize: function (t, i) {
      this._url = t;
      var e = h({}, this.defaultWmsParams);

      for (var n in i) n in this.options || (e[n] = i[n]);

      var o = (i = p(this, i)).detectRetina && Ct ? 2 : 1,
          s = this.getTileSize();
      e.width = s.x * o, e.height = s.y * o, this.wmsParams = e;
    },
    onAdd: function (t) {
      this._crs = this.options.crs || t.options.crs, this._wmsVersion = parseFloat(this.wmsParams.version);
      var i = 1.3 <= this._wmsVersion ? "crs" : "srs";
      this.wmsParams[i] = this._crs.code, an.prototype.onAdd.call(this, t);
    },
    getTileUrl: function (t) {
      var i = this._tileCoordsToNwSe(t),
          e = this._crs,
          n = R(e.project(i[0]), e.project(i[1])),
          o = n.min,
          s = n.max,
          r = (1.3 <= this._wmsVersion && this._crs === Me ? [o.y, o.x, s.y, s.x] : [o.x, o.y, s.x, s.y]).join(","),
          a = an.prototype.getTileUrl.call(this, t);

      return a + m(this.wmsParams, a, this.options.uppercase) + (this.options.uppercase ? "&BBOX=" : "&bbox=") + r;
    },
    setParams: function (t, i) {
      return h(this.wmsParams, t), i || this.redraw(), this;
    }
  });
  an.WMS = un, hn.wms = function (t, i) {
    return new un(t, i);
  };
  var ln = Se.extend({
    options: {
      padding: .1,
      tolerance: 0
    },
    initialize: function (t) {
      p(this, t), u(this), this._layers = this._layers || {};
    },
    onAdd: function () {
      this._container || (this._initContainer(), this._zoomAnimated && pi(this._container, "leaflet-zoom-animated")), this.getPane().appendChild(this._container), this._update(), this.on("update", this._updatePaths, this);
    },
    onRemove: function () {
      this.off("update", this._updatePaths, this), this._destroyContainer();
    },
    getEvents: function () {
      var t = {
        viewreset: this._reset,
        zoom: this._onZoom,
        moveend: this._update,
        zoomend: this._onZoomEnd
      };
      return this._zoomAnimated && (t.zoomanim = this._onAnimZoom), t;
    },
    _onAnimZoom: function (t) {
      this._updateTransform(t.center, t.zoom);
    },
    _onZoom: function () {
      this._updateTransform(this._map.getCenter(), this._map.getZoom());
    },
    _updateTransform: function (t, i) {
      var e = this._map.getZoomScale(i, this._zoom),
          n = Pi(this._container),
          o = this._map.getSize().multiplyBy(.5 + this.options.padding),
          s = this._map.project(this._center, i),
          r = this._map.project(t, i).subtract(s),
          a = o.multiplyBy(-e).add(n).add(o).subtract(r);

      yt ? xi(this._container, a, e) : wi(this._container, a);
    },
    _reset: function () {
      for (var t in this._update(), this._updateTransform(this._center, this._zoom), this._layers) this._layers[t]._reset();
    },
    _onZoomEnd: function () {
      for (var t in this._layers) this._layers[t]._project();
    },
    _updatePaths: function () {
      for (var t in this._layers) this._layers[t]._update();
    },
    _update: function () {
      var t = this.options.padding,
          i = this._map.getSize(),
          e = this._map.containerPointToLayerPoint(i.multiplyBy(-t)).round();

      this._bounds = new O(e, e.add(i.multiplyBy(1 + 2 * t)).round()), this._center = this._map.getCenter(), this._zoom = this._map.getZoom();
    }
  }),
      cn = ln.extend({
    getEvents: function () {
      var t = ln.prototype.getEvents.call(this);
      return t.viewprereset = this._onViewPreReset, t;
    },
    _onViewPreReset: function () {
      this._postponeUpdatePaths = !0;
    },
    onAdd: function () {
      ln.prototype.onAdd.call(this), this._draw();
    },
    _initContainer: function () {
      var t = this._container = document.createElement("canvas");
      Ei(t, "mousemove", o(this._onMouseMove, 32, this), this), Ei(t, "click dblclick mousedown mouseup contextmenu", this._onClick, this), Ei(t, "mouseout", this._handleMouseOut, this), this._ctx = t.getContext("2d");
    },
    _destroyContainer: function () {
      C(this._redrawRequest), delete this._ctx, ui(this._container), Bi(this._container), delete this._container;
    },
    _updatePaths: function () {
      if (!this._postponeUpdatePaths) {
        for (var t in this._redrawBounds = null, this._layers) this._layers[t]._update();

        this._redraw();
      }
    },
    _update: function () {
      if (!this._map._animatingZoom || !this._bounds) {
        ln.prototype._update.call(this);

        var t = this._bounds,
            i = this._container,
            e = t.getSize(),
            n = Ct ? 2 : 1;
        wi(i, t.min), i.width = n * e.x, i.height = n * e.y, i.style.width = e.x + "px", i.style.height = e.y + "px", Ct && this._ctx.scale(2, 2), this._ctx.translate(-t.min.x, -t.min.y), this.fire("update");
      }
    },
    _reset: function () {
      ln.prototype._reset.call(this), this._postponeUpdatePaths && (this._postponeUpdatePaths = !1, this._updatePaths());
    },
    _initPath: function (t) {
      this._updateDashArray(t);

      var i = (this._layers[u(t)] = t)._order = {
        layer: t,
        prev: this._drawLast,
        next: null
      };
      this._drawLast && (this._drawLast.next = i), this._drawLast = i, this._drawFirst = this._drawFirst || this._drawLast;
    },
    _addPath: function (t) {
      this._requestRedraw(t);
    },
    _removePath: function (t) {
      var i = t._order,
          e = i.next,
          n = i.prev;
      e ? e.prev = n : this._drawLast = n, n ? n.next = e : this._drawFirst = e, delete t._order, delete this._layers[u(t)], this._requestRedraw(t);
    },
    _updatePath: function (t) {
      this._extendRedrawBounds(t), t._project(), t._update(), this._requestRedraw(t);
    },
    _updateStyle: function (t) {
      this._updateDashArray(t), this._requestRedraw(t);
    },
    _updateDashArray: function (t) {
      if ("string" == typeof t.options.dashArray) {
        var i,
            e,
            n = t.options.dashArray.split(/[, ]+/),
            o = [];

        for (e = 0; e < n.length; e++) {
          if (i = Number(n[e]), isNaN(i)) return;
          o.push(i);
        }

        t.options._dashArray = o;
      } else t.options._dashArray = t.options.dashArray;
    },
    _requestRedraw: function (t) {
      this._map && (this._extendRedrawBounds(t), this._redrawRequest = this._redrawRequest || M(this._redraw, this));
    },
    _extendRedrawBounds: function (t) {
      if (t._pxBounds) {
        var i = (t.options.weight || 0) + 1;
        this._redrawBounds = this._redrawBounds || new O(), this._redrawBounds.extend(t._pxBounds.min.subtract([i, i])), this._redrawBounds.extend(t._pxBounds.max.add([i, i]));
      }
    },
    _redraw: function () {
      this._redrawRequest = null, this._redrawBounds && (this._redrawBounds.min._floor(), this._redrawBounds.max._ceil()), this._clear(), this._draw(), this._redrawBounds = null;
    },
    _clear: function () {
      var t = this._redrawBounds;

      if (t) {
        var i = t.getSize();

        this._ctx.clearRect(t.min.x, t.min.y, i.x, i.y);
      } else this._ctx.clearRect(0, 0, this._container.width, this._container.height);
    },
    _draw: function () {
      var t,
          i = this._redrawBounds;

      if (this._ctx.save(), i) {
        var e = i.getSize();
        this._ctx.beginPath(), this._ctx.rect(i.min.x, i.min.y, e.x, e.y), this._ctx.clip();
      }

      this._drawing = !0;

      for (var n = this._drawFirst; n; n = n.next) t = n.layer, (!i || t._pxBounds && t._pxBounds.intersects(i)) && t._updatePath();

      this._drawing = !1, this._ctx.restore();
    },
    _updatePoly: function (t, i) {
      if (this._drawing) {
        var e,
            n,
            o,
            s,
            r = t._parts,
            a = r.length,
            h = this._ctx;

        if (a) {
          for (h.beginPath(), e = 0; e < a; e++) {
            for (n = 0, o = r[e].length; n < o; n++) s = r[e][n], h[n ? "lineTo" : "moveTo"](s.x, s.y);

            i && h.closePath();
          }

          this._fillStroke(h, t);
        }
      }
    },
    _updateCircle: function (t) {
      if (this._drawing && !t._empty()) {
        var i = t._point,
            e = this._ctx,
            n = Math.max(Math.round(t._radius), 1),
            o = (Math.max(Math.round(t._radiusY), 1) || n) / n;
        1 != o && (e.save(), e.scale(1, o)), e.beginPath(), e.arc(i.x, i.y / o, n, 0, 2 * Math.PI, !1), 1 != o && e.restore(), this._fillStroke(e, t);
      }
    },
    _fillStroke: function (t, i) {
      var e = i.options;
      e.fill && (t.globalAlpha = e.fillOpacity, t.fillStyle = e.fillColor || e.color, t.fill(e.fillRule || "evenodd")), e.stroke && 0 !== e.weight && (t.setLineDash && t.setLineDash(i.options && i.options._dashArray || []), t.globalAlpha = e.opacity, t.lineWidth = e.weight, t.strokeStyle = e.color, t.lineCap = e.lineCap, t.lineJoin = e.lineJoin, t.stroke());
    },
    _onClick: function (t) {
      for (var i, e, n = this._map.mouseEventToLayerPoint(t), o = this._drawFirst; o; o = o.next) (i = o.layer).options.interactive && i._containsPoint(n) && !this._map._draggableMoved(i) && (e = i);

      e && (qi(t), this._fireEvent([e], t));
    },
    _onMouseMove: function (t) {
      if (this._map && !this._map.dragging.moving() && !this._map._animatingZoom) {
        var i = this._map.mouseEventToLayerPoint(t);

        this._handleMouseHover(t, i);
      }
    },
    _handleMouseOut: function (t) {
      var i = this._hoveredLayer;
      i && (mi(this._container, "leaflet-interactive"), this._fireEvent([i], t, "mouseout"), this._hoveredLayer = null);
    },
    _handleMouseHover: function (t, i) {
      for (var e, n, o = this._drawFirst; o; o = o.next) (e = o.layer).options.interactive && e._containsPoint(i) && (n = e);

      n !== this._hoveredLayer && (this._handleMouseOut(t), n && (pi(this._container, "leaflet-interactive"), this._fireEvent([n], t, "mouseover"), this._hoveredLayer = n)), this._hoveredLayer && this._fireEvent([this._hoveredLayer], t);
    },
    _fireEvent: function (t, i, e) {
      this._map._fireDOMEvent(i, e || i.type, t);
    },
    _bringToFront: function (t) {
      var i = t._order;

      if (i) {
        var e = i.next,
            n = i.prev;
        e && ((e.prev = n) ? n.next = e : e && (this._drawFirst = e), i.prev = this._drawLast, (this._drawLast.next = i).next = null, this._drawLast = i, this._requestRedraw(t));
      }
    },
    _bringToBack: function (t) {
      var i = t._order;

      if (i) {
        var e = i.next,
            n = i.prev;
        n && ((n.next = e) ? e.prev = n : n && (this._drawLast = n), i.prev = null, i.next = this._drawFirst, this._drawFirst.prev = i, this._drawFirst = i, this._requestRedraw(t));
      }
    }
  });

  function _n(t) {
    return St ? new cn(t) : null;
  }

  var dn = function () {
    try {
      return document.namespaces.add("lvml", "urn:schemas-microsoft-com:vml"), function (t) {
        return document.createElement("<lvml:" + t + ' class="lvml">');
      };
    } catch (t) {
      return function (t) {
        return document.createElement("<" + t + ' xmlns="urn:schemas-microsoft.com:vml" class="lvml">');
      };
    }
  }(),
      pn = {
    _initContainer: function () {
      this._container = hi("div", "leaflet-vml-container");
    },
    _update: function () {
      this._map._animatingZoom || (ln.prototype._update.call(this), this.fire("update"));
    },
    _initPath: function (t) {
      var i = t._container = dn("shape");
      pi(i, "leaflet-vml-shape " + (this.options.className || "")), i.coordsize = "1 1", t._path = dn("path"), i.appendChild(t._path), this._updateStyle(t), this._layers[u(t)] = t;
    },
    _addPath: function (t) {
      var i = t._container;
      this._container.appendChild(i), t.options.interactive && t.addInteractiveTarget(i);
    },
    _removePath: function (t) {
      var i = t._container;
      ui(i), t.removeInteractiveTarget(i), delete this._layers[u(t)];
    },
    _updateStyle: function (t) {
      var i = t._stroke,
          e = t._fill,
          n = t.options,
          o = t._container;
      o.stroked = !!n.stroke, o.filled = !!n.fill, n.stroke ? (i || (i = t._stroke = dn("stroke")), o.appendChild(i), i.weight = n.weight + "px", i.color = n.color, i.opacity = n.opacity, n.dashArray ? i.dashStyle = v(n.dashArray) ? n.dashArray.join(" ") : n.dashArray.replace(/( *, *)/g, " ") : i.dashStyle = "", i.endcap = n.lineCap.replace("butt", "flat"), i.joinstyle = n.lineJoin) : i && (o.removeChild(i), t._stroke = null), n.fill ? (e || (e = t._fill = dn("fill")), o.appendChild(e), e.color = n.fillColor || n.color, e.opacity = n.fillOpacity) : e && (o.removeChild(e), t._fill = null);
    },
    _updateCircle: function (t) {
      var i = t._point.round(),
          e = Math.round(t._radius),
          n = Math.round(t._radiusY || e);

      this._setPath(t, t._empty() ? "M0 0" : "AL " + i.x + "," + i.y + " " + e + "," + n + " 0,23592600");
    },
    _setPath: function (t, i) {
      t._path.v = i;
    },
    _bringToFront: function (t) {
      ci(t._container);
    },
    _bringToBack: function (t) {
      _i(t._container);
    }
  },
      mn = Et ? dn : $,
      fn = ln.extend({
    getEvents: function () {
      var t = ln.prototype.getEvents.call(this);
      return t.zoomstart = this._onZoomStart, t;
    },
    _initContainer: function () {
      this._container = mn("svg"), this._container.setAttribute("pointer-events", "none"), this._rootGroup = mn("g"), this._container.appendChild(this._rootGroup);
    },
    _destroyContainer: function () {
      ui(this._container), Bi(this._container), delete this._container, delete this._rootGroup, delete this._svgSize;
    },
    _onZoomStart: function () {
      this._update();
    },
    _update: function () {
      if (!this._map._animatingZoom || !this._bounds) {
        ln.prototype._update.call(this);

        var t = this._bounds,
            i = t.getSize(),
            e = this._container;
        this._svgSize && this._svgSize.equals(i) || (this._svgSize = i, e.setAttribute("width", i.x), e.setAttribute("height", i.y)), wi(e, t.min), e.setAttribute("viewBox", [t.min.x, t.min.y, i.x, i.y].join(" ")), this.fire("update");
      }
    },
    _initPath: function (t) {
      var i = t._path = mn("path");
      t.options.className && pi(i, t.options.className), t.options.interactive && pi(i, "leaflet-interactive"), this._updateStyle(t), this._layers[u(t)] = t;
    },
    _addPath: function (t) {
      this._rootGroup || this._initContainer(), this._rootGroup.appendChild(t._path), t.addInteractiveTarget(t._path);
    },
    _removePath: function (t) {
      ui(t._path), t.removeInteractiveTarget(t._path), delete this._layers[u(t)];
    },
    _updatePath: function (t) {
      t._project(), t._update();
    },
    _updateStyle: function (t) {
      var i = t._path,
          e = t.options;
      i && (e.stroke ? (i.setAttribute("stroke", e.color), i.setAttribute("stroke-opacity", e.opacity), i.setAttribute("stroke-width", e.weight), i.setAttribute("stroke-linecap", e.lineCap), i.setAttribute("stroke-linejoin", e.lineJoin), e.dashArray ? i.setAttribute("stroke-dasharray", e.dashArray) : i.removeAttribute("stroke-dasharray"), e.dashOffset ? i.setAttribute("stroke-dashoffset", e.dashOffset) : i.removeAttribute("stroke-dashoffset")) : i.setAttribute("stroke", "none"), e.fill ? (i.setAttribute("fill", e.fillColor || e.color), i.setAttribute("fill-opacity", e.fillOpacity), i.setAttribute("fill-rule", e.fillRule || "evenodd")) : i.setAttribute("fill", "none"));
    },
    _updatePoly: function (t, i) {
      this._setPath(t, Q(t._parts, i));
    },
    _updateCircle: function (t) {
      var i = t._point,
          e = Math.max(Math.round(t._radius), 1),
          n = "a" + e + "," + (Math.max(Math.round(t._radiusY), 1) || e) + " 0 1,0 ",
          o = t._empty() ? "M0 0" : "M" + (i.x - e) + "," + i.y + n + 2 * e + ",0 " + n + 2 * -e + ",0 ";

      this._setPath(t, o);
    },
    _setPath: function (t, i) {
      t._path.setAttribute("d", i);
    },
    _bringToFront: function (t) {
      ci(t._path);
    },
    _bringToBack: function (t) {
      _i(t._path);
    }
  });

  function gn(t) {
    return Zt || Et ? new fn(t) : null;
  }

  Et && fn.include(pn), Ji.include({
    getRenderer: function (t) {
      var i = t.options.renderer || this._getPaneRenderer(t.options.pane) || this.options.renderer || this._renderer;

      return i || (i = this._renderer = this._createRenderer()), this.hasLayer(i) || this.addLayer(i), i;
    },
    _getPaneRenderer: function (t) {
      if ("overlayPane" === t || void 0 === t) return !1;
      var i = this._paneRenderers[t];
      return void 0 === i && (i = this._createRenderer({
        pane: t
      }), this._paneRenderers[t] = i), i;
    },
    _createRenderer: function (t) {
      return this.options.preferCanvas && _n(t) || gn(t);
    }
  });
  var vn = je.extend({
    initialize: function (t, i) {
      je.prototype.initialize.call(this, this._boundsToLatLngs(t), i);
    },
    setBounds: function (t) {
      return this.setLatLngs(this._boundsToLatLngs(t));
    },
    _boundsToLatLngs: function (t) {
      return [(t = D(t)).getSouthWest(), t.getNorthWest(), t.getNorthEast(), t.getSouthEast()];
    }
  });
  fn.create = mn, fn.pointsToPath = Q, We.geometryToLayer = He, We.coordsToLatLng = Fe, We.coordsToLatLngs = Ue, We.latLngToCoords = Ve, We.latLngsToCoords = qe, We.getFeature = Ge, We.asFeature = Ke, Ji.mergeOptions({
    boxZoom: !0
  });
  var yn = oe.extend({
    initialize: function (t) {
      this._map = t, this._container = t._container, this._pane = t._panes.overlayPane, this._resetStateTimeout = 0, t.on("unload", this._destroy, this);
    },
    addHooks: function () {
      Ei(this._container, "mousedown", this._onMouseDown, this);
    },
    removeHooks: function () {
      Bi(this._container, "mousedown", this._onMouseDown, this);
    },
    moved: function () {
      return this._moved;
    },
    _destroy: function () {
      ui(this._pane), delete this._pane;
    },
    _resetState: function () {
      this._resetStateTimeout = 0, this._moved = !1;
    },
    _clearDeferredResetState: function () {
      0 !== this._resetStateTimeout && (clearTimeout(this._resetStateTimeout), this._resetStateTimeout = 0);
    },
    _onMouseDown: function (t) {
      if (!t.shiftKey || 1 !== t.which && 1 !== t.button) return !1;
      this._clearDeferredResetState(), this._resetState(), $t(), bi(), this._startPoint = this._map.mouseEventToContainerPoint(t), Ei(document, {
        contextmenu: ji,
        mousemove: this._onMouseMove,
        mouseup: this._onMouseUp,
        keydown: this._onKeyDown
      }, this);
    },
    _onMouseMove: function (t) {
      this._moved || (this._moved = !0, this._box = hi("div", "leaflet-zoom-box", this._container), pi(this._container, "leaflet-crosshair"), this._map.fire("boxzoomstart")), this._point = this._map.mouseEventToContainerPoint(t);
      var i = new O(this._point, this._startPoint),
          e = i.getSize();
      wi(this._box, i.min), this._box.style.width = e.x + "px", this._box.style.height = e.y + "px";
    },
    _finish: function () {
      this._moved && (ui(this._box), mi(this._container, "leaflet-crosshair")), Qt(), Ti(), Bi(document, {
        contextmenu: ji,
        mousemove: this._onMouseMove,
        mouseup: this._onMouseUp,
        keydown: this._onKeyDown
      }, this);
    },
    _onMouseUp: function (t) {
      if ((1 === t.which || 1 === t.button) && (this._finish(), this._moved)) {
        this._clearDeferredResetState(), this._resetStateTimeout = setTimeout(a(this._resetState, this), 0);
        var i = new N(this._map.containerPointToLatLng(this._startPoint), this._map.containerPointToLatLng(this._point));

        this._map.fitBounds(i).fire("boxzoomend", {
          boxZoomBounds: i
        });
      }
    },
    _onKeyDown: function (t) {
      27 === t.keyCode && this._finish();
    }
  });
  Ji.addInitHook("addHandler", "boxZoom", yn), Ji.mergeOptions({
    doubleClickZoom: !0
  });
  var xn = oe.extend({
    addHooks: function () {
      this._map.on("dblclick", this._onDoubleClick, this);
    },
    removeHooks: function () {
      this._map.off("dblclick", this._onDoubleClick, this);
    },
    _onDoubleClick: function (t) {
      var i = this._map,
          e = i.getZoom(),
          n = i.options.zoomDelta,
          o = t.originalEvent.shiftKey ? e - n : e + n;
      "center" === i.options.doubleClickZoom ? i.setZoom(o) : i.setZoomAround(t.containerPoint, o);
    }
  });
  Ji.addInitHook("addHandler", "doubleClickZoom", xn), Ji.mergeOptions({
    dragging: !0,
    inertia: !rt,
    inertiaDeceleration: 3400,
    inertiaMaxSpeed: 1 / 0,
    easeLinearity: .2,
    worldCopyJump: !1,
    maxBoundsViscosity: 0
  });
  var wn = oe.extend({
    addHooks: function () {
      if (!this._draggable) {
        var t = this._map;
        this._draggable = new le(t._mapPane, t._container), this._draggable.on({
          dragstart: this._onDragStart,
          drag: this._onDrag,
          dragend: this._onDragEnd
        }, this), this._draggable.on("predrag", this._onPreDragLimit, this), t.options.worldCopyJump && (this._draggable.on("predrag", this._onPreDragWrap, this), t.on("zoomend", this._onZoomEnd, this), t.whenReady(this._onZoomEnd, this));
      }

      pi(this._map._container, "leaflet-grab leaflet-touch-drag"), this._draggable.enable(), this._positions = [], this._times = [];
    },
    removeHooks: function () {
      mi(this._map._container, "leaflet-grab"), mi(this._map._container, "leaflet-touch-drag"), this._draggable.disable();
    },
    moved: function () {
      return this._draggable && this._draggable._moved;
    },
    moving: function () {
      return this._draggable && this._draggable._moving;
    },
    _onDragStart: function () {
      var t = this._map;

      if (t._stop(), this._map.options.maxBounds && this._map.options.maxBoundsViscosity) {
        var i = D(this._map.options.maxBounds);
        this._offsetLimit = R(this._map.latLngToContainerPoint(i.getNorthWest()).multiplyBy(-1), this._map.latLngToContainerPoint(i.getSouthEast()).multiplyBy(-1).add(this._map.getSize())), this._viscosity = Math.min(1, Math.max(0, this._map.options.maxBoundsViscosity));
      } else this._offsetLimit = null;

      t.fire("movestart").fire("dragstart"), t.options.inertia && (this._positions = [], this._times = []);
    },
    _onDrag: function (t) {
      if (this._map.options.inertia) {
        var i = this._lastTime = +new Date(),
            e = this._lastPos = this._draggable._absPos || this._draggable._newPos;
        this._positions.push(e), this._times.push(i), this._prunePositions(i);
      }

      this._map.fire("move", t).fire("drag", t);
    },
    _prunePositions: function (t) {
      for (; 1 < this._positions.length && 50 < t - this._times[0];) this._positions.shift(), this._times.shift();
    },
    _onZoomEnd: function () {
      var t = this._map.getSize().divideBy(2),
          i = this._map.latLngToLayerPoint([0, 0]);

      this._initialWorldOffset = i.subtract(t).x, this._worldWidth = this._map.getPixelWorldBounds().getSize().x;
    },
    _viscousLimit: function (t, i) {
      return t - (t - i) * this._viscosity;
    },
    _onPreDragLimit: function () {
      if (this._viscosity && this._offsetLimit) {
        var t = this._draggable._newPos.subtract(this._draggable._startPos),
            i = this._offsetLimit;

        t.x < i.min.x && (t.x = this._viscousLimit(t.x, i.min.x)), t.y < i.min.y && (t.y = this._viscousLimit(t.y, i.min.y)), t.x > i.max.x && (t.x = this._viscousLimit(t.x, i.max.x)), t.y > i.max.y && (t.y = this._viscousLimit(t.y, i.max.y)), this._draggable._newPos = this._draggable._startPos.add(t);
      }
    },
    _onPreDragWrap: function () {
      var t = this._worldWidth,
          i = Math.round(t / 2),
          e = this._initialWorldOffset,
          n = this._draggable._newPos.x,
          o = (n - i + e) % t + i - e,
          s = (n + i + e) % t - i - e,
          r = Math.abs(o + e) < Math.abs(s + e) ? o : s;
      this._draggable._absPos = this._draggable._newPos.clone(), this._draggable._newPos.x = r;
    },
    _onDragEnd: function (t) {
      var i = this._map,
          e = i.options,
          n = !e.inertia || this._times.length < 2;
      if (i.fire("dragend", t), n) i.fire("moveend");else {
        this._prunePositions(+new Date());

        var o = this._lastPos.subtract(this._positions[0]),
            s = (this._lastTime - this._times[0]) / 1e3,
            r = e.easeLinearity,
            a = o.multiplyBy(r / s),
            h = a.distanceTo([0, 0]),
            u = Math.min(e.inertiaMaxSpeed, h),
            l = a.multiplyBy(u / h),
            c = u / (e.inertiaDeceleration * r),
            _ = l.multiplyBy(-c / 2).round();

        _.x || _.y ? (_ = i._limitOffset(_, i.options.maxBounds), M(function () {
          i.panBy(_, {
            duration: c,
            easeLinearity: r,
            noMoveStart: !0,
            animate: !0
          });
        })) : i.fire("moveend");
      }
    }
  });
  Ji.addInitHook("addHandler", "dragging", wn), Ji.mergeOptions({
    keyboard: !0,
    keyboardPanDelta: 80
  });
  var Pn = oe.extend({
    keyCodes: {
      left: [37],
      right: [39],
      down: [40],
      up: [38],
      zoomIn: [187, 107, 61, 171],
      zoomOut: [189, 109, 54, 173]
    },
    initialize: function (t) {
      this._map = t, this._setPanDelta(t.options.keyboardPanDelta), this._setZoomDelta(t.options.zoomDelta);
    },
    addHooks: function () {
      var t = this._map._container;
      t.tabIndex <= 0 && (t.tabIndex = "0"), Ei(t, {
        focus: this._onFocus,
        blur: this._onBlur,
        mousedown: this._onMouseDown
      }, this), this._map.on({
        focus: this._addHooks,
        blur: this._removeHooks
      }, this);
    },
    removeHooks: function () {
      this._removeHooks(), Bi(this._map._container, {
        focus: this._onFocus,
        blur: this._onBlur,
        mousedown: this._onMouseDown
      }, this), this._map.off({
        focus: this._addHooks,
        blur: this._removeHooks
      }, this);
    },
    _onMouseDown: function () {
      if (!this._focused) {
        var t = document.body,
            i = document.documentElement,
            e = t.scrollTop || i.scrollTop,
            n = t.scrollLeft || i.scrollLeft;
        this._map._container.focus(), window.scrollTo(n, e);
      }
    },
    _onFocus: function () {
      this._focused = !0, this._map.fire("focus");
    },
    _onBlur: function () {
      this._focused = !1, this._map.fire("blur");
    },
    _setPanDelta: function (t) {
      var i,
          e,
          n = this._panKeys = {},
          o = this.keyCodes;

      for (i = 0, e = o.left.length; i < e; i++) n[o.left[i]] = [-1 * t, 0];

      for (i = 0, e = o.right.length; i < e; i++) n[o.right[i]] = [t, 0];

      for (i = 0, e = o.down.length; i < e; i++) n[o.down[i]] = [0, t];

      for (i = 0, e = o.up.length; i < e; i++) n[o.up[i]] = [0, -1 * t];
    },
    _setZoomDelta: function (t) {
      var i,
          e,
          n = this._zoomKeys = {},
          o = this.keyCodes;

      for (i = 0, e = o.zoomIn.length; i < e; i++) n[o.zoomIn[i]] = t;

      for (i = 0, e = o.zoomOut.length; i < e; i++) n[o.zoomOut[i]] = -t;
    },
    _addHooks: function () {
      Ei(document, "keydown", this._onKeyDown, this);
    },
    _removeHooks: function () {
      Bi(document, "keydown", this._onKeyDown, this);
    },
    _onKeyDown: function (t) {
      if (!(t.altKey || t.ctrlKey || t.metaKey)) {
        var i,
            e = t.keyCode,
            n = this._map;
        if (e in this._panKeys) n._panAnim && n._panAnim._inProgress || (i = this._panKeys[e], t.shiftKey && (i = I(i).multiplyBy(3)), n.panBy(i), n.options.maxBounds && n.panInsideBounds(n.options.maxBounds));else if (e in this._zoomKeys) n.setZoom(n.getZoom() + (t.shiftKey ? 3 : 1) * this._zoomKeys[e]);else {
          if (27 !== e || !n._popup || !n._popup.options.closeOnEscapeKey) return;
          n.closePopup();
        }
        ji(t);
      }
    }
  });
  Ji.addInitHook("addHandler", "keyboard", Pn), Ji.mergeOptions({
    scrollWheelZoom: !0,
    wheelDebounceTime: 40,
    wheelPxPerZoomLevel: 60
  });
  var Ln = oe.extend({
    addHooks: function () {
      Ei(this._map._container, "mousewheel", this._onWheelScroll, this), this._delta = 0;
    },
    removeHooks: function () {
      Bi(this._map._container, "mousewheel", this._onWheelScroll, this);
    },
    _onWheelScroll: function (t) {
      var i = Fi(t),
          e = this._map.options.wheelDebounceTime;
      this._delta += i, this._lastMousePos = this._map.mouseEventToContainerPoint(t), this._startTime || (this._startTime = +new Date());
      var n = Math.max(e - (+new Date() - this._startTime), 0);
      clearTimeout(this._timer), this._timer = setTimeout(a(this._performZoom, this), n), ji(t);
    },
    _performZoom: function () {
      var t = this._map,
          i = t.getZoom(),
          e = this._map.options.zoomSnap || 0;

      t._stop();

      var n = this._delta / (4 * this._map.options.wheelPxPerZoomLevel),
          o = 4 * Math.log(2 / (1 + Math.exp(-Math.abs(n)))) / Math.LN2,
          s = e ? Math.ceil(o / e) * e : o,
          r = t._limitZoom(i + (0 < this._delta ? s : -s)) - i;
      this._delta = 0, this._startTime = null, r && ("center" === t.options.scrollWheelZoom ? t.setZoom(i + r) : t.setZoomAround(this._lastMousePos, i + r));
    }
  });
  Ji.addInitHook("addHandler", "scrollWheelZoom", Ln), Ji.mergeOptions({
    tap: !0,
    tapTolerance: 15
  });
  var bn = oe.extend({
    addHooks: function () {
      Ei(this._map._container, "touchstart", this._onDown, this);
    },
    removeHooks: function () {
      Bi(this._map._container, "touchstart", this._onDown, this);
    },
    _onDown: function (t) {
      if (t.touches) {
        if (Di(t), this._fireClick = !0, 1 < t.touches.length) return this._fireClick = !1, void clearTimeout(this._holdTimeout);
        var i = t.touches[0],
            e = i.target;
        this._startPos = this._newPos = new B(i.clientX, i.clientY), e.tagName && "a" === e.tagName.toLowerCase() && pi(e, "leaflet-active"), this._holdTimeout = setTimeout(a(function () {
          this._isTapValid() && (this._fireClick = !1, this._onUp(), this._simulateEvent("contextmenu", i));
        }, this), 1e3), this._simulateEvent("mousedown", i), Ei(document, {
          touchmove: this._onMove,
          touchend: this._onUp
        }, this);
      }
    },
    _onUp: function (t) {
      if (clearTimeout(this._holdTimeout), Bi(document, {
        touchmove: this._onMove,
        touchend: this._onUp
      }, this), this._fireClick && t && t.changedTouches) {
        var i = t.changedTouches[0],
            e = i.target;
        e && e.tagName && "a" === e.tagName.toLowerCase() && mi(e, "leaflet-active"), this._simulateEvent("mouseup", i), this._isTapValid() && this._simulateEvent("click", i);
      }
    },
    _isTapValid: function () {
      return this._newPos.distanceTo(this._startPos) <= this._map.options.tapTolerance;
    },
    _onMove: function (t) {
      var i = t.touches[0];
      this._newPos = new B(i.clientX, i.clientY), this._simulateEvent("mousemove", i);
    },
    _simulateEvent: function (t, i) {
      var e = document.createEvent("MouseEvents");
      e._simulated = !0, i.target._simulatedClick = !0, e.initMouseEvent(t, !0, !0, window, 1, i.screenX, i.screenY, i.clientX, i.clientY, !1, !1, !1, !1, 0, null), i.target.dispatchEvent(e);
    }
  });
  Tt && !bt && Ji.addInitHook("addHandler", "tap", bn), Ji.mergeOptions({
    touchZoom: Tt && !rt,
    bounceAtZoomLimits: !0
  });
  var Tn = oe.extend({
    addHooks: function () {
      pi(this._map._container, "leaflet-touch-zoom"), Ei(this._map._container, "touchstart", this._onTouchStart, this);
    },
    removeHooks: function () {
      mi(this._map._container, "leaflet-touch-zoom"), Bi(this._map._container, "touchstart", this._onTouchStart, this);
    },
    _onTouchStart: function (t) {
      var i = this._map;

      if (t.touches && 2 === t.touches.length && !i._animatingZoom && !this._zooming) {
        var e = i.mouseEventToContainerPoint(t.touches[0]),
            n = i.mouseEventToContainerPoint(t.touches[1]);
        this._centerPoint = i.getSize()._divideBy(2), this._startLatLng = i.containerPointToLatLng(this._centerPoint), "center" !== i.options.touchZoom && (this._pinchStartLatLng = i.containerPointToLatLng(e.add(n)._divideBy(2))), this._startDist = e.distanceTo(n), this._startZoom = i.getZoom(), this._moved = !1, this._zooming = !0, i._stop(), Ei(document, "touchmove", this._onTouchMove, this), Ei(document, "touchend", this._onTouchEnd, this), Di(t);
      }
    },
    _onTouchMove: function (t) {
      if (t.touches && 2 === t.touches.length && this._zooming) {
        var i = this._map,
            e = i.mouseEventToContainerPoint(t.touches[0]),
            n = i.mouseEventToContainerPoint(t.touches[1]),
            o = e.distanceTo(n) / this._startDist;

        if (this._zoom = i.getScaleZoom(o, this._startZoom), !i.options.bounceAtZoomLimits && (this._zoom < i.getMinZoom() && o < 1 || this._zoom > i.getMaxZoom() && 1 < o) && (this._zoom = i._limitZoom(this._zoom)), "center" === i.options.touchZoom) {
          if (this._center = this._startLatLng, 1 == o) return;
        } else {
          var s = e._add(n)._divideBy(2)._subtract(this._centerPoint);

          if (1 == o && 0 === s.x && 0 === s.y) return;
          this._center = i.unproject(i.project(this._pinchStartLatLng, this._zoom).subtract(s), this._zoom);
        }

        this._moved || (i._moveStart(!0, !1), this._moved = !0), C(this._animRequest);
        var r = a(i._move, i, this._center, this._zoom, {
          pinch: !0,
          round: !1
        });
        this._animRequest = M(r, this, !0), Di(t);
      }
    },
    _onTouchEnd: function () {
      this._moved && this._zooming ? (this._zooming = !1, C(this._animRequest), Bi(document, "touchmove", this._onTouchMove), Bi(document, "touchend", this._onTouchEnd), this._map.options.zoomAnimation ? this._map._animateZoom(this._center, this._map._limitZoom(this._zoom), !0, this._map.options.zoomSnap) : this._map._resetView(this._center, this._map._limitZoom(this._zoom))) : this._zooming = !1;
    }
  });
  Ji.addInitHook("addHandler", "touchZoom", Tn), Ji.BoxZoom = yn, Ji.DoubleClickZoom = xn, Ji.Drag = wn, Ji.Keyboard = Pn, Ji.ScrollWheelZoom = Ln, Ji.Tap = bn, Ji.TouchZoom = Tn, Object.freeze = i, t.version = "1.5.1+HEAD.2e3e0ff", t.Control = Qi, t.control = $i, t.Browser = Bt, t.Evented = k, t.Mixin = re, t.Util = S, t.Class = Z, t.Handler = oe, t.extend = h, t.bind = a, t.stamp = u, t.setOptions = p, t.DomEvent = Yi, t.DomUtil = Zi, t.PosAnimation = Xi, t.Draggable = le, t.LineUtil = ye, t.PolyUtil = Pe, t.Point = B, t.point = I, t.Bounds = O, t.bounds = R, t.Transformation = G, t.transformation = K, t.Projection = Te, t.LatLng = j, t.latLng = W, t.LatLngBounds = N, t.latLngBounds = D, t.CRS = F, t.GeoJSON = We, t.geoJSON = Xe, t.geoJson = Je, t.Layer = Se, t.LayerGroup = Ze, t.layerGroup = function (t, i) {
    return new Ze(t, i);
  }, t.FeatureGroup = Ee, t.featureGroup = function (t) {
    return new Ee(t);
  }, t.ImageOverlay = $e, t.imageOverlay = function (t, i, e) {
    return new $e(t, i, e);
  }, t.VideoOverlay = Qe, t.videoOverlay = function (t, i, e) {
    return new Qe(t, i, e);
  }, t.SVGOverlay = tn, t.svgOverlay = function (t, i, e) {
    return new tn(t, i, e);
  }, t.DivOverlay = en, t.Popup = nn, t.popup = function (t, i) {
    return new nn(t, i);
  }, t.Tooltip = on, t.tooltip = function (t, i) {
    return new on(t, i);
  }, t.Icon = ke, t.icon = function (t) {
    return new ke(t);
  }, t.DivIcon = sn, t.divIcon = function (t) {
    return new sn(t);
  }, t.Marker = Ie, t.marker = function (t, i) {
    return new Ie(t, i);
  }, t.TileLayer = an, t.tileLayer = hn, t.GridLayer = rn, t.gridLayer = function (t) {
    return new rn(t);
  }, t.SVG = fn, t.svg = gn, t.Renderer = ln, t.Canvas = cn, t.canvas = _n, t.Path = Oe, t.CircleMarker = Re, t.circleMarker = function (t, i) {
    return new Re(t, i);
  }, t.Circle = Ne, t.circle = function (t, i, e) {
    return new Ne(t, i, e);
  }, t.Polyline = De, t.polyline = function (t, i) {
    return new De(t, i);
  }, t.Polygon = je, t.polygon = function (t, i) {
    return new je(t, i);
  }, t.Rectangle = vn, t.rectangle = function (t, i) {
    return new vn(t, i);
  }, t.Map = Ji, t.map = function (t, i) {
    return new Ji(t, i);
  };
  var zn = window.L;
  t.noConflict = function () {
    return window.L = zn, this;
  }, window.L = t;
});
/**
 * @name Owl Carousel - code name Phenix
 * @author Bartosz Wojciechowski
 * @release 2014
 * Licensed under MIT
 * 
 * @version 2.0.0-beta.1.8
 * @versionNotes Not compatibile with Owl Carousel <2.0.0
 */

/*

{0,0}
 )_)
 ""

To do:

* Lazy Load Icon
* prevent animationend bubling
* itemsScaleUp 
* Test Zepto

Callback events list:

onInitBefore
onInitAfter
onResponsiveBefore
onResponsiveAfter
onTransitionStart
onTransitionEnd
onTouchStart
onTouchEnd
onChangeState
onLazyLoaded
onVideoPlay
onVideoStop

Custom events list:

next.owl
prev.owl
goTo.owl
jumpTo.owl
addItem.owl
removeItem.owl
refresh.owl
play.owl
stop.owl
stopVideo.owl

*/
;

(function ($, window, document, undefined) {
  var defaults = {
    items: 3,
    loop: false,
    center: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    freeDrag: false,
    margin: 0,
    stagePadding: 0,
    merge: false,
    mergeFit: true,
    autoWidth: false,
    autoHeight: false,
    startPosition: 0,
    URLhashListener: false,
    nav: false,
    navRewind: true,
    navText: ['prev', 'next'],
    slideBy: 1,
    dots: true,
    dotsEach: false,
    dotData: false,
    lazyLoad: false,
    lazyContent: false,
    autoplay: false,
    autoplayTimeout: 5000,
    autoplayHoverPause: false,
    smartSpeed: 250,
    fluidSpeed: false,
    autoplaySpeed: false,
    navSpeed: false,
    dotsSpeed: false,
    dragEndSpeed: false,
    responsive: {},
    responsiveRefreshRate: 200,
    responsiveBaseElement: window,
    responsiveClass: false,
    video: false,
    videoHeight: false,
    videoWidth: false,
    animateOut: false,
    animateIn: false,
    fallbackEasing: 'swing',
    callbacks: false,
    info: false,
    nestedItemSelector: false,
    itemElement: 'div',
    stageElement: 'div',
    //Classes and Names
    themeClass: 'owl-theme',
    baseClass: 'owl-carousel',
    itemClass: 'owl-item',
    centerClass: 'center',
    activeClass: 'active',
    navContainerClass: 'owl-nav',
    navClass: ['owl-prev', 'owl-next'],
    controlsClass: 'owl-controls',
    dotClass: 'owl-dot',
    dotsClass: 'owl-dots',
    autoHeightClass: 'owl-height'
  }; // Reference to DOM elements
  // Those with $ sign are jQuery objects

  var dom = {
    el: null,
    // main element 
    $el: null,
    // jQuery main element 
    stage: null,
    // stage
    $stage: null,
    // jQuery stage
    oStage: null,
    // outer stage
    $oStage: null,
    // $ outer stage
    $items: null,
    // all items, clones and originals included 
    $oItems: null,
    // original items
    $cItems: null,
    // cloned items only
    $cc: null,
    $navPrev: null,
    $navNext: null,
    $page: null,
    $nav: null,
    $content: null
  };
  /**
   * Variables
   * @since 2.0.0
   */
  // Only for development process
  // Widths

  var width = {
    el: 0,
    stage: 0,
    item: 0,
    prevWindow: 0,
    cloneLast: 0
  }; // Numbers

  var num = {
    items: 0,
    oItems: 0,
    cItems: 0,
    active: 0,
    merged: [],
    nav: [],
    allPages: 0
  }; // Positions

  var pos = {
    start: 0,
    max: 0,
    maxValue: 0,
    prev: 0,
    current: 0,
    currentAbs: 0,
    currentPage: 0,
    stage: 0,
    items: [],
    lsCurrent: 0
  }; // Drag/Touches

  var drag = {
    start: 0,
    startX: 0,
    startY: 0,
    current: 0,
    currentX: 0,
    currentY: 0,
    offsetX: 0,
    offsetY: 0,
    distance: null,
    startTime: 0,
    endTime: 0,
    updatedX: 0,
    targetEl: null
  }; // Speeds

  var speed = {
    onDragEnd: 300,
    nav: 300,
    css2speed: 0
  }; // States

  var state = {
    isTouch: false,
    isScrolling: false,
    isSwiping: false,
    direction: false,
    inMotion: false,
    autoplay: false,
    lazyContent: false
  }; // Event functions references

  var e = {
    _onDragStart: null,
    _onDragMove: null,
    _onDragEnd: null,
    _transitionEnd: null,
    _resizer: null,
    _responsiveCall: null,
    _goToLoop: null,
    _checkVisibile: null,
    _autoplay: null,
    _pause: null,
    _play: null,
    _stop: null
  };

  function Owl(element, options) {
    // add basic Owl information to dom element
    element.owlCarousel = {
      'name': 'Owl Carousel',
      'author': 'Bartosz Wojciechowski',
      'version': '2.0.0-beta.1.8',
      'released': '03.05.2014'
    }; // Attach variables to object
    // Only for development process

    this.options = $.extend({}, defaults, options);
    this._options = $.extend({}, defaults, options);
    this.dom = $.extend({}, dom);
    this.width = $.extend({}, width);
    this.num = $.extend({}, num);
    this.pos = $.extend({}, pos);
    this.drag = $.extend({}, drag);
    this.speed = $.extend({}, speed);
    this.state = $.extend({}, state);
    this.e = $.extend({}, e);
    this.dom.el = element;
    this.dom.$el = $(element);
    this.init();
  }
  /**
   * init
   * @since 2.0.0
   */


  Owl.prototype.init = function () {
    this.fireCallback('onInitBefore'); //Add base class

    if (!this.dom.$el.hasClass(this.options.baseClass)) {
      this.dom.$el.addClass(this.options.baseClass);
    } //Add theme class


    if (!this.dom.$el.hasClass(this.options.themeClass)) {
      this.dom.$el.addClass(this.options.themeClass);
    } //Add theme class


    if (this.options.rtl) {
      this.dom.$el.addClass('owl-rtl');
    } // Check support


    this.browserSupport(); // Sort responsive items in array

    this.sortOptions(); // Update options.items on given size

    this.setResponsiveOptions();

    if (this.options.autoWidth && this.state.imagesLoaded !== true) {
      var imgs = this.dom.$el.find('img');

      if (imgs.length) {
        this.preloadAutoWidthImages(imgs);
        return false;
      }
    } // Get and store window width
    // iOS safari likes to trigger unnecessary resize event


    this.width.prevWindow = this.windowWidth(); // create stage object

    this.createStage(); // Append local content 

    this.fetchContent(); // attach generic events 

    this.eventsCall(); // attach custom control events

    this.addCustomEvents(); // attach generic events 

    this.internalEvents();
    this.dom.$el.addClass('owl-loading');
    this.refresh(true);
    this.dom.$el.removeClass('owl-loading').addClass('owl-loaded');
    this.fireCallback('onInitAfter');
  };
  /**
   * sortOptions
   * @desc Sort responsive sizes 
   * @since 2.0.0
   */


  Owl.prototype.sortOptions = function () {
    var resOpt = this.options.responsive;
    this.responsiveSorted = {};
    var keys = [],
        i,
        j,
        k;

    for (i in resOpt) {
      keys.push(i);
    }

    keys = keys.sort(function (a, b) {
      return a - b;
    });

    for (j = 0; j < keys.length; j++) {
      k = keys[j];
      this.responsiveSorted[k] = resOpt[k];
    }
  };
  /**
   * setResponsiveOptions
   * @since 2.0.0
   */


  Owl.prototype.setResponsiveOptions = function () {
    if (this.options.responsive === false) {
      return false;
    }

    var width = this.windowWidth();
    var resOpt = this.options.responsive;
    var i, j, k, minWidth; // overwrite non resposnive options

    for (k in this._options) {
      if (k !== 'responsive') {
        this.options[k] = this._options[k];
      }
    } // find responsive width


    for (i in this.responsiveSorted) {
      if (i <= width) {
        minWidth = i; // set responsive options

        for (j in this.responsiveSorted[minWidth]) {
          this.options[j] = this.responsiveSorted[minWidth][j];
        }
      }
    }

    this.num.breakpoint = minWidth; // Responsive Class

    if (this.options.responsiveClass) {
      this.dom.$el.attr('class', function (i, c) {
        return c.replace(/\b owl-responsive-\S+/g, '');
      }).addClass('owl-responsive-' + minWidth);
    }
  };
  /**
   * optionsLogic
   * @desc Update option logic if necessery
   * @since 2.0.0
   */


  Owl.prototype.optionsLogic = function () {
    // Toggle Center class
    this.dom.$el.toggleClass('owl-center', this.options.center); // Scroll per - 'page' option will scroll per visible items number
    // You can set this to any other number below visible items.

    if (this.options.slideBy && this.options.slideBy === 'page') {
      this.options.slideBy = this.options.items;
    } else if (this.options.slideBy > this.options.items) {
      this.options.slideBy = this.options.items;
    } // if items number is less than in body


    if (this.options.loop && this.num.oItems < this.options.items) {
      this.options.loop = false;
    }

    if (this.num.oItems <= this.options.items) {
      this.options.navRewind = false;
    }

    if (this.options.autoWidth) {
      this.options.stagePadding = false;
      this.options.dotsEach = 1;
      this.options.merge = false;
    }

    if (this.state.lazyContent) {
      this.options.loop = false;
      this.options.merge = false;
      this.options.dots = false;
      this.options.freeDrag = false;
      this.options.lazyContent = true;
    }

    if ((this.options.animateIn || this.options.animateOut) && this.options.items === 1 && this.support3d) {
      this.state.animate = true;
    } else {
      this.state.animate = false;
    }
  };
  /**
   * createStage
   * @desc Create stage and Outer-stage elements
   * @since 2.0.0
   */


  Owl.prototype.createStage = function () {
    var oStage = document.createElement('div');
    var stage = document.createElement(this.options.stageElement);
    oStage.className = 'owl-stage-outer';
    stage.className = 'owl-stage';
    oStage.appendChild(stage);
    this.dom.el.appendChild(oStage);
    this.dom.oStage = oStage;
    this.dom.$oStage = $(oStage);
    this.dom.stage = stage;
    this.dom.$stage = $(stage);
    oStage = null;
    stage = null;
  };
  /**
   * createItem
   * @desc Create item container
   * @since 2.0.0
   */


  Owl.prototype.createItem = function () {
    var item = document.createElement(this.options.itemElement);
    item.className = this.options.itemClass;
    return item;
  };
  /**
   * fetchContent
   * @since 2.0.0
   */


  Owl.prototype.fetchContent = function (extContent) {
    if (extContent) {
      this.dom.$content = extContent instanceof jQuery ? extContent : $(extContent);
    } else if (this.options.nestedItemSelector) {
      this.dom.$content = this.dom.$el.find('.' + this.options.nestedItemSelector).not('.owl-stage-outer');
    } else {
      this.dom.$content = this.dom.$el.children().not('.owl-stage-outer');
    } // content length


    this.num.oItems = this.dom.$content.length; // init Structure

    if (this.num.oItems !== 0) {
      this.initStructure();
    }
  };
  /**
   * initStructure
   * @param [refresh] - if refresh and not lazyContent then dont create normal structure
   * @since 2.0.0
   */


  Owl.prototype.initStructure = function () {
    // lazyContent needs at least 3*items 
    if (this.options.lazyContent && this.num.oItems >= this.options.items * 3) {
      this.state.lazyContent = true;
    } else {
      this.state.lazyContent = false;
    }

    if (this.state.lazyContent) {
      // start position
      this.pos.currentAbs = this.options.items; //remove lazy content from DOM

      this.dom.$content.remove();
    } else {
      // create normal structure
      this.createNormalStructure();
    }
  };
  /**
   * createNormalStructure
   * @desc Create normal structure for small/mid weight content
   * @since 2.0.0
   */


  Owl.prototype.createNormalStructure = function () {
    for (var i = 0; i < this.num.oItems; i++) {
      // fill 'owl-item' with content 
      var item = this.fillItem(this.dom.$content, i); // append into stage 

      this.dom.$stage.append(item);
    }

    this.dom.$content = null;
  };
  /**
   * createCustomStructure
   * @since 2.0.0
   */


  Owl.prototype.createCustomStructure = function (howManyItems) {
    for (var i = 0; i < howManyItems; i++) {
      var emptyItem = this.createItem();
      var item = $(emptyItem);
      this.setData(item, false);
      this.dom.$stage.append(item);
    }
  };
  /**
   * createLazyContentStructure
   * @desc Create lazyContent structure for large content and better mobile experience
   * @since 2.0.0
   */


  Owl.prototype.createLazyContentStructure = function (refresh) {
    if (!this.state.lazyContent) {
      return false;
    } // prevent recreate - to do


    if (refresh && this.dom.$stage.children().length === this.options.items * 3) {
      return false;
    } // remove items from stage


    this.dom.$stage.empty(); // create custom structure

    this.createCustomStructure(3 * this.options.items);
  };
  /**
   * fillItem
   * @desc Fill empty item container with provided content
   * @since 2.0.0
   * @param [content] - string/$dom - passed owl-item
   * @param [i] - index in jquery object
   * return $ new object
   */


  Owl.prototype.fillItem = function (content, i) {
    var emptyItem = this.createItem();
    var c = content[i] || content; // set item data 

    var traversed = this.traversContent(c);
    this.setData(emptyItem, false, traversed);
    return $(emptyItem).append(c);
  };
  /**
   * traversContent
   * @since 2.0.0
   * @param [c] - content
   * return object
   */


  Owl.prototype.traversContent = function (c) {
    var $c = $(c),
        dotValue,
        hashValue;

    if (this.options.dotData) {
      dotValue = $c.find('[data-dot]').andSelf().data('dot');
    } // update URL hash


    if (this.options.URLhashListener) {
      hashValue = $c.find('[data-hash]').andSelf().data('hash');
    }

    return {
      dot: dotValue || false,
      hash: hashValue || false
    };
  };
  /**
   * setData
   * @desc Set item jQuery Data 
   * @since 2.0.0
   * @param [item] - dom - passed owl-item
   * @param [cloneObj] - $dom - passed clone item
   */


  Owl.prototype.setData = function (item, cloneObj, traversed) {
    var dot, hash;

    if (traversed) {
      dot = traversed.dot;
      hash = traversed.hash;
    }

    var itemData = {
      index: false,
      indexAbs: false,
      posLeft: false,
      clone: false,
      active: false,
      loaded: false,
      lazyLoad: false,
      current: false,
      width: false,
      center: false,
      page: false,
      hasVideo: false,
      playVideo: false,
      dot: dot,
      hash: hash
    }; // copy itemData to cloned item 

    if (cloneObj) {
      itemData = $.extend({}, itemData, cloneObj.data('owl-item'));
    }

    $(item).data('owl-item', itemData);
  };
  /**
   * updateLocalContent
   * @since 2.0.0
   */


  Owl.prototype.updateLocalContent = function () {
    this.dom.$oItems = this.dom.$stage.find('.' + this.options.itemClass).filter(function () {
      return $(this).data('owl-item').clone === false;
    });
    this.num.oItems = this.dom.$oItems.length; //update index on original items

    for (var k = 0; k < this.num.oItems; k++) {
      var item = this.dom.$oItems.eq(k);
      item.data('owl-item').index = k;
    }
  };
  /**
   * checkVideoLinks
   * @desc Check if for any videos links
   * @since 2.0.0
   */


  Owl.prototype.checkVideoLinks = function () {
    if (!this.options.video) {
      return false;
    }

    var videoEl, item;

    for (var i = 0; i < this.num.items; i++) {
      item = this.dom.$items.eq(i);

      if (item.data('owl-item').hasVideo) {
        continue;
      }

      videoEl = item.find('.owl-video');

      if (videoEl.length) {
        this.state.hasVideos = true;
        this.dom.$items.eq(i).data('owl-item').hasVideo = true;
        videoEl.css('display', 'none');
        this.getVideoInfo(videoEl, item);
      }
    }
  };
  /**
   * getVideoInfo
   * @desc Get Video ID and Type (YouTube/Vimeo only)
   * @since 2.0.0
   */


  Owl.prototype.getVideoInfo = function (videoEl, item) {
    var info,
        type,
        id,
        vimeoId = videoEl.data('vimeo-id'),
        youTubeId = videoEl.data('youtube-id'),
        width = videoEl.data('width') || this.options.videoWidth,
        height = videoEl.data('height') || this.options.videoHeight,
        url = videoEl.attr('href');

    if (vimeoId) {
      type = 'vimeo';
      id = vimeoId;
    } else if (youTubeId) {
      type = 'youtube';
      id = youTubeId;
    } else if (url) {
      id = url.match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/);

      if (id[3].indexOf('youtu') > -1) {
        type = 'youtube';
      } else if (id[3].indexOf('vimeo') > -1) {
        type = 'vimeo';
      }

      id = id[6];
    } else {
      throw new Error('Missing video link.');
    }

    item.data('owl-item').videoType = type;
    item.data('owl-item').videoId = id;
    item.data('owl-item').videoWidth = width;
    item.data('owl-item').videoHeight = height;
    info = {
      type: type,
      id: id
    }; // Check dimensions

    var dimensions = width && height ? 'style="width:' + width + 'px;height:' + height + 'px;"' : ''; // wrap video content into owl-video-wrapper div

    videoEl.wrap('<div class="owl-video-wrapper"' + dimensions + '></div>');
    this.createVideoTn(videoEl, info);
  };
  /**
   * createVideoTn
   * @desc Create Video Thumbnail
   * @since 2.0.0
   */


  Owl.prototype.createVideoTn = function (videoEl, info) {
    var tnLink, icon, height;
    var customTn = videoEl.find('img');
    var srcType = 'src';
    var lazyClass = '';
    var that = this;

    if (this.options.lazyLoad) {
      srcType = 'data-src';
      lazyClass = 'owl-lazy';
    } // Custom thumbnail


    if (customTn.length) {
      addThumbnail(customTn.attr(srcType));
      customTn.remove();
      return false;
    }

    function addThumbnail(tnPath) {
      icon = '<div class="owl-video-play-icon"></div>';

      if (that.options.lazyLoad) {
        tnLink = '<div class="owl-video-tn ' + lazyClass + '" ' + srcType + '="' + tnPath + '"></div>';
      } else {
        tnLink = '<div class="owl-video-tn" style="opacity:1;background-image:url(' + tnPath + ')"></div>';
      }

      videoEl.after(tnLink);
      videoEl.after(icon);
    }

    if (info.type === 'youtube') {
      var path = "http://img.youtube.com/vi/" + info.id + "/hqdefault.jpg";
      addThumbnail(path);
    } else if (info.type === 'vimeo') {
      $.ajax({
        type: 'GET',
        url: 'http://vimeo.com/api/v2/video/' + info.id + '.json',
        jsonp: 'callback',
        dataType: 'jsonp',
        success: function (data) {
          var path = data[0].thumbnail_large;
          addThumbnail(path);

          if (that.options.loop) {
            that.updateItemState();
          }
        }
      });
    }
  };
  /**
   * stopVideo
   * @since 2.0.0
   */


  Owl.prototype.stopVideo = function () {
    this.fireCallback('onVideoStop');
    var item = this.dom.$items.eq(this.state.videoPlayIndex);
    item.find('.owl-video-frame').remove();
    item.removeClass('owl-video-playing');
    this.state.videoPlay = false;
  };
  /**
   * playVideo
   * @since 2.0.0
   */


  Owl.prototype.playVideo = function (ev) {
    this.fireCallback('onVideoPlay');

    if (this.state.videoPlay) {
      this.stopVideo();
    }

    var videoLink,
        videoWrap,
        target = $(ev.target || ev.srcElement),
        item = target.closest('.' + this.options.itemClass);
    var videoType = item.data('owl-item').videoType,
        id = item.data('owl-item').videoId,
        width = item.data('owl-item').videoWidth || Math.floor(item.data('owl-item').width - this.options.margin),
        height = item.data('owl-item').videoHeight || this.dom.$stage.height();

    if (videoType === 'youtube') {
      videoLink = "<iframe width=\"" + width + "\" height=\"" + height + "\" src=\"http://www.youtube.com/embed/" + id + "?autoplay=1&v=" + id + "\" frameborder=\"0\" allowfullscreen></iframe>";
    } else if (videoType === 'vimeo') {
      videoLink = '<iframe src="http://player.vimeo.com/video/' + id + '?autoplay=1" width="' + width + '" height="' + height + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
    }

    item.addClass('owl-video-playing');
    this.state.videoPlay = true;
    this.state.videoPlayIndex = item.data('owl-item').indexAbs;
    videoWrap = $('<div style="height:' + height + 'px; width:' + width + 'px" class="owl-video-frame">' + videoLink + '</div>');
    target.after(videoWrap);
  };
  /**
   * loopClone
   * @desc Make a clones for infinity loop
   * @since 2.0.0
   */


  Owl.prototype.loopClone = function () {
    if (!this.options.loop || this.state.lazyContent || this.num.oItems < this.options.items) {
      return false;
    }

    var firstClone,
        lastClone,
        i,
        num = this.options.items,
        lastNum = this.num.oItems - 1; // if neighbour margin then add one more duplicat

    if (this.options.stagePadding && this.options.items === 1) {
      num += 1;
    }

    this.num.cItems = num * 2;

    for (i = 0; i < num; i++) {
      // Clone item 
      var first = this.dom.$oItems.eq(i).clone(true, true);
      var last = this.dom.$oItems.eq(lastNum - i).clone(true, true);
      firstClone = $(first[0]).addClass('cloned');
      lastClone = $(last[0]).addClass('cloned'); // set clone data 
      // Somehow data has reference to same data id in cash 

      this.setData(firstClone[0], first);
      this.setData(lastClone[0], last);
      firstClone.data('owl-item').clone = true;
      lastClone.data('owl-item').clone = true;
      this.dom.$stage.append(firstClone);
      this.dom.$stage.prepend(lastClone);
      firstClone = lastClone = null;
    }

    this.dom.$cItems = this.dom.$stage.find('.' + this.options.itemClass).filter(function () {
      return $(this).data('owl-item').clone === true;
    });
  };
  /**
   * reClone
   * @desc Update Cloned elements
   * @since 2.0.0
   */


  Owl.prototype.reClone = function () {
    // remove cloned items 
    if (this.dom.$cItems !== null) {
      // && (this.num.oItems !== 0 && this.num.oItems <= this.options.items)){
      this.dom.$cItems.remove();
      this.dom.$cItems = null;
      this.num.cItems = 0;
    }

    if (!this.options.loop) {
      return;
    } // generete new elements 


    this.loopClone();
  };
  /**
   * calculate
   * @desc Update item index data
   * @since 2.0.0
   */


  Owl.prototype.calculate = function () {
    var i,
        j,
        k,
        dist,
        posLeft = 0,
        fullWidth = 0; // element width minus neighbour 

    this.width.el = this.dom.$el.width() - this.options.stagePadding * 2; //to check

    this.width.view = this.dom.$el.width(); // calculate width minus addition margins 

    var elMinusMargin = this.width.el - this.options.margin * (this.options.items === 1 ? 0 : this.options.items - 1); // calculate element width and item width 

    this.width.el = this.width.el + this.options.margin;
    this.width.item = (elMinusMargin / this.options.items + this.options.margin).toFixed(3);
    this.dom.$items = this.dom.$stage.find('.owl-item');
    this.num.items = this.dom.$items.length; //change to autoWidths

    if (this.options.autoWidth) {
      this.dom.$items.css('width', '');
    } // Set grid array 


    this.pos.items = [];
    this.num.merged = [];
    this.num.nav = []; // item distances

    if (this.options.rtl) {
      dist = this.options.center ? -(this.width.el / 2) : 0;
    } else {
      dist = this.options.center ? this.width.el / 2 : 0;
    }

    this.width.mergeStage = 0; // Calculate items positions

    for (i = 0; i < this.num.items; i++) {
      // check merged items
      if (this.options.merge) {
        var mergeNumber = this.dom.$items.eq(i).find('[data-merge]').attr('data-merge') || 1;

        if (this.options.mergeFit && mergeNumber > this.options.items) {
          mergeNumber = this.options.items;
        }

        this.num.merged.push(parseInt(mergeNumber));
        this.width.mergeStage += this.width.item * this.num.merged[i];
      } else {
        this.num.merged.push(1);
      } // Array based on merged items used by dots and navigation


      if (this.options.loop) {
        if (i >= this.num.cItems / 2 && i < this.num.cItems / 2 + this.num.oItems) {
          this.num.nav.push(this.num.merged[i]);
        }
      } else {
        this.num.nav.push(this.num.merged[i]);
      }

      var iWidth = this.width.item * this.num.merged[i]; // autoWidth item size

      if (this.options.autoWidth) {
        iWidth = this.dom.$items.eq(i).width() + this.options.margin;

        if (this.options.rtl) {
          this.dom.$items[i].style.marginLeft = this.options.margin + 'px';
        } else {
          this.dom.$items[i].style.marginRight = this.options.margin + 'px';
        }
      } // push item position into array


      this.pos.items.push(dist); // update item data

      this.dom.$items.eq(i).data('owl-item').posLeft = posLeft;
      this.dom.$items.eq(i).data('owl-item').width = iWidth; // dist starts from middle of stage if center
      // posLeft always starts from 0

      if (this.options.rtl) {
        dist += iWidth;
        posLeft += iWidth;
      } else {
        dist -= iWidth;
        posLeft -= iWidth;
      }

      fullWidth -= Math.abs(iWidth); // update position if center

      if (this.options.center) {
        this.pos.items[i] = !this.options.rtl ? this.pos.items[i] - iWidth / 2 : this.pos.items[i] + iWidth / 2;
      }
    }

    if (this.options.autoWidth) {
      this.width.stage = this.options.center ? Math.abs(fullWidth) : Math.abs(dist);
    } else {
      this.width.stage = Math.abs(fullWidth);
    } //update indexAbs on all items 


    var allItems = this.num.oItems + this.num.cItems;

    for (j = 0; j < allItems; j++) {
      this.dom.$items.eq(j).data('owl-item').indexAbs = j;
    } // Set Min and Max


    this.setMinMax(); // Recalculate grid 

    this.setSizes();
  };
  /**
   * setMinMax
   * @since 2.0.0
   */


  Owl.prototype.setMinMax = function () {
    // set Min
    var minimum = this.dom.$oItems.eq(0).data('owl-item').indexAbs;
    this.pos.min = 0;
    this.pos.minValue = this.pos.items[minimum]; // set max position

    if (!this.options.loop) {
      this.pos.max = this.num.oItems - 1;
    }

    if (this.options.loop) {
      this.pos.max = this.num.oItems + this.options.items;
    }

    if (!this.options.loop && !this.options.center) {
      this.pos.max = this.num.oItems - this.options.items;
    }

    if (this.options.loop && this.options.center) {
      this.pos.max = this.num.oItems + this.options.items;
    } //set max value


    this.pos.maxValue = this.pos.items[this.pos.max]; //Max for autoWidth content 

    if (!this.options.loop && !this.options.center && this.options.autoWidth || this.options.merge && !this.options.center) {
      var revert = this.options.rtl ? 1 : -1;

      for (i = 0; i < this.pos.items.length; i++) {
        if (this.pos.items[i] * revert < this.width.stage - this.width.el) {
          this.pos.max = i + 1;
        }
      }

      this.pos.maxValue = this.options.rtl ? this.width.stage - this.width.el : -(this.width.stage - this.width.el);
      this.pos.items[this.pos.max] = this.pos.maxValue;
    } // Set loop boundries


    if (this.options.center) {
      this.pos.loop = this.pos.items[0] - this.pos.items[this.num.oItems];
    } else {
      this.pos.loop = -this.pos.items[this.num.oItems];
    } //if is less items


    if (this.num.oItems < this.options.items && !this.options.center) {
      this.pos.max = 0;
      this.pos.maxValue = this.pos.items[0];
    }
  };
  /**
   * setSizes
   * @desc Set sizes on elements (from collectData function)
   * @since 2.0.0
   */


  Owl.prototype.setSizes = function () {
    // show neighbours 
    if (this.options.stagePadding !== false) {
      this.dom.oStage.style.paddingLeft = this.options.stagePadding + 'px';
      this.dom.oStage.style.paddingRight = this.options.stagePadding + 'px';
    } // CRAZY FIX!!! Doublecheck this!
    //if(this.width.stagePrev > this.width.stage){


    if (this.options.rtl) {
      window.setTimeout(function () {
        this.dom.stage.style.width = this.width.stage + 'px';
      }.bind(this), 0);
    } else {
      this.dom.stage.style.width = this.width.stage + 'px';
    }

    for (var i = 0; i < this.num.items; i++) {
      // Set items width
      if (!this.options.autoWidth) {
        this.dom.$items[i].style.width = this.width.item - this.options.margin + 'px';
      } // add margin


      if (this.options.rtl) {
        this.dom.$items[i].style.marginLeft = this.options.margin + 'px';
      } else {
        this.dom.$items[i].style.marginRight = this.options.margin + 'px';
      }

      if (this.num.merged[i] !== 1 && !this.options.autoWidth) {
        this.dom.$items[i].style.width = this.width.item * this.num.merged[i] - this.options.margin + 'px';
      }
    } // save prev stage size 


    this.width.stagePrev = this.width.stage;
  };
  /**
   * responsive
   * @desc Responsive function update all data by calling refresh() 
   * @since 2.0.0
   */


  Owl.prototype.responsive = function () {
    if (!this.num.oItems) {
      return false;
    } // If El width hasnt change then stop responsive 


    var elChanged = this.isElWidthChanged();

    if (!elChanged) {
      return false;
    } // if Vimeo Fullscreen mode


    var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;

    if (fullscreenElement) {
      if ($(fullscreenElement.parentNode).hasClass('owl-video-frame')) {
        this.setSpeed(0);
        this.state.isFullScreen = true;
      }
    }

    if (fullscreenElement && this.state.isFullScreen && this.state.videoPlay) {
      return false;
    } // Comming back from fullscreen


    if (this.state.isFullScreen) {
      this.state.isFullScreen = false;
      return false;
    } // check full screen mode and window orientation


    if (this.state.videoPlay) {
      if (this.state.orientation !== window.orientation) {
        this.state.orientation = window.orientation;
        return false;
      }
    }

    this.fireCallback('onResponsiveBefore');
    this.state.responsive = true;
    this.refresh();
    this.state.responsive = false;
    this.fireCallback('onResponsiveAfter');
  };
  /**
   * refresh
   * @desc Refresh method is basically collection of functions that are responsible for Owl responsive functionality
   * @since 2.0.0
   */


  Owl.prototype.refresh = function (init) {
    if (this.state.videoPlay) {
      this.stopVideo();
    } // Update Options for given width


    this.setResponsiveOptions(); //set lazy structure

    this.createLazyContentStructure(true); // update info about local content

    this.updateLocalContent(); // udpate options

    this.optionsLogic(); // if no items then stop 

    if (this.num.oItems === 0) {
      if (this.dom.$page !== null) {
        this.dom.$page.hide();
      }

      return false;
    } // Hide and Show methods helps here to set a proper widths.
    // This prevents Scrollbar to be calculated in stage width


    this.dom.$stage.addClass('owl-refresh'); // Remove clones and generate new ones

    this.reClone(); // calculate 

    this.calculate(); //aaaand show.

    this.dom.$stage.removeClass('owl-refresh'); // to do
    // lazyContent last position on refresh

    if (this.state.lazyContent) {
      this.pos.currentAbs = this.options.items;
    }

    this.initPosition(init); // jump to last position 

    if (!this.state.lazyContent && !init) {
      this.jumpTo(this.pos.current, false); // fix that 
    } //Check for videos ( YouTube and Vimeo currently supported)


    this.checkVideoLinks();
    this.updateItemState(); // Update controls

    this.rebuildDots();
    this.updateControls(); // update drag events
    //this.updateEvents();
    // update autoplay

    this.autoplay();
    this.autoHeight();
    this.state.orientation = window.orientation;
    this.watchVisibility();
  };
  /**
   * updateItemState
   * @desc Update information about current state of items (visibile, hidden, active, etc.)
   * @since 2.0.0
   */


  Owl.prototype.updateItemState = function (update) {
    if (!this.state.lazyContent) {
      this.updateActiveItems();
    } else {
      this.updateLazyContent(update);
    }

    if (this.options.center) {
      this.dom.$items.eq(this.pos.currentAbs).addClass(this.options.centerClass).data('owl-item').center = true;
    }

    if (this.options.lazyLoad) {
      this.lazyLoad();
    }
  };
  /**
   * updateActiveItems
   * @since 2.0.0
   */


  Owl.prototype.updateActiveItems = function () {
    var i, j, item, ipos, iwidth, wpos, stage, outsideView, foundCurrent; // clear states

    for (i = 0; i < this.num.items; i++) {
      this.dom.$items.eq(i).data('owl-item').active = false;
      this.dom.$items.eq(i).data('owl-item').current = false;
      this.dom.$items.eq(i).removeClass(this.options.activeClass).removeClass(this.options.centerClass);
    }

    this.num.active = 0;
    stageX = this.pos.stage;
    view = this.options.rtl ? this.width.view : -this.width.view;

    for (j = 0; j < this.num.items; j++) {
      item = this.dom.$items.eq(j);
      ipos = item.data('owl-item').posLeft;
      iwidth = item.data('owl-item').width;
      outsideView = this.options.rtl ? ipos + iwidth : ipos - iwidth;

      if (this.op(ipos, '<=', stageX) && this.op(ipos, '>', stageX + view) || this.op(outsideView, '<', stageX) && this.op(outsideView, '>', stageX + view)) {
        this.num.active++;

        if (this.options.freeDrag && !foundCurrent) {
          foundCurrent = true;
          this.pos.current = item.data('owl-item').index;
          this.pos.currentAbs = item.data('owl-item').indexAbs;
        }

        item.data('owl-item').active = true;
        item.data('owl-item').current = true;
        item.addClass(this.options.activeClass);

        if (!this.options.lazyLoad) {
          item.data('owl-item').loaded = true;
        }

        if (this.options.loop && (this.options.lazyLoad || this.options.center)) {
          this.updateClonedItemsState(item.data('owl-item').index);
        }
      }
    }
  };
  /**
   * updateClonedItemsState
   * @desc Set current state on sibilings items for lazyLoad and center
   * @since 2.0.0
   */


  Owl.prototype.updateClonedItemsState = function (activeIndex) {
    //find cloned center
    var center, $el, i;

    if (this.options.center) {
      center = this.dom.$items.eq(this.pos.currentAbs).data('owl-item').index;
    }

    for (i = 0; i < this.num.items; i++) {
      $el = this.dom.$items.eq(i);

      if ($el.data('owl-item').index === activeIndex) {
        $el.data('owl-item').current = true;

        if ($el.data('owl-item').index === center) {
          $el.addClass(this.options.centerClass);
        }
      }
    }
  };
  /**
   * updateLazyPosition
   * @desc Set current state on sibilings items for lazyLoad and center
   * @since 2.0.0
   */


  Owl.prototype.updateLazyPosition = function () {
    var jumpTo = this.pos.goToLazyContent || 0;
    this.pos.lcMovedBy = Math.abs(this.options.items - this.pos.currentAbs);

    if (this.options.items < this.pos.currentAbs) {
      this.pos.lcCurrent += this.pos.currentAbs - this.options.items;
      this.state.lcDirection = 'right';
    } else if (this.options.items > this.pos.currentAbs) {
      this.pos.lcCurrent -= this.options.items - this.pos.currentAbs;
      this.state.lcDirection = 'left';
    }

    this.pos.lcCurrent = jumpTo !== 0 ? jumpTo : this.pos.lcCurrent;

    if (this.pos.lcCurrent >= this.dom.$content.length) {
      this.pos.lcCurrent = this.pos.lcCurrent - this.dom.$content.length;
    } else if (this.pos.lcCurrent < -this.dom.$content.length + 1) {
      this.pos.lcCurrent = this.pos.lcCurrent + this.dom.$content.length;
    }

    if (this.options.startPosition > 0) {
      this.pos.lcCurrent = this.options.startPosition;
      this._options.startPosition = this.options.startPosition = 0;
    }

    this.pos.lcCurrentAbs = this.pos.lcCurrent < 0 ? this.pos.lcCurrent + this.dom.$content.length : this.pos.lcCurrent;
  };
  /**
   * updateLazyContent
   * @param [update] - boolean - update call by content manipulations
   * @since 2.0.0
   */


  Owl.prototype.updateLazyContent = function (update) {
    if (this.pos.lcCurrent === undefined) {
      this.pos.lcCurrent = 0;
      this.pos.current = this.pos.currentAbs = this.options.items;
    }

    if (!update) {
      this.updateLazyPosition();
    }

    var i, j, item, contentPos, content, freshItem, freshData;

    if (this.state.lcDirection !== false) {
      for (i = 0; i < this.pos.lcMovedBy; i++) {
        if (this.state.lcDirection === 'right') {
          item = this.dom.$stage.find('.owl-item').eq(0); //.appendTo(this.dom.$stage);

          item.appendTo(this.dom.$stage);
        }

        if (this.state.lcDirection === 'left') {
          item = this.dom.$stage.find('.owl-item').eq(-1);
          item.prependTo(this.dom.$stage);
        }

        item.data('owl-item').active = false;
      }
    } // recollect 


    this.dom.$items = this.dom.$stage.find('.owl-item');

    for (j = 0; j < this.num.items; j++) {
      // to do
      this.dom.$items.eq(j).removeClass(this.options.centerClass); // get Content 

      contentPos = this.pos.lcCurrent + j - this.options.items; // + this.options.startPosition;

      if (contentPos >= this.dom.$content.length) {
        contentPos = contentPos - this.dom.$content.length;
      }

      if (contentPos < -this.dom.$content.length) {
        contentPos = contentPos + this.dom.$content.length;
      }

      content = this.dom.$content.eq(contentPos);
      freshItem = this.dom.$items.eq(j);
      freshData = freshItem.data('owl-item');

      if (freshData.active === false || this.pos.goToLazyContent !== 0 || update === true) {
        freshItem.empty();
        freshItem.append(content.clone(true, true));
        freshData.active = true;
        freshData.current = true;

        if (!this.options.lazyLoad) {
          freshData.loaded = true;
        } else {
          freshData.loaded = false;
        }
      }
    }

    this.pos.goToLazyContent = 0;
    this.pos.current = this.pos.currentAbs = this.options.items;
    this.setSpeed(0);
    this.animStage(this.pos.items[this.options.items]);
  };
  /**
   * eventsCall
   * @desc Save internal event references and add event based functions like transitionEnd,responsive etc.
   * @since 2.0.0
   */


  Owl.prototype.eventsCall = function () {
    // Save events references 
    this.e._onDragStart = function (e) {
      this.onDragStart(e);
    }.bind(this);

    this.e._onDragMove = function (e) {
      this.onDragMove(e);
    }.bind(this);

    this.e._onDragEnd = function (e) {
      this.onDragEnd(e);
    }.bind(this);

    this.e._transitionEnd = function (e) {
      this.transitionEnd(e);
    }.bind(this);

    this.e._resizer = function () {
      this.responsiveTimer();
    }.bind(this);

    this.e._responsiveCall = function () {
      this.responsive();
    }.bind(this);

    this.e._preventClick = function (e) {
      this.preventClick(e);
    }.bind(this);

    this.e._goToHash = function () {
      this.goToHash();
    }.bind(this);

    this.e._goToPage = function (e) {
      this.goToPage(e);
    }.bind(this);

    this.e._ap = function () {
      this.autoplay();
    }.bind(this);

    this.e._play = function () {
      this.play();
    }.bind(this);

    this.e._pause = function () {
      this.pause();
    }.bind(this);

    this.e._playVideo = function (e) {
      this.playVideo(e);
    }.bind(this);

    this.e._navNext = function (e) {
      if ($(e.target).hasClass('disabled')) {
        return false;
      }

      e.preventDefault();
      this.next();
    }.bind(this);

    this.e._navPrev = function (e) {
      if ($(e.target).hasClass('disabled')) {
        return false;
      }

      e.preventDefault();
      this.prev();
    }.bind(this);
  };
  /**
   * responsiveTimer
   * @desc Check Window resize event with 200ms delay / this.options.responsiveRefreshRate
   * @since 2.0.0
   */


  Owl.prototype.responsiveTimer = function () {
    if (this.windowWidth() === this.width.prevWindow) {
      return false;
    }

    window.clearInterval(this.e._autoplay);
    window.clearTimeout(this.resizeTimer);
    this.resizeTimer = window.setTimeout(this.e._responsiveCall, this.options.responsiveRefreshRate);
    this.width.prevWindow = this.windowWidth();
  };
  /**
   * internalEvents
   * @desc Checks for touch/mouse drag options and add necessery event handlers.
   * @since 2.0.0
   */


  Owl.prototype.internalEvents = function () {
    var isTouch = isTouchSupport();
    var isTouchIE = isTouchSupportIE();

    if (isTouch && !isTouchIE) {
      this.dragType = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];
    } else if (isTouch && isTouchIE) {
      this.dragType = ['MSPointerDown', 'MSPointerMove', 'MSPointerUp', 'MSPointerCancel'];
    } else {
      this.dragType = ['mousedown', 'mousemove', 'mouseup'];
    }

    if ((isTouch || isTouchIE) && this.options.touchDrag) {
      //touch cancel event 
      this.on(document, this.dragType[3], this.e._onDragEnd);
    } else {
      // firefox startdrag fix - addeventlistener doesnt work here :/
      this.dom.$stage.on('dragstart', function () {
        return false;
      });

      if (this.options.mouseDrag) {
        //disable text select
        this.dom.stage.onselectstart = function () {
          return false;
        };
      } else {
        // enable text select
        this.dom.$el.addClass('owl-text-select-on');
      }
    } // Video Play Button event delegation


    this.dom.$stage.on(this.dragType[2], '.owl-video-play-icon', this.e._playVideo);

    if (this.options.URLhashListener) {
      this.on(window, 'hashchange', this.e._goToHash, false);
    }

    if (this.options.autoplayHoverPause) {
      var that = this;
      this.dom.$stage.on('mouseover', this.e._pause);
      this.dom.$stage.on('mouseleave', this.e._ap);
    } // Catch transitionEnd event


    if (this.transitionEndVendor) {
      this.on(this.dom.stage, this.transitionEndVendor, this.e._transitionEnd, false);
    } // Responsive


    if (this.options.responsive !== false) {
      this.on(window, 'resize', this.e._resizer, false);
    }

    this.updateEvents();
  };
  /**
   * updateEvents
   * @since 2.0.0
   */


  Owl.prototype.updateEvents = function () {
    if (this.options.touchDrag && (this.dragType[0] === 'touchstart' || this.dragType[0] === 'MSPointerDown')) {
      this.on(this.dom.stage, this.dragType[0], this.e._onDragStart, false);
    } else if (this.options.mouseDrag && this.dragType[0] === 'mousedown') {
      this.on(this.dom.stage, this.dragType[0], this.e._onDragStart, false);
    } else {
      this.off(this.dom.stage, this.dragType[0], this.e._onDragStart);
    }
  };
  /**
   * onDragStart
   * @desc touchstart/mousedown event
   * @since 2.0.0
   */


  Owl.prototype.onDragStart = function (event) {
    var ev = event.originalEvent || event || window.event; // prevent right click

    if (ev.which === 3) {
      return false;
    }

    if (this.dragType[0] === 'mousedown') {
      this.dom.$stage.addClass('owl-grab');
    }

    this.fireCallback('onTouchStart');
    this.drag.startTime = new Date().getTime();
    this.setSpeed(0);
    this.state.isTouch = true;
    this.state.isScrolling = false;
    this.state.isSwiping = false;
    this.drag.distance = 0; // if is 'touchstart'

    var isTouchEvent = ev.type === 'touchstart';
    var pageX = isTouchEvent ? event.targetTouches[0].pageX : ev.pageX || ev.clientX;
    var pageY = isTouchEvent ? event.targetTouches[0].pageY : ev.pageY || ev.clientY; //get stage position left

    this.drag.offsetX = this.dom.$stage.position().left - this.options.stagePadding;
    this.drag.offsetY = this.dom.$stage.position().top;

    if (this.options.rtl) {
      this.drag.offsetX = this.dom.$stage.position().left + this.width.stage - this.width.el + this.options.margin;
    } //catch position // ie to fix


    if (this.state.inMotion && this.support3d) {
      var animatedPos = this.getTransformProperty();
      this.drag.offsetX = animatedPos;
      this.animStage(animatedPos);
    } else if (this.state.inMotion && !this.support3d) {
      this.state.inMotion = false;
      return false;
    }

    this.drag.startX = pageX - this.drag.offsetX;
    this.drag.startY = pageY - this.drag.offsetY;
    this.drag.start = pageX - this.drag.startX;
    this.drag.targetEl = ev.target || ev.srcElement;
    this.drag.updatedX = this.drag.start; // to do/check
    //prevent links and images dragging;
    //this.drag.targetEl.draggable = false;

    this.on(document, this.dragType[1], this.e._onDragMove, false);
    this.on(document, this.dragType[2], this.e._onDragEnd, false);
  };
  /**
   * onDragMove
   * @desc touchmove/mousemove event
   * @since 2.0.0
   */


  Owl.prototype.onDragMove = function (event) {
    if (!this.state.isTouch) {
      return;
    }

    if (this.state.isScrolling) {
      return;
    }

    var neighbourItemWidth = 0;
    var ev = event.originalEvent || event || window.event; // if is 'touchstart'

    var isTouchEvent = ev.type == 'touchmove';
    var pageX = isTouchEvent ? ev.targetTouches[0].pageX : ev.pageX || ev.clientX;
    var pageY = isTouchEvent ? ev.targetTouches[0].pageY : ev.pageY || ev.clientY; // Drag Direction 

    this.drag.currentX = pageX - this.drag.startX;
    this.drag.currentY = pageY - this.drag.startY;
    this.drag.distance = this.drag.currentX - this.drag.offsetX; // Check move direction 

    if (this.drag.distance < 0) {
      this.state.direction = this.options.rtl ? 'right' : 'left';
    } else if (this.drag.distance > 0) {
      this.state.direction = this.options.rtl ? 'left' : 'right';
    } // Loop


    if (this.options.loop) {
      if (this.op(this.drag.currentX, '>', this.pos.minValue) && this.state.direction === 'right') {
        this.drag.currentX -= this.pos.loop;
      } else if (this.op(this.drag.currentX, '<', this.pos.maxValue) && this.state.direction === 'left') {
        this.drag.currentX += this.pos.loop;
      }
    } else {
      // pull
      var minValue = this.options.rtl ? this.pos.maxValue : this.pos.minValue;
      var maxValue = this.options.rtl ? this.pos.minValue : this.pos.maxValue;
      var pull = this.options.pullDrag ? this.drag.distance / 5 : 0;
      this.drag.currentX = Math.max(Math.min(this.drag.currentX, minValue + pull), maxValue + pull);
    } // Lock browser if swiping horizontal


    if (this.drag.distance > 8 || this.drag.distance < -8) {
      if (ev.preventDefault !== undefined) {
        ev.preventDefault();
      } else {
        ev.returnValue = false;
      }

      this.state.isSwiping = true;
    }

    this.drag.updatedX = this.drag.currentX; // Lock Owl if scrolling 

    if ((this.drag.currentY > 16 || this.drag.currentY < -16) && this.state.isSwiping === false) {
      this.state.isScrolling = true;
      this.drag.updatedX = this.drag.start;
    }

    this.animStage(this.drag.updatedX);
  };
  /**
   * onDragEnd 
   * @desc touchend/mouseup event
   * @since 2.0.0
   */


  Owl.prototype.onDragEnd = function (event) {
    if (!this.state.isTouch) {
      return;
    }

    if (this.dragType[0] === 'mousedown') {
      this.dom.$stage.removeClass('owl-grab');
    }

    this.fireCallback('onTouchEnd'); //prevent links and images dragging;
    //this.drag.targetEl.draggable = true;
    //remove drag event listeners

    this.state.isTouch = false;
    this.state.isScrolling = false;
    this.state.isSwiping = false; //to check

    if (this.drag.distance === 0 && this.state.inMotion !== true) {
      this.state.inMotion = false;
      return false;
    } // prevent clicks while scrolling


    this.drag.endTime = new Date().getTime();
    var compareTimes = this.drag.endTime - this.drag.startTime;
    var distanceAbs = Math.abs(this.drag.distance); //to test

    if (distanceAbs > 3 || compareTimes > 300) {
      this.removeClick(this.drag.targetEl);
    }

    var closest = this.closest(this.drag.updatedX);
    this.setSpeed(this.options.dragEndSpeed, false, true);
    this.animStage(this.pos.items[closest]); //if pullDrag is off then fire transitionEnd event manually when stick to border

    if (!this.options.pullDrag && this.drag.updatedX === this.pos.items[closest]) {
      this.transitionEnd();
    }

    this.drag.distance = 0;
    this.off(document, this.dragType[1], this.e._onDragMove);
    this.off(document, this.dragType[2], this.e._onDragEnd);
  };
  /**
   * removeClick
   * @desc Attach preventClick function to disable link while swipping
   * @since 2.0.0
   * @param [target] - clicked dom element
   */


  Owl.prototype.removeClick = function (target) {
    this.drag.targetEl = target;
    this.on(target, 'click', this.e._preventClick, false);
  };
  /**
   * preventClick
   * @desc Add preventDefault for any link and then remove removeClick event hanlder
   * @since 2.0.0
   */


  Owl.prototype.preventClick = function (ev) {
    if (ev.preventDefault) {
      ev.preventDefault();
    } else {
      ev.returnValue = false;
    }

    if (ev.stopPropagation) {
      ev.stopPropagation();
    }

    this.off(this.drag.targetEl, 'click', this.e._preventClick, false);
  };
  /**
   * getTransformProperty
   * @desc catch stage position while animate (only css3)
   * @since 2.0.0
   */


  Owl.prototype.getTransformProperty = function () {
    var transform = window.getComputedStyle(this.dom.stage, null).getPropertyValue(this.vendorName + 'transform'); //var transform = this.dom.$stage.css(this.vendorName + 'transform')

    transform = transform.replace(/matrix(3d)?\(|\)/g, '').split(',');
    var matrix3d = transform.length === 16;
    return matrix3d !== true ? transform[4] : transform[12];
  };
  /**
   * closest
   * @desc Get closest item after touchend/mouseup
   * @since 2.0.0
   * @param [x] - curent position in pixels
   * return position in pixels
   */


  Owl.prototype.closest = function (x) {
    var newX = 0,
        pull = 30;

    if (!this.options.freeDrag) {
      // Check closest item
      for (var i = 0; i < this.num.items; i++) {
        if (x > this.pos.items[i] - pull && x < this.pos.items[i] + pull) {
          newX = i;
        } else if (this.op(x, '<', this.pos.items[i]) && this.op(x, '>', this.pos.items[i + 1 || this.pos.items[i] - this.width.el])) {
          newX = this.state.direction === 'left' ? i + 1 : i;
        }
      }
    } //non loop boundries


    if (!this.options.loop) {
      if (this.op(x, '>', this.pos.minValue)) {
        newX = x = this.pos.min;
      } else if (this.op(x, '<', this.pos.maxValue)) {
        newX = x = this.pos.max;
      }
    }

    if (!this.options.freeDrag) {
      // set positions
      this.pos.currentAbs = newX;
      this.pos.current = this.dom.$items.eq(newX).data('owl-item').index;
    } else {
      this.updateItemState();
      return x;
    }

    return newX;
  };
  /**
   * animStage
   * @desc animate stage position (both css3/css2) and perform onChange functions/events
   * @since 2.0.0
   * @param [x] - curent position in pixels
   */


  Owl.prototype.animStage = function (pos) {
    // if speed is 0 the set inMotion to false
    if (this.speed.current !== 0 && this.pos.currentAbs !== this.pos.min) {
      this.fireCallback('onTransitionStart');
      this.state.inMotion = true;
    }

    var posX = this.pos.stage = pos,
        style = this.dom.stage.style;

    if (this.support3d) {
      translate = 'translate3d(' + posX + 'px' + ',0px, 0px)';
      style[this.transformVendor] = translate;
    } else if (this.state.isTouch) {
      style.left = posX + 'px';
    } else {
      this.dom.$stage.animate({
        left: posX
      }, this.speed.css2speed, this.options.fallbackEasing, function () {
        if (this.state.inMotion) {
          this.transitionEnd();
        }
      }.bind(this));
    }

    this.onChange();
  };
  /**
   * updatePosition
   * @desc Update current positions
   * @since 2.0.0
   * @param [pos] - number - new position
   */


  Owl.prototype.updatePosition = function (pos) {
    // if no items then stop 
    if (this.num.oItems === 0) {
      return false;
    } // to do
    //if(pos > this.num.items){pos = 0;}


    if (pos === undefined) {
      return false;
    } //pos - new current position


    var nextPos = pos;
    this.pos.prev = this.pos.currentAbs;

    if (this.state.revert) {
      this.pos.current = this.dom.$items.eq(nextPos).data('owl-item').index;
      this.pos.currentAbs = nextPos;
      return;
    }

    if (!this.options.loop) {
      if (this.options.navRewind) {
        nextPos = nextPos > this.pos.max ? this.pos.min : nextPos < 0 ? this.pos.max : nextPos;
      } else {
        nextPos = nextPos > this.pos.max ? this.pos.max : nextPos <= 0 ? 0 : nextPos;
      }
    } else {
      nextPos = nextPos >= this.num.oItems ? this.num.oItems - 1 : nextPos;
    }

    this.pos.current = this.dom.$oItems.eq(nextPos).data('owl-item').index;
    this.pos.currentAbs = this.dom.$oItems.eq(nextPos).data('owl-item').indexAbs;
  };
  /**
   * setSpeed
   * @since 2.0.0
   * @param [speed] - number
   * @param [pos] - number - next position - use this param to calculate smartSpeed
   * @param [drag] - boolean - if drag is true then smart speed is disabled
   * return speed
   */


  Owl.prototype.setSpeed = function (speed, pos, drag) {
    var s = speed,
        nextPos = pos;

    if (s === false && s !== 0 && drag !== true || s === undefined) {
      //Double check this
      // var nextPx = this.pos.items[nextPos];
      // var currPx = this.pos.stage 
      // var diff = Math.abs(nextPx-currPx);
      // var s = diff/1
      // if(s>1000){
      // 	s = 1000;
      // }
      var diff = Math.abs(nextPos - this.pos.prev);
      diff = diff === 0 ? 1 : diff;

      if (diff > 6) {
        diff = 6;
      }

      s = diff * this.options.smartSpeed;
    }

    if (s === false && drag === true) {
      s = this.options.smartSpeed;
    }

    if (s === 0) {
      s = 0;
    }

    if (this.support3d) {
      var style = this.dom.stage.style;
      style.webkitTransitionDuration = style.MsTransitionDuration = style.msTransitionDuration = style.MozTransitionDuration = style.OTransitionDuration = style.transitionDuration = s / 1000 + 's';
    } else {
      this.speed.css2speed = s;
    }

    this.speed.current = s;
    return s;
  };
  /**
   * jumpTo
   * @since 2.0.0
   * @param [pos] - number - next position - use this param to calculate smartSpeed
   * @param [update] - boolean - if drag is true then smart speed is disabled
   */


  Owl.prototype.jumpTo = function (pos, update) {
    if (this.state.lazyContent) {
      this.pos.goToLazyContent = pos;
    }

    this.updatePosition(pos);
    this.setSpeed(0);
    this.animStage(this.pos.items[this.pos.currentAbs]);

    if (update !== true) {
      this.updateItemState();
    }
  };
  /**
   * goTo
   * @since 2.0.0
   * @param [pos] - number
   * @param [speed] - speed in ms
   * @param [speed] - speed in ms
   */


  Owl.prototype.goTo = function (pos, speed) {
    if (this.state.lazyContent && this.state.inMotion) {
      return false;
    }

    this.updatePosition(pos);

    if (this.state.animate) {
      speed = 0;
    }

    this.setSpeed(speed, this.pos.currentAbs);

    if (this.state.animate) {
      this.animate();
    }

    this.animStage(this.pos.items[this.pos.currentAbs]);
  };
  /**
   * next
   * @since 2.0.0
   */


  Owl.prototype.next = function (optionalSpeed) {
    var s = optionalSpeed || this.options.navSpeed;

    if (this.options.loop && !this.state.lazyContent) {
      this.goToLoop(this.options.slideBy, s);
    } else {
      this.goTo(this.pos.current + this.options.slideBy, s);
    }
  };
  /**
   * prev
   * @since 2.0.0
   */


  Owl.prototype.prev = function (optionalSpeed) {
    var s = optionalSpeed || this.options.navSpeed;

    if (this.options.loop && !this.state.lazyContent) {
      this.goToLoop(-this.options.slideBy, s);
    } else {
      this.goTo(this.pos.current - this.options.slideBy, s);
    }
  };
  /**
   * goToLoop
   * @desc Go to given position if loop is enabled - used only internal
   * @since 2.0.0
   * @param [distance] - number -how far to go
   * @param [speed] - number - speed in ms
   */


  Owl.prototype.goToLoop = function (distance, speed) {
    var revert = this.pos.currentAbs,
        prevPosition = this.pos.currentAbs,
        newPosition = this.pos.currentAbs + distance,
        direction = prevPosition - newPosition < 0 ? true : false;
    this.state.revert = true;

    if (newPosition < 1 && direction === false) {
      this.state.bypass = true;
      revert = this.num.items - (this.options.items - prevPosition) - this.options.items;
      this.jumpTo(revert, true);
    } else if (newPosition >= this.num.items - this.options.items && direction === true) {
      this.state.bypass = true;
      revert = prevPosition - this.num.oItems;
      this.jumpTo(revert, true);
    }

    window.clearTimeout(this.e._goToLoop);
    this.e._goToLoop = window.setTimeout(function () {
      this.state.bypass = false;
      this.goTo(revert + distance, speed);
      this.state.revert = false;
    }.bind(this), 30);
  };
  /**
   * initPosition
   * @since 2.0.0
   */


  Owl.prototype.initPosition = function (init) {
    if (!this.dom.$oItems || !init || this.state.lazyContent) {
      return false;
    }

    var pos = this.options.startPosition;

    if (this.options.startPosition === 'URLHash') {
      pos = this.options.startPosition = this.hashPosition();
    } else if (typeof this.options.startPosition !== Number && !this.options.center) {
      this.options.startPosition = 0;
    }

    this.dom.oStage.scrollLeft = 0;
    this.jumpTo(pos, true);
  };
  /**
   * goToHash
   * @since 2.0.0
   */


  Owl.prototype.goToHash = function () {
    var pos = this.hashPosition();

    if (pos === false) {
      pos = 0;
    }

    this.dom.oStage.scrollLeft = 0;
    this.goTo(pos, this.options.navSpeed);
  };
  /**
   * hashPosition
   * @desc Find hash in URL then look into items to find contained ID
   * @since 2.0.0
   * return hashPos - number of item
   */


  Owl.prototype.hashPosition = function () {
    var hash = window.location.hash.substring(1),
        hashPos;

    if (hash === "") {
      return false;
    }

    for (var i = 0; i < this.num.oItems; i++) {
      if (hash === this.dom.$oItems.eq(i).data('owl-item').hash) {
        hashPos = i;
      }
    }

    return hashPos;
  };
  /**
   * Autoplay
   * @since 2.0.0
   */


  Owl.prototype.autoplay = function () {
    if (this.options.autoplay && !this.state.videoPlay) {
      window.clearInterval(this.e._autoplay);
      this.e._autoplay = window.setInterval(this.e._play, this.options.autoplayTimeout);
    } else {
      window.clearInterval(this.e._autoplay);
      this.state.autoplay = false;
    }
  };
  /**
   * play
   * @param [timeout] - Integrer
   * @param [speed] - Integrer
   * @since 2.0.0
   */


  Owl.prototype.play = function (timeout, speed) {
    // if tab is inactive - doesnt work in <IE10
    if (document.hidden === true) {
      return false;
    } // overwrite default options (custom options are always priority)


    if (!this.options.autoplay) {
      this._options.autoplay = this.options.autoplay = true;
      this._options.autoplayTimeout = this.options.autoplayTimeout = timeout || this.options.autoplayTimeout || 4000;
      this._options.autoplaySpeed = speed || this.options.autoplaySpeed;
    }

    if (this.options.autoplay === false || this.state.isTouch || this.state.isScrolling || this.state.isSwiping || this.state.inMotion) {
      window.clearInterval(this.e._autoplay);
      return false;
    }

    if (!this.options.loop && this.pos.current >= this.pos.max) {
      window.clearInterval(this.e._autoplay);
      this.goTo(0);
    } else {
      this.next(this.options.autoplaySpeed);
    }

    this.state.autoplay = true;
  };
  /**
   * stop
   * @since 2.0.0
   */


  Owl.prototype.stop = function () {
    this._options.autoplay = this.options.autoplay = false;
    this.state.autoplay = false;
    window.clearInterval(this.e._autoplay);
  };

  Owl.prototype.pause = function () {
    window.clearInterval(this.e._autoplay);
  };
  /**
   * transitionEnd
   * @desc event used by css3 animation end and $.animate callback like transitionEnd,responsive etc.
   * @since 2.0.0
   */


  Owl.prototype.transitionEnd = function (event) {
    // if css2 animation then event object is undefined 
    if (event !== undefined) {
      event.stopPropagation(); // Catch only owl-stage transitionEnd event

      var eventTarget = event.target || event.srcElement || event.originalTarget;

      if (eventTarget !== this.dom.stage) {
        return false;
      }
    }

    this.state.inMotion = false;
    this.updateItemState();
    this.autoplay();
    this.fireCallback('onTransitionEnd');
  };
  /**
   * isElWidthChanged
   * @desc Check if element width has changed
   * @since 2.0.0
   */


  Owl.prototype.isElWidthChanged = function () {
    var newElWidth = this.dom.$el.width() - this.options.stagePadding,
        //to check
    prevElWidth = this.width.el + this.options.margin;
    return newElWidth !== prevElWidth;
  };
  /**
   * windowWidth
   * @desc Get Window/responsiveBaseElement width
   * @since 2.0.0
   */


  Owl.prototype.windowWidth = function () {
    if (this.options.responsiveBaseElement !== window) {
      this.width.window = $(this.options.responsiveBaseElement).width();
    } else if (window.innerWidth) {
      this.width.window = window.innerWidth;
    } else if (document.documentElement && document.documentElement.clientWidth) {
      this.width.window = document.documentElement.clientWidth;
    }

    return this.width.window;
  };
  /**
   * Controls
   * @desc Calls controls container, navigation and dots creator
   * @since 2.0.0
   */


  Owl.prototype.controls = function () {
    var cc = document.createElement('div');
    cc.className = this.options.controlsClass;
    this.dom.$el.append(cc);
    this.dom.$cc = $(cc);
  };
  /**
   * updateControls 
   * @since 2.0.0
   */


  Owl.prototype.updateControls = function () {
    if (this.dom.$cc === null && (this.options.nav || this.options.dots)) {
      this.controls();
    }

    if (this.dom.$nav === null && this.options.nav) {
      this.createNavigation(this.dom.$cc[0]);
    }

    if (this.dom.$page === null && this.options.dots) {
      this.createDots(this.dom.$cc[0]);
    }

    if (this.dom.$nav !== null) {
      if (this.options.nav) {
        this.dom.$nav.show();
        this.updateNavigation();
      } else {
        this.dom.$nav.hide();
      }
    }

    if (this.dom.$page !== null) {
      if (this.options.dots) {
        this.dom.$page.show();
        this.updateDots();
      } else {
        this.dom.$page.hide();
      }
    }
  };
  /**
   * createNavigation
   * @since 2.0.0
   * @param [cc] - dom element - Controls Container
   */


  Owl.prototype.createNavigation = function (cc) {
    // Create nav container
    var nav = document.createElement('div');
    nav.className = this.options.navContainerClass;
    cc.appendChild(nav); // Create left and right buttons

    var navPrev = document.createElement('div'),
        navNext = document.createElement('div');
    navPrev.className = this.options.navClass[0];
    navNext.className = this.options.navClass[1];
    nav.appendChild(navPrev);
    nav.appendChild(navNext);
    this.dom.$nav = $(nav);
    this.dom.$navPrev = $(navPrev).html(this.options.navText[0]);
    this.dom.$navNext = $(navNext).html(this.options.navText[1]); // add events to do
    //this.on(navPrev, this.dragType[2], this.e._navPrev, false);
    //this.on(navNext, this.dragType[2], this.e._navNext, false);
    //FF fix?

    this.dom.$nav.on(this.dragType[2], '.' + this.options.navClass[0], this.e._navPrev);
    this.dom.$nav.on(this.dragType[2], '.' + this.options.navClass[1], this.e._navNext);
  };
  /**
   * createNavigation
   * @since 2.0.0
   * @param [cc] - dom element - Controls Container
   */


  Owl.prototype.createDots = function (cc) {
    // Create dots container
    var page = document.createElement('div');
    page.className = this.options.dotsClass;
    cc.appendChild(page); // save reference

    this.dom.$page = $(page); // add events
    //this.on(page, this.dragType[2], this.e._goToPage, false);
    // FF fix? To test!

    var that = this;
    this.dom.$page.on(this.dragType[2], '.' + this.options.dotClass, goToPage);

    function goToPage(e) {
      e.preventDefault();
      var page = $(this).data('page');
      that.goTo(page, that.options.dotsSpeed);
    } // build dots


    this.rebuildDots();
  };
  /**
   * goToPage
   * @desc Event used by dots
   * @since 2.0.0
   */
  // Owl.prototype.goToPage = function(e){
  // 	console.log(e.taget);
  // 	var page = $(e.currentTarget).data('page')
  // 	this.goTo(page,this.options.dotsSpeed);
  // 	return false;
  // };

  /**
   * rebuildDots
   * @since 2.0.0
   */


  Owl.prototype.rebuildDots = function () {
    if (this.dom.$page === null) {
      return false;
    }

    var each,
        dot,
        span,
        counter = 0,
        last = 0,
        i,
        page = 0,
        roundPages = 0;
    each = this.options.dotsEach || this.options.items; // display full dots if center

    if (this.options.center || this.options.dotData) {
      each = 1;
    } // clear dots


    this.dom.$page.html('');

    for (i = 0; i < this.num.nav.length; i++) {
      if (counter >= each || counter === 0) {
        dot = document.createElement('div');
        dot.className = this.options.dotClass;
        span = document.createElement('span');
        dot.appendChild(span);
        var $dot = $(dot);

        if (this.options.dotData) {
          $dot.html(this.dom.$oItems.eq(i).data('owl-item').dot);
        }

        $dot.data('page', page);
        $dot.data('goToPage', roundPages);
        this.dom.$page.append(dot);
        counter = 0;
        roundPages++;
      }

      this.dom.$oItems.eq(i).data('owl-item').page = roundPages - 1; //add merged items

      counter += this.num.nav[i];
      page++;
    } // find rest of dots


    if (!this.options.loop && !this.options.center) {
      for (var j = this.num.nav.length - 1; j >= 0; j--) {
        last += this.num.nav[j];
        this.dom.$oItems.eq(j).data('owl-item').page = roundPages - 1;

        if (last >= each) {
          break;
        }
      }
    }

    this.num.allPages = roundPages - 1;
  };
  /**
   * updateDots
   * @since 2.0.0
   */


  Owl.prototype.updateDots = function () {
    var dots = this.dom.$page.children();
    var itemIndex = this.dom.$oItems.eq(this.pos.current).data('owl-item').page;

    for (var i = 0; i < dots.length; i++) {
      var dotPage = dots.eq(i).data('goToPage');

      if (dotPage === itemIndex) {
        this.pos.currentPage = i;
        dots.eq(i).addClass('active');
      } else {
        dots.eq(i).removeClass('active');
      }
    }
  };
  /**
   * updateNavigation
   * @since 2.0.0
   */


  Owl.prototype.updateNavigation = function () {
    var isNav = this.options.nav;
    this.dom.$navNext.toggleClass('disabled', !isNav);
    this.dom.$navPrev.toggleClass('disabled', !isNav);

    if (!this.options.loop && isNav && !this.options.navRewind) {
      if (this.pos.current <= 0) {
        this.dom.$navPrev.addClass('disabled');
      }

      if (this.pos.current >= this.pos.max) {
        this.dom.$navNext.addClass('disabled');
      }
    }
  };

  Owl.prototype.insertContent = function (content) {
    this.dom.$stage.empty();
    this.fetchContent(content);
    this.refresh();
  };
  /**
   * addItem - Add an item
   * @since 2.0.0
   * @param [content] - dom element / string '<div>content</div>'
   * @param [pos] - number - position
   */


  Owl.prototype.addItem = function (content, pos) {
    pos = pos || 0;

    if (this.state.lazyContent) {
      this.dom.$content = this.dom.$content.add($(content));
      this.updateItemState(true);
    } else {
      // wrap content
      var item = this.fillItem(content); // if carousel is empty then append item

      if (this.dom.$oItems.length === 0) {
        this.dom.$stage.append(item);
      } else {
        // append item
        var it = this.dom.$oItems.eq(pos);

        if (pos !== -1) {
          it.before(item);
        } else {
          it.after(item);
        }
      } // update and calculate carousel


      this.refresh();
    }
  };
  /**
   * removeItem - Remove an Item
   * @since 2.0.0
   * @param [pos] - number - position
   */


  Owl.prototype.removeItem = function (pos) {
    if (this.state.lazyContent) {
      this.dom.$content.splice(pos, 1);
      this.updateItemState(true);
    } else {
      this.dom.$oItems.eq(pos).remove();
      this.refresh();
    }
  };
  /**
   * addCustomEvents
   * @desc Add custom events by jQuery .on method
   * @since 2.0.0
   */


  Owl.prototype.addCustomEvents = function () {
    this.e.next = function (e, s) {
      this.next(s);
    }.bind(this);

    this.e.prev = function (e, s) {
      this.prev(s);
    }.bind(this);

    this.e.goTo = function (e, p, s) {
      this.goTo(p, s);
    }.bind(this);

    this.e.jumpTo = function (e, p) {
      this.jumpTo(p);
    }.bind(this);

    this.e.addItem = function (e, c, p) {
      this.addItem(c, p);
    }.bind(this);

    this.e.removeItem = function (e, p) {
      this.removeItem(p);
    }.bind(this);

    this.e.refresh = function (e) {
      this.refresh();
    }.bind(this);

    this.e.destroy = function (e) {
      this.destroy();
    }.bind(this);

    this.e.autoHeight = function (e) {
      this.autoHeight(true);
    }.bind(this);

    this.e.stop = function () {
      this.stop();
    }.bind(this);

    this.e.play = function (e, t, s) {
      this.play(t, s);
    }.bind(this);

    this.e.insertContent = function (e, d) {
      this.insertContent(d);
    }.bind(this);

    this.dom.$el.on('next.owl', this.e.next);
    this.dom.$el.on('prev.owl', this.e.prev);
    this.dom.$el.on('goTo.owl', this.e.goTo);
    this.dom.$el.on('jumpTo.owl', this.e.jumpTo);
    this.dom.$el.on('addItem.owl', this.e.addItem);
    this.dom.$el.on('removeItem.owl', this.e.removeItem);
    this.dom.$el.on('destroy.owl', this.e.destroy);
    this.dom.$el.on('refresh.owl', this.e.refresh);
    this.dom.$el.on('autoHeight.owl', this.e.autoHeight);
    this.dom.$el.on('play.owl', this.e.play);
    this.dom.$el.on('stop.owl', this.e.stop);
    this.dom.$el.on('stopVideo.owl', this.e.stop);
    this.dom.$el.on('insertContent.owl', this.e.insertContent);
  };
  /**
   * on
   * @desc On method for adding internal events
   * @since 2.0.0
   */


  Owl.prototype.on = function (element, event, listener, capture) {
    if (element.addEventListener) {
      element.addEventListener(event, listener, capture);
    } else if (element.attachEvent) {
      element.attachEvent('on' + event, listener);
    }
  };
  /**
   * off
   * @desc Off method for removing internal events
   * @since 2.0.0
   */


  Owl.prototype.off = function (element, event, listener, capture) {
    if (element.removeEventListener) {
      element.removeEventListener(event, listener, capture);
    } else if (element.detachEvent) {
      element.detachEvent('on' + event, listener);
    }
  };
  /**
   * fireCallback
   * @since 2.0.0
   * @param event - string - event name
   * @param data - object - additional options - to do
   */


  Owl.prototype.fireCallback = function (event, data) {
    if (!this.options.callbacks) {
      return;
    }

    if (this.dom.el.dispatchEvent) {
      // dispatch event
      var evt = document.createEvent('CustomEvent'); //evt.initEvent(event, false, true );

      evt.initCustomEvent(event, true, true, data);
      return this.dom.el.dispatchEvent(evt);
    } else if (!this.dom.el.dispatchEvent) {
      //	There is no clean solution for custom events name in <=IE8 
      //	But if you know better way, please let me know :) 
      return this.dom.$el.trigger(event);
    }
  };
  /**
   * watchVisibility
   * @desc check if el is visible - handy if Owl is inside hidden content (tabs etc.)
   * @since 2.0.0
   */


  Owl.prototype.watchVisibility = function () {
    // test on zepto
    if (!isElVisible(this.dom.el)) {
      this.dom.$el.addClass('owl-hidden');
      window.clearInterval(this.e._checkVisibile);
      this.e._checkVisibile = window.setInterval(checkVisible.bind(this), 500);
    }

    function isElVisible(el) {
      return el.offsetWidth > 0 && el.offsetHeight > 0;
    }

    function checkVisible() {
      if (isElVisible(this.dom.el)) {
        this.dom.$el.removeClass('owl-hidden');
        this.refresh();
        window.clearInterval(this.e._checkVisibile);
      }
    }
  };
  /**
   * onChange
   * @since 2.0.0
   */


  Owl.prototype.onChange = function () {
    if (!this.state.isTouch && !this.state.bypass && !this.state.responsive) {
      if (this.options.nav || this.options.dots) {
        this.updateControls();
      }

      this.autoHeight();
      this.fireCallback('onChangeState');
    }

    if (!this.state.isTouch && !this.state.bypass) {
      // set Status to do
      this.storeInfo(); // stopVideo 

      if (this.state.videoPlay) {
        this.stopVideo();
      }
    }
  };
  /**
   * storeInfo
   * store basic information about current states
   * @since 2.0.0
   */


  Owl.prototype.storeInfo = function () {
    var currentPosition = this.state.lazyContent ? this.pos.lcCurrentAbs || 0 : this.pos.current;
    var allItems = this.state.lazyContent ? this.dom.$content.length - 1 : this.num.oItems;
    this.info = {
      items: this.options.items,
      allItems: allItems,
      currentPosition: currentPosition,
      currentPage: this.pos.currentPage,
      allPages: this.num.allPages,
      autoplay: this.state.autoplay,
      windowWidth: this.width.window,
      elWidth: this.width.el,
      breakpoint: this.num.breakpoint
    };

    if (typeof this.options.info === 'function') {
      this.options.info.apply(this, [this.info, this.dom.el]);
    }
  };
  /**
   * autoHeight
   * @since 2.0.0
   */


  Owl.prototype.autoHeight = function (callback) {
    if (this.options.autoHeight !== true && callback !== true) {
      return false;
    }

    if (!this.dom.$oStage.hasClass(this.options.autoHeightClass)) {
      this.dom.$oStage.addClass(this.options.autoHeightClass);
    }

    var loaded = this.dom.$items.eq(this.pos.currentAbs);
    var stage = this.dom.$oStage;
    var iterations = 0;
    var isLoaded = window.setInterval(function () {
      iterations += 1;

      if (loaded.data('owl-item').loaded) {
        stage.height(loaded.height() + 'px');
        clearInterval(isLoaded);
      } else if (iterations === 500) {
        clearInterval(isLoaded);
      }
    }, 100);
  };
  /**
   * preloadAutoWidthImages
   * @desc still to test
   * @since 2.0.0
   */


  Owl.prototype.preloadAutoWidthImages = function (imgs) {
    var loaded = 0;
    var that = this;
    imgs.each(function (i, el) {
      var $el = $(el);
      var img = new Image();

      img.onload = function () {
        loaded++;
        $el.attr('src', img.src);
        $el.css('opacity', 1);

        if (loaded >= imgs.length) {
          that.state.imagesLoaded = true;
          that.init();
        }
      };

      img.src = $el.attr('src') || $el.attr('data-src') || $el.attr('data-src-retina');
      ;
    });
  };
  /**
   * lazyLoad
   * @desc lazyLoad images
   * @since 2.0.0
   */


  Owl.prototype.lazyLoad = function () {
    var attr = isRetina() ? 'data-src-retina' : 'data-src';
    var src, img, i;

    for (i = 0; i < this.num.items; i++) {
      var $item = this.dom.$items.eq(i);

      if ($item.data('owl-item').current === true && $item.data('owl-item').loaded === false) {
        img = $item.find('.owl-lazy');
        src = img.attr(attr);
        src = src || img.attr('data-src');

        if (src) {
          img.css('opacity', '0');
          this.preload(img, $item);
        }
      }
    }
  };
  /**
   * preload
   * @since 2.0.0
   */


  Owl.prototype.preload = function (images, $item) {
    var that = this; // fix this later

    images.each(function (i, el) {
      var $el = $(el);
      var img = new Image();

      img.onload = function () {
        $item.data('owl-item').loaded = true;

        if ($el.is('img')) {
          $el.attr('src', img.src);
        } else {
          $el.css('background-image', 'url(' + img.src + ')');
        }

        $el.css('opacity', 1);
        that.fireCallback('onLazyLoaded');
      };

      img.src = $el.attr('data-src') || $el.attr('data-src-retina');
    });
  };
  /**
   * animate
   * @since 2.0.0
   */


  Owl.prototype.animate = function () {
    var prevItem = this.dom.$items.eq(this.pos.prev),
        prevPos = Math.abs(prevItem.data('owl-item').width) * this.pos.prev,
        currentItem = this.dom.$items.eq(this.pos.currentAbs),
        currentPos = Math.abs(currentItem.data('owl-item').width) * this.pos.currentAbs;

    if (this.pos.currentAbs === this.pos.prev) {
      return false;
    }

    var pos = currentPos - prevPos;
    var tIn = this.options.animateIn;
    var tOut = this.options.animateOut;
    var that = this;

    removeStyles = function () {
      $(this).css({
        "left": ""
      }).removeClass('animated owl-animated-out owl-animated-in').removeClass(tIn).removeClass(tOut);
      that.transitionEnd();
    };

    if (tOut) {
      prevItem.css({
        "left": pos + "px"
      }).addClass('animated owl-animated-out ' + tOut).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', removeStyles);
    }

    if (tIn) {
      currentItem.addClass('animated owl-animated-in ' + tIn).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', removeStyles);
    }
  };
  /**
   * destroy
   * @desc Remove Owl structure and events :(
   * @since 2.0.0
   */


  Owl.prototype.destroy = function () {
    window.clearInterval(this.e._autoplay);

    if (this.dom.$el.hasClass(this.options.themeClass)) {
      this.dom.$el.removeClass(this.options.themeClass);
    }

    if (this.options.responsive !== false) {
      this.off(window, 'resize', this.e._resizer);
    }

    if (this.transitionEndVendor) {
      this.off(this.dom.stage, this.transitionEndVendor, this.e._transitionEnd);
    }

    if (this.options.mouseDrag || this.options.touchDrag) {
      this.off(this.dom.stage, this.dragType[0], this.e._onDragStart);

      if (this.options.mouseDrag) {
        this.off(document, this.dragType[3], this.e._onDragStart);
      }

      if (this.options.mouseDrag) {
        this.dom.$stage.off('dragstart', function () {
          return false;
        });

        this.dom.stage.onselectstart = function () {};
      }
    }

    if (this.options.URLhashListener) {
      this.off(window, 'hashchange', this.e._goToHash);
    }

    this.dom.$el.off('next.owl', this.e.next);
    this.dom.$el.off('prev.owl', this.e.prev);
    this.dom.$el.off('goTo.owl', this.e.goTo);
    this.dom.$el.off('jumpTo.owl', this.e.jumpTo);
    this.dom.$el.off('addItem.owl', this.e.addItem);
    this.dom.$el.off('removeItem.owl', this.e.removeItem);
    this.dom.$el.off('refresh.owl', this.e.refresh);
    this.dom.$el.off('autoHeight.owl', this.e.autoHeight);
    this.dom.$el.off('play.owl', this.e.play);
    this.dom.$el.off('stop.owl', this.e.stop);
    this.dom.$el.off('stopVideo.owl', this.e.stop);
    this.dom.$stage.off('click', this.e._playVideo);

    if (this.dom.$cc !== null) {
      this.dom.$cc.remove();
    }

    if (this.dom.$cItems !== null) {
      this.dom.$cItems.remove();
    }

    this.e = null;
    this.dom.$el.data('owlCarousel', null);
    delete this.dom.el.owlCarousel;
    this.dom.$stage.unwrap();
    this.dom.$items.unwrap();
    this.dom.$items.contents().unwrap();
    this.dom = null;
  };
  /**
   * Opertators 
   * @desc Used to calculate RTL
   * @param [a] - Number - left side
   * @param [o] - String - operator 
   * @param [b] - Number - right side
   * @since 2.0.0
   */


  Owl.prototype.op = function (a, o, b) {
    var rtl = this.options.rtl;

    switch (o) {
      case '<':
        return rtl ? a > b : a < b;

      case '>':
        return rtl ? a < b : a > b;

      case '>=':
        return rtl ? a <= b : a >= b;

      case '<=':
        return rtl ? a >= b : a <= b;

      default:
        break;
    }
  };
  /**
   * Opertators 
   * @desc Used to calculate RTL
   * @since 2.0.0
   */


  Owl.prototype.browserSupport = function () {
    this.support3d = isPerspective();

    if (this.support3d) {
      this.transformVendor = isTransform(); // take transitionend event name by detecting transition

      var endVendors = ['transitionend', 'webkitTransitionEnd', 'transitionend', 'oTransitionEnd'];
      this.transitionEndVendor = endVendors[isTransition()]; // take vendor name from transform name

      this.vendorName = this.transformVendor.replace(/Transform/i, '');
      this.vendorName = this.vendorName !== '' ? '-' + this.vendorName.toLowerCase() + '-' : '';
    }

    this.state.orientation = window.orientation;
  }; // Pivate methods 
  // CSS detection;


  function isStyleSupported(array) {
    var p,
        s,
        fake = document.createElement('div'),
        list = array;

    for (p in list) {
      s = list[p];

      if (typeof fake.style[s] !== 'undefined') {
        fake = null;
        return [s, p];
      }
    }

    return [false];
  }

  function isTransition() {
    return isStyleSupported(['transition', 'WebkitTransition', 'MozTransition', 'OTransition'])[1];
  }

  function isTransform() {
    return isStyleSupported(['transform', 'WebkitTransform', 'MozTransform', 'OTransform', 'msTransform'])[0];
  }

  function isPerspective() {
    return isStyleSupported(['perspective', 'webkitPerspective', 'MozPerspective', 'OPerspective', 'MsPerspective'])[0];
  }

  function isTouchSupport() {
    return 'ontouchstart' in window || !!navigator.msMaxTouchPoints;
  }

  function isTouchSupportIE() {
    return window.navigator.msPointerEnabled;
  }

  function isRetina() {
    return window.devicePixelRatio > 1;
  }

  $.fn.owlCarousel = function (options) {
    return this.each(function () {
      if (!$(this).data('owlCarousel')) {
        $(this).data('owlCarousel', new Owl(this, options));
      }
    });
  };
})(window.Zepto || window.jQuery, window, document); //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
//The bind() method creates a new function that, when called, has its this keyword set to the provided value, with a given sequence of arguments preceding any provided when the new function is called.


if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function () {},
        fBound = function () {
      return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
    };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
    return fBound;
  };
}
/*! WOW - v1.1.3 - 2016-05-06
* Copyright (c) 2016 Matthieu Aussaguel;*/
(function () {
  var a,
      b,
      c,
      d,
      e,
      f = function (a, b) {
    return function () {
      return a.apply(b, arguments);
    };
  },
      g = [].indexOf || function (a) {
    for (var b = 0, c = this.length; c > b; b++) if (b in this && this[b] === a) return b;

    return -1;
  };

  b = function () {
    function a() {}

    return a.prototype.extend = function (a, b) {
      var c, d;

      for (c in b) d = b[c], null == a[c] && (a[c] = d);

      return a;
    }, a.prototype.isMobile = function (a) {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(a);
    }, a.prototype.createEvent = function (a, b, c, d) {
      var e;
      return null == b && (b = !1), null == c && (c = !1), null == d && (d = null), null != document.createEvent ? (e = document.createEvent("CustomEvent"), e.initCustomEvent(a, b, c, d)) : null != document.createEventObject ? (e = document.createEventObject(), e.eventType = a) : e.eventName = a, e;
    }, a.prototype.emitEvent = function (a, b) {
      return null != a.dispatchEvent ? a.dispatchEvent(b) : b in (null != a) ? a[b]() : "on" + b in (null != a) ? a["on" + b]() : void 0;
    }, a.prototype.addEvent = function (a, b, c) {
      return null != a.addEventListener ? a.addEventListener(b, c, !1) : null != a.attachEvent ? a.attachEvent("on" + b, c) : a[b] = c;
    }, a.prototype.removeEvent = function (a, b, c) {
      return null != a.removeEventListener ? a.removeEventListener(b, c, !1) : null != a.detachEvent ? a.detachEvent("on" + b, c) : delete a[b];
    }, a.prototype.innerHeight = function () {
      return "innerHeight" in window ? window.innerHeight : document.documentElement.clientHeight;
    }, a;
  }(), c = this.WeakMap || this.MozWeakMap || (c = function () {
    function a() {
      this.keys = [], this.values = [];
    }

    return a.prototype.get = function (a) {
      var b, c, d, e, f;

      for (f = this.keys, b = d = 0, e = f.length; e > d; b = ++d) if (c = f[b], c === a) return this.values[b];
    }, a.prototype.set = function (a, b) {
      var c, d, e, f, g;

      for (g = this.keys, c = e = 0, f = g.length; f > e; c = ++e) if (d = g[c], d === a) return void (this.values[c] = b);

      return this.keys.push(a), this.values.push(b);
    }, a;
  }()), a = this.MutationObserver || this.WebkitMutationObserver || this.MozMutationObserver || (a = function () {
    function a() {
      "undefined" != typeof console && null !== console && console.warn("MutationObserver is not supported by your browser."), "undefined" != typeof console && null !== console && console.warn("WOW.js cannot detect dom mutations, please call .sync() after loading new content.");
    }

    return a.notSupported = !0, a.prototype.observe = function () {}, a;
  }()), d = this.getComputedStyle || function (a, b) {
    return this.getPropertyValue = function (b) {
      var c;
      return "float" === b && (b = "styleFloat"), e.test(b) && b.replace(e, function (a, b) {
        return b.toUpperCase();
      }), (null != (c = a.currentStyle) ? c[b] : void 0) || null;
    }, this;
  }, e = /(\-([a-z]){1})/g, this.WOW = function () {
    function e(a) {
      null == a && (a = {}), this.scrollCallback = f(this.scrollCallback, this), this.scrollHandler = f(this.scrollHandler, this), this.resetAnimation = f(this.resetAnimation, this), this.start = f(this.start, this), this.scrolled = !0, this.config = this.util().extend(a, this.defaults), null != a.scrollContainer && (this.config.scrollContainer = document.querySelector(a.scrollContainer)), this.animationNameCache = new c(), this.wowEvent = this.util().createEvent(this.config.boxClass);
    }

    return e.prototype.defaults = {
      boxClass: "wow",
      animateClass: "animated",
      offset: 0,
      mobile: !0,
      live: !0,
      callback: null,
      scrollContainer: null
    }, e.prototype.init = function () {
      var a;
      return this.element = window.document.documentElement, "interactive" === (a = document.readyState) || "complete" === a ? this.start() : this.util().addEvent(document, "DOMContentLoaded", this.start), this.finished = [];
    }, e.prototype.start = function () {
      var b, c, d, e;
      if (this.stopped = !1, this.boxes = function () {
        var a, c, d, e;

        for (d = this.element.querySelectorAll("." + this.config.boxClass), e = [], a = 0, c = d.length; c > a; a++) b = d[a], e.push(b);

        return e;
      }.call(this), this.all = function () {
        var a, c, d, e;

        for (d = this.boxes, e = [], a = 0, c = d.length; c > a; a++) b = d[a], e.push(b);

        return e;
      }.call(this), this.boxes.length) if (this.disabled()) this.resetStyle();else for (e = this.boxes, c = 0, d = e.length; d > c; c++) b = e[c], this.applyStyle(b, !0);
      return this.disabled() || (this.util().addEvent(this.config.scrollContainer || window, "scroll", this.scrollHandler), this.util().addEvent(window, "resize", this.scrollHandler), this.interval = setInterval(this.scrollCallback, 50)), this.config.live ? new a(function (a) {
        return function (b) {
          var c, d, e, f, g;

          for (g = [], c = 0, d = b.length; d > c; c++) f = b[c], g.push(function () {
            var a, b, c, d;

            for (c = f.addedNodes || [], d = [], a = 0, b = c.length; b > a; a++) e = c[a], d.push(this.doSync(e));

            return d;
          }.call(a));

          return g;
        };
      }(this)).observe(document.body, {
        childList: !0,
        subtree: !0
      }) : void 0;
    }, e.prototype.stop = function () {
      return this.stopped = !0, this.util().removeEvent(this.config.scrollContainer || window, "scroll", this.scrollHandler), this.util().removeEvent(window, "resize", this.scrollHandler), null != this.interval ? clearInterval(this.interval) : void 0;
    }, e.prototype.sync = function (b) {
      return a.notSupported ? this.doSync(this.element) : void 0;
    }, e.prototype.doSync = function (a) {
      var b, c, d, e, f;

      if (null == a && (a = this.element), 1 === a.nodeType) {
        for (a = a.parentNode || a, e = a.querySelectorAll("." + this.config.boxClass), f = [], c = 0, d = e.length; d > c; c++) b = e[c], g.call(this.all, b) < 0 ? (this.boxes.push(b), this.all.push(b), this.stopped || this.disabled() ? this.resetStyle() : this.applyStyle(b, !0), f.push(this.scrolled = !0)) : f.push(void 0);

        return f;
      }
    }, e.prototype.show = function (a) {
      return this.applyStyle(a), a.className = a.className + " " + this.config.animateClass, null != this.config.callback && this.config.callback(a), this.util().emitEvent(a, this.wowEvent), this.util().addEvent(a, "animationend", this.resetAnimation), this.util().addEvent(a, "oanimationend", this.resetAnimation), this.util().addEvent(a, "webkitAnimationEnd", this.resetAnimation), this.util().addEvent(a, "MSAnimationEnd", this.resetAnimation), a;
    }, e.prototype.applyStyle = function (a, b) {
      var c, d, e;
      return d = a.getAttribute("data-wow-duration"), c = a.getAttribute("data-wow-delay"), e = a.getAttribute("data-wow-iteration"), this.animate(function (f) {
        return function () {
          return f.customStyle(a, b, d, c, e);
        };
      }(this));
    }, e.prototype.animate = function () {
      return "requestAnimationFrame" in window ? function (a) {
        return window.requestAnimationFrame(a);
      } : function (a) {
        return a();
      };
    }(), e.prototype.resetStyle = function () {
      var a, b, c, d, e;

      for (d = this.boxes, e = [], b = 0, c = d.length; c > b; b++) a = d[b], e.push(a.style.visibility = "visible");

      return e;
    }, e.prototype.resetAnimation = function (a) {
      var b;
      return a.type.toLowerCase().indexOf("animationend") >= 0 ? (b = a.target || a.srcElement, b.className = b.className.replace(this.config.animateClass, "").trim()) : void 0;
    }, e.prototype.customStyle = function (a, b, c, d, e) {
      return b && this.cacheAnimationName(a), a.style.visibility = b ? "hidden" : "visible", c && this.vendorSet(a.style, {
        animationDuration: c
      }), d && this.vendorSet(a.style, {
        animationDelay: d
      }), e && this.vendorSet(a.style, {
        animationIterationCount: e
      }), this.vendorSet(a.style, {
        animationName: b ? "none" : this.cachedAnimationName(a)
      }), a;
    }, e.prototype.vendors = ["moz", "webkit"], e.prototype.vendorSet = function (a, b) {
      var c, d, e, f;
      d = [];

      for (c in b) e = b[c], a["" + c] = e, d.push(function () {
        var b, d, g, h;

        for (g = this.vendors, h = [], b = 0, d = g.length; d > b; b++) f = g[b], h.push(a["" + f + c.charAt(0).toUpperCase() + c.substr(1)] = e);

        return h;
      }.call(this));

      return d;
    }, e.prototype.vendorCSS = function (a, b) {
      var c, e, f, g, h, i;

      for (h = d(a), g = h.getPropertyCSSValue(b), f = this.vendors, c = 0, e = f.length; e > c; c++) i = f[c], g = g || h.getPropertyCSSValue("-" + i + "-" + b);

      return g;
    }, e.prototype.animationName = function (a) {
      var b;

      try {
        b = this.vendorCSS(a, "animation-name").cssText;
      } catch (c) {
        b = d(a).getPropertyValue("animation-name");
      }

      return "none" === b ? "" : b;
    }, e.prototype.cacheAnimationName = function (a) {
      return this.animationNameCache.set(a, this.animationName(a));
    }, e.prototype.cachedAnimationName = function (a) {
      return this.animationNameCache.get(a);
    }, e.prototype.scrollHandler = function () {
      return this.scrolled = !0;
    }, e.prototype.scrollCallback = function () {
      var a;
      return !this.scrolled || (this.scrolled = !1, this.boxes = function () {
        var b, c, d, e;

        for (d = this.boxes, e = [], b = 0, c = d.length; c > b; b++) a = d[b], a && (this.isVisible(a) ? this.show(a) : e.push(a));

        return e;
      }.call(this), this.boxes.length || this.config.live) ? void 0 : this.stop();
    }, e.prototype.offsetTop = function (a) {
      for (var b; void 0 === a.offsetTop;) a = a.parentNode;

      for (b = a.offsetTop; a = a.offsetParent;) b += a.offsetTop;

      return b;
    }, e.prototype.isVisible = function (a) {
      var b, c, d, e, f;
      return c = a.getAttribute("data-wow-offset") || this.config.offset, f = this.config.scrollContainer && this.config.scrollContainer.scrollTop || window.pageYOffset, e = f + Math.min(this.element.clientHeight, this.util().innerHeight()) - c, d = this.offsetTop(a), b = d + a.clientHeight, e >= d && b >= f;
    }, e.prototype.util = function () {
      return null != this._util ? this._util : this._util = new b();
    }, e.prototype.disabled = function () {
      return !this.config.mobile && this.util().isMobile(navigator.userAgent);
    }, e;
  }();
}).call(this);
(function ($) {
  "use strict"; // PRELOADER

  $(window).on('load', function () {
    var preloader = $('.preloader');
    preloader.fadeOut(1000);
  }); // MAPS

  var mapWrapper = $('#maps-wrapper');
  var dataLatitude = mapWrapper.data('latitude');
  var dataLongitude = mapWrapper.data('longitude');
  var dataMarker = mapWrapper.data('marker');
  var cities = L.layerGroup();
  L.marker([-8.7000773, 115.1899732]).bindPopup('This is Littvaron, CO.').addTo(cities);
  var mapBoxAttr = '';
  var mapBoxURL = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
  var grayscale = L.tileLayer(mapBoxURL, {
    id: 'mapbox.light',
    attribution: mapBoxAttr
  });
  var maps = L.map('maps-wrapper', {
    center: [dataLatitude, dataLongitude],
    zoom: 13,
    layers: [grayscale, cities]
  });
})(jQuery);