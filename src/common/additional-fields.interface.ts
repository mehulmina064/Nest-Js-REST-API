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

export class AdditionalFields {

    @ApiModelProperty()
    fieldName: string;
  
    @ApiModelProperty()
    fieldValue: string;
  
    @ApiModelProperty()
    fieldType: FieldType;
  
    @ApiModelProperty()
    fieldOptions: string;
  
    @ApiModelProperty()
    fieldRequired: boolean;
  
    @ApiModelProperty()
    fieldOrder: number;
  
    @ApiModelProperty()
    fieldGroup: string;
  
    @ApiModelProperty()
    fieldGroupOrder: number;
  
    @ApiModelProperty()
    fieldGroupName: string;
  }
  
  export class AdditionalFieldsGroup {
      
    @ApiModelProperty()
    groupName: string;
    
    @ApiModelProperty()
    groupOrder: number;
  
    @ApiModelProperty()
    groupFields: AdditionalFields[];
  }
    