import {
    Box,
    Card,
    CardContent,
    Chip,
    Typography,
} from '@mui/material';
import DiamondIcon from '@mui/icons-material/Diamond';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { useNavigate } from 'react-router-dom';
import {
    getCertificateImages,
    getPrimaryGemstoneImage,
} from '../../utils/gemstone-image';
import type { Gemstone } from '../../types/gemstone.type';

interface GemstoneCardProps {
    gemstone: Gemstone;
}

export default function GemstoneCard({ gemstone }: GemstoneCardProps) {
    const navigate = useNavigate();

    const primaryImage = getPrimaryGemstoneImage(gemstone.images || []);
    const certificateCount = getCertificateImages(gemstone.images || []).length;

    function handleOpenDetails() {
        navigate(`/gemstones/${gemstone.slug}`);
    }

    return (
        <Card
            elevation={0}
            onClick={handleOpenDetails}
            sx={{
                height: '100%',
                border: '1px solid #E5E7EB',
                borderRadius: 0,
                overflow: 'hidden',
                cursor: 'pointer',
                bgcolor: 'background.paper',
                transition:
                    'transform 260ms ease, box-shadow 260ms ease, border-color 260ms ease',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    borderColor: 'secondary.main',
                    boxShadow: '0 24px 48px rgba(15,23,42,0.10)',
                    '& .gemstone-card-image': {
                        transform: 'scale(1.045)',
                    },
                },
            }}
        >
            <Box
                sx={{
                    height: { xs: 250, sm: 280, md: 315 },
                    bgcolor: '#F3F4F6',
                    overflow: 'hidden',
                    position: 'relative',
                    display: 'grid',
                    placeItems: 'center',
                }}
            >
                {primaryImage ? (
                    <Box
                        className="gemstone-card-image"
                        component="img"
                        src={primaryImage}
                        alt={gemstone.name}
                        loading="lazy"
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 420ms ease',
                        }}
                    />
                ) : (
                    <DiamondIcon color="secondary" sx={{ fontSize: 86 }} />
                )}

                {certificateCount > 0 && (
                    <Chip
                        icon={<WorkspacePremiumIcon />}
                        label={`${certificateCount} certificate${
                            certificateCount === 1 ? '' : 's'
                        }`}
                        size="small"
                        sx={{
                            position: 'absolute',
                            left: 12,
                            bottom: 12,
                            bgcolor: 'rgba(255,255,255,0.92)',
                            backdropFilter: 'blur(10px)',
                            fontWeight: 800,
                            border: '1px solid rgba(226,232,240,0.85)',
                        }}
                    />
                )}
            </Box>

            <CardContent sx={{ p: 2.5 }}>
                <Typography
                    variant="overline"
                    sx={{
                        color: 'secondary.main',
                        letterSpacing: '0.14em',
                        fontWeight: 900,
                    }}
                >
                    {gemstone.category?.name || 'Gemstone'}
                </Typography>

                <Typography
                    variant="h6"
                    sx={{
                        mt: 0.5,
                        fontWeight: 900,
                        lineHeight: 1.2,
                        color: '#111827',
                    }}
                >
                    {gemstone.name}
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 0.75,
                        mt: 1.4,
                    }}
                >
                    {gemstone.carat !== null && gemstone.carat !== undefined && (
                        <Chip
                            label={`${gemstone.carat} ct`}
                            size="small"
                            variant="outlined"
                        />
                    )}

                    {gemstone.weight !== null &&
                        gemstone.weight !== undefined && (
                            <Chip
                                label={`${gemstone.weight} g`}
                                size="small"
                                variant="outlined"
                            />
                        )}

                    {gemstone.size && (
                        <Chip
                            label={gemstone.size}
                            size="small"
                            variant="outlined"
                        />
                    )}
                </Box>

                <Typography
                    color="text.secondary"
                    sx={{
                        mt: 1.5,
                        minHeight: 44,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.55,
                    }}
                >
                    {gemstone.description ||
                        'View gemstone details, stone images, measurements, and certificates.'}
                </Typography>
            </CardContent>
        </Card>
    );
}