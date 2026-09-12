import { Controller, Get } from '@nestjs/common';
import { CatalogService } from './catalog.service.js';
import { MessagePattern } from '@nestjs/microservices';
import {rpcBadRequest} from '../../../libs/rpc/src/rpc.helpers.js';

@Controller()
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @MessagePattern('service.ping')
  ping() {
   return  rpcBadRequest('Ping request failed');
    return this.catalogService.ping();
  }
}
