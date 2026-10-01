import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { LinhaTempoComponent } from './linha-tempo/linha-tempo.component';
import { PortalOsComponent } from './portal-os.component';
import { PortalOsGuard } from './portal-os.guard';
import { PortalOsRoutingModule } from './portal-os.routing';
import { PortalOsService } from './portal-os.service';

@NgModule({
  imports: [
    CommonModule,
    GoogleMapsModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    BsDatepickerModule.forRoot(),
    PortalOsRoutingModule
  ],
  declarations: [PortalOsComponent, LinhaTempoComponent],
  exports: [PortalOsComponent],
  providers: [
    PortalOsGuard, 
    PortalOsService 
  ]
})

export class PortalOsModule { }
