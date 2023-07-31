import { BaseCreateDto, BaseUpdateDto } from '../../common/base-app.dto';
export declare enum teamStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    DELETED = "DELETED"
}
export declare class CreateTeamDto extends BaseCreateDto {
    teamName: string;
    teamDisplayName?: string | "";
    status: teamStatus | teamStatus.ACTIVE;
    isDefault?: boolean;
    teamDescription?: string | "";
}
export declare class UpdateTeamDto extends BaseUpdateDto {
    teamName: string;
    teamDisplayName?: string | "";
    status: teamStatus | teamStatus.ACTIVE;
    isDefault?: boolean;
    teamDescription?: string | "";
}
export declare class CreateUserTeamDto extends BaseCreateDto {
    teamId: string;
    userId: string;
}
export declare class UpdateUserTeamDto extends BaseUpdateDto {
    teamId: string;
    userId: string;
}
