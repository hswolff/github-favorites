// $('ul.pagehead-actions .watch-button-container').after('<li><a class="minibutton"><span>Favorite</span></a></li>');

var li = document.createElement('li');
li.setAttribute('class', 'favorite');
var a = document.createElement('a');
a.setAttribute('class', 'minibutton');
var span = document.createElement('span');
var text = document.createTextNode('Favorite');

var params = {
  'url': document.location.href,
  'title': document.title
};
var bookmark = false;

li.onclick = function() {
  var toggle_params = params;
  toggle_params.query = 'toggle';
  if (bookmark) {
    toggle_params.id = bookmark.id;
  } else {
    toggle_params.id = false;
  }
  chrome.extension.sendRequest(toggle_params, function(response) {
    if (response.is_favorite) {
      bookmark = response.bookmark;
      document.getElementsByClassName('favorite')[0].firstChild.firstChild.innerText = 'Favorited!';
    } else {
      bookmark = false;
      document.getElementsByClassName('favorite')[0].firstChild.firstChild.innerText = 'Favorite';
    }
  });
};

// Is this page a favorite?
var is_favorite_params = params;
is_favorite_params.query = 'isFavorite';
chrome.extension.sendRequest(is_favorite_params, function(response) {
  if (response.is_favorite) {
    text.nodeValue = "Favorited!";
    bookmark = response.bookmark;
  }
  li.appendChild(a).appendChild(span).appendChild(text);
  // Insert Favorite button into DOM
  var watch = document.getElementsByClassName('watch-button-container')[0];
  var parentNode = watch.parentElement;
  parentNode.insertBefore(li, watch);
});