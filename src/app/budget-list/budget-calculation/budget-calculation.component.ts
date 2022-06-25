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
  numberOfResources: number = 0;
  payerParts = new Array();
  payersTotal = new Array();
  currentFrequency: string = "";
  hasParts: boolean = false;
  budgetEntryFrequecies = new Array();
  currentEntryFrequencyId: number = 0;
  totalAnnualExpenses: number = 0;
  expensePerParts: number = 0;
  partZero: number = 0;

  calculReady: boolean = false;
  budgetGenerated: any[] = [];
  personalBudget = new Array();

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
      resources:  this.currentBudget.resources,
      incomes:  this.currentBudget.incomes,
      expenses:  this.currentBudget.expenses
    });
  }

  getCurrentBudget() {
    this.calculReady = true;
    this.currentBudget.id = this.budgetsService.currentBudget.id;
    this.currentBudget.title = this.budgetsService.currentBudget.title;
    this.currentBudget.createdBy = this.budgetsService.currentBudget.createdBy;
    this.currentBudget.description = this.budgetsService.currentBudget.description;
    this.currentBudget.dateFrom = this.budgetsService.currentBudget.dateFrom;
    this.currentBudget.dateTo = this.budgetsService.currentBudget.dateTo;
    this.currentBudget.resources = this.budgetsService.currentBudget.resources;
    this.currentBudget.incomes = this.budgetsService.currentBudget.incomes;
    this.currentBudget.expenses = this.budgetsService.currentBudget.expenses;
    this.numberOfResources = this.budgetsService.getBudgetresourcesNumber(this.currentBudget);

    if( this.numberOfResources == 0 || this.numberOfResources == undefined) {
      alert("Le calcul du budget nécessite au moins une ressource!");
      this.calculReady = false;      
    }
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
    var budgetGenerated: any[] = [];  
    this.currentBudget.resources.forEach(element => {
        var personalBudgetObject = this.budgetsService.getPersonalBudget(element.id, this.currentBudget);
        budgetGenerated.push(personalBudgetObject);
    });
    console.log("In generate Budget: ", budgetGenerated );
    this.budgetGenerated = budgetGenerated;
  }

  onChangeBudgetFrequency(index: number) {
    var persoExpWithFreq: number = 0;
    var sharedExpWithFreq: number = 0;
    var resourceIndex = this.personalBudget.findIndex(element => element.resourceID == index);
    const frequency: number = +document.getElementById('personnalFrequency')['value'];
    persoExpWithFreq = this.budgetsService.convertToAnnualExpenses(this.budgetGenerated[index].personalExpenses, frequency);
    const shFrequency: number = +document.getElementById('sharedFrequency')['value'];
    sharedExpWithFreq = this.budgetsService.convertToAnnualExpenses(this.budgetGenerated[index].personalExpenses, shFrequency);
    var personalBudgetObject = {resourceID: index, persoExpWithFreq: persoExpWithFreq, sharedExpWithFreq: sharedExpWithFreq };
    if (resourceIndex != -1) {
        this.personalBudget[resourceIndex].persoExpWithFreq = persoExpWithFreq;
        this.personalBudget[resourceIndex].sharedExpWithFreq = sharedExpWithFreq;
    } else {     
        personalBudgetObject = {resourceID: index, persoExpWithFreq: persoExpWithFreq, sharedExpWithFreq: sharedExpWithFreq };     
        this.personalBudget.push(personalBudgetObject);
      }
    }     
}
