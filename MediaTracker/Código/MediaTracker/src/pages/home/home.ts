import {Component} from "@angular/core";

import {NavController, MenuController, Events, LoadingController} from "ionic-angular";

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

	loginForm: FormGroup;

	showError: boolean = false;
	errorMessage: string;

  loading: any;

  constructor(public navCtrl: NavController, public events: Events, public afAuth: AngularFireAuth,
  						 public formBuilder: FormBuilder, public loadingCtrl: LoadingController, public menuCtrl: MenuController) {
    this.menuCtrl.get().enable(false);

  	this.loginForm = formBuilder.group({
  		loginEmail: ['', Validators.compose([Validators.pattern('(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$)'), Validators.required])],
  		loginPassword: ['', Validators.compose([Validators.minLength(6), Validators.required])]
  	});
  }

  validate() {
  	if (this.loginForm.valid) {
  		this.showError = false;
  		return true;
  	} else {
  		this.showError = true;
  		this.errorMessage = 'Por favor preencha os campos corretamente.';
  		return false;
  	}
  }

  login() {
  	if (this.validate()) {
  		let email = this.loginForm.controls.loginEmail.value;
  		let password = this.loginForm.controls.loginPassword.value;
  		
  		this.showLoading();

  		let self = this;

  		this.afAuth.auth.signInWithEmailAndPassword(email, password)
  			.then(function(user) {
  				self.hideLoading();
  				if (user) {
            self.menuCtrl.get().enable(true);
  					self.events.publish('callPerfilPage');
  				}
  			}).catch(function(error) {
  				self.hideLoading();
  				let errorCode = error['code'];
  				if (errorCode === 'auth/user-not-found') {
  					self.showError = true;
  					self.errorMessage = 'Nenhum usuário cadastrado com esse e-mail.';
  				} else if (errorCode === 'auth/wrong-password') {
  					self.showError = true;
  					self.errorMessage = 'Senha incorreta.';
  				}
  			});
  	}
  }

  callSignUpPage() {
  	this.events.publish('callSignUpPage');
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

}
