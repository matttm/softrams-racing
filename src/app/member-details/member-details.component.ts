import {Component, OnInit, OnChanges, OnDestroy} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../app.service';
import {ActivatedRoute, Router} from '@angular/router';
import {first, takeUntil} from 'rxjs/operators';
import {HttpResponse} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';

// This interface may be useful in the times ahead...
export interface Member {
  firstName: string;
  lastName: string;
  jobTitle: string;
  team: string;
  status: string;
}

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css']
})
export class MemberDetailsComponent implements OnInit, OnChanges, OnDestroy {
  memberModel: Member;
  memberForm: FormGroup;
  submitted = false;
  alertType: String;
  alertMessage: String;
  teams = [];
  unsub$: Subject<any>;
  // store id query param, so we only have to fetch it once
  editingId = null;

  constructor(
      private fb: FormBuilder,
      private appService: AppService,
      private router: Router,
      private route: ActivatedRoute
  ) {
    this.unsub$ = new Subject<any>();
    this.appService.getTeams().pipe(takeUntil(this.unsub$)).subscribe(teams => {
      this.teams = teams;
    });
    this.memberForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      jobTitle: ['', [Validators.required]],
      team: [null, [Validators.required]],
      status: [null, [Validators.required]]
    });
  }

  ngOnInit() {
    // Checking whether, this component is currently meant for an edit
    this.route.queryParams.pipe(takeUntil(this.unsub$)).subscribe(params => {
      const memberId = params['id'];
      // if the id is defined as a query param, we're editing a member
      if (memberId) {
        this.editingId = memberId;
        this.appService.getMemberById(memberId).pipe(takeUntil(this.unsub$)).subscribe((member: Member) => {
          console.log(`Member retrieved for edit: ${JSON.stringify(member)}`);
          const controls = this.memberForm.controls;
          controls['firstName'].setValue(member.firstName);
          controls['lastName'].setValue(member.lastName);
          controls['jobTitle'].setValue(member.jobTitle);
          controls['team'].patchValue(member.team);
          controls['status'].setValue(member.status);
        });
      }
    });
  }

  ngOnChanges() {}

  ngOnDestroy(): void {
    this.unsub$.next();
    this.unsub$.complete();
  }

  onSubmit() {
    this.memberModel = this.memberForm.value;
    // if we are updating a member
    if (this.editingId) {
      // update member
      this.appService.updateMember(this.editingId, this.memberModel)
          .pipe(takeUntil(this.unsub$))
          .subscribe(res => {
            if (res.status === 200) {
              console.log('Member successfully edited');
            } else {
              console.log('Member could not be edited');
            }
            this.gotoMembersPage();
          });
    } else {
      // add member
      this.appService.addMember(this.memberModel)
          .pipe(takeUntil(this.unsub$))
          .subscribe(res => {
            if (res.status === 201) {
              console.log('Member successfully added');
            } else {
              console.log('Member could not be added');
            }
            this.gotoMembersPage();
          });
    }
  }

  gotoMembersPage(): void {
    this.router.navigateByUrl('members')
        .then(() => {
          console.log('Navigating to members page');
        });
  }

  compareTeams(t1: any, t2: any): boolean {
    return t1 && t2 ? t1.teamName === t2.teamName : false;
  }
}
