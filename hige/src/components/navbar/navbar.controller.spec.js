'use strict';

describe('Controllers :: Navbar', function(){
  var scope,
      translateSrvMock,
      controller,
      $httpBackend;

      translateSrvMock = {
          onReady: function() {
            return {
              then: function(callback) {
                callback();
              }
            };
          },
          _: function(text) {
            if(text != 'THIS_IS_NOT_VALID')
              return text;
          }
      };

  beforeEach(function(){
    module('myPath');
  });

  beforeEach(inject(function($rootScope,$controller,$injector) {
    scope = $rootScope.$new();
    controller = $controller;
  }));

  it('Init succesful', function(done) {
    scope.$on('menu::ready',function(){
      done();
    });
    controller('NavbarCtrl', {
      $scope: scope,
      TranslateSrv: translateSrvMock
    });
  });

});
