import { BankHeader } from "@/components/BankHeader";
import { BalanceCard } from "@/components/BalanceCard";
import { LogButton } from "@/components/LogButton";
import { TransactionHistory } from "@/components/TransactionHistory";
import { BankFooter } from "@/components/BankFooter";
import { useOneSecLogs } from "@/hooks/useOneSecLogs";
import { usePinAuth } from "@/hooks/usePinAuth";
import { PinLockScreen } from "@/components/PinLockScreen";

const Index = () => {
  const { logs, isLoading, totalBalance, addLog, isAdding } = useOneSecLogs();
  const { isAuthenticated, isLoading: authLoading, isVerifying, error, verifyPin, clearError } = usePinAuth();

  // Show loading state while checking session
  if (authLoading) {
    return (
      <div className="min-h-screen bg-bank-navy flex items-center justify-center">
        <div className="text-bank-gold animate-pulse">Loading...</div>
      </div>
    );
  }

  // Show PIN lock screen if not authenticated
  if (!isAuthenticated) {
    return (
      <PinLockScreen
        onVerify={verifyPin}
        isVerifying={isVerifying}
        error={error}
        onClearError={clearError}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <BankHeader />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <BalanceCard balance={totalBalance} transactionCount={logs.length} />
          
          <LogButton onLog={addLog} isLoading={isAdding} />
          
          <TransactionHistory logs={logs} isLoading={isLoading} />
        </div>
      </main>

      <BankFooter />
    </div>
  );
};

export default Index;
