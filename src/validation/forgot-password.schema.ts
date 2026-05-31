import * as yup from 'yup';
import type { ForgotPasswordPayload, ResetPasswordPayload } from '../types/auth.types';

export const forgotPasswordSchema: yup.ObjectSchema<ForgotPasswordPayload> =
    yup.object({
        email: yup
            .string()
            .trim()
            .email('Please enter a valid email address')
            .required('Email is required'),
    });

export const resetPasswordSchema: yup.ObjectSchema<ResetPasswordPayload> =
    yup.object({
        email: yup
            .string()
            .trim()
            .email('Please enter a valid email address')
            .required('Email is required'),

        otp: yup
            .string()
            .trim()
            .required('Reset code is required')
            .min(6, 'Reset code must be 6 digits')
            .max(6, 'Reset code must be 6 digits'),

        new_password: yup
            .string()
            .required('New password is required')
            .min(6, 'Password must be at least 6 characters'),
    });