"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const user_service_1 = require("../users/user.service");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const token_entity_1 = require("./../sms/token.entity");
const fetch = require('node-fetch');
let TicketsService = class TicketsService {
    constructor(userService, zohoTokenRepository) {
        this.userService = userService;
        this.zohoTokenRepository = zohoTokenRepository;
    }
    getintouch(getintouch) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let token = yield this.tickettoken();
            let contact_check = yield this.getcontactid(getintouch, token);
            let contact_id = contact_check.id;
            let ticket = {
                productId: getintouch.productId ? getintouch.productId : null,
                contactId: contact_id,
                subject: getintouch.subject,
                departmentId: '78228000000010772',
                description: getintouch.message,
                phone: getintouch.contact,
                email: getintouch.email,
                teamId: "78228000000288286",
                cf: {
                    "cf_type_of_issue": getintouch.type_of_issue ? getintouch.type_of_issue : "Get In Touch"
                },
            };
            let result_ticket = yield this.ticketgenerate(ticket, token);
            return result_ticket;
        });
    }
    otherTicket(new_ticket) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let token = yield this.tickettoken();
            let contact_check = yield this.getcontactid(new_ticket, token);
            let contact_id = contact_check.id;
            let ticket = {
                productId: new_ticket.productId ? new_ticket.productId : null,
                contactId: contact_id,
                subject: new_ticket.subject,
                departmentId: '78228000000010772',
                description: new_ticket.message,
                phone: new_ticket.contact,
                email: new_ticket.email,
                teamId: "78228000000288286",
                cf: {
                    "cf_type_of_issue": new_ticket.type_of_issue ? new_ticket.type_of_issue : "Query"
                },
            };
            let result_ticket = yield this.ticketgenerate(ticket, token);
            return result_ticket;
        });
    }
    create(email) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log(email);
            let ticket_token = yield this.tickettoken();
            console.log(ticket_token, 'wait logs for ticket tocke  start here');
            let contact = yield this.getcontactid(email, ticket_token);
            if (!contact) {
                return "No contact";
            }
            console.log(contact, 'contact details');
            let ticket = {
                productId: null,
                contactId: `${contact.id}`,
                subject: 'test',
                departmentId: '78228000000238157',
                description: 'Hai This is Description',
                phone: `${contact.phone}`,
                email: email,
                teamID: "78228000000288286"
            };
            let result_ticket = yield this.ticketgenerate(ticket, ticket_token);
            console.log(result_ticket);
            return result_ticket;
        });
    }
    tickettoken() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let zohoToken = yield this.zohoTokenRepository.findOne('630484493c00a10e2a9d7c6e');
            let token = zohoToken.token;
            let out;
            let res = yield fetch(`https://desk.zoho.in/api/v1/contacts`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                }
            })
                .then(r => out = (r.statusText == 'No Content' ? (r = false) : r = r.json()))
                .then(data => out ? (out = data) : out);
            if (!out) {
                return token;
            }
            if (out.message == 'You are not authenticated to perform this operation.' || out.message == "The OAuth Token you provided is invalid.") {
                token = yield this.newZohoBookTokenFarji();
                return token;
            }
            return token;
        });
    }
    newZohoBookTokenFarji() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let zohoToken = yield this.zohoTokenRepository.findOne('630484493c00a10e2a9d7c6e');
            let zoho = yield fetch('https://accounts.zoho.in/oauth/v2/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    'refresh_token': '1000.2c8d78625f49cc0d5a283fe17a53d9cf.104a7637b55c239b20de013dc8466ca3',
'client_id': '1000.'
                    'client_secret': 'addada9d54cc2d40b6531c6f18e22ec73165990bfe',
                    'grant_type': 'refresh_token'
                })
            });
            zoho = yield zoho.text();
            zoho = JSON.parse(zoho);
            let token = "Zoho-oauthtoken ";
            token = token + zoho.access_token;
            zohoToken.token = token;
            let kill = yield this.zohoTokenRepository.save(zohoToken);
            return token;
        });
    }
    ticketgenerate(ticket, ticket_token) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let kill;
            let sample_ticket = yield fetch('https://desk.zoho.in/api/v1/tickets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${ticket_token}`,
                },
                body: JSON.stringify(ticket),
            })
                .then(r => r.json())
                .then(data => kill = data);
            return kill;
        });
    }
    getcontactid(getintouch, ticket_token) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let kill;
            let out;
            let sample_contact = yield fetch('https://desk.zoho.in/api/v1/contacts?limit=100', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${ticket_token}`,
                },
            })
                .then(r => out = (r.statusText == 'No Content' ? (r = false) : r = r.json()))
                .then(data => out ? (out = data) : out);
            console.log('rescontact', out);
            if (!out) {
                let contact = {
                    "lastName": getintouch.name,
                    "description": getintouch.Description,
                    "phone": Number(getintouch.contact),
                    "email": getintouch.email,
                    "type": getintouch.type,
                    "phone": getintouch.contact,
                    "mobile": getintouch.contact,
                    "title": getintouch.title
                };
                let zoho = yield fetch('https://desk.zoho.in/api/v1/contacts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `${ticket_token}`,
                    },
                    body: JSON.stringify(contact)
                }).then(resp => resp.json())
                    .then(data => kill = data);
                return kill;
            }
            let all_contacts = out.data;
            let obj = all_contacts.find(o => o.email === `${getintouch.email}`);
            if (!obj) {
                let contact = {
                    "lastName": getintouch.name,
                    "description": getintouch.Description,
                    "phone": Number(getintouch.contact),
                    "email": getintouch.email,
                    "type": getintouch.type,
                    "phone": getintouch.contact,
                    "mobile": getintouch.contact,
                    "title": getintouch.title
                };
                let zoho = yield fetch('https://desk.zoho.in/api/v1/contacts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `${ticket_token}`,
                    },
                    body: JSON.stringify(contact)
                }).then(resp => resp.json())
                    .then(data => kill = data);
                return kill;
            }
            else {
                return obj;
            }
        });
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let sample_user = yield this.userService.findByEmail(id);
            let token = yield this.tickettoken();
            let kill;
            let all_contacts = yield fetch(`https://desk.zoho.in/api/v1/contacts`, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`
                }
            }).then(resp => resp.json())
                .then(data => (kill = data));
            let arr_ofresult = kill.data;
            let obj = arr_ofresult.find(o => o.email === id);
            if (obj === undefined) {
                return " well  you'll have to create a ticket for the email";
            }
            else {
                console.log(obj.id);
                let contact_id = obj.id;
                let all_tickets = yield fetch(`https://desk.zoho.in/api/v1/tickets`, {
                    method: 'GET',
                    headers: {
                        Authorization: `${token}`
                    }
                }).then(resp => resp.json())
                    .then(resticket => (kill = resticket));
                console.log(kill, "###5%%%%%%%%%%%%%");
                let ticket_arr = kill.data;
                let obj1 = ticket_arr.find(o => o.contactId === contact_id);
                return obj1;
            }
        });
    }
    getTickets(email) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let ticket_token = yield this.tickettoken();
            let contact = yield this.getcontactid(email, ticket_token);
            if (!contact) {
                return "No contact";
            }
            let result_ticket = yield this.getAllTickets(ticket_token);
            return result_ticket;
        });
    }
    getAllTickets(ticket_token) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let kill;
            let sample_ticket = yield fetch('https://desk.zoho.in/api/v1/tickets', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${ticket_token}`,
                }
            })
                .then(r => r.json())
                .then(data => kill = data);
            return kill;
        });
    }
    AllTickets() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let ticket_token = yield this.tickettoken();
            let result_ticket = yield this.getAllTickets(ticket_token);
            return result_ticket;
        });
    }
    findByMail(email, ticket_token) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let out;
            let sample_contact = yield fetch('https://desk.zoho.in/api/v1/contacts?limit=100', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${ticket_token}`,
                },
            })
                .then(r => out = (r.statusText == 'No Content' ? (r = false) : r = r.json()))
                .then(data => out ? (out = data) : out);
            if (!out) {
                return "No Tickets";
            }
            let all_contacts = out.data;
            let obj = yield all_contacts.find(o => o.email === `${email}`);
            if (!obj) {
                return "No Tickets";
            }
            else {
                return obj;
            }
        });
    }
    findByC_id_all_tickets(c_id, ticket_token) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let kill;
            let sample_ticket = yield fetch(`https://desk.zoho.in/api/v1/contacts/${c_id}/tickets`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${ticket_token}`,
                }
            })
                .then(r => r.json())
                .then(data => kill = data);
            if (kill.errorCode) {
                return {
                    "data": []
                };
            }
            return kill;
        });
    }
    AllTicketsByMail(email) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let ticket_token = yield this.tickettoken();
            let contact = yield this.findByMail(email, ticket_token);
            if (!contact || contact == "No Tickets") {
                return {
                    "data": []
                };
            }
            return yield this.findByC_id_all_tickets(contact.id, ticket_token);
        });
    }
};
TicketsService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(1, typeorm_2.InjectRepository(token_entity_1.zohoToken)),
    tslib_1.__metadata("design:paramtypes", [user_service_1.UserService,
        typeorm_1.Repository])
], TicketsService);
exports.TicketsService = TicketsService;
//# sourceMappingURL=tickets.service.js.map