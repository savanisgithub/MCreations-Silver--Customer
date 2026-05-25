import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import CustomerHeader from './CustomerHeader';
import CustomerFooter from './CustomerFooter';
import ScrollToTop from '../common/ScrollToTop';

export default function CustomerLayout() {
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <ScrollToTop />
            <CustomerHeader />
            <Outlet />
            <CustomerFooter />
        </Box>
    );
}