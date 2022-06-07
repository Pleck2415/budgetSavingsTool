import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BudgetsService } from 'src/app/services/budgets.service';

@Component({
  selector: 'app-budget-form',
  templateUrl: './budget-form.component.html',
  styleUrls: ['./budget-form.component.scss']
})
export class BudgetFormComponent implements OnInit {

  budgetForm: FormGroup;
  incomesTotal: number = 0;
  expensesTotal: number = 0;
  incomesList = [{type: "Salaire", amount: 75000, frequency: this.bugetService.getFrequencyDescription(5), annual: this.bugetService.convertToAnnualIncomes(75000, 5)}, 
  {type: "Location immeuble", amount: 975, frequency: this.bugetService.getFrequencyDescription(4), annual: this.bugetService.convertToAnnualIncomes(975, 4)}];
  expensesList = [{type: "Hypothèque", amount: 700, frequency: this.bugetService.getFrequencyDescription(4), annual: this.bugetService.convertToAnnualIncomes(700, 4)}, 
  {type: "Taxes municipales", amount: 2500, frequency: this.bugetService.getFrequencyDescription(5), annual: this.bugetService.convertToAnnualIncomes(2500, 5)}];

  constructor(private formBuilder: FormBuilder, private bugetService: BudgetsService) { }

  ngOnInit(): void {
    this.budgetForm = this.formBuilder.group({
      title: [null],
      createdBy: [null],
      description: [null],
      dateFrom: [null],
      dateTo: [null],
      income: {
        type: [null],
        amount: [null],
        frequency: [null] 
      }    
    });
    this.incomesTotal = this.bugetService.getAnnualTotal(this.incomesList);
    this.expensesTotal = this.bugetService.getAnnualTotal(this.expensesList);
  }

}
