import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { 
  Stethoscope, 
  Wrench, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  ClipboardList
} from 'lucide-react';

interface MaintenanceRecord {
  id: string;
  tool_id: string;
  new_condition: string;
  previous_condition: string | null;
  notes: string | null;
  created_at: string;
  next_service_date: string | null;
  repair_cost: number | null;
  tools: { name: string } | null;
}

export default function MaintenanceDashboard() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [toolsNeedingRepair, setToolsNeedingRepair] = useState(0);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && (!user || role !== 'tool_doctor')) {
      navigate(user ? '/dashboard' : '/auth');
    }
  }, [user, role, loading, navigate]);

  useEffect(() => {
    if (user && role === 'tool_doctor') {
      fetchData();
    }
  }, [user, role]);

  const fetchData = async () => {
    setDataLoading(true);
    const [recordsRes, repairRes] = await Promise.all([
      supabase
        .from('maintenance_records')
        .select('*, tools(name)')
        .order('created_at', { ascending: false })
        .limit(20),
      supabase
        .from('tools')
        .select('id', { count: 'exact', head: true })
        .eq('condition', 'needs_repair'),
    ]);

    setRecords(recordsRes.data || []);
    setToolsNeedingRepair(repairRes.count || 0);
    setDataLoading(false);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const upcomingService = records.filter(r => {
    if (!r.next_service_date) return false;
    const serviceDate = new Date(r.next_service_date);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return serviceDate <= nextWeek && serviceDate >= new Date();
  });

  const conditionIcon = (condition: string) => {
    switch (condition) {
      case 'excellent':
      case 'good':
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'needs_repair':
        return <AlertTriangle className="w-5 h-5 text-warning" />;
      case 'under_maintenance':
        return <Clock className="w-5 h-5 text-info" />;
      default:
        return <Wrench className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Stethoscope className="w-8 h-8 text-warning" />
              <h1 className="text-3xl font-display font-bold text-foreground">Tool Doctor Dashboard</h1>
            </div>
            <p className="text-muted-foreground">Inspect, maintain, and keep the library in top shape.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid sm:grid-cols-3 gap-4 mb-8"
          >
            {[
              { title: 'Needs Repair', value: toolsNeedingRepair, icon: AlertTriangle, cls: 'bg-warning/10 text-warning' },
              { title: 'Upcoming Service', value: upcomingService.length, icon: Clock, cls: 'bg-info/10 text-info' },
              { title: 'Total Inspections', value: records.length, icon: ClipboardList, cls: 'bg-primary/10 text-primary' },
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
            <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <ClipboardList className="w-5 h-5" /> Recent Maintenance Records
            </h2>

            {dataLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
                ))}
              </div>
            ) : records.length === 0 ? (
              <div className="text-center py-8">
                <Stethoscope className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No maintenance records yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {records.slice(0, 10).map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        {conditionIcon(record.new_condition)}
                      </div>
                       <div>
                        <p className="font-medium text-foreground">
                          {record.tools?.name || 'Unknown Tool'} — <span className="capitalize">{record.new_condition.replace('_', ' ')}</span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {record.notes || 'No notes'}
                          {record.repair_cost ? ` · Cost: ₹${record.repair_cost}` : ''}
                          {record.next_service_date ? ` · Next service: ${new Date(record.next_service_date).toLocaleDateString()}` : ''}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(record.created_at).toLocaleDateString()}
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
