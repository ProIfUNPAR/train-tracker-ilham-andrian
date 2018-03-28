import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {

  public states: any[];
  public districts: any[];
  public cities: any[];
  
  public selectedDistricts: any[];
  public selectedCities: any[];
  
  public sState: any;
  public sDistrict: any;
  
  appName = 'Ionic App';


  constructor(public navCtrl: NavController) {
    this.initializeState();
    this.initializeDistrict();
    this.initializeCity();
  }


  

 initializeState(){
  this.states = [
      {id: 1, name: 'Melaka'},
      {id: 2, name: 'Johor'},
      {id: 3, name: 'Selangor'}
  ];
  }
  
   initializeDistrict(){
  this.districts = [
      {id: 1, name: 'Alor Gajah', state_id: 1, state_name: 'Melaka'},
      {id: 2, name: 'Jasin', state_id: 1, state_name: 'Melaka'},
      {id: 3, name: 'Muar', state_id: 2, state_name: 'Johor'},
      {id: 4, name: 'Segamat', state_id: 2, state_name: 'Johor'},
      {id: 5, name: 'Shah Alam', state_id: 3, state_name: 'Selangor'},
      {id: 7, name: 'Klang', state_id: 3, state_name: 'Selangor'}
  ];
  }
  
   initializeCity(){
  this.cities = [
      {id: 1, name: 'City of Alor Gajah 1', state_id: 1, district_id: 1},
      {id: 2, name: 'City of Alor Gajah 2', state_id: 1, district_id: 1},
      {id: 3, name: 'City of Jasin 1', state_id: 1, district_id: 2},
      {id: 4, name: 'City of Muar 1', state_id: 2, district_id: 3},
      {id: 5, name: 'City of Muar 2', state_id: 2, district_id: 3},
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
  

  
}





