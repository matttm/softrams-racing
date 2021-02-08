import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';

import { HttpClient } from '@angular/common/http';

import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule, RouterModule, HttpClientModule],
      providers: [
        {
          provide: Router,
          useClass: class {
            navigate = jasmine.createSpy('navigate').and.returnValue(Promise.resolve());
          }
        },
        HttpClient
      ]
    }).compileComponents();
    router = TestBed.get(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should invoke login when form is valid', function () {
    spyOn(component, 'login');
    const el: HTMLElement = fixture.debugElement.nativeElement;
    const submit = el.querySelector('button');
    const controls = component.loginForm.controls;
    controls['username'].setValue('matt');
    controls['password'].setValue('password');
    fixture.detectChanges();
    submit.click();
    expect(component.login).toHaveBeenCalled();
  });

  it('should not invoke login when form is invalid', function () {
    spyOn(component, 'login');
    const el: HTMLElement = fixture.debugElement.nativeElement;
    const submit = el.querySelector('button');
    const controls = component.loginForm.controls;
    controls['username'].setValue('');
    controls['password'].setValue('');
    fixture.detectChanges();
    submit.click();
    expect(component.login).not.toHaveBeenCalled();
  });

  it('should set username upon login', function () {
    const key = 'username';
    const username = 'matt';
    const controls = component.loginForm.controls;
    controls[key].setValue(username);
    controls['password'].setValue('password');
    fixture.detectChanges();
    component.login();
    expect(localStorage.getItem(key)).toBe(username);
    expect(router.navigate).toHaveBeenCalled();
  });
});
