var G = {
  'delayInit': [],
  'tabs':
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


chrome.runtime.sendMessage({type: 'loadPopup'}, function (info) {
  _currentTab = info.currentTab;
  Switcher.generate(info.tabs);
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
