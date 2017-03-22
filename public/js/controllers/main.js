var accountController = angular.module('accountController', [])
.controller('accountController', ['$scope', '$http', '$filter', 'Accounts' , function($scope, $http, $filter, Accounts){

	$scope.formatDate = function(x) {
    	var formattedDate = $filter('date')(new Date(x), "yyyy-MM-dd");
    	return formattedDate;
   	};

// ELAPSED MINUTES
		$scope.elapsedMinutes = function(d1, d2) {
			var d1t = new Date(d1);
			var d2t = new Date(d2);
			var diff = d2t - d1t;
			var result = Math.round(diff /60e3);
			return result;
		};
		// ELAPSED DAYS
		$scope.elapsedDays = function(d2) {
			var d1t = new Date();
			//var d1t = new Date(d1);
			var d2t = new Date(d2);
			//console.log(d1t + ' : ' + d2t);
			var diff = d1t - d2t;
			var result = Math.floor(diff/(1000*60*60*24));
			//var result = Math.round(diff /60e3);
			return result;
		};
		// ISO DATE TO YYMMDD
		/*
		$scope.formatDate = function(d){
		date = new Date(d);
		year = date.getFullYear();
		month = date.getMonth()+1;
		dt = date.getDate();
		if (dt < 10) {
		  dt = '0' + dt;
		}
		if (month < 10) {
		  month = '0' + month;
		}
		return year+'-' + month + '-'+dt; 
		};
		*/

	$scope.account_obj = {
        name: 'account here',
        balance: 0,
        rules: [{percent: 99, rule: '>', amount: 0}],
		startdate: $filter("date")(Date.now(), 'yyyy-MM-dd'),
		enddate: $filter("date")(Date.now(), 'yyyy-MM-dd')
	 };

		// GET =====================================================================
		// when landing on the page, get all cgts and show them
		// use the service to get all the todos
		Accounts.get()
			.success(function(data) {
				$scope.accounts = data;
				$scope.loading = false;
		});
	    // CREATE ==================================================================
		// when submitting the add form, send the text to the node API
		$scope.createAccount = function() {
			// validate the formData to make sure that something is there
			// if form is empty, nothing will happen
			if ($scope.account_obj.name !== undefined) {
				$scope.loading = true;
				// call the create function from our service (returns a promise object)
				Accounts.create($scope.account_obj)
					// if successful creation, call our get function to get all the new todos
					.success(function(data) {
						$scope.loading = false;
						$scope.accounts = data; // assign our new list of todos
					});
			}
		};
		// UPDATE ==================================================================
		$scope.updateAccount = function(id, account_obj) {
			var pms = {'id':id, 'account_obj': account_obj};
			// validate the text to make sure that something is there
			// if text is empty, nothing will happen
			if (account_obj !== undefined) {
				$scope.loading = true;
				// call the create function from our service (returns a promise object)
				Accounts.update(pms)
					// if successful creation, call our get function to get all the new todos
					.success(function(data) {
						$scope.loading = false;
						$scope.accounts = data; // assign our new list of todos
					});
			}
		};
		// ADD RULE ==================================================================
		$scope.addRule = function(id, contentId, account_obj, rule) {
			var pms = {'id':id, 'contentId':contentId, 'account_obj': account_obj, 'rule':rule};
				Accounts.addRule(pms)
		    	// if successful creation, call our get function to get all the new todos
		    	.success(function(data) {
					$scope.loading = false;
					$scope.accounts = data; // assign our new list of todos
				});
		};
		// DELETE RULE ==================================================================
		$scope.deleteRule = function(id, contentId, account_obj, ruleId) {
			var pms = {'id':id, 'contentId':contentId, 'account_obj': account_obj, 'ruleId':ruleId};
				Accounts.deleteRule(pms)
		    	// if successful creation, call our get function to get all the new todos
		    	.success(function(data) {
					$scope.loading = false;
					$scope.accounts = data; // assign our new list of todos
				});
		};
		// ADD ACCOUNT ================================================================
		$scope.addAccount = function(id,account) {
			var pms = {'id':id, 'account_obj': $scope.account_obj};
			pms.account_obj.startdate = new Date(pms.account_obj.startdate).toISOString();
			pms.account_obj.enddate = new Date(pms.account_obj.enddate).toISOString();
			var newaccount = account.account_obj.push(pms.account_obj);
			pms = {'id':id, 'account_obj': account.account_obj};
			// validate the text to make sure that something is there
			// if text is empty, nothing will happen
			if (account.account_obj !== undefined) {
				$scope.loading = true;
				// call the create function from our service (returns a promise object)
				Accounts.update(pms)
					// if successful creation, call our get function to get all the new todos
					.success(function(data) {
						$scope.loading = false;
						$scope.accounts = data; // assign our new list of todos
					});
			}
		};
		// DELETE ==================================================================
		// delete a todo after checking it
		$scope.deleteAccount = function(id) {
			$scope.loading = true;
			Accounts.delete(id)
				// if successful creation, call our get function to get all the new todos
				.success(function(data) {
					$scope.loading = false;
					$scope.accounts = data; // assign our new list of todos
				});
		};
		// DELETE SUB ACCOUNT =======================================================
		$scope.deleteContent = function(id,contentId) {
		    Accounts.deleteContent(id,contentId)
		    	// if successful creation, call our get function to get all the new todos
		    	.success(function(data) {
					$scope.loading = false;
					$scope.accounts = data; // assign our new list of todos
				});
		};
}]);


var cgtConroller = angular.module('cgtController', [])
	.controller('cgtController', ['$scope', '$http', '$filter', 'Cgts', function ($scope, $http, $filter, Cgts) {
	
	$scope.formatDate = function(x) {
    	var formattedDate = $filter('date')(new Date(x), "yyyy-MM-dd");
    	return formattedDate;
   	};

	$scope.cgt_obj = {
        rate: 0,
		startdate: $filter("date")(Date.now(), 'yyyy-MM-dd'),
		enddate: $filter("date")(Date.now(), 'yyyy-MM-dd'),
	 };


		// GET =====================================================================
		// when landing on the page, get all cgts and show them
		// use the service to get all the todos
		Cgts.get()
			.success(function(data) {
				$scope.cgts = data;
				$scope.loading = false;
		});
		// CREATE ==================================================================
		// when submitting the add form, send the text to the node API
		$scope.createCgt = function() {
			// validate the formData to make sure that something is there
			// if form is empty, nothing will happen
			if ($scope.cgt_obj.rate !== undefined) {
				$scope.loading = true;
				// call the create function from our service (returns a promise object);
				Cgts.create($scope.cgt_obj)
					// if successful creation, call our get function to get all the new todos
					.success(function(data) {
						$scope.loading = false;
						$scope.cgts = data; // assign our new list of todos
					});
			}
		};
		// UPDATE ==================================================================
		// when submitting the update form, send the text to the node API
		$scope.updateCgt = function(id, cgt_obj) {
			var pms = {'id':id,'cgt_obj':cgt_obj};
			// validate the text to make sure that something is there
			// if text is empty, nothing will happen
			if (cgt_obj !== undefined) {
				$scope.loading = true;
				// call the create function from our service (returns a promise object)
				Cgts.update(pms)
					// if successful creation, call our get function to get all the new todos
					.success(function(data) {
						$scope.loading = false;
						$scope.cgts = data; // assign our new list of todos
					});
			}
		};
		// ADD =====================================================================
		$scope.addCgt = function(id,cgt) {
			var pms = {'id':id, 'cgt_obj': $scope.cgt_obj};
			pms.cgt_obj.startdate = new Date(pms.cgt_obj.startdate).toISOString();
			pms.cgt_obj.enddate = new Date(pms.cgt_obj.enddate).toISOString();
			var newcgt = cgt.cgt_obj.push(pms.cgt_obj);
			pms = {'id':id, 'cgt_obj': cgt.cgt_obj};
			// validate the text to make sure that something is there
			// if text is empty, nothing will happen
			if (cgt.cgt_obj !== undefined) {
				$scope.loading = true;
				// call the create function from our service (returns a promise object)
				Cgts.update(pms)
					// if successful creation, call our get function to get all the new todos
					.success(function(data) {
						$scope.loading = false;
						$scope.cgts = data; // assign our new list of todos
					});
			}
		};
		// DELETE ==================================================================
		// delete a todo after checking it
		$scope.deleteCgt = function(id) {
			$scope.loading = true;
			Cgts.delete(id)
				// if successful creation, call our get function to get all the new todos
				.success(function(data) {
					$scope.loading = false;
					$scope.cgts = data; // assign our new list of todos
				});
		};
		// DELETE SUB CGT =======================================================
		$scope.deleteContent = function(id,contentId) {
		    Cgts.deleteContent(id,contentId)
		    	// if successful creation, call our get function to get all the new todos
		    	.success(function(data) {
					$scope.loading = false;
					$scope.cgts = data; // assign our new list of todos
				});
		};
}]);