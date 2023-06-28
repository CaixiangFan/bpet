import { Injectable } from '@nestjs/common';
import { ethers, BigNumber } from 'ethers';
import { SignerService } from './shared/services/signer/signer.service';
import { ProviderService } from './shared/services/provider/provider.service';
import * as TokenContractAbi from 'src/contracts/EnergyToken.sol/EnergyToken.json';
import * as RegistryContractAbi from 'src/contracts/Registry.sol/Registry.json';
import * as PoolmarketContractAbi from 'src/contracts/PoolMarket.sol/PoolMarket.json';
import { ApproveRequest } from './approve-request.dto';
import { TokenRequest } from './token-request.dto';

@Injectable()
export class AppService {
  tokenContractInstance: ethers.Contract;
  registryContractInstance: ethers.Contract;
  poolmarketContractInstance: ethers.Contract;
  adminAddress: string;

  constructor(
    private signerService: SignerService,
    private providerService: ProviderService,
  ) {
    const tokenContractAddress = process.env.TOKEN_CONTRACT_ADDRESS;
    const registryContractAddress = process.env.REGISTRY_CONTRACT_ADDRESS;
    const poolmarketContractAddress = process.env.POOLMARKET_CONTRACT_ADDRESS;
    if (!tokenContractAddress || tokenContractAddress.length === 0) return;
    if (!registryContractAddress || registryContractAddress.length === 0)
      return;
    this.tokenContractInstance = new ethers.Contract(
      tokenContractAddress,
      TokenContractAbi.abi,
      this.signerService.signer,
    );

    this.adminAddress = signerService.signer.address;
    this.registryContractInstance = new ethers.Contract(
      registryContractAddress,
      RegistryContractAbi.abi,
      this.signerService.signer,
    );
    this.poolmarketContractInstance = new ethers.Contract(
      poolmarketContractAddress,
      PoolmarketContractAbi.abi,
      this.signerService.signer,
    );
  }

  getHello(): string {
    return 'Hello World!';
  }

  convertBigNumberToNumber(value): number {
    const decimals = 18;
    return Math.round(Number(ethers.utils.formatEther(value)) * 10 ** decimals);
  }

  async getSuppliers(): Promise<any[]> {
    try {
      const registeredSuppliers =
        await this.registryContractInstance.getAllSuppliers();
      const decimals = await this.tokenContractInstance.decimals();
      let suppliers = [];
      for (let i = 0; i < registeredSuppliers.length; i++) {
        const supplier = await this.registryContractInstance.getSupplier(
          registeredSuppliers[i],
        );
        const _allowance = await this.tokenContractInstance.allowance(
          this.adminAddress,
          registeredSuppliers[i],
        );
        const allowance = Math.round(
          +ethers.utils.formatEther(_allowance) * 10 ** decimals,
        );
        suppliers.push({
          id: i + 1,
          account: supplier.account,
          assetId: supplier.assetId,
          allowance,
          blockAmount: supplier.blockAmount,
          capacity: supplier.capacity,
          offerControl: supplier.offerControl,
        });
      }
      return suppliers;
    } catch (error) {
      console.log(error);
    }
  }

  async getConsumers(): Promise<any[]> {
    try {
      const registeredConsumers =
        await this.registryContractInstance.getAllConsumers();
      const decimals = await this.tokenContractInstance.decimals();
      let consumers = [];
      for (let i = 0; i < registeredConsumers.length; i++) {
        const consumer = await this.registryContractInstance.getConsumer(
          registeredConsumers[i],
        );
        const _allowance = await this.tokenContractInstance.allowance(
          this.adminAddress,
          registeredConsumers[i],
        );
        const allowance = Math.round(
          +ethers.utils.formatEther(_allowance) * 10 ** decimals,
        );
        consumers.push({
          id: i + 1,
          account: consumer.account,
          assetId: consumer.assetId,
          allowance,
          load: consumer.load,
          offerControl: consumer.offerControl,
        });
      }
      return consumers;
    } catch (error) {
      console.log(error);
    }
  }

  async approve(approveRequest: ApproveRequest) {
    try {
      await this.tokenContractInstance.approve(
        approveRequest.account,
        approveRequest.allowance,
      );
    } catch (error) {
      console.log(error);
    }
  }

  async requestToken(tokenRequest: TokenRequest) {
    try {
      if (tokenRequest.action === 'mintETK') {
        const tx = await this.tokenContractInstance.mint(
          tokenRequest.account,
          tokenRequest.amount,
        );
      } else if (tokenRequest.action === 'burnETK') {
        const tx = await this.tokenContractInstance.burn(tokenRequest.amount);
      }
    } catch (error) {
      console.log(error);
    }
  }


  calculateSMP() {
    // listener for BidSubmitted event
    const listener = async (amount: BigNumber, price: BigNumber, sender: string, event: object) => {
      let result = {
        amount: this.convertBigNumberToNumber(amount),
        price: this.convertBigNumberToNumber(price),
        sender: sender,
        data: event,
      };
      // console.log(JSON.stringify(result, null, 4));
      const offerIds = await this.poolmarketContractInstance.getValidOfferIDs();
      if (offerIds.length > 0) {
        console.log('calculating smp...');
        try {
          const tx = await this.poolmarketContractInstance.calculateSMP();
          const receipt = await tx.wait(1);
          if (receipt.status == 1) {
            console.log('confirmations: ', receipt.confirmations);
            const currBlock = await this.providerService.provider.getBlock("latest");
            const currMinute = Math.floor(currBlock.timestamp / 60) * 60;
            const smp = this.convertBigNumberToNumber(await this.poolmarketContractInstance.getSMP(currMinute));
            const totaldemand = this.convertBigNumberToNumber(await this.poolmarketContractInstance.getLatestTotalDemand());
            console.log({smp});
            console.log({totaldemand});
          }

        } catch (error) {
          console.log('error code:', error.code);
        }
      }
    };
    console.log('Listening to the BidSubmitted event ...');
    this.poolmarketContractInstance.on("BidSubmitted", listener);
  }

  async calculatePoolPrice() {
    const currBlock = await this.providerService.provider.getBlock("latest");
    const pastHour: number = (Math.floor(currBlock.timestamp / 3600) - 1) * 3600;
    const dispatchedOffers = await this.poolmarketContractInstance.getDispatchedOffers(pastHour);
    if (dispatchedOffers.length > 0) {
      // console.log('calculating smp...');
      // try {
      //   const tx = await this.poolmarketContractInstance.calculateSMP();
      //   const receipt = await tx.wait(1);
      //   if (receipt.status == 1) console.log('confirmations: ', receipt.confirmations);
      // } catch (error) {
      //   console.log('error code:', error.code);
      // }

      console.log('Calculating pool prices ...');
      try {
        const tx = await this.poolmarketContractInstance.calculatePoolPrice(pastHour);
        const receipt = await tx.wait(1);
        if (receipt.status == 1) console.log('confirmations: ', receipt.confirmations);
      } catch(error) {
        console.log('error code:', error.code);
      }

    } else {
      console.log("No offers dispatched in the past hour!")
    }
  }
}
