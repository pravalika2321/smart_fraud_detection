
import React from 'react';

interface HeroProps {
  onCtaClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onCtaClick }) => {
  return (
    <section className="relative overflow-hidden bg-white py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="z-10 text-center lg:text-left">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-6">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span>AI-Powered Security</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
            Detect Fake Jobs Before <span className="text-blue-600 underline decoration-blue-200">They Catch You.</span>
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0">
            Secure your future. Use our production-ready AI to analyze job listings, internship offers, and recruitment emails in seconds.
          </p>
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={onCtaClick}
              className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200 transform hover:-translate-y-1"
            >
              <i className="fas fa-search-plus mr-2"></i> Analyze Job Offer
            </button>
            <button className="px-8 py-4 bg-slate-100 text-slate-800 rounded-xl font-bold text-lg hover:bg-slate-200 transition">
              How It Works
            </button>
          </div>
          <div className="mt-10 flex items-center justify-center lg:justify-start space-x-6 text-slate-400">
            <div className="flex items-center space-x-2">
              <i className="fas fa-check-circle text-green-500"></i>
              <span className="text-sm">NLP Analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <i className="fas fa-check-circle text-green-500"></i>
              <span className="text-sm">Instant Scoring</span>
            </div>
            <div className="flex items-center space-x-2">
              <i className="fas fa-check-circle text-green-500"></i>
              <span className="text-sm">Risk Assessment</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
          
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 border border-slate-100 transform rotate-2">
            <div className="flex items-center justify-between mb-4 pb-4 border-b">
              <div className="flex space-x-1">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <span className="text-xs font-mono text-slate-400">security_scanner.ai</span>
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-slate-100 rounded w-3/4"></div>
              <div className="h-4 bg-slate-100 rounded w-1/2"></div>
              <div className="h-24 bg-blue-50 rounded flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">89.4%</div>
                  <div className="text-[10px] text-blue-400 uppercase font-bold">Confidence Score</div>
                </div>
              </div>
              <div className="flex space-x-2">
                <div className="h-8 bg-red-100 rounded flex-grow flex items-center justify-center text-red-600 text-[10px] font-bold">HIGH RISK DETECTED</div>
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-slate-100 rounded w-full"></div>
                <div className="h-2 bg-slate-100 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
