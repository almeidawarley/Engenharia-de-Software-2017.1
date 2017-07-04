import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {Events} from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  template: ''
})
export class LogoutPage {

  constructor(public navCtrl: NavController, public events: Events, public afAuth: AngularFireAuth) {
  	this.logout();
  }

  logout() {
  	this.afAuth.auth.signOut();
  	this.events.publish('callHomePage');
  }
}
