import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function usePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async (search = '') => {
    setLoading(true);
    let query = supabase
      .from('greenit_posts')
      .select(`
        *,
        greenit_users(id, username, display_name, avatar_url),
        greenit_post_images(image_url, order_index),
        greenit_likes(count),
        greenit_comments(count)
      `)
      .order('created_at', { ascending: false });

    if (search) {
      query = query.ilike('caption', `%${search}%`);
    }

    const { data, error } = await query;
    if (!error) setPosts(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  async function createPost({ caption, imageUrls, userId }) {
    const { data: post, error } = await supabase
      .from('greenit_posts')
      .insert({ caption, user_id: userId })
      .select()
      .single();

    if (error) return { error };

    if (imageUrls.length > 0) {
      const images = imageUrls.map((url, idx) => ({
        post_id: post.id,
        image_url: url,
        order_index: idx,
      }));
      await supabase.from('greenit_post_images').insert(images);
    }

    await fetchPosts();
    return { data: post };
  }

  async function toggleLike({ postId, userId }) {
    const { data: existing } = await supabase
      .from('greenit_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();

    if (existing) {
      await supabase.from('greenit_likes').delete().eq('id', existing.id);
    } else {
      await supabase.from('greenit_likes').insert({ post_id: postId, user_id: userId });
    }

    await fetchPosts();
  }

  return { posts, loading, fetchPosts, createPost, toggleLike };
}
