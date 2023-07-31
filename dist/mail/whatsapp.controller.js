"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const whatsapp_service_1 = require("./whatsapp.service");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const file_utils_1 = require("./../files/file.utils");
const xlsx = require("xlsx");
let WhatsappController = class WhatsappController {
    constructor(whatsappService) {
        this.whatsappService = whatsappService;
    }
    sendText(body) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!body.contacts) {
                return { message: "Please Provide contacts", status: 400 };
            }
            if (!body.text) {
                return { message: "Please Provide Text Message", status: 400 };
            }
            let res = [];
            let contacts = body.contacts;
            if (contacts.length > 0 && body.text.length > 0) {
                for (let i = 0; i < contacts.length; i++) {
                    res.push(yield this.whatsappService.sendText(body.text, contacts[i]));
                }
            }
            else {
                return { message: "Please Provide contact Details", status: 400 };
            }
            return { Response: res, message: "Message sent" };
        });
    }
    multiText(body) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!body.contacts) {
                return { message: "Please Provide contacts", status: 400 };
            }
            if (!body.text) {
                return { message: "Please Provide Text Message", status: 400 };
            }
            let res = [];
            let contacts = body.contacts;
            if (contacts.length > 0 && body.text.length > 0) {
                for (let i = 0; i < contacts.length; i++) {
                    res.push(yield this.whatsappService.sendMultiText(body.text, contacts[i]));
                }
            }
            else {
                return { message: "Please Provide contact Details", status: 400 };
            }
            return { Response: res, message: "Message sent" };
        });
    }
    rfqBidMessage(body) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let resdata = "All messages sent";
            let status = 201;
            if (!body.contacts) {
                return { message: "Please provide contacts", status: 400 };
            }
            else if (!(body.contacts.length > 0)) {
                return { message: "Please provide at least one contact", status: 400 };
            }
            if (!body.rfqId) {
                return { message: "Please provide rfqId", status: 400 };
            }
            body.templateName = "rfq_bid_message1";
            let res = [];
            let contacts = body.contacts;
            for (let i = 0; i < contacts.length; i++) {
                let ri;
                if (contacts[i].name.split(/\W+/).length > 1) {
                    return { message: "Please provide only one word name ", status: 400 };
                }
                if (!contacts[i].contact) {
                    return { message: `Please provide contact details assosiated with ${contacts[i].name} `, status: 400 };
                }
                ri = yield this.whatsappService.rfqBidMessage(contacts[i].name, contacts[i].contact, body.templateName, body.rfqId);
                if (ri.error && status == 201) {
                    resdata = "error";
                    status = 400;
                }
                res.push(ri);
            }
            return { Response: res, message: resdata, status: status };
        });
    }
    sendTemplateMessage(body) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let resdata = "All messages sent";
            let status = 201;
            if (!body.contacts) {
                return { message: "Please provide contacts", status: 400 };
            }
            else if (!(body.contacts.length > 0)) {
                return { message: "Please provide at least one contact", status: 400 };
            }
            if (!body.templateName) {
                return { message: "Please provide template name ", status: 400 };
            }
            let res = [];
            let contacts = body.contacts;
            for (let i = 0; i < contacts.length; i++) {
                let ri;
                if (contacts[i].name.split(/\W+/).length > 1) {
                    return { message: "Please provide only one word name ", status: 400 };
                }
                if (!contacts[i].contact) {
                    return { message: `Please provide contact details assosiated with ${contacts[i].name} `, status: 400 };
                }
                if (body.document_link) {
                    ri = yield this.whatsappService.sendTemplateMessage(contacts[i].name, contacts[i].contact, body.templateName, body.document_link, body.document_name ? body.document_name : "Document", body.image_link ? body.image_link : false, body.video_link ? body.video_link : false, body.form_link ? body.form_link : false);
                }
                else {
                    ri = yield this.whatsappService.sendTemplateMessage(contacts[i].name, contacts[i].contact, body.templateName, body.document_link ? body.document_link : false, body.document_name ? body.document_name : false, body.image_link ? body.image_link : false, body.video_link ? body.video_link : false, body.form_link ? body.form_link : false);
                }
                if (ri.error && status == 201) {
                    resdata = "error";
                    status = 400;
                }
                res.push(ri);
            }
            return { Response: res, message: resdata, status: status };
        });
    }
    sendBulkManufacture(file, document_link, document_name) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let data = xlsx.readFile(file.path);
            let sheet_name_list = data.SheetNames;
            let contacts = xlsx.utils.sheet_to_json(data.Sheets[sheet_name_list[0]]);
            contacts = yield this.whatsappService.formateContacts(contacts);
            if (contacts) {
                contacts.document_link = document_link ? document_link : "";
                contacts.document_name = document_name ? document_name : "";
                return yield this.whatsappService.sendBulkManufacture(contacts);
            }
            else {
                return { message: "Please Check Data", status: 400 };
            }
        });
    }
};
tslib_1.__decorate([
    common_1.Post("single-line-text"),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], WhatsappController.prototype, "sendText", null);
tslib_1.__decorate([
    common_1.Post("multi-line-text"),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], WhatsappController.prototype, "multiText", null);
tslib_1.__decorate([
    common_1.Post("rfqBid"),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], WhatsappController.prototype, "rfqBidMessage", null);
tslib_1.__decorate([
    common_1.Post("templateMessage"),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], WhatsappController.prototype, "sendTemplateMessage", null);
tslib_1.__decorate([
    common_1.Post('send-bulk-sheet-manufactures'),
    common_1.UseInterceptors(platform_express_1.FileInterceptor('file', {
        storage: multer_1.diskStorage({
            destination: './files',
            filename: file_utils_1.editFileName
        }),
        fileFilter: (req, file, cb) => {
            if (file.mimetype === 'application/vnd.ms-excel' || file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                cb(null, true);
            }
            else {
                cb(null, false);
            }
        }
    })),
    tslib_1.__param(0, common_1.UploadedFile()), tslib_1.__param(1, common_1.Body('document_link')), tslib_1.__param(2, common_1.Body('document_name')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], WhatsappController.prototype, "sendBulkManufacture", null);
WhatsappController = tslib_1.__decorate([
    common_1.Controller('whatsapp'),
    tslib_1.__metadata("design:paramtypes", [whatsapp_service_1.WhatsappService])
], WhatsappController);
exports.WhatsappController = WhatsappController;
//# sourceMappingURL=whatsapp.controller.js.map