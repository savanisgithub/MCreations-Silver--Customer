import { Box, Container, Skeleton } from '@mui/material';

export default function ProductDetailsSkeleton() {
    return (
        <Container maxWidth="xl" sx={{ py: { xs: 4, md: 7 } }}>
            <Skeleton width={100} height={36} sx={{ mb: 3 }} />

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' },
                    gap: { xs: 4, md: 7 },
                }}
            >
                <Box>
                    <Skeleton
                        variant="rectangular"
                        sx={{
                            borderRadius: 6,
                            height: { xs: 360, md: 620 },
                        }}
                    />

                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(5, 1fr)',
                            gap: 1.5,
                            mt: 2,
                        }}
                    >
                        {Array.from({ length: 5 }).map((_, index) => (
                            <Skeleton
                                key={index}
                                variant="rectangular"
                                sx={{ borderRadius: 3, height: 94 }}
                            />
                        ))}
                    </Box>
                </Box>

                <Box>
                    <Skeleton width={120} height={24} />
                    <Skeleton width="80%" height={70} />
                    <Skeleton width={180} height={42} sx={{ mb: 2 }} />
                    <Skeleton width="100%" height={26} />
                    <Skeleton width="90%" height={26} />
                    <Skeleton width="70%" height={26} />
                    <Skeleton width={220} height={54} sx={{ mt: 3 }} />
                </Box>
            </Box>
        </Container>
    );
}