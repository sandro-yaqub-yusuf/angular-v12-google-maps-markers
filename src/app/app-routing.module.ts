import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortalOsGuard } from './components/portal-os/portal-os.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'portal-servicos/portal-os' },
  {
    path: 'portal-servicos/portal-os',
    canActivate: [PortalOsGuard],
    loadChildren: () => import('./components/portal-os/portal-os.module').then(m => m.PortalOsModule)
  },
  { path: '**', redirectTo: 'portal-servicos/portal-os' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
