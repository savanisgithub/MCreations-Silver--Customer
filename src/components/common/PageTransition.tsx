import { Box } from '@mui/material';
import type { ReactNode } from 'react';


interface PageTransitionProps {
    children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
    return (
        <Box
            sx={{
                animation: 'pageFade 360ms ease',
                '@keyframes pageFade': {
                    from: {
                        opacity: 0,
                        transform: 'translateY(10px)',
                    },
                    to: {
                        opacity: 1,
                        transform: 'translateY(0)',
                    },
                },
            }}
        >
            {children}
        </Box>
    );
}