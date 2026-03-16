  import React, { useEffect, useState } from 'react';
  import { useOfflineMode } from '../constants/OfflineModeContext';
  import { getQueueSize } from '../utils/smartRequest';

  export const OfflineToggleButton = () => {
    const { 
      isOfflineMode, 
      manualOfflineMode, 
      hasInternetConnection, 
      actualOnlineStatus,
      toggleOfflineMode 
    } = useOfflineMode();
    
    const [queueSize, setQueueSize] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
      const updateQueue = () => {
        try {
          setQueueSize(getQueueSize());
        } catch (error) {
          console.error('Failed to get queue size:', error);
        }
      };

      updateQueue();
      const interval = setInterval(updateQueue, 2000);
      return () => clearInterval(interval);
    }, []);

    if (!isOfflineMode) return null;

    let message = '';
    let backgroundColor = '#dc2626';
    let icon = '🔌';
    let canToggle = false;

    if (manualOfflineMode && hasInternetConnection) {
      message = 'Manual offline mode';
      backgroundColor = '#f59e0b';
      icon = '📴';
      canToggle = true;
    } else if (!actualOnlineStatus) {
      message = 'Network disconnected - Check WiFi/Cable';
      icon = '📡';
    } else if (!hasInternetConnection) {
      message = 'No internet - Router may be disconnected';
      icon = '🌐';
    } else {
      message = 'Offline mode';
    }

    return (
      <>
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor,
            color: 'white',
            padding: '12px 20px',
            zIndex: 9999,
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            display: isVisible ? 'flex' : 'none',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            flex: 1
          }}>
            <span style={{ fontSize: '18px' }}>{icon}</span>
            <span>{message}</span>
            
            {queueSize > 0 && (
              <span style={{
                background: 'rgba(255,255,255,0.2)',
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {queueSize} pending
              </span>
            )}
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px' 
          }}>
            {canToggle && (
              <button
                onClick={toggleOfflineMode}
                style={{
                  background: 'rgba(255,255,255,0.3)',
                  border: 'none',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.4)'}
                onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
              >
                Go Online
              </button>
            )}
            
            <button
              onClick={() => setIsVisible(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '18px',
                padding: '4px 8px',
                lineHeight: 1
              }}
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        </div>

        {isVisible && <div style={{ height: '48px', width: '100%' }} />}
      </>
    );
  };

  export const OfflineBadge = () => {
    const { isOfflineMode, manualOfflineMode } = useOfflineMode();

    if (!isOfflineMode) return null;

    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: manualOfflineMode ? '#f59e0b' : '#dc2626',
          color: 'white',
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '600'
        }}
      >
        <span>🔴</span>
        <span>Offline</span>
      </div>
    );
  };

  export const NetworkStatusWidget = () => {
    const { 
      isOfflineMode, 
      manualOfflineMode, 
      hasInternetConnection, 
      actualOnlineStatus,
      checkConnectivity 
    } = useOfflineMode();
    
    const [isChecking, setIsChecking] = useState(false);
    const [lastCheck, setLastCheck] = useState(null);

    const handleCheck = async () => {
      setIsChecking(true);
      try {
        await checkConnectivity();
        setLastCheck(new Date().toLocaleTimeString());
      } catch (error) {
        console.error('Connectivity check failed:', error);
      } finally {
        setIsChecking(false);
      }
    };

    return (
      <div style={{
        padding: '16px',
        background: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: '14px'
      }}>
        <h3 style={{ 
          margin: '0 0 12px 0', 
          fontSize: '16px',
          fontWeight: '600' 
        }}>
          Network Status
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <StatusRow 
            label="Overall Status" 
            value={isOfflineMode ? 'Offline' : 'Online'}
            isGood={!isOfflineMode}
          />
          <StatusRow 
            label="Network Interface" 
            value={actualOnlineStatus ? 'Connected' : 'Disconnected'}
            isGood={actualOnlineStatus}
          />
          <StatusRow 
            label="Internet Access" 
            value={hasInternetConnection ? 'Available' : 'Unavailable'}
            isGood={hasInternetConnection}
          />
          <StatusRow 
            label="Manual Mode" 
            value={manualOfflineMode ? 'Enabled' : 'Disabled'}
            isGood={!manualOfflineMode}
          />
        </div>

        <div style={{ 
          marginTop: '12px',
          paddingTop: '12px',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span style={{ fontSize: '12px', color: '#6b7280' }}>
            {lastCheck ? `Last checked: ${lastCheck}` : 'Not checked yet'}
          </span>
          <button
            onClick={handleCheck}
            disabled={isChecking}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: isChecking ? 'not-allowed' : 'pointer',
              fontSize: '13px',
              opacity: isChecking ? 0.6 : 1
            }}
          >
            {isChecking ? 'Checking...' : 'Check Now'}
          </button>
        </div>
      </div>
    );
  };

  const StatusRow = ({ label, value, isGood }) => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <span style={{ color: '#6b7280' }}>{label}:</span>
      <span style={{ 
        fontWeight: '600',
        color: isGood ? '#10b981' : '#dc2626'
      }}>
        {isGood ? '✓' : '✕'} {value}
      </span>
    </div>
  );

  export const NetworkAwareButton = ({ 
    onClick, 
    children, 
    disabled = false,
    showOfflineText = true,
    style = {},
    ...props 
  }) => {
    const { isOfflineMode } = useOfflineMode();
    const isDisabled = disabled || isOfflineMode;

    return (
      <button
        onClick={onClick}
        disabled={isDisabled}
        style={{
          opacity: isDisabled ? 0.5 : 1,
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          ...style
        }}
        title={isOfflineMode ? 'Unavailable in offline mode' : ''}
        {...props}
      >
        {children}
        {isOfflineMode && showOfflineText && ' (Offline)'}
      </button>
    );
  };

  export const useAPICall = (apiFunction) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const { isOfflineMode } = useOfflineMode();

    const execute = React.useCallback(async (...args) => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiFunction(...args);
        setData(result);
        return result;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    }, [apiFunction]);

    const reset = React.useCallback(() => {
      setLoading(false);
      setError(null);
      setData(null);
    }, []);

    return {
      execute,
      reset,
      loading,
      error,
      data,
      isOffline: isOfflineMode
    };
  };

  export default OfflineToggleButton;