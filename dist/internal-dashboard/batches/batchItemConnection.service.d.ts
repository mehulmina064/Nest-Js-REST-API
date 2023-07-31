import { Repository } from 'typeorm';
import { BatchItemConnection } from './batch.entity';
import { CreateBatchItemConnectionDto } from './batch.dto';
export declare class batchItemConnectionService {
    private readonly connectionRepository;
    constructor(connectionRepository: Repository<BatchItemConnection>);
    findOne(id: string): Promise<any>;
    save(role: CreateBatchItemConnectionDto): Promise<CreateBatchItemConnectionDto & BatchItemConnection>;
    softRemove(id: string, userId: string): Promise<string>;
    update(id: string, updateRole: Partial<BatchItemConnection>): Promise<BatchItemConnection>;
    findAll(query?: any): Promise<{
        data: BatchItemConnection[];
        count: number;
    }>;
}
