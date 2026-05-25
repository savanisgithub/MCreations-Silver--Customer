import {
    Box,
    Card,
    CardContent,
    Chip,
    IconButton,
    Typography,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate } from 'react-router-dom';
import PriceDisplay from './PriceDisplay';
import { getPrimaryImage } from '../../utils/image';
import type { JewelleryItem } from '../../types/jewellery.types';

interface ProductCardProps {
    item: JewelleryItem;
    isFavourite?: boolean;
    onFavouriteClick?: (item: JewelleryItem) => void;
}

export default function ProductCard({
    item,
    isFavourite = false,
    onFavouriteClick,
}: ProductCardProps) {
    const navigate = useNavigate();
    const image = getPrimaryImage(item.images);

    return (
        <Card
            elevation={0}
            sx={{
                height: '100%',
                border: '1px solid #E5E7EB',
                borderRadius: 4,
                overflow: 'hidden',
                transition: '0.25s ease',
                cursor: 'pointer',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 18px 45px rgba(15, 23, 42, 0.10)',
                },
            }}
            onClick={() => navigate(`/jewellery/${item.slug}`)}
        >
            <Box
                sx={{
                    position: 'relative',
                    height: { xs: 240, sm: 260 },
                    bgcolor: '#F3F4F6',
                    overflow: 'hidden',
                }}
            >
                {image ? (
                    <Box
                        component="img"
                        src={image}
                        alt={item.name}
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: '0.35s ease',
                            '&:hover': {
                                transform: 'scale(1.05)',
                            },
                        }}
                    />
                ) : (
                    <Box
                        sx={{
                            height: '100%',
                            display: 'grid',
                            placeItems: 'center',
                            color: 'text.secondary',
                        }}
                    >
                        No Image
                    </Box>
                )}

                <IconButton
                    onClick={(event) => {
                        event.stopPropagation();
                        onFavouriteClick?.(item);
                    }}
                    sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        bgcolor: 'rgba(255,255,255,0.92)',
                        '&:hover': {
                            bgcolor: 'white',
                        },
                    }}
                >
                    {isFavourite ? (
                        <FavoriteIcon color="error" />
                    ) : (
                        <FavoriteBorderIcon />
                    )}
                </IconButton>

                {item.stock === 0 && (
                    <Chip
                        label="Out of stock"
                        color="error"
                        size="small"
                        sx={{
                            position: 'absolute',
                            left: 12,
                            top: 12,
                        }}
                    />
                )}
            </Box>

            <CardContent>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 800,
                        mb: 0.5,
                        lineHeight: 1.25,
                    }}
                >
                    {item.name}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                >
                    {item.category?.name || item.material}
                </Typography>

                {item.stones && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                    >
                        Stones: {item.stones}
                    </Typography>
                )}

                <PriceDisplay price={item.price} />
            </CardContent>
        </Card>
    );
}