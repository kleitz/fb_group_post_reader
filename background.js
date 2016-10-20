// Copyright (c) 2016 Equipos & Sistemas. All rights reserved.

function getDataUri(post, url, callback) {
    var image = new Image();

    image.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
        canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size

        canvas.getContext('2d').drawImage(this, 0, 0);

        // Get raw image data
        callback(canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''), post);

        // ... or get as Data URI
        //callback(canvas.toDataURL('image/png'));
    };
    image.src = url;
}

// function sendToWordpress(post) {
  
// }

//Listen to the response of the content script
chrome.runtime.onConnect.addListener(function(port) {
  var tab = port.sender.tab;  
  // This will get called by the content script we execute in the tab as a result of the user pressing the browser action.
  port.onMessage.addListener(function(info) {
    if(info.posts) {
      $.get("http://localhost/wordpress/", { json: "get_nonce", controller: "posts", method:"create_post" })
      .done(
        function(data) {            
          //Promise
          var convertImages = new Promise(function(resolve, reject) {
            for (var i = 0; i < info.posts.length; i++) {
              //do a thing, possibly async, then…              
              if (info.posts[i].content.album.length>0) {
                for (var j = 0; j < info.posts[i].content.album.length; j++) {
                  var post=info.posts[i];
                  getDataUri(post ,info.posts[i].content.album[j],
                    function(img, post) {                        
                      post.content.images.push(img);
                      //console.log('images processed in '+ i + '/' + info.posts.length + ' posts');
                    }
                  );
                }
              }
            }
            
            if (i==info.posts.length) {
              resolve(info.posts);
            }
          });
          convertImages.then(
            function(posts){
              console.log('waiting 3 seconds');
              setTimeout(function(){
                //do what you need here
                for (var i = 0; i < posts.length; i++) {                  
                  console.log(posts[i].content);
                  // $.post("http://localhost/wordpress/", {
                  //   //async: false,
                  //   controller: "core", 
                  //   method:"ux_publish_post",
                  //   post_status: "publish",
                  //   post_content: posts[i].description,
                  //   post_title: posts[i].description.substring(0,15)+'...',
                  //   nonce: data.nonce,
                  //   json: "ux_publish_post",
                  //   //post_images: JSON.stringify(posts[i].content.images),
                  //   images_quantity: posts[i].content.images.length
                  // })
                  // .done(
                  //   function(data) {
                  //     console.log('Post sent to wordpress');
                  //   }
                  // )
                }
              }, 3000);
            },
            function(){
              console.log('error');
            }
          );
        }
      );
    }
    else {
      info.post_quantity="Ningún post econtrado";
    }
  });
});

// Called when the user clicks on the browser action icon.
chrome.browserAction.onClicked.addListener(function(tab) {  
  // We only inject scripts to Facebook groups
  if (tab.url.indexOf("https://www.facebook.com/groups/") != -1) {    
    console.log("injecting content_script ");
    chrome.tabs.executeScript(null, {file: "content_script.js"});
  }  
});
// Called when the user change active tab
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete' && tab.active) {
    if(tab.url.indexOf("https://www.facebook.com/groups/") == -1){
      console.log("disabling extension");
      chrome.browserAction.disable(tab.id);
    }
  }
})