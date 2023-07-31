/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tracking } from './tracking.entity';

@Injectable()
export class TrackingService {
    constructor(
        @InjectRepository(Tracking)
        private readonly trackingRepository: Repository<Tracking>,
      ) {}
    
      async findAll(): Promise<Tracking[]> {
        return await this.trackingRepository.find();
      }
    
      async findOne(id: string): Promise<Tracking> {
        return await this.trackingRepository.findOne(id);
      }
    
      async save(tracking: Tracking) {
        return await this.trackingRepository.save(tracking);
      }
    
      async remove(id) {
        const tracking = this.trackingRepository.findOne(id).then(result => {
          this.trackingRepository.delete(result);
        });
      }
}
