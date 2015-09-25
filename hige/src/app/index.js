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
  .config(function ($stateProvider, $urlRouterProvider, $compileProvider) {
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
  });
