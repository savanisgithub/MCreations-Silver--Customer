import { createBrowserRouter } from 'react-router-dom';
import CustomerLayout from '../components/layout/CustomerLayout';
import HomePage from '../pages/home/HomePage';
import CategoriesPage from '../pages/categories/CategoriesPage';
import JewelleryListPage from '../pages/jewellery/JewelleryListPage';
import JewelleryDetailsPage from '../pages/jewellery/JewelleryDetailsPage';
import FavouritesPage from '../pages/favourites/FavouritesPage';
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import ProtectedRoute from '../components/layout/ProtectedRoutes';
import NotFoundPage from '../pages/not-found/NotFoundPage';
import ProfilePage from '../pages/profile/ProfilePage';
import ForgotPasswordPage from '../pages/auth/ForgotPassword';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';


export const router = createBrowserRouter([
    {
        element: <CustomerLayout />,
        children: [
            {
                path: '/',
                element: <HomePage />,
            },
            {
                path: '/categories',
                element: <CategoriesPage />,
            },
            {
                path: '/categories/:slug',
                element: <JewelleryListPage />,
            },
            {
                path: '/jewellery',
                element: <JewelleryListPage />,
            },
            {
                path: '/jewellery/:slug',
                element: <JewelleryDetailsPage />,
            },
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: '/favourites',
                        element: <FavouritesPage />,
                    },
                    {
                        path: '/profile',
                        element: <ProfilePage />,
                    },
                ],
            },
            {
                path: '*',
                element: <NotFoundPage />,
            },
        ],
    },
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/signup',
        element: <SignupPage />,
    },
    {
        path: '/forgot-password',
        element: <ForgotPasswordPage />,
    },
    {
        path: '/reset-password',
        element: <ResetPasswordPage />,
    },
]);