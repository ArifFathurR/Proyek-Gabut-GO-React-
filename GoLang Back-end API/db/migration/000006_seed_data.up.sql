-- Password is 'password' (bcrypt hash)
INSERT INTO users (username, password, bio, avatar_url) VALUES 
('admin', '$2a$10$X7V.d3.uj.u./u.u.u.u.u.u.u.u.u.u.u.u.u.u.u.u.u.u.u.', 'I am the admin', '');

INSERT INTO books (title, author, description, user_id, status) VALUES 
('The Go Programming Language', 'Alan A. A. Donovan', 'The authoritative resource for learning Go', 1, 'reading'),
('Clean Code', 'Robert C. Martin', 'A Handbook of Agile Software Craftsmanship', 1, 'completed');
