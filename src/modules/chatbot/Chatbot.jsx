import React from 'react';

const Chatbot = ({ user, role }) => {
    return (
        <div className="fixed bottom-6 right-6 w-80 h-96 bg-white border shadow-lg rounded-lg z-50">
            <div className="bg-blue-600 text-white px-4 py-2 rounded-t-lg font-semibold">
                🤖 Chatbot Assistant
            </div>
            <div className="p-4 overflow-y-auto h-[340px]">
                <p>Hello {user?.displayName || 'User'}! How can I help you today?</p>
                {/* Add chatbot logic or chat UI here */}
            </div>
        </div>
    );
};

export default Chatbot;