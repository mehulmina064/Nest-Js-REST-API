"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
var Document_1;
"use strict";
const user_entity_1 = require("./../users/user.entity");
const payment_terms_entity_1 = require("./../payments/payment-terms.entity");
const swagger_1 = require("@nestjs/swagger");
const org_model_entity_1 = require("../common/org-model.entity");
const typeorm_1 = require("typeorm");
const attachment_entity_1 = require("../attachments/attachment.entity");
const address_entity_1 = require("../addresses/address.entity");
var DocumentType;
(function (DocumentType) {
    DocumentType["RFQ"] = "RFQ";
    DocumentType["PO"] = "PO";
    DocumentType["Cart"] = "Cart";
    DocumentType["Quotation"] = "Quotation";
    DocumentType["Expense"] = "Expense";
    DocumentType["Invoice"] = "Invoice";
    DocumentType["DeliveryNote"] = "DeliveryNote";
    DocumentType["Receipt"] = "Receipt";
    DocumentType["Order"] = "Order";
    DocumentType["DebitNote"] = "DebitNote";
    DocumentType["DeliveryChalan"] = "DeliveryChalan";
    DocumentType["Other"] = "Other";
})(DocumentType = exports.DocumentType || (exports.DocumentType = {}));
var DocumentMode;
(function (DocumentMode) {
    DocumentMode["Information"] = "INFORMATION";
    DocumentMode["Attachment"] = "ATTACHMENT";
    DocumentMode["Both"] = "BOTH";
})(DocumentMode = exports.DocumentMode || (exports.DocumentMode = {}));
var DocumentAction;
(function (DocumentAction) {
    DocumentAction["Create"] = "Create";
    DocumentAction["Update"] = "Update";
    DocumentAction["Delete"] = "Delete";
    DocumentAction["Submit"] = "Submit";
    DocumentAction["Approve"] = "Approve";
    DocumentAction["Reject"] = "Reject";
    DocumentAction["Cancel"] = "Cancel";
    DocumentAction["Complete"] = "Complete";
    DocumentAction["InProgress"] = "InProgress";
    DocumentAction["OnHold"] = "OnHold";
    DocumentAction["Close"] = "Close";
})(DocumentAction = exports.DocumentAction || (exports.DocumentAction = {}));
class TransportDetails {
}
exports.TransportDetails = TransportDetails;
class DeliveryDetails {
}
exports.DeliveryDetails = DeliveryDetails;
class BillingDetails {
}
exports.BillingDetails = BillingDetails;
class Contact {
}
exports.Contact = Contact;
class Tax {
}
exports.Tax = Tax;
class Discount {
}
exports.Discount = Discount;
class LineItem {
}
exports.LineItem = LineItem;
class Organization {
}
exports.Organization = Organization;
let Document = Document_1 = class Document extends org_model_entity_1.OrganizationModel {
    constructor() {
        super(...arguments);
        this.statusTracking = [];
    }
    getActionAvailable(user) {
        if (this.actionAvailable) {
            if (user.organization_id == this.org_from_id) {
                return this.actionAvailable.from;
            }
            else if (user.organization_id == this.org_to_id) {
                return this.actionAvailable.to;
            }
        }
        return [];
    }
    getStatusTracking(user) {
        if (this.statusTracking) {
            if (user.organization_id == this.org_from_id) {
                return this.statusTracking;
            }
            else if (user.organization_id == this.org_to_id) {
                return this.statusTracking;
            }
        }
        return [];
    }
    getStatusTrackingByStatus(status) {
        if (this.statusTracking) {
            return this.statusTracking.filter(x => x.status == status);
        }
        return [];
    }
    saveDocumentStatus(status) {
        if (this.statusTracking) {
            this.statusTracking.push(status);
        }
        else {
            this.statusTracking = [status];
        }
    }
    getRelatedDocuments() {
        let docs = [];
        if (this.related_documents) {
            this.related_documents.forEach((x) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const doc = yield typeorm_1.getMongoRepository(Document_1).findOne(x);
                if (doc) {
                    docs.push(doc);
                }
            }));
            return docs;
        }
        return [];
    }
    getCreatedBy() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.createdBy) {
                return yield typeorm_1.getMongoRepository(user_entity_1.User).findOne(this.createdBy);
            }
            return null;
        });
    }
    getUpdatedBy() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.updatedBy) {
                return yield typeorm_1.getMongoRepository(user_entity_1.User).findOne(this.updatedBy);
            }
            return null;
        });
    }
    getOrganizationFrom() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.org_from_id) {
                return yield typeorm_1.getMongoRepository(Organization).findOne(this.org_from_id);
            }
            return null;
        });
    }
    getOrganizationTo() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.org_to_id) {
                return yield typeorm_1.getMongoRepository(Organization).findOne(this.org_to_id);
            }
            return null;
        });
    }
    getDeliveredBy() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.delivered_by) {
                return yield typeorm_1.getMongoRepository(Organization).findOne(this.delivered_by);
            }
            return null;
        });
    }
    getDeliveredTo() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.delivered_to) {
                return yield typeorm_1.getMongoRepository(Organization).findOne(this.delivered_to);
            }
            return null;
        });
    }
    getObjectAttachment() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.objectAttachment) {
                return yield typeorm_1.getMongoRepository(attachment_entity_1.Attachment).findOne(this.objectAttachment);
            }
            return null;
        });
    }
    getAttachments() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.attachments) {
                return yield typeorm_1.getMongoRepository(attachment_entity_1.Attachment).find({
                    where: {
                        _id: typeorm_1.In(this.attachments)
                    }
                });
            }
            return [];
        });
    }
    getPaymentTerms() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.paymentTerms) {
                return yield typeorm_1.getMongoRepository(payment_terms_entity_1.PaymentTerms).findOne(this.paymentTerms);
            }
            return null;
        });
    }
    getFulfillmentMonth() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.fulfillmentMonth) {
                return this.fulfillmentMonth;
            }
            return null;
        });
    }
};
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.ObjectIdColumn(),
    tslib_1.__metadata("design:type", typeorm_1.ObjectID)
], Document.prototype, "id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], Document.prototype, "number", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Date)
], Document.prototype, "date", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Date)
], Document.prototype, "due_date", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Document)
], Document.prototype, "predecessor", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Array)
], Document.prototype, "successors", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], Document.prototype, "currency", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], Document.prototype, "category", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], Document.prototype, "tax", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Number)
], Document.prototype, "tax_amount", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Number)
], Document.prototype, "sub_total", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], Document.prototype, "tax_rate", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Number)
], Document.prototype, "tax_rate_amount", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Number)
], Document.prototype, "discount_amount", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], Document.prototype, "current_status", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Number)
], Document.prototype, "discount_rate", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Number)
], Document.prototype, "total_amount", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], Document.prototype, "total_amount_in_words", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], Document.prototype, "total_amount_in_words_without_tax", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Array)
], Document.prototype, "line_items", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], Document.prototype, "org_from_id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], Document.prototype, "org_to_id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", address_entity_1.Address)
], Document.prototype, "shipping_from_address", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", address_entity_1.Address)
], Document.prototype, "shipping_to_address", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], Document.prototype, "delivery_slip_id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], Document.prototype, "transport_chalan", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", address_entity_1.Address)
], Document.prototype, "billing_address_from", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", address_entity_1.Address)
], Document.prototype, "billing_address_to", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Organization)
], Document.prototype, "delivered_by", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Organization)
], Document.prototype, "delivered_to", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], Document.prototype, "notes", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], Document.prototype, "terms", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], Document.prototype, "footer", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], Document.prototype, "template", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], Document.prototype, "template_type", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], Document.prototype, "template_name", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], Document.prototype, "template_id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], Document.prototype, "template_version", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column({ type: "enum", enum: DocumentType, default: DocumentType.Other }),
    tslib_1.__metadata("design:type", String)
], Document.prototype, "type", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Array)
], Document.prototype, "attachments", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], Document.prototype, "documentMode", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", attachment_entity_1.Attachment)
], Document.prototype, "objectAttachment", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Array)
], Document.prototype, "related_documents", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], Document.prototype, "actionAvailable", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", payment_terms_entity_1.PaymentTerms)
], Document.prototype, "paymentTerms", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Array)
], Document.prototype, "statusTracking", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Date)
], Document.prototype, "fulfillmentMonth", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Number)
], Document.prototype, "shippingCharges", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], Document.prototype, "rootDocumentId", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [user_entity_1.User]),
    tslib_1.__metadata("design:returntype", void 0)
], Document.prototype, "getActionAvailable", null);
Document = Document_1 = tslib_1.__decorate([
    typeorm_1.Entity("document")
], Document);
exports.Document = Document;
//# sourceMappingURL=document.entity.js.map