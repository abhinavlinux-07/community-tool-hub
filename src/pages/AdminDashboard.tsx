import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { AdminLoansTab } from '@/components/admin/AdminLoansTab';
import { AdminUsersTab } from '@/components/admin/AdminUsersTab';
import { AdminToolsTab } from '@/components/admin/AdminToolsTab';
import { 
  Shield, 
  Users, 
  Wrench, 
  Package, 
  ClipboardList,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from 'lucide-react';

type AdminTab = 'overview' | 'loans' | 'users' | 'tools';

interface DashboardStats {
  totalTools: number;
  totalHardware: number;
  activeLoans: number;
  pendingLoans: number;
  overdueLoans: number;
}

interface LoanRecord {
  id: string;
  status: string;
  requested_at: string;
  due_date: string | null;
  returned_at: string | null;
  purpose: string | null;
  fine_amount: number | null;
  user_id: string;
  tool_id: string | null;
  hardware_sample_id: string | null;
  tools: { name: string } | null;
  hardware_samples: { name: string } | null;
  userName?: string;
}

interface UserProfile {
  id: string;
  full_name: string | null;
  email: string;
}

export default function AdminDashboard() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [stats, setStats] = useState<DashboardStats>({
    totalTools: 0,
    totalHardware: 0,
    activeLoans: 0,
    pendingLoans: 0,
    overdueLoans: 0,
  });
  const [loans, setLoans] = useState<LoanRecord[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && (!user || role !== 'admin')) {
      navigate(user ? '/dashboard' : '/auth');
    }
  }, [user, role, loading, navigate]);

  useEffect(() => {
    if (user && role === 'admin') {
      fetchData();
    }
  }, [user, role]);

  const fetchData = async () => {
    setDataLoading(true);
    const [toolsRes, hardwareRes, loansRes, profilesRes] = await Promise.all([
      supabase.from('tools').select('id', { count: 'exact', head: true }),
      supabase.from('hardware_samples').select('id', { count: 'exact', head: true }),
      supabase
        .from('loans')
        .select('*, tools(name), hardware_samples(name)')
        .order('requested_at', { ascending: false }),
      supabase.from('profiles').select('id, full_name, email'),
    ]);

    const profiles = (profilesRes.data || []) as UserProfile[];
    const profileMap = new Map(profiles.map(p => [p.id, p]));

    const allLoans = ((loansRes.data || []) as unknown as LoanRecord[]).map(loan => ({
      ...loan,
      userName: profileMap.get(loan.user_id)?.full_name || profileMap.get(loan.user_id)?.email || 'Unknown',
    }));
    setLoans(allLoans);
    setStats({
      totalTools: toolsRes.count || 0,
      totalHardware: hardwareRes.count || 0,
      activeLoans: allLoans.filter(l => l.status === 'active').length,
      pendingLoans: allLoans.filter(l => l.status === 'pending').length,
      overdueLoans: allLoans.filter(l => l.status === 'overdue').length,
    });
    setDataLoading(false);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Tools', value: stats.totalTools, icon: Wrench, color: 'primary' as const },
    { title: 'Hardware Samples', value: stats.totalHardware, icon: Package, color: 'info' as const },
    { title: 'Active Loans', value: stats.activeLoans, icon: CheckCircle2, color: 'success' as const },
    { title: 'Pending Approvals', value: stats.pendingLoans, icon: Clock, color: 'warning' as const },
    { title: 'Overdue', value: stats.overdueLoans, icon: AlertTriangle, color: 'destructive' as const },
  ];

  const colorClasses: Record<string, string> = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    info: 'bg-info/10 text-info',
    destructive: 'bg-destructive/10 text-destructive',
  };

  const tabs: { id: AdminTab; label: string; icon: typeof Users }[] = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'loans', label: 'Manage Loans', icon: ClipboardList },
    { id: 'users', label: 'Manage Users', icon: Users },
    { id: 'tools', label: 'Manage Inventory', icon: Wrench },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-display font-bold text-foreground">Admin Dashboard</h1>
            </div>
            <p className="text-muted-foreground">Manage inventory, loans, and users.</p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8"
          >
            {statCards.map((stat) => (
              <div key={stat.title} className="bg-card rounded-xl border border-border p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[stat.color]}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-xl font-bold text-foreground">
                      {dataLoading ? '…' : stat.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-2 mb-6 overflow-x-auto pb-2"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </motion.div>

          {/* Tab Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-2xl border border-border p-6"
          >
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <ClipboardList className="w-5 h-5" /> Quick Actions
                </h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { icon: ClipboardList, label: 'Review Loans', desc: `${stats.pendingLoans} pending approvals`, tab: 'loans' as AdminTab },
                    { icon: Users, label: 'Manage Users', desc: 'View and edit user roles', tab: 'users' as AdminTab },
                    { icon: Wrench, label: 'Manage Inventory', desc: `${stats.totalTools} tools, ${stats.totalHardware} samples`, tab: 'tools' as AdminTab },
                  ].map((action) => (
                    <button
                      key={action.label}
                      onClick={() => setActiveTab(action.tab)}
                      className="p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/50 transition-all cursor-pointer text-left"
                    >
                      <action.icon className="w-8 h-8 text-primary mb-3" />
                      <h3 className="font-medium text-foreground">{action.label}</h3>
                      <p className="text-sm text-muted-foreground">{action.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'loans' && (
              <AdminLoansTab loans={loans} loading={dataLoading} onRefresh={fetchData} />
            )}

            {activeTab === 'users' && (
              <AdminUsersTab />
            )}

            {activeTab === 'tools' && (
              <AdminToolsTab />
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
