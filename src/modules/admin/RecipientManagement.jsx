/*
import React, { useState, useEffect } from 'react';
import { getRecipients, createRecipient, updateRecipient, deleteRecipient } from '../../services/database.js';
import { FiPlus, FiEdit, FiTrash2, FiUser, FiMail, FiPhone, FiSearch } from 'react-icons/fi';
import RecipientModal from './RecipientModal.jsx';

const RecipientManagement = () => {
    const [recipients, setRecipients] = useState([]);
    const [filteredRecipients, setFilteredRecipients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedRecipient, setSelectedRecipient] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRecipients();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = recipients.filter(recipient =>
                recipient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                recipient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                recipient.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredRecipients(filtered);
        } else {
            setFilteredRecipients(recipients);
        }
    }, [searchTerm, recipients]);

    const loadRecipients = async () => {
        try {
            const recipientData = await getRecipients();
            if (recipientData) {
                const recipientList = Object.values(recipientData);
                setRecipients(recipientList);
                setFilteredRecipients(recipientList);
            }
        } catch (error) {
            console.error('Error loading recipients:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddRecipient = () => {
        setSelectedRecipient(null);
        setShowModal(true);
    };

    const handleEditRecipient = (recipient) => {
        setSelectedRecipient(recipient);
        setShowModal(true);
    };

    const handleDeleteRecipient = async (recipientId) => {
        if (window.confirm('Are you sure you want to delete this recipient?')) {
            try {
                await deleteRecipient(recipientId);
                loadRecipients();
            } catch (error) {
                console.error('Error deleting recipient:', error);
            }
        }
    };

    const handleSaveRecipient = async (recipientData) => {
        try {
            if (selectedRecipient) {
                await updateRecipient(selectedRecipient.id, recipientData);
            } else {
                await createRecipient(recipientData);
            }
            setShowModal(false);
            loadRecipients();
        } catch (error) {
            console.error('Error saving recipient:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Recipient Management</h1>
                    <p className="text-gray-600">Add, edit, and manage recipients in the system</p>
                </div>
                <button
                    onClick={handleAddRecipient}
                    className="btn-primary flex items-center space-x-2"
                >
                    <FiPlus />
                    <span>Add Recipient</span>
                </button>
            </div>

            <div className="card">
                <div className="mb-6">
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search recipients by name, email, or category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="form-input pl-10"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recipient</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {filteredRecipients.map((recipient) => (
                            <tr key={recipient.id} className="hover:bg-gray-50 transition-colors duration-200">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                            <FiUser className="text-primary-600" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {recipient.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                ID: {recipient.id?.slice(-8) || 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900 flex items-center">
                                        <FiMail className="mr-2 text-gray-400" />
                                        {recipient.email}
                                    </div>
                                    <div className="text-sm text-gray-500 flex items-center">
                                        <FiPhone className="mr-2 text-gray-400" />
                                        {recipient.phone}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{recipient.category}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`status-badge ${
                        recipient.status === 'active' ? 'status-active' :
                            recipient.status === 'inactive' ? 'status-inactive' :
                                'status-pending'
                    }`}>
                      {recipient.status || 'Active'}
                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEditRecipient(recipient)}
                                            className="text-primary-600 hover:text-primary-900 p-1 rounded hover:bg-primary-50 transition-colors duration-200"
                                        >
                                            <FiEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteRecipient(recipient.id)}
                                            className="text-error-600 hover:text-error-900 p-1 rounded hover:bg-error-50 transition-colors duration-200"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {filteredRecipients.length === 0 && (
                        <div className="text-center py-12">
                            <FiUser className="text-gray-300 text-5xl mx-auto mb-4" />
                            <p className="text-gray-500">
                                {searchTerm ? 'No recipients found matching your search.' : 'No recipients added yet.'}
                            </p>
                            <button
                                onClick={handleAddRecipient}
                                className="mt-4 text-primary-600 hover:text-primary-800 font-medium"
                            >
                                Add your first recipient
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {showModal && (
                <RecipientModal
                    recipient={selectedRecipient}
                    onSave={handleSaveRecipient}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
};

export default RecipientManagement;
*/

import React, { useState, useEffect } from 'react';
import {
    getRecipients,
    createRecipient,
    updateRecipient,
    deleteRecipient,
} from '../../services/database.js';
import {
    FiPlus,
    FiEdit,
    FiTrash2,
    FiUser,
    FiMail,
    FiPhone,
    FiSearch,
} from 'react-icons/fi';
import RecipientModal from './RecipientModal.jsx';

const RecipientManagement = () => {
    const [recipients, setRecipients] = useState([]);
    const [filteredRecipients, setFilteredRecipients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedRecipient, setSelectedRecipient] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRecipients();
    }, []);

    useEffect(() => {
        const filtered = recipients.filter((recipient) => {
            const name = recipient.name?.toLowerCase() || '';
            const email = recipient.email?.toLowerCase() || '';
            const category = recipient.category?.toLowerCase() || '';
            return (
                name.includes(searchTerm.toLowerCase()) ||
                email.includes(searchTerm.toLowerCase()) ||
                category.includes(searchTerm.toLowerCase())
            );
        });
        setFilteredRecipients(searchTerm ? filtered : recipients);
    }, [searchTerm, recipients]);

    const loadRecipients = async () => {
        setLoading(true);
        try {
            const data = await getRecipients();
            if (data) {
                const list = Object.values(data);
                setRecipients(list);
                setFilteredRecipients(list);
            } else {
                setRecipients([]);
                setFilteredRecipients([]);
            }
        } catch (err) {
            console.error('Error loading recipients:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddRecipient = () => {
        setSelectedRecipient(null);
        setShowModal(true);
    };

    const handleEditRecipient = (recipient) => {
        setSelectedRecipient(recipient);
        setShowModal(true);
    };

    const handleDeleteRecipient = async (id) => {
        if (window.confirm('Are you sure you want to delete this recipient?')) {
            try {
                await deleteRecipient(id);
                await loadRecipients();
            } catch (err) {
                console.error('Delete failed:', err);
            }
        }
    };

    const handleSaveRecipient = async (data) => {
        try {
            if (selectedRecipient) {
                await updateRecipient(selectedRecipient.id, data);
            } else {
                await createRecipient(data);
            }
            setShowModal(false);
            loadRecipients();
        } catch (err) {
            console.error('Error saving recipient:', err);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="loader" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Recipient Management</h1>
                    <p className="text-gray-600">Add, edit, and manage recipients in the system</p>
                </div>
                <button onClick={handleAddRecipient} className="btn-primary flex items-center space-x-2">
                    <FiPlus />
                    <span>Add Recipient</span>
                </button>
            </div>

            <div className="card">
                <div className="mb-6 relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search recipients by name, email, or category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-input pl-10 w-full"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recipient</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredRecipients.map((recipient) => (
                                <tr key={recipient.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-primary-100 rounded-full flex justify-center items-center">
                                                <FiUser className="text-primary-600" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{recipient.name}</div>
                                                <div className="text-sm text-gray-500">ID: {recipient.id?.slice(-8) || 'N/A'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 flex items-center">
                                            <FiMail className="mr-2 text-gray-400" /> {recipient.email}
                                        </div>
                                        <div className="text-sm text-gray-500 flex items-center">
                                            <FiPhone className="mr-2 text-gray-400" /> {recipient.phone}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-900">{recipient.category || 'N/A'}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`status-badge ${recipient.status === 'inactive' ? 'status-inactive' : 'status-active'}`}>
                                            {recipient.status || 'active'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEditRecipient(recipient)}
                                                className="text-primary-600 hover:text-primary-900"
                                            >
                                                <FiEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteRecipient(recipient.id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredRecipients.length === 0 && (
                        <div className="text-center py-12">
                            <FiUser className="text-gray-300 text-5xl mx-auto mb-4" />
                            <p className="text-gray-500">
                                {searchTerm ? 'No recipients match your search.' : 'No recipients found.'}
                            </p>
                            <button
                                onClick={handleAddRecipient}
                                className="mt-4 text-primary-600 hover:text-primary-800"
                            >
                                Add Recipient
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {showModal && (
                <RecipientModal
                    recipient={selectedRecipient}
                    onSave={handleSaveRecipient}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
};

export default RecipientManagement;
