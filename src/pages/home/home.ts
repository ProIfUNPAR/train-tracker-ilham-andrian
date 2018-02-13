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
