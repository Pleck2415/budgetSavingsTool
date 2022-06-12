import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ControlTableService } from 'src/app/services/control-table.service';

@Component({
  selector: 'app-budget-entry-types',
  templateUrl: './budget-entry-types.component.html',
  styleUrls: ['./budget-entry-types.component.scss']
})
export class BudgetEntryTypesComponent implements OnInit {

  budgetEntryTypeForm: FormGroup;
  activeEntryValue: string = "Non";
  elementObject = {entryId: 0, description: "", typeId: null, active: this.activeEntryValue};
  elementsList: any[] = [];
  elementObjectLoaded: boolean = false;
  entryTypes= new Array();
  errorField: string = "";
 
  constructor(private formBuilder: FormBuilder, private controlTableService: ControlTableService) { }

  private gridApi;
  rowData: any[] = [];
  rolumnDefs = [
    {headerName: 'ID', field: 'entryId', width: 100, resizable: true },
    {headerName: 'Description', field: 'description', width: 300, sortable: true, filter: true, resizable: true },
    {headerName: 'Type', field: 'type', width: 150, sortable: true, filter: true, resizable: true },
    {headerName: 'Actif', field: 'active', width: 100, sortable: true, filter: true },
  ];

  ngOnInit(): void {
    this.getEntryTypesList();
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
      typeId: [ entryObject.typeId, Validators.required ],
      active: [ entryObject.active, Validators.required ]
    });
    if (this.elementObject.description === "") {
      this.elementObjectLoaded = false;
    }
    this.disableField();
  }

  getEntryTypesList() {
    this.entryTypes = [];
    const entryTypes = this.controlTableService.entryTypes;
    entryTypes.forEach(element => {
      this.entryTypes.push(element);      
    });
    console.log("Entry types list: ", this.entryTypes);
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
    const type = document.getElementById('type')['value'];
    const active = this.activeEntryValue;
    if (this.controlTableService.uniqueField(tableName, description)) {
      this.elementObject = {entryId: nextID, description: description, typeId: type, active: active};
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
    // var typeDescription: string = "";
    elementArray = [];
    this.elementsList.forEach(element => {
      // typeDescription = this.controlTableService.getTypeDescription(element.typeId);
      var elementObject = {entryId: element.entryId , description: element.description, type: this.controlTableService.getTypeDescription(element.typeId), active: element.active};
      elementArray.push(elementObject);
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
    this.elementObject = {entryId: nextID, description: "", typeId: null, active: this.activeEntryValue};
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
      this.elementObject = {entryId: +selectedRow[0].entryId, description: selectedRow[0].description, typeId: selectedRow[0].typeId, active: selectedRow[0].active};
      this.elementObjectLoaded = true;
      this.initForm();
      }
  }

  onValChange(value) {
    this.activeEntryValue = value;
  }
}
