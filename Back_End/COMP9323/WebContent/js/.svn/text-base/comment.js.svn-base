function Comments(){
	
	this.accesskey = $.cookie("accesskey");
	
	this.url = 'jsons/comment.json';
	
	this.makeComment = function(username, accesskey, repo, branch, sha, content, row, file){
		
		var send = JSON.stringify({"commentContent": content, "commenterId": username, "commentPosition": row, "commentPath": file});
		
		console.log(send);
		console.log(sha);
		
		$. ajax({
			type: "POST",
        	url: rest.CommentUrl(username, accesskey, repo, branch, sha),
        	contentType: "application/json",
        	dataType: 'text',
        	data: send,
       		success: function (data) {
       			messagebox.show('Comment success.', 2000, false);
        	},
   	   		error: function(){
   	   			console.log("Error: cann't make comment");
   	   		}
		}); 
	};
	
	this.getCommentList = function(username, accesskey, reponame, sha){
		$. ajax({
			type: "GET",
        	url: rest.CommentListUrl(username, accesskey, reponame, sha),
        	contentType: "application/json",
        	dataType: 'json',
       		success: function (data) {
       			console.log("getting comment");
       			console.log(data);
        	},
   	   		error: function(){
   	   			console.log("Error: cann't get comment list");
   	   		}
		}); 
	};
	
	this.writer = function(id){
		var items = [];
		items.push('<writer id="' + id + '">');
		items.push('<textarea>');
		items.push('</textarea>');
		items.push('</writer>');
		return items.join('');
	};
	
	this.List = function(){
		var items = [];
		items.push('<ul class="comments">');
		
//		var send = {"accesskey": comments.accesskey};
//		$.read(this.url, send, function (data) {
			var json = '{"name": "file1","sha": "e1234","comments": [{"type": "file","comment": "There is a comment for this file.","author": "szha246","date": "2012-01-01 12:30:15"},{"type": "inline","row": 5,"comment": "There is a comment.","author": "szha246","date": "2012-01-01 12:30:15"},{"type": "inline","row": 10,"comment": "There is an other comment.","author": "szha246","date": "2012-01-01 12:30:15"}]}';
			var data = jQuery.parseJSON(json);
			var fileName = data.name;
			$.each(data.comments, function(key, val) {
				items.push('<li><div class="header"><span class="author">' + val.author + 
						'</span><span>commented on</span><span class="file">' + fileName + '</span>' +
						(val.type === "inline" ? '<span class="row">#' + val.row + "</span>" : "") + 
						'<span class="date">' + val.date + '</span></div>');
				items.push('<p>' + val.comment + '</p></li>');
			});
//		});
		items.push('</ul>');
		//console.log(items.join(''));
		return items.join('');
	};
	
	this.Page = function(){
		
		var items = [];
		items.push('<ul class="comments">');
		
		var send = {"accesskey": comments.accesskey};
		$.read(this.url, send, function (data) {
			//var json = '{"name": "file1","sha": "e1234","comments": [{"type": "file","comment": "There is a comment for this file.","author": "szha246","date": "2012-01-01 12:30:15"},{"type": "inline","row": 5,"comment": "There is a comment.","author": "szha246","date": "2012-01-01 12:30:15"},{"type": "inline","row": 10,"comment": "There is an other comment.","author": "szha246","date": "2012-01-01 12:30:15"}]}';
			//var data = jQuery.parseJSON(json);
			var repoName = data.repo;
			$.each(data.comments, function(key, val) {
				items.push('<li><div class="header"><span class="author">' + val.author + 
						'</span><span>commented on</span><span class="file">' + repoName + '</span>' + 
						'<span class="date">' + val.date + '</span></div>');
				items.push('<p>' + val.comment + '</p></li>');
			});
			items.push('</ul>');
			tabs.Insert("Comments", items.join(''), false);
			tabs.SelectFirst();
		});
	};
	
	
	this.bind = function(pageId, editor){
		var margin = 87;
		var items = $('pages > page[id="' + pageId + '"] ul.comments span.row');
		items.click(function(e) {
			var row = $(this).html().slice(1);
			var gutter = $('pages > page[id="' + pageId + '"] pre > div.ace_gutter > div.ace_gutter-layer > div.ace_gutter-cell :eq(' + (row-1) + ')');
			$('html, body').scrollTop(gutter.offset().top-margin);
			editor.gotoLine(row, 0, false);
		});
		
		items.hover(function(e) {
			items.append();
		});

	};
}

var comments = new Comments();