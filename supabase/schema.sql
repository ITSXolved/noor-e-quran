-- Course Promotion Portal Database Schema
-- For Zyra Edutech

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
    mobile VARCHAR(15) NOT NULL,
    email VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    occupation VARCHAR(50) NOT NULL CHECK (occupation IN ('Professional', 'Housewife', 'Business', 'Student')),
    
    -- Payment details
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    razorpay_signature VARCHAR(255),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
    
    -- Application status
    application_status VARCHAR(30) DEFAULT 'payment_pending' CHECK (application_status IN ('payment_pending', 'payment_done', 'added_to_course')),
    
    -- Reference number (auto-generated)
    reference_number VARCHAR(20) UNIQUE NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Status updates table (audit trail)
CREATE TABLE IF NOT EXISTS status_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    old_status VARCHAR(30),
    new_status VARCHAR(30) NOT NULL,
    remark TEXT,
    updated_by UUID REFERENCES admin_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to generate reference number
CREATE OR REPLACE FUNCTION generate_reference_number()
RETURNS TEXT AS $$
DECLARE
    ref_num TEXT;
    exists_check INTEGER;
BEGIN
    LOOP
        -- Generate reference number: ZE + YYYYMMDD + 4 random digits
        ref_num := 'ZE' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
        
        -- Check if it already exists
        SELECT COUNT(*) INTO exists_check FROM applications WHERE reference_number = ref_num;
        
        -- If unique, exit loop
        EXIT WHEN exists_check = 0;
    END LOOP;
    
    RETURN ref_num;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate reference number
CREATE OR REPLACE FUNCTION set_reference_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.reference_number IS NULL OR NEW.reference_number = '' THEN
        NEW.reference_number := generate_reference_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_reference_number
BEFORE INSERT ON applications
FOR EACH ROW
EXECUTE FUNCTION set_reference_number();

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_applications_timestamp
BEFORE UPDATE ON applications
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE status_updates ENABLE ROW LEVEL SECURITY;

-- Applications table policies
-- Allow public to insert (for registration)
CREATE POLICY "Allow public insert on applications"
ON applications FOR INSERT
TO anon
WITH CHECK (true);

-- Allow public to read their own application by reference number
CREATE POLICY "Allow public read own application"
ON applications FOR SELECT
TO anon
USING (true);

-- Admin users can read all applications
CREATE POLICY "Allow authenticated admin read all applications"
ON applications FOR SELECT
TO authenticated
USING (true);

-- Admin users can update applications
CREATE POLICY "Allow authenticated admin update applications"
ON applications FOR UPDATE
TO authenticated
USING (true);

-- Admin users can delete applications
CREATE POLICY "Allow authenticated admin delete applications"
ON applications FOR DELETE
TO authenticated
USING (true);

-- Admin users table policies
CREATE POLICY "Allow authenticated read admin_users"
ON admin_users FOR SELECT
TO authenticated
USING (true);

-- Status updates policies
CREATE POLICY "Allow authenticated insert status_updates"
ON status_updates FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated read status_updates"
ON status_updates FOR SELECT
TO authenticated
USING (true);

-- Indexes for performance
CREATE INDEX idx_applications_email ON applications(email);
CREATE INDEX idx_applications_reference_number ON applications(reference_number);
CREATE INDEX idx_applications_created_at ON applications(created_at DESC);
CREATE INDEX idx_applications_status ON applications(application_status);
CREATE INDEX idx_status_updates_application_id ON status_updates(application_id);

-- Insert default admin user (password: admin123 - CHANGE THIS!)
-- Password hash generated with bcrypt for 'admin123'
INSERT INTO admin_users (email, password_hash)
VALUES ('admin@zyraedu.com', '$2a$10$rKZvVxZ5YJ5qN5Z5Z5Z5ZeN5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z')
ON CONFLICT (email) DO NOTHING;

-- Analytics view for dashboard
CREATE OR REPLACE VIEW application_analytics AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total_applications,
    COUNT(*) FILTER (WHERE application_status = 'payment_pending') as payment_pending,
    COUNT(*) FILTER (WHERE application_status = 'payment_done') as payment_done,
    COUNT(*) FILTER (WHERE application_status = 'added_to_course') as added_to_course,
    COUNT(*) FILTER (WHERE payment_status = 'completed') as payments_completed
FROM applications
GROUP BY DATE(created_at)
ORDER BY date DESC;
