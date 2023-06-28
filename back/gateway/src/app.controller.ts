import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { AllowanceRequest } from './allowance-request.dto';
import { AppService } from './app.service';
import { ApproveRequest } from './approve-request.dto';
import { ConsumerRegisterRequest } from './consumer-register-request.dto';
import { SupplierRegisterRequest } from './supplier-register-request.dto';
import { TokenRequest } from './token-request.dto';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/admin/suppliers')
  async getSuppliers() {
    const suppliers = await this.appService.getSuppliers();
    return suppliers;
  }

  @Get('/admin/consumers')
  async getConsumers() {
    const consumers = await this.appService.getConsumers();
    return consumers;
  }

  @Post('/admin/approve')
  approve(@Body() approveRequest: ApproveRequest) {
    this.appService.approve(approveRequest);
  }

  @Post('/admin/token')
  requestToken(@Body() tokenRequest: TokenRequest) {
    this.appService.requestToken(tokenRequest);
  }

  // REGISTRY_SERVICE
  @Get('/registry/isregisteredsupplier/:account')
  async isRegisteredSupplier(@Param('account') account: string) {
    const _registeredSupplier = await this.appService.isRegisteredSupplier(
      account,
    );
    return _registeredSupplier;
  }

  @Get('/registry/isregisteredconsumer/:account')
  async isRegisteredConsumer(@Param('account') account: string) {
    const _registeredConsumer = await this.appService.isRegisteredConsumer(
      account,
    );
    return _registeredConsumer;
  }

  @Get('/registry/getsupplier/:account')
  async getSupplier(@Param('account') account: string) {
    const _supplier = await this.appService.getSupplier(account);
    return _supplier;
  }

  @Get('/registry/getconsumer/:account')
  async getConsumer(@Param('account') account: string) {
    const _consumer = await this.appService.getConsumer(account);
    return _consumer;
  }

  @Get('/registry/getOwnerAddress')
  async getAdminAddress() {
    return await this.appService.getOwnerAddress();
  }

  @Get('/registry/getAllSuppliers')
  async getAllSuppliers() {
    return await this.appService.getAllSuppliers();
  }

  @Get('/registry/getAllConsumers')
  async getAllConsumers() {
    return this.appService.getAllConsumers();
  }

  @Post('/registry/registersupplier')
  async registerSupplier(
    @Body() supplierRegistryRequest: SupplierRegisterRequest,
  ) {
    await this.appService.registerSupplier(supplierRegistryRequest);
  }

  @Post('/registry/registerconsumer')
  async registerConsumer(
    @Body() consumerRegistryRequest: ConsumerRegisterRequest,
  ) {
    await this.appService.registerConsumer(consumerRegistryRequest);
  }

  // POOLMARKET_SERVICE
  @Get('/poolmarket/getsmp')
  async getsmp() {
    const _smpList = await this.appService.getsmps();
    return _smpList;
  }

  @Get('/poolmarket/getProjectedPoolPrice')
  async getProjectedPoolPrice() {
    const _projectedPoolPrice = await this.appService.getProjectedPoolPrice();
    return _projectedPoolPrice;
  }

  @Get('/poolmarket/getOffers')
  async getValidOffers() {
    const offers = await this.appService.getOffers();
    return offers;
  }

  @Get('/poolmarket/getBids')
  async getBids() {
    const bids = await this.appService.getBids();
    return bids;
  }

  @Get('/poolmarket/getMyBids/:account/:bidHours')
  async getMyBids(@Param('account') account: string, @Param('bidHours') bidHours: number[]) {
    const mybids = await this.appService.getMyBids(account, bidHours);
    return mybids;
  }

  @Get('/poolmarket/getDispatchedOffers')
  async getDispatchedOffers() {
    const dispatchedOffers = await this.appService.getDispatchedOffers();
    return dispatchedOffers;
  }

  @Get('/poolmarket/getSystemMarginalMinutes')
  async getSystemMarginalMinutes() {
    const systemMarginalMinutes =
      await this.appService.getSystemMarginalMinutes();
    return systemMarginalMinutes;
  }

  @Get('/poolmarket/getMarginalOffer/:timestamp')
  async getMarginalOffer(@Param('timestamp') timestamp: number) {
    const marginalOffer = await this.appService.getMarginalOffer(timestamp);
    return marginalOffer;
  }

  @Get('/poolmarket/getTotalDemand/:timestamp')
  async getTotalDemand(@Param('timestamp') timestamp: number) {
    const totalDemand = await this.appService.getTotalDemand(timestamp);
    return totalDemand;
  }

  @Get('/poolmarket/getMinMaxPrices')
  async getMinMaxPrices() {
    const minmaxPrices = await this.appService.getMinMaxPrices();
    return minmaxPrices;
  }

  // ETK_SERVICE
  @Get('/etk/balance/:account')
  async getBalance(@Param('account') account: string) {
    const balance = await this.appService.getBalance(account);
    return balance;
  }

  @Get('/etk/getOwnerAddress')
  async getETCOwnerAddress() {
    return await this.appService.getETCOwnerAddress();
  }

  @Get('/etk/allowance/:owner/:spender')
  async allowance(
    @Param('owner') owner: string,
    @Param('spender') spender: string,
  ) {
    const allowanceRequest = new AllowanceRequest(owner, spender);
    return await this.appService.allowance(allowanceRequest);
  }
}
