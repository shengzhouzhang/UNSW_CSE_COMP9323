var repo = (function Repo(){
	
	this.selectedrepo = null;
	this.uncommitjson = [];
	this.deleteUncommitFileList = [];
	this.path = [];
	
	var shas = [];
	var uncommitlist = null;
	var pageId = null;
	var PID = null;
	var rPID = null;
	var page = null;
	
	var getRepo = function(course, project){
		
		if(rPID !== null)
			taskManager.abort(rPID);
		rPID = taskManager.makeCall(
				taskManager.GET, 
				rest.RepoUrl(login.username, login.accesskey, course, project, group.selectedgroup),
				null, 
				getRepoCallback
		);
	};
	
	var getRepoCallback = function(data){
		repo.selectedrepo = data.repoName;
		branch.getBranches(login.username, login.accesskey, repo.selectedrepo);
	};
	
	var Page = function(){
		
		clearUpload();
		
		if(login.role === 'student')
			pageId = tabs.Insert("Files", '', false);
		else{
			pageId = tabs.Insert("Files", '', false);
		}
		page = $('pages > page[id="' + pageId + '"]');
		loadRoot();
	};
	
	var loadRoot = function(){
		
		repo.path = [];
		shas = [];
		console.log('repo.uncommitjson');
		console.log(repo.uncommitjson);
		repo.path.push('ROOT');
		saveUnCommitList();
		initial_page();
		
		if(PID !== null)
			taskManager.abort(PID);
		PID = taskManager.makeCall(
				taskManager.GET, 
				rest.FilesUrl(login.username, login.accesskey, repo.selectedrepo, branch.selectedbranch), 
				null, 
				PageCallBack
		); 
	};
	
	var PageCallBack = function(data){
		
		refresh(data);
		//
//		page.find('#navigationBar > li.commit').hide();
	};
	
	var initial_page = function(){
		page.html(progressbar.inPageProgressbar);
		if(tabs.current_page === 'tab0'){
			console.log('showPage');
			$(window).scrollTop(0);
			page.show();
		}		
	};
	
	//nav: left, filelist: right, else: null
	this.showType = null;
	
	var refresh = function(data){
		generateFileList(data);
		loadUnCommitList();
		codeLink();
		navigationLink();
		files.addFunction();
		uncommitlistlink();
		progressbar.inPageBarComplete(pageId);
		if(tabs.current_page === pageId){
			console.log(repo.showType);
			if(repo.showType === 'left')
				page.show("slide", { direction: "left" }, 'fast');
			else if(repo.showType === 'right')
				page.show("slide", { direction: "right" }, 'fast');
			else
				page.show();
		}else{
			tabs.highlight(pageId);
		}
		repo.showType = null;
	};
	
	var createFolder = function(path){
		taskManager.getText(
				taskManager.POST, 
				rest.CreateFolderUrl(login.username, login.accesskey, repo.selectedrepo, branch.selectedbranch),
				JSON.stringify({"path": path}), 
				folderCallback
		);
	};
	
	var folderCallback = function(){
		loadUnCommitList();
		loadRoot();
		commits.refresh();
//		progressbar.complete();
		messagebox.show("Folder has been created.", 2000);
	};
	
	var loadFolder = function(sha, newPath, newShas){
		
		saveUnCommitList();
		initial_page();
		
		taskManager.makeCall(
				taskManager.GET, 
				rest.OpenFolderUrl(login.username, login.accesskey, repo.selectedrepo, branch.selectedbranch, sha),
				null, 
				openFolderCallback,
				{"sha": sha, "newPath": newPath, "newShas": newShas}
		); 
	};
	
	var openFolderCallback = function(data, parameters){
		
		var sha = parameters.sha;
		var newPath = parameters.newPath;
		var newShas = parameters.newShas;
		shas.push(sha);
		if(newPath != undefined){
			repo.path = newPath;
		}
		if(newShas != undefined){
			shas = newShas;
		}
		refresh(data);
		//
		theme.heighlightpage(pageId);
	};
	
	var clearUpload = function(){
		repo.uncommitjson = [];
		repo.deleteUncommitFileList = [];
		$('ul.uncommitlist').html('');
		uncommitlist = null;
	};
	
	var saveUnCommitList = function(){
		
		uncommitlist = $('ul.uncommitlist > li');
		console.log(uncommitlist);
	};
	
	var loadUnCommitList = function(){
		$('ul.uncommitlist').html(uncommitlist);
		console.log(uncommitlist);
	};
	
	var generateFileList = function(data){
		
		var items = navigationBar();
		
		items.push('<ul class="uncommitlist">');
		items.push('</ul>');
		
		items.push('<table id="fileList" class="filelist_steven">');
		items.push('<tr class="headerCommon">');
		items.push('<th>Name</th><th>Type</th><th></th>');
		items.push('</tr>');
		// generate folders
		$.each(data, function(key, val) {
			if(val.type === 'tree'){
				var image=val.type;
				items.push('<tr id="file' + key +'">');
				items.push('<td>');
				items.push('<a type="'+val.type+'" for="' + val.name + '" id="'+val.sha+'">');
				items.push('<img src="images/' +image +'.png"/> '+ val.name+'');
				items.push('</a>');
				items.push('</td>');
				items.push('<td>folder</td>');
				items.push('<td><img class="deletebutton" src="images/delete.png"/></td>');
				items.push('</tr>');
			}
		});
		// generate files
		$.each(data, function(key, val) {
			if(val.type === 'blob'){
				var image=val.type;
				items.push('<tr id="file' + key +'">');
				items.push('<td>');
				items.push('<a type="'+val.type+'" for="' + val.name + '" id="'+val.sha+'">');
				items.push('<img src="images/' +image +'.png"/> '+ val.name+'');
				items.push('</a>');
				items.push('</td>');
				items.push('<td>file</td>');
				items.push('<td><img class="deletebutton" src="images/delete.png"/></td>');
				items.push('</tr>');
			}
		});
		items.push('</table>');
		
		page.append(items.join(''));
	};
	
	var generateNavBar = function(filePath){
		var paths = filePath.split('/');
		var items = [];
		items.push('<ul style="display: none;" id="navigationBar2">');
		items.push('<li class="navigation" for="0">' + repo.path[0] + '</li>');
		items.push('<li>/</li>');
		$.each(paths, function(key, path){
			items.push('<li class="navigation" for="1">' + path + '</li>');
			items.push('<li>/</li>');
		});
		items.push('<li class="navigationbutton">Back to Root</li>');
		items.push('</ul>');
		
		return items.join('');
	};
	
	var navigationBar = function(){
		var items = [];
		items.push('<div id="CreateFolderDiv" style="display:none">Create Folder</div>');
		items.push('<div id="UploadFiles" style="display:none">Upload Files</div>');
		items.push('<ul id="navigationBar">');
		$.each(repo.path, function(key, val) {
			if(key === 0){
				items.push('<li class="navigation" for="' + key + '">' + val + '</li>');
			}else{
				items.push('<li class="navigation" for="' + key + '" id="' + shas[key-1] + '">' + val + '</li>');
			}
			items.push('<li>/</li>');
		});
		
		items.push('<li title="Create a folder" class="createfolder navigationbutton" href="#CreateFolderDiv"><img src="images/addFolder.png"/></li>');
		items.push('<li title="Upload files" class="uploadcode navigationbutton" href="#UploadFiles"><img src="images/addDocument.png"/><input type="file" id="docsInput" multiple /></li>');
		items.push('</ul>');
		
		return items;
	};
	
	var navigationLink = function(){

		page.find('#navigationBar > li.navigation').click(function(){
			repo.showType = 'left';
			var obj=$(this);
			var sha = obj.attr("id");
			var position = obj.attr("for");
			var folderName = obj.html();
				page.hide("slide", { direction: "right"}, 'fast', function(){
//					$(this).show();
				if(folderName != '/'){
					if(folderName === "ROOT"){
						loadRoot();
					}else{
						var newPath = [];
						var newShas = [];
						$.each(repo.path, function(key, val) {
							if(key <= position){
								newPath.push(repo.path[key]);
								if(key > 0){
									newShas.push(shas[key-1]);
								}
							}
						});
						loadFolder(sha, newPath, newShas);
					}
				}
			});
		});
		
		
		page.find('#navigationBar > li.createfolder').click(function(){
			
			var items = [];
			items.push('<tr>');
			items.push('<td>');
			items.push('<div>');
			items.push('<img src="images/tree.png"/> ');
			items.push('<input class="createNewFolder" type="text" value="newfolder"></input>');
			items.push('</div>');
			items.push('</td>');
			items.push('<td>folder</td>');
			items.push('<td class="DeleteThisFileClass" href="#DeleteThisFileDiv"><img class="deletebutton" src="images/delete.png"/></td>');
			items.push('</tr>');
			page.find('#fileList').append(items.join(''));
			$('#fileList tr:last-child').effect("highlight", {color:"#FFFFCC"}, 1000);
			page.find('#fileList input.createNewFolder').keypress(function(event){
				if(event.which == 13){
//					progressbar.show(true);
					clearUpload();
					event.preventDefault();
					var folderName = $(this).val();
					
					var newPath = [];
					$.each(repo.path, function(key, val) {
						if(key != 0){
							newPath.push(repo.path[key]);
							newPath.push('/');
						}
					});
					newPath.push(folderName);
					createFolder(newPath.join(''));
					
					initial_page();
				}
			});
			
			$('#fileList tr:last-child img.deletebutton').unbind('click').show().click(function(event){
				page.find('#fileList input.createNewFolder').unbind('keypress');
				tooltips.hide();
				$('#fileList tr:last-child').remove();
				$('#fileList').effect("highlight", {color:"#FFFFCC"}, 1000);
			});
			$('#fileList tr:last-child img.deletebutton').unbind('hover').hover(function(){
				tooltips.show($(this), 'Cencel');
			}, function(){
				tooltips.hide();
			});
		});
	};
	
	var codeLink = function(){
		$("#fileList > tbody > tr > td > a").click(function(){
			//
			var obj=$(this);
			var sha = obj.attr("id");
			var fileName = obj.attr("for");
			var filePath = getPath2() + fileName;
			if(obj.attr("type") === "tree"){
				page.hide("slide", { direction: "left"}, 'fast', function(){
//					$(this).show();
					repo.showType = 'right';
//					page.show();
					var newPath = [];
					$.each(repo.path, function(key, val) {
						newPath.push(repo.path[key]);
					});
					newPath.push(fileName);
					loadFolder(sha, newPath);
				});
			}else if(obj.attr("type") === "blob"){
				page.hide("slide", { direction: "left"}, 'fast', function(){
					//
					editor.openFile(sha, filePath);
				});
			}
		});
		
		$("#fileList > tbody > tr:not(:first-child)").click(function(){
			//
			var obj = $(this);
			$("#fileList > tbody > tr").removeClass('selected').find('img.deletebutton').hide().unbind('click');
			$(this).addClass('selected');
			$(this).find('img.deletebutton').fadeIn('fast').click(function(){
				//
				var path = getPath() + obj.find('a').attr('for');
				var yes = confirm('Are you sure to delete ' + path + ' ?');
				if(yes === true){
					tooltips.hide();
					$(this).parents('tr').remove();
					$('#fileList').effect("highlight", {color:"#FFFFCC"}, 1000);
					deleteFile(login.username, login.accesskey, repo.selectedrepo, branch.selectedbranch, path, pageId);
				}
			});
			
			$(this).find('img.deletebutton').unbind('hover').hover(function(){
				//
				var itemname = obj.find('a').attr('for');
				tooltips.show($(this), 'Delete ' + itemname);
			}, function(){
				tooltips.hide();
			});
		});
	};
	
	
	
	var adduncommititem = function(item){
		$('ul.uncommitlist').append(item);
		uncommitlistlink();
	};
	
	var uncommitlistlink = function(){
		
		$('ul.uncommitlist span.uncommitfiletitleuploadall').unbind('click').click(function(){
			progressbar.show(true);
			var committinglist = [];
			$.each($('ul.uncommitlist > li'), function(key, val){
				if($(this).find('img.committed').length === 0 && key != 0){
					committinglist.push(repo.uncommitjson[$(this).index()-1]);
				}
			});
			clearUpload()
			tooltips.hide();
			commit(committinglist, -1);
		});
		
		$('ul.uncommitlist span.uncommitfiletitleuploadall').unbind('hover').hover(function(){
			tooltips.show($(this), 'Upload all Files from Upload List');
		}, function(){
			tooltips.hide();
		});
		
		$('ul.uncommitlist span.uncommitfiletitledeleteall').unbind('click').click(function(){
			uncommitlist='<ul class="uncommitlist"></ul>';
			clearUpload();
			tooltips.hide();
			$('ul.uncommitlist').slideUp('fast', function(){
				$(this).replaceWith(uncommitlist);
			});
			messagebox.show("Done", 1000, true);
		});
		
		$('ul.uncommitlist span.uncommitfiletitledeleteall').unbind('hover').hover(function(){
			tooltips.show($(this), 'Close Upload List');
		}, function(){
			tooltips.hide();
		});
		
		$('ul.uncommitlist').find('img.commit').unbind('click').click(function(){
			progressbar.show(true);
			var index = $(this).parent().index();
			console.log(repo.uncommitjson);
			var data = [{"filePath": repo.uncommitjson[index-1].filePath, "content": repo.uncommitjson[index-1].content}];
			tooltips.hide();
			commit(data, index);
		});
		$('ul.uncommitlist').find('img.uncommitfiletitledelete').unbind('click').click(function(){
			tooltips.hide();
			var index = $(this).parent().index();
			$(this).parent().remove();
			repo.uncommitjson.splice(index-1, 1);
			messagebox.show("Deleted.", 2000);
		});
	};
	

	
	var deleteuncommititem = function(){
		var tempId=$(this).attr(id);
		$(".uncommitlist li:eq("+tempId+")").remove();
		
		if(tempId!=-1){
			deleteUncommitFileList.push(tempId);
		}
	};
	
	var deleteFile = function(username, accesskey, reponame, branchname, filepath, pageId){
		rest.abort(false);
		rest.callrest = $. ajax({
			type: "DELETE",
        	url: rest.DeleteFileUrl(username, accesskey, reponame, branchname, filepath),
        	contentType: "application/json",
        	dataType: 'text',
       		success: function (data) {
       			messagebox.show("Delete " + filepath, 2000);
        	},
   	   		error: function(){
   	   			messagebox.show("failed to delete " + filepath, 2000, true);
   	   		}
		});
	};
	
	var getPath = function(){
		var items = [];
		$.each(repo.path, function(key, val) {
			if(key != 0){
				items.push(val);
				items.push('$$');
			}
//			currentfolder = key;
		});
		return items.join('');
	};
	
	var getPath2 = function(){
		var items = [];
		$.each(repo.path, function(key, val) {
			if(key != 0){
				items.push(val);
				items.push('/');
			}
		});
		return items.join('');
	};
	
	var commit = function(json, index){
		console.log(json);
		taskManager.getText(
				taskManager.POST, 
				rest.CommitUrl(login.username, login.accesskey, repo.selectedrepo, branch.selectedbranch),
				JSON.stringify(json), 
				commitCallback,
				{"index": index}
		); 
	};
	
	var commitCallback = function(data, parameters){
		progressbar.complete();
		markascommit(parameters.index);
		loadRoot();
		commits.refresh();
		messagebox.show("File uploaded.", 2000);
	};
	
	var markascommit = function(index){
		if(index === -1){
			$('ul.uncommitlist > li').find('img.commit').unbind('click').remove();
			$('ul.uncommitlist > li').find('img.uncommitfiletitledelete')
			.unbind('click').removeClass('uncommitfiletitledelete').addClass('committed').attr('src', 'images/ok.png').show();
		}else if(index === -2) {
//			progressbar.complete();
		}else{
			$('ul.uncommitlist > li:nth-child(' + (index+1) + ')').find('img.commit').unbind('click').remove();
			$('ul.uncommitlist > li:nth-child(' + (index+1) + ')').find('img.uncommitfiletitledelete')
			.unbind('click').removeClass('uncommitfiletitledelete').addClass('committed').attr('src', 'images/ok.png').show();
		}
	};
	
	return {
		getRepo: getRepo,
		loadRoot: loadRoot,
		Page: Page,
		generateNavBar: generateNavBar,
		commit: commit,
		clearUpload: clearUpload,
		adduncommititem: adduncommititem,
		uncommitlistlink: uncommitlistlink
	};
})();

