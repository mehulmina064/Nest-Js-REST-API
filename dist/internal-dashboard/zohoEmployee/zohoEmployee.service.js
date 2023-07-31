"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const zohoEmployee_entity_1 = require("./zohoEmployee.entity");
const token_entity_1 = require("../../sms/token.entity");
const CryptoJS = require("crypto-js");
const OTP = require("otp-generator");
const prodoRoles_constants_1 = require("./prodoRoles.constants");
const employeeOtp_entity_1 = require("./employeeOtp.entity");
const common_2 = require("@nestjs/common");
const mailTrigger_service_1 = require("../../mailTrigger/mailTrigger.service");
const node_fetch_1 = require("node-fetch");
let zohoEmployeeService = class zohoEmployeeService {
    constructor(zohoEmployeeRepository, zohoTokenRepository, mailTriggerService, employeeOtpRepository) {
        this.zohoEmployeeRepository = zohoEmployeeRepository;
        this.zohoTokenRepository = zohoTokenRepository;
        this.mailTriggerService = mailTriggerService;
        this.employeeOtpRepository = employeeOtpRepository;
    }
    findAll(query) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (query) {
                console.log(query);
                let data = yield this.zohoEmployeeRepository.findAndCount(query);
                return { data: data[0], count: data[1] };
            }
            else {
                let data = yield this.zohoEmployeeRepository.findAndCount();
                return { data: data[0], count: data[1] };
            }
        });
    }
    findByEmail(email) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.zohoEmployeeRepository.findOne({ where: { email } });
        });
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let user = yield this.zohoEmployeeRepository.findOne(id);
            if (user) {
                return user;
            }
            else {
                return Promise.reject(new common_2.HttpException('User not found', common_2.HttpStatus.BAD_REQUEST));
            }
        });
    }
    create(zohoEmployee, zohoUser) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const foundUser = yield this.zohoEmployeeRepository.findOne({ where: { email: zohoEmployee.email } });
            if (foundUser) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.FORBIDDEN,
                    error: 'Forbidden',
                    message: "Employee already exists"
                }, common_2.HttpStatus.FORBIDDEN);
            }
            if (!zohoEmployee.profile) {
                if (zohoUser.photo_url) {
                    zohoEmployee.profile = zohoUser.photo_url;
                }
                else {
                    zohoEmployee.profile = "https://prodo-files-upload.s3.ap-south-1.amazonaws.com/files/profile-pic.jpeg";
                }
            }
            zohoEmployee.password = CryptoJS.HmacSHA1(zohoEmployee.password, 'jojo').toString();
            zohoEmployee.zohoUserId = zohoUser.user_id;
            zohoEmployee.status = zohoEmployee_entity_1.ZohoEmployeeStatus.ACTIVE;
            zohoEmployee.type = zohoEmployee_entity_1.UserType.ZOHO;
            zohoEmployee.roles = [prodoRoles_constants_1.UserRole.USER, prodoRoles_constants_1.UserRole.EMPLOYEE];
            zohoEmployee.emailIds = zohoUser.email_ids;
            zohoEmployee.createdAt = zohoUser.created_time;
            zohoEmployee.isEmployee = zohoUser.is_employee;
            zohoEmployee.updatedAt = new Date();
            return yield this.zohoEmployeeRepository.save(zohoEmployee);
        });
    }
    update(id, user, role) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (user.roles && user.roles.length > 0) {
                if (role.find((str) => str === 'PRODO_ADMIN')) {
                    let data = yield this.zohoEmployeeRepository.update(id, user);
                    let saveUser = yield this.zohoEmployeeRepository.findOne(id);
                    return saveUser;
                }
                else {
                    throw new common_2.HttpException({
                        status: 400,
                        error: "You cannot change your own role",
                        message: "You cannot change your own role"
                    }, common_2.HttpStatus.BAD_REQUEST);
                }
            }
            else {
                let userCheck = yield this.zohoEmployeeRepository.findOne(id);
                if (userCheck) {
                    let data = yield this.zohoEmployeeRepository.update(id, user);
                    let saveUser = yield this.zohoEmployeeRepository.findOne(id);
                    return saveUser;
                }
                else {
                    throw new common_2.HttpException({
                        status: common_2.HttpStatus.BAD_REQUEST,
                        error: "User not found",
                        message: "User not found"
                    }, common_2.HttpStatus.BAD_REQUEST);
                }
            }
        });
    }
    softRemove(id, userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const user = yield this.zohoEmployeeRepository.findOne(id);
            if (user) {
                user.status = zohoEmployee_entity_1.ZohoEmployeeStatus.DELETED;
                user.deletedAt = new Date();
                user.deletedBy = userId;
                yield this.zohoEmployeeRepository.update(id, user);
                return user;
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.BAD_REQUEST,
                    error: "User not found",
                    message: "User not found"
                }, common_2.HttpStatus.BAD_REQUEST);
            }
        });
    }
    remove(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const user = yield this.zohoEmployeeRepository.findOne(id);
            if (user) {
                yield this.zohoEmployeeRepository.delete(id);
                return user;
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.BAD_REQUEST,
                    error: "User not found",
                    message: "User not found"
                }, common_2.HttpStatus.BAD_REQUEST);
            }
        });
    }
    setProfilePicture(profilePicture, userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let user = yield this.zohoEmployeeRepository.findOne(userId);
            if (user) {
                user.profile = profilePicture;
                let m = yield this.zohoEmployeeRepository.update(userId, user);
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
    updatePassword(id, user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            user.currentPassword = CryptoJS.HmacSHA1(user.currentPassword, 'jojo').toString();
            console.log(user);
            const foundUser = yield this.zohoEmployeeRepository.findOne(id);
            if (foundUser.password !== user.currentPassword) {
                return { status: 'failure', message: 'Current Password do not match' };
            }
            user.password = CryptoJS.HmacSHA1(user.newPassword, 'jojo').toString();
            user.confirmPassword = CryptoJS.HmacSHA1(user.confirmPassword, 'jojo').toString();
            if (user.password !== user.confirmPassword) {
                return { status: 'failure', message: 'Passwords do not match' };
            }
            yield this.zohoEmployeeRepository.update(id, { password: user.password });
            let saveUser = yield this.zohoEmployeeRepository.findOne(id);
            return saveUser;
        });
    }
    login(user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            user.password = CryptoJS.HmacSHA1(user.password, 'jojo').toString();
            const criteria = (user.email.indexOf('@') === -1) ? { contactNumber: user.email } : { email: user.email };
            const foundUser = yield this.zohoEmployeeRepository.findOne(criteria);
            console.log('foundUser in employeeService', foundUser);
            if (foundUser) {
                const pass = foundUser.password;
                if (pass != user.password) {
                    throw new common_2.HttpException({
                        status: 400,
                        error: "Bad Request",
                        message: 'Wrong Password',
                    }, common_2.HttpStatus.BAD_REQUEST);
                }
                foundUser.lastLoginAt = new Date();
                console.log("date", foundUser.lastLoginAt);
                yield this.zohoEmployeeRepository.update(foundUser.id, foundUser);
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
    generateOtp(contactNumber) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const otp = yield OTP.generate(6, { upperCase: false, specialChars: false, alphabets: false });
            yield this.employeeOtpRepository.save({ contactNumber, otp });
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
            const checkOtp = yield this.employeeOtpRepository.findOne({ contactNumber, otp });
            return !!checkOtp;
        });
    }
    forgotPassword(email) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let mobile = email;
            const criteria = (email.indexOf('@') === -1) ? (email = "") : (email = email);
            if (email == "") {
                const foundUser = yield this.zohoEmployeeRepository.findOne({ where: { contactNumber: mobile } });
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
                const foundUser = yield this.zohoEmployeeRepository.findOne({ where: { email: email } });
                console.log('foundUser', foundUser);
                if (foundUser) {
                    const otp = yield OTP.generate(6, { upperCase: false, specialChars: false, alphabets: false });
                    yield this.employeeOtpRepository.save({ email: foundUser.email, otp });
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
            if (email == "") {
                const foundUser = yield this.zohoEmployeeRepository.findOne({ where: { contactNumber: mobile } });
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
                        yield this.zohoEmployeeRepository.save(foundUser);
                        return { status: 'success', message: 'Password reset successfully' };
                    }
                }
                else {
                    return { status: 'failure', message: 'User not found' };
                }
            }
            else {
                const foundUser = yield this.zohoEmployeeRepository.findOne({ where: { email: email } });
                if (foundUser) {
                    const checkOtp = yield this.employeeOtpRepository.findOne({ where: { email: foundUser.email, otp: otp } });
                    console.log('checkOtp', checkOtp);
                    if (checkOtp) {
                        yield this.employeeOtpRepository.remove(checkOtp);
                        foundUser.password = CryptoJS.HmacSHA1(password, 'jojo').toString();
                        yield this.zohoEmployeeRepository.save(foundUser);
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
    uploadUsers(adminUser, file) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const data = xlsx.readFile(file.path);
            const sheet_name_list = data.SheetNames;
            const userData = xlsx.utils.sheet_to_json(data.Sheets[sheet_name_list[0]]);
            let users = [];
            for (let i = 0; i < userData.length; i++) {
                let user = userData[i];
                let newUser = {
                    "id": "",
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
                users.push(newUser);
            }
            return { status: 'success', message: 'Users uploaded successfully', users: users };
        });
    }
    zohoBookToken() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let zohoToken = yield this.zohoTokenRepository.findOne('62dfec85d3baa58e51c2fc65');
            if (!zohoToken) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.EXPECTATION_FAILED,
                    error: 'Token not found',
                    message: "Unverified",
                }, common_2.HttpStatus.EXPECTATION_FAILED);
            }
            let token = zohoToken.token;
            let kill;
            let res = yield node_fetch_1.default(`https://inventory.zoho.in/api/v1/salesorders?organization_id=60015092519`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                }
            })
                .then(res => res.json())
                .then(data => kill = data);
            if (kill.message == 'You are not authorized to perform this operation' || kill.code == 57 || kill.code == 6041) {
                token = yield this.newZohoBookToken();
                return token;
            }
            return token;
        });
    }
    newZohoBookToken() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let zohoToken = yield this.zohoTokenRepository.findOne('62dfec85d3baa58e51c2fc65');
            let zoho = yield node_fetch_1.default('https://accounts.zoho.in/oauth/v2/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    'refresh_token': '1000.da351bf4fa3f3e12efbc8d857136bdd4.935cf4a8f14bf3cafa77756340386482',
                    'client_id': '1000.',
                    'client_secret': 'a106415659f7c06d2406f446068c1739e81174c2b7',
                    'grant_type': 'refresh_token'
                })
            });
            zoho = yield zoho.text();
            zoho = JSON.parse(zoho);
            let token = "Zoho-oauthtoken ";
            token = token + zoho.access_token;
            zohoToken.token = token;
            yield this.zohoTokenRepository.update(zohoToken.id, zohoToken);
            return token;
        });
    }
    InventoryByID(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let token = yield this.zohoBookToken();
            let kill;
            let bill;
            let res = yield node_fetch_1.default(`https://books.zoho.in/api/v3/users/${id}?organization_id=60015092519`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                }
            })
                .then(res => res.json())
                .then(data => kill = data);
            if (kill.message == "You are not authorized to perform this operation" || kill.message == "This user is not associated with the CompanyID/CompanyName:60015313630." || kill.code == 57) {
                token = yield this.zohoBookToken();
                let res = yield node_fetch_1.default(`https://books.zoho.in/api/v3/users/${id}?organization_id=60015092519`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`,
                    }
                })
                    .then(res => res.json())
                    .then(data => kill = data);
            }
            bill = kill.user;
            if (bill == undefined) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.UNAUTHORIZED,
                    error: 'Token Expire at zoho users ',
                    response: kill,
                    message: "Zoho token issue contact admin Or check your id again ",
                }, common_2.HttpStatus.UNAUTHORIZED);
            }
            return bill;
        });
    }
    getZohoEmployeeByEmail(email) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let token = yield this.zohoBookToken();
            let kill;
            let bill;
            let res = yield node_fetch_1.default(`https://books.zoho.in/api/v3/users?organization_id=60015092519&email=${email}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                }
            })
                .then(res => res.json())
                .then(data => kill = data);
            if (kill.message == "You are not authorized to perform this operation" || kill.message == "This user is not associated with the CompanyID/CompanyName:60015313630." || kill.code == 57) {
                token = yield this.zohoBookToken();
                let res = yield node_fetch_1.default(`https://books.zoho.in/api/v3/users?organization_id=60015092519&email=${email}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`,
                    }
                })
                    .then(res => res.json())
                    .then(data => kill = data);
            }
            bill = kill.users;
            if (bill == undefined) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.UNAUTHORIZED,
                    error: 'Token Expire at zoho users ',
                    response: kill,
                    message: "Zoho token issue contact admin Or check your id again ",
                }, common_2.HttpStatus.UNAUTHORIZED);
            }
            if (bill.length > 0) {
                return bill[0];
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.NOT_FOUND,
                    error: 'user not found',
                    message: "Zoho User Not found on this email ",
                }, common_2.HttpStatus.NOT_FOUND);
            }
        });
    }
    customerDetails(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let token = yield this.zohoBookToken();
            let kill;
            let res = yield node_fetch_1.default(`https://books.zoho.in/api/v3/contacts/${id}?organization_id=60015092519`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                }
            })
                .then(res => res.json())
                .then(data => kill = data);
            if (kill.message == "You are not authorized to perform this operation" || kill.message == "This user is not associated with the CompanyID/CompanyName:60015313630." || kill.code == 57) {
                token = yield this.zohoBookToken();
                let res = yield node_fetch_1.default(`https://books.zoho.in/api/v3/contacts/${id}?organization_id=60015092519`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`,
                    }
                })
                    .then(res => res.json())
                    .then(data => kill = data);
            }
            let contact = kill.contact;
            if (contact) {
                return contact;
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.UNAUTHORIZED,
                    error: 'Token Expire at inventory sales order',
                    message: "Zoho token issue contact admin",
                }, common_2.HttpStatus.UNAUTHORIZED);
            }
        });
    }
    zohoAll(page) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!page) {
                page = 1;
            }
            let token = yield this.zohoBookToken();
            let kill;
            let res = yield node_fetch_1.default(`https://books.zoho.in/api/v3/users?organization_id=60015092519&page=${page}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                }
            })
                .then(res => res.json())
                .then(data => kill = data);
            if (kill.message == "You are not authorized to perform this operation" || kill.message == "This user is not associated with the CompanyID/CompanyName:60015092519." || kill.code == 57) {
                token = yield this.zohoBookToken();
                let res = yield node_fetch_1.default(`https://books.zoho.in/api/v3/users?organization_id=60015092519&page=${page}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`,
                    }
                })
                    .then(res => res.json())
                    .then(data => kill = data);
            }
            let users = kill.users;
            if (users == undefined) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.NOT_FOUND,
                    error: 'No data found in zoho',
                    message: "Not Found Data",
                }, common_2.HttpStatus.NOT_FOUND);
            }
            return { count: users.length, data: users };
        });
    }
    saveZohoUser(zohoEmployee) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let find = yield this.zohoEmployeeRepository.findOne({ where: { zohoUserId: zohoEmployee.user_id } });
            if (find) {
                console.log("updating old Employee");
                zohoEmployee.createdAt = find.createdAt ? find.createdAt : (zohoEmployee.createdAt ? zohoEmployee.createdAt : new Date());
                zohoEmployee.id = find.id;
                return zohoEmployee;
            }
            else {
                console.log("saving new Employee");
                return zohoEmployee;
            }
        });
    }
    saveFromZohoId(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let user = yield this.InventoryByID(id);
            return yield this.saveZohoUser(user);
        });
    }
    getAttachment(orderId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let token = yield this.zohoBookToken();
            let kill;
            let res = yield node_fetch_1.default(`https://books.zoho.in/api/v3/bills/${orderId}/attachment?organization_id=60015092519`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                    'Accept': '*/*'
                }
            })
                .then(data => kill = data.body);
            if (kill.message == "You are not authorized to perform this operation" || kill.message == "This user is not associated with the CompanyID/CompanyName:60015313630." || kill.code == 57) {
                token = yield this.zohoBookToken();
                let res = yield node_fetch_1.default(`https://books.zoho.in/api/v3/bills/${orderId}/attachment?organization_id=60015092519`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`,
                        'Accept': '*/*'
                    }
                })
                    .then(data => kill = data.body);
            }
            if (kill.code == 5) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.EXPECTATION_FAILED,
                    error: 'TOKEN issue',
                    message: "Attachment not found",
                }, common_2.HttpStatus.EXPECTATION_FAILED);
            }
            return kill;
        });
    }
    Summary(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let token = yield this.zohoBookToken();
            let kill;
            let res = yield node_fetch_1.default(`https://books.zoho.in/api/v3/bills/${id}?organization_id=60015092519`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                    'Accept': 'application/pdf'
                }
            })
                .then(data => kill = data.body);
            if (kill.message == "You are not authorized to perform this operation" || kill.message == "This user is not associated with the CompanyID/CompanyName:60015313630." || kill.code == 57) {
                token = yield this.zohoBookToken();
                let res = yield node_fetch_1.default(`https://books.zoho.in/api/v3/bills/${id}?organization_id=60015092519`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`,
                        'Accept': 'application/pdf'
                    }
                })
                    .then(data => kill = data.body);
            }
            if (kill.code == 5) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.EXPECTATION_FAILED,
                    error: 'TOKEN issue',
                    message: "summery not found",
                }, common_2.HttpStatus.EXPECTATION_FAILED);
            }
            return kill;
        });
    }
    check(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let check = yield this.zohoEmployeeRepository.findOne(id).then((res1) => {
                return res1;
            }).catch((err) => {
                return false;
            });
            return check;
        });
    }
};
zohoEmployeeService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(zohoEmployee_entity_1.zohoEmployee)),
    tslib_1.__param(1, typeorm_1.InjectRepository(token_entity_1.zohoToken)),
    tslib_1.__param(3, typeorm_1.InjectRepository(employeeOtp_entity_1.employeeOtp)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        mailTrigger_service_1.MailTriggerService,
        typeorm_2.Repository])
], zohoEmployeeService);
exports.zohoEmployeeService = zohoEmployeeService;
//# sourceMappingURL=zohoEmployee.service.js.map