'use strict';

angular.module('myPath')
  .controller('MainCtrl', function ($scope, $location, $state) {
    var destinationState = '',
         showMenu = $location.search().showMenu,
         page = $location.search().page;

    //UserSrv.getUserData();

    $scope.invalid = false;

    if (showMenu == 'true') {
        destinationState = 'menu_';
    }

    if (typeof showMenu == 'undefined') {
        showMenu = true;
    }

    $scope.showMenu = showMenu;
    $scope.showMenu = false;

    destinationState += page;

    $scope.toggleMenu = function() {
      console.log($scope.showMenu)
      $scope.showMenu = (!$scope.showMenu);
      console.log($scope.showMenu)
    };

    function changeState(state) {
        $state.go(state);
    }

    var validState = $state.is(destinationState);

    if (typeof page != 'undefined' && typeof validState != 'undefined' ) {
        changeState(destinationState);
    } else {
        if (typeof page != 'undefined') {
            $scope.invalid = true;
        }
    }

    $scope.test = 'This is a test';
  });
