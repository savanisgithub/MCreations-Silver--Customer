import { useEffect, useMemo, useState } from 'react';
import {
    Box,
    Button,
    Container,
    Drawer,
    IconButton,
    Pagination,
    Typography,
} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import CloseIcon from '@mui/icons-material/Close';
import DiamondIcon from '@mui/icons-material/Diamond';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import EmptyState from '../../components/common/EmptyState';
import GemstoneCard from '../../components/common/GemstoneCard';
import PageError from '../../components/common/PageError';
import PageLoading from '../../components/common/PageLoading';
import PageTransition from '../../components/common/PageTransition';
import GemstoneFilterPanel from '../../components/gemstones/GemstoneFilterPanel';
import { gemstoneCategoryService } from '../../services/gemstone-category.service';
import { gemstoneService } from '../../services/gemstone.service';
import { useDebounce } from '../../hooks/useDebounce';
import {
    flattenGemstoneCategories,
    getGemstoneCategoryAndDescendantIds,
} from '../../utils/gemstone-category';
import ActiveGemstoneFilters from '../../components/gemstones/ActiveGemstoneFilter';

const PAGE_LIMIT = 12;

function getSafePage(value: string | null): number {
    const page = Number(value || 1);

    if (!Number.isFinite(page) || page < 1) {
        return 1;
    }

    return page;
}

function getSafeCategoryId(value: string | null): number | '' {
    if (!value) {
        return '';
    }

    const categoryId = Number(value);

    if (!Number.isFinite(categoryId) || categoryId < 1) {
        return '';
    }

    return categoryId;
}

export default function GemstoneListPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const categoryId = useMemo(
        () => getSafeCategoryId(searchParams.get('category')),
        [searchParams],
    );

    const page = useMemo(
        () => getSafePage(searchParams.get('page')),
        [searchParams],
    );

    const searchParam = searchParams.get('search') || '';

    const [search, setSearch] = useState(searchParam);
    const [filterOpen, setFilterOpen] = useState(false);

    const debouncedSearch = useDebounce(search, 450);

    const {
        data: categories = [],
        isLoading: categoriesLoading,
        isError: categoriesIsError,
        error: categoriesError,
    } = useQuery({
        queryKey: ['gemstone-category-tree'],
        queryFn: gemstoneCategoryService.getPublicTree,
    });

    const flatCategories = useMemo(
        () => flattenGemstoneCategories(categories),
        [categories],
    );

    const selectedCategory = flatCategories.find(
        (category) => category.id === categoryId,
    );

    const selectedCategoryIds = useMemo(() => {
        if (categoryId === '') {
            return [];
        }

        return getGemstoneCategoryAndDescendantIds(categories, categoryId);
    }, [categories, categoryId]);

    const categoryFilterKey = selectedCategoryIds.join(',');
    const shouldWaitForCategoryTree = categoryId !== '' && categoriesLoading;

    const {
        data,
        isLoading,
        isError,
        error,
        isFetching,
    } = useQuery({
        queryKey: [
            'customer-gemstones',
            page,
            debouncedSearch,
            categoryId,
            categoryFilterKey,
        ],
        enabled: !shouldWaitForCategoryTree,
        queryFn: () => {
            const params = {
                page,
                limit: PAGE_LIMIT,
                search: debouncedSearch.trim() || undefined,
            };

            if (categoryId === '') {
                return gemstoneService.getGemstones(params);
            }

            if (selectedCategoryIds.length > 1) {
                return gemstoneService.getGemstonesByCategoryIds(
                    selectedCategoryIds,
                    params,
                );
            }

            return gemstoneService.getGemstones({
                ...params,
                gemstone_category_id: categoryId,
            });
        },
    });

    const gemstonesLoading = isLoading || shouldWaitForCategoryTree;

    const resultCount = useMemo(() => {
        const meta = data?.meta as
            | {
                total?: number;
                total_items?: number;
                total_count?: number;
            }
            | undefined;

        return (
            meta?.total ||
            meta?.total_items ||
            meta?.total_count ||
            data?.data.length ||
            0
        );
    }, [data]);

    const totalPages = useMemo(() => {
        const meta = data?.meta as { total_pages?: number } | undefined;

        return Math.max(meta?.total_pages || 1, 1);
    }, [data]);

    useEffect(() => {
        setSearch(searchParam);
    }, [searchParam]);

    useEffect(() => {
        const trimmedSearch = debouncedSearch.trim();

        if (trimmedSearch === searchParam) {
            return;
        }

        const nextParams = new URLSearchParams(searchParams);

        if (trimmedSearch) {
            nextParams.set('search', trimmedSearch);
        } else {
            nextParams.delete('search');
        }

        nextParams.delete('page');

        if (nextParams.toString() !== searchParams.toString()) {
            setSearchParams(nextParams, { replace: true });
        }
    }, [debouncedSearch, searchParam, searchParams, setSearchParams]);

    useEffect(() => {
        if (data && page > totalPages) {
            const nextParams = new URLSearchParams(searchParams);

            if (totalPages > 1) {
                nextParams.set('page', String(totalPages));
            } else {
                nextParams.delete('page');
            }

            setSearchParams(nextParams, { replace: true });
        }
    }, [data, page, totalPages, searchParams, setSearchParams]);

    function updateSearchParams(
        updater: (params: URLSearchParams) => void,
        replace = true,
    ) {
        const nextParams = new URLSearchParams(searchParams);

        updater(nextParams);

        if (nextParams.toString() !== searchParams.toString()) {
            setSearchParams(nextParams, { replace });
        }
    }

    function handleSearchChange(value: string) {
        setSearch(value);
    }

    function clearSearch() {
        setSearch('');

        updateSearchParams((params) => {
            params.delete('search');
            params.delete('page');
        });
    }

    function handleCategoryChange(value: number | '') {
        updateSearchParams((params) => {
            if (value === '') {
                params.delete('category');
            } else {
                params.set('category', String(value));
            }

            params.delete('page');
        });

        setFilterOpen(false);
    }

    function resetFilters() {
        setSearch('');
        setSearchParams(new URLSearchParams(), { replace: true });
        setFilterOpen(false);
    }

    function handlePageChange(value: number) {
        updateSearchParams(
            (params) => {
                if (value > 1) {
                    params.set('page', String(value));
                } else {
                    params.delete('page');
                }
            },
            false,
        );

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }

    const filterContent = (
        <GemstoneFilterPanel
            search={search}
            categoryId={categoryId}
            categories={flatCategories}
            categoriesLoading={categoriesLoading}
            categoriesIsError={categoriesIsError}
            categoriesErrorMessage={(categoriesError as any)?.message}
            onSearchChange={handleSearchChange}
            onCategoryChange={handleCategoryChange}
            onReset={resetFilters}
        />
    );

    return (
        <PageTransition>
            <Box
                sx={{
                    bgcolor: '#111827',
                    color: 'common.white',
                    py: { xs: 5, md: 8 },
                }}
            >
                <Container maxWidth="xl">
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                md: '1.2fr 0.8fr',
                            },
                            gap: 4,
                            alignItems: 'center',
                        }}
                    >
                        <Box>
                            <Typography
                                variant="overline"
                                sx={{
                                    color: 'secondary.light',
                                    letterSpacing: '0.2em',
                                    fontWeight: 900,
                                }}
                            >
                                Gemstone Collection
                            </Typography>

                            <Typography
                                sx={{
                                    fontFamily:
                                        'Georgia, Times New Roman, serif',
                                    fontSize: { xs: 40, md: 62 },
                                    lineHeight: 1.08,
                                    mt: 1,
                                }}
                            >
                                {selectedCategory?.name || 'Explore Gemstones'}
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 2,
                                    maxWidth: 680,
                                    color: 'rgba(255,255,255,0.72)',
                                    fontSize: { xs: 16, md: 18 },
                                    lineHeight: 1.7,
                                }}
                            >
                                {selectedCategory?.description ||
                                    'Browse gemstones by category and view stone images, measurements, and available certificate previews.'}
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                display: { xs: 'none', md: 'grid' },
                                placeItems: 'center',
                            }}
                        >
                            <Box
                                sx={{
                                    width: 210,
                                    height: 210,
                                    borderRadius: '50%',
                                    border: '1px solid rgba(255,255,255,0.18)',
                                    display: 'grid',
                                    placeItems: 'center',
                                    bgcolor: 'rgba(255,255,255,0.04)',
                                }}
                            >
                                <DiamondIcon
                                    sx={{
                                        fontSize: 96,
                                        color: 'secondary.light',
                                    }}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="xl" sx={{ py: { xs: 4, md: 7 } }}>
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
                            sx={{
                                fontFamily: 'Georgia, Times New Roman, serif',
                                fontSize: { xs: 32, md: 44 },
                                lineHeight: 1.15,
                            }}
                        >
                            Available Stones
                        </Typography>

                        <Typography color="text.secondary">
                            Use search and category filters to find the right
                            gemstone.
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
                        gridTemplateColumns: {
                            xs: '1fr',
                            md: '290px 1fr',
                        },
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
                            borderRadius: 0,
                            bgcolor: 'background.paper',
                            p: 2.5,
                        }}
                    >
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Refine Gemstones
                        </Typography>

                        {filterContent}
                    </Box>

                    <Box>
                        {!gemstonesLoading && !isError && (
                            <ActiveGemstoneFilters
                                search={searchParam}
                                selectedCategory={selectedCategory}
                                resultCount={resultCount}
                                isFetching={isFetching}
                                onClearSearch={clearSearch}
                                onClearCategory={() => handleCategoryChange('')}
                            />
                        )}

                        {gemstonesLoading && <PageLoading minHeight={420} />}

                        {isError && (
                            <PageError
                                message={
                                    (error as any)?.message ||
                                    'Failed to load gemstones'
                                }
                            />
                        )}

                        {!gemstonesLoading && !isError && data?.data.length === 0 && (
                            <EmptyState message="No gemstones found for the selected filters." />
                        )}

                        {!gemstonesLoading &&
                            !isError &&
                            data &&
                            data.data.length > 0 && (
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
                                        {data.data.map((gemstone) => (
                                            <GemstoneCard
                                                key={gemstone.id}
                                                gemstone={gemstone}
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
                                            count={totalPages}
                                            onChange={(_, value) =>
                                                handlePageChange(value)
                                            }
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
                        <Typography variant="h6">Gemstone Filters</Typography>

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
