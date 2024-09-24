// src/ManageUser.js
import React, { useState } from 'react';

function ManageUser({ user, onUserUpdated, onUserDeleted }) {
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);

    const handleUpdateUser = async () => {
        const updatedUser = { id: user.id, name, email };

        try {
            const response = await fetch(`http://localhost/php_project/backend/index.php?endpoint=updateUser`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUser),
            });

            const data = await response.json();
            if (response.ok) {
                onUserUpdated(user.id, updatedUser);
                setEditing(false);
            } else {
                console.error('Error updating user:', data.error);
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleDeleteUser = async () => {
        try {
            const response = await fetch(`http://localhost/php_project/backend/index.php?endpoint=deleteUser`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: user.id }),
            });

            const data = await response.json();
            if (response.ok) {
                onUserDeleted(user.id);
            } else {
                console.error('Error deleting user:', data.error);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <tr>
            {editing ? (
                <>
                    <td>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    </td>
                    <td>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </td>
                    <td>
                        <button onClick={handleUpdateUser}>Save</button>
                        <button onClick={() => setEditing(false)}>Cancel</button>
                    </td>
                </>
            ) : (
                <>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                        <button onClick={() => setEditing(true)}>Edit</button>
                        <button onClick={handleDeleteUser}>Delete</button>
                    </td>
                </>
            )}
        </tr>
    );
}

export default ManageUser;
