import { Repository } from 'typeorm';
import { BatchItemProcess } from './batchItem.entity';
import { CreateBatchItemProcessDto } from './batchItem.dto';
export declare class batchItemProcessService {
    private readonly connectionRepository;
    constructor(connectionRepository: Repository<BatchItemProcess>);
    findOne(id: string): Promise<any>;
    save(role: CreateBatchItemProcessDto): Promise<CreateBatchItemProcessDto & BatchItemProcess>;
    softRemove(id: string, userId: string): Promise<string>;
    update(id: string, updateRole: Partial<BatchItemProcess>): Promise<BatchItemProcess>;
    findAll(query?: any): Promise<{
        data: BatchItemProcess[];
        count: number;
    }>;
}
