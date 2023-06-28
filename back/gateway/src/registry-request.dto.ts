export class RegistryRequest {
  constructor(
    public userType: string,
    public assetID: string,
    public capacityOrLoad: number,
    public account: string,
    public blockAmount: number,
    public orderControl: string,
  ) {}
}