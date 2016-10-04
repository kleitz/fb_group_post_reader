// Copyright (c) 2009 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

//Get group
var group = 'https://www.facebook.com'+$('#fbProfileCover > div._5mo5._5t1f > div > div:nth-child(2) > h1 > a').attr('href');

var posts = [];

function Post() {
    this.description;
    this.user;
    this.profile;
    this.utime;    
    this.link;
    this.photo; //Research hoy to upload and get link
	this.date;
	this.time;
	this.id;
	this.url;
	this.group;

    this.set_date_and_time = function() {
    	if (this.utime != undefined && this.utime != null) {
    		
			// Create a new JavaScript Date object based on the timestamp
			// multiplied by 1000 so that the argument is in milliseconds, not seconds.
			this.date = new Date(this.utime*1000);
			// Hours part from the timestamp
			var hours = this.date.getHours();
			// Minutes part from the timestamp
			var minutes = "0" + this.date.getMinutes();
			// Seconds part from the timestamp
			var seconds = "0" + this.date.getSeconds();
			// Will display time in 10:30:23 format
			this.time = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);    		
    	}
    }

    this.set_url = function() {
    	this.url = group+'permalink/'+this.id;
    }
}

//Prepare DOM
$('span.see_more_link_inner').remove();


//Read POSTS
$('div._4-u2.mbm._5jmm._5pat._5v3q._4-u8').each(
	function(){
		
		var new_post = new Post();
		
		new_post.group = group;

		new_post.description = $(this).find('div._5pbx.userContent p').text();
		new_post.description = new_post.description.replace('...','.');
		new_post.description = new_post.description.replace('..','');
		
		new_post.id = $(this).attr('id').substr(10).slice(0,-4);

		//Search for user
		new_post.user = $(this).find('h5._5pbw._5vra span.fwn.fcg span.fwb.fcg a').text();

		//Search for user profile
		new_post.profile = $(this).find('h5._5pbw._5vra span.fwn.fcg span.fwb.fcg a').attr('href');
		
		new_post.photo = $(this).find('div._3x-2 div div.mtm div._5cq3 a').attr('href');

		//Search for link
		new_post.link = $(this).find('div._3x-2 div._6m3._--6 a').attr('href');
		if (new_post.link == undefined) {
			new_post.link = $(this).find('div._3x-2 div._3ekx._29_4 a').attr('href');			
		}
		
		//Search for utime
		new_post.utime  =  $(this).find('abbr._5ptz.timestamp.livetimestamp').attr('data-utime');
		if (new_post.utime == undefined) {
			new_post.utime  =  $(this).find('abbr._5ptz').attr('data-utime');			
		}
		new_post.set_date_and_time();
		new_post.set_url();

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
