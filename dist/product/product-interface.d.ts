export interface ProductList {
    categoryId: string;
    productName: string;
    subTitle?: string;
    prodoExclusive: boolean;
    greenProduct: boolean;
    description: JSON["stringify"];
    productImages: string;
    moq: string;
    readyProduct: boolean;
    madeToOrder: boolean;
    whiteLabeling: boolean;
    protectionLevel: string;
    variants: [];
}
