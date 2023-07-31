import { Repository } from 'typeorm';
import { PSkuProcess } from './process.entity';
import { CreatePSkuProcessDto } from './process.dto';
export declare class PSkuProcessService {
    private readonly connectionRepository;
    constructor(connectionRepository: Repository<PSkuProcess>);
    findOne(id: string): Promise<any>;
    save(role: CreatePSkuProcessDto): Promise<CreatePSkuProcessDto & PSkuProcess>;
    softRemove(id: string, userId: string): Promise<string>;
    update(id: string, updateRole: Partial<PSkuProcess>): Promise<PSkuProcess>;
    findAll(query?: any): Promise<{
        data: PSkuProcess[];
        count: number;
    }>;
}
