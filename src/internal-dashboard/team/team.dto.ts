import { Column, Entity, ObjectID, ObjectIdColumn,Unique } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { BaseCreateDto,BaseUpdateDto } from '../../common/base-app.dto';
import { IsBoolean, IsNotEmpty,IsEmpty,IsString, IsLowercase, IsEnum } from 'class-validator';


export enum teamStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED',
}
export class CreateTeamDto extends BaseCreateDto {
  @IsNotEmpty()
  @IsLowercase()
  @ApiModelProperty()
  teamName: string;

  @IsNotEmpty()
  @ApiModelProperty()
  teamDisplayName?: string | "";

  @IsEnum(teamStatus)
  @IsNotEmpty()
  @ApiModelProperty()
  status: teamStatus |teamStatus.ACTIVE;
  @IsBoolean()
  @ApiModelProperty()
  isDefault?: boolean;
  @ApiModelProperty()
  teamDescription?: string | "";
}

export class UpdateTeamDto extends BaseUpdateDto {
    @IsEmpty()
  @ApiModelProperty()
    teamName: string;
  @ApiModelProperty()
    teamDisplayName?: string | "";
  @ApiModelProperty({enum:teamStatus})
    status: teamStatus |teamStatus.ACTIVE;
    @IsBoolean()
  @ApiModelProperty()
    isDefault?: boolean;
  @ApiModelProperty()
    teamDescription?: string | "";
  }
  

  export class CreateUserTeamDto extends BaseCreateDto {
    @IsNotEmpty()
  @ApiModelProperty()
    teamId: string;
    @IsNotEmpty()
  @ApiModelProperty()
    userId: string;
  }

  export class UpdateUserTeamDto extends BaseUpdateDto {
    @IsNotEmpty()
  @ApiModelProperty()
    teamId: string;
    @IsNotEmpty()
  @ApiModelProperty()
    userId: string;
  }

  



