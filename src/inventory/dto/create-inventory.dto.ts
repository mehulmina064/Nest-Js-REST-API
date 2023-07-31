import { Column } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
export class CreateInventoryDto {
    @ApiModelProperty()
    @Column()
    item_id: string;

    @ApiModelProperty()
    @Column()
    item_uom: string;

    @ApiModelProperty()
    @Column()
    current_qty: number;

    @ApiModelProperty()
    @Column()
    recomended_qty: number;

    @ApiModelProperty()
    @Column()
    item_status: string;
    
}
