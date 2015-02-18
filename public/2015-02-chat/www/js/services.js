angular.module('dfwFb').factory('FbService', ["$rootScope", "$timeout", "$firebase", function($rootScope, $timeout, $firebase) {

    var ref = new Firebase("https://dfw-firebase.firebaseio.com/");

    var service = {
        fbRef : new Firebase("https://dfw-firebase.firebaseio.com/")
    };

    return service;

}]);