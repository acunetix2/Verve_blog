import matter from 'gray-matter';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  author: string;
  date: string;
  readTime: string;
  content: string;
  tags: string[];
  featured?: boolean;
}

// Import all markdown files from content/posts
const postFiles = import.meta.glob('/content/posts/*.md', { 
  eager: true, 
  query: '?raw',
  import: 'default'
});

// Parse markdown files and extract frontmatter
const parsePosts = (): BlogPost[] => {
  const posts: BlogPost[] = [];
  
  for (const path in postFiles) {
    const content = postFiles[path] as string;
    const { data, content: markdownContent } = matter(content);
    
    // Extract slug from filename
    const slug = path.split('/').pop()?.replace('.md', '') || '';
    
    posts.push({
      slug,
      title: data.title || '',
      description: data.description || '',
      author: data.author || '',
      date: data.date || '',
      readTime: data.readTime || '',
      content: markdownContent,
      tags: data.tags || [],
      featured: data.featured || false,
    });
  }
  
  // Sort by date (newest first)
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Cache the parsed posts
const allPosts = parsePosts();

export const getPostBySlug = (slug: string): BlogPost | undefined => {
  return allPosts.find((post) => post.slug === slug);
};

export const getAllPosts = (): BlogPost[] => {
  return allPosts;
};

export const getPostsByTag = (tag: string): BlogPost[] => {
  return allPosts.filter((post) => post.tags.includes(tag));
};

export const getAllTags = (): string[] => {
  const tags = new Set<string>();
  allPosts.forEach((post) => {
    post.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
};

export const searchPosts = (query: string): BlogPost[] => {
  const lowerQuery = query.toLowerCase();
  return allPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(lowerQuery) ||
      post.description.toLowerCase().includes(lowerQuery) ||
      post.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
};
