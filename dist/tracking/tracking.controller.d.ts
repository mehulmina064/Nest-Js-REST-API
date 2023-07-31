import { Tracking } from './tracking.entity';
import { TrackingService } from './tracking.service';
export declare class TrackingController {
    private readonly trackingService;
    constructor(trackingService: TrackingService);
    findAll(): Promise<Tracking[]>;
    findOne(id: string): Promise<Tracking>;
    save(tracking: Tracking): Promise<Tracking>;
    remove(id: string): Promise<Tracking>;
}
