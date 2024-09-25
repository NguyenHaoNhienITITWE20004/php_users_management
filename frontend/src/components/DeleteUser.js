// DeleteUser.js

import React from 'react';
import { deleteUser } from '../api'; // Import the API function
import { Button, Snackbar, Box } from '@mui/material';

function DeleteUser({ userId, onUserDeleted }) {
    const [openSnackbar, setOpenSnackbar] = React.useState(false);

    const handleDeleteUser = async () => {
        try {
            await deleteUser(userId); // Call the API function
            onUserDeleted(userId); // Notify the parent component
            setOpenSnackbar(true); // Open snackbar for confirmation
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <Box>
            <Button variant="contained" color="secondary" onClick={handleDeleteUser}>
                Delete
            </Button>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                message="User deleted successfully"
            />
        </Box>
    );
}

export default DeleteUser;
