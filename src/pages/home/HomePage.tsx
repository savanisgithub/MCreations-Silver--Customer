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
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../../components/common/ProductCard';
import PageLoading from '../../components/common/PageLoading';
import PageError from '../../components/common/PageError';
import { categoryService } from '../../services/category.service';
import { jewelleryService } from '../../services/jewellery.service';

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

    return (
        <Box>
            <Box
                sx={{
                    minHeight: { xs: 560, md: 640 },
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
                            gridTemplateColumns: { xs: '1fr', md: '1.05fr 0.95fr' },
                            gap: { xs: 4, md: 8 },
                            alignItems: 'center',
                            py: { xs: 8, md: 10 },
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
                                borderRadius: 8,
                                minHeight: 440,
                                background:
                                    'radial-gradient(circle at top left, rgba(255,255,255,0.32), rgba(255,255,255,0.05)), linear-gradient(145deg, rgba(255,255,255,0.18), rgba(255,255,255,0.04))',
                                border: '1px solid rgba(255,255,255,0.22)',
                                backdropFilter: 'blur(12px)',
                                p: 3,
                            }}
                        >
                            <Box
                                sx={{
                                    height: '100%',
                                    borderRadius: 6,
                                    display: 'grid',
                                    placeItems: 'center',
                                    bgcolor: 'rgba(255,255,255,0.09)',
                                }}
                            >
                                <DiamondIcon sx={{ fontSize: 190, color: 'secondary.light' }} />
                            </Box>
                        </Box>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="xl" sx={{ py: { xs: 5, md: 8 } }}>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                            lg: 'repeat(4, 1fr)',
                        },
                        gap: 2,
                        mb: 8,
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

                <Box sx={{ mb: 4 }}>
                    <Typography variant="h3">Shop by Category</Typography>
                    <Typography color="text.secondary">
                        Explore jewellery collections by style.
                    </Typography>
                </Box>

                {categoriesLoading && <PageLoading />}
                {categoriesError && <PageError message="Failed to load categories" />}

                {!categoriesLoading && !categoriesError && (
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                sm: 'repeat(2, 1fr)',
                                lg: 'repeat(4, 1fr)',
                            },
                            gap: 2,
                            mb: 8,
                        }}
                    >
                        {categories.slice(0, 4).map((category) => (
                            <Card
                                key={category.id}
                                elevation={0}
                                onClick={() => navigate(`/categories/${category.slug}`)}
                                sx={{
                                    borderRadius: 3,
                                    overflow: 'hidden',
                                    border: '1px solid #E5E7EB',
                                    cursor: 'pointer',
                                    transition: '0.25s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 18px 45px rgba(15,23,42,0.10)',
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        height: 190,
                                        bgcolor: '#F3F4F6',
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
                                            }}
                                        />
                                    ) : (
                                        <Box
                                            sx={{
                                                height: '100%',
                                                display: 'grid',
                                                placeItems: 'center',
                                            }}
                                        >
                                            <DiamondIcon color="secondary" sx={{ fontSize: 70 }} />
                                        </Box>
                                    )}
                                </Box>

                                <CardContent>
                                    <Typography variant="h6">{category.name}</Typography>
                                    <Typography color="text.secondary">
                                        {category.description || 'Explore collection'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                )}

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: { xs: 'flex-start', md: 'center' },
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 2,
                        mb: 4,
                    }}
                >
                    <Box>
                        <Typography variant="h3">Latest Jewellery</Typography>
                        <Typography color="text.secondary">
                            Recently added jewellery pieces.
                        </Typography>
                    </Box>

                    <Button
                        variant="outlined"
                        endIcon={<ArrowForwardIcon />}
                        onClick={() => navigate('/jewellery')}
                    >
                        View All
                    </Button>
                </Box>

                {jewelleryLoading && <PageLoading />}
                {jewelleryError && <PageError message="Failed to load jewellery" />}

                {!jewelleryLoading && !jewelleryError && (
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
                        {jewellery?.data.map((item) => (
                            <ProductCard key={item.id} item={item} />
                        ))}
                    </Box>
                )}
            </Container>
        </Box>
    );
}