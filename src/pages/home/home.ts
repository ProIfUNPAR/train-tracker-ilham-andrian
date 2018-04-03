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
  public trains: any[];
  public stations: any[];
  public cities: any[];

  public selectedStations: any[];
  public selectedCities: any[];

  public sTrain: any;
  public sStation: any;
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
    this.initializeTrain();
    this.initializeStation();
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

  initializeTrain() {
    this.trains = [
      { id: 1, name: 'Argo Parahyangan'},
      { id: 2, name: 'Argo Jati'},
      { id: 3, name: 'Harina'},
      { id: 4, name: 'Lodaya'},
      { id: 5, name: 'Ciremai Ekspres'},
      { id: 6, name: 'Malabar'},
      { id: 7, name: 'Argo Bromo'},
      { id: 8, name: 'Argo Willis'},
      { id: 9, name: 'Argo Lawu'},
      { id: 10, name: 'Argo Dwipangga'},
      { id: 11, name: 'Argo Sindoro'},
      { id: 12, name: 'Argo Muria'},
      { id: 13, name: 'Bima'},
      { id: 14, name: 'Sembrani'},
      { id: 15, name: 'Turangga'},
      { id: 16, name: 'Taksaka'},
      { id: 17, name: 'Bangunkarta'},
      { id: 18, name: 'Purwojaya'},
      { id: 19, name: 'Cirebon Ekspres'},
      { id: 20, name: 'Tegal Bahari'},
      { id: 21, name: 'Gumarang'},
      { id: 22, name: 'Sancaka'},
      { id: 23, name: 'Mutiara Timur'},
      { id: 24, name: 'Malioboro'},
      { id: 25, name: 'Pangrago/Siliwangi'},
      { id: 26, name: 'Mutiara Selatan'},
      { id: 27, name: 'Senja Utama Solo'},
      { id: 28, name: 'Fajar Utama Yogya'},
      { id: 29, name: 'Senja Utama Yogya'},
      { id: 30, name: 'Sawunggalih' },
      { id: 31, name: 'Sarangan Ekspres'},
      { id: 32, name: 'Sidomukti'},
      { id: 33, name: 'Majapahit'},
      { id: 34, name: 'Jayabaya'},
      { id: 35, name: 'Jaka Tingkir'},
      { id: 36, name: 'Menoreh'},
      { id: 37, name: 'Bogowonto'},
      { id: 38, name: 'Gajah Wong'},
      { id: 39, name: 'Karakatau'},
      { id: 40, name: 'Matarmaja'},
      { id: 41, name: 'Gaya Baru Malam Selatan'},
      { id: 42, name: 'Brantas' },
      { id: 43, name: 'Kertajaya'},
      { id: 44, name: 'Pasundan'},
      { id: 45, name: 'Kahuripan'},
      { id: 46, name: 'Bengawan'},
      { id: 47, name: 'Progo'},
      { id: 48, name: 'Logawa'},
      { id: 49, name: 'Kuntojaya Utara'},
      { id: 50, name: 'Sri Tanjung'},
      { id: 51, name: 'Tawang Jaya'},
      { id: 52, name: 'Kuntojaya Selatan'},
      { id: 53, name: 'Tegal Arum'},
      { id: 54, name: 'Tawang Alun'},
      { id: 55, name: 'Tegal Ekspres'},
      { id: 56, name: 'Maharani'},
      { id: 57, name: 'Kalijaga'},
      { id: 58, name: 'Probowangi'},
      { id: 59, name: 'Serayu'},
      { id: 60, name: 'Kamandeka'},
      { id: 61, name: 'Joglokerto'}
    ];
  }

  initializeStation() {
    this.stations = [
      { id: 1, name: 'Kiaracondong BDO', train_id: 1, train_name: 'Argo Parahyangan' },
      { id: 2, name: 'Gambir JKT', train_id: 1, train_name: 'Argo Parahyangan' },
      { id: 3, name: 'Harina', train_id: 2, train_name: 'Johor' },
      { id: 4, name: 'Lodaya', train_id: 2, train_name: 'Johor' },
      { id: 5, name: 'Ciremai', train_id: 3, train_name: 'Selangor' },
      { id: 7, name: 'Malabar', train_id: 3, train_name: 'Selangor' }
    ];
  }

  initializeCity() {
    this.cities = [
      { id: 1, name: 'Bandung', latitude: '-6.92501694', longitude: '107.64641998', train_id: 1, station_id: 1 },
      { id: 2, name: 'Jakarta', latitude: '-6.1767728', longitude: '106.8306364', train_id: 1, station_id: 2 },
      { id: 3, name: 'Malang', train_id: 0, station_id: 0 },
      { id: 4, name: 'Surabaya', train_id: 2, station_id: 3 },
      { id: 5, name: 'Solo', train_id: 2, station_id: 3 },
      { id: 6, name: 'City of Segamat 1', train_id: 2, station_id: 4 },
      { id: 7, name: 'City of Shah Alam 1', train_id: 3, station_id: 5 },
      { id: 8, name: 'City of Klang 1', train_id: 3, station_id: 6 },
      { id: 9, name: 'City of Klang 2', train_id: 3, station_id: 6 }
    ];
  }


  setDistrictValues(sTrain) {
    this.selectedStations = this.stations.filter(station => station.train_id == sTrain.id)
  }

  setCityValues(sStation) {
    this.selectedCities = this.cities.filter(city => city.station_id == sStation.id);
  }

  /// maps ///
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
