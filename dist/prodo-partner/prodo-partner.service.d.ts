import { Repository } from 'typeorm';
import { ProdoPartner } from './prodo-partner.entity';
export declare class ProdoPartnerService {
    private readonly prodoPartnerRepository;
    constructor(prodoPartnerRepository: Repository<ProdoPartner>);
    findAll(): Promise<ProdoPartner[]>;
    findOne(id: string): Promise<ProdoPartner>;
    save(prodoPartner: ProdoPartner): Promise<ProdoPartner>;
    remove(id: any): Promise<void>;
}
