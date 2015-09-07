'use strict';

describe('Controller :: Main', function(){
  var scope,
      controller;

  beforeEach(module('myPath'));

  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    controller = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('test defined', inject(function($controller) {
    expect(angular.isString(scope.test)).toBeTruthy();
  }));

  it('test length length are 14', inject(function($controller) {
    expect(scope.test.length == 14).toBeTruthy();
  }));

  it('Test text is valid', inject(function($controller) {
    expect(scope.test === 'This is a test').toBeTruthy();
  }));
});
