import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {MemberDetailsComponent} from './member-details.component';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';

import {HttpClient, HttpResponse} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {of, Subject} from 'rxjs';
import {AppService} from '../app.service';
import {establishActivatedRouteSpies, establishAppServiceSpies} from '../test-utilities.spec';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';

const mockMember = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  jobTitle: 'Driver',
  team: 'Formula 1 - Car 77',
  status: 'Active'
};
const mockTeams = [
  {
    id: 1,
    teamName: 'Formula 1 - Car 77'
  },
  {
    id: 2,
    teamName: 'Formula 1 - Car 8'
  },
  {
    id: 3,
    teamName: 'Formula 2 - Car 54'
  }
];
const queryParams = new Subject();
const mockActivatedRoute = {
  queryParams: queryParams.asObservable()
};
// Bonus points!
describe('MemberDetailsComponent', () => {
  let component: MemberDetailsComponent;
  let fixture: ComponentFixture<MemberDetailsComponent>;
  let router: Router;
  let service: AppService;
  let route: ActivatedRoute;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MemberDetailsComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute
        },
        FormBuilder,
        AppService
      ]
    }).compileComponents();
  }));
  beforeEach(async(() => {
    service = TestBed.get(AppService);
    router = TestBed.get(Router);
    route = TestBed.get(ActivatedRoute);
    // start spying before the component is made in order to observe construction
    establishAppServiceSpies(service);
    fixture = TestBed.createComponent(MemberDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to members page on gotoMembersPage invocation', function () {
    spyOn(router, 'navigateByUrl').and.returnValue(Promise.resolve());
    component.gotoMembersPage();
    expect(router.navigateByUrl).toHaveBeenCalledWith('members');
  });

  it('should get teams observable on construction', function () {
    expect(service.getTeams).toHaveBeenCalled();
    expect(component.teams$).toBeDefined();
  });

  it('should signal have an editing id when provided an id', () => {
    queryParams.next( {id: 1});
    expect(component.editingId).toBeTruthy();
  });

  it('should have null editing id when not given an id', () => {
    expect(component.editingId).toBeFalsy();
  });

  it('should have a member form containing member\'s info when an id is passed', function () {
    spyOn(service, 'getMemberById').and.returnValue(of(mockMember));
    queryParams.next( {id: 1});
    expect(component.editingId).toBeTruthy();
    expect(service.getMemberById).toHaveBeenCalled();
    expect(component.memberForm.get('firstName').value).toBe(mockMember.firstName);
    expect(component.memberForm.get('lastName').value).toBe(mockMember.lastName);
    expect(component.memberForm.get('jobTitle').value).toBe(mockMember.jobTitle);
    expect(component.memberForm.get('team').value).toBe(mockMember.team);
    expect(component.memberForm.get('status').value).toBe(mockMember.status);
  });

  it('should have an empty member form when no id is passed', function () {
    expect(component.editingId).toBeFalsy();
    expect(component.memberForm.get('firstName').value).toBe('');
    expect(component.memberForm.get('lastName').value).toBe('');
    expect(component.memberForm.get('jobTitle').value).toBe('');
    expect(component.memberForm.get('team').value).toBe(null);
    expect(component.memberForm.get('status').value).toBe(null);
  });

  it('should call updateMember from service when in edit mode', function () {
    // in edit mode if not null
    component.editingId = 1;
    spyOn(service, 'updateMember').and.returnValue(of(new HttpResponse({status: 200})));
    component.onSubmit();
    expect(service.updateMember).toHaveBeenCalled();
  });

  it('should call addMember from service when not in edit mode', function () {
    // in edit mode if not null
    component.editingId = null;
    spyOn(service, 'addMember').and.returnValue(of(new HttpResponse({status: 200})));
    component.onSubmit();
    expect(service.addMember).toHaveBeenCalled();
  });
});
