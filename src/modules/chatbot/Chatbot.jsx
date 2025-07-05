import { useState, useEffect } from 'react';
import axios from 'axios';
import { getDoctors, saveChatMessage, getChatHistory } from '../../services/database.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { FiSend, FiUser, FiMessageCircle } from 'react-icons/fi';
import './chatbot.css';

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
    const { currentUser } = useAuth();
    const [userMessage, setUserMessage] = useState('');
    const [chatLog, setChatLog] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        // Set user ID - either logged in user or generate for unlogged user
        const id = currentUser?.uid || 'unlogged_user_1';
        setUserId(id);
        
        // Load chat history
        loadChatHistory(id);
    }, [currentUser]);

    const loadChatHistory = async (id) => {
        try {
            const history = await getChatHistory(id);
            if (history) {
                const messages = Object.values(history).map(msg => ({
                    type: msg.messageType,
                    text: msg.message
                }));
                setChatLog(messages);
            }
        } catch (error) {
            console.error('Error loading chat history:', error);
        }
    };

    const saveMessage = async (message, messageType) => {
        if (!userId) return;
        
        try {
            const userType = currentUser ? 'logged' : 'unlogged';
            await saveChatMessage(userId, userType, message, messageType);
        } catch (error) {
            console.error('Error saving message:', error);
        }
    };

    const handleSend = async () => {
        if (!userMessage.trim() || loading) return;

        const newChatLog = [...chatLog, { type: 'user', text: userMessage }];
        setChatLog(newChatLog);
        
        // Save user message
        await saveMessage(userMessage, 'user');
        
        const currentMessage = userMessage;
        setUserMessage('');
        setLoading(true);

        try {
            const specialization = getSpecializationFromIllness(currentMessage);

            if (specialization) {
                const doctor = await findDoctorBySpecialty(specialization);

                let botResponse;
                if (doctor) {
                    botResponse = `🩺 Based on your symptoms, you should consult a **${specialization}** specialist.\n\n👨‍⚕️ Recommended Doctor: **Dr. ${doctor.name}** (${doctor.qualification || 'MBBS'})`;
                } else {
                    botResponse = `⚠️ It looks like you need a **${specialization}**, but we couldn't find any available doctors at the moment.`;
                }

                setChatLog([...newChatLog, { type: 'bot', text: botResponse }]);
                await saveMessage(botResponse, 'bot');
            } else {
                const response = await axios.post(
                    `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
                    {
                        contents: [
                            {
                                parts: [{ text: currentMessage }],
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
                await saveMessage(reply, 'bot');
            }
        } catch (error) {
            console.error('Gemini API Error:', error);
            const errorMessage = 'Something went wrong. Please try again.';
            setChatLog([...newChatLog, { type: 'bot', text: errorMessage }]);
            await saveMessage(errorMessage, 'bot');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h2>
                    <FiMessageCircle />
                    WellNests Assistant
                </h2>
                <div className="status">
                    <div className="status-indicator"></div>
                    {currentUser ? (
                        <>
                            <FiUser size={12} />
                            {currentUser.email}
                        </>
                    ) : (
                        'Chatting as guest'
                    )}
                </div>
            </div>

            <div className="chat-box">
                {chatLog.length === 0 ? (
                    <div className="welcome-message">
                        <div className="icon">🩺</div>
                        <h3>Welcome to WellNests Assistant</h3>
                        <p>I'm here to help you with medical questions and find the right specialists for your needs.</p>
                    </div>
                ) : (
                    chatLog.map((msg, idx) => (
                        <div key={idx} className={`message ${msg.type}`}>
                            {msg.text}
                        </div>
                    ))
                )}
                
                {loading && (
                    <div className="typing">
                        Assistant is typing
                        <div className="typing-dots">
                            <div className="typing-dot"></div>
                            <div className="typing-dot"></div>
                            <div className="typing-dot"></div>
                        </div>
                    </div>
                )}
            </div>

            <div className="input-container">
                <div className="input-wrapper">
                    <input
                        type="text"
                        placeholder="Describe your symptoms or ask a question..."
                        value={userMessage}
                        onChange={(e) => setUserMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={loading}
                    />
                </div>
                <button 
                    className="send-button" 
                    onClick={handleSend} 
                    disabled={loading || !userMessage.trim()}
                >
                    <FiSend className="send-icon" />
                </button>
            </div>
        </div>
    );
};

export default ChatBot;
