import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {Events} from 'ionic-angular';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { LoadingController } from 'ionic-angular';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'page-tags',
  templateUrl: 'tags.html'
})
export class TagsPage {

  tagsForm: FormGroup;

  showError: boolean = false;
  errorMessage: string;

  loading: any;

  items: FirebaseListObservable<any>;
  currentlyItem : any;
  showCurrentlyItem: boolean = false;
  showSubmited: boolean = true;

  constructor(public navCtrl: NavController, public events: Events, public formBuilder: FormBuilder,
               public loadingCtrl: LoadingController, public afDb: AngularFireDatabase) {
    this.tagsForm = formBuilder.group({
      tagNome: ['', Validators.compose([Validators.minLength(3), Validators.required])],
      tagDescricao: ['', Validators.compose([Validators.minLength(6), Validators.required])],
    });
    this.items = afDb.list('/tags');
  }

  validate() {
    if (this.tagsForm.valid) {
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
      let nome = this.tagsForm.controls.tagNome.value;
      let descricao = this.tagsForm.controls.tagDescricao.value;

      this.showLoading();

      let self = this;

      let codigo = nome.substring(0, 3).toUpperCase() + descricao.substring(descricao.length/3, descricao.length/2).toUpperCase().substring(0, 3).replace(' ', '6');

      let ref = this.afDb.object('/tags/' + codigo);
      ref.set({codigo: codigo, nome: nome, descricao: descricao})
      .then(function() {
        self.showSubmited = true;
        self.hideLoading();
      });
    }
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

  callRegisterPage(){
    this.showSubmited = false;
  }

  callSubmitedPage(){
    this.showSubmited = true;
  }

  callHomePage() {
    this.events.publish('callPerfilPage');
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
