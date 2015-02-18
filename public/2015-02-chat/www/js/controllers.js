angular.module("dfwFb")

    .controller("AppController", ["$scope", "$ionicModal", "FbService", function($scope, $ionicModal, FbService) {

        var vm = this;

        vm.auth = auth;

        function auth(service) {

            console.log("Authing with " + service);
            FbService.fbRef.authWithOAuthPopup(service, function(error, authData) {
                if (error) {
                    console.log("Login Failed!", error);
                } else {
                    console.log("Authenticated successfully with payload:", authData);
                }
            });
        }

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl("templates/login.html", {
            scope: $scope
        }).then(function(modal) {
                $scope.modal = modal;
            });

        // Triggered in the login modal to close it
        $scope.closeLogin = function() {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.login = function() {
            $scope.modal.show();
        };


    }])

    .controller("ChatRoomsController", ["$scope", "$firebase", "FbService", function($scope, $firebase, FbService) {

        var sync = $firebase( FbService.fbRef.child("dfwChat").child("rooms") );

        var vm = this;
        vm.chatRooms = sync.$asArray();

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
                userName : "justin",
                ts : Firebase.ServerValue.TIMESTAMP
            });
            vm.msg = '';
        }

    }])