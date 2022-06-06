import { Component } from '@angular/core';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor() {
    document.body.style.backgroundColor = "rgb(75, 75, 75)";
    // Your web app's Firebase configuration
    const config = {
      apiKey: "AIzaSyCGqNYYQuthuj_IPWkMWin8vQ-LO6Llo0E",
      authDomain: "budgetsavingstool.firebaseapp.com",
      projectId: "budgetsavingstool",
      storageBucket: "budgetsavingstool.appspot.com",
      messagingSenderId: "962511648559",
      appId: "1:962511648559:web:64e270d530a2ce46fad3da"
    };

    // Initialize Firebase
    firebase.initializeApp(config);
  }
}