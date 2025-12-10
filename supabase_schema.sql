-- Create Suppliers Table
CREATE TABLE public.suppliers (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT,
    location TEXT,
    contact_person TEXT,
    email TEXT,
    user_id UUID DEFAULT auth.uid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Suppliers
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

-- Create Policy: Users can only see their own suppliers
CREATE POLICY "Users can see their own suppliers" ON public.suppliers
    FOR ALL
    USING (auth.uid() = user_id);

-- Create Meetings Table
CREATE TABLE public.meetings (
    id TEXT PRIMARY KEY, -- Using TEXT to match the client-side generated UUID strings if needed, or UUID if consistent
    date TEXT NOT NULL,
    supplier_id UUID REFERENCES public.suppliers(id),
    supplier_name TEXT,
    supplier_code TEXT,
    participants JSONB,
    observations JSONB,
    executive_summary TEXT,
    user_id UUID DEFAULT auth.uid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Meetings
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

-- Create Policy: Users can only see their own meetings
CREATE POLICY "Users can see their own meetings" ON public.meetings
    FOR ALL
    USING (auth.uid() = user_id);
