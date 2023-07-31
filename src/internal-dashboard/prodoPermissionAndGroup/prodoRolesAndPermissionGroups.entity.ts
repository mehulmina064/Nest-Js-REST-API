import { Column, Entity, ObjectID, ObjectIdColumn,Unique } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { BaseAppEntity } from '../../common/base-app.entity';



@Entity('RolesAndPermission')
export class RolesAndPermission extends BaseAppEntity {
    
    @ApiModelProperty()
    @ObjectIdColumn()
    id: ObjectID | undefined;

    @ApiModelProperty()
    @Column()
    roleId?: string | "";

    @ApiModelProperty()
    @Column()
    permissionGroupId?: string | "";

    
}
