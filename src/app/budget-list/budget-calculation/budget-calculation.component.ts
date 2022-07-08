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
  numberOfPersons: number = 0;
  payerParts = new Array();
  payersTotal = new Array();
  currentFrequency: string = "";
  hasParts: boolean = false;
  budgetEntryFrequencies = new Array();

  allExpensesFrequencies: string = "Voir toutes les fréquences";
  allIncomesFrequencies: string = "Voir toutes les fréquences";

  viewAllExpensesFrequencies: boolean = false;
  viewAllIncomesFrequencies: boolean = false;


  currentEntryFrequencyId: number = 0;
  currentEntryCategory: string = "";
  totalAnnualExpenses: number = 0;
  expensePerParts: number = 0;
  partZero: number = 0;

  calculReady: boolean = false;
  budgetGenerated: any[] = [];
  personalBudget = new Array();
  personalBudgetPersons = new Array();
  selectedPersonName: string = "";
  selectedPersonBudget: any;

  selectedResourceExpenses: number = 0;
  selectedResourceExpensesFrequency: string = "";
  selectedResourceAllFrequenciesExpenses: any[] = []; 
  
  selectedResourceIncomes: number = 0;
  selectedResourceIncomesFrequency: string = "";
  selectedResourceAllIncomesFrequencies: any[] = [];

  constructor(private formBuilder: FormBuilder, private budgetsService: BudgetsService) { 
    this.currentBudget = this.budgetsService.currentBudget;
   }

  ngOnInit(): void {
    this.initForm();
    this.generateBudgetPerson();
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
      persons:  this.currentBudget.resources,
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
    this.numberOfPersons = this.budgetsService.getBudgetresourcesNumber(this.currentBudget);

    if( this.numberOfPersons == 0 || this.numberOfPersons == undefined) {
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

  onChangePerson() {
    var personID: number = document.getElementById('person')['value'];
    var personIndex = this.personalBudgetPersons.findIndex(element => element.id == personID);
    const personName = this.personalBudgetPersons[personIndex].description;
    this.selectedPersonName = personName;
    this.getPersonalBudget(personID);
  }

  getPersonalBudget(personID: number) {
    var personalBudget = null;
    this.generateBudgetPerson();
    // console.log("Parts null: ", expensesPart);
    personalBudget =  this.budgetsService.getPersonalBudget(personID, this.currentBudget);
    this.selectedPersonBudget = personalBudget;
  }

  onChangeEntriesFrequency(type: string) {
    var amount: number = 0;
    var frequency: number = 0;
    switch(type) {
      case("expenses"): {
        amount = +(this.selectedPersonBudget.sharedExpensesTotal.toFixed(2));
        frequency = +document.getElementById('expensesFrequency')['value'];
        this.selectedResourceExpensesFrequency = "";
        this.selectedResourceExpensesFrequency = this.budgetsService.getFrequencyDescription(frequency).toLowerCase();
        if (frequency != null) {
          var freqPayments: number = +this.budgetsService.convertToAnnualExpenses(amount, frequency);
          this.selectedResourceExpenses = freqPayments;
        }
        break;
      }
      case("incomes"): {
        amount = +(this.selectedPersonBudget.sharedIncomesTotal.toFixed(2));
        frequency = +document.getElementById('incomesFrequency')['value'];
        this.selectedResourceIncomesFrequency = "";
        this.selectedResourceIncomesFrequency = this.budgetsService.getFrequencyDescription(frequency).toLowerCase();
        if (frequency != null) {
          var freqPayments: number = +this.budgetsService.convertToAnnualExpenses(amount, frequency);
          this.selectedResourceIncomes = freqPayments;
        }
        break;
      }
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
      var amount = (+this.budgetsService.convertToAnnualExpenses(totalAmount, frequencyID)).toFixed(2);
      var frequency = this.budgetsService.getFrequencyDescription(frequencyID);
      var freqObject = {frequency: frequency, amount: amount};
      allFrequencies.push(freqObject);
    });

    switch (type) {
      case("incomes"):{
        this.viewAllIncomesFrequencies = viewAll;
        this.allIncomesFrequencies = buttonText;
        this.selectedResourceAllIncomesFrequencies = [];
        this.selectedResourceAllIncomesFrequencies = allFrequencies;
        break;
      }
      case("expenses"):{
        this.viewAllExpensesFrequencies = viewAll;
        this.allExpensesFrequencies = buttonText;
        this.selectedResourceAllFrequenciesExpenses = [];
        this.selectedResourceAllFrequenciesExpenses = allFrequencies;
        break;
      }
    }
  }

  generateBudgetPerson() {
    this.currentBudget.resources.forEach(element => {
      this.personalBudgetPersons.push(element);
    });
  }
}
