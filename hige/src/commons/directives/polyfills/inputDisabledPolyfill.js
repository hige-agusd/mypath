angular.module('myPath')
  .directive("inputDisablePolyfill", function() {
    return {
      restrict: "A",
      scope: {
        inputDisablePolyfill: "=",
      },
      link: function(scope,element,attr) {
        scope.$watch("inputDisablePolyfill", function(val) {

          if(typeof is_ie != "undefined") {
            element.addClass("disabledPolyfill");
          }


        });
      }
    }
  });
