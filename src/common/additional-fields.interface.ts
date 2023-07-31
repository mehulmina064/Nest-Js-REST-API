import { ApiModelProperty } from "@nestjs/swagger";
import { Column } from "typeorm";

export enum fieldType {
    text = 'text',
    textarea = 'textarea',
    number = 'number',
    date = 'date',
    select = 'select',
    checkbox = 'checkbox',
    radio = 'radio',
    file = 'file',
    image = 'image',
    hidden = 'hidden',
    password = 'password',
    email = 'email',
    url = 'url',
    color = 'color',
    range = 'range',
    tel = 'tel',
    search = 'search',
    dateTimeLocal = 'dateTimeLocal',
    month = 'month',
    week = 'week',
    time = 'time',
    colorPicker = 'colorPicker',
    slider = 'slider',
    rangeSlider = 'rangeSlider',
    switch = 'switch',
    editor = 'editor',
    editorMd = 'editorMd',
    editorTinyMce = 'editorTinyMce',
    editorCkEditor = 'editorCkEditor',
    editorTinyMce4 = 'editorTinyMce4',
}

export class AdditionalFields{

    @ApiModelProperty()
    @Column()
    fieldName: string;

    @ApiModelProperty()
    @Column()
    fieldValue: string;

    @ApiModelProperty()
    @Column({ type: 'enum', enum: fieldType, default: fieldType.text })
    fieldType: fieldType;

    @ApiModelProperty()
    @Column()
    fieldOptions: string;

    @ApiModelProperty()
    @Column()
    fieldRequired: boolean;

    @ApiModelProperty()
    @Column()
    fieldOrder: number;

    @ApiModelProperty()
    @Column()
    fieldGroup: string;

    @ApiModelProperty()
    @Column()
    fieldGroupOrder: number;

    @ApiModelProperty()
    @Column()
    fieldGroupName: string;

}

export class AdditionalFieldsGroup {
    
        @ApiModelProperty()
        @Column()
        groupName: string;
    
        @ApiModelProperty()
        @Column()
        groupOrder: number;

        @ApiModelProperty()
        @Column()
        groupFields: AdditionalFields[];
    
    }
    