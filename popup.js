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
  showDefaultTabs();
}

// Generate tabs
function showDefaultTabs() {
  _tabs.sort(initialTabsSort);
  _tabs.forEach(genTab);
}

function showMatchedTabs() {
  _tabs.sort(scoreTabsSort);
  _tabs.forEach(genTab);
}

// filters, sort and map callbacks
function initialTabsFilter(tab) {
  if (tab.id === _currentTab.id) { return false; }
  if (typeof tab.id === 'undefined') { return false; }
  return !(_opts.hideIncognito && tab.incognito);
}

function onlySelectedTabsFilter(tab) {
  return !tab.isUserSelected;
}

function toTabIdArray(tab) {
  return tab.id;
}

function filterAndDestroySelected(tab) {
  if (tab.isUserSelected) {
    _elem.list.removeChild(tab.buttonHTML);
    return true;
  }
  return false;
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
    return a.windowId - b.windowId;
  }
  return a.index - b.index;
}

function scoreTabsSort(a, b) {
  return a.score - b.score;
}

// Dom Stuff
function createButtonHTML(tab, idx) {
  var title = document.createElement('h3');
  title.innerHTML = tab.titleHTML || tab.title;

  var url = document.createElement('span');
  url.innerHTML = tab.urlHTML || tab.url;

  var favIcon = document.createElement('div');
  favIcon.className = 'fav-icon';
  if (tab.windowId === _currentTab.windowId) {
    favIcon.className += ' current';
  }
  favIcon.style.backgroundImage = "url('" + tab.favIconUrl + "')";

  var button = document.createElement('button');
  button.id = 'tab-' + idx;
  button.dataset.id = tab.id;
  button.dataset.index = tab.index;
  button.appendChild(favIcon);
  button.appendChild(title);
  button.appendChild(url);
  return button;
}

function genTab(tab, idx) {
  if (!tab.buttonHTML) {
    tab.buttonHTML = createButtonHTML(tab, idx);
  }
  if (tab.score === 0) { return; }
  _elem.list.appendChild(tab.buttonHTML);
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
function matchCharInStr(str, c) {
  for (var i = 0; i < pattern.length; i++) {
    var c = pattern[i];
  }
}


function calcScore(matchInfo, patternChar, str) {
  var matchedChar = str[matchInfo.strIdx];
  if (matchInfo.strIdx)
  // bonus if capitalize
  // bonus if chain matches
  // bonus if preceded by a separator (' -_/.{}()[]')
  // no score for tolerated matches (typos, repeats)
  // half score for inverts
}

// UNTESTED !!
function fuzzyMatch(str, pattern, matchInfo) {
  for (var i = matchInfo.patternIdx + 1; i < pattern.length; i++) {
    var alt = [];
    var patternChar = pattern[i];

    for (var j = matchInfo.strIdx + 1; j < str.length; j++) {
      var strChar = str[j];
      if (strChar === ' ') { continue; }
      if (strChar.toLowerCase() === patternChar) {
        matchInfo.matched.push(alt);
        matchInfo.score += calcScore(matchInfo, patternChar, str);
        alt.push({
          'strIdx': j,
          'patternIdx': i,
          'matched': matchInfo.matched.slice(),
          'score': score
        });
      }
    }
    for (var i = alt.length - 1; i > 0; i--) { // compare to alternative scores
      var altRes = fuzzyMatch(str, pattern, alt[i]);
      if (altRes.score < matchInfo.score) {
        matchInfo.matched = altRes.matched;
        matchInfo.score = altRes.score;
      }
    }
    return { 'score': matchInfo.score, 'matched' matchInfo.matched };
  }
}

function fuzzyMatchString(tab, key, pattern) {
  var str = tab[key];
  var strHTML = [];

  var bestMatch = fuzzyMatch(str, pattern, {
    'strIdx': -1,
    'patternIdx': -1,
    'matched': [], 
    'score': 0,
  });
  tab[key + 'HTML'] = strHTML.join('');
}

function refreshInputMatching(pattern) {
  cleanTabList();
  if (typeof pattern !== 'string' || !pattern.length) {
    showDefaultTabs();
    return;
  }
  for (var i = _tabs.length - 1; i >= 0; i--) {
    var tab = _tabs[i];
    tab.score = tab.score || 0;
    fuzzyMatchString(tab, 'title', pattern);
    fuzzyMatchString(tab, 'url', pattern);
  }
  showMatchedTabs();
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
    showDefaultTabs();
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
  var favIcon = activeTab.buttonHTML.firstChild;
  if (activeTab.isUserSelected) {
    activeTab.isUserSelected = true;
    favIcon.className = 'fav-icon selected';
  } else {
    activeTab.isUserSelected = false;
    favIcon.className = 'fav-icon';
  }

  // this if / else if is a bit wierd
  // it's so i call getAllSelectedTabs() only if really needed
  if (_isSelecting) {
    if (getAllSelectedTabs().length) {
      _isSelecting = false;
    }
  } else if (activeTab.isUserSelected || getAllSelectedTabs().length) {
    _isSelecting = true;
  }
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
_actions[7]  = function (e) { // Key Tab
  e.preventDefault();
  e.stopPropagation();
  toggleSelectActiveTab();
};
_actions[13] = openActiveTab; // Key Enter
_actions[27] = function (e) { // Key esc
  e.preventDefault();
  e.stopPropagation();
};
_actions[87] = function (e) { // Key W
  if (e.ctrlKey) {
    e.preventDefault();
    e.stopPropagation();
  }
};
_actions[40] = function () {  // key Down
  setActive(_active + 1);
};
_actions[38] = function () {  // key Up
  setActive(_active - 1);
};

_elem.search.onkeydown = function (e) {
  console.log(e);
  var fn = _actions[e.keyCode];
  if (typeof fn !== 'function') { return; }
  fn(e);
}

init();
