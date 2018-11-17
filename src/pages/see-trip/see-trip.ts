import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-see-trip',
  templateUrl: 'see-trip.html',
})
export class SeeTripPage {

  public desde: String;
  public conductor: String;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alert: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SeeTripPage');
  }

  start() {
    this.alert.create({
      title: 'Solicitud enviada',
      subTitle: 'Se ha enviado la solicitud de viaje para ' + this.conductor + '. Ahora solo debes esperar a que el conductor acepte y confirme tu viaje',
      buttons: ['Aceptar']
    }).present();
  }

  ionViewWillEnter() {
    this.desde = this.navParams.get('desde');
    this.conductor = this.navParams.get('conductor');
  }

}
