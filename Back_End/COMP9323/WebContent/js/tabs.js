function Tabs(){
	
	//this.accesskey = $.session("accesskey");
	this.accesskey = $.cookie("accesskey");
	
	function createPage(id, title, content, removable){
		//create a tab
		if(removable === true)
			$("tabs > ul").append('<li id="' + id + '"><a href="#">' + title + '</a><delete id="' + id + '"></delete></li>');
		else
			$("tabs > ul").append('<li id="' + id + '"><a href="#">' + title + '</a></li>');
		//create a page
		$("pages").append('<page id="' + id + '">' + content + '</page>');
	};
	
	this.Select = function(tabObj){
		//show tab
		$("tabs > ul > li").removeClass("selected");
		tabObj.addClass("selected");
		//show page
//		$('pages > page[id="' + tabObj.attr("id") + '"]').addClass('selected');
		$.when($("pages > page").hide()).done(function(){
			$('pages > page[id="' + tabObj.attr("id") + '"]').fadeIn('slow');
			$("margin").css('display', 'block');
		});
//		$("pages > page").hide(0, function(){
//			$('pages > page[id="' + tabObj.attr("id") + '"]').fadeIn('fast');
//			$("margin").css('display', 'block');
//		});
		
		//show margin
//		console.log($('pages > page[id="' + tabObj.attr("id") + '"]'));
//		console.log($('pages > page[id="' + tabObj.attr("id") + '"]').scrollHeight);
		
//		$('main').height($(document).height());
//		$("margin").css('display', 'block');
//		console.log($(document).height());
//		$('main').height($('left').height()>pageheight?$('left').height():pageheight);
	};
	
	//make the li click event function
	function Link(tabid){
		$('tabs > ul > li > delete[id="' + tabid + '"]').click(function(e){
			e.preventDefault();
			tabs.Remove($(this).attr("id"));
		});
		$('tabs > ul > li[id="' + tabid + '"]').click(function(){
			var tab = $(this);
			tabs.Select(tab);
		});
	};
	
	this.SelectFirst = function(){
		tabs.Select($("tabs > ul > li:first-child"));
	};
	
	this.SelectLast = function(){
		tabs.Select($("tabs > ul > li:last-child"));
	};
	
	this.Insert = function(title, content, removable){
		//generate tab id
		var id = "tab" + $("tabs > ul > li").length;
		createPage(id, title, content, removable);
		//
		Link(id);
		//
		tabs.SelectLast();
		//return the new tab's id
		return id;
	};
	
	this.append = function(pageId, content, marginTop){
		$('pages > page[id="' + pageId + '"]').append('<div style="margin-top: ' + marginTop + 'px">' + content + '</div>');
	};
	
	this.HideLast = function(){
		//hide the new tab
		$("tabs > ul > li:last-child").hide();
		$("pages > page:last-child").hide();
	};
	
	this.Remove = function(tabId){
		var next = $('tabs > ul > li[id="' + tabId +'"]').next('li');
		$('tabs > ul > li[id="' + tabId +'"]').fadeOut('fast', function(){
			$(this).remove();
		});
		$('pages > page[id="' + tabId + '"]').fadeOut('fast', function(){
			$(this).remove();
			if(next.length === 0){
				tabs.SelectFirst();
			}
			else{
				tabs.Select(next);
			}
		});
	};
	
	this.RemoveAll = function(){
		$('tabs > ul > li').remove();
		$('pages > page').remove();
	};
}

var tabs = new Tabs();

