var favorites_folder = false;

chrome.bookmarks.getSubTree('2', function(bookmarks){
  // Check we have bookmarks
  if (bookmarks.length === 1) {
    var other_bookmarks, b;
    // Get reference to 'Other Bookmarks' folder
    // Aka the non-bookmarks bar folder
    other_bookmarks = bookmarks[0];
    // Find 'GitHub Favorites' folder
    for (b in other_bookmarks.children) {
      if (other_bookmarks.children[b].title === 'GitHub Favorites') {
        favorites_folder = other_bookmarks.children[b];
      }
    }
    // Create folder if it doesn't exist
    if (!favorites_folder) {
      chrome.bookmarks.create({
        'parentId': other_bookmarks.id,
        'title': 'GitHub Favorites'
      }, function(new_bookmark) {
        favorites_folder = new_bookmark;
      });
    }
  }
});



chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    
    if (request.query === 'isFavorite') {
      // Find if current tab is already favorited
      chrome.bookmarks.search(request.url, function(bookmarks) {
        var is_favorite = false, bookmark = false, parent_folder_title = false;
        // If the array's greater than 0 than it's a bookmark
        if (bookmarks.length) {
          is_favorite = true;
          // For now just send back the first result
          bookmark = bookmarks[0];
        }
        function isFavoriteResponse(parent_folder_title) {
          sendResponse({
            is_favorite: is_favorite,
            bookmark: bookmark,
            parent_folder_title: parent_folder_title ? parent_folder_title[0].title : parent_folder_title
          });
        }
        if (is_favorite) {
          chrome.bookmarks.get(bookmark.parentId, isFavoriteResponse);
        } else {
          isFavoriteResponse();
        }
      });
    }

    if (request.query === 'toggle') {
      // If we have an id we are removing bookmark
      if (request.id) {
        chrome.bookmarks.remove(request.id, function() {
          sendResponse({
            is_favorite: false
          });
        });
      } else {
        chrome.bookmarks.create({
          'parentId': favorites_folder.id,
          'title': request.title,
          'url': request.url
        }, function(bookmark) {
          sendResponse({
            is_favorite: true,
            bookmark: bookmark,
            parent_folder_title: favorites_folder.title
          });
        });
      }
    }

  }
);

/*
chrome.bookmarks.onChanged.addListener(function(id, changeInfo) {
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.sendRequest(tab.id, {greeting: "hello"}, function(response) {
      console.log('bookmarks.onChanged', id, changeInfo);
    });
  });
});
*/