import { Navigate, useRoutes } from 'react-router-dom';
import { useGetToken } from './hooks/useHandleSessions';
import { TOKEN_PREFIX } from './server/api/http';

// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import LogoutPage from './pages/LogoutPage';
import DashboardAdminApp from './pages/DashboardAdminApp';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/Profile';

// ----------------------------------------------------------------------

export default function Router() {
  const { token, isSuccess } = useGetToken(TOKEN_PREFIX);

  const handleAdminLayout = () => {
    if (isSuccess && token) {
      return <DashboardLayout />;
    }
    return <Navigate to="/auth/login" />;
  };

  const routesList = [
    {
      path: '/dashboard',
      element: handleAdminLayout(),
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAdminApp /> },

        { path: 'profile', element: <ProfilePage /> },

        { path: '404', element: <Page404 isInner /> },
        { path: '*', element: <Navigate to="/dashboard/404" /> },
      ],
    },

    // public
    {
      element: <SimpleLayout />,
      children: [
        { path: '/', element: <LoginPage />, index: true },

        {
          path: '/auth',
          children: [
            {
              path: 'login',
              element: <LoginPage />,
            },
            {
              path: 'register',
              element: <RegisterPage />,
            },
            {
              path: 'logout',
              element: <LogoutPage />,
            },
          ],
        },

        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },

    // handle notfound routes
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ];

  const routes = useRoutes(routesList);

  return routes;
}
