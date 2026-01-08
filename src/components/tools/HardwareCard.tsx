import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Check, 
  X, 
  Clock,
  Building2,
  Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HardwareSample {
  id: string;
  name: string;
  description: string | null;
  sample_type: string;
  brand: string | null;
  model: string | null;
  image_url: string | null;
  is_available: boolean;
  max_loan_hours: number | null;
}

export function HardwareCard({ hardware }: { hardware: HardwareSample }) {
  const { user, role } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isRequesting, setIsRequesting] = useState(false);

  const isB2BUser = role === 'architect' || role === 'admin';

  const handleRequest = async () => {
    if (!user) {
      navigate('/auth?mode=signup&role=architect');
      return;
    }

    if (!isB2BUser) {
      toast({
        title: 'B2B Access Required',
        description: 'Hardware samples are available for architects and designers only.',
        variant: 'destructive',
      });
      return;
    }

    setIsRequesting(true);
    
    // Calculate due date based on max loan hours
    const dueDate = new Date();
    dueDate.setHours(dueDate.getHours() + (hardware.max_loan_hours || 72));

    const { error } = await supabase.from('loans').insert({
      user_id: user.id,
      hardware_sample_id: hardware.id,
      status: 'pending',
      due_date: dueDate.toISOString(),
      purpose: 'B2B Trial',
    });

    setIsRequesting(false);

    if (error) {
      toast({
        title: 'Request failed',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Trial request submitted!',
        description: 'Your request is pending admin approval.',
      });
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="group bg-card rounded-2xl border border-border overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        {hardware.image_url ? (
          <img
            src={hardware.image_url}
            alt={hardware.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Building2 className="w-16 h-16 text-muted-foreground/30" />
          </div>
        )}
        
        {/* B2B Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="backdrop-blur-sm bg-info/90 text-info-foreground">
            <Building2 className="w-3 h-3 mr-1" />
            B2B Only
          </Badge>
        </div>

        {/* Availability Badge */}
        <div className="absolute top-3 right-3">
          <Badge 
            variant={hardware.is_available ? 'default' : 'secondary'}
            className={hardware.is_available ? 'bg-success text-success-foreground' : ''}
          >
            {hardware.is_available ? (
              <>
                <Check className="w-3 h-3 mr-1" />
                Available
              </>
            ) : (
              <>
                <X className="w-3 h-3 mr-1" />
                On Trial
              </>
            )}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Brand & Type */}
        <div className="flex items-center gap-2">
          {hardware.brand && (
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              {hardware.brand}
            </span>
          )}
          <Badge variant="outline" className="text-xs capitalize">
            {hardware.sample_type}
          </Badge>
        </div>

        {/* Name */}
        <h3 className="font-semibold text-foreground line-clamp-1">
          {hardware.name}
        </h3>

        {/* Description */}
        {hardware.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {hardware.description}
          </p>
        )}

        {/* Trial Duration */}
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>Max trial: {hardware.max_loan_hours || 72} hours</span>
        </div>

        {/* Action Button */}
        <Button
          variant={hardware.is_available && isB2BUser ? 'default' : 'secondary'}
          className="w-full mt-2"
          disabled={!hardware.is_available || isRequesting}
          onClick={handleRequest}
        >
          {isRequesting ? (
            'Requesting...'
          ) : !isB2BUser ? (
            'B2B Access Required'
          ) : hardware.is_available ? (
            <>
              <Calendar className="w-4 h-4 mr-2" />
              Request Trial
            </>
          ) : (
            'Currently On Trial'
          )}
        </Button>
      </div>
    </motion.div>
  );
}
