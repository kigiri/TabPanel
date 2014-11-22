// Cached Globals and Aliases
var _tabs = [];
var _elem = document.all;

// Activate focus on popup opening
_elem.search.focus();

function loadTabs(tabs) {
  _tabs = tabs;
  _tabs.forEach(genTab);
}

// generate and append tab button
function genTab(tab, idx) {
  var title = document.createElement('h3');
  title.innerHTML = tab.title;

  var url = document.createElement('span');
  url.innerHTML = tab.url;

  var favIcon = document.createElement('div');
  favIcon.className = 'fav-icon';
  favIcon.style.backgroundImage = "url('" + tab.favIconUrl + "')";

  var button = document.createElement('button');
  button.id = 'tab-' + idx + 1;
  console.log(tab);
  button.appendChild(favIcon);
  button.appendChild(title);
  button.appendChild(url);
  _elem.list.appendChild(button);
}

// Empty query to retrive all tabs
chrome.tabs.query({}, loadTabs);


