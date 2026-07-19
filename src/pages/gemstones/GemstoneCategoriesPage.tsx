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
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../../components/common/EmptyState';
import PageError from '../../components/common/PageError';
import PageLoading from '../../components/common/PageLoading';
import PageTransition from '../../components/common/PageTransition';
import { gemstoneCategoryService } from '../../services/gemstone-category.service';

export default function GemstoneCategoriesPage() {
    const navigate = useNavigate();

    const {
        data: categories = [],
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['gemstone-category-tree'],
        queryFn: gemstoneCategoryService.getPublicTree,
    });

    function goToCategory(categoryId: number) {
        navigate(`/gemstones?category=${categoryId}`);
    }

    return (
        <PageTransition>
            <Box
                sx={{
                    bgcolor: '#111827',
                    color: 'common.white',
                    py: { xs: 6, md: 9 },
                }}
            >
                <Container maxWidth="xl">
                    <Typography
                        variant="overline"
                        sx={{
                            color: 'secondary.light',
                            letterSpacing: '0.2em',
                            fontWeight: 800,
                        }}
                    >
                        MCreations Gemstones
                    </Typography>

                    <Typography
                        sx={{
                            fontFamily: 'Georgia, Times New Roman, serif',
                            fontSize: { xs: 40, md: 62 },
                            lineHeight: 1.08,
                            mt: 1,
                            maxWidth: 740,
                        }}
                    >
                        Natural character, carefully presented.
                    </Typography>

                    <Typography
                        sx={{
                            mt: 2,
                            maxWidth: 620,
                            color: 'rgba(255,255,255,0.72)',
                            fontSize: { xs: 16, md: 18 },
                            lineHeight: 1.7,
                        }}
                    >
                        Browse gemstone families, discover individual stones, and
                        view certificate imagery where it is available.
                    </Typography>

                    <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        endIcon={<ArrowForwardIcon />}
                        onClick={() => navigate('/gemstones')}
                        sx={{ mt: 3 }}
                    >
                        Explore All Gemstones
                    </Button>
                </Container>
            </Box>

            <Container maxWidth="xl" sx={{ py: { xs: 4, md: 7 } }}>
                <Box sx={{ mb: 4 }}>
                    <Typography
                        sx={{
                            fontFamily: 'Georgia, Times New Roman, serif',
                            fontSize: { xs: 34, md: 46 },
                        }}
                    >
                        Browse by gemstone family
                    </Typography>

                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                        Select a category or subcategory to view its available
                        gemstones.
                    </Typography>
                </Box>

                {isLoading && <PageLoading minHeight={360} />}

                {isError && (
                    <PageError
                        message={
                            (error as any)?.message ||
                            'Failed to load gemstone categories'
                        }
                    />
                )}

                {!isLoading && !isError && categories.length === 0 && (
                    <EmptyState message="No gemstone categories are available yet." />
                )}

                {!isLoading && !isError && categories.length > 0 && (
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                sm: 'repeat(2, 1fr)',
                                lg: 'repeat(3, 1fr)',
                            },
                            gap: 3,
                        }}
                    >
                        {categories.map((category, index) => {
                            const hasChildren = Boolean(category.children?.length);

                            return (
                                <Card
                                    key={category.id}
                                    elevation={0}
                                    sx={{
                                        overflow: 'hidden',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: 0,
                                        animation: `gemstoneCategoryReveal 460ms ease both ${Math.min(index * 75, 375)
                                            }ms`,
                                        '@keyframes gemstoneCategoryReveal': {
                                            from: {
                                                opacity: 0,
                                                transform: 'translateY(16px)',
                                            },
                                            to: {
                                                opacity: 1,
                                                transform: 'translateY(0)',
                                            },
                                        },
                                        '@media (prefers-reduced-motion: reduce)': {
                                            animation: 'none',
                                        },
                                        transition:
                                            'transform 240ms ease, box-shadow 240ms ease',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow:
                                                '0 22px 44px rgba(15,23,42,0.10)',
                                            '& .gemstone-category-image': {
                                                transform: 'scale(1.045)',
                                            },
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            height: { xs: 230, md: 280 },
                                            bgcolor: '#F3F4F6',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        {category.image_url ? (
                                            <Box
                                                className="gemstone-category-image"
                                                component="img"
                                                src={category.image_url}
                                                alt={category.name}
                                                loading="lazy"
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
                                                }}
                                            >
                                                <DiamondIcon
                                                    color="secondary"
                                                    sx={{ fontSize: 88 }}
                                                />
                                            </Box>
                                        )}
                                    </Box>

                                    <CardContent sx={{ p: 3 }}>
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                fontFamily:
                                                    'Georgia, Times New Roman, serif',
                                            }}
                                        >
                                            {category.name}
                                        </Typography>

                                        <Typography
                                            color="text.secondary"
                                            sx={{ mt: 1, minHeight: 48 }}
                                        >
                                            {category.description ||
                                                'Explore this gemstone family.'}
                                        </Typography>

                                        {!hasChildren && (
                                            <Button
                                                endIcon={<ArrowForwardIcon />}
                                                onClick={() =>
                                                    goToCategory(category.id)
                                                }
                                                sx={{
                                                    mt: 2,
                                                    px: 0,
                                                    '&:hover': {
                                                        bgcolor: 'transparent',
                                                    },
                                                }}
                                            >
                                                View Gemstones
                                            </Button>
                                        )}

                                        {hasChildren && (
                                            <Box
                                                sx={{
                                                    display: 'grid',
                                                    gap: 0.75,
                                                    mt: 2.25,
                                                }}
                                            >
                                                <Typography
                                                    variant="overline"
                                                    color="text.secondary"
                                                    sx={{ letterSpacing: '0.12em' }}
                                                >
                                                    Explore Collection
                                                </Typography>

                                                {category.children?.map((child) => (
                                                    <Button
                                                        key={child.id}
                                                        variant="outlined"
                                                        color="inherit"
                                                        endIcon={<ArrowForwardIcon />}
                                                        onClick={() =>
                                                            goToCategory(child.id)
                                                        }
                                                        sx={{
                                                            justifyContent:
                                                                'space-between',
                                                            borderColor: '#E5E7EB',
                                                            color: 'text.primary',
                                                            '&:hover': {
                                                                borderColor:
                                                                    'secondary.main',
                                                                color: 'secondary.main',
                                                                bgcolor: 'transparent',
                                                            },
                                                        }}
                                                    >
                                                        {child.name}
                                                    </Button>
                                                ))}
                                            </Box>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </Box>
                )}
            </Container>
        </PageTransition>
    );
}