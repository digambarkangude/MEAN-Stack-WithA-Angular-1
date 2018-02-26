app.service("userService", function($http){
	var id = 1;
	this.get = function(){
		return $http.get("http://localhost:3000/list");
	}

	this.getByID = function(id){
		return $http.get("http://localhost:3000/getByID/"+id);
	}

	/*this.insert = function(User){
		return request = $http({
			method:'post',
			url:'http://localhost:3000/insert',
			data: User
		});
	}*/

	this.edit = function(User){
		return request = $http({
			method: 'put',
			url: 'http://localhost:3000/edit/'+User._id,
			data: User
		});
	}

	this.delete = function(id){
		return $http.delete("http://localhost:3000/delete/"+id);
	}

});