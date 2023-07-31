import { ApiModelProperty } from "@nestjs/swagger";
import { Entity, ObjectIdColumn, ObjectID,Column } from "typeorm";

@Entity('error-log')
export class ErrorLog {
    @ApiModelProperty()
    @ObjectIdColumn()
    id : ObjectID;

    @ApiModelProperty()
    @Column()
    userId : string;

    @ApiModelProperty()
    @Column()
    errorMessage : string;

    @ApiModelProperty()
    @Column()
    errorStack : string;

    @ApiModelProperty()
    @Column()
    errorDate : Date;

    }
