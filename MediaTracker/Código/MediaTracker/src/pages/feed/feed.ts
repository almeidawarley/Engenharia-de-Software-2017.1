import {Component, ElementRef, ViewChild} from "@angular/core";
import {NavController} from "ionic-angular";
import {Events} from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html'
})
export class FeedPage {

  @ViewChild("image")
  imageElement: ElementRef;

  loading: any;

  perfilImage: any;
  perfilApelido: any;
  perfilNome: any;
  perfilEmail: any;
  perfilData: any;

  perfilSexoIcone: string;

  isLoaded: boolean = false;

  constructor(public navCtrl: NavController, public events: Events, public afAuth: AngularFireAuth,
              public afDb: AngularFireDatabase, public loadingCtrl: LoadingController) {
    this.showLoading();
    this.loadData();
  }

  logout() {
    this.afAuth.auth.signOut();
    this.events.publish('callHomePage');
  }

  loadData() {
    let user = this.afAuth.auth.currentUser;
    let ref = this.afDb.object('/users/' + user.uid);
    let self = this;
    ref.subscribe(function(userData) {
      self.perfilImage = userData['image'];
      self.perfilApelido = userData['apelido'];
      self.perfilNome = userData['nome'];
      self.perfilEmail = userData['email'];
      self.perfilData = userData['data'];

      let sexo = userData['sexo'];
      if (sexo === 'Masculino')
        self.perfilSexoIcone = 'male';
      else if (sexo === 'Feminino')
        self.perfilSexoIcone = 'female';

      self.hideLoading();
      self.isLoaded = true;
    });
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
