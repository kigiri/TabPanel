// Cached Globals and Aliases
var _tabs = [];
var _elem = document.all;
var _asyncLoadState = 0;
var _active = -1;
var _prevTabId = -1;
var _actions = [];
var _prevInputValue = '';
var _isSelecting = false;
var _input = _elem.search;
var _normalizeMap = [];
var _favIcons;

function normalize(str) {
  var normalized_str = '';
  var c;

  for (var i = 0; i < str.length; i++) {
    c = str[i];
    if (/[0-9A-Za-z]/i.test(c)) {
      normalized_str += c;
    } else {
      normalized_str += (_normalizeMap[str[i]] || '-');
    }
  }
  return (normalized_str);
}

// info on currentTab
var _currentWindowId = null;
var _opts = {
  // Hide private navigation tabs form the results
  hideIncognito: true
};

// Activate focus on popup opening
_elem.search.focus();

function setInfo(bgInfo) {
  _normalizeMap = bgInfo.map;
  _currentWindowId = bgInfo.currentTab.windowId;
  _tabs = bgInfo.tabs;
  _tabs.forEach(createButtonHTML);
  showTabs(initialTabsSort);
}

// Generate tabs
function showTabs(sortCallback) {
  cleanTabList();
  _tabs.sort(sortCallback);
  appendAllTabs(_tabs, sortCallback);
}

// filters, sort and map callbacks
function onlySelectedTabsFilter(tab) {
  return tab.isUserSelected;
}

function toTabIdArray(tab) {
  return tab.id;
}

function filterAndDestroySelected(tab) {
  if (tab.isUserSelected) {
    _elem.list.removeChild(tab.buttonHTML);
    return false;
  }
  return true;
}

function initialTabsSort(a, b) {
  if (a.lastSeen || b.lastSeen) {
    return b.lastSeen - a.lastSeen;
  }
  if (a.windowId !== b.windowId) {
    if (a.windowId === _currentWindowId) {
      return -1;
    }
    if (b.windowId === _currentWindowId) {
      return 1;
    }
    return b.windowId - a.windowId;
  }
  return a.index - b.index;
}

function scoreTabsSort(a, b) {
  if (b.partial && !a.partial) {
    return -1;
  }
  if (a.partial && !b.partial) {
    return 1;
  }
  if (b.score !== a.score) {
    return b.score - a.score;
  }
  return initialTabsSort(a, b);
}

// Dom Stuff
function isMatched() {
  return !!_prevInputValue;
}

function makeUrl(tab) {
  if (isMatched()) {
    return '<i>' + tab.hostnameHTML + '</i>' + tab.pathnameHTML;
  } else {
    return '<i>' + tab.hostname + '</i>' + tab.pathname;
  }
}

function setDomAttrs(button, idx, title, url, tab) {
  button.id = 'tab-' + idx;
  button.dataset.index = idx;
  delClass(button, 'active');
  if (!_prevInputValue.length) {
    setMatchCss(button, 'full');
  }
  title.innerHTML = isMatched() ? tab.titleHTML : tab.title;
  url.innerHTML = makeUrl(tab);
}

function handleFaviconLoadfailure(event) {
  var t = event.target;
  // Unset the favicon url for this elem to avoid trying to refetch the favicon
  _tabs[t.offsetParent.parentNode.dataset.index].favIconUrl = '';
  t.offsetParent.className += ' not-found';
  t.remove();
}

function createButtonHTML(tab, idx) {
  var button = document.createElement('button');
  button.dataset.id = tab.id;
  button.appendChild(document.createElement('h3'));
  button.appendChild(document.createElement('span'));
  tab.buttonHTML = button;
}

function generateFavicon(tab) {
  if (tab.favicon) { return; }
  tab.favicon = true;
  var favIcon = document.createElement('div');
  favIcon.className = 'fav-icon';
  if (tab.windowId === _currentWindowId) {
    addClass(tab.buttonHTML, 'current');
  }
  var iconData;
  if (typeof tab.favIconUrl === 'number') {
    iconData = tab.url;
  } else {
    iconData = _favIcons[tab.favIconUrl].data;
  }
  if (typeof iconData === 'string') {
    var img = document.createElement('img');
    img.src = iconData;
    favIcon.appendChild(img);
  } else {
    favIcon.className += ' not-found';
  }
  tab.buttonHTML.appendChild(favIcon);
}

// here I separate domain from url param to fine controle the score later

function appendAllTabs() {
  var l = _elem.list;
  for (var i = 0; i < _tabs.length; i++) {
    var tab = _tabs[i];
    var button = tab.buttonHTML;
    var c = button.children;
    setDomAttrs(button, i, c[0], c[1], tab);
    l.appendChild(button);
    // if (!tab.favicon) {
    //   setTimeout(generateFavicon, 20 * i, tab);
    // }
  }
  setActive(0);
  chrome.runtime.sendMessage({ type: 'loadFavIcons' }, function (favIcons) {
    _favIcons = favIcons;
    addFavicons();
  });
}

function addFavicons() {
  var l = _elem.list;
  for (var i = 0; i < _tabs.length; i++) {
    generateFavicon(_tabs[i]);
  }
}


function cleanTabList() {
  var l = _elem.list;
  while (l.hasChildNodes()) {
    l.removeChild(l.lastChild);
  }
}

// Start it all !
function init() {
  var queryOptions = {
    'currentWindow': true,
    'active': true
  };

  // get previous tab from tabHistory
  chrome.runtime.onMessage.addListener(function (req, sender) {
    if (req.type === "data") {
      setInfo(req.data);
    }
  });
  chrome.runtime.sendMessage({type: 'loadPopup'});

  // Start the update
  setInterval(update, 35);
}

// Fuzzy Search
// ToDo :
// tolerate repeating letters (ex: tollerate)
// tolerate inverted letters (ex: toelrate)
// tolerate typos (ex: tolerarte)

// TODO: try with objects instead of array for matchedIdx collection

function makeObject(score, matched, partial) {
  return {
    'score': score,
    'matched': matched,
    'partial': partial
  };
}

function fuzzyMatch(str, pattern, s, p, score, bonus, matched, deepness) {
  // End of the pattern, successfull match
  if (p >= pattern.length) {
    return makeObject(score, matched, false);
  }

  // End of the string, failed to match all the pattern, apply penalty to score
  if (s >= str.length) {
    return makeObject(score, matched, true);
  }

  var c = str[s];
  var lowerC = c.toLowerCase();
  if (lowerC === pattern[p]) {
    // Look a head to find best possible match
    var altMatch;
    if (deepness > 0) {
      altMatch = fuzzyMatch(str, pattern, s+1, p, score, 0, matched.slice(), deepness - 1);
    }

    // Store current match and calculate bonus
    matched.push(s);

    // Bonus for capitals
    if (c !== lowerC) {
      score += 2;
    }
    score += 1 + bonus;
    bonus += 5;
    var match = fuzzyMatch(str, pattern, s+1, p+1, score, bonus, matched, deepness);
    // Return the best score
    return (!altMatch || altMatch.score <= match.score) ? match : altMatch;
  } else {
    // TODO: If we don't have any bonus, this could be an inverted type
    // try to match previous char with current and current with previous

    // If nothing matched, recalculate bonus
    bonus = c === '-' ? 3 : 0;
    return fuzzyMatch(str, pattern, s+1, p, score, bonus, matched, deepness);
  }
}

function applyArrayToHTML(arr, baseStr) {
  if (!Array.isArray(arr) || !arr.length) { return baseStr; }
  var strHTML = '';
  var prevIdx = null;
  var openTag = false;
  for (var i = 0; i < baseStr.length; i++) {
    var idx = arr[arr.indexOf(i)];
    if (typeof idx === 'number') {
      if (idx - 1 !== prevIdx) {
        strHTML += '<b>';
        openTag = true;
      }
      prevIdx = idx;
    } else if ((prevIdx !== null) && openTag) {
      strHTML += '</b>';
      openTag = false;
    }
    strHTML += baseStr[i];
  }
  if (openTag) {
    strHTML += '</b>';
  }
  return strHTML;
}

function fuzzyMatchString(tab, key, pattern) {
  var str = tab[key + 'Normalized'];
  if (!str) { return 0; }
  var bestMatch = fuzzyMatch(str, pattern, 0, 0, 0, 8, [], 6);
  tab.score += bestMatch.score;
  tab[key + 'HTML'] = applyArrayToHTML(bestMatch.matched, tab[key]);
  return bestMatch.partial ? 0 : 1;
}

function addClass(elem, cssClass) {
  if (elem.className.indexOf(cssClass) === -1) {
    elem.className = elem.className.replace(/\s*$/, ' ' + cssClass);
  }
}

function delClass(elem, cssClass) {
  elem.className = elem.className.replace(new RegExp(cssClass, 'ig'), '');
}

function setMatchCss(button, type) {
  var newclass = button.className.replace(/match-([^\s-]+)/, 'match-' + type);
  if (!/match-/.test(newclass)) {
    button.className += ' match-' + type;
  } else {
    button.className = newclass;
  }
}

function refreshInputMatching() {
  if (typeof _prevInputValue !== 'string' || !_prevInputValue.length) {
    delClass(_input, 'invalid');
    return showTabs(initialTabsSort);
  }
  var pattern = normalize(_prevInputValue.toLowerCase()).replace(/-/g, '');
  var noMatch = true;
  for (var i = _tabs.length - 1; i >= 0; i--) {
    var tab = _tabs[i];
    var ret = 0;
    tab.score = 0;
    ret += fuzzyMatchString(tab, 'hostname', pattern);
    tab.score *= 2; // match in host should bd worth more
    ret += fuzzyMatchString(tab, 'title', pattern);
    ret += fuzzyMatchString(tab, 'pathname', pattern);
    if (ret) {
      noMatch = false;
      setMatchCss(tab.buttonHTML, 'full');
      tab.partial = false;
    } else {
      tab.partial = true;
      setMatchCss(tab.buttonHTML, 'partial');
    }
  }
  if (noMatch) {
    // set class no match on input
    addClass(_input, 'invalid');
  } else {
    showTabs(scoreTabsSort);
    delClass(_input, 'invalid');
  }
}

// Scroll to element if necessary
function scrollTo(elem) {
  var l = _elem.list;
  var min = l.scrollTop
  var max = l.clientHeight + min;
  var offset = elem.offsetTop;
  var height = elem.offsetHeight;

  if ((offset + height - 4) > max) {
    l.scrollTop += (offset + height - 4) - max;
  } else if (min && (offset - (height * 2) < min)) {
    l.scrollTop += offset - (height * 2) - min;
  }
}

// Choose active element
function setActive(idx) {
  idx = Math.min(Math.max(0, idx), _tabs.length - 1);

  var lastTab = _tabs[_active];
  if (lastTab !== undefined) {
    delClass(lastTab.buttonHTML, 'active');
  }

  var btn = _tabs[idx].buttonHTML;
  addClass(btn, 'active');
  _active = idx;

  scrollTo(btn);
}

// Chrome Tabs Actions
function openActiveTab() {
  var activeTab = _tabs[_active];
  chrome.tabs.update(activeTab.id, { 'active': true });
  if (activeTab.windowId !== _currentWindowId) {
    chrome.windows.update(activeTab.windowId, { 'focused': true });
  }
  window.close();
}

function closeTabs(tabs, cb) {
  chrome.tabs.remove(tabs.map(toTabIdArray), cb);
};

// Handle Select Actions
function getAllSelectedTabs() {
  return _tabs.filter(onlySelectedTabsFilter);
}

function closeSelectedTabs() {
  var selectedTabs = getAllSelectedTabs();

  closeTabs(selectedTabs, function () {
    _tabs = _tabs.filter(filterAndDestroySelected);
    refreshInputMatching();
  });
}

function moveSelectedTabs() {
  // Move tabs to a new or existing window
}

function unselectTab(tab) {
  tab.isUserSelected = false;
  delClass(tab.buttonHTML, 'selected');
}

function setSelectingState(state) {
  if (state !== _isSelecting) {
    // New state, apply change
    if (state) {
      addClass(_input, 'disabled');
    } else {
      delClass(_input, 'disabled');
    }
  }
  _isSelecting = state;
}

function unselectAllTabs() {
  _tabs.forEach(unselectTab);
  setSelectingState(false);
}

function toggleSelectActiveTab() {
  var activeTab = _tabs[_active];
  if (!activeTab) { return; }
  var btn = activeTab.buttonHTML;
  if (activeTab.isUserSelected) {
    activeTab.isUserSelected = false;
    delClass(btn, 'selected');
  } else {
    activeTab.isUserSelected = true;
    addClass(btn, 'selected');
  }
  setSelectingState(!!(getAllSelectedTabs().length));
}

// Update routine
function update() {
  if (_prevInputValue !== _input.value) {
    _prevInputValue = _input.value;
    refreshInputMatching(_prevInputValue);
  }
}

// Handle inputs
_actions[9]  = function (e) { // Key Tab
  if (_active === -1) { return; }
  e.preventDefault();
  toggleSelectActiveTab();
};
_actions[13] = openActiveTab; // Key Enter
_actions[27] = function (e) { // Key esc
  if (_isSelecting) {
    e.preventDefault();
    unselectAllTabs();
  }
};
_actions[87] = function (e) { // Key W
  if (_isSelecting) {
    e.preventDefault();
    closeSelectedTabs();
  }
};
_actions[40] = function (e) {  // key Down
  setActive(_active + 1);
  e.preventDefault();
};
_actions[38] = function (e) {  // key Up
  setActive(_active - 1);
  e.preventDefault();
};

_elem.search.onkeydown = function (e) {
  var fn = _actions[e.keyCode];
  if (typeof fn === 'function') {
    fn(e);
  }
  if (_isSelecting) {
    e.preventDefault();
  }
}

document.body.onclick = function (e) {
  var elem = e.target;
  if (elem.tagName !== "BUTTON") {
    elem = elem.offsetParent;
    if (elem.tagName !== "BUTTON") { return; }
  }
  var idx = elem.dataset.index;
  setActive(idx);
  openActiveTab();
}

init();
