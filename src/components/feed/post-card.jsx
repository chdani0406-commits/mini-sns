import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutlined';

/**
 * PostCard 컴포넌트
 *
 * Props:
 * @param {object} post - 게시물 데이터 [Required]
 * @param {string|null} userId - 현재 로그인 사용자 ID [Optional]
 * @param {function} onLike - 좋아요 토글 함수 [Optional]
 *
 * Example usage:
 * <PostCard post={post} userId={user?.id} onLike={handleLike} />
 */
function PostCard({ post, userId, onLike }) {
  const navigate = useNavigate();
  const [imgIdx, setImgIdx] = useState(0);

  const images = post.greenit_post_images?.sort((a, b) => a.order_index - b.order_index) ?? [];
  const likeCount = post.greenit_likes?.[0]?.count ?? 0;
  const commentCount = post.greenit_comments?.[0]?.count ?? 0;
  const author = post.greenit_users;
  const isLiked = false;

  const createdAt = new Date(post.created_at).toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
  });

  function handleLike() {
    if (!userId) {
      navigate('/login');
      return;
    }
    onLike?.({ postId: post.id, userId });
  }

  return (
    <Card sx={{ mb: 1, borderRadius: 2 }}>
      <CardHeader
        avatar={
          <Avatar src={ author?.avatar_url } sx={{ bgcolor: 'primary.main' }}>
            { author?.display_name?.[0]?.toUpperCase() }
          </Avatar>
        }
        title={ author?.display_name }
        subheader={ `@${author?.username} · ${createdAt}` }
        sx={{ pb: 1 }}
      />

      {images.length > 0 && (
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component='img'
            image={ images[imgIdx]?.image_url }
            alt='게시물 이미지'
            sx={{ aspectRatio: '1/1', objectFit: 'cover', cursor: 'pointer' }}
            onClick={ () => navigate(`/post/${post.id}`) }
          />
          {images.length > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, py: 0.5, position: 'absolute', bottom: 8, left: 0, right: 0 }}>
              {images.map((_, i) => (
                <Box
                  key={ i }
                  onClick={ () => setImgIdx(i) }
                  sx={{
                    width: 6, height: 6, borderRadius: '50%',
                    bgcolor: i === imgIdx ? 'primary.main' : 'grey.400',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
      )}

      <CardActions disableSpacing sx={{ px: 1, pb: 0 }}>
        <IconButton onClick={ handleLike } size='small' sx={{ color: isLiked ? 'error.main' : 'inherit' }}>
          { isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon /> }
        </IconButton>
        <Typography variant='body2' sx={{ mr: 1 }}>{ likeCount }</Typography>
        <IconButton size='small' onClick={ () => navigate(`/post/${post.id}`) }>
          <ChatBubbleOutlineIcon />
        </IconButton>
        <Typography variant='body2'>{ commentCount }</Typography>
      </CardActions>

      {post.caption && (
        <CardContent sx={{ pt: 0.5, pb: '8px !important' }}>
          <Typography variant='body2' color='text.secondary' noWrap>
            { post.caption }
          </Typography>
        </CardContent>
      )}
    </Card>
  );
}

export default PostCard;
