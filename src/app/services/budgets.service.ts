import { Injectable } from '@angular/core';

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
  
  convertToAnnualIncomes(amount: number, frequencyID: number) {
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

  getAnnualTotal(incomesList) {
    var total: number = 0;
    incomesList.forEach(element => {
      total += element.annual;
    });
    return total;
  }
}
