function Progressbar(){
	
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
}

var progressbar = new Progressbar();