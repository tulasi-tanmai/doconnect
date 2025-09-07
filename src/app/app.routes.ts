// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AdminGuard } from './core/admin.guard';
import { AdminUsersComponent } from './features/admin-users/admin-users.component';

export const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES) },
  { path: 'questions', loadChildren: () => import('./features/questions/questions.routes').then(m => m.QUESTIONS_ROUTES) },

  // Guard the admin feature BEFORE it loads
  {
    path: 'admin',
    canMatch: [AdminGuard],
    canActivate: [AdminGuard],
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  // { path: 'ai', loadComponent: () => import('./features/ai/ai-chat/ai-chat.component').then(m => m.AiChatComponent) },

  { path: 'admin/users', component: AdminUsersComponent, canActivate: [AdminGuard] },




  { path: '', redirectTo: 'questions', pathMatch: 'full' },
  //adding
  // { path: 'ai', loadComponent: () => import('./features/ai/ai-chat/ai-chat.component').then(m => m.AiChatComponent) },

  { path: '**', redirectTo: 'questions' },

  //  REMOVE this block (it runs your guard and can trigger admin calls)
  // {
  //   path: 'questions/pending',
  //   canActivate: [AdminGuard],
  //   loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.DashboardComponent)
  // }
];
