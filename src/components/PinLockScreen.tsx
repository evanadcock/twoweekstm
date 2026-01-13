import { useState, useRef, useEffect } from 'react';
import { Shield, Lock } from 'lucide-react';
import griffinLogo from '@/assets/griffin-logo.jpg';

interface PinLockScreenProps {
  onVerify: (pin: string) => Promise<boolean>;
  isVerifying: boolean;
  error: string | null;
  onClearError: () => void;
}

export const PinLockScreen = ({ onVerify, isVerifying, error, onClearError }: PinLockScreenProps) => {
  const [pin, setPin] = useState<string[]>(['', '', '', '', '', '']);
  const [shake, setShake] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Trigger shake animation on error
  useEffect(() => {
    if (error) {
      setShake(true);
      const timer = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleInputChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    onClearError();
    
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits entered
    if (value && index === 5) {
      const fullPin = newPin.join('');
      handleSubmit(fullPin);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (!pin[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newPin = [...pin];
        newPin[index - 1] = '';
        setPin(newPin);
      }
    }
  };

  const handleSubmit = async (fullPin: string) => {
    const success = await onVerify(fullPin);
    if (!success) {
      // Clear PIN on failure
      setPin(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newPin = pastedData.split('').slice(0, 6);
      while (newPin.length < 6) newPin.push('');
      setPin(newPin);
      if (newPin.length === 6 && newPin.every(d => d)) {
        handleSubmit(newPin.join(''));
      }
    }
  };

  return (
    <div className="min-h-screen bg-bank-navy flex flex-col items-center justify-center p-4">
      {/* Security header */}
      <div className="absolute top-4 left-4 flex items-center gap-2 text-bank-gold/60">
        <Shield className="w-4 h-4" />
        <span className="text-xs font-mono">SECURE ACCESS PORTAL</span>
      </div>

      {/* Main content */}
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-bank-gold shadow-lg shadow-bank-gold/20">
            <img 
              src={griffinLogo} 
              alt="One Sec National Bank" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-serif text-bank-cream">One Sec National Bank</h1>
            <p className="text-bank-gold/60 text-sm mt-1">Secure Account Access</p>
          </div>
        </div>

        {/* PIN Entry Card */}
        <div className="bg-bank-navy-light border border-bank-gold/20 rounded-xl p-6 shadow-2xl">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Lock className="w-5 h-5 text-bank-gold" />
            <span className="text-bank-cream font-medium">Enter Your Security PIN</span>
          </div>

          {/* PIN Input */}
          <div 
            className={`flex justify-center gap-3 mb-6 ${shake ? 'animate-shake' : ''}`}
            onPaste={handlePaste}
          >
            {pin.map((digit, index) => (
              <input
                key={index}
                ref={(el) => inputRefs.current[index] = el}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={isVerifying}
                className="w-12 h-14 text-center text-xl font-mono bg-bank-navy border-2 border-bank-gold/30 
                  rounded-lg text-bank-cream focus:border-bank-gold focus:outline-none focus:ring-2 
                  focus:ring-bank-gold/20 transition-all disabled:opacity-50"
                aria-label={`PIN digit ${index + 1}`}
              />
            ))}
          </div>

          {/* Error message */}
          {error && (
            <div className="text-center mb-4">
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Loading state */}
          {isVerifying && (
            <div className="text-center">
              <p className="text-bank-gold text-sm animate-pulse">Verifying...</p>
            </div>
          )}

          {/* Hint */}
          <p className="text-center text-bank-cream/40 text-xs mt-4">
            Enter your 6-digit security PIN to access your account
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-bank-gold/40 text-xs">
          Protected by Griffin Security™
        </p>
      </div>

      {/* Add shake animation styles */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};
