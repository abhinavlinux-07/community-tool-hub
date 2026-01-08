import { motion } from 'framer-motion';
import { 
  Wrench, 
  Users, 
  Leaf, 
  Clock, 
  Shield, 
  TrendingUp,
  Building2,
  Hammer
} from 'lucide-react';

const features = [
  {
    icon: Wrench,
    title: 'Extensive Tool Library',
    description: 'Access hundreds of professional-grade tools from power drills to circular saws, without the cost of ownership.',
    color: 'primary',
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'Join a network of neighbors and professionals sharing resources and building stronger local connections.',
    color: 'info',
  },
  {
    icon: Leaf,
    title: 'Sustainability Focus',
    description: 'Track your environmental impact with real CO₂ savings and contribute to a circular economy.',
    color: 'success',
  },
  {
    icon: Clock,
    title: 'Flexible Borrowing',
    description: 'From 24-hour quick borrows to week-long projects, we have lending periods that work for you.',
    color: 'warning',
  },
  {
    icon: Building2,
    title: 'B2B Hardware Trials',
    description: 'Architects and designers can trial cabinet hardware, hinges, and fittings before committing to projects.',
    color: 'primary',
  },
  {
    icon: Shield,
    title: 'Quality Assured',
    description: 'Every tool is inspected by our Tool Doctors after each return to ensure peak performance.',
    color: 'info',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function FeaturesSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground mb-6"
          >
            <Hammer className="w-4 h-4" />
            <span className="text-sm font-medium">Why Choose CTL</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4"
          >
            Everything You Need to Build
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            From DIY enthusiasts to professional architects, our platform serves everyone with quality tools and sustainable practices.
          </motion.p>
        </div>

        {/* Features Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-card-hover transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl bg-${feature.color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-6 h-6 text-${feature.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
