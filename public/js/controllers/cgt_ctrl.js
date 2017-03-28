var cgtConroller = angular.module('cgtController', [])
    .controller('cgtController', ['$scope', '$http', '$filter', 'Cgts', 'summary', function($scope, $http, $filter, Cgts, summary) {

        $scope.summary = summary;
        var s = summary;

        var today = new Date();
        var year = new Date().getFullYear();
        var start_date;
        var history = false;

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
                getCgt();
            });
        // Get current CGT rate
        getCgt = function() {
            angular.forEach($scope.cgts, function(value, index) {
                angular.forEach(value.cgt_obj, function(value2, index2) {
                	// starts before today
                    if (s.elapsedDays(today, value2.startdate) > 0) {
                        // ends before today
                        if (s.elapsedDays(today, value2.enddate) > 0) {
                            //
                        } else {
                            // ends after today (and starts before today - current period)
                            $scope.summary.cgt_rate = value2.rate;
                            $scope.summary.cgt_start = value2.startdate;
                            $scope.summary.cgt_end = value2.enddate;
                        }
                    } else {
                        // future start date
                    }
                });
            });
        };
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
            var pms = { 'id': id, 'cgt_obj': cgt_obj };
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
        $scope.addCgt = function(id, cgt) {
            var pms = { 'id': id, 'cgt_obj': $scope.cgt_obj };
            pms.cgt_obj.startdate = new Date(pms.cgt_obj.startdate).toISOString();
            pms.cgt_obj.enddate = new Date(pms.cgt_obj.enddate).toISOString();
            var newcgt = cgt.cgt_obj.push(pms.cgt_obj);
            pms = { 'id': id, 'cgt_obj': cgt.cgt_obj };
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
        $scope.deleteContent = function(id, contentId) {
            Cgts.deleteContent(id, contentId)
                // if successful creation, call our get function to get all the new todos
                .success(function(data) {
                    $scope.loading = false;
                    $scope.cgts = data; // assign our new list of todos
                });
        };
    }]);
