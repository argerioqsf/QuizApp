import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ModalController, ViewController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import firebase from 'firebase';
import { FIREBASE_CREDENTIALS } from './credentials_firebase';
import { NativeStorage } from '@ionic-native/native-storage';
import { BackgroundMode } from '@ionic-native/background-mode';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  logou = false;
  voltar = false;
  pages: Array<{title: string, component: any,icone: any}>;
  nick = null;
  constructor(public platform: Platform, 
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen,
              private nativeStorage: NativeStorage,
              private modalCtrl: ModalController,
              private backgroundMode: BackgroundMode,
              private toastCtrl: ToastController) {
    this.initializeApp();
    firebase.initializeApp(FIREBASE_CREDENTIALS);
    this.nativeStorage.getItem('nick').then(data => {
            this.nick = data;
            this.nav.setRoot('nivel',{nick:data});
            this.logou = true;
          },
          error => {
            this.rootPage = 'HomePage';
            this.nick = null;
    });

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Ranking', component: 'ranking', icone:'md-podium' }

    ];

  }

  backButton(){
    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
          if(this.voltar == false){
            let toast = this.toastCtrl.create({
              message:"pressione o botão voltar mais uma vez para sair do aplicativo",
              duration:3000
            });
            this.voltar = true;
            toast.present();
            setTimeout(() => {
              this.voltar = false;
            }, 3000);
          }else{
            this.backgroundMode.moveToBackground();
          }
      });
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      if (this.platform.is('android')) {
          this.statusBar.styleBlackOpaque();
      }
    });
  }

  openPage(page) {
    let modal = this.modalCtrl.create(page.component);
    modal.onDidDismiss(data => {
      this.backButton();
    });
    modal.present();
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
  }
}
