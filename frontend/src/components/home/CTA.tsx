import { ArrowRight} from 'lucide-react';

export default function CTA() {
  return (
    <section id='contact' className="py-20 lg:py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-[head]">
            Ready to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-orange-400">
              Ace Your Next Interview?
            </span>
          </h2>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join thousands of successful candidates who have transformed their interview skills with <span className='text-orange-500'>HireSense</span>. Start practicing today and land your dream job.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button onClick={() => (window.location.href = "/dashboard")} className="group bg-gradient-to-r from-blue-800 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-10 py-5 rounded-lg font-semibold text-lg transition-all duration-300 shadow-2xl hover:shadow-cyan-500/50 hover:scale-105 flex items-center justify-center gap-2">
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <p className="text-sm text-gray-400 pt-4">
            Trusted by professionals at Google, Amazon, Microsoft, and more
          </p>
        </div>
      </div>
    </section>
  );
}
