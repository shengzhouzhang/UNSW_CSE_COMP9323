var taskManager = (function Tasks(){
	
	var taskList = [];
	
	var abort = function(PID){
		taskList[PID].abort();
	};
	
	var makeCall = function(type, url, send, success, parameters){
		var PID = taskList.length;
		taskList.push(null);
		taskList[PID] = $.ajax({
			type: type,
        	url: url,
            data: send,
       		success: function (data) {
       			success(data, parameters);
        	}
		});
		return PID;
	};
	
	var getText = function(type, url, send, success, parameters){
		var PID = taskList.length;
		taskList.push(null);
		taskList[PID] = $.ajax({
			type: type,
        	url: url,
            data: send,
            dataType: 'text',
       		success: function (data) {
       			success(data, parameters);
        	}
		});
		return PID;
	};
	
	var print = function(){
		console.log(taskList);
	};
	
	var settings = function(){
		$.ajaxSetup({
			timeout: 60000,
			cache: false,
			contentType: "application/json",
        	dataType: 'json',
			statusCode: {
				404: function() {
					messagebox.show("page not found", 2000, true);
					progressbar.complete();
				},
				500: function() {
//					messagebox.show("Oops time out", 2000, true);
					progressbar.complete();
				}
			}
//			error: function(){
////				messagebox.show("Sorry, servers are busy, please try later", 2000, true);
//	  		}
		});
	};
	settings();
	
	return {
		abort: abort,
		makeCall: makeCall,
		getText: getText,
		print: print,
		GET: 'GET',
		POST: 'POST',
		PUT: 'PUT',
		DELETE: 'DELETE'
	};
})();
