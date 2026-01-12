import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import type { OneSecLog } from "@/hooks/useOneSecLogs";

interface TransactionHistoryProps {
  logs: OneSecLog[];
  isLoading: boolean;
}

export function TransactionHistory({ logs, isLoading }: TransactionHistoryProps) {
  // Calculate running balance (oldest to newest, then reverse for display)
  const logsWithBalance = [...logs].reverse().reduce<(OneSecLog & { runningBalance: number })[]>(
    (acc, log) => {
      const prevBalance = acc.length > 0 ? acc[acc.length - 1].runningBalance : 0;
      return [...acc, { ...log, runningBalance: prevBalance + Number(log.amount) }];
    },
    []
  ).reverse();

  return (
    <Card className="border-2 border-bank-gold/30 shadow-xl bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground font-serif">
          Transaction Ledger
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading transaction history...
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="italic">No violations recorded yet.</p>
            <p className="text-xs mt-2">Griffin's record is... suspiciously clean.</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-0">
              {/* Header row */}
              <div className="grid grid-cols-3 text-xs uppercase tracking-wider text-muted-foreground border-b-2 border-border pb-2 mb-2 font-semibold">
                <span>Date & Time</span>
                <span className="text-center">Amount</span>
                <span className="text-right">Balance</span>
              </div>
              
              {logsWithBalance.map((log) => (
                <div 
                  key={log.id} 
                  className="grid grid-cols-3 py-3 border-b border-border/50 text-sm hover:bg-muted/50 transition-colors"
                >
                  <span className="text-muted-foreground">
                    {format(new Date(log.created_at), "MMM d, yyyy")}
                    <br />
                    <span className="text-xs">{format(new Date(log.created_at), "h:mm:ss a")}</span>
                  </span>
                  <span className="text-center text-destructive font-medium">
                    +${Number(log.amount).toFixed(2)}
                  </span>
                  <span className="text-right font-semibold text-foreground">
                    ${log.runningBalance.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
