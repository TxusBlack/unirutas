import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {HomePage} from "../home/home";
import {UbicationProvider} from "../../providers/ubication/ubication";
import {Storage} from "@ionic/storage";

@IonicPage()
@Component({
  selector: 'page-crear-viaje',
  templateUrl: 'crear-viaje.html',
})
export class CrearViajePage {

  public origen;
  public puestos;
  public valor;

  constructor(public navCtrl: NavController, public navParams: NavParams, private _provider: UbicationProvider, private storage: Storage) {
  }

  goToHome() {
    this.navCtrl.push(HomePage, {viaje: true});
  }

  crearViaje() {
    this.storage.get('user').then(user => {
      this._provider.crearViaje(user.email, this.origen,this.puestos, this.valor).then(() => {
        this.goToHome();
      });
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CrearViajePage');
  }

}
