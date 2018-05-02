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
  ILatLng,
  Polyline
} from '@ionic-native/google-maps';

import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { BackgroundMode } from '@ionic-native/background-mode';
import { LocalNotifications } from '@ionic-native/local-notifications';
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
  poly: Polyline;
  Start: any;
  End: any;
  speed: any;
  speedTrain: any = 45;
  distance: any;
  dtst: any;
  lat: any;
  lng: any;
  watch: any;
  eta: any;
  keretaTujuan = 0;

  item: any;
  startp: any;
  endp: any;
  latLangAwal: ILatLng;
  latLangAkhir: ILatLng;
  temp: ILatLng;
  public selectedStations: any = [];
  public newAddf: any = [];

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
    public http: Http,
    public backgroundMode:BackgroundMode) {
    this.loadJson();
    this.speed = 0;
    this.eta = 0;
    this.distance = 0;
    this.dtst = 0;
    this.backgroundMode.enable();
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

  clear() {
    this.map.clear();
    this.selectedStations = this.newAddf;
  }

  addRoute() {
    let stationstart: ILatLng = this.Start;
    let stationend: ILatLng = this.End;
    if (this.startp < this.endp) {
      for (var i = this.startp; i <= this.endp; i++) {
        this.selectedStations.push(this.temp = { lat: this.stations[i].Lang, lng: this.stations[i].Long });
      }
    } else {
      for (var i = this.endp; i >= this.startp; i--) {
        this.selectedStations.push(this.temp = { lat: this.stations[i].Lang, lng: this.stations[i].Long });
      }
    }

    let route: ILatLng[] = this.selectedStations;
    this.map.addPolyline({
      points: route,
      'color': '#ff0000',
      'width': 2.5,
      'geodesic': true
    });
    let a1 = this.Start.lat;
    let a2 = this.Start.lng;
    let b1 = this.End.lat;
    let b2 = this.End.lng;
    this.dtst = this.getDistance(a1, a2, b1, b2);
    this.getSpeed();
    this.getETA();
  }

  getLatLangAwal(item) {
    for (var i = 0; i < this.stations.length; i++) {
      if (item == this.stations[i].name) {
        this.startp = i;
        this.Start = this.latLangAwal = { lat: this.stations[i].Lang, lng: this.stations[i].Long };
      }
    }
    console.log(this.latLangAwal);
  }

  getLatLangAkhir(item2) {
    for (var i = 0; i < this.stations.length; i++) {
      if (item2 == this.stations[i].name) {
        this.endp = i;
        this.End = this.latLangAkhir = { lat: this.stations[i].Lang, lng: this.stations[i].Long };
      }
    }
    console.log(this.latLangAkhir);
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

  getNextStations() {
    return this.selectedStation[this.startp + 1];
  }

  getDestinationDistance() {
    if (this.dtst > 1) {
      return Math.floor(this.dtst) + " km";
    }
    else {
      return Math.floor(this.dtst * 1000) + " m";
    }
  }

  loadJson() {
    this.http.get('./assets/data/train.json').map(res => res.json()).subscribe(data => {
      this.trains = data.trains;
    });
  }

  selectedStation(sTrain) {
    for (var i = 0; i < this.trains.length; i++) {
      if (sTrain == this.trains[i].name) {
        this.stations = this.trains[i].station;
      }
    }
  }


  
}
