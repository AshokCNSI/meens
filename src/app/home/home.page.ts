
import { Component, OnInit, ViewChild  } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';

import * as firebase from 'firebase';
import { ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController } from '@ionic/angular';

import { AuthenticateService } from '../authentication.service';
import { LocationserviceService } from '../locationservice.service';
import { LoadingService } from '../loading.service';

import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { NavController } from '@ionic/angular';
import {  MenuController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { map } from 'rxjs/operators';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { MapselectionPage } from '../mapselection/mapselection.page';
import { Storage } from '@ionic/storage';

import { IonSlides } from '@ionic/angular';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {
	
  public productList = [];
  Arr = Array;
  skeletoncount : number = 10;
  productTempList = [];
  norecordstatus = false;
  
  constructor(
  public alertCtrl: AlertController,
  public modalController: ModalController,
  public popoverController : PopoverController,
  public loading: LoadingService,
  private activatedRoute: ActivatedRoute, 
  public fAuth: AngularFireAuth, 
  private authService: AuthenticateService,
  private db: AngularFireDatabase,
  private navController: NavController,
  private menuCtrl : MenuController,
  private geolocation: Geolocation,
  private nativeGeocoder: NativeGeocoder,
  private diagnostic: Diagnostic,
  private locationService: LocationserviceService,
  private storage: Storage
  ) { 
		
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

  ngOnInit() { 
	
	 this.loadData();
	 
	 setTimeout(() => {
		if(this.productList.length == 0) {
			this.norecordstatus = true;
		}
	  }, 10000);
}
  
  ionViewWillEnter() {
	this.menuCtrl.enable(true);
  }

  onSlideChanged(e) {
    
  }

  onSlideChangeStart(event) {
    /** isEnd true when slides reach at end slide */
    event.target.isEnd().then(isEnd => {
      
    });
  }
  
  routeProductDetail(index) {
	  this.navController.navigateRoot('/addproduct',{queryParams : {index : index}});
  }
 
  filterProductList(event) {
	if(event.srcElement.value == null || event.srcElement.value == '') {
		this.productList = this.productTempList;
	} else {
		this.productList = this.productTempList;
		this.productList = this.productList.filter(function(val) {
			return val.title.toLowerCase().indexOf((event.srcElement.value).toLowerCase()) > -1;
		});
	}
  }

	async openMapSelection() {
		const modal = await this.modalController.create({
		  component: MapselectionPage,
		  cssClass: 'my-custom-class',
		  componentProps: {
			pagemode: 'H'
		  }
		});
		modal.onDidDismiss()
		  .then((data) => {
			  if (data !== null) {
				
			  }
		});
		return await modal.present();
  } 
  
  loadData() {
	  setTimeout(() => {
		if(this.authService.getUserID()) {
			this.loadHome();
		} else {
			this.loadData();
		}
	  }, 2000);
  }
  
  loadHome() {
	  this.db.list('/productsforselling', ref => ref.orderByChild('createdby').equalTo(this.authService.getUserID())).snapshotChanges().subscribe((snapshot) => {
	  this.productList = [];
	  this.productTempList = [];
	  snapshot.forEach(item => {
		let a = item.payload.toJSON();
		a['index'] = item.key;
		firebase.database().ref('/properties/products/'+a['productcode']).once('value').then((snapshot) => {
			a['title'] = snapshot.child('title').val();
			a['imagepath'] = snapshot.child('imagepath').val();
			a['details'] = snapshot.child('details').val();
			this.productList.push(a);
			this.productList.sort(function (a, b) {
				return (new Date(b.modifieddate).getTime() - new Date(a.modifieddate).getTime());
			  });
		}).catch((error: any) => {
			
		});
		this.productTempList = this.productList;
		
	  })
	 })
  }
}
