import {inject, TestBed} from '@angular/core/testing';

import {AppService} from './app.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {Member} from './member-details/member-details.component';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

describe('AppService', () => {
  const api = 'http://localhost:8000/api';
  let http: HttpTestingController;
  let service: AppService;
  let unsub$: Subject<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppService],
      imports: [HttpClientTestingModule]
    });
    http = TestBed.get(HttpTestingController);
    service = TestBed.get(AppService);
    unsub$ = new Subject<any>();
  });

  afterEach(() => {
    unsub$.next();
    unsub$.complete();
  });

  it('should be created', inject([AppService], () => {
    expect(service).toBeTruthy();
  }));

  it('should send a GET request when getting members', () => {
    service.getMembers().pipe(takeUntil(unsub$)).subscribe();
    const request = http.expectOne(`${api}/members`);
    expect(request.request.method).toBe('GET');
  });

  it('should send a PUT request when updating a single member', () => {
    const id = 0;
    const member = {} as Member;
    service.updateMember(id, member).pipe(takeUntil(unsub$)).subscribe();
    const request = http.expectOne(`${api}/members/${id}`);
    expect(request.request.method).toBe('PUT');
  });

  it('should send a DELETE request when deleting members', () => {
    const id = 0;
    service.deleteMember(id).pipe(takeUntil(unsub$)).subscribe();
    const request = http.expectOne(`${api}/members/${id}`);
    expect(request.request.method).toBe('DELETE');
  });

  it('should send a POST request when adding a member', () => {
    const member = {} as Member;
    service.addMember(member).pipe(takeUntil(unsub$)).subscribe();
    const request = http.expectOne(`${api}/members`);
    expect(request.request.method).toBe('POST');
  });

  it('should send a GET request when getting the teams', () => {
    service.getTeams().pipe(takeUntil(unsub$)).subscribe();
    const request = http.expectOne(`${api}/teams`);
    expect(request.request.method).toBe('GET');
  });

  it('should set a username', function () {
    const username = 'Johnny';
    expect(service.username).toBeUndefined();
    service.setUsername(username);
    expect(service.username).toBe(username);
  });
});
