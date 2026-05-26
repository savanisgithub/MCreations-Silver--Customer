import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Typography,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DiamondIcon from '@mui/icons-material/Diamond';
import BannerImage1 from '../../assets/Banner Image2.png';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import ProductCard from '../../components/common/ProductCard';
import PageLoading from '../../components/common/PageLoading';
import PageError from '../../components/common/PageError';
import { categoryService } from '../../services/category.service';
import { favouriteService } from '../../services/favourite.service';
import { jewelleryService } from '../../services/jewellery.service';
import { useAuth } from '../../context/AuthContext';
import ProductGridSkeleton from '../../components/common/ProductGridSkeleton';
import type { JewelleryItem } from '../../types/jewellery.types';
import EmptyState from '../../components/common/EmptyState';

const features = [
    {
        title: 'Elegant Silver',
        description: 'Curated silver jewellery for timeless everyday style.',
        icon: <DiamondIcon />,
    },
    {
        title: 'Save Favourites',
        description: 'Create an account and save jewellery pieces you love.',
        icon: <FavoriteBorderIcon />,
    },
    {
        title: 'Premium Look',
        description: 'Clean designs with detailed images and item information.',
        icon: <WorkspacePremiumOutlinedIcon />,
    },
    {
        title: 'Easy Browsing',
        description: 'Explore by categories, materials, stones, and price.',
        icon: <LocalShippingOutlinedIcon />,
    },
];

export default function HomePage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    const { isAuthenticated } = useAuth();

    const {
        data: categories = [],
        isLoading: categoriesLoading,
        isError: categoriesError,
    } = useQuery({
        queryKey: ['categories'],
        queryFn: categoryService.getCategories,
    });

    const {
        data: jewellery,
        isLoading: jewelleryLoading,
        isError: jewelleryError,
    } = useQuery({
        queryKey: ['featured-jewellery'],
        queryFn: () =>
            jewelleryService.getJewelleryItems({
                page: 1,
                limit: 8,
            }),
    });

    const { data: favourites = [] } = useQuery({
        queryKey: ['my-favourites'],
        queryFn: favouriteService.getMyFavourites,
        enabled: isAuthenticated,
    });

    const favouriteIds = favourites.map((fav) => fav.jewellery_item_id);

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

    function handleFavourite(item: JewelleryItem) {
        if (!isAuthenticated) {
            enqueueSnackbar('Please login to save favourites', { variant: 'info' });
            return;
        }

        if (favouriteIds.includes(item.id)) {
            removeFavouriteMutation.mutate(item.id);
            return;
        }

        addFavouriteMutation.mutate(item.id);
    }

    return (
        <Box>
            <Box
                sx={{
                    minHeight: { xs: 360, md: 530 },
                    display: 'flex',
                    alignItems: 'center',
                    background:
                        'linear-gradient(135deg, #111827 0%, #1F2933 48%, #BFA46F 130%)',
                    color: 'white',
                }}
            >
                <Container maxWidth="xl">
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', md: '1.05fr 1fr' },
                            gap: { xs: 4, md: 4 },
                            alignItems: 'center',
                            py: { xs: 2, md: 3 },
                        }}
                    >
                        <Box>
                            <Typography
                                variant="overline"
                                sx={{
                                    color: 'secondary.light',
                                    letterSpacing: 3,
                                    fontWeight: 800,
                                }}
                            >
                                Silver Jewellery Collection
                            </Typography>

                            <Typography
                                variant="h1"
                                sx={{
                                    fontSize: { xs: 44, sm: 58, md: 76 },
                                    lineHeight: 0.95,
                                    mt: 1,
                                    mb: 3,
                                }}
                            >
                                Jewellery that feels quietly luxurious.
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: { xs: 17, md: 20 },
                                    color: 'rgba(255,255,255,0.74)',
                                    maxWidth: 620,
                                    mb: 4,
                                }}
                            >
                                Discover elegant silver pieces, curated categories, and timeless
                                designs made for everyday beauty.
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    size="large"
                                    endIcon={<ArrowForwardIcon />}
                                    onClick={() => navigate('/jewellery')}
                                >
                                    Shop Jewellery
                                </Button>

                                <Button
                                    variant="outlined"
                                    size="large"
                                    onClick={() => navigate('/categories')}
                                    sx={{
                                        color: 'white',
                                        borderColor: 'rgba(255,255,255,0.35)',
                                        '&:hover': {
                                            borderColor: 'white',
                                        },
                                    }}
                                >
                                    View Categories
                                </Button>
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                display: { xs: 'none', md: 'block' },
                                borderRadius: 4,
                                minHeight: { md: 380, lg: 440 },
                                background:
                                    'radial-gradient(circle at top left, rgba(255,255,255,0.32), rgba(255,255,255,0.05)), linear-gradient(145deg, rgba(255,255,255,0.18), rgba(255,255,255,0.04))',
                                border: '1px solid rgba(255,255,255,0.22)',
                                backdropFilter: 'blur(12px)',
                                p: 1,
                                overflow: 'hidden',
                            }}
                        >
                            <Box
                                component="img"
                                src={BannerImage1}
                                alt="BannerImage"
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: 4,
                                    objectFit: 'cover',
                                    objectPosition: 'center',
                                }}
                            />
                        </Box>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="xl" sx={{ py: { xs: 2, md: 6 } }}>
                <Box sx={{ mb: { xs: 4, md: 8 } }}>
                    <Box
                        sx={{
                            textAlign: 'center',
                            mb: { xs: 2, md: 3 },
                        }}
                    >
                        <Typography
                            sx={{
                                fontFamily: 'Georgia, Times New Roman, serif',
                                fontSize: { xs: 34, md: 46 },
                                fontWeight: 400,
                                color: 'text.primary',
                                letterSpacing: '-0.03em',
                            }}
                        >
                            Shop by Category
                        </Typography>
                    </Box>

                    {categoriesLoading && <PageLoading minHeight={280} />}

                    {categoriesError && <PageError message="Failed to load categories" />}

                    {!categoriesLoading && !categoriesError && categories.length === 0 && (
                        <EmptyState message="No categories available." />
                    )}

                    {!categoriesLoading && !categoriesError && categories.length > 0 && (
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: '1fr',
                                    sm: 'repeat(3, 1fr)',
                                    md: 'repeat(3, 1fr)',
                                    lg: 'repeat(5, 1fr)',
                                },
                                gap: {
                                    xs: 3,
                                    md: 3.5,
                                },
                            }}
                        >
                            {categories.slice(0, 5).map((category) => (
                                <Box
                                    key={category.id}
                                    onClick={() => navigate(`/categories/${category.slug}`)}
                                    sx={{
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        group: 'category',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            height: {
                                                xs: 240,
                                                sm: 250,
                                                md: 220,
                                            },
                                            bgcolor: '#F3F4F6',
                                            overflow: 'hidden',
                                            mb: 2.5,
                                            borderRadius: 0,
                                        }}
                                    >
                                        {category.image_url ? (
                                            <Box
                                                component="img"
                                                src={category.image_url}
                                                alt={category.name}
                                                sx={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    borderRadius: 0,
                                                    transition: 'transform 420ms ease',
                                                    '&:hover': {
                                                        transform: 'scale(1.045)',
                                                    },
                                                }}
                                            />
                                        ) : (
                                            <Box
                                                sx={{
                                                    height: '100%',
                                                    display: 'grid',
                                                    placeItems: 'center',
                                                    bgcolor: '#EEF0F2',
                                                }}
                                            >
                                                <DiamondIcon
                                                    color="secondary"
                                                    sx={{
                                                        fontSize: 76,
                                                    }}
                                                />
                                            </Box>
                                        )}
                                    </Box>

                                    <Typography
                                        sx={{
                                            fontSize: 14,
                                            fontWeight: 800,
                                            letterSpacing: '0.22em',
                                            textTransform: 'uppercase',
                                            color: 'text.primary',
                                            transition: 'color 180ms ease',
                                            '&:hover': {
                                                color: 'secondary.main',
                                            },
                                        }}
                                    >
                                        {category.name}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    )}
                </Box>

                <Box sx={{ mb: 4 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            mb: 3,
                        }}
                    >
                        <Box sx={{ flex: 1, textAlign: 'center' }}>
                            <Typography
                                sx={{
                                    fontFamily: 'Georgia, Times New Roman, serif',
                                    fontSize: { xs: 34, md: 46 },
                                    fontWeight: 400,
                                    color: 'text.primary',
                                    letterSpacing: '-0.03em',
                                }}
                            >
                                Latest Jewellery
                            </Typography>
                        </Box>
                        <Button
                            variant="outlined"
                            endIcon={<ArrowForwardIcon />}
                            onClick={() => navigate('/jewellery')}
                            sx={{ flexShrink: 0 }}
                        >
                            View All
                        </Button>
                    </Box>
                </Box>

                {jewelleryLoading && <ProductGridSkeleton count={8} />}
                {jewelleryError && <PageError message="Failed to load jewellery" />}

                {!jewelleryLoading && !jewelleryError && (
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: 'repeat(2, 1fr)',
                                sm: 'repeat(3, 1fr)',
                                md: 'repeat(4, 1fr)',
                                lg: 'repeat(4, 1fr)',
                            },
                            mb: 9,
                            gap: 2,
                        }}
                    >
                        {jewellery?.data.map((item) => (
                            <ProductCard
                                key={item.id}
                                item={item}
                                isFavourite={favouriteIds.includes(item.id)}
                                favouriteDisabled={
                                    addFavouriteMutation.isPending || removeFavouriteMutation.isPending
                                }
                                onFavouriteClick={handleFavourite}
                            />
                        ))}
                    </Box>
                )}

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                            lg: 'repeat(4, 1fr)',
                        },
                        gap: 2,
                        mb: -5,
                    }}
                >
                    {features.map((feature) => (
                        <Card
                            key={feature.title}
                            elevation={0}
                            sx={{ border: '1px solid #E5E7EB', borderRadius: 3 }}
                        >
                            <CardContent>
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 3,
                                        display: 'grid',
                                        placeItems: 'center',
                                        bgcolor: 'secondary.light',
                                        color: 'primary.main',
                                        mb: 2,
                                    }}
                                >
                                    {feature.icon}
                                </Box>

                                <Typography variant="h6">{feature.title}</Typography>
                                <Typography color="text.secondary">
                                    {feature.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </Container>
        </Box>
    );
}