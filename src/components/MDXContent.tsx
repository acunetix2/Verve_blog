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
              <pre className="rounded-md border border-primary/30 shadow-glow bg-[#1a1a1a] p-6 overflow-x-auto my-4">
                <code
                  className="text-gray-100 font-mono text-sm leading-relaxed block"
                  {...props}
                >
                  {children}
                </code>
              </pre>
            ) : (
              <code
                className="bg-gray-800 text-gray-100 px-1.5 py-0.5 rounded text-sm font-mono border border-primary/20"
                {...props}
              >
                {children}
              </code>
            );
          },
          h1: ({ children }) => (
            <h1 className="text-4xl font-display font-bold text-gray-100 mb-6 mt-8">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-3xl font-display font-semibold text-gray-200 mb-4 mt-8 border-b border-primary/30 pb-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-2xl font-display font-medium text-gray-300 mb-3 mt-6">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-gray-300 leading-relaxed mb-4">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-2 text-gray-300 mb-4 ml-4">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-2 text-gray-300 mb-4 ml-4">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-300">{children}</li>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-blue-400 hover:text-blue-300 underline underline-offset-4 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 italic text-gray-300 my-4 bg-gray-800/40 py-2">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-6">
              <table className="min-w-full border-collapse border border-gray-700 text-gray-300">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-gray-700 bg-gray-800 px-4 py-2 text-left font-semibold text-gray-200">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-700 px-4 py-2 text-gray-300">
              {children}
            </td>
          ),
          hr: () => <hr className="my-8 border-t border-gray-700" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
};
