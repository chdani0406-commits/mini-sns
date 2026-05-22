import { useNavigate, useLocation } from 'react-router-dom';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import AddBoxIcon from '@mui/icons-material/AddBox';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';

const NAV_ITEMS = [
  { label: '홈', icon: <HomeIcon />, path: '/home' },
  { label: '탐색', icon: <ExploreIcon />, path: '/explore' },
  { label: '게시글', icon: <AddBoxIcon />, path: '/new-post' },
  { label: '알림', icon: <NotificationsIcon />, path: '/notifications' },
  { label: '마이', icon: <PersonIcon />, path: '/my' },
];

/**
 * BottomNav 컴포넌트 — 로그인 상태에서만 렌더됨
 *
 * Example usage:
 * <BottomNav />
 */
function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentValue = NAV_ITEMS.findIndex((item) => item.path === location.pathname);

  function handleChange(_e, newValue) {
    const target = NAV_ITEMS[newValue];
    if (!target) return;
    navigate(target.path);
  }

  return (
    <Paper
      sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }}
      elevation={3}
    >
      <BottomNavigation
        value={currentValue === -1 ? false : currentValue}
        onChange={handleChange}
        showLabels
        sx={{ '& .Mui-selected': { color: 'primary.main' } }}
      >
        {NAV_ITEMS.map((item) => (
          <BottomNavigationAction
            key={ item.path }
            label={ item.label }
            icon={ item.icon }
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}

export default BottomNav;
