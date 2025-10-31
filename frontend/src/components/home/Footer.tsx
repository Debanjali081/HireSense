import { Github, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <img src="/logo.png" alt="HireSense Logo" className="h-[100px] w-auto" />
            <p className="text-sm leading-relaxed">
              AI-powered mock interview platform helping professionals master their interview skills and land their dream jobs.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors duration-300 hover:text-cyan-400"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors duration-300 hover:text-cyan-400"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors duration-300 hover:text-cyan-400"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div className="flex justify-end">
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-cyan-400 transition-colors duration-300 text-sm">Features</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors duration-300 text-sm">How It Works</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors duration-300 text-sm">Pricing</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors duration-300 text-sm">FAQ</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} HireSense. All rights reserved.
            </p>
            <p className="text-sm text-gray-400">
              Made with passion for helping you succeed
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}