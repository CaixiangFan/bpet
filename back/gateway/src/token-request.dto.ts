export class TokenRequest {
  constructor(
    public action: string,
    public account: string,
    public amount: number,
  ) {}
}