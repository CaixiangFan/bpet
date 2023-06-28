export class Bid {
  constructor(
    public submitAt: string,
    public amount: number,
    public price: number,
    public submitMinute: number,
    public consumerAccount: string,
  ) {}
}