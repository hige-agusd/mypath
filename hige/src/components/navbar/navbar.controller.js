'use strict';

angular.module('myPath')
  .controller('NavbarCtrl', function ($scope) {
    $scope.view = 'components/navbar/navbar.html';
    $scope.$broadcast('menu::ready');
  });
