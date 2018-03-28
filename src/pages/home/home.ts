import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, AlertController, Platform } from 'ionic-angular';
import { FirebaseServiceProvider } from './../../providers/firebase-service/firebase-service';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { GoogleMaps, GoogleMap, CameraPosition, LatLng, GoogleMapsEvent, Marker, MarkerOptions, ILatLng } from '@ionic-native/google-maps';
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


export class HomePage {
  //-----hardcode---------//
  public states: any[];
  public districts: any[];
  public cities: any[];

  public selectedDistricts: any[];
  public selectedCities: any[];

  public sState: any;
  public sDistrict: any;
  //-----map-------------//
  @ViewChild('map') mapElement: ElementRef;
  map: GoogleMap;
  //-------firebase----------//
  trainData: AngularFireList<any[]>;
  newItem = '';
  appName = 'Ionic App';
  constructor(public navCtrl: NavController, private camera: Camera, private _googleMaps: GoogleMaps,
    private _geoLoc: Geolocation, public firebaseService: FirebaseServiceProvider, private localNotifications: LocalNotifications, private plt: Platform, public alertCtrl: AlertController) {
    //------hardcode----//
    this.initializeState();
    this.initializeDistrict();
    this.initializeCity();
    //------firebase----//  
    this.trainData = this.firebaseService.getTrainList();
    //----notification----//
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

  //----hardcode method----//

  initializeState() {
    this.states = [
      { id: 1, name: 'Argo Parahyangan' },
      { id: 2, name: 'Argo Jati' },
      { id: 3, name: 'Harina' },
      { id: 4, name: 'Lodaya' },
      { id: 5, name: 'Ciremai' },
      { id: 6, name: 'Malabar' },
    ];
  }

  initializeDistrict(){
    this.districts = [
        {id: 1, name: 'Argo Parahyangan', state_id: 1, state_name: 'Argo Parahyangan'},
        {id: 2, name: 'Argo Jati', state_id: 1, state_name: 'Melaka'},
        {id: 3, name: 'Harina', state_id: 2, state_name: 'Johor'},
        {id: 4, name: 'Lodaya', state_id: 2, state_name: 'Johor'},
        {id: 5, name: 'Ciremai', state_id: 3, state_name: 'Selangor'},
        {id: 7, name: 'Malabar', state_id: 3, state_name: 'Selangor'}
    ];
    }

    initializeCity(){
      this.cities = [
          {id: 1, name: 'Bandung',latitude: '-6.92501694', longitude:'107.64641998',state_id: 1, district_id: 1},
          {id: 2, name: 'Jakarta',latitude: '-6.1767728', longitude:'106.8306364', state_id: 1, district_id: 1},
          {id: 3, name: 'Malang', state_id: 1, district_id: 2},
          {id: 4, name: 'Surabaya', state_id: 2, district_id: 3},
          {id: 5, name: 'Solo', state_id: 2, district_id: 3},
          {id: 6, name: 'City of Segamat 1', state_id: 2, district_id: 4},
          {id: 7, name: 'City of Shah Alam 1', state_id: 3, district_id: 5},
          {id: 8, name: 'City of Klang 1', state_id: 3, district_id: 6},
          {id: 9, name: 'City of Klang 2', state_id: 3, district_id: 6}
      ];
      }

     
      setDistrictValues(sState) {
        this.selectedDistricts = this.districts.filter(district => district.state_id == sState.id)
    }
    
     setCityValues(sDistrict) {
        this.selectedCities = this.cities.filter(city => city.district_id == sDistrict.id);
    }
    

  ionViewDidLoad() {
    let loc: LatLng;
    this.loadMap();

    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
      //Get User location
      this.getLocation().then(res => {
        //Once location is gotten, we set the location on the camera.
        loc = new LatLng(res.coords.latitude, res.coords.longitude);
        this.moveCamera(loc);

        this.createMarker(loc, "Me").then((marker: Marker) => {
          marker.showInfoWindow();
        }).catch(err => {
          console.log(err);
        });

      }).catch(err => {
        console.log(err);
      });

    });
  }

  //Load the map 
  loadMap() {
    let element = this.mapElement.nativeElement;
    this.map = this._googleMaps.create(element)
  }

  //Get current user location
  //Returns promise
  getLocation() {
    return this._geoLoc.getCurrentPosition();
  }


  //Moves the camera to any location
  moveCamera(loc: LatLng) {
    let options: CameraPosition<ILatLng> = {
      //specify center of map
      target: loc,
      zoom: 25,
      tilt: 10
    }
    this.map.moveCamera(options)
  }

  //Adds a marker to the map
  createMarker(loc: LatLng, title: string) {
    let markerOptions: MarkerOptions = {
      position: loc,
      title: title
    };

    return this.map.addMarker(markerOptions);
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
