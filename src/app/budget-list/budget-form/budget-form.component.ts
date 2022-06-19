import { AfterViewInit, Component, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Entry } from 'src/app/models/entry.model';
import { BudgetsService } from 'src/app/services/budgets.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { ControlTableService } from 'src/app/services/control-table.service';
import { Budget } from 'src/app/models/budget.model';
import { CollapseComponent } from 'angular-bootstrap-md';
@Component({
  selector: 'app-budget-form',
  templateUrl: './budget-form.component.html',
  styleUrls: ['./budget-form.component.scss']
})
export class BudgetFormComponent implements OnInit  {

  // @ViewChildren(CollapseComponent) collapses!: CollapseComponent[];

  // ngAfterViewInit() {
  //   Promise.resolve().then(() => {
  //     this.collapses.forEach((collapse: CollapseComponent) => {
  //       collapse.toggle();
  //     });
  //   })
  // }

  budgetForm: FormGroup;
  entryForm: FormGroup;
  budgetSave: Budget;
  currentBudget: Budget;
  isNewBudget: boolean = true;

  public isCollapsed = false;

  // modalRef: BsModalRef;
  openEntryForm: boolean = false;
  entryType: string;
  entryTypeFR: string;
  bugetEntryTypes = new Array();
  budgetEntryFrequecies = new Array();
  budgetResources = new Array();
  errorField: string = "";

  newEntry: Entry;
  currentEntryTypeId: number = 0;
  currentEntryFrequencyId: number = 0;
  currentBudgetResources: any[] = [{id: 99, description: "Toutes les ressources", active: "Oui"}];
  currentResourceObject: any;
  hasResources: boolean = false;
  addResource: boolean = true;
  resourceSelected: boolean = false;
  selectResource: boolean = false;
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
    {headerName: 'Type', field: 'type', width: 220, resizable: true, sortable: true, filter: true },
    {headerName: 'Ressource', field: 'resource', width: 160, resizable: true, sortable: true, filter: true },
    {headerName: 'Montant', field: 'amount', cellStyle: { 'text-align': "right" }, width: 100, resizable: true, editable: true },
    {headerName: 'Fréquence', field: 'frequency', width: 140, resizable: true, sortable: true, filter: true },
    {headerName: 'Annuel', field: 'annual', cellStyle: { 'text-align': "right" }, width: 100, resizable: true },
  ];

  expensesRowData: any;
  expensesColumnDefs = [
    {headerName: 'Type', field: 'type', width: 220, resizable: true, sortable: true, filter: true },
    {headerName: 'Ressource', field: 'resource', width: 160, resizable: true, sortable: true, filter: true },
    {headerName: 'Montant', field: 'amount', cellStyle: { 'text-align': "right" }, width: 100, resizable: true,  editable: true },
    {headerName: 'Fréquence', field: 'frequency', width: 140, resizable: true, sortable: true, filter: true },
    {headerName: 'Annuel', field: 'annual', cellStyle: { 'text-align': "right" }, width: 100, resizable: true },
  ];

  ngOnInit(): void {
    this.isNewBudget = this.budgetService.isNewBudget;
    this.getBudgetControlTables();
    this.initForm();
    this.budgetEntryFrequecies = this.budgetService.frequencyList;
    this.getAnnulalTotal();
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
      resources: [null],
      incomes: [null],
      expenses: [null]
    });
    if(!this.isNewBudget) {
      this.currentBudget = this.budgetService.currentBudget;
      this.budgetForm.setValue(this.currentBudget);
      if (Array.isArray(this.currentBudget.resources) && this.currentBudget.resources.length ) {
        this.currentBudgetResources = this.currentBudget.resources;
        this.currentBudgetResources.forEach(element => {
          var description = element.description;
          this.removeFromBudgetResources(description);
        });
        this.hasResources = true;
      } else {
          this.currentBudgetResources = [];
        }

      if  (Array.isArray(this.currentBudget.incomes) && this.currentBudget.incomes.length ) {
        this.incomesList = this.currentBudget.incomes;
        this.loadIncomesGridsData();
      } else {
          this.incomesList =  [];
        }
      
      if  (Array.isArray(this.currentBudget.expenses) && this.currentBudget.expenses.length ) {
        this.expensesList = this.currentBudget.expenses;
        this.loadExpensesGridsData();
      } else {
          this.expensesList = [];
        }
    }
  }

  removeFromBudgetResources(name: string) {
    const resourcesList = this.budgetResources;
    for (const key in resourcesList) {
      if (Object.prototype.hasOwnProperty.call(resourcesList, key)) {
        const element = resourcesList[key];
        if (element.description === name) {
          resourcesList.splice(resourcesList[key], 1);
        }
      }
    }
    this.budgetResources = resourcesList;
  }

  getBudgetControlTables() {
    this.bugetEntryTypes = this.cTService.getTableElements("budgetEntryTypes", true);
    this.budgetResources = this.cTService.getTableElements("budgetResources", false);
  }

  getAnnulalTotal() {
    this.incomesTotal = this.budgetService.getAnnualTotal(this.incomesList);
    this.expensesTotal = this.budgetService.getAnnualTotal(this.expensesList);
  }

  loadExpensesGridsData() {
    this.expensesRowData = this.expensesList;
    var expensesArray = new Array();
    expensesArray = [];
    this.expensesList.forEach(element => {
      expensesArray.push(element);
      this.expensesRowData = expensesArray;
    });
    this.getAnnulalTotal();
  }

  loadIncomesGridsData() {
    this.incomesRowData = this.incomesList;
    var incomesArray = new Array();
    incomesArray = [];   
    this.incomesList.forEach(element => {
      incomesArray.push(element);
      this.incomesRowData = incomesArray;
    });
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
    this.getBudgetControlTables();
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
    const annual = this.budgetService.convertToAnnualIncomes(+amount, +this.currentEntryFrequencyId);
    const detail = document.getElementById('detail')['value'];
    var detailText = detail;
    if (detail != "") {
      detailText = " - " + detail; 
    }
    const type = this.budgetService.getEntryTypeDescription(this.currentEntryTypeId, this.bugetEntryTypes) + detailText;
    const frequency = this.budgetService.getFrequencyDescription(this.currentEntryFrequencyId);
    const resource = document.getElementById('resource')['value'];
    if (type != null || frequency != null) {
      this.openEntryForm = false;
      this.newEntry = {type: type, resource: resource, 
          amount: amount, frequency: frequency, annual: annual};
  
      switch (this.entryType) {
        case("incomes"): {
          this.incomesList.push(this.newEntry);
          this.loadIncomesGridsData();
          break;
        }
        case("expenses"): {
          this.expensesList.push(this.newEntry);
          this.loadExpensesGridsData();
          break;
        }
      }
      this.errorField = "";
      this.bugetEntryTypes = [];
      this.getBudgetControlTables()

    }  else {
        this.errorField = "Valeur invalide pour 'Type' ou 'Fréquence'.";
      }  
  }

  deleteEntry(type: string) {

  }

  onSubmitBudget() {
    this.budgetForm.patchValue({resources: this.currentBudgetResources});
    this.budgetForm.patchValue({incomes: this.incomesList});
    this.budgetForm.patchValue({expenses: this.expensesList});
    this.budgetSave = this.budgetForm.value;
    this.budgetService.saveBudget(this.budgetSave);
    alert("Budget saved!");
  }

  openControlTable(tableName: string) {
    this.router.navigate(['/' + tableName]);
  }

  onChangeFrequency() {
    this.errorField = "";
    const value: number = document.getElementById('frequency')['value'];
    if (value != null) {
      this.currentEntryFrequencyId = value;
    }
  }

  onChangeType() {
    this.errorField = "";
    const value: number = document.getElementById('type')['value'];
    if (value != null) {
      this.currentEntryTypeId = value;
    }
  }

  openCalculationForm() {
    this.router.navigate(['/budget/calculation']);
  }

  addBudgetResource() {
    this.selectResource = true;
  }

  onChangeResource() {
    this.resourceSelected = false;
    const resourceID: number = document.getElementById('resource')['value'];
    this.budgetResources.forEach(element => {
      if (resourceID != null && resourceID == element.id) {
        this.currentResourceObject = element;
        this.resourceSelected = true
      }
    });
  }

  confirmBudgetResource() {
    this.currentBudgetResources.push(this.currentResourceObject);
    var index = this.budgetResources.findIndex(x => x.description === this.currentResourceObject.description)
    this.budgetResources.splice(index, 1); 
    if (Array.isArray(this.currentBudgetResources) && this.currentBudgetResources.length) {
      this.hasResources = true;
    }
    this.currentResourceObject = null;
    this.resourceSelected = false;
    this.selectResource = false;
    document.getElementById('resource').setAttribute('value', "");
    if (this.budgetResources.length == 0) {
      this.addResource = false;
    }
  }

  onRemoveResource(resource) {
    if (confirm('Voulez vous supprimer cette ressource ?')) {
      var index = this.currentBudgetResources.findIndex(x => x.id == resource.id)
      this.currentBudgetResources.splice(index, 1);
      this.budgetResources.splice(index, 0, resource);
      this.addResource = true;
    } else {
      // false
    }
  }
}
