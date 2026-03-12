
-- Create website_hero table
CREATE TABLE IF NOT EXISTS public.website_hero (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_name text UNIQUE NOT NULL DEFAULT 'hero',
  title text,
  subtitle text,
  description text,
  cta_primary text,
  cta_secondary text,
  background_image_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create website_stats table
CREATE TABLE IF NOT EXISTS public.website_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_name text UNIQUE NOT NULL DEFAULT 'stats',
  programs_count integer DEFAULT 0,
  beneficiaries_count integer DEFAULT 0,
  volunteers_count integer DEFAULT 0,
  events_count integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create website_mission table
CREATE TABLE IF NOT EXISTS public.website_mission (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_name text UNIQUE NOT NULL DEFAULT 'mission',
  mission_title text,
  mission_description text,
  vision_title text,
  vision_description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create website_contact table
CREATE TABLE IF NOT EXISTS public.website_contact (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_name text UNIQUE NOT NULL DEFAULT 'contact',
  email text,
  phone text,
  address text,
  office_hours text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create subscribers table
CREATE TABLE IF NOT EXISTS public.subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  subscribed_at timestamptz NOT NULL DEFAULT now(),
  is_active boolean NOT NULL DEFAULT true,
  unsubscribed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create participants table
CREATE TABLE IF NOT EXISTS public.participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  age integer,
  gender text,
  location text,
  interests text[] DEFAULT '{}',
  programs_of_interest text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'active',
  registration_date date DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- RLS policies for website_hero
ALTER TABLE public.website_hero ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read website_hero" ON public.website_hero FOR SELECT USING (true);
CREATE POLICY "Authenticated users have full access to website_hero" ON public.website_hero FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- RLS policies for website_stats
ALTER TABLE public.website_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read website_stats" ON public.website_stats FOR SELECT USING (true);
CREATE POLICY "Authenticated users have full access to website_stats" ON public.website_stats FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- RLS policies for website_mission
ALTER TABLE public.website_mission ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read website_mission" ON public.website_mission FOR SELECT USING (true);
CREATE POLICY "Authenticated users have full access to website_mission" ON public.website_mission FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- RLS policies for website_contact
ALTER TABLE public.website_contact ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read website_contact" ON public.website_contact FOR SELECT USING (true);
CREATE POLICY "Authenticated users have full access to website_contact" ON public.website_contact FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- RLS policies for subscribers
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users have full access to subscribers" ON public.subscribers FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- RLS policies for participants
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read participants" ON public.participants FOR SELECT USING (true);
CREATE POLICY "Authenticated users have full access to participants" ON public.participants FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Add updated_at triggers
CREATE TRIGGER update_website_hero_updated_at BEFORE UPDATE ON public.website_hero FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_website_stats_updated_at BEFORE UPDATE ON public.website_stats FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_website_mission_updated_at BEFORE UPDATE ON public.website_mission FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_website_contact_updated_at BEFORE UPDATE ON public.website_contact FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_subscribers_updated_at BEFORE UPDATE ON public.subscribers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_participants_updated_at BEFORE UPDATE ON public.participants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed default data
INSERT INTO public.website_hero (section_name, title, subtitle, description, cta_primary, cta_secondary)
VALUES ('hero', 'Garuda Dhruvam Foundation', 'Empowering Communities, Transforming Lives', 'We are dedicated to creating sustainable change through education, healthcare, and community development programs across India.', 'Join the Movement', 'Learn More')
ON CONFLICT (section_name) DO NOTHING;

INSERT INTO public.website_stats (section_name, programs_count, beneficiaries_count, volunteers_count, events_count)
VALUES ('stats', 15, 5000, 200, 50)
ON CONFLICT (section_name) DO NOTHING;

INSERT INTO public.website_mission (section_name, mission_title, mission_description, vision_title, vision_description)
VALUES ('mission', 'Our Mission', 'To empower underprivileged communities through sustainable development programs in education, healthcare, and livelihood.', 'Our Vision', 'A world where every individual has access to quality education, healthcare, and opportunities for growth.')
ON CONFLICT (section_name) DO NOTHING;

INSERT INTO public.website_contact (section_name, email, phone, address, office_hours)
VALUES ('contact', 'info@garudadhruvam.org', '+91 9876543210', 'Hyderabad, Telangana, India', 'Mon-Sat: 9AM - 6PM')
ON CONFLICT (section_name) DO NOTHING;
