/**
* This is the javascript class to manage Comments of users;
*
* @class Branch
*/
function Comments(){
	
	/**
	* The method to create comment.
	*
	* @method getBranches
	* @param {String} username user account
	* @param {String} accesskey a authorized token obtain from back-end
	* @param {String} reponame the name of repository  to be located
	* @param {String} branch the name of branch to be located
	* @param {String} sha the sha of commits to be located
	* @param {String} row the row number of to be located
	* @param {String} filePath the path of file to be located
	* @param {String} pageId the id of page to be located
	* 
	*/
	this.makeComment = function(username, accesskey, reponame, branch, sha, content, row, filePath, pageId){
		
		var send = JSON.stringify({"commentContent": content, "commenterId": username, "commentPosition": row, "commentPath": filePath});
		
		$. ajax({
			type: "POST",
        	url: rest.CommentUrl(username, accesskey, reponame, branch, sha),
        	contentType: "application/json",
        	dataType: 'text',
        	data: send,
       		success: function (data) {
       			messagebox.show('Comment success.', 2000, false);
       			var page = $('pages > page[id="' + pageId + '"]');
       			comments.getCommentList(username, accesskey, reponame, sha, filePath, page.find('pre').height(), pageId);
        	},
   	   		error: function(){
   	   			messagebox.show('Comment Error.', 2000, true);
   	   		}
		}); 
	};
	
	this.getCommentNum = function(username, accesskey, reponame, commitsha, filePath){
		$. ajax({
			type: "GET",
        	url: rest.CommentListUrl(username, accesskey, reponame, commitsha),
        	contentType: "application/json",
        	dataType: 'json',
       		success: function (data) {
       			var num_of_comments = 0;
       			$.each(data, function(key, val){
       				console.log(val.commentPath + ' filePath: ' + filePath);
       				if(val.commentPath === filePath){
       					num_of_comments++;
       				}
       			});
       			//
       			if(num_of_comments !== 0){
       				$('ul.commits > li[id="' + commitsha + '"] span.viewchanges[path="' + filePath + '"]').css('width', 130).prepend('<span class="numOfComments">' + num_of_comments + '</span>');
       			}
       		}
		});
	};
	
	this.getCommentList = function(username, accesskey, reponame, sha, filePath, editorheight, pageId){
		var item = [];
		
		$. ajax({
			type: "GET",
        	url: rest.CommentListUrl(username, accesskey, reponame, sha),
        	contentType: "application/json",
        	dataType: 'json',
       		success: function (data) {
       			console.log("getting comment");
       			console.log(data);
       			item.push('<ul class="comments">');
       			$.each(data, function(key, val){
       				console.log(val.commentPath + ' filePath: ' + filePath);
       				if(val.commentPath === filePath){
       					item.push('<li>');
       					item.push('<div class="header">');
       					item.push('<span class="author">' + val.commiterId + '</span>');
       					item.push('<span>commented on</span>');
       					item.push('<span class="file">' + val.commentPath + '</span>');
       					item.push(val.commentPosition != 0 ? '<span class="row">#' + val.commentPosition + "</span>" : "");
       					
       					var datetime = new Date(val.commentDate);
       					item.push('<span class="date">' + datetime.toLocaleDateString() + '</span>');
       					item.push('</div>');
       					item.push('<p>' + val.commentContent + '</p>');
       					item.push('</li>');
       				}
       			});
       			item.push('<li></li>');
       			item.push('</ul>');
       			$('page[id="' + pageId + '"] ul.comments').remove();
       			tabs.append(pageId, item.join(''), editorheight+75);
        	},
   	   		error: function(){
   	   			item.push('<ul class="comments">');
	   	   		item.push('<li></li>');
	   			item.push('</ul>');
	   			$('page[id="' + pageId + '"] ul.comments').remove();
       			tabs.append(pageId, item.join(''), editorheight+75);
   	   			console.log("Error: cann't get comment list");
   	   		},
   	   		complete: function(){
	   			progressbar.complete();
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