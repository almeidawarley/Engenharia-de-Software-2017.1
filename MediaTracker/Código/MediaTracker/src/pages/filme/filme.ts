import {Component, ElementRef, ViewChild} from "@angular/core";
import {NavController} from "ionic-angular";
import {Events} from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'page-filme',
  templateUrl: 'filme.html'
})
export class FilmePage {

  filmeForm: FormGroup;

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
    this.filmeForm = formBuilder.group({
      filmeTitulo: ['', Validators.compose([Validators.minLength(3), Validators.required])],
      filmeSinopse: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      filmeDuracao: ['', Validators.required],
      filmeAno: ['', Validators.required],
      filmeGeneros: [''],
      filmeTags: ['']
    });
    this.items = this.afDb.list('/filmes/');
    this.generos = this.afDb.list('/generos/');
    this.tags = this.afDb.list('/tags/');
  }

  validate() {
    if (this.filmeForm.valid) {
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
      let titulo = this.filmeForm.controls.filmeTitulo.value;
      let sinopse = this.filmeForm.controls.filmeSinopse.value;
      let image = this.imageEncoded;
      let ano = this.filmeForm.controls.filmeAno.value;
      let duracao = this.filmeForm.controls.filmeDuracao.value;
      let generos = this.filmeForm.controls.filmeGeneros.value;
      let tags = this.filmeForm.controls.filmeTags.value;

      let numeroNotas = 0;
      let somaNotas = 0;

      this.showLoading();
      let codigo = titulo.substring(3, 9).toUpperCase() + sinopse.substring(0,3).toUpperCase();
      let self = this;
      let ref = self.afDb.object('/filmes/' + codigo);
      ref.set({codigo: codigo, titulo: titulo, sinopse: sinopse, duracao: duracao, ano: ano, 
        image: image, numeroNotas: numeroNotas, somaNotas: somaNotas, generos: generos, tags: tags})
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
