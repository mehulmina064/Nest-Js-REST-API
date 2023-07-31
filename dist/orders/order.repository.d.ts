import { Repository } from 'typeorm';
import { Order } from './order.entity';
export declare class OrderRepository extends Repository<Order> {
    getTotalOrderValue(orderId: number): Promise<number>;
}
