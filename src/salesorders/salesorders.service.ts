import { Injectable } from '@nestjs/common';
const fetch = require('node-fetch');
var request = require('request');
const http = require('https');
const { google } = require('googleapis');
var cron = require('node-cron');
import axios from 'axios';
import {HttpException,HttpStatus } from '@nestjs/common'; 
import { URLSearchParams } from 'url';



@Injectable()
export class SalesordersService {


async convertData(array:any) {

  for (let i = 1; i < array.length; i++) {
    array[i] = await this.convert(array[i]);
  }
  return array;
}
async convert(array:any) {
  
  array = array.split(`$`);
  let data = {};
  data[array[0]] = array[1]
  array = data;
  return array;
}

  async getXmlValue(str:any) {
    const reg = /(?<=<rows>)(.*)(?=<\/rows>)/s
    let data = [...str.match(reg)];
   let array=data[0].toString()
  // return array

   array=array.replace(/<row>/g, '')
   array=array.split("</row>").join("");
   array=array.split("</column>").join("");
   array=array.split("\">").join("$");
   array=array.replace(/\n/g, '')
  //  return array

   array = array.split(`<column name="`);
   array = await this.convertData(array);
   return array
  };

  async renameKeys(obj:any, newKeys:any) {
    const keyValues = Object.keys(obj).map(key => {
      const newKey = newKeys[key] || key;
      return { [newKey]: obj[key] };
    });
    return Object.assign({}, ...keyValues);
  }

  async  purchaseOrderItemsDataMap(array:any) {
    let tb = {
      'Item ID': [],
      'Item Price (BCY)': [],
      'Item Name': [],
      'Quantity': [],
      'Tax Amount'	:[],
      'Total (BCY)': [],
      'Sub Total (BCY)': [],
      'Purchase Order ID' : [],
      'Product ID': [],
      'Warehouse ID': [],
      'Currency Code': [],
      'Account ID': [],
      'Product Category': [],
      'HSN/SAC': [],
      'Destination Of Supply': [],
      'Tax Exemption ID': [],
      'Item Price (FCY)': [],
      'Item Description': [],
      'Usage unit': [],
      'Tax ID': [],
      'FCY Tax Amount': [],
      'Source': [],
      'Total (FCY)': [],
      'Sub Total (FCY)': [],
      'Last Modified Time': [],
      'Created Time': [],
      'Quantity Billed': [],
      'Quantity Cancelled': [],
      'Project ID': [],
      'SO ItemID': [],
      'PriceList ID': [],
      'Quantity Received': [],
      'Non Receive Quantity': [],
    };
    for (let r = 0; r < array.length; r++) {
      let keys = Object.keys(tb);
      let arrayKey = Object.keys(array[r]);
      for (let o = 0; o < keys.length; o++) {
        if (keys[o] == arrayKey[0]) {
          tb[keys[o]].push(array[r][arrayKey[0]] ? array[r][arrayKey[0]] : 'NA');
        }
      }
    }
    return await this.mapForSheets(tb);
  }

  async purchaseOrderDataMap(array:any) {
    let tb = {
      'Purchase Order ID': [],
      'Purchase Order Number': [],
      'Purchase Order Date': [],
      'Delivery Date': [],
      'Purchase Order Status': [],
      'Total (BCY)': [],
      'Sub Total (BCY)': [],
      'Created Time': [],
      'Attention Content': [],
      'Expected Delivery Date': [],
      'Currency Code': [],
      'Date': [],
      'Sales order ID': [],
      'Last Modified Time': [],
      'Reference number': [],
      'GST Treatment': [],
      'GSTIN': [],
      'Address ID': [],
      'Exchange Rate': [],
      'Delivery Instructions': [],
      'Terms &amp; Conditions': [],
      'Shipment preference': [],
       'Source': [],
      'Total (FCY)': [],
      'Sub Total (FCY)': [],
      'Created By': [],
      'Modified By': [],
      'PriceList ID': [],
      'Billed Status': [],
      'Payment Terms Label': [],
      'Branch ID': [],
      'CRM Reference ID': [],
      'TCS Amount (BCY)': [],
      'TCS Amount (FCY)': []
    };
    let keys = Object.keys(tb);
    for (let r = 0; r < array.length; r++) {
      let arrayKey = Object.keys(array[r]);
      for (let o = 0; o < keys.length; o++) {
        if (keys[o] == arrayKey[0]) {
          tb[keys[o]].push(array[r][arrayKey[0]] ? array[r][arrayKey[0]] : '');
        }
      }
    }
  
    const newKeys = { "Terms &amp; Conditions": "Terms & Conditions"};
  tb = await this.renameKeys(tb, newKeys);
  return await this.mapForSheets(tb);
    
  }


  async podDataMap(array:any) {
    let tb = {
      'Record ID': [],
      'POD Name': [],
      'Created Time': [],
      'Last Modified Time': [],
      'POD Type': [],
      'Location': [],
      'Signature File': [],
      'POD-1': [],
      'POD-2': [],
      'Other Attachment Link-1': [],
      'Other Attachment Link-2': [],
      'Other Attachment Link-3': [],
      'Other Attachment Link-4': [],
      'Other Attachment Link-5': [],
    };
    let keys = Object.keys(tb);
    for (let r = 0; r < array.length; r++) {
      let arrayKey = Object.keys(array[r]);
      for (let o = 0; o < keys.length; o++) {
        if (keys[o] == arrayKey[0]) {
          tb[keys[o]].push(array[r][arrayKey[0]] ? array[r][arrayKey[0]] : '');
        }
      }
    }
  
    const newKeys = { "Terms &amp; Conditions": "Terms & Conditions"};
  tb = await this.renameKeys(tb, newKeys);
  return await this.mapForSheets(tb);
    
  }

  async invoiceMap(array:any) {
    // return array
    let tb = {
      'Invoice ID': [],
      'Invoice Number': [],
      'Invoice Date': [],
      'Invoice Status': [],
      'Customer ID': [],
      'Due Date': [],
      'Discount (%)': [],
      'Sub Total (BCY)': [],

      // 'Discount': [],

      
      'Shipping Charge (BCY)': [],
      'Discount Amount': [],
      'Adjustment (BCY)': [],
      'Total (BCY)': [],
      'Sales Person ID': [],
      'Created Time': [],


      'Age In Days': [],
      'Age Tier': [],
      'Subscription ID': [],
      'Source': [],
      'Type': [],
      'Balance (BCY)': [],
      'GST Treatment': [],
      'GSTIN': [],
      'Purchase Order#': [],
      // 'Purchase Order': [],

      'Currency Code': [],
      'Exchange Rate': [],
      'Discount Type': [],
      'Is Discount Before Tax': [],
      'Is Inclusive Tax': [],

      'Sub Total (FCY)': [],
      'Total (FCY)': [],
      'Balance (FCY)': [],
      'Shiping Charge (FCY)': [],
      'Adjustment (FCY)': [],
      'Payment Terms': [],
      'Payment Terms Label': [],
      'Notes': [],
      // 'Terms &amp; Conditions': [],
      'Terms & Conditions': [],

      'Write Off Amount (FCY)': [],
      'Write Off Amount (BCY)': [],

      'Expected Payment Date': [],
      'Last Payment Date': [],
      'Last Modified Time': [],
      'Created By': [],

      'Recurring Invoice ID': [],
      'Address ID': [],
      'Modified By': [],
      'PriceList ID': [],
      'Discount Amount (BCY)': [],
      'Discount Amount (FCY)': [],
      'Write Off Date': [],
      'Branch ID': [],
      'Status': [],
      'CRM Potential ID': [],
      'Write Off Description': [],
      'CRM Refernece ID': [],
      'TCS Amount (BCY)': [],
      'Shipping Charge Tax Amount (FCY)': [],
      'Shipping Charge Tax Amount (BCY)': [],
      'Client PO Reference': [],
      

    };
    let arrayKey
    let keys = Object.keys(tb);
    for (let r = 0; r < array.length; r++) {
       arrayKey = Object.keys(array[r]);
      for (let o = 0; o < keys.length; o++) {
        if (keys[o] == arrayKey[0]) {
          tb[keys[o]].push(array[r][arrayKey[0]] ? array[r][arrayKey[0]] : '');
          
          
        }
      }
    }

      
    const newKeys = { "Terms &amp; Conditions": "Terms & Conditions"};
  tb = await this.renameKeys(tb, newKeys);
  
  return await this.mapForSheets(tb);
    
  }

  async customerMap(array:any) {
    let tb = {
      "Customer ID": [],
      "Customer Name": [],
      "Display Name": [],
      "Email": [],
      "Phone": [],
      "Status": [],
      "Created Time": [],
      "Company Name": [],
      "First Name": [],
      "Last Name": [],
      "Salutation": [],
      "Mobile Phone": [],
      "Payment Terms": [],
      "Place Of Supply": [],
      "Tax Exemption ID": [],
      "GST Treatment": [],
      "GSTIN": [],
      "Currency Code": [],
      "Notes": [],
      "Website": [],
      "Last Modified Time": [],
      "Source": [],
      "Created By": [],
      "Modified By": [],
      "Customer Owner ID": [],
      "PriceList ID": [],
      "Credit Limit": [],
      "Customer Sub Type": [],
      "Default Address ID": [],
      "Opening Balance": [],
      "CRM Reference ID": [],
      "Zoho People Reference ID": [],
      "Zoho Project Reference ID": [],
      "Can pay via Bank Account": [],
      "PAN Number": [],
      "Type of Business": [],
      "Annual Turnover Approximate": [],
      "Bank Name": [],
      "Bank Account Number": [],
      "Bank Branch": [],
      "Bank IFSC": [],
      "Account Type": [],
      "Primary Category": [],
      "Category Code": [],
      "Business Type Code": [],
      "Catalog ID": [],
      "Revenue Code": [],
      "Legacy Code": [],
      "SupplierID": [],
      "Business Type": [],
    };
    let arrayKey
    let keys = Object.keys(tb);
    for (let r = 0; r < array.length; r++) {
       arrayKey = Object.keys(array[r]);
      for (let o = 0; o < keys.length; o++) {
        if (keys[o] == arrayKey[0]) {
          tb[keys[o]].push(array[r][arrayKey[0]] ? array[r][arrayKey[0]] : '');
          
          
        }
      }
    }

      
    const newKeys = { "Terms &amp; Conditions": "Terms & Conditions"};
  tb = await this.renameKeys(tb, newKeys);
  
  return await this.mapForSheets(tb);
    
  }


  async salesPersonMap(array:any) {
    let tb = {
      "Sales Person ID" : [],
      "Name" : [],
      "Status": [],
      "Last Modified Time" : [],
      "Created Time" : [],
    };
    let arrayKey
    let keys = Object.keys(tb);
    for (let r = 0; r < array.length; r++) {
       arrayKey = Object.keys(array[r]);
      for (let o = 0; o < keys.length; o++) {
        if (keys[o] == arrayKey[0]) {
          tb[keys[o]].push(array[r][arrayKey[0]] ? array[r][arrayKey[0]] : '');
          
          
        }
      }
    }

      
    const newKeys = { "Terms &amp; Conditions": "Terms & Conditions"};
  tb = await this.renameKeys(tb, newKeys);
  
  return await this.mapForSheets(tb);
    
  }



  async salesOrderDataMap(array:any) {
    // return array
  // array = JSON.parse(array);
    let tb = {
      'Sales order ID': [],
      'Order Date': [],
      'Sales Order#': [],
      'Status': [],
      'Estimate ID': [],
      'Sub Total (BCY)': [],
      'Total (BCY)': [],
      'Discount Amount (BCY)': [],
      'Adjustment (BCY)': [],
      'Sales Person ID': [],
      'Created Time': [],
      'Customer ID': [],
      'Currency Code': [],
      'Exchange Rate': [],
      'Discount (%)': [],
      'Shipping Charge (BCY)': [],
      'Last Modified Time': [],
      'Address ID': [],
      'Reference Number': [],
      'Delivery Method': [],
      'GST Treatment': [],
      'GSTIN': [],
      'Source': [],
      'Discount Type': [],
      'Sub Total (FCY)': [],
      'Total (FCY)': [],
      'Discount Amount (FCY)': [],
      'Shipping Charge (FCY)': [],
      'Adjustment (FCY)': [],
      'Notes': [],
      'Created By': [],
      'Modified By': [],
      'PriceList ID': [],
      'Invoiced Status': [],
      'Paid Status': [],
      'Sales Channel': [],
      'Payment Terms Label': [],
      'Branch ID': [],
      'Expected Shipment Date': [],
      'CRM Reference ID': [],
      'CRM Potential ID': [],
      'Is Discount Before Tax': [],
      'Shipping Charge Tax Amount (FCY)': [],
      'Shipping Charge Tax Amount (BCY)': [],
      'Adjustment Description': [],
      'Terms &amp; Conditions': [],
      'Against LOI': [],
      'Client POC-1 Email': [],
      'Client POC-2 Email': [], 
      'Client POC-3 Email': [],
      'Client POC-4 Email': [],
    };
    // return array
 
    for (let r = 0; r < array.length; r++) {
      let keys = Object.keys(tb);
      let arrayKey = Object.keys(array[r]);
      for (let o = 0; o < keys.length; o++) {
        if (keys[o] == arrayKey[0]) { 
          tb[keys[o]].push(array[r][arrayKey[0]]) ;
        }
      }
    }
    const newKeys = { "Terms &amp; Conditions": "Terms & Conditions"}
                  ;
  tb = await this.renameKeys(tb, newKeys);
  // return tb
  return await this.mapForSheets(tb);
    
  }

  async  salesOrderItemsDataMap(array:any) {
    // return array
    let tb = {
      'Item ID': [],
      'Product ID': [],
      'Item Name': [],
      'Quantity': [],
      'Quantity Shipped': [],
      'Sub Total (BCY)': [],
      'Total (BCY)': [],
      'Sales order ID': [],
      'Item Price (BCY)': [],
      'Project ID': [],
      'Warehouse ID': [],
      'Discount Type': [],
      'Is Discount Before Tax': [],
      'Currency Code': [],
      'Account ID': [],
      'Product Category': [],
      'Description': [],
      'HSN/SAC': [],
      'Place Of Supply': [],
      'Tax Exemption ID': [],
      'Quantity Invoiced': [],
      'Quantity Cancelled': [],
      'Item Price (FCY)': [],
      'Entity Discount Percent': [],
      'Discount Amount (FCY)': [],
      'Tax ID': [],
      'FCY Tax Amount': [],
      'Source': [],
      'Total (FCY)': [],
      'Sub Total (FCY)': [],
      'Last Modified Time': [],
      'Created Time': [],
      'PriceList ID': [],
      'Quantity Packed': [],
      'Non Package Quantity': [],
      'Quantity Delivered': [],
      'Invoiced Quantity Cancelled': [],
      'Quantity Dropshipped': [],
      'Manually Fulfilled Quantity': [],
      'CRM Reference ID': [],
      'Client SKU Code': [],
    };
 
    for (let r = 0; r < array.length; r++) {
      let keys = Object.keys(tb);
      let arrayKey = Object.keys(array[r]);
      for (let o = 0; o < keys.length; o++) {
        if (keys[o] == arrayKey[0]) {
          tb[keys[o]].push(array[r][arrayKey[0]]) ;
        }
      }
    }
    // return tb
    return await this.mapForSheets(tb);
  }

  async mapToSheetsData(data:any,range:string){

       if (range=="PurchaseOrderItems"){
        
       return await this.purchaseOrderItemsDataMap(data);
      }
      else if (range=="SalesOrders"){

        return await this.salesOrderDataMap(data);
      }
      else if (range=="SalesOrderItems"){

        return await this.salesOrderItemsDataMap(data);
      }
      else if (range=="PurchaseOrders"){

        return await this.purchaseOrderDataMap(data);
      }
      else if(range == "PODBooks"){
         return await this.podDataMap(data);
      }
      else if(range == "invoices"){
        return await this.invoiceMap(data)

      }
      else if(range == "customers"){
        return await this.customerMap(data)
      }
      else if(range == "salesman"){
        return await this.salesPersonMap(data)
      }
      else {
        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'INTERNAL_SERVER_ERROR',
          message: "INTERNAL_SERVER_ERROR"
        }, HttpStatus.INTERNAL_SERVER_ERROR);
      }
  }

  async mapForSheets(array:any) {
  const obj = [];
  let Values = Object.keys(array).map(function(key) {
    return array[key];
  });
  for (let i = 0; i < Values[0].length; i++) {
    let ar = [];
    await obj.push(ar);
    
  }
  let o;
  for (let p = 0; p < Values.length; p++) {
    for (let w = 0; w < Values[p].length; w++) {
      o = w % Values.length;
      await obj[w].push(Values[p][w] ? Values[p][w] : 'NA');

    }
  }
  
  await obj.unshift(Object.keys(array));
  return obj
  }

  async postToSheets(soData:any,poData:any,soItemsData:any,poItemsData:any,podData:any,invoiceData : any,customerData : any,salespersonData : any) {
    
    const auth = new google.auth.GoogleAuth({
      keyFile : "./credentials.json",
      scopes : ["https://www.googleapis.com/auth/spreadsheets"],
      });
      const client = await auth.getClient(); 
       const spreadsheetId = '1H02KJG1WVEz3H_3bVD13LRG2Vnywsj-4fhh6wSUWi8I';
      const googleSheets = google.sheets({ version: 'v4', auth: client });
     let outPut=[]

     await googleSheets.spreadsheets.values.clear({
      auth,
      spreadsheetId,
      range: 'Sales_Orders',
    });
    let so=await googleSheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range: 'Sales_Orders', 
      valueInputOption: 'RAW',
      resource: {
        values: soData,
      },
    });
    outPut.push({salesOrderSync:so.statusText,responseURL:so.request})
 

    await googleSheets.spreadsheets.values.clear({
      auth,
      spreadsheetId,
      range: 'Purchase_Orders',
    });
    let po=await googleSheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range: 'Purchase_Orders',
      valueInputOption: 'RAW',
      resource: {
        values: poData,
      },
    });
    outPut.push({purchareOrderSync:po.statusText,responseURL:po.request})

      await googleSheets.spreadsheets.values.clear({
        auth,
        spreadsheetId,
        range: 'Purchase_Order_Items',
      });
      let poi=await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
         range: 'Purchase_Order_Items',
        valueInputOption: 'RAW',
        resource: {
          values: poItemsData,
        },
      });
      outPut.push({purchaseOrderItemsSync:poi.statusText,responseURL:poi.request})
     
      await googleSheets.spreadsheets.values.clear({
        auth,
        spreadsheetId,
        range: 'Sales_Order_Items',
      });
      let soi=await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: 'Sales_Order_Items',
  
        valueInputOption: 'RAW',
        resource: {
          values: soItemsData,
        },
      });
      outPut.push({salesOrderItemsSync:soi.statusText,responseURL:soi.request})

      await googleSheets.spreadsheets.values.clear({
        auth,
        spreadsheetId,
        range: 'Ivoice_POD(ZOHO_BOOKS)',
      });
      let pod=await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: 'Ivoice_POD(ZOHO_BOOKS)',
        valueInputOption: 'RAW',
        resource: {
          values: podData,
        },
      });
      outPut.push({PODataSync:pod.statusText,responseURL:pod.request})


      await googleSheets.spreadsheets.values.clear({
        auth,
        spreadsheetId,
        range: 'Invoices (Zoho Books)',
      });
      let invoice=await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: 'Invoices (Zoho Books)',
        valueInputOption: 'RAW',
        resource: {
          values: invoiceData,
        },
      });
      
      outPut.push({InvoicesDataSync:invoice.statusText,responseURL:invoice.request})


      
      await googleSheets.spreadsheets.values.clear({
        auth,
        spreadsheetId,
        range: 'Customers (Zoho Books)',
      });
      let customers=await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: 'Customers (Zoho Books)',
        valueInputOption: 'RAW',
        resource: {
          values: customerData,
        },
      });
      
      outPut.push({CustomersDataSync:customers.statusText,responseURL:customers.request})

      await googleSheets.spreadsheets.values.clear({
        auth,
        spreadsheetId,
        range: 'sales person (Zoho Books)',
      });
      let salesperson=await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: 'sales person (Zoho Books)',
        valueInputOption: 'RAW',
        resource: {
          values: salespersonData,
        },
      });
      
      outPut.push({salespersonDataSync:salesperson.statusText,responseURL:salesperson.request})

    return outPut
  }

  async tokenfunc() {
    let zoho = await fetch('https://accounts.zoho.in/oauth/v2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
 
      }),
    });
    zoho = await zoho.text();
    zoho = JSON.parse(zoho);
    let token = 'Zoho-oauthtoken ';
    token = token + zoho.access_token;

    return token;
  }

  async GetData(s:string,token:any,spreadsheetId:any,googleSheets:any,auth:any){
    var Data,res1
    switch (s) {
      case 'SalesOrderItems':
        await axios({
          method: "GET", 
          url:
            `https://analyticsapi.zoho.in/api/abhi@prodo.in/Zoho+Books+Analytics/Sales+Order+Items+(Zoho+Books)?ZOHO_ACTION=EXPORT&ZOHO_OUTPUT_FORMAT=XML&ZOHO_ERROR_FORMAT=XML&ZOHO_API_VERSION=1.0&ZOHO_VALID_JSON=true`,
                headers: { 
                  "Content-Type": "application/json",
                  Accept: 'application/json',
                  Authorization: `${token}`,
              },
              }).then(res => Data=res.data)
              .catch(error => Data=error);     
             Data = await this.getXmlValue(Data)
             Data= await this.mapToSheetsData(Data,s)
            await googleSheets.spreadsheets.values.clear({
              auth,
              spreadsheetId,
              range: 'Sales_Order_Items',
            });
            res1=await googleSheets.spreadsheets.values.append({
              auth,
              spreadsheetId,
              range: 'Sales_Order_Items', 
              valueInputOption: 'RAW',
              resource: {
                values: Data,
              },
            });
            return {salesOrderSync:res1.statusText,responseURL:res1.request}
            break;
        case 'PurchaseOrders':
          await axios({
            method: "GET", 
            url:
              `https://analyticsapi.zoho.in/api/abhi@prodo.in/Zoho+Books+Analytics/Purchase+Orders+(Zoho+Books)?ZOHO_ACTION=EXPORT&ZOHO_OUTPUT_FORMAT=XML&ZOHO_ERROR_FORMAT=XML&ZOHO_API_VERSION=1.0&ZOHO_VALID_JSON=true`,
        
                  headers: { 
                    "Content-Type": "application/json",
                    Accept: 'application/json',
                    Authorization: `${token}`,
                    },
                    }).then(res => Data=res.data)
                    .catch(error => Data=error);     
                   Data = await this.getXmlValue(Data)
                  Data= await this.mapToSheetsData(Data,s)

                  await googleSheets.spreadsheets.values.clear({
                    auth,
                    spreadsheetId,
                    range: 'Purchase_Orders',
                  });
                  res1=await googleSheets.spreadsheets.values.append({
                    auth,
                    spreadsheetId,
                    range: 'Purchase_Orders', 
                    valueInputOption: 'RAW',
                    resource: {
                      values: Data,
                    },
                  });
                  return {purchaseOrderSync:res1.statusText,responseURL:res1.request}
                  break;
         case 'PurchaseOrderItems':
          await axios({
            method: "GET", 
            url:
              `https://analyticsapi.zoho.in/api/abhi@prodo.in/Zoho+Books+Analytics/Purchase+Order+Items+(Zoho+Books)?ZOHO_ACTION=EXPORT&ZOHO_OUTPUT_FORMAT=XML&ZOHO_ERROR_FORMAT=XML&ZOHO_API_VERSION=1.0&ZOHO_VALID_JSON=true`,
        
                  headers: { 
                    "Content-Type": "application/json",
                    Accept: 'application/json',
                    Authorization: `${token}`,
                },
                      }).then(res => Data=res.data)
                      .catch(error => Data=error);     
                     Data = await this.getXmlValue(Data)
                    Data= await this.mapToSheetsData(Data,s)
                    await googleSheets.spreadsheets.values.clear({
                      auth,
                      spreadsheetId,
                      range: 'Purchase_Order_Items',
                    });
                    res1=await googleSheets.spreadsheets.values.append({
                      auth,
                      spreadsheetId,
                      range: 'Purchase_Order_Items', 
                      valueInputOption: 'RAW',
                      resource: {
                        values: Data,
                      },
                    });
                    return {purchaseOrderSync:res1.statusText,responseURL:res1.request}
                    break;

          case 'SalesOrders':
          await axios({
            method: "GET", 
            url:
              `https://analyticsapi.zoho.in/api/abhi@prodo.in/Zoho+Books+Analytics/Sales+Orders+(Zoho+Books)?ZOHO_ACTION=EXPORT&ZOHO_OUTPUT_FORMAT=XML&ZOHO_ERROR_FORMAT=XML&ZOHO_API_VERSION=1.0&ZOHO_VALID_JSON=true`,
        
                  headers: { 
                    "Content-Type": "application/json",
                    Accept: 'application/json',
                    Authorization: `${token}`,
                },
                      }).then(res => Data=res.data)
                      .catch(error => Data=error);     
                     Data = await this.getXmlValue(Data)
                    Data= await this.mapToSheetsData(Data,s)
                    await googleSheets.spreadsheets.values.clear({
                      auth,
                      spreadsheetId,
                      range: 'Sales_Orders',
                    });
                    res1=await googleSheets.spreadsheets.values.append({
                      auth,
                      spreadsheetId,
                      range: 'Sales_Orders', 
                      valueInputOption: 'RAW',
                      resource: {
                        values: Data,
                      },
                    });
                    return {purchaseOrderSync:res1.statusText,responseURL:res1.request}
                    break;
          case 'PODBooks':
            await axios({
            method: "GET", 
            url:
              `https://analyticsapi.zoho.in/api/abhi@prodo.in/Zoho+Books+Analytics/POD+(Zoho+Books)?ZOHO_ACTION=EXPORT&ZOHO_OUTPUT_FORMAT=XML&ZOHO_ERROR_FORMAT=XML&ZOHO_API_VERSION=1.0&ZOHO_VALID_JSON=true`,
        
                  headers: { 
                    "Content-Type": "application/json",
                    Accept: 'application/json',
                    Authorization: `${token}`,
                },
                      }).then(res => Data=res.data)
                      .catch(error => Data=error);     
                     Data = await this.getXmlValue(Data)
                    Data= await this.mapToSheetsData(Data,s)
                    await googleSheets.spreadsheets.values.clear({
                      auth,
                      spreadsheetId,
                      range: 'Invoice_POD(ZOHO_BOOKS)',
                    });
                    res1=await googleSheets.spreadsheets.values.append({
                      auth,
                      spreadsheetId,
                      range: 'Invoice_POD(ZOHO_BOOKS)', 
                      valueInputOption: 'RAW',
                      resource: {
                        values: Data, 
                      },
                    });
                    return {purchaseOrderSync:res1.statusText,responseURL:res1.request}
                    break;
          case 'invoices':
            await axios({
            method: "GET", 
            url:
              `https://analyticsapi.zoho.in/api/abhi@prodo.in/Zoho+Books+Analytics/Invoices+(Zoho+Books)?ZOHO_ACTION=EXPORT&ZOHO_OUTPUT_FORMAT=XML&ZOHO_ERROR_FORMAT=XML&ZOHO_API_VERSION=1.0&ZOHO_VALID_JSON=true`,
        
                  headers: { 
                    "Content-Type": "application/json",
                    Accept: 'application/json',
                    Authorization: `${token}`,
                },
                      }).then(res => Data=res.data)
                      .catch(error => Data=error);     
                     Data = await this.getXmlValue(Data)
                    Data= await this.mapToSheetsData(Data,s)
                    await googleSheets.spreadsheets.values.clear({
                      auth,
                      spreadsheetId,
                      range: 'Invoices (Zoho Books)',
                    });
                    res1=await googleSheets.spreadsheets.values.append({
                      auth,
                      spreadsheetId,
                      range: 'Invoices (Zoho Books)', 
                      valueInputOption: 'RAW',
                      resource: {
                        values: Data,
                      },
                    });
                    return {purchaseOrderSync:res1.statusText,responseURL:res1.request}
                    break;
            case 'customers':
            await axios({
            method: "GET", 
            url:
              `https://analyticsapi.zoho.in/api/abhi@prodo.in/Zoho+Books+Analytics/Customers+(Zoho+Books)?ZOHO_ACTION=EXPORT&ZOHO_OUTPUT_FORMAT=XML&ZOHO_ERROR_FORMAT=XML&ZOHO_API_VERSION=1.0&ZOHO_VALID_JSON=true`,
        
                  headers: { 
                    "Content-Type": "application/json",
                    Accept: 'application/json',
                    Authorization: `${token}`,
                },
                      }).then(res => Data=res.data)
                      .catch(error => Data=error);     
                     Data = await this.getXmlValue(Data)
                    Data= await this.mapToSheetsData(Data,s)
                    await googleSheets.spreadsheets.values.clear({
                      auth,
                      spreadsheetId,
                      range: 'Customers (Zoho Books)',
                    });
                    res1=await googleSheets.spreadsheets.values.append({
                      auth,
                      spreadsheetId,
                      range: 'Customers (Zoho Books)', 
                      valueInputOption: 'RAW',
                      resource: {
                        values: Data,
                      },
                    });
                    return {purchaseOrderSync:res1.statusText,responseURL:res1.request}
                    break;
            case 'salesman':
            await axios({
            method: "GET", 
            url:
              `https://analyticsapi.zoho.in/api/abhi@prodo.in/Zoho+Books+Analytics/Sales+Persons+(Zoho+Books)?ZOHO_ACTION=EXPORT&ZOHO_OUTPUT_FORMAT=XML&ZOHO_ERROR_FORMAT=XML&ZOHO_API_VERSION=1.0&ZOHO_VALID_JSON=true`,
        
                  headers: { 
                    "Content-Type": "application/json",
                    Accept: 'application/json',
                    Authorization: `${token}`,
                },
                      }).then(res => Data=res.data)
                      .catch(error => Data=error);     
                     Data = await this.getXmlValue(Data)
                    Data= await this.mapToSheetsData(Data,s)
                    await googleSheets.spreadsheets.values.clear({
                      auth,
                      spreadsheetId,
                      range: 'sales person (Zoho Books)',
                    });
                    res1=await googleSheets.spreadsheets.values.append({
                      auth,
                      spreadsheetId,
                      range: 'sales person (Zoho Books)', 
                      valueInputOption: 'RAW',
                      resource: {
                        values: Data,
                      },
                    });
                    return {purchaseOrderSync:res1.statusText,responseURL:res1.request}
                    break;
                    
            default:
              console.log("Not implemented");
   
    }
    return "error"

  }

  async salesOrdersSheetDataSync() {
    let token = await this.tokenfunc();
    const auth = new google.auth.GoogleAuth({
      keyFile : "./credentials.json",
      scopes : ["https://www.googleapis.com/auth/spreadsheets"],
      });
      const client = await auth.getClient(); 
       const spreadsheetId = '1H02KJG1WVEz3H_3bVD13LRG2Vnywsj-4fhh6wSUWi8I';
      const googleSheets = google.sheets({ version: 'v4', auth: client });

    let arrayKey = ['SalesOrderItems','PurchaseOrders','PurchaseOrderItems','SalesOrders','PODBooks','invoices','customers','salesman']
    const promises = arrayKey.map(a => this.GetData(a,token,spreadsheetId,googleSheets,auth))
    const result1 = await Promise.all(promises)
     return result1
   }

  // async autuSyncShedule(second:any,minute:any,hour:any){
  async autuSyncShedule(){
    // if(second>59||second<0){
    //   throw new HttpException({  
    //     status: HttpStatus.BAD_REQUEST,
    //     error: 'BAD_REQUEST', 
    //     message: "Please Provide seconds between [0-59]"
    //   }, HttpStatus.BAD_REQUEST);
    // }
    // if(minute>59||minute<0){
    //   throw new HttpException({  
    //     status: HttpStatus.BAD_REQUEST,
    //     error: 'BAD_REQUEST', 
    //     message: "Please Provide minutes between [0-59]"
    //   }, HttpStatus.BAD_REQUEST);
    // }
    // if(hour>23||hour<0){
    //   throw new HttpException({  
    //     status: HttpStatus.BAD_REQUEST,
    //     error: 'BAD_REQUEST', 
    //     message: "Please Provide hours between [0-23]"
    //   }, HttpStatus.BAD_REQUEST);
    // }

    // cron.schedule(`/${minute} /${hour} * *`, () => {
    // });
    // return ("Started it will sync again after 1 minute")
    let token = await this.tokenfunc();
    // let soData,poData,soItemsData,poItemsData,podData,invoices,customers,salesman
    const auth = new google.auth.GoogleAuth({
      keyFile : "./credentials.json",
      scopes : ["https://www.googleapis.com/auth/spreadsheets"],
      });
      const client = await auth.getClient(); 
       const spreadsheetId = '1H02KJG1WVEz3H_3bVD13LRG2Vnywsj-4fhh6wSUWi8I';
      const googleSheets = google.sheets({ version: 'v4', auth: client });

    let arrayKey = ['SalesOrderItems','PurchaseOrders','PurchaseOrderItems','SalesOrders','PODBooks','invoices','customers','salesman']
    const promises = arrayKey.map(a => this.GetData(a,token,spreadsheetId,googleSheets,auth))
    const result1 = await Promise.all(promises)
    await this.postToAutoSheets()
     return ("Started it will sync again after 12 hours")
  }

  async postToAutoSheets() {
     cron.schedule('0 0 */12 * * *', async () => await this.salesOrdersSheetDataSync());    
  }


} 
