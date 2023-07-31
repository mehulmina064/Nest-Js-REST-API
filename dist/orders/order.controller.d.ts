import { OrderService } from './order.service';
import { Order } from './order.entity';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    findAll(): Promise<Order[]>;
    findAllByUser(userId: string): Promise<Order[]>;
    getSummeryByUser(userId: string): Promise<any>;
    findOne(id: string): Promise<Order>;
    save(category: Order): Promise<Order>;
    update(id: string, order: Order): Promise<Order>;
    requestCancellation(id: string): Promise<Order>;
    needHelp(id: string, message: string): void;
    delete(id: any): Promise<any>;
}
