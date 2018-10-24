import { Component } from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import { User } from '../../models/user';

import { AngularFireAuth } from "angularfire2/auth";
import {HomePage} from "../home/home";

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  user = {} as User;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afAuth: AngularFireAuth,
    private toast: ToastController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) { }

  async register(user: User) {
    let loading = this.loadingCtrl.create({
      content: 'Cargando'
    });
    loading.present();
    try {
      const result = await this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password);
      if (result) {
        // @ts-ignore
        this.navCtrl.setRoot(HomePage);
        this.toast.create({
          message: 'Bienvenido',
          duration: 3000
        }).present();
        loading.dismiss();
      }
      console.log(result);
    } catch(e) {
      console.log(e.message);
      // Password should be at least 6 characters
      let error: string;
      switch(e.message) {
        case 'Password should be at least 6 characters': {
          error = 'La contraseña debe tener mínimo 6 caracteres';
          break;
        }
        case 'The email address is already in use by another account.': {
          error = 'Usuario ya registrado';
          break;
        }
        default: {
          error = e.message;
          break;
        }
      }
      loading.dismiss();
      this.presentAlert(error);
    }
  }

  presentAlert(message) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: message,
      buttons: ['Aceptar']
    });
    alert.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

}
