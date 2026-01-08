-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('community_member', 'architect', 'admin', 'tool_doctor');

-- Create enum for tool categories
CREATE TYPE public.tool_category AS ENUM ('power_tool', 'hand_tool', 'hardware_sample', 'measurement', 'safety_equipment');

-- Create enum for tool condition
CREATE TYPE public.tool_condition AS ENUM ('excellent', 'good', 'needs_repair', 'under_maintenance', 'retired');

-- Create enum for loan status
CREATE TYPE public.loan_status AS ENUM ('pending', 'approved', 'rejected', 'active', 'returned', 'overdue');

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    phone TEXT,
    organization TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'community_member',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE (user_id, role)
);

-- Create tools table
CREATE TABLE public.tools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    category tool_category NOT NULL,
    brand TEXT,
    model TEXT,
    image_url TEXT,
    specifications JSONB DEFAULT '{}',
    condition tool_condition DEFAULT 'good' NOT NULL,
    is_available BOOLEAN DEFAULT true NOT NULL,
    replacement_value DECIMAL(10,2),
    daily_rate DECIMAL(10,2) DEFAULT 0,
    co2_per_use DECIMAL(8,2) DEFAULT 0,
    total_loans INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create hardware_samples table (for B2B users)
CREATE TABLE public.hardware_samples (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    sample_type TEXT NOT NULL, -- hinges, channels, handles, fittings
    brand TEXT,
    model TEXT,
    image_url TEXT,
    specifications JSONB DEFAULT '{}',
    is_available BOOLEAN DEFAULT true NOT NULL,
    max_loan_hours INTEGER DEFAULT 72,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create loans table
CREATE TABLE public.loans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    tool_id UUID REFERENCES public.tools(id) ON DELETE SET NULL,
    hardware_sample_id UUID REFERENCES public.hardware_samples(id) ON DELETE SET NULL,
    status loan_status DEFAULT 'pending' NOT NULL,
    purpose TEXT,
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    approved_at TIMESTAMP WITH TIME ZONE,
    approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    returned_at TIMESTAMP WITH TIME ZONE,
    fine_amount DECIMAL(10,2) DEFAULT 0,
    feedback TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    CONSTRAINT loan_item_check CHECK (
        (tool_id IS NOT NULL AND hardware_sample_id IS NULL) OR 
        (tool_id IS NULL AND hardware_sample_id IS NOT NULL)
    )
);

-- Create maintenance_records table
CREATE TABLE public.maintenance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tool_id UUID REFERENCES public.tools(id) ON DELETE CASCADE NOT NULL,
    inspected_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    loan_id UUID REFERENCES public.loans(id) ON DELETE SET NULL,
    previous_condition tool_condition,
    new_condition tool_condition NOT NULL,
    notes TEXT,
    repair_cost DECIMAL(10,2),
    next_service_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create impact_metrics table (for tracking sustainability)
CREATE TABLE public.impact_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    total_loans INTEGER DEFAULT 0,
    money_saved DECIMAL(10,2) DEFAULT 0,
    co2_reduced DECIMAL(10,2) DEFAULT 0,
    community_score INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hardware_samples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impact_metrics ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = _user_id AND role = _role
    )
$$;

-- Function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT role FROM public.user_roles WHERE user_id = _user_id LIMIT 1
$$;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- User roles policies
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Tools policies (public read, admin write)
CREATE POLICY "Anyone can view tools" ON public.tools FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage tools" ON public.tools FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Hardware samples policies (only B2B and admin)
CREATE POLICY "Authenticated users can view hardware samples" ON public.hardware_samples FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage hardware samples" ON public.hardware_samples FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Loans policies
CREATE POLICY "Users can view their own loans" ON public.loans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create loans" ON public.loans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own loans" ON public.loans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all loans" ON public.loans FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update all loans" ON public.loans FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Maintenance records policies
CREATE POLICY "Tool doctors can view maintenance records" ON public.maintenance_records FOR SELECT USING (public.has_role(auth.uid(), 'tool_doctor') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Tool doctors can create maintenance records" ON public.maintenance_records FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'tool_doctor') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Tool doctors can update maintenance records" ON public.maintenance_records FOR UPDATE USING (public.has_role(auth.uid(), 'tool_doctor') OR public.has_role(auth.uid(), 'admin'));

-- Impact metrics policies
CREATE POLICY "Users can view their own metrics" ON public.impact_metrics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can update metrics" ON public.impact_metrics FOR ALL USING (auth.uid() = user_id);

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name');
    
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, COALESCE((NEW.raw_user_meta_data ->> 'role')::app_role, 'community_member'));
    
    INSERT INTO public.impact_metrics (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tools_updated_at BEFORE UPDATE ON public.tools FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_hardware_samples_updated_at BEFORE UPDATE ON public.hardware_samples FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_loans_updated_at BEFORE UPDATE ON public.loans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();