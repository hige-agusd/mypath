'use strict';

angular.module('myPath')
  .controller('ItineraryCtrl', function($rootScope, $scope, geoJsonSrv, TypesSrv) {
    $scope.otherTags = false;
    $scope.loading = true;
    $scope.pais = 'Japan';
    $scope.models = {
      selected: null,
      templates: [
        { type: "item", id: 2 },
        { type: "container", id: 1, columns: [[]] }
      ],
      dropzones: {}
    };

    function init() {
      geoJsonSrv.getItinerary().success(function(data) {
        $scope.otherTags = data;
        window.lala = $scope.otherTags;
        $scope.models.dropzones = data.Itinerary;
        console.log($scope.otherTags.Itinerary);
        $scope.itinerary = dndData();
        $scope.updateLink();
        $scope.loading = false;
      });
    }

    init();

    $scope.$watch('models.dropzones', function(model) {
      $scope.modelAsJson = angular.toJson(model, true);
    }, true);

    function dndData() {
      var retVal = {};
      return retVal;
    }

    $scope.updateLink = function() {
      localStorage.setItem('data', angular.toJson($scope.itinerary));
      var base64 = window.btoa(localStorage.getItem('data'));
      angular.element('#save-btn').attr('href', 'data:application/octet-stream;base64,' + base64);
      $scope.downloadLink = 'data:application/octet-stream;base64,' + base64;
    };

  });
