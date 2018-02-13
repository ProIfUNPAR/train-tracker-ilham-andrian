import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera, CameraOptions } from '@ionic-native/camera';
import {GoogleMaps,GoogleMap,GoogleMapsEvent,GoogleMapOptions,CameraPosition,MarkerOptions,Marker} from '@ionic-native/google-maps';


@NgModule({
  imports: [HttpModule]
})

import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
 } from '@ionic-native/google-maps';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [Camera,GoogleMaps]
})

//export class AppModule {}

export class HomePage {
  // 2 error construction signature  
  //private geolocation: Geolocation
  //private camera: Camera
  map: GoogleMap;
  constructor(public navCtrl: NavController, private camera: Camera,private googleMaps: GoogleMaps) {}
//camera
  const options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }
  
}




/* GEO LOCATION ERROR getCurrentPosition not found
 this.geolocation.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
    }).catch((error) => {
      console.log('Error getting location', error);
    });

    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      // data can be a set of coordinates, or an error (if an error occurred).
      // data.coords.latitude
      // data.coords.longitude
    });
  map: GoogleMap;
  constructor(public navCtrl: NavController) { 
      this.loadMap();
  }
*/

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
