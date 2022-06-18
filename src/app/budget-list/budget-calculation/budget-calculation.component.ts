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
  payersTotal = new Array();
  currentFrequency: string = "";
  hasParts: boolean = false;
  budgetEntryFrequecies = new Array();
  currentEntryFrequencyId: number = 0;
  totalAnnualExpenses: number = 0;
  expensePerParts: number = 0;
  partZero: number = 0;

  constructor(private formBuilder: FormBuilder, private budgetsService: BudgetsService) { 
    this.currentBudget = this.budgetsService.currentBudget;
   }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.getCurrentBudget();
    this.getFrequenciesList();
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

  getFrequenciesList() {
    this.budgetsService.frequencyList.forEach(element => {
      this.budgetEntryFrequecies.push({id: element.id, description: element.description});
    });
  }

  getPayerParts(event) {
    const input = event.target as HTMLInputElement;
    const parts: number = +input.value;
    var payer: string = "";
    var payerList = new Array();
    for (let index = 0; index < (parts); index++) {
      var payerNumber = index + 1;
      payer = "Payeur-" + +payerNumber;
      payerList.push({id: index, payer: payer});
    }
    this.hasParts = true;
    this.payerParts = payerList;
  }

  onChangeFrequency() {
    const value: number = document.getElementById('frequency')['value'];
    if (value != null) {
      this.currentEntryFrequencyId = value;
    }
  }

  generateBudget() {
    const numberOfParts = document.getElementById('numberOfPayers')['value'];
    const frequency: number = +document.getElementById('frequency')['value'];
    this.currentFrequency = this.budgetsService.getFrequencyDescription(frequency);
  
    var totalAnnualExpenses: number = 0;
    this.currentBudget.expenses.forEach(element => {
      totalAnnualExpenses += element.annual;
    })
    this.totalAnnualExpenses = totalAnnualExpenses;
    var totalExpensesPerFrequency = this.budgetsService.convertToAnnualExpenses(+totalAnnualExpenses, frequency); 
    this.expensePerParts = totalAnnualExpenses/numberOfParts;
    var payerObject: any;
    var payersList = new Array();
    this.payerParts.forEach(element => {
      var payerName = document.getElementById('Name-' + element.id)['value'];
      var payerPart = document.getElementById('Part-' + element.id)['value'];
      var payerAmount = Math.round((totalExpensesPerFrequency*payerPart/100 + Number.EPSILON) * 100) / 100;
      payerObject = {id: element.id, name: payerName, part: payerPart, amount: payerAmount };
      payersList.push(payerObject);
    });
    console.log("Payeurs: ", payersList);
    this.payersTotal = payersList;
  }
}
