import { Component, OnInit } from '@angular/core';
import { ModalController,NavParams  } from '@ionic/angular';

import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { filter } from 'rxjs/operators';
import { AuthenticateService } from '../authentication.service';
import { LocationserviceService } from '../locationservice.service';

@Component({
  selector: 'app-aboutme',
  templateUrl: './aboutme.page.html',
  styleUrls: ['./aboutme.page.scss'],
})
export class AboutmePage implements OnInit {

  constructor(public modalController: ModalController,
  public authService: AuthenticateService,
  public alertCtrl : AlertController,
  private navController : NavController,
  private locationService: LocationserviceService,) { }
  
  
  async presentAlert(status, msg) {
    const alert = await this.alertCtrl.create({
      header: status,
      message: msg,
      buttons: ['Ok'],
	  backdropDismiss : false,
    });
    await alert.present();
  }
  
  ngOnInit() {
	  firebase.database().ref('/profile/'+this.authService.getUserID()).once('value').then((snapshot) => {
		if(snapshot != null) {
			
		}
	});
  }
  
	logout() {
	  this.authService.logoutUser()
      .then(res => {
        console.log(res);
		this.authService.setUserID("");
		this.authService.setEmailID("");
		this.authService.setIsUserLoggedIn(false);
		this.authService.setUserType("");  
		this.authService.setUserName("");  
		this.locationService.setLatitude("");
		this.locationService.setLongitude("");
		this.locationService.setCurrentLocation("");
		this.locationService.navController.navigateRoot('/home');
      })
      .catch(error => {
        console.log(error);
      })
  }

}
