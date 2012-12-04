var editor = (function Editor(){
	
	var line_height = 16;
	
	var htmlHeader = function(committime, type){
		var items = [];
		var padding = 20;
		var mainWidth = $('main').width()-padding;
		console.log(mainWidth);
		items.push('<editorheader style="display: none; width: ' + (mainWidth-46) + 'px;" >');
		items.push('<status>Status</status>');
		items.push('<rows></rows>');
		if(committime !== undefined)
			items.push('<span class="version">' + committime + '</span>');
		else
			items.push('<span class="version">current version</span>');
		items.push('<span class="branch">branch: ' + branch.selectedbranch + '</span>');
		items.push('<ul>');
//		items.push('<li class="goback">Back</li>');
		if(type === 'changes'){
			items.push('<li class="highlight"><input type="checkbox" name="highlight" > highlight changes</li>');
			items.push('<li class="comment">Write Comment</li>');
		}
		else if(type === 'file')
			items.push('<li class="commit">Commit</li>');
		items.push('</ul>');
		items.push('</editorheader>');
		return items.join('');
	};
	
	var htmlContent = function(content){
		var items = [];
		items.push('<pre style="display: none; width: ' + ($('main').width()-46) + 'px;">');
		items.push(content);
		items.push('</pre>');
		return items.join('');
	};
	
	var setFileType = function(aceEditor, fileName){
		console.log(fileName);
		var fileString = '' + fileName;
		console.log(fileString);
		var cuts = fileString.split('.');
		var fileEnding = cuts[cuts.length-1];
		console.log(fileEnding);
		switch(fileEnding){
		case 'java':
			aceEditor.getSession().setMode("ace/mode/java");
			console.log("ace/mode/java");
			break;
		case 'js':
			aceEditor.getSession().setMode("ace/mode/javascript");
			break;
		case 'css':
			aceEditor.getSession().setMode("ace/mode/css");
			break;
		case 'html':
			aceEditor.getSession().setMode("ace/mode/html");
			break;
		}
	};
	
	var initial_editor = function(pageId, fileName, type){
		var editorId = "editor" + pageId;
		var page = $('pages > page[id="' + pageId + '"]');
		
		page.find('pre').attr('id', editorId);
		
		var aceEditor = ace.edit(editorId);
	    aceEditor.setTheme("ace/theme/chrome");
	    if(type === 'file')
	    	setFileType(aceEditor, fileName);
	    aceEditor.setReadOnly(true);
	    aceEditor.setShowPrintMargin(false);
	    if(type === 'changes')
	    	aceEditor.setHighlightActiveLine(false);
	    else
	    	aceEditor.setHighlightActiveLine(true);
	    aceEditor.renderer.setPadding(2);
	    aceEditor.session.setUseWrapMode(false);
	    
	    document.getElementById(editorId).style.fontSize='12px';
	    var rows = aceEditor.session.getLength();;
	    aceEditor.session.setFoldStyle("manual");

	    var editorheight = (rows+1)*line_height;

	    page.find('pre').height(editorheight);
	    page.find('rows').html(rows + " lines");
	    if(type === 'file')
	    	page.find('status').html("Read Only").removeClass("editing").addClass("readonly");
	    if(type === 'changes')
	    	page.find('status').html("Changed file").removeClass("editing").addClass("readonly");
	    
	    if(type === 'changes')
		    for(var i = 0; i < rows; i++){
		    	aceEditor.session.addGutterDecoration(i, "mygutter");
		    }
	    
	    aceEditor.resize();
	    
	    if(type === 'file'){
	    	$('main').height(editorheight+230<600?600:editorheight+230);
	    }else{
	    	$('main').height('auto');
	    }
		
	    return aceEditor;
	};
	
	var GutterClickEvent = function(pageId, aceEditor, commitsha, fileName){
		aceEditor.on("gutterclick", function(e) {
			tabs.append(pageId, comments.writer("row", "Write", "Comment"), 0);
			var writer = $('pages > page[id="' + pageId + '"] writer[id="row"]');
			var row = e.getDocumentPosition().row+1;
			writer.dialog({
				title: "Write comment on row #" + (row), 
				minWidth: 720, 
				maxWidth: 720, 
				minHeight: 240,
				maxHeight: 240,
				modal: true,
				buttons: {"Comment on this line": function(){ 
					var content = writer.find('textarea').val();
					comments.makeComment(login.username, login.accesskey, repo.selectedrepo, branch.selectedbranch, commitsha, content, row, fileName, pageId);
					$(this).dialog('close');
				}}
			});
	    });
	};
	
	/*
	 * Initial page methods
	 */
	var initial_page = function(pageId, filePath, committime, type){
		
		var page = $('pages > page[id="' + pageId + '"]');
		page.html(progressbar.inPageProgressbar);
		
//		page.css('background-color', '#FCFCFC').css('border', 'none');
//		$('margin').css('background-color', '#FCFCFC').css('border-left', 'none').css('border-right', 'none');
//		$('main').css('border', 'none');
//		$('right').css('background-color', '#FCFCFC');
//		$('margin').css('margin', '0');
		
//		page.addClass('browseCode');
//		$('main').addClass('browseCode');
//		$('pages').addClass('browseCode');
//		$('right').addClass('browseCode');
//		$('margin').addClass('browseCode');
		
		page.find('div[id="inPageProgressBar"]').addClass('editor');
		page.prepend(htmlHeader(committime, type));
		page.prepend(repo.generateNavBar(filePath));
		
		tabs.Select($('li[id="tab0"]'));
	};
	
	/*
	 * Open Changes methods
	 */
	var openChanges = function(username, accesskey, reponame, commitsha, filePath, blobsha, branchname, committime){
		
//		var fileName = filePath.split('/').pop();
		
//		var pageId = tabs.Insert(fileName, '', true);
		repo.clearUpload();
		var pageId = 'tab0';
		
		initial_page(pageId, filePath, committime, 'changes');
		
		taskManager.makeCall(
				taskManager.GET, 
				rest.CommitContentUrl(username, accesskey, reponame, commitsha),
				null, 
				changeCallback,
				{"pageId": pageId, "filePath": filePath, "commitsha": commitsha}
		); 
	};
	
	var changeCallback = function(data, parameters){
		
		var pageId = parameters.pageId;
		var filePath = parameters.filePath;
		var commitsha = parameters.commitsha;
		
		$.each(data, function(key, change){
			
			if(change.filePath === filePath){
				
//				var fileName = filePath.split('/').pop();
       			
				var page = $('pages > page[id="' + pageId + '"]');
				
				page.append(htmlContent(change.content.replace(/</g, '&lt;')));
				
//				page.find('div.editor').append(htmlContent(change.content.replace(/</g, '&lt;')));
				
				var aceEditor = initial_editor(pageId, null, 'changes');
				
				comments.getCommentList(login.username, login.accesskey, repo.selectedrepo, commitsha, filePath, page.find('pre').height(), pageId);
    			
    			GutterClickEvent(pageId, aceEditor, commitsha, filePath);
    			
    			CommenterLink(page, aceEditor, pageId, login.username, login.accesskey, repo.selectedrepo, branch.selectedbranch, commitsha, filePath); 	
    			
    			progressbar.inPageBarComplete(pageId);
    			
//    			$('main').height('auto');
  
    			page.find('ul[id="navigationBar2"]').fadeIn('slow');
    			page.find('editorheader').fadeIn('slow');
    			page.find('pre').fadeIn('slow');
    			
//    			heighLight(pageId);
    			if(tabs.current_page !== pageId){
    				tabs.highlight(pageId);
    			}
    			
    			
			}
		});
	};
	
	
	/*
	 * Open file methods
	 */
	var openFile = function(blobsha, filePath, committime){
		
//		var pageId = tabs.Insert(fileName, '', true);
		repo.clearUpload();
		var pageId = 'tab0';
		
		initial_page(pageId, filePath, committime, 'file');
		
		taskManager.getText(
				taskManager.GET, 
				rest.CodeUrl(login.username, login.accesskey, repo.selectedrepo, branch.selectedbranch, blobsha),
				null, 
				fileCallback,
				{"pageId": pageId, "filePath": filePath}
		); 
	};
	
	var fileCallback = function(data, parameters){
		
		
		var pageId = parameters.pageId;
		var filePath = parameters.filePath;
		
		var page = $('pages > page[id="' + pageId + '"]');
		
//		page.find('div.editor').append(htmlContent(data.replace(/</g, '&lt;')));
		
		page.append(htmlContent(data.replace(/</g, '&lt;')));
		
		var aceEditor = initial_editor(pageId, filePath, 'file');
		
		WriterLink(page, aceEditor, pageId, filePath);
		
		progressbar.inPageBarComplete(pageId);
		
		page.find('ul[id="navigationBar2"]').fadeIn('slow');
		page.find('editorheader').fadeIn('slow');
		page.find('pre').fadeIn('slow');
		
		
		if(tabs.current_page !== pageId){
			tabs.highlight(pageId);
		}

	};
	
	var CommenterLink = function(page, aceEditor, pageId, username, accesskey, repoName, branch, sha, fileName){
		var item = page.find('editorheader > ul > li.comment');
		item.click(function(e){
			tabs.append(pageId, comments.writer("file"), 0);
			var writer = page.find('writer[id="file"]');
			writer.dialog({
				title: "Write", 
				minWidth: 720, 
				maxWidth: 720, 
				minHeight: 240,
				maxHeight: 240,
				modal: true,
				buttons: {"Comment on this commit": function(){ 
					var content = writer.find('textarea').val();
					comments.makeComment(username, accesskey, repoName, branch, sha, content, 0, fileName, pageId);
					$(this).dialog('close');
				}}
			});
		});
		
//		page.find('editorheader > ul > li.highlight > input[type="checkbox"]').unbind('change').change(function(){
//			if($(this).is(':checked'))
//				highLight(pageId);
//			else
//				removehighLight(pageId);
//		});
		
		page.find('editorheader > ul > li.highlight').unbind('click').click(function(){
			console.log('highlight');
			if(!$(this).find('input[type="checkbox"]').is(':checked')){
				$(this).find('input[type="checkbox"]').attr("checked", true);
				highLight(pageId);
			}else{
				$(this).find('input[type="checkbox"]').attr("checked", false);
				removehighLight(pageId);
			}
		});
		
		page.find('#navigationBar2 li.navigationbutton').unbind('click').click(function(){
//			commits.refresh();
			page.hide("slide", { direction: "right"}, 'fast', function(){
				repo.showType = 'left';
				$('main').height('auto');
				repo.loadRoot();
			});
		});
	};
	
	var WriterLink = function(page, aceEditor, pageId, filePath){
		var item = $('pages > page[id="' + pageId + '"] > editorheader > ul > li.commit');
		var status = "readonly";
		item.html('Edit');
		item.click(function(e){
			if(status === "readonly"){
				status = "editing";
				aceEditor.setReadOnly(false);
				aceEditor.resize();
				page.find('.ace_sb').hide();
				page.find('status').html("Editing").removeClass("readonly").addClass("editing");
				item.html('Commit Changes');
				messagebox.show("You can edit.", 2000, false);
				page.find('pre').effect("highlight", {color:"#FFCC99"}, 1000);
			}else{
//				tabs.append(pageId, comments.writer("commit"), 0);
				progressbar.show(true);
    			var content = aceEditor.getValue();
				repo.commit([{"filePath": filePath,"content": content}], -2);
				status = "readonly";
				aceEditor.setReadOnly(true);
				aceEditor.resize();
				page.find('.ace_sb').hide();
				page.find('status').html("Read Only").removeClass("editing").addClass("readonly");
				item.html('Edit');
			}
		});
		
		$('pages > page[id="' + pageId + '"] #navigationBar2 li.navigationbutton').unbind('click').click(function(){
			page.hide("slide", { direction: "right"}, 'fast', function(){
				repo.showType = 'left';
				$('main').height('auto');
				repo.loadRoot();
			});
		});
	};
	
	var highLight = function(pageId){
		
		console.log('highLight');
		
		var page = $('pages > page[id="' + pageId + '"]');
				
		page.find('div.ace_text-layer > div.ace_line').each(function(){
			var op = $(this).html().charAt(0);
			$(this).addClass('highlight');
			if(op === '+'){
				$(this).css("background-color", "#DFD");
			}else if(op === '-'){
				$(this).css("background-color", "#FDD");
			}else{
				$(this).css("background-color", "#EAF2F5");
				$(this).css("color", "#999");
			}
		});
	};
	
	var removehighLight = function(pageId){
		
		console.log('remove');
		
		var page = $('pages > page[id="' + pageId + '"]');
		
		page.find('div.ace_text-layer > div.ace_line').each(function(){
			$(this).removeClass('highlight');
			$(this).css("background-color", "white");
			$(this).css("color", "black");
		});
	};
	
	return {
		openChanges: openChanges,
		openFile: openFile,
		highLight: highLight
	};
	
})();

