"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const get_in_touch_entity_1 = require("./get-in-touch.entity");
const user_service_1 = require("./../users/user.service");
const tickets_service_1 = require("./../tickets/tickets.service");
const crypto = require('crypto');
let GetInTouchService = class GetInTouchService {
    constructor(getInTouchRepository, userService, ticketService) {
        this.getInTouchRepository = getInTouchRepository;
        this.userService = userService;
        this.ticketService = ticketService;
    }
    findAll() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.getInTouchRepository.find();
        });
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.getInTouchRepository.findOne(id);
        });
    }
    save(getInTouch) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let email = getInTouch.formSubmittedBy;
            let name = email.split("@");
            let ticket = {
                subject: `Query [${getInTouch.formType}]`,
                name: name[0],
                email: getInTouch.formSubmittedBy,
                title: getInTouch.formData.companyName ? getInTouch.formData.companyName : getInTouch.formData.investmentInstitute,
                type: "Unregistered User",
                contact: getInTouch.formData.mobileNumber,
                message: getInTouch.formData.message,
                Description: `Name:${getInTouch.formName},Mobile No:${getInTouch.formData.mobileNumber} `
            };
            let user = yield this.userService.findByEmail(email);
            if (user) {
                let data = {
                    type: ""
                };
                data = yield this.userService.findCombinedUserData(user.id, data);
                ticket.type = data.type;
                ticket.title = data.title;
                ticket.contact = data.contactNumber ? data.contactNumber : ticket.contact;
            }
            let ticket_data = yield this.ticketService.getintouch(ticket);
            let prodo_save_data = yield this.getInTouchRepository.save(getInTouch);
            return { Ticket: ticket_data, GetInTouch: prodo_save_data ? prodo_save_data : getInTouch };
        });
    }
    remove(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const user = this.getInTouchRepository.findOne(id).then(result => {
                this.getInTouchRepository.delete(result);
            });
        });
    }
};
GetInTouchService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(get_in_touch_entity_1.GetInTouch)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository,
        user_service_1.UserService,
        tickets_service_1.TicketsService])
], GetInTouchService);
exports.GetInTouchService = GetInTouchService;
//# sourceMappingURL=get-in-touch.service.js.map