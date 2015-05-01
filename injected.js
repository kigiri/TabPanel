/*******************************************************************************
 * Listen for favicons injection
 ******************************************************************************/
(function () {
  var faviconState = 'loading';
  var links = document.getElementsByTagName("link");
  var domainFaviconUrl = window.location.origin + '/favicon.ico';
  var storedDataUrl = null;
  var icon;
  var regexp = /(^| )icon( |$)/i;

  function testUrl(url, success, fallback) {
    console.log('testing for', url);
    faviconState = 'checking';
    var img = new Image();
    img.src = url;
    img.onerror = img.onabort = fallback;
    img.onload = success;
  }

  function testDomain() {
    testUrl(domainFaviconUrl, function () {
      faviconState = 'loaded';
      icon.href = domainFaviconUrl;
    }, function () {
      faviconState = 'failed';
      if (storedDataUrl) {
        icon.href = storedDataUrl;
        icon.type = "image/png";
      }
    });
  }

  var favIconFound = false;
  for (var i = 0; i < links.length; i++) {
    if (regexp.test(links[i].rel)) {
      favIconFound = true;
      icon = links[i];
      if (icon.href === domainFaviconUrl) {
        testDomain();
      } else {
        testUrl(icon.href, function () {
          faviconState = 'loaded';
        }, testDomain);
      }
      break;
    }
  }
  if (!favIconFound) {
    icon = document.createElement("link");
    icon.rel = "shortcut icon";
    icon.type = "image/x-icon";
    document.head.appendChild(icon);
    testDomain();
  }

  chrome.runtime.onMessage.addListener(function (dataUrl, req, callback) {
    console.log(icon, faviconState);
    if (faviconState !== 'loaded') {
      if (faviconState === 'failed') {
        icon.href = dataUrl;
        icon.type = "image/png";
      } else {
        storedDataUrl = dataUrl;
      }
    }
  });
})();
