import { Column, Entity, ObjectID, ObjectIdColumn,Unique } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { BaseAppEntity } from '../../../common/base-app.entity';



@Entity('ProductParentSku')
export class ProductPSku extends BaseAppEntity {
    
    @ApiModelProperty()
    @ObjectIdColumn()
    id: ObjectID | undefined;

    @ApiModelProperty()
    @Column()
    pSkuId?: string | "";

    @ApiModelProperty()
    @Column()
    productSku?: string | "";

}
