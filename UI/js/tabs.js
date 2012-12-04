function Tabs(){
	
	this.current_page = null;
	
	function createPage(id, title, content, removable){
		//create a tab
		if(removable === true)
			$("tabs > ul.tabselecter").append('<li id="' + id + '"><a href="#">' + title + '</a><delete id="' + id + '"></delete></li>');
		else
			$("tabs > ul.tabselecter").append('<li id="' + id + '"><a href="#">' + title + '</a></li>');
		//create a page
		$("pages").append('<page id="' + id + '" style="display: none;">' + progressbar.inPageProgressbar + content + '</page>');
	};
	
	this.tab0height = null;
	
	this.Select = function(tabObj){
		
		if(tabs.current_page === 'tab0')
			tabs.tab0height = $('main').height();
		
		//show tab
		$("tabs > ul.tabselecter > li").removeClass("selected");
		tabObj.addClass("selected");
		//show page
		$.when($("pages > page").hide()).done(function(){
			tabs.current_page = tabObj.attr("id");
			$('pages > page[id="' + tabs.current_page + '"]').fadeIn('slow');
			$("margin").css('display', 'block');
			
		});
		
		
		if(tabs.current_page === 'tab0' && tabs.tab0height !== null)
			$('main').height(tabs.tab0height);
		else
			$('main').height('auto');
		
		$(window).scrollTop(0);
			
	};
	
	//make the li click event function
	function Link(tabid){
		$('tabs > ul.tabselecter > li > delete[id="' + tabid + '"]').click(function(e){
			e.preventDefault();
			tabs.Remove($(this).attr("id"));
		});
		$('tabs > ul.tabselecter > li[id="' + tabid + '"]').click(function(){
			var tab = $(this);
			tabs.Select(tab);
		});
	};
	
	this.SelectFirst = function(){
		tabs.Select($("tabs > ul.tabselecter > li:first-child"));
	};
	
	this.SelectLast = function(){
		tabs.Select($("tabs > ul.tabselecter > li:last-child"));
	};
	
	this.Insert = function(title, content, removable){
		//generate tab id
		var id = "tab" + $("tabs > ul.tabselecter > li").length;
		createPage(id, title, content, removable);
		//
		Link(id);
		//
//		tabs.SelectLast();
		//return the new tab's id
		return id;
	};
	
	this.append = function(pageId, content, marginTop){
		$('pages > page[id="' + pageId + '"]').append('<div style="margin-top: ' + marginTop + 'px">' + content + '</div>');
	};
	
	this.HideLast = function(){
		//hide the new tab
		$("tabs > ul.tabselecter > li:last-child").hide();
		$("pages > page:last-child").hide();
	};
	
	this.Remove = function(tabId){
		var next = $('tabs > ul.tabselecter > li[id="' + tabId +'"]').next('li');
		$('tabs > ul.tabselecter > li[id="' + tabId +'"]').fadeOut('fast', function(){
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
	
	this.highlight = function(pageId){
		if(tabs.current_page !== pageId){
			$.when(
				$('ul.tabselecter > li[id="' + pageId + '"]').effect("highlight", {color:"#FFFFEC"}, 1000)
			)
//			.then(function(){
//				$('ul.tabselecter > li[id="' + pageId + '"]').effect("highlight", {color:"#FFFFCC"}, 1000);
//			})
			.done(function(){
				$('ul.tabselecter > li[id="' + pageId + '"]').effect("highlight", {color:"#FFFFEC"}, 3000);
			});
		}
	};
	
	this.RemoveAll = function(){
		$('tabs > ul.tabselecter > li').remove();
		$('pages > page').remove();
	};
}

var tabs = new Tabs();

