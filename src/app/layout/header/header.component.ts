// // src/app/layout/header/header.component.ts

// import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
// import { RouterLink, RouterLinkActive, Router } from '@angular/router';
// import { AuthService } from '../../services/auth.service';
// import { Observable } from 'rxjs';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-header',
//   standalone: true,
//   imports: [RouterLink, RouterLinkActive, CommonModule],
//   templateUrl: './header.component.html',
//   styleUrl: './header.component.css'
// })
// export class HeaderComponent implements OnInit {

//   isLoggedIn$!: Observable<boolean>;
  
//   // New property for dropdown state
//   isProfileMenuOpen = false;
//   loggedInUser: any = null;

//   userName: string = 'User'; 
//   userEmail: string = 'loading...';

//   constructor(
//     private authService: AuthService,
//     private router: Router,
//     private eRef: ElementRef // Used to detect clicks outside
//   ) {}

//   ngOnInit(): void {
//     this.isLoggedIn$ = this.authService.isLoggedIn$;

//     this.isLoggedIn$.subscribe(isLoggedIn => {
//       if (isLoggedIn) {
//         const details = this.authService.getUserDetails();
//         if (details) {
//           this.userName = details.name;
//           this.userEmail = details.email;
//         }
//       } else {
//         this.userName = 'Guest';
//         this.userEmail = '';
//       }
//     });
    
//   }

//   // New function to toggle the menu
//   toggleProfileMenu(): void {
//     this.isProfileMenuOpen = !this.isProfileMenuOpen;
//   }

//   // Updated logout to also close the menu
//   onLogout(): void {
//     this.isProfileMenuOpen = false; // Close menu
//     this.authService.logout();
//     this.router.navigate(['/login']);
//   }

//   // New: This closes the dropdown if you click anywhere else on the page
//   @HostListener('document:click', ['$event'])
//   clickout(event: Event) {
//     if (!this.eRef.nativeElement.contains(event.target)) {
//       this.isProfileMenuOpen = false;
//     }
//   }
// }

// src/app/layout/header/header.component.ts

import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService, UserDetails } from '../../services/auth.service'; // <-- 1. Import
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  isLoggedIn$!: Observable<boolean>;
  isProfileMenuOpen = false;

  // --- 2. User Details වලට Variable එකක් ---
  currentUser: UserDetails | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private eRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn$;

    // --- 3. User Details වලට Subscribe වෙනවා ---
    this.authService.currentUserDetails$.subscribe(details => {
      this.currentUser = details;
    });
  }

  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  onLogout(): void {
    this.isProfileMenuOpen = false;
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isProfileMenuOpen = false;
    }
  }
}