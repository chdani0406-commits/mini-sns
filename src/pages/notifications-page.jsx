import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { supabase } from '../lib/supabase';

const TYPE_ICON = {
  like: <FavoriteIcon sx={{ color: 'error.main', fontSize: 18 }} />,
  comment: <ChatBubbleIcon sx={{ color: 'primary.main', fontSize: 18 }} />,
  follow: <PersonAddIcon sx={{ color: 'secondary.main', fontSize: 18 }} />,
};

const TYPE_TEXT = {
  like: '회원님의 게시물을 좋아합니다.',
  comment: '회원님의 게시물에 댓글을 달았습니다.',
  follow: '회원님을 팔로우하기 시작했습니다.',
};

/**
 * NotificationsPage 컴포넌트
 *
 * Props:
 * @param {string} userId - 현재 로그인 사용자 ID [Required]
 *
 * Example usage:
 * <NotificationsPage userId={user.id} />
 */
function NotificationsPage({ userId }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { navigate('/login'); return; }
    fetchNotifications();
  }, [userId]);

  async function fetchNotifications() {
    setLoading(true);
    const { data } = await supabase
      .from('greenit_notifications')
      .select('*, greenit_users!actor_id(username, display_name, avatar_url)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    setNotifications(data ?? []);

    await supabase
      .from('greenit_notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    setLoading(false);
  }

  return (
    <Box sx={{ pb: 10 }}>
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', position: 'sticky', top: 0, bgcolor: 'background.default', zIndex: 100 }}>
        <Typography variant='h6' fontWeight={600}>알림</Typography>
      </Box>

      <Container maxWidth='sm'>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
        ) : notifications.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color='text.secondary'>새로운 알림이 없습니다.</Typography>
          </Box>
        ) : (
          <List disablePadding>
            {notifications.map((n) => (
              <ListItem
                key={ n.id }
                sx={{
                  cursor: n.post_id ? 'pointer' : 'default',
                  bgcolor: n.is_read ? 'transparent' : 'primary.50',
                  '&:hover': { bgcolor: 'action.hover' },
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
                onClick={ () => n.post_id && navigate(`/post/${n.post_id}`) }
              >
                <ListItemAvatar>
                  <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                    <Avatar src={ n.greenit_users?.avatar_url } sx={{ bgcolor: 'primary.main' }}>
                      { n.greenit_users?.display_name?.[0]?.toUpperCase() }
                    </Avatar>
                    <Box sx={{ position: 'absolute', bottom: -2, right: -2, bgcolor: 'background.paper', borderRadius: '50%', p: 0.2 }}>
                      { TYPE_ICON[n.type] }
                    </Box>
                  </Box>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box component='span'>
                      <Box component='span' fontWeight={600}>{ n.greenit_users?.display_name }</Box>
                      { ' ' }{ TYPE_TEXT[n.type] }
                    </Box>
                  }
                  secondary={ new Date(n.created_at).toLocaleDateString('ko-KR') }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Container>
    </Box>
  );
}

export default NotificationsPage;
