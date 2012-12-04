function Files() {

	this.addFunction = function() {
		document.getElementById("docsInput").addEventListener('change',files.readMultipleFiles, false);
		
		$("li.createfolder").unbind('hover').hover(function(){
			tooltips.show($(this), 'Create a New Folder');
		}, function(){
			tooltips.hide();
		});
		
		$("li.uploadcode").unbind('hover').hover(function(){
//			messagebox.slideIn('Add files to upload.');
			tooltips.show($(this), 'Add Files to Upload');
		}, function(){
//			messagebox.slideOut();
			tooltips.hide();
		});  
		
	};

	
	this.readMultipleFiles = function(evt) {
		// Retrieve all the files from the FileList object
		var filelist = evt.target.files;
		var tempPath="";
		
		
		$.each(repo.path, function(key, val){
			if(key != 0)
				tempPath += repo.path[key] + "/";
		});
		console.log("mypath: " + tempPath);
//		for(var i=1;i<repo.path.length;i++){
//			tempPath=tempPath+"/"+repo.path[i];
//		}
//		
		

		console.log("tempPath" + tempPath);		
		if (filelist) {
			for ( var i = 0, f; f = filelist[i]; i++) {
				var items = [];
//				var components=[];
				var r = new FileReader();
				r.onload = (function(f) {
					return function(e) {
						var contents = e.target.result;
						var fileSize = f.size;
						console.log(fileSize);
						
						var fileType = f.name.toString().substring(
								f.name.lastIndexOf(".") + 1, f.name.length)
								.toUpperCase();
						if (fileType != "JAVA"&&fileType != "JS"&&fileType != "HTML"&&fileType != "CSS") {
							console.log("JAVA Files Only");					
						}else{
							items = [];

							if(!$(".uncommitlist").has('li').length){
					
								
								
								items.push('<li class="uncommitfiletitle">');
								items.push('<span class="uncommitfiletitlepath">Uploading list</span>');
								items.push('<span class="uncommitfiletitledeleteall"><img src="images/cancel.png"/>Done</span>');
								items.push('<span class="uncommitfiletitleuploadall"><img src="images/uploader_1.png"/>Upload all</span>');
								items.push('</li>');
							};
							
							
							var filename = tempPath+f.name;
							items.push('<li>');
							items.push('<span class="uncommitfiletitlepath">'+ filename +'</span>');
							items.push('<img src="images/delete.png" class="uncommitfiletitledelete" href="#CancelUploadThisFileDiv"/>');
							items.push('<img src="images/uploader_1.png" class="commit" href="#UploadThisFileDiv"/>');
							items.push('</li>');
							repo.adduncommititem(items.join(''));
							repo.uncommitjson.push({"filePath": filename, "content":contents.substr(0, contents.length)});

							repo.uncommitlistlink();
							
							$("ul.uncommitlist img.commit").unbind('hover').hover(function(){
								var filename = $(this).parent('li').find('span').html();
//								messagebox.slideIn('Upload ' + filename);
								tooltips.show($(this), 'Upload ' + filename + ' to Github');
							}, function(){
//								messagebox.slideOut();
								tooltips.hide();
							});
							
							$("ul.uncommitlist img.uncommitfiletitledelete").unbind('hover').hover(function(){
//								messagebox.slideIn('Cancel upload');
								var filename = $(this).parent('li').find('span').html();
								tooltips.show($(this), 'Remove ' + filename + ' from upload list');
							}, function(){
//								messagebox.slideOut();
								tooltips.hide();
							});
						}
						
					};
				})(f);
				r.readAsText(f);
			}
			
			
		}

	};

	
	this.CommitFile = function(username, accesskey, repo, branch, filePath,
			content) {
		var send = JSON.stringify([ {
			"filePath" : filePath,
			"content" : content
		} ]);

		$.ajax({
			type : "POST",
			url : rest.CommitUrl(username, accesskey, repo, branch),
			contentType : "application/json",
			dataType : 'text',
			data : send,
			success : function(data) {
				console.log("commit success");
				// alert("success");
				return true;
			},
			error : function() {
				console.log("Error: cann't commit");
				return false;
			}
		});
	};

	this.CommitDocs = function(username, accesskey, repo, branch) {

			for ( var i = 0; i < repo.uncommitjson.length; i++) {

				var filePath = repo.uncommitjson[i].path;
				var content = repo.uncommitjson[i].content;
				var CommitDocsResultTemp = files.CommitFile(username,accesskey, repo, branch, filePath, content);

				if (CommitDocsResultTemp == true) {
					$("#bg"+(i+1)).attr("src","url(images/ok.png)");
				} else {
					$("#bg"+(i+1)).attr("src","url(images/fail.png)");
				}
			}
	};
}

var files = new Files();