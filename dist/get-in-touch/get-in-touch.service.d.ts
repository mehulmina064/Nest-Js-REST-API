import { Repository } from 'typeorm';
import { GetInTouch } from './get-in-touch.entity';
import { UserService } from './../users/user.service';
import { TicketsService } from './../tickets/tickets.service';
export declare class GetInTouchService {
    private readonly getInTouchRepository;
    private readonly userService;
    private readonly ticketService;
    constructor(getInTouchRepository: Repository<GetInTouch>, userService: UserService, ticketService: TicketsService);
    findAll(): Promise<GetInTouch[]>;
    findOne(id: string): Promise<GetInTouch>;
    save(getInTouch: GetInTouch): Promise<{
        Ticket: any;
        GetInTouch: GetInTouch;
    }>;
    remove(id: any): Promise<void>;
}
