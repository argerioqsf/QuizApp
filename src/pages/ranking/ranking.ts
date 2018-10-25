import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { FirebaseProvider } from '../../providers/firebase/firebase';


@IonicPage({
  name:'ranking'
})
@Component({
  selector: 'page-ranking',
  templateUrl: 'ranking.html',
})
export class RankingPage {
  ranking = null;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private nativePageTransitions: NativePageTransitions,
              private viewCtrl: ViewController,
              private firebaseProvider: FirebaseProvider,
              private platform: Platform) {
      this.rankingON();
      this.platform.registerBackButtonAction(() => {
        this.viewCtrl.dismiss();
      });
  }

  voltar(){
    this.viewCtrl.dismiss();
  }

  rankingON(){
    this.firebaseProvider.refOn("jogadores/").orderByChild("pontos").on("value",rankingSnap=>{
      this.firebaseProvider.TransformList(rankingSnap).then(ranking=>{
        this.firebaseProvider.inverteArray(ranking).then(rankingInvertido=>{
          this.ranking = rankingInvertido;
        })
      });
    });
  }

}
