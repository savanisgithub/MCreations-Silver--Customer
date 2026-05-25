import * as yup from 'yup';
import type { SignupPayload } from '../types/auth.types';


export const signupSchema: yup.ObjectSchema<SignupPayload> = yup.object({
    first_name: yup
        .string()
        .trim()
        .required('First name is required'),

    last_name: yup
        .string()
        .trim()
        .required('Last name is required'),

    email: yup
        .string()
        .trim()
        .email('Please enter a valid email address')
        .required('Email is required'),

    password: yup
        .string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters'),
});