// src/app/guards/auth.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    // 1. User login වෙලාද කියලා AuthService එකෙන් අහනවා
    if (this.authService.isLoggedIn()) {
      
      // 2. User login වෙලා නම් (token තියෙනවා):
      //    Userව Home page එකට redirect කරනවා
      this.router.navigate(['/']);
      
      // 3. Login page එකට යන්න 'false' (බැහැ) කියලා return කරනවා
      return false; 
    
    } else {
      
      // 4. User login වෙලා නැත්නම් (token නැහැ):
      //    Login page එකට යන්න 'true' (පුළුවන්) කියලා return කරනවා
      return true;
    }
  }
}