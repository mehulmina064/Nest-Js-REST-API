import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, ObjectID, Repository, TreeRepository,Not } from 'typeorm';
import { zohoSalesOrder } from '../../../zohoSalesOrder/zohoSalesOrder.entity';
import { zohoToken } from '../../../sms/token.entity';
import {HttpException,HttpStatus } from '@nestjs/common';
import fetch from 'node-fetch'





@Injectable()
export class internalSalesOrderService {
  constructor(
    @InjectRepository(zohoSalesOrder)
    private readonly zohoSalesOrderRepository: Repository<zohoSalesOrder>,
    @InjectRepository(zohoToken)
    private readonly zohoTokenRepository: Repository<zohoToken>,
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

  async check(id: string){
    let check = await this.zohoSalesOrderRepository.findOne({where:{salesorderId:String(id)}}).then((res1)=>{
      return res1
    }).catch((err)=>{
      return false
    })
    return check
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
          'refresh_token':'1000..935cf4a8f14bf3cafa77756340386482',//Mehul
          'client_id':'1000.',
          'client_secret':'',
          'grant_type': 'refresh_token' 
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


}
