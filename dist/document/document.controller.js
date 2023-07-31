"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const organization_entity_1 = require("./../organization/organization.entity");
const user_entity_1 = require("../users/user.entity");
const constants_1 = require("./../common/constants");
const mail_service_1 = require("./../mail/mail.service");
const utils_1 = require("../common/utils");
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const document_service_1 = require("./document.service");
const document_entity_1 = require("./document.entity");
const supplychain_service_1 = require("../supplychain/supplychain.service");
const jwt_auth_guard_1 = require("../authentication/jwt-auth.guard");
const document_status_entity_1 = require("./document-status.entity");
const roles_constants_1 = require("./../users/roles.constants");
const category_service_1 = require("./../categories/category.service");
const client_data_service_1 = require("./../clientData/client-data.service");
const mailTrigger_service_1 = require("./../mailTrigger/mailTrigger.service");
let DocumentController = class DocumentController {
    constructor(documentService, supplychainService, mailService, categoryService, clientDataService, mailTriggerService) {
        this.documentService = documentService;
        this.supplychainService = supplychainService;
        this.mailService = mailService;
        this.categoryService = categoryService;
        this.clientDataService = clientDataService;
        this.mailTriggerService = mailTriggerService;
    }
    findAll(req, query) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield utils_1.filterAllData(this.documentService, req.user);
        });
    }
    getDocumentType(req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.documentService.getDocumentType();
        });
    }
    updateDocumentStatus(documentStatus, req, id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.documentService.updateDocumentStatus(id, documentStatus, req.user);
        });
    }
    updateOrder(req, id, document) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.documentService.updateOrder(id, document);
        });
    }
    filter(query) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.documentService.filter(query);
        });
    }
    getChartData(type, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.documentService.getChartData(type, req.user.organization_id);
        });
    }
    findOne(id, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const obj = yield this.documentService.findOne(id);
            if (obj) {
                return utils_1.filterSingleObject(obj, req.user);
            }
        });
    }
    findByOrgId(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (id === undefined || id === null || id === '') {
                return {
                    message: 'Organization id is required'
                };
            }
            return yield this.documentService.findByOrgId(id);
        });
    }
    save(document, query, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            document.createdBy = req.user.id;
            const user = yield typeorm_1.getMongoRepository(user_entity_1.User).findOne(req.user.id);
            const org = yield typeorm_1.getMongoRepository(organization_entity_1.Organization).findOne(req.user.organization_id);
            let saveDocument = yield this.documentService.save(document);
            let clientMailSubject = 'New Document Attached';
            let prodoMailSubject = 'New Document Attached';
            let clientContext = 'New Document Attached';
            let prodoContext = 'New Document Attached';
            let prodoMail = 'operations@prodo.in';
            let template = 'document';
            let TriggerName = '';
            let doc;
            if (document.type === document_entity_1.DocumentType.RFQ) {
                clientContext = `Your RFQ ${document.number} has been created, Please check the details.`;
                prodoContext = `New RFQ ${document.number} Created by ${user.firstName} from ${org.name}`;
                TriggerName = 'docRfq';
                doc = user;
            }
            if (document.type === document_entity_1.DocumentType.PO) {
                clientContext = `Your PO ${document.number} has been created`;
                prodoContext = `New PO ${document.number} Created`;
                TriggerName = 'docPo';
                doc = user;
            }
            if (document.type === document_entity_1.DocumentType.Order) {
                clientContext = `${user.firstName} Thank you for your order ${document.number}. Your procurement journey with Prodo has start-end And we're just as excited as you are.`;
                prodoContext = `${user.firstName} from ${org.name} has placed an order ${document.number}.`;
                TriggerName = 'docOrder';
                doc = user;
            }
            if (document.type === document_entity_1.DocumentType.Invoice) {
                clientContext = `Your Invoice ${document.number} has been created, Please check the details.`;
                prodoContext = `New Invoice ${document.number} Created by ${user.firstName} from ${org.name}`;
                TriggerName = 'docInvoice';
                doc = user;
            }
            let mailOptions = {
                TriggerName: TriggerName,
                doc: doc,
                templatevars: {
                    user: user,
                    doc: saveDocument,
                    org: org,
                    clientContext: clientContext,
                    prodoContext: prodoContext
                },
            };
            this.mailTriggerService.SendMail(mailOptions);
            return saveDocument;
        });
    }
    saveRfq(document) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const saveRfq = yield this.documentService.save(document);
            let mailOptions = {
                TriggerName: 'newRfq',
                doc: document.additionalData[0].formData,
                templatevars: {
                    doc: document,
                    formData: document.additionalData[0].formData,
                    context: 'RFQ Created'
                },
            };
            this.mailTriggerService.SendMail(mailOptions);
            return saveRfq;
        });
    }
    update(id, document, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log('req', req);
            document.updatedBy = req.user.id;
            return yield this.documentService.update(id, document);
        });
    }
    delete(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.documentService.remove(id);
        });
    }
    importClientData(req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.documentService.importClientData();
        });
    }
    getStatusTemplate(req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.documentService.getDocumentStatusTemplate();
        });
    }
    getDocumentTypeTemplate(req, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.documentService.getDocumentStatusTemplateByType(type);
        });
    }
    getActionsFromCode(req, code) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.documentService.getActionsFromCode(code);
        });
    }
    getStatusTemplateFromCode(req, code) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.documentService.getStatusTemplateFromCode(code);
        });
    }
    saveDocumentStatusTemplate(req, document) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.documentService.saveDocumentStatusTemplate(document);
        });
    }
    updateDocumentStatusTemplate(req, id, document) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.documentService.updateDocumentStatusTemplate(id, document);
        });
    }
    deleteDocumentStatusTemplate(req, id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.documentService.deleteDocumentStatusTemplate(id);
        });
    }
    importCdmData(req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.documentService.importClientData();
        });
    }
    cleanData(req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.documentService.cleanData();
        });
    }
    docClean() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const docs = yield typeorm_1.getMongoRepository(document_entity_1.Document).find();
            for (let doc of docs) {
                if (doc.id === null || doc.id === undefined || doc.id === '') {
                    yield this.documentService.delete(doc.id);
                }
            }
            return { message: 'done' };
        });
    }
    updateDocs() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const docs = yield typeorm_1.getMongoRepository(document_entity_1.Document).find();
            for (let doc of docs) {
                if (doc.type === document_entity_1.DocumentType.Order || doc.type === document_entity_1.DocumentType.PO || doc.type === document_entity_1.DocumentType.RFQ) {
                    doc.org_to_id = constants_1.PRODO_ORG_ID;
                    yield this.documentService.update(String(doc.id), doc);
                }
                if (doc.type === document_entity_1.DocumentType.Receipt || doc.type === document_entity_1.DocumentType.Invoice) {
                    doc.org_from_id = constants_1.PRODO_ORG_ID;
                    yield this.documentService.update(String(doc.id), doc);
                }
            }
            return { message: 'done' };
        });
    }
    getDescendants(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.documentService.getParent(id);
        });
    }
    getDescendantsTree(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.documentService.getChildren(id);
        });
    }
    getAncestors(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.documentService.getSiblings(id);
        });
    }
    getAncestorsTree(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.documentService.getChilderenTree(id);
        });
    }
    getParentTree(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.documentService.getParentTree(id);
        });
    }
    updatepieChart(data, data2) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let pieChart = data;
            let pieChart2 = data2;
            for (let i = 0; i < pieChart.length; i++) {
                let product = pieChart[i].name;
                pieChart[i].name = yield this.categoryService.categoryName(product);
            }
            for (let i = 0; i < pieChart2.length; i++) {
                let found = pieChart.find(element => element.name === pieChart2[i].name);
                if (found) {
                    found.value += Number(pieChart2[i].value) || 0;
                }
                else {
                    pieChart.push({ name: pieChart2[i].name, value: Number(pieChart2[i].value) });
                }
            }
            return pieChart;
        });
    }
    all_data(req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let data = {
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
            };
            let pieChart2 = [];
            let current_date = new Date();
            for (let i = 0; i < 12; i++) {
                let date = new Date(current_date.getFullYear(), current_date.getMonth() - i, 1);
                let month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
                data.barChart.push({ name: month, value: Number(0) });
            }
            let org_id = req.user.organization_id;
            let user_id = req.user.id;
            if (req.user.roles.includes(roles_constants_1.UserRole.PRODO)) {
                let orders = yield this.documentService.all_data({ where: { type: "Order" } });
                let clientData = yield this.clientDataService.findAll();
                let po = yield this.documentService.all_data({ where: { type: "PO" } });
                let rfq = yield this.documentService.all_data({ where: { type: "RFQ" } });
                if (orders) {
                    orders.forEach((C) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        data.orders.total++;
                        data.orders.submitted++;
                        data.payments.paid += Number(C.total_amount) || 0;
                        data.payments.total += Number(C.total_amount) || 0;
                        if (C.status) {
                            if (C.status === 'Delivered') {
                                data.orders.completed++;
                            }
                            else {
                                data.orders.inProgress++;
                            }
                        }
                        else {
                            if (C.current_status) {
                                if (C.current_status.status === 'Delivered') {
                                    data.orders.completed++;
                                }
                                else {
                                    data.orders.inProgress++;
                                }
                            }
                        }
                        if (C.category) {
                            if (C.total_amount > 0) {
                                let found = pieChart2.find(element => element.name === C.category);
                                if (found) {
                                    found.value += Number(C.total_amount) || 0;
                                }
                                else {
                                    pieChart2.push({ name: C.category, value: Number(C.total_amount) });
                                }
                            }
                        }
                        else {
                            let a;
                            for (a of C.line_items) {
                                if (a.categoryId) {
                                    let found = data.pieChart.find(element => element.name === a.categoryId);
                                    if (found) {
                                        found.value += Number(a.price) || 0;
                                    }
                                    else if (a.price > 0) {
                                        data.pieChart.push({ name: a.categoryId, value: Number(a.price * a.moq) });
                                    }
                                }
                            }
                        }
                        let date = new Date(C.date);
                        let month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
                        let foundBar = data.barChart.find(element => element.name === month);
                        if (foundBar) {
                            foundBar.value += Number(C.total_amount) || 0;
                        }
                        else if (month && C.total_amount > 0) {
                            data.barChart.push({ C: month, value: Number(C.total_amount) });
                        }
                    }));
                }
                if (clientData) {
                    clientData.forEach((C) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        data.orders.total++;
                        data.payments.paid += Number(C.amount_received) || 0;
                        data.payments.total += Number(C.invoice_amount_ex_gst) || 0;
                        let due_amount = Number(C.invoice_amount_ex_gst) || 0 - Number(C.amount_received) || 0;
                        data.payments.due += due_amount;
                        if (C.status === 'Delivered') {
                            data.orders.completed++;
                        }
                        else {
                            data.orders.inProgress++;
                        }
                        let found = pieChart2.find(element => element.name === C.category_of_products);
                        if (found) {
                            found.value += Number(C.invoice_amount_ex_gst) || 0;
                        }
                        else if (C.category_of_products && C.invoice_amount_ex_gst > 0) {
                            pieChart2.push({ name: C.category_of_products, value: Number(C.invoice_amount_ex_gst) });
                        }
                        let date = new Date(C.po_date);
                        let month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
                        let foundBar = data.barChart.find(element => element.name === month);
                        if (foundBar) {
                            foundBar.value += Number(C.invoice_amount_ex_gst) || 0;
                        }
                        else if (month && C.invoice_amount_ex_gst > 0) {
                            data.barChart.push({ C: month, value: Number(C.invoice_amount_ex_gst) });
                        }
                    }));
                }
                if (po) {
                    po.forEach((C) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        data.orders.total++;
                        data.orders.submitted++;
                        data.payments.paid += Number(C.total_amount) || 0;
                        data.payments.total += Number(C.total_amount) || 0;
                        if (C.status) {
                            if (C.status === 'Delivered') {
                                data.orders.completed++;
                            }
                            else {
                                data.orders.inProgress++;
                            }
                        }
                        else {
                            if (C.current_status) {
                                if (C.current_status.status === 'Delivered') {
                                    data.orders.completed++;
                                }
                                else {
                                    data.orders.inProgress++;
                                }
                            }
                        }
                        if (C.category) {
                            if (C.total_amount > 0) {
                                let found = pieChart2.find(element => element.name === C.category);
                                if (found) {
                                    found.value += Number(C.total_amount) || 0;
                                }
                                else {
                                    pieChart2.push({ name: C.category, value: Number(C.total_amount) });
                                }
                            }
                        }
                        else {
                            let a;
                            for (a of C.line_items) {
                                if (a.categoryId) {
                                    let found = data.pieChart.find(element => element.name === a.categoryId);
                                    if (found) {
                                        found.value += Number(a.price) || 0;
                                    }
                                    else if (a.price > 0) {
                                        data.pieChart.push({ name: a.categoryId, value: Number(a.price * a.moq) });
                                    }
                                }
                            }
                        }
                        let date = new Date(C.date);
                        let month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
                        let foundBar = data.barChart.find(element => element.name === month);
                        if (foundBar) {
                            foundBar.value += Number(C.total_amount) || 0;
                        }
                        else if (month && C.total_amount > 0) {
                            data.barChart.push({ C: month, value: Number(C.total_amount) });
                        }
                    }));
                }
                if (rfq) {
                    rfq.forEach((C) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        data.rfq.total_submitted++;
                        if (C.current_status) {
                            if ((C.current_status.status === 'RFQ Approved')) {
                                data.payments.paid += Number(C.total_amount) || 0;
                                data.payments.total += Number(C.total_amount) || 0;
                                data.rfq.approved++;
                                let a;
                                for (a of C.line_items) {
                                    if (a.categoryId) {
                                        let found = data.pieChart.find(element => element.name === a.categoryId);
                                        if (found) {
                                            found.value += Number(a.price) || 0;
                                        }
                                        else if (a.price > 0) {
                                            data.pieChart.push({ name: a.categoryId, value: Number(a.price * a.moq) });
                                        }
                                    }
                                }
                                let date = new Date(C.date);
                                let month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
                                let foundBar = data.barChart.find(element => element.name === month);
                                if (foundBar) {
                                    foundBar.value += Number(C.total_amount) || 0;
                                }
                                else if (month && C.total_amount > 0) {
                                    data.barChart.push({ C: month, value: Number(C.total_amount) });
                                }
                            }
                            else if (C.current_status.status === 'RFQ Rejected. Sorry for the inconvenience. Refer mail') {
                                data.rfq.rejected++;
                            }
                            else {
                                data.rfq.inProgress++;
                            }
                        }
                    }));
                }
            }
            else if (req.user.roles.includes(roles_constants_1.UserRole.ADMIN)) {
                let orders = yield this.documentService.all_data({ where: { type: "Order", organization_id: org_id } });
                let clientData = yield this.clientDataService.findAll({ where: { organization_id: org_id } });
                let po = yield this.documentService.all_data({ where: { type: "PO", organization_id: org_id } });
                let rfq = yield this.documentService.all_data({ where: { type: "RFQ", organization_id: org_id } });
                if (orders) {
                    orders.forEach((C) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        data.orders.total++;
                        data.orders.submitted++;
                        data.payments.paid += Number(C.total_amount) || 0;
                        data.payments.total += Number(C.total_amount) || 0;
                        if (C.status) {
                            if (C.status === 'Delivered') {
                                data.orders.completed++;
                            }
                            else {
                                data.orders.inProgress++;
                            }
                        }
                        else {
                            if (C.current_status) {
                                if (C.current_status.status === 'Delivered') {
                                    data.orders.completed++;
                                }
                                else {
                                    data.orders.inProgress++;
                                }
                            }
                        }
                        if (C.category) {
                            if (C.total_amount > 0) {
                                let found = pieChart2.find(element => element.name === C.category);
                                if (found) {
                                    found.value += Number(C.total_amount) || 0;
                                }
                                else {
                                    pieChart2.push({ name: C.category, value: Number(C.total_amount) });
                                }
                            }
                        }
                        else {
                            let a;
                            for (a of C.line_items) {
                                if (a.categoryId) {
                                    let found = data.pieChart.find(element => element.name === a.categoryId);
                                    if (found) {
                                        found.value += Number(a.price) || 0;
                                    }
                                    else if (a.price > 0) {
                                        data.pieChart.push({ name: a.categoryId, value: Number(a.price * a.moq) });
                                    }
                                }
                            }
                        }
                        let date = new Date(C.date);
                        let month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
                        let foundBar = data.barChart.find(element => element.name === month);
                        if (foundBar) {
                            foundBar.value += Number(C.total_amount) || 0;
                        }
                        else if (month && C.total_amount > 0) {
                            data.barChart.push({ C: month, value: Number(C.total_amount) });
                        }
                    }));
                }
                if (clientData) {
                    clientData.forEach((C) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        data.orders.total++;
                        data.payments.paid += Number(C.amount_received) || 0;
                        data.payments.total += Number(C.invoice_amount_ex_gst) || 0;
                        let due_amount = Number(C.invoice_amount_ex_gst) || 0 - Number(C.amount_received) || 0;
                        data.payments.due += due_amount;
                        if (C.status === 'Delivered') {
                            data.orders.completed++;
                        }
                        else {
                            data.orders.inProgress++;
                        }
                        let found = pieChart2.find(element => element.name === C.category_of_products);
                        if (found) {
                            found.value += Number(C.invoice_amount_ex_gst) || 0;
                        }
                        else if (C.category_of_products && C.invoice_amount_ex_gst > 0) {
                            pieChart2.push({ name: C.category_of_products, value: Number(C.invoice_amount_ex_gst) });
                        }
                        let date = new Date(C.po_date);
                        let month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
                        let foundBar = data.barChart.find(element => element.name === month);
                        if (foundBar) {
                            foundBar.value += Number(C.invoice_amount_ex_gst) || 0;
                        }
                        else if (month && C.invoice_amount_ex_gst > 0) {
                            data.barChart.push({ C: month, value: Number(C.invoice_amount_ex_gst) });
                        }
                    }));
                }
                if (po) {
                    po.forEach((C) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        data.orders.total++;
                        data.orders.submitted++;
                        data.payments.paid += Number(C.total_amount) || 0;
                        data.payments.total += Number(C.total_amount) || 0;
                        if (C.status) {
                            if (C.status === 'Delivered') {
                                data.orders.completed++;
                            }
                            else {
                                data.orders.inProgress++;
                            }
                        }
                        else {
                            if (C.current_status) {
                                if (C.current_status.status === 'Delivered') {
                                    data.orders.completed++;
                                }
                                else {
                                    data.orders.inProgress++;
                                }
                            }
                        }
                        if (C.category) {
                            if (C.total_amount > 0) {
                                let found = pieChart2.find(element => element.name === C.category);
                                if (found) {
                                    found.value += Number(C.total_amount) || 0;
                                }
                                else {
                                    pieChart2.push({ name: C.category, value: Number(C.total_amount) });
                                }
                            }
                        }
                        else {
                            let a;
                            for (a of C.line_items) {
                                if (a.categoryId) {
                                    let found = data.pieChart.find(element => element.name === a.categoryId);
                                    if (found) {
                                        found.value += Number(a.price) || 0;
                                    }
                                    else if (a.price > 0) {
                                        data.pieChart.push({ name: a.categoryId, value: Number(a.price * a.moq) });
                                    }
                                }
                            }
                        }
                        let date = new Date(C.date);
                        let month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
                        let foundBar = data.barChart.find(element => element.name === month);
                        if (foundBar) {
                            foundBar.value += Number(C.total_amount) || 0;
                        }
                        else if (month && C.total_amount > 0) {
                            data.barChart.push({ C: month, value: Number(C.total_amount) });
                        }
                    }));
                }
                if (rfq) {
                    rfq.forEach((C) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        data.rfq.total_submitted++;
                        if (C.current_status) {
                            if ((C.current_status.status === 'RFQ Approved')) {
                                data.payments.paid += Number(C.total_amount) || 0;
                                data.payments.total += Number(C.total_amount) || 0;
                                data.rfq.approved++;
                                let a;
                                for (a of C.line_items) {
                                    if (a.categoryId) {
                                        let found = data.pieChart.find(element => element.name === a.categoryId);
                                        if (found) {
                                            found.value += Number(a.price) || 0;
                                        }
                                        else if (a.price > 0) {
                                            data.pieChart.push({ name: a.categoryId, value: Number(a.price * a.moq) });
                                        }
                                    }
                                }
                                let date = new Date(C.date);
                                let month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
                                let foundBar = data.barChart.find(element => element.name === month);
                                if (foundBar) {
                                    foundBar.value += Number(C.total_amount) || 0;
                                }
                                else if (month && C.total_amount > 0) {
                                    data.barChart.push({ C: month, value: Number(C.total_amount) });
                                }
                            }
                            else if (C.current_status.status === 'RFQ Rejected. Sorry for the inconvenience. Refer mail') {
                                data.rfq.rejected++;
                            }
                            else {
                                data.rfq.inProgress++;
                            }
                        }
                    }));
                }
            }
            else {
                let orders = yield this.documentService.all_data({ where: { type: "Order", createdBy: user_id } });
                let clientData = yield this.clientDataService.findAll({ where: { createdBy: user_id } });
                let po = yield this.documentService.all_data({ where: { type: "PO", createdBy: user_id } });
                let rfq = yield this.documentService.all_data({ where: { type: "RFQ", createdBy: user_id } });
                if (orders) {
                    orders.forEach((C) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        data.orders.total++;
                        data.orders.submitted++;
                        data.payments.paid += Number(C.total_amount) || 0;
                        data.payments.total += Number(C.total_amount) || 0;
                        if (C.status) {
                            if (C.status === 'Delivered') {
                                data.orders.completed++;
                            }
                            else {
                                data.orders.inProgress++;
                            }
                        }
                        else {
                            if (C.current_status) {
                                if (C.current_status.status === 'Delivered') {
                                    data.orders.completed++;
                                }
                                else {
                                    data.orders.inProgress++;
                                }
                            }
                        }
                        if (C.category) {
                            if (C.total_amount > 0) {
                                let found = pieChart2.find(element => element.name === C.category);
                                if (found) {
                                    found.value += Number(C.total_amount) || 0;
                                }
                                else {
                                    pieChart2.push({ name: C.category, value: Number(C.total_amount) });
                                }
                            }
                        }
                        else {
                            let a;
                            for (a of C.line_items) {
                                if (a.categoryId) {
                                    let found = data.pieChart.find(element => element.name === a.categoryId);
                                    if (found) {
                                        found.value += Number(a.price) || 0;
                                    }
                                    else if (a.price > 0) {
                                        data.pieChart.push({ name: a.categoryId, value: Number(a.price * a.moq) });
                                    }
                                }
                            }
                        }
                        let date = new Date(C.date);
                        let month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
                        let foundBar = data.barChart.find(element => element.name === month);
                        if (foundBar) {
                            foundBar.value += Number(C.total_amount) || 0;
                        }
                        else if (month && C.total_amount > 0) {
                            data.barChart.push({ C: month, value: Number(C.total_amount) });
                        }
                    }));
                }
                if (clientData) {
                    clientData.forEach((C) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        data.orders.total++;
                        data.payments.paid += Number(C.amount_received) || 0;
                        data.payments.total += Number(C.invoice_amount_ex_gst) || 0;
                        let due_amount = Number(C.invoice_amount_ex_gst) || 0 - Number(C.amount_received) || 0;
                        data.payments.due += due_amount;
                        if (C.status === 'Delivered') {
                            data.orders.completed++;
                        }
                        else {
                            data.orders.inProgress++;
                        }
                        let found = pieChart2.find(element => element.name === C.category_of_products);
                        if (found) {
                            found.value += Number(C.invoice_amount_ex_gst) || 0;
                        }
                        else if (C.category_of_products && C.invoice_amount_ex_gst > 0) {
                            pieChart2.push({ name: C.category_of_products, value: Number(C.invoice_amount_ex_gst) });
                        }
                        let date = new Date(C.po_date);
                        let month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
                        let foundBar = data.barChart.find(element => element.name === month);
                        if (foundBar) {
                            foundBar.value += Number(C.invoice_amount_ex_gst) || 0;
                        }
                        else if (month && C.invoice_amount_ex_gst > 0) {
                            data.barChart.push({ C: month, value: Number(C.invoice_amount_ex_gst) });
                        }
                    }));
                }
                if (po) {
                    po.forEach((C) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        data.orders.total++;
                        data.orders.submitted++;
                        data.payments.paid += Number(C.total_amount) || 0;
                        data.payments.total += Number(C.total_amount) || 0;
                        if (C.status) {
                            if (C.status === 'Delivered') {
                                data.orders.completed++;
                            }
                            else {
                                data.orders.inProgress++;
                            }
                        }
                        else {
                            if (C.current_status) {
                                if (C.current_status.status === 'Delivered') {
                                    data.orders.completed++;
                                }
                                else {
                                    data.orders.inProgress++;
                                }
                            }
                        }
                        if (C.category) {
                            if (C.total_amount > 0) {
                                let found = pieChart2.find(element => element.name === C.category);
                                if (found) {
                                    found.value += Number(C.total_amount) || 0;
                                }
                                else {
                                    pieChart2.push({ name: C.category, value: Number(C.total_amount) });
                                }
                            }
                        }
                        else {
                            let a;
                            for (a of C.line_items) {
                                if (a.categoryId) {
                                    let found = data.pieChart.find(element => element.name === a.categoryId);
                                    if (found) {
                                        found.value += Number(a.price) || 0;
                                    }
                                    else if (a.price > 0) {
                                        data.pieChart.push({ name: a.categoryId, value: Number(a.price * a.moq) });
                                    }
                                }
                            }
                        }
                        let date = new Date(C.date);
                        let month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
                        let foundBar = data.barChart.find(element => element.name === month);
                        if (foundBar) {
                            foundBar.value += Number(C.total_amount) || 0;
                        }
                        else if (month && C.total_amount > 0) {
                            data.barChart.push({ C: month, value: Number(C.total_amount) });
                        }
                    }));
                }
                if (rfq) {
                    rfq.forEach((C) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        data.rfq.total_submitted++;
                        if (C.current_status) {
                            if ((C.current_status.status === 'RFQ Approved')) {
                                data.payments.paid += Number(C.total_amount) || 0;
                                data.payments.total += Number(C.total_amount) || 0;
                                data.rfq.approved++;
                                let a;
                                for (a of C.line_items) {
                                    if (a.categoryId) {
                                        let found = data.pieChart.find(element => element.name === a.categoryId);
                                        if (found) {
                                            found.value += Number(a.price) || 0;
                                        }
                                        else if (a.price > 0) {
                                            data.pieChart.push({ name: a.categoryId, value: Number(a.price * a.moq) });
                                        }
                                    }
                                }
                                let date = new Date(C.date);
                                let month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
                                let foundBar = data.barChart.find(element => element.name === month);
                                if (foundBar) {
                                    foundBar.value += Number(C.total_amount) || 0;
                                }
                                else if (month && C.total_amount > 0) {
                                    data.barChart.push({ C: month, value: Number(C.total_amount) });
                                }
                            }
                            else if (C.current_status.status === 'RFQ Rejected. Sorry for the inconvenience. Refer mail') {
                                data.rfq.rejected++;
                            }
                            else {
                                data.rfq.inProgress++;
                            }
                        }
                    }));
                }
            }
            data.pieChart = yield this.updatepieChart(data.pieChart, pieChart2);
            data.barChart = data.barChart.reverse();
            return data;
        });
    }
};
tslib_1.__decorate([
    common_2.Get(),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Request()), tslib_1.__param(1, common_1.Query()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentController.prototype, "findAll", null);
tslib_1.__decorate([
    common_2.Get('gettype'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentController.prototype, "getDocumentType", null);
tslib_1.__decorate([
    common_2.Patch('update-status/:id/'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Body()), tslib_1.__param(1, common_1.Request()), tslib_1.__param(2, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [document_status_entity_1.DocumentStatus, Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentController.prototype, "updateDocumentStatus", null);
tslib_1.__decorate([
    common_2.Patch('update-order/:id/'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Request()), tslib_1.__param(1, common_1.Param('id')), tslib_1.__param(2, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentController.prototype, "updateOrder", null);
tslib_1.__decorate([
    common_2.Get('filter'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Query()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentController.prototype, "filter", null);
tslib_1.__decorate([
    common_2.Get('chartdata/:type'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Param('type')), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentController.prototype, "getChartData", null);
tslib_1.__decorate([
    common_2.Get('documentbyid/:id'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentController.prototype, "findOne", null);
tslib_1.__decorate([
    common_2.Get('get-doc-by-org/:id'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentController.prototype, "findByOrgId", null);
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_2.Post(),
    tslib_1.__param(0, common_1.Body()), tslib_1.__param(1, common_1.Query()), tslib_1.__param(2, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [document_entity_1.Document, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentController.prototype, "save", null);
tslib_1.__decorate([
    common_2.Post('save-rfq'),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [document_entity_1.Document]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentController.prototype, "saveRfq", null);
tslib_1.__decorate([
    common_2.Patch('update/:id'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Body()), tslib_1.__param(2, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentController.prototype, "update", null);
tslib_1.__decorate([
    common_2.Delete('delete/:id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentController.prototype, "delete", null);
tslib_1.__decorate([
    common_2.Get('import-client-data'),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentController.prototype, "importClientData", null);
tslib_1.__decorate([
    common_2.Get('status-template'),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentController.prototype, "getStatusTemplate", null);
tslib_1.__decorate([
    common_2.Get('document-type-template/:type'),
    tslib_1.__param(0, common_1.Request()), tslib_1.__param(1, common_1.Param('type')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentController.prototype, "getDocumentTypeTemplate", null);
tslib_1.__decorate([
    common_2.Get('get-actions-from-code/:code'),
    tslib_1.__param(0, common_1.Request()), tslib_1.__param(1, common_1.Param('code')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentController.prototype, "getActionsFromCode", null);
tslib_1.__decorate([
    common_2.Get('get-status-template-from-code/:code'),
    tslib_1.__param(0, common_1.Request()), tslib_1.__param(1, common_1.Param('code')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentController.prototype, "getStatusTemplateFromCode", null);
tslib_1.__decorate([
    common_2.Post('save-status-template/'),
    tslib_1.__param(0, common_1.Request()), tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentController.prototype, "saveDocumentStatusTemplate", null);
tslib_1.__decorate([
    common_2.Patch('update-status-template/:id'),
    tslib_1.__param(0, common_1.Request()), tslib_1.__param(1, common_1.Param('id')), tslib_1.__param(2, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentController.prototype, "updateDocumentStatusTemplate", null);
tslib_1.__decorate([
    common_2.Delete('delete-status-template/:id'),
    tslib_1.__param(0, common_1.Request()), tslib_1.__param(1, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentController.prototype, "deleteDocumentStatusTemplate", null);
tslib_1.__decorate([
    common_2.Get('importdata'),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentController.prototype, "importCdmData", null);
tslib_1.__decorate([
    common_2.Get('clean-data'),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentController.prototype, "cleanData", null);
tslib_1.__decorate([
    common_2.Get('doc-clean'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentController.prototype, "docClean", null);
tslib_1.__decorate([
    common_2.Get('update-docs'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentController.prototype, "updateDocs", null);
tslib_1.__decorate([
    common_2.Get('predecessor/:id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentController.prototype, "getDescendants", null);
tslib_1.__decorate([
    common_2.Get('successors/:id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentController.prototype, "getDescendantsTree", null);
tslib_1.__decorate([
    common_2.Get('siblings/:id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentController.prototype, "getAncestors", null);
tslib_1.__decorate([
    common_2.Get('get-children-tree/:id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentController.prototype, "getAncestorsTree", null);
tslib_1.__decorate([
    common_2.Get('get-parent-tree/:id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentController.prototype, "getParentTree", null);
tslib_1.__decorate([
    common_2.Get('dashboard-data'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentController.prototype, "all_data", null);
DocumentController = tslib_1.__decorate([
    common_1.Controller('documents'),
    tslib_1.__metadata("design:paramtypes", [document_service_1.DocumentService, supplychain_service_1.SupplyChainService, mail_service_1.MailService, category_service_1.CategoryService, client_data_service_1.ClientDataService,
        mailTrigger_service_1.MailTriggerService])
], DocumentController);
exports.DocumentController = DocumentController;
//# sourceMappingURL=document.controller.js.map