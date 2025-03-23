import { Component, inject, OnInit } from '@angular/core';
import { AccountService } from '../../_services/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent implements OnInit {
  private router = inject(Router);
  accountService = inject(AccountService);

  ngOnInit(): void {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}