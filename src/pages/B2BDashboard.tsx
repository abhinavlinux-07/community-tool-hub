import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Package, 
  Clock, 
  CheckCircle2, 
  Wrench 
} from 'lucide-react';

interface Loan {
  id: string;
  status: string;
  due_date: string | null;
  requested_at: string;
  returned_at: string | null;
  purpose: string | null;
  tool_id: string | null;
  hardware_sample_id: string | null;
  tools: { name: string } | null;
  hardware_samples: { name: string } | null;
}

export default function B2BDashboard() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const [trials, setTrials] = useState<Loan[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && (!user || role !== 'architect')) {
      navigate(user ? '/dashboard' : '/auth');
    }
  }, [user, role, loading, navigate]);

  useEffect(() => {
    if (user && role === 'architect') {
      fetchTrials();
    }
  }, [user, role]);

  const fetchTrials = async () => {
    setDataLoading(true);
    const { data } = await supabase
      .from('loans')
      .select('*, tools(name), hardware_samples(name)')
      .eq('user_id', user!.id)
      .order('requested_at', { ascending: false });

    setTrials(data || []);
    setDataLoading(false);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const activeTrials = trials.filter(t => t.status === 'active');
  const pendingTrials = trials.filter(t => t.status === 'pending');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="w-8 h-8 text-info" />
              <h1 className="text-3xl font-display font-bold text-foreground">Architect Dashboard</h1>
            </div>
            <p className="text-muted-foreground">
              Manage your hardware sample trials for client projects.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid sm:grid-cols-3 gap-4 mb-8"
          >
            {[
              { title: 'Active Trials', value: activeTrials.length, icon: CheckCircle2, cls: 'bg-success/10 text-success' },
              { title: 'Pending Requests', value: pendingTrials.length, icon: Clock, cls: 'bg-warning/10 text-warning' },
              { title: 'Total Trials', value: trials.length, icon: Package, cls: 'bg-info/10 text-info' },
            ].map((stat) => (
              <div key={stat.title} className="bg-card rounded-xl border border-border p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.cls}`}>
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Your Trials</h2>
              <Link to="/browse?type=hardware">
                <Button variant="outline" size="sm">Browse Samples</Button>
              </Link>
            </div>

            {dataLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
                ))}
              </div>
            ) : trials.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No hardware trials yet</p>
                <Link to="/browse?type=hardware">
                  <Button variant="default" size="sm" className="mt-4">Request a Sample</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {trials.slice(0, 8).map((trial) => (
                  <div key={trial.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        trial.status === 'active' ? 'bg-success/10' : 'bg-warning/10'
                      }`}>
                        {trial.status === 'active' ? (
                          <CheckCircle2 className="w-5 h-5 text-success" />
                        ) : (
                          <Clock className="w-5 h-5 text-warning" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {trial.tools?.name || trial.hardware_samples?.name || trial.purpose || 'Hardware Trial'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {trial.purpose && <span className="mr-2">({trial.purpose})</span>}
                          Requested {new Date(trial.requested_at).toLocaleDateString()}
                          {trial.due_date && ` · Due: ${new Date(trial.due_date).toLocaleDateString()}`}
                          {trial.returned_at && ` · Returned: ${new Date(trial.returned_at).toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                      trial.status === 'active' ? 'bg-success/10 text-success' :
                      trial.status === 'pending' ? 'bg-warning/10 text-warning' :
                      trial.status === 'approved' ? 'bg-info/10 text-info' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {trial.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
