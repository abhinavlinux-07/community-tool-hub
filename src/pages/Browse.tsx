import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { ToolCard } from '@/components/tools/ToolCard';
import { HardwareCard } from '@/components/tools/HardwareCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { 
  Search, 
  Filter,
  Wrench,
  Cpu,
  Ruler,
  HardHat,
  Package,
  SlidersHorizontal
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

type ToolCategory = 'power_tool' | 'hand_tool' | 'hardware_sample' | 'measurement' | 'safety_equipment';

interface Tool {
  id: string;
  name: string;
  description: string | null;
  category: ToolCategory;
  brand: string | null;
  model: string | null;
  image_url: string | null;
  condition: string;
  is_available: boolean;
  daily_rate: number | null;
  co2_per_use: number | null;
}

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

const categories = [
  { id: 'all', label: 'All Items', icon: Package },
  { id: 'power_tool', label: 'Power Tools', icon: Cpu },
  { id: 'hand_tool', label: 'Hand Tools', icon: Wrench },
  { id: 'measurement', label: 'Measurement', icon: Ruler },
  { id: 'safety_equipment', label: 'Safety', icon: HardHat },
  { id: 'hardware', label: 'Hardware Samples', icon: SlidersHorizontal },
];

export default function Browse() {
  const [searchParams] = useSearchParams();
  const [tools, setTools] = useState<Tool[]>([]);
  const [hardware, setHardware] = useState<HardwareSample[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('type') === 'hardware' ? 'hardware' : 'all'
  );
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    
    const [toolsResult, hardwareResult] = await Promise.all([
      supabase.from('tools').select('*').order('name'),
      supabase.from('hardware_samples').select('*').order('name'),
    ]);

    if (toolsResult.data) {
      setTools(toolsResult.data as Tool[]);
    }
    if (hardwareResult.data) {
      setHardware(hardwareResult.data as HardwareSample[]);
    }
    
    setLoading(false);
  };

  const filteredTools = tools.filter((tool) => {
    const matchesSearch = 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'all' || 
      selectedCategory === 'hardware' ||
      tool.category === selectedCategory;
    
    const matchesAvailability = !showAvailableOnly || tool.is_available;
    
    return matchesSearch && matchesCategory && matchesAvailability;
  });

  const filteredHardware = hardware.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sample_type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || selectedCategory === 'hardware';
    const matchesAvailability = !showAvailableOnly || item.is_available;
    
    return matchesSearch && matchesCategory && matchesAvailability;
  });

  const showTools = selectedCategory !== 'hardware';
  const showHardware = selectedCategory === 'all' || selectedCategory === 'hardware';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Browse Our Library
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find the perfect tool for your project. All items are maintained by our Tool Doctors 
              and ready for immediate borrowing.
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 space-y-4"
          >
            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search tools, brands, or descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="gap-2"
                >
                  <category.icon className="w-4 h-4" />
                  {category.label}
                </Button>
              ))}
            </div>

            {/* Availability Filter */}
            <div className="flex justify-center">
              <Button
                variant={showAvailableOnly ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setShowAvailableOnly(!showAvailableOnly)}
                className="gap-2"
              >
                <Filter className="w-4 h-4" />
                {showAvailableOnly ? 'Showing Available Only' : 'Show Available Only'}
              </Button>
            </div>
          </motion.div>

          {/* Results */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-80 rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-12">
              {/* Tools Section */}
              {showTools && filteredTools.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-primary" />
                    Tools ({filteredTools.length})
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredTools.map((tool, index) => (
                      <motion.div
                        key={tool.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <ToolCard tool={tool} />
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              {/* Hardware Samples Section */}
              {showHardware && filteredHardware.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-primary" />
                    Hardware Samples ({filteredHardware.length})
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredHardware.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <HardwareCard hardware={item} />
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              {/* No Results */}
              {filteredTools.length === 0 && filteredHardware.length === 0 && (
                <div className="text-center py-16">
                  <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No items found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
