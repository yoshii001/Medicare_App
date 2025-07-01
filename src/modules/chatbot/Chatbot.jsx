import { useState } from 'react';
import axios from 'axios';
import { getDoctors } from '../../services/database.js';
import './chatbot.css'; // Make sure this file exists

const GEMINI_API_URL =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const GEMINI_API_KEY = 'AIzaSyCVt9L-DXviJFrp1Z6QSpqrlTDP_BdAaq8';

const illnessToSpecialist = {
    skin: 'Dermatologist',
    rash: 'Dermatologist',
    acne: 'Dermatologist',
    heart: 'Cardiologist',
    chest: 'Cardiologist',
    pain: 'General Physician',
    fever: 'General Medicine',
    anxiety: 'Psychiatrist',
    depression: 'Psychiatrist',
    stomach: 'Gastroenterologist',
    diabetes: 'Endocrinologist',
};

const getSpecializationFromIllness = (text) => {
    const lowerText = text.toLowerCase();
    for (const keyword in illnessToSpecialist) {
        if (lowerText.includes(keyword)) {
            return illnessToSpecialist[keyword];
        }
    }
    return null;
};

const findDoctorBySpecialty = async (specialty) => {
    const doctors = await getDoctors();
    if (!doctors) return null;
    return Object.values(doctors).find(
        (doc) => doc.specialization?.toLowerCase() === specialty.toLowerCase()
    );
};

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
            const specialization = getSpecializationFromIllness(userMessage);

            if (specialization) {
                const doctor = await findDoctorBySpecialty(specialization);

                if (doctor) {
                    setChatLog([
                        ...newChatLog,
                        {
                            type: 'bot',
                            text: `🩺 Based on your symptoms, you should consult a **${specialization}** specialist.\n\n👨‍⚕️ Recommended Doctor: **Dr. ${doctor.name}** (${doctor.qualification || 'MBBS'})`,
                        },
                    ]);
                } else {
                    setChatLog([
                        ...newChatLog,
                        {
                            type: 'bot',
                            text: `⚠️ It looks like you need a **${specialization}**, but we couldn't find any available doctors at the moment.`,
                        },
                    ]);
                }
            } else {
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

                const reply =
                    response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
                    'Sorry, no response.';
                setChatLog([...newChatLog, { type: 'bot', text: reply }]);
            }
        } catch (error) {
            console.error('Gemini API Error:', error);
            setChatLog([
                ...newChatLog,
                { type: 'bot', text: 'Something went wrong. Please try again.' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chat-container">
            <h2>💬 Gemini Chatbot</h2>

            <div className="chat-box">
                {chatLog.map((msg, idx) => (
                    <div key={idx} className={`message ${msg.type}`}>
                        <span>{msg.text}</span>
                    </div>
                ))}
                {loading && <div className="typing">Bot is typing...</div>}
            </div>

            <div className="input-container">
                <input
                    type="text"
                    placeholder="Type your illness or message..."
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button onClick={handleSend} disabled={loading}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatBot;
