import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Platform, ViewController, ToastController } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NativeStorage } from '@ionic-native/native-storage';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { BackgroundMode } from '@ionic-native/background-mode';
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
  
  voltar = false;
  public nickForm: FormGroup;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              formBuilder: FormBuilder,
              private nativePageTransitions: NativePageTransitions,
              public splashScreen: SplashScreen,
              private alertCtrl: AlertController,
              private nativeStorage: NativeStorage,
              private firebaseProvider: FirebaseProvider,
              private loadingCtrl: LoadingController,
              private platform: Platform,
              private viewCtrl:ViewController,
              private backgroundMode: BackgroundMode,
              private toastCtrl: ToastController) {
              this.splashScreen.hide();
              this.nickForm = formBuilder.group({
                nick: ["",
                    Validators.compose([Validators.maxLength(50), Validators.required])
                    ]
              });
              this.backButton();
  }

  FlipPage() {
    let loading = this.loadingCtrl.create({
      spinner: 'ios',
      duration: 30000
    });
    loading.present();
    let ok = false;
    if (this.nickForm.valid) {
      let options: NativeTransitionOptions = {
        direction:'up',
        duration: 600
      }
      console.log("nick:",this.nickForm.value.nick);
      this.firebaseProvider.refOn("jogadores/").orderByChild('nick').equalTo(this.nickForm.value.nick).once("value",(nick:any)=>{
        console.log("status nick");
        console.log("status nick:",nick);
        console.log("status nick:",nick.val());
        if (nick.val()) {
          let alert = this.alertCtrl.create({
            title:"Já estão utilizando este nickname, escolha outro",
            buttons:["OK"]
          });
          alert.present();
          loading.dismiss();
        }else{
          this.nativeStorage.setItem('nick', this.nickForm.value.nick).then(() => {
            this.firebaseProvider.set("jogadores/"+this.nickForm.value.nick,{ 
              nick:this.nickForm.value.nick,
              pontos:0
            }).then(()=>{
              ok = true;
              loading.dismiss();
              this.nativePageTransitions.flip(options);
              this.navCtrl.setRoot('nivel',{nick:this.nickForm.value.nick});
            },error=>{
              loading.dismiss();
              let alert = this.alertCtrl.create({
                title:"Erro inesperado, tente novamente",
                buttons:["OK"]
              });
              alert.present();
            });
          },error => {
            loading.dismiss();
            let alert = this.alertCtrl.create({
              title:"Erro inesperado, tente novamente",
              buttons:["OK"]
            });
            alert.present();
          });
        }
      });
    }else{
      loading.dismiss();
      let alert = this.alertCtrl.create({
        title:"Nickname inválido",
        buttons:["OK"]
      });
      alert.present();
    }
  }

  backButton(){
    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
        if(!this.viewCtrl.enableBack()) { 
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
        }else{
            this.navCtrl.pop();
        } 
      });
    });
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
