import { GetInTouchModule } from './../../get-in-touch/get-in-touch.module';
import { OrganizationModel } from '../../common/org-model.entity';
import { ApiModelProperty } from "@nestjs/swagger";
import { Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";

@Entity('inventory-transfer-requests')
export class InventoryTransferRequest extends OrganizationModel {

    @ApiModelProperty()
    @ObjectIdColumn()
    id: ObjectID;

    @ApiModelProperty()
    @Column()
    code: string;

    @ApiModelProperty()
    @Column()
    type: string;

    @ApiModelProperty()
    @Column()
    item_id: string;

    @ApiModelProperty()
    @Column()
    inventory_id: string;

    @ApiModelProperty()
    @Column()
    warehouse_id: string;

    @ApiModelProperty()
    @Column()
    warehouse_id_to: string;

    @ApiModelProperty()
    @Column()
    status: string;

    @ApiModelProperty()
    @Column()
    uom: string;

    @ApiModelProperty()
    @Column()
    quantity: number;

    @ApiModelProperty()
    @Column()
    isApproved: boolean;

    @ApiModelProperty()
    @Column()
    isCompleted: boolean;
    qty: number;

}

//1. create hubs throught territories and creat addres and assign them 
//2. create warehouse for each hub
//2.5. create items for each inventory
//3. create inventory for each warehouse
//4. create stock entry for each inventory
//5. Add Users with Roles UnimoveSuperAdmin, UnimoveAdmin, UnimoveStoreManager and assign Territories to them
