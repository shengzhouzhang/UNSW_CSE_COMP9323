function Editor(){
	
	this.refreshpageid = null;
	this.fileName = null;
	this.sha = null;
	
	function htmlCommenter(content){
		var items = [];
//		items.push('<a name="top"></a>');
		items.push('<editorheader>');
		items.push('<status>Status</status>');
		items.push('<rows></rows>');
		items.push('<ul>');
//		items.push('<li class="rowcomment">You can also comment by click gutter</li>');
		items.push('<li class="comment">Comment on this file</li>');
		items.push('</ul>');
		items.push('</editorheader>');
		items.push('<pre>');
		items.push(content);
		items.push('</pre>');
		return items.join('');
	}
	
	function htmlWriter(content){
		var items = [];
		items.push('<editorheader>');
		items.push('<status>Status</status>');
		items.push('<rows></rows>');
		items.push('<ul>');
		items.push('<li class="commit">Commit</li>');
		items.push('</ul>');
		items.push('</editorheader>');
		items.push('<pre>');
		items.push(content);
		items.push('</pre>');
		return items.join('');
	}
	
	this.setFileType = function(aceEditor, fileName){
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
	
	this.openFile = function(username, accesskey, repo, branch, blobsha, fileName, editorType, commitsha){
		var file = this;
		$. ajax({
			type: "GET",
        	url: rest.CodeUrl(username, accesskey, repo, branch, blobsha),
        	contentType: "application/json",
        	dataType: 'text',
       		success: function (data) {
       			//console.log(data);
       			var key;
       			if(editorType === 'commenter')
       				key = tabs.Insert(fileName, htmlCommenter(data.replace(/</g, '&lt;')), true);
       			else
       				key = tabs.Insert(fileName, htmlWriter(data.replace(/</g, '&lt;')), true);
    
    			var editorId = "editor" + key;
    			var page = $('pages > page[id="' + key + '"]');
    			page.find('editorheader').width(page.width()-20);
    			page.find('pre').attr("id", editorId).width(page.width());
    			
    			var aceEditor = ace.edit(editorId);
    		    aceEditor.setTheme("ace/theme/chrome");
    		    editor.setFileType(aceEditor, fileName);
    		    aceEditor.setReadOnly(true);
    		    aceEditor.setShowPrintMargin(false);
    		    aceEditor.setHighlightActiveLine(true);
    		    aceEditor.renderer.setPadding(2);
    		    aceEditor.session.setUseWrapMode(true);
    		    aceEditor.session.setWrapLimitRange(80, 80);
    		    aceEditor.resize();
    		    
    		    document.getElementById(editorId).style.fontSize='14px';
    		    page.find('.ace_sb').hide();
    		    var rows = aceEditor.session.getLength();;
    		    aceEditor.session.setFoldStyle("manual");
    		    var editorheight = rows*23;
    		    page.find('pre').height(editorheight<500?500:editorheight);
    		    page.find('rows').html(rows + " lines");
    		    page.find('status').html("Read Only").removeClass("editing").addClass("readonly");
    			
//    			aceEditor.on("gutterclick", function(e) {
//    				tabs.append(key, comments.writer("row", "Write", "Comment"), 0);
//    				var writer = $('pages > page[id="' + key + '"] writer[id="row"]');
//    				var row = e.getDocumentPosition().row+1;
//    				writer.dialog({
//    					title: "Write comment on row #" + (row), 
//    					minWidth: 720, 
//    					maxWidth: 720, 
//    					minHeight: 240,
//    					maxHeight: 240,
//    					modal: true,
//    					buttons: {"Comment on this row": function(){ 
//    						var content = writer.find('textarea').val();
//    						comments.makeComment(username, accesskey, repo, branch, commitsha, content, row, fileName);
//    					}}
//    				});
//    		    });
    			
    			if(editorType === 'commenter'){
    				file.CommenterLink(page, aceEditor, key, username, accesskey, repo, branch, commitsha, fileName);
//    				page.find('status').html("Read Only");
//    				tabs.append(key, comments.getCommentList(username, accesskey, repo, commitsha), editorheight+75);
//    				tabs.append(key, comments.getCommentList(username, accesskey, repo, blobsha), editorheight+75);
    			}else{
    				file.WriterLink(page, aceEditor, key, fileName);
    			}
//    			$('main').height($(document).height());
//    			console.log($(document).height());
    			$('main').height($('left').height()>(editorheight+100)?$('left').height():(editorheight+100));
    			$('html, body').scrollTop(0);
    			//tabs.append(key, comments.getCommentList(username, accesskey, repo, sha), editorheight+75);
    			//
    			progressbar.complete();
        	},
   	   		error: function(){
   	   			console.log("Error: cann't get code");
   	   			//
    			progressbar.complete();
   	   		}
		}); 
	};
	
	this.CommenterLink = function(page, aceEditor, pageId, username, accesskey, repo, branch, sha, fileName){
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
					comments.makeComment(username, accesskey, repo, branch, sha, content, 1, fileName);
				}}
			});
		});
	};
	
	this.WriterLink = function(page, aceEditor, pageId, fileName){
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
				tabs.append(pageId, comments.writer("commit"), 0);
				var writer = page.find('writer[id="commit"]');
				writer.dialog({
					title: "Commit Message", 
					minWidth: 720, 
					maxWidth: 720, 
					minHeight: 240,
					maxHeight: 240,
					modal: true,
					buttons: {"Commit this file": function(){
						progressbar.show(true);
		    			var content = aceEditor.getValue();
		    			editor.refreshpageid = pageId;
						repo.commit(login.username, login.accesskey, repo.selectedrepo, repo.selectedbranch, [{"filePath": fileName,"content": content}], -2, false);
						status = "readonly";
						aceEditor.setReadOnly(true);
						aceEditor.resize();
						page.find('.ace_sb').hide();
						page.find('status').html("Read Only").removeClass("editing").addClass("readonly");
						item.html('Edit');
						$(this).dialog('close');
					}}
				});
			}
		});
	};
}

var editor = new Editor();