angular.module('myPath')
  .directive("touchSref", function($rootScope,$state,$location) {
    return {
      restrict: "A",
      link: function(scope,element,attrs) {
        var state = attrs.uiSref;
        element.on('touchend',function(e){
          $state.go(state);
        })
      }
    }
  });
