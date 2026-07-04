import { Routes } from '@angular/router';
import { firebaseGuard } from './FireBaseProvider/FirebaseGuard';

export const routes: Routes = [
    {path: '', redirectTo: '/Authentication/Login', pathMatch: 'full' },
    {path: 'Authentication', loadComponent: () => import('./auth/base/Authbase').then(m => m.AuthBase), children: [
        {path: 'Login', loadComponent: () => import('./auth/login/login').then(m => m.LoginComponent)},
        {path: 'Register', loadComponent: () => import('./auth/register/register').then(m => m.RegisterComponent)}
    ]},
    {path: 'Conversation' ,loadComponent: () => import('./main/chat-base/chat-base').then(m => m.ChatBase)}
];
