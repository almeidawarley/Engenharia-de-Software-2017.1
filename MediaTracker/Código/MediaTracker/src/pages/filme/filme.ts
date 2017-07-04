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
  commentForm: FormGroup;

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
  listaComentarios: string[];

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

    this.commentForm = formBuilder.group({
      commentTexto: ['', Validators.compose([Validators.required])],
      commentNota: ['', Validators.compose([Validators.required])]
    });

    this.items = this.afDb.list('/filmes/', {
      query: {
        orderByChild: 'accepted',
        equalTo: true
      }
    });
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

  validateComment(){
    if(this.commentForm.valid){
      this.showError = false;
      return true;
    }else{
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

  refresh(){
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
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
      if(this.currentlyItem.comentarios != null)
        this.listaComentarios = this.currentlyItem.comentarios.toString().split(',');
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

  addComment(){
    if(this.validateComment()){
      let ref;
      let self = this;
      let texto = this.commentForm.controls.commentTexto.value;
      let nota = this.commentForm.controls.commentNota.value;
      this.showLoading();
      let comentarios = this.currentlyItem.comentarios;
      if(comentarios == null)
        comentarios = [];
      comentarios.push(texto);
      let numeroNotas:number = Number(this.currentlyItem.numeroNotas) + 1;
      let somaNotas:number = Number(this.currentlyItem.somaNotas) + Number(nota);
      ref = this.afDb.object('/filmes/' + this.currentlyItem.codigo);
      ref.update({numeroNotas: numeroNotas, somaNotas: somaNotas, comentarios:comentarios}).then(function(){
          self.hideLoading();
        });
      this.refresh();      
    }
  }

  mark(){
    if(this.currentlyItem != null){
      this.showLoading();
      let self = this;
      let user = this.afAuth.auth.currentUser;
      let ref = self.afDb.object('/users/' + user.uid);
      let marked;
      ref.subscribe(function(userData){
        marked = userData['marked'];
      });
      if(marked == null)
          marked = [];
        if(this.check(marked))
          marked.push('Filme: ' + self.currentlyItem.titulo);
        ref.update({marked:marked});
        self.hideLoading();
    }else{
      this.showError = true;
      this.errorMessage = 'Selecione uma mídia para marcar';    
    }
  }

  check(marcados){
    let comentarios = marcados.toString().split(',');
    for(let c of comentarios){
      if(this.currentlyItem !=null && c == this.currentlyItem.titulo)
        return false;
    }
    return true;
  }
}
