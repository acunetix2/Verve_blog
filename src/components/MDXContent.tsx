import ReactMarkdown from 'react-markdown';

interface MDXContentProps {
  content: string;
}

export const MDXContent = ({ content }: MDXContentProps) => {
  return (
    <article className="prose prose-invert max-w-none">
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <pre className="rounded-md border border-primary/30 shadow-glow bg-card p-6 overflow-x-auto my-4">
                <code 
                  className="text-muted-foreground font-mono text-sm leading-relaxed block"
                  {...props}
                >
                  {children}
                </code>
              </pre>
            ) : (
              <code 
                className="bg-muted/50 text-primary px-1.5 py-0.5 rounded text-sm font-mono border border-primary/20" 
                {...props}
              >
                {children}
              </code>
            );
          },
          h1: ({ children }) => (
            <h1 className="text-4xl font-display font-bold text-primary glow-text mb-6 mt-8">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-3xl font-display font-bold text-foreground mb-4 mt-8 border-b border-primary/30 pb-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-2xl font-display font-semibold text-foreground mb-3 mt-6">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-muted-foreground leading-relaxed mb-4">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4 ml-4">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground mb-4 ml-4">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-muted-foreground">
              {children}
            </li>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-secondary hover:text-secondary/80 underline underline-offset-4 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4 bg-muted/20 py-2">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-6">
              <table className="min-w-full border-collapse border border-border">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-border bg-muted/50 px-4 py-2 text-left font-mono text-primary">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-border px-4 py-2 text-muted-foreground">
              {children}
            </td>
          ),
          hr: () => (
            <hr className="my-8 border-t border-primary/30" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
};
