import { HttpModule } from '@angular/http';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Component } from '@angular/core';
import { NavController, AlertController, Platform } from 'ionic-angular';
import { FirebaseServiceProvider } from './../../providers/firebase-service/firebase-service';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, GoogleMapOptions, CameraPosition, MarkerOptions, Marker } from '@ionic-native/google-maps';
//import { FirebaseListObservable } from 'angularfire2/database';
import { AngularFireObject } from 'angularfire2/database';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { AngularFireList } from 'angularfire2/database/interfaces';


@NgModule({
  imports: [HttpModule]
})



@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [Camera, GoogleMaps]
})

//export class AppModule {}

export class HomePage {
  // 2 error construction signature  
  //private geolocation: Geolocation
  //private camera: Camera
  map: GoogleMap;


  ///

  trainData: AngularFireList<any[]>;
  newItem = '';
  constructor(public navCtrl: NavController, private camera: Camera, private googleMaps: GoogleMaps, public firebaseService: FirebaseServiceProvider, private localNotifications: LocalNotifications, private plt: Platform, public alertCtrl: AlertController) {
    this.trainData = this.firebaseService.getTrainList();

    this.plt.ready().then((rdy) => {
      this.localNotifications.on('click', (notification, state) => {
        let json = JSON.parse(notification.data);

        let alert = this.alertCtrl.create({
          title: notification.title,
          subTitle: json.myData
        });
        alert.present();
      });
    });
  }
  addItem() {
    this.firebaseService.addItem(this.newItem);
  }
  removeItem(id) {
    this.firebaseService.removeItem(id);
  }

  isSelected() {
    var data1 = document.getElementById("#Data1");
    var selected = document.getElementById("select-text");
    var current = document.getElementById("fromID");
    var destination = document.getElementById("toId");
    if (data1.getAttribute == selected.getAttribute) {
      document.getElementById("fromID").innerHTML = "data1";
    }
  }

  //camera
  options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }
  ionViewDidLoad() {
    this.loadMap();
  }

  loadMap() {
    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: 43.0741904,
          lng: -89.3809802
        },
        zoom: 18,
        tilt: 30
      }
    };
    this.map = this.googleMaps.create('map_canvas', mapOptions);

    // Wait the MAP_READY before using any methods.
    this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        console.log('Map is ready!');

        // Now you can use all methods safely.
        this.map.addMarker({
          title: 'Ionic',
          icon: 'blue',
          animation: 'DROP',
          position: {
            lat: 43.0741904,
            lng: -89.3809802
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

  scheduleNotification() {
    console.log("Notif keluar!!");
    this.localNotifications.schedule({
      id: 1,
      title: 'Attention',
      text: 'Ilham Notifications',
      at: new Date(new Date().getTime() + 5 * 1000),
      data: { myData: 'Notifnya udah keluar belum ?' }
    });
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
