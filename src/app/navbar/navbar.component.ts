import { Component, inject } from '@angular/core';
import { DarkModeSwitchComponent } from './dark-mode-switch/dark-mode-switch.component';
import { RouterLink } from '@angular/router';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-navbar',
  imports: [DarkModeSwitchComponent, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  accountService = inject(AccountService);
  defaultAvatar = 'user.png';
}