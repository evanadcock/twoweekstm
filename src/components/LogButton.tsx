import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { Clock } from "lucide-react";

interface LogButtonProps {
  onLog: () => void;
  isLoading: boolean;
}

export function LogButton({ onLog, isLoading }: LogButtonProps) {
  const [isPulsing, setIsPulsing] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleClick = () => {
    // Play sound effect
    if (!audioRef.current) {
      audioRef.current = new Audio("/sounds/one-sec.mp3");
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {
      // Audio play failed, continue anyway
    });

    // Trigger pulse animation
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 600);

    // Log the occurrence
    onLog();
  };

  return (
    <div className="text-center">
      <Button
        onClick={handleClick}
        disabled={isLoading}
        size="lg"
        className={`
          bg-bank-gold hover:bg-bank-gold-light text-primary font-bold 
          text-lg px-8 py-6 h-auto rounded-lg shadow-lg
          transition-all duration-200 hover:scale-105
          ${isPulsing ? "pulse-gold" : ""}
        `}
      >
        <Clock className="w-5 h-5 mr-2" />
        {isLoading ? "Logging..." : 'Log a "One Sec"'}
      </Button>
      <p className="text-xs text-muted-foreground mt-3">
        +$0.10 will be added to Griffin's tab
      </p>
    </div>
  );
}
