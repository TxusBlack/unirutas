import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SeeTripPage } from './see-trip';

@NgModule({
  declarations: [
    SeeTripPage,
  ],
  imports: [
    IonicPageModule.forChild(SeeTripPage),
  ],
})
export class SeeTripPageModule {}
