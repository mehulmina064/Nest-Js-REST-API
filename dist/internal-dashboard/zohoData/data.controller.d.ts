/// <reference types="node" />
import { prodoRolesService } from '../prodoRoles/prodoRoles.service';
import { userRolesService } from '../prodoRoles/userRoles.service';
import { zohoEmployeeService } from '../zohoEmployee/zohoEmployee.service';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Product } from './../../product/product.entity';
import { internalSalesOrderService } from './services/salesOrder.service';
import { internalBillService } from './services/bill.service';
import { internalInvoiceService } from './services/invoice.service';
import { internalPurchaseOrderService } from './services/purchaseOrder.service';
import { internalProductService } from './services/product.service';
import { batchItemService } from '../batchItems/batchItem.service';
export declare class zohoDataController {
    private readonly prodoRolesService;
    private readonly zohoEmployeeService;
    private readonly userRolesService;
    private readonly internalSalesOrderService;
    private readonly internalBillService;
    private readonly internalInvoiceService;
    private readonly internalPurchaseOrderService;
    private readonly internalProductService;
    private readonly batchItemService;
    constructor(prodoRolesService: prodoRolesService, zohoEmployeeService: zohoEmployeeService, userRolesService: userRolesService, internalSalesOrderService: internalSalesOrderService, internalBillService: internalBillService, internalInvoiceService: internalInvoiceService, internalPurchaseOrderService: internalPurchaseOrderService, internalProductService: internalProductService, batchItemService: batchItemService);
    findAllInvoice(req: any, search?: string, status?: string, limit?: number, page?: number): Promise<{
        statusCode: number;
        message: string;
        count: number;
        limit: number;
        page: number;
        data: import("../../zohoInvoice/zohoInvoice.entity").zohoInvoice[];
    }>;
    zohoAllInvoice(): Promise<{
        statusCode: number;
        message: string;
        count: number;
        data: any[];
    }>;
    zohoOneInvoice(id: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    getAttachmentInvoice(invoiceId: any, res: any): Promise<Buffer>;
    SummaryInvoice(invoiceId: any, res: any): Promise<Buffer>;
    findAllBill(req: any, search?: string, status?: string, limit?: number, page?: number): Promise<{
        statusCode: number;
        message: string;
        count: number;
        limit: number;
        page: number;
        data: import("../../zohoBill/zohoBill.entity").zohoBill[];
    }>;
    zohoAll(): Promise<{
        statusCode: number;
        message: string;
        count: number;
        data: any[];
    }>;
    zohoOneBill(id: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    getAttachmentBill(purchaseOrderId: any, res: any): Promise<Buffer>;
    SummaryBill(billId: any, res: any): Promise<Buffer>;
    findAllPo(req: any, search?: string, status?: string, limit?: number, page?: number): Promise<{
        statusCode: number;
        message: string;
        count: number;
        limit: number;
        page: number;
        data: import("../../zohoPurchaseOrder/zohoPurchaseOrder.entity").zohoPurchaseOrder[];
    }>;
    bySalesOrderNumber(id?: string): Promise<{
        statusCode: number;
        message: string;
        data: import("../../zohoPurchaseOrder/zohoPurchaseOrder.entity").zohoPurchaseOrder[];
    }>;
    GetData(item: any, batchesItems: any): Promise<any>;
    poItemDetails(id?: string): Promise<{
        statusCode: number;
        message: string;
        data: {
            data: import("../../zohoPurchaseOrder/zohoPurchaseOrder.entity").zohoPurchaseOrder[];
            count: number;
        };
    }>;
    zohoAllPo(): Promise<{
        statusCode: number;
        message: string;
        count: number;
        data: any[];
    }>;
    zohoOnePo(id: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    getAttachmentPo(purchaseOrderId: any, res: any): Promise<Buffer>;
    POrderSummary(purchaseOrderId: any, res: any): Promise<Buffer>;
    findAllSo(req: any, search?: string, status?: string, limit?: number, byOrganization?: string, byCompany?: string, byEntity?: string, page?: number): Promise<{
        statusCode: number;
        message: string;
        count: number;
        limit: number;
        page: number;
        data: import("../../zohoSalesOrder/zohoSalesOrder.entity").zohoSalesOrder[];
    }>;
    OneSo(id: any, req: any): Promise<{
        statusCode: number;
        message: string;
        data: import("../../zohoSalesOrder/zohoSalesOrder.entity").zohoSalesOrder;
    }>;
    zohoAllSo(): Promise<{
        statusCode: number;
        message: string;
        count: number;
        data: any[];
    }>;
    getAttachmentSO(salesOrderId: any, res: any): Promise<Buffer>;
    SOrderSummary(salesOrderId: any, res: any): Promise<Buffer>;
    salesOrderPackages(packageIds: any, res: any): Promise<Buffer>;
    allProducts(page?: number, limit?: number, search?: string): Promise<Pagination<Product>>;
    allProductsFlitered(page: number | undefined, limit: number | undefined, category: string | undefined, search: string | undefined, fPriceMin: number | undefined, fPriceMax: number | undefined, fType: string | undefined, fAttr: string | undefined, order: any, zohoBooksProduct: true, readyProduct: boolean, madeToOrder: boolean, whiteLabeling: boolean): Promise<[Product[], number]>;
    reviewProduct(data: any, req: any): Promise<number>;
    getRatingProduct(zohoId: string): Promise<number>;
    getReviewProduct(id: string, req: any): Promise<import("../../product/userReview.entity").UserReview | "no review">;
    getProductBySku(sku: string): Promise<false | Product>;
    pimAllProducts(): Promise<{
        type: string;
        data: any;
    }[]>;
    productByCategory(page: number | undefined, limit: number | undefined, categoryId: string): Promise<Pagination<Product>>;
}
