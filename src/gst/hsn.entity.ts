import { ApiModelProperty } from "@nestjs/swagger";
import { Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";

@Entity('HSNCode')
export class HSNCode {
    
    @ApiModelProperty()
    @ObjectIdColumn()
    id: ObjectID;
    
    @ApiModelProperty()
    @Column()
    hsnCode: string;
    
    @ApiModelProperty()
    @Column()
    description: string;
    
}

        