function Theme(){
	
	this.bodywidth = 0;
	this.rightwidth = 0;
	this.sidebar = null;
	this.sidebarheight = 0;
	
	this.initial = function(){
		theme.sidebar = $("left");
	};
	
	this.Width = function(){
		theme.bodywidth = $('body').width();
		theme.sidebarheight = $('left').height();
//		$('main').height(theme.sidebarheight);
		var rightWidth = $('content').width() - 240;
		if(rightWidth > 940){
			$('right').width(rightWidth);
			$('main').width(rightWidth-22);
			$('tabs').width(rightWidth);
			theme.rightwidth = rightWidth;
			//$('pages').width();
		}else{
			theme.rightwidth = 940;
		}
	};
	
	this.sidebarIn = function(){
		theme.sidebar.css("opacity", "0").css("margin-left", "1200px");
		theme.sidebar.animate({
		    opacity: 1,
		    marginLeft: 0,
		  }, 1000, "easeOutExpo");
	};
	
	this.sidebarOut = function(){
//		theme.sidebar.css("opacity", "1").css("margin-left", "0px");
//		theme.sidebar.animate({
//		    opacity: 0,
//		    marginLeft: 1000,
//		  }, 800, "easeOutExpo", function(){
			  theme.sidebar.css("opacity", "1").hide().css("margin-left", "0px").fadeIn('slow');
			  messagebox.show('Welcome you ' + login.username + '.', 2000);
//		  });
	};
	
	this.heighlightpage = function(pageId){
		var page = $('pages > page[id="' + pageId + '"]');
		page.effect("highlight", {color:"#FFFFCC"}, 1000);
	};
}

var theme = new Theme();