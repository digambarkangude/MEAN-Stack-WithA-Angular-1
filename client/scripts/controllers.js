app.controller('userListController',function($scope, $location, shareData, userService){
	var promise = userService.get();
	var Users = '';
	$scope.currentPage = 1;
	$scope.pageSize = 3;
	promise.then(
		function(result){
			$scope.Users = result.data;

		},
		function(error){
			console.log(error);
		}
		);

	$scope.edit = function(id){
		shareData.value = id;
		$location.path('/edit');
	}

	$scope.delete = function(id){
		var promise = userService.delete(id);
		promise.then(
			function(result){
				alert('Record deleted successfully.');
				var promise = userService.get();

				promise.then(
					function(result){
						$scope.Users = result.data;
						$location.path('/list');

					},
					function(error){
						debugger;
						console.log(error);
					})
			},
			function(error){
				console.log(error);
			}
			);
	}

});

app.controller("userInsertController",function($scope, $location, shareData, userService, Upload, $timeout){
	$scope.submit = function(file){
		file.upload = Upload.upload({
			method:'post',
			url: 'http://localhost:3000/insert',
			data: {data: $scope.User, file: file},
		});
		file.upload.then(function (response) {
			$timeout(function () {
				file.result = response.data;
			});
			if(response.status==200){
				$location.path('/list');
			}
		}, function (response) {
			if (response.status > 0)
				$scope.errorMsg = response.status + ': ' + response.data;
		}, function (evt) {
      		// Math.min is to fix IE which reports 200% sometimes
      		file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      	});
	}

	$("#datepicker").datepicker({ 
		autoclose: true, 
		todayHighlight: true
	}).datepicker('update', new Date());

});

app.controller("userEditController",function($scope, $location, shareData, userService, Upload, $timeout){
	$("#datepicker").datepicker({ 
		autoclose: true, 
		todayHighlight: true
	}).datepicker('update', new Date());

	var promise = userService.getByID(shareData.value);
	promise.then(
		function(result){
			//console.log("users: "+result);
			$scope.User = result.data;
		},
		function(error){
			console.log(error);
		}
		);

	$scope.submit = function(file){
		if(file===undefined){
			var promise = userService.edit($scope.User);
			promise.then(
				function(result){
					alert('Record updated successfully.');
					$location.path('/list');
				},
				function(error){
					console.log(error);
				}
				);
		}else{
			console.log("file: "+file);
			file.upload = Upload.upload({
				method:'put',
				url: 'http://localhost:3000/edit/'+$scope.User._id,
				data: {data: $scope.User, file: file},
			});
			file.upload.then(function (response) {
				$timeout(function () {
					file.result = response.data;
				});
				if(response.status==200){
					$location.path('/list');
				}
			}, function (response) {
				if (response.status > 0)
					$scope.errorMsg = response.status + ': ' + response.data;
			}, function (evt) {
      		// Math.min is to fix IE which reports 200% sometimes
      		file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      	});
		}
	}
});