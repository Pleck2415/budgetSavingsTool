import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { ModalModule } from 'ngx-bootstrap/modal';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MdbAccordionModule } from 'mdb-angular-ui-kit/accordion';
import { CollapseModule, MDBBootstrapModule } from 'angular-bootstrap-md';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import {MatExpansionModule} from '@angular/material/expansion';

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
import { BudgetEntryTypesComponent } from './budget-list/budget-entry-types/budget-entry-types.component';
import { BudgetCalculationComponent } from './budget-list/budget-calculation/budget-calculation.component';
import { BudgetResourcesComponent } from './budget-list/budget-resources/budget-resources.component';

const appRoutes: Routes = [
  { path: 'auth/signup', component: SignupComponent },
  { path: 'auth/signin', component: SigninComponent },
  { path: 'home',component: BudgetHomeComponent },
  { path: 'budgets', canActivate: [AuthGuardService], component: BudgetListComponent },
  { path: 'budget/new', canActivate: [AuthGuardService], component: BudgetFormComponent },
  { path: 'budget/calculation', canActivate: [AuthGuardService], component: BudgetCalculationComponent },
  { path: 'budget-entry-types', canActivate: [AuthGuardService], component: BudgetEntryTypesComponent },
  { path: 'budget-resources', canActivate: [AuthGuardService], component: BudgetResourcesComponent },
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
    BudgetEntryTypesComponent,
    BudgetCalculationComponent,
    BudgetResourcesComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonToggleModule,
    MdbAccordionModule,
    MdbCollapseModule,
    CollapseModule,
    MatExpansionModule,
    MDBBootstrapModule.forRoot(),
    ModalModule.forRoot(),
    AgGridModule.withComponents([]),
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [AuthService, AuthGuardService, BudgetsService],
  bootstrap: [AppComponent],
  entryComponents: [BudgetFormComponent]
})
export class AppModule { }
