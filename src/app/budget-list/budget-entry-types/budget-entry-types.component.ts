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
  elementObject = {id: 0, description: "", typeId: null, active: this.activeEntryValue};
  elementsList: any[] = [];
  elementObjectLoaded: boolean = false;
  entryTypes = [{id: null, description: ""}];

  errorField: string = "";
 
  constructor(private formBuilder: FormBuilder, private controlTableService: ControlTableService) { }

  private gridApi;
  rowData: any[] = [];
  rolumnDefs = [
    {headerName: 'ID', field: 'id', width: 50, resizable: true },
    {headerName: 'Description', field: 'description', width: 275, sortable: true, filter: true, resizable: true },
    {headerName: 'Type', field: 'type', width: 150, sortable: true, filter: true, resizable: true },
    {headerName: 'Actif', field: 'active', width: 75, sortable: true, filter: true },
  ];

  ngOnInit(): void {
    this.initForm();
    this.getEntryTypesList();
    this.getSavedElementsList();
    this.disableField();
  }

  initForm() {    
    document.getElementById('id').removeAttribute('disabled');
    var entryObject = this.elementObject;
    this.budgetEntryTypeForm = this.formBuilder.group({
      id: [ entryObject.id, Validators.required ],
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
    this.entryTypes = [
      {id: 0, description: "Dépense"}, 
      {id: 1, description: "Revenu"}
    ];
  }

  disableField() {
    document.getElementById('id').setAttribute('disabled', 'disabled');
  }

  getSavedElementsList() {
    this.elementsList = this.controlTableService.getTableElements("budgetEntryTypes", true);
    this.loadGridsData();
  }

  onSubmitForm() {
    const tableName = "budgetEntryTypes";
    var alertMessage: string = "";
    var nextID: number = 0;
    nextID = this.controlTableService.getElementNextID(tableName);
    const description = document.getElementById('description')['value'];
    const type = document.getElementById('typeId')['value'];
    const active = this.activeEntryValue;
    if (this.controlTableService.uniqueField(tableName, description)) {
      this.elementObject = {id: nextID, description: description, typeId: +type, active: active};
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
      var elementObject = {id: element.id , description: element.description, type: this.controlTableService.getTypeDescription(element.typeId, this.entryTypes), active: element.active};
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
    this.elementObject = {id: nextID, description: "", typeId: null, active: this.activeEntryValue};
    this.initForm();
  }

  deleteEntry() {
    const tableName = "budgetEntryTypes";
    const id = this.elementObject.id;
    if (id.toString() != "" && id != null) {
      this.controlTableService.deleteEntry(tableName, id.toString());
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
      this.elementObject = {id: +selectedRow[0].id, description: selectedRow[0].description, typeId: this.controlTableService.getTypeId(selectedRow[0].type, this.entryTypes), active: selectedRow[0].active};
      this.elementObjectLoaded = true;
      this.initForm();
      }
  }

  onValChange(value) {
    this.activeEntryValue = value;
  }
}
