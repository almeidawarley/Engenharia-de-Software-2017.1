import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {Events} from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

	loginForm: FormGroup;

	showError: boolean = false;
	errorMessage: string;

  loading: any;

  constructor(public navCtrl: NavController, public events: Events, public afAuth: AngularFireAuth,
  						 public formBuilder: FormBuilder, public loadingCtrl: LoadingController) {
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

  signIn(email, password) {
  	this.showLoading();

  	let self = this;

  	this.afAuth.auth.signInWithEmailAndPassword(email, password)
  		.then(function(user) {
  			self.hideLoading();
  			if (user) {
  				self.events.publish('user:loggedIn');
  			}
  		}).catch(function(error) {
  			self.hideLoading();
  			let errorCode = error['code'];
  			if (errorCode === 'auth/user-not-found') {
  				self.showError = true;
  				self.errorMessage = 'Nenhum usuário cadastrado com esse e-mail.';
  			}
  		});
  }

  login() {
  	if (this.validate()) {
  		let email = this.loginForm.controls.loginEmail.value;
  		let password = this.loginForm.controls.loginPassword.value;
  		this.signIn(email, password);
  	}
  }

  signUp() {
  	if (this.validate()) {
  		let email = this.loginForm.controls.loginEmail.value;
  		let password = this.loginForm.controls.loginPassword.value;
  		this.showLoading();

  		let self = this;

  		this.afAuth.auth.createUserWithEmailAndPassword(email, password)
  		.then(function(user) {
  			self.hideLoading();
  			if (user) {
  				self.signIn(email, password);
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
