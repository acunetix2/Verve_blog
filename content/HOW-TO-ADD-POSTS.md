# How to Add New Blog Posts

Adding a new blog post is simple! Just create a new markdown file in the `content/posts` folder.

## Steps to Add a New Post

1. **Create a new `.md` file** in `content/posts/` folder
   - Use a descriptive filename with hyphens (e.g., `my-awesome-post.md`)
   - The filename will be used as the URL slug

2. **Add frontmatter** at the top of your file (between `---` markers)

3. **Write your content** using Markdown syntax

## Frontmatter Template

```markdown
---
title: "Your Post Title"
description: "A brief description of your post"
author: "Your Name"
date: "2024-01-15"
readTime: "5 min read"
tags: ["Tag1", "Tag2", "Tag3"]
featured: true
---

# Your Post Title

Your content here...
```

## Frontmatter Fields

- **title** (required): The post title
- **description** (required): Short description for preview cards
- **author** (required): Author name
- **date** (required): Publication date (YYYY-MM-DD format)
- **readTime** (required): Estimated reading time (e.g., "5 min read")
- **tags** (required): Array of tags for filtering
- **featured** (optional): Set to `true` to show "Featured" badge

## Markdown Formatting

You can use all standard Markdown syntax:

### Headings
```markdown
# H1 Heading
## H2 Heading
### H3 Heading
```

### Code Blocks
```markdown
\`\`\`bash
echo "Hello World"
\`\`\`
```

### Lists
```markdown
- Bullet point 1
- Bullet point 2

1. Numbered item 1
2. Numbered item 2
```

### Links
```markdown
[Link text](https://example.com)
```

### Emphasis
```markdown
**bold text**
*italic text*
`inline code`
```

### Blockquotes
```markdown
> This is a quote
```

## Example Post

Check out the existing posts in `content/posts/` for examples!

## Tips

- Use descriptive filenames (they become the URL)
- Add relevant tags for better filtering
- Set `featured: true` for important posts
- Keep descriptions concise (1-2 sentences)
- Use code blocks for commands and code examples
- Add images by placing them in `public/images/` and referencing them with `![alt text](/images/your-image.png)`

That's it! Your new post will automatically appear on the blog homepage.
