var commits = (function Commits(){
	
	var pageId = null;
	var PID = null;
	var pageLimits = 12;
	var rPID = null;
	
	var commitsData = null;
	var index = 0;
	var num_of_left = 0;
	var num_of_loaded = 0;
	
	var CommitsLink = function(commitsha, committime){
		
		var commitli = $('ul.commits > li[id="' + commitsha + '"]');
		var commititem = commitli.find('div.commititem');
		
		commititem.find('a.openfile').click(function(e){
			e.preventDefault();
			var blobsha = $(this).attr('id');
			var fileName = $(this).attr('for');
			editor.openFile(blobsha, fileName, committime);
		});
		
		commititem.find('a.browsecode').click(function(e){
			e.preventDefault();
			var blobsha = $(this).attr('id');
			var fileName = $(this).attr('for');
			editor.openFile(blobsha, fileName, committime);
		});
		
		commitli.find('a.revert').unbind('click').click(function(e){
			e.preventDefault();
			//progressbar.show(true);
			tooltips.hide();
			InitialPage();
			revert(login.username, login.accesskey, repo.selectedrepo, branch.selectedbranch, commitsha);
		
		});
		
		commitli.find('a.revert').unbind('hover').hover(function(e){
			tooltips.show($(this), 'Rollback to Version ' + commitsha);
		}, function(){
			tooltips.hide();
		});
		
		commititem.unbind('hover').hover(function(e){
			$(this).find('span.viewchanges').stop(true, true).animate({
				"background-color": '#E7E86D',
				"border-color": "#E7E86D",
			  }, 600);
			$(this).find('a.browsecode').stop(true, true).animate({
				"color": '#4183C4',
			  }, 600);
			$(this).find('span.numOfComments').stop(true, true).css("border-color", "#F6FAFC");
		}, function(e){
			$(this).find('span.viewchanges').stop(true, true).css("background-color", "#EFF6F9")
			.css("border-color", "#CEDEE5");
			$(this).find('a.browsecode').stop(true, true).css("color", "#999");
			$(this).find('span.numOfComments').stop(true, true)
			.css("border-color", "#CEDEE5");
		});
		
		commititem.find('span.viewchanges').unbind('hover').hover(function(e){
			$(this).stop(true, true).animate({
				"background-color": '#EFF6F9',
			  }, 'slow');
			$(this).find('span.numOfComments').stop(true, true)
			.css("border-color", "#CEDEE5");
		}, function(e){
			$(this).stop(true, true).css("background-color", "#E7E86D");
			$(this).find('span.numOfComments').stop(true, true).css("border-color", "#F6FAFC");
		});
		
		commititem.find('span.viewchanges').unbind('click').click(function(e){
			e.preventDefault();
			var blobsha = $(this).attr('id');
			var filePath = $(this).attr('path');
			editor.openChanges(login.username, login.accesskey, repo.selectedrepo, commitsha, filePath, blobsha, branch.selectedbranch, committime);
		});
	};
	
	var revert = function(username, accesskey, reponame, branch, commitsha){
		if(rPID !== null)
			taskManager.abort(rPID);
		rPID = taskManager.getText(
				taskManager.POST, 
				rest.RevertUrl(username, accesskey, reponame, branch, commitsha),
				null, 
				revertCallback
		);
	};
	
	var revertCallback = function(){
		messagebox.show('Rollback success', 2000, false);
		repo.loadRoot();
		refresh();
	};
	
	/*
	 *  Page and refresh methods 
	 */
	this.Page = function(){
		pageId = tabs.Insert("Timeline", '', false);
		refresh();
	};
	
	this.refresh = function(){
		InitialPage();
		if(PID !== null)
			taskManager.abort(PID);
		PID = taskManager.makeCall(
				taskManager.POST, 
				rest.HistoryFiles(login.username, login.accesskey, repo.selectedrepo, branch.selectedbranch),
				'{"path":""}', 
				getCommits
		); 
	};
	
	var getCommits = function(data){
		commitsData = data;
		generateCommitList();
	};
	
	var InitialPage = function(){
		$(window).scrollTop(0);
		var page = $('pages > page[id="' + pageId + '"]');
		page.html(progressbar.inPageProgressbar);
		var items = [];
		items.push('<ul class="commits">');
		items.push('</ul>');
		page.prepend(items.join(''));
		commitsData = null;
		index = 0;
		num_of_left = 0;
		num_of_loaded = 0;
	};
	
	var generateCommitList = function(){
		
		loading = true;
		var commitUl = $('pages > page[id="' + pageId + '"]').find('ul.commits');
		
		num_of_left = commitsData.length - index;
		num_of_loaded = 0;
		
		var num_of_load = pageLimits<num_of_left?pageLimits:num_of_left;
		
		for(var i = index; i < commitsData.length && num_of_load > 0; i++){

			var datetime = new Date(commitsData[i].commitTime);
			
			if(i === 0)
				generateCommitLi(commitUl, commitsData[i].sha, datetime.toLocaleDateString(), commitsData[i].commiterId, false);
			else
				generateCommitLi(commitUl, commitsData[i].sha, datetime.toLocaleDateString(), commitsData[i].commiterId, true);
			
//			if(i === commitsData.length-1){
//				finishLoad();
//			}
			num_of_load--;
			index++;
		}
	};
	
	var generateCommitLi = function(commitUl, commitsha, datatime, committer, displayRollback){
		var items = [];
		items.push('<li id="' + commitsha + '">');
		items.push('<div class="changes">');
		items.push('<span class="version">Version:</span>');
		items.push('<span class="commitdate">' + datatime + '</span>');
		if(displayRollback === true)
			items.push('<a class="floatright revert" id="' + commitsha + '" href="#" name="' + commitsha + '">Rollback</a>');
		items.push('</div>');
		items.push('</li>');
		commitUl.append(items.join(''));
		getCommitContent(commitsha, committer, datatime);
	};
	
	var commitItem = function(isEmpty, type, filesha, fileName, filePath, committer, op){
		var items = [];
		items.push('<div class="commititem">');
		items.push('<img class="accountimage" src="headers/' + committer + '.jpeg" onerror="imgError(this);" />');
		items.push('<ul class="inlineblock" >');
//		items.push('<li class="changes" style="width: ' + (theme.rightwidth - 160) + 'px;">');
		items.push('<li class="changes" >');
		if(isEmpty === true){
			items.push('<span class="commitoperation">No Changes</span>');
		}
		else if(type === 'file'){
			items.push('<span class="commitoperation">' + (op==='-'?'Remove':'Update') + '</span>');
			items.push('<a class="openfile" id="' + filesha + '" for="' + fileName + '" href="#">' + filePath + '</a>');
			items.push('<span class="viewchanges" id="' + filesha + '" path="' + filePath + '" >' + 'View Changes</span>');
		}else if(type === 'folder')	{
			items.push('<span class="commitoperation">' + (op==='-'?'Delete Folder':'Create Folder') + '</span>');
			var path = filePath.split('/');
			path.pop();
			items.push('<span class="commitoperation">' + path.join('/') + '</span>');
		}
		items.push('</li>');
//		items.push('<li class="commitmargin" style="width: ' + (theme.rightwidth - 160) + 'px;">');
		items.push('<li class="commitmargin" >');
		items.push('<span class="author">Authored by</span><span class="authoredby">' + committer + '</span>');
		if(isEmpty === false && type === 'file')
			items.push('<a class="floatright browsecode" id="' + filesha + '" for="' + filePath + '" href="#">Browse code</a>');
		items.push('</li>');
		items.push('</ul>');
		items.push('</div>');
		return items.join('');
	};
	
	
	var getCommitContent = function(commitsha, committer, committime){
		$. ajax({
			type: taskManager.GET,
        	url: rest.CommitContentUrl(login.username, login.accesskey, repo.selectedrepo, commitsha),
       		success: function (response) {
       			
       			if(response.length === 0){
       				$('li[id="' + commitsha + '"]').append(
       						commitItem(true)
   					);
       			}else{
       				$.each(response, function(key, data) {
//       					console.log(data);
       					if(data.content !== undefined){
	       					var op = data.content.split('\n')[1].trim().charAt(0);
	       					var fileName = data.filePath.split('/').pop();
	       					var type = fileName==='.gitignore'?'folder':'file';
	       					$('li[id="' + commitsha + '"]').append(
	       							commitItem(false, type, data.sha, fileName, data.filePath, committer, op)
	       					);
	       					if(type === 'file')
			    				comments.getCommentNum(login.username, login.accesskey, repo.selectedrepo, commitsha, data.filePath);
       					}
       				});
       			}
       		},
   	   		complete: function(){
   	   			setWidth();
   	   			CommitsLink(commitsha, committime);
   	   			loadItem();
   	   		}
		}); 
	};
	
	var setWidth = function(){
		$('ul.inlineblock').each(function(){
			var w = $('page[id="tab1"]').width()*0.93;
//			console.log(w-75);
			$('ul.inlineblock').width(w-85);
		});
	};
	
	
	var loadingwhenscroll = function(){
		$(window).unbind('scroll').scroll(function(){
			if($(window).scrollTop() == $(document).height() - $(window).height() && loadMore()){
				console.log('loading commits');
				progressbar.inPageBarShow(pageId);
				generateCommitList();
		    }
		});
	};
	
	var loading = false;
	
	var loadMore = function(){
		if(num_of_left > 0 && loading === false && tabs.current_page === pageId)
			return true;
		else
			return false;
	};
	
	var loadItem = function(){
		num_of_loaded++;
//		console.log(num_of_left);
		if(num_of_loaded === pageLimits || num_of_left <= pageLimits){
			finishLoad();
			loading = false;
			if(num_of_left > pageLimits){
				loadingwhenscroll();
			}else{
				$(window).unbind('scroll');
			}
		}
	};
	
	var finishLoad = function(){
		progressbar.inPageBarComplete(pageId);
		$('pages > page[id="' + pageId + '"] ul.commits > li').fadeIn('slow');
		if(tabs.current_page !== pageId){
			tabs.highlight(pageId);
		}
	};
	
	return {
		Page: Page,
		refresh: refresh
	};
})();

