import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-budget-home',
  templateUrl: './budget-home.component.html',
  styleUrls: ['./budget-home.component.scss']
})
export class BudgetHomeComponent implements OnInit {

  signin: boolean = true;
  signup: boolean = false;

  constructor (private authService: AuthService) { 
    this.signin = true;
  }

  ngOnInit(): void {
    this.signin = true;
    this.signin = this.authService.signin;
    this.signup = this.authService.signup;
  }
  
  goToSignup() {
    this.signin = false;
    this.signup = true;
  }

}
