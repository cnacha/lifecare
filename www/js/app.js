// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ionic-material','ionic.cloud', 'ionMdInput','ngCordova','angularjs-gauge','chart.js','ion-datetime-picker'])

.run(function($ionicPlatform, $ionicLoading,$rootScope,$timeout, $ionicPopup) {
	
    $ionicPlatform.ready(function() {
        ionic.Platform.fullScreen();
		var push = PushNotification.init({
			android: {
				"senderID": "1091753368379",
				"iconColor": "#6246a58a",
				"forceShow" : false
			},
			ios: {
				"senderID": "1091753368379",
				"alert": true,
				"badge": true,
				"sound": true
			},
			browser: {
				pushServiceURL: 'http://push.api.phonegap.com/v1/push'
			}
		});

		push.on('registration', function(data) {
		  console.log("registrationId "+data.registrationId);
		  $rootScope.tokenId = data.registrationId;
		});
		
		push.on('notification', function ( data) {
			if($rootScope.isNotificationCalled == undefined ||  !$rootScope.isNotificationCalled){
				$rootScope.isNotificationCalled = true;
				var alertPopup = $ionicPopup.alert({
					title: "ข้อความเตือน",
					template: data.message,
					 buttons: [
					  { text: 'OK',  onTap: function(e) {
							  console.log(e);
							  $rootScope.isNotificationCalled = false;
							  return true; 
							} 
					   }
					 ]
				});
			}
			
		});
		
		//*** Background Mode ***//
		cordova.plugins.backgroundMode.on('enable', function(){
			//your code here, will execute when background tasks is enabled
		//	loop();
		});
		function loop(){
			console.log("loop "+cordova.plugins.backgroundMode.isActive());
			if(cordova.plugins.backgroundMode.isActive()){
			//	cordova.plugins.backgroundMode.moveToForeground();
			}
			$timeout(loop, 1000);
		}
		cordova.plugins.backgroundMode.isScreenOff(function(bool) {
			console.log("isScreenOff "+bool);
			if(true){
			//	cordova.plugins.backgroundMode.wakeUp();
			//	$cordovaNativeAudio.loop('alarmClock');
				//cordova.plugins.backgroundMode.unlock();
			}
		});
		//cordova.plugins.backgroundMode.enable();
    });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider,$ionicCloudProvider) {
	

    // Turn off caching for demo simplicity's sake
    $ionicConfigProvider.views.maxCache(0);

    /*
    // Turn off back button text
	*/
    $ionicConfigProvider.backButton.previousTitleText(false);
 

    $stateProvider.state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })
   
    .state('app.login', {
        url: '/login',
        views: {
            'menuContent': {
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            },
        }
    })
	
	.state('app.logout', {
		url: '/logout',
		views: {
            'menuContent': {
			templateUrl: 'templates/login.html',
			controller: 'LogoutCtrl'
			},
		}
	})
	
	.state('app.welcome', {
		url: '/welcome',
		views: {
            'menuContent': {
			templateUrl: 'templates/welcome.html',
			controller: 'WelcomeCtrl'
			},
		}
	})

    .state('app.home', {
        url: '/home/:showIndex',
        views: {
            'menuContent': {
                templateUrl: 'templates/home.html',
                controller: 'HomeCtrl'
            },
            'fabContent': {
              //  template: '<button id="fab-survey" class="button button-fab button-fab-bottom-right button-energized-900"><i class="icon ion-plus spin"></i></button>',
                controller: function ($timeout) {
                /*    $timeout(function () {
                        document.getElementById('fab-survey').classList.toggle('on');
                    }, 800);
				*/
                }
				
            }
        }
    })
	
	.state('app.addPatient', {
        url: '/addPatient',
        views: {
            'menuContent': {
                templateUrl: 'templates/addPatient.html',
                controller: 'AddPatientCtrl'
            },
            'fabContent': {}
				
        }
    })
	
	 .state('app.register', {
        url: '/register',
        views: {
            'menuContent': {
                templateUrl: 'templates/register.html',
                controller: 'RegisterCtrl'
            },
            'fabContent': {}
            }
    })
	
	.state('app.resetpassword', {
        url: '/resetpassword',
        views: {
            'menuContent': {
                templateUrl: 'templates/resetpassword.html',
                controller: 'ResetPasswordCtrl'
            },
            'fabContent': {}
            }
    })
	
	.state('app.profile', {
        url: '/profile',
        views: {
            'menuContent': {
                templateUrl: 'templates/profile.html',
                controller: 'ProfileCtrl'
            },
            'fabContent': {
                
            }
        }
    })
	
	.state('app.sethome', {
		url: '/sethome',
		views: {
            'menuContent': {
			templateUrl: 'templates/setHome.html',
			controller: 'SetHomeCtrl'
			},
		}
    })
	
	

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/login');
});
