import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.nick = navParams.get("nick");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NivelPage');
  }

}