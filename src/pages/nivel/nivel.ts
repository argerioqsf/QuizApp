import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController, Platform, ToastController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { BackgroundMode } from '@ionic-native/background-mode';

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
  niveis = null;
  voltar = false;
  pontos = 0;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public splashScreen: SplashScreen,
              private firebaseProvider: FirebaseProvider,
              private modalCtrl: ModalController,
              private platform: Platform,
              private viewCtrl:ViewController,
              private backgroundMode: BackgroundMode,
              private toastCtrl: ToastController) {
                
    this.backButton();
    this.splashScreen.hide();
    this.Niveis();
    this.navparams();
  }

  navparams(){
    this.nick = this.navParams.get("nick");
    this.userOn();
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

  userOn(){
    console.log("nick: ",this.nick);
    if(this.nick != null){
      this.firebaseProvider.refOff("jogadores/"+this.nick);
      this.firebaseProvider.refOn("jogadores/"+this.nick).on("value",user=>{
        console.log("user: ",user.val());
        this.pontos = user.val().pontos;
      });
    }else{
      this.navparams();
    }
  }

  Niveis(){
    this.firebaseProvider.refOff("config/niveis");
    this.firebaseProvider.refOn("config/niveis").on("value",niveis=>{
      console.log("niveisSnap: ",niveis.val());
      this.niveis = niveis.val();
    });
  }

  perguntas(nivel){
    console.log("nick: ",this.nick);
    let modal = this.modalCtrl.create("perguntas",{nivel:nivel,nick:this.nick});
    modal.onDidDismiss(data => {
      this.backButton();
      this.userOn();
    });
    modal.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NivelPage');
  }

}
