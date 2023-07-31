"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const path = require("path");
const fs_1 = require("fs");
const fs = require("fs");
const ejs_1 = require("ejs");
const common_2 = require("@nestjs/common");
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'noreply@prodo.in',
        pass: 'Prodo@2022'
    }
});
var transporter2 = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'hitarthi.kohli@prodo.in',
        pass: 'prodo@123'
    }
});
let MailService = class MailService {
    getHello() {
        return 'Hello World!';
    }
    sendMail(mailOptions) {
        console.log(mailOptions);
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
            else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
    sendMailWithTemplate(_a) {
        var { template: templateName, templatevars } = _a, Options = tslib_1.__rest(_a, ["template", "templatevars"]);
        var templatesDir = `./mailtemplates/${templateName}.html`;
        var template = fs_1.readFileSync(path.resolve(templatesDir), 'utf8');
        if (templateName && fs_1.existsSync(templatesDir)) {
            const template = fs_1.readFileSync(templatesDir, "utf-8");
            const html = ejs_1.render(template, templatevars);
            var mailOptions = Object.assign({}, Options);
            mailOptions.html = html;
        }
        else {
            console.log('please check your templName or template Dir');
        }
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
            else {
                console.log('Email with Templates sent: ' + info.response);
            }
        });
    }
    getMailTemplates() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const templatesDir = path.resolve('./mailtemplates');
            const files = yield new Promise((resolve, reject) => {
                fs.readdir(templatesDir, (err, files) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(files);
                    }
                });
            });
            return files.filter(file => file.endsWith('.html'));
        });
    }
    sendMailTeam(mailTrigger) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var templatesDir = `./mailtemplates/${mailTrigger.template}.html`;
            var template = fs_1.readFileSync(path.resolve(templatesDir), 'utf8');
            console.log(mailTrigger.template);
            if (!mailTrigger.template) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.FORBIDDEN,
                    error: 'Please provide templateName',
                    message: "Please provide templateName"
                }, common_2.HttpStatus.FORBIDDEN);
            }
            let html = ejs_1.render(template, mailTrigger.templatevars);
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
                    console.log(error);
                }
                else {
                    console.log('Email sent: ' + info.response);
                }
            });
        });
    }
    sendBulkMail(mailTrigger) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var templatesDir = `./mailtemplates/${mailTrigger.template}.html`;
            var template = fs_1.readFileSync(path.resolve(templatesDir), 'utf8');
            console.log(mailTrigger.template);
            if (!mailTrigger.template) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.FORBIDDEN,
                    error: 'Please provide templateName',
                    message: "Please provide templateName"
                }, common_2.HttpStatus.FORBIDDEN);
            }
            let html = ejs_1.render(template, mailTrigger.templatevars);
            let mailOptions = {
                from: mailTrigger.from + '<hitarthi.kohli@prodo.in>',
                replyTo: 'Hitarthi Kohli <hitarthi.kohli@prodo.in>',
                to: mailTrigger.mails ? mailTrigger.mails : 'me <hitarthi.kohli@prodo.in>',
                subject: mailTrigger.subject,
                bcc: mailTrigger.bcc ? mailTrigger.bcc : '',
                template: mailTrigger.template,
                text: mailTrigger.text,
                templatevars: mailTrigger.templatevars,
                html: html
            };
            transporter2.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                }
                else {
                    console.log('Email sent: ' + info.response);
                }
            });
        });
    }
    sendBulkMailToManufacturer(mailTrigger) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var templatesDir = `./mailtemplates/${mailTrigger.template}.html`;
            var template = fs_1.readFileSync(path.resolve(templatesDir), 'utf8');
            if (!mailTrigger.template) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.FORBIDDEN,
                    error: 'Please provide templateName',
                    message: "Please provide templateName"
                }, common_2.HttpStatus.FORBIDDEN);
            }
            let html = ejs_1.render(template, mailTrigger.templatevars);
            let mailOptions = {
                from: mailTrigger.from + '<noreply@prodo.in>',
                replyTo: 'Team Prodo <noreply@prodo.in>',
                to: mailTrigger.mails ? mailTrigger.mails : 'me <noreply@prodo.in>',
                subject: mailTrigger.subject,
                bcc: mailTrigger.bcc ? mailTrigger.bcc : '',
                template: mailTrigger.template,
                text: mailTrigger.text,
                templatevars: mailTrigger.templatevars,
                attachments: [
                    {
                        filename: "Hindi-Instructions.pdf",
                        path: 'https://drive.google.com/uc?export=download&id=14-y6eTAngrM15cLcwdKbeE9TNuJ6dNA4'
                    },
                    {
                        filename: "English-Instructions.pdf",
                        path: 'https://drive.google.com/uc?export=download&id=1AzNfxnSXoZW-15Ck1yZ0vX2IqWwaYHV1'
                    }
                ],
                html: html
            };
            yield transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    return error;
                }
                else {
                    console.log('Email sent: ' + info.response);
                    return 'Email sent: ' + info.response;
                }
            });
        });
    }
    sendnewOrderMail(mailTrigger) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var templatesDir = `./mailtemplates/${mailTrigger.template}.html`;
            var template = fs_1.readFileSync(path.resolve(templatesDir), 'utf8');
            console.log(mailTrigger.template);
            if (!mailTrigger.template) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.FORBIDDEN,
                    error: 'Please provide templateName',
                    message: "Please provide templateName"
                }, common_2.HttpStatus.FORBIDDEN);
            }
            let html = ejs_1.render(template, mailTrigger.templatevars);
            let mailOptions = {
                from: mailTrigger.from + '<noreply@prodo.in>',
                to: mailTrigger.mails,
                subject: mailTrigger.subject,
                bcc: mailTrigger.bcc ? mailTrigger.bcc : '',
                template: mailTrigger.template,
                text: mailTrigger.text,
                templatevars: mailTrigger.templatevars,
                html: html
            };
            yield transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    return "error";
                }
                else {
                    console.log('Email sent: ' + info.response);
                    return ('Email sent: ' + info.response);
                }
            });
        });
    }
    inviteToProdo(userEmail, adminUser, data, institution, inviteId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let link = "https://prodo.in/inviteTest/" + inviteId;
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0');
            var yyyy = today.getFullYear();
            today = mm + '/' + dd + '/' + yyyy;
            let mailTrigger = {
                from: 'noreply@prodo.in',
                to: `${userEmail}`,
                subject: `Invitation for joining ${institution.name} `,
                template: 'inviteTest',
                templatevars: {
                    institution: institution,
                    data: data,
                    role: data.role,
                    adminUser: adminUser,
                    date: today,
                    Link: link,
                    inviteid: inviteId
                },
            };
            var templatesDir = `./mailtemplates/${mailTrigger.template}.html`;
            var template = fs_1.readFileSync(path.resolve(templatesDir), 'utf8');
            let html = ejs_1.render(template, mailTrigger.templatevars);
            var mailOptions = {
                from: 'noreply@prodo.in',
                to: `${userEmail}`,
                subject: `Invitation for joining ${institution.name} `,
                text: `Invite to join the organization ${institution.name} at the role of ${data.role} by  ${adminUser.firstName} (${adminUser.email} .You credentials are email :${userEmail}, and password is ${data.password} password link is provided here => https://prodo.in/`,
                html: html,
                templatevars: mailTrigger.templatevars,
                template: 'inviteTest',
                link: link
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                }
                else {
                    console.log('Email sent: ' + info.response);
                }
            });
        });
    }
    inviteUser(adminUser, user, type, data, institution, inviteId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let link = "https://prodo.in/inviteTest/" + inviteId;
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0');
            var yyyy = today.getFullYear();
            today = mm + '/' + dd + '/' + yyyy;
            if (type == "organization") {
                var mailOptions = {
                    from: 'noreply@prodo.in',
                    to: `${user.email}`,
                    subject: `Invitation for joining the ${type}`,
                    text: `you are invited to the ${type} whose name is ${institution.name} as it's ${data.role} , this invitation is requested from ${adminUser.email}, named  ${adminUser.firstName}`,
                    templatevars: {
                        institution: institution,
                        data: data,
                        role: data.role,
                        adminUser: adminUser,
                        date: today,
                        Link: link,
                        inviteId: inviteId
                    },
                    template: "inviteExisting"
                };
                var templatesDir = `./mailtemplates/${mailOptions.template}.html`;
                var template = fs_1.readFileSync(path.resolve(templatesDir), 'utf8');
                let html = ejs_1.render(template, mailOptions.templatevars);
                var mailTrigger = {
                    from: 'noreply@prodo.in',
                    to: `${user.email}`,
                    subject: `Invitation for joining the ${type}`,
                    text: `you are invited to the ${type} whose name is ${institution.name} as it's ${data.role} , this invitation is requested from ${adminUser.email}, named  ${adminUser.firstName}`,
                    template: "inviteExisting",
                    html: html,
                    templatevars: mailOptions.templatevars,
                    link: link
                };
                transporter.sendMail(mailTrigger, function (error, info) {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        console.log('Email sent: ' + info.response);
                    }
                });
            }
            if (type == "company") {
                var mailOptions = {
                    from: 'noreply@prodo.in',
                    to: `${user.email}`,
                    subject: `Invitation for joining the ${type}`,
                    text: `you are invited to the ${type} whose name is ${institution.name} as it's ${data.role} , this invitation is requested from ${adminUser.email}, named  ${adminUser.firstName}`,
                    templatevars: {
                        institution: institution,
                        data: data,
                        role: data.role,
                        adminUser: adminUser,
                        date: today,
                        Link: link,
                        inviteId: inviteId
                    },
                    template: "inviteExisting"
                };
                var templatesDir = `./mailtemplates/${mailOptions.template}.html`;
                var template = fs_1.readFileSync(path.resolve(templatesDir), 'utf8');
                let html = ejs_1.render(template, mailOptions.templatevars);
                var mailTrigger = {
                    from: 'noreply@prodo.in',
                    to: `${user.email}`,
                    subject: `Invitation for joining the ${type}`,
                    text: `you are invited to the ${type} whose name is ${institution.name} as it's ${data.role} , this invitation is requested from ${adminUser.email}, named  ${adminUser.firstName}`,
                    template: mailOptions.template,
                    html: html,
                    templatevars: mailOptions.templatevars,
                };
                transporter.sendMail(mailTrigger, function (error, info) {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        console.log('Email sent: ' + info.response);
                    }
                });
            }
            if (type == "entity") {
                var mailOptions = {
                    from: 'noreply@prodo.in',
                    to: `${user.email}`,
                    subject: `Invitation for joining the ${type}`,
                    text: `you are invited to the ${type} whose name is ${institution.name} as it's ${data.role} , this invitation is requested from ${adminUser.email}, named  ${adminUser.firstName}`,
                    templatevars: {
                        institution: institution,
                        data: data,
                        role: data.role,
                        adminUser: adminUser,
                        date: today,
                        Link: link,
                        inviteId: inviteId
                    },
                    template: "inviteExisting"
                };
                var templatesDir = `./mailtemplates/${mailOptions.template}.html`;
                var template = fs_1.readFileSync(path.resolve(templatesDir), 'utf8');
                let html = ejs_1.render(template, mailOptions.templatevars);
                var mailTrigger = {
                    from: 'noreply@prodo.in',
                    to: `${user.email}`,
                    subject: `Invitation for joining the ${type}`,
                    text: `you are invited to the ${type} whose name is ${institution.name} as it's ${data.role} , this invitation is requested from ${adminUser.email}, named  ${adminUser.firstName}`,
                    templatevars: {
                        institution: institution,
                        data: data,
                        role: data.role,
                        adminUser: adminUser,
                        date: today,
                        Link: link
                    },
                    template: "inviteExisting",
                    html: html,
                    templatevars: mailOptions.templatevars,
                };
                transporter.sendMail(mailTrigger, function (error, info) {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        console.log('Email sent: ' + info.response);
                        return { 'Email sent ': info.response };
                    }
                });
            }
        });
    }
};
MailService = tslib_1.__decorate([
    common_1.Injectable()
], MailService);
exports.MailService = MailService;
exports.sendMailWithTemplate = function sendMailWithTemplate(_a) {
    var { template: templateName, templatevars } = _a, Options = tslib_1.__rest(_a, ["template", "templatevars"]);
    var templatesDir = `./mailtemplates/${templateName}.html`;
    var template = fs_1.readFileSync(path.resolve(templatesDir), 'utf8');
    var renderedTemplate = ejs_1.render(template, templatevars);
    console.log(renderedTemplate);
    if (templateName && fs_1.existsSync(templatesDir)) {
        const template = fs_1.readFileSync(templatesDir, "utf-8");
        const html = ejs_1.render(template, templatevars);
        var mailOptions = Object.assign({}, Options);
        mailOptions.html = html;
    }
    else {
        console.log('please check your templName or template Dir');
    }
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
        else {
            console.log('Email with Templates sent: ' + info.response);
        }
    });
};
//# sourceMappingURL=mail.service.js.map