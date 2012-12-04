$(document).ready(function() {
	
	if(forward.forward()){
		
	}else{
		login.Page();
	}
	//
	theme.Width();
	progressbar.register();
	messagebox.initial();
	//
	$('main').hide();
	
	tooltips.initial();
	
	theme.initial();
	theme.sidebarIn();
	
	console.log("Page Ready");
});

$(window).load(function() {
	console.log("window load");
});

function imgError(image){
    image.onerror = "";
    image.src = "headers/gravatar-user-420.png";
    return true;
}



document.createElement("content");
document.createElement("left");
document.createElement("right");
document.createElement("logo");
document.createElement("nav");
document.createElement("main");
document.createElement("tabs");
document.createElement("pages");
document.createElement("page");
document.createElement("margin");
document.createElement("margin_r");
document.createElement("margin_l");

document.createElement("editorheader");
document.createElement("editorfooter");
document.createElement("title");
document.createElement("cancel");
document.createElement("commit");
document.createElement("status");
document.createElement("rows");

document.createElement("login");
document.createElement("username");
document.createElement("password");