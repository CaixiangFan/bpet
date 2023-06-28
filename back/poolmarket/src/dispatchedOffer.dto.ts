export class DispatchedOffer {
  constructor(
    public supplierAccount: string,
    public dispatchedAmount: number,
    public dispatchedAt: number,
  ) {}
}