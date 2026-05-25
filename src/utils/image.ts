import type { JewelleryImage } from "../types/jewellery.types";

export function getPrimaryImage(images: JewelleryImage[]): string {
    return (
        images.find((image) => image.is_primary)?.image_url ||
        images[0]?.image_url ||
        ''
    );
}