import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
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
  
  public nickForm: FormGroup;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              formBuilder: FormBuilder,
              private nativePageTransitions: NativePageTransitions,
              public splashScreen: SplashScreen,
              private alertCtrl: AlertController) {
              this.splashScreen.hide();
              this.nickForm = formBuilder.group({
                nick: ["",
                    Validators.compose([Validators.maxLength(50), Validators.required])
                    ]
              });
  }

  FlipPage() {
    let options: NativeTransitionOptions = {
      direction:'up',
      duration: 600
    }
    if (this.nickForm.valid) {
      this.nativePageTransitions.flip(options);
      this.navCtrl.setRoot('nivel',{nick:this.nickForm.value.nick});
    }else{
      let alert = this.alertCtrl.create({
        title:"Nickname inválido",
        buttons:["OK"]
      });
      alert.present();
    }
  }

  /*
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
  */

}
