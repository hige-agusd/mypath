'use strict';

describe('Directive :: Culture', function () {

  // load the directive's module
  beforeEach(module('myPath'));

  var element,
      scope,cultureSrv;

  beforeEach(inject(function ($rootScope,CultureSrv) {
    scope = $rootScope.$new();
    //Give reference to CultureSrv to spy getTextDirection
    cultureSrv = CultureSrv;
  }));

  //Test if directive add class to element.
  it('Add Class', inject(function ($compile) {
    spyOn(cultureSrv, "getTextDirection").and.returnValue('leftToRight');
    element = angular.element('<div culture></div>');
    element = $compile(element)(scope);
    expect(element.hasClass(cultureSrv.getTextDirection())).toBe(true);
  }));

  //Test if leave rtl class when culture are rtl
  it('Leave RTL css', inject(function ($compile) {
    var test = $('<div>').append($('<link href="aa_rtl_aa">'));
    //Use this spy for overwirte jquery selector.
    spyOn(window,'$').and.returnValue(test.children());
    spyOn(cultureSrv, "getTextDirection").and.returnValue('rightToLeft');
    element = angular.element('<div culture></div>');
    element = $compile(element)(scope);
    expect(test.children().length).toBe(1);
  }));

  //Test if rtl style are remove when culture is not rtl
  it('Remove RTL link', inject(function ($compile) {
    var test = $('<div>').append($('<link href="aa_rtl_aa">'));
    spyOn(window,'$').and.returnValue(test.children());
    spyOn(cultureSrv, "getTextDirection").and.returnValue('leftToRight');
    element = angular.element('<div culture></div>');
    element = $compile(element)(scope);
    expect(test.children().length).toBe(0);
  }));
});
