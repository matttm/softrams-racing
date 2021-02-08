import {async, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {BannerComponent} from './banner/banner.component';
import {APP_BASE_HREF} from '@angular/common';

import {Router, RouterModule} from '@angular/router';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {AppService} from './app.service';
import {establishLocalStorageSpies} from './test-utilities.spec';

describe('AppComponent', () => {
  let service: AppService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent, BannerComponent],
      imports: [RouterModule.forRoot([]), HttpClientTestingModule],
      providers: [
          AppService,
        {provide: APP_BASE_HREF, useValue: '/'},
        {
          provide: Router,
          useClass: class {
            navigate = jasmine.createSpy('navigate').and.returnValue(Promise.resolve());
          }
        }]
    }).compileComponents();
    establishLocalStorageSpies();
    service = TestBed.get(AppService);
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it(`should have as title 'softrams-racing'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('softrams-racing');
  }));
  it('should set username from localStorage if null', function () {
    spyOn(service, 'setUsername').and.callThrough();
    const username = 'matt';
    service.username = null;
    localStorage.setItem('username', username);
    const fixture = TestBed.createComponent(AppComponent);
    const app: AppComponent = fixture.debugElement.componentInstance;
    app.ngOnInit();
    expect(service.setUsername).toHaveBeenCalled();
    expect(service.username).toBe(username);
  });

  it('should set username from localStorage if an empty string', function () {
    spyOn(service, 'setUsername').and.callThrough();
    const username = 'matt';
    service.username = '';
    localStorage.setItem('username', username);
    const fixture = TestBed.createComponent(AppComponent);
    const app: AppComponent = fixture.debugElement.componentInstance;
    app.ngOnInit();
    expect(service.setUsername).toHaveBeenCalled();
    expect(service.username).toBe(username);
  });

  it('should not invoke setUsername if username is already defined', function () {
    spyOn(service, 'setUsername');
    service.username = 'matt';
    const fixture = TestBed.createComponent(AppComponent);
    const app: AppComponent = fixture.debugElement.componentInstance;
    app.ngOnInit();
    expect(service.setUsername).not.toHaveBeenCalled();
  });
});
