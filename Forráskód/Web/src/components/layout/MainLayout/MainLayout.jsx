import React from 'react';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import InventoryIcon from '@mui/icons-material/Inventory';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import TimelineIcon from '@mui/icons-material/Timeline';
import HistoryIcon from '@mui/icons-material/History';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import PeopleIcon from '@mui/icons-material/People';
import { useNavigate, useLocation } from 'react-router-dom';
import { createTheme } from '@mui/material/styles';

// Navigációs konfiguráció - egyszerűsített változat a kompatibilitás érdekében
const NAVIGATION = [
  {
    title: 'Áttekintés',
    icon: <DashboardIcon />,
    path: '/'
  },
  {
    title: 'Bevásárló Listák',
    icon: <ShoppingCartIcon />,
    path: '/'
  },
  {
    title: 'Termékkatalógus',
    icon: <InventoryIcon />,
    path: '/products'
  },
  {
    type: 'divider'
  },
  {
    title: 'Statisztikák',
    icon: <TimelineIcon />,
    path: '/statistics'
  },
  {
    title: 'Vásárlási előzmények',
    icon: <HistoryIcon />,
    path: '/history'
  },
  {
    type: 'divider'
  },
  {
    title: 'Profilom',
    icon: <PersonIcon />,
    path: '/profile',
    children: [
      {
        title: 'Profil megtekintése',
        path: '/profile'
      },
      {
        title: 'Jelszó módosítása',
        icon: <VpnKeyIcon />,
        path: '/profile/change-password'
      },
      {
        title: 'Felhasználók keresése',
        icon: <PeopleIcon />,
        path: '/users/search'
      }
    ]
  },
  {
    title: 'Kijelentkezés',
    icon: <LogoutIcon />,
    path: '/login',
    id: 'logout'
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

// Router mock az AppProvider-hez
function useCustomRouter(initialPath) {
  const navigate = useNavigate();
  const location = useLocation();
  const [pathname, setPathname] = React.useState(initialPath || location.pathname);

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(location.search),
      navigate: (path) => {
        setPathname(String(path));
        navigate(path);
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
  const handleNavigate = (itemId) => {
    console.log("Navigation item clicked:", itemId);
    if (itemId === 'logout') {
      // Kijelentkezés kezelése
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      navigate('/login');
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Bal oldali navigációs sáv */}
      <div style={{ 
        width: '250px', 
        minHeight: '100vh', 
        backgroundColor: '#f5f5f5',
        borderRight: '1px solid #e0e0e0',
        padding: '20px 0'
      }}>
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px 20px 16px',
          borderBottom: '1px solid #e0e0e0'
        }}>
          <ShoppingCartIcon style={{ marginRight: '10px', color: '#3f51b5' }} />
          <h1 style={{ 
            margin: 0, 
            fontSize: '1.2rem', 
            fontWeight: 600, 
            color: '#333'
          }}>
            Bevásárlólistáim
          </h1>
        </div>
        
        <nav>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {NAVIGATION.map((item, index) => {
              if (item.type === 'divider') {
                return (
                  <li key={`divider-${index}`} style={{ 
                    borderBottom: '1px solid #e0e0e0',
                    margin: '10px 0' 
                  }}></li>
                );
              }
              
              return (
                <li key={item.path || index}>
                  <a 
                    href={item.path} 
                    onClick={(e) => {
                      e.preventDefault();
                      if (item.id === 'logout') {
                        handleNavigate('logout');
                      } else {
                        navigate(item.path);
                      }
                    }}
                    style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      padding: '10px 16px',
                      textDecoration: 'none',
                      color: router.pathname === item.path ? '#3f51b5' : '#555',
                      backgroundColor: router.pathname === item.path ? 'rgba(63, 81, 181, 0.08)' : 'transparent',
                      fontWeight: router.pathname === item.path ? 500 : 'normal'
                    }}
                  >
                    <span style={{ marginRight: '10px' }}>
                      {item.icon}
                    </span>
                    {item.title}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      
      {/* Fő tartalom */}
      <div style={{ flexGrow: 1, padding: '20px' }}>
        {children}
      </div>
    </div>
  );
};

export default MainLayout;