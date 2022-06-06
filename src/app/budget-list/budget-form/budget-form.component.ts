import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-budget-form',
  templateUrl: './budget-form.component.html',
  styleUrls: ['./budget-form.component.scss']
})
export class BudgetFormComponent implements OnInit {


  budgetForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.budgetForm = this.formBuilder.group({
      title: [null],
      createdBy: [null],
      description: [null],
      dateFrom: [null],
      dateTo: [null]
    }); 
  }

}
