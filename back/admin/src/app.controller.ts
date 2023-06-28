import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, EventPattern } from '@nestjs/microservices';
import { ApproveRequest } from './approve-request.dto';
import { TokenRequest } from './token-request.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern({ cmd: 'get_suppliers' })
  async getSuppliers() {
    return this.appService.getSuppliers();
  }

  @MessagePattern({ cmd: 'get_consumers' })
  async getConsumers() {
    return this.appService.getConsumers();
  }

  @EventPattern('approved')
  approve(approveRequest: ApproveRequest) {
    this.appService.approve(approveRequest);
  }

  @EventPattern('token_requested')
  requestToken(tokenRequest: TokenRequest) {
    this.appService.requestToken(tokenRequest);
  }

  @EventPattern('calculate_smp')
  calculateSMP() {
    this.appService.calculateSMP();
  }

  @EventPattern('calculate_poolprice')
  calculatePoolPrice() {
    this.appService.calculatePoolPrice();
  }
}
