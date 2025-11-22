// src/app/pages/login/login.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service'; // <-- Import
import { ToastrService } from 'ngx-toastr'; // <-- Import

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  showPassword = false;
  private initialEmail: string | null = null; 

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService, // <-- Inject
    private toastr: ToastrService // <-- Inject
  ) {
    // Register එකෙන් එන Email එක ගන්න logic එක
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras && navigation.extras.state) {
      this.initialEmail = navigation.extras.state['email'];
    }
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [this.initialEmail, [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // --- Login Submit Logic එක ---
  onLoginSubmit(): void {
    if (this.loginForm.invalid) {
      this.toastr.error('Please enter valid email and password', 'Invalid Form');
      return;
    }

    // AuthService එක call කරනවා
    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        // සාර්ථක වුනොත්
        this.toastr.success('Logged in successfully!', 'Welcome Back!');

        // 1. Token එක Browser එකේ LocalStorage එකේ save කරනවා
        localStorage.setItem('token', response.token);

        this.authService.updateLoginStatus(true);

        // 2. Home page එකට redirect කරනවා
        this.router.navigate(['/']); 
      },
      error: (err) => {
        // Error එකක් ආවොත් (Password වැරදි නම්)
        this.toastr.error('Invalid email or password', 'Login Failed');
        console.error(err);
      }
    });
  }
}