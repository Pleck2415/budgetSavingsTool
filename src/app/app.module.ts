import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';

import { AppComponent } from './app.component';

import { SignupComponent } from './auth/signup/signup.component';
import { SigninComponent } from './auth/signin/signin.component';
import { HeaderComponent } from './header/header.component';

import { BudgetHomeComponent } from './budget-home/budget-home.component';
import { BudgetListComponent } from './budget-list/budget-list.component';
import { SingleBudgetComponent } from './budget-list/single-budget/single-budget.component';
import { BudgetFormComponent } from './budget-list/budget-form/budget-form.component';

import { AuthService } from './services/auth.service';
import { AuthGuardService } from './services/auth-guard.service';
import { BudgetsService } from './services/budgets.service';

const appRoutes: Routes = [
  { path: 'auth/signup', component: SignupComponent },
  { path: 'auth/signin', component: SigninComponent },
  { path: 'home',component: BudgetHomeComponent },
  { path: 'budgets', canActivate: [AuthGuardService], component: BudgetListComponent },
  { path: 'budgets/new', canActivate: [AuthGuardService], component: BudgetFormComponent },
  { path: 'budgets/view/:id', canActivate: [AuthGuardService], component: SingleBudgetComponent },
  { path: '', redirectTo: 'budgets', pathMatch: 'full' },
  { path: '**', redirectTo: 'budgets' }
];
@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    SigninComponent,
    HeaderComponent,
    BudgetListComponent,
    SingleBudgetComponent,
    BudgetFormComponent,
    BudgetHomeComponent,
  ],
  imports: [
    BrowserModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AgGridModule.withComponents([]),
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [AuthService, AuthGuardService, BudgetsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
