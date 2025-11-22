// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators'; // <-- 1. 'tap' import කරන්න

// --- 2. User Details Interface (Header එකට ඕන) ---
export interface UserDetails {
  id: number;
  name: string;
  email: string;
  profileImageUrl?: string; 
  postCount?: number;     // <-- 1. මේක ADD කළා
  commentCount?: number;  // <-- 2. මේක ADD කළා
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/auth';
  
  // --- 3. State Management Subjects (දෙකම) ---
  
  // Login status එක broadcast කරන එක
  private _isLoggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());
  public isLoggedIn$ = this._isLoggedIn.asObservable();

  // User Details broadcast කරන අලුත් එක (Header එකට ඕන)
  private _currentUserDetails = new BehaviorSubject<UserDetails | null>(this.getUserDetails());
  public currentUserDetails$ = this._currentUserDetails.asObservable(); // <-- Header එකේ Error එක

  constructor(private http: HttpClient) { }
  
  // --- 4. User Details Save කරන Main Function එක (FIXED) ---
  private saveUserDetails(response: any): void {
      localStorage.setItem('token', response.token);

      // UserDetails object එක හදනවා (Image URL එකත් එක්ක)
      const userDetails: UserDetails = { 
          id: response.id,
          name: `${response.firstName} ${response.lastName}`,
          email: response.email,
          profileImageUrl: response.profileImageUrl || null, // <-- Image URL එක save කරනවා
          postCount: response.postCount || 0,       // <-- 3. මේක ADD කළා
          commentCount: response.commentCount || 0   // <-- 4. මේක ADD කළා
      };
      
      localStorage.setItem('user_details', JSON.stringify(userDetails));
      
      // Details අලුත් වුනා කියලා App එකට "Broadcast" කරනවා
      this.updateLoginStatus(true);
      this._currentUserDetails.next(userDetails); // <-- අලුත් details යවනවා
  }

  // --- 5. User Details Load කරන Function එක ---
  getUserDetails(): UserDetails | null {
      const details = localStorage.getItem('user_details');
      if (details) {
          return JSON.parse(details);
      }
      return null;
  }
  
  // --- 6. User ID ලබා ගැනීම ---
  getCurrentUserId(): number | null {
      const details = this.getUserDetails();
      return details ? details.id : null;
  }

  // --- 7. Login Status එක Check කිරීම ---
  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    // Token එක සහ User Details දෙකම තියෙනවද බලනවා
    return token !== null && localStorage.getItem('user_details') !== null;
  }

  updateLoginStatus(status: boolean): void {
    this._isLoggedIn.next(status);
  }

  // --- 8. Logout කිරීම (FIXED) ---
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user_details'); // Details remove කරනවා
    
    // "Broadcast" කරනවා
    this.updateLoginStatus(false); 
    this._currentUserDetails.next(null); // User details clear කරනවා
  }

  // --- 9. අලුත්: Profile Update වුනාම Details Refresh කරන Function එක ---
  // (මේක Profile-Edit page එකෙන් call කරනවා)
  refreshUserDetails(updatedUserDto: any): void {
    // Backend එකෙන් ආපු DTO එක, අපේ UserDetails format එකට convert කරනවා
    const userDetails: UserDetails = {
      id: updatedUserDto.id,
      name: `${updatedUserDto.firstName} ${updatedUserDto.lastName}`,
      email: updatedUserDto.email,
      profileImageUrl: updatedUserDto.profileImageUrl || null,
      postCount: updatedUserDto.postCount || 0,       // <-- 5. මේක ADD කළා
      commentCount: updatedUserDto.commentCount || 0   // <-- 6. මේක ADD කළා
    };
    
    // localStorage එකයි, Broadcast එකයි දෙකම update කරනවා
    localStorage.setItem('user_details', JSON.stringify(userDetails));
    this._currentUserDetails.next(userDetails);
  }

  // --- API Calls ---

  register(requestData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, requestData, { responseType: 'text' });
  }

  // --- 10. Login (FIXED) ---
  login(requestData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, requestData)
        .pipe(
            tap((response: any) => { 
                // Login වුන ගමන් details save කරනවා
                this.saveUserDetails(response); 
            })
        );
  } 
}















// // src/app/services/auth.service.ts

// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { BehaviorSubject, Observable } from 'rxjs'; // <-- BehaviorSubject Import

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {

//   private apiUrl = 'http://localhost:8080/api/auth';

 
//   private _isLoggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());
//   public isLoggedIn$ = this._isLoggedIn.asObservable();

//   constructor(private http: HttpClient) { }

//   isLoggedIn(): boolean {
//     const token = localStorage.getItem('token');
//     return token !== null;
//   }


//   updateLoginStatus(status: boolean): void {
//     this._isLoggedIn.next(status);
//   }


//   logout(): void {
//     localStorage.removeItem('token');
//     this.updateLoginStatus(false); 
//   }

//   register(requestData: any): Observable<any> {
//     return this.http.post(`${this.apiUrl}/register`, requestData, { responseType: 'text' });
//   }

//   login(requestData: any): Observable<any> {
//     return this.http.post(`${this.apiUrl}/login`, requestData);
//   }

// }




































// src/app/services/auth.service.ts

// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { BehaviorSubject, Observable } from 'rxjs';
// // 1. tap operator එක import කරන්න
// import { tap } from 'rxjs/operators'; 

// // --- User Details Interface ---
// export interface UserDetails {
//     id: number;
//     name: string;
//     email: string;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {

//   private apiUrl = 'http://localhost:8080/api/auth';
  
//   // Login status broadcast කරන BehaviorSubject
//   private _isLoggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());
//   public isLoggedIn$ = this._isLoggedIn.asObservable();

//   constructor(private http: HttpClient) { }
  
//   // --- 1. User Details localStorage එකේ Save කිරීම ---
//   private saveUserDetails(response: any): void {
//       // Backend (LoginResponse DTO) එකෙන් එන data save කරනවා
//       localStorage.setItem('token', response.token);
//       localStorage.setItem('user_details', JSON.stringify({ 
//           id: response.id,
//           name: `${response.firstName} ${response.lastName}`, // නම එකතු කරනවා
//           email: response.email
//       } as UserDetails));
//       this.updateLoginStatus(true);
//   }

//   // --- 2. Login Status එක Check කිරීම ---
//   isLoggedIn(): boolean {
//     const token = localStorage.getItem('token');
//     // Token එක සහ User Details දෙකම තියෙනවද බලනවා
//     return token !== null && localStorage.getItem('user_details') !== null;
//   }

//   // --- 3. User Details ලබා ගැනීම ---
//   getUserDetails(): UserDetails | null {
//       const details = localStorage.getItem('user_details');
//       if (details) {
//           return JSON.parse(details);
//       }
//       return null;
//   }
  
//   // --- 4. User ID ලබා ගැනීම (Post Edit/Delete වලට) ---
//   getCurrentUserId(): number | null {
//       const details = this.getUserDetails();
//       return details ? details.id : null;
//   }


//   updateLoginStatus(status: boolean): void {
//     this._isLoggedIn.next(status);
//   }

//   // --- 5. Logout කිරීම ---
//   logout(): void {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user_details'); // Details remove කරනවා
//     this.updateLoginStatus(false); 
//   }

//   // --- API Calls ---

//   register(requestData: any): Observable<any> {
//     return this.http.post(`${this.apiUrl}/register`, requestData, { responseType: 'text' });
//   }

//   // --- 6. Login: Response එක අල්ලාගෙන details save කිරීම ---
//   login(requestData: any): Observable<any> {
//     return this.http.post(`${this.apiUrl}/login`, requestData)
//         .pipe(
//             tap((response: any) => { 
//                 this.saveUserDetails(response); // details save කරනවා
//             })
//         );
//   } 
// }