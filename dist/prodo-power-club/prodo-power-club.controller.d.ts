import { ProdoPowerClubService } from './prodo-power-club.service';
import { ProdoPowerClub } from './prodo-power-club.entity';
export declare class ProdoPowerClubController {
    private readonly prodoPartnerService;
    constructor(prodoPartnerService: ProdoPowerClubService);
    findAll(): Promise<ProdoPowerClub[]>;
    findOne(id: string): Promise<ProdoPowerClub>;
    save(prodoPowerClub: ProdoPowerClub): Promise<ProdoPowerClub>;
    delete(id: any): Promise<void>;
}
