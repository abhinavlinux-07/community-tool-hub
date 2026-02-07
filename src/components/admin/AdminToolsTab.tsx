import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Wrench,
  Package,
  CheckCircle2,
  AlertTriangle,
  Clock,
  XCircle,
  Search,
} from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  brand: string | null;
  model: string | null;
  category: string;
  condition: string;
  is_available: boolean;
  daily_rate: number | null;
  total_loans: number | null;
}

interface HardwareSample {
  id: string;
  name: string;
  brand: string | null;
  model: string | null;
  sample_type: string;
  is_available: boolean;
  max_loan_hours: number | null;
}

const conditionConfig: Record<string, { label: string; cls: string; icon: typeof CheckCircle2 }> = {
  excellent: { label: 'Excellent', cls: 'bg-success/10 text-success', icon: CheckCircle2 },
  good: { label: 'Good', cls: 'bg-info/10 text-info', icon: CheckCircle2 },
  needs_repair: { label: 'Needs Repair', cls: 'bg-warning/10 text-warning', icon: AlertTriangle },
  under_maintenance: { label: 'Under Maintenance', cls: 'bg-info/10 text-info', icon: Clock },
  retired: { label: 'Retired', cls: 'bg-destructive/10 text-destructive', icon: XCircle },
};

export function AdminToolsTab() {
  const { toast } = useToast();
  const [tools, setTools] = useState<Tool[]>([]);
  const [hardware, setHardware] = useState<HardwareSample[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    const [toolsRes, hardwareRes] = await Promise.all([
      supabase.from('tools').select('id, name, brand, model, category, condition, is_available, daily_rate, total_loans').order('name'),
      supabase.from('hardware_samples').select('id, name, brand, model, sample_type, is_available, max_loan_hours').order('name'),
    ]);
    setTools((toolsRes.data || []) as Tool[]);
    setHardware((hardwareRes.data || []) as HardwareSample[]);
    setLoading(false);
  };

  const toggleAvailability = async (id: string, table: 'tools' | 'hardware_samples', currentAvailable: boolean) => {
    setUpdatingId(id);
    const { error } = await supabase
      .from(table)
      .update({ is_available: !currentAvailable })
      .eq('id', id);

    setUpdatingId(null);

    if (error) {
      toast({ title: 'Update failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: currentAvailable ? 'Marked unavailable' : 'Marked available' });
      fetchItems();
    }
  };

  const updateCondition = async (id: string, newCondition: string) => {
    setUpdatingId(id);
    const { error } = await supabase
      .from('tools')
      .update({ condition: newCondition as 'excellent' | 'good' | 'needs_repair' | 'under_maintenance' | 'retired' })
      .eq('id', id);

    setUpdatingId(null);

    if (error) {
      toast({ title: 'Update failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Condition updated' });
      fetchItems();
    }
  };

  const filteredTools = tools.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.brand?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredHardware = hardware.filter(h =>
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    h.brand?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search tools or hardware..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tools */}
      <div>
        <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <Wrench className="w-5 h-5 text-primary" />
          Tools ({filteredTools.length})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Name</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Brand</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Category</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Condition</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Rate</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Loans</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Available</th>
              </tr>
            </thead>
            <tbody>
              {filteredTools.map((tool) => {
                const cond = conditionConfig[tool.condition] || conditionConfig.good;
                const CondIcon = cond.icon;
                return (
                  <tr key={tool.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="py-3 px-4 text-foreground font-medium">{tool.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{tool.brand || '—'}</td>
                    <td className="py-3 px-4 text-muted-foreground capitalize">{tool.category.replace('_', ' ')}</td>
                    <td className="py-3 px-4">
                      <select
                        value={tool.condition}
                        onChange={(e) => updateCondition(tool.id, e.target.value)}
                        disabled={updatingId === tool.id}
                        className="text-xs border border-border rounded-lg px-2 py-1 bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        {Object.entries(conditionConfig).map(([key, val]) => (
                          <option key={key} value={key}>{val.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4 text-foreground">₹{tool.daily_rate || 0}/day</td>
                    <td className="py-3 px-4 text-muted-foreground">{tool.total_loans || 0}</td>
                    <td className="py-3 px-4">
                      <Button
                        size="sm"
                        variant={tool.is_available ? 'outline' : 'default'}
                        onClick={() => toggleAvailability(tool.id, 'tools', tool.is_available)}
                        disabled={updatingId === tool.id}
                        className="text-xs"
                      >
                        {tool.is_available ? 'Available' : 'Unavailable'}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hardware Samples */}
      <div>
        <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-info" />
          Hardware Samples ({filteredHardware.length})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Name</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Brand</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Type</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Max Hours</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Available</th>
              </tr>
            </thead>
            <tbody>
              {filteredHardware.map((hw) => (
                <tr key={hw.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="py-3 px-4 text-foreground font-medium">{hw.name}</td>
                  <td className="py-3 px-4 text-muted-foreground">{hw.brand || '—'}</td>
                  <td className="py-3 px-4 text-muted-foreground capitalize">{hw.sample_type}</td>
                  <td className="py-3 px-4 text-muted-foreground">{hw.max_loan_hours || '—'}h</td>
                  <td className="py-3 px-4">
                    <Button
                      size="sm"
                      variant={hw.is_available ? 'outline' : 'default'}
                      onClick={() => toggleAvailability(hw.id, 'hardware_samples', hw.is_available)}
                      disabled={updatingId === hw.id}
                      className="text-xs"
                    >
                      {hw.is_available ? 'Available' : 'Unavailable'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
