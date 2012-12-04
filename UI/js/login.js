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
		$("left > logo").after(items.join(''));
		
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
       			login.forward(username, data.token, data.role);
        	},
   	   		error: function(){
   	   			$('left > login > div[name="message"]').html("The username or password you entered is incorrect.");
   	   		}
		}); 
	};
	
	this.displayUserInfo = function(){
		var items = [];
		items.push('<table class="displayusername">');
		items.push('<tr>');
		items.push('<td><img src="headers/' + login.username + '.jpeg" /></td>');
		items.push('<td class="username">' + login.username + '</td>');
		items.push('<td class="signout"><input type="image" src="./images/logout_64.png" /></td>');
		items.push('</tr>');
		items.push('</table>');
		$('left > nav').before(items.join(''));
		
		$('left input[type=image]').unbind('hover').hover(function(){
			$(this).css('opacity', 0.8);
			tooltips.show($(this), 'sign out');			
		}, function(){
			$(this).css('opacity', 0.5);
			tooltips.hide();
		});
		
		$('table.displayusername input[type=image]').unbind('click').click(function(){
//			location.reload(true);
			window.open('http://localhost:8080/COMP9323/WebContent/main.html', '_self');
		});
	};
	
	this.forward = function(username, accesskey, role){
		login.username = username;
		login.accesskey = accesskey;
		login.role = role;
		
		$('left > login').remove();
		
		login.displayUserInfo();
		
		//load left project list
		theme.sidebarOut();
		sidebar.LevelOne();
	};
}

var login = new Login();