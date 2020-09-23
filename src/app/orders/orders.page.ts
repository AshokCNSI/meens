import { Component, OnInit, Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, NavigationEnd, NavigationStart  } from '@angular/router';
import{ Validators, FormGroup, FormControl }from'@angular/forms';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { filter } from 'rxjs/operators';
import { RouterserviceService } from '../routerservice.service';
import { AuthenticateService } from '../authentication.service';
import { LoadingService } from '../loading.service';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {

  constructor(
  public alertCtrl: AlertController, 
  public fAuth: AngularFireAuth, 
  private navController: NavController, 
  private router: Router,
  private db: AngularFireDatabase,
  private activatedRoute: ActivatedRoute,
  private routerService: RouterserviceService,
  private authService: AuthenticateService,
  public loading: LoadingService
) { 
  
  }
  
  orderRef: AngularFireObject<any>;
  orderList = [];
  statusList = [];
  isAdmin : boolean = false;
  ngOnInit() {
	  if(this.authService.getUserType() == 'SA' || this.authService.getUserType() == 'A') {
		  this.isAdmin = true;
	  }
	  this.loading.present();
	  firebase.database().ref('/properties/status').once('value').then((snapshot) => {
		  if(snapshot != null) {
			  this.statusList = [];
			  snapshot.forEach(item =>{
				  let a = item.toJSON();
				  this.statusList.push(a);
			  })
		  }
	  });
	  
	  if(this.authService.getUserType() == 'S') {
		  this.db.list('/orders', ref => ref.orderByChild('seller').equalTo(this.authService.getUserID())).snapshotChanges().subscribe((snapshot) => {
			  if(snapshot != null) {
				  this.orderList = [];
				  snapshot.forEach(item => {
					let a = item.payload.toJSON();
					a['index'] = item.key;
					this.orderList.push(a);
					  this.orderList.sort(function (a, b) {
						return (new Date(b.modifieddate).getTime() - new Date(a.modifieddate).getTime());
					  });
				  })
			  }

		});
	} else {
		this.db.list('/orders', ref => ref.orderByChild('createdby').equalTo(this.authService.getUserID())).snapshotChanges().subscribe((snapshot) => {
			  if(snapshot != null) {
				  this.orderList = [];
				  snapshot.forEach(item => {
					let a = item.payload.toJSON();
					a['index'] = item.key;
					this.orderList.push(a);
					  this.orderList.sort(function (a, b) {
						return (new Date(b.modifieddate).getTime() - new Date(a.modifieddate).getTime());
					  });
				  })
			  }
		});
	  }
	   this.loading.dismiss();
  }
  
  async presentAlert(status, msg) {
    const alert = await this.alertCtrl.create({
      header: status,
      message: msg,
	  backdropDismiss : false,
      buttons: [{
          text: 'Ok',
          handler: () => {
            if(status == 'Success') {
				this.navController.navigateRoot('/stock');
			} else if(status == 'Cart'){
				this.navController.navigateRoot('/orders');
			}
	  }}]
    });
    await alert.present();
  }
  
  routeStockDetail(index,productcode,status){
	  this.navController.navigateRoot('/stockdetail',{queryParams : {index : index, productcode : productcode, status : status}});
  }
  
  comp(a, b) {
	return new Date(b.modifieddate).getTime() - new Date(a.modifieddate).getTime();
  }
}
