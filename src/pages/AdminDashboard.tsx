import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { 
  Shield, 
  Users, 
  Wrench, 
  Package, 
  ClipboardList,
  AlertTriangle,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface DashboardStats {
  totalTools: number;
  totalHardware: number;
  activeLoans: number;
  pendingLoans: number;
  overdueLoans: number;
}

export default function AdminDashboard() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalTools: 0,
    totalHardware: 0,
    activeLoans: 0,
    pendingLoans: 0,
    overdueLoans: 0,
  });
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && (!user || role !== 'admin')) {
      navigate(user ? '/dashboard' : '/auth');
    }
  }, [user, role, loading, navigate]);

  useEffect(() => {
    if (user && role === 'admin') {
      fetchStats();
    }
  }, [user, role]);

  const fetchStats = async () => {
    setDataLoading(true);
    const [toolsRes, hardwareRes, loansRes] = await Promise.all([
      supabase.from('tools').select('id', { count: 'exact', head: true }),
      supabase.from('hardware_samples').select('id', { count: 'exact', head: true }),
      supabase.from('loans').select('status'),
    ]);

    const loans = loansRes.data || [];
    setStats({
      totalTools: toolsRes.count || 0,
      totalHardware: hardwareRes.count || 0,
      activeLoans: loans.filter(l => l.status === 'active').length,
      pendingLoans: loans.filter(l => l.status === 'pending').length,
      overdueLoans: loans.filter(l => l.status === 'overdue').length,
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-display font-bold text-foreground">Admin Dashboard</h1>
            </div>
            <p className="text-muted-foreground">Manage inventory, loans, and users.</p>
          </motion.div>

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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-2xl border border-border p-6"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <ClipboardList className="w-5 h-5" /> Quick Actions
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { icon: Users, label: 'Manage Users', desc: 'View and edit user roles' },
                { icon: Wrench, label: 'Manage Tools', desc: 'Add, edit, or retire tools' },
                { icon: Clock, label: 'Review Loans', desc: 'Approve or reject pending loans' },
              ].map((action) => (
                <div
                  key={action.label}
                  className="p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/50 transition-all cursor-pointer"
                >
                  <action.icon className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-medium text-foreground">{action.label}</h3>
                  <p className="text-sm text-muted-foreground">{action.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
