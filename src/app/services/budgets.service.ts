import { Injectable } from '@angular/core';
import { Budget } from '../models/budget.model';

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

  constructor() { }

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

  getAnnualTotal(incomesList: any[]) {
    var total: number = 0;
    incomesList.forEach(element => {
      total += element.annual;
    });
    return total;
  }

  saveBudget(budget: Budget) {
    // this.nextCampaignID = campaign.cmID + 1;
    // firebase.database().ref("campaigns/" + campaign.cmID + "/" ).set(campaign);
  }  

}
