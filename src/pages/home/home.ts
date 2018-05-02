import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';

import {
  GoogleMaps,
  GoogleMap,
  CameraPosition,
  LatLng,
  GoogleMapsEvent,
  Marker,
  MarkerOptions,
  ILatLng
} from '@ionic-native/google-maps';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { NgZone } from '@angular/core';
import { mapStyle } from './mapStyle';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import { Http } from '@angular/http';
import { HttpModule } from '@angular/http'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('map') mapElement: ElementRef;
  map: GoogleMap;
  Start: any;
  End: any;
  speed: any;
  distance: any;
  dtst: any;
  lat: any;
  lng: any;
  watch: any;
  eta: any;
  resp: any;
  desti: any

  speedTrain: any = 45;
  timestamp: any = [];
  poslat: any = [];
  poslong: any = [];

  kereta = 0;
  count = 0;
  tujuan = 0;

  gmLocation: { lat: number, lng: number } = { lat: -6.917464, lng: 107.619123 };

  //-----hardcode kereta---------//
  trains = [];
  stations = [];
  public google: any;
  public sTrain: any;
  public sStation: any;
  //-----hardcode kereta (pindahin ke json)---------//

  constructor(public navCtrl: NavController,
    public backgroundGeolocation: BackgroundGeolocation,
    public zone: NgZone,
    private _googleMaps: GoogleMaps,
    private _geoLoc: Geolocation,
    private notif: LocalNotifications,
    private platform: Platform,
    public http: Http) {
    this.loadJson();
    this.speed = 0;
    this.eta = 0;
    this.distance = 0;
    this.dtst = 0;
  }

  startTracking() {
    let config = {
      desiredAccuracy: 1000,
      stationaryRadius: 5,
      distanceFilter: 10,
      debug: true,
      interval: 500
    };
    this.backgroundGeolocation.configure(config).subscribe((location) => {
      this.zone.run(() => {
        this.lat = location.latitude;
        this.lng = location.longitude;
        this.speed = (location.speed * 3600) / 1000;
      });
    }, (err) => {
      console.log(err);
    });
    this.backgroundGeolocation.start();
    let options = {
      frequency: 1000,
      enableHighAccuracy: true
    };

    this.watch = this._geoLoc.watchPosition(options).filter((p) => p.coords !== undefined)
      .subscribe((position: Geoposition) => {
        //console.log(position);
        this.zone.run(() => {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
        });
      });
  }

  stopTracking() {
    console.log('stopTracking');
    this.backgroundGeolocation.finish();
    this.watch.unsubscribe();
  }

  ngAfterViewInit() {
    let loc: LatLng;
    this.initMap();
    //once the map is ready move
    //camera into position
    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
      //Get User location
      this.getLocation().then(res => {
        //Once location is gotten, set the location on the camera.
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
  initMap() {
    let element = this.mapElement.nativeElement;
    let time = new Date().getHours();
    let style = [];

    //Change Style to night between 7pm to 5am
    if (this.isNight()) {
      style = mapStyle
    }

    this.map = this._googleMaps.create(element, { styles: style });
  }

  isNight() {
    //Returns true if the time is between
    //7pm to 5am
    let time = new Date().getHours();
    return (time > 5 && time < 18) ? false : true;
  }

  //Get current user location
  getLocation() {
    return this._geoLoc.getCurrentPosition();
  }

  //Moves the camera to any location
  moveCamera(loc: LatLng) {
    let options: CameraPosition<LatLng> = {
      //specify center of map
      target: loc,
      zoom: 10,
      tilt: 15
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

  addMarker(position) { // To Add Marker
    this.map.clear();
    this.addPolyLine();
    var marker = this.map.addMarker({
      position: position,
      map: this.map
    });
  }

  addRoute() {
    this.addPolyLine();
    this.getSpeed();
    this.getETA();
  }

  addPolyLine() {
    var route = new Array();
    for (var j = 0; j < this.stations.length; j++) {
      var pos = { lat: this.stations[j].Lat, lng: this.stations[j].Long };
      route.push(pos);
    }
    this.map.addPolyline({
      points: route,
      'color': '#ff0000',
      'width': 2.5,
      'geodesic': true
    });

  }

  onLocateUser() {
    this._geoLoc.watchPosition().subscribe((resp) => {
      this.timestamp.push(new Date());

      this.gmLocation.lat = resp.coords.latitude;
      this.poslat.push(this.gmLocation.lat);
      this.gmLocation.lng = resp.coords.longitude;
      this.poslong.push(this.gmLocation.lng);

      if (this.count > 0) {
        var jarak = this.getDistance(this.poslat[this.count - 1], this.poslong[this.count - 1], this.poslat[this.count], this.poslong[this.count]);
        var diff = (this.timestamp[this.count] - this.timestamp[this.count - 1]) / 1000;
        this.speed = jarak * 3600 / (diff);
        if (this.speed > 90) {
          this.speed = 90;
        }
      }
      this.count++;

      const loc = new this.google.maps.LatLng(this.gmLocation.lat, this.gmLocation.lng);
      this.distance = this.getDistance(this.gmLocation.lat, this.gmLocation.lng, this.stations[this.tujuan].Lat, this.stations[this.tujuan].Long);
      this.dtst = this.getDistance(this.gmLocation.lat, this.gmLocation.lng, this.stations[this.tujuan].Lat, this.stations[this.tujuan].Long);
      for (var z = this.tujuan; z < this.stations.length - 2; z++) {
        this.dtst = this.dtst + this.getDistance(this.stations[z].Lat, this.stations[z].Long, this.stations[z + 1].Lat, this.stations[z + 1].Long);
      }
      if (this.speed < 38) {
        this.eta = this.dtst / 38;
      } else {
        this.eta = this.dtst / this.speed;
      }
      if (this.distance < 0.1) {
        if (this.tujuan < this.stations.length - 1) {
          this.tujuan++;
          this.notif.clearAll();
          this.desti = this.stations[this.tujuan].nama;
        } else {
          this.desti = "Anda telah di statiun tujuan terakhir"
          this.distance = "0km";
          this.dtst = "0km";
        }
      }
      else if (this.distance < 0.5) {
        this.notif.clearAll();
        this.alarmSampai();

      } else if (this.distance < 0.7) {
        this.alarmAkanSampai();
      }
    });
  }

  mulaiDariStatiun(statiun) {
    for (var i = 0; i < this.stations.length; i++) {
      if (statiun == this.stations[i].nama) {
        this.tujuan = i;
      }
    }
    if (this.tujuan < this.stations.length - 1) {
      this.tujuan++;
      this.desti = this.stations[this.tujuan].nama;
    } else {
      this.desti = "Anda telah di statiun tujuan terakhir"
      this.distance = "0km";
      this.dtst = "0km";
    }
    const stat = new this.google.maps.LatLng(this.stations[this.tujuan].Lat, this.stations[this.tujuan].Long);
    this.addMarker(stat);
    this.onLocateUser();
  }

  getJarakStatiunTerdekat() {
    if (this.distance > 1) {
      return Math.floor(this.distance) + " km";
    }
    else {
      return Math.floor(this.distance * 1000) + " m";
    }
  }

  getJarakStatiunAkhir() {
    if (this.dtst > 1) {
      return Math.floor(this.dtst) + " km";
    }
    else {
      return Math.floor(this.dtst * 1000) + " m";
    }
  }

  getDistance(lat1, lng1, lat2, lng2) {
    let R = 6371; // Radius of the earth in km
    let dLat = (lat2 - lat1) * (Math.PI / 180);  // deg2rad below
    let dLng = (lng2 - lng1) * (Math.PI / 180);
    let a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)
      ;
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let dist = R * c; // Distance in km
    return dist;
  }

  getETA() {
    if (this.speed < 45) {
      this.eta = this.dtst / 45;
    } else {
      this.eta = this.dtst / this.speed;
    }
    if (this.eta > 1) {
      return Math.floor(this.eta) + " hour " + Math.floor((this.eta - (Math.floor(this.eta))) * 60) + " minute";
    } else {
      return Math.floor(this.eta * 60) + " minute";
    }

  }

  getSpeed() {
    return Math.floor(this.speed) + " kmh";
  }

  loadJson() {
    this.http.get('./assets/data/train.json').map(res => res.json()).subscribe(data => {
      this.trains = data.trains;
    });
  }

  selectedStation(sTrain) {
    for (var i = 0; i < this.trains.length; i++) {
      if (sTrain == this.trains[i].name) {
        this.kereta = i;
        this.stations = this.trains[i].station;
      }
    }
  }

  alarmAkanSampai() {
    this.platform.ready().then(() => {
      this.notif.schedule({
        id: 1,
        title: 'Alert',
        text: 'Anda akan segera tiba di ' + this.stations[this.tujuan].nama,
        trigger: { at: new Date(new Date().getTime() + 100) }
      });
    });
  }

  alarmSampai() {
    this.platform.ready().then(() => {
      this.notif.schedule({
        id: 1,
        title: 'Alert',
        text: 'Anda telah tiba di ' + this.stations[this.tujuan].nama,
        trigger: { at: new Date(new Date().getTime() + 100) }
      });
    });
  }
}
