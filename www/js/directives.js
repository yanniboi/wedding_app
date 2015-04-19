angular.module('wedding.directives', [])
    .directive('slider', function ($timeout) {
        return {
            restrict: 'AE',
            replace: true,
            scope:{
                images: '='
            },
            link: function (scope, elem, attrs) {

                scope.currentIndex = 0;

                scope.next = function() {
                    scope.currentIndex < scope.images.length - 1 ? scope.currentIndex++ : scope.currentIndex = 0;
                };

                scope.prev = function() {
                    scope.currentIndex > 0 ? scope.currentIndex-- : scope.currentIndex = scope.images.length - 1;
                };

                scope.onSwipeRight = function () {
                    scope.prev();
                };

                scope.onSwipeLeft = function () {
                    scope.next();
                };

                scope.$watch('currentIndex', function() {
                    scope.images.forEach( function(image) {
                        image.visible = false;
                    });
                    scope.images[scope.currentIndex].visible = true;

                    //scope.images.push({src:'img'+scope.currentIndex+'.png',title:'Pic 1'});
                });

                /* Start: For Automatic slideshow*/

                var timer;

                var sliderFunc = function() {
                    timer = $timeout(function() {
                        scope.next();
                        timer = $timeout(sliderFunc,3000);
                    }, 3000);
                };

                sliderFunc();

                scope.$on('$destroy',function(){
                    $timeout.cancel(timer);
                });

                /* End : For Automatic slideshow*/

            },
            templateUrl:'templates/slider.html'
        }
    })
    // tinder cards
    .directive('noScroll', function($document) {

        return {
            restrict: 'A',
            link: function($scope, $element, $attr) {

                $document.on('touchmove', function(e) {
                    e.preventDefault();
                });
            }
        }
    });