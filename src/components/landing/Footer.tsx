import { Link } from 'react-router-dom';
import { Wrench, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Wrench className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl text-background">
                CTL
              </span>
            </div>
            <p className="text-background/60 text-sm mb-4">
              Community Tool Library - Replacing ownership with shared access for a sustainable future.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-background mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/browse" className="text-background/60 hover:text-background transition-colors text-sm">
                  Browse Tools
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-background/60 hover:text-background transition-colors text-sm">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/impact" className="text-background/60 hover:text-background transition-colors text-sm">
                  Our Impact
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-background/60 hover:text-background transition-colors text-sm">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* For Professionals */}
          <div>
            <h4 className="font-semibold text-background mb-4">For Professionals</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/auth?mode=signup&role=architect" className="text-background/60 hover:text-background transition-colors text-sm">
                  B2B Access
                </Link>
              </li>
              <li>
                <Link to="/browse?type=hardware" className="text-background/60 hover:text-background transition-colors text-sm">
                  Hardware Samples
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-background/60 hover:text-background transition-colors text-sm">
                  Trial Program
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-background mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-background/60 text-sm">
                <Mail className="w-4 h-4" />
                hello@ctlibrary.org
              </li>
              <li className="flex items-center gap-2 text-background/60 text-sm">
                <Phone className="w-4 h-4" />
                (555) 123-4567
              </li>
              <li className="flex items-center gap-2 text-background/60 text-sm">
                <MapPin className="w-4 h-4" />
                123 Maker Street, Community Hub
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/40 text-sm">
            © 2024 Community Tool Library. Built for sustainability.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-background/40 hover:text-background text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-background/40 hover:text-background text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
