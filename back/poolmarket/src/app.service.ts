import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { SignerService } from './shared/services/signer/signer.service';
import { ProviderService } from './shared/services/provider/provider.service';
import * as poolmarketContractAbi from 'src/contracts/PoolMarket.sol/PoolMarket.json';
import { SMP } from './smp.dto';
import { Offer } from './offer.dto';
import { Bid } from './bid.dto';
import { DispatchedOffer } from './dispatchedOffer.dto';
@Injectable()
export class AppService {
  poolmarketContractInstance: ethers.Contract;
  provider: ethers.providers.BaseProvider;

  constructor(
    private providerService: ProviderService,
    private signerService: SignerService,
  ) {
    this.provider = this.providerService.provider;
    const poolmarketContractAddress = process.env.POOLMARKET_CONTRACT_ADDRESS;
    if (!poolmarketContractAddress || poolmarketContractAddress.length === 0)
      return;
    this.poolmarketContractInstance = new ethers.Contract(
      poolmarketContractAddress,
      poolmarketContractAbi.abi,
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

  async getsmps(): Promise<SMP[]> {
    const currBlock = await this.providerService.provider.getBlock("latest");
    const datetime = new Date(currBlock.timestamp * 1000);
    const smps = [];
    const second = datetime.getSeconds();
    const minute = datetime.getMinutes();
    const hour = datetime.getHours();
    const currentTime = Math.floor(datetime.getTime() / 1000);
    const hourStart = currentTime - second - 60 * minute;
    for (let i = 1; i <= 60; i++) {
      var currentMinute = hourStart + 60 * i;
      if (currentMinute < currentTime) {
        var smp = await this.poolmarketContractInstance.getSMP(currentMinute);
        if (smp > 0) {
          var date = new Date(currentMinute * 1000);
          var he = date.toLocaleDateString('en-us');
          var minutes = date.getMinutes();
          var marginalOffer =
            await this.poolmarketContractInstance.getMarginalOffer(
              currentMinute,
            );
          var volume = this.convertBigNumberToNumber(marginalOffer.amount);
          smps.push(
            new SMP(
              `${he} ${hour + 1}`,
              `${hour}:${minutes}`,
              this.convertBigNumberToNumber(smp) / 100,
              volume,
            ),
          );
        }
      }
    }
    return smps;
  }

  async calculateProjectedPrice() {
    const _smps = await this.getsmps();
    var projectedPrice = 0;
    if (_smps.length == 0) return projectedPrice;
    if (_smps.length == 1) {
      projectedPrice = Number(_smps[0].Price);
      return projectedPrice;
    }
    for (let i = 0; i < _smps.length; i++) {
      var price = Number(_smps[i].Price);
      var duration = 0;
      if (i == 0) {
        duration = Number(_smps[i + 1].Time.split(':')[1]);
      } else if (i == _smps.length - 1) {
        duration = 60 - Number(_smps[i].Time.split(':')[1]);
      } else {
        duration =
          Number(_smps[i + 1].Time.split(':')[1]) -
          Number(_smps[i].Time.split(':')[1]);
      }
      projectedPrice += price * duration;
    }
    return projectedPrice / 60 / 100;
  }

  async getOffers(): Promise<Offer[]> {
    const offerIds = await this.poolmarketContractInstance.getValidOfferIDs();
    var offers = [];
    for (let i = 0; i < offerIds.length; i++) {
      var offer = await this.poolmarketContractInstance.energyOffers(
        offerIds[i],
      );
      var id = offerIds[i];
      var amount = this.convertBigNumberToNumber(offer.amount);
      var price = this.convertBigNumberToNumber(offer.price);
      var submitMinute = this.convertBigNumberToNumber(offer.submitMinute);
      var supplierAccount = offer.supplierAccount;
      var isValid = offer.isValid;
      offers.push(
        new Offer(id, amount, price, submitMinute, supplierAccount, isValid),
      );
    }
    return offers;
  }

  async getBids(): Promise<Bid[]> {
    const currBlock = await this.providerService.provider.getBlock("latest");
    const currHour = Math.floor(currBlock.timestamp / 3600) * 3600;
    const origBids = await this.poolmarketContractInstance.getEnergyBids(currHour);
    var bids = [];
    for (let i = 0; i < origBids.length; i++) {
      var bid = origBids[i];
      var submitTimeStamp = this.convertBigNumberToNumber(bid.submitMinute);
      var submitTime = new Date(submitTimeStamp * 1000);
      bids.push(
        new Bid(
          submitTime.toLocaleTimeString('en-us'),
          this.convertBigNumberToNumber(bid.amount),
          this.convertBigNumberToNumber(bid.price),
          this.convertBigNumberToNumber(bid.submitMinute),
          bid.consumerAccount,
        ),
      );
    }
    return bids;
  }

  async getMyBids(data: any): Promise<Bid[]> {
    const bidHours = data.bidHours.split(',');
    const account = data.account;
    var bids = [];
    for (let currHour of bidHours) {
      const origBids = await this.poolmarketContractInstance.getEnergyBids(+currHour);
      for (let i = 0; i < origBids.length; i++) {
        var bid = origBids[i];
        if (bid.consumerAccount == account) {
          var submitTimeStamp = this.convertBigNumberToNumber(bid.submitMinute);
          var submitTime = new Date(submitTimeStamp * 1000);
          bids.push(
            new Bid(
              submitTime.toLocaleTimeString('en-us'),
              this.convertBigNumberToNumber(bid.amount),
              this.convertBigNumberToNumber(bid.price),
              this.convertBigNumberToNumber(bid.submitMinute),
              bid.consumerAccount,
            ),
          );
        }
      }
    }
    return bids;
  }

  async getDispatchedOffers() {
    const currBlock = await this.provider.getBlock('latest');
    const currHour = Math.floor(currBlock.timestamp / 3600) * 3600;
    const dispatchedOffers =
      await this.poolmarketContractInstance.getDispatchedOffers(currHour);
    var _dispatchedOffers = [];
    for (let i = 0; i < dispatchedOffers.length; i++) {
      _dispatchedOffers.push(
        new DispatchedOffer(
          dispatchedOffers[i][0],
          this.convertBigNumberToNumber(dispatchedOffers[i][1]),
          this.convertBigNumberToNumber(dispatchedOffers[i][2]),
        ),
      );
    }
    return _dispatchedOffers;
  }

  async getSystemMarginalMinutes() {
    const systemMarginalMinutes =
      await this.poolmarketContractInstance.getSystemMarginalMinutes();
    var minutes = [];
    systemMarginalMinutes.forEach((minute) =>
      minutes.push(this.convertBigNumberToNumber(minute)),
    );
    return minutes;
  }

  async getMarginalOffer(timestamp: number) {
    const marginalOffer =
      await this.poolmarketContractInstance.getMarginalOffer(timestamp);
    return {
      amount: this.convertBigNumberToNumber(marginalOffer.amount),
      price: this.convertBigNumberToNumber(marginalOffer.price),
      submitMinute: this.convertBigNumberToNumber(marginalOffer.submitMinute),
      supplierAccount: marginalOffer.supplierAccount,
      isValid: marginalOffer.isValid,
    };
  }

  async getTotalDemand(timestamp: number) {
    const totalDemand = this.convertBigNumberToNumber(
      await this.poolmarketContractInstance.totalDemands(timestamp),
    );
    return totalDemand;
  }

  async getMinMaxPrices() {
    const minPrice = await this.poolmarketContractInstance.minAllowedPrice();
    const maxPrice = await this.poolmarketContractInstance.maxAllowedPrice();
    return {
      min: this.convertBigNumberToNumber(minPrice),
      max: this.convertBigNumberToNumber(maxPrice),
    };
  }
}
