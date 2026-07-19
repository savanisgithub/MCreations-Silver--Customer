import { useRef, useState, useMemo } from 'react';
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
import DiamondIcon from '@mui/icons-material/Diamond';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { categoryService } from '../../services/category.service';
import { favouriteService } from '../../services/favourite.service';
import { gemstoneCategoryService } from '../../services/gemstone-category.service';
import { gemstoneService } from '../../services/gemstone.service';
import type { Gemstone } from '../../types/gemstone.type';

type MenuType = 'jewellery' | 'categories' | 'gemstones' | null;

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
            label: 'Gemstones',
            path: '/gemstones',
            menuType: 'gemstones',
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

function getActiveHeaderPath(pathname: string) {
    if (pathname === '/') {
        return '/';
    }

    if (pathname.startsWith('/jewellery')) {
        return '/jewellery';
    }

    if (pathname.startsWith('/categories')) {
        return '/categories';
    }

    if (pathname.startsWith('/gemstones') || pathname.startsWith('/gemstone-categories')) {
        return '/gemstones';
    }

    if (pathname.startsWith('/favourites')) {
        return '/favourites';
    }

    if (pathname.startsWith('/profile')) {
        return '/profile';
    }

    return '';
}

export default function CustomerHeader() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, user, logout } = useAuth();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState<MenuType>(null);
    const activeHeaderPath = getActiveHeaderPath(location.pathname);

    const closeTimerRef = useRef<number | null>(null);

    const { data: categories = [] } = useQuery({
        queryKey: ['header-categories'],
        queryFn: categoryService.getCategories,
    });

    const { data: gemstoneCategories = [] } = useQuery({
        queryKey: ['header-gemstone-category-tree'],
        queryFn: gemstoneCategoryService.getPublicTree,
    });

    const { data: headerGemstones } = useQuery({
        queryKey: ['header-gemstones-preview'],
        queryFn: () =>
            gemstoneService.getGemstones({
                page: 1,
                limit: 36,
            }),
    });

    const gemstonesByCategoryId = useMemo(() => {
        const grouped = new Map<number, Gemstone[]>();
        const gemstones = headerGemstones?.data || [];

        gemstones.forEach((gemstone) => {
            const current = grouped.get(gemstone.gemstone_category_id) || [];

            grouped.set(gemstone.gemstone_category_id, [
                ...current,
                gemstone,
            ]);
        });

        return grouped;
    }, [headerGemstones]);

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
                                    const isActive = activeHeaderPath === item.path;
                                    const isMenuActive = activeMenu === item.menuType;

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
                                                position: 'relative',
                                                px: 2,
                                                fontSize: '1.09rem',
                                                fontWeight: isActive ? 900 : 700,
                                                color: isActive || isMenuActive ? 'secondary.main' : 'text.primary',
                                                '&:hover': {
                                                    color: 'secondary.main',
                                                },
                                                '&::after': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    left: 18,
                                                    right: 18,
                                                    bottom: 5,
                                                    height: 3,
                                                    borderRadius: 999,
                                                    bgcolor: 'secondary.main',
                                                    opacity: isActive ? 1 : 0,
                                                    transition: 'opacity 160ms ease',
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
                                        <IconButton
                                            onClick={() => goTo('/favourites')}
                                            sx={{
                                                color: activeHeaderPath === '/favourites' ? 'secondary.main' : 'text.primary',
                                                bgcolor:
                                                    activeHeaderPath === '/favourites'
                                                        ? 'rgba(191, 164, 111, 0.12)'
                                                        : 'transparent',
                                                '&:hover': {
                                                    bgcolor: 'rgba(191, 164, 111, 0.16)',
                                                },
                                            }}
                                        >
                                            <Badge color="error" badgeContent={favourites.length}>
                                                <FavoriteBorderIcon sx={{ fontSize: 30, color: 'inherit' }} />
                                            </Badge>
                                        </IconButton>

                                        <Button
                                            color="inherit"
                                            sx={{
                                                color: activeHeaderPath === '/profile' ? 'secondary.main' : 'text.primary',
                                                bgcolor:
                                                    activeHeaderPath === '/profile'
                                                        ? 'rgba(191, 164, 111, 0.12)'
                                                        : 'transparent',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                                fontSize: '1rem',
                                                '&:hover': {
                                                    bgcolor: 'rgba(191, 164, 111, 0.16)',
                                                    color: 'secondary.main',
                                                },
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

                                {activeMenu === 'gemstones' && (
                                    <Box
                                        sx={{
                                            display: 'grid',
                                            gridTemplateColumns: '400px 1fr',
                                            gap: 4,
                                            py: 4,
                                        }}
                                    >
                                        <Box>
                                            <Typography
                                                variant="overline"
                                                sx={{
                                                    color: 'secondary.main',
                                                    letterSpacing: '0.18em',
                                                    fontWeight: 900,
                                                }}
                                            >
                                                Gemstone Collection
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    mt: 1,
                                                    fontFamily: 'Georgia, Times New Roman, serif',
                                                    fontSize: 32,
                                                    lineHeight: 1.12,
                                                    fontWeight: 700,
                                                    color: '#111827',
                                                }}
                                            >
                                                Browse stones by family
                                            </Typography>

                                            <Typography
                                                color="text.secondary"
                                                sx={{
                                                    mt: 1.5,
                                                    mb: 2.5,
                                                    lineHeight: 1.7,
                                                    fontSize: 15,
                                                }}
                                            >
                                                Explore main gemstone categories, subcategories, individual
                                                stones, and available certificate previews.
                                            </Typography>

                                            <Button
                                                variant="contained"
                                                endIcon={<ArrowForwardIcon />}
                                                onClick={() => goTo('/gemstones')}
                                                sx={{
                                                    px: 2.5,
                                                    py: 1.1,
                                                    fontWeight: 800,
                                                }}
                                            >
                                                View All Gemstones
                                            </Button>

                                            <Button
                                                color="inherit"
                                                onClick={() => goTo('/gemstone-categories')}
                                                sx={{
                                                    display: 'block',
                                                    mt: 1.5,
                                                    px: 0,
                                                    fontWeight: 800,
                                                    color: 'text.primary',
                                                    '&:hover': {
                                                        bgcolor: 'transparent',
                                                        color: 'secondary.main',
                                                    },
                                                }}
                                            >
                                                Browse All Categories
                                            </Button>
                                        </Box>

                                        <Box
                                            sx={{
                                                maxHeight: 430,
                                                overflowY: 'auto',
                                                p: 1,
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(3, minmax(250px, 1fr))',
                                                gap: 2,
                                                alignItems: 'start',
                                                '&::-webkit-scrollbar': {
                                                    width: 6,
                                                },
                                                '&::-webkit-scrollbar-thumb': {
                                                    bgcolor: '#CBD5E1',
                                                    borderRadius: 999,
                                                },
                                            }}
                                        >
                                            {gemstoneCategories.map((mainCategory) => {
                                                const mainCategoryStones =
                                                    gemstonesByCategoryId.get(mainCategory.id) || [];

                                                const subcategories = mainCategory.children || [];

                                                return (
                                                    <Box
                                                        key={mainCategory.id}
                                                        sx={{
                                                            border: '1px solid #E5E7EB',
                                                            p: 2,
                                                            bgcolor: '#FFFFFF',
                                                            transition:
                                                                'border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease',
                                                            '&:hover': {
                                                                borderColor: '#CBD5E1',
                                                                boxShadow: '0 18px 40px rgba(15,23,42,0.08)',
                                                                transform: 'translateY(-2px)',
                                                            },
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'space-between',
                                                                gap: 2,
                                                                mb: subcategories.length > 0 ? 1.5 : 0,
                                                            }}
                                                        >
                                                            <Box
                                                                onClick={() =>
                                                                    goTo(`/gemstones?category=${mainCategory.id}`)
                                                                }
                                                                sx={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: 1.25,
                                                                    cursor: 'pointer',
                                                                    minWidth: 0,
                                                                }}
                                                            >
                                                                <Box
                                                                    sx={{
                                                                        width: 42,
                                                                        height: 42,
                                                                        borderRadius: '50%',
                                                                        bgcolor: '#F8FAFC',
                                                                        border: '1px solid #E5E7EB',
                                                                        display: 'grid',
                                                                        placeItems: 'center',
                                                                        flexShrink: 0,
                                                                    }}
                                                                >
                                                                    {mainCategory.image_url ? (
                                                                        <Box
                                                                            component="img"
                                                                            src={mainCategory.image_url}
                                                                            alt={mainCategory.name}
                                                                            sx={{
                                                                                width: '100%',
                                                                                height: '100%',
                                                                                objectFit: 'cover',
                                                                                borderRadius: '50%',
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        <DiamondIcon
                                                                            sx={{
                                                                                color: 'secondary.main',
                                                                                fontSize: 22,
                                                                            }}
                                                                        />
                                                                    )}
                                                                </Box>

                                                                <Box sx={{ minWidth: 0 }}>
                                                                    <Typography
                                                                        sx={{
                                                                            fontSize: 19,
                                                                            lineHeight: 1.15,
                                                                            fontWeight: 900,
                                                                            color: '#111827',
                                                                        }}
                                                                    >
                                                                        {mainCategory.name}
                                                                    </Typography>

                                                                    {/* {mainCategory.description && (
                                                                        <Typography
                                                                            sx={{
                                                                                mt: 0.35,
                                                                                color: 'text.secondary',
                                                                                fontSize: 13,
                                                                                lineHeight: 1.45,
                                                                                display: '-webkit-box',
                                                                                WebkitLineClamp: 1,
                                                                                WebkitBoxOrient: 'vertical',
                                                                                overflow: 'hidden',
                                                                            }}
                                                                        >
                                                                            {mainCategory.description}
                                                                        </Typography>
                                                                    )} */}
                                                                </Box>
                                                            </Box>

                                                            <Button
                                                                size="small"
                                                                onClick={() =>
                                                                    goTo(`/gemstones?category=${mainCategory.id}`)
                                                                }
                                                                sx={{
                                                                    fontWeight: 800,
                                                                    whiteSpace: 'nowrap',
                                                                }}
                                                            >
                                                                View
                                                            </Button>
                                                        </Box>

                                                        {subcategories.length > 0 && (
                                                            <Box
                                                                sx={{
                                                                    display: 'grid',
                                                                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                                                                    gap: 1.25,
                                                                }}
                                                            >
                                                                {subcategories.map((subcategory) => {
                                                                    const stones =
                                                                        gemstonesByCategoryId.get(subcategory.id) ||
                                                                        [];

                                                                    return (
                                                                        <Box
                                                                            key={subcategory.id}
                                                                            sx={{
                                                                                borderRadius: 1,
                                                                                bgcolor: '#F8FAFC',
                                                                                border: '1px solid #EEF2F7',
                                                                                p: 1.35,
                                                                            }}
                                                                        >
                                                                            <Typography
                                                                                onClick={() =>
                                                                                    goTo(
                                                                                        `/gemstones?category=${subcategory.id}`,
                                                                                    )
                                                                                }
                                                                                sx={{
                                                                                    cursor: 'pointer',
                                                                                    fontSize: 16,
                                                                                    lineHeight: 1.25,
                                                                                    fontWeight: 900,
                                                                                    color: '#111827',
                                                                                    '&:hover': {
                                                                                        color: 'secondary.main',
                                                                                    },
                                                                                }}
                                                                            >
                                                                                {subcategory.name}
                                                                            </Typography>

                                                                            {/* {subcategory.description && (
                                                                                <Typography
                                                                                    sx={{
                                                                                        mt: 0.4,
                                                                                        color: 'text.secondary',
                                                                                        fontSize: 12.5,
                                                                                        lineHeight: 1.45,
                                                                                        display: '-webkit-box',
                                                                                        WebkitLineClamp: 1,
                                                                                        WebkitBoxOrient: 'vertical',
                                                                                        overflow: 'hidden',
                                                                                    }}
                                                                                >
                                                                                    {subcategory.description}
                                                                                </Typography>
                                                                            )} */}

                                                                            {/* <Box
                                                                                sx={{
                                                                                    display: 'grid',
                                                                                    gap: 0.35,
                                                                                    mt: 1,
                                                                                }}
                                                                            >
                                                                                {stones.slice(0, 4).map((stone) => (
                                                                                    <Typography
                                                                                        key={stone.id}
                                                                                        onClick={() =>
                                                                                            goTo(
                                                                                                `/gemstones/${stone.slug}`,
                                                                                            )
                                                                                        }
                                                                                        sx={{
                                                                                            cursor: 'pointer',
                                                                                            color: 'text.secondary',
                                                                                            fontSize: 14,
                                                                                            lineHeight: 1.45,
                                                                                            fontWeight: 600,
                                                                                            display: 'flex',
                                                                                            alignItems: 'center',
                                                                                            gap: 0.75,
                                                                                            '&:before': {
                                                                                                content: '""',
                                                                                                width: 4,
                                                                                                height: 4,
                                                                                                borderRadius: '50%',
                                                                                                bgcolor: 'secondary.main',
                                                                                                flexShrink: 0,
                                                                                            },
                                                                                            '&:hover': {
                                                                                                color: 'secondary.main',
                                                                                            },
                                                                                        }}
                                                                                    >
                                                                                        {stone.name}
                                                                                    </Typography>
                                                                                ))}

                                                                                {stones.length === 0 && (
                                                                                    <Typography
                                                                                        onClick={() =>
                                                                                            goTo(
                                                                                                `/gemstones?category=${subcategory.id}`,
                                                                                            )
                                                                                        }
                                                                                        sx={{
                                                                                            cursor: 'pointer',
                                                                                            color: 'text.secondary',
                                                                                            fontSize: 13,
                                                                                            fontWeight: 700,
                                                                                            '&:hover': {
                                                                                                color: 'secondary.main',
                                                                                            },
                                                                                        }}
                                                                                    >
                                                                                        View stones
                                                                                    </Typography>
                                                                                )}
                                                                            </Box> */}
                                                                        </Box>
                                                                    );
                                                                })}
                                                            </Box>
                                                        )}

                                                        {subcategories.length === 0 && mainCategoryStones.length > 0 && (
                                                            <Box
                                                                sx={{
                                                                    display: 'flex',
                                                                    flexWrap: 'wrap',
                                                                    gap: 0.75,
                                                                    mt: 1.5,
                                                                }}
                                                            >
                                                                {mainCategoryStones.slice(0, 6).map((stone) => (
                                                                    <Button
                                                                        key={stone.id}
                                                                        size="small"
                                                                        variant="outlined"
                                                                        onClick={() =>
                                                                            goTo(`/gemstones/${stone.slug}`)
                                                                        }
                                                                        sx={{
                                                                            borderRadius: 999,
                                                                            textTransform: 'none',
                                                                            fontWeight: 700,
                                                                        }}
                                                                    >
                                                                        {stone.name}
                                                                    </Button>
                                                                ))}
                                                            </Box>
                                                        )}
                                                    </Box>
                                                );
                                            })}
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
                        <ListItemButton selected={activeHeaderPath === '/'} onClick={() => goTo('/')}>
                            <ListItemText primary="Home" />
                        </ListItemButton>

                        <ListItemButton selected={activeHeaderPath === '/jewellery'} onClick={() => goTo('/jewellery')}>
                            <ListItemText primary="All Jewellery" />
                        </ListItemButton>

                        <ListItemButton selected={location.pathname.startsWith('/gemstones')} onClick={() => goTo('/gemstones')}>
                            <ListItemText primary="Gemstones" />
                        </ListItemButton>

                        <ListItemButton selected={location.pathname.startsWith('/gemstone-categories')} onClick={() => goTo('/gemstone-categories')}>
                            <ListItemText primary="Gemstone Categories" />
                        </ListItemButton>

                        <ListItemButton selected={activeHeaderPath === '/categories'} onClick={() => goTo('/categories')}>
                            <ListItemText primary="All Categories" />
                        </ListItemButton>

                        <ListItemButton selected={activeHeaderPath === '/favourites'} onClick={() => goTo('/favourites')}>
                            <ListItemText primary="Favourites" />
                        </ListItemButton>

                        {isAuthenticated && (
                            <ListItemButton selected={activeHeaderPath === '/profile'} onClick={() => goTo('/profile')}>
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
