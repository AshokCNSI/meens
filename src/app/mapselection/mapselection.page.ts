import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { Location } from '@angular/common';
import { ModalController, NavParams } from '@ionic/angular';
import { LocationsearchPage } from '../locationsearch/locationsearch.page';
import { AuthenticateService } from '../authentication.service';
import { LocationserviceService } from '../locationservice.service';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import * as firebase from 'firebase';
import {  MenuController } from '@ionic/angular';

declare var google;

@Component({
  selector: 'app-mapselection',
  templateUrl: './mapselection.page.html',
  styleUrls: ['./mapselection.page.scss'],
})
export class MapselectionPage implements OnInit {
  
  @ViewChild('map',  {static: false}) mapElement: ElementRef;
  map: any;
  address:string;
  addressA : string[];
  lat: string;
  long: string;  
  autocomplete: { input: string; };
  autocompleteItems: any[];
  location: any;
  placeid: any;
  GoogleAutocomplete: any;
  current_location : string = "";
  current_lat : string = "";
  current_long : string = "";
  isHidden : boolean = false;
  name : string;
  mobile : string;
  houseno : string;
  streetname : string;
  landmark : string;
  latitude : string;
  longitude : string;
  customeraddress : string;
  pageMode : string;
  
  constructor(
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,    
    public zone: NgZone,
	public locationR : Location,
	public modalController: ModalController,
	public alertCtrl: AlertController, 
	private navController: NavController, 
	private authService: AuthenticateService,
	private locationService: LocationserviceService,
	private menuCtrl : MenuController,
	private navParams: NavParams
  ) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
	this.pageMode = this.navParams.data.pagemode;
  }
 
  //LOAD THE MAP ONINIT.
  ngOnInit() {
	  this.authService.userDetails().subscribe(res => { 
	  if (res !== null) {
		firebase.database().ref('/profile/'+res.uid).once('value').then((snapshot) => {
			if(snapshot != null) {
				if(snapshot.child('latitude').val() == null 
					|| snapshot.child('latitude').val() == undefined 
					|| snapshot.child('latitude').val() == "") {
					this.isHidden = true;
					this.menuCtrl.enable(false);
				} 
			}
		});
	  } 
	}, err => {
	  console.log('err', err);
	});
    this.loadMap();    
  }
  
  async presentAlert(status, msg) {
    const alert = await this.alertCtrl.create({
      header: status,
      message: msg,
	  backdropDismiss : false,
      buttons: ['Ok']
    });
    await alert.present();
  }

  //LOADING THE MAP HAS 2 PARTS.
  loadMap() {
    //FIRST GET THE LOCATION FROM THE DEVICE.
    this.geolocation.getCurrentPosition().then((resp) => {
      let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
		panControl: false,
		zoomControl: false,
		mapTypeControl: false,
		scaleControl: false,
		streetViewControl: false,
		overviewMapControl: false,
		rotateControl: false,
		disableDefaultUI: true
      } 
      
      //LOAD THE MAP WITH THE PREVIOUS VALUES AS PARAMETERS.
      this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude); 
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
	  
      //this.addMarker(this.map);	  
      this.map.addListener('tilesloaded', () => {
        console.log('accuracy',this.map, this.map.center.lat());
        this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng())
        this.lat = this.map.center.lat()
        this.long = this.map.center.lng()
		this.current_lat = this.map.center.lat();
		this.current_long = this.map.center.lng();
		this.current_location = this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng());
		this.addressA = this.current_location.split(",");
      }); 
    }).catch((error) => {
      console.log('Error getting location', error);
	  this.current_lat = "";
	  this.current_long = "";
	  this.current_location = 'No address found.';
    });
  }

  
  getAddressFromCoords(lattitude, longitude) : string {
    console.log("getAddressFromCoords "+lattitude+" "+longitude);
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5    
    }; 
    this.nativeGeocoder.reverseGeocode(lattitude, longitude, options)
      .then((result: NativeGeocoderResult[]) => {
        this.address = "";
        let responseAddress = [];
        for (let [key, value] of Object.entries(result[0])) {
          if(value.length>0)
          responseAddress.push(value); 
        }
        responseAddress.reverse();
        for (let value of responseAddress) {
          this.address += value+", ";
        }
        this.address = this.address.slice(0, -2);
		return this.address;
      })
      .catch((error: any) =>{ 
        this.address = "Address Not Available!";
		this.current_lat = "";
		this.current_long = "";
		this.current_location = 'No address found.';
      });
		return this.address	  
  }

  //FUNCTION SHOWING THE COORDINATES OF THE POINT AT THE CENTER OF THE MAP
  ShowCords(){
    alert('lat' +this.lat+', long'+this.long )
  }
  
  //AUTOCOMPLETE, SIMPLY LOAD THE PLACE USING GOOGLE PREDICTIONS AND RETURNING THE ARRAY.
  UpdateSearchResults(){
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
    (predictions, status) => {
      this.autocompleteItems = [];
      this.zone.run(() => {
        predictions.forEach((prediction) => {
          this.autocompleteItems.push(prediction);
        });
      });
    });
  }
  
  //wE CALL THIS FROM EACH ITEM.
  SelectSearchResult(item) {
    ///WE CAN CONFIGURE MORE COMPLEX FUNCTIONS SUCH AS UPLOAD DATA TO FIRESTORE OR LINK IT TO SOMETHING
    alert(JSON.stringify(item))      
    this.placeid = item.place_id
  }
  
  
  //lET'S BE CLEAN! THIS WILL JUST CLEAN THE LIST WHEN WE CLOSE THE SEARCH BAR.
  ClearAutocomplete(){
    this.autocompleteItems = []
    this.autocomplete.input = ''
  }
 
  //sIMPLE EXAMPLE TO OPEN AN URL WITH THE PLACEID AS PARAMETER.
  GoTo(){
    return window.location.href = 'https://www.google.com/maps/search/?api=1&query=Google&query_place_id='+this.placeid;
  }
  
  addMarker(map:any){
	let marker = new google.maps.Marker({
	  map: map,
	  animation: google.maps.Animation.DROP,
	  position: map.getCenter()
	});
	let content = "<h4>Information!</h4>";
	this.addInfoWindow(marker, content);
  }
  
  addInfoWindow(marker, content){

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }
  
  goBack() {
	  this.locationR.back();
  }
  
  async openAddressBar() {
	  const modal = await this.modalController.create({
      component: LocationsearchPage,
      cssClass: 'my-custom-class'
    });
	modal.onDidDismiss()
      .then((data) => {
		  if (data !== null) {
			this.address = data.data.description; 
			this.current_location = this.address;
			this.addressA = this.address.split(",")			
			let options: NativeGeocoderOptions = {
			  useLocale: true,
			  maxResults: 5    
			}; 
			this.nativeGeocoder.forwardGeocode(this.address, options)
			.then((result: NativeGeocoderResult[]) => {
				let current_lat = result[0].latitude;
				let current_long = result[0].longitude;
				
				let latLng = new google.maps.LatLng(current_lat, current_long);
				  let mapOptions = {
					center: latLng,
					zoom: 15,
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					panControl: false,
					zoomControl: false,
					mapTypeControl: false,
					scaleControl: false,
					streetViewControl: false,
					overviewMapControl: false,
					rotateControl: false,
					disableDefaultUI: true
				  } 
				  
				  //LOAD THE MAP WITH THE PREVIOUS VALUES AS PARAMETERS.
				  this.getAddressFromCoords(current_lat, current_long); 
				  this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
				  //this.addMarker(this.map);	  
				  this.map.addListener('tilesloaded', () => {
					console.log('accuracy',this.map, this.map.center.lat());
					this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng())
					this.lat = this.map.center.lat()
					this.long = this.map.center.lng()
					this.current_lat = this.map.center.lat();
					this.current_long = this.map.center.lng();
				  }); 	
			})
			.catch((error: any) => {
				
			});
		  }
    });
    await modal.present();
  }
  
  closeModal() {
	  this.modalController.dismiss();
  }
  
  confirmMyLocation() {
	  if(this.current_lat != undefined && this.current_lat != "" 
		&& this.current_long != undefined && this.current_long != ""
		&& this.current_location != undefined && this.current_location != "") {
			firebase.database().ref('/profile/'+this.authService.getUserID()).update({
			   "latitude" : this.current_lat,
			   "longitude" : this.current_long,
			   "lastlocation" : this.current_location,
			   "modifieddate": Date(),
			   "modifiedby":this.authService.getUserID()
		  }).then(
		   res => 
		   {
			   this.locationService.setLatitude(this.current_lat);
				this.locationService.setLongitude(this.current_long);
				this.locationService.setCurrentLocation(this.current_location);
				this.modalController.dismiss();
			   this.navController.navigateRoot('/home');
		   }
		 ).catch(error => {
			this.presentAlert('Error',error);
		  });
		} else {
			this.presentAlert('Error','No address found');
		}
  }
  
}
