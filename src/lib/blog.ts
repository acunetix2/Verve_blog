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
const postFiles = import.meta.glob<string>('/content/posts/*.md', { 
  eager: true,
  as: 'raw'
});

// Parse markdown files and extract frontmatter
const parsePosts = (): BlogPost[] => {
  const posts: BlogPost[] = [];
  
  console.log('Parsing posts...', Object.keys(postFiles).length, 'files found');
  
  try {
    for (const path in postFiles) {
      console.log('Processing:', path);
      const content = postFiles[path] as string;
      
      if (!content) {
        console.warn('Empty content for:', path);
        continue;
      }
      
      const { data, content: markdownContent } = matter(content);
      
      // Extract slug from filename
      const slug = path.split('/').pop()?.replace('.md', '') || '';
      
      console.log('Post slug:', slug, 'Title:', data.title);
      
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
  } catch (error) {
    console.error('Error parsing posts:', error);
  }
  
  console.log('Total posts parsed:', posts.length);
  
  // Sort by date (newest first)
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Cache the parsed posts
const allPosts = parsePosts();

console.log('Blog system initialized with', allPosts.length, 'posts');

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
