import type { GemstoneImage } from "../types/gemstone.type";

export function getPrimaryGemstoneImage(images: GemstoneImage[]): string {
    const stoneImages = images.filter(
        (image) => image.image_type === 'STONE_IMAGE',
    );

    return (
        stoneImages.find((image) => image.is_primary)?.image_url ||
        stoneImages[0]?.image_url ||
        ''
    );
}

export function getStoneImages(images: GemstoneImage[]): GemstoneImage[] {
    return images.filter((image) => image.image_type === 'STONE_IMAGE');
}

export function getCertificateImages(images: GemstoneImage[]): GemstoneImage[] {
    return images.filter((image) => image.image_type === 'CERTIFICATE_IMAGE');
}