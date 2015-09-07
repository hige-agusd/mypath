'use strict';

angular.module('myPath')
  .controller('AlertCtrl', function ($scope,params,$modalInstance) {
    $scope.params = params;
    $scope.close = function () {
      $modalInstance.close();
    };
});
