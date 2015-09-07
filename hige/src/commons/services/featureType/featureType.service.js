angular.module('myPath')
  .factory('TypesSrv', function() {
    //Default
    var self = {};

    self.featureTypes = {
      photo: {
        marker: L.AwesomeMarkers.icon({
          icon: 'fa-camera-retro',
          prefix: 'fa',
          markerColor: 'blue'
        }),
        className: 'photoPopup'
      },
      Feature: {
        marker: L.AwesomeMarkers.icon({
          icon: 'fa-circle-o',
          prefix: 'fa',
          markerColor: 'green'
        }),
        className: 'photoPopup'
      },
      wish: {
        marker: L.AwesomeMarkers.icon({
          icon: 'fa-circle-o',
          prefix: 'fa',
          markerColor: 'orange'
        }),
        className: 'photoPopup'
      },
      hanami: {
        marker: L.AwesomeMarkers.icon({
          icon: 'fa-circle-o',
          prefix: 'fa',
          markerColor: 'pink'
        }),
        className: 'photoPopup'
      },
      image: {
        marker: L.AwesomeMarkers.icon({
          icon: 'fa-instagram',
          prefix: 'fa',
          markerColor: 'green'
        }),
        className: 'photoPopup'
      },
      video: {
        marker: L.AwesomeMarkers.icon({
          icon: 'fa-video-camera',
          prefix: 'fa',
          markerColor: 'red'
        }),
        className: 'photoPopup'
      },
      tweet: {
        marker: L.AwesomeMarkers.icon({
          icon: 'fa-twitter',
          prefix: 'fa',
          markerColor: 'blue'
        }),
        className: 'tweetPopup'
      }
    };

    self.geometryTypes = {
      Point: {
        coordinates: [0, 0]
      },
      LineString: {
        coordinates: [[0, 0]]
      },
      Polygon: {
        coordinates: [[[0, 0]]]
      }
    }

    return self;
  });
