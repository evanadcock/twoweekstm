import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export interface OneSecLog {
  id: string;
  amount: number;
  created_at: string;
}

export function useOneSecLogs() {
  const queryClient = useQueryClient();

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ["one-sec-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("one_sec_logs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as OneSecLog[];
    },
  });

  const addLogMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from("one_sec_logs")
        .insert({ amount: 0.10 })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["one-sec-logs"] });
    },
  });

  // Subscribe to realtime updates
  useEffect(() => {
    const channel = supabase
      .channel("one-sec-logs-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "one_sec_logs",
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["one-sec-logs"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const totalBalance = logs.reduce((sum, log) => sum + Number(log.amount), 0);

  return {
    logs,
    isLoading,
    totalBalance,
    addLog: addLogMutation.mutate,
    isAdding: addLogMutation.isPending,
  };
}
