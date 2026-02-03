
import React, { useState, useRef, useEffect } from 'react';
import { chatWithAI } from '../geminiService';

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
        { role: 'model', text: 'Hi! I am your FraudGuard assistant. How can I help you stay safe in your job search today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setIsLoading(true);

        try {
            // Format history for Gemini SDK
            const history = messages.map(msg => ({
                role: msg.role,
                parts: [{ text: msg.text }]
            }));

            const response = await chatWithAI(userMessage, history);
            setMessages(prev => [...prev, { role: 'model', text: response }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'model', text: "I'm sorry, I encountered an error. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Bubble */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 ${isOpen ? 'bg-slate-800 rotate-90' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
                <i className={`fas ${isOpen ? 'fa-times' : 'fa-comment-dots'} text-white text-xl`}></i>
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500"></span>
                    </span>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="absolute bottom-20 right-0 w-[350px] md:w-[400px] h-[500px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white text-center relative">
                        <div className="flex items-center justify-center space-x-3">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                                <i className="fas fa-robot text-lg"></i>
                            </div>
                            <div className="text-left">
                                <h3 className="font-bold tracking-tight">Career Assistant</h3>
                                <div className="flex items-center space-x-1.5">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                    <span className="text-[10px] font-bold text-blue-100 uppercase tracking-widest">Always Online</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div
                        ref={scrollRef}
                        className="flex-grow p-6 overflow-y-auto bg-slate-50/50 space-y-4"
                    >
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 rounded-tr-none'
                                            : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-none'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white px-4 py-3 rounded-2xl shadow-sm border border-slate-100 rounded-tl-none flex space-x-1.5 items-center">
                                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-150"></div>
                                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-300"></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <form
                        onSubmit={handleSend}
                        className="p-4 bg-white border-t border-slate-100 flex items-center space-x-2"
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about jobs or internships..."
                            className="flex-grow px-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="w-10 h-10 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-100 flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 transition-all hover:scale-105"
                        >
                            <i className="fas fa-paper-plane text-xs"></i>
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
