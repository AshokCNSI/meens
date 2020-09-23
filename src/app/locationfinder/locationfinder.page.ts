import { Component, OnInit, Injectable, Input } from '@angular/core';
import {  MenuController } from '@ionic/angular';

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
import { LocationserviceService } from '../locationservice.service';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';

@Component({
  selector: 'app-locationfinder',
  templateUrl: './locationfinder.page.html',
  styleUrls: ['./locationfinder.page.scss'],
})
export class LocationfinderPage implements OnInit {

  constructor(
  private menuCtrl : MenuController,
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
  private locationService: LocationserviceService) { }

  ngOnInit() {
	  this.menuCtrl.enable(false);
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
  
  updateMyLocation() {
	  this.diagnostic.isLocationEnabled()
	  .then((state) => {
		if (!state){
		  this.presentAlert('Error','Please try again.');
		} else {
		  this.navController.navigateRoot('/home');
		}
	  }).catch(e => this.presentAlert('Error','Something went wrong.'));
  }
}
