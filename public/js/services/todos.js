angular.module('todoService', [])

	// super simple service
	// each function returns a promise object 
	.factory('Todos', ['$http',function($http) {
		return {
			get : function() {
				return $http.get('/api/todos');
			},
			create : function(todoData) {
				console.log('Todo.create()');
				return $http.post('/api/todos', todoData);
			},
			delete : function(id) {
				console.log('todos delete id: ' + id);
				return $http.delete('/api/todos/' + id);
			},
			update : function(pms){
				console.log('todos update id: ' + pms.id + ', text: ' + pms.text);
				var theurl = '/api/todos/'+pms.id;	
				return $http.put(theurl, pms);
			}
		};
	}]);


	angular.module('cgtService', [])

	// super simple service
	// each function returns a promise object 
	.factory('Cgts', ['$http',function($http) {
		return {
			get : function() {
				return $http.get('/api/cgts');
			},
			create : function(cgtData) {
				return $http.post('/api/cgts', cgtData);
			},
			delete : function(id) {
				console.log('cgts delete id: ' + id);
				return $http.delete('/api/cgts/' + id);
			},
			update : function(pms){
				console.log('cgts update id: ' + pms.id + ', text: ' + pms.text);
				var theurl = '/api/cgts/'+pms.id;	
				return $http.put(theurl, pms);
			}
		};
	}]);