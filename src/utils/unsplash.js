const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

export async function fetchRandomImages(query = 'food', count = 9) {
  if (!UNSPLASH_ACCESS_KEY) {
    return getFallbackImages(count);
  }
  try {
    const res = await fetch(
      `https://api.unsplash.com/photos/random?query=${query}&count=${count}&orientation=squarish`,
      { headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` } }
    );
    if (!res.ok) return getFallbackImages(count);
    const data = await res.json();
    return data.map((p) => ({
      id: p.id,
      url: p.urls.regular,
      thumb: p.urls.small,
      alt: p.alt_description || 'image',
    }));
  } catch {
    return getFallbackImages(count);
  }
}

function getFallbackImages(count) {
  const topics = ['nature', 'food', 'city', 'travel', 'architecture', 'fashion', 'animals', 'technology', 'art'];
  return Array.from({ length: count }, (_, i) => {
    const topic = topics[i % topics.length];
    const seed = Math.floor(Math.random() * 1000) + i;
    return {
      id: `fallback-${i}-${seed}`,
      url: `https://picsum.photos/seed/${seed}/600/600`,
      thumb: `https://picsum.photos/seed/${seed}/300/300`,
      alt: topic,
    };
  });
}
