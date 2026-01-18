import React from 'react';
import styled from '@emotion/styled';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { AIResponse } from '../types';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const ResponseContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background-color: var(--color-background);
  overflow: hidden;
`;

const ResponseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm);
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-surface);
`;

const ResponseTitle = styled.h3`
  margin: 0;
  font-size: var(--font-size-medium);
  font-weight: 500;
  color: var(--color-text);
`;

const ResponseContent = styled.div`
  flex: 1;
  padding: var(--spacing-md);
  overflow-y: auto;
  max-height: 700px;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--color-surface);
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--color-border);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: var(--color-text-secondary);
  }
`;

const MarkdownContent = styled.div`
  line-height: 1.6;
  color: var(--color-text);
  
  h1, h2, h3, h4, h5, h6 {
    color: var(--color-text);
    margin-top: var(--spacing-lg);
    margin-bottom: var(--spacing-sm);
  }
  
  h1 { font-size: 1.5em; }
  h2 { font-size: 1.3em; }
  h3 { font-size: 1.1em; }
  
  p {
    margin-bottom: var(--spacing-sm);
  }
  
  ul, ol {
    margin-bottom: var(--spacing-sm);
    padding-left: var(--spacing-lg);
  }
  
  li {
    margin-bottom: var(--spacing-xs);
  }
  
  blockquote {
    border-left: 4px solid var(--color-primary);
    padding-left: var(--spacing-md);
    margin: var(--spacing-md) 0;
    background-color: var(--color-surface);
    padding: var(--spacing-sm);
    border-radius: 4px;
  }
  
  code {
    background-color: var(--color-surface);
    padding: 2px 4px;
    border-radius: 4px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.9em;
  }
  
  pre {
    background-color: var(--color-surface);
    padding: var(--spacing-md);
    border-radius: 8px;
    overflow-x: auto;
    margin: var(--spacing-md) 0;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin: var(--spacing-md) 0;
  }
  
  th, td {
    border: 1px solid var(--color-border);
    padding: var(--spacing-sm);
    text-align: left;
  }
  
  th {
    background-color: var(--color-surface);
    font-weight: 500;
  }
  
  a {
    color: var(--color-primary);
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const StreamingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-primary);
  font-size: var(--font-size-small);
`;

const TypingIndicator = styled.div`
  display: inline-block;
  width: 4px;
  height: 1em;
  background-color: var(--color-primary);
  animation: blink 1s infinite;
  
  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--color-text-secondary);
  text-align: center;
  padding: var(--spacing-xl);
`;

const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: var(--spacing-lg);
  background-color: color-mix(in srgb, var(--color-error) 10%, var(--color-surface));
  border: 2px solid var(--color-error);
  border-radius: 8px;
  margin: var(--spacing-md);
`;

const ErrorTitle = styled.h3`
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--color-error);
  font-size: var(--font-size-large);
  font-weight: 600;
`;

const ErrorMessage = styled.p`
  margin: 0 0 var(--spacing-md) 0;
  color: var(--color-text);
  font-size: var(--font-size-medium);
  line-height: 1.5;
`;

const ErrorDetails = styled.div`
  margin-top: var(--spacing-sm);
  padding: var(--spacing-sm);
  background-color: var(--color-surface);
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
  white-space: pre-wrap;
  word-break: break-word;
`;

const HelpfulLink = styled.a`
  color: var(--color-primary);
  text-decoration: none;
  margin-top: var(--spacing-sm);
  
  &:hover {
    text-decoration: underline;
  }
`;

interface ResponseWindowProps {
  response: AIResponse | null;
  isStreaming: boolean;
}

export const ResponseWindow: React.FC<ResponseWindowProps> = ({
  response,
  isStreaming
}) => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const { error } = useSelector((state: RootState) => state.conversations);
  const { errors } = useSelector((state: RootState) => state.errors);

  // Auto-scroll to bottom when new content arrives - optimized for streaming
  React.useEffect(() => {
    if (contentRef.current && isStreaming) {
      // Use requestAnimationFrame for smooth scrolling during streaming
      requestAnimationFrame(() => {
        if (contentRef.current) {
          contentRef.current.scrollTop = contentRef.current.scrollHeight;
        }
      });
    } else if (contentRef.current && response?.content) {
      // Immediate scroll when not streaming
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [response?.content, isStreaming, error]);

  // Get the most recent API error
  const apiError = errors.find(e => e.type === 'api' && !e.resolved);
  const displayError = error || apiError?.message || null;
  const errorDetails = apiError?.details;

  if (!response && !isStreaming && !displayError) {
    return (
      <ResponseContainer>
        <ResponseHeader>
          <ResponseTitle>AI Response</ResponseTitle>
        </ResponseHeader>
        <EmptyState>
          <h3>No response yet</h3>
          <p>Submit a query to see the AI response here</p>
        </EmptyState>
      </ResponseContainer>
    );
  }

  // Show error state
  if (displayError && !response?.content) {
    const isQuotaError = displayError.includes('quota') || displayError.includes('429');
    const isBillingError = displayError.includes('billing') || displayError.includes('plan');
    
    return (
      <ResponseContainer>
        <ResponseHeader>
          <ResponseTitle>Error</ResponseTitle>
        </ResponseHeader>
        <ResponseContent ref={contentRef}>
          <ErrorState>
            <ErrorTitle>⚠️ API Error</ErrorTitle>
            <ErrorMessage>{displayError}</ErrorMessage>
            
            {(isQuotaError || isBillingError) && (
              <>
                <ErrorMessage>
                  <strong>This is a billing/quota issue with your OpenAI account.</strong>
                </ErrorMessage>
                <ErrorMessage>
                  To fix this:
                </ErrorMessage>
                <ul style={{ margin: 'var(--spacing-sm) 0', paddingLeft: 'var(--spacing-lg)', color: 'var(--color-text)' }}>
                  <li>Go to <strong>https://platform.openai.com/account/billing</strong></li>
                  <li>Add payment information or check your usage limits</li>
                  <li>Make sure you have available credits/quota</li>
                  <li>Wait a few minutes after updating billing, then try again</li>
                </ul>
                <HelpfulLink href="https://platform.openai.com/account/billing" target="_blank" rel="noopener noreferrer">
                  → Open OpenAI Billing Settings
                </HelpfulLink>
              </>
            )}
            
            {errorDetails && (
              <ErrorDetails>
                {typeof errorDetails === 'string' ? errorDetails : JSON.stringify(errorDetails, null, 2)}
              </ErrorDetails>
            )}
          </ErrorState>
        </ResponseContent>
      </ResponseContainer>
    );
  }

  return (
    <ResponseContainer>
      <ResponseHeader>
        <ResponseTitle>AI Response</ResponseTitle>
        {isStreaming && (
          <StreamingIndicator>
            <TypingIndicator />
            Streaming...
          </StreamingIndicator>
        )}
      </ResponseHeader>
      
      <ResponseContent ref={contentRef}>
        <MarkdownContent>
          {/* Show content immediately as it streams in */}
          {response?.content ? (
            <ReactMarkdown
              components={{
                code({ node, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  return match ? (
                    <SyntaxHighlighter
                      style={oneDark as any}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {response.content}
            </ReactMarkdown>
          ) : isStreaming ? (
            <StreamingIndicator>
              <TypingIndicator />
              Waiting for response...
            </StreamingIndicator>
          ) : null}
          
          {isStreaming && response?.content && (
            <StreamingIndicator style={{ marginTop: '8px' }}>
              <TypingIndicator />
            </StreamingIndicator>
          )}
        </MarkdownContent>
      </ResponseContent>
    </ResponseContainer>
  );
};
