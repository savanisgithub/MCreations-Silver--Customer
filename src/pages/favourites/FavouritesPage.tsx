import { Box, Container, Typography } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import EmptyState from '../../components/common/EmptyState';
import PageError from '../../components/common/PageError';
import PageLoading from '../../components/common/PageLoading';
import ProductCard from '../../components/common/ProductCard';
import { favouriteService } from '../../services/favourite.service';
import type { JewelleryItem } from '../../types/jewellery.types';
import PageTransition from '../../components/common/PageTransition';

export default function FavouritesPage() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    const {
        data: favourites = [],
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['my-favourites'],
        queryFn: favouriteService.getMyFavourites,
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
        removeFavouriteMutation.mutate(item.id);
    }

    return (
        <PageTransition>
            <Container maxWidth="xl" sx={{  py: { xs: 2, md: 3 }}}>
                <Box sx={{ textAlign: 'center', maxWidth: 760, mx: 'auto', mb: 5 }}>
                    <Typography
                        variant="h2"
                        sx={{
                            fontFamily: 'Georgia, Times New Roman, serif',
                            fontSize: { xs: 38, md: 56 },
                            mb: 2,
                        }}
                    >
                        Your Favourites
                    </Typography>

                    <Typography color="text.secondary" sx={{ fontSize: 18 }}>
                        Jewellery pieces you saved for later.
                    </Typography>
                </Box>

                {isLoading && <PageLoading minHeight={360} />}

                {isError && (
                    <PageError
                        message={(error as any)?.message || 'Failed to load favourites'}
                    />
                )}

                {!isLoading && !isError && favourites.length === 0 && (
                    <EmptyState message="You have not saved any favourites yet." />
                )}

                {!isLoading && !isError && favourites.length > 0 && (
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
                        {favourites.map((favourite) => (
                            <ProductCard
                                key={favourite.id}
                                item={favourite.jewellery_item}
                                isFavourite
                                favouriteDisabled={removeFavouriteMutation.isPending}
                                onFavouriteClick={handleFavourite}
                            />
                        ))}
                    </Box>
                )}
            </Container>
        </PageTransition>
    );
}