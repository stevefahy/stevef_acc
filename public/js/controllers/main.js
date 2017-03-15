var cgtConroller = angular.module('cgtController', [])
	.controller('cgtController', ['$scope', '$http', 'Cgts', function ($scope, $http, Cgts) {
	    $scope.text = {
	        message: 'Welcome'
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
			if ($scope.formData2.text !== undefined) {
				$scope.loading = true;
				// call the create function from our service (returns a promise object)
				Cgts.create($scope.formData2)
					// if successful creation, call our get function to get all the new todos
					.success(function(data) {
						$scope.loading = false;
						$scope.formData2 = {}; // clear the form so our user is ready to enter another
						$scope.cgts = data; // assign our new list of todos
					});
			}
			
		};
		// UPDATE ==================================================================
		// when submitting the update form, send the text to the node API
		$scope.updateCgt = function(id, text) {
			var pms = {'id':id,'text':text};
			// validate the text to make sure that something is there
			// if text is empty, nothing will happen
			if (text !== undefined) {
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
}]);

var todoController = angular.module('todoController', [])

	// inject the Todo service factory into our controller
	.controller('mainController', ['$scope','$http','Todos', function($scope, $http, Todos) {
		$scope.todo = {};
		$scope.formData = {};
		$scope.loading = true;

		// GET =====================================================================
		// when landing on the page, get all todos and show them
		// use the service to get all the todos
		Todos.get()
			.success(function(data) {
				$scope.todos = data;
				$scope.loading = false;
			});

		// CREATE ==================================================================
		// when submitting the add form, send the text to the node API
		$scope.createTodo = function() {

			// validate the formData to make sure that something is there
			// if form is empty, nothing will happen
			if ($scope.formData.text !== undefined) {
				$scope.loading = true;

				// call the create function from our service (returns a promise object)
				Todos.create($scope.formData)

					// if successful creation, call our get function to get all the new todos
					.success(function(data) {
						$scope.loading = false;
						$scope.formData = {}; // clear the form so our user is ready to enter another
						$scope.todos = data; // assign our new list of todos
					});
			}
		};

		// UPDATE ==================================================================
		// when submitting the update form, send the text to the node API
		$scope.updateTodo = function(id, text) {
			var pms = {'id':id,'text':text};
			// validate the text to make sure that something is there
			// if text is empty, nothing will happen
			if (text !== undefined) {
				$scope.loading = true;
				// call the create function from our service (returns a promise object)
				Todos.update(pms)
					// if successful creation, call our get function to get all the new todos
					.success(function(data) {
						$scope.loading = false;
						$scope.todos = data; // assign our new list of todos
					});
			}
		};

		// DELETE ==================================================================
		// delete a todo after checking it
		$scope.deleteTodo = function(id) {
			$scope.loading = true;
			Todos.delete(id)
				// if successful creation, call our get function to get all the new todos
				.success(function(data) {
					$scope.loading = false;
					$scope.todos = data; // assign our new list of todos
				});
		};
		// ELAPSED MINUTES
		$scope.elapsedMinutes = function(d1, d2) {
			var d1t = new Date(d1);
			var d2t = new Date(d2);
			var diff = d2t - d1t;
			var result = Math.round(diff /60e3);
			return result;
		};

	}]);





	