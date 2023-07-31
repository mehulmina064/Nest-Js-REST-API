"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const gst_entity_1 = require("./gst.entity");
const hsn_entity_1 = require("./hsn.entity");
const XLSX = require("xlsx");
const sac_entity_1 = require("./sac.entity");
let GstService = class GstService {
    constructor(gstRepository, hsnCodeRepository, sacCodeRepository) {
        this.gstRepository = gstRepository;
        this.hsnCodeRepository = hsnCodeRepository;
        this.sacCodeRepository = sacCodeRepository;
    }
    findAll() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.gstRepository.find();
        });
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.gstRepository.findOne(id);
        });
    }
    save(gst) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.gstRepository.save(gst);
        });
    }
    remove(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.gstRepository.remove(id);
        });
    }
    filter(filter) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.gstRepository.find(filter);
        });
    }
    update(id, gst) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.gstRepository.update(id, gst);
        });
    }
    bulkInsertFromExcelHSNSAC(file) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let workbook = XLSX.readFile(file.path);
            let sheet_name_list = workbook.SheetNames;
            let xlDataHSN = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            let xlDataSAC = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[1]]);
            let hsnList = [];
            let sacList = [];
            xlDataHSN.forEach(element => {
                let hsn = new hsn_entity_1.HSNCode();
                hsn.hsnCode = element['HSN Code'];
                hsn.description = element['HSN Description'];
                this.hsnCodeRepository.save(hsn);
                console.log(hsn);
                hsnList.push(hsn);
            });
            xlDataSAC.forEach(element => {
                let sac = new sac_entity_1.SACCode();
                sac.sacCode = element['SAC Code'];
                sac.description = element['SAC Description'];
                sacList.push(sac);
                this.sacCodeRepository.save(sac);
                console.log(sac);
            });
            return { "message": "success" };
        });
    }
    bulkInsertFromExcelGST(file) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let workbook = XLSX.readFile(file.path);
            let sheet_name_list = workbook.SheetNames;
            let xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            let gstList = [];
            xlData.forEach(element => {
                let gst = new gst_entity_1.Gst();
                gst.hsnCode = element['HSN Code No.'];
                gst.hsnCode4Digit = element['HSN Code 4 Digit'];
                gst.nameOfCommodity = element['Name of Commodity'];
                gst.chapterNo = element['Chapter No.'];
                gst.schedule = element['Sch.'];
                gst.gstRate = element['GSTRate'];
                gstList.push(gst);
                console.log(gst);
                this.gstRepository.save(gst);
            });
            return { 'message': 'success' };
        });
    }
    findByHSNCode(hsnCode) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (hsnCode.length == 4) {
                return yield this.gstRepository.findOne({ where: { hsnCode4Digit: hsnCode } });
            }
            else {
                let queryHSN = hsnCode.substring(0, 4);
                console.log(queryHSN);
                return yield this.gstRepository.findOne({ where: { hsnCode4Digit: queryHSN } });
            }
        });
    }
    findByHSNCode4Digit(hsnCode4Digit) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.gstRepository.findOne({ where: { hsnCode4Digit: new RegExp(hsnCode4Digit, 'i') } });
        });
    }
    SearchHSNSACCodeByDescription(description) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let hsncodes = yield this.hsnCodeRepository.find({ where: { description: new RegExp(`${description}`) } });
            let saccodes = yield this.sacCodeRepository.find({ where: { description: new RegExp(`${description}`) } });
            return { 'hsncodes': hsncodes, 'saccodes': saccodes };
        });
    }
    SearchDescriptionFromHsnCode(hsnCode) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let hsn = yield this.hsnCodeRepository.find({ where: { hsnCode: new RegExp(`${hsnCode}`) } });
            let sac = yield this.sacCodeRepository.find({ where: { sacCode: new RegExp(`${hsnCode}`) } });
            return { 'hsncodes': hsn, 'saccodes': sac };
        });
    }
};
GstService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(gst_entity_1.Gst)),
    tslib_1.__param(1, typeorm_1.InjectRepository(hsn_entity_1.HSNCode)),
    tslib_1.__param(2, typeorm_1.InjectRepository(sac_entity_1.SACCode)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], GstService);
exports.GstService = GstService;
//# sourceMappingURL=gst.service.js.map