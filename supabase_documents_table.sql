-- Create documents table for storing user documents
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    template_slug VARCHAR(255) NOT NULL,
    template_title VARCHAR(255) NOT NULL,
    document_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries by user
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON public.documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON public.documents(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own documents
CREATE POLICY "Users can view own documents" ON public.documents
    FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own documents
CREATE POLICY "Users can insert own documents" ON public.documents
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own documents
CREATE POLICY "Users can update own documents" ON public.documents
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own documents
CREATE POLICY "Users can delete own documents" ON public.documents
    FOR DELETE USING (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_documents_updated_at 
    BEFORE UPDATE ON public.documents 
    FOR EACH ROW 
    EXECUTE PROCEDURE update_updated_at_column();

-- Function to enforce 10 document limit per user
CREATE OR REPLACE FUNCTION enforce_document_limit()
RETURNS TRIGGER AS $$
BEGIN
    -- Count current documents for this user
    IF (SELECT COUNT(*) FROM public.documents WHERE user_id = NEW.user_id) >= 10 THEN
        -- Delete the oldest document
        DELETE FROM public.documents 
        WHERE id = (
            SELECT id FROM public.documents 
            WHERE user_id = NEW.user_id 
            ORDER BY created_at ASC 
            LIMIT 1
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Trigger to enforce document limit
CREATE TRIGGER enforce_document_limit_trigger
    BEFORE INSERT ON public.documents
    FOR EACH ROW
    EXECUTE PROCEDURE enforce_document_limit();
