import React from 'react';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import TimelineIcon from '@mui/icons-material/Timeline';
import HistoryIcon from '@mui/icons-material/History';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import PeopleIcon from '@mui/icons-material/People';
import { useNavigate, useLocation } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Import custom page header
import '../../common/PageHeader/styles.css';

// Navigációs konfiguráció a Toolpad formátumában
const NAVIGATION = [
  {
    kind: 'header',
    title: 'Főmenü',
  },
  {
    segment: '',  // Empty segment for the root path
    title: 'Bevásárló Listák',
    icon: <ShoppingCartIcon />,
    path: '/'
  },
  {
    segment: 'products',
    title: 'Termékkatalógus',
    icon: <InventoryIcon />,
    path: '/products'
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Elemzés',
  },
  {
    segment: 'statistics',
    title: 'Statisztikák',
    icon: <TimelineIcon />,
    path: '/statistics'
  },
  {
    segment: 'history',
    title: 'Vásárlási előzmények',
    icon: <HistoryIcon />,
    path: '/history'
  },
  {
    kind: 'divider',
  },
  {
    segment: 'profile',
    title: 'Profilom',
    icon: <PersonIcon />,
    children: [
      {
        segment: 'view-profile',
        title: 'Profil megtekintése',
        path: '/profile'
      },
      {
        segment: 'change-password',
        title: 'Jelszó módosítása',
        icon: <VpnKeyIcon />,
        path: '/profile/change-password'
      },
      {
        segment: 'search-users',
        title: 'Felhasználók keresése',
        icon: <PeopleIcon />,
        path: '/users/search'
      }
    ]
  },
  {
    segment: 'login',
    title: 'Kijelentkezés',
    icon: <LogoutIcon />,
    path: '/login'
  }
];

// Egyedi téma
const customTheme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

// Router az AppProvider-hez
function useCustomRouter() {
  const navigate = useNavigate();
  const location = useLocation();
  const [pathname, setPathname] = React.useState(location.pathname);

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(location.search),
      navigate: (path) => {
        // Ensure we're not appending to the URL incorrectly
        const normalizedPath = path.startsWith('/') ? path : `/${path}`;
        setPathname(normalizedPath);
        navigate(normalizedPath);
      },
    };
  }, [pathname, navigate, location.search]);

  React.useEffect(() => {
    setPathname(location.pathname);
  }, [location.pathname]);

  return router;
}

const MainLayout = ({ children }) => {
  const router = useCustomRouter();
  const navigate = useNavigate();

  // Navigáció kezelése
  const handleNavigate = (segment) => {
    console.log("Navigation segment clicked:", segment);
    
    // Special case for empty segment (home)
    if (segment === '') {
      navigate('/');
      return;
    }
    
    // Találjuk meg a helyes útvonalat a szegmens alapján
    const findPathBySegment = (items, segment) => {
      for (const item of items) {
        if (item.segment === segment) {
          return item.path;
        }
        if (item.children) {
          const childPath = findPathBySegment(item.children, segment);
          if (childPath) return childPath;
        }
      }
      return null;
    };

    const path = findPathBySegment(NAVIGATION, segment);
    
    if (segment === 'logout') {
      // Kijelentkezés kezelése
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      navigate('/login');
    } else if (path) {
      // Check if the path is implemented in the application
      const implementedRoutes = ['/', '/products', '/profile', '/profile/change-password', '/users/search', '/statistics'];
      
      if (implementedRoutes.includes(path)) {
        navigate(path);
      } else {
        // For unimplemented routes, show an alert or navigate to a "not implemented" page
        alert(`A "${path}" útvonal még nem elérhető. Fejlesztés alatt áll.`);
        // Alternatively, you could navigate to a "feature coming soon" page
        // navigate('/coming-soon');
      }
    }
  };

  // User info for the account display
  const userInfo = {
    name: 'Felhasználó',
    email: 'felhasznalo@example.com'
  };

  return (
    <ThemeProvider theme={customTheme}>
      <AppProvider 
        navigation={NAVIGATION} 
        router={router}
        onNavigate={handleNavigate}
        basePath=""  // Set an empty base path
        branding={{
          title: 'Bevásárlólistáim',
          logo: <ShoppingCartIcon style={{ transform: 'translateY(7px)' }} />,
        }}
        breadcrumbs={false}
      >
        <DashboardLayout
          account={{
            name: userInfo.name,
            email: userInfo.email,
            avatar: userInfo.name.charAt(0),
          }}
          breadcrumbs={false}
        >
          <PageContainer>
            {children}
          </PageContainer>
        </DashboardLayout>
      </AppProvider>
    </ThemeProvider>
  );
};

export default MainLayout;