// // src/app/pages/home/home.component.ts

// import { Component, OnInit } from '@angular/core';
// import { CommonModule, DatePipe } from '@angular/common'; // <-- 1. DatePipe Import
// import { RouterLink } from '@angular/router';
// import { AuthService, UserDetails } from '../../services/auth.service';
// import { PostService } from '../../services/post.service'; // <-- 2. PostService Import
// import { Observable } from 'rxjs';

// @Component({
//   selector: 'app-home',
//   standalone: true,
//   imports: [CommonModule, RouterLink, DatePipe], // <-- 3. DatePipe Add
//   templateUrl: './home.component.html',
//   styleUrl: './home.component.css'
// })
// export class HomeComponent implements OnInit {

//   isLoggedIn$!: Observable<boolean>;
//   posts: any[] = []; // <-- 4. "Dummy Data" අයින් කරලා, හිස් array එකක් හැදුවා
//   isLoading = true;
//   currentUser: UserDetails | null = null;

//   constructor(
//     private authService: AuthService,
//     private postService: PostService // <-- 5. Inject
//   ) { }

//   ngOnInit(): void {
//     this.isLoggedIn$ = this.authService.isLoggedIn$;
//     this.loadAllPosts(); // <-- 6. Page එක load වෙද්දී posts ගේනවා

//     //this.currentUser = this.authService.getUserDetails();
//     this.authService.currentUserDetails$.subscribe(details => {
//       this.currentUser = details; 
//     });
//   }

//   // --- 7. අලුත් function එක: API එකෙන් Posts ගේන එක ---
//   loadAllPosts(): void {
//     this.isLoading = true;
//     this.postService.getAllPosts().subscribe({
//       next: (data) => {
//         this.posts = data;
//         this.isLoading = false;
//       },
//       error: (err) => {
//         console.error("Error loading posts", err);
//         this.isLoading = false;
//       }
//     });
//   }
// }

// src/app/pages/home/home.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService, UserDetails } from '../../services/auth.service';
import { PostService } from '../../services/post.service'; 
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  // 1. RouterLink and DatePipe අවශ්‍යයි
  imports: [CommonModule, RouterLink, DatePipe], 
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  isLoggedIn$!: Observable<boolean>;
  posts: any[] = [];
  isLoading = true;
  // 2. User Details Interface එක භාවිතා කරනවා
  currentUser: UserDetails | null = null; 

  constructor(
    private authService: AuthService,
    private postService: PostService 
  ) { }

  ngOnInit(): void {
    // 3. Login Status Observable එකට subscribe කරනවා
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    
    // 4. Current User Details වලට Subscribe වෙනවා (Avatar, Name වලට)
    //    (AuthService එකේ Details update වුනාම, UI එක auto-update වේ)
    this.authService.currentUserDetails$.subscribe(details => {
      this.currentUser = details; 
    });
    
    this.loadAllPosts(); 
  }

  // --- 5. API එකෙන් Posts ගේන function එක ---
  loadAllPosts(): void {
    this.isLoading = true;
    this.postService.getAllPosts().subscribe({
      next: (data) => {
        this.posts = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error loading posts", err);
        this.isLoading = false;
      }
    });
  }
}