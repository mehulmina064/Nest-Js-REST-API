import { Repository } from 'typeorm';
import { Tracking } from './tracking.entity';
export declare class TrackingService {
    private readonly trackingRepository;
    constructor(trackingRepository: Repository<Tracking>);
    findAll(): Promise<Tracking[]>;
    findOne(id: string): Promise<Tracking>;
    save(tracking: Tracking): Promise<Tracking>;
    remove(id: any): Promise<void>;
}
