import { Injectable } from "@angular/core";
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  constructor(
    private afAuth: AngularFireAuth,
	private firestore: AngularFirestore
  ) { }

  registerUser(value) {
    return new Promise<any>((resolve, reject) => {

      this.afAuth.createUserWithEmailAndPassword(value.email, value.password)
        .then(
          res => resolve(res),
          err => reject(err))
    })

  }

  loginUser(email, password) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.signInWithEmailAndPassword(email, password)
        .then(
          res => resolve(res),
          err => reject(err))
    })
  }

  logoutUser() {
    return new Promise((resolve, reject) => {
      if (this.afAuth.currentUser) {
        this.afAuth.signOut()
          .then(() => {
            console.log("LOG Out");
            resolve();
          }).catch((error) => {
            reject();
          });
      }
    })
  }

  userDetails() {
    return this.afAuth.user
  }
  
  userID : string;
  emailID : string;
  userType : string;
  isAdmin : boolean;
  isUserLoggedIn : boolean;
  username : string;
  read_menu() {
    return this.firestore.collection('menu').snapshotChanges();
  }
  
  setUserID(value : string) {
	  this.userID = value;
  }
  
  getUserID() {
	  return this.userID;
  }
  
  setEmailID(value : string) {
	  this.emailID = value;
  }
  
  getEmailID() {
	  return this.emailID;
  }
  
  setIsAdmin(value : boolean) {
	  this.isAdmin = value;
  }
  
  getIsAdmin() {
	  return this.isAdmin;
  }
  
  setUserType(value : string) {
	  this.userType = value;
  }
  
  getUserType() {
	  return this.userType;
  }
  
  setIsUserLoggedIn(value : boolean) {
	  this.isUserLoggedIn = value;
  }
  
  getIsUserLoggedIn() {
	  return this.isUserLoggedIn;
  }
  
  setUserName(value : string) {
	  this.username = value;
  }
  
  getUserName() {
	  return this.username;
  }
}