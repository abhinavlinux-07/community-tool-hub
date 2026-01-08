import { motion } from 'framer-motion';
import { Search, CalendarCheck, Package, RotateCcw } from 'lucide-react';

const steps = [
  {
    icon: Search,
    step: '01',
    title: 'Browse & Find',
    description: 'Search our extensive library of tools and hardware samples. Filter by category, availability, or brand.',
  },
  {
    icon: CalendarCheck,
    step: '02',
    title: 'Request & Book',
    description: 'Submit a borrowing request with your preferred dates. B2B users get priority approval for trials.',
  },
  {
    icon: Package,
    step: '03',
    title: 'Pick Up & Use',
    description: 'Collect your tools from our location. Use them for your project with full support.',
  },
  {
    icon: RotateCcw,
    step: '04',
    title: 'Return & Impact',
    description: 'Return tools on time. Our Tool Doctors inspect them, and you earn impact points for sustainability.',
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4"
          >
            How It Works
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Get started in minutes. Our simple process makes borrowing tools as easy as it should be.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-border" />
              )}
              
              <div className="relative bg-card rounded-2xl p-6 border border-border text-center">
                {/* Step Number */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-bold rounded-full">
                  {step.step}
                </div>
                
                {/* Icon */}
                <div className="w-16 h-16 mx-auto mt-4 mb-4 rounded-2xl bg-gradient-primary flex items-center justify-center">
                  <step.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
