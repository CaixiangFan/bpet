import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';

@Injectable()
export class ProviderService {
  provider: ethers.providers.BaseProvider;
  constructor() {
    this.setupProvider();
  }

  setupProvider() {
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    this.provider = provider;
  }
}
