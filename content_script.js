// Copyright (c) 2009 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


var posts = [];

function post(_description, _user, _url, _timestamp, _datetime) {
    this.description = _description;
    this.user = _user;
    this.url = _url;
    this.timestamp = _timestamp;
    this.datetime = _datetime;
}

$('span.see_more_link_inner').remove();
$('div._1dwg._1w_m').each(
	function(){
		var new_post = new post();
		new_post.description=$(this).find('div._5pbx.userContent p').text();
		new_post.description=new_post.description.replace('...','.');
		new_post.description=new_post.description.replace('..','');
		
		new_post.user=$(this).find('h5._5pbw._5vra span span a').text();
		new_post.url=$(this).find('h5._5pbw._5vra span span a').attr('href');
		
		new_post.datetime = $(this).find('abbr._5ptz.timestamp.livetimestamp').attr('title');
		new_post.timestamp = $(this).find('abbr._5ptz.timestamp.livetimestamp').attr('data-utime');

		posts.push(new_post);
	}
);    

var additionalInfo = {
  "title": document.title,
  "selection": window.getSelection().toString(),
  "posts": posts
};

console.log(posts);

chrome.runtime.connect().postMessage(additionalInfo);
