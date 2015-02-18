angular.module("dfwFb")

    .controller("AppController", ["$scope", "$ionicModal", "FbService", function($scope, $ionicModal, FbService) {

        var vm = this;

        vm.auth = auth;

        function auth(service) {

            FbService.fbRef.authWithOAuthPopup(service, function(error, authData) {
                if (error) {
                    console.log("Login Failed!", error);
                } else {
                    console.log("Authenticated successfully with payload:", authData);
                    $scope.modal.hide();
                }
            });
        }

        $scope.$on("forceLogin" , function() {
            $scope.login();
        });

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl("templates/login.html", {
            scope: $scope
        }).then(function(modal) {
                $scope.modal = modal;
            });

        // Open the login modal
        $scope.login = function() {
            $scope.modal.show();
        };


    }])

    .controller("ChatRoomsController", ["$rootScope", "$scope", "$timeout", "$firebase", "FbService", function($rootScope, $scope, $timeout, $firebase, FbService) {

        var vm = this;
        vm.chatRooms = [];

        // Register the callback to be fired every time auth state changes
        FbService.fbRef.onAuth(authDataCallback);

        // Create a callback which logs the current auth state
        function authDataCallback(authData) {
            if (authData) {

                console.log("User " + authData.uid + " is logged in with " + authData.provider);
                var sync = $firebase( FbService.fbRef.child("dfwChat").child("rooms") );
                vm.chatRooms = sync.$asArray();


            } else {
                console.log("User is logged out");

                $timeout(function() {
                    $rootScope.$broadcast('forceLogin')
                }, 500);

            }
        }

    }])

    .controller("RoomController", ["$scope", "$stateParams", "$firebase", "FbService", function($scope, $stateParams, $firebase, FbService) {

        var sync = $firebase( FbService.fbRef.child("dfwChat").child("rooms").child($stateParams.roomId).child("msgs"));

        var vm = this;
        vm.title = '';
        vm.msgs = sync.$asArray();
        vm.msg = '';
        vm.sendMessage = sendMessage;
        vm.showFooter = false;

        $scope.$on("$ionicView.loaded", function() {
            vm.showFooter = true;
        })

        FbService.fbRef.child("dfwChat").child("rooms").child($stateParams.roomId).child('name').once("value", function(snapshot) {
            vm.title = snapshot.val();
        });


        function sendMessage() {
            console.log("Adding msg: " + vm.msg);
            vm.msgs.$add({
                msg : vm.msg,
                userName : FbService.fbRef.getAuth().uid,
                ts : Firebase.ServerValue.TIMESTAMP
            });
            vm.msg = '';
        }

    }])