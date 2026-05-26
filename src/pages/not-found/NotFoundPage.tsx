import { Box, Button, Container, Typography } from '@mui/material';
import DiamondIcon from '@mui/icons-material/Diamond';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../../components/common/PageTransition';

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <PageTransition>
            <Container maxWidth="md" sx={{ py: { xs: 8, md: 14 } }}>
                <Box sx={{ textAlign: 'center' }}>
                    <DiamondIcon color="secondary" sx={{ fontSize: 84, mb: 2 }} />

                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: { xs: 54, md: 82 },
                            mb: 1,
                        }}
                    >
                        404
                    </Typography>

                    <Typography variant="h4" sx={{ mb: 2 }}>
                        Page not found
                    </Typography>

                    <Typography color="text.secondary" sx={{ mb: 4 }}>
                        The page you are looking for may have been moved or no longer exists.
                    </Typography>

                    <Button variant="contained" onClick={() => navigate('/')}>
                        Back to Home
                    </Button>
                </Box>
            </Container>
        </PageTransition>
    );
}