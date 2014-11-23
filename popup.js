// Cached Globals and Aliases
var _tabs = [];
var _elem = document.all;
var _active = null;
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
  if (typeof tab.windowId === 'undefined') { return false; }
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

  if (_active !== null) {
    _tabs[_active].buttonHTML.className = '';
  }

  var btn = _tabs[idx].buttonHTML;
  btn.className = 'active';
  _active = idx;

  scrollTo(btn);
}


// Handle inputs
_elem.search.onkeydown = function (e) {
  console.log(e);
  switch (e.keyCode) {
    case 38: handleKeyUp();   break; // key up
    case 40: handleKeyDown(); break; // key down
    default: break;
  }
}

function handleKeyDown() {
  setActive(_active + 1);
}

function handleKeyUp() {
  setActive(_active - 1);
}

init();
