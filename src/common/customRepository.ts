import { Organization } from './../organization/organization.entity';
import { User } from './../users/user.entity';
import { OrganizationModel } from './org-model.entity';
import { FindConditions, FindManyOptions, Repository } from "typeorm";
import { InjectRepository } from '@nestjs/typeorm';
export class OrganizationModelRepository extends Repository<OrganizationModel> {

   filterForOrganization(organization_id: string){

       return this.find({organization_id: organization_id});
   }
   filterForCreator(created_by: string){
       
       return this.find({createdBy: created_by});
   }
    filterForModifier(modified_by: string){
         
         return this.find({updatedBy: modified_by});
    }
    filterForDeleted(deleted_by: string){
            
            return this.find({deletedBy: deleted_by});
     }
     // Filter Content for User, on Organization and Territory
     filterForUser(user_id: string){
         const user = this.createQueryBuilder("User").where("User.id = :user_id", {user_id: user_id}).getOne();
            const organization = this.createQueryBuilder("Organization").where("Organization.id = :organization_id", {organization_id: user.organization_id}).getOne();
            const territory = this.createQueryBuilder("Territory").where("Territory.id = :territory_id", {territory_id: user.territory_id}).getOne();
            const filter = {
                createdBy: user_id,
                organization_id: user.organization_id,
                territory_id: user.territory_id
            }
            return this.find(filter);
    }
    saveWithUser(user_id: string, organization_id: string, territory_id: string, model: any){
        model.createdBy = user_id;
        model.updatedBy = user_id;
        model.organization_id = organization_id;
        model.territory_id = territory_id;
        return this.save(model);
    }
    saveWithUserAndOrganization(user_id: string, organization_id: string, model: any){
        model.createdBy = user_id;
        model.updatedBy = user_id;
        model.organization_id = organization_id;
        return this.save(model);
    }
    softDelete(user_id: string, organization_id: string, model: any){
        model.deletedBy = user_id;
        model.deletedAt = new Date();
        model.organization_id = organization_id;
        return this.save(model);
    }
    softDeleteWithOrganization(user_id: string, model: any){
        model.deletedBy = user_id;
        model.deletedAt = new Date();
        return this.save(model);
    }
    saveForProdo(model: any){
        return this.save(model);
    }
    saveForOrganization(organization_id: string, model: any){
        model.organization_id = organization_id;
        return this.save(model);
    }
    
    



}