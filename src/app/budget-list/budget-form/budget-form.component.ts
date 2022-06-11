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

  newEntry: Entry;
  incomesTotal: number = 0;
  expensesTotal: number = 0;

  private incomesGridApi;
  private incomesGridColumnApi;
  private expensesGridApi;

  incomesList = [{type: "Salaire", amount: 75000, frequency: this.bugetService.getFrequencyDescription(5), annual: this.bugetService.convertToAnnualIncomes(75000, 5)}, 
  {type: "Location immeuble", amount: 975, frequency: this.bugetService.getFrequencyDescription(4), annual: this.bugetService.convertToAnnualIncomes(975, 4)}];
  expensesList = [{type: "Hypothèque", amount: 700, frequency: this.bugetService.getFrequencyDescription(4), annual: this.bugetService.convertToAnnualIncomes(700, 4)}, 
  {type: "Taxes municipales", amount: 2500, frequency: this.bugetService.getFrequencyDescription(5), annual: this.bugetService.convertToAnnualIncomes(2500, 5)}];

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
    this.openEntryForm = false;
  }

  onSubmitEntry() {
    console.log("Nouvelle entrée :", this.newEntry)
  }

  openControlTable(tableName: string) {
    this.router.navigate(['/' + tableName]);
  }

  onChangeType(element) {
    if (element.value != "") {
      this.newEntry.type = element.value;
    }
  }
}
