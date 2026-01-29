
import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h2 className="text-4xl font-extrabold text-slate-900 mb-6">Empowering Job Seekers with AI</h2>
      <p className="text-lg text-slate-600 mb-10">
        In an era where recruitment scams are becoming increasingly sophisticated, FraudGuard was built to provide a first line of defense. Our mission is to combine cutting-edge artificial intelligence with human-centric security to ensure that every opportunity is a real one.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h3 className="text-2xl font-bold text-slate-800 mb-4">Our Vision</h3>
          <p className="text-slate-600 leading-relaxed">
            We envision a job market free from predatory scams where job seekers can apply with confidence. By automating the detection of common fraud patterns, we save users time, money, and emotional distress.
          </p>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-800 mb-4">Our Technology</h3>
          <p className="text-slate-600 leading-relaxed">
            Utilizing Large Language Models and specialized NLP pipelines, our platform scrutinizes every detail—from linguistic nuances and domain authenticity to unrealistic financial promises.
          </p>
        </div>
      </div>

      <div className="mt-20 bg-blue-600 rounded-3xl p-10 text-white flex flex-col md:flex-row items-center justify-between">
        <div className="mb-8 md:mb-0 md:max-w-md">
          <h3 className="text-3xl font-bold mb-4">Protecting 10,000+ Seekers</h3>
          <p className="text-blue-100">Join our community in making the internet a safer place for career growth.</p>
        </div>
        <div className="flex space-x-4">
          <div className="text-center">
            <div className="text-4xl font-bold">99%</div>
            <div className="text-xs uppercase font-bold text-blue-200">Accuracy</div>
          </div>
          <div className="w-px h-12 bg-blue-500"></div>
          <div className="text-center">
            <div className="text-4xl font-bold">2M+</div>
            <div className="text-xs uppercase font-bold text-blue-200">Scams Blocked</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
