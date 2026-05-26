import {
    Box,
    Card,
    CardContent,
    Container,
    Typography,
} from '@mui/material';
import DiamondIcon from '@mui/icons-material/Diamond';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import PageLoading from '../../components/common/PageLoading';
import PageError from '../../components/common/PageError';
import EmptyState from '../../components/common/EmptyState';
import { categoryService } from '../../services/category.service';
import PageTransition from '../../components/common/PageTransition';


export default function CategoriesPage() {
    const navigate = useNavigate();

    const {
        data: categories = [],
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['categories'],
        queryFn: categoryService.getCategories,
    });

    return (
        <PageTransition>
            <Container maxWidth="xl" sx={{  py: { xs: 2, md: 3 } }}>
                <Box sx={{ textAlign: 'left', mx: 'auto', mb: 5 }}>
                    <Typography
                        variant="h2"
                        sx={{
                            fontFamily: 'Georgia, Times New Roman, serif',
                            fontSize: { xs: 38, md: 56 },
                            mb: 2,
                        }}
                    >
                        Shop by Category
                    </Typography>

                    <Typography color="text.secondary" sx={{ fontSize: 18 }}>
                        Browse carefully arranged jewellery categories and discover pieces
                        that match your style.
                    </Typography>
                </Box>

                {isLoading && <PageLoading minHeight={360} />}

                {isError && (
                    <PageError
                        message={(error as any)?.message || 'Failed to load categories'}
                    />
                )}

                {!isLoading && !isError && categories.length === 0 && (
                    <EmptyState message="No categories available." />
                )}

                {!isLoading && !isError && categories.length > 0 && (
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: 'repeat(2, 1fr)',
                                sm: 'repeat(3, 1fr)',
                                lg: 'repeat(3, 1fr)',
                            },
                            gap: 3,
                        }}
                    >
                        {categories.map((category) => (
                            <Card
                                key={category.id}
                                elevation={0}
                                onClick={() => navigate(`/categories/${category.slug}`)}
                                sx={{
                                    border: '1px solid #E5E7EB',
                                    borderRadius: 0,
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    transition: '260ms ease',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: '0 24px 55px rgba(15,23,42,0.10)',
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        height: { xs: 240, md: 300 },
                                        bgcolor: '#F3F4F6',
                                        overflow: 'hidden',
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
                                                transition: '380ms ease',
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
                                            }}
                                        >
                                            <DiamondIcon color="secondary" sx={{ fontSize: 96 }} />
                                        </Box>
                                    )}
                                </Box>

                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h5">{category.name}</Typography>

                                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                                        {category.description || 'Explore collection'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                )}
            </Container>
        </PageTransition>
    );
}