export declare class SalesordersService {
    convertData(array: any): Promise<any>;
    convert(array: any): Promise<any>;
    getXmlValue(str: any): Promise<any>;
    renameKeys(obj: any, newKeys: any): Promise<any>;
    purchaseOrderItemsDataMap(array: any): Promise<any[][]>;
    purchaseOrderDataMap(array: any): Promise<any[][]>;
    podDataMap(array: any): Promise<any[][]>;
    invoiceMap(array: any): Promise<any[][]>;
    customerMap(array: any): Promise<any[][]>;
    salesPersonMap(array: any): Promise<any[][]>;
    salesOrderDataMap(array: any): Promise<any[][]>;
    salesOrderItemsDataMap(array: any): Promise<any[][]>;
    mapToSheetsData(data: any, range: string): Promise<any[][]>;
    mapForSheets(array: any): Promise<any[][]>;
    postToSheets(soData: any, poData: any, soItemsData: any, poItemsData: any, podData: any, invoiceData: any, customerData: any, salespersonData: any): Promise<({
        salesOrderSync: any;
        responseURL: any;
        purchareOrderSync?: undefined;
        purchaseOrderItemsSync?: undefined;
        salesOrderItemsSync?: undefined;
        PODataSync?: undefined;
        InvoicesDataSync?: undefined;
        CustomersDataSync?: undefined;
        salespersonDataSync?: undefined;
    } | {
        purchareOrderSync: any;
        responseURL: any;
        salesOrderSync?: undefined;
        purchaseOrderItemsSync?: undefined;
        salesOrderItemsSync?: undefined;
        PODataSync?: undefined;
        InvoicesDataSync?: undefined;
        CustomersDataSync?: undefined;
        salespersonDataSync?: undefined;
    } | {
        purchaseOrderItemsSync: any;
        responseURL: any;
        salesOrderSync?: undefined;
        purchareOrderSync?: undefined;
        salesOrderItemsSync?: undefined;
        PODataSync?: undefined;
        InvoicesDataSync?: undefined;
        CustomersDataSync?: undefined;
        salespersonDataSync?: undefined;
    } | {
        salesOrderItemsSync: any;
        responseURL: any;
        salesOrderSync?: undefined;
        purchareOrderSync?: undefined;
        purchaseOrderItemsSync?: undefined;
        PODataSync?: undefined;
        InvoicesDataSync?: undefined;
        CustomersDataSync?: undefined;
        salespersonDataSync?: undefined;
    } | {
        PODataSync: any;
        responseURL: any;
        salesOrderSync?: undefined;
        purchareOrderSync?: undefined;
        purchaseOrderItemsSync?: undefined;
        salesOrderItemsSync?: undefined;
        InvoicesDataSync?: undefined;
        CustomersDataSync?: undefined;
        salespersonDataSync?: undefined;
    } | {
        InvoicesDataSync: any;
        responseURL: any;
        salesOrderSync?: undefined;
        purchareOrderSync?: undefined;
        purchaseOrderItemsSync?: undefined;
        salesOrderItemsSync?: undefined;
        PODataSync?: undefined;
        CustomersDataSync?: undefined;
        salespersonDataSync?: undefined;
    } | {
        CustomersDataSync: any;
        responseURL: any;
        salesOrderSync?: undefined;
        purchareOrderSync?: undefined;
        purchaseOrderItemsSync?: undefined;
        salesOrderItemsSync?: undefined;
        PODataSync?: undefined;
        InvoicesDataSync?: undefined;
        salespersonDataSync?: undefined;
    } | {
        salespersonDataSync: any;
        responseURL: any;
        salesOrderSync?: undefined;
        purchareOrderSync?: undefined;
        purchaseOrderItemsSync?: undefined;
        salesOrderItemsSync?: undefined;
        PODataSync?: undefined;
        InvoicesDataSync?: undefined;
        CustomersDataSync?: undefined;
    })[]>;
    tokenfunc(): Promise<string>;
    GetData(s: string, token: any, spreadsheetId: any, googleSheets: any, auth: any): Promise<"error" | {
        salesOrderSync: any;
        responseURL: any;
        purchaseOrderSync?: undefined;
    } | {
        purchaseOrderSync: any;
        responseURL: any;
        salesOrderSync?: undefined;
    }>;
    salesOrdersSheetDataSync(): Promise<("error" | {
        salesOrderSync: any;
        responseURL: any;
        purchaseOrderSync?: undefined;
    } | {
        purchaseOrderSync: any;
        responseURL: any;
        salesOrderSync?: undefined;
    })[]>;
    autuSyncShedule(): Promise<string>;
    postToAutoSheets(): Promise<void>;
}
