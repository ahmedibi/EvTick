import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaRobot } from 'react-icons/fa';

export default function ChatBot() {
    const [showChat, setShowChat] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Hi! Ask me anything (I answer briefly).' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const chatRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Close chat when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (chatRef.current && !chatRef.current.contains(event.target)) {
                setShowChat(false);
            }
        };

        if (showChat) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showChat]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('http://localhost:5000/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg })
            });
            const data = await res.json();

            if (data.error) throw new Error(data.error);

            setMessages(prev => [...prev, { role: 'bot', text: data.text }]);
        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, { role: 'bot', text: "Error getting response." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50" ref={chatRef}>
            {/* Toggle Button */}
            <button
                onClick={() => setShowChat(!showChat)}
                className={`w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center ${
                    showChat ? 'bg-[#0f9386] text-white' : 'bg-[#0f9386] text-white'
                }`}
                title="AI Assistant"
            >
                <FaRobot className="text-2xl" />
            </button>

            {/* Chat Window */}
            {showChat && (
                <div className="absolute bottom-16 right-0 w-80 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col h-[500px]">
                    {/* Header */}
                    <div className="bg-[#0f9386] p-3 flex items-center justify-between text-white">
                        <div className="flex items-center gap-2">
                            <FaRobot className="text-xl" />
                            <span className="font-semibold text-sm">AI Assistant (Short Answers)</span>
                        </div>
                        <button 
                            onClick={() => setShowChat(false)} 
                            className="text-white/80 hover:text-white text-xl leading-none"
                        >
                            &times;
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-3">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                                    msg.role === 'user'
                                        ? 'bg-[#0f9386] text-white rounded-br-none'
                                        : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none shadow-sm'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white text-slate-500 border border-slate-200 rounded-xl rounded-bl-none px-3 py-2 text-xs shadow-sm italic">
                                    Typing...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask a question..."
                            className="flex-1 bg-slate-50 border border-slate-200 text-gray-800 rounded-lg px-3 py-2 text-xs focus:border-[#0f9386] outline-none"
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="bg-[#0f9386] text-white p-2 rounded-lg hover:bg-[#0b6e64] disabled:opacity-50 transition-colors"
                        >
                            <FaPaperPlane size={12} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}