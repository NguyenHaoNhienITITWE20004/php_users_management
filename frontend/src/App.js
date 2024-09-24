import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import AddUser from './AddUser'; // Assuming this component handles adding users

function App() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editOpen, setEditOpen] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    
// Fetch users when the component mounts
useEffect(() => {
    fetchUsers();
}, []);

const fetchUsers = async () => {
    try {
        const response = await fetch('http://localhost/php_project/backend/index.php?endpoint=users');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUsers(data); // This will now have users sorted by ID
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};


    const handleUserAdded = (newUser) => {
        fetchUsers(); // Re-fetch the user list after adding
    };

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setName(user.name);
        setEmail(user.email);
        setEditOpen(true);
    };

    const handleEditSave = async () => {
        const updatedUser = { id: selectedUser.id, name, email };
        try {
            const response = await fetch(`http://localhost/php_project/backend/index.php?endpoint=updateUser`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUser),
            });

            if (response.ok) {
                setEditOpen(false);
                fetchUsers(); // Re-fetch users after update
            } else {
                console.error('Error updating user');
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleDeleteClick = async (id) => {
        try {
            const response = await fetch(`http://localhost/php_project/backend/index.php?endpoint=deleteUser`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });

            if (response.ok) {
                fetchUsers(); // Re-fetch users after deletion
            } else {
                console.error('Error deleting user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'email', headerName: 'Email', width: 200 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => (
                <>
                    <Button variant="contained" color="primary" onClick={() => handleEditClick(params.row)}>
                        Edit
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDeleteClick(params.row.id)}
                        style={{ marginLeft: 10 }}
                    >
                        Delete
                    </Button>
                </>
            ),
        },
    ];

    return (
        <div className="App">
            <h1>User Management</h1>
            <AddUser onUserAdded={handleUserAdded} />

            <div style={{ height: 400, width: '100%' }}>
                <DataGrid rows={users} columns={columns} pageSize={5} checkboxSelection />
            </div>

            {/* Edit User Dialog */}
            <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
                <DialogTitle>Edit User</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        type="text"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        type="email"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleEditSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default App;
