export class PersonalBudget {
  constructor(
  public id: number,
  public resource: {
      id: number, 
      description: string
    },
  public personalExpenses: number,
  public sharedExpenses: number,
  public frequencyID: number,
  public totalExpenses: number
  ) {}
}
