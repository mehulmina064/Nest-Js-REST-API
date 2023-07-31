import { Repository } from 'typeorm';
import { prodoRoles } from '../prodoRoles/prodoRoles.entity';
import { zohoToken } from '../../sms/token.entity';
export declare class zohoDataService {
    private readonly prodoRolesRepository;
    private readonly zohoTokenRepository;
    constructor(prodoRolesRepository: Repository<prodoRoles>, zohoTokenRepository: Repository<zohoToken>);
}
