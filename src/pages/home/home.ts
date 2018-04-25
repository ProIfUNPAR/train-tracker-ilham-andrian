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
import { BackgroundMode } from '@ionic-native/background-mode';


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
  public google:any;
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
      { id: 25, name: '25.Pangrango/Siliwangi' },
      { id: 26, name: '26.Mutiara Selatan' },
      { id: 27, name: '27.Utama Solo' },
      { id: 28, name: '28.Utama Yogya' },
      { id: 29, name: '29.Sawunggalih' },
      { id: 30, name: '30.Sarangan Ekspres' },
      { id: 31, name: '31.Sidomukti' },
      { id: 32, name: '32.Majapahit' },
      { id: 33, name: '33.Jayabaya' },
      { id: 34, name: '34.Jaka Tingkir' },
      { id: 35, name: '35.Menoreh' },
      { id: 36, name: '36.Bogowonto' },
      { id: 37, name: '37.Gajah Wong' },
      { id: 38, name: '38.Karakatau' },
      { id: 39, name: '39.Matarmaja' },
      { id: 40, name: '40.Gaya Baru Malam Selatan' },
      { id: 41, name: '41.Brantas' },
      { id: 42, name: '42.Kertajaya' },
      { id: 43, name: '43.Pasundan' },
      { id: 44, name: '44.Kahuripan' },
      { id: 45, name: '45.Bengawan' },
      { id: 46, name: '46.Progo' },
      { id: 47, name: '47.Logawa' },
      { id: 48, name: '48.Kuntojaya Utara' },
      { id: 49, name: '49.Sri Tanjung' },
      { id: 50, name: '50.Tawang Jaya' },
      { id: 51, name: '51.Kuntojaya Selatan' },
      { id: 52, name: '52.Tegal Arum' },
      { id: 53, name: '53.Tawang Alun' },
      { id: 54, name: '54.Tegal Ekspres' },
      { id: 55, name: '55.Maharani' },
      { id: 56, name: '56.Kalijaga' },
      { id: 57, name: '57.Probowangi' },
      { id: 58, name: '58.Serayu' },
      { id: 59, name: '59.Kamandeka' },
      { id: 60, name: '60.Joglokerto' }
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
      { id: 1.8, name: 'Bandung (BDO)', train_id: 26 },
      { id: 2.1, name: 'Banyuwangi Baru (BW)', train_id: 23 },
      { id: 3.1, name: 'Bogor (BOO)', train_id: 25 },
      { id: 4.1, name: 'Cianjur (CJ)', train_id: 0 },
      { id: 5.1, name: 'Cilacap (CP)', train_id: 18 },
      { id: 6.1, name: 'Cirebon (CN)', train_id: 2 },
      { id: 6.2, name: 'Cirebon (CN)', train_id: 19 },
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
      { id: '7.C', name: 'Jakarta Gambir (GMR)', train_id: 18 },
      { id: '7.D', name: 'Jakarta Gambir (GMR)', train_id: 19 },
      { id: '7.E', name: 'Jakarta Gambir (GMR)', train_id: 20 },
      { id: 8.1, name: 'Jember (JR)', train_id: 0 },
      { id: 9.1, name: 'Kediri (KD)', train_id: 38 },
      { id: 10.1, name: 'Kiara Condong(KAC)', train_id: 0 },
      { id: 11.1, name: 'Kutoarjo (KTA)', train_id: 29 },
      { id: 12.1, name: 'Lempuyangan (LPN)', train_id: 36 },
      { id: 12.2, name: 'Lempuyangan (LPN)', train_id: 37 },
      { id: 13.1, name: 'Madiun (MN)', train_id: 30 },
      { id: 14.1, name: 'Malang (ML)', train_id: 6 },
      { id: 14.2, name: 'Malang (ML)', train_id: 13 },
      { id: 14.3, name: 'Malang (ML)', train_id: 24 },
      { id: 14.4, name: 'Malang (ML)', train_id: 32 },
      { id: 14.5, name: 'Malang (ML)', train_id: 33 },
      { id: 14.6, name: 'Malang (ML)', train_id: 39 },
      { id: 15.1, name: 'Malang Kota lama (MLK)', train_id: 0 },
      { id: 16.1, name: 'Merak (MER)', train_id: 38 },
      { id: 17.1, name: 'Jakarta Pasar Senen (PSE)', train_id: 21 },
      { id: 17.2, name: 'Jakarta Pasar Senen (PSE)', train_id: 27 },
      { id: 17.3, name: 'Jakarta Pasar Senen (PSE)', train_id: 28 },
      { id: 17.4, name: 'Jakarta Pasar Senen (PSE)', train_id: 29 },
      { id: 17.5, name: 'Jakarta Pasar Senen (PSE)', train_id: 32 },
      { id: 17.6, name: 'Jakarta Pasar Senen (PSE)', train_id: 33 },
      { id: 17.7, name: 'Jakarta Pasar Senen (PSE)', train_id: 34 },
      { id: 17.8, name: 'Jakarta Pasar Senen (PSE)', train_id: 35 },
      { id: 17.9, name: 'Jakarta Pasar Senen (PSE)', train_id: 36 },
      { id: '17.A', name: 'Jakarta Pasar Senen (PSE)', train_id: 37 },
      { id: '17.B', name: 'Jakarta Pasar Senen (PSE)', train_id: 39 },
      { id: '17.C', name: 'Jakarta Pasar Senen (PSE)', train_id: 40 },
      { id: 18.1, name: 'Purwokerto (PWT)', train_id: 0 },
      { id: 19.1, name: 'Purwosari (PWS)', train_id: 34 },
      { id: 20.1, name: 'Semarang Poncol (SMC)', train_id: 0 },
      { id: 21.1, name: 'Semarang Tawang (SMT)', train_id: 5 },
      { id: 21.2, name: 'Semarang Tawang (SMT)', train_id: 11 },
      { id: 21.3, name: 'Semarang Tawang (SMT)', train_id: 12 },
      { id: 21.4, name: 'Semarang Tawang (SMT)', train_id: 35 },
      { id: 22.1, name: 'Solo Balapan (SLO)', train_id: 4 },
      { id: 22.2, name: 'Solo Balapan (SLO)', train_id: 9 },
      { id: 22.3, name: 'Solo Balapan (SLO)', train_id: 10 },
      { id: 22.4, name: 'Solo Balapan (SLO)', train_id: 27 },
      { id: 22.5, name: 'Solo Balapan (SLO)', train_id: 31 },
      { id: 23.1, name: 'Sukabumi (SI)', train_id: 25 },
      { id: 24.1, name: 'Surabaya Gubeng (SGU)', train_id: 8 },
      { id: 24.2, name: 'Surabaya Gubeng (SGU)', train_id: 15 },
      { id: 24.3, name: 'Surabaya Gubeng (SGU)', train_id: 17 },
      { id: 24.4, name: 'Surabaya Gubeng (SGU)', train_id: 22 },
      { id: 24.5, name: 'Surabaya Gubeng (SGU)', train_id: 23 },
      { id: 24.6, name: 'Surabaya Gubeng (SGU)', train_id: 26 },
      { id: 24.7, name: 'Surabaya Gubeng (SGU)', train_id: 30 },
      { id: 24.8, name: 'Surabaya Gubeng (SGU)', train_id: 40 },
      { id: 25.1, name: 'Surabaya Kota (SB)', train_id: 0 },
      { id: 26.1, name: 'Surabaya Pasarturi (SBI)', train_id: 3 },
      { id: 26.2, name: 'Surabaya Pasarturi (SBI)', train_id: 7 },
      { id: 26.3, name: 'Surabaya Pasarturi (SBI)', train_id: 14 },
      { id: 26.4, name: 'Surabaya Pasarturi (SBI)', train_id: 21 },
      { id: 27.1, name: 'Tegal (TG)', train_id: 20 },
      { id: 28.1, name: 'Yogyakarta (YK)', train_id: 16 },
      { id: 28.2, name: 'Yogyakarta (YK)', train_id: 22 },
      { id: 28.3, name: 'Yogyakarta (YK)', train_id: 24 },
      { id: 28.4, name: 'Yogyakarta (YK)', train_id: 28 },
      { id: 28.5, name: 'Yogyakarta (YK)', train_id: 31 },
      { id: 29.1, name: 'Semarang Poncol (SMC)', train_id: 0 },
    ];
  }
  //representasikan jalur
  initializeCity() {
    this.cities = [
      { id: 1, name: 'Bandung(BDO)-Jakarta(GMR)', train_id: 1, station_id: 1.1, longitudeStart:107.602438 , langitudeStart:-6.914632 , longitudeEnd:106.830636 , langitudeEnd:-6.176773 },
      { id: 2, name: 'Jakarta(GMR)-Bandung(BDO)', train_id: 1, station_id: 7.1, longitudeStart:106.830636 , langitudeStart:-6.176773 , longitudeEnd:107.602438  , langitudeEnd:-6.914632},
      { id: 3, name: 'Cirebon(CN)-Jakarta(GMR)', train_id: 2, station_id: 6.1, longitudeStart:108.555444 , langitudeStart:-6.705386 , longitudeEnd:106.830636 , langitudeEnd:-6.176773 },
      { id: 4, name: 'Jakarta(GMR)-Cirebon(CN)', train_id: 2, station_id: 7.2, longitudeStart:106.830636 , langitudeStart:-6.176773 , longitudeEnd:108.555444 , langitudeEnd:-6.705386 },
      { id: 5, name: 'Surabaya(SBI)-Bandung(BDO)', train_id: 3, station_id: 26.1 , longitudeStart:112.744042 , langitudeStart:-7.243142 , longitudeEnd:107.602438  , langitudeEnd:-6.914632},
      { id: 5, name: 'Bandung(BDO)-Surabaya(SBI)', train_id: 3, station_id: 1.2 , longitudeStart:107.602438 , langitudeStart:-6.914632 , longitudeEnd:112.744042 , langitudeEnd:7.243142},
      { id: 6, name: 'Solo(SLO)-Bandung(BDO)', train_id: 4, station_id: 22.1, longitudeStart:110.821417 , langitudeStart:-7.557016 , longitudeEnd:107.602438 , langitudeEnd:-6.914632 },
      { id: 7, name: 'Bandung(BDO)-Solo(SLO)', train_id: 4, station_id: 1.3 , longitudeStart:107.602438 , langitudeStart:-6.914632 , longitudeEnd:110.821417 , langitudeEnd:-7.557016},
      { id: 8, name: 'Semarang(SMT)-Bandung(BDO)', train_id: 5, station_id: 21.1 , longitudeStart:110.427923 , langitudeStart:-6.964446 , longitudeEnd:107.602438  , langitudeEnd:-6.914632},
      { id: 9, name: 'Bandung(BDO)-Semarang(SMT)', train_id: 5, station_id: 1.4 , longitudeStart:107.602438 , langitudeStart:-6.914632 , longitudeEnd:110.427923  , langitudeEnd:-6.964446},
      { id: 10, name: 'Malang(ML)-Bandung(BDO)', train_id: 6, station_id: 14.1 , longitudeStart:112.637028 , langitudeStart:-7.977497 , longitudeEnd:107.602438  , langitudeEnd:-6.914632},
      { id: 11, name: 'Bandung(BDO)-Malang(ML)', train_id: 6, station_id: 1.5 , longitudeStart:107.602438 , langitudeStart:-6.914632 , longitudeEnd:112.637028 , langitudeEnd:-7.977497},
      { id: 12, name: 'Surabaya(SBI)-Jakarta(GMR)', train_id: 7, station_id: 26.2 , longitudeStart:112.744042 , langitudeStart:-7.243142 , longitudeEnd:106.830636 , langitudeEnd:-6.176773},
      { id: 13, name: 'Jakarta(GMR)-Surabaya(SBI)', train_id: 7, station_id: 7.3, longitudeStart:106.830636 , langitudeStart:-6.176773 , longitudeEnd:112.744042 , langitudeEnd:7.243142 },
      { id: 14, name: 'Surabaya(SGU)-Bandung(BDO)', train_id: 8, station_id: 24.1, longitudeStart:112.744042 , langitudeStart:-7.243142 , longitudeEnd:107.602438  , langitudeEnd:-6.914632 },
      { id: 15, name: 'Bandung(BDO)-Surabaya(SGU)', train_id: 8, station_id: 1.6, longitudeStart:107.602438 , langitudeStart:-6.914632 , longitudeEnd:112.752035 , langitudeEnd:-7.265678 },
      { id: 16, name: 'Solo(SLO)-Jakarta(GMR)', train_id: 9, station_id: 22.2, longitudeStart:110.821417 , langitudeStart:-7.557016 , longitudeEnd:106.830636 , langitudeEnd:-6.176773 },
      { id: 17, name: 'Jakarta(GMR)-Solo(SLO)', train_id: 9, station_id: 7.4, longitudeStart:106.830636 , langitudeStart:-6.176773 , longitudeEnd:110.821417 , langitudeEnd:-7.557016 },
      { id: 18, name: 'Solo(SLO)-Jakarta(GMR)', train_id: 10, station_id: 22.3, longitudeStart:110.821417 , langitudeStart:-7.557016 , longitudeEnd:106.830636 , langitudeEnd:-6.176773 },
      { id: 19, name: 'Jakarta(GMR)-Solo(SLO)', train_id: 10, station_id: 7.5, longitudeStart:106.830636 , langitudeStart:-6.176773 , longitudeEnd:110.821417 , langitudeEnd:-7.557016 },
      { id: 20, name: 'Semarang(SMT)-Jakarta(GMR)', train_id: 11, station_id: 21.2, longitudeStart:110.427923 , langitudeStart:-6.964446 , longitudeEnd:106.830636 , langitudeEnd:-6.176773 },
      { id: 21, name: 'Jakarta(GMR)-Semarang(SMT)', train_id: 11, station_id: 7.6 , longitudeStart:106.830636 , langitudeStart:-6.176773,longitudeEnd:110.427923  , langitudeEnd:-6.964446 },
      { id: 22, name: 'Semarang(SMT)-Jakarta(GMR)', train_id: 12, station_id: 21.3, longitudeStart:110.427923 , langitudeStart:-6.964446,longitudeEnd:106.830636 , langitudeEnd:-6.176773  },
      { id: 23, name: 'Jakarta(GMR)-Semarang(SMT)', train_id: 12, station_id: 7.7, longitudeStart:106.830636 , langitudeStart:-6.176773,longitudeEnd:110.427923  , langitudeEnd:-6.964446 },
      { id: 24, name: 'Malang(ML)-Jakarta(GMR)', train_id: 13, station_id: 14.2 , longitudeStart:112.637028 , langitudeStart:-7.977497, longitudeEnd:106.830636 , langitudeEnd:-6.176773 },
      { id: 25, name: 'Jakarta(GMR)-Malang(ML)', train_id: 13, station_id: 7.8 , longitudeStart:106.830636 , langitudeStart:-6.176773, longitudeEnd:112.637028 , langitudeEnd:-7.977497  },
      { id: 26, name: 'Surabaya(SBI)-Jakarta(GMR)', train_id: 14, station_id: 26.3, longitudeStart:112.744042 , langitudeStart:-7.243142, longitudeEnd:106.830636 , langitudeEnd:-6.176773},
      { id: 27, name: 'Jakarta(GMR)-Surabaya(SBI)', train_id: 14, station_id: 7.9, longitudeStart:106.830636 , langitudeStart:-6.176773 , longitudeEnd:112.744042 , langitudeEnd:7.243142 },
      { id: 28, name: 'Bandung(BDO)-Surabaya(SGU)', train_id: 15, station_id: 1.7 , longitudeStart:107.602438 , langitudeStart:-6.914632 , longitudeEnd:112.752035 , langitudeEnd:-7.265678},
      { id: 29, name: 'Surabaya(SGU)-Bandung(BDO)', train_id: 15, station_id: 24.2, longitudeStart:112.744042 , langitudeStart:-7.243142 , longitudeEnd:107.602438  , langitudeEnd:-6.914632 },
      { id: 30, name: 'Yogyakarta(YK)-Jakarta(GMR)', train_id: 16, station_id: 28.1, longitudeStart:110.363487 , langitudeStart:-7.789200,  longitudeEnd:106.830636 , langitudeEnd:-6.176773},
      { id: 31, name: 'Jakarta(GMR)-Yogyakarta(YK)', train_id: 16, station_id: '7.A', longitudeStart:106.830636 , langitudeStart:-6.176773, longitudeEnd:110.363487 , langitudeEnd:-7.789200 },
      { id: 32, name: 'Surabaya(SGU)-Jakarta(GMR)', train_id: 17, station_id: 24.3, longitudeStart:112.744042 , langitudeStart:-7.243142, longitudeEnd:106.830636 , langitudeEnd:-6.176773 },
      { id: 33, name: 'Jakarta(GMR)-Surabaya(SGU)', train_id: 17, station_id: '7.B',longitudeStart:106.830636 , langitudeStart:-6.176773, longitudeEnd:112.752035 , langitudeEnd:-7.265678  },
      { id: 34, name: 'Cilacap(CP)-Jakarta(GMR)', train_id: 18, station_id: 5.1, longitudeStart:109.007070 , langitudeStart:-7.736046, longitudeEnd:106.830636 , langitudeEnd:-6.176773  },
      { id: 35, name: 'Gambir(GMR)-Cilacap(CP)', train_id: 18, station_id: '7.C', longitudeStart:106.830636 , langitudeStart:-6.176773, longitudeEnd:109.007070, langitudeEnd:-7.736046 },
      { id: 36, name: 'Cirebon(CN)-Jakarta(GMR)', train_id: 19, station_id: 6.2, longitudeStart:108.555444 , langitudeStart:-6.705386 , longitudeEnd:106.830636 , langitudeEnd:-6.176773 },
      { id: 37, name: 'Jakarta(GMR)-Cirebon(CN)', train_id: 19, station_id: '7.D', longitudeStart:106.830636 , langitudeStart:-6.176773 , longitudeEnd:108.555444 , langitudeEnd:-6.705386 },
      { id: 38, name: 'Tegal(TG)-Jakarta(GMR)', train_id: 20, station_id: 27.1, longitudeStart:109.142690, langitudeStart:-6.867349 , longitudeEnd:106.830636 , langitudeEnd:-6.176773  },
      { id: 39, name: 'Jakarta(GMR)-Tegal(TG)', train_id: 20, station_id: '7.E', longitudeStart:106.830636 , langitudeStart:-6.176773,longitudeEnd:109.142690, langitudeEnd:-6.867349  },
      { id: 40, name: 'Surabaya(SBI)-Jakarta(PSE)', train_id: 21, station_id: 26.4, longitudeStart:112.744042 , langitudeStart:-7.243142,longitudeEnd:106.844337, langitudeEnd:-6.174732 },
      { id: 41, name: 'Jakarta(PSE)-Surabaya(SBI)', train_id: 21, station_id: 17.1, longitudeStart:106.844337 , langitudeStart:-6.174732 ,longitudeEnd:112.744042, langitudeEnd:-7.243142 },
      { id: 42, name: 'Surabaya(SGU)-Yogyakarta(YK)', train_id: 22, station_id: 24.4, longitudeStart:112.744042 , langitudeStart:-7.243142 , longitudeEnd:110.363487 , langitudeEnd:-7.789200 },
      { id: 43, name: 'Yogyakarta(YK)-Surabaya(SGU)', train_id: 22, station_id: 28.2, longitudeStart:110.363487 , langitudeStart:-7.789200, longitudeEnd:112.752035 , langitudeEnd:-7.265678  },
      { id: 44, name: 'Surabaya(SGU)-Banyuwangi(BW)', train_id: 23, station_id: 24.5,longitudeStart:112.744042 , langitudeStart:-7.243142, longitudeEnd:114.397142 , langitudeEnd:-8.141180 },
      { id: 45, name: 'Banyuwangi(BW)-Surabaya(SGU)', train_id: 23, station_id: 2.1,longitudeStart:114.397142, langitudeStart:-8.141180, longitudeEnd:112.744042  , langitudeEnd:-7.243142},
      { id: 46, name: 'Malang(ML)-Yogyakarta(YK)', train_id: 24, station_id: 14.3, longitudeStart:112.637028 , langitudeStart:-7.977497, longitudeEnd:110.363487 , langitudeEnd:-7.789200 },
      { id: 47, name: 'Yogyakarta(YK)-Malang(ML)', train_id: 24, station_id: 28.3, longitudeStart:110.363487 , langitudeStart:-7.789200,  longitudeEnd:112.637028 , langitudeEnd:-7.977497},
      { id: 48, name: 'Sukabumi(SI)-Bogor(BOO)', train_id: 25, station_id: 23.1, longitudeStart:106.929587 , langitudeStart:-6.925075, longitudeEnd:106.790425 , langitudeEnd:-6.595616 },
      { id: 49, name: 'Bogor(BOO)-Sukabumi(SI)', train_id: 25, station_id: 3.1, longitudeStart:106.790425 , langitudeStart:-6.595616, longitudeEnd:106.929587 , langitudeEnd:-6.925075 },
      { id: 50, name: 'Surabaya(SGU)-Bandung(BDO)', train_id: 26, station_id: 24.6, longitudeStart:112.744042 , langitudeStart:-7.243142 , longitudeEnd:107.602438  , langitudeEnd:-6.914632  },
      { id: 51, name: 'Bandung(BDO)-Surabaya(SGU)', train_id: 26, station_id: 1.8 , longitudeStart:107.602438 , langitudeStart:-6.914632 , longitudeEnd:112.752035 , langitudeEnd:-7.265678},
      { id: 52, name: 'Solo(SLO)-Jakarta(PSE)', train_id: 27, station_id: 22.4, longitudeStart:110.821417 , langitudeStart:-7.557016 , longitudeEnd:106.830636 , langitudeEnd:-6.176773 },
      { id: 53, name: 'Jakarta(PSE)-Solo(SLO)', train_id: 27, station_id: 17.2, longitudeStart:106.830636 , langitudeStart:-6.176773 , longitudeEnd:110.821417 , langitudeEnd:-7.557016 },
      { id: 54, name: 'Yogyakarta(YK)-Jakarta(PSE)', train_id: 28, station_id: 28.4, longitudeStart:110.363487 , langitudeStart:-7.789200,  longitudeEnd:106.830636 , langitudeEnd:-6.176773 },
      { id: 55, name: 'Jakarta(PSE)-Yogyakarta(YK)', train_id: 28, station_id: 17.3 , longitudeStart:106.830636 , langitudeStart:-6.176773, longitudeEnd:110.363487 , langitudeEnd:-7.789200},
      { id: 56, name: 'Kutoarjo(KTA)-Jakarta(PSE)', train_id: 29, station_id: 11.1, longitudeStart:109.907126 , langitudeStart:-7.726044, longitudeEnd:106.844337, langitudeEnd:-6.174732 },
      { id: 57, name: 'Jakarta(PSE)-Kutoarjo(KTA)', train_id: 29, station_id: 17.4, longitudeStart:106.844337 , langitudeStart:-6.174732, longitudeEnd:109.907126, langitudeEnd:-7.726044 },
      { id: 58, name: 'Surabaya(SGU)-Madiun(MN)', train_id: 30, station_id: 24.7,longitudeStart:112.744042 , langitudeStart:-7.243142, longitudeEnd:111.524395 , langitudeEnd:-7.618830},
      { id: 59, name: 'Madiun(MN)-Surabaya(SGU)', train_id: 30, station_id: 13.1,longitudeStart:111.524395 , langitudeStart:-7.618830 , longitudeEnd:112.752035 , langitudeEnd:-7.265678},
      { id: 60, name: 'Solo(SLO)-Yogyakarta(YK)', train_id: 31, station_id: 22.5},
      { id: 61, name: 'Yogyakarta(YK)-Solo(SLO)', train_id: 31, station_id: 28.5},
      { id: 62, name: 'Malang(ML)-Jakarta(PSE)', train_id: 32, station_id: 14.4},
      { id: 63, name: 'Jakarta(PSE)-Malang(ML)', train_id: 32, station_id: 17.5},
      { id: 64, name: 'Malang(ML)-Jakarta(PSE)', train_id: 33, station_id: 14.5},
      { id: 65, name: 'Jakarta(PSE)-Malang(ML)', train_id: 33, station_id: 17.6},
      { id: 66, name: 'Purwosari(PWS)-Jakarta(PSE)', train_id: 34, station_id: 19.1},
      { id: 67, name: 'Jakarta(PSE)-Purwosari(PWS)', train_id: 34, station_id: 17.7},
      { id: 68, name: 'Semarang(SMT)-Jakarta(PSE)', train_id: 35, station_id: 21.4},
      { id: 69, name: 'Jakarta(PSE)-Semarang(SMT)', train_id: 35, station_id: 17.8},
      { id: 70, name: 'Lempuyangan(LPN)-Jakarta(PSE)', train_id: 36, station_id: 12.1},
      { id: 71, name: 'Jakarta(PSE)-Lempuyangan(LPN)', train_id: 36, station_id: 17.9},
      { id: 72, name: 'Lempuyangan(LPN)-Jakarta(PSE)', train_id: 37, station_id: 12.2},
      { id: 73, name: 'Jakarta(PSE)-Lempuyangan(LPN)', train_id: 37, station_id: '17.A'},
      { id: 74, name: 'Kediri(KD)-Merak(MER)', train_id: 38, station_id: 9.1},
      { id: 75, name: 'Merak(MER)-Kediri(KD)', train_id: 38, station_id: 16.1},
      { id: 76, name: 'Malang(ML)-Jakarta(PSE)', train_id: 39, station_id: 14.6},
      { id: 77, name: 'Jakarta(PSE)-Malang(ML)', train_id: 39, station_id: '17.B'},
      { id: 78, name: 'Surabaya(SGU)-Jakarta(PSE)', train_id: 40, station_id: 24.8},
      { id: 79, name: 'Jakarta(PSE)-Surabaya(SGU)', train_id: 40, station_id: '17.C'},
    ];
  }
  //{ id: N, name: '', train_id: 0, station_id: 0 },


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

  calculateAndDisplayRoute() {
    var loc:LatLng;
    var tempLocStart : LatLng[];
    var tempLocEnd : LatLng[];
    let directionsService = new this.google.maps.DirectionsService;
    let directionsDisplay = new this.google.maps.DirectionsRenderer;
   
    this.loadMap();

    this.getLocation().then(res =>{
      loc = new LatLng(res.coords.latitude, res.coords.longitude);
    });

    tempLocStart = this.cities.filter(city => city.longitudeStart,city => city.langitudeStart);
    tempLocEnd = this.cities.filter(city => city.longitudeEnd,city => city.langitudeEnd);

    
    directionsService.route({
      origin: tempLocStart,
      destination: tempLocEnd,
      travelMode: 'DRIVING'
    }, function(response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

}


 /* bagian ngitung jarak 
 angular.module('dynamic-sports.services')
 .factory('geoLocationService', ['$interval', function ($interval) {
   'use strict';
   var watchId;

   return {
     start: function (success, error) {
       watchId = $interval(function () {
         navigator.geolocation.getCurrentPosition(success, error, {enableHighAccuracy: true});
       }, 1000);
     },
     stop: function () {
       if (watchId) {
         $interval.cancel(watchId);
       }
     }
   };
 }]);


 function toRad(value) {
      var RADIANT_CONSTANT = 0.0174532925199433;
      return (value * RADIANT_CONSTANT);
    }

    function calculateDistance(starting, ending) {
      var KM_RATIO = 6371;
      try {
        var dLat = toRad(ending.latitude - starting.latitude);
        var dLon = toRad(ending.longitude - starting.longitude);
        var lat1Rad = toRad(starting.latitude);
        var lat2Rad = toRad(ending.latitude);

        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1Rad) * Math.cos(lat2Rad);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = KM_RATIO * c;
        return d;
      } catch(e) {
        return -1;
      }
    }

*/





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
