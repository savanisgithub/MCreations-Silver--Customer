import { CssBaseline, ThemeProvider } from '@mui/material';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';
import { queryClient } from './app/queryClient';
import { theme } from './theme/theme';
import { AuthProvider } from './context/AuthContext';
import { router } from './app/router';


export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider
          maxSnack={3}
          autoHideDuration={3000}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}