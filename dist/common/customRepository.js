"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
class OrganizationModelRepository extends typeorm_1.Repository {
    filterForOrganization(organization_id) {
        return this.find({ organization_id: organization_id });
    }
    filterForCreator(created_by) {
        return this.find({ createdBy: created_by });
    }
    filterForModifier(modified_by) {
        return this.find({ updatedBy: modified_by });
    }
    filterForDeleted(deleted_by) {
        return this.find({ deletedBy: deleted_by });
    }
    filterForUser(user_id) {
        const user = this.createQueryBuilder("User").where("User.id = :user_id", { user_id: user_id }).getOne();
        const organization = this.createQueryBuilder("Organization").where("Organization.id = :organization_id", { organization_id: user.organization_id }).getOne();
        const territory = this.createQueryBuilder("Territory").where("Territory.id = :territory_id", { territory_id: user.territory_id }).getOne();
        const filter = {
            createdBy: user_id,
            organization_id: user.organization_id,
            territory_id: user.territory_id
        };
        return this.find(filter);
    }
    saveWithUser(user_id, organization_id, territory_id, model) {
        model.createdBy = user_id;
        model.updatedBy = user_id;
        model.organization_id = organization_id;
        model.territory_id = territory_id;
        return this.save(model);
    }
    saveWithUserAndOrganization(user_id, organization_id, model) {
        model.createdBy = user_id;
        model.updatedBy = user_id;
        model.organization_id = organization_id;
        return this.save(model);
    }
    softDelete(user_id, organization_id, model) {
        model.deletedBy = user_id;
        model.deletedAt = new Date();
        model.organization_id = organization_id;
        return this.save(model);
    }
    softDeleteWithOrganization(user_id, model) {
        model.deletedBy = user_id;
        model.deletedAt = new Date();
        return this.save(model);
    }
    saveForProdo(model) {
        return this.save(model);
    }
    saveForOrganization(organization_id, model) {
        model.organization_id = organization_id;
        return this.save(model);
    }
}
exports.OrganizationModelRepository = OrganizationModelRepository;
//# sourceMappingURL=customRepository.js.map