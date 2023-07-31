import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, ObjectID, Repository, TreeRepository,Not } from 'typeorm';
import {SmsTemplate} from './sms.entity'
import { zohoSalesOrder } from './zohoSalesOrder.entity';

@Injectable()
export class zohoSalesOrderService {
  constructor(
    @InjectRepository(zohoSalesOrder)
    private readonly zohoSalesOrderRepository: Repository<zohoSalesOrder>,
) { }

async zohoBookTokenFarji(){
  let zohoToken = await this.zohoTokenRepository.findOne('62dfec85d3baa58e51c2fc65')
let token=zohoToken.token
// console.log("oldtoken",token)
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
token=await this.newZohoBookTokenFarji()
return token
}
return token
}

async findall(){
  return await this.zohoSalesOrderRepository.find()
}

async newZohoBookTokenFarji(){
  let zohoToken = await this.zohoTokenRepository.findOne('62dfec85d3baa58e51c2fc65')
  console.log("zohoToken",zohoToken)
  let zoho = await fetch('https://accounts.zoho.in/oauth/v2/token', {
    method: 'POST',
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded'
    },    
    body: new URLSearchParams({
        // 'refresh_token':'1000.2866f69cdb2027d6c27493990ed71a0e.e2111ac503bb18b8f3d83ba341140a50',
        'refresh_token':'1000.da351bf4fa3f3e12efbc8d857136bdd4.935cf4a8f14bf3cafa77756340386482',
        // 'client_id':'1000.HXRHTRPDNAVD7Y96GF96AECLE2A1MA',
        'client_id':'1000.IX5LZETFZ78PTGVDPZSRT5PL6COE5H',
        // 'client_secret':'babdacfca5c23a888ef95e0e18d5deb170c91b70a8',
        'client_secret':'a106415659f7c06d2406f446068c1739e81174c2b7',

        'grant_type': 'refresh_token' 
    })
});
zoho=await zoho.text()
zoho=JSON.parse(zoho)
let token="Zoho-oauthtoken "
token=token+zoho.access_token
zohoToken.token=token
let kill=await this.zohoTokenRepository.save(zohoToken)
// console.log("kill",kill)
return token
}

async InventorySalesOrderByID(id){
    // let token=await this.zohoBookToken()
    let token=await this.zohoBookTokenFarji()
  
    let kill
  
    // let res = await fetch(`https://books.zoho.in/api/v3/salesorders/${id}?organization_id=60015092519`, {
    // let res = await fetch(`https://inventory.zoho.in/api/v1/salesorders/${id}?organization_id=60015968384`, {
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
    // console.log('kill', kill)
    if(kill.message=="You are not authorized to perform this operation"||kill.message=="This user is not associated with the CompanyID/CompanyName:60015313630."||kill.code==57){
      token=await this.zohoBookTokenFarji()
      // let res = await fetch(`https://inventory.zoho.in/api/v1/salesorders/${id}?organization_id=60015968384`, {
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
      let salesOrder1=kill.salesorder
      // console.log("salesOrder",salesOrder)
      // console.log("with error",kill.salesorder)
      if(salesOrder1==undefined){
        console("No Data-in error",kill)
        return []
      }
      let lineItems=salesOrder1.line_items
      let k1=salesOrder1.packages
      let packages1={}
      for(let ii=0;ii<lineItems.length;ii++){
        lineItems[ii].package_id=[]
      }
      lineItems=await this.itemStatus(lineItems,salesOrder1)
      if(k1.length>0){
      for(let j=0;j<k1.length;j++){
      let data=await this.packageDetails(k1[j].package_id)
      packages1[k1[j].package_id]=data
        for(let k=0;k<lineItems.length;k++){
          let p_id =await this.itemDetails(lineItems[k],data)
          if(p_id=="NA"){
          }
          else{
            lineItems[k].package_id.push(p_id)
          }
        }
      }
      salesOrder1.package_list=packages1
      console.log("items in  error")
  
      lineItems=await this.setItemPrice(lineItems,salesOrder1.date)
      lineItems=await this.calShipment(lineItems,packages)
      salesOrder1.line_items=lineItems
      return salesOrder1
      }
      else{
      // console.log("items",lineItems)
      console.log("items in  error")
  
        lineItems=await this.setItemPrice(lineItems,salesOrder1.date)
        lineItems=await this.calShipment(lineItems,packages)
        salesOrder1.line_items=lineItems
        salesOrder.package_list=packages
        return salesOrder
      }
    }
    
    // console.log("without error",kill.salesorder)
    // console.log("items in  no error")
  
    let salesOrder=kill.salesorder
    if(salesOrder==undefined){
      console.log("No Data-without",kill,id)
      return []
    }
      let lineItems2=salesOrder.line_items
      let k=salesOrder.packages
      let packages={}
      for(let ii=0;ii<lineItems2.length;ii++){
        lineItems2[ii].package_id=[]
      }
      lineItems2=await this.itemStatus(lineItems2,salesOrder)
      if(k.length>0){
      for(let j=0;j<k.length;j++){
      let data1=await this.packageDetails(k[j].package_id)
      packages[k[j].package_id]=data1
        for(let k=0;k<lineItems2.length;k++){
          let p_id =await this.itemDetails(lineItems2[k],data1)
          if(p_id=="NA"){
          }
          else{
            lineItems2[k].package_id.push(p_id)
          }
        }
      }
      salesOrder.package_list=packages
      // console.log("items",lineItems2)
      lineItems2=await this.setItemPrice(lineItems2,salesOrder.date)
      lineItems2=await this.calShipment(lineItems2,packages)
      salesOrder.line_items=lineItems2
      return salesOrder
      }
      else{
      // console.log("items",lineItems2)
      lineItems2=await this.setItemPrice(lineItems2,salesOrder.date)
      lineItems2=await this.calShipment(lineItems2,packages)
        salesOrder.line_items=lineItems2
        salesOrder.package_list=packages
        return salesOrder
      }
  }
  
  async setItemPrice(lineItems,date){
    // console.log("lineItems",lineItems)
    for(let i=0;i<lineItems.length;i++){
      let sku=lineItems[i].sku
      if (sku.startsWith('.')) {
        sku = sku.substring(1)
      }
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
        // console.log("item_date_date",item_date_date)
        // console.log("date_date",date_date)
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
        // console.log("No Data-in item",sku)
        lineItems[i].prodo_pricee=lineItems[i].rate
        lineItems[i].prodo_images=[]
      } 
    }
    // console.log("lineItems-2",lineItems)
    return lineItems
  }
  async itemDetails(lineItem,data){
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
  
  async calShipment(lineItems,packages){ 
    // console.log("lineItems",lineItems)
    for(let i=0;i<lineItems.length;i++){
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
  
  async itemStatus(lineItems,salesOrder){
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
  
  async calculateStatus(lineItem){
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
  
  async packageDetails(id){
    // let token=await this.zohoBookToken()
    let token=await this.zohoBookTokenFarji()
    let kill
    // let res = await fetch(`https://inventory.zoho.in/api/v1/packages/${id}?organization_id=60015968384`, {
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
      token=await this.newZohoBookTokenFarji()
      // let res = await fetch(`https://inventory.zoho.in/api/v1/packages/${id}?organization_id=60015968384`, {
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
      // console.log("kill-not",kill)
      return kill.package
    }
    // console.log("kill-shi",kill)
  
    return kill.package
  
  }
  
}
