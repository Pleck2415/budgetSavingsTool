import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Entry } from 'src/app/models/entry.model';
import { BudgetsService } from 'src/app/services/budgets.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { ControlTableService } from 'src/app/services/control-table.service';

@Component({
  selector: 'app-budget-form',
  templateUrl: './budget-form.component.html',
  styleUrls: ['./budget-form.component.scss']
})
export class BudgetFormComponent implements OnInit {

  budgetForm: FormGroup;
  entryForm: FormGroup;

  // modalRef: BsModalRef;
  openEntryForm: boolean = false;
  entryType: string;
  bugetEntryTypes = new Array();
  budgetEntryFrequecies = new Array();

  newEntry: Entry;
  currentEntryTypeId: number = 0;
  currentEntryFrequencyId: number = 0;
  incomesTotal: number = 0;
  expensesTotal: number = 0;

  private incomesGridApi;
  private incomesGridColumnApi;
  private expensesGridApi;

  incomesList: Entry[] = [];
  expensesList: Entry[] = [];

  constructor(private formBuilder: FormBuilder, private bugetService: BudgetsService, private modalService: BsModalService, private router: Router, private cTService: ControlTableService) { }
  
  incomesRowData: any;
  incomesColumnDefs = [
    {headerName: 'Type', field: 'type', width: 275, resizable: true, sortable: true, filter: true },
    {headerName: 'Montant', field: 'amount', cellStyle: { 'text-align': "right" }, width: 150, resizable: true, editable: true },
    {headerName: 'Fréquence', field: 'frequency', width: 150, resizable: true, sortable: true, filter: true },
    {headerName: 'Annuel', field: 'annual', cellStyle: { 'text-align': "right" }, width: 150, resizable: true },
  ];

  expensesRowData: any;
  expensesColumnDefs = [
    {headerName: 'Type', field: 'type', width: 275, resizable: true, sortable: true, filter: true },
    {headerName: 'Montant', field: 'amount', cellStyle: { 'text-align': "right" }, width: 150, resizable: true,  editable: true },
    {headerName: 'Fréquence', field: 'frequency', width: 150, resizable: true, sortable: true, filter: true },
    {headerName: 'Annuel', field: 'annual', cellStyle: { 'text-align': "right" }, width: 150, resizable: true },
  ];

  ngOnInit(): void {
    this.initForm();
    // this.onInitEntryForm();
    this.budgetEntryFrequecies = this.bugetService.frequencyList;
    this.bugetEntryTypes = this.cTService.getTableElements("budgetEntryTypes");
    this.getAnnulalTotal();
    this.loadGridsData();
  }

  initForm() {
    this.budgetForm = this.formBuilder.group({
      title: [null],
      createdBy: [null],
      description: [null],
      dateFrom: [null],
      dateTo: [null],
    });
  }

  getAnnulalTotal() {
    this.incomesTotal = this.bugetService.getAnnualTotal(this.incomesList);
    this.expensesTotal = this.bugetService.getAnnualTotal(this.expensesList);
  }

  loadGridsData() {
    this.incomesRowData = this.incomesList;
    this.expensesRowData = this.expensesList;
    var incomesArray = new Array();
    var expensesArray = new Array();
    incomesArray = [];
    expensesArray = [];
    this.incomesList.forEach(element => {
      incomesArray.push(element);
    });
    this.incomesRowData = incomesArray;
    this.expensesList.forEach(element => {
      expensesArray.push(element);
    });
    this.expensesRowData = expensesArray;
    this.getAnnulalTotal();
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

  openAddEntry(type: string) {
    this.openEntryForm = true;
    this.entryType = type;
  }

  addEntry() {
    const amount: number = document.getElementById('amount')['value'];
    // console.log("Amount: ", amount);
    const annual = this.bugetService.convertToAnnualIncomes(+amount, +this.currentEntryFrequencyId)
    this.openEntryForm = false;
    this.newEntry = {type: this.bugetService.getEntryTypeDescription(this.currentEntryTypeId, this.bugetEntryTypes), amount: amount, frequency: this.bugetService.getFrequencyDescription(this.currentEntryFrequencyId), annual: annual};
    // console.log("Add entry: ", this.newEntry);
    switch (this.entryType) {
      case("incomes"): {
        this.incomesList.push(this.newEntry);
        break;
      }
      case("expenses"): {
        this.expensesList.push(this.newEntry);
        break;
      }
    }
    this.loadGridsData();
  }

  openControlTable(tableName: string) {
    this.router.navigate(['/' + tableName]);
  }

  onChangeFrequency() {
    const value: number = document.getElementById('frequency')['value'];
    console.log("Element: ", value);
    if (value != null) {
      this.currentEntryFrequencyId = value;
    }
  }

  onChangeType() {
    const value: number = document.getElementById('type')['value'];
    console.log("Element: ", value);
    if (value != null) {
      this.currentEntryTypeId = value;
    }
  }
}
