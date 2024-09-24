import React from 'react';

const UserList = ({ users }) => {
    return (
        <div>
            <h1>User List</h1>
            <ul>
                {users.length === 0 ? (
                    <li>No users found.</li>
                ) : (
                    users.map(user => (
                        <li key={user.id}>{user.name} - {user.email}</li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default UserList;
