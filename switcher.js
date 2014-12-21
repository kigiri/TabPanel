var G = {
  'delayInit': [],
  'opts': {},
};


/*******************************************************************************
 * Switcher panel
 ******************************************************************************/
(function () {
  function cleanup() {

  }

  window.Switcher = {
    refresh: function () {
      cleanup();
      this.generate();
    },
    generate: function () {

    },

  };
})();

/*******************************************************************************
 * Handle Keyboard events
 ******************************************************************************/

// Watch for the mod release
window.addEventListener('keyup', function (e) {

});


window.addEventListener('keydown', function (e) {

});


/*******************************************************************************
 * Handle Click events
 ******************************************************************************/

_delayInit.push(function () {
  window.addEventListener('click', function (e) {
    var elem = e.target;
    if (elem.tagName !== "BUTTON") {
      elem = elem.offsetParent;
      if (elem.tagName !== "BUTTON") { return; }
    }
    var idx = elem.dataset.index;
    setActive(idx);
    openActiveTab();
  });
});

chrome.runtime.sendMessage({ type: 'loadSwitcher' }, function (info) {
  G.opts = info.opts;
  G.currentTab = info.currentTab;
  Switcher.generate(info.tabs);
});

_delayInit.push(function () {
  chrome.runtime.sendMessage({ type: 'loadFavIcons' }, function (favIcons) {
    _favIcons = favIcons;
    addFavicons();
  });
});

/*******************************************************************************
 * Init
 ******************************************************************************/

// To make the popup open faster, i delayed part of the initilisation.
setTimeout(function() {
  for (var i = 0; i < _delayInit.length; i++) {
    _delayInit[i]();
  }
}, 75);
