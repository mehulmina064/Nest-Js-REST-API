import { BaseCreateDto, BaseUpdateDto } from '../../common/base-app.dto';
export declare enum Status {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    DELETED = "DELETED"
}
export declare class CreateLogisticDto extends BaseCreateDto {
    name: string;
    displayName?: string | "";
    status: Status | Status.ACTIVE;
    description?: string | "";
    apiUrl?: string | "";
    trackingUrl?: string | "";
    rating?: Number;
}
export declare class UpdateLogisticDto extends BaseUpdateDto {
    name: string;
    displayName?: string | "";
    status: Status | Status.ACTIVE;
    description?: string | "";
    apiUrl?: string | "";
    trackingUrl?: string | "";
    rating?: Number;
}
