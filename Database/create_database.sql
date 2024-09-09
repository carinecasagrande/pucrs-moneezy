-- User Database
CREATE SCHEMA `user_service_db`;

CREATE TABLE `user_service_db`.`users` (
    `user_id` INT NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password_hash` VARCHAR(100) NOT NULL,
    `createdAt` DATETIME NOT NULL,
    `updatedAt` DATETIME NOT NULL,
    PRIMARY KEY (`user_id`),
    UNIQUE KEY `email` (`email`)
);

CREATE TABLE `user_service_db`.`password_resets` (
    `reset_id` INT NOT NULL AUTO_INCREMENT,
    `user_id` INT NOT NULL,
    `reset_token` VARCHAR(512) NOT NULL,
    `expires_at` DATETIME NOT NULL,
    `expired_by_use` TINYINT(1) DEFAULT NULL,
    `created_at` DATETIME DEFAULT NULL,
    PRIMARY KEY (`reset_id`),
    KEY `user_id` (`user_id`),
    CONSTRAINT `password_resets_ibfk_1` FOREIGN KEY (`user_id`)
        REFERENCES `users` (`user_id`)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `user_service_db`.`jwt_tokens` (
    `token_id` INT NOT NULL AUTO_INCREMENT,
    `user_id` INT NOT NULL,
    `token` VARCHAR(512) NOT NULL,
    `issued_at` DATETIME DEFAULT NULL,
    `revoked` TINYINT(1) DEFAULT '0',
    `ip_address` VARCHAR(45) DEFAULT NULL,
    `user_agent` VARCHAR(200) DEFAULT NULL,
    PRIMARY KEY (`token_id`),
    KEY `user_id` (`user_id`),
    CONSTRAINT `jwt_tokens_ibfk_1` FOREIGN KEY (`user_id`)
        REFERENCES `users` (`user_id`)
        ON DELETE CASCADE ON UPDATE CASCADE
);