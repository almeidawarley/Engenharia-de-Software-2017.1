import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from "@angular/core";
import {IonicApp, IonicErrorHandler, IonicModule} from "ionic-angular";
import {MyApp} from "./app.component";

import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {LoginPage} from "../pages/login/login";
import {PerfilPage} from "../pages/perfil/perfil";

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';

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
    LoginPage,
    PerfilPage
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    PerfilPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
