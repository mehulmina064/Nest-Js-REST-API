import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as path from 'path';
import {existsSync, readFileSync} from 'fs';
import * as fs from 'fs';
import {HttpException,HttpStatus } from '@nestjs/common';
import fetch from 'node-fetch'


@Injectable()
export class WhatsappService {
    constructor(
     
      ) {}
    
 async sendText(Text,contact) {
    // Text= await JSON.stringify(Text)
    let Message = {
        "messaging_product": "whatsapp",    
        "recipient_type": "individual",
        "to": `91${contact}`,
        "type": "text",
        "text": {
            "preview_url": false,
            "body": Text
        }
    }
    // console.log("msg",Message)
    let TextMessage = await fetch(`https://graph.facebook.com/${process.env.Whatsapp_Api_Version}/${process.env.Whatsapp_Number_Id}/messages`, {
        method: 'POST',
        headers:{
         'Authorization':`Bearer ${process.env.Whatsapp_Api_Token}`,
         'Content-Type': 'application/json',
         'Accept': '*/*',
         'Content-Length':'904',
         'Connection':'keep-alive'
       },    
       body:JSON.stringify(Message)
     });
     TextMessage=await TextMessage.text() 
     TextMessage=JSON.parse(TextMessage)
     return TextMessage  
 }

 async sendMultiText(Text:string,contact: any) {
    // Text= await JSON.stringify(Text)
    let Message = {
        "messaging_product": "whatsapp",    
        "recipient_type": "individual",
        "to": `91${contact}`,
        "type": "text",
        "text": {
            "preview_url": false,
            "body": Text
        }
    }
    // console.log("msg",Message)
    let TextMessage = await fetch(`https://graph.facebook.com/${process.env.Whatsapp_Api_Version}/${process.env.Whatsapp_Number_Id}/messages`, {
        method: 'POST',
        headers:{
         'Authorization':`Bearer ${process.env.Whatsapp_Api_Token}`,
         'Content-Type': 'application/json',
         'Accept': '*/*',
         'Content-Length':'904',
         'Connection':'keep-alive'
       },    
       body:JSON.stringify(Message)
     });
     TextMessage=await TextMessage.text() 
     TextMessage=JSON.parse(TextMessage)
     return TextMessage  
 }
 async rfqBidMessage(name:any,contact:any,templateName:any,rfqId:any) {
    console.log("contact added message sending",contact)
    if(!name){
      name="there"
    }
    let Message = { 
        "messaging_product": "whatsapp",
        "to": `91${contact}`,
        "type": "template",
        "template": {
        "name": templateName, 
        "language": { 
         "code": "en"
          },
        "components": [
            {
                "type": "button",
                "sub_type": "url",
                "index": "0",
                "parameters": [
                  {
                    "type": "payload",
                    "payload":rfqId
                  }
                ]
              } 
        ]
        }
    }

    let TextMessage = await fetch(`https://graph.facebook.com/${process.env.Whatsapp_Api_Version}/${process.env.Whatsapp_Number_Id}/messages`, {
        method: 'POST',
        headers:{
         'Authorization':`Bearer ${process.env.Whatsapp_Api_Token}`,
         'Content-Type': 'application/json',
         'Accept': '*/*',
         'Content-Length':'904',
         'Connection':'keep-alive'
       },    
       body:JSON.stringify(Message)
     });
     TextMessage=await TextMessage.text() 
     TextMessage=JSON.parse(TextMessage)
     if(TextMessage.error){
        return {error:"Please Check Document Type Or Connect To Admin",contact:contact,message:TextMessage.error.message}
     }
     return {message_ids:TextMessage.messages,contact:contact}
 }
 async sendInstructions(contact:any,doc_link:any){
  console.log("contact added message sending Instructions",contact)
  let Message = { 
      "messaging_product": "whatsapp",
      "to": `91${contact}`,
      "type": "template",
      "template": {
      "name": 'rfq_bid_instructions', 
      "language": { 
       "code": "en"
        },
      "components": [
        {
          "type": "header",
          "parameters": [
            {
              "type": "document",
              "document": {
                "link": doc_link,
                "filename": 'Quote-Instructions'
              } 
            }
              ]
          }
      ]
      }
  }

  let TextMessage = await fetch(`https://graph.facebook.com/${process.env.Whatsapp_Api_Version}/${process.env.Whatsapp_Number_Id}/messages`, {
      method: 'POST',
      headers:{
       'Authorization':`Bearer ${process.env.Whatsapp_Api_Token}`,
       'Content-Type': 'application/json',
       'Accept': '*/*',
       'Content-Length':'904',
       'Connection':'keep-alive'
     },    
     body:JSON.stringify(Message)
   });
   TextMessage=await TextMessage.text() 
   TextMessage=JSON.parse(TextMessage)
   if(TextMessage.error){
      return {error:"Please Check Document Type Or Connect To Admin",contact:contact,message:TextMessage.error.message}
   }
   return {message_ids:TextMessage.messages,contact:contact}


}

 async sendTemplateMessage(name:any,contact:any,templateName:any,doc_link?:any,doc_name?:any,img_link?:any,video_link?:any,form_link?:any) {
    console.log("contact added message sending",contact)
    let Message={}
    if(doc_link&&doc_name){
        Message = { 
            "messaging_product": "whatsapp",
            "to": `91${contact}`,
            "type": "template",
            "template": {
            "name": templateName, 
            "language": { 
             "code": "en"
              },
            "components": [
                {
                "type": "header",
                "parameters": [
                  {
                    "type": "document",
                    "document": {
                      "link": doc_link,
                      "filename": doc_name
                    }
                  }
                    ]
                },
                {
                    "type": "body",
                    "parameters": [
                      {
                        "type": "text",
                        "text": name
                      },
                      {
                        "type": "text",
                        "text": doc_name
                      }
                    ]
                }
            ]
            }
        }
    }
    else if(img_link){
        Message = { 
            "messaging_product": "whatsapp",
            "to": `91${contact}`,
            "type": "template",
            "template": {
            "name": templateName, 
            "language": { 
             "code": "en"
              },
            "components": [
                {
                "type": "header",
                "parameters": [
                  {
                    "type": "image",
                    "image": {
                      "link": img_link
                    }
                  }
                    ]
                }
            ]
            }
        }
    } 
    else  if(video_link){
        Message = { 
            "messaging_product": "whatsapp",
            "to": `91${contact}`,
            "type": "template",
            "template": {
            "name": templateName, 
            "language": { 
             "code": "en"
              },
            "components": [
                {
                "type": "header",
                "parameters": [
                  {
                    "type": "video",
                    "video": {
                      "link": video_link
                    }
                  }
                    ]
                }
            ]
            }
        }
    } 
    else  if(form_link){
        Message = { 
            "messaging_product": "whatsapp",
            "to": `91${contact}`,
            "type": "template",
            "template": {
            "name": templateName, 
            "language": { 
             "code": "en"
              },
            "components": [
                {
                    "type": "body",
                    "parameters": [
                      {
                        "type": "text",
                        "text": name
                      },
                      {
                        "type": "text",
                        "text": form_link
                      }
                    ]
                }
            ]
            }
        }
    } 
     else {
        Message = { 
            "messaging_product": "whatsapp",
            "to": `91${contact}`,
            "type": "template",
            "template": {
                "name": templateName, 
                "language": { 
                 "code": "en"
                  },
                "components": [
                  {
                    "type": "header",
                    "parameters": [
                        {
                            "type": "text",
                            "text": name
                        }
                    ]
                  }
                ]
            }
        }
    }
    // return Message
    let TextMessage = await fetch(`https://graph.facebook.com/${process.env.Whatsapp_Api_Version}/${process.env.Whatsapp_Number_Id}/messages`, {
        method: 'POST',
        headers:{
         'Authorization':`Bearer ${process.env.Whatsapp_Api_Token}`,
         'Content-Type': 'application/json',
         'Accept': '*/*',
         'Content-Length':'904',
         'Connection':'keep-alive'
       },    
       body:JSON.stringify(Message)
     });
     TextMessage=await TextMessage.text() 
     TextMessage=JSON.parse(TextMessage)
     if(TextMessage.error){
        return {error:"Please Check Document Type Or Connect To Admin",contact:contact,message:TextMessage.error.message}
     }
     return {message_ids:TextMessage.messages,contact:contact}
 }

 async sendManufacture(name:any,contact:any,doc_link:any,doc_name:any) {
    // Text= await JSON.stringify(Text)
    console.log("contact added message sending",contact)
    // return contact
    let Message = { 
        "messaging_product": "whatsapp",
        "to": `91${contact}`,
        "type": "template",
        "template": {
        "name": "manufacturer", 
        "language": { 
         "code": "en_US"
          },
        "components": [
            {
            "type": "header",
            "parameters": [
              {
                "type": "document",
                "document": {
                  "link": doc_link,
                  "filename": doc_name
                }
              }
            ]
          },
            {
                "type": "body",
                "parameters": [
                    {
                        "type": "text",
                        "text": name
                    }
                ]
            }
            ]
        }
    }
    let TextMessage = await fetch(`https://graph.facebook.com/${process.env.Whatsapp_Api_Version}/${process.env.Whatsapp_Number_Id}/messages`, {
        method: 'POST',
        headers:{
         'Authorization':`Bearer ${process.env.Whatsapp_Api_Token}`,
         'Content-Type': 'application/json',
         'Accept': '*/*',
         'Content-Length':'904',
         'Connection':'keep-alive'
       },    
       body:JSON.stringify(Message)
     });
     TextMessage=await TextMessage.text() 
     TextMessage=JSON.parse(TextMessage)
     if(TextMessage.error){
     console.log("contact sent error",contact)

        return {error:"Please Check Document Type Or Connect To Admin",contact:contact}
     }
    console.log("contact added message sent",contact)
     return {message_ids:TextMessage.messages,contact:contact}
 }

 async sendBulkManufacture(body) {
    let resdata="All messages sent"
    if(!body.contacts){
        return {message:"Please provide contacts",status:400}
    }
    else if(!(body.contacts.length>0)){
        return {message:"Please provide at least one contact",status:400}
    }
    if(!body.document_link){
        return {message:"Please provide document downloadable Link ",status:400}
    }
    if(!body.document_name){
        resdata="All messages sent but document name is not provided"
    }
    let res=[]
    let contacts=body.contacts
    for(let i=0;i<contacts.length;i++){
        if(contacts[i].name.split(/\W+/).length > 1){
        return {message:"Please provide only one word name ",status:400}
        }
        if(!contacts[i].contact){
        return {message:`Please provide contact details assosiated with ${contacts[i].name} `,status:400}
        }
        res.push(await this.sendManufacture(contacts[i].name,contacts[i].contact,body.document_link,body.document_name?body.document_name:"Document"))
    }
    return {Response:res,message:resdata,status:201}
}
async formateContacts(contacts) {
    if(contacts){
        if(contacts.length>0){
            let data={
                "contacts":[
                    {
                        "name":"there",
                        "contact":9996652719
                    }
                ],
                "document_link":"",
                "document_name":""
               }
           for(let i=0;i<contacts.length;i++){
              data.contacts.push({name:"there",contact:contacts[i].MobileNo})
           }
           return data
        }
        else{
            return false
        }
    }
    else{
        return false
    }
}


async sendTemplateMessageManufacturers(contact:any,templateName:any,image_link:any) {
    console.log("contact added message sending",contact,image_link,templateName)
    let Message = { 
        "messaging_product": "whatsapp",
        "to": `91${contact}`,
        "type": "template",
        "template": {
        "name": templateName, 
        "language": { 
         "code": "en"
          },
        "components": [
            {
            "type": "header",
            "parameters": [
              {
                "type": "image",
                "image": {
                  "link": image_link
                }
              }
                ]
            }
        ]
        }
    }
    let TextMessage = await fetch(`https://graph.facebook.com/${process.env.Whatsapp_Api_Version}/${process.env.Whatsapp_Number_Id}/messages`, {
        method: 'POST',
        headers:{
         'Authorization':`Bearer ${process.env.Whatsapp_Api_Token}`,
         'Content-Type': 'application/json',
         'Accept': '*/*',
         'Content-Length':'904',
         'Connection':'keep-alive'
       },    
       body:JSON.stringify(Message)
     });
     TextMessage=await TextMessage.text() 
     TextMessage=JSON.parse(TextMessage)
     if(TextMessage.error){
        return {error:"Please Check Document Type Or Connect To Admin",contact:contact,message:TextMessage.error.message}
     }
     return {message_ids:TextMessage.messages,contact:contact}
 }

}