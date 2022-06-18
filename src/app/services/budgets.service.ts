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
    {id: 0, description: "Par jour"}, 
    {id: 1, description: "Par semaine"}, 
    {id: 2, description: "Aux deux semaines"}, 
    {id: 3, description: "Bimensuel"}, 
    {id: 4, description: "Par mois"}, 
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
      if (element.entryId == id) {
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
    return annualAmount;
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
    firebase.database().ref("/budgets/" + userID  ).orderByValue().on("value", function(data) {   
      data.forEach(function(data) {
        var createdBy = data.val().createdBy;
        var dateFrom = data.val().dateFrom;
        var dateTo = data.val().dateTo;
        var description = data.val().description;
        var id = data.val().id;
        var title = data.val().title;
        if(data.val().incomes != undefined) {
          incomes = data.val().incomes;
        } else {
            incomes = null;
          }
        if(data.val().expenses != undefined) {
          var expenses = data.val().expenses;
        } else {
            expenses = null;
          }       
        elementList.push({id: id, description: description, createdBy: createdBy, dateFrom: dateFrom, dateTo: dateTo, title: title, incomes: incomes, expenses: expenses });
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
        console.log('Query in service: ', myID);
    if( myID == null) {
        nextID = 0;
    } else {
        nextID = myID +1;
        }
    });
    return nextID;
  }

}
