export class Entry {
    constructor(
    public type: string,
    public resourcesText: string,
    public resourcesList: any[],
    public amount: number,
    public frequency: string,
    public annual: number,
    ) {}
  }