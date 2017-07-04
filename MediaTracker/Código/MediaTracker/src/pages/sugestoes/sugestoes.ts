import {Component} from "@angular/core";
import {NavController} from "ionic-angular";

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'page-sugestoes',
  templateUrl: 'sugestoes.html'
})
export class SugestoesPage {

  showCurrentType: boolean = false;
  currentType: any;

  items: FirebaseListObservable<any>;

  showCurrentItem: boolean = false;
  currentItem: any;

  listaGeneros: string[];
  listaTags: string[];

  constructor(public navCtrl: NavController, public afDb: AngularFireDatabase) {

  }

  selectType(type){
    if(type == this.currentType){
      this.showCurrentType = false;
      this.currentType = '';
    }else{
      this.showCurrentType = true;
      this.currentType = type;
      this.refreshItems(type);
    }
    this.showCurrentItem = false;
    this.currentItem = 0;
  }

  isTypeSelected(type){
    if(type == this.currentType){
      return true;
    }else{
      return false;
    }
  }

  selectItem(item){
    if(item == this.currentItem){
      this.showCurrentItem = false;
      this.currentItem = 0;
    }else{
      this.showCurrentItem = true;
      this.currentItem = item;
      if (this.currentType == 'Livros' || this.currentType == 'Episódios' || this.currentType == 'Filmes') {
        this.listaGeneros = this.currentItem.generos.toString().split(',');
        this.listaTags = this.currentItem.tags.toString().split(',');
      }
    }
  }

  isItemSelected(item){
    if(item == this.currentItem){
      return true;
    }else{
      return false;
    }
  }

  refreshItems(type) {
    switch(type) {
      case "Tags":
        this.items = this.afDb.list('/tags', {
          query: {
            orderByChild: 'accepted',
            equalTo: false
          }
        });
        break;
      case "Gêneros":
        this.items = this.afDb.list('/generos', {
          query: {
            orderByChild: 'accepted',
            equalTo: false
          }
        });
        break;
      case "Livros":
        this.items = this.afDb.list('/livros', {
          query: {
            orderByChild: 'accepted',
            equalTo: false
          }
        });
        break;
      case "Episódios":
        this.items = this.afDb.list('/episodios', {
          query: {
            orderByChild: 'accepted',
            equalTo: false
          }
        });
        break;
      case "Filmes":
        this.items = this.afDb.list('/filmes', {
          query: {
            orderByChild: 'accepted',
            equalTo: false
          }
        });
        break;
    }
  }

  lookForGenero(codigo){
    let ref = this.afDb.object('/generos/' + codigo);
    let answer = "Não encontrado";
    ref.subscribe(function(userData) {
      answer = userData['nome'];
    });
    return answer;
  }

  lookForTag(codigo){
    let ref = this.afDb.object('/tags/' + codigo);
    let answer = "Não encontrado";
    ref.subscribe(function(userData) {
      answer = userData['nome'];
    });
    return answer;
  }

  acceptCurrentItem() {
    if (this.currentItem != 0) {
      this.items.update(this.currentItem.codigo, {accepted: true});
      this.showCurrentItem = false;
      this.currentItem = 0;
    }
  }

  rejectCurrentItem() {
    if (this.currentItem != 0) {
      this.items.remove(this.currentItem.codigo);
      this.showCurrentItem = false;
      this.currentItem = 0;
    }
  }

}