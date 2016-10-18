// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

function toDataUrl(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  xhr.onload = function() {
    var reader = new FileReader();
    reader.onloadend = function() {
      callback(reader.result);
    }
    reader.readAsDataURL(xhr.response);
  };
  xhr.open('GET', url);
  xhr.send();
}

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
            var img="";
            
            toDataUrl('http://equiposysistemas.com.ar/web/wp-content/uploads/2016/04/Admin-Hotel.jpg', function(base64Img) {
              img=base64Img;              
            });
            
            $.get("http://localhost/wordpress/", { 
              controller: "core", 
              method:"ux_publish_post",
              post_status: "publish",
              post_content: info.posts[i].description,
              post_title: info.posts[i].description.substring(0,15)+'...',
              nonce: data.nonce,
              json: "ux_publish_post",
              post_image_attachment: img
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