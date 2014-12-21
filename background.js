/*******************************************************************************
 * Globals
 ******************************************************************************/

var _currentTab = {};
var _opts = {
  mod: 'altKey',
  disableBackward: false,
  allWindows: true,
  hideIncognito: true,
}
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


/*******************************************************************************
 * Collection of usefull functions
 ******************************************************************************/

function customError(name, message) {
  this.name = (name || 'GENERIC_ERROR');
  this.message = (message || 'Unkown message');
}

// Default Javascript conversion to base64 fail on unicode text
function toBase64(str) {
  var C = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var out = "", i = 0, len = str.length, c1, c2, c3;
  while (i < len) {
    c1 = str.charCodeAt(i++) & 0xff;
    if (i == len) {
      out += C.charAt(c1 >> 2);
      out += C.charAt((c1 & 0x3) << 4);
      out += "==";
      break;
    }
    c2 = str.charCodeAt(i++);
    if (i == len) {
      out += C.charAt(c1 >> 2);
      out += C.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
      out += C.charAt((c2 & 0xF) << 2);
      out += "=";
      break;
    }
    c3 = str.charCodeAt(i++);
    out += C.charAt(c1 >> 2);
    out += C.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
    out += C.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
    out += C.charAt(c3 & 0x3F);
  }
  return out;
}

// Allow to remove specials characters and normalize accent
// for a more tolerant search
function normalize(str) {
  if (!str) { return str; }
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

function invalidHttpUrl(url) {
  return (notInRange(url.length, 16, 150) || !/^http/.test(url));
}

/*******************************************************************************
 * Error handlers
 ******************************************************************************/

function wrongType(arg, type) {
  if (type instanceof Array) {
    for (var i = 0; i < type.length; i++) {
      if (typeof arg === type[i]) { return false; }
    }
  } else if (typeof arg === type) { return false; }
  console.warn(new Error('Wrong arguments types'));
  return true;
}

function notInRange(arg, min, max) {
  return ((arg < min) || (arg > max));
}


/*******************************************************************************
 * Tab Object and Methods declarations
 ******************************************************************************/

var Tab = function (tabObject) {
  this.update(tabObject);
}

Tab.prototype = {
  open: function() {
    if (this.windowId !== _currentTab.windowId) {
      chrome.windows.update(this.windowId, { 'focused': true });
    }
    chrome.tabs.update(this.id, { 'active': true });
  },

  close: function() {
    chrome.tabs.remove(this.id);
  },

  watch: function() {
    this.lastSeen = Date.now();
    _currentTab = this;
  },

  flagForUpdate: function() {
    this.lastUpdate = Date.now();
  },

  update: function(newValue) {
    if (wrongType(newValue, 'object')) { return; }
    for (var key in newValue) {
      this[key] = newValue[key];
    }
    this.lastUpdate = Date.now();
    this.lastSeen = (this.lastSeen || 0);
    this.format();
  },

  format: function() {
    var url = (this.url.match(/(^\S+\/\/)([^\/]+)(.+)/)
      || ['', '', this.url, '/']);
    this.hostname = url[2];
    this.pathname = url[3];
    if (/^data:/.test(this.favIconUrl)) {
      FavIcons.add(this.hostname, this.favIconUrl);
      this.favIconUrl = this.hostname;
    } else if (/^chrome:/.test(this.url)) {
      var localUrl = FavIcons.localUrl(this.url);
      if (localUrl) {
        FavIcons.add(this.url, localUrl, 'chrome');
      } else {
        FavIcons.gen(this.url);
      }
      // Some tabs don't have the favIcon link
      // it's like favIcon appears out of thin air, it's magic !
      // So i'm overriding the url.
      this.favIconUrl = this.url;
    } else if (FavIcons.get(this.favIconUrl) !== 'success') {
      FavIcons.gen(this.hostname);
      this.favIconUrl = this.hostname;
    }
    this.hostnameNormalized = normalize(this.hostname);
    this.titleNormalized = normalize(this.title);
    this.pathnameNormalized = normalize(this.pathname);
  }
};


/*******************************************************************************
 * Tab list declaration
 ******************************************************************************/

var TabList = (function () {
  var TabList = {},
    prevArray = [],
    lastUpdate = Date.now(),
    pendingCallbacks = 0;

  // Filter
  function currentAndOpts(tab) {
    if (wrongType(tab, 'object')) { return; }
    if ((tab.id === _currentTab.id) || (tab.id === undefined)) {
      return false;
    }
    return !(_opts.hideIncognito && tab.incognito);
  }

  function tryCallback(callback) {
    if (pendingCallbacks > 0) { return; }
    callback(prevArray.filter(currentAndOpts));
  }

  // Export (refetch if need to update, sort and convert to arry of TabList)
  TabList.export = function (callback) {
    if (wrongType(callback, 'function')) { return; }
    if (pendingCallbacks > 0) { return callback(prevArray); }
    var generatedArray = [], tab;
    for (var id in TabList) {
      tab = TabList[id];
      if (!(tab instanceof Tab)) { continue; }
      if (tab.lastUpdate > TabList.lastUpdate) {
        pendingCallbacks++;
        chrome.tabs.get(tab.id, function (tabObject) {
          if (typeof tabObject !== "object") {
            TabList.remove(tab.id);
          } else {
            TabList[tabObject.id].update(tabObject);
          }
          pendingCallbacks--;
          tryCallback(callback);
        });
      }
      generatedArray.push(tab);
    }
    prevArray = generatedArray;
    tryCallback(callback);
    lastUpdate = Date.now();
  };

  // New tab
  TabList.add = function (tabInfo) {
    if (wrongType(tabInfo, 'object')) { return; }
    if (tabInfo instanceof Array) {
      tabInfo.forEach(TabList.add);
    } else {
      TabList[tabInfo.id] = new Tab(tabInfo);
      return TabList[tabInfo.id];
    }
  };

  // Del tab
  TabList.del = function (tabId) {
    if (wrongType(tabId, ['number', 'string'])) { return; }
    delete TabList[tabId];
  };
  return TabList;
})();


/*******************************************************************************
 * FavIcons
 ******************************************************************************/

var FavIcons = (function() {
  var base = chrome.extension.getURL('favicons/');
  var localFavIcons = {
    bookmarks: base + 'IDR_BOOKMARKS_FAVICON.png',
    conflicts: base + 'IDR_CONFLICT_FAVICON.png',
    downloads: base + 'IDR_DOWNLOADS_FAVICON.png',
    chrome: base + 'IDR_PRODUCT_LOGO.png',
    help: base + 'IDR_PRODUCT_LOGO.png',
    plugins: base + 'IDR_EXTENSIONS_FAVICON.png',
    extensions: base + 'IDR_EXTENSIONS_FAVICON.png',
    components: base + 'IDR_EXTENSIONS_FAVICON.png',
    flags: base + 'IDR_FLAGS_FAVICON.png',
    history: base + 'IDR_HISTORY_FAVICON.png',
    crashes: base + 'IDR_SAD_FAVICON.png',
    settings: base + 'IDR_SETTINGS_FAVICON.png',
    apps: base + 'IDR_APP_LIST.png',
  };
  var storedBase64Icons = {};
  function addFavIcon(key, base64url, type) {
    storedBase64Icons[key] = {
      'data': base64url,
      'type': (type || 'default')
    };
  }

  function generateFavIcon(key) {
      if (wrongType(key, 'string')) {
        key = 'default';
      }
      if (storedBase64Icons[key]) { return; }
      var url = 'data:image/png;base64,' + new Identicon(key, 16).toString();
      addFavIcon(key, url, 'generated');
    }

  return {
    all: storedBase64Icons,
    add: addFavIcon,
    gen: generateFavIcon,

    get: function (url) {
      if (wrongType(url, 'string')) { return; }
      if (typeof storedBase64Icons[url] === "object") { return 'success'; }
      if (invalidHttpUrl(url)) { return; }
      var type = (url.match(/[^\.]+$/) || [])[0]; // Extract extension
      if (!type) { return; }
      type = (type.match(/^[^\?]+/) || [])[0]; // Remove additional URL junk

      switch (type) {
        case 'jpg': type = 'image/jpeg'; break;
        case 'ico': type = 'image/vnd.microsoft.icon'; break;
        case 'png':
        case 'tiff':
        case 'jpeg': type = 'image/' + type; break;
        default: return;
      }

      var xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'arrayBuffer';
      xhr.overrideMimeType("text/plain; charset=x-user-defined");
      addFavIcon(url, "#", "loading");
      xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
          var data = 'data:' + type + ';base64,' + toBase64(xhr.responseText);
          addFavIcon(url, data);
        }
      }, false);
      xhr.send();
      return 'success';
    },

    localUrl: function (url) {
      var type = url.match(/^chrome:\/\/([^\/]+)/);
      if (!type) { return; }
      return localFavIcons[type[1]];
    }
  };
})();


/*******************************************************************************
 * Track watched tabs
 ******************************************************************************/

function setWatchTab(tab) {
  if (wrongType(tab, 'object')) { return; }
  var foundTab = (TabList[(tab.tabId || tab[0].id)] || TabList.add(tab));
  if (!foundTab) {
    return console.error(new Error('Tab not generated wut wut ??'), tab);
  }
  foundTab.watch();
}

chrome.tabs.onActivated.addListener(setWatchTab);

// On window focus change
chrome.windows.onFocusChanged.addListener(function (windowId) {
  // get active tab
  var queryInfo = {
    'windowId': windowId,
    'active': true
  };
  chrome.tabs.query(queryInfo, setWatchTab);
});


/*******************************************************************************
 * Keep TabList updated
 ******************************************************************************/

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tabObject) {
  var tab = TabList[tabId];
  if ((tab instanceof Tab)) {
    tab.update(tabObject);
  } else {
    TabList.add(tabObject);
  }
});


/*******************************************************************************
 * Process new tabs
 ******************************************************************************/

chrome.tabs.onCreated.addListener(TabList.add);


/*******************************************************************************
 * Remove tabs
 ******************************************************************************/

chrome.tabs.onRemoved.addListener(TabList.del);


/*******************************************************************************
 * Communication with other tabs and scripts
 ******************************************************************************/

(function () {
  var handlers = {
    'loadPopup': function (req, callback) {
      TabList.export(function (tabs) {
        callback({
          'tabs': tabs,
          'map': _normalizeMap,
          'currentTab': _currentTab
        });
      });
    },
    'loadOpts':     function (req, callback) { callback(_opts); },
    'loadFavIcons': function (req, callback) { callback(FavIcons.all); },
    'loadTabs':     function (req, callback) { TabList.export(callback); },
    'default':      function (req, callback) { return req; }
  };

  chrome.runtime.onMessage.addListener(function (req, sender, callback) {
    (handlers[(req.type || req)] || handlers.default)(req, callback);
  });
})();


/*******************************************************************************
 * Commands and Shortcuts
 ******************************************************************************/

(function () {
  var handler = {
    "switch_between_tabs": function () {
      chrome.tabs.sendMessage(_currentTab.id, 'switch_between_tabs');
    },
    "default": function (command) {
      console.warn('Unhandled command: ' + command);
    }
  };

  chrome.commands.onCommand.addListener(function (command) {
    (handler[command] || handler.default)(command);
  });
})();

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
      case 'Ctrl' : _opts.mod = 'controlKey'; break;
      case 'Shift': _opts.disableBackward = true;
        // I should alert the user that shift is used to go backward in the
        // tab cycle, and so using it will disable this functionality.
        break;
      default: break;
    }
  }
});


/*******************************************************************************
 * Populate tab list
 ******************************************************************************/

chrome.tabs.query({}, TabList.add);

/*******************************************************************************
 * Set current tab
 ******************************************************************************/

chrome.tabs.query({ 'currentWindow': true, 'active': true }, function (tabs) {
  _currentTab = tabs[0];
})


/*******************************************************************************
 * Identicon.js v1.0
 * http://github.com/stewartlord/identicon.js
 *
 * Requires PNGLib
 * http://www.xarg.org/download/pnglib.js
 *
 * Copyright 2013, Stewart Lord
 * Released under the BSD license
 * http://www.opensource.org/licenses/bsd-license.php
 *
 * Modified by cdenis for favicons, copyright I don't give a fuck.
 ******************************************************************************/

var Identicon = (function() {
  Identicon = function(url, size, margin){
    this.url = url;
    this.size = (size || 64);
  }

  Identicon.prototype = {
    url: null,
    margin: null,

    render: function () {
      var hash = this.hash(this.url);
      // console.log(this.url, hash);
      var image = new PNGlib(16, 16, 256);

      // light-grey background
      var bg = image.color(0, 0, 0, 0);

      // foreground is last 7 chars as hue at 50% saturation, 70% brightness
      var rgb = this.hsl2rgb(~~(hash % 360) / 360, 0.5, 0.7);
      var fg = image.color(rgb[0], rgb[1], rgb[2]);

      // the first 15 characters of the url control the pixels (even/odd)
      // they are drawn down the middle first, then mirrored outwards
      var x, y, color, i = 1;
      for (y = 0; y < 16; y += 2) {
        for (x = 0; x < 8; x += 2) {
          i++;
          color = ((hash % i) / i > 0.5) ? bg : fg;
          this.drawPixel(image, 14 - x, y, color);
          this.drawPixel(image, x, y, color);
        }
      }
      return image;
    },

    drawPixel: function (image, x, y, color) {
      image.buffer[image.index(x, y)] = color;
      image.buffer[image.index(x + 1, y)] = color;
      image.buffer[image.index(x, y + 1)] = color;
      image.buffer[image.index(x + 1, y + 1)] = color;
    },

    hash: function (str) {
      if (wrongType(str, 'string')) { return; }
      var prev = 5381;
      var total = 0;
      for (var i = 0; i < str.length; i++) {
        var c = str[i].charCodeAt();
        total = ((prev << 5) + prev) + c;
        prev = c;
      }
      return total;
    },

    // adapted from: https://gist.github.com/aemkei/1325937
    hsl2rgb: function(h, s, b) {
      h *= 6;
      s = [
        b += s *= b < 0.5 ? b : 1 - b,
        b - h % 1 * s * 2,
        b -= s *= 2,
        b,
        b + h % 1 * s,
        b + s
      ];
      return [
        ~~(s[ (~~h)  % 6 ] * 255),  // red
        ~~(s[ (h|16) % 6 ] * 255),  // green
        ~~(s[ (h|8)  % 6 ] * 255)   // blue
      ];
    },

    toString: function(){
      return this.render().getBase64();
    }
  }

  return Identicon;
})();


/*******************************************************************************
 * A handy class to calculate color values.
 *
 * @version 1.0
 * @author Robert Eisele <robert@xarg.org>
 * @copyright Copyright (c) 2010, Robert Eisele
 * @link http://www.xarg.org/2010/03/generate-client-side-png-files-using-javascript/
 * @license http://www.opensource.org/licenses/bsd-license.php BSD License
 *
 ******************************************************************************/

(function() {

  // helper functions for that ctx
  function write(buffer, offs) {
    for (var i = 2; i < arguments.length; i++) {
      for (var j = 0; j < arguments[i].length; j++) {
        buffer[offs++] = arguments[i].charAt(j);
      }
    }
  }

  function byte2(w) {
    return String.fromCharCode((w >> 8) & 255, w & 255);
  }

  function byte4(w) {
    return String.fromCharCode((w >> 24) & 255, (w >> 16) & 255, (w >> 8) & 255, w & 255);
  }

  function byte2lsb(w) {
    return String.fromCharCode(w & 255, (w >> 8) & 255);
  }

  window.PNGlib = function(width,height,depth) {

    this.width   = width;
    this.height  = height;
    this.depth   = depth;

    // pixel data and row filter identifier size
    this.pix_size = height * (width + 1);

    // deflate header, pix_size, block headers, adler32 checksum
    this.data_size = 2 + this.pix_size + 5 * Math.floor((0xfffe + this.pix_size) / 0xffff) + 4;

    // offsets and sizes of Png chunks
    this.ihdr_offs = 0;                 // IHDR offset and size
    this.ihdr_size = 4 + 4 + 13 + 4;
    this.plte_offs = this.ihdr_offs + this.ihdr_size; // PLTE offset and size
    this.plte_size = 4 + 4 + 3 * depth + 4;
    this.trns_offs = this.plte_offs + this.plte_size; // tRNS offset and size
    this.trns_size = 4 + 4 + depth + 4;
    this.idat_offs = this.trns_offs + this.trns_size; // IDAT offset and size
    this.idat_size = 4 + 4 + this.data_size + 4;
    this.iend_offs = this.idat_offs + this.idat_size; // IEND offset and size
    this.iend_size = 4 + 4 + 4;
    this.buffer_size  = this.iend_offs + this.iend_size;  // total PNG size

    this.buffer  = new Array();
    this.palette = new Object();
    this.pindex  = 0;

    var _crc32 = new Array();

    // initialize buffer with zero bytes
    for (var i = 0; i < this.buffer_size; i++) {
      this.buffer[i] = "\x00";
    }

    // initialize non-zero elements
    write(this.buffer, this.ihdr_offs, byte4(this.ihdr_size - 12), 'IHDR', byte4(width), byte4(height), "\x08\x03");
    write(this.buffer, this.plte_offs, byte4(this.plte_size - 12), 'PLTE');
    write(this.buffer, this.trns_offs, byte4(this.trns_size - 12), 'tRNS');
    write(this.buffer, this.idat_offs, byte4(this.idat_size - 12), 'IDAT');
    write(this.buffer, this.iend_offs, byte4(this.iend_size - 12), 'IEND');

    // initialize deflate header
    var header = ((8 + (7 << 4)) << 8) | (3 << 6);
    header+= 31 - (header % 31);

    write(this.buffer, this.idat_offs + 8, byte2(header));

    // initialize deflate block headers
    for (var i = 0; (i << 16) - 1 < this.pix_size; i++) {
      var size, bits;
      if (i + 0xffff < this.pix_size) {
        size = 0xffff;
        bits = "\x00";
      } else {
        size = this.pix_size - (i << 16) - i;
        bits = "\x01";
      }
      write(this.buffer, this.idat_offs + 8 + 2 + (i << 16) + (i << 2), bits, byte2lsb(size), byte2lsb(~size));
    }

    /* Create crc32 lookup table */
    for (var i = 0; i < 256; i++) {
      var c = i;
      for (var j = 0; j < 8; j++) {
        if (c & 1) {
          c = -306674912 ^ ((c >> 1) & 0x7fffffff);
        } else {
          c = (c >> 1) & 0x7fffffff;
        }
      }
      _crc32[i] = c;
    }

    // compute the index into a png for a given pixel
    this.index = function(x,y) {
      var i = y * (this.width + 1) + x + 1;
      var j = this.idat_offs + 8 + 2 + 5 * Math.floor((i / 0xffff) + 1) + i;
      return j;
    }

    // convert a color and build up the palette
    this.color = function(red, green, blue, alpha) {

      alpha = alpha >= 0 ? alpha : 255;
      var color = (((((alpha << 8) | red) << 8) | green) << 8) | blue;

      if (typeof this.palette[color] == "undefined") {
        if (this.pindex == this.depth) return "\x00";

        var ndx = this.plte_offs + 8 + 3 * this.pindex;

        this.buffer[ndx + 0] = String.fromCharCode(red);
        this.buffer[ndx + 1] = String.fromCharCode(green);
        this.buffer[ndx + 2] = String.fromCharCode(blue);
        this.buffer[this.trns_offs+8+this.pindex] = String.fromCharCode(alpha);

        this.palette[color] = String.fromCharCode(this.pindex++);
      }
      return this.palette[color];
    }

    // output a PNG string, Base64 encoded
    this.getBase64 = function() {

      var s = this.getDump();

      var ch = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      var c1, c2, c3, e1, e2, e3, e4;
      var l = s.length;
      var i = 0;
      var r = "";

      do {
        c1 = s.charCodeAt(i);
        e1 = c1 >> 2;
        c2 = s.charCodeAt(i+1);
        e2 = ((c1 & 3) << 4) | (c2 >> 4);
        c3 = s.charCodeAt(i+2);
        if (l < i+2) { e3 = 64; } else { e3 = ((c2 & 0xf) << 2) | (c3 >> 6); }
        if (l < i+3) { e4 = 64; } else { e4 = c3 & 0x3f; }
        r+= ch.charAt(e1) + ch.charAt(e2) + ch.charAt(e3) + ch.charAt(e4);
      } while ((i+= 3) < l);
      return r;
    }

    // output a PNG string
    this.getDump = function() {

      // compute adler32 of output pixels + row filter bytes
      var BASE = 65521; /* largest prime smaller than 65536 */
      var NMAX = 5552;  /* NMAX is the largest n such that 255n(n+1)/2 + (n+1)(BASE-1) <= 2^32-1 */
      var s1 = 1;
      var s2 = 0;
      var n = NMAX;

      for (var y = 0; y < this.height; y++) {
        for (var x = -1; x < this.width; x++) {
          s1+= this.buffer[this.index(x, y)].charCodeAt(0);
          s2+= s1;
          if ((n-= 1) == 0) {
            s1%= BASE;
            s2%= BASE;
            n = NMAX;
          }
        }
      }
      s1%= BASE;
      s2%= BASE;
      write(this.buffer, this.idat_offs + this.idat_size - 8, byte4((s2 << 16) | s1));

      // compute crc32 of the PNG chunks
      function crc32(png, offs, size) {
        var crc = -1;
        for (var i = 4; i < size-4; i += 1) {
          crc = _crc32[(crc ^ png[offs+i].charCodeAt(0)) & 0xff] ^ ((crc >> 8) & 0x00ffffff);
        }
        write(png, offs+size-4, byte4(crc ^ -1));
      }

      crc32(this.buffer, this.ihdr_offs, this.ihdr_size);
      crc32(this.buffer, this.plte_offs, this.plte_size);
      crc32(this.buffer, this.trns_offs, this.trns_size);
      crc32(this.buffer, this.idat_offs, this.idat_size);
      crc32(this.buffer, this.iend_offs, this.iend_size);

      // convert PNG to string
      return "\211PNG\r\n\032\n"+this.buffer.join('');
    }
  }
})();
