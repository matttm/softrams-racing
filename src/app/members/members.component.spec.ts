import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MembersComponent } from './members.component';

import { Router } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import {AppService} from '../app.service';
import {mockAppService} from '../test-utilities.spec';
import {of} from 'rxjs';

describe('MembersComponent', () => {
  let component: MembersComponent;
  let fixture: ComponentFixture<MembersComponent>;
  let service: AppService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MembersComponent],
      imports: [HttpClientModule, RouterModule],
      providers: [
        {
          provide: Router,
          useClass: class {
            navigate = jasmine.createSpy('navigate');
          }
        },
        {
          provide: AppService,
          useValue: mockAppService
        }
      ]
    }).compileComponents();
    service = TestBed.get(AppService);
    fixture = TestBed.createComponent(MembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getMembers on update', () => {
    spyOn(service, 'getMembers').and.returnValue(of([]));
    component.updateLocalMembers();
    expect(service.getMembers).toHaveBeenCalled();
    expect(component.members).toEqual([]);
  });

  it('should call getMembers on init', () => {
    spyOn(service, 'getMembers').and.returnValue(of([]));
    component.ngOnInit();
    expect(service.getMembers).toHaveBeenCalled();
    expect(component.members).toEqual([]);
  });

  it('should invoke gotoMembersForm on button click', () => {
    spyOn(component, 'goToAddMemberForm');
    const el: HTMLElement = fixture.debugElement.nativeElement;
    const button: HTMLElement = el.querySelector('#addMemberButton');
    expect(button).toBeDefined();
    button.click();
    expect(component.goToAddMemberForm).toHaveBeenCalled();
  });
});
