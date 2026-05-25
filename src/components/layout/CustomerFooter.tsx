import { Box, Container, Divider, Typography } from '@mui/material';
import DiamondIcon from '@mui/icons-material/Diamond';

export default function CustomerFooter() {
    return (
        <Box sx={{ mt: 8, bgcolor: '#111827', color: 'white' }}>
            <Container maxWidth="xl" sx={{ py: 5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <DiamondIcon color="secondary" />
                    <Typography variant="h6" sx={{ fontWeight: 900 }}>
                        Silver Aura
                    </Typography>
                </Box>

                <Typography sx={{ maxWidth: 560, color: 'rgba(255,255,255,0.72)' }}>
                    Elegant silver jewellery crafted for everyday beauty and timeless style.
                </Typography>

                <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.14)' }} />

                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                    © {new Date().getFullYear()} Silver Aura. All rights reserved.
                </Typography>
            </Container>
        </Box>
    );
}