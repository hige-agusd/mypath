'use strict';

angular.module('myPath')
  .controller('ItineraryCtrl', function($rootScope, $scope, geoJsonSrv, TypesSrv) {
    $scope.otherTags = false;
    $scope.loading = true;
    $scope.pais = 'Japan';
    $scope.newItemDropdown = [];
    $scope.dropdownItems = {};
    $scope.newContainerDropdown = [];
    $scope.models = {
      selected: null,
      templates: [
        { type: "item", id: 2 },
        { type: "container", id: 1, columns: [[]] }
      ],
      dropzones: {}
    };

    function init() {
      geoJsonSrv.getMarkers().success(function(data) {
        $scope.otherTags = data;
        window.lala = $scope.otherTags;
        //$scope.models.dropzones = data.Itinerary;
        $scope.models.dropzones = dndData();
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
      retVal[$scope.pais] = [];
      $scope.dropdownItems[$scope.pais] = {};
      angular.forEach($scope.otherTags.Places[$scope.pais], function(puntos, ciudad) {
        var columns = [];
        angular.forEach(puntos, function(punto, i) {
          columns.push({
            id: punto.id,
            type: 'item',
            name: punto.properties.name,
            amenity: punto.properties.amenity,
            info: punto.properties.popupContent,
            markerType: punto.properties.type
          })
        });
        $scope.dropdownItems[$scope.pais][ciudad] = columns;
        $scope.newContainerDropdown.push({
          type: 'container',
          id: ciudad,
          columns: [columns]
        });
        retVal[$scope.pais].push({
          type: 'container',
          id: ciudad,
          columns: [columns]
        });
      });
      console.log(retVal);
      return retVal;
    }

    $scope.frula = function() {

    };

    $scope.updateItemDropdown = function() {
      console.log('lala')
      console.log($scope.dropdownItems);
      console.log($scope.newContainer);
      $scope.newItemDropdown = $scope.dropdownItems[$scope.pais][$scope.newContainer];
      console.log($scope.newItemDropdown);

    };

    $scope.updateLink = function() {
      localStorage.setItem('data', angular.toJson($scope.itinerary));
      var base64 = window.btoa(localStorage.getItem('data'));
      angular.element('#save-btn').attr('href', 'data:application/octet-stream;base64,' + base64);
      $scope.downloadLink = 'data:application/octet-stream;base64,' + base64;
    };

  });
