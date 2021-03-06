import {Component, ViewChild} from "@angular/core";
import {Nav, Platform} from "ionic-angular";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {HomePage} from "../pages/home/home";
import {PerfilPage} from "../pages/perfil/perfil";
import {SignUpPage} from "../pages/signup/signup";

import {GeneroPage} from "../pages/genero/genero";
import {TagsPage} from "../pages/tags/tags";
import {LivroPage} from "../pages/livro/livro";
import {EpisodioPage} from "../pages/episodio/episodio";
import {FilmePage} from "../pages/filme/filme";
import {FeedPage} from "../pages/feed/feed";
import {Events} from 'ionic-angular';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage:any = HomePage;

  pages: Array<{title: string, icon: string, component: any}>;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public events: Events) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    this.pages = [
      { title: 'Perfil', icon: 'person', component: PerfilPage },
      { title: 'Feed', icon: 'ionic', component: FeedPage },
      { title: 'Tags', icon: 'pricetag', component: TagsPage },
      { title: 'Generos', icon: 'film', component: GeneroPage},
      { title: 'Livros', icon: 'book', component: LivroPage},
      { title: 'Episódios', icon: 'videocam', component: EpisodioPage},
      { title: 'Filmes', icon: 'film', component: FilmePage}
    ];

    events.subscribe('callHomePage', () => {
      this.nav.setRoot(HomePage);
    });

    events.subscribe('callSignUpPage', () => {
      this.nav.setRoot(SignUpPage);
    });

    events.subscribe('callPerfilPage', () => {
      this.nav.setRoot(PerfilPage);
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
