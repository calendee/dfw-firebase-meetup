angular.module("dfwFb", ["ionic", "dfwFb", "firebase"])

    .run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })

    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state("app", {
                url: "/app",
                abstract: true,
                templateUrl: "/templates/menu.html",
                controller: "AppController as aCtrl"
            })

            .state("app.chatrooms", {
                url: "/chatrooms",
                views: {
                    "menuContent": {
                        templateUrl: "/templates/chatrooms.html",
                        controller: "ChatRoomsController as crCtrl"
                    }
                }
            })

            .state("app.room", {
                url: "/room/:roomId",
                views: {
                    "menuContent": {
                        templateUrl: "/templates/room.html",
                        controller: "RoomController as rCtrl"
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback


        // Prevent infinite digest with ui-router
        // https://github.com/angular-ui/ui-router/issues/600#issuecomment-47228922
        $urlRouterProvider.otherwise(
            function($injector) {
                var $state = $injector.get("$state");
                $state.go("app.chatrooms");
            });
    });