
import { Injectable } from '@angular/core';
import firebase from 'firebase';

/*
  Generated class for the FirebaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirebaseProvider {

  constructor() {
    console.log('Hello FirebaseProvider Provider');
  }

  refOn(path){
    return firebase.database().ref(path);
  }
  refOff(path){
    return firebase.database().ref(path).off();
  }

  TransformList(result){
    return new Promise((resolve, reject)=>{
			  let list = [];
				result.forEach(element => {
					list.push(element.val());
        });
        //console.log("result/TransformList: ",list);
				resolve(list);
		});
  }

  list(path){ 
    return new Promise((resolve, reject)=>{
			let list = [];
			firebase.database().ref(path).once("value",userProfileSnapshot=>{
				let result = userProfileSnapshot;
				result.forEach(element => {
					list.push(element.val());
        });
        //console.log("result/list: ",list);
				resolve(list);
			},error=>{
        console.log("Erro/list: ",error);
				resolve("Erro");
			});
		  });
  }

  update(path,data){
      return firebase.database().ref(path).update(data);
  }
  set(path,valor){
    return firebase.database().ref(path).set(valor);
  }
  push(path,valor){
    return firebase.database().ref(path).push(valor);
  }
  delete(path){ 
    return firebase.database().ref(path).remove();
  }

  inverteArray(array){
    return new Promise((resolve,reject)=>{
      let result = [];
      for (let i = array.length - 1; i >= 0 ; i--) {
        result.push(array[i]);
      }
      resolve(result);
    });
  }

  fila(){
		let ano:any = new Date().getFullYear();
		let mes:any = new Date().getMonth() + 1;
		let dia:any = new Date().getDate();
		let horas:any = new Date().getHours();
		let minutos:any = new Date().getMinutes();
		let segundos:any = new Date().getSeconds();
		
			if(mes < 10){
				mes = "0" + mes;
			}
			if(dia < 10){
				dia = "0" + dia;
			}
			if(horas < 10){
				horas = "0" + horas;
			}
			if(minutos < 10){
				minutos = "0" + minutos;
			}
			if(segundos < 10){
				segundos = "0" + segundos;
			}
		
    let dataNow:any = ano +""+mes+""+dia+""+horas +""+ minutos+""+segundos;
    dataNow = parseInt(dataNow);
		return dataNow;
  }

}
