import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Leaf, DollarSign, Users } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-3 gap-8 mb-12"
          >
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-3">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-white">$45K+</div>
              <div className="text-sm text-white/70">Saved by Community</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-3">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-white">12.5t</div>
              <div className="text-sm text-white/70">CO₂ Reduced</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-white">2,400+</div>
              <div className="text-sm text-white/70">Active Members</div>
            </div>
          </motion.div>

          {/* CTA Content */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-display font-bold text-white mb-6"
          >
            Ready to Join the 
            <br />
            Circular Economy?
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/80 max-w-2xl mx-auto mb-10"
          >
            Whether you're a homeowner tackling a weekend project or a professional architect testing materials, 
            we have the tools and samples you need.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button 
              size="xl" 
              className="bg-white text-primary hover:bg-white/90 font-semibold shadow-xl"
              asChild
            >
              <Link to="/auth?mode=signup">
                Join as Community Member
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button 
              size="xl" 
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 font-semibold"
              asChild
            >
              <Link to="/auth?mode=signup&role=architect">
                B2B Professional Access
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
