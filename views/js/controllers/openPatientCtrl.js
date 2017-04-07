app.controller('openPatientCtrl',function($rootScope,$http, $document,$scope,$mdColors,$mdDialog,$mdToast,PatientInfo,PatientBuffer,Animations){



      $scope.winClose=function(){
        remote.getCurrentWindow().close();
      }
      $scope.editMode=false;
      $scope.animServ=Animations;
      $scope.mdColors=$mdColors;
      $scope.pserv=PatientBuffer;
      PatientBuffer.getCitiesJSON().then(function(res){
        PatientBuffer.states=res.data;
      });
      $scope.nowDateTime=new Date();

      $scope.pserv.setPatient(PatientInfo);

      $scope.$on('$includeContentLoaded',function(){
        PatientBuffer.loading=false;
      });

      $scope.close=function(){
            $mdDialog.hide();
      };
      
      $scope.cancel=function(){
            $mdDialog.cancel();
      };

      $scope.update=function(){
                  var pid=PatientInfo[0]._id;
                  $mdToast.show(
                      {
                            template:'<md-toast>'+
                                          '<div class="md-toast-content">'+
                                           '     Saving '+
                                            '    <div style="padding-right:10px"></div>'+
                                             '   <md-progress-linear md-mode="determinate" value="{{pService.progress}}">'+
                                          '</md-progress-linear>'+
                                          '</div>'+
                                      '</md-toast>',

                            hideDelay:0,
                            controller:'toastCtrl',
                            position:"top right"
                      }
                        );
                      
                  $scope.pserv.sendMultipart('update',pid) .then(function(res){
                        $mdToast.show(
                        {
                            template:'<md-toast>'+
                                          '<div style="color:#bbff90" class="md-toast-content">'+
                                           '     SUCCESSFULLY SAVED '+
                                           '<md-icon style="margin-right:0px;color:#bbff90">done</md-icon>'+
                                          '</div>'+
                                      '</md-toast>',

                            hideDelay:2000,
                            controller:'toastCtrl',
                            position:"top right"
                        }
                        );
                        PatientBuffer.refreshCards();
                  },function(err){
                        $mdToast.show(
                      {
                            template:'<md-toast>'+
                                          '<div style="color:#ffba73 " class=" md-warn md-toast-content">'+
                                           '     SAVE REJECTED '+
                                           '<md-icon style="margin-right:0px;color:#ffba73">close</md-icon>'+
                                          '</div>'+
                                      '</md-toast>',

                            hideDelay:2000,
                            controller:'toastCtrl',
                            position:"top right"
                      }
                        );
                  },function(evt){
                       
                        PatientBuffer.progress= 100.0*evt.loaded/evt.total;
                        console.log(PatientBuffer.progress);
                        if(PatientBuffer.progress>99)
                        {

                              $mdToast.hide();
                        }
                  });
                  $scope.pserv.sendNewSymptoms(pid)
                        .then(function(res){},function(err){});
                          //if(!pserv.NewPrescriptionInfo)
                  $scope.pserv.sendNewPrescription(pid)
                        .then(function(res){},function(err){});
                  $mdDialog.hide();
                  
                  
      };

      
      
    
}); 
app.controller('toastCtrl',function($scope,$mdColors,PatientBuffer){
                  $scope.pService=PatientBuffer;
                  $scope.colors=$mdColors;
});