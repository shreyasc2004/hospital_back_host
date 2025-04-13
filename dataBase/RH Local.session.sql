-- CREATE DATABASE hospital_db;
USE hospital_db;

CREATE TABLE IF NOT EXISTS patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT,
    gender ENUM('M', 'F', 'Other'),
    address VARCHAR(255)
);

CREATE TABLE LOGIN(
    username VARCHAR(20);
    password VARCHAR(120);
);

    SELECT * FROM patients;
SELECT * FROM LOGIN;
