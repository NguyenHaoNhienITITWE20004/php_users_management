<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

$conn = new mysqli('localhost', 'root', 'Ai@123456', 'my_database');

if ($conn->connect_error) {
    die(json_encode(['error' => 'Database connection failed']));
}

// API endpoint to fetch users
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['endpoint']) && $_GET['endpoint'] === 'users') {
    // Fetch users sorted by ID
    $result = $conn->query("SELECT * FROM users ORDER BY id ASC"); // Ensure users are sorted by ID
    $users = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($users);
}



// // API endpoint to insert a user
// if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['endpoint']) && $_GET['endpoint'] === 'addUser') {
//     $data = json_decode(file_get_contents("php://input"), true);
//     $name = $conn->real_escape_string($data['name']);
//     $email = $conn->real_escape_string($data['email']);

//     $query = "INSERT INTO users (name, email) VALUES ('$name', '$email')";

//     if ($conn->query($query) === TRUE) {
//         echo json_encode(['success' => 'User added successfully', 'id' => $conn->insert_id]);
//     } else {
//         echo json_encode(['error' => 'Failed to add user']);
//     }
// }
// API endpoint to insert a user
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['endpoint']) && $_GET['endpoint'] === 'addUser') {
    $data = json_decode(file_get_contents("php://input"), true);
    $name = $conn->real_escape_string($data['name']);
    $email = $conn->real_escape_string($data['email']);

    // Get the current maximum ID
    $result = $conn->query("SELECT MAX(id) as max_id FROM users");
    $maxIdRow = $result->fetch_assoc();
    $nextId = $maxIdRow['max_id'] ? $maxIdRow['max_id'] + 1 : 1; // Start from 1 if no users

    // Prepare the insert query with the new ID
    $stmt = $conn->prepare("INSERT INTO users (id, name, email) VALUES (?, ?, ?)");
    $stmt->bind_param("iss", $nextId, $name, $email);

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode(['success' => 'User added successfully', 'id' => $nextId]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to add user: ' . $stmt->error]);
    }
    
    $stmt->close();
}



// Update User (PUT Method)

if ($_SERVER['REQUEST_METHOD'] === 'PUT' && isset($_GET['endpoint']) && $_GET['endpoint'] === 'updateUser') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $conn->real_escape_string($data['id']);
    $name = $conn->real_escape_string($data['name']);
    $email = $conn->real_escape_string($data['email']);

    if (empty($id) || empty($name) || empty($email)) {
        echo json_encode(['error' => 'ID, Name, and Email are required']);
        exit;
    }

    $stmt = $conn->prepare("UPDATE users SET name = ?, email = ? WHERE id = ?");
    $stmt->bind_param("ssi", $name, $email, $id);

    if ($stmt->execute()) {
        echo json_encode(['success' => 'User updated successfully']);
    } else {
        echo json_encode(['error' => 'Failed to update user']);
    }

    $stmt->close();
}

// Delete User (DELETE Method)
if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && isset($_GET['endpoint']) && $_GET['endpoint'] === 'deleteUser') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $conn->real_escape_string($data['id']);

    if (empty($id)) {
        http_response_code(400);
        echo json_encode(['error' => 'ID is required']);
        exit;
    }

    // Start a transaction
    $conn->begin_transaction();

    try {
        // Delete the user
        $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            // Reset IDs
            $conn->query("SET @count = 0");
            $conn->query("UPDATE users SET id = (@count := @count + 1) ORDER BY id");

            // Reset AUTO_INCREMENT to maintain the correct next ID
            $conn->query("ALTER TABLE users AUTO_INCREMENT = 1");

            echo json_encode(['success' => 'User deleted and IDs reset successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete user: ' . $stmt->error]);
        }

        $stmt->close();
        // Commit the transaction
        $conn->commit();
    } catch (Exception $e) {
        // Rollback in case of an error
        $conn->rollback();
        http_response_code(500);
        echo json_encode(['error' => 'An error occurred: ' . $e->getMessage()]);
    }
    $stmt->close();
}



$conn->close();