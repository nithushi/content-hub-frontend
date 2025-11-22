// src/app/services/post.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private apiUrl = 'http://localhost:8080/api/posts'; // Post API URL

  constructor(private http: HttpClient) { }

  // අලුත්: Create Post function
  createPost(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData, { responseType: 'text' });
  }

  // ID එකෙන් Post එකක් fetch කරනවා
  getPostById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Post එකක Comments Fetch කිරීම
  getCommentsForPost(postId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${postId}/comments`);
  }

  // --- 🚨 FIXED: අලුත් Comment එකක් දැමීම (Parent ID support සමඟ) ---
  createComment(
    postId: string,
    content: string,
    // ✨ NEW: parentCommentId එක optional ලෙස එකතු කිරීම
    parentCommentId?: number
  ): Observable<any> {

    // Request Body එක සකස් කිරීම
    const body: any = { content: content };

    // parentCommentId එකක් ඇත්නම්, එය body එකට එකතු කිරීම
    if (parentCommentId) {
      body.parentCommentId = parentCommentId;
    }

    // POST /api/posts/{postId}/comments
    return this.http.post(`${this.apiUrl}/${postId}/comments`, body, { responseType: 'text' });
  }

  // Post එකක් Like/Unlike කිරීම
  toggleLike(postId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${postId}/like`, {});
  }

  // Comment එකක් Like/Unlike කිරීම
  toggleCommentLike(postId: string, commentId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${postId}/comments/${commentId}/like`, {});
  }

  // Comment එකක් Edit කිරීම
  editComment(postId: string, commentId: number, newContent: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${postId}/comments/${commentId}`, { content: newContent }, { responseType: 'text' });
  }

  // Comment එකක් Delete කිරීම
  deleteComment(postId: string, commentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${postId}/comments/${commentId}`, { responseType: 'text' });
  }

  // Posts Feed එක Fetch කිරීම
  getAllPosts(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Comment එකක් Pin කිරීම
  toggleCommentPin(postId: string, commentId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${postId}/comments/${commentId}/pin`, {}, { responseType: 'text' });
  }

  updatePost(postId: string, formData: FormData): Observable<any> {
    // මේක 'http.put' වෙන්න ඕන, 'http.post' නෙවෙයි
    return this.http.put(`${this.apiUrl}/${postId}`, formData, { responseType: 'text' });
  }

  // --- 2. NEW: Post එකක් Delete කිරීම ---
  deletePost(postId: string): Observable<any> {
    // DELETE /api/posts/{postId}
    return this.http.delete(`${this.apiUrl}/${postId}`, { responseType: 'text' });
  }
}