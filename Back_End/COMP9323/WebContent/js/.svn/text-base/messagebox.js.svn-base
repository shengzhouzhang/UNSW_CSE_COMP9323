function MessageBox(){
	
	this.timmer = null;
	
	this.initial = function(){
		$('div.messagebox').hide();
	};
	
	this.show = function(message, time, alert){
		if(alert === true){
			$('div.messagebox').stop(true, true).css("margin-left", "50%").addClass('alert').html(message).fadeIn('fast');
		}else{
			$('div.messagebox').stop(true, true).css("margin-left", "50%").removeClass('alert').html(message).fadeIn('fast');
		}
		if(time > 0){
			if(time < 1000)
				time = 1000;
			if(messagebox.timmer != null)
				clearTimeout(messagebox.timmer);
			messagebox.timmer = setTimeout(function(){messagebox.complete();}, time);
		}
	};
	
	this.slideIn = function(message){
//		$('div.messagebox').removeClass('alert').html(message).fadeIn('fast');
		$('div.messagebox').stop(true, true).removeClass('alert').html(message)
		.show().css("opacity", "0").css("margin-left", "0px")
		.animate({
		    opacity: 1,
		    marginLeft: '80%',
		  }, 800, "easeOutExpo");
	};
	
	this.slideOut = function(){
//		$('div.messagebox').fadeOut('fast');
		$('div.messagebox').stop(true, true).css("margin-left", "0px").hide();
	};
	
	this.complete = function(){
		$('div.messagebox').stop(true, true).fadeOut('slow');
	};
	
}

var messagebox = new MessageBox();