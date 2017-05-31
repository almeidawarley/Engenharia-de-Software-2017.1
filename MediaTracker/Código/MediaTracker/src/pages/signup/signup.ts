import {Component, ElementRef, ViewChild} from "@angular/core";
import {NavController} from "ionic-angular";
import {Events} from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignUpPage {

  signUpForm: FormGroup;

  showError: boolean = false;
  errorMessage: string;

  loading: any;

  @ViewChild("input")
  inputElement: ElementRef;

  @ViewChild("image")
  imageElement: ElementRef;

  imageEncoded: any;

  constructor(public navCtrl: NavController, public events: Events, public afAuth: AngularFireAuth,
               public formBuilder: FormBuilder, public loadingCtrl: LoadingController, public afDb: AngularFireDatabase) {
    this.signUpForm = formBuilder.group({
      signUpApelido: ['', Validators.compose([Validators.minLength(3), Validators.required])],
      signUpNome: ['', Validators.compose([Validators.minLength(3), Validators.required])],
      signUpPassword: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      signUpEmail: ['', Validators.compose([Validators.pattern('(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$)'), Validators.required])],
      signUpSex: ['', Validators.compose([Validators.required])],
      signUpDate: ['', Validators.compose([Validators.required])]
    });
  }

  validate() {
    if (this.signUpForm.valid) {
      this.showError = false;
      return true;
    } else {
      this.showError = true;
      this.errorMessage = 'Por favor preencha os campos corretamente.';
      return false;
    }
  }

  signUp() {
    if (this.validate()) {
      let apelido = this.signUpForm.controls.signUpApelido.value;
      let nome = this.signUpForm.controls.signUpNome.value;
      let password = this.signUpForm.controls.signUpPassword.value;
      let email = this.signUpForm.controls.signUpEmail.value;
      let sexo = this.signUpForm.controls.signUpSex.value;
      let data = this.signUpForm.controls.signUpDate.value;
      let image = this.imageEncoded;

      this.showLoading();

      let self = this;

      this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(function(user) {
        if (user) {
          user.getIdToken()
          .then(function(token) {
            let ref = self.afDb.object('/users/' + user.uid);
            ref.set({apelido: apelido, nome: nome, email: email, sexo: sexo, data: data, image: image})
            .then(function() {
              self.hideLoading();
              self.callLoginPage();
            });
          });
        }
      }).catch(function(error) {
        self.hideLoading();
        let errorCode = error['code'];
        if (errorCode === 'auth/email-already-in-use') {
          self.showError = true;
          self.errorMessage = 'Esse e-mail já está cadastrado.';
        }
      });
    }
  }

  callLoginPage() {
    this.events.publish('callHomePage');
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
