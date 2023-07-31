// Create Entity 

import { ApiModelProperty } from "@nestjs/swagger";
import { Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";

@Entity('employee')
export class Employee {
    @ApiModelProperty()
    @ObjectIdColumn()
    id: ObjectID;

    @ApiModelProperty()
    @Column()
    name: string;

    @ApiModelProperty()
    @Column()
    age: number;

    @ApiModelProperty()
    @Column()
    salary: number;

    @ApiModelProperty()
    @Column()
    department: string;

    @ApiModelProperty()
    @Column()
    designation: string;

    @ApiModelProperty()
    @Column()
    joiningDate: string;

    @ApiModelProperty()
    @Column()
    email: string;

    @ApiModelProperty()
    @Column()
    mobileNumber: string;

    @ApiModelProperty()
    @Column()
    address: string;

    @ApiModelProperty()
    @Column()
    city: string;

    @ApiModelProperty()
    @Column()
    state: string;

    @ApiModelProperty()
    @Column()
    country: string;

    @ApiModelProperty()
    @Column()
    zipCode: string;

    @ApiModelProperty()
    @Column()
    profilePicture: string;

    @ApiModelProperty()
    @Column()
    companyId: string;

    @ApiModelProperty()
    @Column()
    userId: string;

}
