import { Component } from '@angular/core';
import {LoadingController, NavController, ToastController} from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";
import { Geolocation } from "@ionic-native/geolocation";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  public gpsData: any = {
    lat: '',
    lng: ''
  };

  constructor(public navCtrl: NavController, private afAuth: AngularFireAuth, private toast: ToastController, private geolocation: Geolocation, private loadingCtrl: LoadingController) {

  }

  auth() {
    return new Promise(resolve => {
      this.afAuth.authState.subscribe(data => {
        if (data && data.email && data.uid) {
          this.toast.create({
            message: `Bienvenido a Unirutas, ${data.email}`,
            duration: 3000
          }).present();
          resolve(true);
        } else {
          this.toast.create({
            message: `Usuario no existe`,
            duration: 3000
          }).present();
          resolve(false);
        }
      });
    });
  }

  gps() {
    return new Promise(resolve => {
      let watch = this.geolocation.watchPosition();
      watch.subscribe((resp) => {
        // data can be a set of coordinates, or an error (if an error occurred).
        // data.coords.latitude
        // data.coords.longitude
        console.log(resp.coords.latitude);
        console.log(resp.coords.longitude);
        this.gpsData.lat = resp.coords.latitude;
        this.gpsData.lng = resp.coords.longitude;
        resolve();
      });
    });
  }

  loadingGps() {
    let loading = this.loadingCtrl.create({
      content: 'Cargando Ubicación GPS'
    });
    loading.present();
    this.gps().then(() => {
      loading.dismiss();
    });
  }

  ionViewWillEnter() {
    this.auth().then(() => {
      this.loadingGps();
    });
  }

}
