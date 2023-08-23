import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, ObjectID, Repository, TreeRepository,Not } from 'typeorm';
import { zohoSalesOrder } from './zohoSalesOrder.entity';
import { UserService } from './../users/user.service';
import { zohoToken } from './../sms/token.entity';
import { ProductService } from './../product/product.service';
import {HttpException,HttpStatus } from '@nestjs/common';
import { entitiesService } from './../entities/entities.service';
import { OrganizationService } from "./../organization/organization.service";
import { companyService } from "./../company/company.service";
import { invoicePodService } from './../invoice-pod/invoicePod.service';
import fetch from 'node-fetch'





@Injectable()
export class zohoSalesOrderService {
  constructor(
    @InjectRepository(zohoSalesOrder)
    private readonly zohoSalesOrderRepository: Repository<zohoSalesOrder>,
    @InjectRepository(zohoToken)
    private readonly zohoTokenRepository: Repository<zohoToken>,
    private readonly userService: UserService,
    private readonly productService: ProductService,
    private readonly entitiesService: entitiesService,
    private readonly organizationService: OrganizationService,
    private readonly companyService: companyService,
    private readonly invoicePodService: invoicePodService,

) { }

async findAll(query?:any){
    if(query){
      // console.log(query)
      let data=await this.zohoSalesOrderRepository.findAndCount(query)
      return {data:data[0],count:data[1]}
    }
    else {
      let data=await this.zohoSalesOrderRepository.findAndCount()
      return {data:data[0],count:data[1]}
    }
  }
  async findOne(id: string): Promise<zohoSalesOrder> {
    const so = await this.zohoSalesOrderRepository.findOne({where:{salesorderId:String(id)}});
    return so
  }
  async ByReferenceNumber(rf:string): Promise<zohoSalesOrder> {
    const so = await this.zohoSalesOrderRepository.findOne({where:{salesorderNumber:String(rf)}});
    return so
  }
async zohoBookToken(){
    let zohoToken = await this.zohoTokenRepository.findOne('62dfec85d3baa58e51c2fc65')
    if(!zohoToken){
      throw new HttpException({
        status: HttpStatus.EXPECTATION_FAILED,
        error: 'Token not found',
        message: "Unverified",
      }, HttpStatus.EXPECTATION_FAILED);
    }
    let token=zohoToken.token
    let kill
    let res = await fetch(`https://inventory.zoho.in/api/v1/salesorders?organization_id=60015092519`, {
    method:'GET',
    headers:{
      'Content-Type':'application/json',
      'Authorization':`${token}`,
    }  
    })
    .then(res=>res.json()) 
    .then(data=>
      kill=data
    );
  // console.log("kill",kill)
    if(kill.message=='You are not authorized to perform this operation'||kill.code==57||kill.code==6041){
    // console.log("NEW_TOKEN")
    token=await this.newZohoBookToken()
    return token
    }
    return token
  }


async newZohoBookToken(){
    let zohoToken = await this.zohoTokenRepository.findOne('62dfec85d3baa58e51c2fc65')
    let zoho = await fetch('https://accounts.zoho.in/oauth/v2/token', {
      method: 'POST',
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
      },    
      body: new URLSearchParams({
      
      })
  });
  zoho=await zoho.text()
  zoho=JSON.parse(zoho)
  let token="Zoho-oauthtoken "
  token=token+zoho.access_token
  zohoToken.token=token
  await this.zohoTokenRepository.update(zohoToken.id,zohoToken)
  return token
  }


async InventorySalesOrderByID(id:any){
    let token=await this.zohoBookToken()
    let kill
    let salesOrder
    let res = await fetch(`https://inventory.zoho.in/api/v1/salesorders/${id}?organization_id=60015092519`, {
      method:'GET',
      headers:{
        'Content-Type':'application/json',
        'Authorization':`${token}`,
      }
    })
    .then(res=>res.json())
    .then(data=>
        kill=data
    );
    if(kill.message=="You are not authorized to perform this operation"||kill.message=="This user is not associated with the CompanyID/CompanyName:60015313630."||kill.code==57){
      token=await this.zohoBookToken()
      let res = await fetch(`https://inventory.zoho.in/api/v1/salesorders/${id}?organization_id=60015092519`, {
        method:'GET',
        headers:{
          'Content-Type':'application/json',
          'Authorization':`${token}`,
        }
      })
      .then(res=>res.json())
      .then(data=>
          kill=data
      );
    }
    salesOrder=kill.salesorder
    if(salesOrder==undefined){
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        error: 'Token Expire at inventory sales order ',
        message: "Zoho token issue contact admin Or check your id again ",
      }, HttpStatus.UNAUTHORIZED);
    }
      let lineItems=salesOrder.line_items
      let k1=salesOrder.packages
      let packages={}
      for(let i=0;i<lineItems.length;i++){
        lineItems[i].package_id=[]
      }
      lineItems=await this.itemStatus(lineItems,salesOrder)
      if(k1.length>0){
      for(let j=0;j<k1.length;j++){
      let data=await this.packageDetails(k1[j].package_id)
      packages[k1[j].package_id]=data
        for(let k=0;k<lineItems.length;k++){
          let p_id =await this.itemDetails(lineItems[k],data)
          if(p_id=="NA"){
          }
          else{
            lineItems[k].package_id.push(p_id)
          }
        }
       }
      }
      salesOrder.package_list=packages
      lineItems=await this.setItemPrice(lineItems,salesOrder.date)
      lineItems=await this.calShipment(lineItems,packages)
      // return lineItems
      salesOrder.line_items=lineItems
      return salesOrder
    }


async updateLineItemCal(element:any,packages:any){
  if(element.quantity==element.quantity_returned){
    element.shipment_status=[{status:"Returned",date:new Date(),quantity:element.quantity,package_id:""}]
    return element
  }
  if(element.package_id.length>0){
    element.shipment_status=[{status:"In Production",date:new Date(),quantity:element.quantity,package_id:""}]
    for(let j=0;j<element.package_id.length;j++){
      let package_id1=element.package_id[j]
      let pkg=packages[package_id1]
      for(let k=0;k<pkg.line_items.length;k++){
        if(pkg.line_items[k].item_id==element.item_id){
          if(pkg.status=="delivered"){
            element.shipment_status.push({status:"Delivered",date:pkg.shipment_delivered_date,quantity:pkg.line_items[k].quantity,package_id:pkg.package_id})
            element.shipment_status[0].quantity=element.shipment_status[0].quantity-pkg.line_items[k].quantity
          }
          else if(pkg.status=="not_shipped"){
            element.shipment_status.push({status:"In Production",date:pkg.date,quantity:pkg.line_items[k].quantity,package_id:pkg.package_id})
            element.shipment_status[0].quantity=element.shipment_status[0].quantity-pkg.line_items[k].quantity
          }
          else if(pkg.status=="shipped"){
            element.shipment_status.push({status:"Shipped",date:pkg.shipping_date,quantity:pkg.line_items[k].quantity,package_id:pkg.package_id})
            element.shipment_status[0].quantity=element.shipment_status[0].quantity-pkg.line_items[k].quantity
          }
          else {
            element.shipment_status.push({status:"Quality Check",date:pkg.shipping_date,quantity:pkg.line_items[k].quantity,package_id:pkg.package_id})
            element.shipment_status[0].quantity=element.shipment_status[0].quantity-pkg.line_items[k].quantity
          }
        }
      }
    } 
  }
  else{
    element.shipment_status=[{status:"In Production",date:new Date(),quantity:element.quantity,package_id:""}]
  }
  return element
}

async calShipment(lineItems:any,packages:any){ 

  
  const promises = lineItems.map(a => this.updateLineItemCal(a,packages))
  return await Promise.all(promises)


      for(let i=0;i<lineItems.length;i++){
    //     const promises = orderIds.map(a => this.zohoSalesOrderService.invoiceAllDetails(a,purchaseOrder))
        if(lineItems[i].package_id.length>0){
          lineItems[i].shipment_status=[{status:"In Production",date:new Date(),quantity:lineItems[i].quantity,package_id:""}]
          for(let j=0;j<lineItems[i].package_id.length;j++){
            let package_id1=lineItems[i].package_id[j]
            let pkg=packages[package_id1]
            for(let k=0;k<pkg.line_items.length;k++){
              if(pkg.line_items[k].item_id==lineItems[i].item_id){
                if(pkg.status=="delivered"){
                  lineItems[i].shipment_status.push({status:"Delivered",date:pkg.shipment_delivered_date,quantity:pkg.line_items[k].quantity,package_id:pkg.package_id})
                  lineItems[i].shipment_status[0].quantity=lineItems[i].shipment_status[0].quantity-pkg.line_items[k].quantity
                }
                else if(pkg.status=="not_shipped"){
                  lineItems[i].shipment_status.push({status:"In Production",date:pkg.date,quantity:pkg.line_items[k].quantity,package_id:pkg.package_id})
                  lineItems[i].shipment_status[0].quantity=lineItems[i].shipment_status[0].quantity-pkg.line_items[k].quantity
                }
                else if(pkg.status=="shipped"){
                  lineItems[i].shipment_status.push({status:"Shipped",date:pkg.shipping_date,quantity:pkg.line_items[k].quantity,package_id:pkg.package_id})
                  lineItems[i].shipment_status[0].quantity=lineItems[i].shipment_status[0].quantity-pkg.line_items[k].quantity
                }
                else {
                  lineItems[i].shipment_status.push({status:"Quality Check",date:pkg.shipping_date,quantity:pkg.line_items[k].quantity,package_id:pkg.package_id})
                  lineItems[i].shipment_status[0].quantity=lineItems[i].shipment_status[0].quantity-pkg.line_items[k].quantity
                }
              }
            }
          } 
        }
        else{
          lineItems[i].shipment_status=[{status:"In Production",date:new Date(),quantity:lineItems[i].quantity,package_id:""}]
        }
      }
      return lineItems
   }

async updateLineItemPrice(item1:any,date:any){
  let sku=item1.sku
  if (sku.startsWith('.')) {
    sku = sku.substring(1) 
  }
  // console.log("update price of-",sku)
  let item=await this.productService.getProductBySku(sku)
  if(item){
    let item_date=item.date
    let item_date_arr=item_date.split("-")
    let item_date_year=item_date_arr[0]
    let item_date_month=item_date_arr[1]
    let item_date_day=item_date_arr[2]
    let item_date_date=new Date(item_date_year,item_date_month,item_date_day)
    let date_arr=date.split("-")
    let date_year=date_arr[0]
    let date_month=date_arr[1]
    let date_day=date_arr[2] 
    let date_date=new Date(date_year,date_month,date_day)
    if(item_date_date>date_date){
      item1.prodo_price=item.price
      item1.prodo_images=item.productImages
    }
    else{
      item.price=await this.productService.currentPriceUpdate(item,date,item1.rate)
      item1.prodo_pricee=item.price
      item1.prodo_images=item.productImages
    }
  }
  else{
    item1.prodo_pricee=item1.rate
    item1.prodo_images=[]
  } 
  return item1
}

async setItemPrice(lineItems:any,date:any){

    const promises = lineItems.map(a => this.updateLineItemPrice(a,date))
  return await Promise.all(promises)
      for(let i=0;i<lineItems.length;i++){
        let sku=lineItems[i].sku
        if (sku.startsWith('.')) {
          sku = sku.substring(1) 
        }
        // console.log("update price of-",sku)
        let item=await this.productService.getProductBySku(sku)
        if(item){
          let item_date=item.date
          let item_date_arr=item_date.split("-")
          let item_date_year=item_date_arr[0]
          let item_date_month=item_date_arr[1]
          let item_date_day=item_date_arr[2]
          let item_date_date=new Date(item_date_year,item_date_month,item_date_day)
          let date_arr=date.split("-")
          let date_year=date_arr[0]
          let date_month=date_arr[1]
          let date_day=date_arr[2] 
          let date_date=new Date(date_year,date_month,date_day)
          if(item_date_date>date_date){
            lineItems[i].prodo_price=item.price
            lineItems[i].prodo_images=item.productImages
          }
          else{
            item.price=await this.productService.currentPriceUpdate(item,date,lineItems[i].rate)
            lineItems[i].prodo_pricee=item.price
            lineItems[i].prodo_images=item.productImages
          }
        }
        else{
          lineItems[i].prodo_pricee=lineItems[i].rate
          lineItems[i].prodo_images=[]
        } 
      }
      return lineItems
   }


async itemDetails(lineItem:any,data:any){
      let itemDetails = "NA"
      let item_id=lineItem.item_id
      let line_items=data.line_items 
      for(let i=0;i<line_items.length;i++){
        if(line_items[i].item_id==item_id){
          itemDetails=data.package_id
        }
      }
      return itemDetails
   }


async packageDetails(id:any){
      let token=await this.zohoBookToken()
      let kill
      let res = await fetch(`https://inventory.zoho.in/api/v1/packages/${id}?organization_id=60015092519`, {
        method:'GET',
        headers:{
          'Content-Type':'application/json',
          'Authorization':`${token}`,
        }
      })
      .then(res=>res.json())
      .then(data=>
          kill=data
      );
      if(kill.message=="You are not authorized to perform this operation"||kill.message=="This user is not associated with the CompanyID/CompanyName:60015313630."||kill.code==57){
        token=await this.zohoBookToken()
        let res = await fetch(`https://inventory.zoho.in/api/v1/packages/${id}?organization_id=60015092519`, {
    
          method:'GET',
          headers:{
            'Content-Type':'application/json',
            'Authorization':`${token}`,
          }
        })
        .then(res=>res.json())
        .then(data=>
            kill=data
        );
      }
      if(kill.package==undefined){
        throw new HttpException({
          status: HttpStatus.UNAUTHORIZED,
          error: 'Token Expire at package details',
          message: "Zoho token issue contact admin",
        }, HttpStatus.UNAUTHORIZED);
      }
      return kill.package
   }


async itemStatus(lineItems:any,salesOrder:any){
      if(salesOrder.status=="draft"){
        for(let i=0;i<lineItems.length;i++){
          lineItems[i].status="Order Received"
        }
      }
    else if(salesOrder.status=="partially_shipped"){
      if(salesOrder.current_sub_status=="closed"){
        for(let i=0;i<lineItems.length;i++){
          lineItems[i].status="Delivered"
        }
      }
      else{
        for(let i=0;i<lineItems.length;i++){
          lineItems[i].status= await this.calculateStatus(lineItems[i])
        }
      }
    }
    else if(salesOrder.status=="fulfilled"){
      for(let i=0;i<lineItems.length;i++){
        lineItems[i].status="Delivered"
      }
    }
    else if(salesOrder.status=="confirmed"){
      if(salesOrder.current_sub_status=="closed"){
        for(let i=0;i<lineItems.length;i++){
          lineItems[i].status="Delivered"
        }
      }
      else{
        for(let i=0;i<lineItems.length;i++){
          lineItems[i].status="Order Accepted"
        }
      }
    }
    else if(salesOrder.status=="shipped"){
      for(let i=0;i<lineItems.length;i++){
        lineItems[i].status="In Transit"
      }
    }
    else{
      for(let i=0;i<lineItems.length;i++){
        lineItems[i].status="NA"
      }
    }
    return lineItems
   }

  
async calculateStatus(lineItem:any){
      let invoiced=lineItem.quantity_invoiced
      let shipped=lineItem.quantity_shipped
      let packed=lineItem.quantity_packed
      let backordered=lineItem.quantity_backordered
      let dropshipped=lineItem.quantity_dropshipped
      let cancelled=lineItem.quantity_cancelled
      let quantity=lineItem.quantity
      if(packed==quantity){
        if(shipped==quantity){
          if(invoiced==quantity){
            return "Delivered"
          }
          else{
            return "In Transit[Fully Shipped]"
          }
        }
        return " In Transit[Fully packed]"
      }
      else if(packed>0){
        if(shipped<packed){
          if(shipped>0){
            return "In Transit[Partially Shipped]"
          }
          else{
            return "In Transit[Partially Packed]"
          }
        }
        return "In Transit[Partially Packed]"
      }
      else{
        return "Quality Check"
      }
    
   }


async salesOrderFormatData(salesOrder:any){
    // async salesOrderFormatData(){

      let order= new zohoSalesOrder()
      order.organization_id=""
      order.entityId=""
      order.companyId=""
      order.description=""
      order.createdAt=new Date()
      order.updatedAt=new Date()
      order.customerId=salesOrder.customer_id
      order.customerName=salesOrder.customer_name
      order.createdBy="ZOHO-SYNC"
      order.salesorderId=salesOrder.salesorder_id
      order.salesorderNumber=salesOrder.salesorder_number
      order.referenceNumber=salesOrder.reference_number
      order.date=salesOrder.date
      order.status=salesOrder.status
      order.subStatuses=salesOrder.sub_statuses
      order.currentSubStatus=salesOrder.current_sub_status
      order.companyName=salesOrder.customer_name
      order.shipmentDate=salesOrder.shipment_date
      order.shipmentDays=salesOrder.basicDetails.shipment_days
      order.dueByDays=salesOrder.basicDetails.due_by_days
      order.dueInDays=salesOrder.basicDetails.due_in_days
      order.source=salesOrder.source
      order.total=salesOrder.total
      order.quantity=salesOrder.total_quantity
      order.quantityInvoiced=salesOrder.basicDetails.quantity_invoiced
      order.quantityPacked=salesOrder.basicDetails.quantity_packed
      order.quantityShipped=salesOrder.basicDetails.quantity_shipped
      order.orderStatus=salesOrder.order_status
      order.invoicedStatus=salesOrder.invoiced_status
      order.paidStatus=salesOrder.paid_status
      order.shippedStatus=salesOrder.shipped_status
      order.salesChannel=salesOrder.sales_channel
      order.salespersonName=salesOrder.salesperson_name
      order.branchId=salesOrder.branch_id
      order.hasAttachment=salesOrder.basicDetails.has_attachment
      order.clientPoAttachment=[]
      for(let a of salesOrder.documents){
        order.clientPoAttachment.push({id:a.document_id,name:a.file_name,type:a.file_type,size:a.file_size_formatted,source:a.source})
      }
      order.clientPersonOfContacts=[]
      let cf_1_email=salesOrder.basicDetails.cf_client_poc_1_email?(salesOrder.basicDetails.cf_client_poc_1_email==""?false:salesOrder.basicDetails.cf_client_poc_1_email):false
      let cf_2_email=salesOrder.basicDetails.cf_client_poc_2_email?(salesOrder.basicDetails.cf_client_poc_2_email==""?false:salesOrder.basicDetails.cf_client_poc_2_email):false
      let cf_3_email=salesOrder.basicDetails.cf_client_poc_3_email?(salesOrder.basicDetails.cf_client_poc_3_email==""?false:salesOrder.basicDetails.cf_client_poc_3_email):false
      let cf_4_email=salesOrder.basicDetails.cf_client_poc_4_email?(salesOrder.basicDetails.cf_client_poc_4_email==""?false:salesOrder.basicDetails.cf_client_poc_4_email):false
      if(cf_1_email){order.clientPersonOfContacts.push(cf_1_email)}
      if(cf_2_email){order.clientPersonOfContacts.push(cf_2_email)}
      if(cf_3_email){order.clientPersonOfContacts.push(cf_3_email)}
      if(cf_4_email){order.clientPersonOfContacts.push(cf_4_email)}
      order.balance=salesOrder.balance
      await delete(salesOrder.basicDetails)
      order.orderDetails=salesOrder

    return order
  }


async customerDetails(id:any){
    let token=await this.zohoBookToken()
    let kill
    let res = await fetch(`https://books.zoho.in/api/v3/contacts/${id}?organization_id=60015092519`, {
      
      method:'GET',
      headers:{
        'Content-Type':'application/json',
        'Authorization':`${token}`,
      }
    })
    .then(res=>res.json())
    .then(data=>
        kill=data
    );
    if(kill.message=="You are not authorized to perform this operation"||kill.message=="This user is not associated with the CompanyID/CompanyName:60015313630."||kill.code==57){
      token=await this.zohoBookToken()
      let res = await fetch(`https://books.zoho.in/api/v3/contacts/${id}?organization_id=60015092519`, {
        method:'GET',
        headers:{
          'Content-Type':'application/json',
          'Authorization':`${token}`,
        }
      })
      .then(res=>res.json())
      .then(data=>
          kill=data
      );
    }
    
    let contact=kill.contact
    if(contact){
       return contact
    }
    else{
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        error: 'Token Expire at inventory sales order',
        message: "Zoho token issue contact admin",
      }, HttpStatus.UNAUTHORIZED);
    }

  }


async basicOrderDetails(id:any,page?:any){
  if(!page){
          console.log("page pram not  found")
          let token=await this.zohoBookToken()
          let kill
          for(page=1;page>0;page++){
            console.log("searching in page-",page)
            let res = await fetch(`https://inventory.zoho.in/api/v1/salesorders?organization_id=60015092519&page=${page}`, {
            method:'GET',
            headers:{
              'Content-Type':'application/json',
              'Authorization':`${token}`,
            }  
          })
          .then(res=>res.json()) 
          .then(data=>
              kill=data
          );
          if(kill.message=="You are not authorized to perform this operation"||kill.message=="This user is not associated with the CompanyID/CompanyName:60015313630."||kill.code==57){
            token=await this.zohoBookToken()
            let res = await fetch(`https://inventory.zoho.in/api/v1/salesorders?organization_id=60015092519&page=${page}`, {
              method:'GET',
              headers:{
                'Content-Type':'application/json',
                'Authorization':`${token}`,
              }
            })
            .then(res=>res.json())
            .then(data=>
                kill=data
            );
          }
          let salesOrder=kill.salesorders
          if(salesOrder==undefined){
            throw new HttpException({
              status: HttpStatus.NOT_FOUND,
              error: 'No data found in zoho',
              Response:kill,
              message: "Not Found Data",
            }, HttpStatus.NOT_FOUND);
          }
          if(!(salesOrder.length>0)){
                throw new HttpException({
                  status: HttpStatus.NOT_FOUND,
                  error: 'No data found in zoho with this id',
                  message: "Not Found Data",
                }, HttpStatus.NOT_FOUND);
              }
          let find= await salesOrder.find(i=>i.salesorder_id==id)  
          if(find){
            return find
          }
            }
  }
  else{
  let token=await this.zohoBookToken()
  let kill
    let res = await fetch(`https://inventory.zoho.in/api/v1/salesorders?organization_id=60015092519&page=${page}`, {
    method:'GET',
    headers:{
      'Content-Type':'application/json',
      'Authorization':`${token}`,
    }  
  })
  .then(res=>res.json()) 
  .then(data=>
      kill=data
  );
  if(kill.message=="You are not authorized to perform this operation"||kill.message=="This user is not associated with the CompanyID/CompanyName:60015313630."||kill.code==57){
    token=await this.zohoBookToken()
    let res = await fetch(`https://inventory.zoho.in/api/v1/salesorders?organization_id=60015092519`, {
      method:'GET',
      headers:{
        'Content-Type':'application/json',
        'Authorization':`${token}`,
      }
    })
    .then(res=>res.json())
    .then(data=>
        kill=data
    );
  }
  let salesOrder=kill.salesorders
  if(salesOrder==undefined){
    throw new HttpException({
      status: HttpStatus.NOT_FOUND,
      error: 'No data found in zoho',
      Response:kill,
      message: "Not Found Data",
    }, HttpStatus.NOT_FOUND);
  }
  return await salesOrder.find(i=>i.salesorder_id==id)
}
}

async zohoAllSo(page?:number){
  if(!page){
    page=1
  }
  let token=await this.zohoBookToken()
  let kill
    let res = await fetch(`https://inventory.zoho.in/api/v1/salesorders?organization_id=60015092519&page=${page}`, {
    method:'GET',
    headers:{
      'Content-Type':'application/json',
      'Authorization':`${token}`,
    }  
  })
  .then(res=>res.json()) 
  .then(data=>
      kill=data
  );
  if(kill.message=="You are not authorized to perform this operation"||kill.message=="This user is not associated with the CompanyID/CompanyName:60015092519."||kill.code==57){
    token=await this.zohoBookToken()
    let res = await fetch(`https://inventory.zoho.in/api/v1/salesorders?organization_id=60015092519&page=${page}`, {
      method:'GET',
      headers:{
        'Content-Type':'application/json',
        'Authorization':`${token}`,
      }
    })
    .then(res=>res.json())
    .then(data=>
        kill=data
    );
  }
  let salesOrder=kill.salesorders
  if(salesOrder==undefined){
    throw new HttpException({
      status: HttpStatus.NOT_FOUND,
      error: 'No data found in zoho',
      Response:kill,
      message: "Not Found Data",
    }, HttpStatus.NOT_FOUND);
  }
  // if(!(salesOrder.length>0)){
  //   throw new HttpException({
  //     status: HttpStatus.NOT_FOUND,
  //     error: 'No data found in zoho',
  //     message: "Not Found Data",
  //   }, HttpStatus.NOT_FOUND);
  // }

  return {count:salesOrder.length,data:salesOrder}
}


async mapData(salesOrder:any,customer:any){ 
  let mapData={
    salesOrder:{},
    organization:{},
    company:{},
    entity:{},
    status:false
  } 
  mapData.organization=await this.organizationService.mapOrganization(customer)
  mapData.company=await this.companyService.mapCompany(salesOrder,customer)
  mapData.salesOrder=await this.salesOrderFormatData(salesOrder)
  mapData.entity=await this.entitiesService.mapEntity(salesOrder)
  if(mapData.organization&&mapData.company&&mapData.salesOrder&&mapData.entity){
    mapData.status=true
    return mapData
  }
  else{
    return mapData
  }
}


async saveZohoSalesOrder(salesOrder:zohoSalesOrder){
  let find=await this.zohoSalesOrderRepository.findOne({where:{salesorderId:salesOrder.salesorderId}})
  if(find){
    console.log("updating old  so")
    salesOrder.createdAt=find.createdAt?find.createdAt:(salesOrder.createdAt?salesOrder.createdAt:new Date())
    salesOrder.id=find.id
    salesOrder.line_items=salesOrder.orderDetails.line_items
    await this.zohoSalesOrderRepository.save(salesOrder)
    return salesOrder
  }
  else{
    console.log("saving new so")
    salesOrder.line_items=salesOrder.orderDetails.line_items
    return await this.zohoSalesOrderRepository.save(salesOrder)
  }
}


async saveFromZohoId(id:any,page?:number){
    let so = await this.InventorySalesOrderByID(id)
    // return so
    if(page){
      so.basicDetails=await this.basicOrderDetails(id,page)
    }
    else{
      so.basicDetails=await this.basicOrderDetails(id)
    }
    let customer= await this.customerDetails(so.customer_id)
    let mapData= await this.mapData(so,customer)
    if(!mapData.status){
      return{error:"error",mapData:mapData}
    }
    // let dummy=await this.userService.makeDummyUser(mapData.salesOrder.clientPersonOfContacts[0])
    // return dummy
    let adminUser=await this.userService.findByEmail(mapData.salesOrder.clientPersonOfContacts[0])
    if(!adminUser){
      adminUser=await this.userService.makeDummyUser(mapData.salesOrder.clientPersonOfContacts[0]) 
    }
    mapData.organization.account_id=String(adminUser.accountId)
    let organization=await this.organizationService.zohoCustomerOrganization(mapData.organization)
    mapData.company.organization_id=String(organization.id)
    let company=await this.companyService.zohoCustomerCompany(mapData.company)
    mapData.entity.companyId=String(company.id)
    let entity=await this.entitiesService.zohoCustomerEntity(mapData.entity) 
    mapData.salesOrder.organization_id=String(organization.id) 
    mapData.salesOrder.companyId=String(company.id)
    mapData.salesOrder.entityId=String(entity.id)
    let salesOrder=await this.saveZohoSalesOrder(mapData.salesOrder)
    let users=await this.userService.zohoPocUsers(mapData.salesOrder.clientPersonOfContacts)
    //add ids in user
    users =await this.userService.zohoUsersUpdate(users,salesOrder.organization_id,salesOrder.companyId,salesOrder.entityId)
    //add ids in company
    if(!company.entityIds.includes(mapData.salesOrder.entityId))
    {
      company.entityIds.push(mapData.salesOrder.entityId)
      company=await this.companyService.zohoCustomerCompany(company)
    }
    //add ids in organization
    let orgUpdate=false
    if(!organization.entityIds.includes(mapData.salesOrder.entityId))
    {
      organization.entityIds.push(mapData.salesOrder.entityId)
      orgUpdate=true
    }
    if(!organization.companyIds.includes(mapData.salesOrder.companyId))
    {
      organization.companyIds.push(mapData.salesOrder.companyId)
      orgUpdate=true
    }
    if(orgUpdate){
    organization=await this.organizationService.zohoCustomerOrganization(organization)
    }
    return {salesOrderId:salesOrder.id,organizationId:organization.id,companyId:company.id,entityid:entity.id,users:users.map(({id,email})=>({[id]:email}))}
    // return {salesOrder:salesOrder,organization:organization,company:company,entity:entity,users:users}
  }


async getAttachment(orderId:any){
  let token=await this.zohoBookToken()
    let kill
    let res = await fetch(`https://inventory.zoho.in/api/v1/salesorders/${orderId}/attachment?organization_id=60015092519`, {
      method:'GET',
       headers:{
          'Content-Type':'application/json',
          'Authorization':`${token}`,
          'Accept':'application/pdf'
          }
        })
      .then(data=>
      kill=data.body
       );
    if(kill.message=="You are not authorized to perform this operation"||kill.message=="This user is not associated with the CompanyID/CompanyName:60015313630."||kill.code==57){
      token=await this.zohoBookToken()
      let res = await fetch(`https://inventory.zoho.in/api/v1/salesorders/${orderId}/attachment?organization_id=60015092519`, {
        method:'GET',
       headers:{
          'Content-Type':'application/json',
          'Authorization':`${token}`,
          'Accept':'application/pdf'
          }
        })
      .then(data=>
      kill=data.body
       );
      }
    if(kill.code==5){
      throw new HttpException({
        status: HttpStatus.EXPECTATION_FAILED,
        error: 'TOKEN issue',
        message: "Attachment not found",
      }, HttpStatus.EXPECTATION_FAILED);
    }
    return kill
}

async OrderSummary(id:any){
  let token=await this.zohoBookToken()
    let kill
    let res = await fetch(`https://inventory.zoho.in/api/v1/salesorders/${id}?organization_id=60015092519`, {
      method:'GET',
       headers:{
          'Content-Type':'application/json',
          'Authorization':`${token}`,
          'Accept':'application/pdf'
          }
        })
      .then(data=>
      kill=data.body
       );
    if(kill.message=="You are not authorized to perform this operation"||kill.message=="This user is not associated with the CompanyID/CompanyName:60015313630."||kill.code==57){
      token=await this.zohoBookToken()
      let res = await fetch(`https://inventory.zoho.in/api/v1/salesorders/${id}?organization_id=60015092519`, {
        method:'GET',
       headers:{
          'Content-Type':'application/json',
          'Authorization':`${token}`,
          'Accept':'application/pdf'
          }
        })
      .then(data=>
      kill=data.body
       );
      }
    if(kill.code==5){
      throw new HttpException({
        status: HttpStatus.EXPECTATION_FAILED,
        error: 'TOKEN issue',
        message: "summery not found",
      }, HttpStatus.EXPECTATION_FAILED);
    }
    return kill
}

async salesOrderPackages(id:any){
  let token=await this.zohoBookToken()
  let kill
  let res = await fetch(`https://inventory.zoho.in/api/v1/packages/print?organization_id=60015092519&package_ids=${id}`, {
    method:'GET',
     headers:{
        'Content-Type':'application/json',
        'Authorization':`${token}`,
        'Accept':'application/pdf'
        }
      })
    .then(data=>
    kill=data.body
     );
  if(kill.message=="You are not authorized to perform this operation"||kill.message=="This user is not associated with the CompanyID/CompanyName:60015313630."||kill.code==57){
    token=await this.zohoBookToken()
    let res = await fetch(`https://inventory.zoho.in/api/v1/packages/print?organization_id=60015092519&package_ids=${id}`, {
      method:'GET',
     headers:{
        'Content-Type':'application/json',
        'Authorization':`${token}`,
        'Accept':'application/pdf'
        }
      })
    .then(data=>
    kill=data.body
     );
    }
  if(kill.code==5){
    throw new HttpException({
      status: HttpStatus.EXPECTATION_FAILED,
      error: 'TOKEN issue',
      message: "Packages not found",
    }, HttpStatus.EXPECTATION_FAILED);
  }
  return kill
}
  
async salesOrderBill(id:any){
  let token=await this.zohoBookToken()
  let kill
  let res = await fetch(`https://books.zoho.in/api/v3/bills/${id}?organization_id=60015092519`, {
    method:'GET',
     headers:{
        'Content-Type':'application/json',
        'Authorization':`${token}`,
        'Accept':'application/pdf'
        }
      })
    .then(data=>
    kill=data.body
     );
  if(kill.message=="You are not authorized to perform this operation"||kill.message=="This user is not associated with the CompanyID/CompanyName:60015313630."||kill.code==57){
    token=await this.zohoBookToken()
    let res = await fetch(`https://books.zoho.in/api/v3/bills/${id}?organization_id=60015092519`, {
      method:'GET',
     headers:{
        'Content-Type':'application/json',
        'Authorization':`${token}`,
        'Accept':'application/pdf'
        }
      })
    .then(data=>
    kill=data.body
     );
    }
  if(kill.code==5){
    throw new HttpException({
      status: HttpStatus.EXPECTATION_FAILED,
      error: 'TOKEN issue',
      message: "Bill not found",
    }, HttpStatus.EXPECTATION_FAILED);
  }
  return kill
}

async salesOrderInvoice(id:any){
  let token=await this.zohoBookToken()
  let kill
  let res = await fetch(`https://inventory.zoho.in/api/v1/invoices/${id}?organization_id=60015092519`, {
    method:'GET',
     headers:{
        'Content-Type':'application/json',
        'Authorization':`${token}`,
        'Accept':'application/pdf'
        }
      })
    .then(data=>
    kill=data.body
     );
  if(kill.message=="You are not authorized to perform this operation"||kill.message=="This user is not associated with the CompanyID/CompanyName:60015313630."||kill.code==57){
    token=await this.zohoBookToken()
    let res = await fetch(`https://inventory.zoho.in/api/v1/invoices/${id}?organization_id=60015092519`, {
      method:'GET',
     headers:{
        'Content-Type':'application/json',
        'Authorization':`${token}`,
        'Accept':'application/pdf'
        }
      })
    .then(data=>
    kill=data.body
     );
    }
  if(kill.code==5){
    throw new HttpException({
      status: HttpStatus.EXPECTATION_FAILED,
      error: 'TOKEN issue',
      message: "Invoice not found",
    }, HttpStatus.EXPECTATION_FAILED);
  }
  return kill
}

async calDashboardData(data:any,salesOrders:any){
  data=await this.dataUpdate(data,salesOrders)
  // return data
  data=await this.userService.updatepieChart(data)
  return data  
}

async dataUpdate(data:any,orders:any){
  let current_date = new Date();
  for(let i = 0; i < 8; i++){
      let date = new Date(current_date.getFullYear(), current_date.getMonth() - i, 1);
      let month = date.toLocaleString('default', { month: 'short', year: 'numeric' });

      data.barChart.push({name : month, value : Number(0)});
  } 
  // console.log("in d_data_update mid")

  var bar = await new Promise((resolve, reject) => {
    orders.forEach(async (C, i, array) => {
      data.orders.total++; 
      data.orders.submitted++;
      if(C.paidStatus=="unpaid")
      {
        data.payments.due+=Number(C.total);
      }
      else if(!C.paidStatus){
        if(C.orderStatus=="approved"){
         data.payments.paid += Number(C.total) || 0;
        }
       else{
        data.payments.due+=Number(C.total);
       }
      }
      else{
      data.payments.paid += Number(C.total) || 0;
      }
      data.payments.total += Number(C.total) || 0;
          if(C.status === 'fulfilled'){
              data.orders.completed++;
          }
          else {
              data.orders.inProgress++;
          }
          let a;


          // data = await new Promise((resolve, reject) => {
          //   C.line_items.forEach(async (a, i, array) => {
                

          //     if(a.sku.startsWith('.')){
          //       a.sku=a.sku.substring(1)
          //     }
          //     let product=await this.productService.getProductBySku(a.sku)
          //     if(product){ 
          //     // console.log(product.categoryId,product.zohoBooksProductId); 
          //       let found = data.pieChart.find(element => element.name == product.categoryId.toString());
          //       // console.log('found',found);
          //       if(found){    
          //           found.value += Number(a.item_total) || 0;
          //       }
          //       else {
          //           data.pieChart.push({name : product.categoryId, value : Number(a.quantity)});
          //       }
          //       // console.log("piechart",data.pieChart); 
          //     }
          //     else{
          //       let found = data.pieChart.find( element => element['name'] == "Others".toString());
          //       // console.log('found',found);
          //       if(found){
          //           found.value += Number(a.item_total) || 0;
          //       }
          //       else {
          //           data.pieChart.push({name : 'Others', value : Number(a.item_total)});
          //       }     
          //       // console.log("product",a);
          //     }
                
          //     if(C.line_items.length-1  === i){
          //           resolve(data);
          //       }

          //   });
          // });






          for(a of C.line_items){
            if(a.sku.startsWith('.')){
              a.sku=a.sku.substring(1)
            }
            let product=await this.productService.getProductBySku(a.sku)
            if(product){ 
            // console.log(product.categoryId,product.zohoBooksProductId); 
              let found = data.pieChart.find(element => element.name == product.categoryId.toString());
              // console.log('found',found);
              if(found){    
                  found.value += Number(a.item_total) || 0;
              }
              else {
                  data.pieChart.push({name : product.categoryId, value : Number(a.quantity)});
              }
              // console.log("piechart",data.pieChart); 
            }
            else{
              let found = data.pieChart.find( element => element['name'] == "Others".toString());
              // console.log('found',found);
              if(found){
                  found.value += Number(a.item_total) || 0;
              }
              else {
                  data.pieChart.push({name : 'Others', value : Number(a.item_total)});
              }     
              // console.log("product",a);
            }
               
              }







      let date = new Date(C.date);
      let month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      let foundBar = data.barChart.find(element => element.name === month);
      if(foundBar){
          foundBar.value += Number(C.total) || 0;
      }
      else{
          data.barChart.push({C : month, value : Number(C.total)});
      }
      // console.log("barChart",data.barChart); 
      if(orders.length-1  === i){
      // console.log("barChart",data);
          resolve(data);
      }
  });
});
// console.log("in d_data_update end",bar)
return bar;
}

async allOrderInvoices(salesOrderRefNumber: string){
  let token=await this.zohoBookToken()
  let kill
    let res = await fetch(`https://books.zoho.in/api/v3/invoices?organization_id=60015092519&reference_number=${salesOrderRefNumber}`, {
    method:'GET',
    headers:{
      'Content-Type':'application/json',
      'Authorization':`${token}`,
    }  
  })
  .then(res=>res.json()) 
  .then(data=>
      kill=data
  );
  if(kill.message=="You are not authorized to perform this operation"||kill.message=="This user is not associated with the CompanyID/CompanyName:60015313630."||kill.code==57){
    token=await this.zohoBookToken()
    let res = await fetch(`https://books.zoho.in/api/v3/invoices?organization_id=60015092519&reference_number=${salesOrderRefNumber}`, {
      method:'GET',
      headers:{
        'Content-Type':'application/json',
        'Authorization':`${token}`,
      }
    })
    .then(res=>res.json())
    .then(data=>
        kill=data
    );
  }
  let invoices=kill.invoices
  if(invoices==undefined){
    throw new HttpException({
      status: HttpStatus.NOT_FOUND,
      error: 'No data found in zoho',
      Response:kill,
      message: "Not Found Data",
    }, HttpStatus.NOT_FOUND);
  }
return invoices
}

async allPurchaseOrders(salesOrderRefNumber:string){
  let token=await this.zohoBookToken()
  let kill
    let res = await fetch(`https://books.zoho.in/api/v3/purchaseorders?organization_id=60015092519&reference_number=${salesOrderRefNumber}`, {
    method:'GET',
    headers:{
      'Content-Type':'application/json',
      'Authorization':`${token}`,
    }  
  })
  .then(res=>res.json()) 
  .then(data=>
      kill=data
  );
  if(kill.message=="You are not authorized to perform this operation"||kill.message=="This user is not associated with the CompanyID/CompanyName:60015313630."||kill.code==57){
    token=await this.zohoBookToken()
    let res = await fetch(`https://books.zoho.in/api/v3/purchaseorders?organization_id=60015092519&reference_number=${salesOrderRefNumber}`, {
      method:'GET',
      headers:{
        'Content-Type':'application/json',
        'Authorization':`${token}`,
      }
    })
    .then(res=>res.json())
    .then(data=>
        kill=data
    );
  }
  let purchaseOrders=kill.purchaseorders
  if(purchaseOrders==undefined){
    throw new HttpException({
      status: HttpStatus.NOT_FOUND,
      error: 'No data found in zoho',
      Response:kill,
      message: "Not Found Data",
    }, HttpStatus.NOT_FOUND);
  }
return purchaseOrders
}

async invoiceAllDetails(id:any,po:boolean){
    let salesorder= await this.zohoSalesOrderRepository.findOne({where:{salesorderId:id}})
    if(salesorder){
      let soInvoices= await this.allOrderInvoices(salesorder.salesorderNumber)
      let token=await this.zohoBookToken()
      for(let invoice of soInvoices)
       {
        invoice.invoice_pods=await this.invoicePodService.getInvoicePods(invoice.invoice_id)
        invoice.line_items=await this.invoicePodService.findInvoiceDetails(token,invoice.invoice_id)
        invoice.clientPoReferenceNumber=salesorder.referenceNumber
        invoice.line_items=invoice.line_items.line_items
       }
      // return soInvoices
      soInvoices= await soInvoices.map(({invoice_id,invoice_number,,clientPoReferenceNumber,invoice_pods,shipping_address,total,date,due_date,line_items})=>({['invoice_id']:invoice_id,['invoice_number']:invoice_number,['clientPoReferenceNumber']:clientPoReferenceNumber,['invoice_pods']:invoice_pods,['shipping_address']:shipping_address,['total']:total,['date']:date,['due_date']:due_date,['line_items']:line_items}))
      // return soInvoices
      if(po){
          // let soPurchaseOrders= await this.allPurchaseOrders(salesorder.salesorderNumber)
          // soPurchaseOrders= await soPurchaseOrders.map(({purchaseorder_id,purchaseorder_number})=>({[purchaseorder_id]:purchaseorder_number}))
          // return { clientPoReferenceNumber:salesorder.referenceNumber,soInvoices:soInvoices, soPurchaseOrders:soPurchaseOrders,clientPoReferenceNumber:salesorder.referenceNumber}
          return soInvoices
      }
      else{
        // return { clientPoReferenceNumber:salesorder.referenceNumber,soInvoices:soInvoices}
        return soInvoices
      }
    }
    else{
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: 'SalesOrder not found', 
        message: "invalid id",
      }, HttpStatus.NOT_FOUND);
    }
}

async allShipments(salesOrder:any){
  
}

async notYetShipped(r:any){
  let data=r.data
  // let result=[]
  const promises = data.map(a => this.allShipments(a))
  let result= await Promise.all(promises)
  return {data:result,count:result.length}
}

}
