import { Chip, Typography } from '@mui/material';

interface PriceDisplayProps {
    price: string | number | null;
    variant?: 'body' | 'large';
}

export default function PriceDisplay({ price, variant = 'body' }: PriceDisplayProps) {
    if (price === null) {
        return <Chip label="Price on request" size="small" variant="outlined" />;
    }

    return (
        <Typography
            component="span"
            sx={{
                fontWeight: 800,
                fontSize: variant === 'large' ? 26 : 16,
                color: 'primary.main',
            }}
        >
            LKR {Number(price).toLocaleString()}
        </Typography>
    );
}