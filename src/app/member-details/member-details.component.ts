import { Component, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import {first} from 'rxjs/operators';
import {HttpResponse} from '@angular/common/http';

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
export class MemberDetailsComponent implements OnInit, OnChanges {
  memberModel: Member;
  memberForm: FormGroup;
  submitted = false;
  alertType: String;
  alertMessage: String;
  teams = [];

  constructor(private fb: FormBuilder, private appService: AppService, private router: Router) {}

  ngOnInit() {}

  ngOnChanges() {}

  // TODO: Add member to members
  onSubmit(form: FormGroup) {
    this.memberModel = form.value;
    this.appService.addMember(this.memberModel)
        .pipe(first())
        .subscribe((res: HttpResponse<any>) => {
          if (res.status === 200) {
            console.log('Member successfully added');
          } else {
            console.log('Member could not be added');
          }
          this.router.navigateByUrl('members');
        });
  }
}
