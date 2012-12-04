function Group(){
	
	this.selectedgroup = null;
	this.pageId = null;
	this.selectedgroupname = null;
	
	this.createGroupDialog = function(){
		var items = [];
		items.push('<div id="creategroup">');
		items.push('<table class="creategroup" cellspacing="0" width="80%" align="center">');
		items.push('<caption> </caption>');
		items.push('<tr>');
		items.push('<th scope="col">GroupName</th>');
		items.push('<th scope="col">TutorId</th>');
		items.push('<th scope="col">MemberId</th>');
//		items.push('<th scope="col">MemberName</th>');
		items.push('</tr>');
		items.push('<tr>');
		items.push('<td class="row"><input type="text"  name="GroupName"></td>');
		items.push('<td class="row" ><input type="text" name="TutorId"></td>');
		items.push('<td class="row"><input type="text" name="Member1Id"></td>');
//		items.push('<td class="row"><input type="text" name="Member1Name"></td>');
		items.push('</tr>');
		items.push('<tr>');
		items.push('<td class="row"></td>');
		items.push('<td class="row"></td>');
		items.push('<td class="row"><input type="text" name="Member2Id"></td>');
//		items.push('<td class="row"><input type="text" name="Member2Name"></td>');
		items.push('</tr>');
		items.push('<tr>');
		items.push('<td class="row"></td>');
		items.push('<td class="row"></td>');
		items.push('<td class="row"><input type="text" name="Member3Id"></td>');
//		items.push('<td class="row"><input type="text" name="Member3Name"></td>');
		items.push('</tr>');
		items.push('<tr>');
		items.push('<td class="row"></td>');
		items.push('<td class="row"></td>');
		items.push('<td class="row"><input type="text"name="Member4Id"></td>');
//		items.push('<td class="row"><input type="text" name="Member4Name"></td>');
		items.push('</tr>');
		items.push('</table>');
		items.push('</div>');
		tabs.append(group.pageId, items.join(''), 0);
	};
	
	
	this.CreateGroup = function(creategroupjson){
		var prefix = "http://localhost:8080/CodeManagement/rest";
		var createGroup = prefix + "/group/" + login.username + "/" + login.accesskey + "/" + 
				sidebar.selectedcourse + "/" + sidebar.selectedproject;
//		var send = '{"groupName": "Group15", "tutorId": "person03", "accountIDs": [ {"accountName": "person02"} ]}';

		var send = JSON.stringify(creategroupjson);
		console.log(creategroupjson);
		//console.log(send);
		rest.abort(false);
		rest.callrest = $. ajax({
			type: "POST",
        	url: createGroup,
        	dataType: 'json',
        	data: send,
        	contentType: "application/json",
       		success: function (data) {
       			progressbar.complete();
       			messagebox.show("A group has created.", 2000, false);
       			console.log(data);
        	},
   	   		error: function(){
   	   			
   	   			console.log("error");
   	   		}
		}); 
	};
	
//	this.GetGroupList = function(username, accesskey, course, project){
//		console.log(rest.GroupList(username, accesskey, course, project));
//		var items = [];
//		$. ajax({
//			type: "GET",
//        	url: rest.GroupList(username, accesskey, course, project),
//        	contentType: "application/json",
//        	dataType: 'json',
//            cache: false,
//       		success: function (data) {
//       			console.log('getting group info');
//       			console.log(data);
//       			$.each(data, function(key, val) {
//    				//get default group for students
//    				if(key === 0){
//    					group.selectedgroup = val.groupId;
//    					repo.getRepo(username, accesskey, course, project, group.selectedgroup);
//    					
//    				}
//    				items.push(val.groupId);
//    			});
//        	},
//   	   		error: function(){
//   	   			console.log("Error: cann't get group info");
//   	   		}
//		}); 
//		return items;
//	};
	
	this.GetGroupList = function(username, accesskey, course, project){
		var items = [];
		this.selectedcourse = course;
		this.selectedproject = project;
		this.username = username;
		
		rest.abort(false);
		rest.callrest = $. ajax({
			type: "GET",
        	url: rest.GroupList(username, accesskey, course, project),
        	contentType: "application/json",
        	dataType: 'json',
            cache: false,
       		success: function (data) {
       			
       			if(login.role === 'student'){
       				
       				$.each(data, function(key, val) {
	       				if(key === 0){
	    					group.selectedgroup = val.groupId;
	    					repo.getRepo(username, accesskey, course, project, group.selectedgroup);
	       				}
       				});

       			}else{
	       			items.push('<ul id=groupElements class="comments">');
	       			$.each(data, function(key, val) {
	       					
	    				items.push('<li><div class="header"><span class="author"><span id="' + val.groupId + '" class="repoGroup" title="Click to view group repository"><b>' + val.groupName + "</b></span>" + '</span><span>tutored by</span><span class="file">' + val.tutorId +  
						'</span><span id="' + val.groupId + '" class="mod" title="Click to modify group">Modify</span></div>');
	    				$.each(val.members, function(key2, val2) {
	    					items.push('<p class="changes">' + val2.memberName + '<span id="' + val2.groupId + '" href="#" style="float:right">' + val2.memberId + '</span></p>');
	    				});
	    				items.push('</li>');
	    			});
	    			items.push('</ul>');
	    			group.pageId = tabs.Insert("Groups", items.join(''), false);
	    			items = [];
	    			items.push('<div id=createGrp class="comments"><span><center><b> Create Group </b></center></span></div>'); //Need to align properly, Steven to look at this
	    			$("ul#groupElements").after(items.join(''));
	
	    			group.createButton();
	    			group.modifier();
	    			group.callRepo();
	    			group.createGroupDialog();
	    			
	    			$('main').css('display', 'none').fadeIn('slow');
	    			progressbar.complete();
       			}
       		},
       	   	error: function(){
       	   		console.log("Error: cann't get group info");
       	   	}
    	});
       	return items;
	};
    				
	this.callRepo = function(){
		$(".repoGroup").click(function(){
			progressbar.show(true);
			group.selectedgroupname = $(this).find('b').html();
			group.selectedgroup = $(this).attr("id");
			console.log("Call Rego for " + $(this).attr("id"));
			repo.getRepo(login.username, login.accesskey, sidebar.selectedcourse, sidebar.selectedproject, group.selectedgroup, false);
		});
		
		$(".repoGroup").unbind('hover').hover(function(){
			messagebox.slideIn("Go to students repository");
		}, function(){
			messagebox.slideOut();
		});
	};
	
	this.createButton = function(){
		$("#createGrp span").click(function(){
			$( "#creategroup" ).dialog({
				align:"center",
				modal: true,
				height:300,
				width:718,
				resizable: false,
				buttons: { Create: function() {
					progressbar.show(true);
					var GroupName = $.trim($('#creategroup input[name="GroupName"]').val());
					var TutorId = $.trim($('#creategroup input[name="TutorId"]').val());
					var Member1Id = $.trim($('#creategroup input[name="Member1Id"]').val());
					var Member2Id = $.trim($('#creategroup input[name="Member2Id"]').val());
					var Member3Id = $.trim($('#creategroup input[name="Member3Id"]').val());
					var Member4Id = $.trim($('#creategroup input[name="Member4Id"]').val());
					creategroupjson = {"groupName": GroupName, "tutorId": TutorId, "memberIds": []};
					if(GroupName.length != 0){
						if(TutorId.length != 0){
							if(Member1Id.length != 0)
								creategroupjson.memberIds.push({"memberId": Member1Id});
							if(Member2Id.length != 0)
								creategroupjson.memberIds.push({"memberId": Member2Id});
							if(Member3Id.length != 0)
								creategroupjson.memberIds.push({"memberId": Member3Id});
							if(Member4Id.length != 0)
								creategroupjson.memberIds.push({"memberId": Member4Id});
							console.log(creategroupjson);
							console.log(creategroupjson.memberIds);
							if(creategroupjson.memberIds.length != 0){
								group.CreateGroup(creategroupjson);
								$( this ).dialog( "close" );
							}else{
								messagebox.show('Please enter group members infor.', 3000, true);
								progressbar.complete();
							}
						}else{
							messagebox.show('Please enter tutorId.', 3000, true);
							progressbar.complete();
						}
					}else{
						messagebox.show('Please enter group name.', 3000, true);
						progressbar.complete();
					}
				}}
			});
		});
		
		$("#createGrp span").unbind('hover').hover(function(){
			messagebox.slideIn("Create a new group");
		}, function(){
			messagebox.slideOut();
		});
	};
	
	this.modifier = function(){
		mod_window=null;
		$(".mod").click(function(){
			if(mod_window != null){
				mod_window.close();
			}
			group.selectedgroup = $(this).attr("id");
			mod_window = null;
			
			if(mod_window == null){
				var Mod_URL = "http://localhost:8080/Modify_group.html?"
					+ "accesskey=" + login.accesskey + "&"
					+ "username=" + group.username + "&"
					+ "groupID=" + group.selectedgroup + "&" 
					+ "courseID=" + group.selectedcourse + "&" 
					+ "projectID=" + group.selectedproject;
				
				var w=500;                        
				var h=600;                       
				var l=(screen.width-w)/2;        
				var t=(screen.height-h)/2; 
				var features="left="+l+",top="+t+",width="+w+",height="+h+",scrollbars=auto";
				
				mod_window=window.open(Mod_URL,"Modify " + group.selectedgroup, features);//directories=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,
			}
			if (window.focus) {mod_window.focus();}
			//group.Select($(this));
		});
	};

}

var group = new Group();