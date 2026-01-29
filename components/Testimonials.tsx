
import React from 'react';

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Computer Science Student",
    content: "FraudGuard literally saved me from a 'Remote Web Dev' internship that asked for my SSN and a $500 'equipment fee'. The AI flagged it instantly.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
  },
  {
    name: "Mark Thompson",
    role: "Recent Graduate",
    content: "I was skeptical about a high-paying entry-level role. FraudGuard identified the free Gmail domain and suspicious urgency. Truly a lifesaver for job seekers.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mark"
  },
  {
    name: "Priya Sharma",
    role: "Marketing Intern",
    content: "As a fresh graduate, I'm a target for scams. This tool is so intuitive. It gave me the confidence to decline a shady offer and wait for a real one.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya"
  }
];

const Testimonials: React.FC = () => {
  return (
    <section className="bg-slate-50 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Trusted by Students Everywhere</h2>
          <p className="text-slate-600">Hear from real students who protected their careers with FraudGuard.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-md border border-slate-100 hover:shadow-lg transition">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <i key={i} className="fas fa-star text-yellow-400 text-sm"></i>
                ))}
              </div>
              <p className="text-slate-700 italic mb-8">"{t.content}"</p>
              <div className="flex items-center space-x-4">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full bg-blue-100" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
