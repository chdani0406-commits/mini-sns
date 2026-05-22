import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';

/**
 * LoginPage 컴포넌트
 *
 * Props:
 * @param {object} auth - useAuth 훅 반환값 [Required]
 *
 * Example usage:
 * <LoginPage auth={auth} />
 */
function LoginPage({ auth }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({
    email: '', password: '', passwordConfirm: '', displayName: '', username: '',
  });

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await auth.signIn(loginForm);
    setLoading(false);
    if (error) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    } else {
      navigate('/home');
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    setError('');
    if (signupForm.password !== signupForm.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (signupForm.username.includes('@') || signupForm.username.length < 3) {
      setError('사용자명은 @ 없이 3자 이상으로 입력해주세요.');
      return;
    }
    setLoading(true);
    const { error } = await auth.signUp({
      email: signupForm.email,
      password: signupForm.password,
      username: signupForm.username,
      displayName: signupForm.displayName,
    });
    setLoading(false);
    if (error) {
      setError(error.message || '회원가입에 실패했습니다.');
    } else {
      setSuccess('가입 완료! 이메일을 확인해 인증 후 로그인해주세요.');
    }
  }

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: 'background.default' }}>
      <Container maxWidth='xs'>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant='h4' fontWeight={700} color='primary'>greenit</Typography>
          <Typography variant='body2' color='text.secondary'>밀키트 커뮤니티</Typography>
        </Box>

        <Tabs value={ tab } onChange={ (_e, v) => { setTab(v); setError(''); setSuccess(''); } } variant='fullWidth' sx={{ mb: 2 }}>
          <Tab label='로그인' />
          <Tab label='회원가입' />
        </Tabs>

        {error && <Alert severity='error' sx={{ mb: 2 }}>{ error }</Alert>}
        {success && <Alert severity='success' sx={{ mb: 2 }}>{ success }</Alert>}

        {tab === 0 ? (
          <Box component='form' onSubmit={ handleLogin } sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label='이메일'
              type='email'
              required
              fullWidth
              size='small'
              value={ loginForm.email }
              onChange={ (e) => setLoginForm({ ...loginForm, email: e.target.value }) }
            />
            <TextField
              label='비밀번호'
              type='password'
              required
              fullWidth
              size='small'
              value={ loginForm.password }
              onChange={ (e) => setLoginForm({ ...loginForm, password: e.target.value }) }
            />
            <Button type='submit' variant='contained' fullWidth disabled={ loading } sx={{ py: 1.2 }}>
              { loading ? <CircularProgress size={20} color='inherit' /> : '로그인' }
            </Button>
          </Box>
        ) : (
          <Box component='form' onSubmit={ handleSignup } sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label='이메일'
              type='email'
              required
              fullWidth
              size='small'
              value={ signupForm.email }
              onChange={ (e) => setSignupForm({ ...signupForm, email: e.target.value }) }
            />
            <TextField
              label='이름 (표시 이름)'
              required
              fullWidth
              size='small'
              value={ signupForm.displayName }
              onChange={ (e) => setSignupForm({ ...signupForm, displayName: e.target.value }) }
            />
            <TextField
              label='사용자명 (@아이디)'
              required
              fullWidth
              size='small'
              value={ signupForm.username }
              onChange={ (e) => setSignupForm({ ...signupForm, username: e.target.value }) }
              InputProps={{ startAdornment: <Typography sx={{ mr: 0.5, color: 'text.secondary' }}>@</Typography> }}
            />
            <Divider />
            <TextField
              label='비밀번호'
              type='password'
              required
              fullWidth
              size='small'
              value={ signupForm.password }
              onChange={ (e) => setSignupForm({ ...signupForm, password: e.target.value }) }
            />
            <TextField
              label='비밀번호 확인'
              type='password'
              required
              fullWidth
              size='small'
              value={ signupForm.passwordConfirm }
              onChange={ (e) => setSignupForm({ ...signupForm, passwordConfirm: e.target.value }) }
            />
            <Button type='submit' variant='contained' fullWidth disabled={ loading } sx={{ py: 1.2 }}>
              { loading ? <CircularProgress size={20} color='inherit' /> : '회원가입' }
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default LoginPage;
