import { Repository } from 'typeorm';
import { TestProcess } from './test.entity';
import { CreateTestProcessDto } from './test.dto';
export declare class testProcessService {
    private readonly connectionRepository;
    constructor(connectionRepository: Repository<TestProcess>);
    findOne(id: string): Promise<any>;
    save(role: CreateTestProcessDto): Promise<CreateTestProcessDto & TestProcess>;
    softRemove(id: string, userId: string): Promise<string>;
    update(id: string, updateRole: Partial<TestProcess>): Promise<TestProcess>;
    findAll(query?: any): Promise<{
        data: TestProcess[];
        count: number;
    }>;
}
