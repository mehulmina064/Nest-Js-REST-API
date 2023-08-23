import { OrganizationModel } from "../common/org-model.entity";
import { Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";
import { ApiModelProperty } from "@nestjs/swagger";

@Entity('Attachmemts')
export class Attachment extends OrganizationModel {
    @ApiModelProperty()
    @ObjectIdColumn()
    id!: ObjectID;

    @ApiModelProperty()
    @Column()
    fileName!: string;

    @ApiModelProperty()
    @Column()
    fileType!: string;

    @ApiModelProperty()
    @Column()
    fileSize!: number;

    @ApiModelProperty()
    @Column()
    filePath!: string;

    @ApiModelProperty()
    @Column()
    fileUrl!: string;

    @ApiModelProperty()
    @Column()
    fileExtension!: string;

    @ApiModelProperty()
    @Column()
    fileMimeType!: string;

    @ApiModelProperty()
    @Column()
    fileDescription!: string;

    @ApiModelProperty()
    @Column()
    fileTags!: string;

    @ApiModelProperty()
    @Column()
    fileCategory!: string;

    @ApiModelProperty()
    @Column()
    fileSubCategory!: string;
    
}