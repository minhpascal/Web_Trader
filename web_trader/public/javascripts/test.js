angular
.module('App', ['ngMaterial'])
.controller('AppCtrl', AppController);

function AppController($scope, $mdDialog) {
 var alert;
 $scope.showAlert = showAlert;
 $scope.showDialog = showDialog;
 $scope.items = [1, 2, 3];

 // Internal method
 function showAlert() {
   alert = $mdDialog.alert({
     title: 'Attention',
     textContent: 'This is an example of how easy dialogs can be!',
     ok: 'Close'
   });

   $mdDialog
     .show( alert )
     .finally(function() {
       alert = undefined;
     });
 }

 function showDialog($event) {
    var parentEl = angular.element(document.body);
    $mdDialog.show({
      parent: parentEl,
      targetEvent: $event,
      templateUrl: 'dialog_auto.tmpl.html',
      locals: {
        items: $scope.items
      },
      controller: DialogController
   });
    
   function DialogController($scope, $mdDialog, items) {
     $scope.items = items;
     $scope.closeDialog = function() {
       $mdDialog.hide();
     }
   }
 }
}