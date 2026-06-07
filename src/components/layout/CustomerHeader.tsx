import { useRef, useState } from 'react';
import {
    AppBar,
    Badge,
    Box,
    Button,
    Container,
    Drawer,
    Fade,
    IconButton,
    List,
    ListItemButton,
    ListItemText,
    Paper,
    Toolbar,
    Typography,
} from '@mui/material';
import Logo from '../../../public/logo.png';
import MenuIcon from '@mui/icons-material/Menu';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { categoryService } from '../../services/category.service';
import { favouriteService } from '../../services/favourite.service';

type MenuType = 'jewellery' | 'categories' | null;

const navItems: {
    label: string;
    path: string;
    menuType?: MenuType;
}[] = [
        {
            label: 'Home',
            path: '/',
        },
        {
            label: 'Jewellery',
            path: '/jewellery',
            menuType: 'jewellery',
        },
        {
            label: 'Categories',
            path: '/categories',
            menuType: 'categories',
        },
    ];

const materialLinks = [
    {
        label: 'Silver Collection',
        path: '/jewellery?material=SILVER',
        description: 'Everyday silver pieces with timeless styling.',
    },
    {
        label: 'Gold Collection',
        path: '/jewellery?material=GOLD',
        description: 'Warm-toned jewellery for refined occasions.',
    },
    {
        label: 'Platinum Collection',
        path: '/jewellery?material=PLATINUM',
        description: 'Premium pieces with a polished finish.',
    },
    {
        label: 'Latest Arrivals',
        path: '/jewellery',
        description: 'Recently added jewellery items.',
    },
];

export default function CustomerHeader() {
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState<MenuType>(null);

    const closeTimerRef = useRef<number | null>(null);

    const { data: categories = [] } = useQuery({
        queryKey: ['header-categories'],
        queryFn: categoryService.getCategories,
    });

    const { data: favourites = [] } = useQuery({
        queryKey: ['my-favourites'],
        queryFn: favouriteService.getMyFavourites,
        enabled: isAuthenticated,
    });

    const menuOpen = Boolean(activeMenu);

    function clearCloseTimer() {
        if (closeTimerRef.current) {
            window.clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }
    }

    function openMenu(menuType: MenuType) {
        clearCloseTimer();
        setActiveMenu(menuType);
    }

    function scheduleCloseMenu() {
        clearCloseTimer();

        closeTimerRef.current = window.setTimeout(() => {
            setActiveMenu(null);
        }, 160);
    }

    function closeMenuNow() {
        clearCloseTimer();
        setActiveMenu(null);
    }

    async function handleLogout() {
        await logout();
        navigate('/', { replace: true });
        closeMenuNow();
    }

    function goTo(path: string) {
        navigate(path);
        setMobileOpen(false);
        closeMenuNow();
    }

    return (
        <>
            <AppBar
                position="sticky"
                elevation={0}
                color="inherit"
                sx={{
                    borderBottom: '1px solid #E5E7EB',
                    backdropFilter: 'blur(14px)',
                    bgcolor: 'rgba(255,255,255,0.94)',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
            >
                <Box
                    onMouseEnter={clearCloseTimer}
                    onMouseLeave={scheduleCloseMenu}
                >
                    <Container maxWidth="xl">
                        <Toolbar disableGutters sx={{ minHeight: 76 }}>
                            <Box
                                onClick={() => goTo('/')}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    cursor: 'pointer',
                                    mr: 5,
                                }}
                            >
                                <Box
                                    component="img"
                                    src={Logo}
                                    alt="MCreations Logo"
                                    sx={{
                                        height: 50,
                                        width: 'auto',
                                    }}
                                />
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: 900,
                                        letterSpacing: '-0.02em',
                                    }}
                                >
                                    MCreations
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    display: { xs: 'none', md: 'flex' },
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 3,
                                    flex: 1,
                                }}
                            >
                                {navItems.map((item) => {
                                    const isActive = activeMenu === item.menuType;

                                    return (
                                        <Button
                                            key={item.path}
                                            color="inherit"
                                            endIcon={
                                                item.menuType ? <KeyboardArrowDownIcon sx={{ fontSize: 22 }} /> : undefined
                                            }
                                            onMouseEnter={() => {
                                                if (item.menuType) {
                                                    openMenu(item.menuType);
                                                } else {
                                                    closeMenuNow();
                                                }
                                            }}
                                            onClick={() => goTo(item.path)}
                                            sx={{
                                                px: 2,
                                                fontSize: '1.09rem',
                                                color: isActive ? 'secondary.main' : 'text.primary',
                                                '&:hover': {
                                                    bgcolor: 'transparent',
                                                    color: 'secondary.main',
                                                },
                                            }}
                                        >
                                            {item.label}
                                        </Button>
                                    );
                                })}
                            </Box>

                            <Box
                                sx={{
                                    display: { xs: 'none', md: 'flex' },
                                    alignItems: 'center',
                                    gap: 3.5,
                                }}
                            >
                                {isAuthenticated ? (
                                    <>
                                        <IconButton onClick={() => goTo('/favourites')} >
                                            <Badge color="error" badgeContent={favourites.length}>
                                                <FavoriteBorderIcon sx={{ fontSize: 30, color: 'text.primary', }} />
                                            </Badge>
                                        </IconButton>

                                        <Button
                                            color="inherit"
                                            sx={{
                                                color: 'text.primary',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                                fontSize: '1rem',
                                            }}
                                            onClick={() => goTo('/profile')}
                                        >
                                            <PersonOutlineIcon sx={{ fontSize: 30, flexShrink: 0 }} />
                                            {user?.first_name}
                                        </Button>

                                        <Button
                                            variant="outlined"
                                            sx={{
                                                color: 'text.primary',
                                                display: 'flex',
                                                alignItems: 'center',
                                                fontSize: '1rem',
                                            }}
                                            startIcon={<LogoutIcon sx={{ fontSize: 28, flexShrink: 0 }} />}
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button sx={{ fontSize: '1rem' }} onClick={() => goTo('/login')}>Login</Button>
                                        <Button variant="contained" onClick={() => goTo('/signup')}>
                                            Sign Up
                                        </Button>
                                    </>
                                )}
                            </Box>

                            <IconButton
                                onClick={() => setMobileOpen(true)}
                                size="large"
                                sx={{
                                    display: { xs: 'inline-flex', md: 'none' },
                                    ml: 'auto',
                                }}
                            >
                                <MenuIcon sx={{ fontSize: 32 }} />
                            </IconButton>
                        </Toolbar>
                    </Container>

                    <Fade in={menuOpen}>
                        <Paper
                            elevation={0}
                            onMouseEnter={clearCloseTimer}
                            onMouseLeave={scheduleCloseMenu}
                            sx={{
                                display: {
                                    xs: 'none',
                                    md: menuOpen ? 'block' : 'none',
                                },
                                position: 'absolute',
                                top: 65,
                                left: 0,
                                right: 0,
                                borderTop: '1px solid #F1F5F9',
                                borderBottom: '3px solid #E5E7EB',
                                borderRadius: 0,
                                bgcolor: 'rgba(255,255,255,0.98)',
                                backdropFilter: 'blur(16px)',
                                boxShadow: '0 24px 60px rgba(15,23,42,0.08)',
                            }}
                        >
                            <Container maxWidth="xl">
                                {activeMenu === 'jewellery' && (
                                    <Box
                                        sx={{
                                            display: 'grid',
                                            gridTemplateColumns: '0.9fr 1.1fr 1fr',
                                            gap: 5,
                                            py: 4,
                                        }}
                                    >
                                        <Box>
                                            <Typography variant="overline" color="text.secondary">
                                                Shop Jewellery
                                            </Typography>

                                            <Typography variant="h5" sx={{ mt: 1, mb: 1 }}>
                                                Find your next signature piece
                                            </Typography>

                                            <Typography color="text.secondary" sx={{ mb: 2 }}>
                                                Browse all jewellery or refine by material and style.
                                            </Typography>

                                            <Button
                                                variant="contained"
                                                endIcon={<ArrowForwardIcon sx={{ fontSize: 24 }} />}
                                                onClick={() => goTo('/jewellery')}
                                            >
                                                View All Jewellery
                                            </Button>
                                        </Box>

                                        <Box>
                                            <Typography variant="overline" color="text.secondary">
                                                By Material
                                            </Typography>

                                            <Box sx={{ display: 'grid', gap: 1.25, mt: 1.5 }}>
                                                {materialLinks.map((link) => (
                                                    <Box
                                                        key={link.path}
                                                        onClick={() => goTo(link.path)}
                                                        sx={{
                                                            cursor: 'pointer',
                                                            p: 1.25,
                                                            borderRadius: 2,
                                                            transition: '180ms ease',
                                                            '&:hover': {
                                                                bgcolor: '#F8FAFC',
                                                            },
                                                        }}
                                                    >
                                                        <Typography sx={{ fontWeight: 800 }}>
                                                            {link.label}
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                        >
                                                            {link.description}
                                                        </Typography>
                                                    </Box>
                                                ))}
                                            </Box>
                                        </Box>

                                        <Box>
                                            <Typography variant="overline" color="text.secondary">
                                                Quick Links
                                            </Typography>

                                            <Box sx={{ display: 'grid', gap: 0.5, mt: 1.5 }}>
                                                <Button
                                                    color="inherit"
                                                    onClick={() => goTo('/favourites')}
                                                    sx={{
                                                        justifyContent: 'flex-start',
                                                        px: 0,
                                                        '&:hover': {
                                                            bgcolor: 'transparent',
                                                            color: 'secondary.main',
                                                        },
                                                    }}
                                                >
                                                    Saved Favourites
                                                </Button>

                                                <Button
                                                    color="inherit"
                                                    onClick={() => goTo('/categories')}
                                                    sx={{
                                                        justifyContent: 'flex-start',
                                                        px: 0,
                                                        '&:hover': {
                                                            bgcolor: 'transparent',
                                                            color: 'secondary.main',
                                                        },
                                                    }}
                                                >
                                                    Browse Categories
                                                </Button>

                                                <Button
                                                    color="inherit"
                                                    onClick={() => goTo('/jewellery')}
                                                    sx={{
                                                        justifyContent: 'flex-start',
                                                        px: 0,
                                                        '&:hover': {
                                                            bgcolor: 'transparent',
                                                            color: 'secondary.main',
                                                        },
                                                    }}
                                                >
                                                    Latest Items
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Box>
                                )}

                                {activeMenu === 'categories' && (
                                    <Box
                                        sx={{
                                            display: 'grid',
                                            gridTemplateColumns: '0.85fr 1.6fr',
                                            gap: 5,
                                            py: 4,
                                        }}
                                    >
                                        <Box>
                                            <Typography variant="h5" sx={{ mt: 1, mb: 1 }}>
                                                Shop by category
                                            </Typography>

                                            <Typography color="text.secondary" sx={{ mb: 2 }}>
                                                Explore jewellery grouped by design type and occasion.
                                            </Typography>

                                            <Button
                                                variant="contained"
                                                endIcon={<ArrowForwardIcon sx={{ fontSize: 24 }} />}
                                                onClick={() => goTo('/categories')}
                                            >
                                                View All Categories
                                            </Button>
                                        </Box>

                                        <Box
                                            sx={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(3, 1fr)',
                                                gap: 1,
                                            }}
                                        >
                                            {categories.slice(0, 9).map((category) => (
                                                <Box
                                                    key={category.id}
                                                    onClick={() => goTo(`/categories/${category.slug}`)}
                                                    sx={{
                                                        cursor: 'pointer',
                                                        p: 1.5,
                                                        borderRadius: 3,
                                                        border: '1px solid transparent',
                                                        transition: '180ms ease',
                                                        '&:hover': {
                                                            borderColor: '#E5E7EB',
                                                            bgcolor: '#F8FAFC',
                                                        },
                                                    }}
                                                >
                                                    <Typography sx={{ fontWeight: 800 }}>
                                                        {category.name}
                                                    </Typography>

                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{
                                                            mt: 0.5,
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                        }}
                                                    >
                                                        {category.description || 'Explore collection'}
                                                    </Typography>
                                                </Box>
                                            ))}
                                        </Box>
                                    </Box>
                                )}
                            </Container>
                        </Paper>
                    </Fade>
                </Box>
            </AppBar>

            <Drawer
                anchor="right"
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
            >
                <Box sx={{ width: 310, p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Box
                            component="img"
                            src={Logo}
                            alt="MCreations Logo"
                            sx={{
                                height: 50,
                                width: 'auto',
                            }}
                        />
                        <Typography variant="h6" sx={{ fontWeight: 900 }}>
                            MCreations
                        </Typography>
                    </Box>

                    <List>
                        <ListItemButton onClick={() => goTo('/')}>
                            <ListItemText primary="Home" />
                        </ListItemButton>

                        <ListItemButton onClick={() => goTo('/jewellery')}>
                            <ListItemText primary="All Jewellery" />
                        </ListItemButton>

                        <ListItemButton onClick={() => goTo('/categories')}>
                            <ListItemText primary="All Categories" />
                        </ListItemButton>

                        <ListItemButton onClick={() => goTo('/favourites')}>
                            <ListItemText primary="Favourites" />
                        </ListItemButton>

                        {isAuthenticated && (
                            <ListItemButton onClick={() => goTo('/profile')}>
                                <ListItemText primary="My Profile" />
                            </ListItemButton>
                        )}
                    </List>

                    <Typography
                        variant="overline"
                        color="text.secondary"
                        sx={{ display: 'block', mt: 2, mb: 1 }}
                    >
                        Categories
                    </Typography>

                    <List>
                        {categories.slice(0, 6).map((category) => (
                            <ListItemButton
                                key={category.id}
                                onClick={() => goTo(`/categories/${category.slug}`)}
                                sx={{ pl: 2 }}
                            >
                                <ListItemText primary={category.name} />
                            </ListItemButton>
                        ))}
                    </List>

                    <Box sx={{ mt: 2 }}>
                        {isAuthenticated ? (
                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<LogoutIcon sx={{ fontSize: 28 }} />}
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        ) : (
                            <Box sx={{ display: 'grid', gap: 1 }}>
                                <Button fullWidth onClick={() => goTo('/login')}>
                                    Login
                                </Button>

                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={() => goTo('/signup')}
                                >
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