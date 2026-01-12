import { BankHeader } from "@/components/BankHeader";
import { BalanceCard } from "@/components/BalanceCard";
import { LogButton } from "@/components/LogButton";
import { TransactionHistory } from "@/components/TransactionHistory";
import { BankFooter } from "@/components/BankFooter";
import { useOneSecLogs } from "@/hooks/useOneSecLogs";

const Index = () => {
  const { logs, isLoading, totalBalance, addLog, isAdding } = useOneSecLogs();

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
