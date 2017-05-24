import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {Events} from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html'
})
export class PerfilPage {

  constructor(public navCtrl: NavController, public events: Events, public afAuth: AngularFireAuth) {
		if (!this.isAlreadyLoggedIn()) {
  		events.publish('perfil:callLogin');
  	}
  }

  isAlreadyLoggedIn() {
  	return this.afAuth.auth.currentUser !== null;
  }

  logout() {
  	this.afAuth.auth.signOut();
  	this.events.publish('user:loggedOut');
  }
}
