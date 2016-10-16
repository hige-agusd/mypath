'use strict';

angular.module('myPath', [
  'ngCookies',
  'ngTouch',
  'ngSanitize',
  'ngResource',
  'ui.router',
  //'$compileProvider',
  'ui.bootstrap',
  'angularSoap',
  'dndLists'])
  .config(["$stateProvider", "$urlRouterProvider", "$compileProvider", function ($stateProvider, $urlRouterProvider, $compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|data):/);

    $stateProvider
      .state('menu', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .state('personal_details', {
        url: '/personal_details',
        templateUrl: 'app/personal_details/personal_details.html',
        controller: 'PersonalDetailsCtrl'
      })
      .state('menu_personal_details', {
        url: 'menu/personal_details',
        parent: 'menu',
        templateUrl: 'app/personal_details/personal_details.html',
        controller: 'PersonalDetailsCtrl'
      })
      .state('maps', {
        url: '/maps',
        templateUrl: 'app/maps/maps.html',
        controller: 'MapsCtrl'
      })
      .state('menu_maps', {
        url: 'menu/maps',
        parent: 'menu',
        templateUrl: 'app/maps/maps.html',
        controller: 'MapsCtrl'
      })
      .state('feedback', {
        url: '/feedback',
        templateUrl: 'app/feedback/feedback.html',
        controller: 'FeedbackCtrl'
      })
      .state('menu_feedback', {
        url: 'menu/feedback',
        parent: 'menu',
        templateUrl: 'app/feedback/feedback.html',
        controller: 'FeedbackCtrl'
      })
      .state('funding', {
        url: '/funding',
        templateUrl: 'app/funding/funding.html',
        controller: 'FundingCtrl'
      })
      .state('menu_funding', {
        url: 'menu/funding',
        parent: 'menu',
        templateUrl: 'app/funding/funding.html',
        controller: 'FundingCtrl'
      })
      /**
       * New states for URL parameter redirect.
       */
      .state('menu_edit', {
        url: 'menu/edit',
        parent: 'menu',
        templateUrl: 'app/edit/edit.html',
        controller: 'EditCtrl'
      })
      .state('edit', {
        url: 'edit',
        templateUrl: 'app/edit/edit.html',
        controller: 'EditCtrl'
      })
      .state('menu_itinerary', {
        url: 'menu/itinerary',
        parent: 'menu',
        templateUrl: 'app/itinerary/itinerary.html',
        controller: 'ItineraryCtrl'
      })
      .state('itinerary', {
        url: 'itinerary',
        templateUrl: 'app/itinerary/itinerary.html',
        controller: 'ItineraryCtrl'
      })
      .state('view_maps', {
        url: '/maps',
        templateUrl: 'app/maps/maps.html',
        controller: 'MapsCtrl'
      })
      .state('menu_view_maps', {
        url: 'menu/maps',
        parent: 'menu',
        templateUrl: 'app/maps/maps.html',
        controller: 'MapsCtrl'
      });

    $urlRouterProvider.otherwise('/');
  }]);

  'use strict';

  /**
   * {Factory} UtilsSrv
   * @fileOverview Service utils and helpers
   */
  angular
    .module('myPath')
    .factory('UtilsSrv', ["$location", "$state", "$window", function($location, $state, $window) {
      var self = {};

      /**
       * @name isBrowser
       * @description Executes some function when the condition is true
       * @param condition {Function}
       * @param fn {Function}
       * @returns {*}
       */
      self.isBrowser = function(condition, fn) {
        var name    = self.navigator().getName(),
            version = self.navigator().getVersion();

console.log(condition);
        return condition(name, version) ? fn($state, self) : false;
      };


      /**
       * @name navigator
       * @description Mod for $window.navigator adding support to identify
       *              the browser
       * @returns {Object}
       */
      self.navigator = function() {
        var nav       = $window.navigator,
            userAgent = nav.userAgent.toLowerCase(),
            currentNav;

        // Initializer
        (function init() {
          currentNav = chrome() || firefox() || ie();
        })();

        // Internet Explorer
        function ie() {
          var rv = false, regex;
          regex = new RegExp("(msie |trident/.*rv:)([0-9]{1,}[\.0-9]{0,})");
          rv = regex.exec(userAgent) === null ? rv : parseFloat(RegExp.$2);

          return rv === false ? rv : {
            name: 'msie',
            version: rv
          };
        }
        // Chrome
        function chrome() {
          return (
            /chrome|chromium/.test(userAgent) &&
            /google inc/i.test(nav.vendor)
          ) ? {
            name: 'chrome',
            version: parseInt(userAgent.split('chrome/')[1])
          } : false;
        }
        // Firefox
        function firefox() {
          return userAgent.indexOf('firefox') !== -1 ? {
            name: 'firefox',
            version: parseInt(userAgent.split('firefox/')[1])
          } : false;
        }

        return {
          isIE: ie,
          isChrome: chrome,
          isFirefox: firefox,
          get: function() {
            return currentNav;
          },
          getName: function() {
            return this.get().name;
          },
          getVersion: function() {
            return this.get().version;
          }
        };
      };


      /**
       * @name location
       * @description Mod for $window.location
       * @returns {Object}
       */
      self.location = function() {
        var loc = $location;

        /**
         * @name setProtocol
         * @description Will set a given protocol by redirecting
         * @param np {String}
         */
        function setProtocol(np) {
          var cp = loc.protocol();
          if (cp !== np) {
            $window.location.href =
              np + $window.location.href.substring(cp.length);
          }
        }

        /**
         * @name queryString
         * @description Get the query string or finds some key
         * @param key {String}
         * @returns {*}
         */
        function queryString(key) {
          var qs = loc.hash().split('?');
          qs = qs.length > 1 ? qs[1].toLowerCase() : loc.hash().toLowerCase();
          return key === undefined ? qs : qs.indexOf(key) !== -1;
        }

        /**
         * @name getCurrentDir
         * @description Gets current document path
         *              and returns the current directory.
         * @return {String}
         */
        function getCurrentDir() {
          var d = $window.location.pathname;
          d = d.replace(/[\\\/][^\\\/]*$/, '');
          d = d.replace('/', '');
          d = d.replace('web/', '');

          return d || 'default'
        }

        return {
          queryString: queryString,
          getCurrentDir: getCurrentDir,
          setProtocol: setProtocol
        };
      };

      return self;
    }]);

angular.module('myPath')
  .factory('UserSrv', ["$q", "Call2ApiSrv", "CultureSrv", "SessionSrv", function($q,Call2ApiSrv,CultureSrv,SessionSrv) {

  var self = {},
      userData = false;

  self.getUserData = function(){
    var deferred = $q.defer();
    if(userData == false){
      Call2ApiSrv.makeGetSignCall('UserAccount/ClientAndTradingAccount',{}, 'json').then(function(response){
        userData = response;
        deferred.resolve(userData);
      },function(response){
        deferred.reject(response);
      });
    }else{
      deferred.resolve(userData);
    }
    return deferred.promise;
  }

  /*
  session/changePassword?
    UserName=3t999&
    Session=cc053279-d106-4dda-ba1b-50adad98e5b
  {
    NewPassword: "password1"
    Password: "password"
    UserName: "3t999"
  }
  */
  self.updatePassword = function(_old,_new){
    var deferred = $q.defer();

    var username = SessionSrv.getSessionParameter();

    Call2ApiSrv.makePostSignCall('session/changePassword',{},{
      'NewPassword': _new,
      'Password': _old,
      'UserName': username.UserName
    }, 'json').then(function(response){
      deferred.resolve(response);
    },function(response){
      deferred.reject(response);
    });

    return deferred.promise;
  }

  self.updateEmail = function(_new){
    var deferred = $q.defer();

    Call2ApiSrv.makePostSignCall('userAccount/save',{},{
      "personalEmailAddress": _new,
      "personalEmailAddressIsDirty": true
    }, 'json').then(function(response){
      deferred.resolve(response);
    },function(response){
      deferred.reject(response);
    });

    return deferred.promise;
  };

  return self;
}]);

angular.module('myPath')
  .factory('UiSrv', ["$modal", "$location", function($modal,$location) {

  var self = {
    Types: {
      Error: 'error',
      Success: 'success'
    }
  };

  var currentTheme = false;

  self.getTheme = function(){
    if(currentTheme == false){
      currentTheme = $location.search().TH || 'dark';
    }
    return currentTheme;
  }

  self.showModal = function(params){
    return $modal.open({
      templateUrl: 'commons/components/alert/alert.html',
      controller: 'AlertCtrl',
      size: params.size,
      resolve: {
        params: function() {
          return params;
        }
      }
    });
  }

  return self;
}])

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
    .factory('geoJsonSrv', ["$q", "$rootScope", "$http", function($q, $rootScope, $http) {
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
    }]);
})();

angular.module('myPath')
  .factory('ConfigSrv', ["ParamsSrv", "$http", "$q", function(ParamsSrv, $http, $q) {

    var self = {
      map: {}
    };

    var ie8Hack = {
      'live': {
        SrvUrl: 'https://ciapi.cityindex.com/TradingAPI/',
        StatementUrl: 'https://trade.loginandtrade.com/flashASP/host/progs/ViewStatement/ViewStatement'
      },
      'ppe': {
        SrvUrl: 'https://ciapipreprod.cityindextest9.co.uk/tradingapi/',
        StatementUrl: 'http://pkh-ppe-web01/flashASP/host/progs/ViewStatement/ViewStatement'
      },
      'qat': {
        SrvUrl: 'https://ciapiqat.cityindextest9.co.uk/tradingapi/',
        StatementUrl: 'http://pkh-qat-app01:8002/flashASP/host/progs/ViewStatement/ViewStatement'
      }
    }

    var ready = false,
        pending = [],
        envStr;

    if(ParamsSrv.ENV){
      if(ParamsSrv.ENV == 'ppe')
        ParamsSrv.ENV = 'preprod';
      envStr = '_'+ParamsSrv.ENV;
    }else{
      envStr = '';
    }

      $http.get('./config'+envStr+'.xml', {'type': 'xml'}).then(function(configStr){
	configStr = configStr.data;
        var config = (typeof is_ie == 'undefined')? $(configStr) : $($.parseXML(configStr));
	//var config = $(configStr);
        self.map['SrvUrl'] =  config.find('tradingApiURL').text();
        self.map['StatementUrl'] =  config.find('vsClientProxy').text();
        ready = true;
        _.each(pending,function(func){
          func();
        });
      });

    self.get = function(key){
      var deferred = $q.defer();
      if(!ready){
        pending.push(function(){
          deferred.resolve(self.map[key]);
        });
      }else{
        deferred.resolve(self.map[key]);
      }
      return deferred.promise;
    };

    return self;
  }]);

angular.module('myPath')
  .factory('Call2ApiSrv', ["$q", "HTTPSrv", "$location", "$window", "SessionSrv", "ConfigSrv", function($q,HTTPSrv,$location,$window,SessionSrv,ConfigSrv) {

  var self = {};

  function extendSignParams(_params){
    return angular.extend({}, SessionSrv.getSessionParameter(),_params);
  }

  function makeSignCall(_method,_path,_params,_data, type){
    var deferred = $q.defer();
    ConfigSrv.get('SrvUrl').then(function(_base){
      HTTPSrv.request({
        method: _method,
        url: _base + _path,
        params: extendSignParams(_params),
        data: _data,
	responseType: type
      }).then(function(data){
        deferred.resolve(data);
      }, function(data){
        deferred.reject(data);
      });
    });
    return deferred.promise;
  }

  self.makeGetSignCall = function(_path,_params,type){
    return makeSignCall('GET',_path,_params,{},type);
  }

  self.makePostSignCall = function(_path,_params,_data,type){
    return makeSignCall('POST',_path,_params,_data,type);
  }

  return self;
}])

angular.module('myPath')
  .directive("touchSref", ["$rootScope", "$state", "$location", function($rootScope,$state,$location) {
    return {
      restrict: "A",
      link: function(scope,element,attrs) {
        var state = attrs.uiSref;
        element.on('touchend',function(e){
          $state.go(state);
        })
      }
    }
  }]);

angular.module('myPath')
  .directive("theme", ["$rootScope", "UiSrv", function($rootScope,UiSrv) {
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
  }]);

/**
  @fileoverview Dropdown directive. A custom dropdown.
  @author Agustin Diaz agustin.diaz@globallogic.com
*/
angular.module('myPath')
  .directive("myDropdown", ["$rootScope", function($rootScope) {
    return {
      restrict: "AE",
      templateUrl: "commons/directives/dropdown/dropdown.html",
      scope: {
        placeholder: "@", // Text to display as default in the dropdown
        list: "=", // List of values for the dropdown options
        selected: "=", // Selected item
        property: "@" // Property to determine if the item is selected
      },
      link: function(scope, element) {
        scope.listVisible = false;
        scope.isPlaceholder = true;

        scope.is_ie = (typeof is_ie !== 'undefined')? is_ie : false;
        scope.select = function(item) {
          scope.isPlaceholder = false;
          scope.selected = item;
          scope.hide();
        };


  	/**
  	 * Function to set if an item is selected
	 * @returns {boolean} A flag determining if an item is selected
  	 */
        scope.isSelected = function(item) {
          return item[scope.property] === scope.selected[scope.property];
        };


        scope.toggle = function() {
          scope.listVisible = !scope.listVisible;
          if(scope.listVisible){
            scope.show();
          }
        }


        scope.show = function() {
          scope.listVisible = true;
          $('html').one('click',function() {
            scope.hide();
          });

          element.one('click',function(event){
            event.stopPropagation();
          })
        };


        scope.hide = function() {
          scope.listVisible = false;
          scope.$apply();
        };


        scope.$watch("selected", function(value) {
          scope.isPlaceholder = scope.selected[scope.property] === undefined;
          scope.display = scope.selected[scope.property];
        });
      }
    }
  }]);

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

angular.module('myPath')
  .directive("menuDetector", ["$rootScope", "UiSrv", function($rootScope,UiSrv) {
    return {
      restrict: "A",
      link: function(scope,element){
        $('body').removeClass('noMenu');
      }
    }
  }]);

angular.module('myPath')
  .directive("myMap", ["$rootScope", "$timeout", function($rootScope, $timeout) {
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
  }]);

'use strict';

angular.module('myPath')
  .controller('AlertCtrl', ["$scope", "params", "$modalInstance", function ($scope,params,$modalInstance) {
    $scope.params = params;
    $scope.close = function () {
      $modalInstance.close();
    };
}]);

'use strict';

angular.module('myPath')
  .controller('NavbarCtrl', ["$scope", function ($scope) {
    $scope.view = 'components/navbar/navbar.html';
    $scope.$broadcast('menu::ready');
  }]);

'use strict';

angular.module('myPath')
  .controller('MapsCtrl', ["$rootScope", "$scope", "geoJsonSrv", "TypesSrv", function($rootScope, $scope, geoJsonSrv, TypesSrv) {
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
  }]);

'use strict';

angular.module('myPath')
  .controller('MainCtrl', ["$scope", "$location", "$state", function ($scope, $location, $state) {
    var destinationState = '',
         showMenu = $location.search().showMenu,
         page = $location.search().page;

    //UserSrv.getUserData();

    $scope.invalid = false;

    if (showMenu == 'true') {
        destinationState = 'menu_';
    }

    if (typeof showMenu == 'undefined') {
        showMenu = true;
    }

    $scope.showMenu = showMenu;
    $scope.showMenu = false;

    destinationState += page;

    $scope.toggleMenu = function() {
      console.log($scope.showMenu)
      $scope.showMenu = (!$scope.showMenu);
      console.log($scope.showMenu)
    };

    function changeState(state) {
        $state.go(state);
    }

    var validState = $state.is(destinationState);

    if (typeof page != 'undefined' && typeof validState != 'undefined' ) {
        changeState(destinationState);
    } else {
        if (typeof page != 'undefined') {
            $scope.invalid = true;
        }
    }

    $scope.test = 'This is a test';
  }]);

'use strict';

angular.module('myPath')
  .controller('ItineraryCtrl', ["$rootScope", "$scope", "geoJsonSrv", "TypesSrv", function($rootScope, $scope, geoJsonSrv, TypesSrv) {
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

  }]);

'use strict';

angular.module('myPath')
  .controller('EditCtrl', ["$rootScope", "$scope", "geoJsonSrv", "TypesSrv", function($rootScope, $scope, geoJsonSrv, TypesSrv) {
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
  }])
;

var REVISION = 'DEV';

angular.module("myPath").run(["$templateCache", function($templateCache) {$templateCache.put("app/edit/edit.html","<div id=\"editor\" ng-hide=\"loading\" class=\"myPathView\" ng-init=\"init()\"><br><label><input type=\"radio\" ng-model=\"PlaceOrLine\" value=\"Places\"> Places</label> <label><input type=\"radio\" ng-model=\"PlaceOrLine\" value=\"Lines\"> Lines</label><br><form ng-submit=\"addNode()\" ng-if=\"PlaceOrLine == \'Places\'\"><div class=\"container-fluid\"><div class=\"form-group\"><h5>Place:</h5><div class=\"ddown\" ng-repeat=\"row in dropdowns\" ng-show=\"row.options.length > 2 || ( dropdowns[0].other && pais )\"><label ng-bind-html=\"row.column[0]\"></label><select ng-init=\"row.selected = (row.selected) ? row.selected : row.options[0]\" ng-change=\"setter(row.name, row.selected)\" ng-model=\"row.selected\" ng-options=\"v as v for v in row.options\"></select><div ng-if=\"row.other\"><label>{{row.selected}}</label> <input type=\"text\" numbers-only=\"numbers-only\" ng-model=\"otherField\" ng-blur=\"setNewPlace(row.name, otherField)\"></div></div></div></div><div class=\"container-fluid\"><h5>Properties</h5><div class=\"form-group\"><label>Name</label> <input type=\"text\" ng-model=\"point.properties.name\"></div><div class=\"form-group\"><label>Type</label><select ng-init=\"\" ng-model=\"point.properties.type\"><option value=\"{{feature}}\" ng-repeat=\"feature in features\">{{feature}}</option></select></div><div class=\"form-group\"><label>Amenity</label> <input type=\"text\" ng-model=\"point.properties.amenity\"></div><div class=\"form-group\"><label>Popup Content</label> <input type=\"text\" ng-model=\"point.properties.popupContent\"></div></div><div class=\"container-fluid\"><div class=\"form-group coordinates\"><label>Coordinates</label><div><div><label>X</label><br><input type=\"number\" step=\"any\" ng-model=\"point.geometry.coordinates[0]\"></div><div><label>Y</label><br><input type=\"number\" step=\"any\" ng-model=\"point.geometry.coordinates[1]\"></div></div></div></div><div class=\"form-group coordinates\"><label></label> <button ng-click=\"addNode\" value=\"Add\">Add Place</button></div></form><form ng-submit=\"addLine()\" ng-if=\"PlaceOrLine == \'Lines\'\"><div class=\"container-fluid\"><div class=\"form-group\"><label>Name</label> <input type=\"text\" ng-model=\"line.name\"></div><div class=\"form-group\"><label>Popup Content</label> <input type=\"text\" ng-model=\"line.popupContent\"></div></div><div class=\"form-group\"><label>Type</label><select ng-init=\"line.type = geometries[1]\" ng-model=\"line.type\"><option value=\"{{geometry}}\" ng-repeat=\"geometry in geometries | filter:\'!Point\'\">{{geometry}}</option></select></div><div class=\"form-group\"><span ng-click=\"addCoordinates()\">Coordinates +</span></div><div class=\"form-group coordinates\" ng-if=\"line.type == \'LineString\'\" ng-repeat=\"coordinate in line.coordinates track by $index\"><label><span><input type=\"radio\" ng-model=\"Point\" value=\"New\" ng-init=\"Point = \'New\'\"> New</span><br><span><input type=\"radio\" ng-model=\"Point\" value=\"Existing\"> Existing</span></label><div ng-if=\"Point == \'New\'\"><div><label>X</label><br><input type=\"number\" step=\"any\" ng-model=\"coordinate[0]\"></div><div><label>Y</label><br><input type=\"number\" step=\"any\" ng-model=\"coordinate[1]\"></div></div><div ng-if=\"Point == \'Existing\'\"><select ng-model=\"coordinate\" ng-change=\"coordinateSetter(coordinate, $index, coordinates)\"><option ng-repeat=\"point in existingPoints\" value=\"{{point.geometry.coordinates.join(\'#\')}}\">{{point.properties.name}}+{{coordinate}}</option></select></div></div><div class=\"form-group coordinates\" ng-if=\"line.type == \'Polygon\'\" ng-repeat=\"coordinate in line.coordinates[0] track by $index\"><label>Point {{$index}}</label><div><div><label>X</label><br><input type=\"number\" step=\"any\" ng-model=\"coordinate[0]\"></div><div><label>Y</label><br><input type=\"number\" step=\"any\" ng-model=\"coordinate[1]\"></div></div></div><div class=\"form-group coordinates\"><label></label> <button ng-click=\"addLine\" value=\"Add\">Add Line</button></div></form><span><a ng-href=\"{{downloadLink}}\" download=\"other.json\">Download</a></span></div>");
$templateCache.put("app/itinerary/itinerary.html","<div id=\"itinerary\" ng-hide=\"loading\" class=\"myPathView\" ng-init=\"init()\"><br><script type=\"text/ng-template\" id=\"list.html\"><ul dnd-list=\"list\"> <li ng-repeat=\"item in list\" dnd-draggable=\"item\" dnd-effect-allowed=\"move\" dnd-moved=\"list.splice($index, 1)\" dnd-selected=\"models.selected = item\" ng-class=\"{selected: models.selected === item}\" ng-include=\"item.type + \'.html\'\"> </li> </ul></script><script type=\"text/ng-template\" id=\"container.html\"><div class=\"container-element box box-blue\"> <h3>{{item.id}}</h3> <div class=\"column\" ng-repeat=\"list in item.columns\" ng-include=\"\'list.html\'\"></div> <div class=\"clearfix\"></div> </div></script><script type=\"text/ng-template\" id=\"item.html\"><div class=\"item\">{{item.name}}</div></script><div class=\"col-md-10\"><div class=\"row\"><div ng-repeat=\"(zone, list) in models.dropzones\" class=\"itinerary-container\"><div class=\"dropzone box box-yellow\"><h3>{{zone}}</h3><div ng-include=\"\'list.html\'\"></div></div></div></div><div view-source=\"nested\" highlight-lines=\"{markup: \'1-18, 20-28, 40-42, 57-68, 78-82\'}\"></div><h2>Generated Model</h2><pre>{{modelAsJson}}</pre></div><div class=\"col-md-2\"><div class=\"toolbox box box-grey box-padding\"><h3>New Elements</h3><ul><li dnd-draggable=\"item\" dnd-effect-allowed=\"copy\" dnd-copied=\"item.id = item.id + 1\"><div><select ng-model=\"newContainer\" ng-change=\"updateItemDropdown()\"><option ng-repeat=\"city in newContainerDropdown\" value=\"{{city.id}}\">{{city.id}}</option></select></div><button type=\"button\" class=\"btn btn-default btn-lg\" disabled=\"disabled\">{{item.type}} {{newContainer.id}}</button></li><li dnd-draggable=\"item\" dnd-effect-allowed=\"copy\" dnd-copied=\"item.id = item.id + 1\"><div><select ng-model=\"newItem\" ng-change=\"frula()\"><option ng-repeat=\"place in newItemDropdown\" value=\"{{place.id}}\">{{place.name}}</option></select></div><button type=\"button\" class=\"btn btn-default btn-lg\" disabled=\"disabled\">{{item.type}} {{newContainer.id}}</button></li></ul></div></div><span><a ng-href=\"{{downloadLink}}\" download=\"other.json\">Download</a></span></div>");
$templateCache.put("app/main/main.html","<div id=\"myPath\" ng-show=\"!invalid\"><header class=\"myPathHeader\"><div class=\"barsIconWrapper\"><div class=\"barsIcon\"><i ng-click=\"showMenu = !showMenu\" class=\"fa fa-bars\"></i></div></div><div class=\"header\" ng-show=\"showMenu\"><div><div class=\"logo\">myPath</div><div class=\"col-xs-12 col-sm-4 col-md-3 col-lg-2 navBarContainer\"><nav ng-include=\"view\" ng-controller=\"NavbarCtrl\" class=\"navBarPanel\"></nav></div></div></div></header><div class=\"container-fluid myPathViewContainer\" ng-class=\"{full: !showMenu}\"><div class=\"no-gutter myPathRow\"><div class=\"col-xs-12 col-sm-8 col-md-9 col-lg-10 pageViewContainer\"><div ui-view=\"\" class=\"pageViewContent\"></div></div></div></div></div>");
$templateCache.put("app/maps/maps.html","<div id=\"maps\" class=\"myPathView\" ng-init=\"init()\"><div id=\"map\" my-map=\"\"></div><form id=\"types\"><div ng-repeat=\"feature in features track by $index\"><input type=\"checkbox\" ng-model=\"typeFilter[feature]\" name=\"filters\" ng-change=\"drawMarkers();\" value=\"feature\" checked=\"\"> {{feature}}</div></form></div>");
$templateCache.put("components/navbar/navbar.html","<div menu-detector=\"\" class=\"navBar\" role=\"group\" aria-label=\"Vertical button group\"><button ui-sref-active=\"active\" touch-sref=\"\" ui-sref=\"menu_funding_page\"><i></i>Inicio</button> <button ui-sref-active=\"active\" touch-sref=\"\" ui-sref=\"menu_maps\"><i></i>Mapa</button> <button ui-sref-active=\"active\" touch-sref=\"\" ui-sref=\"menu_personal_details\"><i></i>Fotos</button> <button ui-sref-active=\"active\" touch-sref=\"\" ui-sref=\"menu_feedback\" class=\"last-menu-item\"><i></i>Blog</button></div>");
$templateCache.put("commons/directives/dropdown/dropdown.html","<div class=\"dropdown-container\" ng-class=\"{ show: listVisible, isie: is_ie }\"><div class=\"dropdown-display form-control\" ng-click=\"toggle();\" ng-class=\"{ clicked: listVisible }\"><div class=\"dropCaret\"><i></i></div><span ng-if=\"!isPlaceholder\">{{display}}</span> <span class=\"placeholder\" ng-if=\"isPlaceholder\">{{placeholder}}</span></div><div class=\"dropdown-list\"><div><div ng-repeat=\"item in list\" ng-click=\"select(item)\" ng-class=\"{ selected: isSelected(item) }\"><span>{{property !== undefined ? item[property] : item}}</span></div></div></div></div>");
$templateCache.put("commons/components/alert/alert.html","<div ng-class=\"[params.type,\'defaultModal\']\"><div class=\"modal-header\"><h3 class=\"modal-title\">{{params.title}}</h3></div><div class=\"modal-body\"><p>{{params.content}}</p><div class=\"text-center\"><button class=\"btn btn-primary\" ng-click=\"close()\">{{params.action}}</button></div></div></div>");}]);