function Sidebar(){
	
	this.selectedcourse = null;
	this.selectedproject = null;
	
	this.Insert = function(id, name){
		$("nav > ul").append('<li id="nav' + id + '">' + name + '</li>');
		$("nav li:last-child").addClass("levelOne");
	};
	
	this.LevelOne = function(){
		var send = {"username": login.username, "accesskey": login.accesskey};
		$.read(rest.CourseUrl(), send, function (data) {
			console.log(data);
			$.each(data, function(key, val) {
				sidebar.Insert(key, val.courseId);
			});
			sidebar.LinkLevelOne();
		});
	};
	
	this.LinkLevelOne = function(){
		$("nav .levelOne").click(function(){
			var course = $(this);
			if(course.hasClass('selectedcourse')){
				$(this).removeClass('selectedcourse');
				sidebar.selectedcourse = null;
				$("nav .levelTwo").slideUp('fast', function(){
					$(this).remove();
				});
				$("nav div").remove();
			}else{
				// select course
				sidebar.selectedcourse = course.html();
				$("nav .levelTwo").remove();
				$("nav div").remove();
				sidebar.LevelTwo(course);
				sidebar.LinkLevelTwo(course);
				sidebar.Select(course);
				$(this).addClass('selectedcourse');
			}
		});
	};
	
	this.LevelTwo = function(course){
		var send = {"username": login.username, "accesskey": login.accesskey, "coursename": sidebar.selectedcourse};
		
		rest.callrest.abort(true);
		progressbar.show(false);
		rest.callrest = $.read(rest.ProjectList(), send, function (repositories) {
			var items = [];
			$.each(repositories, function(key, val) {
				items.push('<li id="' + val.projectId + '" class="levelTwo">' + val.projectName + '</li>');
			});
			items.push('<div></div>');
			course.after(items.join(''));
			$("nav .levelTwo").slideDown('fast');
			sidebar.LinkLevelTwo();
			progressbar.complete();
		});
	};
	
	this.Select = function(item){
		$("nav .levelOne").removeClass("selected");
		$("nav .levelTwo").removeClass("selected");
		item.addClass("selected").hide().fadeIn('fast');
//		item.find('div.background').hide().fadeIn('slow');
	};
	
	this.LinkLevelTwo = function(){
		$("nav .levelTwo").click(function(){
			
			
			sidebar.Select($(this));
			sidebar.selectedproject = $(this).attr("id");
//			console.log("selected project: " + sidebar.selectedproject);

			$('main').fadeOut('fast', function() {
				$('margin').fadeOut('fast');
				progressbar.show();
				tabs.RemoveAll();
				group.GetGroupList(login.username, login.accesskey, sidebar.selectedcourse, sidebar.selectedproject);
				
			});
		});
	};
}

var sidebar = new Sidebar();