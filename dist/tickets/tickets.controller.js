"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const tickets_service_1 = require("./tickets.service");
const user_service_1 = require("../users/user.service");
const jwt_auth_guard_1 = require("../authentication/jwt-auth.guard");
let TicketsController = class TicketsController {
    constructor(ticketsService, userService) {
        this.ticketsService = ticketsService;
        this.userService = userService;
    }
    getTickets() {
        return this.ticketsService.AllTickets();
    }
    findOne(email) {
        return this.ticketsService.AllTicketsByMail(email);
    }
    create(email) {
        return this.ticketsService.create(email.email);
    }
    getintouch(getintouch) {
        return this.ticketsService.getintouch(getintouch);
    }
    otherTicket(new_ticket, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            new_ticket.title = "Unregistered";
            new_ticket.type = "Normal User";
            new_ticket = yield this.userService.findCombinedUserData(req.user.id, new_ticket);
            let email = new_ticket.email;
            let name = email.split("@");
            let ticket = {
                subject: `${new_ticket.ticket_type} [${new_ticket.id}]`,
                name: name[0],
                email: new_ticket.email,
                title: new_ticket.title,
                type: new_ticket.type,
                contact: new_ticket.contactNumber,
                message: new_ticket.description,
                type_of_issue: new_ticket.type_of_issue ? new_ticket.type_of_issue : "Query"
            };
            return { Ticket: yield this.ticketsService.otherTicket(ticket), Query: new_ticket };
        });
    }
};
tslib_1.__decorate([
    common_1.Get(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], TicketsController.prototype, "getTickets", null);
tslib_1.__decorate([
    common_1.Get(':email'),
    tslib_1.__param(0, common_1.Param('email')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], TicketsController.prototype, "findOne", null);
tslib_1.__decorate([
    common_1.Post(),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], TicketsController.prototype, "create", null);
tslib_1.__decorate([
    common_1.Post('test'),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], TicketsController.prototype, "getintouch", null);
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Post('help-query'),
    tslib_1.__param(0, common_1.Body()), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TicketsController.prototype, "otherTicket", null);
TicketsController = tslib_1.__decorate([
    common_1.Controller('tickets'),
    tslib_1.__metadata("design:paramtypes", [tickets_service_1.TicketsService,
        user_service_1.UserService])
], TicketsController);
exports.TicketsController = TicketsController;
//# sourceMappingURL=tickets.controller.js.map