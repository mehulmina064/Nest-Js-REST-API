"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const organization_entity_1 = require("./../organization/organization.entity");
const account_entity_1 = require("./../account/account.entity");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user.entity");
const roles_constants_1 = require("../users/roles.constants");
const CryptoJS = require("crypto-js");
const OTP = require("otp-generator");
const xlsx = require("xlsx");
const otp_entity_1 = require("./otp.entity");
const mail_service_1 = require("../mail/mail.service");
const account_entity_2 = require("../account/account.entity");
const organization_entity_2 = require("../organization/organization.entity");
const node_fetch_1 = require("node-fetch");
const mailTrigger_service_1 = require("./../mailTrigger/mailTrigger.service");
const common_2 = require("@nestjs/common");
const http = require("https");
const dashboardData_entity_1 = require("./dashboardData.entity");
const product_service_1 = require("./../product/product.service");
const category_service_1 = require("./../categories/category.service");
const salesOrderReview_entity_1 = require("./salesOrderReview.entity");
const organization_service_1 = require("./../organization/organization.service");
const company_entity_1 = require("../company/company.entity");
const entity_entity_1 = require("../entities/entity.entity");
const tempuser_service_1 = require("../tempuser/tempuser.service");
var ObjectId = require('mongodb').ObjectID;
let UserService = class UserService {
    constructor(userRepository, otpRepository, mailService, organizationService, accountRepository, organizationRepository, dashboardDataRepository, salesOrderReviewRepository, mailTriggerService, productService, categoryService, tempUserService, companyRepository, entityRepository) {
        this.userRepository = userRepository;
        this.otpRepository = otpRepository;
        this.mailService = mailService;
        this.organizationService = organizationService;
        this.accountRepository = accountRepository;
        this.organizationRepository = organizationRepository;
        this.dashboardDataRepository = dashboardDataRepository;
        this.salesOrderReviewRepository = salesOrderReviewRepository;
        this.mailTriggerService = mailTriggerService;
        this.productService = productService;
        this.categoryService = categoryService;
        this.tempUserService = tempUserService;
        this.companyRepository = companyRepository;
        this.entityRepository = entityRepository;
    }
    findByEmail(email) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.findOne({ email });
        });
    }
    findAll(filter) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (filter) {
                console.log("filter exists");
                return yield this.userRepository.find(filter);
            }
            console.log("filter does not exist");
            return yield this.userRepository.find();
        });
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOne(String(id));
            return user;
        });
    }
    findCombinedUserData(id, new_ticket) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOne(String(id));
            if (user) {
                new_ticket.type = user.designation ? `Designation-${user.designation}` : `Designation-${new_ticket.type}`;
                new_ticket.title = user.companyName ? `CompanyName- ${user.companyName}` : `CompanyName-${new_ticket.title}`;
                new_ticket.email = user.email;
                new_ticket.contactNumber = user.contactNumber;
                let org = yield this.organizationRepository.findOne(String(user.organization_id));
                new_ticket.title = `${org.name ? `CompanyName- ${org.name}` : new_ticket.title} [${org.type ? org.type : ""}]`;
                return new_ticket;
            }
            else {
                return new_ticket;
            }
        });
    }
    getUserRoles() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return Object.keys(roles_constants_1.Permission);
        });
    }
    filter(filter) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.find(filter);
        });
    }
    remove(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const order = yield this.userRepository.findOne(id);
            yield this.deleteZohoUser(order);
            yield this.dashboardDataDelete(id);
            yield this.userRepository.delete(id);
            return order;
        });
    }
    dashboardDataDelete(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let res = yield this.dashboardDataRepository.findOne({ userId: id });
            if (res) {
                yield this.dashboardDataRepository.delete(res);
            }
            else {
                return true;
            }
        });
    }
    generateOtp(contactNumber) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const otp = yield OTP.generate(6, { upperCase: false, specialChars: false, alphabets: false });
            yield this.otpRepository.save({ contactNumber, otp });
            return { otp };
        });
    }
    generatePassword() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let pass = yield OTP.generate(8, { upperCase: false, specialChars: false, alphabets: true });
            return pass;
        });
    }
    verifyOtp(contactNumber, otp) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const checkOtp = yield this.otpRepository.findOne({ contactNumber, otp });
            return !!checkOtp;
        });
    }
    assignRoles(id, roles) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOne(id);
            if (!user) {
                throw new Error('User not found');
            }
            console.log(user);
            user.roles = yield [...user.roles, ...roles];
            return yield this.userRepository.save(user);
        });
    }
    addUser(user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const foundUser = yield this.userRepository.findOne({ email: user.email });
            if (foundUser) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.FORBIDDEN,
                    error: 'Forbidden',
                    message: "User already exists"
                }, common_2.HttpStatus.FORBIDDEN);
            }
            else {
                user.password = CryptoJS.HmacSHA1(user.password, 'jojo').toString();
                user.isVerified = false;
                const newUser = yield this.userRepository.save(user);
                return { status: 'success', message: 'User created successfully', data: newUser };
            }
        });
    }
    save(user, account, organization) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const foundUser = yield this.userRepository.findOne({ email: user.email });
            if (foundUser) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.FORBIDDEN,
                    error: 'Forbidden',
                    message: "User already exists"
                }, common_2.HttpStatus.FORBIDDEN);
            }
            console.log("user", user);
            console.log("account", account);
            console.log("organization", organization);
            user.password = CryptoJS.HmacSHA1(user.password, 'jojo').toString();
            var saveUser = yield this.userRepository.save(user);
            var userName = saveUser.firstName + ' ' + saveUser.lastName;
            account.email = user.email;
            var saveAccount = yield this.accountRepository.save(account);
            var saveOrganization = yield this.organizationRepository.save(organization);
            saveUser.accountId = saveAccount.id;
            saveUser.organization_id = String(saveOrganization.id);
            saveOrganization.account_id = saveAccount.id;
            saveOrganization.customerId = String(saveOrganization.id);
            saveOrganization.companyIds = [];
            saveOrganization.entityIds = [];
            saveOrganization.status = organization_entity_1.OrganizationStatus.ACTIVE;
            let zohouser = yield this.zohoWebUserUpload(saveUser);
            console.log("zohouser", zohouser);
            saveUser.status = user_entity_1.UserStatus.ACTIVE;
            yield this.updateData(saveUser);
            yield this.userRepository.save(saveUser);
            yield this.organizationRepository.save(saveOrganization);
            let SMS = {
                flow_id: "62c2c6b528e92365c24410b5",
                sender: "mPRODO",
                short_url: "1 (On) or 0 (Off)",
                mobile: "+91",
                name: "",
                authkey: "366411AamHKyDckoqf6129d4c4P1"
            };
            SMS.mobile = SMS.mobile + user.contactNumber;
            SMS.name = SMS.name + user.firstName;
            const SmsOptions = {
                "method": "POST",
                "hostname": "api.msg91.com",
                "port": null,
                "path": "/api/v5/flow/",
                "headers": {
                    "authkey": "366411AamHKyDckoqf6129d4c4P1",
                    "content-type": "application/JSON"
                }
            };
            let data;
            const rep = yield http.request(SmsOptions, function (res) {
                const chunks = [];
                res.on("data", function (chunk) {
                    chunks.push(chunk);
                });
                res.on("end", function () {
                    const body = Buffer.concat(chunks);
                    data = body.toString();
                    data = JSON.parse(data);
                    console.log(data);
                });
            });
            rep.write(`{\n  \"flow_id\": \"62c2c6b528e92365c24410b5\",\n  \"sender\": \"mPRODO\",\n  \"short_url\": \"1 (On) or 0 (Off)\",\n  \"mobiles\": \"${SMS.mobile}\",\n  \"VAR1\": \"VALUE 1\",\n  \"VAR2\": \"VALUE 2\",\n  \"NAME\":\"${SMS.name}\"\n}`);
            data = {
                type: 'success',
                message: "Message sent successfully"
            };
            console.log(data);
            rep.end();
            let mailOptions = {
                TriggerName: 'NewUser',
                doc: saveUser,
                templatevars: {
                    user: saveUser,
                    account: saveAccount,
                    organization: saveOrganization
                },
            };
            yield this.mailTriggerService.SendMail(mailOptions);
            return {
                "user": saveUser,
                "account": saveAccount,
                "organization": saveOrganization
            };
        });
    }
    update(id, user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (user.roles && user.roles.length > 0) {
                throw new common_2.HttpException({
                    status: 400,
                    error: "You cannot change your own role",
                    message: "You cannot change your own role"
                }, common_2.HttpStatus.BAD_REQUEST);
            }
            let data = yield this.userRepository.update(id, user);
            let saveUser = yield this.userRepository.findOne(id);
            let zohouser = yield this.zohoWebUserUpload(saveUser);
            console.log("zohouser", zohouser);
            return data;
        });
    }
    updatePassword(id, user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            user.currentPassword = CryptoJS.HmacSHA1(user.currentPassword, 'jojo').toString();
            console.log(user);
            const foundUser = yield this.userRepository.findOne(id);
            if (foundUser.password !== user.currentPassword) {
                return { status: 'failure', message: 'Current Password do not match' };
            }
            user.password = CryptoJS.HmacSHA1(user.newPassword, 'jojo').toString();
            user.confirmPassword = CryptoJS.HmacSHA1(user.confirmPassword, 'jojo').toString();
            if (user.password !== user.confirmPassword) {
                return { status: 'failure', message: 'Passwords do not match' };
            }
            return yield this.userRepository.update(id, { password: user.password });
        });
    }
    login(user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            user.password = CryptoJS.HmacSHA1(user.password, 'jojo').toString();
            const criteria = (user.email.indexOf('@') === -1) ? { contactNumber: user.email } : { email: user.email };
            const foundUser = yield this.userRepository.findOne(criteria);
            console.log('foundUser in userService ', foundUser);
            if (foundUser) {
                const pass = foundUser.password;
                if (pass != user.password) {
                    throw new common_2.HttpException({
                        status: 400,
                        error: "Bad Request",
                        message: 'Wrong Password'
                    }, common_2.HttpStatus.BAD_REQUEST);
                }
                foundUser.lastLoginAt = new Date();
                yield this.userRepository.update(foundUser.id, foundUser);
                return { status: 'success', message: 'User logged in successfully', user: foundUser };
            }
            else {
                throw new common_2.HttpException({
                    status: 400,
                    error: "Bad Request",
                    message: 'User not found'
                }, common_2.HttpStatus.BAD_REQUEST);
                return { status: 'failure', message: 'User not found' };
            }
        });
    }
    forgotPassword(email) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let mobile = email;
            const criteria = (email.indexOf('@') === -1) ? (email = "") : (email = email);
            console.log('email', email);
            console.log('mobile', mobile);
            if (email == "") {
                const foundUser = yield this.userRepository.findOne({ contactNumber: mobile });
                console.log('foundUser-by number', foundUser);
                if (foundUser) {
                    let SMS = {
                        authkey: '366411AamHKyDckoqf6129d4c4P1',
                        template_id: '62c2c993686eff1b09630536',
                        mobile: '91'
                    };
                    SMS.mobile = SMS.mobile + mobile;
                    let SmsOptions = {
                        path: `https://api.msg91.com/api/v5/otp?template_id=${SMS.template_id}&mobile=${SMS.mobile}&authkey=${SMS.authkey}`,
                    };
                    console.log('body', SmsOptions.path);
                    let res = yield node_fetch_1.default(SmsOptions.path);
                    res = yield res.text();
                    res = JSON.parse(res);
                    console.log('res', res);
                    if (res.type === "error") {
                        throw new common_2.HttpException({
                            status: 400,
                            error: "Bad Request",
                            message: res.message
                        }, common_2.HttpStatus.FORBIDDEN);
                    }
                    else {
                        throw new common_2.HttpException({
                            status: 200,
                            type: 'success',
                            message: "OTP sent successfully"
                        }, common_2.HttpStatus.OK);
                    }
                }
                else {
                    return { status: 'failure', message: 'User not found' };
                }
            }
            else {
                const foundUser = yield this.userRepository.findOne({ email: email });
                console.log('foundUser', foundUser);
                if (foundUser) {
                    const otp = yield OTP.generate(6, { upperCase: false, specialChars: false, alphabets: false });
                    yield this.otpRepository.save({ email: foundUser.email, otp });
                    let MailOptions = {
                        TriggerName: 'ForgotPassword',
                        doc: foundUser,
                        templatevars: {
                            user: foundUser,
                            otp: otp,
                        },
                    };
                    yield this.mailTriggerService.SendMail(MailOptions);
                    return { status: 'success', message: 'OTP sent to your registered email' };
                }
                else {
                    return { status: 'failure', message: 'User not found' };
                }
            }
        });
    }
    resetPassword(email, otp, password) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let mobile = email;
            const criteria = (email.indexOf('@') === -1) ? (email = "") : (email = email);
            console.log('email', email);
            console.log('mobile', mobile);
            if (email == "") {
                const foundUser = yield this.userRepository.findOne({ contactNumber: mobile });
                if (foundUser) {
                    let SMS = {
                        authkey: '366411AamHKyDckoqf6129d4c4P1',
                        otp: '',
                        mobile: '91'
                    };
                    SMS.mobile = SMS.mobile + mobile;
                    SMS.otp = otp;
                    let SmsOptions = {
                        path: `https://api.msg91.com/api/v5/otp/verify?otp=${SMS.otp}&authkey=${SMS.authkey}&mobile=${SMS.mobile}`,
                    };
                    console.log('sms', SmsOptions);
                    let res = yield node_fetch_1.default(SmsOptions.path);
                    res = yield res.text();
                    res = JSON.parse(res);
                    res.status = res.status;
                    if (res.type === "error") {
                        throw new common_2.HttpException({
                            status: 404,
                            error: res.error,
                            message: res.message
                        }, common_2.HttpStatus.FORBIDDEN);
                    }
                    else {
                        foundUser.password = CryptoJS.HmacSHA1(password, 'jojo').toString();
                        yield this.userRepository.save(foundUser);
                        return { status: 'success', message: 'Password reset successfully' };
                    }
                }
                else {
                    return { status: 'failure', message: 'User not found' };
                }
            }
            else {
                const foundUser = yield this.userRepository.findOne({ email: email });
                if (foundUser) {
                    const checkOtp = yield this.otpRepository.findOne({ email: foundUser.email, otp: otp });
                    console.log('checkOtp', checkOtp);
                    if (checkOtp) {
                        yield this.otpRepository.remove(checkOtp);
                        foundUser.password = CryptoJS.HmacSHA1(password, 'jojo').toString();
                        yield this.userRepository.save(foundUser);
                        return { status: 'success', message: 'Password reset successfully' };
                    }
                    else {
                        return { status: 'failure', message: 'OTP do not match' };
                    }
                }
                else {
                    return { status: 'failure', message: 'User not found' };
                }
            }
        });
    }
    updateOrganizationDomains() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let organizations = yield this.organizationRepository.find({ where: { domain: { $exists: false } } });
            organizations.forEach((organization) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                organization.domains = [organization_entity_1.OrganizationDomain.PROCUREMENT, organization_entity_1.OrganizationDomain.INVENTORY, organization_entity_1.OrganizationDomain.ECOMMERCE];
                let saveOrganization = yield this.organizationRepository.save(organization);
                console.log('saveOrganization', saveOrganization);
            }));
            return { status: 'success', message: 'Organization domains updated successfully' };
        });
    }
    createUser(user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const foundUser = yield this.userRepository.findOne({ email: user.email });
            if (foundUser) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.FORBIDDEN,
                    error: 'Forbidden',
                    message: "User already exists"
                }, common_2.HttpStatus.FORBIDDEN);
            }
            else {
                const newuser = yield this.userRepository.save(user);
                return { status: 'success', message: 'User created successfully', user: newuser };
            }
        });
    }
    addUserToOrganization(user, organizationId, adminUser) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            user.organization_id = organizationId;
            const organization = yield this.organizationRepository.findOne(organizationId);
            user.accountId = adminUser.accountId;
            let account = yield this.accountRepository.findOne(adminUser.accountId);
            let password = yield this.generatePassword();
            console.log('-----------password----', password);
            user.password = CryptoJS.HmacSHA1(password, 'jojo').toString();
            user.createdBy = String(adminUser.id);
            user.isVerified = false;
            console.log('user', user);
            user.roles = [...user.roles, roles_constants_1.UserRole.USER];
            console.log('roles', user.roles);
            const newuser = yield this.userRepository.save(user);
            let zohouser = yield this.zohoWebUserUpload(user);
            console.log("zohouser", user);
            newuser.password = password;
            let mailOptions = {
                TriggerName: 'AddUserToOrganization',
                doc: organization,
                templatevars: {
                    user: newuser,
                    organization: organization,
                    account: account,
                }
            };
            yield this.mailTriggerService.SendMail(mailOptions);
            return { status: 'success', message: 'User added successfully', user: newuser };
        });
    }
    uploadUsers(adminUser, file) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const data = xlsx.readFile(file.path);
            const sheet_name_list = data.SheetNames;
            const userData = xlsx.utils.sheet_to_json(data.Sheets[sheet_name_list[0]]);
            let users = [];
            for (let i = 0; i < userData.length; i++) {
                let user = userData[i];
                let newUser = {
                    "territory_id": [],
                    "permissions": [],
                    "teams": [],
                    "organization_id": "",
                    "firstName": user['First Name'] ? user['First Name'] : 'NA',
                    "lastName": user['Last Name'] ? user['Last Name'] : 'NA',
                    "roles": [
                        "USER",
                        "ADMIN",
                        "CLIENT",
                    ],
                    "designation": "Manager",
                    "companyName": user['Company Name'] ? user['Company Name'] : 'NA',
                    "email": user['Official Email Address'] ? user['Official Email Address'] : 'NA',
                    "password": "",
                    "contactNumber": user['Mobile Number'] ? user['Mobile Number'] : 'NA',
                    "gstin": user['GSTIN'] ? user['GSTIN'] : 'NA',
                    "businessEntityName": user['Entity Name'] ? user['Entity Name'] : 'NA',
                    "businessContactNumber": user['Mobile Number'] ? user['Mobile Number'] : 'NA',
                    "businessRegisteredAddress": user['Billing Address'] ? user['Billing Address'] : 'NA',
                    "businessCity": user['City'] ? user['City'] : 'NA',
                    "businessState": user['State'] ? user['State'] : 'NA',
                    "businessPinCode": user['Pin'] ? user['Pin'] : 'NA',
                    "isActive": true,
                    "isVerified": false,
                    "accountId": ""
                };
                newUser.email = newUser.email.replace(/\s/g, '');
                newUser.password = CryptoJS.HmacSHA1("Hklq783@", 'jojo').toString();
                const foundExistingUser = yield this.userRepository.findOne({ email: newUser.email });
                if (foundExistingUser) {
                    console.log('foundExistingUser', foundExistingUser);
                    newUser.id = foundExistingUser.id;
                    foundExistingUser.email = newUser.email.replace(/\s/g, '');
                    foundExistingUser.updatedAt = new Date();
                    let updatedUser = yield this.userRepository.update(newUser.id, foundExistingUser);
                    users.push(updatedUser);
                    users.push(newUser);
                }
                else {
                    let account = new account_entity_1.Account();
                    account.type = account_entity_2.AccountType.EXTERNAL;
                    let organization = new organization_entity_2.Organization();
                    organization.name = user['Company Name'] ? user['Company Name'] : 'NA';
                    organization.type = organization_entity_1.OrganizationType.CLIENT;
                    organization.domains = [organization_entity_1.OrganizationDomain.PROCUREMENT, organization_entity_1.OrganizationDomain.ECOMMERCE, organization_entity_1.OrganizationDomain.INVENTORY, organization_entity_1.OrganizationDomain.SUPPLIER, organization_entity_1.OrganizationDomain.ADMIN];
                    newUser.createdAt = new Date();
                    let saveUser = yield this.saveForzoho(newUser, account, organization);
                    users.push(saveUser);
                }
            }
            return { status: 'success', message: 'Users uploaded successfully', users: users };
        });
    }
    saveForzoho(user, account, organization) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const foundUser = yield this.userRepository.findOne({ email: user.email });
            if (foundUser) {
                return { status: 'failure', message: 'User already exists' };
            }
            var saveAccount = yield this.accountRepository.save(account);
            var saveOrganization = yield this.organizationRepository.save(organization);
            user.accountId = saveAccount.id;
            user.organization_id = String(saveOrganization.id);
            saveOrganization.account_id = saveAccount.id;
            var saveUser = yield this.userRepository.save(user);
            yield this.organizationRepository.save(saveOrganization);
            return {
                "user": saveUser,
                "account": saveAccount,
                "organization": saveOrganization
            };
        });
    }
    getUserCount(organizationId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.findAll({ where: { organization_id: organizationId } }).then(userCount => {
                return userCount[1];
            });
        });
    }
    addPermission(user, permission) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const foundUser = yield this.userRepository.findOne({ id: user.id });
            if (foundUser) {
                foundUser.permissions.push(permission);
                const updatedUser = yield this.userRepository.save(foundUser);
                return { status: 'success', message: 'Permission added successfully', user: updatedUser };
            }
            else {
                return { status: 'failure', message: 'User not found' };
            }
        });
    }
    removePermission(user, permission) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const foundUser = yield this.userRepository.findOne({ id: user.id });
            if (foundUser) {
                const index = foundUser.permissions.indexOf(permission);
                if (index > -1) {
                    foundUser.permissions.splice(index, 1);
                }
                const updatedUser = yield this.userRepository.save(foundUser);
                return { status: 'success', message: 'Permission removed successfully', user: updatedUser };
            }
            else {
                return { status: 'failure', message: 'User not found' };
            }
        });
    }
    getPermissions(user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const foundUser = yield this.userRepository.findOne({ id: user.id });
            if (foundUser) {
                return { status: 'success', message: 'Permissions fetched successfully', permissions: foundUser.permissions };
            }
            else {
                return { status: 'failure', message: 'User not found' };
            }
        });
    }
    updateTeam(user, teamName) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const foundUser = yield this.findByEmail(user.email);
            if (foundUser) {
                if (foundUser.teams.includes(teamName)) {
                    return { status: 'failure', message: 'Team already exists' };
                }
                foundUser.teams.push(teamName);
                const updatedUser = yield this.userRepository.save(foundUser);
                return { status: 'success', message: 'Team updated successfully', user: updatedUser };
            }
            else {
                return { status: 'failure', message: 'User not found' };
            }
        });
    }
    checkTeam(user, teamName) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const foundUser = yield this.findByEmail(user.email);
            if (foundUser) {
                if (foundUser.teams.includes(teamName)) {
                    return true;
                }
                return false;
            }
            else {
                return { status: 'failure', message: 'User not found' };
            }
        });
    }
    removeTeam(user, teamName) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const foundUser = yield this.findByEmail(user.email);
            if (foundUser) {
                const index = foundUser.teams.indexOf(teamName);
                if (index > -1) {
                    foundUser.teams.splice(index, 1);
                }
                const updatedUser = yield this.userRepository.save(foundUser);
                return { status: 'success', message: 'Team removed successfully', user: updatedUser };
            }
            else {
                return { status: 'failure', message: 'User not found' };
            }
        });
    }
    getTeams(user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const foundUser = yield this.findByEmail(user.email);
            if (foundUser) {
                return { status: 'success', message: 'Teams fetched successfully', teams: foundUser.teams };
            }
            else {
                return { status: 'failure', message: 'User not found' };
            }
        });
    }
    getTeamMembers(teamName) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const foundTeam = yield this.teamRepository.findOne({ name: teamName });
            if (foundTeam) {
                return { status: 'success', message: 'Team members fetched successfully', teamMembers: foundTeam.members };
            }
            else {
                return { status: 'failure', message: 'Team not found' };
            }
        });
    }
    changeTeamName(user, oldTeamName, newTeamName) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const fuser = yield this.findByEmail(user.email);
            if (fuser) {
                const index = fuser.teams.indexOf(oldTeamName);
                if (index > -1) {
                    fuser.teams.splice(index, 1);
                }
                fuser.teams.push(newTeamName);
                const updatedUser = yield this.userRepository.save(fuser);
                return { status: 'success', message: 'Team Name Update successfully', user: updatedUser };
            }
            else {
                return { status: 'failure', message: 'User not found' };
            }
        });
    }
    zohoToken() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let zoho = yield node_fetch_1.default('https://accounts.zoho.in/oauth/v2/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    'refresh_token': '1000.c236170cf7209060b3760ad60ba68035.5fd6722cf25268cb92f26e3417e3fd19',
                    'client_id': '1000.',
                    'client_secret': 'a106415659f7c06d2406f446068c1739e81174c2b7',
                    'grant_type': 'refresh_token'
                })
            });
            zoho = yield zoho.text();
            zoho = JSON.parse(zoho);
            let token = "Zoho-oauthtoken ";
            token = token + zoho.access_token;
            return token;
        });
    }
    deleteZohoUser(puser) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let user = puser;
            let Ac_id = typeorm_2.ObjectID;
            Ac_id = user.accountId;
            const account = yield this.accountRepository.findOne(Ac_id);
            let Organization_id = typeorm_2.ObjectID;
            Organization_id = user.organization_id;
            const organization = yield this.organizationRepository.findOne(Organization_id);
            console.log(typeof user.roles);
            let Roles;
            if (typeof user.roles === 'object') {
                Roles = user.roles.join(',');
            }
            else if (typeof user.roles === 'string') {
                Roles = user.roles;
            }
            let Teams = user.teams.join(',');
            let Organization_Domains = organization.domains.join(',');
            let zohoUserObject = {
                Email: user.email,
                Account_Type: account.type,
                Name: user.id,
                ContactNumber: JSON.stringify(user.contactNumber),
                Teams: Teams,
                id: user.id,
                IsVerified: user.isVerified,
                Organization_Domains: Organization_Domains,
                Account_id: account.id,
                Organization_id: user.organization_id,
                Organization_Name: organization.name,
                FirstName: user.firstName,
                Roles: Roles,
                Organization_Type: organization.type,
                LastName: user.lastName
            };
            let out = [];
            out.push(zohoUserObject);
            let token = yield this.zohoToken();
            let zoho1 = yield node_fetch_1.default('https://www.zohoapis.in/crm/v2/WebUsers', {
                method: 'POST',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'Content-Length': '904'
                },
                body: JSON.stringify({ data: out })
            });
            zoho1 = yield zoho1.text();
            zoho1 = JSON.parse(zoho1);
            let id = zoho1.data[0].details.id;
            let zoho2 = yield node_fetch_1.default(`https://www.zohoapis.in/crm/v2/WebUsers/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'Content-Length': '904'
                },
                body: JSON.stringify({ data: out })
            });
            zoho2 = yield zoho2.text();
            zoho2 = JSON.parse(zoho2);
            console.log("zoho product put", zoho2.data);
            return zoho2;
        });
    }
    zohoCrmUser(item, token) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let out = [];
            out.push(item);
            let zoho1 = yield node_fetch_1.default('https://www.zohoapis.in/crm/v2/WebUsers', {
                method: 'POST',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'Content-Length': '904'
                },
                body: JSON.stringify({ data: out })
            });
            zoho1 = yield zoho1.text();
            zoho1 = JSON.parse(zoho1);
            console.log("zoho product post", zoho1);
            if (zoho1.data[0].code == "SUCCESS") {
                return zoho1;
            }
            else if (zoho1.data[0].code == "DUPLICATE_DATA") {
                let id = zoho1.data[0].details.id;
                console.log("id", id);
                console.log("duplicate data", token);
                let zoho2 = yield node_fetch_1.default(`https://www.zohoapis.in/crm/v2/WebUsers/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `${token}`,
                        'Content-Type': 'application/json',
                        'Accept': '*/*',
                        'Content-Length': '904'
                    },
                    body: JSON.stringify({ data: out })
                });
                zoho2 = yield zoho2.text();
                zoho2 = JSON.parse(zoho2);
                console.log("zoho product put", zoho2.data);
                return zoho2;
            }
            else if (zoho1.data[0].code == "INVALID_DATA") {
                console.log("invalid data", zoho1.data[0].details);
                console.log("data", { data: out });
                return item;
            }
            if (zoho1.data[0].code == "INVALID_TOKEN") {
                console.log("invalid token", zoho1.data[0].details);
                return "INVALID_TOKEN";
            }
        });
    }
    zohoWebUserUpload(user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let token = yield this.zohoToken();
            let Ac_id = typeorm_2.ObjectID;
            Ac_id = user.accountId;
            const account = yield this.accountRepository.findOne(Ac_id);
            let Organization_id = typeorm_2.ObjectID;
            Organization_id = user.organization_id;
            const organization = yield this.organizationRepository.findOne(Organization_id);
            console.log(typeof user.roles);
            let Roles;
            if (typeof user.roles === 'object') {
                Roles = user.roles.join(',');
            }
            else if (typeof user.roles === 'string') {
                Roles = user.roles;
            }
            let Teams = user.teams.join(',');
            let Organization_Domains = organization.domains.join(',');
            let zohoUserObject = {
                Email: user.email,
                Account_Type: account.type,
                Name: user.id,
                ContactNumber: JSON.stringify(user.contactNumber),
                Teams: Teams,
                id: user.id,
                IsVerified: user.isVerified,
                Organization_Domains: Organization_Domains,
                Account_id: account.id,
                Organization_id: user.organization_id,
                Organization_Name: organization.name,
                FirstName: user.firstName,
                Roles: Roles,
                Organization_Type: organization.type,
                LastName: user.lastName
            };
            console.log(zohoUserObject);
            let res1 = yield this.zohoCrmUser(zohoUserObject, token);
            return res1;
        });
    }
    zohoWebUsersUpload() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let token = yield this.zohoToken();
            const users = yield this.userRepository.find();
            let res = [];
            for (let i = 0; i < users.length; i++) {
                let user = users[i];
                let Ac_id = typeorm_2.ObjectID;
                Ac_id = user.accountId;
                const account = yield this.accountRepository.findOne(Ac_id);
                let Organization_id = typeorm_2.ObjectID;
                Organization_id = user.organization_id;
                const organization = yield this.organizationRepository.findOne(Organization_id);
                console.log(typeof user.roles);
                let Roles;
                if (typeof user.roles === 'object') {
                    Roles = user.roles.join(',');
                }
                else if (typeof user.roles === 'string') {
                    Roles = user.roles;
                }
                let Teams = user.teams.join(',');
                let Organization_Domains = organization.domains.join(',');
                let zohoUserObject = {
                    Email: user.email,
                    Account_Type: account.type,
                    Name: user.id,
                    ContactNumber: JSON.stringify(user.contactNumber),
                    Teams: Teams,
                    id: user.id,
                    IsVerified: user.isVerified,
                    Organization_Domains: Organization_Domains,
                    Account_id: account.id,
                    Organization_id: user.organization_id,
                    Organization_Name: organization.name,
                    FirstName: user.firstName,
                    Roles: Roles,
                    Organization_Type: organization.type,
                    LastName: user.lastName
                };
                console.log(zohoUserObject);
                let res1 = yield this.zohoCrmUser(zohoUserObject, token);
                if (res1 == "INVALID_TOKEN") {
                    token = yield this.zohoToken();
                    let res1 = yield this.zohoCrmUser(zohoUserObject, token);
                }
                res.push(res1);
            }
            return res;
        });
    }
    userdashboardData(user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (user.roles.includes('PRODO_ADMIN')) {
                let res = yield this.dashboardDataRepository.findOne('62ef33a6aa3b932525b5ef27');
                if (res) {
                    return res.data;
                }
                else {
                    return "NA";
                }
            }
            else {
                let res = yield this.dashboardDataRepository.findOne({ userId: user.id });
                if (res) {
                    return res.data;
                }
                else {
                    return "NA";
                }
            }
        });
    }
    calDashboardData(user, salesOrders) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (user.roles.includes('PRODO_ADMIN')) {
                let res = yield this.dashboardDataRepository.findOne('62ef33a6aa3b932525b5ef27');
                if (res) {
                    let data = yield this.d_data_update(res.data, salesOrders);
                    console.log("in cal after d data dashboard mid", data);
                    data = yield this.updatepieChart(data);
                    res.data = data;
                    return yield this.dashboardDataRepository.update('62ef33a6aa3b932525b5ef27', res);
                }
                else {
                    let d_data = {
                        userId: '62e978c437a104c778675a82',
                        data: {
                            orders: {
                                total: 0,
                                completed: 0,
                                inProgress: 0,
                                submitted: 0,
                                cancelled: 0
                            },
                            rfq: {
                                approved: 0,
                                rejected: 0,
                                inProgress: 0,
                                total_submitted: 0,
                            },
                            payments: {
                                total: 0,
                                paid: 0,
                                due: 0,
                            },
                            pieChart: [],
                            barChart: []
                        }
                    };
                    d_data.data = yield this.d_data_update(d_data.data, salesOrders);
                    console.log("in cal after d data dashboard mid", d_data.data);
                    d_data.data = yield this.updatepieChart(d_data.data);
                    return yield this.dashboardDataRepository.save(d_data);
                }
            }
            else {
                let res = yield this.dashboardDataRepository.findOne({ userId: `${user.id}` });
                if (res) {
                    let data = yield this.d_data_update(res.data, salesOrders);
                    console.log("res-else after d-data");
                    data = yield this.updatepieChart(data);
                    console.log("res-else after update");
                    res.data = data;
                    let m = yield this.dashboardDataRepository.update(res.id, res);
                    console.log("in cal dashboard res", res);
                    return m;
                }
                else {
                    let d_data1 = {
                        userId: `${user.id}`,
                        data: {
                            orders: {
                                total: 0,
                                completed: 0,
                                inProgress: 0,
                                submitted: 0,
                                cancelled: 0
                            },
                            rfq: {
                                approved: 0,
                                rejected: 0,
                                inProgress: 0,
                                total_submitted: 0,
                            },
                            payments: {
                                total: 0,
                                paid: 0,
                                due: 0,
                            },
                            pieChart: [],
                            barChart: []
                        }
                    };
                    if (salesOrders.length > 0) {
                        d_data1.data = yield this.d_data_update(d_data1.data, salesOrders);
                        console.log("in cal dashboard mid d_data update");
                        console.log("in cal after d data dashboard mid", d_data1.data);
                        d_data1.data = yield this.updatepieChart(d_data1.data);
                    }
                    console.log("in cal dashboard mid d_data");
                    return yield this.dashboardDataRepository.save(d_data1);
                }
            }
        });
    }
    d_data_update(data, orders) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let current_date = new Date();
            if (data.barChart.length < 1) {
                for (let i = 0; i < 8; i++) {
                    let date = new Date(current_date.getFullYear(), current_date.getMonth() - i, 1);
                    let month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
                    data.barChart.push({ name: month, value: Number(0) });
                }
            }
            console.log("in d_data_update mid");
            var bar = new Promise((resolve, reject) => {
                orders.forEach((C, i, array) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    data.orders.total++;
                    data.orders.submitted++;
                    if (C.paid_status == "unpaid") {
                        data.payments.due += Number(C.total);
                    }
                    else {
                        data.payments.paid += Number(C.total) || 0;
                    }
                    data.payments.total += Number(C.total) || 0;
                    if (C.status === 'fulfilled') {
                        data.orders.completed++;
                    }
                    else {
                        data.orders.inProgress++;
                    }
                    let a;
                    for (a of C.details.line_items) {
                        if (a.sku.startsWith('.')) {
                            a.sku = a.sku.substring(1);
                        }
                        let product = yield this.productService.getProductBySku(a.sku);
                        if (product) {
                            let found = data.pieChart.find(element => element.name == product.categoryId.toString());
                            if (found) {
                                found.value += Number(a.item_total) || 0;
                            }
                            else {
                                data.pieChart.push({ name: product.categoryId, value: Number(a.quantity) });
                            }
                        }
                        else {
                            let found = data.pieChart.find(element => element['name'] == "Others".toString());
                            if (found) {
                                found.value += Number(a.item_total) || 0;
                            }
                            else {
                                data.pieChart.push({ name: 'Others', value: Number(a.item_total) });
                            }
                        }
                    }
                    let date = new Date(C.date);
                    let month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
                    let foundBar = data.barChart.find(element => element.name === month);
                    if (foundBar) {
                        foundBar.value += Number(C.total) || 0;
                    }
                    else {
                        data.barChart.push({ C: month, value: Number(C.total) });
                    }
                    if (orders.length - 1 === i) {
                        resolve(data);
                    }
                }));
            });
            return bar;
        });
    }
    updatepieChart(data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let pieChart = data.pieChart;
            let pieChartArray = [];
            for (let i = 0; i < pieChart.length; i++) {
                pieChartArray.push(pieChart[i]);
            }
            for (let i = 0; i < pieChartArray.length; i++) {
                if (pieChartArray[i].name !== "Others" && pieChartArray[i].name !== "Uniform & Work Accessories" && pieChartArray[i].name !== "F&B Products" && pieChartArray[i].name !== "Housekeeping" && pieChartArray[i].name !== "Packaging" && pieChartArray[i].name !== "Corporate Gifting" && pieChartArray[i].name !== "Electronics & Electricals" && pieChartArray[i].name !== "Safety & Wellness") {
                    let product = pieChartArray[i].name.toString();
                    pieChartArray[i].name = yield this.categoryService.categoryName(product);
                }
            }
            var holder = {};
            pieChartArray.forEach(function (d) {
                if (holder.hasOwnProperty(d.name)) {
                    holder[d.name] = holder[d.name] + d.value;
                }
                else {
                    holder[d.name] = d.value;
                }
            });
            var obj2 = [];
            for (var prop in holder) {
                obj2.push({ name: prop, value: holder[prop] });
            }
            data.pieChart = obj2;
            return data;
        });
    }
    setPieChartCategory(data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var bar = yield new Promise((resolve, reject) => {
                data.forEach((C, i, array) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    if (C.name !== "Others" && C.name !== "Uniform & Work Accessories" && C.name !== "F&B Products" && C.name !== "Housekeeping" && C.name !== "Packaging" && C.name !== "Corporate Gifting" && C.name !== "Electronics & Electricals" && C.name !== "Safety & Wellness") {
                        let product = C.name.toString();
                        C.name = yield this.categoryService.categoryName(product);
                    }
                    if (data.length - 1 === i) {
                        resolve(data);
                    }
                }));
            });
            return bar;
        });
    }
    createNewsaleOrder(user, salesOrder) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let res = yield this.dashboardDataRepository.findOne('62ef33a6aa3b932525b5ef27');
            res.data.orders.total++;
            res.data.orders.submitted++;
            if (salesOrder.paid_status == "unpaid") {
                res.data.payments.due += Number(salesOrder.total);
            }
            else {
                res.data.payments.paid += Number(salesOrder.total) || 0;
            }
            res.data.payments.total += Number(salesOrder.total) || 0;
            yield this.dashboardDataRepository.update('62ef33a6aa3b932525b5ef27', res);
            console.log("added for admin data");
            let res1 = yield this.dashboardDataRepository.findOne({ userId: user.id });
            res1.data.orders.total++;
            res1.data.orders.submitted++;
            if (salesOrder.paid_status == "unpaid") {
                res1.data.payments.due += Number(salesOrder.total);
            }
            else {
                res1.data.payments.paid += Number(salesOrder.total) || 0;
            }
            res1.data.payments.total += Number(salesOrder.total) || 0;
            yield this.dashboardDataRepository.update(res.id, res1);
            return "added for user data and admin data";
        });
    }
    calDashboardData1(user, salesOrders) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (user.roles.includes('PRODO_ADMIN')) {
                let res = yield this.dashboardDataRepository.findOne('62ef33a6aa3b932525b5ef27');
                if (res) {
                    let d_data = {
                        userId: '62e978c437a104c778675a82',
                        data: {
                            orders: {
                                total: 0,
                                completed: 0,
                                inProgress: 0,
                                submitted: 0,
                                cancelled: 0
                            },
                            rfq: {
                                approved: 0,
                                rejected: 0,
                                inProgress: 0,
                                total_submitted: 0,
                            },
                            payments: {
                                total: 0,
                                paid: 0,
                                due: 0,
                            },
                            pieChart: [],
                            barChart: []
                        }
                    };
                    d_data.data = yield this.d_data_update(d_data.data, salesOrders);
                    d_data.data = yield this.updatepieChart(d_data.data);
                    return yield this.dashboardDataRepository.update('62ef33a6aa3b932525b5ef27', d_data);
                }
                else {
                    return "user not admin";
                }
            }
            else {
                let res = yield this.dashboardDataRepository.findOne({ userId: `${user.id}` });
                console.log("normal", res);
                if (res) {
                    let d_data1 = {
                        userId: `${user.id}`,
                        data: {
                            orders: {
                                total: 0,
                                completed: 0,
                                inProgress: 0,
                                submitted: 0,
                                cancelled: 0
                            },
                            rfq: {
                                approved: 0,
                                rejected: 0,
                                inProgress: 0,
                                total_submitted: 0,
                            },
                            payments: {
                                total: 0,
                                paid: 0,
                                due: 0,
                            },
                            pieChart: [],
                            barChart: []
                        }
                    };
                    d_data1.data = yield this.d_data_update(d_data1.data, salesOrders);
                    console.log("hello d data update", d_data1);
                    d_data1.data = yield this.updatepieChart(d_data1.data);
                    console.log("hello piechart update", d_data1);
                    return yield this.dashboardDataRepository.update(res.id, d_data1);
                }
                else {
                    return "user have no orders";
                }
            }
        });
    }
    allDashboardData() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let res = yield this.dashboardDataRepository.find();
            return res;
        });
    }
    salesOrderReview(sup) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let user_id = sup.user_id;
            let item_id = sup.zohoId;
            let prodo_id = sup.prodoId;
            let comment = sup.comment;
            let rating = sup.rating;
            let package_Id = sup.packageId;
            let data = yield this.salesOrderReviewRepository.findOne({ where: { zohoId: item_id, userId: user_id, packageId: package_Id } });
            if (data) {
                data.comment = comment;
                data.rating = rating;
                yield this.salesOrderReviewRepository.update(data.id, data);
                return data;
            }
            else {
                let data1 = {
                    userId: user_id,
                    zohoId: item_id,
                    comment: comment,
                    rating: rating,
                    packageId: package_Id,
                    prodoId: prodo_id
                };
                yield this.salesOrderReviewRepository.save(data1);
                return data1;
            }
        });
    }
    getReview(item_id, user_id, package_id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let data = yield this.salesOrderReviewRepository.findOne({ where: { zohoId: item_id, userId: user_id, packageId: package_id } });
            if (data) {
                return data;
            }
            else {
                return {
                    userId: user_id,
                    zohoId: item_id,
                    comment: "",
                    rating: 0,
                    packageId: package_id,
                    prodoId: ""
                };
            }
        });
    }
    sendMailWithTemplate(templateName, subject) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let users = yield this.userRepository.find();
            let no = 1;
            for (let user of users) {
                user.usersNo = no;
                no++;
            }
            let data = [];
            let m = 1;
            for (const itemData of users) {
                if (itemData.usersNo % 95 > 0) {
                    let found = data.find(element => element.id === m);
                    if (found) {
                        found.emails.push(itemData.email);
                    }
                    else {
                        data.push({ id: m, emails: [itemData.email] });
                    }
                }
                else {
                    m++;
                    let found = data.find(element => element.id === m);
                    if (found) {
                        found.emails.push(itemData.email);
                    }
                    else {
                        data.push({ id: m, emails: [itemData.email] });
                    }
                }
            }
            let mailOutput = [];
            for (const itemData of data) {
                let bcc = itemData.emails;
                let mailTrigger = {
                    from: 'Team Prodo',
                    bcc: bcc,
                    subject: subject,
                    template: templateName,
                    templatevars: {},
                };
                yield this.mailService.sendBulkMailToManufacturer(mailTrigger);
                mailOutput.push("Mail sent");
            }
            return mailOutput;
        });
    }
    fixAllUsers() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let allUser = yield this.userRepository.find();
            let res = [];
            for (let i = 0; i < allUser.length; i++) {
                var user = allUser[i];
                if (!user.organization_id) {
                    res.push({ "error": user });
                }
                else {
                    user.orgRole = "ORG_ADMIN";
                    if (!user.orgIdRoles) {
                        user.orgIdRoles = [];
                    }
                    user.orgIdRoles = yield this.addRole(user.orgIdRoles, user.organization_id, 'ORG_ADMIN');
                    if (!user.orgIds) {
                        user.orgIds = [];
                    }
                    user.orgIds.push(`${user.organization_id}`);
                    user.orgIds = [...new Set(user.orgIds)];
                    res.push({ email: user.email, details: yield this.userRepository.save(user) });
                }
            }
            return res;
        });
    }
    fixAllUsersOrganizations() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let allUser = yield this.userRepository.find();
            let res = [];
            for (let i = 0; i < allUser.length; i++) {
                var user = allUser[i];
                console.log(user.email, " data fixing", i);
                let organization = yield this.organizationService.fixOldData(user.organization_id);
                res.push(organization);
            }
            return res;
        });
    }
    findAllUsers() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let allUser = yield this.userRepository.find();
            return allUser;
        });
    }
    setProfilePicture(profilePicture, userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let user = yield this.userRepository.findOne(userId);
            if (user) {
                user.profilePicture = profilePicture;
                let m = yield this.userRepository.update(userId, user);
                return user;
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.NOT_FOUND,
                    error: 'NOT_FOUND',
                    message: "User Not Found",
                }, common_2.HttpStatus.NOT_FOUND);
            }
        });
    }
    addNewOrganization(user, organizationData, userRole, accountId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            organizationData.account_id = String(accountId);
            let updatedData = {};
            updatedData.organization = yield this.organizationService.newOrgSave(organizationData, "New");
            if (updatedData.organization) {
                let orgId = String(updatedData.organization.id);
                if (user.orgIds.includes(orgId)) {
                    console.log("User Allready in this Organization ");
                }
                else {
                    user.orgIds.push(orgId);
                    user.orgIdRoles = yield this.addRole(user.orgIdRoles, orgId, userRole);
                    if (!user.organization_id) {
                        user.organization_id = orgId;
                        user.orgRole = userRole;
                    }
                }
                yield this.userRepository.update(user.id, user);
                updatedData.user = user;
                return updatedData;
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.BAD_REQUEST,
                    error: 'Forbidden',
                    message: "Error in Saving Data"
                }, common_2.HttpStatus.BAD_REQUEST);
            }
        });
    }
    updateData(user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log("Updating data of email", user.email);
            let organization_id = user.organization_id;
            let organization = yield this.organizationService.findOne(organization_id);
            organization.account_id = String(user.accountId);
            let updatedData = yield this.organizationService.newOrgSave(organization, "Old");
            if (updatedData) {
                if (user.orgIds.includes(updatedData.orgId)) {
                    console.log("User Allready in this Organization ");
                }
                else {
                    user.orgIds.push(updatedData.orgId);
                    user.orgIdRoles = yield this.addRole(user.orgIdRoles, updatedData.orgId, 'ORG_ADMIN');
                    if (!user.organization_id) {
                        user.organization_id = updatedData.orgId;
                        user.orgRole = 'ORG_ADMIN';
                    }
                }
                if (user.companyIds.includes(updatedData.companyId)) {
                    console.log("User Allready in this Company ");
                    user.companyId = updatedData.companyId;
                }
                else {
                    user.companyIds.push(updatedData.companyId);
                    user.companyIdRoles = yield this.addRole(user.companyIdRoles, updatedData.companyId, 'COMPANY_ADMIN');
                    if (!user.companyId) {
                        user.companyId = updatedData.companyId;
                        user.companyRole = 'COMPANY_ADMIN';
                    }
                }
                if (user.entityIds.includes(updatedData.entityId)) {
                    console.log("User Allready in this Entity ");
                    user.entityId = updatedData.entityId;
                }
                else {
                    user.entityIds.push(updatedData.entityId);
                    user.entityIdRoles = yield this.addRole(user.entityIdRoles, updatedData.entityId, 'ENTITY_ADMIN');
                    if (!user.entityId) {
                        user.entityId = updatedData.entityId;
                        user.entityRole = 'ENTITY_ADMIN';
                    }
                }
                user.orgRole = "ORG_ADMIN";
                yield this.userRepository.update(user.id, user);
                return updatedData;
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.BAD_REQUEST,
                    error: 'Forbidden',
                    message: "Error in Saving Data"
                }, common_2.HttpStatus.BAD_REQUEST);
            }
        });
    }
    orgUsers(ids) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let filterData = [];
            for (let i = 0; i < ids.length; i++) {
                filterData.push({ orgIds: ids[i] });
            }
            let filter = {
                $or: filterData
            };
            let users = yield this.userRepository.find({ where: filter });
            let resultUsers = [];
            let org;
            for (let j = 0; j < ids.length; j++) {
                org = yield this.organizationRepository.findOne(ids[j]);
                for (let user of users) {
                    let orgIdRoles = [];
                    let companyIdRoles = [];
                    let entityIdRoles = [];
                    let orgRole = user.orgIdRoles.find(j => j.id == org.id);
                    if (orgRole) {
                        orgIdRoles.push(orgRole);
                    }
                    for (let c of org.companyIds) {
                        let comRole = user.companyIdRoles.find(j => j.id == c);
                        if (comRole) {
                            companyIdRoles.push(comRole);
                        }
                    }
                    for (let e of org.entityIds) {
                        let eRole = user.entityIdRoles.find(j => j.id == e);
                        if (eRole) {
                            entityIdRoles.push(eRole);
                        }
                    }
                    let find = resultUsers.find(i => i.id == user.id);
                    if (find) {
                        if (orgIdRoles.length > 0) {
                            find.orgIdRoles = orgIdRoles;
                        }
                        if (companyIdRoles.length > 0) {
                            find.companyIdRoles = companyIdRoles;
                        }
                        if (entityIdRoles) {
                            find.entityIdRoles = entityIdRoles;
                        }
                    }
                    else {
                        resultUsers.push({
                            id: user.id,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            contactNumber: user.contactNumber,
                            email: user.email,
                            orgIdRoles: orgIdRoles,
                            companyIdRoles: companyIdRoles,
                            entityIdRoles: entityIdRoles
                        });
                    }
                }
            }
            return resultUsers;
        });
    }
    companyUsers(ids) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let filterData = [];
            for (let i = 0; i < ids.length; i++) {
                filterData.push({ companyIds: ids[i] });
            }
            let filter = {
                $or: filterData
            };
            let users = yield this.userRepository.find({ where: filter });
            let resultUsers = [];
            let company;
            for (let j = 0; j < ids.length; j++) {
                company = yield this.companyRepository.findOne(ids[j]);
                for (let user of users) {
                    let orgIdRoles = [];
                    let companyIdRoles = [];
                    let entityIdRoles = [];
                    let compRole = user.companyIdRoles.find(j => j.id == company.id);
                    if (compRole) {
                        companyIdRoles.push(compRole);
                    }
                    let orgRole = user.orgIdRoles.find(j => j.id == company.organization_id);
                    if (orgRole) {
                        orgIdRoles.push(orgRole);
                    }
                    for (let e of company.entityIds) {
                        let eRole = user.entityIdRoles.find(j => j.id == e);
                        if (eRole) {
                            entityIdRoles.push(eRole);
                        }
                    }
                    let find = resultUsers.find(i => i.id == user.id);
                    if (find) {
                        if (orgIdRoles.length > 0) {
                            find.orgIdRoles = orgIdRoles;
                        }
                        if (companyIdRoles.length > 0) {
                            find.companyIdRoles = companyIdRoles;
                        }
                        if (entityIdRoles.length) {
                            find.entityIdRoles = entityIdRoles;
                        }
                    }
                    else {
                        resultUsers.push({
                            id: user.id,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            contactNumber: user.contactNumber,
                            email: user.email,
                            orgIdRoles: orgIdRoles,
                            companyIdRoles: companyIdRoles,
                            entityIdRoles: entityIdRoles
                        });
                    }
                }
            }
            return resultUsers;
        });
    }
    entityUsers(ids) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let filterData = [];
            for (let i = 0; i < ids.length; i++) {
                filterData.push({ entityIds: ids[i] });
            }
            let filter = {
                $or: filterData
            };
            let users = yield this.userRepository.find({ where: filter });
            let result = [];
            let resultUsers = [];
            let entity;
            for (let j = 0; j < ids.length; j++) {
                entity = yield this.entityRepository.findOne(ids[j]);
                for (let user of users) {
                    let orgIdRoles = [];
                    let companyIdRoles = [];
                    let entityIdRoles = [];
                    let compRole = user.companyIdRoles.find(j => j.id == entity.companyId);
                    if (compRole) {
                        companyIdRoles.push(compRole);
                    }
                    let orgRole = user.orgIdRoles.find(j => j.id == entity.organization_id);
                    if (orgRole) {
                        orgIdRoles.push(orgRole);
                    }
                    let entRole = user.entityIdRoles.find(j => j.id == entity.id);
                    if (entRole) {
                        entityIdRoles.push(entRole);
                    }
                    let find = resultUsers.find(i => i.id == user.id);
                    if (find) {
                        if (orgIdRoles.length > 0) {
                            find.orgIdRoles = orgIdRoles;
                        }
                        if (companyIdRoles.length > 0) {
                            find.companyIdRoles = companyIdRoles;
                        }
                        if (entityIdRoles.length > 0) {
                            find.entityIdRoles = entityIdRoles;
                        }
                    }
                    else {
                        resultUsers.push({
                            id: user.id,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            contactNumber: user.contactNumber,
                            email: user.email,
                            orgIdRoles: orgIdRoles,
                            companyIdRoles: companyIdRoles,
                            entityIdRoles: entityIdRoles
                        });
                    }
                }
            }
            return resultUsers;
        });
    }
    makeDummyUser(email) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let user1 = yield this.findByEmail(email);
            if (user1) {
                let account = yield this.accountRepository.findOne(user.accountId);
                account.email = email;
                yield this.accountRepository.update(account.id, account);
                user1.roles = [roles_constants_1.UserRole.USER, roles_constants_1.UserRole.CLIENT, roles_constants_1.UserRole.ADMIN, roles_constants_1.UserRole.createRFQ];
                yield this.userRepository.update(user1.id, user1);
                return user1;
            }
            console.log("New dummy user");
            if (!email.includes('@')) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.FAILED_DEPENDENCY,
                    error: "Error from zoho fields in user",
                    message: "Field error email",
                }, common_2.HttpStatus.FAILED_DEPENDENCY);
            }
            let user = new user_entity_1.User();
            let account = yield this.accountRepository.findOne({ where: { email: email } });
            if (!account) {
                account = new account_entity_1.Account();
                account.type = account_entity_2.AccountType.EXTERNAL;
                account.email = email;
                account = yield this.accountRepository.save(account);
            }
            let firstName = email.split('@')[0];
            firstName = firstName.split('.');
            let lastName = firstName[1] ? firstName[1] : " ";
            firstName = firstName[0];
            user.email = email;
            user.firstName = firstName;
            user.lastName = lastName;
            user.contactNumber = "";
            user.password = "dbfd2fc50d850c89daba5a1cace7c223891c34a3";
            user.createdAt = new Date();
            user.updatedAt = new Date();
            user.accountId = account.id;
            user.isVerified = false;
            user.orgIds = [];
            user.companyIds = [];
            user.entityIds = [];
            user.status = user_entity_1.UserStatus.ACTIVE;
            user.userType = user_entity_1.UserType.ZOHO;
            user.roles = [roles_constants_1.UserRole.USER, roles_constants_1.UserRole.CLIENT, roles_constants_1.UserRole.ADMIN, roles_constants_1.UserRole.createRFQ];
            user.teams = [];
            return yield this.userRepository.save(user);
        });
    }
    zohoPocUsers(emails) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let users = [];
            if (emails.length > 0) {
                for (let i of emails) {
                    if (!i.includes('@')) {
                        throw new common_2.HttpException({
                            status: common_2.HttpStatus.FAILED_DEPENDENCY,
                            error: "Error from zoho fields in user",
                            message: "Field error email not valid",
                        }, common_2.HttpStatus.FAILED_DEPENDENCY);
                    }
                    let user = yield this.findByEmail(i);
                    if (user) {
                        yield this.userRepository.update(user.id, user);
                        users.push(user);
                    }
                    else {
                        let dummy = this.makeDummyUser(i);
                        users.push(dummy);
                    }
                }
                return users;
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.NOT_FOUND,
                    error: "Error from zoho fields in user",
                    message: "Field error email of pocs not found",
                }, common_2.HttpStatus.NOT_FOUND);
            }
        });
    }
    addRole(IdRoles, id, role) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const find = IdRoles.find(data => data.id == id);
            if (find) {
                find.role = role;
                return IdRoles;
            }
            IdRoles.push({ "id": `${id}`, "role": `${role}` });
            return IdRoles;
        });
    }
    addAdminRole(user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!user.orgIds.includes(user.organization_id)) {
                user.orgIds.push(user.organization_id);
                user.orgRole = "ORG_ADMIN";
                user.orgIdRoles = yield this.addRole(user.orgIdRoles, user.organization_id, "ORG_ADMIN");
            }
            if (!user.companyIds.includes(user.companyId)) {
                user.companyIds.push(user.companyId);
                user.companyRole = "COMPANY_ADMIN";
                user.companyIdRoles = yield this.addRole(user.companyIdRoles, user.companyId, "COMPANY_ADMIN");
            }
            if (!user.entityIds.includes(user.entityId)) {
                user.entityIds.push(user.entityId);
                user.entityRole = "ENTITY_ADMIN";
                user.entityIdRoles = yield this.addRole(user.entityIdRoles, user.entityId, "ENTITY_ADMIN");
            }
            return user;
        });
    }
    addCompanyRole(user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!user.orgIds.includes(user.organization_id)) {
                user.orgIds.push(user.organization_id);
                user.orgRole = "ORG_EMPLOYEE";
                user.orgIdRoles = yield this.addRole(user.orgIdRoles, user.organization_id, "ORG_EMPLOYEE");
            }
            if (!user.companyIds.includes(user.companyId)) {
                user.companyIds.push(user.companyId);
                user.companyRole = "COMPANY_ADMIN";
                user.companyIdRoles = yield this.addRole(user.companyIdRoles, user.companyId, "COMPANY_ADMIN");
            }
            if (!user.entityIds.includes(user.entityId)) {
                user.entityIds.push(user.entityId);
                user.entityRole = "ENTITY_ADMIN";
                user.entityIdRoles = yield this.addRole(user.entityIdRoles, user.entityId, "ENTITY_ADMIN");
            }
            return user;
        });
    }
    addEntityRole(user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!user.orgIds.includes(user.organization_id)) {
                user.orgIds.push(user.organization_id);
                user.orgRole = "ORG_EMPLOYEE";
                user.orgIdRoles = yield this.addRole(user.orgIdRoles, user.organization_id, "ORG_EMPLOYEE");
            }
            if (!user.companyIds.includes(user.companyId)) {
                user.companyIds.push(user.companyId);
                user.companyRole = "COMPANY_EMPLOYEE";
                user.companyIdRoles = yield this.addRole(user.companyIdRoles, user.companyId, "COMPANY_EMPLOYEE");
            }
            if (!user.entityIds.includes(user.entityId)) {
                user.entityIds.push(user.entityId);
                user.entityRole = "ENTITY_ADMIN";
                user.entityIdRoles = yield this.addRole(user.entityIdRoles, user.entityId, "ENTITY_ADMIN");
            }
            return user;
        });
    }
    addEmployeeRole(user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!user.orgIds.includes(user.organization_id)) {
                user.orgIds.push(user.organization_id);
                user.orgRole = "ORG_EMPLOYEE";
                user.orgIdRoles = yield this.addRole(user.orgIdRoles, user.organization_id, "ORG_EMPLOYEE");
            }
            if (!user.companyIds.includes(user.companyId)) {
                user.companyIds.push(user.companyId);
                user.companyRole = "COMPANY_EMPLOYEE";
                user.companyIdRoles = yield this.addRole(user.companyIdRoles, user.companyId, "COMPANY_EMPLOYEE");
            }
            if (!user.entityIds.includes(user.entityId)) {
                user.entityIds.push(user.entityId);
                user.entityRole = "ENTITY_EMPLOYEE";
                user.entityIdRoles = yield this.addRole(user.entityIdRoles, user.entityId, "ENTITY_EMPLOYEE");
            }
            return user;
        });
    }
    zohoUsersUpdate(users1, orgId, companyId, entityId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let users = users1;
            for (let i = 0; i < users.length; i++) {
                let user = users[i];
                user.organization_id = String(orgId);
                user.companyId = String(companyId);
                user.entityId = String(entityId);
                switch (i) {
                    case 0:
                        user = yield this.addAdminRole(user);
                        yield this.userRepository.update(user.id, user);
                        break;
                    case 1:
                        user = yield this.addCompanyRole(user);
                        yield this.userRepository.update(user.id, user);
                        break;
                    case 2:
                        user = yield this.addCompanyRole(user);
                        yield this.userRepository.update(user.id, user);
                        break;
                    default:
                        user = yield this.addCompanyRole(user);
                        yield this.userRepository.update(user.id, user);
                }
            }
            return users;
        });
    }
    switchupdate1(user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.save(user);
        });
    }
    switchupdate(user, id, authority, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (authority == "PRODO_ADMIN") {
                yield this.userRepository.update(user.id, user);
            }
            if (authority == "NOT_PRODO_ADMIN") {
                if (type == "organization") {
                    let organization = yield this.organizationRepository.findOne(id);
                    if (organization.status == "ACTIVE") {
                        user = yield this.userRepository.update(user.id, user);
                    }
                    if (organization.status == "INACTIVE") {
                        console.log("throw exception");
                        throw new common_2.HttpException({
                            status: common_2.HttpStatus.EXPECTATION_FAILED,
                            error: 'not found',
                            message: "Organization not found",
                        }, common_2.HttpStatus.EXPECTATION_FAILED);
                    }
                }
                if (type == "company") {
                    let company = yield this.companyRepository.findOne(id);
                    if (company.status == "ACTIVE") {
                        user = yield this.userRepository.update(user.id, user);
                    }
                    if (company.status == "INACTIVE") {
                        console.log("throw exception");
                        throw new common_2.HttpException({
                            status: common_2.HttpStatus.EXPECTATION_FAILED,
                            error: 'not found',
                            message: "company not found",
                        }, common_2.HttpStatus.EXPECTATION_FAILED);
                    }
                }
                if (type == "entity") {
                    let entity = yield this.entityRepository.findOne(id);
                    if (entity.status == "ACTIVE") {
                        user = yield this.userRepository.update(user.id, user);
                    }
                    if (entity.status == "INACTIVE") {
                        console.log("throw exception");
                        throw new common_2.HttpException({
                            status: common_2.HttpStatus.EXPECTATION_FAILED,
                            error: 'Not Found',
                            message: "Entity not found",
                        }, common_2.HttpStatus.EXPECTATION_FAILED);
                    }
                }
            }
            return user;
        });
    }
    findusers(ids) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let filterData = [];
            for (let i = 0; i < ids.length; i++) {
                filterData.push({ _id: ObjectId(ids[i]) });
            }
            let filter = {
                $or: filterData
            };
            console.log(filter);
            const users = yield this.userRepository.find({ where: filter });
            return users;
        });
    }
    adminLevelSwitch(type, check, user, adminUser, data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let compSkip;
            let orgSkip;
            let entSkip;
            if (check == "PRODO_ADMIN") {
                console.log("prodo admin has requested switching so do it");
                if (type == "organization") {
                    orgSkip = yield this.userRepository.find({ where: { orgIds: data.id } });
                    if (orgSkip.length < 2) {
                        console.log("throw exception of adminkloss");
                        throw new common_2.HttpException({
                            status: common_2.HttpStatus.EXPECTATION_FAILED,
                            error: 'EXPECTATION_FAILED',
                            message: "Admin loss might occur",
                        }, common_2.HttpStatus.EXPECTATION_FAILED);
                    }
                    else {
                        yield this.switchingfunc(type, user, data);
                    }
                }
                if (type == "company") {
                    compSkip = yield this.userRepository.find({ where: { companyIds: data.id } });
                    if (compSkip.length < 2) {
                        console.log("throw exception of adminkloss");
                        throw new common_2.HttpException({
                            status: common_2.HttpStatus.EXPECTATION_FAILED,
                            error: 'EXPECTATION_FAILED',
                            message: "Admin loss might occur",
                        }, common_2.HttpStatus.EXPECTATION_FAILED);
                    }
                    else {
                        yield this.switchingfunc(type, user, data);
                    }
                }
                if (type == "entity") {
                    entSkip = yield this.userRepository.find({ where: { entityIds: data.id } });
                    if (entSkip.length < 2) {
                        console.log("throw exception of adminkloss");
                        throw new common_2.HttpException({
                            status: common_2.HttpStatus.EXPECTATION_FAILED,
                            error: 'EXPECTATION_FAILED',
                            message: "Admin loss might occur",
                        }, common_2.HttpStatus.EXPECTATION_FAILED);
                    }
                    else {
                        yield this.switchingfunc(type, user, data);
                    }
                }
            }
            if (check == "NOT_PRODO_ADMIN") {
                console.log("further checks will happen here ");
                if (type == "organization") {
                    console.log("org switching is requested");
                    let organization = yield this.organizationRepository.findOne(data.id);
                    if (organization.status == "INACTIVE") {
                        console.log("throw exception that you cannot change role to an inactive organization");
                        throw new common_2.HttpException({
                            status: common_2.HttpStatus.EXPECTATION_FAILED,
                            error: 'EXPECTATION_FAILED',
                            message: "Organization does not exists",
                        }, common_2.HttpStatus.EXPECTATION_FAILED);
                    }
                    if (adminUser.accountId == organization.account_id) {
                        console.log("adminuser is the suoer admin of the organization therefore can do the switching");
                        if (user.orgIds.includes(data.id)) {
                            console.log("switching is possible");
                            yield this.switchingfunc(type, user, data);
                        }
                        else {
                            console.log("throw exception because the user is not part of the organization");
                            throw new common_2.HttpException({
                                status: common_2.HttpStatus.EXPECTATION_FAILED,
                                error: 'EXPECTATION_FAILED',
                                message: "User not part of the organization",
                            }, common_2.HttpStatus.EXPECTATION_FAILED);
                        }
                    }
                    else {
                        console.log("throw exception that rest of the users cannot change the role because on same level it is not possible ");
                        throw new common_2.HttpException({
                            status: common_2.HttpStatus.EXPECTATION_FAILED,
                            error: 'EXPECTATION_FAILED',
                            message: "user authority mismatch",
                        }, common_2.HttpStatus.EXPECTATION_FAILED);
                    }
                }
                if (type == "company") {
                    console.log("copany switch is requested");
                    let company = yield this.companyRepository.findOne(data.id);
                    if (company.status == "INACTIVE" || !company) {
                        console.log("throw exception that cannot switch into nothing");
                        throw new common_2.HttpException({
                            status: common_2.HttpStatus.EXPECTATION_FAILED,
                            error: 'EXPECTATION_FAILED',
                            message: "company does not exists",
                        }, common_2.HttpStatus.EXPECTATION_FAILED);
                    }
                    let organization = yield this.organizationRepository.findOne(company.organization_id);
                    if (!organization) {
                        console.log("throw exception that db error has occured");
                        throw new common_2.HttpException({
                            status: common_2.HttpStatus.EXPECTATION_FAILED,
                            error: 'EXPECTATION_FAILED',
                            message: "Db error",
                        }, common_2.HttpStatus.EXPECTATION_FAILED);
                    }
                    if (adminUser.accountId == organization.account_id) {
                        console.log("user is the super admin for the organization of the company therefpre can perform the switching");
                        if (user.companyIds.includes(data.id)) {
                            console.log("switching is possible");
                            yield this.switchingfunc(type, user, data);
                        }
                        else {
                            console.log("throw exception because the user is not part of the organization");
                            throw new common_2.HttpException({
                                status: common_2.HttpStatus.EXPECTATION_FAILED,
                                error: 'EXPECTATION_FAILED',
                                message: "user not part of the company",
                            }, common_2.HttpStatus.EXPECTATION_FAILED);
                        }
                    }
                    for (let i of adminUser.orgIdRoles) {
                        if (i.id == company.organization_id && i.role == "ORG_ADMIN") {
                            console.log("switching agin is possible");
                            yield this.switchingfunc(type, user, data);
                        }
                        if (i.id == company.organization_id && i.role !== "ORG_ADMIN") {
                            console.log("throw exception because switching is not allowed on same levels");
                            throw new common_2.HttpException({
                                status: common_2.HttpStatus.EXPECTATION_FAILED,
                                error: 'EXPECTATION_FAILED',
                                message: "Switching not allowed on same levels",
                            }, common_2.HttpStatus.EXPECTATION_FAILED);
                        }
                    }
                }
                if (type == "entity") {
                    console.log("entity switch is requested");
                    let entity = yield this.entityRepository.findOne(data.id);
                    if (!entity || entity.status == "INACTIVE") {
                        console.log("throw exception that you cannot switch into nothing");
                        throw new common_2.HttpException({
                            status: common_2.HttpStatus.EXPECTATION_FAILED,
                            error: 'EXPECTATION_FAILED',
                            message: "Entity does not exists",
                        }, common_2.HttpStatus.EXPECTATION_FAILED);
                    }
                    let organization = yield this.organizationRepository.findOne(entity.organization_id);
                    let company = yield this.companyRepository.findOne(entity.companyId);
                    if (!organization || !company) {
                        console.log("throw db error that somehow org or company does not exist for entity");
                        throw new common_2.HttpException({
                            status: common_2.HttpStatus.EXPECTATION_FAILED,
                            error: 'EXPECTATION_FAILED',
                            message: "db error",
                        }, common_2.HttpStatus.EXPECTATION_FAILED);
                    }
                    if (adminUser.accountId == organization.account_id) {
                        console.log("the user can performm switching because he is the super admin of the organization where the entity lies");
                        if (user.entityIds.includes(data.id)) {
                            console.log("you can perform the switching");
                            yield this.switchingfunc(type, user, data);
                        }
                        else {
                            console.log("throw exception that user is not part of the desired entity");
                            throw new common_2.HttpException({
                                status: common_2.HttpStatus.EXPECTATION_FAILED,
                                error: 'EXPECTATION_FAILED',
                                message: "User not part of the entity",
                            }, common_2.HttpStatus.EXPECTATION_FAILED);
                        }
                    }
                    for (let i of adminUser.orgIdRoles) {
                        if (i.id == organization.id && i.role == "ORG_ADMIN") {
                            console.log("here too switching can take place");
                            yield this.switchingfunc(type, user, data);
                        }
                    }
                    for (let i of adminUser.companyIdRoles) {
                        if (i.id == company.id && i.role == "COMPANY_ADMIN") {
                            console.log("the user can perform the switching");
                            yield this.switchingfunc(type, user, data);
                        }
                        if (i.id == company.id && i.role !== "COMPANY_ADMIN") {
                            console.log("throw exception that on same levels switching is not allowed");
                            throw new common_2.HttpException({
                                status: common_2.HttpStatus.EXPECTATION_FAILED,
                                error: 'EXPECTATION_FAILED',
                                message: "Same level switching is forbidden",
                            }, common_2.HttpStatus.EXPECTATION_FAILED);
                        }
                    }
                    for (let i of adminUser.entityIdRoles) {
                        if (i.id == entity.id && i.role == "ENTITY_ADMIN") {
                            console.log("the user can perform the switching");
                            yield this.switchingfunc(type, user, data);
                        }
                        if (i.id == entity.id && i.role !== "ENTITY_ADMIN") {
                            console.log("throw exception that on same levels switching is not allowed");
                            throw new common_2.HttpException({
                                status: common_2.HttpStatus.EXPECTATION_FAILED,
                                error: 'same level switching is forbidden',
                                message: "Invalid User",
                            }, common_2.HttpStatus.EXPECTATION_FAILED);
                        }
                    }
                }
            }
        });
    }
    switchingfunc(type, user, data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (type == "organization") {
                console.log("here finally switching will take place");
                for (let i of user.orgIdRoles) {
                    if (i.id == data.id) {
                        i.role = data.role;
                    }
                }
                console.log("here save it");
            }
            if (type == "company") {
                console.log("here finally switching will take place");
                for (let i of user.companyIdRoles) {
                    if (i.id == data.id) {
                        i.role = data.role;
                    }
                }
                console.log("here save it");
            }
            if (type == "entity") {
                console.log("here finally switching will take place");
                for (let i of user.entityIdRoles) {
                    if (i.id == data.id) {
                        i.role = data.role;
                    }
                }
                console.log("here save it");
            }
        });
    }
    superSwitch(user, type, data, id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (type == "organization") {
                console.log("org switch is requested");
                let organization = yield this.organizationRepository.findOne(id);
                if (!organization) {
                    console.log("throw exception that the org does not exists");
                    throw new common_2.HttpException({
                        status: common_2.HttpStatus.EXPECTATION_FAILED,
                        error: 'EXPECTATION_FAILED',
                        message: "organization does not exists",
                    }, common_2.HttpStatus.EXPECTATION_FAILED);
                }
                if (user.roles.includes(roles_constants_1.UserRole.PRODO_ADMIN)) {
                    console.log("we can perform switching");
                    user.orgId = id;
                    user.orgRole = data.role;
                }
                if (organization.status == "INACTIVE") {
                    console.log("switching cannot take place to nothing");
                    throw new common_2.HttpException({
                        status: common_2.HttpStatus.EXPECTATION_FAILED,
                        error: 'EXPECTATION_FAILED',
                        message: "organization does not exists",
                    }, common_2.HttpStatus.EXPECTATION_FAILED);
                }
                if (user.orgIds.includes(id)) {
                    console.log("switching might take place");
                    for (let i of user.orgIdRoles) {
                        if (i.id == id && i.role == "ORG_ADMIN") {
                            console.log("switching will finally take place");
                            user.orgId = id;
                            user.orgRole = data.role;
                        }
                        if (i.id == id && i.role !== "ORG_ADMIN") {
                            console.log("throw error that you are not admin");
                            throw new common_2.HttpException({
                                status: common_2.HttpStatus.EXPECTATION_FAILED,
                                error: 'EXPECTATION_FAILED',
                                message: "You are not admin",
                            }, common_2.HttpStatus.EXPECTATION_FAILED);
                        }
                    }
                }
            }
            if (type == "company") {
                console.log("company switch is requested");
                let company = yield this.companyRepository.findOne(id);
                if (!company) {
                    console.log("throw exception that the org does not exists");
                    throw new common_2.HttpException({
                        status: common_2.HttpStatus.EXPECTATION_FAILED,
                        error: 'EXPECTATION_FAILED',
                        message: "company does not exists",
                    }, common_2.HttpStatus.EXPECTATION_FAILED);
                }
                if (user.roles.includes(roles_constants_1.UserRole.PRODO_ADMIN)) {
                    console.log("we can perform switching");
                    user.companyId = id;
                    user.companyRole = data.role;
                }
                if (company.status == "INACTIVE") {
                    console.log("switching cannot take place to nothing");
                    throw new common_2.HttpException({
                        status: common_2.HttpStatus.EXPECTATION_FAILED,
                        error: 'EXPECTATION_FAILED',
                        message: "company does not exists",
                    }, common_2.HttpStatus.EXPECTATION_FAILED);
                }
                if (user.companyIds.includes(id)) {
                    console.log("switching might take place");
                    for (let i of user.companyIdRoles) {
                        if (i.id == id && i.role == "COMPANY_ADMIN") {
                            console.log("switching will finally take place");
                            user.companyId = id;
                            user.companyRole = data.role;
                        }
                        if (i.id == id && i.role !== "COMPANY_ADMIN") {
                            console.log("throw error that you are not admin");
                            throw new common_2.HttpException({
                                status: common_2.HttpStatus.EXPECTATION_FAILED,
                                error: 'EXPECTATION_FAILED',
                                message: "You are not admin",
                            }, common_2.HttpStatus.EXPECTATION_FAILED);
                        }
                    }
                }
            }
            if (type == "entity") {
                console.log("entity switch is requested");
                let entity = yield this.entityRepository.findOne(id);
                if (!entity) {
                    console.log("throw exception that the ent does not exists");
                    throw new common_2.HttpException({
                        status: common_2.HttpStatus.EXPECTATION_FAILED,
                        error: 'EXPECTATION_FAILED',
                        message: "entity does not exists",
                    }, common_2.HttpStatus.EXPECTATION_FAILED);
                }
                if (user.roles.includes(roles_constants_1.UserRole.PRODO_ADMIN)) {
                    console.log("we can perform switching");
                    user.entityId = id;
                    user.entityRole = data.role;
                }
                if (entity.status == "INACTIVE") {
                    console.log("switching cannot take place to nothing");
                    throw new common_2.HttpException({
                        status: common_2.HttpStatus.EXPECTATION_FAILED,
                        error: 'EXPECTATION_FAILED',
                        message: "entity does not exists",
                    }, common_2.HttpStatus.EXPECTATION_FAILED);
                }
                if (user.entityIds.includes(id)) {
                    console.log("switching might take place");
                    for (let i of user.entityIdRoles) {
                        if (i.id == id && i.role == "ENTITY_ADMIN") {
                            console.log("switching will finally take place");
                            user.entityId = id;
                            user.entityRole = data.role;
                        }
                        if (i.id == id && i.role !== "ENTITY_ADMIN") {
                            console.log("throw error that you are not admin");
                            throw new common_2.HttpException({
                                status: common_2.HttpStatus.EXPECTATION_FAILED,
                                error: 'EXPECTATION_FAILED',
                                message: "You are not admin",
                            }, common_2.HttpStatus.EXPECTATION_FAILED);
                        }
                    }
                }
            }
            else {
                console.log("throw exception that invalid switch is requested");
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "Invalid Switch is requested",
                }, common_2.HttpStatus.EXPECTATION_FAILED);
            }
        });
    }
    toAddTheUser(type, data, user, adminUser) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (type == "organization") {
                console.log("addding into the organization");
                let organization = yield this.organizationRepository.findOne(data.id);
                if (!organization) {
                    console.log("throw exception that no org exists for the provided id");
                    throw new common_2.HttpException({
                        status: common_2.HttpStatus.EXPECTATION_FAILED,
                        error: 'EXPECTATION_FAILED',
                        message: "Organization Does not exists",
                    }, common_2.HttpStatus.EXPECTATION_FAILED);
                }
                if (adminUser.roles.includes(roles_constants_1.UserRole.PRODO_ADMIN)) {
                    console.log("he can definitely add the user to an organization ");
                    if (user.orgIds.includes(data.id)) {
                        console.log("throw exception that user is already a part of the organiation");
                        throw new common_2.HttpException({
                            status: common_2.HttpStatus.EXPECTATION_FAILED,
                            error: 'EXPECTATION_FAILED',
                            message: "user is already part of the organization",
                        }, common_2.HttpStatus.EXPECTATION_FAILED);
                    }
                    else {
                        console.log("here add the user to the organization");
                        user.orgIds.push(data.id);
                        user.orgIdRoles.push({ id: data.id, role: data.role });
                    }
                }
                if (adminUser.accountId == organization.account_id) {
                    console.log("adminuser is the super admin of the org therefore can add to the organiaztion");
                    if (organization.status == "INACTIVE") {
                        console.log("throw exception canot add user to nothing");
                        throw new common_2.HttpException({
                            status: common_2.HttpStatus.EXPECTATION_FAILED,
                            error: 'EXPECTATION_FAILED',
                            message: "organization does not exists",
                        }, common_2.HttpStatus.EXPECTATION_FAILED);
                    }
                    if (organization.status == "ACTIVE") {
                        console.log("here addition can take place");
                        if (user.orgIds.includes(data.id)) {
                            console.log("throw exception that user is already a part of the organiation");
                            throw new common_2.HttpException({
                                status: common_2.HttpStatus.EXPECTATION_FAILED,
                                error: 'EXPECTATION_FAILED',
                                message: "already part of the organization",
                            }, common_2.HttpStatus.EXPECTATION_FAILED);
                        }
                        else {
                            console.log("here add the user to the organization");
                            user.orgIds.push(data.id);
                            user.orgIdRoles.push({ id: data.id, role: data.role });
                        }
                    }
                }
                for (let i of adminUser.orgIdRoles) {
                    if (i.id == organization.id && i.role == "ORG_ADMIN") {
                        console.log("he too can perform addition");
                        if (organization.status == "INACTIVE") {
                            console.log("throw exception canot add user to nothing");
                            throw new common_2.HttpException({
                                status: common_2.HttpStatus.EXPECTATION_FAILED,
                                error: 'EXPECTATION_FAILED',
                                message: "organization does not exists",
                            }, common_2.HttpStatus.EXPECTATION_FAILED);
                        }
                        if (organization.status == "ACTIVE") {
                            console.log("here addition can take place");
                            if (user.orgIds.includes(data.id)) {
                                console.log("throw exception that user is already a part of the organiation");
                                throw new common_2.HttpException({
                                    status: common_2.HttpStatus.EXPECTATION_FAILED,
                                    error: 'EXPECTATION_FAILED',
                                    message: "user already in organization",
                                }, common_2.HttpStatus.EXPECTATION_FAILED);
                            }
                            else {
                                console.log("here add the user to the organization");
                                user.orgIds.push(data.id);
                                user.orgIdRoles.push({ id: data.id, role: data.role });
                            }
                        }
                    }
                }
            }
            if (type == "company") {
                console.log("adding to the company");
                let company = yield this.companyRepository.findOne(data.id);
                if (!company) {
                    console.log("throw exception that no sucjh company exists");
                    throw new common_2.HttpException({
                        status: common_2.HttpStatus.EXPECTATION_FAILED,
                        error: 'EXPECTATION_FAILED',
                        message: "company does not exists",
                    }, common_2.HttpStatus.EXPECTATION_FAILED);
                }
                let organiation = yield this.organizationRepository.findOne(company.organization_id);
                if (!organiation) {
                    console.log("throw db error that somehow no org exists for the company");
                    throw new common_2.HttpException({
                        status: common_2.HttpStatus.EXPECTATION_FAILED,
                        error: 'EXPECTATION_FAILED',
                        message: "db error",
                    }, common_2.HttpStatus.EXPECTATION_FAILED);
                }
                if (adminUser.roles.includes(roles_constants_1.UserRole.PRODO_ADMIN)) {
                    console.log("he can definitely add the usr to the company");
                    if (user.companyIds.includes(data.id)) {
                        console.log("throw exception that user is already a part of the organiation");
                        throw new common_2.HttpException({
                            status: common_2.HttpStatus.EXPECTATION_FAILED,
                            error: 'EXPECTATION_FAILED',
                            message: "user already part of the company",
                        }, common_2.HttpStatus.EXPECTATION_FAILED);
                    }
                    else {
                        console.log("here add the user to the organization");
                        user.companyIds.push(data.id);
                        user.companyIdRoles.push({ id: data.id, role: data.role });
                    }
                }
                if (adminUser.accountId == organiation.account_id) {
                    console.log("the user is the super admin of the organization where the company resides therefore can perform the switching too");
                    if (company.status == "ACTIVE") {
                        if (user.companyIds.includes(data.id)) {
                            console.log("throw exception that user is already a part of the organiation");
                            throw new common_2.HttpException({
                                status: common_2.HttpStatus.EXPECTATION_FAILED,
                                error: 'EXPECTATION_FAILED',
                                message: "user already part of the company",
                            }, common_2.HttpStatus.EXPECTATION_FAILED);
                        }
                        else {
                            console.log("here add the user to the organization");
                            user.companyIds.push(data.id);
                            user.companyIdRoles.push({ id: data.id, role: data.role });
                        }
                    }
                    if (company.status == "INACTIVE") {
                        console.log("throw exception taht cannot add to nothing");
                        throw new common_2.HttpException({
                            status: common_2.HttpStatus.EXPECTATION_FAILED,
                            error: 'EXPECTATION_FAILED',
                            message: "company does not exists",
                        }, common_2.HttpStatus.EXPECTATION_FAILED);
                    }
                }
                for (let i of adminUser.orgIdRoles) {
                    if (i.id == organiation.id && i.role == "ORG_ADMIN") {
                        console.log("he too can perform the addition");
                        if (company.status == "ACTIVE") {
                            if (user.companyIds.includes(data.id)) {
                                console.log("throw exception that user is already a part of the organiation");
                                throw new common_2.HttpException({
                                    status: common_2.HttpStatus.EXPECTATION_FAILED,
                                    error: 'EXPECTATION_FAILED',
                                    message: "user is already part of the company",
                                }, common_2.HttpStatus.EXPECTATION_FAILED);
                            }
                            else {
                                console.log("here add the user to the organization");
                                user.companyIds.push(data.id);
                                user.companyIdRoles.push({ id: data.id, role: data.role });
                            }
                        }
                        if (company.status == "INACTIVE") {
                            console.log("throw exception taht cannot add to nothing");
                            throw new common_2.HttpException({
                                status: common_2.HttpStatus.EXPECTATION_FAILED,
                                error: 'EXPECTATION_FAILED',
                                message: "company does not exists",
                            }, common_2.HttpStatus.EXPECTATION_FAILED);
                        }
                    }
                }
                for (let i of adminUser.companyIdRoles) {
                    if (i.id == company.id && i.role == "COMPANY_ADMIN") {
                        console.log("he too can perform addition");
                        if (company.status == "ACTIVE") {
                            if (user.companyIds.includes(data.id)) {
                                console.log("throw exception that user is already a part of the organiation");
                                throw new common_2.HttpException({
                                    status: common_2.HttpStatus.EXPECTATION_FAILED,
                                    error: 'EXPECTATION_FAILED',
                                    message: "user already part of the organization",
                                }, common_2.HttpStatus.EXPECTATION_FAILED);
                            }
                            else {
                                console.log("here add the user to the organization");
                                user.companyIds.push(data.id);
                                user.companyIdRoles.push({ id: data.id, role: data.role });
                            }
                        }
                        if (company.status == "INACTIVE") {
                            console.log("throw exception taht cannot add to nothing");
                            throw new common_2.HttpException({
                                status: common_2.HttpStatus.EXPECTATION_FAILED,
                                error: 'EXPECTATION_FAILED',
                                message: "company does not exists",
                            }, common_2.HttpStatus.EXPECTATION_FAILED);
                        }
                    }
                }
            }
            if (type == "entity") {
                console.log("adding to the entity");
                let entity = yield this.entityRepository.findOne(data.id);
                if (!entity) {
                    console.log("throw exception that no entity exists ehre you made the request");
                    throw new common_2.HttpException({
                        status: common_2.HttpStatus.EXPECTATION_FAILED,
                        error: 'EXPECTATION_FAILED',
                        message: "Entity does not exists",
                    }, common_2.HttpStatus.EXPECTATION_FAILED);
                }
                let company = yield this.companyRepository.findOne(entity.companyId);
                if (!company) {
                    console.log("throw db error");
                    throw new common_2.HttpException({
                        status: common_2.HttpStatus.EXPECTATION_FAILED,
                        error: 'EXPECTATION_FAILED',
                        message: "db error",
                    }, common_2.HttpStatus.EXPECTATION_FAILED);
                }
                let organization = yield this.organizationRepository.findOne(entity.organization_id);
                if (!organization) {
                    console.log("throw exception that a db error has occured");
                    throw new common_2.HttpException({
                        status: common_2.HttpStatus.EXPECTATION_FAILED,
                        error: 'EXPECTATION_FAILED',
                        message: "db error",
                    }, common_2.HttpStatus.EXPECTATION_FAILED);
                }
                if (adminUser.roles.includes(roles_constants_1.UserRole.PRODO_ADMIN)) {
                    console.log("prodo aadmin can add the user");
                    if (user.entityIds.includes(data.id)) {
                        console.log("throw exception that user is already a part of the organiation");
                        throw new common_2.HttpException({
                            status: common_2.HttpStatus.EXPECTATION_FAILED,
                            error: 'EXPECTATION_FAILED',
                            message: "user already part of the entity",
                        }, common_2.HttpStatus.EXPECTATION_FAILED);
                    }
                    else {
                        console.log("here add the user to the organization");
                        user.entityIds.push(data.id);
                        user.entityIdRoles.push({ id: data.id, role: data.role });
                    }
                }
                if (adminUser.accountId == organization.account_id) {
                    console.log("admin User is the super admin of the entity therefore can perform addition");
                    if (entity.status == "ACTIVE") {
                        if (user.entityIds.includes(data.id)) {
                            console.log("throw exception that user is already a part of the organiation");
                            throw new common_2.HttpException({
                                status: common_2.HttpStatus.EXPECTATION_FAILED,
                                error: 'EXPECTATION_FAILED',
                                message: "user already part of the entity",
                            }, common_2.HttpStatus.EXPECTATION_FAILED);
                        }
                        else {
                            console.log("here add the user to the organization");
                            user.entityIds.push(data.id);
                            user.entityIdRoles.push({ id: data.id, role: data.role });
                        }
                    }
                    if (entity.status == "INACTIVE") {
                        console.log("throw exception that cannot add to nothing");
                        throw new common_2.HttpException({
                            status: common_2.HttpStatus.EXPECTATION_FAILED,
                            error: 'EXPECTATION_FAILED',
                            message: "entity does not exists",
                        }, common_2.HttpStatus.EXPECTATION_FAILED);
                    }
                }
                for (let i of adminUser.orgIdRoles) {
                    if (i.id == organization.id && i.role == "ORG_ADMIN") {
                        console.log("he too can perform addition");
                        if (entity.status == "ACTIVE") {
                            if (user.entityIds.includes(data.id)) {
                                console.log("throw exception that user is already a part of the organiation");
                                throw new common_2.HttpException({
                                    status: common_2.HttpStatus.EXPECTATION_FAILED,
                                    error: 'EXPECTATION_FAILED',
                                    message: "user already part of the entity",
                                }, common_2.HttpStatus.EXPECTATION_FAILED);
                            }
                            else {
                                console.log("here add the user to the organization");
                                user.entityIds.push(data.id);
                                user.entityIdRoles.push({ id: data.id, role: data.role });
                            }
                        }
                        if (entity.status == "INACTIVE") {
                            console.log("throw exception that cannot add to nothing");
                            throw new common_2.HttpException({
                                status: common_2.HttpStatus.EXPECTATION_FAILED,
                                error: 'EXPECTATION_FAILED',
                                message: "entity does not exists",
                            }, common_2.HttpStatus.EXPECTATION_FAILED);
                        }
                    }
                }
                for (let i of adminUser.companyIdRoles) {
                    if (i.id == company.id && i.role == "COMPANY_ADMIN") {
                        console.log("he too can perform addition");
                        if (entity.status == "ACTIVE") {
                            if (user.entityIds.includes(data.id)) {
                                console.log("throw exception that user is already a part of the organiation");
                                throw new common_2.HttpException({
                                    status: common_2.HttpStatus.EXPECTATION_FAILED,
                                    error: 'EXPECTATION_FAILED',
                                    message: "user alreeady part of the entity",
                                }, common_2.HttpStatus.EXPECTATION_FAILED);
                            }
                            else {
                                console.log("here add the user to the organization");
                                user.entityIds.push(data.id);
                                user.entityIdRoles.push({ id: data.id, role: data.role });
                            }
                        }
                        if (entity.status == "INACTIVE") {
                            console.log("throw exception that cannot add to nothing");
                            throw new common_2.HttpException({
                                status: common_2.HttpStatus.EXPECTATION_FAILED,
                                error: 'EXPECTATION_FAILED',
                                message: "entity does not exists",
                            }, common_2.HttpStatus.EXPECTATION_FAILED);
                        }
                    }
                }
                for (let i of adminUser.entityIdRoles) {
                    if (i.id == entity.id && i.role == "ENTITY_ADMIN") {
                        console.log("he too can perform addition");
                        if (entity.status == "ACTIVE") {
                            if (user.entityIds.includes(data.id)) {
                                console.log("throw exception that user is already a part of the organiation");
                                throw new common_2.HttpException({
                                    status: common_2.HttpStatus.EXPECTATION_FAILED,
                                    error: 'EXPECTATION_FAILED',
                                    message: "user already part of the entity",
                                }, common_2.HttpStatus.EXPECTATION_FAILED);
                            }
                            else {
                                console.log("here add the user to the organization");
                                user.entityIds.push(data.id);
                                user.entityIdRoles.push({ id: data.id, role: data.role });
                            }
                        }
                        if (entity.status == "INACTIVE") {
                            console.log("throw exception that cannot add to nothing");
                            throw new common_2.HttpException({
                                status: common_2.HttpStatus.EXPECTATION_FAILED,
                                error: 'EXPECTATION_FAILED',
                                message: "entity does not exists",
                            }, common_2.HttpStatus.EXPECTATION_FAILED);
                        }
                    }
                }
            }
            else {
                console.log("throw exception that invalid type is given");
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "ivalid type is given",
                }, common_2.HttpStatus.EXPECTATION_FAILED);
            }
        });
    }
    toDeleteUser(user, adminUser, data, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (type == "organization") {
                console.log("handling orgs");
                let organization = data.id;
                if (!organization) {
                    console.log("throw exception that organization does not exists to perform the action");
                    throw new common_2.HttpException({
                        status: common_2.HttpStatus.EXPECTATION_FAILED,
                        error: 'EXPECTATION_FAILED',
                        message: "organization does not exisys",
                    }, common_2.HttpStatus.EXPECTATION_FAILED);
                }
                if (adminUser.roles.includes(roles_constants_1.UserRole.PRODO_ADMIN)) {
                    console.log("he can definitely peforming the removal");
                    if (user.orgIds.includes(data.id)) {
                        console.log("only now wwe canperform operation");
                        for (let i of user.orgIds) {
                            if (i == data.id) {
                                user.orgIds.splice(i, 1);
                            }
                        }
                        for (let i of user.orgIdRoles) {
                            if (i.id == data.id) {
                                user.orgIds.splice(i, 1);
                            }
                        }
                        if (user.organizationId == `${data.id}`) {
                            user.organizationId = user.orgIds[0];
                        }
                    }
                    else {
                        console.log("user is already not part of the organization");
                        throw new common_2.HttpException({
                            status: common_2.HttpStatus.EXPECTATION_FAILED,
                            error: 'EXPECTATION_FAILED',
                            message: "User is laready not part of the organization",
                        }, common_2.HttpStatus.EXPECTATION_FAILED);
                    }
                }
                if (adminUser.accountId == organization.account_id) {
                    console.log("admin user is the super admiin of org therefore can perform the operation");
                    if (organization.status == "ACTIVE") {
                        if (user.orgIds.includes(data.id)) {
                            console.log("only now wwe canperform operation");
                            for (let i of user.orgIds) {
                                if (i == data.id) {
                                    user.orgIds.splice(i, 1);
                                }
                            }
                            for (let i of user.orgIdRoles) {
                                if (i.id == data.id) {
                                    user.orgIds.splice(i, 1);
                                }
                            }
                            if (user.organizationId == `${data.id}`) {
                                user.organizationId = user.orgIds[0];
                            }
                        }
                        else {
                            console.log("user is already not part of the organization");
                            throw new common_2.HttpException({
                                status: common_2.HttpStatus.EXPECTATION_FAILED,
                                error: 'EXPECTATION_FAILED',
                                message: "user is alreay not part of the organization",
                            }, common_2.HttpStatus.EXPECTATION_FAILED);
                        }
                    }
                    else {
                        console.log("handling ghost organization");
                        throw new common_2.HttpException({
                            status: common_2.HttpStatus.EXPECTATION_FAILED,
                            error: 'EXPECTATION_FAILED',
                            message: "organization does not exists",
                        }, common_2.HttpStatus.EXPECTATION_FAILED);
                    }
                }
            }
            if (type == "company") {
                console.log("handling company");
                let company = yield this.companyRepository.findOne(data.id);
                if (!company) {
                    console.log("throw exception that company does not exists");
                    throw new common_2.HttpException({
                        status: common_2.HttpStatus.EXPECTATION_FAILED,
                        error: 'EXPECTATION_FAILED',
                        message: "company does not exists",
                    }, common_2.HttpStatus.EXPECTATION_FAILED);
                }
                let organization = yield this.organizationRepository.findOne(company.organization_id);
                if (!organization) {
                    console.log("throw db error");
                    throw new common_2.HttpException({
                        status: common_2.HttpStatus.EXPECTATION_FAILED,
                        error: 'EXPECTATION_FAILED',
                        message: "Db error",
                    }, common_2.HttpStatus.EXPECTATION_FAILED);
                }
                if (adminUser.roles.includes(roles_constants_1.UserRole.PRODO_ADMIN)) {
                    console.log("he can definitely peforming the removal");
                    if (user.companyIds.includes(data.id)) {
                        console.log("only now wwe canperform operation");
                        for (let i of user.companyIds) {
                            if (i == data.id) {
                                user.companyIds.splice(i, 1);
                            }
                        }
                        for (let i of user.companyIdRoles) {
                            if (i.id == data.id) {
                                user.companyIdRoles.splice(i, 1);
                            }
                        }
                        if (user.companyId == `${data.id}`) {
                            user.companyId = user.companyIds[0];
                        }
                    }
                    else {
                        console.log("user is already not part of the organization");
                        throw new common_2.HttpException({
                            status: common_2.HttpStatus.EXPECTATION_FAILED,
                            error: 'EXPECTATION_FAILED',
                            message: "User already not part of the company",
                        }, common_2.HttpStatus.EXPECTATION_FAILED);
                    }
                }
                if (adminUser.accountId == organization.account_id) {
                    console.log("admin user is the super admin therefore he might");
                    if (company.status == "ACTIVE") {
                        if (user.companyIds.includes(data.id)) {
                            console.log("only now wwe canperform operation");
                            for (let i of user.companyIds) {
                                if (i == data.id) {
                                    user.companyIds.splice(i, 1);
                                }
                            }
                            for (let i of user.companyIdRoles) {
                                if (i.id == data.id) {
                                    user.companyIdRoles.splice(i, 1);
                                }
                            }
                            if (user.companyId == `${data.id}`) {
                                user.companyId = user.companyIds[0];
                            }
                        }
                        else {
                            console.log("user is already not part of the organization");
                            throw new common_2.HttpException({
                                status: common_2.HttpStatus.EXPECTATION_FAILED,
                                error: 'EXPECTATION_FAILED',
                                message: "user already not part of the company",
                            }, common_2.HttpStatus.EXPECTATION_FAILED);
                        }
                    }
                    else {
                        console.log("throw error handling ghost company");
                        throw new common_2.HttpException({
                            status: common_2.HttpStatus.EXPECTATION_FAILED,
                            error: 'EXPECTATION_FAILED',
                            message: "company does not exists",
                        }, common_2.HttpStatus.EXPECTATION_FAILED);
                    }
                }
                for (let i of adminUser.orgIdRoles) {
                    if (company.status == "ACTIVE") {
                        if (i.id == organization.id && i.role == "ORG_ADMIN") {
                            console.log("he too can perform the removal");
                            for (let i of user.companyIds) {
                                if (i == data.id) {
                                    user.companyIds.splice(i, 1);
                                }
                            }
                            for (let i of user.companyIdRoles) {
                                if (i.id == data.id) {
                                    user.companyIdRoles.splice(i, 1);
                                }
                            }
                            if (user.companyId == `${data.id}`) {
                                user.companyId = user.companyIds[0];
                            }
                        }
                        if (i.id == organization.id && i.role !== "ORG_ADMIN") {
                            console.log("throw exception that you cannot");
                            throw new common_2.HttpException({
                                status: common_2.HttpStatus.EXPECTATION_FAILED,
                                error: 'EXPECTATION_FAILED',
                                message: "Insufficient scope",
                            }, common_2.HttpStatus.EXPECTATION_FAILED);
                        }
                    }
                }
            }
            if (type == "entity") {
                console.log("handling entity");
                let entity = yield this.entityRepository.findOne(data.id);
                if (!entity) {
                    console.log("throw exception that the entity does not exists");
                    throw new common_2.HttpException({
                        status: common_2.HttpStatus.EXPECTATION_FAILED,
                        error: 'EXPECTATION_FAILED',
                        message: "entity does not exists",
                    }, common_2.HttpStatus.EXPECTATION_FAILED);
                }
                let company = yield this.companyRepository.findOne(entity.companyId);
                if (!company) {
                    console.log("db error");
                    throw new common_2.HttpException({
                        status: common_2.HttpStatus.EXPECTATION_FAILED,
                        error: 'EXPECTATION_FAILED',
                        message: "db error",
                    }, common_2.HttpStatus.EXPECTATION_FAILED);
                }
                let organization = yield this.organizationRepository.findOne(entity.organization_id);
                if (!organization) {
                    console.log("db error");
                    throw new common_2.HttpException({
                        status: common_2.HttpStatus.EXPECTATION_FAILED,
                        error: 'EXPECTATION_FAILED',
                        message: "db error",
                    }, common_2.HttpStatus.EXPECTATION_FAILED);
                }
                if (adminUser.roles.includes(roles_constants_1.UserRole.PRODO_ADMIN)) {
                    console.log("he can perfrom the removal");
                    if (user.entityIds.includes(data.id)) {
                        console.log("only now wwe canperform operation");
                        for (let i of user.entityIds) {
                            if (i == data.id) {
                                user.entityIds.splice(i, 1);
                            }
                        }
                        for (let i of user.entityIdRoles) {
                            if (i.id == data.id) {
                                user.entityIdRoles.splice(i, 1);
                            }
                        }
                        if (user.entityId == `${data.id}`) {
                            user.entityId = user.enityIds[0];
                        }
                    }
                    else {
                        console.log("user is already not part of the organization");
                        throw new common_2.HttpException({
                            status: common_2.HttpStatus.EXPECTATION_FAILED,
                            error: 'EXPECTATION_FAILED',
                            message: "user not part of the entity",
                        }, common_2.HttpStatus.EXPECTATION_FAILED);
                    }
                }
                if (adminUser.accountId == organization.account_id) {
                    console.log("adminuser is super admi of org");
                    if (entity.status == "ACTIVE") {
                        console.log("he too can peform the operation");
                        if (user.entityIds.includes(data.id)) {
                            console.log("only now wwe canperform operation");
                            for (let i of user.entityIds) {
                                if (i == data.id) {
                                    user.entityIds.splice(i, 1);
                                }
                            }
                            for (let i of user.entityIdRoles) {
                                if (i.id == data.id) {
                                    user.entityIdRoles.splice(i, 1);
                                }
                            }
                            if (user.entityId == `${data.id}`) {
                                user.entityId = user.enityIds[0];
                            }
                        }
                        else {
                            console.log("user is already not part of the organization");
                            throw new common_2.HttpException({
                                status: common_2.HttpStatus.EXPECTATION_FAILED,
                                error: 'EXPECTATION_FAILED',
                                message: "user not part of the entity",
                            }, common_2.HttpStatus.EXPECTATION_FAILED);
                        }
                    }
                    else {
                        console.log("handling ghost entity");
                        throw new common_2.HttpException({
                            status: common_2.HttpStatus.EXPECTATION_FAILED,
                            error: 'EXPECTATION_FAILED',
                            message: "enbtity does not exists",
                        }, common_2.HttpStatus.EXPECTATION_FAILED);
                    }
                }
                for (let i of adminUser.orgIdRoles) {
                    if (i.id == organization.id && i.role == "ORG_ADMIN") {
                        console.log("you can perform the operation");
                        if (entity.status == "ACTIVE") {
                            console.log("he too can peform the operation");
                            if (user.entityIds.includes(data.id)) {
                                console.log("only now wwe canperform operation");
                                for (let i of user.entityIds) {
                                    if (i == data.id) {
                                        user.entityIds.splice(i, 1);
                                    }
                                }
                                for (let i of user.entityIdRoles) {
                                    if (i.id == data.id) {
                                        user.entityIdRoles.splice(i, 1);
                                    }
                                }
                                if (user.entityId == `${data.id}`) {
                                    user.entityId = user.enityIds[0];
                                }
                            }
                            else {
                                console.log("user is already not part of the organization");
                                throw new common_2.HttpException({
                                    status: common_2.HttpStatus.EXPECTATION_FAILED,
                                    error: 'EXPECTATION_FAILED',
                                    message: "user not part of the entity",
                                }, common_2.HttpStatus.EXPECTATION_FAILED);
                            }
                        }
                        else {
                            console.log("handling ghost entity");
                            throw new common_2.HttpException({
                                status: common_2.HttpStatus.EXPECTATION_FAILED,
                                error: 'EXPECTATION_FAILED',
                                message: "entity does not exists",
                            }, common_2.HttpStatus.EXPECTATION_FAILED);
                        }
                    }
                }
                for (let i of adminUser.companyIdRoles) {
                    if (i.id == company.id && i.role == "COMPANY_ADMIN") {
                        console.log("you can perform the operation");
                        if (entity.status == "ACTIVE") {
                            console.log("he too can peform the operation");
                            if (user.entityIds.includes(data.id)) {
                                console.log("only now wwe canperform operation");
                                for (let i of user.entityIds) {
                                    if (i == data.id) {
                                        user.entityIds.splice(i, 1);
                                    }
                                }
                                for (let i of user.entityIdRoles) {
                                    if (i.id == data.id) {
                                        user.entityIdRoles.splice(i, 1);
                                    }
                                }
                                if (user.entityId == `${data.id}`) {
                                    user.entityId = user.enityIds[0];
                                }
                            }
                            else {
                                console.log("user is already not part of the organization");
                                throw new common_2.HttpException({
                                    status: common_2.HttpStatus.EXPECTATION_FAILED,
                                    error: 'EXPECTATION_FAILED',
                                    message: "user not part of the entity",
                                }, common_2.HttpStatus.EXPECTATION_FAILED);
                            }
                        }
                        else {
                            console.log("handling ghost entity");
                            throw new common_2.HttpException({
                                status: common_2.HttpStatus.EXPECTATION_FAILED,
                                error: 'EXPECTATION_FAILED',
                                message: "entity does not exists",
                            }, common_2.HttpStatus.EXPECTATION_FAILED);
                        }
                    }
                }
            }
            else {
                console.log("throw exception that invalid type provided");
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "ivalid type provided",
                }, common_2.HttpStatus.EXPECTATION_FAILED);
            }
        });
    }
    inviteUser(user, adminUser, data, type, id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (type == "organization") {
                let organization = yield this.organizationRepository.findOne(id);
                if (!organization) {
                    throw new common_2.HttpException({
                        status: common_2.HttpStatus.EXPECTATION_FAILED,
                        error: 'EXPECTATION_FAILED',
                        message: "Organization does not exist",
                    }, common_2.HttpStatus.EXPECTATION_FAILED);
                }
                if (adminUser.roles.includes(roles_constants_1.UserRole.PRODO_ADMIN) || adminUser.accountId == organization.account_id) {
                    if (user.orgIds.includes(id)) {
                        throw new common_2.HttpException({
                            status: common_2.HttpStatus.EXPECTATION_FAILED,
                            error: 'EXPECTATION_FAILED',
                            message: "User already in the organization",
                        }, common_2.HttpStatus.EXPECTATION_FAILED);
                    }
                    else {
                        let tempUser = yield this.tempUserService.existingInvite(data, adminUser, user, type);
                        return yield this.mailService.inviteUser(adminUser, user, type, data, organization, tempUser.id);
                    }
                }
                else {
                    console.log("chek for org admin");
                    for (let iterate of adminUser.orgIdRoles) {
                        if (iterate.id == id && iterate.role == "ORG_ADMIN") {
                            console.log("you can send the emails");
                            let tempUser = yield this.tempUserService.existingInvite(data, adminUser, user, type);
                            console.log("back from the ded");
                            let inviteId = tempUser.id;
                            let mailResponse = yield this.mailService.inviteUser(adminUser, user, type, data, organization, inviteId);
                            return mailResponse;
                        }
                    }
                    if (!adminUser.orgIds.includes(id)) {
                        console.log("throw exception adminuser not part oof the organization");
                        throw new common_2.HttpException({
                            status: common_2.HttpStatus.EXPECTATION_FAILED,
                            error: 'EXPECTATION_FAILED',
                            message: "You are not part of the organization",
                        }, common_2.HttpStatus.EXPECTATION_FAILED);
                    }
                }
            }
            if (type == "company") {
                console.log("company type invitation requested");
                let company = yield this.companyRepository.findOne(id);
                if (!company) {
                    console.log("throw exception that the copany does not exists in the db");
                    throw new common_2.HttpException({
                        status: common_2.HttpStatus.EXPECTATION_FAILED,
                        error: 'EXPECTATION_FAILED',
                        message: "company does not exist in the db",
                    }, common_2.HttpStatus.EXPECTATION_FAILED);
                }
                let organization = yield this.organizationRepository.findOne(company.organization_id);
                if (adminUser.roles.includes(roles_constants_1.UserRole.PRODO_ADMIN) || adminUser.accountId == organization.account_id) {
                    console.log("we can invite the user to  the specific company because the user is super admin ");
                    let tempUser = yield this.tempUserService.existingInvite(data, adminUser, user, type);
                    return yield this.mailService.inviteUser(adminUser, user, type, data, company, tempUser.id);
                }
                else {
                    console.log("chek for org admin");
                    if (!adminUser.companyIds.includes(id)) {
                        console.log("throw exception adminuser not part oof the organization");
                        throw new common_2.HttpException({
                            status: common_2.HttpStatus.EXPECTATION_FAILED,
                            error: 'EXPECTATION_FAILED',
                            message: "you are not part of the company",
                        }, common_2.HttpStatus.EXPECTATION_FAILED);
                    }
                    for (let iterate of adminUser.companyIdRoles) {
                        if (iterate.id == id && iterate.role == "COMPANY_ADMIN") {
                            console.log("you can send the emails");
                            let tempuser = yield this.tempUserService.existingInvite(data, adminUser, user, type);
                            return yield this.mailService.inviteUser(adminUser, user, type, data, company, tempuser.id);
                        }
                    }
                }
            }
            if (type == "entity") {
                console.log("entity type invite requested");
                let entity = yield this.entityRepository.findOne(id);
                let organization = yield this.organizationRepository.findOne(entity.organization_id);
                if (!organization) {
                    console.log("db error that the organization does not exists for the company");
                    throw new common_2.HttpException({
                        status: common_2.HttpStatus.EXPECTATION_FAILED,
                        error: 'EXPECTATION_FAILED',
                        message: "db error , organization does not exists for the entity",
                    }, common_2.HttpStatus.EXPECTATION_FAILED);
                }
                if (!entity) {
                    console.log("throw excepption that the entity does not exist");
                    throw new common_2.HttpException({
                        status: common_2.HttpStatus.EXPECTATION_FAILED,
                        error: 'EXPECTATION_FAILED',
                        message: "entity does not exist",
                    }, common_2.HttpStatus.EXPECTATION_FAILED);
                }
                if (adminUser.roles.includes(roles_constants_1.UserRole.PRODO_ADMIN) || adminUser.accountId == organization.account_id) {
                    console.log("we can invite the user to  the specific entity ");
                    yield this.tempUserService.existingInvite(data, adminUser, user, type);
                    return yield this.mailService.inviteUser(adminUser, user, type, data, entity);
                }
                else {
                    console.log("chek for org admin");
                    for (let iterate of adminUser.entityIdRoles) {
                        if (iterate.id == id && iterate.role == "ENTITY_ADMIN") {
                            console.log("you can send the emails");
                            yield this.tempUserService.existingInvite(data, adminUser, user, type);
                            return yield this.mailService.inviteUser(adminUser, user, type, data, entity);
                        }
                    }
                    if (!adminUser.entityIds.includes(id)) {
                        console.log("throw exception adminuser not part oof the organization");
                        throw new common_2.HttpException({
                            status: common_2.HttpStatus.EXPECTATION_FAILED,
                            error: 'EXPECTATION_FAILED',
                            message: "you cannot control the entity",
                        }, common_2.HttpStatus.EXPECTATION_FAILED);
                    }
                }
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "Invalid type provided",
                }, common_2.HttpStatus.EXPECTATION_FAILED);
            }
        });
    }
    transferUserData(adminUser, user, data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let organization = yield this.organizationRepository.findOne(data.id);
            if (!organization) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "Provided organization does not exists",
                }, common_2.HttpStatus.EXPECTATION_FAILED);
            }
            let companyIds = organization.companyIds;
            let entityIds = organization.entityIds;
            let check = user.orgIds.includes(organization.id);
            if (check) {
                console.log("user is already in the irganization in question");
                organization.account_id = user.accountId;
                for (let i of user.orgIdRoles) {
                    if (i.id == organization.id) {
                        i.role == "ORG_ADMIN";
                    }
                }
                for (let i of user.companyIds) {
                    if (companyIds.includes(i)) {
                        user.companyIds.splice(i, 1);
                    }
                }
                for (let i of user.companyIdRoles) {
                    if (companyIds.includes(i.id)) {
                        user.companyIdRoles.splice(i, 1);
                    }
                }
                user.companyIds.push(...organization.companyIds);
                for (let i of organization.companyIds) {
                    user.companyIdRoles.push({ id: i, role: "COMPANY_ADMIN" });
                }
                for (let i of user.entityIds) {
                    if (entityIds.includes(i)) {
                        user.entityIds.splice(i, 1);
                    }
                }
                for (let i of user.entityIdRoles) {
                    if (entityIds.includes(i.id)) {
                        user.entityIdRoles.splice(i, 1);
                    }
                }
                user.entityIds.push(...organization.entityIds);
                for (let i of organization.entityIds) {
                    user.entityIdRoles.push({ id: i, role: "ENTITY_ADMIN" });
                }
                for (let i of adminUser.orgIds) {
                    if (i == organization.id) {
                        adminUser.orgIds.splice(i, 1);
                    }
                }
                for (let i of adminUser.companyIds) {
                    if (companyIds.includes(i)) {
                        adminUser.companyIds.splice(i, 1);
                    }
                }
                for (let i of adminUser.companyIdRoles) {
                    if (companyIds.includes(i.id)) {
                        adminUser.companyIdRoles.splice(i, 1);
                    }
                }
                for (let i of adminUser.entityIds) {
                    if (entityIds.includes(i)) {
                        adminUser.entityIds.splice(i, 1);
                    }
                }
                for (let i of adminUser.entityIdRoles) {
                    if (companyIds.includes(i.id)) {
                        adminUser.entityIdRoles.splice(i, 1);
                    }
                }
                yield this.userRepository.save(user.id, user);
                yield this.userRepository.save(adminUser.id, adminUser);
            }
            else {
                console.log("user is not in the organization in question");
                organization.account_id = user.accountId;
                for (let i of user.companyIds) {
                    if (companyIds.includes(i)) {
                        user.companyIds.splice(i, 1);
                    }
                }
                for (let i of user.companyIdRoles) {
                    if (companyIds.includes(i.id)) {
                        user.companyIdRoles.splice(i, 1);
                    }
                }
                user.companyIds.push(...organization.companyIds);
                for (let i of organization.companyIds) {
                    user.companyIdRoles.push({ id: i, role: "COMPANY_ADMIN" });
                }
                for (let i of user.entityIds) {
                    if (entityIds.includes(i)) {
                        user.entityIds.splice(i, 1);
                    }
                }
                for (let i of user.entityIdRoles) {
                    if (entityIds.includes(i.id)) {
                        user.entityIdRoles.splice(i, 1);
                    }
                }
                user.entityIds.push(...organization.entityIds);
                for (let i of organization.entityIds) {
                    user.entityIdRoles.push({ id: i, role: "ENTITY_ADMIN" });
                }
                for (let i of adminUser.orgIds) {
                    if (i == organization.id) {
                        adminUser.orgIds.splice(i, 1);
                    }
                }
                for (let i of adminUser.companyIds) {
                    if (companyIds.includes(i)) {
                        adminUser.companyIds.splice(i, 1);
                    }
                }
                for (let i of adminUser.companyIdRoles) {
                    if (companyIds.includes(i.id)) {
                        adminUser.companyIdRoles.splice(i, 1);
                    }
                }
                for (let i of adminUser.entityIds) {
                    if (entityIds.includes(i)) {
                        adminUser.entityIds.splice(i, 1);
                    }
                }
                for (let i of adminUser.entityIdRoles) {
                    if (companyIds.includes(i.id)) {
                        adminUser.entityIdRoles.splice(i, 1);
                    }
                }
                yield this.userRepository.save(user.id, user);
                yield this.userRepository.save(adminUser.id, adminUser);
            }
            return { user: user, adminUser: adminUser };
        });
    }
    inviteUserToProdo(email, data, adminUser) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let tempUser;
            let organization = yield this.organizationRepository.findOne(data.id);
            if (!organization) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "Organization does not exists for the given id",
                }, common_2.HttpStatus.EXPECTATION_FAILED);
            }
            else {
                if (adminUser.accountId == organization.account_id) {
                    tempUser = yield this.tempUserService.newInvitesave(data, adminUser);
                    data.password = tempUser.password;
                    return yield this.mailService.inviteToProdo(email, adminUser, data, organization, tempUser.id);
                }
                for (let iterate of adminUser.orgIdRoles) {
                    if (iterate.id == organization.id && iterate.role == "ORG_ADMIN") {
                        tempUser = yield this.tempUserService.newInvitesave(data, adminUser);
                        data.password = tempUser.password;
                        return yield this.mailService.inviteToProdo(email, adminUser, data, organization, tempUser.id);
                    }
                    if (iterate.id == organization.id && iterate.role == "ORG_EMPLOYEE") {
                        throw new common_2.HttpException({
                            status: common_2.HttpStatus.EXPECTATION_FAILED,
                            error: 'EXPECTATION_FAILED',
                            message: "You are not the admin of the organization",
                        }, common_2.HttpStatus.EXPECTATION_FAILED);
                    }
                }
                if (adminUser.roles.includes(roles_constants_1.UserRole.PRODO_ADMIN)) {
                    tempUser = yield this.tempUserService.newInvitesave(data, adminUser);
                    data.password = tempUser.password;
                    return yield this.mailService.inviteToProdo(email, adminUser, data, organization, tempUser.id);
                }
            }
            return { message: "uncaught error" };
        });
    }
    acceptInviteNewUser(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let tempUser = yield this.tempUserService.InviteEditNewUser(id);
            if (!tempUser) {
                console.log("throw exception that the invitation does not exists");
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "You are not the admin of the organization",
                }, common_2.HttpStatus.EXPECTATION_FAILED);
            }
            let userObject = new user_entity_1.User();
            userObject.orgIds = tempUser.orgIds;
            userObject.orgRole = tempUser.orgRole;
            userObject.organization_id = tempUser.orgId;
            userObject.password = tempUser.password;
            userObject.email = tempUser.email;
            userObject.firstName = tempUser.name;
            userObject.roles = [roles_constants_1.UserRole.USER, roles_constants_1.UserRole.ADMIN, roles_constants_1.UserRole.CLIENT, roles_constants_1.UserRole.NewUser];
            yield this.tempUserService.statusChange(tempUser);
            yield this.userRepository.save(userObject);
            return { statusCode: 200, message: "user successfully saved in the db" };
        });
    }
    acceptInviteExistingUser(inviteId, userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let user = yield this.userRepository.findOne(userId);
            let tempUser = yield this.tempUserService.findOne(inviteId);
            if (!user || !tempUser || tempUser.status == "ACTIVE") {
                console.log("thow exception that an error has occured");
            }
            if (tempUser.inviteType == "organization") {
                user.orgIds.push(...tempUser.orgIds);
                user.orgIdRoles.push(...tempUser.orgIdRoles);
                yield this.tempUserService.statusChange(tempUser);
                return yield this.userRepository.update(user.id, user);
            }
            if (tempUser.inviteType == "entity") {
                user.entityIds.push(...tempUser.entityIds);
                user.entityIdRoles.push(...tempUser.entityIdRoles);
                yield this.tempUserService.statusChange(tempUser);
                return yield this.userRepository.update(user.id, user);
            }
            if (tempUser.inviteType == "company") {
                user.companyIds.push(...tempUser.companyIds);
                user.companyIdRoles.push(...tempUser.companyIdRoles);
                yield this.tempUserService.statusChange(tempUser);
                return yield this.userRepository.update(user.id, user);
            }
            return { message: "uncaught error" };
        });
    }
};
UserService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(user_entity_1.User)),
    tslib_1.__param(1, typeorm_1.InjectRepository(otp_entity_1.Otp)),
    tslib_1.__param(4, typeorm_1.InjectRepository(account_entity_1.Account)),
    tslib_1.__param(5, typeorm_1.InjectRepository(organization_entity_2.Organization)),
    tslib_1.__param(6, typeorm_1.InjectRepository(dashboardData_entity_1.dashboardData)),
    tslib_1.__param(7, typeorm_1.InjectRepository(salesOrderReview_entity_1.salesOrderReview)),
    tslib_1.__param(12, typeorm_1.InjectRepository(company_entity_1.Company)),
    tslib_1.__param(13, typeorm_1.InjectRepository(entity_entity_1.Entitie)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        mail_service_1.MailService,
        organization_service_1.OrganizationService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        mailTrigger_service_1.MailTriggerService,
        product_service_1.ProductService,
        category_service_1.CategoryService,
        tempuser_service_1.TempuserService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map