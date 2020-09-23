import { Component, OnInit } from '@angular/core';
import { ModalController,NavParams  } from '@ionic/angular';

import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { filter } from 'rxjs/operators';
import { AuthenticateService } from '../authentication.service';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.page.html',
  styleUrls: ['./terms.page.scss'],
})
export class TermsPage implements OnInit {

  constructor(public modalController: ModalController,
  public authService: AuthenticateService,
  public alertCtrl : AlertController) { }
  
  termsList = [];
  
  ngOnInit() {
	  firebase.database().ref('/properties/terms').once('value').then((snapshot) => {
			if(snapshot != null) {
				this.termsList = [];
				snapshot.forEach(item => {
					let a = item.toJSON();
					this.termsList.push(a);
				})
			}
		})
  }
  
  dismissModal() {
		this.modalController.dismiss();
    }
}
