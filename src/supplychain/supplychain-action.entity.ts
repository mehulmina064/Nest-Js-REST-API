import { ApiModelProperty } from "@nestjs/swagger";
import { Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";

@Entity('SupplyChainAction')
export class SupplyChainAction {
    @ApiModelProperty()
    @ObjectIdColumn()
    id: ObjectID | undefined;

    @ApiModelProperty()
    @Column()
    documentType: string;

    @ApiModelProperty()
    @Column()
    action: string;

}