chrome.runtime.sendMessage({type: 'hookWindow'}, null, function (mod) {
  console.log(mod);
  function link() {
    // if (key < 19 && key > 15) { we should send message only if the mod was released but sometimes it's not triggered qq
    if (!window.event[mod]) {
      chrome.runtime.sendMessage({type: 'modkeyUp'});
    }
  }
  document.addEventListener('keyup', link); // should be enough but isn't
  document.addEventListener('keydown', link);
  document.addEventListener('click', link);
});

var __tabPanelSwitcher, _tabs = [], _idx = 0;

function generatePanel() {
  var div = document.createElement('div');
  div.style = {
    width: '200px',
    height: '200px',
    backgroundColor: 'black',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    zIndex: 99999
  }
  div.dataset.generated = 1;
  // I use this to easly identify elems i have generated
  // I know it's a bit lazy, deal with it :P
  document.body.appendChild(div);
  div.addEventListener('keyup', detectModRelease);
  div.addEventListener('keydown', handleKeys);
  generateTabList(div);
  return div;
}

function showSwitcher() {
  __tabPanelSwitcher = (__tabPanelSwitcher || generatePanel());
  __tabPanelSwitcher.style.display = 'initial';
  __tabPanelSwitcher.focus();
  window.addEventListener('click', handleClick);
}

function hideSwitcher() {
  if (!__tabPanelSwitcher) { return; }
  __tabPanelSwitcher.style.display = 'none';
  window.removeEventListener('click', handleClick);
}

function handleClick() {
  if (!window.event.target.dataset.generated) {
    hideSwitcher();
  }
}

function setSelected(newIdx) {
  // Avoid getting out the range of our tabs
  newIdx = Math.max(Math.min(newIdx, _tabs.length - 1), 0);
  if (newIdx === _idx) { return; } // Could do a small animation here
  _tabs[_idx].style.border = '';
  _tabs[_idx].style.backgroundColor = '';
  _idx = newIdx;
  _tabs[_idx].style.border = '1px solid #333';
  _tabs[_idx].style.backgroundColor = '#333';
}

var keyMethods = {
  37: function () { // Left arrow
    setSelected(_currentIdx - 1);
  },
  38: function () { // Up arrow
    setSelected(_currentIdx - 10);
  },
  39: function () { // Right arrow
    setSelected(_currentIdx + 1);
  },
  40: function () { // Down arrow
    setSelected(_currentIdx + 10);
  },

};

function handleKeys() {
  var e = window.event;
  if (!e) { return; }
  (keyMethods[e.keyCode] || function () {})();
}
