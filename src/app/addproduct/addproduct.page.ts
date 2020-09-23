import { Component, OnInit, Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, NavigationEnd, NavigationStart  } from '@angular/router';
import{ Validators, FormBuilder, FormGroup, FormControl }from'@angular/forms';

import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { filter } from 'rxjs/operators';
import { RouterserviceService } from '../routerservice.service';
import { AuthenticateService } from '../authentication.service';
import { ModalController } from '@ionic/angular';
import { LoadingService } from '../loading.service';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.page.html',
  styleUrls: ['./addproduct.page.scss'],
})
export class AddproductPage implements OnInit {

  constructor(
  public alertCtrl: AlertController, 
  public fAuth: AngularFireAuth,   
  private navController: NavController,
  public formBuilder: FormBuilder,
  private router: Router,
  private db: AngularFireDatabase,
  private activatedRoute: ActivatedRoute,
  private routerService: RouterserviceService,
  private authService: AuthenticateService,
  public modalController: ModalController,
  public loading: LoadingService,
  public location : Location) { 
  
  }
  isSubmitted = false;
  fishcategortList = [];
  subcategoryList = [];
  productList = [];
  available : string = "Y";
  discount : string = "Y";
  discountprice : number = 0;
  price : number = 0;
  fishsize : string[] = ['s','m'];
  category : string;
  subcategory : string;
  stock :number = 0;
  title : string;
  imagepath : string;
  details : string;
  index : string;
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
	  this.activatedRoute.queryParams.subscribe(params => {
		  this.index = params['index'];
		  if(this.index != undefined && this.index != "") {
			  firebase.database().ref('/productsforselling/'+this.index).once('value').then((snapshot) => {
				  this.available = snapshot.child('available').val();
				  this.stock = snapshot.child('stock').val();
				  this.discountprice = snapshot.child('discountprice').val();
				  this.discount = snapshot.child('discount').val();
				  this.price = snapshot.child('price').val();
				  this.fishsize = Array.from(snapshot.child('fishsize').val());
				  this.subcategory = snapshot.child('productcode').val();
				  firebase.database().ref('/properties/products/'+this.subcategory).once('value').then((snapshot) => {
						this.title = snapshot.child('title').val();
						this.details = snapshot.child('details').val();
						this.imagepath = snapshot.child('imagepath').val();
					})
				  
			  });
		  }
		});
		
	  firebase.database().ref('/properties/fishcategory').once('value').then((snapshot) => {
		  this.fishcategortList = [];
		  snapshot.forEach(item => {
			let a = item.toJSON();
			this.fishcategortList.push(a);
		  })

	  });
	  
	  firebase.database().ref('/productsforselling/').orderByChild('createdby').equalTo(this.authService.getUserID()).once('value').then((snapshot) => {
		  this.productList = [];
		  snapshot.forEach(item => {
			let a = item.toJSON();
			a['$key'] = item.key;
			this.productList.push(a);
		  })
	  });
  }
  
  formData = this.formBuilder.group({
	   available: ['', [Validators.required]],
	   discount: ['', [Validators.required]],
	   discountprice: ['', [Validators.required]],
	   price: ['', [Validators.required]],
	   fishsize: ['', [Validators.required]],
	   stock: ['', [Validators.required]]
	});
	
	get errorControl() {
		return this.formData.controls;
	  }
	  
  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }
  
  selectCategory(entry) {
	  firebase.database().ref('/properties/products/').orderByChild('category').equalTo(this.category).once('value').then((snapshot) => {
		  this.subcategoryList = [];
		  snapshot.forEach(item => {
			let a = item.toJSON();
			let addstatus = false;
			this.productList.forEach(item => {
				if(item.productcode == a['productcode']) {
					addstatus = true;
				}
			})
			if(!addstatus) {
				this.subcategoryList.push(a);
			}
		  })
	  });
  }
  
  selectSubCategory($event) {
	  this.subcategoryList.forEach(item => {
		if(item.productcode == this.subcategory) {
			this.title = item.title;
			this.details = item.details;
			this.imagepath = item.imagepath;			
		}
	  })
  }
  
  addProduct() {
	  this.isSubmitted = true;
	  if (!this.formData.valid) {
		return false;
	  } else {	
		  if(this.index != undefined && this.index != "") {
			  this.loading.present();
			  firebase.database().ref('/productsforselling/'+this.index).update({
				"available" : this.available,
				"discount" : this.discount,
				"discountprice" : this.discountprice,
				"price" : this.price,
				"fishsize" : (this.fishsize).toString(),
				"stock" :this.stock,
				"modifieddate": Date(),
				"modifiedby":this.authService.getUserID()
			  }).then(
			   res => 
			   {
				   this.loading.dismiss();
				   this.presentAlert('Success','Product updated successfully.');
				   this.navController.navigateRoot('/mysellingproducts');
			   }
			 ).catch((error: any) => {
				 this.loading.dismiss();
				this.presentAlert('Error',error);
			});
		  } else {
			  this.loading.present();
			  firebase.database().ref('/productsforselling/').push({
				"available" : this.available,
				"discount" : this.discount,
				"discountprice" : this.discountprice,
				"price" : this.price,
				"fishsize" : (this.fishsize).toString(),
				"category" : this.category,
				"productcode" : this.subcategory,
				"stock" :this.stock,
				"createddate" : Date(),
				"createdby":this.authService.getUserID(),
				"modifieddate": Date(),
				"modifiedby":this.authService.getUserID()
			  }).then(
			   res => 
			   {
				   this.loading.dismiss();
				   this.presentAlert('Success','Product added successfully.');
				   this.navController.navigateRoot('/mysellingproducts');
			   }
			 ).catch((error: any) => {
				 this.loading.dismiss();
				this.presentAlert('Error',error);
			});
		  }
	  }
  }

}
