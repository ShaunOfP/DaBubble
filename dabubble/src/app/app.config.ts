import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';

import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'dabubble385',
        appId: '1:571622353144:web:755b346000e1c75f1db30d',
        storageBucket: 'dabubble385.firebasestorage.app',
        apiKey: 'AIzaSyBO5-RemTjbcRntX6acn00Cui941XoJ5cA',
        authDomain: 'dabubble385.firebaseapp.com',
        messagingSenderId: '571622353144',
      })
    ),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideAnimations(),
    provideHttpClient(),
  ],
};
