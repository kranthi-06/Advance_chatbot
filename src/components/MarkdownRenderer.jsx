import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MarkdownRenderer({ content, className = '' }) {
    return (
        <div className={`markdown-content ${className}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    h1: ({ children }) => <h1 className="md-h1">{children}</h1>,
                    h2: ({ children }) => <h2 className="md-h2">{children}</h2>,
                    h3: ({ children }) => <h3 className="md-h3">{children}</h3>,
                    p: ({ children }) => <p className="md-p">{children}</p>,
                    ul: ({ children }) => <ul className="md-ul">{children}</ul>,
                    ol: ({ children }) => <ol className="md-ol">{children}</ol>,
                    li: ({ children }) => <li className="md-li">{children}</li>,
                    strong: ({ children }) => <strong className="md-strong">{children}</strong>,
                    em: ({ children }) => <em className="md-em">{children}</em>,
                    blockquote: ({ children }) => <blockquote className="md-blockquote">{children}</blockquote>,
                    code: ({ inline, children }) =>
                        inline
                            ? <code className="md-code-inline">{children}</code>
                            : <pre className="md-code-block"><code>{children}</code></pre>,
                    table: ({ children }) => (
                        <div className="md-table-wrapper">
                            <table className="md-table">{children}</table>
                        </div>
                    ),
                    thead: ({ children }) => <thead className="md-thead">{children}</thead>,
                    tbody: ({ children }) => <tbody className="md-tbody">{children}</tbody>,
                    tr: ({ children }) => <tr className="md-tr">{children}</tr>,
                    th: ({ children }) => <th className="md-th">{children}</th>,
                    td: ({ children }) => <td className="md-td">{children}</td>,
                    hr: () => <hr className="md-hr" />,
                    a: ({ href, children }) => <a href={href} className="md-link" target="_blank" rel="noopener noreferrer">{children}</a>,
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
