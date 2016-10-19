// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

//Listen to the response of the content script
chrome.runtime.onConnect.addListener(function(port) {
  var tab = port.sender.tab;

  // This will get called by the content script we execute in
  // the tab as a result of the user pressing the browser action.
  port.onMessage.addListener(function(info) {
    
    var max_length = 1024;
    var posts_text="POSTS: ";

    if (info.selection.length > max_length)
      info.selection = info.selection.substring(0, max_length);
    if(info.posts) {
      info.post_quantity="Posts econtrados: "+info.posts.length;
      $.get("http://localhost/wordpress/", { json: "get_nonce", controller: "posts", method:"create_post" })
      .done(
        function( data ) {
          console.log(data);
          for (var i = 0; i < info.posts.length; i++) {
            $.get("http://localhost/wordpress/", { 
              controller: "posts", 
              method:"create_post",
              status: "publish",
              content: info.posts[i].description,
              title: info.posts[i].description.substring(0,15)+'...',
              nonce: data.nonce,
              json: "create_post"
            })
            .done(
              function(data) {
                console.log(data);
              }
            )
          }
        }
      );
    }
    else{
      info.post_quantity="Ningún post";
    }
    console.log(info.post_quantity);
    //executeMailto(tab.id, info.title, tab.url, posts_text);
  });
});

// If it is possible inject the content script if not send the email
// Called when the user clicks on the browser action icon.
chrome.browserAction.onClicked.addListener(function(tab) {  
  // We can only inject scripts to find the title on pages loaded with http
  // and https so for all other pages, we don't ask for the title.
  if (tab.url.indexOf("https://www.facebook.com/groups/") != -1) {
    //executeMailto(tab.id, "", tab.url, "");
    console.log("injecting content_script ");
    chrome.tabs.executeScript(null, {file: "content_script.js"});
  }  
});

chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete' && tab.active) {
    if(tab.url.indexOf("https://www.facebook.com/groups/") == -1){
      console.log("disabling extension");
      chrome.browserAction.disable(tab.id);
      //chrome.browserAction.setIcon({path: "note-grey.png"});
    }
  }
})