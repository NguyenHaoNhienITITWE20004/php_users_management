import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import AddUser from './components/AddUser';
import UpdateUser from './components/UpdateUser';
import DeleteUser from './components/DeleteUser';
import { fetchUsers } from './api'; // Import fetchUsers from api.js
import { Container, Typography, Paper, Box } from '@mui/material';

function App() {
    const [users, setUsers] = useState([]);

    // Fetch users when the component mounts
    // useEffect(() => {
    //     fetchUsers(); // Initial fetch
    // }, []);

    // const fetchUsers = async () => {
    //     try {
    //         const response = await fetch('http://localhost/php_project/backend/index.php?endpoint=users');
    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }
    //         const data = await response.json();
    //         setUsers(data); // Set users state with fetched data
    //     } catch (error) {
    //         console.error('Error fetching users:', error);
    //     }
    // };

        // Fetch users when the component mounts
        useEffect(() => {
            const loadUsers = async () => {
                try {
                    const data = await fetchUsers();
                    setUsers(data); // Set users state with fetched data
                } catch (error) {
                    console.error('Error fetching users:', error);
                }
            };
    
            loadUsers(); // Initial fetch
        }, []);


    const handleUserAdded = (newUser) => {
        setUsers((prevUsers) => [...prevUsers, newUser]);
    };

    const handleUserUpdated = (updatedUser) => {
        setUsers((prevUsers) =>
            prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
        );
    };

    const handleUserDeleted = (id) => {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
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
                <Box display="flex" gap={1}>
                    <UpdateUser userId={params.row.id} onUserUpdated={handleUserUpdated} />
                    <DeleteUser userId={params.row.id} onUserDeleted={handleUserDeleted} />
                </Box>
            ),
        },
    ];

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                User Management
            </Typography>
            <AddUser onUserAdded={handleUserAdded} />

            <Paper elevation={3} sx={{ height: 400, width: '100%', mt: 2 }}>
                <DataGrid rows={users} columns={columns} pageSize={5} checkboxSelection />
            </Paper>
        </Container>
    );
}

export default App;
