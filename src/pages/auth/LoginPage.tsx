import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Container,
    TextField,
    Typography,
} from '@mui/material';
import DiamondIcon from '@mui/icons-material/Diamond';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Navigate, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { LoginPayload } from '../../types/auth.types';
import { loginSchema } from '../../validation/login.schema';

const defaultValues: LoginPayload = {
    email: '',
    password: '',
};

export default function LoginPage() {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const { login, isAuthenticated } = useAuth();
    const [pageError, setPageError] = useState<string | null>(null);

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginPayload>({
        defaultValues,
        resolver: yupResolver(loginSchema),
    });

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    async function onSubmit(values: LoginPayload) {
        setPageError(null);

        try {
            await login(values);
            enqueueSnackbar('Logged in successfully', { variant: 'success' });
            navigate('/', { replace: true });
        } catch (error: any) {
            const message = error.message || 'Login failed';
            setPageError(message);
            enqueueSnackbar(message, { variant: 'error' });
        }
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'grid',
                placeItems: 'center',
                bgcolor: 'background.default',
                px: 2,
            }}
        >
            <Container maxWidth="sm">
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/')}
                    sx={{ mb: 2 }}
                >
                    Back to Store
                </Button>

                <Card
                    elevation={0}
                    sx={{
                        border: '1px solid #E5E7EB',
                        borderRadius: 4,
                    }}
                >
                    <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                            <DiamondIcon color="secondary" sx={{ fontSize: 46 }} />
                            <Typography variant="h5" sx={{ mt: 1 }}>
                                Welcome Back
                            </Typography>
                            <Typography color="text.secondary">
                                Sign in to manage your favourites.
                            </Typography>
                        </Box>

                        {pageError && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {pageError}
                            </Alert>
                        )}

                        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Email"
                                        type="email"
                                        fullWidth
                                        sx={{ mb: 2 }}
                                        error={Boolean(errors.email)}
                                        helperText={errors.email?.message}
                                    />
                                )}
                            />

                            <Controller
                                name="password"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Password"
                                        type="password"
                                        fullWidth
                                        sx={{ mb: 2 }}
                                        error={Boolean(errors.password)}
                                        helperText={errors.password?.message}
                                    />
                                )}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                size="large"
                                variant="contained"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <CircularProgress size={22} color="inherit" />
                                ) : (
                                    'Sign In'
                                )}
                            </Button>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ textAlign: 'center', mt: 2 }}
                            >
                                Don&apos;t have an account?{' '}
                                <Button size="small" onClick={() => navigate('/signup')}>
                                    Create one
                                </Button>
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}