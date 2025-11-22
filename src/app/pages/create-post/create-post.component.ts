// src/app/pages/create-post/create-post.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router'; // <-- RouterLink, ActivatedRoute අවශ්‍යයි
import { ToastrService } from 'ngx-toastr';
import { PostService } from '../../services/post.service';
import { forkJoin } from 'rxjs'; // <-- Post Details fetch කරන්න අවශ්‍යයි

@Component({
  selector: 'app-create-post',
  standalone: true,
  // RouterLink අවශ්‍යයි: Header එකේ Back Button වලට
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css'
})
export class CreatePostComponent implements OnInit {

  createPostForm!: FormGroup;
  imagePreviewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  isSubmitting = false;

  // --- Edit Mode Variables ---
  postIdToEdit: string | null = null;
  isEditMode = false;
  originalImageUrl: string | null = null; // Backend එකේ තිබ්බ image URL එක

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute, // URL එකේ ID එක ගන්න
    private toastr: ToastrService,
    private postService: PostService
  ) { }

  ngOnInit(): void {
    // 1. Form එක build කිරීම (Tags/Excerpt Backend DTO වලට දාලා තියෙනවා)
    this.createPostForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      tags: [''],
      excerpt: ['']
    });

    // 2. Edit Mode Logic: URL එකේ ID එක check කිරීම
    this.postIdToEdit = this.route.snapshot.paramMap.get('id');

    if (this.postIdToEdit) {
      this.isEditMode = true;
      this.loadPostForEditing(); // Post data load කරනවා
    }
  }

  // --- 3. NEW: Post Data Load කරන function එක ---
  loadPostForEditing(): void {
    if (!this.postIdToEdit) return;

    this.postService.getPostById(this.postIdToEdit).subscribe({
      next: (post) => {
        // Form එකට පරණ data ටික load කරනවා
        this.createPostForm.patchValue({
          title: post.title,
          content: post.content,
          excerpt: post.excerpt || '',
          // tags: post.tags // (Tags logic අපි පස්සේ හදමු)
        });

        // Image Preview එක update කරනවා
        if (post.featuredImageUrl) {
          this.originalImageUrl = 'http://localhost:8080' + post.featuredImageUrl;
          this.imagePreviewUrl = this.originalImageUrl;
        }
      },
      error: (err) => {
        this.toastr.error('Could not load post for editing.', 'Error');
        this.router.navigate(['/profile']); // Error නම් profile page එකට යවනවා
      }
    });
  }

  // --- 4. File and Image Logic ---

  onFileSelect(event: Event): void {
    const element = event.target as HTMLInputElement;
    const file = element.files?.[0];

    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB
        this.toastr.error('File is too large! Max size is 2MB.', 'Upload Error');
        return;
      }
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.imagePreviewUrl = null;
    this.originalImageUrl = null; // Original image එකත් අයින් කරනවා
  }


  // --- 5. NEW: Submit Logic (Create + Edit) ---
  // onSubmit(): void {
  //   if (this.createPostForm.invalid) {
  //     this.toastr.error('Please fill in the Title and Content fields.', 'Form Invalid');
  //     return;
  //   }
  //   this.isSubmitting = true; 

  //   const formData = new FormData();
  //   formData.append('postData', new Blob([JSON.stringify(this.createPostForm.value)], {
  //       type: 'application/json'
  //   }));

  //   // File Upload Logic: 
  //   // 1. අලුත් file එකක් select කරලා නම්, ඒක යවනවා
  //   if (this.selectedFile) {
  //     formData.append('imageFile', this.selectedFile, this.selectedFile.name);
  //   } 
  //   // 2. Edit Mode එකේදි, කලින් image එක තිබ්බද, දැන් remove කරලද බලනවා
  //   //    (අපි Backend එකේදී 'imageFile' එකක් නැත්නම්, originalImageUrl එක check කරනවා)

  //   if (this.isEditMode && this.postIdToEdit) {
  //     // Edit Mode: PUT API call එක
  //     this.postService.updatePost(this.postIdToEdit, formData).subscribe({
  //       next: () => this.handleSuccess('Post updated successfully!'),
  //       error: (err) => this.handleError(err, 'Failed to update post.')
  //     });
  //   } else {
  //     // Create Mode: POST API call එක
  //     this.postService.createPost(formData).subscribe({
  //       next: () => this.handleSuccess('Post created successfully!'),
  //       error: (err) => this.handleError(err, 'Failed to create post.')
  //     });
  //   }
  // }

  // src/app/pages/create-post/create-post.component.ts

  // ... (imports and other functions) ...

  onSubmit(): void {
    if (this.createPostForm.invalid) {
      this.toastr.error('Please fill in the Title and Content fields.', 'Form Invalid');
      return;
    }
    this.isSubmitting = true;

    const formData = new FormData();

    // Form data ටික JSON object එකක් විදිහට හදනවා
    const formValue = this.createPostForm.value;
    const postData = {
      title: formValue.title,
      content: formValue.content,
      excerpt: formValue.excerpt,
      tags: formValue.tags,
      // Image remove කරලද කියලා බලනවා
      removeImage: this.isEditMode && !this.originalImageUrl && !this.selectedFile
    };

    formData.append('postData', new Blob([JSON.stringify(postData)], {
      type: 'application/json'
    }));

    if (this.selectedFile) {
      formData.append('imageFile', this.selectedFile, this.selectedFile.name);
    }

    // --- === මේක තමයි වැදගත්ම FIX එක === ---
    if (this.isEditMode && this.postIdToEdit) {
      // 1. Edit Mode: 'updatePost' (PUT) call කරනවා
      this.postService.updatePost(this.postIdToEdit, formData).subscribe({
        next: () => this.handleSuccess('Post updated successfully!'),
        error: (err) => this.handleError(err, 'Failed to update post.')
      });
    } else {
      // 2. Create Mode: 'createPost' (POST) call කරනවා
      this.postService.createPost(formData).subscribe({
        next: () => this.handleSuccess('Post created successfully!'),
        error: (err) => this.handleError(err, 'Failed to create post.')
      });
    }
    // --- === FIX එක ඉවරයි === ---
  }

  // ... (handleSuccess and handleError functions) ...

  // Helper for success/error handling
  handleSuccess(message: string): void {
    this.toastr.success(message, 'Success');
    this.isSubmitting = false;
    this.router.navigate(['/profile']); // Profile page එකට යවනවා
  }

  handleError(err: any, defaultMsg: string): void {
    this.toastr.error(err.error || defaultMsg, 'Error');
    this.isSubmitting = false;
    console.error(err);
  }
}