import { Attachment } from "../attachments/attachment.entity";
export declare class BaseAppEntity {
    additionalData: [];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    attachments: Attachment[];
    createdBy: string | undefined;
    updatedBy: string | undefined;
    deletedBy: string | undefined;
}
