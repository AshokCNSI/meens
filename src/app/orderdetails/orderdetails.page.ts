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
import { LoadingService } from '../loading.service';
import { ModalController, NavParams } from '@ionic/angular';
import { Location } from '@angular/common';
import { StockdetailPage } from '../stockdetail/stockdetail.page';
import { LocationserviceService } from '../locationservice.service';
import { PopoverController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-orderdetails',
  templateUrl: './orderdetails.page.html',
  styleUrls: ['./orderdetails.page.scss'],
})
export class OrderdetailsPage implements OnInit {

  constructor(
  public alertCtrl: AlertController, 
  public fAuth: AngularFireAuth, 
  public formBuilder: FormBuilder,
  private navController: NavController, 
  private router: Router,
  private db: AngularFireDatabase,
  private activatedRoute: ActivatedRoute,
  private routerService: RouterserviceService,
  private authService: AuthenticateService,
  public loading: LoadingService,
  private modalController : ModalController,
  private locationService: LocationserviceService,
  private location : Location,
  private navParams: NavParams,
  private popoverController : PopoverController
) { 
  
  }
  Arr = Array;
  skeletoncount : number = 10;
  orderRef: AngularFireObject<any>;
  isAdmin : boolean = false;
  cartList = [];
  dname : string;
  dindex : string;
  dmobile : string;
  dhouseno : string;
  dstreetname : string;
  dlandmark : string;
  deliverycharge : number;
  masalacharge : number;
  totalAmount : number = 0;
  productVisibility : string; 
  oldStatus : string;
  statusList = [];
  assignedto : string;
  latitude : string;
  longitude : string;
  sellerlatitude : string;
  sellerlongitude : string;
  orderid : string;
  seller : string;
  masalaquantity : number;
  currentindex : number;
  shopname : string;
  distance : number;
  currentstatusname :  string;
  ngOnInit() {
	  this.isAdmin = this.authService.getIsAdmin();
	  this.activatedRoute.queryParams.subscribe(params => {
		  this.orderid = this.activatedRoute.snapshot.params['orderid'];
		  firebase.database().ref('/orders/'+this.orderid).once('value').then((snapshot) => {
			  if(snapshot != null) {
					firebase.database().ref('/addressbook/'+snapshot.child('deliveryaddress').val()).once('value').then((snapshot) => {
						if(snapshot != null) {
							this.dindex = snapshot.key;
							this.dname = snapshot.child('name').val();
							this.dmobile = snapshot.child('mobile').val();
							this.dhouseno = snapshot.child('houseno').val();
							this.dstreetname = snapshot.child('streetname').val();
							this.dlandmark = snapshot.child('landmark').val();
							this.latitude = snapshot.child('latitude').val();
							this.longitude = snapshot.child('longitude').val();
						}
					});
					this.deliverycharge = snapshot.child('deliverycharge').val();
					this.masalacharge = snapshot.child('masalacharge').val();
					this.totalAmount = snapshot.child('totalamount').val();
					this.productVisibility = snapshot.child('currentstatus').val();
					firebase.database().ref('/properties/status').once('value').then((snapshot) => {
						  if(snapshot != null) {
							  this.statusList = [];
							  snapshot.forEach(item =>{
								  let a = item.toJSON();
								  if(a['code'] == this.productVisibility) {
									  if(a['index'] > 0) {
										this.currentindex = 1;
										this.currentstatusname = a['name'];
									  } else {
										 this.currentindex = 0; 
										 this.currentstatusname = 'In Progress';
									  }
								  }
								  this.statusList.push(a);
							  })
						  }
					  });
					this.oldStatus = snapshot.child('currentstatus').val();
					this.seller = snapshot.child('seller').val();
					
					this.assignedto = snapshot.child('assignedto').val();
					this.masalaquantity = snapshot.child('masalaquantity').val();
					snapshot.child('items').forEach(item => {
						let a = item.toJSON();
						if(a['options']) {
							a['options'] = Object.values(a['options']);
						}
						this.cartList.push(a);
					})
					
					firebase.database().ref('/profile/'+this.seller).once('value').then((snapshot) => {
					if(snapshot != null) {
						this.sellerlatitude = snapshot.child('latitude').val();
						this.sellerlongitude = snapshot.child('longitude').val();
						this.shopname = snapshot.child('shopname').val();
						this.distance = this.locationService.getDistanceFromLatLonInKm(this.locationService.getLatitude(),this.locationService.getLongitude(),
														snapshot.child('latitude').val(),snapshot.child('longitude').val());
					}
				}).catch((error: any) => {
					
				});
			  }
		  });
	  });
	  
  }
  
  async presentAlert(status, msg) {
    const alert = await this.alertCtrl.create({
      header: status,
      message: msg,
	  backdropDismiss : false,
      buttons: [{
          text: 'Ok',
          handler: () => {
            if(this.authService.getUserType() == 'S' || this.authService.getUserType() == 'C'){
				this.navController.navigateRoot('/orders');
			} else if(this.authService.getUserType() == 'D'){
				this.navController.navigateRoot('/myassignments');
			} else {
				console.log('/orderdetails/'+this.orderid)
				this.router.navigate(['/orderdetails/'+this.orderid]);
			} 
	  }}]
    });
    await alert.present();
  }
  
  routeStockDetail(index,productcode,status){
	  this.navController.navigateRoot('/stockdetail',{queryParams : {index : index, productcode : productcode, status : status}});
  }
  
  deleteThisItem(index) {
	  firebase.database().ref('/cart/'+index).remove().then(data => {
		  this.presentAlert('Delete','Item has been successfully deleted.');
	  })
  }
 
  updateOrder() {
	  this.loading.present();	
	  firebase.database().ref('/orders/'+this.orderid).update({
		"currentstatus": this.productVisibility,
		"modifieddate":new Date().toLocaleString(),
		"modifiedby":this.authService.getUserID(),
		"assignedto" : this.productVisibility == 'DS' || (this.assignedto == this.authService.getUserID() && this.productVisibility != 'WFP') ? this.authService.getUserID() : ""
	  }).then(
	   res => 
	   {
		   this.presentAlert('Status','Status updated successfully.');
	   }
	 )
	 this.loading.dismiss();	
  }
  
  cancelOrder() {
	  this.loading.present();	
	  firebase.database().ref('/orders/'+this.orderid).update({
		"currentstatus": 'CL',
		"modifieddate":new Date(),
		"modifiedby":this.authService.getUserID()
	  }).then(
	   res => 
	   {
		   this.presentAlert('Status','Order cancelled successfully.');
	   }
	 )
	 this.loading.dismiss();	
  }
  
  async openItemDetails(index) {
	const modal = await this.modalController.create({
	  component: StockdetailPage,
	  cssClass: 'stock-detail-modal-css',
	  componentProps: {
		itemid : this.cartList[index].index,
		desc : this.cartList[index].desc,
		options : this.cartList[index].options,
		pagemode : 'O'
	  }
	});
	await modal.present();
  }
  
}