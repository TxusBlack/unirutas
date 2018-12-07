import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, AlertController, LoadingController} from 'ionic-angular';
import { User } from '../../models/user';
import { AngularFireAuth } from "angularfire2/auth";
import { HomePage } from '../home/home';
import {ListPage} from "../list/list";
import {Storage} from "@ionic/storage";
import {UbicationProvider} from "../../providers/ubication/ubication";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user = {} as User;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afAuth: AngularFireAuth,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private storage: Storage,
    private _provider: UbicationProvider
  ) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  async login(user: User) {
    let loading = this.loadingCtrl.create({
      content: 'Cargando'
    });
    loading.present();
    try {
      const result = await this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
      console.log(result);
      if (result) {
        this.storage.ready().then(() => {
          this.storage.set('user', user).then(() => {
            this._provider.initDocument(user.email, {email: user.email}).then(res => {
              if (res) {
                console.log(res);
                this.navCtrl.setRoot(ListPage);
                loading.dismiss();
              }
            });
          });
        });
      }
    } catch(e) {
      console.log(e.message);
      let error: string;
      switch(e.message) {
        case 'The password is invalid or the user does not have a password.': {
          error = 'La contraseña es incorrecta';
          break;
        }
        case 'Too many unsuccessful login attempts.  Please include reCaptcha verification or try again later' : {
          error = 'Completa el Captcha o Intenta más tarde';
          break;
        }
        case 'There is no user record corresponding to this identifier. The user may have been deleted.' : {
          error = 'Usuario no existe';
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

  register() {
    this.navCtrl.push('RegisterPage');
  }

  ionViewWillEnter() {
    let data = this.navParams.get('user');
    console.log(data);
  }

}
