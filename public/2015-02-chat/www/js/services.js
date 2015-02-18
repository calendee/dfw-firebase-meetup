angular.module('dfwFb').factory('FbService', ["$firebase", function($firebase) {

    var ref = new Firebase("https://dfw-firebase.firebaseio.com/");

    var service = {
        fbRef : new Firebase("https://dfw-firebase.firebaseio.com/")
    };

    return service;

}]);