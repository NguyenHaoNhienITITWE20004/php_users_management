CREATE DATABASE my_database;

USE my_database;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE
);
INSERT INTO users (name, email) VALUES ('John Doe', 'john.doe@example.com');
INSERT INTO users (name, email) VALUES ('Jane Smith', 'jane.smith@example.com');
INSERT INTO users (name, email) VALUES ('Alice Johnson', 'alice.johnson@example.com');
INSERT INTO users (name, email) VALUES ('Bob Brown', 'bob.brown@example.com');
DESCRIBE users;

select * from users





TRUNCATE TABLE users;