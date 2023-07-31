import { ObjectID } from 'typeorm';
import { BaseAppEntity } from '../../../common/base-app.entity';
export declare class ProductPSku extends BaseAppEntity {
    id: ObjectID | undefined;
    pSkuId?: string | "";
    productSku?: string | "";
}
