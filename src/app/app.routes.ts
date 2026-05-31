import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@layouts/main-layout/main-layout.component').then((m) => m.MainLayoutComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'counter',
      },
      {
        path: 'counter',
        loadComponent: () =>
          import('@features/counter/view/counter.view').then((m) => m.CounterView),
        title: 'Counter',
      },
      {
        path: 'about',
        loadComponent: () => import('@features/about/view/about.view').then((m) => m.AboutView),
        title: 'À propos',
      },
      {
        path: '**',
        loadComponent: () =>
          import('@shared/components/not-found/not-found.component').then(
            (m) => m.NotFoundComponent,
          ),
        title: 'Not Found',
      },
    ],
  },
];
