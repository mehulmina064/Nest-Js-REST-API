export declare enum fieldType {
    text = "text",
    textarea = "textarea",
    number = "number",
    date = "date",
    select = "select",
    checkbox = "checkbox",
    radio = "radio",
    file = "file",
    image = "image",
    hidden = "hidden",
    password = "password",
    email = "email",
    url = "url",
    color = "color",
    range = "range",
    tel = "tel",
    search = "search",
    dateTimeLocal = "dateTimeLocal",
    month = "month",
    week = "week",
    time = "time",
    colorPicker = "colorPicker",
    slider = "slider",
    rangeSlider = "rangeSlider",
    switch = "switch",
    editor = "editor",
    editorMd = "editorMd",
    editorTinyMce = "editorTinyMce",
    editorCkEditor = "editorCkEditor",
    editorTinyMce4 = "editorTinyMce4"
}
export declare class AdditionalFields {
    fieldName: string;
    fieldValue: string;
    fieldType: fieldType;
    fieldOptions: string;
    fieldRequired: boolean;
    fieldOrder: number;
    fieldGroup: string;
    fieldGroupOrder: number;
    fieldGroupName: string;
}
export declare class AdditionalFieldsGroup {
    groupName: string;
    groupOrder: number;
    groupFields: AdditionalFields[];
}
