import { Alert } from '@mui/material';

interface PageErrorProps {
    message?: string;
}

export default function PageError({
    message = 'Something went wrong',
}: PageErrorProps) {
    return <Alert severity="error">{message}</Alert>;
}