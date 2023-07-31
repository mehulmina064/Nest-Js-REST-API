"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
var fieldType;
(function (fieldType) {
    fieldType["text"] = "text";
    fieldType["textarea"] = "textarea";
    fieldType["number"] = "number";
    fieldType["date"] = "date";
    fieldType["select"] = "select";
    fieldType["checkbox"] = "checkbox";
    fieldType["radio"] = "radio";
    fieldType["file"] = "file";
    fieldType["image"] = "image";
    fieldType["hidden"] = "hidden";
    fieldType["password"] = "password";
    fieldType["email"] = "email";
    fieldType["url"] = "url";
    fieldType["color"] = "color";
    fieldType["range"] = "range";
    fieldType["tel"] = "tel";
    fieldType["search"] = "search";
    fieldType["dateTimeLocal"] = "dateTimeLocal";
    fieldType["month"] = "month";
    fieldType["week"] = "week";
    fieldType["time"] = "time";
    fieldType["colorPicker"] = "colorPicker";
    fieldType["slider"] = "slider";
    fieldType["rangeSlider"] = "rangeSlider";
    fieldType["switch"] = "switch";
    fieldType["editor"] = "editor";
    fieldType["editorMd"] = "editorMd";
    fieldType["editorTinyMce"] = "editorTinyMce";
    fieldType["editorCkEditor"] = "editorCkEditor";
    fieldType["editorTinyMce4"] = "editorTinyMce4";
})(fieldType = exports.fieldType || (exports.fieldType = {}));
class AdditionalFields {
}
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], AdditionalFields.prototype, "fieldName", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], AdditionalFields.prototype, "fieldValue", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column({ type: 'enum', enum: fieldType, default: fieldType.text }),
    tslib_1.__metadata("design:type", String)
], AdditionalFields.prototype, "fieldType", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], AdditionalFields.prototype, "fieldOptions", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Boolean)
], AdditionalFields.prototype, "fieldRequired", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Number)
], AdditionalFields.prototype, "fieldOrder", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], AdditionalFields.prototype, "fieldGroup", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Number)
], AdditionalFields.prototype, "fieldGroupOrder", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], AdditionalFields.prototype, "fieldGroupName", void 0);
exports.AdditionalFields = AdditionalFields;
class AdditionalFieldsGroup {
}
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], AdditionalFieldsGroup.prototype, "groupName", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Number)
], AdditionalFieldsGroup.prototype, "groupOrder", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Array)
], AdditionalFieldsGroup.prototype, "groupFields", void 0);
exports.AdditionalFieldsGroup = AdditionalFieldsGroup;
//# sourceMappingURL=additional-fields.interface.js.map