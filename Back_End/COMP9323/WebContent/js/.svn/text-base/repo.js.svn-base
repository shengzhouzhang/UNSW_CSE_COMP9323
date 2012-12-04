function Repo(){
	
	this.selectedrepo = null;
	this.selectedbranch = null;
	this.path = [];
	this.shas = [];
	this.branches = [];
	this.uncommitlist = [];
	this.uncommitjson = [];
	this.pageId = null;
	this.deleteUncommitFileList=[];
	
	this.getRepo = function(username, accesskey, course, project, group){
		rest.abort(false);
		rest.callrest = $. ajax({
			type: "GET",
        	url: rest.RepoUrl(username, accesskey, course, project, group),
        	contentType: "application/json",
        	dataType: 'json',
            cache: false,
       		success: function (data) {
       			console.log('getting repo');
       			console.log(data);
       			repo.selectedrepo = data.repoName;
       			console.log("got repo info: " + repo.selectedrepo);
       			repo.getBranches(username, accesskey, repo.selectedrepo);
        	},
   	   		error: function(){
   	   			console.log("Error: cann't get repo info.");
   	   			messagebox.show("failed to read ROOT.", 2000, true);
   	   		}
		}); 
		return repo.selectedrepo;
	};
	
	this.getBranches = function(username, accesskey, reponame){
		rest.abort(false);
		rest.callrest = $. ajax({
			type: "GET",
        	url: rest.BranchUrl(username, accesskey, reponame),
        	contentType: "application/json",
        	dataType: 'json',
            cache: false,
       		success: function (data) {
       			repo.branches = [];
       			$.each(data, function(key, val) {
       				repo.branches.push(val.branchId);
    				if(val.branchId === 'master'){
    					repo.selectedbranch = val.branchId;
    					console.log("get branches info: " + repo.selectedbranch);
    					repo.Page(username, accesskey, reponame, repo.selectedbranch);
    				}else{
      					//branchString.push("<option value='" + val.branchId + "'>" + val.branchId + "</option>");
      				}
    			});
        	},
   	   		error: function(){
   	   			console.log("Error: cann't get branch info.");
   	   			messagebox.show("failed to read branch list.", 2000, true);
   	   		}
		}); 
	};
	
	this.getHistoryFiles = function(username, accesskey, selectedrepo){
		var send = {"username": username, "accesskey": accesskey, "repo": selectedrepo};
		rest.abort(false);
		rest.callrest = $.create(rest.HistoryFiles(), send, function (data) {
			console.log("getting history files");
			console.log(data);
			$.each(data, function(key, val) {
				console.log(val.commiterId);
				console.log(val.sha);
			});
		});
	};
	
	this.browseCode = function(username, accesskey, repo, branch, sha){
		rest.abort(false);
		rest.callrest = $. ajax({
			type: "GET",
        	url: rest.CodeUrl(username, accesskey, repo, branch, sha),
        	contentType: "application/json",
        	dataType: 'text',
       		success: function (data) {
       			console.log("success");
       			console.log(data);
        	},
   	   		error: function(){
   	   			console.log("Error: cann't get code");
   	   			messagebox.show("failed to read code.", 2000, true);
   	   		}
		}); 
	};
	
	
	this.createBranch = function(username, accesskey, reponame, branchName, pageId){
		
		var send = JSON.stringify({'branchName': branchName});
		rest.abort(false);
		rest.callrest = $. ajax({
			type: "POST",
        	url: rest.CreateBranchUrl(username, accesskey, reponame),
        	contentType: "application/json",
        	dataType: 'text',
        	data: send,
       		success: function (data) {
       			repo.uncommitlist = '<ul class="uncommitlist"></ul>';
       			repo.refresh(true);
       			messagebox.show("Branch has been created.", 2000);
        	},
   	   		error: function(){
   	   			console.log("Error: cann't create branch");
   	   			messagebox.show("failed to create branch.", 2000, true);
   	   		}
		}); 
	};
	
	this.refresh = function(hideCommit, hiderepopage){
		repo.path = [];
		repo.shas = [];
		var pageId = repo.pageId;
		var page = $('pages > page[id="' + repo.pageId + '"]');
		rest.abort(false);
		rest.callrest = $. ajax({
				type: "GET",
	        	url: rest.FilesUrl(login.username, login.accesskey, repo.selectedrepo, repo.selectedbranch),
	        	contentType: "application/json",
	        	dataType: 'json',
	       		success: function (data) {
	       			console.log(rest.FilesUrl(login.username, login.accesskey, repo.selectedrepo, repo.selectedbranch));
	       			repo.path = [];
	       			repo.shas = [];
	       			repo.path.push('ROOT');
					repo.generateFileList(data, pageId);
					$('ul.uncommitlist').replaceWith(repo.uncommitlist);
					repo.codeLink(pageId);
					repo.navigationLink(pageId);
					files.addFunction();
					repo.uncommitlistlink();
					
					if(hideCommit === true)
						page.find('#navigationBar > li.commit').hide();
					
					$('html, body').scrollTop(0);
					$('main').height($(document).height());
					if(hiderepopage === false){
						theme.heighlightpage(repo.pageId);
						progressbar.complete();
					}else
						progressbar.complete();
	        	},
	   	   		error: function(){
	   	   			console.log("Error: cann't refresh page");
	   	   			messagebox.show("failed to read folder.", 2000, true);
	   	   			progressbar.complete();
		   	   		if(hideCommit === true)
						page.find('#navigationBar > li.commit').hide();
	   	   		}
			}); 
	};
	
	this.commit = function(username, accesskey, reponame, branch, json, index, fromfilelist){
		var send = JSON.stringify(json);
		console.log("commiting file");
		
		rest.abort(false);
		rest.callrest = $. ajax({
			type: "POST",
        	url: rest.CommitUrl(username, accesskey, reponame, branch),
        	contentType: "application/json",
        	dataType: 'text',
        	data: send,
       		success: function (data) {
       			if(fromfilelist === true){
       				repo.markascommit(index);
           			repo.refresh(true);
       			}else{
       				tabs.Remove(editor.refreshpageid);
       				progressbar.complete();
       			}
       			
       			messagebox.show("File uploaded.", 2000);
        	},
   	   		error: function(){
   	   			console.log("Error: cann't commit");
   	   			messagebox.show("failed to commit.", 2000, true);
	   	   		repo.refresh(true);
   	   		}
		}); 
	};
	
	this.markascommit = function(index){
		console.log(index);
		if(index === -1){
			$('ul.uncommitlist > li').find('img.commit').unbind('click').remove();
			$('ul.uncommitlist > li').find('img.uncommitfiletitledelete')
			.unbind('click').removeClass('uncommitfiletitledelete').addClass('committed').attr('src', 'images/ok.png').show();
		}else if(index === -2) {
			progressbar.complete();
		}else{
			$('ul.uncommitlist > li:nth-child(' + (index+1) + ')').find('img.commit').unbind('click').remove();
			$('ul.uncommitlist > li:nth-child(' + (index+1) + ')').find('img.uncommitfiletitledelete')
			.unbind('click').removeClass('uncommitfiletitledelete').addClass('committed').attr('src', 'images/ok.png').show();
		}
	};
	
	this.createFolder = function(username, accesskey, reponame, branch, path, pageId){
		var send = JSON.stringify({"path": path});
		console.log(send);
		rest.abort(false);
		rest.callrest = $. ajax({
			type: "POST",
        	url: rest.CreateFolderUrl(username, accesskey, reponame, branch),
        	contentType: "application/json",
        	dataType: 'text',
        	data: send,
       		success: function (data) {
       			repo.uncommitlist = $('ul.uncommitlist');
//       			if(repo.path.length === 1)
       			repo.refresh(false);
//       			else
//       				repo.openFolder(username, accesskey, reponame, branch, repo.shas[repo.path.length-2], pageId);
       			//
       			messagebox.show("Folder has been created.", 2000);
       			
        	},
   	   		error: function(){
   	   			console.log("Error: cann't create folder");
   	   			messagebox.show("failed to create folder.", 2000, true);
   	   			progressbar.complete();
   	   		}
		}); 
	};
	
	this.Page = function(username, accesskey, reponame, branch){
		rest.abort(false);
		rest.callrest = $. ajax({
			type: "GET",
        	url: rest.FilesUrl(username, accesskey, reponame, branch),
        	contentType: "application/json",
        	dataType: 'json',
       		success: function (data) {
       			console.log(data);
       			repo.path = [];
       			repo.shas = [];
       			repo.uncommitjson = [];
       			repo.path.push('ROOT');
       			var pageId;
       			if(login.role === 'student')
       				pageId = tabs.Insert("Code", '', false);
       			else{
       				pageId = tabs.Insert(group.selectedgroupname, '', true);
       			}
				repo.pageId = pageId;
				repo.generateFileList(data, pageId);
				repo.codeLink(pageId);
				repo.navigationLink(pageId);
				files.addFunction();
				//
				var page = $('pages > page[id="' + pageId + '"]');
				page.find('#navigationBar > li.commit').hide();
				
				//
//				$('main').css('display', 'none').fadeIn('slow');
//    			progressbar.complete();
				//
				if(login.role === 'student')
					commits.Page(username, accesskey, reponame);
				else
					progressbar.complete();
        	},
   	   		error: function(){
   	   			console.log("Error: cann't get files");
   	   			messagebox.show("failed to read file list.", 2000, true);
   	   		}
		}); 
	};
	
	this.navigationBar = function(){
		var items = [];
		items.push('<div id="CreateFolderDiv" style="display:none">Create Folder</div>');
		items.push('<div id="UploadFiles" style="display:none">Upload Files</div>');
		items.push('<ul id="navigationBar">');
		$.each(repo.path, function(key, val) {
			if(key === 0){
				items.push('<li class="navigation" for="' + key + '">' + val + '</li>');
			}else{
				items.push('<li class="navigation" for="' + key + '" id="' + repo.shas[key-1] + '">' + val + '</li>');
			}
			items.push('<li>/</li>');
		});
		items.push('<li title="Create or switch branches" class="branches navigationbutton"><span>branch: </span><span>' + repo.selectedbranch + '</span></li>');
		items.push('<li title="Create a folder" class="createfolder navigationbutton" href="#CreateFolderDiv"><img src="images/addFolder.png"/></li>');
		items.push('<li title="Upload files" class="uploadcode navigationbutton" href="#UploadFiles"><img src="images/addDocument.png"/><input type="file" id="docsInput" multiple /></li>');
		items.push('</ul>');
		
		items.push('<ul id="branchlist">');
		$.each(repo.branches, function(key, val) {
			items.push('<li id="' + val + '" class="branchitem">' + val + '</li>');
		});
		items.push('<li class="createbranch"><input type="text" name="newbranch" value="Create new branch"></input></li>');
		items.push('</ul>');
		return items;
	};
	
	this.navigationLink = function(pageId){
		var page = $('pages > page[id="' + pageId + '"]');
		page.find('#navigationBar > li.navigation').click(function(){
			//
			progressbar.show(false);
			
			var obj=$(this);
			var sha = obj.attr("id");
			var position = obj.attr("for");
			var folderName = obj.html();
			if(folderName != '/'){
				if(folderName === "ROOT"){
					repo.uncommitlist = $('ul.uncommitlist');
					repo.refresh(false);
				}else{
					var newPath = [];
					var newShas = [];
					$.each(repo.path, function(key, val) {
						if(key <= position){
							newPath.push(repo.path[key]);
							if(key > 0){
								newShas.push(repo.shas[key-1]);
							}
						}
					});
					repo.openFolder(login.username, login.accesskey, repo.selectedrepo, repo.selectedbranch, sha, pageId, newPath, newShas);
				}
			}
		});
		page.find('#branchlist').hide();
		var status = 'close';
		
		page.find('#navigationBar > li.branches').unbind('click').click(function(){
			if(status === 'close'){
				var pos = $(this).offset();
				page.find('#branchlist').offset({left: pos.left-250});
				$(this).addClass('selected');
				page.find('#branchlist').fadeIn(200);
				console.log(page.find('#branchlist'));
				page.find('#branchlist > li > input').val('newbranch');
				status = 'open';
			}else{
				$(this).removeClass('selected');
				page.find('#branchlist').hide();
				status = 'close';
			}
		});
		
		page.find('#navigationBar > li.branches').unbind('hover').hover(function(){
			messagebox.slideIn('Switch between branches');
		}, function(){
			messagebox.slideOut();
		});
		
		page.find('#branchlist > li.branchitem').click(function(){
			var branchName = $(this).attr('id');
			repo.selectedbranch = branchName;
			progressbar.show(true);
			repo.uncommitlist = '<ul class="uncommitlist"></ul>';
			repo.refresh(false);
		});
		
		page.find('#branchlist > li.createbranch > input').keypress(function(event){
			if(event.which == 13){
				event.preventDefault();
				var branchName = $(this).val();
				progressbar.show(true);
				repo.createBranch(login.username, login.accesskey, repo.selectedrepo, branchName, pageId);
			}
		});
		
		page.find('#branchlist > li.createbranch > input').unbind('hover').hover(function(event){
			messagebox.slideIn('Create a new branch');
		}, function(){
			messagebox.slideOut();
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
					progressbar.show(true);
					event.preventDefault();
					var folderName = $(this).val();
					var path = [];
					$.each(repo.path, function(key, val) {
						if(key != 0){
							path.push(val);
							path.push('/');
						}
					});
					path.push(folderName);
					repo.createFolder(login.username, login.accesskey, repo.selectedrepo, repo.selectedbranch, path.join(''), pageId);
				}
			});
			
			$('#fileList tr:last-child img.deletebutton').unbind('click').show().click(function(event){
				page.find('#fileList input.createNewFolder').unbind('keypress');
				$('#fileList tr:last-child').remove();
				$('#fileList').effect("highlight", {color:"#FFFFCC"}, 1000);
			});
			$('#fileList tr:last-child img.deletebutton').unbind('hover').hover(function(){
				messagebox.slideIn('Cancel');
			}, function(){
				messagebox.slideOut();
			});
		});
	};
	
	this.codeLink = function(pageId){
		$("#fileList > tbody > tr > td > a").click(function(){
			//
			
			
			var obj=$(this);
			var sha = obj.attr("id");
			var fileName = obj.attr("for");
			if(obj.attr("type") === "tree"){
				progressbar.show(false);
				var newPath = [];
				
				$.each(repo.path, function(key, val) {
					newPath.push(repo.path[key]);
				});
				newPath.push(fileName);
				
				repo.openFolder(login.username, login.accesskey, repo.selectedrepo, repo.selectedbranch, sha, pageId, newPath);
			}else if(obj.attr("type") === "blob"){
				progressbar.show(true);
				editor.openFile(login.username, login.accesskey, repo.selectedrepo, repo.selectedbranch, sha, fileName, 'writer');
			}
		});
		
		$("#fileList > tbody > tr:not(:first-child)").click(function(){
			//
			var obj = $(this);
			$("#fileList > tbody > tr").removeClass('selected').find('img.deletebutton').hide().unbind('click');
			$(this).addClass('selected');
			$(this).find('img.deletebutton').fadeIn('fast').click(function(){
				//
				progressbar.show(true);
				var path = repo.getPath() + obj.find('a').attr('for');
				console.log(path);
				repo.deleteFile(login.username, login.accesskey, repo.selectedrepo, repo.selectedbranch, path, pageId);
			});
			
			$(this).find('img.deletebutton').unbind('hover').hover(function(){
				//
				var itemname = obj.find('a').attr('for');
				messagebox.slideIn('Delete ' + itemname);
			}, function(){
				messagebox.slideOut();
			});
		});
	};
	
	this.openFolder = function(username, accesskey, reponame, branch, sha, pageId, newPath, newShas){
		repo.uncommitlist = $('ul.uncommitlist');
		rest.abort(false);
		rest.callrest = $. ajax({
			type: "GET",
        	url: rest.OpenFolderUrl(username, accesskey, reponame, branch, sha),
        	contentType: "application/json",
        	dataType: 'json',
       		success: function (data) {
       			repo.shas.push(sha);
       			if(newPath != undefined){
       				repo.path = newPath;
       			}
       			if(newShas != undefined){
       				repo.shas = newShas;
       				console.log(newShas);
       			}
       			repo.generateFileList(data, pageId);
       			$('ul.uncommitlist').replaceWith(repo.uncommitlist);
       			repo.codeLink(pageId);
       			repo.navigationLink(pageId);
       			repo.uncommitlistlink();
       			files.addFunction();
       			
       			progressbar.complete();
       			//
       			$('main').height($(document).height());
       			theme.heighlightpage(pageId);
        	},
   	   		error: function(){
   	   			console.log("Error: cann't open folder");
   	   			messagebox.show("failed to open folder.", 2000, true);
   	   		}
		}); 
	};
	
	this.adduncommititem = function(item){
		$('ul.uncommitlist').append(item);
		repo.uncommitlistlink();
	};
	
	this.uncommitlistlink = function(){
		
		$('ul.uncommitlist span.uncommitfiletitleuploadall').unbind('click').click(function(){
			progressbar.show(true);
			var committinglist = [];
			$.each($('ul.uncommitlist > li'), function(key, val){
				if($(this).find('img.committed').length === 0 && key != 0){
					committinglist.push(repo.uncommitjson[$(this).index()-1]);
				}
			});
			repo.uncommitlist = $('ul.uncommitlist');
			console.log('committinglist');
			console.log(committinglist);
			repo.uncommitjson = [];
			repo.commit(login.username, login.accesskey, repo.selectedrepo, repo.selectedbranch, committinglist, -1, true);
		});
		
		$('ul.uncommitlist span.uncommitfiletitledeleteall').unbind('click').click(function(){
			repo.uncommitlist='<ul class="uncommitlist"></ul>';
			repo.uncommitjson=[];
			$('ul.uncommitlist').slideUp('fast', function(){
				$(this).replaceWith(repo.uncommitlist);
			});
			messagebox.show("Canceled.", 1000, true);
		});
		$('ul.uncommitlist').find('img.commit').unbind('click').click(function(){
			progressbar.show(true);
			var index = $(this).parent().index();
			var data = [{"filePath": repo.uncommitjson[index-1].filePath, "content": repo.uncommitjson[index-1].content}];
			repo.uncommitlist = $('ul.uncommitlist');
			repo.commit(login.username, login.accesskey, repo.selectedrepo, repo.selectedbranch, data, index, true);
		});
		$('ul.uncommitlist').find('img.uncommitfiletitledelete').unbind('click').click(function(){
			var index = $(this).parent().index();
			$(this).parent().remove();
			repo.uncommitjson.splice(index-1, 1);
			messagebox.show("Deleted.", 2000);
		});
	};
	

	
	this.deleteuncommititem=function(){
		var tempId=$(this).attr(id);
		$(".uncommitlist li:eq("+tempId+")").remove();
		
		if(tempId!=-1){
			repo.deleteUncommitFileList.push(tempId);
		}
	};
	
	
	
	this.generateFileList = function(data, pageId){
		var items = repo.navigationBar();
		
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
		
		
		
		
		var page = $('pages > page[id="' + pageId + '"]');
		page.html(items.join(''));
	};
	
	
	
	
	this.deleteFile = function(username, accesskey, reponame, branchname, filepath, pageId){
		console.log(rest.DeleteFileUrl(username, accesskey, reponame, branchname, filepath));
		rest.abort(false);
		rest.callrest = $. ajax({
			type: "DELETE",
        	url: rest.DeleteFileUrl(username, accesskey, reponame, branchname, filepath),
        	contentType: "application/json",
        	dataType: 'text',
       		success: function (data) {
       			repo.uncommitlist = $('ul.uncommitlist');
//       			repo.refresh(false);
//       			if(repo.path.length === 1){
       				repo.refresh(false);
//       			}else{
//       				repo.openFolder(username, accesskey, reponame, branchname, repo.shas[repo.currentfolder-2], pageId);
//       			}
       			messagebox.show("Deleted.", 2000);
        	},
   	   		error: function(){
   	   			console.log("Error: cann't delete file");
   	   			progressbar.complete();
   	   			messagebox.show("failed to delete file.", 2000, true);
   	   			
   	   		}
		});
	};
	
	this.getPath = function(){
		var items = [];
		$.each(repo.path, function(key, val) {
			if(key != 0){
				items.push(val);
				items.push('$$');
			}
//			repo.currentfolder = key;
		});
		return items.join('');
	};
	
}

var repo = new Repo();