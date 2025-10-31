import { useState } from 'react';
import { FileText, MessageSquare, Mic, Award, Lock, BarChart3, Smartphone, ArrowRight, } from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'Resume Upload & Parsing',
    description: 'Upload your resume and let our AI extract key information to generate tailored interview questions based on your experience.',
    gradient: 'from-cyan-500 to-blue-600',
    stat: '100%',
    statLabel: 'Accuracy',
    color: 'cyan'
  },
  {
    icon: MessageSquare,
    title: 'AI-Generated Questions',
    description: 'Receive intelligent, role-specific questions that adapt to your background and the position you\'re targeting.',
    gradient: 'from-blue-600 to-indigo-600',
    stat: '500+',
    statLabel: 'Question Bank',
    color: 'blue'
  },
  {
    icon: Mic,
    title: 'Real-Time Voice Feedback',
    description: 'Practice with voice recognition technology that analyzes your responses, tone, and delivery in real-time.',
    gradient: 'from-indigo-600 to-purple-600',
    stat: '<1s',
    statLabel: 'Response Time',
    color: 'indigo'
  },
  {
    icon: Award,
    title: 'Comprehensive Scoring',
    description: 'Get detailed performance metrics on communication, technical knowledge, confidence, and overall interview readiness.',
    gradient: 'from-purple-600 to-orange-500',
    stat: '15+',
    statLabel: 'Metrics',
    color: 'purple'
  },
  {
    icon: Lock,
    title: 'User Authentication',
    description: 'Secure login system to protect your data and track your progress across multiple practice sessions.',
    gradient: 'from-orange-500 to-red-500',
    stat: '256-bit',
    statLabel: 'Encryption',
    color: 'orange'
  },
  {
    icon: BarChart3,
    title: 'Dashboard Analytics',
    description: 'Visualize your improvement over time with detailed analytics and insights on your interview performance.',
    gradient: 'from-cyan-500 to-teal-500',
    stat: '20+',
    statLabel: 'Insights',
    color: 'teal'
  },
  {
    icon: Smartphone,
    title: 'Responsive Design',
    description: 'Practice anytime, anywhere with a seamless experience across desktop, tablet, and mobile devices.',
    gradient: 'from-teal-500 to-cyan-500',
    stat: 'All',
    statLabel: 'Devices',
    color: 'cyan'
  },
];

export default function Features() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  return (
    <section className="py-20 lg:py-32 bg-white/20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 -right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slower"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-8 group hover:bg-white/10 transition-all duration-300">
          </div>
          
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-blue-900 mb-8 leading-tight font-[head     ]">
            Supercharge Your{' '}
            <span className="text-orange-600">
              Preparation
            </span>
          </h2>
          
          <p className="text-xl text-gray-900 max-w-2xl mx-auto leading-relaxed">
            Experience the future of interview preparation with cutting-edge AI technology 
            that adapts to your unique background and goals.
          </p>
        </div>

        {/* Desktop Layout */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 hidden">
          {/* Features List */}
          <div className="lg:col-span-5 space-y-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isActive = activeFeature === index;
              
              return (
                <button
                  key={index}
                  onClick={() => setActiveFeature(index)}
                  onMouseEnter={() => {
                    setIsHovering(true);
                    setActiveFeature(index);
                  }}
                  onMouseLeave={() => setIsHovering(false)}
                  className={`group w-full text-left p-6 rounded-2xl transition-all duration-500 backdrop-blur-sm border ${
                    isActive
                      ? 'bg-white/10 border-cyan-400/50 shadow-2xl scale-[1.02]'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex-shrink-0 p-3 rounded-xl bg-gradient-to-br ${feature.gradient} transition-all duration-500 ${
                        isActive ? 'scale-110 shadow-lg' : 'scale-100 group-hover:scale-105'
                      }`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className={`text-lg font-bold transition-colors duration-300 ${
                          isActive ? 'text-orange-600' : 'text-blue-900 group-hover:text-white'
                        }`}>
                          {feature.title}
                        </h3>
                        
                        <div className="flex items-center gap-2">
                          <div className={`text-sm font-bold px-2 py-1 rounded-full transition-all duration-300 ${
                            isActive 
                              ? 'bg-cyan-500/20 text-cyan-400' 
                              : 'bg-white/5 text-gray-400 group-hover:bg-cyan-500/20 group-hover:text-cyan-400'
                          }`}>
                            {feature.stat}
                          </div>
                          <ArrowRight
                            className={`w-4 h-4 flex-shrink-0 transition-all duration-300 ${
                              isActive
                                ? 'text-cyan-400 translate-x-0 opacity-100'
                                : 'text-black -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'
                            }`}
                          />
                        </div>
                      </div>
                      
                      <p className={`text-sm leading-relaxed transition-all duration-300 ${
                        isActive ? 'text-black max-h-20' : 'text-gray-800 max-h-0 overflow-hidden'
                      }`}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feature Visualization */}
          <div className="lg:col-span-7 relative">
            <div className="sticky top-8">
              {/* Animated orb background */}
              <div className="absolute inset-0">
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl transition-all duration-1000 ${
                  isHovering ? 'opacity-30' : 'opacity-20'
                }`} style={{
                  background: `radial-gradient(circle, ${
                    features[activeFeature].color === 'cyan' ? 'rgba(6,182,212,0.3)' :
                    features[activeFeature].color === 'blue' ? 'rgba(37,99,235,0.3)' :
                    features[activeFeature].color === 'indigo' ? 'rgba(79,70,229,0.3)' :
                    features[activeFeature].color === 'purple' ? 'rgba(147,51,234,0.3)' :
                    features[activeFeature].color === 'orange' ? 'rgba(249,115,22,0.3)' :
                    'rgba(20,184,166,0.3)'
                  }, transparent 70%)`
                }}></div>
              </div>

              {/* Main feature display */}
              <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/10 shadow-2xl overflow-hidden">
                {/* Animated border */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                
                {/* Content */}
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  const isActive = activeFeature === index;
                  
                  return (
                    <div
                      key={index}
                      className={`transition-all duration-700 space-y-8 ${
                        isActive ? 'opacity-100 translate-y-0' : 'opacity-0 absolute inset-0 translate-y-8 pointer-events-none'
                      }`}
                    >
                      {/* Icon and Stats */}
                      <div className="flex items-center justify-between">
                        <div className={`p-6 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-2xl`}>
                          <Icon className="w-12 h-12 text-white" />
                        </div>
                        
                      </div>

                      {/* Title and Description */}
                      <div>
                        <h3 className="text-4xl font-bold text-blue-900 mb-6 leading-tight">
                          {feature.title}
                        </h3>
                        <p className="text-xl text-gray-900 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>

                      {/* Progress indicator */}
                      <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                        <div className="flex -space-x-2">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="w-10 h-10 rounded-full bg-orange-500 border-4 border-blue-900 shadow-lg"></div>
                          ))}
                        </div>
                        <span className="text-gray-400 text-lg">
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden space-y-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            
            return (
              <div
                key={index}
                className="group relative bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                {/* Animated gradient border */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                <div className="relative p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-blue-900 mb-2">{feature.title}</h3>
                      </div>
                      <p className="text-gray-800 leading-relaxed mb-4">{feature.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}