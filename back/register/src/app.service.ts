import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { SignerService } from './shared/services/signer/signer.service';
import * as RegistryContractAbi from 'src/contracts/Registry.sol/Registry.json';
import { SupplierRegisterRequest } from 'src/supplier-register-request.dto';
import { ConsumerRegisterRequest } from './consumer-register-request.dto';

@Injectable()
export class AppService {
  registryContractInstance: ethers.Contract;

  constructor(private signerService: SignerService) {
    const registryContractAddress = process.env.REGISTRY_CONTRACT_ADDRESS;
    if (!registryContractAddress || registryContractAddress.length === 0) return;
    this.registryContractInstance = new ethers.Contract(
      registryContractAddress,
      RegistryContractAbi.abi,
      this.signerService.signer
    );
  }

  getHello(): string {
    return 'Hello World!';
  }

  async isRegisteredSupplier(account: string) {
    const _isRegisteredSupplier = await this.registryContractInstance.isRegisteredSupplier(account);
    return _isRegisteredSupplier;
  }

  async isRegisteredConsumer(account: string) {
    const _isRegisteredConsumer = await this.registryContractInstance.isRegisteredConsumer(account);
    return _isRegisteredConsumer;
  }

  async getSupplier(account: string) {
    const _supplier = await this.registryContractInstance.getSupplier(account);
    return {
      'account': _supplier.account,
      'assetId': _supplier.assetId,
      'blockAmount': _supplier.blockAmount,
      'capacity': _supplier.capacity,
      'offerControl': _supplier.offerControl
    };
  }

  async getConsumer(account: string) {
    const _consumer = await this.registryContractInstance.getConsumer(account);
    return {
      'account': _consumer.account,
      'assetId': _consumer.assetId,
      'load': _consumer.load,
      'offerControl': _consumer.offerControl
    }
  }

  async getOwnerAddress() {
    return await this.registryContractInstance.owner();
  }

  async getAllSuppliers() {
    return await this.registryContractInstance.getAllSuppliers();
  }

  async getAllConsumers() {
    return await this.registryContractInstance.getAllConsumers();
  }

  async registerSupplier(supplierRegisterRequest: SupplierRegisterRequest) {
    await this.registryContractInstance.registerSupplier(
      supplierRegisterRequest.assetID,
      supplierRegisterRequest.blockAmount,
      supplierRegisterRequest.capacity,
      supplierRegisterRequest.offerControl
    );
  }

  async registerConsumer(consumerRegisterRequest: ConsumerRegisterRequest) {
    await this.registryContractInstance.registerConsumer(
      consumerRegisterRequest.assetID,
      consumerRegisterRequest.load,
      consumerRegisterRequest.offerControl
    );
  }
}
