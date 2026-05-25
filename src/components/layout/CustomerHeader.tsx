import { useState } from 'react';
import {
    AppBar,
    Badge,
    Box,
    Button,
    Container,
    Drawer,
    IconButton,
    List,
    ListItemButton,
    ListItemText,
    Toolbar,
    Typography,
} from '@mui/material';
import DiamondIcon from '@mui/icons-material/Diamond';
import MenuIcon from '@mui/icons-material/Menu';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Categories', path: '/categories' },
    { label: 'Jewellery', path: '/jewellery' },
    { label: 'Favourites', path: '/favourites' },
];

export default function CustomerHeader() {
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);

    async function handleLogout() {
        await logout();
        navigate('/', { replace: true });
    }

    function goTo(path: string) {
        navigate(path);
        setMobileOpen(false);
    }

    return (
        <>
            <AppBar
                position="sticky"
                elevation={0}
                color="inherit"
                sx={{
                    borderBottom: '1px solid #E5E7EB',
                    backdropFilter: 'blur(10px)',
                    bgcolor: 'rgba(255,255,255,0.88)',
                }}
            >
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{ minHeight: 72 }}>
                        <Box
                            onClick={() => navigate('/')}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                cursor: 'pointer',
                            }}
                        >
                            <DiamondIcon color="secondary" />
                            <Typography variant="h6" sx={{ fontWeight: 900 }}>
                                Silver Aura
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                gap: 1,
                                ml: 5,
                                flex: 1,
                            }}
                        >
                            {navItems.map((item) => (
                                <Button
                                    key={item.path}
                                    color="inherit"
                                    onClick={() => navigate(item.path)}
                                >
                                    {item.label}
                                </Button>
                            ))}
                        </Box>

                        <Box
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                alignItems: 'center',
                                gap: 1,
                                ml: 'auto',
                            }}
                        >
                            {isAuthenticated ? (
                                <>
                                    <IconButton onClick={() => navigate('/favourites')}>
                                        <Badge color="error" variant="dot">
                                            <FavoriteBorderIcon />
                                        </Badge>
                                    </IconButton>

                                    <Typography variant="body2" color="text.secondary">
                                        Hi, {user?.first_name}
                                    </Typography>

                                    <Button
                                        variant="outlined"
                                        startIcon={<LogoutIcon />}
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button onClick={() => navigate('/login')}>Login</Button>
                                    <Button
                                        variant="contained"
                                        onClick={() => navigate('/signup')}
                                    >
                                        Sign Up
                                    </Button>
                                </>
                            )}
                        </Box>

                        <IconButton
                            onClick={() => setMobileOpen(true)}
                            sx={{ display: { xs: 'inline-flex', md: 'none' }, ml: 'auto' }}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Toolbar>
                </Container>
            </AppBar>

            <Drawer
                anchor="right"
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
            >
                <Box sx={{ width: 280, p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <DiamondIcon color="secondary" />
                        <Typography variant="h6" sx={{ fontWeight: 900 }}>
                            Silver Aura
                        </Typography>
                    </Box>

                    <List>
                        {navItems.map((item) => (
                            <ListItemButton key={item.path} onClick={() => goTo(item.path)}>
                                <ListItemText primary={item.label} />
                            </ListItemButton>
                        ))}
                    </List>

                    <Box sx={{ mt: 2 }}>
                        {isAuthenticated ? (
                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<LogoutIcon />}
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        ) : (
                            <Box sx={{ display: 'grid', gap: 1 }}>
                                <Button fullWidth onClick={() => goTo('/login')}>
                                    Login
                                </Button>
                                <Button fullWidth variant="contained" onClick={() => goTo('/signup')}>
                                    Sign Up
                                </Button>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Drawer>
        </>
    );
}