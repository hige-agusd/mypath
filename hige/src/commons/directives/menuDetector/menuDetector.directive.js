angular.module('myPath')
  .directive("menuDetector", function($rootScope,UiSrv) {
    return {
      restrict: "A",
      link: function(scope,element){
        $('body').removeClass('noMenu');
      }
    }
  });
