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
  Leaf, 
  Wrench,
  Cpu,
  Ruler,
  HardHat,
  Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Tool {
  id: string;
  name: string;
  description: string | null;
  category: string;
  brand: string | null;
  model: string | null;
  image_url: string | null;
  condition: string;
  is_available: boolean;
  daily_rate: number | null;
  co2_per_use: number | null;
}

const categoryIcons: Record<string, typeof Wrench> = {
  power_tool: Cpu,
  hand_tool: Wrench,
  measurement: Ruler,
  safety_equipment: HardHat,
};

const conditionColors: Record<string, string> = {
  excellent: 'bg-success/10 text-success',
  good: 'bg-info/10 text-info',
  needs_repair: 'bg-warning/10 text-warning',
  under_maintenance: 'bg-muted text-muted-foreground',
};

export function ToolCard({ tool }: { tool: Tool }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isRequesting, setIsRequesting] = useState(false);

  const CategoryIcon = categoryIcons[tool.category] || Wrench;

  const handleRequest = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setIsRequesting(true);
    
    // Calculate due date (7 days from now)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    const { error } = await supabase.from('loans').insert({
      user_id: user.id,
      tool_id: tool.id,
      status: 'pending',
      due_date: dueDate.toISOString(),
      purpose: 'General borrowing',
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
        title: 'Request submitted!',
        description: 'Your loan request is pending approval.',
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
        {tool.image_url ? (
          <img
            src={tool.image_url}
            alt={tool.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <CategoryIcon className="w-16 h-16 text-muted-foreground/30" />
          </div>
        )}
        
        {/* Availability Badge */}
        <div className="absolute top-3 right-3">
          <Badge 
            variant={tool.is_available ? 'default' : 'secondary'}
            className={tool.is_available ? 'bg-success text-success-foreground' : ''}
          >
            {tool.is_available ? (
              <>
                <Check className="w-3 h-3 mr-1" />
                Available
              </>
            ) : (
              <>
                <X className="w-3 h-3 mr-1" />
                On Loan
              </>
            )}
          </Badge>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="backdrop-blur-sm bg-background/80">
            <CategoryIcon className="w-3 h-3 mr-1" />
            {tool.category.replace('_', ' ')}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Brand & Model */}
        {tool.brand && (
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            {tool.brand} {tool.model && `• ${tool.model}`}
          </p>
        )}

        {/* Name */}
        <h3 className="font-semibold text-foreground line-clamp-1">
          {tool.name}
        </h3>

        {/* Description */}
        {tool.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {tool.description}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm">
          {tool.daily_rate !== null && tool.daily_rate > 0 && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <span className="font-medium">₹</span>
              <span>₹{tool.daily_rate}/day</span>
            </div>
          )}
          {tool.co2_per_use !== null && tool.co2_per_use > 0 && (
            <div className="flex items-center gap-1 text-success">
              <Leaf className="w-4 h-4" />
              <span>{tool.co2_per_use}kg saved</span>
            </div>
          )}
        </div>

        {/* Condition */}
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full capitalize ${conditionColors[tool.condition] || ''}`}>
            {tool.condition.replace('_', ' ')}
          </span>
        </div>

        {/* Action Button */}
        <Button
          variant={tool.is_available ? 'default' : 'secondary'}
          className="w-full mt-2"
          disabled={!tool.is_available || isRequesting}
          onClick={handleRequest}
        >
          {isRequesting ? (
            'Requesting...'
          ) : tool.is_available ? (
            <>
              <Calendar className="w-4 h-4 mr-2" />
              Request to Borrow
            </>
          ) : (
            'Currently Unavailable'
          )}
        </Button>
      </div>
    </motion.div>
  );
}
