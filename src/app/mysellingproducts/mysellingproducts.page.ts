import { Component, OnInit, ViewChild  } from '@angular/core';
import * as firebase from 'firebase';
import { ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthenticateService } from '../authentication.service';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { NavController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { AddproductPage } from '../addproduct/addproduct.page';
import { LoadingService } from '../loading.service';

@Component({
  selector: 'app-mysellingproducts',
  templateUrl: './mysellingproducts.page.html',
  styleUrls: ['./mysellingproducts.page.scss'],
})
export class MysellingproductsPage implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, 
  public fAuth: AngularFireAuth, 
  private authService: AuthenticateService,
  private db: AngularFireDatabase,
  private navController: NavController,
  private router : ActivatedRoute,
  public modalController: ModalController,
  public loading: LoadingService) { }

  productList = [];
  productTempList = [];
  
  ngOnInit() {
	  
  }
  
  ionViewWillEnter() {
	this.loading.present();
	  this.db.list('/productsforselling/', ref => ref.orderByChild('createdby').equalTo(this.authService.getUserID())).snapshotChanges().subscribe(res => {
		  this.productList = [];
		  res.forEach(item => {
			let a = item.payload.toJSON();
			a['index'] = item.key;
			firebase.database().ref('/properties/products/'+a['productcode']).once('value').then((snapshot) => {
				a['title'] = snapshot.child('title').val();
				a['imagepath'] = snapshot.child('imagepath').val();
				a['details'] = snapshot.child('details').val();
				this.productList.push(a);
			})
			this.productTempList = this.productList;
		  })
		  this.loading.dismiss();
	  });
  }
  
  filterList(event) {
	if(event.srcElement.value == null || event.srcElement.value == '') {
		this.productList = this.productTempList;
	} else {
		this.productList = this.productTempList;
		this.productList = this.productList.filter(function(val) {
			return val.title.toLowerCase().indexOf((event.srcElement.value).toLowerCase()) > -1;
		});
	}
  }
  
  routeProductDetail(index) {
	  this.navController.navigateRoot('/addproduct',{queryParams : {index : index}});
  }
}
