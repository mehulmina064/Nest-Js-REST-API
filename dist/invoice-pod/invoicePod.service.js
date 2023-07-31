"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const invoicePod_entity_1 = require("./invoicePod.entity");
const node_fetch_1 = require("node-fetch");
const common_2 = require("@nestjs/common");
let invoicePodService = class invoicePodService {
    constructor(invoicePodRepository) {
        this.invoicePodRepository = invoicePodRepository;
    }
    findInvoiceDetails(token, invoiceId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let kill;
            let res = yield node_fetch_1.default(`https://inventory.zoho.in/api/v1/invoices/${invoiceId}?organization_id=60015092519`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                }
            })
                .then(res => res.json())
                .then(data => kill = data);
            if (kill.invoice) {
                return kill.invoice;
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.NOT_FOUND,
                    error: 'No data found in zoho',
                    Response: kill,
                    message: "Not Found invoice on this ida",
                }, common_2.HttpStatus.NOT_FOUND);
            }
        });
    }
    checkInvoicePod(invoiceId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let invoicePod = yield this.invoicePodRepository.findOne({ where: { zohoInvoiceId: invoiceId } });
            if (invoicePod) {
                if (invoicePod.validity >= 2) {
                    return { message: " POD Link Expired ", status: 400 };
                }
                else {
                    return { message: " POD Link Valid ", status: 200 };
                }
            }
            else {
                return { message: " POD Link Valid ", status: 200 };
            }
        });
    }
    saveDigitalPod(pod, token) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let invoicePod = yield this.invoicePodRepository.findOne({ where: { zohoInvoiceId: pod.zohoInvoiceId } });
            if (invoicePod) {
                if (invoicePod.validity >= 2) {
                    throw new common_2.HttpException({
                        status: common_2.HttpStatus.FORBIDDEN,
                        error: 'Forbidden',
                        message: " POD Link Expired "
                    }, common_2.HttpStatus.FORBIDDEN);
                }
                else {
                    pod.validity = invoicePod.validity + 1;
                    yield this.invoicePodRepository.update(invoicePod.id, pod);
                    yield this.savePodToZohoInventory(pod, token);
                    return { message: "Successfully Submmited POD", status: "200" };
                }
            }
            else {
                pod.validity = 1;
                yield this.savePodToZohoInventory(pod, token);
                return yield this.invoicePodRepository.save(pod);
            }
        });
    }
    saveSignaturePod(pod, token) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let invoicePod = yield this.invoicePodRepository.findOne({ where: { zohoInvoiceId: pod.zohoInvoiceId } });
            if (invoicePod) {
                if (invoicePod.validity >= 2) {
                    throw new common_2.HttpException({
                        status: common_2.HttpStatus.FORBIDDEN,
                        error: 'Forbidden',
                        message: " POD Link Expired "
                    }, common_2.HttpStatus.FORBIDDEN);
                }
                else {
                    pod.validity = invoicePod.validity + 1;
                    yield this.invoicePodRepository.update(invoicePod.id, pod);
                    yield this.savePodToZohoInventory(pod, token);
                    return { message: "Successfully Submmited POD", status: 200 };
                }
            }
            else {
                pod.validity = 1;
                yield this.savePodToZohoInventory(pod, token);
                return yield this.invoicePodRepository.save(pod);
            }
        });
    }
    savePodToZohoInventory(pod, token) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let out = {
                "record_name": `POD-${pod.zohoInvoiceId}`,
                "cf_invoice_number": pod.zohoInvoiceId,
                "cf_location": pod.podLocation ? pod.podLocation : "",
                "cf_pod_type": "Digital Signature with Receiver Photo",
                "cf_pod_1": pod.pod1 ? pod.pod1 : "",
                "cf_pod_2": pod.pod2 ? pod.pod2 : "",
                "cf_other_attachment_link_1": pod.otherAttachmentLinks[0] ? pod.otherAttachmentLinks[0] : "",
                "cf_other_attachment_link_2": pod.otherAttachmentLinks[1] ? pod.otherAttachmentLinks[1] : "",
                "cf_other_attachment_link_3": pod.otherAttachmentLinks[2] ? pod.otherAttachmentLinks[2] : "",
                "cf_other_attachment_link_4": pod.otherAttachmentLinks[3] ? pod.otherAttachmentLinks[3] : "",
                "cf_other_attachment_link_5": pod.otherAttachmentLinks[4] ? pod.otherAttachmentLinks[4] : "",
            };
            if (pod.podType == "Digital") {
                out.cf_pod_type = "Digital Signature with Receiver Photo";
            }
            else {
                out.cf_pod_type = "Signed Invoice";
            }
            let zoho1 = yield node_fetch_1.default('https://inventory.zoho.in/api/v1/cm_pod?organization_id=60015092519', {
                method: 'POST',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'Content-Length': '904'
                },
                body: JSON.stringify(out)
            });
            zoho1 = yield zoho1.text();
            zoho1 = JSON.parse(zoho1);
            return zoho1;
        });
    }
    renewPodLink(zohoInvoiceId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let invoicePod = yield this.invoicePodRepository.findOne({ where: { zohoInvoiceId: zohoInvoiceId } });
            if (invoicePod) {
                invoicePod.validity = 0;
                yield this.invoicePodRepository.update(invoicePod.id, invoicePod);
                return { message: "Successfully renewed POD Link", status: 200 };
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.FORBIDDEN,
                    error: 'Forbidden',
                    message: " No POD Link Exist "
                }, common_2.HttpStatus.FORBIDDEN);
            }
        });
    }
    getInvoicePods(zohoInvoiceId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let invoicePod = yield this.invoicePodRepository.find({ where: { zohoInvoiceId: zohoInvoiceId } });
            if (invoicePod.length > 0) {
                return invoicePod;
            }
            else {
                return [];
            }
        });
    }
};
invoicePodService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(invoicePod_entity_1.invoicePod)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], invoicePodService);
exports.invoicePodService = invoicePodService;
//# sourceMappingURL=invoicePod.service.js.map