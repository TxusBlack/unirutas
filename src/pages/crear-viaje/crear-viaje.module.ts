import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CrearViajePage } from './crear-viaje';

@NgModule({
  declarations: [
    CrearViajePage,
  ],
  imports: [
    IonicPageModule.forChild(CrearViajePage),
  ],
})
export class CrearViajePageModule {}
