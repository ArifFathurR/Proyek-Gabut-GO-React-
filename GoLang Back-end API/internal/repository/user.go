package repository

import (
	"database/sql"
	"fmt"

	"github.com/user/book-api/internal/models"
)

type UserRepository struct {
	DB *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{DB: db}
}

func (r *UserRepository) Create(user *models.User) error {
	query := "INSERT INTO users (username, password_hash) VALUES (?, ?)"
	result, err := r.DB.Exec(query, user.Username, user.PasswordHash)
	if err != nil {
		return fmt.Errorf("failed to create user: %w", err)
	}

	id, err := result.LastInsertId()
	if err != nil {
		return fmt.Errorf("failed to get inserted id: %w", err)
	}
	user.ID = int(id)
	return nil
}

func (r *UserRepository) GetByUsername(username string) (*models.User, error) {
	query := "SELECT id, username, password_hash, bio, avatar_url FROM users WHERE username = ?"
	row := r.DB.QueryRow(query, username)

	var user models.User
	var bio, avatarURL sql.NullString
	if err := row.Scan(&user.ID, &user.Username, &user.PasswordHash, &bio, &avatarURL); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil // Or return a specific error
		}
		return nil, fmt.Errorf("failed to get user: %w", err)
	}
	if bio.Valid {
		user.Bio = bio.String
	}
	if avatarURL.Valid {
		user.AvatarURL = avatarURL.String
	}
	return &user, nil
}

func (r *UserRepository) GetByID(id int) (*models.User, error) {
	query := "SELECT id, username, password_hash, bio, avatar_url FROM users WHERE id = ?"
	row := r.DB.QueryRow(query, id)

	var user models.User
	var bio, avatarURL sql.NullString
	if err := row.Scan(&user.ID, &user.Username, &user.PasswordHash, &bio, &avatarURL); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to get user: %w", err)
	}
	if bio.Valid {
		user.Bio = bio.String
	}
	if avatarURL.Valid {
		user.AvatarURL = avatarURL.String
	}
	return &user, nil
}

func (r *UserRepository) Update(user *models.User) error {
	query := "UPDATE users SET bio = ?, avatar_url = ? WHERE id = ?"
	_, err := r.DB.Exec(query, user.Bio, user.AvatarURL, user.ID)
	if err != nil {
		return fmt.Errorf("failed to update user: %w", err)
	}
	return nil
}
