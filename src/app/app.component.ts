import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ThemeService } from './core/services';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <div class="app-container">
      <app-header />
      <main class="main-content">
        <router-outlet />
      </main>
      <app-footer />
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: var(--surface-ground);
    }
    .main-content {
      flex: 1;
    }
  `]
})
export class AppComponent implements OnInit {
  private themeService = inject(ThemeService);
  
  ngOnInit(): void {
    const isDark = this.themeService.isDarkMode();
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }
}
