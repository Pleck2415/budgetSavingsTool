export class Entry {
    constructor(
    public id: number,
    public type: string,
    public personsText: string,
    public personsList: any[],
    public amount: number,
    public frequency: string,
    public annual: number,
    ) {}
  }