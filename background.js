var _tabHistory = [];
var _opts = {
  // this option allow previous tab to be from any window
  'allWindows': true
};

// filters
function filterHistory(tab) {
  return (tab[this.key] !== this.value);
}

// Some type safety
function toObj(obj, idx, value) {
  if (typeof obj !== 'object') {
    obj = {};
  }
  obj[idx] = value;
  return obj;
}

function addToHistory(tabInfo) {
  // always push the first element
  var historyLen = _tabHistory.length - 1;
  if (historyLen < 0) {
    _tabHistory.push(tabInfo);
    return;
  }

  // the new tab should never be the same than the previous one, but in case...
  var lastTab = _tabHistory[historyLen];
  var tabId = tabInfo.tabId;
  if (lastTab.tabId === tabId) { return; }

  // In case of a simple swap between the 2 last tabs, avoid to push.
  var secondLastTab = _tabHistory[historyLen - 1];
  if (secondLastTab && secondLastTab.tabId === tabId) {
    _tabHistory[historyLen - 1] = _tabHistory[historyLen];
    _tabHistory[historyLen] = tabInfo;
  } else {
    // check if tab was already in the history
    var idx = getTabIdx(tabId);
    if (idx !== -1) {
      _tabHistory.splice(idx, 1);
    }
    _tabHistory.push(tabInfo);
  }
  console.log(JSON.stringify(_tabHistory));
}

function getTabIdx(tabId) {
  for (var i = _tabHistory.length - 1; i >= 0; i--) {
    if (_tabHistory[i].tabId === tabId) {
      return i;
    }
  }
  return -1;
}

function removeFromHistory(tabId, removeInfo) {
  var context = {};
  if (removeInfo.isWindowClosing) {
    context.key = 'windowId';
    var idx = getTabIdx(tabId);
    // if the tab is not in the history we can stop here
    if (idx === -1) { return; }
    context.value = _tabHistory[idx].windowId;
  } else {
    context.key = 'tabId';
    context.value = tabId;
  }
  _tabHistory = _tabHistory.filter(filterHistory, context);
}

// Listen to tab changes to save previous tab
chrome.tabs.onActivated.addListener(addToHistory);

// Clean history of removed tabs
chrome.tabs.onRemoved.addListener(removeFromHistory);

// Listen to window changes to do the same
if (_opts.allWindows) {
  chrome.windows.onFocusChanged.addListener(function (windowId) {
    // get active tab
    var queryInfo = {
      'windowId': windowId,
      'active': true
    };
    chrome.tabs.query(queryInfo, function (tabs) {
      var tab = tabs[0];
      if (!(/^chrome\-devtools\:/.test(tab.url) || tab.incognito)) {
        addToHistory({
          'tabId': tab.id,
          'windowId': tab.windowId
        });
      }
    });
  });
}

function getPreviousTab() {
  if (_opts.allWindows) {
    // return second last tab, the last one being the current.
    var secondLastTab = _tabHistory[_tabHistory.length - 2];
    if (typeof secondLastTab !== 'undefined') {
      return secondLastTab.tabId;
    }
  } else {
    var i = _tabHistory.length - 1;
    var windowId = _tabHistory[i].windowId;
    var tabId = _tabHistory[i].tabId;
    for (i--; i >= 0; i--) {
      var tab = _tabHistory[i];
      if (tab.windowId === windowId && tab.tabId !== tabId) {
        return tab.tabId;
      }
    }
  }
  return null;
}

// Send previous tab
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  sendResponse(getPreviousTab());
});
