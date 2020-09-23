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
import { ModalController  } from '@ionic/angular';
import { TermsPage } from '../terms/terms.page';
import { ContactPage } from '../contact/contact.page';
import { QueriesPage } from '../queries/queries.page';

@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})
export class HelpPage implements OnInit {

  constructor(
  public alertCtrl: AlertController, 
  public fAuth: AngularFireAuth, 
  private navController: NavController, 
  private router: Router,
  private db: AngularFireDatabase,
  private activatedRoute: ActivatedRoute,
  private routerService: RouterserviceService,
  private authService: AuthenticateService,
  public modalController: ModalController) { 
  
  }
 
subject : string;
comments : string;

  ngOnInit() {
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
  
  async presentTermsModal() {
    const modal = await this.modalController.create({
      component: TermsPage,
      cssClass: 'my-custom-class'
    });
	modal.onDidDismiss()
      .then((data) => {
		  
    });
    return await modal.present();
  }
  
  async presentQueriesModal() {
    const modal = await this.modalController.create({
      component: QueriesPage,
      cssClass: 'my-custom-class'
    });
	modal.onDidDismiss()
      .then((data) => {
		  
    });
    return await modal.present();
  }
  
  async presentContactModal() {
    const modal = await this.modalController.create({
      component: ContactPage,
      cssClass: 'my-custom-class'
    });
	modal.onDidDismiss()
      .then((data) => {
		  
    });
    return await modal.present();
  }
  
 postComments() {
	 if(!this.subject || !this.comments) {
		  if(!this.subject) {
			  this.presentAlert('Error','Please enter the subject');
		  } else if(!this.comments) {
			  this.presentAlert('Error','Please enter the comments');
		  } 
	  } else {
		  firebase.database().ref('/queries/').push({
				"subject" : this.subject,
				"comments" : this.comments,
				"createddate" : Date(),
				"createdby":this.authService.getUserID(),
				"modifieddate": Date(),
				"modifiedby":this.authService.getUserID()
		  }).then(
		   res => 
		   {
			   this.presentAlert('Success','Your queries has been successfully posted. Our executive will call you shortly.');
			   this.subject = '';
			   this.comments = '';
		   }
		 ).catch(res => console.log(res))
	  }
 }
 
}
