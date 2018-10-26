import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ViewController, AlertController, Button, LoadingController } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';

/**
 * Generated class for the PerguntasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name:"perguntas"
})
@Component({
  selector: 'page-perguntas',
  templateUrl: 'perguntas.html',
})
export class PerguntasPage {
  nivel = null;
  iniciado = false;
  nick = null;
  userInfo = null;
  perguntas = [];
  pergunta:any = [];
  tempo = 30;
  pontos = 0;
  botao = "COMEÇAR";
  loading:any;
  ok = false;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private platform: Platform,
              private viewCtrl:ViewController,
              private firebaseProvider: FirebaseProvider,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController) {
    this.platform.registerBackButtonAction(() => {
      this.viewCtrl.dismiss();
    });
    this.navparams();
    this.loading = this.loadingCtrl.create({
      spinner: 'ios',
      duration: 30000
    });
    this.loading.present();
    this.loading.onDidDismiss(() => {
      console.log('Ok : ',this.ok);
      if(this.ok == false){
        let alert = this.alertCtrl.create({
          title:"Houve um erro na comunicação com o servidor",
          subTitle:"verifique sua internet",
        });
        alert.present();
        this.viewCtrl.dismiss();
      }
      if(this.ok == true){
        }
      });
  }

  navparams(){
    this.nivel = this.navParams.get("nivel");
    this.nick = this.navParams.get("nick");
    this.userOn();
  }

  userOn(){
    this.firebaseProvider.refOff("jogadores/"+this.nick);
    console.log("nick: ",this.nick);
    if(this.nick != null){
      this.firebaseProvider.refOn("jogadores/"+this.nick).on("value",user=>{
        console.log("user: ",user.val());
        this.userInfo = user.val();
        this.pontos = user.val().pontos;
        console.log("infoUser: ",this.userInfo);
        this.Perguntas();
      },error=>{
        this.loading.dismiss();
      });
    }else{
      this.navparams();
    }
  }

  Perguntas(){
    this.firebaseProvider.refOff("perguntas/");
    this.firebaseProvider.refOn("perguntas/").orderByChild("nivel").equalTo(this.nivel).on("value",perguntasSnap=>{
      this.perguntas = [];
      this.pergunta = [];
      console.log("perguntasSnap: ",perguntasSnap.val());
      if(perguntasSnap.val()){
        if(this.userInfo.respondidos) {
          console.log("userInfo.respondidos: ",this.userInfo.respondidos);
          this.firebaseProvider.TransformList(perguntasSnap).then((perguntas:any)=>{
            console.log("perguntas1: ",perguntas);
            this.firebaseProvider.list("jogadores/"+this.userInfo.nick+"/respondidos").then((respondidos:any)=>{
              console.log("respondidos: ",respondidos);
            for (let i = 0; i < perguntas.length; i++) {
              for (let j = 0; j < respondidos.length; j++) {
                if (perguntas[i].id == respondidos[j].id) {
                  console.log("pergunta já respondida: ",perguntas[i]);
                  console.log("perguntas2: ",this.perguntas);
                  break;
                }
                if(j == respondidos.length-1){
                  this.perguntas.push(perguntas[i]);
                  if (this.perguntas.length != 0) {
                    this.pergunta = this.perguntas[0];
                    console.log("pergunta: ",this.pergunta);
                  }
                  console.log("perguntas3: ",this.perguntas);
                }
              }
              if(i == perguntas.length-1){
                this.ok = true;
                this.loading.dismiss();
              }
            }
          });
          });
        }else{
          this.firebaseProvider.TransformList(perguntasSnap).then((perguntas:any)=>{
            this.perguntas = perguntas;
            if (this.perguntas.length != 0) {
              this.pergunta = this.perguntas[0];
              console.log("pergunta5: ",this.pergunta);
            }
            this.ok = true;
            this.loading.dismiss();
            console.log("perguntas4: ",this.perguntas);
          });
        }
      }else{
        this.ok = true;
        this.loading.dismiss();
        console.log("nao tem perguntas "+ this.nivel);
      }
    });
  }

  voltar(){
    this.viewCtrl.dismiss();
  }

  contagem(){
    let that = this;
    setTimeout(() => {
      if(that.iniciado == true){
        that.tempo = that.tempo - 1;
        if (that.tempo <= 0) {
          if(that.iniciado == true){
            that.FimTempo();
          }
        }else{
          that.contagem();
        }
      }else{
        that.tempo = 30;
      }
    }, 1000);
  }

  ionViewDidLeave(){
    this.firebaseProvider.refOff("perguntas/");
    this.iniciado = false;
    this.botao = "COMEÇAR";
    this.tempo = 30;
	}

  comecar(){
    this.iniciado = true;
    this.tempo = 30;
    this.contagem();
    // if (this.perguntas.length != 0) {
    //   this.pergunta = this.perguntas[0];
    //   console.log("pergunta: ",this.pergunta);
    // }
  }

  FimTempo(){
    console.log("pergunta: ",this.pergunta);
    this.firebaseProvider.set("jogadores/"+this.nick+"/respondidos/"+this.pergunta.id,{
      id:this.pergunta.id,
      status:"errada"
    }).then(()=>{
      let alert = this.alertCtrl.create({
        title:"Seu tempo acabou :(",
        buttons:["OK"]
      });
      alert.present();
      this.botao = "PRÓXIMO";
      this.iniciado = false;
      this.tempo = 30;
    },error=>{
      let alert = this.alertCtrl.create({
        title:"Erro de comunicação com o servidor",
        subTitle:"verifique sua internet",
        buttons:["OK"]
      });
      alert.present();
      this.iniciado = false;
      this.botao = "COMEÇAR";
      this.tempo = 30;
    });
  }

  responder(letra){
    this.iniciado = false;
    let loading = this.loadingCtrl.create({
      spinner: 'ios',
      duration: 30000
    });
    loading.present();
    let ok = false;
    if(letra == this.pergunta.resposta){
      this.firebaseProvider.set("jogadores/"+this.nick+"/respondidos/"+this.pergunta.id,{
        id:this.pergunta.id,
        status:"certa"
      }).then(()=>{
        this.firebaseProvider.refOn("jogadores/"+this.nick+"/pontos").once("value",ponto=>{
          console.log("nivel: ",this.nivel);
          let pontos;
          if (this.nivel == "fácil") {
            pontos = ponto.val() + 1;
          }
          if (this.nivel == "médio") {
            pontos = ponto.val() + 2;
          }
          if (this.nivel == "difícil") {
            pontos = ponto.val() + 3;
          }

          this.firebaseProvider.update("jogadores/"+this.nick,{pontos:pontos}).then(()=>{
            let alert = this.alertCtrl.create({
              title:"Parabéns você acertou!!",
              buttons:["OK"]
            });
            alert.present();
            this.botao = "PRÓXIMO";
            this.iniciado = false;
            ok = true;
            loading.dismiss();
          });
        });
      },error=>{
        let alert = this.alertCtrl.create({
          title:"Erro de comunicação com o servidor",
          subTitle:"verifique sua internet",
          buttons:["OK"]
        });
        alert.present();
        this.iniciado = false;
        loading.dismiss();
      });

    }else{
      this.firebaseProvider.set("jogadores/"+this.nick+"/respondidos/"+this.pergunta.id,{
        id:this.pergunta.id,
        status:"errada"
      }).then(()=>{
        let alert = this.alertCtrl.create({
          title:"Você errou :(",
          buttons:["OK"]
        });
        alert.present();
        this.botao = "PRÓXIMO";
        this.iniciado = false;
        ok = true;
        loading.dismiss();
      },error=>{
        let alert = this.alertCtrl.create({
          title:"Erro de comunicação com o servidor",
          subTitle:"verifique sua internet",
          buttons:["OK"]
        });
        alert.present();
        this.iniciado = false;
        loading.dismiss();
      });
    }

    
    loading.onDidDismiss(() => {
      console.log('Ok : ',ok);
      if(ok == false){
        let alert = this.alertCtrl.create({
          title:"Houve um erro na comunicação com o servidor",
          subTitle:"verifique sua internet",
        });
        alert.present();
      }
      if(ok == true){
        }
      });
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad PerguntasPage');
  }

}
