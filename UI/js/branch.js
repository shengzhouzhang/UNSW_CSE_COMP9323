/**
* This is the javascript class to manage branches;
*
* @class Branch
*/
function Branch(){
	
	this.branchlist = [];
	this.selectedbranch = null;
	var hidden = false;
	this.mouseup = false;
	
	/**
	* The method to get branch list from back-end.
	*
	* @method getBranches
	* @param {String} username user account
	* @param {String} accesskey a authorized token obtain from back-end
	* @param {String} reponame the name of repository 
	* @param {String} branchname the name of branch to be load
	* 
	*/
	this.getBranches = function(username, accesskey, reponame, branchname){
//		rest.abort(false);
		rest.callrest = $. ajax({
			type: "GET",
        	url: rest.BranchUrl(username, accesskey, reponame),
        	contentType: "application/json",
        	dataType: 'json',
            cache: false,
       		success: function (data) {
       			branch.branchlist = [];
       			$.each(data, function(key, val) {
       				// save branches into object
       				branch.branchlist.push(val.branchId);
    			});
       			if(branchname !== undefined){
       				console.log(branchname);
       				if($.inArray(branchname, branch.branchlist) > 0){
       					branch.selectedbranch = branchname;
       				}else{
       					branch.selectedbranch = 'master';
       				}
   					repo.loadRoot();
   	       			commits.refresh();
   	       			branch.Html();
   	       			return;
   				}

				branch.selectedbranch = 'master';
				// load file list by default branch
				repo.Page();
				commits.Page(username, accesskey, reponame);
				if(login.role === 'student'){
					group.displayMembers();
				}
				branch.Html();
        	},
   	   		error: function(){
   	   			messagebox.show("failed to read branch list.", 2000, true);
   	   		},
        	complete: function(){
        		tabs.SelectFirst();
        		progressbar.complete();
        		$('main').css('display', 'none').fadeIn('slow');
        	}
		}); 
	};
	
	/**
	* 
	* The method to load branch list to browser.
	* @method Html
	* 
	*/
	this.Html = function(){
		
		var list = $('#branchlist');
		list.html('');
		list.append('<li class="selectedbranch"><span>branch: </span><span class="branchname">' + branch.selectedbranch + '</span></li>');
		
		list.append('<li class="createbranch"><input type="text" name="newbranch"></input></li>');
		$.each(branch.branchlist, function(key, branch) {
			list.append('<li id="' + branch + '" class="branchitem">' + branch + '</li>');
		});
		
		branch.hidelist();
		
		list.find('li.selectedbranch').unbind('click').click(function(){
			if(hidden === true){
				$(this).addClass('selected');
				branch.showlist();
			}else{
				$(this).removeClass('selected');
				branch.hidelist();
			}
		});
		
		list.find('li.branchitem').click(function(){
			var branchName = $(this).attr('id');
			branch.selectedbranch = branchName;
			list.find('li.selectedbranch > span.branchname').html(branch.selectedbranch);
			branch.hidelist();
			
			repo.clearUpload();
			
			repo.loadRoot();
			commits.refresh();
		});
		
		list.find('li.createbranch > input').keypress(function(event){
			if(event.which == 13){
				event.preventDefault();
				var branchName = $(this).val();
				progressbar.show(true);
				branch.createBranch(login.username, login.accesskey, repo.selectedrepo, branchName);
			}
		});
		
		list.unbind('hover').hover(function(){
			branch.mouseup = true;
		}, function(){
			branch.mouseup = false;
		});
		
		$('body').unbind('click').click(function(){
			if(branch.mouseup === false)
				branch.hidelist();
		});

	};
	
	/**
	* 
	* Hide branch list from browser
	* @method hidelist
	* 
	*/
	this.hidelist = function(){
		var list = $('#branchlist');
		list.find('li.branchitem').hide();
		list.find('li.createbranch').hide();
		hidden = true;
	};
	
	/**
	* 
	* display branch list from browser
	* @method showlist
	* 
	*/
	this.showlist = function(){
		var list = $('#branchlist');
		list.find('li.branchitem').fadeIn(200);
		list.find('li.createbranch > input').val('newbranch');
		list.find('li.createbranch').fadeIn(200);
		hidden = false;
	};
	
	/**
	* 
	* The method to create branch
	* @method createBranch
	* @param {String} username user account
	* @param {String} accesskey a authorized token obtain from back-end
	* @param {String} reponame the name of repository 
	* @param {String} branchname the name of branch to be created
	* 
	*/
	this.createBranch = function(username, accesskey, reponame, branchName){
		var send = JSON.stringify({'branchName': branchName});
		rest.abort(false);
		rest.callrest = $. ajax({
			type: "POST",
        	url: rest.CreateBranchUrl(username, accesskey, reponame),
        	contentType: "application/json",
        	dataType: 'text',
        	data: send,
       		success: function (data) {
       			if(data === 'success'){
       				console.log(data);
	       			messagebox.show("Branch has been created.", 2000);
	       			branch.getBranches(login.username, login.accesskey, repo.selectedrepo, branchName);
       			}else{
       				messagebox.show("failed to create branch.", 2000, true);
       			}
       			
        	},
   	   		error: function(){
   	   			messagebox.show("failed to create branch.", 2000, true);
   	   		}
		}); 
	};
}

var branch = new Branch();


