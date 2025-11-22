// src/app/app.routes.ts

import { Routes } from '@angular/router';


// --- Import all your components ---
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { PostDetailsComponent } from './pages/post-details/post-details.component';
import { CreatePostComponent } from './pages/create-post/create-post.component';
import { ProfileComponent } from './pages/profile/profile.component'; // <-- 1. IMPORT THIS
import { ProfileEditComponent } from './pages/profile-edit/profile-edit.component'; // <-- 1. Import

// --- Import all your guards ---
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard'; // <-- 2. IMPORT THIS

export const routes: Routes = [
  { path: '', component: HomeComponent },

  // These routes are for LOGGED-OUT users only
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },

  // These routes are for LOGGED-IN users only
  {
    path: 'create-post',
    component: CreatePostComponent,
    canActivate: [LoginGuard] // <-- 3. ADD THIS GUARD
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [LoginGuard] // <-- 4. ADD THIS ENTIRE ROUTE
  },

  // This route is public (we'll fix it later)
  { path: 'post/:id', component: PostDetailsComponent },

  {
    path: 'profile/edit',
    component: ProfileEditComponent,
    canActivate: [LoginGuard]
  },

  {
    path: 'post/edit/:id', // <-- මේ path එක වැදගත්
    component: CreatePostComponent, // Create component එකම පාවිච්චි කරනවා
    canActivate: [LoginGuard]
  },

  { 
        // Path එකේ 'user/' න් පස්සේ ID එක බාරගන්නා බව දැක්විය යුතුයි.
        path: 'user/:id', 
        component: ProfileComponent, 
    },
];