import { Component, OnInit } from '@angular/core';
import {  MenuController } from '@ionic/angular';

@Component({
  selector: 'app-network',
  templateUrl: './network.page.html',
  styleUrls: ['./network.page.scss'],
})
export class NetworkPage implements OnInit {

  constructor(private menuCtrl : MenuController) { }

  ngOnInit() {
	  this.menuCtrl.enable(false);
  }

}
