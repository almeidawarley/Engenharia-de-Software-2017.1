import {Component, ElementRef, ViewChild} from "@angular/core";
import {NavController} from "ionic-angular";
import {Events} from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'page-livro',
  templateUrl: 'livro.html'
})
export class LivroPage {

  livroForm: FormGroup;

  showError: boolean = false;
  errorMessage: string;

  loading: any;

  showSubmited: boolean = true;

  items: FirebaseListObservable<any>;
  currentlyItem : any;
  showCurrentlyItem: boolean = false;

  @ViewChild("input")
  inputElement: ElementRef;

  @ViewChild("image")
  imageElement: ElementRef;

  imageEncoded: any;

  generos: FirebaseListObservable<any>;
  tags: FirebaseListObservable<any>;

  listaGeneros: string[];
  listaTags: string[];

  constructor(public navCtrl: NavController, public events: Events, public afAuth: AngularFireAuth,
               public formBuilder: FormBuilder, public loadingCtrl: LoadingController, public afDb: AngularFireDatabase) {
    this.livroForm = formBuilder.group({
      livroTitulo: ['', Validators.compose([Validators.minLength(3), Validators.required])],
      livroSinopse: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      livroIdioma: ['', Validators.compose([Validators.minLength(3), Validators.required])],
      livroISBN: ['', Validators.compose([Validators.minLength(13), Validators.required])],
      livroGeneros: [''],
      livroTags: ['']
    });
    this.items = this.afDb.list('/livros/', {
      query: {
        orderByChild: 'accepted',
        equalTo: true
      }
    });
    this.generos = this.afDb.list('/generos/');
    this.tags = this.afDb.list('/tags/');
  }

  validate() {
    if (this.livroForm.valid) {
      this.showError = false;
      return true;
    } else {
      this.showError = true;
      this.errorMessage = 'Por favor preencha os campos corretamente';
      return false;
    }
  }

  submit() {
    if (this.validate()) {
      let titulo = this.livroForm.controls.livroTitulo.value;
      let sinopse = this.livroForm.controls.livroSinopse.value;
      let idioma = this.livroForm.controls.livroIdioma.value;
      let image = this.imageEncoded;
      let isbn = this.livroForm.controls.livroISBN.value;
      let generos = this.livroForm.controls.livroGeneros.value;
      let tags = this.livroForm.controls.livroTags.value;

      let numeroNotas = 0;
      let somaNotas = 0;

      this.showLoading();
      let codigo = titulo.substring(3, 9).toUpperCase() + sinopse.substring(0,3).toUpperCase();
      let self = this;
      let ref = self.afDb.object('/livros/' + codigo);
      ref.set({codigo: codigo, titulo: titulo, sinopse: sinopse, idioma: idioma, isbn: isbn, 
        image: image, numeroNotas: numeroNotas, somaNotas: somaNotas, generos: generos, tags: tags, accepted: false})
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
      this.listaGeneros = this.currentlyItem.generos.toString().split(',');
      this.listaTags = this.currentlyItem.tags.toString().split(',');
    }    
  }

  isSelected(item){
    if(item == this.currentlyItem){
      return true;
    }else{
      return false;
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

  lookForMedia(){
    if(this.currentlyItem.numeroNotas == 0)
      return 0;
    else
      return (this.currentlyItem.somaNotas/this.currentlyItem.numeroNotas);
  }

  imageUploaded(event: Event) {
    let file = this.inputElement.nativeElement.files[0];
    let img = this.imageElement.nativeElement;
    let reader = new FileReader();

    let self = this;

    reader.addEventListener('load', function() {
      img.src = reader.result;
      self.imageEncoded = reader.result;
    }, false);
    reader.readAsDataURL(file);
  }
}
