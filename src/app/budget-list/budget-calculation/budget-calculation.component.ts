import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Budget } from 'src/app/models/budget.model';
import { BudgetsService } from 'src/app/services/budgets.service';

@Component({
  selector: 'app-budget-calculation',
  templateUrl: './budget-calculation.component.html',
  styleUrls: ['./budget-calculation.component.scss']
})
export class BudgetCalculationComponent implements OnInit {

  budgetForm: FormGroup;
  currentBudget: Budget;
  payerParts = new Array();


  constructor(private formBuilder: FormBuilder, private budgetsService: BudgetsService) { 
    this.currentBudget = this.budgetsService.currentBudget;
   }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.getCurrentBudget();
    this.budgetForm = this.formBuilder.group({
      id:  this.currentBudget.id,
      title:  this.currentBudget.title,
      createdBy:  this.currentBudget.createdBy,
      description:  this.currentBudget.description,
      dateFrom:  this.currentBudget.dateFrom,
      dateTo:  this.currentBudget.dateTo,
      incomes:  this.currentBudget.incomes,
      expenses:  this.currentBudget.expenses
    });
  }

  getCurrentBudget() {
    this.currentBudget.id = this.budgetsService.currentBudget.id,
    this.currentBudget.title = this.budgetsService.currentBudget.title,
    this.currentBudget.createdBy = this.budgetsService.currentBudget.createdBy,
    this.currentBudget.description = this.budgetsService.currentBudget.description,
    this.currentBudget.dateFrom = this.budgetsService.currentBudget.dateFrom,
    this.currentBudget.dateTo = this.budgetsService.currentBudget.dateTo,
    this.currentBudget.incomes = this.budgetsService.currentBudget.incomes,
    this.currentBudget.expenses = this.budgetsService.currentBudget.expenses
  }

  getPayerParts() {
    console.log("Payer parts: ");
  }

}
