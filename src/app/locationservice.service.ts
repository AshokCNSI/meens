import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { NavController } from '@ionic/angular';
import * as firebase from 'firebase';
import { AuthenticateService } from './authentication.service';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root'
})
export class LocationserviceService {

  constructor(public navController : NavController,
  private geolocation: Geolocation,
  private nativeGeocoder: NativeGeocoder,
  private diagnostic: Diagnostic,
  private authService: AuthenticateService,
  private loading : LoadingService) { }
  
  latitude : string;
  longitude : string;
  currentLocation : string;
  
  setLatitude(value : string) {
	  this.latitude = value;
  }
  
  getLatitude() {
	  return this.latitude;
  }
  
  setLongitude(value : string) {
	  this.longitude = value;
  }
  
  getLongitude() {
	  return this.longitude;
  }
  
  setCurrentLocation(value : string) {
	  this.currentLocation = value;
  }
  
  getCurrentLocation() {
	  return this.currentLocation;
  }
  
  setCurrentLocationFn() {
	  let options: NativeGeocoderOptions = {
		useLocale: true,
		maxResults: 5
	};
	if(this.getLatitude() == undefined || this.getLatitude() == "" 
		|| this.getLongitude() == undefined || this.getLongitude() == ""
		|| this.getCurrentLocation() == undefined || this.getCurrentLocation() == "") {
		this.geolocation.getCurrentPosition().then((resp) => {
			this.setLatitude((resp.coords.latitude).toString());
			this.setLongitude((resp.coords.longitude).toString());
			this.nativeGeocoder.reverseGeocode(resp.coords.latitude, resp.coords.longitude, options)
			.then((result: NativeGeocoderResult[]) => {
				this.setCurrentLocation(this.generateAddress(result[0]));
			})
			.catch((error: any) => {
				//this.navController.navigateRoot('/locationfinder');
			});
		}).catch((error: any) => {
			//this.navController.navigateRoot('/locationfinder');
		});
	}	
  }
  
  	generateAddress(addressObj) {
		let obj = [];
		let address = "";
		for (let key in addressObj) {
		  obj.push(addressObj[key]);
		}
		obj.reverse();
		for (let val in obj) {
		  if (obj[val].length)
			address += obj[val] + ', ';
		}
		return address.slice(0, -2);
	  }
	  
	  getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
		  var R = 6371; // Radius of the earth in km
		  var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
		  var dLon = this.deg2rad(lon2-lon1); 
		  var a = 
			Math.sin(dLat/2) * Math.sin(dLat/2) +
			Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
			Math.sin(dLon/2) * Math.sin(dLon/2)
			; 
		  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
		  var d = R * c; // Distance in km
		  return d;
		}

		deg2rad(deg) {
		  return deg * (Math.PI/180)
		}
		
		setUserData() {
			this.authService.userDetails().subscribe(res => { 
				if (res !== null) {
					this.authService.setUserName(res.email);
					this.authService.setUserID(res.uid);
					this.authService.setEmailID(res.email);
					this.authService.setIsUserLoggedIn(true);
					firebase.database().ref('/profile/'+res.uid).once('value').then((snapshot) => {
						if(snapshot != null) {
							this.authService.setUserType(snapshot.child('usertype').val());  
							this.authService.setUserName(snapshot.child('firstname').val()+" "+snapshot.child('lastname').val());
						}
					})
				} else {
					this.authService.setIsUserLoggedIn(false);
				}
			  }, err => {
				  console.log('err', err);
			 })
		}
}
