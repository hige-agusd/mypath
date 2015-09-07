'use strict';

describe('Directive :: InputDisablePolyfill', function () {

  // load the directive's module
  beforeEach(module('myPath'));

  var element,
      scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  //Test if leave rtl class when culture are rtl
  it('No IE', inject(function ($compile) {
    element = angular.element('<div input-disable-polyfill="true"></div>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.hasClass('disabledPolyfill')).toBe(false);
  }));

  it('IE', inject(function ($compile) {
    element = angular.element('<div input-disable-polyfill></div>');
    window.is_ie = true;
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.hasClass('disabledPolyfill')).toBe(true);
  }));
});
