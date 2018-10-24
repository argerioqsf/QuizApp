import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import firebase from 'firebase';
import { FIREBASE_CREDENTIALS } from './credentials_firebase';
import { NativeStorage } from '@ionic-native/native-storage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{title: string, component: any,icone: any}>;
  nick = null;
  constructor(public platform: Platform, 
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen,
              private nativeStorage: NativeStorage) {
    this.initializeApp();
    firebase.initializeApp(FIREBASE_CREDENTIALS);
    this.nativeStorage.getItem('nick').then(data => {
            this.nick = data;
            this.nav.setRoot('nivel',{nick:data});
          },
          error => {
            this.rootPage = 'HomePage';
            this.nick = null;
    });

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: 'HomePage', icone:'home' },
      { title: 'Ranking', component: 'ranking', icone:'md-podium' }

    ];

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
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
