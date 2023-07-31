import { ApiModelProperty } from "@nestjs/swagger";
import { Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";

@Entity('SACCode')
export class SACCode {
    
    @ApiModelProperty()
    @ObjectIdColumn()
    id: ObjectID;
    
    @ApiModelProperty()
    @Column()
    sacCode: string;
    
    @ApiModelProperty()
    @Column()
    description: string;
    
}

        