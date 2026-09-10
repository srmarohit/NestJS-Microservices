import { Controller, Get, Inject } from '@nestjs/common';
import { GatewayService } from './gateway.service.js';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller()
export class GatewayController {
  constructor(@Inject('CatalogService') private readonly catalogClient: ClientProxy,
              @Inject('SearchService') private readonly searchClient: ClientProxy,
              @Inject('MediaService') private readonly mediaClient: ClientProxy) {}

  @Get('health')
async  health(){
    
    const ping = async (service: string, client: ClientProxy) => {
      try {
        const result = await firstValueFrom(client.send('service.ping', {
          from: 'gateway'
        }));
        return {
          ok: true,
          service,
          result,
        };
      } catch (error) {
        console.error(`Error pinging ${service}:`, error);
        return {
          ok: false,
          service,
          error: error?.message,
        }
      }
    }

    const results = await Promise.all([
      ping('CatalogService', this.catalogClient),
      ping('SearchService', this.searchClient),
      ping('MediaService', this.mediaClient),
    ]);

    const ok = results.every(result => result.ok);

    return {
      ok,
      gateway: {
        service: 'gateway',
        now: new Date().toLocaleDateString(),
      },
      services: {
        CatalogService: results[0],
        SearchService: results[1],
        MediaService: results[2],
      }
    }
  }
}
