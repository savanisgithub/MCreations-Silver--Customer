import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1F2933',
        },
        secondary: {
            main: '#BFA46F',
        },
        background: {
            default: '#FAFAF8',
            paper: '#FFFFFF',
        },
    },
    shape: {
        borderRadius: 16,
    },
    typography: {
        fontFamily: ['Inter', 'Roboto', 'Arial', 'sans-serif'].join(','),
        h1: {
            fontWeight: 800,
            letterSpacing: '-0.04em',
        },
        h2: {
            fontWeight: 800,
            letterSpacing: '-0.035em',
        },
        h3: {
            fontWeight: 800,
        },
        h4: {
            fontWeight: 700,
        },
        h5: {
            fontWeight: 700,
        },
        button: {
            textTransform: 'none',
            fontWeight: 700,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 999,
                    boxShadow: 'none',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
    },
});