import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { fetchRandomImages } from '../utils/unsplash';

/**
 * NewPostPage 컴포넌트
 *
 * Props:
 * @param {object} postsHook - usePosts 훅 반환값 [Required]
 * @param {string} userId - 현재 로그인 사용자 ID [Required]
 *
 * Example usage:
 * <NewPostPage postsHook={postsHook} userId={user.id} />
 */
function NewPostPage({ postsHook, userId }) {
  const navigate = useNavigate();
  const { createPost } = postsHook;

  const [caption, setCaption] = useState('');
  const [images, setImages] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('food');

  async function handleFetchImages() {
    setLoadingImages(true);
    setSelectedIds([]);
    const result = await fetchRandomImages(query, 9);
    setImages(result);
    setLoadingImages(false);
  }

  function toggleSelect(imgId) {
    setSelectedIds((prev) =>
      prev.includes(imgId) ? prev.filter((id) => id !== imgId) : [...prev, imgId]
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!caption.trim() && selectedIds.length === 0) {
      setError('내용이나 이미지를 하나 이상 입력해주세요.');
      return;
    }
    setSubmitting(true);
    const selectedUrls = images.filter((img) => selectedIds.includes(img.id)).map((img) => img.url);
    const { error } = await createPost({ caption, imageUrls: selectedUrls, userId });
    setSubmitting(false);
    if (error) {
      setError('게시물 작성에 실패했습니다.');
    } else {
      navigate('/');
    }
  }

  return (
    <Box sx={{ pb: 10 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, borderBottom: '1px solid', borderColor: 'divider', position: 'sticky', top: 0, bgcolor: 'background.default', zIndex: 100 }}>
        <IconButton onClick={ () => navigate(-1) }>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant='h6' fontWeight={600}>새 게시물</Typography>
        <Button variant='contained' size='small' onClick={ handleSubmit } disabled={ submitting }>
          { submitting ? <CircularProgress size={16} color='inherit' /> : '게시' }
        </Button>
      </Box>

      <Container maxWidth='sm' sx={{ pt: 2 }}>
        {error && <Alert severity='error' sx={{ mb: 2 }}>{ error }</Alert>}

        <TextField
          label='내용 입력'
          multiline
          rows={3}
          fullWidth
          value={ caption }
          onChange={ (e) => setCaption(e.target.value) }
          placeholder='밀키트 레시피나 후기를 공유해보세요!'
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          {['food', 'cooking', 'meal', 'kitchen', 'recipe'].map((q) => (
            <Chip
              key={ q }
              label={ q }
              size='small'
              onClick={ () => setQuery(q) }
              color={ query === q ? 'primary' : 'default' }
              variant={ query === q ? 'filled' : 'outlined' }
            />
          ))}
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Button
            variant='outlined'
            fullWidth
            onClick={ handleFetchImages }
            disabled={ loadingImages }
            startIcon={ loadingImages ? <CircularProgress size={16} /> : <RefreshIcon /> }
          >
            이미지 불러오기
          </Button>
        </Box>

        {selectedIds.length > 0 && (
          <Typography variant='body2' color='primary' sx={{ mb: 1 }}>
            { selectedIds.length }개 선택됨
          </Typography>
        )}

        {images.length > 0 && (
          <Grid container spacing={0.5}>
            {images.map((img) => {
              const selected = selectedIds.includes(img.id);
              return (
                <Grid size={{ xs: 4 }} key={ img.id }>
                  <Box
                    onClick={ () => toggleSelect(img.id) }
                    sx={{
                      position: 'relative',
                      aspectRatio: '1/1',
                      cursor: 'pointer',
                      border: selected ? '3px solid' : '3px solid transparent',
                      borderColor: selected ? 'primary.main' : 'transparent',
                      borderRadius: 1,
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      component='img'
                      src={ img.thumb }
                      alt={ img.alt }
                      sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                    {selected && (
                      <Box sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'primary.main', borderRadius: '50%', display: 'flex' }}>
                        <CheckCircleIcon sx={{ color: 'white', fontSize: 20 }} />
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

export default NewPostPage;
