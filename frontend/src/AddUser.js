import React, { useState } from 'react';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

function AddUser({ onUserAdded }) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleAddUser = async () => {
        const newUser = { name, email };
        try {
            const response = await fetch('http://localhost/php_project/backend/index.php?endpoint=addUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });

            const data = await response.json();
            if (response.ok) {
                setOpen(false);
                onUserAdded(data.id, newUser); // Notify parent to refresh user list
            } else {
                console.error('Error adding user:', data.error);
            }
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    return (
        <>
            <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
                Add User
            </Button>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Add New User</DialogTitle>
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
                    <Button onClick={() => setOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddUser} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default AddUser;
