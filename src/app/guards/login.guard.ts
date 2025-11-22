// src/app/guards/login.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr'; // <-- Toastr import කරමු

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService // <-- Toastr inject කරමු
  ) {}

  canActivate(): boolean {
    // 1. User login වෙලාද කියලා අහනවා
    if (this.authService.isLoggedIn()) {
      // 2. Login වෙලා නම්, page එකට යන්න 'true' (පුළුවන්)
      return true;
    } else {
      // 3. Login වෙලා නැත්නම්:
      //    Userට error එකක් පෙන්නනවා
      this.toastr.error('You must be logged in to view this page');
      //    Login page එකට redirect කරනවා
      this.router.navigate(['/login']);
      //    page එකට යන්න 'false' (බැහැ)
      return false;
    }
  }
}