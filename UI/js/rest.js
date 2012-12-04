function RestUrl(){
	
	this.callrest = null;
	
	this.refresh_commits_page = null;
	this.refresh_repo_page = null;
	
	this.abort = function(abortprogressbar){
		if(abortprogressbar === true)
			progressbar.complete();
		rest.callrest.abort();
	};
	
	this.abort_refresh = function(page, abortprogressbar){
		if(abortprogressbar === true)
			progressbar.complete();
		if(page === 'commits' && rest.refresh_commits_page != undefined)
			rest.refresh_commits_page.abort();
		if(page === 'repo' && rest.refresh_repo_page != undefined)
			rest.refresh_repo_page.abort();
	};
	
	var prefix = "http://localhost:8080/CodeManagement/rest";
	var login = "/user/login";
	var courses = "/group/{username}/{accesskey}";
	var project = "/group/{username}/{accesskey}/{coursename}";
	var branches = "/repo";
	var createGroup = "/group/{username}/{accesskey}/{coursename}/{project}";
	var groupList = "/group";
	var grouprest = "/group";
	var reporest = "/repo";
	var history = "/repo";
	var code = "/repo";
	var comment = "/comment";
	var fileComment = "/comment/{username}/{accesskey}";
	var commit = "/repo";
	var revert = "/repo";
	var files = "/repo";
	
	this.CommitContentUrl = function(username, accesskey, reponame, sha){
		return prefix + reporest + "/" + username + "/" + accesskey + "/" + reponame + "/commitSHA=" + sha;
	};
	
	this.DeleteFileUrl = function(username, accesskey, reponame, branchname, filepath){
		return prefix + reporest + "/" + username + "/" + accesskey + "/" + reponame + "/branch=" + branchname+ "/" + filepath;
	};
	
	this.LoginUrl = function(){
		return prefix + login;
	};
	
	this.CourseUrl = function(){
		return prefix + courses;
	};
	
	this.RepoUrl = function(username, accesskey, course, project, group){
		return prefix + grouprest + "/" + username + "/" + accesskey + "/" + course + "/" + project+ "/" + group;
	};
	
	this.ProjectList = function(){
		return prefix + project;
	};
	
	this.BranchUrl = function(username, accesskey, repo){
		return prefix + branches + "/" + username + "/" + accesskey + "/" + repo;
	};
	
	this.CreateGroup = function(){
		return prefix + createGroup;
	};
	
	this.GroupList = function(username, accesskey, course, project){
		return prefix + groupList + "/" + username + "/" + accesskey + "/" + course + "/" + project;
	};
	
	this.HistoryFiles = function(username, accesskey, repo, branch){
		return prefix + history + "/" + username + "/" + accesskey + "/" + repo + "/branch=" + branch + "/versions";;
	};
	
	this.CodeUrl = function(username, accesskey, repo, branch, sha){
		return prefix + code + "/" + username + "/" + accesskey + "/" + repo + "/branch=" + branch + "/" + sha + "/code";
	};
	
	this.CommentUrl = function(username, accesskey, repo, branch, sha){
		console.log(prefix + comment + "/" + username + "/" + accesskey + "/" + repo + "/" + branch + "/" + sha);
		return prefix + comment + "/" + username + "/" + accesskey + "/" + repo + "/" + branch + "/" + sha;
	};
	
	this.FileCommentUrl = function(){
		return prefix + fileComment;
	};
	
	this.CommitUrl = function(username, accesskey, repo, branch){
		return prefix + commit + "/" + username + "/" + accesskey + "/" + repo + "/branch=" + branch + "/code";
	};
	
	this.RevertUrl = function(username, accesskey, repo, branch, sha){
		return prefix + revert + "/" + username + "/" + accesskey + "/" + repo + "/branch=" + branch + "/" + sha + "/revert";
	};
	
	this.FilesUrl = function(username, accesskey, repo, branch){
		return prefix + files + "/" + username + "/" + accesskey + "/" + repo + "/branch=" + branch;
	};
	
	this.CommentListUrl = function(username, accesskey, repo, sha){
		console.log(prefix + comment + "/" + username + "/" + accesskey + "/" + repo + "/" + sha);
		return prefix + comment + "/" + username + "/" + accesskey + "/" + repo + "/" + sha;
	};
	
	this.CreateBranchUrl = function(username, accesskey, repo){
		return prefix + branches + "/" + username + "/" + accesskey + "/" + repo;
	};
	
	this.CreateFolderUrl = function(username, accesskey, repo, branch){
		return prefix + branches + "/" + username + "/" + accesskey + "/" + repo +"/branch=" + branch + '/folder';
	};
	
	this.OpenFolderUrl = function(username, accesskey, repo, branch, sha){
		return prefix + branches + "/" + username + "/" + accesskey + "/" + repo +"/branch=" + branch + '/' + sha;
	};

}

var rest = new RestUrl();