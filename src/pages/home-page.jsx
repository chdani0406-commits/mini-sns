import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import PostCard from '../components/feed/post-card';

/**
 * HomePage 컴포넌트
 *
 * Props:
 * @param {object} postsHook - usePosts 훅 반환값 [Required]
 * @param {string|null} userId - 현재 로그인 사용자 ID [Optional]
 *
 * Example usage:
 * <HomePage postsHook={postsHook} userId={user?.id} />
 */
function HomePage({ postsHook, userId }) {
  const { posts, loading, fetchPosts, toggleLike } = postsHook;
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => fetchPosts(search), 400);
    return () => clearTimeout(timer);
  }, [search, fetchPosts]);

  return (
    <Box sx={{ pb: 8 }}>
      <Box sx={{ position: 'sticky', top: 0, bgcolor: 'background.default', zIndex: 100, py: 1, px: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant='h6' fontWeight={700} color='primary' sx={{ flexShrink: 0 }}>
            greenit
          </Typography>
          <TextField
            size='small'
            placeholder='게시물 검색...'
            fullWidth
            value={ search }
            onChange={ (e) => setSearch(e.target.value) }
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon fontSize='small' />
                </InputAdornment>
              ),
            }}
            sx={{ bgcolor: 'background.paper', borderRadius: 1 }}
          />
          <IconButton onClick={ () => fetchPosts(search) } size='small'>
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      <Container maxWidth='sm' sx={{ pt: 1 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress color='primary' />
          </Box>
        ) : posts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color='text.secondary'>
              { search ? '검색 결과가 없습니다.' : '아직 게시물이 없습니다. 첫 게시물을 작성해보세요!' }
            </Typography>
          </Box>
        ) : (
          posts.map((post) => (
            <PostCard
              key={ post.id }
              post={ post }
              userId={ userId }
              onLike={ toggleLike }
            />
          ))
        )}
      </Container>
    </Box>
  );
}

export default HomePage;
