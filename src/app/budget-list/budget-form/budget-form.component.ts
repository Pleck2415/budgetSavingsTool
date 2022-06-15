import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Entry } from 'src/app/models/entry.model';
import { BudgetsService } from 'src/app/services/budgets.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { ControlTableService } from 'src/app/services/control-table.service';
import { map, Observable } from 'rxjs';
import { Budget } from 'src/app/models/budget.model';

@Component({
  selector: 'app-budget-form',
  templateUrl: './budget-form.component.html',
  styleUrls: ['./budget-form.component.scss']
})
export class BudgetFormComponent implements OnInit {

  budgetForm: FormGroup;
  entryForm: FormGroup;
  budgetSave$: Observable<Budget>;
  budgetSave: Budget;

  // modalRef: BsModalRef;
  openEntryForm: boolean = false;
  entryType: string;
  entryTypeFR: string;
  bugetEntryTypes = new Array();
  budgetEntryFrequecies = new Array();
  errorField: string = "";

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

  constructor(private formBuilder: FormBuilder, private budgetService: BudgetsService, private modalService: BsModalService, private router: Router, private cTService: ControlTableService) { }
  
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
    this.budgetEntryFrequecies = this.budgetService.frequencyList;
    this.getBudgetEntryTypes();
    this.getAnnulalTotal();
    this.loadGridsData();
  }

  initForm() {
    const nextId = this.budgetService.getElementNextID();
    this.budgetForm = this.formBuilder.group({
      id: nextId,
      title: [null, Validators.required],
      createdBy: [null, Validators.required],
      description: [null],
      dateFrom: [null],
      dateTo: [null],
      incomes: this.incomesList,
      expenses: [null]
    });
  }

  getBudgetEntryTypes() {
    this.bugetEntryTypes = this.cTService.getTableElements("budgetEntryTypes");
  }

  getAnnulalTotal() {
    this.incomesTotal = this.budgetService.getAnnualTotal(this.incomesList);
    this.expensesTotal = this.budgetService.getAnnualTotal(this.expensesList);
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
    const freq = this.budgetService.getFrequencyId(event.data.frequency);
    this.incomesRowData[rowIndex].annual = this.budgetService.convertToAnnualIncomes(amount, freq);
    this.incomesGridApi.setRowData(this.incomesRowData);
    this.incomesTotal = this.budgetService.getAnnualTotal(this.incomesRowData);
  }

  onExpensesGridReady(params) {
    // To access the grids API
    this.expensesGridApi = params.api;
  }

  openSelectedExpense() {

  }

  openAddEntry(type: string) {
    this.currentEntryTypeId = null;
    this.currentEntryFrequencyId = null;
    this.getBudgetEntryTypes();
    this.openEntryForm = true;
    this.entryType = type;
    var typeID: number = 0;
    if (this.entryType === "incomes") {
      this.entryTypeFR = "Revenus";
      typeID = 1;
    } else {
        this.entryTypeFR = "Dépenses";
      }
    const entryTypes = this.bugetEntryTypes;
    this.bugetEntryTypes = entryTypes.filter(
        entry => entry.typeId == typeID);
  }

  addEntry() {
    const amount: number = document.getElementById('amount')['value'];
    // console.log("Amount: ", amount);
    const annual = this.budgetService.convertToAnnualIncomes(+amount, +this.currentEntryFrequencyId);
    const type = this.budgetService.getEntryTypeDescription(this.currentEntryTypeId, this.bugetEntryTypes);
    const frequency = this.budgetService.getFrequencyDescription(this.currentEntryFrequencyId);
    if (type != null || frequency != null) {
      this.openEntryForm = false;
      this.newEntry = {type: type, 
          amount: amount, frequency: frequency, annual: annual};
  
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
      this.errorField = "";
      this.bugetEntryTypes = [];
      this.getBudgetEntryTypes()
      this.loadGridsData();
    }  else {
        this.errorField = "Valeur invalide pour 'Type' ou 'Fréquence'.";
      }  
  }

  onSubmitBudget() {
    this.budgetForm.patchValue({incomes: this.incomesList});
    this.budgetForm.patchValue({expenses: this.expensesList});
    this.budgetSave = this.budgetForm.value;
    // this.budgetSave$ = this.budgetForm.valueChanges.pipe(
    //   map(formValue => ({
    //     ...formValue,
    //   })
    //   )
    // );
    this.budgetService.saveBudget(this.budgetSave);
    alert("Budget saved!");
    console.log("Budget saved!");
  }

  openControlTable(tableName: string) {
    this.router.navigate(['/' + tableName]);
  }

  onChangeFrequency() {
    this.errorField = "";
    const value: number = document.getElementById('frequency')['value'];
    console.log("Element: ", value);
    if (value != null) {
      this.currentEntryFrequencyId = value;
    }
  }

  onChangeType() {
    this.errorField = "";
    const value: number = document.getElementById('type')['value'];
    console.log("Element: ", value);
    if (value != null) {
      this.currentEntryTypeId = value;
    }
  }
}
