import { Injectable, inject, signal } from '@angular/core';
import { Auth, authState, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);

  // Signal holding the current user state
  currentUser = signal<User | null | undefined>(undefined);

  constructor() {
    // Listen to Firebase auth state changes
    authState(this.auth).subscribe((user) => {
      this.currentUser.set(user);
    });
  }

  async signIn(email: string, pass: string) {
    try {
      await signInWithEmailAndPassword(this.auth, email, pass);
      this.router.navigate(['/']);
    } catch (error) {
      throw error;
    }
  }
  
  async signUp(email: string, pass: string) {
    try {
      await createUserWithEmailAndPassword(this.auth, email, pass);
      this.router.navigate(['/']);
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }
}
