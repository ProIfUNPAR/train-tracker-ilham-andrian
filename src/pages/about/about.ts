import { Http } from '@angular/http';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, Component } from '@angular/core';
import { NavController } from 'ionic-angular';


@NgModule({
    imports: [HttpModule]
})

@Component({
    selector: 'page-about',
    templateUrl: 'about.html',
})
export class AboutPage {

    public trains: any[];
    public stations: any[];
    public cities: any[];
    public selectedStations: any[];
    public selectedCities: any[];
    public sTrain: any;
    public sStation: any;

    appName = 'Ionic App';
    constructor(public navCtrl: NavController, public http: Http) {
        this.initializeTrain();
        this.initializeStation();
    }

    initializeTrain() {
        //ubah dtabase stasiun gaboleh duplikat koor di stasiun
        this.trains = [
            { id: 1, name: '1.Argo Parahyangan', station_id: [1,2,3,4] },
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
            { id: 48, name: '48.Kutojaya Utara' },
            { id: 49, name: '49.Sri Tanjung' },
            { id: 50, name: '50.Tawang Jaya' },
            { id: 51, name: '51.Kutojaya Selatan' },
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

        this.stations = [
            { id: 1, name: 'Bandung (BDO)',lat:-6.914632,long:107.602438 },
            { id: 2, name: 'Banyuwangi Baru (BW)',lat:-7.243142,long:112.744042 },
            { id: 3, name: 'Bogor (BOO)',lat:-6.595616,long:106.790425  },
            { id: 4, name: 'Cianjur (CJ)',lat:-6.824585,long:107.142728 },
            { id: 5, name: 'Cilacap (CP)',lat:-7.736046,long:109.00707 },
            { id: 6, name: 'Cirebon (CN)',lat:-6.705386,long:108.555444 },
            { id: 7, name: 'Jakarta Gambir (GMR)',lat:-6.176773,long:106.830636 },
            { id: 8, name: 'Jember (JR)',lat:-8.164787,long:113.703603 },
            { id: 9, name: 'Kediri (KD)',lat:-7.81723,long:112.015549 },
            { id: 10, name: 'Kiara Condong(KAC)',lat:-6.924956,long:107.646302 },
            { id: 11, name: 'Kutoarjo (KTA)',lat:-7.726044,long:109.907126 },
            { id: 12, name: 'Lempuyangan (LPN)',lat:-7.79023,long:110.375782 },
            { id: 13, name: 'Madiun (MN)',lat:-7.61883,long:111.524395 },
            { id: 14, name: 'Malang (ML)',lat:-7.977497,long:112.637028 },
            { id: 15, name: 'Malang Kota lama (MLK)',lat:-7.994869,long:112.632595 },
            { id: 16, name: 'Merak (MER)',lat:-5.930155,long:112.632595 },
            { id: 17, name: 'Jakarta Pasar Senen (PSE)',lat:-6.174953,long:106.845401 },
            { id: 18, name: 'Purwokerto (PWT)',lat:-7.419224,long:105.996852 },
            { id: 19, name: 'Purwosari (PWS)',lat:-7.561684,long:106.845401 },
            { id: 20, name: 'Semarang Poncol (SMC)',lat:-6.972837,long:109.221922 },
            { id: 21, name: 'Semarang Tawang (SMT)',lat:-6.964446,long:110.796510 },
            { id: 22, name: 'Solo Balapan (SLO)',lat:-7.557016,long:110.821417 },
            { id: 23, name: 'Sukabumi (SI)',lat:-6.925075,long:106.929587 },
            { id: 24, name: 'Surabaya Gubeng (SGU)',lat:-7.265678,long:112.752035 },
            { id: 25, name: 'Surabaya Kota (SB)',lat:-7.243142,long: 112.744042},
            { id: 26, name: 'Surabaya Pasarturi (SBI)', lat:-7.248603,long:112.731504},
            { id: 27, name: 'Tegal (TG)',lat:-6.867349,long:109.14269 },
            { id: 28, name: 'Yogyakarta (YK)',lat:-7.789200,long:110.363487 },
        ];
    }

    setDistrictValues(sTrain) {
        this.selectedStations = this.stations.filter(station => station.id == sTrain.tracks)
        
    }


}
