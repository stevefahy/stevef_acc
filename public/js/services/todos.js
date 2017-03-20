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
				return $http.delete('/api/cgts/' + id);
			},
			update : function(pms){
				var theurl = '/api/cgts/'+pms.id;	
				return $http.put(theurl, pms);
			},
			deleteContent: function(id,contentId) {    
        		return $http.post('/api/cgts/'+ id + '/' + contentId);
       		}
		};
	}]);

angular.module('accountService', [])
	// super simple service
	// each function returns a promise object 
	.factory('Accounts', ['$http',function($http) {
		return {
			get : function() {
				return $http.get('/api/accounts');
			},
			create : function(accountData) {
				return $http.post('/api/accounts', accountData);
			},
			delete : function(id) {
				return $http.delete('/api/accounts/' + id);
			},
			update : function(pms){
				var theurl = '/api/accounts/'+pms.id;	
				return $http.put(theurl, pms);
			},
			deleteContent: function(id,contentId) {    
        		return $http.post('/api/accounts/'+ id + '/' + contentId);
       		}
		};
	}]);