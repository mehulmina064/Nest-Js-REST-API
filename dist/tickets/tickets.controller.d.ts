import { TicketsService } from './tickets.service';
import { UserService } from '../users/user.service';
export declare class TicketsController {
    private readonly ticketsService;
    private readonly userService;
    constructor(ticketsService: TicketsService, userService: UserService);
    getTickets(): Promise<undefined>;
    findOne(email: string): Promise<{
        "data": never[];
    } | undefined>;
    create(email: any): Promise<any>;
    getintouch(getintouch: any): Promise<any>;
    otherTicket(new_ticket: any, req: any): Promise<{
        Ticket: any;
        Query: any;
    }>;
}
