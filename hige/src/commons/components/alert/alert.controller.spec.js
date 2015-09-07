'use strict';

describe('Controller :: Alert', function(){
  var scope,
      controller,
      modalInstance = { close: function() {}, dismiss: function() {} };

  beforeEach(module('myPath'));

  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    controller = $controller('AlertCtrl', {
      $scope: scope,
      $modalInstance: modalInstance,
      params: {}
    });
  }));

  it('Are closed when close?', function(){
    scope.close();
    spyOn(modalInstance, 'close');
  })

});
