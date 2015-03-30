/*******************************************************************************
 * Listen for favicons injection
 ******************************************************************************/
(function () {
  var faviconInserted = true;
  function getFavicon() {
    var links = document.getElementsByTagName('link');
    var regexp = /(^| )icon( |$)/i;

    for (var i = 0; i < links.length; i++) {
        var link = links[i];
        if (regexp.test(links[i].rel)) {
          return links[i].href;
        }
    }
    return null;
  }

  chrome.runtime.onMessage.addListener(function (dataUrl, req, callback) {
    if (faviconInserted) { return; }
    var icon = document.createElement("link");
    icon.rel = "shortcut icon";
    icon.type = "image/png";
    icon.href = dataUrl;
    document.head.appendChild(icon);
    faviconInserted = true;
  });

  if (getFavicon()) {
    faviconInserted = true;
  }
})();
