import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useState } from 'react';

interface MDXContentProps {
  content: string;
}

export const MDXContent = ({ content }: MDXContentProps) => {
  return (
    <article className="max-w-5xl mx-auto px-0 py-0 bg-transparent">
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

                  <pre className="bg-gray-900 rounded p-3 sm:p-4 overflow-x-auto border border-red-600/30 text-xs sm:text-sm max-w-full">
                    <code
                      className="text-orange-400 font-mono leading-relaxed block break-words whitespace-pre-wrap"
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
                className="bg-gray-900 text-orange-400 px-1.5 py-0.5 rounded text-sm font-mono border border-red-600/30"
                {...props}
              >
                {children}
              </code>
            );
          },

          // all your other components remain exactly the same...

          h1: ({ children }) => (
            <h1 className="text-2xl sm:text-3xl md:text-3xl font-semibold text-white mb-2 sm:mb-3 mt-6 sm:mt-8 leading-tight tracking-tight break-words">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl sm:text-2xl md:text-2xl font-semibold text-white mb-2 mt-6 sm:mt-8 leading-snug tracking-tight break-words">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg sm:text-xl font-semibold text-gray-200 mb-2 mt-4 sm:mt-6 leading-snug break-words">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-3 sm:mb-4 break-words">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="space-y-1.5 text-gray-300 mb-3 sm:mb-4 ml-4 sm:ml-6 text-sm sm:text-base">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="space-y-1.5 text-gray-300 mb-3 sm:mb-4 ml-4 sm:ml-6 text-sm sm:text-base">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-300 text-sm sm:text-base leading-relaxed pl-1 break-words">
              {children}
            </li>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-orange-500 hover:text-orange-400 underline decoration-1 underline-offset-2 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-3 sm:border-l-4 border-red-600/50 pl-3 sm:pl-4 italic text-gray-400 my-3 sm:my-4 text-sm sm:text-base bg-red-900/10 py-2 px-2">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-4 sm:my-6 -mx-4 sm:mx-0 px-4 sm:px-0">
              <table className="min-w-full border-collapse border border-gray-700 text-gray-300 text-xs sm:text-sm">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-gray-700 bg-gray-800 px-2 sm:px-4 py-2 text-left font-semibold text-white text-xs sm:text-sm whitespace-nowrap">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-700 px-2 sm:px-4 py-2 text-gray-300 text-xs sm:text-sm break-words">
              {children}
            </td>
          ),
          hr: () => <hr className="my-8 border-t border-gray-800" />,
          strong: ({ children }) => (
            <strong className="font-semibold text-white">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-gray-300">{children}</em>
          ),
          mark: ({ children }) => (
            <mark className="bg-red-900/30 dark:bg-red-900/40 text-orange-300 rounded px-1 font-medium">
              {children}
            </mark>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
};
