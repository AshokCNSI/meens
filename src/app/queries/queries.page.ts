import { Component, OnInit } from '@angular/core';
import { ModalController,NavParams  } from '@ionic/angular';

import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { filter } from 'rxjs/operators';
import { AuthenticateService } from '../authentication.service';

@Component({
  selector: 'app-queries',
  templateUrl: './queries.page.html',
  styleUrls: ['./queries.page.scss'],
})
export class QueriesPage implements OnInit {

  constructor(public modalController: ModalController,
  public authService: AuthenticateService,
  public alertCtrl : AlertController) { }
  
  queriesList = [];
  answer : string;
  
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
	  if(this.authService.getUserType() == 'SA' || this.authService.getUserType() == 'A') {
		  firebase.database().ref('/queries/').once('value').then((snapshot) => {
			if(snapshot != null) {
				this.queriesList = [];
				snapshot.forEach(item => {
					let a = item.toJSON();
					a['index'] = item.key;
					firebase.database().ref('/profile/'+a['createdby']).once('value').then((snapshot) => {
						if(snapshot != null) {
							a['customername'] = snapshot.child('firstname').val()+" "+snapshot.child('lastname').val();
							a['mobile'] = snapshot.child('mobilenumber').val();
							a['location'] = snapshot.child('lastlocation').val();
							this.queriesList.push(a);
						}
					});
					
				})
			}
		})
	  } else {
		  firebase.database().ref('/queries/').orderByChild('createdby').equalTo(this.authService.getUserID()).once('value').then((snapshot) => {
			if(snapshot != null) {
				snapshot.forEach(item => {
					let a = item.toJSON();
					a['index'] = item.key;
					this.queriesList.push(a);
				})
			}
		})
	  }
  }
  
  dismissModal() {
		this.modalController.dismiss();
    }
	
	postMyAnswer(index) {
		if(!this.answer) {
			 this.presentAlert('Error','Please enter the answer');
	  } else {
		  firebase.database().ref('/queries/'+index).update({
				"answer" : this.answer,
				"modifieddate": Date(),
				"modifiedby":this.authService.getUserID()
		  }).then(
		   res => 
		   {
			   this.presentAlert('Success','Your queries has been answered.');
			   firebase.database().ref('/queries/').once('value').then((snapshot) => {
				if(snapshot != null) {
					this.queriesList = [];
					snapshot.forEach(item => {
						let a = item.toJSON();
						a['index'] = item.key;
						firebase.database().ref('/profile/'+a['createdby']).once('value').then((snapshot) => {
							if(snapshot != null) {
								a['customername'] = snapshot.child('firstname').val()+" "+snapshot.child('lastname').val();
								a['mobile'] = snapshot.child('mobilenumber').val();
								a['location'] = snapshot.child('lastlocation').val();
								this.queriesList.push(a);
							}
						});
						
					})
				}
			})
		   }
		 ).catch(res => console.log(res))
	  }
	}

}
