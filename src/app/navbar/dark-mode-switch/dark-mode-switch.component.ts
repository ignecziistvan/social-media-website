import { Component, EventEmitter, inject, OnInit } from '@angular/core';
import { ThemeService } from '../../_services/theme.service';

@Component({
  selector: 'app-dark-mode-switch',
  imports: [],
  templateUrl: './dark-mode-switch.component.html',
  styleUrl: './dark-mode-switch.component.css'
})
export class DarkModeSwitchComponent implements OnInit {
  themeService = inject(ThemeService);
  isDark = false;

  ngOnInit() {
    this.themeService.theme.subscribe(theme => theme === 'light' ? this.isDark = false : this.isDark = true);
  }
}
