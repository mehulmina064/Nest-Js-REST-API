import { ObjectID } from "typeorm";
export declare class UnimoveDash {
    id: ObjectID;
    hub: string;
    type: string;
    total_inventory_processed_today: string;
    total_inventory_processed_for_last_7_days: string;
    total_inventory_processed_for_current_month: string;
    total_inventory_processed_for_last_month: string;
    total_good_inventory_received_today: string;
    total_good_inventory_received_for_last_7_days: string;
    total_good_inventory_received_for_current_month: string;
    total_good_inventory_received_for_last_month: string;
    total_bad_inventory_received_today: string;
    total_bad_inventory_received_for_last_7_days: string;
    total_bad_inventory_received_for_current_month: string;
    total_bad_inventory_received_for_last_month: string;
    total_fresh_inventory_processed_today: string;
    total_fresh_inventory_processed_for_last_7_days: string;
    total_fresh_inventory_processed_for_current_month: string;
    total_fresh_inventory_processed_for_last_month: string;
    today_s_Churn_Ration: string;
    last_7_days_Churn_Ratio: string;
    Current_Month_churn_ratio: string;
    Last_Month_Churn_Ratio: string;
}
