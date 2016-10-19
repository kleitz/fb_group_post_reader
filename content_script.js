//Get group
var group = 'https://www.facebook.com'+$('#fbProfileCover > div._5mo5._5t1f > div > div:nth-child(2) > h1 > a').attr('href');

var posts = [];

function Content() {
	this.description;
	this.link;
	this.photo; //Research hoy to upload and get link
	this.album = [];
}

function Post() {
    this.description;
    this.user;
    this.profile;
    this.utime;    
	this.date;
	this.time;
	this.id;
	this.url;
	this.group;	
	this.content;

    this.set_date_and_time = function() {
    	if (this.utime) {    		
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

$('span.see_more_link_inner').remove();

$('div._4-u2.mbm._5jmm._5pat._5v3q._4-u8').each(
	function(){
		
		var new_post = new Post();
		var new_content = new Content();

		new_post.group = group;

		new_post.description = $(this).find('div._5pbx.userContent p').text();
		new_post.description = new_post.description.replace('...','.');
		new_post.description = new_post.description.replace('..','');
		
		new_post.id = $(this).attr('id').substr(10).slice(0,-4);
		
		new_post.user = $(this).find('h5._5pbw._5vra span.fwn.fcg span.fwb.fcg a').text();

		new_post.profile = $(this).find('h5._5pbw._5vra span.fwn.fcg span.fwb.fcg a').attr('href');
		

		new_post.utime  =  $(this).find('abbr._5ptz.timestamp.livetimestamp').attr('data-utime');
		if (!new_post.utime) {
			new_post.utime  =  $(this).find('abbr._5ptz').attr('data-utime');
		}
		new_post.set_date_and_time();
		new_post.set_url();

		new_content.photo = $(this).find('div._3x-2 div div.mtm div._5cq3 a div img').attr('src');
		if (!new_content.photo) {
			new_content.photo = $(this).find('div._6m2 > div > div.lfloat._ohe > span > div._6ks > a > div > div > img').attr('src');
		}

		new_content.link = $(this).find('div._3x-2 div._6m3._--6 a').attr('href');
		if (!new_content.link) {
			new_content.link = $(this).find('div._3x-2 div._3ekx._29_4 a').attr('href');
		}
		
		$(this).find('div._3x-2 div div._5r69 div.mtm div div.mtm div._2a2q a div img').each(
			function() {
				new_content.album.push($(this).attr('src'));
			}
		);
		if (new_content.album.length == 0) {
			$(this).find('div._3x-2 > div > div.mtm > div._2a2q > a > div > img').each(
				function() {
					new_content.album.push($(this).attr('src'));
				}
			);
		}

		new_content.description = $(this).find('div._3x-2 > div > div._5r69 > div.mtm > div.mtm._5pcm > div.mtm._5pco > p').text();
		if (!new_content.description) {
			new_content.description = $(this).find('div > div.mtm div > div > div.lfloat._ohe > span > div._3ekx._29_4 > div > div._6m7._3bt9').text();
		}


		new_post.content = new_content;
		posts.push(new_post);
	}
);    

var additionalInfo = {
  "title": document.title,
  "selection": window.getSelection().toString(),
  "posts": posts
};

chrome.runtime.connect().postMessage(additionalInfo);
