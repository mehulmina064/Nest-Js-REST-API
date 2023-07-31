"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const roles_constants_1 = require("./../users/roles.constants");
function filterSingleObject(obj, user) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (user.roles) {
            if (user.roles.includes(roles_constants_1.UserRole.PRODO)) {
                return obj;
            }
            if (user.roles.includes(roles_constants_1.UserRole.ADMIN) && obj.organization_id == user.organization_id) {
                return obj;
            }
            if (obj.createdBy == user.id) {
                return obj;
            }
        }
        return { "message": "You are not authorized to view this item" };
    });
}
exports.filterSingleObject = filterSingleObject;
function filterAllData(service, user) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (user) {
            const organization_id = user.organization_id;
            const user_id = user.id;
            if (user.roles) {
                if (user.roles.includes(roles_constants_1.UserRole.PRODO)) {
                    return yield service.findAll();
                }
                if (user.roles.includes(roles_constants_1.UserRole.ADMIN)) {
                    return yield service.findAll({ where: { organization_id: organization_id } });
                }
            }
            return yield service.findAll({ createdBy: user_id });
        }
        return { "message": "You are not authorized to view this item" };
    });
}
exports.filterAllData = filterAllData;
function ExcelDateToJSDate(serial) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        var utc_days = Math.floor(serial - 25569);
        var utc_value = utc_days * 86400;
        var date_info = new Date(utc_value * 1000);
        var fractional_day = serial - Math.floor(serial) + 0.0000001;
        var total_seconds = Math.floor(86400 * fractional_day);
        var seconds = total_seconds % 60;
        total_seconds -= seconds;
        var hours = Math.floor(total_seconds / (60 * 60));
        var minutes = Math.floor(total_seconds / 60) % 60;
        return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
    });
}
exports.ExcelDateToJSDate = ExcelDateToJSDate;
function generateSerialNumberUnimove(entity, org_id) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const last_serial = yield typeorm_1.getRepository(entity).findOne({
            where: {
                organization_id: org_id,
            },
            order: { serial: "DESC" }
        });
        if (last_serial) {
            let serial_number = last_serial.serialNumber;
            let serial_number_array = serial_number.split("/");
            let serial_number_array_length = serial_number_array.length;
            let serial_number_array_last_element = serial_number_array[serial_number_array_length - 1];
            let serial_number_array_last_element_length = serial_number_array_last_element.length;
            let serial_number_array_last_element_number = parseInt(serial_number_array_last_element.substring(1, serial_number_array_last_element_length));
            let new_serial_number_array_last_element_number = serial_number_array_last_element_number + 1;
            let new_serial_number_array_last_element = "B" + new_serial_number_array_last_element_number;
            let new_serial_number_array = serial_number_array;
            new_serial_number_array[serial_number_array_length - 1] = new_serial_number_array_last_element;
            let new_serial_number = new_serial_number_array.join("/");
            return new_serial_number;
        }
        else {
            return "B00001";
        }
    });
}
exports.generateSerialNumberUnimove = generateSerialNumberUnimove;
//# sourceMappingURL=utils.js.map