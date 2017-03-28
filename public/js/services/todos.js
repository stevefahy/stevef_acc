angular.module('cgtService', [])
    // each function returns a promise object 
    .factory('Cgts', ['$http', function($http) {
        return {
            get: function() {
                return $http.get('/api/cgts');
            },
            create: function(cgtData) {
                return $http.post('/api/cgts', cgtData);
            },
            delete: function(id) {
                return $http.delete('/api/cgts/' + id);
            },
            update: function(pms) {
                var theurl = '/api/cgts/' + pms.id;
                return $http.put(theurl, pms);
            },
            deleteContent: function(id, contentId) {
                return $http.post('/api/cgts/' + id + '/' + contentId);
            }
        };
    }]);

angular.module('accountService', [])
    // each function returns a promise object 
    .factory('Accounts', ['$http', function($http) {
        return {
            get: function() {
                return $http.get('/api/accounts');
            },
            create: function(accountData) {
                return $http.post('/api/accounts', accountData);
            },
            delete: function(id) {
                return $http.delete('/api/accounts/' + id);
            },
            update: function(pms) {
                var theurl = '/api/accounts/' + pms.id;
                return $http.put(theurl, pms);
            },
            deleteContent: function(id, contentId) {
                return $http.post('/api/accounts/' + id + '/' + contentId);
            },
            addRule: function(pms) {
                var theurl = '/api/accounts/' + pms.id + '/' + pms.contentId;
                return $http.put(theurl, pms);
            },
            deleteRule: function(pms) {
                var theurl = '/api/accounts/delete/' + pms.id + '/' + pms.contentId;
                return $http.post(theurl, pms);
            }
        };
    }]);

angular.module('accountPageService', [])
    .factory('summary', ['$filter', function($filter) {

        var summary = {
            'interesttodate': Number,
            'balancetodate': Number,
            'cgt_rate': Number,
            'cgt_start': new Date(),
            'cgt_end': new Date()
        };

        return {
            getSummary: function() {
                return summary;
            },
            elapsedDays: function(d1, d2) {
                // ELAPSED DAYS

                var d1t = new Date(d1);

                var d2t = new Date(d2);

                var diff = d1t - d2t;
                var result = Math.floor(diff / (1000 * 60 * 60 * 24));

                return result;

            },
            formatDateLong: function(x) {
                var formattedDate = $filter('date')(new Date(x), "longDate");
                return formattedDate;
            },
            calculateCGT: function(cgt, amount) {
                var amount_after_tax = Number;
                amount_after_tax = amount - (amount * (cgt / 100));
                return amount_after_tax;
            },
            calculateTotalBalance: function(balance, balanceinterest) {
                var total_balance = 0;
                total_balance = Number(balance) + Number(balanceinterest);
                return total_balance;
            }
        };
    }]);
