import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import DashboardStats from '@/components/admin/DashboardStats';
import ProgramsManager from '@/components/admin/ProgramsManager';
import StoriesManager from '@/components/admin/StoriesManager';
import GalleryManager from '@/components/admin/GalleryManager';
import EventsManager from '@/components/admin/EventsManager';
import DonationsManager from '@/components/admin/DonationsManager';
import VolunteersManager from '@/components/admin/VolunteersManager';
import ParticipantsManager from '@/components/admin/ParticipantsManager';
import ContentManager from '@/components/admin/ContentManager';
import SubscribersManager from '@/components/admin/SubscribersManager';

type AdminUser = {
  id: string;
  email: string;
  full_name: string;
  role: string;
  loginTime: string;
};

type ActiveTab = 'dashboard' | 'programs' | 'stories' | 'gallery' | 'events' | 'donations' | 'volunteers' | 'participants' | 'content' | 'subscribers';

const AdminDashboard = () => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate('/admin/login');
        return;
      }

      // Set admin user from Supabase session
      setAdminUser({
        id: session.user.id,
        email: session.user.email || '',
        full_name: session.user.user_metadata?.full_name || 'Admin',
        role: 'admin',
        loginTime: new Date().toISOString()
      });
      setIsLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!adminUser) {
    return null;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardStats />;
      case 'programs':
        return <ProgramsManager />;
      case 'stories':
        return <StoriesManager />;
      case 'gallery':
        return <GalleryManager />;
      case 'events':
        return <EventsManager />;
      case 'donations':
        return <DonationsManager />;
      case 'volunteers':
        return <VolunteersManager />;
      case 'participants':
        return <ParticipantsManager />;
      case 'content':
        return <ContentManager />;
      case 'subscribers':
        return <SubscribersManager />;
      default:
        return <DashboardStats />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader adminUser={adminUser} onLogout={handleLogout} />
      
      <div className="flex">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="flex-1 p-6 ml-64">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;