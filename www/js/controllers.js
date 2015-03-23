angular.module('wedding.controllers', [])
    .controller('IntroCtrl', function($scope, $rootScope, $state, $window) {        
        // Called to navigate to the main app
        $scope.startApp = function() {
            var test = $scope;
            if (this.accessCode == '12345') {
            $state.go('bucket.rsvp');

            // Set a flag that we finished the tutorial
            window.localStorage['didTutorial'] = true;
            }
            else {
                $rootScope.notify("Thats not the right code. Are you an inposter?");
            }
        };

        // Check if the user already did the tutorial and skip it if so
        if(window.localStorage['didTutorial'] === "true") {
            console.log('Skip intro');
            $state.go('bucket.rsvp');
        }
        else{
            setTimeout(function () {
                navigator.splashscreen.hide();
            }, 750);
        }

        // Move to the next slide
        $scope.next = function() {
            $scope.$broadcast('slideBox.nextSlide');
        };

        // Our initial right buttons
        $scope.rightButtons = [
            {
                content: 'Next',
                type: 'button button-clear icon-right ion-chevron-right',
                tap: function(e) {
                    // Go to the next slide on tap
                    $scope.next();
                }
            }
        ];

        // Our initial left buttons
        $scope.leftButtons = [
            {
                content: 'Back',
                type: 'button icon button-clear ion-chevron-left',
                tap: function(e) {
                    // Move to the previous slide
                    $scope.$broadcast('slideBox.prevSlide');
                }
            }
        ];

        // Bind the left and right buttons to the scope
        $scope.leftButtonShow = false;
        $scope.rightButtonShow = true;
        
        // Called each time the slide changes
        $scope.slideChanged = function(index) {

            // Check if we should update the left buttons
            if(index > 0) {
                // If this is not the first slide, give it a back button

                $scope.leftButtonShow = true;
                $scope.rightButtonShow = false;
            } else {
                // This is the first slide, use the default left buttons
                $scope.leftButtonShow = false;
                $scope.rightButtonShow = true;
            }
        };
    })
    /*.controller('SignUpCtrl', ['$scope', '$rootScope', '$firebaseAuth', '$firebase', 'PushProcessingService', '$window', function ($scope, $rootScope, $firebaseAuth, $firebase, PushProcessingService, $window) {
        $scope.user = {
            email: "",
            password: "",
            name: ""
        };
        $scope.createUser = function () {
            var name = this.user.name;
            var email = this.user.email;
            var password = this.user.password;

            if (!email || !password) {
                $rootScope.notify("Please enter valid credentials");
                return false;
            }
          
            //register with google GCM server.
            function gcmSuccessHandler(result) {
                console.info('NOTIFY  pushNotification.register succeeded.  Result = '+result);
            }
            function gcmErrorHandler(error) {
                console.error('NOTIFY  '+error);
            }

            window.localStorage['userName'] = name;
            window.localStorage['userEmail'] = email;
            $rootScope.show('Please wait.. Registering');
            $rootScope.auth.$createUser(email, password, function (error, user) {
                if (!error) {
                    $rootScope.hide();
                    $rootScope.userEmail = user.email;

                    // Register Push notifications.
                    var pushNotification = window.plugins.pushNotification;
                    pushNotification.register(gcmSuccessHandler, gcmErrorHandler, {"senderID":"980621160609","ecb":"onNotificationGCM"});

                    $window.location.href = ('#/bucket/rsvp');
                }
                else {
                    $rootScope.hide();
                    if (error.code == 'INVALID_EMAIL') {
                        $rootScope.notify('Invalid Email Address');
                    }
                    else if (error.code == 'EMAIL_TAKEN') {
                        $rootScope.notify('Email Address already taken');
                    }
                    else {
                        $rootScope.notify('Oops something went wrong. Please try again later');
                    }
                }
            });
        }
    }])

.controller('SignInCtrl', [
  '$scope', '$rootScope', '$firebaseAuth', '$window',
  function ($scope, $rootScope, $firebaseAuth, $window) {
     // check session
     //$rootScope.checkSession();
     $scope.user = {
        email: "",
        password: ""
     };
     $scope.validateUser = function () {
        $rootScope.show('Please wait.. Authenticating');
        var email = this.user.email;
        var password = this.user.password;
        if (!email || !password) {
           $rootScope.notify("Please enter valid credentials");
           return false;
        }
        $rootScope.auth.$login('password', {
           email: email,
           password: password
        })
        .then(function (user) {
          $rootScope.hide();
          $rootScope.userEmail = user.email;
          $window.location.href = ('#/bucket/rsvp');
        }, function (error) {
          $rootScope.hide();
          if (error.code == 'INVALID_EMAIL') {
            $rootScope.notify('Invalid Email Address');
          }
          else if (error.code == 'INVALID_PASSWORD') {
            $rootScope.notify('Invalid Password');
          }
          else if (error.code == 'INVALID_USER') {
            $rootScope.notify('Invalid User');
          }
          else {
            $rootScope.notify('Oops something went wrong. Please try again later');
          }
        });
     }
  }
])*/

  .controller('RsvpCtrl', ['$scope', '$rootScope', '$firebase', '$ionicModal', 'Internet', function ($scope, $rootScope, $firebase, $ionicModal, Internet) {
      $scope.name = window.localStorage['userName']; 
        
      $ionicModal.fromTemplateUrl('templates/newRsvp.html', function(modal) {
          $scope.newRsvp = modal;
      });
      
      $scope.doRsvp = function() {
          var online = Internet.check();
          if (online) {
              $scope.newRsvp.show();
          }
          else {
              Internet.notify();
          }
      };
      
      $rootScope.$watch('rsvpStatus', function() {
          $scope.rsvpStatus = $rootScope.rsvpStatus;
      });
      
      $rootScope.$watch('rsvped', function() {
          $scope.rsvped = $rootScope.rsvped;
      }); 
    }])

  .controller('MapCtrl', ['$scope', '$rootScope', '$firebase', '$ionicModal', function ($scope, $rootScope, $firebase, $ionicModal) {        
        $scope.openMapLowry = function () {
            window.open("https://maps.google.com/?q=53.470905, -2.295800", "_system");
        };
        $scope.openMapIvy = function () {
            window.open("https://maps.google.com/?q=53.419262, -2.237238", "_system");
        };
    }])

    .controller('newRsvpCtrl', function($rootScope, $scope, $window, $firebase) {
        $scope.rsvp = {
            name: $rootScope.userName,
            email: $rootScope.userEmail,
            status: 0
        };

        $scope.close = function() {
            $scope.modal.hide();
        };

        $scope.createNew = function() {
            var rsvp  = {
                name: this.rsvp.name,
                email: this.rsvp.email,
                phone: this.rsvp.phone,
                dietary: this.rsvp.dietary,
                status: this.rsvp.status,
                created: Date.now(),
                updated: Date.now()
            };
            
            $rootScope.rsvped = window.localStorage['rsvped'] = true;
            $rootScope.rsvpStatus = window.localStorage['rsvpStatus'] = this.rsvp.status;
            
            $scope.modal.hide();
            //$rootScope.show();
            $rootScope.show("Please wait... Creating new");

            var bucketListRef = new Firebase($rootScope.baseUrl + 'rsvps');
            $firebase(bucketListRef).$add(rsvp);
            $rootScope.hide();
        };
    })

  .controller('RequestCtrl', ['$scope', '$rootScope', '$firebase', '$ionicModal', 'Internet', function ($scope, $rootScope, $firebase, $ionicModal, Internet) {        
       $scope.name = window.localStorage['userName']; 
       $scope.request = {
           song: $rootScope.requestSong,
           sandwich: $rootScope.requestSandwich
       };
        
      $ionicModal.fromTemplateUrl('templates/newRequest.html', function(modal) {
          $scope.newRequest = modal;
      });
      
      $scope.doRequest = function() {
          if (Internet.check()) {
              $scope.newRequest.show();
          }
          else {
              Internet.notify();
          }
      };
      
      $rootScope.$watch('requested', function() {
          $scope.requested = $rootScope.requested;
      });
      
      $rootScope.$watch('requestSong', function() {
          $scope.request.song = $rootScope.requestSong;
      }); 
      $rootScope.$watch('requestSandwich', function() {
          $scope.request.sandwich = $rootScope.requestSandwich;
      });

    }])

    .controller('newRequestCtrl', function($rootScope, $scope, $window, $firebase) {
        $scope.request = {
            name: $rootScope.userName
        };

        $scope.close = function() {
            $scope.modal.hide();
        };

        $scope.createNew = function() {
            var request  = {
                first_name: this.request.name,
                song: this.request.song,
                sandwich: this.request.sandwich
            };
            
            $rootScope.requested = window.localStorage['requested'] = true;
            $rootScope.requestSong = window.localStorage['requestSong'] = request.song;
            $rootScope.requestSandwich = window.localStorage['requestSandwich'] = request.sandwich;

            $scope.modal.hide();
            //$rootScope.show();
            $rootScope.show("Please wait... Creating new");

            var bucketListRef = new Firebase($rootScope.baseUrl + 'requests');
            $firebase(bucketListRef).$add(request);
            $rootScope.hide();
        };
    })

.controller('myListCtrl', function($rootScope, $scope, $window, $ionicModal, $firebase) {
  $rootScope.show("Please wait... Processing");
  $scope.list = [];
  var bucketListRef = new Firebase($rootScope.baseUrl + escapeEmailAddress($rootScope.userEmail));
  bucketListRef.on('value', function(snapshot) {
    var data = snapshot.val();
 
    $scope.list = [];
 
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        if (data[key].isCompleted == false) {
          data[key].key = key;
          $scope.list.push(data[key]);
        }
      }
    }
 
    if ($scope.list.length == 0) {
      $scope.noData = true;
    } else {
      $scope.noData = false;
    }
    $rootScope.hide();
  });
 
  $ionicModal.fromTemplateUrl('templates/newItem.html', function(modal) {
    $scope.newTemplate = modal;
  });
 
  $scope.newTask = function() {
    $scope.newTemplate.show();
  };
 
  $scope.markCompleted = function(key) {
    $rootScope.show("Please wait... Updating List");
    var itemRef = new Firebase($rootScope.baseUrl + escapeEmailAddress($rootScope.userEmail) + '/' + key);
    itemRef.update({
      isCompleted: true
    }, function(error) {
      if (error) {
        $rootScope.hide();
        $rootScope.notify('Oops! something went wrong. Try again later');
      } else {
        $rootScope.hide();
        $rootScope.notify('Successfully updated');
      }
    });
  };
 
  $scope.deleteItem = function(key) {
    $rootScope.show("Please wait... Deleting from List");
    var itemRef = new Firebase($rootScope.baseUrl + escapeEmailAddress($rootScope.userEmail));
    bucketListRef.child(key).remove(function(error) {
      if (error) {
        $rootScope.hide();
        $rootScope.notify('Oops! something went wrong. Try again later');
      } else {
        $rootScope.hide();
        $rootScope.notify('Successfully deleted');
      }
    });
  };
})

.controller('newCtrl', function($rootScope, $scope, $window, $firebase) {
  $scope.data = {
    item: ""
  };
 
  $scope.close = function() {
    $scope.modal.hide();
  };
 
  $scope.createNew = function() {
    var item = this.data.item;
 
    if (!item) return;
 
    $scope.modal.hide();
    $rootScope.show();
    $rootScope.show("Please wait... Creating new");
 
    var form = {
      item: item,
      isCompleted: false,
      created: Date.now(),
      updated: Date.now()
    };
 
    var bucketListRef = new Firebase($rootScope.baseUrl + escapeEmailAddress($rootScope.userEmail));
    $firebase(bucketListRef).$add(form);
    $rootScope.hide();
  };
})

    .controller('PhotoStreamCtrl', function($rootScope, $scope, $window, $firebase, $state, Internet) {
        if (!Internet.check()) {
            Internet.notify();
            setTimeout(function(){$state.go('bucket.rsvp')}, 1000);
            return;

        }

        $rootScope.show("Loading pictures...");
        $scope.list = [];

        var bucketListRef = new Firebase($rootScope.baseUrl + 'photo_stream');
        var query = bucketListRef.limit(1);
        query.on('value', function(snapshot) {
            $scope.list = [];
            var data = snapshot.val();

            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    //if (data[key].isCompleted == true) {
                    data[key].key = key;
                    $scope.list.push(data[key]);
                    //}
                }
            }
            if ($scope.list.length == 0) {
                $scope.noData = true;
            } else {
                $scope.noData = false;
            }

            $rootScope.hide();
        });

        $scope.doPicture = function () {
            // Retrieve image file location from specified source
            navigator.camera.getPicture(
                uploadPhoto,
                function(message) {
                    alert('get picture failed');
                },
                {
                    quality: 75,
                    destinationType: navigator.camera.DestinationType.FILE_URI,
                    sourceType: navigator.camera.PictureSourceType.CAMERA
                }    
            );
        }  

        $scope.uploadPicture = function () {
            // Retrieve image file location from specified source
            navigator.camera.getPicture(
                uploadPhoto,
                function(message) {
                    alert('get picture failed');
                },
                {
                    quality: 50, 
                    destinationType: navigator.camera.DestinationType.FILE_URI,
                    sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
                    //sourceType: navigator.camera.PictureSourceType.SAVEDPHOTOALBUM
                }
            );

        }

        function uploadPhoto(imageURI) {
            window.resolveLocalFileSystemURI(imageURI, function(fileEntry){
                fileEntry.file(function(fileObj) {
                    //if(fileObj.size < 1048576){
                        var fileName = fileObj.fullPath;
                        var options = new FileUploadOptions();
                        options.fileKey = "ReferenceName";
                        options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
                        options.mimeType="image/jpeg";
                        options.chunkedMode = false;
                        var ft = new FileTransfer();
                        ft.upload(fileName, "http://wedding.yanandcat.co.uk/upload", win, fail, options);
                    //}
                });
            });
        }

        function win(r) {
            console.log("Code = " + r.responseCode);
            console.log("Response = " + r.response);
            console.log("Sent = " + r.bytesSent);
            $rootScope.notify("Upload successful!");
        }

        function fail(error) {
            $rootScope.notify("A error has occurred: Code = " + error.code);
            console.log("An error has occurred: Code = " + error.code);
        }
    })

.controller('completedCtrl', function($rootScope, $scope, $window, $firebase) {
  $rootScope.show("Please wait... Processing");
  $scope.list = [];
 
  var bucketListRef = new Firebase($rootScope.baseUrl + escapeEmailAddress($rootScope.userEmail));
  bucketListRef.on('value', function(snapshot) {
    $scope.list = [];
    var data = snapshot.val();
 
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        if (data[key].isCompleted == true) {
          data[key].key = key;
          $scope.list.push(data[key]);
        }
      }
    }
    if ($scope.list.length == 0) {
      $scope.noData = true;
    } else {
      $scope.noData = false;
    }
 
    $rootScope.hide();
  });
 
  $scope.deleteItem = function(key) {
    $rootScope.show("Please wait... Deleting from List");
    var itemRef = new Firebase($rootScope.baseUrl + escapeEmailAddress($rootScope.userEmail));
    bucketListRef.child(key).remove(function(error) {
      if (error) {
        $rootScope.hide();
        $rootScope.notify('Oops! something went wrong. Try again later');
      } else {
        $rootScope.hide();
        $rootScope.notify('Successfully deleted');
      }
    });
  };
});

function escapeEmailAddress(email) {
  if (!email) return false
  // Replace '.' (not allowed in a Firebase key) with ','
  email = email.toLowerCase();
  email = email.replace(/\./g, ',');
  return email.trim();
}
