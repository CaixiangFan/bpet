import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { SignerService } from './shared/services/signer/signer.service';
import * as etkContractAbi from 'src/contracts/EnergyToken.sol/EnergyToken.json';
import { AllowanceRequest } from './allowance-request.dto';

@Injectable()
export class AppService {
  etkContractInstance: ethers.Contract;

  constructor(private signerService: SignerService) {
    const etkContractAddress = process.env.TOKEN_CONTRACT_ADDRESS;
    if (!etkContractAddress || etkContractAddress.length === 0) return;
    this.etkContractInstance = new ethers.Contract(
      etkContractAddress,
      etkContractAbi.abi,
      this.signerService.signer
    );
  }
  getHello(): string {
    return 'Hello World!';
  }

  convertBigNumberToNumber (value) {
    const decimals = 18;
    return Math.round(Number(ethers.utils.formatEther(value)) * 10 ** decimals);
  }

  async getBalance(account: string): Promise<number> {
    try {
      const balanceBN = await this.etkContractInstance.balanceOf(account);
      return this.convertBigNumberToNumber(balanceBN);
    } catch (error) {
      console.log(error);
    }
  }
  async getETCOwnerAddress() {
    return await this.etkContractInstance.owner();
  }

  async allowance(allowanceRequest: AllowanceRequest) {
    const allowanceBN = await this.etkContractInstance.allowance(
      allowanceRequest.owner,
      allowanceRequest.spender
    );

    return this.convertBigNumberToNumber(allowanceBN);
  }

}
