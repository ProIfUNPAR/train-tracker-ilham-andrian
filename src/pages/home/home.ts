import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';

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
  speedTrain: any = 45;
  distance: any;
  dtst: any;
  lat: any;
  lng: any;
  watch: any;
  eta: any;
  keretaTujuan = 0;

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
    public http: Http) {
    this.loadJson();
  }

  startTracking() {
    let config = {
      desiredAccuracy: 0,
      stationaryRadius: 5,
      distanceFilter: 10,
      debug: true,
      interval: 1000
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
    this.map = this._googleMaps.create(element)
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

  addRoute() {
    let stationstart: ILatLng = { lat: -6.914632, lng: 107.602438 };
    let stationend: ILatLng = { lat: -6.176773, lng: 106.830636 };
    let route: ILatLng[] = [stationstart, stationend];
    this.map.addPolyline({
      points: route,
      'color': '#ff0000',
      'width': 2.5,
      'geodesic': true
    });
    this.dtst = this.getDistance(-6.914632, 107.602438, -6.176773, 106.830636);
    this.eta = this.distance / this.speedTrain;
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

  loadJson() {
    this.http.get('./assets/data/train.json').map(res => res.json()).subscribe(data => {
      this.trains = data.trains;
    });
  }

<<<<<<< HEAD
  selectedStation(sTrain) {
    for (var i = 0; i < this.trains.length; i++) {
      if (sTrain.name = this.trains[i].name) {
        this.stations = this.trains[i].station;
      }
    }
  }
}
=======
 selectedStation(sTrain){
   for(var i = 0;i<this.trains.length;i++){
      if(sTrain == this.trains[i].name){
        this.stations = this.trains[i].station;
      }
   }
   
 }

<<<<<<< HEAD
}
>>>>>>> 085d0c3120a3cef9cf747f58aed8054a32d8f449
=======
}
>>>>>>> 085d0c3120a3cef9cf747f58aed8054a32d8f449
