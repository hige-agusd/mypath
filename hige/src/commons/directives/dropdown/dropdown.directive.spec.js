'use strict';

describe('Directive :: Dropdown', function() {
  var element,
    scope,
    httpBackend,
    //Some base options
    options = [{
      name: 'a',
      id: 0
    }, {
      name: 'b',
      id: 1
    }, {
      name: 'c',
      id: 2
    }],
    //First item are selected
    selected = options[0];

  beforeEach(module('myPath'));

  beforeEach(inject(function($rootScope, $httpBackend, $compile) {
    //Store reference to httpBackend service for flush when compile
    httpBackend = $httpBackend;
    //Prepare catch of theme load
    $httpBackend.whenGET('commons/directives/dropdown/dropdown.html').respond(200,'<div></div>');
    scope = $rootScope.$new();
    //Reference to options and selected in scope
    scope.options = options;
    scope.selected = selected;
  }));

  //Directive are rendered
  it('Render', inject(function($compile) {
    element = $compile('<div my-dropdown placeholder="sarasa" property="name" list="options" selected="selected"></div>')(scope);
    //Fire loaded event in themplate
    httpBackend.flush();
    scope.$apply();
    expect(element.children().is('div')).toBe(true);
  }));

  //When show, dropdown are showed?
  it('Show', inject(function($compile) {
    element = $compile('<div my-dropdown placeholder="sarasa" property="name" list="options" selected="selected"></div>')(scope);
    httpBackend.flush();
    scope.$apply();
    var elScope = element.isolateScope();
    elScope.show()
    expect(elScope.listVisible).toBe(true);
  }));

  //When hide after show, dropdown are hidden?
  it('Hide', inject(function($compile) {
    element = $compile('<div my-dropdown placeholder="sarasa" property="name" list="options" selected="selected"></div>')(scope);
    httpBackend.flush();
    scope.$apply();
    var elScope = element.isolateScope();
    elScope.show();
    elScope.hide();
    expect(elScope.listVisible).toBe(false);
  }));

  //When dropdown are hidden, after toggle is showen. And, when are showed after toggle are hidden?
  it('Toggle', inject(function($compile) {
    element = $compile('<div my-dropdown placeholder="sarasa" property="name" list="options" selected="selected"></div>')(scope);
    httpBackend.flush();
    scope.$apply();
    var elScope = element.isolateScope();
    elScope.toggle();
    expect(elScope.listVisible).toBe(true);
    elScope.toggle();
    expect(elScope.listVisible).toBe(false);
  }));

  //When selecte other item, that new item are selected?
  it('Change Selected', inject(function($compile) {
    element = $compile('<div my-dropdown placeholder="sarasa" property="name" list="options" selected="selected"></div>')(scope);
    httpBackend.flush();
    scope.$apply();
    var elScope = element.isolateScope();
    elScope.selected = options[1];
    elScope.$apply()
    expect(elScope.isSelected(elScope.selected)).toBe(true);
  }));

  //When click inside dropdown, dont hide it?
  it('Nothing clicking inside', inject(function($compile) {
    element = $compile('<div my-dropdown placeholder="sarasa" property="name" list="options" selected="selected"></div>')(scope);
    httpBackend.flush();
    scope.$apply();
    var elScope = element.isolateScope();
    elScope.show();
    element.trigger('click');
    expect(elScope.listVisible).toBe(true);
  }));

  //When click outside of dropdown, it been hidden?
  it('Hide when click outside', inject(function($compile) {
    element = $compile('<div my-dropdown placeholder="sarasa" property="name" list="options" selected="selected"></div>')(scope);
    httpBackend.flush();
    scope.$apply();
    var elScope = element.isolateScope();
    elScope.show();
    angular.element('html').trigger('click');
    expect(elScope.listVisible).toBe(false);
  }));

  //When chang selected like clicking in option, the new option are selected?
  it('Change selected with function', inject(function($compile) {
    element = $compile('<div my-dropdown placeholder="sarasa" property="name" list="options" selected="selected"></div>')(scope);
    httpBackend.flush();
    scope.$apply();
    var elScope = element.isolateScope();
    elScope.show();
    elScope.select(options[2])
    expect(elScope.isSelected(elScope.selected)).toBe(true);
  }));
});
