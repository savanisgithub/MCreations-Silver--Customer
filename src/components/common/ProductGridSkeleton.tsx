import { Box } from '@mui/material';
import ProductCardSkeleton from './ProductCardSkeleton';

interface ProductGridSkeletonProps {
    count?: number;
}

export default function ProductGridSkeleton({
    count = 8,
}: ProductGridSkeletonProps) {
    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    lg: 'repeat(4, 1fr)',
                },
                gap: 3,
            }}
        >
            {Array.from({ length: count }).map((_, index) => (
                <ProductCardSkeleton key={index} />
            ))}
        </Box>
    );
}