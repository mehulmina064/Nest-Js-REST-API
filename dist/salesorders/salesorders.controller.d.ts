import { SalesordersService } from './salesorders.service';
export declare class SalesordersController {
    private readonly salesOrdersService;
    constructor(salesOrdersService: SalesordersService);
    syncSalesData(): Promise<("error" | {
        salesOrderSync: any;
        responseURL: any;
        purchaseOrderSync?: undefined;
    } | {
        purchaseOrderSync: any;
        responseURL: any;
        salesOrderSync?: undefined;
    })[]>;
    autoSyncSalesData(body: any): Promise<string>;
}
