function Commits(){
	
	this.selectedbranch = null;
	
	this.CommitsLink = function(commitsha, pageId){
		$('ul.commits > li[id="' + commitsha + '"] a.openfile').click(function(e){
			e.preventDefault();
			progressbar.show();
			var blobsha = $(this).attr('id');
			var fileName = $(this).attr('for');
			editor.openFile(login.username, login.accesskey, repo.selectedrepo, commits.selectedbranch, blobsha, fileName, 'commenter', commitsha);
		});
		
		$('ul.commits > li[id="' + commitsha + '"] a.browsecode').click(function(e){
			e.preventDefault();
			progressbar.show();
			var blobsha = $(this).attr('id');
			var fileName = $(this).attr('for');
			editor.openFile(login.username, login.accesskey, repo.selectedrepo, commits.selectedbranch, blobsha, fileName, 'commenter', commitsha);
		});
		
		$('ul.commits > li[id="' + commitsha + '"] > div > a.revert').click(function(e){
			e.preventDefault();
			progressbar.show(true);
			commits.revert(login.username, login.accesskey, repo.selectedrepo, commits.selectedbranch, commitsha, pageId);
		});
	};
	
	this.revert = function(username, accesskey, reponame, branch, sha, pageId){
		$. ajax({
			type: "POST",
        	url: rest.RevertUrl(username, accesskey, reponame, branch, sha),
        	contentType: "application/json",
        	dataType: 'text',
       		success: function (data) {
//       			alert("success");
       			messagebox.show('Rallback success', 2000, false);
       			repo.selectedbranch = commits.selectedbranch;
//       			repo.refresh(true, true);
//       			$.when(commits.refresh(pageId)).done(function(){repo.refresh(true, true);});
       			commits.refresh(pageId, true);
//       			progressbar.complete();
        	},
   	   		error: function(){
   	   			console.log("Error: cann't revert");
   	   			progressbar.complete();
   	   		}
		}); 
	};
	
	this.refresh = function(pageId, refreshrepo){
		var items = [];
		items.push('<a class="showbranchlist">branch: ' + commits.selectedbranch +'</a>');
		items.push('<ul class="branchselecter">');
		$.each(repo.branches, function(key, val) {
			items.push('<li id="' + val + '" class="branchitem">' + val + '</li>');
		});
		items.push('</ul>');
		items.push('<ul class="commits">');
		items.push('</ul>');
		
		var username = login.username;
		var accesskey = login.accesskey;
		var reponame = repo.selectedrepo;
		
		console.log(rest.HistoryFiles(username, accesskey, reponame, commits.selectedbranch));
		rest.abort(false);
		rest.callrest = $. ajax({
			type: "POST",
        	url: rest.HistoryFiles(username, accesskey, reponame, commits.selectedbranch),
        	contentType: "application/json",
        	dataType: 'json',
        	data: '{"path":""}',
            cache: false,
       		success: function (data) {
       			$('pages > page[id="' + pageId + '"]').html(items.join(''));
       			commits.branchlistlink(pageId);
       			var commitList = $('pages > page[id="' + pageId + '"]').find('ul.commits');
    			$.each(data, function(key, val) {
    				items = [];
    				items.push('<li id="' + val.sha + '"><div class="changes"><span>sha:</span><span class="displaysha">' + val.sha + 
    						'</span><a class="floatright revert" id="' + val.sha + '" href="#" name="' + val.sha + '">Rollback</a></div>');
    				
    				commits.getCommitContent(username, accesskey, reponame, val.sha, val.commiterId, pageId);
    				
    				items.push('</li>');
    				
    				commitList.append(items.join(''));
    			});
    			theme.heighlightpage(pageId);
    			//
    			if(refreshrepo === true){
    				repo.refresh(true, true);
    			}
    				
    			progressbar.complete();
        	},
   	   		error: function(){
   	   			console.log("Error: cann't load time line");
   	   		}
		}); 
	};
	
	this.branchlistlink = function(pageId){
		var page = $('pages > page[id="' + pageId + '"]');
		page.find('ul.branchselecter').hide();
		var status = 'close';
		
		page.find('a.showbranchlist').unbind('click').click(function(){
			if(status === 'close'){
				var pos = $(this).offset();
				page.find('ul.branchselecter').offset({left: pos.left-240});
				$(this).addClass('selectingbranch');
				page.find('ul.branchselecter').fadeIn(200);
				status = 'open';
			}else{
				$(this).removeClass('selectingbranch');
				page.find('ul.branchselecter').hide();
				status = 'close';
			}
		});
		
		page.find('a.showbranchlist').unbind('hover').hover(function(){
			messagebox.slideIn('Switch between branches');
		}, function(){
			messagebox.slideOut();
		});
		
		page.find('ul.branchselecter li').unbind('click').click(function(){
			var branchName = $(this).attr('id');
			commits.selectedbranch = branchName;
			progressbar.show(true);
			commits.refresh(pageId);
		});
	};
	
//	this.ordering = function(data){
//		
////		var items = null;
//		console.log('sorting');
//		
//		data.sort(function(a, b){
//			return Date.parse(a.commitTime) <= Date.parse(b.commitTime);
//		});
//		
//		data.sort(function(a, b){
//			return Date.parse(a.commitTime) <= Date.parse(b.commitTime);
//		});
//		
//		data.sort(function(a, b){
//			return Date.parse(a.commitTime) <= Date.parse(b.commitTime);
//		});
////		console.log(data.);
////		return data;
//		$.each(data, function(key, val){
//			console.log(Date.parse(val.commitTime));
//		});
//	};
	
	this.Page = function(username, accesskey, reponame){
		
		var items = [];
		commits.selectedbranch = 'master';
		items.push('<a class="showbranchlist">branch: ' + commits.selectedbranch +'</a>');
		items.push('<ul class="branchselecter">');
		$.each(repo.branches, function(key, val) {
			items.push('<li id="' + val + '" class="branchitem">' + val + '</li>');
		});
		items.push('</ul>');
		
		items.push('<ul class="commits">');
		items.push('</ul>');
		
		rest.abort(false);
		rest.callrest = $. ajax({
			type: "POST",
        	url: rest.HistoryFiles(username, accesskey, reponame, commits.selectedbranch),
        	contentType: "application/json",
        	dataType: 'json',
        	data: '{"path":""}',
            cache: false,
       		success: function (data) {
//       			console.log(data);
//       			commits.ordering(data);
       			var pageId = tabs.Insert("Timeline", items.join(''), false);
       			commits.branchlistlink(pageId);
       			var commitList = $('pages > page[id="' + pageId + '"]').find('ul.commits');
    			$.each(data, function(key, val) {
    				items = [];
//    				$.format.date(val.commitTime, "yyyy-MM-dd hh:mm:ss")
    				items.push('<li id="' + val.sha + '"><div class="changes"><span>sha:</span><span class="displaysha">' + val.sha + 
    						'</span><a class="floatright revert" id="' + val.sha + '" href="#" name="' + val.sha + '">Rollback</a></div>');
    				
    				commits.getCommitContent(username, accesskey, reponame, val.sha, val.commiterId, pageId);
    				
    				items.push('</li>');
    				
    				commitList.append(items.join(''));
    				
//    				commits.CommitsLink(val.sha);
    			});
    			
//    			tabs.Insert("Timeline", items.join(''), false);
//    			commits.CommitsLink(sha);
    			//
    			setTimeout(function(){complete();},1000);
//    			setTimeout(complete(), 10000);
    			
        	},
   	   		error: function(){
   	   			console.log("Error: cann't load time line");
   	   		}
		}); 
	};
	
	function complete(){
		tabs.SelectFirst();
		$('main').css('display', 'none').fadeIn('slow');
		progressbar.complete();
	}
	
	this.getCommitContent = function(username, accesskey, reponame, sha, author, pageId){
		var items = [];
		$. ajax({
			type: "GET",
        	url: rest.CommitContentUrl(username, accesskey, reponame, sha),
        	contentType: "application/json",
        	dataType: 'json',
            cache: false,
       		success: function (data) {
//       			console.log(data);
//       			console.log(data.length);
       			if(data.length === 0){
//    				console.log("empty:" + sha);
    				items.push('<div class="commititem">');
    				items.push('<img class="accountimage" src="images/gravatar-user-420.png" />');
    				items.push('<ul class="inlineblock">');
    				items.push('<li class="changes" style="width: ' + (theme.rightwidth - 160) + 'px;">');
    				items.push('<span class="commitoperation">No Changes</span>');
    				items.push('</li>');
    				items.push('<li class="commitmargin" style="width: ' + (theme.rightwidth - 160) + 'px;">');
    				items.push('<span class="author">Authored by</span><span class="authoredby">' + author + '</span>');
    				items.push('</li>');
    				items.push('</ul>');
    				items.push('</div>');
    			}else
	    			$.each(data, function(key, val) {
	    				var operation = null;
	    				if(val.content != undefined){
	    					operation = val.content.split('\n')[1].trim().charAt(0);
//	    					console.log(operation);
	    				}
		    			var path = val.filePath;
		    			var cuts = path.split('/');
		    			var fileName = cuts[cuts.length-1];
		    			var parent = cuts[cuts.length-2];
		    			if(fileName === '.gitignore'){
	//	    				$('li[id="' + sha + '"]').remove();
	//	    				$('li[id="' + sha + '"]').find('a.revert').unbind('click').hide();
		    				items.push('<div class="commititem">');
		    				items.push('<img class="accountimage" src="images/gravatar-user-420.png" />');
		    				items.push('<ul class="inlineblock">');
		    				items.push('<li class="changes" style="width: ' + (theme.rightwidth - 160) + 'px;">');
		    				items.push('<span class="commitoperation">' + (operation==='-'?'Delete':'Initial') + '</span>');
		    				items.push('<span class="commitoperation">' + parent + '</span>');
	//	    				items.push('<a class="openfile" id="' + val.sha + '" for="' + fileName + '" href="#">' + val.filePath + '</a>');
		    				items.push('</li>');
		    				items.push('<li class="commitmargin" style="width: ' + (theme.rightwidth - 160) + 'px;">');
		    				items.push('<span class="author">Authored by</span><span class="authoredby">' + author + '</span>');
	//	    				items.push('<a class="floatright browsecode" id="' + val.sha + '" for="' + fileName + '" href="#">Browse code</a>');
		    				items.push('</li>');
		    				items.push('</ul>');
		    				items.push('</div>');
		    			}else{
		    				items.push('<div class="commititem">');
		    				items.push('<img class="accountimage" src="images/gravatar-user-420.png" />');
		    				items.push('<ul class="inlineblock">');
		    				items.push('<li class="changes" style="width: ' + (theme.rightwidth - 160) + 'px;">');
		    				items.push('<span class="commitoperation">' + (operation==='-'?'Delete':'Update') + '</span>');
		    				items.push('<a class="openfile" id="' + val.sha + '" for="' + fileName + '" href="#">' + val.filePath + '</a>');
		    				items.push('</li>');
		    				items.push('<li class="commitmargin" style="width: ' + (theme.rightwidth - 160) + 'px;">');
		    				items.push('<span class="author">Authored by</span><span class="authoredby">' + author + '</span>');
		    				items.push('<a class="floatright browsecode" id="' + val.sha + '" for="' + fileName + '" href="#">Browse code</a>');
		    				items.push('</li>');
		    				items.push('</ul>');
		    				items.push('</div>');
		    			}
	    			});
    			$('li[id="' + sha + '"]').append(items.join(''));
    			$('li[id="' + sha + '"]').fadeIn('slow');
    			commits.CommitsLink(sha, pageId);
//    			$('main').height($(document).height());
       		},
   	   		error: function(){
   	   			console.log("Error: cann't load commit content");
   	   		}
		}); 
		
		return items;
	};
}

var commits = new Commits();