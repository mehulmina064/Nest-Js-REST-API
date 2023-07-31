"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const base_app_entity_1 = require("../common/base-app.entity");
let zohoBill = class zohoBill extends base_app_entity_1.BaseAppEntity {
};
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.ObjectIdColumn(),
    tslib_1.__metadata("design:type", Object)
], zohoBill.prototype, "id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "organization_id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "description", void 0);
tslib_1.__decorate([
    typeorm_1.Unique(['bill_id']),
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "bill_id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "branch_id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "branch_name", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Array)
], zohoBill.prototype, "purchaseorder_ids", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "vendor_id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "vendor_name", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "source_of_supply", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "destination_of_supply", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "gst_no", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "reference_invoice_type", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], zohoBill.prototype, "contact_category", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "gst_treatment", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "tax_treatment", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], zohoBill.prototype, "gst_return_details", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "invoice_conversion_type", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Number)
], zohoBill.prototype, "unused_credits_payable_amount", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "status", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "color_code", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "current_sub_status_id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "current_sub_status", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Array)
], zohoBill.prototype, "sub_statuses", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "bill_number", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "date", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Boolean)
], zohoBill.prototype, "is_pre_gst", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "due_date", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "discount_setting", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Boolean)
], zohoBill.prototype, "is_tds_amount_in_percent", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "tds_percent", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Number)
], zohoBill.prototype, "tds_amount", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "tax_account_id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Number)
], zohoBill.prototype, "payment_terms", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "payment_terms_label", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "payment_expected_date", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "reference_number", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "recurring_bill_id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Number)
], zohoBill.prototype, "due_by_days", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "due_in_days", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "currency_id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "currency_code", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "currency_symbol", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "currency_name_formatted", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Array)
], zohoBill.prototype, "documents", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Number)
], zohoBill.prototype, "price_precision", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Number)
], zohoBill.prototype, "exchange_rate", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Array)
], zohoBill.prototype, "custom_fields", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], zohoBill.prototype, "custom_field_hash", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "client_viewed_time", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Boolean)
], zohoBill.prototype, "is_tds_applied", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Boolean)
], zohoBill.prototype, "is_item_level_tax_calc", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Boolean)
], zohoBill.prototype, "is_inclusive_tax", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "tax_rounding", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "filed_in_vat_return_id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "filed_in_vat_return_name", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "filed_in_vat_return_type", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Boolean)
], zohoBill.prototype, "is_reverse_charge_applied", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Boolean)
], zohoBill.prototype, "is_uber_bill", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Boolean)
], zohoBill.prototype, "is_tally_bill", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Boolean)
], zohoBill.prototype, "track_discount_in_account", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Array)
], zohoBill.prototype, "line_items", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "submitted_date", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "submitted_by", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "approver_id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "submitter_id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Number)
], zohoBill.prototype, "adjustment", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "adjustment_description", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Number)
], zohoBill.prototype, "discount_amount", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Number)
], zohoBill.prototype, "discount", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Number)
], zohoBill.prototype, "discount_applied_on_amount", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Boolean)
], zohoBill.prototype, "is_discount_before_tax", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "discount_account_id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "discount_account_name", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "discount_type", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Number)
], zohoBill.prototype, "sub_total", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Number)
], zohoBill.prototype, "sub_total_inclusive_of_tax", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Number)
], zohoBill.prototype, "tax_total", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Number)
], zohoBill.prototype, "total", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Number)
], zohoBill.prototype, "payment_made", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Number)
], zohoBill.prototype, "vendor_credits_applied", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Boolean)
], zohoBill.prototype, "is_line_item_invoiced", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Array)
], zohoBill.prototype, "purchaseorders", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Array)
], zohoBill.prototype, "taxes", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "tax_override", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Number)
], zohoBill.prototype, "balance", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], zohoBill.prototype, "billing_address", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Array)
], zohoBill.prototype, "payments", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Array)
], zohoBill.prototype, "vendor_credits", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "created_time", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "created_by_id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "last_modified_time", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "last_modified_by_id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "reference_id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "notes", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "terms", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "attachment_name", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Number)
], zohoBill.prototype, "open_purchaseorders_count", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "template_id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "template_name", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "template_type", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "page_width", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "page_height", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "orientation", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Boolean)
], zohoBill.prototype, "is_approval_required", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Array)
], zohoBill.prototype, "allocated_landed_costs", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Array)
], zohoBill.prototype, "unallocated_landed_costs", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "entity_type", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Array)
], zohoBill.prototype, "credit_notes", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoBill.prototype, "reference_bill_id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Boolean)
], zohoBill.prototype, "can_send_in_mail", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Array)
], zohoBill.prototype, "approvers_list", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Boolean)
], zohoBill.prototype, "is_advanced_tracking_missing", void 0);
zohoBill = tslib_1.__decorate([
    typeorm_1.Entity('ZohoBill')
], zohoBill);
exports.zohoBill = zohoBill;
//# sourceMappingURL=zohoBill.entity.js.map