import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
 } from '@ionic-native/google-maps';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  map: GoogleMap;
  constructor(public navCtrl: NavController) { 
      this.loadMap();
  }

  loadMap() {

  let mapOptions: GoogleMapOptions = {
    camera: {
      target: {
        lat: -6.875042,
        lng: 107.605015
      },
      zoom: 18,
      tilt: 30
    }
  };

  this.map = GoogleMaps.create('map_canvas', mapOptions);

  // Wait the MAP_READY before using any methods.
  this.map.one(GoogleMapsEvent.MAP_READY)
    .then(() => {
      console.log('Map is ready!');

      // Now you can use all methods safely.
      this.map.addMarker({
          title: 'This is you',
          icon: 'red',
          animation: 'DROP',
          position: {
            lat: -6.875042,
            lng: 107.605015
          }
        })
        .then(marker => {
          marker.on(GoogleMapsEvent.MARKER_CLICK)
            .subscribe(() => {
              alert('clicked');
            });
        });

    });
  }
}