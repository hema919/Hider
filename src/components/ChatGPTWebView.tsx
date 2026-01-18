import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useDispatch } from 'react-redux';
import { Button } from '../core-components/Button';
import { setCurrentView } from '../slices/appSlice';

// Helper to get electron API with ChatGPT methods
const getElectronAPI = () => {
  return (window as any).electronAPI as {
    showChatGPTView?: () => Promise<{ success: boolean; error?: string }>;
    hideChatGPTView?: () => Promise<{ success: boolean; error?: string }>;
  } | undefined;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: var(--color-background);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  z-index: 10;
`;

const Title = styled.h2`
  margin: 0;
  font-size: var(--font-size-large);
  font-weight: 600;
  color: var(--color-text);
`;

const InfoText = styled.p`
  margin: 0;
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
  font-style: italic;
`;

const WebViewContainer = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
  background-color: var(--color-background);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InfoBox = styled.div`
  padding: var(--spacing-xl);
  text-align: center;
  max-width: 600px;
  background-color: var(--color-surface);
  border-radius: 8px;
  border: 1px solid var(--color-border);
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--color-background);
  color: var(--color-text);
  z-index: 5;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  margin-top: var(--spacing-md);
  color: var(--color-text-secondary);
`;

export const ChatGPTWebView: React.FC = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    // Show ChatGPT BrowserView when component mounts
    const showView = async () => {
      setIsLoading(true);
      setHasError(false);
      
      const electronAPI = getElectronAPI();
      if (electronAPI?.showChatGPTView) {
        try {
          const result = await electronAPI.showChatGPTView();
          if (result.success) {
            setIsLoading(false);
            // BrowserView is now showing, hide loading after a moment
            setTimeout(() => setIsLoading(false), 1000);
          } else {
            setIsLoading(false);
            setHasError(true);
            setErrorMessage(result.error || 'Failed to load ChatGPT');
          }
        } catch (error) {
          setIsLoading(false);
          setHasError(true);
          setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
        }
      } else {
        // Fallback: try iframe (will likely fail but show error)
        setIsLoading(false);
        setHasError(true);
        setErrorMessage('Electron API not available. Please use the desktop app.');
      }
    };

    showView();

    // Cleanup: hide BrowserView when component unmounts
    return () => {
      const electronAPI = getElectronAPI();
      if (electronAPI?.hideChatGPTView) {
        electronAPI.hideChatGPTView().catch(console.error);
      }
    };
  }, []);

  const handleRetry = async () => {
    setIsLoading(true);
    setHasError(false);
    
    const electronAPI = getElectronAPI();
    if (electronAPI?.showChatGPTView) {
      try {
        const result = await electronAPI.showChatGPTView();
        if (result.success) {
          setIsLoading(false);
        } else {
          setIsLoading(false);
          setHasError(true);
          setErrorMessage(result.error || 'Failed to load ChatGPT');
        }
      } catch (error) {
        setIsLoading(false);
        setHasError(true);
        setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
      }
    }
  };

  return (
    <Container>
      <Header>
        <div>
          <Title>ChatGPT Web Interface</Title>
          <InfoText>
            💡 This ChatGPT window will be hidden when you share your screen - just like the rest of the app!
          </InfoText>
        </div>
        <Button variant="outlined" onClick={() => dispatch(setCurrentView('main'))}>
          ⬅ Back to App
        </Button>
      </Header>
      
      <WebViewContainer>
        {isLoading && (
          <InfoBox>
            <LoadingSpinner style={{ margin: '0 auto' }} />
            <LoadingText>Loading ChatGPT...</LoadingText>
            <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-sm)', fontSize: '0.9em' }}>
              ChatGPT will appear in the window below
            </p>
          </InfoBox>
        )}
        
        {hasError && (
          <InfoBox>
            <h3 style={{ color: 'var(--color-error)', marginTop: 0 }}>Failed to load ChatGPT</h3>
            <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-md)' }}>
              {errorMessage || 'Please check your internet connection and try again.'}
            </p>
            <div style={{ marginTop: 'var(--spacing-md)' }}>
              <Button variant="primary" onClick={handleRetry}>
                Retry
              </Button>
            </div>
          </InfoBox>
        )}
        
        {!isLoading && !hasError && (
          <InfoBox>
            <h3 style={{ color: 'var(--color-success)', marginTop: 0 }}>✓ ChatGPT is now visible</h3>
            <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-md)' }}>
              ChatGPT should be displayed in the window. If you don't see it, try clicking "Retry" or check your internet connection.
            </p>
            <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-sm)', fontSize: '0.9em', fontStyle: 'italic' }}>
              💡 Remember: This ChatGPT window will be hidden when you share your screen!
            </p>
          </InfoBox>
        )}
      </WebViewContainer>
    </Container>
  );
};
