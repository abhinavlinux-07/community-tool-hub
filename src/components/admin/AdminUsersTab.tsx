import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Users,
  Shield,
  Building2,
  Stethoscope,
  User,
} from 'lucide-react';

type AppRole = 'community_member' | 'architect' | 'admin' | 'tool_doctor';

interface UserWithRole {
  id: string;
  email: string;
  full_name: string | null;
  organization: string | null;
  role: AppRole;
  roleId: string;
  created_at: string;
}

const roleConfig: Record<AppRole, { label: string; icon: typeof Users; cls: string }> = {
  community_member: { label: 'Community Member', icon: User, cls: 'bg-primary/10 text-primary' },
  architect: { label: 'Architect', icon: Building2, cls: 'bg-info/10 text-info' },
  tool_doctor: { label: 'Tool Doctor', icon: Stethoscope, cls: 'bg-warning/10 text-warning' },
  admin: { label: 'Admin', icon: Shield, cls: 'bg-destructive/10 text-destructive' },
};

const allRoles: AppRole[] = ['community_member', 'architect', 'tool_doctor', 'admin'];

export function AdminUsersTab() {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const [profilesRes, rolesRes] = await Promise.all([
      supabase.from('profiles').select('*'),
      supabase.from('user_roles').select('*'),
    ]);

    const profiles = profilesRes.data || [];
    const roles = rolesRes.data || [];

    const roleMap = new Map(roles.map(r => [r.user_id, r]));

    const usersWithRoles: UserWithRole[] = profiles.map(p => {
      const userRole = roleMap.get(p.id);
      return {
        id: p.id,
        email: p.email,
        full_name: p.full_name,
        organization: p.organization,
        role: (userRole?.role || 'community_member') as AppRole,
        roleId: userRole?.id || '',
        created_at: p.created_at,
      };
    });

    setUsers(usersWithRoles.sort((a, b) => a.email.localeCompare(b.email)));
    setLoading(false);
  };

  const handleRoleChange = async (userId: string, roleId: string, newRole: AppRole) => {
    setUpdatingId(userId);

    const { error } = await supabase
      .from('user_roles')
      .update({ role: newRole })
      .eq('id', roleId);

    setUpdatingId(null);

    if (error) {
      toast({
        title: 'Failed to update role',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Role updated',
        description: `User role changed to ${roleConfig[newRole].label}.`,
      });
      fetchUsers();
    }
  };

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
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
          <Users className="w-5 h-5" />
          All Users ({users.length})
        </h3>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No users found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Name</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Email</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Organization</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Current Role</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Change Role</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const config = roleConfig[u.role];
                const RoleIcon = config.icon;
                return (
                  <tr key={u.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="py-3 px-4 text-foreground font-medium">
                      {u.full_name || '—'}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{u.email}</td>
                    <td className="py-3 px-4 text-muted-foreground">{u.organization || '—'}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${config.cls}`}>
                        <RoleIcon className="w-3.5 h-3.5" />
                        {config.label}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, u.roleId, e.target.value as AppRole)}
                        disabled={updatingId === u.id}
                        className="text-sm border border-border rounded-lg px-2 py-1.5 bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                      >
                        {allRoles.map(r => (
                          <option key={r} value={r}>{roleConfig[r].label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
