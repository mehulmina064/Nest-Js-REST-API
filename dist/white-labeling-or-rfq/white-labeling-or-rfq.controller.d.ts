import { WhiteLabelingOrRfqService } from './white-labeling-or-rfq.service';
import { WhiteLabelingOrRfq } from './white-labeling-or-rfq.entity';
export declare class WhiteLabelingOrRfqController {
    private readonly whiteLabelingOrRfqService;
    constructor(whiteLabelingOrRfqService: WhiteLabelingOrRfqService);
    findAll(): Promise<WhiteLabelingOrRfq[]>;
    findTypeByUser(type: string, userId: string): Promise<WhiteLabelingOrRfq[]>;
    findAllByUser(userId: string): Promise<WhiteLabelingOrRfq[]>;
    findOne(id: string): Promise<WhiteLabelingOrRfq>;
    save(category: WhiteLabelingOrRfq): Promise<WhiteLabelingOrRfq>;
    update(id: string, rfq: WhiteLabelingOrRfq): Promise<WhiteLabelingOrRfq | null>;
    delete(id: any): Promise<void>;
}
