import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BalanceCardProps {
  balance: number;
  transactionCount: number;
}

export function BalanceCard({ balance, transactionCount }: BalanceCardProps) {
  return (
    <Card className="border-2 border-bank-gold/30 shadow-xl bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground font-serif">
          Account Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-6">
          <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">
            Current Balance Owed
          </p>
          <p className="text-5xl md:text-6xl font-bold text-primary font-display">
            ${balance.toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Account Holder: <span className="font-semibold text-foreground">Griffin</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Total "One Sec" Violations: {transactionCount}
          </p>
        </div>
        <div className="border-t border-border pt-4 mt-4">
          <p className="text-xs text-muted-foreground text-center italic">
            Terms: $0.10 per "one sec" occurrence. No refunds. No appeals. No mercy.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
