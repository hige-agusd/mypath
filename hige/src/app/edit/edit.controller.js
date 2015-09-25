'use strict';

angular.module('myPath')
  .controller('EditCtrl', function($rootScope, $scope, geoJsonSrv, TypesSrv) {
    $scope.otherTags = false;
    $scope.existingPoints = [];
    $scope.PlaceOrLine = 'Places';
    $scope.loading = true;
    $scope.pais = false;
    $scope.features = Object.keys(TypesSrv.featureTypes);
    $scope.geometries = Object.keys(TypesSrv.geometryTypes);
    $scope.dropdowns = [];
    $scope.point = {};
    $scope.line = {};
    var emptyPoint = {
      "type": "Feature",
      "properties": {
        "name": "",
        "type": "",
        "amenity": "",
        "popupContent": ""
      },
      "geometry": {
        "type": "Point",
        "coordinates": []
      }
    };
    var newLine = {
      "type": "",
      "name": "",
      "featType": "Feature",
      "popupContent": "",
      "coordinates": []
    };
    angular.copy(emptyPoint, $scope.point);
    angular.copy(newLine, $scope.line);

    function init() {
      geoJsonSrv.getMarkers().success(function(data) {
        $scope.otherTags = data;
        window.lala = $scope.otherTags;
        $scope.existingPoints = getDataAsGeoJson();
        console.log($scope.existingPoints);
        $scope.updateLink();
        $scope.populateForm(false);
        $scope.loading = false;
      });
    }

    init();

    $scope.$watch(function(scope) {
        return scope.line.type;
      },
      function(newValue, oldValue) {
        if (newValue) {
          $scope.line.coordinates = TypesSrv.geometryTypes[newValue].coordinates;
          console.log($scope.line.coordinates)
        }
      }
    );

    $scope.coordinateSetter = function(value, index, k) {
      console.log(value, index, k, $scope.line.coordinates);
      value = value.split('#').map(Number);
      $scope.line.coordinates[index] = value.reverse();
      console.log(value, index, k, $scope.line.coordinates);
    };

    function getDataAsGeoJson() {
      var places = $scope.otherTags.Places;
      var retVal = [];
      //itero paises
      angular.forEach(places, function(ciudades, nombrePais) {
        //itero ciudades
        angular.forEach(ciudades, function(puntos, nombreCiudad) {
          //console.log(puntos, nombreCiudad)
          retVal = retVal.concat(puntos);
          //retVal = retVal.concat(ciudad[nombreCiudad]);
        });
      });

      return retVal;

    }
    $scope.addCoordinates = function() {
      if ($scope.line.type == 'LineString') {
        console.log($scope.line.coordinates);
        $scope.line.coordinates.push([0, 0]);
        console.log($scope.line.coordinates);
      } else if ($scope.line.type == 'Polygon') {
        $scope.line.coordinates[0].push([0, 0]);
      }
    }

    $scope.populateForm = function(forced) {
      var places = $scope.otherTags.Places;
      var arrayPaises = ['Elegi'];
      var arrayCiudades = ['Elegi'];
      var selectedPais = (forced) ? $scope.pais : false;
      var selectedCiudad = (forced) ? $scope.ciudad : false;

      //itero paises
      angular.forEach(places, function(ciudades, nombrePais) {
        arrayPaises.push(nombrePais);
        //itero ciudades
        angular.forEach(ciudades, function(puntos, nombreCiudad) {
          if ($scope.pais == nombrePais) {
            arrayCiudades.push(nombreCiudad);
          }
        });
      });

      arrayPaises.push('Other');
      arrayCiudades.push('Other');

      if (forced || !$scope.dropdowns[0] || (!$scope.pais && !$scope.dropdowns[0].other)) {
        $scope.dropdowns[0] = {
          "name": "paises",
          "column": ['País', 0/*selectedMarginFactor.toString()*/],
          "options": arrayPaises,
          "selected": selectedPais,
          //"link": TranslateSrv._("colorEditor_restoreConfirmTitle"),
          "isReadOnly": false,
          "other": false,
          "allowCustomUserValues": true
        };
      }
      $scope.dropdowns[1] = {
        "name": "ciudades",
        "column": ['Ciudad', 0/*selectedMarginFactor.toString()*/],
        "options": arrayCiudades,
        "selected": selectedCiudad,
        "isReadOnly": false,
        "other": false,
        "allowCustomUserValues": true
      };
    };

    $scope.updateLink = function() {
      localStorage.setItem('data', angular.toJson($scope.otherTags));
      var base64 = window.btoa(localStorage.getItem('data'));
      angular.element('#save-btn').attr('href', 'data:application/octet-stream;base64,' + base64);
      $scope.downloadLink = 'data:application/octet-stream;base64,' + base64;
    };

    $scope.addNode = function() {
      var reloadDropdown = false;
      if ($scope.dropdowns[0].other) {
        $scope.otherTags.Places[$scope.pais] = {};
        reloadDropdown = true;
      }
      if ($scope.dropdowns[1].other) {
        $scope.otherTags.Places[$scope.pais][$scope.ciudad] = [];
        reloadDropdown = true;
      }
      if ($scope.point.geometry.type == 'Polygon') {
        $scope.point.geometry.coordinates[0]
          .push($scope.point.geometry.coordinates[0][0]);
      }
      var pepito = {};
      angular.copy($scope.point, pepito);
      pepito.id = $scope.pais.toLowerCase() + $scope.ciudad.toLowerCase()
        + idNumber($scope.otherTags.Places[$scope.pais][$scope.ciudad].length);
      $scope.otherTags.Places[$scope.pais][$scope.ciudad].push(pepito);
      angular.copy(emptyPoint, $scope.point);

      console.log($scope.otherTags);

      window.lala = $scope.otherTags;
      $scope.existingPoints = getDataAsGeoJson();
      $scope.updateLink();
      if (reloadDropdown) {
        $scope.populateForm(true);
      }

    };

    $scope.addLine = function() {
      var pepito = {};
      console.log($scope.line.coordinates);
      angular.copy($scope.line, pepito);
      console.log(pepito.coordinates);
      angular.forEach(pepito.coordinates, function(coordinate, i) {
        console.log(coordinate)
        //pepito.coordinates[i] = coordinate.split('#');
      })
      console.log(pepito)
      $scope.otherTags.Lines.push(pepito);
      angular.copy(newLine, $scope.line);

      console.log($scope.otherTags);
      window.lala = $scope.otherTags;

      $scope.updateLink();

    };

    function idNumber(length) {
      var retVal;
      if (length >= 100) {
        retVal = length.toString();
      } else if (length < 100 && length >= 10) {
        retVal = '0' + length.toString();
      } else {
        retVal = '00' + length.toString();
      }
      return retVal;
    }

    $scope.setNewPlace = function(typeOfPlace, newPlace) {
      console.log('newPlace')
      if (typeOfPlace == 'paises') {
        $scope.pais = newPlace;
      } else {
        $scope.ciudad = newPlace;
      }
    };

    $scope.setter = function(item, value) {
      window.lala = {
        blah: value,
        bleh: $scope.dropdowns,
        item: item
      };
      if (item == 'paises') {
        if (value == 'Other') {
          $scope.dropdowns[0].other = true;
          $scope.pais = false;
          $scope.ciudad = false;
        } else {
          $scope.dropdowns[0].other = false;
          if (value == 'Elegi') {
            $scope.pais = false;
            $scope.ciudad = false;
          } else {
            $scope.pais = value;
          }
        }
        $scope.populateForm(false);
      } else {
        if (value == 'Other') {
          $scope.dropdowns[1].other = true;
          $scope.ciudad = false;
        } else {
          $scope.dropdowns[1].other = false;
          if (value == 'Elegi') {
            $scope.ciudad = false;
          } else {
            $scope.ciudad = value;
          }
        }
      }
    };
  })
;
