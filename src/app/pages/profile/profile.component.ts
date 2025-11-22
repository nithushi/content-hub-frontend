import { Component, OnInit, OnDestroy, HostListener, ElementRef } from '@angular/core'; // <-- 1. OnDestroy Import
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Subject, takeUntil } from 'rxjs'; // <-- 2. Subject, takeUntil Import
import { PostService } from '../../services/post.service';
import { AuthService, UserDetails } from '../../services/auth.service'; // <-- 3. AuthService, UserDetails Import

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit, OnDestroy { // <-- 4. OnDestroy Implement

  // 'user' වෙනුවට 'currentUser' පාවිච්චි කරමු
  currentUser: UserDetails | null = null; 
  posts: any[] = [];
  isLoading = true;
  openPostMenuId: number | null = null;

  private destroy$ = new Subject<void>(); // <-- 5. Unsubscribe වලට

  constructor(
    private profileService: ProfileService,
    private toastr: ToastrService,
    private postService: PostService,
    private authService: AuthService, // <-- 6. Inject
    private eRef: ElementRef,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.isLoading = true;

    // --- 7. 🚨🚨🚨 මේක තමයි අලුත් LOGIC එක 🚨🚨🚨 ---
    // AuthService එකේ user details වලට subscribe වෙනවා
    this.authService.currentUserDetails$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(user => {
      this.currentUser = user; // User details update කරනවා

      if (user) {
        // User ඉන්නවා නම්, එයාගේ posts ටික load කරනවා
        this.loadUserPosts(); 
      } else {
        // User logout වුනොත් (null)
        this.isLoading = false;
        this.posts = [];
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete(); // Memory leaks නවත්තනවා
  }

  // --- 8. Posts load කරන function එක වෙනම හැදුවා ---
  loadUserPosts(): void {
    this.profileService.getMyPosts().subscribe({
      next: (postData) => {
        this.posts = postData;
        this.isLoading = false;
      },
      error: (err) => {
        this.toastr.error('Could not load posts');
        this.isLoading = false;
      }
    });
  }

  // ... (getInitials, togglePostMenu, onDeletePost, clickout functions) ...
  // --- 9. getInitials function එක update කළා ---
  getInitials(name: string | undefined): string {
    if (!name) return 'U';
    const initials = name.split(' ').map(n => n[0]).join('');
    return initials.substring(0, 2).toUpperCase();
  }

  togglePostMenu(postId: number): void {
    this.openPostMenuId = this.openPostMenuId === postId ? null : postId;
  }

  onDeletePost(postId: number): void {
    this.togglePostMenu(postId); 
    if (confirm('Are you sure you want to delete this post? This cannot be undone.')) {
      this.postService.deletePost(postId.toString()).subscribe({
        next: (response) => {
          this.toastr.success('Post deleted successfully!', 'Deleted');
          this.loadUserPosts(); // <-- List එක refresh කරනවා
        },
        error: (err) => {
          this.toastr.error(err.error || 'Failed to delete post.', 'Error');
        }
      });
    }
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.openPostMenuId = null;
    }
  }
}