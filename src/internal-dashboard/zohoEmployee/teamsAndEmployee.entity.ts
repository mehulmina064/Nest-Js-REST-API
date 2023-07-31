import { Column, Entity, ObjectID, ObjectIdColumn,Unique } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { BaseAppEntity } from '../../common/base-app.entity';


export enum Role {
    ADMIN = 'ADMIN',
    MEMBER = 'MEMBER',
    VIEWER = 'VIEWER',
  }

@Entity('UserAndRoles')
export class prodoRoles extends BaseAppEntity {
    
    @ApiModelProperty()
    @ObjectIdColumn()
    id: ObjectID | undefined;

    @ApiModelProperty()
    @Column()
    teamId?: string | "";

    @ApiModelProperty()
    @Column({
        type: 'enum',
        enum: Role,
        default: Role.MEMBER,
    })
    role: Role | undefined;

    @ApiModelProperty()
    @Column()
    userId?: string | "";

}
