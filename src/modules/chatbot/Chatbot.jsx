
import  { useState } from 'react';
import axios from 'axios';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const GEMINI_API_KEY = 'AIzaSyCVt9L-DXviJFrp1Z6QSpqrlTDP_BdAaq8';
const ChatBot = () => {
    const [userMessage, setUserMessage] = useState('');
    const [chatLog, setChatLog] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!userMessage.trim()) return;

        const newChatLog = [...chatLog, { type: 'user', text: userMessage }];
        setChatLog(newChatLog);
        setUserMessage('');
        setLoading(true);

        try {
            const response = await axios.post(
                `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
                {
                    contents: [
                        {
                            parts: [{ text: userMessage }],
                        },
                    ],
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );


            const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, no response.';
            setChatLog([...newChatLog, { type: 'bot', text: reply }]);
        } catch (error) {
            console.error('Gemini API Error:', error);
            setChatLog([...newChatLog, { type: 'bot', text: 'Something went wrong.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md mt-10">
            <h2 className="text-xl font-bold mb-4">💬 Gemini Chatbot</h2>

            <div className="h-64 overflow-y-auto border p-3 rounded mb-4">
                {chatLog.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`mb-2 p-2 rounded ${
                            msg.type === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-100 text-left'
                        }`}
                    >
                        <span>{msg.text}</span>
                    </div>
                ))}
                {loading && <div className="text-sm text-gray-500 italic">Bot is typing...</div>}
            </div>

            <div className="flex gap-2">
                <input
                    type="text"
                    className="flex-grow border rounded px-3 py-2"
                    placeholder="Type a message..."
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button
                    onClick={handleSend}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatBot;