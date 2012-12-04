var forward = (function(){
	
	var forward = function(){
		var command = getURLParameter('forward');
		console.log('command: ' + command);
		if(command !== null){
			switch(command){
				case 'toGroupRepo':
					forwardToGroupRepo();
					return true;
				default:
			}
		}
		return false;
	};
	
	var forwardToGroupRepo = function(){
		var username = getURLParameter('username');
		var accesskey = getURLParameter('accesskey');
		var role = getURLParameter('role');
		var groupId = getURLParameter('groupId');
		var groupname = getURLParameter('groupname');
		var course = getURLParameter('course');
		var project = getURLParameter('project');
		if(username !== 'null' 
			&& accesskey !== 'null' 
				&& role !== 'null' 
					&& groupId !== 'null'
						&& course !== 'null'
							&& project !== 'null'){
//			login.forward(username, accesskey, role);
			progressbar.show(false);
			console.log(username);
			console.log(accesskey);
			console.log(role);
			console.log(groupId);
			console.log(course);
			console.log(project);
			login.username = username;
			login.accesskey = accesskey;
			login.role = role;
			sidebar.selectedcourse = course;
			sidebar.selectedproject = project;
			group.selectedgroup = groupId;
			group.selectedgroupname = groupname;
			login.displayUserInfo();
			group.displayGroupInfo();
			repo.getRepo(course, project);
//			$('main').css('display', 'none').fadeIn('slow');
		}
	};
	
	var getURLParameter = function(name) {
	    return decodeURI(
	        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
	    );
	};
	
	return {
		forward: forward
	};
})();