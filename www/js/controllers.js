/* global angular, document, window */
'use strict';

var defaulturl = 'app.home';
//var URL_PREFIX = 'http://localhost:8888';
var URL_PREFIX = 'https://lgserv-176108.appspot.com';

angular.module('starter.controllers', ['ionic','ionic.cloud'])

.factory('methodFactory', function () {
    return { reset: function () {
            console.log("methodFactory - reset");
			window.localStorage.setItem('user', null);
    }
}})

.controller('AppCtrl', function($scope,$rootScope,$ionicPopup, $ionicModal,$ionicLoading, $ionicPopover, $timeout,$state,$http, $cordovaCamera,$cordovaNativeAudio) {
    // Form data for the login modal
    $scope.loginData = {};
    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;
	$scope.URL_PREFIX = URL_PREFIX;

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }

    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.hideNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };
	
	$rootScope.showIndex = 0; 

    $scope.setExpanded = function(bool) {
        $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function(location) {
        var hasHeaderFabLeft = false;
        var hasHeaderFabRight = false;

        switch (location) {
            case 'left':
                hasHeaderFabLeft = true;
                break;
            case 'right':
                hasHeaderFabRight = true;
                break;
        }

        $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }

    };

    $scope.hideHeader = function() {
        $scope.hideNavBar();
        $scope.noHeader();
    };

    $scope.showHeader = function() {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.clearFabs = function() {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length && fabs.length > 1) {
            fabs[0].remove();
        }
    };
	
	/**  
	 $rootScope.$on('cloud:push:notification', function(event, data) {
		var msg = data.message;
		//$rootScope.messages = window.localStorage.getItem("messages");
		//$rootScope.messages.push(msg);
		//window.localStorage.setItem("messages", $scope.messages);
		//alert("message "+msg.title + ': ' + msg.text);
		$rootScope.hasMessage = true;
		console.log("message "+msg.title + ": " + msg.text);
		//$cordovaNativeAudio.loop('alarmClock');
		 var alertPopup = $ionicPopup.alert({
			 title: msg.title,
			 template: msg.text,
			  buttons: [
              { text: 'OK',  onTap: function(e) {
					  console.log(e);
					 // $cordovaNativeAudio.stop('alarmClock');
					  return true; 
					} 
			   }
             ]
		  });
		  
		//$scope.messages = msg;
	});
	
	**/
	
	$scope.translateStatus = function(status){
		console.log("translateStatus called");
		
		if(status == 'normal'){
			return "ปรกติ";
		} else if(status == 'alert'){
			return "ฉุกเฉิน"
		}else if(status == 'beware'){
			return "เฝ้าระวัง";
		} else
			return status;
	}
	
	$rootScope.statusTH = function(st){
			if(st == 'calling')
				return 'โทรเรียกฉุกเฉิน';
			if(st == 'responded')
				return 'ตอบรับการโทรเรียก';
			if(st == 'assigned')
				return 'รอศูนย์บริการฉุกเฉิน';
			if(st == 'pickingup')
				return 'กำลังเดินทางรับผู้ป่วย';
			if(st == 'atpatient')
				return 'รถพยาบาลถึงผู้ป่วยแล้ว';
			if(st == 'delivered')
				return 'ผู้ป่วยถึงโรงพยาบาล';
			if(st == 'closed')
				return 'ปิดคำขอบริการ';
	}
	
	$scope.getTimeStamp = function(){
		return (new Date()).getTime();
	}
})

.controller('LoginCtrl', function($scope,$rootScope, $state, $timeout,$ionicPush, $ionicSideMenuDelegate, $stateParams, ionicMaterialInk, $location, $http, $cordovaOauth, $ionicLoading, $ionicPopup) {
	
	var uObj = window.localStorage.getItem('user');
    console.log('LoginCtrl - Existing user: '+window.localStorage.getItem('user'));
    $timeout(function() {
		if(uObj != 'null'){
				  console.log('this user alraldy login so go to homepage : authorizationKey = '+JSON.parse(uObj).authorizationKey);
				  $http.defaults.headers.common['___authorizationkey'] = JSON.parse(window.localStorage.getItem('user')).authorizationKey;
				  $state.go(defaulturl);
				  return;
		 }
	 }, 100);
	$scope.$parent.clearFabs();
    $timeout(function() {
        $scope.$parent.hideHeader();
   }, 0);
	$ionicSideMenuDelegate.canDragContent(false);
    ionicMaterialInk.displayEffect();
	
	$scope.formData = {};
	$scope.formData.appRole = "CareGiver";
	$scope.ksmLogin = function() {
		$ionicLoading.show();
		var headers = { 'Content-Type':'application/json' };
		$http.post(URL_PREFIX+"/api/security/login.do",JSON.stringify($scope.formData),headers).
			success(function(data, status, headers, config) 
			{
				$ionicLoading.hide();
				//console.log("xxx"+JSON.stringify(data));
				if(data != ''){
					window.localStorage.setItem('user',JSON.stringify(data));
					
					$http.get(URL_PREFIX + "/api/security/pushtoken/save.do?tokenKey=" +  $rootScope.tokenId + "&userId=" + data.id)
						.then(function (res) {
							console.log('Update Device Token for ' + data.id + ' success');
						}, function (err) {
							console.error('ERR', JSON.stringify(err));
						});
					
					$state.go(defaulturl);
					// set header for authorization key
					$http.defaults.headers.common['___authorizationkey'] = data.authorizationKey;
				}else{
					 var alertPopup = $ionicPopup.alert({
					 title: 'Security Alert',
					 template: 'Invalid Username/Password, Please try to login again'
					});

					alertPopup.then(function(res) {
				
					});
				}
			}).
			error(function(data, status, headers, config) 
			{
				console.log("error"+JSON.stringify(data));
				$ionicLoading.hide();
			});
	
	}
	
	$scope.ksmRegister = function() {
		$state.go("app.register");
	}
	
})

.controller('RegisterCtrl', function($scope, $stateParams,$state,$ionicSideMenuDelegate, $timeout,$http,$ionicPopup, ionicMaterialMotion,$ionicLoading, ionicMaterialInk) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
	$ionicSideMenuDelegate.canDragContent(false);
	 $timeout(function() {
        $scope.$parent.hideHeader();
    }, 0);
	$scope.formData ={};
	$scope.submit = function() {
		if (!$scope.formData.username.match(/^[0-9a-z]+$/) || !$scope.formData.password.match(/^[0-9a-z]+$/)){
			var alertPopup = $ionicPopup.alert({
					 title: 'Registration Fail',
					 template: 'Username และ Password ต้องประกอบไปด้วยตัวเลข ตัวอักษร A-Z ตัวเล็กหรือตัวใหญ่ เท่านั้น'
					});
			alertPopup.then(function(res) {});
			return;
		}

		$ionicLoading.show();
		$scope.formData.role = 'user';
		$scope.formData.appRole = "CareGiver";
		$scope.formData.status = 0;
		var headers = { 'Content-Type':'application/json' };
		$http.post(URL_PREFIX+"/api/security/register.do",JSON.stringify($scope.formData),headers).
			success(function(data, status, headers, config) 
			{
				$ionicLoading.hide();
				console.log("success: "+data);
				if(data.status == "-3"){
					 var alertPopup = $ionicPopup.alert({
					 title: 'Registration Fail',
					 template: 'Username มีผู้ใช้แล้ว <BR/>โปรดใส่ username ใหม่'
					});
					alertPopup.then(function(res) {});
					
				} else if(data.status == "-1") {
					var alertPopup = $ionicPopup.alert({
					 title: 'Registration Fail',
					 template: 'ระบบเกิดความผิดพลาดในระหว่างการลงเบียน โปรดลงทะเบียนใหม่'
					});

					alertPopup.then(function(res) {});
				} else {
					var alertPopup = $ionicPopup.alert({
					 title: 'Registration Success',
					 template: 'การลงทะเบียนสำเร็จ โปรดเข้าระบบด้วย Username และ Password ที่ตั้งไว้'
					});

					alertPopup.then(function(res) {
					 $state.go('app.login');
					});
					//$state.go('app.login');
				}

			}).
			error(function(data, status, headers, config) 
			{
				console.log("error: "+data);
				$ionicLoading.hide();
				
				
			});
	}
	
  
})

.controller('ResetPasswordCtrl', function($scope, $stateParams,$state,$ionicSideMenuDelegate, $timeout,$http,$ionicPopup, ionicMaterialMotion,$ionicLoading, ionicMaterialInk) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
	$ionicSideMenuDelegate.canDragContent(false);
	 $timeout(function() {
        $scope.$parent.hideHeader();
    }, 0);
	$scope.formData ={};
	
	$scope.submit = function() {
		$ionicLoading.show();
		var headers = { 'Content-Type':'application/json' };
		$http.post(URL_PREFIX+"/api/security/resetPassword.do",JSON.stringify($scope.formData),headers).
			success(function(data, status, headers, config) 
			{
				$ionicLoading.hide();
				if(data.status == "-1"){
					var alertPopup = $ionicPopup.alert({
					 title: 'Reset Password Fail',
					 template: 'เกิดความผิดพลาดในระหว่างการตั้งรหัส <BR/>'+data.key
					});
					alertPopup.then(function(res) {});
				} else {
					var alertPopup = $ionicPopup.alert({
					 title: 'Reset Password Success',
					 template: 'การตั้งรหัสสำเร็จ โปรดตรวจสอบข้อความในอีเมล'
					});
					alertPopup.then(function(res) { $state.go('app.login'); });
				}
					
				console.log(JSON.stringify(data));
			}).
			error(function(data, status, headers, config) 
			{
				console.log("error: "+data);
				$ionicLoading.hide();
			});
	}
})

.controller("LogoutCtrl",function($scope,$state, $ionicLoading,methodFactory) {
	
		console.log("LogoutCtrl called");
		methodFactory.reset();		
		$state.go('app.login');
		
		
})

.controller('ProfileCtrl', function ($scope, $rootScope, $window, $ionicHistory, $ionicNavBarDelegate, $ionicSideMenuDelegate, $stateParams, $ionicPopup, $http, $filter, $timeout, ionicMaterialMotion, $ionicLoading, ionicMaterialInk, $state) {
		$rootScope.showMenu = true;
		// Set Header
		$scope.$parent.showHeader();
		$scope.$parent.clearFabs();
		$scope.isExpanded = true;
		$scope.$parent.setExpanded(true);
		$scope.$parent.setHeaderFab(false);
		$ionicNavBarDelegate.showBackButton(true);
		$ionicSideMenuDelegate.canDragContent(true);
		
		var userObj = JSON.parse(window.localStorage.getItem('user'));
		$scope.formData = {};
		$scope.formData.firstname = userObj.firstname;
		$scope.formData.lastname = userObj.lastname;
		$scope.formData.phone = userObj.phone;
		$scope.formData.email = userObj.email;
		$scope.saveData = function(){
			userObj.firstname = $scope.formData.firstname;
			userObj.lastname = $scope.formData.lastname;
			userObj.phone = $scope.formData.phone;
			userObj.email = $scope.formData.email;
			$ionicLoading.show();
			var headers = {'Content-Type': 'application/json'};
			$http.post(URL_PREFIX + "/api/user/save.do", JSON.stringify(userObj), headers).
				success(function (data, status, headers, config) {
					$ionicLoading.hide();
					window.localStorage.setItem('user',JSON.stringify(userObj));
					var alertPopup = $ionicPopup.alert({
							title: 'Complete',
							template: 'การแก้ไขข้อมูลสร็จสมบูรณ์ !'
						});
					alertPopup.then(function (res) {
						$state.go("app.home");
					});
					 
				}).
				error(function (data, status, headers, config) {
					console.log("error" + JSON.stringify(data));
					$ionicLoading.hide();
				});
		}
		
		$scope.changePW = function(){
			if( $scope.formData.password != $scope.formData.repassword){
				var alertPopup = $ionicPopup.alert({
							title: 'Error',
							template: 'รหัสผ่านที่ใส่ไม่ตรงกัน '
						});
				return;
			}
			
			$ionicLoading.show();
			userObj.password = $scope.formData.password;
			var headers = {'Content-Type': 'application/json'};
			$http.post(URL_PREFIX + "/api/user/changePassword.do", JSON.stringify(userObj), headers).
				success(function (data, status, headers, config) {
					$ionicLoading.hide();
					var alertPopup = $ionicPopup.alert({
							title: 'Complete',
							template: 'การแก้ไขรหัสผ่านเสร็จสมบูรณ์ !'
						});
					alertPopup.then(function (res) {
						$state.go("app.home");
					});
					window.localStorage.setItem('user',JSON.stringify(userObj));
				}).
				error(function (data, status, headers, config) {
					console.log("error" + JSON.stringify(data));
					$ionicLoading.hide();
				});
		}
		/**
		
		**/
	})

.controller('WelcomeCtrl', function($scope,$rootScope, $window,$ionicActionSheet, $ionicHistory,$ionicNavBarDelegate,$ionicSideMenuDelegate, $stateParams,$ionicPopup, $http,$filter, $timeout, ionicMaterialMotion,$ionicLoading, ionicMaterialInk) {
	console.log("WelcomeCtrl is called");
	// Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
	$ionicNavBarDelegate.showBackButton(false);
	$ionicSideMenuDelegate.canDragContent(true);
	
})

.controller('HomeCtrl', function($scope,$state, $rootScope, $window,$ionicActionSheet, $ionicHistory,$ionicNavBarDelegate,$ionicSideMenuDelegate, $stateParams,$ionicPopup, $http,$filter, $timeout, ionicMaterialMotion,$ionicLoading, ionicMaterialInk,$cordovaCamera,$cordovaFileTransfer,$cordovaDevice,$cordovaFile) {

	// Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
	$ionicNavBarDelegate.showBackButton(false);
	$ionicSideMenuDelegate.canDragContent(true);
	if($stateParams.showIndex == ''){
		$stateParams.showIndex = $rootScope.showIndex;
	} else {
		$rootScope.showIndex = $stateParams.showIndex;
	}
	console.log("HomeCtrl "+$stateParams.showIndex)
	
	var userObj = JSON.parse(window.localStorage.getItem('user'));
	// query patient by care giver id
	var getLatestRequestStatus = function(patientId){
			$http.get(URL_PREFIX + "/api/emrequest/patient/latest.do?id=" + patientId)
					.then(function (res) {
						console.log("latest req "+res.data.status);
						return $rootScope.statusTH(res.data.status);
					}, function (err) {
						console.error('ERR', JSON.stringify(err));
					});
		
		}
	$rootScope.loadPatients = function(){
		$ionicLoading.show();
		$http.get(URL_PREFIX+"/api/patient/caregiver/list.do?id="+userObj.referenceObject.id)
			.then(function(res){ 
				$ionicLoading.hide();
				if(res.data == null || res.data.length == 0){
					$state.go("app.welcome");
				}

				console.log(JSON.stringify(res.data));
				$rootScope.patients = res.data;
				if(res.data.length > 0){
					$scope.patient = res.data[$stateParams.showIndex];
					$rootScope.patient = $scope.patient;
					if($rootScope.patient.currentStatus == "alert" || $rootScope.patient.currentStatus == "beware"){
						$http.get(URL_PREFIX + "/api/emrequest/patient/latest.do?id=" + $scope.patient.id)
							.then(function (res) {
								console.log("latest req "+res.data.status);
								$rootScope.patient.reqStatus = $rootScope.statusTH(res.data.status)
							}, function (err) {
								console.error('ERR', JSON.stringify(err));
							});
						
					//	$rootScope.patient.currentStatus += " "+getLatestRequestStatus($rootScope.patient.id);
					}
					$scope.patient.photoFileURL = URL_PREFIX + $scope.patient.photoFileURI;
					console.log($scope.patient.photoFileURL);
					$scope.loadLocation();
					
				}
			}
			, function(err) {
				console.error('ERR', JSON.stringify(err));
				$ionicLoading.hide();
			}); 
	}
	

	
	$scope.loadLocation = function(){
		$ionicLoading.show();
		$http.get(URL_PREFIX+"/api/patient/locationlog/list.do?id="+$scope.patient.id)
		.then(function(res){ 
			$ionicLoading.hide();
			var actualDistances = [];
			var warnDistances = [];
			$scope.prevPositions = [];
			$scope.labels = []; 
			if(res.data!=0){
				for(var i=0; i<res.data.length; i++){	
					warnDistances.push($scope.patient.warnDistance);
					actualDistances.push(res.data[i].distanceFromCenter);
					if(i!=0){
						$scope.prevPositions.push({lat: res.data[i].locLat, lng: res.data[i].locLong})
					}
					var logdate = new Date(res.data[i].logDate);
					$scope.labels.push($filter('date')(logdate, "HH:mm"));
				}
				$scope.patient.currentLat = res.data[0].locLat;
				$scope.patient.currentLong = res.data[0].locLong;
				$scope.patient.distanceFromCenter = res.data[0].distanceFromCenter;
			}
			$scope.data = [actualDistances,warnDistances]; 
			
			setTimeout(function() {google.maps.event.addDomListener(window, 'load', loadMap());},500);
		}, function(err) {
			console.error('ERR', JSON.stringify(err));
			$ionicLoading.hide();
		}); 
	}
	
	// call load patient
	$rootScope.loadPatients();
	
	var loadMap = function() {
		console.log("inside google map dom listener");
        var myLatlng = new google.maps.LatLng(37.3000, -120.4833);
 
        var mapOptions = {
            center: myLatlng,
            zoom: 16,
			streetViewControl: false,
			mapTypeControl: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
			
        };
		console.log("before render map ");
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
		console.log("after render map ");
		var pImage = 'https://storage.googleapis.com/image-mobile/user_pointer.png';
		var hImage = 'https://storage.googleapis.com/image-mobile/home-pointer.png';
		var prevImage = 'https://storage.googleapis.com/image-mobile/user_prev_pointer.png';

		map.setCenter(new google.maps.LatLng($scope.patient.currentLat, $scope.patient.currentLong));
		var myLocation = new google.maps.Marker({
			position: new google.maps.LatLng($scope.patient.currentLat, $scope.patient.currentLong),
			map: map,
			icon: pImage,
			title: "คนไข้"
		});
		for(var i=0; i< $scope.prevPositions.length; i++){
			var prevLocation = new google.maps.Marker({
				position: new google.maps.LatLng($scope.prevPositions[i].lat, $scope.prevPositions[i].lng),
				map: map,
				icon: prevImage,
				title: "ประวัติตำแหน่ง"
			});
		}
		var homeLocation = new google.maps.Marker({
			position: new google.maps.LatLng($scope.patient.homeLat, $scope.patient.homeLong),
			map: map,
			icon: hImage,
			title: "บ้าน"
		});
		
		if($scope.patient.warnDistance != 0){
			var cityCircle = new google.maps.Circle({
				strokeColor: '#93bdec',
				strokeOpacity: 0.5,
				strokeWeight: 1,
				fillColor: '#93bdec',
				fillOpacity: 0.35,
				map: map,
				center: {lat: $scope.patient.homeLat, lng: $scope.patient.homeLong},
				radius: $scope.patient.warnDistance
			  });
		}
		
        $scope.map = map;
		
		
    };
	
	$scope.setHome = function(){
		$ionicLoading.show();
		navigator.geolocation.getCurrentPosition(function(pos) {
			$ionicLoading.hide();
			console.log("current position "+pos.coords.latitude+","+pos.coords.longitude);
			$scope.patient.homeLat = pos.coords.latitude;
			$scope.patient.homeLong = pos.coords.longitude;
             var myPopup = $ionicPopup.show({
				 template: 'ตำแหน่งบ้าน ละติจูด<input type = "number" ng-model = "patient.homeLat"><BR/>ตำแหน่งบ้าน ลองติจูด<input type = "number" ng-model = "patient.homeLong">',
				 title: 'ตั้งค่าตำแหน่ง',
				 scope: $scope,
				  buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
					text: 'Cancel',
					type: 'button-default',
					onTap: function(e) {
					 // e.preventDefault();
					}
				  }, {
					text: 'OK',
					type: 'button-positive',
					onTap: function(e) {
						console.log('Save Position!');
						$ionicLoading.show();
						var headers = { 'Content-Type':'application/json' };
						$http.post(URL_PREFIX+"/api/patient/sethome.do",JSON.stringify($scope.patient),headers).
							success(function(data, status, headers, config) 
							{
								$ionicLoading.hide();
								$rootScope.loadPatients();
							}).
							error(function(data, status, headers, config) 
							{
								console.log("error: "+data);
								$ionicLoading.hide();
							});
					}
				  }]
			  });
			  
        }, function(error){
			$ionicLoading.hide();
			console.log("error from positioning "+error.message);
		});
	}
	
	$scope.setWarnDistance = function(){
		 var myPopup = $ionicPopup.show({
			 template: 'รัศมีเฝ้าระวัง (เเมตร)<input type = "number" ng-model = "patient.warnDistance">',
			 title: 'ตั้งค่ารัศมีเฝ้าระวัง',
			 scope: $scope,
			  buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
				text: 'Cancel',
				type: 'button-default',
				onTap: function(e) {
				 // e.preventDefault();
				}
			  }, {
				text: 'OK',
				type: 'button-positive',
				onTap: function(e) {
					console.log('Save Position!');
					$ionicLoading.show();
					var headers = { 'Content-Type':'application/json' };
					$http.post(URL_PREFIX+"/api/patient/setwarndistance.do",JSON.stringify($scope.patient),headers).
						success(function(data, status, headers, config) 
						{
							$ionicLoading.hide();
							$rootScope.loadPatients();
						}).
						error(function(data, status, headers, config) 
						{
							console.log("error: "+data);
							$ionicLoading.hide();
						});
				}
			  }]
		  });
			  
       
	}
	

	$scope.series = ['ระยะจริง','ระยะกำหนด'];
	
	$scope.options = {legend: {display: true,position:'bottom'},scaleLabel: { fontColor: '#ffffff'}};

	$scope.phonecall = function ( phonenumber ) {
		var call = "tel:" + phonenumber;
		document.location.href = call;
	}
	
	$scope.deletePermit = function(patientId, careGiverId){
		 var confirmPopup = $ionicPopup.confirm({
			 title: 'คุณต้องการลบคนไข้ในการดูแล',
			 template: 'คุณต้องการลบ "'+$scope.patient.firstname+'" ออกจากคนไข้ในการดูแล?'
		  });
		  confirmPopup.then(function(res) {
			 if(res) {
				$ionicLoading.show();
				$http.get(URL_PREFIX+"/api/caregiver/patient/delete.do?patientId="+patientId+"&careGiverId="+careGiverId)
					.then(function(res){ 
						$ionicLoading.hide();
						$stateParams.showIndex = 0;
						$rootScope.loadPatients();
					}
					, function(err) {
						console.error('ERR', JSON.stringify(err));
						$ionicLoading.hide();
					}); 
			 } else {
				console.log('Not sure!');
			 }
		  });
		
	}
	
	 // Show the action sheet
	$scope.showMenu = function() {
	   var hideSheet = $ionicActionSheet.show({
		 buttons: [
		    { text: '<i class="icon ion-refresh"></i>เรียกข้อมูลใหม่' },
		   { text: '<i class="icon ion-android-call"></i>โทรหา' },
		   { text: '<i class="icon ion-android-home"></i>ตั้งตำแหน่งบ้าน' },
		   { text: '<i class="icon ion-android-locate"></i>กำหนดรัศมีเฝ้าระวัง' },
		   { text: '<i class="icon ion-android-delete"></i>ลบคนไข้ในการดูแล' }
		 ],
		 cancelText: 'ปิด',
		 cancel: function() {
			  // add cancel code..
			},
		 buttonClicked: function(index) {
		  if(index == 0)
				$rootScope.loadPatients();
			//	$scope.loadLocation();
			if(index == 1)
				$scope.phonecall($scope.patient.phone);
		   if(index == 2)
				$state.go("app.sethome");
			if(index == 3)
				$scope.setWarnDistance();
		   if(index == 4)
				$scope.deletePermit($scope.patient.id, userObj.referenceObject.id);
			
		   return true;
		 }
	   });
	}
	
	  $scope.pathForImage = function(image) {
		  if (image === null) {
			return '';
		  } else {
			return cordova.file.dataDirectory + image;
		  }
		};
		
	$scope.uploadImage = function(){
		
		   // Destination URL
		  var url = URL_PREFIX+"/api/patient/photo/upload.do?id="+$scope.patient.id;
		 
		  // File for Upload
		  var targetPath = $scope.pathForImage($scope.image);
		 
		  // File name only
		  var filename = $scope.image;
		  var params = new Object();
		  params.headers = {"___authorizationKey": userObj.authorizationKey, "Content-Type": "application/octet-stream"};
		  var options = {
			chunkedMode: false,
			mimeType: "image/jpg",
			params : params
		  };
		  
		 
		  $cordovaFileTransfer.upload(url, targetPath, options).then(function(result) {
			console.log("upload successfully...");
			$rootScope.loadPatients();
		  });
	}
	
	// take photo for profile
	$scope.takeImage = function() {
      console.log("takeImage called");
        var options = {
            quality: 80,
            destinationType: Camera.DestinationType.FILE_URI,
            //sourceType: Camera.PictureSourceType.CAMERA,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: false,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 800,
            targetHeight: 600,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

        $cordovaCamera.getPicture(options).then(function(imagePath) {
			console.log("getPicture called "+imagePath);
             var currentName = imagePath.replace(/^.*[\\\/]/, '');
 
			//Create a new name for the photo
			var d = new Date(),
			n = d.getTime(),
			newFileName =  n + ".jpg";
		 
			// If you are trying to load image from the gallery on Android we need special treatment!
			if ($cordovaDevice.getPlatform() == 'Android' ) {
			    window.FilePath.resolveNativePath(imagePath, function(entry) {
				window.resolveLocalFileSystemURL(entry, success, fail);
				function fail(e) {
				  console.error('Error: ', e);
				}
		 
				function success(fileEntry) {
				  var namePath = fileEntry.nativeURL.substr(0, fileEntry.nativeURL.lastIndexOf('/') + 1);
				  // Only copy because of access rights
				  $cordovaFile.copyFile(namePath, fileEntry.name, cordova.file.dataDirectory, newFileName).then(function(success){
				  $scope.image = newFileName;
				  $scope.uploadImage();
				  }, function(error){
					$scope.showAlert('Error', error.exception);
				  });
				};
			  }
			);
			} else {
			  var namePath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
			  // Move the file to permanent storage
			  $cordovaFile.moveFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(function(success){
				$scope.image = newFileName;
				$scope.uploadImage();
			  }, function(error){
				$scope.showAlert('Error', error.exception);
			  });
			}
		 
		  
        }, function(err) {
            console.log(err);
            $ionicLoading.hide();
        });
      }
	  
	
	
})

.controller('AddPatientCtrl', function($ionicNavBarDelegate,$scope, $stateParams, $timeout, $state,methodFactory, $http,$filter,$ionicPopup, ionicMaterialMotion,$ionicLoading, ionicMaterialInk) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
	$ionicNavBarDelegate.showBackButton(true);

    var userObj = JSON.parse(window.localStorage.getItem('user'));
	
	$scope.searchPatient = function(code){
		$ionicLoading.show();
		var headers = { 'Content-Type':'application/json' };
		$http.get(URL_PREFIX+"/api/patient/securityCode/query.do?code="+code)
					.then(function(res){ 
						$ionicLoading.hide();
						console.log(JSON.stringify(res.data));
						$scope.patientList = res.data;
						$scope.selectPatient = 'true';
					}
					, function(err) {
							console.error('ERR', JSON.stringify(err));
							$ionicLoading.hide();
					}); 
	}
	
	$scope.recordPermit = function(patient){
		$ionicLoading.show();
		var headers = { 'Content-Type':'application/json' };
		console.log("Saving "+JSON.stringify($scope.patientRecord));
		var carepermit = { patientId: patient.id, careGiverId: userObj.referenceObject.id};
		$http.post(URL_PREFIX+"/api/carepermit/save.do",JSON.stringify(carepermit),headers).
				success(function(data, status, headers, config) 
				{
					$ionicLoading.hide();
					console.log("save result"+JSON.stringify(data));
				/**	var alertPopup = $ionicPopup.alert({
						title: 'เพิ่มคนไข้ในความดูแล',
						template: 'การเพิ่มคนไข้ในความดูแลเสร็จสมบูรณ์'
					});
				**/
					$state.go("app.home")
				}).
				error(function(data, status, headers, config) 
				{
					console.log("error"+JSON.stringify(data));
					$ionicLoading.hide();
					var alertPopup = $ionicPopup.alert({
						title: 'เพิ่มคนไข้ในความดูแล',
						template: 'เกิดความผิดพลาดในการเพิ่มคนไข้ในความดูแล'
					});
				});
	}
})

.controller("SetHomeCtrl", function ($scope, $state,$http,$stateParams,$ionicNavBarDelegate, $ionicLoading, methodFactory, $rootScope,$ionicPopup ) {
	console.log('SetHomeCtrl called');
	
	$scope.$parent.showHeader();
	$scope.isExpanded = true;
	$scope.$parent.setExpanded(true);
	$ionicNavBarDelegate.showBackButton(true);
	
	var userObj = JSON.parse(window.localStorage.getItem('user'));
	$scope.emLat = $rootScope.patient.homeLat;
	$scope.emLong =  $rootScope.patient.homeLong;

	console.log('lat -->'+$scope.emLat);
	console.log('long -->'+$scope.emLong);

	var loadEmCenterMap = function () {
			var myLatlng = new google.maps.LatLng($scope.emLat, $scope.emLong);
			var map = new google.maps.Map(document.getElementById('patient-map'), {
				zoom: 12,
				center: myLatlng
			});
			var marker = new google.maps.Marker({
				position: myLatlng,
				map: map,
				draggable: true,
				animation: (google.maps.Animation.BOUNCE)
			});

			var updateMarkerPosition = function () {
				myLatlng = new google.maps.LatLng($scope.emLat, $scope.emLong);
				marker.setPosition(myLatlng);
			}

			var onDrag = new google.maps.event.addListener(marker, 'dragend', function (event) {
				$scope.emLat = event.latLng.lat();
				$scope.emLong = event.latLng.lng();
				console.log('on draging we get markerLat ' + $scope.emLat + " markerLong " + $scope.emLong);
			});

			var onClick = new google.maps.event.addListener(map, 'click', function (event) {
				$scope.emLat = event.latLng.lat();
				$scope.emLong = event.latLng.lng();
				updateMarkerPosition();
				console.log('on clicking we get markerLat ' + $scope.emLat + " markerLong " + $scope.emLong);
			});
			$ionicLoading.hide();
		}
	setTimeout(function () {
		google.maps.event.addDomListener(window, 'load', loadEmCenterMap());
	}, 50);
		
	$scope.setloc = function(){
		$ionicLoading.show();
		$rootScope.patient.homeLat = $scope.emLat;
		$rootScope.patient.homeLong = $scope.emLong;
		var headers = { 'Content-Type':'application/json' };
		$http.post(URL_PREFIX+"/api/patient/sethome.do",JSON.stringify($rootScope.patient),headers).
			success(function(data, status, headers, config) 
			{
				$ionicLoading.hide();
				var alertPopup = $ionicPopup.alert({
					 title: "การแก้ไขเสร็จสมบูรณ์",
					 template: "ตำแหน่งบ้านได้ถูกบันทึกแล้ว",
					  buttons: [
					  { text: 'OK',  onTap: function(e) {
							  $state.go("app.home");
							  return true; 
							} 
					   }
					 ]
				  });
				
			}).
			error(function(data, status, headers, config) 
			{
				console.log("error: "+data);
				$ionicLoading.hide();
			});
		
	}
})

.directive('ionMultipleSelect', ['$ionicModal', '$ionicGesture', function ($ionicModal, $ionicGesture) {
  return {
    restrict: 'E',
    scope: {
      options : "=",
	  coptions : "="
    },
    controller: function ($scope, $element, $attrs, $ionicLoading) {
	console.log("chbx:"+$attrs.renderCheckbox+$attrs.keyProperty);
      $scope.multipleSelect = {
        title:            $attrs.title || "Select Options",
        tempOptions:      [],
        keyProperty:      $attrs.keyProperty || "id",
        valueProperty:    $attrs.valueProperty || "value",
        selectedProperty: $attrs.selectedProperty || "selected",
        templateUrl:      $attrs.templateUrl || 'templates/multipleSelect.html',
        renderCheckbox:   $attrs.renderCheckbox ? $attrs.renderCheckbox == "true" : true,
        animation:        $attrs.animation || 'none'//'slide-in-up'
      };
      $scope.OpenModalFromTemplate = function (templateUrl) {
        $ionicModal.fromTemplateUrl(templateUrl, {
          scope: $scope,
          animation: $scope.multipleSelect.animation
        }).then(function (modal) {
          $scope.modal = modal;
          $scope.modal.show();
        });
      };
      
      $ionicGesture.on('tap', function (e) {
	   $ionicLoading.show();
       $scope.multipleSelect.tempOptions = $scope.options.map(function(option){
         var tempOption = { };
         tempOption[$scope.multipleSelect.keyProperty] = option[$scope.multipleSelect.keyProperty];
         tempOption[$scope.multipleSelect.valueProperty] = option[$scope.multipleSelect.valueProperty];
         tempOption[$scope.multipleSelect.selectedProperty] = option[$scope.multipleSelect.selectedProperty];
     
         return tempOption;
       });
	   $ionicLoading.hide();
        $scope.OpenModalFromTemplate($scope.multipleSelect.templateUrl);
      }, $element);
      
      $scope.saveOptions = function(){
	    if($scope.multipleSelect.renderCheckbox){
			for(var i = 0; i < $scope.multipleSelect.tempOptions.length; i++){
			  var tempOption = $scope.multipleSelect.tempOptions[i];
			  for(var j = 0; j < $scope.options.length; j++){
				var option = $scope.options[j];
				if(tempOption[$scope.multipleSelect.keyProperty] == option[$scope.multipleSelect.keyProperty]){
				  option[$scope.multipleSelect.selectedProperty] = tempOption[$scope.multipleSelect.selectedProperty];
				  break;
				}
			  }
			}
		} else {
			// for radio button

			for(var i = 0; i < $scope.options.length; i++){
				var option = $scope.options[i];
				if(option[$scope.multipleSelect.keyProperty] == $scope.selected){
					  option[$scope.multipleSelect.selectedProperty] = true;
				} else{
					  option[$scope.multipleSelect.selectedProperty] = false;
				}
			}
		   
		}
        $scope.closeModal();
      };
	  
	  $scope.onSelectRadio = function(u){
		console.log("onSelectRadio called: "+u);
		$scope.selected = u;
	  }	
      
      $scope.closeModal = function () {
        $scope.modal.remove();
      };
      $scope.$on('$destroy', function () {
          if ($scope.modal){
              $scope.modal.remove();
          }
      });
    }
  };
}])

;
