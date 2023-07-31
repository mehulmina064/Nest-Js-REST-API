"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const node_fetch_1 = require("node-fetch");
let WhatsappService = class WhatsappService {
    constructor() { }
    sendText(Text, contact) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let Message = {
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": `91${contact}`,
                "type": "text",
                "text": {
                    "preview_url": false,
                    "body": Text
                }
            };
            let TextMessage = yield node_fetch_1.default(`https://graph.facebook.com/${process.env.Whatsapp_Api_Version}/${process.env.Whatsapp_Number_Id}/messages`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.Whatsapp_Api_Token}`,
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'Content-Length': '904',
                    'Connection': 'keep-alive'
                },
                body: JSON.stringify(Message)
            });
            TextMessage = yield TextMessage.text();
            TextMessage = JSON.parse(TextMessage);
            return TextMessage;
        });
    }
    sendMultiText(Text, contact) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let Message = {
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": `91${contact}`,
                "type": "text",
                "text": {
                    "preview_url": false,
                    "body": Text
                }
            };
            let TextMessage = yield node_fetch_1.default(`https://graph.facebook.com/${process.env.Whatsapp_Api_Version}/${process.env.Whatsapp_Number_Id}/messages`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.Whatsapp_Api_Token}`,
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'Content-Length': '904',
                    'Connection': 'keep-alive'
                },
                body: JSON.stringify(Message)
            });
            TextMessage = yield TextMessage.text();
            TextMessage = JSON.parse(TextMessage);
            return TextMessage;
        });
    }
    rfqBidMessage(name, contact, templateName, rfqId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log("contact added message sending", contact);
            if (!name) {
                name = "there";
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
                                    "payload": rfqId
                                }
                            ]
                        }
                    ]
                }
            };
            let TextMessage = yield node_fetch_1.default(`https://graph.facebook.com/${process.env.Whatsapp_Api_Version}/${process.env.Whatsapp_Number_Id}/messages`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.Whatsapp_Api_Token}`,
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'Content-Length': '904',
                    'Connection': 'keep-alive'
                },
                body: JSON.stringify(Message)
            });
            TextMessage = yield TextMessage.text();
            TextMessage = JSON.parse(TextMessage);
            if (TextMessage.error) {
                return { error: "Please Check Document Type Or Connect To Admin", contact: contact, message: TextMessage.error.message };
            }
            return { message_ids: TextMessage.messages, contact: contact };
        });
    }
    sendInstructions(contact, doc_link) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log("contact added message sending Instructions", contact);
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
            };
            let TextMessage = yield node_fetch_1.default(`https://graph.facebook.com/${process.env.Whatsapp_Api_Version}/${process.env.Whatsapp_Number_Id}/messages`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.Whatsapp_Api_Token}`,
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'Content-Length': '904',
                    'Connection': 'keep-alive'
                },
                body: JSON.stringify(Message)
            });
            TextMessage = yield TextMessage.text();
            TextMessage = JSON.parse(TextMessage);
            if (TextMessage.error) {
                return { error: "Please Check Document Type Or Connect To Admin", contact: contact, message: TextMessage.error.message };
            }
            return { message_ids: TextMessage.messages, contact: contact };
        });
    }
    sendTemplateMessage(name, contact, templateName, doc_link, doc_name, img_link, video_link, form_link) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log("contact added message sending", contact);
            let Message = {};
            if (doc_link && doc_name) {
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
                };
            }
            else if (img_link) {
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
                };
            }
            else if (video_link) {
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
                };
            }
            else if (form_link) {
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
                };
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
                };
            }
            let TextMessage = yield node_fetch_1.default(`https://graph.facebook.com/${process.env.Whatsapp_Api_Version}/${process.env.Whatsapp_Number_Id}/messages`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.Whatsapp_Api_Token}`,
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'Content-Length': '904',
                    'Connection': 'keep-alive'
                },
                body: JSON.stringify(Message)
            });
            TextMessage = yield TextMessage.text();
            TextMessage = JSON.parse(TextMessage);
            if (TextMessage.error) {
                return { error: "Please Check Document Type Or Connect To Admin", contact: contact, message: TextMessage.error.message };
            }
            return { message_ids: TextMessage.messages, contact: contact };
        });
    }
    sendManufacture(name, contact, doc_link, doc_name) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log("contact added message sending", contact);
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
            };
            let TextMessage = yield node_fetch_1.default(`https://graph.facebook.com/${process.env.Whatsapp_Api_Version}/${process.env.Whatsapp_Number_Id}/messages`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.Whatsapp_Api_Token}`,
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'Content-Length': '904',
                    'Connection': 'keep-alive'
                },
                body: JSON.stringify(Message)
            });
            TextMessage = yield TextMessage.text();
            TextMessage = JSON.parse(TextMessage);
            if (TextMessage.error) {
                console.log("contact sent error", contact);
                return { error: "Please Check Document Type Or Connect To Admin", contact: contact };
            }
            console.log("contact added message sent", contact);
            return { message_ids: TextMessage.messages, contact: contact };
        });
    }
    sendBulkManufacture(body) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let resdata = "All messages sent";
            if (!body.contacts) {
                return { message: "Please provide contacts", status: 400 };
            }
            else if (!(body.contacts.length > 0)) {
                return { message: "Please provide at least one contact", status: 400 };
            }
            if (!body.document_link) {
                return { message: "Please provide document downloadable Link ", status: 400 };
            }
            if (!body.document_name) {
                resdata = "All messages sent but document name is not provided";
            }
            let res = [];
            let contacts = body.contacts;
            for (let i = 0; i < contacts.length; i++) {
                if (contacts[i].name.split(/\W+/).length > 1) {
                    return { message: "Please provide only one word name ", status: 400 };
                }
                if (!contacts[i].contact) {
                    return { message: `Please provide contact details assosiated with ${contacts[i].name} `, status: 400 };
                }
                res.push(yield this.sendManufacture(contacts[i].name, contacts[i].contact, body.document_link, body.document_name ? body.document_name : "Document"));
            }
            return { Response: res, message: resdata, status: 201 };
        });
    }
    formateContacts(contacts) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (contacts) {
                if (contacts.length > 0) {
                    let data = {
                        "contacts": [
                            {
                                "name": "there",
                                "contact": 9996652719
                            }
                        ],
                        "document_link": "",
                        "document_name": ""
                    };
                    for (let i = 0; i < contacts.length; i++) {
                        data.contacts.push({ name: "there", contact: contacts[i].MobileNo });
                    }
                    return data;
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        });
    }
    sendTemplateMessageManufacturers(contact, templateName, image_link) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log("contact added message sending", contact, image_link, templateName);
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
            };
            let TextMessage = yield node_fetch_1.default(`https://graph.facebook.com/${process.env.Whatsapp_Api_Version}/${process.env.Whatsapp_Number_Id}/messages`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.Whatsapp_Api_Token}`,
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'Content-Length': '904',
                    'Connection': 'keep-alive'
                },
                body: JSON.stringify(Message)
            });
            TextMessage = yield TextMessage.text();
            TextMessage = JSON.parse(TextMessage);
            if (TextMessage.error) {
                return { error: "Please Check Document Type Or Connect To Admin", contact: contact, message: TextMessage.error.message };
            }
            return { message_ids: TextMessage.messages, contact: contact };
        });
    }
};
WhatsappService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__metadata("design:paramtypes", [])
], WhatsappService);
exports.WhatsappService = WhatsappService;
//# sourceMappingURL=whatsapp.service.js.map