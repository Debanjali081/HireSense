import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    title: 'Resume Upload & Parsing',
    description: 'Upload your resume and let our AI extract key information to generate tailored interview questions based on your experience and skills.',
    bgImage: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Preparation'
  },
  {
    title: 'AI-Generated Questions',
    description: 'Receive intelligent, role-specific questions that adapt to your background and the position you\'re targeting for realistic practice.',
    bgImage: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Intelligence'
  },
  {
    title: 'Real-Time Voice Feedback',
    description: 'Practice with advanced voice recognition that analyzes your responses, tone, pace, and delivery in real-time.',
    bgImage: 'https://images.unsplash.com/photo-1554260570-9140fd3b7614?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Feedback'
  },
  {
    title: 'Comprehensive Scoring',
    description: 'Get detailed performance metrics on communication skills, technical knowledge, confidence, and overall interview readiness.',
    bgImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Analytics'
  },
  {
    title: 'Secure Authentication',
    description: 'Protected login system ensuring your data security while tracking progress across multiple practice sessions.',
    bgImage: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Security'
  },
  {
    title: 'Progress Analytics',
    description: 'Visualize your improvement journey with comprehensive analytics and actionable insights on your performance trends.',
    bgImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Insights'
  },
];

export default function Features() {
  return (
    <section id='features' className="py-20 lg:py-32 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse-slower"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0EA5E9" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-blue-900 mb-6 leading-tight">
            Everything You Need to{' '}
            <span className="text-orange-600">Succeed</span>
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Comprehensive tools and features designed to transform your interview preparation experience
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <Link 
              key={index}
              to='/dashboard'
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 border border-white/20 max-w-sm mx-auto w-full block"
            >
              {/* Background Image with Gradient Overlay */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${feature.bgImage})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 group-hover:from-black/70 group-hover:via-black/40 group-hover:to-black/20 transition-all duration-500"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 p-6 h-72 flex flex-col justify-between">
                {/* Category Badge */}
                <div className="flex justify-between items-start">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium border border-white/30">
                    {feature.category}
                  </span>
                  <div className="w-7 h-7 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 group-hover:bg-cyan-500/80 transition-all duration-300">
                    <ArrowRight className="w-3 h-3 text-white transform group-hover:translate-x-0.5 transition-transform duration-300" />
                  </div>
                </div>

                {/* Text Content */}
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white leading-tight group-hover:text-cyan-200 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-white/90 text-sm leading-relaxed opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-28 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 overflow-hidden">
                    {feature.description}
                  </p>
                </div>

                {/* Progress Indicator */}
                <div className="flex items-center gap-2 pt-3 border-t border-white/20">
                  <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-cyan-400 rounded-full transform origin-left transition-transform duration-1000 group-hover:scale-x-100 scale-x-0"
                      style={{ transitionDelay: '300ms' }}
                    ></div>
                  </div>
                  <span className="text-xs text-white/60 font-medium">Explore</span>
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}