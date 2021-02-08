import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerComponent } from './banner.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {establishLocalStorageSpies} from '../test-utilities.spec';
import {Router} from '@angular/router';
import {AppService} from '../app.service';

describe('BannerComponent', () => {
  let component: BannerComponent;
  let fixture: ComponentFixture<BannerComponent>;
  let router: Router;
  let service: AppService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BannerComponent ],
      imports: [ HttpClientTestingModule, RouterTestingModule ],
      providers: [
        {
          provide: AppService,
          useValue: {
            username: ''
          }
        }
      ]
    })
    .compileComponents();
    establishLocalStorageSpies();
    router = TestBed.get(Router);
    service = TestBed.get(AppService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should remove username from localStorage on logout', function () {
    const key = 'username';
    const username = 'Matt';
    service.username = username;
    localStorage.setItem(key, username);
    component.logout();
    expect(localStorage.getItem(key)).toBeFalsy();
    expect(service.username).toBe('');
  });

  it('should display \'Welcome\' when logged in', function () {
    service.username = 'Matt';
    fixture.detectChanges();
    const el: HTMLElement = fixture.debugElement.nativeElement;
    const tag = el.querySelector('.welcome');
    expect(tag.innerHTML.includes(`Welcome ${service.username}`)).toBeTruthy();
  });

  it('should not have a welcome class if not logged in', function () {
    service.username = null;
    fixture.detectChanges();
    const el: HTMLElement = fixture.debugElement.nativeElement;
    const tag = el.querySelector('.welcome');
    expect(tag).toBeFalsy();
  });
});
