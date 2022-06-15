import { Entry } from "./entry.model";

export class Budget {
  constructor(
  public id: number,
  public title: string,
  public dateFrom: string,
  public dateTo: string,
  public createdBy: string,
  public description: string,
  public incomes: Entry[],
  public expenses: Entry[]
  ) {}
}
