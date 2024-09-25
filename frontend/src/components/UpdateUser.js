import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Box } from '@mui/material';
import { fetchUsers, updateUser } from '../api'; // Adjust the path if necessary

const UpdateUser = ({ userId, onUserUpdated }) => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    // Fetch user details when the dialog opens
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const users = await fetchUsers(); // Fetch all users
                const currentUser = users.find(u => u.id === userId); // Find the specific user
                if (currentUser) {
                    setName(currentUser.name);
                    setEmail(currentUser.email);
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        if (open) {
            fetchUserDetails();
        }
    }, [open, userId]); // Depend on open and user

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleUpdate = async () => {
        const updatedUser = { id: userId, name, email };

        try {
            await updateUser(updatedUser); // Use the updateUser function from api.js
            onUserUpdated(updatedUser); // Notify parent of updated user
            handleClose(); // Close the dialog
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    return (
        <>
            <Box><Button variant="contained" color="primary" onClick={handleClickOpen}>
                Update
            </Button></Box>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Update User</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        type="text"
                        fullWidth
                        value={name} // Use state value here
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        type="email"
                        fullWidth
                        value={email} // Use state value here
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Cancel</Button>
                    <Button onClick={handleUpdate} color="primary">Update</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default UpdateUser;
