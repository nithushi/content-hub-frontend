// src/app/interceptors/token.interceptor.ts

import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  
  // 1. localStorage එකෙන් token එක ගන්නවා
  const token = localStorage.getItem('token');

  // 2. Token එකක් තියෙනවා නම්...
  if (token) {
    // 3. Request එක clone කරලා, Authorization Header එක දානවා
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    // 4. අලුත් request එක යවනවා
    return next(clonedReq);
  }

  // 5. Token එකක් නැත්නම්, request එක මුකුත් නොකර යවනවා
  return next(req);
};