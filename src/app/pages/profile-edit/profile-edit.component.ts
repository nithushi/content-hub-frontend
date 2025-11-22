// src/app/pages/profile-edit/profile-edit.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router'; // <-- 1. Router import එක
import { AuthService } from '../../services/auth.service'; // <-- 2. AuthService import එක (අපි කලින් add කළා)

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.css'
})
export class ProfileEditComponent implements OnInit {

  editProfileForm!: FormGroup;
  isSubmitting = false;
  
  // --- 3. Image Upload වලට අලුත් Variables ---
  previewImageUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  isImageRemoved = false; // User image එක අයින් කරාද?

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthService // <-- 4. AuthService inject කරලා තියෙන්නේ
  ) {}

  ngOnInit(): void {
    this.editProfileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [{ value: '', disabled: true }], 
      contact: ['']
    });

    this.loadCurrentUserDetails();
  }

  loadCurrentUserDetails(): void {
    this.profileService.getUserProfile().subscribe({
      next: (user) => {
        this.editProfileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          contact: user.contact || '' // <-- 5. 'contact' එක load කිරීම (Backend එකේ තියෙනවා නම්)
        });
        
        // --- 6. පරණ Profile Image එක load කරනවා ---
        if (user.profileImageUrl) {
          this.previewImageUrl = 'http://localhost:8080' + user.profileImageUrl;
        }
      },
      error: (err) => {
        this.toastr.error('Could not load current user details.', 'Error');
      }
    });
  }

  // --- 7. අලුත්: File Select කරාම ---
  onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    const file = element.files?.[0];

    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB Limit
        this.toastr.error('File is too large! Max size is 2MB.', 'Upload Error');
        return;
      }
      
      this.selectedFile = file;
      this.isImageRemoved = false; // අලුත් file එකක් දැම්ම නිසා, remove flag එක false
      
      // Preview එක පෙන්නන්න FileReader පාවිච්චි කරනවා
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImageUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // --- 8. අලුත්: Image Remove කරාම ---
  removeImage(): void {
    this.previewImageUrl = null;
    this.selectedFile = null;
    this.isImageRemoved = true; // Image එක අයින් කළා කියලා flag එක set කරනවා
  }

  // --- 9. අලුත්: Submit Logic (Create + Edit) ---
  onSubmit(): void {
    if (this.editProfileForm.invalid) {
      this.toastr.error('Please fill in required fields.');
      return;
    }
    this.isSubmitting = true;

    const formData = new FormData();
    
    // Text Data (JSON)
    const profileData = this.editProfileForm.getRawValue();
    profileData.isImageRemoved = this.isImageRemoved; // Remove flag එකත් DTO එකට දානවා
    
    formData.append('profileData', new Blob([JSON.stringify(profileData)], {
        type: 'application/json'
    }));

    // Image File
    if (this.selectedFile) {
      formData.append('imageFile', this.selectedFile, this.selectedFile.name);
    }

    // API Call
    this.profileService.updateUserProfile(formData).subscribe({
      next: (response) => {
        this.toastr.success('Profile updated successfully!');
        
        // --- 10. 🚨🚨🚨 අලුත්ම FIX එක: Header එක update කරන්න Broadcast කිරීම ---
        // Backend එකෙන් ආපු අලුත් User DTO එක AuthService එකට යවනවා
        this.authService.refreshUserDetails(response); 
        
        this.isSubmitting = false;
        this.router.navigate(['/profile']); 
      },
      error: (err) => {
        this.toastr.error('Failed to update profile.', 'Error');
        this.isSubmitting = false;
      }
    });
  }
}