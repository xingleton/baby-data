angular.module('babydata.controllers', ['ngCordova'])

.controller('NewCtrl', function($scope, $cordovaCapture, VideoService) {
  $scope.clip = '';
 
  $scope.captureVideo = function() {
    $cordovaCapture.captureVideo().then(function(videoData) {
      VideoService.saveVideo(videoData).success(function(data) {
        $scope.clip = data;
        $scope.$apply();
      }).error(function(data) {
        console.log('ERROR: ' + data);
      });
    });
  }; 

  $scope.urlForClipThumb = function(clipUrl) {
    var name = clipUrl.substr(clipUrl.lastIndexOf('/') + 1);
    var trueOrigin = cordova.file.dataDirectory + name;
    var sliced = trueOrigin.slice(0, -4);
    return sliced + '.png';
  }
   
  $scope.showClip = function(clip) {
    console.log('show clip: ' + clip);
  }
})

.controller('RecordsCtrl', function($scope, Records) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.records = Records.all();
  $scope.remove = function(record) {
    Records.remove(record);
  };
})

.controller('RecordDetailCtrl', function($scope, $stateParams, Records) {
  $scope.record = Records.get($stateParams.recId);
})

.controller('PrivacyCtrl', function($scope, $cordovaSQLite, $stateParams, $location) {
  $scope.agree = function() {
    $location.path("tab/account");
  };
})

.controller('AccountCtrl', function($scope, $cordovaSQLite, $location, DataService) {
  
  initData();

  function initData(){    
    DataService.initDB();
    fetchAccount();
  }   

  function fetchAccount() {    
    DataService.getAccount()
    .then(fetchAccountSuccessCB,fetchAccountErrorCB);
  }

  function fetchAccountSuccessCB(response)
  {
    // $scope.loadingTrackers = false;
    if(response && response.rows && response.rows.length > 0)
    {
      $scope.email = response.rows.item(0).email;                
      $scope.birthday = response.rows.item(0).birthday;
      $scope.invitecode = response.rows.item(0).invitecode;    
    }
    else {
      showMsg("No account info",true);    
    }
  }

  function fetchAccountErrorCB(error)
  {  
    showMsg(error,true);
  }  

  function showMsg(msg, isError){
    if (isError){
      $scope.msgClass = "assertive"
    }
    else{
     $scope.msgClass = "balanced" 
    }
    $scope.message=msg;
  }

  function clearMsg(){
    showMsg("",false); 
  }

  $scope.save = function(email, birthday, invitecode) {      
    if(email != '' && birthday != '' && invitecode != '' ){     
      DataService.saveAccount(email,birthday,invitecode)
          .then(function(response){   
            clearMsg(); 
            $location.path("tab/new");
            // showMsg("account info has been saved",false);            
            // fetchAccount();
          },function(error){
            showMsg(error,true);
          });
    }
    else{      
      showMsg("Please enter all the information above", true);      
    }    
  }
   
});
