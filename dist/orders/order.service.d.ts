import { OrderRepository } from './order.repository';
import { Order } from './order.entity';
import { UserService } from '../users/user.service';
import { AddressService } from '../addresses/address.service';
import { MailService } from '../mail/mail.service';
import { ObjectID } from 'typeorm';
import { MailTriggerService } from './../mailTrigger/mailTrigger.service';
export declare class OrderService {
    private readonly orderRepository;
    private readonly userService;
    private readonly addressService;
    private readonly mailservice;
    private readonly mailTriggerService;
    constructor(orderRepository: OrderRepository, userService: UserService, addressService: AddressService, mailservice: MailService, mailTriggerService: MailTriggerService);
    findAll(): Promise<Order[]>;
    findAllByUser(userId: string): Promise<Order[]>;
    getSummeryByUser(userId: string): Promise<any>;
    findOne(id: string): Promise<Order>;
    save(order: Order): Promise<Order>;
    update(id: string, order: Partial<Order>): Promise<Order>;
    remove(id: ObjectID): Promise<any>;
}
