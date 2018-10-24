import { Injectable } from '@angular/core';
import { Geolocation } from "@ionic-native/geolocation";

import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Subscription } from "rxjs/Subscription";
import { UserProvider } from "../user/user";

@Injectable()
export class UbicationProvider {

  bus: AngularFirestoreDocument<any>;
  private watch: Subscription;

  constructor(private geolocation: Geolocation, public _usuario: UserProvider, private afDB: AngularFirestore) {
    console.log('Hello UbicacionProvider Provider');
  }

  inicializarUsuario() {
    this.bus = this.afDB.doc(`/usuarios/${this._usuario.clave}`);
  }

  iniciarGPS() {
    return new Promise(resolve => {
      this.geolocation.getCurrentPosition().then((resp) => {
        // resp.coords.latitude
        // resp.coords.longitude

        this.bus.update({
          lat: resp.coords.latitude,
          lng: resp.coords.longitude,
          clave: this._usuario.clave
        });

        this.watch = this.geolocation.watchPosition()
          .subscribe((data) => {
            // data can be a set of coordinates, or an error (if an error occurred).
            // data.coords.latitude
            // data.coords.longitude
            this.bus.update({
              lat: data.coords.latitude,
              lng: data.coords.longitude,
              clave: this._usuario.clave
            });
            resolve({
              lat: data.coords.latitude,
              lng: data.coords.longitude,
            });
          });

      }).catch((error) => {
        console.log('Error getting location', error);
      });
    });
  }

  detenerGPS() {
    try {
      this.watch.unsubscribe();
    } catch (e) {
      console.log(JSON.stringify(e));
    }
  }

}
