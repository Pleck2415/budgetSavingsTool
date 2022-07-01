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
  budgetEntryFrequencies = new Array();

  allFrequencies: string = "Voir toutes les fréquences";
  allSharedFrequencies: string = "Voir toutes les fréquences";
  allIncomesFrequencies: string = "Voir toutes les fréquences";
  allSharedIncomesFrequencies: string = "Voir toutes les fréquences";

  viewAllFrequencies: boolean = false;
  viewAllSharedFrequencies: boolean = false;
  viewAllIncomesFrequencies: boolean = false;
  viewAllSharedIncomesFrequencies: boolean = false;

  currentEntryFrequencyId: number = 0;
  currentEntryCategory: string = "";
  totalAnnualExpenses: number = 0;
  expensePerParts: number = 0;
  partZero: number = 0;

  calculReady: boolean = false;
  budgetGenerated: any[] = [];
  personalBudget = new Array();
  personalBudgetResources = new Array();
  selectedResourceName: string = "";
  selectedResourceBudget: any;
  selectedResourcePersonalExpenses: number = 0;
  selectedResourcePersonalFrequency: string = "";
  selectedResourcePersonalAllFrequencies: any[] = [];
  selectedResourceSharedExpenses: number = 0;
  selectedResourceSharedFrequency: string = "";
  selectedResourceSharedAllFrequencies: any[] = []; 
  
  selectedResourcePersonalIncomes: number = 0;
  selectedResourcePersonalIncomesFrequency: string = "";
  selectedResourcePersonalAllIncomesFrequencies: any[] = [];

  constructor(private formBuilder: FormBuilder, private budgetsService: BudgetsService) { 
    this.currentBudget = this.budgetsService.currentBudget;
   }

  ngOnInit(): void {
    this.initForm();
    this.generateBudgetResource();
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
    const freqList = this.budgetsService.frequencyList;
    freqList.forEach(element => {
      this.budgetEntryFrequencies.push(element);
    });
  }

  // getPayerParts(event) {
  //   const input = event.target as HTMLInputElement;
  //   const parts: number = +input.value;
  //   var payer: string = "";
  //   var payerList = new Array();
  //   for (let index = 0; index < (parts); index++) {
  //     var payerNumber = index + 1;
  //     payer = "Payeur-" + +payerNumber;
  //     payerList.push({id: index, payer: payer});
  //   }
  //   this.hasParts = true;
  //   this.payerParts = payerList;
  // }

  onChangeResource() {
    var resourceID: number = document.getElementById('resource')['value'];
    var resourceIndex = this.personalBudgetResources.findIndex(element => element.id == resourceID);
    const resourceName = this.personalBudgetResources[resourceIndex].description;
    this.selectedResourceName = resourceName;
    this.getPersonalBudget(resourceID);
  }

  getPersonalBudget(resourcID) {
    var personalBudget =  this.budgetsService.getPersonalBudget(resourcID, this.currentBudget);
    this.selectedResourceBudget = personalBudget;
  }

  onChangeEntriesFrequency(type: string) {
    var amount: number = 0;
    var frequency: number = 0;
    switch(type) {
      case("personal-expenses"): {
        amount = +this.selectedResourceBudget.personalExpensesTotal;
        frequency = +document.getElementById('personnalFrequency')['value'];
        this.selectedResourcePersonalFrequency = "";
        this.selectedResourcePersonalFrequency = this.budgetsService.getFrequencyDescription(frequency).toLowerCase();
        if (frequency != null) {
          var freqPayments = (this.budgetsService.convertToAnnualExpenses(amount, frequency)).toFixed(2);
          this.selectedResourcePersonalExpenses = +freqPayments;
        }
        break;
      }
      case("shared-expenses"): {
        amount = +this.selectedResourceBudget.sharedExpensesTotal;
        frequency = +document.getElementById('sharedFrequency')['value'];
        this.selectedResourceSharedFrequency = "";
        this.selectedResourceSharedFrequency = this.budgetsService.getFrequencyDescription(frequency).toLowerCase();
        if (frequency != null) {
          var freqPayments = (this.budgetsService.convertToAnnualExpenses(amount, frequency)).toFixed(2);
          this.selectedResourceSharedExpenses = +freqPayments;
        }
        break;
      }
      case("personal-incomes"): {
        amount = +this.selectedResourceBudget.personalIncomesTotal;
        frequency = +document.getElementById('personnalIncomesFrequency')['value'];
        this.selectedResourcePersonalIncomesFrequency = "";
        this.selectedResourcePersonalIncomesFrequency = this.budgetsService.getFrequencyDescription(frequency).toLowerCase();
        if (frequency != null) {
          var freqPayments = (this.budgetsService.convertToAnnualExpenses(amount, frequency)).toFixed(2);
          this.selectedResourcePersonalIncomes = +freqPayments;
        }
        break;
      }
      // case("shared-incomes"): {
      //   amount = +this.selectedResourceBudget.sharedExpensesTotal;
      //   frequency = +document.getElementById('sharedFrequency')['value'];
      //   this.selectedResourceSharedFrequency = "";
      //   this.selectedResourceSharedFrequency = this.budgetsService.getFrequencyDescription(frequency).toLowerCase();
      //   if (frequency != null) {
      //     var freqPayments = (this.budgetsService.convertToAnnualExpenses(amount, frequency)).toFixed(2);
      //     this.selectedResourceSharedExpenses = +freqPayments;
      //   }
      //   break;
      // }
    };
  }

  getAllFrequenciesAmount(viewAll: boolean, type: string, totalAmount: number) {
    var buttonText: string = "";
    var allFrequencies: any[] = [];

    if (viewAll == false) {
      viewAll = true;
      buttonText = "Cacher les fréquences";
    } else {
        viewAll = false;
        buttonText = "Voir toutes les fréquences";
      }
    this.budgetEntryFrequencies.forEach(element => {
      var frequencyID: number = element.id;
      var amount = (this.budgetsService.convertToAnnualExpenses(totalAmount, frequencyID)).toFixed(2);
      var frequency = this.budgetsService.getFrequencyDescription(frequencyID);
      var freqObject = {frequency: frequency, amount: amount};
      allFrequencies.push(freqObject);
    });

    switch (type) {
      case("personal-expenses"):{
        this.viewAllFrequencies = viewAll;
        this.allFrequencies = buttonText;
        this.selectedResourcePersonalAllFrequencies = [];
        this.selectedResourcePersonalAllFrequencies = allFrequencies;
        break;
      }
      case("personal-incomes"):{
        this.viewAllIncomesFrequencies = viewAll;
        this.allIncomesFrequencies = buttonText;
        this.selectedResourcePersonalAllIncomesFrequencies = [];
        this.selectedResourcePersonalAllIncomesFrequencies = allFrequencies;
        break;
      }
      case("shared-expenses"):{
        this.viewAllSharedFrequencies = viewAll;
        this.allSharedFrequencies = buttonText;
        this.selectedResourceSharedAllFrequencies = [];
        this.selectedResourceSharedAllFrequencies = allFrequencies;
        break;
      }
      case("shared-incomes"):{
        
        break;
      }
    }
  }

  generateBudgetResource() {
    this.currentBudget.resources.forEach(element => {
      this.personalBudgetResources.push(element);
    });
  }
}
