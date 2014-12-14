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
