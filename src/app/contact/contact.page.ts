import { Component, OnInit } from '@angular/core';
import { ModalController,NavParams  } from '@ionic/angular';

import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { filter } from 'rxjs/operators';
import { AuthenticateService } from '../authentication.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {

 constructor(public modalController: ModalController,
  public authService: AuthenticateService,
  public alertCtrl : AlertController) { }
  
  contactList = [];
  
  ngOnInit() {
	  firebase.database().ref('/properties/contact').once('value').then((snapshot) => {
			if(snapshot != null) {
				this.contactList = [];
				snapshot.forEach(item => {
					let a = item.toJSON();
					this.contactList.push(a);
				})
			}
		})
  }
  
  dismissModal() {
		this.modalController.dismiss();
    }

}
