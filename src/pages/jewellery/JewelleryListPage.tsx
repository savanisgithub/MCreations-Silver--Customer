import { useEffect, useMemo, useState } from 'react';
import {
    Box,
    Button,
    Container,
    Drawer,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Pagination,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import CloseIcon from '@mui/icons-material/Close';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import ProductCard from '../../components/common/ProductCard';
import PageLoading from '../../components/common/PageLoading';
import PageError from '../../components/common/PageError';
import EmptyState from '../../components/common/EmptyState';
import { categoryService } from '../../services/category.service';
import { favouriteService } from '../../services/favourite.service';
import { jewelleryService } from '../../services/jewellery.service';
import { useAuth } from '../../context/AuthContext';
import type { JewelleryItem, JewelleryMaterial } from '../../types/jewellery.types';
import PageTransition from '../../components/common/PageTransition';

export default function JewelleryListPage() {
    const { slug } = useParams();
    const location = useLocation();
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    const { isAuthenticated } = useAuth();

    const searchParams = useMemo(
        () => new URLSearchParams(location.search),
        [location.search],
    );

    const initialMaterial = searchParams.get('material') as JewelleryMaterial | null;

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [material, setMaterial] = useState<JewelleryMaterial | ''>(
        initialMaterial || '',
    );
    const [categoryId, setCategoryId] = useState<number | ''>('');
    const [filterOpen, setFilterOpen] = useState(false);

    const limit = 12;

    const { data: categories = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: categoryService.getCategories,
    });

    const selectedCategory = categories.find((category) => category.slug === slug);

    useEffect(() => {
        if (selectedCategory) {
            setCategoryId(selectedCategory.id);
        }
    }, [selectedCategory]);

    const {
        data,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: [
            'customer-jewellery',
            page,
            search,
            material,
            categoryId,
            slug,
        ],
        queryFn: () =>
            jewelleryService.getJewelleryItems({
                page,
                limit,
                search: search || undefined,
                material: material || undefined,
                category_id: categoryId === '' ? undefined : categoryId,
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

    function resetFilters() {
        setSearch('');
        setMaterial('');
        if (!slug) {
            setCategoryId('');
        }
        setPage(1);
    }

    const filterContent = (
        <Box sx={{ display: 'grid', gap: 2 }}>
            <TextField
                label="Search jewellery"
                value={search}
                onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                }}
                fullWidth
            />

            <FormControl fullWidth>
                <InputLabel>Material</InputLabel>
                <Select
                    label="Material"
                    value={material}
                    onChange={(event) => {
                        setMaterial(event.target.value as JewelleryMaterial | '');
                        setPage(1);
                    }}
                >
                    <MenuItem value="">All Materials</MenuItem>
                    <MenuItem value="SILVER">Silver</MenuItem>
                    <MenuItem value="GOLD">Gold</MenuItem>
                    <MenuItem value="PLATINUM">Platinum</MenuItem>
                    <MenuItem value="OTHER">Other</MenuItem>
                </Select>
            </FormControl>

            {!slug && (
                <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                        label="Category"
                        value={categoryId}
                        onChange={(event) => {
                            const rawValue = String(event.target.value);
                            setCategoryId(rawValue === '' ? '' : Number(rawValue));
                            setPage(1);
                        }}
                    >
                        <MenuItem value="">All Categories</MenuItem>
                        {categories.map((category) => (
                            <MenuItem key={category.id} value={category.id}>
                                {category.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}

            <Button variant="outlined" onClick={resetFilters}>
                Reset Filters
            </Button>
        </Box>
    );

    return (
        <PageTransition>
            <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 } }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: { xs: 'flex-start', md: 'flex-end' },
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 2,
                        mb: 4,
                    }}
                >
                    <Box>
                        <Typography
                            variant="h2"
                            sx={{ fontSize: { xs: 38, md: 56 } }}
                        >
                            {selectedCategory?.name || 'Jewellery'}
                        </Typography>

                        <Typography color="text.secondary" sx={{ maxWidth: 680 }}>
                            {selectedCategory?.description ||
                                'Explore carefully selected jewellery pieces with timeless elegance.'}
                        </Typography>
                    </Box>

                    <Button
                        startIcon={<TuneIcon />}
                        variant="outlined"
                        onClick={() => setFilterOpen(true)}
                        sx={{ display: { xs: 'inline-flex', md: 'none' } }}
                    >
                        Filters
                    </Button>
                </Box>

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '280px 1fr' },
                        gap: 4,
                        alignItems: 'start',
                    }}
                >
                    <Box
                        sx={{
                            display: { xs: 'none', md: 'block' },
                            position: 'sticky',
                            top: 104,
                            border: '1px solid #E5E7EB',
                            borderRadius: 4,
                            bgcolor: 'background.paper',
                            p: 2.5,
                        }}
                    >
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Refine
                        </Typography>
                        {filterContent}
                    </Box>

                    <Box>
                        {isLoading && <PageLoading minHeight={420} />}

                        {isError && (
                            <PageError
                                message={(error as any)?.message || 'Failed to load jewellery'}
                            />
                        )}

                        {!isLoading && !isError && data?.data.length === 0 && (
                            <EmptyState message="No jewellery items found." />
                        )}

                        {!isLoading && !isError && data && data.data.length > 0 && (
                            <>
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
                                    {data.data.map((item) => (
                                        <ProductCard
                                            key={item.id}
                                            item={item}
                                            isFavourite={favouriteIds.includes(item.id)}
                                            onFavouriteClick={handleFavourite}
                                        />
                                    ))}
                                </Box>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        mt: 5,
                                    }}
                                >
                                    <Pagination
                                        page={page}
                                        count={data.meta.total_pages || 1}
                                        onChange={(_, value) => setPage(value)}
                                        color="primary"
                                    />
                                </Box>
                            </>
                        )}
                    </Box>
                </Box>
            </Container>

            <Drawer
                anchor="right"
                open={filterOpen}
                onClose={() => setFilterOpen(false)}
            >
                <Box sx={{ width: 320, p: 2.5 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 2,
                        }}
                    >
                        <Typography variant="h6">Filters</Typography>
                        <IconButton onClick={() => setFilterOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {filterContent}
                </Box>
            </Drawer>
        </PageTransition>
    );
}