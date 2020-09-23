import { Component, OnInit, Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, NavigationEnd, NavigationStart  } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { filter } from 'rxjs/operators';
import { RouterserviceService } from '../routerservice.service';
import { AuthenticateService } from '../authentication.service';
import { ModalController, NavParams } from '@ionic/angular';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-stockdetail',
  templateUrl: './stockdetail.page.html',
  styleUrls: ['./stockdetail.page.scss'],
})
export class StockdetailPage implements OnInit {

  constructor(
  public alertCtrl: AlertController, 
  public fAuth: AngularFireAuth, 
  private navController: NavController, 
  private router: Router,
  private db: AngularFireDatabase,
  private activatedRoute: ActivatedRoute,
  private routerService: RouterserviceService,
  private authService: AuthenticateService,
  private geolocation: Geolocation,
  private nativeGeocoder: NativeGeocoder,
  private diagnostic: Diagnostic,
  public modalController: ModalController,
  private navParams: NavParams) { 
	this.itemid = this.navParams.data.itemid;
	this.options = this.navParams.data.options;
	this.desc = this.navParams.data.desc;
	this.pagemode = this.navParams.data.pagemode;
	if(this.pagemode == 'O') {
		this.ordervisibility = true;
	}
  }
  
  title : string;
  imagepath : string;
  details : string;
  fishpiecetype = [];
  itemid : string;
  options = [];
  desc : string;
  pagemode : string;
  ordervisibility : boolean = false;
  
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
	  if(!this.options) {
		  firebase.database().ref('/properties/fishpiecetype/').once('value').then((snapshot) => {
				if(snapshot != null) {
					snapshot.forEach(item => {
						let a = item.toJSON();
						a['checked'] = false;
						this.fishpiecetype.push(a);
					})
				}
			})
	  } else {
		  this.fishpiecetype = this.options;
	  }
		
	  firebase.database().ref('/productsforselling/'+this.itemid).once('value').then((snapshot) => {
		if(snapshot != null) {
			firebase.database().ref('/properties/products/'+snapshot.child('productcode').val()).once('value').then((snapshot) => {
				if(snapshot != null) {
					this.title = snapshot.child('title').val();
					this.imagepath = snapshot.child('imagepath').val();
					this.details = snapshot.child('details').val();
				}
			})
		}
	});
  }
  
  updateItem() {
	  this.modalController.dismiss({
		  desc : this.desc,
		  options : this.fishpiecetype
	  })
  }
}

