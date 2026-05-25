import type { JewelleryItem } from "./jewellery.types";

export interface Favourite {
    id: number;
    user_id: number;
    jewellery_item_id: number;
    created_at: string;
    jewellery_item: JewelleryItem;
}