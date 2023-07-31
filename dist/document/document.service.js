"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const user_entity_1 = require("./../users/user.entity");
const document_status_entity_1 = require("./document-status.entity");
const client_data_entity_1 = require("./../clientData/client-data.entity");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const supplychain_entity_1 = require("../supplychain/supplychain.entity");
const typeorm_2 = require("typeorm");
const document_entity_1 = require("./document.entity");
const document_status_entity_2 = require("./document-status.entity");
const mailTrigger_service_1 = require("./../mailTrigger/mailTrigger.service");
let DocumentService = class DocumentService {
    constructor(documentRepository, supplychainRepository, clientDataRepository, statusTemplateRepository, mailTriggerService) {
        this.documentRepository = documentRepository;
        this.supplychainRepository = supplychainRepository;
        this.clientDataRepository = clientDataRepository;
        this.statusTemplateRepository = statusTemplateRepository;
        this.mailTriggerService = mailTriggerService;
    }
    name() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let x = "DocumentService";
            return x;
        });
    }
    findAll(filter) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (filter) {
                const data2 = yield this.documentRepository.find(filter);
                return (data2);
            }
            const data2 = yield this.documentRepository.find();
            return (data2);
        });
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.documentRepository.findOne(id);
        });
    }
    filter(filter) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.documentRepository.find(filter);
        });
    }
    update(id, document) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.documentRepository.update(id, document);
        });
    }
    remove(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const document = this.documentRepository.delete(String(id));
        });
    }
    getDocumentTypes() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return Object.keys(document_entity_1.DocumentType);
        });
    }
    getDocumentStatus() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return Object.keys(document_status_entity_2.DocumentStatus);
        });
    }
    save(document) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (document.id) {
                return yield this.documentRepository.update(document.id, document);
            }
            if (!document.id) {
                return yield this.documentRepository.save(document);
            }
            return yield this.documentRepository.save(document);
        });
    }
    importClientData() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const cds = yield this.clientDataRepository.find({
                where: {
                    organization_id: '627902e523d4fea60a7a2579'
                }
            }).then(result => {
                result.forEach((cd) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    function createOrder() {
                        return tslib_1.__awaiter(this, void 0, void 0, function* () {
                            const order = new document_entity_1.Document();
                            order.org_to_id = '62454e0db08559a53237cde1';
                            console.log(cd.organization_id);
                            order.org_from_id = cd.organization_id;
                            order.organization_id = cd.organization_id;
                            order.number = new Date().getTime().toString();
                            order.date = cd.po_date;
                            order.fulfillmentMonth = cd.fulfillment_month;
                            order.line_items = cd.line_items;
                            order.category = cd.category_of_products;
                            order.documentMode = document_entity_1.DocumentMode.Information;
                            order.total_amount = cd.invoice_amount_inc_gst;
                            order.type = document_entity_1.DocumentType.Order;
                            let current_status = new document_status_entity_2.DocumentStatus();
                            current_status.status = cd.status;
                            order.current_status = current_status;
                            const savedOrder = yield typeorm_2.getRepository(document_entity_1.Document).save(order);
                            console.log('savedOrder', savedOrder.org_from_id, savedOrder.org_to_id);
                            return savedOrder;
                        });
                    }
                    function createInvoice(order) {
                        return tslib_1.__awaiter(this, void 0, void 0, function* () {
                            const invoice = order;
                            delete invoice.id;
                            delete invoice._id;
                            invoice.type = document_entity_1.DocumentType.Invoice;
                            invoice.org_from_id = '62454e0db08559a53237cde1';
                            invoice.org_to_id = order.organization_id;
                            invoice.due_date = cd.due_date_of_receivable_from_client;
                            const savedInvoice = yield typeorm_2.getRepository(document_entity_1.Document).save(invoice);
                            console.log('savedInvoice', savedInvoice.org_from_id, savedInvoice.org_to_id);
                            return savedInvoice;
                        });
                    }
                    function createReceipt(invoice) {
                        return tslib_1.__awaiter(this, void 0, void 0, function* () {
                            let receipt = invoice;
                            delete receipt.id;
                            delete receipt._id;
                            receipt.type = document_entity_1.DocumentType.Receipt;
                            receipt.total_amount = cd.amount_received;
                            const savedReceipt = yield typeorm_2.getRepository(document_entity_1.Document).save(receipt);
                            console.log('savedReceipt', savedReceipt.org_from_id, savedReceipt.org_to_id);
                            return savedReceipt;
                        });
                    }
                    function createPurchaseOrder(order) {
                        return tslib_1.__awaiter(this, void 0, void 0, function* () {
                            let po = order;
                            delete po.id;
                            delete po._id;
                            po.org_from_id = order.organization_id;
                            po.org_to_id = '62454e0db08559a53237cde1';
                            po.number = cd.purchase_order;
                            po.type = document_entity_1.DocumentType.PO;
                            const savedPO = yield typeorm_2.getRepository(document_entity_1.Document).save(po);
                            console.log('savedPO', savedPO.org_from_id, savedPO.org_to_id);
                            return savedPO;
                        });
                    }
                    function relateDocuments(savedOrder, savedPO, savedReceipt, savedInvoice) {
                        savedOrder.related_documents = [savedPO.id, savedPO.id, savedReceipt.id];
                        savedOrder = typeorm_2.getRepository(document_entity_1.Document).save(savedOrder);
                        savedPO.related_documents = [savedOrder.id, savedInvoice.id, savedReceipt.id];
                        savedPO = typeorm_2.getRepository(document_entity_1.Document).save(savedPO);
                        savedInvoice.related_documents = [savedOrder.id, savedPO.id, savedReceipt.id];
                        savedInvoice = typeorm_2.getRepository(document_entity_1.Document).save(savedInvoice);
                        savedReceipt.related_documents = [savedOrder.id, savedPO.id, savedInvoice.id];
                        savedReceipt = typeorm_2.getRepository(document_entity_1.Document).save(savedReceipt);
                        console.log(`${savedOrder} ${savedPO.id} ${savedInvoice.id} ${savedReceipt.id}`);
                        return { savedOrder, savedPO, savedReceipt, savedInvoice };
                    }
                    createOrder().then(order => {
                        createInvoice(order).then(invoice => {
                            createReceipt(invoice).then(receipt => {
                                createPurchaseOrder(order).then(po => {
                                    relateDocuments(order, po, receipt, invoice);
                                });
                            });
                        });
                    });
                }));
            });
            return {
                message: 'success'
            };
        });
    }
    cleanData() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const org_ids = ['622326fd89dffa1358e0353a', '6221f7271fe327711fef3615', '6223272889dffa1358e0353d'];
            org_ids.forEach((org_id) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const cds = yield this.documentRepository.find({ organization_id: org_id });
                yield this.documentRepository.remove(cds);
                console.log(`${org_id} deleted`);
            }));
            return {
                message: 'success'
            };
        });
    }
    getDocumentStatusTemplate() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.statusTemplateRepository.find();
        });
    }
    getDocumentStatusTemplateByType(type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.statusTemplateRepository.find({ where: { type: type } });
        });
    }
    getDocumentStatusTemplateById(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.statusTemplateRepository.findOne(id);
        });
    }
    saveDocumentStatusTemplate(statusTemplate) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.statusTemplateRepository.save(statusTemplate);
        });
    }
    updateDocumentStatusTemplate(id, statusTemplate) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.statusTemplateRepository.update(id, statusTemplate);
        });
    }
    removeDocumentStatusTemplate(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.statusTemplateRepository.delete(id);
        });
    }
    getActionsFromCode(code) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const statusTemplate = yield this.statusTemplateRepository.findOne({ where: {
                    statuses: { $elemMatch: { code: code } }
                } });
            if (statusTemplate) {
                return statusTemplate.statuses.filter(status => status.code === code)[0].actionAvailable;
            }
            return [];
        });
    }
    getStatusTemplateFromCode(code) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const statusTemplate = yield this.statusTemplateRepository.findOne({ where: {
                    statuses: { $elemMatch: { code: code } }
                } });
            if (statusTemplate) {
                return statusTemplate.statuses.filter(status => status.code === code)[0];
            }
            return [];
        });
    }
    updateDocumentStatus(id, status, user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log('updateDocumentStatus', id, status, user);
            const foundUser = yield typeorm_2.getRepository(user_entity_1.User).findOne(user.id);
            const document = yield this.documentRepository.findOne(id);
            if (document) {
                document.current_status = status;
                status.updatedAt = new Date();
                status.updatedBy = String(user.id);
                document.statusTracking.push(status);
                document.current_status = status;
                const savedDocument = yield this.documentRepository.save(document);
                let mailOptions = {
                    TriggerName: 'DocumentStatusUpdate',
                    doc: document,
                    templatevars: {
                        document: document,
                        status: status.status,
                        description: status.description,
                        user: foundUser,
                        datetime: new Date().toDateString(),
                    }
                };
                this.mailTriggerService.SendMail(mailOptions);
                return savedDocument;
            }
        });
    }
    findByOrgId(org_id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log('findByOrgId', org_id);
            return yield this.documentRepository.find({
                where: {
                    $or: [
                        {
                            org_from_id: org_id
                        },
                        {
                            org_to_id: org_id
                        }
                    ]
                }
            });
        });
    }
    getRootDocs(org_id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.documentRepository.find({ where: {
                    organization_id: org_id,
                    parent_id: null
                } });
        });
    }
    getChildDocs(parent_id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.documentRepository.find({ where: {
                    parent_id: parent_id
                } });
        });
    }
    getDocsByType(type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.documentRepository.find({ where: {
                    type: type
                } });
        });
    }
    getParent(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const doc = yield this.documentRepository.findOne(id);
            if (doc) {
                return yield this.documentRepository.findOne(doc.predecessor);
            }
            return null;
        });
    }
    getChildren(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const doc = yield this.documentRepository.findOne(id);
            if (doc) {
                return yield this.documentRepository.find({ where: {
                        predecessor: id
                    } });
            }
            return [];
        });
    }
    getSiblings(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const doc = yield this.documentRepository.findOne(id);
            if (doc) {
                return yield this.documentRepository.find({ where: {
                        predecessor: doc.predecessor
                    } });
            }
            return [];
        });
    }
    getSiblingsTree(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const doc = yield this.documentRepository.findOne(id);
            if (doc) {
                return yield this.documentRepository.find({ where: {
                        predecessor: doc.predecessor
                    } });
            }
            return [];
        });
    }
    getChildrenTree(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const children = yield this.getChildren(id);
            const childrenTree = [];
            for (const child of children) {
                childrenTree.push(child);
                const childChildren = yield this.getChildren(child.id);
                if (childChildren.length > 0) {
                    childrenTree.push(...childChildren);
                }
            }
            return childrenTree;
        });
    }
    updateOrder(id, document) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.documentRepository.update(id, document);
        });
    }
    all_data(filter) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const cds = yield this.documentRepository.find(filter);
            return cds;
        });
    }
};
DocumentService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(document_entity_1.Document)),
    tslib_1.__param(1, typeorm_1.InjectRepository(supplychain_entity_1.SupplyChain)),
    tslib_1.__param(2, typeorm_1.InjectRepository(client_data_entity_1.ClientData)),
    tslib_1.__param(3, typeorm_1.InjectRepository(document_status_entity_1.StatusTemplate)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        mailTrigger_service_1.MailTriggerService])
], DocumentService);
exports.DocumentService = DocumentService;
//# sourceMappingURL=document.service.js.map