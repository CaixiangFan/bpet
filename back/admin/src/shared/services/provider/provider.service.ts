import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';

@Injectable()
export class ProviderService {
  provider: ethers.providers.BaseProvider;
  wsProvider: ethers.providers.WebSocketProvider;
  constructor() {
    this.setupProvider();
  }

  setupProvider() {
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    this.provider = provider;
  }

  setupWSProvider() {
    const wsProvider = new ethers.providers.WebSocketProvider(
      process.env.WS_RPC_URL,
    );
    this.wsProvider = wsProvider;
  }
}
