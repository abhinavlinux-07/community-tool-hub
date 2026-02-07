import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Package,
  AlertTriangle,
} from 'lucide-react';

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

interface AdminLoansTabProps {
  loans: LoanRecord[];
  loading: boolean;
  onRefresh: () => void;
}

export function AdminLoansTab({ loans, loading, onRefresh }: AdminLoansTabProps) {
  const { toast } = useToast();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleLoanAction = async (loanId: string, action: 'approved' | 'rejected' | 'active' | 'returned') => {
    setActionLoading(loanId);
    
    const updateData: Record<string, unknown> = { status: action };
    
    if (action === 'approved') {
      updateData.approved_at = new Date().toISOString();
    }
    if (action === 'active') {
      updateData.approved_at = new Date().toISOString();
    }
    if (action === 'returned') {
      updateData.returned_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('loans')
      .update(updateData)
      .eq('id', loanId);

    setActionLoading(null);

    if (error) {
      toast({
        title: 'Action failed',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Loan updated',
        description: `Loan has been ${action} successfully.`,
      });
      onRefresh();
    }
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

  const statusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle2 className="w-4 h-4 text-success" />;
      case 'pending': return <Clock className="w-4 h-4 text-warning" />;
      case 'overdue': return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case 'returned': return <Package className="w-4 h-4 text-muted-foreground" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-destructive" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const pendingLoans = loans.filter(l => l.status === 'pending');
  const activeLoans = loans.filter(l => l.status === 'active' || l.status === 'approved');
  const completedLoans = loans.filter(l => l.status === 'returned' || l.status === 'rejected');

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Pending Approvals */}
      {pendingLoans.length > 0 && (
        <div>
          <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-warning" />
            Pending Approvals ({pendingLoans.length})
          </h3>
          <div className="space-y-3">
            {pendingLoans.map((loan) => (
              <div key={loan.id} className="flex items-center justify-between p-4 rounded-xl border border-warning/30 bg-warning/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {loan.tools?.name || loan.hardware_samples?.name || 'Unknown Item'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      By {loan.userName} · {loan.purpose || 'No purpose specified'} · Requested {new Date(loan.requested_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-destructive border-destructive/30 hover:bg-destructive/10"
                    onClick={() => handleLoanAction(loan.id, 'rejected')}
                    disabled={actionLoading === loan.id}
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleLoanAction(loan.id, 'active')}
                    disabled={actionLoading === loan.id}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    {actionLoading === loan.id ? 'Processing...' : 'Approve'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Loans */}
      {activeLoans.length > 0 && (
        <div>
          <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-success" />
            Active Loans ({activeLoans.length})
          </h3>
          <div className="space-y-3">
            {activeLoans.map((loan) => (
              <div key={loan.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {loan.tools?.name || loan.hardware_samples?.name || 'Unknown Item'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      By {loan.userName} · Due: {loan.due_date ? new Date(loan.due_date).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleLoanAction(loan.id, 'returned')}
                  disabled={actionLoading === loan.id}
                >
                  <Package className="w-4 h-4 mr-1" />
                  {actionLoading === loan.id ? 'Processing...' : 'Mark Returned'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed / All History */}
      <div>
        <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-muted-foreground" />
          All Loan History ({loans.length})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">User</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Item</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Purpose</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Requested</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Due</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Fine</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <tr key={loan.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="py-3 px-4 text-foreground">{loan.userName || 'Unknown'}</td>
                  <td className="py-3 px-4 text-foreground">
                    {loan.tools?.name || loan.hardware_samples?.name || 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{loan.purpose || '—'}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full capitalize ${statusColor(loan.status)}`}>
                      {statusIcon(loan.status)}
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
      </div>

      {loans.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No loan records found</p>
        </div>
      )}
    </div>
  );
}
