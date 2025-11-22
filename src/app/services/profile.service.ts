// src/app/services/profile.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  // Backend API URL එක
  private apiUrl = 'http://localhost:8080/api/profile';

  constructor(private http: HttpClient) { }

  // 1. Userගෙ details ගන්න function එක
  // (Token එක Interceptor එකෙන් auto-attach වෙයි)
  public getUserProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`);
  }

  // 2. Userගෙ posts ටික ගන්න function එක
  // (Token එක Interceptor එකෙන් auto-attach වෙයි)
  public getMyPosts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/my-posts`);
  }

  // 3. Profile Image එක update කරන function එක
  updateProfileImage(imageFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('imageFile', imageFile);
    return this.http.put(`${this.apiUrl}/image`, formData);
  }

  // --- 4. 🚨🚨🚨 මේ FUNCTION එක අලුතෙන් ADD කරන්න 🚨🚨🚨 ---
  updateUserProfile(formData: FormData): Observable<any> {
    
    // Backend එකේදී අපි "/api/profile/update" endpoint එක
    // ඊළඟට හැදුවා (UpdateProfileRequest DTO එකත් එක්ක)
    // මේක PUT request එකක් (Token එක Interceptor එකෙන් attach වෙයි)
    return this.http.put(`${this.apiUrl}/update`, formData);
  }
  
}


// src/app/services/auth.service.ts

// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { BehaviorSubject, Observable } from 'rxjs';
// import { tap } from 'rxjs/operators'; 

// // --- 1. User Details Interface එක හරියට හදමු ---
// export interface UserDetails {
//   id: number;
//   name: string;
//   email: string;
//   profileImageUrl?: string; // <-- Image URL එක මෙතන තියෙන්න ඕන
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {

//   private apiUrl = 'http://localhost:8080/api/auth';
  
//   // --- 2. State Management Subjects (දෙකම) ---
  
//   // Login status එක broadcast කරන එක
//   private _isLoggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());
//   public isLoggedIn$ = this._isLoggedIn.asObservable();

//   // User Details broadcast කරන අලුත් එක
//   private _currentUserDetails = new BehaviorSubject<UserDetails | null>(this.getUserDetails());
//   public currentUserDetails$ = this._currentUserDetails.asObservable();

//   constructor(private http: HttpClient) { }
  
//   // --- 3. User Details Save කරන Main Function එක (UPDATE කළා) ---
//   private saveUserDetails(response: any): void {
//       // Backend (LoginResponse DTO) එකෙන් එන data save කරනවා
//       localStorage.setItem('token', response.token);

//       // UserDetails object එක හදනවා (Image URL එකත් එක්ක)
//       const userDetails: UserDetails = { 
//           id: response.id,
//           name: `${response.firstName} ${response.lastName}`,
//           email: response.email,
//           profileImageUrl: response.profileImageUrl || null // <-- Image URL එක save කරනවා
//       };
      
//       localStorage.setItem('user_details', JSON.stringify(userDetails));
      
//       // Details අලුත් වුනා කියලා App එකට "Broadcast" කරනවා
//       this.updateLoginStatus(true);
//       this._currentUserDetails.next(userDetails); // <-- අලුත් details යවනවා
//   }

//   // --- 4. User Details Load කරන Function එක ---
//   getUserDetails(): UserDetails | null {
//       const details = localStorage.getItem('user_details');
//       if (details) {
//           return JSON.parse(details);
//       }
//       return null;
//   }
  
//   // --- 5. User ID ලබා ගැනීම ---
//   getCurrentUserId(): number | null {
//       const details = this.getUserDetails();
//       return details ? details.id : null;
//   }

//   // --- 6. Login Status එක Check කිරීම ---
//   isLoggedIn(): boolean {
//     const token = localStorage.getItem('token');
//     return token !== null && localStorage.getItem('user_details') !== null;
//   }

//   updateLoginStatus(status: boolean): void {
//     this._isLoggedIn.next(status);
//   }

//   // --- 7. Logout කිරීම (UPDATE කළා) ---
//   logout(): void {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user_details'); // Details remove කරනවා
    
//     // "Broadcast" කරනවා
//     this.updateLoginStatus(false); 
//     this._currentUserDetails.next(null); // User details clear කරනවා
//   }

//   // --- 8. අලුත්: Profile Update වුනාම Details Refresh කරන Function එක ---
//   // (මේක Profile-Edit page එකෙන් call කරනවා)
//   refreshUserDetails(updatedUserDto: any): void {
//     // Backend එකෙන් ආපු DTO එක, අපේ UserDetails format එකට convert කරනවා
//     const userDetails: UserDetails = {
//       id: updatedUserDto.id,
//       name: `${updatedUserDto.firstName} ${updatedUserDto.lastName}`,
//       email: updatedUserDto.email,
//       profileImageUrl: updatedUserDto.profileImageUrl || null
//     };
    
//     // localStorage එකයි, Broadcast එකයි දෙකම update කරනවා
//     localStorage.setItem('user_details', JSON.stringify(userDetails));
//     this._currentUserDetails.next(userDetails);
//   }

//   // --- API Calls ---

//   register(requestData: any): Observable<any> {
//     return this.http.post(`${this.apiUrl}/register`, requestData, { responseType: 'text' });
//   }

//   // --- 9. Login (මේක හරි) ---
//   login(requestData: any): Observable<any> {
//     return this.http.post(`${this.apiUrl}/login`, requestData)
//         .pipe(
//             tap((response: any) => { 
//                 this.saveUserDetails(response); // details save කරනවා
//             })
//         );
//   } 
// }