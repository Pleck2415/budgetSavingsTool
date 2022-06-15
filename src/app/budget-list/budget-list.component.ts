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

  private gridApi;

  rowData = new Array();
  columnDefs = [
    {headerName: 'ID', field: 'id', width: 50 },
    {headerName: 'Titre', field: 'title', width: 200, resizable: true, sortable: true, filter: true },
    {headerName: 'Date début', field: 'dateFrom', width: 150, resizable: true, sortable: true, filter: true },
    {headerName: 'Date fin', field: 'dateTo', width: 150, resizable: true, sortable: true, filter: true },
    {headerName: 'Créé par', field: 'createdBy', width: 150, resizable: true, sortable: true, filter: true },
    {headerName: 'Description', field: 'description', width: 400, resizable: true },
  ];

  constructor(private router: Router, private budgetService: BudgetsService) { }

  ngOnInit(): void {
    this.getBudgetsList();
  }

  createNewBudget() {
    this.router.navigateByUrl('budgets/new');
  }

  getBudgetsList() {
    this.rowData = this.budgetService.getBudgetsList();
    console.log("In budget list: ", this.rowData);
    // this.loadGridsData();
  }

  // loadGridsData() {
  //   var elementArray = new Array();
  //   elementArray = [];
  //   this.userBudgetsList.forEach(element => {
  //     var elementObject = [{id: element.id, description: element.description, createdBy: element.createdBy, dateFrom: element.dateFrom, 
  //                           dateTo: element.dateTo, title: element.title, incomes: element.incomes, expenses: element.expenses }];
  //     console.log("Object: ", elementObject);
  //     elementArray.push(elementObject);
  //   });
  //   this.rowData = [];
  //   this.rowData = elementArray;
  //   console.log("In rowData", this.rowData );
  // }

  cellValueChanged(params) {

  }

  onBudgetGridReady(params) {

  }

  onBudgetsGridReady(params) {
    // To access the grids API
    this.gridApi = params.api;
  }

}
