'use strict';

describe('Directive :: touchSref', function () {

  // load the directive's module
  beforeEach(module('myPath'));

  var element,scope,state;

  beforeEach(inject(function ($rootScope,$state,$httpBackend) {
    scope = $rootScope.$new();
    state = $state;
    $httpBackend.whenGET('app/main/main.html').respond(200, '');
  }));

  it('Go to specified state when touchend', inject(function ($compile) {
    spyOn(state,'go').and.returnValue(true);
    element = angular.element('<a touch-sref ui-sref="test"></a>');
    element = $compile(element)(scope);
    scope.$apply();
    element.trigger('touchend');
    expect(state.go.calls.argsFor(0)).toEqual(['test']);
  }));
});
