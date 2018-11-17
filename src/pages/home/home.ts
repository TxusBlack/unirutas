import { Component } from '@angular/core';
import {AlertController, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";
import { Geolocation } from "@ionic-native/geolocation";
import {UbicationProvider} from "../../providers/ubication/ubication";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  public gpsData: any = {
    lat: 6.5383054,
    lng: -73.1278196
  };

  constructor(public navParams: NavParams, public navCtrl: NavController, private afAuth: AngularFireAuth, private toast: ToastController, private geolocation: Geolocation, private loadingCtrl: LoadingController, private _geo: UbicationProvider, private alert: AlertController) {

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
      this.geolocation.getCurrentPosition().then((resp) => {
        // resp.coords.latitude
        // resp.coords.longitude
        resolve({
          lat: resp.coords.latitude,
          lng: resp.coords.longitude,
        });
      }).catch((error) => {
        console.log('Error getting location', error);
      });

      let watch = this.geolocation.watchPosition();
      watch.subscribe((data) => {
        // data can be a set of coordinates, or an error (if an error occurred).
        // data.coords.latitude
        // data.coords.longitude
        console.log(data.coords.latitude);
        console.log(data.coords.longitude);
        this.gpsData.lat = data.coords.latitude;
        this.gpsData.lng = data.coords.longitude;
        this._geo.bus.valueChanges().subscribe((data: any) => {
          console.log(data);
          this.gpsData.lat = data.lat;
          this.gpsData.lng = data.lng;
        });
        resolve({
          lat: data.coords.latitude,
          lng: data.coords.longitude,
        });
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
    let from = this.navParams.get('viaje');
    from ? this.alert.create({
      title: 'Viaje creado',
      subTitle: 'El viaje ha sido creado exitosamente, ahora es necesario compartir la posición GPS para iniciar el viaje',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            this.auth().then(() => {
              this.loadingGps();
            });
          }
        }
      ]
    }).present() :
    this.auth().then(() => {
      this.loadingGps();
    });
  }

}
