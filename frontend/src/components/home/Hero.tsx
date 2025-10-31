import { ArrowRight, Play } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-slate-100  via-blue-100 to-slate-900 text-blue-900 overflow-hidden min-h-screen flex items-center">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>


      <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/30 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse-slower"></div>

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
