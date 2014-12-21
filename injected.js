(function () {
  var
    _elem = {}, // Store all generated dom elements
    _tabs = [], // All tabs, no shit
    _opts = {}, // Extension options
    _idx = -1, // Selected idx
    _mod = 'AltKey';

  function init() {
    chrome.runtime.sendMessage({ type: 'loadOpts' }, function (opts) {
      _opts = opts;
    });
    chrome.runtime.onMessage.addListener(function (command) {
      console.log(command);
      if (command === "switch_between_tabs") {
        if (_idx === -1) {
          showPanel();
        } else {
          hidePanel();
        }
      }
    });
    // chrome.runtime.onMessage.addListener(function (command) {
    //   console.log(command);
    // });
  }


  function handleFaviconLoadfailure(event) {
    event.target.offsetParent.className += ' not-found';
    event.target.remove();
  }

  function createTabIcon(tab) {
    if (tab.favIcon) { return; }
    tab.favIcon = true;
    var favIcon = document.createElement('div');
    favIcon.className = 'tab-panel__fav-icon';
    if (tab.favIconUrl) {
      var img = document.createElement('img');
      // img.src = tab.favIconUrl.match(/\/\/.+$/);
      img.addEventListener("error", handleFaviconLoadfailure);
      favIcon.appendChild(img);
    } else {
      favIcon.className += ' tab-panel__not-found';
    }
    _elem.panel.appendChild(favIcon);
  }

  function generateSelection() {
    var selection = document.createElement('div');
    _elem.id = 'tab-panel__selection';
    _elem.selection = selection;
    setSelected(0);
  }

  function generateTabList(tabs) {
    _tabs = tabs;
    for (var i = 0; i < tabs.length; i++) {
      createTabIcon(_tabs[i]);
    }
  }

  function detectModRelease() {
    var e = window.event;
    if (!e) { return; }
    console.log(e, _mod);
    if (!e[_mod]) {
      hidePanel();
    }
  }

  function generatePanel() {
    var div = document.createElement('div');
    div.id = 'tab-panel__panel';
    div.appendChild(document.createElement('h3'));
    document.body.appendChild(div);
    div.addEventListener('keyup', detectModRelease);
    div.addEventListener('keydown', handleKeys);
    return div;
  }

  function showPanel() {
    _elem.panel = (_elem.panel || generatePanel());
    chrome.runtime.sendMessage({ type: 'loadTabs' }, generateTabList);
    _elem.panel.style.display = 'initial';
    _elem.panel.focus();
    window.addEventListener('click', handleClick);
  }

  function hidePanel() {
    if (!_elem.panel) { return; }
    _elem.panel.style.display = 'none';
    window.removeEventListener('click', handleClick);
  }

  function handleClick() {
    var t = window.event.target; 
    while (t) {
      if (t.id === 'tab-panel__panel') { return; }
      t = t.parentElement;
    }
    hidePanel();
  }

  function setSelected(newIdx) {
    // Avoid getting out the range of our tabs
    _idx = Math.max(Math.min(newIdx, _tabs.length - 1), 0);
    var count = tabs.length;
    var x = _idx % 10;
    var y = ~~(_idx / 10);
    _elem.selection.style.top = x * 32 + 'px';
    _elem.selection.style.left = y * 32 + 'px';
  }

  var keyMethods = {
    13: function () { // Enter
      // selectTab
    },
    37: function () { // Left arrow
      setSelected(_idx - 1);
    },
    38: function () { // Up arrow
      setSelected(_idx - 10);
    },
    39: function () { // Right arrow
      setSelected(_idx + 1);
    },
    40: function () { // Down arrow
      setSelected(_idx + 10);
    },
    87: function () { // W
      // close mouseover tab
    },
    default: function() {}
  };

  function handleKeys() {
    var e = window.event;
    if (!e) { return; }
    (keyMethods[e.keyCode] || keyMethods.default)();
  }

  init();
})();
