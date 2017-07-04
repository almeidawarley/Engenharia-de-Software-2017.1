import {Component, ElementRef, ViewChild} from "@angular/core";
import {NavController} from "ionic-angular";
import {Events} from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'page-episodio',
  templateUrl: 'episodio.html'
})
export class EpisodioPage {

  episodioForm: FormGroup;
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
    this.episodioForm = formBuilder.group({
      episodioTitulo: ['', Validators.compose([Validators.minLength(3), Validators.required])],
      episodioSinopse: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      episodioDuracao: ['', Validators.required],
      episodioData: ['', Validators.required],
      episodioGeneros: [''],
      episodioTags: ['']
    });

    this.commentForm = formBuilder.group({
      commentTexto: ['', Validators.compose([Validators.required])],
      commentNota: ['', Validators.compose([Validators.required])]
    });

    this.items = this.afDb.list('/episodios/');
    this.generos = this.afDb.list('/generos/');
    this.tags = this.afDb.list('/tags/');
  }

  validate() {
    if (this.episodioForm.valid) {
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
      let titulo = this.episodioForm.controls.episodioTitulo.value;
      let sinopse = this.episodioForm.controls.episodioSinopse.value;
      let image = this.imageEncoded;
      let data = this.episodioForm.controls.episodioData.value;
      let duracao = this.episodioForm.controls.episodioDuracao.value;
      let generos = this.episodioForm.controls.episodioGeneros.value;
      let tags = this.episodioForm.controls.episodioTags.value;

      let numeroNotas = 0;
      let somaNotas = 0;

      this.showLoading();
      let codigo = (titulo.substring(3, 9).toUpperCase() + sinopse.substring(0,3).toUpperCase()).replace(' ', '5');
      let self = this;
      let ref = self.afDb.object('/episodios/' + codigo);
      ref.set({codigo: codigo, titulo: titulo, sinopse: sinopse, duracao: duracao, data: data, 
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
      ref = this.afDb.object('/episodios/' + this.currentlyItem.codigo);
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
          marked.push('Episódio: ' + self.currentlyItem.titulo);
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

  refresh(){
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }
}
