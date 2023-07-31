"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const user_entity_1 = require("./../users/user.entity");
const team_entity_1 = require("./../team/team.entity");
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../authentication/jwt-auth.guard");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const fs = require("fs");
var ejs = require('ejs');
const path = require("path");
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'noreply@prodo.in',
        pass: 'Prodo@2022'
    }
});
const mail_service_1 = require("./mail.service");
function SendMail(mailTrigger) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            var templatesDir = `./mailtemplates/${mailTrigger.template}.html`;
            var template = fs.readFileSync(path.resolve(templatesDir), 'utf8');
            if (!mailTrigger.template) {
                return "error in send mail function" + "Template not found";
            }
            let html = ejs.render(template, mailTrigger.templatevars);
            let mailOptions = {
                from: mailTrigger.from + '<noreply@prodo.in>',
                to: mailTrigger.mails,
                subject: mailTrigger.subject,
                template: mailTrigger.template,
                text: mailTrigger.text,
                templatevars: mailTrigger.templatevars,
                html: html
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log("error in send mail function", error);
                    reject("error in send mail function" + error);
                }
                else {
                    console.log('Email sent ' + info.response);
                    resolve('Email sent ' + info.response);
                }
            });
        });
    });
}
let MailController = class MailController {
    constructor(mailService, userRepository, TeamRepository) {
        this.mailService = mailService;
        this.userRepository = userRepository;
        this.TeamRepository = TeamRepository;
    }
    sendMail() {
        const user = {
            id: '5e9f8f9f8f9f8f9f8f9f8f9f8f9f9f9f',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@doe.com',
            password: '123456',
            contactNumber: '1234567890',
            role: 'ADMIN',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const getInTouch = {
            formType: 'Buyer Enquiries',
            formName: 'testnew',
            formData: {
                fullName: 'testnew',
                companyName: 'testnew',
                email: 'gmail@gmail.com',
                mobileNumber: '7988101065',
                message: 'rdfvgbhjn ufyhjbn',
            },
            formSubmittedBy: 'gmail@gmail.com',
        };
        var mailOptions = {
            from: '"Prodo Team" <noreply@prodo.in>',
            to: 'mehul.mina@prodo.in',
            subject: 'Hello',
            template: 'diwaliOffer',
            templatevars: {
                getInTouch: getInTouch,
                context: 'abc',
            },
        };
        return this.mailService.sendMailWithTemplate(mailOptions);
    }
    test() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let bcc = [
                'mehul.mina@prodo.in ',
            ];
            let subject = '100% Customizable Diwali Gifts || Best Bulk Pricing || Best Brands';
            let mailTrigger = {
                from: 'Team Prodo',
                bcc: bcc,
                subject: subject,
                template: 'diwaliOffer',
                templatevars: {
                    context: 'abc',
                },
            };
            return this.mailService.sendBulkMail(mailTrigger);
        });
    }
    customEmail(templatevars, mail, text, subject, from, template) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (mail.length > 0) {
                if (!subject) {
                    throw new common_1.HttpException({
                        status: common_1.HttpStatus.BAD_REQUEST,
                        error: 'ERROR_FIELD <subject:string>',
                        message: "must have subject value",
                    }, common_1.HttpStatus.BAD_REQUEST);
                }
                if (text) {
                    let mailTrigger = {
                        from: from ? from : 'Prodo',
                        mails: mail ? mail : "mehul.mina@prodo.in",
                        subject: subject,
                        template: "textMail",
                        templatevars: {
                            text: text
                        }
                    };
                    return yield SendMail(mailTrigger).then((res1) => {
                        return {
                            status: 'success',
                            message: " Email sent ",
                            data: res1
                        };
                    }).catch((err) => {
                        return {
                            status: 'Error',
                            message: " Error from nodemailer  ",
                            data: err
                        };
                    });
                }
                else {
                    if (!template) {
                        throw new common_1.HttpException({
                            status: common_1.HttpStatus.BAD_REQUEST,
                            error: 'ERROR_FIELD <template:string>',
                            message: "must have template value",
                        }, common_1.HttpStatus.BAD_REQUEST);
                    }
                    let mailTrigger = {
                        from: from ? from : 'Prodo',
                        mails: mail ? mail : "mehul.mina@prodo.in",
                        subject: subject,
                        template: template,
                        text: text ? text : "",
                        templatevars: templatevars ? templatevars : {}
                    };
                    return yield SendMail(mailTrigger).then((res1) => {
                        return {
                            status: 'success',
                            message: " Email sent ",
                            data: res1
                        };
                    }).catch((err) => {
                        return {
                            status: 'Error',
                            message: " Error from nodemailer  ",
                            data: err
                        };
                    });
                }
            }
            else {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.BAD_REQUEST,
                    error: 'ERROR_FIELD <mail:array>',
                    message: "must have mails",
                }, common_1.HttpStatus.BAD_REQUEST);
            }
        });
    }
    newEmployeeEmail(users, mail, subject, from) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!users) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.BAD_REQUEST,
                    error: 'ERROR_FIELD <users:array>',
                    message: "must have users field",
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            if (users.length > 0) {
                let mailTrigger = {
                    from: from ? from : 'Team Prodo',
                    mails: mail ? mail : "mehul.mina@prodo.in",
                    subject: subject ? subject : "New Employee Email",
                    template: 'welcomeMail',
                    text: "",
                    templatevars: {
                        users: users,
                    }
                };
                return yield SendMail(mailTrigger).then((res1) => {
                    return {
                        status: 'success',
                        message: " Email sent ",
                        data: res1
                    };
                }).catch((err) => {
                    console.log("in error");
                    return {
                        status: 'Error',
                        message: " Error from nodemailer  ",
                        data: err
                    };
                });
            }
            else {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.BAD_REQUEST,
                    error: 'ERROR_FIELD <users:array>',
                    message: "must have users",
                }, common_1.HttpStatus.BAD_REQUEST);
            }
        });
    }
    sendBulkEMail(body) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const contacts = body.contacts;
            const mailOption = body.MailOption;
            contacts.forEach((contact) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                mailOption.to = contact.email;
                yield this.mailService.sendMailWithTemplate(mailOption);
            }));
        });
    }
    getMailTemplates() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.mailService.getMailTemplates();
        });
    }
    create_order(body, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let orders = body;
            let user = yield this.userRepository.findOne(req.user.id);
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0');
            var yyyy = today.getFullYear();
            today = mm + '/' + dd + '/' + yyyy;
            let po_list = orders[0].po ? orders[0].po : [];
            let data = {
                user_name: user.firstName + " " + user.lastName,
                user_email: user.email,
                user_contact: user.contactNumber,
                date: today,
                total: orders.length,
                line_items: [],
                po: po_list
            };
            for (let i = 0; i < orders.length; i++) {
                let order1 = orders[i];
                data.line_items.push({
                    "productName": order1.productName,
                    "quantity": order1.qty,
                    "rate": order1.price,
                    "description": order1.description,
                    "id": order1.zohoBooksProductId ? order1.zohoBooksProductId : order1.sku
                });
            }
            let subject = `New Order Created By ${data.user_name}`;
            let team = yield this.TeamRepository.findOne('63188e5149ccf9ab922a2ee2');
            let mails = team.mails;
            let mailTrigger = {
                from: 'Team Prodo',
                mails: mails,
                subject: subject,
                template: 'NewOrderMail',
                templatevars: {
                    data: data,
                },
            };
            return yield this.mailService.sendnewOrderMail(mailTrigger);
        });
    }
};
tslib_1.__decorate([
    common_1.Get(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], MailController.prototype, "sendMail", null);
tslib_1.__decorate([
    common_1.Get('sendbulkmail'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], MailController.prototype, "test", null);
tslib_1.__decorate([
    common_1.Post('customEmail'),
    tslib_1.__param(0, common_1.Body('templatevars')), tslib_1.__param(1, common_1.Body('mail')), tslib_1.__param(2, common_1.Body('text')), tslib_1.__param(3, common_1.Body('subject')), tslib_1.__param(4, common_1.Body('from')), tslib_1.__param(5, common_1.Body('template')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, String, String, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], MailController.prototype, "customEmail", null);
tslib_1.__decorate([
    common_1.Post('newEmployeeEmail'),
    tslib_1.__param(0, common_1.Body('users')), tslib_1.__param(1, common_1.Body('mail')), tslib_1.__param(2, common_1.Body('subject')), tslib_1.__param(3, common_1.Body('from')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], MailController.prototype, "newEmployeeEmail", null);
tslib_1.__decorate([
    common_1.Post('sendBulkEMail'),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MailController.prototype, "sendBulkEMail", null);
tslib_1.__decorate([
    common_1.Get('/getMailTemplates'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], MailController.prototype, "getMailTemplates", null);
tslib_1.__decorate([
    common_1.Post('custom-salesOrder'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Body()), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MailController.prototype, "create_order", null);
MailController = tslib_1.__decorate([
    common_1.Controller('mail'),
    tslib_1.__param(1, typeorm_1.InjectRepository(user_entity_1.User)),
    tslib_1.__param(2, typeorm_1.InjectRepository(team_entity_1.Team)),
    tslib_1.__metadata("design:paramtypes", [mail_service_1.MailService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], MailController);
exports.MailController = MailController;
//# sourceMappingURL=mail.controller.js.map