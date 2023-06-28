import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, EventPattern } from '@nestjs/microservices';
import { SupplierRegisterRequest } from './supplier-register-request.dto';
import { ConsumerRegisterRequest } from './consumer-register-request.dto';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern({ cmd: 'is_registered_supplier'})
  async isRegisteredSupplier(account: string) {
    return this.appService.isRegisteredSupplier(account);
  }

  @MessagePattern({ cmd: 'is_registered_consumer'})
  async isRegisteredConsumer(account: string) {
    return this.appService.isRegisteredConsumer(account);
  }

  @MessagePattern({ cmd: 'get_supplier'})
  async getSupplier(account: string) {
    return this.appService.getSupplier(account);
  }

  @MessagePattern({ cmd: 'get_consumer'})
  async getConsumer(account: string) {
    return this.appService.getConsumer(account);
  }

  @MessagePattern({ cmd: 'get_owner_address'})
  async getAdminAddress() {
    return this.appService.getOwnerAddress();
  }

  @MessagePattern({ cmd: 'get_all_suppliers'})
  async getAllSuppliers() {
    return this.appService.getAllSuppliers();
  }

  @MessagePattern({ cmd: 'get_all_consumers'})
  async getAllConsumers() {
    return this.appService.getAllConsumers();
  }

  @EventPattern('supplierRegistered')
  async registerSupplier(supplierRegisterRequest: SupplierRegisterRequest){
    this.appService.registerSupplier(supplierRegisterRequest);
  }

  @EventPattern('consumerRegistered')
  async registerConsumer(consumerRegistryRequest: ConsumerRegisterRequest){
    this.appService.registerConsumer(consumerRegistryRequest);
  }
}
