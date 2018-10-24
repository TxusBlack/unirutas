import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Storage } from "@ionic/storage";
import { Subscription } from "rxjs/Subscription";

@Injectable()
export class UserProvider {

  clave: string;
  user: any = {};
  private doc: Subscription;

  constructor(private afDB: AngularFirestore, private storage: Storage) {
    console.log('Hello UsuarioProvider Provider');
  }

  verificarUsuario(clave: string) {

    clave = clave.toLocaleLowerCase();

    return new Promise((resolve, reject) => {
      this.doc = this.afDB.doc(`/usuarios/${clave}`)
        .valueChanges().subscribe((data: any) => {
          if (data) {
            this.clave = clave;
            this.user = data;
            this.guardarStorage();
            resolve({status: data.status});
          } else {
            resolve(false);
          }
        });
    });
  }

  guardarStorage() {
    this.storage.set('clave', this.clave);
  }

  cargarStorage() {
    return new Promise(resolve => {
      this.storage.get('clave').then(val => {
        if (val) {
          this.clave = val;
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  borrarUsuario() {
    this.clave = null;
    this.storage.remove('clave');
    try {
      this.doc.unsubscribe();
    } catch (e) {
      console.log(JSON.stringify(e));
    }
  }

}
