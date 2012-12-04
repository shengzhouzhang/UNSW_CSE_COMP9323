function Auth(){
	
	this.studentUrl = "http://localhost:8080/studentView";
	this.tutorUrl = "http://localhost:8080/tutorView";
	this.lectureUrl = "http://localhost:8080/lectureView";
	this.loginUrl = "http://localhost:8080/login";
	
	this.getAuth = function(username, password){
		var auth = this;
		$.read('json/user.json', {"username": username, "password": password}, function (data) {
			if(data.accesskey === undefined){
				alert("The username or password you entered is incorrect.");
				window.location.replace(auth.loginUrl);
			}else{
				
				switch(data.right){
		            case "student": 
		            	window.location.href = auth.studentUrl;
		            	break;
		            case "tutor": 
		            	window.location.href = auth.tutorUrl;
		            	break;
		            case "lecture": 
		            	window.location.href = auth.lectureUrl;
		            	break;
		            default: break;
				}
			}
		});
	};
}

var auth = new Auth();