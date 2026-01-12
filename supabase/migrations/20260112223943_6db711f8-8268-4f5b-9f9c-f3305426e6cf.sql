-- Create table to track "one sec" occurrences
CREATE TABLE public.one_sec_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  amount DECIMAL(10, 2) NOT NULL DEFAULT 0.10,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.one_sec_logs ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view all logs (public accountability!)
CREATE POLICY "Anyone can view logs" 
ON public.one_sec_logs 
FOR SELECT 
USING (true);

-- Allow anyone to insert new logs (no auth required for this fun app)
CREATE POLICY "Anyone can log a one sec" 
ON public.one_sec_logs 
FOR INSERT 
WITH CHECK (true);

-- Enable realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.one_sec_logs;