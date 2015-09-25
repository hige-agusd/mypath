(function() {
  'use strict';

  /**
   * {Factory} TranslateSrv
   * Translation service
   * TODO: Remove the $log
   * TODO: Set up the constants in a separated file
   * TODO: perform TODOs
   */
  angular
    .module('myPath')
    .factory('geoJsonSrv', function($q, $rootScope, $http) {
      var self = {},
        pending = [],
        ready = false;


      self.getMarkers = function() {
        return $http.get('./configs/other.json').success(function(markers) {
          self.map = markers;
          ready = true;
          _.each(pending, function(func) {
            func();
          });
        }).error(function() {
          throw {
            error: 'Could not load geo.json'
          };
        });
      };


      self.getItinerary = function() {
        return $http.get('./configs/itinerary.json').success(function(markers) {
          self.map = markers;
          ready = true;
          _.each(pending, function(func) {
            func();
          });
        }).error(function() {
          throw {
            error: 'Could not load geo.json'
          };
        });
      };


      /**
       * @name _
       * @description The translation function
       * @param key
       * @returns {String}
       */
      self._ = function(key) {
        return self.translation_map[key] || '';
      };

      return self;
    });
})();
