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
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { authService } from '../../services/auth.service';
import type { ResetPasswordPayload } from '../../types/auth.types';
import { resetPasswordSchema } from '../../validation/forgot-password.schema';

const defaultValues: ResetPasswordPayload = {
    email: '',
    otp: '',
    new_password: '',
};

export default function ResetPasswordPage() {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [pageError, setPageError] = useState<string | null>(null);

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ResetPasswordPayload>({
        defaultValues,
        resolver: yupResolver(resetPasswordSchema),
    });

    async function onSubmit(values: ResetPasswordPayload) {
        setPageError(null);

        try {
            await authService.resetPassword(values);

            enqueueSnackbar('Password reset successfully. Please login.', {
                variant: 'success',
            });

            navigate('/login', { replace: true });
        } catch (error: any) {
            const message = error.message || 'Failed to reset password';
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
            <Container maxWidth="xs">
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/forgot-password')}
                    sx={{ mb: 2 }}
                >
                    Back
                </Button>

                <Card elevation={0} sx={{ border: '1px solid #E5E7EB', borderRadius: 4 }}>
                    <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                            <DiamondIcon color="secondary" sx={{ fontSize: 46 }} />

                            <Typography variant="h5" sx={{ mt: 1 }}>
                                Reset Password
                            </Typography>

                            <Typography color="text.secondary">
                                Enter your reset code and new password.
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
                                name="otp"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Reset Code"
                                        fullWidth
                                        sx={{ mb: 2 }}
                                        error={Boolean(errors.otp)}
                                        helperText={errors.otp?.message}
                                    />
                                )}
                            />

                            <Controller
                                name="new_password"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="New Password"
                                        type="password"
                                        fullWidth
                                        sx={{ mb: 2 }}
                                        error={Boolean(errors.new_password)}
                                        helperText={
                                            errors.new_password?.message || 'Minimum 6 characters'
                                        }
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
                                    'Reset Password'
                                )}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}