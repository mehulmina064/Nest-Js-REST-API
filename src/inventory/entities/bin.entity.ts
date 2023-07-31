import { ApiModelProperty } from "@nestjs/swagger";
import { Entity,ObjectIdColumn,ObjectID,Column } from "typeorm";

@Entity('bin')
export class Bin {
  
    @ApiModelProperty()
    @ObjectIdColumn()
    id: ObjectID;

    // Required Fields for Warehouse Recycle Bin

    @ApiModelProperty()
    @Column()
    bin_no: string;

    @ApiModelProperty()
    @Column()
    bin_type: string;

    @ApiModelProperty()
    @Column()
    bin_description: string;

    @ApiModelProperty()
    @Column()
    bin_status: string;

    @ApiModelProperty()
    @Column()
    bin_location: string;

    @ApiModelProperty()
    @Column()
    bin_capacity: number;

    @ApiModelProperty()
    @Column()
    bin_measurements: {}

    
}