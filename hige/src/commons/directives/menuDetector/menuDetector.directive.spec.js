'use strict';

describe('Directive :: MenuDetector', function () {

  // load the directive's module
  beforeEach(module('myPath'));

  var element,
      scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  //Test if leave rtl class when culture are rtl
  it('Add class to body', inject(function ($compile) {
    var test = $('<div class="noMenu">');
    //Use this spy for overwirte jquery selector.
    spyOn(window,'$').and.returnValue(test);
    element = angular.element('<div menu-detector></div>');
    element = $compile(element)(scope);
    expect(test.hasClass('noMenu')).toBe(false);
  }));
});
