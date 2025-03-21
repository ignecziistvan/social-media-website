import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeSubject = new BehaviorSubject<string>(this.getStoredTheme());
  theme = this.themeSubject.asObservable();

  constructor() {
    this.applyTheme(this.themeSubject.value);
  }

  toggleTheme(): void {
    const newTheme = this.themeSubject.value === 'night' ? 'light' : 'night';
    this.setTheme(newTheme);
  }

  private getStoredTheme(): string {
    return localStorage.getItem('theme') ?? 'light';
  }

  private setTheme(theme: string): void {
    localStorage.setItem('theme', theme);
    this.applyTheme(theme);
    this.themeSubject.next(theme);
  }

  private applyTheme(theme: string): void {
    document.documentElement.setAttribute('data-theme', theme);
  }
}
