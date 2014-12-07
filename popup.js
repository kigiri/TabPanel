// Cached Globals and Aliases
var _tabs = [];
var _elem = document.all;
var _asyncLoadState = 0;
var _active = -1;
var _prevTabId = -1;
var _actions = [];
var _prevInputValue = '';
var _isSelecting = false;
// info on currentTab
var _currentTab = null;
var _opts = {
  // Hide private navigation tabs form the results
  hideIncognito: true
};

// Activate focus on popup opening
_elem.search.focus();

// First Async loads callbacks
function tryLoadTabs() {
  if (_asyncLoadState === 1) {
    chrome.tabs.query({}, loadTabs);
    _asyncLoadState = 0;
  } else {
    _asyncLoadState++;
  }
}

function setCurrent(tabs) {
  _currentTab = tabs[0];
  tryLoadTabs();
}

function setPrevious(tabId) {
  _prevTabId = tabId;
  tryLoadTabs();
}

function loadTabs(tabs) {
  _tabs = tabs.filter(initialTabsFilter);
  _tabs.forEach(genTab);
  showTabs(initialTabsSort);
}

// Generate tabs
function showTabs(sortCallback) {
  _tabs.sort(sortCallback);
  appendAllTabs(_tabs, sortCallback);
}

// filters, sort and map callbacks
function initialTabsFilter(tab) {
  if ((tab.id === _currentTab.id) || (typeof tab.id === 'undefined')) {
    return false;
  }
  return !(_opts.hideIncognito && tab.incognito);
}

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
  if (a.id === _prevTabId) { return -1; }
  if (b.id === _prevTabId) { return 1; }
  if (a.windowId !== b.windowId) {
    if (a.windowId === _currentTab.windowId) {
      return -1;
    }
    if (b.windowId === _currentTab.windowId) {
      return 1;
    }
    return b.windowId - a.windowId;
  }
  return a.index - b.index;
}

function scoreTabsSort(a, b) {
  return b.score - a.score;
}

// Dom Stuff
function isMatched() {
  return !!_prevInputValue;
}

function makeUrl(tab) {
  if (isMatched()) {
    return '<i>' + tab.hostnameHTML + tab.suffix + '</i>' + tab.pathnameHTML;
  } else {
    return '<i>' + tab.hostname + tab.suffix + '</i>' + tab.pathname;
  }
}

function setDomAttrs(button, idx, title, url, tab) {
  button.id = 'tab-' + idx;
  title.innerHTML = isMatched() ? tab.titleHTML : tab.title;
  url.innerHTML = makeUrl(tab);
}

function createButtonHTML(tab, idx) {
  var title = document.createElement('h3');
  var url = document.createElement('span');

  var favIcon = document.createElement('div');
  favIcon.className = 'fav-icon';
  if (tab.windowId === _currentTab.windowId) {
    favIcon.className += ' current';
  }
  favIcon.style.backgroundImage = "url('" + tab.favIconUrl + "')";

  var button = document.createElement('button');
  button.dataset.id = tab.id;
  button.dataset.index = tab.index;
  button.appendChild(favIcon);
  button.appendChild(title);
  button.appendChild(url);
  return button;
}

// here I separate domain from url param to fine controle the score later
function genTab(tab, idx) {
  var url = new URL(tab.url);
  tab.hostname = url.hostname.replace(/(^www\.|\..[^\.]+$)/g, '');
  tab.suffix = url.hostname.match(/\..[^\.]+$/);
  tab.pathname = (url.pathname + url.hash).replace(/\/$/, '');
  tab.buttonHTML = createButtonHTML(tab, idx);
}

function appendAllTabs() {
  var l = _elem.list;
  for (var i = 0; i < _tabs.length; i++) {
    var button = _tabs[i].buttonHTML;
    var c = button.children;
    setDomAttrs(button, i, c[1], c[2], _tabs[i]);
    l.appendChild(button);
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
  chrome.tabs.query(queryOptions, setCurrent);

  // get previous tab from tabHistory
  chrome.runtime.sendMessage({}, setPrevious);

  // Start the update
  setInterval(update, 100);
}

// Fuzzy Search
// ToDo :
// tolerate repeating letters (ex: tollerate)
// tolerate inverted letters (ex: toelrate)
// tolerate typos (ex: tolerarte)

// TODO: try with objects instead of array for matchedIdx collection
function isSeparator(c) {
  return (" _-()[]{}<>/\\.:;".indexOf(c) >= 0);
}

function makeObject(score, matched, partial) {
  return {
    'score': score,
    'matched': matched,
    'partial': partial
  };
}

function fuzzyMatch(str, pattern, s, p, score, bonus, matched) {
  // End of the pattern, successfull match
  if (p >= pattern.length) {
    return makeObject(score, matched, false);
  }

  // End of the string, failed to match all the pattern, apply penalty to score
  if (s >= str.length) {
    return makeObject(~~(score / 3), matched, true);
  }

  var c = str[s];
  var lowerC = c.toLowerCase();
  if (lowerC === pattern[p]) {
    // Look a head to find best possible match
    var altMatch = fuzzyMatch(str, pattern, s+1, p, score, 0, matched.slice());

    // Store current match and calculate bonus
    matched.push(s);

    // Bonus for capitals
    if (c !== lowerC) {
      score += 2;
    }
    score += 1 + bonus;
    bonus += 5;
    var match = fuzzyMatch(str, pattern, s+1, p+1, score, bonus, matched);

    // Return the best score
    return match.score < altMatch.score ? altMatch : match;
  } else {
    // TODO: If we don't have any bonus, this could be an inverted type
    // try to match previous char with current and current with previous

    // If nothing matched, recalculate bonus
    bonus = isSeparator(c) ? 3 : 0;
    return fuzzyMatch(str, pattern, s+1, p, score, bonus, matched);
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
  var str = tab[key];
  var bestMatch = fuzzyMatch(str, pattern, 0, 0, 0, 5, []);
  tab.score += bestMatch.score;
  tab[key + 'HTML'] = applyArrayToHTML(bestMatch.matched, str);
}

function refreshInputMatching(pattern) {
  cleanTabList();
  if (typeof pattern !== 'string' || !pattern.length) {
    return showTabs(initialTabsSort);
  }
  for (var i = _tabs.length - 1; i >= 0; i--) {
    var tab = _tabs[i];
    tab.score = 0;
    fuzzyMatchString(tab, 'hostname', pattern);
    tab.score *= 2; // match in host should bd worth more
    fuzzyMatchString(tab, 'title', pattern);
    fuzzyMatchString(tab, 'pathname', pattern);
    // tab.score = 0;
    tab.titleHTML = tab.score + ' - ' + tab.titleHTML;
    // console.log(tab);
  }
  showTabs(scoreTabsSort);
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

  if (idx === _active) { return; }
  if (_active !== -1) {
    _tabs[_active].buttonHTML.className = '';
  }

  var btn = _tabs[idx].buttonHTML;
  btn.className = 'active';
  _active = idx;

  scrollTo(btn);
}

// Chrome Tabs Actions
function openActiveTab() {
  var activeTab = _tabs[_active];
  if (activeTab.windowId !== _currentTab.windowId) {
    chrome.windows.update(activeTab.windowId, { 'focused': true });
    window.close();
  }
  chrome.tabs.update(activeTab.id, { 'active': true });
}

function closeTabs(tabs) {
  chrome.tabs.remove(tabs.map(toTabIdArray));
};

// Handle Select Actions
function getAllSelectedTabs() {
  return _tabs.filter(onlySelectedTabsFilter);
}

function closeSelectedTabs() {
  var selectedTabs = getAllSelectedTabs();

  closeTabs(selectedTabs);
  _tabs = _tabs.filter(filterAndDestroySelected);
  if (_prevInputValue.length) {
    refreshInputMatching();
  } else {
    showTabs(initialTabsSort);
  }
}

function moveSelectedTabs() {
  // Move tabs to a new or existing window
}

function unselectTab(tab) {
  tab.isUserSelected = false;
}

function unselectAllTabs() {
  _tabs.forEach(unselectTab);
  _isSelecting = false;
}

function toggleSelectActiveTab() {
  var activeTab = _tabs[_active];
  if (!activeTab) { return; }
  var favIcon = activeTab.buttonHTML.firstChild;
  if (activeTab.isUserSelected) {
    activeTab.isUserSelected = false;
    favIcon.className = favIcon.className.replace(/( |)selected/, '');
  } else {
    activeTab.isUserSelected = true;
    favIcon.className += ' selected';
  }
  _isSelecting = !!(getAllSelectedTabs().length);
}

// Update routine
function update() {
  var input = _elem.search;
  if (_prevInputValue !== input.value) {
    _prevInputValue = input.value;
    refreshInputMatching(_prevInputValue.toLowerCase());
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
_actions[40] = function () {  // key Down
  setActive(_active + 1);
};
_actions[38] = function () {  // key Up
  setActive(_active - 1);
};

_elem.search.onkeydown = function (e) {
  var fn = _actions[e.keyCode];
  if (typeof fn !== 'function') { return; }
  fn(e);
}

init();
