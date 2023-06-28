export class Offer {
  constructor(
    public id: string,
    public amount: number,
    public price: number,
    public submitMinute: number,
    public supplierAccount: string,
    public isValid: boolean,
  ) {}
}