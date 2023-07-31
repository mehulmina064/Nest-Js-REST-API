import { Injectable } from '@nestjs/common';
import { MailService, MailOptions } from './../mail/mail.service';
import { WhatsappService } from './../mail/whatsapp.service';

const fetch = require('node-fetch');
var request = require('request');
const http = require('https');
const { google } = require('googleapis');
import * as xlsx from 'xlsx';
import { UsingJoinColumnIsNotAllowedError } from 'typeorm';
import { clear } from 'console';
var cron = require('node-cron');
import { zohoToken } from './../sms/token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectID, Repository, FindManyOptions, getRepository, Any } from 'typeorm';
import {  NotFoundException } from '@nestjs/common';
import { rfqBid } from './rfqBid.entity';
import {HttpException,HttpStatus } from '@nestjs/common';


// var body_parser = require('body-parser')

const json = {};

@Injectable()
export class rfqBidService {
    constructor(private readonly mailService: MailService,
        private readonly whatsappService:WhatsappService,
    @InjectRepository(zohoToken)
    private readonly zohoTokenRepository: Repository<zohoToken>,
    @InjectRepository(rfqBid)
    private readonly rfqBidRepository : Repository<rfqBid>
    ) { }
    
    async getAll(){
        return await this.rfqBidRepository.find()
    }
    async saveRfqBid(rfqBid:any){
        if(rfqBid.rfqBidNo){
            throw new HttpException({
                status: HttpStatus.FORBIDDEN,
                error: 'FORBIDDEN',
                message: "You are not able to set RFQ-Bid-NO"
              }, HttpStatus.FORBIDDEN);
        }
        if(!rfqBid.rfqBidComment){
           rfqBid.rfqBidComment="None"
        }
        // console.log("in rfqbid save",rfqBid)
        let find= await this.rfqBidRepository.findOne({where:{rfqId:rfqBid.rfqId}})
        if(find){
            rfqBid.rfqBidNo=find.rfqBidNo+1
            // return rfqBid
            console.log("in rfqbid save",rfqBid)
            let data=await this.saveCrmRfqBid(rfqBid)
            if(data){
            return await this.rfqBidRepository.save(rfqBid)
            }
            else{
                throw new HttpException({
                    status: HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "Not able to set RFQ-Bid To Crm"
                  }, HttpStatus.EXPECTATION_FAILED);
            }
        }
        else{
            console.log("new rfq bid")
            rfqBid.rfqBidNo=1
            // return rfqBid
            let data=await this.saveCrmRfqBid(rfqBid)
            // console.log(data)
            if(data){
            // return data
            return await this.rfqBidRepository.save(rfqBid)
            }
            else{
                throw new HttpException({
                    status: HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "Not able to set RFQ-Bid To Crm"
                  }, HttpStatus.EXPECTATION_FAILED);
            }
        }
    }


    async sheetBidSave(rfq:any,rfqBid:any){
        let data=await this.getOneCrmRfqDetails(rfqBid.rfqId)
        if(data&&data.length>0){
            var url=data[0].GSheet
            if(url){
            url=url.match(/\/d\/(.+)\//)
            url=url[1]
            let rfqSheetDetails=await this.saveRfqSheetDetails(url,rfqBid)
             return {rfqSheetDetails:rfqSheetDetails}
            }
            else{ 
            throw new NotFoundException(`RFQ ${data[0].Deal_Name} GSheet ID not found`);
            }
            }
            else{
                throw new NotFoundException(`RFQ with this id not found`);

            }  
    }

    async mapResearchData(data:any,sheetId:any){
        const auth = new google.auth.GoogleAuth({
            keyFile : `./credentials.json`,
            scopes : ["https://www.googleapis.com/auth/spreadsheets"],
            });
            const client = await auth.getClient();
            const spreadsheetId = sheetId;        
            const googlesheets = google.sheets({ version: 'v4', auth: client });
            let k= await googlesheets.spreadsheets.values.get(
                {
                     auth:auth,
                     spreadsheetId,
                     range: 'Research (Digital)', 
             },
             ); 
             let keys = {
             }
             let productByRows={}
            const rows = k.data.values;
            let m =false 
            for(let i=0 ; i<rows.length;i++){
                  var row=rows[i]
                if("#"==row[0]){
                    keys['manufacturerDetails']=i
                    var row1=rows[i-1]
                    var row2=rows[i+1]
                    row1.map((ColumnName, index) => {
                        ColumnName=ColumnName.replace(/\s+/g,"_");
                        if(index>1&&ColumnName){
                            if(!keys[ColumnName]){
                            keys[ColumnName]=index
                            }
                        }
                      return ColumnName; 
                    });
                    row2.map((ColumnName, index) => {
                        ColumnName=ColumnName.replace(/\s+/g,"_");
                        if(index>1&&ColumnName){
                            if(!keys[ColumnName]){
                            keys[ColumnName]=index
                            }
                        }
                      return ColumnName; 
                    });
                    row.map((ColumnName, index) => {
                        ColumnName=ColumnName.replace(/\s+/g,"_");
                        if(index&&ColumnName){
                            if(!keys[ColumnName]){
                            keys[ColumnName]=index
                            }
                        }
                      return ColumnName; 
                    });
                    i++
                    m=true
                }
                if(m){
                    for (let item of data.lineItems){
                           if(item.productName==row[1])
                           {
                            productByRows[item.productName]=i
                           }
                    }
                }
            }
            for(let row of rows){
                // console.log("---------")
                if(row.length<(keys.GST+1)){
                    for(let j=row.length;j<keys.GST;j++){
                    // console.log("adding entry")
                        row.push(" ")
                       }
                }
            }
            // return {keys:keys,productByRows:productByRows,rows:rows}

            let itemCount=data.lineItems.length
            rows[keys.manufacturerDetails-1].push("|","GST","Phone","Comment")
            rows[keys.manufacturerDetails].push(data.manufactureGstNo,data.manufacturePhone?data.manufacturePhone:"NA",data.rfqBidComment?data.rfqBidComment:"NA","|")
            rows[keys.manufacturerDetails+1].push("|","MOQ","Price","_")
            for (let item of data.lineItems){ 
                if(itemCount){
               rows[productByRows[item.productName]].push(item.moq?item.moq:"NA",item.price?item.price:"NA"," ","|")
               itemCount=itemCount-1
                }
         }
            // return {keys:keys,productByRows:productByRows,rows:rows}
            return rows

    }

    async saveRfqSheetDetails(sheetId:any,rfqBid:any){
        let data=await this.mapResearchData(rfqBid,sheetId)
        // return data
        if(data){
        const auth = new google.auth.GoogleAuth({
            keyFile : "./credentials.json",
            scopes : ["https://www.googleapis.com/auth/spreadsheets"],
            });
            const client = await auth.getClient(); 
             const spreadsheetId = sheetId;
            const googleSheets = google.sheets({ version: 'v4', auth: client });
            await googleSheets.spreadsheets.values.clear({
                auth,
                spreadsheetId,
                range: 'Research (Digital)',
              });
          let so=await googleSheets.spreadsheets.values.append({
            auth,
            spreadsheetId,
            range: 'Research (Digital)', 
            valueInputOption: 'RAW',
            resource: {
              values: data,
            },
          });
          return so
        }
        else {
            throw new HttpException({
                status: HttpStatus.EXPECTATION_FAILED,
                error: 'EXPECTATION_FAILED',
                message: "Sheet details Error"
              }, HttpStatus.EXPECTATION_FAILED);
        }
    }
    async saveCrmRfqBid(rfqBid:any){
        let rfqName=rfqBid.rfqId.substring(11)
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        let line_items=Array.prototype.map.call(rfqBid.lineItems, function(item) { return `${item.productName?item.productName:"NA"}[Q-${item.moq?item.moq:"NA"}:P-${item.price?item.price:"NA"}:U-${item.unit?item.unit:"NA"}]`; }).join("|---*---|")
        today = yyyy + '-' + mm + '-' + dd;  
        let crmRfqBid={
            Name:`IN/RFQ-BID-${rfqName}${rfqBid.rfqBidNo}`,
            RFQ_ID:{id:rfqBid.rfqId},
            RFQ_Bid_Date:today,
            RFQ_Bid_No:`${rfqBid.rfqBidNo}`,
            // RFQ_Bid_No:rfqBid.rfqBidNo,
            GST_Number:rfqBid.manufactureGstNo,
            Manufacturer_Email:rfqBid.manufactureEmail?rfqBid.manufactureEmail:"NA@NA.com",
            Manufacturer_Phone:rfqBid.manufacturePhone,
            Line_Items:line_items,
            Comment:rfqBid.rfqBidComment?rfqBid.rfqBidComment:"NA"
        }
        let token=await this.zohoCrmToken()

      
        let out=[]
        out.push(crmRfqBid) 
        let res = await fetch(`https://www.zohoapis.in/crm/v2/RFQ_BID`, {
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          'Authorization':`${token}`,
          'Content-Length':'904',
          'Accept': '*/*',
        },
        // body:JSON.stringify({data: crmRfqBid})
        body:JSON.stringify({data: out})
      })
      .then(r => out=(r.statusText=='No Content'?(r=false):r=r.json()))
      .then(data => out?(out = data):out); ///data returned
    console.log('Post Req Of Crm',out.data[0].code,crmRfqBid);
    // return out
    if(out.data[0].code=='SUCCESS'){
         return out
    }
    else{
        return false
    }
    }
    async zohoCrmToken(){
        let zohoToken = await this.zohoTokenRepository.findOne('63319be175c56440fb23e962')
      let token=zohoToken.token
      // console.log("oldtoken",token)
      let kill
      let res = await fetch(`https://www.zohoapis.in/crm/v2/Deals`, {
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
    //   console.log("kill",kill)
      if(kill.status){
      token=await this.newZohoCrmToken()
      return token
      }
      return token
      }
      
      async newZohoCrmToken(){
        let zohoToken = await this.zohoTokenRepository.findOne('63319be175c56440fb23e962')
        // console.log("zohoToken",zohoToken)
        let zoho = await fetch('https://accounts.zoho.in/oauth/v2/token', {
          method: 'POST',
          headers:{
            'Content-Type': 'application/x-www-form-urlencoded'
          },    
          body: new URLSearchParams({
              'refresh_token':'1000.bba0cbaa752d5db9ce7ebaef7c36b08c.e9b334fe092cf9086374ca38ede24ab0',
              'client_id':'1000.65CF5UIMCB6SZNQ1Z1TU1DA6VCDOZP',
              'client_secret':'52a031a706f9b690694f135702ded10f7af1a44baf',
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
    async getAllCrmRfqDetails(){
        let token=await this.zohoCrmToken()
        let kill
        let res = await fetch(`https://www.zohoapis.in/crm/v2/Deals`, {
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
    //   console.log("kill",kill)
      if(kill.status){
      return "error"
      }
        return kill.data
    }
    async getAllCrmRfqBidsDetails(){
        let token=await this.zohoCrmToken()
        let out
        let res = await fetch(`https://www.zohoapis.in/crm/v2/RFQ_BID`, {
        method:'GET',
        headers:{
          'Content-Type':'application/json',
          'Authorization':`${token}`,
        }  
      })
      .then(r => out=(r.statusText=='No Content'?(r=false):r=r.json()))
      .then(data => out?(out = data):out); ///data returned
    // console.log('rescontact',out);
    // return out
    if(out){
         return out.data
    }
    else{
        return []
    }
    }
    async getOneCrmRfqBidsDetails(id:string){
        console.log(id)
        let token=await this.zohoCrmToken()
        let out
        let res = await fetch(`https://www.zohoapis.in/crm/v2/RFQ_BID/${id}`, {
        method:'GET',
        headers:{
          'Content-Type':'application/json',
          'Authorization':`${token}`,
        }  
      })
      .then(r => out=(r.statusText=='No Content'?(r=false):r=r.json()))
      .then(data => out?(out = data):out); ///data returned
    console.log('rescontact',out);
    // return out
    if(out){
         return out.data
    }
    else{
        return false
    }
    }
    async getOneCrmRfqDetails(id:string){
        let token=await this.zohoCrmToken()
        let kill
        let out
        let res = await fetch(`https://www.zohoapis.in/crm/v2/Deals/${id}`, {
        method:'GET',
        headers:{
          'Content-Type':'application/json',
          'Authorization':`${token}`,
        }  
      })
    //   .then(res=>console.log(res))  
    //   .then(res=>res.json())  
    //   .then(data=> 
    //       kill=data
    //   ); 
      .then(r => out=(r.statusText=='No Content'?(r=false):r=r.json()))
      .then(data => out?(out = data):out); ///data returned
    // console.log('rescontact',out);
    // return out
    if(out){
         return out.data
    }
    else{
        return false
    }
    //   console.log("kill",kill)
   
        // return kill

    }
    async getAllRfqDetails(){
        let data=await this.getAllCrmRfqDetails()
        return data
        let sheetdata=[]
        await data.forEach(async (i) => {
            // console.log(i)
            var url=i.GSheet
            if(url){
            url=url.match(/\/d\/(.+)\//)
            // sheetdata.push(url[1])
            sheetdata.push(await this.getRfqDetails(url[1])) 
            }
            else{ 
            sheetdata.push({id:i.id,rfqName:i.Deal_Name,message:"Gsheet Id Not Found"})
            }
        })
        return sheetdata 
    }
    async getAllRfqBidsDetails(){
        let data=await this.getAllCrmRfqBidsDetails()
        if(data)
        return {statusCode:200,message:"succes",data:data}
        else
        throw new NotFoundException(`No Rfq-bid not found`);
    }
    async getOneRfqBidsDetails(id:string){
        let data=await this.getOneCrmRfqBidsDetails(id)
        if(data)
        return {statusCode:200,message:"succes",data:data}
        else
        throw new NotFoundException(` Rfq-bid not found`);
    }
    async getRfqDetails(rfqId:string){
        let range="RFQ (BD)"
        return await this.getRfqSheetDetails(rfqId,range);
    }
    async RfqDetails(rfqId:string){
        let data=await this.getOneCrmRfqDetails(rfqId)
        if(data&&data.length>0){
            // console.log("Gsheet Link-",data[0].GSheet)
            var url=data[0].GSheet
            if(url){
            url=url.match(/\/d\/(.+)\//)
            let rfqName=rfqId.substring(11)
            let rfq={
            "name":`IN/RFQ-${rfqName}`,
            "id":data[0].id,
            "owner":data[0].Owner,
            "description":data[0].Description,
            "lineItems": await this.getRfqDetails(url[1])
            }
            return {statusCode:200,message:"succes",data:rfq}
            }
            else{ 
            throw new NotFoundException(`RFQ ${data[0].Deal_Name} GSheet ID not found`);
            }
            
            }
            else{
                // throw new NotFoundException(`RFQ with ${rfqId}  not found`);
                throw new NotFoundException(`RFQ with this id not found`);

            }    
    }
    async getAnySheetDetails(sheetId:any,sheetRange:any) {
        const auth = new google.auth.GoogleAuth({
            keyFile : `./credentials.json`,
            scopes : ["https://www.googleapis.com/auth/spreadsheets"],
            });
            const client = await auth.getClient();
            const spreadsheetId = sheetId;        
            const googlesheets = google.sheets({ version: 'v4', auth: client });
            let k= await googlesheets.spreadsheets.values.get(
                {
                     auth:auth,
                     spreadsheetId,
                     range: sheetRange, 
             },
             );
             let out=[]
             let no=0
             let rowObject=[]
            const rows = k.data.values;
            for (const row of rows) {
                if("#"==row[0]){
                    row.map((ColumnName, index) => {
                        ColumnName=ColumnName.replace(/\s+/g,"_");
                        if(index){
                      rowObject.push({"index":index,"ColumnName":ColumnName})
                        }
                      return ColumnName; 
                    });
                    break; 
                }
            }  
            for (const row of rows) {
                if("#"==row[0]){
                   no=1
                }
                else if(no){
                    let dataObj={
                        no:no
                    }
                    for (const obj of rowObject) {
                        dataObj[obj.ColumnName]=row[obj.index]?row[obj.index]:""
                    }
                    out.push(dataObj)
                    no++
                }
            }
            return out
        }
    async getManufacturersSheetDetails(sheetId:any,sheetRange:any) {
        const auth = new google.auth.GoogleAuth({
            keyFile : "./credentials.json",
            scopes : ["https://www.googleapis.com/auth/spreadsheets"], 
            });
            const client = await auth.getClient();
            const spreadsheetId = sheetId;         
            const googlesheets = google.sheets({ version: 'v4', auth: client });
            let k= await googlesheets.spreadsheets.values.get(
                {
                     auth:auth, 
                     spreadsheetId, 
                     range: sheetRange,
             }, 
             );
            let out=[]
            let no=0
            const rows = k.data.values;
            let companyName=0 
            let poc=0
            let category=0
            let pinCode=0
            let email=0
            let mobileNo=0
            let state=0
            let city=0
            let typeOfBusiness=0
            let address=0
            // return rows
            for (const row of rows) {
                if("#"==row[0]){
                    companyName=row.indexOf('Company Name')
                    poc=row.indexOf('POC')
                    category=row.indexOf('Fnb Packaging')
                    pinCode=row.indexOf('Pincode') 
                    email=row.indexOf('Email')   
                    mobileNo=row.indexOf('MobileNo.')
                    state=row.indexOf('State')
                    city=row.indexOf('City') 
                    typeOfBusiness=row.indexOf('Type of Business')
                    address=row.indexOf('Address')
                    no =1
                }
                else if((row[email]&&no&&row[email].indexOf('@')>-1)){
                    out.push({'manufacturerNo':no,'companyName':row[companyName]?row[companyName]:'','poc':row[poc]?row[poc]:'','category':row[category]?row[category]:'','pinCode':row[pinCode]?row[pinCode]:'','email':row[email]?row[email]:'','mobileNo':row[mobileNo]?row[mobileNo]:'','state':row[state]?row[state]:'','city':row[city]?row[city]:'','typeOfBusiness':row[typeOfBusiness]?row[typeOfBusiness]:'','address':row[address]?row[address]:''})
                    no++
                }
            }
            return out
        } 

        async getRfqSheetDetails(sheetId:any,sheetRange:any) { 
            const auth = new google.auth.GoogleAuth({
                keyFile : "./credentials.json",
                scopes : ["https://www.googleapis.com/auth/spreadsheets"],
                });
                const client = await auth.getClient();
                const spreadsheetId = sheetId;        
                const googlesheets = google.sheets({ version: 'v4', auth: client });
                let k= await googlesheets.spreadsheets.values.get(
                    {
                         auth:auth,
                         spreadsheetId,
                         range: sheetRange,
                    // },
                 },
                 );
                let out=[]
                let no=0
                const rows = k.data.values;
                let productName=0
                let rfqQuantity=0
                let category=0
                let units=0
                let specifications=0
                let targetPrice=0
                let salesComment=0
                let opsRemark=0
                // return rows
                for (const row of rows) {
                    if("#"==row[0]){
                        productName=row.indexOf('Product Name')
                        rfqQuantity=row.indexOf('RFQ Quantity')
                        units=row.indexOf('Units')
                        specifications=row.indexOf('Specifications')
                        category=row.indexOf('Category')
                        targetPrice=row.indexOf('Target Price')
                        salesComment=row.indexOf('Sales Comment')
                        opsRemark=row.indexOf('Ops Remark')
                       no=1
                    }
                    else if(no&&row[productName]){
                        out.push({'productNo':no,'productName':row[productName]?row[productName]:'','rfqQuantity':row[rfqQuantity]?row[rfqQuantity]:'','units':row[units]?row[units]:'','specifications':row[specifications]?row[specifications]:'','category':row[category]?row[category]:'','targetPrice':row[targetPrice]?row[targetPrice]:'','salesComment':row[salesComment]?row[salesComment]:'','opsRemark':row[opsRemark]?row[opsRemark]:''})
                        no++
                    }
                }
                return out
            }
            async getManufacturersDetails(){
                let manufactures=await this.getManufacturersSheetDetails("1_6QkmO-Pv9LUUitEtjFkbLedCutGRtfIwdVF0KiJwsQ","DATA for RFQ System")
                if(manufactures)
                 return {statusCode:200,message:"succes",data:manufactures}
                else
                throw new NotFoundException(`No Data found`);
            }
            async rfqSendToManufacturers(lineItems:any) { 
                let manufactures=await this.getManufacturersSheetDetails("1_6QkmO-Pv9LUUitEtjFkbLedCutGRtfIwdVF0KiJwsQ","DATA for RFQ System")
                // return manufactures
                let rfqDetails=[]
                for (const item of lineItems) {
                        let found = rfqDetails.find(element => element.category === item.category);
                        if(found){
                            found.lineItems.push(item)
                        }
                        else {
                            rfqDetails.push({'category':item.category,'lineItems':[item],'manufactureEmail':[],'count':0})
                        }
                }
                // return rfqDetails
                for (const item of rfqDetails) {
                for (const manufacture of manufactures) {
                        if(item.category==manufacture.category){
                            item.manufactureEmail.push(manufacture.email)
                            item.count++
                        }
                }
             }
                return rfqDetails
       
                }
 
                async sendMail(itemData:any,rfqId:string) {
                    // return data
 
                        var mails = itemData.manufactureEmail  
                        itemData.arrayMails=[] 
                        let count=itemData.count
                        for(let i;count>0;i++){  
                            // console.log(count,count/95)
                            if(count/95>1){
                               count=count-94
                            //    console.log(count) 
                              let mail1=mails.splice(0,94)
                              itemData.arrayMails.push(mail1)
                            }
                            else{
                                count=0
                            itemData.arrayMails.push(mails)
                            } 
                        }
               
                    // return data

                    let link ="https://prodo.in/bid/"+rfqId
                    let subject ='New Rfq-Bid Created Check Details Below ';
                    var today = new Date();
                    var dd = String(today.getDate()).padStart(2, '0');
                    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                    var yyyy = today.getFullYear();
                    today = mm + '/' + dd + '/' + yyyy;  
                    let mailOutput=[]
                        for(let emails of  itemData.arrayMails)
                        {
                            
                            let bcc = emails
                            // let bcc=[]
                            bcc.push("mehul.mina@prodo.in")
                            // let bcc = "mehul.mina@prodo.in"
                            let mailTrigger = {
                              from: 'Team Prodo', 
                              // mails: mails,
                              bcc: bcc,
                              subject: subject,
                              template: 'rfqBidTemplate',
                              templatevars: {
                                itemDetails: itemData.lineItems,
                                date:today,
                                rfqLink:link
                              },
                            };
                            await this.mailService.sendBulkMailToManufacturer(mailTrigger)
                            mailOutput.push("Mail sent")
                          }
                     
                  return mailOutput 
                }

                async sendMailManufacturersSurvery() {
                    let manufactures=await this.getManufacturersSheetDetails("1_6QkmO-Pv9LUUitEtjFkbLedCutGRtfIwdVF0KiJwsQ","DATA for RFQ System")
                    let data=[]
                    let m=1
                    for (const itemData of manufactures) {
                        if(itemData.manufacturerNo%95>0){
                            let found = data.find(element => element.id === m);
                            if(found){
                                found.emails.push(itemData.email)
                            }
                            else {
                                data.push({id : m, emails :[itemData.email] });
                            }
                        }
                        else{
                            m++
                            let found = data.find(element => element.id === m);
                            if(found){
                                found.emails.push(itemData.email)
                            }
                            else {
                                data.push({id : m, emails :[itemData.email] });
                            }
                        }
                    }
                    // return manufactures
                    // return data
                    let subject =' Greetings From Prodo!! ';
                    var today = new Date();
                    var dd = String(today.getDate()).padStart(2, '0');
                    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                    var yyyy = today.getFullYear();
                    today = mm + '/' + dd + '/' + yyyy;  
                    let mailOutput=[]
                    for (const itemData of data) {
                        let bcc = itemData.emails
                        // if(itemData.email=="mehul.mina@prodo.in")
                        // {
                            // console.log(itemData)
                            let mailTrigger = {
                                from: 'Team Prodo', 
                                // mails: mails,
                                bcc: bcc,
                                subject: subject,
                                template: 'feedbackSurvey',
                                templatevars: {
                                },
                              };
                              await this.mailService.sendBulkMailToManufacturer(mailTrigger)
                              mailOutput.push("Mail sent")
                        // } 
                    }
                  return mailOutput 
                }

                async sendMailManufacturersWithTemplate(templateName:any,subject:any) {
                    let manufactures=await this.getManufacturersSheetDetails("1_6QkmO-Pv9LUUitEtjFkbLedCutGRtfIwdVF0KiJwsQ","DATA for RFQ System")
                    let data=[]
                    let m=1
                    for (const itemData of manufactures) {
                        if(itemData.manufacturerNo%95>0){
                            let found = data.find(element => element.id === m);
                            if(found){
                                found.emails.push(itemData.email)
                            }
                            else {
                                data.push({id : m, emails :[itemData.email] });
                            }
                        }
                        else{
                            m++
                            let found = data.find(element => element.id === m);
                            if(found){
                                found.emails.push(itemData.email)
                            }
                            else {
                                data.push({id : m, emails :[itemData.email] });
                            }
                        }
                    }
                    // return manufactures
                    // return data
                    // let subject =' Greetings From Prodo!! ';
                    var today = new Date();
                    var dd = String(today.getDate()).padStart(2, '0');
                    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                    var yyyy = today.getFullYear();
                    today = mm + '/' + dd + '/' + yyyy;  
                    let mailOutput=[]
                    for (const itemData of data) {  //remove this
                        let bcc = itemData.emails //remove this
                        // let bcc = ["mehul.mina@prodo.in","abhishek.gupta@prodo.in"] //comment this
                            let mailTrigger = {
                                from: 'Team Prodo', 
                                bcc: bcc,
                                subject: subject,
                                template: templateName,
                                templatevars: {
                                },
                              };
                              await this.mailService.sendBulkMailToManufacturer(mailTrigger)
                              mailOutput.push("Mail sent")
                    }     //remove this
                  return mailOutput 
                }

                async sendWhatsappMessaageManufacturersWithTemplate(templateName:any,image_link?:any) {
                    let manufactures=await this.getManufacturersSheetDetails("1_6QkmO-Pv9LUUitEtjFkbLedCutGRtfIwdVF0KiJwsQ","DATA for RFQ System")
                    let data=[]
                    // let message = await this.whatsappService.sendTemplateMessageManufacturers("9996652719",templateName,image_link)
                    // data.push(message);
                    // return data 

 
                    for (const itemData of manufactures) {
                        if(itemData.mobileNo){
                            let message = await this.whatsappService.sendTemplateMessageManufacturers(itemData.mobileNo,templateName,image_link)
                                data.push(message);
                        }
                    }
                    return data

                }
    async sendWhatsappBid(rfqId:any){
        let manufactures=await this.getManufacturersSheetDetails("1_6QkmO-Pv9LUUitEtjFkbLedCutGRtfIwdVF0KiJwsQ","DATA for RFQ System")
        let out=[]
        for (const itemData of manufactures) {
            if(itemData.mobileNo){
                let w=await this.whatsappService.rfqBidMessage("there",itemData.mobileNo,"rfq_bid_message1",rfqId)
                // let w=await this.whatsappService.rfqBidMessage("there","9996652719","rfq_bid_message5",rfqId)
                out.push(w)
        }
      }
      return out
    }
    async sendWhatsappInstruction(){
        let manufactures=await this.getManufacturersSheetDetails("1_6QkmO-Pv9LUUitEtjFkbLedCutGRtfIwdVF0KiJwsQ","DATA for RFQ System")
        let out=[]
        for (const itemData of manufactures) {
            if(itemData.mobileNo){
                let document_link="https://drive.google.com/uc?export=download&id=1AzNfxnSXoZW-15Ck1yZ0vX2IqWwaYHV1"
                let w1=await this.whatsappService.sendInstructions(itemData.mobileNo,document_link)
                out.push(w1)
        }
      }
      return out
    }
}