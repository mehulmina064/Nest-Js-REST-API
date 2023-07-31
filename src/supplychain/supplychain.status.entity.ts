import { ApiModelProperty } from "@nestjs/swagger";
import { BaseAppEntity } from "../common/common.entity";
import { Column, Entity, Generated, ObjectID, ObjectIdColumn } from "typeorm";

@Entity('SupplyChainStatus')
export class SupplyChainStatus extends BaseAppEntity {
    @ApiModelProperty()
    @ObjectIdColumn()
    id: ObjectID | undefined;

    @ApiModelProperty()
    @Column()
    documentType!: string;

    @ApiModelProperty()
    @Column()
    action!: string;

    @ApiModelProperty()
    @Column()
    actor!: string;

    @ApiModelProperty()
    @Column()
    statusforrequestee!: string;

    @ApiModelProperty()
    @Column()
    statusforrequestor!: string;

    @ApiModelProperty()
    @Column()
    statusforapprover!: string;

}

