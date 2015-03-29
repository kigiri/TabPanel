/*******************************************************************************
 * Listen for favicons injection
 ******************************************************************************/
(function () {
  var faviconInserted = false;
  chrome.runtime.onMessage.addListener(function (dataUrl, req, callback) {
    if (faviconInserted) { return; }
    var icon = document.createElement("link");
    icon.rel = "shortcut icon";
    icon.type = "image/png";
    icon.href = dataUrl;
    document.head.appendChild(icon);
    faviconInserted = true;
  });
})();
