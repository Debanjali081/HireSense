import { Target, TrendingUp, Briefcase, Users } from 'lucide-react';

const benefits = [
  {
    icon: Target,
    title: 'Build Unshakeable Confidence',
    description: 'Practice in a risk-free environment until you feel completely prepared. Eliminate anxiety and walk into every interview with confidence.',
  },
  {
    icon: TrendingUp,
    title: 'Improve Interview Performance',
    description: 'Receive actionable feedback on every aspect of your responses. Watch your scores improve as you master the art of interviewing.',
  },
  {
    icon: Briefcase,
    title: 'Accelerate Career Growth',
    description: 'Land your dream job faster by mastering interview skills that set you apart from other candidates. Turn interviews into offers.',
  },
  {
    icon: Users,
    title: 'Personalized Learning Path',
    description: 'Get tailored recommendations based on your unique background and goals. Focus on what matters most for your target role.',
  },
];

export default function Benefits() {
  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-900 mb-6 font-[head]">
                Transform Your Career with{' '}
                <span className="text-orange-600">
                  Proven Results
                </span>
              </h2>
              <p className="text-lg text-gray-600">
                Join thousands of successful candidates who have used HireSense to land their dream jobs. Our AI-powered platform delivers measurable improvements in interview performance.
              </p>
            </div>

            <div className="space-y-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={index}
                    className="flex gap-4 p-6 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50 hover:shadow-lg transition-all duration-300 border border-gray-100"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-orange-500/20 rounded-3xl blur-3xl"></div>
            <div className="relative bg-gradient-to-br from-slate-900 to-blue-900 rounded-3xl p-8 lg:p-12 text-white">
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Real Success Stories</h3>
                  <p className="text-gray-300">What our users are saying</p>
                </div>

                <div className="space-y-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-200 mb-4">
                      "HireSense helped me land my dream job at a Fortune 500 company. The AI feedback was incredibly accurate and helped me improve my responses significantly."
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center font-bold">
                        JS
                      </div>
                      <div>
                        <div className="font-semibold">Jennifer Smith</div>
                        <div className="text-sm text-gray-400">Software Engineer</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-200 mb-4">
                      "The practice sessions were invaluable. I went from nervous to confident, and it showed in my actual interviews. Highly recommend!"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center font-bold">
                        MR
                      </div>
                      <div>
                        <div className="font-semibold">Michael Rodriguez</div>
                        <div className="text-sm text-gray-400">Product Manager</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
