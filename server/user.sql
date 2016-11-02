-- UP
CREATE TABLE IF NOT EXISTS awhile_users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(32) UNIQUE NOT NULL,
    nickname VARCHAR(32),
    email VARCHAR(128),
    password CHAR(1024) NOT NULL,
    salt CHAR(256) NOT NULL
);

-- DOWN
DROP TABLE awhile_users;
