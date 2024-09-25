import React, { useState } from 'react';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Box, Typography } from '@mui/material';
import { addUser } from '../api'; // Adjust the import path as needed

function AddUser({ onUserAdded }) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAddUser = async () => {
        if (!name || !email) {
            setError('Both name and email are required.');
            return;
        }

        const newUser = { name, email };
        setLoading(true);
        setError(''); // Reset error state

        try {
            const response = await addUser(newUser); // Call the addUser function from api.js
            onUserAdded({ id: response.id, name, email }); // Assuming response contains the new user data
            setOpen(false); // Close the dialog
            setName(''); // Clear the input fields
            setEmail(''); // Clear the input fields
        } catch (error) {
            setError('Error adding user: ' + error.message);
        } finally {
            setLoading(false);
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
                    <Box display="flex" flexDirection="column" gap={2}>
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
                        {error && (
                            <Typography color="error" variant="body2">
                                {error}
                            </Typography>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddUser} color="primary" disabled={loading}>
                        {loading ? 'Adding...' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default AddUser;
