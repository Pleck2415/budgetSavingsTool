import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-budget-list',
  templateUrl: './budget-list.component.html',
  styleUrls: ['./budget-list.component.scss']
})
export class BudgetListComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  createNewBudget() {
    this.router.navigateByUrl('budgets/new');
  }
}
