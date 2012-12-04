function Tooltips(){
	
	this.initial = function(){
		$('#tooltips').hide();
	};
	
	this.show = function(element, content){
		var offset = element.offset();
		var contentWidth = $('content').width();
		$('#tooltips > p').html(content);
		var tooltipWidth = $('#tooltips').width();
		var leftbias = -20;
		var topbias = -12;
		if(contentWidth < offset.left + tooltipWidth){
			leftbias -= (offset.left + tooltipWidth - contentWidth);
			leftbias -= 10;
		}
//		console.log($(window).scrollTop());
		topbias -= $('#tooltips').height()-$(window).scrollTop()-$(window).scrollTop();
		$('#tooltips_tail').css('left', -(leftbias+7-(element.width()/2)));
		$('#tooltips').stop(true, true).offset({ top: 0, left: 0}).offset({ top: offset.top+topbias, left: offset.left+leftbias}).fadeIn('slow');
	};
	
	this.hide = function(){
		$('#tooltips').stop(true, true).offset({ top: 0, left: 0}).hide();
	};
}

var tooltips = new Tooltips();