
import React, { useState } from 'react';
import { JobInputData } from '../types';

interface InputModuleProps {
  onAnalyze: (data: JobInputData) => void;
}

const InputModule: React.FC<InputModuleProps> = ({ onAnalyze }) => {
  const [activeTab, setActiveTab] = useState<'manual' | 'email' | 'file'>('manual');
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    salary: '',
    location: '',
    email: '',
    website: '',
    description: '',
  });
  const [emailContent, setEmailContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalData: JobInputData;
    
    if (activeTab === 'manual') {
      finalData = { ...formData, sourceType: 'manual' };
    } else if (activeTab === 'email') {
      finalData = {
        title: 'Extracted from Email',
        company: 'Unknown',
        salary: 'N/A',
        location: 'Remote/Unknown',
        email: 'N/A',
        website: 'N/A',
        description: emailContent,
        sourceType: 'email'
      };
    } else {
      finalData = {
        title: selectedFile ? selectedFile.name : 'Uploaded Document',
        company: 'Extracted from File',
        salary: 'N/A',
        location: 'N/A',
        email: 'N/A',
        website: 'N/A',
        description: `Analysis request for file: ${selectedFile?.name}`,
        sourceType: 'file'
      };
    }

    onAnalyze(finalData);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      <div className="flex border-b">
        {(['manual', 'email', 'file'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-4 text-sm font-semibold transition-colors ${
              activeTab === tab 
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            {tab === 'manual' && <><i className="fas fa-edit mr-2"></i> Manual Input</>}
            {tab === 'email' && <><i className="fas fa-envelope mr-2"></i> Paste Email</>}
            {tab === 'file' && <><i className="fas fa-file-upload mr-2"></i> File Upload</>}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-8">
        {activeTab === 'manual' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Job Title *</label>
              <input 
                required
                name="title"
                value={formData.title}
                onChange={handleManualChange}
                placeholder="e.g. Senior Software Engineer" 
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Company Name *</label>
              <input 
                required
                name="company"
                value={formData.company}
                onChange={handleManualChange}
                placeholder="e.g. Google" 
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Salary / Stipend</label>
              <input 
                name="salary"
                value={formData.salary}
                onChange={handleManualChange}
                placeholder="e.g. $120,000 / year" 
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Location</label>
              <input 
                name="location"
                value={formData.location}
                onChange={handleManualChange}
                placeholder="e.g. New York, NY" 
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Recruiter Email</label>
              <input 
                name="email"
                value={formData.email}
                onChange={handleManualChange}
                placeholder="e.g. hr@company.com" 
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Website URL</label>
              <input 
                name="website"
                value={formData.website}
                onChange={handleManualChange}
                placeholder="e.g. https://company.com" 
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-sm font-semibold text-slate-700">Job Description *</label>
              <textarea 
                required
                name="description"
                value={formData.description}
                onChange={handleManualChange}
                rows={4}
                placeholder="Paste the full job description here..." 
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              ></textarea>
            </div>
          </div>
        )}

        {activeTab === 'email' && (
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Recruitment Email Content *</label>
            <textarea 
              required
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              rows={10}
              placeholder="Paste the entire body of the email you received..." 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-sm"
            ></textarea>
          </div>
        )}

        {activeTab === 'file' && (
          <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 transition cursor-pointer" onClick={() => document.getElementById('fileInput')?.click()}>
            <i className="fas fa-cloud-upload-alt text-4xl text-blue-400 mb-4"></i>
            <p className="text-slate-600 font-medium">{selectedFile ? selectedFile.name : 'Click to select a file (PDF, DOCX, TXT)'}</p>
            <p className="text-xs text-slate-400 mt-2">Max file size: 5MB</p>
            <input 
              id="fileInput"
              type="file" 
              className="hidden" 
              accept=".pdf,.doc,.docx,.txt"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            />
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <button 
            type="submit"
            className="px-10 py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition transform hover:scale-[1.02]"
          >
            Start Fraud Analysis <i className="fas fa-arrow-right ml-2"></i>
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputModule;
