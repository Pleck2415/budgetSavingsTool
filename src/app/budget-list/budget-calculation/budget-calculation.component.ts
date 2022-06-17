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

  constructor(private formBuilder: FormBuilder, private budgetsService: BudgetsService) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.currentBudget = this.budgetsService.currentBudget;
    this.budgetForm.setValue(this.currentBudget);
    this.budgetForm = this.formBuilder.group({
      id: this.currentBudget.id,
      title: this.currentBudget.title,
      createdBy: this.currentBudget.createdBy,
      description: this.currentBudget.description,
      dateFrom: this.currentBudget.dateFrom,
      dateTo: this.currentBudget.dateTo,
      incomes: this.currentBudget.incomes,
      expenses: this.currentBudget.expenses
    });
  }
}
