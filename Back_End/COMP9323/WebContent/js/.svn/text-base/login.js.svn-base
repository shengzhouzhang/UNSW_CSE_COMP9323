function Login(){
	
	this.accesskey = null;
	this.username = null;
	this.role = null;
	
	this.Page = function(){
		var items = [];
		items.push('<login>');
		items.push('<username>Username</username><input type="text" class="text" name="username" />');
		items.push('<password>Password</password><input type="password" class="text" name="password" />');
		items.push('<div name="message"></div>');
		items.push('<input type="submit" class="submit" id="signIn">');
		items.push('</login>');
		$("left").append(items.join(''));
		
		$('left > login > input[name="password"]').keypress(function(event){
			if(event.which == 13){
				event.preventDefault();
				var username = $('left > login > input[name="username"]').val();
				var password = $('left > login > input[name="password"]').val();
				login.login(username, password);
			}
		});
		
		$('left > login > input[id="signIn"]').click(function(e) {
			var username = $('left > login > input[name="username"]').val();
			var password = $('left > login > input[name="password"]').val();
			login.login(username, password);
		});
	};
	
	this.login = function(username, password){
		
		var send = JSON.stringify({"username": username, "password": password});
		rest.callrest = $. ajax({
			type: "POST",
        	url: rest.LoginUrl(),
        	dataType: 'json',
        	contentType: "application/json",
        	data: send,
       		success: function (data) {
       			console.log(data);
       			$('left > login').html('');
       			login.accesskey = data.token;
       			login.username = username;
       			login.role = data.role;
       			//load left project list
       			theme.sidebarOut();
       			sidebar.LevelOne();
        	},
   	   		error: function(){
   	   			$('left > login > div[name="message"]').html("The username or password you entered is incorrect.");
   	   		}
		}); 
	};
}

var login = new Login();