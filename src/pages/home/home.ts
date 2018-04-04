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
      { id: 1, name: '1.Argo Parahyangan' },
      { id: 2, name: '2.Argo Jati' },
      { id: 3, name: '3.Harina' },
      { id: 4, name: '4.Lodaya' },
      { id: 5, name: '5.Ciremai Ekspres' },
      { id: 6, name: '6.Malabar' },
      { id: 7, name: '7.Argo Bromo Anggrek' },
      { id: 8, name: '8.Argo Willis' },
      { id: 9, name: '9.Argo Lawu' },
      { id: 10, name: '10.Argo Dwipangga' },
      { id: 11, name: '11.Argo Sindoro' },
      { id: 12, name: '12.Argo Muria' },
      { id: 13, name: '13.Bima' },
      { id: 14, name: '14.Sembrani' },
      { id: 15, name: '15.Turangga' },
      { id: 16, name: '16.Taksaka' },
      { id: 17, name: '17.Bangunkarta' },
      { id: 18, name: '18.Purwojaya' },
      { id: 19, name: '19.Cirebon Ekspres' },
      { id: 20, name: '20.Tegal Bahari' },
      { id: 21, name: '21.Gumarang' },
      { id: 22, name: '22.Sancaka' },
      { id: 23, name: '23.Mutiara Timur' },
      { id: 24, name: '24.Malioboro' },
      { id: 25, name: '25.Pangrago/Siliwangi' },
      { id: 26, name: '26.Mutiara Selatan' },
      { id: 27, name: '27.Senja Utama Solo' },
      { id: 28, name: '28.Fajar Utama Yogya' },
      { id: 29, name: '29.Senja Utama Yogya' },
      { id: 30, name: '30.Sawunggalih' },
      { id: 31, name: 'Sarangan Ekspres' },
      { id: 32, name: 'Sidomukti' },
      { id: 33, name: 'Majapahit' },
      { id: 34, name: 'Jayabaya' },
      { id: 35, name: 'Jaka Tingkir' },
      { id: 36, name: 'Menoreh' },
      { id: 37, name: 'Bogowonto' },
      { id: 38, name: 'Gajah Wong' },
      { id: 39, name: 'Karakatau' },
      { id: 40, name: 'Matarmaja' },
      { id: 41, name: 'Gaya Baru Malam Selatan' },
      { id: 42, name: 'Brantas' },
      { id: 43, name: 'Kertajaya' },
      { id: 44, name: 'Pasundan' },
      { id: 45, name: 'Kahuripan' },
      { id: 46, name: 'Bengawan' },
      { id: 47, name: 'Progo' },
      { id: 48, name: 'Logawa' },
      { id: 49, name: 'Kuntojaya Utara' },
      { id: 50, name: 'Sri Tanjung' },
      { id: 51, name: 'Tawang Jaya' },
      { id: 52, name: 'Kuntojaya Selatan' },
      { id: 53, name: 'Tegal Arum' },
      { id: 54, name: 'Tawang Alun' },
      { id: 55, name: 'Tegal Ekspres' },
      { id: 56, name: 'Maharani' },
      { id: 57, name: 'Kalijaga' },
      { id: 58, name: 'Probowangi' },
      { id: 59, name: 'Serayu' },
      { id: 60, name: 'Kamandeka' },
      { id: 61, name: 'Joglokerto' }
    ];
  }

  initializeStation() {
    //spesifikasi input { id: N, name: 'STASIUN (STS)', train_id: N, train_name: 'untuk pengelompokan'}
    // train_id 0 = data sedang di hide
    this.stations = [
      { id: 1.1, name: 'Bandung (BDO)', train_id: 1 },
      { id: 1.2, name: 'Bandung (BDO)', train_id: 3 },
      { id: 1.3, name: 'Bandung (BDO)', train_id: 4 },
      { id: 1.4, name: 'Bandung (BDO)', train_id: 5 },
      { id: 1.5, name: 'Bandung (BDO)', train_id: 6 },
      { id: 1.6, name: 'Bandung (BDO)', train_id: 8 },
      { id: 1.7, name: 'Bandung (BDO)', train_id: 15 },
      { id: 2.1, name: 'Banyuwangi Baru (BW)', train_id: 0 },
      { id: 3.1, name: 'Bogor (BOO)', train_id: 0 },
      { id: 4.1, name: 'Cianjur (CJ)', train_id: 0 },
      { id: 5.1, name: 'Cilacap (CP)', train_id: 0 },
      { id: 6.1, name: 'Cirebon (CN)', train_id: 2 },
      { id: 7.1, name: 'Jakarta Gambir (GMR)', train_id: 1 },
      { id: 7.2, name: 'Jakarta Gambir (GMR)', train_id: 2 },
      { id: 7.3, name: 'Jakarta Gambir (GMR)', train_id: 7 },
      { id: 7.4, name: 'Jakarta Gambir (GMR)', train_id: 9 },
      { id: 7.5, name: 'Jakarta Gambir (GMR)', train_id: 10 },
      { id: 7.6, name: 'Jakarta Gambir (GMR)', train_id: 11 },
      { id: 7.7, name: 'Jakarta Gambir (GMR)', train_id: 12 },
      { id: 7.8, name: 'Jakarta Gambir (GMR)', train_id: 13 },
      { id: 7.9, name: 'Jakarta Gambir (GMR)', train_id: 14 },
      { id: '7.A', name: 'Jakarta Gambir (GMR)', train_id: 16 },
      { id: '7.B', name: 'Jakarta Gambir (GMR)', train_id: 17 },
      { id: 8.1, name: 'Jember (JR)', train_id: 0 },
      { id: 9.1, name: 'Kediri (KD)', train_id: 0 },
      { id: 10.1, name: 'Kiara Condong(KAC)', train_id: 0 },
      { id: 11.1, name: 'Kutoarjo (KTA)', train_id: 0 },
      { id: 12.1, name: 'Lempuyangan (LPN)', train_id: 0 },
      { id: 13.1, name: 'Madiun (MN)', train_id: 0 },
      { id: 14.1, name: 'Malang (ML)', train_id: 6 },
      { id: 14.2, name: 'Malang (ML)', train_id: 13 },
      { id: 15.1, name: 'Malang Kota lama (MLK)', train_id: 0 },
      { id: 16.1, name: 'Merak (MER)', train_id: 0 },
      { id: 17.1, name: 'Jakarta Pasar Senen (PSE)', train_id: 0 },
      { id: 18.1, name: 'Purwokerto (PWT)', train_id: 0 },
      { id: 19.1, name: 'Purwosari (PWS)', train_id: 0 },
      { id: 20.1, name: 'Semarang Poncol (SMC)', train_id: 0 },
      { id: 21.1, name: 'Semarang Tawang (SMT)', train_id: 5 },
      { id: 21.2, name: 'Semarang Tawang (SMT)', train_id: 11 },
      { id: 21.3, name: 'Semarang Tawang (SMT)', train_id: 12 },
      { id: 22.1, name: 'Solo Balapan (SLO)', train_id: 4 },
      { id: 22.2, name: 'Solo Balapan (SLO)', train_id: 9 },
      { id: 22.3, name: 'Solo Balapan (SLO)', train_id: 10 },
      { id: 23.1, name: 'Sukabumi (SI)', train_id: 0 },
      { id: 24.1, name: 'Surabaya Gubeng (SGU)', train_id: 8 },
      { id: 24.2, name: 'Surabaya Gubeng (SGU)', train_id: 15 },
      { id: 24.3, name: 'Surabaya Gubeng (SGU)', train_id: 18 },
      { id: 25.1, name: 'Surabaya Kota (SB)', train_id: 0 },
      { id: 26.1, name: 'Surabaya Pasarturi (SBI)', train_id: 3 },
      { id: 26.2, name: 'Surabaya Pasarturi (SBI)', train_id: 7 },
      { id: 26.3, name: 'Surabaya Pasarturi (SBI)', train_id: 14 },
      { id: 27.1, name: 'Tegal (TG)', train_id: 0 },
      { id: 28.1, name: 'Yogyakarta (YK)', train_id: 16 },
      { id: 29.1, name: 'Semarang Poncol (SMC)', train_id: 0 },
    ];
  }
  //representasikan jalur
  initializeCity() {
    this.cities = [
      { id: 1, name: 'Bandung(BDO)-Jakarta(GMR)', train_id: 1, station_id: 1.1 },
      { id: 2, name: 'Jakarta(GMR)-Bandung(BDO)', train_id: 1, station_id: 7.1 },
      { id: 3, name: 'Cirebon(CN)-Jakarta(GMR)', train_id: 2, station_id: 6.1 },
      { id: 4, name: 'Jakarta(GMR)-Cirebon(CN)', train_id: 2, station_id: 7.2 },
      { id: 5, name: 'Surabaya(SBI)-Bandung(BDO)', train_id: 3, station_id: 26.1 },
      { id: 5, name: 'Bandung(BDO)-Surabaya(SBI)', train_id: 3, station_id: 1.2 },
      { id: 6, name: 'Solo(SLO)-Bandung(BDO)', train_id: 4, station_id: 22.1 },
      { id: 7, name: 'Bandung(BDO)-Solo(SLO)', train_id: 4, station_id: 1.3 },
      { id: 8, name: 'Semarang(SMT)-Bandung(BDO)', train_id: 5, station_id: 21.1 },
      { id: 9, name: 'Bandung(BDO)-Semarang(SMT)', train_id: 5, station_id: 1.4 },
      { id: 10, name: 'Malang(ML)-Bandung(BDO)', train_id: 6, station_id: 14.1 },
      { id: 11, name: 'Bandung(BDO)-Malang(ML)', train_id: 6, station_id: 1.5 },
      { id: 12, name: 'Surabaya(SBI)-Jakarta(GMR)', train_id: 7, station_id: 26.2 },
      { id: 13, name: 'Jakarta(GMR)-Surabaya(SBI)', train_id: 7, station_id: 7.3 },
      { id: 14, name: 'Surabaya(SGU)-Bandung(BDO)', train_id: 8, station_id: 24.1 },
      { id: 15, name: 'Bandung(BDO)-Surabaya(SGU)', train_id: 8, station_id: 1.6 },
      { id: 16, name: 'Solo(SLO)-Jakarta(GMR)', train_id: 9, station_id: 22.2 },
      { id: 17, name: 'Jakarta(GMR)-Solo(SLO)', train_id: 9, station_id: 7.4 },
      { id: 18, name: 'Solo(SLO)-Jakarta(GMR)', train_id: 10, station_id: 22.3 },
      { id: 19, name: 'Jakarta(GMR)-Solo(SLO)', train_id: 10, station_id: 7.5 },
      { id: 20, name: 'Semarang(SMT)-Jakarta(GMR)', train_id: 11, station_id: 21.2 },
      { id: 21, name: 'Jakarta(GMR)-Semarang(SMT)', train_id: 11, station_id: 7.6 },
      { id: 22, name: 'Semarang(SMT)-Jakarta(GMR)', train_id: 12, station_id: 21.3 },
      { id: 23, name: 'Jakarta(GMR)-Semarang(SMT)', train_id: 12, station_id: 7.7 },
      { id: 24, name: 'Malang(ML)-Jakarta(GMR)', train_id: 13, station_id: 14.2 },
      { id: 25, name: 'Jakarta(GMR)-Malang(ML)', train_id: 13, station_id: 7.8 },
      { id: 26, name: 'Surabaya(SBI)-Jakarta(GMR)', train_id: 14, station_id: 26.3 },
      { id: 27, name: 'Jakarta(GMR)-Surabaya(SBI)', train_id: 14, station_id: 7.9 },
      { id: 28, name: 'Bandung(BDO)-Surabaya(SGU)', train_id: 15, station_id: 1.7 },
      { id: 29, name: 'Surabaya(SGU)-Bandung(BDO)', train_id: 15, station_id: 24.2 },
      { id: 30, name: 'Yogyakarta(YK)-Jakarta(GMR)', train_id: 16, station_id: 0 },
      { id: 31, name: 'Jakarta(GMR)-Yogyakarta(YK)', train_id: 16, station_id:0 },
      { id: 32, name: 'Yogyakarta(YK)-Jakarta(GMR)', train_id: 17, station_id: 0 },
      { id: 33, name: 'Jakarta(GMR)-Yogyakarta(YK)', train_id: 17, station_id: 0 },
      { id: 34, name: 'Surabaya(SGU)-Gambir(GMR)', train_id: 18, station_id: 0 },
      { id: 35, name: 'Gambir(GMR)-Surabaya(SGU)', train_id: 18, station_id: 0 },
      { id: 36, name: '', train_id: 19, station_id: 0 },
      { id: 37, name: '', train_id: 19, station_id: 0 },

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
