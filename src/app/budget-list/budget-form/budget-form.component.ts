import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Entry } from 'src/app/models/entry.model';
import { BudgetsService } from 'src/app/services/budgets.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { ControlTableService } from 'src/app/services/control-table.service';
import { Budget } from 'src/app/models/budget.model';

@Component({
  selector: 'app-budget-form',
  templateUrl: './budget-form.component.html',
  styleUrls: ['./budget-form.component.scss']
})
export class BudgetFormComponent implements OnInit  {

  budgetForm: FormGroup;
  budgetFormDirty: boolean = false;
  entryForm: FormGroup;
  budgetSave: Budget;
  currentBudget: Budget;
  isNewBudget: boolean = true;
  budgetCalculation: boolean = false;

  openEntryForm: boolean = false;
  entryCategory: string;
  entryTypeFR: string;
  bugetEntryTypes = new Array();
  budgetEntryFrequecies = new Array();
  // budgetEntrypersons = new Array();
  budgetEntryPersons: any[] = [];
  budgetEntryPersonsText: string;
  budgetResources = new Array();
  errorField: string = "";

  newEntry: Entry;
  currentEntryTypeId: number = 0;
  currentEntryFrequencyId: number = 0;
  currentBudgetResources: any[] = [];
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
    {headerName: 'Ressource', field: 'personsText', width: 160, resizable: true, sortable: true, filter: true },
    {headerName: 'Montant', field: 'amount', cellStyle: { 'text-align': "right" }, width: 100, resizable: true, editable: true },
    {headerName: 'Fréquence', field: 'frequency', width: 140, resizable: true, sortable: true, filter: true },
    {headerName: 'Annuel', field: 'annual', cellStyle: { 'text-align': "right" }, width: 100, resizable: true },
  ];

  expensesRowData: any;
  expensesColumnDefs = [
    {headerName: 'Type', field: 'type', width: 220, resizable: true, sortable: true, filter: true },
    {headerName: 'Ressource', field: 'personsText', width: 160, resizable: true, sortable: true, filter: true },
    {headerName: 'Montant', field: 'amount', cellStyle: { 'text-align': "right" }, width: 100, resizable: true,  editable: true },
    {headerName: 'Fréquence', field: 'frequency', width: 140, resizable: true, sortable: true, filter: true },
    {headerName: 'Annuel', field: 'annual', cellStyle: { 'text-align': "right" }, width: 100, resizable: true },
  ];

  ngOnInit(): void {
    this.getBudgetControlTables();
    this.budgetEntryFrequecies = this.budgetService.frequencyList;
    this.isNewBudget = this.budgetService.isNewBudget;
    this.initForm();
    this.initEntryForm();
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
      this.budgetFormDirty = false;
      this.currentBudget = this.budgetService.currentBudget;
      this.budgetForm.setValue(this.currentBudget);
      if (Array.isArray(this.currentBudget.resources) && this.currentBudget.resources.length ) {
        this.currentBudgetResources = [];
        this.currentBudgetResources = this.currentBudget.resources;
        this.currentBudgetResources.forEach(element => {
          var description = element.description;
          this.removeFromBudgetResources(description);
        });
        this.hasResources = true;
      } else {
          this.budgetFormDirty = true;
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

  initEntryForm() {
    this.entryForm = this.formBuilder.group({
      type: [null, Validators.required],
      detail: [null],
      personsText: [null, Validators.required],
      amount: [null],
      frequency: [null]
    });
  }

  removeResourceFromSelect() {
    console.log("Remove resource from list");
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
    this.bugetEntryTypes = [];
    const entryTypes = this.cTService.getTableElements("budgetEntryTypes", true);
    // console.log("Entry types in Get: ", entryTypes);
    for (let index = 0; index < entryTypes.length; index++) {
      const element = entryTypes[index];
      this.bugetEntryTypes.push(element);      
    }
    // this.bugetEntryTypes = this.cTService.getTableElements("budgetEntryTypes", true);
    this.budgetResources =[];
    const resources =  this.cTService.getTableElements("budgetResources", false);
    // console.log("Resources in Get: ", resources);
    for (let index = 0; index < resources.length; index++) {
      const element = resources[index];
      this.budgetResources.push(element);
    }
    // this.budgetResources = this.cTService.getTableElements("budgetResources", false);
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

  onChangeNumberOfPersons() {
    var numberOfPersons: number = +document.getElementById('numberOfPersons')['value'];
    var personsList: any[] = [];
    var personObject: any;
    for (let a = 0; a < numberOfPersons; a++) {
      personObject = {number: a+1, personId: null, personName: ""};
      personsList.push(personObject);
    };
    this.budgetEntryPersons = personsList;
  }

  openAddEntry(type: string) {
    this.currentEntryTypeId = null;
    this.currentEntryFrequencyId = null;
    this.getBudgetControlTables();
    this.openEntryForm = true;
    this.entryCategory = type;
    var typeID: number = 0;
    if (this.entryCategory === "incomes") {
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

    var person = "";
    const len = this.budgetEntryPersons.length;
    for (let index = 0; index < len; index++) {
      const element = this.budgetEntryPersons[index];
      if (index < (len-1)) {
        person += element.description + ", ";
      } else {
        person += element.description;
        }      
    };
    this.budgetEntryPersonsText = person;

    if (type != null || frequency != null) {
      this.openEntryForm = false;
      var entryId = this.budgetService.getEntryNextID(this.entryCategory);
      this.newEntry = {id: entryId, type: type, personsText: person, personsList: this.budgetEntryPersons, 
          amount: +amount, frequency: frequency, annual: +annual};
  
      switch (this.entryCategory) {
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
      this.budgetFormDirty = true;
      this.errorField = "";
      this.bugetEntryTypes = [];
      this.getBudgetControlTables()

    }  else {
        this.errorField = "Valeur invalide pour 'Type' ou 'Fréquence'.";
      }
    this.budgetEntryPersons = [];
    this.newEntry = null;
    this.initEntryForm();
  }  

  deleteEntry(type: string) {
    var gridApi: any;
    var entryList: Entry[] = [];
    switch(type) {
      case('incomes'):{ gridApi = this.incomesGridApi; entryList = this.incomesList; break;}
      case('expenses'):{ gridApi = this.expensesGridApi; entryList = this.expensesList; break;}
    };
    const selectedRow = gridApi.getSelectedRows();
    if(selectedRow[0] === undefined) {
      alert("Pas de ligne sélectionnée!");
    } else {
        if (confirm("Voulez-vous supprimer cette entrée?")) {
          var entryId = selectedRow[0].id;
          var entryIndex = entryList.findIndex(element => element.id == entryId);
          if (entryIndex != -1) {
            entryList.splice(entryIndex, 1);
            switch(type) {
              case('incomes'):{ this.incomesList = entryList; this.loadIncomesGridsData(); break;}
              case('expenses'):{ this.expensesList = entryList; this.loadExpensesGridsData(); break;}
            };
          };
          this.onSubmitBudget();
          console.log('Entry Saved to database.');
        } else {
          console.log('Entry Not saved to database.');
        }
      };
  }

  onSubmitBudget() {
    this.budgetForm.patchValue({resources: this.currentBudgetResources});
    this.budgetForm.patchValue({incomes: this.incomesList});
    this.budgetForm.patchValue({expenses: this.expensesList});
    this.budgetSave = this.budgetForm.value;
    this.budgetService.saveBudget(this.budgetSave);
    this.budgetFormDirty= false;
    alert("Budget enregistré!");
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
    // this.router.navigate(['/budget/calculation']);
    this.budgetCalculation = true;
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

  onChangeEntryPerson(personNumber: number) {
    var personField: string = "person" + personNumber;
    var resourceName: string = document.getElementById(personField)['value'];
    console.log("On change entry person: ", resourceName);
    this.budgetEntryPersonsText = "";
       
    if (resourceName != undefined && resourceName != '') {
      var newPerson: boolean = true;
      if (Array.isArray(this.budgetEntryPersons) && this.budgetEntryPersons) {      
        this.budgetEntryPersons.forEach(element => {
          if (element.personName === resourceName) {
            newPerson = false;
          }
        });
      }
      if (newPerson) {
        var index = this.budgetEntryPersons.findIndex(x => x.number == personNumber);
        // this.budgetEntryPersons.push(this.budgetResources[personID]);
        var bRIndex = this.currentBudgetResources.findIndex(y => y.description === resourceName);
        this.budgetEntryPersons[index].personId = this.currentBudgetResources[bRIndex].id;
        this.budgetEntryPersons[index].personName = this.currentBudgetResources[bRIndex].description;
        
        // document.getElementById(personField).setAttribute('value', "");
        console.log("In New person: ", this.budgetEntryPersons);
      } else alert("Cette ressource est déjà sélectionnée!");
    }
    var counter = 0;
    var len = this.budgetEntryPersons.length;
    this.budgetEntryPersons.forEach(element => {
      if (counter < len) {
        this.budgetEntryPersonsText += this.currentBudgetResources[bRIndex].description + ", ";
      } else {
        this.budgetEntryPersonsText += this.currentBudgetResources[bRIndex].description;
      }      
      counter += 1;
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
      var index = this.currentBudgetResources.findIndex(x => x === resource);
      this.currentBudgetResources.splice(index, 1);
      this.budgetResources.splice(index, 0, resource);
      this.addResource = true;
    }
  }
  
  removeEntryPerson(person) {
    if (confirm('Voulez vous supprimer cette ressource ?')) {
      var index = this.budgetEntryPersons.findIndex(x => x.id == person.id);
      this.budgetEntryPersons.splice(index, 1);
    }
  }
}
