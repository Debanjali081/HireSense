import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    title: 'Resume Upload & Parsing',
    description: 'Upload your resume and let our AI extract key information to generate tailored interview questions based on your experience and skills.',
    category: 'Preparation'
  },
  {
    title: 'AI-Generated Questions',
    description: 'Receive intelligent, role-specific questions that adapt to your background and the position you\'re targeting for realistic practice.',
    category: 'Intelligence'
  },
  {
    title: 'Real-Time Voice Feedback',
    description: 'Practice with advanced voice recognition that analyzes your responses, tone, pace, and delivery in real-time.',
    category: 'Feedback'
  },
  {
    title: 'Comprehensive Scoring',
    description: 'Get detailed performance metrics on communication skills, technical knowledge, confidence, and overall interview readiness.',
    category: 'Analytics'
  },
  {
    title: 'Secure Authentication',
    description: 'Protected login system ensuring your data security while tracking progress across multiple practice sessions.',
    category: 'Security'
  },
  {
    title: 'Progress Analytics',
    description: 'Visualize your improvement journey with comprehensive analytics and actionable insights on your performance trends.',
    category: 'Insights'
  },
];

export default function Features() {
  return (
    <section id='features' className="py-20 lg:py-32 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#000" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Everything You Need to{' '}
            <span className="text-blue-600">Succeed</span>
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Comprehensive tools and features designed to transform your interview preparation experience
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <Link 
              key={index}
              to='/dashboard'
              className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1 max-w-sm mx-auto w-full block"
            >
              {/* Card Gradient Background with Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#172447] via-[#1a57db] to-[#3B82F6]"></div>
              
              {/* Glow Effects */}
              <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/30 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#1E3A8A]/60 rounded-full blur-2xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl"></div>
              </div>
              
              {/* Content */}
              <div className="relative z-10 p-6 h-64 flex flex-col justify-between">
                {/* Category Badge */}
                <div className="flex justify-between items-start">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium border border-white/30 backdrop-blur-sm">
                    {feature.category}
                  </span>
                  <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center border border-white/30 group-hover:bg-white group-hover:border-white transition-all duration-300 backdrop-blur-sm">
                    <ArrowRight className="w-3 h-3 text-white group-hover:text-[#1E3A8A] transition-colors duration-300" />
                  </div>
                </div>

                {/* Text Content */}
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-white leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-blue-100 text-sm leading-relaxed opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-28 transition-all duration-500 overflow-hidden">
                    {feature.description}
                  </p>
                </div>

                {/* Subtle Indicator */}
                <div className="flex items-center justify-between pt-4 border-t border-white/20">
                  <span className="text-xs text-blue-200">Learn more</span>
                  <div className="w-8 h-[2px] bg-white/40 group-hover:bg-white transition-colors duration-300"></div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}