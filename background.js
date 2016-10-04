// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

function customMailtoUrl() {
  if (window.localStorage == null)
    return "";
  if (window.localStorage.customMailtoUrl == null)
    return "";
  return window.localStorage.customMailtoUrl;
}

function executeMailto(tab_id, subject, body, selection) {
  var default_handler = customMailtoUrl().length == 0;

  var action_url = "mailto:?"
      if (subject.length > 0)
        action_url += "subject=" + encodeURIComponent(subject) + "&";

  if (body.length > 0) {
    action_url += "body=" + encodeURIComponent(body);

    // Append the current selection to the end of the text message.
    if (selection.length > 0) {
      action_url += encodeURIComponent("\n\n") +
          encodeURIComponent(selection);
    }
  }

  if (!default_handler) {
    // Custom URL's (such as opening mailto in Gmail tab) should have a
    // separate tab to avoid clobbering the page you are on.
    var custom_url = customMailtoUrl();
    action_url = custom_url.replace("%s", encodeURIComponent(action_url));
    console.log('Custom url: ' + action_url);
    chrome.tabs.create({ url: action_url });
  } else {
    // Plain vanilla mailto links open up in the same tab to prevent
    // blank tabs being left behind.
    console.log('Action url: ' + action_url);
    chrome.tabs.update(tab_id, { url: action_url });
  }
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
    if(info.basic_posts.length>0){
      info.post_quantity="Posts econtrados: "+info.basic_posts.length;
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