import { Controller, Get } from '@nestjs/common';
import { SearchService } from './search.service.js';

@Controller()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  getHello(): string {
    return this.searchService.getHello();
  }
}
