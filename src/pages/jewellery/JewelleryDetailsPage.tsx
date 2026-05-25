import { useState } from 'react';
import {
    Box,
    Button,
    Chip,
    Container,
    Divider,
    IconButton,
    Typography,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DiamondIcon from '@mui/icons-material/Diamond';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import PageLoading from '../../components/common/PageLoading';
import PageError from '../../components/common/PageError';
import PriceDisplay from '../../components/common/PriceDisplay';
import { favouriteService } from '../../services/favourite.service';
import { jewelleryService } from '../../services/jewellery.service';
import { useAuth } from '../../context/AuthContext';
import { getPrimaryImage } from '../../utils/image';
import PageTransition from '../../components/common/PageTransition';

export default function JewelleryDetailsPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    const { isAuthenticated } = useAuth();

    const [selectedImage, setSelectedImage] = useState<string>('');

    const {
        data: item,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['jewellery-details', slug],
        enabled: Boolean(slug),
        queryFn: () => jewelleryService.getJewelleryBySlug(slug as string),
    });

    const { data: favourites = [] } = useQuery({
        queryKey: ['my-favourites'],
        queryFn: favouriteService.getMyFavourites,
        enabled: isAuthenticated,
    });

    const isFavourite = Boolean(
        item && favourites.some((fav) => fav.jewellery_item_id === item.id),
    );

    const addFavouriteMutation = useMutation({
        mutationFn: favouriteService.addFavourite,
        onSuccess: () => {
            enqueueSnackbar('Added to favourites', { variant: 'success' });
            queryClient.invalidateQueries({ queryKey: ['my-favourites'] });
        },
        onError: (error: any) => {
            enqueueSnackbar(error.message || 'Failed to add favourite', {
                variant: 'error',
            });
        },
    });

    const removeFavouriteMutation = useMutation({
        mutationFn: favouriteService.removeFavourite,
        onSuccess: () => {
            enqueueSnackbar('Removed from favourites', { variant: 'success' });
            queryClient.invalidateQueries({ queryKey: ['my-favourites'] });
        },
        onError: (error: any) => {
            enqueueSnackbar(error.message || 'Failed to remove favourite', {
                variant: 'error',
            });
        },
    });

    if (isLoading) {
        return <PageLoading minHeight="70vh" />;
    }

    if (isError || !item) {
        return (
            <Container maxWidth="xl" sx={{ py: 6 }}>
                <PageError
                    message={(error as any)?.message || 'Jewellery item not found'}
                />
            </Container>
        );
    }

    const mainImage = selectedImage || getPrimaryImage(item.images);

    function handleFavourite() {
        if (!isAuthenticated) {
            enqueueSnackbar('Please login to save favourites', { variant: 'info' });
            return;
        }

        if (isFavourite) {
            removeFavouriteMutation.mutate(item!.id);
            return;
        }

        addFavouriteMutation.mutate(item!.id);
    }

    return (
        <PageTransition>
            <Container maxWidth="xl" sx={{ py: { xs: 1, md: 3 } }}>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '0.91fr 0.9fr' },
                        gap: { xs: 4, md: 7 },
                        alignItems: 'start',
                    }}
                >
                    <Box>
                        <Box
                            sx={{
                                borderRadius: 6,
                                overflow: 'hidden',
                                bgcolor: '#F3F4F6',
                                minHeight: { xs: 360, md: 620 },
                                display: 'grid',
                                placeItems: 'center',
                            }}
                        >
                            {mainImage ? (
                                <Box
                                    component="img"
                                    src={mainImage}
                                    alt={item.name}
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        maxHeight: { xs: 460, md: 680 },
                                        objectFit: 'cover',
                                    }}
                                />
                            ) : (
                                <DiamondIcon color="secondary" sx={{ fontSize: 120 }} />
                            )}
                        </Box>

                        {item.images.length > 1 && (
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: {
                                        xs: 'repeat(4, 1fr)',
                                        md: 'repeat(6, 1fr)',
                                    },
                                    gap: 1.5,
                                    mt: 2,
                                }}
                            >
                                {item.images.map((image) => (
                                    <Box
                                        key={image.id}
                                        onClick={() => setSelectedImage(image.image_url)}
                                        sx={{
                                            height: 94,
                                            borderRadius: 3,
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            border:
                                                mainImage === image.image_url
                                                    ? '2px solid'
                                                    : '1px solid #E5E7EB',
                                            borderColor:
                                                mainImage === image.image_url
                                                    ? 'secondary.main'
                                                    : '#E5E7EB',
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={image.image_url}
                                            alt={item.name}
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Box>

                    <Box
                        sx={{
                            position: { md: 'sticky' },
                            top: { md: 110 },
                        }}
                    >

                        <Typography
                            variant="h2"
                            sx={{
                                fontSize: { xs: 38, md: 50 },
                                mt: 1,
                                mb: 2,
                            }}
                        >
                            {item.name}
                        </Typography>

                        <Box sx={{ mb: 3 }}>
                            <PriceDisplay price={item.price} variant="large" />
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                            <Chip label={item.material} variant="outlined" />
                            {item.stones && <Chip label={`Stones: ${item.stones}`} variant="outlined" />}
                            {item.weight && <Chip label={`${item.weight}g`} variant="outlined" />}
                            {item.stock === 0 ? (
                                <Chip label="Out of stock" color="error" />
                            ) : (
                                <Chip label="Available" color="success" />
                            )}
                        </Box>

                        <Typography color="text.secondary" sx={{ fontSize: 17, mb: 3 }}>
                            {item.description || 'A refined jewellery piece for timeless everyday elegance.'}
                        </Typography>

                        <Divider sx={{ my: 3 }} />

                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <Button
                                size="large"
                                variant="contained"
                                startIcon={isFavourite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                onClick={handleFavourite}
                            >
                                {isFavourite ? 'Remove Favourite' : 'Save Favourite'}
                            </Button>

                            <IconButton
                                onClick={handleFavourite}
                                sx={{
                                    border: '1px solid #E5E7EB',
                                }}
                            >
                                {isFavourite ? (
                                    <FavoriteIcon color="error" />
                                ) : (
                                    <FavoriteBorderIcon />
                                )}
                            </IconButton>
                        </Box>

                        <Box
                            sx={{
                                mt: 4,
                                p: 3,
                                borderRadius: 4,
                                bgcolor: 'background.paper',
                                border: '1px solid #E5E7EB',
                            }}
                        >
                            <Typography variant="h6">Product Details</Typography>

                            <Box sx={{ display: 'grid', gap: 1.25, mt: 2 }}>
                                <Typography color="text.secondary">
                                    Category: {item.category?.name || '-'}
                                </Typography>
                                <Typography color="text.secondary">
                                    Material: {item.material}
                                </Typography>
                                <Typography color="text.secondary">
                                    Stones: {item.stones || '-'}
                                </Typography>
                                <Typography color="text.secondary">
                                    SKU: {item.sku || '-'}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </PageTransition>
    );
}