// src/app/pages/register/register.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router'; // <-- 1. Router මෙතනට Import කරන්න
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    CommonModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  showPassword = false;

  // 2. Router එක constructor එකට inject කරන්න
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router // <-- 2. මෙතනට add කරන්න
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contact: [''],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // 3. onSubmit function එක update කරන්න
  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.toastr.error('Please fill all required fields correctly', 'Invalid Form');
      return;
    }

    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        // සාර්ථක වුනොත්
        this.toastr.success('Your account has been created! Redirecting...', 'Registration Successful');
        
        // Form එක clear කරන එක තවදුරටත් ඕන නෑ, මොකද අපි page එකෙන් යනවා
         this.registerForm.reset(); 
        
        // 3. Login page එකට redirect කරමු (තත්පර 2කින්)
        // (Userට notification එක කියවන්න පොඩි වෙලාවක් දෙන එක හොඳයි)

        const email = this.registerForm.get('email')?.value;

      
        setTimeout(() => {
          this.router.navigate(['/login'], { state: { email: email } }); // <-- { state: ... }
        }, 2000);

      },
      error: (err) => {
        // Error එකක් ආවොත්
        this.toastr.error(err.error, 'Registration Failed');
      }
    });
  }
}