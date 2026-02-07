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
  Clock,
  IndianRupee
} from 'lucide-react';

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
      fetchStats();
    }
  }, [user, role]);

  const fetchStats = async () => {
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

  const statusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success/10 text-success';
      case 'pending': return 'bg-warning/10 text-warning';
      case 'approved': return 'bg-info/10 text-info';
      case 'returned': return 'bg-muted text-muted-foreground';
      case 'overdue': return 'bg-destructive/10 text-destructive';
      case 'rejected': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
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

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-2xl border border-border p-6 mb-8"
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

          {/* All Loans History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-2xl border border-border p-6"
          >
            <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <ClipboardList className="w-5 h-5" /> All Loan History
            </h2>

            {dataLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
                ))}
              </div>
            ) : loans.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No loan records yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">User</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Item</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Purpose</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Requested</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Due Date</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Fine</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loans.map((loan) => (
                      <tr key={loan.id} className="border-b border-border/50 hover:bg-muted/30">
                        <td className="py-3 px-4 text-foreground">
                          {loan.userName || 'Unknown'}
                        </td>
                        <td className="py-3 px-4 text-foreground">
                          {loan.tools?.name || loan.hardware_samples?.name || 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {loan.purpose || '—'}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-xs px-2 py-1 rounded-full capitalize ${statusColor(loan.status)}`}>
                            {loan.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {new Date(loan.requested_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {loan.due_date ? new Date(loan.due_date).toLocaleDateString() : '—'}
                        </td>
                        <td className="py-3 px-4 text-foreground">
                          {loan.fine_amount ? `₹${loan.fine_amount}` : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
