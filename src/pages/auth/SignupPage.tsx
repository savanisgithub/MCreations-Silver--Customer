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
import type { SignupPayload } from '../../types/auth.types';
import { signupSchema } from '../../validation/signup.schema';

const defaultValues: SignupPayload = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
};

export default function SignupPage() {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const { signup, isAuthenticated } = useAuth();
    const [pageError, setPageError] = useState<string | null>(null);

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignupPayload>({
        defaultValues,
        resolver: yupResolver(signupSchema),
    });

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    async function onSubmit(values: SignupPayload) {
        setPageError(null);

        try {
            await signup(values);
            enqueueSnackbar('Account created successfully', { variant: 'success' });
            navigate('/', { replace: true });
        } catch (error: any) {
            const message = error.message || 'Signup failed';
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
                                Create Account
                            </Typography>
                            <Typography color="text.secondary">
                                Save your favourite jewellery pieces.
                            </Typography>
                        </Box>

                        {pageError && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {pageError}
                            </Alert>
                        )}

                        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                                    gap: 2,
                                    mb: 2,
                                }}
                            >
                                <Controller
                                    name="first_name"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="First Name"
                                            fullWidth
                                            error={Boolean(errors.first_name)}
                                            helperText={errors.first_name?.message}
                                        />
                                    )}
                                />

                                <Controller
                                    name="last_name"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Last Name"
                                            fullWidth
                                            error={Boolean(errors.last_name)}
                                            helperText={errors.last_name?.message}
                                        />
                                    )}
                                />
                            </Box>

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
                                        helperText={errors.password?.message || 'Minimum 6 characters'}
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
                                    'Create Account'
                                )}
                            </Button>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ textAlign: 'center', mt: 2 }}
                            >
                                Already have an account?{' '}
                                <Button size="small" onClick={() => navigate('/login')}>
                                    Sign in
                                </Button>
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}