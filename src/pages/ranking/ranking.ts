import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';


@IonicPage({
  name:'ranking'
})
@Component({
  selector: 'page-ranking',
  templateUrl: 'ranking.html',
})
export class RankingPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private nativePageTransitions: NativePageTransitions) {
  }

  Voltar() {
    if (this.navCtrl.canGoBack()){
      let options: NativeTransitionOptions = {
        direction:'down',
        duration: 500,
        slowdownfactor: -1,
        slidePixels:20
      }
      this.nativePageTransitions.slide(options);
      this.navCtrl.pop();
    }else{
      let options: NativeTransitionOptions = {
        direction:'right',
        duration: 600
      }
      this.nativePageTransitions.drawer(options);
      this.navCtrl.setRoot('HomePage')
    }
  }

}
