import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { 
  Wrench, 
  Clock, 
  AlertCircle, 
  Leaf, 
  IndianRupee,
  TrendingUp,
  Package,
  Calendar,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Loan {
  id: string;
  status: string;
  due_date: string | null;
  requested_at: string;
  tool_id: string | null;
  hardware_sample_id: string | null;
}

interface ImpactMetrics {
  total_loans: number;
  money_saved: number;
  co2_reduced: number;
  community_score: number;
}

export default function Dashboard() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [metrics, setMetrics] = useState<ImpactMetrics | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setDataLoading(true);
    
    const [loansResult, metricsResult] = await Promise.all([
      supabase
        .from('loans')
        .select('*')
        .eq('user_id', user!.id)
        .order('requested_at', { ascending: false }),
      supabase
        .from('impact_metrics')
        .select('*')
        .eq('user_id', user!.id)
        .single(),
    ]);

    if (loansResult.data) {
      setLoans(loansResult.data);
    }
    if (metricsResult.data) {
      setMetrics(metricsResult.data);
    }
    
    setDataLoading(false);
  };

  const activeLoans = loans.filter(l => l.status === 'active');
  const pendingLoans = loans.filter(l => l.status === 'pending');
  const dueTodayLoans = activeLoans.filter(l => {
    if (!l.due_date) return false;
    const due = new Date(l.due_date);
    const today = new Date();
    return due.toDateString() === today.toDateString();
  });

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">
              Welcome back! 👋
            </h1>
            <p className="text-muted-foreground">
              Here's an overview of your tool borrowing activity and community impact.
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            <StatsCard
              title="Active Loans"
              value={activeLoans.length}
              icon={Package}
              color="primary"
            />
            <StatsCard
              title="Due Today"
              value={dueTodayLoans.length}
              icon={AlertCircle}
              color={dueTodayLoans.length > 0 ? 'warning' : 'success'}
            />
            <StatsCard
              title="Money Saved"
              value={`₹${metrics?.money_saved?.toFixed(0) || 0}`}
              icon={IndianRupee}
              color="success"
            />
            <StatsCard
              title="CO₂ Reduced"
              value={`${metrics?.co2_reduced?.toFixed(1) || 0}kg`}
              icon={Leaf}
              color="success"
            />
          </motion.div>

          {/* Community Impact Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-hero rounded-2xl p-6 mb-8 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-white/80 mb-1">Community Impact Score</h3>
                <div className="text-4xl font-display font-bold">
                  {metrics?.community_score || 0}
                </div>
                <p className="text-white/60 text-sm mt-1">
                  Based on your borrowing history and on-time returns
                </p>
              </div>
              <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center">
                <TrendingUp className="w-10 h-10" />
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Active & Pending Loans */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card rounded-2xl border border-border p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">Your Loans</h2>
                <Link to="/browse">
                  <Button variant="outline" size="sm">
                    Browse Tools
                  </Button>
                </Link>
              </div>

              {dataLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : loans.length === 0 ? (
                <div className="text-center py-8">
                  <Wrench className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No loans yet</p>
                  <Link to="/browse">
                    <Button variant="default" size="sm" className="mt-4">
                      Start Borrowing
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {loans.slice(0, 5).map((loan) => (
                    <div 
                      key={loan.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          loan.status === 'active' ? 'bg-success/10' :
                          loan.status === 'pending' ? 'bg-warning/10' :
                          loan.status === 'returned' ? 'bg-muted' : 'bg-muted'
                        }`}>
                          {loan.status === 'active' ? (
                            <CheckCircle2 className="w-5 h-5 text-success" />
                          ) : loan.status === 'pending' ? (
                            <Clock className="w-5 h-5 text-warning" />
                          ) : (
                            <Package className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground capitalize">
                            {loan.tool_id ? 'Tool Loan' : 'Hardware Trial'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {loan.due_date 
                              ? `Due: ${new Date(loan.due_date).toLocaleDateString()}`
                              : 'No due date'}
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                        loan.status === 'active' ? 'bg-success/10 text-success' :
                        loan.status === 'pending' ? 'bg-warning/10 text-warning' :
                        loan.status === 'approved' ? 'bg-info/10 text-info' :
                        loan.status === 'returned' ? 'bg-muted text-muted-foreground' :
                        'bg-destructive/10 text-destructive'
                      }`}>
                        {loan.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card rounded-2xl border border-border p-6"
            >
              <h2 className="text-lg font-semibold text-foreground mb-6">Quick Actions</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <Link to="/browse" className="block">
                  <div className="p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/50 transition-all cursor-pointer">
                    <Wrench className="w-8 h-8 text-primary mb-3" />
                    <h3 className="font-medium text-foreground">Browse Tools</h3>
                    <p className="text-sm text-muted-foreground">Find your next project tool</p>
                  </div>
                </Link>
                
                <Link to="/browse?type=hardware" className="block">
                  <div className="p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/50 transition-all cursor-pointer">
                    <Package className="w-8 h-8 text-info mb-3" />
                    <h3 className="font-medium text-foreground">Hardware Samples</h3>
                    <p className="text-sm text-muted-foreground">Trial before you buy</p>
                  </div>
                </Link>
                
                <div className="p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/50 transition-all cursor-pointer">
                  <Calendar className="w-8 h-8 text-warning mb-3" />
                  <h3 className="font-medium text-foreground">Loan History</h3>
                  <p className="text-sm text-muted-foreground">View past borrowings</p>
                </div>
                
                <div className="p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/50 transition-all cursor-pointer">
                  <Leaf className="w-8 h-8 text-success mb-3" />
                  <h3 className="font-medium text-foreground">My Impact</h3>
                  <p className="text-sm text-muted-foreground">Track your sustainability</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  color 
}: { 
  title: string; 
  value: string | number; 
  icon: typeof Wrench;
  color: 'primary' | 'success' | 'warning' | 'info';
}) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    info: 'bg-info/10 text-info',
  };

  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-xl font-bold text-foreground">{value}</p>
        </div>
      </div>
    </div>
  );
}
