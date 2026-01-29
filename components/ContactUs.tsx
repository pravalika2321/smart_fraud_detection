
import React from 'react';

const ContactUs: React.FC = () => {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Contact Support</h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Our safety team is available 24/7 to review suspicious job offers and help you navigate the job market securely.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Quick Contact Cards */}
          <div className="space-y-4">
            <div className="bg-blue-600 p-8 rounded-2xl text-white shadow-xl">
              <i className="fas fa-envelope text-3xl mb-4"></i>
              <h3 className="text-xl font-bold mb-2">Email Support</h3>
              <p className="text-blue-100 text-sm mb-4">Get a response within 2 hours from our fraud specialists.</p>
              <div className="font-mono font-bold">support@fraudguard.ai</div>
            </div>
            
            <div className="bg-slate-900 p-8 rounded-2xl text-white shadow-xl">
              <i className="fas fa-phone-volume text-3xl mb-4"></i>
              <h3 className="text-xl font-bold mb-2">Emergency Hotline</h3>
              <p className="text-slate-400 text-sm mb-4">If you've already shared sensitive data, call us immediately.</p>
              <div className="font-mono font-bold">+1 (800) 555-SAFE</div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-md">
              <i className="fas fa-map-marker-alt text-3xl text-blue-600 mb-4"></i>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Global HQ</h3>
              <p className="text-slate-500 text-sm">
                100 Cyber Security Way,<br />
                San Francisco, CA 94103
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-slate-50 p-8 md:p-12 rounded-3xl border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-8">Send a Direct Message</h3>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Your Name</label>
                <input type="text" placeholder="John Doe" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Email Address</label>
                <input type="email" placeholder="john@example.com" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-slate-700">How can we help?</label>
                <select className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                  <option>Report a fake job offer</option>
                  <option>Technical issue with analysis</option>
                  <option>General inquiry</option>
                  <option>Request for partnership</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-slate-700">Description</label>
                <textarea rows={5} placeholder="Tell us more about the suspicious listing or your question..." className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
              </div>
              <div className="md:col-span-2">
                <button className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
