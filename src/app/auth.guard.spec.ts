import {async, inject, TestBed} from '@angular/core/testing';

import {AuthGuard} from './auth.guard';
import {RouterTestingModule} from '@angular/router/testing';
import {ROUTES} from './app.module';
import {Router} from '@angular/router';
import {establishLocalStorageSpies} from './test-utilities.spec';
import {AppComponent} from './app.component';
import {MembersComponent} from './members/members.component';
import {LoginComponent} from './login/login.component';
import {MemberDetailsComponent} from './member-details/member-details.component';
import {ReactiveFormsModule} from '@angular/forms';
import {BannerComponent} from './banner/banner.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let router: Router;
  let fixture;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
          RouterTestingModule.withRoutes(ROUTES),
          HttpClientTestingModule,
          ReactiveFormsModule
      ],
      declarations: [
          AppComponent,
          BannerComponent,
          MembersComponent,
          MemberDetailsComponent,
          LoginComponent
      ],
      providers: [
          AuthGuard,
      ]
    }).compileComponents();
    establishLocalStorageSpies();
    fixture = TestBed.createComponent(AppComponent);
    guard = TestBed.get(AuthGuard);
    router = TestBed.get(Router);
    router.initialNavigation();
  }));

  it('should be defined', inject([AuthGuard], () => {
    expect(guard).toBeDefined();
  }));

  it('should return false when logged in', () => {
    // Ensuring localStorage is empty
    localStorage.clear();
    const ans = guard.canActivate(null, null);
    expect(ans).toBeFalsy();
  });

  it('should return true when  logged in', () => {
    // Ensuring localStorage is empty
    localStorage.clear();
    localStorage.setItem('username', 'PinheadLarry');
    const ans = guard.canActivate(null, null);
    expect(ans).toBeTruthy();
  });
});
