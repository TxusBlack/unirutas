import { Injectable } from '@angular/core';
import { Geolocation } from "@ionic-native/geolocation";

import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Subscription } from "rxjs/Subscription";
import { UserProvider } from "../user/user";

@Injectable()
export class UbicationProvider {

  documentUser: AngularFirestoreDocument<any>;
  collectionUser: AngularFirestoreCollection<any>;
  private watch: Subscription;

  constructor(private geolocation: Geolocation, public _usuario: UserProvider, private afDB: AngularFirestore) {
    console.log('Hello UbicacionProvider Provider');
  }

  initDocument(user, data) {
    return new Promise(resolve => {
      this.documentUser = this.afDB.doc(`/usuarios/${user}`);
      this.documentUser.update(data).then(() => {
        // updated successful (document exists)
        resolve('Ya habian datos');
      }).catch(err => {
        this.documentUser.set(data).then(() => {
          resolve('Se crearon los datos');
        });
      });
    });
  }

  verViajes() {
    this.collectionUser = this.afDB.collection('viajes');
    this.collectionUser.ref.get().then(res => {
      res.forEach((doc) => {
        console.log(doc.id, "=>", doc.data());
      });
    });
  }

  crearViaje(usuario, origen, puestos, valor) {
    return new Promise(resolve => {
      this.documentUser = this.afDB.doc(`/viajes/${origen}`);
      let data = {
        user: usuario,
        origen: origen,
        puestos: puestos,
        valor: valor
      };
      this.documentUser.update(data).then(() => {
        // updated successful (document exists)
        resolve('Ya habian datos');
      }).catch(err => {
        this.documentUser.set(data).then(() => {
          resolve('Se crearon los datos');
        });
      });
    });
  }

  iniciarGPS() {
    return new Promise(resolve => {
      this.geolocation.getCurrentPosition().then((resp) => {
        // resp.coords.latitude
        // resp.coords.longitude

        this.documentUser.update({
          lat: resp.coords.latitude,
          lng: resp.coords.longitude,
          clave: this._usuario.clave
        });

        this.watch = this.geolocation.watchPosition()
          .subscribe((data) => {
            // data can be a set of coordinates, or an error (if an error occurred).
            // data.coords.latitude
            // data.coords.longitude
            this.documentUser.update({
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
