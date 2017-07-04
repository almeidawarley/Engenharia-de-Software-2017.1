import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {Events} from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'page-genero',
  templateUrl: 'genero.html'
})
export class GeneroPage {

  generoForm: FormGroup;

  showError: boolean = false;
  errorMessage: string;

  loading: any;

  showSubmited: boolean = true;

  items: FirebaseListObservable<any>;
  currentlyItem : any;
  showCurrentlyItem: boolean = false;

  constructor(public navCtrl: NavController, public events: Events, public formBuilder: FormBuilder,
                 public loadingCtrl: LoadingController, public afDb: AngularFireDatabase) {
    this.generoForm = formBuilder.group({
      generoNome: ['', Validators.compose([Validators.minLength(3), Validators.required])],
      generoDescricao: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });
    this.items = this.afDb.list('/generos/', {
      query: {
        orderByChild: 'accepted',
        equalTo: true
      }
    });
  }

  validate() {
    if (this.generoForm.valid) {
      this.showError = false;
      return true;
    } else {
      this.showError = true;
      this.errorMessage = 'Por favor preencha os campos corretamente.';
      return false;
    }
  }

  submit() {
    if (this.validate()) {
      let nome = this.generoForm.controls.generoNome.value;
      let descricao = this.generoForm.controls.generoDescricao.value;

      this.showLoading();
      let codigo = nome.substring(0, 3).toUpperCase();
      let self = this;
      let ref = self.afDb.object('/generos/' + codigo);
      ref.set({codigo: codigo, nome: nome, descricao: descricao, accepted: false})
      .then(function() {
        self.hideLoading();
        self.showSubmited = true;
      }).catch(function(error) {
        self.showSubmited = true;
        self.hideLoading();
      });
    }
  }

  callRegisterPage(){
    this.showSubmited = false;
  }

  callSubmitedPage(){
    this.showSubmited = true;
  }

  callHomePage() {
    this.events.publish('callPerfilPage');
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Aguarde...'
    });
    this.loading.present();
  }

  hideLoading() {
    this.loading.dismiss();
  }

  selectItem(item){
    if(item == this.currentlyItem){
      this.showCurrentlyItem = false;
      this.currentlyItem = 0;
    }else{
      this.currentlyItem = item;
      this.showCurrentlyItem = true;
    }    
  }

  isSelected(item){
    if(item == this.currentlyItem){
      return true;
    }else{
      return false;
    }
  }
}
