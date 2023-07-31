
import { Repository, EntityRepository } from 'typeorm';
import { Order } from './order.entity';
import { UserService } from '../users/user.service';
import { AddressService } from '../addresses/address.service';
import { MailService } from '../mail/mail.service';

// Extend the OrderRepository with a custom repository method.
// This is similar to a controller method.
@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {

    // Create a new order.
    async getTotalOrderValue(orderId: number): Promise<number> {
        const order = await this.findOne(orderId);
        if (!order) {
            throw new Error('Order not found.');
        }
        return totalOrderValue(order);
    }
}


function totalOrderValue(order:Order){
    let totalPrice = 0;
  
        if (order.products){
          let products = order.products
          for(let j =0; j<products.length;j++){
            // @ts-ignore
            const productTotal = products[j].quantity * products[j].price
            totalPrice += productTotal
          }
        }
        return totalPrice
  }