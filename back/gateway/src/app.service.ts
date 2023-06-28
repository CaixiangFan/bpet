import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApproveRequest } from './approve-request.dto';
import { AllowanceRequest } from './allowance-request.dto';
import { ConsumerRegisterRequest } from './consumer-register-request.dto';
import { SupplierRegisterRequest } from './supplier-register-request.dto';
import { TokenRequest } from './token-request.dto';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AppService {
  constructor(
    @Inject('ADMIN_SERVICE') private adminClient: ClientProxy,
    @Inject('REGISTRY_SERVICE') private registryClient: ClientProxy,
    @Inject('POOLMARKET_SERVICE') private poolmarketClient: ClientProxy,
    @Inject('ETK_SERVICE') private etkClient: ClientProxy,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  // ADMIN_SERVICE
  async getSuppliers() {
    return this.adminClient.send({ cmd: 'get_suppliers' }, {});
  }

  async getConsumers() {
    return this.adminClient.send({ cmd: 'get_consumers' }, {});
  }

  approve(approveRequest: ApproveRequest) {
    this.adminClient.emit('approved', approveRequest);
  }

  requestToken(tokenRequest: TokenRequest) {
    this.adminClient.emit('token_requested', tokenRequest);
  }

  // schedule a job to run 1 second after the app starts.
  //calculateSMP keeps listening to the BidSubmitted event
  // @Cron('1 * * * * *')
  @Cron(new Date(Date.now() + 1 * 1000))
  calculateSMP() {
    this.adminClient.emit('calculate_smp', {});
  }

  // schedule a job to run every hour, at the start of the 1st minute
  // to calculate previous hour's PoolPrice on-chain.
  @Cron('0 1 * * * *')
  calculatePoolPrice() {
    this.adminClient.emit('calculate_poolprice', {});
  }

  // REGISTRY_SERVICE
  async isRegisteredSupplier(account: string) {
    return this.registryClient.send({ cmd: 'is_registered_supplier' }, account);
  }

  async isRegisteredConsumer(account: string) {
    return this.registryClient.send({ cmd: 'is_registered_consumer' }, account);
  }

  async getSupplier(account: string) {
    return this.registryClient.send({ cmd: 'get_supplier' }, account);
  }

  async getConsumer(account: string) {
    return this.registryClient.send({ cmd: 'get_consumer' }, account);
  }

  async getOwnerAddress() {
    return this.registryClient.send({ cmd: 'get_owner_address' }, {});
  }

  async getAllSuppliers() {
    return this.registryClient.send({ cmd: 'get_all_suppliers' }, {});
  }

  async getAllConsumers() {
    return this.registryClient.send({ cmd: 'get_all_consumers' }, {});
  }

  async registerSupplier(supplierRegistryRequest: SupplierRegisterRequest) {
    this.registryClient.emit('supplierRegistered', supplierRegistryRequest);
  }

  async registerConsumer(consumerRegistryRequest: ConsumerRegisterRequest) {
    this.registryClient.emit('consumerRegistered', consumerRegistryRequest);
  }

  // POOLMARKET_SERVICE
  async getsmps() {
    return this.poolmarketClient.send({ cmd: 'get_smps' }, {});
  }

  async getProjectedPoolPrice() {
    return this.poolmarketClient.send({ cmd: 'get_projected_poolprice' }, {});
  }

  async getOffers() {
    return this.poolmarketClient.send({ cmd: 'get_offers' }, {});
  }

  async getBids() {
    return this.poolmarketClient.send({ cmd: 'get_bids' }, {});
  }

  async getMyBids(account: string, bidHours: number[]) {
    return this.poolmarketClient.send({ cmd: 'get_my_bids' }, {account, bidHours});
  }

  async getDispatchedOffers() {
    return this.poolmarketClient.send({ cmd: 'get_dispatched_offers' }, {});
  }

  async getSystemMarginalMinutes() {
    return this.poolmarketClient.send(
      { cmd: 'get_system_marginal_minutes' },
      {},
    );
  }

  async getMarginalOffer(timestamp: number) {
    return this.poolmarketClient.send({ cmd: 'get_marginal_offer' }, timestamp);
  }

  async getTotalDemand(timestamp: number) {
    return this.poolmarketClient.send({ cmd: 'get_total_demand' }, timestamp);
  }

  async getMinMaxPrices() {
    return this.poolmarketClient.send({ cmd: 'get_min_max_prices' }, {});
  }

  // ETK_SERVICE
  async getBalance(account: string) {
    return this.etkClient.send({ cmd: 'get_balance' }, account);
  }

  async getETCOwnerAddress() {
    return this.etkClient.send({ cmd: 'get_etc_owner_address' }, {});
  }

  async allowance(allowanceRequest: AllowanceRequest) {
    return this.etkClient.send({ cmd: 'allowance' }, allowanceRequest);
  }
}
