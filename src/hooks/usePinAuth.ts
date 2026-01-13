import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

const SESSION_KEY = 'onesec_bank_authenticated';

export const usePinAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Check session on mount
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem(SESSION_KEY);
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const verifyPin = useCallback(async (pin: string): Promise<boolean> => {
    setIsVerifying(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('verify-pin', {
        body: { pin }
      });

      if (fnError) {
        setError('Unable to verify PIN. Please try again.');
        setIsVerifying(false);
        return false;
      }

      if (data.success) {
        sessionStorage.setItem(SESSION_KEY, 'true');
        setIsAuthenticated(true);
        setIsVerifying(false);
        return true;
      } else {
        setError('Access Denied - Invalid PIN');
        setIsVerifying(false);
        return false;
      }
    } catch (err) {
      setError('Connection error. Please try again.');
      setIsVerifying(false);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isAuthenticated,
    isLoading,
    isVerifying,
    error,
    verifyPin,
    logout,
    clearError
  };
};
