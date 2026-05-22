import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { useAuth } from './hooks/use-auth';
import { usePosts } from './hooks/use-posts';
import BottomNav from './components/common/bottom-nav';
import HomePage from './pages/home-page';
import LoginPage from './pages/login-page';
import PostDetailPage from './pages/post-detail-page';
import NewPostPage from './pages/new-post-page';
import MyPage from './pages/my-page';
import NotificationsPage from './pages/notifications-page';
import ExplorePage from './pages/explore-page';

function App() {
  const auth = useAuth();
  const postsHook = usePosts();
  const isLoggedIn = !!auth.user;

  return (
    <BrowserRouter basename={ import.meta.env.BASE_URL }>
      <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'background.default' }}>
        <Routes>
          {/* 첫 페이지: 비로그인 → 로그인, 로그인 → 홈 */}
          <Route path='/' element={
            isLoggedIn ? <Navigate to='/home' replace /> : <LoginPage auth={ auth } />
          } />
          <Route path='/login' element={
            isLoggedIn ? <Navigate to='/home' replace /> : <LoginPage auth={ auth } />
          } />

          {/* 로그인 필수 페이지 */}
          <Route path='/home' element={
            isLoggedIn
              ? <HomePage postsHook={ postsHook } userId={ auth.user.id } />
              : <Navigate to='/' replace />
          } />
          <Route path='/explore' element={
            isLoggedIn
              ? <ExplorePage postsHook={ postsHook } />
              : <Navigate to='/' replace />
          } />
          <Route path='/new-post' element={
            isLoggedIn
              ? <NewPostPage postsHook={ postsHook } userId={ auth.user.id } />
              : <Navigate to='/' replace />
          } />
          <Route path='/notifications' element={
            isLoggedIn
              ? <NotificationsPage userId={ auth.user.id } />
              : <Navigate to='/' replace />
          } />
          <Route path='/my' element={
            isLoggedIn
              ? <MyPage auth={ auth } />
              : <Navigate to='/' replace />
          } />
          <Route path='/post/:id' element={
            isLoggedIn
              ? <PostDetailPage userId={ auth.user.id } />
              : <Navigate to='/' replace />
          } />
        </Routes>

        {isLoggedIn && <BottomNav />}
      </Box>
    </BrowserRouter>
  );
}

export default App;
