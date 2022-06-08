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

  private incomesGridApi;
  private incomesGridColumnApi;
  private expensesGridApi;

  incomesList = [{type: "Salaire", amount: 75000, frequency: this.bugetService.getFrequencyDescription(5), annual: this.bugetService.convertToAnnualIncomes(75000, 5)}, 
  {type: "Location immeuble", amount: 975, frequency: this.bugetService.getFrequencyDescription(4), annual: this.bugetService.convertToAnnualIncomes(975, 4)}];
  expensesList = [{type: "Hypothèque", amount: 700, frequency: this.bugetService.getFrequencyDescription(4), annual: this.bugetService.convertToAnnualIncomes(700, 4)}, 
  {type: "Taxes municipales", amount: 2500, frequency: this.bugetService.getFrequencyDescription(5), annual: this.bugetService.convertToAnnualIncomes(2500, 5)}];

  constructor(private formBuilder: FormBuilder, private bugetService: BudgetsService) { }

  
  incomesRowData: any;
  incomesColumnDefs = [
    {headerName: 'Type', field: 'type', width: 300, resizable: true, sortable: true, filter: true },
    {headerName: 'Montant', field: 'amount', cellStyle: { 'text-align': "right" }, width: 175, resizable: true, editable: true },
    {headerName: 'Fréquence', field: 'frequency', width: 175, resizable: true, sortable: true, filter: true },
    {headerName: 'Annuel', field: 'annual', cellStyle: { 'text-align': "right" }, width: 175, resizable: true, aggFunc: "sum", valueParser: "Number(newValue)" },
  ];

  expensesRowData: any;
  expensesColumnDefs = [
    {headerName: 'Type', field: 'type', width: 300, resizable: true, sortable: true, filter: true },
    {headerName: 'Montant', field: 'amount', cellStyle: { 'text-align': "right" }, width: 175, resizable: true,  editable: true },
    {headerName: 'Fréquence', field: 'frequency', width: 175, resizable: true, sortable: true, filter: true },
    {headerName: 'Annuel', field: 'annual', cellStyle: { 'text-align': "right" }, width: 175, resizable: true, sortable: true, filter: true },
  ];

  ngOnInit(): void {
    this.budgetForm = this.formBuilder.group({
      title: [null],
      createdBy: [null],
      description: [null],
      dateFrom: [null],
      dateTo: [null],
    });
    this.getAnnulalTotal();
    this.loadGridsData();
  }

  getAnnulalTotal() {
    this.incomesTotal = this.bugetService.getAnnualTotal(this.incomesList);
    this.expensesTotal = this.bugetService.getAnnualTotal(this.expensesList);
  }

  loadGridsData() {
    this.incomesRowData = this.incomesList;
    this.expensesRowData = this.expensesList;
  }

  onIncomesGridReady(params) {
    // To access the grids API
    this.incomesGridApi = params.api;
    this.incomesGridColumnApi = params.columnApi;
  }

  incomeCellValueChanged(event) {
    console.log("Value change: ",event);
    const rowIndex = +event.rowIndex;
    const amount = +event.newValue;
    const freq = this.bugetService.getFrequencyId(event.data.frequency);
    this.incomesRowData[rowIndex].annual = this.bugetService.convertToAnnualIncomes(amount, freq);
    this.incomesGridApi.setRowData(this.incomesRowData);
    this.incomesTotal = this.bugetService.getAnnualTotal(this.incomesRowData);
  }

  onExpensesGridReady(params) {
    // To access the grids API
    this.expensesGridApi = params.api;
  }

  openSelectedExpense() {

  }

}
