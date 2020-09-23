import { Injectable, ErrorHandler } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ErrorhandlerService implements ErrorHandler {

	constructor(public alertCtrl: AlertController) { }
  
	handleError(error: any): void {
	const chunkFailedMessage = /Loading chunk/;
		if (chunkFailedMessage.test(error.message)) {
			window.location.reload();
		}
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
}
