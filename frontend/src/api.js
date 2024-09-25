const API_URL = 'http://localhost/php_project/backend/index.php?endpoint=';

export const fetchUsers = async () => {
    try {
        const response = await fetch(`${API_URL}users`);
        if (!response.ok) {
            const errorData = await response.text(); // Capture the response body
            throw new Error(`Network response was not ok: ${errorData}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error; // Re-throw to handle it later in your App.js
    }
};


export const updateUser = async (user) => {
    try {
        const response = await fetch(`${API_URL}updateUser`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });
        if (!response.ok) {
            throw new Error('Error updating user');
        }
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

export const deleteUser = async (id) => {
    try {
        const response = await fetch(`${API_URL}deleteUser`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
        });
        if (!response.ok) {
            throw new Error('Error deleting user');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};

// export const addUser = async (user) => {
//     try {
//         const response = await fetch(`${API_URL}addUser`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(user),
//         });
//         if (!response.ok) {
//             throw new Error('Error adding user');
//         }
//     } catch (error) {
//         console.error('Error adding user:', error);
//         throw error;
//     }
// };

export const addUser = async (user) => {
    try {
        const response = await fetch(`${API_URL}addUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });
        if (!response.ok) {
            throw new Error('Error adding user');
        }
        const data = await response.json(); // Ensure you get the response data
        return data; // Return the data (expecting { id, name, email })
    } catch (error) {
        console.error('Error adding user:', error);
        throw error;
    }
};

