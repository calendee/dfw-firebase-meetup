angular.module('meetup', ['firebase', 'ui.grid'])

    .constant('FBREF', 'PUT_YOUR_FIREBASE_URL_HERE_WITH_TRAILING_SLASH')

    .factory('DataService', function($window, FBREF, $firebase) {

        var service = {
            getRef : getRef
        };

        return service;

        function getRef(relativePath) {

            var ref = new $window.Firebase(FBREF + relativePath);
            return $firebase(ref);
        }

    })

    .controller('AttendeesController', function($scope, DataService) {

        var ref = DataService.getRef('attendees');
        $scope.attendees = ref.$asArray();

    })

    .controller('EnrolleesController', function($scope, DataService) {

        var ref = DataService.getRef('enrollees');
        $scope.enrollees = ref.$asArray();

    })