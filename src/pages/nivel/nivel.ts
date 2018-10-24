import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FirebaseProvider } from '../../providers/firebase/firebase';

/**
 * Generated class for the NivelPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name:'nivel'
})
@Component({
  selector: 'page-nivel',
  templateUrl: 'nivel.html',
})
export class NivelPage {
  nick = null;
  niveis = [];
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public splashScreen: SplashScreen,
              private firebaseProvider: FirebaseProvider) { 
    this.splashScreen.hide();
    this.nick = navParams.get("nick");
    console.log("nick: ",this.nick);
    this.Niveis();
  }

  Niveis(){
    this.firebaseProvider.refOff("config/niveis");
    this.firebaseProvider.refOn("config/niveis").on("value",niveis=>{
      console.log("niveisSnap: ",niveis.val());
      this.niveis = niveis.val();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NivelPage');
  }

}
