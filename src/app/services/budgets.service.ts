import { Injectable } from '@angular/core';
import { Budget } from '../models/budget.model';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class BudgetsService {

  frequencyList = [
    {id: 0, description: "Quotidien"}, 
    {id: 1, description: "Hebdomadaire"}, 
    {id: 2, description: "Aux deux semaines"}, 
    {id: 3, description: "Bimensuel"}, 
    {id: 4, description: "Mensuel"}, 
    {id: 5, description: "Annuel"}
  ];

  currentBudget: Budget;
  isNewBudget: boolean = false;

  constructor(private router: Router) { }

  openCurrentBudget(budget: Budget) {
    this.currentBudget = budget;
    this.isNewBudget = false;
    this.router.navigateByUrl('budget/new');
  }

  addNewBudget() {
    this.isNewBudget = true;
    this.router.navigateByUrl('budget/new');
  }
  
  getFrequencyDescription(id: number) {
    var frequencyObject: any;
    this.frequencyList.forEach(element => {
      if (element.id == id) {
        frequencyObject = element;
      }
    });    
    const description = frequencyObject.description;
    return description;
  }

  getFrequencyId(frequency: string) {
    var frequencyObject: any;
    this.frequencyList.forEach(element => {
      if (element.description == frequency) {
        frequencyObject = element;
      }
    });    
    const freqID = frequencyObject.id;
    return freqID;
  }

  getEntryTypeDescription(id: number, list: any) {
    var description: string = "";
    list.forEach(element => {
      if (element.id == id) {
        description = element.description;
      }
    });
    return description;
  }
  
  convertToAnnualIncomes(amount: number, frequencyID: number) {
    console.log("In convert amount: ", amount, " frequency: ", frequencyID );
    var annualAmount: number = 0;
    switch (frequencyID) {
      case(0):{
        annualAmount = amount * 365;
        break;
      }
      case(1):{
        annualAmount = amount * 52.14;
        break;
      }
      case(2):{
        annualAmount = amount * 26.07;
        break;
      }
      case(3):{
        annualAmount = amount * 24;
        break;
      }
      case(4):{
        annualAmount = amount * 12;
        break;
      }
      case(5):{
        annualAmount = amount;
        break;
      }
    };
    return annualAmount;
  }
  
  convertToAnnualExpenses(amount: number, frequencyID: number) {
    var annualAmount: number = 0;
    switch (frequencyID) {
      case(0):{
        annualAmount = amount / 365;
        break;
      }
      case(1):{
        annualAmount = amount / 52.14;
        break;
      }
      case(2):{
        annualAmount = amount / 26.07;
        break;
      }
      case(3):{
        annualAmount = amount / 24;
        break;
      }
      case(4):{
        annualAmount = amount / 12;
        break;
      }
      case(5):{
        annualAmount = amount;
        break;
      }
    };
    var totalAmount = Math.round((annualAmount + Number.EPSILON) * 100) / 100
    return totalAmount;
  }

  getAnnualTotal(incomesList: any[]) {
    var total: number = 0;
    incomesList.forEach(element => {
      total += element.annual;
    });
    return total;
  }

  getBudgetsList() {
    const userID = firebase.auth().currentUser.uid;
    var elementList: any[] = [];
    var incomes = new Array();
    var expenses = new Array();
    var resources = new Array();
    firebase.database().ref("/budgets/" + userID  ).orderByValue().on("value", function(data) {   
      data.forEach(function(data) {
        var createdBy = data.val().createdBy;
        var dateFrom = data.val().dateFrom;
        var dateTo = data.val().dateTo;
        var description = data.val().description;
        var id = data.val().id;
        var title = data.val().title;
        if(data.val().resources != undefined) {
          resources = data.val().resources;
        } else {
          resources = null;
          }
        if(data.val().incomes != undefined) {
          incomes = data.val().incomes;
        } else {
            incomes = null;
          }
        if(data.val().expenses != undefined) {
          expenses = data.val().expenses;
        } else {
            expenses = null;
          }       
        elementList.push({id: id, description: description, createdBy: createdBy, dateFrom: dateFrom, dateTo: dateTo, 
                            title: title, resources: resources, incomes: incomes, expenses: expenses });
      });
    });
    return elementList;
  }

  saveBudget(budget: any) {
    const myId = budget.id;
    const userID = firebase.auth().currentUser.uid;
    firebase.database().ref("budgets/" + userID + "/" + myId).set(budget);
    this.isNewBudget = false;
  }
  
  getElementNextID() { 
    const tableName: string = "budgets"    
    var nextID = 0;    
    const userID = firebase.auth().currentUser.uid;
    firebase.database().ref(tableName + "/" + userID + "/").limitToLast(1)
    .on('child_added', function(data) {
        const myID = data.val().id;
    if( myID == null) {
        nextID = 0;
    } else {
        nextID = myID +1;
        }
    });
    return nextID;
  }

  getBudgetresourcesNumber(budget: Budget) {
    var resourcesNumber: number = 0;
    if (Array.isArray(budget.resources) && budget.resources.length > 0) {
      resourcesNumber = budget.resources.length;
    }
    return resourcesNumber;
  }

  getPersonalBudget(resourceID: number, budget: Budget, expensesPart: number, incomesPart: number) {
    const expenses = budget.expenses;
    const incomes  = budget.incomes;
    const resourceName = this.getEntryTypeDescription(resourceID, budget.resources);
    const expensesObject = this.getEntriesListAndTotal(expenses, resourceID, expensesPart);
    const incomesObject = this.getEntriesListAndTotal(incomes, resourceID, incomesPart);
  
    var personalBudgetObject = {resourceName: resourceName, 
                                  sharedExpensesList: expensesObject.sharedEntriesList, sharedExpensesTotal: expensesObject.sharedEntriesTotal,
                                    sharedIncomesList: incomesObject.sharedEntriesList, sharedIncomesTotal: incomesObject.sharedEntriesTotal
                                  };
    return personalBudgetObject;
  }

  getEntriesListAndTotal(entries, resourceID: number, part: number) {
    var sharedEntriesList = [];
    var sharedEntriesTotal: number = 0;
    for (let index = 0; index < entries.length; index++) {
      var element = entries[index];
      var resourceIndex = element.resourcesList.findIndex(x => x.id == resourceID);
      if ( resourceIndex != -1 ) {
        var amount = element.annual;
        // sharedEntriesTotal += element.annual;
        if (element.resourcesList.length > 1) {
          element["category"] = 'Partagé' + " (" + part + " % de " + amount + " $)";
          amount = (amount * part / 100);
          element.annual = amount;
        } else {
          element["category"] = 'Personnel';
          }
        sharedEntriesTotal += amount;
        sharedEntriesList.push(element);    
      }
    }
    return {sharedEntriesTotal: sharedEntriesTotal, 
              sharedEntriesList: sharedEntriesList
            };
  }
}
