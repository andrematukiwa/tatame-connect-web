import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((m) => m.Home)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login)
  },
  {
    path: 'cadastro',
    loadComponent: () => import('./features/auth/signup-select/signup-select').then((m) => m.SignupSelect)
  },
  {
    path: 'cadastro/professor',
    loadComponent: () =>
      import('./features/auth/signup-professor/signup-professor').then((m) => m.SignupProfessor)
  },
  {
    path: 'cadastro/academia',
    loadComponent: () => import('./features/auth/signup-academia/signup-academia').then((m) => m.SignupAcademia)
  },
  {
    path: 'academia/dashboard',
    loadComponent: () => import('./features/academia/dashboard/dashboard').then((m) => m.AcademiaDashboard),
    canActivate: [authGuard],
    data: { role: 'ACADEMIA' }
  },
  {
    path: 'academia/professores/:id',
    loadComponent: () =>
      import('./features/academia/professor-detail/professor-detail').then((m) => m.ProfessorDetail),
    canActivate: [authGuard],
    data: { role: 'ACADEMIA' }
  },
  {
    path: 'academia/perfil',
    loadComponent: () =>
      import('./features/academia/profile-edit/profile-edit').then((m) => m.AcademiaProfileEdit),
    canActivate: [authGuard],
    data: { role: 'ACADEMIA' }
  },
  {
    path: 'professor/perfil',
    loadComponent: () => import('./features/professor/profile-edit/profile-edit').then((m) => m.ProfileEdit),
    canActivate: [authGuard],
    data: { role: 'PROFESSOR' }
  },
  {
    path: '**',
    redirectTo: ''
  }
];
