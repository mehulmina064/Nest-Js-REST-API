import { Entity } from "typeorm";
import { OrganizationModel } from "../commmon/org-model.entity"
import { ObjectID, Column, ObjectIdColumn } from "typeorm";
import { ApiModelProperty } from "@nestjs/swagger";

@Entity('unimove_dash')
export class UnimoveDash {
    // hub: 'Last Mile Hubs ',
    // type: 'Seal',
    // total_inventory_processed_today: '0',
    // total_inventory_processed_for_last_7_days: '0',
    // total_inventory_processed_for_current_month: '0',
    // total_inventory_processed_for_last_month: '0',
    // total_good_inventory_received_today: '0',
    // total_good_inventory_received_for_last_7_days: '0',
    // total_good_inventory_received_for_current_month: '0',
    // total_good_inventory_received_for_last_month: '0',
    // total_bad_inventory_received_today: '0',
    // total_bad_inventory_received_for_last_7_days: '0',
    // total_bad_inventory_received_for_current_month: '0',
    // total_bad_inventory_received_for_last_month: '0',
    // total_fresh_inventory_processed_today: '0',
    // total_fresh_inventory_processed_for_last_7_days: '0',
    // total_Inventory_fresh_processed_for_current_month: '0',
    // total_fresh_inventory_processed_for_last_month: '0',
    // today_s_Churn_Ration: '0%',
    // last_7_days_Churn_Ratio: '0%',
    // Current_Month_churn_ratio: '0%',
    // Last_Month_Churn_Ratio: '0%',
    @ApiModelProperty()
    @ObjectIdColumn()
    id: ObjectID;

    @ApiModelProperty()
    @Column()
    hub: string;

    @ApiModelProperty()
    @Column()
    type: string;

    @ApiModelProperty()
    @Column()
    total_inventory_processed_today: string;

    @ApiModelProperty()
    @Column()
    total_inventory_processed_for_last_7_days: string;

    @ApiModelProperty()
    @Column()
    total_inventory_processed_for_current_month: string;

    @ApiModelProperty()
    @Column()
    total_inventory_processed_for_last_month: string;

    @ApiModelProperty()
    @Column()
    total_good_inventory_received_today: string;

    @ApiModelProperty()
    @Column()
    total_good_inventory_received_for_last_7_days: string;

    @ApiModelProperty()
    @Column()
    total_good_inventory_received_for_current_month: string;

    @ApiModelProperty()
    @Column()
    total_good_inventory_received_for_last_month: string;

    @ApiModelProperty()
    @Column()
    total_bad_inventory_received_today: string;

    @ApiModelProperty()
    @Column()
    total_bad_inventory_received_for_last_7_days: string;

    @ApiModelProperty()
    @Column()
    total_bad_inventory_received_for_current_month: string;

    @ApiModelProperty()
    @Column()
    total_bad_inventory_received_for_last_month: string;

    @ApiModelProperty()
    @Column()
    total_fresh_inventory_processed_today: string;

    @ApiModelProperty()
    @Column()
    total_fresh_inventory_processed_for_last_7_days: string;

    @ApiModelProperty()
    @Column()
    total_fresh_inventory_processed_for_current_month: string;

    @ApiModelProperty()
    @Column()
    total_fresh_inventory_processed_for_last_month: string;

    @ApiModelProperty()
    @Column()
    today_s_Churn_Ration: string;

    @ApiModelProperty()
    @Column()
    last_7_days_Churn_Ratio: string;

    @ApiModelProperty()
    @Column()
    Current_Month_churn_ratio: string;

    @ApiModelProperty()
    @Column()
    Last_Month_Churn_Ratio: string;

    // constructor(data: any) {
        // this.hub = data.hub;
        // this.type = data.type;
        // this.total_inventory_processed_today = data.total_inventory_processed_today;
        // this.total_inventory_processed_for_last_7_days = data.total_inventory_processed_for_last_7_days;
        // this.total_inventory_processed_for_current_month = data.total_inventory_processed_for_current_month;
        // this.total_inventory_processed_for_last_month = data.total_inventory_processed_for_last_month;
        // this.total_good_inventory_received_today = data.total_good_inventory_received_today;
        // this.total_good_inventory_received_for_last_7_days = data.total_good_inventory_received_for_last_7_days;
        // this.total_good_inventory_received_for_current_month = data.total_good_inventory_received_for_current_month;
        // this.total_good_inventory_received_for_last_month = data.total_good_inventory_received_for_last_month;
        // this.total_bad_inventory_received_today = data.total_bad_inventory_received_today;
        // this.total_bad_inventory_received_for_last_7_days = data.total_bad_inventory_received_for_last_7_days;
        // this.total_bad_inventory_received_for_current_month = data.total_bad_inventory_received_for_current_month;
        // this.total_bad_inventory_received_for_last_month = data.total_bad_inventory_received_for_last_month;
        // this.total_fresh_inventory_processed_today = data.total_fresh_inventory_processed_today;
        // this.total_fresh_inventory_processed_for_last_7_days = data.total_fresh_inventory_processed_for_last_7_days;
        // this.total_fresh_inventory_processed_for_current_month = data.total_fresh_inventory_processed_for_current_month;
        // this.total_fresh_inventory_processed_for_last_month = data.total_fresh_inventory_processed_for_last_month;
        // this.today_s_Churn_Ration = data.today_s_Churn_Ration;
        // this.last_7_days_Churn_Ratio = data.last_7_days_Churn_Ratio;
        // this.Current_Month_churn_ratio = data.Current_Month_churn_ratio;
        // this.Last_Month_Churn_Ratio = data.Last_Month_Churn_Ratio;
    // }
}
    