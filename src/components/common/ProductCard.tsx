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
import DiamondIcon from '@mui/icons-material/Diamond';
import { useNavigate } from 'react-router-dom';
import PriceDisplay from './PriceDisplay';
import { getPrimaryImage } from '../../utils/image';
import type { JewelleryItem } from '../../types/jewellery.types';

interface ProductCardProps {
    item: JewelleryItem;
    isFavourite?: boolean;
    favouriteDisabled?: boolean;
    onFavouriteClick?: (item: JewelleryItem) => void;
}

export default function ProductCard({
    item,
    isFavourite = false,
    favouriteDisabled = false,
    onFavouriteClick,
}: ProductCardProps) {
    const navigate = useNavigate();
    const image = getPrimaryImage(item.images);

    return (
        <Card
            elevation={0}
            onClick={() => navigate(`/jewellery/${item.slug}`)}
            sx={{
                height: '100%',
                border: '1px solid #E5E7EB',
                borderRadius: 0,
                overflow: 'hidden',
                cursor: 'pointer',
                bgcolor: 'background.paper',
                transition:
                    'transform 260ms ease, box-shadow 260ms ease, border-color 260ms ease',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 24px 60px rgba(15, 23, 42, 0.10)',
                    borderColor: 'rgba(191, 164, 111, 0.55)',
                },
                '&:hover .product-image': {
                    transform: 'scale(1.045)',
                },
            }}
        >
            <Box
                sx={{
                    position: 'relative',
                    height: { xs: 220, sm: 300 },
                    bgcolor: '#F3F4F6',
                    overflow: 'hidden',
                }}
            >
                {image ? (
                    <Box
                        component="img"
                        className="product-image"
                        src={image}
                        alt={item.name}
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 420ms ease',
                        }}
                    />
                ) : (
                    <Box
                        sx={{
                            height: '100%',
                            display: 'grid',
                            placeItems: 'center',
                            color: 'secondary.main',
                        }}
                    >
                        <DiamondIcon sx={{ fontSize: 72 }} />
                    </Box>
                )}

                <IconButton
                    aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
                    onClick={(event) => {
                        event.stopPropagation();
                        onFavouriteClick?.(item);
                    }}
                    disabled={favouriteDisabled}
                    sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        bgcolor: 'rgba(255,255,255,0.94)',
                        boxShadow: '0 8px 20px rgba(15,23,42,0.10)',
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
                            fontWeight: 700,
                        }}
                    />
                )}
            </Box>

            <CardContent sx={{ p: 1 }}>
                <Typography
                    variant="overline"
                    color="text.secondary"
                    sx={{ letterSpacing: 1.2 }}
                >
                    {item.category?.name || item.material}
                </Typography>

                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 900,
                        mt: 0.5,
                        mb: 0.75,
                        lineHeight: 1.25,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}
                >
                    {item.name}
                </Typography>

                {item.stones && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mb: 1.2,
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        Stones: {item.stones}
                    </Typography>
                )}

                <PriceDisplay price={item.price} />
            </CardContent>
        </Card>
    );
}