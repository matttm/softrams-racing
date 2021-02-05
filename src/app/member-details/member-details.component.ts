import {Component, OnInit, OnChanges, OnDestroy} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import {first, takeUntil} from 'rxjs/operators';
import {HttpResponse} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';

// This interface may be useful in the times ahead...
interface Member {
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
  teams$: Observable<any>;
  unsub$: Subject<any>;

  constructor(private fb: FormBuilder, private appService: AppService, private router: Router) {}

  ngOnInit() {
    this.teams$ = this.appService.getTeams();
    this.unsub$ = new Subject<any>();
    this.memberForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      jobTitle: ['', [Validators.required]],
      team: ['', [Validators.required]],
      status: ['', [Validators.required]]
    });
  }

  ngOnChanges() {}

  // TODO: Add member to members
  onSubmit() {
    this.memberModel = this.memberForm.value;
    this.appService.addMember(this.memberModel)
        .pipe(
            // not unsubscribing may cause mem leaks
            takeUntil(this.unsub$)
        )
        .subscribe((res: HttpResponse<any>) => {
          if (res.status === 200) {
            console.log('Member successfully added');
          } else {
            console.log('Member could not be added');
          }
          this.router.navigateByUrl('members')
              .then(() => {
                console.log('Navigating to members page');
              });
        });
  }

  ngOnDestroy(): void {
    this.unsub$.next();
    this.unsub$.complete();
  }
}
