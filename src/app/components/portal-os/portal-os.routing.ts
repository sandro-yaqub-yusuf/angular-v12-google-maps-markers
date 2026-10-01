import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortalOsComponent } from './portal-os.component';
import { PortalOsGuard } from './portal-os.guard';

const routes: Routes = [
  { path: '', 
    component: PortalOsComponent,
    canActivate: [PortalOsGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PortalOsRoutingModule { }
