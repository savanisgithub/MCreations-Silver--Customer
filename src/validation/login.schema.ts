import * as yup from 'yup';
import type { LoginPayload } from '../types/auth.types';

export const loginSchema: yup.ObjectSchema<LoginPayload> = yup.object({
    email: yup
        .string()
        .trim()
        .email('Please enter a valid email address')
        .required('Email is required'),

    password: yup
        .string()
        .required('Password is required'),
});