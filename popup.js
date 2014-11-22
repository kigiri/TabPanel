// Cached Globals and Aliases
var _tabs = [];
var _elem = document.all;
var _append = function (elem) {
  _elem.list.appendChild(elem);
};


// Activate focus on popup opening
_elem.search.focus();

function loadTabs(tabs) {
  _tabs = tabs;
  console.log(tabs);
}


chrome.tabs.query({}, function (tabs) {
  _tabs = tabs;
  console.log('_tabs', _tabs);

  _tabs.forEach(function (tab, idx) {
    console.log(tab.url + ' - ' + idx);
    var title = document.createElement('h3');
    title.innerHTML = tab.title;
    var url = document.createElement('span');
    url.innerHTML = tab.url;
    var favIcon = document.createElement('div');
    favIcon.className  = 'fav-icon';
    favIcon.style.backgroundImage = "url('" + tab.favIconUrl + "')";

    var button = document.createElement('button');
    button.id = 'tab-' + idx + 1;
    console.log(tab);
    button.appendChild(favIcon);
    button.appendChild(title);
    button.appendChild(url);
    _append(button);
  });
});

