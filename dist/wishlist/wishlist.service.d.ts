import { Repository } from 'typeorm';
import { Wishlist } from './wishlist.entity';
import { ProductService } from '../product/product.service';
export declare class WishlistService {
    private readonly wishlistRepository;
    private productService;
    constructor(wishlistRepository: Repository<Wishlist>, productService: ProductService);
    findAll(): Promise<Wishlist[]>;
    findByUser(userId: any): Promise<Wishlist[]>;
    findOne(id: string): Promise<Wishlist>;
    save(wishlist: Wishlist): Promise<Wishlist>;
    remove(id: any): Promise<void>;
}
