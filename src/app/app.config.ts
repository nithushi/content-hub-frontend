// src/app/app.config.ts

import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; 
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

import { routes } from './app.routes';
import { tokenInterceptor } from './interceptors/token.interceptor'; // <-- Import

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    
    provideAnimations(), // Toastr
    
    provideToastr(), // Toastr
    
    // Interceptor එකත් එක්ක HttpClient එක පාරක් provide කරනවා
    provideHttpClient(withInterceptors([
      tokenInterceptor 
    ]))
  ]
};