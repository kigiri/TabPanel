var G = {
  'delayInit': [],
  'opts': {},
};


/*******************************************************************************
 * Switcher panel
 ******************************************************************************/

(function () {
  var list = document.getElementById('list');

  function generateButton(tab, idx) {
    var button = document.createElement('button');
    button.id = 'tab-' + idx;
    button.tab = tab;
    list.appendChild(button);
  }

  function handleFaviconLoadfailure(event) {
    event.target.offsetParent.className += ' not-found';
    event.target.remove();
  }

  function generateFavIcon(button, iconInfo) {
    var favIcon = document.createElement('div');
    favIcon.className = 'fav-icon';
    if (typeof iconInfo === 'object') {
      var img = document.createElement('img');
      img.className = iconInfo.type;
      img.src = iconInfo.data;
      img.addEventListener("error", handleFaviconLoadfailure);
      favIcon.appendChild(img);
    } else {
      favIcon.className += ' not-found';
    }
    button.appendChild(favIcon);
  }

  window.Switcher = {
    loadFavIcons: function (favIcons) {
      var buttons = list.childNodes;
      for (var i = 0; i < buttons.length; i++) {
        generateFavIcon(buttons[i], favIcons[buttons[i].tab.favIconUrl]);
      }
    },
    generate: function (tabs) {
      for (var i = 0; i < tabs.length; i++) {
        generateButton(tabs[i], i);
      };
    },

  };
})();


/*******************************************************************************
 * Handle Keyboard events
 ******************************************************************************/

// Watch for the mod release
window.addEventListener('keyup', function (e) {
  if (!e[G.opts.mod]) {
    window.close();
  }
});


window.addEventListener('keydown', function (e) {
  console.log('keydown', e);
});


/*******************************************************************************
 * Handle Click events
 ******************************************************************************/

G.delayInit.push(function () {
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

G.delayInit.push(function () {
  chrome.runtime.sendMessage({ type: 'loadFavIcons' }, Switcher.loadFavIcons);
});

/*******************************************************************************
 * Init
 ******************************************************************************/

// To make the popup open faster, i delayed part of the initilisation.
setTimeout(function() {
  for (var i = 0; i < G.delayInit.length; i++) {
    G.delayInit[i]();
  }
}, 75);
