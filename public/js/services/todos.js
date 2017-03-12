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