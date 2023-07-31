import { OrganizationModel } from './org-model.entity';
import { Repository } from "typeorm";
export declare class OrganizationModelRepository extends Repository<OrganizationModel> {
    filterForOrganization(organization_id: string): any;
    filterForCreator(created_by: string): any;
    filterForModifier(modified_by: string): any;
    filterForDeleted(deleted_by: string): any;
    filterForUser(user_id: string): any;
    saveWithUser(user_id: string, organization_id: string, territory_id: string, model: any): Promise<any>;
    saveWithUserAndOrganization(user_id: string, organization_id: string, model: any): Promise<any>;
    softDelete(user_id: string, organization_id: string, model: any): Promise<any>;
    softDeleteWithOrganization(user_id: string, model: any): Promise<any>;
    saveForProdo(model: any): Promise<any>;
    saveForOrganization(organization_id: string, model: any): Promise<any>;
}
