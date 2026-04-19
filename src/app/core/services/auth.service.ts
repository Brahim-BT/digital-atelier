import { Injectable, signal, computed } from '@angular/core';
import { User } from '@shared/models';

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly _user = signal<User | null>(null);
  private readonly _isAuthenticated = signal(false);

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = this._isAuthenticated.asReadonly();
  readonly isLoggedIn = computed(() => this._isAuthenticated());

  constructor() {
    this.checkStoredAuth();
  }

  private checkStoredAuth(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this._user.set(JSON.parse(storedUser));
      this._isAuthenticated.set(true);
    }
  }

  async login(credentials: AuthCredentials): Promise<{ success: boolean; error?: string }> {
    await this.delay(1000);
    
    if (credentials.email === 'demo@atelire.co' && credentials.password === 'demo123') {
      const user: User = {
        id: '1',
        email: credentials.email,
        firstName: 'Alex',
        lastName: 'Morgan',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
      };
      
      this._user.set(user);
      this._isAuthenticated.set(true);
      localStorage.setItem('user', JSON.stringify(user));
      return { success: true };
    }
    
    return { success: false, error: 'Invalid credentials. Try demo@atelire.co / demo123' };
  }

  async loginWithGoogle(): Promise<{ success: boolean; error?: string }> {
    await this.delay(1500);
    return { success: false, error: 'Google authentication not configured' };
  }

  async loginWithGithub(): Promise<{ success: boolean; error?: string }> {
    await this.delay(1500);
    return { success: false, error: 'GitHub authentication not configured' };
  }

  async register(data: RegisterData): Promise<{ success: boolean; error?: string }> {
    await this.delay(1500);
    
    if (data.email && data.password && data.fullName) {
      return { success: true };
    }
    
    return { success: false, error: 'Please fill in all required fields' };
  }

  async registerWithGoogle(): Promise<{ success: boolean; error?: string }> {
    await this.delay(1500);
    return { success: false, error: 'Google authentication not configured' };
  }

  async registerWithGithub(): Promise<{ success: boolean; error?: string }> {
    await this.delay(1500);
    return { success: false, error: 'GitHub authentication not configured' };
  }

  logout(): void {
    this._user.set(null);
    this._isAuthenticated.set(false);
    localStorage.removeItem('user');
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
