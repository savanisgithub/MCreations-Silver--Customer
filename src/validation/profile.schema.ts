import * as yup from 'yup';
import type { UpdateProfilePayload } from '../types/auth.types';

export const profileSchema: yup.ObjectSchema<UpdateProfilePayload> = yup.object({
    first_name: yup
        .string()
        .trim()
        .required('First name is required')
        .max(100, 'First name must be less than 100 characters'),

    last_name: yup
        .string()
        .trim()
        .required('Last name is required')
        .max(100, 'Last name must be less than 100 characters'),
});