import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from "@angular/core";
import {IonicApp, IonicErrorHandler, IonicModule} from "ionic-angular";
import {MyApp} from "./app.component";

import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {HomePage} from "../pages/home/home";
import {PerfilPage} from "../pages/perfil/perfil";
import {SignUpPage} from "../pages/signup/signup";
import {GeneroPage} from "../pages/genero/genero";
import {TagsPage} from "../pages/tags/tags";
import {LivroPage} from "../pages/livro/livro";

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';

const firebaseConfig = {
    apiKey: "AIzaSyAl_Yx_E0q2hsrCdCyPN0K3cSfSXf8KZdk",
    authDomain: "mediatracker-43083.firebaseapp.com",
    databaseURL: "https://mediatracker-43083.firebaseio.com",
    projectId: "mediatracker-43083",
    storageBucket: "mediatracker-43083.appspot.com",
    messagingSenderId: "607491625531"
  };

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SignUpPage,
    PerfilPage,
    TagsPage,
    GeneroPage,
    LivroPage
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SignUpPage,
    PerfilPage,
    TagsPage, 
    GeneroPage,
    LivroPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
