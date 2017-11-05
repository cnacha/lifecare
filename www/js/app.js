// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ionic-material','ionic.cloud', 'ionMdInput','ngCordova','angularjs-gauge','chart.js','ion-datetime-picker'])

.run(function($ionicPlatform, $ionicLoading,$rootScope,$cordovaNativeAudio,$timeout) {
	
    $ionicPlatform.ready(function() {
		// ChartJS
        Chart.defaults.global.defaultFontColor = 'rgba(255, 255, 255, 0.8)';
		Chart.defaults.global.defaultFontFamily = "'Prompt', sans-serif";
		Chart.defaults.global.defaultFontSize = 12;
		Chart.defaults.global.legend.labels.boxWidth = 20;
		Chart.defaults.global.colors  =  ['#2fb8e1','#306c81','#a3dcdf','#c5dce6','#78ffff','#2ba8cd','#2c6376','#95c8cb','#b4c8d2','#6ee8e8'];
		
		navigator.geolocation.getCurrentPosition(function(pos) {
			console.log("current position "+pos);
		});
		$cordovaNativeAudio
			.preloadSimple('alarmClock', 'audio/alarm.mp3')
			.then(function (msg) {
			  console.log(msg);
			  // $cordovaNativeAudio.play('alarmClock');
			}, function (error) {
			//  alert(error);
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
	
	$ionicCloudProvider.init({
        "core": {
            "app_id": "6246a58a"
        },
        "push": {
            "sender_id": "1091753368379",
            "pluginConfig": {
                "ios": {
                "badge": true,
                "sound": true
                },
                "android": {
                "iconColor": "#343434"
                }
            }
        }
    });

	
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