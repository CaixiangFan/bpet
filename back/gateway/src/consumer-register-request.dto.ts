export class ConsumerRegisterRequest {
  constructor(
    public assetID: string,
    public load: number,
    public offerControl: string,
  ) {}
}