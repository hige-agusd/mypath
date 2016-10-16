'use strict';

angular.module('myPath')
  .controller('MapsCtrl', function($rootScope, $scope, geoJsonSrv, TypesSrv) {
    $scope.loading = true;
    $scope.typeFilter = {};
    $scope.features = Object.keys(TypesSrv.featureTypes);

    angular.forEach($scope.features, function(value) {
      $scope.typeFilter[value] = true;
    });

    var geoJson;

    console.log(L);
    var layers = {
      'Pirate': L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'hige.9ded2269',
        accessToken: 'pk.eyJ1IjoiaGlnZSIsImEiOiIwN2JiODA3YjA3OTdiNjQ4M2Y2YWNmNmY3MTQwYjJmNiJ9.e4oANPHLcagfY2iJY65QWg'
      })
    };

    var icons = {
      photo: L.AwesomeMarkers.icon({
        icon: 'fa-camera-retro',
        prefix: 'fa',
        markerColor: 'blue'
      }),
      Feature: L.AwesomeMarkers.icon({
        icon: 'fa-circle-o',
        prefix: 'fa',
        markerColor: 'green'
      }),
      image: L.AwesomeMarkers.icon({
        icon: 'fa-instagram',
        prefix: 'fa',
        markerColor: 'green'
      }),
      video: L.AwesomeMarkers.icon({
        icon: 'fa-video-camera',
        prefix: 'fa',
        markerColor: 'red'
      }),
      tweet: L.AwesomeMarkers.icon({
        icon: 'fa-twitter',
        prefix: 'fa',
        markerColor: 'green'
      })
    };

    function init(map) {
      map.on('click', onMapClick);
      map.addLayer(layers.Pirate);
      geoJsonSrv.getMarkers().success(function(data) {
        window.otherTags = data;
        $scope.otherTags = data;
        $scope.overlays = L.layerGroup().addTo(map);
        $scope.map = map;
        $scope.drawMarkers();

      });
    }

    $scope.showStations = function() {
      // first collect all of the checked boxes and create an array of strings
      // // like ['green', 'blue'] then remove any previously-displayed marker
      // groups
      var list = [];
      angular.forEach($scope.typeFilter, function(value, key){
        if(value) {
          list.push(key);
        }
      });
      console.log(list)
      //overlays.clearLayers();
      //// create a new marker group
      //var clusterGroup = new L.MarkerClusterGroup().addTo(overlays);
      //// and add any markers that fit the filtered criteria to that group.
      //layers.eachLayer(function(layer) {
      //  if (list.indexOf(layer.feature.properties.line) !== -1) {
      //    clusterGroup.addLayer(layer);
      //  }
      //});
    };
    //var overlays = L.layerGroup().addTo(map);
    $scope.drawMarkers = function() {

      var map = $scope.map;
      var list = [];
      angular.forEach($scope.typeFilter, function(value, key){
        if(value) {
          list.push(key);
        }
      });
      $scope.overlays.clearLayers();
      var markers = L.markerClusterGroup().addTo($scope.overlays);
      var geoJsonData = getDataAsGeoJson();
      geoJson = L.geoJson(geoJsonData, {
        onEachFeature: function(feature) {
          if (list.indexOf(feature.properties.type) !== -1) {
            var icon = feature.properties.type;
            var marker = L.marker(feature.geometry.coordinates, {
              icon: TypesSrv.featureTypes[icon].marker
            }).bindPopup(getPopupContent(feature)).addTo(markers);
          }
          //} //var marker = L.marker(feature.geometry.coordinates, {
          //  icon: TypesSrv.featureTypes[icon].marker
          //}).bindPopup(getPopupContent(feature)).addTo(map);
          //.on('click', function(e) {
          //  $state.go('post', {
          //    id: feature.properties.id
          //  })
          //});
          /*if (feature.properties.href || false) {
           var popup = L.popup({
           maxWidth: 500,
           minWidth: 350
           }).setContent('<div fbml class="fb-post" data-href="' + feature.properties.href + '" data-width="300"></div>');
           marker.bindPopup(popup);
           };*/
        }
      });
      console.log(markers)
      map.addLayer(markers);
      $scope.map.fitBounds(markers.getBounds());
      map.on('click', function(e) {
        var marker = e.marker;
      });
      L.geoJson($scope.otherTags.Lines, {
        onEachFeature: function(feature, layer) {
          layer.bindPopup(getPopupContent(feature))
        }
      }).addTo(map);
    };


    function getPopupContent(marker) {

      var content;
      var obj = (marker.hasOwnProperty('properties')) ?
        marker.properties :
        marker;
      var type = obj.featType || obj.type;
      switch(type) {
        case 'photo':
          content = '<h5>' + obj.name + '</h5><img src="' + obj.popupContent + '">';
          break;
        case 'video':
          content = '<h5>' + obj.name + '</h5>' + obj.popupContent;
          break;
        case 'Feature':
          content = '<h5>' + obj.name + '</h5><p>' + obj.popupContent + '</p>';
          break;
        case 'hanami':
        case 'wish':
          if (obj.popupContent) {
            content = '<h5>' + obj.name + '</h5><a href="' + obj.popupContent + '">Info</a>';
          } else {
            content = '<h5>' + obj.name + '</h5>';
          }
          break;
        default:
          content = '<h5>' + obj.name + '</h5><p>' + obj.popupContent + '</p>';
          break;
      }
      if (marker.hasOwnProperty('properties')) {
        content += '<br /><a href="https://maps.google.com/maps/@' + marker.geometry.coordinates.join() + ',20z">GMap</a>';
      }
      var className = TypesSrv.featureTypes[type].className;
      var popup = L.popup({
        className: className
      }).setContent(content);
      return popup;

    }

    $scope.$watch('map', function(map) {
      if (!map) {
        return;
      }
      init(map);
      $scope.$watch('map');
    });

    var clickMarker = false;

    function onMapClick(e) {
      console.log("You clicked the map at " + e.latlng);
      /*var popup = L.popup();
       popup
       .setLatLng(e.latlng)
       .setContent("You clicked the map at " + e.latlng.toString())
       .openOn(map);*/
    }


    /*
     var click = function(ev) {
     if (clickMarker != false) {
     $scope.map.removeLayer(clickMarker);
     }
     clickMarker = L.marker(ev.latlng).addTo($scope.map);

     var link = $('<button class="md-raised md-primary md-button md-default-theme" tabindex="0">¡Propone un destino!</button>').click(function() {
     $state.go('subite', {
     lat: ev.latlng.lat,
     lng: ev.latlng.lng
     });
     })[0];

     clickMarker.bindPopup(link).openPopup();
     }
     */

    function popupclose(e) {
      if (clickMarker != false && e.popup == clickMarker.getPopup()) {
        $scope.map.removeLayer(clickMarker);
        clickMarker = false;
      }
    };

    $scope.evMap = {
      //click: click,
      popupclose: popupclose
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

    function getPointsGroupedByCity() {
      var places = $scope.otherTags.Places;
      var group = {};
      //itero paises
      angular.forEach(places, function(pais, count) {
        angular.forEach(pais, function(ciudades, nombrePais) {
          group[nombrePais] = {};
          //itero ciudades
          angular.forEach(ciudades, function(ciudad, cont) {
            angular.forEach(ciudad, function(puntos, nombreCiudad) {
              group[nombrePais][nombreCiudad] = [];
              //itero puntos
              var points = [];
              angular.forEach(puntos, function(punto, cont) {
                points.push(
                  L.marker(punto.geometry.coordinates).bindPopup(punto.properties.popupContent)
                );
              });
              group[nombrePais][nombreCiudad] = L.layerGroup(points);
            });
          });
        });
      });
      //console.log(group);
      return group;

    }

    function getPointsGroupedByCountry() {
      var places = $scope.otherTags.Places;
      var group = {};
      //itero paises
      angular.forEach(places, function(pais, count) {
        angular.forEach(pais, function(ciudades, nombrePais) {
          group[nombrePais] = [];
          var points = [];
          //itero ciudades
          angular.forEach(ciudades, function(ciudad, cont) {
            angular.forEach(ciudad, function(puntos, nombreCiudad) {
              //itero puntos
              angular.forEach(puntos, function(punto, cont) {
                points.push(
                  L.marker(punto.geometry.coordinates).bindPopup(punto.properties.popupContent)
                );
              });
              group[nombrePais] = L.layerGroup(points);
            });
          });
        });
      });
      //console.log(group);
      return group;

    }
  });
