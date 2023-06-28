export class SupplierRegisterRequest {
  constructor(
    public assetID: string,
    public blockAmount: number,
    public capacity: number,
    public offerControl: string,
  ) {}
}