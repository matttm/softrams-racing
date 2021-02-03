import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit {
  members = [];

  constructor(public appService: AppService, private router: Router) {}

  ngOnInit() {
    this.appService.getMembers().subscribe(members => (this.members = members));
  }

  goToAddMemberForm() {
    this.router.navigateByUrl('add-member').then(() => {
      console.log(`Navigating to member addition page`);
    }).catch(err => {
      console.log(err);
    });
  }

  editMemberByID(id: number) {}

  deleteMemberById(id: number) {}
}
