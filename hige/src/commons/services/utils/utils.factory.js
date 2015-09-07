  'use strict';

  /**
   * {Factory} UtilsSrv
   * @fileOverview Service utils and helpers
   */
  angular
    .module('myPath')
    .factory('UtilsSrv', function($location, $state, $window) {
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
    });
