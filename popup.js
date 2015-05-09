// Shorthands
var $ez = (function () {
  function normalize(_normalizeMap) {
    normalize = function (str) {
      var normalized_str = '';

      for (var i = 0; i < str.length; i++) {
        normalized_str += (_normalizeMap[str[i]] || '-');
      }
      return normalized_str;
    };
  }

  return {
    normalize: normalize,
    emptyFallback: function () {},
    toTabIdArray: function (tab) { return tab.id; },
    getEventKey: function (event) {
      var eventKey = event.keyCode;
      if (event.metaKey) {
        eventKey += '-meta';
      } else if (event.altKey) {
        eventKey += '-alt';
      } else if (event.shiftKey) {
        eventKey += '-shift';
      } else if (event.ctrlKey) {
        eventKey += '-ctrl';
      }
      return eventKey;
    }
  };
});


// State shared globals
var $state = (function () {
  var _isSelecting = false,
      _currentWindowId = 0,
      _opts = {
        // TODO: load and store opts
        // Hide private navigation tabs form the results
        hideIncognito: true,
        key: {
          move: 77,
          close: 87
        }
      };

  return {
    matchType: 'fuzzy',
    isSelecting: function () {
      return _isSelecting;
    },
    getWindowId: function () {
      return _currentWindowId;
    },
    setWindowId: function (windowId) {
      _currentWindowId = windowId;
    },
    setSelectingState: function (selectState) {
      if (selectState !== _isSelecting) {
        if (selectState) {
          $search.input.classList.add('disabled');
        } else {
          $search.input.classList.remove('disabled');
        }
        _isSelecting = selectState;
      }
    }
  };
})();

var Elem = (function (){
  var Elem = (function () {
    var elemId = 0;
    return function (type, children) {
      var i = -1,
          len = children.length,
          button = document.createElement('button');

      button.id = 'elem-'+ elemId;
      button.dataset = {
        type: type,
        id: elemId
      };

      while (++i < length) {
        button.appendChild(children[i]);
      }

      this.buttonHTML = button;
      this.css = button.classList;
      this.elemId = elemId++;
    };
  })();

  Elem.prototype.activate = (function () {
    var _previousActive = null;
    return function () {
      if (this.elemId === _previousActive.elemId) { return; }

      this.css.add('active');
      if (_previousActive) {
        _previousActive.css.remove('active');
      }
      _previousActive = this;
      return this;
    }
  })();

  Elem.prototype.match = function () { }; // 

  Elem.prototype.compare = function (elem) {
    return this.elemId - elem.elemId;
  };

  Elem.prototype.byScore = function (elem) {
    if (elem.partial && !this.partial) { return -1; }
    if (this.partial && !elem.partial) { return  1; }
    if (elem.score !== this.score) { return elem.score - this.score; }
    return this.compare(elem);
  }

  Elem.prototype.update = function () {
    if ($search.isEmpty()) {
      this.setCssFull();
    }
  };

  Elem.prototype.setPartialMatch = function () {
    this.css.remove('match-full');
    this.css.add('match-partial');
    this.partial = true;
  };

  Elem.prototype.setFullMatch = function () {
    this.css.remove('match-partial');
    this.css.add('match-full');
    this.partial = false;
  };

  Elem.prototype.select = function () {
    this.selected = true;
    this.css.add('selected');
    return this;
  };

  Elem.prototype.unselect = function () {
    this.selected = false;
    this.css.remove('selected');
    return this;
  };

  return Elem;
})();

var Tab = (function () {
  var _favIcons = {},
      _wantedKeys = [
      'windowId',
      'open',
      'url',
      'title',
      'favIconUrl',
      'id'
    ];

  function handleFavIconLoadfailure(event) {
    this.css.add('not-found');
    this.favIconUrl = '';
    event.target.remove();
  }

  var Tab = function (tab) {
    // init default values
    this.selected = false;

    // copy values of given tab
    _wantedKeys.forEach(function (key) {
      this[key] = tab[key];
    });

    this.h3 = document.createElement('h3');
    this.span = document.createElement('span');
    Elem.call(this, 'tab', [this.h3, this.span]);
    this.update();
  }

  Tab.prototype = Object.create(Elem.prototype);

  Tab.prototype.update = function () {
    if ($search.isEmpty()) {
      this.h3.innerHTML = this.title.str;
      this.span.innerHTML = '<i>'+ this.hostname.str
                          +'</i>'+ this.pathname.str;
    } else {
      this.h3.innerHTML = this.title.HTML;
      this.span.innerHTML = '<i>'+ this.hostname.HTML
                          +'</i>'+ this.pathname.HTML;
    }
  };

  Tab.prototype.match = function (pattern) {
    var match = $match[$state.matchType],
        ret = match(this.hostname, pattern)
            + match(this.pathname, pattern)
            + match(this.title, pattern);

    this[(ret) ? 'setFullMatch' : 'setPartialMatch']();
    this.score = this.hostname.score * 2
               + this.pathname.score
               + this.title.score;
  };

  Tab.prototype.setFavIcon = function (newFavIcons) {
    _favIcons = newFavIcons;
  };

  Tab.prototype.generateFavIcon = function () {
    if (this.favIcon) { return; }
    this.favIcon = true;

    var iconData, img,
        favIcon = document.createElement('div');

    favIcon.className = 'fav-icon';

    iconData = (typeof this.favIconUrl === 'number')
             ? this.url
             : _favIcons[this.favIconUrl].data;

    if (typeof iconData === 'string') {
      img = document.createElement('img');

      img.src = iconData;
      img.onError = handleFavIconLoadfailure.bind(this);
      favIcon.appendChild(img);
    } else {
      favIcon.classList.add('not-found');
    }
    this.favIconDiv = favIcon;
    this.buttonHTML.appendChild(favIcon);
    return this;
  };

  Tab.prototype.updateCurrent = function () {
    if (this.windowId === $state.getWindowId()) {
      this.css.add('current');
    }
    return this;
  };

  Tab.prototype.compare = function (tab) {
    if (this.open.time || b.open.time) {
      if (this.open.fresh) {
        if (b.open.fresh) { return this.open.time - b.open.time; }
        return -1;
      } else if (b.open.fresh) { return 1; }
      return b.open.time - this.open.time;
    }
    if (this.windowId !== b.windowId) {
      if (this.windowId === $state.getWindowId()) { return -1; }
      if (b.windowId === $state.getWindowId()) { return 1; }
      return b.windowId - this.windowId;
    }
    return Elem.prototype.compare.call(this, tab);
  };

  // Chrome API methods
  Tab.prototype.open = function () {
    chrome.tabs.update(this.id, { 'active': true });
    if (this.windowId !== $state.getWindowId()) {
      chrome.windows.update(this.windowId, { 'focused': true });
    }
    // TODO: May want to call window.close(); after this method...
    return this;
  };

  Tab.prototype.move = function (windowId) {
    chrome.tabs.move(this.id, {
      index: -1,
      windowId: windowId
    }, function () {
      selectedTabs.forEach(function (tab) {
        unselectTab(tab);
        tab.windowId = $state.getWindowId();
        tab.css.add('current');
      });
      setSelectingState(false);
      refreshInputMatching();
      $search.input.select();
    });
    return this;
  };

  /*
   * call back exemple:
   * remove from _value
   * _list.removeChild(tab.buttonHTML);
   */
  Tab.prototype.close = function (callback) {
    chrome.tabs.remove(this.id, (callback || $ez.emptyFallback));
    this.buttonHTML.remove();
  };

  // KeyCode handlers
  Tab.prototype[$state.opts.key.move] = function () {  // key M
    this.move(windowId);
  };

  Tab.prototype[$state.opts.key.close] = function () {  // Key W
    this.close();
  };

  return Tab;
})();

var $search = (function () {
  var _prevInputValue = '',
      _input = document.getElementById("search");

  return {
    isEmpty: function () {
      return !_prevInputValue;
    },
    input: _input,
    update: function () {
      if (_prevInputValue !== $search.input.value) {
        _prevInputValue = $search.input.value;
        refreshInputMatching(_prevInputValue);
      }
    }
  };
})();

// require $state, $search.input
var $list = (function () {
  var _value = [],
      _list = document.getElementById("list"),
      _active = -1;

  // Scroll to element if necessary
  function scrollTo(elem) {
    var min = _list.scrollTop
    var max = _list.clientHeight + min;
    var offset = elem.offsetTop;
    var height = elem.offsetHeight;

    if ((offset + height - 4) > max) {
      _list.scrollTop += (offset + height - 4) - max;
    } else if (min && (offset - (height * 2) < min)) {
      _list.scrollTop += offset - (height * 2) - min;
    }
  }

  function setActive(idx) {
    _active = Math.min(Math.max(0, idx), _value.length - 1);
    scrollTo(_value[_active].activate());
  }

  function getIndex(value) {
    var i = -1, len = _value.length;
    while (++i < len) {
      if (_value[i] === value) {
        return _value[i];
      }
    }
    return null;
  }

  function getIndexWithKey(key, value) {
    var i = -1, len = _value.length;
    while (++i < len) {
      if (_value[i][key] === value) {
        return _value[i][key];
      }
    }
    return null;
  }

  function forEach(key) {
    var i = -1, len = _value.length, fn;
    while (++i < len) {
      fn = _value[i][key];
      if (typeof fn === 'function') {
        fn();
      }
    }
  }

  function forEachTest(key, test, value) {
    var i = -1, len = _value.length, val, fn;
    while (++i < len) {
      val = _value[i];
      if (val[test] === value) {
        fn = val[key];
        if (typeof fn === 'function') {
          fn();
        }
      }
    }
  }

  var List = function (tabArray) {
    var i = -1, len = tabArray.length;
    while (++i < len) {
      _list.appendChild(new Tab(tabArray[i]));
    }
    setActive(0);
    chrome.runtime.sendMessage({ type: 'loadFavIcons' }, function (newFavIcons) {
      Tab.prototype.setFavIcon(newFavIcons);
      this.forEachSelected('generateFavIcon');
    }.bind(this));
  };

  List.prototype.selectMatched = function () {
    if (!$search.input.value) { return; }
    forEachTest('select', 'partial', false);
  };

  List.prototype.toggleActiveSelection = function () {
    var activeElem = _value[_active];
    if (!activeElem) { return; }
    if (activeElem.selected) {
      activeElem.unselect();
    } else {
      activeElem.select();
    }
    setSelectingState(!!(getAllSelectedTabs().length));
  };

  List.prototype.refresh = function (key) {
    if ($search.isEmpty()) {
      $search.input.classList.remove('invalid');
      return showTabs(initialTabsSort);
    }

    var i = -1, len = _value.length,
        pattern = $ez.normalize(_prevInputValue.toLowerCase()).replace(/-/g, ''),
        noMatch = true;

    while (++i < len) {
      var elem = _value[i];
      elem.match(pattern);
      if (!elem.partial) {
        noMatch = false;
      }
    }
    if (noMatch) {
      // set class no match on input
      $search.input.classList.add('invalid');
    } else {
      showTabs(scoreTabsSort);
      $search.input.classList.remove('invalid');
    }
  };

  List.prototype.clear = function () {
    while (_list.hasChildNodes()) {
      _list.removeChild(_list.lastChild);
    }
  };

  List.prototype.activate = function (elemId) {
    forEachTest('activate', 'elemId', elemId);
  };

  List.prototype.open = function (elemId) {
    forEachTest('open', 'elemId', elemId);
  };

  List.prototype.remove = function (elemId) {
    forEachTest('close', 'elemId', elemId);
  };

  List.prototype.forEachSelected = function (key) {
    forEachTest(key, 'selected', true);
  };

  List.prototype.indexOf = function (key, value, fallback) {
    var ret = value ? getIndexWithKey(key, value) : getIndex(key);
    if (value) {
      ret = getIndexWithKey(key, value);
      if (ret) { return ret; }
      if (fallback === 'last') {
        return _value[_value.length - 1][key];
      } else if (fallback === 'first') {
        return _value[0][key];
      }
    } else {
      ret = getIndex(key);
      if (ret) { return ret; }
      if (fallback === 'last') {
        return _value[_value.length - 1];
      } else if (fallback === 'first') {
        return _value[0];
      }
    }
    return ret;
  };

  List.prototype[9] = function (e) {  // Key Tab
    if (_active === -1) { return; }
    e.preventDefault();
    $list.toggleActiveSelection();
  };

  List.prototype[13] = openActiveTab,  // Key Enter
  List.prototype[27] = function (e) {  // Key esc
    if ($state.isSelecting()) {  
      _value.forEach(function (tab) {
        tab.unselect();
      });
      setSelectingState(false);
    }
  };

  List.prototype[38] = function (e) {  // key Up
    setActive(_active - 1);
    e.preventDefault();
  };

  List.prototype[40] = function (e) {  // key Down
    setActive(_active + 1);
    e.preventDefault();
  };

  List.prototype[65] = function (e) {  // Key A
    $list.selectMatched();
    e.preventDefault();
  };

  return List;
})();

// Handle inputs require $list, $state
var $handler = (function () {

  // Subscribe to DOM events
  $search.input.onkeydown = function (event) {
    var fn = $list[event.keyCode];
    if (typeof fn === 'function') {
      fn(event);
    }
    if ($state.isSelecting()) {
      $list.actionOnSelected($ez.getEventKey(event));
      event.preventDefault();
    }
  };

  function checkClickedElement(elem) {
    if (elem.tagName !== "BUTTON") {
      elem = elem.offsetParent;
      if (elem.tagName !== "BUTTON") { return false; }
    }
    return elem;
  }

  document.body.onmousedown = function (e) {
    if (checkClickedElement(e.target) && e.which === 2) {
      return false;
    }
  };

  document.body.onmouseup = function (e) {
    var elem = checkClickedElement(e.target);
    if (!elem) { return; }
    if (e.which === 2) {
      $list.remove(elem.dataset.id);
      e.preventDefault();
    } else if (e.which === 1) {
      $list.open(elem.dataset.id);
    }
  };
});

function setInfo(bgInfo) {
  $ez.setMap(bgInfo.map);
  $state.setWindowId(bgInfo.currentTab.windowId);
  _list = bgInfo.tabs;
  _list.forEach(createButtonHTML);
  showTabs(initialTabsSort);
}

// Start it all !
function init() {
  chrome.runtime.onMessage.addListener(function (req, sender) {
    if (req.type === "data") {
      setInfo(req.data);
    }
  });
  chrome.runtime.sendMessage({type: 'loadPopup'});

  // Start the update
  setInterval($search.update, 35);

  // Init handlers
  $handler();

  $search.input.focus();
}


init();
