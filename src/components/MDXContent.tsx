import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useState } from 'react';

interface MDXContentProps {
  content: string;
}

export const MDXContent = ({ content }: MDXContentProps) => {
  return (
    <article className="max-w-5xl mx-auto px-8 py-8 bg-white">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const [copied, setCopied] = useState(false);
            const match = /language-(\w+)/.exec(className || '');

            const handleCopy = () => {
              navigator.clipboard.writeText(String(children).trim());
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            };

            // BLOCK CODE
            if (!inline && match) {
              return (
                <div className="relative my-6">
                  {/* Copy button with two-square icon */}
                  <button
                    onClick={handleCopy}
                    className="absolute top-2 right-2 p-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                    title="Copy"
                  >
                    {!copied ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-700"
                      >
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    ) : (
                      <span className="text-xs text-green-600 font-semibold">✔</span>
                    )}
                  </button>

                  <pre className="bg-gray-50 rounded p-4 overflow-x-auto border border-gray-200 text-sm">
                    <code
                      className="text-gray-800 font-mono leading-relaxed block"
                      {...props}
                    >
                      {children}
                    </code>
                  </pre>
                </div>
              );
            }

            // INLINE CODE
            return (
              <code
                className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            );
          },

          // all your other components remain exactly the same...

          h1: ({ children }) => (
            <h1 className="text-3xl font-semibold text-gray-900 mb-3 mt-8 leading-tight tracking-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold text-gray-900 mb-2 mt-8 leading-snug tracking-tight">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-6 leading-snug">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-gray-700 text-base leading-relaxed mb-4">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="space-y-1.5 text-gray-700 mb-4 ml-6">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="space-y-1.5 text-gray-700 mb-4 ml-6">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-700 text-base leading-relaxed pl-1">
              {children}
            </li>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-blue-600 hover:text-blue-700 underline decoration-1 underline-offset-2 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-3 border-gray-300 pl-4 italic text-gray-600 my-4 text-base">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-6">
              <table className="min-w-full border-collapse border border-gray-300 text-gray-800 text-sm">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-gray-300 bg-gray-50 px-4 py-2 text-left font-semibold text-gray-900 text-sm">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-300 px-4 py-2 text-gray-700 text-sm">
              {children}
            </td>
          ),
          hr: () => <hr className="my-8 border-t border-gray-200" />,
          strong: ({ children }) => (
            <strong className="font-semibold text-gray-900">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-gray-700">{children}</em>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
};
