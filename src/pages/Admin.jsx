import React, { useState, useEffect } from 'react';
import {Toaster, toast } from 'sonner';

const Admin = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('authToken');
            try {
                const response = await fetch('http://localhost:5000/api/users/all', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();

                // Check if data is an array
                if (Array.isArray(data)) {
                    setUsers(data);
                } else {
                    console.error('Expected array but got:', data);
                    setUsers([]);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
                setUsers([]);
            }
        };

        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch(`https://recipe-sharing-backend-one.vercel.app/api/users/delete/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('User deleted successfully');
            if (response.ok) {
                setUsers(users.filter(user => user._id !== id));
            } else {
                console.error('Failed to delete user');
                toast.error('Failed to delete user');

            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <div className=" p-8 mt-16">
                        <Toaster position="top-right" />

            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Admin Dashboard</h2>
            <div className="bg-white shadow-2xl rounded-lg p-6">
                {users.length === 0 ? (
                    <p className="text-gray-500 text-center">No users found.</p>
                ) : (
                    <ul className="divide-y divide-gray-300 ">
                        {users.map(user => (
                            <li key={user._id} className="flex justify-between items-center py-4">
                                <div>
                                    <p className="text-lg font-semibold text-gray-700">{user.name}</p>
                                    <p className="text-gray-500">{user.email}</p>
                                </div>
                                <button
                                    onClick={() => handleDelete(user._id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Admin;
