import { useMemo, useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Dialog,
    DialogContent,
    Divider,
    IconButton,
    Stack,
    Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import DiamondIcon from '@mui/icons-material/Diamond';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import StraightenIcon from '@mui/icons-material/Straighten';
import ScaleIcon from '@mui/icons-material/Scale';
import CategoryIcon from '@mui/icons-material/Category';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import PageError from '../../components/common/PageError';
import PageLoading from '../../components/common/PageLoading';
import PageTransition from '../../components/common/PageTransition';
import { gemstoneService } from '../../services/gemstone.service';
import {
    getCertificateImages,
    getPrimaryGemstoneImage,
    getStoneImages,
} from '../../utils/gemstone-image';
import ImageIcon from '@mui/icons-material/Image';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import type { GemstoneImage } from '../../types/gemstone.type';
import GemstoneCard from '../../components/common/GemstoneCard';

function formatValue(value: string | number | null | undefined, suffix = '') {
    if (value === null || value === undefined || value === '') {
        return '-';
    }

    return `${value}${suffix}`;
}

export default function GemstoneDetailsPage() {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [selectedImageUrl, setSelectedImageUrl] = useState('');
    const [previewImage, setPreviewImage] = useState<GemstoneImage | null>(null);

    const {
        data: gemstone,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['gemstone-details', slug],
        enabled: Boolean(slug),
        queryFn: () => gemstoneService.getGemstoneBySlug(slug as string),
    });

    const { data: relatedGemstones } = useQuery({
        queryKey: [
            'related-gemstones',
            gemstone?.gemstone_category_id,
            gemstone?.id,
        ],
        enabled: Boolean(gemstone?.gemstone_category_id),
        queryFn: () =>
            gemstoneService.getGemstones({
                page: 1,
                limit: 5,
                gemstone_category_id: gemstone?.gemstone_category_id,
            }),
    });

    const relatedItems =
        relatedGemstones?.data.filter((item) => item.id !== gemstone?.id).slice(0, 4) ||
        [];

    const stoneImages = useMemo(
        () => getStoneImages(gemstone?.images || []),
        [gemstone],
    );

    const certificateImages = useMemo(
        () => getCertificateImages(gemstone?.images || []),
        [gemstone],
    );

    const primaryImage = useMemo(
        () => getPrimaryGemstoneImage(gemstone?.images || []),
        [gemstone],
    );

    const mainImageUrl = selectedImageUrl || primaryImage;

    if (isLoading) {
        return <PageLoading minHeight="70vh" />;
    }

    if (isError || !gemstone) {
        return (
            <Container maxWidth="xl" sx={{ py: 6 }}>
                <PageError
                    message={
                        (error as any)?.message ||
                        'Gemstone details could not be loaded'
                    }
                />
            </Container>
        );
    }

    return (
        <PageTransition>
            <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 } }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    sx={{ mb: 3 }}
                >
                    Back
                </Button>

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            md: '0.9fr 1fr',
                        },
                        gap: { xs: 4, md: 7 },
                        alignItems: 'start',
                    }}
                >
                    <Box>
                        <Box
                            sx={{
                                minHeight: { xs: 360, md: 620 },
                                bgcolor: '#F3F4F6',
                                border: '1px solid #E5E7EB',
                                overflow: 'hidden',
                                display: 'grid',
                                placeItems: 'center',
                            }}
                        >
                            {mainImageUrl ? (
                                <Box
                                    component="img"
                                    src={mainImageUrl}
                                    alt={gemstone.name}
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        maxHeight: { xs: 460, md: 680 },
                                        objectFit: 'cover',
                                    }}
                                />
                            ) : (
                                <DiamondIcon
                                    color="secondary"
                                    sx={{ fontSize: 130 }}
                                />
                            )}
                        </Box>

                        {stoneImages.length > 0 && (
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: {
                                        xs: 'repeat(4, 1fr)',
                                        sm: 'repeat(5, 1fr)',
                                        md: 'repeat(6, 1fr)',
                                    },
                                    gap: 1.25,
                                    mt: 1.5,
                                }}
                            >
                                {stoneImages.map((image) => {
                                    const isSelected =
                                        mainImageUrl === image.image_url;

                                    return (
                                        <Box
                                            key={image.id}
                                            onClick={() =>
                                                setSelectedImageUrl(
                                                    image.image_url,
                                                )
                                            }
                                            sx={{
                                                height: { xs: 82, md: 98 },
                                                cursor: 'pointer',
                                                overflow: 'hidden',
                                                border: '2px solid',
                                                borderColor: isSelected
                                                    ? 'secondary.main'
                                                    : '#E5E7EB',
                                                bgcolor: '#F3F4F6',
                                                transition: '160ms ease',
                                                '&:hover': {
                                                    borderColor:
                                                        'secondary.main',
                                                },
                                            }}
                                        >
                                            <Box
                                                component="img"
                                                src={image.image_url}
                                                alt={gemstone.name}
                                                sx={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                }}
                                            />
                                        </Box>
                                    );
                                })}
                            </Box>
                        )}
                    </Box>

                    <Box
                        sx={{
                            position: { md: 'sticky' },
                            top: { md: 108 },
                        }}
                    >
                        <Typography
                            variant="overline"
                            sx={{
                                color: 'secondary.main',
                                letterSpacing: '0.16em',
                                fontWeight: 900,
                            }}
                        >
                            {gemstone.category?.name || 'Gemstone'}
                        </Typography>

                        <Typography
                            sx={{
                                fontFamily: 'Georgia, Times New Roman, serif',
                                fontSize: { xs: 42, md: 58 },
                                lineHeight: 1.05,
                                color: '#111827',
                                mt: 1,
                            }}
                        >
                            {gemstone.name}
                        </Typography>

                        <Typography
                            color="text.secondary"
                            sx={{
                                mt: 2,
                                fontSize: 17,
                                lineHeight: 1.75,
                            }}
                        >
                            {gemstone.description ||
                                'A carefully selected gemstone with detailed imagery and measurement information.'}
                        </Typography>

                        {/* <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 1,
                                mt: 3,
                            }}
                        >
                            <Chip
                                icon={<CategoryIcon />}
                                label={gemstone.category?.name || 'Gemstone'}
                                variant="outlined"
                            />

                            {gemstone.carat !== null &&
                                gemstone.carat !== undefined && (
                                    <Chip
                                        icon={<DiamondIcon />}
                                        label={`${gemstone.carat} ct`}
                                        variant="outlined"
                                    />
                                )}

                            {gemstone.weight !== null &&
                                gemstone.weight !== undefined && (
                                    <Chip
                                        icon={<ScaleIcon />}
                                        label={`${gemstone.weight} g`}
                                        variant="outlined"
                                    />
                                )}

                            {gemstone.size && (
                                <Chip
                                    icon={<StraightenIcon />}
                                    label={gemstone.size}
                                    variant="outlined"
                                />
                            )}

                            {certificateImages.length > 0 && (
                                <Chip
                                    icon={<WorkspacePremiumIcon />}
                                    label={`${certificateImages.length} certificate${certificateImages.length === 1
                                        ? ''
                                        : 's'
                                        }`}
                                    color="secondary"
                                    variant="outlined"
                                />
                            )}
                        </Box> */}

                        <Divider sx={{ my: 3 }} />

                        <Card
                            elevation={0}
                            sx={{
                                border: '1px solid #E5E7EB',
                                borderRadius: 0,
                                bgcolor: 'background.paper',
                            }}
                        >
                            <CardContent sx={{ p: 2 }}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        mb: 1.5,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: 18,
                                            fontWeight: 900,
                                            color: '#111827',
                                        }}
                                    >
                                        Stone Details
                                    </Typography>

                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: 'text.secondary',
                                            fontWeight: 700,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.08em',
                                        }}
                                    >
                                        Specifications
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: {
                                            xs: '1fr',
                                            sm: 'repeat(2, 1fr)',
                                        },
                                        gap: 1,
                                    }}
                                >
                                    {[
                                        {
                                            label: 'Category',
                                            value: gemstone.category?.name || '-',
                                            icon: <CategoryIcon />,
                                        },
                                        {
                                            label: 'Carat',
                                            value: formatValue(gemstone.carat, ' ct'),
                                            icon: <DiamondIcon />,
                                        },
                                        {
                                            label: 'Weight',
                                            value: formatValue(gemstone.weight, ' g'),
                                            icon: <ScaleIcon />,
                                        },
                                        {
                                            label: 'Size',
                                            value: formatValue(gemstone.size),
                                            icon: <StraightenIcon />,
                                        },
                                    ].map((item) => (
                                        <Box
                                            key={item.label}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1.25,
                                                minWidth: 0,
                                                border: '1px solid #EEF2F7',
                                                bgcolor: '#F8FAFC',
                                                px: 1.5,
                                                py: 1.25,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 34,
                                                    height: 34,
                                                    borderRadius: '50%',
                                                    display: 'grid',
                                                    placeItems: 'center',
                                                    bgcolor: '#FFFFFF',
                                                    color: 'secondary.main',
                                                    border: '1px solid #E5E7EB',
                                                    flexShrink: 0,
                                                    '& svg': {
                                                        fontSize: 18,
                                                    },
                                                }}
                                            >
                                                {item.icon}
                                            </Box>

                                            <Box sx={{ minWidth: 0 }}>
                                                <Typography
                                                    sx={{
                                                        fontSize: 12,
                                                        fontWeight: 800,
                                                        color: 'text.secondary',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.06em',
                                                        lineHeight: 1.2,
                                                    }}
                                                >
                                                    {item.label}
                                                </Typography>

                                                <Typography
                                                    sx={{
                                                        mt: 0.25,
                                                        fontSize: 15,
                                                        fontWeight: 900,
                                                        color: '#111827',
                                                        lineHeight: 1.35,
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                    }}
                                                >
                                                    {item.value}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>

                        <Card
                            elevation={0}
                            sx={{
                                border: '1px solid #E5E7EB',
                                borderRadius: 0,
                                mt: 2,
                                bgcolor: 'background.paper',
                            }}
                        >
                            <CardContent sx={{ p: 2 }}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: 2,
                                        mb: 1.5,
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Box
                                            sx={{
                                                width: 36,
                                                height: 36,
                                                borderRadius: '50%',
                                                display: 'grid',
                                                placeItems: 'center',
                                                bgcolor: '#F8FAFC',
                                                border: '1px solid #E5E7EB',
                                                color: 'secondary.main',
                                            }}
                                        >
                                            <WorkspacePremiumIcon sx={{ fontSize: 20 }} />
                                        </Box>

                                        <Box>
                                            <Typography
                                                sx={{
                                                    fontSize: 18,
                                                    fontWeight: 900,
                                                    color: '#111827',
                                                    lineHeight: 1.2,
                                                }}
                                            >
                                                Certificates
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    fontSize: 13,
                                                    color: 'text.secondary',
                                                    lineHeight: 1.35,
                                                }}
                                            >
                                                {certificateImages.length > 0
                                                    ? `${certificateImages.length} certificate image${certificateImages.length === 1 ? '' : 's'
                                                    } available`
                                                    : 'No certificate images available'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                {certificateImages.length === 0 && (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1.25,
                                            border: '1px dashed #CBD5E1',
                                            bgcolor: '#F8FAFC',
                                            px: 1.5,
                                            py: 1.5,
                                        }}
                                    >
                                        <ImageIcon sx={{ color: 'text.secondary', fontSize: 22 }} />

                                        <Typography
                                            sx={{
                                                color: 'text.secondary',
                                                fontSize: 14,
                                                fontWeight: 600,
                                            }}
                                        >
                                            Certificate images are not uploaded for this gemstone.
                                        </Typography>
                                    </Box>
                                )}

                                {certificateImages.length > 0 && (
                                    <Box
                                        sx={{
                                            display: 'grid',
                                            gridTemplateColumns: {
                                                xs: 'repeat(2, 1fr)',
                                                sm: 'repeat(3, 1fr)',
                                            },
                                            gap: 1,
                                        }}
                                    >
                                        {certificateImages.map((image, index) => (
                                            <Box
                                                key={image.id}
                                                onClick={() => setPreviewImage(image)}
                                                sx={{
                                                    cursor: 'pointer',
                                                    border: '1px solid #E5E7EB',
                                                    bgcolor: '#F8FAFC',
                                                    overflow: 'hidden',
                                                    transition:
                                                        'border-color 180ms ease, transform 180ms ease, box-shadow 180ms ease',
                                                    '&:hover': {
                                                        borderColor: 'secondary.main',
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 14px 28px rgba(15,23,42,0.08)',
                                                        '& .certificate-overlay': {
                                                            opacity: 1,
                                                        },
                                                    },
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        height: 118,
                                                        position: 'relative',
                                                        bgcolor: '#F3F4F6',
                                                    }}
                                                >
                                                    <Box
                                                        component="img"
                                                        src={image.image_url}
                                                        alt={`Certificate ${index + 1}`}
                                                        loading="lazy"
                                                        sx={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover',
                                                        }}
                                                    />

                                                    <Box
                                                        className="certificate-overlay"
                                                        sx={{
                                                            position: 'absolute',
                                                            inset: 0,
                                                            bgcolor: 'rgba(17,24,39,0.48)',
                                                            opacity: 0,
                                                            display: 'grid',
                                                            placeItems: 'center',
                                                            transition: 'opacity 180ms ease',
                                                        }}
                                                    >
                                                        <Typography
                                                            sx={{
                                                                color: 'common.white',
                                                                fontSize: 13,
                                                                fontWeight: 900,
                                                            }}
                                                        >
                                                            Preview
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                <Box sx={{ px: 1.25, py: 1 }}>
                                                    <Typography
                                                        sx={{
                                                            fontSize: 13,
                                                            fontWeight: 900,
                                                            color: '#111827',
                                                            lineHeight: 1.2,
                                                        }}
                                                    >
                                                        Certificate {index + 1}
                                                    </Typography>

                                                    <Typography
                                                        sx={{
                                                            fontSize: 12,
                                                            color: 'text.secondary',
                                                            mt: 0.25,
                                                        }}
                                                    >
                                                        Tap to view
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                            </CardContent>
                        </Card>

                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={1.5}
                            sx={{ mt: 3 }}
                        >
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => navigate('/gemstones')}
                            >
                                Browse More Gemstones
                            </Button>

                            {gemstone.category && (
                                <Button
                                    variant="outlined"
                                    size="large"
                                    onClick={() =>
                                        navigate(
                                            `/gemstones?category=${gemstone.gemstone_category_id}`,
                                        )
                                    }
                                >
                                    View Same Category
                                </Button>
                            )}
                        </Stack>
                    </Box>
                </Box>
            </Container>

            {relatedItems.length > 0 && (
                <Container maxWidth="xl" sx={{ pb: { xs: 4, md: 7 } }}>
                    <Box
                        sx={{
                            borderTop: '1px solid #E5E7EB',
                            pt: { xs: 3, md: 5 },
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: { xs: 'flex-start', sm: 'center' },
                                flexDirection: { xs: 'column', sm: 'row' },
                                gap: 2,
                                mb: 3,
                            }}
                        >
                            <Box>
                                <Typography
                                    variant="overline"
                                    sx={{
                                        color: 'secondary.main',
                                        letterSpacing: '0.16em',
                                        fontWeight: 900,
                                    }}
                                >
                                    Similar Stones
                                </Typography>

                                <Typography
                                    sx={{
                                        fontFamily: 'Georgia, Times New Roman, serif',
                                        fontSize: { xs: 30, md: 40 },
                                        lineHeight: 1.15,
                                        color: '#111827',
                                    }}
                                >
                                    More from this category
                                </Typography>
                            </Box>

                            <Button
                                endIcon={<ArrowForwardIcon />}
                                onClick={() =>
                                    navigate(
                                        `/gemstones?category=${gemstone.gemstone_category_id}`,
                                    )
                                }
                                sx={{
                                    fontWeight: 800,
                                }}
                            >
                                View All
                            </Button>
                        </Box>

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
                            {relatedItems.map((item) => (
                                <GemstoneCard key={item.id} gemstone={item} />
                            ))}
                        </Box>
                    </Box>
                </Container>
            )}

            <Dialog
                open={Boolean(previewImage)}
                onClose={() => setPreviewImage(null)}
                maxWidth="md"
                fullWidth
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        px: 2,
                        py: 1.25,
                        borderBottom: '1px solid #E5E7EB',
                    }}
                >
                    <Typography sx={{ fontWeight: 900 }}>
                        Certificate Preview
                    </Typography>

                    <IconButton onClick={() => setPreviewImage(null)}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <DialogContent sx={{ p: 0, bgcolor: '#111827' }}>
                    {previewImage && (
                        <Box
                            component="img"
                            src={previewImage.image_url}
                            alt="Gemstone certificate preview"
                            sx={{
                                width: '100%',
                                maxHeight: '78vh',
                                objectFit: 'contain',
                                display: 'block',
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </PageTransition>
    );
}