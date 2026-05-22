import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import { supabase } from '../lib/supabase';

/**
 * MyPage 컴포넌트
 *
 * Props:
 * @param {object} auth - useAuth 훅 반환값 [Required]
 *
 * Example usage:
 * <MyPage auth={auth} />
 */
function MyPage({ auth }) {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading, signOut } = auth;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ posts: 0, followers: 0, following: 0 });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchMyPosts();
    fetchStats();
  }, [user]);

  async function fetchMyPosts() {
    setLoading(true);
    const { data } = await supabase
      .from('greenit_posts')
      .select('id, greenit_post_images(image_url, order_index)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setPosts(data ?? []);
    setLoading(false);
  }

  async function fetchStats() {
    const [{ count: postCount }, { count: followerCount }, { count: followingCount }] = await Promise.all([
      supabase.from('greenit_posts').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('greenit_follows').select('id', { count: 'exact', head: true }).eq('following_id', user.id),
      supabase.from('greenit_follows').select('id', { count: 'exact', head: true }).eq('follower_id', user.id),
    ]);
    setStats({ posts: postCount ?? 0, followers: followerCount ?? 0, following: followingCount ?? 0 });
  }

  async function handleSignOut() {
    await signOut();
    navigate('/', { replace: true });
  }

  if (authLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ pb: 10 }}>
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', position: 'sticky', top: 0, bgcolor: 'background.default', zIndex: 100 }}>
        <Typography variant='h6' fontWeight={600}>마이페이지</Typography>
      </Box>

      <Container maxWidth='sm'>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, py: 3 }}>
          <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: 32 }}>
            { profile?.display_name?.[0]?.toUpperCase() }
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography fontWeight={700} variant='subtitle1'>{ profile?.display_name }</Typography>
            <Typography variant='body2' color='text.secondary'>@{ profile?.username }</Typography>
            {profile?.bio && <Typography variant='body2' sx={{ mt: 0.5 }}>{ profile.bio }</Typography>}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', textAlign: 'center', mb: 2 }}>
          {[
            { label: '게시물', value: stats.posts },
            { label: '팔로워', value: stats.followers },
            { label: '팔로잉', value: stats.following },
          ].map((s) => (
            <Box key={ s.label } sx={{ flex: 1 }}>
              <Typography fontWeight={700} variant='h6'>{ s.value }</Typography>
              <Typography variant='caption' color='text.secondary'>{ s.label }</Typography>
            </Box>
          ))}
        </Box>

        <Button variant='outlined' fullWidth color='error' onClick={ handleSignOut } sx={{ mb: 2 }}>
          로그아웃
        </Button>

        <Divider sx={{ mb: 1 }} />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
        ) : posts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography color='text.secondary'>아직 게시물이 없습니다.</Typography>
            <Button variant='contained' sx={{ mt: 2 }} onClick={ () => navigate('/new-post') }>
              첫 게시물 작성
            </Button>
          </Box>
        ) : (
          <Grid container spacing={0.5}>
            {posts.map((post) => {
              const thumb = post.greenit_post_images?.sort((a, b) => a.order_index - b.order_index)?.[0]?.image_url;
              return (
                <Grid size={{ xs: 4 }} key={ post.id }>
                  <Box
                    onClick={ () => navigate(`/post/${post.id}`) }
                    sx={{
                      aspectRatio: '1/1',
                      bgcolor: 'grey.200',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      borderRadius: 0.5,
                    }}
                  >
                    {thumb && (
                      <Box
                        component='img'
                        src={ thumb }
                        alt='내 게시물'
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    )}
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default MyPage;
