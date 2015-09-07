'use strict';

describe('Directive :: Theme', function () {

  // load the directive's module
  beforeEach(module('myPath'));

  var element,scope,uiSrv;

  beforeEach(inject(function ($rootScope,UiSrv) {
    scope = $rootScope.$new();
    uiSrv = UiSrv;
  }));

  it('Add class', inject(function ($compile) {
    spyOn(uiSrv,'getTheme').and.returnValue('light');
    element = angular.element('<div theme></div>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.hasClass('light')).toBe(true);
  }));

  it('If dark, remove light', inject(function ($compile) {
    var styles = $('<div>')
                  .append('<link href="dark">')
                  .append('<link href="light">');
    spyOn(uiSrv,'getTheme').and.returnValue('dark');
    spyOn(window,'$').and.callFake(function(selector){
      if(selector == 'link')
        return styles.children()
      return angular.element(selector);
    });
    element = angular.element('<div theme></div>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(styles.children().length).toBe(1);
  }));

  it('If light, remove dark', inject(function ($compile) {
    var styles = $('<div>')
                  .append('<link href="dark">')
                  .append('<link href="light">');
    spyOn(uiSrv,'getTheme').and.returnValue('light');
    spyOn(window,'$').and.callFake(function(selector){
      if(selector == 'link')
        return styles.children()
      return angular.element(selector);
    });
    element = angular.element('<div theme></div>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(styles.children().length).toBe(1);
  }));
});
