import { ObjectID } from 'typeorm';
export declare class Product {
    id: ObjectID;
    categoryId: string;
    productName: string;
    sku: string;
    seo?: string;
    subTitle?: string;
    prodoExclusive: boolean;
    paymentTerms: string;
    greenProduct: boolean;
    description: string;
    productImages: [];
    price: number;
    leadTime: string;
    moq: string;
    readyProduct: boolean;
    madeToOrder: boolean;
    whiteLabeling: boolean;
    ecoFriendly: boolean;
    protectionLevel: string;
    variants: [];
    similarProductIds: [];
    productType: string;
    productStatus: string;
    productStatusValue: string;
    hsnCode: string;
    zohoBooksProduct: boolean;
    zohoBooksProductId: string;
    date: string;
    isVisible: boolean;
}
