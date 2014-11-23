// Cached Globals and Aliases
var _tabs = [];
var _elem = document.all;
var _asyncLoadState = 0;
var _active = -1;
var _previousTabId = -1;
var _actions = [];
// info on currentTab
var _currentTab = null;
var _opts = {
  // Hide private navigation tabs form the results
  hideIncognito: true
};

// Activate focus on popup opening
_elem.search.focus();


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
  _previousTabId = tabId;
  tryLoadTabs();
}

function loadTabs(tabs) {
  _tabs = tabs.filter(tabsFilter);
  _tabs.sort(tabsSort);
  _tabs.forEach(genTab);
}

function tabsFilter(tab) {
  if (tab.id === _currentTab.id) { return false; }
  if (typeof tab.id === 'undefined') { return false; }
  return !(_opts.hideIncognito && tab.incognito);
}

function tabsSort(a, b) {
  if (a.id === _previousTabId) { return -1; }
  if (b.id === _previousTabId) { return 1; }
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

// generate and append tab button
function genTab(tab, idx) {
  var title = document.createElement('h3');
  title.innerHTML = tab.title;

  var url = document.createElement('span');
  url.innerHTML = tab.url;

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
  _elem.list.appendChild(button);
  tab.buttonHTML = button;
}

function init() {
  var queryOptions = {
    'currentWindow': true,
    'active': true
  };
  chrome.tabs.query(queryOptions, setCurrent);

  //get previous tab from tabHistory
  chrome.runtime.sendMessage({}, setPrevious);
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

// choose active element
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


// Handle inputs
_actions[13] = openActiveTab; // Key Enter
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
