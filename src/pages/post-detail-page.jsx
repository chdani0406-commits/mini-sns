import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { supabase } from '../lib/supabase';

/**
 * PostDetailPage 컴포넌트
 *
 * Props:
 * @param {string|null} userId - 현재 로그인 사용자 ID [Optional]
 *
 * Example usage:
 * <PostDetailPage userId={user?.id} />
 */
function PostDetailPage({ userId }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    fetchPost();
    fetchComments();
    if (userId) checkLike();
  }, [id, userId]);

  async function fetchPost() {
    setLoading(true);
    const { data } = await supabase
      .from('greenit_posts')
      .select(`
        *,
        greenit_users(id, username, display_name, avatar_url),
        greenit_post_images(image_url, order_index),
        greenit_likes(count)
      `)
      .eq('id', id)
      .single();
    setPost(data);
    setLikeCount(data?.greenit_likes?.[0]?.count ?? 0);
    setLoading(false);
  }

  async function fetchComments() {
    const { data } = await supabase
      .from('greenit_comments')
      .select('*, greenit_users(username, display_name, avatar_url)')
      .eq('post_id', id)
      .order('created_at', { ascending: true });
    setComments(data ?? []);
  }

  async function checkLike() {
    const { data } = await supabase
      .from('greenit_likes')
      .select('id')
      .eq('post_id', id)
      .eq('user_id', userId)
      .single();
    setIsLiked(!!data);
  }

  async function handleLike() {
    if (!userId) { navigate('/login'); return; }
    if (isLiked) {
      await supabase.from('greenit_likes').delete().eq('post_id', id).eq('user_id', userId);
      setLikeCount((c) => c - 1);
      setIsLiked(false);
    } else {
      await supabase.from('greenit_likes').insert({ post_id: id, user_id: userId });
      setLikeCount((c) => c + 1);
      setIsLiked(true);
    }
  }

  async function handleComment(e) {
    e.preventDefault();
    if (!userId) { navigate('/login'); return; }
    if (!newComment.trim()) return;
    setSubmitting(true);
    await supabase.from('greenit_comments').insert({ post_id: id, user_id: userId, content: newComment.trim() });
    setNewComment('');
    await fetchComments();
    setSubmitting(false);
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!post) {
    return (
      <Container maxWidth='sm' sx={{ py: 4, textAlign: 'center' }}>
        <Typography>게시물을 찾을 수 없습니다.</Typography>
      </Container>
    );
  }

  const images = post.greenit_post_images?.sort((a, b) => a.order_index - b.order_index) ?? [];
  const author = post.greenit_users;
  const createdAt = new Date(post.created_at).toLocaleDateString('ko-KR');

  return (
    <Box sx={{ pb: 10 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', p: 1, borderBottom: '1px solid', borderColor: 'divider', position: 'sticky', top: 0, bgcolor: 'background.default', zIndex: 100 }}>
        <IconButton onClick={ () => navigate(-1) }>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant='h6' fontWeight={600}>게시물</Typography>
      </Box>

      <Container maxWidth='sm'>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1.5 }}>
          <Avatar src={ author?.avatar_url } sx={{ bgcolor: 'primary.main' }}>
            { author?.display_name?.[0]?.toUpperCase() }
          </Avatar>
          <Box>
            <Typography fontWeight={600} variant='body2'>{ author?.display_name }</Typography>
            <Typography variant='caption' color='text.secondary'>@{ author?.username } · { createdAt }</Typography>
          </Box>
        </Box>

        {images.length > 0 && (
          <Box sx={{ position: 'relative' }}>
            <Box
              component='img'
              src={ images[imgIdx]?.image_url }
              alt='게시물 이미지'
              sx={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: 2 }}
            />
            {images.length > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, py: 1 }}>
                {images.map((_, i) => (
                  <Box
                    key={ i }
                    onClick={ () => setImgIdx(i) }
                    sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: i === imgIdx ? 'primary.main' : 'grey.400', cursor: 'pointer' }}
                  />
                ))}
              </Box>
            )}
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1 }}>
          <IconButton onClick={ handleLike } sx={{ color: isLiked ? 'error.main' : 'inherit' }}>
            { isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon /> }
          </IconButton>
          <Typography variant='body2'>{ likeCount }개 좋아요</Typography>
        </Box>

        {post.caption && (
          <Typography variant='body1' sx={{ pb: 2 }}>
            <Box component='span' fontWeight={600} sx={{ mr: 0.5 }}>{ author?.username }</Box>
            { post.caption }
          </Typography>
        )}

        <Divider sx={{ my: 1 }} />

        <Typography variant='subtitle2' color='text.secondary' sx={{ mb: 1 }}>
          댓글 { comments.length }개
        </Typography>

        {comments.map((c) => (
          <Box key={ c.id } sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
            <Avatar src={ c.greenit_users?.avatar_url } sx={{ width: 32, height: 32, bgcolor: 'secondary.main', fontSize: 14 }}>
              { c.greenit_users?.display_name?.[0]?.toUpperCase() }
            </Avatar>
            <Box>
              <Box component='span' fontWeight={600} fontSize={13} sx={{ mr: 0.5 }}>{ c.greenit_users?.username }</Box>
              <Box component='span' fontSize={13}>{ c.content }</Box>
              <Typography variant='caption' color='text.secondary' display='block'>
                { new Date(c.created_at).toLocaleDateString('ko-KR') }
              </Typography>
            </Box>
          </Box>
        ))}

        <Divider sx={{ my: 2 }} />

        <Box component='form' onSubmit={ handleComment } sx={{ display: 'flex', gap: 1 }}>
          <TextField
            size='small'
            placeholder={ userId ? '댓글 달기...' : '로그인 후 댓글을 작성하세요' }
            fullWidth
            value={ newComment }
            onChange={ (e) => setNewComment(e.target.value) }
            disabled={ !userId }
          />
          <Button type='submit' variant='contained' size='small' disabled={ !userId || submitting || !newComment.trim() }>
            게시
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default PostDetailPage;
