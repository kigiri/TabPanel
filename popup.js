// Cached Globals and Aliases
var _tabs = [];
var _elem = document.all;
// info on currentTab
var _currentWindow = null;
var _opts = {
  // Hide private navigation tabs form the results
  hideIncognito: true
};

// Activate focus on popup opening
_elem.search.focus();

function setCurrent(tabs) {
  _currentWindow = tabs[0].windowId;
  chrome.tabs.query({}, loadTabs);
}

function loadTabs(tabs) {
  _tabs = tabs.filter(tabsFilter);
  _tabs.sort(tabsSort);
  _tabs.forEach(genTab);
}

function tabsFilter(tab) {
  if (tab.selected) { return false; }
  return !(_opts.hideIncognito && tab.incognito);
}

function tabsSort(a, b) {
  if (a.windowId !== b.windowId) {
    if (a.windowId === _currentWindow) {
      return -1;
    }
    if (b.windowId === _currentWindow) {
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
  if (tab.windowId === _currentWindow) {
    favIcon.className += ' current';
  }
  favIcon.style.backgroundImage = "url('" + tab.favIconUrl + "')";

  var button = document.createElement('button');
  button.id = 'tab-' + idx + 1;
  button.appendChild(favIcon);
  button.appendChild(title);
  button.appendChild(url);
  button.dataset.id = tab.id;
  button.dataset.index = tab.index;
  tab.buttonHTML = button;
  _elem.list.appendChild(button);
}

function init() {
  var queryOptions = {
    'currentWindow': true,
    'active': true
  };
  chrome.tabs.query(queryOptions, setCurrent);
}

init();
