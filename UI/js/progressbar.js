function Progressbar(){
	
	this.inPageProgressbar = '<div id="inPageProgressBar" ><img id="inPageProgressBar" src="images/loader_1.gif" /></div>';
	
	this.register = function(){
		$('img[id="progressbar"]').hide();
	};
	
	this.show = function(showmode){
		if(showmode === true)
			$('body > div.modal').show();
		$('img[id="progressbar"]').show();
	};
	
	this.complete = function(){
		$('body > div.modal').hide();
		$('img[id="progressbar"]').hide();
	};
	
	this.inPageBarShow = function(pageId){
		var page = $('pages > page[id="' + pageId + '"]');
		page.find('div[id=inPageProgressBar]').show();
	};
	
	this.inPageBarComplete = function(pageId){
		var page = $('pages > page[id="' + pageId + '"]');
		page.find('div[id=inPageProgressBar]').hide();
	};
}

var progressbar = new Progressbar();