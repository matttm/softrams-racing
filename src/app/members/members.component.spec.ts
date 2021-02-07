import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MembersComponent} from './members.component';

import {Router, RouterModule} from '@angular/router';

import {HttpClientModule} from '@angular/common/http';
import {AppService} from '../app.service';
import {mockAppService} from '../test-utilities.spec';
import {of} from 'rxjs';

const mockMembers = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    jobTitle: 'Driver',
    team: 'Formula 1 - Car 77',
    status: 'Active'
  }
];

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

  it('should invoke editMember on component on button click', (done) => {
    spyOn(service, 'getMembers').and.returnValue(of(mockMembers));
    spyOn(component, 'editMemberByID');
    component.ngOnInit();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      clickButton('#editMemberButton');
      expect(component.editMemberByID).toHaveBeenCalled();
      done();
    });
  });

  it('should invoke deleteMember on service on button click', (done) => {
    spyOn(service, 'getMembers').and.returnValue(of(mockMembers));
    spyOn(service, 'deleteMember');
    component.ngOnInit();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      clickButton('#deleteMemberButton');
      expect(service.deleteMember).toHaveBeenCalled();
      done();
    });
  });

  function clickButton(selector: string) {
    // ensure there are members
    expect(component.members.length).toBeGreaterThan(0);
    const el: HTMLElement = fixture.debugElement.nativeElement;
    const button: HTMLElement = el.querySelector(selector);
    expect(button).toBeTruthy();
    button.click();
  }
});

