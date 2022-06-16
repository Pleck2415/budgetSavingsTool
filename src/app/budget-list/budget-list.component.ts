import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BudgetsService } from '../services/budgets.service';

@Component({
  selector: 'app-budget-list',
  templateUrl: './budget-list.component.html',
  styleUrls: ['./budget-list.component.scss']
})
export class BudgetListComponent implements OnInit {

  userBudgetsList= new Array();
  budgetObject: any;

  private gridApi;

  rowData: any[] = [];
  columnDefs = [
    {headerName: 'ID', field: 'id', width: 50 },
    {headerName: 'Titre', field: 'title', width: 150, resizable: true, sortable: true, filter: true },
    {headerName: 'Date début', field: 'dateFrom', width: 100, resizable: true, sortable: true, filter: true },
    {headerName: 'Date fin', field: 'dateTo', width: 100, resizable: true, sortable: true, filter: true },
    {headerName: 'Créé par', field: 'createdBy', width: 150, resizable: true, sortable: true, filter: true },
    {headerName: 'Description', field: 'description', width: 300, resizable: true },
  ];

  constructor(private router: Router, private budgetService: BudgetsService) {
    this.getBudgetsList();
    this.loadBudgets();
   }

  ngOnInit(): void {
    this.getBudgetsList();
  }

  createNewBudget() {
    this.router.navigateByUrl('budget/new');
  }

  getBudgetsList() {
    var list = new Array();
    list = this.budgetService.getBudgetsList();
    this.rowData = list;
    // console.log("In budget list: ", this.rowData);
    // this.loadGridsData();
  }

  loadBudgets() {
    this.getBudgetsList();
  }

  selectionChanged() {
    // this.errorField = "";  
    const selectedRow = this.gridApi.getSelectedRows();
    // console.log("Budget: ", selectedRow);
    if(selectedRow[0] === undefined) {
      alert("Pas de type sélectionné!");
    } else {
      const budgetId = +selectedRow[0].id;
      this.budgetObject = this.rowData.find(e => e.id == budgetId);
      this.budgetService.openCurrentBudget(this.budgetObject);
      }
  }

  onBudgetGridReady(params) {

  }

  onBudgetsGridReady(params) {
    // To access the grids API
    this.gridApi = params.api;
  }

}
