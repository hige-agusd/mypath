angular.module('myPath')
  .directive("theme", function($rootScope,UiSrv) {
    return {
      restrict: "A",
      link: function(scope,element) {
        element.addClass(UiSrv.getTheme());
        var remove;
        if(UiSrv.getTheme() == 'light')
          remove = 'dark'
        else
          remove = 'light';
        var elem = _.find($('link'), function(elem){
          return ($(elem).attr('href').indexOf(remove) > -1)
        });
        $(elem).remove();
      }
    }
  });
