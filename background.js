var _tabs = [];
var _usedSwitchMod = 'AltKey';
var _switchingCount = false;
var _lastTabSwitched = null;
var _opts = {
  // this option allow previous tab to be from any window
  'allWindows': true,
};
var _currentTab = null;
var _normalizeMap = {
  'á': 'a', 'ă': 'a', 'ắ': 'a', 'ặ': 'a', 'ằ': 'a', 'ẳ': 'a', 'ẵ': 'a',
  'ǎ': 'a', 'â': 'a', 'ấ': 'a', 'ậ': 'a', 'ầ': 'a', 'ẩ': 'a', 'ẫ': 'a',
  'ä': 'a', 'ǟ': 'a', 'ȧ': 'a', 'ǡ': 'a', 'ạ': 'a', 'ȁ': 'a', 'à': 'a',
  'ả': 'a', 'ȃ': 'a', 'ā': 'a', 'ą': 'a', 'ᶏ': 'a', 'ẚ': 'a', 'å': 'a',
  'ǻ': 'a', 'ḁ': 'a', 'ⱥ': 'a', 'ã': 'a', 'ḃ': 'b', 'ḅ': 'b', 'ɓ': 'b',
  'ḇ': 'b', 'ᵬ': 'b', 'ᶀ': 'b', 'ƀ': 'b', 'ƃ': 'b', 'ɵ': 'o', 'ć': 'c',
  'č': 'c', 'ç': 'c', 'ḉ': 'c', 'ĉ': 'c', 'ɕ': 'c', 'ċ': 'c', 'ƈ': 'c',
  'ȼ': 'c', 'ď': 'd', 'ḑ': 'd', 'ḓ': 'd', 'ȡ': 'd', 'ḋ': 'd', 'ḍ': 'd',
  'ɗ': 'd', 'ᶑ': 'd', 'ḏ': 'd', 'ᵭ': 'd', 'ᶁ': 'd', 'đ': 'd', 'ɖ': 'd',
  'ƌ': 'd', 'ı': 'i', 'ȷ': 'j', 'ɟ': 'j', 'ʄ': 'j', 'é': 'e', 'ĕ': 'e',
  'ě': 'e', 'ȩ': 'e', 'ḝ': 'e', 'ê': 'e', 'ế': 'e', 'ệ': 'e', 'ề': 'e',
  'ể': 'e', 'ễ': 'e', 'ḙ': 'e', 'ë': 'e', 'ė': 'e', 'ẹ': 'e', 'ȅ': 'e',
  'è': 'e', 'ẻ': 'e', 'ȇ': 'e', 'ē': 'e', 'ḗ': 'e', 'ḕ': 'e', 'ⱸ': 'e',
  'ę': 'e', 'ᶒ': 'e', 'ɇ': 'e', 'ẽ': 'e', 'ḛ': 'e', 'ḟ': 'f', 'ƒ': 'f',
  'ᵮ': 'f', 'ᶂ': 'f', 'ǵ': 'g', 'ğ': 'g', 'ǧ': 'g', 'ģ': 'g', 'ĝ': 'g',
  'ġ': 'g', 'ɠ': 'g', 'ḡ': 'g', 'ᶃ': 'g', 'ǥ': 'g', 'ḫ': 'h', 'ȟ': 'h',
  'ḩ': 'h', 'ĥ': 'h', 'ⱨ': 'h', 'ḧ': 'h', 'ḣ': 'h', 'ḥ': 'h', 'ɦ': 'h',
  'ẖ': 'h', 'ħ': 'h', 'í': 'i', 'ĭ': 'i', 'ǐ': 'i', 'î': 'i', 'ï': 'i',
  'ḯ': 'i', 'ị': 'i', 'ȉ': 'i', 'ì': 'i', 'ỉ': 'i', 'ȋ': 'i', 'ī': 'i',
  'į': 'i', 'ᶖ': 'i', 'ɨ': 'i', 'ĩ': 'i', 'ḭ': 'i', 'ꝺ': 'd', 'ꝼ': 'f',
  'ᵹ': 'g', 'ꞃ': 'r', 'ꞅ': 's', 'ꞇ': 't', 'ǰ': 'j', 'ĵ': 'j', 'ʝ': 'j',
  'ɉ': 'j', 'ḱ': 'k', 'ǩ': 'k', 'ķ': 'k', 'ⱪ': 'k', 'ꝃ': 'k', 'ḳ': 'k',
  'ƙ': 'k', 'ḵ': 'k', 'ᶄ': 'k', 'ꝁ': 'k', 'ꝅ': 'k', 'ĺ': 'l', 'ƚ': 'l',
  'ɬ': 'l', 'ľ': 'l', 'ļ': 'l', 'ḽ': 'l', 'ȴ': 'l', 'ḷ': 'l', 'ḹ': 'l',
  'ⱡ': 'l', 'ꝉ': 'l', 'ḻ': 'l', 'ŀ': 'l', 'ɫ': 'l', 'ᶅ': 'l', 'ɭ': 'l',
  'ł': 'l', 'ſ': 's', 'ẜ': 's', 'ẛ': 's', 'ẝ': 's', 'ḿ': 'm', 'ṁ': 'm',
  'ṃ': 'm', 'ɱ': 'm', 'ᵯ': 'm', 'ᶆ': 'm', 'ń': 'n', 'ň': 'n', 'ņ': 'n',
  'ṋ': 'n', 'ȵ': 'n', 'ṅ': 'n', 'ṇ': 'n', 'ǹ': 'n', 'ɲ': 'n', 'ṉ': 'n',
  'ƞ': 'n', 'ᵰ': 'n', 'ᶇ': 'n', 'ɳ': 'n', 'ñ': 'n', 'ó': 'o', 'ŏ': 'o',
  'ǒ': 'o', 'ô': 'o', 'ố': 'o', 'ộ': 'o', 'ồ': 'o', 'ổ': 'o', 'ỗ': 'o',
  'ö': 'o', 'ȫ': 'o', 'ȯ': 'o', 'ȱ': 'o', 'ọ': 'o', 'ő': 'o', 'ȍ': 'o',
  'ò': 'o', 'ỏ': 'o', 'ơ': 'o', 'ớ': 'o', 'ợ': 'o', 'ờ': 'o', 'ở': 'o',
  'ỡ': 'o', 'ȏ': 'o', 'ꝋ': 'o', 'ꝍ': 'o', 'ⱺ': 'o', 'ō': 'o', 'ṓ': 'o',
  'ṑ': 'o', 'ǫ': 'o', 'ǭ': 'o', 'ø': 'o', 'ǿ': 'o', 'õ': 'o', 'ṍ': 'o',
  'ṏ': 'o', 'ȭ': 'o', 'ɛ': 'e', 'ᶓ': 'e', 'ɔ': 'o', 'ᶗ': 'o', 'ṕ': 'p',
  'ṗ': 'p', 'ꝓ': 'p', 'ƥ': 'p', 'ᵱ': 'p', 'ᶈ': 'p', 'ꝕ': 'p', 'ᵽ': 'p',
  'ꝑ': 'p', 'ꝙ': 'q', 'ʠ': 'q', 'ɋ': 'q', 'ꝗ': 'q', 'ŕ': 'r', 'ř': 'r',
  'ŗ': 'r', 'ṙ': 'r', 'ṛ': 'r', 'ṝ': 'r', 'ȑ': 'r', 'ɾ': 'r', 'ᵳ': 'r',
  'ȓ': 'r', 'ṟ': 'r', 'ɼ': 'r', 'ᵲ': 'r', 'ᶉ': 'r', 'ɍ': 'r', 'ɽ': 'r',
  'ↄ': 'c', 'ꜿ': 'c', 'ɘ': 'e', 'ɿ': 'r', 'ś': 's', 'ṥ': 's', 'š': 's',
  'ṧ': 's', 'ş': 's', 'ŝ': 's', 'ș': 's', 'ṡ': 's', 'ṣ': 's', 'ṩ': 's',
  'ʂ': 's', 'ᵴ': 's', 'ᶊ': 's', 'ȿ': 's', 'ɡ': 'g', 'ᴑ': 'o', 'ᴓ': 'o',
  'ᴝ': 'u', 'ť': 't', 'ţ': 't', 'ṱ': 't', 'ț': 't', 'ȶ': 't', 'ẗ': 't',
  'ⱦ': 't', 'ṫ': 't', 'ṭ': 't', 'ƭ': 't', 'ṯ': 't', 'ᵵ': 't', 'ƫ': 't',
  'ʈ': 't', 'ŧ': 't', 'ɐ': 'a', 'ǝ': 'e', 'ᵷ': 'g', 'ɥ': 'h', 'ʮ': 'h',
  'ʯ': 'h', 'ᴉ': 'i', 'ʞ': 'k', 'ꞁ': 'l', 'ɯ': 'm', 'ɰ': 'm', 'ɹ': 'r',
  'ɻ': 'r', 'ɺ': 'r', 'ⱹ': 'r', 'ʇ': 't', 'ʌ': 'v', 'ʍ': 'w', 'ʎ': 'y',
  'ú': 'u', 'ŭ': 'u', 'ǔ': 'u', 'û': 'u', 'ṷ': 'u', 'ü': 'u', 'ǘ': 'u',
  'ǚ': 'u', 'ǜ': 'u', 'ǖ': 'u', 'ṳ': 'u', 'ụ': 'u', 'ű': 'u', 'ȕ': 'u',
  'ù': 'u', 'ủ': 'u', 'ư': 'u', 'ứ': 'u', 'ự': 'u', 'ừ': 'u', 'ử': 'u',
  'ữ': 'u', 'ȗ': 'u', 'ū': 'u', 'ṻ': 'u', 'ų': 'u', 'ᶙ': 'u', 'ů': 'u',
  'ũ': 'u', 'ṹ': 'u', 'ṵ': 'u', 'ⱴ': 'v', 'ꝟ': 'v', 'ṿ': 'v', 'ʋ': 'v',
  'ᶌ': 'v', 'ⱱ': 'v', 'ṽ': 'v', 'ẃ': 'w', 'ŵ': 'w', 'ẅ': 'w', 'ẇ': 'w',
  'ẉ': 'w', 'ẁ': 'w', 'ⱳ': 'w', 'ẘ': 'w', 'ẍ': 'x', 'ẋ': 'x', 'ᶍ': 'x',
  'ý': 'y', 'ŷ': 'y', 'ÿ': 'y', 'ẏ': 'y', 'ỵ': 'y', 'ỳ': 'y', 'ƴ': 'y',
  'ỷ': 'y', 'ỿ': 'y', 'ȳ': 'y', 'ẙ': 'y', 'ɏ': 'y', 'ỹ': 'y', 'ź': 'z',
  'ž': 'z', 'ẑ': 'z', 'ʑ': 'z', 'ⱬ': 'z', 'ż': 'z', 'ẓ': 'z', 'ȥ': 'z',
  'ẕ': 'z', 'ᵶ': 'z', 'ᶎ': 'z', 'ʐ': 'z', 'ƶ': 'z', 'ɀ': 'z', 'ₐ': 'a',
  'ₑ': 'e', 'ᵢ': 'i', 'ⱼ': 'j', 'ₒ': 'o', 'ᵣ': 'r', 'ᵤ': 'u', 'ᵥ': 'v',
  'ₓ': 'x', '.': '-', ',': '-', ':': '-', ';': '-', '[': '-', ']': '-',
  '(': '-', ')': '-', '{': '-', '}': '-', ' ': '-', '-': '-', '_': '-',
  '&': '-', '|': '-', '=': '-', '*': '-', '+': '-', "'": '-', '"': '-',
  '\\': '-', '/': '-', '<': '-', '>': '-'
};

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

// filters
function defaultTabSort(a, b) {
  if (a.lastActivityTime !== b.lastActivityTime) {
    if (a.lastActivityTime > b.lastActivityTime) { return -1; }
    return 1;
  }
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

function updateLastActivity(info) {
  var id = (typeof info === 'object') ? info.tabId : info;
  if (!id) { return; }
  // If we are switching tab we wait for the end of the selection to save
  if (_switchingCount !== false) {
    _lastTabSwitched = id;
    return;
  }

  var tab = getTab(id);
  if (tab) {
    tab.lastActivityTime = Date.now();
    _currentTab = tab;
    _tabs.sort(defaultTabSort);
  } else {
    chrome.tabs.get(id, function (newTab) {
      if (chrome.runtime.lastError) {
        // tab not found ?
        return console.log(chrome.runtime.lastError);
      }
      generateTab(newTab);
      newTab.lastActivityTime = Date.now();
      _currentTab = newTab;
      _tabs.sort(defaultTabSort);
    });
  }
}

function formatTab(tab) {
  var url = new URL(tab.url);
  if (!/^http/.test(url.protocol)) {
    tab.hostname = (url.protocol === 'chrome:')
                  ? url.origin
                  : url.href.substring(0, 75);
    tab.suffix = '';
    tab.pathname = '';
  } else {
    tab.hostname = url.hostname.replace(/(^www\.|\..[^\.]+$)/g, '');
    tab.suffix = url.hostname.match(/\..[^\.]+$/);
    tab.pathname = (url.pathname + url.hash).replace(/\/$/, '');
    tab.pathname = tab.pathname.substring(0, 75 - tab.hostname.length);
  }
  tab.hostnameNormalized = normalize(tab.hostname);
  tab.titleNormalized = normalize(tab.title);
  tab.pathnameNormalized = normalize(tab.pathname);
  tab.lastActivityTime = 0;
  if (tab.selected && tab.active) {
    _currentTab = tab;
  }
}

function loadTabs(tabs) {
  _tabs = tabs;
  _tabs.forEach(formatTab);
}


function init() {
  // Load All tabs
  chrome.tabs.query({}, loadTabs);
}

function generateTab(tab) {
  formatTab(tab);
  _tabs.unshift(tab);
}

function getTab(id) {
  for (var i = 0; i < _tabs.length; i++) {
    if (_tabs[i].id === id) {
      return _tabs[i];
    }
  }
  return null;
}

function getTabIdx(id) {
  for (var i = 0; i < _tabs.length; i++) {
    if (_tabs[i].id === id) {
      return i;
    }
  }
  return -1;
}

function removeFromList(tabId, removeInfo) {
  _tabs = _tabs.splice(getTabIdx(tabId), 1);
}

// Listen to tab changes to save previous tab
chrome.tabs.onActivated.addListener(updateLastActivity);

// Clean history of removed tabs
chrome.tabs.onRemoved.addListener(removeFromList);

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
        // updateLastActivity(tab.id);
      }
    });
  });
}

// Messages Handlers
var _messagesHandlers = {
  'getInfo': function () {
    return {
      'tabs': _tabs,
      'map': _normalizeMap,
      'currentTab': _currentTab
    };
  },
  'hookWindow': function () {
    return _usedSwitchMod;
  },
  'modkeyUp': function (req) {
    if (_switchingCount !== false) {
      console.log('reset');
      _switchingCount = false;
      updateLastActivity(_lastTabSwitched);
      _lastTabSwitched = null;
    }
  },
  'default': function (arg) { return arg}
}

chrome.runtime.onMessage.addListener(function (req, sender, resCb) {
  if (!req) { return; }
  var res = (_messagesHandlers[req.type] || _messagesHandlers.default)(req);
  if (typeof resCb === 'function') {
    resCb(res);
  }
});

function openTab(tab, sign, nextTry) {
  chrome.tabs.update(tab.id, { 'active': true }, function () {
    if (chrome.runtime.lastError) {
      nextTry();
    } else {
      _switchingCount += sign;
      if (tab.windowId !== _currentTab.windowId) {
        chrome.windows.update(tab.windowId, { 'focused': true }, function () {
          if (chrome.runtime.lastError) {
            nextTry();
          }
        });
      }
    }
  });
}

function activeTab(idx, sign) {
  console.log(idx, _switchingCount);
  var max = _tabs.length - 1;
  if (idx > max) {
    idx = 0;
  } else if (idx < 1) {
    idx = max;
  }
  var tab = _tabs[idx];
  if (!tab) { return; }
  openTab(tab, sign, function () {
    activeTab(idx + sign);
  });
}

// Commands handlers
var _commandsHandlers = {
  "switch_between_tabs": function () {
    var max = _tabs.length;
    if (_switchingCount === false) {
      _switchingCount = 1;
    }
    activeTab(~~((_switchingCount + 1) % max), 1);
  },
  "switch_back_between_tabs": function () {
    var max = _tabs.length - 1;
    if (_switchingCount === false) {
      _switchingCount = max;
    } else {
      _switchingCount--;
    }
    activeTab(max - _switchingCount, -1);
  },
  "default": function (command) {
    console.warn('Unhandled command: ' + command);
  }
}


// Commands binding
chrome.commands.onCommand.addListener(function (command) {
  (_commandsHandlers[command] || _commandsHandlers.default)(command);
})

chrome.commands.getAll(function (commands) {
  var switchShortcut = [];
  // Find appropriate shortcut
  for (var i = 0; i < commands.length; i++) {
    if (commands[i].name === "switch_between_tabs") {
      switchShortcut = commands[i].shortcut.split('+');
    }
  }

  // Set used the modifiers
  for (var i = 0; i < switchShortcut.length; i++) {
    switch (switchShortcut[i]) {
      case 'Alt'  : _usedSwitchMod = 'AltKey'; return;
      case 'Ctrl' : _usedSwitchMod = 'ControlKey'; return;
      case 'Shift': _usedSwitchMod = 'ShiftKey'; return;
    }
  }
})

init();