// src/app/pages/post-details/post-details.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PostService } from '../../services/post.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode'; // <-- Import

@Component({
  selector: 'app-post-details',
  standalone: true,
  // RouterLink එක imports වලට එකතු කරන්න
  imports: [CommonModule, DatePipe, ReactiveFormsModule],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.css'
})
export class PostDetailsComponent implements OnInit {

  post: any = null;
  isLoading = true;
  postId: string | null = null;

  comments: any[] = [];
  commentForm!: FormGroup;
  isLoggedIn$!: Observable<boolean>;

  // --- Variables for User Actions ---
  postAuthorId: number | null = null;
  currentUserId: number | null = null;
  editingCommentId: number | null = null;
  editForm!: FormGroup;

  // ✨ NEW: Dropdown visibility management
  public openDropdownId: number | null = null;
  public replyingToCommentId: number | null = null;
  public replyForm!: FormGroup; // Reply form එක සඳහා වෙනම FormGroup එකක්
  public expandedReplyIds: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.getCurrentUserId();

    this.commentForm = this.fb.group({ content: ['', Validators.required] });
    this.editForm = this.fb.group({ content: ['', Validators.required] });
    this.replyForm = this.fb.group({ content: ['', Validators.required] });

    this.postId = this.route.snapshot.paramMap.get('id');

    if (this.postId) {
      this.loadPostDetails();
      this.loadComments();
    }
  }

  // Dropdown එකේ visibility එක වෙනස් කරනවා.
  // එකම ID එකක් ආවොත් වහනවා (null කරනවා), නැත්නම් අලුත් එකට open කරනවා.
  toggleDropdown(commentId: number): void {
    this.openDropdownId = this.openDropdownId === commentId ? null : commentId;
  }

  // HTML එකේ class.show එකට මේක use කරනවා.
  isDropdownOpen(commentId: number): boolean {
    return this.openDropdownId === commentId;
  }

  // JWT එකෙන් User ID එක ගන්න function එක
  getCurrentUserId(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        this.currentUserId = decodedToken.id;
      } catch (error) {
        console.error("Failed to decode token", error);
        this.currentUserId = null;
      }
    }
  }

  // Post details load කරන function එක
  loadPostDetails(): void {
    if (!this.postId) return;
    this.isLoading = true;

    this.postService.getPostById(this.postId).subscribe({
      next: (data) => {
        this.post = data;
        this.postAuthorId = data.authorId;
        this.isLoading = false;
      },
      error: (err) => {
        this.toastr.error('Could not load post.', 'Error');
        this.isLoading = false;
      }
    });
  }


  loadComments(): void {
    if (!this.postId) return;

    this.postService.getCommentsForPost(this.postId).subscribe({
      next: (data: any[]) => { // API එකෙන් එන සියලු comments
        this.comments = data;
        console.log("Loaded Threaded Comments:", this.comments);
      },
      error: (err) => {
        this.toastr.error('Could not load comments.', 'Error');
      }
    });
  }

  onCommentSubmit(): void {
    if (this.commentForm.invalid || !this.postId) return;
    const content = this.commentForm.value.content;

    // FIX 2: සාමාන්‍ය comment එකකදී parentCommentId එක යවන්නේ නැත.
    // Service එකේ method එකට අදාල parameters නිවැරදිව යවන්න.
    this.postService.createComment(this.postId, content).subscribe({ // <-- 3 arguments වෙනුවට 2ක් යවයි
      next: (response) => {
        this.toastr.success('Comment posted successfully!');
        this.commentForm.reset();
        this.loadComments();
      },
      error: (err) => {
        this.toastr.error('Failed to post comment.', 'Error');
      }
    });
  }

  toggleLike(): void {
    if (!this.postId) return;
    this.postService.toggleLike(this.postId).subscribe({
      next: (response) => {
        this.post.likedByCurrentUser = response.liked;
        response.liked ? this.post.likeCount++ : this.post.likeCount--;
      },
      error: (err) => { this.toastr.error('Please login to like this post', 'Error'); }
    });
  }

  toggleCommentLike(comment: any): void {
    if (!this.postId) return;
    this.postService.toggleCommentLike(this.postId, comment.id).subscribe({
      next: (response) => {
        comment.likedByCurrentUser = response.liked;
        response.liked ? comment.likeCount++ : comment.likeCount--;
      },
      error: (err) => { this.toastr.error('Please login to like this comment', 'Error'); }
    });
  }

  // --- IMPORTANT: Dropdown එකෙන් action එකක් ගත්තාට පසු close කිරීම ---
  // toggleCommentPin(comment: any): void {
  //   if (!this.postId) return;
  //   this.openDropdownId = null; // Close the dropdown

  //   this.postService.toggleCommentPin(this.postId, comment.id).subscribe({
  //     next: (response) => {
  //       this.toastr.success(comment.isPinned ? 'Comment Unpinned!' : 'Comment Pinned!', 'Success');
  //       comment.isPinned = !comment.isPinned;
  //       this.loadComments();
  //     },
  //     error: (err) => {
  //       this.toastr.error(err.error || 'Failed to update pin status.', 'Error');
  //     }
  //   });
  // }

  // --- 1. "Toggle Comment Pin" function එක update කරන්න ---
  toggleCommentPin(comment: any): void {
    if (!this.postId) return;
    
    this.postService.toggleCommentPin(this.postId, comment.id).subscribe({
      next: (response) => {
        this.toastr.success(comment.isPinned ? 'Comment Unpinned!' : 'Comment Pinned!', 'Success');
        
        // --- 2. Local update (comment.isPinned = ...) අයින් කළා ---
        
        // 3. API call එක success වුනාට පස්සේ, comment list එක 
        //    (හරියට sort කරපු) ආයෙත් load කරනවා
        this.loadComments(); 
      },
      error: (err) => {
        this.toastr.error(err.error || 'Failed to update pin status.', 'Error');
      }
    });
  }

  onEditComment(comment: any): void {
    this.openDropdownId = null; // Close the dropdown
    this.editingCommentId = comment.id;
    this.editForm.setValue({ content: comment.content });
  }

  cancelEdit(): void {
    this.editingCommentId = null;
  }

  onSaveEdit(commentId: number): void {
    if (this.editForm.invalid || !this.postId) return;
    const newContent = this.editForm.value.content;

    this.postService.editComment(this.postId, commentId, newContent).subscribe({
      next: (response) => {
        this.toastr.success('Comment updated successfully!');
        this.editingCommentId = null;
        this.loadComments();
      },
      error: (err) => {
        this.toastr.error(err.error || 'Error updating comment', 'Error');
      }
    });
  }

  onDeleteComment(commentId: number): void {
    if (confirm('Are you sure you want to delete this comment?')) {
      if (!this.postId) return;
      this.openDropdownId = null; // Close the dropdown

      this.postService.deleteComment(this.postId, commentId).subscribe({
        next: (response) => {
          this.toastr.success('Comment deleted successfully!');
          this.loadComments();
        },
        error: (err) => {
          this.toastr.error(err.error || 'Error deleting comment', 'Error');
        }
      });
    }
  }

  // isCommentEdited(comment: any): boolean {
  //   // Check if the update time is present AND different from the creation time
  //   return comment.updatedAt && (new Date(comment.createdAt).getTime() !== new Date(comment.updatedAt).getTime());
  // }

  // Reply Form එක Toggle කිරීම
  toggleReplyForm(commentId: number): void {
    // Dropdown එක වැසීමට
    this.openDropdownId = null;

    // දැනටමත් මේ comment එකට reply කරනවා නම්, form එක වසන්න (null කරන්න)
    // නැතිනම්, අලුත් commentId එකට form එක open කරන්න
    this.replyingToCommentId = this.replyingToCommentId === commentId ? null : commentId;

    // Form එක reset කිරීම වැදගත්
    this.replyForm.reset();
  }

  // Reply Submit කිරීම
  onReplySubmit(parentCommentId: number): void {
    if (this.replyForm.invalid || !this.postId) {
      return;
    }
    const content = this.replyForm.value.content;

    console.log(`Submitting reply to parent: ${parentCommentId} with content: ${content}`);

    // ⚠️ උපකල්පනය: ඔබගේ PostService.createComment() එකට parentId support කරනවා යැයි උපකල්පනය කරමු.
    this.postService.createComment(this.postId, content, parentCommentId).subscribe({
      next: (response) => {
        this.toastr.success('Reply posted successfully!');
        this.replyForm.reset();
        this.replyingToCommentId = null; // Form එක වසන්න
        this.loadComments(); // Comments list එක refresh කරන්න
      },
      error: (err) => {
        this.toastr.error('Failed to post reply.', 'Error');
      }
    });
  }

  // Reply Thread එකක Visibility එක Toggle කරනවා
  toggleReplies(commentId: number): void {
    const index = this.expandedReplyIds.indexOf(commentId);

    if (index > -1) {
      // දැනටමත් expanded නම්, array එකෙන් ඉවත් කර (Hide කර)
      this.expandedReplyIds.splice(index, 1);
    } else {
      // expanded නැතිනම්, array එකට එකතු කර (Expand කර)
      this.expandedReplyIds.push(commentId);
    }
  }

  // Comment ID එක expanded ද කියා පරීක්ෂා කරනවා (HTML එකේ *ngIf සඳහා)
  isRepliesExpanded(commentId: number): boolean {
    return this.expandedReplyIds.includes(commentId);
  }

}