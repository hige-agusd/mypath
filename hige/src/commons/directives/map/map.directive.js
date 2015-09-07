angular.module('myPath')
  .directive("myMap", function($rootScope, $timeout) {
    return {
      restrict: "A",
      link: function(scope,element) {
        $rootScope.$broadcast("Map::ready");
        var elem = element.attr('id');
        $timeout(function() {
          var map = L.map(elem, {zoomControl: false}).setView([0,0],2),
            events = scope.events || {};
          new L.Control.Zoom({ position: 'bottomleft' }).addTo(map);
          angular.forEach(events, function(callback, event) {
            map.on(event, callback);
          });
          scope.map = map;
        });
      }
    };
  });
