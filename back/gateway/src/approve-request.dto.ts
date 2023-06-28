export class ApproveRequest {
  constructor(
    public account: string,
    public allowance: number,
  ) {}
}