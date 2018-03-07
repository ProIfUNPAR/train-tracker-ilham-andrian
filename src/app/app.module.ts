import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { SettingsPage } from '../pages/settings/settings';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DatabaseProvider } from '../providers/database/database';
import { FirebaseProvider } from '../providers/firebase/firebase';

import { HttpModule } from '@angular/http';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { FirebaseServiceProvider } from '../providers/firebase-service/firebase-service';
import { FirebaseserviceProvider } from '../providers/firebaseservice/firebaseservice';

import { LocalNotifications } from '@ionic-native/local-notifications';

import { GoogleMaps } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';


const firebaseConfig = {
  apiKey: "AIzaSyAzbhP94h9kYX3Qk9KqP_B2BTTATVl3hyY",
  authDomain: "proif-1517362128536.firebaseapp.com",
  databaseURL: "https://proif-1517362128536.firebaseio.com",
  projectId: "proif-1517362128536",
  storageBucket: "proif-1517362128536.appspot.com",
  messagingSenderId: "88234858523"
};

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    HomePage,
    SettingsPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(firebaseConfig),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    HomePage,
    SettingsPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    LocalNotifications,
    GoogleMaps,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DatabaseProvider,
    FirebaseServiceProvider,
    FirebaseProvider,
    FirebaseServiceProvider,
    FirebaseserviceProvider
  ]
})
export class AppModule {}
