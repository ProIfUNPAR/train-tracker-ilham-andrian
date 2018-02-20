import { Component } from '@angular/core';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseServiceProvider } from './../../providers/firebase-service/firebase-service';
import { FirebaseListObservable } from 'angularfire2/database';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  trainData: FirebaseListObservable<any[]>;
  newItem = '';
  constructor(public navCtrl: NavController, public navParams: NavParams,public firebaseService: FirebaseServiceProvider) {
    this.trainData = this.firebaseService.getTrainList();
  }

  addItem(){
    this.firebaseService.addItem(this.newItem);
  }
  removeItem(id){
    this.firebaseService.removeItem(id);
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

}
