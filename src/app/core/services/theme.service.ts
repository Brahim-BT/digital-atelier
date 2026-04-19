import { Injectable, signal, effect } from '@angular/core';

type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'digital-atelier-theme';
  
  private readonly _isDarkMode = signal<boolean>(this.getInitialTheme());
  readonly isDarkMode = this._isDarkMode.asReadonly();
  
  constructor() {
    effect(() => {
      const isDark = this._isDarkMode();
      this.applyTheme(isDark ? 'dark' : 'light');
      localStorage.setItem(this.STORAGE_KEY, isDark ? 'dark' : 'light');
    });
  }
  
  private getInitialTheme(): boolean {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      return stored === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  
  private applyTheme(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);
  }
  
  toggleTheme(): void {
    this._isDarkMode.update(current => !current);
  }
  
  setTheme(theme: Theme): void {
    this._isDarkMode.set(theme === 'dark');
  }
}
