import { UserService } from '../users/user.service';
import { JSONType } from 'aws-sdk/clients/s3';
import { Repository } from 'typeorm';
import { zohoToken } from './../sms/token.entity';
export declare class TicketsService {
    private readonly userService;
    private readonly zohoTokenRepository;
    constructor(userService: UserService, zohoTokenRepository: Repository<zohoToken>);
    getintouch(getintouch: any): Promise<any>;
    otherTicket(new_ticket: any): Promise<any>;
    create(email: string): Promise<any>;
    tickettoken(): Promise<any>;
    newZohoBookTokenFarji(): Promise<string>;
    ticketgenerate(ticket: JSONType, ticket_token: any): Promise<undefined>;
    getcontactid(getintouch: any, ticket_token: any): Promise<any>;
    findOne(id: string): Promise<any>;
    getTickets(email: string): Promise<"No contact" | undefined>;
    getAllTickets(ticket_token: any): Promise<undefined>;
    AllTickets(): Promise<undefined>;
    findByMail(email: any, ticket_token: any): Promise<any>;
    findByC_id_all_tickets(c_id: any, ticket_token: any): Promise<{
        "data": never[];
    } | undefined>;
    AllTicketsByMail(email: any): Promise<{
        "data": never[];
    } | undefined>;
}
