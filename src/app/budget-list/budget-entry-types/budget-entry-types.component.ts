import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { on } from 'events';
import { ControlTableService } from 'src/app/services/control-table.service';

@Component({
  selector: 'app-budget-entry-types',
  templateUrl: './budget-entry-types.component.html',
  styleUrls: ['./budget-entry-types.component.scss']
})
export class BudgetEntryTypesComponent implements OnInit {

  budgetEntryTypeForm: FormGroup;
  activeEntryValue: string = "Non";
  elementObject = {entryId: 0, description: "", active: this.activeEntryValue};
  elementsList: any[] = [];
  elementObjectLoaded: boolean = false;
  errorField: string = "";

 
  constructor(private formBuilder: FormBuilder, private controlTableService: ControlTableService) { }

  private gridApi;
  rowData: any[] = [];
  rolumnDefs = [
    {headerName: 'ID', field: 'entryId', width: 100, resizable: true },
    {headerName: 'Description', field: 'description', width: 300, sortable: true, filter: true, resizable: true },
    {headerName: 'Actif', field: 'active', width: 100, sortable: true, filter: true },
  ];

  ngOnInit(): void {
    this.getSavedElementsList();
    this.disableField();
    this.initForm();
  }

  initForm() {    
    document.getElementById('entryId').removeAttribute('disabled');
    var entryObject = this.elementObject;
    this.budgetEntryTypeForm = this.formBuilder.group({
      entryId: [ entryObject.entryId, Validators.required ],
      description: [ entryObject.description, Validators.required ],
      active: [ entryObject.active, Validators.required ]
    });
    if (this.elementObject.description === "") {
      this.elementObjectLoaded = false;
    }
    this.disableField();
  }

  disableField() {
    document.getElementById('entryId').setAttribute('disabled', 'disabled');
  }

  getSavedElementsList() {
    this.elementsList = this.controlTableService.getTableElements("budgetEntryTypes");
    this.loadGridsData();
  }

  onSubmitForm() {
    const tableName = "budgetEntryTypes";
    var alertMessage: string = "";
    var nextID: number = 0;
    nextID = this.controlTableService.getElementNextID(tableName);
    const description = document.getElementById('description')['value'];
    const active = this.activeEntryValue;
    if (this.controlTableService.uniqueField(tableName, description)) {
      this.elementObject = {entryId: nextID, description: description, active: active};
      this.controlTableService.saveNewElement(tableName, this.elementObject, nextID);
      this.elementObjectLoaded = true;
      this.initForm();
      alertMessage = "Enregistré l'id: " + nextID +" avec succès!";
      alert(alertMessage);
    } else {
        this.errorField = "La valeur '" + description +"' existe déjà.";
      }
    this.getSavedElementsList();
  }
  
  loadGridsData() {
    var elementArray = new Array();
    elementArray = [];
    this.elementsList.forEach(element => {
      elementArray.push(element);
    });
    this.rowData = elementArray;
  }

  onGridReady(params) {
    // To access the grids API
   this.gridApi = params.api;
  }

  clearEntry() {
    this.errorField = "";
    const tableName = "budgetEntryTypes";
    this.activeEntryValue = "Non";
    const nextID = this.controlTableService.getElementNextID(tableName);
    this.elementObjectLoaded = false;
    this.elementObject = {entryId: nextID, description: "", active: this.activeEntryValue};
    this.initForm();
  }

  deleteEntry() {
    const tableName = "budgetEntryTypes";
    const entryId = this.elementObject.entryId;
    if (entryId.toString() != "" && entryId != null) {
      this.controlTableService.deleteEntry(tableName, entryId.toString());
      this.clearEntry();
      this.initForm();
      this.getSavedElementsList();
    } else {
      alert("Pas de type sélectionné!");
      }
  }

  openSelectedElement() {
    this.errorField = "";  
    const selectedRow = this.gridApi.getSelectedRows();
    if(selectedRow[0] === undefined) {
      alert("Pas de type sélectionné!");
    } else {
      this.elementObject = {entryId: +selectedRow[0].entryId, description: selectedRow[0].description, active: selectedRow[0].active};
      this.elementObjectLoaded = true;
      this.initForm();
      }
  }

  onValChange(value) {
    this.activeEntryValue = value;
  }
}
