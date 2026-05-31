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
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import PageTransition from '../../components/common/PageTransition';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/auth.service';
import type { UpdateProfilePayload } from '../../types/auth.types';
import { profileSchema } from '../../validation/profile.schema';


const defaultValues: UpdateProfilePayload = {
    first_name: '',
    last_name: '',
};

export default function ProfilePage() {
    const { user, updateLocalUser } = useAuth();
    const { enqueueSnackbar } = useSnackbar();

    const [pageError, setPageError] = useState<string | null>(null);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<UpdateProfilePayload>({
        defaultValues,
        resolver: yupResolver(profileSchema),
    });

    useEffect(() => {
        if (!user) return;

        reset({
            first_name: user.first_name,
            last_name: user.last_name,
        });
    }, [user, reset]);

    async function onSubmit(values: UpdateProfilePayload) {
        setPageError(null);

        try {
            const updatedUser = await authService.updateProfile(values);
            updateLocalUser(updatedUser);

            enqueueSnackbar('Profile updated successfully', {
                variant: 'success',
            });
        } catch (error: any) {
            const message = error.message || 'Failed to update profile';
            setPageError(message);
            enqueueSnackbar(message, { variant: 'error' });
        }
    }

    return (
        <PageTransition>
            <Container maxWidth="md" sx={{ py: { xs: 4, md: 7 } }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <PersonOutlineIcon color="secondary" sx={{ fontSize: 56 }} />

                    <Typography
                        variant="h2"
                        sx={{ fontSize: { xs: 38, md: 54 }, mt: 1 }}
                    >
                        My Profile
                    </Typography>

                    <Typography color="text.secondary">
                        Manage your customer account information.
                    </Typography>
                </Box>

                {pageError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {pageError}
                    </Alert>
                )}

                <Card elevation={0} sx={{ border: '1px solid #E5E7EB', borderRadius: 5 }}>
                    <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                                    gap: 2,
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

                                <TextField
                                    label="Email"
                                    value={user?.email || ''}
                                    disabled
                                    fullWidth
                                    sx={{ gridColumn: { xs: 'auto', md: '1 / -1' } }}
                                    helperText="Email cannot be changed."
                                />
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <CircularProgress size={22} color="inherit" />
                                    ) : (
                                        'Save Changes'
                                    )}
                                </Button>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </PageTransition>
    );
}