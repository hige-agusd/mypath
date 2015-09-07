'use strict';

describe('Service :: Ui', function(){
  var service;

  beforeEach(module('myPath'));

  // instantiate service
  beforeEach(inject(function (_UiSrv_) {
    service = _UiSrv_;
  }));

  it(':: GetTheme',function(){
    expect(service.getTheme()).toBe('dark');
  })

  it(':: GetTheme Else',function(){
    expect(service.getTheme()).toBe('dark');
    expect(service.getTheme()).toBe('dark');
  })
});
