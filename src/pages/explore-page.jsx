import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';

/**
 * ExplorePage 컴포넌트
 *
 * Props:
 * @param {object} postsHook - usePosts 훅 반환값 [Required]
 *
 * Example usage:
 * <ExplorePage postsHook={postsHook} />
 */
function ExplorePage({ postsHook }) {
  const navigate = useNavigate();
  const { posts, loading } = postsHook;

  return (
    <Box sx={{ pb: 10 }}>
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', position: 'sticky', top: 0, bgcolor: 'background.default', zIndex: 100 }}>
        <Typography variant='h6' fontWeight={600}>탐색</Typography>
      </Box>

      <Container maxWidth='sm' sx={{ pt: 1 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
        ) : (
          <Grid container spacing={0.5}>
            {posts.map((post) => {
              const imgs = post.greenit_post_images?.sort((a, b) => a.order_index - b.order_index);
              const thumb = imgs?.[0]?.image_url;
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
                    {thumb ? (
                      <Box
                        component='img'
                        src={ thumb }
                        alt='게시물'
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant='caption' color='text.secondary'>텍스트</Typography>
                      </Box>
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

export default ExplorePage;
