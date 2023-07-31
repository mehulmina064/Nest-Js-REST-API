import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderRepository } from './order.repository';
import { Order } from './order.entity';
import { UserService } from '../users/user.service';
import { AddressService } from '../addresses/address.service';
import { MailService } from '../mail/mail.service';
import { Any, EntityRepository, MongoRepository, ObjectID, Repository } from 'typeorm';
import { MailTriggerService } from './../mailTrigger/mailTrigger.service';

var DomParser = require('dom-parser');

// tslint:disable-next-line:no-var-requires
const crypto = require('crypto');

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: OrderRepository,
    private readonly userService: UserService,
    private readonly addressService: AddressService,
    private readonly mailservice: MailService,
    private readonly mailTriggerService: MailTriggerService,
  ) {}

  async findAll(): Promise<Order[]> {
    const orders = await this.orderRepository.find();
    // tslint:disable-next-line:prefer-for-of
    return orders;
  }

  async findAllByUser(userId: string): Promise<Order[]> {
    const orders = await this.orderRepository.find({userId})
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < orders.length; i++) {
      const user = await this.userService.findOne(orders[i].userId);
      // @ts-ignore
      orders[i].userName = user.firstName;
      // @ts-ignore
      orders[i].billingAddress = await this.addressService.findOne(orders[i].billingAddressId);
      // @ts-ignore
      orders[i].shippingAddress = await this.addressService.findOne(orders[i].shippingAddressId);
     
    // @ts-ignore

    orders[i].totalAmount = totalOrderValue(orders[i])

    }
    return orders;
  }
  async getSummeryByUser(userId: string):Promise<any> {
    const orders = await this.orderRepository.find({userId})
    let orderCount = 0
    let activeOrders = 0
    let totalOrdersValue = 0
    let inTransitOrders =0
    let pendingOrders = 0
    let deliveredOrders= 0
    for(let i=0; i<orders.length;i++){
      // @ts-ignore
      let totalAmount = totalOrderValue(orders[i])
      orderCount += 1;
      totalOrdersValue += totalAmount
      if(orders[i].orderStatus !== 'Completed' && orders[i].orderStatus !== 'Cancelled' && orders[i].orderStatus !== 'Delivered'){
        activeOrders += 1
      }
      if(orders[i].orderStatus === "In Transit"){
        inTransitOrders += 1
      }
      if(orders[i].orderStatus === "Delivered" || orders[i].orderStatus === "Completed" ){
        deliveredOrders += 1
      }
      if(orders[i].orderStatus === "Order Received" || orders[i].orderStatus === "Cancellation Requested"){
        pendingOrders += 1
      }
    }
    return {orderCount:orderCount,
      totalOrdersValue:totalOrdersValue, 
      activeOrders:activeOrders,
      inTransitOrders:inTransitOrders,
      pendingOrders:pendingOrders,
      deliveredOrders:deliveredOrders
    
    };
  }
  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne(id);
    const user = await this.userService.findOne(order.userId);
    // @ts-ignore
    order.userName = user.firstName;
    // @ts-ignore
    order.billingAddress = await this.addressService.findOne(order.billingAddressId);
    // @ts-ignore
    order.shippingAddress = await this.addressService.findOne(order.shippingAddressId);
    
    // @ts-ignore

    order.totalAmount = totalOrderValue(order)
    return order;
  }

  async save(order: Order) {
    order.orderStatus = 'Order Received';
    let createdOrder = await this.orderRepository.save(order);
    const user = await this.userService.findOne(order.userId);
    const shippingAdress = await this.addressService.findOne(createdOrder.shippingAddressId);
    let mailOptions = {
      TriggerName : 'newOrder',
      doc : user,
      templatevars:{
              name:user.firstName,
              companyName:user.companyName,
              orderNumber:createdOrder.id,
              date:createdOrder.createdAt,
              shopMoreUrl:'https://prodo.in',
              total: await totalOrderValue(createdOrder),
              products:order.products,
              shippingAdress:shippingAdress
      
            }
          }
    this.mailTriggerService.SendMail(mailOptions);

  //   var mailOptions = [{
  //     from: 'noreply@prodo.in',
  //     to: ['sales@prodo.in','operations@prodo.in'],
  //     subject: `Order Place from ${user.companyName}`,
  //     templatevars:{
  //       name:user.firstName,
  //       companyName:user.companyName,
  //       orderNumber:createdOrder.id,
  //       date:createdOrder.createdAt,
  //       shopMoreUrl:'https://prodo.in',
  //       total: await totalOrderValue(createdOrder),
  //       products:order.products,
  //       shippingAdress:shippingAdress

  //     },
  //     template:'teamOrderCreate'
  //   },
  //   // {
  //   //   from: 'noreply@prodo.in',
  //   //   to: ['sales@prodo.in','operations@prodo.in'],
  //   //   subject: `Order Place from ${user.companyName}`,
  //   //   templatevars:{
  //   //     name:user.firstName,
  //   //     companyName:user.companyName,
  //   //     orderNumber:createdOrder.id,
  //   //     date:createdOrder.createdAt,
  //   //     shopMoreUrl:'https://prodo.in',
  //   //     total: await totalOrderValue(createdOrder),
  //   //     products:order.products,
  //   //     shippingAdress:shippingAdress

  //   //   },
  //   //   template:'teamOrderCreate'
  //   // }
  // ]
    
  //   mailOptions.forEach( async(option)=>{
  //     await this.mailservice.sendMailWithTemplate(option)
  //   })
   
    return createdOrder;
  }

  async update(id: string, order: Partial<Order>) {
    await this.orderRepository.update(id, order);
    return await this.findOne(id);
  }

  async remove(id: ObjectID) {
    const order = await this.orderRepository.findOne(id);
    await this.orderRepository.delete(id);
    return order;
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
// function productList(item: any){
//   let html = `<table>
//   <tr>
//     <th>Prodcut</th>
//     <th>Qty</th>
//   </tr>`
//   item.map((value: any)=>{
//     html+= `<tr>
//     <td>${value.productName}</td>
//     <td>${value.quantity}</td>
//     </tr>`
//     html+=`</table>`
//     return true;
//   })

//   return stringToHTML(html);

// }
// var stringToHTML = function (str) {
// 	var parser = new DomParser();
// 	var doc = parser.parseFromString(str, 'text/html');
//   console.log(doc)
// 	return doc.rawHTML;
// };