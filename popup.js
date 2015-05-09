// Shorthands
var $elem = document.all;
var $input = $elem.search;

var $ez = (function (_normalizeMap) {

  return {
    normalize: function (str) {
      var normalized_str = '';

      for (var i = 0; i < str.length; i++) {
        normalized_str += (_normalizeMap[str[i]] || '-');
      }
      return normalized_str;
    },

    toTabIdArray: function (tab) {
      return tab.id;
    }
  };
});


// State shared globals
var $state = (function () {
  var _isSelecting = false;
  var _currentWindowId = 0;
  var _opts = {
    // TODO: load and store opts
    // Hide private navigation tabs form the results
    hideIncognito: true
  };

  return {
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
          $input.classList.add('disabled');
        } else {
          $input.classList.remove('disabled');
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

  Elem.prototype.update = function () {
    if ($search.isEmpty()) {
      this.setCssFull();
    }
  };

  Elem.prototype.setCssPartial = function () {
    this.css.remove('match-full');
    this.css.add('match-partial');
  };

  Elem.prototype.setCssFull = function () {
    this.css.remove('match-partial');
    this.css.add('match-full');
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
    if ($search.isMatched()) {
      this.h3.innerHTML = tab.title.HTML;
      this.span.innerHTML = '<i>'+ tab.hostname.HTML +'</i>'+ tab.pathname.HTML;
    } else {
      this.h3.innerHTML = tab.title.str;
      this.span.innerHTML = '<i>'+ tab.hostname.str +'</i>'+ tab.pathname.str;
    }

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
      favIcon.appendChild(img);
    } else {
      favIcon.classList.add('not-found');
    }
    this.buttonHTML.appendChild(favIcon);
    return this;
  };

  Tab.prototype.updateCurrent = function () {
    if (this.windowId === $state.getWindowId()) {
      this.css.add('current');
    }
    return this;
  };

  Tab.prototype[77] = function (e) {  // key M
    this.move(windowId);
  };

  Tab.prototype[87] = function (e) {  // Key W
    if ($state.isSelecting()) {
      closeSelectedTabs();
    }
  };

  return Tab;
})();

var $search = (function () {
  var _prevInputValue = '';

  return {
    isMatched: function () {
      return !!_prevInputValue;
    }
  };
})();

// require $state, $input
var $list = (function () {
  var _value = [],
      _list = $elem.list,
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
  };

  List.prototype.selectMatched = function () {
    if (!$input.value) { return; }
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
      $input.classList.remove('invalid');
      return showTabs(initialTabsSort);
    }

    var i = -1, len = _value.length,
        pattern = $ez.normalize(_prevInputValue.toLowerCase()).replace(/-/g, ''),
        noMatch = true;

    while (++i < len) {
      var elem = _value[i];
      elem.match();
      if (!elem.partial) {
        noMatch = false;
      }
    }
    if (noMatch) {
      // set class no match on input
      $input.classList.add('invalid');
    } else {
      showTabs(scoreTabsSort);
      $input.classList.remove('invalid');
    }
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


// info on currentTab
var $state.getWindowId() = null;

// Activate focus on popup opening
$input.focus();

function getTabIndex(id) {
  for (var i = 0; i < _list.length; i++) {
    if (_list[i].id === id) {
      return i;
    }
  }
  return 0;
}

function getTab(id) {
  return _list[getTabIndex(id)];
}

function setInfo(bgInfo) {
  $ez = $ez(bgInfo.map);
  $state.getWindowId() = bgInfo.currentTab.windowId;
  _list = bgInfo.tabs;
  _list.forEach(createButtonHTML);
  showTabs(initialTabsSort);
}

// Generate tabs
function showTabs(sortCallback) {
  cleanTabList();
  _list.sort(sortCallback);
  appendAllTabs(_list, sortCallback);
}

// filters, sort and map callbacks
function onlySelectedTabsFilter(tab) {
  return tab.selected;
}


function filterOutAndRemoveSelected(tab) {
  if (tab.selected) {
    $elem.list.removeChild(tab.buttonHTML);
    return false;
  }
  return true;
}

function filterSelected(tab) {
  return !tab.selected;
}

function initialTabsSort(a, b) {
  if (a.open.time || b.open.time) {
    if (a.open.fresh) {
      if (b.open.fresh) { return a.open.time - b.open.time; }
      return -1;
    } else if (b.open.fresh) { return 1; }
    return b.open.time - a.open.time;
  }
  if (a.windowId !== b.windowId) {
    if (a.windowId === $state.getWindowId()) { return -1; }
    if (b.windowId === $state.getWindowId()) { return  1; }
    return b.windowId - a.windowId;
  }
  return a.id - b.id;
}

function scoreTabsSort(a, b) {
  if (b.partial && !a.partial) { return -1; }
  if (a.partial && !b.partial) { return  1; }
  if (b.score !== a.score) { return b.score - a.score; }
  return initialTabsSort(a, b);
}

// Dom Stuff
function isMatched() {
  return !!_prevInputValue;
}

function handleFavIconLoadfailure(event) {
  var t = event.target;
  // Unset the favIcon url for this elem to avoid trying to refetch the favIcon
  _list[getTabIndex(t.offsetParent.parentNode.dataset.id)].favIconUrl = '';
  t.offsetParent.className += ' not-found';
  t.remove();
}

function createButtonHTML(tab) {
  var button = document.createElement('button');
  button.dataset.id = tab.id;
  button.appendChild(document.createElement('h3'));
  button.appendChild(document.createElement('span'));
  tab.buttonHTML = button;
}

// here I separate domain from url param to fine controle the score later

function appendAllTabs() {
  chrome.runtime.sendMessage({ type: 'loadFavIcons' }, function (newFavIcons) {
    Tab.prototype.setFavIcon(newFavIcons);
    $list.forEachSelected('generateFavIcon');
  });
}

function cleanTabList() {
  var l = $elem.list;
  while (l.hasChildNodes()) {
    l.removeChild(l.lastChild);
  }
}
// Chrome Tabs Actions
function openActiveTab() {
  var activeTab = _list[_active];
  chrome.tabs.update(activeTab.id, { 'active': true });
  if (activeTab.windowId !== $state.getWindowId()) {
    chrome.windows.update(activeTab.windowId, { 'focused': true });
  }
  window.close();
}

// Handle Select Actions
function getAllSelectedTabs() {
  return _list.filter(onlySelectedTabsFilter);
}

function closeSelectedTabs() {
  chrome.tabs.remove(getAllSelectedTabs().map($ez.toTabIdArray), function () {
    _list = _list.filter(filterOutAndRemoveSelected);
    refreshInputMatching();
  });
}

function closeTab(id) {
  chrome.tabs.remove(id, function () {
    _list = _list.filter(function (tab) {
      if (tab.id !== id) { return true; }
      $elem.list.removeChild(tab.buttonHTML);
      return false;
    });
  });
}

function bringToWindow() {
  var selectedTabs = getAllSelectedTabs();
  chrome.tabs.move(selectedTabs.map($ez.toTabIdArray), {
    index: -1,
    windowId: $state.getWindowId()
  }, function () {
    selectedTabs.forEach(function (tab) {
      unselectTab(tab);
      tab.windowId = $state.getWindowId();
      tab.css.add('current');
    });
    setSelectingState(false);
    refreshInputMatching();
    $input.select();
  });
}


// Handle inputs require $list, $state
var $handler = (function () {

  // Subscribe to DOM events
  $input.onkeydown = function (e) {
    var fn = $list[e.keyCode];
    if (typeof fn === 'function') {
      fn(e);
    }
    if ($state.isSelecting()) {
      e.preventDefault();
      var eventKey = e.keyCode
      if (e.metaKey) {
        eventKey += '-meta';
      } else if (e.altKey) {
        eventKey += '-alt';
      } else if (e.shiftKey) {
        eventKey += '-shift';
      } else if (e.ctrlKey) {
        eventKey += '-ctrl';
      }
      $list.actionOnSelected(eventKey);
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
      closeTab(parseInt(elem.dataset.id));
      e.preventDefault();
    } else if (e.which === 1) {
      setActive(getTabIndex(elem.dataset.id));
      openActiveTab(); 
    }
  };
});


// Update routine
function update() {
  if (_prevInputValue !== $input.value) {
    _prevInputValue = $input.value;
    refreshInputMatching(_prevInputValue);
  }
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
  setInterval(update, 35);

  // Init handlers
  $handler();
}


init();
