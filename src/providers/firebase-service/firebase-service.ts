import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class FirebaseServiceProvider {

  constructor(public afd: AngularFireDatabase) {
    console.log(' FirebaseServiceProvider loaded');
  }

  getTrainList() {
    return this.afd.list('/trainData/');
  }

  addItem(name){
    this.afd.list('/trainData/').push(name);
  }
  removeItem(id){
    this.afd.list('/trainData/').remove(id);
  }

}
