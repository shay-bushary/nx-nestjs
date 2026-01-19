import { Injectable } from '@nestjs/common';
import { SharedService } from '@nx-shay/shared';

@Injectable()
export class AppService {
  getData(): { message: string; id: string; timestamp: string } {
    return {
      message: 'Hello API',
      id: SharedService.generateId('api'),
      timestamp: SharedService.formatDate(new Date(), 'iso'),
    };
  }
}
