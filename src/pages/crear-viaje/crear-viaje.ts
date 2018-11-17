import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {HomePage} from "../home/home";

@IonicPage()
@Component({
  selector: 'page-crear-viaje',
  templateUrl: 'crear-viaje.html',
})
export class CrearViajePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  goToHome() {
    this.navCtrl.push(HomePage, {viaje: true});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CrearViajePage');
  }

}
