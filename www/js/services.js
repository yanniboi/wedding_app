angular.module('wedding.services', [])
    .factory('UserService', function ($resource) {
        return $resource('http://yanandcat.dev/rsvp/:pid',{pid: "@pid"});
    })

    .service('Internet', ['$rootScope', '$ionicPopup', '$window', function ($rootScope, $ionicPopup, $window) {
        this.check = function () {
            if (typeof navigator.connection === 'undefined') {
                return true;
            }
            if (navigator.connection.type == Connection.NONE) {
                return false;
            }
            return true;
        };
        
        this.notify = function () {
            $rootScope.notify('No internet connection.');
        };
        
    }]);
