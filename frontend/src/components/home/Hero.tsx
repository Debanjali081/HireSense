import { ArrowRight, Play } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-slate-700 via-blue-300 to-slate-900 text-blue-900 overflow-hidden min-h-screen flex items-center">
      {/* Enhanced Grid Pattern Background */}
      <div className="absolute inset-0 opacity-30">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="2" strokeOpacity="0.2"/>
            </pattern>
            <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="1" strokeOpacity="0.1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#smallGrid)" />
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Grid Pattern Overlays */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-900/10 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-blue-900/10 to-transparent"></div>

      {/* Animated Grid Highlights */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 opacity-40">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="highlightGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0EA5E9" strokeWidth="1.5" strokeOpacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#highlightGrid)" />
        </svg>
      </div>

      <div className="absolute bottom-1/3 right-1/4 w-48 h-48 opacity-30">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="orangeGrid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#F97316" strokeWidth="1" strokeOpacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#orangeGrid)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-0">
        <div className="text-center max-w-5xl mx-auto space-y-12 animate-fade-in">
          <div className="space-y-6">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight tracking-tight font-[hero]">
              Master Your Next
              <br />
              <span className="text-orange-600">Interview</span>
              <br/>
              With Hire<span className="text-orange-600">Sense</span>
            </h1>
          </div>

          <p className="text-xl sm:text-2xl text-gray-900 leading-relaxed max-w-3xl mx-auto font-light">
            Transform your interview skills with intelligent mock interviews.
            <br className="hidden sm:block" />
            Get real-time AI feedback and boost your confidence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="group relative bg-gradient-to-r from-blue-900 to-blue-700 hover:from-cyan-600 hover:to-blue-700 text-white px-10 py-5 rounded-xl font-semibold text-lg transition-all duration-300 shadow-2xl hover:shadow-cyan-500/50 hover:scale-105 flex items-center justify-center gap-3 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <Play className="w-5 h-5 fill-current" />
              <span>Start Mock Interview</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}