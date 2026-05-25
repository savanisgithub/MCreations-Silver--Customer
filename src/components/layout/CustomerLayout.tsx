import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import CustomerHeader from './CustomerHeader';
import CustomerFooter from './CustomerFooter';

export default function CustomerLayout() {
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <CustomerHeader />
            <Outlet />
            <CustomerFooter />
        </Box>
    );
}