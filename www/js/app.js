angular.module('rember', ['ionic', 'firebase', 'rember.controllers', 'rember.pushnotification'])

    .run(function($ionicPlatform, $rootScope, $firebaseAuth, $firebase, $window, $ionicLoading, PushProcessingService) {
        $ionicPlatform.ready(function() {
            console.log("yanniboi --------- ionic is ready");
            // Initialise push notifications.
            PushProcessingService.initialize();
                        
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }

            // Global variables.
            $rootScope.userEmail = window.localStorage['userEmail'];
            $rootScope.userName = window.localStorage['userName'];
            $rootScope.rsvped = window.localStorage['rsvped'];
            $rootScope.rsvpStatus = window.localStorage['rsvpStatus'];

            $rootScope.requested = window.localStorage['requested'];
            $rootScope.requestSong = window.localStorage['requestSong'];
            $rootScope.requestSandwich = window.localStorage['requestSandwich'];

            $rootScope.baseUrl = 'https://iona-wedding.firebaseio.com/';
            var authRef = new Firebase($rootScope.baseUrl);
            $rootScope.auth = $firebaseAuth(authRef);

            $rootScope.show = function(text) {
                $rootScope.loading = $ionicLoading.show({
                    content: text ? text : 'Loading..',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                });
            };

            $rootScope.hide = function() {
                $ionicLoading.hide();
            };

            $rootScope.notify = function(text) {
                $rootScope.show(text);
                $window.setTimeout(function() {
                    $rootScope.hide();
                }, 1999);   
            };

            $rootScope.logout = function() {
                $rootScope.auth.$logout();
                $rootScope.checkSession();
            };

            $rootScope.checkSession = function() {
                var auth = new FirebaseSimpleLogin(authRef, function(error, user) {
                    if (error) {
                        // no action yet.. redirect to default route
                        $rootScope.userEmail = null;
                        $window.location.href = '#/auth/signin';
                    } else if (user) {
                        // user authenticated with Firebase
                        $rootScope.userEmail = user.email;
                        $window.location.href = ('#/bucket/rsvp');
                    } else {
                        // user is logged out
                        $rootScope.userEmail = null;
                        $window.location.href = '#/auth/signin';
                    }
                });
            }
        });
    })

    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
        .state('intro', {
            url: '/',
            templateUrl: 'templates/intro.html',
            //template: 'templates/intro.html',
            controller: 'IntroCtrl'
        })
        .state('auth', {
            url: "/auth",
            abstract: true,
            templateUrl: "templates/auth.html"
        })
        .state('auth.signin', {
            url: '/signin',
            views: {
                'auth-signin': {
                    templateUrl: 'templates/auth-signin.html',
                    controller: 'SignInCtrl'
                }
            }
        })
        .state('auth.signup', {
            url: '/signup',
            views: {
                'auth-signup': {
                    templateUrl: 'templates/auth-signup.html',
                    controller: 'SignUpCtrl'
                }
            }
        })
        .state('bucket', {
            url: "/bucket",
            abstract: true,
            templateUrl: "templates/bucket.html"
        })
        .state('bucket.rsvp', {
            url: '/rsvp',
            views: {
                'bucket-rsvp': {
                    templateUrl: 'templates/bucket-rsvp.html',
                    controller: 'RsvpCtrl'
                }
            }
        })
        .state('bucket.map', {
            url: '/map',
            views: {
                'bucket-map': {
                    templateUrl: 'templates/bucket-map.html',
                    controller: 'MapCtrl'
                }
            }
        })
        .state('bucket.request', {
            url: '/request',
            views: {
                'bucket-request': {
                    templateUrl: 'templates/bucket-request.html',
                    controller: 'RequestCtrl'
                }
            }
        })
        .state('bucket.photo-stream', {
            url: '/photo-stream',
            views: {
                'bucket-photo-stream': {
                    templateUrl: 'templates/bucket-photo-stream.html',
                    controller: 'PhotoStreamCtrl'
                }
            }
        })
        $urlRouterProvider.otherwise('/bucket/photo-stream');
    });