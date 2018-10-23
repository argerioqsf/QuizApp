import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { SplashScreen } from '@ionic-native/splash-screen';
/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name:'HomePage'
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private nativePageTransitions: NativePageTransitions,
              public splashScreen: SplashScreen) {
              this.splashScreen.hide();
  }

  SlidePage() {
    let options: NativeTransitionOptions = {
      direction:'left',
      duration: 400,
      slowdownfactor: -1,
      iosdelay:50
    }
    this.nativePageTransitions.slide(options);
    this.navCtrl.setRoot('ranking');
  }

  FlipPage() {
    let options: NativeTransitionOptions = {
      direction:'up',
      duration: 600
    }
    this.nativePageTransitions.flip(options);
    this.navCtrl.push('ranking');
  }

  FadePage() {
    this.nativePageTransitions.fade(null);
    this.navCtrl.setRoot('ranking');
  }

  DrawerPage() {
    let options: NativeTransitionOptions = {
      direction:'left',
      duration: 600
    }
    this.nativePageTransitions.drawer(options);
    this.navCtrl.setRoot('ranking');
  }

}
