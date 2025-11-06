import { Upload, Brain, Mic2, TrendingUp } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    title: 'Upload Your Resume',
    description: 'Start by uploading your resume. Our AI will analyze your skills, experience, and career goals to customize your interview experience.',
    number: '01',
  },
  {
    icon: Brain,
    title: 'Get AI-Generated Questions',
    description: 'Receive personalized interview questions tailored to your background and target role, ensuring relevant and challenging practice.',
    number: '02',
  },
  {
    icon: Mic2,
    title: 'Practice with Voice Feedback',
    description: 'Answer questions using voice or text input. Our AI analyzes your responses in real-time, providing instant feedback on content and delivery.',
    number: '03',
  },
  {
    icon: TrendingUp,
    title: 'Review & Improve',
    description: 'Access detailed performance analytics, identify areas for improvement, and track your progress over time as you prepare for success.',
    number: '04',
  },
];

export default function HowItWorks() {
  return (
    <section id='how-it-works' className="py-20 lg:py-32 bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS1vcGFjaXR5PSIwLjAyIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-60"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-900 mb-6 font-[head]">
            How{' '}
            <span className="text-orange-600">
              HireSense
            </span>{' '}
            Works
          </h2>
          <p className="text-lg text-gray-600">
            Get interview-ready in four simple steps. Our AI-powered platform guides you through a seamless preparation journey.
          </p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-cyan-200 via-blue-200 to-orange-200 -translate-y-1/2"></div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 h-full">
                    <div className="absolute -top-4 -left-4 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-900 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg">
                      {step.number}
                    </div>

                    <div className="mb-6 pt-4">
                      <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50">
                        <Icon className="w-8 h-8 text-blue-600" />
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                      {step.title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
