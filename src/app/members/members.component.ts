import {Component, OnDestroy, OnInit} from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit, OnDestroy {
  members = [];
  unsub$: Subject<any>;

  constructor(public appService: AppService, private router: Router) {
    this.unsub$ = new Subject<any>();
  }

  ngOnInit() {
    this.updateLocalMembers();
  }

  ngOnDestroy(): void {
    this.unsub$.next();
    this.unsub$.complete();
  }

  goToAddMemberForm() {
    this.router.navigateByUrl('add-member').then(() => {
      console.log(`Navigating to member addition page`);
    }).catch(err => {
      console.log(err);
    });
  }

  editMemberByID(id: number) {
    this.router.navigateByUrl(`edit-member?id=${id}`).then(() => {
      console.log('Navigating to member edit page');
    }).catch(err => {
      console.log(err);
    });
  }

  deleteMemberById(id: number) {
    this.appService.deleteMember(id).pipe(takeUntil(this.unsub$)).subscribe(() => {
      console.log(`Deleted member with id: ${id}`);
      this.updateLocalMembers();
    });
  }

  updateLocalMembers() {
    this.appService.getMembers().pipe(takeUntil(this.unsub$)).subscribe(members => {
      this.members = members;
      console.log(`Updated members`);
    });
  }
}
