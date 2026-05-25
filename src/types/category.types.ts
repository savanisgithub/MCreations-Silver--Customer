export type Status = 'ACTIVE' | 'INACTIVE';

export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image_url: string | null;
    image_public_id: string | null;
    status: Status;
    created_at: string;
    updated_at: string;
}