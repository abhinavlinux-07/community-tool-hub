import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Leaf, Users, Wrench } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-card" />
      <div className="absolute top-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
      
      {/* Floating Elements */}
      <motion.div 
        className="absolute top-40 right-20 hidden lg:block"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-20 h-20 rounded-2xl bg-gradient-primary shadow-lg shadow-primary/20 flex items-center justify-center">
          <Wrench className="w-10 h-10 text-primary-foreground" />
        </div>
      </motion.div>
      
      <motion.div 
        className="absolute bottom-40 right-40 hidden lg:block"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <div className="w-16 h-16 rounded-xl bg-success/20 border border-success/30 flex items-center justify-center">
          <Leaf className="w-8 h-8 text-success" />
        </div>
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20 text-success mb-8"
          >
            <Leaf className="w-4 h-4" />
            <span className="text-sm font-medium">Circular Economy Platform</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-foreground leading-tight mb-6"
          >
            Share Tools,{' '}
            <span className="text-gradient-primary">Save Money,</span>
            <br />
            Protect the Planet
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Join our community tool library where ownership is replaced with shared access. 
            Borrow the tools you need, reduce waste, and build a sustainable future together.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button variant="hero" size="xl" asChild>
              <Link to="/auth?mode=signup">
                Start Borrowing
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link to="/browse">
                Browse Tools
              </Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-border"
          >
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-display font-bold text-foreground">500+</div>
              <div className="text-sm text-muted-foreground mt-1">Tools Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-display font-bold text-success">12.5t</div>
              <div className="text-sm text-muted-foreground mt-1">CO₂ Saved</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-display font-bold text-foreground">2,400+</div>
              <div className="text-sm text-muted-foreground mt-1">Community Members</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
