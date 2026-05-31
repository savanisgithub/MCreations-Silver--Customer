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
import type { ForgotPasswordPayload } from '../../types/auth.types';
import { forgotPasswordSchema } from '../../validation/forgot-password.schema';

const defaultValues: ForgotPasswordPayload = {
    email: '',
};

export default function ForgotPasswordPage() {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [pageMessage, setPageMessage] = useState<string | null>(null);
    const [devOtp, setDevOtp] = useState<string | null>(null);

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ForgotPasswordPayload>({
        defaultValues,
        resolver: yupResolver(forgotPasswordSchema),
    });

    async function onSubmit(values: ForgotPasswordPayload) {
        setPageMessage(null);
        setDevOtp(null);

        try {
            const result = await authService.forgotPassword(values);

            setPageMessage(
                'If this email exists, a reset code has been generated. Please continue to reset your password.',
            );

            if (result.otp) {
                setDevOtp(result.otp);
            }

            enqueueSnackbar('Reset request processed successfully', {
                variant: 'success',
            });
        } catch (error: any) {
            const message = error.message || 'Failed to request password reset';
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
                    onClick={() => navigate('/login')}
                    sx={{ mb: 2 }}
                >
                    Back to Login
                </Button>

                <Card elevation={0} sx={{ border: '1px solid #E5E7EB', borderRadius: 4 }}>
                    <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                            <DiamondIcon color="secondary" sx={{ fontSize: 46 }} />

                            <Typography variant="h5" sx={{ mt: 1 }}>
                                Forgot Password
                            </Typography>

                            <Typography color="text.secondary">
                                Enter your email to request a reset code.
                            </Typography>
                        </Box>

                        {pageMessage && (
                            <Alert severity="success" sx={{ mb: 2 }}>
                                {pageMessage}
                            </Alert>
                        )}

                        {devOtp && (
                            <Alert severity="info" sx={{ mb: 2 }}>
                                Development OTP: <strong>{devOtp}</strong>
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
                                    'Request Reset Code'
                                )}
                            </Button>

                            <Button
                                fullWidth
                                sx={{ mt: 1 }}
                                onClick={() => navigate('/reset-password')}
                            >
                                I already have a reset code
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}