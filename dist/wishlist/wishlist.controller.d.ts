import { WishlistService } from './wishlist.service';
import { Wishlist } from './wishlist.entity';
export declare class WishlistController {
    private readonly wishlistService;
    constructor(wishlistService: WishlistService);
    findAll(): Promise<Wishlist[]>;
    findByUser(userId: string): Promise<Wishlist[]>;
    findOne(id: string): Promise<Wishlist>;
    save(category: Wishlist): Promise<Wishlist>;
    delete(id: any): Promise<void>;
}
