
use dbClinica;

CREATE TABLE client (
    client_id BINARY(16) NOT NULL,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('client', 'admin') NOT NULL,
    must_change_password BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (client_id)
);


CREATE TABLE service (
    service_id CHAR(36) NOT NULL,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(200),
    duration INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (service_id)
);


CREATE TABLE appointment (
    appointment_id CHAR(36) NOT NULL,
    client_id BINARY(16) NOT NULL,
    service_id CHAR(36) NOT NULL,
    appointment_date DATETIME NOT NULL,
    status ENUM('scheduled', 'cancelled') NOT NULL DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (appointment_id),
    
    FOREIGN KEY (client_id) REFERENCES client(client_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    FOREIGN KEY (service_id) REFERENCES service(service_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);